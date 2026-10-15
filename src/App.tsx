import { useState } from 'react';
import { useCRMStore, selectUniqueOwners } from './store/useCRMStore';
import { Lead, StageId } from './types/crm';
import { PIPELINE_STAGES } from './data/mockData';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { KanbanBoard } from './components/KanbanBoard';
import { ActivityHistoryPanel } from './components/ActivityHistoryPanel';
import { LeadModal } from './components/LeadModal';
import { 
  History, 
  ChevronDown, 
  RotateCcw,
  SlidersHorizontal 
} from 'lucide-react';

export default function App() {
  const filters = useCRMStore((s) => s.filters);
  const setFilters = useCRMStore((s) => s.setFilters);
  const resetToDefaultData = useCRMStore((s) => s.resetToDefaultData);
  const owners = useCRMStore(selectUniqueOwners);

  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    leadId: string | null;
    defaultStageId?: StageId;
  }>({
    isOpen: false,
    leadId: null,
    defaultStageId: 'NEW',
  });

  const handleOpenNewLeadModal = (stageId: StageId = 'NEW') => {
    setModalState({
      isOpen: true,
      leadId: null,
      defaultStageId: stageId,
    });
  };

  const handleOpenEditLeadModal = (lead: Lead) => {
    setModalState({
      isOpen: true,
      leadId: lead.id,
      defaultStageId: lead.stage,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      leadId: null,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Top Navigation Bar */}
      <Header onNewLeadClick={() => handleOpenNewLeadModal('NEW')} />

      {/* 2. Main Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Kanban Board & Metrics Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="max-w-[1720px] mx-auto space-y-6">
            {/* KPI Metric Cards */}
            <section>
              <MetricCards />
            </section>

            {/* Sub-header & Pipeline Filters Toolbar */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Kanban Pipeline
                </h2>
                <button
                  onClick={resetToDefaultData}
                  title="Reset to default Figma data"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Action Toolbar Matching Figma */}
              <div className="flex items-center space-x-3">
                {/* Owner Filter Dropdown */}
                <div className="relative">
                  <select
                    value={filters.selectedOwner}
                    onChange={(e) => setFilters({ selectedOwner: e.target.value })}
                    aria-label="Filter by assigned owner"
                    className="appearance-none pl-3.5 pr-8 py-2 bg-[#172136]/90 border border-white/[0.08] hover:border-white/20 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer transition-all shadow-sm"
                  >
                    <option value="ALL">All Owners</option>
                    {owners.map((owner) => (
                      <option key={owner} value={owner}>
                        {owner}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Stage Filter Dropdown */}
                <div className="relative">
                  <select
                    value={filters.selectedStage}
                    onChange={(e) => setFilters({ selectedStage: e.target.value })}
                    aria-label="Filter by stage"
                    className="appearance-none pl-3.5 pr-8 py-2 bg-[#172136]/90 border border-white/[0.08] hover:border-white/20 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer transition-all shadow-sm"
                  >
                    <option value="ALL">All Stages</option>
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <SlidersHorizontal className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Toggle Activity History Button */}
                <button
                  onClick={() => setIsActivityOpen(!isActivityOpen)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all shadow-sm ${
                    isActivityOpen
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-[#172136]/90 text-slate-300 border-white/[0.08] hover:bg-[#1e2c47]'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Activity History</span>
                </button>
              </div>
            </section>

            {/* Kanban Columns */}
            <section className="pb-12">
              <KanbanBoard
                onEditLead={handleOpenEditLeadModal}
                onAddLeadToStage={handleOpenNewLeadModal}
              />
            </section>

          
          </div>
        </div>
      </div>

      {/* 3. Slide-over Activity History Drawer */}
      {isActivityOpen && (
        <ActivityHistoryPanel onClose={() => setIsActivityOpen(false)} />
      )}

      {/* 4. Lead Create / Edit Modal */}
      {modalState.isOpen && (
        <LeadModal
          leadId={modalState.leadId}
          defaultStageId={modalState.defaultStageId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
