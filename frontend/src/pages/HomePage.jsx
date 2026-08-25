// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { FiArrowRight, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import api from '../utils/api';

// // ── Hero Slides ──────────────────────────────────────────────────────────────
// // `to` uses the real category ids from the Service model: hair, skin, nails,
// // waxing, makeup, spa, courses, other.
// const SLIDES = [
//   {
//     img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=85',
//     tag: 'Premium Hair Services',
//     title: 'Hair That Tells\nYour Story',
//     sub: 'From cuts to colours — expert stylists at your service',
//     cta: 'Book Hair Service',
//     to: '/services?category=hair',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=85',
//     tag: 'Luxury Skincare',
//     title: 'Glow From\nWithin',
//     sub: 'Advanced facials and skin treatments tailored for you',
//     cta: 'View Facials',
//     to: '/services?category=skin',
//   },
// ];

// // ── Service Category Cards ────────────────────────────────────────────────────
// const CATEGORIES = [
//   { slug: 'skin',   label: 'Skin & Facials',   img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500&q=80' },
//   { slug: 'hair',   label: 'Hair Services',     img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80' },
//   { slug: 'makeup', label: 'Makeup & Bridal',   img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80' },
//   { slug: 'waxing', label: 'Waxing',            img: 'https://images.unsplash.com/photo-1596178060810-72660ee8a555?w=500&q=80' },
//   { slug: 'nails',  label: 'Nail Studio',       img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80' },
// ];

// // ── Innovation Services ───────────────────────────────────────────────────────
// const INNOVATIONS = [
//   { label: 'Luxury Facials',      img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80', to: '/services?category=skin'   },
//   { label: 'Bridal Packages',     img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80', to: '/services?category=makeup' },
//   { label: 'Hair Transformation', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', to: '/services?category=hair'   },
//   { label: 'Waxing & Threading',  img: 'https://images.unsplash.com/photo-1596178060810-72660ee8a555?w=600&q=80', to: '/services?category=waxing' },
//   { label: 'Nail Art Studio',     img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', to: '/services?category=nails'  },
// ];

// // ── Default Testimonials ──────────────────────────────────────────────────────
// const DEFAULT_TESTIMONIALS = [
//   { name: 'Priya Sharma',   rating: 5, review: 'Absolutely love this place! The bridal makeup they did for my wedding was stunning. Everyone complimented me all day.' },
//   { name: 'Anjali Mehta',   rating: 5, review: 'Best hair spa I\'ve ever had. My hair feels incredibly soft and healthy. Will definitely be coming back!' },
//   { name: 'Sunita Kapoor',  rating: 5, review: 'The facial treatment was so relaxing. My skin looks radiant and fresh. The staff is professional and warm.' },
//   { name: 'Neha Gupta',     rating: 5, review: 'Got my mehndi done here before my wedding. Absolutely beautiful work. Highly recommend for all bridal services!' },
// ];

// // ── Star Row ─────────────────────────────────────────────────────────────────
// const Stars = ({ n = 5 }) => (
//   <div className="flex gap-0.5">
//     {[1,2,3,4,5].map(s => (
//       <FiStar key={s} size={14}
//         className={s <= n ? 'text-[#C9A96E]' : 'text-gray-200'}
//         style={{ fill: s <= n ? '#C9A96E' : 'none' }}
//       />
//     ))}
//   </div>
// );

// // ── Tab Bar ───────────────────────────────────────────────────────────────────
// // Keys here must match the Service model's `category` enum exactly
// // (hair, skin, nails, waxing, makeup, spa, courses, other) — not display labels.
// const TABS = ['All Services', 'Skin & Facials', 'Hair', 'Makeup', 'Nails', 'Waxing'];
// const TAB_SLUGS = {
//   'All Services': '',
//   'Skin & Facials': 'skin',
//   'Hair': 'hair',
//   'Makeup': 'makeup',
//   'Nails': 'nails',
//   'Waxing': 'waxing',
// };

