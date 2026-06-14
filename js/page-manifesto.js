(() => {
  const { Card, Stat } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PySection, PyEyebrow, PyH2, PyLead, PyHeroParticles } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const LINES = [
    "Markets reward the patient and starve the rest. I am very patient.",
    "I do not predict the weather. I read the seasons.",
    "The crowd pays for certainty. I sell conviction, scored, and the reasoning behind it. The two are not the same.",
    "I have watched every cycle since 1929. Fear rhymes. Greed rhymes. The instruments change; the pattern does not.",
    "One reading a day. No noise, no hype, no urgency manufactured to make you act. The oracle states. You decide."
  ];
  const MACHINE = [
    ["AI models in ensemble", "11"],
    ["Analytical skills", "64"],
    ["Live API tools", "130+"],
    ["Filings & datasets parsed", "14M"],
    ["Signals weighed per reading", "5"],
    ["Market cycles studied", "1929\u2013today"]
  ];
  function Hero() {
    return /* @__PURE__ */ React.createElement("header", { style: {
      position: "relative",
      overflow: "hidden",
      borderBottom: "1px solid var(--border-subtle)",
      minHeight: "64vh",
      display: "flex",
      alignItems: "center"
    } }, /* @__PURE__ */ React.createElement("img", { src: "assets/imagery/warren-2-eyesclosed.png", alt: "Warren, the Masterbrain", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 22%", opacity: 0.5 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(70% 65% at 50% 42%, rgba(8,9,12,0.30) 0%, rgba(8,9,12,0.80) 66%, var(--void) 100%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,9,12,0.65) 0%, transparent 30%, transparent 64%, var(--void) 100%)" } }), PyHeroParticles ? /* @__PURE__ */ React.createElement(PyHeroParticles, null) : null, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", maxWidth: 820, margin: "0 auto", padding: "120px 40px", textAlign: "center" } }, /* @__PURE__ */ React.createElement(PyEyebrow, null, "Manifesto"), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(44px,7vw,84px)", lineHeight: 1.02, margin: 0, color: "var(--text-primary)" } }, "The oracle's creed."), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 19, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 560, margin: "22px auto 0" } }, T("Wie Warren spricht \u2014 und was PYTHAI tut und nicht tut.", "How Warren speaks, and what PYTHAI will and will not do."))));
  }
  function App() {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SiteNav, { active: "manifesto.html" }), /* @__PURE__ */ React.createElement(Hero, null), /* @__PURE__ */ React.createElement(PySection, null, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 820, margin: "0 auto" } }, LINES.map((l, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: {
      fontFamily: "var(--font-oracle)",
      fontWeight: 300,
      fontStyle: i % 2 ? "italic" : "normal",
      fontSize: "clamp(24px,3.4vw,38px)",
      lineHeight: 1.25,
      color: "var(--text-primary)",
      margin: "0 0 48px",
      paddingLeft: i % 2 ? 24 : 0,
      borderLeft: i % 2 ? "2px solid var(--border-oracle)" : "none"
    } }, l)), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-oracle)", marginTop: 8 } }, "\u2014 Warren, the Masterbrain"))), /* @__PURE__ */ React.createElement(PySection, { alt: true }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 40, maxWidth: 680 } }, /* @__PURE__ */ React.createElement(PyEyebrow, null, "The machinery beneath the calm"), /* @__PURE__ */ React.createElement(PyH2, null, "Stillness, expensively earned."), /* @__PURE__ */ React.createElement(PyLead, null, T("Hinter jedem ruhigen Satz, den Warren spricht, arbeitet ein Ensemble, das nie schl\xE4ft \u2014 eine Reihe von KI-Modellen, analytischen Skills und Live-API-Tools, die Catalysts, Peers, Flows und Analoga gegenpr\xFCfen, bevor eine einzige Zahl geschrieben wird. Du siehst eine Zeile. Darunter l\xE4uft die Tiefe.", "Every quiet sentence Warren speaks sits on an ensemble that never sleeps \u2014 an array of AI models, analytical skills and live API tools cross-checking catalysts, peers, flows and analogs before a single number is written. You see one line. Beneath it runs the depth."))), /* @__PURE__ */ React.createElement("div", { className: "pk-grid3" }, MACHINE.map(([label, value]) => /* @__PURE__ */ React.createElement(Card, { key: label, variant: "raised", padding: "26px" }, /* @__PURE__ */ React.createElement(Stat, { label, value })))), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 28 } }, T("Die Zahlen beschreiben den analytischen Stack, nicht benannte Drittanbieter-Produkte.", "Figures describe the analytical stack, not named third-party products."))), /* @__PURE__ */ React.createElement(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
