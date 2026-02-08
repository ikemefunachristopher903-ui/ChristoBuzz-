// feed.js – Infinite vertical feed (TikTok trap), mixes posts + reels, no new table
const feed = document.getElementById('feed');
let page = 0;
let trackCount = 0;
let isLoading = false;

async function loadMoreFeed() {
  if (isLoading) return;
  isLoading = true;

  // Reuse demo data or existing Supabase posts/reels (no new query needed)
  for (let i = 0; i < 8; i++) {
    const isReel = (page * 8 + i) % 3 === 0; // mix: every 3rd is reel

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
      // Spotify-style: after 5 tracks show playlist UI
      if (trackCount % 5 === 0) {
        const playlist = document.createElement('div');
        playlist.className = 'playlist-popup';
        playlist.innerHTML = `<p>Playlist unlocked! Add more from music.js...</p>`;
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

    // CPM ad every 5 cards
    if ((page * 8 + i + 1) % 5 === 0) {
      const ad = document.createElement('div');
      ad.innerHTML = `<div id="cpm-ad-${page*8+i}" style="background:#eee;padding:40px;text-align:center;margin:20px 0;">CPM Ad (impression)</div>`;
      feed.appendChild(ad);
      loadEffectiveGateCPM(); // from adnetwork.js
    }
  }

  page++;
  isLoading = false;
  observeReels();
}

// Auto-play reels when visible
const reelObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
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
