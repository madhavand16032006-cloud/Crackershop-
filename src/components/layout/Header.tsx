import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Search,
  MessageCircle,
  Menu,
  X,
  ShieldCheck,
  Flame,
  UserCheck,
  Phone,
  Palette,
  Layers,
  Home,
  Package,
  PackageCheck,
  Info,
  HelpCircle,
  MapPin,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { SearchModal } from '../common/SearchModal';
import { OmtechoLogo } from '../common/OmtechoLogo';
import { getWhatsAppUrl } from '../../utils/whatsapp';

export type FestiveTheme = 'gold' | 'crimson' | 'emerald' | 'cosmic';

interface ThemeOption {
  id: FestiveTheme;
  name: string;
  badge: string;
  colorClass: string;
  bgPreview: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'gold',
    name: 'Diwali Gold',
    badge: '🎆 Sivakasi Glow',
    colorClass: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
    bgPreview: 'from-amber-500 to-orange-500'
  },
  {
    id: 'crimson',
    name: 'Crimson Spark',
    badge: '💥 Red Bombs',
    colorClass: 'text-rose-400 border-rose-500/40 bg-rose-950/40',
    bgPreview: 'from-rose-500 to-red-600'
  },
  {
    id: 'emerald',
    name: 'Emerald Eco',
    badge: '🌿 Green Cracker',
    colorClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
    bgPreview: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Sky',
    badge: '🌌 Night Aerial',
    colorClass: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
    bgPreview: 'from-cyan-500 to-indigo-500'
  }
];

