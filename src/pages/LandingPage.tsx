import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MobileNav } from "@/components/ui/mobile-nav";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { PricingSection } from "@/components/PricingSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FeedbackForm } from "@/components/FeedbackForm";
import { GuestLoginButton } from "@/components/GuestLoginButton";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { redirectToCheckout } from "@/lib/stripe-client";
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
  LogIn,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();

  const { signIn, signUp, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLoginModal) {
        setShowLoginModal(false);
      }
    };

    if (showLoginModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showLoginModal]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Account for header height and some padding
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: "smooth"
      });
    }
  };



  const handleCTAClick = async () => {
    if (!user) {
      // User is not logged in, show login modal
      setShowLoginModal(true);
      setIsLoginMode(false); // Show signup form
      return;
    }

    // User is logged in, check subscription status
    try {
      // Check if user has active Pro subscription
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (subscription && subscription.plan_id === 'pro') {
        // User already has Pro, go to dashboard
        navigate('/');
        return;
      }

      // User doesn't have Pro, redirect to Stripe checkout
      await redirectToCheckout('pro', user.id);
      toast.success('Omdirigerar till betalning', {
        description: 'Du kommer att skickas till Stripe för att slutföra din prenumeration.'
      });
    } catch (error) {
      console.error('CTA error:', error);
      toast.error('Något gick fel', {
        description: 'Kunde inte starta betalningsprocessen. Försök igen.'
    navigate("/pricing");
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setIsLoginMode(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'E-post krävs';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ange en giltig e-postadress';
    }
    
    if (!formData.password) {
      newErrors.password = 'Lösenord krävs';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Lösenordet måste vara minst 6 tecken';
    }
    
    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Lösenorden matchar inte';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          throw error;
        }
        toast.success("Välkommen tillbaka!", {
          description: "Du är nu inloggad."
        });
        // Navigate to dashboard after successful login
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const { error } = await signUp(formData.email, formData.password);
        if (error) {
          throw error;
        }
        
        // Try to sign in immediately after signup
        const { error: signInError } = await signIn(formData.email, formData.password);
        if (signInError) {
          // If sign in fails, user might need email verification
          toast.success("Konto skapat!", {
            description: "Kontrollera din e-post för verifiering, sedan kan du logga in."
          });
        } else {
          // If sign in succeeds, redirect to dashboard
          toast.success("Konto skapat!", {
            description: "Du är nu registrerad och kommer att omdirigeras till dashboard."
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        }
      }
      
      setShowLoginModal(false);
      setFormData({ email: '', password: '', confirmPassword: '' });
      setErrors({});
    } catch (error) {
      console.error('Auth error:', error);
      
      // Handle specific error cases
      if (error?.message?.includes('already registered') || error?.message?.includes('already exists')) {
        toast.error("E-postadressen används redan", {
          description: "Denna e-postadress är redan registrerad. Försök logga in istället."
        });
      } else if (error?.message?.includes('Invalid login credentials')) {
        toast.error("Felaktiga inloggningsuppgifter", {
          description: "Kontrollera din e-post och lösenord."
        });
      } else {
        toast.error(isLoginMode ? "Inloggning misslyckades" : "Registrering misslyckades", {
          description: isLoginMode ? "Kontrollera din e-post och lösenord." : "Försök igen eller kontakta support."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      setShowLoginModal(true);
      setIsLoginMode(false);
      return;
    }

    try {
      await redirectToCheckout(planId, user.id);
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Något gick fel', {
        description: 'Kunde inte starta uppgraderingen. Försök igen.'
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Login Modal */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLoginModal(false)}
        >
          <Card 
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
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

                             <form onSubmit={handleFormSubmit} className="space-y-4">
                 {isLoginMode ? (
                   <>
                     <div className="relative">
                       <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-20" />
                       <input
                         type="email"
                         placeholder="E-post"
                         value={formData.email}
                         onChange={(e) => handleInputChange('email', e.target.value)}
                         className={`w-full h-10 rounded-md border bg-white px-10 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                           errors.email ? 'border-red-500' : 'border-gray-300'
                         }`}
                       />
                       {errors.email && (
                         <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                       )}
                     </div>
                     <div className="relative">
                       <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-20" />
                       <input
                         type="password"
                         placeholder="Lösenord"
                         value={formData.password}
                         onChange={(e) => handleInputChange('password', e.target.value)}
                         className={`w-full h-10 rounded-md border bg-white px-10 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                           errors.password ? 'border-red-500' : 'border-gray-300'
                         }`}
                       />
                       {errors.password && (
                         <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                       )}
                     </div>
                     <Button 
                       type="submit"
                       className="w-full" 
                       disabled={isLoading}
                     >
                       {isLoading ? "Loggar in..." : "Logga in"}
                     </Button>
                   </>
                 ) : (
                   <>
                     <div className="relative">
                       <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-20" />
                       <input
                         type="email"
                         placeholder="E-post"
                         value={formData.email}
                         onChange={(e) => handleInputChange('email', e.target.value)}
                         className={`w-full h-10 rounded-md border bg-white px-10 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                           errors.email ? 'border-red-500' : 'border-gray-300'
                         }`}
                       />
                       {errors.email && (
                         <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                       )}
                     </div>
                     <div className="relative">
                       <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-20" />
                       <input
                         type="password"
                         placeholder="Lösenord"
                         value={formData.password}
                         onChange={(e) => handleInputChange('password', e.target.value)}
                         className={`w-full h-10 rounded-md border bg-white px-10 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                           errors.password ? 'border-red-500' : 'border-gray-300'
                         }`}
                       />
                       {errors.password && (
                         <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                       )}
                     </div>
                     <div className="relative">
                       <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-20" />
                       <input
                         type="password"
                         placeholder="Bekräfta lösenord"
                         value={formData.confirmPassword}
                         onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                         className={`w-full h-10 rounded-md border bg-white px-10 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                           errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                         }`}
                       />
                       {errors.confirmPassword && (
                         <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                       )}
                     </div>
                     <div className="space-y-3">
                       <Button 
                         type="submit"
                         className="w-full" 
                         disabled={isLoading}
                       >
                         {isLoading ? "Skapar konto..." : "Skapa konto"}
                       </Button>
                       <Button 
                         type="button"
                         variant="outline"
                         className="w-full" 
                         disabled={isLoading}
                         onClick={async (e) => {
                           e.preventDefault();
                           // For demo account, we don't need strict validation
                           if (!formData.email) {
                             setErrors({ email: 'E-post krävs för demo-konto' });
                             return;
                           }
                           
                           setIsLoading(true);
                           try {
                             // Create demo account instead of real account
                             const demoUser = {
                               id: `demo-${Date.now()}`,
                               email: formData.email,
                               user_metadata: {
                                 full_name: 'Demo Användare'
                               },
                               app_metadata: {
                                 provider: 'demo'
                               }
                             };

                             // Store demo session
                             localStorage.setItem('bizpal-demo-session', JSON.stringify({
                               user: demoUser,
                               access_token: 'demo-token',
                               refresh_token: 'demo-refresh',
                               expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
                             }));

                             // Set demo flag
                             localStorage.setItem('bizpal-demo-mode', 'true');
                             
                             // Set onboarding as completed for demo
                             localStorage.setItem('onboarding_completed', 'true');

                             toast.success("Demo-konto skapat!", {
                               description: "Du är nu i demo-läge med begränsad funktionalitet."
                             });
                             setShowLoginModal(false);
                             setFormData({ email: '', password: '', confirmPassword: '' });
                             setErrors({});
                             
                             // Navigate to dashboard after successful demo creation
                             setTimeout(() => {
                               window.location.href = '/';
                             }, 1000);
                           } catch (error) {
                             toast.error("Demo-konto misslyckades", {
                               description: "Försök igen eller kontakta support."
                             });
                           } finally {
                             setIsLoading(false);
                           }
                         }}
                       >
                         Prova free (begränsad funktionalitet)
                       </Button>
                     </div>
                   </>
                 )}
               </form>

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
                onClick={() => scrollToSection("om-oss")}
                className="text-gray-600 hover:text-black transition-colors"
                data-testid="link-om-oss"
              >
                Om oss
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
                onClick={handleLoginClick}
                variant="outline"
                className="hidden md:flex border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                data-testid="button-login-header"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Logga in
              </Button>
              <Button
                onClick={handleCTAClick}
                className="hidden md:flex bg-black text-white px-6 py-2 font-medium hover:bg-gray-800 transition-colors"
                data-testid="button-cta-header"
              >
                Kom igång free
              </Button>
              <MobileNav 
                onNavigate={scrollToSection} 
                onLoginClick={handleLoginClick}
                onCTAClick={handleCTAClick}
              />
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={handleCTAClick}
                    className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors"
                    data-testid="button-cta-hero"
                  >
                    Prova free i 30 dagar
                  </Button>
                  <GuestLoginButton variant="button" />
                </div>
                <p
                  className="text-sm text-gray-600"
                  data-testid="text-pricing-info"
                >
                  Endast 99kr/månad - ingen bindningstid
                </p>
                
                {/* Quick Social Proof */}
                <div className="flex items-center space-x-6 pt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>37 företagare visat intresse</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">★★★★★</span>
                    <span>5.0/5 från användare</span>
                  </div>
                </div>
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

      {/* Social Proof & Trust */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Building Text */}
          <div className="text-center mb-16">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              BizPal byggs tillsammans med småföretagare för att lösa verkliga problem. 
              Vi lyssnar på feedback och utvecklar systemet kontinuerligt baserat på vad som faktiskt behövs.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>37 företagare visat intresse hittills</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Byggt med verklig feedback</span>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Vad företagare tycker</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic">
                    "Slutligen ett system som förstår hur småföretag fungerar. 
                    Enkelt att komma igång och allt jag behöver på ett ställe."
                  </p>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="font-medium text-sm">Anna, Frilansare</p>
                    <p className="text-xs text-gray-500">Malmö</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic">
                    "Perfekt för min hantverksverksamhet. Kan hantera både 
                    beställningar och lager utan krångel. Sparar mig timmar varje vecka."
                  </p>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="font-medium text-sm">Marcus, Hantverkare</p>
                    <p className="text-xs text-gray-500">Stockholm</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic">
                    "Fantastisk support och systemet växer med mitt företag. 
                    Känns som att de verkligen bryr sig om att hjälpa småföretag."
                  </p>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="font-medium text-sm">Sofia, E-handel</p>
                    <p className="text-xs text-gray-500">Göteborg</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Founder Story */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                <User className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold">Vår historia</h3>
              <p className="text-gray-600 leading-relaxed">
                Vi bygger BizPal tillsammans med småföretagare som du. Efter att ha sett 
                hur många företag kämpar med flera olika system och krånglig administration, 
                bestämde vi oss för att skapa något bättre. Något som faktiskt fungerar 
                för småföretag i verkligheten.
              </p>
              <p className="text-gray-600 leading-relaxed">
                BizPal är resultatet av samtal med hundratals företagare och deras feedback. 
                Vi bygger inte bara ett system – vi bygger en lösning som verkligen hjälper.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Om oss Section */}
      <section id="om-oss" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Om oss</h2>
            <p className="text-xl text-gray-600">
              Vi bygger BizPal tillsammans med småföretagare för att lösa verkliga problem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Vår vision</h3>
              <p className="text-gray-600 leading-relaxed">
                Vi tror att småföretag förtjänar bättre verktyg. Verktyg som faktiskt 
                fungerar i verkligheten, inte bara på pappret. BizPal är vårt svar på 
                den utmaningen.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Genom att arbeta nära företagare och lyssna på deras feedback bygger vi 
                ett system som växer med ditt företag och anpassar sig efter dina behov.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Byggt med verklig feedback från företagare</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Kontinuerlig utveckling baserat på användarbehov</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Personlig support på svenska</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <h4 className="text-lg font-semibold">Vår grundare</h4>
                </div>
                <p className="text-gray-600 leading-relaxed text-center">
                  Efter att ha sett hur många företag kämpar med flera olika system 
                  och krånglig administration, bestämde vi oss för att skapa något bättre. 
                  Något som faktiskt fungerar för småföretag i verkligheten.
                </p>
                <p className="text-gray-600 leading-relaxed text-center">
                  BizPal är resultatet av samtal med hundratals företagare och deras feedback. 
                  Vi bygger inte bara ett system – vi bygger en lösning som verkligen hjälper.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 bg-white">
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

      {/* Pricing Section */}
      <PricingSection onUpgrade={handleUpgrade} />

      {/* Competitor Comparison */}
      <CompetitorComparison onUpgrade={handleCTAClick} />

      {/* Features Section */}
      <FeaturesSection />

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

      {/* Feedback Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Hjälp oss bygga BizPal bättre
            </h2>
            <p className="text-lg text-gray-600">
              Vi vill gärna höra vad du tycker och hur vi kan förbättra systemet
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Varför feedback är viktigt</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Vi bygger BizPal tillsammans med användare som du</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Din feedback hjälper oss att prioritera rätt funktioner</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Vi implementerar förbättringar baserat på verkliga behov</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Pro-tip:</strong> Ju mer specifik feedback du ger, 
                  desto bättre kan vi hjälpa dig och andra användare.
                </p>
              </div>
            </div>
            
            <FeedbackForm />
          </div>
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
                              Prova BizPal free i 30 dagar
              </Button>

            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" strokeWidth={1.5} />
                <span>Ingen bindningstid</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" strokeWidth={1.5} />
                <span>Endast 99kr/månad sedan</span>
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email') as string;
                if (email) {
                  toast.success("Tack för ditt intresse!", {
                    description: "Vi hör av oss inom kort med mer information."
                  });
                  e.currentTarget.reset();
                }
              }}
              className="flex space-x-3"
            >
              <input
                type="email"
                name="email"
                placeholder="din@e-post.se"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                data-testid="input-email"
                required
              />
              <Button
                type="submit"
                className="bg-black text-white px-6 py-3 font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                data-testid="button-email-submit"
              >
                Skicka
              </Button>
            </form>
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