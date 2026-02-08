// music.js – Spotify style: auto-play tracks, playlist after 5
let currentTrackIndex = 0;
const sampleTracks = [
  { title: 'Vibe 1', src: 'https://sample-videos.com/audio/mp3/crowd-cheering.mp3' },
  { title: 'Chill 2', src: 'https://sample-videos.com/audio/mp3/waves-crashing.mp3' },
  // Add more later
];

export function playTrack() {
  const audio = new Audio(sampleTracks[currentTrackIndex].src);
  audio.play().catch(() => console.log('Music blocked – tap screen'));
  console.log(`Playing: ${sampleTracks[currentTrackIndex].title}`);

  currentTrackIndex = (currentTrackIndex + 1) % sampleTracks.length;

  if (currentTrackIndex === 0) {
    const playlistUI = document.createElement('div');
    playlistUI.className = 'playlist-popup';
    playlistUI.innerHTML = `<p>Spotify Mode: Playlist Ready! Tracks complete.</p>`;
    document.body.appendChild(playlistUI);
    setTimeout(() => playlistUI.remove(), 5000);
  }
}

// Call from reel cards in feed.js
