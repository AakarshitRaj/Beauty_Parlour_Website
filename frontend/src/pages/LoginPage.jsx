import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiPhone, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// ─── Match these with backend models/User.js ──────────────
const MAX_ATTEMPTS = 10;  // same as MAX_ATTEMPTS in User.js
const LOCK_MINUTES = 2;   // same as LOCK_DURATION/60000 in User.js
// ─────────────────────────────────────────────────────────

const LoginPage = () => {
  const [form, setForm]           = useState({ phone: '', password: '' });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(null); // fixed: single declaration
  const [lockedOut, setLockedOut] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef                  = useRef(null);
  const { login }                 = useAuth();
  const navigate                  = useNavigate();

  // Restore lockout on page refresh (same browser)
  useEffect(() => {
    const until = localStorage.getItem('loginLockoutUntil');
    if (until) {
      const remaining = Math.floor((parseInt(until) - Date.now()) / 1000);
      if (remaining > 0) {
        setLockedOut(true);
        setCountdown(remaining);
      } else {
        localStorage.removeItem('loginLockoutUntil');
      }
    }
  }, []);

  // fixed: startLockout defined BEFORE it is used, no alias needed
  const startLockout = (seconds) => {
    clearInterval(timerRef.current);
    setLockedOut(true);
    setCountdown(seconds);
    setError('');
    setAttemptsLeft(null);
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
          toast.success('You can try logging in again now! 👋');
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

    try {
      const data = await login(form.phone, form.password);
      localStorage.removeItem('loginLockoutUntil');
      setAttemptsLeft(null);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      const res    = err.response?.data || {};
      const status = err.response?.status;

      if (status === 423 || res.locked) {
        // Account locked by server
        const secs  = res.secondsLeft || LOCK_MINUTES * 60;
        const until = Date.now() + secs * 1000;
        localStorage.setItem('loginLockoutUntil', until.toString());
        startLockout(secs);
      } else if (status === 429) {
        // IP rate limit hit
        const secs  = LOCK_MINUTES * 60;
        const until = Date.now() + secs * 1000;
        localStorage.setItem('loginLockoutUntil', until.toString());
        startLockout(secs);
      } else {
        // Wrong credentials
        setError(res.message || 'Incorrect phone number or password');
        if (res.attemptsLeft !== undefined) setAttemptsLeft(res.attemptsLeft);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-['Poppins',sans-serif]">

      {/* ── Left: Form ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#fdfaf6]">
        <div className="w-full max-w-md">

          {/* Logo */}
          <Link to="/" className="inline-block mb-10">
            <span className="text-3xl font-serif font-bold text-gray-900">
              Arpan's Beauty Zone <span className="text-[#C9A96E]">&</span> Academy
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-1">Welcome Back</h1>
          <p className="text-gray-400 mb-8 text-sm sm:text-base">Sign in to your account</p>

          {/* ── Lockout State ── */}
          {lockedOut ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-amber-500" size={26} />
              </div>
              <h3 className="font-semibold text-amber-800 mb-1">Account Temporarily Paused</h3>
              <p className="text-sm text-amber-600 mb-5">
                Too many incorrect attempts. Please wait and try again.
              </p>

              {/* Countdown */}
              <div className="bg-white rounded-xl px-6 py-4 border border-amber-100 mb-5 inline-block">
                <p className="text-xs text-gray-400 mb-1">Try again in</p>
                <p className="text-3xl font-mono font-bold text-amber-600">{formatTime(countdown)}</p>
              </div>

              <p className="text-xs text-gray-400">
                Forgot your password? Call us at{' '}
                <a href="tel:+918210551159" className="text-[#C9A96E] font-medium hover:underline">
                  +91 82105 51159
                </a>
              </p>
            </div>

          ) : (
            /* ── Login Form ── */
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Error banner */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4 text-sm">
                  <FiAlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-600">{error}</p>
                    {attemptsLeft !== null && attemptsLeft <= 3 && (
                      <p className="text-red-400 text-xs mt-1">
                        ⚠️ {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before
                        your account is paused for {LOCK_MINUTES} minutes
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    placeholder="91xxxxxxxx"
                    value={form.phone}
                    onChange={e => { setForm(p => ({ ...p, phone: e.target.value })); setError(''); }}
                    required
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Your password"
                    value={form.password}
                    onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                    required
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-12 py-3.5 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A96E] transition-colors"
                  >
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Attempt progress bar — only shows after first wrong attempt */}
              {attemptsLeft !== null && (
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Login attempts</span>
                    <span className={attemptsLeft <= 2 ? 'text-red-500 font-medium' : ''}>
                      {MAX_ATTEMPTS - attemptsLeft} / {MAX_ATTEMPTS} used
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        attemptsLeft <= 2
                          ? 'bg-red-400'
                          : attemptsLeft <= 4
                          ? 'bg-amber-400'
                          : 'bg-[#C9A96E]'
                      }`}
                      style={{ width: `${((MAX_ATTEMPTS - attemptsLeft) / MAX_ATTEMPTS) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white text-sm font-semibold py-4 rounded-full hover:bg-[#C9A96E] transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-xs text-gray-400">
                Trouble logging in? Call{' '}
                <a href="tel:+918210551159" className="text-[#C9A96E] hover:underline">
                  +91 82105 51159
                </a>
              </p>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              New customer?{' '}
              <Link to="/register" className="text-[#C9A96E] font-medium hover:underline">
                Create Account
              </Link>
            </p>
            <p className="text-center text-xs text-gray-400 mt-3">
              <Link to="/" className="hover:text-[#C9A96E] transition-colors">← Back to Home</Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Image (desktop only) ────────────────────── */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://plus.unsplash.com/premium_photo-1669675935927-0ed8935e6600?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Beauty Salon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/30" />
        <div className="absolute bottom-12 left-10 right-10 text-white">
          <blockquote className="text-2xl font-serif italic mb-3 leading-snug">
            "Beauty begins the moment you decide to be yourself."
          </blockquote>
          <p className="text-white/60 text-sm">— Arpan's Beauty Zone & Academy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
