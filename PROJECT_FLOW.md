# Enterprise Kanban CRM — Project Flow & Architecture Document

This document provides a comprehensive end-to-end breakdown of the application architecture, data lifecycle, component hierarchy, user interaction flows, and state management mechanisms for the **Enterprise Kanban CRM**.

---

## 1. High-Level Architecture Overview

The system is built on a unidirectional, reactive client-side architecture with zero backend dependency. State transitions, audit logging, and local persistence occur deterministically through a centralized state machine.

```mermaid
graph TD
    A[Browser Client / User Actions] -->|Drag, Click, Filter, Theme| B[React UI Component Layer]
    B -->|Dispatches Actions| C[Zustand Centralized Store]
    C -->|Calculates Selectors| D[Memoized Selectors: Metrics, Columns, Owners]
    D -->|Reactive Re-render| B
    C -->|Optimistic State Update| E[Audit Logging Engine]
    E -->|Generates Log| C
    C -->|Middleware Serialization| F[LocalStorage: kanban-crm-storage-v3]
    F -->|Rehydration on Mount| C
```

---

## 2. Component Hierarchy Tree

```text
src/
├── main.tsx
└── App.tsx (Root Layout & View Controller)
    ├── Desktop Header (Header.tsx)
    │   ├── Logo & Brand PRO Badge
    │   ├── Global Search Bar (Ctrl+K shortcut)
    │   ├── User Profile Popover (Details, Settings, Static Logout)
    │   ├── Dark / Light Theme Toggle
    │   └── Notification Bell Popover (Live Activity Logs, Unread Badge)
    ├── Mobile Top Bar
    │   ├── User Avatar & App Title
    │   ├── Compact Theme Toggle
    │   └── Activity Drawer Trigger Bell
    ├── KPI Metrics Section
    │   ├── Desktop View: MetricCards.tsx (4-Grid KPI Cards)
    │   └── Mobile View: Stacked Row-by-Row Cards (100% Full-Width)
    ├── Desktop Kanban Pipeline Workspace
    │   ├── Sub-header & Filters Toolbar (Owners Dropdown, Stages Dropdown)
    │   └── KanbanBoard.tsx (DnD Context Coordinator)
    │       ├── DragOverlay Preview (Floating Card Shadow)
    │       └── 5x KanbanColumn.tsx (New, Contacted, Qualified, Won, Lost)
    │           ├── Column Header (Stage Badge, Top Accent Track)
    │           ├── Column Three-Dot (···) Popover (Add Lead, 4 Sort Modes, Reset)
    │           └── SortableContext (KanbanCard.tsx Array)
    │               ├── Avatar / Initials & 20+ Char Truncated Name/Email
    │               ├── Lead Three-Dot (···) Popover (View Details, Edit, Delete)
    │               ├── Stage Tag Chips
    │               └── Owner Name & Formatted Deal Value ($)
    ├── Mobile Responsive Pipeline Workspace
    │   ├── Horizontal Stage Tabs Bar (with count badges)
    │   └── Active Stage Container
    │       ├── Mobile Column Header
    │       ├── Mobile Three-Dot (···) Popover (Owner Filter, Sort Modes, Add Lead)
    │       ├── Active Filter Tag Chips (One-tap clear)
    │       ├── Dedicated Scroll Viewport (max-h-[660px] overflow-y-auto)
    │       └── Full-Width + New Lead Button
    ├── Modals & Drawers
    │   ├── LeadDetailsModal.tsx (Read-only dossier view)
    │   ├── LeadModal.tsx (Create / Edit Lead Form)
    │   └── ActivityHistoryPanel.tsx (Slide-over audit trail drawer)
```

---

## 3. Detailed Data Lifecycle & User Interaction Flows

### Flow 1: Application Bootstrap & Offline Hydration

