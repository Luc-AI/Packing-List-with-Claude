import { useEffect, useRef } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface ListOptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ListOptionsMenu({ isOpen, onClose, onEdit, onDelete }: ListOptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Menu */}
      <div
        ref={menuRef}
        className="relative w-full sm:max-w-xs mx-0 sm:mx-4 mb-0 sm:mb-0 glass-card rounded-t-[20px] sm:rounded-[20px] overflow-hidden animate-slide-up"
      >
        <button
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="w-full flex items-center gap-4 px-6 py-4 text-white hover:bg-white/10 transition-colors border-b border-white/10"
        >
          <Pencil size={20} className="text-white/70" />
          <span className="font-medium">Liste bearbeiten</span>
        </button>

        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:bg-white/10 transition-colors"
        >
          <Trash2 size={20} />
          <span className="font-medium">Liste löschen</span>
        </button>

        <button
          onClick={onClose}
          className="w-full px-6 py-4 text-white/60 font-medium hover:bg-white/10 transition-colors border-t border-white/10"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}
