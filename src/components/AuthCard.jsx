import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// AUTH CARD COMPONENT
// Purpose: Authentication with Email and Password only.
// Users sign in or register with their own individual credentials.
// ============================================================================
export const AuthCard = ({ initialTab = 'signin', onAuthSuccess }) => {
  const { login, register, authTab, setAuthTab } = useShop();

  // Active tab: 'signin' or 'signup'
  const activeTab = authTab || initialTab;

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpShopName, setSignUpShopName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('owner');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // --------------------------------------------------------------------------
  // 1. SIGN IN SUBMIT (Email & Password)
  // --------------------------------------------------------------------------
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signInEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!signInPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login({
        email: signInEmail.trim(),
        password: signInPassword
      });

      setIsLoading(false);

      if (result.success) {
        if (onAuthSuccess) onAuthSuccess();
      } else {
        setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
      }
    }, 400);
  };

  // --------------------------------------------------------------------------
  // 2. SIGN UP SUBMIT (Email & Password)
  // --------------------------------------------------------------------------
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signUpName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signUpShopName.trim()) {
      setErrorMessage('Please enter your shop or business name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = register({
        name: signUpName.trim(),
        shopName: signUpShopName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        role: signUpRole
      });

      setIsLoading(false);

      if (result.success) {
        setSuccessMessage(`Account created for ${signUpName}! Welcome to ShopTab.`);
        if (onAuthSuccess) onAuthSuccess();
      } else {
        setErrorMessage(result.error || 'Registration failed. Please try again.');
      }
    }, 450);
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* TAB HEADER: SIGN IN vs SIGN UP */}
      <div className="grid grid-cols-2 p-1.5 bg-slate-900/90 border-b border-slate-800/80">
        <button
          type="button"
          onClick={() => {
            setAuthTab('signin');
            setErrorMessage('');
            setSuccessMessage('');
          }}
          className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'signin'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <i className="fa-solid fa-right-to-bracket text-xs"></i>
          <span>Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthTab('signup');
            setErrorMessage('');
            setSuccessMessage('');
          }}
          className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'signup'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <i className="fa-solid fa-user-plus text-xs"></i>
          <span>Sign Up</span>
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        
        {/* HEADER TITLE */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-emerald-950/50 font-bold text-xl mb-3">
            <i className={`fa-solid ${activeTab === 'signin' ? 'fa-lock' : 'fa-store'}`}></i>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
            {activeTab === 'signin' ? 'Sign In to Your Account' : 'Create Your Shop Account'}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {activeTab === 'signin'
              ? 'Enter your email and password to access your credit ledger.'
              : 'Sign up with your personal details to track credits & customers.'}
          </p>
        </div>

        {/* ERROR / SUCCESS ALERTS */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
            <i className="fa-solid fa-circle-exclamation text-rose-400 shrink-0 text-sm"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 text-xs flex items-center gap-2.5">
            <i className="fa-solid fa-circle-check text-emerald-400 shrink-0 text-sm"></i>
            <span>{successMessage}</span>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 1: SIGN IN FORM (Email & Password Only) */}
        {/* ================================================================== */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 text-xs"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-900"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-950/40 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <span>Sign In</span>
                </>
              )}
            </button>

            <div className="text-center pt-2 border-t border-slate-800/80">
              <p className="text-xs text-slate-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signup');
                    setErrorMessage('');
                  }}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Sign Up here
                </button>
              </p>

              {/* Demo accounts hint */}
              <div className="mt-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 text-left">
                <span className="font-semibold text-slate-300">💡 Demo Credentials:</span>
                <div className="mt-0.5 text-[10px] text-slate-400 flex flex-col gap-0.5 font-mono">
                  <span>Owner: mamachidi@shoptab.ng / password123</span>
                  <span>Staff: emeka@shoptab.ng / password123</span>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ================================================================== */}
        {/* TAB 2: SIGN UP FORM (Register with Email & Password) */}
        {/* ================================================================== */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                  <i className="fa-solid fa-user"></i>
                </div>
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Joy Adeleke"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Shop / Business Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                  <i className="fa-solid fa-shop"></i>
                </div>
                <input
                  type="text"
                  value={signUpShopName}
                  onChange={(e) => setSignUpShopName(e.target.value)}
                  placeholder="e.g. Joy Supermarket & Provisions"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="e.g. joy@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <input
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    minLength={6}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Role
                </label>
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="owner">Shop Owner (Full Admin)</option>
                  <option value="staff">Store Attendant (Staff)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 mt-2 rounded-xl font-heading font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-950/40 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i>
                  <span>Create Account & Start</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signin');
                    setErrorMessage('');
                  }}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Sign In instead
                </button>
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
