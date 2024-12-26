import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../common/LoadingSpinner';

const CodOrderConfirmedPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('order_id'); // e.g. /cod-order-confirmed?order_id=SO-0001

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID specified.');
        setLoading(false);
        return;
      }

      try {
        // Suppose your server route is GET /api/get-order/:id
        const res = await fetch(`http://localhost:8000/api/get-order/${orderId}`);
        const data = await res.json();

        if (data.status === 'success') {
          setOrder(data.order);  // or data.data if you return raw ERPNext doc in "data"
        } else {
          throw new Error(data.message || 'Failed to fetch order details');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error}</p>
        <button onClick={() => navigate('/')} className="underline mt-4">
          Return to Home
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4">
        <p>No order details found.</p>
        <button onClick={() => navigate('/')} className="underline mt-4">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">COD Order Confirmed</h1>
      <p className="text-gray-600 mb-6">Thank you for your order!</p>

      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Order ID: {orderId}</h2>
        <p>Placed on: {order.transaction_date}</p>
        {/* etc. depends on your server's data shape */}
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        {order.items && order.items.length > 0 ? (
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.item_code}</p>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                </div>
                <p>LKR {Number(item.rate * item.qty).toLocaleString()}</p>
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

export default CodOrderConfirmedPage;
