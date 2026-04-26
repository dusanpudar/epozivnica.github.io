/* ═══════════════════════════════════════════════
   e_pozivnica.rs — Glavni JavaScript
   ═══════════════════════════════════════════════ */

// ── SMOOTH SCROLL BEZ # U URL-U ──
// Intercept sve href="#section" linkove — skroluj bez dodavanja # u URL
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      // Zatvori mobilni meni ako je otvoren
      document.querySelector('.nav-inner')?.classList.remove('menu-open');

      const target = link.getAttribute("href");
      if (target === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", window.location.pathname);
        return;
      }
      const el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        // Ažuriraj URL bez # da ostane čist
        history.pushState(null, "", window.location.pathname);
      }
    });
  });
});

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.06 },
);
document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

// ── NAV SHADOW NA SCROLL ──
window.addEventListener(
  "scroll",
  () => {
    document
      .getElementById("nav")
      .classList.toggle("scrolled", window.scrollY > 12);
  },
  { passive: true },
);

// ── SUBMIT FORME ──
function submitForm() {
  const ime = document.getElementById("f-ime").value.trim();
  const tel = document.getElementById("f-tel").value.trim();
  const email = document.getElementById("f-email").value.trim();
  const tip = document.getElementById("f-tip").value;
  const paket = document.getElementById("f-paket").value;
  const datum = document.getElementById("f-datum").value;
  const imena = document.getElementById("f-imena").value.trim();

  if (!ime || !tel || !email || !tip || !paket || !datum || !imena) {
    alert("Molimo popunite sva obavezna polja (*).");
    return;
  }

  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz126Vk5RlxJ5Qh95xfiIPuwegyqqIoKgYZWWsY3CeBdGsuFBb9BAZqPqgTLtQdtrer/exec";

  const payload = {
    email:    email,
    ime:      ime,
    tel:      tel,
    tip:      tip,
    paket:    paket,
    datum:    datum,
    lokacija: document.getElementById("f-lok").value,
    imena:    imena,
    napomena: document.getElementById("f-napomena").value
  };

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload),
    mode: "no-cors",
  }).catch(() => {});

  // Prikaži success poruku
  document.getElementById("formFields").classList.add("hide");
  document.getElementById("formSuccess").classList.add("show");
}

// ── TWEAKS PANEL (Claude edit mode) ──
window.addEventListener("message", (e) => {
  if (e.data?.type === "__activate_edit_mode")
    document.getElementById("tweaksPanel").style.display = "block";
  if (e.data?.type === "__deactivate_edit_mode")
    document.getElementById("tweaksPanel").style.display = "none";
});
window.parent.postMessage({ type: "__edit_mode_available" }, "*");

function tweakLogo(v) {
  document
    .querySelectorAll(".nav-logo img, .hero-card-logo, .f-brand-logo img")
    .forEach((el) => {
      el.style.width = v + "px";
      el.style.height = v + "px";
    });
  window.parent.postMessage(
    { type: "__edit_mode_set_keys", edits: { logoSize: +v } },
    "*",
  );
}

function tweakBg(color) {
  document.body.style.background = color;
  document
    .querySelectorAll(".hero")
    .forEach((el) => (el.style.background = color));
  window.parent.postMessage(
    { type: "__edit_mode_set_keys", edits: { bgColor: color } },
    "*",
  );
}

function tweakAccent(main, light, dark) {
  const r = document.documentElement.style;
  r.setProperty("--gold", main);
  r.setProperty("--gold-l", light);
  r.setProperty("--gold-d", dark);
  window.parent.postMessage(
    {
      type: "__edit_mode_set_keys",
      edits: { accentMain: main, accentLight: light, accentDark: dark },
    },
    "*",
  );
}
