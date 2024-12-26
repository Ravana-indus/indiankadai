import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import LoadingSpinner from '../../common/LoadingSpinner';

const PaymentFailurePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get('order_id');
  const errorMessage = searchParams.get('message') || 'Payment processing failed';

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/check-payment-status/${orderId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setOrderDetails(data);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleRetryPayment = async () => {
    if (!orderDetails) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/retry-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order_id: orderId })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Create and submit PayHere form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.payment_url;

        Object.entries(data.payment_data).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error(data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error retrying payment:', error);
      alert('Failed to retry payment. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mb-4">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">
            {errorMessage}
          </p>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left text-gray-600">Order ID:</div>
                <div className="text-right font-medium">{orderId}</div>

                <div className="text-left text-gray-600">Amount:</div>
                <div className="text-right font-medium">
                  {orderDetails.currency} {parseFloat(orderDetails.amount).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {orderDetails && (
              <button
                onClick={handleRetryPayment}
                className="w-full bg-black text-white px-6 py-3 rounded-md 
                         hover:bg-gray-800 transition"
              >
                Retry Payment
              </button>
            )}
            
            <button
              onClick={() => navigate('/checkout')}
              className="w-full border border-gray-300 px-6 py-3 rounded-md 
                       hover:bg-gray-50 transition"
            >
              Back to Checkout
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full text-gray-600 px-6 py-3 rounded-md 
                       hover:text-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>

          {/* Help Information */}
          <div className="mt-6 text-sm text-gray-500 space-y-2">
            <p>If you continue to experience issues, please try:</p>
            <ul className="text-left list-disc pl-4 space-y-1">
              <li>Checking your internet connection</li>
              <li>Verifying your payment details</li>
              <li>Using a different payment method</li>
              <li>Contacting your bank</li>
            </ul>
            <p className="pt-2">
              Need help? <a href="/contact" className="text-black underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;