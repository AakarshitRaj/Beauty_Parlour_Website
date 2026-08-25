const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔧 SECURITY CONFIG — change these 2 values anytime
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MAX_ATTEMPTS  = 10;              // wrong passwords before lockout
const LOCK_DURATION = 2 * 60 * 1000;  // lockout duration in ms (5 min)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  phone:         { type: String, required: true, trim: true },
  email:         { type: String, sparse: true, trim: true, lowercase: true },
  password:      { type: String, required: true },
  role:          { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt:     { type: Date, default: Date.now },
  loginAttempts: { type: Number, default: 0 },
  lockUntil:     { type: Date, default: null },
});

// true if account is currently locked
userSchema.virtual('isLocked').get(function () {
  return this.lockUntil && this.lockUntil > Date.now();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  // Lock expired — reset counter (use updateOne to skip pre-save hook)
  if (this.lockUntil && this.lockUntil <= Date.now()) {
    await this.constructor.updateOne(
      { _id: this._id },
      { $set: { loginAttempts: 0, lockUntil: null } }
    );
    this.loginAttempts = 0;
    this.lockUntil     = null;
  }

  // Still locked
  if (this.isLocked) {
    return { success: false, locked: true, lockUntil: this.lockUntil };
  }

  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  if (isMatch) {
    // Correct — reset counters
    if (this.loginAttempts > 0 || this.lockUntil) {
      await this.constructor.updateOne(
        { _id: this._id },
        { $set: { loginAttempts: 0, lockUntil: null } }
      );
    }
    return { success: true };
  }

  // Wrong — increment
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
