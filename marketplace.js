// marketplace.js
import { supabase } from "./supabase.js";
import { processMarketplacePurchase } from "./splitprocessor.js";

export const items = [];

/* =========================
   ADD ITEM TO MARKETPLACE
========================= */
export async function addItem(name, price, sellerBTC, sellerUSDT) {
  const { data, error } = await supabase.from("marketplace_items").insert([
    {
      name,
      price,
      seller_btc: sellerBTC,
      seller_usdt: sellerUSDT,
      sold: false,
    },
  ]);

  if (error) return alert("Failed to add item: " + error.message);

  items.push(data[0]);
  console.log(`Item added: ${name} - $${price}`);
}

/* =========================
   BUY ITEM
========================= */
export async function buyItem(itemId, currency = "BTC") {
  const buyer = await supabase.auth.getUser();
  if (!buyer.data.user) return alert("Login required");

  await processMarketplacePurchase(itemId, buyer.data.user.id, currency);

  console.log(`Item ${itemId} purchased using ${currency}`);
}
