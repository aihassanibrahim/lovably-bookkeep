import React from 'react';
import { useAuth } from "@/components/auth/AuthProvider";
import { useBizPal } from "@/context/BizPalContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const { orders, products, customers, loading } = useBizPal();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  const stats = {
    totalOrders: orders?.length || 0,
    activeOrders: orders?.filter(o => o.status !== "Levererad" && o.status !== "Avbruten").length || 0,
    completedOrders: orders?.filter(o => o.status === "Levererad").length || 0,
    totalRevenue: orders?.filter(o => o.status === "Levererad").reduce((sum, order) => sum + (order.price || 0), 0) || 0
  };

  const recentOrders = orders
    ?.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    ?.slice(0, 5) || [];

  if (loading) {
    return (
      <div style={{ 
        padding: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #2dd4bf',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#64748b' }}>Laddar data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '48px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '900', 
            color: '#1e293b',
            lineHeight: '1.1',
            letterSpacing: '-0.025em'
          }}>
            Dashboard
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '18px',
            lineHeight: '1.6'
          }}>
            Översikt av din verksamhet - {new Date().toLocaleDateString('sv-SE')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navigate('/orders')}
            className="finpay-button-primary"
          >
            <span style={{ marginRight: '8px' }}>➕</span>
            Ny Order
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px'
      }}>
        <div className="finpay-card" style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Aktiva Ordrar</span>
            <span style={{ fontSize: '20px' }}>📦</span>
          </div>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#1e293b' }}>{stats.activeOrders}</div>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            {stats.totalOrders} totalt
          </p>
        </div>
        
        <div className="finpay-card" style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Månadens Intäkter</span>
            <span style={{ fontSize: '20px' }}>📈</span>
          </div>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e' }}>
            {formatCurrency(stats.totalRevenue)}
          </div>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            {stats.completedOrders} levererade
          </p>
        </div>
        
        <div className="finpay-card" style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Produkter</span>
            <span style={{ fontSize: '20px' }}>🛍️</span>
          </div>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#1e293b' }}>{products?.length || 0}</div>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            I katalogen
          </p>
        </div>
        
        <div className="finpay-card" style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Kunder</span>
            <span style={{ fontSize: '20px' }}>👥</span>
          </div>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#1e293b' }}>{customers?.length || 0}</div>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Registrerade
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="finpay-card" style={{ padding: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h2 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1e293b'
          }}>
            <span>📦</span>
            Senaste Ordrar
          </h2>
          <button 
            onClick={() => navigate('/orders')}
            className="finpay-button-secondary"
          >
            Se alla →
          </button>
        </div>
        
        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>Inga ordrar än</p>
            <button 
              onClick={() => navigate('/orders')}
              className="finpay-button-primary"
            >
              <span style={{ marginRight: '8px' }}>➕</span>
              Skapa första ordern
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentOrders.map((order) => (
              <div key={order.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                backgroundColor: '#fafafa',
                transition: 'background-color 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(45, 212, 191, 0.1)',
                    borderRadius: '12px'
                  }}>
                    <span style={{ fontSize: '20px' }}>📦</span>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '500', color: '#1e293b' }}>{order.order_number}</h4>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>{order.customer_name}</p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>{order.product_name}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>{formatCurrency(order.price || 0)}</div>
                  <span style={{
                    backgroundColor: order.status === 'Levererad' ? '#dcfce7' : 
                                   order.status === 'Klar' ? '#f3e8ff' :
                                   order.status === 'I produktion' ? '#fed7aa' : '#dbeafe',
                    color: order.status === 'Levererad' ? '#166534' :
                           order.status === 'Klar' ? '#7c3aed' :
                           order.status === 'I produktion' ? '#ea580c' : '#2563eb',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px'
      }}>
        <div 
          className="finpay-card" 
          style={{ 
            padding: '24px',
            cursor: 'pointer',
            border: '1px solid #2dd4bf',
            transition: 'all 0.3s ease'
          }}
          onClick={() => navigate('/orders')}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(45, 212, 191, 0.1)',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '24px' }}>➕</span>
          </div>
          <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px', color: '#1e293b' }}>Ny Order</h3>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Lägg till ny beställning</p>
        </div>

        <div 
          className="finpay-card" 
          style={{ 
            padding: '24px',
            cursor: 'pointer',
            border: '1px solid #22c55e',
            transition: 'all 0.3s ease'
          }}
          onClick={() => navigate('/products')}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            backgroundColor: '#dcfce7',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '24px' }}>🛍️</span>
          </div>
          <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px', color: '#1e293b' }}>Hantera Produkter</h3>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Uppdatera produktkatalog</p>
        </div>

        <div 
          className="finpay-card" 
          style={{ 
            padding: '24px',
            cursor: 'pointer',
            border: '1px solid #8b5cf6',
            transition: 'all 0.3s ease'
          }}
          onClick={() => navigate('/customers')}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            backgroundColor: '#f3e8ff',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '24px' }}>👥</span>
          </div>
          <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px', color: '#1e293b' }}>Kundregister</h3>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Hantera kunder</p>
        </div>
      </div>
    </div>
  );
}