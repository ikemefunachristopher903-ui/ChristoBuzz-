import { supabase } from "./supabase.js";

const messagesDiv = document.createElement("div");
messagesDiv.id = "messagesContainer";

export async function loadMessages(appId) {
  const app = document.getElementById(appId);
  app.innerHTML = ""; // Clear current view
  app.appendChild(messagesDiv);

  messagesDiv.innerHTML = `
    <h2>Chats</h2>
    <div id="chatList"></div>
    <textarea id="newMessage" placeholder="Type a message..."></textarea>
    <button id="sendMsgBtn">Send</button>
  `;

  document.getElementById("sendMsgBtn").onclick = sendMessage;

  loadChatList();
}

async function loadChatList() {
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  const chatList = document.getElementById("chatList");
  chatList.innerHTML = "";

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "messageItem";
    div.textContent = `${msg.sender_email}: ${msg.content}`;
    chatList.appendChild(div);
  });
}

async function sendMessage() {
  const { data: user } = await supabase.auth.getUser();
  const content = document.getElementById("newMessage").value;

  if (!user) return alert("You must be logged in to send a message.");
  if (!content) return;

  const { error } = await supabase.from("messages").insert({
    content,
    sender_id: user.id,
    sender_email: user.email
  });

  if (error) return alert(error.message);

  document.getElementById("newMessage").value = "";
  loadChatList();
}
