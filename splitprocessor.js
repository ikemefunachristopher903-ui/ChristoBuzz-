// splitprocessor.js
import { processPayment } from "./wallet.js";
import { supabase } from "./supabase.js";

/* =========================
   MARKETPLACE PURCHASE PROCESSOR
========================= */
export async function processMarketplacePurchase(itemId, buyerId, currency = "USDT") {
  // Fetch item info
  const { data: items, error: fetchError } = await supabase
    .from("marketplace_items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (fetchError || !items) return alert("Item not found");

  const { price, seller_id } = items;

  // Process payment split
  await processPayment(seller_id, price, currency);

  // Update item as sold
  const { error: updateError } = await supabase
    .from("marketplace_items")
    .update({ sold: true })
    .eq("id", itemId);

  if (updateError) return alert("Failed to update item status");

  console.log(`Marketplace purchase processed for item ${itemId}`);
}

/* =========================
   INFLUENCER REWARD PROCESSOR
========================= */
export async function processInfluencerReward(influencerId, amount, currency = "USDT") {
  // Process payment split
  await processPayment(influencerId, amount, currency);

  // Record influencer payout
  const { error } = await supabase.from("influencer_rewards").insert([
    {
      influencer_id: influencerId,
      amount,
      currency,
      status: "paid",
    },
  ]);

  if (error) return alert("Failed to record influencer reward");

  console.log(`Influencer ${influencerId} paid ${amount} ${currency}`);
}
