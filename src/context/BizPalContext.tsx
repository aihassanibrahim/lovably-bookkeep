import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { checkAndCreateTables } from '@/lib/checkDatabase';
import { testDatabaseConnection, testCreateProduct } from '@/lib/testDatabase';

// Initial state
const initialState = {
  orders: [],
  products: [],
  productionTasks: [],
  inventoryItems: [],
  customers: [],
  suppliers: [],
  expenses: []
};

// Action types
const actionTypes = {
  // Orders
  SET_ORDERS: 'SET_ORDERS',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
  
  // Products
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  
  // Production
  SET_PRODUCTION_TASKS: 'SET_PRODUCTION_TASKS',
  ADD_PRODUCTION_TASK: 'ADD_PRODUCTION_TASK',
  UPDATE_PRODUCTION_TASK: 'UPDATE_PRODUCTION_TASK',
  DELETE_PRODUCTION_TASK: 'DELETE_PRODUCTION_TASK',
  
  // Inventory
  SET_INVENTORY_ITEMS: 'SET_INVENTORY_ITEMS',
  ADD_INVENTORY_ITEM: 'ADD_INVENTORY_ITEM',
  UPDATE_INVENTORY_ITEM: 'UPDATE_INVENTORY_ITEM',
  DELETE_INVENTORY_ITEM: 'DELETE_INVENTORY_ITEM',
  
  // Customers
  SET_CUSTOMERS: 'SET_CUSTOMERS',
  ADD_CUSTOMER: 'ADD_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',
  
  // Suppliers
  SET_SUPPLIERS: 'SET_SUPPLIERS',
  ADD_SUPPLIER: 'ADD_SUPPLIER',
  UPDATE_SUPPLIER: 'UPDATE_SUPPLIER',
  DELETE_SUPPLIER: 'DELETE_SUPPLIER',
  
  // Expenses
  SET_EXPENSES: 'SET_EXPENSES',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  
  // Loading states
  SET_LOADING: 'SET_LOADING',
  
  // Data management
  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA'
};

// Reducer
const bizPalReducer = (state, action) => {
  switch (action.type) {
    // Orders
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

    // Products
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

    // Production Tasks
    case actionTypes.SET_PRODUCTION_TASKS:
      return { ...state, productionTasks: action.payload };
    case actionTypes.ADD_PRODUCTION_TASK:
      return { ...state, productionTasks: [...state.productionTasks, action.payload] };
    case actionTypes.UPDATE_PRODUCTION_TASK:
      return {
        ...state,
        productionTasks: state.productionTasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case actionTypes.DELETE_PRODUCTION_TASK:
      return {
        ...state,
        productionTasks: state.productionTasks.filter(task => task.id !== action.payload)
      };

    // Inventory
    case actionTypes.SET_INVENTORY_ITEMS:
      return { ...state, inventoryItems: action.payload };
    case actionTypes.ADD_INVENTORY_ITEM:
      return { ...state, inventoryItems: [...state.inventoryItems, action.payload] };
    case actionTypes.UPDATE_INVENTORY_ITEM:
      return {
        ...state,
        inventoryItems: state.inventoryItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case actionTypes.DELETE_INVENTORY_ITEM:
      return {
        ...state,
        inventoryItems: state.inventoryItems.filter(item => item.id !== action.payload)
      };

    // Customers
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

    // Suppliers
    case actionTypes.SET_SUPPLIERS:
      return { ...state, suppliers: action.payload };
    case actionTypes.ADD_SUPPLIER:
      return { ...state, suppliers: [...state.suppliers, action.payload] };
    case actionTypes.UPDATE_SUPPLIER:
      return {
        ...state,
        suppliers: state.suppliers.map(supplier =>
          supplier.id === action.payload.id ? action.payload : supplier
        )
      };
    case actionTypes.DELETE_SUPPLIER:
      return {
        ...state,
        suppliers: state.suppliers.filter(supplier => supplier.id !== action.payload)
      };

    // Expenses
    case actionTypes.SET_EXPENSES:
      return { ...state, expenses: action.payload };
    case actionTypes.ADD_EXPENSE:
      return { ...state, expenses: [...state.expenses, action.payload] };
    case actionTypes.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        )
      };
    case actionTypes.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    
    // Loading
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    // Data management
    case actionTypes.CLEAR_ALL_DATA:
      return initialState;

    default:
      return state;
  }
};

