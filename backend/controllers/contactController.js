const ContactMessage = require('../models/ContactMessage');

// @desc  Submit contact form (public)
// @route POST /api/contact
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const contact = await ContactMessage.create({ name, email, phone, message });
    res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.', contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all messages (admin)
// @route GET /api/contact
const getAllMessages = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    const unreadCount = await ContactMessage.countDocuments({ status: 'unread' });
    res.json({ messages, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update message status / add admin note (admin)
// @route PUT /api/contact/:id
const updateMessage = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });

    if (status)    msg.status    = status;
    if (adminNote !== undefined) msg.adminNote = adminNote;
    await msg.save();

    res.json({ message: 'Updated', contact: msg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete message (admin)
// @route DELETE /api/contact/:id
const deleteMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    await msg.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitContact, getAllMessages, updateMessage, deleteMessage };
