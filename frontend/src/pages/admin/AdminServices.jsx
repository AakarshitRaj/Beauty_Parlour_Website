// import { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import api from '../../utils/api';

// const defaultForm = { name: '', description: '', category: 'facial', duration: '', price: '', isActive: true };

// const AdminServices = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modal, setModal] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState(defaultForm);
//   const [imageFile, setImageFile] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const fetchServices = () => {
//     setLoading(true);
//     api.get('/services').then(({ data }) => setServices(data.services)).finally(() => setLoading(false));
//   };

//   useEffect(() => { fetchServices(); }, []);

//   const openModal = (service = null) => {
//     if (service) {
//       setEditing(service._id);
//       setForm({ name: service.name, description: service.description, category: service.category, duration: service.duration, price: service.price, isActive: service.isActive });
//     } else {
//       setEditing(null);
//       setForm(defaultForm);
//     }
//     setImageFile(null);
//     setModal(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const fd = new FormData();
//       Object.keys(form).forEach(k => fd.append(k, form[k]));
//       if (imageFile) fd.append('image', imageFile);

//       if (editing) {
//         await api.put(`/services/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
//         toast.success('Service updated');
//       } else {
//         await api.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
//         toast.success('Service created');
//       }
//       setModal(false);
//       fetchServices();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this service?')) return;
//     try {
//       await api.delete(`/services/${id}`);
//       toast.success('Service deleted');
//       fetchServices();
//     } catch (err) {
//       toast.error('Failed to delete');
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-3xl font-serif font-bold text-charcoal">Manage Services</h1>
//         <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
//           <FiPlus size={16} /> Add Service
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
//       ) : (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
//               <tr>
//                 {['Service', 'Category', 'Duration', 'Price', 'Status', 'Actions'].map(h => (
//                   <th key={h} className="px-6 py-3 text-left">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {services.map(svc => (
//                 <tr key={svc._id} className="hover:bg-gray-50/50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       {svc.imageUrl && <img src={svc.imageUrl} alt={svc.name} className="w-10 h-10 rounded-lg object-cover" />}
//                       <div>
//                         <div className="text-sm font-medium text-charcoal">{svc.name}</div>
//                         <div className="text-xs text-gray-400 line-clamp-1">{svc.description}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500 capitalize">{svc.category}</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{svc.duration} min</td>
//                   <td className="px-6 py-4 text-sm font-medium text-charcoal">₹{svc.price?.toLocaleString()}</td>
//                   <td className="px-6 py-4">
//                     <span className={`badge ${svc.isActive ? 'badge-confirmed' : 'badge-cancelled'}`}>
//                       {svc.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex gap-2">
//                       <button onClick={() => openModal(svc)} className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"><FiEdit2 size={16} /></button>
//                       <button onClick={() => handleDelete(svc._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {services.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No services yet</td></tr>}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal */}
//       {modal && (
//         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-serif font-semibold">{editing ? 'Edit Service' : 'Add New Service'}</h2>
//               <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="label">Service Name *</label>
//                 <input className="input-field" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
//               </div>
//               <div>
//                 <label className="label">Description *</label>
//                 <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="label">Category</label>
//                   <select className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
//                     {['facial', 'hair', 'makeup', 'spa', 'nails', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="label">Duration (minutes) *</label>
//                   <input type="number" className="input-field" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} required />
//                 </div>
//               </div>
//               <div>
//                 <label className="label">Price (₹) *</label>
//                 <input type="number" className="input-field" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required />
//               </div>
//               <div>
//                 <label className="label">Service Image</label>
//                 <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="input-field" />
//               </div>
//               <div className="flex items-center gap-3">
//                 <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
//                 <label htmlFor="isActive" className="text-sm text-gray-600">Active (visible to customers)</label>
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button type="button" onClick={() => setModal(false)} className="flex-1 btn-secondary text-sm py-2.5">Cancel</button>
//                 <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
//                   {saving ? <LoadingSpinner size="sm" /> : null}
//                   {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminServices;
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/api';
import { SERVICE_CATEGORIES } from '../../utils/constants';

const CATEGORY_OPTIONS = SERVICE_CATEGORIES.filter(c => c.id); // drop the "All Services" entry

const defaultForm = {
  name: '',
  description: '',
  category: 'skin',
  subcategory: '',
  duration: '',
  durationLabel: '',
  price: '',
  priceLabel: '',
  bookable: true,
  isActive: true,
};

