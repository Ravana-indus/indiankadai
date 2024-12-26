import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatters';

const CartSummary = ({ onCheckout }) => {
  const navigate = useNavigate();
  const { items, total } = useCart();

  // Calculate subtotal and other costs
  const subtotal = total;
  const shipping = 0; // Free shipping
  const finalTotal = subtotal + shipping;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} items)</span>
          <span>{formatPrice(subtotal, items[0]?.currency)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>Free</span>
        </div>

        {/* Add any other fees/discounts here */}
        
        {/* Total */}
        <div className="flex justify-between font-bold text-lg pt-3 border-t">
          <span>Total</span>
          <span>{formatPrice(finalTotal, items[0]?.currency)}</span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
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

      {/* Additional Information */}
      <div className="mt-4 pt-4 border-t text-sm text-gray-500">
        <p>• Free shipping on all orders</p>
        <p>• Secure checkout process</p>
        <p>• Support local businesses</p>
      </div>
    </div>
  );
};

export default CartSummary;