// src/components/cart/CartItem.jsx
import React from 'react';
import { formatPrice } from '../../utils/formatters';

const CartItem = ({ item, onRemove, onQuantityChange }) => {

  const handleDecrement = () => {
    onQuantityChange(item.item_code, item.quantity - 1);
  };

  const handleIncrement = () => {
    onQuantityChange(item.item_code, item.quantity + 1);
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border">
      {/* Item Image */}
      <img 
        src={item.image} 
        alt={item.item_name} 
        className="w-20 h-20 object-cover rounded-md"
      />
      
      {/* Item Details */}
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.item_name}</h3>
          <button 
            onClick={() => onRemove(item.item_code)}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-500 mt-1">
          {formatPrice(item.price, item.currency)}
        </p>
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button 
            onClick={handleDecrement}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 transition"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button 
            onClick={handleIncrement}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 transition"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Item Subtotal */}
        <div className="mt-2 text-sm text-gray-600">
          Subtotal: {formatPrice(item.price * item.quantity, item.currency)}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
