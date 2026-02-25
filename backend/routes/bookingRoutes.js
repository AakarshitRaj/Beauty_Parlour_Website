const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, getBooking, cancelBooking,
  getAllBookings, updateBookingStatus
} = require('../controllers/bookingController');
const { protect, adminOnly, optionalAuth } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/admin', protect, adminOnly, getAllBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;
