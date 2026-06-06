(() => {
  const { Card, Stat, Badge } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PyPageHead, PySection, PyH2, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  function App() {
    const PAST = [
      { name: "Xetra-Gold ETC", klasse: T("Rohstoff", "Commodity"), conv: "50", res: "+3.0%", won: true, note: T("Macro-Hedge in den NFP. Bei +1,5% geskimmt, kein Carry \xFCbers Wochenende.", "Macro hedge into NFP. Skimmed at +1.5%, no weekend carry.") },
      { name: "Rheinmetall AG", klasse: T("Aktie", "Equity"), conv: "70", res: "+8.5%", won: true, note: T("NATO-Auftragsflow. Gestaffelter Entry am VWAP-Pullback.", "NATO order flow. Staggered entry on the VWAP pullback.") },
      { name: "Bitcoin \xB7 BTC/EUR", klasse: T("Krypto", "Crypto"), conv: "85", res: "+12.8%", won: true, note: T("Vol-Expansion-Setup vor FOMC. Kernposition, kein Hebel > 2x.", "Vol-expansion setup pre-FOMC. Core position, no leverage > 2x.") }
    ];
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SiteNav, { active: "signals.html" }), /* @__PURE__ */ React.createElement(
      PyPageHead,
      {
        eyebrow: "Track record",
        title: "The tape remembers.",
        sub: T("Jede Reading wird mit ihrer Conviction und ihrem Ergebnis protokolliert. Illustrative Zahlen \u2014 siehe Disclaimer unten.", "Every reading is logged with its conviction and its outcome. Illustrative figures shown \u2014 see the disclaimer below.")
      }
    ), /* @__PURE__ */ React.createElement(PySection, null, /* @__PURE__ */ React.createElement("div", { className: "pk-grid3" }, /* @__PURE__ */ React.createElement(Stat, { label: "Win rate '25", value: "73.8%", delta: "+4.2%" }), /* @__PURE__ */ React.createElement(Stat, { label: "Avg conviction", value: "91", sub: "of 100" }), /* @__PURE__ */ React.createElement(Stat, { label: "Members", value: "11,204" }))), /* @__PURE__ */ React.createElement(PySection, { alt: true }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 40 } }, /* @__PURE__ */ React.createElement(PyEyebrow, null, "Recently closed"), /* @__PURE__ */ React.createElement(PyH2, null, "Three readings, three outcomes.")), /* @__PURE__ */ React.createElement("div", { className: "pk-grid3" }, PAST.map((s) => /* @__PURE__ */ React.createElement(Card, { key: s.name, variant: "raised", padding: "26px" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Badge, { tone: "neutral", variant: "outline" }, s.klasse), /* @__PURE__ */ React.createElement(Badge, { tone: s.won ? "bull" : "bear" }, s.res)), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 24, color: "var(--text-primary)", marginBottom: 14 } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Stat, { label: "Conviction at call", value: s.conv, sub: "of 100", size: "sm" })), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 } }, s.note)))), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, marginTop: 32, maxWidth: "90ch" } }, T("Illustrative Zahlen zur Demonstration. Vergangene Performance ist kein Indikator f\xFCr k\xFCnftige Ergebnisse. PYTHAI erbringt keine Anlageberatung \u2014 siehe vollst\xE4ndigen Risikohinweis.", "Illustrative figures for demonstration. Past performance is not indicative of future results. PYTHAI provides no investment advice \u2014 see the full risk notice."))), /* @__PURE__ */ React.createElement(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
