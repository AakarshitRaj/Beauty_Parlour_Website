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
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally { setLoading(false); }
  };

  const info = [
    { 
  icon: FiMapPin,
  label: 'Address',
  value: "Arpan's Beauty Zone & Academy, Sasaram, Rohtas, Bihar, India"
},
{ 
  icon: FiPhone,
  label: 'Phone',
  value: '+91 82105 51159',
  href: 'tel:+918210551159'
},
// { 
//   icon: FiMail,
//   label: 'Email',
//   value: 'arpansbeautyzone@gmail.com',
//   href: 'mailto:arpansbeautyzone@gmail.com'
// },
{ 
  icon: FiClock,
  label: 'Working Hours',
  value: 'Mon–Sat: 10AM–8PM  |  Sun: 11AM–6PM'
}, ];

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-gray-900 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1560066984-138daaa14d4a?w=1600&q=80"
          alt="Contact" className="w-full h-64 object-cover opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.3em] uppercase mb-3">Reach Out</p>
            <h1 className="text-5xl font-serif font-bold text-white mb-3">Contact Us</h1>
            <p className="text-gray-400">We'd love to hear from you</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: Info */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Visit Us</h2>
            <div className="space-y-6 mb-10">
              {info.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-5">
                  <div className="w-12 h-12 bg-[#fdf6ee] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="text-[#C9A96E]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                    {href
                      ? <a href={href} className="text-gray-700 hover:text-[#C9A96E] transition-colors">{value}</a>
                      : <p className="text-gray-700">{value}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe title="Location"
                src="https://www.google.com/maps?q=Arpan's%20beauty%20zone%20%26%20Academy%2C%20Sasaram%2C%20Bihar&output=embed"
                width="100%" height="240" style={{ border: 0 }} allowFullScreen loading="lazy" />
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <FiCheck className="text-green-500" size={36} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Message Sent!</h3>
                <p className="text-gray-400 mb-8">Our team will get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)}
                  className="border-2 border-black text-black text-sm font-medium px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all">
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Name *</label>
                      <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors"
                        placeholder="Your full name" value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Phone</label>
                      <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors"
                        placeholder="+91 XXXXX XXXXX" value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                  </div>
                  {/* <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Email *</label>
                    <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors"
                      placeholder="your@email.com" value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                  </div> */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Message *</label>
                    <textarea className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors resize-none"
                      placeholder="How can we help you?" rows={5} value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-black text-white text-sm font-semibold py-4 rounded-full hover:bg-[#C9A96E] transition-colors flex items-center justify-center gap-2">
                    {loading ? <LoadingSpinner size="sm" /> : <FiSend size={16} />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">Usually respond within 24 hours on working days</p>
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
