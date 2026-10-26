import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// NEW CUSTOMER MODAL
// Purpose: Dedicated form to add a new customer to the shop's credit book.
// Captures: Name, Phone (for WhatsApp), Group Tags, Credit Limit, and Notes.
// ============================================================================
export const NewCustomerModal = () => {
  // --------------------------------------------------------------------------
  // 1. CONTEXT FUNCTIONS
  // --------------------------------------------------------------------------
  const { addCustomer, setActiveModal, setSelectedCustomerId } = useShop();

  // --------------------------------------------------------------------------
  // 2. FORM LOCAL STATE
  // --------------------------------------------------------------------------
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tagInput, setTagInput] = useState('Regular');
  const [creditLimit, setCreditLimit] = useState('30000');
  const [notes, setNotes] = useState('');

  // Popular tag chips for Nigerian market customers
  const commonTags = [
    'Regular',
    'Market Neighbour',
    'Church Member',
    'Teacher',
    'Artisan',
    'Caterer'
  ];

  // --------------------------------------------------------------------------
  // 3. SUBMIT HANDLER
  // --------------------------------------------------------------------------
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent standard page reload

    if (!name.trim()) return;

    // Call context action to add customer
    const createdCustomer = addCustomer({
      name: name.trim(),
      phone: phone.trim(),
      tags: [tagInput],
      creditLimit: Number(creditLimit) || 30000,
      notes: notes.trim()
    });

    if (createdCustomer) {
      // Immediately open the newly created customer's ledger!
      setSelectedCustomerId(createdCustomer.id);
      setActiveModal('customerDetail');
    }
  };

  // --------------------------------------------------------------------------
  // 4. JSX RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        
        {/* HEADER */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-lg">
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-white">Add New Customer</h2>
              <p className="text-xs text-slate-400">Create a digital credit ledger</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          
          {/* FIELD 1: Full Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Customer Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Mama Tolu, Brother John, Alhaji Bello"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* FIELD 2: WhatsApp Phone */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              WhatsApp Phone Number (for automated statements)
            </label>
            <input
              type="tel"
              placeholder="e.g. 08031234567 or +234..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* FIELD 3: Group Tag */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Customer Group / Tag
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {commonTags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setTagInput(tag)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    tagInput === tag
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-medium'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type custom tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* FIELD 4: Credit Limit */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Credit Limit (₦)
            </label>
            <input
              type="number"
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Warns you when giving credit if their balance approaches this limit.
            </p>
          </div>

          {/* FIELD 5: Private Shop Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Private Shop Notes
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Stall opposite chemist, pays on salary week, very dependable..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <i className="fa-solid fa-check"></i>
              <span>Save & Open Ledger</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
