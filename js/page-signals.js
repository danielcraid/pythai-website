(() => {
  const { Card, Stat, Badge, Button } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PySection, PyH2, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const h = React.createElement;
  const Z = ["#C4524C", "#CF7A4E", "#C9A24E", "#6FB07A", "#6FCF9A"];

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
    { name: "Xetra-Gold ETC", klasse: T("Rohstoff", "Commodity"), score: "50", res: "+3.0%", won: true, note: T("Macro-Hedge in den NFP — früh realisiert, ohne Wochenend-Risiko.", "Macro hedge into NFP — realised early, no weekend risk.") },
    { name: "Rheinmetall AG", klasse: T("Aktie", "Equity"), score: "70", res: "+8.5%", won: true, note: T("Getrieben vom NATO-Auftragsflow — gestaffelt aufgebaut.", "Driven by NATO order flow — built up in stages.") },
    { name: "Bitcoin · BTC/EUR", klasse: T("Krypto", "Crypto"), score: "85", res: "+12.8%", won: true, note: T("Vol-Expansion vor FOMC — als risikoarme Kernposition gedacht.", "Vol-expansion pre-FOMC — framed as a low-risk core position.") }
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

    return h("div", null,
      h(SiteNav, { active: "signals.html" }),
      h(SignalsHero, null),

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

      // Engine
      h(PySection, null,
        h("div", { style: { marginBottom: 30 } }, h(PyEyebrow, null, T("Die Engine", "The engine")), h(PyH2, null, T("Vom Rauschen zum Ruf.", "From noise to call.")), h("p", { style: lead }, T("Drei Schritte, jeden Morgen — KI-native, aber für Menschen lesbar.", "Three steps, every morning — AI-native, but readable for humans."))),
        h("div", { className: "pk-grid3" }, ENGINE.map((e) =>
          h(Card, { key: e[0], variant: "raised", padding: "26px" },
            h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.14em", color: "var(--text-oracle)", marginBottom: 12 } }, e[0]),
            h("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 25, color: "var(--text-primary)", marginBottom: 10 } }, e[1]),
            h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 } }, e[2]))))),

      // Signals UND Beobachten — the USP
      h(PySection, { alt: true },
        h("div", { className: "pk-grid2", style: { alignItems: "center" } },
          h("div", null,
            h(PyEyebrow, null, T("Der Unterschied", "The difference")),
            h(PyH2, null, T("Signale — und Beobachten.", "Signals — and watching.")),
            h("p", { style: lead }, T("Ein Signal ist erst der Anfang. Warren beobachtet danach, ob die These trägt: Hält sie? Wackelt sie? Ist sie gebrochen? Du siehst den Thesen-Status auf einen Blick — und wirst gerufen, wenn er kippt.", "A signal is only the start. Warren then watches whether the thesis carries: Does it hold? Is it wavering? Is it broken? You see the thesis status at a glance — and get called when it tips.")),
            h("p", { style: Object.assign({}, lead, { marginTop: 14 }) }, T("Das ist KI-native Markt-Beobachtung — für jeden lesbar, vom Einsteiger bis zum Syndicate.", "That's AI-native market observation — readable for everyone, from newcomer to Syndicate."))),
          h("div", null,
            h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-oracle)", marginBottom: 10 } }, T("Thesen-Status", "Thesis status")),
            h("div", { style: { position: "relative", height: 14, marginBottom: 4 } }, h("span", { style: { position: "absolute", left: "78%", transform: "translateX(-50%)", color: "var(--oracle-bright)", fontSize: 13 } }, "▼")),
            h("div", { style: { display: "flex", height: 10, borderRadius: 999, overflow: "hidden" } }, Z.map((c, i) => h("span", { key: i, style: { flex: 1, background: c } }))),
            h("div", { style: { display: "flex", marginTop: 8 } }, ["GEBROCHEN", "WACKELT", "NEUTRAL", "INTAKT", "STARK"].map((zl, i) => h("span", { key: zl, style: { flex: 1, fontFamily: "var(--font-mono)", fontSize: 8.5, color: "var(--text-muted)", textAlign: i === 0 ? "left" : i === 4 ? "right" : "center" } }, zl))),
            h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#6FB07A", marginTop: 14 } }, "INTAKT +0.6"),
            h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)", margin: "6px 0 0" } }, T("Beispiel-Visualisierung. Die Waage zeigt, wie stark eine These gerade trägt.", "Example visualisation. The scale shows how strongly a thesis is currently carrying."))))),

      // Format example
      h(PySection, null,
        h("div", { style: { marginBottom: 40 } }, h(PyEyebrow, null, T("Format-Beispiel", "Format example")), h(PyH2, null, T("So sieht ein Reading aus.", "What a reading looks like."))),
        h("div", { className: "pk-grid3" }, PAST.map((s) =>
          h(Card, { key: s.name, variant: "raised", padding: "26px" },
            h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, h(Badge, { tone: "neutral", variant: "outline" }, s.klasse), h(Badge, { tone: s.won ? "bull" : "bear" }, s.res)),
            h("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 24, color: "var(--text-primary)", marginBottom: 14 } }, s.name),
            h("div", { style: { marginBottom: 14 } }, h(Stat, { label: T("Thesen-Score", "Thesis score"), value: s.score, sub: T("von 100", "of 100"), size: "sm" })),
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
