import { useState, useEffect } from 'react';
import api from '../utils/api';

const useServices = (category = '') => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = category ? { category } : {};
        const { data } = await api.get('/services', { params });
        setServices(data.services);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [category]);

  return { services, loading, error };
};

export default useServices;
