import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        title="Benutzermenu"
      >
        <User size={20} className="text-white/80" />
      </button>

      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-modal-title"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Container */}
          <div className="relative w-full sm:max-w-md mx-0 sm:mx-4 glass-card rounded-t-[24px] sm:rounded-[24px] p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2
                id="user-modal-title"
                className="text-lg font-bold text-white"
                style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}
              >
                Benutzerkonto
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-white/50 hover:text-white/80 transition-colors"
                aria-label="Schließen"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="mb-6 p-4 rounded-xl bg-white/10 border border-white/15">
              <p className="text-sm text-white/60 mb-1">Angemeldet als</p>
              <p
                className="text-white font-medium truncate"
                style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)' }}
              >
                {user?.email}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white font-medium hover:bg-white/25 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Abmelden
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
