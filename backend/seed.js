const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Service = require('./models/Service');
const SiteContent = require('./models/SiteContent');
const Gallery = require('./models/Gallery');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await SiteContent.deleteMany({});
    await Gallery.deleteMany({});

    // Create Admin
    const admin = await User.create({
      name: 'Glow & Glam Admin',
      phone: '9000000000',
      email: 'admin@glowglam.com',
      password: 'admin123456',
      role: 'admin',
    });
    console.log('✅ Admin created:', admin.email);

    // Create Services
    const services = await Service.insertMany([
      {
        name: 'Luxury Facial',
        description: 'Deep cleansing facial with premium products that nourish and rejuvenate your skin. Includes steam, exfoliation, mask, and moisturizing treatment.',
        category: 'facial',
        duration: 60,
        price: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
      },
      {
        name: 'Hair Styling & Cut',
        description: 'Expert haircut and styling by our senior stylists. Includes wash, cut, blowdry, and finishing touches tailored to your face shape.',
        category: 'hair',
        duration: 90,
        price: 800,
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
      },
      {
        name: 'Bridal Makeup',
        description: 'Complete bridal makeup package with airbrush foundation, HD finish, and long-lasting formulas. Perfect for your special day.',
        category: 'makeup',
        duration: 120,
        price: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600',
      },
      {
        name: 'Aromatherapy Spa',
        description: 'Full body relaxation with aromatherapy oils. Includes full body massage, foot scrub, and aroma steam therapy for total rejuvenation.',
        category: 'spa',
        duration: 90,
        price: 2500,
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
      },
      {
        name: 'Manicure & Pedicure',
        description: 'Complete nail care with premium gel polish. Includes nail shaping, cuticle care, exfoliation, moisturizing, and gel color of your choice.',
        category: 'nails',
        duration: 75,
        price: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600',
      },
    ]);
    console.log('✅ Services created:', services.length);

    // Site Content
    await SiteContent.create({
      heroTitle: 'Where Beauty Meets Luxury',
      heroSubtitle: 'Experience premium beauty treatments curated for the modern woman. Step in for a transformation, step out glowing.',
      heroImage: 'https://images.unsplash.com/photo-1560066984-138daaa14d4a?w=1400',
      aboutTitle: 'Our Story',
      aboutText: 'Founded in 2018, Glow & Glam has been the sanctuary of choice for women who seek the finest beauty experiences. Our expert team of certified professionals uses only the highest quality products to ensure you look and feel your absolute best.',
      aboutImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
      contactEmail: 'hello@glowglam.com',
      contactPhone: '+91 98765 43210',
      address: '123 Beauty Lane, Bandra West, Mumbai, Maharashtra 400050',
      testimonials: [
        { name: 'Priya Sharma', review: 'Absolutely love this place! The bridal makeup they did for my wedding was stunning. Everyone complimented me all day.', rating: 5 },
        { name: 'Sneha Patel', review: 'The facial left my skin glowing for weeks! The staff is warm, professional, and the ambiance is so calming.', rating: 5 },
        { name: 'Ananya Rao', review: 'Best manicure-pedicure experience in the city. The gel polish has lasted over 3 weeks and looks fresh!', rating: 5 },
      ],
      promotions: [
        { title: 'Bridal Package', description: 'Complete bridal makeover package. Book 30 days in advance and get 15% off.', discount: 15 },
        { title: 'Weekend Glow', description: 'Every Saturday & Sunday - Get a free head massage with any facial booking.', discount: 0 },
      ],
      socialLinks: {
        instagram: 'https://instagram.com/glowglam',
        facebook: 'https://facebook.com/glowglam',
      },
    });
    console.log('✅ Site content created');

    console.log('\n🎉 Seed completed successfully!');
    console.log('Admin Login: phone: 9000000000 | password: admin123456');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();
