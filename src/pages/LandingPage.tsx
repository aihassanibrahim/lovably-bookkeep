import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Calculator, TrendingUp, Shield, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    // For demo purposes - you can create a demo account
    await signIn('demo@example.com', 'demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary rounded-full">
              <CreditCard className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Enkel Bokföring
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                          Perfekt för företagare som vill hantera sin bokföring enkelt och säkert. 
            Spåra intäkter, utgifter och beräkna vinst automatiskt.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Enkel Beräkning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatisk beräkning av moms och vinst. Inga komplicerade formler att komma ihåg.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Översiktlig Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Se din ekonomiska situation på en överblick. Totala intäkter, utgifter och vinst.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Säker & Privat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Din data är säker och privat. Endast du har tillgång till din bokföring.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Kom igång idag</CardTitle>
              <CardDescription>
                Skapa ditt konto och börja hantera din bokföring på minuter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full"
                size="lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                Skapa konto
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')} 
                className="w-full"
              >
                Logga in
              </Button>
              <div className="text-sm text-gray-500">
                Eller{' '}
                <button 
                  onClick={handleDemoLogin}
                  className="text-primary hover:underline"
                >
                  prova demo-kontot
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
                          <p>Perfekt för handgjorda väskor, företag och enskild firma</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 