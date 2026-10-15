import React, { useRef, useEffect } from 'react';
import { Search, Bell, Plus, Moon, Sun } from 'lucide-react';
import { useCRMStore } from '../store/useCRMStore';

interface HeaderProps {
  onNewLeadClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewLeadClick }) => {
  const searchQuery = useCRMStore((s) => s.filters.searchQuery);
  const setFilters = useCRMStore((s) => s.setFilters);
  const theme = useCRMStore((s) => s.theme);
  const toggleTheme = useCRMStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-40 px-4 sm:px-6 py-3.5 transition-all backdrop-blur-md border-b ${
        isDark
          ? 'bg-[#0E1526]/90 border-white/[0.08]'
          : 'bg-white/95 border-slate-200 shadow-sm'
      }`}
    >
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo - Vibrant Figma-inspired diamond/cube badge */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div
              className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                isDark ? 'bg-[#0B0F19]' : 'bg-white'
              }`}
            >
              <div className="grid grid-cols-2 gap-1 w-5 h-5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <h1
              className={`text-base font-bold tracking-tight flex items-center gap-1.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <span>Pipeline CRM</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">
                PRO
              </span>
            </h1>
          </div>
        </div>

        {/* Central Search Bar with Ctrl+K shortcut matching Figma */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6">
          <div className="relative group">
            <Search
              className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                isDark ? 'text-slate-400 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'
              }`}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              placeholder="Search leads, owners..."
              className={`w-full pl-11 pr-16 py-2.5 rounded-2xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                isDark
                  ? 'bg-[#172136]/70 hover:bg-[#1a263d]/80 focus:bg-[#1a263d] border border-white/[0.08] focus:border-indigo-500/50 text-slate-100 placeholder-slate-400'
                  : 'bg-slate-100 hover:bg-slate-200/60 focus:bg-white border border-slate-200 focus:border-indigo-500 text-slate-900 placeholder-slate-400 shadow-inner'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <kbd
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border shadow-sm ${
                  isDark
                    ? 'text-slate-400 bg-slate-800/80 border-white/10'
                    : 'text-slate-500 bg-white border-slate-200'
                }`}
              >
                Ctrl+K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Action Tools: Avatar, Full Theme Toggle, Notification, + New Lead */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 flex-shrink-0">
          {/* User Profile Avatar */}
          <div className="relative cursor-pointer group">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="User profile"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition-all shadow-md"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 rounded-full ${
                isDark ? 'border-[#0E1526]' : 'border-white'
              }`}
            />
          </div>

          {/* Full Dark / Light Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
              isDark
                ? 'bg-[#172136]/80 hover:bg-[#1f2d47] border-white/[0.08] text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            {isDark ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </>
            )}
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            aria-label="Notifications"
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors relative ${
              isDark
                ? 'bg-[#172136]/80 hover:bg-[#1f2d47] border-white/[0.08] text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span
              className={`absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ${
                isDark ? 'ring-[#0E1526]' : 'ring-white'
              }`}
            />
          </button>

          {/* + New Lead Action Button */}
          <button
            onClick={onNewLeadClick}
            type="button"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 border border-blue-400/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Lead</span>
          </button>
        </div>
      </div>
    </header>
  );
};
