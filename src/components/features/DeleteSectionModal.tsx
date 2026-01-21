import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, FolderOutput, Package } from 'lucide-react';

interface DeleteSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteAll: () => void;
  onMoveToOther: () => void;
  itemCount: number;
  sectionName: string;
  isLastSection?: boolean;
}

export function DeleteSectionModal({
  isOpen,
  onClose,
  onDeleteAll,
  onMoveToOther,
  itemCount,
  sectionName,
  isLastSection = false,
}: DeleteSectionModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-section-modal-title"
    >
      {/* Backdrop - Style B: contextual action (no blur) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal Container */}
      <div className="relative w-full sm:max-w-sm mx-0 sm:mx-4 glass-card rounded-t-[24px] sm:rounded-[24px] p-6 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
            <Trash2 size={28} className="text-white/70" />
          </div>
        </div>

        {/* Title */}
        <h2
          id="delete-section-modal-title"
          className="text-lg font-bold text-white text-center mb-2"
          style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}
        >
          Abschnitt löschen?
        </h2>

        {/* Description */}
        <p className="text-white/60 text-center text-sm mb-6">
          „{sectionName}" enthält {itemCount} {itemCount === 1 ? 'Item' : 'Items'}. Was soll damit passieren?
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onMoveToOther();
              onClose();
            }}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white font-medium hover:bg-white/25 transition-colors flex items-center justify-center gap-2"
          >
            {isLastSection ? <Package size={18} /> : <FolderOutput size={18} />}
            {isLastSection ? 'Items behalten' : 'Nach Sonstiges verschieben'}
          </button>
          <button
            onClick={() => {
              onDeleteAll();
              onClose();
            }}
            className="w-full px-4 py-3 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Alle Items löschen
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white/60 font-medium hover:bg-white/15 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