// // Lowest price for a service, accounting for multi-tier variants (e.g. Waxing)
// const startingPrice = (s) => {
//   if (s.variants && s.variants.length > 0) {
//     return Math.min(...s.variants.map(v => v.price));
//   }
//   return s.price;
// };

// const HomePage = () => {
//   const [slide, setSlide]           = useState(0);
//   const [services, setServices]     = useState([]);
//   const [tab, setTab]               = useState('All Services');
//   const [testimonials, setTest]     = useState(DEFAULT_TESTIMONIALS);
//   const [testIdx, setTestIdx]       = useState(0);
//   const slideRef                    = useRef(null);

//   // Auto-advance hero
//   useEffect(() => {
//     const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
//     return () => clearInterval(t);
//   }, []);

//   // Auto-advance testimonials
//   useEffect(() => {
//     const t = setInterval(() => setTestIdx(i => (i + 1) % testimonials.length), 4000);
//     return () => clearInterval(t);
//   }, [testimonials.length]);

//   // Fetch services and site content
//   useEffect(() => {
//     api.get('/services').then(({ data }) => setServices(data.services || [])).catch(() => {});
//     api.get('/site-content').then(({ data }) => {
//       if (data.content?.testimonials?.length) setTest(data.content.testimonials);
//     }).catch(() => {});
//   }, []);

//   const filteredServices = services.filter(s => {
//     const slug = TAB_SLUGS[tab];
//     if (!slug) return true;
//     return s.category === slug;
//   }).slice(0, 8);

//   const prev = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length);
//   const next = () => setSlide(s => (s + 1) % SLIDES.length);

//   return (
//     <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
//       <Navbar />

//       {/* ── Hero Slider ──────────────────────────────────────── */}
//       <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-gray-900">
//         {SLIDES.map((sl, i) => (
//           <div
//             key={i}
//             className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
//           >
//             <img src={sl.img} alt={sl.title} className="w-full h-full object-cover" />
//             <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
//           </div>
//         ))}

//         {/* Slide content */}
//         <div className="relative z-10 h-full flex items-center">
//           <div className="max-w-7xl mx-auto px-8 lg:px-16 w-full">
//             <div className="max-w-2xl">
//               <span className="inline-block text-[#C9A96E] text-xs font-semibold tracking-[0.3em] uppercase mb-5 border border-[#C9A96E]/40 px-4 py-1.5 rounded-full">
//                 {SLIDES[slide].tag}
//               </span>
//               <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight whitespace-pre-line">
//                 {SLIDES[slide].title}
//               </h1>
//               <p className="text-white/70 text-lg mb-10 leading-relaxed">{SLIDES[slide].sub}</p>
//               <div className="flex flex-wrap gap-4">
//                 <Link to={SLIDES[slide].to}
//                   className="bg-[#C9A96E] text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-[#b8935a] transition-all flex items-center gap-2 group">
//                   {SLIDES[slide].cta}
//                   <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//                 </Link>
//                 <Link to="/booking"
//                   className="border border-white/50 text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all">
//                   Book Appointment
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Arrows */}
//         <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
//           <FiChevronLeft size={20} />
//         </button>
//         <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
//           <FiChevronRight size={20} />
//         </button>

//         {/* Dots */}
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
//           {SLIDES.map((_, i) => (
//             <button key={i} onClick={() => setSlide(i)}
//               className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-8 bg-[#C9A96E]' : 'w-1.5 bg-white/40'}`} />
//           ))}
//         </div>
//       </section>

