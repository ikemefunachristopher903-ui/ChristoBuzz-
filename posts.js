// post.js
import { supabase } from "./supabase.js";

/* =========================
   CREATE POST
========================= */
export async function createPost() {
  const textarea = document.getElementById("postText");
  if (!textarea || !textarea.value.trim()) return;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Login required");
    return;
  }

  await supabase.from("posts").insert({
    content: textarea.value,
    user_id: user.id
  });

  textarea.value = "";
  loadPosts();
}

/* =========================
   LOAD POSTS
========================= */
export async function loadPosts(containerId = "posts") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  container.innerHTML = "";

  posts.forEach(post => {
    const el = document.createElement("div");
    el.className = "post";

    el.innerHTML = `
      <div class="post-header">
        <strong>User</strong>
        <span>${new Date(post.created_at).toLocaleString()}</span>
      </div>

      <div class="post-content">${post.content}</div>

      <div class="post-actions">
        <button onclick="likePost('${post.id}')">👍 ${post.likes}</button>
      </div>
    `;

    container.appendChild(el);
  });
}

/* =========================
   LIKE POST
========================= */
window.likePost = async function (postId) {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Login required");
    return;
  }

  await supabase.rpc("increment_likes", { post_id: postId });
  loadPosts();
};
