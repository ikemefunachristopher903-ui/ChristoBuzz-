import { supabase } from "./supabase.js";
import { loadPosts } from "./post.js";

export async function loadProfile(app) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    app.innerHTML = "<p>Please login to view profile.</p>";
    return;
  }

  app.innerHTML = `
    <h2>${user.email}'s Profile</h2>
    <button id="editProfile">Edit Profile</button>
    <button id="logout">Logout</button>
    <div id="userPosts"></div>
  `;

  document.getElementById("logout").onclick = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  document.getElementById("editProfile").onclick = () => {
    const newName = prompt("Enter new username:");
    if (newName) alert("Username changed to " + newName + " (mock, implement DB later)");
  };

  loadPosts("userPosts", user.id); // Show only user's posts
}
