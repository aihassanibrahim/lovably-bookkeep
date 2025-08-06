import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo mode first
    const demoMode = localStorage.getItem('bizpal-demo-mode');
    const demoSession = localStorage.getItem('bizpal-demo-session');
    
    if (demoMode === 'true' && demoSession) {
      try {
        const demoData = JSON.parse(demoSession);
        const now = Date.now();
        
        // Check if demo session is still valid (24 hours)
        if (demoData.expires_at > now) {
          setUser(demoData.user as User);
          setSession(demoData as Session);
          setLoading(false);
          return;
        } else {
          // Demo session expired, clear it
          localStorage.removeItem('bizpal-demo-mode');
          localStorage.removeItem('bizpal-demo-session');
        }
      } catch (error) {
        console.error('Error parsing demo session:', error);
        localStorage.removeItem('bizpal-demo-mode');
        localStorage.removeItem('bizpal-demo-session');
      }
    }

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    // Clear demo mode if active
    const isDemoMode = localStorage.getItem('bizpal-demo-mode') === 'true';
    localStorage.removeItem('bizpal-demo-mode');
    localStorage.removeItem('bizpal-demo-session');
    
    if (isDemoMode) {
      // For demo mode, just clear the session and reload
      setUser(null);
      setSession(null);
      window.location.reload();
    } else {
      // For real users, sign out from Supabase
      await supabase.auth.signOut();
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};