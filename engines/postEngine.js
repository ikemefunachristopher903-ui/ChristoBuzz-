import { loadDemoData } from "../demoData/demoLoader.js";

let postsCache = null;

export async function getPosts() {
  if (postsCache) return postsCache;

  const { posts } = await loadDemoData();
  postsCache = posts.map(post => ({
    ...post,
    timestamp: new Date(post.timestamp || Date.now())
  }));

  return postsCache;
}

export function getPostsByUser(userId) {
  return postsCache?.filter(p => p.userId === userId) || [];
}

export function getPostsByCategory(category) {
  return postsCache?.filter(p => p.category === category) || [];
}
