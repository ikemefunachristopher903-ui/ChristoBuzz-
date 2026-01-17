// stories.js
import { supabase } from "./supabase.js";

/* =========================
   CREATE STORY (IMAGE OR VIDEO)
========================= */
export async function createStory(mediaUrl, mediaType) {
  if (!mediaUrl || !mediaType) return alert("Story must have media");

  // Get current logged-in user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required");

  // Insert story into Supabase
  const { error } = await supabase.from("stories").insert({
    user_id: user.id,
    media_url: mediaUrl,
    media_type: mediaType,
    created_at: new Date()
  });

  if (error) alert(error.message);
}

/* =========================
   LOAD STORIES
========================= */
export async function loadStories(containerId) {
  // Only fetch stories created in the last 24 hours
  const { data } = await supabase
    .from("stories")
    .select(`
      *,
      profiles:user_id(id, email, username)
    `)
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000)) // 24h
    .order("created_at", { ascending: false });

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  data.forEach(story => {
    const div = document.createElement("div");
    div.classList.add("story");

    const userEmail = story.profiles?.email || "Anonymous";

    div.innerHTML = `
      <div class="story-header"><strong>${userEmail}</strong></div>
      ${story.media_type === "image" 
        ? `<img src="${story.media_url}" class="story-media" />`
        : `<video src="${story.media_url}" class="story-media" controls autoplay loop muted></video>`}
    `;

    container.appendChild(div);
  });
}

/* =========================
   DELETE EXPIRED STORIES
========================= */
export async function cleanupStories() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from("stories")
    .delete()
    .lt("created_at", twentyFourHoursAgo);

  if (error) console.error("Failed to delete old stories:", error.message);
}

/* =========================
   AUTO CLEANUP EVERY HOUR
========================= */
setInterval(cleanupStories, 60 * 60 * 1000); // run every hour
