import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// HEADER COMPONENT
// Purpose: The top persistent navigation bar of the application.
// Contains: Brand identity, Role switcher (Owner vs Staff), Offline simulator,
// PIN lock button, and Audit log button.
// ============================================================================
export const Header = () => {
  // --------------------------------------------------------------------------
  // 1. DATA AND FUNCTIONS FROM CONTEXT
  // --------------------------------------------------------------------------
  const {
    shop,
    currentRole,
    setCurrentRole,
    currentUser,
    isAuthenticated,
    users,
    login,
    openAuth,
    logout,
    isOffline,
    toggleOffline,
    syncStatus,
    setIsLocked,
    setActiveModal,
    auditLogs,
    resetAllDataToDemo
  } = useShop();

  // --------------------------------------------------------------------------
  // 2. LOCAL STATE (Dropdowns)
  // --------------------------------------------------------------------------
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // --------------------------------------------------------------------------
  // 3. JSX RENDER
  // --------------------------------------------------------------------------
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

        {/* BRAND & SHOP IDENTITY */}
        <div className="flex items-center gap-3">
          {/* Logo icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 font-bold text-xl">
            <i className="fa-solid fa-book-bookmark"></i>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg text-white tracking-tight">ShopTab</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Credit Book
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-[320px]">
              {isAuthenticated ? shop.name : 'Digital Ledger for Traders'}
            </p>
          </div>
        </div>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* 1. Offline / Online Toggle Button */}
          <button
            onClick={toggleOffline}
            title={isOffline ? 'Offline mode: Click to reconnect' : 'Online mode: Click to simulate offline'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isOffline
                ? 'bg-amber-950/40 text-amber-300 border-amber-600/40 hover:bg-amber-900/40'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/40'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOffline ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`}
            ></span>
            <span className="hidden md:inline">
              {isOffline ? 'Offline' : syncStatus === 'syncing' ? 'Syncing...' : 'Online (Synced)'}
            </span>
          </button>

          {/* ================================================================ */}
          {/* WHEN NOT AUTHENTICATED: SHOW SIGN IN & SIGN UP BUTTONS */}
          {/* ================================================================ */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* SIGN IN BUTTON */}
              <button
                type="button"
                id="header-sign-in-button"
                onClick={() => openAuth('signin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm active:scale-95"
              >
                <i className="fa-solid fa-right-to-bracket text-emerald-400 text-xs"></i>
                <span>Sign In</span>
              </button>

              {/* SIGN UP BUTTON */}
              <button
                type="button"
                id="header-sign-up-button"
                onClick={() => openAuth('signup')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-950/40 active:scale-95"
              >
                <i className="fa-solid fa-user-plus text-[11px]"></i>
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            /* ================================================================ */
            /* WHEN AUTHENTICATED: SHOW USER PROFILE, AUDIT, PIN LOCK & LOGOUT */
            /* ================================================================ */
            <>
              {/* 2. Role Switcher Pill: Owner vs Staff */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition-colors"
                >
                  <i
                    className={`fa-solid ${
                      currentRole === 'owner' ? 'fa-crown text-amber-400' : 'fa-user-tag text-teal-400'
                    }`}
                  ></i>
                  <span className="hidden sm:inline font-medium">{currentUser.name}</span>
                  <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
                </button>

                {/* Dropdown menu */}
                {showRoleDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl glass-dropdown p-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setShowRoleDropdown(false)}
                  >
                    <div className="px-2.5 py-2 border-b border-slate-700/60 mb-1">
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Logged In As
                      </div>
                      <div className="text-xs text-emerald-400 font-bold truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {currentUser.badge} • {currentUser.shopName || shop.name}
                      </div>
                    </div>

                    <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Switch Account
                    </div>

                    {/* Dynamic list of saved accounts */}
                    {users &&
                      users.map((u) => {
                        const isCurrent = currentUser.name === u.name;
                        return (
                          <button
                            key={u.id || u.name}
                            onClick={() => {
                              login({
                                identifier: u.identifier || u.phone || u.name,
                                name: u.name,
                                role: u.role
                              });
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between mb-0.5 transition-colors ${
                              isCurrent
                                ? 'bg-emerald-600 text-white font-medium'
                                : 'text-slate-300 hover:bg-slate-700/50'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <i
                                className={`fa-solid ${
                                  u.role === 'owner' ? 'fa-crown text-amber-300' : 'fa-user-tag text-teal-300'
                                } text-[11px] shrink-0`}
                              ></i>
                              <div className="truncate">
                                <div className="truncate font-medium">{u.name}</div>
                                <div className="text-[10px] opacity-75 truncate">
                                  {u.role === 'owner' ? 'Owner' : 'Staff'}
                                </div>
                              </div>
                            </div>
                            {isCurrent && <i className="fa-solid fa-check text-xs shrink-0"></i>}
                          </button>
                        );
                      })}

                    {/* Add / Sign In as another person */}
                    <button
                      onClick={() => openAuth('signin')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-700/50 flex items-center gap-2 mt-1"
                    >
                      <i className="fa-solid fa-user-plus text-emerald-400 w-4"></i>
                      <span>Log in as new person...</span>
                    </button>

                    {/* Sign Out Option */}
                    <div className="my-1 border-t border-slate-700/60"></div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket text-rose-400 w-4"></i>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Activity Audit Log Button */}
              <button
                onClick={() => setActiveModal('audit')}
                title="Activity Audit Log"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs flex items-center gap-1.5 relative transition-colors"
              >
                <i className="fa-solid fa-shield-halved text-emerald-400"></i>
                <span className="hidden lg:inline text-xs">Audit</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-[10px] font-mono text-emerald-300">
                  {auditLogs.length}
                </span>
              </button>

              {/* 4. PIN Lock Screen Button */}
              <button
                onClick={() => setIsLocked(true)}
                title="Lock Ledger Screen (Default PIN: 1234)"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition-colors"
              >
                <i className="fa-solid fa-lock text-amber-400"></i>
              </button>

              {/* 5. Quick Extra Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition-colors"
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>

                {showMenu && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl glass-dropdown p-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setShowMenu(false)}
                  >
                    <button
                      onClick={() => setActiveModal('aging')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-700/50 flex items-center gap-2"
                    >
                      <i className="fa-solid fa-chart-pie text-blue-400 w-4"></i>
                      <span>Ageing Report</span>
                    </button>
                    <button
                      onClick={() => setActiveModal('newCustomer')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-700/50 flex items-center gap-2"
                    >
                      <i className="fa-solid fa-user-plus text-emerald-400 w-4"></i>
                      <span>Add Customer</span>
                    </button>
                    <div className="my-1 border-t border-slate-700/60"></div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-300 hover:bg-amber-950/40 flex items-center gap-2"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket text-amber-400 w-4"></i>
                      <span>Sign Out</span>
                    </button>
                    <button
                      onClick={resetAllDataToDemo}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 mt-1"
                    >
                      <i className="fa-solid fa-rotate-left text-rose-400 w-4"></i>
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </header>
  );
};
