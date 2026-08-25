/**
 * uploadServiceImages.js
 *
 * Uploads ONE representative image per subcategory to Cloudinary.
 * Source images are found via the Pexels API (free, no attribution required).
 * Cloudinary fetches each image directly from that URL server-side —
 * nothing is downloaded locally.
 *
 * Setup (one-time, ~2 minutes):
 *   1. Sign up free at https://www.pexels.com/api/ and grab your API key
 *   2. Add PEXELS_API_KEY=your_key_here to your backend/.env
 *   3. Make sure your .env also has CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
 *      CLOUDINARY_API_SECRET, and MONGO_URI
 *
 * Usage:
 *   node uploadServiceImages.js              → uploads + writes service-images.json
 *   node uploadServiceImages.js --update-db  → also writes results into MongoDB
 */

'use strict';

const fs    = require('fs');
const https = require('https');
const path  = require('path');

// ── Load .env ───────────────────────────────────────────
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

// ── Validate required env vars before doing anything ────
const REQUIRED_ENV = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  console.error('   Add them to your backend/.env file and try again.');
  process.exit(1);
}

if (process.argv.includes('--update-db') && !process.env.MONGO_URI) {
  console.error('❌ --update-db requires MONGO_URI in your .env file.');
  process.exit(1);
}

// ── Configure Cloudinary ────────────────────────────────
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Load service data ───────────────────────────────────
const services = require('../feedData/updateData');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SEARCH QUERIES
//  One Pexels search string per subcategory.
//  Edit these to steer toward a different look.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SUBCATEGORY_QUERIES = {
  'Threadwork':                    'eyebrow threading beauty salon',   // FIX: was a Pinterest URL
  'D-Tan':                         'skin tan removal treatment',
  'Body Shiners':                  'body polishing spa treatment',
  'Cleanup':                       'facial cleanup skincare woman',
  'Facials':                       'facial spa treatment relaxing',
  'Waxing':                        'leg waxing beauty salon',
  'Hand & Feet':                   'manicure pedicure spa',
  'Nail Extension & Polish':       'gel nail polish manicure',
  'Hair Care':                     'hair wash salon shampoo',
  'Hair Cutting':                  'hair cutting salon scissors',
  'Hair Spa':                      'hair spa treatment salon',
  'Hair Color':                    'hair highlights salon color',
  'Root Touchup':                  'hair root color touchup',
  'Fashion Color':                 'balayage hair color salon',
  'Hair Treatment':                'keratin hair treatment salon',
  'Party Makeup':                  'party makeup glam woman',
  'Haldi / Mehendi Makeup':        'indian bride mehendi ceremony',
  'Engagement / Roka Makeup':      'indian bride engagement makeup',
  'Bridal Makeup':                 'indian bridal makeup wedding',
  'Reception Makeup':              'bride reception evening makeup',
  'Corporate / Photoshoot Makeup': 'professional makeup photoshoot studio',
  'Beautician Course':             'beauty academy students training',
  'Certification Courses':         'makeup course class training',
};

// Category-level fallbacks — used when Pexels key is missing
// or a Pexels search returns nothing
const CATEGORY_IMAGES = {
  skin:    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80',
  hair:    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
  makeup:  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80',
  waxing:  'https://images.unsplash.com/photo-1596178060810-72660ee8a555?w=1200&q=80',
  nails:   'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80',
  courses: 'https://images.unsplash.com/photo-1560066984-138daaa14d4a?w=1200&q=80',
};

// ── Helpers ─────────────────────────────────────────────

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Small delay between API calls to avoid rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Pexels search with timeout so it never hangs forever
const searchPexelsImage = (query) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Pexels request timed out for query: "${query}"`));
    }, 10000); // 10 second timeout

    const options = {
      hostname: 'api.pexels.com',
      path:     `/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      headers:  { Authorization: process.env.PEXELS_API_KEY },
    };

    https.get(options, (res) => {
      let body = '';
      res.on('data',  chunk => (body += chunk));
      res.on('end',   () => {
        clearTimeout(timeout);
        try {
          const data  = JSON.parse(body);
          const photo = data.photos?.[0];
          resolve(photo ? photo.src.large2x : null);
        } catch (err) {
          reject(new Error(`Failed to parse Pexels response: ${err.message}`));
        }
      });
      res.on('error', err => { clearTimeout(timeout); reject(err); });
    }).on('error', err => { clearTimeout(timeout); reject(err); });
  });

// Test Cloudinary credentials before starting any uploads
const testCloudinaryConnection = async () => {
  console.log('\n🔍 Testing Cloudinary connection...');
  try {
    const result = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { folder: 'arpan-beauty-zone/test', public_id: 'connection-test', overwrite: true }
    );
    console.log('✅ Cloudinary connection OK\n');
    // Clean up test image
    await cloudinary.uploader.destroy('arpan-beauty-zone/test/connection-test');
    return true;
  } catch (err) {
    console.error('❌ Cloudinary connection failed:', err.message);
    console.error('   Check your CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
    return false;
  }
};

