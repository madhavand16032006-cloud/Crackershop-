import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
  Plus
} from 'lucide-react';
import { api } from '../../services/api';
import { Order, Product } from '../../types';
import { formatCurrency, getWhatsAppUrl } from '../../utils/whatsapp';
import { useShop } from '../../context/ShopContext';

export const AdminDashboard: React.FC = () => {
  const { shopSettings, showToast } = useShop();
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const phone = shopSettings?.whatsapp || '919842178901';

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData] = await Promise.all([
        api.getStats(),
        api.getOrders()
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`);
      loadDashboardData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div id="admin-dashboard" className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Sivakasi Shop Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Store Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track orders received from WhatsApp, catalogue inventory, and active customer requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Fireworks
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            View All Orders
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalOrders || 0}
          </div>
          <div className="text-[11px] text-slate-400">
            {stats?.pendingOrders || 0} pending WhatsApp confirmation
          </div>
        </div>

        {/* Estimated Catalogue Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {formatCurrency(stats?.totalRevenue || 0)}
          </div>
          <div className="text-[11px] text-slate-400">
            From {stats?.totalOrders || 0} WhatsApp orders generated
          </div>
        </div>

        {/* Active Products */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Products</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalProducts || 0}
          </div>
          <div className="text-[11px] text-slate-400">
            Across {stats?.totalCategories || 0} cracker categories
          </div>
        </div>

        {/* Pending Actions */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Orders</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-orange-400">
            {stats?.pendingOrders || 0}
          </div>
          <div className="text-[11px] text-slate-400">
            Awaiting stock check & dispatch
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Recent WhatsApp Orders
            </h2>
            <p className="text-xs text-slate-400">
              Orders generated by customers through the website catalogue.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
            Loading recent orders...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No orders received yet. Once customers add fireworks and click "Order on WhatsApp", orders will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                  <th className="pb-3 pl-2">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3 pl-2 font-mono font-bold text-amber-400">
                      {order.orderNumber}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3">
                      <span className="font-bold text-white block">{order.customer.fullName}</span>
                      <span className="text-[11px] text-slate-400">{order.customer.city} • {order.customer.mobile}</span>
                    </td>

                    <td className="py-3 text-slate-300">
                      {order.totalItems} items ({order.items.length} varieties)
                    </td>

                    <td className="py-3 font-bold text-white font-mono">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    <td className="py-3">
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

                    <td className="py-3 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        {/* WhatsApp Customer */}
                        <a
                          href={getWhatsAppUrl(
                            order.customer.whatsapp || order.customer.mobile,
                            `Hello ${order.customer.fullName}, regarding your Sivakasi Fireworks order ${order.orderNumber} for ${formatCurrency(order.totalAmount)}:`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                          title="Chat with customer on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <Link
                          to="/admin/orders"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          title="View order details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Setup Checklist */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Shop Manager Quick Tips
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-400 block">1. Update WhatsApp Number</span>
            <p className="text-slate-400">
              Ensure your 10-digit WhatsApp number in <strong>Shop Profile</strong> is active to receive instant customer orders.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-400 block">2. Seasonal Festival Combos</span>
            <p className="text-slate-400">
              Create special Family Gift Box products with attractive discounts to increase average order values.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-400 block">3. Inventory Stock Toggles</span>
            <p className="text-slate-400">
              Easily mark items as "Out of Stock" in the Products tab when factory daily batches sell out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
