// src/services/cart.js

export const saveCartToStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };
  
  export const getCartFromStorage = () => {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : null;
    } catch (error) {
      console.error('Error parsing cart from storage:', error);
      return null;
    }
  };
  
  export const addItemToCart = (cart, item) => {
    const existingItem = cart.items.find(i => i.item_code === item.item_code);
    
    if (existingItem) {
      return {
        ...cart,
        items: cart.items.map(i => 
          i.item_code === item.item_code
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      };
    }
    
    return {
      ...cart,
      items: [...cart.items, { ...item, quantity: item.quantity || 1 }]
    };
  };
  
  export const removeItemFromCart = (cart, itemCode) => {
    return {
      ...cart,
      items: cart.items.filter(item => item.item_code !== itemCode)
    };
  };
  
  export const updateItemQuantity = (cart, itemCode, quantity) => {
    return {
      ...cart,
      items: cart.items
        .map(item => 
          item.item_code === itemCode
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
        .filter(item => item.quantity > 0)
    };
  };
  
  export const calculateCartTotals = (cart) => {
    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;
  
    return {
      itemCount,
      subtotal,
      shipping,
      total
    };
  };
  
  export const formatCartForApi = (cart) => {
    return {
      items: cart.items.map(item => ({
        item_code: item.item_code,
        quantity: item.quantity,
        price: item.price,
        currency: item.currency
      })),
      total: calculateCartTotals(cart).total,
      currency: cart.items[0]?.currency || 'INR'
    };
  };
  
  export const validateCartItem = (item) => {
    const requiredFields = ['item_code', 'item_name', 'price', 'currency'];
    const missingFields = requiredFields.filter(field => !item[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Invalid cart item: Missing fields - ${missingFields.join(', ')}`);
    }
    
    if (typeof item.price !== 'number' || item.price <= 0) {
      throw new Error('Invalid cart item: Price must be a positive number');
    }
    
    return true;
  };
  
  export const clearCart = () => {
    localStorage.removeItem('cart');
    return { items: [], totals: calculateCartTotals({ items: [] }) };
  };