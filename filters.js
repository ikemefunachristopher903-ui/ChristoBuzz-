// filters.js
import { supabase } from "./supabase.js";
import { registerView } from "./ad_networks.js";

/* =========================
   FILTER DEFINITIONS (50)
========================= */

export const FILTERS = {
  // ===== FREE FILTERS =====
  none: "none",
  bright: "brightness(1.2)",
  dark: "brightness(0.8)",
  contrast: "contrast(1.3)",
  grayscale: "grayscale(1)",

  sepia: "sepia(1)",
  warm: "sepia(0.4) saturate(1.4)",
  cool: "hue-rotate(180deg)",
  faded: "opacity(0.85)",
  soft: "blur(0.5px)",

  bwSoft: "grayscale(1) brightness(1.1)",
  bwHard: "grayscale(1) contrast(1.4)",
  vintage: "sepia(0.6) contrast(1.2)",
  retro: "sepia(0.4) contrast(1.3)",
  vivid: "saturate(1.8)",

  dreamy: "blur(1px) brightness(1.15)",
  neon: "saturate(2)",
  ghost: "opacity(0.6)",
  invert: "invert(1)",
  pixel: "contrast(2)",

  // ===== PREMIUM (WATCH ADS) =====
  crystal: "contrast(1.6) brightness(1.1)",
  gold: "sepia(0.8) saturate(1.6)",
  ice: "brightness(1.2) hue-rotate(220deg)",
  fire: "saturate(2) brightness(1.2)",
  lava: "contrast(1.5) hue-rotate(30deg)",

  cyber: "hue-rotate(90deg) contrast(1.4)",
  noir: "grayscale(1) contrast(1.6)",
  moody: "brightness(0.85) contrast(1.3)",
  cinemaWarm: "contrast(1.2) sepia(0.3)",
  cinemaCool: "contrast(1.2) hue-rotate(200deg)",

  softPink: "sepia(0.3) hue-rotate(330deg)",
  mint: "hue-rotate(120deg) brightness(1.1)",
  sunset: "sepia(0.5) brightness(1.2)",
  night: "brightness(0.7) contrast(1.4)",
  spotlight: "brightness(1.3)",

  film: "contrast(1.1)",
  clean: "brightness(1.05)",
  ultra: "contrast(1.7)",
  rainbow: "hue-rotate(360deg)",
  blurMax: "blur(2px)"
};

/* =========================
   PREMIUM FILTER UNLOCK
========================= */

export async function unlockPremiumFilter(userId, filterName) {
  const { data } = await supabase
    .from("premium_filters")
    .select("*")
    .eq("user_id", userId)
    .eq("filter_name", filterName)
    .single();

  const now = new Date();

  // Already unlocked & valid
  if (data && new Date(data.expires_at) > now) {
    return true;
  }

  // Watch 2 ads
  for (let i = 0; i < 2; i++) {
    registerView();
    alert(`Watch ad ${i + 1}/2 to unlock ${filterName}`);
  }

  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + 7);

  const { error } = await supabase.from("premium_filters").upsert({
    user_id: userId,
    filter_name: filterName,
    unlocked_at: now,
    expires_at
  });

  if (error) {
    alert("Unlock failed: " + error.message);
    return false;
  }

  alert(`${filterName} unlocked for 7 days`);
  return true;
}

/* =========================
   APPLY FILTER
========================= */

export function applyFilter(element, filterName) {
  if (!FILTERS[filterName]) return;
  element.style.filter = FILTERS[filterName];
}
