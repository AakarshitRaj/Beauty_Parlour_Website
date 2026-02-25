import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiTag } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/bookings/my')
      .then(({ data }) => setBookings(data.bookings))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusClass = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    cancelled: 'badge-cancelled',
    completed: 'badge-completed',
  };

  const paymentClass = {
    unpaid: 'badge-unpaid',
    partial: 'badge-partial',
    paid: 'badge-paid',
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-4xl font-serif font-bold text-charcoal">My Bookings</h1>
            <p className="text-gray-500 mt-2">Welcome back, {user?.name}! Here are your appointments.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">No Bookings Yet</h3>
              <p className="text-gray-400 mb-8">You haven't made any appointments. Let's fix that!</p>
              <Link to="/booking" className="btn-primary">Book Your First Appointment</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif font-semibold text-charcoal text-lg mb-2">
                        {booking.serviceId?.name || 'Service'}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar size={14} />
                          <span>{new Date(booking.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FiClock size={14} />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FiTag size={14} />
                          <span>₹{booking.totalAmount?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={statusClass[booking.status]}>{booking.status}</span>
                      <span className={paymentClass[booking.paymentStatus]}>{booking.paymentStatus}</span>
                    </div>
                  </div>
                  {booking.paymentStatus === 'partial' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                      <span className="text-gray-400">Paid: ₹{booking.amountPaid?.toLocaleString()}</span>
                      <span className="text-amber-600 font-medium">Balance Due: ₹{booking.amountDue?.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyBookingsPage;
