import { Menu, Trash2, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { InlineEditableText } from './InlineEditableText';

interface ItemRowProps {
  id: string;
  text: string;
  checked: boolean;
  onToggle: (id: string) => void;
  onUpdateText?: (text: string) => void;
  onDelete?: () => void;
  isLast?: boolean;
}

/**
 * ItemRow - A single item in the packing list with drag handle, checkbox, inline editing, and delete
 */
export function ItemRow({
  id,
  text,
  checked,
  onToggle,
  onUpdateText,
  onDelete,
  isLast = false,
}: ItemRowProps) {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(id);
  };

  return (
    <div
      className={cn(
        'group flex items-center p-[clamp(14px,3vw,18px)] px-[clamp(14px,3vw,20px)] transition-colors duration-200 min-h-[56px]',
        checked ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]',
        !isLast && 'border-b border-white/15'
      )}
    >
      {/* Drag Handle */}
      <div
        className="mr-[clamp(8px,2vw,12px)] text-white/40 cursor-grab flex items-center shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Menu size={20} />
      </div>

      {/* Checkbox */}
      <div
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
        onClick={handleCheckboxClick}
      >
        {checked && <Check size={17} color="white" strokeWidth={3} />}
      </div>

      {/* Item Text - Inline Editable */}
      <div className="flex-1 min-w-0">
        {onUpdateText ? (
          <InlineEditableText
            value={text}
            onSave={onUpdateText}
            placeholder="Item Text"
            className={cn(
              'text-[clamp(14px,3vw,16px)] transition-all duration-200 break-words',
              checked
                ? 'text-glass-muted line-through decoration-white/40 font-normal'
                : 'text-white font-medium'
            )}
          />
        ) : (
          <span
            className={cn(
              'text-[clamp(14px,3vw,16px)] transition-all duration-200 break-words',
              checked
                ? 'text-glass-muted line-through decoration-white/40 font-normal'
                : 'text-white font-medium'
            )}
            style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}
          >
            {text}
          </span>
        )}
      </div>

      {/* Delete Button (visible on hover) */}
      {onDelete && (
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/40 hover:text-red-400 p-1 ml-2 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}
