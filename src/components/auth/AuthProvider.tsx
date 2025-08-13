import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: AuthError | null }>;
  isEmailVerified: boolean;
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
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Prefer explicit app URL env; fallback to window origin
  const appUrl = (import.meta.env.VITE_PUBLIC_APP_URL || import.meta.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')) as string;

  useEffect(() => {
    const demoMode = localStorage.getItem('bizpal-demo-mode');
    const demoSession = localStorage.getItem('bizpal-demo-session');
    
    if (demoMode === 'true' && demoSession) {
      try {
        const demoData = JSON.parse(demoSession);
        const now = Date.now();
        
        if (demoData.expires_at > now) {
          setUser(demoData.user as User);
          setSession(demoData as Session);
          setIsEmailVerified(true);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem('bizpal-demo-mode');
          localStorage.removeItem('bizpal-demo-session');
        }
      } catch (error) {
        console.error('Error parsing demo session:', error);
        localStorage.removeItem('bizpal-demo-mode');
        localStorage.removeItem('bizpal-demo-session');
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsEmailVerified(session?.user?.email_confirmed_at ? true : false);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsEmailVerified(session?.user?.email_confirmed_at ? true : false);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      return !error;
    } catch (error) {
      console.error('Error ensuring user exists:', error);
      return false;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${appUrl}/dashboard`,
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      // Create initial profile record for new user with retry logic
      if (data.user) {
        // Wait a bit for the user to be created in auth.users
        setTimeout(async () => {
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                user_id: data.user.id,
                onboarding_completed: false,
                onboarding_step: 0,
              });

            if (profileError) {
              console.error('Profile creation error:', profileError);
            } else {
              console.log('Profile created successfully for user:', data.user.id);
            }
          } catch (err) {
            console.error('Error creating profile:', err);
          }
        }, 1000);
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { error: error as AuthError };
    }
  };

  // Import ensureUserExists function
  const ensureUserExists = async (userId: string) => {
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

      // Ensure user profile exists after sign in
      if (data.user) {
        const userExists = await ensureUserExists(data.user.id);
        if (!userExists) {
          console.warn('Could not ensure user profile exists');
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      // Check if user is in demo mode
      const isDemoMode = localStorage.getItem('bizpal-demo-mode') === 'true';
      
      if (isDemoMode) {
        // Clear demo mode
        localStorage.removeItem('bizpal-demo-mode');
        localStorage.removeItem('bizpal-demo-session');
        setUser(null);
        setSession(null);
        setIsEmailVerified(false);
        // Reload page to reset all state
        window.location.reload();
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Fel vid utloggning');
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error('Fel vid utloggning');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/auth/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      return { error: error as AuthError };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error('Password update error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected password update error:', error);
      return { error: error as AuthError };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${appUrl}/dashboard`,
        },
      });

      if (error) {
        console.error('Resend verification error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected resend verification error:', error);
      return { error: error as AuthError };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    resendVerificationEmail,
    isEmailVerified,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};