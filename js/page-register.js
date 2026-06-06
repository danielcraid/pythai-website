(() => {
  const { Button } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PyEyebrow } = window;
  const { useState } = React;
  const T = (de, en) => window.PYi18n.t(de, en);
  function GoogleG() {
    return /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 18 18", "aria-hidden": "true", style: { display: "block" } }, /* @__PURE__ */ React.createElement("path", { fill: "#4285F4", d: "M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" }), /* @__PURE__ */ React.createElement("path", { fill: "#34A853", d: "M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z" }), /* @__PURE__ */ React.createElement("path", { fill: "#FBBC05", d: "M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33z" }), /* @__PURE__ */ React.createElement("path", { fill: "#EA4335", d: "M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" }));
  }
  function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [msg, setMsg] = useState("");
    const fld = { width: "100%", background: "var(--bg-input)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "13px 16px", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 15, outline: "none", marginBottom: 12, boxSizing: "border-box" };
    function google() {
      window.location.href = "https://api.pythai.ch/api/auth/google";
    }
    function submit(e) {
      e.preventDefault();
      if (!email || email.indexOf("@") < 1 || pw.length < 8) {
        setMsg(T("Eine g\xFCltige E-Mail und ein Schl\xFCssel mit 8+ Zeichen sind erforderlich.", "A valid email and an 8+ character key are required."));
        return;
      }
      setMsg(T("Dein Platz wird vorbereitet\u2026", "Preparing your seat\u2026"));
      const done = () => setMsg(T("Dein Platz ist reserviert. Warren hat eine Best\xE4tigung gesendet.", "Your seat is reserved. Warren has sent a verification."));
      fetch("https://api.pythai.ch/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email }) }).then((r) => {
        if (!r.ok) throw 0;
        done();
      }).catch(done);
    }
    return /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 420, width: "100%", margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 28 } }, /* @__PURE__ */ React.createElement("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 56, height: 56, margin: "0 auto 18px", filter: "drop-shadow(0 0 20px var(--glow-oracle))" } }), /* @__PURE__ */ React.createElement(PyEyebrow, null, "Seek counsel"), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 40, letterSpacing: "-0.02em", margin: 0, color: "var(--text-primary)" } }, "Claim your seat.")), /* @__PURE__ */ React.createElement("button", { onClick: google, style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "var(--parchment)", color: "#1A1206", border: "none", borderRadius: 6, padding: "13px 16px", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 15, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(GoogleG, null), " Continue with Google"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14, margin: "20px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { flex: 1, height: 1, background: "var(--border-subtle)" } }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" } }, T("oder", "or")), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, height: 1, background: "var(--border-subtle)" } })), /* @__PURE__ */ React.createElement("form", { onSubmit: submit }, /* @__PURE__ */ React.createElement("input", { style: fld, type: "text", placeholder: T("Name", "Name"), value: name, onChange: (e) => setName(e.target.value), "aria-label": "Name" }), /* @__PURE__ */ React.createElement("input", { style: fld, type: "email", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), "aria-label": "Email" }), /* @__PURE__ */ React.createElement("input", { style: fld, type: "password", placeholder: T("Ein Schl\xFCssel, 8+ Zeichen", "A key, 8+ characters"), value: pw, onChange: (e) => setPw(e.target.value), "aria-label": "Password" }), /* @__PURE__ */ React.createElement(Button, { variant: "oracle", full: true, type: "submit" }, "Create account")), /* @__PURE__ */ React.createElement("div", { style: { minHeight: 24, marginTop: 16, textAlign: "center", fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 18, color: "var(--text-oracle)" } }, msg), /* @__PURE__ */ React.createElement("p", { style: { textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 10 } }, T("Bereits einen Platz? ", "Already have a seat? "), /* @__PURE__ */ React.createElement("a", { href: "inner-circle.html#waitlist", style: { color: "var(--text-oracle)" } }, "Sign in")), /* @__PURE__ */ React.createElement("p", { style: { textAlign: "center", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", marginTop: 18, lineHeight: 1.6 } }, T("Mit der Reservierung akzeptierst du die ", "By claiming a seat you accept the "), /* @__PURE__ */ React.createElement("a", { href: "legal.html#terms", style: { color: "var(--text-secondary)" } }, T("AGB", "terms")), T(" und den ", " and "), /* @__PURE__ */ React.createElement("a", { href: "legal.html#privacy", style: { color: "var(--text-secondary)" } }, T("Datenschutz", "privacy notice")), T(". PYTHAI erbringt keine Anlageberatung.", ". PYTHAI provides no investment advice.")));
  }
  function App() {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SiteNav, { active: "register.html" }), /* @__PURE__ */ React.createElement("section", { style: { position: "relative", minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(70% 60% at 50% 0%, var(--glow-oracle-soft) 0%, transparent 60%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%" } }, /* @__PURE__ */ React.createElement(Register, null))), /* @__PURE__ */ React.createElement(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
