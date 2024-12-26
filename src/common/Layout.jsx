// src/components/common/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">IndianKadai</h3>
              <p className="text-gray-600">Your one-stop shop for authentic Indian fashion</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-600 hover:text-black">Home</a></li>
                <li><a href="/products" className="text-gray-600 hover:text-black">Products</a></li>
                <li><a href="/about" className="text-gray-600 hover:text-black">About</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-black">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="/shipping" className="text-gray-600 hover:text-black">Shipping Policy</a></li>
                <li><a href="/returns" className="text-gray-600 hover:text-black">Returns</a></li>
                <li><a href="/faq" className="text-gray-600 hover:text-black">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Email: info@indiankadai.com</li>
                <li>Phone: +94 123 456 789</li>
                <li>Address: Colombo, Sri Lanka</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} IndianKadai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;