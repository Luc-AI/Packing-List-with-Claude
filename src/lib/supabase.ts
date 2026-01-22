import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Missing',
  });
  throw new Error(
    `Missing Supabase environment variables:\n` +
    `- VITE_SUPABASE_URL: ${supabaseUrl ? '✓' : '✗ MISSING'}\n` +
    `- VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✓' : '✗ MISSING'}\n\n` +
    `For local development: Copy .env.example to .env and fill in your values.\n` +
    `For AWS Amplify: Add these in App settings → Environment variables.`
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
