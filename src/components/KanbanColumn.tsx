import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead, StageConfig } from '../types/crm';
import { KanbanCard } from './KanbanCard';
import { useCRMStore } from '../store/useCRMStore';
import { 
  MoreHorizontal, 
  Plus, 
  ArrowDownWideNarrow, 
  ArrowUpNarrowWide, 
  SortAsc, 
  Clock, 
  RotateCcw,
  Check
} from 'lucide-react';

interface KanbanColumnProps {
  stage: StageConfig;
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
  onDeleteLead?: (leadId: string) => void;
  onAddLeadToStage: (stageId: StageConfig['id']) => void;
}

type SortMode = 'DEFAULT' | 'VALUE_DESC' | 'VALUE_ASC' | 'NAME_ASC' | 'NEWEST';

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  leads,
  onEditLead,
  onViewDetails,
  onDeleteLead,
  onAddLeadToStage,
}) => {
  const theme = useCRMStore((s) => s.theme);
  const isDark = theme === 'dark';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('DEFAULT');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu on outside click
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

  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: {
      type: 'Column',
      stage,
    },
  });

  // Reorder leads according to active sort mode
  const sortedLeads = useMemo(() => {
    if (sortMode === 'DEFAULT') return leads;
    const copy = [...leads];
    switch (sortMode) {
      case 'VALUE_DESC':
        return copy.sort((a, b) => b.dealValue - a.dealValue);
      case 'VALUE_ASC':
        return copy.sort((a, b) => a.dealValue - b.dealValue);
      case 'NAME_ASC':
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case 'NEWEST':
        return copy.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      default:
        return copy;
    }
  }, [leads, sortMode]);

  const leadIds = sortedLeads.map((l) => l.id);

  const handleAddLead = () => {
    setIsMenuOpen(false);
    onAddLeadToStage(stage.id);
  };

  const handleSelectSort = (mode: SortMode) => {
    setSortMode(mode);
    setIsMenuOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        borderTop: `4px solid ${stage.color}`,
      }}
      className={`
        flex flex-col rounded-2xl border transition-all duration-200
        min-w-[270px] w-full min-h-[780px] xl:min-h-[840px] 2xl:min-h-[900px] h-[calc(100vh-140px)] max-h-[1050px] p-3.5 shadow-lg
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
      {/* Column Header (Fixed at the top of the column) */}
      <div
        className={`pb-3 mb-2 border-b flex-shrink-0 ${
          isDark ? 'border-white/[0.06]' : 'border-slate-200'
        }`}
      >
        {/* Stage Name & Pill Badge & Interactive Options Menu */}
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

          {/* Column Three-Dot Options Button with Interactive Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title={`${stage.label} column options`}
              aria-label={`${stage.label} options`}
              className={`p-1 rounded-md transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
              } ${isMenuOpen ? (isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-900') : ''}`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Column Dropdown Menu */}
            {isMenuOpen && (
              <div
                className={`absolute right-0 top-full mt-1.5 w-52 rounded-xl shadow-2xl border py-1.5 z-40 animate-fadeIn ${
                  isDark
                    ? 'bg-[#0E1526] border-white/10 text-slate-200 shadow-black/80'
                    : 'bg-white border-slate-200 text-slate-800 shadow-xl'
                }`}
              >
                {/* 1. Add Lead Action */}
                <button
                  type="button"
                  onClick={handleAddLead}
                  className={`w-full px-3 py-2 text-xs flex items-center space-x-2 font-semibold transition-colors ${
                    isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400 stroke-[2.5]" />
                  <span>Add Lead to {stage.label}</span>
                </button>

                <div className={`my-1 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`} />

                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Sort Column
                </div>

                {/* 2. Sort: Value High to Low */}
                <button
                  type="button"
                  onClick={() => handleSelectSort('VALUE_DESC')}
                  className={`w-full px-3 py-1.5 text-xs flex items-center justify-between font-medium transition-colors ${
                    isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ArrowDownWideNarrow className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Value (High → Low)</span>
                  </div>
                  {sortMode === 'VALUE_DESC' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>

                {/* 3. Sort: Value Low to High */}
                <button
                  type="button"
                  onClick={() => handleSelectSort('VALUE_ASC')}
                  className={`w-full px-3 py-1.5 text-xs flex items-center justify-between font-medium transition-colors ${
                    isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ArrowUpNarrowWide className="w-3.5 h-3.5 text-amber-400" />
                    <span>Value (Low → High)</span>
                  </div>
                  {sortMode === 'VALUE_ASC' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>

                {/* 4. Sort: Name A to Z */}
                <button
                  type="button"
                  onClick={() => handleSelectSort('NAME_ASC')}
                  className={`w-full px-3 py-1.5 text-xs flex items-center justify-between font-medium transition-colors ${
                    isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-3.5 h-3.5 text-blue-400" />
                    <span>Name (A → Z)</span>
                  </div>
                  {sortMode === 'NAME_ASC' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>

                {/* 5. Sort: Newest */}
                <button
                  type="button"
                  onClick={() => handleSelectSort('NEWEST')}
                  className={`w-full px-3 py-1.5 text-xs flex items-center justify-between font-medium transition-colors ${
                    isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Newest First</span>
                  </div>
                  {sortMode === 'NEWEST' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>

                {/* Reset Sort */}
                {sortMode !== 'DEFAULT' && (
                  <>
                    <div className={`my-1 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`} />
                    <button
                      type="button"
                      onClick={() => handleSelectSort('DEFAULT')}
                      className="w-full px-3 py-1.5 text-xs flex items-center space-x-2 font-medium text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Order</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lead Count Subtitle & Active Sort Badge */}
        <div className="mt-1 flex items-center justify-between text-xs">
          <span
            className={`font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {sortedLeads.length} Leads
          </span>

          {sortMode !== 'DEFAULT' && (
            <button
              onClick={() => setSortMode('DEFAULT')}
              title="Click to reset sorting"
              className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>
                {sortMode === 'VALUE_DESC' && 'Value ↓'}
                {sortMode === 'VALUE_ASC' && 'Value ↑'}
                {sortMode === 'NAME_ASC' && 'A-Z'}
                {sortMode === 'NEWEST' && 'Newest'}
              </span>
              <span>×</span>
            </button>
          )}
        </div>
      </div>

      {/* Cards List Container with Independent Internal Scrolling (Supports 500+ leads without outer page scrolling) */}
      <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 min-h-0 space-y-3.5 overflow-y-auto pr-1 kanban-scrollbar">
          {sortedLeads.length === 0 ? (
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
            sortedLeads.map((lead) => (
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
