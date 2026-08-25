import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiClock, FiCheck, FiCopy, FiSmartphone, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { user }       = useAuth();

  const [services,         setServices]         = useState([]);
  const [paymentConfig,    setPaymentConfig]    = useState(null);  // from backend
  const [selectedService,  setSelectedService]  = useState('');
  const [service,          setService]          = useState(null);
  const [loading,          setLoading]          = useState(false);
  const [step,             setStep]             = useState(1);     // 1 service 2 details 3 pay 4 upi-utr
  const [booking,          setBooking]          = useState(null);
  const [upiData,          setUpiData]          = useState(null);
  const [utrNumber,        setUtrNumber]        = useState('');
  const [submitting,       setSubmitting]       = useState(false);
  const [copied,           setCopied]           = useState(false);
  const [selectedMethod,   setSelectedMethod]   = useState('');    // 'razorpay' | 'upi' | 'cash'

  const [form, setForm] = useState({
    date: '', time: '',
    guestName:   user?.name  || '',
    guestPhone:  user?.phone || '',
    guestEmail:  user?.email || '',
    notes: '',
    paymentType: 'partial',
  });

  // Load services + payment settings
  useEffect(() => {
    Promise.all([
      api.get('/services'),
      api.get('/payment-settings'),
    ]).then(([svcRes, cfgRes]) => {
      setServices(svcRes.data.services);
      setPaymentConfig(cfgRes.data.settings);
      // Auto-select first enabled method
      const methods = cfgRes.data.settings.methods;
      const first = ['razorpay', 'upi', 'cash'].find(m => methods[m]?.enabled);
      if (first) setSelectedMethod(first);

      const pre = searchParams.get('service');
      if (pre) {
        setSelectedService(pre);
        const found = svcRes.data.services.find(s => s._id === pre);
        if (found) { setService(found); setStep(2); }
      }
    }).catch(console.error);
  }, []);

  const advancePercent = paymentConfig?.advancePercent || 30;
  const handleFormChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const calcAmount = () => {
    if (!service) return { total: 0, advance: 0 };
    const total   = service.price;
    const advance = form.paymentType === 'full' ? total : Math.ceil(total * advancePercent / 100);
    return { total, advance };
  };

  /* ── Step 2 submit: create booking ── */
  const handleBookingSubmit = async e => {
    e.preventDefault();
    if (!form.date || !form.time) { toast.error('Select date and time'); return; }
    if (!selectedMethod)          { toast.error('Select a payment method'); return; }
    setLoading(true);
    try {
      const payload = { serviceId: selectedService, date: form.date, time: form.time, notes: form.notes };
      if (!user) {
        if (!form.guestName || !form.guestPhone) { toast.error('Name and phone required'); setLoading(false); return; }
        payload.guestName = form.guestName; payload.guestPhone = form.guestPhone; payload.guestEmail = form.guestEmail;
      }
      const { data } = await api.post('/bookings', payload);
      setBooking(data.booking);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally { setLoading(false); }
  };

  /* ── Step 3: process payment by method ── */
  const handlePay = async () => {
    if (!booking) return;
    setLoading(true);
    const { advance } = calcAmount();
    try {

      // ── RAZORPAY ──────────────────────────────────────
      if (selectedMethod === 'razorpay') {
        const { data: order } = await api.post('/payments/create-order', {
          bookingId: booking._id, paymentType: form.paymentType, method: 'razorpay',
        });
        const options = {
          key:      order.keyId,
          amount:   order.amount,
          currency: order.currency,
          name:     'Arpans Beauty Zone & Academy',
          description: `Booking: ${service.name}`,
          order_id: order.orderId,
          handler: async response => {
            try {
              await api.post('/payments/verify', {
                ...response,
                paymentId: order.paymentId,
                bookingId: booking._id,
                method:    'razorpay',
              });
              toast.success('Payment successful! Booking confirmed.');
              navigate('/booking/success', { state: { booking, service, paymentType: form.paymentType } });
            } catch { toast.error('Payment verification failed'); }
          },
          prefill: { name: user?.name || form.guestName, contact: user?.phone || form.guestPhone },
          theme:   { color: '#C9A96E' },
        };
        if (!window.Razorpay) { toast.error('Razorpay not loaded. Refresh the page.'); setLoading(false); return; }
        new window.Razorpay(options).open();
        setLoading(false);
        return;
      }

      // ── UPI ───────────────────────────────────────────
      if (selectedMethod === 'upi') {
        const { data } = await api.post('/payments/create-order', {
          bookingId: booking._id, paymentType: form.paymentType, method: 'upi',
        });
        setUpiData(data);
        setStep(4);
        setLoading(false);
        return;
      }

      // ── CASH ──────────────────────────────────────────
      if (selectedMethod === 'cash') {
        await api.post('/payments/create-order', {
          bookingId: booking._id, paymentType: form.paymentType, method: 'cash',
        });
        toast.success('Booking confirmed! Pay at the salon.');
        navigate('/booking/success', { state: { booking, service, paymentType: form.paymentType } });
        return;
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally { setLoading(false); }
  };

  /* ── Step 4: submit UTR ── */
  const handleSubmitUTR = async () => {
    if (!utrNumber.trim()) { toast.error('Enter your UPI Transaction ID'); return; }
    setSubmitting(true);
    try {
      await api.post('/payments/verify', {
        paymentId: upiData.paymentId, bookingId: booking._id,
        utrNumber: utrNumber.trim(), method: 'upi',
      });
      toast.success('Submitted! Booking confirmed once payment is verified.');
      navigate('/booking/success', { state: { booking, service, paymentType: form.paymentType } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setSubmitting(false); }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiData.upiId);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    toast.success('UPI ID copied!');
  };

  const { total, advance } = calcAmount();

  const timeSlots = [
    '10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM',
    '2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
    '5:00 PM','5:30 PM','6:00 PM','6:30 PM',
  ];

  const enabledMethods = paymentConfig
    ? Object.entries(paymentConfig.methods).filter(([, m]) => m.enabled)
    : [];

  const methodIcons = { razorpay: <FiCreditCard size={18} />, upi: <FiSmartphone size={18} />, cash: <FiDollarSign size={18} /> };
  const methodColors = { razorpay: 'bg-blue-50 text-blue-600', upi: 'bg-green-50 text-green-600', cash: 'bg-yellow-50 text-yellow-600' };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      {/* Razorpay SDK — loaded only if razorpay is enabled */}
      {paymentConfig?.methods?.razorpay?.enabled && (
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      )}
      <div className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-12">
            <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">Let's Get Started</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-4">Book Your Appointment</h1>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-3">
              {[1,2,3,4].map(s => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= s ? 'bg-gold text-white' : 'bg-white text-gray-400 border-2 border-gray-200'}`}>
                    {step > s ? <FiCheck /> : s}
                  </div>
                  {s < 4 && <div className={`w-10 h-0.5 ${step > s ? 'bg-gold' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* ── STEP 1: Choose Service ── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">Choose a Service</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(svc => (
                  <button key={svc._id}
                    onClick={() => { setSelectedService(svc._id); setService(svc); setStep(2); }}
                    className="card p-6 text-left hover:border-gold border-2 border-transparent transition-all">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-serif font-semibold text-charcoal">{svc.name}</h3>
                      <span className="text-gold font-semibold">₹{svc.price.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{svc.description}</p>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <FiClock size={12} /><span>{svc.duration} min</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Details + Payment Method ── */}
          {step === 2 && service && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif font-semibold text-charcoal">Your Details</h2>
                    <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gold">← Change</button>
                  </div>
                  <form onSubmit={handleBookingSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      {!user && <>
                        <div><label className="label">Full Name *</label>
                          <input name="guestName" value={form.guestName} onChange={handleFormChange} placeholder="Your name" required className="input-field" /></div>
                        <div><label className="label">Phone *</label>
                          <input name="guestPhone" value={form.guestPhone} onChange={handleFormChange} placeholder="+91 XXXXX XXXXX" required className="input-field" /></div>
                        {/* <div className="sm:col-span-2"><label className="label">Email (Optional)</label>
                          <input name="guestEmail" value={form.guestEmail} onChange={handleFormChange} placeholder="your@email.com" className="input-field" /></div> */}
                      </>}
                      {user && (
                        <div className="sm:col-span-2 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
                          ✓ Booking as <strong>{user.name}</strong> ({user.phone})
                        </div>
                      )}
                      <div><label className="label">Date *</label>
                        <input type="date" name="date" value={form.date} onChange={handleFormChange}
                          min={new Date().toISOString().split('T')[0]} required className="input-field" /></div>
                      <div><label className="label">Time *</label>
                        <select name="time" value={form.time} onChange={handleFormChange} required className="input-field">
                          <option value="">Select time slot</option>
                          {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                        </select></div>
                      <div className="sm:col-span-2"><label className="label">Notes (Optional)</label>
                        <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={3}
                          placeholder="Allergies, preferences…" className="input-field resize-none" /></div>
                    </div>

                    {/* Payment amount type */}
                    <div className="mb-5">
                      <label className="label mb-3">Payment Amount</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { type: 'partial', label: 'Partial Advance', amount: Math.ceil(service.price * advancePercent / 100), note: `${advancePercent}% now, rest at salon` },
                          { type: 'full',    label: 'Full Payment',    amount: service.price, note: 'Pay full amount now' },
                        ].map(opt => (
                          <button key={opt.type} type="button"
                            onClick={() => setForm(p => ({ ...p, paymentType: opt.type }))}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${form.paymentType === opt.type ? 'border-gold bg-gold/5' : 'border-gray-200'}`}>
                            <div className="font-semibold text-sm text-charcoal">{opt.label}</div>
                            <div className="text-gold font-bold text-lg">₹{opt.amount.toLocaleString()}</div>
                            <div className="text-xs text-gray-400">{opt.note}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Method selector */}
                    {enabledMethods.length > 0 ? (
                      <div className="mb-6">
                        <label className="label mb-3">Payment Method</label>
                        <div className="grid grid-cols-1 gap-3">
                          {enabledMethods.map(([key, m]) => (
                            <button key={key} type="button"
                              onClick={() => setSelectedMethod(key)}
                              className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${selectedMethod === key ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gray-300'}`}>
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${methodColors[key]}`}>
                                {methodIcons[key]}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm text-charcoal">{m.label}</div>
                                {key === 'cash' && m.note && <div className="text-xs text-gray-400 mt-0.5">{m.note}</div>}
                                {key === 'upi' && <div className="text-xs text-gray-400 mt-0.5">Scan QR or enter UPI ID</div>}
                                {key === 'razorpay' && <div className="text-xs text-gray-400 mt-0.5">Cards, NetBanking, Wallets & UPI</div>}
                              </div>
                              {selectedMethod === key && <FiCheck className="text-gold flex-shrink-0" size={18} />}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                        No payment methods are available right now. Please contact the salon.
                      </div>
                    )}

                    <button type="submit" disabled={loading || !selectedMethod || enabledMethods.length === 0}
                      className="btn-primary w-full flex items-center justify-center gap-2">
                      {loading ? <><LoadingSpinner size="sm" /> Processing…</> : 'Continue to Payment'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Summary */}
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
                  <h3 className="font-serif font-semibold text-charcoal mb-4">Summary</h3>
                  <img src={service.imageUrl || 'https://images.unsplash.com/photo-1560066984-138daaa14d4a?w=400'}
                    alt={service.name} className="w-full h-40 object-cover rounded-xl mb-4" />
                  <h4 className="font-semibold text-charcoal mb-1">{service.name}</h4>
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
                    <FiClock size={14} /><span>{service.duration} min</span>
                  </div>
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Service</span><span>₹{total.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Pay Now</span><span className="font-bold text-gold text-base">₹{advance.toLocaleString()}</span></div>
                    {form.paymentType === 'partial' && (
                      <div className="flex justify-between text-gray-400"><span>At Salon</span><span>₹{(total - advance).toLocaleString()}</span></div>
                    )}
                    {selectedMethod && (
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-gray-500">Via</span>
                        <span className="font-medium capitalize">{selectedMethod === 'razorpay' ? 'Razorpay' : selectedMethod === 'upi' ? 'UPI' : 'Cash at Salon'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirm & Pay ── */}
          {step === 3 && booking && (
            <div className="max-w-lg mx-auto animate-fade-in">
              <div className="bg-white rounded-2xl p-8 shadow-md text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-green-600" size={28} />
                </div>
                <h2 className="text-2xl font-serif font-semibold text-charcoal mb-2">Booking Created!</h2>
                <p className="text-gray-500 mb-6 text-sm">Review and proceed with payment</p>

                <div className="bg-cream rounded-xl p-5 text-left mb-6 space-y-2 text-sm">
                  {[
                    ['Service',      service.name],
                    ['Date',         new Date(form.date).toLocaleDateString('en-IN',{dateStyle:'medium'})],
                    ['Time',         form.time],
                    ['Pay Now',      `₹${advance.toLocaleString()}`],
                    ['Method',       selectedMethod === 'razorpay' ? 'Razorpay' : selectedMethod === 'upi' ? 'UPI' : 'Cash at Salon'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>

                {selectedMethod === 'cash' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-amber-700 mb-5 text-left">
                    💵 {paymentConfig?.methods?.cash?.note || 'Pay at the salon on the day of your appointment.'}
                  </div>
                )}

                <button onClick={handlePay} disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
                  {loading ? <LoadingSpinner size="sm" /> : methodIcons[selectedMethod]}
                  {loading ? 'Processing…' :
                    selectedMethod === 'cash'     ? 'Confirm Booking (Pay at Salon)' :
                    selectedMethod === 'upi'      ? `Generate UPI QR — ₹${advance.toLocaleString()}` :
                    `Pay ₹${advance.toLocaleString()} via Razorpay`}
                </button>
                {selectedMethod === 'razorpay' && (
                  <p className="text-xs text-gray-400 mt-3">🔒 Secure payment powered by Razorpay</p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 4: UPI QR + UTR ── */}
          {step === 4 && upiData && (
            <div className="max-w-lg mx-auto animate-fade-in">
              <div className="bg-white rounded-2xl p-8 shadow-md">
                <h2 className="text-2xl font-serif font-semibold text-charcoal mb-2 text-center">Pay via UPI</h2>
                <p className="text-gray-500 text-sm text-center mb-6">Scan QR or use the UPI ID below</p>

                <div className="flex justify-center mb-6">
                  <div className="p-3 border-2 border-gold/30 rounded-2xl">
                    <img src="UpiQR.jpeg" alt="UPI QR" className="w-56 h-56" />
                  </div>
                </div>

                <div className="bg-pink-light/40 rounded-xl p-4 flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">UPI ID</p>
                    <p className="font-semibold text-charcoal text-lg">{upiData.upiId}</p>
                  </div>
                  <button onClick={copyUpiId} className="flex items-center gap-1.5 text-sm text-gold font-medium">
                    <FiCopy size={15} />{copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 text-center mb-5">
                  <p className="text-xs text-gray-500">Amount to Pay</p>
                  <p className="text-2xl font-bold text-gold">₹{upiData.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Ref: {upiData.transactionRef}</p>
                </div>

                <div className="flex gap-3 mb-6">
                  {[
                    { name: 'GPay',    link: upiData.upiLink },
                    { name: 'PhonePe', link: upiData.upiLink.replace('upi://', 'phonepe://') },
                    { name: 'Paytm',   link: upiData.upiLink.replace('upi://', 'paytmmp://') },
                  ].map(app => (
                    <a key={app.name} href={app.link}
                      className="flex-1 border border-gray-200 rounded-xl py-2.5 text-center text-xs font-medium text-gray-600 hover:border-gold hover:text-gold transition-colors">
                      {app.name}
                    </a>
                  ))}
                </div>

                <div className="border-t pt-5">
                  <p className="text-sm font-medium text-charcoal mb-2">Enter your UPI Transaction ID after paying:</p>
                  <input value={utrNumber} onChange={e => setUtrNumber(e.target.value)}
                    placeholder="e.g. 407612345678 or T2412XXXXXXX" className="input-field mb-2" />
                  <p className="text-xs text-gray-400 mb-4">
                    Find in your UPI app → Transaction History → Transaction ID / UTR Number
                  </p>
                  <button onClick={handleSubmitUTR} disabled={submitting || !utrNumber.trim()}
                    className="btn-primary w-full flex items-center justify-center gap-2">
                    {submitting ? <LoadingSpinner size="sm" /> : null}
                    {submitting ? 'Submitting…' : 'Submit & Confirm Booking'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;
