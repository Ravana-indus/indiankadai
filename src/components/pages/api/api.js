// server/routes/api.js or equivalent backend file
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Your ERPNext credentials from environment variables
const ERP_API_KEY = process.env.ERP_API_KEY;
const ERP_API_SECRET = process.env.ERP_API_SECRET;

router.post('/get-item', async (req, res) => {
  try {
    const { item_code } = req.body;

    if (!item_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Item code is required'
      });
    }

    const response = await fetch(
      `https://indiankadai.com/api/method/get_item_info?item_code=${encodeURIComponent(item_code)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${ERP_API_KEY}:${ERP_API_SECRET}`
        }
      }
    );

    const data = await response.json();
    
    res.json({
      status: 'success',
      message: data
    });

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

module.exports = router;