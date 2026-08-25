import axios from 'axios';

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || '/api',
  timeout:         15000,
  withCredentials: true,
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — but NEVER redirect if it's a session-check call
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isSessionCheck = error.config?.url?.includes('/auth/me');
    const isLoginPage    = window.location.pathname === '/login';

    if (error.response?.status === 401 && !isSessionCheck && !isLoginPage) {
      // Only redirect if it's NOT the session check and NOT already on login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;