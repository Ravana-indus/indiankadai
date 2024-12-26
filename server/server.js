/**********************************************************************
 * server/server.js 
 * ------------------------------------------------------------
 * 1) GET/POST /api/get-item  => fetch item from ERPNext
 * 2) POST /api/place-order   => Sales Order + PayHere Payment
 * 3) POST /api/place-order-cod => Sales Order for COD
 * 4) GET /api/get-order/:orderId => fetch Sales Order details
 **********************************************************************/

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

// --------------------------------------------------------------------
// 1) MIDDLEWARE
// --------------------------------------------------------------------
app.use(cors());
app.use(express.json());

// --------------------------------------------------------------------
// 2) ERPNext & PayHere Credentials
// --------------------------------------------------------------------
const API_KEY = '0d97d16e486267e';           // ERPNext API Key
const API_SECRET = 'f6daf2d5b01b19b';        // ERPNext API Secret

// PayHere
const PAYHERE_MERCHANT_ID = '1224574';        // Your PayHere merchant_id
const PAYHERE_MERCHANT_SECRET = 'MjAxMjgzODYyMzI4MTUwOTAwMDU1MDYwNjQzMjUzNTEzNjczNTc='; // Replace with your actual secret
const PAYHERE_ENDPOINT = 'https://sandbox.payhere.lk/pay/checkout';

// Debug logger
function debugLog(title, data) {
  console.log('\n-------------------');
  console.log(title);
  console.log('-------------------');
  console.log(JSON.stringify(data, null, 2));
}

// --------------------------------------------------------------------
// 3) handleGetItem => fetch item from ERPNext (unchanged logic)
// --------------------------------------------------------------------
const handleGetItem = async (item_code, res) => {
  if (!item_code) {
    return res.status(400).json({
      status: 'error',
      message: 'Item code is required'
    });
  }

  try {
    debugLog('Making request to ERPNext', { item_code });

    const response = await fetch('https://indiankadai.com/api/method/get_item_info', {
      method: 'POST',
      headers: {
        Authorization: `token ${API_KEY}:${API_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item_code })
    });

    debugLog('ERPNext Response Status', { status: response.status });

    const responseText = await response.text();
    debugLog('Raw ERPNext Response', { responseText });

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      debugLog('JSON Parse Error', { error: e.message });
      throw new Error('Invalid response from ERPNext');
    }

    debugLog('Parsed Response Data', data);
    return res.json(data);

  } catch (error) {
    console.error('Error fetching item:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

// --------------------------------------------------------------------
// 4) GET /api/get-item?item_code=XYZ
// --------------------------------------------------------------------
app.get('/api/get-item', async (req, res) => {
  debugLog('GET Request Query', req.query);
  await handleGetItem(req.query.item_code, res);
});

// --------------------------------------------------------------------
// 5) POST /api/get-item
// --------------------------------------------------------------------
app.post('/api/get-item', async (req, res) => {
  debugLog('POST Request Body', req.body);
  await handleGetItem(req.body.item_code, res);
});

// --------------------------------------------------------------------
// 6) POST /api/place-order => Create Sales Order & prepare PayHere
// --------------------------------------------------------------------
app.post('/api/place-order', async (req, res) => {
  try {
    debugLog('place-order => Received Order Data', req.body);

    // Destructure request data
    const { items, customer_name, email, phone, shipping } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No items provided in order data'
      });
    }

    // 1) Create Sales Order in ERPNext
    const docData = {
      doctype: 'Sales Order',
      naming_series: 'SO-ICK-.####',
      customer: customer_name || 'Pathurjan Buyer',
      transaction_date: new Date().toISOString().split('T')[0],
      delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      items: items.map(itm => ({
        item_code: itm.item_code,
        qty: itm.quantity,
        rate: itm.price,
        doctype: 'Sales Order Item'
      })),
      currency: 'LKR',
      docstatus: 1
    };

    debugLog('Creating Sales Order docData', docData);

    const soResponse = await fetch('https://indiankadai.com/api/resource/Sales Order', {
      method: 'POST',
      headers: {
        Authorization: `token ${API_KEY}:${API_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: docData })
    });

    const soResultText = await soResponse.text();
    debugLog('ERPNext SO Response (raw)', { soResultText });

    let soResult;
    try {
      soResult = JSON.parse(soResultText);
    } catch (e) {
      throw new Error('Invalid JSON from ERPNext when creating Sales Order');
    }

    if (!soResponse.ok) {
      throw new Error(soResult.message || 'Failed to create sales order in ERPNext');
    }

    debugLog('Sales Order created successfully', soResult);

    const orderId = soResult.data.name; // e.g. "SO-ICK-0001"

    // 2) Calculate total amount
    const amount = items.reduce((sum, itm) => sum + itm.price * itm.quantity, 0);
    const amountFormatted = parseFloat(amount).toFixed(2);

    // 3) Generate PayHere MD5 hash
    //    formula: md5( merchant_id + orderId + amount + "LKR" + merchant_secret )
    const hash = crypto
      .createHash('md5')
      .update(`${PAYHERE_MERCHANT_ID}${orderId}${amountFormatted}LKR${PAYHERE_MERCHANT_SECRET}`)
      .digest('hex')
      .toUpperCase();

    // 4) Build payment data
    const payData = {
      merchant_id: PAYHERE_MERCHANT_ID,
      return_url: 'http://indainkadai.com/', // adjust as needed
      cancel_url: 'http://indainkadai.com/', // adjust as needed
      notify_url: 'http://indiankadai.com/api/payhere-notify', // adjust for your notify endpoint
      order_id: orderId,
      items: items[0]?.item_code || 'Items',
      currency: 'LKR',
      amount: amountFormatted,
      first_name: shipping?.firstName || 'FirstName',
      last_name: shipping?.lastName || 'LastName',
      email: email || shipping?.email || 'test@example.com',
      phone: phone || shipping?.phone || '0777123456',
      address: shipping?.address || 'No. 123, Street',
      city: shipping?.city || 'Colombo',
      country: 'Sri Lanka',
      hash
    };

    // 5) Return success + payment data to client
    return res.json({
      status: 'success',
      order_id: orderId,
      payment_url: PAYHERE_ENDPOINT,
      payment_data: payData
    });

  } catch (error) {
    console.error('Error placing order (PayHere):', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to place order'
    });
  }
});

