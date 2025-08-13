import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  Home,
  LogOut,
  Settings,
  Building2
} from 'lucide-react';

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
    name: 'Produkter',
    href: '/products',
    icon: ShoppingBag,
    description: 'Produktkatalog'
  },
  {
    name: 'Kunder',
    href: '/customers',
    icon: Users,
    description: 'Kundregister'
  },
  {
    name: 'Inställningar',
    href: '/settings',
    icon: Settings,
    description: 'Applikationsinställningar'
  }
];

const NavigationItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
  const Icon = item.icon;
  
  return (
    <Link
      to={item.href}
      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-teal-400/10 text-teal-600 shadow-sm'
          : 'text-gray-600 hover:bg-gray-50 hover:text-slate-800'
      }`}
    >
      <Icon
        className={`flex-shrink-0 h-5 w-5 mr-3 ${
          isActive 
            ? 'text-teal-400' 
            : 'text-gray-400 group-hover:text-slate-800'
        }`}
      />
      <div className="flex-1">
        <div className="font-medium">{item.name}</div>
        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
      </div>
    </Link>
  );
};

const UserProfile = ({ user, signOut }: { user: any, signOut: () => void }) => {
  return (
    <div className="flex-shrink-0 border-t border-gray-100 p-6">
      <div className="flex items-center mb-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-teal-400 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {user?.email || 'Användare'}
          </p>
          <p className="text-xs text-gray-500">BizPal</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={signOut}
        className="w-full justify-start finpay-button-secondary"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logga ut
      </Button>
    </div>
  );
};

const Navigation = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:bg-white lg:z-40 lg:shadow-sm">
        {/* Logo and Header */}
        <div className="flex items-center justify-between flex-shrink-0 px-6 py-6 border-b border-gray-100">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Building2 className="h-8 w-8 text-teal-400" />
            <span className="ml-2 text-xl font-bold text-slate-800">BizPal</span>
          </Link>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.name}
                item={item}
                isActive={isActive(item.href)}
              />
            ))}
          </nav>
        </div>
        
        {/* User Profile */}
        <UserProfile user={user} signOut={signOut} />
      </nav>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Building2 className="h-6 w-6 text-teal-400" />
            <span className="ml-2 text-lg font-bold text-slate-800">BizPal</span>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
          <div className="flex justify-around items-center px-2 py-3">
            {navigationItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-teal-400 bg-teal-400/10'
                      : 'text-gray-600 hover:text-teal-400 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium leading-tight">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Bottom padding for mobile content */}
        <div className="h-16" />
      </div>
    </>
  );
};

export default Navigation;