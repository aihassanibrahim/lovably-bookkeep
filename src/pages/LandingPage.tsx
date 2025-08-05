import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  ShoppingCart, 
  Clock, 
  Package, 
  Warehouse, 
  Users, 
  Truck, 
  CreditCard, 
  BarChart3, 
  Home,
  Check,
  Star,
  ArrowRight,
  Menu,
  X,
  Zap,
  Shield,
  TrendingUp,
  Building2
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Here you would typically handle the signup
    console.log('Signup with email:', email);
  };

  const features = [
    {
      icon: ShoppingCart,
      title: "Orderhantering",
      description: "Ta emot och hantera beställningar från sociala medier enkelt",
      color: "text-pink-600"
    },
    {
      icon: Clock,
      title: "Produktionsplanering",
      description: "Planera och följa upp alla produktionsuppgifter",
      color: "text-purple-600"
    },
    {
      icon: Package,
      title: "Produktkatalog",
      description: "Hantera produkter, priser och variationer",
      color: "text-indigo-600"
    },
    {
      icon: Warehouse,
      title: "Lagerhantering",
      description: "Håll koll på material, komponenter och lagervärde",
      color: "text-emerald-600"
    },
    {
      icon: Users,
      title: "Kundregister",
      description: "Samla all kundinfo och orderhistorik på ett ställe",
      color: "text-blue-600"
    },
    {
      icon: Truck,
      title: "Leverantörer",
      description: "Hantera leverantörer och inköpshistorik",
      color: "text-orange-600"
    },
    {
      icon: CreditCard,
      title: "Ekonomi & Bokföring",
      description: "Transaktioner, konton och automatisk momsberäkning",
      color: "text-green-600"
    },
    {
      icon: BarChart3,
      title: "Rapporter & Analys",
      description: "Få insikter om din verksamhet med detaljerade rapporter",
      color: "text-cyan-600"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Registrera dig",
      description: "Kom igång på 2 minuter - ingen kreditkort krävs",
      icon: Zap
    },
    {
      number: "02", 
      title: "Lägg till produkter",
      description: "Bygg din produktkatalog med priser och material",
      icon: Package
    },
    {
      number: "03",
      title: "Ta emot ordrar",
      description: "Hantera hela flödet från order till leverans",
      icon: TrendingUp
    }
  ];

  const faqs = [
    {
      question: "Kan jag importera från andra system?",
      answer: "Ja, vi hjälper dig att migrera data från Excel, andra bokföringssystem och e-handelslösningar. Kontakta vår support så guidar vi dig genom processen."
    },
    {
      question: "Fungerar det för alla typer av företag?",
      answer: "BizPal är perfekt för småföretag som säljer produkter - särskilt handgjorda varor, konst, smycken och andra fysiska produkter. Fungerar för både enskild firma och aktiebolag."
    },
    {
      question: "Vad händer med min data om jag säger upp?",
      answer: "Du äger din data. Vid uppsägning kan du exportera all information och vi raderar dina uppgifter enligt GDPR. Inga dolda avgifter eller låsningar."
    },
    {
      question: "Får jag support på svenska?",
      answer: "Absolut! Vi erbjuder support på svenska via e-post och chat. Vårt team hjälper dig att komma igång och svarar på alla frågor om systemet."
    },
    {
      question: "Kan jag hantera både produkter och tjänster?",
      answer: "Ja, BizPal hanterar både fysiska produkter och tjänster. Du kan sätta upp olika prissättningsmodeller och hantera både lager och tjänstebaserade ordrar."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">BizPal</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Funktioner</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Priser</a>
              <a href="#faq" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</a>
              <ThemeToggle />
              <Button variant="outline" size="sm">Logga in</Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                Prova gratis
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Funktioner</a>
                <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Priser</a>
                <a href="#faq" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</a>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">Logga in</Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                    Prova gratis
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  Nyhet: Nu med AI-assisterad orderhantering
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  Allt ditt företag behöver - 
                  <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent"> i ett system</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Från order till leverans. Hantera kunder, lager och ekonomi enkelt. 
                  Slipp jonglera mellan olika system - allt på ett ställe.
                </p>
              </div>

              <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-4 max-w-md">
                <Input
                  type="email"
                  placeholder="din@email.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 px-8"
                >
                  {isLoading ? 'Laddar...' : 'Prova gratis i 30 dagar'}
                </Button>
              </form>

              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Endast 79kr/månad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Ingen bindningstid</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Svensk support</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Dashboard Översikt</h3>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Live</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Aktiva ordrar</div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">45k</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Månadens intäkter</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Keramikskål - Anna A.</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">299 kr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Halsband Silver - Erik E.</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">599 kr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Slipp krångla med flera system
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Många småföretag använder Excel för ordrar, ett annat system för lager, 
              och ett tredje för bokföring. BizPal samlar allt på ett ställe.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Innan BizPal:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mt-1">
                    <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Flera olika system</h4>
                    <p className="text-gray-600 dark:text-gray-400">Excel för ordrar, annat system för lager, tredje för bokföring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mt-1">
                    <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Manuell dataöverföring</h4>
                    <p className="text-gray-600 dark:text-gray-400">Kopiera samma info mellan olika program</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mt-1">
                    <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Dålig överblick</h4>
                    <p className="text-gray-600 dark:text-gray-400">Svårt att se helheten och fatta rätt beslut</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Med BizPal:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Ett komplett system</h4>
                    <p className="text-gray-600 dark:text-gray-400">Allt från order till bokföring i samma plattform</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Automatisk synkronisering</h4>
                    <p className="text-gray-600 dark:text-gray-400">Data uppdateras automatiskt mellan alla moduler</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Komplett överblick</h4>
                    <p className="text-gray-600 dark:text-gray-400">Se hela verksamheten på en dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Allt du behöver för att driva ditt företag
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              BizPal är inte bara bokföring - det är ett komplett affärssystem 
              som växer med ditt företag.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Så enkelt kommer du igång
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Tre enkla steg till ett mer organiserat företag
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center h-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-gray-300 dark:text-gray-600 mb-2">{step.number}</div>
                    <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Enkel prissättning som växer med dig
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              En prismodell, alla funktioner inkluderade
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="relative border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-1">
                  Mest populär
                </Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">BizPal Komplett</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">79</span>
                  <span className="text-xl text-gray-600 dark:text-gray-400">kr/månad</span>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Allt du behöver för att driva ditt företag
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {[
                    "Obegränsat antal ordrar",
                    "Komplett lagerhantering", 
                    "Produktionsplanering",
                    "Kund- och leverantörsregister",
                    "Automatisk bokföring",
                    "Rapporter och analys",
                    "Svensk support",
                    "Säker molnlagring"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-lg py-6">
                    Starta 30 dagars gratis testperiod
                  </Button>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>30 dagar gratis</strong> - ingen kreditkort krävs
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sedan endast 79kr/månad - avsluta när du vill
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Jämför med separata system:</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Bokföringssystem:</span>
                      <span>~200kr/mån</span>
                    </div>
                    <div className="flex justify-between">
                      <span>E-handelslösning:</span>
                      <span>~300kr/mån</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lagersystem:</span>
                      <span>~150kr/mån</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <span>Totalt:</span>
                      <span className="text-red-600 dark:text-red-400">~650kr/mån</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Vanliga frågor
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Svar på det du undrar över
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg px-6 bg-white dark:bg-gray-800">
                <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-gray-100 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Företagare älskar BizPal
            </h2>
            <div className="flex justify-center items-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-400">4.9/5 baserat på 200+ recensioner</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Anna Svensson",
                business: "Keramikstudio",
                quote: "Äntligen slipper jag Excel! BizPal har gjort min administration så mycket enklare.",
                avatar: "AS"
              },
              {
                name: "Erik Johansson", 
                business: "Smyckesdesign",
                quote: "Perfekt för mitt småföretag. Allt jag behöver finns här och priset är rättvist.",
                avatar: "EJ"
              },
              {
                name: "Maria Lindberg",
                business: "Textildesign",
                quote: "Lagerhanteringen sparar mig timmar varje vecka. Kan inte tänka mig att jobba utan BizPal nu.",
                avatar: "ML"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.business}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Redo att förenkla ditt företag?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Gå med i hundratals företagare som redan använder BizPal för att 
            hantera sina affärer mer effektivt.
          </p>

          <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <Input
              type="email"
              placeholder="din@email.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white dark:bg-gray-800"
              required
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 px-8"
            >
              {isLoading ? 'Laddar...' : 'Prova gratis i 30 dagar'}
            </Button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Ingen bindningstid</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Endast 79kr/månad sedan</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span>Svensk support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">BizPal</span>
              </div>
              <p className="text-gray-400">
                Komplett affärssystem för småföretag. 
                Enkel, kraftfull och prisvärd.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Produkt</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#features" className="block hover:text-white transition-colors">Funktioner</a>
                <a href="#pricing" className="block hover:text-white transition-colors">Priser</a>
                <a href="#" className="block hover:text-white transition-colors">Säkerhet</a>
                <a href="#" className="block hover:text-white transition-colors">Integrationer</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">Hjälpcenter</a>
                <a href="#" className="block hover:text-white transition-colors">Kontakta oss</a>
                <a href="#" className="block hover:text-white transition-colors">Guider</a>
                <a href="#" className="block hover:text-white transition-colors">API Dokumentation</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Företag</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">Om oss</a>
                <a href="#" className="block hover:text-white transition-colors">Karriär</a>
                <a href="#" className="block hover:text-white transition-colors">Integritetspolicy</a>
                <a href="#" className="block hover:text-white transition-colors">Användarvillkor</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BizPal. Alla rättigheter förbehållna. Utvecklat i Sverige.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;