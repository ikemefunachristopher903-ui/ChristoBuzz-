import { supabase } from "./supabase.js";
import { generateCaption, suggestHashtags, moderateContent } from "./ai.js";
import { applyFilter, unlockPremiumFilter, PREMIUM_FILTER_NAMES, FILTERS } from "./filters.js";
import { registerView } from "./ad_networks.js";

const POSTS_PER_PAGE = 7;
let page = 0;
let loading = false;

/* =========================
   CREATE POST
========================= */
export async function createPost(content, mediaUrl = null, mediaType = null, filter = "none") {
  const text = content.trim();
  if (!text && !mediaUrl) return alert("Post cannot be empty");
  if (!moderateContent(text)) return alert("Post contains banned words");

  const caption = await generateCaption(text);
  const hashtags = suggestHashtags(text);

  const finalContent = `${text}\n\n${caption}\n${hashtags.join(" ")}`;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required");

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    content: finalContent,
    media_url: mediaUrl,
    media_type: mediaType,
    filter_name: filter
  });

  if (error) alert(error.message);
  else {
    document.getElementById("postText").value = "";
    loadPosts("posts", true);
  }
}

/* =========================
   LOAD POSTS
========================= */
export async function loadPosts(containerId, reset = false) {
  if (loading) return;
  loading = true;

  const container = document.getElementById(containerId);
  if (reset) {
    container.innerHTML = "";
    page = 0;
  }

  renderSkeletons(container);

  const from = page * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  container.querySelectorAll(".skeleton").forEach(el => el.remove());

  if (!error && posts) {
    posts.forEach((post, i) => {
      renderPost(container, post);

      // Ads: 2 CPM + 1 CPA every 7 posts
      if ((i + 1) % 7 === 0) registerView();
    });
    page++;
  }

  loading = false;
}

/* =========================
   RENDER POST
========================= */
function renderPost(container, post) {
  const div = document.createElement("div");
  div.className = "post";

  let media = "";
  if (post.media_url) {
    if (post.media_type === "image") {
      media = `<img src="${post.media_url}" loading="lazy" style="filter:${post.filter_name || "none"}">`;
    } else if (post.media_type === "video") {
      media = `<video src="${post.media_url}" controls preload="none" style="filter:${post.filter_name || "none"}"></video>`;
    }
  }

  div.innerHTML = `
    <div class="post-content">${post.content}</div>
    ${media}
    <div class="post-actions">
      <button class="like-btn">❤️</button>
      <button class="comment-btn">💬</button>
      <button class="share-btn">🔗</button>
      <button class="save-btn" data-url="${post.media_url}">💾 Download</button>
    </div>
  `;

  container.appendChild(div);

  // Apply saved filter
  if (post.filter_name && post.media_type) {
    const element = div.querySelector(post.media_type);
    if (element) applyFilter(element, post.filter_name);
  }

  // Download media
  div.querySelector(".save-btn")?.addEventListener("click", (e) => {
    const url = e.target.dataset.url;
    if (!url) return alert("No media to download");
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

/* =========================
   SKELETON UI
========================= */
function renderSkeletons(container) {
  for (let i = 0; i < 3; i++) {
    const sk = document.createElement("div");
    sk.className = "skeleton";
    container.appendChild(sk);
  }
}

/* =========================
   SCROLL LOAD
========================= */
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    loadPosts("posts");
  }
});
