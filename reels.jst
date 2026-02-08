// reels.js – Reel card (TikTok/IG style) + music + boost split
import { playTrack } from './music.js';
import { splitRevenue } from './splitprocessor.js';

export function createReelCard(reelData) {
  const card = document.createElement('div');
  card.className = 'feed-card reel-card';
  card.innerHTML = `
    <video src="${reelData.video || 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'}" 
           autoplay muted loop playsinline class="reel-video"></video>
    <div class="music-overlay">♪ Now Playing (music.js)</div>
    <div class="reel-actions">
      <button class="boost-btn">Boost Reel (0.001 BTC)</button>
    </div>
  `;

  // Play music track
  playTrack();

  card.querySelector('.boost-btn').addEventListener('click', () => {
    const amount = 0.001;
    const payout = splitRevenue(amount, 'boost', accountType);
    console.log(`Reel boost split → You: ${payout.platform} | Creator: ${payout.creator}`);
  });

  return card;
}
