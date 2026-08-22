import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { getWhatsAppUrl } from '../../utils/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const { shopSettings } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phone = shopSettings?.whatsapp || '918122580372';
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  const handleSend = () => {
    const text = customMsg.trim()
      ? `🎆 Hello ${shopName},\n\n${customMsg.trim()}`
      : `🎆 Hello ${shopName}, I would like to inquire about fireworks availability and festive wholesale discount.`;
    window.open(getWhatsAppUrl(phone, text), '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div id="whatsapp-floating-widget" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* Popover popup */}
      {isOpen && (
        <div
          id="whatsapp-chat-popup"
          className="mb-3 w-80 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-emerald-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center font-bold text-amber-400 border border-emerald-400">
                  🎆
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 rounded-full border-2 border-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{shopName}</h4>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Direct Factory Support
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message preview body */}
          <div className="p-4 bg-slate-950/90 text-xs space-y-2">
            <div className="bg-slate-800 text-slate-200 p-3 rounded-xl rounded-tl-none border border-slate-700">
              <p className="font-medium text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Vanakkam! Welcome to Sivakasi Fireworks.
              </p>
              <p className="mt-1 text-slate-300">
                You can send your shopping cart directly or message us for custom family gift box packages and delivery timings!
              </p>
            </div>

            <textarea
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Type your question or custom enquiry..."
              rows={3}
              className="w-full mt-2 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 resize-none"
            />

            <button
              onClick={handleSend}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
            >
              <Send className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="open-whatsapp-fab"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-950/60 border border-emerald-400/40 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat with Sivakasi Shop on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          Order on WhatsApp
        </span>
      </button>
    </div>
  );
};
