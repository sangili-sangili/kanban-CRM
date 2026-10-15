import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Lead, ActivityLog, CRMFilterState, StageId, PipelineMetrics } from '../types/crm';
import { INITIAL_LEADS, INITIAL_ACTIVITY_LOGS } from '../data/mockData';

/**
 * State definitions for the Kanban CRM store.
 */
export interface CRMStoreState {
  leads: Lead[];
  activityLogs: ActivityLog[];
  filters: CRMFilterState;
  selectedLeadId: string | null;
  isLeadModalOpen: boolean;
  isActivityDrawerOpen: boolean;
  theme: 'dark' | 'light';
}

/**
 * Action dispatchers for CRM state manipulation and audit logging.
 */
export interface CRMStoreActions {
  // Lead Operations
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>) => void;
  moveLead: (leadId: string, targetStage: StageId, authorName?: string) => void;
  deleteLead: (id: string) => void;

  // Filter Operations
  setFilters: (filters: Partial<CRMFilterState>) => void;
  resetFilters: () => void;

  // UI Modal / Drawer Controls
  openLeadModal: (leadId?: string) => void;
  closeLeadModal: () => void;
  toggleActivityDrawer: () => void;
  setActivityDrawerOpen: (isOpen: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Reset / Seeding
  resetToDefaultData: () => void;
}

export type CRMStore = CRMStoreState & CRMStoreActions;

const initialFilters: CRMFilterState = {
  searchQuery: '',
  selectedOwner: 'ALL',
  selectedStage: 'ALL',
};

/**
 * Production-ready Zustand CRM Store with localStorage persistence and optimistic audit logging.
 */
export const useCRMStore = create<CRMStore>()(
  persist(
    (set, get) => ({
      // State
      leads: INITIAL_LEADS,
      activityLogs: INITIAL_ACTIVITY_LOGS,
      filters: initialFilters,
      selectedLeadId: null,
      isLeadModalOpen: false,
      isActivityDrawerOpen: false,
      theme: 'dark',

      // Actions
      addLead: (leadInput) => {
        const now = new Date().toISOString();
        const newLead: Lead = {
          ...leadInput,
          id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          createdAt: now,
          updatedAt: now,
        };

        const newLog: ActivityLog = {
          id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          leadId: newLead.id,
          leadName: newLead.name,
          action: 'CREATED',
          description: `Created new lead at ${newLead.company} valued at $${newLead.dealValue.toLocaleString()} in stage [${newLead.stage}]`,
          timestamp: now,
          author: newLead.assignedOwner || 'System',
        };

        set((state) => ({
          leads: [newLead, ...state.leads],
          activityLogs: [newLog, ...state.activityLogs],
        }));

        return newLead;
      },

      updateLead: (id, updates) => {
        const lead = get().leads.find((l) => l.id === id);
        if (!lead) return;

        const now = new Date().toISOString();
        const updatedLead: Lead = {
          ...lead,
          ...updates,
          updatedAt: now,
        };

        const newLog: ActivityLog = {
          id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          leadId: lead.id,
          leadName: updatedLead.name,
          action: 'UPDATED',
          description: `Updated lead details (${Object.keys(updates).join(', ')})`,
          timestamp: now,
          author: updatedLead.assignedOwner || 'System',
        };

        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? updatedLead : l)),
          activityLogs: [newLog, ...state.activityLogs],
        }));
      },

      moveLead: (leadId, targetStage, authorName) => {
        const lead = get().leads.find((l) => l.id === leadId);
        if (!lead) return;
        if (lead.stage === targetStage) return;

        const oldStage = lead.stage;
        const now = new Date().toISOString();
        const author = authorName || lead.assignedOwner || 'System';

        const updatedLead: Lead = {
          ...lead,
          stage: targetStage,
          updatedAt: now,
        };

        const newLog: ActivityLog = {
          id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          leadId: lead.id,
          leadName: lead.name,
          action: 'STAGE_CHANGED',
          description: `Moved from [${oldStage}] to [${targetStage}] by ${author}`,
          timestamp: now,
          author,
        };

        // Optimistic UI state update
        set((state) => ({
          leads: state.leads.map((l) => (l.id === leadId ? updatedLead : l)),
          activityLogs: [newLog, ...state.activityLogs],
        }));
      },

      deleteLead: (id) => {
        const lead = get().leads.find((l) => l.id === id);
        if (!lead) return;

        const now = new Date().toISOString();
        const newLog: ActivityLog = {
          id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          leadId: lead.id,
          leadName: lead.name,
          action: 'DELETED',
          description: `Deleted lead ${lead.name} (${lead.company}) from pipeline`,
          timestamp: now,
          author: lead.assignedOwner || 'System',
        };

        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
          activityLogs: [newLog, ...state.activityLogs],
          selectedLeadId: state.selectedLeadId === id ? null : state.selectedLeadId,
          isLeadModalOpen: state.selectedLeadId === id ? false : state.isLeadModalOpen,
        }));
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      resetFilters: () => {
        set({ filters: initialFilters });
      },

      openLeadModal: (leadId) => {
        set({
          selectedLeadId: leadId ?? null,
          isLeadModalOpen: true,
        });
      },

      closeLeadModal: () => {
        set({
          selectedLeadId: null,
          isLeadModalOpen: false,
        });
      },

      toggleActivityDrawer: () => {
        set((state) => ({
          isActivityDrawerOpen: !state.isActivityDrawerOpen,
        }));
      },

      setActivityDrawerOpen: (isOpen) => {
        set({ isActivityDrawerOpen: isOpen });
      },

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(nextTheme);
        }
        set({ theme: nextTheme });
      },

      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(theme);
        }
        set({ theme });
      },

      resetToDefaultData: () => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
        }
        set({
          leads: INITIAL_LEADS,
          activityLogs: INITIAL_ACTIVITY_LOGS,
          filters: initialFilters,
          selectedLeadId: null,
          isLeadModalOpen: false,
          isActivityDrawerOpen: false,
          theme: 'dark',
        });
      },
    }),
    {
      name: 'kanban-crm-storage-v2',
      storage: createJSONStorage(() => localStorage),
      // Persist leads, activity logs, and theme; reset transient UI modals
      partialize: (state) => ({
        leads: state.leads,
        activityLogs: state.activityLogs,
        filters: state.filters,
        theme: state.theme,
      }),
      // Fallback hydration guard: sync HTML class and seed mock data if empty
      onRehydrateStorage: () => (state) => {
        const currentTheme = state?.theme || 'dark';
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(currentTheme);
        }
        if (!state || !state.leads || state.leads.length === 0) {
          useCRMStore.setState({
            leads: INITIAL_LEADS,
            activityLogs: INITIAL_ACTIVITY_LOGS,
          });
        }
      },
    }
  )
);

