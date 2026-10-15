import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Moon, 
  Sun, 
  User, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  History,
  FileSpreadsheet
} from 'lucide-react';
import { useCRMStore } from '../store/useCRMStore';

interface HeaderProps {
  onNewLeadClick: () => void;
  onOpenActivity?: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'success' | 'info' | 'alert';
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Closed Enterprise Deal',
    desc: 'Ethan Hunt signed Mission Critical contract for $165,000',
    time: '10m ago',
    type: 'success',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Lead Qualified',
    desc: 'Siela promoted Quantum BioLabs to Qualified stage',
    time: '45m ago',
    type: 'info',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'High-Value Inbound',
    desc: 'NovaSphere Cloud Solutions inquiry logged ($125,000)',
    time: '2h ago',
    type: 'alert',
    read: false,
  },
];

export const Header: React.FC<HeaderProps> = ({ onNewLeadClick, onOpenActivity }) => {
  const searchQuery = useCRMStore((s) => s.filters.searchQuery);
  const setFilters = useCRMStore((s) => s.setFilters);
  const theme = useCRMStore((s) => s.theme);
  const toggleTheme = useCRMStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close notification and profile popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    setToastMessage('Signed out of session. Click anywhere to resume demo.');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

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

        {/* Right Action Tools: Avatar (with dropdown), Full Theme Toggle, Notification (with dropdown), + New Lead */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 flex-shrink-0">
          {/* User Profile Avatar with Interactive Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationOpen(false);
              }}
              aria-label="User profile menu"
              className="relative cursor-pointer group flex items-center focus:outline-none"
            >
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
            </button>

            {/* Profile Menu Popover */}
            {isProfileOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-64 rounded-2xl border shadow-2xl p-2 z-50 animate-fadeIn ${
                  isDark
                    ? 'bg-[#0E1526] border-white/10 text-white shadow-black/80'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* User Header */}
                <div className={`p-3 rounded-xl mb-1 flex items-center space-x-3 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">Sangili Ramalingam</p>
                    <p className="text-[11px] text-slate-400 truncate">sangili@kanban.crm</p>
                    <span className="inline-block mt-0.5 text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400">
                      Lead Architect
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className={`w-full px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors ${
                      isDark ? 'hover:bg-white/5 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className={`w-full px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors ${
                      isDark ? 'hover:bg-white/5 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Pipeline Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className={`w-full px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors ${
                      isDark ? 'hover:bg-white/5 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Export CSV Data</span>
                  </button>

                  <div className={`my-1 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`} />

                  {/* Static Logout Option */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-3 py-2 rounded-lg flex items-center space-x-2.5 text-rose-500 hover:bg-rose-500/10 font-semibold transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
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

          {/* Notification Bell with Interactive Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsProfileOpen(false);
              }}
              aria-label="Notifications"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors relative ${
                isDark
                  ? 'bg-[#172136]/80 hover:bg-[#1f2d47] border-white/[0.08] text-slate-300 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span
                  className={`absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ${
                    isDark ? 'ring-[#0E1526]' : 'ring-white'
                  }`}
                />
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {isNotificationOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl p-4 z-50 animate-fadeIn ${
                  isDark
                    ? 'bg-[#0E1526] border-white/10 text-white shadow-black/80'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* Notification Header */}
                <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-indigo-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs transition-colors flex items-start space-x-3 ${
                        n.read
                          ? isDark
                            ? 'bg-transparent border-transparent opacity-60'
                            : 'bg-transparent border-transparent opacity-60'
                          : isDark
                          ? 'bg-slate-800/40 border-white/5'
                          : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                        {n.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                        {n.type === 'alert' && <ArrowUpRight className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notification Footer: View All Activity */}
                <div className={`pt-3 border-t text-center ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotificationOpen(false);
                      onOpenActivity?.();
                    }}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-center space-x-1.5 w-full py-1 rounded-lg hover:bg-indigo-500/10 transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>View All in Activity History</span>
                  </button>
                </div>
              </div>
            )}
          </div>

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

      {/* Logout Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl border border-white/20 shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </header>
  );
};
