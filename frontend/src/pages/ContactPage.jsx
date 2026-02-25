import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheck } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

const ContactPage = () => {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
      toast.success("Message sent! We'll get back to you soon.");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: FiMapPin, label: 'Address',       value: '123 Beauty Lane, Bandra West, Mumbai, Maharashtra 400050' },
    { icon: FiPhone,  label: 'Phone',         value: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: FiMail,   label: 'Email',         value: 'hello@glowglam.com', href: 'mailto:hello@glowglam.com' },
    { icon: FiClock,  label: 'Working Hours', value: 'Mon–Sat: 10AM–8PM  |  Sun: 11AM–6PM' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-gradient-to-br from-pink-light via-cream to-gold-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">Get In Touch</p>
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">Contact Us</h1>
          <p className="text-gray-500 text-lg">We'd love to hear from you. Reach out anytime.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: Info */}
          <div>
            <h2 className="text-3xl font-serif font-semibold text-charcoal mb-8">Visit Us</h2>
            <div className="space-y-6 mb-10">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-5">
                  <div className="w-12 h-12 bg-pink-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="text-gold" size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</div>
                    {href
                      ? <a href={href} className="text-charcoal hover:text-gold transition-colors">{value}</a>
                      : <div className="text-charcoal">{value}</div>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe
                title="Glow & Glam Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.628!2d72.836!3d19.054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBandra+West%2C+Mumbai!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            {sent ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <FiCheck className="text-green-500" size={36} />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-charcoal mb-3">Message Sent!</h3>
                <p className="text-gray-400 mb-6">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn-secondary text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Your Name *</label>
                      <input
                        className="input-field"
                        placeholder="Full name"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input
                        className="input-field"
                        placeholder="Phone number"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Message *</label>
                    <textarea
                      className="input-field resize-none"
                      placeholder="How can we help you?"
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <LoadingSpinner size="sm" /> : <FiSend size={16} />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    We usually respond within 24 hours on working days.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
