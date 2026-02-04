import { loadDemoData } from "../demoData/demoLoader.js";

let usersCache = null;
let currentUser = null;

// Load all demo users
export async function getDemoUsers() {
  if (usersCache) return usersCache;

  const { users } = await loadDemoData();
  usersCache = users.map(u => ({
    ...u,
    joinedAt: new Date(u.joinedAt || Date.now())
  }));

  return usersCache;
}

// Get user by ID
export function getUserById(userId) {
  return usersCache?.find(u => u.id === userId) || null;
}

// Set current user for demo session
export function setCurrentUser(userId) {
  currentUser = getUserById(userId);
}

// Get current user
export function getCurrentUser() {
  return currentUser;
}

// Example: random demo user for auto-login in demo mode
export async function getRandomDemoUser() {
  const users = await getDemoUsers();
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex];
}
