// feed.js – Infinite vertical feed (TikTok-style trap), combines posts + reels
// No new Supabase table – reuses demo data or existing posts/reels queries

const feedContainer = document.getElementById('feed');
let page = 0;
let isLoading = false;

async function loadMoreFeed() {
  if (isLoading) return;
  isLoading = true;

  // Simulate loading 8 items (mix of posts and reels)
  // Later: replace with Supabase.from('posts').select() or 'reels'
  for (let i = 0; i < 8; i++) {
    const isReel = i % 3 === 0; // every 3rd is a reel (video)

    const card = document.createElement('div');
    card.className = 'feed-card';

    if (isReel) {
      card.innerHTML = `
        <video src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
               autoplay muted loop playsinline class="reel-video"></video>
        <div class="music-overlay">♪ Sample Track – Music.js</div>
        <button class="boost-btn">Boost (0.001 BTC)</button>
      `;
    } else {
      card.innerHTML = `
        <img src="https://via.placeholder.com/400x500?text=Post+${page*8+i+1}" alt="Post" />
        <p>Demo post text – like & comment to engage</p>
        <button class="boost-btn">Boost (0.001 BTC)</button>
      `;
    }

    feedContainer.appendChild(card);

    // Trigger CPM ad every 5 cards
    if ((page * 8 + i + 1) % 5 === 0) {
      const ad = document.createElement('div');
      ad.innerHTML = `
        <div id="cpm-ad-placeholder" style="background:#eee; padding:40px; text-align:center; margin:20px 0;">
          CPM Ad Loading... (impression counted)
        </div>
      `;
      feedContainer.appendChild(ad);

      // Load your EffectiveGate CPM script
      loadEffectiveGateCPM();
    }
  }

  page++;
  isLoading = false;
}

// IntersectionObserver for auto-play reels when in view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target.querySelector('video');
    if (video) {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  });
}, { threshold: 0.6 });

function observeNewCards() {
  document.querySelectorAll('.feed-card').forEach(card => {
    if (!card.dataset.observed) {
      observer.observe(card);
      card.dataset.observed = 'true';
    }
  });
}

// Load first batch
loadMoreFeed().then(observeNewCards);

// Infinite scroll trigger
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    loadMoreFeed().then(observeNewCards);
  }
});

// CPM loader (your script)
function loadEffectiveGateCPM() {
  if (document.getElementById('cpm-script-loaded')) return; // load once

  const script = document.createElement('script');
  script.id = 'cpm-script-loaded';
  script.async = true;
  script.src = 'https://pl28543006.effectivegatecpm.com/b847998fc2d362116b45c62469517640/invoke.js';
  document.head.appendChild(script);

  // Container is already in HTML or created dynamically
}
