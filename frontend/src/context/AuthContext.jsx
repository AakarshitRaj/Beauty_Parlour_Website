import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — verify session by calling /api/auth/me
  // This works whether token is in httpOnly cookie or localStorage
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Try to restore from localStorage first (fast, no network)
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        // Then verify with server (catches expired/invalid tokens)
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch {
        // Token invalid or expired — clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = async (phone, password) => {
    const { data } = await api.post('/auth/login', { phone, password });

    // Token is now set as httpOnly cookie by the server automatically
    // Also store in localStorage as fallback for older sessions
    if (data.token) localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);

    if (data.token) localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      // Tell server to clear the httpOnly cookie
      await api.post('/auth/logout');
    } catch { /* ignore network errors on logout */ }

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};