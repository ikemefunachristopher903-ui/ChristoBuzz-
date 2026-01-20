// main.js
import { supabase } from "./supabase.js";

// feature modules
import { initPosts } from "./posts.js";
import { initPostInteractions } from "./postinteractions.js";
import { initFollowSystem } from "./follow.js";
import { initProfile } from "./profile.js";
import { initMessages } from "./messages.js";
import { initNotifications } from "./notifications.js";
import { initStories } from "./stories.js";
import { initReels } from "./reels.js";
import { initWallet } from "./wallet.js";
import { initMarketplace } from "./marketplace.js";
import { initMusic } from "./music.js";
import { initInfluencer } from "./influencer.js";
import { initAdNetwork } from "./adnetwork.js";
import { initAI } from "./ai.js";

// ----------------------------
// AUTH STATE HANDLING
// ----------------------------
async function handleAuth() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    showAuthScreen();
  } else {
    startApp(session.user);
  }
}

// ----------------------------
// APP START
// ----------------------------
function startApp(user) {
  document.body.classList.add("authenticated");

  initPosts(user);
  initPostInteractions(user);
  initFollowSystem(user);
  initProfile(user);
  initMessages(user);
  initNotifications(user);
  initStories(user);
  initReels(user);
  initWallet(user);
  initMarketplace(user);
  initMusic(user);
  initInfluencer(user);
  initAdNetwork(user);
  initAI(user);

  console.log("✅ App started for:", user.id);
}

// ----------------------------
// AUTH UI
// ----------------------------
function showAuthScreen() {
  document.body.classList.remove("authenticated");
  document.body.classList.add("unauthenticated");
}

// ----------------------------
// LOGIN
// ----------------------------
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

// ----------------------------
// SIGNUP
// ----------------------------
window.signup = async function () {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
  }
};

// ----------------------------
// LOGOUT
// ----------------------------
window.logout = async function () {
  await supabase.auth.signOut();
  location.reload();
};

// ----------------------------
// AUTH LISTENER
// ----------------------------
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    startApp(session.user);
  } else {
    showAuthScreen();
  }
});

// ----------------------------
// INIT
// ----------------------------
document.addEventListener("DOMContentLoaded", handleAuth);
