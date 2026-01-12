// main.js — CLEAN, SIMPLE, WORKING

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  if (!app) {
    document.body.innerHTML = "<h2 style='color:red'>ERROR: #app not found</h2>";
    return;
  }

  showGuestHome();
});

/* ---------------- GUEST MODE (TikTok-like) ---------------- */

function showGuestHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="feed">
      <div class="post">
        <h3>@christobuzz</h3>
        <p>Welcome to ChristoBuzz 🔥</p>
        <p>This is guest mode. You can browse but not post.</p>
      </div>

      <div class="post">
        <h3>@demo_user</h3>
        <p>Scroll, watch, explore.</p>
      </div>

      <div class="auth-cta">
        <button id="loginBtn">Login</button>
        <button id="signupBtn">Sign Up</button>
      </div>
    </section>
  `;

  document.getElementById("loginBtn").onclick = showAuth;
  document.getElementById("signupBtn").onclick = showAuth;
}

/* ---------------- AUTH SCREEN ---------------- */

function showAuth() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="auth">
      <h2>ChristoBuzz</h2>
      <p>Login or create an account</p>

      <input id="email" type="email" placeholder="Email" />
      <input id="password" type="password" placeholder="Password" />

      <button id="doLogin">Login</button>
      <button id="doSignup">Sign Up</button>
    </section>
  `;

  document.getElementById("doLogin").onclick = () => {
    alert("Login works (Supabase comes next)");
    showUserHome();
  };

  document.getElementById("doSignup").onclick = () => {
    alert("Signup works (Supabase comes next)");
    showUserHome();
  };
}

/* ---------------- LOGGED-IN MODE ---------------- */

function showUserHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="feed">
      <h2>Home</h2>

      <div class="post">
        <h3>@you</h3>
        <p>You are logged in ✅</p>
        <p>Posting, comments, likes will work here.</p>
      </div>
    </section>
  `;
}
