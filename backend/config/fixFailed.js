/**
 * fixFailedUploads.js
 * Uploads only the 3 failed images — Waxing, Beautician Course, Certification Courses
 * Run: node fixFailedUploads.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Only the 3 that failed — with working replacement URLs ──
const FAILED = [
  {
    key:      'Waxing',
    publicId: 'waxing',
    url:      'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=1200&q=80',
  },
  {
    key:      'Beautician Course',
    publicId: 'beautician-course',
    url:      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
  },
  {
    key:      'Certification Courses',
    publicId: 'certification-courses',
    url:      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
  },
];

const run = async () => {
  console.log('Uploading 3 failed images...\n');

  const results = {};

  for (const item of FAILED) {
    try {
      const result = await cloudinary.uploader.upload(item.url, {
        folder:         'arpan-beauty-zone/services',
        public_id:      item.publicId,
        overwrite:      true,
        transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
      });
      results[item.key] = { imageUrl: result.secure_url, imagePublicId: result.public_id };
      console.log(`✅ ${item.key}`);
      console.log(`   ${result.secure_url}\n`);
    } catch (err) {
      console.error(`❌ ${item.key}: ${err.message}\n`);
    }
  }

  // Merge into existing service-images.json
  const jsonPath = path.join(__dirname, 'service-images.json');

  if (fs.existsSync(jsonPath)) {
    const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    const updated = existing.map(service => {
      const key = service.subcategory || service.category;
      if (results[key]) {
        return { ...service, imageUrl: results[key].imageUrl, imagePublicId: results[key].imagePublicId };
      }
      return service;
    });

    fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2));
    console.log(`📄 Updated service-images.json with the 3 fixed images`);
  } else {
    console.log('⚠️  service-images.json not found — run uploadServiceImages.js first');
    console.log('   Results:', JSON.stringify(results, null, 2));
  }

  console.log('\n✨ Done! Now run: node uploadServiceImages.js --update-db');
};

run().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});