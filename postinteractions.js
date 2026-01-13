import { supabase } from "./supabase.js";

/* =========================
   LIKE POST
========================= */
export async function likePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required to like posts");

  // Insert like into "likes" table
  const { error } = await supabase.from("likes").insert({
    post_id: postId,
    user_id: user.id
  });

  if (error) alert(error.message);
  else {
    // Call the function to increment likes in posts table
    await supabase.rpc("increment_likes", { post_id: postId });
    console.log("Post liked successfully!");
  }
}

/* =========================
   COMMENT ON POST
========================= */
export async function commentPost(postId, commentText) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required to comment");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    content: commentText
  });

  if (error) alert(error.message);
  else console.log("Comment added successfully!");
}

/* =========================
   SHARE POST
========================= */
export async function sharePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required to share posts");

  // For simplicity, we can just duplicate the post for the user feed
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) return alert(error.message);

  const { error: insertError } = await supabase.from("posts").insert({
    content: post.content,
    user_id: user.id
  });

  if (insertError) alert(insertError.message);
  else console.log("Post shared successfully!");
}
