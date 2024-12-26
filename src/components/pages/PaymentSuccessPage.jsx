import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import LoadingSpinner from '../../common/LoadingSpinner';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/check-payment-status/${orderId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setOrderDetails(data);
        } else {
          throw new Error('Failed to fetch order details');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-left text-gray-600">Order ID:</div>
              <div className="text-right font-medium">{orderId}</div>

              {orderDetails && (
                <>
                  <div className="text-left text-gray-600">Amount Paid:</div>
                  <div className="text-right font-medium">
                    {orderDetails.currency} {parseFloat(orderDetails.amount).toLocaleString()}
                  </div>

                  <div className="text-left text-gray-600">Status:</div>
                  <div className="text-right font-medium text-green-600">
                    Completed
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-black text-white px-6 py-3 rounded-md 
                       hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
            
            <button
              onClick={() => navigate(`/orders/${orderId}`)}
              className="w-full border border-gray-300 px-6 py-3 rounded-md 
                       hover:bg-gray-50 transition"
            >
              View Order Details
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-6 text-sm text-gray-500">
            <p>A confirmation email has been sent to your registered email address.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;