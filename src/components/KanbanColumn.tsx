import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead, StageConfig } from '../types/crm';
import { KanbanCard } from './KanbanCard';
import { useCRMStore } from '../store/useCRMStore';
import { MoreHorizontal } from 'lucide-react';

interface KanbanColumnProps {
  stage: StageConfig;
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
  onDeleteLead?: (leadId: string) => void;
  onAddLeadToStage: (stageId: StageConfig['id']) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  leads,
  onEditLead,
  onViewDetails,
  onDeleteLead,
}) => {
  const theme = useCRMStore((s) => s.theme);
  const isDark = theme === 'dark';

  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: {
      type: 'Column',
      stage,
    },
  });

  const leadIds = leads.map((l) => l.id);

  return (
    <div
      ref={setNodeRef}
      style={{
        borderTop: `4px solid ${stage.color}`,
      }}
      className={`
        flex flex-col rounded-2xl border transition-all duration-200
        min-w-[270px] w-full min-h-[580px] p-3.5 shadow-lg
        ${
          isDark
            ? isOver
              ? 'border-indigo-500/60 bg-[#162133] ring-1 ring-indigo-500/30'
              : 'border-white/[0.08] bg-[#0F172A]/90 hover:border-white/[0.14]'
            : isOver
            ? 'border-indigo-400 bg-indigo-50/50 ring-1 ring-indigo-300'
            : 'border-slate-200/90 bg-[#F1F5F9] hover:border-slate-300 shadow-sm'
        }
      `}
    >
      {/* Column Header */}
      <div
        className={`pb-3 mb-2 border-b ${
          isDark ? 'border-white/[0.06]' : 'border-slate-200'
        }`}
      >
        {/* Stage Name & Pill Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3
              className={`text-base font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {stage.label}
            </h3>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${stage.pillBg}`}
            >
              {stage.badgeLabel}
            </span>
          </div>
          <button
            type="button"
            className={`p-1 rounded-md transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Lead Count Subtitle */}
        <div className="mt-1 flex items-center justify-between text-xs">
          <span
            className={`font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {leads.length} Leads
          </span>
        </div>
      </div>

      {/* Cards List Container with SortableContext */}
      <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3.5 overflow-y-auto pr-0.5 min-h-[300px]">
          {leads.length === 0 ? (
            <div
              className={`h-32 border-2 border-dashed rounded-xl flex items-center justify-center text-xs ${
                isDark
                  ? 'border-white/[0.06] text-slate-500'
                  : 'border-slate-300 text-slate-400'
              }`}
            >
              No leads in this stage
            </div>
          ) : (
            leads.map((lead) => (
              <KanbanCard
                key={lead.id}
                lead={lead}
                onEdit={onEditLead}
                onViewDetails={onViewDetails}
                onDelete={onDeleteLead}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};
