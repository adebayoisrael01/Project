import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

// ============================================================================
// PIN LOCK MODAL
// Purpose: Protects the shop's credit book if the phone is shared or lost.
// Displays a 4-digit PIN screen with a numerical keypad (Default PIN: 1234).
// ============================================================================
export const PinLockModal = () => {
  // --------------------------------------------------------------------------
  // 1. DATA AND FUNCTIONS FROM CONTEXT
  // --------------------------------------------------------------------------
  const { shop, verifyPin, setIsLocked } = useShop();

  // --------------------------------------------------------------------------
  // 2. LOCAL STATE
  // --------------------------------------------------------------------------
  // Current digits typed by the user (e.g. "1", "12", "123")
  const [pinInput, setPinInput] = useState('');

  // Shows red shake animation if user enters wrong PIN
  const [errorMsg, setErrorMsg] = useState(false);

  // --------------------------------------------------------------------------
  // 3. KEYPAD HANDLERS
  // --------------------------------------------------------------------------
  // When a number button (0-9) is tapped
  const handleKeyPress = (digitString) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + digitString;
      setPinInput(nextPin);

      // When the user enters the 4th digit, automatically check it
      if (nextPin.length === 4) {
        const isCorrect = verifyPin(nextPin);

        if (isCorrect) {
          // Unlock the screen
          setIsLocked(false);
          setPinInput('');
          setErrorMsg(false);
        } else {
          // Show error and reset digits after a brief pause
          setErrorMsg(true);
          setTimeout(() => {
            setPinInput('');
            setErrorMsg(false);
          }, 800);
        }
      }
    }
  };

  // Backspace / Delete last digit
  const handleDelete = () => {
    setPinInput(previous => previous.slice(0, -1));
  };

  // --------------------------------------------------------------------------
  // 4. JSX RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-xs text-center space-y-6">
        
        {/* LOCK ICON */}
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 text-2xl mx-auto shadow-2xl shadow-amber-950/20">
          <i className="fa-solid fa-lock"></i>
        </div>

        {/* SHOP NAME & INSTRUCTION */}
        <div>
          <h2 className="font-heading font-extrabold text-xl text-white">
            {shop.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter 4-digit PIN to access credit ledger
          </p>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            Default Demo PIN: {shop.pin}
          </div>
        </div>

        {/* 4 PIN DOTS (Filled or Empty) */}
        <div className="flex justify-center gap-4 py-2">
          {[0, 1, 2, 3].map(dotIndex => (
            <div
              key={dotIndex}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                errorMsg
                  ? 'border-rose-500 bg-rose-500 animate-shake'
                  : pinInput.length > dotIndex
                  ? 'border-emerald-500 bg-emerald-500 scale-110 shadow-lg shadow-emerald-500/50'
                  : 'border-slate-700 bg-slate-900'
              }`}
            ></div>
          ))}
        </div>

        {/* ERROR MESSAGE (If wrong PIN) */}
        {errorMsg && (
          <p className="text-xs text-rose-400 font-semibold animate-pulse">
            Incorrect PIN. Please try again!
          </p>
        )}

        {/* NUMERICAL KEYPAD (1 through 9, plus 0 and Delete) */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(String(num))}
              className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 active:border-emerald-500 text-xl font-heading font-bold text-white shadow-md active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}

          {/* Empty spacer */}
          <div className="h-14"></div>

          {/* 0 Key */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 active:border-emerald-500 text-xl font-heading font-bold text-white shadow-md active:scale-95 transition-all"
          >
            0
          </button>

          {/* Backspace Delete Key */}
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-lg active:scale-95 transition-all"
          >
            <i className="fa-solid fa-delete-left"></i>
          </button>
        </div>

      </div>
    </div>
  );
};
