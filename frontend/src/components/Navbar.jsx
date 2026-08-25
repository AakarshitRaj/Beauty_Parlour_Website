import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/booking', label: 'Book Now' },
    { to: '/contact', label: 'Contact' },
  ];

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className={`text-2xl font-serif font-bold tracking-wide ${transparent ? 'text-white' : 'text-charcoal'}`}>
              Arpan's Beauty Zone <span className="text-gold">&</span> Academy
            </span>
            
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                  transparent ? 'text-white hover:text-gold-light' : 'text-charcoal hover:text-gold'
                } ${location.pathname === link.to ? 'text-gold' : ''} ${link.label === 'Book Now' ? 'btn-primary !py-2 !px-6' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to="/admin" className={`text-sm font-medium ${transparent ? 'text-white hover:text-gold-light' : 'text-charcoal hover:text-gold'}`}>
                    Admin
                  </Link>
                )}
                <Link to="/my-bookings" className={`flex items-center gap-1.5 text-sm font-medium ${transparent ? 'text-white hover:text-gold-light' : 'text-charcoal hover:text-gold'}`}>
                  <FiCalendar size={16} />
                  My Bookings
                </Link>
                <button onClick={handleLogout} className={`flex items-center gap-1.5 text-sm font-medium ${transparent ? 'text-white hover:text-gold-light' : 'text-gray-500 hover:text-red-500'}`}>
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-medium ${transparent ? 'text-white hover:text-gold-light' : 'text-charcoal hover:text-gold'}`}>Login</Link>
                <Link to="/register" className="btn-primary !py-2 !px-5 text-sm">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden ${transparent ? 'text-white' : 'text-charcoal'}`}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-pink-light pb-6">
            <div className="flex flex-col gap-1 pt-4 px-2">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} className="px-4 py-3 text-charcoal hover:text-gold hover:bg-pink-light rounded-xl text-sm font-medium transition-colors">
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  {isAdmin && <Link to="/admin" className="px-4 py-3 text-gold hover:bg-pink-light rounded-xl text-sm font-medium">Admin Dashboard</Link>}
                  <Link to="/my-bookings" className="px-4 py-3 text-charcoal hover:text-gold hover:bg-pink-light rounded-xl text-sm font-medium">My Bookings</Link>
                  <button onClick={handleLogout} className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-3 text-charcoal hover:text-gold hover:bg-pink-light rounded-xl text-sm font-medium">Login</Link>
                  <Link to="/register" className="mx-4 mt-2 btn-primary text-center">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
