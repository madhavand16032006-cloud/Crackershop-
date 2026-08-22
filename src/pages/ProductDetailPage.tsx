import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Plus,
  Minus,
  ShieldCheck,
  Flame,
  Volume2,
  Package,
  ArrowLeft,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { formatCurrency, getWhatsAppUrl } from '../utils/whatsapp';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { shopSettings } = useShop();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const phone = shopSettings?.whatsapp || '918122580372';
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await api.getProduct(id);
        setProduct(data);
        setQuantity(1);

        // Fetch related products from same category
        if (data.categoryId || data.category) {
          const related = await api.getProducts({
            categoryId: data.categoryId,
            activeOnly: true
          });
          setRelatedProducts(related.filter((p) => p.id !== data.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading product details from Sivakasi factory...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-slate-400">The fireworks item you requested might have been updated or removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  const handleWhatsAppOrder = () => {
    const text = `🎆 Hello ${shopName},

I would like to order:
*${product.name}*
Category: ${product.category}
Pack Size: ${product.pieceCount || 'Standard'}
Quantity: ${quantity}
Estimated Price: ${formatCurrency(product.price * quantity)}

Please confirm order and delivery schedule.`;
    window.open(getWhatsAppUrl(phone, text), '_blank');
  };

  return (
    <div id="product-detail-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      {/* Breadcrumb / Back Link */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Fireworks
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-4/3 sm:aspect-square group">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Flame className="w-4 h-4 fill-slate-950" />
                {discountPercent}% FACTORY DISCOUNT
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                  Currently Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Specifications & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Category & Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                {product.category}
              </span>
              {product.featured && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  Featured Choice
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {product.name}
            </h1>

            {/* Pricing Section */}
            <div className="mt-4 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-amber-400">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-slate-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/40">
                    Save {formatCurrency(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Direct factory wholesale price • Inclusive of all taxes</p>
          </div>

          {/* Description */}
          <div className="border-t border-b border-slate-800 py-4 space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <Package className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Packaging</span>
                  <span className="text-xs font-bold text-white">{product.pieceCount || '1 Standard Pack'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Sound Rating</span>
                  <span className="text-xs font-bold text-white">{product.soundLevel || 'Medium Decibel'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quantity</span>
              <div className="flex items-center border border-slate-700 bg-slate-950 rounded-xl overflow-hidden p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs text-slate-400">
                Total: <span className="font-bold text-amber-400 text-sm">{formatCurrency(product.price * quantity)}</span>
              </div>
            </div>

            {/* Add to Cart & WhatsApp Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <button
                type="button"
                id="detail-add-to-cart-btn"
                onClick={() => addToCart(product, quantity)}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isOutOfStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/20 active:scale-98'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Shopping Cart'}
              </button>

              <button
                type="button"
                id="detail-whatsapp-btn"
                onClick={handleWhatsAppOrder}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition-all border border-emerald-400/30 active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Order on WhatsApp
              </button>
            </div>
          </div>

          {/* Safety & Factory Pledge */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Sivakasi Factory Quality Assurance</span>
            </div>
            <p className="leading-relaxed">
              Certified Green Cracker made with CSIR-NEERI approved formulations. Store in cool, dry place away from open heat. Adult supervision mandatory when lighting for children.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              More from {product.category}
            </h3>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs text-amber-400 hover:underline font-bold"
            >
              View Category
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
