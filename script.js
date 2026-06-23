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
      `I am interested in serving through: ${interest}.`,
      "",
      "My experience or what I would like to develop:",
      message,
      "",
      "I would like to know how I can take the next step in serving through the worship and creative music department of the Young Professional Service."
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
