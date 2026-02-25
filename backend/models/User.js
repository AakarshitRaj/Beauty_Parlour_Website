const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  phone:    { type: String, required: true, trim: true },
  email:    { type: String, sparse: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt:{ type: Date, default: Date.now },

  // ── Account-level lockout fields ─────────────────────────────────────────
  // Stored in DB so IP change / VPN cannot bypass it
  loginAttempts: { type: Number, default: 0 },
  lockUntil:     { type: Date,   default: null },
});

// ── Lockout constants ─────────────────────────────────────────────────────
const MAX_ATTEMPTS    = 5;
const LOCK_DURATION   = 15 * 60 * 1000; // 15 minutes in ms

// Virtual — true if account is currently locked
userSchema.virtual('isLocked').get(function () {
  return this.lockUntil && this.lockUntil > Date.now();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password — also handles lockout logic
userSchema.methods.comparePassword = async function (candidatePassword) {

  // Lock expired — reset counter using updateOne to skip pre('save') password rehash
  if (this.lockUntil && this.lockUntil <= Date.now()) {
    await this.constructor.updateOne(
      { _id: this._id },
      { $set: { loginAttempts: 0, lockUntil: null } }
    );
    this.loginAttempts = 0;
    this.lockUntil     = null;
  }

  // If still locked (not expired), reject immediately
  if (this.isLocked) {
    return { success: false, locked: true, lockUntil: this.lockUntil };
  }

  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  if (isMatch) {
    // Correct password — reset lockout counters
    if (this.loginAttempts > 0 || this.lockUntil) {
      await this.constructor.updateOne(
        { _id: this._id },
        { $set: { loginAttempts: 0, lockUntil: null } }
      );
    }
    return { success: true };
  }

  // Wrong password — increment attempts using updateOne to skip pre('save')
  const newAttempts = this.loginAttempts + 1;
  const lockUntil   = newAttempts >= MAX_ATTEMPTS
    ? new Date(Date.now() + LOCK_DURATION)
    : null;

  await this.constructor.updateOne(
    { _id: this._id },
    { $set: { loginAttempts: newAttempts, lockUntil } }
  );

  return {
    success:      false,
    locked:       newAttempts >= MAX_ATTEMPTS,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - newAttempts),
    lockUntil,
  };
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  return obj;
};

module.exports = mongoose.model('User', userSchema);