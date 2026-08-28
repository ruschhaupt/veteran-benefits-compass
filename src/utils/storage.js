// -----------------------------------------------------------------------
// PRIVACY-FIRST CLIENT-SIDE STORAGE MANAGER (Zero PII leaves browser)
// -----------------------------------------------------------------------

const STORAGE_KEY = 'vbc_veteran_profile_v2';
const LEGACY_KEY = 'vbc_veteran_profile';

export const DEFAULT_PROFILE = {
  userEmail: '',
  userName: '',
  branch: 'usmc',
  enlistmentDate: '2016-08-01',
  separationDate: '2024-08-01',
  separationMonths: 6,
  alreadyOut: true,
  dischargeType: 'honorable',
  disabilityStatus: 'rated',
  currentRating: 70,
  futurePath: 'freedom',
  selectedState: 'tx',
  hasDependents: 'spouse',
  yearsOfService: 8,
  servedPost911: true,
  exposedBurnPit: true,
  mstFlag: false,
  lifeGoals: ['freedom', 'home', 'wealth'],
  completedMilestones: {
    va_account_set: true,
    va_healthcare: true,
    intent_to_file_backpay: true,
  },
  completedBenefits: {
    parks_pass: true,
    commissary_exchange: true,
    va_healthcare: true,
  },
  homePrice: 450000,
  accessibility: {
    readerMode: false,
    calmMode: false,
    fontSize: 100, // 100, 125, 150
    highContrast: false,
  },
  savedAt: new Date().toISOString()
};

export const loadProfileFromStorage = () => {
  try {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Check legacy migration
      saved = localStorage.getItem(LEGACY_KEY);
    }
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        accessibility: {
          ...DEFAULT_PROFILE.accessibility,
          ...(parsed.accessibility || {})
        }
      };
    }
  } catch (e) {
    console.warn('[VBC Storage] Could not parse local profile:', e);
  }
  return DEFAULT_PROFILE;
};

export const saveProfileToStorage = (profileData) => {
  try {
    const payload = {
      ...profileData,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (e) {
    console.error('[VBC Storage] Failed to save profile to localStorage:', e);
    return false;
  }
};
