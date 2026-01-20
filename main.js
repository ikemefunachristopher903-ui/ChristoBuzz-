import { supabase } from "./supabase.js";
import { createPost, loadPosts } from "./post.js";

/* =========================
   AUTH STATE
========================= */
const authScreen = document.getElementById("auth-screen");
const app = document.getElementById("app");
const logoutBtn = document.getElementById("logoutBtn");
const themeToggle = document.getElementById("themeToggle");

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    authScreen.classList.add("hidden");
    app.classList.remove("hidden");
    loadPosts("posts");
  } else {
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

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
};

/* =========================
   SIGN UP
========================= */
window.signup = async function () {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Account created! Check your email to confirm.");
};

/* =========================
   LOGOUT
========================= */
window.logout = async function () {
  await supabase.auth.signOut();
};

/* =========================
   CREATE POST
========================= */
document.getElementById("postBtn").addEventListener("click", async () => {
  const text = document.getElementById("postText").value;
  const imageInput = document.getElementById("postImage");
  const videoInput = document.getElementById("postVideo");

  let mediaUrl = null;
  let mediaType = null;

  if (imageInput.files.length > 0) {
    const file = imageInput.files[0];
    mediaType = "image";
    const { data, error } = await supabase.storage.from("posts").upload(`images/${Date.now()}_${file.name}`, file);
    if (error) return alert(error.message);
    mediaUrl = supabase.storage.from("posts").getPublicUrl(data.path).data.publicUrl;
  }

  if (videoInput.files.length > 0) {
    const file = videoInput.files[0];
    mediaType = "video";
    const { data, error } = await supabase.storage.from("posts").upload(`videos/${Date.now()}_${file.name}`, file);
    if (error) return alert(error.message);
    mediaUrl = supabase.storage.from("posts").getPublicUrl(data.path).data.publicUrl;
  }

  await createPost(text, mediaUrl, mediaType);

  // Reset
  document.getElementById("postText").value = "";
  imageInput.value = "";
  videoInput.value = "";
});

/* =========================
   LIGHT / DARK THEME
========================= */
themeToggle.onclick = () => {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
};

/* =========================
   NAVIGATION PLACEHOLDERS
========================= */
document.getElementById("nav-feed").onclick = () => alert("Feed clicked!");
document.getElementById("nav-follow").onclick = () => alert("Follow suggestions clicked!");
document.getElementById("nav-post").onclick = () => document.getElementById("create-post-section").scrollIntoView();
document.getElementById("nav-notifications").onclick = () => alert("Notifications clicked!");
document.getElementById("nav-profile").onclick = () => alert("Profile clicked!");

document.getElementById("bottom-feed").onclick = () => alert("Bottom Feed clicked!");
document.getElementById("bottom-follow").onclick = () => alert("Bottom Friends clicked!");
document.getElementById("bottom-reels").onclick = () => alert("Bottom Reels clicked!");
document.getElementById("bottom-messages").onclick = () => alert("Bottom Messages clicked!");
document.getElementById("bottom-wallet").onclick = () => alert("Bottom Wallet clicked!");
