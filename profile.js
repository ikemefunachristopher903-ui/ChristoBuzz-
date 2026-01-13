import { supabase } from "./supabase.js";

export async function loadProfile() {
  const app = document.getElementById("app");
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    app.innerHTML = "<p>Please log in</p>";
    return;
  }

  app.innerHTML = `
    <h2>Profile</h2>
    <p>Email: ${user.email}</p>
  `;
}
