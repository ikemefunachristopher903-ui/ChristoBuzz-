// influencer.js
import { supabase } from "./supabase.js";
import { processInfluencerReward } from "./splitprocessor.js";

export const influencers = [];

/* =========================
   ADD NEW INFLUENCER
========================= */
export async function addInfluencer(name, btcWallet, usdtWallet) {
  const { data, error } = await supabase.from("influencers").insert([
    {
      name,
      btc_wallet: btcWallet,
      usdt_wallet: usdtWallet,
    },
  ]);

  if (error) return alert("Failed to add influencer: " + error.message);

  influencers.push(data[0]);
  console.log(`Influencer added: ${name}`);
}

/* =========================
   PAY INFLUENCER
========================= */
export async function payInfluencer(influencerId, amount, currency = "USDT") {
  await processInfluencerReward(influencerId, amount, currency);
  console.log(`Influencer ${influencerId} paid ${amount} ${currency}`);
}
