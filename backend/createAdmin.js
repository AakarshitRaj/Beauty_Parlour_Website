const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existing = await User.findOne({ phone: '9000000000' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Glow & Glam Admin',
      phone: '9000000000',
      email: 'admin@glowglam.com',
      password: 'admin123456',
      role: 'admin',
    });

    console.log('✅ Admin created: phone: 9000000000, password: admin123456');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
