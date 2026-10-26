import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// AUDIT LOG MODAL
// Purpose: Displays a tamper-evident activity history of everything that happened
// in the shop (who recorded what, who took payments, reversals, and disputes).
// Ensures staff accountability between Owner (Mama Chidi) and Staff (Emeka).
// ============================================================================
export const AuditLogModal = () => {
  // --------------------------------------------------------------------------
  // 1. DATA FROM CONTEXT
  // --------------------------------------------------------------------------
  const { auditLogs, setActiveModal, shop } = useShop();

  // --------------------------------------------------------------------------
  // 2. LOCAL FILTER STATE
  // 'all', 'staff' (Emeka only), 'payments', 'reversals'
  // --------------------------------------------------------------------------
  const [filter, setFilter] = useState('all');

  // Filter the logs according to chosen tab
  const filteredLogs = auditLogs.filter(log => {
    if (filter === 'staff') return log.actorRole === 'staff';
    if (filter === 'reversals') return log.action.toLowerCase().includes('reversed') || log.action.toLowerCase().includes('correction');
    if (filter === 'payments') return log.action.toLowerCase().includes('payment') || log.action.toLowerCase().includes('paid');
    return true; // 'all' filter tab
  });

  // --------------------------------------------------------------------------
  // 3. JSX RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* HEADER */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-lg">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-white">
                Ledger Audit Trail & Staff Logs
              </h2>
              <p className="text-xs text-slate-400">Tamper-evident activity history • {shop.name}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* FILTER TABS */}
        <div className="p-2.5 bg-slate-950/60 border-b border-slate-800 flex gap-2 text-xs overflow-x-auto">
          {[
            { id: 'all', label: 'All Activities', count: auditLogs.length },
            { id: 'staff', label: 'Staff Attendant Only', count: auditLogs.filter(l => l.actorRole === 'staff').length },
            { id: 'payments', label: 'Payments', count: auditLogs.filter(l => l.action.toLowerCase().includes('payment') || l.action.toLowerCase().includes('paid')).length },
            { id: 'reversals', label: 'Reversals & Corrections', count: auditLogs.filter(l => l.action.toLowerCase().includes('reversed')).length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                filter === tab.id
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* LOGS LIST */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No audit records matching this filter.
            </div>
          ) : (
            filteredLogs.map(log => {
              const isReversal = log.action.toLowerCase().includes('reversed');
              const isPayment = log.action.toLowerCase().includes('payment') || log.action.toLowerCase().includes('paid');

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">
                        {log.actorName}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full font-medium ${
                          log.actorRole === 'owner'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : log.actorRole === 'staff'
                            ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        }`}
                      >
                        {log.actorRole.toUpperCase()}
                      </span>
                    </div>

                    <p className={`text-xs ${isReversal ? 'text-amber-300 font-medium' : isPayment ? 'text-emerald-300' : 'text-slate-300'}`}>
                      {log.action}
                    </p>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono shrink-0 whitespace-nowrap">
                    {log.time}
                  </span>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
