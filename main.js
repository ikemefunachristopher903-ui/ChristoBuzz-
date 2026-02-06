// main.js
import { supabase } from "./supabase.js";

/* =========================
   GLOBAL STATE
========================= */
let currentUser = null;
const tabs = ["home","reels","music","marketplace","create","notifications","profile"];

/* =========================
   DOM READY (IMPORTANT)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
});

/* =========================
   AUTH STATE
========================= */
supabase.auth.onAuthStateChange((_event, session) => {
  const authScreen = document.getElementById("auth-screen");
  const app = document.getElementById("app");

  if (session && session.user) {
    currentUser = session.user;
    authScreen.classList.add("hidden");
    app.classList.remove("hidden");
  } else {
    currentUser = null;
    authScreen.classList.remove("hidden");
    app.classList.add("hidden");
  }
});

/* =========================
   LOGIN
========================= */
window.login = async function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
  }
};

/* =========================
   SIGNUP
========================= */
window.signup = async function () {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm-password").value;

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
  }
};

/* =========================
   NAVIGATION SYSTEM (FIXED)
========================= */
function setupNavigation() {
  const navItems = document.querySelectorAll("nav li");
  const tabsDiv = document.querySelectorAll(".tab");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const tab = item.dataset.tab;

      // Remove active state
      navItems.forEach(i => i.classList.remove("active"));
      tabsDiv.forEach(t => t.classList.remove("active"));

      // Activate selected tab
      item.classList.add("active");
      document.getElementById(tab)?.classList.add("active");
    });
  });
                                }
