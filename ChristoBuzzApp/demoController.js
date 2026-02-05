// -------------------- demoController.js --------------------

// Import Supabase and ad loader
import { supabase } from './supabase.js';
import { loadAds } from './adnetwork.js';

// Demo Data
import demoUsers from './demoData/demoUsers.json';
import demoPosts from './demoData/demoPosts.json';
import demoProducts from './demoData/demoProducts.json';

export const demoController = {
  demoWallet: 0,
  intervalId: null,

  loadDemoAccount: function() {
    console.log("Demo account loaded.");
    // Start auto watching ads every X seconds
    this.startAutoAds();
  },

  startAutoAds: function() {
    if(this.intervalId) clearInterval(this.intervalId);

    // Auto-watch ads every 10 seconds for demo
    this.intervalId = setInterval(() => {
      this.watchDemoAd();
    }, 10000); // 10 seconds
  },

  watchDemoAd: function() {
    console.log("Demo watching an ad...");

    // Call the ad network function to simulate a CPM ad watched
    loadAds(document.getElementById('ads-container'), true);

    // Add earnings for demo account
    this.demoWallet += this.getAdRevenue();
    this.updateWalletDisplay();
  },

  getAdRevenue: function() {
    // Example: random CPM between 0.05 - 0.2
    return (Math.random() * 0.15 + 0.05).toFixed(2);
  },

  updateWalletDisplay: function() {
    const walletView = document.getElementById('wallet-view');
    if(walletView){
      walletView.innerHTML = `<p>Wallet Balance: ${this.demoWallet} Demo USD</p>`;
    }
  }
};

// -------------------- Demo Data Access --------------------
export function getDemoUsers() {
  return demoUsers;
}

export function getDemoPosts() {
  return demoPosts;
}

export function getDemoProducts() {
  return demoProducts;
}
