(() => {
  const { Button } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PyPageHead, PySection, PyH2, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const API = "https://api.pythai.ch";
  const { useState, useEffect } = React;
  const h = React.createElement;
  const PRIV = ["inner-circle", "syndicate", "admin"];

  function Shot({ src, label }) {
    const [err, setErr] = useState(false);
    if (err) return h("div", { style: { width: "100%", minHeight: 220, borderRadius: 10, border: "1px dashed var(--border-strong)", background: "var(--bg-input)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16 } }, h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--text-muted)" } }, T("Chart folgt", "Chart coming")));
    return h("img", { src, alt: label, onError: () => setErr(true), style: { width: "100%", borderRadius: 10, border: "1px solid var(--border-subtle)", display: "block" } });
  }
  function Bullet({ text }) {
    return h("div", { style: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 } }, h("span", { style: { color: "var(--oracle)", fontSize: 15, lineHeight: 1.5, flexShrink: 0 } }, "•"), h("span", { style: { fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)" } }, text));
  }

  function Phase({ p, i }) {
    return h(PySection, { alt: i % 2 === 1 },
      h("div", { style: { marginBottom: 24 } },
        h(PyEyebrow, null, "Phase " + (i + 1)),
        h(PyH2, null, p.title),
        h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--text-secondary)", margin: "6px 0 0" } }, p.tag)),
      h(Shot, { src: "assets/chartomat/" + p.key + ".png", label: p.title }),
      h("div", { style: { marginTop: 22, maxWidth: 820 } },
        p.points.map((t, k) => h(Bullet, { key: k, text: t })),
        h("p", { style: { fontFamily: "var(--font-ui)", fontStyle: "italic", fontSize: 15, lineHeight: 1.6, color: "var(--text-primary)", margin: "16px 0 0", borderLeft: "2px solid var(--border-oracle)", paddingLeft: 14 } }, p.read)));
  }

  function App() {
    const [gate, setGate] = useState("loading");
    useEffect(() => {
      fetch(API + "/api/me", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        const member = d && d.ok && PRIV.indexOf(d.tier) !== -1 && d.approval === "approved";
        setGate(member ? "ok" : "locked");
      }).catch(() => setGate("locked"));
    }, []);
    if (gate === "loading") return h("div", null, h(SiteNav, { active: "chartomat.html" }), h("div", { style: { minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 22, color: "var(--text-oracle)" } }, T("Das Orakel prüft deinen Zugang…", "The oracle checks your access…")), h(SiteFooter, null));
    if (gate === "locked") return h("div", null, h(SiteNav, { active: "chartomat.html" }), h("section", { style: { minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" } }, h("div", { style: { maxWidth: 540 } }, h("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 58, height: 58, margin: "0 auto 22px", opacity: 0.7 } }), h(PyEyebrow, null, "Inner Circle"), h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 40, margin: "8px 0 0", color: "var(--text-primary)" } }, T("Der Chartomat lebt im Sanctum.", "The Chartomat lives in the sanctum.")), h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", margin: "16px 0 20px" } }, T("Chart-Analyse mit Erläuterung ist dem Inner Circle vorbehalten.", "Chart analysis with explanation is reserved for the Inner Circle.")), h("div", { style: { position: "relative", margin: "4px 0 24px", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-oracle)", boxShadow: "0 0 30px var(--glow-oracle-soft)" } }, h("img", { src: "assets/chartomat/phase4.png", alt: "", style: { width: "100%", display: "block", filter: "blur(3px) brightness(0.85) saturate(1.1)", transform: "scale(1.04)" } }), h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,9,12,0.2) 0%, rgba(8,9,12,0) 35%, rgba(8,9,12,0.88) 100%)" } }), h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 18px" } }, h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-oracle)", marginBottom: 6 } }, T("Vorschau", "Preview")), h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 } }, T("SuperTrend · EMAs · Bollinger · Smart-Money — vier Indikator-Ebenen, mit Warrens Lesart.", "SuperTrend · EMAs · Bollinger · Smart-Money — four layers of indicators, with Warren’s read.")))), h(Button, { variant: "oracle", onClick: () => { window.location.href = "account.html"; } }, T("Zum Inner Circle", "Go to Inner Circle")))), h(SiteFooter, null));

    const PHASES = [
      { key: "phase1", title: T("Trend & Volumen", "Trend & volume"), tag: "SuperTrend · Volume · MACD", points: [
        T("SuperTrend (10, 3) — grüne/rote Linie direkt am Kurs. Beim Flip ein Trendwechsel-Marker (ST↑ / ST↓).", "SuperTrend (10, 3) — a green/red line right on the price. On a flip, a trend-change marker (ST↑ / ST↓)."),
        T("Volumen — eigener Pane unter dem Kurs, eingefärbt nach Richtung (grün, wenn Schluss ≥ Eröffnung).", "Volume — its own pane below the price, coloured by direction (green when close ≥ open)."),
        T("MACD (12, 26, 9) — Momentum mit Kreuzungs-Markern.", "MACD (12, 26, 9) — momentum with crossover markers.")
      ], read: T("Die Basis-Lesung: Trendrichtung, Schwung und wie viel Beteiligung dahintersteckt — in einem Bild.", "The base read: trend direction, momentum and how much participation is behind it — in one picture.") },
      { key: "phase2", title: T("Trend-Mittelwerte", "Trend averages"), tag: "EMA-20 · EMA-50 · EMA-200", points: [
        T("EMA-20 — kurzfristiger Trend.", "EMA-20 — the short-term trend."),
        T("EMA-50 — mittelfristiger Trend.", "EMA-50 — the mid-term trend."),
        T("EMA-200 — langfristig, mit Bull-/Bear-Markierung.", "EMA-200 — long-term, with a bull/bear marker.")
      ], read: T("Klassischer Cross-Setup: EMA-20 über EMA-50 = bullishes Momentum. Plus alles aus Phase 1.", "The classic cross setup: EMA-20 above EMA-50 = bullish momentum. Plus everything from phase 1.") },
      { key: "phase3", title: T("Volatilität", "Volatility"), tag: "Bollinger Bands (20, 2σ)", points: [
        T("Obere & untere Band (gestrichelt) — zwei Standardabweichungen vom Mittel.", "Upper & lower band (dashed) — two standard deviations from the mean."),
        T("Mittlere Band (durchgezogen) — der gleitende Durchschnitt (20).", "Middle band (solid) — the 20-period moving average.")
      ], read: T("Squeeze + Mean-Reversion: enge Bänder (Squeeze) sind oft ein Vor-Ausbruch-Signal; an den Rändern Rückkehr zur Mitte. (Trend-Mittelwerte hier ausgeblendet, damit's sauber bleibt — beide zusammen sind möglich.)", "Squeeze + mean-reversion: tight bands (a squeeze) are often a pre-breakout signal; at the edges, a return toward the middle. (Trend averages are hidden here to keep it clean — both together are possible.)") },
      { key: "phase4", title: T("Marktstruktur", "Market structure"), tag: "Smart-Money · BOS · CHoCH · OB · Liquidity", points: [
        T("BOS (Break of Structure) — der Kurs durchbricht das letzte Pivot in Trendrichtung.", "BOS (break of structure) — price breaks the last pivot in the trend direction."),
        T("CHoCH (Change of Character) — das erste BOS gegen den Trend = möglicher Trendwechsel.", "CHoCH (change of character) — the first BOS against the trend = a possible trend reversal."),
        T("Order-Blocks — die letzte gegensätzliche Kerze vor einem BOS (dünne Linien).", "Order blocks — the last opposing candle before a BOS (thin lines)."),
        T("Liquidity-Pools (BSL / SSL) — gleiche Hochs/Tiefs, wo Liquidität sitzt.", "Liquidity pools (BSL / SSL) — equal highs/lows where liquidity rests.")
      ], read: T("Marktstruktur rein aus dem Kursverlauf gelesen — wo bricht der Trend, wo dreht er, wo sammeln sich Aufträge.", "Market structure read purely from price action — where the trend breaks, where it turns, where orders accumulate.") }
    ];

    return h("div", null, h(SiteNav, { active: "chartomat.html" }),
      h(PyPageHead, { eyebrow: "Chart analyzer", title: "CHARTOMAT", sub: T("Chart-Analyse mit Erläuterung — frag das Orakel zu einem Wert, und du bekommst den Chart samt Lesart zurück. Verfügbar im Inner Circle.", "Chart analysis with explanation — ask the oracle about a stock and get the chart plus the read back. Available in the Inner Circle.") }),
      PHASES.map((p, i) => h(Phase, { key: p.key, p, i })),
      h(PySection, null, h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "90ch" } }, T("Charts und Indikatoren dienen ausschließlich der Information und Erläuterung und stellen keine Anlageberatung, keine Finanzanalyse und keine Kauf-, Verkaufs- oder Halteempfehlung dar. Angaben ohne Gewähr.", "Charts and indicators are for information and explanation only and do not constitute investment advice, financial analysis or any buy, sell or hold recommendation. No warranty given."))),
      h(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
