import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

const bizPalReducer = (state: any, action: any) => {
  switch (action.type) {
    case actionTypes.SET_ORDERS:
      return { ...state, orders: action.payload };
    case actionTypes.ADD_ORDER:
      return { ...state, orders: [...state.orders, action.payload] };
    case actionTypes.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map((order: any) =>
          order.id === action.payload.id ? action.payload : order
        )
      };
    case actionTypes.DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter((order: any) => order.id !== action.payload)
      };
    case actionTypes.SET_PRODUCTS:
      return { ...state, products: action.payload };
    case actionTypes.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };
    case actionTypes.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product: any) =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    case actionTypes.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter((product: any) => product.id !== action.payload)
      };
    case actionTypes.SET_CUSTOMERS:
      return { ...state, customers: action.payload };
    case actionTypes.ADD_CUSTOMER:
      return { ...state, customers: [...state.customers, action.payload] };
    case actionTypes.UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map((customer: any) =>
          customer.id === action.payload.id ? action.payload : customer
        )
      };
    case actionTypes.DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter((customer: any) => customer.id !== action.payload)
      };
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.CLEAR_ALL_DATA:
      return initialState;
    default:
      return state;
  }
};

const BizPalContext = createContext<any>(null);

export const useBizPal = () => {
  const context = useContext(BizPalContext);
  if (!context) {
    throw new Error('useBizPal must be used within a BizPalProvider');
  }
  return context;
};

export const BizPalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(bizPalReducer, { ...initialState, loading: true });
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

      // Load orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!ordersError) {
        dispatch({ type: actionTypes.SET_ORDERS, payload: orders || [] });
      }

      // Load customers
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('company_name');

      if (!customersError) {
        dispatch({ type: actionTypes.SET_CUSTOMERS, payload: customers || [] });
      }

      // Load products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('name');

      if (!productsError) {
        dispatch({ type: actionTypes.SET_PRODUCTS, payload: products || [] });
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Kunde inte ladda data');
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  const addOrder = async (orderData: any) => {
    if (!user) return;
    
    try {
      const orderWithDefaults = {
        ...orderData,
        user_id: user.id,
        order_number: orderData.order_number || `ORD-${Date.now()}`
      };

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
  };

  const updateOrder = async (orderData: any) => {
    if (!user) return;
    
    try {
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
  };

  const deleteOrder = async (orderId: string) => {
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
  };

  const addProduct = async (productData: any) => {
    if (!user) return;
    
    try {
      const productWithDefaults = {
        ...productData,
        user_id: user.id,
        is_active: true
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
  };

  const updateProduct = async (productData: any) => {
    if (!user) return;
    
    try {
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
  };

  const deleteProduct = async (productId: string) => {
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
  };

  const addCustomer = async (customerData: any) => {
    if (!user) return;
    
    try {
      const customerWithDefaults = {
        ...customerData,
        user_id: user.id,
        is_active: true,
        customer_number: `KUND-${Date.now()}`
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
  };

  const updateCustomer = async (customerData: any) => {
    if (!user) return;
    
    try {
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
  };

  const deleteCustomer = async (customerId: string) => {
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
  };

  const value = {
    orders: state.orders || [],
    products: state.products || [],
    customers: state.customers || [],
    loading: state.loading,
    addOrder,
    updateOrder,
    deleteOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refreshData: loadAllData
  };

  return (
    <BizPalContext.Provider value={value}>
      {children}
    </BizPalContext.Provider>
  );
};