import { useLocation, Link } from 'react-router-dom';
import { FiCheck, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookingSuccessPage = () => {
  const { state } = useLocation();
  const booking   = state?.booking;
  const service   = state?.service;

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-6 text-center">

          {/* Success icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-green-500" size={44} />
          </div>

          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Booking Confirmed!</h1>
          <p className="text-gray-500 text-lg mb-10">
            Thank you for booking with Arpan's Beauty Zone & Academy. We look forward to seeing you!
          </p>

          {/* Booking Details Card */}
          {booking && service && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 mb-8 text-left">
              <h2 className="font-serif font-semibold text-lg text-gray-900 mb-5 flex items-center gap-2">
                📋 Booking Details
              </h2>
              <div className="space-y-4">
                {[
                  ['Service',    service.name],
                  ['Date',       new Date(booking.date).toLocaleDateString('en-IN', { dateStyle: 'full' })],
                  ['Time',       booking.time],
                  ['Total',      `₹${booking.totalAmount?.toLocaleString()}`],
                  ['Paid Now',   `₹${booking.amountPaid?.toLocaleString()}`],
                  ['Due at Salon', booking.amountDue > 0 ? `₹${booking.amountDue?.toLocaleString()}` : '—'],
                  ['Status',     booking.status],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-400">{k}</span>
                    <span className={`text-sm font-medium ${k === 'Status' ? 'capitalize text-green-600' : 'text-gray-800'}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-[#fdf6ee] rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><span className="text-[#C9A96E] mt-0.5">✓</span> Our team will confirm your appointment shortly</li>
              <li className="flex items-start gap-2"><span className="text-[#C9A96E] mt-0.5">✓</span> Arrive 10 minutes before your scheduled time</li>
              <li className="flex items-start gap-2"><span className="text-[#C9A96E] mt-0.5">✓</span> Please inform us 24hrs in advance if you need to reschedule</li>
              {booking?.amountDue > 0 && (
                <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">₹</span> Remaining payment of ₹{booking.amountDue?.toLocaleString()} is due at the salon</li>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-bookings"
              className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-[#C9A96E] transition-colors">
              <FiCalendar size={16} /> View My Bookings
            </Link>
            <Link to="/services"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 text-sm font-semibold px-8 py-4 rounded-full hover:border-black hover:text-black transition-all">
              Browse More Services <FiArrowRight size={14} />
            </Link>
          </div>

          {/* Contact */}
          <p className="text-sm text-gray-400 mt-10">
            Questions? Call us at{' '}
            <a href="tel:+919876543210" className="text-[#C9A96E] font-medium hover:underline">+91 98765 43210</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingSuccessPage;
