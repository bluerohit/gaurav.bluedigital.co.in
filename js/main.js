// Mobile menu toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "✕" : "☰";
  });
}

// Overlay header: switch to a solid background once the visitor scrolls
const overlayHeader = document.querySelector(".site-header--overlay");

if (overlayHeader) {
  const update = () => overlayHeader.classList.toggle("is-scrolled", window.scrollY > 40);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Photo gallery: show the first 12, expand on demand, open photos in a lightbox
const gallery = document.querySelector("[data-gallery]");

if (gallery) {
  const items = [...gallery.querySelectorAll(".gallery-item")];
  const more = document.querySelector("[data-gallery-more]");

  gallery.classList.add("is-collapsed");
  if (more) {
    more.addEventListener("click", () => {
      gallery.classList.remove("is-collapsed");
      more.remove();
    });
  }

  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML = `
    <button class="lb-close" aria-label="Close">✕</button>
    <button class="lb-prev" aria-label="Previous photo">‹</button>
    <img alt="">
    <p></p>
    <button class="lb-next" aria-label="Next photo">›</button>`;
  document.body.appendChild(box);

  const boxImg = box.querySelector("img");
  const boxCap = box.querySelector("p");
  let current = 0;

  const show = (i) => {
    current = (i + items.length) % items.length;
    const img = items[current].querySelector("img");
    boxImg.src = img.src;
    boxImg.alt = img.alt;
    boxCap.textContent = items[current].querySelector("figcaption").textContent;
  };

  const close = () => {
    box.classList.remove("open");
    document.body.style.overflow = "";
  };

  items.forEach((item, i) => {
    item.addEventListener("click", () => {
      show(i);
      box.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
  box.addEventListener("click", (e) => {
    if (e.target === box) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

// Contact form: opens the visitor's email app with the message filled in.
// Replace with a form service (Formspree, Google Forms, etc.) when the site goes live.
const form = document.querySelector("#contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = `${data.get("topic")} enquiry from ${data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Organisation: ${data.get("org") || "-"}`,
      `Enquiry: ${data.get("topic")}`,
      "",
      data.get("message"),
    ].join("\n");
    window.location.href = `mailto:gaurav@bluedigital.co.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
