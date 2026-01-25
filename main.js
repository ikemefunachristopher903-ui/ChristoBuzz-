// main.js
import { supabase } from "./supabase.js";
import { createPost, loadPosts } from "./post.js";
import { loadReels } from "./reels.js";
import { applyFilter, unlockPremiumFilter } from "./filters.js";
import { registerView } from "./adnetwork.js";
import { followUser, getFriendSuggestions } from "./follow.js";
import { loadMessages } from "./messages.js";
import { showNotifications } from "./notifications.js";
import { loadProfile } from "./profile.js";
import { loadMarketplace } from "./marketplace.js";
import { loadMusic } from "./music.js";
import { initWallet } from "./wallet.js";
import { demoUsersInit } from "./demo.js"; // Demo accounts
import { showPolicyModal } from "./policy.js"; // Policy modal

/* =========================
   APP STATE
========================= */
let currentUser = null;
let selectedFilter = "none";
let previewElement = null;
const tabs = ["home", "reels", "music", "marketplace", "create", "notifications", "profile"];

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
    initializeApp();
  } else {
    currentUser = null;
    authScreen.classList.remove("hidden");
    app.classList.add("hidden");
    showDemoContent();
  }
});

/* =========================
   LOGIN
========================= */
window.login = async function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  currentUser = data.user;
  initializeApp();
};

/* =========================
   SIGN UP
========================= */
window.signup = async function () {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  if (password !== confirmPassword) return alert("Passwords do not match.");

  // Show policy modal before signing up
  const agreed = await showPolicyModal();
  if (!agreed) return alert("You must agree to the app policy to sign up.");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });

  if (error) return alert(error.message);
  alert("Account created! Check your email for confirmation.");
};

/* =========================
   LOGOUT
========================= */
window.logout = async function () {
  await supabase.auth.signOut();
  currentUser = null;
  showDemoContent();
};

/* =========================
   INITIALIZE APP
========================= */
function initializeApp() {
  renderTabs();
  loadPosts("posts", currentUser);
  loadReels(currentUser);
  loadMusic(currentUser);
  loadMarketplace(currentUser);
  loadProfile(currentUser);
  showNotifications(currentUser);
  initWallet(currentUser);
  getFriendSuggestions(currentUser);
}

/* =========================
   DEMO CONTENT
========================= */
function showDemoContent() {
  demoUsersInit(); // Loads demo accounts
  loadReels(null, true); // Demo Reels
  loadProfile(null, true); // Demo profile
}

/* =========================
   TAB NAVIGATION
========================= */
function renderTabs() {
  tabs.forEach(tab => {
    const btn = document.getElementById(`nav-${tab}`);
    if (!btn) return;
    btn.onclick = () => switchTab(tab);
  });
}

function switchTab(tab) {
  tabs.forEach(t => document.getElementById(`section-${t}`)?.classList.add("hidden"));
  const section = document.getElementById(`section-${tab}`);
  if (section) section.classList.remove("hidden");

  // Optional: refresh content
  if (tab === "home") loadPosts("posts", currentUser);
  if (tab === "reels") loadReels(currentUser);
  if (tab === "music") loadMusic(currentUser);
  if (tab === "marketplace") loadMarketplace(currentUser);
  if (tab === "profile") loadProfile(currentUser);
}

/* =========================
   CREATE POST
========================= */
document.getElementById("postBtn")?.addEventListener("click", async () => {
  const text = document.getElementById("postText").value;
  const imageInput = document.getElementById("postImage");
  const videoInput = document.getElementById("postVideo");
  const musicInput = document.getElementById("postMusic");

  let mediaUrl = null;
  let mediaType = null;

  if (imageInput?.files.length > 0) {
    const file = imageInput.files[0];
    mediaType = "image";
    const { data, error } = await supabase.storage.from("posts").upload(`images/${Date.now()}_${file.name}`, file);
    if (error) return alert(error.message);
    mediaUrl = supabase.storage.from("posts").getPublicUrl(data.path).data.publicUrl;
  }

  if (videoInput?.files.length > 0) {
    const file = videoInput.files[0];
    mediaType = "video";
    const { data, error } = await supabase.storage.from("posts").upload(`videos/${Date.now()}_${file.name}`, file);
    if (error) return alert(error.message);
    mediaUrl = supabase.storage.from("posts").getPublicUrl(data.path).data.publicUrl;
  }

  if (musicInput?.files.length > 0) {
    const file = musicInput.files[0];
    mediaType = "music";
    const { data, error } = await supabase.storage.from("posts").upload(`music/${Date.now()}_${file.name}`, file);
    if (error) return alert(error.message);
    mediaUrl = supabase.storage.from("posts").getPublicUrl(data.path).data.publicUrl;
  }

  await createPost(text, mediaUrl, mediaType, currentUser);

  // Reset inputs
  document.getElementById("postText").value = "";
  if (imageInput) imageInput.value = "";
  if (videoInput) videoInput.value = "";
  if (musicInput) musicInput.value = "";
});

/* =========================
   FILTER PREVIEW
========================= */
export function setPreviewElement(element) {
  previewElement = element;
}

export function applySelectedFilter(filterName) {
  selectedFilter = filterName;
  if (previewElement) applyFilter(previewElement, filterName);
              }
