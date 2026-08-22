import React, { useState, useEffect } from 'react';
import { Users, Search, MessageCircle, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { formatCurrency, getWhatsAppUrl } from '../../utils/whatsapp';
import { useShop } from '../../context/ShopContext';

interface CustomerSummary {
  fullName: string;
  mobile: string;
  whatsapp: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  lastOrderNumber: string;
}

export const AdminCustomers: React.FC = () => {
  const { shopSettings } = useShop();
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const orders: Order[] = await api.getOrders();
        const map = new Map<string, CustomerSummary>();

        orders.forEach((o) => {
          const key = o.customer.mobile.trim();
          if (!map.has(key)) {
            map.set(key, {
              fullName: o.customer.fullName,
              mobile: o.customer.mobile,
              whatsapp: o.customer.whatsapp || o.customer.mobile,
              city: o.customer.city,
              address: o.customer.address,
              totalOrders: 1,
              totalSpent: o.totalAmount,
              lastOrderDate: o.createdAt,
              lastOrderNumber: o.orderNumber
            });
          } else {
            const existing = map.get(key)!;
            existing.totalOrders += 1;
            existing.totalSpent += o.totalAmount;
            if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
              existing.lastOrderDate = o.createdAt;
              existing.lastOrderNumber = o.orderNumber;
            }
          }
        });

        setCustomers(Array.from(map.values()));
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  return (
    <div id="admin-customers-page" className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Customer Directory (CRM)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated customer contacts from all WhatsApp orders for repeat festival marketing.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, mobile number, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading customer directory...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px]">
                  <th className="py-3.5 pl-4">Customer Name</th>
                  <th className="py-3.5">Contact Number</th>
                  <th className="py-3.5">Delivery City</th>
                  <th className="py-3.5">Orders Placed</th>
                  <th className="py-3.5">Total Value (₹)</th>
                  <th className="py-3.5">Latest Order</th>
                  <th className="py-3.5 text-right pr-4">Quick WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3.5 pl-4">
                      <span className="font-bold text-white block text-sm">{c.fullName}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-xs block">{c.address}</span>
                    </td>

                    <td className="py-3.5 font-mono text-slate-300">
                      <div>Ph: {c.mobile}</div>
                      {c.whatsapp && <div className="text-[10px] text-emerald-400">WA: {c.whatsapp}</div>}
                    </td>

                    <td className="py-3.5 text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {c.city}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 font-bold text-[11px] border border-slate-700">
                        {c.totalOrders} {c.totalOrders === 1 ? 'Order' : 'Orders'}
                      </span>
                    </td>

                    <td className="py-3.5 font-mono font-bold text-white text-sm">
                      {formatCurrency(c.totalSpent)}
                    </td>

                    <td className="py-3.5 text-slate-400 text-[11px]">
                      <span className="font-mono text-amber-400 font-bold">{c.lastOrderNumber}</span>
                      <span className="block text-[10px]">{new Date(c.lastOrderDate).toLocaleDateString('en-IN')}</span>
                    </td>

                    <td className="py-3.5 text-right pr-4">
                      <a
                        href={getWhatsAppUrl(
                          c.whatsapp || c.mobile,
                          `🎆 Greetings ${c.fullName} from ${shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks'}! We have fresh festival fireworks stock available.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        Chat
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
