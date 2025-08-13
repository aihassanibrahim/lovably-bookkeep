import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Save, User, Building2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  company_name: string;
  contact_person: string;
  company_email: string;
  company_phone: string;
  company_address: string;
}

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile>({
    company_name: '',
    contact_person: '',
    company_email: '',
    company_phone: '',
    company_address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setProfile({
          company_name: data.company_name || '',
          contact_person: data.contact_person || '',
          company_email: data.company_email || '',
          company_phone: data.company_phone || '',
          company_address: data.company_address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Kunde inte hämta profil');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Profil sparad!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Kunde inte spara profil');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Laddar inställningar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inställningar</h1>
          <p className="text-gray-600">
            Hantera din profil och företagsinformation
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* User Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Användarkonto
            </CardTitle>
            <CardDescription>
              Din inloggningsinformation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>E-postadress</Label>
              <Input
                value={user?.email || ''}
                disabled
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">
                Din e-postadress kan inte ändras
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={signOut}
              className="w-full"
            >
              Logga ut
            </Button>
          </CardContent>
        </Card>

        {/* Company Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Företagsinformation
            </CardTitle>
            <CardDescription>
              Information om ditt företag
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company_name">Företagsnamn</Label>
              <Input
                id="company_name"
                value={profile.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Ditt företagsnamn"
              />
            </div>

            <div>
              <Label htmlFor="contact_person">Kontaktperson</Label>
              <Input
                id="contact_person"
                value={profile.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
                placeholder="Ditt namn"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_email">E-post</Label>
                <Input
                  id="company_email"
                  type="email"
                  value={profile.company_email}
                  onChange={(e) => handleInputChange('company_email', e.target.value)}
                  placeholder="info@företag.se"
                />
              </div>
              <div>
                <Label htmlFor="company_phone">Telefon</Label>
                <Input
                  id="company_phone"
                  value={profile.company_phone}
                  onChange={(e) => handleInputChange('company_phone', e.target.value)}
                  placeholder="070-123 45 67"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company_address">Adress</Label>
              <Input
                id="company_address"
                value={profile.company_address}
                onChange={(e) => handleInputChange('company_address', e.target.value)}
                placeholder="Gatan 1, 12345 Stockholm"
              />
            </div>

            <Button 
              onClick={saveProfile} 
              disabled={saving}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Sparar...' : 'Spara ändringar'}
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>Om BizPal</CardTitle>
            <CardDescription>
              Applikationsinformation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Senast uppdaterad:</span>
                <span className="font-medium">2025-01-06</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Support:</span>
                <a 
                  href="mailto:support@bizpal.se" 
                  className="font-medium text-blue-600 hover:underline"
                >
                  support@bizpal.se
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}