// --------------------------------------------------------------------
// 7) POST /api/place-order-cod => For Cash on Delivery
// --------------------------------------------------------------------
app.post('/api/place-order-cod', async (req, res) => {
  try {
    debugLog('place-order-cod => Received Order Data', req.body);

    const { items, customer_name } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No items provided in order data'
      });
    }

    // We'll create a Sales Order with a "cod" field to indicate COD
    const docData = {
      doctype: 'Sales Order',
      naming_series: 'SO-ICK-.####', 
      customer: customer_name || 'Pathurjan Buyer',
      transaction_date: new Date().toISOString().split('T')[0],
      delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      items: items.map(itm => ({
        item_code: itm.item_code,
        qty: itm.quantity,
        rate: itm.price,
        doctype: 'Sales Order Item'
      })),
      currency: 'LKR',
      docstatus: 1,
      cod: 1, // custom field if you have one in ERPNext
    };

    debugLog('Creating Sales Order docData (COD)', docData);

    const soResponse = await fetch('https://indiankadai.com/api/resource/Sales Order', {
      method: 'POST',
      headers: {
        Authorization: `token ${API_KEY}:${API_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: docData })
    });

    const soResultText = await soResponse.text();
    debugLog('ERPNext SO (COD) Response (raw)', { soResultText });

    let soResult;
    try {
      soResult = JSON.parse(soResultText);
    } catch (e) {
      throw new Error('Invalid JSON from ERPNext when creating Sales Order (COD)');
    }

    if (!soResponse.ok) {
      throw new Error(soResult.message || 'Failed to create COD sales order in ERPNext');
    }

    debugLog('COD Sales Order created successfully', soResult);

    // Optionally return a simpler success shape with an 'order_id'
    return res.json({
      status: 'success',
      order_id: soResult.data.name
    });

  } catch (error) {
    console.error('Error placing COD order:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to place COD order'
    });
  }
});

// --------------------------------------------------------------------
// 8) GET /api/get-order/:orderId => fetch existing Sales Order
// --------------------------------------------------------------------
app.get('/api/get-order/:orderId', async (req, res) => {
  const orderId = req.params.orderId; // e.g. "SO-ICK-00001"

  try {
    // e.g. https://indiankadai.com/api/resource/Sales Order/SO-ICK-00001
    const response = await fetch(`https://indiankadai.com/api/resource/Sales Order/${orderId}`, {
      headers: {
        Authorization: `token ${API_KEY}:${API_SECRET}`
      }
    });

    const rawText = await response.text();
    const data = JSON.parse(rawText);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order');
    }

    // data.data is the actual doc from ERPNext
    return res.json({
      status: 'success',
      order: data.data
    });

  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// --------------------------------------------------------------------
// 9) Test endpoint
// --------------------------------------------------------------------
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// --------------------------------------------------------------------
// 10) Start server
// --------------------------------------------------------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test: http://localhost:${PORT}/api/test`);
});
