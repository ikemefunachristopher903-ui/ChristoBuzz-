import { supabase } from "./supabase.js";

/**
 * Load all posts (public – guests allowed)
 */
export async function loadPosts(containerId = "posts") {
  const postsDiv = document.getElementById(containerId);
  if (!postsDiv) return;

  postsDiv.innerHTML = "Loading posts...";

  const { data, error } = await supabase
    .from("posts")
    .select("id, content, created_at, user_id")
    .order("created_at", { ascending: false });

  if (error) {
    postsDiv.innerHTML = "Failed to load posts";
    console.error(error);
    return;
  }

  postsDiv.innerHTML = "";

  if (data.length === 0) {
    postsDiv.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <p>${escapeHTML(post.content)}</p>
      <small>${new Date(post.created_at).toLocaleString()}</small>
    `;
    postsDiv.appendChild(div);
  });
}

/**
 * Create a new post (logged-in users only)
 */
export async function createPost(textareaId = "postText") {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;

  const content = textarea.value.trim();
  if (!content) return alert("Post cannot be empty");

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login or sign up to post");
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
  loadPosts();
}

/**
 * Basic HTML escape (security)
 */
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}
