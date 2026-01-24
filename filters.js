import { supabase } from "./supabase.js";
import { registerView } from "./ad_networks.js";

// ===== FILTERS =====
export const ALL_FILTERS = {
  none: "none",
  sepia: "sepia(1)",
  grayscale: "grayscale(1)",
  contrast: "contrast(1.2)",
  invert: "invert(1)",
  vintage: "sepia(0.5) contrast(1.1) saturate(0.9)",
  bright: "brightness(1.2)",
  warm: "brightness(1.1) saturate(1.2)",
  cool: "hue-rotate(180deg) brightness(0.9)",
  soft: "blur(1px) brightness(1.1)",
  dreamy: "brightness(1.05) contrast(1.05) saturate(1.1)",
  punch: "contrast(1.3) saturate(1.2)",
  faded: "brightness(0.95) contrast(0.9) saturate(0.9)",
  pop: "contrast(1.5) saturate(1.5)",
  mono: "grayscale(1) contrast(1.2)",
  dusk: "brightness(0.9) contrast(1.2) sepia(0.3)",
  neon: "hue-rotate(120deg) saturate(1.5) contrast(1.2)",
  sharp: "contrast(1.4)",
  retro: "sepia(0.4) saturate(0.9)",
  glow: "brightness(1.2) blur(0.5px)",
  warmSepia: "sepia(0.6) brightness(1.1)",
  coldBlue: "brightness(0.95) hue-rotate(200deg)",
  shine: "brightness(1.3) contrast(1.1)",
  haze: "blur(1px) brightness(0.9)",
  rich: "saturate(1.3) contrast(1.2)",
  softPink: "hue-rotate(330deg) saturate(1.2)",
  softGreen: "hue-rotate(100deg) saturate(1.2)",
  softPurple: "hue-rotate(280deg) saturate(1.2)",
  vivid: "saturate(1.5) contrast(1.3)",
  noir: "grayscale(1) contrast(1.5) brightness(0.9)",
  solar: "sepia(0.5) brightness(1.2)",
  frost: "brightness(1.1) hue-rotate(180deg) contrast(0.9)",
  magic: "contrast(1.3) saturate(1.3) brightness(1.1)",
  caramel: "sepia(0.4) saturate(1.2)",
  jungle: "hue-rotate(90deg) saturate(1.3)",
  ocean: "hue-rotate(200deg) saturate(1.3) brightness(1.05)",
  blush: "hue-rotate(330deg) brightness(1.05)",
  shadow: "brightness(0.85) contrast(1.3)",
  brightPop: "contrast(1.4) saturate(1.4) brightness(1.2)",
  sepiaPop: "sepia(0.5) contrast(1.2)",
  monoSharp: "grayscale(1) contrast(1.3)",
  dreamyGlow: "brightness(1.05) contrast(1.05) saturate(1.2) blur(0.5px)",
  retroCool: "sepia(0.4) hue-rotate(200deg)",
  vividWarm: "saturate(1.5) brightness(1.1)",
  frostPop: "brightness(1.1) hue-rotate(180deg) saturate(1.5)",
  neonGlow: "hue-rotate(120deg) saturate(1.5) brightness(1.2)",
  duskPop: "brightness(0.9) contrast(1.2) saturate(1.2) sepia(0.3)",
  softWarm: "brightness(1.05) saturate(1.1)",
  softCool: "brightness(0.95) hue-rotate(200deg) saturate(1.1)"
};

// Pick 15 premium filters
export const PREMIUM_FILTER_NAMES = [
  "neon", "dreamy", "retro", "glow", "vivid", "noir", "solar", "frost", "magic",
  "caramel", "jungle", "ocean", "brightPop", "dreamyGlow", "neonGlow"
];

// ===== UNLOCK PREMIUM FILTER =====
export async function unlockPremiumFilter(userId, filterName) {
  if (!PREMIUM_FILTER_NAMES.includes(filterName)) return true;

  const { data } = await supabase
    .from("premium_filters")
    .select("*")
    .eq("user_id", userId)
    .eq("filter_name", filterName)
    .single();

  const now = new Date();

  if (data && new Date(data.expires_at) > now) return true;

  // Trigger 2 ads
  for (let i = 0; i < 2; i++) {
    registerView();
    alert(`Watch ad ${i + 1} to unlock ${filterName}`);
  }

  // Unlock for 7 days
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + 7);

  const { error } = await supabase.from("premium_filters").upsert({
    user_id: userId,
    filter_name: filterName,
    unlocked_at: now,
    expires_at
  });

  if (error) {
    alert("Error unlocking filter: " + error.message);
    return false;
  }

  alert(`${filterName} unlocked for 7 days!`);
  return true;
}

// ===== APPLY FILTER =====
export function applyFilter(element, filterName) {
  element.style.filter = ALL_FILTERS[filterName] || "none";
}
