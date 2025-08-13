import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const appUrl = (import.meta.env.VITE_PUBLIC_APP_URL || import.meta.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')) as string;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error('Inloggning misslyckades', {
        description: error.message,
      });
    } else {
      toast.success('Välkommen tillbaka!');
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(email, password);
    
    if (error) {
      toast.error('Registrering misslyckades', {
        description: error.message,
      });
    } else {
      toast.success('Konto skapat!', {
        description: 'Kontrollera din e-post för att verifiera ditt konto.',
      });
    }
    
    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${appUrl}/auth/reset-password`,
    });
    
    if (error) {
      toast.error('Återställning misslyckades', {
        description: error.message,
      });
    } else {
      toast.success('Återställningslänk skickad!', {
        description: 'Kontrollera din e-post för instruktioner.',
      });
      setShowResetDialog(false);
      setResetEmail('');
    }
    
    setResetLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--light-gray))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-[hsl(var(--teal-primary))] hover:text-[hsl(var(--teal-secondary))] mb-6 font-medium">
            ← Tillbaka till startsidan
          </Link>
        </div>
        <div className="text-center">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-[hsl(var(--teal-primary))]" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-[hsl(var(--dark-navy))]">BizPal</h2>
          <p className="mt-2 text-sm text-gray-600">
            Logga in på ditt BizPal-konto
          </p>
        </div>

        <Card className="finpay-card">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl">
              <TabsTrigger value="signin">Logga in</TabsTrigger>
              <TabsTrigger value="signup">Registrera</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Logga in</CardTitle>
                <CardDescription>
                  Logga in på ditt befintliga konto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="email">E-post</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="din@email.se"
                      className="rounded-xl border-gray-200 focus:border-[hsl(var(--teal-primary))] focus:ring-[hsl(var(--teal-primary))]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Lösenord</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="rounded-xl border-gray-200 focus:border-[hsl(var(--teal-primary))] focus:ring-[hsl(var(--teal-primary))]"
                    />
                  </div>
                  <Button type="submit" className="w-full finpay-button-primary h-12" disabled={loading}>
                    {loading ? 'Loggar in...' : 'Logga in'}
                  </Button>
                  
                  <div className="text-center">
                    <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                      <DialogTrigger asChild>
                        <Button variant="link" className="text-sm">
                          Glömt lösenord?
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Återställ lösenord</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                          <div>
                            <Label htmlFor="reset-email">E-post</Label>
                            <Input
                              id="reset-email"
                              type="email"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                              placeholder="din@email.se"
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={resetLoading}>
                            {resetLoading ? 'Skickar...' : 'Skicka återställningslänk'}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Skapa konto</CardTitle>
                <CardDescription>
                  Registrera dig för att komma igång
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email">E-post</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="din@email.se"
                      className="rounded-xl border-gray-200 focus:border-[hsl(var(--teal-primary))] focus:ring-[hsl(var(--teal-primary))]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Lösenord</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      minLength={6}
                      className="rounded-xl border-gray-200 focus:border-[hsl(var(--teal-primary))] focus:ring-[hsl(var(--teal-primary))]"
                    />
                  </div>
                  <Button type="submit" className="w-full finpay-button-primary h-12" disabled={loading}>
                    {loading ? 'Skapar konto...' : 'Skapa konto'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};