// main.js
import { supabase } from "./supabase.js";
import { demoUsersInit, demoPostsInit, demoProductsInit } from "./demoController.js";
import { registerView } from "./adnetwork.js";

document.addEventListener("DOMContentLoaded", () => {

  // App State
  let currentUser = null;
  const tabs = ["home","reels","music","marketplace","create","notifications","profile"];
  const tabContent = document.getElementById("tab-content");

  // PWA Service Worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
      .then(reg=>console.log('SW registered',reg))
      .catch(err=>console.error('SW failed',err));
  }

  // Auth state change
  supabase.auth.onAuthStateChange((_event, session)=>{
    const authScreen = document.getElementById("auth-screen");
    const app = document.getElementById("app");
    if(session?.user){
      currentUser = session.user;
      authScreen.classList.add("hidden");
      app.classList.remove("hidden");
      initializeApp();
    } else {
      currentUser = null;
      authScreen.classList.remove("hidden");
      app.classList.add("hidden");
      demoUsersInit();
    }
  });

  // LOGIN
  window.login = async function(){
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) return alert(error.message);
    currentUser = data.user;
    initializeApp();
  }

  // SIGNUP
  window.signup = async function(){
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;
    if(password !== confirmPassword) return alert("Passwords do not match.");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if(error) return alert(error.message);
    currentUser = data.user;
    initializeApp();
  }

  // Initialize App
  async function initializeApp(){
    demoUsersInit();
    demoPostsInit();
    demoProductsInit();
    setupNavigation();
  }

  // Navigation
  function setupNavigation(){
    document.querySelectorAll('nav li').forEach(btn=>{
      btn.onclick=()=>loadTab(btn.dataset.tab);
    });
    loadTab("home");
  }

  function loadTab(tab){
    tabContent.innerHTML=`<h2>${tab.charAt(0).toUpperCase()+tab.slice(1)}</h2>`;
    if(tab==="home") demoPostsInit();
    if(tab==="marketplace") demoProductsInit();
    if(tab==="reels") tabContent.innerHTML+="<p>Reels loading...</p>";
    if(tab==="music") tabContent.innerHTML+="<p>Music loading...</p>";
    if(tab==="notifications") tabContent.innerHTML+="<p>Notifications loading...</p>";
    if(tab==="profile") tabContent.innerHTML+="<p>User profile loading...</p>";
  }

});
