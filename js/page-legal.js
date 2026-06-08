(() => {
  const { SiteNav, SiteFooter, PyPageHead, PySection, PyEyebrow } = window;
  const { useEffect } = React;
  const T = (de, en) => window.PYi18n.t(de, en);
  function App() {
    useEffect(() => {
      var id = (window.location.hash || "").slice(1);
      if (!id) return;
      setTimeout(function () {
        var el = document.getElementById(id);
        if (!el) return;
        var top = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: top, behavior: "smooth" });
      }, 60);
    }, []);
    const SECTIONS = [
      ["imprint", T("Impressum", "Imprint"), [
        T("PYTHAI UG (haftungsbeschr\xE4nkt) i.G.", "PYTHAI UG (haftungsbeschr\xE4nkt) i.G. \u2014 UG in formation."),
        T("Anschrift: [TODO \u2014 Stra\xDFe, PLZ, Ort].", "Address: [TODO \u2014 street, postcode, city]."),
        T("Vertretungsberechtigt: Daniel Simon.", "Authorised representative: Daniel Simon."),
        T("Kontakt: warren@pythai.ch.", "Contact: warren@pythai.ch."),
        T("Handelsregister / Registergericht: [TODO]. USt-IdNr.: [TODO].", "Commercial register / court: [TODO]. VAT ID: [TODO].")
      ]],
      ["privacy", T("Datenschutz", "Privacy"), [
        T("Verantwortliche Stelle: PYTHAI UG (haftungsbeschr\xE4nkt) i.G. Datenschutz-Kontakt: warren@pythai.ch.", "Controller: PYTHAI UG (haftungsbeschr\xE4nkt) i.G. Privacy contact: warren@pythai.ch."),
        T("Waitlist & Newsletter: Wir verarbeiten deine E-Mail-Adresse auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die Anmeldung erfolgt im Double-Opt-in \u2014 erst nach Klick auf den Best\xE4tigungslink wirst du kontaktiert. Den Zeitpunkt der Einwilligung speichern wir als Nachweis. Du kannst jederzeit \xFCber den Abmeldelink in jeder E-Mail oder per Mail an warren@pythai.ch widerrufen.", "Waitlist & newsletter: we process your email address on the basis of your consent (Art. 6(1)(a) GDPR). Sign-up uses double opt-in \u2014 you are only contacted after clicking the confirmation link. We store the time of consent as proof. You may withdraw anytime via the unsubscribe link in any email or by mailing warren@pythai.ch."),
        T("Konto & Login: F\xFCr Anmeldung und Login verarbeiten wir E-Mail-Adresse und Anmeldedaten zur Bereitstellung des Mitgliederbereichs (Vertragserf\xFCllung / berechtigtes Interesse). Der Login ist passwortlos \xFCber einen einmaligen Magic-Link.", "Account & login: for sign-up and login we process your email and session data to provide the member area (contract / legitimate interest). Login is passwordless via a one-time magic link."),
        T("Auftragsverarbeiter: Resend (E-Mail-Versand), Notion (Kontakt-/Member-Verwaltung), Vercel (Website-Hosting), Anthropic (Warren-Chat). Mit allen bestehen bzw. werden Auftragsverarbeitungsvertr\xE4ge geschlossen.", "Processors: Resend (email delivery), Notion (contact/member management), Vercel (website hosting), Anthropic (Warren chat). Data-processing agreements are in place or being concluded with each."),
        T("Deine Rechte: Auskunft, Berichtigung, L\xF6schung, Einschr\xE4nkung, Daten\xFCbertragbarkeit, Widerspruch sowie Widerruf erteilter Einwilligungen. Wende dich an warren@pythai.ch. Speicherdauer, vollst\xE4ndige Rechtsgrundlagen und Beschwerderecht bei der Aufsichtsbeh\xF6rde werden vor dem Live-Gang erg\xE4nzt.", "Your rights: access, rectification, erasure, restriction, portability, objection and withdrawal of consent. Contact warren@pythai.ch. Retention periods, full legal bases and the right to lodge a complaint with the supervisory authority will be added before launch.")
      ]],
      ["terms", T("AGB", "Terms"), [
        T("Entwurf — Struktur zur anwaltlichen Ausformulierung. Anbieter: PYTHAI UG (haftungsbeschr\xE4nkt) i.G.", "Draft — structure for legal finalisation. Provider: PYTHAI UG (haftungsbeschr\xE4nkt) i.G."),
        T("1 · Geltungsbereich. Diese AGB gelten f\xFCr alle PYTHAI-Subscriptions (Observer / Inner Circle / Syndicate).", "1 · Scope. These terms apply to all PYTHAI subscriptions (Observer / Inner Circle / Syndicate)."),
        T("2 · Leistung & Charakter. PYTHAI ist ein Publisher (Finanzpublikation), Warren ein KI-Kolumnist. Die Inhalte sind redaktionelle Markt-Einsch\xE4tzungen zur Information und Inspiration — keine Anlageberatung, keine Anlagevermittlung, keine individuelle Empfehlung.", "2 · Service & character. PYTHAI is a publisher (financial publication); Warren is an AI columnist. The content is editorial market commentary for information and inspiration — not investment advice, broking or individual recommendation."),
        T("3 · Zugang & Freigabe. Die Mitgliedschaft setzt die Best\xE4tigung der erforderlichen Einwilligungen (AGB, Risikohinweis, KI-Hinweis, Eigenverantwortung) sowie eine Freigabe durch PYTHAI voraus. Es besteht kein Anspruch auf Aufnahme.", "3 · Access & approval. Membership requires confirming the necessary consents (terms, risk notice, AI notice, own responsibility) and approval by PYTHAI. There is no entitlement to admission."),
        T("4 · Vertragsschluss & Laufzeit. Bezahlte Subscriptions laufen monatlich und verl\xE4ngern sich automatisch; K\xFCndigung jederzeit zum Periodenende.", "4 · Formation & term. Paid subscriptions run monthly and renew automatically; cancellable anytime to the end of the period."),
        T("5 · Preise & Zahlung. Inner Circle 99 €/Monat; Syndicate 298 €/Monat (in Vorbereitung). Zahlungsabwicklung \xFCber Stripe. Preise inkl. gesetzlicher USt., soweit anwendbar.", "5 · Prices & payment. Inner Circle €99/month; Syndicate €298/month (in preparation). Payments handled via Stripe. Prices include statutory VAT where applicable."),
        T("6 · Widerruf (Fernabsatz). Verbraucher haben ein 14-t\xE4giges Widerrufsrecht. Bei sofortiger Bereitstellung digitaler Inhalte erlischt es mit ausdr\xFCcklicher Zustimmung und Kenntnisnahme des Erl\xF6schens.", "6 · Withdrawal (distance selling). Consumers have a 14-day right of withdrawal. For immediately provided digital content it lapses upon express consent and acknowledgement of the lapse."),
        T("7 · Pflichten der Nutzer. Anlageentscheidungen erfolgen eigenverantwortlich. Keine Weitergabe oder \xF6ffentliche Wiedergabe der Inhalte, keine missbr\xE4uchliche Nutzung.", "7 · User obligations. Investment decisions are made on the user’s own responsibility. No redistribution or public reproduction of the content, no abusive use."),
        T("8 · KI-Hinweis. Die Inhalte werden von einer KI (Warren) erstellt und k\xF6nnen fehlerhaft sein. Angaben ohne Gew\xE4hr.", "8 · AI notice. The content is produced by an AI (Warren) and may contain errors. No warranty is given."),
        T("9 · Haftung. Haftung nur bei Vorsatz und grober Fahrl\xE4ssigkeit sowie bei Verletzung von Leben, K\xF6rper oder Gesundheit; im \xDCbrigen beschr\xE4nkt. Keine Haftung f\xFCr Anlageergebnisse.", "9 · Liability. Liability only for intent and gross negligence and for injury to life, body or health; otherwise limited. No liability for investment outcomes."),
        T("10 · \xC4nderungen & Schlussbestimmungen. \xC4nderungen dieser AGB werden angek\xFCndigt; erneute Zustimmung bzw. fortgesetzte Nutzung gilt als Annahme. Anwendbares Recht, Gerichtsstand und salvatorische Klausel sind anwaltlich zu finalisieren.", "10 · Changes & final provisions. Changes to these terms will be announced; renewed consent or continued use constitutes acceptance. Governing law, jurisdiction and severability are to be finalised by counsel.")
      ]],
      ["risk", T("Risikohinweis", "Risk notice"), [
        T("Warren ist eine KI und kann irren. Die Inhalte sind reine Inspiration und redaktionelle Markt-Einsch\xE4tzung — keine Garantie, kein Rat. Du triffst alle Entscheidungen eigenverantwortlich.", "Warren is an AI and can err. The content is pure inspiration and editorial market commentary — no guarantee, no advice. You make all decisions on your own responsibility."),
        T("PYTHAI / Warren stellt keine Anlageberatung, keine Anlagevermittlung, keine Finanzanalyse und keine Kauf-, Verkaufs- oder Halteempfehlung dar. Eine individuelle Eignung wird nicht gepr\xFCft.", "PYTHAI / Warren does not constitute investment advice, investment broking, financial analysis or any buy, sell or hold recommendation. Individual suitability is not assessed."),
        T("Triff keine Anlageentscheidung allein auf Basis dieser Inhalte; ziehe vor jeder Entscheidung eine eigene Pr\xFCfung sowie eine lizenzierte, unabh\xE4ngige Beratung heran.", "Do not make any investment decision based solely on this content; before any decision, conduct your own review and consult licensed, independent advice."),
        T("Die PYTHAI UG (haftungsbeschr\xE4nkt) i.G. \xFCbernimmt keine Haftung f\xFCr Sch\xE4den, die aus der Nutzung dieser Informationen entstehen. Angaben ohne Gew\xE4hr. M\xE4rkte bergen Risiken.", "PYTHAI UG (haftungsbeschr\xE4nkt) i.G. accepts no liability for damages arising from the use of this information. No warranty is given. Markets carry risk.")
      ]]
    ];
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SiteNav, { active: "legal.html" }), /* @__PURE__ */ React.createElement(PyPageHead, { eyebrow: "Legal", title: "Imprint & legal." }), /* @__PURE__ */ React.createElement(PySection, null, /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid var(--border-oracle)", borderRadius: 8, padding: "16px 20px", background: "rgba(212,169,78,0.06)", maxWidth: 820 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em", color: "var(--text-oracle)" } }, T("ENTWURF \xB7 vor Live-Gang anwaltlich zu pr\xFCfen (Finanz-Abo: Fernabsatz/Widerruf, BaFin/FINMA).", "DRAFT \xB7 to be reviewed by counsel before launch (financial subscription: distance selling/withdrawal, BaFin/FINMA).")))), SECTIONS.map(([id, title, body]) => /* @__PURE__ */ React.createElement(PySection, { key: id, alt: id === "privacy" || id === "risk" }, /* @__PURE__ */ React.createElement("div", { id, style: { maxWidth: 820 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 32, color: "var(--text-primary)", margin: "0 0 18px" } }, title), body.map((p, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: { fontFamily: "var(--font-ui)", fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 14px", maxWidth: "80ch" } }, p))))), /* @__PURE__ */ React.createElement(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
