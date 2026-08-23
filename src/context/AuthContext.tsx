import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { api } from '../services/api';
import { useShop } from './ShopContext';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('sivakasi_admin_token');
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useShop();

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('sivakasi_admin_token');
      const storedUser = localStorage.getItem('sivakasi_admin_user');
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch {
          localStorage.removeItem('sivakasi_admin_token');
          localStorage.removeItem('sivakasi_admin_user');
        }
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const login = async (usernameOrEmail: string, pass: string): Promise<boolean> => {
    try {
      const data = await api.login(usernameOrEmail, pass);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('sivakasi_admin_token', data.token);
      localStorage.setItem('sivakasi_admin_user', JSON.stringify(data.user));
      showToast(`Welcome back, ${data.user.name}!`);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Invalid username or password', 'error');
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sivakasi_admin_token');
    localStorage.removeItem('sivakasi_admin_user');
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
