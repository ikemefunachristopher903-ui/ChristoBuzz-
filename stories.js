// stories.js
import { supabase } from "./supabase.js";

/* =========================
   LOAD STORIES
========================= */
export async function loadStories(containerId = "stories") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  container.innerHTML = "";

  stories.forEach(story => {
    const el = document.createElement("div");
    el.className = "story-circle";

    el.innerHTML = `
      <img src="${story.media_url}" />
    `;

    el.onclick = () => openStory(story.media_url);
    container.appendChild(el);
  });
}

/* =========================
   VIEW STORY (FULLSCREEN)
========================= */
function openStory(url) {
  const overlay = document.createElement("div");
  overlay.className = "story-overlay";

  overlay.innerHTML = `
    <img src="${url}" />
  `;

  overlay.onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}
