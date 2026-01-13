import { supabase } from "./supabase.js";

/* ===========================
   LOAD POSTS
=========================== */
export async function loadPosts(containerId = "posts") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "Loading posts...";

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      created_at,
      user_id,
      post_likes ( user_id )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    container.innerHTML = "Failed to load posts";
    return;
  }

  container.innerHTML = "";

  if (!data.length) {
    container.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  const { data: auth } = await supabase.auth.getUser();
  const currentUser = auth?.user?.id;

  data.forEach(post => {
    const liked = post.post_likes.some(like => like.user_id === currentUser);

    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p>${escapeHTML(post.content)}</p>

      <div class="post-actions">
        <button data-id="${post.id}" class="like-btn">
          ${liked ? "❤️" : "🤍"} ${post.post_likes.length}
        </button>
      </div>

      <small>${new Date(post.created_at).toLocaleString()}</small>
    `;

    container.appendChild(div);
  });

  attachLikeHandlers();
}

/* ===========================
   CREATE POST
=========================== */
export async function createPost(textareaId = "postText") {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;

  const content = textarea.value.trim();
  if (!content) return alert("Post cannot be empty");

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return alert("Login required");

  const { error } = await supabase.from("posts").insert({
    content,
    user_id: auth.user.id
  });

  if (error) {
    alert(error.message);
    return;
  }

  textarea.value = "";
  loadPosts();
}

/* ===========================
   LIKE / UNLIKE
=========================== */
function attachLikeHandlers() {
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.onclick = async () => {
      const postId = btn.dataset.id;

      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        alert("Login to like posts");
        return;
      }

      const { data: existing } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", auth.user.id)
        .single();

      if (existing) {
        await supabase
          .from("post_likes")
          .delete()
          .eq("id", existing.id);
      } else {
        await supabase.from("post_likes").insert({
          post_id: postId,
          user_id: auth.user.id
        });
      }

      loadPosts();
    };
  });
}

/* ===========================
   SECURITY
=========================== */
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}
