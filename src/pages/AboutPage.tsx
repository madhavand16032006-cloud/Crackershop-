import React from 'react';
import { Sparkles, ShieldCheck, Award, Factory, Flame, Users, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AboutPage: React.FC = () => {
  const { shopSettings } = useShop();

  return (
    <div id="about-us-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Hero Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          The Sivakasi Heritage
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Authentic Fireworks Direct from the Capital of Sparkle
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks'} is rooted in Sivakasi, Tamil Nadu—the renowned fireworks capital that crafts light, joy, and celebration for over 1.4 billion people.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative rounded-3xl overflow-hidden aspect-4/3 border border-amber-500/30 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80"
            alt="Sivakasi Night Sparkle"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
            <span className="text-xs font-bold text-amber-400">Manufactured in Sivakasi</span>
            <p className="text-xs text-slate-300">100% CSIR-NEERI Approved Green Formulations</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h3 className="text-xl font-bold text-white">Our Factory Direct Promise</h3>
          <p>
            For decades, buying crackers in cities involved paying massive 300% to 500% retailer markups, often for stale or damp inventory sitting in warehouses for months.
          </p>
          <p>
            Our direct WhatsApp ordering model connects you directly with our Sivakasi manufacturing unit. Every product is freshly packed, rigorous quality-tested for burst consistency, and delivered with genuine factory wholesale savings.
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Middlemen & Transparent Factory Rates</span>
            </div>
            <div className="flex items-center gap-2 text-white font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>30-35% Reduced Particulate Emissions (Green Crackers)</span>
            </div>
            <div className="flex items-center gap-2 text-white font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct WhatsApp Communication with Shop Owner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Factory className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Direct Production</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            All crackers are produced in PESO-licensed Sivakasi manufacturing sheds by master pyrotechnic artisans.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Award className="w-6 h-6 text-emerald-400" />
          </div>
          <h4 className="text-base font-bold text-white">Green Certified</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Safe chemicals without barium nitrate, lead, or forbidden toxic additives to protect family health and the environment.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Users className="w-6 h-6 text-sky-400" />
          </div>
          <h4 className="text-base font-bold text-white">Dedicated Support</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Personalized WhatsApp order tracking, packing video previews, and assistance for corporate and family orders.
          </p>
        </div>
      </div>
    </div>
  );
};
