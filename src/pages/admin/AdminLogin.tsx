import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Sparkles, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { showToast, shopSettings } = useShop();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('sivakasi@2026');
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
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      showToast('Welcome back, Sivakasi Shop Manager!');
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl font-bold">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Shop Manager Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks'}
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Admin Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  id="admin-username-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  id="admin-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Credentials Box */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-semibold">Shop Owner Credentials:</span>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('sivakasi@2026');
                    showToast('Credentials filled!');
                  }}
                  className="text-amber-400 hover:text-amber-300 underline font-medium text-[10px]"
                >
                  Auto-Fill
                </button>
              </div>
              <div className="flex justify-between text-slate-300 font-mono text-[10px]">
                <span>User: <strong>admin</strong> (or 8122580372)</span>
                <span>Pass: <strong>sivakasi@2026</strong></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="admin-login-submit-btn"
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-950/40"
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
            className="text-xs text-slate-400 hover:text-amber-400 font-medium transition-colors"
          >
            ← Back to Customer Fireworks Store
          </Link>
        </div>
      </div>
    </div>
  );
};
