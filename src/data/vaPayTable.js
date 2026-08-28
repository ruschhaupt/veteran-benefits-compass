// -----------------------------------------------------------------------
// AUTHORITATIVE VA DISABILITY COMPENSATION RATES TABLE (2024-2026)
// -----------------------------------------------------------------------
export const VA_PAY_TABLE = {
  0:   { single: 0,    single_kids: 0,    spouse: 0,    family: 0    },
  10:  { single: 175,  single_kids: 189,  spouse: 195,  family: 211  },
  20:  { single: 346,  single_kids: 367,  spouse: 384,  family: 409  },
  30:  { single: 537,  single_kids: 568,  spouse: 603,  family: 641  },
  40:  { single: 774,  single_kids: 813,  spouse: 860,  family: 911  },
  50:  { single: 1102, single_kids: 1152, spouse: 1211, family: 1275 },
  60:  { single: 1395, single_kids: 1453, spouse: 1529, family: 1606 },
  70:  { single: 1759, single_kids: 1830, spouse: 1921, family: 2014 },
  80:  { single: 2044, single_kids: 2126, spouse: 2232, family: 2339 },
  90:  { single: 2297, single_kids: 2390, spouse: 2512, family: 2633 },
  100: { single: 3737, single_kids: 3849, spouse: 3946, family: 4094 },
};

export const getVaMonthlyComp = (rating, dependents = 'single') => {
  const rounded = Math.min(100, Math.max(0, Math.round((rating || 0) / 10) * 10));
  const depKey = dependents === 'single' ? 'single'
    : dependents === 'single_kids' ? 'single_kids'
    : dependents === 'spouse' ? 'spouse'
    : 'family';
  return (VA_PAY_TABLE[rounded] || VA_PAY_TABLE[0])[depKey] || 0;
};
