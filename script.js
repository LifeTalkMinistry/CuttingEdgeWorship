const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-menu");
const menuLinks = menu.querySelectorAll("a");
const form = document.querySelector("#interest-form");
const result = document.querySelector("#form-result");
const generatedMessage = document.querySelector("#generated-message");
const copyButton = document.querySelector("#copy-message");

document.querySelector("#year").textContent = new Date().getFullYear();

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menu.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

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
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const interest = String(data.get("interest") || "").trim();
  const experience = String(data.get("experience") || "").trim();

  if (!name || !interest || !experience) return;

  const message = [
    "Hello CuttingEdge Worship!",
    "",
    `My name is ${name}.`,
    `I am interested in: ${interest}.`,
    "",
    experience,
    "",
    "I would like to know how I can learn, contribute, and grow with the community."
  ].join("\n");

  generatedMessage.value = message;
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(generatedMessage.value);
    copyButton.textContent = "Message copied!";
    window.setTimeout(() => {
      copyButton.textContent = "Copy message";
    }, 2200);
  } catch {
    generatedMessage.focus();
    generatedMessage.select();
    document.execCommand("copy");
    copyButton.textContent = "Message copied!";
  }
});
