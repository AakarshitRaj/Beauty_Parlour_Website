const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  paymentMethod:  { type: String, enum: ['razorpay', 'upi', 'cash'], default: 'upi' },
  amount:         { type: Number, required: true },
  currency:       { type: String, default: 'INR' },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'captured', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionRef: { type: String },   // our internal ref / Razorpay order ID
  utrNumber:      { type: String },   // UPI UTR or Razorpay payment ID
  createdAt:      { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
