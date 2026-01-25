// policy.js

// Create and show a modal policy popup
export function showPolicyModal() {
  return new Promise((resolve) => {
    // Check if modal already exists
    if (document.getElementById("policyModal")) {
      resolve(false);
      return;
    }

    // Create modal overlay
    const modal = document.createElement("div");
    modal.id = "policyModal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0,0,0,0.7)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "9999";

    // Modal content container
    const content = document.createElement("div");
    content.style.background = "#fff";
    content.style.borderRadius = "10px";
    content.style.width = "90%";
    content.style.maxWidth = "500px";
    content.style.maxHeight = "80%";
    content.style.padding = "20px";
    content.style.overflowY = "auto";
    content.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";

    // Policy title
    const title = document.createElement("h2");
    title.innerText = "ChristoBuzz App Policy";
    content.appendChild(title);

    // Policy text
    const policyText = `
1. Age Requirement:
   You must be at least 13 years old to use this app.

2. Account Information:
   Provide accurate info during signup (email, username, optional phone/address).

3. Content Rules:
   - No illegal, abusive, or copyright-infringing content.
   - Respect other users; harassment/hate speech is prohibited.
   - ChristoBuzz may remove violating content.

4. Privacy & Data:
   - We collect your data (profile, posts, interactions) to provide the service.
   - Email is used for authentication and notifications only.

5. Monetization:
   - Only eligible users access wallet features.
   - Earnings are subject to verification and app rules.

6. Ads:
   - You may see ads in posts, reels, marketplace.
   - Revenue is managed by ChristoBuzz and third-party ad networks.

7. Account Termination:
   - ChristoBuzz can suspend/delete violating accounts.
   - Users can delete accounts anytime via settings.

By clicking "Agree", you accept all terms of ChristoBuzz.
`;
    const textEl = document.createElement("p");
    textEl.style.whiteSpace = "pre-line";
    textEl.style.fontSize = "14px";
    textEl.innerText = policyText;
    content.appendChild(textEl);

    // Buttons container
    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.justifyContent = "flex-end";
    btnContainer.style.marginTop = "20px";

    // Agree button
    const agreeBtn = document.createElement("button");
    agreeBtn.innerText = "Agree";
    agreeBtn.style.background = "#007bff";
    agreeBtn.style.color = "#fff";
    agreeBtn.style.border = "none";
    agreeBtn.style.padding = "10px 20px";
    agreeBtn.style.borderRadius = "5px";
    agreeBtn.style.cursor = "pointer";
    agreeBtn.onclick = () => {
      document.body.removeChild(modal);
      resolve(true);
    };

    // Cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel";
    cancelBtn.style.background = "#ccc";
    cancelBtn.style.color = "#000";
    cancelBtn.style.border = "none";
    cancelBtn.style.padding = "10px 20px";
    cancelBtn.style.borderRadius = "5px";
    cancelBtn.style.marginRight = "10px";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.onclick = () => {
      document.body.removeChild(modal);
      resolve(false);
    };

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(agreeBtn);
    content.appendChild(btnContainer);

    modal.appendChild(content);
    document.body.appendChild(modal);
  });
}
