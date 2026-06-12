(() => {
  const { Button } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const h = React.createElement;
  function Confirm() {
    const status = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("status") || "ok";
    const M = {
      ok: [T("Best\xE4tigt.", "Confirmed."), T("Dein Platz auf der Liste ist best\xE4tigt. Warren ruft dich, sobald der n\xE4chste Platz frei ist.", "Your spot on the list is confirmed. Warren will summon you when the next seat opens.")],
      login: [T("E-Mail best\xE4tigt.", "Email confirmed."), T("Stark — deine E-Mail ist best\xE4tigt. Jetzt einmal einloggen, um die Anmeldung abzuschlie\xDFen und dein Onboarding zu starten. Das ist der letzte Schritt.", "Nice — your email is confirmed. Now sign in once to complete your registration and start onboarding. This is the final step.")],
      expired: [T("Link abgelaufen.", "Link expired."), T("Der Best\xE4tigungslink war \xE4lter als 24 Stunden. Trag dich einfach erneut ein.", "The confirmation link was over 24 hours old. Just sign up again.")],
      invalid: [T("Link ung\xFCltig.", "Invalid link."), T("Dieser Link ist ung\xFCltig oder wurde bereits benutzt.", "This link is invalid or was already used.")],
      error: [T("Etwas ging schief.", "Something went wrong."), T("Versuch es gleich noch einmal.", "Try again in a moment.")]
    };
    const [head, body] = M[status] || M.ok;
    const loginState = status === "login";
    const success = status === "ok" || loginState;
    const errorState = !success;

    const actions = [];
    if (loginState) {
      actions.push(h(Button, { key: "login", variant: "oracle", onClick: () => { window.location.href = "register.html"; } }, T("Jetzt einloggen", "Sign in now")));
    } else if (status === "ok") {
      actions.push(h(Button, { key: "home", variant: "oracle", onClick: () => { window.location.href = "index.html"; } }, T("Zur Startseite", "Back home")));
    } else {
      actions.push(h(Button, { key: "home", variant: "oracle", onClick: () => { window.location.href = "index.html"; } }, T("Zur Startseite", "Back home")));
      actions.push(h(Button, { key: "again", variant: "ghost", onClick: () => { window.location.href = "inner-circle.html#waitlist"; } }, T("Erneut eintragen", "Sign up again")));
    }

    return h("div", { style: { maxWidth: 480, margin: "0 auto", textAlign: "center" } },
      h("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 64, height: 64, margin: "0 auto 22px", filter: success ? "drop-shadow(0 0 24px var(--glow-oracle))" : "none", opacity: success ? 1 : 0.7 } }),
      h(PyEyebrow, null, loginState ? "Login" : "Waitlist"),
      h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(38px,6vw,60px)", lineHeight: 1.04, margin: 0, color: "var(--text-primary)" } }, head),
      h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 17, lineHeight: 1.6, color: "var(--text-secondary)", margin: "18px 0 30px" } }, body),
      h("div", { style: { display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" } }, actions),
      loginState ? h("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11.5, letterSpacing: "0.03em", color: "var(--text-muted)", margin: "20px 0 0", lineHeight: 1.6 } }, T("Wichtig: Erst nach dem Login ist deine Anmeldung vollst\xE4ndig.", "Note: your registration is only complete once you've signed in.")) : null);
  }
  function App() {
    return h("div", null, h(SiteNav, { active: "" }), h("section", { style: { position: "relative", minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", overflow: "hidden" } }, h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(70% 60% at 50% 0%, var(--glow-oracle-soft) 0%, transparent 62%)" } }), h("div", { style: { position: "relative", width: "100%" } }, h(Confirm, null))), h(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
