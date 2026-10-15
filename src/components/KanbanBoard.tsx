import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Lead, StageId } from '../types/crm';
import { PIPELINE_STAGES } from '../data/mockData';
import { useCRMStore, selectLeadsByStage } from '../store/useCRMStore';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
  onEditLead: (lead: Lead) => void;
  onAddLeadToStage: (stageId: StageId) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onEditLead,
  onAddLeadToStage,
}) => {
  const leads = useCRMStore((s) => s.leads);
  const leadsByStage = useCRMStore(selectLeadsByStage);
  const moveLead = useCRMStore((s) => s.moveLead);

  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  // Setup sensors with distance activation constraint so clicking doesn't trigger drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const foundLead = leads.find((l) => l.id === active.id);
    if (foundLead) {
      setActiveLead(foundLead);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Check if dragging over a column directly or over another card
    const isOverAColumn = PIPELINE_STAGES.some((s) => s.id === overId);
    if (isOverAColumn) {
      const targetStage = overId as StageId;
      const currentLead = leads.find((l) => l.id === activeId);
      if (currentLead && currentLead.stage !== targetStage) {
        moveLead(activeId, targetStage);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeLeadItem = leads.find((l) => l.id === activeId);
    if (!activeLeadItem) return;

    // Determine target stage
    let targetStage: StageId | null = null;

    // If dropped onto a column
    if (PIPELINE_STAGES.some((s) => s.id === overId)) {
      targetStage = overId as StageId;
    } else {
      // If dropped onto another card, find that card's stage
      const overLead = leads.find((l) => l.id === overId);
      if (overLead) {
        targetStage = overLead.stage;
      }
    }

    if (targetStage && activeLeadItem.stage !== targetStage) {
      moveLead(activeId, targetStage);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="grid grid-flow-col auto-cols-[285px] xl:grid-flow-row xl:grid-cols-5 gap-4 items-start min-w-[285px]">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = leadsByStage[stage.id] || [];

            return (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                leads={stageLeads}
                onEditLead={onEditLead}
                onAddLeadToStage={onAddLeadToStage}
              />
            );
          })}
        </div>
      </div>

      {/* Drag Overlay matching Figma preview */}
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeLead ? (
          <div className="w-[280px]">
            <KanbanCard lead={activeLead} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
