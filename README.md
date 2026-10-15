# Enterprise Kanban Sales CRM 🚀

An enterprise-grade, high-performance Mini CRM with an interactive Kanban Sales Pipeline built with **React 18**, **TypeScript** (Strict Mode), **Vite**, **Tailwind CSS**, **Zustand**, and **@dnd-kit**, matching Figma design specifications for both Desktop and Mobile views.

---

## 📸 Overview & Features

### 1. 📊 Interactive Kanban Sales Pipeline
- **5 Pipeline Stages**: `New`, `Contacted`, `Qualified`, `Won`, and `Lost` with color-coded stage top accent lines and count badges.
- **Accessible Drag and Drop**: Smooth drag-and-drop powered by `@dnd-kit` with pointer distance constraints (prevents accidental drags when clicking cards) and cubic-bezier drop transitions.
- **Column Management Dropdown**: Each column header features a functional three-dot (`···`) menu:
  - `+ Add Lead to Stage` (pre-fills the stage in the modal)
  - Sort by Deal Value (High → Low)
  - Sort by Deal Value (Low → High)
  - Sort by Customer Name (A → Z)
  - Sort by Newest First
  - Active sort indicator chips with one-click reset.

### 2. ⚡ Scalability & High Performance (500+ Leads)
- **Zero Page Overflow**: Columns have locked viewport heights (`min-h-[780px] xl:min-h-[840px]`) with dedicated internal card scrolling (`kanban-scrollbar`). The screen never stretches down infinitely regardless of whether a column has 10, 50, or 500+ leads.
- **Memoized Components**: `KanbanCard` is wrapped in `React.memo` to eliminate unnecessary re-renders during drag operations.
- **O(N) Lead Partitioning**: Memoized Zustand selectors partition leads into stage buckets in a single linear pass.

### 3. 🎯 Lead Card Interactions & Details Dossier
- **Card Click**: Clicking anywhere on a card opens the **Lead Details Modal** (read-only dossier view) displaying full deal value, company, email, assigned owner, classifications, and timestamps.
- **Card Options (`···`)**: Independent popover menu with `e.stopPropagation()` for:
  - `View Details` (opens dossier modal)
  - `Edit Lead` (opens edit form modal)
  - `Delete Lead` (confirms deletion and updates store & audit log)
- **Defensive Text Overflow**: Flex containers use `min-w-0 flex-1 truncate` with HTML `title` tooltips, ensuring names and emails up to 45+ characters truncate gracefully without breaking card layouts.

### 4. 🔔 Live Notifications & Activity History
- **Single Source of Truth**: Notifications and the Activity History drawer pull from the exact same live `activityLogs` store.
- **Header Notification Popover**: Real-time unread badge counter, event alerts (Won deals, qualified leads, created leads), "Mark all as read", and a direct link to the Activity History drawer.
- **Activity History Slide-Over Drawer**: Detailed timeline nodes showing customer name, deal value, action description, author, and relative time (`14m ago`).

### 5. 📱 Mobile Responsive Pipeline (< 768px)
- **Stacked Row-by-Row KPI Metrics**: Clean vertical cards displaying Total Leads, Qualified Leads, Won Deals, and Pipeline Value without horizontal clipping or scrollbars.
- **Horizontal Stage Selector Tabs**: Easily switch between stages with active count badges.
- **Mobile Filter & Sort Menu**: Dedicated `···` dropdown in the mobile stage header to filter by sales rep owner, sort by value/name/time, or add a new lead.
- **Scrollable Viewport**: Smooth vertical scroll viewport (`max-h-[660px] overflow-y-auto`) to inspect all leads in any active stage.

### 6. 🌓 Dual Theme System (Dark & Light)
- **Dark Mode**: Sleek obsidian and slate palette (`#0B0F19`, `#0E1526`, `#141E30`) with glassmorphism and ambient gradient backdrops.
- **Light Mode**: High-contrast, enterprise-clean slate palette (`#F8FAFC`, `#F1F5F9`, `#FFFFFF`) with crisp card borders and colored trend indicators.
- **Persistent**: Theme selection is stored in `localStorage` and automatically updates `html.dark` / `html.light` class tokens.

