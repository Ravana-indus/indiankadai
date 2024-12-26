// src/components/checkout/ContactInfo.jsx
import React from 'react';

const ContactInfo = ({ formData, setFormData, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
      
      <div className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black 
              ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black
                ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            For delivery updates and order notifications
          </p>
        </div>

        {/* Marketing checkbox */}
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="marketing"
              checked={formData.marketing || false}
              onChange={(e) => handleChange({
                target: { name: 'marketing', value: e.target.checked }
              })}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <span className="text-sm text-gray-600">
              Keep me updated about new products, offers and news
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
