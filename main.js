/* =========================
   MAIN APP BOOTSTRAP
========================= */

// Core
import { initPosts } from "./post.js";
import { initReels } from "./reels.js";
import { renderFilters } from "./filters.js";

// Ads
import { initAds, showFeedAd, showRewardAd } from "./adnetwork.js";

// Wallet
import { initWallet } from "./wallet.js";

// AI / Extras
import { initAI } from "./ai.js";

// Auth (Supabase or fallback)
import { supabase } from "./supabase.js";

/* =========================
   GLOBAL STATE
========================= */

let currentUser = null;

/* =========================
   APP START
========================= */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("App starting...");

  await initAuth();
  initUI();
  registerPWA();
});

/* =========================
   AUTH HANDLING
========================= */

async function initAuth() {
  try {
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      currentUser = data.user;
    } else {
      // Guest user fallback
      currentUser = {
        id: "guest_" + Date.now(),
        guest: true
      };
    }

    console.log("User ready:", currentUser.id);
  } catch (err) {
    console.warn("Auth failed, using guest");
    currentUser = {
      id: "guest_" + Date.now(),
      guest: true
    };
  }
}

/* =========================
   INIT EVERYTHING
========================= */

function initUI() {
  // Wallet
  initWallet(currentUser.id);

  // Ads
  initAds(currentUser.id);

  // Filters
  renderFilters(currentUser.id);

  // Posts
  initPosts({
    userId: currentUser.id,
    onAdNeeded: showFeedAd
  });

  // Reels
  initReels({
    userId: currentUser.id,
    onRewardAd: showRewardAd
  });

  // AI tools
  initAI(currentUser.id);

  console.log("UI fully initialized");
}

/* =========================
   PWA
========================= */

function registerPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch(err => console.error("SW failed", err));
  }
}
