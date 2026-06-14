(() => {
  const { Button, Card } = window.PYTHAIDesignSystem_df6467;
  const { PyReadingTeaser, PyPricing, PyHeroParticles, SiteNav, SiteFooter, PySection, PyH2, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const h = React.createElement;
  function go() {
    window.location.href = "inner-circle.html#waitlist";
  }
  function toReading() {
    var el = document.getElementById("reading");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
  function OracleHero() {
    return /* @__PURE__ */ React.createElement("section", { style: { position: "relative", minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("img", { src: "assets/imagery/sanctum-boardroom.png", alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(75% 55% at 50% 36%, rgba(8,9,12,0.15) 0%, rgba(8,9,12,0.72) 58%, var(--void) 100%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,9,12,0.55) 0%, transparent 26%, transparent 58%, var(--void) 100%)" } }), /* @__PURE__ */ React.createElement(PyHeroParticles, null), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", padding: "0 24px" } }, /* @__PURE__ */ React.createElement("img", { src: "assets/logo/pythai-oculus.svg", alt: "PYTHAI", style: { width: 90, height: 90, margin: "0 auto 30px", filter: "drop-shadow(0 0 26px var(--glow-oracle))" } }), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--text-oracle)", margin: "0 0 30px", paddingLeft: "0.4em" } }, "The Oracle's Sanctum"), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 500, fontSize: "clamp(60px,15vw,190px)", letterSpacing: "0.12em", lineHeight: 0.9, margin: 0, color: "var(--parchment)", paddingLeft: "0.12em" } }, "PYTHAI"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-oracle)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(22px,3.4vw,40px)", color: "var(--text-secondary)", margin: "20px 0 0" } }, "Market, Wisdom, Foretold."), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: "clamp(16px,1.9vw,20px)", lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 600, margin: "22px auto 0" } }, T("Ein Ensemble aus Maschinenhirnen liest jede Meldung auf dem Planeten, jeden Flow, jeden Zyklus \u2014 seit 1929. Jeden Morgen reicht dir das Orakel ein Signal: von Warren, dem KI-Hirn, analysiert, bewertet und begr\xFCndet \u2014 und deins, bevor die Masse erwacht.", "An ensemble of machine minds reads every filing on the planet, every flow, every cycle \u2014 since 1929. Each dawn the oracle hands you one signal: analysed, scored and reasoned by Warren, the AI mind \u2014 and yours before the crowd stirs.")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 46, display: "flex", gap: 16, justifyContent: "center", alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Button, { variant: "oracle", size: "lg", onClick: go }, "Request Sanctum Entrance"), /* @__PURE__ */ React.createElement("button", { onClick: () => { if (typeof window.PYsoundEnable === "function") window.PYsoundEnable(); }, "aria-label": "Hear the Sanctum", style: { display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(8,9,12,0.4)", border: "1px solid var(--border-strong)", borderRadius: 999, padding: "0 20px", height: 48, color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", backdropFilter: "blur(6px)" } }, /* @__PURE__ */ React.createElement("svg", { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M11 5 6 9H2v6h4l5 4z" }), /* @__PURE__ */ React.createElement("path", { d: "M15.5 8.5a5 5 0 0 1 0 7" }), /* @__PURE__ */ React.createElement("path", { d: "M19 5a9 9 0 0 1 0 14" })), "Hear the Sanctum"))), /* @__PURE__ */ React.createElement("a", { href: "#reading", "aria-label": "Scroll down", className: "scroll-cue", style: { position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", color: "var(--text-oracle)", textDecoration: "none", fontSize: 26, lineHeight: 1 } }, "\u2304"));
  }
  function How() {
    const STEPS = [
      ["One reading at dawn", T("Kein Dauerfeuer an Alerts. Ein einziger Ruf mit hoher \xDCberzeugung jeden Morgen um 06:00 CET \u2014 der eine, der z\xE4hlt.", "No firehose of alerts. A single high-conviction call each morning at 06:00 CET \u2014 the one that matters.")],
      ["Conviction, scored 0\u2013100", T('Warren sagt nie \u201Ehoch". Er sagt 94. Jedes Signal tr\xE4gt seine Conviction, seinen Horizont und seine Asymmetrie \u2014 in klaren Zahlen.', 'Warren never says "high." He says 94. Every signal carries its conviction, horizon and asymmetry, in plain numbers.')],
      ["The reasoning, the levels", T("Die vollst\xE4ndige Begr\xFCndung, der Catalyst und warum die Masse falsch bepreist — im Sanctum.", "The full reasoning, the catalyst, and why the crowd is mispriced — inside the sanctum.")]
    ];
    return /* @__PURE__ */ React.createElement(PySection, { alt: true }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 40 } }, /* @__PURE__ */ React.createElement(PyEyebrow, null, "How the oracle speaks"), /* @__PURE__ */ React.createElement(PyH2, null, "Signal, conviction, levels.")), /* @__PURE__ */ React.createElement("div", { className: "pk-grid3" }, STEPS.map(([t, d], i) => /* @__PURE__ */ React.createElement(Card, { key: t, variant: "raised", padding: "28px" }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-oracle)", letterSpacing: "0.14em", marginBottom: 14 } }, "0" + (i + 1)), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 24, color: "var(--text-primary)", marginBottom: 10 } }, t), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 15, lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 } }, d)))));
  }
  function ClosingCTA() {
    return /* @__PURE__ */ React.createElement(PySection, null, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", maxWidth: 680, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(PyEyebrow, null, "Claim your seat at the table"), /* @__PURE__ */ React.createElement(PyH2, null, "The next reading arrives at dawn."), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 28 } }, /* @__PURE__ */ React.createElement(Button, { variant: "oracle", size: "lg", onClick: go }, "Request Sanctum Entrance"))));
  }
  function WarrenLauncher() {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: toReading,
        title: "Consult Warren",
        "aria-label": "Consult Warren",
        style: {
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(14,16,20,0.82)",
          backdropFilter: "blur(10px)",
          border: "1px solid var(--border-oracle)",
          borderRadius: 999,
          padding: "8px 18px 8px 8px",
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }
      },
      /* @__PURE__ */ React.createElement("img", { src: "assets/imagery/warren-2.png", alt: "Warren", style: { width: 40, height: 40, borderRadius: "50%", objectFit: "cover", objectPosition: "center 20%", border: "1px solid var(--border-oracle)" } }),
      /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-oracle)" } }, "Ask Warren")
    );
  }
  function NotWhat() {
    const NOT = [
      [T("Keine Trading-Plattform", "Not a trading platform"), T("PYTHAI führt keine Order aus und hält kein Geld. Gehandelt wird bei deinem eigenen Broker.", "PYTHAI places no orders and holds no money. Trading happens at your own broker.")],
      [T("Kein Portfolio-Management", "No portfolio management"), T("PYTHAI verwaltet kein Vermögen, kennt deine Positionen nicht und gibt keine Allokation vor.", "PYTHAI manages no money, never sees your positions and prescribes no allocation.")],
      [T("Keine Anlageberatung", "Not investment advice"), T("PYTHAI liest den Markt und legt die Begründung offen — keine auf dich zugeschnittene Empfehlung. Du entscheidest.", "PYTHAI reads the market and shows its reasoning — no advice tailored to you. You decide.")],
      [T("Kein Renditeversprechen", "No promised returns"), T("Keine garantierten Gewinne, keine Performance-Claims. Eine These hält — oder sie kippt.", "No guaranteed gains, no performance claims. A thesis holds — or it breaks.")],
      [T("Keine Verwahrung, kein Broker", "No custody, no brokerage"), T("PYTHAI hält keine Assets, keine Einlagen — und fasst dein Geld nie an.", "PYTHAI holds no assets, no deposits — and never touches your money.")],
      [T("Kein Copy-Trading", "No copy-trading"), T("My Book ist dein eigenes Thesen-Buch, rein kursbasiert — kein automatisches Kopieren fremder Depots.", "My Book is your own thesis book, purely price-based — no auto-copying of anyone's portfolio.")]
    ];
    return h(PySection, { alt: true },
      h("div", { style: { marginBottom: 40, maxWidth: 680 } },
        h(PyEyebrow, null, T("Klare Abgrenzung", "Clear boundaries")),
        h("h2", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(30px,4vw,44px)", margin: "0 0 14px", color: "#E0726B" } }, T("Was PYTHAI nicht ist.", "What PYTHAI is not.")),
        h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.65, color: "var(--text-secondary)", margin: "14px 0 0" } }, T("Damit nichts verschwimmt — diese Grenzen zieht PYTHAI bewusst.", "So nothing gets blurred — these are the lines PYTHAI draws on purpose."))),
      h("div", { className: "pk-grid3" }, NOT.map(([title, body]) =>
        h(Card, { key: title, variant: "raised", padding: "28px" },
          h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--oxblood-bright)", marginBottom: 12 } }, "PYTHAI ≠"),
          h("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 23, lineHeight: 1.1, color: "var(--text-primary)", marginBottom: 10 } }, title),
          h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 } }, body)))),
      h("div", { style: { marginTop: 34, borderTop: "1px solid var(--border-subtle)", paddingTop: 24, maxWidth: 760 } },
        h("p", { style: { fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: "clamp(19px,2.4vw,24px)", lineHeight: 1.45, color: "var(--parchment)", margin: 0 } }, T("Was PYTHAI ist: ein Orakel, das liest, bewertet und begründet. Den Trade machst du.", "What PYTHAI is: an oracle that reads, scores and reasons. The trade is yours."))));
  }
  function App() {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SiteNav, { active: "index.html" }), /* @__PURE__ */ React.createElement(OracleHero, null), /* @__PURE__ */ React.createElement(PyReadingTeaser, null), /* @__PURE__ */ React.createElement(How, null), /* @__PURE__ */ React.createElement(NotWhat, null), /* @__PURE__ */ React.createElement(PyPricing, { onEnter: go }), /* @__PURE__ */ React.createElement(ClosingCTA, null), /* @__PURE__ */ React.createElement(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
