import React, { useState } from 'react';
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
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Receipt,
  MoreHorizontal,
  User,
  CreditCard,
  TrendingDown
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Navigation sections configuration
const navigationSections = [
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
        name: 'Utgifter',
        href: '/expenses',
        icon: TrendingDown,
        description: 'Hantera utgifter'
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

// Navigation Item Component
const NavigationItem = ({ item, isActive, isMobile }) => {
  const Icon = item.icon;
  
  return (
    <Link
      to={item.href}
      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary border-r-2 border-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      <Icon
        className={`flex-shrink-0 h-5 w-5 ${
          isActive 
            ? 'text-primary' 
            : 'text-muted-foreground group-hover:text-accent-foreground'
        }`}
      />
      {!isMobile && (
        <div className="ml-3 flex-1">
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.description}</div>
        </div>
      )}
    </Link>
  );
};

// Navigation Section Component
const NavigationSection = ({ section, isMobile, expandedSections, toggleSection }) => {
  const location = useLocation();
  
  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const hasActiveItem = section.items.some(item => isActive(item.href));
  const isExpanded = expandedSections.includes(section.id) || hasActiveItem;

  // Don't show collapsible for main section
  if (section.id === 'main') {
    return (
      <div className="space-y-1">
        {section.items.map((item) => (
          <NavigationItem
            key={item.name}
            item={item}
            isActive={isActive(item.href)}
            isMobile={isMobile}
          />
        ))}
      </div>
    );
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={() => toggleSection(section.id)}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full justify-between px-3 py-2 text-sm font-medium ${
            hasActiveItem ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-accent-foreground'
          }`}
        >
          <div className="flex items-center">
            {!isMobile && <span>{section.title}</span>}
          </div>
          {!isMobile && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {section.items.map((item) => (
          <NavigationItem
            key={item.name}
            item={item}
            isActive={isActive(item.href)}
            isMobile={isMobile}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};



// User Profile Component
const UserProfile = ({ user, signOut }) => {
  return (
    <div className="flex-shrink-0 border-t p-4">
      <div className="flex items-center mb-3">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {user?.email || 'Användare'}
          </p>
          <p className="text-xs text-muted-foreground">BizPal</p>
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
  const [expandedSections, setExpandedSections] = useState(['main']);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:bg-background lg:z-40">
        {/* Logo and Topbar */}
        <div className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-foreground">BizPal</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>



        {/* Navigation Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-3 py-4 space-y-2">
            {navigationSections.map((section) => (
              <NavigationSection
                key={section.id}
                section={section}
                isMobile={false}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
            ))}
          </nav>
        </div>
        
        {/* User Profile */}
        <UserProfile user={user} signOut={signOut} />
      </nav>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-bold text-foreground">BizPal</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="hover:bg-accent"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation; 