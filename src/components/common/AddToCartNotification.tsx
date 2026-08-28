import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, X, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/whatsapp';

export const AddToCartNotification: React.FC = () => {
  const { lastAddedNotification, dismissAddedNotification, totalItems, subtotal } = useCart();

  useEffect(() => {
    if (!lastAddedNotification) return;
    const timer = setTimeout(() => {
      dismissAddedNotification();
    }, 4500);
    return () => clearTimeout(timer);
  }, [lastAddedNotification, dismissAddedNotification]);

  if (!lastAddedNotification) return null;

  const { product, quantity } = lastAddedNotification;
  const itemTotal = product.price * quantity;

  return (
    <div
      id="add-to-cart-success-bottom-bar"
      className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-full max-w-md z-[90] animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto select-none"
    >
      <div className="bg-slate-950/95 backdrop-blur-md border-2 border-amber-500/80 rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-amber-950/60 text-white space-y-3">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5 leading-none">
                <span>Order Added to Cart Successfully!</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h4>
            </div>
          </div>
          <button
            type="button"
            id="close-add-cart-toast"
            onClick={dismissAddedNotification}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
            />
            <div className="min-w-0">
              <p className="font-bold text-xs sm:text-sm text-white truncate">
                {product.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-300">
                <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-semibold text-amber-400">
                  Qty: {quantity}
                </span>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(itemTotal)}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/cart"
            onClick={dismissAddedNotification}
            id="view-cart-banner-btn"
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-950/30 hover:scale-[1.02] active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View Cart ({totalItems})</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>

        {/* Bottom micro-summary */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 pt-1 border-t border-slate-900">
          <span>Total Cart Value: <strong className="text-amber-400 font-bold">{formatCurrency(subtotal)}</strong></span>
          <span className="text-emerald-400 font-semibold">Ready for WhatsApp Wholesale Order</span>
        </div>
      </div>
    </div>
  );
};
