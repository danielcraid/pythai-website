(() => {
  const { Button } = window.PYTHAIDesignSystem_df6467;
  const Wordmark = window.PyWordmark;
  const i18n = window.PYi18n;
  const T = (de, en) => i18n.t(de, en);
  const { useState, useEffect } = React;
  const API = "https://api.pythai.ch";
  // UI-Klick-Sounds (respektieren den Mute-Schalter py_sound). cb = nach kurzem Klang ausführen (für Navigation).
  // Sounds werden vorgeladen + gecacht, damit sie vor der Navigation auch wirklich abspielen.
  window.PYsfx = (function () {
    var cache = {};
    function get(name) { if (!cache[name]) { var a = new Audio("assets/audio/ui/" + name + ".aac"); a.preload = "auto"; cache[name] = a; } return cache[name]; }
    try { ["menue-account", "menue-login", "request-sanctum-button", "login-button"].forEach(get); } catch (e) { }
    return function (name, cb) {
      var muted = false; try { muted = localStorage.getItem("py_sound") === "off"; } catch (e) { }
      if (!muted) { try { var a = get(name); a.currentTime = 0; a.volume = 0.55; var p = a.play(); if (p && p.catch) p.catch(function () { }); } catch (e) { } }
      if (cb) setTimeout(cb, muted ? 0 : 300);
    };
  })();
  const NAV = [
    ["Manifesto", "manifesto.html"],
    ["The Reading", "reading.html"],
    ["Signals", "signals.html"],
    ["Pricing", "inner-circle.html"],
    ["Shortlist", "shortlist.html"],
    ["Chartomat", "chartomat.html"],
    ["Playbook", "playbook.html"],
    ["Methodik", "methodik.html"],
    ["Rituals", "rituals.html"],
    ["My Book", "mybook.html"]
  ];
  const MEMBER_AREA = ["shortlist.html", "chartomat.html", "playbook.html", "rituals.html", "methodik.html", "mybook.html"]; // hell-gold getoent wenn eingeloggt
  const PRIV = ["inner-circle", "circle-of-trust", "syndicate", "admin"]; // Playbook + Rituals nur fuer diese Tiers
  const SYNDICATE = ["syndicate", "admin"]; // My Book nur fuer Syndicate
  const MEMBER_ONLY = []; // alle Seiten im Nav sichtbar; Voll-Content je Seite gegated (Teaser fuer Public/Observer)
  const SYNDICATE_ONLY = ["mybook.html"]; // nur fuer Syndicate sichtbar
  function navItems(me) {
    const member = !!(me && PRIV.indexOf(me.tier) !== -1 && me.approval === "approved");
    const synd = !!(me && SYNDICATE.indexOf(me.tier) !== -1 && me.approval === "approved");
    return NAV.filter(function (n) {
      if (SYNDICATE_ONLY.indexOf(n[1]) !== -1) return synd;
      return MEMBER_ONLY.indexOf(n[1]) === -1 || member;
    });
  }
  const NAV_CSS = `
.pynav-desktop{display:flex;align-items:center;gap:17px;}
.pynav-burger{display:none;align-items:center;justify-content:center;background:none;border:1px solid var(--border-strong);border-radius:6px;cursor:pointer;color:var(--text-primary);width:42px;height:38px;}
.pynav-menu{position:fixed;top:var(--nav-h);left:0;right:0;z-index:99;background:rgba(8,9,12,0.97);backdrop-filter:blur(14px);border-bottom:1px solid var(--border-subtle);padding:8px 40px 26px;display:flex;flex-direction:column;}
.pynav-menu a{font-family:var(--font-mono);font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-secondary);text-decoration:none;padding:16px 0;border-bottom:1px solid var(--border-subtle);}
.pynav-menu a:hover{color:var(--text-oracle);}
.pynav-mfoot{display:flex;flex-direction:column;gap:12px;margin-top:22px;}
@media(max-width:1200px){.pynav-desktop{display:none;}.pynav-burger{display:flex;}}
@media(min-width:1201px){.pynav-menu{display:none;}}
`;
  function useSession() {
    const [me, setMe] = useState(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
      fetch(API + "/api/me", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        if (d && d.ok) setMe(d);
      }).catch(() => {
      }).finally(() => setReady(true));
    }, []);
    return { me, ready };
  }
  function logout() {
    try { localStorage.removeItem("pythai_chat_sid"); } catch (e) { }
    fetch(API + "/api/logout", { method: "POST", credentials: "include" }).finally(() => window.location.reload());
  }
  function LangToggle() {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, ["de", "en"].map((l, i) => /* @__PURE__ */ React.createElement("span", { key: l, style: { display: "flex", alignItems: "center" } }, i === 1 && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)", margin: "0 2px", fontSize: 10 } }, "\xB7"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => i18n.set(l),
        "aria-label": l === "de" ? "Deutsch" : "English",
        style: {
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: i18n.lang === l ? "var(--text-oracle)" : "var(--text-muted)"
        }
      },
      l
    ))));
  }
  function BurgerIcon({ open }) {
    return open ? /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M6 6l12 12M18 6L6 18" })) : /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M3 6h18M3 12h18M3 18h18" }));
  }
  function AuthArea({ me, ready, full }) {
    if (!ready) return null;
    const signin = () => { window.PYsfx("menue-login", () => { window.location.href = "register.html"; }); };
    const enter = () => {
      window.location.href = "inner-circle.html#waitlist";
    };
    if (me) {
      const goAccount = () => { window.PYsfx("menue-account", () => { window.location.href = "account.html"; }); };
      const nameEl = /* @__PURE__ */ React.createElement("span", { key: "n", style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, me.nickname || me.name || me.email);
      const accBtn = /* @__PURE__ */ React.createElement(Button, { key: "a", variant: "oracle", size: "sm", full, onClick: goAccount, style: { fontSize: "1rem" } }, T("Account", "Account"));
      const outBtn = /* @__PURE__ */ React.createElement(Button, { key: "o", variant: "chrome", size: "sm", full, onClick: logout, style: { fontSize: "1rem" } }, T("Abmelden", "Log out"));
      // Desktop: Name + Account + Abmelden eng gruppiert; Mobil (full): gestapelt wie bisher
      return full
        ? /* @__PURE__ */ React.createElement(React.Fragment, null, nameEl, accBtn, outBtn)
        : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, nameEl, accBtn, outBtn);
    }
    return /* @__PURE__ */ React.createElement(Button, { variant: "oracle", size: "sm", full, onClick: signin, style: { fontSize: "1rem" } }, "Enter the Sanctum");
  }
  function SiteNav({ active }) {
    const [open, setOpen] = useState(false);
    const { me, ready } = useSession();
    const items = navItems(me);
    const loggedIn = !!me;
    const linkColor = function (href) {
      if (active === href) return "var(--text-oracle)";
      if (loggedIn && MEMBER_AREA.indexOf(href) !== -1) return "var(--oracle-pale)";
      return "var(--text-secondary)";
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", null, NAV_CSS), /* @__PURE__ */ React.createElement("nav", { style: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      height: "var(--nav-h)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      background: "rgba(8,9,12,0.6)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid var(--border-subtle)"
    } }, /* @__PURE__ */ React.createElement("a", { href: "index.html", style: { textDecoration: "none" } }, /* @__PURE__ */ React.createElement(Wordmark, null)), /* @__PURE__ */ React.createElement("div", { className: "pynav-desktop" }, items.map(([l, href]) => /* @__PURE__ */ React.createElement("a", { key: l, href, style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      textDecoration: "none",
      whiteSpace: "nowrap",
      color: linkColor(href)
    } }, l)), /* @__PURE__ */ React.createElement(LangToggle, null), /* @__PURE__ */ React.createElement(AuthArea, { me, ready })), /* @__PURE__ */ React.createElement("button", { className: "pynav-burger", "aria-label": "Menu", "aria-expanded": open, onClick: () => setOpen(!open) }, /* @__PURE__ */ React.createElement(BurgerIcon, { open }))), open && /* @__PURE__ */ React.createElement("div", { className: "pynav-menu" }, items.map(([l, href]) => /* @__PURE__ */ React.createElement("a", { key: l, href, style: { color: linkColor(href) } }, l)), /* @__PURE__ */ React.createElement("div", { className: "pynav-mfoot" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", padding: "4px 0" } }, /* @__PURE__ */ React.createElement(LangToggle, null)), /* @__PURE__ */ React.createElement(AuthArea, { me, ready, full: true }))));
  }
  function SiteFooter() {
    const FCOLS = [
      ["Oracle", [["The Reading", "reading.html"], ["Signals", "signals.html"], ["Methodik", "methodik.html"], ["Playbook", "playbook.html"], ["Manifesto", "manifesto.html"]]],
      ["Circle", [["Membership", "inner-circle.html"], ["Syndicate", "inner-circle.html"], ["Seek counsel", "inner-circle.html#waitlist"], ["Counsel", "mailto:warren@pythai.ch"]]],
      ["Legal", [[T("Risikohinweis", "Risk notice"), "legal.html#risk"], [T("AGB", "Terms"), "legal.html#terms"], [T("Datenschutz", "Privacy"), "legal.html#privacy"], [T("Impressum", "Imprint"), "legal.html#imprint"]]]
    ];
    return /* @__PURE__ */ React.createElement("footer", { style: { borderTop: "1px solid var(--border-subtle)", padding: "56px 40px 40px" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32 } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 320 } }, /* @__PURE__ */ React.createElement("a", { href: "index.html", style: { textDecoration: "none" } }, /* @__PURE__ */ React.createElement(Wordmark, { size: 18 })), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 18, color: "var(--text-muted)", margin: "20px 0 0" } }, "Wisdom, foretold.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 64, flexWrap: "wrap" } }, FCOLS.map(([h, items]) => /* @__PURE__ */ React.createElement("div", { key: h }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-oracle)", margin: "0 0 16px" } }, h), items.map(([label, href]) => /* @__PURE__ */ React.createElement("a", { key: label, href, style: { display: "block", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", marginBottom: 10, textDecoration: "none" } }, label)))))), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1240, margin: "44px auto 0", paddingTop: 22, borderTop: "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, "\xA9 2026 PYTHAI UG (i.G.) \xB7 Warren von PYTHAI"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, T("M\xE4rkte bergen Risiken. Das Orakel ist keine Beratung.", "Markets carry risk. The oracle is not advice.")))));
  }
  Object.assign(window, { SiteNav, SiteFooter });

  // ---- Sanctum ambient — site-wide soundscape with a gentle toggle ----
  (function initSound() {
    if (window.__pySound) return; window.__pySound = true;
    function boot() {
      var ICON_ON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>';
      var ICON_OFF = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M22 9l-6 6"/><path d="M16 9l6 6"/></svg>';
      var TARGET = 0.32, on = false, fadeT, gestureArmed = false;
      var audio = document.createElement("audio");
      audio.loop = true; audio.preload = "auto"; audio.volume = 0; audio.muted = true;
      [["assets/audio/sanctum.m4a", "audio/mp4"], ["assets/audio/sanctum.mp3", "audio/mpeg"]].forEach(function (s) {
        var el = document.createElement("source"); el.src = s[0]; el.type = s[1]; audio.appendChild(el);
      });
      document.body.appendChild(audio);
      // Continuity across page navigations: remember playback position + resume there.
      var SAVE_KEY = "py_sound_t";
      function savedTime() { try { return parseFloat(sessionStorage.getItem(SAVE_KEY)) || 0; } catch (e) { return 0; } }
      function saveTime() { try { sessionStorage.setItem(SAVE_KEY, String(audio.currentTime || 0)); } catch (e) { } }
      function resume() { var t = savedTime(); if (t > 0 && isFinite(t) && t < (audio.duration || 1e9)) { try { audio.currentTime = t; } catch (e) { } } }
      audio.addEventListener("loadedmetadata", resume, { once: true });
      window.addEventListener("pagehide", function () { if (on) saveTime(); });
      window.addEventListener("beforeunload", function () { if (on) saveTime(); });
      setInterval(function () { if (on && !audio.paused) saveTime(); }, 1000); // robust position save (pagehide can miss)
      function fade(to, cb) { clearInterval(fadeT); var step = (to - audio.volume) / 18; fadeT = setInterval(function () { audio.volume = Math.min(1, Math.max(0, audio.volume + step)); if (Math.abs(audio.volume - to) < 0.02) { audio.volume = to; clearInterval(fadeT); if (cb) cb(); } }, 40); }
      function pref() { try { return localStorage.getItem("py_sound"); } catch (e) { return null; } }
      function setPref(v) { try { localStorage.setItem("py_sound", v); } catch (e) { } }
      // Gesture fallback — only used when the browser blocks unmuted autoplay (very first visit).
      function unmute() { if (on && pref() !== "off") { audio.muted = false; (audio.play() || Promise.resolve()).then(function () { fade(TARGET); setHint(false); }).catch(function () { }); } disarm(); }
      function arm() { if (gestureArmed) return; gestureArmed = true; ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { window.addEventListener(ev, unmute); }); }
      function disarm() { if (!gestureArmed) return; gestureArmed = false; ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { window.removeEventListener(ev, unmute); }); }
      // Start playback: try unmuted immediately. After the first interaction the browser keeps
      // the autoplay permission for the session, so navigation stays seamless. If it's still
      // blocked (first ever visit), fall back to muted autoplay + unmute on first gesture.
      function start() { resume(); audio.muted = false; (audio.play() || Promise.resolve()).then(function () { fade(TARGET); disarm(); setHint(false); }).catch(function () { audio.muted = true; audio.play().catch(function () { }); arm(); setHint(true); }); }
      var btn = document.createElement("button");
      btn.setAttribute("aria-label", "Sound");
      btn.style.cssText = "position:fixed;left:20px;bottom:20px;z-index:300;width:42px;height:42px;border-radius:50%;border:1px solid var(--border-strong);background:rgba(8,9,12,0.7);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .2s,border-color .2s,box-shadow .2s;";
      // gentle pulse hint until the first gesture unmutes the ambient (browsers block audible autoplay)
      var hintCss = document.createElement("style");
      hintCss.textContent = "@keyframes pySoundPulse{0%{box-shadow:0 0 0 0 rgba(212,169,78,.5)}70%{box-shadow:0 0 0 13px rgba(212,169,78,0)}100%{box-shadow:0 0 0 0 rgba(212,169,78,0)}}.py-sound-hint{animation:pySoundPulse 1.9s ease-out infinite;border-color:var(--border-oracle)!important;color:var(--text-oracle)!important}";
      document.head.appendChild(hintCss);
      function setHint(v) { if (v) btn.classList.add("py-sound-hint"); else btn.classList.remove("py-sound-hint"); }
      function render() { btn.innerHTML = on ? ICON_ON : ICON_OFF; btn.style.color = on ? "var(--text-oracle)" : "var(--text-muted)"; btn.style.borderColor = on ? "var(--border-oracle)" : "var(--border-strong)"; btn.style.boxShadow = on ? "0 0 16px var(--glow-oracle-soft)" : "none"; }
      function enable() { on = true; setPref("on"); render(); start(); }
      window.PYsoundEnable = enable; // erlaubt anderen Buttons (z.B. "Hear the Sanctum"), den Ambient anzuschalten
      function disable() { on = false; setPref("off"); render(); disarm(); setHint(false); fade(0, function () { audio.pause(); audio.muted = true; }); }
      // Stop the button's own pointerdown from triggering the window unmute handler (caused a blip).
      btn.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
      btn.addEventListener("click", function () {
        if (!on) { enable(); return; }                 // was off → turn on
        if (audio.muted || audio.paused) { setPref("on"); start(); render(); return; } // on-intent but not yet audible → activate
        disable();                                       // actually playing → turn off
      });
      document.body.appendChild(btn);
      var want = pref() !== "off"; // default on, unless the user explicitly opted out
      on = want; render();
      if (want) start();
    }
    if (document.body) boot(); else document.addEventListener("DOMContentLoaded", boot);
  })();

  // Global: Session-Expired-Overlay — von jeder Seite bei 401/403 aufrufbar
  window.PYsessionExpired = function () {
    if (document.getElementById("py-sx")) return;
    var en = !!(window.PYi18n && window.PYi18n.lang === "en");
    var ov = document.createElement("div");
    ov.id = "py-sx";
    ov.setAttribute("style", "position:fixed;inset:0;z-index:9999;background:rgba(4,5,8,0.82);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px;");
    var card = document.createElement("div");
    card.setAttribute("style", "max-width:440px;width:100%;box-sizing:border-box;background:var(--bg-raised);border:1px solid var(--border-oracle);border-radius:14px;padding:28px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.6);");
    card.innerHTML =
      '<div style="font-family:var(--font-oracle);font-weight:400;font-size:26px;color:var(--oracle-bright);margin:0 0 10px">' + (en ? "Session expired." : "Sitzung abgelaufen.") + "</div>" +
      '<p style="font-family:var(--font-ui);font-size:15px;line-height:1.6;color:var(--text-secondary);margin:0 0 22px">' + (en ? "Sign in once more to continue — your data is safe." : "Melde dich einmal kurz neu an, um weiterzumachen — deine Daten sind sicher.") + "</p>" +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
      '<button id="py-sx-go" style="font-family:var(--font-ui);font-weight:600;font-size:14px;border:none;border-radius:8px;padding:11px 20px;cursor:pointer;color:var(--text-on-gold);background:var(--grad-gold)">' + (en ? "Sign in" : "Neu anmelden") + "</button>" +
      '<button id="py-sx-x" style="font-family:var(--font-ui);font-size:14px;border:1px solid var(--border-strong);background:transparent;color:var(--text-secondary);border-radius:8px;padding:11px 20px;cursor:pointer">' + (en ? "Later" : "Später") + "</button>" +
      "</div>";
    ov.appendChild(card);
    document.body.appendChild(ov);
    document.getElementById("py-sx-go").onclick = function () { window.location.href = "register.html"; };
    document.getElementById("py-sx-x").onclick = function () { ov.remove(); };
  };
})();
