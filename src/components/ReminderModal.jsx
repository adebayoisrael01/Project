import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// REMINDER MODAL
// Purpose: Multi-lingual, polite WhatsApp & SMS reminder engine.
// Generates polite messages in Pidgin, Yoruba, Hausa, Igbo, or English.
// ============================================================================
export const ReminderModal = () => {
  // --------------------------------------------------------------------------
  // 1. DATA AND FUNCTIONS FROM CONTEXT
  // --------------------------------------------------------------------------
  const {
    customers,
    selectedCustomerId,
    getCustomerBalance,
    setActiveModal,
    reminderTemplates,
    shop,
    addAuditLog
  } = useShop();

  // --------------------------------------------------------------------------
  // 2. LOCAL STATE
  // --------------------------------------------------------------------------
  // The chosen debtor customer
  const [customerId, setCustomerId] = useState(selectedCustomerId || customers[0]?.id || '');

  // Language: 'pidgin', 'en', 'yoruba', 'hausa', 'igbo'
  const [language, setLanguage] = useState('pidgin');

  // Tone: 'gentle' (warm check-in), 'standard' (direct), 'firm' (overdue notice)
  const [tone, setTone] = useState('gentle');

  // Feedback for clipboard copy
  const [copied, setCopied] = useState(false);

  // Find the selected customer and compute their live balance
  const customer = customers.find(c => c.id === customerId);
  const balance = customer ? getCustomerBalance(customer.id) : 0;
  const linkUrl = `https://shoptab.ng/pay/${customer?.id || 'demo'}`;

  // --------------------------------------------------------------------------
  // 3. GENERATE MESSAGE TEXT
  // Grab the right template based on chosen language and tone
  // --------------------------------------------------------------------------
  const currentLanguageObject = reminderTemplates[language] || reminderTemplates.en;
  const currentToneObject = currentLanguageObject.tones[tone] || currentLanguageObject.tones.gentle;

  const generatedMessage = customer
    ? currentToneObject.getText({
        customerName: customer.name,
        balance: balance,
        shopName: shop.name,
        linkUrl: linkUrl
      })
    : '';

  // --------------------------------------------------------------------------
  // 4. ACTION HANDLERS
  // --------------------------------------------------------------------------
  // Open directly in WhatsApp with the pre-written message
  const handleOpenWhatsApp = () => {
    if (!customer?.phone) {
      alert('This customer has no phone number recorded. Please copy the message and send manually.');
      return;
    }

    // Clean phone number (turn 080... into 23480...)
    let cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '234' + cleanPhone.slice(1);
    }

    // Construct WhatsApp link
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(generatedMessage)}`;
    window.open(waUrl, '_blank');

    addAuditLog(`Sent WhatsApp reminder (${language}/${tone}) to ${customer.name}`);
  };

  // Copy message text to clipboard
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    addAuditLog(`Copied reminder text for ${customer?.name}`);
    setTimeout(() => setCopied(false), 2000);
  };

  // --------------------------------------------------------------------------
  // 5. JSX RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        
        {/* HEADER */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-lg">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-white">
                Polite WhatsApp Reminder
              </h2>
              <p className="text-xs text-slate-400">Respectful, multi-lingual debt recovery</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* STEP 1: Select Customer */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Customer Owing
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {customers
                .filter(c => getCustomerBalance(c.id) > 0)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — Owed: ₦{getCustomerBalance(c.id).toLocaleString()}
                  </option>
                ))}
            </select>
          </div>

          {/* STEP 2: Choose Language */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Choose Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
              {Object.entries(reminderTemplates).map(([langKey, langData]) => (
                <button
                  type="button"
                  key={langKey}
                  onClick={() => setLanguage(langKey)}
                  className={`py-2 px-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    language === langKey
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-semibold shadow-sm'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-base">{langData.flag}</span>
                  <span className="text-[11px] truncate">{langData.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: Choose Tone */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Tone of Voice
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'gentle', label: 'Gentle', desc: 'Warm & polite' },
                { id: 'standard', label: 'Standard', desc: 'Direct reminder' },
                { id: 'firm', label: 'Firm', desc: 'Overdue notice' }
              ].map(toneOption => (
                <button
                  type="button"
                  key={toneOption.id}
                  onClick={() => setTone(toneOption.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    tone === toneOption.id
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-medium'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-semibold text-white">{toneOption.label}</div>
                  <div className="text-[10px] text-slate-400">{toneOption.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 4: Live Message Preview */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-medium">Message Preview (WhatsApp Ready)</span>
              <span className="text-[11px] text-emerald-400">
                Balance: ₦{balance.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 relative">
              <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {generatedMessage}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Includes customer's personal payment link</span>
                <i className="fa-brands fa-whatsapp text-emerald-500"></i>
              </div>
            </div>
          </div>

          {/* STEP 5: Send or Copy */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={handleOpenWhatsApp}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.98]"
            >
              <i className="fa-brands fa-whatsapp text-base"></i>
              <span>Open in WhatsApp</span>
            </button>

            <button
              onClick={handleCopyMessage}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <i className={`fa-solid ${copied ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Text & Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
