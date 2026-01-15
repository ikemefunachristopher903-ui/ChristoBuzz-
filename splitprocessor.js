// splitProcessor.js
import { sendBTC, sendUSDT } from "./wallet.js";

// Your wallets
export const wallets = {
  ownerBTC: "bc1qhvj4xydt9ev6hjhacf5873056jvxeg55tkz67p",
  ownerUSDT: "0x6629fd6a071776e21f17186eca57f53b9df2e610",
  companyBTC: "bc1qclkz9jvap6nmmk2nzntrt8rm8yy6yyqgw7y4p6",
  companyUSDT: "0x6a339cef96d44e50a275a801f4d6c7d94e89dfdf"
};

/**
 * Calculate split for a payment
 * @param {number} totalAmount
 * @param {number} influencerPercent default 0
 * @param {number} appPercent default 0
 */
export function calculateSplit(totalAmount, influencerPercent = 0, appPercent = 0) {
  const influencerAmount = (totalAmount * influencerPercent) / 100;
  const appAmount = (totalAmount * appPercent) / 100;
  const ownerAmount = totalAmount - influencerAmount - appAmount;

  return {
    ownerAmount,
    influencerAmount,
    appAmount
  };
}

/**
 * Send split automatically
 * @param {object} amounts {ownerAmount, influencerAmount, appAmount}
 * @param {string} currency "BTC" or "USDT"
 */
export async function sendSplit(amounts, currency) {
  if (currency === "BTC") {
    await sendBTC(wallets.ownerBTC, amounts.ownerAmount);
    await sendBTC(wallets.companyBTC, amounts.appAmount);
    if (amounts.influencerAmount) {
      console.log(`Send ${amounts.influencerAmount} BTC to influencer`);
      // sendBTC(influencerWallet, amounts.influencerAmount);
    }
  } else if (currency === "USDT") {
    await sendUSDT(wallets.ownerUSDT, amounts.ownerAmount);
    await sendUSDT(wallets.companyUSDT, amounts.appAmount);
    if (amounts.influencerAmount) {
      console.log(`Send ${amounts.influencerAmount} USDT to influencer`);
      // sendUSDT(influencerWallet, amounts.influencerAmount);
    }
  }
}
