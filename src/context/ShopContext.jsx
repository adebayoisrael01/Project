import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialShop,
  initialCustomers,
  initialEntries,
  initialAuditLogs,
  reminderTemplates
} from '../data/initialData';

// ============================================================================
// 1. CREATE THE CONTEXT
// In React, Context is like a global storage box. Any component in our app
// can reach into this box to get or change data, without passing props manually.
// ============================================================================
const ShopContext = createContext(null);

// Storage keys for saving our data in the user's browser (localStorage)
const STORAGE_KEY_SHOP = 'shoptab_shop_data';
const STORAGE_KEY_CUSTOMERS = 'shoptab_customers_data';
const STORAGE_KEY_ENTRIES = 'shoptab_entries_data';
const STORAGE_KEY_LOGS = 'shoptab_logs_data';
const STORAGE_KEY_ROLE = 'shoptab_current_role';
const STORAGE_KEY_AUTH = 'shoptab_auth_state';
const STORAGE_KEY_AUTH_USER = 'shoptab_auth_user';
const STORAGE_KEY_USERS = 'shoptab_registered_users';

const initialUsersList = [
  {
    id: 'user_mamachidi',
    name: 'Mama Chidi',
    email: 'mamachidi@shoptab.ng',
    password: 'password123',
    role: 'owner',
    shopName: 'Mama Chidi Provision Store'
  },
  {
    id: 'user_emeka',
    name: 'Emeka',
    email: 'emeka@shoptab.ng',
    password: 'password123',
    role: 'staff',
    shopName: 'Mama Chidi Provision Store'
  }
];

