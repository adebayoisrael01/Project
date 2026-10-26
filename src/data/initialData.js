// ============================================================================
// INITIAL DATA FOR SHOPTAB (DEMO SEED DATA)
// Purpose: Provides authentic default customers, ledger records, and reminder
// templates so the app works immediately out of the box.
// ============================================================================

// ----------------------------------------------------------------------------
// 1. SHOP PROFILE
// Details about the store (Mama Chidi Provision Store in Tejuosho Market, Lagos)
// ----------------------------------------------------------------------------
export const initialShop = {
  id: 'shop_001',
  name: 'Mama Chidi Provision Store',
  tagline: 'Wholesale & Retail Groceries, Provisions & Drinks',
  address: 'Shop 14, Block C, Tejuosho Ultra-Modern Market, Yaba, Lagos',
  phone: '+234 803 456 7890',
  currency: '₦',
  pin: '1234', // Default 4-digit security PIN
  ownerName: 'Mama Chidi',
  staffName: 'Emeka (Attendant)',
  defaultReminderTone: 'gentle',
  accountNumber: '0123456789',
  bankName: 'Moniepoint Microfinance Bank',
  accountName: 'MAMA CHIDI STORES LTD',
};

// ----------------------------------------------------------------------------
// 2. CUSTOMERS LIST
// Each customer has an ID, name, phone, tags, credit limit, and reliability stats.
// ----------------------------------------------------------------------------
export const initialCustomers = [
  {
    id: 'cust_ada',
    name: 'Mrs. Ada Okafor',
    phone: '+2348035550192',
    tags: ['Regular', 'School Teacher'],
    creditLimit: 35000,
    notes: 'Pays every 28th after government salary. Very dependable customer.',
    avatarBg: 'bg-emerald-600',
    createdAt: '2026-08-10',
    reliability: { score: 92, label: 'Reliable Payer', avgDays: 6 }
  },
  {
    id: 'cust_segun',
    name: 'Baba Segun (Mechanic)',
    phone: '+2348023334411',
    tags: ['Market Neighbour', 'Auto Workshop'],
    creditLimit: 50000,
    notes: 'Workshop opposite market gate 2. Buys battery water, energy drinks, soap.',
    avatarBg: 'bg-amber-600',
    createdAt: '2026-07-15',
    reliability: { score: 65, label: 'Moderate (Needs Reminder)', avgDays: 22 }
  },
  {
    id: 'cust_musa',
    name: 'Alhaji Musa Garba',
    phone: '+2348145558822',
    tags: ['Wholesale Buyer', 'Mai Shai'],
    creditLimit: 80000,
    notes: 'Buys cartons of Peak milk, Milo, sugar, and Lipton tea for his tea spot.',
    avatarBg: 'bg-blue-600',
    createdAt: '2026-06-20',
    reliability: { score: 78, label: 'Good Payer', avgDays: 14 }
  },
  {
    id: 'cust_blessing',
    name: 'Sister Blessing (Caterer)',
    phone: '+2347061112233',
    tags: ['Church Member', 'Baker / Events'],
    creditLimit: 40000,
    notes: 'Takes margarine, eggs, sugar, flour for weekend wedding orders.',
    avatarBg: 'bg-purple-600',
    createdAt: '2026-08-01',
    reliability: { score: 45, label: 'Slow Payer (30+ Days)', avgDays: 42 }
  },
  {
    id: 'cust_emeka_elec',
    name: 'Emeka Electrician',
    phone: '+2349054443322',
    tags: ['Artisan', 'Youth Leader'],
    creditLimit: 20000,
    notes: 'Takes beverages and biscuits for apprentice boys. Pays in quick small bits.',
    avatarBg: 'bg-teal-600',
    createdAt: '2026-09-05',
    reliability: { score: 85, label: 'Good Payer', avgDays: 9 }
  },
  {
    id: 'cust_joy',
    name: 'Nurse Joy (Mercy Clinic)',
    phone: '+2348187779900',
    tags: ['Health Worker', 'Regular'],
    creditLimit: 30000,
    notes: 'Buys provisions for night shift staff. Account currently fully settled.',
    avatarBg: 'bg-pink-600',
    createdAt: '2026-09-12',
    reliability: { score: 98, label: 'Excellent (Pays Promptly)', avgDays: 3 }
  }
];

