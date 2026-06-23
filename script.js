const mobileNavStyle = document.createElement("style");
mobileNavStyle.textContent = `
@media (max-width: 720px) {
  body {
    padding-bottom: calc(94px + env(safe-area-inset-bottom));
  }

  main {
    padding-bottom: 18px;
  }

  .mobile-bottom-nav {
    min-height: calc(72px + env(safe-area-inset-bottom));
    padding: 7px 8px env(safe-area-inset-bottom);
    background: #09090d;
    border-top: 1px solid rgba(255, 255, 255, 0.13);
    box-shadow: 0 -14px 34px rgba(0, 0, 0, 0.5);
    backdrop-filter: none;
  }

  .mobile-bottom-nav a {
    gap: 3px;
    color: #777480;
  }

  .mobile-bottom-nav a::before {
    display: none !important;
  }

  .mobile-bottom-nav .nav-icon,
  .mobile-bottom-nav .join-nav .nav-icon {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    color: #777480;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 50%;
    font-size: 1.08rem;
    line-height: 1;
    transition: background 160ms ease, color 160ms ease, transform 160ms ease;
  }

  .mobile-bottom-nav a.active,
  .mobile-bottom-nav .join-nav.active {
    color: var(--accent);
  }

  .mobile-bottom-nav a.active .nav-icon,
  .mobile-bottom-nav .join-nav.active .nav-icon {
    color: var(--ink);
    background: var(--accent);
    border-color: var(--accent);
    transform: translateY(-1px);
  }

  .mobile-bottom-nav small {
    font-size: 0.6rem;
    font-weight: 800;
  }

  .opportunity-card,
  .rail-card,
  .vision-swipe-card,
  .reflection-swipe-card,
  .milestone-card,
  .form-result {
    scroll-margin-bottom: 105px;
  }
}
`;
document.head.appendChild(mobileNavStyle);

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
