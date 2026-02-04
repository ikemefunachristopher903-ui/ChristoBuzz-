import { DEMO_MODE } from "./config.js";
import { loadDemoData } from "./demoData/demoLoader.js";

export let DEMO_DATA = {
  users: [],
  posts: [],
  products: []
};

export async function initDemo() {
  if (!DEMO_MODE) return;

  try {
    const data = await loadDemoData();
    DEMO_DATA.users = data.users;
    DEMO_DATA.posts = data.posts;
    DEMO_DATA.products = data.products;

    console.log("✅ Demo mode active");
    console.log("Users:", DEMO_DATA.users.length);
    console.log("Posts:", DEMO_DATA.posts.length);
    console.log("Products:", DEMO_DATA.products.length);
  } catch (err) {
    console.error("❌ Demo load failed", err);
  }
}
