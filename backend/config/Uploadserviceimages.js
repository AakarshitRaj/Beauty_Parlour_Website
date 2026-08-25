/**
 * uploadServiceImages.js
 *
 * Uploads ONE unique image per SERVICE (not per subcategory).
 * Each service gets a specific Pexels search query for accurate results.
 * Cloudinary fetches images directly from Pexels — nothing downloaded locally.
 *
 * Usage:
 *   node uploadServiceImages.js              → uploads + writes service-images.json
 *   node uploadServiceImages.js --update-db  → also updates MongoDB directly
 */

'use strict';

const fs    = require('fs');
const https = require('https');
const path  = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

// ── Validate env vars ───────────────────────────────────
const REQUIRED_ENV = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing: ${missing.join(', ')} in .env`);
  process.exit(1);
}
if (process.argv.includes('--update-db') && !process.env.MONGO_URI) {
  console.error('❌ --update-db requires MONGO_URI in .env');
  process.exit(1);
}
if (!process.env.PEXELS_API_KEY) {
  console.error('❌ PEXELS_API_KEY is required for per-service images.');
  console.error('   Sign up free at https://www.pexels.com/api/ and add it to .env');
  process.exit(1);
}

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const services = require('../feedData/updateData');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔧 PER-SERVICE PEXELS SEARCH QUERIES
//  Each service name maps to a specific search query.
//  Edit any query to change the image for that service.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SERVICE_QUERIES = {
  // ── Threadwork ────────────────────────────────────────
  'Eyebrows Threading':       'eyebrow threading shaping salon',
  'Forehead Threading':       'forehead hair removal threading',
  'Upper Lips Threading':     'upper lip threading waxing woman',
  'Chin Threading':           'chin hair removal beauty salon',
  'Side Lock Threading':      'sideburn hair removal threading',
  'Full Face Threading':      'full face threading beauty salon woman',

  // ── D-Tan ─────────────────────────────────────────────
  'Ozone D-Tan':              'skin brightening facial glow treatment',
  'Raga D-Tan':               'tan removal skin treatment woman',
  'O3+ D-Tan':                'face mask skin treatment spa',
  'Lotus D-Tan':              'lotus flower skincare facial',
  'Natures D-Tan':            'natural herbal skincare mask woman',
  'Herbal D-Tan':             'herbal green face mask beauty',
  'Aries D-Tan':              'skin whitening treatment face mask',
  'Oxy Glow D-Tan':           'oxygen facial glow skin woman',
  'Shahnaz D-Tan':            'luxury face mask skin treatment',

  // ── Body Shiners ──────────────────────────────────────
  'Ammonia Free Bleach':      'skin bleach lightening treatment',
  'Back Bleach & Scrubbing':  'back scrub spa treatment woman',
  'Body Polishing':           'body polish scrub spa luxury',
  'Arms Polishing':           'arm skin polishing salon treatment',
  'Arms Scrubbing':           'arm scrub exfoliation beauty spa',

  // ── Cleanup ───────────────────────────────────────────
  'Fruit Cleanup':            'fruit facial skin cleanup refreshing',
  'Lotus Diamond Radiant Cleanup': 'diamond facial skin radiance glow',
  'Lotus Gold Radiant Cleanup':    'gold facial skin treatment glowing',
  'VLCC Diamond Cleanup':     'diamond skincare facial salon',
  'VLCC Gold Cleanup':        'gold beauty skin treatment luxury',
  'Natures Gold Cleanup':     'natural gold skin facial woman',
  'Shahnaz Gold Cleanup':     'luxury gold skincare facial',
  'Shahnaz Diamond Cleanup':  'diamond skin treatment luxury beauty',
  'O3+ Cleanup':              'professional skin cleanup facial',
  'Lotus Professional Cleanup': 'professional facial skin treatment salon',
  'Whitening Cleanup':        'skin brightening whitening facial',
  'Detox Cleanup':            'detox face mask skin purifying',
  'Ultra Glow Cleanup':       'glowing skin facial treatment',
  'Sensitive Care Cleanup':   'gentle sensitive skin facial care',
  'Add-On Mask':              'face mask clay spa treatment',

  // ── Facials ───────────────────────────────────────────
  'Fruit Facial with D-Tan':  'fruit facial vitamin c skin',
  'Lotus Anti Aging Facial':  'anti aging facial wrinkle skin',
  'Lotus 4 Layer Facial':     'multi step facial skin layers',
  'Lotus Gold Sheen Facial':  'gold facial skin treatment glow',
  'Ozone Facial':             'deep cleansing ozone facial',
  'Ozone Anti-Aging Facial':  'anti aging ozone facial skin',
  'VLCC Gold Facial':         'gold facial VLCC skincare',
  'O3+ Seaweed Facial':       'seaweed facial marine skin treatment',
  'Lotus Diamond Facial':     'diamond facial skin brightening treatment',
  'Lotus Facial':             'lotus flower facial skin care',
  'O3+ Power Brightening Treatment': 'skin brightening power treatment glow',
  'Natures Gold Facial':      'natural gold facial glow skin',
  'Lakme Perfect Radiance Facial': 'radiance facial glowing skin',
  'Shahnaz Whitening Facial': 'herbal whitening facial skin',
  'Shahnaz Gold Facial':      'gold luxury facial skin spa',
  'Shahnaz Diamond Facial':   'diamond luxury facial skin',
  'Lotus Radiance Gold Facial':'gold radiance facial treatment glow',
  'Whitening Facial':         'skin whitening brightening facial woman',
  'Anti-Aging Facial':        'anti aging facial wrinkle treatment',
  'O3+ Facial':               'professional facial spa treatment',
  'Bridal Glow Facial':       'bridal glow skin facial radiant',
  'Korean Glass Facial':      'korean glass skin dewy facial',
  'HydraFacial':              'hydrafacial hydration skin treatment',

  // ── Waxing ────────────────────────────────────────────
  'Full Hand Wax':            'hand waxing smooth skin salon',
  "Under Arm's Wax":          'underarm waxing smooth beauty',
  'Full Leg Wax':             'leg waxing smooth skin woman',
  'Half Leg Wax':             'leg waxing salon beauty',
  'Full Body Wax':            'full body wax spa luxury',
  'Bikini Wax':               'bikini wax smooth skin salon',
  'Full Body + Bikini Wax':   'full body wax salon woman',
  'Face Wax':                 'face waxing smooth skin woman',
  'Lip/Chin Wax':             'lip chin wax beauty removal',

  // ── Nails: Hand & Feet ────────────────────────────────
  'Manicure (Regular)':       'manicure nail polish hands salon',
  'Pedicure (Regular)':       'pedicure foot care salon',
  'Crystal Manicure':         'crystal nail art manicure hands',
  'Crystal Pedicure':         'pedicure spa foot treatment',
  'Exclusive Manicure':       'luxury manicure nails polish salon',
  'Exclusive Pedicure':       'luxury pedicure spa foot',
  'Luxurious Manicure':       'luxury nail manicure spa hands',
  'Luxurious Pedicure':       'luxury spa pedicure foot care',
  'Hand Polishing':           'hand polishing beauty treatment',
  'Leg Polishing':            'leg polishing smooth skin beauty',

  // ── Nail Extension & Polish ───────────────────────────
  'Permanent Gel Polish (Hand & Feet)': 'gel nail polish hands feet salon',
  'French Permanent Gel Polish':        'french manicure gel nails white tips',
  'Temporary Nail Extension':           'nail extension artificial nails',
  'Permanent Nail Extension (Gel/Acrylic)': 'acrylic gel nail extension long nails',
  'Nail Extension Removal':             'nail extension removal acetone salon',
  'Gel Polish Removal':                 'gel polish removal nails salon',

  // ── Hair Care ─────────────────────────────────────────
  'Hair Wash':                'hair wash shampoo salon woman',
  'Hair Wash with Setting':   'hair wash blow dry styling salon',
  'Hair Wash with Trimming':  'hair wash trim salon woman',

  // ── Hair Cutting ──────────────────────────────────────
  'Hair Cut (Normal)':        'haircut scissors salon woman',
  'Trimming':                 'hair trimming ends salon',
  'Advance Hair Cut':         'advanced layered haircut salon',
  'Baby Hair Cut':            'baby haircut child salon',
  'U Hair Cut':               'U shape haircut salon woman',
  'Deep U Cut':               'deep U cut layered hair',
  'V Cut':                    'V shaped haircut woman layers',
  'Deep V Cut':               'deep V haircut salon woman',
  'Front Layers':             'front layer haircut face framing',
  'Baby Cut':                 'kids haircut children salon',

  // ── Hair Spa ──────────────────────────────────────────
  'Matrix Hair Spa':          'hair spa treatment mask salon',
  'Loreal Hair Spa':          'loreal hair mask spa treatment',
  'Keratin Hair Spa':         'keratin hair spa smooth shiny',
  'Spa Treatment':            'hair spa deep conditioning mask',

  // ── Hair Color ────────────────────────────────────────
  'Highlights (per strip)':   'hair highlights foil salon color',

  // ── Root Touchup ──────────────────────────────────────
  'Streax Root Touchup':      'hair root color touchup salon',
  'Matrix Root Touchup':      'matrix hair color root salon',
  'Loreal Root Touchup':      'loreal hair color root touchup',

  // ── Fashion Color ─────────────────────────────────────
  'Full Highlights':          'full head highlights hair color salon',
  'Highlights with Global Color': 'hair highlights global color salon',
  'Half Length Color':        'half hair length color salon',
  'Balayage':                 'balayage hair color hand painted',
  'Ombre':                    'ombre hair color gradient salon',
  'Streax Global Color':      'full head hair color salon woman',
  'Matrix Global Color':      'matrix global hair color salon',
  'Loreal Global Color':      'loreal global hair color salon',
  'Cap Highlights':           'cap highlights hair color salon',

  // ── Hair Treatment ────────────────────────────────────
  'Keratin Treatment':        'keratin hair treatment smooth straight',
  'Smoothening Treatment':    'hair smoothening treatment salon',
  'Rebounding Treatment':     'hair rebonding straight treatment',
  'Botox Hair Treatment':     'hair botox treatment shine smooth',

  // ── Makeup ────────────────────────────────────────────
  'Basic Party Makeup':       'party makeup glam woman beautiful',
  'HD Party Makeup':          'HD makeup glam photoshoot woman',
  'Airbrush Party Makeup':    'airbrush makeup flawless woman',

  'Haldi Natural Look':       'haldi ceremony bride yellow flowers',
  'HD Mehendi Look':          'mehendi henna bride hands function',
  'Soft Glam Function Look':  'function makeup subtle glam indian bride',

  'Soft Glam Engagement':     'engagement ceremony indian bride jewelry',
  'HD Engagement':            'HD engagement makeup flawless bride',
  'Airbrush Engagement':      'airbrush engagement bride indian',
  'Signature Engagement Look':'luxury engagement bridal look jewelry',

  'HD Bridal Makeup':         'HD bridal makeup indian bride red',
  '3D Bridal Makeup':         '3D bridal makeup contouring indian',
  'HD Glossy Bridal Makeup':  'glossy glowing bridal makeup indian',
  'Airbrush Bridal Makeup':   'airbrush bridal makeup flawless indian',
  'Signature Bridal Makeup':  'luxury bridal makeup celebrity indian',

  'HD Reception Look':        'reception evening bridal makeup elegant',
  'Airbrush Reception':       'airbrush reception bridal gown',
  'Signature Reception Look': 'luxury reception bridal jewelry gown',

  'Corporate Makeup':         'professional corporate makeup woman office',
  'Outdoor Shoot Makeup':     'outdoor photoshoot makeup model',

  // ── Courses ───────────────────────────────────────────
  'Beautician Course – Basic to Advance': 'beauty school students makeup training',
  'Certification in Makeup Course':       'makeup artist certification training course',
  'Certification in Hair Course':         'hairdressing course training scissors',
  'Certification in Nail Art Course':     'nail art course training students',
  'Certification in HydraFacial Course':  'hydrafacial training course professional',
  'Certification in Airbrush Makeup Course': 'airbrush makeup training course artist',
};

// ── Helpers ─────────────────────────────────────────────
const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const searchPexelsImage = (query, page = 1) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Timeout: "${query}"`)), 10000);

    const options = {
      hostname: 'api.pexels.com',
      path:     `/v1/search?query=${encodeURIComponent(query)}&per_page=1&page=${page}&orientation=landscape`,
      headers:  { Authorization: process.env.PEXELS_API_KEY },
    };

    https.get(options, (res) => {
      let body = '';
      res.on('data',  c => (body += c));
      res.on('end',   () => {
        clearTimeout(timeout);
        try {
          const data  = JSON.parse(body);
          const photo = data.photos?.[0];
          resolve(photo ? photo.src.large2x : null);
        } catch (e) { reject(e); }
      });
      res.on('error', e => { clearTimeout(timeout); reject(e); });
    }).on('error', e => { clearTimeout(timeout); reject(e); });
  });

