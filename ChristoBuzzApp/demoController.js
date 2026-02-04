// demoController.js
// This handles loading demo data for users, posts, products, and connecting features

import demoUsers from './demoData/demoUsers.json';
import demoPosts from './demoData/demoPosts.json';
import demoProducts from './demoData/demoProducts.json';

// Engines
import { loadUserEngine } from './engines/demoUserEngine.js';
import { loadPostEngine } from './engines/postEngine.js';
import { loadMarketplaceEngine } from './engines/marketplaceEngine.js';
import { loadReelsEngine } from './engines/reelsEngine.js';

// Utilities
import { formatCurrency } from './utils/currency.js';

export function initDemo() {
  console.log('Demo system initializing...');

  // Load users
  const users = loadUserEngine(demoUsers);
  console.log('Users loaded:', users);

  // Load posts
  const posts = loadPostEngine(demoPosts);
  console.log('Posts loaded:', posts);

  // Load marketplace products
  const products = loadMarketplaceEngine(
    demoProducts.map(p => ({ ...p, price: formatCurrency(p.price, p.currency) }))
  );
  console.log('Products loaded:', products);

  // Load reels
  const reels = loadReelsEngine(demoPosts); // assuming reels use some posts
  console.log('Reels loaded:', reels);

  // Render basic demo content
  const app = document.getElementById('app');
  app.innerHTML = `
    <h1>ChristoBuzz Demo</h1>
    <p>Users: ${users.length}</p>
    <p>Posts: ${posts.length}</p>
    <p>Products: ${products.length}</p>
    <p>Reels: ${reels.length}</p>
  `;
}
