import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, ShoppingBag, MessageCircle, PackageCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';
import { SearchModal } from '../common/SearchModal';
import { getWhatsAppUrl } from '../../utils/whatsapp';

export const MobileBottomNav: React.FC = () => {
  const { totalItems } = useCart();
  const { shopSettings } = useShop();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const phone = shopSettings?.whatsapp || '918122580372';
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  const isHome = location.pathname === '/';
  const isCategories = location.pathname.startsWith('/categories');
  const isOrders = location.pathname.startsWith('/my-orders') || location.pathname.startsWith('/orders');
  const isCart = location.pathname.startsWith('/cart');

  return (
    <>
      <nav
        id="mobile-bottom-navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 lg:hidden py-1.5 px-2 safe-area-pb"
      >
        <div className="flex items-center justify-around">
          {/* Home */}
          <Link
            to="/"
            id="mobile-nav-home"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] sm:text-[11px] font-medium transition-colors ${
              isHome ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </Link>

          {/* Categories */}
          <Link
            to="/categories"
            id="mobile-nav-categories"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] sm:text-[11px] font-medium transition-colors ${
              isCategories ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span>Categories</span>
          </Link>

          {/* My Orders */}
          <Link
            to="/my-orders"
            id="mobile-nav-my-orders"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] sm:text-[11px] font-medium transition-colors ${
              isOrders ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PackageCheck className="w-5 h-5 mb-0.5" />
            <span className={isOrders ? 'font-bold' : ''}>My Orders</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            id="mobile-nav-cart"
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] sm:text-[11px] font-medium transition-colors ${
              isCart ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5" />
              {totalItems > 0 && (
                <span
                  id="mobile-cart-badge"
                  className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center"
                >
                  {totalItems}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>

          {/* WhatsApp */}
          <a
            id="mobile-nav-whatsapp"
            href={getWhatsAppUrl(
              phone,
              `🎆 Hello ${shopName}, I would like to place an order from your Sivakasi Fireworks catalogue.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] sm:text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
          >
            <MessageCircle className="w-5 h-5 mb-0.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </nav>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
