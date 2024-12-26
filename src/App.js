// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './common/Layout';
import HomePage from './components/pages/HomePage';
import { CartProvider } from './contexts/CartContext';
import Navbar from './common/Navbar'; // <-- Import the Navbar

import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import OrderDetailsPage from './components/pages/OrderDetailsPage';
import CodOrderConfirmedPage from './components/pages/CodOrderConfirmedPage';


function App() {
  return (
    <CartProvider>
      <Router>
        {/* Navbar sits here so it's visible on every route */}
        <Navbar />
        
        {/* Your main routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<div>Thank you!</div>} />
          {/* or a dynamic route e.g. /order-success/:id */}
          <Route path="/order-details/:id" element={<OrderDetailsPage />} />
          {/* Add more routes, e.g. /checkout, etc. */}
          <Route path="/cod-order-confirmed" element={<CodOrderConfirmedPage />} />

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
