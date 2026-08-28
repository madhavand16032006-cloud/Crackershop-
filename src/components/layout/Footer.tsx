import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Award,
  Clock,
  Heart
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { OmtechoLogo } from '../common/OmtechoLogo';
import { getWhatsAppUrl } from '../../utils/whatsapp';

export const Footer: React.FC = () => {
  const { shopSettings, categories } = useShop();

  const phone = shopSettings?.whatsapp || '918122580372';
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  return (
    <footer id="main-footer" className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-16 pb-20 lg:pb-8">
      {/* Top Value Badges Section */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">100% Genuine Sivakasi</h4>
                <p className="text-xs text-slate-400 mt-0.5">Manufactured with direct factory quality standards.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Green Crackers Certified</h4>
                <p className="text-xs text-slate-400 mt-0.5">CSIR-NEERI approved low emission & safe formulation.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">WhatsApp Direct Order</h4>
                <p className="text-xs text-slate-400 mt-0.5">Quick order confirmation directly with shop owner.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Fast Dispatch Across India</h4>
                <p className="text-xs text-slate-400 mt-0.5">Safe transport packaging for all major cities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center group">
              <OmtechoLogo size="lg" subtitleText="Direct Sivakasi Factory Fireworks" />
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {shopSettings?.description ||
                'Direct from Sivakasi, the fireworks capital of India. Explore premium Sparklers, Sky Shots, Flower Pots, Ground Chakkars, and Assorted Gift Boxes at wholesale rates with direct WhatsApp ordering.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={getWhatsAppUrl(phone, `🎆 Hello ${shopName}, I would like to place an order.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>

              <a
                href={`tel:${shopSettings?.phone || '+918122580372'}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                Call Shop
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Explore
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-amber-400 transition-colors">All Fireworks Catalogue</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-amber-400 transition-colors">Product Categories</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-amber-400 transition-colors">My Cart / Review Order</Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-amber-400 font-semibold transition-colors text-amber-400/90">My Orders & Live Tracking</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">About Sivakasi Heritage</Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-amber-400 transition-colors">Fireworks Safety Guide</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-400 transition-colors">FAQ & Ordering Steps</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Categories
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.slug || cat.name)}`}
                    className="hover:text-amber-400 transition-colors truncate block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Factory & Contact */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Factory Location
            </h5>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {shopSettings?.address || '142/3-B, Sattur Road, Sivakasi'}, {shopSettings?.city || 'Sivakasi'}, {shopSettings?.state || 'Tamil Nadu'} - {shopSettings?.pincode || '626123'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${shopSettings?.phone || '+918122580372'}`} className="hover:text-white transition-colors">
                  {shopSettings?.phone || '+91 81225 80372'}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${shopSettings?.email || 'orders@sivakasifireworks.com'}`} className="hover:text-white transition-colors truncate">
                  {shopSettings?.email || 'orders@sivakasifireworks.com'}
                </a>
              </div>

              {shopSettings?.licenseNumber && (
                <div className="text-[11px] text-slate-500 bg-slate-900 p-2 rounded-lg border border-slate-800">
                  Govt. Lic. No: <span className="text-slate-300 font-mono">{shopSettings.licenseNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-10 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">
            📜 Statutory Notice & Compliance (As per 2018 Supreme Court & Tamil Nadu Explosives Rules):
          </p>
          <p>
            Due to fireworks transport and safety regulations in India, no online transactions or instant payments are accepted on this portal. This website serves as an electronic catalogue. All customer requests are processed via direct shop communication and WhatsApp confirmation. Delivery and booking terms apply according to local state regulations.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {shopName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/safety" className="hover:text-slate-300 transition-colors">Safety Pledge</Link>
            <Link to="/faq" className="hover:text-slate-300 transition-colors">Terms of Order</Link>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem('sivakasi_intro_viewed');
                window.location.reload();
              }}
              className="hover:text-amber-400 text-slate-400 transition-colors flex items-center gap-1"
              title="Replay Fuse Ignition & Fireworks Intro"
            >
              <span>🎆 Replay Intro</span>
            </button>
            <Link to="/admin" className="hover:text-amber-400 transition-colors font-medium">Store Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
