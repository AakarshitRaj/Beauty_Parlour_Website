/**
 * Seeds Services (and updates SiteContent) with the full Arpan's Beauty Zone
 * price list. This script only touches the Service collection and the
 * SiteContent document — it does NOT delete Users or Gallery, so your admin
 * login is safe to run this more than once.
 *
 * Run with:  node seed/seedArpanBeautyZone.js
 *
 * NOTE ON DURATIONS: the price list doesn't specify service durations, so
 * every service below defaults to 30 minutes. Adjust `duration` (in
 * minutes) per service once you know real appointment lengths — it's used
 * for time-slot booking.
 *
 * NOTE ON A COUPLE OF PROBABLE TYPOS IN THE SOURCE PRICE LIST:
 *  - "Full Body Wax" Chocolate tier is printed as ₹200, which is lower than
 *    the Regular tier (₹1500) and looks like a misprint. Seeded as printed —
 *    fix in the admin panel once you confirm the real price.
 *  - "Trimming" under Hair Cutting is printed as ₹1000, unusually high next
 *    to other cuts — seeded as printed, double-check before going live.
 */
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Service = require('../models/Service');
const SiteContent = require('../models/SiteContent');

const services = [
  // ---------------- THREADWORK (skin) ----------------
  { name: 'Eyebrows Threading', description: 'Precise eyebrow shaping with thread.', category: 'skin', subcategory: 'Threadwork', price: 30, duration: 10 },
  { name: 'Forehead Threading', description: 'Forehead hair removal with thread.', category: 'skin', subcategory: 'Threadwork', price: 20, duration: 5 },
  { name: 'Upper Lips Threading', description: 'Upper lip hair removal with thread.', category: 'skin', subcategory: 'Threadwork', price: 20, duration: 5 },
  { name: 'Chin Threading', description: 'Chin hair removal with thread.', category: 'skin', subcategory: 'Threadwork', price: 30, duration: 5 },
  { name: 'Side Lock Threading', description: 'Side-lock area hair removal with thread.', category: 'skin', subcategory: 'Threadwork', price: 50, duration: 10 },
  { name: 'Full Face Threading', description: 'Complete face threading for a clean, polished look.', category: 'skin', subcategory: 'Threadwork', price: 180, duration: 20 },

  // ---------------- D-TAN (skin) ----------------
  { name: 'Ozone D-Tan', description: 'De-tanning treatment using Ozone products.', category: 'skin', subcategory: 'D-Tan', price: 250, duration: 30 },
  { name: 'Raga D-Tan', description: 'De-tanning treatment using Raga products.', category: 'skin', subcategory: 'D-Tan', price: 350, duration: 30 },
  { name: 'O3+ D-Tan', description: 'De-tanning treatment using O3+ products.', category: 'skin', subcategory: 'D-Tan', price: 400, duration: 30 },
  { name: 'Lotus D-Tan', description: 'De-tanning treatment using Lotus products.', category: 'skin', subcategory: 'D-Tan', price: 450, duration: 30 },
  { name: 'Natures D-Tan', description: 'De-tanning treatment using Natures products.', category: 'skin', subcategory: 'D-Tan', price: 200, duration: 30 },
  { name: 'Herbal D-Tan', description: 'De-tanning treatment using herbal products.', category: 'skin', subcategory: 'D-Tan', price: 250, duration: 30 },
  { name: 'Aries D-Tan', description: 'De-tanning treatment using Aries products.', category: 'skin', subcategory: 'D-Tan', price: 250, duration: 30 },
  { name: 'Oxy Glow D-Tan', description: 'De-tanning treatment using Oxy Glow products.', category: 'skin', subcategory: 'D-Tan', price: 250, duration: 30 },
  { name: 'Shahnaz D-Tan', description: 'De-tanning treatment using Shahnaz Husain products.', category: 'skin', subcategory: 'D-Tan', price: 400, duration: 30 },

  // ---------------- BODY SHINERS (skin) ----------------
  { name: 'Ammonia Free Bleach', description: 'Gentle, ammonia-free body bleach.', category: 'skin', subcategory: 'Body Shiners', price: 500, duration: 30 },
  { name: 'Back Bleach & Scrubbing', description: 'Bleach and scrub treatment for the back.', category: 'skin', subcategory: 'Body Shiners', price: 1000, duration: 45 },
  { name: 'Body Polishing', description: 'Full body polishing for smooth, glowing skin.', category: 'skin', subcategory: 'Body Shiners', price: 2000, priceLabel: 'to ₹5000 (based on area/package)', duration: 90 },
  { name: 'Arms Polishing', description: 'Polishing treatment for the arms.', category: 'skin', subcategory: 'Body Shiners', price: 600, duration: 30 },
  { name: 'Arms Scrubbing', description: 'Scrubbing treatment for the arms.', category: 'skin', subcategory: 'Body Shiners', price: 400, duration: 20 },

  // ---------------- CLEANUP (skin) ----------------
  { name: 'Fruit Cleanup', description: 'Refreshing fruit-based skin cleanup.', category: 'skin', subcategory: 'Cleanup', price: 400, duration: 30 },
  { name: 'Lotus Diamond Radiant Cleanup', description: 'Radiance-boosting cleanup using Lotus Diamond range.', category: 'skin', subcategory: 'Cleanup', price: 700, duration: 40 },
  { name: 'Lotus Gold Radiant Cleanup', description: 'Radiance-boosting cleanup using Lotus Gold range.', category: 'skin', subcategory: 'Cleanup', price: 700, duration: 40 },
  { name: 'VLCC Diamond Cleanup', description: 'Skin cleanup using VLCC Diamond range.', category: 'skin', subcategory: 'Cleanup', price: 800, duration: 40 },
  { name: 'VLCC Gold Cleanup', description: 'Skin cleanup using VLCC Gold range.', category: 'skin', subcategory: 'Cleanup', price: 800, duration: 40 },
  { name: 'Natures Gold Cleanup', description: 'Skin cleanup using Natures Gold range.', category: 'skin', subcategory: 'Cleanup', price: 600, duration: 40 },
  { name: 'Shahnaz Gold Cleanup', description: 'Skin cleanup using Shahnaz Gold range.', category: 'skin', subcategory: 'Cleanup', price: 1000, duration: 40 },
  { name: 'Shahnaz Diamond Cleanup', description: 'Skin cleanup using Shahnaz Diamond range.', category: 'skin', subcategory: 'Cleanup', price: 1100, duration: 40 },
  { name: 'O3+ Cleanup', description: 'Skin cleanup using O3+ range.', category: 'skin', subcategory: 'Cleanup', price: 1000, duration: 40 },
  { name: 'Lotus Professional Cleanup', description: 'Professional-grade cleanup using Lotus range.', category: 'skin', subcategory: 'Cleanup', price: 500, duration: 35 },
  { name: 'Whitening Cleanup', description: 'Brightening and whitening skin cleanup.', category: 'skin', subcategory: 'Cleanup', price: 500, duration: 35 },
  { name: 'Detox Cleanup', description: 'Detoxifying skin cleanup treatment.', category: 'skin', subcategory: 'Cleanup', price: 800, duration: 40 },
  { name: 'Ultra Glow Cleanup', description: 'Cleanup treatment for an instant glow.', category: 'skin', subcategory: 'Cleanup', price: 1000, duration: 40 },
  { name: 'Sensitive Care Cleanup', description: 'Gentle cleanup formulated for sensitive skin.', category: 'skin', subcategory: 'Cleanup', price: 1200, duration: 40 },
  { name: 'Add-On Mask', description: 'Add-on facial mask for any cleanup or facial.', category: 'skin', subcategory: 'Cleanup', price: 1500, duration: 15 },

  // ---------------- FACIALS (skin) ----------------
  { name: 'Fruit Facial with D-Tan', description: 'Fruit-based facial combined with de-tanning.', category: 'skin', subcategory: 'Facials', price: 600, duration: 45 },
  { name: 'Lotus Anti Aging Facial', description: 'Anti-ageing facial using the Lotus range.', category: 'skin', subcategory: 'Facials', price: 2500, duration: 60 },
  { name: 'Lotus 4 Layer Facial', description: 'Four-layer facial treatment from Lotus.', category: 'skin', subcategory: 'Facials', price: 2500, duration: 60 },
  { name: 'Lotus Gold Sheen Facial', description: 'Gold-infused radiance facial from Lotus.', category: 'skin', subcategory: 'Facials', price: 2000, duration: 60 },
  { name: 'Ozone Facial', description: 'Deep cleansing facial using Ozone range.', category: 'skin', subcategory: 'Facials', price: 3000, duration: 60 },
  { name: 'Ozone Anti-Aging Facial', description: 'Anti-ageing facial using Ozone range.', category: 'skin', subcategory: 'Facials', price: 2500, duration: 60 },
  { name: 'VLCC Gold Facial', description: 'Gold facial using the VLCC range.', category: 'skin', subcategory: 'Facials', price: 1500, duration: 60 },
  { name: 'O3+ Seaweed Facial', description: 'Nourishing seaweed facial from O3+.', category: 'skin', subcategory: 'Facials', price: 2500, duration: 60 },
  { name: 'Lotus Diamond Facial', description: 'Brightening diamond facial from Lotus.', category: 'skin', subcategory: 'Facials', price: 1200, duration: 60 },
  { name: 'Lotus Facial', description: 'Classic facial using the Lotus range.', category: 'skin', subcategory: 'Facials', price: 800, duration: 45 },
  { name: 'O3+ Power Brightening Treatment', description: 'Intensive brightening treatment from O3+.', category: 'skin', subcategory: 'Facials', price: 4000, duration: 75 },
  { name: 'Natures Gold Facial', description: 'Gold facial using the Natures range.', category: 'skin', subcategory: 'Facials', price: 1200, duration: 60 },
  { name: 'Lakme Perfect Radiance Facial', description: 'Radiance-boosting facial from Lakme.', category: 'skin', subcategory: 'Facials', price: 2000, duration: 60 },
  { name: 'Shahnaz Whitening Facial', description: 'Whitening facial using Shahnaz Husain range.', category: 'skin', subcategory: 'Facials', price: 1500, duration: 60 },
  { name: 'Shahnaz Gold Facial', description: 'Gold facial using Shahnaz Husain range.', category: 'skin', subcategory: 'Facials', price: 2000, duration: 60 },
  { name: 'Shahnaz Diamond Facial', description: 'Diamond facial using Shahnaz Husain range.', category: 'skin', subcategory: 'Facials', price: 2200, duration: 60 },
  { name: 'Lotus Radiance Gold Facial', description: 'Gold radiance facial from Lotus.', category: 'skin', subcategory: 'Facials', price: 1250, duration: 60 },
  { name: 'Whitening Facial', description: 'Skin-brightening whitening facial.', category: 'skin', subcategory: 'Facials', price: 1000, duration: 45 },
  { name: 'Anti-Aging Facial', description: 'General anti-ageing facial treatment.', category: 'skin', subcategory: 'Facials', price: 2000, duration: 60 },
  { name: 'O3+ Facial', description: 'Signature facial using the O3+ range.', category: 'skin', subcategory: 'Facials', price: 3500, duration: 60 },
  { name: 'Bridal Glow Facial', description: 'Facial designed to give brides a radiant glow.', category: 'skin', subcategory: 'Facials', price: 2500, duration: 75 },
  { name: 'Korean Glass Facial', description: 'Multi-step facial for dewy, "glass skin" finish.', category: 'skin', subcategory: 'Facials', price: 5000, duration: 90 },
  { name: 'HydraFacial', description: 'Deep hydrating and exfoliating facial treatment.', category: 'skin', subcategory: 'Facials', price: 3500, duration: 60 },

  // ---------------- WAXING (variants: Regular / Chocolate / Rica) ----------------
  { name: 'Full Hand Wax', description: 'Full hand waxing.', category: 'waxing', subcategory: 'Waxing', price: 200, duration: 20,
    variants: [{ label: 'Regular', price: 200 }, { label: 'Chocolate', price: 300 }, { label: 'Rica', price: 500 }] },
  { name: "Under Arm's Wax", description: 'Underarm waxing.', category: 'waxing', subcategory: 'Waxing', price: 100, duration: 10,
    variants: [{ label: 'Regular', price: 100 }, { label: 'Chocolate', price: 200 }, { label: 'Rica', price: 300 }] },
  { name: 'Full Leg Wax', description: 'Full leg waxing.', category: 'waxing', subcategory: 'Waxing', price: 400, duration: 30,
    variants: [{ label: 'Regular', price: 400 }, { label: 'Chocolate', price: 600 }, { label: 'Rica', price: 800 }] },
  { name: 'Half Leg Wax', description: 'Half leg waxing.', category: 'waxing', subcategory: 'Waxing', price: 200, duration: 20,
    variants: [{ label: 'Regular', price: 200 }, { label: 'Chocolate', price: 300 }, { label: 'Rica', price: 500 }] },
  { name: 'Full Body Wax', description: 'Full body waxing.', category: 'waxing', subcategory: 'Waxing', price: 1500, duration: 90,
    variants: [{ label: 'Regular', price: 1500 }, { label: 'Chocolate', price: 200 }, { label: 'Rica', price: 3500 }] },
  { name: 'Bikini Wax', description: 'Bikini area waxing.', category: 'waxing', subcategory: 'Waxing', price: 1000, duration: 20,
    variants: [{ label: 'Regular', price: 1000 }, { label: 'Chocolate', price: 2000 }, { label: 'Rica', price: 2500 }] },
  { name: 'Full Body + Bikini Wax', description: 'Full body waxing including bikini area.', category: 'waxing', subcategory: 'Waxing', price: 2000, duration: 110,
    variants: [{ label: 'Regular', price: 2000 }, { label: 'Chocolate', price: 3000 }, { label: 'Rica', price: 5000 }] },
  { name: 'Face Wax', description: 'Full face waxing.', category: 'waxing', subcategory: 'Waxing', price: 200, duration: 15,
    variants: [{ label: 'Regular', price: 200 }, { label: 'Chocolate', price: 400 }, { label: 'Rica', price: 600 }] },
  { name: 'Lip/Chin Wax', description: 'Lip and chin waxing.', category: 'waxing', subcategory: 'Waxing', price: 50, duration: 10,
    variants: [{ label: 'Regular', price: 50 }, { label: 'Chocolate', price: 100 }, { label: 'Rica', price: 200 }] },

  // ---------------- NAILS: HAND & FEET ----------------
  { name: 'Manicure (Regular)', description: 'Classic regular manicure.', category: 'nails', subcategory: 'Hand & Feet', price: 490, duration: 30 },
  { name: 'Pedicure (Regular)', description: 'Classic regular pedicure.', category: 'nails', subcategory: 'Hand & Feet', price: 590, duration: 40 },
  { name: 'Crystal Manicure', description: 'Manicure with crystal-infused treatment.', category: 'nails', subcategory: 'Hand & Feet', price: 690, duration: 40 },
  { name: 'Crystal Pedicure', description: 'Pedicure with crystal-infused treatment.', category: 'nails', subcategory: 'Hand & Feet', price: 790, duration: 45 },
  { name: 'Exclusive Manicure', description: 'Premium exclusive manicure treatment.', category: 'nails', subcategory: 'Hand & Feet', price: 990, duration: 45 },
  { name: 'Exclusive Pedicure', description: 'Premium exclusive pedicure treatment.', category: 'nails', subcategory: 'Hand & Feet', price: 1490, duration: 60 },
  { name: 'Luxurious Manicure', description: 'Top-tier luxurious manicure treatment.', category: 'nails', subcategory: 'Hand & Feet', price: 1490, duration: 60 },
  { name: 'Luxurious Pedicure', description: 'Top-tier luxurious pedicure treatment.', category: 'nails', subcategory: 'Hand & Feet', price: 1990, duration: 75 },
  { name: 'Hand Polishing', description: 'Polishing treatment for the hands.', category: 'nails', subcategory: 'Hand & Feet', price: 390, duration: 20 },
  { name: 'Leg Polishing', description: 'Polishing treatment for the legs.', category: 'nails', subcategory: 'Hand & Feet', price: 590, duration: 30 },

  // ---------------- NAIL EXTENSION + POLISH ----------------
  { name: 'Permanent Gel Polish (Hand & Feet)', description: 'Long-lasting gel polish for hands and feet.', category: 'nails', subcategory: 'Nail Extension & Polish', price: 800, duration: 45 },
  { name: 'French Permanent Gel Polish', description: 'French-style long-lasting gel polish.', category: 'nails', subcategory: 'Nail Extension & Polish', price: 900, duration: 45 },
  { name: 'Temporary Nail Extension', description: 'Temporary nail extensions.', category: 'nails', subcategory: 'Nail Extension & Polish', price: 1000, duration: 60 },
  { name: 'Permanent Nail Extension (Gel/Acrylic)', description: 'Long-lasting gel or acrylic nail extensions.', category: 'nails', subcategory: 'Nail Extension & Polish', price: 2500, duration: 90 },
  { name: 'Nail Extension Removal', description: 'Safe removal of existing nail extensions.', category: 'nails', subcategory: 'Nail Extension & Polish', price: 500, duration: 30 },
  { name: 'Gel Polish Removal', description: 'Removal of existing gel polish.', category: 'nails', subcategory: 'Nail Extension & Polish', price: 200, duration: 15 },

  // ---------------- HAIR CARE ----------------
  { name: 'Hair Wash', description: 'Basic hair wash service.', category: 'hair', subcategory: 'Hair Care', price: 200, duration: 20 },
  { name: 'Hair Wash with Setting', description: 'Hair wash followed by styling/setting.', category: 'hair', subcategory: 'Hair Care', price: 300, duration: 30 },
  { name: 'Hair Wash with Trimming', description: 'Hair wash followed by trimming.', category: 'hair', subcategory: 'Hair Care', price: 300, duration: 30 },

  // ---------------- HAIR CUTTING ----------------
  { name: 'Hair Cut (Normal)', description: 'Standard haircut.', category: 'hair', subcategory: 'Hair Cutting', price: 100, priceLabel: 'to ₹200', duration: 30 },
  { name: 'Trimming', description: 'Hair trimming service.', category: 'hair', subcategory: 'Hair Cutting', price: 1000, duration: 30 },
  { name: 'Advance Hair Cut', description: 'Advanced/styled haircut.', category: 'hair', subcategory: 'Hair Cutting', price: 400, duration: 45 },
  { name: 'Baby Hair Cut', description: 'Haircut for babies.', category: 'hair', subcategory: 'Hair Cutting', price: 150, duration: 15 },
  { name: 'U Hair Cut', description: 'U-shape layered haircut.', category: 'hair', subcategory: 'Hair Cutting', price: 150, duration: 30 },
  { name: 'Deep U Cut', description: 'Deep U-shape layered haircut.', category: 'hair', subcategory: 'Hair Cutting', price: 200, duration: 35 },
  { name: 'V Cut', description: 'V-shape layered haircut.', category: 'hair', subcategory: 'Hair Cutting', price: 150, duration: 30 },
  { name: 'Deep V Cut', description: 'Deep V-shape layered haircut.', category: 'hair', subcategory: 'Hair Cutting', price: 200, duration: 35 },
  { name: 'Front Layers', description: 'Front-layer haircut styling.', category: 'hair', subcategory: 'Hair Cutting', price: 100, duration: 20 },
  { name: 'Baby Cut', description: 'Simple cut styled for babies/kids.', category: 'hair', subcategory: 'Hair Cutting', price: 200, duration: 20 },

  // ---------------- HAIR SPA ----------------
  { name: 'Matrix Hair Spa', description: 'Hair spa treatment using Matrix products.', category: 'hair', subcategory: 'Hair Spa', price: 600, duration: 45 },
  { name: 'Loreal Hair Spa', description: "Hair spa treatment using L'Oreal products.", category: 'hair', subcategory: 'Hair Spa', price: 800, duration: 45 },
  { name: 'Keratin Hair Spa', description: 'Keratin-infused hair spa treatment.', category: 'hair', subcategory: 'Hair Spa', price: 1200, duration: 60 },
  { name: 'Spa Treatment', description: 'General hair spa treatment.', category: 'hair', subcategory: 'Hair Spa', price: 1200, duration: 60 },

  // ---------------- HAIR COLOR: HIGHLIGHTS ----------------
  { name: 'Highlights (per strip)', description: 'Hair highlighting, priced per strip.', category: 'hair', subcategory: 'Hair Color', price: 150, priceLabel: 'per strip, to ₹200', duration: 60 },

  // ---------------- ROOT TOUCHUP ----------------
  { name: 'Streax Root Touchup', description: 'Root touch-up using Streax color.', category: 'hair', subcategory: 'Root Touchup', price: 500, duration: 60 },
  { name: 'Matrix Root Touchup', description: 'Root touch-up using Matrix color.', category: 'hair', subcategory: 'Root Touchup', price: 700, duration: 60 },
  { name: 'Loreal Root Touchup', description: "Root touch-up using L'Oreal color.", category: 'hair', subcategory: 'Root Touchup', price: 1000, duration: 60 },

  // ---------------- FASHION COLOR ----------------
  { name: 'Full Highlights', description: 'Full-head highlighting.', category: 'hair', subcategory: 'Fashion Color', price: 2000, duration: 120 },
  { name: 'Highlights with Global Color', description: 'Highlights combined with a global color.', category: 'hair', subcategory: 'Fashion Color', price: 3500, duration: 150 },
  { name: 'Half Length Color', description: 'Color application for half hair length.', category: 'hair', subcategory: 'Fashion Color', price: 1500, duration: 90 },
  { name: 'Balayage', description: 'Hand-painted balayage color technique.', category: 'hair', subcategory: 'Fashion Color', price: 3500, duration: 150 },
  { name: 'Ombre', description: 'Ombre color technique.', category: 'hair', subcategory: 'Fashion Color', price: 3500, duration: 150 },
  { name: 'Streax Global Color', description: 'Full-head global color using Streax.', category: 'hair', subcategory: 'Fashion Color', price: 1500, duration: 90 },
  { name: 'Matrix Global Color', description: 'Full-head global color using Matrix.', category: 'hair', subcategory: 'Fashion Color', price: 2000, duration: 90 },
  { name: 'Loreal Global Color', description: "Full-head global color using L'Oreal.", category: 'hair', subcategory: 'Fashion Color', price: 3500, duration: 90 },
  { name: 'Cap Highlights', description: 'Highlighting using the cap technique.', category: 'hair', subcategory: 'Fashion Color', price: 2500, duration: 120 },

  // ---------------- HAIR TREATMENT ----------------
  { name: 'Keratin Treatment', description: 'Keratin smoothing hair treatment.', category: 'hair', subcategory: 'Hair Treatment', price: 3500, priceLabel: 'Onward', duration: 150 },
  { name: 'Smoothening Treatment', description: 'Hair smoothening treatment.', category: 'hair', subcategory: 'Hair Treatment', price: 4000, priceLabel: 'Onward', duration: 150 },
  { name: 'Rebounding Treatment', description: 'Hair rebonding treatment.', category: 'hair', subcategory: 'Hair Treatment', price: 4000, priceLabel: 'Onward', duration: 180 },
  { name: 'Botox Hair Treatment', description: 'Deep-conditioning hair botox treatment.', category: 'hair', subcategory: 'Hair Treatment', price: 5500, priceLabel: 'Onward', duration: 150 },

  // ---------------- MAKEUP & BRIDAL (from Richa Sharma's portfolio) ----------------
  // Note: travel charges apply outside the salon — ₹1,000 within city, ₹3,000 out of
  // city, out-of-station priced per city. Not baked into these prices; mention at booking.
  { name: 'Basic Party Makeup', description: 'Quick, soft and refreshing glam for simple occasions.', category: 'makeup', subcategory: 'Party Makeup', price: 2499, duration: 60 },
  { name: 'HD Party Makeup', description: 'Photo-ready base with defined eyes — perfect for parties & celebrations.', category: 'makeup', subcategory: 'Party Makeup', price: 3999, duration: 75 },
  { name: 'Airbrush Party Makeup', description: 'Long-lasting, sweat-proof makeup ideal for long events & outdoor functions.', category: 'makeup', subcategory: 'Party Makeup', price: 4999, duration: 90 },

  { name: 'Haldi Natural Look', description: 'Fresh, minimal and dewy makeup perfect for daytime haldi ceremonies.', category: 'makeup', subcategory: 'Haldi / Mehendi Makeup', price: 2999, duration: 60 },
  { name: 'HD Mehendi Look', description: 'Clean, bright and vibrant look ideal for mehendi celebrations.', category: 'makeup', subcategory: 'Haldi / Mehendi Makeup', price: 3999, duration: 75 },
  { name: 'Soft Glam Function Look', description: 'Light glam with subtle shimmer — best for pre-wedding daytime events.', category: 'makeup', subcategory: 'Haldi / Mehendi Makeup', price: 4999, duration: 90 },

  { name: 'Soft Glam Engagement', description: 'Fresh, natural and glowing look perfect for roka & engagement ceremonies.', category: 'makeup', subcategory: 'Engagement / Roka Makeup', price: 5999, duration: 90 },
  { name: 'HD Engagement', description: 'Smooth, flawless HD base with enhanced features — great for photos & videos.', category: 'makeup', subcategory: 'Engagement / Roka Makeup', price: 7999, duration: 105 },
  { name: 'Airbrush Engagement', description: 'Lightweight, long-lasting, waterproof look ideal for long ceremonies.', category: 'makeup', subcategory: 'Engagement / Roka Makeup', price: 9999, duration: 120 },
  { name: 'Signature Engagement Look', description: 'Premium, customised glam inspired by celebrity engagement looks.', category: 'makeup', subcategory: 'Engagement / Roka Makeup', price: 11999, duration: 150 },

  { name: 'HD Bridal Makeup', description: 'High-definition, flawless base with smooth coverage — ideal for photography, videography & long events.', category: 'makeup', subcategory: 'Bridal Makeup', price: 9999, duration: 120 },
  { name: '3D Bridal Makeup', description: 'Perfect contouring with depth & dimension, giving a naturally sculpted and radiant look.', category: 'makeup', subcategory: 'Bridal Makeup', price: 11999, duration: 150 },
  { name: 'HD Glossy Bridal Makeup', description: 'Flawless HD base with a soft glossy glow for a radiant, camera-ready bridal look.', category: 'makeup', subcategory: 'Bridal Makeup', price: 14999, duration: 150 },
  { name: 'Airbrush Bridal Makeup', description: 'Waterproof, lightweight and long-lasting makeup using airbrush technique for a radiant, sweat-proof finish.', category: 'makeup', subcategory: 'Bridal Makeup', price: 19999, duration: 180 },
  { name: 'Signature Bridal Makeup', description: 'Exclusive luxury bridal makeover curated personally — ultra-polished, timeless and red-carpet inspired.', category: 'makeup', subcategory: 'Bridal Makeup', price: 24999, duration: 210 },

  { name: 'HD Reception Look', description: 'Elegant evening glam with a flawless HD finish for stunning reception photos.', category: 'makeup', subcategory: 'Reception Makeup', price: 6999, duration: 90 },
  { name: 'Airbrush Reception', description: 'Smooth, waterproof and durable base for grand evening functions.', category: 'makeup', subcategory: 'Reception Makeup', price: 9999, duration: 120 },
  { name: 'Signature Reception Look', description: 'Rich, glamorous and luxurious makeover for a royal reception appearance.', category: 'makeup', subcategory: 'Reception Makeup', price: 14999, duration: 150 },

  { name: 'Corporate Makeup', description: 'Professional, clean and polished look suitable for shoots & business portraits.', category: 'makeup', subcategory: 'Corporate / Photoshoot Makeup', price: 4999, duration: 45 },
  { name: 'Outdoor Shoot Makeup', description: 'Smooth, flawless HD base with enhanced features — great for photos & videos.', category: 'makeup', subcategory: 'Corporate / Photoshoot Makeup', price: 7999, duration: 75 },

  // ---------------- COURSES (not slot-bookable) ----------------
  { name: 'Beautician Course – Basic to Advance', description: 'Specialization in hair, skin, and makeup service with certification as a Makeup Artist.', category: 'courses', subcategory: 'Beautician Course', price: 45000, durationLabel: '6 Months', bookable: false },
  { name: 'Certification in Makeup Course', description: 'Advance-level makeup certification course.', category: 'courses', subcategory: 'Certification Courses', price: 14999, durationLabel: '1 Month', bookable: false },
  { name: 'Certification in Hair Course', description: 'Advance-level hair certification course.', category: 'courses', subcategory: 'Certification Courses', price: 6999, durationLabel: '1 Month', bookable: false },
  { name: 'Certification in Nail Art Course', description: 'Advance-level nail art certification course.', category: 'courses', subcategory: 'Certification Courses', price: 2999, durationLabel: '10 Days', bookable: false },
  { name: 'Certification in HydraFacial Course', description: 'Advance-level HydraFacial certification course.', category: 'courses', subcategory: 'Certification Courses', price: 1999, durationLabel: '1 Day', bookable: false },
  { name: 'Certification in Airbrush Makeup Course', description: 'Advance-level airbrush makeup certification course.', category: 'courses', subcategory: 'Certification Courses', price: 2999, durationLabel: '1 Day', bookable: false },
];

