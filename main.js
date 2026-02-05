// main.js
import { supabase } from "./supabase.js";
import { demoUsersInit } from "./demoController.js";
import { createPost, loadPosts } from "./post.js";
import { loadReels } from "./reels.js";
import { loadMusic } from "./music.js";
import { loadMarketplace } from "./marketplace.js";
import { showNotifications } from "./notification.js";
import { loadProfile } from "./profile.js";
import { registerView } from "./adnetwork.js";
import { initWallet } from "./wallet.js";
import { showPolicyModal } from "./policy.js";

// APP STATE
let currentUser = null;
const tabs = ["home", "reels", "music", "marketplace", "create", "notifications", "profile"];
let currentTab = "home";

// REGISTER PWA SERVICE WORKER
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(reg => console.log("Service Worker registered:", reg))
      .catch(err => console.error("SW registration failed:", err));
  });
}

// ========================
// AUTH STATE LISTENER
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
    demoUsersInit(); // Load demo accounts if no real user
  }
});

// ========================
// LOGIN & SIGNUP
// ========================
window.login = async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  currentUser = data.user;
  initializeApp();
};

window.signup = async () => {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  if (password !== confirmPassword) return alert("Passwords do not match.");
  const agreed = await showPolicyModal();
  if (!agreed) return alert("You must agree to terms and policy.");

  const { error, data } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
  if (error) return alert(error.message);
  currentUser = data.user;
  initializeApp();
};

// ========================
// TAB NAVIGATION
// ========================
document.querySelectorAll(".navbar li").forEach(tabBtn => {
  tabBtn.addEventListener("click", () => {
    const selectedTab = tabBtn.dataset.tab;
    switchTab(selectedTab);
  });
});

function switchTab(tabName) {
  currentTab = tabName;
  tabs.forEach(tab => document.getElementById(tab).classList.remove("active"));
  document.getElementById(tabName).classList.add("active");
  document.querySelectorAll(".navbar li").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.navbar li[data-tab="${tabName}"]`).classList.add("active");
  renderTab(tabName);
}

// ========================
// INITIALIZE APP
// ========================
function initializeApp() {
  demoUsersInit(); // Load demo users alongside real users
  loadPosts(currentUser);
  loadReels(currentUser);
  loadMusic(currentUser);
  loadMarketplace(currentUser);
  showNotifications(currentUser);
  loadProfile(currentUser);
  initWallet(currentUser);
  registerView(currentUser); // Ad impressions
}

// ========================
// RENDER TAB CONTENT
// ========================
function renderTab(tabName) {
  switch (tabName) {
    case "home":
      loadPosts(currentUser);
      break;
    case "reels":
      loadReels(currentUser);
      break;
    case "music":
      loadMusic(currentUser);
      break;
    case "marketplace":
      loadMarketplace(currentUser);
      break;
    case "notifications":
      showNotifications(currentUser);
      break;
    case "profile":
      loadProfile(currentUser);
      break;
    case "create":
      // You can implement a post creation modal here
      break;
  }
}

// ========================
// DEMO CONTENT
// ========================
function showDemoContent() {
  demoUsersInit(); // Auto-load demo users and content
}
