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
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-modal-title"
        >
          {/* Backdrop - soft dimming with blur like iOS/macOS */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Container - true center positioning */}
          <div
            className="relative w-[90%] max-w-[420px] mx-auto animate-fade-in"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.14)), rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(24px) saturate(130%)',
              WebkitBackdropFilter: 'blur(24px) saturate(130%)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              padding: '24px',
            }}
          >
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
            <div
              className="mb-6 p-4 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
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
                className="flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                Abbrechen
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
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
