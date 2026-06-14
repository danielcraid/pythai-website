/* PYTHAI · Warren-Chat — Floating-Launcher + Panel. Baut gegen pythai-frontend-spec V2. */
(() => {
  if (window.__pyChat) return; window.__pyChat = true;
  const { Button } = window.PYTHAIDesignSystem_df6467 || {};
  const T = (de, en) => (window.PYi18n ? window.PYi18n.t(de, en) : de);
  const lang = () => { try { return localStorage.getItem("py_lang") === "en" ? "en" : "de"; } catch (e) { return "de"; } };
  const API = "https://api.pythai.ch";
  const h = React.createElement;
  const { useState, useEffect, useRef } = React;
  const PORTRAIT = "assets/imagery/warren-2.png";

  const api = (path, opts) => fetch(API + path, Object.assign({ credentials: "include", headers: { "Content-Type": "application/json" } }, opts || {}));

  // ---- minimal, sichere Markdown-Darstellung (escape → fett/kursiv/Listen/Absätze; Bilder ignoriert) ----
  function mdToHtml(md) {
    let s = String(md || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, ""); // markdown-images raus (kommen via attachments)
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    const blocks = s.split(/\n\n+/).map((b) => {
      const lines = b.split("\n");
      if (lines.length && lines.every((l) => /^\s*[-•]\s+/.test(l))) return "<ul>" + lines.map((l) => "<li>" + l.replace(/^\s*[-•]\s+/, "") + "</li>").join("") + "</ul>";
      if (lines.length && lines.every((l) => /^\s*\d+\.\s+/.test(l))) return "<ol>" + lines.map((l) => "<li>" + l.replace(/^\s*\d+\.\s+/, "") + "</li>").join("") + "</ol>";
      return "<p>" + b.replace(/\n/g, "<br>") + "</p>";
    });
    return blocks.join("");
  }
  function Md({ text }) {
    return h("div", { className: "pychat-md", dangerouslySetInnerHTML: { __html: mdToHtml(text) } });
  }

  function TierBadge({ tier }) {
    const map = { "inner-circle": ["Inner Circle", "var(--oracle-bright)", "var(--border-oracle)"], syndicate: ["Syndicate", "var(--oxblood-bright)", "rgba(168,65,79,0.5)"], observer: ["Observer", "var(--text-secondary)", "var(--border-strong)"], lead: [T("Gast", "Guest"), "var(--text-muted)", "var(--border-strong)"] };
    const m = map[tier] || map.lead;
    return h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: m[1], border: "1px solid " + m[2], borderRadius: 999, padding: "3px 8px", whiteSpace: "nowrap" } }, m[0]);
  }

  function Bubble({ m, onSignin, onReset }) {
    if (m.role === "user") {
      return h("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: 12 } },
        h("div", { style: { maxWidth: "82%", background: "var(--grad-gold)", color: "var(--text-on-gold)", borderRadius: "12px 12px 4px 12px", padding: "9px 13px", fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word" } }, m.text));
    }
    if (m.role === "system") {
      return h("div", { style: { textAlign: "center", margin: "10px 0" } }, h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-oracle)", fontStyle: "italic" } }, m.text));
    }
    // warren
    return h("div", { style: { display: "flex", gap: 9, marginBottom: 12 } },
      h("img", { src: PORTRAIT, alt: "", style: { width: 26, height: 26, borderRadius: "50%", objectFit: "cover", objectPosition: "center 20%", flexShrink: 0, marginTop: 2, border: "1px solid var(--border-oracle)" } }),
      h("div", { style: { maxWidth: "86%" } },
        h("div", { style: { background: "var(--bg-input)", border: "1px solid var(--border-subtle)", borderRadius: "12px 12px 12px 4px", padding: "10px 13px", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.55 } }, h(Md, { text: m.text })),
        (m.attachments || []).map((a, i) => h("figure", { key: i, style: { margin: "8px 0 0" } },
          h("img", { src: a.url, alt: a.alt || "", loading: "lazy", style: { width: "100%", borderRadius: 8, border: "1px solid var(--border-subtle)", display: "block", cursor: "zoom-in" }, onClick: () => window.open(a.url, "_blank", "noopener") }),
          a.alt ? h("figcaption", { style: { fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 4 } }, a.alt) : null)),
        m.validatorOk === false ? h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", marginTop: 5 } }, T("Geprüft — diese Antwort wurde zur Sicherheit angepasst.", "Reviewed — this answer was adjusted for safety.")) : null,
        m.button ? h("div", { style: { marginTop: 9 } }, h(Button, { variant: "oracle", size: "sm", onClick: () => { if (m.button.action === "reset") { onReset && onReset(); } else if (m.button.action === "reload") { window.location.reload(); } else if (m.button.action === "signin") { onSignin && onSignin(); } else { window.location.href = m.button.href; } } }, m.button.label)) : null));
  }

  function Typing() {
    return h("div", { style: { display: "flex", gap: 9, marginBottom: 12, alignItems: "center" } },
      h("img", { src: PORTRAIT, alt: "", style: { width: 26, height: 26, borderRadius: "50%", objectFit: "cover", objectPosition: "center 20%", border: "1px solid var(--border-oracle)" } }),
      h("div", { style: { background: "var(--bg-input)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "11px 14px" } },
        h("style", null, "@keyframes pyc-bounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-4px);opacity:1}} .pyc-dot{width:6px;height:6px;border-radius:50%;background:var(--text-oracle);display:inline-block;margin:0 2px;animation:pyc-bounce 1.2s infinite}"),
        h("span", { className: "pyc-dot" }), h("span", { className: "pyc-dot", style: { animationDelay: ".15s" } }), h("span", { className: "pyc-dot", style: { animationDelay: ".3s" } })));
  }

  function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [sid, setSid] = useState(null);
    const [mode, setMode] = useState("lead");
    const [tier, setTier] = useState("lead");
    const [name, setName] = useState(null);
    const [msgs, setMsgs] = useState([]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const [soft, setSoft] = useState(false);
    const [cooldownTs, setCooldownTs] = useState(0);
    const [observerHint, setObserverHint] = useState(false);
    const [auth, setAuth] = useState(null); // {phase:'email'|'code', email, code, sending, error, hint}
    const pollRef = useRef(null);
    const bodyRef = useRef(null);
    const startedRef = useRef(false);

    const push = (m) => setMsgs((a) => a.concat([m]));

    useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, busy, auth]);
    useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);
    // Globaler Hook: andere Seiten (z.B. My Book „Frag Warren") öffnen den Chat vorbefüllt
    useEffect(() => {
      window.PYchatOpen = (q) => { setOpen(true); boot(); if (q) setInput(q); };
      // Mail-„Frag Warren"-Redirect: ?py_chat_q=… → Chat vorbefüllt öffnen, URL säubern
      try {
        const qp = new URLSearchParams(window.location.search).get("py_chat_q");
        if (qp) {
          setOpen(true); boot(); setInput(qp);
          const u = new URL(window.location.href); u.searchParams.delete("py_chat_q");
          window.history.replaceState({}, "", u.pathname + u.search + u.hash);
        }
      } catch (e) { }
      return () => { try { delete window.PYchatOpen; } catch (e) { window.PYchatOpen = undefined; } };
    }, []);

    const LS = "pythai_chat_sid";
    const leadGreet = () => ({ role: "warren", text: T("Schön, dass du da bist. Ich bin Warren, das KI-Hirn hinter PYTHAI. Frag mich, was du wissen willst — oder ob das hier was für dich ist.", "Good to have you here. I’m Warren, the AI mind behind PYTHAI. Ask me anything — or whether this is for you.") });
    const memberGreet = (nm) => ({ role: "warren", text: T((nm ? nm + ", schön dich zu sehen. " : "") + "Ich bin im Member-Modus — frag mich nach einem Wert, einem Chart oder dem Markt heute.", (nm ? nm + ", good to see you. " : "") + "I’m in member mode — ask me about a stock, a chart, or the market today.") });
    async function startFresh(expired) {
      try {
        const r = await api("/api/chat/session", { method: "POST" });
        const d = await r.json();
        if (!d || !d.ok) throw 0;
        setSid(d.sid); try { localStorage.setItem(LS, d.sid); } catch (e) { }
        if (d.authed && d.tier) { setMode("member"); setTier(d.tier); setName(d.name || null); setObserverHint(false); setMsgs([{ role: "system", text: T("Du bist im Sanctum angemeldet.", "You’re signed in to the sanctum.") }, memberGreet(d.nickname || d.name)]); }
        else {
          setMode("lead"); setTier("lead"); setObserverHint(!!d.observerHint);
          const expiredNote = { role: "warren", text: T("Deine Sitzung ist abgelaufen. Melde dich neu an, um wieder im Member-Modus zu chatten.", "Your session has expired. Sign in again to chat in member mode."), button: { label: T("Neu anmelden", "Sign in again"), action: "signin" } };
          setMsgs(expired ? [expiredNote, leadGreet()] : [leadGreet()]);
        }
      } catch (e) {
        push({ role: "warren", text: T("Verbindung zu Warren verloren — vielleicht ist deine Sitzung abgelaufen. Lade die Seite neu.", "Lost the connection to Warren — your session may have expired. Reload the page."), button: { label: T("Neu laden", "Reload"), action: "reload" } });
        startedRef.current = false;
      }
    }
    async function boot() {
      if (startedRef.current) return; startedRef.current = true;
      let sid0 = null; try { sid0 = localStorage.getItem(LS); } catch (e) { }
      if (!sid0) return startFresh();
      try {
        const r = await api("/api/chat/history?sid=" + encodeURIComponent(sid0));
        const d = await r.json();
        if (!d || !d.ok || d.status === "no_session") { try { localStorage.removeItem(LS); } catch (e) { } return startFresh(true); }
        setSid(d.sid || sid0);
        const member = d.authed && d.tier;
        if (member) { setMode("member"); setTier(d.tier); setName(d.name || null); } else { setMode("lead"); setTier("lead"); }
        const conv = (d.conversation || []).map((m) => ({ role: m.role === "user" ? "user" : "warren", text: m.content }));
        setMsgs(conv.length ? conv : [member ? memberGreet(d.nickname || d.name) : leadGreet()]);
      } catch (e) { try { localStorage.removeItem(LS); } catch (e2) { } return startFresh(); }
    }
    function onOpen() { setOpen(true); boot(); }

    const onCooldown = () => Date.now() < cooldownTs;

    async function sendMessage() {
      const text = input.trim();
      if (!text || busy || !sid || onCooldown()) return;
      push({ role: "user", text }); setInput(""); setBusy(true); setSoft(false);
      const softT = setTimeout(() => setSoft(true), 10000);
      const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 130000);
      try {
        const r = await api("/api/chat", { method: "POST", signal: ctrl.signal, body: JSON.stringify({ sid, message: text, lang: lang() }) });
        if (r.status === 429) { push({ role: "warren", text: T("Du hast viel auf einmal gefragt. Lass mir 30 Sekunden, dann gerne weiter.", "That was a lot at once. Give me 30 seconds, then go on.") }); const until = Date.now() + 30000; setCooldownTs(until); setTimeout(() => setCooldownTs(0), 30000); }
        else if (r.status === 502) { push({ role: "warren", text: T("Warren ist gerade weg. Starte eine neue Sitzung.", "Warren is gone. Start a new session."), button: { label: T("Neue Sitzung", "New session"), action: "reset" } }); }
        else if (!r.ok) { const e = await r.json().catch(() => ({})); push({ role: "warren", text: e.error === "message_too_long" ? T("Die Nachricht ist zu lang (max. 4000 Zeichen).", "That message is too long (max 4000 chars).") : T("Da ging etwas schief. Versuch’s nochmal.", "Something went wrong. Try again.") }); }
        else {
          const d = await r.json();
          if (d.tier) setTier(d.tier);
          setMode(d.mode === "member" ? "member" : "lead");
          if (d.memberName) setName(d.memberName);
          push({ role: "warren", text: d.reply, attachments: d.attachments || [], validatorOk: d.validatorOk !== false });
        }
      } catch (err) { push({ role: "warren", text: T("Verbindung weg. Lade die Seite neu, dann läuft’s wieder.", "Connection lost. Reload the page and it’ll work again."), button: { label: T("Neu laden", "Reload"), action: "reload" } }); }
      clearTimeout(softT); clearTimeout(to); setBusy(false); setSoft(false);
    }

    // ---- Auth ----
    function stopPolling() { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } }
    function startPolling(deadline) {
      stopPolling();
      pollRef.current = setInterval(async () => {
        if (Date.now() > deadline) { stopPolling(); setAuth((a) => a ? Object.assign({}, a, { error: T("Das Code-Fenster ist abgelaufen. Email nochmal?", "The code window expired. Email again?"), phase: "email" }) : a); return; }
        try {
          const r = await api("/api/chat/session-status?sid=" + encodeURIComponent(sid));
          const d = await r.json();
          if (d.status === "no_session") { stopPolling(); setAuth({ phase: "email", error: T("Session abgelaufen — Email nochmal eintippen.", "Session expired — enter your email again.") }); }
          else if (d.authed) { stopPolling(); becomeMember(d); }
        } catch (e) {}
      }, 3000);
    }
    function becomeMember(d) {
      const nm = d.nickname || d.name;
      setAuth(null); setMode("member"); setTier(d.tier || "inner-circle"); setName(nm || null); setObserverHint(false);
      push({ role: "system", text: T("Freigeschaltet.", "Unlocked.") });
      push({ role: "warren", text: T((nm ? "Schön, dich zu sehen, " + nm + ". " : "") + "Ich bin jetzt im Member-Modus — leg los.", (nm ? "Good to see you, " + nm + ". " : "") + "I’m in member mode now — go ahead.") });
    }
    async function submitEmail() {
      const email = (auth.email || "").trim();
      if (!email || email.indexOf("@") < 1 || auth.sending) { setAuth((a) => Object.assign({}, a, { error: T("Eine gültige Email, bitte.", "A valid email, please.") })); return; }
      setAuth((a) => Object.assign({}, a, { sending: true, error: null }));
      try {
        const r = await api("/api/chat/magic-code", { method: "POST", body: JSON.stringify({ sid, email, lang: lang() }) });
        const d = await r.json();
        if (r.status === 429) { setAuth((a) => Object.assign({}, a, { sending: false, error: d.hint || T("Zu viele Versuche. Bitte später.", "Too many tries. Try later.") })); return; }
        if (!r.ok) { setAuth((a) => Object.assign({}, a, { sending: false, error: T("Bitte gültige Email eingeben.", "Please enter a valid email.") })); return; }
        if (d.status === "code_sent") { setAuth({ phase: "code", email, code: "", hint: d.hint }); push({ role: "system", text: T("Mail unterwegs — klick den Link ODER tipp den Code hier ein.", "Mail on the way — click the link OR type the code here.") }); startPolling(Date.now() + 15 * 60 * 1000); }
        else if (d.status === "unknown_email") { setAuth(null); push({ role: "warren", text: d.message, button: { label: T("Auf die Waitlist", "Join the waitlist"), href: d.waitlistUrl || "inner-circle.html#waitlist" } }); }
        else if (d.status === "not_approved") { setAuth(null); push({ role: "warren", text: d.message }); }
        else if (d.status === "observer_only") { setAuth(null); push({ role: "warren", text: d.message, button: { label: T("Upgrade auf Inner Circle", "Upgrade to Inner Circle"), href: d.upgradeUrl || "account.html?upgrade=1" } }); }
        else setAuth((a) => Object.assign({}, a, { sending: false, error: T("Unerwartete Antwort.", "Unexpected response.") }));
      } catch (e) { setAuth((a) => Object.assign({}, a, { sending: false, error: T("Verbindung weg.", "Connection lost.") })); }
    }
    async function submitCode(code) {
      if (!/^\d{6}$/.test(code)) return;
      try {
        const r = await api("/api/chat/verify-code", { method: "POST", body: JSON.stringify({ sid, code }) });
        const d = await r.json();
        if (r.ok && d.authed) { stopPolling(); becomeMember(d); }
        else setAuth((a) => a ? Object.assign({}, a, { code: "", error: d.error === "expired" ? T("Code abgelaufen — Email nochmal?", "Code expired — email again?") : T("Code stimmt nicht — schau nochmal in die Mail.", "Code doesn’t match — check the mail.") }) : a);
      } catch (e) { setAuth((a) => a ? Object.assign({}, a, { error: T("Verbindung weg.", "Connection lost.") }) : a); }
    }
    async function logout() {
      try { await api("/api/chat/logout", { method: "POST", body: JSON.stringify({ sid }) }); } catch (e) {}
      stopPolling(); try { localStorage.removeItem(LS); } catch (e) { } setSid(null); setMode("lead"); setTier("lead"); setName(null); setMsgs([]); setObserverHint(false); setAuth(null); startedRef.current = true; startFresh();
    }
    async function resetChat() {
      if (!confirm(T("Diesen Chat-Verlauf löschen und neu starten?", "Delete this chat and start over?"))) return;
      try { await api("/api/chat/delete", { method: "POST", body: JSON.stringify({ sid }) }); } catch (e) { }
      try { localStorage.removeItem(LS); } catch (e) { }
      stopPolling(); setSid(null); setMode("lead"); setTier("lead"); setName(null); setMsgs([]); setObserverHint(false); setAuth(null); startedRef.current = true; startFresh();
    }

    // ---- Render ----
    const fld = { width: "100%", background: "var(--bg-input)", border: "1px solid var(--border-strong)", borderRadius: 8, padding: "10px 12px", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 14, outline: "none", boxSizing: "border-box" };

    const launcher = h("button", { onClick: () => (open ? setOpen(false) : onOpen()), "aria-label": "Warren", style: { position: "fixed", right: 22, bottom: 22, zIndex: 240, display: "flex", alignItems: "center", gap: 9, background: "rgba(14,16,20,0.92)", backdropFilter: "blur(10px)", border: "1px solid var(--border-oracle)", borderRadius: 999, padding: "7px 16px 7px 7px", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" } },
      h("img", { src: PORTRAIT, alt: "", style: { width: 38, height: 38, borderRadius: "50%", objectFit: "cover", objectPosition: "center 20%", border: "1px solid var(--border-oracle)" } }),
      h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-oracle)" } }, open ? T("Schließen", "Close") : T("Ask Warren", "Ask Warren")));

    if (!open) return launcher;

    const inputDisabled = busy || onCooldown();
    const panel = h("div", { style: { position: "fixed", right: 22, bottom: 84, zIndex: 240, width: "min(400px, calc(100vw - 32px))", height: "min(620px, calc(100vh - 130px))", display: "flex", flexDirection: "column", background: "var(--bg-raised)", border: "1px solid var(--border-oracle)", borderRadius: 14, boxShadow: "0 24px 60px rgba(0,0,0,0.6)", overflow: "hidden" } },
      // header
      h("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)", background: "rgba(212,169,78,0.05)" } },
        h("img", { src: PORTRAIT, alt: "", style: { width: 34, height: 34, borderRadius: "50%", objectFit: "cover", objectPosition: "center 20%", border: "1px solid var(--border-oracle)" } }),
        h("div", { style: { flex: 1, lineHeight: 1.1 } }, h("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 18, color: "var(--text-primary)" } }, "Warren"), h("div", { style: { marginTop: 3 } }, h(TierBadge, { tier: mode === "member" ? tier : "lead" }))),
        mode === "member" ? h("button", { onClick: logout, title: T("Abmelden", "Log out"), style: { background: "none", border: "none", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", marginRight: 6 } }, T("Abmelden", "Log out")) : null,
        msgs.length > 1 ? h("button", { onClick: resetChat, title: T("Chat zurücksetzen", "Reset chat"), "aria-label": "Reset", style: { background: "none", border: "none", color: "var(--text-muted)", fontSize: 16, cursor: "pointer", lineHeight: 1, marginRight: 4 } }, "↺") : null,
        h("button", { onClick: () => setOpen(false), "aria-label": "Close", style: { background: "none", border: "none", color: "var(--text-muted)", fontSize: 22, cursor: "pointer", lineHeight: 1 } }, "×")),
      // body
      h("div", { ref: bodyRef, style: { flex: 1, overflowY: "auto", padding: "16px 14px" } },
        msgs.map((m, i) => h(Bubble, { key: i, m, onSignin: () => setAuth({ phase: "email", email: "" }), onReset: resetChat })),
        busy ? h(Typing, null) : null,
        busy && soft ? h("div", { style: { textAlign: "center", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", marginTop: 2 } }, T("Warren denkt nach — Recherche dauert manchmal.", "Warren is thinking — research takes a moment.")) : null),
      // footer / auth
      auth ? h("div", { style: { padding: "12px 14px", borderTop: "1px solid var(--border-subtle)" } },
        auth.phase === "email"
          ? h("div", null,
              h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 } }, T("Deine Member-Email:", "Your member email:")),
              h("input", { style: fld, type: "email", placeholder: "you@example.com", value: auth.email || "", autoFocus: true, onChange: (e) => setAuth((a) => Object.assign({}, a, { email: e.target.value, error: null })), onKeyDown: (e) => { if (e.key === "Enter") submitEmail(); } }),
              auth.error ? h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-warn, #d8a34a)", margin: "6px 0 0" } }, auth.error) : null,
              h("div", { style: { display: "flex", gap: 8, marginTop: 10 } }, h(Button, { variant: "oracle", size: "sm", loading: !!auth.sending, onClick: submitEmail }, T("Magic-Link senden", "Send magic link")), h(Button, { variant: "ghost", size: "sm", onClick: () => { stopPolling(); setAuth(null); } }, T("Abbrechen", "Cancel"))))
          : h("div", null,
              h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 } }, T("6-stelligen Code aus der Mail eintippen:", "Enter the 6-digit code from the email:")),
              h("input", { style: Object.assign({}, fld, { letterSpacing: "0.4em", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 18 }), inputMode: "numeric", maxLength: 6, placeholder: "······", value: auth.code || "", autoFocus: true, onChange: (e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 6); setAuth((a) => Object.assign({}, a, { code: v, error: null })); if (v.length === 6) submitCode(v); } }),
              auth.error ? h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-warn, #d8a34a)", margin: "6px 0 0" } }, auth.error) : null,
              h("button", { onClick: () => { stopPolling(); setAuth({ phase: "email", email: auth.email }); }, style: { background: "none", border: "none", color: "var(--text-muted)", fontFamily: "var(--font-ui)", fontSize: 12, cursor: "pointer", marginTop: 8, textDecoration: "underline" } }, T("Andere Email", "Different email"))))
        : h("div", { style: { borderTop: "1px solid var(--border-subtle)", padding: "10px 12px" } },
            onCooldown() ? h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: "6px 0" } }, T("Kurz durchatmen — gleich geht’s weiter.", "Catch your breath — back in a moment.")) : null,
            h("div", { style: { display: "flex", gap: 8, alignItems: "flex-end" } },
              h("textarea", { value: input, disabled: inputDisabled, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }, placeholder: T("Frag Warren …", "Ask Warren …"), rows: 1, style: Object.assign({}, fld, { resize: "none", maxHeight: 96, opacity: inputDisabled ? 0.6 : 1 }) }),
              h("button", { onClick: sendMessage, disabled: inputDisabled || !input.trim(), "aria-label": "Send", style: { flexShrink: 0, width: 42, height: 42, borderRadius: 10, border: "none", background: inputDisabled || !input.trim() ? "var(--bg-input)" : "var(--grad-gold)", color: inputDisabled || !input.trim() ? "var(--text-muted)" : "var(--text-on-gold)", cursor: inputDisabled || !input.trim() ? "not-allowed" : "pointer", fontSize: 18, lineHeight: 1 } }, "↑")),
            mode !== "member" ? h("div", { style: { textAlign: "center", marginTop: 8 } }, h("button", { onClick: () => setAuth({ phase: "email", email: "" }), style: { background: "none", border: "none", color: "var(--text-oracle)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" } }, T("Schon Member? Anmelden", "Already a member? Sign in"))) : null,
            h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textAlign: "center", marginTop: 7, lineHeight: 1.4 } }, T("Warren ist eine KI und kann irren. Keine Anlageberatung.", "Warren is an AI and can err. Not investment advice."))));

    return h(React.Fragment, null, launcher, panel);
  }

  function mount() {
    if (!window.React || !window.ReactDOM || !window.PYTHAIDesignSystem_df6467) { return setTimeout(mount, 60); }
    const el = document.createElement("div"); el.id = "pythai-chat-root"; document.body.appendChild(el);
    ReactDOM.createRoot(el).render(h(ChatWidget, null));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
