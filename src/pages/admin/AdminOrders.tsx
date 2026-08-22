import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  MessageCircle,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Printer,
  Copy,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { formatCurrency, generateWhatsAppOrderMessage, getWhatsAppUrl } from '../../utils/whatsapp';

export const AdminOrders: React.FC = () => {
  const { shopSettings, showToast } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  const phone = shopSettings?.whatsapp || '919842178901';

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`);
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string, orderNum: string) => {
    if (!window.confirm(`Delete order ${orderNum} permanently?`)) return;
    try {
      await api.deleteOrder(orderId);
      showToast('Order record removed');
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      showToast('Failed to delete order', 'error');
    }
  };

  const handleCopySlip = (order: Order) => {
    const text = generateWhatsAppOrderMessage(order, shopSettings || undefined);
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Order invoice copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.mobile.includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="admin-orders-page" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Orders & WhatsApp Invoices
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review customer orders, update delivery milestones, and communicate via WhatsApp.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, Mobile, City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'NEW', 'CONFIRMED', 'DISPATCHED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 font-extrabold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No orders matching current filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px]">
                  <th className="py-3.5 pl-4">Order # & Date</th>
                  <th className="py-3.5">Customer</th>
                  <th className="py-3.5">Contact Details</th>
                  <th className="py-3.5">Items</th>
                  <th className="py-3.5">Total (₹)</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-950/40 transition-colors">
                    {/* Order Number & Timestamp */}
                    <td className="py-3.5 pl-4">
                      <span className="font-mono font-black text-amber-400 text-sm block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5">
                      <span className="font-bold text-white block">{order.customer.fullName}</span>
                      <span className="text-[11px] text-slate-400">{order.customer.city}</span>
                    </td>

                    {/* Contact info */}
                    <td className="py-3.5 font-mono text-slate-300">
                      <div>Ph: {order.customer.mobile}</div>
                      {order.customer.whatsapp && (
                        <div className="text-[11px] text-emerald-400">WA: {order.customer.whatsapp}</div>
                      )}
                    </td>

                    {/* Items */}
                    <td className="py-3.5 text-slate-300">
                      <span className="font-bold text-white">{order.totalItems}</span> units ({order.items.length} types)
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 font-mono font-black text-amber-400 text-sm">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    {/* Status selector */}
                    <td className="py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          order.status === 'NEW'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : order.status === 'CONFIRMED'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                            : order.status === 'DISPATCHED'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : order.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        } bg-slate-950 focus:outline-none cursor-pointer`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Order Slip */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="View Complete Order Slip"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* WhatsApp Customer */}
                        <a
                          href={getWhatsAppUrl(
                            order.customer.whatsapp || order.customer.mobile,
                            `🎆 Hello ${order.customer.fullName}, this is ${shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks'}.

Regarding your order *${order.orderNumber}* (Total: ${formatCurrency(order.totalAmount)}):
Current Status: *${order.status}*

Thank you for choosing genuine Sivakasi fireworks!`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                          title="Chat with customer on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        </a>

                        {/* Delete Order */}
                        <button
                          onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase">Order Inspection</span>
                <h3 className="text-xl font-black text-white">{selectedOrder.orderNumber}</h3>
                <span className="text-[11px] text-slate-400">{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Customer</span>
                <span className="font-bold text-white text-sm">{selectedOrder.customer.fullName}</span>
                <div className="mt-2 text-slate-300">
                  <div>Mobile: {selectedOrder.customer.mobile}</div>
                  <div>WhatsApp: {selectedOrder.customer.whatsapp}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Delivery Location</span>
                <p className="text-slate-200 mt-1">
                  {selectedOrder.customer.address}, {selectedOrder.customer.city} - {selectedOrder.customer.pincode}
                </p>
                {selectedOrder.customer.notes && (
                  <p className="text-amber-300 italic text-[11px] mt-1">
                    "{selectedOrder.customer.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Crackers</h4>
              <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{it.productName}</span>
                      <span className="text-slate-400 text-[11px] block">{it.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-mono">{it.quantity} × {formatCurrency(it.price)}</span>
                      <div className="font-bold text-amber-400">{formatCurrency(it.subtotal)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Status */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Total Order Amount:</span>
                <span className="text-xl font-black text-amber-400 font-mono">{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-bold text-xs focus:outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopySlip(selectedOrder)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Message'}
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Slip
                </button>
              </div>

              <a
                href={getWhatsAppUrl(
                  selectedOrder.customer.whatsapp || selectedOrder.customer.mobile,
                  `🎆 Hello ${selectedOrder.customer.fullName}, this is ${shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks'}.

Regarding your order *${selectedOrder.orderNumber}* (Total: ${formatCurrency(selectedOrder.totalAmount)}):
Status: *${selectedOrder.status}*

Thank you!`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Chat Customer on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
