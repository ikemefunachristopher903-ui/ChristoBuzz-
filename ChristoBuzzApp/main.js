// main.js
import { supabase } from "./supabase.js";
import { createPost, loadPosts, likePost } from "./post.js";
import { loadReels, likeReel } from "./reels.js";
import { applyFilter, unlockPremiumFilter } from "./filters.js";
import { registerView, triggerDemoAds } from "./adnetwork.js";
import { followUser, getFriendSuggestions } from "./follow.js";
import { loadMessages, sendMessage } from "./messages.js";
import { showNotifications, markNotificationRead } from "./notifications.js";
import { loadProfile, updateProfile } from "./profile.js";
import { loadMarketplace, buyProduct } from "./marketplace.js";
import { loadMusic, playMusic } from "./music.js";
import { initWallet, updateWallet, checkBalance } from "./wallet.js";
import { demoUsersInit } from "./demoController.js"; // Demo accounts & auto-actions
import { showPolicyModal } from "./policy.js";

// ========================
// SERVICE WORKER
// ========================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}

// ========================
// APP STATE
// ========================
let currentUser = null;
let selectedFilter = "none";
let previewElement = null;
const tabs = ["home", "reels", "music", "marketplace", "create", "notifications", "profile"];

// ========================
// AUTH STATE
// ========================
supabase.auth.onAuthStateChange((_event, session) => {
  const authScreen = document.getElementById("auth-screen");
  const app = document.getElementById("app");

  if (session && session.user) {
    currentUser = session.user;
    authScreen.classList.add("hidden");
    app.classList.remove("hidden");
    initializeApp();
  } else {
    currentUser = null;
    authScreen.classList.remove("hidden");
    app.classList.add("hidden");
    demoUsersInit(); // Load demo content & auto-ad watching
  }
});

// ========================
// LOGIN
// ========================
window.login = async function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  currentUser = data.user;
  initializeApp();
};

// ========================
// SIGN UP
// ========================
window.signup = async function () {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  if (password !== confirmPassword) return alert("Passwords do not match.");

  const agreed = await showPolicyModal();
  if (!agreed) return alert("You must agree to the policy.");

  const { error, data } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  await supabase.from("profiles").insert({ id: data.user.id, username });
  currentUser = data.user;
  initializeApp();
};

// ========================
// INITIALIZE APP
// ========================
async function initializeApp() {
  // Load UI components
  loadPosts();
  loadReels();
  loadMusic();
  loadMarketplace();
  loadProfile(currentUser.id);
  showNotifications();
  initWallet(currentUser.id);

  // Demo users watch ads automatically
  demoUsersInit();

  // Start auto sponsorship check
  checkInfluencerSponsorships();
}

// ========================
// NAVIGATION
// ========================
tabs.forEach(tab => {
  const btn = document.getElementById(`tab-${tab}`);
  if (!btn) return;
  btn.addEventListener("click", () => switchTab(tab));
});

function switchTab(tabName) {
  tabs.forEach(tab => {
    document.getElementById(`section-${tab}`).classList.add("hidden");
  });
  document.getElementById(`section-${tabName}`).classList.remove("hidden");
}

// ========================
// POST INTERACTIONS
// ========================
window.createPost = createPost;
window.likePost = likePost;

// ========================
// REELS INTERACTIONS
// ========================
window.likeReel = likeReel;

// ========================
// FILTERS
// ========================
window.applyFilter = (filter) => {
  selectedFilter = filter;
  applyFilter(filter);
};

// ========================
// FOLLOW SYSTEM
// ========================
window.followUser = followUser;
window.getFriendSuggestions = getFriendSuggestions;

// ========================
// MESSAGES
// ========================
window.loadMessages = loadMessages;
window.sendMessage = sendMessage;

// ========================
// PROFILE
// ========================
window.loadProfile = loadProfile;
window.updateProfile = updateProfile;

// ========================
// MARKETPLACE
// ========================
window.loadMarketplace = loadMarketplace;
window.buyProduct = buyProduct;

// ========================
// MUSIC
// ========================
window.loadMusic = loadMusic;
window.playMusic = playMusic;

// ========================
// WALLET & ADS
// ========================
window.initWallet = initWallet;
window.updateWallet = updateWallet;
window.checkBalance = checkBalance;
window.registerView = registerView;
window.triggerDemoAds = triggerDemoAds;

// ========================
// INFLUENCER SPONSORSHIP
// ========================
async function checkInfluencerSponsorships() {
  // Example: automatically check if user qualifies for sponsored posts
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) return console.error(error);

  data.forEach(user => {
    if (user.followers_count >= 1000) {
      // Trigger sponsorship logic
      console.log(`User ${user.username} qualifies for sponsorship!`);
    }
  });

  // Check every 5 minutes
  setTimeout(checkInfluencerSponsorships, 300000);
}

// ========================
// DEMO CONTENT LOADER
// ========================
async function showDemoContent() {
  // Load demo posts, reels, marketplace, music
  demoUsersInit();
}

// ========================
// AUTO-WATCH ADS
// ========================
setInterval(() => {
  if (!currentUser) {
    triggerDemoAds(); // Demo accounts watch ads even if no real user
  }
}, 10000); // Every 10 seconds

console.log("Main.js fully loaded.");
