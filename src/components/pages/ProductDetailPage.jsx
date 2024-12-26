// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import ProductImage from '../product/ProductImage';
import ProductTabs from '../product/ProductTabs';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CartModal from '../cart/CartModal';
import { formatPrice } from '../../utils/formatters';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams(); // e.g. /order-success/:id
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/get-order/${id}`);
        const data = await response.json();

        if (data.status === 'success') {
          setOrder(data.order);
        } else {
          throw new Error(data.message || 'Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-black underline"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Order #{order.order_id}
            </h1>
            <p className="text-gray-600">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Show an icon based on order.status if you like */}
            <span className="font-medium capitalize">
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.item_code} className="py-4 flex gap-4">
                  <img
                    src={item.image}
                    alt={item.item_name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.item_name}</h3>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                    <p>{formatPrice(item.price, item.currency)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              <p>{order.shipping.firstName} {order.shipping.lastName}</p>
              <p>{order.shipping.address}</p>
              {order.shipping.apartment && <p>{order.shipping.apartment}</p>}
              <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.total, order.currency)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(order.total, order.currency)}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-2">Payment Information</h3>
              <p className="text-gray-600">
                Paid via {order.paymentMethod}
              </p>
              {order.payment_id && (
                <p className="text-gray-600">
                  Payment ID: {order.payment_id}
                </p>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t text-sm text-gray-500">
              <p className="mb-2">Need help with your order?</p>
              <button
                onClick={() => navigate('/contact')}
                className="text-black underline"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;