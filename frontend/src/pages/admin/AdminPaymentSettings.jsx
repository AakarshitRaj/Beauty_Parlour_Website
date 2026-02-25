import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiToggleLeft, FiToggleRight, FiSave, FiEye, FiEyeOff, FiAlertCircle, FiCheck } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/api';

const Toggle = ({ enabled, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!enabled)}
    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
      enabled ? 'bg-gold' : 'bg-gray-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
        enabled ? 'translate-x-8' : 'translate-x-1'
      }`}
    />
  </button>
);

const MethodCard = ({ icon, title, color, badge, enabled, onToggle, children }) => (
  <div className={`bg-white rounded-2xl border-2 transition-all duration-300 ${enabled ? 'border-gold shadow-md' : 'border-gray-100 shadow-sm opacity-80'}`}>
    <div className="p-6 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-semibold text-charcoal text-lg">{title}</h3>
            {badge && (
              <span className="text-xs bg-gold/10 text-gold font-medium px-2 py-0.5 rounded-full">{badge}</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{enabled ? 'Currently enabled for customers' : 'Currently disabled'}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
          {enabled ? 'ON' : 'OFF'}
        </span>
        <Toggle enabled={enabled} onChange={onToggle} />
      </div>
    </div>
    {enabled && (
      <div className="p-6 space-y-4 animate-fade-in">
        {children}
      </div>
    )}
  </div>
);

const Field = ({ label, name, value, onChange, type = 'text', placeholder, hint, secret }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input
          type={secret && !show ? 'password' : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field pr-10"
        />
        {secret && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold">
            {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
};

const AdminPaymentSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    api.get('/payment-settings/admin')
      .then(({ data }) => setSettings(data.settings))
      .catch(err => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const setMethod = (method, key, value) => {
    setSettings(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        [method]: { ...prev.methods[method], [key]: value },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/payment-settings', {
        methods:        settings.methods,
        advancePercent: settings.advancePercent,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success('Payment settings saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = settings
    ? Object.values(settings.methods).filter(m => m.enabled).length
    : 0;

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">Payment Settings</h1>
          <p className="text-gray-400 mt-1">Enable or disable payment methods for your customers</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'btn-primary'
          }`}
        >
          {saving ? <LoadingSpinner size="sm" /> : saved ? <FiCheck size={16} /> : <FiSave size={16} />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Warning if nothing enabled */}
      {enabledCount === 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
          <FiAlertCircle size={18} className="flex-shrink-0" />
          <span>No payment methods are enabled. Customers won't be able to complete bookings!</span>
        </div>
      )}

      {/* Advance Percent setting */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-charcoal mb-1">Advance Payment Percentage</h3>
            <p className="text-sm text-gray-400">
              Customers who choose "Partial Payment" will pay this % upfront.
              The rest is collected at the salon.
            </p>
          </div>
          <div className="flex items-center gap-3 ml-8">
            <input
              type="number"
              min={1}
              max={100}
              value={settings.advancePercent}
              onChange={e => setSettings(p => ({ ...p, advancePercent: Number(e.target.value) }))}
              className="input-field !w-24 text-center text-xl font-bold text-gold"
            />
            <span className="text-2xl font-bold text-gold">%</span>
          </div>
        </div>
      </div>

      {/* Payment Method Cards */}
      <div className="space-y-5">

        {/* ── RAZORPAY ── */}
        <MethodCard
          icon="💳"
          title="Razorpay"
          color="bg-blue-50"
          badge="Cards • UPI • Wallets • NetBanking"
          enabled={settings.methods.razorpay.enabled}
          onToggle={v => setMethod('razorpay', 'enabled', v)}
        >
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 mb-4 flex items-start gap-2">
            <FiAlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            Get your API keys from <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noreferrer" className="underline font-medium ml-1">Razorpay Dashboard → Settings → API Keys</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Key ID (Public)"
              name="keyId"
              value={settings.methods.razorpay.keyId}
              onChange={e => setMethod('razorpay', 'keyId', e.target.value)}
              placeholder="rzp_test_xxxxxxxxxxxxxxxxx"
              hint="Starts with rzp_test_ or rzp_live_"
            />
            <Field
              label="Key Secret"
              name="keySecret"
              value={settings.methods.razorpay.keySecret}
              onChange={e => setMethod('razorpay', 'keySecret', e.target.value)}
              placeholder="••••••••••••••••••••"
              hint="Never share this with anyone"
              secret
            />
          </div>
          <Field
            label="Display Label"
            name="label"
            value={settings.methods.razorpay.label}
            onChange={e => setMethod('razorpay', 'label', e.target.value)}
            placeholder="Pay Online (Card / UPI via Razorpay)"
            hint="Shown to customers on the booking page"
          />
        </MethodCard>

        {/* ── UPI ── */}
        <MethodCard
          icon="📱"
          title="UPI"
          color="bg-green-50"
          badge="GPay • PhonePe • Paytm • BHIM"
          enabled={settings.methods.upi.enabled}
          onToggle={v => setMethod('upi', 'enabled', v)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Your UPI ID"
              name="upiId"
              value={settings.methods.upi.upiId}
              onChange={e => setMethod('upi', 'upiId', e.target.value)}
              placeholder="glowglam@upi"
              hint="e.g. name@okaxis · name@ybl · 9876543210@upi"
            />
            <Field
              label="Display Name on QR"
              name="upiName"
              value={settings.methods.upi.upiName}
              onChange={e => setMethod('upi', 'upiName', e.target.value)}
              placeholder="Glow & Glam"
              hint="Name shown in customer's payment app"
            />
          </div>
          <Field
            label="Display Label"
            name="label"
            value={settings.methods.upi.label}
            onChange={e => setMethod('upi', 'label', e.target.value)}
            placeholder="UPI (GPay / PhonePe / Paytm)"
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
            <FiAlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            UPI payments require manual verification. Customer submits their UTR number, you confirm after checking your UPI app.
          </div>
        </MethodCard>

        {/* ── CASH ── */}
        <MethodCard
          icon="💵"
          title="Cash at Salon"
          color="bg-yellow-50"
          badge="Pay on Arrival"
          enabled={settings.methods.cash.enabled}
          onToggle={v => setMethod('cash', 'enabled', v)}
        >
          <Field
            label="Display Label"
            name="label"
            value={settings.methods.cash.label}
            onChange={e => setMethod('cash', 'label', e.target.value)}
            placeholder="Pay at Salon (Cash / Card on Arrival)"
          />
          <Field
            label="Note shown to customer"
            name="note"
            value={settings.methods.cash.note}
            onChange={e => setMethod('cash', 'note', e.target.value)}
            placeholder="Full payment collected at the time of your appointment."
          />
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
            <FiAlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            Cash bookings are auto-confirmed but marked as unpaid until you collect payment at the salon.
          </div>
        </MethodCard>

      </div>

      {/* Live Preview */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-serif font-semibold text-charcoal mb-4">
          Customer View Preview
          <span className="text-sm font-sans font-normal text-gray-400 ml-2">— what customers see on the booking page</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'razorpay', icon: '💳', color: 'blue' },
            { key: 'upi',      icon: '📱', color: 'green' },
            { key: 'cash',     icon: '💵', color: 'yellow' },
          ].map(({ key, icon, color }) => {
            const m = settings.methods[key];
            return (
              <div
                key={key}
                className={`rounded-xl border-2 p-4 transition-all ${
                  m.enabled
                    ? 'border-gold bg-gold/5'
                    : 'border-gray-100 bg-gray-50 opacity-40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{icon}</span>
                  <span className={`text-sm font-medium ${m.enabled ? 'text-charcoal' : 'text-gray-400'}`}>
                    {m.label}
                  </span>
                </div>
                <span className={`text-xs ${m.enabled ? 'text-green-600' : 'text-gray-300'}`}>
                  {m.enabled ? '✓ Available' : '✗ Disabled'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save footer */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-10 py-3 rounded-xl font-medium text-sm transition-all ${
            saved ? 'bg-green-500 text-white' : 'btn-primary'
          }`}
        >
          {saving ? <LoadingSpinner size="sm" /> : saved ? <FiCheck size={16} /> : <FiSave size={16} />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminPaymentSettings;
