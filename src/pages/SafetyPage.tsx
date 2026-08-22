import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, HeartHandshake, Sparkles } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  return (
    <div id="safety-guidelines-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          Safety & Legal UX Notice
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Fireworks Safety & Green Crackers Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Celebrating with fireworks should always be safe, joyful, and responsible. Follow our official pyrotechnic safety checklist for you and your family.
        </p>
      </div>

      {/* Do's and Don'ts Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* DO'S */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-lg">
            <CheckCircle2 className="w-6 h-6" />
            <h3>THE DO'S (Safe Practices)</h3>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span><strong>Always ignite outdoors:</strong> Use open grounds, terraces with clear overhead space, or open driveways away from dry grass and parked vehicles.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span><strong>Keep water handy:</strong> Keep a bucket of clean water and a bucket of sand immediately beside the lighting area for emergencies and disposal.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span><strong>Wear cotton clothing:</strong> Always wear fitted cotton clothes and footwear. Avoid synthetic garments like nylon or polyester while lighting fireworks.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span><strong>Adult Supervision:</strong> Children must always be supervised by an adult when handling sparklers or flower pots.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span><strong>Light with an incense stick (Agarbatti):</strong> Light fuses from an arm's distance using a long sparkler or agarbatti, not a pocket lighter.</span>
            </li>
          </ul>
        </div>

        {/* DON'TS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-rose-500/40 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-extrabold text-lg">
            <XCircle className="w-6 h-6" />
            <h3>THE DON'TS (Dangerous Actions)</h3>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span><strong>NEVER hold bursting crackers in hand:</strong> Never hold flower pots, rockets, bombs, or ground chakkars in your hand while lighting.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span><strong>NEVER re-light a dud firework:</strong> If a firework fails to ignite, wait 15 minutes and douse it with water. Never lean over it to inspect.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span><strong>NEVER light inside containers:</strong> Never place crackers inside tin cans, glass bottles, or clay pots, as shrapnel can cause severe injuries.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span><strong>NEVER throw towards people or pets:</strong> Keep a safe distance of at least 5 meters from people, stray animals, and elderly family members.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span><strong>NEVER carry in pockets:</strong> Never store crackers or loose friction pop-pops in your pockets or close to hot electrical appliances.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Green Crackers Certification Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          What are CSIR-NEERI Green Crackers?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Green crackers are formulated by the Council of Scientific and Industrial Research (CSIR-NEERI) in India. They replace harmful heavy chemicals (such as Barium Nitrate) with proprietary formulations like SWAS (Safe Water Releaser), STAR (Safe Thermite Cracker), and SAFAL (Safe Minimal Aluminium).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-amber-400 font-bold block text-sm">30-35% Less Dust</span>
            <span className="text-slate-400">Significantly reduced PM2.5 and PM10 particulate matter emission.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-amber-400 font-bold block text-sm">Decibel Regulated</span>
            <span className="text-slate-400">Tested to stay strictly below safe statutory decibel limits (120-125 dB).</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-amber-400 font-bold block text-sm">Zero Barium</span>
            <span className="text-slate-400">Free from toxic barium compounds and hazardous heavy metals.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
