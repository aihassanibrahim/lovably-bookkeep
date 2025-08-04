import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  orders: [],
  products: [],
  productionTasks: [],
  inventoryItems: [],
  customers: [],
  suppliers: []
};

// Action types
const actionTypes = {
  // Orders
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
  
  // Products
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  
  // Production
  ADD_PRODUCTION_TASK: 'ADD_PRODUCTION_TASK',
  UPDATE_PRODUCTION_TASK: 'UPDATE_PRODUCTION_TASK',
  DELETE_PRODUCTION_TASK: 'DELETE_PRODUCTION_TASK',
  
  // Inventory
  ADD_INVENTORY_ITEM: 'ADD_INVENTORY_ITEM',
  UPDATE_INVENTORY_ITEM: 'UPDATE_INVENTORY_ITEM',
  DELETE_INVENTORY_ITEM: 'DELETE_INVENTORY_ITEM',
  
  // Data management
  LOAD_DATA: 'LOAD_DATA',
  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA'
};

// Reducer
const bizPalReducer = (state, action) => {
  switch (action.type) {
    // Orders
    case actionTypes.ADD_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
    
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
    case actionTypes.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    
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
    case actionTypes.ADD_PRODUCTION_TASK:
      return {
        ...state,
        productionTasks: [...state.productionTasks, action.payload]
      };
    
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
    case actionTypes.ADD_INVENTORY_ITEM:
      return {
        ...state,
        inventoryItems: [...state.inventoryItems, action.payload]
      };
    
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

    // Data management
    case actionTypes.LOAD_DATA:
      return {
        ...state,
        ...action.payload
      };
    
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

// LocalStorage key
const STORAGE_KEY = 'bizpal-data';

// Provider component
export const BizPalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bizPalReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: actionTypes.LOAD_DATA, payload: parsedData });
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state]);

  // Helper functions to calculate stats
  const getStats = () => {
    const orders = state.orders || [];
    const products = state.products || [];
    const productionTasks = state.productionTasks || [];
    const inventoryItems = state.inventoryItems || [];

    // Orders stats
    const activeOrders = orders.filter(order => order.status !== "Skickad").length;
    const completedOrders = orders.filter(order => order.status === "Skickad").length;
    const totalRevenue = orders
      .filter(order => order.status === "Skickad")
      .reduce((sum, order) => sum + (order.price || 0), 0);

    // Production stats
    const activeProductionTasks = productionTasks.filter(task => task.status !== "Klar").length;
    const urgentTasks = productionTasks.filter(task => {
      if (task.status === "Klar" || !task.dueDate) return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 3;
    }).length;

    // Inventory stats
    const lowStockItems = inventoryItems.filter(item => 
      parseFloat(item.currentStock || 0) <= parseFloat(item.minStock || 0)
    ).length;
    const totalInventoryValue = inventoryItems.reduce((sum, item) => 
      sum + ((parseFloat(item.currentStock || 0) * parseFloat(item.costPerUnit || 0)) || 0), 0
    );

    // Products stats
    const totalProducts = products.length;
    const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean)).size;

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
        completed: productionTasks.filter(task => task.status === "Klar").length
      },
      inventory: {
        totalItems: inventoryItems.length,
        lowStock: lowStockItems,
        totalValue: totalInventoryValue
      },
      products: {
        total: totalProducts,
        categories: uniqueCategories
      }
    };
  };

  // Action creators
  const actions = {
    // Orders
    addOrder: (order) => dispatch({ type: actionTypes.ADD_ORDER, payload: order }),
    updateOrder: (order) => dispatch({ type: actionTypes.UPDATE_ORDER, payload: order }),
    deleteOrder: (id) => dispatch({ type: actionTypes.DELETE_ORDER, payload: id }),

    // Products
    addProduct: (product) => dispatch({ type: actionTypes.ADD_PRODUCT, payload: product }),
    updateProduct: (product) => dispatch({ type: actionTypes.UPDATE_PRODUCT, payload: product }),
    deleteProduct: (id) => dispatch({ type: actionTypes.DELETE_PRODUCT, payload: id }),

    // Production
    addProductionTask: (task) => dispatch({ type: actionTypes.ADD_PRODUCTION_TASK, payload: task }),
    updateProductionTask: (task) => dispatch({ type: actionTypes.UPDATE_PRODUCTION_TASK, payload: task }),
    deleteProductionTask: (id) => dispatch({ type: actionTypes.DELETE_PRODUCTION_TASK, payload: id }),

    // Inventory
    addInventoryItem: (item) => dispatch({ type: actionTypes.ADD_INVENTORY_ITEM, payload: item }),
    updateInventoryItem: (item) => dispatch({ type: actionTypes.UPDATE_INVENTORY_ITEM, payload: item }),
    deleteInventoryItem: (id) => dispatch({ type: actionTypes.DELETE_INVENTORY_ITEM, payload: id }),

    // Data management
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