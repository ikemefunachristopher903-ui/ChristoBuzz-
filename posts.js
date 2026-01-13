import { supabase } from "./supabase.js";
import { likePost, commentPost, sharePost } from "./postInteractions.js";

/* =========================
   CREATE NEW POST
========================= */
export async function createPost() {
  const postInput = document.getElementById("postText");
  const content = postInput.value.trim();

  if (!content) return alert("Post cannot be empty");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required to post");

  const { error } = await supabase.from("posts").insert({
    content,
    user_id: user.id
  });

  if (error) alert(error.message);
  else {
    postInput.value = "";
    loadPosts();
  }
}

/* =========================
   LOAD POSTS
========================= */
export async function loadPosts(containerId = "posts") {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*, user_id(id, email), likes")
    .order("created_at", { ascending: false });

  if (error) return console.error(error);

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    // Post content
    const content = document.createElement("p");
    content.textContent = post.content;
    postDiv.appendChild(content);

    // Post actions: like, comment, share
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "post-actions";

    const likeBtn = document.createElement("button");
    likeBtn.textContent = `👍 Like (${post.likes || 0})`;
    likeBtn.onclick = () => likePost(post.id).then(loadPosts);

    const commentBtn = document.createElement("button");
    commentBtn.textContent = "💬 Comment";
    commentBtn.onclick = () => {
      const commentText = prompt("Write your comment:");
      if (commentText) commentPost(post.id, commentText);
    };

    const shareBtn = document.createElement("button");
    shareBtn.textContent = "🔗 Share";
    shareBtn.onclick = () => sharePost(post.id).then(loadPosts);

    actionsDiv.appendChild(likeBtn);
    actionsDiv.appendChild(commentBtn);
    actionsDiv.appendChild(shareBtn);

    postDiv.appendChild(actionsDiv);

    container.appendChild(postDiv);
  });
}
