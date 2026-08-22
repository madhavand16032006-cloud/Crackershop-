import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { getWhatsAppUrl } from '../../utils/whatsapp';

export const AdminEnquiries: React.FC = () => {
  const { shopSettings, showToast } = useShop();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await api.getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'RESOLVED' ? 'NEW' : 'RESOLVED';
    try {
      await api.updateEnquiryStatus(id, nextStatus);
      showToast(`Enquiry marked as ${nextStatus}`);
      loadEnquiries();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await api.deleteEnquiry(id);
      showToast('Enquiry deleted');
      loadEnquiries();
    } catch (err) {
      showToast('Failed to delete enquiry', 'error');
    }
  };

  return (
    <div id="admin-enquiries-page" className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Customer Enquiries & Messages
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Custom bulk enquiries, corporate hamper requests, and questions received from the website contact page.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading customer enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No enquiries received yet.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {enquiries.map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-slate-950/40 transition-colors">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{item.name}</span>
                    <span className="text-xs text-slate-400">• {item.city || 'India'}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'NEW'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    "{item.message}"
                  </p>

                  <div className="text-[11px] text-slate-500">
                    Contact: <span className="text-slate-300 font-mono font-semibold">{item.mobile}</span> • Received {new Date(item.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={getWhatsAppUrl(
                      item.mobile,
                      `Hello ${item.name}, regarding your message to ${shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks'}:`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    Reply on WhatsApp
                  </a>

                  <button
                    onClick={() => handleToggleStatus(item.id, item.status)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    title="Toggle resolved status"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 text-xs"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
