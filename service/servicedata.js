import { appState } from "../state/appState.js";
import { loadDemoData } from "../demoData/demoLoader.js";

let cache = null;

export async function getData() {
  if (cache) return cache;

  if (appState.mode === "demo") {
    cache = await loadDemoData();
    return cache;
  }

  // 🔒 real APIs later
  throw new Error("Real API not connected yet");
}
