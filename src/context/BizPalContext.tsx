import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { supabase, ensureUserExists } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

const initialState = {
  orders: [],
  products: [],
  customers: [],
  loading: false
};

const actionTypes = {
  SET_ORDERS: 'SET_ORDERS',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
  
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  
  SET_CUSTOMERS: 'SET_CUSTOMERS',
  ADD_CUSTOMER: 'ADD_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',
  
  SET_LOADING: 'SET_LOADING',
  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA'
};

const bizPalReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_ORDERS:
      return { ...state, orders: action.payload };
    case actionTypes.ADD_ORDER:
      return { ...state, orders: [...state.orders, action.payload] };
    case actionTypes.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        )
      };
    case actionTypes.DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload)
      };

    case actionTypes.SET_PRODUCTS:
      return { ...state, products: action.payload };
    case actionTypes.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };
    case actionTypes.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    case actionTypes.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };

    case actionTypes.SET_CUSTOMERS:
      return { ...state, customers: action.payload };
    case actionTypes.ADD_CUSTOMER:
      return { ...state, customers: [...state.customers, action.payload] };
    case actionTypes.UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        )
      };
    case actionTypes.DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload)
      };
    
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.CLEAR_ALL_DATA:
      return initialState;

    default:
      return state;
  }
};

const BizPalContext = createContext(null);

export const useBizPal = () => {
  const context = useContext(BizPalContext);
  if (!context) {
    throw new Error('useBizPal must be used within a BizPalProvider');
  }
  return context;
};

