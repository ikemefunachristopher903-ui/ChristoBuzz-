// wallet.js
import { supabase } from "./supabase.js";

// ======= YOUR CRYPTO WALLETS =======
const YOUR_WALLETS = {
  BTC: "bc1qhvj4xydt9ev6hjhacf5873056jvxeg55tkz67p",
  USDT: "0x6629fd6a071776e21f17186eca57f53b9df2e610",
};

const COMPANY_WALLETS = {
  BTC: "bc1qclkz9jvap6nmmk2nzntrt8rm8yy6yyqgw7y4p6",
  USDT: "0x6a339cef96d44e50a275a801f4d6c7d94e89dfdf",
};

// ======= CREATE A TRANSACTION =======
export async function processPayment(userId, amount, currency = "USDT") {
  // Split percentages
  const influencerShare = 0.5; // 50%
  const appShare = 0.3;        // 30%
  const aiShare = 0.2;         // 20%

  const influencerAmount = amount * influencerShare;
  const appAmount = amount * appShare;
  const aiAmount = amount * aiShare;

  // Store transaction in Supabase
  const { error } = await supabase.from("transactions").insert([
    {
      user_id: userId,
      currency,
      total_amount: amount,
      influencer_amount: influencerAmount,
      app_amount: appAmount,
      ai_amount: aiAmount,
      status: "completed",
    },
  ]);

  if (error) return alert("Transaction failed: " + error.message);

  console.log(`Payment processed:
    User gets: ${influencerAmount} ${currency}
    App gets: ${appAmount} ${currency}
    AI gets: ${aiAmount} ${currency}
  `);

  // Here you can integrate crypto wallet transfer logic
  // e.g., send crypto to YOUR_WALLETS and COMPANY_WALLETS automatically
}

// ======= CHECK BALANCE =======
export async function getBalance(userId) {
  const { data } = await supabase
    .from("transactions")
    .select("SUM(influencer_amount) as balance")
    .eq("user_id", userId)
    .single();

  return data?.balance || 0;
    }
