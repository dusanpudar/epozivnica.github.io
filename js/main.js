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

  const GOOGLE_FORM_ID = "1FAIpQLSfcoFHtuAk4u_8KUx6R89Cf3zQmL-kIaV_2WVzcK7zgr1zV3A"; // ⚠️ ZAMENITI sa pravim ID iz viewform URL-a!

  // Parsuj datetime-local vrednost (format: "2025-06-14T17:00")
  const dt = datum ? new Date(datum) : null;
  const dtYear   = dt ? dt.getFullYear() : "";
  const dtMonth  = dt ? dt.getMonth() + 1 : "";
  const dtDay    = dt ? dt.getDate() : "";
  let   dtHour   = dt ? dt.getHours() : "";
  const dtMinute = dt ? String(dt.getMinutes()).padStart(2, "0") : "";
  const dtAmPm   = dt ? (dtHour >= 12 ? "PM" : "AM") : "";
  if (dtHour > 12) dtHour -= 12;
  if (dtHour === 0) dtHour = 12;

  const params = new URLSearchParams();
  params.append("emailAddress",      email);                                           // Email
  params.append("entry.1827375957",  ime);                                             // Ime i Prezime
  params.append("entry.4705190",     tel);                                             // Kontakt telefon
  params.append("entry.718505163",   tip);                                             // Tip pozivnice
  params.append("entry.1406882663",  paket);                                           // Paket
  // Datum i Vreme proslave — Google Date+Time tip šalje odvojeno
  params.append("entry.1421344001_year",   dtYear);
  params.append("entry.1421344001_month",  dtMonth);
  params.append("entry.1421344001_day",    dtDay);
  params.append("entry.1421344001_hour",   dtHour);
  params.append("entry.1421344001_minute", dtMinute);
  params.append("entry.1421344001_meridiem", dtAmPm);
  params.append("entry.1840648943",  document.getElementById("f-lok").value);         // Lokacija
  params.append("entry.1305175406",  imena);                                           // Ime(na) na pozivnici
  params.append("entry.1620895950",  document.getElementById("f-napomena").value);    // Napomena

  // Google Forms prima no-cors POST na /formResponse endpoint
  fetch(
    `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      mode: "no-cors",
    },
  ).catch(() => {}); // tišina — fallback je Instagram DM

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
