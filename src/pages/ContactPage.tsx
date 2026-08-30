import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const ContactPage: React.FC = () => {
  const { shopSettings, showToast } = useShop();

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    city: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const phone = shopSettings?.whatsapp || '918122580372';
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim() || !form.message.trim()) {
      showToast('Please fill in your name, mobile, and message.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitEnquiry(form);
      setSubmitted(true);
      showToast('Enquiry sent successfully! We will contact you soon.');
    } catch (err: any) {
      showToast('Failed to submit enquiry. You can also chat on WhatsApp directly.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="contact-page" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
          <MapPin className="w-3.5 h-3.5" />
          Sivakasi Factory Contact
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Get in Touch with Our Factory
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Need bulk corporate quotation, temple festival packaging, or have questions about your order? We are available 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Direct Contact Details
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Factory & Depot Address</span>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    {shopSettings?.address || 'New Street, Sivakasi'}, {shopSettings?.city || 'Sivakasi'}, {shopSettings?.state || 'Tamil Nadu'} - {shopSettings?.pincode || '626123'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Direct Phone</span>
                  <a href={`tel:${shopSettings?.phone || '+918122580372'}`} className="text-amber-400 hover:underline text-xs">
                    {shopSettings?.phone || '+91 81225 80372'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">WhatsApp Orders</span>
                  <a
                    href={getWhatsAppUrl(phone, `🎆 Hello ${shopName}, I have an enquiry.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline text-xs font-mono font-bold"
                  >
                    +{phone} (Instant WhatsApp reply)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Email Enquiry</span>
                  <a href={`mailto:${shopSettings?.email || 'orders@sivakasifireworks.com'}`} className="text-sky-400 hover:underline text-xs">
                    {shopSettings?.email || 'orders@sivakasifireworks.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Working Hours</span>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Monday – Sunday: 8:00 AM – 9:30 PM (IST)
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={getWhatsAppUrl(phone, `🎆 Hello ${shopName}, I would like to enquire about fireworks orders.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/30"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Chat with Factory on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Send Factory Enquiry</h3>
              <p className="text-xs text-slate-400 mt-1">
                Fill in your details below. We will get back to you with custom catalog quotations.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Thank You for Your Enquiry!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  We have received your message. Our Sivakasi team will contact your mobile or WhatsApp shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', mobile: '', city: '', message: '' });
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      10-Digit Mobile / WhatsApp <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Your City / State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad / Bangalore"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Your Message / Custom Requirement <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you are looking for (e.g. corporate Diwali hamper quote, 100-pack sparklers, wedding celebration crackers)..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-950/30"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Sending Enquiry...' : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
