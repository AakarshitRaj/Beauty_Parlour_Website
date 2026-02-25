import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-20 bg-gradient-to-br from-pink-light via-cream to-gold-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">Our Story</p>
            <h1 className="text-5xl font-serif font-bold text-charcoal mb-6">About Glow & Glam</h1>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              Founded in 2018 in the heart of Mumbai, Glow & Glam was born from a simple belief: every woman deserves to feel extraordinary. What started as a small studio with 3 professionals has grown into the city's most trusted luxury beauty destination.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our team of certified beauty professionals brings together years of expertise across skincare, hair artistry, makeup, and wellness. We combine timeless techniques with cutting-edge treatments to deliver results that go beyond the surface.
            </p>
            <Link to="/booking" className="btn-primary inline-block">Book an Appointment</Link>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="text-4xl font-serif font-bold text-gold mb-2">500+</div>
              <div className="text-sm text-gray-500">Happy Clients</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="text-4xl font-serif font-bold text-gold mb-2">6+</div>
              <div className="text-sm text-gray-500">Years Experience</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="text-4xl font-serif font-bold text-gold mb-2">15+</div>
              <div className="text-sm text-gray-500">Expert Staff</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="text-4xl font-serif font-bold text-gold mb-2">4.9★</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-title">Why Choose Us</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: '✨', title: 'Premium Products', desc: 'We use only certified, dermatologist-approved beauty products from leading brands.' },
            { icon: '🎓', title: 'Expert Professionals', desc: 'All our stylists are certified with minimum 3 years of professional experience.' },
            { icon: '🧼', title: 'Hygiene First', desc: 'We sterilize all tools between clients and maintain the highest cleanliness standards.' },
            { icon: '💖', title: 'Personalized Care', desc: 'Every treatment is customized to your skin type, hair texture, and personal style.' },
          ].map(item => (
            <div key={item.title} className="text-center p-6">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-serif font-semibold text-charcoal text-lg mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default AboutPage;
