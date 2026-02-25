// Legacy rateLimiter kept for backward compatibility
// Main rate limiting is now handled by express-rate-limit in server.js
const rateLimit = require('express-rate-limit');

const rateLimiter = (max = 10, windowMs = 15 * 60 * 1000) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' },
  });
};

module.exports = rateLimiter;