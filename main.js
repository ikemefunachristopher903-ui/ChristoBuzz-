import { supabase } from "./supabase.js";
import { loadPosts, createPost } from "./post.js";

const app = document.getElementById("app");

/* =========================
   AUTH CHECK (ON LOAD)
========================= */
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    showAuth();
  } else {
    showFeed(session.user);
  }
}

/* =========================
   AUTH PAGE
========================= */
function showAuth() {
  app.innerHTML = `
    <h1>ChristoBuzz</h1>

    <input id="email" type="email" placeholder="Email" />
    <input id="password" type="password" placeholder="Password" />

    <button id="loginBtn">Login</button>
    <button id="signupBtn">Sign Up</button>

    <p id="msg"></p>
  `;

  document.getElementById("loginBtn").onclick = login;
  document.getElementById("signupBtn").onclick = signup;
}

/* =========================
   LOGIN
========================= */
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  document.getElementById("msg").textContent =
    error ? error.message : "Logged in";

  if (!error && data.session) {
    showFeed(data.user);
  }
}

/* =========================
   SIGN UP
========================= */
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    document.getElementById("msg").textContent = error.message;
    return;
  }

  document.getElementById("msg").textContent =
    "Account created. Check your email to confirm.";
}

/* =========================
   MAIN FEED
========================= */
function showFeed(user) {
  document.getElementById("bottomNav").classList.remove("hidden");

  app.innerHTML = `
    <div class="feed-header">ChristoBuzz</div>

    <div class="post-box">
      <textarea id="postText" placeholder="What's on your mind?"></textarea>
      <button id="postBtn">Post</button>
    </div>

    <div id="posts"></div>
  `;

  document.getElementById("postBtn").onclick = createPost;
  loadPosts("posts");
}

/* =========================
   LOGOUT
========================= */
async function logout() {
  await supabase.auth.signOut();
  showAuth();
}

/* =========================
   START APP
========================= */
checkAuth();
