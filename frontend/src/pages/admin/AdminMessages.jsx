import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiMail, FiTrash2, FiCheck, FiMessageSquare, FiEye, FiX, FiFilter } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/api';

const statusColors = {
  unread:  'bg-red-100 text-red-700',
  read:    'bg-blue-100 text-blue-700',
  replied: 'bg-green-100 text-green-700',
};

const AdminMessages = () => {
  const [messages, setMessages]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [selected, setSelected]   = useState(null);
  const [filter, setFilter]       = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving]       = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = async (status = '') => {
    setLoading(true);
    setError('');
    try {
      const params = status ? { status } : {};
      const { data } = await api.get('/contact', { params });
      setMessages(data.messages || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      const msg = err.response?.status === 429
        ? 'Rate limit hit — please wait a moment and try again.'
        : err.response?.status === 401
        ? 'Session expired — please log in again.'
        : err.response?.data?.message || err.message || 'Failed to load messages';
      setError(msg);
      setMessages([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(filter); }, [filter]);

  const openMessage = async (msg) => {
    setSelected(msg);
    setAdminNote(msg.adminNote || '');
    // Auto-mark as read when opened
    if (msg.status === 'unread') {
      try {
        await api.put(`/contact/${msg._id}`, { status: 'read' });
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, status: 'read' } : m));
        setUnreadCount(c => Math.max(0, c - 1));
      } catch { /* silent */ }
    }
  };

  const handleUpdate = async (status) => {
    if (!selected) return;
    setSaving(true);
    try {
      const { data } = await api.put(`/contact/${selected._id}`, { status, adminNote });
      toast.success(`Marked as ${status}`);
      setSelected(data.contact);
      setMessages(prev => prev.map(m => m._id === data.contact._id ? data.contact : m));
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success('Message deleted');
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch { toast.error('Failed to delete'); }
  };

  const formatDate = (d) => new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal flex items-center gap-3">
            Contact Messages
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-400 mt-1">Messages submitted via the Contact page</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { val: '',        label: 'All' },
          { val: 'unread',  label: '🔴 Unread' },
          { val: 'read',    label: '🔵 Read' },
          { val: 'replied', label: '✅ Replied' },
        ].map(f => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f.val
                ? 'bg-gold text-white shadow-sm'
                : 'bg-white text-gray-500 hover:text-gold border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-16"><LoadingSpinner size="md" /></div>
            ) : error ? (
              <div className="text-center py-16 px-6">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiX size={24} className="text-red-400" />
                </div>
                <p className="text-sm font-medium text-red-500 mb-1">Failed to load messages</p>
                <p className="text-xs text-gray-400 mb-5">{error}</p>
                <button
                  onClick={() => fetchMessages(filter)}
                  className="px-5 py-2 bg-gold text-white text-sm font-medium rounded-xl hover:bg-gold/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FiMail size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No messages found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {messages.map(msg => (
                  <div
                    key={msg._id}
                    onClick={() => openMessage(msg)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selected?._id === msg._id ? 'bg-gold/5 border-l-4 border-gold' : ''
                    } ${msg.status === 'unread' ? 'bg-red-50/30' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {msg.status === 'unread' && (
                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                          )}
                          <p className={`text-sm font-semibold text-charcoal truncate ${msg.status === 'unread' ? 'font-bold' : ''}`}>
                            {msg.name}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 truncate mb-1">{msg.email}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{msg.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`badge text-xs ${statusColors[msg.status]}`}>{msg.status}</span>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(msg._id); }}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 mt-2">{formatDate(msg.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-serif font-semibold text-charcoal">{selected.name}</h2>
                  <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-400">
                    <a href={`mailto:${selected.email}`} className="hover:text-gold flex items-center gap-1">
                      <FiMail size={13} /> {selected.email}
                    </a>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="hover:text-gold">📞 {selected.phone}</a>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-1">{formatDate(selected.createdAt)}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={20} />
                </button>
              </div>

              {/* Status badge */}
              <div className="mb-5">
                <span className={`badge ${statusColors[selected.status]} text-sm`}>{selected.status}</span>
              </div>

              {/* Message */}
              <div className="bg-cream rounded-xl p-5 mb-6">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Message</p>
                <p className="text-charcoal leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {/* Admin Note */}
              <div className="mb-5">
                <label className="label">Internal Note (admin only)</label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Add a note about this inquiry..."
                  className="input-field resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your inquiry at Arpan's Beauty Zone %26 Academy`}
                  onClick={() => handleUpdate('replied')}
                  className="btn-primary flex items-center gap-2 text-sm py-2.5"
                >
                  <FiMail size={15} /> Reply via Email
                </a>
                {selected.status !== 'replied' && (
                  <button
                    onClick={() => handleUpdate('replied')}
                    disabled={saving}
                    className="btn-secondary flex items-center gap-2 text-sm py-2.5"
                  >
                    <FiCheck size={15} />
                    {saving ? 'Saving...' : 'Mark as Replied'}
                  </button>
                )}
                {selected.status === 'unread' && (
                  <button
                    onClick={() => handleUpdate('read')}
                    disabled={saving}
                    className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-full border border-gray-200 text-gray-500 hover:border-gold hover:text-gold transition-all"
                  >
                    <FiEye size={15} /> Mark as Read
                  </button>
                )}
                <button
                  onClick={() => { handleUpdate(selected.status); }}
                  disabled={saving}
                  className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-full border border-gray-200 text-gray-500 hover:border-gold hover:text-gold transition-all"
                >
                  {saving ? <LoadingSpinner size="sm" /> : null}
                  Save Note
                </button>
                <button
                  onClick={() => handleDelete(selected._id)}
                  className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-full border border-red-200 text-red-400 hover:bg-red-50 transition-all ml-auto"
                >
                  <FiTrash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-64 text-gray-300">
              <FiMessageSquare size={40} className="mb-3" />
              <p className="text-sm">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;