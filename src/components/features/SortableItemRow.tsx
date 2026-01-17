import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreVertical, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SortableItemRowProps {
  id: string;
  text: string;
  checked: boolean;
  onToggle: (id: string) => void;
  onOptionsClick?: (id: string) => void;
  isLast?: boolean;
}

export function SortableItemRow({
  id,
  text,
  checked,
  onToggle,
  onOptionsClick,
  isLast = false,
}: SortableItemRowProps) {
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
        'flex items-center p-[clamp(14px,3vw,18px)] px-[clamp(14px,3vw,20px)] cursor-pointer transition-colors duration-200 min-h-[56px]',
        checked ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]',
        !isLast && 'border-b border-white/15',
        isDragging && 'glass-card rounded-xl'
      )}
      onClick={() => onToggle(id)}
    >
      {/* Drag Handle */}
      <div
        className="mr-[clamp(8px,2vw,12px)] text-white/40 cursor-grab active:cursor-grabbing flex items-center shrink-0 touch-none"
        onClick={(e) => e.stopPropagation()}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} />
      </div>

      {/* Checkbox */}
      <div
        className={cn(
          'w-[clamp(24px,4vw,26px)] h-[clamp(24px,4vw,26px)] rounded-[9px] flex items-center justify-center mr-[clamp(10px,2.5vw,14px)] shrink-0 transition-all duration-200'
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

      {/* Item Text */}
      <span
        className={cn(
          'flex-1 text-[clamp(14px,3vw,16px)] transition-all duration-200 break-words',
          checked
            ? 'text-glass-muted line-through decoration-white/40 font-normal'
            : 'text-white font-medium'
        )}
        style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}
      >
        {text}
      </span>

      {/* More Options Button */}
      <button
        className="bg-transparent border-none cursor-pointer text-white/50 p-1 flex items-center transition-colors duration-150 shrink-0 ml-2 hover:text-white/80"
        onClick={(e) => {
          e.stopPropagation();
          onOptionsClick?.(id);
        }}
      >
        <MoreVertical size={20} />
      </button>
    </div>
  );
}