//       {/* ── Category Quick Links ─────────────────────────────── */}
//       <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {CATEGORIES.map(cat => (
//             <Link key={cat.slug} to={`/services?category=${cat.slug}`}
//               className="group relative overflow-hidden rounded-2xl aspect-[3/4] block">
//               <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
//               <div className="absolute bottom-0 left-0 right-0 p-4">
//                 <p className="text-white font-semibold text-sm">{cat.label}</p>
//                 <p className="text-[#C9A96E] text-xs flex items-center gap-1 mt-1 group-hover:gap-2 transition-all">
//                   Explore <FiArrowRight size={11} />
//                 </p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* ── Innovation Services (like Lakme's section) ───────── */}
//       <section className="bg-gray-50 py-16">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <div className="flex items-end justify-between mb-10">
//             <div>
//               <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.25em] uppercase mb-2">Our Specialities</p>
//               <h2 className="text-4xl font-serif font-bold text-gray-900">Signature Services</h2>
//             </div>
//             <Link to="/services" className="text-sm font-medium text-gray-500 hover:text-[#C9A96E] flex items-center gap-1 transition-colors">
//               More Services <FiArrowRight size={14} />
//             </Link>
//           </div>
//           <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
//             {INNOVATIONS.map(item => (
//               <Link key={item.label} to={item.to}
//                 className="group flex-shrink-0 w-56 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
//                 <div className="h-48 overflow-hidden">
//                   <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                 </div>
//                 <div className="p-4 flex items-center justify-between">
//                   <p className="font-medium text-sm text-gray-800">{item.label}</p>
//                   <div className="w-7 h-7 bg-[#C9A96E]/10 group-hover:bg-[#C9A96E] rounded-full flex items-center justify-center transition-colors">
//                     <FiArrowRight size={12} className="text-[#C9A96E] group-hover:text-white transition-colors" />
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Services Tab Section (like Lakme's product spotlight) */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <div className="text-center mb-10">
//             <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.25em] uppercase mb-2">What We Offer</p>
//             <h2 className="text-4xl font-serif font-bold text-gray-900">Our Services</h2>
//           </div>

//           {/* Tabs */}
//           <div className="flex gap-2 mb-8 overflow-x-auto pb-1 justify-center">
//             {TABS.map(t => (
//               <button key={t} onClick={() => setTab(t)}
//                 className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
//                   tab === t ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}>
//                 {t}
//               </button>
//             ))}
//           </div>

//           {/* Service Cards */}
//           {filteredServices.length > 0 ? (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {filteredServices.map(s => (
//                 <Link
//                   key={s._id}
//                   to={s.bookable === false ? '/contact' : `/booking?service=${s._id}`}
//                   className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
//                 >
//                   {s.imageUrl ? (
//                     <div className="h-44 overflow-hidden bg-gray-100">
//                       <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                     </div>
//                   ) : (
//                     <div className="h-44 bg-gradient-to-br from-[#f9f3ea] to-[#f0e6d3] flex items-center justify-center">
//                       <span className="text-4xl">✨</span>
//                     </div>
//                   )}
//                   <div className="p-4">
//                     <p className="text-xs text-[#C9A96E] font-medium uppercase tracking-wide mb-1">{s.subcategory || s.category}</p>
//                     <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{s.name}</h3>
//                     <div className="flex items-center justify-between">
//                       <span className="text-base font-bold text-gray-900">
//                         {s.variants?.length > 0 ? 'From ' : ''}₹{startingPrice(s)?.toLocaleString()}
//                         {s.priceLabel ? ` ${s.priceLabel}` : ''}
//                       </span>
//                       <span className="text-xs text-gray-400">
//                         {s.bookable === false ? (s.durationLabel || 'Enquire') : `${s.duration} min`}
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {CATEGORIES.map(cat => (
//                 <Link key={cat.slug} to={`/services?category=${cat.slug}`}
//                   className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
//                   <div className="h-44 overflow-hidden">
//                     <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                   </div>
//                   <div className="p-4 flex items-center justify-between">
//                     <h3 className="font-semibold text-gray-800 text-sm">{cat.label}</h3>
//                     <FiArrowRight size={14} className="text-[#C9A96E] group-hover:translate-x-1 transition-transform" />
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}

//           <div className="text-center mt-10">
//             <Link to="/services"
//               className="inline-flex items-center gap-2 border-2 border-black text-black text-sm font-semibold px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all">
//               View All Services <FiArrowRight size={14} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── Banner CTA ───────────────────────────────────────── */}
//       <section className="relative overflow-hidden bg-black">
//         <img
//           src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1600&q=80"
//           alt="Bridal"
//           className="w-full h-80 object-cover opacity-40"
//         />
//         <div className="absolute inset-0 flex items-center justify-center text-center px-6">
//           <div>
//             <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.3em] uppercase mb-4">Limited Slots Available</p>
//             <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6">Book Your Bridal Package</h2>
//             <Link to="/booking"
//               className="inline-flex items-center gap-2 bg-[#C9A96E] text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all">
//               Book Now <FiArrowRight size={14} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── Testimonials ─────────────────────────────────────── */}
//       <section className="py-20 bg-[#faf8f5]">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.25em] uppercase mb-2">Client Love</p>
//             <h2 className="text-4xl font-serif font-bold text-gray-900">What Our Clients Say</h2>
//           </div>
//           <div className="max-w-3xl mx-auto text-center relative">
//             <div className="text-7xl text-[#C9A96E]/20 font-serif leading-none mb-4">"</div>
//             <p className="text-xl text-gray-700 italic leading-relaxed mb-6">
//               {testimonials[testIdx]?.review}
//             </p>
//             <Stars n={testimonials[testIdx]?.rating || 5} />
//             <p className="mt-3 font-semibold text-gray-900">{testimonials[testIdx]?.name}</p>

//             {/* Dots */}
//             <div className="flex justify-center gap-2 mt-8">
//               {testimonials.map((_, i) => (
//                 <button key={i} onClick={() => setTestIdx(i)}
//                   className={`h-1.5 rounded-full transition-all ${i === testIdx ? 'w-8 bg-[#C9A96E]' : 'w-1.5 bg-gray-300'}`} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── Why Choose Us ────────────────────────────────────── */}
//       <section className="py-16 border-t border-gray-100">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             {[
//               { icon: '', label: 'Expert Stylists',    sub: 'Certified professionals' },
//               { icon: '', label: 'Premium Products',   sub: 'Only the best brands' },
//               { icon: '', label: 'Relaxing Ambiance',  sub: 'Your comfort first' },
//               { icon: '', label: '5-Star Rated',       sub: '500+ happy clients' },
//             ].map(item => (
//               <div key={item.label} className="group">
//                 <div className="text-4xl mb-3">{item.icon}</div>
//                 <p className="font-semibold text-gray-900 mb-1">{item.label}</p>
//                 <p className="text-sm text-gray-400">{item.sub}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default HomePage;

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiChevronLeft, FiChevronRight, FiUsers, FiAward, FiHeart } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

// ── Hero Slides ──────────────────────────────────────────────────────────────
// `to` uses the real category ids from the Service model: hair, skin, nails,
// waxing, makeup, spa, courses, other.
const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=85',
    tag: 'Premium Hair Services',
    title: 'Hair That Tells\nYour Story',
    sub: 'From cuts to colours — expert stylists at your service',
    cta: 'Book Hair Service',
    to: '/services?category=hair',
  },
  {
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=85',
    tag: 'Luxury Skincare',
    title: 'Glow From\nWithin',
    sub: 'Advanced facials and skin treatments tailored for you',
    cta: 'View Facials',
    to: '/services?category=skin',
  },
  //festivaloffer
//   {
//   img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1600&q=85',
//   tag: '🌿 Sawan Special',
//   title: 'Monsoon Glow\nSpecial',
//   sub: 'Celebrate Sawan with special offers on facials, skincare and beauty treatments',
//   cta: 'Explore Sawan Offers',
//   to: '/services?category=skin',
// },

];

