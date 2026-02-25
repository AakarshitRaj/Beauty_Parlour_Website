// Format currency in INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date nicely
export const formatDate = (date, style = 'medium') => {
  return new Date(date).toLocaleDateString('en-IN', { dateStyle: style });
};

// Truncate text
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Calculate advance payment amount
export const calculateAdvance = (total, percent = 30) => {
  return Math.ceil((total * percent) / 100);
};

// Get status badge class
export const getStatusClass = (status) => {
  const map = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    cancelled: 'badge-cancelled',
    completed: 'badge-completed',
    unpaid: 'badge-unpaid',
    partial: 'badge-partial',
    paid: 'badge-paid',
  };
  return map[status] || 'badge';
};

// Time slots for booking
export const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM',
];

// Service categories
export const SERVICE_CATEGORIES = [
  { id: '', label: 'All Services', emoji: '✨' },
  { id: 'facial', label: 'Facials', emoji: '🧖' },
  { id: 'hair', label: 'Hair Care', emoji: '💇' },
  { id: 'makeup', label: 'Makeup', emoji: '💄' },
  { id: 'spa', label: 'Spa', emoji: '🛁' },
  { id: 'nails', label: 'Nails', emoji: '💅' },
  { id: 'other', label: 'Other', emoji: '⭐' },
];

// Default service images by category
export const DEFAULT_IMAGES = {
  facial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  hair: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
  makeup: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600',
  spa: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
  nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600',
  other: 'https://images.unsplash.com/photo-1560066984-138daaa14d4a?w=600',
};
