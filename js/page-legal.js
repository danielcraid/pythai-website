(() => {
  const { SiteNav, SiteFooter, PyPageHead, PySection } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  function App() {
    const SECTIONS = [
      ["imprint", T("Impressum", "Imprint"), [
        T("CRAID GmbH \u2014 PYTHAI ist eine AI-Unit der CRAID GmbH.", "CRAID GmbH \u2014 PYTHAI is an AI unit of CRAID GmbH."),
        T("Anschrift: [TODO \u2014 Stra\xDFe, PLZ, Ort].", "Address: [TODO \u2014 street, postcode, city]."),
        T("Vertretungsberechtigt: Daniel Simon.", "Authorised representative: Daniel Simon."),
        T("Kontakt: warren@pythai.de.", "Contact: warren@pythai.de."),
        T("Handelsregister / Registergericht: [TODO]. USt-IdNr.: [TODO].", "Commercial register / court: [TODO]. VAT ID: [TODO].")
      ]],
      ["privacy", T("Datenschutz", "Privacy"), [
        T("Platzhalter. Diese Seite beschreibt die Verarbeitung personenbezogener Daten (Waitlist-/Member-Daten via Notion-CRM, Anthropic-API beim Warren-Chat, E-Mail-Versand).", "Placeholder. This page describes the processing of personal data (waitlist/member data via the Notion CRM, the Anthropic API for the Warren chat, email delivery)."),
        T("Verantwortliche Stelle: CRAID GmbH. Datenschutz-Kontakt: warren@pythai.de.", "Controller: CRAID GmbH. Privacy contact: warren@pythai.de."),
        T("Rechtsgrundlagen, Speicherdauer, Betroffenenrechte und Auftragsverarbeiter sind vor Live-Gang vollst\xE4ndig zu erg\xE4nzen.", "Legal bases, retention, data-subject rights and processors are to be completed in full before launch.")
      ]],
      ["terms", T("AGB", "Terms"), [
        T("Platzhalter. Allgemeine Gesch\xE4ftsbedingungen f\xFCr die PYTHAI-Subscriptions (Observer / Inner Circle / Syndicate).", "Placeholder. Terms of service for the PYTHAI subscriptions (Observer / Inner Circle / Syndicate)."),
        T("Vertragsschluss, Laufzeit, K\xFCndigung, Preise (CHF), Zahlungsabwicklung (Stripe) und Widerrufsrecht im Fernabsatz sind anwaltlich auszuformulieren.", "Contract formation, term, cancellation, prices (CHF), payment handling (Stripe) and the right of withdrawal in distance selling are to be drafted by counsel.")
      ]],
      ["risk", T("Risikohinweis", "Risk notice"), [
        T("PYTHAI / Warren stellt keine Anlageberatung, keine Anlagevermittlung, keine Finanzanalyse und keine Kauf-, Verkaufs- oder Halteempfehlung dar. Eine individuelle Eignung wird nicht gepr\xFCft.", "PYTHAI / Warren does not constitute investment advice, investment broking, financial analysis or any buy, sell or hold recommendation. Individual suitability is not assessed."),
        T("Triff keine Anlageentscheidung allein auf Basis dieser Inhalte; ziehe vor jeder Entscheidung eine eigene Pr\xFCfung sowie eine lizenzierte, unabh\xE4ngige Beratung heran.", "Do not make any investment decision based solely on this content; before any decision, conduct your own review and consult licensed, independent advice."),
        T("Die CRAID GmbH \xFCbernimmt keine Haftung f\xFCr Sch\xE4den, die aus der Nutzung dieser Informationen entstehen. Angaben ohne Gew\xE4hr. M\xE4rkte bergen Risiken.", "CRAID GmbH accepts no liability for damages arising from the use of this information. No warranty is given. Markets carry risk.")
      ]]
    ];
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SiteNav, { active: "legal.html" }), /* @__PURE__ */ React.createElement(PyPageHead, { eyebrow: "Legal", title: "Imprint & legal." }), /* @__PURE__ */ React.createElement(PySection, null, /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid var(--border-oracle)", borderRadius: 8, padding: "16px 20px", background: "rgba(212,169,78,0.06)", maxWidth: 820 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em", color: "var(--text-oracle)" } }, T("ENTWURF \xB7 Platzhalter \u2014 vor Live-Gang anwaltlich zu pr\xFCfen (Finanz-Abo: Fernabsatz/Widerruf, BaFin/FINMA).", "DRAFT \xB7 placeholder \u2014 to be reviewed by counsel before launch (financial subscription: distance selling/withdrawal, BaFin/FINMA).")))), SECTIONS.map(([id, title, body]) => /* @__PURE__ */ React.createElement(PySection, { key: id, alt: id === "privacy" || id === "risk" }, /* @__PURE__ */ React.createElement("div", { id, style: { maxWidth: 820 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 32, color: "var(--text-primary)", margin: "0 0 18px" } }, title), body.map((p, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: { fontFamily: "var(--font-ui)", fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 14px", maxWidth: "80ch" } }, p))))), /* @__PURE__ */ React.createElement(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