```mermaid
sequenceDiagram
    autonumber
    participant Browser as Browser Window
    participant Store as useCRMStore (Zustand)
    participant Storage as LocalStorage (v3)
    participant DOM as Document HTML Element
    participant UI as React UI (App.tsx)

    Browser->>Store: Mounts React application
    Store->>Storage: Inspects 'kanban-crm-storage-v3'
    alt Key Exists in LocalStorage
        Storage-->>Store: Returns serialized leads, activityLogs, filters, theme
    else Key Not Found / First Launch
        Store->>Store: Seeds INITIAL_LEADS (52 leads) & INITIAL_ACTIVITY_LOGS
    end
    Store->>DOM: Syncs theme class: document.documentElement.classList.add(theme)
    Store->>UI: Hydrates state, triggers memoized selectors
    UI->>Browser: Renders Desktop / Mobile layout with full data
```

---

### Flow 2: Drag-and-Drop Pipeline Movement

```mermaid
sequenceDiagram
    autonumber
    participant User as Sales Rep
    participant Card as KanbanCard
    participant Board as KanbanBoard (@dnd-kit)
    participant Store as useCRMStore
    participant Notif as Header Notifications & Drawer

    User->>Card: MouseDown / Touch on Card
    Board->>Board: PointerSensor checks distance >= 5px
    Note over Board: Prevents accidental drag if user just intended to click
    Board->>User: Renders DragOverlay floating card preview
    User->>Board: Drags card over Target Column / Card
    Board->>Board: closestCorners collision detection calculates target stage
    User->>Board: Releases drag (DragEndEvent)
    Board->>Store: Dispatches moveLead(activeId, targetStage, author)
    Store->>Store: Updates lead stage & updates timestamp
    Store->>Store: Generates ActivityLog: "Moved deal from [OLD] to [NEW] by [Author]"
    Store->>Notif: Pushes new event to activityLogs & increments unread badge
    Store->>Card: Triggers reactive re-render of source and destination columns
```

---

### Flow 3: Lead Card Interaction (Dossier View vs. Dropdown Actions)

```mermaid
graph TD
    User([User clicks card area]) --> ClickType{Where was the click?}
    
    ClickType -->|Card Body| Dossier[Open LeadDetailsModal]
    Dossier --> ViewFields[View Deal Value, Company, Email, Owner, Tags, Timestamps]
    ViewFields --> Action1[Edit Lead -> Opens LeadModal]
    ViewFields --> Action2[Delete Lead -> Confirms & removes]
    ViewFields --> Action3[Close Modal]

    ClickType -->|Three-Dot Icon ···| Menu[Open Dropdown Popover via e.stopPropagation]
    Menu --> Opt1[1. View Details -> Opens LeadDetailsModal]
    Menu --> Opt2[2. Edit Lead -> Opens LeadModal Form]
    Menu --> Opt3[3. Delete Lead -> Confirmation Dialog -> Store deleteLead]
```

---

### Flow 4: Column Sorting & 500+ Leads Performance Management

```mermaid
graph LR
    A[Column 3-Dot ··· Click] --> B[Open Sort Popover]
    B --> C1[Value: High to Low]
    B --> C2[Value: Low to High]
    B --> C3[Name: A to Z]
    B --> C4[Newest First]
    B --> C5[Reset Sort]

    C1 --> D[useMemo local column sorting]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D

    D --> E[Reordered Card Array rendered]
    E --> F[Container Height Locked: min-h-780px / max-h-1050px]
    F --> G[Internal Scroll: kanban-scrollbar]
    Note[500+ Leads scroll cleanly inside column without outer page stretching]
```

---

### Flow 5: Live Notifications & Activity Audit Trail

1. **Event Trigger**: When any mutation occurs (`moveLead`, `addLead`, `updateLead`, `deleteLead`), an immutable audit log is added to `activityLogs`:
   ```ts
   {
     id: "act-...",
     leadId: "...",
     leadName: "...",
     action: "STAGE_CHANGED" | "CREATED" | "UPDATED" | "DELETED",
     description: "Moved deal from [Contacted] to [Qualified] — Quantum BioLabs ($184,300)",
     timestamp: "2026-10-15T...",
     author: "Siela",
     badgeColor: "blue"
   }
   ```