// // ── Service Category Cards ────────────────────────────────────────────────────
// const CATEGORIES = [
//   { slug: 'skin',   label: 'Skin & Facials',   img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500&q=80' },
//   { slug: 'hair',   label: 'Hair Services',     img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80' },
//   { slug: 'makeup', label: 'Makeup & Bridal',   img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80' },
//   { slug: 'waxing', label: 'Waxing',            img: 'https://i.pinimg.com/1200x/1a/a7/b9/1aa7b9e9339f6dff465ed7f9dfd7c95c.jpg' },
//   { slug: 'nails',  label: 'Nail Studio',       img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80' },
// ];

// ── Signature Services (the site's single services showcase section) ────────
const INNOVATIONS = [
  {
    label: 'Luxury Facials',
    desc: 'Deep-cleansing treatments for radiant, glowing skin',
    img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=700&q=80',
    to: '/services?category=skin',
  },
  {
    label: 'Bridal Packages',
    desc: 'HD, airbrush & signature bridal makeovers',
    img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=700&q=80',
    to: '/services?category=makeup',
  },
  {
    label: 'Hair Transformation',
    desc: 'Cuts, colour, keratin & spa treatments',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80',
    to: '/services?category=hair',
  },
  {
    label: 'Waxing & Threading',
    desc: 'Smooth, flawless skin with premium wax',
    img: 'https://i.pinimg.com/1200x/1a/a7/b9/1aa7b9e9339f6dff465ed7f9dfd7c95c.jpg',
    to: '/services?category=waxing',
  },
  {
    label: 'Nail Art Studio',
    desc: 'Manicures, pedicures & nail extensions',
    img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700&q=80',
    to: '/services?category=nails',
  },
];

