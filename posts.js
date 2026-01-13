import { supabase } from "./supabase.js";

export async function loadPosts(containerId = "posts") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = "<p>Error loading posts</p>";
    return;
  }

  container.innerHTML = "";
  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `<p>${post.content}</p>`;
    container.appendChild(div);
  });
}

export async function createPost() {
  const textarea = document.getElementById("postText");
  if (!textarea) return;

  const content = textarea.value.trim();
  if (!content) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required");

  const { error } = await supabase.from("posts").insert({
    content,
    user_id: user.id
  });

  if (!error) {
    textarea.value = "";
    loadPosts();
  }
}
