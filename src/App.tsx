import { useState } from 'react';
import { useCRMStore, selectUniqueOwners, selectMetrics, selectLeadsByStage } from './store/useCRMStore';
import { Lead, StageId } from './types/crm';
import { PIPELINE_STAGES } from './data/mockData';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { KanbanBoard } from './components/KanbanBoard';
import { KanbanCard } from './components/KanbanCard';
import { ActivityHistoryPanel } from './components/ActivityHistoryPanel';
import { LeadModal } from './components/LeadModal';
import { formatCurrency, formatRelativeTime } from './utils/cn';
import { 
  History, 
  ChevronDown, 
  RotateCcw,
  SlidersHorizontal,
  Bell,
  Plus,
  ArrowUpRight,
  ChevronRight,
  MoreHorizontal,
  Moon,
  Sun
} from 'lucide-react';

export default function App() {
  const theme = useCRMStore((s) => s.theme);
  const toggleTheme = useCRMStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  const filters = useCRMStore((s) => s.filters);
  const setFilters = useCRMStore((s) => s.setFilters);
  const resetToDefaultData = useCRMStore((s) => s.resetToDefaultData);
  const owners = useCRMStore(selectUniqueOwners);
  const metrics = useCRMStore(selectMetrics);
  const leadsByStage = useCRMStore(selectLeadsByStage);
  const activityLogs = useCRMStore((s) => s.activityLogs);

  // Activity History drawer state (starts closed by default as requested)
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  // Mobile active stage tab switcher (matching Third Image Figma design)
  const [activeMobileStage, setActiveMobileStage] = useState<StageId>('CONTACTED');

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

  const currentMobileStageConfig = PIPELINE_STAGES.find((s) => s.id === activeMobileStage) || PIPELINE_STAGES[0];
  const currentMobileLeads = leadsByStage[activeMobileStage] || [];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-250 ${
        isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* =========================================================================
          DESKTOP HEADER (Screens md and up)
      ========================================================================= */}
      <div className="hidden md:block">
        <Header onNewLeadClick={() => handleOpenNewLeadModal('NEW')} />
      </div>

      {/* =========================================================================
          MOBILE TOP BAR (Screens < md, matching Third Image Figma Mobile Design)
      ========================================================================= */}
      <div
        className={`block md:hidden border-b px-4 py-3 sticky top-0 z-40 transition-colors ${
          isDark
            ? 'bg-[#0E1526]/95 border-white/[0.08]'
            : 'bg-white/95 border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            <h1
              className={`text-sm font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Sales Pipeline CRM
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle Button (Renamed Dark / Light, no Cards) */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1 ${
                isDark
                  ? 'bg-slate-800/80 border-white/10 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[11px]">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px]">Light</span>
                </>
              )}
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              className={`p-1.5 rounded-xl border relative ${
                isDark
                  ? 'bg-slate-800/80 border-white/10 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN APPLICATION WORKSPACE
      ========================================================================= */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
          
          {/* 1. KPI Metrics Section (Desktop Grid & Mobile Scroll) */}
          <section className="space-y-3">
            {/* Mobile Header for KPI metrics */}
            <div className="flex md:hidden items-center justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                KPI Metrics
              </span>
              <div
                className={`flex items-center space-x-1 text-xs font-semibold ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <span>Scroll</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Desktop 4-grid view */}
            <div className="hidden md:block">
              <MetricCards />
            </div>

            {/* Mobile Horizontal Snap List matching Third Image */}
            <div className="flex md:hidden overflow-x-auto gap-3 pb-2 no-scrollbar snap-x">
              {/* Card 1: Total Leads */}
              <div
                className={`min-w-[160px] flex-shrink-0 snap-start p-4 rounded-2xl border shadow-md relative overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-br from-blue-600/30 to-[#0F172A] border-white/10 text-white'
                    : 'bg-gradient-to-br from-blue-500/15 via-white to-blue-50/40 border-blue-200 text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Total Leads</span>
                  <ArrowUpRight className="w-3 h-3 text-blue-400" />
                </div>
                <div className="mt-2 text-2xl font-extrabold">{metrics.totalLeads}</div>
              </div>

              {/* Card 2: Qualified Leads */}
              <div
                className={`min-w-[160px] flex-shrink-0 snap-start p-4 rounded-2xl border shadow-md relative overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-br from-rose-600/30 to-[#0F172A] border-white/10 text-white'
                    : 'bg-gradient-to-br from-rose-500/15 via-white to-rose-50/40 border-rose-200 text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Qualified</span>
                  <ArrowUpRight className="w-3 h-3 text-amber-400" />
                </div>
                <div className="mt-2 text-2xl font-extrabold">{metrics.qualifiedLeads}</div>
              </div>

              {/* Card 3: Won Deals */}
              <div
                className={`min-w-[160px] flex-shrink-0 snap-start p-4 rounded-2xl border shadow-md relative overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-br from-emerald-600/30 to-[#0F172A] border-white/10 text-white'
                    : 'bg-gradient-to-br from-emerald-500/15 via-white to-emerald-50/40 border-emerald-200 text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Won</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="mt-2 text-2xl font-extrabold">{metrics.wonDeals}</div>
              </div>

              {/* Card 4: Pipeline Value */}
              <div
                className={`min-w-[160px] flex-shrink-0 snap-start p-4 rounded-2xl border shadow-md relative overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-br from-purple-600/30 to-[#0F172A] border-white/10 text-white'
                    : 'bg-gradient-to-br from-purple-500/15 via-white to-purple-50/40 border-purple-200 text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Pipeline</span>
                  <ArrowUpRight className="w-3 h-3 text-purple-400" />
                </div>
                <div className="mt-2 text-2xl font-extrabold">
                  {formatCurrency(metrics.totalPipelineValue)}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Sub-header & Pipeline Filters Toolbar (Desktop only) */}
          <section className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-3">
              <h2
                className={`text-xl sm:text-2xl font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Kanban Pipeline
              </h2>
              <button
                onClick={resetToDefaultData}
                title="Reset to default Figma data"
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/5 border-white/5'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200 border-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop Action Toolbar Matching Figma */}
            <div className="flex items-center space-x-3">
              {/* Owner Filter Dropdown */}
              <div className="relative">
                <select
                  value={filters.selectedOwner}
                  onChange={(e) => setFilters({ selectedOwner: e.target.value })}
                  aria-label="Filter by assigned owner"
                  className={`appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer transition-all shadow-sm ${
                    isDark
                      ? 'bg-[#172136]/90 border border-white/[0.08] hover:border-white/20 text-slate-200'
                      : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
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
                  className={`appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer transition-all shadow-sm ${
                    isDark
                      ? 'bg-[#172136]/90 border border-white/[0.08] hover:border-white/20 text-slate-200'
                      : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
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
                    ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
                    : isDark
                    ? 'bg-[#172136]/90 text-slate-300 border-white/[0.08] hover:bg-[#1e2c47]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span>Activity History</span>
              </button>
            </div>
          </section>

          {/* =========================================================================
              DESKTOP KANBAN BOARD (Full 5 Columns with Colored Top Accent Lines)
          ========================================================================= */}
          <section className="hidden md:block pb-12">
            <KanbanBoard
              onEditLead={handleOpenEditLeadModal}
              onAddLeadToStage={handleOpenNewLeadModal}
            />
          </section>

          {/* =========================================================================
              MOBILE RESPONSIVE PIPELINE (Matching Third Image Figma Design)
          ========================================================================= */}
          <section className="block md:hidden space-y-4 pb-12">
            {/* Horizontal Stage Tabs Bar */}
            <div
              className={`flex overflow-x-auto gap-2 py-1.5 no-scrollbar border-b ${
                isDark ? 'border-white/[0.08]' : 'border-slate-200'
              }`}
            >
              {PIPELINE_STAGES.map((stage) => {
                const stageCount = (leadsByStage[stage.id] || []).length;
                const isActive = activeMobileStage === stage.id;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveMobileStage(stage.id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? isDark
                          ? 'bg-white text-slate-900 shadow-md scale-102'
                          : 'bg-indigo-600 text-white shadow-md'
                        : isDark
                        ? 'text-slate-400 hover:text-white bg-slate-900/40'
                        : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                    }`}
                  >
                    <span>{stage.label}</span>
                    <span className="opacity-80">({stageCount})</span>
                  </button>
                );
              })}
            </div>

            {/* Active Mobile Stage Column Container with Top Accent Color */}
            <div
              style={{ borderTop: `4px solid ${currentMobileStageConfig.color}` }}
              className={`rounded-2xl border p-4 shadow-xl space-y-4 transition-colors ${
                isDark
                  ? 'bg-[#0F172A]/90 border-white/[0.08]'
                  : 'bg-[#F1F5F9] border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <h3
                    className={`font-bold text-sm ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {currentMobileStageConfig.label} ({currentMobileLeads.length})
                  </h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentMobileStageConfig.pillBg}`}
                  >
                    {currentMobileStageConfig.badgeLabel}
                  </span>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>

              {/* Cards List */}
              <div className="space-y-3">
                {currentMobileLeads.length === 0 ? (
                  <div className="h-28 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-xs text-slate-400">
                    No leads in this stage
                  </div>
                ) : (
                  currentMobileLeads.map((lead) => (
                    <KanbanCard
                      key={lead.id}
                      lead={lead}
                      onEdit={handleOpenEditLeadModal}
                    />
                  ))
                )}
              </div>

              {/* Full-width + New Lead Button matching Mobile Figma design */}
              <button
                onClick={() => handleOpenNewLeadModal(activeMobileStage)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 active:scale-98 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Lead</span>
              </button>
            </div>

            {/* Mobile Bottom Activity History Section */}
            <div
              className={`rounded-2xl border p-4 shadow-lg space-y-3 transition-colors ${
                isDark
                  ? 'bg-[#0E1526] border-white/[0.08]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h3
                  className={`text-sm font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Activity History
                </h3>
                <span className="text-xs text-indigo-400 font-semibold">
                  {activityLogs.length} events
                </span>
              </div>

              {/* Timeline nodes */}
              <div className="space-y-4 pt-1">
                {activityLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold truncate ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}
                        >
                          {log.leadName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatRelativeTime(log.timestamp)}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] leading-snug truncate ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* =========================================================================
          SLIDE-OVER ACTIVITY HISTORY DRAWER (Isolated Scroll & Overlay)
      ========================================================================= */}
      {isActivityOpen && (
        <ActivityHistoryPanel onClose={() => setIsActivityOpen(false)} />
      )}

      {/* =========================================================================
          LEAD CREATE / EDIT MODAL
      ========================================================================= */}
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
