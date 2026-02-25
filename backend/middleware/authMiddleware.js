const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Reads token from httpOnly cookie first, falls back to Authorization header
// This supports both the secure cookie method and the old localStorage method
const getToken = (req) => {
  if (req.cookies?.token) return req.cookies.token;
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) return auth.split(' ')[1];
  return null;
};

const protect = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access required' });
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }
    next();
  } catch {
    next();
  }
};

module.exports = { protect, adminOnly, optionalAuth };