// ── Main ────────────────────────────────────────────────
const run = async () => {
  const updateDb = process.argv.includes('--update-db');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Glow & Glam — Service Image Uploader');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Cloud Name : ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`API Key    : ${process.env.CLOUDINARY_API_KEY}`);
  console.log(`API Secret : ${'*'.repeat(8)} (set)`);
  console.log(`Pexels Key : ${process.env.PEXELS_API_KEY ? '✅ set' : '⚠️  not set — using fallback images'}`);
  console.log(`Update DB  : ${updateDb ? 'yes' : 'no'}`);
  console.log('');

  // Test Cloudinary before wasting time on Pexels searches
  const cloudinaryOk = await testCloudinaryConnection();
  if (!cloudinaryOk) process.exit(1);

  if (!process.env.PEXELS_API_KEY) {
    console.warn('⚠️  PEXELS_API_KEY not set — falling back to category-level images only.');
    console.warn('   Sign up free at https://www.pexels.com/api/ for better subcategory photos.\n');
  }

  // Group services by subcategory (fallback to category if no subcategory)
  const groups = new Map();
  for (const s of services) {
    const key = s.subcategory || s.category;
    if (!groups.has(key)) groups.set(key, { category: s.category, items: [] });
    groups.get(key).items.push(s);
  }

  console.log(`📦 ${services.length} services → ${groups.size} unique groups`);
  console.log(`   Uploading ${groups.size} images (not ${services.length})\n`);

  const uploaded = {};
  let successCount = 0;
  let failCount    = 0;

  for (const [key, { category }] of groups) {
    let sourceUrl = null;

    // 1. Try Pexels first
    if (process.env.PEXELS_API_KEY) {
      const query = SUBCATEGORY_QUERIES[key];
      if (query) {
        try {
          sourceUrl = await searchPexelsImage(query);
          if (!sourceUrl) console.warn(`   ⚠️  Pexels returned no results for "${key}" — using fallback`);
          await sleep(300); // 300ms between Pexels calls to avoid rate limit
        } catch (err) {
          console.warn(`   ⚠️  Pexels error for "${key}": ${err.message} — using fallback`);
        }
      } else {
        console.warn(`   ⚠️  No Pexels query defined for "${key}" — using fallback`);
      }
    }

    // 2. Fall back to category image
    if (!sourceUrl) {
      sourceUrl = CATEGORY_IMAGES[category?.toLowerCase()];
    }

    // 3. Skip if nothing found
    if (!sourceUrl) {
      console.warn(`   ⚠️  No image source for "${key}" (category: ${category}) — skipping`);
      failCount++;
      continue;
    }

    // Upload to Cloudinary
    try {
      const result = await cloudinary.uploader.upload(sourceUrl, {
        folder:         'arpan-beauty-zone/services',
        public_id:      slugify(key),
        overwrite:      true,
        transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
      });
      uploaded[key] = { imageUrl: result.secure_url, imagePublicId: result.public_id };
      console.log(`✅ ${key}`);
      console.log(`   ${result.secure_url}`);
      successCount++;
    } catch (err) {
      console.error(`❌ Upload failed for "${key}": ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n📊 Results: ${successCount} uploaded, ${failCount} failed\n`);

  // Attach image URLs to each service
  const withImages = services.map(s => {
    const key = s.subcategory || s.category;
    const img = uploaded[key];
    return img ? { ...s, imageUrl: img.imageUrl, imagePublicId: img.imagePublicId } : s;
  });

  // Always write JSON output — safe, no DB needed
  const outPath = path.join(__dirname, 'service-images.json');
  fs.writeFileSync(outPath, JSON.stringify(withImages, null, 2));
  console.log(`📄 Written: ${outPath}`);
  console.log(`   Merge imageUrl/imagePublicId into your seed data or run with --update-db\n`);

  // Optionally update MongoDB directly
  if (updateDb) {
    let mongoose, Service;
    try {
      mongoose = require('mongoose');
      Service  = require('../models/Service');
    } catch (err) {
      console.error('❌ Could not load mongoose or Service model:', err.message);
      process.exit(1);
    }

    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('🗄️  Connected to MongoDB — updating Service documents...');

      let matched = 0;
      let notFound = [];

      for (const s of withImages) {
        if (!s.imageUrl) continue;
        const res = await Service.updateOne(
          { name: s.name },
          { $set: { imageUrl: s.imageUrl, imagePublicId: s.imagePublicId } }
        );
        if (res.matchedCount > 0) matched++;
        else notFound.push(s.name);
      }

      console.log(`✅ Updated ${matched} Service documents in MongoDB`);
      if (notFound.length) {
        console.warn(`⚠️  ${notFound.length} services not found in DB (name mismatch?):`);
        notFound.forEach(n => console.warn(`   - ${n}`));
      }
    } catch (err) {
      console.error('❌ MongoDB error:', err.message);
    } finally {
      await mongoose.disconnect();
      console.log('🗄️  Disconnected from MongoDB');
    }
  }

  console.log('\n✨ Done!');
};

// ── Run ──────────────────────────────────────────────────
run().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});