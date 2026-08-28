import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, Zap } from 'lucide-react';

interface FestiveLoaderProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const FestiveLoader: React.FC<FestiveLoaderProps> = ({
  onComplete,
  minDurationMs = 2600
}) => {
  const [phase, setPhase] = useState<'lighting' | 'burning' | 'exploding' | 'revealed' | 'complete'>('lighting');
  const [loadingText, setLoadingText] = useState('Lighting up your experience...');
  const [sparkPos, setSparkPos] = useState({ x: 190, y: 35 });
  const [sparkProgress, setSparkProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fusePathRef = useRef<SVGPathElement>(null);

  // Background stars creation
  const [stars] = useState(() =>
    Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 2 + 1.2,
      delay: Math.random() * 2
    }))
  );

  // Spark sparks particle stream during fuse burn
  const [fuseSparks, setFuseSparks] = useState<Array<{ id: number; ox: number; oy: number; size: number; color: string }>>([]);

  useEffect(() => {
    // 1. Text cycle timeline
    const t1 = setTimeout(() => {
      setLoadingText('Preparing the fireworks...');
    }, 700);

    const t2 = setTimeout(() => {
      setLoadingText('Bringing the celebration to you...');
    }, 1400);

    const t3 = setTimeout(() => {
      setLoadingText('Almost ready...');
    }, 2100);

    // 2. Fuse burn progression (0ms to 1250ms)
    const startTime = performance.now();
    const burnDuration = 1200;

    let animFrame: number;
    const animateFuse = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(Math.max(elapsed / burnDuration, 0), 1);
      setSparkProgress(progress);

      if (fusePathRef.current) {
        try {
          const totalLength = fusePathRef.current.getTotalLength();
          // Fuse burns from tip (length 0) towards cracker base (totalLength)
          const point = fusePathRef.current.getPointAtLength(progress * totalLength);
          setSparkPos({ x: point.x, y: point.y });

          // Generate spark embers
          if (progress < 1 && Math.random() > 0.3) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 18 + 4;
            setFuseSparks((prev) => [
              ...prev.slice(-15),
              {
                id: Date.now() + Math.random(),
                ox: point.x + Math.cos(angle) * dist,
                oy: point.y + Math.sin(angle) * dist,
                size: Math.random() * 3 + 2,
                color: Math.random() > 0.5 ? '#fbbf24' : '#f97316'
              }
            ]);
          }
        } catch {
          // Fallback if SVG measurement is not available in headless env
          setSparkPos({
            x: 190 - progress * 40,
            y: 35 + progress * 85
          });
        }
      }

      if (progress < 1) {
        animFrame = requestAnimationFrame(animateFuse);
      } else {
        // Trigger Explosion!
        setPhase('exploding');
      }
    };

    animFrame = requestAnimationFrame(animateFuse);

    // 3. Explosion trigger at 1300ms
    const explodeTimer = setTimeout(() => {
      setPhase('exploding');
      triggerExplosionCanvas();
    }, 1300);

    // 4. Reveal Brand Headline & Tagline at 1550ms
    const revealTimer = setTimeout(() => {
      setPhase('revealed');
    }, 1600);

    // 5. Completion transition & cleanup at minDurationMs (~2600ms)
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 400);
    }, minDurationMs);

    // Hard fallback safety: Never stay blocked longer than 3200ms
    const failsafeTimer = setTimeout(() => {
      setPhase('complete');
      if (onComplete) onComplete();
    }, 3200);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(explodeTimer);
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
      clearTimeout(failsafeTimer);
    };
  }, [minDurationMs, onComplete]);

  // Golden fireworks burst with canvas particles and confetti
  const triggerExplosionCanvas = () => {
    // 1. Confetti burst centered on screen
    try {
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { y: 0.45, x: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#ef4444', '#10b981', '#ffffff', '#ffd700'],
        ticks: 200,
        gravity: 0.8,
        scalar: 1.1,
        disableForReducedMotion: false
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 120,
          origin: { y: 0.42, x: 0.5 },
          colors: ['#ffd700', '#f59e0b', '#fb7185'],
          ticks: 180,
          gravity: 0.7,
          scalar: 0.9
        });
      }, 180);
    } catch {
      // safe fallback
    }

    // 2. Custom Canvas Particle Rays Burst
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.42;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      radius: number;
      decay: number;
    }> = [];

    const colors = ['#fde047', '#f59e0b', '#fb923c', '#ef4444', '#34d399', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 3 + 1.5,
        decay: Math.random() * 0.02 + 0.015
      });
    }

    let pFrame: number;
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        if (p.alpha > 0) {
          aliveCount++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // subtle gravity
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(p.alpha, 0);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        pFrame = requestAnimationFrame(drawParticles);
      }
    };

    drawParticles();
  };

  const handleSkip = () => {
    setPhase('complete');
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <motion.div
          id="sivakasi-festive-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.45, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none"
          style={{
            background: 'radial-gradient(ellipse at center 40%, #171c2f 0%, #080c18 55%, #03050a 100%)'
          }}
        >
          {/* Particle Explosion Canvas Layer */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-20"
          />

          {/* Twinkling Night Sky Stars */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {stars.map((star) => (
              <span
                key={star.id}
                className="absolute rounded-full bg-amber-100 shadow-sm"
                style={{
                  top: `${star.y}%`,
                  left: `${star.x}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animation: `twinkle ${star.duration}s infinite ease-in-out alternate`,
                  animationDelay: `${star.delay}s`,
                  opacity: 0.6
                }}
              />
            ))}
          </div>

          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

          {/* Skip Button for Instant Fast-Track */}
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-5 right-5 z-40 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 shadow-lg"
          >
            <span>Skip Intro</span>
            <span>➔</span>
          </button>

          {/* Core Visual Stage */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-md w-full px-6 text-center">

            {/* STAGE 1 & 2: Decorative Sivakasi Cracker with Burning Fuse */}
            <div className="relative w-72 h-64 flex items-center justify-center mb-2">
              <AnimatePresence>
                {(phase === 'lighting' || phase === 'burning') && (
                  <motion.div
                    key="cracker-stage"
                    initial={{ opacity: 0, scale: 0.85, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.3, filter: 'brightness(2.5)', transition: { duration: 0.25 } }}
                    className="relative w-full h-full flex flex-col items-center justify-center"
                  >
                    {/* SVG Cracker & Braided Winding Fuse */}
                    <svg
                      viewBox="0 0 300 240"
                      className="w-56 sm:w-64 h-56 sm:h-64 overflow-visible drop-shadow-[0_10px_25px_rgba(245,158,11,0.25)]"
                    >
                      <defs>
                        {/* Golden Shimmer Gradient */}
                        <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="35%" stopColor="#f59e0b" />
                          <stop offset="70%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>

                        {/* Festive Red Cracker Body Gradient */}
                        <linearGradient id="crackerRed" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#991b1b" />
                          <stop offset="25%" stopColor="#dc2626" />
                          <stop offset="60%" stopColor="#b91c1c" />
                          <stop offset="100%" stopColor="#7f1d1d" />
                        </linearGradient>

                        {/* Jute Rope Fuse Texture */}
                        <linearGradient id="fuseRope" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ca8a04" />
                          <stop offset="50%" stopColor="#78350f" />
                          <stop offset="100%" stopColor="#451a03" />
                        </linearGradient>

                        <filter id="fireGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* --- The Winding Curved Fuse Path --- */}
                      {/* Unburnt base rope */}
                      <path
                        d="M 195 40 C 180 30, 160 55, 175 80 C 185 100, 165 110, 150 120"
                        fill="none"
                        stroke="url(#fuseRope)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />

                      {/* Measured reference path for progress calculation */}
                      <path
                        ref={fusePathRef}
                        d="M 195 40 C 180 30, 160 55, 175 80 C 185 100, 165 110, 150 120"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3.5"
                        strokeDasharray="200"
                        strokeDashoffset={200 * (1 - sparkProgress)}
                        className="opacity-0"
                      />

                      {/* Burnt Ash section behind the spark */}
                      <path
                        d="M 195 40 C 180 30, 160 55, 175 80 C 185 100, 165 110, 150 120"
                        fill="none"
                        stroke="#27272a"
                        strokeWidth="2.5"
                        strokeDasharray="200"
                        strokeDashoffset={200 * (1 - sparkProgress)}
                        strokeLinecap="round"
                        className="opacity-75"
                      />

                      {/* --- Authentic Sivakasi Cylindrical Cracker Body --- */}
                      {/* Top Golden Brass Ring */}
                      <ellipse cx="150" cy="120" rx="38" ry="11" fill="url(#goldMetallic)" />

                      {/* Red Cylindrical Barrel */}
                      <path
                        d="M 112 120 L 112 210 C 112 222, 188 222, 188 210 L 188 120 Z"
                        fill="url(#crackerRed)"
                      />

                      {/* Festive Golden Bands & Filigree */}
                      <ellipse cx="150" cy="150" rx="38" ry="8" fill="none" stroke="url(#goldMetallic)" strokeWidth="3" opacity="0.85" />
                      <ellipse cx="150" cy="180" rx="38" ry="8" fill="none" stroke="url(#goldMetallic)" strokeWidth="3" opacity="0.85" />

                      {/* Traditional Gold Emblem / Lotus Motif on Cracker Body */}
                      <g transform="translate(150, 165) scale(0.7)">
                        <circle cx="0" cy="0" r="18" fill="#7f1d1d" stroke="url(#goldMetallic)" strokeWidth="2" />
                        <path d="M 0 -12 C 5 -4, 5 4, 0 12 C -5 4, -5 -4, 0 -12 Z" fill="url(#goldMetallic)" />
                        <path d="M -12 0 C -4 5, 4 5, 12 0 C 4 -5, -4 -5, -12 0 Z" fill="url(#goldMetallic)" />
                        <circle cx="0" cy="0" r="4" fill="#fef08a" />
                      </g>

                      {/* Bottom Rim */}
                      <ellipse cx="150" cy="210" rx="38" ry="11" fill="url(#goldMetallic)" />

                      {/* Dynamic Traveling Spark Core on Fuse */}
                      <g transform={`translate(${sparkPos.x}, ${sparkPos.y})`}>
                        {/* Outer Fiery Corona */}
                        <circle cx="0" cy="0" r="16" fill="#f97316" opacity="0.3" filter="url(#fireGlow)" />
                        {/* Middle Bright Amber Glow */}
                        <circle cx="0" cy="0" r="10" fill="#fbbf24" opacity="0.8" filter="url(#fireGlow)" />
                        {/* Inner Incandescent White/Yellow Spark */}
                        <circle cx="0" cy="0" r="4.5" fill="#ffffff" />

                        {/* Spark Ray Flares */}
                        <line x1="-12" y1="-8" x2="12" y2="8" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
                        <line x1="8" y1="-12" x2="-8" y2="12" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
                        <line x1="-14" y1="0" x2="14" y2="0" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    </svg>

                    {/* Sizzling Embers Streaming Around Spark */}
                    {fuseSparks.map((sp) => (
                      <span
                        key={sp.id}
                        className="absolute rounded-full pointer-events-none animate-ping"
                        style={{
                          left: `${sp.ox}px`,
                          top: `${sp.oy}px`,
                          width: `${sp.size}px`,
                          height: `${sp.size}px`,
                          backgroundColor: sp.color,
                          boxShadow: `0 0 8px ${sp.color}`
                        }}
                      />
                    ))}

                    <div className="absolute -bottom-2 text-[11px] font-bold uppercase tracking-widest text-amber-400/90 flex items-center gap-1 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
                      <span>Lighting Fuse...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* STAGE 3: Shockwave Glow Burst on Explosion */}
              <AnimatePresence>
                {(phase === 'exploding' || phase === 'revealed') && (
                  <motion.div
                    key="explosion-shockwave"
                    initial={{ scale: 0.2, opacity: 1 }}
                    animate={{ scale: [0.5, 2.2, 3], opacity: [1, 0.8, 0] }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute inset-0 m-auto w-48 h-48 rounded-full border-2 border-amber-400 bg-radial from-amber-300 via-orange-500/40 to-transparent pointer-events-none blur-sm"
                  />
                )}
              </AnimatePresence>

              {/* STAGE 4: Golden Explosion Center Spark Icon */}
              <AnimatePresence>
                {(phase === 'exploding' || phase === 'revealed') && (
                  <motion.div
                    key="spark-center-icon"
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)] border-2 border-amber-200"
                  >
                    <Sparkles className="w-10 h-10 text-slate-950 fill-slate-950 animate-spin" style={{ animationDuration: '6s' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* STAGE 5: Typography Revealed by the Explosion */}
            <div className="space-y-2.5 mt-2 min-h-[110px] flex flex-col items-center justify-center">
              <AnimatePresence>
                {phase === 'revealed' ? (
                  <motion.div
                    key="revealed-brand-text"
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="space-y-2"
                  >
                    {/* Golden Sivakasi Brand Headline */}
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <h1 className="text-2xl sm:text-3xl font-black tracking-wider uppercase bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]">
                        SIVAKASI FIREWORKS
                      </h1>
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>

                    {/* Direct Factory Wholesale Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-black tracking-wide shadow-sm">
                      <span>✨ Direct Factory Wholesale • Flat 60% Off</span>
                    </div>

                    {/* Tagline */}
                    <p className="text-xs sm:text-sm font-semibold text-slate-300 tracking-wide pt-0.5">
                      Celebrate Brighter • Shop Smarter
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="loading-text-stage"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <p className="text-sm font-bold text-amber-300/90 tracking-wide animate-pulse">
                      {loadingText}
                    </p>
                    {/* Subtle Progress Bar */}
                    <div className="w-40 h-1 bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/60">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                        initial={{ width: '10%' }}
                        animate={{ width: phase === 'exploding' ? '90%' : `${Math.max(sparkProgress * 75, 15)}%` }}
                        transition={{ ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sivakasi Green Crackers Trust Mark */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                100% Genuine Green Crackers
              </span>
              <span>•</span>
              <span>Sivakasi Direct Dispatch</span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FestiveLoader;
