import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../common/LoadingSpinner';

const OrderDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('order_id'); // e.g., /order-success?order_id=SO-ICK-0001

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details on mount
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No order ID provided.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/api/get-order/${orderId}`);
        const data = await res.json();

        if (data.status === 'success') {
          setOrder(data.order); // or data.message, etc. 
        } else {
          throw new Error(data.message || 'Failed to fetch order details');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 underline text-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>No order details to display</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 underline text-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // order is fetched successfully
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Order Successful</h1>
      <p className="text-gray-600 mb-6">Thank you for your order!</p>

      {/* Basic info */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Order ID: {orderId}</h2>
        <p>Placed on: {order.transaction_date}</p> 
        {/* This depends on what your server returns—maybe "transaction_date" or "created_at" */}
      </div>

      {/* Order items */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        {order.items && order.items.length > 0 ? (
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.item_name || item.item_code}</p>
                  <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                </div>
                <p className="font-medium">
                  LKR {Number(item.rate * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No items in this order.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
