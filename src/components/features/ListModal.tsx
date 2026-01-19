import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, emoji: string) => void;
  initialName?: string;
  initialEmoji?: string;
  mode: 'add' | 'edit';
}

const EMOJI_OPTIONS = ['🏝️', '✈️', '🏕️', '🎒', '🧳', '🌍', '🏔️', '🏖️', '🚗', '🚂', '🏠', '💼'];

export function ListModal({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  initialEmoji = '📦',
  mode,
}: ListModalProps) {
  const [name, setName] = useState(initialName);
  const [emoji, setEmoji] = useState(initialEmoji);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(initialName);
    setEmoji(initialEmoji);
  }, [initialName, initialEmoji, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), emoji);
      setName('');
      setEmoji('📦');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop - darker with blur for 'add', lighter for 'edit' */}
      <div className={`absolute inset-0 ${mode === 'add' ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/40'}`} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md mx-0 sm:mx-4 glass-card rounded-t-[24px] sm:rounded-[24px] p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white text-glass-primary">
            {mode === 'add' ? 'Neue Liste' : 'Liste bearbeiten'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Emoji Picker */}
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Symbol</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    emoji === e
                      ? 'bg-white/30 border-2 border-white/50 scale-110'
                      : 'bg-white/10 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-sm text-white/70 mb-2">Name</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Sommerurlaub 2025"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: name.trim() ? 'var(--progress-gradient)' : 'rgba(255,255,255,0.1)',
                color: 'white',
              }}
            >
              {mode === 'add' ? 'Erstellen' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
