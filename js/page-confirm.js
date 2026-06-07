(() => {
  const { Button } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  function Confirm() {
    const status = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("status") || "ok";
    const M = {
      ok: [T("Best\xE4tigt.", "Confirmed."), T("Dein Platz auf der Liste ist best\xE4tigt. Warren ruft dich, sobald der n\xE4chste Platz frei ist.", "Your spot on the list is confirmed. Warren will summon you when the next seat opens.")],
      expired: [T("Link abgelaufen.", "Link expired."), T("Der Best\xE4tigungslink war \xE4lter als 24 Stunden. Trag dich einfach erneut ein.", "The confirmation link was over 24 hours old. Just sign up again.")],
      invalid: [T("Link ung\xFCltig.", "Invalid link."), T("Dieser Link ist ung\xFCltig oder wurde bereits benutzt.", "This link is invalid or was already used.")],
      error: [T("Etwas ging schief.", "Something went wrong."), T("Versuch es gleich noch einmal.", "Try again in a moment.")]
    };
    const [head, body] = M[status] || M.ok;
    const okState = status === "ok";
    return /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 480, margin: "0 auto", textAlign: "center" } }, /* @__PURE__ */ React.createElement("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 64, height: 64, margin: "0 auto 22px", filter: okState ? "drop-shadow(0 0 24px var(--glow-oracle))" : "none", opacity: okState ? 1 : 0.7 } }), /* @__PURE__ */ React.createElement(PyEyebrow, null, "Waitlist"), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(38px,6vw,60px)", lineHeight: 1.04, margin: 0, color: "var(--text-primary)" } }, head), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 17, lineHeight: 1.6, color: "var(--text-secondary)", margin: "18px 0 30px" } }, body), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Button, { variant: "oracle", onClick: () => {
      window.location.href = "index.html";
    } }, T("Zur Startseite", "Back home")), !okState && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", onClick: () => {
      window.location.href = "inner-circle.html#waitlist";
    } }, T("Erneut eintragen", "Sign up again"))));
  }
  function App() {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SiteNav, { active: "" }), /* @__PURE__ */ React.createElement("section", { style: { position: "relative", minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(70% 60% at 50% 0%, var(--glow-oracle-soft) 0%, transparent 62%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%" } }, /* @__PURE__ */ React.createElement(Confirm, null))), /* @__PURE__ */ React.createElement(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
