// ai.js

import { supabase } from "./supabase.js";

/* =========================
   AI UTILITIES
========================= */

/**
 * Generate a simple AI suggestion for a post
 * @param {string} content - Post content
 * @returns {Promise<string>} - Suggested caption
 */
export async function generateCaption(content) {
  // Placeholder AI logic
  // In real app, you could call an AI API (OpenAI, etc.)
  const suggestion = `🔥 Check this out: ${content.slice(0, 50)}...`;
  return suggestion;
}

/**
 * Suggest hashtags based on post content
 * @param {string} content
 * @returns {string[]} - Array of suggested hashtags
 */
export function suggestHashtags(content) {
  const words = content.split(" ");
  const hashtags = words
    .filter(word => word.length > 3)
    .slice(0, 5)
    .map(word => `#${word.replace(/\W/g, "")}`);
  return hashtags;
}

/**
 * Recommend posts for a user based on simple AI logic
 * @param {string} userId
 * @returns {Promise<Array>} - Recommended posts
 */
export async function recommendPosts(userId) {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("likes", { ascending: false }) // Recommend popular posts
    .limit(5);

  return data || [];
}

/**
 * Content moderation check
 * @param {string} content
 * @returns {boolean} - True if content is safe
 */
export function moderateContent(content) {
  const bannedWords = ["badword1", "badword2"];
  const lower = content.toLowerCase();
  return !bannedWords.some(word => lower.includes(word));
      }
