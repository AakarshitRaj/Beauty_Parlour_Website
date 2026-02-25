const express = require('express');
const router  = express.Router();
const { createOrder, verifyPayment, confirmPayment, getMyPayments, getAllPayments } = require('../controllers/paymentController');
const { protect, adminOnly, optionalAuth } = require('../middleware/authMiddleware');

router.post('/create-order', optionalAuth, createOrder);
router.post('/verify',       optionalAuth, verifyPayment);
router.put('/:id/confirm',   protect, adminOnly, confirmPayment);
router.get('/my',            protect, getMyPayments);
router.get('/admin',         protect, adminOnly, getAllPayments);

module.exports = router;
