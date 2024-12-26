// src/pages/CartPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../cart/CartItem';
import { ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, total, removeItem, updateQuantity } = useCart();

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400" />
          </div>
          <p className="text-gray-500 mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem 
                key={item.item_code}
                item={item}
                onRemove={removeItem}
                onQuantityChange={updateQuantity}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span>{items[0]?.currency} {total.toLocaleString()}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>Total</span>
                <span>{items[0]?.currency} {total.toLocaleString()}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')} // or your checkout page
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition mt-4"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-md hover:bg-gray-200 transition"
              >
                Continue Shopping
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t">
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2}
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  Free shipping on all orders
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                    />
                  </svg>
                  Secure checkout
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                    />
                  </svg>
                  30-day returns
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;