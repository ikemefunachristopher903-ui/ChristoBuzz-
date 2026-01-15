// influencer.js
import { calculateSplit, sendSplit } from "./splitProcessor.js";

// Example influencer data
export let influencers = [
  { id: "inf1", name: "Alice", walletBTC: "", walletUSDT: "" },
  { id: "inf2", name: "Bob", walletBTC: "", walletUSDT: "" }
];

/**
 * Register a new influencer
 * @param {string} name
 * @param {string} walletBTC
 * @param {string} walletUSDT
 */
export function addInfluencer(name, walletBTC, walletUSDT) {
  const newInfluencer = {
    id: `inf${Date.now()}`,
    name,
    walletBTC,
    walletUSDT
  };
  influencers.push(newInfluencer);
  return newInfluencer;
}

/**
 * Pay an influencer
 * @param {string} influencerId
 * @param {number} totalAmount
 * @param {string} currency
 * @param {number} influencerPercent
 */
export async function payInfluencer(influencerId, totalAmount, currency = "BTC", influencerPercent = 50) {
  const influencer = influencers.find(i => i.id === influencerId);
  if (!influencer) return console.error("Influencer not found");

  const split = calculateSplit(totalAmount, influencerPercent, 0); // app takes 0% here, owner takes remainder
  console.log(`Paying influencer ${influencer.name}...`);

  // Override influencer wallet for this transaction
  const influencerAmount = split.influencerAmount;
  const ownerAmount = split.ownerAmount;

  await sendSplit({
    ownerAmount,
    influencerAmount,
    appAmount: 0
  }, currency);
    }
