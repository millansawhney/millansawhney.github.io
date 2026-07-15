// Flag that JS is running (enables reveal animations in CSS)
document.documentElement.classList.add("js");

/* ---------- Mobile navigation ---------- */
const navToggle = document.getElementById("nav-toggle");
const navList = document.getElementById("nav-list");

function setNav(open) {
  navList.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    setNav(!navList.classList.contains("open"));
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNav(false);
  });

  document.addEventListener("click", (e) => {
    if (
      navList.classList.contains("open") &&
      !navList.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      setNav(false);
    }
  });
}

/* ---------- Highlight the nav link for the section in view ---------- */
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* ---------- Reveal elements as they scroll into view ---------- */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const revealEls = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

/* ---------- Keep the footer year current ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Count-up stats ---------- */
const statEls = document.querySelectorAll(".stats strong[data-count]");

function animateStat(el) {
  const raw = el.dataset.count;
  const suffix = el.dataset.suffix || "";
  const decimals = (raw.split(".")[1] || "").length;
  const target = parseFloat(raw);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (statEls.length) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    statEls.forEach((el) => {
      el.textContent = el.dataset.count + (el.dataset.suffix || "");
    });
  } else {
    const statObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statEls.forEach((el) => statObserver.observe(el));
  }
}
