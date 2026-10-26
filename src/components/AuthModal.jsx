import React from 'react';
import { useShop } from '../context/ShopContext';
import { AuthCard } from './AuthCard';

// ============================================================================
// AUTH MODAL COMPONENT
// Purpose: Popup modal containing the AuthCard for signing in or creating an account.
// Triggered by clicking "Sign In" or "Sign Up" from the header or other actions.
// ============================================================================
export const AuthModal = () => {
  const { setActiveModal } = useShop();

  const handleClose = () => {
    setActiveModal(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center text-xs shadow-lg transition-transform active:scale-95"
          title="Close modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* REUSABLE AUTH CARD */}
        <AuthCard onAuthSuccess={handleClose} />
      </div>
    </div>
  );
};
