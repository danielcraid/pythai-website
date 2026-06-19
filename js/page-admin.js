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
      ["Warren · Porträt", "https://www.pythai.ch/assets/imagery/warren-2.png"],
      ["Buch", "https://www.pythai.ch/assets/imagery/pythai-book.png"],
      ["Computer", "https://www.pythai.ch/assets/imagery/pythai-computer.png"]
    ];
    const [heroImage, setHeroImage] = useState(IMAGES[0][1]);
    const DEFAULTS = {
      "inner-circle": {
        de: {
          body: "jeden Morgen, noch bevor die Börse öffnet, erscheint im Sanctum ein vollständiges Reading: zwei bis fünf Setups, jedes mit Begründung, Risikoklasse und Klartext. Kein Lärm, keine Tipps aus dem Nichts — nur die Lesart, die Warren aus Daten, Catalysts und Live-Bedingungen formt.\n\nEin Platz im Inner Circle wird nicht einfach gekauft — er wird vergeben. Für dich habe ich einen persönlichen Code hinterlegt. Mein Dank dafür, dass du von Anfang an dabei bist.",
          steps: "1 · Erstelle deinen Zugang auf pythai.ch — du startest automatisch als Observer (kostenlos).\n2 · Bist du schon Observer? Dann wähle in deinem Konto den Inner Circle.\n3 · Gib deinen Code an der Kasse ein — der Rabatt wird sofort abgezogen.\n\nWillkommen im Inner Circle."
        },
        en: {
          body: "every morning, before the market opens, a full reading appears in the Sanctum: two to five setups, each with its reasoning, risk class and plain talk. No noise, no tips out of nowhere — only the interpretation Warren shapes from data, catalysts and live conditions.\n\nAn Inner Circle seat isn't simply bought — it's granted. I've set up a personal code for you. My thanks for being there from the start.",
          steps: "1 · Create your access at pythai.ch — you start automatically as an Observer (free).\n2 · Already an Observer? Then choose Inner Circle in your account.\n3 · Enter your code at checkout — the discount applies instantly.\n\nWelcome to the Inner Circle."
        }
      },
      "circle-of-trust": {
        de: {
          body: "der Circle of Trust ist mein engster Kreis bei PYTHAI — Menschen, denen ich vertraue und die ich teilhaben lassen will, ohne Preisschild und ohne Bewerbung. Du gehörst für mich dazu.\n\nMit dem Code unten schaltest du deinen Platz frei: Zugang zum Reading, zu Warren und zum Sanctum. Keine Zahlung — nur eine Einladung von mir an dich.",
          steps: "1 · Erstelle deinen Zugang auf pythai.ch — du startest automatisch als Observer (kostenlos).\n2 · Gib deinen Einladungscode in deinem Konto ein.\n3 · Dein Platz im Circle of Trust ist freigeschaltet — komplett kostenlos.\n\nWillkommen."
        },
        en: {
          body: "the Circle of Trust is my closest circle at PYTHAI — people I trust and want to share this with, no price tag and no application. To me, you're one of them.\n\nThe code below unlocks your seat: access to the reading, to Warren and to the Sanctum. No payment — just an invitation, from me to you.",
          steps: "1 · Create your access at pythai.ch — you start automatically as an Observer (free).\n2 · Enter your invitation code in your account.\n3 · Your seat in the Circle of Trust is unlocked — completely free.\n\nWelcome."
        }
      }
    };
    const [bodyText, setBodyText] = useState(DEFAULTS["inner-circle"].de.body);
    const [stepsText, setStepsText] = useState(DEFAULTS["inner-circle"].de.steps);
    useEffect(() => { const t = DEFAULTS[tier] || DEFAULTS["inner-circle"]; const d = t[lang] || t.de; setBodyText(d.body); setStepsText(d.steps); }, [tier, lang]);
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
      const payload = { tier, lang, name: name.trim(), email: email.trim(), code: code.trim(), expiry: expiry.trim(), note: note.trim(), from: from.trim(), priceOld: lang === "en" ? "€69/month" : "69 €/Monat", priceNew: fmtPrice(pct), discount: discLabel(pct), heroImage: heroImage, body: bodyText, steps: stepsText };
      fetch(API + "/api/admin/invite", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
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
      h("label", { style: lbl }, T("Nachricht (frei editierbar)", "Message (editable)")),
      h("textarea", { style: Object.assign({}, fld, { minHeight: 150, resize: "vertical", lineHeight: 1.6 }), value: bodyText, onChange: (e) => setBodyText(e.target.value) }),
      h("label", { style: lbl }, T("Anleitung (frei editierbar)", "Instructions (editable)")),
      h("textarea", { style: Object.assign({}, fld, { minHeight: 120, resize: "vertical", lineHeight: 1.6 }), value: stepsText, onChange: (e) => setStepsText(e.target.value) }),
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

  /* 19.06.2026 — Warren-Inbox-Whitelist Toggle pro Member (VC-Backend, LC-FE + Review-Fixes).
     Backend: GET/POST /api/admin/whitelist (cookie-session, admin-only).
     Notion: Property "Warren-Inbox-Enabled" Checkbox in Members-DB. Sync-Cron alle 5 min. */
  function WarrenWhitelist() {
    const [st, setSt] = useState("loading"); // loading | ok | error | empty
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState("");
    const [pending, setPending] = useState({}); // email → boolean (disabled während API-Call)
    const [toggleErr, setToggleErr] = useState(""); // email der letzten fehlgeschlagenen Aktion

    function load() {
      setSt("loading");
      fetch(API + "/api/admin/whitelist", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        if (d && d.ok && Array.isArray(d.members)) { setRows(d.members); setSt(d.members.length === 0 ? "empty" : "ok"); }
        else setSt("error");
      }).catch(() => setSt("error"));
    }
    useEffect(() => { load(); }, []);

    function onToggle(email, newVal) {
      if (typeof window.PYsfx === "function") window.PYsfx("button-004-toggle");
      setToggleErr("");
      setPending((p) => Object.assign({}, p, { [email]: true }));
      // Optimistic: Schalter sofort umlegen, bei Fehler zurückrollen.
      setRows((rs) => rs.map((r) => r.email === email ? Object.assign({}, r, { enabled: newVal }) : r));
      const revert = () => { setRows((rs) => rs.map((r) => r.email === email ? Object.assign({}, r, { enabled: !newVal }) : r)); setToggleErr(email); };
      const clearPending = () => setPending((p) => { const np = Object.assign({}, p); delete np[email]; return np; });
      fetch(API + "/api/admin/whitelist/toggle", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, enabled: newVal }),
      }).then((r) => r.ok ? r.json() : null).then((d) => {
        if (!(d && d.ok)) revert();
        clearPending();
      }).catch(() => { revert(); clearPending(); });
    }

    const tierName = { "inner-circle": "Inner Circle", "syndicate": "Syndicate", "circle-of-trust": "CoT", "observer": "Observer", "lead": "Lead", "admin": "Admin" };
    const f = String(filter || "").toLowerCase().trim();
    const filtered = !f ? rows : rows.filter((r) =>
      String(r.email || "").toLowerCase().includes(f) ||
      String(r.nickname || "").toLowerCase().includes(f) ||
      String(r.tier || "").toLowerCase().includes(f)
    );
    const enabledCount = rows.filter((r) => r.enabled).length;

    // Custom Toggle-Switch im PYTHAI-Gold/Oracle-Accent.
    const switchEl = (on, disabled, onClick, label) => h("button", {
      onClick: disabled ? null : onClick,
      role: "switch", "aria-checked": on ? "true" : "false", "aria-label": label || "Toggle",
      style: {
        position: "relative", display: "inline-block", flexShrink: 0,
        width: 44, height: 24, padding: 0, border: "1px solid " + (on ? "var(--text-oracle)" : "var(--border-subtle)"),
        background: on ? "rgba(212,169,78,0.22)" : "rgba(255,255,255,0.04)",
        borderRadius: 999, cursor: disabled ? "wait" : "pointer", opacity: disabled ? 0.5 : 1,
        transition: "background 0.15s ease, border-color 0.15s ease",
      }
    }, h("span", {
      style: {
        position: "absolute", top: 2, left: on ? 22 : 2, width: 18, height: 18,
        background: on ? "var(--text-oracle)" : "var(--text-muted, #7C8492)",
        borderRadius: "50%", transition: "left 0.15s ease, background 0.15s ease",
      }
    }));

    return h(Card, { variant: "raised", padding: "30px", style: { marginBottom: 30, border: "1px solid var(--border-oracle)" } },
      h(PyEyebrow, null, T("Warren-Inbox-Whitelist", "Warren-Inbox Whitelist")),
      h("h3", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 24, color: "var(--text-primary)", margin: "6px 0 6px" } }, T("Wer darf Warren schreiben?", "Who may write to Warren?")),
      h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 16px" } },
        T("Nur Member auf der Whitelist kriegen den Warren-Reply-Loop. Nicht-Whitelist-Mails werden direkt an dich weitergeleitet.",
          "Only members on the whitelist get Warren's reply loop. Mails from others are forwarded directly to you.")),
      h("div", { style: { display: "flex", alignItems: "baseline", gap: 10, margin: "10px 0 18px" } },
        h("span", { style: { fontFamily: "var(--font-oracle)", fontSize: 40, lineHeight: 1, color: "var(--text-primary)" } }, String(enabledCount)),
        h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" } },
          T("von " + rows.length + " aktiv", "of " + rows.length + " active"))),
      h("input", {
        type: "text", value: filter, onChange: (e) => setFilter(e.target.value),
        placeholder: T("Filter: E-Mail / Nickname / Tier", "Filter: email / nickname / tier"),
        style: { width: "100%", boxSizing: "border-box", padding: "10px 14px", border: "1px solid var(--border-subtle)", background: "var(--bg-input, rgba(255,255,255,0.03))", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 14, borderRadius: 8, margin: "0 0 14px" }
      }),
      st === "loading" && h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: "10px 0 0" } }, T("Lädt…", "Loading…")),
      st === "error" && h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-danger, #E0726B)", margin: "10px 0 0" } }, T("Konnte Whitelist nicht laden.", "Could not load whitelist.")),
      st === "empty" && h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: "10px 0 0" } }, T("Keine Member.", "No members.")),
      st === "ok" && h("div", { style: { borderTop: "1px solid var(--border-subtle)" } },
        filtered.length === 0
          ? h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", padding: "14px 0" } }, T("Kein Treffer.", "No match."))
          : filtered.map((m) => h("div", {
              key: m.email, style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border-subtle)" }
            },
              h("div", { style: { minWidth: 0, flex: 1 } },
                h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, m.email),
                h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.04em" } },
                  (tierName[m.tier] || m.tier || "—") + (m.nickname ? " · " + m.nickname : "") + (m.approval && m.approval !== "approved" ? " · " + m.approval : "")),
                toggleErr === m.email ? h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 11.5, color: "var(--text-danger, #E0726B)", marginTop: 3 } }, T("Konnte nicht speichern — zurückgesetzt.", "Couldn't save — reverted.")) : null
              ),
              switchEl(!!m.enabled, !!pending[m.email], () => onToggle(m.email, !m.enabled), m.email)
            ))
      ),
      h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", margin: "16px 0 0", letterSpacing: "0.02em", lineHeight: 1.5 } },
        T('Sync-Cron läuft alle 5 min. Notion-Checkbox „Warren-Inbox-Enabled" ist die Quelle, der Toggle hier schreibt sie direkt.',
          'Sync-cron runs every 5 min. Notion checkbox „Warren-Inbox-Enabled" is the source; this toggle writes it directly.'))
    );
  }

  const SECTIONS = ["members", "vouchers", "a", "b"];
  function App() {
    const [gate, setGate] = useState("loading");
    const [view, setView] = useState(() => { try { var hsh = (window.location.hash || "").replace(/^#/, ""); return SECTIONS.indexOf(hsh) !== -1 ? hsh : "home"; } catch (e) { return "home"; } });
    const go = (v) => { if (typeof window.PYsfx === "function") window.PYsfx("menue"); try { window.location.hash = v === "home" ? "" : v; } catch (e) { } setView(v); };
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
    const TILES = [
      ["members", T("Member Management", "Member management"), T("Einladungen, Warren-Inbox-Whitelist und versendete Einladungen.", "Invitations, Warren-inbox whitelist and sent invites.")],
      ["vouchers", T("Gutscheine", "Vouchers"), T("Rabattcodes und Gutscheine verwalten.", "Manage discount codes and vouchers.")],
      ["a", T("Platzhalter A", "Placeholder A"), T("Reserviert für später.", "Reserved for later.")],
      ["b", T("Platzhalter B", "Placeholder B"), T("Reserviert für später.", "Reserved for later.")]
    ];
    const titleOf = { members: T("Member Management", "Member management"), vouchers: T("Gutscheine", "Vouchers"), a: T("Platzhalter A", "Placeholder A"), b: T("Platzhalter B", "Placeholder B") };
    const adminHead = (sub) => h("div", { style: { marginBottom: 30 } },
      sub ? h("div", { onClick: () => go("home"), style: { display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 } }, "← " + T("Admin-Übersicht", "Admin overview")) : null,
      h(PyEyebrow, null, "Admin"),
      h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(30px,5vw,48px)", lineHeight: 1.05, margin: 0, color: "var(--text-primary)" } }, sub ? titleOf[sub] : T("Admin-Bereich", "Admin area")));
    const placeholder = (note) => h(Card, { variant: "raised", padding: "30px", style: { marginBottom: 30 } },
      h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 } }, note));

    if (view === "members") return wrap(h(React.Fragment, null, adminHead("members"), h(AdminInvite, null), h(WarrenWhitelist, null), h(InviteLog, null)));
    if (view === "vouchers") return wrap(h(React.Fragment, null, adminHead("vouchers"), placeholder(T("Gutschein-Verwaltung kommt hierher — Codes anlegen, Laufzeiten, Einlösungen.", "Voucher management goes here — create codes, durations, redemptions."))));
    if (view === "a") return wrap(h(React.Fragment, null, adminHead("a"), placeholder(T("Reserviert. Hier kann ein weiteres Admin-Tool entstehen.", "Reserved. Another admin tool can live here."))));
    if (view === "b") return wrap(h(React.Fragment, null, adminHead("b"), placeholder(T("Reserviert. Hier kann ein weiteres Admin-Tool entstehen.", "Reserved. Another admin tool can live here."))));

    return wrap(h(React.Fragment, null,
      adminHead(null),
      h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 } },
        TILES.map((t) => h("div", { key: t[0], onClick: () => go(t[0]), style: { cursor: "pointer", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "22px 20px", background: "var(--bg-raised, rgba(255,255,255,0.02))" } },
          h("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 21, color: "var(--text-primary)", marginBottom: 6 } }, t[1]),
          h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.5 } }, t[2]),
          h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-oracle)", marginTop: 12, letterSpacing: "0.08em" } }, T("Öffnen →", "Open →")))))));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
