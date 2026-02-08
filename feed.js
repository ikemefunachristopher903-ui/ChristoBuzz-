// feed.js – Infinite vertical feed (TikTok trap), now connected to splitprocessor.js
// CPM impressions trigger revenue split – no new tables needed

const feed = document.getElementById('feed');
let page = 0;
let trackCount = 0;
let isLoading = false;

async function loadMoreFeed() {
  if (isLoading) return;
  isLoading = true;

  for (let i = 0; i < 8; i++) {
    const isReel = (page * 8 + i) % 3 === 0; // every 3rd is reel

    const card = document.createElement('div');
    card.className = 'feed-card';

    if (isReel) {
      card.innerHTML = `
        <video src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
               autoplay muted loop playsinline class="reel-video"></video>
        <div class="music-overlay">♪ Track ${trackCount + 1}</div>
        <button class="boost-btn">Boost (0.001 BTC)</button>
      `;
      trackCount++;

      // Spotify-style playlist unlock after 5 tracks
      if (trackCount % 5 === 0) {
        const playlist = document.createElement('div');
        playlist.className = 'playlist-popup';
        playlist.innerHTML = `<p>Playlist unlocked! 5 tracks complete – add more from music.js</p>`;
        card.appendChild(playlist);
      }
    } else {
      card.innerHTML = `
        <img src="https://via.placeholder.com/400x500?text=Post+${page*8+i+1}" alt="Post" />
        <p>Demo post – like & comment</p>
        <button class="boost-btn">Boost (0.001 BTC)</button>
      `;
    }

    feed.appendChild(card);

    // CPM ad every 5 cards – trigger split
    if ((page * 8 + i + 1) % 5 === 0) {
      const ad = document.createElement('div');
      ad.innerHTML = `
        <div id="cpm-ad-${page*8+i}" style="background:#eee;padding:40px;text-align:center;margin:20px 0;">
          CPM Ad Loading... (impression counted)
        </div>
      `;
      feed.appendChild(ad);

      loadEffectiveGateCPM(); // load your CPM script

      // Simulate CPM impression revenue (replace 0.50 with real ad value later)
      const impressionValue = 0.50; // example $0.50 per impression
      const payout = splitRevenue(impressionValue, 'cpm', accountType, isFirstMonthForUser);
      console.log(`CPM impression split → You: ${payout.platform} | User/Creator: ${payout.user || payout.creator}`);
      
      // Later: save payout.platform to your wallet, payout.user/creator to their balance
    }
  }

  page++;
  isLoading = false;
  observeReels();
}

// Auto-play/pause reels
const reelObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) video.play().catch(() => {});
    else video.pause();
  });
}, { threshold: 0.6 });

function observeReels() {
  document.querySelectorAll('.reel-video').forEach(vid => {
    if (!vid.dataset.observed) {
      reelObserver.observe(vid);
      vid.dataset.observed = 'true';
    }
  });
}

// Infinite scroll
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    loadMoreFeed();
  }
});

loadMoreFeed(); // start
