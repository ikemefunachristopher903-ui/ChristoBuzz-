export const appState = {
  mode: "demo", // demo | real
  user: null,
  country: null,
  currency: null,
  isAuthenticated: false
};

export function setCountry(country, currency) {
  appState.country = country;
  appState.currency = currency;
}

export function setUser(user) {
  appState.user = user;
  appState.isAuthenticated = true;
}
