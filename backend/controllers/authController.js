const User         = require('../models/User');
const generateToken = require('../utils/generateToken');

const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000,
};

const sendTokenResponse = (res, statusCode, user) => {
  const token = generateToken(user._id);
  const userPayload = {
    _id:   user._id,
    name:  user.name,
    phone: user.phone,
    email: user.email,
    role:  user.role,
  };
  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      message: statusCode === 201 ? 'Registration successful' : 'Login successful',
      user: userPayload,
      token,
    });
};

// @desc  Register
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone, and password are required' });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    const user = await User.create({ name, phone, email, password });
    sendTokenResponse(res, 201, user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Login
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    const user = await User.findOne({ phone });

    // Don't reveal whether phone exists — just say invalid credentials
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // Check lockout BEFORE comparing password (no extra DB query needed)
    if (user.isLocked) {
      const secondsLeft = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(423).json({          // 423 = Locked
        message:    'Account temporarily locked due to too many failed attempts',
        locked:     true,
        lockUntil:  user.lockUntil,
        secondsLeft,
      });
    }

    // comparePassword now handles lockout logic internally
    const result = await user.comparePassword(password);

    if (result.locked) {
      const secondsLeft = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(423).json({
        message:    'Account locked after too many failed attempts. Try again in 15 minutes.',
        locked:     true,
        lockUntil:  user.lockUntil,
        secondsLeft,
      });
    }

    if (!result.success) {
      return res.status(401).json({
        message:      'Invalid phone number or password',
        attemptsLeft: result.attemptsLeft,
        warning:      result.attemptsLeft <= 2
          ? `${result.attemptsLeft} attempt${result.attemptsLeft !== 1 ? 's' : ''} remaining before lockout`
          : null,
      });
    }

    // Successful login
    sendTokenResponse(res, 200, user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Logout
// @route POST /api/auth/logout
const logout = (req, res) => {
  res
    .cookie('token', '', { ...cookieOptions, maxAge: 0 })
    .json({ message: 'Logged out successfully' });
};

// @desc  Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, logout, getMe };