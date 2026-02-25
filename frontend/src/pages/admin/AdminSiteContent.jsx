import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiStar, FiPlus, FiTrash2, FiSave, FiUser } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/api';

// Star rating selector component
const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="focus:outline-none"
      >
        <FiStar
          size={20}
          className={star <= value ? 'text-gold fill-gold' : 'text-gray-300'}
          style={{ fill: star <= value ? '#C9A96E' : 'none' }}
        />
      </button>
    ))}
  </div>
);

const AdminSiteContent = () => {
  const [content, setContent]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [heroFile, setHeroFile] = useState(null);

  useEffect(() => {
    api.get('/site-content')
      .then(({ data }) => setContent(data.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  // ── Testimonials helpers ──────────────────────────────
  const addTestimonial = () => {
    const blank = { name: '', review: '', rating: 5 };
    setContent(prev => ({ ...prev, testimonials: [...(prev.testimonials || []), blank] }));
  };

  const updateTestimonial = (index, field, value) => {
    setContent(prev => {
      const updated = [...(prev.testimonials || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, testimonials: updated };
    });
  };

  const removeTestimonial = (index) => {
    setContent(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  };

  // ── Save ─────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      const textFields = ['heroTitle', 'heroSubtitle', 'aboutTitle', 'aboutText', 'contactEmail', 'contactPhone', 'address'];
      textFields.forEach(f => { if (content[f] !== undefined) fd.append(f, content[f]); });

      // Testimonials & socialLinks must be JSON-stringified
      if (content.testimonials) fd.append('testimonials', JSON.stringify(content.testimonials));
      if (content.socialLinks)  fd.append('socialLinks',  JSON.stringify(content.socialLinks));
      if (heroFile)             fd.append('heroImage', heroFile);

      await api.put('/site-content', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Site content updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  const testimonials = content?.testimonials || [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">Site Content</h1>
          <p className="text-gray-400 mt-1">Manage homepage content, testimonials, and contact info</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <LoadingSpinner size="sm" /> : <FiSave size={16} />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="space-y-6">

        {/* ── Hero Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-serif font-semibold text-lg text-charcoal mb-5">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Hero Title</label>
                <input className="input-field" value={content?.heroTitle || ''} onChange={e => handleChange('heroTitle', e.target.value)} />
              </div>
              <div>
                <label className="label">Hero Subtitle</label>
                <textarea className="input-field resize-none" rows={3} value={content?.heroSubtitle || ''} onChange={e => handleChange('heroSubtitle', e.target.value)} />
              </div>
              <div>
                <label className="label">Hero Image</label>
                {content?.heroImage && <img src={content.heroImage} alt="Hero" className="w-full h-36 object-cover rounded-xl mb-3" />}
                <input type="file" accept="image/*" onChange={e => setHeroFile(e.target.files[0])} className="input-field" />
              </div>
            </div>
          </div>

          {/* ── About Section ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-serif font-semibold text-lg text-charcoal mb-5">About Section</h2>
            <div className="space-y-4">
              <div>
                <label className="label">About Title</label>
                <input className="input-field" value={content?.aboutTitle || ''} onChange={e => handleChange('aboutTitle', e.target.value)} />
              </div>
              <div>
                <label className="label">About Text</label>
                <textarea className="input-field resize-none" rows={6} value={content?.aboutText || ''} onChange={e => handleChange('aboutText', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif font-semibold text-lg text-charcoal">"Client Love" Testimonials</h2>
              <p className="text-sm text-gray-400 mt-0.5">These appear in the carousel on your homepage</p>
            </div>
            <button
              type="button"
              onClick={addTestimonial}
              className="flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold hover:bg-gold hover:text-white rounded-xl text-sm font-medium transition-all"
            >
              <FiPlus size={16} /> Add Testimonial
            </button>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
              <div className="text-4xl mb-3">⭐</div>
              <p className="text-gray-400 text-sm mb-4">No testimonials yet. Add your first one!</p>
              <button onClick={addTestimonial} className="btn-primary text-sm py-2">
                <FiPlus size={14} className="inline mr-1" /> Add Testimonial
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-gold/30 transition-colors relative group">

                  {/* Delete button */}
                  <button
                    onClick={() => removeTestimonial(i)}
                    className="absolute top-3 right-3 w-7 h-7 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove testimonial"
                  >
                    <FiTrash2 size={13} />
                  </button>

                  {/* Star rating */}
                  <div className="mb-4">
                    <label className="label mb-2">Rating</label>
                    <StarRating value={t.rating || 5} onChange={v => updateTestimonial(i, 'rating', v)} />
                  </div>

                  {/* Review text */}
                  <div className="mb-4">
                    <label className="label">Review *</label>
                    <textarea
                      rows={3}
                      className="input-field resize-none text-sm"
                      placeholder="What did they say about your service?"
                      value={t.review || ''}
                      onChange={e => updateTestimonial(i, 'review', e.target.value)}
                    />
                  </div>

                  {/* Client name */}
                  <div>
                    <label className="label">Client Name *</label>
                    <div className="relative">
                      <FiUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        className="input-field pl-8 text-sm"
                        placeholder="e.g. Priya Sharma"
                        value={t.name || ''}
                        onChange={e => updateTestimonial(i, 'name', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  {(t.review || t.name) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-2">Preview:</p>
                      <div className="bg-cream rounded-xl p-3">
                        <div className="flex gap-0.5 mb-1.5">
                          {[1,2,3,4,5].map(s => (
                            <FiStar key={s} size={11} className={s <= (t.rating||5) ? 'text-gold' : 'text-gray-300'} style={{ fill: s <= (t.rating||5) ? '#C9A96E' : 'none' }} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 italic mb-1">"{t.review}"</p>
                        <p className="text-xs font-semibold text-charcoal">{t.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {testimonials.length > 0 && (
            <p className="text-xs text-gray-400 mt-4">
              💡 Tip: Changes appear on the homepage after you click <strong>Save All Changes</strong>. The carousel shows one testimonial at a time.
            </p>
          )}
        </div>

        {/* ── Contact Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-serif font-semibold text-lg text-charcoal mb-5">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input type="email" className="input-field" value={content?.contactEmail || ''} onChange={e => handleChange('contactEmail', e.target.value)} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input-field" value={content?.contactPhone || ''} onChange={e => handleChange('contactPhone', e.target.value)} />
              </div>
              <div>
                <label className="label">Address</label>
                <textarea className="input-field resize-none" rows={3} value={content?.address || ''} onChange={e => handleChange('address', e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── Social Links ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-serif font-semibold text-lg text-charcoal mb-5">Social Links</h2>
            <div className="space-y-4">
              {['instagram', 'facebook', 'twitter', 'youtube'].map(platform => (
                <div key={platform}>
                  <label className="label capitalize">{platform} URL</label>
                  <input
                    className="input-field"
                    placeholder={`https://${platform}.com/glowglam`}
                    value={content?.socialLinks?.[platform] || ''}
                    onChange={e => setContent(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [platform]: e.target.value } }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Save footer */}
      <div className="flex justify-end mt-8">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-12 flex items-center gap-2">
          {saving ? <LoadingSpinner size="sm" /> : <FiSave size={16} />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminSiteContent;