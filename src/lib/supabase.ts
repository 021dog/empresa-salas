import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Local state will be used as fallback.');
}

let supabaseInstance = null;

try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } else if (supabaseUrl || supabaseAnonKey) {
    console.warn('Supabase credentials detected but may be invalid. Fallback to local mode strictly enforced.');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export const supabase = supabaseInstance;

// Helper to check if supabase is connected
export const isSupabaseConnected = () => !!supabase;
