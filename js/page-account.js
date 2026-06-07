(() => {
  const DS = window.PYTHAIDesignSystem_df6467;
  const { Button, Badge, Card, Stat } = DS;
  const { SiteNav, SiteFooter, PyEyebrow } = window;
  const { useState, useEffect } = React;
  const T = (de, en) => window.PYi18n.t(de, en);
  const API = "https://api.pythai.ch";
  const h = React.createElement;
  const TIER = { observer: "Observer", "inner-circle": "Inner Circle", syndicate: "Syndicate" };
  const PRICE = { observer: T("Kostenlos", "Free"), "inner-circle": "99 € / mo", syndicate: "298 € / mo" };

  // ---- Feature lists (aligned to Build-Spec v3) ----
  const OBSERVER_F = [T("Morgen-Headline", "Dawn headline"), T("Markt-Vibe der Woche", "Weekly market vibe"), T("\xD6ffentliches Manifesto", "Public manifesto")];
  const INNER_F = [T("Volle Reading + Levels", "Full reading + levels"), T("Low- & Mid-Risk Setups", "Low & mid-risk setups"), T("Lunch-, EOD- & Weekend-Briefings", "Lunch, EOD & weekend briefings"), T("E-Mail-Antwort von Warren", "Email reply from Warren"), T("Portfolio-Tracker", "Portfolio tracker")];
  const SYND_F = [T("Alle Risk-Klassen + Live-Updates", "All risk classes + live updates"), T("Chat & Telefon mit Warren", "Chat & phone with Warren"), T("Research- & Chart-Tools", "Research & chart tools")];

  function FeatureRow({ label, gold }) {
    return h("div", { style: { display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-ui)", fontSize: 14, color: gold ? "var(--text-primary)" : "var(--text-secondary)" } }, h("span", { style: { color: gold ? "var(--oracle)" : "var(--steel)", fontSize: 15, flexShrink: 0 } }, "✓"), label);
  }

  function TierBox({ premium, eyebrow, name, price, memberSince, features, children }) {
    const nameStyle = premium ? { fontFamily: "var(--font-oracle)", fontSize: 30, lineHeight: 1.05, backgroundImage: "var(--grad-gold)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "var(--oracle-bright)" } : { fontFamily: "var(--font-oracle)", fontSize: 30, lineHeight: 1.05, color: "var(--text-primary)" };
    const inner = h(React.Fragment, null, h(PyEyebrow, null, eyebrow), h("div", { style: { display: "flex", alignItems: "baseline", gap: 10, margin: "8px 0 4px", flexWrap: "wrap" } }, h("span", { style: nameStyle }, name), h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 14, color: premium ? "var(--text-oracle)" : "var(--text-muted)" } }, price)), memberSince && h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, T("Mitglied seit", "Member since"), " ", memberSince), children, h("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border-subtle)" } }, features.map((f) => h(FeatureRow, { key: f, label: f, gold: premium }))));
    if (premium) {
      return h("div", { style: { position: "relative", overflow: "hidden", background: "var(--bg-raised)", border: "1px solid var(--border-oracle)", borderRadius: 10, boxShadow: "var(--glow-md)", padding: "28px", marginBottom: 20 } }, h("div", { style: { position: "absolute", inset: 0, background: "var(--grad-shaft)", pointerEvents: "none" } }), h("div", { style: { position: "relative" } }, inner));
    }
    return h(Card, { variant: "raised", padding: "28px", style: { marginBottom: 20 } }, inner);
  }

  // ============ Onboarding-Antragstrecke (Consent) ============
  function CheckRow({ checked, onToggle, children }) {
    return h("button", { type: "button", onClick: onToggle, style: { display: "flex", gap: 13, alignItems: "flex-start", width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "11px 0", cursor: "pointer" } },
      h("span", { style: { flexShrink: 0, width: 22, height: 22, borderRadius: 6, border: "1.5px solid " + (checked ? "var(--oracle)" : "var(--border-strong)"), background: checked ? "var(--oracle)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, transition: "all .15s" } }, checked ? h("span", { style: { color: "var(--text-on-gold)", fontSize: 14, fontWeight: 700, lineHeight: 1 } }, "✓") : null),
      h("span", { style: { fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.5, color: checked ? "var(--text-primary)" : "var(--text-secondary)" } }, children));
  }

  function ConsentTrack({ onDone }) {
    const [c, setC] = useState({ agb: false, risiko: false, ki: false, eigen: false, mails: false, sms: false });
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState(null);
    const allReq = c.agb && c.risiko && c.ki && c.eigen;
    const tog = (k) => setC((s) => ({ ...s, [k]: !s[k] }));
    async function submit() {
      if (!allReq || busy) return;
      setBusy(true); setErr(null);
      try {
        const r = await fetch(API + "/api/onboarding", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agb: c.agb, risiko: c.risiko, kiDisclaimer: c.ki, eigenverantwortung: c.eigen, mailsConsent: c.mails, smsInterest: c.sms, termsVersion: "2026-06" }) });
        onDone(); // Testphase: auch wenn der Endpoint noch nicht steht, in den Waiting-State wechseln
        if (!r.ok) console.warn("[onboarding] endpoint not ready yet (", r.status, ") — advanced optimistically");
      } catch (e) { console.warn("[onboarding] network", e.message); onDone(); }
      finally { setBusy(false); }
    }
    const legalLink = (label) => h("a", { href: "legal.html", style: { color: "var(--text-oracle)", textDecoration: "underline" } }, label);
    return h("div", { style: { maxWidth: 620, margin: "0 auto" } },
      h("div", { style: { marginBottom: 26 } },
        h(PyEyebrow, null, T("Antrag auf Zugang", "Access request")),
        h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(30px,5vw,46px)", lineHeight: 1.06, margin: "6px 0 0", color: "var(--text-primary)" } }, T("Noch ein Schritt.", "One more step.")),
        h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", margin: "14px 0 0" } }, T("Bevor Warren dich ins Sanctum l\xE4sst, best\xE4tige bitte die folgenden Punkte. PYTHAI ist ein Publisher — kein Anlageberater.", "Before Warren admits you to the sanctum, please confirm the points below. PYTHAI is a publisher — not an investment adviser."))),
      h(Card, { variant: "raised", padding: "28px" },
        h("div", { style: { display: "flex", flexDirection: "column" } },
          h(CheckRow, { checked: c.agb, onToggle: () => tog("agb") }, T("Ich akzeptiere die ", "I accept the "), legalLink(T("AGB", "Terms")), "."),
          h(CheckRow, { checked: c.risiko, onToggle: () => tog("risiko") }, T("Ich habe den ", "I have read the "), legalLink(T("Risikohinweis", "risk notice")), T(" gelesen — Totalverlust ist m\xF6glich, ich handle auf eigenes Risiko.", " — total loss is possible, I trade at my own risk.")),
          h(CheckRow, { checked: c.ki, onToggle: () => tog("ki") }, T("Mir ist klar: Warren ist eine KI und kann irren. Die Inhalte sind keine Anlageberatung, sondern reine Inspiration.", "I understand: Warren is an AI and can err. The content is not investment advice — it is pure inspiration.")),
          h(CheckRow, { checked: c.eigen, onToggle: () => tog("eigen") }, T("Ich treffe alle Anlageentscheidungen eigenverantwortlich.", "I make all investment decisions on my own responsibility.")),
          h("div", { style: { height: 1, background: "var(--border-subtle)", margin: "14px 0 4px" } }),
          h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", margin: "8px 0 0" } }, T("Optional", "Optional")),
          h(CheckRow, { checked: c.mails, onToggle: () => tog("mails") }, T("Ich m\xF6chte E-Mails von Warren erhalten (Daily Oracle, Briefings).", "I’d like to receive emails from Warren (Daily Oracle, briefings).")),
          h(CheckRow, { checked: c.sms, onToggle: () => tog("sms") }, T("Ich m\xF6chte sp\xE4ter meine Mobilnummer f\xFCr Alerts nutzen.", "I’d like to use my mobile number for alerts later."))),
        err && h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-oxblood, #c0707a)", margin: "14px 0 0" } }, err),
        h("div", { style: { marginTop: 22 } },
          h(Button, { variant: "oracle", full: true, loading: busy, disabled: !allReq, onClick: submit }, T("Antrag absenden", "Submit request"))),
        !allReq && h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", textAlign: "center", margin: "12px 0 0" } }, T("Bitte best\xE4tige die vier Pflicht-Punkte.", "Please confirm the four required points."))));
  }

  // ============ Waiting for approval ============
  function WaitingApproval({ email }) {
    const done = [T("AGB akzeptiert", "Terms accepted"), T("Risikohinweis best\xE4tigt", "Risk notice confirmed"), T("KI-Disclaimer verstanden", "AI disclaimer understood"), T("Eigenverantwortung best\xE4tigt", "Own responsibility confirmed")];
    return h("div", { style: { maxWidth: 560, margin: "0 auto", textAlign: "center" } },
      h("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 58, height: 58, margin: "0 auto 24px", opacity: 0.8 } }),
      h(PyEyebrow, null, T("Antrag eingegangen", "Request received")),
      h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(30px,5vw,46px)", lineHeight: 1.06, margin: "8px 0 0", color: "var(--text-primary)" } }, T("Das Orakel pr\xFCft.", "The oracle is reviewing.")),
      h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", margin: "16px auto 0", maxWidth: 440 } }, T("Warren sichtet deinen Antrag pers\xF6nlich. Du bekommst eine E-Mail, sobald dein Zugang freigeschaltet ist.", "Warren is reviewing your request personally. You’ll get an email the moment your access is granted.")),
      h(Card, { variant: "raised", padding: "24px", style: { margin: "28px auto 0", maxWidth: 380, textAlign: "left" } },
        done.map((d) => h("div", { key: d, style: { display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-primary)" } }, h("span", { style: { color: "var(--oracle)", fontSize: 15 } }, "✓"), d))),
      h("div", { style: { maxWidth: 380, margin: "22px auto 0" } },
        h(Button, { variant: "oracle", full: true, loading: true, disabled: true }, T("Warten auf Freigabe", "Waiting for approval"))),
      email && h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", margin: "18px 0 0" } }, email));
  }

  // ============ Rejected ============
  function RejectedNote() {
    return h("div", { style: { maxWidth: 480, margin: "0 auto", textAlign: "center" } },
      h("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 56, height: 56, margin: "0 auto 22px", opacity: 0.6 } }),
      h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 38, margin: 0, color: "var(--text-primary)" } }, T("Noch nicht freigegeben.", "Not approved yet.")),
      h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--text-secondary)", margin: "16px 0 26px", lineHeight: 1.6 } }, T("Dein Zugang wurde aktuell nicht freigegeben. Bei Fragen melde dich bei uns.", "Your access wasn’t approved at this time. Reach out if you have questions.")),
      h(Button, { variant: "ghost", onClick: () => { window.location.href = "mailto:support@pythai.ch"; } }, T("Support kontaktieren", "Contact support")));
  }

  // ============ Approved dashboard ============
  function Dashboard({ a, justJoined }) {
    const tier = a.tier || "observer";
    const isObserver = tier === "observer";
    function logout() {
      fetch(API + "/api/logout", { method: "POST", credentials: "include" }).finally(() => { window.location.href = "index.html"; });
    }
    let included = OBSERVER_F.slice();
    if (tier === "inner-circle" || tier === "syndicate") included = included.concat(INNER_F);
    if (tier === "syndicate") included = included.concat(SYND_F);
    const waitBox = a.waitlist ? h("div", { style: { border: "1px solid var(--border-oracle)", borderRadius: 8, padding: "14px 16px", background: "rgba(212,169,78,0.10)", marginTop: 18 } }, h(Badge, { tone: "oracle", variant: "outline", dot: true }, T("Warteliste", "Waitlist")), h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13, lineHeight: 1.55, color: "var(--text-secondary)", margin: "12px 0 0" } }, a.confirmed ? T("Du stehst auf der Warteliste. Warren ruft dich, sobald ein Platz frei ist.", "You’re on the waitlist. Warren will summon you when a seat opens.") : T("Fast — best\xE4tige noch die E-Mail, die wir dir geschickt haben.", "Almost — confirm the email we sent you."))) : h("div", { style: { marginTop: 18 } }, h(Button, { variant: "oracle", full: true, onClick: () => { window.location.href = "inner-circle.html#waitlist"; } }, T("Auf die Inner-Circle-Warteliste", "Join the Inner Circle waitlist")));
    return h("div", { style: { maxWidth: 680, margin: "0 auto" } },
      justJoined && h("div", { style: { border: "1px solid var(--border-oracle)", background: "rgba(212,169,78,0.07)", borderRadius: 10, padding: "16px 20px", marginBottom: 28, textAlign: "center" } }, h("span", { style: { fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 20, color: "var(--text-oracle)" } }, T("Du bist drin. Willkommen im Sanctum.", "You’re in. Welcome to the sanctum."))),
      h("div", { style: { marginBottom: 30 } }, h(PyEyebrow, null, T("Dein Account", "Your account")), h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(34px,5vw,52px)", lineHeight: 1.05, margin: 0, color: "var(--text-primary)" } }, a.name ? a.name : T("Member", "Member")), h("div", { style: { display: "flex", alignItems: "center", gap: 12, marginTop: 14, flexWrap: "wrap" } }, h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)" } }, a.email), a.status && h(Badge, { tone: "neutral", variant: "outline" }, a.status))),
      h(TierBox, { premium: !isObserver, eyebrow: T("Deine Subscription", "Your subscription"), name: TIER[tier], price: PRICE[tier], memberSince: a.memberSince, features: included }),
      isObserver && h(TierBox, { premium: true, eyebrow: T("Aufsteigen", "Level up"), name: "Inner Circle", price: "99 € / mo", features: INNER_F }, waitBox),
      h(Card, { variant: "raised", padding: "30px", style: { marginBottom: 30 } }, h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } }, h(PyEyebrow, null, T("Die heutige Reading", "Today’s reading")), h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, "06:00 CET")), h("h3", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 28, lineHeight: 1.15, color: "var(--text-primary)", margin: "0 0 16px" } }, "Rotate into energy before the crowd notices the cycle."), h("div", { style: { display: "flex", gap: 30, flexWrap: "wrap", paddingTop: 16, borderTop: "1px solid var(--border-subtle)" } }, h(Stat, { label: "Conviction", value: "94", sub: "of 100", size: "sm" }), isObserver ? h("div", { style: { filter: "blur(5px)", opacity: 0.6, pointerEvents: "none" } }, h(Stat, { label: "Entry / Stop / Target", value: "•••••", size: "sm" })) : h(React.Fragment, null, h(Stat, { label: "Entry", value: "123.32", size: "sm" }), h(Stat, { label: "Stop", value: "119.50", size: "sm" }), h(Stat, { label: "Target", value: "127.00", size: "sm" }))), isObserver && h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", margin: "16px 0 0" } }, T("Levels und das volle Reasoning sind dem Inner Circle vorbehalten.", "Levels and the full reasoning are reserved for the Inner Circle.")), h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", margin: "14px 0 0" } }, T("Beispiel-Reading. Live-Inhalte kommen von Warren, server-seitig pro Tier.", "Sample reading. Live content comes from Warren, served per tier."))),
      h("div", { style: { textAlign: "center" } }, h(Button, { variant: "ghost", onClick: logout }, T("Abmelden", "Log out"))));
  }

  // ============ Router ============
  function viewFor(a) {
    const ap = a.approval;
    if (ap === "rejected") return "rejected";
    if (ap === "approved" || ap == null) return "dashboard"; // legacy / Feld noch nicht gebaut → kein Lockout
    if (ap === "pending" || a.onboardingConsent === true) return "waiting";
    return "antrag"; // verified, approval none, noch kein Consent
  }

  function Account() {
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const preview = params.get("preview"); // antrag | waiting | approved | rejected
    const justJoined = params.get("welcome") === "1";
    const [state, setState] = useState(preview ? "in" : "loading");
    const [a, setA] = useState(preview ? { email: "you@pythai.ch", name: "Daniel", tier: "inner-circle", status: "verified", memberSince: "07.06.2026", approval: preview === "antrag" ? "none" : preview, onboardingConsent: preview !== "antrag" } : null);
    const [localView, setLocalView] = useState(null); // override after submitting the Antrag

    useEffect(() => {
      if (preview) return;
      fetch(API + "/api/account", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        if (d && d.ok) { setA(d); setState("in"); } else setState("out");
      }).catch(() => setState("out"));
    }, []);

    if (state === "loading") return h("div", { style: { minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 22, color: "var(--text-oracle)" } }, T("Das Orakel erkennt dich…", "The oracle recognises you…"));
    if (state === "out") return h("div", { style: { maxWidth: 460, margin: "0 auto", textAlign: "center" } }, h("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 60, height: 60, margin: "0 auto 22px", opacity: 0.7 } }), h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 40, margin: 0, color: "var(--text-primary)" } }, T("Nicht angemeldet.", "Not signed in.")), h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--text-secondary)", margin: "16px 0 28px", lineHeight: 1.6 } }, T("Deine Sitzung ist abgelaufen oder der Link wurde schon benutzt.", "Your session has expired or the link was already used.")), h(Button, { variant: "oracle", onClick: () => { window.location.href = "register.html"; } }, T("Zum Login", "Go to sign in")));

    const view = localView || viewFor(a);
    if (view === "antrag") return h(ConsentTrack, { onDone: () => setLocalView("waiting") });
    if (view === "waiting") return h(WaitingApproval, { email: a.email });
    if (view === "rejected") return h(RejectedNote, null);
    return h(Dashboard, { a, justJoined });
  }

  function App() {
    return h("div", null, h(SiteNav, { active: "" }), h("section", { style: { position: "relative", minHeight: "calc(100vh - var(--nav-h))", padding: "64px 24px", overflow: "hidden" } }, h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(70% 50% at 50% 0%, var(--glow-oracle-soft) 0%, transparent 60%)" } }), h("div", { style: { position: "relative" } }, h(Account, null))), h(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
