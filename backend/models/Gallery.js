const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, trim: true },
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String },
  category: { type: String, enum: ['facial', 'hair', 'makeup', 'spa', 'nails', 'other'], default: 'other' },
  isPromotion: { type: Boolean, default: false },
  promotionText: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gallery', gallerySchema);
