const express = require('express');
const router  = express.Router();
const {
  getPaymentSettings,
  getPaymentSettingsAdmin,
  updatePaymentSettings,
} = require('../controllers/paymentSettingsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',        getPaymentSettings);                          // public
router.get('/admin',   protect, adminOnly, getPaymentSettingsAdmin); // full settings with secrets
router.put('/',        protect, adminOnly, updatePaymentSettings);   // update

module.exports = router;
