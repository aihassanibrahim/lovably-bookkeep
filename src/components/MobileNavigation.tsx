import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import QuickActions from "@/components/QuickActions";
import { 
  Home,
  Package,
  DollarSign,
  Users,
  Menu,
  Building2,
  FileText,
  Clock,
  ShoppingBag,
  Truck,
  Receipt,
  BarChart3,
  HelpCircle,
  Info,
  Settings
} from 'lucide-react';

// Mobile navigation items (main sections only)
const mobileNavItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Ordrar',
    href: '/orders',
    icon: Package,
  },
  {
    name: 'Ekonomi',
    href: '/transactions',
    icon: DollarSign,
  },
  {
    name: 'Kunder',
    href: '/customers',
    icon: Users,
  },
];

// Full navigation sections for mobile menu
const mobileNavigationSections = [
  {
    id: 'main',
    title: 'Huvudmeny',
    items: [
      {
        name: 'Dashboard',
        href: '/',
        icon: Home,
        description: 'Översikt'
      }
    ]
  },
  {
    id: 'business',
    title: 'Företag',
    items: [
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
      }
    ]
  },
  {
    id: 'contacts',
    title: 'Kontakter',
    items: [
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
      }
    ]
  },
  {
    id: 'finance',
    title: 'Ekonomi',
    items: [
      {
        name: 'Transaktioner',
        href: '/transactions',
        icon: DollarSign,
        description: 'Ekonomi'
      },
      {
        name: 'Kvitton',
        href: '/receipts',
        icon: Receipt,
        description: 'Kvittoscanning & moms'
      },
      {
        name: 'Rapporter',
        href: '/reports',
        icon: BarChart3,
        description: 'Statistik & rapporter'
      }
    ]
  },
  {
    id: 'more',
    title: 'Mer',
    items: [
      {
        name: 'FAQ',
        href: '/faq',
        icon: HelpCircle,
        description: 'Vanliga frågor'
      },
      {
        name: 'Om oss',
        href: '/about',
        icon: Info,
        description: 'Om BizPal'
      },
      {
        name: 'Inställningar',
        href: '/settings',
        icon: Settings,
        description: 'Applikationsinställningar'
      }
    ]
  }
];

// Mobile Navigation Item Component
const MobileNavItem = ({ item, isActive }) => {
  const Icon = item.icon;
  
  return (
    <Link
      to={item.href}
      className={`flex flex-col items-center justify-center py-2 px-3 text-xs font-medium rounded-lg transition-colors ${
        isActive
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      }`}
    >
      <Icon className="h-5 w-5 mb-1" />
      <span className="text-xs">{item.name}</span>
    </Link>
  );
};

// Mobile Menu Item Component
const MobileMenuItem = ({ item, isActive }) => {
  const Icon = item.icon;
  
  return (
    <Link
      to={item.href}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      <div>
        <div className="font-medium">{item.name}</div>
        <div className="text-xs text-muted-foreground">{item.description}</div>
      </div>
    </Link>
  );
};

const MobileNavigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNavItems.map((item) => (
            <MobileNavItem
              key={item.name}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}
          
          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center justify-center py-2 px-3 text-xs font-medium rounded-lg"
              >
                <Menu className="h-5 w-5 mb-1" />
                <span className="text-xs">Mer</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <Building2 className="h-6 w-6 text-primary mr-2" />
                  BizPal
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {mobileNavigationSections.map((section) => (
                  <div key={section.id}>
                    <h3 className="px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <MobileMenuItem
                          key={item.name}
                          item={item}
                          isActive={isActive(item.href)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      
      {/* Bottom padding for content */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default MobileNavigation; 