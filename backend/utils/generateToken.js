const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',   // was 30d — reduced to 7 days for better security
  });
};

module.exports = generateToken;