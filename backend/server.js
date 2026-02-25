const express        = require('express');
const mongoose       = require('mongoose');
const cors           = require('cors');
const dotenv         = require('dotenv');
const helmet         = require('helmet');
const mongoSanitize  = require('express-mongo-sanitize');
const xss            = require('xss-clean');
const rateLimit      = require('express-rate-limit');
const cookieParser   = require('cookie-parser');
const { globalErrorHandler } = require('./utils/errorHandler');

dotenv.config();

const app  = express();
const isProd = process.env.NODE_ENV === 'production';

// ─── 1. Force HTTPS in production ──────────────────────────────────────────
// Redirects any plain HTTP request to HTTPS so data is never sent unencrypted
if (isProd) {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// ─── 2. Helmet — secure HTTP headers ───────────────────────────────────────
// HSTS header tells browsers to ONLY use HTTPS for next 1 year
app.use(helmet({
  hsts: isProd ? {
    maxAge:            365 * 24 * 60 * 60, // 1 year in seconds
    includeSubDomains: true,
    preload:           true,
  } : false, // disable HSTS in development (would break http://localhost)
}));

// ─── 3. CORS — locked to your frontend domain only ─────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,   // REQUIRED — allows cookies to be sent cross-origin
  methods:     ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── 4. Cookie parser — reads httpOnly cookies ──────────────────────────────
app.use(cookieParser());

// ─── 5. Body parsers ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── 6. NoSQL Injection protection ─────────────────────────────────────────
app.use(mongoSanitize());

// ─── 7. XSS protection ─────────────────────────────────────────────────────
app.use(xss());

// ─── 8. Rate Limiters ───────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again in 15 minutes.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,                   // 20 attempts per 15 min — enough for normal use
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Too many messages sent. Please try again later.' },
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many payment requests. Please try again later.' },
});

app.use(globalLimiter);

// ─── 9. Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',             authLimiter,    require('./routes/authRoutes'));
app.use('/api/services',                         require('./routes/serviceRoutes'));
app.use('/api/bookings',                         require('./routes/bookingRoutes'));
app.use('/api/payments',         paymentLimiter, require('./routes/paymentRoutes'));
app.use('/api/gallery',                          require('./routes/galleryRoutes'));
app.use('/api/site-content',                     require('./routes/siteContentRoutes'));
app.use('/api/admin',                            require('./routes/adminRoutes'));
app.use('/api/payment-settings',                 require('./routes/paymentSettingsRoutes'));

// Contact — rate limit only POST (public form), not admin GET/PUT/DELETE
const contactRouter = require('./routes/contactRoutes');
app.use('/api/contact', (req, res, next) => {
  if (req.method === 'POST') return contactLimiter(req, res, next);
  next();
}, contactRouter);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'OK', message: 'Glow & Glam API is running' }));

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(globalErrorHandler);

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

module.exports = app;