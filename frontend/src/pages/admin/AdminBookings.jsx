import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiFilter, FiCheck, FiX, FiEye, FiCreditCard, FiSmartphone, FiDollarSign, FiCopy } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/api';

const methodIcon  = { razorpay: <FiCreditCard size={14} />, upi: <FiSmartphone size={14} />, cash: <FiDollarSign size={14} /> };
const methodColor = { razorpay: 'text-blue-600 bg-blue-50', upi: 'text-green-600 bg-green-50', cash: 'text-yellow-600 bg-yellow-50' };
const methodLabel = { razorpay: 'Razorpay', upi: 'UPI', cash: 'Cash at Salon' };

const paymentStatusColor = {
  pending:   'bg-gray-100 text-gray-600',
  submitted: 'bg-amber-100 text-amber-700',
  captured:  'bg-green-100 text-green-700',
  failed:    'bg-red-100 text-red-600',
  refunded:  'bg-purple-100 text-purple-600',
};

const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="ml-1.5 text-gray-400 hover:text-gold transition-colors" title="Copy">
      {copied ? <span className="text-xs text-green-500">✓</span> : <FiCopy size={12} />}
    </button>
  );
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState({ status: '', paymentStatus: '', date: '' });
  const [selected, setSelected] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    const params = {};
    if (filters.status)        params.status        = filters.status;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters.date)          params.date          = filters.date;
    api.get('/bookings/admin', { params })
      .then(({ data }) => setBookings(data.bookings))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, [filters]);

  const updateStatus = async (id, updates) => {
    try {
      await api.put(`/bookings/${id}/status`, updates);
      toast.success('Booking updated');
      fetchBookings();
      setSelected(null);
    } catch {
      toast.error('Failed to update booking');
    }
  };

  const confirmUpiPayment = async (bookingId, paymentId) => {
    try {
      await api.put(`/payments/${paymentId}/confirm`);
      toast.success('Payment confirmed! Booking marked as confirmed.');
      fetchBookings();
      setSelected(null);
    } catch {
      toast.error('Failed to confirm payment');
    }
  };

  const statusClass  = { pending: 'badge-pending', confirmed: 'badge-confirmed', cancelled: 'badge-cancelled', completed: 'badge-completed' };
  const paymentClass = { unpaid: 'badge-unpaid', partial: 'badge-partial', paid: 'badge-paid' };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-charcoal">Manage Bookings</h1>
        <span className="text-sm text-gray-400">{bookings.length} bookings</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
        <FiFilter size={16} className="text-gray-400" />
        <select className="input-field !w-auto" value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}>
          <option value="">All Statuses</option>
          {['pending','confirmed','cancelled','completed'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input-field !w-auto" value={filters.paymentStatus} onChange={e => setFilters(p => ({ ...p, paymentStatus: e.target.value }))}>
          <option value="">All Payments</option>
          {['unpaid','partial','paid'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" className="input-field !w-auto" value={filters.date} onChange={e => setFilters(p => ({ ...p, date: e.target.value }))} />
        {(filters.status || filters.paymentStatus || filters.date) && (
          <button onClick={() => setFilters({ status:'', paymentStatus:'', date:'' })} className="text-sm text-red-500 hover:text-red-600">Clear Filters</button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                <tr>
                  {['Client', 'Service', 'Date & Time', 'Total', 'Paid', 'Method', 'Status', 'Payment', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50/50 text-sm">
                    <td className="px-4 py-4">
                      <div className="font-medium text-charcoal">{b.userId?.name || b.guestName || 'Guest'}</div>
                      <div className="text-xs text-gray-400">{b.userId?.phone || b.guestPhone}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-500">{b.serviceId?.name}</td>
                    <td className="px-4 py-4 text-gray-500">
                      <div>{new Date(b.date).toLocaleDateString('en-IN', { dateStyle: 'short' })}</div>
                      <div className="text-xs text-gray-400">{b.time}</div>
                    </td>
                    <td className="px-4 py-4 font-medium">₹{b.totalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-4 text-green-600">₹{b.amountPaid?.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      {b.payment ? (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${methodColor[b.payment.paymentMethod] || 'bg-gray-100 text-gray-500'}`}>
                          {methodIcon[b.payment.paymentMethod]}
                          {methodLabel[b.payment.paymentMethod] || b.payment.paymentMethod}
                        </span>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-4"><span className={statusClass[b.status]}>{b.status}</span></td>
                    <td className="px-4 py-4"><span className={paymentClass[b.paymentStatus]}>{b.paymentStatus}</span></td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => setSelected(b)} className="p-1.5 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-lg" title="View details"><FiEye size={15} /></button>
                        {b.status === 'pending' && (
                          <button onClick={() => updateStatus(b._id, { status: 'confirmed' })} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Confirm"><FiCheck size={15} /></button>
                        )}
                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                          <button onClick={() => updateStatus(b._id, { status: 'cancelled' })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Cancel"><FiX size={15} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-400">No bookings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-serif font-semibold text-charcoal">Booking Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Client Info */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Client</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  {[
                    ['Name',    selected.userId?.name  || selected.guestName  || 'Guest'],
                    ['Phone',   selected.userId?.phone || selected.guestPhone || '—'],
                    ['Email',   selected.userId?.email || selected.guestEmail || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-400">{k}</span>
                      <span className="font-medium text-charcoal">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Info */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Appointment</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  {[
                    ['Service', selected.serviceId?.name],
                    ['Date',    new Date(selected.date).toLocaleDateString('en-IN', { dateStyle: 'long' })],
                    ['Time',    selected.time],
                    ['Notes',   selected.notes || 'None'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-400">{k}</span>
                      <span className="font-medium text-charcoal text-right max-w-[60%]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  {[
                    ['Total Amount',  `₹${selected.totalAmount?.toLocaleString()}`],
                    ['Amount Paid',   `₹${selected.amountPaid?.toLocaleString()}`],
                    ['Amount Due',    `₹${selected.amountDue?.toLocaleString()}`],
                    ['Payment Status', selected.paymentStatus],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-400">{k}</span>
                      <span className="font-medium text-charcoal capitalize">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Info — the key new section */}
              {selected.payment ? (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Transaction Details</p>
                  <div className="border-2 border-gold/20 bg-gold/5 rounded-xl p-4 space-y-3 text-sm">

                    {/* Payment Method */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Method</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${methodColor[selected.payment.paymentMethod] || 'bg-gray-100'}`}>
                        {methodIcon[selected.payment.paymentMethod]}
                        {methodLabel[selected.payment.paymentMethod] || selected.payment.paymentMethod}
                      </span>
                    </div>

                    {/* Payment Status */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Txn Status</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${paymentStatusColor[selected.payment.status] || 'bg-gray-100'}`}>
                        {selected.payment.status}
                      </span>
                    </div>

                    {/* Transaction Ref (our internal ID) */}
                    {selected.payment.transactionRef && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Reference ID</span>
                        <span className="font-mono text-xs text-charcoal flex items-center">
                          {selected.payment.transactionRef}
                          <CopyBtn text={selected.payment.transactionRef} />
                        </span>
                      </div>
                    )}

                    {/* UTR / Razorpay Payment ID */}
                    {selected.payment.utrNumber ? (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-400 flex-shrink-0">
                          {selected.payment.paymentMethod === 'razorpay' ? 'Razorpay Pay ID' : 'UTR / Transaction ID'}
                        </span>
                        <span className="font-mono text-xs text-charcoal text-right flex items-center gap-1 ml-4 break-all">
                          {selected.payment.utrNumber}
                          <CopyBtn text={selected.payment.utrNumber} />
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">
                          {selected.payment.paymentMethod === 'upi' ? 'UTR / Transaction ID' : 'Transaction ID'}
                        </span>
                        <span className="text-amber-500 text-xs italic">Not submitted yet</span>
                      </div>
                    )}

                    {/* UPI submitted but not yet verified — show confirm button */}
                    {selected.payment.paymentMethod === 'upi' &&
                     selected.payment.status === 'submitted' &&
                     selected.payment.utrNumber && (
                      <div className="pt-2 border-t border-gold/20">
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg p-2.5 mb-3">
                          ⚠️ Customer has submitted UTR <strong>{selected.payment.utrNumber}</strong>. Please verify in your UPI app, then confirm.
                        </div>
                        <button
                          onClick={() => confirmUpiPayment(selected._id, selected.payment._id)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <FiCheck size={15} /> Confirm UPI Payment Received
                        </button>
                      </div>
                    )}

                    {/* Cash booking */}
                    {selected.payment.paymentMethod === 'cash' && (
                      <div className="text-xs text-yellow-700 bg-yellow-50 rounded-lg p-2.5">
                        💵 Cash payment — collect at salon on appointment day
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-center text-gray-400">
                  No payment record found for this booking
                </div>
              )}

              {/* Booking Status */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-400">Booking Status</span>
                <span className={`${statusClass[selected.status]} text-sm`}>{selected.status}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0 grid grid-cols-2 gap-3">
              {selected.status !== 'completed' && (
                <button
                  onClick={() => updateStatus(selected._id, { status: 'completed', paymentStatus: 'paid', amountPaid: selected.totalAmount })}
                  className="btn-primary text-sm py-2.5"
                >
                  ✓ Mark Complete & Paid
                </button>
              )}
              {selected.status === 'pending' && (
                <button onClick={() => updateStatus(selected._id, { status: 'confirmed' })} className="btn-secondary text-sm py-2.5">
                  Confirm Booking
                </button>
              )}
              {selected.status !== 'cancelled' && selected.status !== 'completed' && (
                <button
                  onClick={() => updateStatus(selected._id, { status: 'cancelled' })}
                  className="col-span-2 border border-red-200 text-red-500 hover:bg-red-50 text-sm py-2.5 rounded-xl transition-colors"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;