// ============================================================================
// 2. THE PROVIDER COMPONENT
// This component wraps around our entire app and provides all the data & functions.
// ============================================================================
export const ShopProvider = ({ children }) => {
  // --------------------------------------------------------------------------
  // STATE: The data that can change over time
  // If the browser already saved data before, we load it. Otherwise, use initial data.
  // --------------------------------------------------------------------------
  const [shop, setShop] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SHOP);
    return saved ? JSON.parse(saved) : initialShop;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ENTRIES);
    return saved ? JSON.parse(saved) : initialEntries;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOGS);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Current active role: 'owner' (Mama Chidi) or 'staff' (Emeka - Attendant)
  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ROLE);
    return saved || 'owner';
  });

  // Authentication State: requires sign in before accessing full ledger
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    return saved === 'true';
  });

  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH_USER);
    return saved ? JSON.parse(saved) : null;
  });

  // Registered user accounts database
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    return saved ? JSON.parse(saved) : initialUsersList;
  });

  // Current active tab for auth: 'signin' or 'signup'
  const [authTab, setAuthTab] = useState('signin');

  // Security screen lock state (True = locked with PIN, False = unlocked)
  const [isLocked, setIsLocked] = useState(false);

  // Network offline mode simulation (True = offline, False = online)
  const [isOffline, setIsOffline] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');

  // Currently open popup modal (null = no modal open)
  const [activeModal, setActiveModal] = useState(null);

  // The ID of the customer currently clicked/selected
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Default entry type when fast entry opens: 'credit' or 'payment'
  const [fastEntryDefaultType, setFastEntryDefaultType] = useState('credit');

  // --------------------------------------------------------------------------
  // AUTO-SAVE: Save to localStorage whenever data changes
  // useEffect runs automatically whenever the variable in the [brackets] changes.
  // --------------------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SHOP, JSON.stringify(shop));
  }, [shop]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AUTH, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(authUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH_USER);
    }
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  // --------------------------------------------------------------------------
  // HELPER: Toggle offline mode
  // --------------------------------------------------------------------------
  const toggleOffline = () => {
    const nextOfflineState = !isOffline;
    setIsOffline(nextOfflineState);

    if (nextOfflineState) {
      setSyncStatus('offline');
    } else {
      setSyncStatus('syncing');
      setTimeout(() => setSyncStatus('synced'), 800);
    }
  };

  // --------------------------------------------------------------------------
  // HELPER: Get current active user info (Owner or Staff)
  // --------------------------------------------------------------------------
  const currentUser = useMemo(() => {
    if (authUser) {
      const isOwner = authUser.role === 'owner';
      return {
        name: authUser.name || (isOwner ? (shop.ownerName || 'Mama Chidi') : (shop.staffName || 'Emeka (Attendant)')),
        role: authUser.role || currentRole,
        badge: isOwner ? 'Shop Owner' : 'Attendant'
      };
    }
    if (currentRole === 'owner') {
      return { name: shop.ownerName || 'Mama Chidi', role: 'owner', badge: 'Shop Owner' };
    }
    return { name: shop.staffName || 'Emeka (Attendant)', role: 'staff', badge: 'Attendant' };
  }, [currentRole, shop, authUser]);

  // --------------------------------------------------------------------------
  // HELPER: Add an event to the activity audit log
  // --------------------------------------------------------------------------
  const addAuditLog = (actionDescription) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today';

    const newLogItem = {
      id: 'log_' + Date.now(),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: actionDescription,
      time: timeString
    };

    // Put new log at the very top of the list
    setAuditLogs(previousLogs => [newLogItem, ...previousLogs]);
  };

  // --------------------------------------------------------------------------
  // CALCULATION 1: Get single customer balance
  // Balance = Total Goods Taken - Total Payments Made - Any Discounts
  // --------------------------------------------------------------------------
  const getCustomerBalance = (customerId) => {
    // 1. Find all active entries for this customer (skip reversed entries)
    const customerEntries = entries.filter(entry => {
      return entry.customerId === customerId && entry.isReversed !== true;
    });

    // 2. Add up credits, subtract payments
    let currentBalance = 0;
    for (let i = 0; i < customerEntries.length; i++) {
      const entry = customerEntries[i];
      if (entry.type === 'credit') {
        currentBalance = currentBalance + entry.amount;
      } else if (entry.type === 'payment' || entry.type === 'adjustment') {
        currentBalance = currentBalance - entry.amount;
      }
    }

    return currentBalance;
  };

  // --------------------------------------------------------------------------
  // CALCULATION 2: Get customer ledger with running balance
  // Shows a step-by-step bank-style timeline of transactions
  // --------------------------------------------------------------------------
  const getCustomerLedger = (customerId) => {
    // 1. Get entries and sort oldest to newest to compute running balance correctly
    const customerEntries = entries
      .filter(entry => entry.customerId === customerId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    let runningTotal = 0;
    const ledgerWithRunningBalance = customerEntries.map(entry => {
      if (!entry.isReversed) {
        if (entry.type === 'credit') {
          runningTotal = runningTotal + entry.amount;
        } else if (entry.type === 'payment' || entry.type === 'adjustment') {
          runningTotal = runningTotal - entry.amount;
        }
      }

      return {
        ...entry,
        runningBalance: runningTotal
      };
    });

    // Reverse so the most recent transaction is displayed at the top
    return ledgerWithRunningBalance.reverse();
  };

  // --------------------------------------------------------------------------
  // CALCULATION 3: Debt Ageing (How old is the debt?)
  // --------------------------------------------------------------------------
  const getCustomerAgeing = (customerId) => {
    const customerCredits = entries.filter(entry => {
      return entry.customerId === customerId && entry.type === 'credit' && !entry.isReversed;
    });

    const balance = getCustomerBalance(customerId);
    if (balance <= 0 || customerCredits.length === 0) {
      return { days: 0, category: 'cleared' };
    }

    // Sort credits so oldest is first
    customerCredits.sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));
    const oldestDate = new Date(customerCredits[0].entryDate);
    const today = new Date();

    // Calculate number of days difference
    const diffTime = Math.abs(today - oldestDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let category = '0-7';
    if (diffDays > 60) category = '60+';
    else if (diffDays > 30) category = '31-60';
    else if (diffDays > 7) category = '8-30';

    return { days: diffDays, category: category };
  };

  // --------------------------------------------------------------------------
  // CALCULATION 4: Shop Overall Dashboard Statistics
  // --------------------------------------------------------------------------
  const shopStats = useMemo(() => {
    let totalOwed = 0;
    let debtorsCount = 0;
    let overdueAmount = 0;
    let overdueCount = 0;

    let tier0_7 = 0;
    let tier8_30 = 0;
    let tier31_60 = 0;
    let tier60Plus = 0;

    const customerBalances = customers.map(customer => {
      const balance = getCustomerBalance(customer.id);
      const ageing = getCustomerAgeing(customer.id);

      if (balance > 0) {
        totalOwed = totalOwed + balance;
        debtorsCount = debtorsCount + 1;

        if (ageing.days >= 14) {
          overdueAmount = overdueAmount + balance;
          overdueCount = overdueCount + 1;
        }

        if (ageing.category === '0-7') tier0_7 += balance;
        else if (ageing.category === '8-30') tier8_30 += balance;
        else if (ageing.category === '31-60') tier31_60 += balance;
        else if (ageing.category === '60+') tier60Plus += balance;
      }

      return {
        ...customer,
        balance: balance,
        ageing: ageing
      };
    });

    // Calculate payments collected in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const collectedThisWeek = entries
      .filter(e => e.type === 'payment' && !e.isReversed && new Date(e.createdAt) >= sevenDaysAgo)
      .reduce((sum, e) => sum + e.amount, 0);

    // Top 5 highest debtors
    const topDebtors = [...customerBalances]
      .filter(c => c.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5);

    return {
      totalOwed,
      debtorsCount,
      overdueAmount,
      overdueCount,
      collectedThisWeek,
      customerBalances,
      topDebtors,
      agingBreakdown: {
        tier0_7,
        tier8_30,
        tier31_60,
        tier60Plus
      }
    };
  }, [customers, entries]);

  // --------------------------------------------------------------------------
  // ACTION 1: Record Goods Taken on Credit
  // --------------------------------------------------------------------------
  const addCredit = ({ customerId, amount, note, dueDate, photoUrl }) => {
    const numericAmount = Number(amount);
    if (!customerId || numericAmount <= 0) return null;

    const customer = customers.find(c => c.id === customerId);
    const todayString = new Date().toISOString().split('T')[0];

    const newEntry = {
      id: 'ent_' + Date.now(),
      customerId: customerId,
      type: 'credit',
      amount: numericAmount,
      note: note || 'Goods taken on credit',
      photoUrl: photoUrl || null,
      method: 'goods',
      entryDate: todayString,
      dueDate: dueDate || null,
      recordedBy: { name: currentUser.name, role: currentUser.role },
      reversesEntryId: null,
      isReversed: false,
      isDisputed: false,
      createdAt: new Date().toISOString()
    };

    setEntries(previousEntries => [newEntry, ...previousEntries]);
    addAuditLog(`Gave ₦${numericAmount.toLocaleString()} credit to ${customer ? customer.name : 'customer'} ("${newEntry.note}")`);
    return newEntry;
  };

  // --------------------------------------------------------------------------
  // ACTION 2: Record Payment Received (Cash, Bank Transfer, POS)
  // --------------------------------------------------------------------------
  const addPayment = ({ customerId, amount, method = 'cash', note }) => {
    const numericAmount = Number(amount);
    if (!customerId || numericAmount <= 0) return null;

    const customer = customers.find(c => c.id === customerId);
    const todayString = new Date().toISOString().split('T')[0];

    const newEntry = {
      id: 'ent_' + Date.now(),
      customerId: customerId,
      type: 'payment',
      amount: numericAmount,
      note: note || `Payment received via ${method.toUpperCase()}`,
      photoUrl: null,
      method: method,
      entryDate: todayString,
      dueDate: null,
      recordedBy: { name: currentUser.name, role: currentUser.role },
      reversesEntryId: null,
      isReversed: false,
      isDisputed: false,
      createdAt: new Date().toISOString()
    };

    setEntries(previousEntries => [newEntry, ...previousEntries]);
    addAuditLog(`Received payment of ₦${numericAmount.toLocaleString()} from ${customer ? customer.name : 'customer'} (${method})`);
    return newEntry;
  };

  // --------------------------------------------------------------------------
  // ACTION 3: Safe Non-Destructive Reversal (Correcting Mistakes)
  // --------------------------------------------------------------------------
  const reverseEntry = (entryId, reason) => {
    const targetEntry = entries.find(e => e.id === entryId);
    if (!targetEntry) return;

    const customer = customers.find(c => c.id === targetEntry.customerId);

    // 1. Mark the target entry as reversed
    setEntries(previous =>
      previous.map(entry => (entry.id === entryId ? { ...entry, isReversed: true } : entry))
    );

    // 2. Add an adjustment entry to reverse the amount cleanly
    const reversalType = targetEntry.type === 'credit' ? 'adjustment' : 'credit';
    const reversalEntry = {
      id: 'rev_' + Date.now(),
      customerId: targetEntry.customerId,
      type: reversalType,
      amount: targetEntry.amount,
      note: `Correction Reversal: ${reason || 'Mistake corrected'} (Reversing #${targetEntry.id.slice(-6)})`,
      photoUrl: null,
      method: 'adjustment',
      entryDate: new Date().toISOString().split('T')[0],
      dueDate: null,
      recordedBy: { name: currentUser.name, role: currentUser.role },
      reversesEntryId: targetEntry.id,
      isReversed: false,
      isDisputed: false,
      createdAt: new Date().toISOString()
    };

    setEntries(previous => [reversalEntry, ...previous]);
    addAuditLog(`Reversed entry #${targetEntry.id.slice(-6)} (₦${targetEntry.amount.toLocaleString()}) for ${customer?.name}: "${reason}"`);
  };

  // --------------------------------------------------------------------------
  // ACTION 4: Add New Customer
  // --------------------------------------------------------------------------
  const addCustomer = ({ name, phone, tags = [], creditLimit = 30000, notes = '' }) => {
    if (!name.trim()) return null;

    const colors = [
      'bg-emerald-600',
      'bg-blue-600',
      'bg-amber-600',
      'bg-purple-600',
      'bg-teal-600',
      'bg-rose-600'
    ];
    const avatarColor = colors[customers.length % colors.length];

    const newCustomer = {
      id: 'cust_' + Date.now(),
      name: name.trim(),
      phone: phone ? phone.trim() : null,
      tags: tags.length > 0 ? tags : ['New Customer'],
      creditLimit: Number(creditLimit) || 30000,
      notes: notes.trim(),
      avatarBg: avatarColor,
      createdAt: new Date().toISOString().split('T')[0],
      reliability: { score: 90, label: 'New Customer', avgDays: 7 }
    };

    setCustomers(previous => [newCustomer, ...previous]);
    addAuditLog(`Added customer: ${newCustomer.name} (${newCustomer.phone || 'No phone'})`);
    return newCustomer;
  };

  // --------------------------------------------------------------------------
  // ACTION 5: Dispute Management
  // --------------------------------------------------------------------------
  const disputeEntry = (entryId, reason) => {
    setEntries(previous =>
      previous.map(e => (e.id === entryId ? { ...e, isDisputed: true, disputeReason: reason } : e))
    );
    addAuditLog(`⚠️ Customer raised dispute on entry #${entryId.slice(-6)}: "${reason}"`);
  };

  const resolveDispute = (entryId) => {
    setEntries(previous =>
      previous.map(e => (e.id === entryId ? { ...e, isDisputed: false } : e))
    );
    addAuditLog(`Resolved dispute on entry #${entryId.slice(-6)}`);
  };

  // --------------------------------------------------------------------------
  // ACTION 6: Simulate Customer Online Link Payment (Paystack / Transfer)
  // --------------------------------------------------------------------------
  const simulateLinkPayment = (customerId, amount, method = 'card', ref) => {
    const numericAmount = Number(amount);
    const paymentRef = ref || 'PSTK_' + Math.floor(100000 + Math.random() * 900000);
    const customer = customers.find(c => c.id === customerId);

    const linkPaymentEntry = {
      id: 'ent_' + Date.now(),
      customerId: customerId,
      type: 'payment',
      amount: numericAmount,
      note: `Online Repayment via ${method.toUpperCase()} (Ref: ${paymentRef})`,
      photoUrl: null,
      method: 'link',
      entryDate: new Date().toISOString().split('T')[0],
      dueDate: null,
      recordedBy: { name: 'ShopTab Pay Rail', role: 'system' },
      reversesEntryId: null,
      isReversed: false,
      isDisputed: false,
      createdAt: new Date().toISOString()
    };

    setEntries(previous => [linkPaymentEntry, ...previous]);
    addAuditLog(`⚡ Auto-settled: ${customer?.name} paid ₦${numericAmount.toLocaleString()} via link (${paymentRef})`);
    return linkPaymentEntry;
  };

  // --------------------------------------------------------------------------
  // HELPER: PIN Verification
  // --------------------------------------------------------------------------
  const verifyPin = (pinInput) => {
    return pinInput === shop.pin;
  };

  // --------------------------------------------------------------------------
  // AUTH ACTION 1: Sign In with Email and Password
  // --------------------------------------------------------------------------
  const login = ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!cleanPassword) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Match by email
    const matchedUser = users.find(
      u => u.email && u.email.toLowerCase() === cleanEmail
    );

    if (!matchedUser) {
      return {
        success: false,
        error: 'No account found with this email. Please check your spelling or click "Sign Up" to create an account.'
      };
    }

    if (matchedUser.password && matchedUser.password !== cleanPassword) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your password and try again.'
      };
    }

    const userToLogin = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role || 'owner',
      shopName: matchedUser.shopName || shop.name,
      signedInAt: new Date().toISOString()
    };

    setCurrentRole(userToLogin.role);
    setAuthUser(userToLogin);
    setIsAuthenticated(true);
    addAuditLog(`${userToLogin.name} signed in (${userToLogin.email})`);
    return { success: true, user: userToLogin };
  };

  // --------------------------------------------------------------------------
  // AUTH ACTION 2: Register New Account with Email and Password
  // --------------------------------------------------------------------------
  const register = ({ name, email, password, shopName, role = 'owner', location }) => {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const cleanShopName = (shopName || '').trim() || `${cleanName}'s Provision Store`;
    const cleanLocation = (location || '').trim() || shop.address;

    if (!cleanName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Check if account already exists
    const existing = users.find(
      u => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      return {
        success: false,
        error: 'An account with this email already exists. Please Sign In instead.'
      };
    }

    const assignedRole = role || 'owner';
    const newUser = {
      id: 'user_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: assignedRole,
      shopName: cleanShopName,
      location: cleanLocation,
      signedInAt: new Date().toISOString()
    };

    // Update the shop profile to the new user's details
    setShop(prev => ({
      ...prev,
      name: cleanShopName,
      ownerName: cleanName,
      staffName: '',
      address: cleanLocation,
      pin: '1234',
      accountNumber: '',
      bankName: '',
      accountName: ''
    }));

    // Clear all existing demo data — every new account starts with a clean slate
    setCustomers([]);
    setEntries([]);

    // Build a fresh welcome audit log (after clearing old ones)
    const welcomeLog = {
      id: 'log_' + Date.now(),
      actorName: cleanName,
      actorRole: assignedRole,
      action: `Welcome! Account created for ${cleanShopName}. Your ledger is ready to use.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today'
    };
    setAuditLogs([welcomeLog]);

    setUsers(prev => [newUser, ...prev]);
    setCurrentRole(assignedRole);
    setAuthUser(newUser);
    setIsAuthenticated(true);
    return { success: true, user: newUser };
  };

  // --------------------------------------------------------------------------
  // AUTH ACTION 3: Sign Out
  // --------------------------------------------------------------------------
  const logout = () => {
    const actorName = currentUser.name;
    setIsAuthenticated(false);
    setAuthUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_AUTH_USER);
    addAuditLog(`${actorName} signed out of the credit ledger`);
  };

  // --------------------------------------------------------------------------
  // AUTH ACTION 4: Open Auth Modal
  // --------------------------------------------------------------------------
  const openAuth = (tab = 'signin') => {
    setAuthTab(tab);
    setActiveModal('auth');
  };

  // --------------------------------------------------------------------------
  // HELPER: Reset to initial demo data
  // --------------------------------------------------------------------------
  const resetAllDataToDemo = () => {
    setShop(initialShop);
    setCustomers(initialCustomers);
    setEntries(initialEntries);
    setAuditLogs(initialAuditLogs);
    setIsAuthenticated(false);
    setAuthUser(null);
    localStorage.clear();
    addAuditLog('Reset demo ledger to initial demo state');
  };

  // Provide all values and functions to any child component in the app
  return (
    <ShopContext.Provider
      value={{
        shop,
        setShop,
        currentRole,
        setCurrentRole,
        currentUser,
        isAuthenticated,
        setIsAuthenticated,
        authUser,
        users,
        authTab,
        setAuthTab,
        login,
        register,
        logout,
        openAuth,
        customers,
        entries,
        auditLogs,
        isLocked,
        setIsLocked,
        verifyPin,
        isOffline,
        toggleOffline,
        syncStatus,
        activeModal,
        setActiveModal,
        selectedCustomerId,
        setSelectedCustomerId,
        fastEntryDefaultType,
        setFastEntryDefaultType,
        shopStats,
        getCustomerBalance,
        getCustomerLedger,
        getCustomerAgeing,
        addCredit,
        addPayment,
        reverseEntry,
        addCustomer,
        disputeEntry,
        resolveDispute,
        simulateLinkPayment,
        addAuditLog,
        resetAllDataToDemo,
        reminderTemplates
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

// ============================================================================
// 3. CUSTOM HOOK
// Easy shortcut function so components can just write: const { shop } = useShop();
// ============================================================================
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
