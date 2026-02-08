// main.js – Central hub: auth + connects ALL other files
import { supabase } from './supabase.js';
import { loadMoreFeed } from './feed.js';                 // infinite feed
import { initWallet } from './wallet.js';                 // wallet display
import { initMarketplace } from './marketplace.js';       // marketplace
import { openMessageSplash, closeMessageSplash } from './messages.js'; // honeycomb
import { setAccountType } from './state/appstate.js';     // global state
import { CONFIG } from './config.js';                     // cuts/wallets

let currentUser = null;
let accountType = 'demo';
let isFirstMonth = false;

document.addEventListener('DOMContentLoaded', () => {
  setupBottomNav();
  setupFloatingCreate();
});

// Auth listener – when logged in, start everything
supabase.auth.onAuthStateChange(async (_, session) => {
  currentUser = session?.user ?? null;

  if (currentUser) {
    document.getElementById('auth-screen')?.classList.add('hidden');
    document.getElementById('app')?.classList.remove('hidden');

    // Fetch profile (reuse existing table)
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_type, created_at, referrals, followers, balance')
      .eq('id', currentUser.id)
      .single();

    accountType = profile?.account_type || 'normal';
    isFirstMonth = profile?.created_at ? (new Date() - new Date(profile.created_at)) < 30*24*60*60*1000 : true;

    setAccountType(accountType, isFirstMonth);

    // Start all features
    loadMoreFeed();         // start infinite feed
    initWallet();           // show wallet if creator
    initMarketplace();      // load marketplace
    // Add other inits later (e.g., load messages if needed)

    console.log('App fully initialized for user:', currentUser.email);
  } else {
    document.getElementById('auth-screen')?.classList.remove('hidden');
    document.getElementById('app')?.classList.add('hidden');
  }
});

// Login / Signup
window.login = async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
};

window.signup = async () => {
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert('Sign up success! Login now.');
};

// Bottom nav setup
function setupBottomNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const section = item.dataset.section;
      if (section === 'messages') openMessageSplash();
      // Add logic for other sections (e.g., show profile tab, marketplace)
    });
  });
}

// Floating create button
function setupFloatingCreate() {
  document.getElementById('create-btn')?.addEventListener('click', () => {
    alert('Create post/reel/product/music – form coming soon');
    // Later: open modal for post/reel/upload
  });
      }
