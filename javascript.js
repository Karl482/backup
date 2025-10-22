const navbarLinks = Array.from(document.querySelectorAll(".nav-menu .nav-link"));
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");
const sections = Array.from(document.querySelectorAll("main section[id]"));

function setMenuExpanded(expanded) {
  if (menuOpenButton) menuOpenButton.setAttribute("aria-expanded", expanded ? "true" : "false");
}

function closeMobileMenu() {
  document.body.classList.remove("show-mobile-menu");
  setMenuExpanded(false);
}

function toggleMobileMenu() {
  const isOpen = document.body.classList.toggle("show-mobile-menu");
  setMenuExpanded(isOpen);
}

if (menuOpenButton) menuOpenButton.addEventListener("click", toggleMobileMenu);
if (menuCloseButton) menuCloseButton.addEventListener("click", closeMobileMenu);

// Show/hide SPA sections
function showSection(id, push = true) {
  if (!id) return;
  sections.forEach((s) => s.classList.add("spa-hidden"));
  const target = document.getElementById(id);
  if (!target) return;

  target.classList.remove("spa-hidden");

  // update nav active state
  navbarLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("active", href === `#${id}`);
  });

  // history + title
  const title = target.dataset.title || target.querySelector(".section-title")?.textContent?.trim() || id;
  if (push) history.pushState({ section: id }, "", `#${id}`);
  document.title = `${title} — Karlito's Kapehan sa Gabi`;

  // valid scroll behavior values: "auto" or "smooth"
  window.scrollTo({ top: 0, behavior: "auto" });
  closeMobileMenu();
}

// intercept nav clicks (SPA navigation)
navbarLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const id = href.slice(1) || "home";
    showSection(id);
  });
});

// handle back / forward
window.addEventListener("popstate", (e) => {
  const id = (e.state && e.state.section) || location.hash.replace("#", "") || "home";
  showSection(id, false);
});

document.addEventListener("DOMContentLoaded", () => {
  // initial page load
  const initial = location.hash.replace("#", "") || "home";
  showSection(initial, false);

  // init Swiper if present
  if (typeof Swiper !== "undefined" && document.querySelector(".slider-wrapper")) {
    new Swiper(".slider-wrapper", {
      loop: true,
      grabCursor: true,
      spaceBetween: 25,
      pagination: { el: ".swiper-pagination", clickable: true, dynamicBullets: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    });
  }

  // Order modal behavior
  const orderBtn = document.querySelector(".order-now");
  const modal = document.getElementById("order-modal");
  const closeBtn = modal?.querySelector(".modal-close");
  const overlay = modal?.querySelector(".modal-overlay");
  const cancelBtn = modal?.querySelector(".modal-cancel");
  const form = document.getElementById("order-form");

  function openModal() {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    const first = modal.querySelector("input, select, textarea, button");
    first?.focus();
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    orderBtn?.focus();
  }

  orderBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    console.log("Order submitted", payload);
    alert("Thanks! Your order was received.");
    form.reset();
    closeModal();
  });
});