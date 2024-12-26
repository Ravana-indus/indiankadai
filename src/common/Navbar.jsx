// src/components/common/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { items } = useCart();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-black">
            IndianKadai
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-black">Products</Link>
            <Link to="/about" className="text-gray-700 hover:text-black">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-black">Contact</Link>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;