import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { LoginForm } from "@/components/auth/LoginForm";
import { BizPalProvider } from "@/context/BizPalContext";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
// NYA SIDOR FÖR BIZPAL
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Production from "./pages/Production";
import Inventory from "./pages/Inventory";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Laddar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <LoginForm />
            </div>
          } />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        
        {/* Main content area */}
        <div className="lg:pl-64 pt-12 lg:pt-0">
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* BIZPAL - HUVUDFUNKTIONER */}
              <Route path="/orders" element={<Orders />} />
              <Route path="/production" element={<Production />} />
              <Route path="/products" element={<Products />} />
              <Route path="/inventory" element={<Inventory />} />
              
              {/* BOKFÖRING & EKONOMI */}
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/reports" element={<Reports />} />
              
              {/* KUNDER & LEVERANTÖRER */}
              <Route path="/customers" element={<Customers />} />
              <Route path="/suppliers" element={<Suppliers />} />
              
              {/* CATCH-ALL ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="bizpal-ui-theme">
      <AuthProvider>
        <BizPalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </BizPalProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
