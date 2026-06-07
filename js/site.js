(() => {
  const { Button } = window.PYTHAIDesignSystem_df6467;
  const Wordmark = window.PyWordmark;
  const i18n = window.PYi18n;
  const T = (de, en) => i18n.t(de, en);
  const { useState, useEffect } = React;
  const API = "https://api.pythai.ch";
  const NAV = [
    ["The Reading", "reading.html"],
    ["Manifesto", "manifesto.html"],
    ["Signals", "signals.html"],
    ["Chartomat", "chartomat.html"],
    ["Inner Circle", "inner-circle.html"],
    ["Playbook", "playbook.html"],
    ["Rituals", "rituals.html"]
  ];
  const PRIV = ["inner-circle", "syndicate", "admin"]; // Playbook + Rituals nur fuer diese Tiers
  const MEMBER_ONLY = ["playbook.html", "rituals.html"];
  function navItems(me) {
    const tier = me && me.tier;
    return NAV.filter(function (n) { return MEMBER_ONLY.indexOf(n[1]) === -1 || PRIV.indexOf(tier) !== -1; });
  }
  const NAV_CSS = `
.pynav-desktop{display:flex;align-items:center;gap:28px;}
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
    const signin = () => {
      window.location.href = "register.html";
    };
    const enter = () => {
      window.location.href = "inner-circle.html#waitlist";
    };
    if (me) {
      const goAccount = () => {
        window.location.href = "account.html";
      };
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, me.email), /* @__PURE__ */ React.createElement(Button, { variant: "oracle", size: "sm", full, onClick: goAccount }, T("Account", "Account")), /* @__PURE__ */ React.createElement(Button, { variant: "chrome", size: "sm", full, onClick: logout }, T("Abmelden", "Log out")));
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { variant: "chrome", size: "sm", full, onClick: signin }, "Sign in"), /* @__PURE__ */ React.createElement(Button, { variant: "oracle", size: "sm", full, onClick: enter }, "Enter the Sanctum"));
  }
  function SiteNav({ active }) {
    const [open, setOpen] = useState(false);
    const { me, ready } = useSession();
    const items = navItems(me);
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
      color: active === href ? "var(--text-oracle)" : "var(--text-secondary)"
    } }, l)), /* @__PURE__ */ React.createElement(LangToggle, null), /* @__PURE__ */ React.createElement(AuthArea, { me, ready })), /* @__PURE__ */ React.createElement("button", { className: "pynav-burger", "aria-label": "Menu", "aria-expanded": open, onClick: () => setOpen(!open) }, /* @__PURE__ */ React.createElement(BurgerIcon, { open }))), open && /* @__PURE__ */ React.createElement("div", { className: "pynav-menu" }, items.map(([l, href]) => /* @__PURE__ */ React.createElement("a", { key: l, href, style: { color: active === href ? "var(--text-oracle)" : "var(--text-secondary)" } }, l)), /* @__PURE__ */ React.createElement("div", { className: "pynav-mfoot" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", padding: "4px 0" } }, /* @__PURE__ */ React.createElement(LangToggle, null)), /* @__PURE__ */ React.createElement(AuthArea, { me, ready, full: true }))));
  }
  function SiteFooter() {
    const FCOLS = [
      ["Oracle", [["The Reading", "reading.html"], ["Signals", "signals.html"], ["Playbook", "playbook.html"], ["Manifesto", "manifesto.html"]]],
      ["Circle", [["Membership", "inner-circle.html"], ["Syndicate", "inner-circle.html"], ["Seek counsel", "inner-circle.html#waitlist"], ["Counsel", "mailto:warren@pythai.ch"]]],
      ["Legal", [[T("Risikohinweis", "Risk notice"), "legal.html#risk"], [T("AGB", "Terms"), "legal.html#terms"], [T("Datenschutz", "Privacy"), "legal.html#privacy"], [T("Impressum", "Imprint"), "legal.html#imprint"]]]
    ];
    return /* @__PURE__ */ React.createElement("footer", { style: { borderTop: "1px solid var(--border-subtle)", padding: "56px 40px 40px" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32 } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 320 } }, /* @__PURE__ */ React.createElement("a", { href: "index.html", style: { textDecoration: "none" } }, /* @__PURE__ */ React.createElement(Wordmark, { size: 18 })), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 18, color: "var(--text-muted)", margin: "20px 0 0" } }, "Wisdom, foretold.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 64, flexWrap: "wrap" } }, FCOLS.map(([h, items]) => /* @__PURE__ */ React.createElement("div", { key: h }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-oracle)", margin: "0 0 16px" } }, h), items.map(([label, href]) => /* @__PURE__ */ React.createElement("a", { key: label, href, style: { display: "block", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", marginBottom: 10, textDecoration: "none" } }, label)))))), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1240, margin: "44px auto 0", paddingTop: 22, borderTop: "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, "\xA9 2026 PYTHAI \xB7 Warren von PYTHAI \xB7 AI Unit of CRAID GmbH"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, T("M\xE4rkte bergen Risiken. Das Orakel ist keine Beratung.", "Markets carry risk. The oracle is not advice.")))));
  }
  Object.assign(window, { SiteNav, SiteFooter });

  // ---- Sanctum ambient — site-wide soundscape with a gentle toggle ----
  (function initSound() {
    if (window.__pySound) return; window.__pySound = true;
    function boot() {
      var ICON_ON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>';
      var ICON_OFF = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M22 9l-6 6"/><path d="M16 9l6 6"/></svg>';
      var TARGET = 0.32, on = false, fadeT;
      var audio = document.createElement("audio");
      audio.loop = true; audio.preload = "auto"; audio.volume = 0;
      [["assets/audio/sanctum.mp3", "audio/mpeg"], ["assets/audio/sanctum.m4a", "audio/mp4"]].forEach(function (s) {
        var el = document.createElement("source"); el.src = s[0]; el.type = s[1]; audio.appendChild(el);
      });
      document.body.appendChild(audio);
      function fade(to, cb) { clearInterval(fadeT); var step = (to - audio.volume) / 18; fadeT = setInterval(function () { audio.volume = Math.min(1, Math.max(0, audio.volume + step)); if (Math.abs(audio.volume - to) < 0.02) { audio.volume = to; clearInterval(fadeT); if (cb) cb(); } }, 40); }
      function pref() { try { return localStorage.getItem("py_sound"); } catch (e) { return null; } }
      function setPref(v) { try { localStorage.setItem("py_sound", v); } catch (e) { } }
      var btn = document.createElement("button");
      btn.setAttribute("aria-label", "Sound");
      btn.style.cssText = "position:fixed;left:20px;bottom:20px;z-index:300;width:42px;height:42px;border-radius:50%;border:1px solid var(--border-strong);background:rgba(8,9,12,0.7);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .2s,border-color .2s,box-shadow .2s;";
      function render() { btn.innerHTML = on ? ICON_ON : ICON_OFF; btn.style.color = on ? "var(--text-oracle)" : "var(--text-muted)"; btn.style.borderColor = on ? "var(--border-oracle)" : "var(--border-strong)"; btn.style.boxShadow = on ? "0 0 16px var(--glow-oracle-soft)" : "none"; }
      function enable() { on = true; setPref("on"); render(); (audio.play() || Promise.resolve()).then(function () { fade(TARGET); }).catch(function () { }); }
      function disable() { on = false; setPref("off"); render(); fade(0, function () { audio.pause(); }); }
      btn.addEventListener("click", function () { on ? disable() : enable(); });
      document.body.appendChild(btn);
      // default: sound on-intent (starts gently on first deliberate gesture); muted only if user opted out
      var want = pref() === null ? true : pref() === "on";
      on = want; render();
      if (want) {
        (audio.play() || Promise.resolve()).then(function () { fade(TARGET); }).catch(function () {
          var resume = function () { (audio.play() || Promise.resolve()).then(function () { fade(TARGET); }).catch(function () { }); clear(); };
          var clear = function () { ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { window.removeEventListener(ev, resume); }); };
          ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { window.addEventListener(ev, resume); });
        });
      }
    }
    if (document.body) boot(); else document.addEventListener("DOMContentLoaded", boot);
  })();
})();
