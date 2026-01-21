import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SectionHeader } from './SectionHeader';
import { SortableItemRow } from './SortableItemRow';
import { GhostItemButton } from './GhostItemButton';
import type { Section, Item } from '../../types/database';

interface SectionCardProps {
  section: Section;
  items: Item[];
  totalSectionCount: number;
  onToggleCollapse: (sectionId: string) => void;
  onAddItem: (sectionId: string, text: string) => void;
  onUpdateItem: (itemId: string, text: string) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleItem: (itemId: string) => void;
  onReorderItems: (sectionId: string, itemIds: string[]) => void;
  onEditSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string, itemCount: number, isLastSection: boolean) => void;
  isFirst?: boolean;
}

export function SectionCard({
  section,
  items,
  totalSectionCount,
  onToggleCollapse,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleItem,
  onReorderItems,
  onEditSection,
  onDeleteSection,
  isFirst = false,
}: SectionCardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        onReorderItems(section.id, newItems.map((item) => item.id));
      }
    }
  };

  const handleAddItem = (text: string) => {
    onAddItem(section.id, text);
  };

  const checkedCount = items.filter((item) => item.checked).length;

  // Sonstiges can only be deleted if it's the last section
  const isSonstiges = section.name === 'Sonstiges';
  const isLastSection = totalSectionCount === 1;
  const canDelete = !isSonstiges || isLastSection;

  return (
    <div>
      <SectionHeader
        title={section.name}
        isCollapsed={section.is_collapsed}
        itemCount={items.length}
        checkedCount={checkedCount}
        onToggleCollapse={() => onToggleCollapse(section.id)}
        onEdit={() => onEditSection(section.id)}
        onDelete={() => onDeleteSection(section.id, items.length, isLastSection)}
        canDelete={canDelete}
        isFirst={isFirst}
      />

      {/* Items List - Only show if not collapsed */}
      {!section.is_collapsed && (
        <div>
          {items.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <SortableItemRow
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    checked={item.checked}
                    onToggle={onToggleItem}
                    onUpdateText={(text) => onUpdateItem(item.id, text)}
                    onDelete={() => onDeleteItem(item.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {/* Ghost Item at the bottom of the section */}
          <GhostItemButton onAdd={handleAddItem} />
        </div>
      )}
    </div>
  );
}
