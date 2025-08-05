import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Users, 
  Mail, 
  MessageSquare, 
  HelpCircle, 
  CheckCircle, 
  Zap,
  BookOpen,
  Calculator,
  FileText,
  BarChart3
} from 'lucide-react';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';

export default function About() {
  const features = [
    {
      icon: BookOpen,
      title: 'Enkel bokföring',
      description: 'Dubbel bokföring som automatiskt hanterar moms och konton'
    },
    {
      icon: Calculator,
      title: 'Transaktioner',
      description: 'Registrera inkomster och utgifter med smart kategorisering'
    },
    {
      icon: FileText,
      title: 'Kvittoscanning',
      description: 'Fotografera kvitton och få automatiskt dataextraktion'
    },
    {
      icon: BarChart3,
      title: 'Rapporter',
      description: 'Få insikter om din ekonomi med detaljerade rapporter'
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: 'Krypterad data',
      description: 'All data krypteras både under överföring och lagring'
    },
    {
      icon: Lock,
      title: 'GDPR-kompatibel',
      description: 'Vi följer svenska och europeiska dataskyddsregler'
    },
    {
      icon: Users,
      title: 'Isolerad data',
      description: 'Varje användares data är helt isolerad från andra'
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'E-post',
      description: 'support@bizpal.se',
      action: () => window.open('mailto:support@bizpal.se', '_blank'),
      buttonText: 'Skicka mail'
    },
    {
      icon: MessageSquare,
      title: 'Feedback',
      description: 'Rapportera problem eller förslag',
      action: () => {},
      buttonText: 'Öppna formulär',
      component: <FeedbackForm />
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Vanliga frågor och svar',
      action: () => window.location.href = '/faq',
      buttonText: 'Visa FAQ'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Om BizPal</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          BizPal är en modern bokföringsapp skapad för svenska småföretagare. 
          Vi gör det enkelt att hålla koll på din ekonomi med smarta funktioner och enkel användning.
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="mb-12">
        <CardContent className="pt-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Vårt uppdrag</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Vi tror att småföretagare ska kunna fokusera på att driva sitt företag, 
              inte på komplicerad bokföring. Därför har vi skapat BizPal - en app som 
              gör bokföring enkelt, snabbt och säkert.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-8">Vad BizPal kan göra</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Security Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-8">Säkerhet & Förtroende</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Icon className="h-8 w-8 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Why Choose BizPal */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-center">Varför välja BizPal?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium">Enkel att använda</h4>
                  <p className="text-sm text-muted-foreground">Intuitivt gränssnitt som fungerar på alla enheter</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium">Svensk moms</h4>
                  <p className="text-sm text-muted-foreground">Automatisk hantering av svenska momsatser (0%, 6%, 12%, 25%)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium">Säker molnlagring</h4>
                  <p className="text-sm text-muted-foreground">Din data synkroniseras automatiskt och är alltid tillgänglig</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium">Kvittoscanning</h4>
                  <p className="text-sm text-muted-foreground">Fotografera kvitton med mobilen för automatisk dataextraktion</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium">Export-funktioner</h4>
                  <p className="text-sm text-muted-foreground">Exportera data i CSV, PDF eller SIE-format för din revisor</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium">Svensk support</h4>
                  <p className="text-sm text-muted-foreground">Få hjälp på svenska när du behöver det</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-8">Kontakta oss</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                    {method.component ? (
                      method.component
                    ) : (
                      <Button onClick={method.action} variant="outline">
                        {method.buttonText}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Företagsinformation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 text-center">
            <div>
              <h4 className="font-semibold mb-2">BizPal AB</h4>
              <p className="text-sm text-muted-foreground">
                Org.nr: 123456-7890<br />
                Stockholm, Sverige<br />
                support@bizpal.se
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Teknisk information</h4>
              <p className="text-sm text-muted-foreground">
                Byggd med React & TypeScript<br />
                Säker molnlagring via Supabase<br />
                GDPR-kompatibel
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 