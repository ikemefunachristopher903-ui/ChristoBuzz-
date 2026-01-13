import { supabase } from "./supabase.js";

const notificationsDiv = document.createElement("div");
notificationsDiv.id = "notificationsContainer";

export async function loadNotifications(appId) {
  const app = document.getElementById(appId);
  app.innerHTML = ""; // Clear current view
  app.appendChild(notificationsDiv);

  notificationsDiv.innerHTML = `
    <h2>Notifications</h2>
    <div id="notificationsList"></div>
  `;

  loadNotificationList();
}

async function loadNotificationList() {
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { descending: true });

  if (error) return alert(error.message);

  const notificationsList = document.getElementById("notificationsList");
  notificationsList.innerHTML = "";

  notifications.forEach(notif => {
    const div = document.createElement("div");
    div.className = "notificationItem";
    div.innerHTML = `
      <strong>${notif.sender_name || notif.sender_email}</strong>
      <span>${notif.type}</span>
      <p>${notif.content}</p>
      <small>${new Date(notif.created_at).toLocaleString()}</small>
    `;
    notificationsList.appendChild(div);
  });
}
