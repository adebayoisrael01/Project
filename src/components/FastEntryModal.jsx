import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// FAST ENTRY MODAL
// Purpose: Allows a busy shopkeeper to record a credit or payment in <10 seconds.
// ============================================================================
export const FastEntryModal = () => {
  // --------------------------------------------------------------------------
  // 1. PULL IN DATA AND FUNCTIONS FROM CONTEXT
  // --------------------------------------------------------------------------
  const {
    customers,
    selectedCustomerId,
    fastEntryDefaultType,
    addCredit,
    addPayment,
    setActiveModal,
    addCustomer
  } = useShop();

  // --------------------------------------------------------------------------
  // 2. COMPONENT LOCAL STATE (Form inputs)
  // --------------------------------------------------------------------------
  // Which tab is selected: 'credit' (gave goods) or 'payment' (got money)
  const [entryType, setEntryType] = useState(fastEntryDefaultType || 'credit');

  // ID of the chosen customer
  const [customerId, setCustomerId] = useState(selectedCustomerId || (customers[0]?.id || ''));

  // Amount entered (string for smooth typing)
  const [amount, setAmount] = useState('');

  // Goods note (e.g. "Rice, milk") or payment description
  const [note, setNote] = useState('');

  // Payment channel (Cash, Transfer, POS) - only used for payments
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Expected payment due date preset
  const [dueDatePreset, setDueDatePreset] = useState('7d');

  // Toggle for adding a brand new customer on the fly
  const [isAddingNewCust, setIsAddingNewCust] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // Shows a brief "Saved!" green screen before closing
  const [successBanner, setSuccessBanner] = useState(false);

  // --------------------------------------------------------------------------
  // 3. SYNCHRONIZE STATE IF PROPS OR PRE-SELECTIONS CHANGE
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (selectedCustomerId) {
      setCustomerId(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  useEffect(() => {
    if (fastEntryDefaultType) {
      setEntryType(fastEntryDefaultType);
    }
  }, [fastEntryDefaultType]);

  // --------------------------------------------------------------------------
  // 4. QUICK PRESET BUTTONS (To avoid slow typing on phones)
  // --------------------------------------------------------------------------
  const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];
  const quickItems = [
    'Rice & Semo',
    'Peak Milk & Milo',
    'Sugar & Lipton',
    'Detergent & Soap',
    'Drinks & Water',
    'Cooking Oil'
  ];

  // Helper: When the user taps a denomination chip like +₦1,000
  const handleAddQuickAmount = (valueToAdd) => {
    const currentNumber = Number(amount) || 0;
    const newTotal = currentNumber + valueToAdd;
    setAmount(String(newTotal));
  };

  // Helper: When the user taps an item chip like "Rice & Semo"
  const handleSetQuickItem = (itemName) => {
    if (!note) {
      setNote(itemName);
    } else {
      setNote(note + ', ' + itemName);
    }
  };

  // Helper: Calculate due date based on chosen preset
  const calculateDueDate = () => {
    const date = new Date();
    if (dueDatePreset === 'today') {
      return date.toISOString().split('T')[0];
    }
    if (dueDatePreset === '7d') {
      date.setDate(date.getDate() + 7);
    } else if (dueDatePreset === '14d') {
      date.setDate(date.getDate() + 14);
    } else if (dueDatePreset === '30d') {
      date.setDate(date.getDate() + 30);
    }
    return date.toISOString().split('T')[0];
  };

  // --------------------------------------------------------------------------
  // 5. FORM SUBMISSION
  // --------------------------------------------------------------------------
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page refresh

    let finalCustomerId = customerId;

    // If the shopkeeper typed a new customer name, create that customer first
    if (isAddingNewCust) {
      if (!newCustName.trim()) return;
      const createdCustomer = addCustomer({
        name: newCustName.trim(),
        phone: newCustPhone.trim(),
        tags: ['New Customer']
      });
      if (createdCustomer) {
        finalCustomerId = createdCustomer.id;
      }
    }

    const numericAmount = Number(amount);
    if (!finalCustomerId || numericAmount <= 0) return;

    // Save credit or payment
    if (entryType === 'credit') {
      addCredit({
        customerId: finalCustomerId,
        amount: numericAmount,
        note: note.trim() || 'Goods taken on credit',
        dueDate: calculateDueDate()
      });
    } else {
      addPayment({
        customerId: finalCustomerId,
        amount: numericAmount,
        method: paymentMethod,
        note: note.trim() || `Payment received (${paymentMethod.toUpperCase()})`
      });
    }

    // Show quick success animation then close modal
    setSuccessBanner(true);
    setTimeout(() => {
      setSuccessBanner(false);
      setActiveModal(null);
    }, 700);
  };

  const selectedCustomer = customers.find(c => c.id === customerId);

  // --------------------------------------------------------------------------
  // 6. JSX RENDER (User Interface)
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">

        {/* SUCCESS OVERLAY (Shows when entry is saved) */}
        {successBanner && (
          <div className="absolute inset-0 bg-emerald-950/95 z-20 flex flex-col items-center justify-center text-center p-6 animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mb-3 border border-emerald-500/40 animate-bounce">
              <i className="fa-solid fa-check"></i>
            </div>
            <h3 className="font-heading font-bold text-2xl text-white">Entry Saved!</h3>
            <p className="text-emerald-300 text-sm mt-1">
              Customer ledger and running balance updated instantly.
            </p>
          </div>
        )}

        {/* MODAL HEADER */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${entryType === 'credit' ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
            >
              <i
                className={`fa-solid ${entryType === 'credit' ? 'fa-arrow-up-right-from-square' : 'fa-hand-holding-dollar'
                  }`}
              ></i>
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-white">
                {entryType === 'credit' ? 'Record Credit (You Gave Goods)' : 'Record Payment (Money Received)'}
              </h2>
              <p className="text-xs text-slate-400">Target: under 10 seconds entry</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* TYPE SWITCHER TABS: Credit vs Payment */}
        <div className="grid grid-cols-2 p-2 bg-slate-950/50 border-b border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setEntryType('credit')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${entryType === 'credit'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            <span>You Gave Credit</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryType('payment')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${entryType === 'payment'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <i className="fa-solid fa-hand-holding-dollar"></i>
            <span>You Got Payment</span>
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* FIELD 1: Customer Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <label className="font-medium text-slate-300">Customer</label>
              <button
                type="button"
                onClick={() => setIsAddingNewCust(!isAddingNewCust)}
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                <i className={`fa-solid ${isAddingNewCust ? 'fa-list' : 'fa-user-plus'}`}></i>
                <span>{isAddingNewCust ? 'Pick Existing Customer' : '+ New Customer'}</span>
              </button>
            </div>

            {isAddingNewCust ? (
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                <input
                  type="text"
                  placeholder="Customer Name (e.g. Mama Tolu)"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Phone (e.g. 08031234567)"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            ) : (
              <div>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} {customer.phone ? `(${customer.phone})` : ''}
                    </option>
                  ))}
                </select>
                {selectedCustomer && (
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span>Credit Limit: ₦{(selectedCustomer.creditLimit || 30000).toLocaleString()}</span>
                    <span className="text-emerald-400">{selectedCustomer.reliability?.label}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FIELD 2: Amount & Quick Chips */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Amount (₦)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ₦
              </span>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoFocus
                className="w-full pl-9 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-2xl font-heading font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
              {amount && (
                <button
                  type="button"
                  onClick={() => setAmount('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Quick Denomination Chips */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-2">
              {quickAmounts.map(val => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleAddQuickAmount(val)}
                  className="py-1.5 px-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-semibold rounded-lg active:scale-95 transition-all text-center"
                >
                  +₦{val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* FIELD 3: Item Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {entryType === 'credit' ? 'Items Taken (Optional)' : 'Payment Note / Source'}
            </label>
            <input
              type="text"
              placeholder={entryType === 'credit' ? 'e.g. 2 bags rice, 4 tins Peak milk' : 'e.g. Cash handed at shop counter'}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            {/* 1-Tap item chips */}
            {entryType === 'credit' && (
              <div className="flex gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
                {quickItems.map((item, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleSetQuickItem(item)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 whitespace-nowrap active:scale-95 transition-all"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FIELD 4 (Payment only): Channel Selector */}
          {entryType === 'payment' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cash', label: 'Cash', icon: 'fa-money-bill' },
                  { id: 'transfer', label: 'Bank Transfer', icon: 'fa-building-columns' },
                  { id: 'pos', label: 'POS Terminal', icon: 'fa-credit-card' }
                ].map(channel => (
                  <button
                    type="button"
                    key={channel.id}
                    onClick={() => setPaymentMethod(channel.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${paymentMethod === channel.id
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                  >
                    <i className={`fa-solid ${channel.icon}`}></i>
                    <span>{channel.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FIELD 5 (Credit only): Due Date Presets */}
          {entryType === 'credit' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Expected Payment Date
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {[
                  { id: 'today', label: 'Today' },
                  { id: '7d', label: '7 Days' },
                  { id: '14d', label: '14 Days' },
                  { id: '30d', label: '1 Month' }
                ].map(preset => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setDueDatePreset(preset.id)}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${dueDatePreset === preset.id
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${entryType === 'credit'
                ? 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 shadow-rose-950/50'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-950/50'
                }`}
            >
              <i className="fa-solid fa-bolt"></i>
              <span>Save Entry & Update Balance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