// ── Why Choose Us ─────────────────────────────────────────────────────────────
const WHY_US = [
  { Icon: FiUsers, label: 'Expert Stylists',  sub: 'Certified professionals' },
  { Icon: FiAward, label: 'Premium Products', sub: 'Only the best brands' },
  { Icon: FiHeart, label: 'Relaxing Ambiance', sub: 'Your comfort first' },
  { Icon: FiStar,  label: '5-Star Rated',     sub: '500+ happy clients' },
];

// ── Default Testimonials ──────────────────────────────────────────────────────
const DEFAULT_TESTIMONIALS = [
  { name: 'Priya Sharma',   rating: 5, review: 'Absolutely love this place! The bridal makeup they did for my wedding was stunning. Everyone complimented me all day.' },
  { name: 'Anjali Mehta',   rating: 5, review: 'Best hair spa I\'ve ever had. My hair feels incredibly soft and healthy. Will definitely be coming back!' },
  { name: 'Sunita Kapoor',  rating: 5, review: 'The facial treatment was so relaxing. My skin looks radiant and fresh. The staff is professional and warm.' },
  { name: 'Neha Gupta',     rating: 5, review: 'Got my mehndi done here before my wedding. Absolutely beautiful work. Highly recommend for all bridal services!' },
];

// ── Star Row ─────────────────────────────────────────────────────────────────
const Stars = ({ n = 5 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <FiStar key={s} size={14}
        className={s <= n ? 'text-[#C9A96E]' : 'text-gray-200'}
        style={{ fill: s <= n ? '#C9A96E' : 'none' }}
      />
    ))}
  </div>
);

