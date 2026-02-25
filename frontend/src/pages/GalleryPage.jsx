import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

const GalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get('/gallery', { params: activeCategory ? { category: activeCategory } : {} })
      .then(({ data }) => setGallery(data.gallery))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const categories = ['', 'facial', 'hair', 'makeup', 'spa', 'nails'];

  const fallback = [
    { _id: '1', imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600', title: 'Facial Treatment', category: 'facial' },
    { _id: '2', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', title: 'Hair Styling', category: 'hair' },
    { _id: '3', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600', title: 'Bridal Makeup', category: 'makeup' },
    { _id: '4', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600', title: 'Spa Session', category: 'spa' },
    { _id: '5', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', title: 'Nail Art', category: 'nails' },
    { _id: '6', imageUrl: 'https://images.unsplash.com/photo-1560066984-138daaa14d4a?w=600', title: 'Beauty Session', category: 'other' },
  ];

  const items = gallery.length > 0 ? gallery : fallback;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 bg-gradient-to-br from-pink-light via-cream to-gold-light py-16">
        <div className="max-w-7xl mx-auto px-6 text-center pt-12">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">Our Work</p>
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">Our Gallery</h1>
          <p className="text-gray-500 text-lg">A glimpse into the transformations we create every day</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex gap-3 flex-wrap justify-center mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-gold text-white shadow-md' : 'bg-white text-gray-600 hover:text-gold border border-gray-200'}`}
            >
              {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map(item => (
              <div key={item._id} onClick={() => setLightbox(item)} className="break-inside-avoid cursor-pointer group">
                <div className="relative overflow-hidden rounded-2xl">
                  <img src={item.imageUrl} alt={item.title || ''} className="w-full group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end p-4">
                    {item.title && (
                      <span className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">{item.title}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="max-w-4xl w-full">
            <img src={lightbox.imageUrl} alt={lightbox.title || ''} className="w-full rounded-2xl max-h-[80vh] object-contain" />
            {lightbox.title && <p className="text-white text-center mt-4 font-medium">{lightbox.title}</p>}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
