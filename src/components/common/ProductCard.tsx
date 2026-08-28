import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, MessageCircle, Plus, Minus, Flame, Sparkles, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';
import { formatCurrency, getWhatsAppUrl } from '../../utils/whatsapp';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { shopSettings } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [isJustAdded, setIsJustAdded] = useState(false);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;

  const handleWhatsAppQuickOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phone = shopSettings?.whatsapp || '919842178901';
    const text = `🎆 Hello ${shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks'},

I would like to order:
*${product.name}* (${product.pieceCount || '1 Pack'})
Quantity: ${quantity}
Estimated Price: ${formatCurrency(product.price * quantity)}

Please confirm availability and share order confirmation.`;
    window.open(getWhatsAppUrl(phone, text), '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, quantity);
      setIsJustAdded(true);
      setTimeout(() => {
        setIsJustAdded(false);
      }, 1800);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/20 flex flex-col justify-between"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-slate-950" />
            {discountPercent}% OFF
          </div>
        )}

        {/* Featured Tag */}
        {product.featured && (
          <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-amber-300 font-semibold text-[11px] px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Featured
          </div>
        )}

        {/* Stock status overlay if out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Piece info */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="text-amber-400/90 font-medium truncate max-w-[65%]">
              {product.category}
            </span>
            {product.pieceCount && (
              <span className="text-slate-400 text-[11px] truncate bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
                {product.pieceCount}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-amber-400 transition-colors">
            <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Price Section */}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-extrabold text-amber-400">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-slate-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock hint */}
          {isLowStock && !isOutOfStock && (
            <p className="text-[11px] text-orange-400 font-medium mt-1">
              ⚡ Only {product.stock} left in Sivakasi factory!
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
          {/* Quantity + Add to Cart */}
          {!isOutOfStock ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-xl px-2 py-1">
                <span className="text-[11px] text-slate-400 font-medium">Qty</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    id={`dec-qty-${product.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-slate-200">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    id={`inc-qty-${product.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setQuantity(Math.min(product.stock || 99, quantity + 1));
                    }}
                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                id={`add-to-cart-btn-${product.id}`}
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-98 whitespace-nowrap ${
                  isJustAdded
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 ring-offset-2 ring-offset-slate-900 scale-102'
                    : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950'
                }`}
              >
                {isJustAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 text-center"
            >
              Out of Stock
            </button>
          )}

          {/* Quick Action Secondary Row */}
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <Link
              to={`/product/${product.id}`}
              id={`view-details-${product.id}`}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/50 text-[11px] font-medium"
            >
              <Eye className="w-3 h-3 shrink-0" />
              <span className="truncate">Details</span>
            </Link>

            <button
              type="button"
              id={`quick-whatsapp-${product.id}`}
              onClick={handleWhatsAppQuickOrder}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-700/40 text-[11px] font-medium"
              title="Order on WhatsApp directly"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
