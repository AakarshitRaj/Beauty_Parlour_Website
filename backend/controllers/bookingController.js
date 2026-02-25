const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Payment = require('../models/Payment');

// @desc Create booking
// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { serviceId, date, time, guestName, guestPhone, guestEmail, notes } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const bookingData = {
      serviceId,
      date,
      time,
      totalAmount: service.price,
      notes,
    };

    if (req.user) {
      bookingData.userId = req.user._id;
    } else {
      if (!guestName || !guestPhone) {
        return res.status(400).json({ message: 'Guest name and phone are required for guest booking' });
      }
      bookingData.guestName = guestName;
      bookingData.guestPhone = guestPhone;
      bookingData.guestEmail = guestEmail;
    }

    const booking = await Booking.create(bookingData);
    await booking.populate('serviceId');

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single booking
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('serviceId').populate('userId', 'name phone email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Allow access if admin or booking owner
    if (req.user.role !== 'admin' && booking.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN ROUTES

// @desc Get all bookings (admin)
const getAllBookings = async (req, res) => {
  try {
    const { status, paymentStatus, date, serviceId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (date) filter.date = { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) };
    if (serviceId) filter.serviceId = serviceId;

    const bookings = await Booking.find(filter)
      .populate('serviceId', 'name price')
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 });

    // Attach payment records to each booking
    const bookingIds = bookings.map(b => b._id);
    const payments = await Payment.find({ bookingId: { $in: bookingIds } }).sort({ createdAt: -1 });

    // Map payments by bookingId (take the latest payment per booking)
    const paymentMap = {};
    payments.forEach(p => {
      const key = p.bookingId.toString();
      if (!paymentMap[key]) paymentMap[key] = p; // first = most recent
    });

    // Attach payment to each booking object
    const enriched = bookings.map(b => ({
      ...b.toObject(),
      payment: paymentMap[b._id.toString()] || null,
    }));

    res.json({ bookings: enriched });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update booking status (admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus, amountPaid } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (amountPaid !== undefined) {
      booking.amountPaid = amountPaid;
      booking.amountDue = booking.totalAmount - amountPaid;
    }

    await booking.save();
    res.json({ message: 'Booking updated', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getBooking, cancelBooking, getAllBookings, updateBookingStatus };