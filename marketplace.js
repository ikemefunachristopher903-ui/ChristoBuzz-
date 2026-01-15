// marketplace.js
import { calculateSplit, sendSplit } from "./splitProcessor.js";

// Example items in the marketplace
export let items = [
  { id: "item1", name: "T-Shirt", price: 10, sellerWalletBTC: "", sellerWalletUSDT: "" },
  { id: "item2", name: "Laptop", price: 200, sellerWalletBTC: "", sellerWalletUSDT: "" }
];

/**
 * Add a new item
 * @param {string} name
 * @param {number} price
 * @param {string} sellerBTC
 * @param {string} sellerUSDT
 */
export function addItem(name, price, sellerBTC, sellerUSDT) {
  const newItem = {
    id: `item${Date.now()}`,
    name,
    price,
    sellerWalletBTC: sellerBTC,
    sellerWalletUSDT: sellerUSDT
  };
  items.push(newItem);
  return newItem;
}

/**
 * Buy an item
 * @param {string} itemId
 * @param {string} currency "BTC" or "USDT"
 */
export async function buyItem(itemId, currency = "BTC") {
  const item = items.find(i => i.id === itemId);
  if (!item) return console.error("Item not found");

  // Split: 20% app, 10% AI/other, 70% seller
  const split = calculateSplit(item.price, 0, 30); // influencerPercent 0, appPercent 30
  console.log(`Buying item ${item.name} for ${item.price} ${currency}`);

  // Override seller wallet for this transaction
  const sellerAmount = split.ownerAmount;
  const appAmount = split.appAmount;

  await sendSplit({
    ownerAmount: sellerAmount,
    influencerAmount: 0,
    appAmount
  }, currency);
    }
