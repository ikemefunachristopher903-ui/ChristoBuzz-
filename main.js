import { supabase } from "./supabase.js";

const app = document.getElementById("app");

// Check auth on page load
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    showAuth();
  } else {
    showFeed(session.user);
  }
}

// Show login/signup page
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

// Login function
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

// Sign up function (auto login after signup)
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    document.getElementById("msg").textContent = error.message;
    return;
  }

  // Auto-login after signup
  const { error: loginError, data: loginData } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    document.getElementById("msg").textContent = loginError.message;
    return;
  }

  showFeed(loginData.user);
}

// Show main feed
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

// Logout
async function logout() {
  await supabase.auth.signOut();
  checkAuth();
}

// Create a new post
async function createPost() {
  const content = document.getElementById("postText").value;

  const { data: { user } } = await supabase.auth.getUser();

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

// Load all posts
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
