// feed.js – Infinite vertical feed (TikTok trap), mixes posts + reels
// Connected to splitprocessor.js for CPM revenue splits

const feed = document.getElementById('feed');
let page = 0;
let trackCount = 0;
let isLoading = false;

async function loadMoreFeed() {
  if (isLoading) return;
  isLoading = true;

  for (let i = 0; i < 8; i++) {
    const isReel = (page * 8 + i) % 3 === 0;

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
      if (trackCount % 5 === 0) {
        const playlist = document.createElement('div');
        playlist.className = 'playlist-popup';
        playlist.innerHTML = `<p>Playlist unlocked! 5 tracks complete</p>`;
        card.appendChild(playlist);
      }
    } else {
      card.innerHTML = `
        <img src="https://via.placeholder.com/400x500?text=Post+${page*8+i+1}" alt="Post" />
        <p>Demo post text – like & comment</p>
        <button class="boost-btn">Boost (0.001 BTC)</button>
      `;
    }

    feed.appendChild(card);

    // CPM ad every 5 cards + split revenue
    if ((page * 8 + i + 1) % 5 === 0) {
      const ad = document.createElement('div');
      ad.innerHTML = `<div style="background:#eee;padding:40px;text-align:center;margin:20px 0;">CPM Ad (impression)</div>`;
      feed.appendChild(ad);
      loadEffectiveGateCPM();

      // Split revenue on impression
      const impressionValue = 0.50; // example
      const payout = splitRevenue(impressionValue, 'cpm', accountType, isFirstMonthForUser);
      console.log(`CPM split → You: ${payout.platform} | User/Creator: ${payout.user || payout.creator}`);
    }
  }

  page++;
  isLoading = false;
  observeReels();
}

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

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    loadMoreFeed();
  }
});

loadMoreFeed();
