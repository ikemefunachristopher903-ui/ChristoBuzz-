// reels.js
import { supabase } from "./supabase.js";
import { registerView } from "./ad_networks.js"; // AD NETWORKS

export async function loadReels(containerId) {
  const { data } = await supabase
    .from("reels")
    .select("*, profiles:user_id(id, email, username)")
    .order("created_at", { ascending: false });

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  data.forEach(reel => {
    const div = document.createElement("div");
    div.classList.add("reel");

    const userEmail = reel.profiles?.email || "Anonymous";
    div.innerHTML = `
      <div class="reel-header">
        <strong>${userEmail}</strong>
        <span>${new Date(reel.created_at).toLocaleString()}</span>
      </div>
      <video src="${reel.media_url}" controls class="reel-video"></video>
      <div class="reel-actions">
        <button class="like-btn" data-id="${reel.id}">❤️ ${reel.likes || 0}</button>
        <button class="comment-btn" data-id="${reel.id}">💬 Comment</button>
        <button class="share-btn" data-id="${reel.id}">🔗 Share</button>
      </div>
      <div class="comments-container" id="comments-${reel.id}"></div>
    `;

    container.appendChild(div);

    // 🔥 REGISTER VIEW FOR ADS
    registerView();
  });
}
