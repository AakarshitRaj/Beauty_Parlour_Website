const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

const verifySignature = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};

const createOrder = async (amount, currency = 'INR', receipt, notes = {}) => {
  const razorpay = getRazorpay();
  return await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency,
    receipt,
    notes,
  });
};

module.exports = { getRazorpay, verifySignature, createOrder };
