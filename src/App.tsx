import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import LandingPage from "@/pages/LandingPage";
import { BizPalProvider } from "@/context/BizPalContext";
import { NavigationProvider } from "@/context/NavigationContext";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/Navigation";
import MobileBottomNav from "@/components/MobileBottomNav";

import Dashboard from "./pages/Dashboard";
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
import Receipts from "./pages/Receipts";
import Invoices from "./pages/Invoices";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-landing">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-landing-secondary">Laddar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-landing">
      <Navigation />
      
      {/* Main content area */}
      <div className="lg:pl-64 pt-12 lg:pt-0 pb-24 lg:pb-0">
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            {/* BIZPAL - HUVUDFUNKTIONER */}
            <Route path="/orders" element={<Orders />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/production" element={<Production />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/receipts" element={<Receipts />} />
            
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
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="bizpal-ui-theme">
        <AuthProvider>
          <BizPalProvider>
            <NavigationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <AppContent />
              </TooltipProvider>
            </NavigationProvider>
          </BizPalProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
