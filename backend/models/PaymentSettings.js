const mongoose = require('mongoose');

const paymentSettingsSchema = new mongoose.Schema({
  methods: {
    razorpay: {
      enabled:   { type: Boolean, default: false },
      keyId:     { type: String, default: '' },
      keySecret: { type: String, default: '' },
      label:     { type: String, default: 'Pay Online (Card / UPI via Razorpay)' },
    },
    upi: {
      enabled:  { type: Boolean, default: true },
      upiId:    { type: String, default: '' },
      upiName:  { type: String, default: 'Glow & Glam' },
      label:    { type: String, default: 'UPI (GPay / PhonePe / Paytm)' },
    },
    cash: {
      enabled: { type: Boolean, default: true },
      label:   { type: String, default: 'Pay at Salon (Cash / Card on Arrival)' },
      note:    { type: String, default: 'Full payment collected at the time of your appointment.' },
    },
  },
  advancePercent: { type: Number, default: 30 }, // % for partial advance
  updatedAt: { type: Date, default: Date.now },
});

// Singleton — always one document
paymentSettingsSchema.statics.getSettings = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('PaymentSettings', paymentSettingsSchema);
