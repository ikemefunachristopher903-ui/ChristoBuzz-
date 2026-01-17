// post.js
import { supabase } from "./supabase.js";
import { generateCaption, suggestHashtags, moderateContent } from "./ai.js";

/* =========================
   CREATE POST (TEXT, IMAGE, VIDEO)
========================= */
export async function createPost(content, mediaUrl = null, mediaType = null) {
  const trimmedContent = content.trim();
  if (!trimmedContent && !mediaUrl) return alert("Post cannot be empty");

  // AI moderation
  if (!moderateContent(trimmedContent)) return alert("Your post contains banned words");

  // AI caption & hashtags
  const aiCaption = await generateCaption(trimmedContent);
  const hashtags = suggestHashtags(trimmedContent);

  const finalContent = `${trimmedContent}\n\n${aiCaption}\n${hashtags.join(" ")}`;

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required");

  const { error } = await supabase.from("posts").insert({
    content: finalContent,
    media_url: mediaUrl,
    media_type: mediaType,
    user_id: user.id
  });

  if (error) alert(error.message);
  else {
    document.getElementById("postText").value = "";
    loadPosts("posts");
  }
}

/* =========================
   LOAD POSTS
========================= */
export async function loadPosts(containerId) {
  const { data } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:user_id(id, email, username)
    `)
    .order("created_at", { ascending: false });

  const postsDiv = document.getElementById(containerId);
  postsDiv.innerHTML = "";

  data.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("post");

    // User info
    const userEmail = post.profiles?.email || "Anonymous";
    div.innerHTML = `
      <div class="post-header">
        <strong>${userEmail}</strong>
        <span>${new Date(post.created_at).toLocaleString()}</span>
      </div>
      <div class="post-content">
        <p>${post.content}</p>
        ${post.media_url ? (post.media_type === "image" 
          ? `<img src="${post.media_url}" alt="post image" class="post-media"/>` 
          : `<video src="${post.media_url}" controls class="post-media"></video>`) 
        : ""}
      </div>
      <div class="post-actions">
        <button class="like-btn" data-id="${post.id}">❤️ ${post.likes || 0}</button>
        <button class="comment-btn" data-id="${post.id}">💬 Comment</button>
        <button class="share-btn" data-id="${post.id}">🔗 Share</button>
        <button class="save-btn" data-id="${post.id}">💾 Save</button>
      </div>
      <div class="comments-container" id="comments-${post.id}"></div>
    `;

    postsDiv.appendChild(div);

    // Attach event listeners
    div.querySelector(".like-btn").onclick = () => likePost(post.id);
    div.querySelector(".comment-btn").onclick = () => promptComment(post.id);
    div.querySelector(".share-btn").onclick = () => sharePost(post.id);
    div.querySelector(".save-btn").onclick = () => savePost(post.id);

    loadComments(post.id);
  });
}

/* =========================
   LIKE POST
========================= */
export async function likePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required");

  const { error } = await supabase.rpc("increment_likes", { post_id: postId });
  if (error) alert(error.message);
  else loadPosts("posts");
}

/* =========================
   COMMENT POST
========================= */
export async function promptComment(postId) {
  const comment = prompt("Write your comment:");
  if (!comment) return;
  await commentPost(postId, comment);
}

export async function commentPost(postId, content) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    content
  });

  if (error) alert(error.message);
  else loadComments(postId);
}

/* =========================
   LOAD COMMENTS
========================= */
export async function loadComments(postId) {
  const { data } = await supabase
    .from("comments")
    .select("*, profiles:user_id(id, email, username)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  const container = document.getElementById(`comments-${postId}`);
  container.innerHTML = "";

  data.forEach(comment => {
    const div = document.createElement("div");
    div.classList.add("comment");
    const userEmail = comment.profiles?.email || "Anonymous";
    div.innerHTML = `<strong>${userEmail}:</strong> ${comment.content}`;
    container.appendChild(div);
  });
}

/* =========================
   SHARE POST
========================= */
export function sharePost(postId) {
  const url = `${window.location.origin}/?post=${postId}`;
  navigator.clipboard.writeText(url);
  alert("Post link copied to clipboard!");
}

/* =========================
   SAVE POST
========================= */
export async function savePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required");

  const { error } = await supabase.from("saved_posts").insert({
    post_id: postId,
    user_id: user.id
  });

  if (error) alert(error.message);
  else alert("Post saved!");
}
