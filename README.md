# 💇 Glow & Glam — Premium Beauty Parlour MERN Stack App

A production-ready, full-stack beauty parlour booking website built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

---

## ✨ Features

### 🌐 Public Website
- **Homepage** — Hero banner, service showcase, testimonials, promotions
- **Services Page** — All services with category filter
- **Gallery** — Masonry gallery with lightbox, category filters
- **About Page** — Story, stats, team values
- **Contact Page** — Contact form with info
- **Booking Page** — 3-step booking flow with service selection, form, and payment

### 🔐 Authentication
- Register with name, phone, password
- Login with JWT token
- Role-based redirect (user / admin)
- Guest booking (no account required)

### 💰 Payments (Razorpay)
- Full payment or 30% partial advance
- Secure backend order creation & signature verification
- Booking confirmed only after payment

### 👑 Admin Dashboard (/admin)
- Dashboard with revenue, booking stats, recent bookings
- **Manage Services** — Add/Edit/Delete with image upload
- **Manage Bookings** — Filter by status/payment/date, approve/complete/cancel
- **Manage Gallery** — Upload/delete images with category tags
- **Site Content** — Edit hero, about, contact, social links

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo>
cd glow-glam
npm run install:all
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, Cloudinary keys, Razorpay keys
```

### 3. Configure Frontend
```bash
cd frontend
cp .env.example .env
# Add your VITE_API_URL and VITE_RAZORPAY_KEY_ID
```

### 4. Seed Database
```bash
npm run seed
```

### 5. Run Development
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

---

## 🔑 Default Credentials

| Role | Phone | Password |
|------|-------|----------|
| Admin | 9000000000 | admin123456 |

---

## 🏗️ Architecture

```
glow-glam/
├── backend/
│   ├── config/         # DB & Cloudinary config
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── seed.js         # Database seeder
│   ├── createAdmin.js  # Admin creator
│   └── server.js       # Entry point
│
└── frontend/
    └── src/
        ├── components/ # Reusable UI (Navbar, Footer, etc.)
        ├── context/    # Auth context
        ├── pages/      # Route pages
        │   ├── admin/  # Admin dashboard pages
        │   └── ...     # Public pages
        └── utils/      # API utility (axios)
```

## 📦 Database Models

| Model | Fields |
|-------|--------|
| User | name, phone, email, password (hashed), role |
| Service | name, description, category, duration, price, imageUrl |
| Booking | userId/guestInfo, serviceId, date, time, status, paymentStatus, amounts |
| Payment | bookingId, razorpayOrderId, amount, status, transactionId |
| Gallery | imageUrl, title, category, isPromotion |
| SiteContent | heroTitle/Subtitle/Image, aboutText, testimonials, promotions, contact |

## 🌍 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | 🔒 | Get current user |
| GET | /api/services | — | List services |
| POST | /api/services | 👑 Admin | Create service |
| PUT | /api/services/:id | 👑 Admin | Update service |
| DELETE | /api/services/:id | 👑 Admin | Delete service |
| POST | /api/bookings | Optional | Create booking |
| GET | /api/bookings/my | 🔒 | My bookings |
| GET | /api/bookings/admin | 👑 Admin | All bookings |
| PUT | /api/bookings/:id/status | 👑 Admin | Update booking status |
| POST | /api/payments/create-order | Optional | Create Razorpay order |
| POST | /api/payments/verify | Optional | Verify payment |
| GET | /api/gallery | — | Gallery items |
| POST | /api/gallery | 👑 Admin | Upload gallery image |
| GET | /api/site-content | — | Site content |
| PUT | /api/site-content | 👑 Admin | Update site content |
| GET | /api/admin/dashboard | 👑 Admin | Dashboard stats |

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add env variables (`VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`)

### Backend (Render)
1. Create a new Web Service on Render
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all env variables from `.env.example`

---

## 🎨 Design System

- **Colors**: Blush Pink (#F8C6C6), Gold (#C9A96E), Cream (#FDF8F0), Charcoal (#2D2D2D)
- **Fonts**: Playfair Display (serif headings) + Poppins (body)
- **Style**: Elegant, luxury feminine aesthetic

## 🔮 Future Roadmap

- [ ] Coupon / discount system
- [ ] Loyalty points
- [ ] Email/SMS booking confirmations
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Multi-branch support
- [ ] Appointment calendar view
- [ ] Staff management
