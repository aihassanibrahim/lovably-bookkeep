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
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    setIsLoading(true);
    
    try {
      // Guest credentials (you should create a test user in Supabase)
      const guestEmail = 'guest@bizpal.test';
      const guestPassword = 'guest123456';
      
      await signIn(guestEmail, guestPassword);
      
      toast({
        title: 'Välkommen som gäst!',
        description: 'Du är nu inloggad med testdata. Prova alla funktioner.',
      });
      
      // Navigate to dashboard
      navigate('/');
      
    } catch (error) {
      console.error('Guest login error:', error);
      
      toast({
        title: 'Kunde inte logga in som gäst',
        description: 'Testanvändaren kanske inte finns. Kontakta support.',
        variant: 'destructive',
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
            Logga in med testdata och prova alla funktioner utan att skapa konto
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
                Loggar in...
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
          Loggar in...
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