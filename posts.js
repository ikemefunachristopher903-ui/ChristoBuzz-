// posts.js
import { supabase } from "./supabase.js";

export async function loadPosts(container) {
  container.innerHTML = `
    <div class="post-create" id="postCreate" style="display:none">
      <textarea id="postContent" placeholder="What's on your mind?"></textarea>
      <button id="postBtn">Post</button>
    </div>
    <div id="postsFeed"></div>
  `;

  const { data: { user } } = await supabase.auth.getUser();

  // Show post box only if logged in
  if (user) {
    document.getElementById("postCreate").style.display = "block";

    document.getElementById("postBtn").onclick = async () => {
      const content = document.getElementById("postContent").value.trim();
      if (!content) return alert("Post cannot be empty");

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content
      });

      if (error) {
        alert(error.message);
      } else {
        document.getElementById("postContent").value = "";
        fetchPosts();
      }
    };
  }

  fetchPosts();

  async function fetchPosts() {
    const feed = document.getElementById("postsFeed");
    feed.innerHTML = "<p style='padding:12px'>Loading...</p>";

    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        created_at,
        profiles(username)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      feed.innerHTML = "<p>Error loading posts</p>";
      return;
    }

    feed.innerHTML = "";

    data.forEach(post => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <strong>${post.profiles?.username || "User"}</strong>
        <p>${post.content}</p>
        <small>${new Date(post.created_at).toLocaleString()}</small>
      `;
      feed.appendChild(div);
    });
  }
}
