// main.js
import { supabase } from "./supabase.js";

/* =========================
   GLOBAL STATE
========================= */
let currentUser = null;
const tabs = ["home", "reels", "music", "marketplace", "create", "notifications", "profile"];

/* =========================
   DOM READY
========================= */
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded – setting up navigation");
  setupNavigation();
});

/* =========================
   AUTH STATE LISTENER
========================= */
supabase.auth.onAuthStateChange((_event, session) => {
  const authScreen = document.getElementById("auth-screen");
  const app = document.getElementById("app");

  if (session && session.user) {
    currentUser = session.user;
    authScreen.classList.add("hidden");
    app.classList.remove("hidden");
    console.log("User logged in:", currentUser.email);
  } else {
    currentUser = null;
    authScreen.classList.remove("hidden");
    app.classList.add("hidden");
    console.log("No user – showing auth screen");
  }
});

/* =========================
   LOGIN FUNCTION
========================= */
window.login = async function () {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert("Login failed: " + error.message);
    console.error("Login error:", error);
  } else {
    console.log("Login successful");
  }
};

/* =========================
   SIGNUP FUNCTION
========================= */
window.signup = async function () {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm-password").value;

  if (!username || !email || !password || !confirm) {
    alert("Please fill all fields");
    return;
  }
  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert("Sign up failed: " + error.message);
    console.error("Signup error:", error);
  } else {
    alert("Sign up successful! Please log in.");
    toggleLogin(); // Switch back to login after signup
  }
};

/* =========================
   NAVIGATION SYSTEM (UPDATED WITH PERSISTENCE + DEBUG)
========================= */
function setupNavigation() {
  const navItems = document.querySelectorAll("nav li");
  const tabElements = document.querySelectorAll(".tab");

  // Restore saved active tab (prevents reset on reload)
  const savedTab = localStorage.getItem("activeTab") || "home";
  navItems.forEach(item => {
    if (item.dataset.tab === savedTab) item.classList.add("active");
  });
  tabElements.forEach(tab => {
    if (tab.id === savedTab) tab.classList.add("active");
  });

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const tab = item.dataset.tab;
      console.log("Navigation clicked:", tab); // Debug – check console!

      // Remove active from all
      navItems.forEach(i => i.classList.remove("active"));
      tabElements.forEach(t => t.classList.remove("active"));

      // Activate clicked one
      item.classList.add("active");
      const target = document.getElementById(tab);
      if (target) {
        target.classList.add("active");
      } else {
        console.error("Tab element not found for:", tab);
      }

      // Save to localStorage
      localStorage.setItem("activeTab", tab);
    });
  });
}
