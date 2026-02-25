const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  heroTitle: { type: String, default: 'Where Beauty Meets Luxury' },
  heroSubtitle: { type: String, default: 'Experience premium beauty treatments curated for the modern woman' },
  heroImage: { type: String, default: '' },
  aboutTitle: { type: String, default: 'About Glow & Glam' },
  aboutText: { type: String, default: 'We are a premium beauty parlour dedicated to making every woman feel her best.' },
  aboutImage: { type: String, default: '' },
  promotions: [{
    title: String,
    description: String,
    imageUrl: String,
    discount: Number,
    validTill: Date,
  }],
  testimonials: [{
    name: String,
    review: String,
    rating: Number,
    avatar: String,
  }],
  contactEmail: { type: String, default: 'hello@glowglam.com' },
  contactPhone: { type: String, default: '+91 98765 43210' },
  address: { type: String, default: '123 Beauty Lane, Mumbai, Maharashtra 400001' },
  socialLinks: {
    instagram: String,
    facebook: String,
    twitter: String,
    youtube: String,
  },
});

module.exports = mongoose.model('SiteContent', siteContentSchema);
