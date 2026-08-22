import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, MessageCircle, Phone, MapPin, Sparkles, Lock } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { api } from '../../services/api';
import { ShopSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { shopSettings, showToast, refreshShopData } = useShop();

  const [formData, setFormData] = useState<Partial<ShopSettings>>({
    shopName: '',
    tagline: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    licenseNumber: '',
    minimumOrderAmount: 500,
    announcement: '',
    banner: '',
    description: ''
  });

  const [adminPassword, setAdminPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (shopSettings) {
      setFormData({
        shopName: shopSettings.shopName || '',
        tagline: shopSettings.tagline || '',
        phone: shopSettings.phone || '',
        whatsapp: shopSettings.whatsapp || '',
        email: shopSettings.email || '',
        address: shopSettings.address || '',
        city: shopSettings.city || '',
        state: shopSettings.state || '',
        pincode: shopSettings.pincode || '',
        licenseNumber: shopSettings.licenseNumber || '',
        minimumOrderAmount: shopSettings.minimumOrderAmount || 500,
        announcement: shopSettings.announcement || '',
        banner: shopSettings.banner || '',
        description: shopSettings.description || ''
      });
    }
  }, [shopSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shopName?.trim() || !formData.whatsapp?.trim()) {
      showToast('Shop Name and WhatsApp Number are required!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.updateSettings({
        ...formData,
        adminPassword: adminPassword.trim() || undefined
      });
      showToast('Shop profile and WhatsApp settings updated successfully!');
      setAdminPassword('');
      refreshShopData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="admin-settings-page" className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Shop Profile & WhatsApp Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your Sivakasi shop branding, the WhatsApp number where customer orders are routed, and factory credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: WhatsApp & Contact Integration */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base border-b border-slate-800 pb-3">
            <MessageCircle className="w-5 h-5" />
            <h3>WhatsApp Order Destination</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Owner WhatsApp Number (e.g. 8122580372 or 918122580372) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 8122580372 or 918122580372"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Normalized:{' '}
                  <strong className="text-emerald-400 font-mono">
                    +{formData.whatsapp?.replace(/\D/g, '').length === 10 ? `91${formData.whatsapp.replace(/\D/g, '')}` : formData.whatsapp?.replace(/\D/g, '') || '918122580372'}
                  </strong>
                </span>
                <a
                  href={`https://wa.me/${formData.whatsapp?.replace(/\D/g, '').length === 10 ? `91${formData.whatsapp.replace(/\D/g, '')}` : formData.whatsapp?.replace(/\D/g, '') || '918122580372'}?text=Test%20from%20Sivakasi%20Fireworks%20Admin`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 underline font-medium"
                >
                  Test WhatsApp Link ↗
                </a>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Factory Phone Number (for Voice Calls)
              </label>
              <input
                type="text"
                placeholder="e.g. +91 81225 80372"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Displayed across headers and footers for voice calling.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Store Branding & Identity */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5" />
            <h3>Store Branding & Announcement</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Shop Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Top Announcement Bar (Header Banner)
              </label>
              <input
                type="text"
                value={formData.announcement}
                onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                placeholder="🔥 Diwali 2026 Direct Factory Wholesale Booking Open • Up to 60% Savings!"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Shop Bio / Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Hero Banner Image URL
              </label>
              <input
                type="url"
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Factory Address & Minimum Order */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-base border-b border-slate-800 pb-3">
            <MapPin className="w-5 h-5" />
            <h3>Factory Address & Order Policies</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Street / Factory Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  PESO / Govt License Number
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs font-mono"
                  placeholder="e.g. E/SC/TN/20/1429(E52234)"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Minimum Order Amount for Dispatch (₹)
                </label>
                <input
                  type="number"
                  min={100}
                  value={formData.minimumOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minimumOrderAmount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs font-mono font-bold text-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Security Password Update */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base border-b border-slate-800 pb-3">
            <Lock className="w-5 h-5" />
            <h3>Admin Login Password</h3>
          </div>

          <div className="text-xs space-y-2">
            <label className="block text-slate-300 font-semibold">
              New Admin Password <span className="text-slate-500 font-normal">(Leave blank to keep current password)</span>
            </label>
            <input
              type="password"
              placeholder="Enter new password if changing..."
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full sm:w-1/2 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm flex items-center gap-2 transition-colors shadow-lg shadow-amber-950/40"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Saving Settings...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
