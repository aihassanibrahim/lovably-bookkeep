import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/components/auth/AuthProvider';
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
  Truck,
  LogOut
} from 'lucide-react';

const Navigation = () => {
  const { signOut, user } = useAuth();
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
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
                            <div className="flex items-center flex-shrink-0 px-6">
                      <Building2 className="h-8 w-8 text-indigo-600" />
                      <span className="ml-2 text-xl font-bold text-gray-900">BizPal</span>
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
                      ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive(item.href) ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User info section */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">U</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 truncate">{user?.email}</p>
                <p className="text-xs text-gray-500">Din verksamhet</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="ml-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2">
                                <div className="flex items-center">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                        <span className="ml-2 text-lg font-bold text-gray-900">BizPal</span>
                      </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed top-12 left-0 right-0 z-40 lg:hidden bg-white border-b border-gray-200 shadow-lg">
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
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive(item.href) ? 'text-indigo-500' : 'text-gray-400'
                      }`}
                    />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
              
              {/* Mobile logout */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <div className="mb-3 px-3">
                  <p className="text-xs text-gray-500 mb-1">Inloggad som</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="w-full mx-2 justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logga ut
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation; 