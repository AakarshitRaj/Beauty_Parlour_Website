import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  // Start as true — prevents any redirect until we finish checking
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      // Restore from localStorage immediately (no flicker)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch { /* corrupt data */ }
      }

      // Then verify with server in background
      const token = localStorage.getItem('token');
      if (!token && !document.cookie.includes('token')) {
        // No token at all — definitely not logged in
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me', { _skipRedirect: true });
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch {
        // Token invalid — clear everything silently (no redirect here)
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
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
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