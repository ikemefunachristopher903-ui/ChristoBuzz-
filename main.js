// main.js
import { supabase } from "./supabase.js";
import {
  demoUsersInit,
  demoPostsInit,
  demoProductsInit
} from "./demoController.js";
import { registerView } from "./adnetwork.js";

/* =========================
   GLOBAL STATE
========================= */
let currentUser = null;
const tabs = ["home","reels","music","marketplace","create","notifications","profile"];

/* =========================
   SERVICE WORKER
========================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("SW registered"))
      .catch(err => console.error("SW error", err));
  });
}

/* =========================
   AUTH STATE
========================= */
supabase.auth.onAuthStateChange((_event, session) => {
  const authScreen = document.getElementById("auth-screen");
  const app = document.getElementById("app");

  if (session?.user) {
    currentUser = session.user;
    authScreen.classList.add("hidden");
    app.classList.remove("hidden");
    initializeApp();
  } else {
    currentUser = null;
    authScreen.classList.remove("hidden");
    app.classList.add("hidden");
    loadDemoMode();
  }
});

/* =========================
   AUTH ACTIONS
========================= */
window.login = async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
};

window.signup = async () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm-password").value;

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
};

/* =========================
   INITIALIZATION
========================= */
function initializeApp() {
  setupNavigation();
  loadHome();
}

function loadDemoMode() {
  setupNavigation();
  demoUsersInit();
  demoPostsInit();
  demoProductsInit();
  loadHome();
}

/* =========================
   NAVIGATION (FIXED)
========================= */
function setupNavigation() {
  document.querySelectorAll("nav li").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll("nav li").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      loadTab(item.dataset.tab);
    });
  });
}

/* =========================
   TAB LOADER
========================= */
function loadTab(tab) {
  const container = document.getElementById(tab);
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  container.classList.add("active");

  container.innerHTML = "";

  switch (tab) {
    case "home":
      demoPostsInit();
      registerView("home");
      break;

    case "reels":
      container.innerHTML = "<h2>Reels</h2><p>Reels loading…</p>";
      registerView("reels");
      break;

    case "music":
      container.innerHTML = "<h2>Music</h2><p>Music loading…</p>";
      registerView("music");
      break;

    case "marketplace":
      demoProductsInit();
      registerView("marketplace");
      break;

    case "create":
      container.innerHTML = "<h2>Create</h2><p>Create post / reel</p>";
      break;

    case "notifications":
      container.innerHTML = "<h2>Notifications</h2>";
      break;

    case "profile":
      container.innerHTML = `
        <h2>Profile</h2>
        <p>${currentUser ? currentUser.email : "Demo User"}</p>
        <p>Bio enabled ✔</p>
      `;
      break;
  }
}

/* =========================
   DEFAULT HOME
========================= */
function loadHome() {
  loadTab("home");
}
