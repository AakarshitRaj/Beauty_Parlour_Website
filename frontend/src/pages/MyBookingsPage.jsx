import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  pending:   'bg-amber-100  text-amber-700',
  confirmed: 'bg-green-100  text-green-700',
  cancelled: 'bg-red-100    text-red-600',
  completed: 'bg-gray-100   text-gray-600',
};

const PAYMENT_STYLES = {
  unpaid:  'bg-red-50    text-red-500',
  partial: 'bg-amber-50  text-amber-600',
  paid:    'bg-green-50  text-green-600',
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState('upcoming');
  const { user }                = useAuth();

  useEffect(() => {
    api.get('/bookings/my')
      .then(({ data }) => setBookings(data.bookings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = bookings.filter(b => new Date(b.date) >= now && b.status !== 'cancelled');
  const past     = bookings.filter(b => new Date(b.date) < now  || b.status === 'cancelled');
  const display  = tab === 'upcoming' ? upcoming : past;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10">
            <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.25em] uppercase mb-2">Your Account</p>
            <h1 className="text-4xl font-serif font-bold text-gray-900">My Bookings</h1>
            {user && <p className="text-gray-400 mt-1">Welcome back, {user.name}</p>}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {[
              { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
              { key: 'past',     label: `Past (${past.length})` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  tab === t.key ? 'bg-black text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Bookings */}
          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : display.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {tab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
              </h3>
              <p className="text-gray-400 mb-8">
                {tab === 'upcoming' ? 'Ready to treat yourself?' : 'Your booking history will appear here'}
              </p>
              <Link to="/services"
                className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-[#C9A96E] transition-colors">
                Browse Services <FiArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {display.map(b => (
                <div key={b._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex gap-4">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-16 h-16 bg-[#fdf6ee] rounded-xl flex flex-col items-center justify-center">
                        <span className="text-[#C9A96E] text-xs font-bold uppercase">
                          {new Date(b.date).toLocaleDateString('en-IN', { month: 'short' })}
                        </span>
                        <span className="text-gray-900 text-2xl font-bold leading-none">
                          {new Date(b.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{b.serviceId?.name || 'Service'}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1"><FiCalendar size={13} />{formatDate(b.date)}</span>
                          <span className="flex items-center gap-1"><FiClock size={13} />{b.time}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[b.status]}`}>
                            {b.status}
                          </span>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${PAYMENT_STYLES[b.paymentStatus]}`}>
                            {b.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-gray-900">₹{b.totalAmount?.toLocaleString()}</p>
                      {b.paymentStatus === 'partial' && (
                        <p className="text-xs text-amber-600 mt-0.5">₹{b.amountDue?.toLocaleString()} due at salon</p>
                      )}
                      {b.status === 'pending' && (
                        <p className="text-xs text-amber-500 mt-1">⏳ Awaiting confirmation</p>
                      )}
                      {b.status === 'confirmed' && (
                        <p className="text-xs text-green-500 mt-1">✓ Confirmed</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Book More CTA */}
          {!loading && display.length > 0 && (
            <div className="mt-8 text-center">
              <Link to="/services"
                className="inline-flex items-center gap-2 border-2 border-black text-black text-sm font-medium px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all">
                Book Another Appointment <FiArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyBookingsPage;
