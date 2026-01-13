import { supabase } from "./supabase.js";

const musicList = [
  { id: 1, title: "Song A", artist: "Artist 1", url: "https://sample-videos.com/audio/mp3/crowd-cheering.mp3" },
  { id: 2, title: "Song B", artist: "Artist 2", url: "https://sample-videos.com/audio/mp3/wave.mp3" },
  { id: 3, title: "Song C", artist: "Artist 3", url: "https://sample-videos.com/audio/mp3/india-national-anthem.mp3" }
];

export function loadMusic(app) {
  app.innerHTML = `
    <h2>Music</h2>
    <div id="musicList"></div>
    <audio id="player" controls></audio>
  `;

  const musicDiv = document.getElementById("musicList");
  const player = document.getElementById("player");

  musicList.forEach(song => {
    const div = document.createElement("div");
    div.classList.add("song");
    div.innerHTML = `
      <strong>${song.title}</strong> - ${song.artist} 
      <button data-url="${song.url}">Play</button>
    `;
    musicDiv.appendChild(div);

    div.querySelector("button").onclick = () => {
      player.src = song.url;
      player.play();
    };
  });
}