const seedArpanData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Service.deleteMany({});
    const created = await Service.insertMany(services);
    console.log(`✅ ${created.length} services created`);

    // Update site content with Arpan's Beauty Zone details from the price list.
    // Uses upsert so it works whether or not a SiteContent doc already exists.
    await SiteContent.findOneAndUpdate(
      {},
      {
        heroTitle: "Welcome to Arpan's Beauty Zone",
        heroSubtitle: 'Salon & Academy — Hair, Skin, Makeup & Nails, crafted with high-quality, professional products.',
        aboutTitle: "About Arpan's Beauty Zone & Academy",
        aboutText:
          "Arpan's Beauty Zone & Academy is a professional salon, makeup studio, and training academy founded and led by Satyendra Kr Soni and Richa Sharma, a Professional Makeup & Nail Educator with 15+ years of experience since 2011. Having styled 200+ brides in the last year alone, Richa's expertise spans bridal artistry, nail art, and advanced beauty techniques, using premium products from MAC, Huda, NARS, Dior, Urban Decay, and Charlotte Tilbury. From HD and airbrush bridal looks to everyday hair, skin, and nail services, the goal is always flawless, long-lasting beauty and a relaxed, professional experience for every client and student.",
        contactPhone: '+91 8210551159',
        address: 'M.L Complex, Dharamshala Rd, Near V.L Square, Khilanganj, Laxkariganj, Sasaram, Bihar 821115',
        testimonials: [
          { name: 'Aditi Meena', review: 'Richa Mam\u2019s makeup looked exactly how I dreamed! Perfect makeup.', rating: 5 },
          { name: 'Shreya Singh', review: 'Her airbrush bridal makeup lasted the entire night. Highly recommended!', rating: 5 },
          { name: 'Ritika', review: 'Professional and talented. Best party makeup experience.', rating: 5 },
          { name: 'Poonam Kanak', review: 'Arpan\u2019s Beauty Zone understands what suits your face the best. Loved my engagement look!', rating: 5 },
          { name: 'Komal', review: 'She is truly a celebrity-level artist. My reception pictures came out stunning.', rating: 5 },
          { name: 'Nikita', review: 'Very gentle, on-time and perfect with details.', rating: 5 },
        ],
        socialLinks: {
          instagram: 'https://instagram.com',
          facebook: 'https://facebook.com',
          youtube: 'https://youtube.com',
        },
      },
      { upsert: true, new: true }
    );
    console.log('✅ Site content updated');

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

//seedArpanData();
if (require.main === module) {
  seedArpanData();
}

module.exports = services;