### 7. 💾 Offline-First LocalStorage Persistence
- Built with Zustand's `persist` middleware (`createJSONStorage(() => localStorage)`).
- Pre-seeded with **52 realistic leads** across all 5 stages.
- All additions, edits, stage movements, deletions, activity logs, and filters persist across browser reloads without requiring an external database or backend server.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 18.3](https://react.dev/) |
| **Language** | [TypeScript 5.6](https://www.typescriptlang.org/) (Strict Mode) |
| **Build Tool** | [Vite 5.4](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + PostCSS + Autoprefixer |
| **State Management** | [Zustand 4.5](https://github.com/pmndrs/zustand) with `persist` middleware |
| **Drag & Drop** | [@dnd-kit/core](https://dndkit.com/), `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Utility Libraries** | `clsx`, `tailwind-merge` |

---

## 📂 Project Directory Structure

```text
kanban-CRM/
├── index.html                   # Entry HTML with root container
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript root configuration
├── tsconfig.app.json            # React application TypeScript settings
├── tailwind.config.js           # Tailwind color palettes & design tokens
├── postcss.config.js            # PostCSS configuration
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Root layout (Desktop Kanban & Mobile Pipeline)
│   ├── index.css                # Base Tailwind styles & custom scrollbars
│   ├── components/
│   │   ├── Header.tsx           # Search bar, notifications & profile popovers, theme toggle
│   │   ├── MetricCards.tsx      # Desktop 4-card KPI metric dashboard
│   │   ├── KanbanBoard.tsx      # Drag-and-drop coordinator for columns
│   │   ├── KanbanColumn.tsx     # Stage column, top color track, 3-dot sort menu & scroll
│   │   ├── KanbanCard.tsx       # Memoized lead card with 3-dot actions & text truncation
│   │   ├── LeadDetailsModal.tsx # Read-only lead dossier view modal
│   │   ├── LeadModal.tsx        # Add / Edit lead form modal
│   │   └── ActivityHistoryPanel.tsx # Slide-over activity history drawer
│   ├── data/
│   │   └── mockData.ts          # 52 realistic mock leads & genuine CRM activity logs
│   ├── store/
│   │   └── useCRMStore.ts       # Centralized Zustand store with localStorage persistence
│   ├── types/
│   │   └── crm.ts               # Core TypeScript interfaces & types
│   └── utils/
│       └── cn.ts                # Tailwind merge, currency & time formatting helpers
```

---

## 🚀 Getting Started & Execution Instructions

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm** (`v9.0.0`+) or **yarn** / **pnpm**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/sangili-sangili/kanban-CRM.git
cd kanban-CRM
```

---

### Step 2: Install Dependencies
Install all required project packages:
```bash
npm install
```

---

### Step 3: Run the Development Server
Start the local Vite development server:
```bash
npm run dev
```

Once started, open your browser and navigate to:
```text
http://localhost:5173
```

---

### Step 4: Build for Production
To validate TypeScript types and compile an optimized production bundle:
```bash
npm run build
```
The output will be generated inside the `dist/` directory.

---

### Step 5: Preview the Production Build
To test the production build locally:
```bash
npm run preview
```

---

## ⌨️ Keyboard Shortcuts & Power Features

| Shortcut / Action | Description |
| :--- | :--- |
| **`Ctrl + K` / `Cmd + K`** | Focus the global search bar instantly from anywhere on the page. |
| **Card Click** | Opens the comprehensive **Lead Details Modal** dossier. |
| **Card `···` Menu** | Context menu for `View Details`, `Edit Lead`, or `Delete Lead`. |
| **Column `···` Menu** | Sort column by Deal Value ($$$), Customer Name (A-Z), or Newest, or add a lead. |
| **Theme Button** | Toggle between **Dark** and **Light** modes (auto-synced to `localStorage`). |
| **Notification Bell** | View recent live pipeline actions, mark items as read, or open Activity History. |

---

## 🧠 Technical Decisions & AI Collaboration Note

### Core Technical Decisions

1. **Architecture & State Management (Zustand + LocalStorage)**:
   - **Why Zustand?** Avoided heavy Redux boilerplate and avoided Context API re-render storms. Zustand provides a tiny footprint (~1KB), hook-based ergonomics, and seamless `persist` middleware.
   - **Offline-First Persistence**: With `createJSONStorage(() => localStorage)`, all lead updates, stage movements, audit trails, and theme preferences persist locally across reloads with zero backend overhead.
   - **Fine-Grained Selectors**: Functions like `selectMetrics`, `selectLeadsByStage`, and `selectUniqueOwners` ensure components only re-render when their slice of state changes.

2. **Drag-and-Drop Architecture (@dnd-kit)**:
   - **Why @dnd-kit over react-beautiful-dnd?** `react-beautiful-dnd` is deprecated and has compatibility issues with React 18 strict concurrent rendering. `@dnd-kit` is lightweight, modular, and offers accessible pointer/keyboard sensor support.
   - **Click vs. Drag Disambiguation**: Configured `PointerSensor` with an activation constraint of `distance: 5px`. This guarantees that tapping or clicking cards (or their `···` menu) never triggers accidental drag events.

3. **Performance & Scalability for 500+ Leads**:
   - **Viewport-Bounded Columns**: Rather than letting the document body stretch thousands of pixels down, each column is constrained to `h-[calc(100vh-140px)] min-h-[780px]` with internal `.kanban-scrollbar` scrolling. Column headers and KPI metrics remain pinned in view.
   - **Component Memoization**: `KanbanCard` is wrapped with `React.memo`, preventing unaffected cards from re-rendering during drag-and-drop operations.
   - **Defensive Layout**: Handled long customer names and emails (20+ to 45+ chars) using `min-w-0 flex-1 truncate` with HTML `title` tooltips to prevent flexbox clipping.

4. **Figma-Fidelity Responsive Design**:
   - Implemented custom Tailwind tokens for both Dark Mode (`#0B0F19`, `#0E1526`) and Light Mode (`#F8FAFC`, `#F1F5F9`).
   - Adapted the mobile interface into a tabbed pipeline with stacked row-by-row KPI metrics and an interactive mobile column filter/sort popover.

---

### AI Tools & Agentic Pair Programming

This application was developed in pair programming with **Google Antigravity** (Google DeepMind's Advanced Agentic Coding AI):

- **Architectural Scaffolding & Design Systems**: Formulated the TypeScript data model, Zustand store with optimistic audit logging, and Tailwind color system matching Figma screenshots.
- **Iterative UI Refinement**: Rapidly audited and implemented user-directed enhancements — including dual theme contrast, popover menus, 52-lead dataset expansion, and mobile responsive adaptations.
- **Continuous Quality Assurance**: Executed automated build verifications (`tsc -b && vite build`) and ensured zero lint or type errors at every stage.
- **Git Version Control**: Managed clean atomic commits and remote branch synchronization with GitHub.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

