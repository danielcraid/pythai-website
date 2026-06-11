(() => {
  const { useState } = React;
  const T = (de, en) => window.PYi18n.t(de, en);
  const WRAP = { maxWidth: 1240, margin: "0 auto", padding: "0 40px" };
  function Eyebrow({ children }) {
    return /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-oracle)", margin: "0 0 14px" } }, children);
  }
  function PageHead({ eyebrow, title, sub }) {
    return /* @__PURE__ */ React.createElement("header", { style: { position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(90% 70% at 50% -20%, var(--glow-oracle-soft) 0%, transparent 60%)" } }), /* @__PURE__ */ React.createElement("div", { style: { ...WRAP, position: "relative", padding: "120px 40px 80px", textAlign: "center" } }, /* @__PURE__ */ React.createElement(Eyebrow, null, eyebrow), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(40px,6vw,72px)", lineHeight: 1.05, margin: 0, color: "var(--text-primary)" } }, title), sub && /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 19, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 620, margin: "24px auto 0" } }, sub)));
  }
  function Section({ children, alt }) {
    return /* @__PURE__ */ React.createElement("section", { style: { borderBottom: "1px solid var(--border-subtle)", background: alt ? "var(--bg-surface)" : "transparent" } }, /* @__PURE__ */ React.createElement("div", { style: { ...WRAP, padding: "90px 40px" } }, children));
  }
  function H2({ children }) {
    return /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(30px,4vw,44px)", margin: "0 0 14px", color: "var(--text-primary)" } }, children);
  }
  function Lead({ children, center }) {
    return /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 18, lineHeight: 1.65, color: "var(--text-secondary)", maxWidth: 640, margin: center ? "0 auto" : 0 } }, children);
  }
  function Waitlist() {
    const [v, setV] = useState("");
    const [consent, setConsent] = useState(false);
    const [msg, setMsg] = useState("");
    const { Button } = window.PYTHAIDesignSystem_df6467;
    function submit(e) {
      e.preventDefault();
      if (!v || v.indexOf("@") < 1) {
        setMsg(T("Das Orakel braucht eine g\xFCltige Adresse.", "The oracle needs a valid address."));
        return;
      }
      if (!consent) {
        setMsg(T("Bitte stimme der Kontaktaufnahme zu.", "Please tick the consent box."));
        return;
      }
      setMsg(T("Das Orakel wird befragt\u2026", "Consulting the oracle\u2026"));
      let settled = false;
      const ok = () => {
        if (settled) return; settled = true; clearTimeout(to);
        setMsg(T("Fast geschafft \u2014 best\xE4tige die Anmeldung \xFCber die Mail, die wir dir gerade geschickt haben.", "Almost there \u2014 confirm your sign-up via the email we just sent you."));
        setV(""); setConsent(false);
      };
      const fail = () => {
        if (settled) return; settled = true; clearTimeout(to);
        setMsg(T("Da ging etwas schief \u2014 versuch es gleich noch einmal.", "Something went wrong \u2014 please try again in a moment."));
      };
      const to = setTimeout(fail, 12000); // nie ewig auf "wird befragt" h\xE4ngen bleiben
      fetch("https://api.pythai.ch/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: v.trim(), consent: true, lang: window.PYi18n.lang, source: "pythai.ch/inner-circle" })
      }).then((r) => { (r.ok || r.status === 202) ? ok() : fail(); }).catch(fail);
    }
    return /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 560, margin: "0 auto", textAlign: "center" } }, /* @__PURE__ */ React.createElement(Eyebrow, null, T("Mitgliedschaft beantragen", "Request membership")), /* @__PURE__ */ React.createElement(H2, null, "Request Sanctum Entrance."), /* @__PURE__ */ React.createElement(Lead, { center: true }, T("Der Sanctum ist menschlich kuratiert — keine Bots, keine Massen-Freigabe. Hinterlasse deine Adresse: du kommst auf die Warteliste, jede Bewerbung wird gepr\xFCft, und du bekommst eine Welcome-Mail, sobald dein Platz frei ist.", "The Sanctum is human-curated — no bots, no mass approvals. Leave your address: you join the waitlist, every request is reviewed, and you’ll get a welcome mail once your seat is ready.")), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-secondary)", marginTop: 14 } }, T("Schon Member? ", "Already a member? "), /* @__PURE__ */ React.createElement("a", { href: "register.html", style: { color: "var(--text-oracle)", fontWeight: 600 } }, T("Hier einloggen", "Sign in here"), " →")), /* @__PURE__ */ React.createElement("form", { onSubmit: submit, style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        value: v,
        onChange: (e) => setV(e.target.value),
        placeholder: "you@example.com",
        "aria-label": "Email",
        style: { flex: "1 1 240px", background: "var(--bg-input)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "13px 16px", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 15, outline: "none" }
      }
    ), /* @__PURE__ */ React.createElement(Button, { variant: "oracle", type: "submit", disabled: !consent, onClick: () => { if (typeof window.PYsfx === "function") window.PYsfx("request-sanctum-button"); } }, "Request entrance")), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left", marginTop: 16, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: consent, onChange: (e) => setConsent(e.target.checked), style: { marginTop: 3, accentColor: "var(--oracle)", width: 16, height: 16, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-ui)", fontSize: 12.5, lineHeight: 1.55, color: "var(--text-muted)" } }, T("Ich willige ein, dass die PYTHAI UG (i.G.) mich zu PYTHAI per E-Mail kontaktiert. Widerruf jederzeit per Abmeldelink. ", "I consent to being contacted by email about PYTHAI by PYTHAI UG (i.G.). Withdrawable anytime via the unsubscribe link. "), /* @__PURE__ */ React.createElement("a", { href: "legal.html#privacy", style: { color: "var(--text-secondary)" } }, T("Datenschutz", "Privacy notice"))))), /* @__PURE__ */ React.createElement("div", { style: { minHeight: 26, marginTop: 20, fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 20, color: "var(--text-oracle)" } }, msg), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 8, letterSpacing: "0.04em" } }, T("Kein Spam. Ein Fl\xFCstern, wenn dein Platz bereit ist. Jederzeit abbestellbar.", "No spam. One whisper when your seat is ready. Unsubscribe anytime.")));
  }
  Object.assign(window, { PyEyebrow: Eyebrow, PyPageHead: PageHead, PySection: Section, PyH2: H2, PyLead: Lead, PyWaitlist: Waitlist, PY_WRAP: WRAP });
})();