2. **Synchronized Consumers**:
   - **Header Bell**: Inspects `activityLogs`, checks unread status via local `readLogIds` set, displays unread badge counter (`3 new`).
   - **Activity Drawer**: Opens `ActivityHistoryPanel.tsx`, displaying connecting vertical timeline nodes with relative time stamps (`14m ago`, `1h ago`).
   - **Mobile Bottom Activity**: Displays the top recent events with lead names and descriptions.

---

### Flow 6: Mobile Pipeline Adaptation (< 768px)

1. **KPI Metrics Section**:
   - Replaced horizontal scroll with 4 stacked full-width rows (`grid grid-cols-1 gap-2.5`).
   - Displays **Total Leads**, **Qualified Leads**, **Won Deals**, and **Pipeline Value** with zero clipping.
2. **Stage Tabs**:
   - Tap tab (`New`, `Contacted`, `Qualified`, `Won`, `Lost`) to switch `activeMobileStage`.
3. **Mobile Stage Column Header Dropdown**:
   - Tapping `···` opens popover with **Filter by Owner** (All Owners, Sangili, Siela, etc.) and **4 Sorting Modes**.
   - Active filter chips appear under the header with one-tap dismissal (`×`).
4. **Scroll Viewport**:
   - Configured with `max-h-[660px] overflow-y-auto overscroll-contain` so all leads in that stage can be browsed smoothly.

---

## 4. State Management Contract (`useCRMStore`)

### State Shape
| Property | Type | Description |
| :--- | :--- | :--- |
| `leads` | `Lead[]` | Array of 52+ leads across all stages. |
| `activityLogs` | `ActivityLog[]` | Chronological audit trail of sales pipeline actions. |
| `filters` | `CRMFilterState` | `{ searchQuery, selectedOwner, selectedStage }`. |
| `theme` | `'dark' \| 'light'` | Active theme mode. |
| `selectedLeadId` | `string \| null` | Currently active lead for modals. |
| `isLeadModalOpen` | `boolean` | Add/Edit modal visibility. |
| `isActivityDrawerOpen`| `boolean` | Slide-over drawer visibility. |

### Memoized Selectors
- **`selectMetrics(state)`**: Computes `totalLeads`, `qualifiedLeads`, `wonDeals`, and `totalPipelineValue` (excluding lost deals).
- **`selectLeadsByStage(state)`**: Partitions filtered leads into `{ NEW: Lead[], CONTACTED: Lead[], ... }` in an O(N) pass.
- **`selectUniqueOwners(state)`**: Extracts distinct owner names for filtering dropdowns.

---

## 5. Defensive UX Implementations

1. **20+ to 45+ Character Text Overflow Protection**:
   - Card avatars and names use `min-w-0 flex-1 truncate block w-full` with HTML `title={lead.name}`.
   - Long names like `"Alexander Bartholomew-Montgomery"` and emails like `"alexander.bartholomew@multinational-enterprise.corp"` truncate smoothly without pushing buttons or deal values offscreen.
2. **Sensors Distance Activation Guard**:
   - `@dnd-kit` configured with `activationConstraint: { distance: 5 }`.
   - Prevents click events on cards and menu buttons from being swallowed or triggering unintentional card dragging.
3. **Isolated Scrolling Containers**:
   - `overscroll-contain` applied on both the Activity History drawer and the mobile pipeline viewport to prevent scroll chaining to the outer window.
4. **Theme Contrast Auditing**:
   - Dark mode uses rich obsidian `#0B0F19` with `#141E30` card surfaces and glowing trend pills.
   - Light mode uses high-contrast slate `#F8FAFC` canvas with `#FFFFFF` card surfaces and tailored border definitions.