// Helper to calculate realistic relative dates (e.g. 5 days ago)
const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

// ----------------------------------------------------------------------------
// 3. LEDGER ENTRIES
// In ShopTab, balances are NEVER stored directly. They are always computed
// from these append-only transaction entries.
// Entry Types:
//   - 'credit'     : Customer took goods on credit (adds to balance)
//   - 'payment'    : Customer paid money (subtracts from balance)
//   - 'adjustment' : Reversal / discount (adjusts balance)
// ----------------------------------------------------------------------------
export const initialEntries = [
  // --- MRS. ADA'S ENTRIES ---
  {
    id: 'ent_101',
    customerId: 'cust_ada',
    type: 'credit',
    amount: 6000,
    note: '1 bag Golden Penny Semo 5kg + 2 tins Peak evaporated milk',
    photoUrl: null,
    method: 'goods',
    entryDate: daysAgo(16),
    dueDate: daysAgo(2),
    recordedBy: { name: 'Mama Chidi', role: 'owner' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(16) + 'T09:30:00Z'
  },
  {
    id: 'ent_102',
    customerId: 'cust_ada',
    type: 'payment',
    amount: 3000,
    note: 'Part payment via bank transfer after PTA meeting',
    photoUrl: null,
    method: 'transfer',
    entryDate: daysAgo(8),
    dueDate: null,
    recordedBy: { name: 'Emeka (Attendant)', role: 'staff' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(8) + 'T14:15:00Z'
  },
  {
    id: 'ent_103',
    customerId: 'cust_ada',
    type: 'credit',
    amount: 4500,
    note: '1 roll Sunlight detergent + 6 sachets Milo refill 20g',
    photoUrl: null,
    method: 'goods',
    entryDate: daysAgo(3),
    dueDate: daysAgo(-4),
    recordedBy: { name: 'Mama Chidi', role: 'owner' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(3) + 'T11:45:00Z'
  },

  // --- BABA SEGUN'S ENTRIES ---
  {
    id: 'ent_201',
    customerId: 'cust_segun',
    type: 'credit',
    amount: 18000,
    note: '1 carton Fearless Energy Drink + 2 cartons Eva Water 75cl',
    photoUrl: null,
    method: 'goods',
    entryDate: daysAgo(24),
    dueDate: daysAgo(10),
    recordedBy: { name: 'Mama Chidi', role: 'owner' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(24) + 'T10:00:00Z'
  },
  {
    id: 'ent_202',
    customerId: 'cust_segun',
    type: 'payment',
    amount: 10000,
    note: 'Cash payment handed to Emeka after repairing Toyota brake pads',
    photoUrl: null,
    method: 'cash',
    entryDate: daysAgo(14),
    dueDate: null,
    recordedBy: { name: 'Emeka (Attendant)', role: 'staff' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(14) + 'T16:20:00Z'
  },
  {
    id: 'ent_203',
    customerId: 'cust_segun',
    type: 'credit',
    amount: 7500,
    note: '1 carton Cabin biscuits + 1 pack Omo 1kg for workshop wash',
    photoUrl: null,
    method: 'goods',
    entryDate: daysAgo(12),
    dueDate: daysAgo(-2),
    recordedBy: { name: 'Emeka (Attendant)', role: 'staff' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(12) + 'T17:10:00Z'
  },

  // --- ALHAJI MUSA'S ENTRIES ---
  {
    id: 'ent_301',
    customerId: 'cust_musa',
    type: 'credit',
    amount: 35000,
    note: 'Half carton Peak Milk powder 400g + 1 carton St Louis sugar cubes',
    photoUrl: null,
    method: 'goods',
    entryDate: daysAgo(5),
    dueDate: daysAgo(-5),
    recordedBy: { name: 'Mama Chidi', role: 'owner' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(5) + 'T08:15:00Z'
  },
  {
    id: 'ent_302',
    customerId: 'cust_musa',
    type: 'payment',
    amount: 15000,
    note: 'POS card payment at shop counter',
    photoUrl: null,
    method: 'pos',
    entryDate: daysAgo(2),
    dueDate: null,
    recordedBy: { name: 'Mama Chidi', role: 'owner' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(2) + 'T12:00:00Z'
  },

  // --- SISTER BLESSING'S ENTRIES ---
  {
    id: 'ent_401',
    customerId: 'cust_blessing',
    type: 'credit',
    amount: 22000,
    note: '1 carton Simas Margarine + 1 bag Dangote Sugar 10kg for youth wedding',
    photoUrl: null,
    method: 'goods',
    entryDate: daysAgo(48),
    dueDate: daysAgo(34),
    recordedBy: { name: 'Mama Chidi', role: 'owner' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(48) + 'T15:30:00Z'
  },
  {
    id: 'ent_402',
    customerId: 'cust_blessing',
    type: 'payment',
    amount: 4000,
    note: 'Part payment cash',
    photoUrl: null,
    method: 'cash',
    entryDate: daysAgo(20),
    dueDate: null,
    recordedBy: { name: 'Emeka (Attendant)', role: 'staff' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(20) + 'T11:00:00Z'
  },

  // --- EMEKA ELECTRICIAN'S ENTRIES ---
  {
    id: 'ent_501',
    customerId: 'cust_emeka_elec',
    type: 'credit',
    amount: 8500,
    note: '4 packs Ribena pocket + 2 tins Dano full cream milk',
    photoUrl: null,
    method: 'goods',
    entryDate: daysAgo(68),
    dueDate: daysAgo(54),
    recordedBy: { name: 'Mama Chidi', role: 'owner' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(68) + 'T13:40:00Z'
  },
  {
    id: 'ent_502',
    customerId: 'cust_emeka_elec',
    type: 'payment',
    amount: 5000,
    note: 'Paid via ShopTab repayment link (Paystack transfer)',
    photoUrl: null,
    method: 'link',
    entryDate: daysAgo(35),
    dueDate: null,
    recordedBy: { name: 'Online Link', role: 'system' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(35) + 'T18:05:00Z'
  },

  // --- NURSE JOY'S SETTLED ACCOUNT ---
  {
    id: 'ent_601',
    customerId: 'cust_joy',
    type: 'credit',
    amount: 12000,
    note: '2 cartons Chi Exotic juice + 1 carton digestive biscuits',
    photoUrl: null,
    method: 'goods',
    entryDate: daysAgo(10),
    dueDate: daysAgo(3),
    recordedBy: { name: 'Emeka (Attendant)', role: 'staff' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(10) + 'T10:10:00Z'
  },
  {
    id: 'ent_602',
    customerId: 'cust_joy',
    type: 'payment',
    amount: 12000,
    note: 'Full settlement via instant bank transfer on clinic salary day',
    photoUrl: null,
    method: 'transfer',
    entryDate: daysAgo(3),
    dueDate: null,
    recordedBy: { name: 'Mama Chidi', role: 'owner' },
    reversesEntryId: null,
    isReversed: false,
    isDisputed: false,
    createdAt: daysAgo(3) + 'T15:25:00Z'
  }
];

// ----------------------------------------------------------------------------
// 4. MULTI-LINGUAL REMINDER TEMPLATES
// Authentic Nigerian templates across English, Pidgin, Yoruba, Hausa, and Igbo.
// ----------------------------------------------------------------------------
export const reminderTemplates = {
  // --- ENGLISH ---
  en: {
    name: 'English',
    flag: '🇬🇧',
    tones: {
      gentle: {
        label: 'Gentle & Respectful',
        tag: 'Friendly check-in',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Hello ${customerName}, warm greetings from ${shopName}. We hope you are having a wonderful week! This is a gentle reminder regarding your current balance of ₦${balance.toLocaleString()}. You can view your full ledger and pay conveniently online here: ${linkUrl} . Thank you for your continued patronage!`
      },
      standard: {
        label: 'Standard',
        tag: 'Direct reminder',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Dear ${customerName}, greetings from ${shopName}. Please be informed that your outstanding credit balance is ₦${balance.toLocaleString()}. Kindly arrange payment at your earliest convenience or pay directly using this secure link: ${linkUrl} . Thank you for your cooperation.`
      },
      firm: {
        label: 'Firm / Overdue',
        tag: 'Overdue notice',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Urgent Notice: Dear ${customerName}, your account balance of ₦${balance.toLocaleString()} with ${shopName} is now overdue. Please settle this balance today to keep your credit line open. Pay securely online: ${linkUrl} or visit the shop. Thank you.`
      }
    }
  },

  // --- PIDGIN ENGLISH ---
  pidgin: {
    name: 'Pidgin English',
    flag: '🇳🇬',
    tones: {
      gentle: {
        label: 'Gentle (Well-well)',
        tag: 'Friendly check-in',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Good day ${customerName}! ${shopName} dey greet you well-well. Hope work and body dey fine? Na quick gentle reminder on top di ₦${balance.toLocaleString()} balance wey remain. You fit check wetin you take and pay small-small or in full for here: ${linkUrl} . We appreciate you plenty!`
      },
      standard: {
        label: 'Standard (Sharp-sharp)',
        tag: 'Direct reminder',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Greeting ${customerName}, ${shopName} dey hail you. Just to remind you say your remaining balance na ₦${balance.toLocaleString()}. Abeg make you help us sort am out. You fit pay sharp-sharp through this link: ${linkUrl} . God bless your hustle!`
      },
      firm: {
        label: 'Firm (E don tey)',
        tag: 'Overdue notice',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Hello ${customerName}, ${shopName} dey write you. Di ₦${balance.toLocaleString()} balance don tey small. Abeg make you settle am today make our business fit continue dey move well. Click here to pay: ${linkUrl} or bring am come shop. Thank you!`
      }
    }
  },

  // --- YORUBA ---
  yoruba: {
    name: 'Yorùbá',
    flag: '🇳🇬',
    tones: {
      gentle: {
        label: 'Gentle (Ẹ kún fún ìbọ̀wọ̀)',
        tag: 'Friendly check-in',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Ẹ n lẹ o ${customerName}, ẹ ku iṣẹ loni. Ikini pataki lati ọdọ ${shopName}. A fẹ fi leti yin nipa owo ₦${balance.toLocaleString()} to ku lori akanti yin. Ẹ le wo alaye rẹ tabi san owo naa lori ayelujara nibi: ${linkUrl} . A dupẹ pupọ fun ajọṣepọ wa!`
      },
      standard: {
        label: 'Standard',
        tag: 'Direct reminder',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Ẹ ku ojumo ${customerName}. Ẹ jọwọ, a fẹ rán yin leti pe owo ₦${balance.toLocaleString()} ṣi ku lati san si ${shopName}. Ẹ jọwọ ẹ ran wa lọwọ lati san an nibi: ${linkUrl} . Ẹ ṣe pupọ.`
      },
      firm: {
        label: 'Firm (O ti pẹ)',
        tag: 'Overdue notice',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Ikede pataki: ${customerName}, owo ₦${balance.toLocaleString()} to wa lori akanti yin ni ${shopName} ti pẹ ju bẹẹ lọ. Ẹ jọwọ ẹ san owo yii loni lori ọna asopọ yii: ${linkUrl} tabi ki ẹ wa si ile itaja wa. A dupẹ.`
      }
    }
  },

  // --- HAUSA ---
  hausa: {
    name: 'Hausa',
    flag: '🇳🇬',
    tones: {
      gentle: {
        label: 'Gentle (Cikin girmamawa)',
        tag: 'Friendly check-in',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Sannu ${customerName}, barka da yini daga ${shopName}. Muna fatan kana lafiya. Wannan tunatarwa ce cikin ladabi kan ragowar kudi ₦${balance.toLocaleString()} dake kanka. Zaka iya biya ta wannan shafin: ${linkUrl} . Muna godiya da kasuwanci tare!`
      },
      standard: {
        label: 'Standard',
        tag: 'Direct reminder',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Gaisuwa ${customerName}. Don Allah muna tunatar da kai game da bashin ₦${balance.toLocaleString()} a ${shopName}. Don Allah a taimaka a biya ta nan: ${linkUrl} . Nagode sosai.`
      },
      firm: {
        label: 'Firm (Lokaci yayi)',
        tag: 'Overdue notice',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Gargaɗi: ${customerName}, kudin da kake bi bashi ₦${balance.toLocaleString()} a ${shopName} ya wuce lokacin biya. Don Allah a biya a yau ta wannan hanyar: ${linkUrl} ko a zo shago. Mungode.`
      }
    }
  },

  // --- IGBO ---
  igbo: {
    name: 'Igbo',
    flag: '🇳🇬',
    tones: {
      gentle: {
        label: 'Gentle (Nkwanye ùgwù)',
        tag: 'Friendly check-in',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Nnọọ ${customerName}, ekele sitere na ${shopName}. Kedu ka ihe niile si aga? Nke a bụ naanị nchetara nwayọ maka ụgwọ ₦${balance.toLocaleString()} fọdụrụnụ. Ị nwere ike ịlele akwụkwọ ndekọ gị ma kwụọ ya n'ịntanetị ebe a: ${linkUrl} . Anyị na-ekele gị nke ukwuu!`
      },
      standard: {
        label: 'Standard',
        tag: 'Direct reminder',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Ekele ${customerName}. Biko anyị na-echetara gị maka ụgwọ ₦${balance.toLocaleString()} ị ji ${shopName}. Biko nyere aka dozie ya ebe a: ${linkUrl} . Daalụ nke ukwuu.`
      },
      firm: {
        label: 'Firm (Oge agafeela)',
        tag: 'Overdue notice',
        getText: ({ customerName, balance, shopName, linkUrl }) =>
          `Ịdọ aka na ntị dị mkpa: ${customerName}, ụgwọ ₦${balance.toLocaleString()} ị ji ${shopName} agafeela oge ịkwụ ya. Biko kwụọ ya taa site na iji njikọ a: ${linkUrl} ma ọ bụ bịa n'ụlọ ahịa. Daalụ.`
      }
    }
  }
};

// ----------------------------------------------------------------------------
// 5. INITIAL AUDIT LOGS
// Historical activity records for accountability
// ----------------------------------------------------------------------------
export const initialAuditLogs = [
  {
    id: 'log_01',
    actorName: 'Mama Chidi',
    actorRole: 'owner',
    action: 'Recorded Credit of ₦4,500 for Mrs. Ada Okafor',
    time: daysAgo(3) + ' 11:45 AM'
  },
  {
    id: 'log_02',
    actorName: 'Mama Chidi',
    actorRole: 'owner',
    action: 'Received POS Payment of ₦15,000 from Alhaji Musa Garba',
    time: daysAgo(2) + ' 12:00 PM'
  },
  {
    id: 'log_03',
    actorName: 'Emeka (Attendant)',
    actorRole: 'staff',
    action: 'Recorded Cash Payment of ₦10,000 from Baba Segun',
    time: daysAgo(14) + ' 04:20 PM'
  },
  {
    id: 'log_04',
    actorName: 'Paystack Automated Rail',
    actorRole: 'system',
    action: 'Online link payment of ₦5,000 settled from Emeka Electrician',
    time: daysAgo(35) + ' 06:05 PM'
  }
];
