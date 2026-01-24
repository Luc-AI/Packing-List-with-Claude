import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard, Button, Input } from '../components/ui';
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

export function Login() {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

    const result = await signIn(email, password);

    if (result?.error) {
      setMessage({ type: 'error', text: result.error.message });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden px-[clamp(16px,4vw,20px)]">
      <GlassCard className="p-[clamp(20px,4vw,28px)] w-full max-w-[400px]">
        <h1 className="text-glass-primary text-[clamp(22px,5vw,28px)] font-bold mb-2 text-center">
          Bereit für die nächste Reise?
        </h1>

        <p className="text-glass-secondary text-[clamp(13px,2.5vw,14px)] text-center mb-6">
          Melde dich an, um deine Packlisten zu verwalten.
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

          <div>
            <Input
              type="password"
              label="Passwort"
              placeholder="Dein Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-glass-muted text-xs hover:text-white transition-colors"
              >
                Passwort vergessen?
              </Link>
            </div>
          </div>

          {message && <MessageDisplay message={message} />}

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            disabled={!email || !password}
          >
            Anmelden
          </Button>

          <div className="text-center text-sm text-glass-secondary pt-2">
            Noch kein Account?{' '}
            <Link
              to="/register"
              className="text-white font-medium hover:text-white/90 underline transition-colors"
            >
              Registrieren
            </Link>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
