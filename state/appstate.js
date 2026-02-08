// state/appstate.js – Global app state (no Supabase table – in-memory for now)
export let appState = {
  currentUser: null,
  accountType: 'demo',      // 'demo' | 'normal' | 'creator'
  isFirstMonth: false,      // for creator first-month 100%
  balance: 0,
  referrals: 0,
  followers: 0,
  unreadMessages: 0
};

export function setAccountType(type, isFirstMonth = false) {
  appState.accountType = type;
  appState.isFirstMonth = isFirstMonth;
  console.log(`Account type set to: ${type}`);
}

export function getAppState() {
  return appState;
}
