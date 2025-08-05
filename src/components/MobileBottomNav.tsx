import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigation } from '@/context/NavigationContext';
import { 
  Home, 
  Package, 
  Clock, 
  ShoppingBag, 
  Building2, 
  Users, 
  Truck, 
  DollarSign, 
  BarChart3,
  FileText,
  Settings
} from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();
  const { mobileNavItems } = useNavigation();
  
  // Icon mapping
  const iconMap = {
    Home,
    Package,
    Clock,
    ShoppingBag,
    Building2,
    Users,
    Truck,
    DollarSign,
    BarChart3,
    FileText,
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-landing shadow-lg">
      <div className="flex justify-around items-center px-2 py-3">
        {mobileNavItems
          .filter(item => item.enabled)
          .map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon
                  className={`h-6 w-6 mb-1 ${
                    isActive(item.href) 
                      ? 'text-black dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
                <span className="text-xs font-medium leading-tight">{item.name}</span>
              </Link>
            );
          })}
        
        {/* Settings button */}
        <Link
          to="/settings"
          className="flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          title="Inställningar"
        >
          <Settings className="h-6 w-6 mb-1 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium leading-tight">Inställningar</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav; 