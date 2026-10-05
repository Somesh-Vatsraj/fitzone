import { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fitzone_token');
    if (!token) { setLoading(false); return; }
    api.auth.me()
      .then(a => setAdmin(a))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await api.auth.login(username, password);
    setToken(res.token);
    setAdmin({ username: res.username });
    return res;
  };

  const setup = async (username, password) => {
    const res = await api.auth.setup(username, password);
    setToken(res.token);
    setAdmin({ username: res.username });
    return res;
  };

  const logout = async () => {
    try { await api.auth.logout(); } catch {}
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, setup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
