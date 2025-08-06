import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface OnboardingRedirectProps {
  children: React.ReactNode;
}

export const OnboardingRedirect: React.FC<OnboardingRedirectProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has completed onboarding
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking onboarding status:', error);
        }

        // Check localStorage as fallback
        const localStorageCompleted = localStorage.getItem('onboarding_completed') === 'true';
        
        console.log('OnboardingRedirect check:', {
          profile,
          profileCompleted: profile?.onboarding_completed,
          localStorageCompleted,
          shouldRedirect: (!profile || !profile.onboarding_completed) && !localStorageCompleted
        });
        
        // If no profile exists or onboarding is not completed, redirect to onboarding
        if ((!profile || !profile.onboarding_completed) && !localStorageCompleted) {
          setShouldRedirect(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  useEffect(() => {
    if (!loading && shouldRedirect && user) {
      navigate('/onboarding');
    }
  }, [loading, shouldRedirect, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Kontrollerar onboarding...</CardTitle>
            <CardDescription className="text-center">
              Vi kontrollerar om du har slutfört onboarding-processen.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}; 