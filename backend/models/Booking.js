const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  guestName: { type: String, trim: true },
  guestPhone: { type: String, trim: true },
  guestEmail: { type: String, trim: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid',
  },
  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  amountDue: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

bookingSchema.pre('save', function (next) {
  this.amountDue = this.totalAmount - this.amountPaid;
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
