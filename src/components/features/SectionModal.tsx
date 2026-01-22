import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useKeyboardHeight } from '../../hooks/useKeyboardHeight';

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName?: string;
  mode?: 'add' | 'edit';
}

export function SectionModal({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  mode = 'add',
}: SectionModalProps) {
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);
  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    setName(initialName);
  }, [initialName, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      setName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
      style={{
        paddingBottom: keyboardHeight > 0 ? `${keyboardHeight}px` : undefined,
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-md glass-card rounded-t-[24px] sm:rounded-[24px] p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white/80 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-6 text-glass-primary">
          {mode === 'add' ? 'Neuer Abschnitt' : 'Abschnitt bearbeiten'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Abschnittname..."
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-200 text-glass-secondary"
          />

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: name.trim() ? 'var(--progress-gradient)' : 'rgba(255,255,255,0.1)',
              }}
            >
              {mode === 'add' ? 'Hinzufügen' : 'Speichern'}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
}
