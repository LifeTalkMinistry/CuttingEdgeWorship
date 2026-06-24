const PAGE_VERSION = "team-guide-v4";
const NAV_ITEMS = [
  { file: "index.html", label: "Home", icon: "⌂" },
  { file: "community.html", label: "Vision", icon: "◎" },
  { file: "updates.html", label: "Roadmap", icon: "◷" },
  { file: "explore.html", label: "Standards", icon: "✓" },
  { file: "join.html", label: "Join", icon: "＋" }
];

const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".mobile-bottom-nav").forEach((nav) => {
  nav.innerHTML = NAV_ITEMS.map(({ file, label, icon }) => {
    const isActive = currentPage === file;
    const href = `${file}?v=${PAGE_VERSION}`;
    return `
      <a href="${href}"${isActive ? ' class="active" aria-current="page"' : ""}>
        <span class="nav-icon" aria-hidden="true">${icon}</span>
        <small>${label}</small>
      </a>
    `;
  }).join("");
});

const form = document.querySelector("#interest-form");
const interestSelect = document.querySelector("#interest");
const messageSheet = document.querySelector("#message-sheet");
const generatedMessage = document.querySelector("#generated-message");
const copyButton = document.querySelector("#copy-message");
const closeButton = document.querySelector("#sheet-close");

if (interestSelect) {
  const requestedInterest = new URLSearchParams(window.location.search).get("interest");
  if (requestedInterest) {
    const option = Array.from(interestSelect.options).find(
      (item) => item.value.toLowerCase() === requestedInterest.toLowerCase()
    );
    if (option) interestSelect.value = option.value;
  }
}

if (form && messageSheet && generatedMessage) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !interest || !message) return;

    generatedMessage.value = [
      "Hello CuttingEdge Worship!",
      "",
      `My name is ${name}.`,
      `I am interested in: ${interest}.`,
      "",
      "My experience, availability, limitations, or what I would like to develop:",
      message,
      "",
      "I have reviewed the CuttingEdge Worship vision and recording-team commitment standards. I would like to request a one-on-one conversation about my willingness, present capacity, and next step in the joining or active-membership process."
    ].join("\n");

    messageSheet.hidden = false;
  });
}

if (copyButton && generatedMessage) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage.value);
    } catch {
      generatedMessage.select();
      document.execCommand("copy");
    }

    copyButton.textContent = "Message Copied!";
    window.setTimeout(() => {
      copyButton.textContent = "Copy Message";
    }, 2000);
  });
}

if (closeButton && messageSheet) {
  closeButton.addEventListener("click", () => {
    messageSheet.hidden = true;
  });
}
