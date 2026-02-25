import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [siteContent, setSiteContent] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, contentRes] = await Promise.all([
          api.get('/services'),
          api.get('/site-content'),
        ]);
        setServices(servicesRes.data.services.slice(0, 6));
        setSiteContent(contentRes.data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const testimonials = siteContent?.testimonials || [
    { name: 'Priya Sharma', review: 'Absolutely love this place! The bridal makeup they did for my wedding was stunning.', rating: 5 },
    { name: 'Sneha Patel', review: 'The facial left my skin glowing for weeks! The staff is warm and professional.', rating: 5 },
    { name: 'Ananya Rao', review: 'Best manicure-pedicure experience in the city. Highly recommend!', rating: 5 },
  ];

  const categories = [
    { id: 'facial', label: 'Facials', icon: '✨', color: 'from-rose-100 to-pink-blush' },
    { id: 'hair', label: 'Hair Care', icon: '💇', color: 'from-amber-50 to-gold-light' },
    { id: 'makeup', label: 'Makeup', icon: '💄', color: 'from-purple-50 to-pink-light' },
    { id: 'spa', label: 'Spa', icon: '🧖', color: 'from-green-50 to-teal-50' },
    { id: 'nails', label: 'Nails', icon: '💅', color: 'from-pink-light to-rose-100' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={siteContent?.heroImage || 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=2000&q=90'}
            alt="Glow & Glam Hero"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://plus.unsplash.com/premium_photo-1661266905493-c48be85c4482?q=80&w=1170';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20">
          <div className="max-w-2xl animate-fade-in">
            <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-4">Premium Beauty Experience</p>
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-6">
              {siteContent?.heroTitle || 'Where Beauty Meets Luxury'}
            </h1>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              {siteContent?.heroSubtitle || 'Experience premium beauty treatments curated for the modern woman. Step in for a transformation.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/booking" className="btn-primary text-center">
                Book an Appointment
              </Link>
              <Link to="/services" className="border-2 border-white text-white px-8 py-3 rounded-full font-medium text-sm tracking-wider uppercase hover:bg-white hover:text-charcoal transition-all duration-300 text-center">
                Explore Services
              </Link>
            </div>
            <div className="flex gap-8 mt-14">
              {[['500+', 'Happy Clients'], ['5+', 'Years Experience'], ['4.9★', 'Average Rating']].map(([num, label]) => (
                <div key={label}>
                  <div className="text-2xl font-serif text-gold font-bold">{num}</div>
                  <div className="text-xs text-white/60 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/50" />
        </div>
      </section>

      {/* Categories Strip */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/services?category=${cat.id}`}
                className={`bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <div className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors">{cat.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">What We Offer</p>
            <h2 className="section-title">Our Premium Services</h2>
            <p className="section-subtitle">Crafted with expertise and delivered with care</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" text="Loading services..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(service => <ServiceCard key={service._id} service={service} />)}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/services" className="btn-secondary inline-flex items-center gap-2">
              View All Services <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* About / Feature Section */}
      <section className="py-20 bg-gradient-to-br from-pink-light via-cream to-gold-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">Our Story</p>
              <h2 className="section-title mb-6">{siteContent?.aboutTitle || 'About Glow & Glam'}</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                {siteContent?.aboutText || 'Founded in 2018, Glow & Glam has been the sanctuary of choice for women who seek the finest beauty experiences.'}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  ['Expert Stylists', 'Certified professionals with 5+ years experience'],
                  ['Premium Products', 'Only the finest beauty brands used'],
                  ['Hygiene First', 'Sterilized tools and clean spaces'],
                  ['Personalized Care', 'Treatments tailored to your needs'],
                ].map(([title, desc]) => (
                  <div key={title}>
                    <div className="w-8 h-0.5 bg-gold mb-3" />
                    <h4 className="font-semibold text-charcoal mb-1 text-sm">{title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-primary inline-flex items-center gap-2">
                Learn More <FiArrowRight />
              </Link>
            </div>
            <div className="relative">
              <img
                src={siteContent?.aboutImage || 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80'}
                alt="About Glow & Glam"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80';
                }}
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-white text-xl">✨</div>
                  <div>
                    <div className="font-serif font-bold text-charcoal text-lg">500+</div>
                    <div className="text-xs text-gray-500">Happy Clients This Year</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Banner */}
      <section className="py-12 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(siteContent?.promotions?.length ? siteContent.promotions : [
              { title: 'Bridal Package', description: 'Complete bridal makeover. Book 30 days early & save 15%.', discount: 15 },
              { title: 'Weekend Special', description: 'Free head massage with any facial every Saturday & Sunday.', discount: 0 },
            ]).map((promo, i) => (
              <div key={i} className="bg-white/5 border border-gold/30 rounded-2xl p-8 flex items-start gap-6">
                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                  {promo.discount > 0 ? `${promo.discount}%` : '🎁'}
                </div>
                <div>
                  <h3 className="text-white font-serif text-xl font-semibold mb-2">{promo.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{promo.description}</p>
                  <Link to="/booking" className="mt-4 inline-flex items-center gap-1 text-gold text-sm font-medium hover:gap-2 transition-all">
                    Book Now <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">Client Love</p>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
          <div className="relative bg-pink-light/50 rounded-3xl p-10 md:p-16">
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[testimonialIndex]?.rating || 5)].map((_, i) => (
                  <FiStar key={i} className="text-gold fill-gold" size={20} />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl font-serif text-charcoal leading-relaxed mb-8 italic">
                "{testimonials[testimonialIndex]?.review}"
              </blockquote>
              <div className="font-semibold text-charcoal">{testimonials[testimonialIndex]?.name}</div>
            </div>
            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={() => setTestimonialIndex(i => (i - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition-shadow"
              >
                <FiChevronLeft />
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === testimonialIndex ? 'bg-gold w-6' : 'bg-gold/30'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestimonialIndex(i => (i + 1) % testimonials.length)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition-shadow"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-dark via-pink-blush to-gold-light">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">
            Ready to Glow?
          </h2>
          <p className="text-charcoal/70 text-lg mb-10">
            Book your appointment today and step into a world of beauty and luxury. Your transformation awaits.
          </p>
          <Link to="/booking" className="btn-primary bg-charcoal hover:bg-charcoal/80 text-white text-base px-12 py-4 inline-flex items-center gap-3">
            Book Your Appointment <FiArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;