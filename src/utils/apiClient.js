// src/utils/apiClient.js

const API_BASE_URL = 'http://localhost:8000/api';

export const apiClient = {
  getItem: async (itemCode) => {
    try {
      console.log('Fetching item:', itemCode);
      
      const response = await fetch(`${API_BASE_URL}/get-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_code: itemCode })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch item');
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;

    } catch (error) {
      console.error('API Error:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to fetch item'
      };
    }
  }
};