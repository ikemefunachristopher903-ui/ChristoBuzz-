import { supabase } from "./supabase.js";

export async function loadReels() {
  const container = document.getElementById("app");
  container.innerHTML += `<div id="reelsContainer" class="reels-container"></div>`;

  const { data: reels, error } = await supabase
    .from("reels")
    .select(`
      id,
      video_url,
      user_id,
      user:user_id(email)
    `)
    .order("created_at", { ascending: false });

  if (error) return console.error(error);

  const reelsContainer = document.getElementById("reelsContainer");
  reelsContainer.innerHTML = "";

  reels.forEach(reel => {
    const reelDiv = document.createElement("div");
    reelDiv.className = "reel-card";
    reelDiv.innerHTML = `
      <video src="${reel.video_url}" controls autoplay muted loop></video>
      <div class="reel-footer">
        <strong>${reel.user.email}</strong>
      </div>
    `;
    reelsContainer.appendChild(reelDiv);
  });
}
