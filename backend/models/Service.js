const mongoose = require('mongoose');

// A single price point for services sold at more than one tier,
// e.g. Waxing: Regular / Chocolate / Rica
const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // "Regular", "Chocolate", "Rica"...
    price: { type: Number, required: true },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },

  // Top-level category — this is what the Services page filter chips use.
  category: {
    type: String,
    enum: ['hair', 'skin', 'nails', 'waxing', 'makeup', 'spa', 'courses', 'other'],
    default: 'other',
  },

  // Finer grouping that mirrors the sections in the physical price list
  // (e.g. "Facials", "D-Tan", "Threadwork", "Hair Cutting", "Hair Color").
  // Free text on purpose so a new price-list section never needs a schema change.
  subcategory: { type: String, trim: true, default: '' },

  duration: { type: Number, default: 30 }, // minutes — used for slot booking
  durationLabel: { type: String, default: '' }, // e.g. "6 Months" for a course

  price: { type: Number, required: true }, // base / "starting from" price
  priceLabel: { type: String, default: '' }, // e.g. "Onward", "per strip", "to ₹5000"

  // For services with more than one price tier (Waxing: Regular/Chocolate/Rica).
  // Leave empty for normal single-price services.
  variants: { type: [variantSchema], default: [] },

  // false for courses / enquiry-only items that shouldn't show "Book Now"
  bookable: { type: Boolean, default: true },

  imageUrl: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Helpful indexes for the filter/sort page
serviceSchema.index({ category: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ name: 1 });

module.exports = mongoose.model('Service', serviceSchema);