// Create context
const BizPalContext = createContext();

// Custom hook to use BizPal context
export const useBizPal = () => {
  const context = useContext(BizPalContext);
  if (!context) {
    throw new Error('useBizPal must be used within a BizPalProvider');
  }
  return context;
};

// Provider component
export const BizPalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bizPalReducer, { ...initialState, loading: true });
  const { user } = useAuth();

  // Load all data from Supabase when user changes
  useEffect(() => {
    if (user) {
      // First check and create tables if they don't exist
      checkAndCreateTables().then(() => {
        // Test database connection
        testDatabaseConnection().then(() => {
          // Test product creation
          testCreateProduct().then((success) => {
            if (success) {
              console.log('✅ Database is fully functional');
            } else {
              console.log('❌ Database has issues');
            }
            loadAllData();
          });
        });
      });
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

      if (ordersError) throw ordersError;
      dispatch({ type: actionTypes.SET_ORDERS, payload: orders || [] });

      // Load customers
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('company_name');

      if (customersError) throw customersError;
      dispatch({ type: actionTypes.SET_CUSTOMERS, payload: customers || [] });

      // Load suppliers
      const { data: suppliers, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('company_name');

      if (suppliersError) throw suppliersError;
      dispatch({ type: actionTypes.SET_SUPPLIERS, payload: suppliers || [] });

      // Load products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (productsError) throw productsError;
      dispatch({ type: actionTypes.SET_PRODUCTS, payload: products || [] });

      // Load expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (expensesError) throw expensesError;
      dispatch({ type: actionTypes.SET_EXPENSES, payload: expenses || [] });

      // Load production tasks
      const { data: productionTasks, error: productionTasksError } = await supabase
        .from('production_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (productionTasksError) {
        console.log('Production tasks error:', productionTasksError.message);
        dispatch({ type: actionTypes.SET_PRODUCTION_TASKS, payload: [] });
      } else {
        dispatch({ type: actionTypes.SET_PRODUCTION_TASKS, payload: productionTasks || [] });
      }

      // Load inventory items
      const { data: inventoryItems, error: inventoryItemsError } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (inventoryItemsError) {
        console.log('Inventory items error:', inventoryItemsError.message);
        dispatch({ type: actionTypes.SET_INVENTORY_ITEMS, payload: [] });
      } else {
        dispatch({ type: actionTypes.SET_INVENTORY_ITEMS, payload: inventoryItems || [] });
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Kunde inte ladda data');
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  // Helper functions to calculate stats
  const getStats = () => {
    const orders = state.orders || [];
    const products = state.products || [];
    const productionTasks = state.productionTasks || [];
    const inventoryItems = state.inventoryItems || [];
    const expenses = state.expenses || [];

    // Orders stats
    const activeOrders = orders.filter(order => order.status !== "Skickad").length;
    const completedOrders = orders.filter(order => order.status === "Skickad").length;
    const totalRevenue = orders
      .filter(order => order.status === "Skickad")
      .reduce((sum, order) => sum + (order.price || 0), 0);

    // Production stats (placeholder)
    const activeProductionTasks = productionTasks.filter(task => task.status !== "completed").length;
    const urgentTasks = productionTasks.filter(task => {
      if (task.status === "completed" || !task.due_date) return false;
      const today = new Date();
      const dueDate = new Date(task.due_date);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 3;
    }).length;

    // Inventory stats (placeholder)
    const lowStockItems = inventoryItems.filter(item => 
      parseFloat(item.current_stock || 0) <= parseFloat(item.min_stock || 0)
    ).length;
    const totalInventoryValue = inventoryItems.reduce((sum, item) => 
      sum + ((parseFloat(item.current_stock || 0) * parseFloat(item.cost_per_unit || 0)) || 0), 0
    );

    // Products stats
    const totalProducts = products.length;
    const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean)).size;

    // Expenses stats
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.kostnad_med_moms || 0), 0);

    return {
      orders: {
        total: orders.length,
        active: activeOrders,
        completed: completedOrders,
        revenue: totalRevenue
      },
      production: {
        active: activeProductionTasks,
        urgent: urgentTasks,
        completed: productionTasks.filter(task => task.status === "completed").length
      },
      inventory: {
        totalItems: inventoryItems.length,
        lowStock: lowStockItems,
        totalValue: totalInventoryValue
      },
      products: {
        total: totalProducts,
        categories: uniqueCategories
      },
      expenses: {
        total: expenses.length,
        totalAmount: totalExpenses
      }
    };
  };

  // Action creators with Supabase integration
  const actions = {
    // Orders
    addOrder: async (orderData) => {
      if (!user) return;
      
      try {
        // Convert price to number
        const orderWithPrice = {
          ...orderData,
          price: parseFloat(orderData.price) || 0,
          user_id: user.id
        };

        const { data, error } = await supabase
          .from('orders')
          .insert(orderWithPrice)
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
        // Convert price to number
        const orderWithPrice = {
          ...orderData,
          price: parseFloat(orderData.price) || 0
        };

        const { data, error } = await supabase
          .from('orders')
          .update(orderWithPrice)
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

    // Expenses
    addExpense: async (expenseData) => {
      if (!user) return;
      
      try {
        // Ensure we're using the correct column names
        const expenseDataToInsert = {
          expense_number: expenseData.expense_number,
          supplier_name: expenseData.supplier_name,
          expense_date: expenseData.expense_date,
          description: expenseData.description,
          kostnad_med_moms: expenseData.kostnad_med_moms,
          amount: expenseData.kostnad_med_moms, // Also populate the old column for compatibility
          category: expenseData.category,
          receipt_url: expenseData.receipt_url,
          notes: expenseData.notes,
          user_id: user.id
        };

        const { data, error } = await supabase
          .from('expenses')
          .insert(expenseDataToInsert)
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.ADD_EXPENSE, payload: data });
        toast.success('Utgift tillagd!');
        return data;
      } catch (error) {
        console.error('Error adding expense:', error);
        toast.error('Kunde inte lägga till utgift');
        throw error;
      }
    },

    updateExpense: async (expenseData) => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', expenseData.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.UPDATE_EXPENSE, payload: data });
        toast.success('Utgift uppdaterad!');
        return data;
      } catch (error) {
        console.error('Error updating expense:', error);
        toast.error('Kunde inte uppdatera utgift');
        throw error;
      }
    },

    deleteExpense: async (expenseId) => {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', expenseId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        dispatch({ type: actionTypes.DELETE_EXPENSE, payload: expenseId });
        toast.success('Utgift raderad!');
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast.error('Kunde inte radera utgift');
        throw error;
      }
    },

    // Customers
    addCustomer: async (customerData) => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('customers')
          .insert({ ...customerData, user_id: user.id })
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

    // Suppliers
    addSupplier: async (supplierData) => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .insert({ ...supplierData, user_id: user.id })
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.ADD_SUPPLIER, payload: data });
        toast.success('Leverantör tillagd!');
        return data;
      } catch (error) {
        console.error('Error adding supplier:', error);
        toast.error('Kunde inte lägga till leverantör');
        throw error;
      }
    },

    updateSupplier: async (supplierData) => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .update(supplierData)
          .eq('id', supplierData.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.UPDATE_SUPPLIER, payload: data });
        toast.success('Leverantör uppdaterad!');
        return data;
      } catch (error) {
        console.error('Error updating supplier:', error);
        toast.error('Kunde inte uppdatera leverantör');
        throw error;
      }
    },

    deleteSupplier: async (supplierId) => {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from('suppliers')
          .update({ is_active: false })
          .eq('id', supplierId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        dispatch({ type: actionTypes.DELETE_SUPPLIER, payload: supplierId });
        toast.success('Leverantör raderad!');
      } catch (error) {
        console.error('Error deleting supplier:', error);
        toast.error('Kunde inte radera leverantör');
        throw error;
      }
    },

    // Income Transactions
    addIncomeTransaction: async (incomeData) => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            transaction_date: incomeData.date,
            description: incomeData.description,
            total_amount: parseFloat(incomeData.amount),
            transaction_type: 'income',
            category: incomeData.category,
            reference_number: `INC-${Date.now()}`
          })
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Intäkt registrerad!');
        return data;
      } catch (error) {
        console.error('Error adding income transaction:', error);
        toast.error('Kunde inte registrera intäkt');
        throw error;
      }
    },

    // Products
    addProduct: async (productData) => {
      if (!user) {
        console.error('No user found');
        toast.error('Du måste vara inloggad');
        return;
      }
      
      try {
        console.log('Attempting to add product with data:', { ...productData, user_id: user.id });
        
        const { data, error } = await supabase
          .from('products')
          .insert({ ...productData, user_id: user.id })
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Product added successfully:', data);
        dispatch({ type: actionTypes.ADD_PRODUCT, payload: data });
        toast.success('Produkt tillagd!');
        return data;
      } catch (error) {
        console.error('Error adding product:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        toast.error(`Kunde inte lägga till produkt: ${error.message}`);
        throw error;
      }
    },

    updateProduct: async (productData) => {
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

    // Production Tasks
    addProductionTask: async (taskData) => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('production_tasks')
          .insert({ ...taskData, user_id: user.id })
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.ADD_PRODUCTION_TASK, payload: data });
        toast.success('Produktionsuppgift tillagd!');
        return data;
      } catch (error) {
        console.error('Error adding production task:', error);
        toast.error('Kunde inte lägga till produktionsuppgift');
        throw error;
      }
    },

    updateProductionTask: async (taskData) => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('production_tasks')
          .update(taskData)
          .eq('id', taskData.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.UPDATE_PRODUCTION_TASK, payload: data });
        toast.success('Produktionsuppgift uppdaterad!');
        return data;
      } catch (error) {
        console.error('Error updating production task:', error);
        toast.error('Kunde inte uppdatera produktionsuppgift');
        throw error;
      }
    },

    deleteProductionTask: async (taskId) => {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from('production_tasks')
          .delete()
          .eq('id', taskId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        dispatch({ type: actionTypes.DELETE_PRODUCTION_TASK, payload: taskId });
        toast.success('Produktionsuppgift raderad!');
      } catch (error) {
        console.error('Error deleting production task:', error);
        toast.error('Kunde inte radera produktionsuppgift');
        throw error;
      }
    },

    // Inventory Items
    addInventoryItem: async (itemData) => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .insert({ ...itemData, user_id: user.id })
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.ADD_INVENTORY_ITEM, payload: data });
        toast.success('Lagerartikel tillagd!');
        return data;
      } catch (error) {
        console.error('Error adding inventory item:', error);
        toast.error('Kunde inte lägga till lagerartikel');
        throw error;
      }
    },

    updateInventoryItem: async (itemData) => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .update(itemData)
          .eq('id', itemData.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        dispatch({ type: actionTypes.UPDATE_INVENTORY_ITEM, payload: data });
        toast.success('Lagerartikel uppdaterad!');
        return data;
      } catch (error) {
        console.error('Error updating inventory item:', error);
        toast.error('Kunde inte uppdatera lagerartikel');
        throw error;
      }
    },

    deleteInventoryItem: async (itemId) => {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from('inventory_items')
          .update({ is_active: false })
          .eq('id', itemId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        dispatch({ type: actionTypes.DELETE_INVENTORY_ITEM, payload: itemId });
        toast.success('Lagerartikel raderad!');
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        toast.error('Kunde inte radera lagerartikel');
        throw error;
      }
    },

    // Data management
    refreshData: loadAllData,
    clearAllData: () => dispatch({ type: actionTypes.CLEAR_ALL_DATA })
  };

  const value = {
    // State
    orders: state.orders || [],
    products: state.products || [],
    productionTasks: state.productionTasks || [],
    inventoryItems: state.inventoryItems || [],
    customers: state.customers || [],
    suppliers: state.suppliers || [],
    expenses: state.expenses || [],
    loading: state.loading,
    
    // Computed stats
    stats: getStats(),
    
    // Actions
    ...actions
  };

  return (
    <BizPalContext.Provider value={value}>
      {children}
    </BizPalContext.Provider>
  );
};

export default BizPalContext; 