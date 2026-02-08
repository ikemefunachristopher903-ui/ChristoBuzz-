// messages.js – WhatsApp/Telegram hybrid + honeycomb splash
export function openMessageSplash() {
  const splash = document.getElementById('message-splash');
  if (!splash) return;

  splash.classList.remove('hidden');
  document.getElementById('friends-list').innerHTML = `
    <div class="chat-header">Messages Hive</div>
    <ul>
      <li>Me (Admin) – Feature requests (premium)</li>
      <li>CPA Friend – Deals</li>
      <li>CPM Friend – Watch & earn</li>
      <li>AI Friend – Ask anything</li>
    </ul>
    <input id="chat-input" placeholder="Type message..." />
    <button onclick="sendChatMessage()">Send</button>
  `;

  document.getElementById('msg-dot')?.classList.remove('hidden');
}

export function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (input?.value.trim()) {
    console.log('Sent:', input.value);
    input.value = '';
  }
}

export function closeMessageSplash() {
  document.getElementById('message-splash')?.classList.add('hidden');
}
