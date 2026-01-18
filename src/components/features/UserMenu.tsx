import { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
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

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Menu */}
          <div
            ref={menuRef}
            className="relative w-full sm:max-w-xs mx-0 sm:mx-4 mb-0 sm:mb-0 glass-card rounded-t-[20px] sm:rounded-[20px] overflow-hidden animate-slide-up"
          >
            {/* User email */}
            <div className="px-6 py-4 border-b border-white/10">
              <p className="text-sm text-glass-muted mb-1">Angemeldet als</p>
              <p className="text-white font-medium truncate">{user?.email}</p>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 text-white hover:bg-white/10 transition-colors"
            >
              <LogOut size={20} className="text-white/70" />
              <span className="font-medium">Abmelden</span>
            </button>

            {/* Cancel button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-6 py-4 text-white/60 font-medium hover:bg-white/10 transition-colors border-t border-white/10"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
