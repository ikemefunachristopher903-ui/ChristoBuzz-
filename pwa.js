let deferredPrompt;

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement("button");
  installBtn.textContent = "Install App";
  installBtn.className = "install-btn";
  document.body.appendChild(installBtn);

  installBtn.onclick = async () => {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    installBtn.remove();
  };
});

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}
