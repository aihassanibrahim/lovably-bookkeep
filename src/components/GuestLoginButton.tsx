import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Play, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface GuestLoginButtonProps {
  className?: string;
  variant?: 'button' | 'card';
}

export const GuestLoginButton: React.FC<GuestLoginButtonProps> = ({ 
  className = '', 
  variant = 'button' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    setIsLoading(true);
    
    try {
      // Create a demo session in localStorage to simulate guest login
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@bizpal.se',
        user_metadata: {
          full_name: 'Demo Användare'
        },
        app_metadata: {
          provider: 'demo'
        }
      };

      // Store demo session
      localStorage.setItem('bizpal-demo-session', JSON.stringify({
        user: demoUser,
        access_token: 'demo-token',
        refresh_token: 'demo-refresh',
        expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));

      // Set demo flag
      localStorage.setItem('bizpal-demo-mode', 'true');

      toast.success('Välkommen som gäst!', {
        description: 'Du är nu i demo-läge. Prova alla funktioner med testdata.'
      });
      
      // Reload the page to trigger auth state change
      window.location.reload();
      
    } catch (error) {
      console.error('Guest login error:', error);
      
      toast.error('Kunde inte aktivera demo-läge', {
        description: 'Försök igen eller kontakta support.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'card') {
    return (
      <Card className={`border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors ${className}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold">
            Testa BizPal som gäst
          </CardTitle>
          <CardDescription>
            Aktivera demo-läge och prova alla funktioner med testdata
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <Button 
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Aktiverar demo...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Testa som gäst
              </>
            )}
          </Button>
          
          <p className="text-sm text-gray-500 mt-3">
            Inga kreditkortsuppgifter krävs • Testdata inkluderat
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button 
      onClick={handleGuestLogin}
      disabled={isLoading}
      variant="outline"
      className={`border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 ${className}`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          Aktiverar demo...
        </>
      ) : (
        <>
          <User className="w-4 h-4 mr-2" />
          Testa som gäst
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  );
}; 