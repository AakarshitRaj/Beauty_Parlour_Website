const crypto          = require('crypto');
const Payment         = require('../models/Payment');
const Booking         = require('../models/Booking');
const PaymentSettings = require('../models/PaymentSettings');

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
const getRazorpay = (keyId, keySecret) => {
  const Razorpay = require('razorpay');
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

const calcPayable = (total, paymentType, advancePercent) =>
  paymentType === 'full' ? total : Math.ceil(total * advancePercent / 100);

// ─────────────────────────────────────────
// POST /api/payments/create-order
// Handles razorpay, upi, and cash bookings
// ─────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const { bookingId, paymentType, method } = req.body;
    // method = 'razorpay' | 'upi' | 'cash'

    const booking  = await Booking.findById(bookingId).populate('serviceId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const settings = await PaymentSettings.getSettings();
    const { methods, advancePercent } = settings;

    // Validate method is enabled
    if (!methods[method]?.enabled) {
      return res.status(400).json({ message: `Payment method "${method}" is currently not available.` });
    }

    const payableAmount = calcPayable(booking.totalAmount, paymentType, advancePercent);

    // ── RAZORPAY ──────────────────────────────
    if (method === 'razorpay') {
      const { keyId, keySecret } = methods.razorpay;
      if (!keyId || !keySecret) {
        return res.status(500).json({ message: 'Razorpay is not configured. Please contact admin.' });
      }
      const razorpay = getRazorpay(keyId, keySecret);
      const transactionRef = `GG${bookingId.toString().slice(-6).toUpperCase()}${Date.now().toString().slice(-4)}`;

      const order = await razorpay.orders.create({
        amount:   payableAmount * 100,
        currency: 'INR',
        receipt:  transactionRef,
        notes:    { bookingId: bookingId.toString() },
      });

      const payment = await Payment.create({
        bookingId, userId: req.user?._id || null,
        paymentMethod: 'razorpay', amount: payableAmount,
        status: 'pending', transactionRef: order.id,
      });

      return res.json({
        method: 'razorpay',
        paymentId: payment._id,
        orderId:   order.id,
        amount:    order.amount,
        currency:  order.currency,
        keyId,
      });
    }

    // ── UPI ───────────────────────────────────
    if (method === 'upi') {
      const { upiId, upiName } = methods.upi;
      if (!upiId) {
        return res.status(500).json({ message: 'UPI is not configured. Please contact admin.' });
      }
      const transactionRef = `GG${bookingId.toString().slice(-6).toUpperCase()}${Date.now().toString().slice(-4)}`;
      const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${payableAmount}&cu=INR&tn=${encodeURIComponent('Glow & Glam Booking')}&tr=${transactionRef}`;
      const qrUrl   = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(upiLink)}&choe=UTF-8`;

      const payment = await Payment.create({
        bookingId, userId: req.user?._id || null,
        paymentMethod: 'upi', amount: payableAmount,
        status: 'pending', transactionRef,
      });

      return res.json({
        method: 'upi',
        paymentId: payment._id,
        upiId, upiName, upiLink, qrUrl,
        amount: payableAmount, transactionRef,
      });
    }

    // ── CASH ──────────────────────────────────
    if (method === 'cash') {
      const payment = await Payment.create({
        bookingId, userId: req.user?._id || null,
        paymentMethod: 'cash', amount: 0,
        status: 'pending',
        transactionRef: `CASH-${bookingId.toString().slice(-6).toUpperCase()}`,
      });

      // Mark booking as pending (cash — confirmed by admin later)
      booking.paymentStatus = 'unpaid';
      booking.status        = 'pending';
      await booking.save();

      return res.json({
        method: 'cash',
        paymentId: payment._id,
        message: methods.cash.note || 'Payment will be collected at the salon.',
      });
    }

    res.status(400).json({ message: 'Invalid payment method' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────
// POST /api/payments/verify
// ─────────────────────────────────────────
const verifyPayment = async (req, res) => {
  try {
    const { paymentId, bookingId, method } = req.body;

    // ── Razorpay signature verification ──
    if (method === 'razorpay') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const settings  = await PaymentSettings.getSettings();
      const keySecret = settings.methods.razorpay.keySecret;

      const expected = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expected !== razorpay_signature) {
        return res.status(400).json({ message: 'Razorpay payment verification failed' });
      }

      const payment = await Payment.findById(paymentId);
      if (!payment) return res.status(404).json({ message: 'Payment not found' });

      payment.status       = 'captured';
      payment.utrNumber    = razorpay_payment_id;
      await payment.save();

      const booking = await Booking.findById(bookingId || payment.bookingId);
      if (booking) {
        booking.amountPaid    += payment.amount;
        booking.amountDue      = booking.totalAmount - booking.amountPaid;
        booking.paymentStatus  = booking.amountPaid >= booking.totalAmount ? 'paid' : 'partial';
        booking.status         = 'confirmed';
        await booking.save();
      }

      return res.json({ message: 'Payment verified!', payment, booking });
    }

    // ── UPI — user submits UTR ──
    if (method === 'upi') {
      const { utrNumber } = req.body;
      if (!utrNumber?.trim()) {
        return res.status(400).json({ message: 'Please enter your UPI Transaction ID (UTR)' });
      }

      const payment = await Payment.findById(paymentId);
      if (!payment) return res.status(404).json({ message: 'Payment not found' });

      payment.utrNumber = utrNumber.trim();
      payment.status    = 'submitted';
      await payment.save();

      const booking = await Booking.findById(bookingId || payment.bookingId);
      if (booking) {
        booking.amountPaid    = payment.amount;
        booking.amountDue     = booking.totalAmount - payment.amount;
        booking.paymentStatus = payment.amount >= booking.totalAmount ? 'paid' : 'partial';
        booking.status        = 'pending'; // admin confirms
        await booking.save();
      }

      return res.json({
        message: 'Payment submitted! Booking confirmed after team verifies.',
        payment, booking,
      });
    }

    // ── Cash — just confirm booking ──
    if (method === 'cash') {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.status = 'confirmed';
        await booking.save();
      }
      return res.json({ message: 'Cash booking confirmed.', booking });
    }

    res.status(400).json({ message: 'Invalid method' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin confirms a payment
const confirmPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    payment.status = 'captured';
    await payment.save();
    const booking = await Booking.findById(payment.bookingId);
    if (booking) { booking.status = 'confirmed'; await booking.save(); }
    res.json({ message: 'Payment confirmed', payment, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).populate('bookingId').sort({ createdAt: -1 });
    res.json({ payments });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('bookingId').populate('userId', 'name phone').sort({ createdAt: -1 });
    res.json({ payments });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { createOrder, verifyPayment, confirmPayment, getMyPayments, getAllPayments };
