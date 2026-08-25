import { useState, useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

const FILTERS = ['All', 'Facial', 'Hair', 'Makeup', 'Spa', 'Nails'];

const GalleryPage = () => {
  const [images, setImages]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('All');
  const [lightbox, setLightbox] = useState(null); // index

  useEffect(() => {
    api.get('/gallery')
      .then(({ data }) => setImages(data.gallery || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All'
    ? images
    : images.filter(img => img.category?.toLowerCase() === filter.toLowerCase());

  const prev = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length);
  const next = () => setLightbox(i => (i + 1) % filtered.length);

  useEffect(() => {
    const handler = (e) => {
      if (lightbox === null) return;
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     setLightbox(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, filtered.length]);

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-black relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80"
          alt="Gallery" className="w-full h-64 object-cover opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="text-[#C9A96E] text-xs font-semibold tracking-[0.3em] uppercase mb-3">Our Work</p>
            <h1 className="text-5xl font-serif font-bold text-white">Gallery</h1>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                filter === f ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-gray-400">No images in this category yet</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <div key={img._id} onClick={() => setLightbox(i)}
                className="group relative overflow-hidden rounded-2xl cursor-pointer break-inside-avoid">
                <img src={img.imageUrl} alt={img.title || 'Gallery'}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end">
                  {img.title && (
                    <div className="p-4 translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                      <p className="text-white text-sm font-medium">{img.title}</p>
                      {img.category && <p className="text-[#C9A96E] text-xs capitalize">{img.category}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button onClick={e => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all">
            <FiChevronLeft size={22} />
          </button>
          <img src={filtered[lightbox].imageUrl} alt={filtered[lightbox].title}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl"
            onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all">
            <FiChevronRight size={22} />
          </button>
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center">
            <FiX size={18} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
