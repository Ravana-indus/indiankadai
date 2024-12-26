import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatters';

const PaymentMethod = ({ formData, onSubmit }) => {
  const [selectedMethod, setSelectedMethod] = useState('payhere');
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, total } = useCart();

  // Load PayHere SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const paymentMethods = [
    {
      id: 'payhere',
      name: 'PayHere',
      description: 'Pay securely with PayHere',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
    }
  ];

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        items: items.map(item => ({
          item_code: item.item_code,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        contact: {
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          firstName: formData.shipping.firstName,
          lastName: formData.shipping.lastName,
          address: formData.shipping.address,
          apartment: formData.shipping.apartment,
          city: formData.shipping.city,
          state: formData.shipping.state,
          zipCode: formData.shipping.zipCode
        },
        paymentMethod: selectedMethod
      };

      if (selectedMethod === 'payhere') {
        const response = await fetch('http://localhost:8000/api/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        const data = await response.json();
        console.log('Server Response:', data);

        if (data.status === 'success' && window.payhere) {
          // Configure payment
          const payment = {
            sandbox: true, // Set to false in production
            merchant_id: data.payment_data.merchant_id,
            return_url: data.payment_data.return_url,
            cancel_url: data.payment_data.cancel_url,
            notify_url: data.payment_data.notify_url,
            first_name: data.payment_data.first_name,
            last_name: data.payment_data.last_name,
            email: data.payment_data.email,
            phone: data.payment_data.phone,
            address: data.payment_data.address,
            city: data.payment_data.city,
            country: data.payment_data.country,
            order_id: data.payment_data.order_id,
            items: data.payment_data.items,
            currency: data.payment_data.currency,
            amount: data.payment_data.amount,
            hash: data.payment_data.hash
          };

          console.log('PayHere Payment Data:', payment);

          // Payment window onSubmit callback
          window.payhere.onSubmit = function(orderId) {
            console.log("PayHere payment started:", orderId);
          };

          // Payment window onDismissed callback
          window.payhere.onDismissed = function(orderId) {
            console.log("PayHere payment dismissed:", orderId);
            setIsProcessing(false);
          };

          // Payment window onError callback
          window.payhere.onError = function(error) {
            console.log("PayHere payment error:", error);
            setIsProcessing(false);
            alert('Payment processing failed. Please try again.');
          };

          // Start payment
          window.payhere.startPayment(payment);
        } else {
          throw new Error(data.message || 'Payment initialization failed');
        }
      } else {
        // Handle COD
        await onSubmit(orderData);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      if (selectedMethod === 'cod') {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition
              ${selectedMethod === method.id 
                ? 'border-black bg-gray-50' 
                : 'border-gray-200 hover:border-gray-300'}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-4 h-4 text-black border-gray-300 focus:ring-black"
            />
            <div>
              <div className="font-medium">{method.name}</div>
              <div className="text-sm text-gray-500">{method.description}</div>
            </div>
          </label>
        ))}

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total to Pay:</span>
            <span>{formatPrice(total, items[0]?.currency)}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className={`w-full bg-black text-white py-3 rounded-md transition
            ${isProcessing 
              ? 'opacity-75 cursor-not-allowed' 
              : 'hover:bg-gray-800'}`}
        >
          {isProcessing ? 'Processing...' : `Pay ${formatPrice(total, items[0]?.currency)}`}
        </button>

        <div className="mt-4 text-sm text-gray-500 space-y-1">
          <p>• All transactions are secure and encrypted</p>
          <p>• We never store your payment details</p>
          {selectedMethod === 'cod' && (
            <p>• Cash on delivery is available for orders under LKR 50,000</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;