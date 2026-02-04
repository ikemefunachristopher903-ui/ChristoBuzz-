import { loadDemoData } from "../demoData/demoLoader.js";

let reelsCache = null;

export async function getReels() {
  if (reelsCache) return reelsCache;

  const { posts } = await loadDemoData();
  reelsCache = posts.filter(p => p.type === "video");
  return reelsCache;
}
