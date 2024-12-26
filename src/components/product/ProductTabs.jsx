import React, { useState } from 'react';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { 
      id: 'description', 
      label: 'Description', 
      content: product.web_long_description 
    },
    { 
      id: 'specifications', 
      label: 'Specifications', 
      content: product.specifications 
    },
    { 
      id: 'additional', 
      label: 'Additional Information', 
      content: product.additional_info 
    }
  ];

  return (
    <div className="border-t border-gray-200">
      <nav className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-6">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`prose max-w-none ${
              activeTab === tab.id ? 'block' : 'hidden'
            }`}
          >
            {tab.content ? (
              <div dangerouslySetInnerHTML={{ __html: tab.content }} />
            ) : (
              <p className="text-gray-500 italic">No information available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTabs;