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

// Simplified navigation for core business functions
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

// Navigation Item Component
const NavigationItem = ({ item, isActive }) => {
  const Icon = item.icon;
  
  return (
    <Link
      to={item.href}
      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon
        className={`flex-shrink-0 h-5 w-5 ${
          isActive 
            ? 'text-blue-600' 
            : 'text-gray-400 group-hover:text-gray-600'
        }`}
      />
      <div className="ml-3 flex-1">
        <div className="font-medium">{item.name}</div>
        <div className="text-xs text-gray-500">{item.description}</div>
      </div>
    </Link>
  );
};

// User Profile Component
const UserProfile = ({ user, signOut }) => {
  return (
    <div className="flex-shrink-0 border-t p-4">
      <div className="flex items-center mb-3">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.email || 'Användare'}
          </p>
          <p className="text-xs text-gray-500">BizPal</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={signOut}
        className="w-full justify-start"
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

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:bg-white lg:z-40">
        {/* Logo and Header */}
        <div className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">BizPal</span>
          </Link>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-3 py-4 space-y-2">
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
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b px-4 py-3">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-bold text-gray-900">BizPal</span>
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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
          <div className="flex justify-around items-center px-2 py-3">
            {navigationItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
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