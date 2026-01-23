import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface OnboardingModalProps {
  onComplete: (firstName: string) => Promise<void>;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = firstName.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    await onComplete(trimmed);
    setIsSubmitting(false);
  };

  const isValid = firstName.trim().length > 0;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md mx-0 sm:mx-4 glass-card rounded-t-[24px] sm:rounded-[24px] p-6 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <h2
            className="text-2xl font-bold text-white mb-2"
            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}
          >
            Willkommen!
          </h2>
          <p className="text-glass-secondary">
            Wie dürfen wir dich nennen?
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm text-white/70 mb-2">Vorname</label>
            <input
              ref={inputRef}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value.slice(0, 50))}
              placeholder="Dein Vorname"
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isValid ? 'var(--progress-gradient)' : 'rgba(255,255,255,0.1)',
              color: 'white',
            }}
          >
            {isSubmitting ? 'Wird gespeichert...' : 'Weiter'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
