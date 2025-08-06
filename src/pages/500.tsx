import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Error500: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">500 - Serverfel</CardTitle>
          <CardDescription>
            Ett internt serverfel har uppstått. Vi arbetar på att lösa problemet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>Vad kan du göra?</strong>
            </p>
            <ul className="mt-2 text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Vänta några minuter och försök igen</li>
              <li>• Kontrollera din internetanslutning</li>
              <li>• Kontakta support om problemet kvarstår</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleRefresh} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Ladda om sidan
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Gå hem
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Behöver hjälp?
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:support@bizpal.se">
                <Mail className="h-4 w-4 mr-2" />
                Kontakta support
              </a>
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <p>Fel-ID: {Date.now()}</p>
            <p>Tid: {new Date().toLocaleString('sv-SE')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Error500; 