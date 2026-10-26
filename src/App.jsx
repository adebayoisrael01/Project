import React from 'react';

// ============================================================================
// 1. IMPORT STATE CONTEXT & COMPONENTS
// ============================================================================
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { CustomerList } from './components/CustomerList';
import { AuthLanding } from './components/AuthLanding';

// All Popup Modals
import { AuthModal } from './components/AuthModal';
import { FastEntryModal } from './components/FastEntryModal';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { ReminderModal } from './components/ReminderModal';
import { CustomerPortalModal } from './components/CustomerPortalModal';
import { AgingReportModal } from './components/AgingReportModal';
import { StatementPrintModal } from './components/StatementPrintModal';
import { NewCustomerModal } from './components/NewCustomerModal';
import { PinLockModal } from './components/PinLockModal';
import { AuditLogModal } from './components/AuditLogModal';

// ============================================================================
// 2. INNER APP COMPONENT
// This component renders the UI and uses data from our ShopProvider.
// ============================================================================
const ShopTabApp = () => {
  // Grab modal states, authentication, and actions from our central store
  const {
    isAuthenticated,
    isLocked,
    activeModal,
    setActiveModal,
    setFastEntryDefaultType,
    setSelectedCustomerId
  } = useShop();

  // Floating speed action button handler on small screens (e.g. mobile phones)
  const handleFloatingAction = () => {
    setSelectedCustomerId(null);
    setFastEntryDefaultType('credit');
    setActiveModal('fastEntry');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-16">
      
      {/* 1. TOP HEADER & NAVBAR (Shows Sign In & Sign Up buttons or User Profile) */}
      <Header />

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {!isAuthenticated ? (
          /* Gated Auth Landing: Requires login or sign-up before accessing ledger */
          <AuthLanding />
        ) : (
          /* Authenticated Dashboard: Full Credit Ledger Workspace */
          <>
            {/* Market & Shop Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
              <div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  Credit Ledger Book
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  One job done well: track who owes the shop, remind them politely, and get paid.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1.5 font-medium">
                  <i className="fa-solid fa-location-dot text-emerald-400"></i>
                  <span>Tejuosho Market, Lagos</span>
                </span>
              </div>
            </div>

            {/* Financial Metrics Cards & Fast Action Buttons */}
            <DashboardStats />

            {/* Search, Filter Tabs & Debtor Customer Cards */}
            <CustomerList />
          </>
        )}
      </main>

      {/* 3. FLOATING ACTION BUTTON (Visible on mobile screens only when logged in) */}
      {isAuthenticated && (
        <div className="fixed bottom-5 right-5 z-40 sm:hidden">
          <button
            onClick={handleFloatingAction}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-2xl shadow-rose-950/80 flex items-center justify-center text-xl active:scale-95 transition-transform"
            title="Give Credit (<10s)"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      )}

      {/* 4. FOOTER */}
      <footer className="mt-auto border-t border-slate-900/80 pt-6 pb-4 text-center text-xs text-slate-500 max-w-6xl mx-auto px-4 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-slate-400">ShopTab</span>
            <span>• Built for Nigerian Shopkeepers & Market Stalls</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-shield-halved text-emerald-400 text-[10px]"></i>
              <span>NDPR / NDPA Data Protected</span>
            </span>
            <span>•</span>
            <span>Append-only Audit Safe</span>
          </div>
        </div>
      </footer>

      {/* 5. MODAL ROUTER (Shows whichever popup is currently open) */}
      {activeModal === 'auth' && <AuthModal />}
      {isLocked && <PinLockModal />}
      {activeModal === 'fastEntry' && <FastEntryModal />}
      {activeModal === 'customerDetail' && <CustomerDetailModal />}
      {activeModal === 'reminder' && <ReminderModal />}
      {activeModal === 'portal' && <CustomerPortalModal />}
      {activeModal === 'aging' && <AgingReportModal />}
      {activeModal === 'statement' && <StatementPrintModal />}
      {activeModal === 'newCustomer' && <NewCustomerModal />}
      {activeModal === 'audit' && <AuditLogModal />}
    </div>
  );
};

// ============================================================================
// 3. MAIN EXPORT WRAPPED IN PROVIDER
// Every beginner React app needs one root provider wrapping the app.
// ============================================================================
export default function App() {
  return (
    <ShopProvider>
      <ShopTabApp />
    </ShopProvider>
  );
}