(() => {
  const { SiteNav, SiteFooter, PyPageHead, PyPricing, PySection, PyWaitlist } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  function go() {
    window.location.href = "#waitlist";
  }
  function App() {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SiteNav, { active: "inner-circle.html" }), /* @__PURE__ */ React.createElement(
      PyPageHead,
      {
        eyebrow: "By application",
        title: "Three ways to hear the oracle.",
        sub: T("Observer ist kostenlos und bleibt es. Im Inner Circle lebt das vollst\xE4ndige Reading. Jeder Platz wird vergeben, nicht einfach gekauft — du bewirbst dich, Warren pr\xFCft, und gibt dich frei. Syndicate kommt bald.", "Observer is free and always will be. Inner Circle is where the full reading lives. Every seat is granted, not just bought — you apply, Warren reviews and approves. Syndicate is coming soon.")
      }
    ), /* @__PURE__ */ React.createElement(PySection, null, /* @__PURE__ */ React.createElement(PyPricing, { onEnter: go })), /* @__PURE__ */ React.createElement(PySection, { alt: true }, /* @__PURE__ */ React.createElement("div", { id: "waitlist" }, /* @__PURE__ */ React.createElement(PyWaitlist, null))), /* @__PURE__ */ React.createElement(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
