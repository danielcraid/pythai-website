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

  // 11.08.2026: Inhalt zweisprachig. Vorher lag hier EIN deutscher Block —
  // ?lang=en zeigte damit weiter Deutsch, weil nur die Zugangs-Meldungen
  // uebersetzt waren. Jetzt waehlt T() zwischen zwei Fassungen.
  const CONTENT_DE = `<!-- ===================== HERO ===================== -->
<section class="methodik-hero">
  <div class="eyebrow">Methodik</div>
  <h1>Wie PYTHAI arbeitet</h1>
  <p class="lead">Ein redaktioneller Marktkommentar in drei Zeitebenen. Nichts wird
  behauptet, was sich nicht nachrechnen lässt — und nichts wird empfohlen.</p>

  <div class="abschluss" style="margin-top:26px">
    <p><strong>Vorab, weil es den ganzen Text prägt:</strong> PYTHAI ist ein
    Publisher. Warren beschreibt, was am Markt geschieht, ordnet es ein und nennt
    die Zahlen, auf die er sich beruft. Er kennt weder dein Vermögen noch deine
    Steuern noch deine Lebenslage — und ohne die gibt niemand seriös einen Rat.
    Was hier steht, ist Marktkommentar, keine Anlageberatung und keine Empfehlung
    zum Kauf, Verkauf oder Halten.</p>
  </div>
</section>

<!-- ===================== 0 · DREI FLAECHEN ===================== -->
<section class="methodik-section">
  <div class="section-label">Der Überblick</div>
  <h2>Drei Flächen, drei Zeithorizonte</h2>

  <p>PYTHAI beantwortet nicht eine Frage, sondern drei — und sie haben verschiedene
  Uhren. Wer alles über einen Kamm schert, verwechselt Wetter mit Jahreszeit.</p>

  <div class="dual-bucket" style="grid-template-columns:1fr">
    <div class="bucket idea">
      <div class="bucket-label">Daily Oracle · Tage bis Wochen</div>
      <div class="bucket-question">„Was ist heute bemerkenswert, und wie belastbar ist die Einordnung?"</div>
      <p>Jeden Handelsmorgen eine bewertete Lesart des Marktes und eine kurze Liste
      beobachteter Situationen — mit den Kursmarken, auf die der Text sich bezieht,
      und der ausdrücklichen Angabe, wie belastbar die Einordnung an diesem Tag ist.</p>
    </div>
    <div class="bucket execute">
      <div class="bucket-label">Thesen · Wochen bis Monate</div>
      <div class="bucket-question">„Trägt die Begründung, die ich aufgeschrieben habe, noch?"</div>
      <p>Was du selbst notierst, wird beobachtet. Du schreibst die These und setzt
      deine Marken; PYTHAI vergleicht sie laufend mit Nachrichtenlage und Kursverlauf
      und meldet, wenn etwas dagegenspricht — auch dann, wenn der Kurs gerade
      freundlich aussieht.</p>
    </div>
    <div class="bucket long">
      <div class="bucket-label">Langfrist-Thesen · Jahre</div>
      <div class="bucket-question">„Wie weit ist eine Struktur von ihrem Ziel abgewichen?"</div>
      <p>Die Betrachtungsweise für Vermögen, das nicht gehandelt, sondern gehalten
      wird. Hier zählt nicht der Tag, sondern der Abstand zu einer festgelegten
      Zielstruktur — dargestellt in Bändern, nicht in Nachkommastellen.</p>
    </div>
  </div>

  <div class="why-box">
    Die drei Ebenen werden bewusst getrennt gehalten. Eine Beobachtung aus dem
    Morgen wird nicht dadurch zur Langfrist-Betrachtung, dass sie gut lief. Und eine
    langfristige Struktur wird nicht dadurch fragwürdig, dass sie eine Woche
    schwächelt.
  </div>
</section>

<!-- ===================== 1 · DER MORGEN ===================== -->
<section class="methodik-section">
  <div class="section-label">Fläche eins</div>
  <h2>Der Morgen — wie man das Daily Oracle liest</h2>

  <p>Jede beobachtete Situation trägt <strong>zwei</strong> redaktionelle
  Bewertungen, und der häufigste Lesefehler ist, sie zu verwechseln. Die eine
  bewertet die Konstellation an sich. Die andere, wie belastbar sie an diesem Tag
  ist. Beide sind Einschätzungen der Redaktion, keine Handlungsanweisung.</p>

  <div class="dual-bucket">
    <div class="bucket idea">
      <div class="bucket-label">Idea-Score</div>
      <div class="bucket-question">„Wie stimmig wäre diese Konstellation unter idealen Bedingungen?"</div>
      <p>Die Qualität der Situation an sich: Verhältnis von Chance und Risiko,
      Klarheit des Auslösers, Substanz der Begründung. Zeitlos betrachtet.</p>
    </div>
    <div class="bucket execute">
      <div class="bucket-label">Execute-Confidence</div>
      <div class="bucket-question">„Wie belastbar ist die Einordnung <strong>heute</strong>?"</div>
      <p>Die Lage genau jetzt: Marktumfeld, Liquidität, Nähe zu Terminen,
      Preisabstand. Rein gegenwärtig.</p>
    </div>
  </div>

  <p>Die beiden Achsen zusammen ergeben vier Lesarten. <strong>Beide hoch</strong>
  ist der seltene Fall: stimmige Konstellation, und die Bedingungen sprechen heute
  nicht dagegen. <strong>Erste hoch, zweite niedrig</strong> heißt, die Konstellation
  überzeugt, das Umfeld an diesem Tag nicht — solche Situationen führt Warren auf
  einer Beobachtungsliste weiter, mit der Bedingung, unter der er sie erneut
  aufgreift. <strong>Erste niedrig</strong> heißt schlicht, dass die Begründung
  dünn ist.</p>
  <p class="hint">Was daraus folgt, entscheidest ausschließlich du. Die Skalen
  beschreiben Warrens Einschätzung, nicht deinen nächsten Schritt.</p>

  <h4>Sechs Stufen, für beide Skalen dieselben</h4>
  <div class="confidence-stripe">
    <div class="bucket-step" data-color="green">HIGHEST<small>sehr hoch</small></div>
    <div class="bucket-step" data-color="lightgold">HIGH<small>hoch</small></div>
    <div class="bucket-step" data-color="gold">MEDIUM<small>mittel</small></div>
    <div class="bucket-step" data-color="orange">LOW<small>niedrig</small></div>
    <div class="bucket-step" data-color="blue">WATCH<small>beobachten</small></div>
    <div class="bucket-step" data-color="red">AVOID<small>meiden</small></div>
  </div>
  <p class="hint">Dieselbe Skala für beide Achsen, damit sie sich nebeneinander lesen
  lassen, ohne umzurechnen. „AVOID" ist die schärfste Stufe der Einordnung — sie
  beschreibt, dass Warren die Konstellation für nicht tragfähig hält.</p>

  <h3>Was der Morgen sonst noch mitteilt</h3>
  <p>Über den beobachteten Situationen steht eine Einordnung des Marktes: <strong>Bull</strong>,
  <strong>Sideways</strong> oder <strong>Bear</strong>. Sie stammt aus gemessenen
  Marktdaten — Schwankungserwartung und Marktbreite — nicht aus einer Stimmung.
  Steht dort <em>Sideways</em>, heißt das nicht „nichts passiert", sondern: keine
  Richtung trägt heute von allein.</p>

  <h3>Wie eine Situation ausscheidet, bevor sie im Text landet</h3>
  <p>Zwischen der ersten Notiz und der fertigen Ausgabe liegen mehrere unabhängige
  Prüfungen. Eine davon ist ausdrücklich <strong>gegen</strong> die eigene Vorlage
  gebaut: sie vergleicht jede genannte Zahl mit Live-Daten, prüft, ob der Auslöser
  bereits im Kurs steckt, und sucht das Risiko, das im Entwurf fehlt.</p>
  <p>Diese Prüfung kann eine Situation <strong>nur abstufen oder streichen</strong>,
  nie hinzufügen und nie hochstufen. Ein falscher Einwand führt damit höchstens
  dazu, dass etwas Erwähnenswertes fehlt — er kann nichts Fragwürdiges in die
  Ausgabe hineinbringen.</p>
  <div class="why-box">
    Deshalb ist eine kurze Ausgabe kein Zeichen von Nachlässigkeit. An manchen Tagen
    bleibt wenig übrig, und das ist das Ergebnis, nicht sein Ausbleiben.
  </div>

  <h3>Instrumentenarten, die vorkommen</h3>
  <p>Warren benennt, über welche Art von Wertpapier eine Situation überhaupt
  abgebildet würde — denn dieselbe Beobachtung bedeutet je nach Instrument etwas
  völlig anderes. Die Risikoklasse gehört zur Beschreibung, nicht zu einer
  Empfehlung.</p>

  <table class="skim-table">
    <thead><tr><th>Art</th><th>Wofür</th><th>Risiko</th></tr></thead>
    <tbody>
      <tr><td><strong>Aktie · Long</strong></td><td>Direkte Beteiligung, kein Hebel, kein Verfall.</td><td>moderat</td></tr>
      <tr><td><strong>Aktie · Short</strong></td><td>Gegenrichtung ohne Hebel. Verlust nach oben offen.</td><td>hoch</td></tr>
      <tr><td><strong>ETF</strong></td><td>Ein Korb statt eines Namens — Sektor, Region, Thema.</td><td>moderat</td></tr>
      <tr><td><strong>ETC</strong></td><td>Rohstoff über ein Wertpapier abgebildet.</td><td>moderat bis hoch</td></tr>
      <tr><td><strong>Knock-out</strong></td><td>Hebel mit fester Schwelle. Wird sie berührt, verfällt das Papier — sofort und vollständig.</td><td>höchste</td></tr>
      <tr><td><strong>Optionsschein</strong></td><td>Hebel mit Laufzeit. Verliert auch dann Wert, wenn sich nichts bewegt.</td><td>höchste</td></tr>
      <tr><td><strong>Crypto</strong></td><td>Durchgehender Handel, keine Schlusskurse, eigene Ausschläge.</td><td>höchste</td></tr>
      <tr><td><strong>Forex</strong></td><td>Währungspaare, stark von Zinsentscheidungen getrieben.</td><td>hoch</td></tr>
    </tbody>
  </table>

  <div class="why-box">
    Die Risikoklasse steht an jeder beschriebenen Situation. Sie ist keine Warnung im
    Kleingedruckten, sondern Teil der Aussage: derselbe Gedanke ist als Aktie eine
    ruhige Sache und als Knock-out eine ganz andere.
  </div>
</section>

<!-- ===================== 2 · DIE THESEN ===================== -->
<section class="methodik-section">
  <div class="section-label">Fläche zwei</div>
  <h2>Die Thesen — dein Tagebuch, laufend gegengelesen</h2>

  <p>Diese Fläche gehört dir, nicht Warren. Du notierst eine Beobachtung, schreibst
  in eigenen Worten auf, <em>warum</em> du sie verfolgst und <em>woran</em> du
  merken würdest, dass die Begründung nicht mehr trägt. Du setzt auch die Marken.
  PYTHAI schlägt nichts davon vor.</p>

  <p>Ab da liest PYTHAI mit. Nachrichtenlage, Kursverlauf und der Abstand zu deinen
  eigenen Marken ergeben einen Zustand, den du auf einen Blick siehst. Der Zustand
  ist eine Beobachtung über deine Notiz — kein Urteil darüber, was du tun solltest.</p>

  <h4>Die Zustände</h4>
  <p style="margin-bottom:6px">
    <span class="zust z-stark">Stark</span>
    <span class="zust z-intakt">Intakt</span>
    <span class="zust z-skim">Skim-Chance</span>
    <span class="zust z-wackelt">Wackelt</span>
    <span class="zust z-broken">Gebrochen</span>
  </p>

  <table class="skim-table">
    <tbody>
      <tr><td><strong>Stark</strong></td><td>Die Begründung hat sich seit dem Einstieg bestätigt, nicht nur gehalten.</td></tr>
      <tr><td><strong>Intakt</strong></td><td>Nichts spricht dagegen. Der Normalfall — die meisten Notizen stehen die meiste Zeit hier.</td></tr>
      <tr><td><strong>Skim-Chance</strong></td><td>Aussage über den <em>Kurs</em>, nicht über die Begründung: der Kurs hat die Teilverkaufs-Marke erreicht, die du selbst eingetragen hast.</td></tr>
      <tr><td><strong>Wackelt</strong></td><td>Etwas widerspricht der aufgeschriebenen Begründung, ohne sie zu erledigen. PYTHAI benennt, was.</td></tr>
      <tr><td><strong>Gebrochen</strong></td><td>Der Grund, den du aufgeschrieben hast, gilt nach der beobachteten Faktenlage nicht mehr. Unabhängig davon, wie der Kurs gerade steht.</td></tr>
    </tbody>
  </table>

  <div class="why-box">
    <strong>Gebrochen</strong> und <strong>im Gewinn</strong> schließen sich nicht
    aus — das ist der wichtigste Satz auf dieser Seite. Ein Kurs kann aus Gründen
    steigen, die mit der aufgeschriebenen Begründung nichts zu tun haben. Die
    Unterscheidung sichtbar zu halten, ist der Zweck dieser Fläche. Was daraus
    folgt, bleibt deine Entscheidung.
  </div>

  <h3>Warum die Liste begrenzt ist</h3>
  <p>Die Beobachtungsliste hat eine Obergrenze. Nicht aus technischen Gründen,
  sondern weil Aufmerksamkeit die knappe Größe ist: <strong>ein neuer Platz kostet
  einen alten</strong>. Eine Situation muss also nicht nur stimmig sein, sondern
  stimmiger als die schwächste, die bereits geführt wird. Eine Liste ohne
  Obergrenze wird zur Sammlung.</p>

  <h3>Deine Marken, in Vielfachen des Risikos</h3>
  <p>Zu jeder Notiz kannst du vier Marken hinterlegen: <strong>Einstieg</strong>,
  <strong>Stop</strong>, <strong>Teilverkauf</strong> und <strong>Ziel</strong>.
  Alle vier trägst du selbst ein — PYTHAI schlägt keine vor und ändert keine.</p>
  <p>Angezeigt werden sie nicht in Prozent, sondern in Vielfachen des Abstands
  zwischen Einstieg und Stop. Diese Einheit heißt R. Ein Ziel bei zwei R liegt
  doppelt so weit entfernt wie der Stop. Der Vorteil ist nur einer, aber ein
  großer: Kurse verschiedener Größenordnung werden dadurch vergleichbar.</p>
  <p>Erreicht der Kurs eine deiner Marken, meldet PYTHAI das als Tatsache. Was
  daraufhin geschieht, entscheidest und veranlasst ausschließlich du bei deiner
  Bank.</p>
</section>

<!-- ===================== 3 · LANGFRIST ===================== -->
<section class="methodik-section">
  <div class="section-label">Fläche drei</div>
  <h2>Langfrist-Thesen — das norwegische Prinzip</h2>

  <p>Der norwegische Staatsfonds verwaltet das Öl-Vermögen eines Landes für
  Generationen. Sein Verfahren ist öffentlich und beinahe langweilig: eine breit
  gestreute Zielstruktur, festgelegte Anteile je Anlageklasse, nachgezogen wenn sie
  auseinanderlaufen — und keine Meinung zum nächsten Quartal. Kein Timing, kein
  Ausstieg bei Gegenwind, kein Nachlegen bei Begeisterung.</p>

  <p>Genau diese Betrachtungsweise bildet die dritte Fläche ab. Nicht als Gegenteil
  der Tagesbeobachtung, sondern als ihre andere Zeitebene: <strong>eine Struktur,
  die bewusst nicht bewegt wird.</strong> PYTHAI stellt sie dar und misst
  Abweichungen — Zielstruktur und Bänder legst du fest.</p>

  <div class="callout-example">
    <div class="callout-label">Nur zur Veranschaulichung der Anzeige</div>
    <p>Damit klar wird, was die Darstellung zeigt, ein frei erfundenes Zahlenbeispiel:
    eine Struktur aus <strong>60 % Aktien</strong>, <strong>30 % Anleihen</strong>
    und <strong>10 % Geldmarkt</strong>, innerhalb der Aktienquote unterteilt in
    Bausteine wie Welt, Europa und Schwellenländer.</p>
    <p>Zu jedem Baustein gehört ein <strong>Band</strong> — eine Toleranz um den
    Zielwert. Liegt die tatsächliche Gewichtung darin, wird nichts gemeldet.
    Verlässt sie das Band, erscheint der Abstand als Zahl. Ohne Ausrufezeichen und
    ohne Vorschlag, was zu tun wäre.</p>
    <p class="hint" style="margin-top:14px">Diese Zahlen sind erfunden und dienen
    ausschließlich der Erklärung der Anzeige. Sie sind weder ein reales Depot noch
    eine empfohlene Aufteilung. Welche Struktur zu wem passt, hängt von Umständen
    ab, die PYTHAI nicht kennt.</p>
  </div>

  <h3>Warum hier nicht tagesaktuell bewertet wird</h3>
  <p>Diese Ebene beantwortet die Frage nach dem Abstand zur Zielstruktur.
  Diese Abweichung bewegt sich in Monaten, nicht in Stunden. Eine minütliche
  Bewertung würde eine Genauigkeit vortäuschen, die die Frage gar nicht hat — und
  ein Rauschen erzeugen, das zum Handeln einlädt, bei einem Depot, dessen ganzer
  Zweck das Nichthandeln ist.</p>
  <p>Deshalb: <strong>Bewertung zum Stichtag.</strong> Das Datum steht in der ersten
  Zeile der Anzeige, nicht im Kleingedruckten, damit niemand die Zahlen für heutig
  hält. Und Abweichungen erscheinen als Bänder — „zwei Punkte über Ziel, innerhalb
  der Toleranz" statt einer Nachkommastelle, die auf quartalsalten Daten Präzision
  behauptet.</p>

  <div class="why-box">
    Warren sagt es kürzer: <em>„Ich jage das Wetter nicht. Ich lese die
    Jahreszeiten."</em>
  </div>
</section>

<!-- ===================== 4 · GLOSSAR ===================== -->
<section class="methodik-section">
  <div class="section-label">Nachschlagen</div>
  <h2>Begriffe, die im Briefing vorkommen</h2>
  <table class="skim-table">
    <tbody>
      <tr><td><strong>VIX</strong></td><td>Erwartete Schwankung des S&amp;P über 30 Tage. Unter 15 ruhig · 15–20 normal · 20–25 nervös · 25–30 Stress · über 30 Panik.</td></tr>
      <tr><td><strong>Breadth</strong></td><td>Anteil der US-Sektoren im Plus. Hoch heißt breit getragen, niedrig heißt: wenige Namen ziehen den Markt.</td></tr>
      <tr><td><strong>DXY</strong></td><td>US-Dollar gegen einen Währungskorb. Steigend bedeutet Dollarstärke — oft Gegenwind für Technologie und riskante Anlagen.</td></tr>
      <tr><td><strong>DTE</strong></td><td>Tage bis zur Quartalszahl. Null ist der Tag selbst; die Tage unmittelbar davor werden bewusst gemieden.</td></tr>
      <tr><td><strong>R und R-R</strong></td><td>R ist der Abstand zwischen Einstieg und Stop, also dein Risiko in einer Einheit. R-R setzt das Ziel dazu ins Verhältnis.</td></tr>
      <tr><td><strong>Skim</strong></td><td>Teilverkauf nach einem Lauf. Sichert einen Teil, lässt den Rest arbeiten.</td></tr>
      <tr><td><strong>Band</strong></td><td>Toleranzbereich um eine Zielgewichtung. Innerhalb passiert nichts.</td></tr>
      <tr><td><strong>Stichtag</strong></td><td>Datum, auf das sich eine Bewertung bezieht. Steht immer dabei.</td></tr>
      <tr><td><strong>ISIN</strong></td><td>Eindeutige Kennnummer eines Wertpapiers. Zwei Papiere mit ähnlichem Namen sind selten dasselbe.</td></tr>
    </tbody>
  </table>
</section>

<!-- ===================== 5 · WAS ES NICHT IST ===================== -->
<section class="methodik-section">
  <div class="section-label">Die Grenze</div>
  <h2>Was PYTHAI nicht ist</h2>
  <div class="abschluss">
    <p><strong>Keine Anlageberatung, keine Empfehlung, keine Vermittlung.</strong>
    PYTHAI ist ein Publisher: die Inhalte sind redaktioneller Marktkommentar,
    gerichtet an alle Leser gleichermaßen und nicht auf eine einzelne Person
    zugeschnitten. Sie berücksichtigen weder Vermögen noch Erfahrung, Steuerlage
    oder Anlageziele — und ohne diese Angaben ist eine Empfehlung weder möglich
    noch zulässig.</p>
    <p><strong>Keine Verwaltung, keine Ausführung.</strong> PYTHAI führt kein
    Depot, hält kein Geld, hat keinen Zugriff auf Konten und löst keine Order
    aus. Jede Ausführung veranlasst du selbst, bei deiner Bank, in deinem Namen
    und auf deine Verantwortung.</p>
    <p><strong>Kein persoenlicher Bezug in den Zuständen.</strong> Die Zustände
    an deinen Notizen — intakt, wackelt, gebrochen — beschreiben, ob die von DIR
    aufgeschriebene Begründung mit der beobachteten Faktenlage zusammenpasst. Sie
    sind eine Beobachtung über deinen Text, kein Urteil über eine
    Anlageentscheidung.</p>
    <p><strong>Keine Gewähr für Richtigkeit.</strong> Warren ist eine künstliche
    Intelligenz. Er arbeitet mit Werkzeugen und Live-Daten statt aus dem
    Gedächtnis, und kann trotzdem irren — in den Daten, in der Einordnung, in der
    Sprache. Zahlen sind vor einer eigenen Entscheidung immer selbst zu prüfen.</p>
    <p><strong>Kein Versprechen auf Ertrag.</strong> Vergangene Verläufe sagen
    nichts über künftige. Verluste sind möglich; bei Hebelprodukten der
    Totalverlust des eingesetzten Betrags.</p>
  </div>
  </section>`;

  const CONTENT_EN = `<!-- ===================== HERO ===================== -->
<section class="methodik-hero">
  <div class="eyebrow">Methodology</div>
  <h1>How PYTHAI works</h1>
  <p class="lead">Editorial market commentary across three time horizons. Nothing is
  claimed that cannot be recalculated — and nothing is recommended.</p>

  <div class="abschluss" style="margin-top:26px">
    <p><strong>First, because it shapes everything below:</strong> PYTHAI is a
    publisher. Warren describes what is happening in the market, places it in
    context and names the figures he relies on. He knows neither your assets nor
    your tax situation nor your circumstances — and without those, nobody gives
    sound advice. What follows is market commentary, not investment advice and not
    a recommendation to buy, sell or hold.</p>
  </div>
</section>

<!-- ===================== 0 · THREE SURFACES ===================== -->
<section class="methodik-section">
  <div class="section-label">The overview</div>
  <h2>Three surfaces, three clocks</h2>

  <p>PYTHAI does not answer one question but three — and they run on different
  clocks. Treating them alike is how weather gets mistaken for season.</p>

  <div class="dual-bucket" style="grid-template-columns:1fr">
    <div class="bucket idea">
      <div class="bucket-label">Daily Oracle · days to weeks</div>
      <div class="bucket-question">„What is notable today, and how solid is the reading?"</div>
      <p>Every trading morning: a scored reading of the market and a short list of
      observed situations — with the price levels the text refers to, and an
      explicit statement of how solid that reading is on this particular day.</p>
    </div>
    <div class="bucket execute">
      <div class="bucket-label">Theses · weeks to months</div>
      <div class="bucket-question">„Does the reasoning I wrote down still hold?"</div>
      <p>What you note yourself is what gets watched. You write the thesis and set
      your own levels; PYTHAI continuously compares them against news flow and price
      action and reports when something contradicts them — including when the price
      happens to look friendly.</p>
    </div>
    <div class="bucket long">
      <div class="bucket-label">Long-term theses · years</div>
      <div class="bucket-question">„How far has a structure drifted from its target?"</div>
      <p>The way of looking at capital that is held rather than traded. Here the day
      does not matter; the distance to a defined target structure does — shown in
      bands, not in decimal places.</p>
    </div>
  </div>

  <div class="why-box">
    The three levels are kept deliberately separate. An observation from the morning
    does not become a long-term consideration by having worked out. And a long-term
    structure does not become questionable because it wobbles for a week.
  </div>
</section>

<!-- ===================== 1 · THE MORNING ===================== -->
<section class="methodik-section">
  <div class="section-label">Surface one</div>
  <h2>The morning — how to read the Daily Oracle</h2>

  <p>Every observed situation carries <strong>two</strong> editorial scores, and the
  most common misreading is to confuse them. One rates the constellation itself. The
  other rates how solid it is on this day. Both are assessments by the editorial
  side, not instructions.</p>

  <div class="dual-bucket">
    <div class="bucket idea">
      <div class="bucket-label">Idea score</div>
      <div class="bucket-question">„How coherent would this constellation be under ideal conditions?"</div>
      <p>The quality of the situation itself: the balance of opportunity and risk,
      the clarity of the trigger, the substance of the reasoning. Considered
      timelessly.</p>
    </div>
    <div class="bucket execute">
      <div class="bucket-label">Execute confidence</div>
      <div class="bucket-question">„How solid is the reading <strong>today</strong>?"</div>
      <p>The situation right now: market environment, liquidity, proximity to
      scheduled events, distance to price. Purely of the moment.</p>
    </div>
  </div>

  <p>Read together, the two axes give four cases. <strong>Both high</strong> is the
  rare one: a coherent constellation, and today's conditions do not argue against
  it. <strong>First high, second low</strong> means the constellation convinces but
  the environment does not — Warren carries such situations on a watch list, with
  the condition under which he would return to them. <strong>First low</strong>
  simply means the reasoning is thin.</p>
  <p class="hint">What follows from that is entirely yours to decide. The scales
  describe Warren's assessment, not your next step.</p>

  <h4>Six steps, the same for both scales</h4>
  <div class="confidence-stripe">
    <div class="bucket-step" data-color="green">HIGHEST<small>very high</small></div>
    <div class="bucket-step" data-color="lightgold">HIGH<small>high</small></div>
    <div class="bucket-step" data-color="gold">MEDIUM<small>medium</small></div>
    <div class="bucket-step" data-color="orange">LOW<small>low</small></div>
    <div class="bucket-step" data-color="blue">WATCH<small>watch</small></div>
    <div class="bucket-step" data-color="red">AVOID<small>avoid</small></div>
  </div>
  <p class="hint">The same scale on both axes, so they can be read side by side
  without conversion. „AVOID" is the sharpest step of the assessment — it states
  that Warren considers the constellation unsound.</p>

  <h3>What else the morning states</h3>
  <p>Above the observed situations sits a reading of the market:
  <strong>Bull</strong>, <strong>Sideways</strong> or <strong>Bear</strong>. It comes
  from measured market data — expected volatility and market breadth — not from a
  mood. <em>Sideways</em> does not mean „nothing is happening"; it means no
  direction is carrying the day on its own.</p>

  <h3>How a situation drops out before it reaches the text</h3>
  <p>Between the first note and the finished edition sit several independent checks.
  One of them is built explicitly <strong>against</strong> the draft: it compares
  every figure named with live data, tests whether the trigger is already in the
  price, and looks for the risk the draft omits.</p>
  <p>That check can <strong>only downgrade or remove</strong> a situation, never add
  one and never raise it. A wrong objection therefore costs at most something worth
  mentioning — it cannot introduce anything questionable into the edition.</p>
  <div class="why-box">
    So a short edition is not a sign of neglect. On some days little survives, and
    that is the result, not its absence.
  </div>

  <h3>Instrument types that appear</h3>
  <p>Warren names the kind of security a situation would even be expressed through —
  because the same observation means something entirely different depending on the
  instrument. The risk class is part of the description, not part of a
  recommendation.</p>

  <table class="skim-table">
    <thead><tr><th>Type</th><th>What for</th><th>Risk</th></tr></thead>
    <tbody>
      <tr><td><strong>Equity · long</strong></td><td>Direct participation, no leverage, no expiry.</td><td>moderate</td></tr>
      <tr><td><strong>Equity · short</strong></td><td>The opposite direction without leverage. Loss is open-ended to the upside.</td><td>high</td></tr>
      <tr><td><strong>ETF</strong></td><td>A basket instead of a single name — sector, region, theme.</td><td>moderate</td></tr>
      <tr><td><strong>ETC</strong></td><td>A commodity expressed through a security.</td><td>moderate to high</td></tr>
      <tr><td><strong>Knock-out</strong></td><td>Leverage with a fixed barrier. Touch it and the instrument expires — immediately and completely.</td><td>highest</td></tr>
      <tr><td><strong>Warrant</strong></td><td>Leverage with a maturity. Loses value even when nothing moves.</td><td>highest</td></tr>
      <tr><td><strong>Crypto</strong></td><td>Continuous trading, no closing prices, its own amplitude.</td><td>highest</td></tr>
      <tr><td><strong>Forex</strong></td><td>Currency pairs, driven heavily by rate decisions.</td><td>high</td></tr>
    </tbody>
  </table>

  <div class="why-box">
    The risk class sits on every situation described. It is not a warning in the fine
    print but part of the statement: the same idea is a quiet matter as an equity and
    an entirely different one as a knock-out.
  </div>
</section>

<!-- ===================== 2 · THE THESES ===================== -->
<section class="methodik-section">
  <div class="section-label">Surface two</div>
  <h2>The theses — your journal, continuously cross-read</h2>

  <p>This surface belongs to you, not to Warren. You note an observation, write in
  your own words <em>why</em> you are following it and <em>what</em> would tell you
  the reasoning no longer holds. You also set the levels. PYTHAI proposes none of
  it.</p>

  <p>From then on PYTHAI reads along. News flow, price action and the distance to
  your own levels produce a state you can see at a glance. The state is an
  observation about your note — not a verdict on what you should do.</p>

  <h4>The states</h4>
  <p style="margin-bottom:6px">
    <span class="zust z-stark">Strong</span>
    <span class="zust z-intakt">Intact</span>
    <span class="zust z-skim">Skim opportunity</span>
    <span class="zust z-wackelt">Wobbling</span>
    <span class="zust z-broken">Broken</span>
  </p>

  <table class="skim-table">
    <tbody>
      <tr><td><strong>Strong</strong></td><td>The reasoning has been confirmed since entry, not merely held.</td></tr>
      <tr><td><strong>Intact</strong></td><td>Nothing argues against it. The normal case — most notes sit here most of the time.</td></tr>
      <tr><td><strong>Skim opportunity</strong></td><td>A statement about the <em>price</em>, not the reasoning: the price has reached the partial-exit level you entered yourself.</td></tr>
      <tr><td><strong>Wobbling</strong></td><td>Something contradicts the written reasoning without ending it. PYTHAI names what.</td></tr>
      <tr><td><strong>Broken</strong></td><td>The reason you wrote down no longer holds against the observed facts. Regardless of where the price stands.</td></tr>
    </tbody>
  </table>

  <div class="why-box">
    <strong>Broken</strong> and <strong>in profit</strong> are not mutually exclusive
    — that is the most important sentence on this page. A price can rise for reasons
    that have nothing to do with the reasoning you wrote down. Keeping that
    distinction visible is the purpose of this surface. What follows from it remains
    your decision.
  </div>

  <h3>Why the list is capped</h3>
  <p>The watch list has an upper limit. Not for technical reasons but because
  attention is the scarce quantity: <strong>a new slot costs an old one</strong>. A
  situation therefore has to be not merely coherent but more coherent than the
  weakest one already carried. A list without a cap becomes a collection.</p>

  <h3>Your levels, in multiples of risk</h3>
  <p>Each note can carry four levels: <strong>entry</strong>, <strong>stop</strong>,
  <strong>partial exit</strong> and <strong>target</strong>. You enter all four
  yourself — PYTHAI proposes none and changes none.</p>
  <p>They are displayed not as percentages but as multiples of the distance between
  entry and stop. That unit is called R. A target at two R sits twice as far away as
  the stop. The advantage is only one, but a large one: prices of very different
  magnitudes become comparable.</p>
  <p>When the price reaches one of your levels, PYTHAI reports it as a fact. What
  happens next is decided and executed exclusively by you, at your bank.</p>
</section>

<!-- ===================== 3 · LONG TERM ===================== -->
<section class="methodik-section">
  <div class="section-label">Surface three</div>
  <h2>Long-term theses — the Norwegian principle</h2>

  <p>Norway's sovereign wealth fund manages a country's oil wealth across
  generations. Its method is public and close to boring: a broadly diversified
  target structure, fixed shares per asset class, pulled back when they drift apart
  — and no opinion about the next quarter. No timing, no exit into a headwind, no
  adding on enthusiasm.</p>

  <p>That way of looking at things is what the third surface represents. Not as the
  opposite of daily observation but as its other time scale: <strong>a structure
  that is deliberately not moved.</strong> PYTHAI displays it and measures deviations
  — the target structure and the bands are yours to define.</p>

  <div class="callout-example">
    <div class="callout-label">Illustration of the display only</div>
    <p>To make clear what the display shows, a freely invented set of figures: a
    structure of <strong>60 % equities</strong>, <strong>30 % bonds</strong> and
    <strong>10 % money market</strong>, with the equity share divided into building
    blocks such as world, Europe and emerging markets.</p>
    <p>Each block carries a <strong>band</strong> — a tolerance around its target.
    While the actual weight sits inside it, nothing is reported. Once it leaves the
    band, the distance appears as a number. Without an exclamation mark and without
    a suggestion of what to do.</p>
    <p class="hint" style="margin-top:14px">These figures are invented and serve
    solely to explain the display. They are neither a real portfolio nor a
    recommended allocation. Which structure suits whom depends on circumstances
    PYTHAI does not know.</p>
  </div>

  <h3>Why nothing here is valued intraday</h3>
  <p>This level answers the question of distance to a target structure. That distance
  moves in months, not in hours. Minute-by-minute valuation would imply a precision
  the question does not have — and produce noise that invites action, in a portfolio
  whose entire purpose is inaction.</p>
  <p>Hence: <strong>valuation as of a reporting date.</strong> The date sits in the
  first line of the display, not in the fine print, so that nobody mistakes the
  figures for today's. And deviations appear as bands — „two points above target,
  inside tolerance" rather than a decimal place claiming precision on
  quarter-old data.</p>

  <div class="why-box">
    Warren puts it more briefly: <em>„I do not chase the weather. I read the
    seasons."</em>
  </div>
</section>

<!-- ===================== 4 · GLOSSARY ===================== -->
<section class="methodik-section">
  <div class="section-label">Reference</div>
  <h2>Terms that appear in the briefing</h2>
  <table class="skim-table">
    <tbody>
      <tr><td><strong>VIX</strong></td><td>Expected 30-day volatility of the S&amp;P. Below 15 calm · 15–20 normal · 20–25 nervous · 25–30 stressed · above 30 panic.</td></tr>
      <tr><td><strong>Breadth</strong></td><td>Share of US sectors trading up. High means broadly carried; low means a few names are pulling the market.</td></tr>
      <tr><td><strong>DXY</strong></td><td>The US dollar against a basket of currencies. Rising means dollar strength — often a headwind for technology and risk assets.</td></tr>
      <tr><td><strong>DTE</strong></td><td>Days to the earnings release. Zero is the day itself; the days immediately before are deliberately avoided.</td></tr>
      <tr><td><strong>R and R-R</strong></td><td>R is the distance between entry and stop — your risk as one unit. R-R sets the target in relation to it.</td></tr>
      <tr><td><strong>Skim</strong></td><td>A partial exit after a run. Secures part of it, leaves the rest working.</td></tr>
      <tr><td><strong>Band</strong></td><td>Tolerance around a target weight. Inside it, nothing is reported.</td></tr>
      <tr><td><strong>Reporting date</strong></td><td>The date a valuation refers to. Always stated.</td></tr>
      <tr><td><strong>ISIN</strong></td><td>The unique identifier of a security. Two instruments with similar names are rarely the same thing.</td></tr>
    </tbody>
  </table>
</section>

<!-- ===================== 5 · WHAT IT IS NOT ===================== -->
<section class="methodik-section">
  <div class="section-label">The boundary</div>
  <h2>What PYTHAI is not</h2>
  <div class="abschluss">
    <p><strong>Not investment advice, not a recommendation, not brokerage.</strong>
    PYTHAI is a publisher: the content is editorial market commentary, addressed to
    all readers alike and not tailored to any individual. It takes no account of
    assets, experience, tax position or investment objectives — and without those a
    recommendation is neither possible nor permissible.</p>
    <p><strong>No management, no execution.</strong> PYTHAI runs no portfolio, holds
    no money, has no access to accounts and places no orders. Every execution is
    initiated by you, at your bank, in your name and on your responsibility.</p>
    <p><strong>No personal bearing in the states.</strong> The states on your notes —
    intact, wobbling, broken — describe whether the reasoning YOU wrote down still
    fits the observed facts. They are an observation about your text, not a judgement
    about an investment decision.</p>
    <p><strong>No warranty of accuracy.</strong> Warren is an artificial
    intelligence. He works with tools and live data rather than from memory, and can
    still be wrong — in the data, in the reading, in the language. Figures are to be
    verified independently before any decision of your own.</p>
    <p><strong>No promise of return.</strong> Past performance says nothing about
    what follows. Losses are possible; with leveraged products, the total loss of the
    amount invested.</p>
  </div>
</section>
`;

  const CONTENT = T(CONTENT_DE, CONTENT_EN);

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
