import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RotateCcw } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  checkedCount: number;
  totalCount: number;
}

export function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  checkedCount,
  totalCount,
}: ResetConfirmModalProps) {
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

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
    >
      {/* Backdrop - Style B: contextual action (no blur) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal Container */}
      <div className="relative w-full sm:max-w-sm mx-0 sm:mx-4 glass-card rounded-t-[24px] sm:rounded-[24px] p-6 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
            <RotateCcw size={28} className="text-white/70" />
          </div>
        </div>

        {/* Title */}
        <h2
          id="reset-modal-title"
          className="text-lg font-bold text-white text-center mb-2"
          style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}
        >
          Items zurücksetzen?
        </h2>

        {/* Description */}
        <p className="text-white/60 text-center text-sm mb-6">
          {checkedCount} von {totalCount} Items werden als nicht eingepackt markiert.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white font-medium hover:bg-white/25 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Zurücksetzen
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
