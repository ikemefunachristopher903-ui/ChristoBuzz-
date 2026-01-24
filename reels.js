import { supabase } from "./supabase.js";
import { applyFilter, unlockPremiumFilter, PREMIUM_FILTER_NAMES, FILTERS } from "./filters.js";
import { registerView } from "./ad_networks.js";

let selectedFilter = "none";
let previewElement = null;

/* =========================
   CREATE REEL
========================= */
export async function createReel(userId, videoFile, filter = "none") {
  if (!videoFile) return alert("Select a video");

  const { data, error } = await supabase.storage
    .from("reels")
    .upload(`videos/${Date.now()}_${videoFile.name}`, videoFile);

  if (error) return alert(error.message);

  const videoUrl = supabase.storage.from("reels").getPublicUrl(data.path).data.publicUrl;

  const { error: insertError } = await supabase.from("reels").insert({
    user_id: userId,
    video_url: videoUrl,
    filter_name: filter
  });

  if (insertError) return alert(insertError.message);

  alert("Reel uploaded!");
}

/* =========================
   LOAD REELS
========================= */
export async function loadReels(containerId) {
  const { data: reels, error } = await supabase
    .from("reels")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return console.error(error.message);

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  reels.forEach((reel, i) => {
    const div = document.createElement("div");
    div.className = "reel";

    const videoEl = document.createElement("video");
    videoEl.src = reel.video_url;
    videoEl.controls = true;
    videoEl.preload = "none";

    if (reel.filter_name) applyFilter(videoEl, reel.filter_name);

    div.appendChild(videoEl);

    // Download button
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "💾 Download";
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = reel.video_url;
      a.download = reel.video_url.split("/").pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    div.appendChild(downloadBtn);

    container.appendChild(div);

    // Ads: 2 CPM + 1 CPA every 7 reels
    if ((i + 1) % 7 === 0) registerView();
  });
}

/* =========================
   FILTER BAR PREVIEW
========================= */
export function renderFilterBar(userId) {
  const bar = document.getElementById("filterBar");
  if (!bar) return;
  bar.innerHTML = "";

  Object.keys(FILTERS).forEach(filter => {
    const btn = document.createElement("button");
    btn.textContent = filter;
    btn.className = "filter-btn";

    btn.onclick = async () => {
      if (PREMIUM_FILTER_NAMES.includes(filter)) {
        const ok = await unlockPremiumFilter(userId, filter);
        if (!ok) return;
      }
      selectedFilter = filter;
      if (previewElement) applyFilter(previewElement, FILTERS[filter]);
    };

    bar.appendChild(btn);
  });
                                      }
