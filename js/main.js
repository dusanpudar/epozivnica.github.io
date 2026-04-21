/* ═══════════════════════════════════════════════
   e_pozivnica.rs — Glavni JavaScript
   ═══════════════════════════════════════════════ */

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

  // Slanje na Google Forms u pozadini (no-cors)
  const formData = new FormData();
  // ⚠️ ZAMENITI sa pravim Entry ID-jevima iz vašeg Google Forms-a
  formData.append("entry.1", ime);
  formData.append("entry.2", tel);
  formData.append("entry.3", email);
  formData.append("entry.4", tip);
  formData.append("entry.5", paket);
  formData.append("entry.6", datum);
  formData.append("entry.7", document.getElementById("f-lok").value);
  formData.append("entry.8", imena);
  formData.append("entry.9", document.getElementById("f-napomena").value);

  fetch("https://forms.gle/ZwNYQig7HsLEMxuh7", {
    method: "POST",
    body: formData,
    mode: "no-cors",
  }).catch(() => {}); // tišina — fallback je Instagram DM

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
