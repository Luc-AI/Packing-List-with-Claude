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
        'flex items-center p-[clamp(14px,3vw,18px)] px-[clamp(14px,3vw,20px)] min-h-[56px] rounded-xl transition-colors duration-200 hover:bg-white/[0.03]',
        isDragging && 'glass-card rounded-xl'
      )}
    >
      {/* Drag Handle */}
      <div
        className="mr-[clamp(8px,2vw,12px)] text-white/40 cursor-grab active:cursor-grabbing flex items-center shrink-0 touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} />
      </div>

      {/* Checkbox */}
      <div
        onClick={() => onToggle(id)}
        className={cn(
          'w-[clamp(24px,4vw,26px)] h-[clamp(24px,4vw,26px)] rounded-[9px] flex items-center justify-center mr-[clamp(10px,2.5vw,14px)] shrink-0 transition-all duration-200 cursor-pointer'
        )}
        style={
          checked
            ? {
                background: 'var(--check-gradient)',
                boxShadow: 'var(--check-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }
            : {
                background: 'rgba(255, 255, 255, 0.08)',
                border: '2.5px solid rgba(255, 255, 255, 0.4)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
              }
        }
      >
        {checked && <Check size={17} color="white" strokeWidth={3} />}
      </div>

      {/* Text - Click to toggle */}
      <span
        onClick={() => onToggle(id)}
        className={cn(
          'flex-1 cursor-pointer select-none text-[clamp(14px,3vw,16px)] transition-all duration-200',
          checked
            ? 'text-glass-muted line-through decoration-white/40 font-normal'
            : 'text-white font-medium'
        )}
        style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}
      >
        {text}
      </span>

      {/* Menu */}
      <button
        onClick={() => setIsOptionsMenuOpen(true)}
        className="text-white/50 hover:text-white/80 p-1 transition-colors duration-150 shrink-0 ml-2"
      >
        <MoreVertical size={20} />
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
