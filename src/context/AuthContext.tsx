import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

interface AuthResult {
  error: AuthError | null;
}

// Check if user needs onboarding (new user created within last 5 minutes)
function checkNeedsOnboarding(user: User | null): boolean {
  if (!user) return false;
  if (user.user_metadata?.onboarding_completed) return false;
  if (!user.created_at) return false;

  const createdAt = new Date(user.created_at);
  const now = new Date();
  const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

  return diffMinutes < 5;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  needsOnboarding: boolean;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  updateUserMetadata: (data: Record<string, unknown>) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { fetchData, clearData } = useStore.getState();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Fetch data if user is logged in
      if (session?.user) {
        fetchData(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle data fetching/clearing based on auth event
      if (event === 'SIGNED_IN' && session?.user) {
        fetchData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        clearData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/lists`,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (newPassword: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  const updateUserMetadata = async (data: Record<string, unknown>): Promise<AuthResult> => {
    const { data: userData, error } = await supabase.auth.updateUser({ data });
    if (!error && userData.user) {
      setUser(userData.user);
    }
    return { error };
  };

  const needsOnboarding = checkNeedsOnboarding(user);

  return (
    <AuthContext.Provider
      value={{ user, session, loading, needsOnboarding, signUp, signIn, signOut, resetPassword, updatePassword, updateUserMetadata }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
