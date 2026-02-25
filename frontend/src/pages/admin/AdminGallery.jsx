import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/api';

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'other', isPromotion: false, promotionText: '' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchGallery = () => {
    setLoading(true);
    api.get('/gallery').then(({ data }) => setGallery(data.gallery)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) { toast.error('Please select an image'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('isPromotion', form.isPromotion);
      fd.append('promotionText', form.promotionText);
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image uploaded');
      setForm({ title: '', category: 'other', isPromotion: false, promotionText: '' });
      setImageFile(null);
      setPreview(null);
      fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Image deleted');
      fetchGallery();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-charcoal mb-8">Manage Gallery</h1>

      {/* Upload Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-serif font-semibold text-lg text-charcoal mb-5">Upload New Image</h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Image *</label>
            <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${preview ? 'border-gold' : 'border-gray-200 hover:border-gold'}`}>
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center p-6">
                  <FiUpload size={30} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Click to select image</p>
                  <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP up to 10MB</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Title (Optional)</label>
              <input className="input-field" placeholder="e.g. Bridal Transformation" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {['facial', 'hair', 'makeup', 'spa', 'nails', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isPromotion" checked={form.isPromotion} onChange={e => setForm(p => ({ ...p, isPromotion: e.target.checked }))} />
              <label htmlFor="isPromotion" className="text-sm text-gray-600">Mark as Promotion</label>
            </div>
            {form.isPromotion && (
              <div>
                <label className="label">Promotion Text</label>
                <input className="input-field" placeholder="e.g. 20% off this weekend!" value={form.promotionText} onChange={e => setForm(p => ({ ...p, promotionText: e.target.value }))} />
              </div>
            )}
            <button type="submit" disabled={uploading} className="btn-primary w-full flex items-center justify-center gap-2">
              {uploading ? <LoadingSpinner size="sm" /> : <FiPlus size={16} />}
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <div>
          <h2 className="font-serif font-semibold text-lg text-charcoal mb-5">Gallery ({gallery.length} images)</h2>
          {gallery.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No images uploaded yet</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map(item => (
                <div key={item._id} className="group relative">
                  <img src={item.imageUrl} alt={item.title || ''} className="w-full h-48 object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center gap-2">
                    {item.title && <p className="text-white text-xs font-medium px-2 text-center">{item.title}</p>}
                    <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  {item.isPromotion && <span className="absolute top-2 left-2 badge bg-gold text-white">Promo</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
