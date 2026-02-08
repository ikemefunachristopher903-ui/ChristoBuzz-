// marketplace.js – Marketplace with CPA shelf + user-added products
import { openCPAGripOffer } from './adnetwork.js';

let userProducts = []; // in-memory for now – later save to Supabase

export function initMarketplace() {
  const section = document.createElement('div');
  section.id = 'marketplace-section';
  section.innerHTML = `
    <h2>Marketplace</h2>
    
    <!-- CPA Shelf (cheapy yield / partner deals) -->
    <div class="cpa-shelf">
      <h3>Partner CPA Offers</h3>
      <p>Complete offers to support the app (we earn bounties)</p>
      <button onclick="openCPAGripOffer()">Browse CPA Offers</button>
    </div>

    <!-- User-added products -->
    <h3>Sell Your Items</h3>
    <div class="market-grid" id="product-grid"></div>
    
    <button id="add-product-btn">Add Your Product</button>
  `;

  document.getElementById('app')?.appendChild(section) || document.body.appendChild(section);

  renderProducts();

  document.getElementById('add-product-btn')?.addEventListener('click', () => {
    const name = prompt('Product name:');
    const price = parseFloat(prompt('Price in NGN:'));
    if (!name || isNaN(price)) return;

    const buyerPrice = price * 1.10; // add 10% platform cut
    const ourCut = price * 0.10;

    const product = { id: Date.now(), name, price, buyerPrice };
    userProducts.push(product);
    renderProducts();

    // Split the 10% cut to platform (you)
    const payout = splitRevenue(ourCut, 'marketplace', 'user');
    console.log(`Marketplace cut → You: ${payout.platform} | Seller: ${product.price}`);
  });
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = userProducts.map(p => `
    <div class="market-item">
      <h4>${p.name}</h4>
      <p>Buyer pays: ₦${p.buyerPrice.toFixed(0)}</p>
      <button>Buy Now</button>
    </div>
  `).join('');
}
