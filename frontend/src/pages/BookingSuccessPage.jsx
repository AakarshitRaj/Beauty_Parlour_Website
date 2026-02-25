import { useLocation, Link } from 'react-router-dom';
import { FiCheck, FiCalendar, FiHome } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookingSuccessPage = () => {
  const { state } = useLocation();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-32 pb-20 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl p-10 shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiCheck className="text-white" size={36} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-charcoal mb-3">Booking Confirmed!</h1>
            <p className="text-gray-500 mb-8">
              Your appointment has been successfully booked and payment received. We look forward to seeing you!
            </p>

            {state?.service && (
              <div className="bg-pink-light/50 rounded-2xl p-6 text-left mb-8">
                <h3 className="font-semibold text-charcoal mb-3">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service</span>
                    <span className="font-medium">{state.service.name}</span>
                  </div>
                  {state.booking?.date && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium">{new Date(state.booking.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
                    </div>
                  )}
                  {state.booking?.time && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time</span>
                      <span className="font-medium">{state.booking.time}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="text-green-600 font-medium">✓ Confirmed</span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-400 mb-8 bg-gold/10 rounded-xl p-4">
              📍 <strong>123 Beauty Lane, Bandra West, Mumbai</strong><br />
              Please arrive 10 minutes early. Call us at +91 98765 43210 if you need to reschedule.
            </p>

            <div className="flex gap-4">
              <Link to="/my-bookings" className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm">
                <FiCalendar size={14} /> My Bookings
              </Link>
              <Link to="/" className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm">
                <FiHome size={14} /> Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingSuccessPage;
