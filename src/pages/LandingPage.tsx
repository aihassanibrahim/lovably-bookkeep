import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { MobileNav } from "@/components/ui/mobile-nav";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  ShoppingCart,
  Clock,
  Package,
  Warehouse,
  Users,
  CreditCard,
  Check,
  ArrowRight,
  ChevronDown,
  Mail,
  Lock,
  User,
} from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Ange en giltig e-postadress"),
});

const loginSchema = z.object({
  email: z.string().email("Ange en giltig e-postadress"),
  password: z.string().min(6, "Lösenordet måste vara minst 6 tecken"),
});

const signupSchema = z.object({
  email: z.string().email("Ange en giltig e-postadress"),
  password: z.string().min(6, "Lösenordet måste vara minst 6 tecken"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Lösenorden matchar inte",
  path: ["confirmPassword"],
});

type EmailFormData = z.infer<typeof emailSchema>;
type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function Landing() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { signIn, signUp } = useAuth();

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const onEmailSubmit = async (data: EmailFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Tack för ditt intresse!",
        description: "Vi hör av oss inom kort med mer information.",
      });

      emailForm.reset();
    } catch (error) {
      toast({
        title: "Något gick fel",
        description: "Försök igen senare eller kontakta oss direkt.",
        variant: "destructive",
      });
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      toast({
        title: "Välkommen tillbaka!",
        description: "Du är nu inloggad.",
      });
      setShowLoginModal(false);
      navigate("/");
    } catch (error) {
      toast({
        title: "Inloggning misslyckades",
        description: "Kontrollera din e-post och lösenord.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password);
      toast({
        title: "Konto skapat!",
        description: "Kontrollera din e-post för verifiering.",
      });
      setShowLoginModal(false);
      navigate("/");
    } catch (error) {
      toast({
        title: "Registrering misslyckades",
        description: "Försök igen eller kontakta support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCTAClick = () => {
    setShowLoginModal(true);
    setIsLoginMode(true);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {isLoginMode ? "Logga in" : "Skapa konto"}
                </h2>
                <p className="text-gray-600">
                  {isLoginMode 
                    ? "Välkommen tillbaka till BizPal" 
                    : "Skapa ditt BizPal-konto"
                  }
                </p>
              </div>

              {isLoginMode ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="E-post"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="password"
                                placeholder="Lösenord"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Loggar in..." : "Logga in"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="E-post"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="password"
                                placeholder="Lösenord"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="password"
                                placeholder="Bekräfta lösenord"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Skapar konto..." : "Skapa konto"}
                    </Button>
                  </form>
                </Form>
              )}

              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {isLoginMode 
                    ? "Har du inget konto? Skapa ett här" 
                    : "Har du redan ett konto? Logga in här"
                  }
                </button>
              </div>

              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </CardContent>
          </Card>
        </div>
      )}

        {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isHeaderVisible
            ? "bg-white/98 backdrop-blur-sm border-b border-gray-200"
            : "bg-white/95 backdrop-blur-sm border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl" data-testid="text-logo">
              BizPal
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("funktioner")}
                className="text-gray-600 hover:text-black transition-colors"
                data-testid="link-funktioner"
              >
                Funktioner
              </button>
              <button
                onClick={() => scrollToSection("priser")}
                className="text-gray-600 hover:text-black transition-colors"
                data-testid="link-priser"
              >
                Priser
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-gray-600 hover:text-black transition-colors"
                data-testid="link-faq"
              >
                FAQ
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                onClick={handleCTAClick}
                className="hidden md:flex bg-black text-white px-6 py-2 font-medium hover:bg-gray-800 transition-colors"
                data-testid="button-cta-header"
              >
                Kom igång gratis
              </Button>
              <MobileNav onNavigate={scrollToSection} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1
                  className="text-5xl lg:text-7xl font-black leading-tight"
                  data-testid="text-hero-title"
                >
                  Allt ditt företag behöver
                  <br />
                  <span className="font-light">i ett system</span>
          </h1>
                <p
                  className="text-xl text-gray-600 leading-relaxed max-w-lg"
                  data-testid="text-hero-subtitle"
                >
                  Från order till leverans. Hantera kunder, lager och ekonomi
                  enkelt.
          </p>
        </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={handleCTAClick}
                  className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors"
                  data-testid="button-cta-hero"
                >
                  Prova gratis i 30 dagar
                </Button>
                <p
                  className="text-sm text-gray-600"
                  data-testid="text-pricing-info"
                >
                  Endast 79kr/månad - ingen bindningstid
                </p>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative">
              <Card className="bg-gray-50 border-2 border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div
                    className="font-semibold"
                    data-testid="text-dashboard-title"
                  >
                    Dashboard
                  </div>
                  <div className="w-8 h-8 bg-black rounded"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-white border border-gray-200 p-4">
                    <CardContent className="p-0 space-y-2">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="text-xs text-gray-600">Ordrar</div>
                      <div
                        className="font-bold text-lg"
                        data-testid="text-orders-count"
                      >
                        47
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border border-gray-200 p-4">
                    <CardContent className="p-0 space-y-2">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="text-xs text-gray-600">Produkter</div>
                      <div
                        className="font-bold text-lg"
                        data-testid="text-products-count"
                      >
                        128
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border border-gray-200 p-4">
                    <CardContent className="p-0 space-y-2">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="text-xs text-gray-600">Kunder</div>
                      <div
                        className="font-bold text-lg"
                        data-testid="text-customers-count"
                      >
                        93
                      </div>
            </CardContent>
          </Card>
                </div>
                <div className="space-y-2">
                  <Card className="bg-white border border-gray-200 p-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Senaste order #1247</span>
                      <span className="text-sm font-medium">2,450 kr</span>
                    </div>
                  </Card>
                  <Card className="bg-white border border-gray-200 p-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Senaste order #1246</span>
                      <span className="text-sm font-medium">890 kr</span>
                    </div>
                  </Card>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl font-bold mb-8"
            data-testid="text-problem-title"
          >
            Slipp jonglera mellan olika system
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="space-y-3">
              <div className="text-2xl font-light">Innan</div>
              <div className="space-y-2 text-gray-600">
                <div>5 olika system</div>
                <div>Krånglig administration</div>
                <div>Dålig överblick</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-black" />
            </div>
            <div className="space-y-3">
              <div className="text-2xl font-bold">Med BizPal</div>
              <div className="space-y-2">
                <div className="font-medium">Ett system</div>
                <div className="font-medium">Enkel hantering</div>
                <div className="font-medium">Total kontroll</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funktioner" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4"
              data-testid="text-features-title"
            >
              Allt du behöver på ett ställe
            </h2>
            <p className="text-xl text-gray-600">
              Hantera hela din verksamhet med ett komplett affärssystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <ShoppingCart className="w-8 h-8" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold">Beställningar</h3>
                <p className="text-gray-600">
                  Ta emot och hantera ordrar från sociala medier och webben.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <Clock className="w-8 h-8" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold">Produktion</h3>
                <p className="text-gray-600">
                  Planera och följa upp produktionsuppgifter enkelt.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <Package className="w-8 h-8" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold">Produktkatalog</h3>
                <p className="text-gray-600">
                  Hantera produkter och komponenter med full översikt.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <Warehouse className="w-8 h-8" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold">Lager</h3>
                <p className="text-gray-600">
                  Håll koll på material och lagervärde i realtid.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <Users className="w-8 h-8" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold">Kunder & Leverantörer</h3>
                <p className="text-gray-600">
                  Samla all kontaktinfo och orderhistorik på ett ställe.
                </p>
            </CardContent>
          </Card>

            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <CreditCard className="w-8 h-8" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold">Ekonomi</h3>
                <p className="text-gray-600">
                  Transaktioner, konton och rapporter för full ekonomisk
                  kontroll.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl font-bold mb-16"
            data-testid="text-process-title"
          >
            Så här fungerar det
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Registrera dig</h3>
              <p className="text-gray-600">
                Kom igång på 2 minuter - ingen kreditkort krävs
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Lägg till produkter</h3>
              <p className="text-gray-600">
                Bygg din produktkatalog och ställ in lager
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Ta emot ordrar</h3>
              <p className="text-gray-600">
                Hantera hela flödet från order till leverans
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="priser" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl font-bold mb-8"
            data-testid="text-pricing-title"
          >
            En enkel prismodell
          </h2>

          <Card className="bg-gray-50 border-2 border-gray-200 p-12 max-w-md mx-auto">
            <CardContent className="p-0 space-y-6">
              <div>
                <div className="text-6xl font-black" data-testid="text-price">
                  79kr
                </div>
                <div className="text-gray-600">/månad</div>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5" strokeWidth={1.5} />
                  <span>30 dagar gratis testperiod</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5" strokeWidth={1.5} />
                  <span>Ingen bindningstid</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5" strokeWidth={1.5} />
                  <span>Allt inkluderat</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5" strokeWidth={1.5} />
                  <span>Support på svenska</span>
                </div>
              </div>

              <Button
                onClick={handleCTAClick}
                className="w-full bg-black text-white py-4 font-semibold hover:bg-gray-800 transition-colors"
                data-testid="button-cta-pricing"
              >
                Starta gratis testperiod
              </Button>
            </CardContent>
          </Card>

          <p className="mt-8 text-gray-600">
            Jämför med kostnaden för flera separata system - spara tusentals
            kronor årligen
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl font-bold text-center mb-12"
            data-testid="text-faq-title"
          >
            Vanliga frågor
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="import"
              className="bg-white border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                Kan jag importera från andra system?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Ja, vi hjälper dig att importera data från de flesta
                bokföringssystem och Excel-filer. Vår support guidar dig genom
                processen.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="business-types"
              className="bg-white border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                Fungerar det för alla typer av företag?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                BizPal är perfekt för småföretag inom tillverkning, handel och
                tjänster. Systemet anpassar sig efter din bransch och dina
                behov.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="data-retention"
              className="bg-white border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                Vad händer med min data om jag säger upp?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Du kan exportera all din data när som helst. Vi sparar dina
                uppgifter i 30 dagar efter uppsägning så du hinner ladda ner
                allt.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="support"
              className="bg-white border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                Får jag support på svenska?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Ja, vi erbjuder fullständig support på svenska via e-post och
                telefon. Vårt team hjälper dig att komma igång och löser alla
                frågor.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="services"
              className="bg-white border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                Kan jag hantera både produkter och tjänster?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Absolut! BizPal hanterar både fysiska produkter med lager och
                tjänster med tidsrapportering. Du kan kombinera båda i samma
                system.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-5xl font-bold mb-6"
            data-testid="text-final-cta-title"
          >
            Redo att förenkla din verksamhet?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Gör som hundratals andra småföretag - slipp krånglet med flera
            system
          </p>

          <div className="space-y-6">
              <Button 
                size="lg"
              onClick={handleCTAClick}
              className="bg-black text-white px-12 py-4 text-xl font-semibold hover:bg-gray-800 transition-colors"
              data-testid="button-cta-final"
              >
              Prova BizPal gratis i 30 dagar
              </Button>

            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" strokeWidth={1.5} />
                <span>Ingen bindningstid</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" strokeWidth={1.5} />
                <span>Endast 79kr/månad sedan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" strokeWidth={1.5} />
                <span>GDPR-kompatibel</span>
              </div>
            </div>
          </div>

          {/* Email signup form */}
          <div className="mt-12 max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-4">
              Eller lämna din e-post så hör vi av oss:
            </p>
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="flex space-x-3"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="din@e-post.se"
                          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                          data-testid="input-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={emailForm.formState.isSubmitting}
                  className="bg-black text-white px-6 py-3 font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  data-testid="button-email-submit"
                >
                  {emailForm.formState.isSubmitting ? "Skickar..." : "Skicka"}
                </Button>
              </form>
            </Form>
              </div>
        </div>
      </section>

        {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="font-bold text-2xl" data-testid="text-footer-logo">
              BizPal
            </div>
            <p className="text-gray-600">Affärssystem för småföretag</p>
            <div className="flex justify-center space-x-6 text-gray-600">
              <a
                href="#"
                className="hover:text-black transition-colors"
                data-testid="link-privacy"
              >
                Integritet
              </a>
              <a
                href="#"
                className="hover:text-black transition-colors"
                data-testid="link-terms"
              >
                Villkor
              </a>
              <a
                href="#"
                className="hover:text-black transition-colors"
                data-testid="link-support"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 