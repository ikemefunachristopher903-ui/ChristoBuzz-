// ad_networks.js

/* =========================
   AD NETWORK CONFIG
========================= */

// CPA (CPAGrip / Direct offer)
const CPA_LINK = "https://installyourfiles.com/1869826";

// Adsterra CPM container ID
const ADSTERRA_CONTAINER_ID = "container-b847998fc2d362116b45c62469517640";

/* =========================
   VIEW COUNTER (GLOBAL)
========================= */

let viewCount = 0;

/**
 * Call this function whenever:
 * - a post is viewed
 * - a reel is viewed
 * - a video is viewed
 * - a profile post is viewed
 */
export function registerView() {
  viewCount++;

  const position = viewCount % 7;

  // 2 CPM ads in every 7 views
  if (position === 3 || position === 5) {
    showCPMAd();
  }

  // 1 CPA ad in every 7 views
  if (position === 0) {
    showCPAAd();
  }
}

/* =========================
   CPM AD (ADSTERRA)
========================= */

function showCPMAd() {
  console.log("Showing CPM Ad (Adsterra)");

  // Prevent duplicate ads
  if (document.getElementById(ADSTERRA_CONTAINER_ID)) return;

  const adContainer = document.createElement("div");
  adContainer.id = ADSTERRA_CONTAINER_ID;
  adContainer.className = "ad-cpm";

  adContainer.innerHTML = `
    <script async="async" data-cfasync="false"
      src="https://pl28543006.effectivegatecpm.com/b847998fc2d362116b45c62469517640/invoke.js">
    </script>
  `;

  document.body.appendChild(adContainer);
}

/* =========================
   CPA AD (DIRECT OFFER)
========================= */

function showCPAAd() {
  console.log("Showing CPA Ad");

  const modal = document.createElement("div");
  modal.className = "ad-cpa-modal";

  modal.innerHTML = `
    <div class="ad-cpa-box">
      <h3>Unlock More Content 🔓</h3>
      <p>Complete one quick step to continue</p>
      <button id="openCpa">Continue</button>
      <button id="closeCpa">Skip</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("openCpa").onclick = () => {
    window.open(CPA_LINK, "_blank");
    modal.remove();
  };

  document.getElementById("closeCpa").onclick = () => {
    modal.remove();
  };
}

/* =========================
   MANUAL CPA (REWARDED)
========================= */

export function showRewardedCPA(reason = "Unlock feature") {
  if (!confirm(`${reason}\n\nComplete a quick offer to continue.`)) return;
  window.open(CPA_LINK, "_blank");
}
