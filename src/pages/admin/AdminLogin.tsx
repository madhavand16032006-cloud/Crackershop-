import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { OmtechoLogo } from '../../components/common/OmtechoLogo';

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { shopSettings } = useShop();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to admin dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(username.trim(), password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-login-page" className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <OmtechoLogo size="lg" subtitleText="Owner Control Panel" />
          </div>
          <p className="text-xs text-slate-400">
            Sign in to manage orders, fireworks inventory, prices, and settings.
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          {error && (
            <div
              id="admin-login-error-msg"
              className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center font-medium"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label htmlFor="admin-username-input" className="block text-slate-300 font-semibold mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  id="admin-username-input"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password-input" className="block text-slate-300 font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  id="admin-password-input"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  id="admin-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="admin-login-submit-btn"
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-950/40 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Back to Customer website */}
        <div className="text-center">
          <Link
            to="/"
            id="back-to-store-link"
            className="text-xs text-slate-400 hover:text-amber-400 font-medium transition-colors"
          >
            ← Back to Customer Fireworks Store
          </Link>
        </div>
      </div>
    </div>
  );
};
