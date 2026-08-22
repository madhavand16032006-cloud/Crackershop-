import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Flame,
  MessageCircle,
  Truck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { formatCurrency, generateWhatsAppOrderMessage, getWhatsAppUrl } from '../utils/whatsapp';
import { CustomerDetails } from '../types';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    totalOriginalPrice,
    totalSavings
  } = useCart();

  const { shopSettings, showToast } = useShop();
  const navigate = useNavigate();

  // Customer Details Form State
  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: '',
    mobile: '',
    whatsapp: '',
    address: '',
    city: '',
    pincode: '',
    notes: ''
  });

  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const phone = shopSettings?.whatsapp || '918122580372';
  const minOrder = shopSettings?.minimumOrderAmount || 500;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.trim().replace(/\D/g, ''))) {
      errs.mobile = 'Please enter a valid 10-digit mobile number';
    }
    if (!sameAsMobile) {
      if (!formData.whatsapp.trim() || !/^\d{10}$/.test(formData.whatsapp.trim().replace(/\D/g, ''))) {
        errs.whatsapp = 'Please enter a valid 10-digit WhatsApp number';
      }
    }
    if (!formData.address.trim()) errs.address = 'Please enter your delivery street address';
    if (!formData.city.trim()) errs.city = 'Please enter your delivery city / town';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Please enter a valid 6-digit postal pincode';
    }
    if (subtotal < minOrder) {
      errs.orderAmount = `Minimum order amount for Sivakasi direct dispatch is ${formatCurrency(minOrder)}`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrderAndWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the highlighted form fields.', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your shopping cart is empty!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const customerPayload: CustomerDetails = {
        fullName: formData.fullName.trim(),
        mobile: formData.mobile.trim(),
        whatsapp: sameAsMobile ? formData.mobile.trim() : formData.whatsapp.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim(),
        notes: formData.notes?.trim() || ''
      };

      const orderPayload = {
        customer: customerPayload,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      // 1. Create order record in backend database
      const createdOrder = await api.createOrder(orderPayload);

      // 2. Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // 3. Clear cart
      clearCart();

      // 4. Generate formatted WhatsApp message & URL
      const whatsappMsg = generateWhatsAppOrderMessage(createdOrder, shopSettings || undefined);
      const whatsappUrl = getWhatsAppUrl(phone, whatsappMsg);

      // 5. Open WhatsApp directly in new tab
      window.open(whatsappUrl, '_blank');

      // 6. Navigate to Order Confirmation screen
      navigate(`/order-confirmation/${createdOrder.id}`);
    } catch (err: any) {
      console.error('Order creation failed:', err);
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 text-amber-400 mx-auto flex items-center justify-center shadow-xl">
          <ShoppingBag className="w-10 h-10 text-slate-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You have not added any fireworks yet. Explore our Sivakasi factory catalogue and add your favourite crackers!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-colors shadow-lg shadow-amber-950/30"
        >
          <Sparkles className="w-4 h-4" />
          Explore Fireworks Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div id="cart-checkout-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-amber-400" />
            Review Your Order ({totalItems} Items)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Direct from Sivakasi factory • No online payment gateway required • Sent to shop WhatsApp
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-rose-800/50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Selected Fireworks</span>
              <span className="text-xs text-amber-400 font-normal">{cart.length} unique varieties</span>
            </h3>

            <div className="divide-y divide-slate-800/80">
              {cart.map(({ product, quantity }) => {
                const itemSubtotal = product.price * quantity;
                const itemOriginal = (product.originalPrice || product.price) * quantity;
                const itemSavings = itemOriginal - itemSubtotal;

                return (
                  <div
                    key={product.id}
                    id={`cart-item-${product.id}`}
                    className="py-4 first:pt-0 last:pb-0 flex items-center gap-3 sm:gap-4"
                  >
                    {/* Thumbnail */}
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 truncate">
                          {product.category}
                        </span>
                        {product.pieceCount && (
                          <span className="text-[10px] text-slate-400 truncate">
                            {product.pieceCount}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white truncate mt-0.5">
                        {product.name}
                      </h4>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-extrabold text-amber-400">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-slate-500 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center border border-slate-700 bg-slate-950 rounded-xl overflow-hidden p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-white">
                        {formatCurrency(itemSubtotal)}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
            <Truck className="w-5 h-5 text-amber-400 shrink-0" />
            <p>
              Packed with certified moisture-barrier seal in Sivakasi factory. Shipped via authorized parcel transport to your city.
            </p>
          </div>
        </div>

        {/* Right: Customer Details & Order on WhatsApp Card */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handlePlaceOrderAndWhatsApp}
            id="order-details-form"
            className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-5 shadow-2xl"
          >
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Direct Dispatch Details
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Customer Delivery Information
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                No account required. Please provide accurate details for WhatsApp order verification.
              </p>
            </div>

            {/* Error banner if order below minimum */}
            {errors.orderAmount && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.orderAmount}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-3.5 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  id="customer-fullname-input"
                  placeholder="e.g. Madhavan Krishnan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                    errors.fullName ? 'border-rose-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm`}
                />
                {errors.fullName && <p className="text-rose-400 text-[11px] mt-1">{errors.fullName}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  10-Digit Mobile Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  id="customer-mobile-input"
                  placeholder="e.g. 9840123456"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                    errors.mobile ? 'border-rose-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono`}
                />
                {errors.mobile && <p className="text-rose-400 text-[11px] mt-1">{errors.mobile}</p>}
              </div>

              {/* WhatsApp checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameAsMobile}
                    onChange={(e) => setSameAsMobile(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>WhatsApp number is the same as Mobile</span>
                </label>
              </div>

              {/* WhatsApp number if different */}
              {!sameAsMobile && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    WhatsApp Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="customer-whatsapp-input"
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                      errors.whatsapp ? 'border-rose-500' : 'border-slate-700'
                    } text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono`}
                  />
                  {errors.whatsapp && <p className="text-rose-400 text-[11px] mt-1">{errors.whatsapp}</p>}
                </div>
              )}

              {/* Delivery Address */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Street / Flat / Door Address <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="customer-address-input"
                  rows={2}
                  placeholder="e.g. Plot 24, 2nd Main Road, Shanti Nagar"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border ${
                    errors.address ? 'border-rose-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs`}
                />
                {errors.address && <p className="text-rose-400 text-[11px] mt-1">{errors.address}</p>}
              </div>

              {/* City & Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    City / Town <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="customer-city-input"
                    placeholder="e.g. Chennai / Madurai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                      errors.city ? 'border-rose-500' : 'border-slate-700'
                    } text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm`}
                  />
                  {errors.city && <p className="text-rose-400 text-[11px] mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Postal Pincode <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="customer-pincode-input"
                    placeholder="e.g. 600028"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                      errors.pincode ? 'border-rose-500' : 'border-slate-700'
                    } text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono`}
                  />
                  {errors.pincode && <p className="text-rose-400 text-[11px] mt-1">{errors.pincode}</p>}
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Special Notes / Packing Instructions <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please include extra sparklers, need delivery by Friday"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            {/* Price Breakdown Calculation */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Original Catalogue Value</span>
                <span className="line-through">{formatCurrency(totalOriginalPrice)}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span>Factory Wholesale Savings</span>
                  <span>- {formatCurrency(totalSavings)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>Estimated Total</span>
                <span className="text-amber-400 text-xl">{formatCurrency(subtotal)}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center font-medium">
                💳 Payment: To be confirmed by shop upon WhatsApp review
              </div>
            </div>

            {/* Submit Button: Order on WhatsApp */}
            <button
              type="submit"
              id="submit-order-whatsapp-btn"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition-all border border-emerald-400/40 hover:scale-101 active:scale-99"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              {submitting ? 'Generating Order...' : 'Review & Order on WhatsApp'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
