import { supabase } from "./supabase.js";

// Load stories
export async function loadStories() {
  const { data: stories, error } = await supabase
    .from("stories")
    .select(`id, content, user_id, created_at`)
    .order("created_at", { ascending: false });

  if (error) return alert(error.message);

  const app = document.getElementById("app");
  app.innerHTML = `<h2>Stories</h2><div id="storiesContainer" class="stories"></div>`;
  const storiesDiv = document.getElementById("storiesContainer");

  stories.forEach((story) => {
    const div = document.createElement("div");
    div.className = "story-card";
    div.innerHTML = `
      <p>${story.content}</p>
      <small>By ${story.user_id}</small>
    `;
    storiesDiv.appendChild(div);
  });
}

// Create a story
export async function createStory(content) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required");

  const { error } = await supabase.from("stories").insert({
    content,
    user_id: user.id,
  });

  if (error) return alert(error.message);
  loadStories();
      }
