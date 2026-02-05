// main.js
import { supabase } from "./supabase.js";
import {
  demoUsersInit,
  demoPostsInit,
  demoProductsInit
} from "./demoController.js";
import { registerView } from "./adnetwork.js";

/* ======================
   GLOBAL STATE
====================== */
let currentUser = null;
let isDemoMode = true;

/* ======================
   DOM READY
====================== */
document.addEventListener("DOMContentLoaded", () => {
  setupAuthUI();
  setupNavigation();
});

/* ======================
   SERVICE WORKER
====================== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

/* ======================
   AUTH STATE (SAFE)
====================== */
supabase?.auth?.onAuthStateChange?.((_event, session) => {
  if (session?.user) {
    currentUser = session.user;
    isDemoMode = false;
    showApp();
    initializeApp();
  } else {
    enterDemoMode();
  }
});

/* ======================
   AUTH UI
====================== */
function setupAuthUI() {
  document.getElementById("login-btn").onclick = login;
  document.getElementById("signup-btn").onclick = signup;

  document.getElementById("show-signup").onclick = () => {
    toggleAuth(false);
  };
  document.getElementById("show-login").onclick = () => {
    toggleAuth(true);
  };
}

function toggleAuth(showLogin) {
  document.getElementById("login-box").classList.toggle("hidden", !showLogin);
  document.getElementById("signup-box").classList.toggle("hidden", showLogin);
}

/* ======================
   LOGIN
====================== */
async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
}

/* ======================
   SIGNUP
====================== */
async function signup() {
  const email = signupEmail.value;
  const password = signupPassword.value;
  const confirm = signupConfirmPassword.value;

  if (password !== confirm) return alert("Passwords do not match");

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
}

/* ======================
   DEMO MODE
====================== */
function enterDemoMode() {
  currentUser = null;
  isDemoMode = true;
  showApp();
  loadDemo();
}

function loadDemo() {
  demoUsersInit();
  demoPostsInit();
  demoProductsInit();
}

/* ======================
   APP INIT
====================== */
function initializeApp() {
  demoPostsInit();
  demoProductsInit();
}

/* ======================
   UI HELPERS
====================== */
function showApp() {
  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

/* ======================
   NAVIGATION
====================== */
function setupNavigation() {
  document.querySelectorAll(".navbar li").forEach((item) => {
    item.addEventListener("click", () => switchTab(item.dataset.tab));
  });
}

function switchTab(tabName) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".navbar li").forEach(li => li.classList.remove("active"));

  document.getElementById(tabName)?.classList.add("active");
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add("active");

  registerView?.(tabName);

  if (tabName === "home") demoPostsInit();
  if (tabName === "marketplace") demoProductsInit();
}
