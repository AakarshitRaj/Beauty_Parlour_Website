import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiMenu, FiX, FiChevronDown, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const SERVICES = [
  { label: 'Skin', items: ['Facials', 'Body Care', 'Clean Up', 'Waxing', 'Everyday Essentials'] },
  { label: 'Hair', items: ['Haircut', 'Hair Color', 'Hair Spa', 'Hair Style', 'Texture'] },
  { label: 'Makeup', items: ['Party Makeup', 'Bridal Makeup', 'Outdoor Makeup', 'Saree Drape'] },
  { label: 'Hand & Feet', items: ['Manicure', 'Pedicure', 'Nail Art'] },
];

const NAV_LINKS = [
  { label: 'Services', mega: true },
  { label: 'Bridal', to: '/services?category=makeup' },
  { label: 'Offers', to: '/services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [megaOpen, setMegaOpen]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const megaRef                       = useRef(null);
  const { user, logout }              = useAuth();
  const navigate                      = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const serviceCategories = [
    { slug: 'facial', label: 'Facials' },
    { slug: 'hair',   label: 'Hair' },
    { slug: 'makeup', label: 'Makeup' },
    { slug: 'spa',    label: 'Spa' },
    { slug: 'nails',  label: 'Nails' },
  ];

  return (
    <>
      {/* ── Top Bar ────────────────────────────────────────── */}
      <div className="bg-black text-white text-xs py-2 px-6 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-5">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-300 transition-colors"><FiInstagram size={13} /></a>
          <a href="https://facebook.com"  target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors"><FiFacebook  size={13} /></a>
          {/* <a href="https://twitter.com"   target="_blank" rel="noreferrer" className="hover:text-sky-400  transition-colors"><FiTwitter   size={13} /></a>
          <a href="https://youtube.com"   target="_blank" rel="noreferrer" className="hover:text-red-400  transition-colors"><FiYoutube   size={13} /></a> */}
        </div>
        <p className="tracking-widest uppercase font-medium">✨ Luxury Beauty, Effortlessly Yours</p>
        <div className="flex items-center gap-6 text-gray-400">
          <span>Mon–Sat: 10AM – 8PM</span>
          <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
        </div>
      </div>

      {/* ── Main Navbar ─────────────────────────────────────── */}
      <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl lg:text-3xl font-serif font-bold tracking-tight text-gray-900">
                Arpan's Beauty Zone <span className="text-[#C9A96E]">&</span> Academy
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8" ref={megaRef}>
              {/* Services mega menu */}
              <div className="relative">
                <button
                  onMouseEnter={() => setMegaOpen(true)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#C9A96E] transition-colors py-2"
                >
                  Services <FiChevronDown size={14} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
                </button>

                {megaOpen && (
                  <div
                    onMouseLeave={() => setMegaOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[640px] bg-white shadow-2xl border-t-2 border-[#C9A96E] rounded-b-2xl p-8 grid grid-cols-4 gap-6 z-50"
                  >
                    {SERVICES.map(cat => (
                      <div key={cat.label}>
                        <p className="text-xs font-bold text-[#C9A96E] uppercase tracking-widest mb-3">{cat.label}</p>
                        <ul className="space-y-2">
                          {cat.items.map(item => (
                            <li key={item}>
                              <Link
                                to={`/services?category=${cat.label.toLowerCase().replace(' & ', '_')}`}
                                onClick={() => setMegaOpen(false)}
                                className="text-sm text-gray-600 hover:text-[#C9A96E] hover:pl-1 transition-all"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="col-span-4 border-t border-gray-100 pt-4 mt-2 flex gap-4">
                      {serviceCategories.map(c => (
                        <Link
                          key={c.slug}
                          to={`/services?category=${c.slug}`}
                          onClick={() => setMegaOpen(false)}
                          className="flex-1 text-center text-xs font-medium bg-gray-50 hover:bg-[#C9A96E] hover:text-white text-gray-600 py-2 rounded-lg transition-all"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/services?category=makeup" className="text-sm font-medium text-gray-700 hover:text-[#C9A96E] transition-colors">Bridal</Link>
              <Link to="/gallery"                  className="text-sm font-medium text-gray-700 hover:text-[#C9A96E] transition-colors">Gallery</Link>
              <Link to="/contact"                  className="text-sm font-medium text-gray-700 hover:text-[#C9A96E] transition-colors">Contact</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">Admin</Link>
              )}
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button onClick={() => setSearchOpen(s => !s)} className="p-2 text-gray-500 hover:text-[#C9A96E] transition-colors">
                <FiSearch size={18} />
              </button>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/my-bookings" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#C9A96E] transition-colors">
                    <FiUser size={16} /> {user.name?.split(' ')[0]}
                  </Link>
                  <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#C9A96E] transition-colors">
                  <FiUser size={16} /> Login
                </Link>
              )}
              <Link
                to="/booking"
                className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#C9A96E] transition-all duration-300"
              >
                Book Appointment
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(o => !o)} className="lg:hidden p-2 text-gray-700">
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4">
              <input
                autoFocus
                type="text"
                placeholder="Search services..."
                className="w-full border border-gray-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-[#C9A96E]"
              />
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-6 space-y-4">
            <div>
              <p className="text-xs font-bold text-[#C9A96E] uppercase tracking-widest mb-2">Services</p>
              <div className="grid grid-cols-2 gap-2">
                {serviceCategories.map(c => (
                  <Link key={c.slug} to={`/services?category=${c.slug}`} onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-600 hover:text-[#C9A96E] py-1">
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/gallery" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-700 py-1">Gallery</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-700 py-1">Contact</Link>
            {user ? (
              <>
                <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-700 py-1">My Bookings</Link>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-sm text-purple-600 py-1">Admin Dashboard</Link>}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-sm text-red-500 py-1">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-700 py-1">Login / Register</Link>
            )}
            <Link to="/booking" onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-black text-white text-sm font-medium px-5 py-3 rounded-full mt-2">
              Book Appointment
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
