import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiUser, FiPhone, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// ✅ Moved OUTSIDE — stable reference, never recreated on parent re-render
const Field = ({ icon: Icon, name, type = 'text', placeholder, required, value, onChange }) => (
  <div className="relative">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="input-field pl-11"
    />
  </div>
);

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const data = await register({ name: form.name, phone: form.phone, email: form.email, password: form.password });
      toast.success(`Welcome to Glow & Glam, ${data.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200" alt="Beauty" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
        <div className="absolute top-12 left-12">
          <Link to="/" className="text-2xl font-serif font-bold text-white">
            Glow <span className="text-gold">&</span> Glam
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-cream overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link to="/" className="text-2xl font-serif font-bold text-charcoal mb-12 block lg:hidden">
            Glow <span className="text-gold">&</span> Glam
          </Link>
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">Create Account</h1>
          <p className="text-gray-400 mb-10">Join us and start your beauty journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full Name *</label>
              <Field icon={FiUser} name="name" placeholder="Your full name" required value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Phone Number *</label>
              <Field icon={FiPhone} name="phone" placeholder="9876543210" required value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Email (Optional)</label>
              <Field icon={FiMail} name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="input-field pl-11 pr-11"
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm Password *</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field pl-11"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <LoadingSpinner size="sm" /> : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-gold-dark font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;