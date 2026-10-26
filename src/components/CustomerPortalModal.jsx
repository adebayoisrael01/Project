import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// CUSTOMER PORTAL MODAL
// Purpose: Simulates what the customer (e.g. Mrs. Ada) sees when she taps
// her personal payment link: https://shoptab.ng/pay/ada-okafor
// Features: Itemized statement, dispute submission, and live online checkout.
// ============================================================================
export const CustomerPortalModal = () => {
  // --------------------------------------------------------------------------
  // 1. DATA FROM CONTEXT
  // --------------------------------------------------------------------------
  const {
    customers,
    selectedCustomerId,
    getCustomerBalance,
    getCustomerLedger,
    disputeEntry,
    simulateLinkPayment,
    setActiveModal,
    shop
  } = useShop();

  // Find selected customer (or default to the first customer)
  const customer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const balance = customer ? getCustomerBalance(customer.id) : 0;
  const ledger = customer ? getCustomerLedger(customer.id) : [];

  // --------------------------------------------------------------------------
  // 2. LOCAL STATE
  // --------------------------------------------------------------------------
  // Amount customer wants to pay (defaults to full balance)
  const [payAmount, setPayAmount] = useState(balance > 0 ? String(balance) : '1000');

  // Chosen payment method: 'transfer', 'card', or 'ussd'
  const [paymentChannel, setPaymentChannel] = useState('transfer');

  // Dispute form state
  const [disputeEntryId, setDisputeEntryId] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');

  // Receipt object if payment succeeded
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Spinner while processing payment
  const [isProcessing, setIsProcessing] = useState(false);

  if (!customer) return null;

  // --------------------------------------------------------------------------
  // 3. ACTION HANDLERS
  // --------------------------------------------------------------------------
  // Handle customer paying online
  const handlePay = (event) => {
    event.preventDefault();
    const numericAmount = Number(payAmount);
    if (!numericAmount || numericAmount <= 0) return;

    setIsProcessing(true);

    // Simulate network delay for realistic Paystack / NIBSS transaction
    setTimeout(() => {
      const generatedRef = 'PSTK_' + Math.floor(100000 + Math.random() * 900000);

      // Auto-post the payment to the shopkeeper's ledger in context
      simulateLinkPayment(customer.id, numericAmount, paymentChannel, generatedRef);

      setIsProcessing(false);
      setPaymentSuccess({
        amount: numericAmount,
        ref: generatedRef,
        date: new Date().toLocaleString(),
        channel: paymentChannel
      });
    }, 900);
  };

  // Handle customer disputing an item
  const handleDisputeSubmit = (event) => {
    event.preventDefault();
    if (!disputeEntryId || !disputeReason.trim()) return;

    disputeEntry(disputeEntryId, disputeReason.trim());
    setDisputeEntryId(null);
    setDisputeReason('');
  };

  // --------------------------------------------------------------------------
  // 4. JSX RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* TOP BROWSER BAR SIMULATION */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="ml-2 font-mono text-[11px] bg-slate-800/80 px-2.5 py-0.5 rounded-full text-slate-300 truncate max-w-[200px] sm:max-w-xs flex items-center gap-1.5">
              <i className="fa-solid fa-lock text-emerald-400 text-[10px]"></i>
              <span>shoptab.ng/pay/{customer.id}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Customer View
            </span>
            <button
              onClick={() => setActiveModal(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* VIEW A: PAYMENT SUCCESS SCREEN (RECEIPT) */}
        {paymentSuccess ? (
          <div className="p-6 text-center space-y-4 my-auto animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto animate-bounce">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Payment Successful!</h2>
              <p className="text-emerald-300 text-sm mt-1">
                ₦{paymentSuccess.amount.toLocaleString()} paid to {shop.name}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Payment Reference:</span>
                <span className="font-mono text-white font-semibold">{paymentSuccess.ref}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Date & Time:</span>
                <span className="text-white">{paymentSuccess.date}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Rail:</span>
                <span className="uppercase text-white font-medium">{paymentSuccess.channel}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span>New Balance:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  ₦{getCustomerBalance(customer.id).toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Receipt SMS sent to {customer.phone || 'your phone'}. The shopkeeper's ledger has updated automatically.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setPaymentSuccess(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Return to Statement
              </button>
            </div>
          </div>
        ) : (
          /* VIEW B: MAIN CUSTOMER STATEMENT & PAYMENT FORM */
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            
            {/* Merchant Identity Card */}
            <div className="flex items-center gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0">
                <i className="fa-solid fa-store"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-bold text-base text-white truncate">
                    {shop.name}
                  </h3>
                  <i className="fa-solid fa-circle-check text-emerald-400 text-xs" title="Verified Merchant"></i>
                </div>
                <p className="text-xs text-slate-400 truncate">{shop.address}</p>
                <p className="text-[11px] text-emerald-400 font-mono">{shop.phone}</p>
              </div>
            </div>

            {/* Customer Greeting & Balance Hero */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800 text-center relative overflow-hidden">
              <div className="text-xs text-slate-400 font-medium">Hello, {customer.name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Your Current Credit Balance</div>
              <div className="font-heading font-extrabold text-3xl sm:text-4xl text-rose-400 tracking-tight my-2">
                ₦{balance.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">
                {balance > 0 ? (
                  <span>Please make a payment below to keep your shop credit active.</span>
                ) : (
                  <span className="text-emerald-400 font-semibold">Your balance is fully settled! Thank you!</span>
                )}
              </div>
            </div>

            {/* Dispute Drawer if active */}
            {disputeEntryId && (
              <form onSubmit={handleDisputeSubmit} className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl space-y-2 animate-in fade-in">
                <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-question"></i>
                  <span>Dispute Entry #{disputeEntryId.slice(-6)}</span>
                </div>
                <input
                  type="text"
                  placeholder="Explain issue (e.g. I only received 1 tin of milk, not 2)..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-rose-700/80 rounded-lg text-white focus:outline-none focus:border-rose-400"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg"
                  >
                    Send Dispute to Shopkeeper
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisputeEntryId(null)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Itemized Transactions & Goods Taken */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Itemized Purchases & Payments</span>
                <span className="text-[11px] text-slate-500">Tap flag to dispute</span>
              </div>

              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {ledger.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium text-slate-200">{item.note}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.entryDate} • {item.type === 'credit' ? 'Goods Taken' : 'Payment Made'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-heading font-bold text-sm ${
                          item.type === 'credit' ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {item.type === 'credit' ? '+' : '-'}₦{item.amount.toLocaleString()}
                      </span>

                      {/* Dispute Flag */}
                      {item.type === 'credit' && !item.isReversed && (
                        <button
                          onClick={() => setDisputeEntryId(item.id)}
                          title="Dispute this entry"
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <i className="fa-regular fa-flag text-[11px]"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Online Repayment Checkout Form */}
            {balance > 0 && (
              <form onSubmit={handlePay} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-white">
                    Make a Repayment
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Secured by Paystack / NIBSS</span>
                  </span>
                </div>

                {/* Amount input & preset chips */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Amount to Pay (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      min="100"
                      required
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-lg font-heading font-bold text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setPayAmount(String(balance))}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold"
                    >
                      Pay Full ₦{balance.toLocaleString()}
                    </button>
                    {balance > 2000 && (
                      <button
                        type="button"
                        onClick={() => setPayAmount(String(Math.round(balance / 2)))}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                      >
                        Pay Half ₦{Math.round(balance / 2).toLocaleString()}
                      </button>
                    )}
                  </div>
                </div>

                {/* Channel Selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'transfer', label: 'Bank Transfer', icon: 'fa-building-columns' },
                      { id: 'card', label: 'Debit Card', icon: 'fa-credit-card' },
                      { id: 'ussd', label: 'USSD Code', icon: 'fa-mobile-screen' }
                    ].map(channel => (
                      <button
                        type="button"
                        key={channel.id}
                        onClick={() => setPaymentChannel(channel.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          paymentChannel === channel.id
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <i className={`fa-solid ${channel.icon} block text-sm mb-1`}></i>
                        <span>{channel.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Method Specific Details */}
                {paymentChannel === 'transfer' && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <div className="text-[11px] text-slate-400">Transfer to this dedicated virtual account:</div>
                    <div className="flex items-center justify-between font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-white font-bold text-sm tracking-wider">9038472910</div>
                        <div className="text-[10px] text-slate-400">Moniepoint MFB • ShopTab-{customer.name}</div>
                      </div>
                      <span className="text-[10px] text-emerald-400">Auto-matches</span>
                    </div>
                  </div>
                )}

                {paymentChannel === 'ussd' && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-center space-y-1">
                    <div className="text-slate-400">Dial on your registered phone:</div>
                    <code className="block font-mono text-sm font-bold text-amber-300 bg-slate-950 py-1.5 rounded-lg border border-slate-800">
                      *737*2*{payAmount}*14#
                    </code>
                  </div>
                )}

                {/* Submit Payment button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      <span>Processing Payment Rail...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock"></i>
                      <span>Complete ₦{Number(payAmount || 0).toLocaleString()} Payment</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
