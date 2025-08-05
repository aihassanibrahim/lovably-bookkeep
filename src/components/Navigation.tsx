import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  BarChart3,
  Clock,
  Home,
  Building2,
  FileText,
  Truck,
  LogOut,
  HelpCircle,
  Info,
  Settings
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      description: 'Översikt'
    },
    {
      name: 'Ordrar',
      href: '/orders',
      icon: Package,
      description: 'Hantera beställningar'
    },
    {
      name: 'Fakturor',
      href: '/invoices',
      icon: FileText,
      description: 'Fakturering & betalningar'
    },
    {
      name: 'Produktion',
      href: '/production',
      icon: Clock,
      description: 'Produktionsstatus'
    },
    {
      name: 'Produkter',
      href: '/products',
      icon: ShoppingBag,
      description: 'Produktkatalog'
    },
    {
      name: 'Lager',
      href: '/inventory',
      icon: Building2,
      description: 'Material & komponenter'
    },
    {
      name: 'Kunder',
      href: '/customers',
      icon: Users,
      description: 'Kundregister'
    },
    {
      name: 'Leverantörer',
      href: '/suppliers',
      icon: Truck,
      description: 'Leverantörer'
    },
    {
      name: 'Transaktioner',
      href: '/transactions',
      icon: DollarSign,
      description: 'Ekonomi'
    },
    {
      name: 'Kvitton',
      href: '/receipts',
      icon: FileText,
      description: 'Kvittoscanning & moms'
    },
    {
      name: 'Rapporter',
      href: '/reports',
      icon: BarChart3,
      description: 'Statistik & rapporter'
    },
    {
      name: 'FAQ',
      href: '/faq',
      icon: HelpCircle,
      enabled: true,
      category: 'settings'
    },
    {
      name: 'Om oss',
      href: '/about',
      icon: Info,
      enabled: true,
      category: 'settings'
    },
    {
      name: 'Inställningar',
      href: '/settings',
      icon: Settings,
      enabled: true,
      category: 'settings'
    }
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-landing lg:bg-white dark:lg:bg-gray-900 lg:pt-5 lg:pb-4 lg:z-40">
        <div className="flex items-center justify-between flex-shrink-0 px-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-black dark:text-white" />
            <span className="ml-2 text-xl font-bold text-landing-primary">BizPal</span>
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
          <nav className="px-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-r-2 border-black dark:border-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive(item.href) 
                        ? 'text-black dark:text-white' 
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                    }`}
                  />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* User info section */}
        <div className="flex-shrink-0 border-t border-landing p-4">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
                <span className="text-sm font-medium text-white dark:text-black">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-landing-primary truncate">
                {user?.email || 'Användare'}
              </p>
              <p className="text-xs text-landing-secondary">BizPal</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="w-full justify-start text-landing-primary hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logga ut
          </Button>
        </div>
      </nav>

      {/* Mobile Header - Only show header, no menu */}
      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-landing px-4 py-3">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-black dark:text-white" />
            <span className="ml-2 text-lg font-bold text-landing-primary">BizPal</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 border-gray-300 dark:border-gray-600"
              title="Logga ut"
            >
              <LogOut className="h-4 w-4 text-gray-700 dark:text-gray-300 mr-1" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Logga ut</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation; 