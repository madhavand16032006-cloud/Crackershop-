import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  Printer,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Phone,
  Clock
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { OmtechoLogo } from '../components/common/OmtechoLogo';
import { formatCurrency, generateWhatsAppOrderMessage, getWhatsAppUrl } from '../utils/whatsapp';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { shopSettings, showToast } = useShop();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const phone = shopSettings?.whatsapp || '918122580372';
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await api.getOrder(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCopyMessage = () => {
    if (!order) return;
    const msg = generateWhatsAppOrderMessage(order, shopSettings || undefined);
    navigator.clipboard.writeText(msg);
    setCopied(true);
    showToast('Order details copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenWhatsApp = () => {
    if (!order) return;
    const msg = generateWhatsAppOrderMessage(order, shopSettings || undefined);
    window.open(getWhatsAppUrl(phone, msg), '_blank');
    api.markWhatsAppSent(order.id);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-400">
        <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
        <p className="text-sm">Retrieving your Sivakasi order summary...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <p className="text-xs text-slate-400">We could not locate this order record.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div id="order-confirmation-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
          Order Registered in Sivakasi Database
        </span>

        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Order {order.orderNumber} Generated!
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Your order has been recorded. Please make sure the generated message is sent to our shop WhatsApp to finalize packing and delivery.
        </p>
      </div>

      {/* Main WhatsApp Actions Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-emerald-900/50">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              WhatsApp Direct Order Link
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Send this order directly to shop owner at <span className="text-emerald-300 font-mono">+{phone}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleOpenWhatsApp}
              id="open-whatsapp-order-btn"
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              Open WhatsApp Now
            </button>

            <button
              onClick={handleCopyMessage}
              id="copy-order-msg-btn"
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors shrink-0"
              title="Copy formatted message to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Message Preview Box */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Generated WhatsApp Message Text:
          </label>
          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed border border-slate-800 overflow-x-auto whitespace-pre-wrap select-all">
            {generateWhatsAppOrderMessage(order, shopSettings || undefined)}
          </pre>
        </div>
      </div>

      {/* Printable Invoice / Order Summary Receipt */}
      <div id="printable-order-slip" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <OmtechoLogo size="md" subtitleText="Official Order Receipt" />
            <p className="text-xs text-slate-400 mt-1">
              Order ID: <span className="text-amber-400 font-mono font-bold">{order.orderNumber}</span> • {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Receipt</span>
          </button>
        </div>

        {/* Customer Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-semibold uppercase text-[10px] block">Customer Name</span>
            <span className="text-white font-bold text-sm">{order.customer.fullName}</span>
            <div className="mt-2 text-slate-300">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Contact</span>
              <span>Mobile: {order.customer.mobile}</span>
              {order.customer.whatsapp && (
                <span className="block">WhatsApp: {order.customer.whatsapp}</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-semibold uppercase text-[10px] block">Delivery Address</span>
            <p className="text-slate-200 mt-0.5 leading-relaxed">
              {order.customer.address}, {order.customer.city} - {order.customer.pincode}
            </p>
            {order.customer.notes && (
              <p className="mt-2 text-amber-300 italic text-[11px]">
                Note: "{order.customer.notes}"
              </p>
            )}
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Items Ordered ({order.totalItems} Units)
          </h4>

          <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-slate-500 font-mono">{idx + 1}.</span>
                  <div>
                    <h5 className="font-bold text-white">{item.productName}</h5>
                    <span className="text-[11px] text-slate-400">{item.category} {item.pieceCount ? `(${item.pieceCount})` : ''}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-slate-300 font-mono">{item.quantity} × {formatCurrency(item.price)}</span>
                  <div className="font-bold text-amber-400 text-sm">{formatCurrency(item.subtotal)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          {order.totalSavings > 0 && (
            <div className="flex items-center justify-between text-emerald-400 font-medium">
              <span>Total Sivakasi Factory Discount:</span>
              <span>- {formatCurrency(order.totalSavings)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-base font-black text-white pt-2 border-t border-slate-800">
            <span>Estimated Total:</span>
            <span className="text-amber-400 text-xl font-mono">{formatCurrency(order.totalAmount)}</span>
          </div>

          <div className="text-[11px] text-slate-400 text-center pt-2">
            Status: <span className="text-amber-400 font-bold">{order.status}</span> • Payment: To be confirmed by shop upon WhatsApp review
          </div>
        </div>
      </div>

      {/* Next Steps Guide */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          What Happens Next?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="font-bold text-amber-400">Step 1: Shop Confirmation</span>
            <p className="text-slate-400">Our shop manager reviews your order on WhatsApp and confirms fresh factory batch availability.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="font-bold text-amber-400">Step 2: Safe Payment Details</span>
            <p className="text-slate-400">Shop shares official UPI/Bank account details for order settlement according to transport rules.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="font-bold text-amber-400">Step 3: Dispatch & LR Copy</span>
            <p className="text-slate-400">Your fireworks box is packed with moisture seal and dispatched with Lorry Receipt (LR) tracking slip.</p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping Catalogue
        </Link>

        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          Need assistance? Call Factory: {shopSettings?.phone || '+91 98421 78901'}
        </a>
      </div>
    </div>
  );
};
