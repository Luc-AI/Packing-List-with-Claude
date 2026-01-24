import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard, Button, Input } from '../components/ui';
import { PrivacyPolicyModal } from '../components/features/PrivacyPolicyModal';
import { TermsOfServiceModal } from '../components/features/TermsOfServiceModal';
import { cn } from '../lib/utils';

function MessageDisplay({ message }: { message: { type: 'success' | 'error'; text: string } }) {
  return (
    <div
      className={cn(
        'p-3 rounded-lg text-sm',
        message.type === 'success'
          ? 'bg-green-500/20 text-green-200 border border-green-500/30'
          : 'bg-red-500/20 text-red-200 border border-red-500/30'
      )}
    >
      {message.text}
    </div>
  );
}

export function Register() {
  const { user, loading, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Redirect if already logged in
  if (!loading && user) {
    return <Navigate to="/lists" replace />;
  }

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setIsSubmitting(false);
      return;
    }

    const result = await signUp(email, password);

    if (result.error) {
      setMessage({ type: 'error', text: result.error.message });
    } else {
      setMessage({
        type: 'success',
        text: 'Account created! Check your email to confirm your account.',
      });
      setEmail('');
      setPassword('');
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
        <GlassCard className="p-[clamp(20px,4vw,28px)] w-full max-w-[400px]">
          <h1 className="text-glass-primary text-[clamp(18px,4vw,24px)] font-bold mb-2 text-center">
            Erstelle deinen Account
          </h1>

          <p className="text-glass-secondary text-[clamp(13px,2.5vw,14px)] text-center mb-6">
            Verwalte deine Packlisten für jede Reise.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="E-Mail-Adresse"
              placeholder="deine@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              label="Passwort"
              placeholder="Mindestens 6 Zeichen"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            {message && <MessageDisplay message={message} />}

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={!email || !password}
            >
              Account erstellen
            </Button>

            <div className="text-center text-sm text-glass-secondary pt-2">
              Hast du bereits einen Account?{' '}
              <Link
                to="/"
                className="text-white font-medium hover:text-white/90 underline transition-colors"
              >
                Anmelden
              </Link>
            </div>

            <p className="text-xs text-center text-glass-muted pt-2">
              Mit der Registrierung stimmst du unseren{' '}
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="text-white/80 underline hover:text-white transition-colors"
              >
                Datenschutzbestimmungen
              </button>
              {' '}und{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-white/80 underline hover:text-white transition-colors"
              >
                Nutzungsbedingungen
              </button>
              {' '}zu.
            </p>
          </form>
        </GlassCard>
      </div>

      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </>
  );
}
