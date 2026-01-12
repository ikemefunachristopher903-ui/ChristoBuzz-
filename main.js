import { supabase } from "./supabase.js";

const app = document.getElementById("app");

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    showAuth();
  } else {
    showFeed(session.user);
  }
}

function showAuth() {
  app.innerHTML = `
    <h1>ChristoBuzz</h1>

    <input id="email" placeholder="Email" />
    <input id="password" type="password" placeholder="Password" />

    <button id="login">Login</button>
    <button id="signup">Sign Up</button>

    <p id="msg"></p>
  `;

  document.getElementById("login").onclick = login;
  document.getElementById("signup").onclick = signup;
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  document.getElementById("msg").textContent =
    error ? error.message : "Logged in";
  checkAuth();
}

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  document.getElementById("msg").textContent =
    error ? error.message : "Account created";
}

function showFeed(user) {
  app.innerHTML = `
    <h2>Welcome ${user.email}</h2>

    <textarea id="postText" placeholder="What's on your mind?"></textarea>
    <button id="postBtn">Post</button>

    <button id="logout">Logout</button>

    <div id="posts"></div>
  `;

  document.getElementById("logout").onclick = logout;
  document.getElementById("postBtn").onclick = createPost;

  loadPosts();
}

async function logout() {
  await supabase.auth.signOut();
  checkAuth();
}

async function createPost() {
  const content = document.getElementById("postText").value;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return alert("Login required");

  const { error } = await supabase.from("posts").insert({
    content,
    user_id: user.id
  });

  if (error) alert(error.message);
  else {
    document.getElementById("postText").value = "";
    loadPosts();
  }
}

async function loadPosts() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  data.forEach(post => {
    const div = document.createElement("div");
    div.textContent = post.content;
    postsDiv.appendChild(div);
  });
}

checkAuth();
