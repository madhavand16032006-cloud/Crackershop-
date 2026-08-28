import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PackageCheck,
  Search,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Phone,
  Sparkles,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  FileText
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { formatCurrency, getWhatsAppUrl } from '../utils/whatsapp';

export const MyOrdersPage: React.FC = () => {
  const { shopSettings, showToast } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const phone = shopSettings?.whatsapp || '918122580372';
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  // Load orders stored in localStorage
  const loadSavedOrders = async () => {
    setLoading(true);
    try {
      const storedIds: string[] = JSON.parse(localStorage.getItem('sivakasi_placed_orders') || '[]');
      if (storedIds.length > 0) {
        const results = await api.lookupOrders({ ids: storedIds });
        setOrders(results);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Failed to load saved orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedOrders();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadSavedOrders();
      setSearched(false);
      return;
    }

    setSearching(true);
    setSearched(true);
    try {
      const results = await api.lookupOrders({ query: searchQuery.trim() });
      setOrders(results);
      if (results.length === 0) {
        showToast('No orders found matching that order number or mobile number', 'info');
      } else {
        showToast(`Found ${results.length} order(s)!`, 'success');
      }
    } catch (err) {
      console.error('Search failed:', err);
      showToast('Could not find order. Please verify the ID or Mobile number.', 'error');
    } finally {
      setSearching(false);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'NEW':
        return {
          label: 'Order Placed (Pending)',
          color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: Clock
        };
      case 'CONFIRMED':
        return {
          label: 'Confirmed by Factory',
          color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          icon: CheckCircle2
        };
      case 'PROCESSING':
        return {
          label: 'Packing in Sivakasi Warehouse',
          color: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          icon: Package
        };
      case 'READY':
        return {
          label: 'Dispatched / Ready for Delivery',
          color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
          icon: Truck
        };
      case 'COMPLETED':
        return {
          label: 'Delivered / Completed',
          color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          color: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: AlertCircle
        };
      default:
        return {
          label: status,
          color: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: Clock
        };
    }
  };

  const getStatusStepIndex = (status: Order['status']) => {
    const steps: Order['status'][] = ['NEW', 'CONFIRMED', 'PROCESSING', 'READY', 'COMPLETED'];
    return steps.indexOf(status);
  };

  return (
    <div id="my-orders-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <PackageCheck className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              My Orders & Live Tracking
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your Sivakasi fireworks order status, view receipts, and get live WhatsApp dispatch updates.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSavedOrders}
          className="self-start md:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Search & Track Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-amber-400" />
          Track Any Order
        </h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="order-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Order Number (#ORD1001) or 10-digit Mobile Number..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-amber-950/30"
          >
            {searching ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Track Order</span>
          </button>
          {searched && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearched(false);
                loadSavedOrders();
              }}
              className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Clear Search
            </button>
          )}
        </form>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16 space-y-3 text-slate-400">
          <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-sm">Fetching your Sivakasi orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">No Orders Found</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {searched
                ? 'No matching orders found with that Order ID or Mobile Number. Please check the spelling.'
                : 'You have not placed any orders from this device yet. Explore our wholesale Sivakasi catalogue!'}
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-amber-950/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Browse Sivakasi Fireworks</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {searched ? 'Search Results' : 'Recent Placed Orders'} ({orders.length})
            </span>
          </div>

          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              const StatusIcon = statusInfo.icon;
              const stepIndex = getStatusStepIndex(order.status);

              const trackMsg = `🎆 Hello ${shopName}, I would like to know the dispatch update for my Order ${order.orderNumber} (Placed on ${new Date(order.createdAt).toLocaleDateString('en-IN')}).`;

              return (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl hover:border-slate-700/80 transition-colors"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg font-black text-amber-400 font-mono">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block">Total Amount</span>
                      <span className="text-xl font-extrabold text-white">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Status Progress Bar (For non-cancelled orders) */}
                  {order.status !== 'CANCELLED' && (
                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Order Progress
                      </span>
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs">
                        {[
                          { label: 'Placed', idx: 0 },
                          { label: 'Confirmed', idx: 1 },
                          { label: 'Packed', idx: 2 },
                          { label: 'Dispatched', idx: 3 },
                          { label: 'Delivered', idx: 4 }
                        ].map((step) => {
                          const isDone = stepIndex >= step.idx;
                          const isCurrent = stepIndex === step.idx;

                          return (
                            <div key={step.label} className="space-y-1.5">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isDone
                                    ? 'bg-amber-500 shadow-sm shadow-amber-500/40'
                                    : 'bg-slate-800'
                                }`}
                              />
                              <span
                                className={`block truncate ${
                                  isCurrent
                                    ? 'text-amber-400 font-extrabold'
                                    : isDone
                                    ? 'text-slate-200 font-semibold'
                                    : 'text-slate-600'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Customer & Delivery Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
                        Customer & Contact
                      </span>
                      <p className="text-white font-semibold">{order.customer.fullName}</p>
                      <p className="text-slate-300">📞 {order.customer.mobile}</p>
                      {order.customer.whatsapp && order.customer.whatsapp !== order.customer.mobile && (
                        <p className="text-emerald-400">💬 WA: {order.customer.whatsapp}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
                        Delivery Destination
                      </span>
                      <p className="text-slate-300">{order.customer.address}</p>
                      <p className="text-amber-300/90 font-medium">
                        📍 {order.customer.city} - {order.customer.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Ordered Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)} boxes)
                    </span>
                    <div className="divide-y divide-slate-800/60 max-h-56 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=150&q=80'}
                              alt={item.productName}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate">{item.productName}</p>
                              <span className="text-[10px] text-slate-400">
                                {item.pieceCount ? `${item.pieceCount} • ` : ''}Qty: {item.quantity} × {formatCurrency(item.price)}
                              </span>
                            </div>
                          </div>
                          <span className="font-extrabold text-amber-400 shrink-0">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Invoice Receipt</span>
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={getWhatsAppUrl(phone, trackMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Factory</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
