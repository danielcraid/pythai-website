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

  const ORACLE_SVG = `<svg viewBox="0 0 1000 660" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%;height:auto;display:block" font-family="'Hanken Grotesk', sans-serif">
<title>Wie das PYTHAI-Orakel deine These bewacht</title>
<desc>Viele Marktsignale fliessen zusammen; Warren verdichtet sie zu einem Thesen-Score; das Orakel beobachtet, ob die These haelt; bei einem Bruch wirst du gewarnt; du entscheidest. Dein Buch wird nie automatisch geschlossen.</desc>
<defs>
<radialGradient id="osg-top" cx="50%" cy="0%" r="75%"><stop offset="0" stop-color="#D4A94E" stop-opacity="0.16"/><stop offset="0.55" stop-color="#08090C" stop-opacity="0"/></radialGradient>
<radialGradient id="osg-eye" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#F2CE7A" stop-opacity="0.55"/><stop offset="1" stop-color="#F2CE7A" stop-opacity="0"/></radialGradient>
<linearGradient id="osg-shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2CE7A"/><stop offset="1" stop-color="#D4A94E" stop-opacity="0"/></linearGradient>
<linearGradient id="osg-line" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A6526"/><stop offset="0.5" stop-color="#F2CE7A"/><stop offset="1" stop-color="#8A6526"/></linearGradient>
</defs>
<rect x="0" y="0" width="1000" height="660" rx="20" fill="#08090C"/>
<rect x="0" y="0" width="1000" height="660" rx="20" fill="url(#osg-top)"/>
<rect x="0.7" y="0.7" width="998.6" height="658.6" rx="20" fill="none" stroke="#20242D" stroke-width="1.4"/>
<text x="500" y="56" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="12.5" letter-spacing="5" fill="#D4A94E">D E R   P Y T H A I   ·   E D G E</text>
<text x="500" y="104" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-size="40" fill="#F4F0E6">Wie das Orakel deine These bewacht.</text>
<text x="500" y="140" text-anchor="middle" font-size="16" fill="#9BA3B2">Viele Signale. Ein Score. Staendige Beobachtung. Deine Entscheidung.</text>
<line x1="120" y1="250" x2="880" y2="250" stroke="url(#osg-line)" stroke-width="11" stroke-opacity="0.13" stroke-linecap="round"/>
<line x1="120" y1="250" x2="880" y2="250" stroke="url(#osg-line)" stroke-width="2" stroke-linecap="round"/>
<g fill="#D4A94E"><circle cx="225" cy="250" r="3"/><circle cx="415" cy="250" r="3"/><circle cx="605" cy="250" r="3"/><circle cx="795" cy="250" r="3"/></g>
<circle cx="120" cy="250" r="42" fill="#0E1014" stroke="#D4A94E" stroke-width="1.6"/>
<g><circle cx="106" cy="238" r="3" fill="#F2CE7A"/><circle cx="120" cy="232" r="3" fill="#D4A94E"/><circle cx="134" cy="240" r="3" fill="#F2CE7A"/><path d="M106,238 L120,262 M120,232 L120,262 M134,240 L120,262" stroke="#F2CE7A" stroke-width="1.4" fill="none"/><circle cx="120" cy="262" r="3.5" fill="#F2CE7A"/></g>
<text x="120" y="320" text-anchor="middle" font-size="17" font-weight="700" fill="#F4F0E6">Signale</text>
<text x="120" y="342" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#9BA3B2">viele Quellen, ein Strom</text>
<circle cx="310" cy="250" r="62" fill="url(#osg-eye)"/>
<circle cx="310" cy="250" r="46" fill="#0E1014" stroke="#F2CE7A" stroke-width="2"/>
<path d="M300,224 L310,258 L320,224 Z" fill="url(#osg-shaft)"/>
<circle cx="310" cy="258" r="5.5" fill="#F2CE7A"/>
<text x="310" y="332" text-anchor="middle" font-size="17" font-weight="700" fill="#F4F0E6">Das Orakel</text>
<text x="310" y="354" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#D4A94E">zum Thesen-Score</text>
<circle cx="500" cy="250" r="42" fill="#0E1014" stroke="#D4A94E" stroke-width="1.6"/>
<path d="M514,242 a16,16 0 1 1 -5,-9" fill="none" stroke="#F2CE7A" stroke-width="2"/>
<path d="M514,231 L514,243 L502,242 Z" fill="#F2CE7A"/>
<text x="500" y="320" text-anchor="middle" font-size="17" font-weight="700" fill="#F4F0E6">Beobachten</text>
<text x="500" y="342" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#9BA3B2">haelt die These?</text>
<circle cx="690" cy="250" r="42" fill="#0E1014" stroke="#E0726B" stroke-width="1.6"/>
<path d="M690,234 L704,262 L676,262 Z" fill="none" stroke="#E0726B" stroke-width="2" stroke-linejoin="round"/>
<line x1="690" y1="246" x2="690" y2="255" stroke="#E0726B" stroke-width="2" stroke-linecap="round"/><circle cx="690" cy="259" r="1.4" fill="#E0726B"/>
<text x="690" y="320" text-anchor="middle" font-size="17" font-weight="700" fill="#F4F0E6">Warnung</text>
<text x="690" y="342" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#E0726B">du wirst gerufen</text>
<circle cx="880" cy="250" r="42" fill="#0E1014" stroke="#6FCF9A" stroke-width="1.6"/>
<path d="M866,250 L876,261 L896,237" fill="none" stroke="#6FCF9A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
<text x="880" y="320" text-anchor="middle" font-size="17" font-weight="700" fill="#F4F0E6">Du entscheidest</text>
<text x="880" y="342" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#9BA3B2">behalten · anpassen · schliessen</text>
<text x="500" y="406" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" letter-spacing="3" fill="#D4A94E">T H E S E N - S T A T U S</text>
<g transform="translate(220,420)">
<polygon points="406,2 414,2 410,12" fill="#F2CE7A"/>
<rect x="0" y="16" width="560" height="11" rx="5.5" fill="#C4524C"/>
<rect x="112" y="16" width="448" height="11" fill="#CF7A4E"/>
<rect x="224" y="16" width="336" height="11" fill="#C9A24E"/>
<rect x="336" y="16" width="224" height="11" fill="#6FB07A"/>
<rect x="448" y="16" width="112" height="11" rx="5.5" fill="#6FCF9A"/>
<g font-family="'JetBrains Mono', monospace" font-size="10" fill="#7C8492"><text x="0" y="44">GEBROCHEN</text><text x="140" y="44" text-anchor="middle">WACKELT</text><text x="280" y="44" text-anchor="middle">NEUTRAL</text><text x="420" y="44" text-anchor="middle">INTAKT</text><text x="560" y="44" text-anchor="end">STARK</text></g>
</g>
<rect x="60" y="510" width="880" height="92" rx="14" fill="#0E1014" stroke="#8A6526" stroke-width="1.2"/>
<rect x="60" y="510" width="5" height="92" rx="2.5" fill="#D4A94E"/>
<text x="500" y="548" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-style="italic" font-size="23" fill="#F4F0E6">Das Orakel warnt. Aber es schliesst dein Buch nie von selbst.</text>
<text x="500" y="582" text-anchor="middle" font-size="15" fill="#C3C9D4">Du entscheidest — immer. PYTHAI raet nie, sondern beobachtet und meldet.</text>
</svg>`;

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

      // Wie das Orakel deine These bewacht — cinematic SVG
      h(PySection, null,
        h("div", { style: { maxWidth: 1000, margin: "0 auto" }, dangerouslySetInnerHTML: { __html: ORACLE_SVG } })),

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
