const PaymentSettings = require('../models/PaymentSettings');

// @desc  Get payment settings (public — frontend needs to know which methods are enabled)
// @route GET /api/payment-settings
const getPaymentSettings = async (req, res) => {
  try {
    const settings = await PaymentSettings.getSettings();

    // Strip secrets before sending to public
    const safe = {
      methods: {
        razorpay: {
          enabled: settings.methods.razorpay.enabled,
          keyId:   settings.methods.razorpay.keyId,   // public key is OK to expose
          label:   settings.methods.razorpay.label,
        },
        upi: {
          enabled: settings.methods.upi.enabled,
          upiId:   settings.methods.upi.upiId,
          upiName: settings.methods.upi.upiName,
          label:   settings.methods.upi.label,
        },
        cash: {
          enabled: settings.methods.cash.enabled,
          label:   settings.methods.cash.label,
          note:    settings.methods.cash.note,
        },
      },
      advancePercent: settings.advancePercent,
    };

    res.json({ settings: safe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get full payment settings (admin — includes secrets)
// @route GET /api/payment-settings/admin
const getPaymentSettingsAdmin = async (req, res) => {
  try {
    const settings = await PaymentSettings.getSettings();
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update payment settings (admin)
// @route PUT /api/payment-settings
const updatePaymentSettings = async (req, res) => {
  try {
    const settings = await PaymentSettings.getSettings();
    const { methods, advancePercent } = req.body;

    if (methods) {
      if (methods.razorpay !== undefined) {
        Object.assign(settings.methods.razorpay, methods.razorpay);
      }
      if (methods.upi !== undefined) {
        Object.assign(settings.methods.upi, methods.upi);
      }
      if (methods.cash !== undefined) {
        Object.assign(settings.methods.cash, methods.cash);
      }
    }

    if (advancePercent !== undefined) {
      if (advancePercent < 1 || advancePercent > 100) {
        return res.status(400).json({ message: 'Advance percent must be between 1 and 100' });
      }
      settings.advancePercent = advancePercent;
    }

    settings.updatedAt = new Date();
    settings.markModified('methods');
    await settings.save();

    res.json({ message: 'Payment settings updated', settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPaymentSettings, getPaymentSettingsAdmin, updatePaymentSettings };
