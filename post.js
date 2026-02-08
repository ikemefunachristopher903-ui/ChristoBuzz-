// post.js – Post card (Facebook style) + boost with revenue split
import { splitRevenue } from './splitprocessor.js';

export function createPostCard(postData) {
  const card = document.createElement('div');
  card.className = 'feed-card post-card';
  card.innerHTML = `
    <div class="post-header">
      <img src="${postData.avatar || 'https://via.placeholder.com/40'}" alt="Avatar" class="avatar" />
      <span>${postData.username || 'User'}</span>
    </div>
    <p>${postData.text || 'Demo post text'}</p>
    \( {postData.image ? `<img src=" \){postData.image}" alt="Post image" />` : ''}
    <div class="post-actions">
      <button class="like-btn">Like</button>
      <button class="comment-btn">Comment</button>
      <button class="boost-btn">Boost (0.001 BTC)</button>
    </div>
    <div class="reviews">Reviews linked to this post</div>
  `;

  card.querySelector('.boost-btn').addEventListener('click', () => {
    const amount = 0.001;
    const payout = splitRevenue(amount, 'boost', accountType);
    console.log(`Post boost split → You: ${payout.platform} | Creator/User: ${payout.creator || payout.user}`);
    alert('Boost sent! Creator gets most.');
  });

  return card;
    }
