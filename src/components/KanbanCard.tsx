import React, { useState, useRef, useEffect, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '../types/crm';
import { formatCurrency } from '../utils/cn';
import { useCRMStore } from '../store/useCRMStore';
import { MoreVertical, Eye, Edit3, Trash2 } from 'lucide-react';

interface KanbanCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onViewDetails?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  isOverlay?: boolean;
}

// Color palette mapping for tag chips based on theme
const getTagStyle = (tag: string, isDark: boolean) => {
  const lower = tag.toLowerCase();
  if (isDark) {
    if (lower.includes('new')) {
      return 'bg-sky-500/15 text-sky-300 border border-sky-500/30';
    }
    if (lower.includes('contact')) {
      return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
    }
    if (lower.includes('qualif')) {
      return 'bg-purple-500/15 text-purple-300 border border-purple-500/30';
    }
    if (lower.includes('won')) {
      return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
    }
    if (lower.includes('lost')) {
      return 'bg-rose-500/15 text-rose-300 border border-rose-500/30';
    }
    return 'bg-slate-800/80 text-slate-300 border border-white/10';
  } else {
    if (lower.includes('new')) {
      return 'bg-sky-50 text-sky-700 border border-sky-200/60';
    }
    if (lower.includes('contact')) {
      return 'bg-amber-50 text-amber-700 border border-amber-200/60';
    }
    if (lower.includes('qualif')) {
      return 'bg-purple-50 text-purple-700 border border-purple-200/60';
    }
    if (lower.includes('won')) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
    }
    if (lower.includes('lost')) {
      return 'bg-rose-50 text-rose-700 border border-rose-200/60';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};

// Avatar background generator for initial badges
const getAvatarBg = (name: string) => {
  const colors = [
    'bg-purple-500 text-white',
    'bg-sky-500 text-white',
    'bg-amber-500 text-white',
    'bg-teal-500 text-white',
    'bg-rose-500 text-white',
    'bg-indigo-500 text-white',
  ];
  const charCode = name.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

export const KanbanCard: React.FC<KanbanCardProps> = memo(({
  lead,
  onEdit,
  onViewDetails,
  onDelete,
  isOverlay = false,
}) => {
  const theme = useCRMStore((s) => s.theme);
  const deleteLeadAction = useCRMStore((s) => s.deleteLead);
  const isDark = theme === 'dark';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close card options menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: 'Lead',
      lead,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const initials = lead.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(lead);
    } else if (onEdit) {
      onEdit(lead);
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleViewAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onViewDetails?.(lead);
  };

  const handleEditAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEdit?.(lead);
  };

  const handleDeleteAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (window.confirm(`Delete lead "${lead.name}"?`)) {
      if (onDelete) {
        onDelete(lead.id);
      } else {
        deleteLeadAction(lead.id);
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      className={`
        rounded-2xl p-4 cursor-grab active:cursor-grabbing select-none
        transition-all duration-200 group relative
        ${
          isDark
            ? 'bg-[#141E30] text-white border border-white/[0.08] hover:border-indigo-500/40 hover:bg-[#18253d] shadow-md shadow-black/20'
            : 'bg-white text-slate-900 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-slate-300'
        }
        ${isDragging ? 'opacity-30 ring-2 ring-indigo-500 scale-[0.98]' : ''}
        ${isOverlay ? 'shadow-2xl ring-2 ring-indigo-500/50 rotate-1 cursor-grabbing scale-[1.02]' : ''}
      `}
    >
      {/* Top Header: Avatar + Name (with 20+ char truncation) & Email + Options Menu */}
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
          {lead.avatarUrl ? (
            <img
              src={lead.avatarUrl}
              alt={lead.name}
              className={`w-9 h-9 rounded-full object-cover ring-2 flex-shrink-0 ${
                isDark ? 'ring-slate-700' : 'ring-slate-200'
              }`}
            />
          ) : (
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm ${getAvatarBg(
                lead.name
              )}`}
            >
              {initials}
            </div>
          )}

          {/* Text Container with strict truncation for 20+ character names and emails */}
          <div className="min-w-0 flex-1">
            <h4
              className={`font-bold text-sm leading-snug truncate block w-full transition-colors ${
                isDark
                  ? 'text-white group-hover:text-indigo-400'
                  : 'text-slate-900 group-hover:text-indigo-600'
              }`}
              title={lead.name}
            >
              {lead.name}
            </h4>
            <p
              className="text-[11px] font-medium text-slate-400 truncate block w-full"
              title={lead.email || lead.title || 'facebadge@gmail.com'}
            >
              {lead.email || lead.title || 'facebadge@gmail.com'}
            </p>
          </div>
        </div>

        {/* Three-Dot '···' Menu with Interactive Popover */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={handleMenuClick}
            aria-label="Lead options"
            title="Options"
            className={`p-1 rounded-md transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-white/10'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Options Dropdown Menu */}
          {isMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute right-0 top-full mt-1 w-40 rounded-xl shadow-xl border py-1.5 z-30 transition-all animate-fadeIn ${
                isDark
                  ? 'bg-[#0E1526] border-white/10 text-slate-200 shadow-2xl shadow-black/80'
                  : 'bg-white border-slate-200 text-slate-800 shadow-xl'
              }`}
            >
              <button
                type="button"
                onClick={handleViewAction}
                className={`w-full px-3 py-1.5 text-xs flex items-center space-x-2 font-medium transition-colors ${
                  isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>View Details</span>
              </button>

              <button
                type="button"
                onClick={handleEditAction}
                className={`w-full px-3 py-1.5 text-xs flex items-center space-x-2 font-medium transition-colors ${
                  isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit Lead</span>
              </button>

              <div className={`my-1 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`} />

              <button
                type="button"
                onClick={handleDeleteAction}
                className="w-full px-3 py-1.5 text-xs flex items-center space-x-2 font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tags Row */}
      <div className="mt-3 flex flex-wrap gap-1.5 items-center">
        {lead.tags && lead.tags.length > 0 ? (
          lead.tags.map((tag, idx) => (
            <span
              key={`${lead.id}-tag-${idx}`}
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${getTagStyle(
                tag,
                isDark
              )}`}
            >
              {tag}
            </span>
          ))
        ) : (
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${getTagStyle(
              lead.stage,
              isDark
            )}`}
          >
            {lead.stage}
          </span>
        )}
      </div>

      {/* Bottom Footer: Owner label + Deal Value */}
      <div
        className={`mt-4 pt-2.5 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-white/[0.08]' : 'border-slate-100'
        }`}
      >
        <span className="text-slate-400 font-medium truncate max-w-[120px]" title={lead.assignedOwner}>
          {lead.assignedOwner || 'Owner'}
        </span>
        <span
          className={`font-extrabold text-sm tracking-tight flex-shrink-0 whitespace-nowrap ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {formatCurrency(lead.dealValue)}
        </span>
      </div>
    </div>
  );
});
