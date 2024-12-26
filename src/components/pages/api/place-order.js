// pages/api/place-order.js

import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import crypto from 'crypto';

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    ERP_API_KEY,
    ERP_API_SECRET,
    PAYHERE_MERCHANT_ID,
    PAYHERE_MERCHANT_SECRET,
    PAYHERE_ENDPOINT,
  } = process.env;

  try {
    const orderData = req.body;
    console.log('[place-order] Received data:', JSON.stringify(orderData, null, 2));

    // 1) Validate order
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No items provided in orderData.',
      });
    }

    // 2) Calculate total amount
    const amount = orderData.items.reduce((total, item) => {
      if (!item.item_code || !item.quantity || !item.price) {
        throw new Error('Each item must have item_code, quantity, and price.');
      }
      return total + item.quantity * item.price;
    }, 0);
    const amountFormatted = parseFloat(amount).toFixed(2);

    // 3) Create Sales Order in ERPNext
    const docData = {
      doctype: 'Sales Order',
      naming_series: 'SO-ICK-.####',
      customer: orderData.customer_name || 'Guest Customer',
      transaction_date: new Date().toISOString().split('T')[0],
      delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: orderData.items.map((item) => ({
        item_code: item.item_code,
        qty: item.quantity,
        rate: item.price,
        doctype: 'Sales Order Item',
      })),
      currency: 'LKR',
      docstatus: 1,
    };

    const soResponse = await fetch('https://indiankadai.com/api/resource/Sales Order', {
      method: 'POST',
      headers: {
        Authorization: `token ${ERP_API_KEY}:${ERP_API_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: docData }),
    });

    const soResult = await soResponse.json();
    if (!soResponse.ok) {
      throw new Error(soResult.message || 'Failed to create sales order in ERPNext');
    }

    const orderId = soResult.data.name;
    console.log('[place-order] Sales Order created:', orderId);

    // 4) Generate MD5 hash for PayHere
    const hash = crypto
      .createHash('md5')
      .update(`${PAYHERE_MERCHANT_ID}${orderId}${amountFormatted}LKR${PAYHERE_MERCHANT_SECRET}`)
      .digest('hex')
      .toUpperCase();

    // 5) Prepare PayHere payment data
    const shippingInfo = orderData.shipping || {};
    const paymentData = {
      merchant_id: PAYHERE_MERCHANT_ID,
      return_url: 'http://127.0.0.1:5500/payment-success.html',  // Adjust as needed
      cancel_url: 'http://127.0.0.1:5500/payment-cancelled.html', // Adjust as needed
      notify_url: 'https://indiankadai.com/api/method/payhere_notify', // For PayHere notifications
      order_id: orderId,
      items: orderData.items[0]?.item_code || 'Item',
      currency: 'LKR',
      amount: amountFormatted,
      first_name: shippingInfo.firstName || 'FirstName',
      last_name: shippingInfo.lastName || 'LastName',
      email: shippingInfo.email || 'test@example.com',
      phone: shippingInfo.phone || '0777123456',
      address: shippingInfo.address || '123 Example Lane',
      city: shippingInfo.city || 'Colombo',
      country: 'Sri Lanka',
      hash,
    };

    return res.status(200).json({
      status: 'success',
      order_id: orderId,
      payment_url: PAYHERE_ENDPOINT,
      payment_data: paymentData,
    });
  } catch (error) {
    console.error('[place-order] Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to process order',
    });
  }
}
