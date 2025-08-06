import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft,
  User,
  Package,
  DollarSign,
  Settings,
  Building2,
  Users,
  FileText,
  CreditCard,
  Check
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useDemo } from '@/context/DemoContext';
import { redirectToCheckout } from '@/lib/stripe-client';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  component: React.ComponentType<any>;
}

const OnboardingWizard: React.FC = () => {
  const { user } = useAuth();
  const { isDemoMode, enableDemoMode } = useDemo();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle Stripe return from payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');
    const plan = urlParams.get('plan');

    if (success === 'true' && plan === 'pro') {
      // Payment successful, continue to step 5 (workspace setup)
      setCurrentStep(4); // Step 5 (0-indexed)
      setCompletedSteps(prev => [...prev, 'payment']);
      toast.success('Betalning slutförd! Fortsätt med onboarding.');
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled === 'true') {
      // Payment canceled, go back to step 3 (plan selection)
      setCurrentStep(2); // Step 3 (0-indexed)
      toast.error('Betalning avbröts. Välj en annan plan eller försök igen.');
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  // Form data for company information
  const [companyData, setCompanyData] = useState({
    company_name: '',
    company_org_number: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    contact_person: '',
    industry: '',
    company_size: '',
  });

  // Plan selection
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Välkommen till BizPal!',
      description: 'Låt oss komma igång med din bokföring',
      icon: User,
      completed: completedSteps.includes('welcome'),
      component: WelcomeStep
    },
    {
      id: 'company-info',
      title: 'Företagsinformation',
      description: 'Berätta om ditt företag',
      icon: Building2,
      completed: completedSteps.includes('company-info'),
      component: CompanyInfoStep
    },
    {
      id: 'plan-selection',
      title: 'Välj din plan',
      description: 'Välj mellan free och pro',
      icon: CreditCard,
      completed: completedSteps.includes('plan-selection'),
      component: PlanSelectionStep
    },
    {
      id: 'payment',
      title: 'Betalning',
      description: 'Slutför din prenumeration',
      icon: DollarSign,
      completed: completedSteps.includes('payment'),
      component: PaymentStep
    },
    {
      id: 'workspace-setup',
      title: 'Workspace setup',
      description: 'Konfigurera ditt arbetsutrymme',
      icon: Settings,
      completed: completedSteps.includes('workspace-setup'),
      component: WorkspaceSetupStep
    },
    {
      id: 'complete',
      title: 'Du är redo att börja!',
      description: 'Allt är uppsatt och du kan börja använda BizPal',
      icon: CheckCircle,
      completed: completedSteps.includes('complete'),
      component: CompleteStep
    }
  ];

  // Fix progress calculation - CORRECTED
  const totalSteps = selectedPlan === 'free' ? 5 : 6; // Free plan skips payment step
  const progress = Math.min(100, Math.round((currentStep / (totalSteps - 1)) * 100));

  const markStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const nextStep = () => {
    // Fix step navigation - CORRECTED
    if (selectedPlan === 'free') {
      // For free plan, skip payment step
      if (currentStep === 2) { // After plan selection
        setCurrentStep(4); // Go directly to workspace setup
      } else if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // For Pro plan, normal flow
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

    const handleCompleteOnboarding = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('Starting onboarding completion for user:', user.id);
      console.log('Company data:', companyData);
      
      // Save company information to profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...companyData,
          onboarding_completed: true,
          onboarding_step: steps.length,
        }, {
          onConflict: 'user_id'
        });

      console.log('Profile upsert result:', { data: profileData, error: profileError });

      if (profileError) {
        console.error('Profile error:', profileError);
        throw profileError;
      }

      // Create free subscription if free plan was selected
      if (selectedPlan === 'free') {
        console.log('Creating free subscription for user:', user.id);
        
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: user.id,
            plan_id: 'free',
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });

        console.log('Subscription upsert result:', { data: subscriptionData, error: subscriptionError });

        if (subscriptionError) {
          console.error('Error creating free subscription:', subscriptionError);
          // Don't throw here, continue with onboarding completion
        }
      }

             // Mark onboarding as completed
       markStepComplete('complete');
       
       // Also set localStorage as fallback
       localStorage.setItem('onboarding_completed', 'true');
       
       console.log('Onboarding completed successfully:', {
         userId: user.id,
         localStorageSet: localStorage.getItem('onboarding_completed'),
         redirectingTo: '/'
       });
       
       toast.success('Onboarding slutförd!');
      
       // Redirect to dashboard immediately - FIXED
       setTimeout(() => {
         console.log('Redirecting to dashboard...');
         window.location.href = '/';
       }, 1000);
      
         } catch (error) {
       console.error('Error completing onboarding:', error);
       
       // Even if database update fails, set localStorage and redirect
       console.log('Database update failed, using localStorage fallback');
       localStorage.setItem('onboarding_completed', 'true');
       
       toast.success('Onboarding slutförd! (Fallback mode)');
       
       // Redirect to dashboard even if database failed
       setTimeout(() => {
         console.log('Redirecting to dashboard (fallback mode)...');
         window.location.href = '/';
       }, 1000);
     } finally {
       setLoading(false);
     }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">BizPal Onboarding</h1>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            Steg {currentStep + 1} av {totalSteps} - {progress}% klart
          </p>
        </CardHeader>
        
        <CardContent>
          {/* Step Navigation - CORRECTED */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {steps.map((step, index) => {
                // Skip payment step for free plan
                if (selectedPlan === 'free' && step.id === 'payment') {
                  return null;
                }
                
                const isCompleted = currentStep > index;
                const isCurrent = currentStep === index;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium">
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : isCurrent ? (
                        <step.icon className="h-4 w-4 text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    {index < steps.length - 1 && !(selectedPlan === 'free' && step.id === 'payment') && (
                      <div className="w-8 h-0.5 bg-muted mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Step Content */}
          <CurrentStepComponent
            onComplete={() => {
              markStepComplete(steps[currentStep].id);
              if (currentStep < steps.length - 1) {
                nextStep();
              }
            }}
            onNext={nextStep}
            onPrev={prevStep}
            isLastStep={currentStep === steps.length - 1}
            isFirstStep={currentStep === 0}
            companyData={companyData}
            setCompanyData={setCompanyData}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            onCompleteOnboarding={handleCompleteOnboarding}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

// Step Components
const WelcomeStep: React.FC<{
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}> = ({ onComplete, onNext }) => {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Välkommen till BizPal! 🎉</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          BizPal hjälper dig att hantera din bokföring och affärsverksamhet på ett enkelt sätt. 
          Låt oss gå igenom några snabba steg för att få dig igång.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="p-4 border rounded-lg">
          <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold">Orderhantering</h3>
          <p className="text-sm text-muted-foreground">Hantera beställningar från sociala medier</p>
        </div>
        <div className="p-4 border rounded-lg">
          <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold">Bokföring</h3>
          <p className="text-sm text-muted-foreground">Enkel registrering av intäkter och utgifter</p>
        </div>
        <div className="p-4 border rounded-lg">
          <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold">Kundhantering</h3>
          <p className="text-sm text-muted-foreground">Håll koll på dina kunder och leverantörer</p>
        </div>
      </div>

      <Button onClick={() => { onComplete(); onNext(); }} className="mt-6">
        Kom igång
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

const CompanyInfoStep: React.FC<{
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  companyData: any;
  setCompanyData: (data: any) => void;
}> = ({ onComplete, onPrev, companyData, setCompanyData }) => {
  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Berätta om ditt företag</h2>
        <p className="text-muted-foreground">
          Vi behöver lite grundläggande information för att anpassa BizPal för ditt företag.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company_name">Företagsnamn *</Label>
            <Input
              id="company_name"
              value={companyData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              placeholder="Ditt företagsnamn"
              required
            />
          </div>
          <div>
            <Label htmlFor="company_org_number">Organisationsnummer</Label>
            <Input
              id="company_org_number"
              value={companyData.company_org_number}
              onChange={(e) => handleInputChange('company_org_number', e.target.value)}
              placeholder="123456-7890"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="company_address">Adress</Label>
          <Input
            id="company_address"
            value={companyData.company_address}
            onChange={(e) => handleInputChange('company_address', e.target.value)}
            placeholder="Gatan 1, 12345 Stockholm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company_phone">Telefon</Label>
            <Input
              id="company_phone"
              value={companyData.company_phone}
              onChange={(e) => handleInputChange('company_phone', e.target.value)}
              placeholder="070-123 45 67"
            />
          </div>
          <div>
            <Label htmlFor="company_email">E-post</Label>
            <Input
              id="company_email"
              type="email"
              value={companyData.company_email}
              onChange={(e) => handleInputChange('company_email', e.target.value)}
              placeholder="info@företag.se"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact_person">Kontaktperson</Label>
            <Input
              id="contact_person"
              value={companyData.contact_person}
              onChange={(e) => handleInputChange('contact_person', e.target.value)}
              placeholder="Ditt namn"
            />
          </div>
          <div>
            <Label htmlFor="industry">Bransch</Label>
            <Input
              id="industry"
              value={companyData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder="Handel, tillverkning, etc."
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
          <Button type="submit">
            Fortsätt
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
};

const PlanSelectionStep: React.FC<{
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  selectedPlan: 'free' | 'pro';
  setSelectedPlan: (plan: 'free' | 'pro') => void;
}> = ({ onComplete, onPrev, selectedPlan, setSelectedPlan }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Välj din plan</h2>
        <p className="text-muted-foreground">
          Välj den plan som passar ditt företag bäst. Du kan alltid uppgradera senare.
        </p>
      </div>

      <RadioGroup value={selectedPlan} onValueChange={(value: 'free' | 'pro') => setSelectedPlan(value)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className={`cursor-pointer transition-all ${selectedPlan === 'free' ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free" className="text-lg font-semibold">Free</Label>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">0 kr/månad</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Bokföring
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Kundregister
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Upp till 10 transaktioner/månad
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Upp till 5 kunder
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Grundläggande rapporter
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  E-post support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${selectedPlan === 'pro' ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pro" id="pro" />
                <Label htmlFor="pro" className="text-lg font-semibold">Pro</Label>
                <Badge variant="secondary">Populärast</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">299 kr/månad</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Allt i Free-planen
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Kvittoscanning
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Momsrapportering
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Obegränsade transaktioner
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Obegränsade kunder
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Avancerade rapporter
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Export till Excel/PDF
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Prioriterad support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </RadioGroup>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <Button onClick={onComplete}>
          Fortsätt
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const PaymentStep: React.FC<{
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  selectedPlan: 'free' | 'pro';
}> = ({ onComplete, onPrev, selectedPlan }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (selectedPlan === 'free') {
      // For free plan, just continue to next step
      onComplete();
      return;
    }

    setLoading(true);
    try {
      console.log('Starting Pro plan payment...');
      // Call the real Stripe checkout API endpoint for Pro plan
      await redirectToCheckout('pro', user?.id || '');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Kunde inte starta betalningsprocessen');
      setLoading(false);
    }
  };

  if (selectedPlan === 'free') {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h2 className="text-2xl font-bold">Free plan vald!</h2>
          <p className="text-muted-foreground">
            Du har valt den free planen. Du kan alltid uppgradera till Pro senare.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
          <Button onClick={onComplete}>
            Fortsätt
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <CreditCard className="h-16 w-16 text-primary mx-auto" />
        <h2 className="text-2xl font-bold">Slutför din prenumeration</h2>
        <p className="text-muted-foreground">
          Du kommer att skickas till Stripe för att slutföra din Pro-prenumeration för 99 kr/månad.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Pro Plan - 99 kr/månad</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Obegränsade transaktioner</li>
          <li>• Kvittoscanning</li>
          <li>• Momsrapportering</li>
          <li>• Export-funktioner</li>
          <li>• Prioriterad support</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <Button onClick={handlePayment} disabled={loading}>
          {loading ? 'Laddar...' : 'Fortsätt till betalning'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const WorkspaceSetupStep: React.FC<{
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  selectedPlan: 'free' | 'pro';
}> = ({ onComplete, onPrev, selectedPlan }) => {
  return (
    <div className="space-y-6">
              <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Workspace setup</h2>
          <p className="text-muted-foreground">
            Vi konfigurerar ditt arbetsutrymme med grundläggande inställningar.
          </p>
          {/* Only show payment success message for Pro plan */}
          {selectedPlan === 'pro' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Betalning slutförd!</span>
              </div>
            </div>
          )}
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Grundläggande inställningar</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Svensk moms (25%, 12%, 6%, 0%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">SEK som valuta</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Europe/Stockholm tidszon</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Svenska som språk</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Standardkonton</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Kassa</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Bankkonto</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Försäljning</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Kostnader</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <Button onClick={onComplete}>
          Fortsätt
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const CompleteStep: React.FC<{
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  onCompleteOnboarding: () => void;
  loading: boolean;
}> = ({ onPrev, onCompleteOnboarding, loading }) => {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold">Du är redo att börja! 🎉</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Allt är uppsatt och du kan nu börja använda BizPal för att hantera din bokföring och affärsverksamhet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">💡 Tips för att komma igång</h3>
          <ul className="text-sm text-muted-foreground space-y-1 text-left">
            <li>• Använd Quick Actions för snabba åtgärder</li>
            <li>• Kolla dashboarden för översikt</li>
            <li>• Lägg till dina första kunder och produkter</li>
            <li>• Registrera ordrar och transaktioner</li>
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">🔧 Hjälp och support</h3>
          <ul className="text-sm text-muted-foreground space-y-1 text-left">
            <li>• FAQ för vanliga frågor</li>
            <li>• Inställningar för anpassning</li>
            <li>• Demo-läge för testning</li>
            <li>• Support-knapp för hjälp</li>
          </ul>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <Button 
          onClick={onCompleteOnboarding}
          disabled={loading}
          className="ml-4 px-8"
        >
          {loading ? 'Slutför...' : 'Börja använda BizPal'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingWizard; 