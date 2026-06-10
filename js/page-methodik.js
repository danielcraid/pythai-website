/* PYTHAI · /methodik — member-walled like the Chartomat:
   content lives in JS and only renders for signed-in, approved members
   (Observer and up). Anonymous / pending visitors get a public teaser.
   Rendered as a #root App so the nav stays sticky. */
(() => {
  const DS = window.PYTHAIDesignSystem_df6467 || {};
  const Button = DS.Button;
  const { SiteNav, SiteFooter, PyEyebrow } = window;
  const T = (de, en) => (window.PYi18n ? window.PYi18n.t(de, en) : de);
  const API = "https://api.pythai.ch";
  const { useState, useEffect } = React;
  const h = React.createElement;

  const CONTENT = `<section class="methodik-hero">
  <div class="eyebrow">PYTHAI · Methodik</div>
  <h1>Wie liest man das Daily Oracle?</h1>
  <p class="lead">
    Jeden Morgen um 07:54 öffnet sich der Sanctum: 2–5 Trade-Setups, klar strukturiert.
    Damit du sofort weißt was du siehst — hier die Grammatik dahinter.
  </p>
</section>

<section class="methodik-section">
  <div class="section-label">Erste Ebene</div>
  <h2>Zwei Skalen pro Trade · Idea-Score &amp; Execute-Confidence</h2>
  <p>Jeder Trade hat <strong>zwei unabhängige Bewertungen</strong>, die du oben im Header siehst:</p>

  <div class="dual-bucket">
    <div class="bucket idea">
      <div class="bucket-label">Idea-Score</div>
      <div class="bucket-question">„Wie attraktiv wäre dieser Trade bei perfekten Bedingungen?"</div>
      <p>Die strukturelle Stärke der Idee — Catalyst-Klarheit, Peer-Edge, Historical-Analog, Hot-Money-Alignment, Monitoring-Feasibility. Aus der Discovery-Phase, bevor Live-Daten geprüft sind.</p>
    </div>
    <div class="bucket execute">
      <div class="bucket-label">Execute-Confidence</div>
      <div class="bucket-question">„Wie wahrscheinlich läuft der Trade <strong>HEUTE</strong>?"</div>
      <p>Die Tradierbarkeit jetzt. Berücksichtigt Live-Spread, aktuelles Markt-Regime (RISK-OFF / MIXED / NORMAL), Snapshot-Werte (VIX, Breadth, DXY) und alle Sharpener-Live-Checks.</p>
    </div>
  </div>

  <figure class="screenshot">
    <img src="assets/methodik/trade-pills.png?v=2" alt="Trade-Header mit Idea-Score und Execute-Confidence Pills" loading="lazy" />
    <figcaption>Beispiel-Header aus dem Daily Oracle · Idea-Score &amp; Execute-Confidence oben rechts.</figcaption>
  </figure>

  <h3>Sechs-Stufen-Skala (gilt für beide)</h3>
  <div class="confidence-stripe">
    <div class="bucket-step" data-color="green">HIGHEST<br><small>≥ 75</small></div>
    <div class="bucket-step" data-color="lightgold">HIGH<br><small>≥ 64</small></div>
    <div class="bucket-step" data-color="gold">MEDIUM<br><small>≥ 56</small></div>
    <div class="bucket-step" data-color="orange">MODERATE<br><small>≥ 50</small></div>
    <div class="bucket-step" data-color="blue">LOW<br><small>≥ 40</small></div>
    <div class="bucket-step" data-color="red">MARGINAL<br><small>≥ 35</small></div>
  </div>
  <p class="hint">Werte unter 35 erscheinen nicht im Output — Ideen unter dieser Schwelle gelten als ohne Tradier-Substanz.</p>

  <div class="callout-example">
    <div class="callout-label">Beispiel · ACN Pre-Earnings</div>
    <p><strong>ACN (Pre-Earnings Setup)</strong> erscheint mit <span class="pill green">Idea: HIGHEST · 78</span> und gleichzeitig <span class="pill red">Execute: MARGINAL · 35</span>.</p>
    <p>Was man daraus interpretieren könnte: Strukturell ein erstklassiges Setup — Beat-Quote 75%, Catalyst klar, Peer-Edge stimmt. Der <em>Schein-Spread liegt aber bei 2,11%</em> (über der 1,3%-Schwelle), das Tradegate-Volumen muss sich erst aufbauen.</p>
    <p><strong>Ergebnis:</strong> Der Trade landet nicht in der Shortlist, sondern auf der Watchlist — mit klarem Trigger: „Spread &lt; 1,3% nach 10:00 CET". Sobald Liquidität da ist, wandert die Idee in die nächste Briefing-Runde.</p>
  </div>

  <figure class="screenshot">
    <img src="assets/methodik/watchlist-acn.png?v=2" alt="Watchlist-Eintrag mit Trigger-Bedingung" loading="lazy" />
    <figcaption>Watchlist-Sektion · jede Idee mit Asset, ISIN und exakter Trigger-Bedingung.</figcaption>
  </figure>
</section>

<section class="methodik-section">
  <div class="section-label">Zweite Ebene</div>
  <h2>Trading-Arten · Wie Setups geführt werden</h2>
  <p>Jeder Trade hat eine Klasse — und je nach Klasse läuft das Risiko-Management anders. Drei zentrale Modi als Beispiel:</p>

  <article class="mode-card">
    <h3>1 · ETF Skim</h3>
    <div class="risk-tag moderat"><span class="dot"></span>Risikoklasse · <span class="risk-lvl">Moderat</span></div>
    <div class="mode-meta">ETFs · Index · Bonds · breit gestreute Themen</div>
    <p>Bei ETF/Index/Bond-Long-Trades muss man <strong>keinen Hard-Stop</strong> und <strong>kein fixes Target</strong> setzen. Man kann Gewinne stattdessen gleitend mitnehmen — das nennt man <strong>Skim</strong>.</p>
    <h4>Skim-Methode</h4>
    <ul class="how-to">
      <li><strong>Trigger:</strong> +3 bis +5% Buchgewinn (je nach Volatilität)</li>
      <li><strong>Take:</strong> 30–50% der Position abnehmen</li>
      <li><strong>Rest:</strong> läuft weiter mit mentalem Trailing-Stop (kein Order-Buch-Eintrag)</li>
      <li><strong>Bei Strukturbruch:</strong> ganze Position schließen (z.B. Sektor-Rotation umgekehrt)</li>
    </ul>
    <h4>Mögliche Trigger</h4>
    <table class="skim-table">
      <thead><tr><th>Produkt-Typ</th><th>Trigger</th><th>Take</th></tr></thead>
      <tbody>
        <tr><td>Stabile breite ETFs (XLP, TLT, Healthcare)</td><td>+5 bis +7%</td><td>30%</td></tr>
        <tr><td>Sektor-ETFs (XLK, XLF, Industrials)</td><td>+5%</td><td>30–40%</td></tr>
        <tr><td>Volatile Themen (Defense, Crypto-ETC, EM Single-Country)</td><td>+3%</td><td>50%</td></tr>
        <tr><td>Index-Long (SPY, QQQ)</td><td>+4%</td><td>30%</td></tr>
      </tbody>
    </table>
    <figure class="screenshot">
      <img src="assets/methodik/etf-skim.png?v=2" alt="ETF-Trade-Card mit Modus ETF Skim" loading="lazy" />
      <figcaption>ETF-Trade im Daily Oracle · Entry-Preis + Modus ETF Skim · keine Stop/Target-Felder.</figcaption>
    </figure>
    <div class="why-box">
      <strong>Warum Skim statt Hard-Stop bei ETFs?</strong><br>
      ETFs/Indizes bewegen sich strukturell langsamer, mit weniger Whipsaw als Hebelscheine. Ein 3%-Stop fängt schon normales Tagesrauschen. Skim ist die naheliegende Antwort: Gewinn mitnehmen, die Position für Mehrwege offen halten.
    </div>
  </article>

  <article class="mode-card">
    <h3>2 · Catalyst-Trade · Hebelschein</h3>
    <div class="risk-tag hoechste"><span class="dot"></span>Risikoklasse · <span class="risk-lvl">Höchste</span></div>
    <div class="mode-meta">Pre-/Post-Earnings · STT (Speed Trend Trade) · News-Reaktion</div>
    <div class="risk-warning"><strong>ACHTUNG — das ist die höchste Risikoklasse.</strong> Gehebelte Knock-Out-Produkte können binnen Minuten wertlos werden (Totalverlust). Wir raten von dieser Trade-Art ab.</div>
    <p>Klassische Hebelschein-Setups mit Knock-Out (KO) — schnell rein, schnell raus. Hier gehören <strong>Hard-Stop, Target und R-R</strong> zum Standard-Setup.</p>
    <h4>Die Levels</h4>
    <ul class="how-to">
      <li><strong>Entry:</strong> exakter Bid/Ask-Preis im Schein</li>
      <li><strong>Stop:</strong> Hard-Stop, idR 15–25% unter Entry</li>
      <li><strong>Target:</strong> realistisches Kursziel auf Basis Underlying-Move</li>
      <li><strong>R-R (Risk-Reward):</strong> in der Regel ≥ 2.0 — Target bringt 2× den Stop-Verlust</li>
    </ul>
    <h4>Spread- &amp; KO-Prüfung</h4>
    <ul class="how-to">
      <li><strong>Spread &lt; 1,3%</strong> live bei Tradegate — sonst Watchlist</li>
      <li><strong>KO-Distance &gt; 15%</strong> vom Entry — sonst zu nah am Knock-Out</li>
      <li><strong>Emittenten:</strong> bevorzugt Vontobel · UBS · Société Générale · HSBC (geprüft, transparent)</li>
    </ul>
    <h4>Pre-Earnings — Peak-Window-Regel</h4>
    <p>Pre-Earnings-Trades mit <strong>DTE = 0, 1 oder 2</strong> (Days to Earnings) sind grundsätzlich Hard-Skip. Das letzte Fenster vor Release ist statistisch teuer (Implied-Vol-Crush, Sell-the-News). Override nur bei 5 erfüllten Hard-Gates und keiner einzigen Veto-Bedingung.</p>
    <figure class="screenshot">
      <img src="assets/methodik/catalyst-trade.png?v=2" alt="Catalyst-Trade mit allen Levels" loading="lazy" />
      <figcaption>Hebelschein-Setup · Entry · Stop · Target · R-R sichtbar im Levels-Block.</figcaption>
    </figure>
  </article>

  <article class="mode-card">
    <h3>3 · Index-Short · Defensive Position</h3>
    <div class="risk-tag hoch"><span class="dot"></span>Risikoklasse · <span class="risk-lvl">Hoch</span></div>
    <div class="mode-meta">SPX-Short · Nasdaq-Short · Sektor-Short als Hedge</div>
    <p>Eigene Risiko-Klasse — Shorts haben einseitig begrenzten Gewinn und unbegrenztes Risiko nach oben. Strengeres Setup:</p>
    <ul class="how-to">
      <li><strong>Stop tight</strong> — typisch 3–5% über Entry</li>
      <li><strong>R-R in der Regel ≥ 2.5</strong> (statt 2.0 bei Long-Setups)</li>
      <li><strong>Nur in Regime RISK-OFF oder SELL-OFF</strong> — keine Shorts in NORMAL/MIXED</li>
      <li><strong>Trigger:</strong> klarer Bruch eines technischen Levels mit Volume</li>
    </ul>
  </article>

  <p class="hint">Das ist nur eine Auswahl. Die vollständige Übersicht aller Trade-Arten — STT, Earnings, Index, ETF-Varianten und mehr — findest du im <a href="playbook.html" style="color: var(--oracle); text-decoration: none;">Playbook</a> (Inner Circle).</p>
</section>

<section class="methodik-section">
  <div class="section-label">Dritte Ebene</div>
  <h2>Was du noch im Briefing siehst</h2>
  <dl class="legend-grid">
    <dt>VIX (Fear-Index)</dt>
    <dd>Erwartete S&amp;P-Volatilität, 30 Tage. &lt;15 ruhig · 15–20 normal · 20–25 nervös · 25–30 Stress · &gt;30 Panik.</dd>
    <dt>Breadth</dt>
    <dd>Anteil positiver SPDR-Sektoren (0–100%). Hoch = breit grün, niedrig = wenige Sektoren tragen den Markt.</dd>
    <dt>DXY (US-Dollar-Index)</dt>
    <dd>USD gegen Korb (EUR/JPY/GBP). Steigend = USD-Stärke = oft Gegenwind für Tech und Risk-Assets.</dd>
    <dt>DTE (Days to Earnings)</dt>
    <dd>Tage bis Earnings-Release. DTE = 0 ist Earnings-Tag. DTE = 0,1,2 sind Peak-Window-Skip-Zone.</dd>
    <dt>R-R (Risk-Reward)</dt>
    <dd>Verhältnis Target-Profit zu Stop-Verlust. R-R 2 = Target bringt doppelt so viel wie Stop kostet.</dd>
    <dt>ISIN</dt>
    <dd>Eindeutige Wertpapier-Kennung. DE000… = deutsche Hebelscheine. IE00…/LU00… = ETFs in EUR.</dd>
  </dl>
</section>

<section class="methodik-section">
  <div class="section-label">Wichtig</div>
  <h2>Was das Daily Oracle <em>nicht</em> ist</h2>
  <p>PYTHAI ist <strong>Publisher für Trading-Wissen</strong>, kein Anlageberater. Das Daily Oracle liefert <strong>Setups mit Begründung</strong> — strukturierte Lesart von Markt-Daten, Catalysts und Live-Bedingungen. Wir sagen dir nicht „kauf X". Wir zeigen dir warum etwas interessant aussieht und unter welchen Bedingungen.</p>
  <p>Die Sizing-Entscheidung — wie groß du gehst — liegt vollständig bei dir. Wir kennen deine Position nicht. Wir kennen dein Risiko-Budget nicht. Wir kennen deine restliche Allokation nicht.</p>
  <p><strong>Confidence-Werte sind modellbasierte Schätzungen</strong>, keine Eintrittswahrscheinlichkeiten. Vergangene Wertentwicklungen sind kein verlässlicher Indikator. Der Handel mit Aktien, ETFs, Crypto und gehebelten Produkten ist mit erheblichen Risiken bis zum Totalverlust verbunden.</p>
</section>`;

  function runShotFallback() {
    document.querySelectorAll(".screenshot img").forEach((img) => {
      img.addEventListener("error", () => {
        const fig = img.closest("figure"); if (!fig) return;
        const cap = fig.querySelector("figcaption");
        const ph = document.createElement("div");
        ph.className = "screenshot-ph";
        ph.textContent = T("Screenshot folgt", "Screenshot coming");
        img.replaceWith(ph); if (cap) cap.remove();
      });
    });
  }
  function Full() {
    useEffect(() => { runShotFallback(); }, []);
    return h("main", { dangerouslySetInnerHTML: { __html: CONTENT } });
  }
  function Loading() {
    return h("div", { style: { minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 22, color: "var(--text-oracle)" } }, T("Das Orakel prüft deinen Zugang…", "The oracle checks your access…"));
  }
  function Locked({ mode }) {
    var headline, sub, ctaLabel, ctaHref, showSignin = false;
    if (mode === "pending") {
      headline = T("Die Methodik lebt im Sanctum.", "The methodology lives in the sanctum.");
      sub = T("Dein Zugang wird gerade freigegeben. Sobald Warren dich bestätigt, liegt die Methodik hier offen.", "Your access is being approved. Once Warren confirms you, the methodology opens here.");
      ctaLabel = T("Zu meinem Konto", "To my account"); ctaHref = "account.html";
    } else if (mode === "observer") {
      headline = T("Die volle Methodik lebt im Inner Circle.", "The full methodology lives in the Inner Circle.");
      sub = T("Als Observer siehst du, worum es geht. Die ganze Methodik — Idea-Score, Execute-Confidence und alle Trade-Arten — ist dem Inner Circle vorbehalten.", "As an Observer you see the gist. The full methodology — idea score, execute confidence and every trade type — is reserved for the Inner Circle.");
      ctaLabel = T("Zum Inner Circle", "Go to Inner Circle"); ctaHref = "inner-circle.html";
    } else {
      headline = T("Die volle Methodik lebt im Inner Circle.", "The full methodology lives in the Inner Circle.");
      sub = T("Wie man das Daily Oracle liest — Idea-Score, Execute-Confidence und die Trade-Arten. Die volle Methodik ist dem Inner Circle vorbehalten.", "How to read the Daily Oracle — idea score, execute confidence and the trade types. The full methodology is reserved for the Inner Circle.");
      ctaLabel = T("Zum Inner Circle", "Go to Inner Circle"); ctaHref = "inner-circle.html"; showSignin = true;
    }
    return h("section", { style: { minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" } },
      h("div", { style: { maxWidth: 560 } },
        h("img", { src: "assets/logo/pythai-oculus.svg", alt: "", style: { width: 58, height: 58, margin: "0 auto 22px", opacity: 0.75 } }),
        h(PyEyebrow, null, "Methodik"),
        h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 40, margin: "8px 0 0", color: "var(--text-primary)" } }, headline),
        h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", margin: "16px 0 22px" } }, sub),
        h("div", { style: { position: "relative", margin: "4px 0 26px", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-oracle)", boxShadow: "0 0 30px var(--glow-oracle-soft)" } },
          h("img", { src: "assets/methodik/trade-pills.png?v=2", alt: "", style: { width: "100%", display: "block", filter: "blur(3px) brightness(0.8) saturate(1.1)", transform: "scale(1.04)" } }),
          h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,9,12,0.25) 0%, rgba(8,9,12,0) 35%, rgba(8,9,12,0.9) 100%)" } }),
          h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 18px" } },
            h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-oracle)", marginBottom: 6 } }, T("Vorschau", "Preview")),
            h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 } }, T("Idea-Score · Execute-Confidence · die Trade-Arten — mit Warrens Lesart.", "Idea score · execute confidence · the trade types — with Warren's read.")))),
        h(Button, { variant: "oracle", onClick: () => { window.location.href = ctaHref; } }, ctaLabel),
        showSignin && h("div", { style: { marginTop: 12 } }, h("a", { href: "register.html", style: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", textDecoration: "none" } }, T("Schon Mitglied? Anmelden →", "Already a member? Sign in →")))));
  }
  function App() {
    const PRIV = ["inner-circle", "circle-of-trust", "syndicate", "admin"];
    const [gate, setGate] = useState("loading");
    useEffect(() => {
      fetch(API + "/api/me", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        if (d && d.onboardingRequired) { window.location.href = "account.html"; return; }
        const approved = d && d.ok && d.approval === "approved";
        const full = approved && PRIV.indexOf(d.tier) !== -1;
        if (full) setGate("ok");          // Inner Circle und höher → volle Methodik
        else if (approved) setGate("observer"); // freigegebener Observer → Teaser + Upgrade
        else if (d && d.ok) setGate("pending");
        else setGate("anon");
      }).catch(() => setGate("anon"));
    }, []);
    return h("div", null,
      h(SiteNav, { active: "methodik.html" }),
      gate === "loading" ? h(Loading, null) : gate === "ok" ? h(Full, null) : h(Locked, { mode: gate }),
      h(SiteFooter, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
