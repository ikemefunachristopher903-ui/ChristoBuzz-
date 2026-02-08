// state/appstate.js – Global in-memory state
export let appState = {
  currentUser: null,
  accountType: 'demo',
  isFirstMonth: false,
  balance: 0,
  referrals: 0,
  followers: 0,
  unreadMessages: 0
};

export function setAccountType(type, isFirstMonth = false) {
  appState.accountType = type;
  appState.isFirstMonth = isFirstMonth;
}

export function getAppState() {
  return appState;
}