// Test Cloudinary
const testCloudinary = async () => {
  try {
    await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { folder: 'arpan-beauty-zone/test', public_id: 'test', overwrite: true }
    );
    await cloudinary.uploader.destroy('arpan-beauty-zone/test/test');
    console.log('✅ Cloudinary OK\n');
    return true;
  } catch (err) {
    console.error('❌ Cloudinary failed:', err.message);
    return false;
  }
};

// ── Main ────────────────────────────────────────────────
const run = async () => {
  const updateDb  = process.argv.includes('--update-db');
  // --resume: skip services that already have an entry in service-images.json
  const resume    = process.argv.includes('--resume');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Service Image Uploader — Per Service');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Services   : ${services.length}`);
  console.log(`Update DB  : ${updateDb}`);
  console.log(`Resume     : ${resume}`);
  console.log('');

  if (!await testCloudinary()) process.exit(1);

  // Load existing results if resuming
  const outPath = path.join(__dirname, 'service-images.json');
  let existing  = {};
  if (resume && fs.existsSync(outPath)) {
    const prev = JSON.parse(fs.readFileSync(outPath, 'utf-8'));
    prev.forEach(s => { if (s.imageUrl) existing[s.name] = s; });
    console.log(`📂 Resuming — ${Object.keys(existing).length} already done\n`);
  }

  const results    = {};
  let successCount = 0;
  let skipCount    = 0;
  let failCount    = 0;

  for (let i = 0; i < services.length; i++) {
    const svc = services[i];

    // Skip if already done (resume mode)
    if (resume && existing[svc.name]) {
      results[svc.name] = existing[svc.name];
      skipCount++;
      continue;
    }

    const query = SERVICE_QUERIES[svc.name];
    if (!query) {
      console.warn(`⚠️  [${i+1}/${services.length}] No query for "${svc.name}" — skipping`);
      failCount++;
      continue;
    }

    // Pexels search — try page 1, fallback to page 2 if null
    let sourceUrl = null;
    try {
      sourceUrl = await searchPexelsImage(query, 1);
      if (!sourceUrl) sourceUrl = await searchPexelsImage(query, 2);
      await sleep(350); // stay under Pexels rate limit
    } catch (err) {
      console.warn(`   ⚠️  Pexels error: ${err.message}`);
    }

    if (!sourceUrl) {
      console.warn(`⚠️  [${i+1}/${services.length}] No image found for "${svc.name}"`);
      failCount++;
      continue;
    }

    // Upload to Cloudinary
    try {
      const result = await cloudinary.uploader.upload(sourceUrl, {
        folder:         'arpan-beauty-zone/services',
        public_id:      slugify(svc.name),
        overwrite:      true,
        transformation: [{ width: 800, height: 600, crop: 'fill', gravity: 'face', quality: 'auto:good' }],
      });

      results[svc.name] = {
        ...svc,
        imageUrl:       result.secure_url,
        imagePublicId:  result.public_id,
      };

      console.log(`✅ [${i+1}/${services.length}] ${svc.name}`);
      successCount++;

      // Save progress every 10 uploads so --resume can recover from crashes
      if (successCount % 10 === 0) {
        const partial = services.map(s => results[s.name] || s);
        fs.writeFileSync(outPath, JSON.stringify(partial, null, 2));
        console.log(`   💾 Progress saved (${successCount} done)\n`);
      }

    } catch (err) {
      console.error(`❌ [${i+1}/${services.length}] Upload failed for "${svc.name}": ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n📊 Done: ${successCount} uploaded, ${skipCount} skipped (resumed), ${failCount} failed`);

  // Final JSON write
  const withImages = services.map(s => results[s.name] || s);
  fs.writeFileSync(outPath, JSON.stringify(withImages, null, 2));
  console.log(`📄 Written: ${outPath}\n`);

  // MongoDB update
  if (updateDb) {
    const mongoose = require('mongoose');
    const Service  = require('../models/Service');

    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('🗄️  Connected to MongoDB...');

      let matched  = 0;
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

      console.log(`✅ Updated ${matched} services in MongoDB`);
      if (notFound.length) {
        console.warn(`⚠️  ${notFound.length} not found in DB:`);
        notFound.slice(0, 10).forEach(n => console.warn(`   - ${n}`));
        if (notFound.length > 10) console.warn(`   ... and ${notFound.length - 10} more`);
      }
    } catch (err) {
      console.error('❌ MongoDB error:', err.message);
    } finally {
      await mongoose.disconnect();
      console.log('🗄️  Disconnected');
    }
  }

  console.log('\n✨ Done!');
};

run().catch(err => {
  console.error('\n❌ Fatal:', err.message);
  process.exit(1);
});