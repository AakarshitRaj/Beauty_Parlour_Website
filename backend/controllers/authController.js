// backend/controllers/authController.js
const User          = require('../models/User');
const generateToken = require('../utils/generateToken');

const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
};

const sendTokenResponse = (res, statusCode, user) => {
  const token = generateToken(user._id);
  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      message: statusCode === 201 ? 'Registration successful' : 'Login successful',
      user: {
        _id:   user._id,
        name:  user.name,
        phone: user.phone,
        email: user.email,
        role:  user.role,
      },
      token,
    });
};

// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !password)
      return res.status(400).json({ message: 'Name, phone and password are required' });

    const existing = await User.findOne({ phone });
    if (existing)
      return res.status(400).json({ message: 'An account with this phone number already exists' });

    const user = await User.create({ name, phone, email, password });
    sendTokenResponse(res, 201, user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password)
      return res.status(400).json({ message: 'Phone and password are required' });

    const user = await User.findOne({ phone });
    if (!user)
      return res.status(401).json({ message: 'Incorrect phone number or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Incorrect phone number or password' });

    // Success — send token
    sendTokenResponse(res, 200, user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/logout
const logout = (req, res) => {
  res
    .cookie('token', '', { ...cookieOptions, maxAge: 0 })
    .json({ message: 'Logged out successfully' });
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, logout, getMe };