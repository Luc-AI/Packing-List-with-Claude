import { useState } from 'react';
import { Link } from 'react-router-dom';
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

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const result = await resetPassword(email);

    if (result?.error) {
      setMessage({ type: 'error', text: result.error.message });
    } else {
      setMessage({
        type: 'success',
        text: 'Check your email for the password reset link.',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <GlassCard className="p-[clamp(20px,4vw,28px)] w-full max-w-[400px]">
        <h1 className="text-glass-primary text-[clamp(20px,4vw,28px)] font-bold mb-[clamp(8px,1.5vw,12px)] text-center">
          Passwort zurücksetzen
        </h1>

        <p className="text-glass-secondary text-[clamp(13px,2.5vw,14px)] text-center mb-[clamp(20px,4vw,28px)]">
          Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-[clamp(12px,2vw,16px)]">
          <Input
            type="email"
            label="E-Mail-Adresse"
            placeholder="deine@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          {message && <MessageDisplay message={message} />}

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            disabled={!email}
          >
            Link senden
          </Button>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="text-glass-secondary text-sm hover:text-white underline transition-colors"
            >
              Zurück zur Anmeldung
            </Link>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
