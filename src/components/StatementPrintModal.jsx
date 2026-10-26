import React, { useRef } from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// STATEMENT PRINT MODAL
// Purpose: Renders a printable physical paper receipt / credit statement.
// Shopkeepers can print this on paper or save it as a PDF for the customer.
// ============================================================================
export const StatementPrintModal = () => {
  // --------------------------------------------------------------------------
  // 1. DATA FROM CONTEXT
  // --------------------------------------------------------------------------
  const {
    customers,
    selectedCustomerId,
    getCustomerBalance,
    getCustomerLedger,
    setActiveModal,
    shop
  } = useShop();

  // Find active customer
  const customer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const balance = customer ? getCustomerBalance(customer.id) : 0;
  const ledger = customer ? getCustomerLedger(customer.id) : [];

  if (!customer) return null;

  // --------------------------------------------------------------------------
  // 2. TRIGGER BROWSER PRINT
  // --------------------------------------------------------------------------
  const handlePrint = () => {
    // window.print() opens the browser's native print / save as PDF dialog
    window.print();
  };

  // --------------------------------------------------------------------------
  // 3. JSX RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* MODAL CONTROLS HEADER (hidden during actual printing by CSS) */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-receipt text-emerald-400"></i>
            <h2 className="font-heading font-bold text-base text-white">
              Customer Statement Receipt
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-colors"
            >
              <i className="fa-solid fa-print"></i>
              <span>Print / Save PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT PAPER CONTAINER */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-900">
          <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 max-w-md mx-auto shadow-xl print-receipt space-y-5 font-sans">
            
            {/* 1. Shop Brand Header */}
            <div className="text-center border-b-2 border-dashed border-slate-300 pb-4">
              <div className="font-heading font-extrabold text-xl tracking-tight text-slate-900 uppercase">
                {shop.name}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">{shop.tagline}</div>
              <div className="text-[11px] text-slate-500 mt-1">{shop.address}</div>
              <div className="text-[11px] font-mono text-slate-700 font-semibold mt-0.5">
                Tel: {shop.phone}
              </div>
            </div>

            {/* 2. Customer & Date Info */}
            <div className="flex justify-between items-start text-xs border-b border-slate-200 pb-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Customer</div>
                <div className="font-bold text-sm text-slate-900">{customer.name}</div>
                <div className="text-slate-600 font-mono">{customer.phone}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Statement Date</div>
                <div className="font-semibold text-slate-800">
                  {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Ref: ST-{customer.id.slice(-4)}</div>
              </div>
            </div>

            {/* 3. Transactions Table */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Transaction History
              </div>
              <div className="space-y-1.5 text-xs">
                {ledger.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start py-1.5 border-b border-slate-100"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="font-semibold text-slate-800">{item.note}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.entryDate} • {item.type.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className={`font-mono font-bold ${
                          item.type === 'credit' ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        {item.type === 'credit' ? '+' : '-'}₦{item.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Total Outstanding Balance */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">
                  Total Outstanding Balance
                </div>
                <div className="text-[11px] text-slate-500">Payable to {shop.name}</div>
              </div>
              <div className="font-heading font-extrabold text-2xl text-rose-600">
                ₦{balance.toLocaleString()}
              </div>
            </div>

            {/* 5. Bank Transfer Details */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Direct Bank Transfer Details
              </div>
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Bank:</span>
                <span className="font-bold">{shop.bankName}</span>
              </div>
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Account Number:</span>
                <span className="font-mono font-extrabold text-emerald-900 tracking-wider">
                  {shop.accountNumber}
                </span>
              </div>
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Account Name:</span>
                <span className="font-bold">{shop.accountName}</span>
              </div>
            </div>

            {/* 6. Online Link Footer */}
            <div className="text-center pt-2 text-[11px] text-slate-500 space-y-1 border-t-2 border-dashed border-slate-300">
              <div>Pay securely online via card or USSD:</div>
              <code className="block font-mono text-[10px] text-slate-800 bg-slate-100 py-1 rounded">
                https://shoptab.ng/pay/{customer.id}
              </code>
              <div className="text-[10px] text-slate-400 italic pt-1">
                Generated with ShopTab Credit Book • Thank you for your patronage!
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
