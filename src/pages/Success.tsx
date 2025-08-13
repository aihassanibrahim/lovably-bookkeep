import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Success() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate loading time to show success state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Bearbetar din betalning...
            </h3>
            <p className="text-gray-600 text-center">
              Vi bekräftar din beställning, vänta ett ögonblick.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Betalning genomförd!</CardTitle>
            <CardDescription>
              Tack för ditt köp. Din beställning har bekräftats.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sessionId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Session ID:</strong> {sessionId}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Vad händer nu?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Du får en bekräftelse via e-post</li>
                  <li>• Ditt konto aktiveras automatiskt</li>
                  <li>• Du kan börja använda alla funktioner direkt</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  Gå till Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link to="/">
                  Tillbaka till startsidan
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Behöver du hjälp?{' '}
                <a 
                  href="mailto:support@bizpal.se" 
                  className="text-blue-600 hover:underline"
                >
                  Kontakta support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}