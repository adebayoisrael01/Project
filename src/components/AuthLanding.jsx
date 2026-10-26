import React from 'react';
import { useShop } from '../context/ShopContext';
import { AuthCard } from './AuthCard';

// ============================================================================
// AUTH LANDING COMPONENT
// Purpose: Displayed when the user is NOT authenticated.
// Protects the main credit ledger dashboard until the user signs in or registers.
// ============================================================================
export const AuthLanding = () => {
  const { shopStats } = useShop();

  return (
    <div className="w-full py-4 sm:py-8 space-y-10 animate-in fade-in duration-300">
      
      {/* 1. HERO + AUTH CARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: VALUE PROPOSITION */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Digital Credit Ledger Book • Nigerian Market Edition</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Stop losing money to forgotten shop debts.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Track customer credits, send respectful automated WhatsApp reminders in 
            <span className="text-emerald-400 font-medium"> Pidgin, Yorùbá, Hausa, Igbo & English</span>, 
            and collect payments with instant digital receipt links.
          </p>

          {/* 3 Core Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <div className="text-xs font-bold text-white">Record in &lt;10s</div>
              <div className="text-[11px] text-slate-400">Quick counter credit & payment entry</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 text-sm">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <div className="text-xs font-bold text-white">WhatsApp Prompts</div>
              <div className="text-[11px] text-slate-400">Gentle, firm or standard reminder tones</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm">
                <i className="fa-solid fa-wifi"></i>
              </div>
              <div className="text-xs font-bold text-white">100% Offline-First</div>
              <div className="text-[11px] text-slate-400">Works without data, auto-syncs when online</div>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <div>
              <div className="font-heading font-extrabold text-base text-white">₦120M+</div>
              <div>Debts Recorded Safely</div>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div>
              <div className="font-heading font-extrabold text-base text-white">5 Languages</div>
              <div>Localized Reminders</div>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div>
              <div className="font-heading font-extrabold text-base text-emerald-400">NDPR Safe</div>
              <div>Append-Only Audit Logs</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE INTERACTIVE AUTH CARD */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <AuthCard />
        </div>
      </div>

      {/* 2. PROTECTED LEDGER PREVIEW BANNER */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 relative overflow-hidden text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
              <i className="fa-solid fa-lock"></i>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Ledger Dashboard Protected
              </h3>
              <p className="text-xs text-slate-400">
                Sign in above or tap <strong>Mama Chidi (Owner)</strong> or <strong>Emeka (Staff)</strong> for instant 1-click access to explore the live demo book.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              Live Demo Ready: ₦{shopStats.totalOwed.toLocaleString()} tracked
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
