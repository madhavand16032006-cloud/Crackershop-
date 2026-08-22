import React, { useState } from 'react';
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
  Phone
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { SearchModal } from '../common/SearchModal';
import { getWhatsAppUrl } from '../../utils/whatsapp';

export const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { shopSettings } = useShop();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const phone = shopSettings?.whatsapp || '918122580372';
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'About Us', path: '/about' },
    { label: 'Safety Guide', path: '/safety' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Festival Announcement Bar */}
      {shopSettings?.announcement && (
        <div id="top-announcement-bar" className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-slate-950 px-3 py-1.5 text-xs font-extrabold text-center tracking-wide flex items-center justify-center gap-2 shadow-inner">
          <Flame className="w-3.5 h-3.5 fill-slate-950 animate-bounce" />
          <span className="truncate">{shopSettings.announcement}</span>
          <span className="hidden md:inline text-slate-950 font-normal">| Factory Direct Sivakasi</span>
        </div>
      )}

      {/* Main Sticky Header */}
      <header id="main-header" className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Mobile Left: Menu Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo */}
            <Link to="/" id="header-logo-link" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-950/40">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg text-white leading-tight tracking-tight flex items-center gap-1.5">
                  Sivakasi <span className="text-amber-400">Fireworks</span>
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Direct Factory Wholesale
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  id={`nav-link-${link.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'text-amber-400 bg-slate-900 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Action Icons & Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                id="header-search-btn"
                onClick={() => setSearchOpen(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-2 transition-colors"
                aria-label="Search fireworks"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline text-xs text-slate-400">Search products...</span>
              </button>

              {/* WhatsApp direct order button */}
              <a
                id="header-whatsapp-btn"
                href={getWhatsAppUrl(
                  phone,
                  `🎆 Hello ${shopName}, I would like to explore your latest fireworks wholesale price list for Diwali 2026.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-bold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              {/* Shopping Cart Button */}
              <Link
                to="/cart"
                id="header-cart-btn"
                className="relative p-2 sm:px-3.5 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-950/20 active:scale-95"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Cart</span>
                {totalItems > 0 && (
                  <span
                    id="cart-badge-count"
                    className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 text-xs font-extrabold flex items-center justify-center border border-amber-400"
                  >
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Admin Portal link */}
              <Link
                to="/admin"
                id="header-admin-link"
                className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-colors ${
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

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-menu-backdrop" className="fixed inset-0 z-50 bg-black/80 lg:hidden flex">
            <div className="bg-slate-950 border-r border-slate-800 w-4/5 max-w-xs h-full p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-white text-base">Sivakasi Fireworks</span>
                  </div>
                  <button
                    id="close-mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation links */}
                <div className="py-4 space-y-1.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive(link.path)
                          ? 'text-amber-400 bg-slate-900 border border-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <a
                  href={`tel:${shopSettings?.phone || '+918122580372'}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  Call: {shopSettings?.phone || '+91 81225 80372'}
                </a>

                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 text-amber-300 text-xs font-bold border border-amber-500/30"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Shop Owner Admin Login
                </Link>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
