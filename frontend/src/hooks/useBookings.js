import { useState, useEffect } from 'react';
import api from '../utils/api';

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    await api.put(`/bookings/${id}/cancel`);
    fetchBookings();
  };

  return { bookings, loading, error, refetch: fetchBookings, cancelBooking };
};

export default useBookings;
