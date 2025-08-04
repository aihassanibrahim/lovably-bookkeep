import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  BarChart3,
  Clock,
  Home,
  Menu,
  X,
  Building2,
  FileText,
  Truck
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
      name: 'Rapporter',
      href: '/reports',
      icon: BarChart3,
      description: 'Statistik & rapporter'
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
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4 lg:z-40 dark:lg:border-gray-700 dark:lg:bg-gray-900">
        <div className="flex items-center justify-between flex-shrink-0 px-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">BizPal</span>
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
                      ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-400'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive(item.href) 
                        ? 'text-indigo-500 dark:text-indigo-400' 
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
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
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">U</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Användare</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">BizPal</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-gray-100">BizPal</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed top-[60px] left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 max-h-[calc(100vh-60px)] overflow-y-auto">
            <div className="px-2 py-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive(item.href) 
                          ? 'text-indigo-500 dark:text-indigo-400' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation; 