(() => {
  const { Card, Stat, Badge, Button } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PySection, PyH2, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const h = React.createElement;
  const Z = ["#C4524C", "#CF7A4E", "#C9A24E", "#6FB07A", "#6FCF9A"];
  const ZL = ["GEBROCHEN", "WACKELT", "NEUTRAL", "INTAKT", "STARK"];
  function Waage(pct, zone, label) {
    return h("div", null,
      h("div", { className: "swg-mk" }, h("span", { className: "swg-arrow", style: { left: pct + "%" } }, "▼")),
      h("div", { className: "swg-bar" }, Z.map((c, i) => h("span", { key: i, style: { background: c } }))),
      h("div", { className: "swg-zones" }, ZL.map((z, i) => h("span", { key: z, style: { textAlign: i === 0 ? "left" : i === 4 ? "right" : "center" } }, z))),
      label ? h("div", { className: "swg-lab", style: { color: Z[zone - 1] } }, label) : null);
  }

  // ── EM3: Emometer (Welt-Sentiment der globalen Hot-Topics) ──────────────
  // Live gegen GET /api/public/emometer/latest (byte-identisch zum gelockten Schema,
  // CORS *, Cache-Control 300s). Kontext-Anzeige, kein Gate/Edge. Override via
  // window.PY_EMOMETER_URL. Rendert null bis Daten da sind (graceful degrade).
  const EMO_URL = window.PY_EMOMETER_URL || "https://api.pythai.ch/api/public/emometer/latest";
  const EMO_SENT = {
    risk_off: { label: T("Risiko-Off", "Risk-Off"), tone: "bear" },
    neutral: { label: T("Neutral", "Neutral"), tone: "neutral" },
    risk_on: { label: T("Risiko-On", "Risk-On"), tone: "bull" }
  };
  const EMO_REL = { sehr_hoch: T("Sehr hoch", "Very high"), hoch: T("Hoch", "High"), mittel: T("Mittel", "Medium"), niedrig: T("Niedrig", "Low") };
  const emoScore = (s) => { const n = Number(s); const sign = n > 0 ? "+" : n < 0 ? "−" : ""; return sign + Math.abs(n).toFixed(2).replace(".", ","); };
  const emoStand = (iso) => { try { return new Date(iso).toLocaleString([], { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
  const emoStampBig = (iso) => { try { const d = new Date(iso); return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" }) + " · " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " " + T("Uhr", ""); } catch (e) { return ""; } };
  const emoMood = (s) => { const n = Number(s); return n <= -0.6 ? T("Deutlich negativ", "Clearly negative") : n <= -0.3 ? T("Vorsichtig negativ", "Cautiously negative") : n < 0.3 ? T("Gemischt", "Mixed") : n < 0.6 ? T("Vorsichtig positiv", "Cautiously positive") : T("Deutlich positiv", "Clearly positive"); };
  const emoTrendGlyph = (tr) => tr === "eskalierend" ? "▲" : tr === "abklingend" ? "▼" : "—";
  const emoHead = { fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" };

  // 3-Zonen-Balken (Risiko-Off · Neutral · Risiko-On); Zonengrenzen = Label-Schwellen ±0,3
  function EmoScale(score) {
    const pct = Math.max(2, Math.min(98, (Number(score) + 1) / 2 * 100));
    return h("div", null,
      h("div", { style: { position: "relative", height: 13 } },
        h("span", { style: { position: "absolute", left: pct + "%", bottom: 0, transform: "translateX(-50%)", color: "var(--oracle)", fontSize: 14, lineHeight: 1 } }, "▼")),
      h("div", { style: { display: "flex", height: 9, borderRadius: 999, overflow: "hidden" } },
        h("span", { style: { flex: "0 0 35%", background: "var(--oxblood-bright)" } }),
        h("span", { style: { flex: "0 0 30%", background: "var(--border-strong, #3b414c)" } }),
        h("span", { style: { flex: "1 1 35%", background: "var(--bull-bright)" } })),
      h("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 7, fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.1em", color: "var(--text-muted)" } },
        h("span", null, T("RISIKO-OFF", "RISK-OFF")),
        h("span", null, T("NEUTRAL", "NEUTRAL")),
        h("span", null, T("RISIKO-ON", "RISK-ON"))));
  }

  const emoTopicRow = (t, i) => {
    const ts = EMO_SENT[t.sentiment] || EMO_SENT.neutral;
    const title = t.short_label_de || t.name_de;
    return h("div", { key: i, className: "emo-grid emo-row" },
      h("div", { className: "emo-main", style: { minWidth: 0 } },
        h("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 17, color: "var(--text-primary)", lineHeight: 1.25 } }, title),
        t.note_de ? h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.55, color: "var(--text-secondary)", marginTop: 5 } }, t.note_de) : null),
      h(Badge, { tone: ts.tone }, (ts.label || "").toUpperCase()),
      h("span", { className: "emo-rel", style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)" } }, EMO_REL[t.relevance] || t.relevance),
      h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 13, textAlign: "center", color: t.trend ? "var(--text-secondary)" : "var(--text-muted)" } }, emoTrendGlyph(t.trend)));
  };

  function Emometer() {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
      let alive = true;
      fetch(EMO_URL, { credentials: "omit" })
        .then((r) => (r && r.ok ? r.json() : null))
        .then((d) => { if (alive && d && d.aggregate && Array.isArray(d.topics) && d.topics.length) setData(d); })
        .catch(() => { });
      return () => { alive = false; };
    }, []);
    if (!data) return null;
    const a = data.aggregate || {};
    const sent = EMO_SENT[a.sentiment] || EMO_SENT.neutral;
    return h(PySection, null,
      h(Card, { variant: "oracle", padding: "30px 30px 22px" },
        h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", paddingBottom: 18, borderBottom: "1px solid var(--border-subtle)" } },
          h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, letterSpacing: "0.26em", color: "var(--oracle)" } }, "EMOMETER"),
          h("div", { style: { textAlign: "right" } },
            h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)" } }, T("Sentiment der globalen Hot-Topics", "Sentiment of the global hot topics")),
            data.generated_at ? h("div", { style: { fontFamily: "var(--font-mono)", fontSize: "clamp(17px,2.4vw,22px)", color: "var(--parchment)", letterSpacing: "0.03em", marginTop: 5 } }, emoStampBig(data.generated_at)) : null)),
        h("div", { style: { padding: "22px 0 2px" } },
          h("div", { style: Object.assign({ marginBottom: 8 }, emoHead) }, T("Gesamt-Stimmung", "Overall sentiment")),
          h("div", { style: { display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 18 } },
            h("div", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: "clamp(26px,4vw,38px)", lineHeight: 1.04, color: "var(--parchment)" } }, emoMood(a.score).toUpperCase()),
            h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" } }, "· " + sent.label + "-Tilt · " + emoScore(a.score))),
          EmoScale(a.score),
          a.reading_de ? h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16.5, lineHeight: 1.62, color: "var(--text-primary)", margin: "18px 0 0" } }, a.reading_de) : null),
        h("div", { className: "emo-grid emo-headrow", style: { marginTop: 22, paddingBottom: 8, borderBottom: "1px solid var(--border-subtle)" } },
          h("span", { style: emoHead }, T("Thema", "Topic")),
          h("span", { style: emoHead }, T("Sentiment", "Sentiment")),
          h("span", { className: "emo-rel", style: emoHead }, T("Relevanz", "Relevance")),
          h("span", { style: Object.assign({ textAlign: "center" }, emoHead) }, T("Trend", "Trend"))),
        data.topics.map((t, i) => emoTopicRow(t, i)),
        h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-muted)" } },
          h("div", { style: { display: "flex", gap: 16, flexWrap: "wrap" } },
            h("span", null, "▲ " + T("eskalierend", "escalating")),
            h("span", null, "— " + T("anhaltend", "persistent")),
            h("span", null, "▼ " + T("abklingend", "fading"))),
          h("span", null, T("Kontext-Anzeige · kein Handelssignal", "Context display · not a trading signal")))));
  }

  function SignalsHero() {
    return h("header", { style: { position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border-subtle)", minHeight: "min(70vh, 600px)", display: "flex", alignItems: "center" } },
      h("video", { autoPlay: true, muted: true, loop: true, playsInline: true, preload: "auto", poster: "assets/imagery/pythai-computer.png", "aria-hidden": "true", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 } }, h("source", { src: "assets/imagery/pythai-computer.mp4", type: "video/mp4" })),
      h("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(78% 62% at 50% 42%, rgba(8,9,12,0.20) 0%, rgba(8,9,12,0.72) 58%, var(--void) 100%)" } }),
      h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,9,12,0.55) 0%, transparent 28%, transparent 60%, var(--void) 100%)" } }),
      h("div", { style: { position: "relative", maxWidth: 1240, width: "100%", margin: "0 auto", padding: "120px 40px 90px", textAlign: "center" } },
        h(PyEyebrow, null, T("Der Edge", "The edge")),
        h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(40px,6vw,72px)", lineHeight: 1.05, margin: 0, color: "var(--parchment)" } }, T("Signale lesen. These beobachten.", "Read the signal. Watch the thesis.")),
        h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 19, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 660, margin: "24px auto 0" } }, T("KI-native Power für jeden: ein Ensemble aus Maschinenhirnen liest den Markt, Warren formt daraus einen begründeten Ruf — und beobachtet danach, ob die These hält. Kein Dauerfeuer, kein Rauschen.", "AI-native power for everyone: an ensemble of machine minds reads the market, Warren turns it into one reasoned call — and then watches whether the thesis holds. No firehose, no noise."))));
  }

  // 3 illustrative Beispiele (Format, kein Track-Record)
  const PAST = [
    { name: "Xetra-Gold ETC", klasse: T("Rohstoff", "Commodity"), score: "50", res: "+3.0%", won: true, wpct: 70, zone: 4, note: T("Macro-Hedge in den NFP — früh realisiert, ohne Wochenend-Risiko.", "Macro hedge into NFP — realised early, no weekend risk.") },
    { name: "Rheinmetall AG", klasse: T("Aktie", "Equity"), score: "70", res: "+8.5%", won: true, wpct: 88, zone: 5, note: T("Getrieben vom NATO-Auftragsflow — gestaffelt aufgebaut.", "Driven by NATO order flow — built up in stages.") },
    { name: "Bitcoin · BTC/EUR", klasse: T("Krypto", "Crypto"), score: "85", res: "+12.8%", won: true, wpct: 85, zone: 5, note: T("Vol-Expansion vor FOMC — als risikoarme Kernposition gedacht.", "Vol-expansion pre-FOMC — framed as a low-risk core position.") }
  ];
  const ENGINE = [
    ["01", T("Lesen", "Read"), T("Ein Ensemble aus Maschinenhirnen liest jede Meldung, jeden Flow, jeden Zyklus — gegen ein Marktgedächtnis seit 1929.", "An ensemble of machine minds reads every filing, every flow, every cycle — against a market memory since 1929.")],
    ["02", T("Bewerten", "Score"), T("Warren verdichtet das zu einer These und einem Thesen-Score — und legt offen, warum. Nachvollziehbar, nicht aus dem Bauch.", "Warren condenses it into a thesis and a thesis score — and shows why. Traceable, not a gut feeling.")],
    ["03", T("Ein Reading", "One reading"), T("Statt Dutzender Alerts kommt ein Ruf bei Sonnenaufgang. Der eine, der zählt — mit Marken zum Selber-Prüfen.", "Instead of dozens of alerts, one call at dawn. The one that matters — with levels you can check yourself.")]
  ];
  const RITUALS = [
    ["Morning Compass", T("Mo–Fr", "Mon–Fri"), T("Alle — auch Observer", "Everyone — incl. Observers")],
    ["Daily Oracle", T("Mo–Fr · 06:00", "Mon–Fri · 06:00"), "Inner Circle"],
    ["Im Spiel & EOD", T("Werktäglich", "Every weekday"), "Inner Circle"],
    ["Weekly Recap & Markt-Vibe", T("Wöchentlich", "Weekly"), T("Alle — auch Observer", "Everyone — incl. Observers")],
    ["Sunday Briefing", T("Sonntags", "Sundays"), "Inner Circle"],
    ["Push Updates & Alerts", T("nahezu in Echtzeit*", "near real-time*"), "Syndicate"]
  ];

  function App() {
    const thS = { textAlign: "left", padding: "0 14px 10px 0", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 400, borderBottom: "1px solid var(--border-subtle)" };
    const tdS = { padding: "14px 14px 14px 0", borderBottom: "1px solid var(--border-subtle)", verticalAlign: "middle" };
    const lead = { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.65, color: "var(--text-secondary)", margin: "10px 0 0", maxWidth: "70ch" };

    const eyeSvg = h("svg", { width: 24, height: 28, viewBox: "0 0 24 28", "aria-hidden": "true" }, h("path", { d: "M9,2 L12,18 L15,2 Z", fill: "#F2CE7A" }), h("circle", { cx: 12, cy: 19, r: 3.4, fill: "#F2CE7A" }));
    const STEPS = [
      ["01", T("Signale", "Signals"), T("viele Quellen, ein Strom", "many sources, one stream"), ""],
      ["eye", T("Das Orakel", "The oracle"), T("zum Thesen-Score", "into a thesis score"), "eye"],
      ["03", T("Beobachten", "Watch"), T("hält die These?", "does the thesis hold?"), ""],
      ["04", T("Warnung", "Alert"), T("du wirst gerufen", "you get called"), "warn"],
      ["05", T("Du entscheidest", "You decide"), T("behalten · anpassen · schließen", "keep · adjust · close"), "go"]
    ];
    const stepEl = (s, i) => h("div", { className: "osv-step", key: "s" + i },
      h("div", { className: "osv-node " + s[3] }, s[3] === "eye" ? eyeSvg : h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-oracle)" } }, s[0])),
      h("div", { className: "osv-txt" }, h("div", { className: "osv-l" }, s[1]), h("div", { className: "osv-s" }, s[2])));
    const flowKids = [];
    STEPS.forEach((s, i) => { flowKids.push(stepEl(s, i)); if (i < STEPS.length - 1) flowKids.push(h("div", { className: "osv-arrow", key: "a" + i }, "→")); });
    const oracleDiagram = h(PySection, null, h("div", { className: "osv" },
      h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--oracle)", textAlign: "center" } }, T("Der PYTHAI-Edge", "The PYTHAI edge")),
      h("h2", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: "clamp(26px,4vw,40px)", color: "var(--parchment)", textAlign: "center", margin: "10px 0 6px" } }, T("Wie das Orakel deine These bewacht.", "How the oracle guards your thesis.")),
      h("p", { style: { fontFamily: "var(--font-ui)", fontSize: "clamp(14px,1.7vw,16px)", color: "var(--text-secondary)", textAlign: "center", margin: "0 0 26px" } }, T("Viele Signale. Ein Score. Ständige Beobachtung. Deine Entscheidung.", "Many signals. One score. Constant watching. Your decision.")),
      h("div", { className: "osv-flow" }, flowKids),
      h("div", { style: { maxWidth: 520, margin: "28px auto 0" } },
        h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-oracle)", textAlign: "center", marginBottom: 12 } }, T("Thesen-Status", "Thesis status")),
        Waage(80, 4, "INTAKT +0.6")),
      h("div", { style: { marginTop: 28, border: "1px solid #8A6526", borderLeft: "3px solid var(--oracle)", borderRadius: 12, background: "var(--bg-surface)", padding: "18px 22px", textAlign: "center" } },
        h("div", { style: { fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: "clamp(18px,2.4vw,22px)", lineHeight: 1.3, color: "var(--text-primary)" } }, T("Das Orakel warnt. Aber es schließt dein Buch nie von selbst.", "The oracle warns. But it never closes your book by itself.")),
        h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-secondary)", marginTop: 8 } }, T("Du entscheidest — immer. PYTHAI rät nie, sondern beobachtet und meldet.", "You decide — always. PYTHAI never advises; it observes and reports.")))));

    return h("div", null,
      h(SiteNav, { active: "signals.html" }),
      h(SignalsHero, null),

      // EM3: Live-Emometer (Welt-Sentiment) — oberer Bereich, gleich nach dem Hero
      h(Emometer, null),

      // Honest stats
      h(PySection, null, h("div", { className: "pk-grid3" },
        h(Stat, { label: T("Pro Tag", "Per day"), value: "1", sub: T("Reading — kein Dauerfeuer", "reading — no firehose") }),
        h(Stat, { label: T("Thesen-Score", "Thesis score"), value: "0–100", sub: T("jeder Ruf bewertet & begründet", "every call scored & reasoned") }),
        h(Stat, { label: T("Marktgedächtnis", "Market memory"), value: T("seit 1929", "since 1929"), sub: T("Zyklen, Flows, Muster", "cycles, flows, patterns") }))),

      // Noise vs one call
      h(PySection, { alt: true },
        h("div", { style: { marginBottom: 30 } }, h(PyEyebrow, null, T("Warum PYTHAI", "Why PYTHAI")), h(PyH2, null, T("Lärm — oder ein Ruf.", "Noise — or one call."))),
        h("div", { className: "pk-grid2" },
          h(Card, { variant: "raised", padding: "28px" },
            h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--oxblood-bright)", marginBottom: 12 } }, T("Der Markt heute", "The market today")),
            h("ul", { style: { margin: 0, paddingLeft: 18, fontFamily: "var(--font-ui)", fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" } },
              h("li", null, T("Dutzende Push-Alerts, kein „warum“.", "Dozens of push alerts, no “why”.")),
              h("li", null, T("Finfluencer-Hype ohne Begründung.", "Finfluencer hype without reasoning.")),
              h("li", null, T("Du sollst handeln — niemand zeigt, wie er denkt.", "You're told to act — nobody shows their thinking.")))),
          h(Card, { variant: "oracle", padding: "28px" },
            h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-oracle)", marginBottom: 12 } }, "PYTHAI"),
            h("ul", { style: { margin: 0, paddingLeft: 18, fontFamily: "var(--font-ui)", fontSize: 15, lineHeight: 1.7, color: "var(--text-primary)" } },
              h("li", null, T("Ein begründeter Ruf pro Tag.", "One reasoned call a day.")),
              h("li", null, T("Thesen-Score 0–100 + offengelegte Logik.", "Thesis score 0–100 + the logic, in the open.")),
              h("li", null, T("Danach: Beobachtung, ob die These hält.", "After that: watching whether the thesis holds."))))),
        h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, marginTop: 22, maxWidth: "90ch" } }, T("PYTHAI erbringt keine Anlageberatung. Readings sind Markt-Beobachtung mit offengelegter Begründung — du entscheidest eigenverantwortlich.", "PYTHAI provides no investment advice. Readings are market observation with disclosed reasoning — you decide on your own responsibility."))),

      // Wie das Orakel deine These bewacht — responsiver HTML-Flow
      oracleDiagram,

      // Format example
      h(PySection, null,
        h("div", { style: { marginBottom: 40 } }, h(PyEyebrow, null, T("Format-Beispiel", "Format example")), h(PyH2, null, T("So sieht ein Reading aus.", "What a reading looks like."))),
        h("div", { className: "pk-grid3" }, PAST.map((s) =>
          h(Card, { key: s.name, variant: "raised", padding: "26px" },
            h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, h(Badge, { tone: "neutral", variant: "outline" }, s.klasse), h(Badge, { tone: s.won ? "bull" : "bear" }, s.res)),
            h("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 24, color: "var(--text-primary)", marginBottom: 14 } }, s.name),
            h("div", { style: { marginBottom: 14 } }, h(Stat, { label: T("Thesen-Score", "Thesis score"), value: s.score, sub: T("von 100", "of 100"), size: "sm" })),
            h("div", { style: { marginBottom: 16 } },
              h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 7 } }, T("Thesen-Barometer", "Thesis barometer")),
              Waage(s.wpct, s.zone, ZL[s.zone - 1])),
            h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 } }, s.note)))),
        h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, marginTop: 32, maxWidth: "90ch" } }, T("Illustrative Beispiele, die das Format zeigen — keine Erfolgsbilanz. Vergangene Wertentwicklung ist kein Indikator für künftige Ergebnisse. PYTHAI erbringt keine Anlageberatung — siehe vollständigen Risikohinweis.", "Illustrative examples showing the format — not a track record. Past performance is not indicative of future results. PYTHAI provides no investment advice — see the full risk notice."))),

      // Rhythm
      h(PySection, { alt: true },
        h("div", { style: { marginBottom: 26 } }, h(PyEyebrow, null, T("Der Rhythmus", "The rhythm")), h(PyH2, null, T("Die Rituale — was wann kommt.", "The rituals — what arrives, when.")), h("p", { style: lead }, T("PYTHAI ist kein Dauerfeuer, sondern ein fester Rhythmus — vom täglichen Morning Compass für Einsteiger bis zu Echtzeit-Eingriffen im Syndicate. Als Mitglied schaltest du jede Mail einzeln an und aus.", "PYTHAI is not a firehose but a fixed rhythm — from the daily Morning Compass for newcomers to real-time interventions in Syndicate. As a member you switch each email on or off individually."))),
        h("div", { style: { overflowX: "auto" } }, h("table", { style: { width: "100%", borderCollapse: "collapse" } },
          h("thead", null, h("tr", null, h("th", { style: thS }, "Ritual"), h("th", { style: thS }, T("Rhythmus", "Rhythm")), h("th", { style: thS }, T("Für wen", "For whom")))),
          h("tbody", null, RITUALS.map((r) => h("tr", { key: r[0] },
            h("td", { style: tdS }, h("span", { style: { fontFamily: "var(--font-oracle)", fontSize: 19, color: "var(--text-primary)" } }, r[0])),
            h("td", { style: tdS }, h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap" } }, r[1])),
            h("td", { style: tdS }, h("span", { style: { fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--text-secondary)" } }, r[2]))))))),
        h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, marginTop: 24 } }, T("* nahezu in Echtzeit für EU & USA — sofern die API-Schnittstellen laufen. Vereinzelt kann es zu Verzögerungen kommen.", "* near real-time for EU & US — provided the API feeds are running. Occasional delays can occur.")),
        h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, marginTop: 8 } }, T("Observer starten mit dem Morning Compass — der täglichen Edukations-Mail. Der volle Rhythmus lebt im Mitgliederbereich.", "Observers start with the Morning Compass — the daily education email. The full rhythm lives in the member area."))),

      // CTA
      h(PySection, null, h("div", { style: { textAlign: "center", maxWidth: 680, margin: "0 auto" } },
        h(PyEyebrow, null, T("Anfangen", "Get started")),
        h(PyH2, null, T("Lies das nächste Reading bei Sonnenaufgang.", "Read the next reading at dawn.")),
        h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", margin: "12px auto 28px", maxWidth: "60ch" } }, T("Starte als Observer mit dem täglichen Morning Compass — kostenlos. Wann du tiefer willst, entscheidest du.", "Start as an Observer with the daily Morning Compass — free. When you want to go deeper is up to you.")),
        h("div", { style: { display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" } },
          h(Button, { variant: "oracle", size: "lg", onClick: () => { window.location.href = "inner-circle.html#waitlist"; } }, T("Platz anfragen", "Request a seat")),
          h(Button, { variant: "ghost", size: "lg", onClick: () => { window.location.href = "inner-circle.html"; } }, T("Preise ansehen", "See pricing"))))),

      h(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
