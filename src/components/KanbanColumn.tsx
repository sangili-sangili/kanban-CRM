import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead, StageConfig } from '../types/crm';
import { KanbanCard } from './KanbanCard';
import { MoreHorizontal, Plus } from 'lucide-react';

interface KanbanColumnProps {
  stage: StageConfig;
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onAddLeadToStage: (stageId: StageConfig['id']) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  leads,
  onEditLead,
  onAddLeadToStage,
}) => {
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
      className={`
        flex flex-col rounded-2xl bg-[#111927]/90 border transition-all duration-200
        min-w-[270px] w-full min-h-[580px] p-3 shadow-lg
        ${
          isOver
            ? 'border-indigo-500/60 bg-[#162133] ring-1 ring-indigo-500/30'
            : 'border-white/[0.06] hover:border-white/[0.1]'
        }
      `}
    >
      {/* Column Header */}
      <div className="pb-3 mb-2 border-b border-white/[0.06]">
        {/* Stage Name & Pill Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white tracking-tight">{stage.label}</h3>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${stage.pillBg}`}
            >
              {stage.badgeLabel}
            </span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-md transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Lead Count Subtitle */}
        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-400">{leads.length} Leads</span>
          <button
            onClick={() => onAddLeadToStage(stage.id)}
            className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center space-x-1 font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Cards List Container with SortableContext */}
      <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3.5 overflow-y-auto pr-0.5 min-h-[300px]">
          {leads.length === 0 ? (
            <div className="h-32 border-2 border-dashed border-white/[0.06] rounded-xl flex items-center justify-center text-xs text-slate-500">
              Drag leads here
            </div>
          ) : (
            leads.map((lead) => (
              <KanbanCard key={lead.id} lead={lead} onEdit={onEditLead} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};
