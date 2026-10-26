import React from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// DASHBOARD STATS COMPONENT
// Purpose: Displays the shop's key financial numbers at the top of the screen:
// Total Owed, Overdue (>14d) Debt, Collected This Week, and 4 Fast Action Buttons.
// ============================================================================
export const DashboardStats = () => {
  // --------------------------------------------------------------------------
  // 1. DATA AND FUNCTIONS FROM CONTEXT
  // --------------------------------------------------------------------------
  const {
    shopStats,
    setActiveModal,
    setFastEntryDefaultType,
    setSelectedCustomerId
  } = useShop();

  // --------------------------------------------------------------------------
  // 2. QUICK ACTION HANDLERS
  // --------------------------------------------------------------------------
  // Opens the fast entry modal ready to record credit given
  const handleOpenCredit = () => {
    setSelectedCustomerId(null);
    setFastEntryDefaultType('credit');
    setActiveModal('fastEntry');
  };

  // Opens the fast entry modal ready to record payment received
  const handleOpenPayment = () => {
    setSelectedCustomerId(null);
    setFastEntryDefaultType('payment');
    setActiveModal('fastEntry');
  };

  // --------------------------------------------------------------------------
  // 3. PERCENTAGE CALCULATIONS FOR THE AGEING PROGRESS BAR
  // --------------------------------------------------------------------------
  const totalOwed = shopStats.totalOwed;
  const aging = shopStats.agingBreakdown;

  // Calculate percentage of total debt in each age category
  const percent0to7Days = totalOwed > 0 ? (aging.tier0_7 / totalOwed) * 100 : 0;
  const percent8to30Days = totalOwed > 0 ? (aging.tier8_30 / totalOwed) * 100 : 0;
  const percent31to60Days = totalOwed > 0 ? (aging.tier31_60 / totalOwed) * 100 : 0;
  const percent60PlusDays = totalOwed > 0 ? (aging.tier60Plus / totalOwed) * 100 : 0;

  // --------------------------------------------------------------------------
  // 4. JSX RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-4">
      
      {/* 4 PRIMARY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* CARD 1: Total Debt Owed */}
        <div className="glass-card rounded-2xl p-4 border border-rose-900/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/20 transition-all"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-medium">Total Debt Owed</span>
            <span className="p-1 rounded-md bg-rose-500/10 text-rose-400">
              <i className="fa-solid fa-hand-holding-dollar"></i>
            </span>
          </div>
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-rose-300 tracking-tight">
            ₦{totalOwed.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="font-semibold text-rose-400">{shopStats.debtorsCount}</span>
            <span>customers owing</span>
          </div>
        </div>

        {/* CARD 2: Overdue (>14 Days) */}
        <div
          onClick={() => setActiveModal('aging')}
          className="glass-card rounded-2xl p-4 border border-amber-900/30 relative overflow-hidden cursor-pointer hover:border-amber-600/50 transition-all group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-medium">Overdue (&gt;14 Days)</span>
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-400">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </span>
          </div>
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-300 tracking-tight">
            ₦{shopStats.overdueAmount.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-amber-400/90 font-medium">{shopStats.overdueCount} overdue debtors</span>
            <span className="text-slate-500 text-[10px] group-hover:text-amber-400 transition-colors">
              View Ageing <i className="fa-solid fa-arrow-right text-[9px]"></i>
            </span>
          </div>
        </div>

        {/* CARD 3: Collected This Week */}
        <div className="glass-card rounded-2xl p-4 border border-emerald-900/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-medium">Collected This Week</span>
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <i className="fa-solid fa-money-bill-trend-up"></i>
            </span>
          </div>
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400 tracking-tight">
            ₦{shopStats.collectedThisWeek.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400/80">
            <i className="fa-solid fa-arrow-trend-up text-[10px]"></i>
            <span>Recovered in last 7 days</span>
          </div>
        </div>

        {/* CARD 4: Debt Recovery Rate Target */}
        <div className="glass-card rounded-2xl p-4 border border-blue-900/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-medium">Debt Recovery Rate</span>
            <span className="p-1 rounded-md bg-blue-500/10 text-blue-400">
              <i className="fa-solid fa-shield-check"></i>
            </span>
          </div>
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-blue-300 tracking-tight">
            -24%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-400/80">
            <i className="fa-solid fa-bullseye text-[10px]"></i>
            <span>Surpassing 60-day target (-20%)</span>
          </div>
        </div>

      </div>

      {/* DEBT AGEING DISTRIBUTION BAR */}
      <div
        onClick={() => setActiveModal('aging')}
        className="glass-card rounded-xl p-3 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-1.5 font-medium">
            <i className="fa-solid fa-layer-group text-slate-400"></i>
            <span>Debt Ageing Breakdown</span>
          </div>
          <span className="text-[11px] text-blue-400 hover:underline flex items-center gap-1">
            Full Ageing Report <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </span>
        </div>

        {/* The Colored Progress Bar */}
        <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden flex gap-0.5">
          <div
            style={{ width: `${percent0to7Days}%` }}
            title={`0-7 Days: ₦${aging.tier0_7.toLocaleString()}`}
            className="bg-emerald-500 h-full transition-all"
          ></div>
          <div
            style={{ width: `${percent8to30Days}%` }}
            title={`8-30 Days: ₦${aging.tier8_30.toLocaleString()}`}
            className="bg-amber-500 h-full transition-all"
          ></div>
          <div
            style={{ width: `${percent31to60Days}%` }}
            title={`31-60 Days: ₦${aging.tier31_60.toLocaleString()}`}
            className="bg-orange-500 h-full transition-all"
          ></div>
          <div
            style={{ width: `${percent60PlusDays}%` }}
            title={`60+ Days: ₦${aging.tier60Plus.toLocaleString()}`}
            className="bg-rose-600 h-full transition-all"
          ></div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>0-7d: ₦{aging.tier0_7.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>8-30d: ₦{aging.tier8_30.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>31-60d: ₦{aging.tier31_60.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span>60+d: ₦{aging.tier60Plus.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 4 FAST ACTION BUTTONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* Button 1: You Gave Credit */}
        <button
          onClick={handleOpenCredit}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-semibold text-sm shadow-lg shadow-rose-950/50 transition-all active:scale-[0.98]"
        >
          <i className="fa-solid fa-arrow-up-right-from-square text-base"></i>
          <span>You Gave Credit</span>
        </button>

        {/* Button 2: Got Payment */}
        <button
          onClick={handleOpenPayment}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.98]"
        >
          <i className="fa-solid fa-arrow-down-left-and-up-right-to-center text-base"></i>
          <span>Got Payment</span>
        </button>

        {/* Button 3: Add Customer */}
        <button
          onClick={() => setActiveModal('newCustomer')}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all active:scale-[0.98]"
        >
          <i className="fa-solid fa-user-plus text-emerald-400"></i>
          <span>+ Customer</span>
        </button>

        {/* Button 4: Polite Reminder */}
        <button
          onClick={() => {
            setSelectedCustomerId('cust_ada');
            setActiveModal('reminder');
          }}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all active:scale-[0.98]"
        >
          <i className="fa-brands fa-whatsapp text-emerald-400 text-base"></i>
          <span>Polite Remind</span>
        </button>

      </div>
    </div>
  );
};
