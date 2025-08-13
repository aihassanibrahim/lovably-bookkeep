import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables with proper fallbacks
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || "https://vhtlnufnzabbpoyipiwn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZodGxudWZuemFiYnBveWlwaXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjM2NzIsImV4cCI6MjA2OTg5OTY3Mn0.29rJzvPexHqPBAYcdu36E41ib9BM1XLfeJ22nfrQdWY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// Helper function to ensure user exists before operations
export const ensureUserExists = async (userId: string) => {
  try {
    const { data: existingUser, error } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // User doesn't exist in profiles, create one
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          onboarding_completed: false,
          onboarding_step: 0
        });

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        return false;
      }
      return true;
    }

    return !error;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    return false;
  }
};