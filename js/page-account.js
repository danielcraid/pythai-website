(() => {
  const DS = window.PYTHAIDesignSystem_df6467;
  const { Button, Badge, Card, Stat, Switch, Input } = DS;
  const { SiteNav, SiteFooter, PyEyebrow } = window;
  const { useState, useEffect } = React;
  const T = (de, en) => window.PYi18n.t(de, en);
  const API = "https://api.pythai.ch";
  const h = React.createElement;
  const TIER = { observer: "Observer", "inner-circle": "Inner Circle", "circle-of-trust": "Circle of Trust", syndicate: "Syndicate", admin: "Admin" };
  const PRICE = { observer: T("Kostenlos", "Free"), "inner-circle": "69 € / Monat", "circle-of-trust": "", syndicate: "289 € / Monat", admin: "—" };

  // ---- Feature lists (aligned to Build-Spec v3) ----
  const OBSERVER_F = [T("Morgen-Headline", "Dawn headline"), T("Markt-Vibe der Woche", "Weekly market vibe"), T("\xD6ffentliches Manifesto", "Public manifesto")];
  const INNER_F = [T("Volle Reading + Levels", "Full reading + levels"), T("Low- & Mid-Risk Setups", "Low & mid-risk setups"), T("Im Spiel, EOD- & Weekend-Briefings", "Im Spiel, EOD & weekend briefings"), T("Chat mit Warren — mit Kontext", "Chat with Warren — with context"), T("Research- & Chart-Tools", "Research & chart tools")];
  const SYND_F = [T("Alles aus Inner Circle", "Everything in Inner Circle"), T("Alle Risk-Klassen + Live-Updates", "All risk classes + live updates"), T("Telefon mit Warren", "Phone with Warren"), T("Portfolio-Tracker", "Portfolio tracker")];

  function FeatureRow({ label, gold, accent }) {
    const lit = gold || !!accent;
    return h("div", { style: { display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-ui)", fontSize: 14, color: lit ? "var(--text-primary)" : "var(--text-secondary)" } }, h("span", { style: { color: accent || (gold ? "var(--oracle)" : "var(--steel)"), fontSize: 15, flexShrink: 0 } }, "✓"), label);
  }

  function TierBox({ premium, royal, eyebrow, name, price, memberSince, features, children }) {
    const baseName = { fontFamily: "var(--font-oracle)", fontSize: 30, lineHeight: 1.05 };
    const nameStyle = royal
      ? Object.assign({}, baseName, { backgroundImage: "linear-gradient(180deg, #C65A68 0%, #7C2A38 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "var(--oxblood-bright)" })
      : premium
        ? Object.assign({}, baseName, { backgroundImage: "var(--grad-gold)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "var(--oracle-bright)" })
        : Object.assign({}, baseName, { color: "var(--text-primary)" });
    const priceColor = royal ? "var(--oxblood-bright)" : premium ? "var(--text-oracle)" : "var(--text-muted)";
    const inner = h(React.Fragment, null, h(PyEyebrow, null, eyebrow), h("div", { style: { display: "flex", alignItems: "baseline", gap: 10, margin: "8px 0 4px", flexWrap: "wrap" } }, h("span", { style: nameStyle }, name), h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 14, color: priceColor } }, price)), memberSince && h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, T("Mitglied seit", "Member since"), " ", memberSince), children, h("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border-subtle)" } }, features.map((f) => h(FeatureRow, { key: f, label: f, gold: premium && !royal, accent: royal ? "var(--oxblood-bright)" : void 0 }))));
    if (royal) {
      return h("div", { style: { position: "relative", overflow: "hidden", background: "var(--bg-raised)", border: "1px solid rgba(168,65,79,0.55)", borderRadius: 10, boxShadow: "0 0 42px var(--glow-oxblood)", padding: "28px", marginBottom: 20 } }, h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(130% 80% at 50% 0%, rgba(124,42,56,0.30) 0%, rgba(78,24,34,0.12) 42%, transparent 72%)" } }), h("div", { style: { position: "relative" } }, inner));
    }
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
    const legalLink = (label, hash) => h("a", { href: "legal.html#" + hash, target: "_blank", rel: "noopener", style: { color: "var(--text-oracle)", textDecoration: "underline" } }, label);
    return h("div", { style: { maxWidth: 620, margin: "0 auto" } },
      h("div", { style: { marginBottom: 26 } },
        h(PyEyebrow, null, T("Antrag auf Zugang", "Access request")),
        h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(30px,5vw,46px)", lineHeight: 1.06, margin: "6px 0 0", color: "var(--text-primary)" } }, T("Noch ein Schritt.", "One more step.")),
        h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", margin: "14px 0 0" } }, T("Bevor Warren dich ins Sanctum l\xE4sst, best\xE4tige bitte die folgenden Punkte. PYTHAI ist ein Publisher — kein Anlageberater.", "Before Warren admits you to the sanctum, please confirm the points below. PYTHAI is a publisher — not an investment adviser."))),
      h(Card, { variant: "raised", padding: "28px" },
        h("div", { style: { display: "flex", flexDirection: "column" } },
          h(CheckRow, { checked: c.agb, onToggle: () => tog("agb") }, T("Ich akzeptiere die ", "I accept the "), legalLink(T("AGB", "Terms"), "terms"), "."),
          h(CheckRow, { checked: c.risiko, onToggle: () => tog("risiko") }, T("Ich habe den ", "I have read the "), legalLink(T("Risikohinweis", "risk notice"), "risk"), T(" gelesen — Totalverlust ist m\xF6glich, ich handle auf eigenes Risiko.", " — total loss is possible, I trade at my own risk.")),
          h(CheckRow, { checked: c.ki, onToggle: () => tog("ki") }, T("Mir ist klar: Warren ist eine KI und kann irren. Die Inhalte sind keine Anlageberatung, sondern reine Inspiration.", "I understand: Warren is an AI and can err. The content is not investment advice — it is pure inspiration.")),
          h(CheckRow, { checked: c.eigen, onToggle: () => tog("eigen") }, T("Ich treffe alle Anlageentscheidungen eigenverantwortlich.", "I make all investment decisions on my own responsibility.")),
          h("div", { style: { height: 1, background: "var(--border-subtle)", margin: "14px 0 4px" } }),
          h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", margin: "8px 0 0" } }, T("Optional", "Optional")),
          h(CheckRow, { checked: c.mails, onToggle: () => tog("mails") }, T("Ich m\xF6chte E-Mails von Warren erhalten (Daily Oracle, Briefings).", "I’d like to receive emails from Warren (Daily Oracle, briefings).")),
          h(CheckRow, { checked: c.sms, onToggle: () => tog("sms") }, T("Ich m\xF6chte sp\xE4ter meine Mobilnummer f\xFCr Alerts nutzen.", "I’d like to use my mobile number for alerts later.")), h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 12.5, lineHeight: 1.55, color: "var(--text-muted)", margin: "12px 0 0" } }, T("News-Streams (Breaking · Critical & Morning News Flash) von news@pythai.ch sind standardm\xE4\xDFig aktiv — kein extra H\xE4kchen n\xF6tig, sie fallen unter deinen Mail-Consent. Du steuerst sie jederzeit in den Rituals.", "News streams (Breaking · Critical & Morning News Flash) from news@pythai.ch are on by default — no extra checkbox needed, they fall under your mail consent. Manage them anytime in Rituals."))),
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

  // ============ Journey roadmap — "Dein Weg ins Sanctum" ============
  const JR_CSS = `
.jr-wrap{max-width:560px;margin:0 auto;}
.jr-eyebrow{font:600 10px/1 var(--font-mono);letter-spacing:.24em;text-transform:uppercase;color:var(--oracle);text-align:center;}
.jr-progrow{display:flex;justify-content:space-between;align-items:baseline;gap:12px;font:500 11px/1 var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary);margin-top:16px;}
.jr-progrow b{color:var(--oracle-bright);font-weight:600;}
.jr-bar{height:5px;border-radius:999px;background:var(--bg-elevated);margin-top:10px;overflow:hidden;}
.jr-bar>i{display:block;height:100%;border-radius:999px;background:var(--oracle);transition:width .4s ease;}
.jr-steps{margin-top:28px;}
.jr-step{display:grid;grid-template-columns:38px 1fr;gap:16px;}
.jr-rail{display:flex;flex-direction:column;align-items:center;}
.jr-node{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:600 14px/1 var(--font-mono);flex:none;border:1.5px solid var(--border-strong);color:var(--text-muted);background:var(--bg-surface);}
.jr-node-done{background:var(--oracle);border-color:var(--oracle);color:var(--text-on-gold);}
.jr-node-cur{border-color:var(--oracle-bright);color:var(--oracle-bright);background:rgba(212,169,78,.10);animation:jrpulse 1.9s ease-out infinite;}
@keyframes jrpulse{0%{box-shadow:0 0 0 0 rgba(242,206,122,.45)}70%{box-shadow:0 0 0 12px rgba(242,206,122,0)}100%{box-shadow:0 0 0 0 rgba(242,206,122,0)}}
.jr-line{flex:1 0 auto;width:2px;min-height:24px;margin:5px 0;background:var(--border-strong);}
.jr-line-gold{background:var(--oracle);}
.jr-line-dim{background:repeating-linear-gradient(180deg,var(--border-strong) 0 4px,transparent 4px 9px);}
.jr-content{padding-bottom:24px;min-width:0;}
.jr-step:last-child .jr-content{padding-bottom:0;}
.jr-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.jr-title{font:400 21px/1.15 var(--font-oracle);color:var(--text-primary);}
.jr-todo .jr-title{color:var(--text-secondary);}
.jr-pill{font:600 9px/1 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;padding:5px 9px;border-radius:999px;border:1px solid transparent;white-space:nowrap;}
.jr-pill-done{color:var(--bull-bright);border-color:rgba(111,207,154,.4);background:rgba(111,207,154,.08);}
.jr-pill-cur{color:var(--oracle-bright);border-color:var(--border-oracle);background:rgba(212,169,78,.10);}
.jr-pill-todo{color:var(--text-muted);border-color:var(--border-strong);}
.jr-desc{font:400 14px/1.55 var(--font-ui);color:var(--text-secondary);margin:7px 0 0;}
.jr-todo .jr-desc{color:var(--text-muted);}
.jr-cta{display:inline-block;padding:11px 22px;border-radius:8px;background:var(--oracle);color:var(--text-on-gold);font:600 12px/1 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;border:none;cursor:pointer;text-decoration:none;}
.jr-cta-ghost{display:inline-block;padding:11px 18px;border-radius:8px;background:transparent;color:var(--text-secondary);font:600 11px/1 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;border:1px solid var(--border-strong);cursor:pointer;}
@media (max-width:420px){.jr-title{font-size:19px;}}
`;
  function JourneyRoadmap({ a, inlinePanel }) {
    const consent = a.onboardingConsent === true;
    const approved = a.approval === "approved";
    const confirmed = a.confirmed !== false;
    const lsDone = (() => { try { return localStorage.getItem("py_setup_done") === "1"; } catch (e) { return false; } })();
    const [setupDone, setSetupDone] = useState(a.setupComplete === true || lsDone);
    function finishSetup() {
      try { localStorage.setItem("py_setup_done", "1"); } catch (e) { }
      setSetupDone(true);
      fetch(API + "/api/setup-complete", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ setupComplete: true }) }).catch(() => { });
    }
    const STEPS = [
      [T("Request Entrance", "Request entrance"), T("Platz angefragt — und der Kontaktaufnahme zugestimmt.", "Access requested — and contact consent given."), true],
      [T("E-Mail best\xE4tigt", "Email confirmed"), T("Double-Opt-in \xFCber den Link in deinem Postfach.", "Double opt-in confirmed via the link in your inbox."), confirmed],
      [T("Checkliste", "Checklist"), T("Vier Punkte best\xE4tigt: AGB, Risiko, KI, Eigenverantwortung.", "Four points confirmed: terms, risk, AI, own responsibility."), consent],
      [T("Freigabe durch Warren", "Approval by Warren"), T("Warren sichtet deine Bewerbung pers\xF6nlich.", "Warren reviews your request personally."), approved],
      [T("Check-In-Mail", "Check-in mail"), T("Du bist freigegeben — schlie\xDFe deinen Check-In \xFCber den Link in der Mail ab.", "You're approved — finish your check-in via the link in the mail."), approved],
      [T("Check-In abschlie\xDFen", "Finish check-in"), T("E-Mail & Standard-Report aktivieren. Danach kommt die Welcome-Mail mit allen Instruktionen & Login.", "Activate email & the standard report. The welcome mail with all instructions & login then follows."), approved && consent && setupDone]
    ];
    for (let i = 0, prev = true; i < STEPS.length; i++) { STEPS[i][2] = STEPS[i][2] && prev; prev = STEPS[i][2]; } // strikt sequenziell: kein Schritt erledigt, solange ein fr\xFCherer offen ist
    let cur = STEPS.findIndex((s) => !s[2]); if (cur === -1) cur = STEPS.length;
    const doneCount = STEPS.filter((s) => s[2]).length;
    const pct = Math.round(doneCount / STEPS.length * 100);
    const curLabel = cur < STEPS.length ? STEPS[cur][0] : T("Abgeschlossen", "Complete");
    return h("div", { className: "jr-wrap" },
      h("style", null, JR_CSS),
      h("div", { className: "jr-eyebrow" }, T("Dein Weg ins Sanctum", "Your path into the Sanctum")),
      h("div", { className: "jr-progrow" }, h("span", null, T("Fortschritt", "Progress")), h("span", null, h("b", null, T("Schritt", "Step") + " " + Math.min(cur + 1, STEPS.length)), " / " + STEPS.length + " \xB7 " + curLabel)),
      h("div", { className: "jr-bar" }, h("i", { style: { width: pct + "%" } })),
      h("div", { className: "jr-steps" }, STEPS.reduce((acc, s, i) => {
        const st = s[2] ? "done" : (i === cur ? "cur" : "todo");
        const last = i === STEPS.length - 1;
        acc.push(h("div", { key: i, className: "jr-step jr-" + st },
          h("div", { className: "jr-rail" },
            h("div", { className: "jr-node jr-node-" + st }, st === "done" ? "✓" : String(i + 1)),
            !last && h("div", { className: "jr-line jr-line-" + (s[2] ? "gold" : "dim") })),
          h("div", { className: "jr-content" },
            h("div", { className: "jr-head" },
              h("span", { className: "jr-title" }, s[0]),
              h("span", { className: "jr-pill jr-pill-" + st }, st === "done" ? T("Erledigt", "Done") : st === "cur" ? T("Du bist hier", "You are here") : T("Ausstehend", "Pending"))),
            h("p", { className: "jr-desc" }, s[1]),
            (i === 5 && st === "cur") ? h("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 } }, h("a", { className: "jr-cta", href: "#account-reports", onClick: () => { try { localStorage.setItem("py_setup_done", "1"); } catch (e) { } } }, T("E-Mail & Standard-Report aktivieren →", "Activate email & standard report →")), h("button", { className: "jr-cta-ghost", onClick: finishSetup }, T("Als erledigt markieren", "Mark as done"))) : null)));
        if (i === cur && inlinePanel) acc.push(h("div", { key: "ip", style: { margin: "6px 0 30px" } }, inlinePanel));
        return acc;
      }, [])));
  }

  // ============ Syndicate tease + account settings ============
  function SyndicateTease() {
    return h(Card, { variant: "raised", padding: "28px", style: { marginBottom: 20 } },
      h(PyEyebrow, null, T("Die nächste Stufe", "The next tier")),
      h("div", { style: { display: "flex", alignItems: "baseline", gap: 10, margin: "8px 0 4px", flexWrap: "wrap" } }, h("span", { style: { fontFamily: "var(--font-oracle)", fontSize: 30, lineHeight: 1.05, color: "var(--text-primary)" } }, "Syndicate"), h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-muted)" } }, "289 € / Monat")),
      h("div", { style: { display: "flex", flexDirection: "column", gap: 12, margin: "18px 0 20px", paddingTop: 18, borderTop: "1px solid var(--border-subtle)" } }, SYND_F.map((f) => h(FeatureRow, { key: f, label: f }))),
      h(Button, { variant: "oxblood", full: true, disabled: true }, T("Bald verfügbar", "Coming soon")));
  }

  function CircleOfTrust() {
    const [code, setCode] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState(null);
    const BLUE = "#5B8DEF";
    async function redeem() {
      if (busy || !code.trim()) return;
      setBusy(true); setErr(null);
      try {
        const res = await fetch(API + "/api/redeem", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: code.trim() }) });
        if (res.ok) { window.location.reload(); return; }
        else if (res.status === 400) setErr(T("Code ung\xFCltig oder bereits eingel\xF6st.", "Code invalid or already used."));
        else if (res.status === 401) setErr(T("Sitzung abgelaufen. Bitte neu anmelden.", "Session expired. Please sign in again."));
        else setErr(T("Etwas ging schief. Versuch es gleich noch einmal.", "Something went wrong. Please try again."));
      } catch (e) { setErr(T("Keine Verbindung. Versuch es gleich noch einmal.", "No connection. Please try again.")); }
      setBusy(false);
    }
    const blocked = busy || !code.trim();
    const fld = { width: "100%", background: "var(--bg-input)", border: "1px solid rgba(91,141,239,0.5)", borderRadius: 6, padding: "12px 14px", color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: 15, letterSpacing: "0.08em", textTransform: "uppercase", outline: "none", boxSizing: "border-box" };
    return h(Card, { variant: "raised", padding: "28px", style: { marginBottom: 20, borderColor: "rgba(91,141,239,0.45)" } },
      h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: BLUE } }, T("Auf Einladung", "By invite")),
      h("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 30, lineHeight: 1.05, color: BLUE, margin: "8px 0 0" } }, "Circle of Trust"),
      h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: "12px 0 18px" } }, T("Ein stiller Kreis aus Vertrauten — voller Zugang auf Einladung. Code eingeben, dann pr\xFCfen wir deine Freigabe.", "A quiet circle of trusted few — full access by invitation. Enter your code and we’ll review your approval.")),
      h("input", { style: fld, value: code, onChange: (e) => { setCode(e.target.value); setErr(null); }, placeholder: "Insert Membership Code", autoComplete: "off", spellCheck: false }),
      err ? h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--text-warn, #d8a34a)", margin: "12px 0 0" } }, err) : null,
      h("button", { onClick: redeem, disabled: blocked, style: { width: "100%", height: 46, marginTop: 16, borderRadius: "var(--radius-sm)", border: "1px solid " + BLUE, background: blocked ? "transparent" : BLUE, color: blocked ? BLUE : "#0A0C10", fontFamily: "var(--font-oracle)", fontWeight: 600, fontSize: 16, letterSpacing: "0.02em", cursor: blocked && !busy ? "not-allowed" : (busy ? "wait" : "pointer"), opacity: busy ? 0.7 : 1, transition: "all .15s" } }, busy ? T("Einen Moment…", "One moment…") : T("Einl\xF6sen", "Redeem")));
  }

  function SetRow({ title, sub, control }) {
    return h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "14px 0" } }, h("div", { style: { flex: 1 } }, h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)" } }, title), sub && h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--text-muted)", marginTop: 3, lineHeight: 1.45 } }, sub)), control);
  }
  const Divider = () => h("div", { style: { height: 1, background: "var(--border-subtle)" } });

  function AccountSettings({ a }) {
    const tier = a.tier || "observer";
    const paying = tier === "inner-circle" || tier === "syndicate";
    const [mails, setMails] = useState(a.mailsActive !== false);
    const [compass, setCompass] = useState(a.mailReports ? a.mailReports["morning-compass"] !== false : true);
    const [mobileOn, setMobileOn] = useState(!!a.phone);
    const [phone, setPhone] = useState(a.phone || "");
    const [sent, setSent] = useState(false);
    const [code, setCode] = useState("");
    const [verified, setVerified] = useState(!!a.smsVerified);
    const [confirming, setConfirming] = useState(null);
    const [note, setNote] = useState(null);
    const post = (path, body) => fetch(API + path, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) }).catch(() => ({ ok: false }));
    function toggleMails(v) { setMails(v); post("/api/mail-prefs", { mailsActive: v }); }
    function toggleCompass(v) { setCompass(v); post("/api/mail-prefs", { report: "morning-compass", on: v }); post("/api/mail-prefs", { report: "markt-vibe", on: v }); }
    function toggleMobile(v) { setMobileOn(v); if (!v) { setSent(false); setVerified(false); post("/api/mobile/disable", {}); } }
    function sendCode() { if (!phone) return; post("/api/mobile/start", { phone }); setSent(true); }
    function verify() { post("/api/mobile/verify", { code }); setVerified(true); setSent(false); }
    function doDowngrade() { post("/api/account/downgrade", {}); setConfirming(null); setNote(T("Wir haben dir eine Best\xE4tigungs-Mail geschickt — best\xE4tige den Downgrade \xFCber den Link.", "We’ve emailed you a confirmation link to complete the downgrade.")); }
    function doDelete() { post("/api/account/delete", {}); setConfirming(null); setNote(T("Wir haben dir eine Best\xE4tigungs-Mail geschickt — best\xE4tige die L\xF6schung \xFCber den Link.", "We’ve emailed you a confirmation link to complete the deletion.")); }
    return h(Card, { variant: "raised", padding: "30px", style: { marginBottom: 30 } },
      h(PyEyebrow, null, T("Einstellungen", "Settings")),
      h("div", { style: { marginTop: 8 } },
        h(SetRow, { title: T("Mails erhalten", "Receive emails"), sub: T("Der Hauptschalter. System-Mails (Login) kommen immer.", "The master switch. System mails (login) always arrive."), control: h(Switch, { checked: mails, onChange: toggleMails }) }),
        h(Divider),
        h(SetRow, { title: T("Standard Rituals", "Standard rituals"), sub: T("Morning Compass & Market Vibe. Die t\xE4gliche Edukations-Mail — wo der Tag startet, News erkl\xE4rt, eine Beobachtung zum Nachpr\xFCfen. 1\xD7 die Woche der Market Vibe. (Weitere Reports ab Inner Circle in den Rituals.)", "Morning Compass & Market Vibe. The daily education email — where the day starts, news explained, one observation to verify. Plus the weekly Market Vibe. (Further reports from Inner Circle in Rituals.)"), control: h("div", { style: { opacity: mails ? 1 : 0.4, pointerEvents: mails ? "auto" : "none" } }, h(Switch, { checked: compass, onChange: toggleCompass })) }),
        h(Divider),
        h(SetRow, { title: T("Mobilnummer nutzen", "Use mobile number"), sub: T("F\xFCr Verify-Codes & Service-Alerts. Kein Marketing.", "For verify codes & service alerts. No marketing."), control: verified ? h(Badge, { tone: "oracle", variant: "outline" }, T("verifiziert ✓", "verified ✓")) : h(Switch, { checked: mobileOn, onChange: toggleMobile }) }),
        mobileOn && !verified && h("div", { style: { display: "flex", flexDirection: "column", gap: 10, padding: "4px 0 14px" } },
          !sent ? h("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, h(Input, { type: "tel", placeholder: "+41 7…", value: phone, onChange: (e) => setPhone(e.target.value), style: { flex: 1, minWidth: 180 } }), h(Button, { variant: "chrome", onClick: sendCode, disabled: !phone }, T("Code senden", "Send code")))
            : h("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, h(Input, { placeholder: T("SMS-Code", "SMS code"), value: code, onChange: (e) => setCode(e.target.value), style: { flex: 1, minWidth: 140 } }), h(Button, { variant: "oracle", onClick: verify, disabled: !code }, T("Best\xE4tigen", "Verify")))),
        paying && h(React.Fragment, null, h(Divider), h(SetRow, { title: T("Subscription downgraden", "Downgrade subscription"), sub: T("L\xE4uft bis zum Periodenende weiter.", "Stays active until the end of the period."), control: confirming === "downgrade" ? h("div", { style: { display: "flex", gap: 8 } }, h(Button, { variant: "oxblood", size: "sm", onClick: doDowngrade }, T("Sicher?", "Sure?")), h(Button, { variant: "ghost", size: "sm", onClick: () => setConfirming(null) }, T("Abbrechen", "Cancel"))) : h(Button, { variant: "ghost", size: "sm", onClick: () => setConfirming("downgrade") }, T("Downgrade", "Downgrade")) })),
        h(Divider),
        h(SetRow, { title: T("Account l\xF6schen", "Delete account"), sub: T("Unwiderruflich. Per Magic-Link-Best\xE4tigung.", "Irreversible. Confirmed via magic link."), control: confirming === "delete" ? h("div", { style: { display: "flex", gap: 8 } }, h(Button, { variant: "oxblood", size: "sm", onClick: doDelete }, T("Sicher?", "Sure?")), h(Button, { variant: "ghost", size: "sm", onClick: () => setConfirming(null) }, T("Abbrechen", "Cancel"))) : h(Button, { variant: "ghost", size: "sm", onClick: () => setConfirming("delete") }, T("L\xF6schen", "Delete")) })),
      note && h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-oracle)", margin: "16px 0 0", lineHeight: 1.5 } }, note));
  }

  // ============ Upgrade dialog (in-page, kein Wegspringen) ============
  const REQUIRE_CODE = false; // Inner-Circle-Rabatt läuft über Stripes eigenes Promo-Code-Feld im Checkout.
  function UpgradeDialog({ onClose }) {
    const [busy, setBusy] = useState(false);
    const [code, setCode] = useState("");
    const [err, setErr] = useState(null);
    const blocked = REQUIRE_CODE && !code.trim();
    async function go() {
      if (busy || blocked) return;
      setBusy(true); setErr(null);
      try {
        const res = await fetch(API + "/api/checkout/start", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier: "inner-circle", code: code.trim() }) });
        if (res.ok) {
          const d = await res.json().catch(() => null);
          if (d && d.url) { window.location.href = d.url; return; }
          setErr(T("Etwas ging schief. Versuch es gleich noch einmal.", "Something went wrong. Please try again."));
        } else if (res.status === 400) {
          setErr(T("Code ung\xFCltig oder abgelaufen.", "Code invalid or expired."));
        } else if (res.status === 401) {
          setErr(T("Sitzung abgelaufen. Bitte neu anmelden.", "Session expired. Please sign in again."));
        } else {
          setErr(T("Etwas ging schief. Versuch es gleich noch einmal.", "Something went wrong. Please try again."));
        }
      } catch (e) { setErr(T("Keine Verbindung. Versuch es gleich noch einmal.", "No connection. Please try again.")); }
      setBusy(false);
    }
    const fld = { width: "100%", background: "var(--bg-input)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "11px 13px", color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: 15, letterSpacing: "0.08em", textTransform: "uppercase", outline: "none", boxSizing: "border-box" };
    return h("div", { onClick: onClose, style: { position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,5,8,0.78)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 } },
      h("div", { onClick: (e) => e.stopPropagation(), style: { position: "relative", maxWidth: 440, width: "100%", background: "var(--bg-raised)", border: "1px solid var(--border-oracle)", borderRadius: 12, boxShadow: "var(--glow-md)", padding: "30px" } },
        h("button", { onClick: onClose, "aria-label": "Close", style: { position: "absolute", top: 12, right: 16, background: "none", border: "none", color: "var(--text-muted)", fontSize: 24, cursor: "pointer", lineHeight: 1 } }, "×"),
        h(PyEyebrow, null, T("Aufsteigen", "Level up")),
        h("div", { style: { display: "flex", alignItems: "baseline", gap: 8, margin: "8px 0 16px" } }, h("span", { style: { fontFamily: "var(--font-oracle)", fontSize: 30, backgroundImage: "var(--grad-gold)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "var(--oracle-bright)" } }, "Inner Circle"), h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-oracle)" } }, "69 € / Monat")),
        h("div", { style: { display: "flex", flexDirection: "column", gap: 10, paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid var(--border-subtle)" } }, INNER_F.map((f) => h(FeatureRow, { key: f, label: f, gold: true }))),
        REQUIRE_CODE ? h("div", { style: { marginBottom: 16 } },
          h("label", { style: { display: "block", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 } }, T("Zugangscode (Testphase)", "Access code (test phase)")),
          h("input", { style: fld, value: code, onChange: (e) => { setCode(e.target.value); setErr(null); }, placeholder: "CIRCLEOFTRUST", autoComplete: "off", spellCheck: false }),
          h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 12.5, lineHeight: 1.5, color: "var(--text-muted)", margin: "8px 0 0" } }, T("Mit g\xFCltigem Code gilt dein Testpreis an der Kasse.", "With a valid code your test price applies at checkout."))) : null,
        err ? h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--text-warn, #d8a34a)", margin: "0 0 14px" } }, err) : null,
        h(Button, { variant: "oracle", full: true, loading: busy, disabled: blocked, onClick: go }, T("Weiter zur Zahlung", "Continue to payment")),
        h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textAlign: "center", margin: "12px 0 0" } }, T("Sichere Zahlung \xFCber Stripe.", "Secure payment via Stripe."))));
  }

  // ============ Subscription ============
  function SubscriptionBox() {
    const [st, setSt] = useState("loading"); // loading | ready | hidden
    const [sub, setSub] = useState(null);
    const [busy, setBusy] = useState(false);
    useEffect(() => {
      let alive = true;
      fetch(API + "/api/subscription", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        if (!alive) return;
        if (d && d.status && d.status !== "none") { setSub(d); setSt("ready"); } else setSt("hidden");
      }).catch(() => { if (alive) setSt("hidden"); });
      return () => { alive = false; };
    }, []);
    function portal() {
      if (busy) return; setBusy(true);
      fetch(API + "/api/portal", { method: "POST", credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        if (d && d.url) { window.location.href = d.url; return; } setBusy(false);
      }).catch(() => setBusy(false));
    }
    if (st !== "ready") return null;
    const ST = {
      active: T("Aktiv", "Active"), trialing: T("Testzeitraum", "Trial"),
      past_due: T("Zahlung offen", "Payment due"), paused: T("Pausiert", "Paused"),
      canceled: T("Gek\xFCndigt", "Canceled")
    };
    const warn = sub.status === "paused" || sub.status === "past_due";
    function fmt(iso) { try { const d = new Date(iso); if (isNaN(d.getTime())) return ""; const lang = (localStorage.getItem("py_lang") || "de"); return d.toLocaleDateString(lang === "en" ? "en-GB" : "de-DE", { day: "2-digit", month: "long", year: "numeric" }); } catch (e) { return ""; } }
    return h(Card, { variant: "raised", padding: "30px", style: { marginBottom: 30, ...(warn ? { borderColor: "var(--text-warn, #d8a34a)" } : {}) } },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 } },
        h(PyEyebrow, null, T("Dein Abo", "Your subscription")),
        h(Badge, { tone: "neutral", variant: "outline" }, ST[sub.status] || sub.status)),
      h("div", { style: { display: "flex", gap: 30, flexWrap: "wrap" } },
        sub.price ? h(Stat, { label: T("Preis", "Price"), value: sub.price, size: "sm" }) : null,
        sub.renewsAt ? h(Stat, { label: sub.cancelAtPeriodEnd ? T("Endet am", "Ends") : T("Verl\xE4ngert am", "Renews"), value: fmt(sub.renewsAt), size: "sm" }) : null),
      warn ? h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: "16px 0 0" } }, T("Deine letzte Zahlung ist fehlgeschlagen. Aktualisiere deine Zahlungsmethode, um den Zugang zu behalten.", "Your last payment failed. Update your payment method to keep access.")) : null,
      h("div", { style: { marginTop: 18 } }, h(Button, { variant: warn ? "oracle" : "chrome", loading: busy, onClick: portal }, T("Abo verwalten", "Manage subscription"))));
  }

  // ============ Activity log ============
  const ACT_META = {
    chartomat: ["Chart-Analyse", "Chart analysis", "var(--text-oracle)"],
    login: ["Anmeldung", "Sign-in", "var(--text-secondary)"],
    consent: ["Einwilligung", "Consent", "var(--text-secondary)"],
    mail: ["Mail-Einstellung", "Mail setting", "var(--text-secondary)"],
    mobile: ["Mobil-Nummer", "Mobile number", "var(--text-secondary)"],
    tier: ["Mitgliedschaft", "Membership", "var(--text-oracle)"],
    report: ["Reading", "Reading", "var(--text-secondary)"],
    account: ["Konto", "Account", "var(--text-secondary)"]
  };
  const ACT_STATUS = {
    sent: ["gesendet", "sent"], delivered: ["zugestellt", "delivered"],
    pending: ["in Prüfung", "in review"], queued: ["in Prüfung", "in review"],
    rejected: ["abgelehnt", "declined"], done: ["erledigt", "done"]
  };
  function actWhen(at) {
    try {
      const d = new Date(at);
      if (isNaN(d.getTime())) return "";
      const lang = (localStorage.getItem("py_lang") || "de");
      return d.toLocaleString(lang === "en" ? "en-GB" : "de-DE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch (e) { return ""; }
  }
  function ActRow({ e }) {
    const meta = ACT_META[e.type] || ["Ereignis", "Event", "var(--text-secondary)"];
    const title = e.label || T(meta[0], meta[1]);
    const st = e.status && ACT_STATUS[e.status];
    return h("div", { style: { display: "flex", gap: 14, padding: "14px 0", borderTop: "1px solid var(--border-subtle)" } },
      h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", minWidth: 104, paddingTop: 2 } }, actWhen(e.at)),
      h("span", { style: { width: 7, height: 7, borderRadius: "50%", background: meta[2], marginTop: 6, flexShrink: 0 } }),
      h("div", { style: { flex: 1, minWidth: 0 } },
        h("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } },
          h("span", { style: { fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--text-primary)", fontWeight: 500 } }, title),
          st ? h(Badge, { tone: "neutral", variant: "outline" }, T(st[0], st[1])) : null),
        e.detail ? h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13.5, lineHeight: 1.5, color: "var(--text-secondary)", margin: "4px 0 0", wordBreak: "break-word" } }, e.detail) : null));
  }
  function ActivityLog() {
    const [st, setSt] = useState("loading"); // loading | ready | hidden
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(0);
    const PAGE = 20;
    useEffect(() => {
      let alive = true;
      fetch(API + "/api/activity", { credentials: "include" })
        .then((r) => r.ok ? r.json() : null)
        .then((d) => {
          if (!alive) return;
          const ev = d && (d.events || (Array.isArray(d) ? d : null));
          if (!ev) { setSt("hidden"); return; }
          setEvents(ev); setSt("ready");
        })
        .catch(() => { if (alive) setSt("hidden"); });
      return () => { alive = false; };
    }, []);
    if (st === "loading" || st === "hidden") return null;
    const pages = Math.max(1, Math.ceil(events.length / PAGE));
    const p = Math.min(page, pages - 1);
    const slice = events.slice(p * PAGE, p * PAGE + PAGE);
    return h(Card, { variant: "raised", padding: "30px", style: { marginBottom: 30 } },
      h("div", { style: { marginBottom: 6 } }, h(PyEyebrow, null, T("Aktivität", "Activity"))),
      h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.55, color: "var(--text-secondary)", margin: "0 0 8px" } }, T("Was in deinem Sanctum passiert ist — nur für dich sichtbar.", "What’s happened in your sanctum — visible only to you.")),
      events.length === 0
        ? h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: "12px 0 0", fontStyle: "italic" } }, T("Noch keine Aktivität. Sobald du Warren etwas fragst, erscheint es hier.", "No activity yet. Once you ask Warren something, it shows up here."))
        : h(React.Fragment, null,
            h("div", { style: { marginTop: 6 } }, slice.map((e, i) => h(ActRow, { key: p * PAGE + i, e: e }))),
            events.length > PAGE && h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" } },
              h(Button, { variant: "ghost", size: "sm", disabled: p === 0, onClick: () => setPage(p - 1) }, T("← Zurück", "← Back")),
              h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, T("Seite ", "Page ") + (p + 1) + " / " + pages),
              h(Button, { variant: "ghost", size: "sm", disabled: p >= pages - 1, onClick: () => setPage(p + 1) }, T("Weiter →", "Next →")))));
  }

  // ============ Approved dashboard ============
  function Dashboard({ a, justJoined }) {
    const tier = a.tier || "observer";
    const isObserver = tier === "observer";
    const [upgradeOpen, setUpgradeOpen] = useState(false);
    function logout() {
      try { localStorage.removeItem("pythai_chat_sid"); } catch (e) { }
      fetch(API + "/api/logout", { method: "POST", credentials: "include" }).finally(() => { window.location.href = "index.html"; });
    }
    let included = OBSERVER_F.slice();
    if (tier === "inner-circle" || tier === "circle-of-trust" || tier === "syndicate" || tier === "admin") included = included.concat(INNER_F);
    if (tier === "syndicate" || tier === "admin") included = included.concat(SYND_F);
    // Upgrade läuft jetzt in-page über den UpgradeDialog (kein Wegspringen mehr).
    return h("div", { style: { maxWidth: 680, margin: "0 auto" } },
      justJoined && h("div", { style: { border: "1px solid var(--border-oracle)", background: "rgba(212,169,78,0.07)", borderRadius: 10, padding: "16px 20px", marginBottom: 28, textAlign: "center" } }, h("span", { style: { fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 20, color: "var(--text-oracle)" } }, T("Du bist drin. Willkommen im Sanctum.", "You’re in. Welcome to the sanctum."))),
      h("div", { style: { marginBottom: 30 } }, h(PyEyebrow, null, T("Dein Account", "Your account")), h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(34px,5vw,52px)", lineHeight: 1.05, margin: 0, color: "var(--text-primary)" } }, a.name ? a.name : T("Member", "Member")), h("div", { style: { display: "flex", alignItems: "center", gap: 12, marginTop: 14, flexWrap: "wrap" } }, h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)" } }, a.email), a.status && h(Badge, { tone: "neutral", variant: "outline" }, a.status))),
      (a.isAdmin || tier === "admin") && h("a", { href: "admin.html", style: { display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22, padding: "10px 18px", borderRadius: 999, border: "1px solid var(--border-oracle)", background: "rgba(212,169,78,0.07)", color: "var(--text-oracle)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" } }, T("Admin-Bereich", "Admin area"), " →"),
      h(TierBox, { premium: !isObserver && tier !== "syndicate", royal: tier === "syndicate", eyebrow: T("Deine Subscription", "Your subscription"), name: TIER[tier], price: PRICE[tier], memberSince: a.memberSince, features: included }),
      isObserver && h(React.Fragment, null, h(TierBox, { premium: true, eyebrow: T("Aufsteigen", "Level up"), name: "Inner Circle", price: "69 € / Monat", features: INNER_F }), h("div", { style: { margin: "-6px 0 20px" } }, h(Button, { variant: "oracle", full: true, onClick: () => setUpgradeOpen(true) }, T("Upgrade auf Inner Circle", "Upgrade to Inner Circle")))),
      upgradeOpen && h(UpgradeDialog, { onClose: () => setUpgradeOpen(false) }),
      tier !== "syndicate" && tier !== "admin" && h(SyndicateTease, null),
      isObserver && h(CircleOfTrust, null),
      h(SubscriptionBox, null),
      h("div", { id: "account-reports", style: { scrollMarginTop: "90px" } }, h(AccountSettings, { a })),
      h(ActivityLog, null),
      h("div", { style: { textAlign: "center" } }, h(Button, { variant: "ghost", onClick: logout }, T("Abmelden", "Log out"))));
  }

  // ============ Router ============
  function viewFor(a) {
    if (a.tier === "admin") return "dashboard"; // Admin bypasst alle Gates
    if (a.onboardingRequired) return "antrag"; // Backend verlangt Consent (IC/Syndicate ohne Onboarding) → erst Strecke, auch wenn schon approved
    if (a.onboardingConsent === false) return "antrag"; // Sicherheitsnetz: approved/whatever, aber Consent fehlt → Legal-Pflicht, erst Antragstrecke
    const ap = a.approval;
    if (ap === "approved") return "dashboard"; // nur Freigegebene sehen den Dashboard
    if (ap === "rejected") return "rejected";
    if (ap === "pending" || a.onboardingConsent === true) return "waiting"; // wartet auf Freigabe
    return "antrag"; // neu / ohne Freigabe → erst Consent, dann warten. Default-deny: jeder braucht Freigabe.
  }

  function Account() {
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const preview = params.get("preview"); // antrag | waiting | approved | rejected
    const justJoined = params.get("welcome") === "1";
    const [state, setState] = useState(preview ? "in" : "loading");
    const [a, setA] = useState(preview ? { email: "you@pythai.ch", name: "Daniel", tier: preview === "observer" ? "observer" : "inner-circle", status: "verified", memberSince: "07.06.2026", approval: preview === "antrag" ? "none" : (preview === "observer" ? "approved" : preview), onboardingConsent: preview !== "antrag" } : null);
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
    if (view === "rejected") return h(RejectedNote, null);
    // Onboarding: das Aktions-Panel wird INLINE nach dem aktuellen Schritt eingeschoben (3→Checkliste, 4→Warten)
    if (view === "antrag") return h(JourneyRoadmap, { a, inlinePanel: h(ConsentTrack, { onDone: () => window.location.reload() }) });
    if (view === "waiting") return h(JourneyRoadmap, { a, inlinePanel: h(WaitingApproval, { email: a.email }) });
    // Aktiv: Roadmap oben + volles Dashboard darunter (volle Breite)
    return h(React.Fragment, null, h(JourneyRoadmap, { a }), h("div", { style: { marginTop: 44 } }, h(Dashboard, { a, justJoined })));
  }

  function App() {
    return h("div", null, h(SiteNav, { active: "" }), h("section", { style: { position: "relative", minHeight: "calc(100vh - var(--nav-h))", padding: "64px 24px", overflow: "hidden" } }, h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(70% 50% at 50% 0%, var(--glow-oracle-soft) 0%, transparent 60%)" } }), h("div", { style: { position: "relative" } }, h(Account, null))), h(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
