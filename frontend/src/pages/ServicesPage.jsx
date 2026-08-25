import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';
import { SERVICE_CATEGORIES, SORT_OPTIONS } from '../utils/constants';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || '';
  const activeSubcategory = searchParams.get('subcategory') || '';
  const activeSort = searchParams.get('sort') || '';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (activeSubcategory) params.subcategory = activeSubcategory;
    if (activeSort) params.sort = activeSort;

    api.get('/services', { params })
      .then(({ data }) => {
        setServices(data.services || []);
        setSubcategories(data.subcategories || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, activeSubcategory, activeSort]);

  // Update one query param while keeping the others intact
  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    // Changing the top-level category resets the subcategory filter
    if (key === 'category') next.delete('subcategory');
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1560066984-138daaa14d4a?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
          <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.3em] uppercase mb-4">What We Offer</p>
          <h1 className="text-5xl lg:text-6xl font-serif font-bold text-white mb-4">Our Services</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Premium beauty treatments tailored to bring out your best self</p>
        </div>
      </div>

      {/* Category Filter + Sort */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
            {/* Category chips */}
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {SERVICE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-black text-white'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <select
              value={activeSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="text-sm font-medium border border-gray-200 rounded-full px-4 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A96E] flex-shrink-0"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Subcategory chips — only shown once a top-level category is picked
              and the backend returned distinct subcategories for it */}
          {activeCategory && subcategories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4">
              <button
                onClick={() => updateParam('subcategory', '')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                  !activeSubcategory
                    ? 'bg-[#C9A96E] text-white border-[#C9A96E]'
                    : 'text-gray-500 border-gray-200 hover:border-[#C9A96E]'
                }`}
              >
                All
              </button>
              {subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => updateParam('subcategory', sub)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                    activeSubcategory === sub
                      ? 'bg-[#C9A96E] text-white border-[#C9A96E]'
                      : 'text-gray-500 border-gray-200 hover:border-[#C9A96E]'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
            <p className="text-gray-400 mb-6">Try a different category or check back soon</p>
            <button onClick={() => setSearchParams({})} className="text-[#C9A96E] hover:underline text-sm font-medium">
              View all services →
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-8">{services.length} service{services.length !== 1 ? 's' : ''} available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map(service => (
                <div key={service._id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#fdf6ee] to-[#f0e6d0] flex items-center justify-center">
                        <span className="text-5xl">✨</span>
                      </div>
                    )}
                    {service.subcategory && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#C9A96E] px-3 py-1 rounded-full">
                        {service.subcategory}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">{service.description}</p>
                    )}

                    {/* Price — shows variant tiers (e.g. Regular/Chocolate/Rica) if present */}
                    {service.variants && service.variants.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.variants.map(v => (
                          <span key={v.label} className="text-xs bg-gray-50 border border-gray-100 rounded-full px-3 py-1 text-gray-600">
                            {v.label}: <span className="font-semibold text-gray-900">₹{v.price.toLocaleString()}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{service.price?.toLocaleString()}{service.priceLabel ? ` ${service.priceLabel}` : ''}
                        </span>
                        {service.bookable !== false && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <FiClock size={12} />
                            <span>{service.durationLabel || `${service.duration} min`}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {service.bookable === false ? (
                      <a
                        href="tel:+918210551159"
                        className="flex items-center justify-center gap-2 w-full border-2 border-black text-black text-sm font-medium py-2.5 rounded-full hover:bg-black hover:text-white transition-colors"
                      >
                        Enquire
                      </a>
                    ) : (
                      <Link
                        to={`/booking?service=${service._id}`}
                        className="flex items-center justify-center gap-2 w-full bg-black text-white text-sm font-medium py-2.5 rounded-full hover:bg-[#C9A96E] transition-colors group/btn"
                      >
                        Book Now
                        <FiArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Not sure what to book?</h2>
          <p className="text-gray-500 mb-8">Call us and our team will recommend the perfect treatment for you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+918210551159"
              className="bg-black text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-[#C9A96E] transition-colors">
              📞 Call Us
            </a>
            <Link to="/contact"
              className="border-2 border-black text-black text-sm font-medium px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all">
              Send Message
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServicesPage;