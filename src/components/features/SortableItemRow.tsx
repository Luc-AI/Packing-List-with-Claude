import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreVertical, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ItemModal } from './ItemModal';
import { ItemOptionsMenu } from './ItemOptionsMenu';

interface SortableItemRowProps {
  id: string;
  text: string;
  checked: boolean;
  onToggle: (id: string) => void;
  onUpdateText: (text: string) => void;
  onDelete: () => void;
}

export function SortableItemRow({
  id,
  text,
  checked,
  onToggle,
  onUpdateText,
  onDelete,
}: SortableItemRowProps) {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-3 py-3 px-4 hover:bg-white/5 transition-colors rounded-xl',
        isDragging && 'bg-white/10 rounded-xl'
      )}
    >
      {/* Drag Handle */}
      <button
        className="text-white/30 cursor-grab hover:text-white/60 opacity-0 group-hover:opacity-100 transition-opacity touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(id)}
        className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200',
          checked
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'bg-transparent border-white/40 hover:border-white/80'
        )}
      >
        {checked && <Check size={14} strokeWidth={3} />}
      </button>

      {/* Text Input */}
      <input
        type="text"
        value={text}
        onChange={(e) => onUpdateText(e.target.value)}
        className={cn(
          'flex-1 bg-transparent border-none outline-none text-white placeholder-white/40 focus:ring-0 p-0 text-base font-medium',
          checked && 'line-through text-white/50'
        )}
      />

      {/* Menu */}
      <button
        onClick={() => setIsOptionsMenuOpen(true)}
        className="text-white/30 hover:text-white hover:bg-white/10 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreVertical size={16} />
      </button>

      <ItemOptionsMenu
        isOpen={isOptionsMenuOpen}
        onClose={() => setIsOptionsMenuOpen(false)}
        onEdit={() => {
          setIsOptionsMenuOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={onDelete}
      />

      <ItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onUpdateText}
        initialText={text}
        mode="edit"
      />
    </div>
  );
}
