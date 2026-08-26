import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, MessageCircle, Phone, MapPin, Sparkles, Lock, User, Image, CreditCard } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { ShopSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { shopSettings, showToast, refreshShopData, updateSettings } = useShop();
  const { user, setUserProfile } = useAuth();

  const [formData, setFormData] = useState<Partial<ShopSettings>>({
    shopName: '',
    tagline: '',
    ownerName: '',
    ownerPhoto: '',
    logo: '',
    banner: '',
    phone: '',
    whatsapp: '',
    email: '',
    upiId: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    licenseNumber: '',
    minimumOrderAmount: 500,
    announcement: '',
    festivalSeason: '',
    description: ''
  });

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (shopSettings) {
      setFormData({
        shopName: shopSettings.shopName || '',
        tagline: shopSettings.tagline || '',
        ownerName: shopSettings.ownerName || '',
        ownerPhoto: shopSettings.ownerPhoto || '',
        logo: shopSettings.logo || '',
        banner: shopSettings.banner || '',
        phone: shopSettings.phone || '',
        whatsapp: shopSettings.whatsapp || '',
        email: shopSettings.email || '',
        upiId: shopSettings.upiId || '',
        address: shopSettings.address || '',
        city: shopSettings.city || '',
        state: shopSettings.state || '',
        pincode: shopSettings.pincode || '',
        licenseNumber: shopSettings.licenseNumber || '',
        minimumOrderAmount: shopSettings.minimumOrderAmount || 500,
        announcement: shopSettings.announcement || '',
        festivalSeason: shopSettings.festivalSeason || '',
        description: shopSettings.description || ''
      });
    }
    if (user?.username) {
      setAdminUsername(user.username);
    }
  }, [shopSettings, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shopName?.trim() || !formData.whatsapp?.trim()) {
      showToast('Shop Name and WhatsApp Number are required!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const updated = await updateSettings({
        ...formData,
        adminName: formData.ownerName,
        adminUsername: adminUsername.trim() || undefined,
        adminEmail: formData.email,
        adminPassword: adminPassword.trim() || undefined
      });

      if (user) {
        setUserProfile({
          ...user,
          name: formData.ownerName || user.name,
          username: adminUsername.trim() || user.username,
          email: formData.email || user.email
        });
      }

      setAdminPassword('');
      await refreshShopData();
      showToast('Owner profile & shop details saved permanently!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="admin-settings-page" className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Shop Profile & Owner Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your Sivakasi shop branding, owner credentials, WhatsApp order destination, and factory policies. Changes stay saved across reloads.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Owner Details & Login Credentials */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base border-b border-slate-800 pb-3">
            <User className="w-5 h-5" />
            <h3>Owner Profile & Login Credentials</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Owner Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                id="settings-owner-name"
                placeholder="e.g. Madhavan"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Owner Login Username
              </label>
              <input
                type="text"
                id="settings-owner-username"
                placeholder="e.g. Madhavan"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Owner Photo URL
              </label>
              <input
                type="url"
                id="settings-owner-photo"
                placeholder="https://images.unsplash.com/..."
                value={formData.ownerPhoto}
                onChange={(e) => setFormData({ ...formData, ownerPhoto: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Owner / Official Email
              </label>
              <input
                type="email"
                id="settings-owner-email"
                placeholder="e.g. madhavan@srimeenakshifireworks.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-800">
              <label className="block text-slate-300 font-semibold mb-1">
                Update Login Password <span className="text-slate-500 font-normal">(Leave blank to keep existing password)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="settings-new-password"
                  placeholder="Enter new password if you want to change it..."
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: WhatsApp & Contact Integration */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base border-b border-slate-800 pb-3">
            <MessageCircle className="w-5 h-5" />
            <h3>WhatsApp Order Destination & Contact</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Owner WhatsApp Number (e.g. 8122580372) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                id="settings-whatsapp-num"
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
                Factory Calling Phone Number
              </label>
              <input
                type="text"
                id="settings-phone-num"
                placeholder="e.g. +91 81225 80372"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                UPI ID (for Order QR & Direct Payments)
              </label>
              <input
                type="text"
                id="settings-upi-id"
                placeholder="e.g. madhavan.fireworks@okaxis"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Festival Season Title
              </label>
              <input
                type="text"
                id="settings-festival-season"
                placeholder="e.g. Diwali 2026 Mega Celebration"
                value={formData.festivalSeason}
                onChange={(e) => setFormData({ ...formData, festivalSeason: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Store Branding & Identity */}
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
                  id="settings-shop-name"
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
                  id="settings-tagline"
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
                id="settings-announcement"
                value={formData.announcement}
                onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs font-semibold"
                placeholder="💥 DIWALI 2026 PRE-BOOKING OPEN! Get up to 60% Factory Discount on Early WhatsApp Orders!"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Shop Bio / Description
              </label>
              <textarea
                rows={3}
                id="settings-bio"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Hero Banner Image URL
                </label>
                <input
                  type="url"
                  id="settings-banner-url"
                  value={formData.banner}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Shop Logo Image URL
                </label>
                <input
                  type="url"
                  id="settings-logo-url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Factory Address & Minimum Order */}
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
                id="settings-address"
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
                  id="settings-city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">State</label>
                <input
                  type="text"
                  id="settings-state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pincode</label>
                <input
                  type="text"
                  id="settings-pincode"
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
                  id="settings-license"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs font-mono"
                  placeholder="e.g. SIV/EXP/TN/2026/4489"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Minimum Order Amount for Dispatch (₹)
                </label>
                <input
                  type="number"
                  min={100}
                  id="settings-min-order"
                  value={formData.minimumOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minimumOrderAmount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs font-mono font-bold text-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            id="settings-save-button"
            disabled={submitting}
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center gap-2 transition-colors shadow-lg shadow-amber-950/40"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Saving Settings...' : 'Save All Changes Permanently'}
          </button>
        </div>
      </form>
    </div>
  );
};
