/* PYTHAI · /methodik — mountet die gemeinsame Nav/Footer um den statischen Methodik-Inhalt
   und ersetzt fehlende Screenshots durch einen sauberen Platzhalter. */
(() => {
  const { SiteNav, SiteFooter } = window;
  function mount() {
    if (!window.React || !window.ReactDOM || !SiteNav || !SiteFooter) return setTimeout(mount, 60);
    const nav = document.getElementById("py-nav");
    const foot = document.getElementById("py-footer");
    if (nav) ReactDOM.createRoot(nav).render(React.createElement(SiteNav, { active: "methodik.html" }));
    if (foot) ReactDOM.createRoot(foot).render(React.createElement(SiteFooter, null));
    // Screenshot-Fallback: fehlt das PNG → "Screenshot folgt"-Platzhalter
    const T = (de, en) => (window.PYi18n ? window.PYi18n.t(de, en) : de);
    document.querySelectorAll(".screenshot img").forEach((img) => {
      img.addEventListener("error", () => {
        const fig = img.closest("figure");
        if (!fig) return;
        const cap = fig.querySelector("figcaption");
        const ph = document.createElement("div");
        ph.className = "screenshot-ph";
        ph.textContent = T("Screenshot folgt", "Screenshot coming");
        img.replaceWith(ph);
        if (cap) cap.remove();
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
