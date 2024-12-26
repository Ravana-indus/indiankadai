// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, Minus, Plus } from 'lucide-react';

const HomePage = () => {
  const [itemCode, setItemCode] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCart();

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError(null);
      setAddedToCart(false);
      setQuantity(1);

      // Example: GET request with item_code in query string
      const response = await fetch(`http://localhost:8000/api/get-item?item_code=${itemCode}`);
      const result = await response.json();

      // Check structure
      if (result.status === 'success' && result.message) {
        setData(result.message);
      } else {
        throw new Error('Invalid data structure received from the server.');
      }

    } catch (err) {
      console.error('Error fetching item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (data) {
      addItem({
        item_code: data.item_code,
        item_name: data.item_name,
        price: data.price_info?.price || 0,
        currency: data.price_info?.currency || 'LKR',
        image: `https://indiankadai.com${data.website_image}`,
        quantity: quantity
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const updateQuantity = (value) => {
    setQuantity(Math.max(1, Math.min(10, value)));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Item Search</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            placeholder="Enter item code (e.g., gdin123)"
            aria-label="Enter item code"
            className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={fetchItem}
            disabled={loading || !itemCode}
            aria-label="Search item"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {data && (
        <article className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              {data.website_image ? (
                <img
                  src={`https://indiankadai.com${data.website_image}`}
                  alt={data.item_name}
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="w-full rounded-lg bg-gray-200 animate-pulse h-48"></div>
              )}
            </div>

            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">{data.item_name}</h2>
              <p className="text-gray-600 mb-4">Code: {data.item_code}</p>

              {data.price_info && (
                <div className="mb-4">
                  <p className="text-3xl font-bold">
                    {data.price_info.currency} {data.price_info.price.toLocaleString()}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded text-sm ${
                  data.on_backorder ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {data.on_backorder ? 'On Backorder' : 'In Stock'}
                </span>
              </div>

              {/* Quantity Controls */}
              <div className="mb-4">
                <label htmlFor="quantity" className="text-sm font-medium mb-2 block">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(quantity - 1)}
                    aria-label="Decrease quantity"
                    className="p-2 border rounded hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border rounded p-2"
                  />
                  <button
                    onClick={() => updateQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="p-2 border rounded hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                aria-label="Add to cart"
                className={`w-full flex items-center justify-center gap-2 py-3 rounded transition-colors ${
                  addedToCart ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                <ShoppingCart size={20} />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              {data.short_description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{data.short_description}</p>
                </div>
              )}

              {data.website_specifications && data.website_specifications.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {data.website_specifications.map((spec, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-gray-600">{spec.label}</span>
                        <span 
                          className="font-medium"
                          dangerouslySetInnerHTML={{ 
                            __html: spec.description
                              .replace(/<div class="ql-editor read-mode">/g, '')
                              .replace(/<\/div>/g, '') 
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default HomePage;
