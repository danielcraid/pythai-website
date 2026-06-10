/* PYTHAI · /admin — Admin-Bereich (nur tier=admin). Aktuell: Einladungs-Tool. */
(() => {
  const { Button, Card } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PyEyebrow } = window;
  const T = (de, en) => (window.PYi18n ? window.PYi18n.t(de, en) : de);
  const API = "https://api.pythai.ch";
  const { useState, useEffect } = React;
  const h = React.createElement;

  function AdminInvite() {
    const [tier, setTier] = useState("inner-circle");
    const [lang, setLang] = useState("de");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [expiry, setExpiry] = useState("");
    const [note, setNote] = useState("");
    const [from, setFrom] = useState("Daniel");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState(null);
    function send() {
      if (busy || !email.trim()) return; setBusy(true); setMsg(null);
      fetch(API + "/api/admin/invite", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier, lang, name: name.trim(), email: email.trim(), code: code.trim(), expiry: expiry.trim(), note: note.trim(), from: from.trim() }) })
        .then((r) => { setBusy(false); if (r.ok || r.status === 202) { setMsg({ ok: true, t: T("Einladung gesendet an ", "Invitation sent to ") + email.trim() }); setName(""); setEmail(""); setCode(""); setNote(""); } else if (r.status === 401 || r.status === 403) { setMsg({ ok: false, t: T("Nicht berechtigt.", "Not authorised.") }); } else { setMsg({ ok: false, t: T("Versand fehlgeschlagen.", "Sending failed.") }); } })
        .catch(() => { setBusy(false); setMsg({ ok: false, t: T("Keine Verbindung.", "No connection.") }); });
    }
    const seg = (active, label, onClick) => h("button", { type: "button", onClick, style: { flex: 1, padding: "10px 12px", borderRadius: 7, border: "1px solid " + (active ? "var(--border-oracle)" : "var(--border-strong)"), background: active ? "rgba(212,169,78,0.10)" : "transparent", color: active ? "var(--text-oracle)" : "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" } }, label);
    const fld = { width: "100%", background: "var(--bg-input)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "11px 13px", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 14.5, outline: "none", boxSizing: "border-box" };
    const lbl = { display: "block", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", margin: "14px 0 6px" };
    return h(Card, { variant: "raised", padding: "30px", style: { marginBottom: 30, border: "1px solid var(--border-oracle)" } },
      h(PyEyebrow, null, T("Einladungen", "Invitations")),
      h("h3", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 24, color: "var(--text-primary)", margin: "6px 0 16px" } }, T("Einladung versenden", "Send an invitation")),
      h("div", { style: { display: "flex", gap: 8, marginBottom: 8 } }, seg(tier === "inner-circle", "Inner Circle", () => setTier("inner-circle")), seg(tier === "circle-of-trust", "Circle of Trust", () => setTier("circle-of-trust"))),
      h("div", { style: { display: "flex", gap: 8 } }, seg(lang === "de", "DE", () => setLang("de")), seg(lang === "en", "EN", () => setLang("en"))),
      h("label", { style: lbl }, T("Name", "Name")), h("input", { style: fld, value: name, onChange: (e) => setName(e.target.value), placeholder: "Anna" }),
      h("label", { style: lbl }, T("E-Mail", "Email")), h("input", { style: fld, type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "anna@example.com" }),
      h("label", { style: lbl }, tier === "inner-circle" ? T("Rabattcode (Stripe)", "Discount code (Stripe)") : T("Einladungscode", "Invitation code")), h("input", { style: fld, value: code, onChange: (e) => setCode(e.target.value), placeholder: "CIRCLEOFTRUST26" }),
      h("label", { style: lbl }, T("Gültig bis", "Valid until")), h("input", { style: fld, value: expiry, onChange: (e) => setExpiry(e.target.value), placeholder: "31.07.2026" }),
      h("label", { style: lbl }, T("Persönliche Notiz", "Personal note")), h("textarea", { style: { ...fld, minHeight: 70, resize: "vertical" }, value: note, onChange: (e) => setNote(e.target.value), placeholder: T("Eine persönliche Zeile…", "A personal line…") }),
      h("label", { style: lbl }, T("Absender", "From")), h("input", { style: fld, value: from, onChange: (e) => setFrom(e.target.value), placeholder: "Daniel" }),
      h("div", { style: { marginTop: 20 } }, h(Button, { variant: "oracle", full: true, loading: busy, disabled: !email.trim() || busy, onClick: send }, T("Einladung senden", "Send invitation"))),
      msg && h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13.5, margin: "14px 0 0", color: msg.ok ? "var(--bull-bright)" : "var(--text-warn, #d8a34a)" } }, msg.t));
  }

  function App() {
    const [gate, setGate] = useState("loading");
    useEffect(() => {
      fetch(API + "/api/me", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        setGate(d && d.ok && d.tier === "admin" ? "ok" : "denied");
      }).catch(() => setGate("denied"));
    }, []);
    const wrap = (inner) => h("div", null, h(SiteNav, { active: "" }),
      h("section", { style: { position: "relative", minHeight: "calc(100vh - var(--nav-h))", padding: "64px 24px", overflow: "hidden" } },
        h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(70% 50% at 50% 0%, var(--glow-oracle-soft) 0%, transparent 60%)" } }),
        h("div", { style: { position: "relative", maxWidth: 640, margin: "0 auto" } }, inner)),
      h(SiteFooter, null));
    if (gate === "loading") return wrap(h("div", { style: { minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 22, color: "var(--text-oracle)" } }, T("Das Orakel prüft deinen Zugang…", "The oracle checks your access…")));
    if (gate === "denied") return wrap(h("div", { style: { textAlign: "center", maxWidth: 460, margin: "0 auto" } },
      h("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 56, height: 56, margin: "0 auto 22px", opacity: 0.6 } }),
      h(PyEyebrow, null, "Admin"),
      h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 38, margin: "8px 0 0", color: "var(--text-primary)" } }, T("Kein Zugang.", "No access.")),
      h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--text-secondary)", margin: "16px 0 26px", lineHeight: 1.6 } }, T("Dieser Bereich ist Admins vorbehalten.", "This area is reserved for admins.")),
      h(Button, { variant: "oracle", onClick: () => { window.location.href = "account.html"; } }, T("Zum Konto", "To account"))));
    return wrap(h(React.Fragment, null,
      h("div", { style: { marginBottom: 30 } }, h(PyEyebrow, null, "Admin"), h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(34px,5vw,52px)", lineHeight: 1.05, margin: 0, color: "var(--text-primary)" } }, T("Admin-Bereich", "Admin area"))),
      h(AdminInvite, null)));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
