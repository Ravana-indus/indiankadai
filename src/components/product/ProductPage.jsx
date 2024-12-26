import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import ProductImage from './ProductImage';
import ProductTabs from './ProductTabs';
import CartModal from '../cart/CartModal';
import LoadingSpinner from '../../common/LoadingSpinner';

const ProductPage = () => {
  const { code } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('http://localhost:3000/get-item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item_code: code })
        });

        const data = await response.json();
        if (data.status === 'success' && data.message) {
          setProduct(data.message);
        } else {
          throw new Error(data.message || 'Failed to fetch product');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [code]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      item_code: product.item_code,
      item_name: product.item_name,
      price: product.price_info.price,
      currency: product.price_info.currency,
      image: product.website_image,
    });
    setShowCart(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!product) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row p-6 gap-8">
          <div className="w-full md:w-1/2">
            <ProductImage 
              src={`http://127.0.0.1:5500${product.website_image}`}
              alt={product.item_name}
            />
          </div>

          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-bold mb-2">{product.item_name}</h1>
            <p className="text-gray-600 mb-4">Product Code: {product.item_code}</p>

            <div className="mb-4">
              <div className={`text-sm mb-2 ${
                product.on_backorder ? 'text-orange-600' : 'text-green-600'
              }`}>
                {product.on_backorder ? 'On Backorder' : 'In Stock'}
              </div>

              {product.price_info && (
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold">
                    {product.price_info.currency} {product.price_info.price.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <p className="text-gray-700">{product.short_description}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <ProductTabs product={product} />
      </div>

      <CartModal 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
      />
    </div>
  );
};

export default ProductPage;