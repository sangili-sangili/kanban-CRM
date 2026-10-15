import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '../types/crm';
import { formatCurrency } from '../utils/cn';
import { MoreVertical } from 'lucide-react';

interface KanbanCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  isOverlay?: boolean;
}

// Color palette mapping for tag chips matching Figma design
const getTagStyle = (tag: string) => {
  const lower = tag.toLowerCase();
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
};

// Avatar background generator for initial badges (HI, IG, OM, etc.)
const getAvatarBg = (name: string) => {
  const colors = [
    'bg-purple-400 text-white',
    'bg-sky-400 text-white',
    'bg-amber-400 text-white',
    'bg-teal-400 text-white',
    'bg-rose-400 text-white',
    'bg-indigo-400 text-white',
  ];
  const charCode = name.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ lead, onEdit, isOverlay = false }) => {
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

  // Pure card presentation component
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit?.(lead)}
      className={`
        bg-white text-slate-900 rounded-2xl p-4 cursor-grab active:cursor-grabbing select-none
        border border-slate-100/90 shadow-sm transition-all duration-200
        hover:shadow-md hover:border-slate-200 group relative
        ${isDragging ? 'opacity-30 ring-2 ring-indigo-500 scale-[0.98]' : ''}
        ${isOverlay ? 'shadow-2xl ring-2 ring-indigo-500/50 rotate-1 cursor-grabbing scale-[1.02]' : ''}
      `}
    >
      {/* Top Header: Avatar + Name & Face Badge + More Options */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          {lead.avatarUrl ? (
            <img
              src={lead.avatarUrl}
              alt={lead.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
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

          <div>
            <h4 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
              {lead.name}
            </h4>
            <p className="text-[11px] font-medium text-slate-400">
              {lead.title || 'Face Badge'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(lead);
          }}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Tags Row matching Figma design */}
      <div className="mt-3 flex flex-wrap gap-1.5 items-center">
        {lead.tags && lead.tags.length > 0 ? (
          lead.tags.map((tag, idx) => (
            <span
              key={`${lead.id}-tag-${idx}`}
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${getTagStyle(
                tag
              )}`}
            >
              {tag}
            </span>
          ))
        ) : (
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${getTagStyle(
              lead.stage
            )}`}
          >
            {lead.stage}
          </span>
        )}
      </div>

      {/* Bottom Footer: Owner label + Deal Value */}
      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Owner</span>
        <span className="font-extrabold text-sm text-slate-900 tracking-tight">
          {formatCurrency(lead.dealValue)}
        </span>
      </div>
    </div>
  );
};
