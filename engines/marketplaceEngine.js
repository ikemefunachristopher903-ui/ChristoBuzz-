import { loadDemoData } from "../demoData/demoLoader.js";
import { appState } from "../state/appState.js";
import { formatPrice } from "../utils/currency.js";

let productsCache = null;

export async function getProducts() {
  if (productsCache) return productsCache;

  const { products } = await loadDemoData();

  productsCache = products.map(p => ({
    ...p,
    priceFormatted: formatPrice(p.price, appState.currency || "USD")
  }));

  return productsCache;
}

export function getProductsByCategory(category) {
  return productsCache?.filter(p => p.category === category) || [];
}
