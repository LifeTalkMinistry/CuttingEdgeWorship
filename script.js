document.querySelectorAll(".current-year").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const opportunityCards = document.querySelectorAll(".opportunity-card");
opportunityCards.forEach((card) => {
  const button = card.querySelector(".opportunity-toggle");
  if (!button) return;

  button.addEventListener("click", () => {
    const opening = !card.classList.contains("open");
    opportunityCards.forEach((otherCard) => {
      otherCard.classList.remove("open");
      const otherButton = otherCard.querySelector(".opportunity-toggle");
      if (otherButton) otherButton.setAttribute("aria-expanded", "false");
    });

    if (opening) {
      card.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const filterButtons = document.querySelectorAll(".filter-chip");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));

    opportunityCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(" ");
      card.hidden = filter !== "all" && !categories.includes(filter);
      if (card.hidden) {
        card.classList.remove("open");
        card.querySelector(".opportunity-toggle")?.setAttribute("aria-expanded", "false");
      }
    });
  });
});

const segmentButtons = document.querySelectorAll(".segment-button");
const tabPanels = document.querySelectorAll(".tab-panel");
segmentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;
    segmentButtons.forEach((item) => item.classList.toggle("active", item === button));
    tabPanels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === target));
  });
});

const openHashTarget = () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target || !target.classList.contains("opportunity-card")) return;

  target.hidden = false;
  target.classList.add("open");
  target.querySelector(".opportunity-toggle")?.setAttribute("aria-expanded", "true");
  window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 180);
};

window.addEventListener("hashchange", openHashTarget);
openHashTarget();

const interestForm = document.querySelector("#interest-form");
const formResult = document.querySelector("#form-result");
const generatedMessage = document.querySelector("#generated-message");
const copyButton = document.querySelector("#copy-message");

if (interestForm) {
  const requestedInterest = new URLSearchParams(window.location.search).get("interest");
  if (requestedInterest) {
    const matchingRadio = Array.from(interestForm.querySelectorAll('input[name="interest"]')).find(
      (radio) => radio.value.toLowerCase() === requestedInterest.toLowerCase()
    );
    if (matchingRadio) matchingRadio.checked = true;
  }

  interestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(interestForm);
    const name = String(data.get("name") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const experience = String(data.get("experience") || "").trim();
    const goal = String(data.get("goal") || "").trim();

    if (!name || !interest || !experience || !goal || !formResult || !generatedMessage) return;

    generatedMessage.value = [
      "Hello CuttingEdge Worship!",
      "",
      `My name is ${name}.`,
      `I am interested in: ${interest}.`,
      "",
      "My experience or starting point:",
      experience,
      "",
      "What I would like to learn, develop, or contribute:",
      goal,
      "",
      "I would like to know how I can take the next step with the community."
    ].join("\n");

    formResult.hidden = false;
    formResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

if (copyButton && generatedMessage) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage.value);
    } catch {
      generatedMessage.focus();
      generatedMessage.select();
      document.execCommand("copy");
    }

    copyButton.textContent = "Message Copied!";
    window.setTimeout(() => {
      copyButton.textContent = "Copy Message";
    }, 2200);
  });
}