// ==========================================
// Selectors for High-Performance Memoization
// ==========================================

/**
 * Computes high-level KPI metrics across the pipeline.
 */
export const selectMetrics = (state: CRMStore): PipelineMetrics => {
  const { leads } = state;
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((l) => l.stage === 'QUALIFIED').length;
  const wonDeals = leads.filter((l) => l.stage === 'WON').length;
  // Total pipeline active value (excluding lost deals)
  const totalPipelineValue = leads
    .filter((l) => l.stage !== 'LOST')
    .reduce((sum, lead) => sum + lead.dealValue, 0);

  return {
    totalLeads,
    qualifiedLeads,
    wonDeals,
    totalPipelineValue,
  };
};

/**
 * Filters leads according to multi-field search and ownership criteria.
 */
export const selectFilteredLeads = (state: CRMStore): Lead[] => {
  const { leads, filters } = state;
  const query = filters.searchQuery.trim().toLowerCase();
  const owner = filters.selectedOwner;
  const stage = filters.selectedStage;

  return leads.filter((lead) => {
    // Stage filter
    if (stage !== 'ALL' && lead.stage !== stage) {
      return false;
    }

    // Owner filter
    if (owner !== 'ALL' && lead.assignedOwner.toLowerCase() !== owner.toLowerCase()) {
      return false;
    }

    // Multi-field search query (name, email, company)
    if (query) {
      const matchName = lead.name.toLowerCase().includes(query);
      const matchEmail = lead.email.toLowerCase().includes(query);
      const matchCompany = lead.company.toLowerCase().includes(query);
      if (!matchName && !matchEmail && !matchCompany) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Groups filtered leads by pipeline stage for O(1) column rendering.
 */
export const selectLeadsByStage = (state: CRMStore): Record<StageId, Lead[]> => {
  const filtered = selectFilteredLeads(state);
  const grouped: Record<StageId, Lead[]> = {
    NEW: [],
    CONTACTED: [],
    QUALIFIED: [],
    WON: [],
    LOST: [],
  };

  for (const lead of filtered) {
    if (grouped[lead.stage]) {
      grouped[lead.stage].push(lead);
    }
  }

  return grouped;
};

/**
 * Extracts distinct assigned owners for filter dropdown options.
 */
export const selectUniqueOwners = (state: CRMStore): string[] => {
  const owners = new Set<string>();
  state.leads.forEach((l) => {
    if (l.assignedOwner) owners.add(l.assignedOwner);
  });
  return Array.from(owners).sort();
};
