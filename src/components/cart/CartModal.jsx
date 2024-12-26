import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatters';

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, total, updateQuantity, removeItem } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-10 md:inset-[10%] lg:inset-[15%] bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.item_code} 
                     className="flex items-start gap-4 p-4 bg-white rounded-lg border">
                  {/* Item Image */}
                  <img src={item.image} 
                       alt={item.item_name} 
                       className="w-20 h-20 object-cover rounded-md"
                  />
                  
                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.item_name}</h3>
                      <button onClick={() => removeItem(item.item_code)}
                              className="text-gray-400 hover:text-red-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-500 mt-1">
                      {formatPrice(item.price, item.currency)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.item_code, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 
                                         rounded hover:bg-gray-200">
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.item_code, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 
                                         rounded hover:bg-gray-200">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="space-y-4">
            {items.length > 0 && (
              <>
                <div className="flex justify-between text-lg">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">
                    {formatPrice(total, items[0]?.currency)}
                  </span>
                </div>
                <button onClick={handleCheckout}
                        className="w-full bg-black text-white py-3 rounded-md 
                                 hover:bg-gray-800 transition">
                  Proceed to Checkout
                </button>
              </>
            )}
            <button onClick={onClose}
                    className="w-full bg-gray-100 text-gray-800 py-3 rounded-md 
                             hover:bg-gray-200 transition">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;