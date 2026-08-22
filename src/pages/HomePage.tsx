import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Award,
  Truck,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  ShoppingBag,
  Gift,
  Zap,
  Phone
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { CategoryCard } from '../components/common/CategoryCard';
import { Product } from '../types';
import { api } from '../services/api';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const HomePage: React.FC = () => {
  const { shopSettings, categories } = useShop();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [giftBoxProducts, setGiftBoxProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const phone = shopSettings?.whatsapp || '918122580372';
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [allFeatured, allGiftBoxes] = await Promise.all([
          api.getProducts({ featured: true, activeOnly: true }),
          api.getProducts({ category: 'Family Gift Boxes & Combos', activeOnly: true })
        ]);
        setFeaturedProducts(allFeatured.slice(0, 8));
        setGiftBoxProducts(allGiftBoxes.slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const faqs = [
    {
      q: 'How does ordering on WhatsApp work without an online payment gateway?',
      a: 'Simply browse our catalogue, add your favourite crackers to the cart, fill in your delivery details, and click "Order on WhatsApp". Your complete order is formatted automatically and sent to our shop owner on WhatsApp. We will confirm stock availability and share dispatch schedule and payment instructions.'
    },
    {
      q: 'Are all your fireworks genuine Sivakasi Green Crackers?',
      a: 'Yes! 100% of our crackers are manufactured in Sivakasi following CSIR-NEERI green cracker formulation rules, using eco-friendly chemical compositions with 30-35% reduced emissions and low smoke output.'
    },
    {
      q: 'What is the minimum order amount?',
      a: `Our minimum order amount for direct factory shipping is ${shopSettings?.minimumOrderAmount ? `₹${shopSettings.minimumOrderAmount}` : '₹500'}. For large bulk and family orders, we offer special wholesale packing.`
    },
    {
      q: 'How are fireworks delivered to my city?',
      a: 'We ship through authorized road transport cargo operators with certified explosive-safe wooden and corrugated moisture-proof packaging across Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, Kerala, and other Indian states.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section id="hero-section" className="relative overflow-hidden pt-6 sm:pt-10">
        {/* Background gradient decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold shadow-sm">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Diwali 2026 Factory Wholesale Direct</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Celebrate Brighter with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">
                  Sivakasi Fireworks
                </span>
              </h1>

              {/* Supporting text */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Explore our collection of quality fireworks and send your order directly to our shop through WhatsApp. Direct factory pricing with up to 60% festival discount!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to="/products"
                  id="hero-explore-products-btn"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-950/40 hover:scale-102 active:scale-98 transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Explore Products
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={getWhatsAppUrl(
                    phone,
                    `🎆 Hello ${shopName}, I would like to get the latest 2026 Diwali fireworks price list and order details.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-order-whatsapp-btn"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 hover:scale-102 active:scale-98 transition-all border border-emerald-400/30"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  Order on WhatsApp
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 text-left">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">100% Sivakasi Origin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">Green Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">No Advance Online Pay</span>
                </div>
              </div>
            </div>

            {/* Right Banner Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-950/40 group">
                <img
                  src={shopSettings?.banner || "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80"}
                  alt="Sivakasi Fireworks Celebration"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-4/3 object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Floating promo card inside banner */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Festival Special</span>
                    <h4 className="text-sm sm:text-base font-extrabold text-white">Diwali Mega Hamper 2026</h4>
                    <p className="text-xs text-slate-300">55 Varieties for Family Joy</p>
                  </div>
                  <Link
                    to="/products?category=Family%20Gift%20Boxes%20%26%20Combos"
                    className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors shrink-0"
                  >
                    View Combos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW WHATSAPP ORDERING WORKS (4 SIMPLE STEPS) */}
      <section id="ordering-steps-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Simple & Transparent</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              How WhatsApp Direct Ordering Works
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              No complicated logins or online payment gateways. Fast, direct communication with the Sivakasi factory.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-lg border border-amber-500/20">
                1
              </div>
              <h3 className="text-base font-bold text-white">Browse Catalogue</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore Sparklers, Flower Pots, Chakkars, Sky Shots, and Diwali Gift Boxes at wholesale rates.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-lg border border-amber-500/20">
                2
              </div>
              <h3 className="text-base font-bold text-white">Add to Cart</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose quantities and see live calculations of item subtotals and massive factory discounts.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-lg border border-amber-500/20">
                3
              </div>
              <h3 className="text-base font-bold text-white">Enter Customer Details</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your name, phone number, and delivery city for dispatch calculations. No account required!
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-emerald-950/40 border border-emerald-700/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg border border-emerald-500/40">
                4
              </div>
              <h3 className="text-base font-bold text-emerald-300">Order on WhatsApp</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                One click automatically formats the order and opens WhatsApp. The shop owner confirms stock and delivery!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES SHOWCASE */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Factory Varieties</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Explore by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-amber-400 hover:text-amber-300 text-sm font-bold flex items-center gap-1.5 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section id="featured-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>Handpicked Bestsellers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Featured Sivakasi Fireworks
            </h2>
          </div>
          <Link
            to="/products"
            className="text-amber-400 hover:text-amber-300 text-sm font-bold flex items-center gap-1.5 group"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. DIWALI GIFT BOXES SPOTLIGHT */}
      {giftBoxProducts.length > 0 && (
        <section id="gift-boxes-spotlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-950 border border-amber-500/40 p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/30">
                  <Gift className="w-3.5 h-3.5" />
                  All-in-One Family Value Packs
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Diwali Mega Gift Boxes & Family Combos
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Hand-curated assortments containing complete varieties of sparklers, pots, chakkars, and sky shots with 50% factory discount.
                </p>
              </div>

              <Link
                to="/products?category=Family%20Gift%20Boxes%20%26%20Combos"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shrink-0"
              >
                Browse All Gift Boxes
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {giftBoxProducts.map((box) => (
                <ProductCard key={box.id} product={box} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. WHY BUY DIRECT FROM SIVAKASI */}
      <section id="why-sivakasi-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Heritage & Value</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Why Order Directly from Sivakasi?
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Sivakasi produces over 90% of India's fireworks with century-old artisanal expertise and certified safety standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Direct Factory Prices</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Skip middlemen markups. Receive pure factory wholesale rates with up to 60% savings compared to retail festival stalls.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Fresh Stock & High Performance</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              No damp, expired old inventory. Freshly manufactured batches ensure 100% burst reliability, vibrant colours, and sustained height.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Truck className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Moisture-Proof Safe Packing</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every shipment is packed in heavy-duty dry corrugated boxes with waterproof wrapping for transit protection to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section id="testimonials-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Customer Trust</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            What Our Customers Say
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Trusted by thousands of families and apartment associations across India every festival season.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              "Ordering on WhatsApp was surprisingly smooth! We picked the 55-item Mega Gift Box plus extra 30-shot sky cakes for our apartment in Chennai. Everything arrived in dry, intact packaging."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm">
                MK
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">M. Karthikeyan</h4>
                <p className="text-xs text-slate-400">Anna Nagar, Chennai</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              "The wholesale prices are real factory rates. We saved nearly ₹4,000 compared to local Bangalore stalls. The green sparklers and Peacock fountain were huge hits with the kids!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
                SR
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Sneha Reddy</h4>
                <p className="text-xs text-slate-400">Whitefield, Bengaluru</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              "The shop owner was very courteous on WhatsApp. He gave us customized packing for our corporate team club and sent regular transport parcel tracking numbers."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-sm">
                VN
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">V. Narayanan</h4>
                <p className="text-xs text-slate-400">RS Puram, Coimbatore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="home-faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-amber-400 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. BIG WHATSAPP CALL TO ACTION BANNER */}
      <section id="cta-whatsapp-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 border border-emerald-500/40 p-8 sm:p-12 text-center shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
              <MessageCircle className="w-8 h-8 fill-emerald-400 text-emerald-950" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Ready to Order Genuine Sivakasi Fireworks?
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Explore our full catalogue, add your favourite items to cart, and send directly to the shop owner on WhatsApp for prompt confirmation and festival discounts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base transition-colors shadow-lg"
              >
                Browse Full Catalogue
              </Link>
              <a
                href={getWhatsAppUrl(
                  phone,
                  `🎆 Hello ${shopName}, I would like to place an order from your Sivakasi Fireworks website.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950" />
                Chat with Shop Owner
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
