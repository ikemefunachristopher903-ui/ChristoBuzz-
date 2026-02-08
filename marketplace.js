// marketplace.js – Marketplace section with CPA shelf + user-added products
import { openCPAGripOffer } from './adnetwork.js';

export function initMarketplace() {
  const section = document.createElement('div');
  section.id = 'marketplace-section';
  section.innerHTML = `
    <h2>Marketplace</h2>
    
    <!-- CPA Shelf (cheapy yield) -->
    <div class="cpa-shelf">
      <h3>Partner Deals (CPA Offers)</h3>
      <p>Complete offers to help us earn bounties</p>
      <button onclick="openCPAGripOffer()">Browse CPA Offers</button>
    </div>

    <!-- User Products -->
    <h3>Your Products / Sell Something</h3>
    <div class="market-grid">
      <!-- Demo items – later load from Supabase or user posts -->
      <div class="market-item">
        <img src="https://via.placeholder.com/150" alt="Product" />
        <p>Handmade Shirt - $15</p>
        <button>Sell Similar</button>
      </div>
    </div>

    <button id="add-product-btn">Add Your Product</button>
  `;

  // Append to main app or tab (call from main.js later)
  document.getElementById('app')?.appendChild(section);

  // Add product button (stub – later open form)
  document.getElementById('add-product-btn')?.addEventListener('click', () => {
    alert('Add product form coming soon – upload image, price, description');
  });
}
