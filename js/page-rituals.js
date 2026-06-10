(() => {
  const { Button, Switch } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PyPageHead, PySection, PyH2, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const API = "https://api.pythai.ch";
  const { useState, useEffect } = React;
  const h = React.createElement;
  const PRIV = ["inner-circle", "circle-of-trust", "syndicate", "admin"];

  const TIERMAP = {
    observer: { label: "Observer", c: "var(--text-secondary)", b: "var(--border-strong)", bg: "transparent" },
    inner: { label: "Inner Circle", c: "var(--oracle-bright)", b: "var(--border-oracle)", bg: "rgba(212,169,78,0.10)" },
    syndicate: { label: "Syndicate", c: "var(--oxblood-bright)", b: "rgba(168,65,79,0.5)", bg: "rgba(168,65,79,0.12)" }
  };
  function Pill({ tk }) {
    const m = TIERMAP[tk];
    return h("span", { style: { display: "inline-flex", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: m.c, border: "1px solid " + m.b, background: m.bg, borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap" } }, m.label);
  }
  function Field({ label, text }) {
    return h("div", { style: { marginBottom: 14 } }, h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-oracle)", marginBottom: 4 } }, label), h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 } }, text));
  }
  function Shot({ src, label }) {
    const [err, setErr] = useState(false);
    if (err) return h("div", { style: { width: "100%", minHeight: 150, borderRadius: 8, border: "1px dashed var(--border-strong)", background: "var(--bg-input)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16 } }, h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--text-muted)" } }, T("Screenshot folgt", "Screenshot coming")));
    return h("img", { src, alt: label, onError: () => setErr(true), style: { width: "100%", borderRadius: 8, border: "1px solid var(--border-subtle)", display: "block" } });
  }

  function TierSummary() {
    const ROWS = [
      ["observer", "7 / Woche", T("5× Morgen-Headline (Mo–Fr) · Mi Markt-Vibe · Sa Weekend", "5× morning headline (Mon–Fri) · Wed market-vibe · Sat weekend")],
      ["inner", "22+ / Woche", T("Morgen-Headline · Daily Oracle · AFTERNOON BRIEF · Earnings · EOD · Markt-Vibe · Weekend · Sunday", "Morning headline · Daily Oracle · AFTERNOON BRIEF · Earnings · EOD · market-vibe · weekend · Sunday")],
      ["syndicate", T("wie Inner Circle + Telefon", "like Inner Circle + phone"), T("Alles aus Inner Circle, plus Live-Updates, Trade-Alerts und die direkte Linie zu Warren.", "Everything in Inner Circle, plus live updates, trade alerts and the direct line to Warren.")]
    ];
    const th = (txt) => h("th", { style: { textAlign: "left", padding: "0 14px 10px 0", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 400, borderBottom: "1px solid var(--border-subtle)" } }, txt);
    const tdS = { padding: "16px 14px 16px 0", borderBottom: "1px solid var(--border-subtle)", verticalAlign: "top" };
    return h(PySection, null,
      h("div", { style: { marginBottom: 22 } }, h(PyEyebrow, null, T("Aus Tier-Sicht", "By tier")), h(PyH2, null, T("Was jede Stufe pro Woche bekommt.", "What each tier gets per week."))),
      h("div", { style: { overflowX: "auto" } },
        h("table", { style: { width: "100%", borderCollapse: "collapse" } },
          h("thead", null, h("tr", null, th(T("Tier", "Tier")), th(T("Mails / Woche", "Mails / week")), th(T("Werktäglich", "Every weekday")))),
          h("tbody", null, ROWS.map((row) => h("tr", { key: row[0] },
            h("td", { style: tdS }, h(Pill, { tk: row[0] })),
            h("td", { style: tdS },
              h("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 21, lineHeight: 1.1, color: "var(--text-primary)" } }, row[1]),
              h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", marginTop: 5, lineHeight: 1.5, maxWidth: "52ch" } }, row[2])),
            h("td", { style: tdS }, h("span", { style: { color: "var(--oracle-bright)", fontSize: 18 } }, "✓"))))))));
  }

  function Overview({ groups, uk, isEnabled, onToggle }) {
    const all = [];
    groups.forEach((g) => g[2].forEach((r) => all.push(r)));
    all.sort((a, b) => (b.tiers.indexOf("observer") > -1 ? 1 : 0) - (a.tiers.indexOf("observer") > -1 ? 1 : 0)); // Free (Observer) Reports nach oben
    const th = (txt) => h("th", { style: { textAlign: "left", padding: "0 14px 10px 0", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 400, borderBottom: "1px solid var(--border-subtle)" } }, txt);
    const td = (child) => h("td", { style: { padding: "12px 14px 12px 0", borderBottom: "1px solid var(--border-subtle)", verticalAlign: "middle" } }, child);
    return h(PySection, null,
      h("div", { style: { marginBottom: 22 } }, h(PyEyebrow, null, T("Überblick", "Overview")), h(PyH2, null, T("Alle Reports auf einen Blick.", "Every report at a glance."))),
      h("div", { style: { overflowX: "auto" } },
        h("table", { style: { width: "100%", borderCollapse: "collapse" } },
          h("thead", null, h("tr", null, th(T("E-Mail", "Email")), th(T("Report", "Report")), th(T("Rhythmus", "Rhythm")), th(T("Für wen", "For whom")), th(""))),
          h("tbody", null, all.map((r) => h("tr", { key: r.key },
            td(r.tiers.indexOf(uk) !== -1 ? h(Switch, { checked: isEnabled(r.key), onChange: (v) => onToggle(r.key, v) }) : h("span", { style: { fontSize: 14, opacity: 0.55 }, title: r.tiers.indexOf("inner") !== -1 ? "Inner Circle" : "Syndicate" }, "🔒")),
            td(h("a", { href: "#r-" + r.key, style: { fontFamily: "var(--font-oracle)", fontSize: 17, color: "var(--text-primary)", textDecoration: "none" } }, r.name)),
            td(h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap" } }, r.when)),
            td(h("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, r.tiers.map((tk) => h(Pill, { key: tk, tk })))),
            td(h("a", { href: "#r-" + r.key, style: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-oracle)", textDecoration: "none", whiteSpace: "nowrap" } }, T("Details ↓", "Details ↓")))))))));
  }

  function Report({ r }) {
    return h("div", { id: "r-" + r.key, style: { background: "var(--bg-raised)", border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden", marginBottom: 22, scrollMarginTop: "90px" } },
      h("div", { className: "pk-grid2", style: { gap: 0 } },
        h("div", { style: { padding: "28px 30px" } },
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 } },
            h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--text-oracle)" } }, r.when),
            h("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, r.tiers.map((tk) => h(Pill, { key: tk, tk })))),
          h("h3", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 26, color: "var(--text-primary)", margin: "0 0 16px", lineHeight: 1.1 } }, r.name),
          h(Field, { label: T("Was es ist", "What it is"), text: r.was }),
          h(Field, { label: T("Wie du es liest", "How to read it"), text: r.wie })),
        h("div", { style: { padding: "28px 30px", display: "flex", alignItems: "center", background: "var(--bg-surface)" } }, h(Shot, { src: "assets/rituals/" + r.key + ".png", label: r.name }))));
  }

  function App() {
    const [gate, setGate] = useState("loading");
    const [me, setMe] = useState(null);
    const [prefs, setPrefs] = useState({});
    useEffect(() => {
      fetch(API + "/api/me", { credentials: "include" }).then((res) => res.ok ? res.json() : null).then((d) => {
        if (d && d.ok) { setMe(d); setPrefs(d.mailReports || {}); }
        if (d && d.onboardingRequired) { window.location.href = "account.html"; return; }
        const member = d && d.ok && PRIV.indexOf(d.tier) !== -1 && d.approval === "approved";
        setGate(member ? "ok" : "locked");
      }).catch(() => setGate("locked"));
    }, []);
    if (gate === "loading") return h("div", null, h(SiteNav, { active: "rituals.html" }), h("div", { style: { minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 22, color: "var(--text-oracle)" } }, T("Das Orakel prüft deinen Zugang…", "The oracle checks your access…")), h(SiteFooter, null));
    if (gate === "locked") return h("div", null, h(SiteNav, { active: "rituals.html" }), h("section", { style: { minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" } }, h("div", { style: { maxWidth: 480 } }, h("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 58, height: 58, margin: "0 auto 22px", opacity: 0.7 } }), h(PyEyebrow, null, "Inner Circle"), h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 40, margin: "8px 0 0", color: "var(--text-primary)" } }, T("Die Rituale leben im Sanctum.", "The rituals live in the sanctum.")), h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", margin: "16px 0 28px" } }, T("Der Wochen-Rhythmus der Reports — was wann kommt und wie du es liest — ist dem Inner Circle vorbehalten.", "The weekly rhythm of the reports — what arrives when and how to read it — is reserved for the Inner Circle.")), h(Button, { variant: "oracle", onClick: () => { window.location.href = "account.html"; } }, T("Zum Inner Circle", "Go to Inner Circle")))), h(SiteFooter, null));

    const GROUPS = [
      [T("Täglich", "Daily"), T("Montag bis Freitag — der Takt des Handelstags.", "Monday to Friday — the rhythm of the trading day."), [
        { key: "morning-compass", name: "Morning Compass", when: T("Mo–Fr · 07:00 CET", "Mon–Fri · 07:00 CET"), tiers: ["observer", "inner", "syndicate"], was: T("Die Morgenmail f\xFCr alle — vor allem der Einstieg f\xFCr Observer. Wo der Tag steht, die wichtigsten News in Klartext \xFCbersetzt, ein Markt-Begriff kurz erkl\xE4rt, und eine Beobachtung zum Selber-Nachpr\xFCfen \xFCber den Tag. F\xFCr alle, die anfangen, den Markt zu lesen.", "The morning email for everyone — above all the entry point for Observers. Where the day stands, the key news translated into plain language, one market concept explained, and an observation to verify yourself over the day. For anyone starting to read the market."), wie: T("Folge der Beobachtung durch den Tag und pr\xFCf am n\xE4chsten Morgen die ehrliche Aufl\xF6sung. So lernst du Schritt f\xFCr Schritt, den Markt zu lesen — und siehst Warrens Denke \xFCber die Zeit aufgehen. F\xFCr Observer bleibt es auf Index- und Sektor-Ebene: reine Bildung, keine Anlageberatung; die konkreten Marken leben im Inner Circle.", "Follow the observation through the day and check the honest resolution next morning. You learn to read the market step by step — and watch Warren's reasoning play out over time. For Observers it stays at index and sector level: pure education, not investment advice; the concrete levels live in the Inner Circle.") },
        { key: "daily-oracle", name: "Daily Oracle", when: T("Mo–Fr · 06:00 CET", "Mon–Fri · 06:00 CET"), tiers: ["inner", "syndicate"], was: T("Das eine Reading des Tages: ein hochkonzentriertes Setup mit Conviction-Score, Horizont und Asymmetrie. Kein Dauerfeuer an Alerts.", "The one reading of the day: a high-conviction setup with conviction score, horizon and asymmetry. No firehose of alerts."), wie: T("Oben die These in einem Satz, dann der Conviction-Score (≥55), darunter die Setup-Details. Inner Circle: Low+Mid-Risk. Syndicate: zusätzlich High-Risk, Crypto & Forex.", "Headline thesis in one line, then the conviction score (≥55), then the setup detail. Inner Circle: low+mid risk. Syndicate: plus high-risk, crypto & forex.") },
        { key: "lunch", name: "AFTERNOON BRIEF", when: T("Mo–Fr · 16:15 CET", "Mon–Fri · 16:15 CET"), tiers: ["inner", "syndicate"], was: T("Update ~45 Min nach US-Open: was sich seit dem Morgen-Reading bewegt hat und wie die US-Eröffnung läuft, was zu beobachten ist.", "An update ~45 min after the US open: what has moved since the dawn reading and how the US open is going, what to watch."), wie: T("Ein schneller Scan, ein bis zwei Absätze. Kein neues Vollsetup, sondern Kontext zum laufenden Reading.", "A quick scan, a paragraph or two. Not a new full setup, but context on the running reading.") },
        { key: "eod", name: "EOD Recap", when: T("Di–Sa · 02:10 CET", "Tue–Sat · 02:10 CET"), tiers: ["inner", "syndicate"], was: T("End-of-Day-Rückblick: wie das Reading gelaufen ist und was der Markt über Nacht (US-Close) macht.", "End-of-day recap: how the reading played out and what the market does overnight (US close)."), wie: T("Ergebnis-Check plus Ausblick auf den nächsten Tag. Kommt nachts, liegt morgens in deinem Postfach.", "An outcome check plus an outlook for the next day. Sent overnight, in your inbox by morning.") }
      ]],
      [T("Wöchentlich", "Weekly"), T("Der Bogen über die Woche — Ausblick und Rückblick.", "The arc across the week — outlook and review."), [
        { key: "sunday", name: "Sunday Briefing", when: T("So · 20:30 CET", "Sun · 20:30 CET"), tiers: ["inner", "syndicate"], was: T("Der Wochenausblick: was in der kommenden Woche ansteht — Earnings, Macro-Termine, die großen Catalysts.", "The week-ahead: what is coming up — earnings, macro dates, the big catalysts."), wie: T("Dein Fahrplan für die Woche. Lies ihn Sonntagabend, dann weißt du am Montag, worauf Warren schaut.", "Your map for the week. Read it Sunday night and on Monday you will know what Warren is watching.") },
        { key: "weekly", name: "Weekly Recap", when: T("Sa · morgens", "Sat · morning"), tiers: ["observer", "inner", "syndicate"], was: T("Die Woche in der Rückschau: wie die Readings gelaufen sind, Treffer und Lehren.", "The week in review: how the readings performed, hits and lessons."), wie: T("Track-Record-Mentalität — ehrlich, mit Zahlen. Auch für Observer sichtbar.", "A track-record mindset — honest, with numbers. Visible to Observers too.") },
        { key: "markt-vibe", name: "Markt-Vibe der Woche", when: T("Wöchentlich", "Weekly"), tiers: ["observer", "inner", "syndicate"], was: T("Der Stimmungs-Puls: wo der Markt steht, welches Thema dominiert. Edukativ, kein Signal.", "The mood pulse: where the market stands, which theme dominates. Educational, not a signal."), wie: T("Leichte Lektüre zum Reinkommen — perfekt für Observer, die das Orakel kennenlernen.", "Light reading to ease in — perfect for Observers getting to know the oracle.") }
      ]],
      [T("In Echtzeit", "Real-time"), T("Nur wenn es zählt — Syndicate-Eingriffe, während ein Trade läuft.", "Only when it matters — Syndicate interventions while a trade runs."), [
        { key: "live-updates", name: "Live-Updates", when: T("Intraday · bei Bedarf", "Intraday · as needed"), tiers: ["syndicate"], was: T("Echtzeit-Eingriffe während ein Trade läuft: Skim-Trigger, Stop-Verschiebung, Exit-Signal.", "Real-time interventions while a trade runs: skim triggers, stop moves, exit signals."), wie: T("Sie kommen nur, wenn es zählt. Wenn ein Live-Update reinkommt, ist Handeln gefragt.", "They only come when it matters. When a live update lands, it is time to act.") },
        { key: "trade-alerts", name: "Trade-Alerts (SMS)", when: T("Kritisch · Push", "Critical · push"), tiers: ["syndicate"], was: T("Push-Alert aufs Handy in kritischen Momenten: Stop-Hit, Margin, zeitkritischer Exit.", "A push alert to your phone at critical moments: stop hit, margin, a time-critical exit."), wie: T("SMS, knapp und klar. Nur für das Allerwichtigste — kein Marketing, keine Konversation.", "SMS, short and clear. Only for the most critical — no marketing, no conversation.") }
      ]]
    ];

    const uk = me ? (me.tier === "syndicate" || me.tier === "admin" ? "syndicate" : (me.tier === "inner-circle" || me.tier === "circle-of-trust" ? "inner" : "observer")) : "inner";
    const isEnabled = (key) => key === "morning-compass" ? prefs[key] !== false : prefs[key] === true;
    const onToggle = (key, v) => { setPrefs((p) => { const n = Object.assign({}, p); n[key] = v; return n; }); fetch(API + "/api/mail-prefs", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ report: key, on: v }) }).catch(() => { }); };

    return h("div", null, h(SiteNav, { active: "rituals.html" }),
      h(PyPageHead, { eyebrow: "Member rituals", title: "What arrives, and when.", sub: T("Der Wochen-Rhythmus aller Reports von Warren — was wann kommt, für wen, und wie du es liest.", "The weekly rhythm of all of Warren's reports — what arrives when, for whom, and how to read it.") }),
      h(TierSummary, null),
      h(Overview, { groups: GROUPS, uk: uk, isEnabled: isEnabled, onToggle: onToggle }),
      GROUPS.map(([gtitle, gtag, reports], gi) => h(PySection, { key: gi, alt: gi % 2 === 1 },
        h("div", { style: { marginBottom: 28 } }, h(PyEyebrow, null, T("Rhythmus", "Rhythm")), h(PyH2, null, gtitle), h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--text-secondary)", margin: "6px 0 0" } }, gtag)),
        reports.map((r) => h(Report, { key: r.key, r: r })))),
      h(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
