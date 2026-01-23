import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
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
import { ArrowLeft, MoreVertical, Plus } from 'lucide-react';
import { GlassCard, ProgressBar } from '../components/ui';
import {
  SectionCard,
  SectionModal,
  ListModal,
  ListOptionsMenu,
  ResetConfirmModal,
  DeleteSectionModal,
  SortableItemRow,
  GhostItemButton,
} from '../components/features';
import { useStore } from '../store/useStore';

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Heute, ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return 'Gestern';
  } else if (diffDays < 7) {
    return `Vor ${diffDays} Tagen`;
  } else {
    return date.toLocaleDateString('de-DE');
  }
}

export function ListDetail() {
  const navigate = useNavigate();
  const { listId } = useParams<{ listId: string }>();

  // Section modal state
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);
  const [deletingSectionItemCount, setDeletingSectionItemCount] = useState(0);
  const [deletingSectionIsLast, setDeletingSectionIsLast] = useState(false);

  // List modal state
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isListOptionsMenuOpen, setIsListOptionsMenuOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Store - use shallow equality to prevent unnecessary re-renders
  const {
    lists,
    allItems,
    allSections,
    toggleItem,
    addItem,
    updateItem,
    deleteItem,
    updateList,
    deleteList,
    resetListItems,
    addSection,
    updateSection,
    deleteSection,
    deleteSectionMoveItems,
    deleteLastSectionKeepItems,
    toggleSectionCollapse,
    reorderItemsInSection,
    reorderItems,
  } = useStore(
    useShallow((state) => ({
      lists: state.lists,
      allItems: state.items,
      allSections: state.sections,
      toggleItem: state.toggleItem,
      addItem: state.addItem,
      updateItem: state.updateItem,
      deleteItem: state.deleteItem,
      updateList: state.updateList,
      deleteList: state.deleteList,
      resetListItems: state.resetListItems,
      addSection: state.addSection,
      updateSection: state.updateSection,
      deleteSection: state.deleteSection,
      deleteSectionMoveItems: state.deleteSectionMoveItems,
      deleteLastSectionKeepItems: state.deleteLastSectionKeepItems,
      toggleSectionCollapse: state.toggleSectionCollapse,
      reorderItemsInSection: state.reorderItemsInSection,
      reorderItems: state.reorderItems,
    }))
  );

  // DnD sensors for loose items
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

  // Computed data - memoize to avoid recalculating on every render
  const list = useMemo(() => lists.find((l) => l.id === listId), [lists, listId]);
  const sections = useMemo(
    () =>
      allSections
        .filter((s) => s.list_id === listId)
        .sort((a, b) => a.position - b.position),
    [allSections, listId]
  );
  const items = useMemo(
    () => allItems.filter((item) => item.list_id === listId),
    [allItems, listId]
  );
  const looseItems = useMemo(
    () =>
      items
        .filter((item) => item.section_id === null)
        .sort((a, b) => a.position - b.position),
    [items]
  );

  // If list not found
  if (!list) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-white mb-2 text-glass-primary">
          Liste nicht gefunden
        </h2>
        <button
          onClick={() => navigate('/lists')}
          className="mt-4 text-white/80 hover:text-white transition-colors"
        >
          Zurück zur Übersicht
        </button>
      </GlassCard>
    );
  }

  // Section handlers
  const handleAddSection = () => {
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = async (name: string) => {
    if (listId) {
      await addSection(listId, name);
    }
  };

  const handleToggleSectionCollapse = async (sectionId: string) => {
    await toggleSectionCollapse(sectionId);
  };

  const handleEditSection = (sectionId: string) => {
    setEditingSectionId(sectionId);
  };

  const handleSaveEditSection = async (name: string) => {
    if (editingSectionId) {
      await updateSection(editingSectionId, { name });
      setEditingSectionId(null);
    }
  };

  const handleDeleteSection = (sectionId: string, itemCount: number, isLastSection: boolean) => {
    if (itemCount === 0) {
      // Empty section - delete immediately
      deleteSection(sectionId);
    } else {
      // Section has items - show confirmation modal
      setDeletingSectionId(sectionId);
      setDeletingSectionItemCount(itemCount);
      setDeletingSectionIsLast(isLastSection);
    }
  };

  const handleDeleteSectionAll = async () => {
    if (deletingSectionId) {
      await deleteSection(deletingSectionId);
      setDeletingSectionId(null);
      setDeletingSectionIsLast(false);
    }
  };

  const handleDeleteSectionMoveItems = async () => {
    if (deletingSectionId) {
      if (deletingSectionIsLast) {
        // Last section: keep items as loose items
        await deleteLastSectionKeepItems(deletingSectionId);
      } else {
        // Normal case: move items to Sonstiges
        await deleteSectionMoveItems(deletingSectionId);
      }
      setDeletingSectionId(null);
      setDeletingSectionIsLast(false);
    }
  };

  // Item handlers
  const handleAddItem = async (sectionId: string | null, text: string) => {
    if (listId) {
      await addItem(listId, sectionId, text);
    }
  };

  const handleUpdateItem = async (itemId: string, text: string) => {
    await updateItem(itemId, { text });
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId);
  };

  const handleToggleItem = async (itemId: string) => {
    await toggleItem(itemId);
  };

  const handleReorderItems = async (sectionId: string, itemIds: string[]) => {
    await reorderItemsInSection(sectionId, itemIds);
  };

  // Handler for reordering loose items (no section)
  const handleLooseItemsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && listId) {
      const oldIndex = looseItems.findIndex((item) => item.id === active.id);
      const newIndex = looseItems.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = [...looseItems];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        reorderItems(listId, newItems.map((item) => item.id));
      }
    }
  };

  // List handlers
  const handleListOptions = () => {
    setIsListOptionsMenuOpen(true);
  };

  const handleEditList = () => {
    setIsListModalOpen(true);
  };

  const handleDeleteList = async () => {
    if (listId) {
      await deleteList(listId);
      navigate('/lists');
    }
  };

  const handleSaveList = async (name: string, emoji: string) => {
    if (listId) {
      await updateList(listId, { name, emoji });
    }
  };

  const handleResetItems = async () => {
    if (listId) {
      await resetListItems(listId);
    }
  };

  const totalItems = items.length;
  const packedItems = items.filter((item) => item.checked).length;

  return (
    <>
      {/* Header Card */}
      <GlassCard className="p-[clamp(20px,4vw,28px)] mb-[clamp(16px,3vw,24px)]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/lists')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Zurück</span>
          </button>
          <button
            onClick={handleListOptions}
            className="text-white/50 hover:text-white/80 transition-colors p-1"
          >
            <MoreVertical size={20} />
          </button>
        </div>

        <h1 className="text-[clamp(24px,5vw,36px)] font-bold text-white mb-2 tracking-tight text-glass-primary">
          {list.emoji} {list.name}
        </h1>
        <p className="text-[clamp(13px,2.5vw,15px)] text-glass-secondary mb-[clamp(16px,3vw,24px)]">
          Zuletzt bearbeitet: {formatDate(list.updated_at)}
        </p>

        <ProgressBar
          current={packedItems}
          total={totalItems}
          onReset={() => setIsResetModalOpen(true)}
        />
      </GlassCard>

      {/* Single Card containing all sections or loose items */}
      {sections.length > 0 ? (
        <div className="glass-card-light rounded-3xl overflow-hidden mb-[clamp(16px,3vw,24px)]">
          <div className="p-2">
            {sections.map((section, index) => {
              const sectionItems = items
                .filter((item) => item.section_id === section.id)
                .sort((a, b) => a.position - b.position);

              return (
                <SectionCard
                  key={section.id}
                  section={section}
                  items={sectionItems}
                  totalSectionCount={sections.length}
                  onToggleCollapse={handleToggleSectionCollapse}
                  onAddItem={handleAddItem}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onToggleItem={handleToggleItem}
                  onReorderItems={handleReorderItems}
                  onEditSection={handleEditSection}
                  onDeleteSection={handleDeleteSection}
                  isFirst={index === 0}
                />
              );
            })}
          </div>
        </div>
      ) : (
        // Section-less mode: show loose items + ghost button
        <div className="glass-card-light rounded-3xl overflow-hidden mb-[clamp(16px,3vw,24px)]">
          <div className="p-2">
            {looseItems.length === 0 && (
              <p className="text-white/40 text-sm text-center py-3">
                Füge Items hinzu oder erstelle Abschnitte
              </p>
            )}
            {looseItems.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleLooseItemsDragEnd}
              >
                <SortableContext
                  items={looseItems.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {looseItems.map((item) => (
                    <SortableItemRow
                      key={item.id}
                      id={item.id}
                      text={item.text}
                      checked={item.checked}
                      onToggle={handleToggleItem}
                      onUpdateText={(text) => handleUpdateItem(item.id, text)}
                      onDelete={() => handleDeleteItem(item.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            <GhostItemButton onAdd={(text) => handleAddItem(null, text)} />
          </div>
        </div>
      )}

      {/* Add Section Button */}
      <button
        onClick={handleAddSection}
        className="w-full py-4 rounded-2xl glass-button-dashed text-white/60 hover:text-white flex items-center justify-center gap-2 font-medium"
      >
        <Plus size={20} />
        Neuer Abschnitt
      </button>

      {/* Section Modal - Add */}
      <SectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSave={handleSaveSection}
        mode="add"
      />

      {/* Section Modal - Edit */}
      <SectionModal
        isOpen={editingSectionId !== null}
        onClose={() => setEditingSectionId(null)}
        onSave={handleSaveEditSection}
        initialName={sections.find((s) => s.id === editingSectionId)?.name || ''}
        mode="edit"
      />

      {/* Delete Section Modal */}
      <DeleteSectionModal
        isOpen={deletingSectionId !== null}
        onClose={() => {
          setDeletingSectionId(null);
          setDeletingSectionIsLast(false);
        }}
        onDeleteAll={handleDeleteSectionAll}
        onMoveToOther={handleDeleteSectionMoveItems}
        itemCount={deletingSectionItemCount}
        sectionName={sections.find((s) => s.id === deletingSectionId)?.name || ''}
        isLastSection={deletingSectionIsLast}
      />

      {/* List Modal */}
      <ListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSave={handleSaveList}
        initialName={list.name}
        initialEmoji={list.emoji}
        mode="edit"
      />

      {/* List Options Menu */}
      <ListOptionsMenu
        isOpen={isListOptionsMenuOpen}
        onClose={() => setIsListOptionsMenuOpen(false)}
        onEdit={handleEditList}
        onDelete={handleDeleteList}
      />

      {/* Reset Confirm Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetItems}
        checkedCount={packedItems}
        totalCount={totalItems}
      />
    </>
  );
}
