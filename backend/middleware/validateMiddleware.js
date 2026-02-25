const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required').isMobilePhone().withMessage('Invalid phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateLogin = [
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateBooking = [
  body('serviceId').notEmpty().withMessage('Service is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  handleValidationErrors,
];

const validateService = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('price').isNumeric().withMessage('Price must be a number'),
  handleValidationErrors,
];

module.exports = { validateRegister, validateLogin, validateBooking, validateService, handleValidationErrors };
