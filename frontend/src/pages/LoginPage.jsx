import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiPhone, FiLock, FiEye, FiEyeOff, FiClock, FiAlertCircle, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const [form, setForm]           = useState({ phone: '', password: '' });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [warning, setWarning]     = useState('');
  const [lockedOut, setLockedOut] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef                  = useRef(null);
  const { login }                 = useAuth();
  const navigate                  = useNavigate();

  // Restore lockout from localStorage (if they refresh the page while locked)
  useEffect(() => {
    const lockoutUntil = localStorage.getItem('loginLockoutUntil');
    if (lockoutUntil) {
      const remaining = Math.floor((parseInt(lockoutUntil) - Date.now()) / 1000);
      if (remaining > 0) {
        startLockout(remaining);
      } else {
        localStorage.removeItem('loginLockoutUntil');
      }
    }
  }, []);

  const startLockout = (seconds) => {
    clearInterval(timerRef.current);
    setLockedOut(true);
    setCountdown(seconds);
    setError('');
    setWarning('');
  };

  // Countdown tick
  useEffect(() => {
    if (!lockedOut || countdown <= 0) return;
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setLockedOut(false);
          localStorage.removeItem('loginLockoutUntil');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [lockedOut]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockedOut) return;
    setLoading(true);
    setError('');
    setWarning('');

    try {
      const data = await login(form.phone, form.password);
      localStorage.removeItem('loginLockoutUntil');
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      const res    = err.response?.data || {};
      const status = err.response?.status;

      if (status === 423 || res.locked) {
        // Account locked by server — start countdown from server's time
        const secs = res.secondsLeft || 15 * 60;
        const until = Date.now() + secs * 1000;
        localStorage.setItem('loginLockoutUntil', until.toString());
        startLockout(secs);
      } else if (status === 429) {
        // IP rate limit hit
        const until = Date.now() + 15 * 60 * 1000;
        localStorage.setItem('loginLockoutUntil', until.toString());
        startLockout(15 * 60);
      } else {
        // Wrong credentials — show warning with attempts left
        setError(res.message || 'Invalid phone number or password');
        if (res.warning) setWarning(res.warning);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* Left: Form */}
      <div className="flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          <Link to="/" className="text-2xl font-serif font-bold text-charcoal mb-12 block">
            Glow <span className="text-gold">&</span> Glam
          </Link>
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">Welcome Back</h1>
          <p className="text-gray-400 mb-10">Sign in to manage your appointments</p>

          {/* ── Lockout Screen ── */}
          {lockedOut ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-red-500" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Account Temporarily Locked</h3>
              <p className="text-sm text-red-500 mb-6">
                Too many failed login attempts. Your account is locked to protect your security.
                <br/>
                <span className="font-medium">This lock applies even if you change your IP or device.</span>
              </p>
              <div className="bg-white rounded-xl p-4 mb-6 border border-red-100">
                <p className="text-xs text-gray-400 mb-1">Try again in</p>
                <p className="text-4xl font-mono font-bold text-red-600 tracking-wider">
                  {formatTime(countdown)}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <FiClock size={12} />
                Lock resets automatically — no action needed
              </div>
            </div>

          ) : (
            /* ── Login Form ── */
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                  <FiAlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{error}</p>
                    {warning && <p className="text-xs text-red-400 mt-1 font-medium">{warning}</p>}
                  </div>
                </div>
              )}

              <div>
                <label className="label">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={e => { setForm(p => ({ ...p, phone: e.target.value })); setError(''); setWarning(''); }}
                    required
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Your password"
                    value={form.password}
                    onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); setWarning(''); }}
                    required
                    className="input-field pl-11 pr-11"
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <LoadingSpinner size="sm" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold hover:text-gold-dark font-medium">Create Account</Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gold">← Continue as Guest</Link>
          </p>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block relative">
        <img src="https://plus.unsplash.com/premium_photo-1669675935927-0ed8935e6600?q=80&w=688" alt="Beauty" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <blockquote className="text-xl font-serif italic mb-3">"Beauty is about being comfortable in your own skin."</blockquote>
          <p className="text-white/60 text-sm">— Glow & Glam Philosophy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;