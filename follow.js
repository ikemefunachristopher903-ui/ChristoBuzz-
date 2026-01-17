import { supabase } from "./supabase.js";

/* ======================
   FOLLOW USER
====================== */
export async function followUser(userIdToFollow) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required");

  const { error } = await supabase.from("follows").insert({
    follower_id: user.id,
    following_id: userIdToFollow
  });

  if (error) alert(error.message);
}

/* ======================
   UNFOLLOW USER
====================== */
export async function unfollowUser(userIdToUnfollow) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Login required");

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", userIdToUnfollow);

  if (error) alert(error.message);
}

/* ======================
   CHECK FOLLOW STATUS
====================== */
export async function getFollowStatus(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { following: false, followedBy: false };

  const { data: following } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .single();

  const { data: followedBy } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", targetUserId)
    .eq("following_id", user.id)
    .single();

  return {
    following: !!following,
    followedBy: !!followedBy,
    friends: !!following && !!followedBy
  };
                   }
