// adnetwork.js – CPM (EffectiveGate) + CPA (CPAgrip smartlink)

export function showCPMAd(containerId = 'cpm-ad-placeholder') {
  // Your EffectiveGate CPM zone
  const container = document.getElementById(containerId);
  if (container && !container.dataset.loaded) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pl28543006.effectivegatecpm.com/b847998fc2d362116b45c62469517640/invoke.js';
    document.head.appendChild(script);
    container.dataset.loaded = 'true';
  }
}

export function loadCPAGripSmartlink() {
  // Your CPAgrip smartlink (opens in iframe or new tab for safety)
  const link = 'https://installyourfiles.com/1869826';
  window.open(link, '_blank'); // or embed in iframe in CPA Friend section
}

// Call showCPMAd() every 5–7 feed items (already in feed.js)
// Call loadCPAGripSmartlink() when user enters "CPA Friend" section
