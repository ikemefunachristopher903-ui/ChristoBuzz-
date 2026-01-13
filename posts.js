
import { supabase } from "./supabase.js";

/* =========================
   LOAD POSTS
========================= */
export async function loadPosts(containerId = "posts") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "<p>Loading posts...</p>";

  const { data, error } = await supabase
    .from("posts")
    .select("id, content, created_at, user_id")
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = "<p>Error loading posts</p>";
    return;
  }

  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No posts yet</p>";
    return;
  }

  data.forEach(post => {
    const postEl = document.createElement("div");
    postEl.className = "post";

    postEl.innerHTML = `
      <p>${escapeHTML(post.content)}</p>
      <small>${new Date(post.created_at).toLocaleString()}</small>
    `;

    container.appendChild(postEl);
  });
}

/* =========================
   CREATE POST
========================= */
export async function createPost() {
  const textarea = document.getElementById("postText");
  if (!textarea) return;

  const content = textarea.value.trim();
  if (!content) return alert("Post cannot be empty");

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert("You must be logged in to post");
    return;
  }

  const { error } = await supabase.from("posts").insert({
    content,
    user_id: user.id
  });

  if (error) {
    alert(error.message);
    return;
  }

  textarea.value = "";
  loadPosts("posts");
}

/* =========================
   BASIC XSS PROTECTION
========================= */
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
