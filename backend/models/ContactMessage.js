const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  phone:     { type: String, trim: true, default: '' },
  message:   { type: String, required: true },
  status:    { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  adminNote: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
