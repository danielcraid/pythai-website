(() => {
  const { Button } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PyPageHead, PySection, PyH2, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const API = "https://api.pythai.ch";
  const { useState, useEffect } = React;
  const h = React.createElement;
  const PRIV = ["inner-circle", "circle-of-trust", "syndicate", "admin"];

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

  // ---- Direct request form: ask Warren about a symbol → analysis by email ----
  function ConfirmDialog({ symbol, q, email, busy, onSend, onClose }) {
    return h("div", { onClick: onClose, style: { position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,5,8,0.78)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 } },
      h("div", { onClick: (e) => e.stopPropagation(), style: { position: "relative", maxWidth: 460, width: "100%", background: "var(--bg-raised)", border: "1px solid var(--border-oracle)", borderRadius: 12, boxShadow: "var(--glow-md)", padding: "30px" } },
        h("button", { onClick: onClose, "aria-label": "Close", style: { position: "absolute", top: 12, right: 16, background: "none", border: "none", color: "var(--text-muted)", fontSize: 24, cursor: "pointer", lineHeight: 1 } }, "×"),
        h(PyEyebrow, null, T("Bereit?", "Ready?")),
        h("h3", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 26, margin: "8px 0 16px", color: "var(--text-primary)" } }, T("Deine Anfrage an Warren", "Your request to Warren")),
        h("div", { style: { border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "14px 16px", marginBottom: 18 } },
          h("div", { style: { display: "flex", gap: 10 } }, h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", minWidth: 52 } }, T("Wert", "Symbol")), h("span", { style: { fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)" } }, symbol)),
          q ? h("div", { style: { display: "flex", gap: 10, marginTop: 8 } }, h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", minWidth: 52 } }, T("Frage", "Question")), h("span", { style: { fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.5 } }, q)) : null),
        h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 0 14px" } }, T("Warren ist eine KI und kann irren. Dies ist keine Anlageberatung, sondern reine Information — du entscheidest eigenverantwortlich.", "Warren is an AI and can err. This is not investment advice, just information — you decide on your own responsibility.")),
        h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-oracle)", margin: "0 0 18px" } }, T("Antwort per E-Mail" + (email ? " an " + email : "") + ".", "Reply by email" + (email ? " to " + email : "") + ".")),
        h(Button, { variant: "oracle", full: true, loading: busy, onClick: onSend }, T("Senden", "Send")),
        h("div", { style: { textAlign: "center", marginTop: 10 } }, h(Button, { variant: "ghost", onClick: onClose }, T("Abbrechen", "Cancel")))));
  }
  function ChartRequest({ email }) {
    const [symbol, setSymbol] = useState("");
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState("form"); // form | sent | mailoff | limit | auth | error
    const fld = { width: "100%", background: "var(--bg-input)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "12px 14px", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 15, outline: "none", boxSizing: "border-box" };
    const lbl = { display: "block", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 6px" };
    function send() {
      if (busy) return; setBusy(true);
      fetch(API + "/api/chartomat/request", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symbol: symbol.trim(), question: q.trim() }) })
        .then((res) => {
          setBusy(false); setOpen(false);
          if (res.ok || res.status === 202) return setStatus("sent");
          if (res.status === 400) return setStatus("mailoff");
          if (res.status === 429) return setStatus("limit");
          if (res.status === 401) return setStatus("auth");
          setStatus("error");
        })
        .catch(() => { setBusy(false); setOpen(false); setStatus("error"); });
    }
    const RESULT = {
      sent: { color: "var(--text-oracle)", head: T("Unterwegs. Warren liest die Daten.", "On its way. Warren is reading the data."), body: T("Die Chart-Analyse kommt per E-Mail" + (email ? " an " + email : "") + " — das kann ein paar Minuten dauern.", "Your chart analysis will arrive by email" + (email ? " at " + email : "") + " — it can take a few minutes.") },
      mailoff: { color: "var(--text-warn, #d8a34a)", head: T("Dein Mail-Versand ist aus.", "Your email delivery is off."), body: T("Warren antwortet per E-Mail — aktiviere den Versand in deinen Konto-Einstellungen, dann klappt die Analyse.", "Warren replies by email — switch delivery on in your account settings, then the analysis will work."), cta: { label: T("Zu den Einstellungen", "To settings"), href: "account.html" } },
      limit: { color: "var(--text-warn, #d8a34a)", head: T("Tageslimit erreicht.", "Daily limit reached."), body: T("Du hast heute alle Chart-Anfragen aufgebraucht (10 pro Tag). Morgen geht es weiter.", "You’ve used all of today’s chart requests (10 per day). It resets tomorrow.") },
      auth: { color: "var(--text-warn, #d8a34a)", head: T("Sitzung abgelaufen.", "Session expired."), body: T("Bitte melde dich neu an, dann kannst du Warren wieder fragen.", "Please sign in again to ask Warren."), cta: { label: T("Anmelden", "Sign in"), href: "register.html" } },
      error: { color: "var(--text-warn, #d8a34a)", head: T("Da ging etwas schief.", "Something went wrong."), body: T("Die Anfrage kam nicht durch. Versuch es gleich noch einmal.", "The request didn’t go through. Please try again in a moment.") }
    };
    return h(PySection, null, h("div", { style: { maxWidth: 680, background: "var(--bg-raised)", border: "1px solid var(--border-oracle)", borderRadius: 12, padding: "30px", boxShadow: "var(--glow-md)" } },
      h(PyEyebrow, null, T("Frag das Orakel", "Ask the oracle")),
      h("h2", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 30, letterSpacing: "-0.01em", margin: "6px 0 0", color: "var(--text-primary)" } }, T("Chart-Analyse anfragen", "Request a chart analysis")),
      status !== "form"
        ? h("div", { style: { marginTop: 18 } },
            h("p", { style: { fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 20, color: RESULT[status].color, margin: 0 } }, RESULT[status].head),
            h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: "10px 0 18px" } }, RESULT[status].body),
            h("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" } },
              RESULT[status].cta ? h(Button, { variant: "oracle", onClick: () => { window.location.href = RESULT[status].cta.href; } }, RESULT[status].cta.label) : null,
              h(Button, { variant: "chrome", onClick: () => { setStatus("form"); if (status === "sent") { setSymbol(""); setQ(""); } } }, status === "sent" ? T("Noch eine anfragen", "Ask another") : T("Erneut versuchen", "Try again"))))
        : h("div", { style: { marginTop: 18 } },
            h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 15, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 20px" } }, T("Nenne einen Wert (Aktie oder Index) und was du wissen möchtest. Warren erstellt den Chart und schickt dir seine Lesart per E-Mail.", "Name a stock or index and what you’d like to know. Warren builds the chart and emails you his read.")),
            h("label", { style: lbl }, T("Wert", "Symbol")),
            h("input", { style: fld, value: symbol, onChange: (e) => setSymbol(e.target.value), placeholder: "z. B. Adidas, ADS.DE, NVDA, DAX" }),
            h("label", { style: { ...lbl, margin: "16px 0 6px" } }, T("Deine Frage (optional)", "Your question (optional)")),
            h("textarea", { style: { ...fld, minHeight: 88, resize: "vertical" }, value: q, onChange: (e) => setQ(e.target.value), placeholder: T("Was möchtest du wissen? z. B. Wie steht der Trend? Bildet sich ein Signal?", "What would you like to know? e.g. How’s the trend? Is a signal forming?") }),
            h("div", { style: { marginTop: 20 } }, h(Button, { variant: "oracle", disabled: !symbol.trim(), onClick: () => setOpen(true) }, T("Analyse anfragen", "Request analysis")))),
      open && h(ConfirmDialog, { symbol: symbol.trim(), q: q.trim(), email: email, busy: busy, onSend: send, onClose: () => setOpen(false) })));
  }

  function App() {
    const [gate, setGate] = useState("loading");
    const [me, setMe] = useState(null);
    useEffect(() => {
      fetch(API + "/api/me", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        if (d && d.ok) setMe(d);
        if (d && d.onboardingRequired) { window.location.href = "account.html"; return; }
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
      h(ChartRequest, { email: me && me.email }),
      PHASES.map((p, i) => h(Phase, { key: p.key, p, i })),
      h(PySection, null, h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "90ch" } }, T("Charts und Indikatoren dienen ausschließlich der Information und Erläuterung und stellen keine Anlageberatung, keine Finanzanalyse und keine Kauf-, Verkaufs- oder Halteempfehlung dar. Angaben ohne Gewähr.", "Charts and indicators are for information and explanation only and do not constitute investment advice, financial analysis or any buy, sell or hold recommendation. No warranty given."))),
      h(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
