import React from 'react';
import { useCRMStore } from '../store/useCRMStore';
import { formatRelativeTime } from '../utils/cn';
import { 
  X, 
  Check, 
  Plus, 
  Edit3, 
  ArrowRight, 
  Sparkles, 
  CircleDot 
} from 'lucide-react';

interface ActivityHistoryPanelProps {
  onClose?: () => void;
}

// Node colors matching the Figma activity sidebar
const getNodeIcon = (action: string, badgeColor?: string) => {
  if (badgeColor === 'teal' || action === 'CREATED') {
    return {
      bg: 'bg-teal-500 text-white shadow-teal-500/30',
      icon: <Plus className="w-3 h-3 stroke-[2.5]" />,
    };
  }
  if (badgeColor === 'emerald' || action === 'STAGE_CHANGED') {
    return {
      bg: 'bg-emerald-500 text-white shadow-emerald-500/30',
      icon: <Check className="w-3 h-3 stroke-[2.5]" />,
    };
  }
  if (badgeColor === 'blue') {
    return {
      bg: 'bg-blue-500 text-white shadow-blue-500/30',
      icon: <ArrowRight className="w-3 h-3 stroke-[2.5]" />,
    };
  }
  if (badgeColor === 'orange') {
    return {
      bg: 'bg-amber-500 text-white shadow-amber-500/30',
      icon: <Edit3 className="w-3 h-3 stroke-[2.5]" />,
    };
  }
  if (badgeColor === 'violet') {
    return {
      bg: 'bg-purple-500 text-white shadow-purple-500/30',
      icon: <Sparkles className="w-3 h-3 stroke-[2.5]" />,
    };
  }
  return {
    bg: 'bg-rose-500 text-white shadow-rose-500/30',
    icon: <CircleDot className="w-3 h-3 stroke-[2.5]" />,
  };
};

export const ActivityHistoryPanel: React.FC<ActivityHistoryPanelProps> = ({ onClose }) => {
  const activityLogs = useCRMStore((s) => s.activityLogs);
  const theme = useCRMStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Semi-transparent backdrop - click to dismiss */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div
          className={`w-screen max-w-sm sm:max-w-md shadow-2xl flex flex-col h-full pointer-events-auto border-l transition-colors ${
            isDark
              ? 'bg-[#0E1526] border-white/[0.08] text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Fixed Drawer Header */}
          <div
            className={`flex items-center justify-between p-5 border-b flex-shrink-0 ${
              isDark
                ? 'bg-[#0E1526] border-white/[0.08]'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <h3
                className={`text-base font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Activity History
              </h3>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isDark
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}
              >
                {activityLogs.length}
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                aria-label="Close activity history"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Timeline entries with ISOLATED scrolling */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 relative overscroll-contain">
            {/* Continuous vertical connecting line */}
            <div
              className={`absolute left-[33px] top-8 bottom-8 w-[2px] pointer-events-none ${
                isDark ? 'bg-slate-800' : 'bg-slate-200'
              }`}
            />

            {activityLogs.map((log) => {
              const { bg, icon } = getNodeIcon(log.action, log.badgeColor);

              return (
                <div key={log.id} className="relative flex items-start space-x-3.5 group">
                  {/* Colored Circular Node */}
                  <div
                    className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ring-4 ${
                      isDark ? 'ring-[#0E1526]' : 'ring-white'
                    } ${bg}`}
                  >
                    {icon}
                  </div>

                  {/* Text details */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4
                        className={`text-xs font-bold truncate ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {log.leadName}
                      </h4>
                      <span
                        className={`text-[10px] font-medium flex-shrink-0 ml-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {formatRelativeTime(log.timestamp)}
                      </span>
                    </div>
                    <p
                      className={`text-xs font-normal leading-snug break-words ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {log.description}
                    </p>
                    {log.author && (
                      <span className="text-[10px] text-slate-400 block mt-1">
                        By {log.author}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
