import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X, Pencil } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToastStore } from '../../store/useToastStore';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const { user, signOut, updateUserMetadata } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentFirstName = (user?.user_metadata?.first_name as string) || '';

  // Sync firstName with user metadata when modal opens or editing starts
  useEffect(() => {
    if (isOpen) {
      setFirstName(currentFirstName);
      setIsEditingName(false);
    }
  }, [isOpen, currentFirstName]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName) {
      inputRef.current?.focus();
    }
  }, [isEditingName]);

  const handleSaveFirstName = async () => {
    const trimmed = firstName.trim();
    if (isSaving) return;
    if (trimmed === currentFirstName) {
      setIsEditingName(false);
      return;
    }

    setIsSaving(true);
    const { error } = await updateUserMetadata({ first_name: trimmed || null });
    setIsSaving(false);
    setIsEditingName(false);

    if (error) {
      useToastStore.getState().addToast('Fehler beim Speichern', 'error');
    } else {
      useToastStore.getState().addToast('Name gespeichert', 'success');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveFirstName();
    } else if (e.key === 'Escape') {
      setFirstName(currentFirstName);
      setIsEditingName(false);
    }
  };

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

  // Avatar: first letter of first_name, fallback to email initial
  const avatarInitial = currentFirstName
    ? currentFirstName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || '?';
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 rounded-full overflow-hidden bg-white/20 hover:bg-white/30 transition-all ring-2 ring-white/30 hover:ring-white/50 flex items-center justify-center shrink-0"
        title="Benutzermenu"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profilbild"
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className="text-white font-bold text-lg"
            style={{ textShadow: 'var(--text-shadow-light)' }}
          >
            {avatarInitial}
          </span>
        )}
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

            {/* First Name Field */}
            <div className="mb-4 p-4 rounded-xl bg-white/10 border border-white/15">
              <p className="text-sm text-white/60 mb-1">Vorname</p>
              {isEditingName ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value.slice(0, 50))}
                  onBlur={handleSaveFirstName}
                  onKeyDown={handleKeyDown}
                  placeholder="Dein Vorname"
                  maxLength={50}
                  className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-white/30 focus:border-white/60 transition-colors"
                  style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)' }}
                  disabled={isSaving}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <p
                    className="text-white font-medium truncate"
                    style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)' }}
                  >
                    {currentFirstName || <span className="text-white/40">Nicht angegeben</span>}
                  </p>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 text-white/50 hover:text-white/80 transition-colors"
                    aria-label="Name bearbeiten"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              )}
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

            {/* Version Info */}
            <p className="mt-4 text-center text-xs text-white/30">
              v{__APP_VERSION__} · {new Date(__BUILD_TIME__).toLocaleString('de-DE', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
