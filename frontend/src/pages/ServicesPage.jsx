import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

const categories = [
  { id: '', label: 'All Services' },
  { id: 'facial', label: 'Facials' },
  { id: 'hair', label: 'Hair Care' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'spa', label: 'Spa' },
  { id: 'nails', label: 'Nails' },
];

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = activeCategory ? { category: activeCategory } : {};
        const { data } = await api.get('/services', { params });
        setServices(data.services);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [activeCategory]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="relative pt-20 pb-16 bg-gradient-to-br from-pink-light via-cream to-gold-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 text-center">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">What We Offer</p>
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">Our Services</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Handpicked treatments by certified professionals. Every session is a step toward your best self.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="flex gap-3 flex-wrap justify-center mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSearchParams(cat.id ? { category: cat.id } : {})}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-gold text-white shadow-md'
                  : 'bg-white text-gray-600 hover:text-gold border border-gray-200 hover:border-gold'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading services..." /></div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No services found for this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => <ServiceCard key={service._id} service={service} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ServicesPage;
