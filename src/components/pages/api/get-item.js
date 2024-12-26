// pages/api/get-item.js

import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  console.log('[GET-ITEM] Incoming request method:', req.method);
  console.log('[GET-ITEM] Query params:', req.query);

  // Check if we ever see these logs in the server console
  if (req.method !== 'GET') {
    console.log('[GET-ITEM] Method not allowed');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { ERP_API_KEY, ERP_API_SECRET } = process.env;
  const { item_code } = req.query;

  if (!item_code) {
    console.log('[GET-ITEM] Missing item_code');
    return res.status(400).json({
      status: 'error',
      message: 'Query parameter "item_code" is required',
    });
  }

  try {
    console.log('[GET-ITEM] Making request to ERPNext with item_code:', item_code);

    const url = `https://indiankadai.com/api/method/get_item_info?item_code=${encodeURIComponent(item_code)}`;
    console.log('[GET-ITEM] Full URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      
    });

    console.log('[GET-ITEM] ERPNext response status:', response.status);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`[GET-ITEM] ERPNext request failed: ${errText}`);
    }

    const data = await response.json();
    console.log('[GET-ITEM] ERPNext data:', data);

    // Final return to client
    return res.status(200).json(data);
  } catch (error) {
    console.error('[GET-ITEM] Caught error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error while fetching item',
    });
  }
}
