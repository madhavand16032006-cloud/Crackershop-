import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const FAQPage: React.FC = () => {
  const { shopSettings } = useShop();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const phone = shopSettings?.whatsapp || '919842178901';
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  const faqs = [
    {
      category: 'Ordering & Payment',
      questions: [
        {
          q: 'Why is there no online payment gateway on this website?',
          a: 'As per the Supreme Court of India directives and the Petroleum and Explosives Safety Organisation (PESO) regulations, direct online e-commerce transactions for fireworks are restricted. This platform acts as our digital catalogue, allowing you to create your preferred selection and finalize your order directly with the shop owner via WhatsApp.'
        },
        {
          q: 'How do I pay for my crackers order?',
          a: 'Once your order is submitted via WhatsApp, our shop owner confirms the order total and provides official UPI (GPay/PhonePe/Paytm) or NEFT/IMPS bank transfer details. Once payment is made, your order is scheduled for dispatch.'
        },
        {
          q: 'Is there a minimum order amount for shipping?',
          a: `Yes, our minimum order value is ${shopSettings?.minimumOrderAmount ? `₹${shopSettings.minimumOrderAmount}` : '₹500'} to ensure economical road cargo transport.`
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          q: 'How will my order reach my location?',
          a: 'We partner with authorized road transport cargo operators (such as VRL, KRS, ABT, ARC, etc.) who specialize in explosive transport. The parcel is delivered either to the nearest transport hub in your city or to your doorstep depending on local route availability.'
        },
        {
          q: 'How long does delivery take?',
          a: 'For Tamil Nadu, delivery takes 2 to 3 business days. For neighboring states (Karnataka, Kerala, Andhra Pradesh, Telangana), delivery takes 3 to 5 business days. Other North & Central Indian states take 5 to 7 business days.'
        },
        {
          q: 'How are crackers packaged to prevent damage or dampness?',
          a: 'Every consignment is vacuum-sealed in moisture-barrier plastic, wrapped with corrugated cushion padding, and enclosed in heavy-duty cardboard cartons with "EXPLOSIVE - HANDLE WITH CARE" statutory warning labels.'
        }
      ]
    },
    {
      category: 'Product Quality & Green Crackers',
      questions: [
        {
          q: 'Are all your products Green Crackers?',
          a: 'Yes, 100% of the fireworks listed on our catalogue are manufactured under CSIR-NEERI green cracker formulation rules, using eco-friendly chemical compositions with 30-35% reduced particulate emissions.'
        },
        {
          q: 'Can I order custom Gift Boxes for corporate gifting or family events?',
          a: 'Yes! We customize gift boxes for corporate Diwali gifts, apartment associations, and weddings. Simply chat with us on WhatsApp or submit a request on our Contact page.'
        }
      ]
    }
  ];

  return (
    <div id="faq-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
          <HelpCircle className="w-3.5 h-3.5" />
          Help & Ordering Support
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Everything you need to know about our Sivakasi fireworks catalogue, WhatsApp ordering process, transport logistics, and safety certifications.
        </p>
      </div>

      {/* Accordion Categories */}
      <div className="space-y-8">
        {faqs.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-3">
            <h3 className="text-base font-extrabold text-amber-400 uppercase tracking-wider pl-1">
              {cat.category}
            </h3>

            <div className="space-y-3">
              {cat.questions.map((item, qIdx) => {
                const itemGlobalIdx = catIdx * 10 + qIdx;
                const isOpen = openIdx === itemGlobalIdx;

                return (
                  <div
                    key={qIdx}
                    className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : itemGlobalIdx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-amber-400 transition-colors"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
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
          </div>
        ))}
      </div>

      {/* Still Have Questions Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Have a Specific Question?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Our Sivakasi factory customer care is ready to assist you on WhatsApp with custom lists, price quotes, or delivery schedules.
        </p>
        <a
          href={getWhatsAppUrl(phone, `🎆 Hello ${shopName}, I have a question about ordering crackers.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          Ask Us on WhatsApp
        </a>
      </div>
    </div>
  );
};
