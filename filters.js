// filters.js
import { supabase } from "./supabase.js";
import { registerView } from "./ad_networks.js";

/* =========================
   FILTER DEFINITIONS
========================= */

export const FILTERS = {
  // FREE (20)
  none: "none",
  grayscale: "grayscale(100%)",
  sepia: "sepia(80%)",
  invert: "invert(100%)",
  contrast: "contrast(130%)",
  brightness: "brightness(120%)",
  dark: "brightness(80%)",
  warm: "sepia(40%) saturate(120%)",
  cool: "hue-rotate(180deg)",
  blur: "blur(2px)",
  glow: "brightness(110%) contrast(120%)",
  vintage: "sepia(60%) contrast(90%)",
  soft: "brightness(105%) blur(1px)",
  mono: "grayscale(100%) contrast(120%)",
  noir: "grayscale(100%) brightness(70%)",
  fade: "opacity(0.9)",
  pop: "saturate(150%)",
  clean: "contrast(110%) brightness(110%)",
  calm: "brightness(95%)",
  sharp: "contrast(140%)",

  // PREMIUM (30)
  crystal: "contrast(160%) saturate(140%)",
  gold: "sepia(90%) brightness(120%)",
  neon: "saturate(200%)",
  night: "brightness(60%) contrast(140%)",
  dream: "blur(1.5px) brightness(110%)",
  frost: "brightness(130%)",
  sunset: "sepia(50%) hue-rotate(-20deg)",
  cyber: "hue-rotate(90deg) saturate(150%)",
  glowPro: "brightness(120%) blur(0.8px)",
  mirror: "invert(10%)",
  haze: "blur(2px) brightness(105%)",
  rich: "contrast(150%)",
  film: "sepia(40%) contrast(85%)",
  ice: "hue-rotate(200deg)",
  lava: "hue-rotate(30deg) saturate(180%)",
  shadow: "brightness(70%)",
  matte: "contrast(90%)",
  pearl: "brightness(115%)",
  royal: "contrast(170%)",
  deep: "brightness(65%)",
  vivid: "saturate(170%)",
  luxe: "contrast(160%) brightness(115%)",
  glass: "opacity(0.92)",
  aura: "blur(1px) brightness(120%)",
  bloom: "brightness(130%) blur(0.5px)",
  fog: "blur(3px)",
  amber: "sepia(70%)",
  cosmic: "hue-rotate(300deg)",
  neonPro: "saturate(220%)",
  ultra: "contrast(200%)"
};

export const PREMIUM_FILTER_NAMES = Object.keys(FILTERS).slice(20);

/* =========================
   UNLOCK PREMIUM FILTER
========================= */

export async function unlockFilter(userId, filterName) {
  const { data } = await supabase
    .from("premium_filters")
    .select("*")
    .eq("user_id", userId)
    .eq("filter_name", filterName)
    .single();

  const now = new Date();

  if (data && new Date(data.expires_at) > now) return true;

  // Watch 2 ads
  registerView();
  registerView();

  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  await supabase.from("premium_filters").upsert({
    user_id: userId,
    filter_name: filterName,
    unlocked_at: now,
    expires_at: expires
  });

  return true;
}

/* =========================
   APPLY FILTER
========================= */

export function applyFilter(element, filterName) {
  element.style.filter = FILTERS[filterName] || "none";
}
