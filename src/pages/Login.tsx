import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, GlassCard } from '../components/ui';

type AuthMode = 'login' | 'register' | 'forgot';

export function Login() {
  const { user, loading, signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Redirect if already logged in
  if (!loading && user) {
    return <Navigate to="/lists" replace />;
  }

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMessage(null);
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (mode === 'register' && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsSubmitting(false);
      return;
    }

    if (mode === 'register' && password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setIsSubmitting(false);
      return;
    }

    let result;

    if (mode === 'login') {
      result = await signIn(email, password);
    } else if (mode === 'register') {
      result = await signUp(email, password);
      if (!result.error) {
        setMessage({
          type: 'success',
          text: 'Account created! Check your email to confirm your account.',
        });
        resetForm();
        setIsSubmitting(false);
        return;
      }
    } else {
      result = await resetPassword(email);
      if (!result.error) {
        setMessage({
          type: 'success',
          text: 'Check your email for the password reset link.',
        });
        setIsSubmitting(false);
        return;
      }
    }

    if (result?.error) {
      setMessage({ type: 'error', text: result.error.message });
    }

    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Packing List
        </h1>
        <p className="text-white/70">
          {mode === 'login' && 'Sign in to manage your packing lists'}
          {mode === 'register' && 'Create an account to get started'}
          {mode === 'forgot' && 'Reset your password'}
        </p>
      </div>

      <GlassCard className="w-full max-w-md p-6">
          {mode !== 'forgot' && (
            <div className="flex mb-6 bg-white/10 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === 'login'
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('register')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === 'register'
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            {mode !== 'forgot' && (
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            )}

            {mode === 'register' && (
              <Input
                type="password"
                label="Confirm password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            )}

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                    : 'bg-red-500/20 text-red-200 border border-red-500/30'
                }`}
              >
                {message.text}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={!email || (mode !== 'forgot' && !password)}
            >
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot' && 'Send Reset Link'}
            </Button>
          </form>

          {mode === 'login' && (
            <button
              type="button"
              onClick={() => handleModeChange('forgot')}
              className="mt-4 w-full text-center text-sm text-white/60 hover:text-white transition-colors"
            >
              Forgot your password?
            </button>
          )}

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className="mt-4 w-full text-center text-sm text-white/60 hover:text-white transition-colors"
            >
              Back to login
            </button>
          )}
        </GlassCard>
      </div>
  );
}