const HomePage = () => {
  const [slide, setSlide]           = useState(0);
  const [testimonials, setTest]     = useState(DEFAULT_TESTIMONIALS);
  const [testIdx, setTestIdx]       = useState(0);
  const slideRef                    = useRef(null);

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance testimonials
  useEffect(() => {
    const t = setInterval(() => setTestIdx(i => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  // Fetch site content (testimonials)
  useEffect(() => {
    api.get('/site-content').then(({ data }) => {
      if (data.content?.testimonials?.length) setTest(data.content.testimonials);
    }).catch(() => {});
  }, []);

  const prev = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setSlide(s => (s + 1) % SLIDES.length);

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      <Navbar />
  

      {/* ── Hero Slider ──────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-gray-900">
        {SLIDES.map((sl, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={sl.img} alt={sl.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          </div>
        ))}

        {/* Slide content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-8 lg:px-16 w-full">
            <div className="max-w-2xl">
              <span className="inline-block text-[#C9A96E] text-xs font-semibold tracking-[0.3em] uppercase mb-5 border border-[#C9A96E]/40 px-4 py-1.5 rounded-full">
                {SLIDES[slide].tag}
              </span>
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight whitespace-pre-line">
                {SLIDES[slide].title}
              </h1>
              <p className="text-white/70 text-lg mb-10 leading-relaxed">{SLIDES[slide].sub}</p>
              <div className="flex flex-wrap gap-4">
                <Link to={SLIDES[slide].to}
                  className="bg-[#C9A96E] text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-[#b8935a] transition-all flex items-center gap-2 group">
                  {SLIDES[slide].cta}
                  <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/booking"
                  className="border border-white/50 text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all">
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
          <FiChevronLeft size={20} />
        </button>
        <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
          <FiChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-8 bg-[#C9A96E]' : 'w-1.5 bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* ── Category Quick Links ───────────────────────────────
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} to={`/services?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] block">
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold text-sm">{cat.label}</p>
                <p className="text-[#C9A96E] text-xs flex items-center gap-1 mt-1 group-hover:gap-2 transition-all">
                  Explore <FiArrowRight size={11} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section> */}

      {/* ── Signature Services (single, beautified services section) ───────── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div>
              <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.25em] uppercase mb-3">Our Specialities</p>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900">Signature Services</h2>
              <p className="text-gray-400 mt-3 max-w-md">Curated treatments our clients come back for, again and again.</p>
            </div>
            <Link to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 border-b-2 border-[#C9A96E] pb-1 hover:gap-3 transition-all self-start md:self-auto">
              View All Services <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {INNOVATIONS.map(item => (
              <Link key={item.label} to={item.to}
                className="group relative block rounded-3xl overflow-hidden aspect-[3/4] shadow-sm hover:shadow-2xl transition-all duration-500">
                <img src={item.img} alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className="text-white font-serif font-semibold text-lg leading-snug mb-1">{item.label}</p>
                  <p className="text-white/70 text-xs leading-relaxed mb-4 line-clamp-2">{item.desc}</p>
                  <div className="flex items-center gap-2 text-[#C9A96E] text-xs font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore <FiArrowRight size={12} />
                  </div>
                </div>

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#C9A96E] transition-colors duration-300">
                  <FiArrowRight size={14} className="text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services"
              className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-[#C9A96E] transition-all">
              View All Services <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Banner CTA ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1600&q=80"
          alt="Bridal"
          className="w-full h-80 object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.3em] uppercase mb-4">Limited Slots Available</p>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6">Book Your Bridal Package</h2>
            <Link to="/booking"
              className="inline-flex items-center gap-2 bg-[#C9A96E] text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all">
              Book Now <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.25em] uppercase mb-2">Client Love</p>
            <h2 className="text-4xl font-serif font-bold text-gray-900">What Our Clients Say</h2>
          </div>
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="text-7xl text-[#C9A96E]/20 font-serif leading-none mb-4">"</div>
            <p className="text-xl text-gray-700 italic leading-relaxed mb-6">
              {testimonials[testIdx]?.review}
            </p>
            <Stars n={testimonials[testIdx]?.rating || 5} />
            <p className="mt-3 font-semibold text-gray-900">{testimonials[testIdx]?.name}</p>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === testIdx ? 'w-8 bg-[#C9A96E]' : 'w-1.5 bg-gray-300'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────── */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.25em] uppercase mb-2">The Difference</p>
            <h2 className="text-4xl font-serif font-bold text-gray-900">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_US.map(({ Icon, label, sub }) => (
              <div key={label}
                className="group text-center px-6 py-10 rounded-2xl border border-gray-100 hover:border-[#C9A96E]/40 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#C9A96E]/10 flex items-center justify-center group-hover:bg-[#C9A96E] transition-colors duration-300">
                  <Icon size={24} className="text-[#C9A96E] group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="font-serif font-semibold text-gray-900 text-lg mb-1">{label}</p>
                <p className="text-sm text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;