import React, { useState } from 'react';

const ProductImage = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
      {isLoading && (
        <div className="animate-pulse bg-gray-200 w-full h-full" />
      )}
      
      {error ? (
        <div className="flex flex-col items-center justify-center p-4 text-gray-400">
          <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Image not available</p>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default ProductImage;