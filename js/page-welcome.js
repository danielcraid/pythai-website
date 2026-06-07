(() => {
  const { Button, Badge, Card } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PyEyebrow } = window;
  const { useState, useEffect } = React;
  const T = (de, en) => window.PYi18n.t(de, en);
  const API = "https://api.pythai.ch";
  function tierLabel(t) {
    return t === "inner-circle" ? "Inner Circle" : t === "syndicate" ? "Syndicate" : "Observer";
  }
  function Welcome() {
    const [state, setState] = useState("loading");
    const [me, setMe] = useState(null);
    useEffect(() => {
      fetch(API + "/api/me", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        if (d && d.ok) {
          setMe(d);
          setState("in");
        } else setState("out");
      }).catch(() => setState("out"));
    }, []);
    if (state === "loading") {
      return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 22, color: "var(--text-oracle)" } }, T("Das Orakel erkennt dich\u2026", "The oracle recognises you\u2026"));
    }
    if (state === "out") {
      return /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 460, margin: "0 auto", textAlign: "center" } }, /* @__PURE__ */ React.createElement("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 60, height: 60, margin: "0 auto 22px", opacity: 0.7 } }), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 40, margin: 0, color: "var(--text-primary)" } }, T("Nicht angemeldet.", "Not signed in.")), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--text-secondary)", margin: "16px 0 28px", lineHeight: 1.6 } }, T("Deine Sitzung ist abgelaufen oder der Link wurde schon benutzt. Fordere einen neuen Link an.", "Your session has expired or the link was already used. Request a fresh link.")), /* @__PURE__ */ React.createElement(Button, { variant: "oracle", onClick: () => {
        window.location.href = "register.html";
      } }, T("Zum Login", "Go to sign in")));
    }
    function logout() {
      fetch(API + "/api/logout", { method: "POST", credentials: "include" }).finally(() => {
        window.location.href = "index.html";
      });
    }
    const steps = [
      [T("Jeden Morgen, 06:00 CET", "Each dawn, 06:00 CET"), T("Warren gibt eine Reading aus. Als Observer bekommst du die Morgen-Headline und den Conviction-Score.", "Warren issues one reading. As an Observer you receive the dawn headline and the conviction score.")],
      [T("Hinter der Wall", "Behind the wall"), T("Die vollst\xE4ndige Reading \u2014 Reasoning, Entry-/Stop-/Target-Levels, Live-Signale \u2014 ist dem Inner Circle vorbehalten.", "The full reading \u2014 reasoning, entry/stop/target levels, live signals \u2014 is reserved for the Inner Circle.")],
      [T("Der Sanctum \xF6ffnet bald", "The Sanctum opens soon"), T("Member-Dashboard und Warren im Gespr\xE4ch kommen in Kohorten. Du wirst gerufen, sobald dein Platz bereit ist.", "The member dashboard and Warren in conversation open in cohorts. You\u2019ll be summoned when your seat is ready.")]
    ];
    return /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 680, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 40 } }, /* @__PURE__ */ React.createElement("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 72, height: 72, margin: "0 auto 24px", filter: "drop-shadow(0 0 26px var(--glow-oracle))" } }), /* @__PURE__ */ React.createElement(PyEyebrow, null, T("Willkommen im Sanctum", "Welcome to the sanctum")), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(40px,6vw,66px)", lineHeight: 1.04, margin: 0, color: "var(--text-primary)" } }, T("Du bist drin.", "You\u2019re in.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 22, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)" } }, me.email), /* @__PURE__ */ React.createElement(Badge, { tone: "oracle", variant: "outline", dot: true }, tierLabel(me.tier)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, steps.map(([t, d], i) => /* @__PURE__ */ React.createElement(Card, { key: i, variant: "raised", padding: "24px" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-oracle)", letterSpacing: "0.14em", marginTop: 3 } }, "0" + (i + 1)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 21, color: "var(--text-primary)", marginBottom: 6 } }, t), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 } }, d)))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, justifyContent: "center", marginTop: 36, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Button, { variant: "oracle", onClick: () => {
      window.location.href = "inner-circle.html#waitlist";
    } }, T("Inner Circle anfragen", "Request the Inner Circle")), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", onClick: logout }, T("Abmelden", "Log out"))));
  }
  function App() {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SiteNav, { active: "" }), /* @__PURE__ */ React.createElement("section", { style: { position: "relative", minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "70px 24px", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(75% 60% at 50% 0%, var(--glow-oracle-soft) 0%, transparent 62%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%" } }, /* @__PURE__ */ React.createElement(Welcome, null))), /* @__PURE__ */ React.createElement(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
