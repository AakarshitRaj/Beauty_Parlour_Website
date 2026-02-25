const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['facial', 'hair', 'makeup', 'spa', 'nails', 'other'],
    default: 'other',
  },
  duration: { type: Number, required: true }, // in minutes
  price: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);
