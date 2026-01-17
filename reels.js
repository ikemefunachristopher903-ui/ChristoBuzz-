// reels.js
import { supabase } from "./supabase.js";

const reelsContainerId = "app"; // will append to main app container

export async function loadReels() {
  const { data } = await supabase
    .from("reels")
    .select("*")
    .order("created_at", { ascending: false });

  const app = document.getElementById(reelsContainerId);
  app.innerHTML = ""; // clear container

  // If no reels
  if (!data || data.length === 0) {
    app.innerHTML = "<p>No reels yet</p>";
    return;
  }

  let currentIndex = 0;

  function showReel(index) {
    const reel = data[index];
    app.innerHTML = `
      <div class="reel-container">
        <video id="reelVideo" src="${reel.media_url}" autoplay loop muted playsinline></video>
        <div class="reel-info">
          <strong>${reel.user_name || "Anonymous"}</strong>
          <p>${reel.caption || ""}</p>
        </div>
      </div>
    `;

    const video = document.getElementById("reelVideo");
    video.play();

    // Swipe gestures
    let startY = 0;
    video.addEventListener("touchstart", (e) => { startY = e.touches[0].clientY; });
    video.addEventListener("touchend", (e) => {
      const endY = e.changedTouches[0].clientY;
      if (startY - endY > 50) nextReel(); // swipe up
      if (endY - startY > 50) prevReel(); // swipe down
    });
  }

  function nextReel() {
    currentIndex = (currentIndex + 1) % data.length;
    showReel(currentIndex);
  }

  function prevReel() {
    currentIndex = (currentIndex - 1 + data.length) % data.length;
    showReel(currentIndex);
  }

  showReel(currentIndex);
}

// Optional: call automatically when switching to Reels tab
export function initReels() {
  loadReels();
}
