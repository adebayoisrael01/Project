import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// CUSTOMER LIST COMPONENT
// Purpose: Displays the searchable, filterable list of customers and debtors.
// Each debtor card shows balance owed, age of debt, and 1-tap action buttons.
// ============================================================================
export const CustomerList = () => {
  // --------------------------------------------------------------------------
  // 1. DATA AND FUNCTIONS FROM CONTEXT
  // --------------------------------------------------------------------------
  const {
    customers,
    getCustomerBalance,
    getCustomerAgeing,
    setActiveModal,
    setSelectedCustomerId,
    setFastEntryDefaultType
  } = useShop();

  // --------------------------------------------------------------------------
  // 2. LOCAL STATE (Search text, Filter tab, Sort option)
  // --------------------------------------------------------------------------
  // What the user typed in the search box
  const [searchQuery, setSearchQuery] = useState('');

  // Which filter tab is active: 'owing', 'overdue', 'all', or 'cleared'
  const [activeFilter, setActiveFilter] = useState('owing');

  // How to sort the list: 'debt_desc' (highest first), 'oldest_debt', 'name'
  const [sortBy, setSortBy] = useState('debt_desc');

  // --------------------------------------------------------------------------
  // 3. ENRICH CUSTOMERS WITH LIVE CALCULATED BALANCES
  // --------------------------------------------------------------------------
  const enrichedCustomers = useMemo(() => {
    return customers.map(customer => {
      const liveBalance = getCustomerBalance(customer.id);
      const ageingInfo = getCustomerAgeing(customer.id);

      return {
        ...customer,
        balance: liveBalance,
        ageing: ageingInfo
      };
    });
  }, [customers, getCustomerBalance, getCustomerAgeing]);

  // --------------------------------------------------------------------------
  // 4. FILTER AND SORT THE CUSTOMERS LIST
  // --------------------------------------------------------------------------
  const filteredCustomers = useMemo(() => {
    return enrichedCustomers
      .filter(customer => {
        // Step A: Search Query Match (checks name, phone, or tags)
        const nameMatches = customer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const phoneMatches = customer.phone && customer.phone.includes(searchQuery);
        const tagMatches = customer.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSearch = nameMatches || phoneMatches || tagMatches;
        if (!matchesSearch) return false;

        // Step B: Active Filter Tab Match
        if (activeFilter === 'owing') return customer.balance > 0;
        if (activeFilter === 'overdue') return customer.balance > 0 && customer.ageing.days >= 14;
        if (activeFilter === 'cleared') return customer.balance <= 0;
        return true; // 'all' filter tab
      })
      .sort((a, b) => {
        // Step C: Sort
        if (sortBy === 'debt_desc') return b.balance - a.balance;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'oldest_debt') return b.ageing.days - a.ageing.days;
        return 0;
      });
  }, [enrichedCustomers, searchQuery, activeFilter, sortBy]);

  // --------------------------------------------------------------------------
  // 5. CALCULATE COUNTS FOR FILTER TABS
  // --------------------------------------------------------------------------
  const counts = useMemo(() => {
    const all = enrichedCustomers.length;
    const owing = enrichedCustomers.filter(c => c.balance > 0).length;
    const overdue = enrichedCustomers.filter(c => c.balance > 0 && c.ageing.days >= 14).length;
    const cleared = enrichedCustomers.filter(c => c.balance <= 0).length;
    return { all, owing, overdue, cleared };
  }, [enrichedCustomers]);

  // --------------------------------------------------------------------------
  // 6. ACTION BUTTON HANDLERS ON CARDS
  // --------------------------------------------------------------------------
  const handleOpenCredit = (customerId) => {
    setSelectedCustomerId(customerId);
    setFastEntryDefaultType('credit');
    setActiveModal('fastEntry');
  };

  const handleOpenPayment = (customerId) => {
    setSelectedCustomerId(customerId);
    setFastEntryDefaultType('payment');
    setActiveModal('fastEntry');
  };

  const handleOpenReminder = (customerId) => {
    setSelectedCustomerId(customerId);
    setActiveModal('reminder');
  };

  const handleOpenDetail = (customerId) => {
    setSelectedCustomerId(customerId);
    setActiveModal('customerDetail');
  };

  const handleOpenPortal = (customerId) => {
    setSelectedCustomerId(customerId);
    setActiveModal('portal');
  };

  // --------------------------------------------------------------------------
  // 7. JSX RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-4">
      
      {/* SEARCH AND SORT BAR */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer by name, phone or tag..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs p-1"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden md:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="debt_desc">Highest Debt First</option>
            <option value="oldest_debt">Longest Overdue First</option>
            <option value="name">Customer Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        
        {/* Tab 1: Owing You */}
        <button
          onClick={() => setActiveFilter('owing')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeFilter === 'owing'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-950/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700/70 border border-slate-700'
          }`}
        >
          <span>Owing You</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
            {counts.owing}
          </span>
        </button>

        {/* Tab 2: Overdue (>14d) */}
        <button
          onClick={() => setActiveFilter('overdue')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeFilter === 'overdue'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700/70 border border-slate-700'
          }`}
        >
          <span>Overdue (&gt;14d)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
            {counts.overdue}
          </span>
        </button>

        {/* Tab 3: All Customers */}
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeFilter === 'all'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700/70 border border-slate-700'
          }`}
        >
          <span>All Customers</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
            {counts.all}
          </span>
        </button>

        {/* Tab 4: Cleared / ₦0 */}
        <button
          onClick={() => setActiveFilter('cleared')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeFilter === 'cleared'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-950/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700/70 border border-slate-700'
          }`}
        >
          <span>Cleared / ₦0</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
            {counts.cleared}
          </span>
        </button>
      </div>

      {/* CUSTOMER CARDS LIST */}
      <div className="space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl border border-slate-800">
            <i className="fa-solid fa-users-slash text-4xl text-slate-600 mb-3"></i>
            <div className="text-sm font-semibold text-slate-300">No customers found</div>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Try adjusting your search terms or filter selection.
            </p>
          </div>
        ) : (
          filteredCustomers.map(customer => {
            const isOwing = customer.balance > 0;
            const isOverdue = isOwing && customer.ageing.days >= 14;

            return (
              <div
                key={customer.id}
                className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-slate-700/80 transition-all hover:shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left: Customer Info (Clicking opens their full ledger) */}
                  <div
                    onClick={() => handleOpenDetail(customer.id)}
                    className="flex items-start gap-3.5 cursor-pointer group flex-1"
                  >
                    {/* Initials Avatar */}
                    <div
                      className={`w-12 h-12 rounded-2xl ${customer.avatarBg || 'bg-emerald-600'} flex items-center justify-center text-white font-bold text-base shadow-md shrink-0`}
                    >
                      {customer.name
                        .split(' ')
                        .map(n => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition-colors truncate">
                          {customer.name}
                        </h3>
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
                          <span className="flex items-center gap-1 font-mono">
                            <i className="fa-solid fa-phone text-[10px]"></i>
                            {customer.phone}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 truncate hidden md:inline">
                          {customer.notes}
                        </span>
                      </div>

                      {/* Reliability score pill */}
                      {customer.reliability && (
                        <div className="flex items-center gap-2 text-[11px] pt-0.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              customer.reliability.score >= 80
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : customer.reliability.score >= 60
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {customer.reliability.label}
                          </span>
                          <span className="text-slate-500 text-[10px]">
                            Avg pay: {customer.reliability.avgDays} days
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Balance Owed and Overdue Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                        {isOwing ? 'Balance Owed' : 'Account Status'}
                      </div>
                      <div
                        className={`font-heading font-extrabold text-xl sm:text-2xl tracking-tight ${
                          isOwing ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        ₦{Math.abs(customer.balance).toLocaleString()}
                      </div>
                    </div>

                    {isOwing && (
                      <div className="mt-0.5">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            isOverdue
                              ? 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                              : 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                          }`}
                        >
                          <i className="fa-solid fa-clock text-[9px] mr-1"></i>
                          {customer.ageing.days}d ago
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTONS ON EACH CARD */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Fast Credit Button */}
                    <button
                      onClick={() => handleOpenCredit(customer.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i>
                      <span>Credit</span>
                    </button>

                    {/* Fast Payment Button */}
                    <button
                      onClick={() => handleOpenPayment(customer.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <i className="fa-solid fa-hand-holding-dollar text-[10px]"></i>
                      <span>Payment</span>
                    </button>

                    {/* WhatsApp Reminder (Shown only if owing) */}
                    {isOwing && (
                      <button
                        onClick={() => handleOpenReminder(customer.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <i className="fa-brands fa-whatsapp text-emerald-400"></i>
                        <span className="hidden xs:inline">Remind</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Customer Portal Link preview */}
                    <button
                      onClick={() => handleOpenPortal(customer.id)}
                      title="Preview repayment link that customer opens"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <i className="fa-solid fa-link text-blue-400 text-[11px]"></i>
                      <span className="hidden sm:inline">Pay Link</span>
                    </button>

                    {/* View Full Ledger Button */}
                    <button
                      onClick={() => handleOpenDetail(customer.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Ledger</span>
                      <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
