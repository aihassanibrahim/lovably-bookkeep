import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Check, 
  Package, 
  Users, 
  TrendingUp, 
  Shield,
  Zap,
  BarChart3,
  CreditCard,
  Building2,
  Star,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MobileNav } from '@/components/ui/mobile-nav';

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-[hsl(var(--teal-primary))]" />
              <span className="ml-2 text-xl font-bold text-[hsl(var(--dark-navy))]">BizPal</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('funktioner')}
                className="text-gray-600 hover:text-[hsl(var(--dark-navy))] transition-colors font-medium"
              >
                Funktioner
              </button>
              <button 
                onClick={() => scrollToSection('priser')}
                className="text-gray-600 hover:text-[hsl(var(--dark-navy))] transition-colors font-medium"
              >
                Priser
              </button>
              <button 
                onClick={() => scrollToSection('om-oss')}
                className="text-gray-600 hover:text-[hsl(var(--dark-navy))] transition-colors font-medium"
              >
                Om oss
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-gray-600 hover:text-[hsl(var(--dark-navy))] transition-colors font-medium"
              >
                FAQ
              </button>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleLoginClick}
                className="text-gray-600 hover:text-[hsl(var(--dark-navy))] hover:bg-gray-50"
              >
                Logga in
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="finpay-button-primary px-6 py-2"
              >
                Kom igång gratis
              </Button>
            </div>

            {/* Mobile Menu */}
            <MobileNav 
              onNavigate={scrollToSection}
              onLoginClick={handleLoginClick}
              onCTAClick={handleGetStarted}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-black text-finpay-navy leading-tight tracking-tight">
                  Hantera ordrar enkelt,
                  <br />
                  <span className="text-finpay-teal">spara tid automatiskt</span>
                  <br />
                  för ditt företag.
                </h1>
                <p className="text-xl text-finpay-gray-medium max-w-lg leading-relaxed">
                  Stöd små företag med enkel orderhantering, kraftfulla integrationer och verktyg för kassaflödeshantering.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                <Input
                  type="email"
                  placeholder="Din företags-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 rounded-xl border-gray-200 focus:border-[hsl(var(--teal-primary))] focus:ring-[hsl(var(--teal-primary))]"
                />
                <Button 
                  onClick={handleGetStarted}
                  className="bg-finpay-teal hover:bg-finpay-teal-dark text-white h-12 px-8 rounded-xl font-semibold whitespace-nowrap transition-all duration-200"
                >
                  Kom igång
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Building2 className="h-4 w-4" />
                  <span>Svenskt företag</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>GDPR-säkert</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="h-4 w-4" />
                  <span>5-stjärnigt stöd</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 max-w-sm mx-auto lg:mx-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-finpay-teal rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-600">Dina ordrar</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-0">Aktiv</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-finpay-navy">
                      234 ordrar
                    </div>
                    <div className="text-sm text-gray-500">April 2024</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Orderhantering</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Kundregister</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>

                  <Button className="w-full bg-finpay-teal hover:bg-finpay-teal-dark text-white h-12 rounded-xl font-semibold">
                    Hantera
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funktioner" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-finpay-teal/10 text-finpay-teal border-0 mb-4 px-4 py-2 rounded-full font-medium">
              FRAMTIDA BETALNING
            </Badge>
            <h2 className="text-4xl font-bold text-finpay-navy mb-6 leading-tight">
              Upplevelse som växer
              <br />
              med din skala.
            </h2>
            <p className="text-xl text-finpay-gray-medium max-w-2xl mx-auto leading-relaxed">
              Designa ett finansiellt operativsystem som fungerar för ditt företag och strömlinjeforma kassaflödeshantering
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-finpay-gray-light rounded-2xl flex items-center justify-center mx-auto">
                <CreditCard className="h-8 w-8 text-finpay-teal" />
              </div>
              <h3 className="text-xl font-semibold text-finpay-navy">Gratis överföringar</h3>
              <p className="text-gray-600">
                Skapa en finansiell upplevelse och automatisera återkommande inköp genom att schemalägga återkommande betalningar.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-finpay-gray-light rounded-2xl flex items-center justify-center mx-auto">
                <Building2 className="h-8 w-8 text-finpay-teal" />
              </div>
              <h3 className="text-xl font-semibold text-finpay-navy">Flera konton</h3>
              <p className="text-gray-600">
                Kör dina operationer med kontanter från ditt konto och generera årslånga fonder lagrade i ditt konto.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-finpay-gray-light rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-finpay-teal" />
              </div>
              <h3 className="text-xl font-semibold text-finpay-navy">Oöverträffad säkerhet</h3>
              <p className="text-gray-600">
                Hantera säkert dina finanser med din organisation-wide MFA, kortlåsning och avancerade säkerhetskontroller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-finpay-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-finpay-teal/10 text-finpay-teal border-0 mb-4 px-4 py-2 rounded-full font-medium">
              VARFÖR OSS
            </Badge>
            <h2 className="text-4xl font-bold text-finpay-navy mb-6">Varför de föredrar BizPal</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center space-y-4">
              <div className="text-5xl font-black text-finpay-teal">3k+</div>
              <div className="text-sm text-finpay-gray-medium font-medium">Företag som redan kör på BizPal</div>
            </div>

            <div className="text-center space-y-4">
              <div className="text-5xl font-black text-finpay-navy">24%</div>
              <div className="text-sm text-finpay-gray-medium font-medium">Intäktsföretag</div>
            </div>

            <div className="text-center space-y-4">
              <div className="text-5xl font-black text-finpay-navy">180K</div>
              <div className="text-sm text-finpay-gray-medium font-medium">I årlig intäkt</div>
            </div>

            <div className="text-center space-y-4">
              <div className="text-5xl font-black text-finpay-navy">10+</div>
              <div className="text-sm text-finpay-gray-medium font-medium">Månader av landningsbana</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mt-16 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-finpay-navy">Omedelbar uttag av dina medel när som helst</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-finpay-teal rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-finpay-navy">Ingen tillgångsvolatilitet</h3>
              <p className="text-gray-600">
                Generera avkastning på dina kassareserver utan att göra några investeringar.
              </p>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Sammanfattning</span>
                    <span className="text-sm text-gray-500">6 Månader</span>
                  </div>
                  <div className="text-2xl font-bold text-finpay-navy">$1,876,580</div>
                  <div className="h-32 bg-gradient-to-r from-finpay-teal/20 to-finpay-teal/5 rounded-lg flex items-end">
                    <div className="w-full h-16 bg-finpay-teal/30 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="priser" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-finpay-teal/10 text-finpay-teal border-0 mb-4 px-4 py-2 rounded-full font-medium">
              VÄLJ PLAN
            </Badge>
            <h2 className="text-4xl font-bold text-finpay-navy mb-6">
              Vi har hjälpt
              <br />
              innovativa företag
            </h2>
            <p className="text-xl text-finpay-gray-medium max-w-2xl mx-auto">
              Hundratals av alla storlekar och inom alla branscher har gjort stora förbättringar med oss.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-8 relative">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-finpay-navy">Gratis</CardTitle>
                <CardDescription className="text-lg">
                  Perfekt för att komma igång
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="space-y-2">
                  <div className="text-4xl font-black text-finpay-navy">0 kr</div>
                  <div className="text-gray-500">/månad</div>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Upp till 10 ordrar/månad</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Grundläggande kundhantering</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Produktkatalog</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>E-postsupport</span>
                  </li>
                </ul>

                <Button 
                  onClick={handleGetStarted}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-finpay-navy h-12 rounded-xl font-semibold transition-all duration-200"
                >
                  Kom igång gratis
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-white rounded-2xl border-2 border-finpay-teal shadow-xl p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-finpay-teal text-white border-0 px-4 py-2 rounded-full font-semibold">
                  POPULÄR
                </Badge>
              </div>
              
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-finpay-navy">Pro</CardTitle>
                <CardDescription className="text-lg">
                  För växande företag
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="space-y-2">
                  <div className="text-4xl font-black text-finpay-navy">99 kr</div>
                  <div className="text-gray-500">/månad</div>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Obegränsade ordrar</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Avancerad kundhantering</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Rapporter och analys</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Prioriterad support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>API-åtkomst</span>
                  </li>
                </ul>

                <Button 
                  onClick={() => navigate('/pricing')}
                  className="w-full bg-finpay-teal hover:bg-finpay-teal-dark text-white h-12 rounded-xl font-semibold transition-all duration-200"
                >
                  Uppgradera till Pro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-finpay-teal to-finpay-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Badge className="bg-white/20 text-white border-0 mb-4">
              REDO ATT KOMMA IGÅNG
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-6">
              Redo att höja nivån på din
              <br />
              betalningsprocess?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Stöd små företag med enkla faktureringsverktyg, kraftfulla integrationer och verktyg för kassaflödeshantering.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                className="bg-white text-finpay-navy hover:bg-gray-100 h-12 px-8 rounded-xl font-semibold"
              >
                Kom igång nu
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white/10 h-12 px-8 rounded-xl font-semibold"
                onClick={() => scrollToSection('om-oss')}
              >
                Läs mer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="om-oss" className="py-16 lg:py-24 bg-finpay-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-finpay-teal/10 text-finpay-teal border-0 px-4 py-2 rounded-full font-medium">
                  OM BIZPAL
                </Badge>
                <h2 className="text-4xl font-bold text-finpay-navy">
                  Byggt för svenska
                  <br />
                  småföretag
                </h2>
                <p className="text-xl text-finpay-gray-medium">
                  Vi förstår utmaningarna som svenska småföretag står inför. BizPal är designat för att förenkla din orderhantering och hjälpa dig fokusera på det du gör bäst.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-finpay-teal/10 rounded-lg flex items-center justify-center mt-1">
                    <Package className="h-4 w-4 text-finpay-teal" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-finpay-navy">Enkel orderhantering</h4>
                    <p className="text-gray-600">Håll koll på alla dina ordrar från beställning till leverans</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-finpay-teal/10 rounded-lg flex items-center justify-center mt-1">
                    <Users className="h-4 w-4 text-finpay-teal" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-finpay-navy">Kundregister</h4>
                    <p className="text-gray-600">Organisera och hantera alla dina kundkontakter på ett ställe</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-finpay-teal/10 rounded-lg flex items-center justify-center mt-1">
                    <BarChart3 className="h-4 w-4 text-finpay-teal" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-finpay-navy">Insikter och rapporter</h4>
                    <p className="text-gray-600">Få värdefulla insikter om din verksamhet med enkla rapporter</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-finpay-navy">Månadens översikt</h4>
                    <Badge className="bg-green-100 text-green-800 border-0">+12%</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-2xl font-bold text-finpay-navy">47</div>
                      <div className="text-sm text-gray-500">Ordrar</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">23,450 kr</div>
                      <div className="text-sm text-gray-500">Intäkt</div>
                    </div>
                  </div>

                  <div className="h-24 bg-gradient-to-r from-finpay-teal/10 to-finpay-teal/5 rounded-lg flex items-end p-4">
                    <div className="w-full h-12 bg-finpay-teal/30 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-finpay-navy mb-6">Vanliga frågor</h2>
            <p className="text-xl text-finpay-gray-medium">
              Allt du behöver veta om BizPal
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Hur snabbt kan jag komma igång?",
                answer: "Du kan skapa ditt konto och börja använda BizPal på mindre än 5 minuter. Ingen installation eller komplicerad setup krävs."
              },
              {
                question: "Är mina data säkra?",
                answer: "Ja, vi använder bankstandard säkerhet med SSL-kryptering och följer GDPR. Dina data lagras säkert i Sverige."
              },
              {
                question: "Kan jag avbryta när som helst?",
                answer: "Absolut! Du kan avbryta din prenumeration när som helst utan bindningstid eller avgifter."
              },
              {
                question: "Får jag support på svenska?",
                answer: "Ja, vi erbjuder fullständig support på svenska via e-post och chat under kontorstid."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <h4 className="font-semibold text-lg text-finpay-navy">{faq.question}</h4>
                      <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-finpay-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-finpay-teal" />
                <span className="ml-2 text-xl font-bold">BizPal</span>
              </div>
              <p className="text-gray-400">
                Enkel orderhantering för svenska småföretag
              </p>
            </div>

            <div className="space-y-4">
              <h5 className="font-semibold">Lösningar</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Småföretag</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Frilansare</a></li>
                <li><a href="#" className="hover:text-white transition-colors">E-handel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tjänster</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-semibold">Företag</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Om oss</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karriär</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-semibold">Lär dig</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blogg</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guider</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mallar</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 BizPal. Alla rättigheter förbehållna.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Integritetspolicy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Användarvillkor
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;