export const BizPalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bizPalReducer, { ...initialState, loading: true });
  const [error, setError] = useState(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadAllData();
    } else {
      dispatch({ type: actionTypes.CLEAR_ALL_DATA });
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;

    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Orders error:', ordersError);
        dispatch({ type: actionTypes.SET_ORDERS, payload: [] });
      } else {
        dispatch({ type: actionTypes.SET_ORDERS, payload: orders || [] });
      }

      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('company_name');

      if (customersError) {
        console.error('Customers error:', customersError);
        dispatch({ type: actionTypes.SET_CUSTOMERS, payload: [] });
      } else {
        dispatch({ type: actionTypes.SET_CUSTOMERS, payload: customers || [] });
      }

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('name');

      if (productsError) {
        console.error('Products error:', productsError);
        dispatch({ type: actionTypes.SET_PRODUCTS, payload: [] });
      } else {
        dispatch({ type: actionTypes.SET_PRODUCTS, payload: products || [] });
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Kunde inte ladda data');
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  const getStats = () => {
    const orders = state.orders || [];
    
    const activeOrders = orders.filter(order => 
      order.status !== "Levererad" && order.status !== "Avbruten"
    ).length;
    
    const completedOrders = orders.filter(order => 
      order.status === "Levererad"
    ).length;
    
    const totalRevenue = orders
      .filter(order => order.status === "Levererad")
      .reduce((sum, order) => sum + (order.price || 0), 0);

    return {
      orders: {
        total: orders.length,
        active: activeOrders,
        completed: completedOrders,
        revenue: totalRevenue
      }
    };
  };

  const actions = {
    addOrder: async (orderData) => {
      if (!user) return;
      
      // Ensure user exists in database before creating order
      const userExists = await ensureUserExists(user.id);
      if (!userExists) {
        toast.error('Kunde inte verifiera användare');
        return;
      }
      
      try {
        const orderWithDefaults = {
          ...orderData,
          price: parseFloat(orderData.price) || 0,
          user_id: user.id,
          order_number: orderData.order_number || `ORD-${Date.now()}`,
          status: orderData.status || 'Beställd',
          order_date: orderData.order_date || new Date().toISOString().split('T')[0]
        };

        // Validate required fields
        if (!orderWithDefaults.customer_name?.trim()) {
          toast.error('Kundnamn krävs');
          return;
        }
        if (!orderWithDefaults.product_name?.trim()) {
          toast.error('Produktnamn krävs');
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .insert(orderWithDefaults)
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.ADD_ORDER, payload: data });
        toast.success('Order skapad!');
        return data;
      } catch (error) {
        console.error('Error adding order:', error);
        toast.error('Kunde inte skapa order');
        throw error;
      }
    },

    updateOrder: async (orderData) => {
      if (!user) return;
      
      try {
        // Validate required fields
        if (!orderData.customer_name?.trim()) {
          toast.error('Kundnamn krävs');
          return;
        }
        if (!orderData.product_name?.trim()) {
          toast.error('Produktnamn krävs');
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .update(orderData)
          .eq('id', orderData.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.UPDATE_ORDER, payload: data });
        toast.success('Order uppdaterad!');
        return data;
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Kunde inte uppdatera order');
        throw error;
      }
    },

    deleteOrder: async (orderId) => {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', orderId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        dispatch({ type: actionTypes.DELETE_ORDER, payload: orderId });
        toast.success('Order raderad!');
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Kunde inte radera order');
        throw error;
      }
    },

    addProduct: async (productData) => {
      if (!user) return;
      
      // Ensure user exists in database before creating product
      const userExists = await ensureUserExists(user.id);
      if (!userExists) {
        toast.error('Kunde inte verifiera användare');
        return;
      }
      
      try {
        // Validate required fields
        if (!productData.name?.trim()) {
          toast.error('Produktnamn krävs');
          return;
        }
        if (productData.price && parseFloat(productData.price) < 0) {
          toast.error('Priset kan inte vara negativt');
          return;
        }

        const productWithDefaults = {
          ...productData,
          price: parseFloat(productData.price) || 0,
          cost: parseFloat(productData.cost) || 0,
          user_id: user.id,
          is_active: true,
          product_number: productData.product_number || `PROD-${Date.now()}`
        };

        const { data, error } = await supabase
          .from('products')
          .insert(productWithDefaults)
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.ADD_PRODUCT, payload: data });
        toast.success('Produkt tillagd!');
        return data;
      } catch (error) {
        console.error('Error adding product:', error);
        toast.error('Kunde inte lägga till produkt');
        throw error;
      }
    },

    updateProduct: async (productData) => {
      if (!user) return;
      
      try {
        // Validate required fields
        if (!productData.name?.trim()) {
          toast.error('Produktnamn krävs');
          return;
        }
        if (productData.price && parseFloat(productData.price) < 0) {
          toast.error('Priset kan inte vara negativt');
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productData.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.UPDATE_PRODUCT, payload: data });
        toast.success('Produkt uppdaterad!');
        return data;
      } catch (error) {
        console.error('Error updating product:', error);
        toast.error('Kunde inte uppdatera produkt');
        throw error;
      }
    },

    deleteProduct: async (productId) => {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from('products')
          .update({ is_active: false })
          .eq('id', productId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        dispatch({ type: actionTypes.DELETE_PRODUCT, payload: productId });
        toast.success('Produkt raderad!');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Kunde inte radera produkt');
        throw error;
      }
    },

    addCustomer: async (customerData) => {
      if (!user) return;
      
      // Ensure user exists in database before creating customer
      const userExists = await ensureUserExists(user.id);
      if (!userExists) {
        toast.error('Kunde inte verifiera användare');
        return;
      }
      
      try {
        // Validate required fields
        if (!customerData.company_name?.trim()) {
          toast.error('Företagsnamn krävs');
          return;
        }

        const customerWithDefaults = {
          ...customerData,
          user_id: user.id,
          is_active: true,
          customer_number: customerData.customer_number || `KUND-${Date.now()}`
        };

        const { data, error } = await supabase
          .from('customers')
          .insert(customerWithDefaults)
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.ADD_CUSTOMER, payload: data });
        toast.success('Kund tillagd!');
        return data;
      } catch (error) {
        console.error('Error adding customer:', error);
        toast.error('Kunde inte lägga till kund');
        throw error;
      }
    },

    updateCustomer: async (customerData) => {
      if (!user) return;
      
      try {
        // Validate required fields
        if (!customerData.company_name?.trim()) {
          toast.error('Företagsnamn krävs');
          return;
        }

        const { data, error } = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', customerData.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.UPDATE_CUSTOMER, payload: data });
        toast.success('Kund uppdaterad!');
        return data;
      } catch (error) {
        console.error('Error updating customer:', error);
        toast.error('Kunde inte uppdatera kund');
        throw error;
      }
    },

    deleteCustomer: async (customerId) => {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from('customers')
          .update({ is_active: false })
          .eq('id', customerId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        dispatch({ type: actionTypes.DELETE_CUSTOMER, payload: customerId });
        toast.success('Kund raderad!');
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error('Kunde inte radera kund');
        throw error;
      }
    },

    refreshData: loadAllData,
    clearAllData: () => dispatch({ type: actionTypes.CLEAR_ALL_DATA })
  };

  const value = {
    orders: state.orders || [],
    products: state.products || [],
    customers: state.customers || [],
    loading: state.loading,
    stats: getStats(),
    ...actions
  };

  if (error) {
    console.error('BizPalProvider error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-red-800 mb-4">Systemfel</h2>
          <p className="text-red-600 mb-4">Kunde inte ladda applikationen</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Ladda om sidan
          </button>
        </div>
      </div>
    );
  }

  return (
    <BizPalContext.Provider value={value}>
      {children}
    </BizPalContext.Provider>
  );
};

export default BizPalContext;