import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import api from '../utils/api';

const RazorpayButton = ({ bookingId, amount, serviceName, userInfo, onSuccess, label }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePay = async () => {
    setLoading(true);
    try {
      const { data: order } = await api.post('/payments/create-order', {
        bookingId,
        amount,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Glow & Glam',
        description: serviceName ? `Booking: ${serviceName}` : 'Beauty Service Booking',
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const { data } = await api.post('/payments/verify', {
              ...response,
              bookingId,
            });
            toast.success('Payment successful!');
            if (onSuccess) onSuccess(data);
          } catch {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: userInfo || {},
        theme: { color: '#C9A96E' },
        modal: { ondismiss: () => setLoading(false) },
      };

      if (!window.Razorpay) {
        toast.error('Razorpay not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed to initiate');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="btn-primary flex items-center justify-center gap-2 w-full"
    >
      {loading ? <LoadingSpinner size="sm" /> : null}
      {loading ? 'Processing...' : (label || `Pay ₹${amount?.toLocaleString()}`)}
    </button>
  );
};

export default RazorpayButton;
