import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  FileText
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useDemo } from '@/context/DemoContext';
import { toast } from 'sonner';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

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
      id: 'demo-mode',
      title: 'Testa systemet',
      description: 'Aktivera demo-läge för att utforska funktioner',
      icon: Settings,
      completed: completedSteps.includes('demo-mode'),
      component: DemoModeStep
    },
    {
      id: 'first-customer',
      title: 'Lägg till din första kund',
      description: 'Skapa en kund för att komma igång',
      icon: Users,
      completed: completedSteps.includes('first-customer'),
      component: FirstCustomerStep
    },
    {
      id: 'first-product',
      title: 'Skapa din första produkt',
      description: 'Lägg till en produkt i din katalog',
      icon: Package,
      completed: completedSteps.includes('first-product'),
      component: FirstProductStep
    },
    {
      id: 'first-order',
      title: 'Skapa din första order',
      description: 'Registrera en beställning från sociala medier',
      icon: FileText,
      completed: completedSteps.includes('first-order'),
      component: FirstOrderStep
    },
    {
      id: 'first-transaction',
      title: 'Registrera din första transaktion',
      description: 'Lägg till en intäkt eller utgift',
      icon: DollarSign,
      completed: completedSteps.includes('first-transaction'),
      component: FirstTransactionStep
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

  const progress = (completedSteps.length / steps.length) * 100;

  const markStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
            Steg {currentStep + 1} av {steps.length} - {Math.round(progress)}% klart
          </p>
        </CardHeader>
        
        <CardContent>
          {/* Step Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : index === currentStep ? (
                      <step.icon className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-0.5 bg-muted mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <CurrentStepComponent 
            onComplete={() => markStepComplete(steps[currentStep].id)}
            onNext={nextStep}
            onPrev={prevStep}
            isLastStep={currentStep === steps.length - 1}
            isFirstStep={currentStep === 0}
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

const DemoModeStep: React.FC<{
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}> = ({ onComplete, onNext, onPrev }) => {
  const { isDemoMode, enableDemoMode } = useDemo();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Testa systemet först</h2>
        <p className="text-muted-foreground">
          Aktivera demo-läge för att utforska alla funktioner utan att spara permanent data.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Demo-läge</h3>
            <p className="text-sm text-muted-foreground">
              Testa alla funktioner med exempeldata
            </p>
          </div>
          <Badge variant={isDemoMode ? "default" : "secondary"}>
            {isDemoMode ? "Aktiverat" : "Inaktiverat"}
          </Badge>
        </div>
        
        {!isDemoMode && (
          <Button 
            onClick={() => { enableDemoMode(); onComplete(); }} 
            className="mt-4"
            variant="outline"
          >
            Aktivera demo-läge
          </Button>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <Button onClick={onNext}>
          Fortsätt
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const FirstCustomerStep: React.FC<{
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}> = ({ onComplete, onNext, onPrev }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Lägg till din första kund</h2>
        <p className="text-muted-foreground">
          Skapa en kund för att kunna registrera ordrar och transaktioner.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Exempel: Anna Andersson</h3>
              <p className="text-sm text-muted-foreground">
                @anna_handmade • anna@example.com • 070-123 45 67
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Du kan lägga till kunder senare i "Kunder"-sektionen.
          </p>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <Button onClick={() => { onComplete(); onNext(); }}>
          Fortsätt
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const FirstProductStep: React.FC<{
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}> = ({ onComplete, onNext, onPrev }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Skapa din första produkt</h2>
        <p className="text-muted-foreground">
          Lägg till produkter i din katalog för att kunna skapa ordrar.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Package className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Exempel: Handgjord halsband</h3>
              <p className="text-sm text-muted-foreground">
                Kategori: Smycken • Pris: 299 SEK
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Du kan lägga till produkter senare i "Produkter"-sektionen.
          </p>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <Button onClick={() => { onComplete(); onNext(); }}>
          Fortsätt
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const FirstOrderStep: React.FC<{
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}> = ({ onComplete, onNext, onPrev }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Skapa din första order</h2>
        <p className="text-muted-foreground">
          Registrera beställningar från sociala medier och håll koll på leveranser.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Exempel: ORD-001</h3>
              <p className="text-sm text-muted-foreground">
                Anna Andersson • Handgjord halsband • 299 SEK • Status: Beställd
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Du kan skapa ordrar senare i "Ordrar"-sektionen eller via Quick Actions.
          </p>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <Button onClick={() => { onComplete(); onNext(); }}>
          Fortsätt
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const FirstTransactionStep: React.FC<{
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}> = ({ onComplete, onNext, onPrev }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Registrera din första transaktion</h2>
        <p className="text-muted-foreground">
          Lägg till intäkter och utgifter för att hålla koll på din ekonomi.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <DollarSign className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Exempel: Försäljning halsband</h3>
              <p className="text-sm text-muted-foreground">
                Intäkt: 299 SEK • Kategori: Försäljning • Datum: Idag
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Du kan registrera transaktioner via Quick Actions eller i "Transaktioner"-sektionen.
          </p>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <Button onClick={() => { onComplete(); onNext(); }}>
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
}> = ({ onComplete, onPrev }) => {
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

      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <Button 
          onClick={() => { 
            onComplete(); 
            localStorage.setItem('bizpal-onboarding-completed', 'true');
            window.location.href = '/';
          }}
          className="px-8"
        >
          Börja använda BizPal
        </Button>
      </div>
    </div>
  );
};

export default OnboardingWizard; 