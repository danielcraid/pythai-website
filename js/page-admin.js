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
    const [disc, setDisc] = useState(90);
    const [customDisc, setCustomDisc] = useState("");
    const IMAGES = [
      ["Sanctum · Boardroom", "https://www.pythai.ch/assets/imagery/sanctum-boardroom.png"],
      ["Sanctum · Lichtschacht", "https://www.pythai.ch/assets/imagery/sanctum-lightshaft.png"],
      ["Warren · Porträt", "https://www.pythai.ch/assets/imagery/warren-oracle-portrait.png"],
      ["Buch", "https://www.pythai.ch/assets/imagery/pythai-book.png"],
      ["Computer", "https://www.pythai.ch/assets/imagery/pythai-computer.png"]
    ];
    const [heroImage, setHeroImage] = useState(IMAGES[0][1]);
    const effPct = () => disc === "custom" ? Math.max(0, Math.min(100, parseInt(customDisc, 10) || 0)) : disc;
    const fmtPrice = (pct) => { const v = Math.round(69 * (100 - pct)) / 100; const two = v.toFixed(2); const t = two.slice(-3) === ".00" ? two.slice(0, -3) : two; return lang === "en" ? ("€" + t + "/month") : (t.replace(".", ",") + " €/Monat"); };
    const discLabel = (pct) => lang === "en" ? (pct + "% off") : (pct + " % Rabatt");
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
      const pct = effPct();
      const body = { tier, lang, name: name.trim(), email: email.trim(), code: code.trim(), expiry: expiry.trim(), note: note.trim(), from: from.trim(), priceOld: lang === "en" ? "€69/month" : "69 €/Monat", priceNew: fmtPrice(pct), discount: discLabel(pct), heroImage: heroImage };
      fetch(API + "/api/admin/invite", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
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
      tier !== "circle-of-trust" && h("div", { style: { marginTop: 14 } },
        h("label", { style: lbl }, T("Rabatt-Staffel", "Discount tier")),
        h("select", { value: String(disc), onChange: (e) => setDisc(e.target.value === "custom" ? "custom" : parseInt(e.target.value, 10)), style: Object.assign({}, fld, { cursor: "pointer" }) }, [20, 30, 40, 50, 75, 90, 100].map((p) => h("option", { key: p, value: String(p) }, p + " % → " + fmtPrice(p))), h("option", { value: "custom" }, T("Frei eingeben…", "Custom…"))),
        disc === "custom" && h("input", { style: Object.assign({}, fld, { marginTop: 8 }), type: "number", min: 0, max: 100, value: customDisc, onChange: (e) => setCustomDisc(e.target.value), placeholder: T("Rabatt in % (0–100)", "Discount in % (0–100)") }),
        h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-oracle)", margin: "8px 0 0" } }, T("In der Mail: ", "In the mail: ") + fmtPrice(effPct()) + " · " + discLabel(effPct()))),
      h("label", { style: lbl }, T("Bild", "Image")),
      h("select", { value: heroImage, onChange: (e) => setHeroImage(e.target.value), style: Object.assign({}, fld, { cursor: "pointer" }) }, IMAGES.map((im) => h("option", { key: im[1], value: im[1] }, im[0]))),
      h("img", { src: heroImage, alt: "", style: { width: "100%", maxWidth: 300, borderRadius: 8, border: "1px solid var(--border-subtle)", marginTop: 10, display: "block" } }),
      h("label", { style: lbl }, T("Name", "Name")), h("input", { style: fld, value: name, onChange: (e) => setName(e.target.value), placeholder: "Anna" }),
      h("label", { style: lbl }, T("E-Mail", "Email")), h("input", { style: fld, type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "anna@example.com" }),
      h("label", { style: lbl }, tier !== "circle-of-trust" ? T("Rabattcode (Stripe)", "Discount code (Stripe)") : T("Einladungscode", "Invitation code")), h("input", { style: fld, value: code, onChange: (e) => setCode(e.target.value), placeholder: "CIRCLEOFTRUST26" }),
      h("label", { style: lbl }, T("Gültig bis", "Valid until")), h("input", { style: fld, value: expiry, onChange: (e) => setExpiry(e.target.value), placeholder: "31.07.2026" }),
      h("label", { style: lbl }, T("Persönliche Notiz", "Personal note")), h("textarea", { style: { ...fld, minHeight: 70, resize: "vertical" }, value: note, onChange: (e) => setNote(e.target.value), placeholder: T("Eine persönliche Zeile…", "A personal line…") }),
      h("label", { style: lbl }, T("Absender", "From")), h("input", { style: fld, value: from, onChange: (e) => setFrom(e.target.value), placeholder: "Daniel" }),
      h("div", { style: { marginTop: 20 } }, h(Button, { variant: "oracle", full: true, loading: busy, disabled: !email.trim() || busy, onClick: send }, T("Einladung senden", "Send invitation"))),
      msg && h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13.5, margin: "14px 0 0", color: msg.ok ? "var(--bull-bright)" : "var(--text-warn, #d8a34a)" } }, msg.t));
  }

  function InviteLog() {
    const [rows, setRows] = useState(null);
    const [st, setSt] = useState("loading");
    useEffect(() => {
      fetch(API + "/api/admin/invites", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        const list = Array.isArray(d) ? d : (d && Array.isArray(d.invites) ? d.invites : null);
        if (list) { setRows(list); setSt("ok"); } else setSt("empty");
      }).catch(() => setSt("empty"));
    }, []);
    function fmt(r) { const v = r.at || r.timestamp || r.sentAt || r.date || ""; try { const d = new Date(v); if (isNaN(d.getTime())) return String(v); const lang = (localStorage.getItem("py_lang") || "de"); return d.toLocaleString(lang === "en" ? "en-GB" : "de-DE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); } catch (e) { return String(v); } }
    const tierName = { "inner-circle": "Inner Circle", "circle-of-trust": "Circle of Trust", "inner-circle-test": "IC · Test" };
    return h(Card, { variant: "raised", padding: "30px", style: { marginBottom: 30 } },
      h(PyEyebrow, null, T("Versendete Einladungen", "Invitations sent")),
      st === "loading" ? h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: "10px 0 0" } }, T("Lädt…", "Loading…"))
        : st === "empty" ? h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: "10px 0 0" } }, T("Noch keine Daten (oder der Log-Endpoint ist noch nicht aktiv).", "No data yet (or the log endpoint is not active yet)."))
          : h(React.Fragment, null,
            h("div", { style: { display: "flex", alignItems: "baseline", gap: 10, margin: "10px 0 18px" } }, h("span", { style: { fontFamily: "var(--font-oracle)", fontSize: 40, lineHeight: 1, color: "var(--text-primary)" } }, String(rows.length)), h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" } }, T("Einladungen gesamt", "invitations total"))),
            rows.length ? h("div", { style: { borderTop: "1px solid var(--border-subtle)" } }, rows.slice(-15).reverse().map((r, i) => h("div", { key: i, style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" } },
              h("div", { style: { minWidth: 0 } }, h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, r.email || r.name || "—"), h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, (tierName[r.tier] || r.tier || "") + (r.lang ? " · " + String(r.lang).toUpperCase() : ""))),
              h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", whiteSpace: "nowrap", flexShrink: 0 } }, fmt(r))))) : null));
  }

  function App() {
    const [gate, setGate] = useState("loading");
    useEffect(() => {
      fetch(API + "/api/me", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        setGate(d && d.ok && (d.isAdmin === true || d.tier === "admin") ? "ok" : "denied");
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
      h(AdminInvite, null), h(InviteLog, null)));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
