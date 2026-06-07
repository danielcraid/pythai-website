(() => {
  const { SiteNav, SiteFooter, PyPageHead, PySection, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  function App() {
    const SECTIONS = [
      ["imprint", T("Impressum", "Imprint"), [
        T("CRAID GmbH \u2014 PYTHAI ist eine AI-Unit der CRAID GmbH.", "CRAID GmbH \u2014 PYTHAI is an AI unit of CRAID GmbH."),
        T("Anschrift: [TODO \u2014 Stra\xDFe, PLZ, Ort].", "Address: [TODO \u2014 street, postcode, city]."),
        T("Vertretungsberechtigt: Daniel Simon.", "Authorised representative: Daniel Simon."),
        T("Kontakt: warren@pythai.ch.", "Contact: warren@pythai.ch."),
        T("Handelsregister / Registergericht: [TODO]. USt-IdNr.: [TODO].", "Commercial register / court: [TODO]. VAT ID: [TODO].")
      ]],
      ["privacy", T("Datenschutz", "Privacy"), [
        T("Verantwortliche Stelle: CRAID GmbH. Datenschutz-Kontakt: warren@pythai.ch.", "Controller: CRAID GmbH. Privacy contact: warren@pythai.ch."),
        T("Waitlist & Newsletter: Wir verarbeiten deine E-Mail-Adresse auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die Anmeldung erfolgt im Double-Opt-in \u2014 erst nach Klick auf den Best\xE4tigungslink wirst du kontaktiert. Den Zeitpunkt der Einwilligung speichern wir als Nachweis. Du kannst jederzeit \xFCber den Abmeldelink in jeder E-Mail oder per Mail an warren@pythai.ch widerrufen.", "Waitlist & newsletter: we process your email address on the basis of your consent (Art. 6(1)(a) GDPR). Sign-up uses double opt-in \u2014 you are only contacted after clicking the confirmation link. We store the time of consent as proof. You may withdraw anytime via the unsubscribe link in any email or by mailing warren@pythai.ch."),
        T("Konto & Login: F\xFCr Anmeldung und Login verarbeiten wir E-Mail-Adresse und Anmeldedaten zur Bereitstellung des Mitgliederbereichs (Vertragserf\xFCllung / berechtigtes Interesse). Der Login ist passwortlos \xFCber einen einmaligen Magic-Link.", "Account & login: for sign-up and login we process your email and session data to provide the member area (contract / legitimate interest). Login is passwordless via a one-time magic link."),
        T("Auftragsverarbeiter: Resend (E-Mail-Versand), Notion (Kontakt-/Member-Verwaltung), Vercel (Website-Hosting), Anthropic (Warren-Chat). Mit allen bestehen bzw. werden Auftragsverarbeitungsvertr\xE4ge geschlossen.", "Processors: Resend (email delivery), Notion (contact/member management), Vercel (website hosting), Anthropic (Warren chat). Data-processing agreements are in place or being concluded with each."),
        T("Deine Rechte: Auskunft, Berichtigung, L\xF6schung, Einschr\xE4nkung, Daten\xFCbertragbarkeit, Widerspruch sowie Widerruf erteilter Einwilligungen. Wende dich an warren@pythai.ch. Speicherdauer, vollst\xE4ndige Rechtsgrundlagen und Beschwerderecht bei der Aufsichtsbeh\xF6rde werden vor dem Live-Gang erg\xE4nzt.", "Your rights: access, rectification, erasure, restriction, portability, objection and withdrawal of consent. Contact warren@pythai.ch. Retention periods, full legal bases and the right to lodge a complaint with the supervisory authority will be added before launch.")
      ]],
      ["terms", T("AGB", "Terms"), [
        T("Platzhalter. Allgemeine Gesch\xE4ftsbedingungen f\xFCr die PYTHAI-Subscriptions (Observer / Inner Circle / Syndicate).", "Placeholder. Terms of service for the PYTHAI subscriptions (Observer / Inner Circle / Syndicate)."),
        T("Vertragsschluss, Laufzeit, K\xFCndigung, Preise (EUR), Zahlungsabwicklung (Stripe) und Widerrufsrecht im Fernabsatz sind anwaltlich auszuformulieren.", "Contract formation, term, cancellation, prices (EUR), payment handling (Stripe) and the right of withdrawal in distance selling are to be drafted by counsel.")
      ]],
      ["risk", T("Risikohinweis", "Risk notice"), [
        T("PYTHAI / Warren stellt keine Anlageberatung, keine Anlagevermittlung, keine Finanzanalyse und keine Kauf-, Verkaufs- oder Halteempfehlung dar. Eine individuelle Eignung wird nicht gepr\xFCft.", "PYTHAI / Warren does not constitute investment advice, investment broking, financial analysis or any buy, sell or hold recommendation. Individual suitability is not assessed."),
        T("Triff keine Anlageentscheidung allein auf Basis dieser Inhalte; ziehe vor jeder Entscheidung eine eigene Pr\xFCfung sowie eine lizenzierte, unabh\xE4ngige Beratung heran.", "Do not make any investment decision based solely on this content; before any decision, conduct your own review and consult licensed, independent advice."),
        T("Die CRAID GmbH \xFCbernimmt keine Haftung f\xFCr Sch\xE4den, die aus der Nutzung dieser Informationen entstehen. Angaben ohne Gew\xE4hr. M\xE4rkte bergen Risiken.", "CRAID GmbH accepts no liability for damages arising from the use of this information. No warranty is given. Markets carry risk.")
      ]]
    ];
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SiteNav, { active: "legal.html" }), /* @__PURE__ */ React.createElement(PyPageHead, { eyebrow: "Legal", title: "Imprint & legal." }), /* @__PURE__ */ React.createElement(PySection, null, /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid var(--border-oracle)", borderRadius: 8, padding: "16px 20px", background: "rgba(212,169,78,0.06)", maxWidth: 820 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em", color: "var(--text-oracle)" } }, T("ENTWURF \xB7 vor Live-Gang anwaltlich zu pr\xFCfen (Finanz-Abo: Fernabsatz/Widerruf, BaFin/FINMA).", "DRAFT \xB7 to be reviewed by counsel before launch (financial subscription: distance selling/withdrawal, BaFin/FINMA).")))), SECTIONS.map(([id, title, body]) => /* @__PURE__ */ React.createElement(PySection, { key: id, alt: id === "privacy" || id === "risk" }, /* @__PURE__ */ React.createElement("div", { id, style: { maxWidth: 820 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 32, color: "var(--text-primary)", margin: "0 0 18px" } }, title), body.map((p, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: { fontFamily: "var(--font-ui)", fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 14px", maxWidth: "80ch" } }, p))))), /* @__PURE__ */ React.createElement(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
