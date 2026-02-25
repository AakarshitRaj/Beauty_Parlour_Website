const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Payment = require('../models/Payment');

// @desc Get admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();
    const totalServices = await Service.countDocuments({ isActive: true });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const revenueData = await Payment.aggregate([
      { $match: { status: 'captured' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    const recentBookings = await Booking.find()
      .populate('serviceId', 'name price')
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalBookings,
        totalServices,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalRevenue,
      },
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all users (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getAllUsers };
