import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "@/components/auth/AuthProvider";

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: '🏠',
    description: 'Översikt'
  },
  {
    name: 'Ordrar',
    href: '/orders',
    icon: '📦',
    description: 'Hantera beställningar'
  },
  {
    name: 'Produkter',
    href: '/products',
    icon: '🛍️',
    description: 'Produktkatalog'
  },
  {
    name: 'Kunder',
    href: '/customers',
    icon: '👥',
    description: 'Kundregister'
  },
  {
    name: 'Inställningar',
    href: '/settings',
    icon: '⚙️',
    description: 'Applikationsinställningar'
  }
];

const NavigationItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
  return (
    <Link
      to={item.href}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        backgroundColor: isActive ? 'rgba(45, 212, 191, 0.1)' : 'transparent',
        color: isActive ? '#2dd4bf' : '#64748b'
      }}
    >
      <span style={{ 
        fontSize: '20px', 
        marginRight: '12px',
        color: isActive ? '#2dd4bf' : '#94a3b8'
      }}>
        {item.icon}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500' }}>{item.name}</div>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{item.description}</div>
      </div>
    </Link>
  );
};

const UserProfile = ({ user, signOut }: { user: any, signOut: () => void }) => {
  return (
    <div style={{
      borderTop: '1px solid #e2e8f0',
      padding: '24px',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#2dd4bf',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
            {user?.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div style={{ marginLeft: '12px', flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email || 'Användare'}
          </p>
          <p style={{ fontSize: '12px', color: '#64748b' }}>BizPal</p>
        </div>
      </div>
      <button
        onClick={signOut}
        className="finpay-button-secondary"
        style={{ 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <span style={{ marginRight: '8px' }}>🚪</span>
        Logga ut
      </button>
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
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        width: '256px',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        borderRight: '1px solid #e2e8f0',
        backgroundColor: 'white',
        zIndex: 40,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        {/* Logo and Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'opacity 0.2s ease'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#2dd4bf',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold' }}>B</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>BizPal</span>
          </Link>
        </div>

        {/* Navigation Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          <nav style={{
            flex: 1,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
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
      <div style={{ display: 'none' }}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 16px',
          height: '48px'
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'opacity 0.2s ease'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#2dd4bf',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>B</span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>BizPal</span>
          </Link>
          <button
            onClick={signOut}
            style={{
              background: 'none',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer'
            }}
          >
            🚪
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;