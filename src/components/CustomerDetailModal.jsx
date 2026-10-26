import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// CUSTOMER DETAIL MODAL
// Purpose: Displays a customer's full profile, credit limit bar, and a bank-style
// timeline ledger showing every credit, payment, and running balance.
// ============================================================================
export const CustomerDetailModal = () => {
  // --------------------------------------------------------------------------
  // 1. DATA AND FUNCTIONS FROM CONTEXT
  // --------------------------------------------------------------------------
  const {
    customers,
    selectedCustomerId,
    getCustomerBalance,
    getCustomerLedger,
    getCustomerAgeing,
    setActiveModal,
    setSelectedCustomerId,
    setFastEntryDefaultType,
    reverseEntry,
    resolveDispute
  } = useShop();

  // --------------------------------------------------------------------------
  // 2. LOCAL STATE
  // --------------------------------------------------------------------------
  // Which entry is currently being reversed (null if no reversal open)
  const [reversalTargetId, setReversalTargetId] = useState(null);
  const [reversalReason, setReversalReason] = useState('');

  // "Copied!" feedback when clicking Copy Payment Link
  const [copiedLink, setCopiedLink] = useState(false);

  // Find the active customer
  const customer = customers.find(c => c.id === selectedCustomerId);
  if (!customer) return null;

  // Compute live balance and ledger timeline
  const balance = getCustomerBalance(customer.id);
  const ledger = getCustomerLedger(customer.id);
  const ageing = getCustomerAgeing(customer.id);
  const isOwing = balance > 0;

  // Credit limit calculation (percentage used)
  const creditLimit = customer.creditLimit || 35000;
  const limitUsagePercent = Math.min(100, Math.round((Math.max(0, balance) / creditLimit) * 100));

  // The customer's personal payment link
  const customerPayUrl = `https://shoptab.ng/pay/${customer.id}`;

  // --------------------------------------------------------------------------
  // 3. HANDLERS
  // --------------------------------------------------------------------------
  const handleCopyLink = () => {
    navigator.clipboard.writeText(customerPayUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleConfirmReversal = (event) => {
    event.preventDefault();
    if (!reversalTargetId || !reversalReason.trim()) return;

    // Call context function to record non-destructive adjustment
    reverseEntry(reversalTargetId, reversalReason.trim());

    // Reset local state
    setReversalTargetId(null);
    setReversalReason('');
  };

  // --------------------------------------------------------------------------
  // 4. JSX RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* SECTION A: PROFILE HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            {/* Customer Initials Avatar */}
            <div
              className={`w-13 h-13 rounded-2xl ${customer.avatarBg || 'bg-emerald-600'} flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0`}
            >
              {customer.name
                .split(' ')
                .map(part => part[0])
                .slice(0, 2)
                .join('')}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading font-extrabold text-xl text-white">
                  {customer.name}
                </h2>
                {customer.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                {customer.phone && (
                  <a
                    href={`tel:${customer.phone}`}
                    className="flex items-center gap-1 text-emerald-400 hover:underline font-mono"
                  >
                    <i className="fa-solid fa-phone text-[10px]"></i>
                    {customer.phone}
                  </a>
                )}
                <span>• Joined {customer.createdAt}</span>
              </div>

              {customer.notes && (
                <p className="text-xs text-slate-400 italic">
                  "{customer.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Close modal button */}
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* SECTION B: BALANCE & CREDIT LIMIT STATUS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-900 border-b border-slate-800">
          {/* Card 1: Balance Owed */}
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              {isOwing ? 'Current Balance Owed' : 'Account Status'}
            </div>
            <div
              className={`font-heading font-extrabold text-2xl sm:text-3xl tracking-tight ${
                isOwing ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              ₦{Math.abs(balance).toLocaleString()}
            </div>
            {isOwing && (
              <div className="text-[11px] text-amber-400 mt-0.5">
                <i className="fa-solid fa-clock text-[10px] mr-1"></i>
                Oldest credit: {ageing.days} days ago
              </div>
            )}
          </div>

          {/* Card 2: Credit Limit Progress */}
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Credit Limit
            </div>
            <div className="font-heading font-bold text-lg text-slate-200">
              ₦{creditLimit.toLocaleString()}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
              <div
                style={{ width: `${limitUsagePercent}%` }}
                className={`h-full transition-all ${
                  limitUsagePercent > 85 ? 'bg-rose-500' : limitUsagePercent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              ></div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {limitUsagePercent}% limit used
            </div>
          </div>

          {/* Card 3: Reliability Score */}
          <div className="col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Payment Reliability
            </div>
            <div className="font-heading font-bold text-lg text-emerald-400">
              {customer.reliability?.score || 90}%
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {customer.reliability?.label}
            </div>
            <div className="text-[10px] text-slate-500">
              Avg repayment: {customer.reliability?.avgDays || 7} days
            </div>
          </div>
        </div>

        {/* SECTION C: ACTION TOOLBAR */}
        <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCustomerId(customer.id);
                setFastEntryDefaultType('credit');
                setActiveModal('fastEntry');
              }}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Give Credit</span>
            </button>

            <button
              onClick={() => {
                setSelectedCustomerId(customer.id);
                setFastEntryDefaultType('payment');
                setActiveModal('fastEntry');
              }}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <i className="fa-solid fa-hand-holding-dollar"></i>
              <span>Got Payment</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isOwing && (
              <button
                onClick={() => {
                  setSelectedCustomerId(customer.id);
                  setActiveModal('reminder');
                }}
                className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <i className="fa-brands fa-whatsapp text-emerald-400"></i>
                <span>Polite Reminder</span>
              </button>
            )}

            <button
              onClick={() => {
                setSelectedCustomerId(customer.id);
                setActiveModal('portal');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
              <span>Customer Portal Link</span>
            </button>

            <button
              onClick={() => {
                setSelectedCustomerId(customer.id);
                setActiveModal('statement');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <i className="fa-solid fa-print"></i>
              <span>Statement</span>
            </button>
          </div>
        </div>

        {/* SECTION D: REVERSAL CONFIRMATION DRAWER (Shown when correcting an entry) */}
        {reversalTargetId && (
          <form onSubmit={handleConfirmReversal} className="p-3 bg-amber-950/60 border-b border-amber-800/80 animate-in slide-in-from-top-2">
            <div className="text-xs font-semibold text-amber-200 mb-1 flex items-center gap-1.5">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>Reversing Entry #{reversalTargetId.slice(-6)} (Audit-safe correction)</span>
            </div>
            <p className="text-[11px] text-amber-300/80 mb-2">
              Entries are never secretly deleted. A compensating reversal entry will be recorded with your reason.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Reason (e.g. wrong amount keyed in, customer returned goods)..."
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                required
                className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-amber-700/80 rounded-lg text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg"
              >
                Confirm Reversal
              </button>
              <button
                type="button"
                onClick={() => setReversalTargetId(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* SECTION E: TRANSACTIONS TIMELINE LEDGER */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
            <span>Transaction Timeline (Audit Trail)</span>
            <span>{ledger.length} entries</span>
          </div>

          {ledger.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No entries recorded for this customer yet.
            </div>
          ) : (
            ledger.map((entry) => {
              const isCredit = entry.type === 'credit';
              const isPayment = entry.type === 'payment';

              return (
                <div
                  key={entry.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    entry.isReversed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : entry.isDisputed
                      ? 'bg-rose-950/30 border-rose-700/60'
                      : 'glass-card border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${
                          entry.isReversed
                            ? 'bg-slate-800 text-slate-500'
                            : isCredit
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : isPayment
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        <i
                          className={`fa-solid ${
                            isCredit
                              ? 'fa-arrow-up-right-from-square'
                              : isPayment
                              ? 'fa-hand-holding-dollar'
                              : 'fa-rotate-left'
                          }`}
                        ></i>
                      </div>

                      {/* Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-white">
                            {isCredit
                              ? 'Credit Given'
                              : isPayment
                              ? `Payment Received (${entry.method.toUpperCase()})`
                              : 'Adjustment / Reversal'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {entry.entryDate}
                          </span>
                          {entry.isReversed && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 line-through">
                              Reversed
                            </span>
                          )}
                        </div>

                        <p className={`text-xs ${entry.isReversed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                          {entry.note}
                        </p>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                          <span>By: {entry.recordedBy?.name || 'Staff'}</span>
                          <span>•</span>
                          <span>Ref: #{entry.id.slice(-6)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Running Balance */}
                    <div className="text-right shrink-0">
                      <div
                        className={`font-heading font-bold text-base sm:text-lg ${
                          entry.isReversed
                            ? 'line-through text-slate-500'
                            : isCredit
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {isCredit ? '+' : '-'}₦{entry.amount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Bal: ₦{entry.runningBalance.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Customer Dispute Alert if raised */}
                  {entry.isDisputed && (
                    <div className="mt-2.5 p-2 rounded-lg bg-rose-950/70 border border-rose-800 flex items-center justify-between text-xs">
                      <div className="text-rose-300 flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-exclamation text-rose-400"></i>
                        <span>Disputed by Customer: "{entry.disputeReason || 'Amount disputed'}"</span>
                      </div>
                      <button
                        onClick={() => resolveDispute(entry.id)}
                        className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[10px]"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  )}

                  {/* Reversal action button */}
                  {!entry.isReversed && !reversalTargetId && (
                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex justify-end">
                      <button
                        onClick={() => setReversalTargetId(entry.id)}
                        className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                      >
                        <i className="fa-solid fa-rotate-left text-[9px]"></i>
                        <span>Correct / Reverse Entry</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* SECTION F: FOOTER WITH REPAYMENT URL */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Repayment URL:</span>
            <code className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono truncate max-w-[200px] sm:max-w-xs">
              {customerPayUrl}
            </code>
          </div>

          <button
            onClick={handleCopyLink}
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <i className={`fa-solid ${copiedLink ? 'fa-check' : 'fa-copy'}`}></i>
            <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
