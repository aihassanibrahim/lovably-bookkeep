import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save, Percent, Smartphone } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigation } from "@/context/NavigationContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
interface UserSettings {
  moms_sats: number;
  skatt_sats: number;
}

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>({
    moms_sats: 25,
    skatt_sats: 30
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { mobileNavItems, updateMobileNavItems, saveMobileNavPreferences } = useNavigation();

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setSettings({
          moms_sats: data.moms_sats || 25,
          skatt_sats: data.skatt_sats || 30
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Kunde inte hämta inställningar');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('settings')
        .upsert({
          user_id: user?.id,
          moms_sats: settings.moms_sats,
          skatt_sats: settings.skatt_sats
        });

      if (error) throw error;

      toast.success('Inställningar sparade!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Kunde inte spara inställningar');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserSettings, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSettings(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleNavItemToggle = (itemName: string, enabled: boolean) => {
    const updatedItems = mobileNavItems.map(item => 
      item.name === itemName ? { ...item, enabled } : item
    );
    updateMobileNavItems(updatedItems);
  };

  const saveNavPreferences = async () => {
    try {
      await saveMobileNavPreferences();
      toast.success('Navigationsinställningar sparade!');
    } catch (error) {
      toast.error('Kunde inte spara navigationsinställningar');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Inställningar</h1>
              <p className="text-muted-foreground">Laddar inställningar...</p>
            </div>
          </div>
          <Card>
            <CardContent className="py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </CardContent>
          </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Inställningar</h1>
            <p className="text-muted-foreground">
              Hantera dina bokföringsinställningar och skattesatser
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Skattesatser
              </CardTitle>
              <CardDescription>
                Ange dina moms- och skattesatser för korrekt beräkning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="moms_sats" className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Momsats (%)
                </Label>
                <Input
                  id="moms_sats"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.moms_sats}
                  onChange={(e) => handleInputChange('moms_sats', e.target.value)}
                  placeholder="25"
                />
                <p className="text-sm text-muted-foreground">
                  Standard momsats i Sverige är 25%
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skatt_sats" className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Skattesats (%)
                </Label>
                <Input
                  id="skatt_sats"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.skatt_sats}
                  onChange={(e) => handleInputChange('skatt_sats', e.target.value)}
                  placeholder="30"
                />
                <p className="text-sm text-muted-foreground">
                  Din personliga skattesats för vinstberäkning
                </p>
              </div>

              <Button 
                onClick={saveSettings} 
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Sparar...' : 'Spara inställningar'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
              <CardDescription>
                Så här fungerar beräkningarna
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Momsberäkning</h4>
                <p className="text-sm text-muted-foreground">
                  Summa med moms = Summa utan moms × (1 + momsats/100)
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Vinstberäkning</h4>
                <p className="text-sm text-muted-foreground">
                  Vinst före skatt = Totala intäkter - Totala utgifter
                </p>
                <p className="text-sm text-muted-foreground">
                  Vinst efter skatt = Vinst före skatt × (1 - skattesats/100)
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Exempel</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Försäljning: 1000 kr utan moms</p>
                  <p>• Med 25% moms: 1250 kr</p>
                  <p>• Vinst efter 30% skatt: 875 kr</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Mobilnavigering
            </CardTitle>
            <CardDescription>
              Anpassa vilka sidor som ska visas i den nedre menyn på mobil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {mobileNavItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(enabled) => handleNavItemToggle(item.name, enabled)}
                  />
                </div>
              ))}
            </div>
            <Button 
              onClick={saveNavPreferences}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Spara navigationsinställningar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuvarande inställningar</CardTitle>
            <CardDescription>
              Dina aktiva bokföringsinställningar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Momsats</span>
                  <span className="text-2xl font-bold text-green-600">
                    {settings.moms_sats}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Används för alla momsberäkningar
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Skattesats</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {settings.skatt_sats}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Används för vinstberäkning
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
} 