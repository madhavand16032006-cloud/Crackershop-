import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const OwnerShortcutListener: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useShop();

  const keySequenceRef = useRef<number[]>([]);
  const wordBufferRef = useRef<string>('');
  const isNavigatingRef = useRef(false);
  const [showHelperHint, setShowHelperHint] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const triggerOwnerLogin = (source: string) => {
      if (location.pathname.startsWith('/admin')) {
        return;
      }
      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;

      try {
        addToast(`🔐 Opening Owner Portal (${source})...`, 'info');
      } catch {
        // ignore toast errors
      }

      navigate('/admin/login');

      // Reset navigating lock
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 1000);
    };

    const handleKeyAction = (e: KeyboardEvent) => {
      const rawKey = e.key || '';
      const key = rawKey.toLowerCase();
      const code = e.code || '';
      const keyCode = e.keyCode || e.which;

      const isMKey = key === 'm' || key === 'µ' || code === 'KeyM' || keyCode === 77;

      // 1. Check for Ctrl + M, Cmd + M, Alt + M, or Shift + Ctrl + M
      if ((e.ctrlKey || e.metaKey || e.altKey) && isMKey) {
        e.preventDefault();
        e.stopPropagation();
        triggerOwnerLogin('Ctrl + M');
        return;
      }

      // Check if user is typing inside an input field
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement).isContentEditable
      );

      if (!isTyping) {
        // 2. Secret word typing detection ('owner' or 'admin')
        if (rawKey.length === 1 && rawKey.match(/[a-z0-9]/i)) {
          wordBufferRef.current = (wordBufferRef.current + key).slice(-8);
          if (wordBufferRef.current.endsWith('owner') || wordBufferRef.current.endsWith('admin')) {
            wordBufferRef.current = '';
            e.preventDefault();
            triggerOwnerLogin('Secret Word');
            return;
          }
        }

        // 3. Quick triple 'M' key press (press 'm' 3 times within 1 second)
        if (isMKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const now = Date.now();
          keySequenceRef.current = [...keySequenceRef.current.filter((t) => now - t < 1000), now];
          if (keySequenceRef.current.length >= 3) {
            keySequenceRef.current = [];
            e.preventDefault();
            e.stopPropagation();
            triggerOwnerLogin('Key: M-M-M');
            return;
          }
        }
      }
    };

    // Listen on window and document across capture phases
    window.addEventListener('keydown', handleKeyAction, { capture: true });
    window.addEventListener('keyup', handleKeyAction, { capture: true });
    document.addEventListener('keydown', handleKeyAction, { capture: true });

    // Expose global console helper for instant testing
    (window as any).openOwnerLogin = () => triggerOwnerLogin('Console');

    return () => {
      window.removeEventListener('keydown', handleKeyAction, { capture: true });
      window.removeEventListener('keyup', handleKeyAction, { capture: true });
      document.removeEventListener('keydown', handleKeyAction, { capture: true });
    };
  }, [navigate, location.pathname, addToast]);

  if (isAdminRoute) return null;

  return (
    <>
      {/* Floating Owner Quick-Access Badge on Desktop & Mobile */}
      <div className="fixed bottom-20 left-3 z-30 flex items-center gap-1.5 group">
        <button
          type="button"
          id="owner-portal-quick-btn"
          onClick={() => {
            addToast('🔐 Navigating to Owner Portal...', 'info');
            navigate('/admin/login');
          }}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-850 text-slate-400 hover:text-amber-400 border border-slate-700/80 hover:border-amber-500/50 shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 active:scale-95 text-xs"
          title="Owner Login Portal (Shortcut: Ctrl + M or click here)"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400/90" />
          <span className="hidden sm:inline font-bold text-[11px]">Owner Portal</span>
          <kbd className="hidden md:inline px-1 py-0.2 bg-slate-800 text-[10px] rounded border border-slate-700 font-mono text-slate-300">Ctrl+M</kbd>
        </button>
      </div>
    </>
  );
};
