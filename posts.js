import { supabase } from "./supabase.js";

// Load posts
export async function loadPosts() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`id, content, user_id, likes, created_at`)
    .order("created_at", { ascending: false });

  if (error) return alert(error.message);

  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerHTML = `
      <p>${post.content}</p>
      <div class="post-footer">
        <span>Likes: <strong id="likes-${post.id}">${post.likes}</strong></span>
        <button id="like-${post.id}">👍 Like</button>
      </div>
    `;

    postsDiv.appendChild(div);

    // Like button
    document
      .getElementById(`like-${post.id}`)
      .addEventListener("click", () => likePost(post.id));
  });
}

// Create a new post
export async function createPost() {
  const content = document.getElementById("postText").value;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return alert("Login required");

  const { error } = await supabase.from("posts").insert({
    content,
    user_id: user.id,
  });

  if (error) return alert(error.message);

  document.getElementById("postText").value = "";
  loadPosts();
}

// Like a post
async function likePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required");

  // Add like to likes table
  const { error } = await supabase.from("likes").insert({
    post_id: postId,
    user_id: user.id,
  });

  if (error) return alert(error.message);

  // Increment likes counter
  await supabase.rpc("increment_likes", { post_id: postId });

  // Update UI
  const likesSpan = document.getElementById(`likes-${postId}`);
  likesSpan.textContent = parseInt(likesSpan.textContent) + 1;
}
