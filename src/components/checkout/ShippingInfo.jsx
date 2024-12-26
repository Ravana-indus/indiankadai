// src/components/checkout/ShippingInfo.jsx
import React from 'react';

const ShippingInfo = ({ formData, setFormData, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        [name]: value
      }
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
      
      <div className="space-y-4">
        {/* First/Last Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.shipping?.firstName || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black
                ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.shipping?.lastName || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black
                ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Address line 1 */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.shipping?.address || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black
              ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        {/* Optional apartment */}
        <div>
          <label htmlFor="apartment" className="block text-sm font-medium mb-1">
            Apartment, suite, etc. (optional)
          </label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            value={formData.shipping?.apartment || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* City, State, Zip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.shipping?.city || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black
                ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.shipping?.state || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black
                ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-500">{errors.state}</p>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.shipping?.zipCode || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black
                ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
            )}
          </div>
        </div>

        {/* Save address checkbox */}
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="saveAddress"
              checked={formData.shipping?.saveAddress || false}
              onChange={(e) => handleChange({
                target: { name: 'saveAddress', value: e.target.checked }
              })}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <span className="text-sm text-gray-600">
              Save this address for future orders
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
