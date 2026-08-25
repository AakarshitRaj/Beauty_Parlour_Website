import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const serviceLinks = [
  { label: 'Luxury Facials',     to: '/services?category=skin'  },
  { label: 'Hair Styling',       to: '/services?category=hair'    },
  { label: 'Bridal Makeup',      to: '/services?category=makeup'  },
  { label: 'Aromatherapy Spa',   to: '/services?category=spa'     },
  { label: 'Manicure & Pedicure',to: '/services?category=nails'   },
  { label: 'Party Makeup',       to: '/services?category=makeup'  },
];

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300">

    {/* ── Main footer ── */}
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="inline-block mb-5">
            <span className="text-2xl font-serif font-bold text-white">
              Arpan's Beauty Zone <span className="text-[#C9A96E]">&</span> Academy
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Professional makeup artistry and beauty services in Sasaram. Specializing in bridal makeup, party makeup, HD makeup, airbrush makeup, and professional makeup training.
          </p>
          {/* Socials */}
          <div className="flex gap-3">
            {[
              { icon: FiInstagram, href: 'https://www.instagram.com/arpans_beauty_zone_ssm', label: 'Instagram' },
              { icon: FiFacebook,  href: 'https://www.facebook.com/richasatyasoni/',  label: 'Facebook'  },
              // { icon: FiTwitter,   href: 'https://twitter.com',   label: 'Twitter'   },
              // { icon: FiYoutube,   href: 'https://youtube.com',   label: 'YouTube'   },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                className="w-9 h-9 bg-white/10 hover:bg-[#C9A96E] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Our Services</h4>
          <ul className="space-y-3">
            {serviceLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-sm text-gray-400 hover:text-[#C9A96E] flex items-center gap-2 group transition-colors">
                  <span className="w-1 h-1 bg-[#C9A96E]/40 group-hover:bg-[#C9A96E] rounded-full flex-shrink-0 transition-colors" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { label: 'Book Appointment', to: '/booking'  },
              { label: 'Gallery',          to: '/gallery'  },
              { label: 'About Us',         to: '/contact'  },
              { label: 'Contact Us',       to: '/contact'  },
              { label: 'My Bookings',      to: '/my-bookings' },
              { label: 'Login / Register', to: '/login'    },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-sm text-gray-400 hover:text-[#C9A96E] flex items-center gap-2 group transition-colors">
                  <span className="w-1 h-1 bg-[#C9A96E]/40 group-hover:bg-[#C9A96E] rounded-full flex-shrink-0 transition-colors" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FiMapPin size={15} className="text-[#C9A96E] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-400"> Sasaram, Rohtas,<br />Bihar, India</span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone size={15} className="text-[#C9A96E] flex-shrink-0" />
              <a href="tel:+918210551159" className="text-sm text-gray-400 hover:text-[#C9A96E] transition-colors">+91 82105 51159</a>
            </li>
            {/* <li className="flex items-center gap-3">
              <FiMail size={15} className="text-[#C9A96E] flex-shrink-0" />
              <a href="mailto:arpansbeautyzone@gmail.com" className="text-sm text-gray-400 hover:text-[#C9A96E] transition-colors">arpansbeautyzone@gmail.com</a>
            </li> */}
          </ul>
          {/* Hours */}
          <div className="mt-6 bg-white/5 rounded-xl p-4">
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Working Hours</p>
            <p className="text-xs text-gray-400">Mon – Sat: 10:00 AM – 8:00 PM</p>
            <p className="text-xs text-gray-400">Sunday: 11:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>

    {/* ── Bottom bar ── */}
    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} Arpan's Beauty Zone & Academy. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-gray-500">
          <Link to="/privacy-policy"   className="hover:text-[#C9A96E] transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-[#C9A96E] transition-colors">Terms of Service</Link>
          <Link to="/refund-policy"    className="hover:text-[#C9A96E] transition-colors">Refund Policy</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
