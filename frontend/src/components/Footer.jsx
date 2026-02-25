import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const serviceLinks = [
    { label: 'Luxury Facials',      to: '/services?category=facial'  },
    { label: 'Hair Styling',         to: '/services?category=hair'    },
    { label: 'Bridal Makeup',        to: '/services?category=makeup'  },
    { label: 'Aromatherapy Spa',     to: '/services?category=spa'     },
    { label: 'Manicure & Pedicure',  to: '/services?category=nails'   },
    { label: 'Party Makeup',         to: '/services?category=makeup'  },
  ];

  const quickLinks = [
    ['/',         'Home'],
    ['/services', 'Services'],
    ['/about',    'About Us'],
    ['/gallery',  'Gallery'],
    ['/booking',  'Book Appointment'],
    ['/contact',  'Contact'],
  ];

  return (
    <footer className="bg-charcoal text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif text-white font-semibold mb-4">
              Glow <span className="text-gold">&</span> Glam
            </h3>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Where beauty meets luxury. Premium treatments curated for the modern woman.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="w-9 h-9 bg-gold/20 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all">
                <FiInstagram size={16} />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 bg-gold/20 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all">
                <FiFacebook size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 bg-gold/20 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all">
                <FiTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(([to, label]) => (
                <li key={to + label}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services — now clickable links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-gold transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 bg-gold/40 rounded-full group-hover:bg-gold transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-400">
                <FiMapPin className="text-gold mt-0.5 flex-shrink-0" size={16} />
                <span>123 Beauty Lane, Bandra West, Mumbai, Maharashtra 400050</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <FiPhone className="text-gold flex-shrink-0" size={16} />
                <a href="tel:+919876543210" className="hover:text-gold">+91 98765 43210</a>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <FiMail className="text-gold flex-shrink-0" size={16} />
                <a href="mailto:hello@glowglam.com" className="hover:text-gold">hello@glowglam.com</a>
              </li>
            </ul>
            <div className="mt-5 text-xs text-gray-500 space-y-1">
              <p>Mon – Sat: 10:00 AM – 8:00 PM</p>
              <p>Sunday: 11:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Glow & Glam. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/privacy-policy"   className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-gold transition-colors">Terms of Service</Link>
            <Link to="/refund-policy"    className="hover:text-gold transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;