const emptyVariant = { label: '', price: '' };

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [variants, setVariants] = useState([]); // [{label, price}]
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchServices = () => {
    setLoading(true);
    api.get('/services').then(({ data }) => setServices(data.services)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const openModal = (service = null) => {
    if (service) {
      setEditing(service._id);
      setForm({
        name: service.name,
        description: service.description,
        category: service.category,
        subcategory: service.subcategory || '',
        duration: service.duration ?? '',
        durationLabel: service.durationLabel || '',
        price: service.price,
        priceLabel: service.priceLabel || '',
        bookable: service.bookable !== false,
        isActive: service.isActive,
      });
      setVariants(service.variants && service.variants.length ? service.variants : []);
    } else {
      setEditing(null);
      setForm(defaultForm);
      setVariants([]);
    }
    setImageFile(null);
    setModal(true);
  };

  // ---- Variants (e.g. Waxing: Regular / Chocolate / Rica) ----
  const addVariant = () => setVariants(v => [...v, { ...emptyVariant }]);
  const updateVariant = (index, key, value) =>
    setVariants(v => v.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  const removeVariant = (index) => setVariants(v => v.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));

      // Only send fully-filled variant rows; strip empty ones the user added and abandoned
      const cleanVariants = variants
        .filter(v => v.label.trim() && v.price !== '')
        .map(v => ({ label: v.label.trim(), price: Number(v.price) }));
      fd.append('variants', JSON.stringify(cleanVariants));

      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await api.put(`/services/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Service updated');
      } else {
        await api.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Service created');
      }
      setModal(false);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      fetchServices();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-charcoal">Manage Services</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                {['Service', 'Category', 'Duration', 'Price', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map(svc => (
                <tr key={svc._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {svc.imageUrl && <img src={svc.imageUrl} alt={svc.name} className="w-10 h-10 rounded-lg object-cover" />}
                      <div>
                        <div className="text-sm font-medium text-charcoal">{svc.name}</div>
                        <div className="text-xs text-gray-400 line-clamp-1">{svc.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="capitalize">{svc.category}</div>
                    {svc.subcategory && <div className="text-xs text-gray-400">{svc.subcategory}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {svc.bookable === false ? '—' : (svc.durationLabel || `${svc.duration} min`)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-charcoal">
                    {svc.variants && svc.variants.length > 0
                      ? svc.variants.map(v => `${v.label}: ₹${v.price?.toLocaleString()}`).join(' / ')
                      : `₹${svc.price?.toLocaleString()}${svc.priceLabel ? ` ${svc.priceLabel}` : ''}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${svc.isActive ? 'badge-confirmed' : 'badge-cancelled'}`}>
                      {svc.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {svc.bookable === false && (
                      <span className="badge badge-pending ml-1">Enquiry only</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openModal(svc)} className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"><FiEdit2 size={16} /></button>
                      <button onClick={() => handleDelete(svc._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No services yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-semibold">{editing ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Service Name *</label>
                <input className="input-field" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORY_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Subcategory</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Facials, Waxing, Hair Cutting"
                    value={form.subcategory}
                    onChange={e => setForm(p => ({ ...p, subcategory: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="bookable"
                  checked={form.bookable}
                  onChange={e => setForm(p => ({ ...p, bookable: e.target.checked }))}
                />
                <label htmlFor="bookable" className="text-sm text-gray-600">
                  Bookable (shows "Book Now" with a time slot). Turn off for courses / enquiry-only items — shows "Enquire" instead.
                </label>
              </div>

              {form.bookable && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Duration (minutes) *</label>
                    <input type="number" className="input-field" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} required={form.bookable} />
                  </div>
                  <div>
                    <label className="label">Duration Label (optional)</label>
                    <input
                      className="input-field"
                      placeholder="e.g. 6 Months, 1 Day"
                      value={form.durationLabel}
                      onChange={e => setForm(p => ({ ...p, durationLabel: e.target.value }))}
                    />
                  </div>
                </div>
              )}
              {!form.bookable && (
                <div>
                  <label className="label">Duration Label</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 6 Months, 1 Month, 10 Days"
                    value={form.durationLabel}
                    onChange={e => setForm(p => ({ ...p, durationLabel: e.target.value }))}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (₹) *</label>
                  <input type="number" className="input-field" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required />
                  <p className="text-xs text-gray-400 mt-1">Base price. If this service has multiple price tiers, add them below instead.</p>
                </div>
                <div>
                  <label className="label">Price Label (optional)</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Onward, per strip"
                    value={form.priceLabel}
                    onChange={e => setForm(p => ({ ...p, priceLabel: e.target.value }))}
                  />
                </div>
              </div>

              {/* Variants: multi-tier pricing, e.g. Waxing Regular / Chocolate / Rica */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Price Variants (optional)</label>
                  <button type="button" onClick={addVariant} className="text-xs text-gold font-medium hover:underline">
                    + Add tier
                  </button>
                </div>
                {variants.length === 0 && (
                  <p className="text-xs text-gray-400 mb-2">No variants — this service uses the single price above.</p>
                )}
                <div className="space-y-2">
                  {variants.map((v, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        className="input-field flex-1"
                        placeholder="Label (e.g. Regular, Chocolate, Rica)"
                        value={v.label}
                        onChange={e => updateVariant(i, 'label', e.target.value)}
                      />
                      <input
                        type="number"
                        className="input-field w-28"
                        placeholder="Price"
                        value={v.price}
                        onChange={e => updateVariant(i, 'price', e.target.value)}
                      />
                      <button type="button" onClick={() => removeVariant(i)} className="p-2 text-gray-400 hover:text-red-500">
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Service Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="input-field" />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
                <label htmlFor="isActive" className="text-sm text-gray-600">Active (visible to customers)</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 btn-secondary text-sm py-2.5">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
                  {saving ? <LoadingSpinner size="sm" /> : null}
                  {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;