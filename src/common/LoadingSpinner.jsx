import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  // Size variants
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Base spinner component
  const Spinner = () => (
    <div className={`${sizes[size]} relative`}>
      <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
      <div className="absolute inset-0 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
    </div>
  );

  // If fullScreen is true, center in viewport
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <Spinner />
      </div>
    );
  }

  // Default centered in parent container
  return (
    <div className="flex items-center justify-center p-4">
      <Spinner />
    </div>
  );
};

// Optional overlay version for use in modals or specific containers
export const LoadingOverlay = ({ isLoading, children }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    </div>
  );
};

export default LoadingSpinner;