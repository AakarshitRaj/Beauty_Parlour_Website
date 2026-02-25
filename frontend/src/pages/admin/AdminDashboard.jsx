import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiList, FiDollarSign, FiMail } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/api';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-serif font-bold text-charcoal">{value}</p>
      </div>
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [unreadMsgs, setUnreadMsgs] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/contact', { params: { status: 'unread' } }),
    ])
      .then(([dashRes, msgRes]) => {
        setData(dashRes.data);
        setUnreadMsgs(msgRes.data.messages?.length || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  const { stats, recentBookings } = data || {};

  const statusClass = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    cancelled: 'badge-cancelled',
    completed: 'badge-completed',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-charcoal">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard icon={FiCalendar} label="Total Bookings"   value={stats?.totalBookings || 0}                          color="bg-gold" />
        <StatCard icon={FiUsers}    label="Total Clients"    value={stats?.totalUsers || 0}                             color="bg-pink-dark" />
        <StatCard icon={FiList}     label="Active Services"  value={stats?.totalServices || 0}                          color="bg-purple-500" />
        <StatCard icon={FiDollarSign} label="Total Revenue"  value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}  color="bg-green-500" />
      </div>

      {/* Unread messages alert */}
      {unreadMsgs > 0 && (
        <Link to="/admin/messages"
          className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 hover:bg-red-100 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiMail size={22} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-red-700">
                {unreadMsgs} unread contact {unreadMsgs === 1 ? 'message' : 'messages'}
              </p>
              <p className="text-sm text-red-400">Click to view and reply</p>
            </div>
          </div>
          <span className="text-red-400 group-hover:text-red-600 text-sm font-medium">View →</span>
        </Link>
      )}

      {/* Booking Status Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending', count: stats?.pendingBookings || 0, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Confirmed', count: stats?.confirmedBookings || 0, color: 'text-green-600 bg-green-50' },
          { label: 'Completed', count: stats?.completedBookings || 0, color: 'text-blue-600 bg-blue-50' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-5 text-center`}>
            <div className="text-2xl font-bold">{s.count}</div>
            <div className="text-sm font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-serif font-semibold text-charcoal">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sm text-gold hover:text-gold-dark">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                {['Client', 'Service', 'Date & Time', 'Amount', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(recentBookings || []).map(booking => (
                <tr key={booking._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm text-charcoal font-medium">
                    {booking.userId?.name || booking.guestName || 'Guest'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{booking.serviceId?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(booking.date).toLocaleDateString('en-IN', { dateStyle: 'short' })} • {booking.time}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-charcoal">₹{booking.totalAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={statusClass[booking.status]}>{booking.status}</span>
                  </td>
                </tr>
              ))}
              {(!recentBookings || recentBookings.length === 0) && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