export const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { shopSettings, categories, showToast } = useShop();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<FestiveTheme>(() => {
    return (localStorage.getItem('sivakasi_festive_theme') as FestiveTheme) || 'gold';
  });

  const phone = shopSettings?.whatsapp || '918122580372';
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  const handleThemeChange = (themeId: FestiveTheme) => {
    setActiveTheme(themeId);
    localStorage.setItem('sivakasi_festive_theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    showToast(`Festive theme changed to ${THEME_OPTIONS.find(t => t.id === themeId)?.name}!`, 'info');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'All Fireworks', path: '/products', icon: Package },
    { label: 'Categories', path: '/categories', icon: Layers },
    { label: 'My Orders', path: '/my-orders', icon: PackageCheck },
    { label: 'Safety Guide', path: '/safety', icon: ShieldCheck },
    { label: 'About Us', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: MapPin },
    { label: 'FAQ', path: '/faq', icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Running 60% Offer Marquee Ticker */}
      <div id="top-announcement-bar" className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 overflow-hidden border-b border-amber-600/40 select-none">
        <Link
          to="/products?sort=discount&offers=true"
          className="flex items-center h-8 sm:h-9 hover:opacity-95 transition-opacity"
          title="Click to view 60% Festive Offers"
        >
          {/* Static Left Badge */}
          <div className="shrink-0 z-10 px-2.5 sm:px-3.5 h-full bg-slate-950 text-amber-400 flex items-center gap-1.5 font-black text-[10px] sm:text-xs uppercase tracking-wider border-r border-amber-500/40 shadow-md">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="hidden xs:inline">60% OFF</span>
            <span className="xs:hidden">60%</span>
            <span className="hidden sm:inline bg-amber-500 text-slate-950 text-[9px] px-1 py-0.2 rounded font-extrabold">LIVE</span>
          </div>

          {/* Running Ticker Content Track */}
          <div className="relative flex-1 overflow-hidden h-full flex items-center">
            <div className="animate-ticker flex items-center text-[11px] sm:text-xs font-black tracking-wide uppercase py-1 whitespace-nowrap">
              {/* Loop Track 1 */}
              <div className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8 shrink-0">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                  DIWALI 2026 PRE-BOOKING: FLAT 60% FACTORY DISCOUNT!
                </span>
                <span className="flex items-center gap-1.5">
                  ⚡ SIVAKASI DIRECT FACTORY PRICING • 100% GENUINE GREEN CRACKERS
                </span>
                <span className="flex items-center gap-1.5">
                  🎁 FREE FESTIVE GIFT BOX ON ORDERS ABOVE ₹3,000
                </span>
                <span className="flex items-center gap-1.5 bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                  👉 TAP HERE TO VIEW ALL 60% OFFERS &amp; PRE-BOOK
                </span>
              </div>

              {/* Loop Track 2 (Exact duplicate for seamless infinite flow) */}
              <div className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8 shrink-0" aria-hidden="true">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                  DIWALI 2026 PRE-BOOKING: FLAT 60% FACTORY DISCOUNT!
                </span>
                <span className="flex items-center gap-1.5">
                  ⚡ SIVAKASI DIRECT FACTORY PRICING • 100% GENUINE GREEN CRACKERS
                </span>
                <span className="flex items-center gap-1.5">
                  🎁 FREE FESTIVE GIFT BOX ON ORDERS ABOVE ₹3,000
                </span>
                <span className="flex items-center gap-1.5 bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                  👉 TAP HERE TO VIEW ALL 60% OFFERS &amp; PRE-BOOK
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Trigger */}
          <div className="hidden md:flex shrink-0 z-10 px-3 h-full bg-slate-950/20 hover:bg-slate-950/30 items-center gap-1 text-[11px] font-extrabold text-slate-950">
            <span>View Offers</span>
            <span>➔</span>
          </div>
        </Link>
      </div>

      {/* Main Sticky Header */}
      <header id="main-header" className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
            {/* Mobile Left: Menu Hamburger Button */}
            <div className="flex items-center lg:hidden shrink-0">
              <button
                type="button"
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800/80 focus:outline-none flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                aria-label="Open navigation menu and festive themes"
              >
                <Menu className="w-5 h-5 text-amber-400" />
                <span className="hidden sm:inline text-xs font-bold text-slate-300">Menu</span>
              </button>
            </div>

            {/* Logo */}
            <Link
              to="/"
              id="header-logo-link"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center group shrink-0 min-w-0 max-w-[55%] sm:max-w-none"
            >
              <OmtechoLogo size="responsive" subtitleText="Sivakasi Fireworks" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    id={`nav-link-${link.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                      isActive(link.path)
                        ? 'text-amber-400 bg-slate-900 border border-amber-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 opacity-70" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Desktop Festive Theme Selector Button */}
              <button
                type="button"
                id="desktop-theme-toggle-btn"
                onClick={() => setMobileMenuOpen(true)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-400 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 flex items-center gap-1.5 transition-colors ml-1"
                title="Change Festive Color Theme"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Themes</span>
              </button>
            </nav>

            {/* Right Action Icons & Buttons */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              {/* Search Button */}
              <button
                type="button"
                id="header-search-btn"
                onClick={() => setSearchOpen(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-2 transition-colors active:scale-95"
                aria-label="Search fireworks"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline text-xs text-slate-400">Search products...</span>
              </button>

              {/* WhatsApp direct order button (Desktop/Tablet only) */}
              <a
                id="header-whatsapp-btn"
                href={getWhatsAppUrl(
                  phone,
                  `🎆 Hello ${shopName}, I would like to explore your latest fireworks wholesale price list for Diwali 2026.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-bold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              {/* Shopping Cart Button */}
              <Link
                to="/cart"
                id="header-cart-btn"
                className="relative p-2 sm:px-3.5 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 sm:gap-2 transition-all shadow-md shadow-amber-950/20 active:scale-95 shrink-0"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-bold">Cart</span>
                {totalItems > 0 && (
                  <span
                    id="cart-badge-count"
                    className="min-w-4 sm:min-w-5 h-4 sm:h-5 px-1 rounded-full bg-slate-950 text-amber-400 text-[10px] sm:text-xs font-extrabold flex items-center justify-center border border-amber-400"
                  >
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Admin Portal link */}
              <Link
                to="/admin"
                id="header-admin-link"
                className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-colors active:scale-95 ${
                  isAuthenticated
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Shop Owner Admin Dashboard"
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden md:inline">{isAuthenticated ? 'Admin' : 'Owner'}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer with Festive Themes & Menu Items (Full Screen Portal) */}
      {mobileMenuOpen && (
        <div id="mobile-menu-backdrop" className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm lg:hidden flex">
          <div className="bg-slate-950 border-r border-slate-800 w-5/6 max-w-xs h-full p-4 sm:p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200 shadow-2xl">
            <div className="space-y-4">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <OmtechoLogo size="sm" subtitleText="Menu & Themes" />
                <button
                  type="button"
                  id="close-mobile-menu-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Festive Theme Selector */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Palette className="w-3.5 h-3.5" />
                    Festive Color Themes
                  </span>
                  <span className="text-[10px] text-slate-500">Pick Style</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {THEME_OPTIONS.map((th) => (
                    <button
                      type="button"
                      key={th.id}
                      onClick={() => handleThemeChange(th.id)}
                      className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between text-xs ${
                        activeTheme === th.id
                          ? `${th.colorClass} ring-1 ring-amber-400/50 shadow-sm`
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${th.bgPreview}`} />
                        {activeTheme === th.id && <Check className="w-3 h-3 text-amber-400" />}
                      </div>
                      <span className="font-bold text-[11px] mt-1">{th.name}</span>
                      <span className="text-[9px] opacity-75">{th.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Navigation Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
                  Website Navigation
                </span>
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive(link.path)
                          ? 'text-amber-400 bg-slate-900 border border-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 text-amber-400/80" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Quick Category Badges */}
              {categories && categories.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block">
                    Cracker Categories
                  </span>
                  <div className="flex flex-wrap gap-1 px-1">
                    {categories.slice(0, 8).map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${cat.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-800"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
              <a
                href={`tel:${shopSettings?.phone || '+918122580372'}`}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                Call: {shopSettings?.phone || '+91 81225 80372'}
              </a>

              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 text-amber-300 text-xs font-bold border border-amber-500/30"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Shop Owner Admin Login
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

