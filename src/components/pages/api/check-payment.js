// pages/api/check-payment.js

let paymentStatuses = new Map();

export function updatePaymentStatus(orderId, status, details = {}) {
  paymentStatuses.set(orderId, {
    status,
    timestamp: new Date().toISOString(),
    ...details,
  });
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // GET /api/check-payment?orderId=xxx
  const { orderId } = req.query;
  if (!orderId) {
    return res.status(400).json({ message: 'Missing orderId' });
  }

  const status = paymentStatuses.get(orderId) || { status: 'pending' };
  return res.status(200).json(status);
}
