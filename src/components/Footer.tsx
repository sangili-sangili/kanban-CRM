import React, { useState } from 'react';
import { useCRMStore, selectMetrics } from '../store/useCRMStore';
import { formatCurrency } from '../utils/cn';
import { 
  Command, 
  Sparkles, 
  Layers,
  X
} from 'lucide-react';

export const Footer: React.FC = () => {
  const metrics = useCRMStore(selectMetrics);
  const theme = useCRMStore((s) => s.theme);
  const isDark = theme === 'dark';

  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  return (
    <footer
      className={`w-full border-t transition-colors duration-200 z-30 relative backdrop-blur-md ${
        isDark
          ? 'bg-[#0A0E1A]/95 border-white/[0.08] text-slate-400'
          : 'bg-white/95 border-slate-200 text-slate-600 shadow-sm'
      }`}
    >
      {/* Top subtle highlight line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main Footer Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left Column: Brand & System Health */}
          <div className="flex items-center space-x-3 flex-wrap justify-center sm:justify-start gap-y-2">
            {/* Logo Mark & Name */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <span className={`font-bold text-xs tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Pipeline CRM PRO
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.4
              </span>
            </div>

            <span className={`hidden sm:inline ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>•</span>

            {/* Live Operational Status */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold text-emerald-500">Systems Operational</span>
            </div>
          </div>

          {/* Center Column: Hotkey Tips */}
          <div className="hidden xl:flex items-center space-x-2 text-xs">
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Shortcuts:</span>
            <button
              onClick={() => setShowShortcutsModal(true)}
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg border text-[11px] font-mono font-medium transition-all ${
                isDark 
                  ? 'bg-slate-800/60 border-white/10 hover:border-indigo-400 text-slate-300' 
                  : 'bg-slate-100 border-slate-200 hover:border-indigo-300 text-slate-700'
              }`}
            >
              <Command className="w-3 h-3 text-indigo-400" />
              <span>Ctrl + K Search</span>
            </button>
            <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>•</span>
            <span className="text-[11px] text-slate-400">Drag deals to update stage</span>
          </div>

          {/* Right Column: Live Metrics Pill */}
          <div className="flex items-center space-x-2.5 flex-wrap justify-center sm:justify-end gap-y-2">
            <div
              className={`px-3 py-1 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 shadow-xs ${
                isDark
                  ? 'bg-slate-800/70 border-white/10 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {metrics.totalLeads} Deals ({formatCurrency(metrics.totalPipelineValue)})
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Sub-row: Tech Stack & Assessment Attribution */}
        <div className={`mt-3 pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] ${
          isDark ? 'border-white/5 text-slate-500' : 'border-slate-100 text-slate-400'
        }`}>
          <div>
            Enterprise Sales Pipeline Kanban CRM
          </div>
          <div className="flex items-center space-x-2">
            <span>Zustand State Engine</span>
            <span>•</span>
            <span>@dnd-kit Drag-and-Drop</span>
            <span>•</span>
            <span>© 2026 Pipeline CRM PRO</span>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 animate-scaleUp ${
              isDark ? 'bg-[#0E1526] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Command className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold">Keyboard Shortcuts & Help</h3>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Global Lead Search</span>
                <kbd className="px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-200 border border-white/10">
                  Ctrl + K / ⌘K
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Drag & Drop Move</span>
                <span className="text-indigo-400 font-medium">Click & drag card across stages</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Persistence</span>
                <span className="text-emerald-400 font-medium">Auto-saves to browser storage</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
