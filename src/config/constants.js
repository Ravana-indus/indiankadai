// src/config/constants.js

// API URLs
export const API_CONFIG = {
    BASE_URL: 'https://indiankadai.com/api/method',
    PAYHERE_BASE_URL: 'https://sandbox.payhere.lk/pay/checkout',  // Change to live URL in production
  };
  
  // Local Storage Keys
  export const STORAGE_KEYS = {
    CART: 'cart',
    USER_SETTINGS: 'userSettings',
    AUTH_TOKEN: 'authToken',
  };
  
  // PayHere Configuration
  export const PAYHERE_CONFIG = {
    MERCHANT_ID: process.env.REACT_APP_PAYHERE_MERCHANT_ID || '1211149',
    MERCHANT_SECRET: process.env.REACT_APP_PAYHERE_MERCHANT_SECRET,
    CURRENCY: 'LKR',
    RETURN_URL: `${window.location.origin}/payment-success`,
    CANCEL_URL: `${window.location.origin}/payment-failure`,
    NOTIFY_URL: `${API_CONFIG.BASE_URL}/payhere-notify`,
  };
  
  // Order Status
  export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
  };
  
  // Payment Status
  export const PAYMENT_STATUS = {
    PENDING: 'pending',
    SUCCESS: '2',  // PayHere success status code
    FAILED: '0',   // PayHere failed status code
    CANCELLED: '-1', // PayHere cancelled status code
  };
  
  // Validation Rules
  export const VALIDATION = {
    PHONE: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 15,
      PATTERN: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
    },
    ZIP_CODE: {
      MIN_LENGTH: 5,
      MAX_LENGTH: 10,
    },
    PASSWORD: {
      MIN_LENGTH: 8,
      PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    },
  };
  
  // Error Messages
  export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    INVALID_ZIP: 'Please enter a valid ZIP code',
    PASSWORD_REQUIREMENTS: 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one number',
    GENERAL_ERROR: 'Something went wrong. Please try again.',
  };
  
  // Route Paths
  export const ROUTES = {
    HOME: '/',
    PRODUCT: '/product/:code',
    CART: '/cart',
    CHECKOUT: '/checkout',
    PAYMENT_SUCCESS: '/payment-success',
    PAYMENT_FAILURE: '/payment-failure',
    ORDER_DETAILS: '/order/:id',
  };