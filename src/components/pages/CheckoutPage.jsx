import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import ContactInfo from '../checkout/ContactInfo';
import ShippingInfo from '../checkout/ShippingInfo';
import PaymentMethod from '../checkout/PaymentMethod';
import CartSummary from '../cart/CartSummary';
import LoadingSpinner from '../../common/LoadingSpinner';

<script type="text/javascript" src="https://www.payhere.lk/lib/payhere.js"></script>

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // Cart context
  const { items, total, clearCart } = useCart();

  // Loading state for placing orders
  const [isLoading, setIsLoading] = useState(false);

  // Form data for ContactInfo & ShippingInfo
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    marketing: false,
    shipping: {
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      saveAddress: false
    }
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // If cart is empty, go back to cart
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Validate basic required fields
  const validateForm = () => {
    const newErrors = {};

    // Contact info
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    // Shipping info
    if (!formData.shipping.firstName) newErrors.firstName = 'First name is required';
    if (!formData.shipping.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.shipping.address) newErrors.address = 'Address is required';
    if (!formData.shipping.city) newErrors.city = 'City is required';
    if (!formData.shipping.state) newErrors.state = 'State is required';
    if (!formData.shipping.zipCode) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * handleOrderSubmit is called from <PaymentMethod> for either COD or PayHere.
   * - `orderData` includes items, shipping, contact info, etc.
   * - `selectedMethod` is either 'payhere' or 'cod'
   */
  const handleOrderSubmit = async (orderData, selectedMethod) => {
    // Validate the form before sending to server
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    try {
      // Decide which endpoint based on payment method
      const endpoint =
        selectedMethod === 'cod'
          ? 'http://localhost:8000/api/place-order-cod'
          : 'http://localhost:8000/api/place-order';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      // If the server returns { status: 'success', order_id: '...' }, handle success
      // Or if you're returning raw ERPNext data, adjust accordingly
      if (data.status === 'success' || data.data?.name) {
        console.log('Order success. Response data:', data);
      
        clearCart();
      
        const orderId = data.order_id || data.data?.name || 'COD';
        console.log('Navigating to /cod-order-confirmed with order_id:', orderId);
      
        navigate(`/cod-order-confirmed?order_id=${orderId}`);
      } else {
        // ...
      }
      
      
    } catch (error) {
      console.error('Error placing order:', error);
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Submit-level error */}
      {errors.submit && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {errors.submit}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Contact + Shipping + Payment */}
        <div className="flex-1 space-y-6">
          {/* 1. Contact Info */}
          <ContactInfo
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />

          {/* 2. Shipping Info */}
          <ShippingInfo
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />

          {/* 3. Payment Method 
              Pass handleOrderSubmit with the 'selectedMethod' param 
          */}
          <PaymentMethod
            formData={formData}
            onSubmit={(orderData, selectedMethod) =>
              handleOrderSubmit(orderData, selectedMethod)
            }
          />
        </div>

        {/* RIGHT: Cart Summary */}
        <div className="lg:w-96">
          <div className="sticky top-4">
            <CartSummary />
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              <h3 className="font-medium mb-2">Secure Checkout</h3>
              <ul className="space-y-1">
                <li>• 256-bit SSL encryption</li>
                <li>• Secure payment processing</li>
                <li>• Data privacy protection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
