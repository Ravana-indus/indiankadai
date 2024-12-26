import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define action types
const CartActionTypes = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
};

// Initial state
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CartActionTypes.ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(
        item => item.item_code === action.payload.item_code
      );

      let updatedItems;
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }

      return calculateCartTotals({ ...state, items: updatedItems });
    }

    case CartActionTypes.REMOVE_ITEM: {
      const updatedItems = state.items.filter(
        item => item.item_code !== action.payload.item_code
      );
      return calculateCartTotals({ ...state, items: updatedItems });
    }

    case CartActionTypes.UPDATE_QUANTITY: {
      const updatedItems = state.items
        .map(item =>
          item.item_code === action.payload.item_code
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter(item => item.quantity > 0); // remove items if quantity drops to 0

      return calculateCartTotals({ ...state, items: updatedItems });
    }

    case CartActionTypes.CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

// Helper to recalc totals
const calculateCartTotals = (state) => {
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    ...state,
    itemCount,
    total
  };
};

// Create context
const CartContext = createContext(null);

// Custom hook for using cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Rebuild cart items
      parsedCart.items.forEach(item => {
        dispatch({ type: CartActionTypes.ADD_ITEM, payload: item });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Cart actions
  const addItem = (item) => {
    dispatch({ type: CartActionTypes.ADD_ITEM, payload: item });
  };

  const removeItem = (item_code) => {
    dispatch({ type: CartActionTypes.REMOVE_ITEM, payload: { item_code } });
  };

  const updateQuantity = (item_code, quantity) => {
    dispatch({ type: CartActionTypes.UPDATE_QUANTITY, payload: { item_code, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CartActionTypes.CLEAR_CART });
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
