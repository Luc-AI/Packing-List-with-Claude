import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { GlassBackground, GlassCard, ProgressBar } from '../components/ui';
import { ItemRow, AddItemButton, ItemModal, OptionsMenu } from '../components/features';
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

  // Modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Store
  const lists = useStore((state) => state.lists);
  const allItems = useStore((state) => state.items);
  const toggleItem = useStore((state) => state.toggleItem);
  const addItem = useStore((state) => state.addItem);
  const updateItem = useStore((state) => state.updateItem);
  const deleteItem = useStore((state) => state.deleteItem);

  // Computed data
  const list = lists.find((l) => l.id === listId);
  const items = allItems
    .filter((item) => item.list_id === listId)
    .sort((a, b) => a.position - b.position);

  const selectedItem = selectedItemId ? items.find((i) => i.id === selectedItemId) : null;

  // If list not found
  if (!list) {
    return (
      <GlassBackground>
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
      </GlassBackground>
    );
  }

  const handleAddItem = () => {
    setModalMode('add');
    setSelectedItemId(null);
    setIsItemModalOpen(true);
  };

  const handleItemOptions = (id: string) => {
    setSelectedItemId(id);
    setIsOptionsMenuOpen(true);
  };

  const handleEditItem = () => {
    setModalMode('edit');
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = () => {
    if (selectedItemId) {
      deleteItem(selectedItemId);
      setSelectedItemId(null);
    }
  };

  const handleSaveItem = (text: string) => {
    if (modalMode === 'add' && listId) {
      addItem(listId, text);
    } else if (modalMode === 'edit' && selectedItemId) {
      updateItem(selectedItemId, { text });
    }
  };

  const totalItems = items.length;
  const packedItems = items.filter((item) => item.checked).length;

  return (
    <GlassBackground>
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
          <button className="text-white/50 hover:text-white/80 transition-colors p-1">
            <MoreVertical size={20} />
          </button>
        </div>

        <h1 className="text-[clamp(24px,5vw,36px)] font-bold text-white mb-2 tracking-tight text-glass-primary">
          {list.emoji} {list.name}
        </h1>
        <p className="text-[clamp(13px,2.5vw,15px)] text-glass-secondary mb-[clamp(16px,3vw,24px)]">
          Zuletzt bearbeitet: {formatDate(list.updated_at)}
        </p>

        <ProgressBar current={packedItems} total={totalItems} />
      </GlassCard>

      {/* Items List */}
      {items.length > 0 ? (
        <GlassCard variant="light" className="overflow-hidden mb-[clamp(16px,3vw,24px)]">
          {items.map((item, index) => (
            <ItemRow
              key={item.id}
              id={item.id}
              text={item.text}
              checked={item.checked}
              onToggle={toggleItem}
              onOptionsClick={handleItemOptions}
              isLast={index === items.length - 1}
            />
          ))}
        </GlassCard>
      ) : (
        <GlassCard variant="light" className="p-8 text-center mb-[clamp(16px,3vw,24px)]">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-glass-secondary">Noch keine Items vorhanden</p>
        </GlassCard>
      )}

      {/* Add Item Button */}
      <AddItemButton onClick={handleAddItem} />

      {/* Item Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        initialText={modalMode === 'edit' ? selectedItem?.text ?? '' : ''}
        mode={modalMode}
      />

      {/* Options Menu */}
      <OptionsMenu
        isOpen={isOptionsMenuOpen}
        onClose={() => setIsOptionsMenuOpen(false)}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />
    </GlassBackground>
  );
}
