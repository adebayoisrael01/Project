import React from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// AGING REPORT MODAL
// Purpose: Displays how old debts are across the shop (0-7d, 8-30d, 31-60d, 60+d),
// tracks debt recovery against targets, and ranks the top debtors.
// ============================================================================
export const AgingReportModal = () => {
  // --------------------------------------------------------------------------
  // 1. DATA FROM CONTEXT
  // --------------------------------------------------------------------------
  const {
    shopStats,
    setActiveModal,
    setSelectedCustomerId,
    shop
  } = useShop();

  const aging = shopStats.agingBreakdown;
  const totalDebt = shopStats.totalOwed || 1; // Avoid divide-by-zero

  // --------------------------------------------------------------------------
  // 2. THE 4 DEBT AGE TIERS
  // --------------------------------------------------------------------------
  const tiers = [
    {
      label: '0 - 7 Days',
      desc: 'Active current credit (Low risk)',
      amount: aging.tier0_7,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      bgCard: 'border-emerald-500/30'
    },
    {
      label: '8 - 30 Days',
      desc: 'Approaching monthly cycle (Monitor)',
      amount: aging.tier8_30,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      bgCard: 'border-amber-500/30'
    },
    {
      label: '31 - 60 Days',
      desc: 'Overdue credit (Needs firm reminder)',
      amount: aging.tier31_60,
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      bgCard: 'border-orange-500/30'
    },
    {
      label: '60+ Days',
      desc: 'Severely delinquent (Action required)',
      amount: aging.tier60Plus,
      color: 'bg-rose-600',
      textColor: 'text-rose-400',
      bgCard: 'border-rose-500/30'
    }
  ];

  // Shortcut handler: Open reminder modal for chosen debtor
  const handleRemindDebtor = (customerId) => {
    setSelectedCustomerId(customerId);
    setActiveModal('reminder');
  };

  // --------------------------------------------------------------------------
  // 3. JSX RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* HEADER */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-lg">
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-white">
                Debtor Ageing Analysis
              </h2>
              <p className="text-xs text-slate-400">{shop.name} • Recovery Insights</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          
          {/* SECTION 1: Summary Ageing Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {tiers.map((tier, index) => {
              const percentage = Math.round((tier.amount / totalDebt) * 100);
              return (
                <div
                  key={index}
                  className={`p-3 rounded-xl bg-slate-950 border ${tier.bgCard} space-y-1`}
                >
                  <div className="text-[11px] font-semibold text-slate-400">{tier.label}</div>
                  <div className={`font-heading font-extrabold text-lg sm:text-xl ${tier.textColor}`}>
                    ₦{tier.amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span>{percentage}% of debt</span>
                    <span className={`w-2 h-2 rounded-full ${tier.color}`}></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SECTION 2: Recovery Goal Progress Bar */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">
                <i className="fa-solid fa-bullseye text-blue-400 mr-1.5"></i>
                60-Day Debt Reduction Target
              </span>
              <span className="text-emerald-400 font-bold">-24% achieved (Goal: -20%)</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-[85%]"></div>
            </div>
            <p className="text-[11px] text-slate-400">
              Prompt WhatsApp reminders have reduced debt older than 30 days from ₦62,000 to ₦27,500.
            </p>
          </div>

          {/* SECTION 3: Top Outstanding Debtors Ranking */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Top Debtors by Amount Owed</span>
              <span>Action</span>
            </div>

            <div className="space-y-2">
              {shopStats.topDebtors.map((debtor, index) => (
                <div
                  key={debtor.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-bold text-slate-500">
                      #{index + 1}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl ${debtor.avatarBg || 'bg-emerald-600'} flex items-center justify-center text-white font-bold text-xs shrink-0`}
                    >
                      {debtor.name
                        .split(' ')
                        .map(n => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{debtor.name}</div>
                      <div className="text-[10px] text-slate-400">
                        Oldest debt: {debtor.ageing.days} days ago • {debtor.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-heading font-extrabold text-sm text-rose-400">
                        ₦{debtor.balance.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Limit: ₦{(debtor.creditLimit || 30000).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemindDebtor(debtor.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center gap-1 transition-colors"
                    >
                      <i className="fa-brands fa-whatsapp text-emerald-400"></i>
                      <span className="hidden sm:inline">Remind</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
