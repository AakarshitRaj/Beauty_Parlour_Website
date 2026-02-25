const express = require('express');
const router  = express.Router();
const { submitContact, getAllMessages, updateMessage, deleteMessage } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',       submitContact);                         // public
router.get('/',        protect, adminOnly, getAllMessages);    // admin
router.put('/:id',     protect, adminOnly, updateMessage);    // admin
router.delete('/:id',  protect, adminOnly, deleteMessage);    // admin

module.exports = router;
