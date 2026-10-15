import { 
  useCRMStore, 
  selectMetrics, 
  selectLeadsByStage,
  selectUniqueOwners 
} from './store/useCRMStore';
import { PIPELINE_STAGES } from './data/mockData';
import { formatCurrency, formatRelativeTime } from './utils/cn';
import { 
  Kanban, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  History, 
  Building2, 
  Mail, 
  UserCircle2, 
  RotateCcw 
} from 'lucide-react';

export default function App() {
  const metrics = useCRMStore(selectMetrics);
  const leadsByStage = useCRMStore(selectLeadsByStage);
  const owners = useCRMStore(selectUniqueOwners);
  const filters = useCRMStore((s) => s.filters);
  const setFilters = useCRMStore((s) => s.setFilters);
  const isActivityDrawerOpen = useCRMStore((s) => s.isActivityDrawerOpen);
  const toggleActivityDrawer = useCRMStore((s) => s.toggleActivityDrawer);
  const activityLogs = useCRMStore((s) => s.activityLogs);
  const resetToDefaultData = useCRMStore((s) => s.resetToDefaultData);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Kanban className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Pipeline CRM
              </h1>
              <p className="text-xs text-slate-400">Enterprise Deal Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={resetToDefaultData}
              title="Reset Mock Data"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors border border-white/5"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleActivityDrawer}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-white/10 transition-colors shadow-sm"
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span>Activity Log</span>
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {activityLogs.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Metric KPI Cards with Figma gradient accents */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Leads */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-blue-600/30 to-blue-900/10 shadow-glass-card relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">Total Leads</span>
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-white tracking-tight">{metrics.totalLeads}</span>
              <span className="ml-2 text-xs text-blue-300/80">Active in funnel</span>
            </div>
          </div>

          {/* Qualified Leads */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-rose-600/30 to-purple-900/10 shadow-glass-card relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">Qualified Leads</span>
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-white tracking-tight">{metrics.qualifiedLeads}</span>
              <span className="ml-2 text-xs text-rose-300/80">High intent deals</span>
            </div>
          </div>

          {/* Won Deals */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-emerald-600/30 to-teal-900/10 shadow-glass-card relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Won Deals</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-white tracking-tight">{metrics.wonDeals}</span>
              <span className="ml-2 text-xs text-emerald-300/80">Closed & signed</span>
            </div>
          </div>

          {/* Pipeline Value */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-purple-600/30 to-indigo-900/10 shadow-glass-card relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">Pipeline Value</span>
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(metrics.totalPipelineValue)}
              </span>
              <span className="ml-2 text-xs text-purple-300/80">Weighted total</span>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              placeholder="Search leads, companies, or emails..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <select
              value={filters.selectedOwner}
              onChange={(e) => setFilters({ selectedOwner: e.target.value })}
              aria-label="Filter by assigned owner"
              className="bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60"
            >
              <option value="ALL">All Owners</option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>

            <select
              value={filters.selectedStage}
              onChange={(e) => setFilters({ selectedStage: e.target.value })}
              aria-label="Filter by pipeline stage"
              className="bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60"
            >
              <option value="ALL">All Stages</option>
              {PIPELINE_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Kanban Board Columns */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = leadsByStage[stage.id] || [];
            const stageTotalValue = stageLeads.reduce((acc, curr) => acc + curr.dealValue, 0);

            return (
              <div
                key={stage.id}
                className="bg-slate-900/40 rounded-2xl border border-white/5 flex flex-col p-3 min-h-[540px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h3 className="font-semibold text-sm text-slate-200">{stage.label}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium border border-white/5">
                      {stageLeads.length}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-medium text-slate-500 mb-3 px-1">
                  Subtotal: <span className="text-slate-300">{formatCurrency(stageTotalValue)}</span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {stageLeads.length === 0 ? (
                    <div className="h-32 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-xs text-slate-500">
                      No leads in this stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="glass-card glass-card-hover rounded-xl p-3.5 border border-white/10 cursor-pointer shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-sm text-slate-100 leading-snug">{lead.name}</h4>
                          <span className="text-xs font-bold text-emerald-400">
                            {formatCurrency(lead.dealValue)}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-400">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate">{lead.company}</span>
                        </div>

                        <div className="mt-1 flex items-center space-x-1.5 text-xs text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate">{lead.email}</span>
                        </div>

                        <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1.5">
                            {lead.avatarUrl ? (
                              <img
                                src={lead.avatarUrl}
                                alt={lead.assignedOwner}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
                              />
                            ) : (
                              <UserCircle2 className="w-5 h-5 text-slate-400" />
                            )}
                            <span className="text-slate-300 text-xs font-medium">{lead.assignedOwner}</span>
                          </div>
                          <span className="text-[11px] text-slate-500">{formatRelativeTime(lead.updatedAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Activity Log Drawer */}
      {isActivityDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={toggleActivityDrawer}
          />
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-[#0F172A] border-l border-white/10 shadow-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">Activity Audit Trail</h2>
                </div>
                <button
                  onClick={toggleActivityDrawer}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-slate-800/40 border border-white/5 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{log.leadName}</span>
                      <span className="text-slate-500">{formatRelativeTime(log.timestamp)}</span>
                    </div>
                    <p className="text-slate-300">{log.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Action: <span className="text-indigo-400 font-medium">{log.action}</span></span>
                      <span>By: <span className="text-slate-400">{log.author}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
