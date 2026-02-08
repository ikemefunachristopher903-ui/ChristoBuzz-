// adnetwork.js – EffectiveGate CPM + CPAgrip smartlink
export function loadEffectiveGateCPM() {
  if (document.getElementById('cpm-loaded')) return;

  const script = document.createElement('script');
  script.id = 'cpm-loaded';
  script.async = true;
  script.src = 'https://pl28543006.effectivegatecpm.com/b847998fc2d362116b45c62469517640/invoke.js';
  document.head.appendChild(script);
}

export function openCPAGripOffer() {
  window.open('https://installyourfiles.com/1869826', '_blank');
  console.log('CPA smartlink opened – potential payout on action');
}

// Use in feed.js for CPM, in marketplace.js for CPA shelf
