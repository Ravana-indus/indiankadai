// src/utils/formatters.js

export const formatPrice = (amount, currency = 'INR') => {
    if (!amount && amount !== 0) return '';
    
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch (error) {
      return `${currency} ${parseFloat(amount).toLocaleString()}`;
    }
  };
  
  export const formatDate = (date) => {
    if (!date) return '';
    
    try {
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date));
    } catch (error) {
      return date;
    }
  };
  
  export const formatOrderId = (orderId) => {
    if (!orderId) return '';
    return `#${orderId.toString().padStart(6, '0')}`;
  };
  
  export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
  };
  
  export const formatAddress = (address) => {
    if (!address) return '';
    
    const {
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      zipCode
    } = address;
  
    const parts = [
      `${firstName} ${lastName}`,
      address1,
      address2,
      `${city}, ${state} ${zipCode}`
    ].filter(Boolean);
  
    return parts.join('\n');
  };
  
  export const formatQuantity = (quantity, unit = '') => {
    if (!quantity && quantity !== 0) return '';
    return `${quantity}${unit ? ` ${unit}` : ''}`;
  };
  
  export const formatPercentage = (value) => {
    if (!value && value !== 0) return '';
    return `${(value * 100).toFixed(2)}%`;
  };