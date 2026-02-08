// messages.js – WhatsApp/Telegram hybrid: chat input, groups, honeycomb splash
export function openMessageSplash() {
  const splash = document.getElementById('message-splash');
  if (!splash) return;

  splash.classList.remove('hidden');
  const list = document.getElementById('friends-list');
  list.innerHTML = `
    <div class="chat-header">Messages Hive</div>
    <ul class="chat-list">
      <li>Me (Admin) – Send feature requests (premium)</li>
      <li>CPA Friend – View deals</li>
      <li>CPM Friend – Watch & earn</li>
      <li>AI Friend – Ask anything</li>
    </ul>
    <input id="chat-input" placeholder="Type message..." />
    <button onclick="sendChatMessage()">Send</button>
  `;

  // Blue dot + tiny B for unread
  document.getElementById('msg-dot')?.classList.remove('hidden');
}

export function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (input?.value.trim()) {
    console.log('Sent:', input.value);
    // Later: save to messages table if exists, or local for now
    input.value = '';
  }
}

export function closeMessageSplash() {
  document.getElementById('message-splash')?.classList.add('hidden');
}
