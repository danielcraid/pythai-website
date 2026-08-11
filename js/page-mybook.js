(() => {
  const { Button } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PySection, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const API = "https://api.pythai.ch";
  const { useState, useEffect, useRef } = React;
  const h = React.createElement;
  // Auto-Refresh nur während Börsenzeiten (Europe/Berlin), TZ-robust
  const inMarketHours = () => {
    try {
      const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
      const wd = p.find((x) => x.type === "weekday").value;
      if (wd === "Sat" || wd === "Sun") return false;
      const t = parseInt(p.find((x) => x.type === "hour").value, 10) * 60 + parseInt(p.find((x) => x.type === "minute").value, 10);
      return t >= 480 && t <= 1350; // 08:00–22:30
    } catch (e) { return true; }
  };
  const PRIV = ["syndicate", "admin"];
  const MAX = 12;
  // Thesen-Health-Farben · spiegelt config/thesis_label_enum.json (GEBROCHEN..STARK)
  const Z = ["#E0726B", "#CF7A4E", "#9BA3B2", "#6FCF9A", "#7DD49A"];
  const ZONE = ["GEBROCHEN", "WACKELT", "NEUTRAL", "INTAKT", "STARK"];
  const wpct = (s) => Math.max(3, Math.min(97, Math.round((s + 1) / 2 * 100)));
  // deutsche Zahl-Strings ("1.218,80") → Number fürs Backend; leer → null
  const deNum = (s) => { if (s == null || String(s).trim() === "") return null; const n = parseFloat(String(s).replace(/\s/g, "").replace(/\./g, "").replace(",", ".")); return isNaN(n) ? null : n; };
  const statusText = (p) => ZONE[p.zone - 1] + " " + (p.score >= 0 ? "+" : "−") + Math.abs(p.score).toFixed(1);
  // Position-Risk (4-Level) getrennt von Thesen-Stärke (5-Level). Decision-Tree -> 1 konsolidierte Pill.
  const POSR = ["stopped", "danger", "caution", "safe"];
  const POSCOL = ["#C4524C", "#CF7A4E", "#C9A24E", "#6FCF9A"];
  const posLabel = (l) => ({ stopped: T("Gestoppt", "Stopped"), danger: T("Gefahr", "Danger"), caution: T("Vorsicht", "Caution"), safe: T("Sicher", "Safe") }[String(l || "").toLowerCase()] || (l || "—"));
  const thesisLabelOf = (p) => String(p.waage_label || ZONE[((p.zone || 3) - 1)] || "").toUpperCase();
  // Reine Thesen-Stärke als Pill (für die Simple-Ansicht: wackelt vs. intakt auf einen Blick).
  const TH_META = { GEBROCHEN: { l: T("Gebrochen", "Broken"), c: "#E0726B" }, WACKELT: { l: T("Wackelt", "Wobbling"), c: "#CF7A4E" }, NEUTRAL: { l: T("Neutral", "Neutral"), c: "#9BA3B2" }, INTAKT: { l: T("Intakt", "Intact"), c: "#6FCF9A" }, STARK: { l: T("Stark", "Strong"), c: "#7DD49A" } };
  const thesisPill = (p) => TH_META[thesisLabelOf(p)] || TH_META.NEUTRAL;
  // Status-Pill: Backend ist authoritative (p.status.key). Fallback nutzt live>entry (NICHT position_risk_score).
  const PILLMETA = {
    STOPPED: { cls: "st-red", l: T("Gestoppt", "Stopped"), t: T("Stop berührt — Position physisch geschlossen.", "Stop touched — position physically closed.") },
    ACTION: { cls: "st-red", l: T("Aktion erforderlich", "Action required"), t: T("These gebrochen. Du entscheidest.", "Thesis broken. Your call.") },
    POSITION: { cls: "st-orange", l: T("Positions-Risiko", "Position risk"), t: T("Position läuft gegen dich. Stop-Nähe oder Drawdown ab 5 %.", "Position running against you. Near stop or drawdown 5%+.") },
    SKIM: { cls: "st-yellow", l: T("Skim-Chance", "Skim chance"), t: T("Im Plus, aber Catalyst wackelt. Klassischer Skim-Moment.", "In profit but the catalyst is wobbling. Classic skim moment.") },
    DRIFT: { cls: "st-orange", l: T("Wackelt", "Wobbling"), t: T("Position negativ + Story bröckelt. Schau hin.", "Position negative + story crumbling. Look.") },
    STARK: { cls: "st-greenS", l: T("Stark", "Strong"), t: T("Im Plus, Story bestätigt.", "In profit, story confirmed.") },
    INTAKT: { cls: "st-green", l: T("Intakt", "Intact"), t: T("Story trägt.", "Story holds.") }
  };
  // 11.08.2026: Tagesveraenderung aus dem Feld, das die API seit dem BFM-Umbau
  // mitliefert (mybook.mjs setzt change_pct_today aus der Live-Quote).
  const tagesTrend = (p) => {
    const n = (p && p.change_pct_today != null) ? Number(p.change_pct_today) : null;
    if (n == null || !isFinite(n)) return null;
    const dir = n > 0 ? 1 : n < 0 ? -1 : 0;
    return {
      str: (n >= 0 ? "+" : "\u2212") + Math.abs(n).toFixed(2).replace(".", ",") + " %",
      arrow: dir > 0 ? "\u25B2" : dir < 0 ? "\u25BC" : "\u2014",
      cls: dir > 0 ? "up" : dir < 0 ? "dn" : "flat"
    };
  };
  // Verweildauer aus created_at (Notion-Anlage). Kein Datum -> kein Text; eine
  // erfundene Zahl waere schlimmer als eine fehlende.
  const tageSeit = (p) => {
    const q = p && (p.created_at || p.db_created_at);
    if (!q) return null;
    const d = new Date(q);
    if (isNaN(d.getTime())) return null;
    const tage = Math.floor((Date.now() - d.getTime()) / 86400000);
    return tage < 0 ? null : tage;
  };
  const tageSeitText = (n) => n === 0 ? T("seit heute", "since today")
    : n === 1 ? T("seit 1 Tag", "since 1 day")
    : T("seit " + n + " Tagen", "since " + n + " days");

  // Eine Wahrheit fuer beide Einstiege: Einfach-Ansicht und Detail-Karte oeffnen
  // denselben Chat mit demselben Text.
  const askWarrenTopic = (p) => {
    if (typeof window.PYchatOpen !== "function") return;
    const lbl = thesisPill(p).l;
    window.PYchatOpen(T(
      "Lass uns \u00FCber mein Topic \u201E" + p.name + "\u201C (" + (p.isin || "?") + ") sprechen \u2014 These aktuell \u201E" + lbl + "\u201C. Wie steht sie da, und was w\u00E4re jetzt klug zu beobachten?",
      "Let's talk about my topic \u201E" + p.name + "\u201C (" + (p.isin || "?") + ") \u2014 thesis currently \u201E" + lbl + "\u201C. How is it holding up, and what should I watch now?"));
  };

  const parseDeNum = (s) => { if (s == null) return null; if (typeof s === "number") return isFinite(s) ? s : null; const n = parseFloat(String(s).replace(/\./g, "").replace(",", ".")); return isFinite(n) ? n : null; };
  const statusKeyOf = (p) => {
    if (p.status && p.status.key) return String(p.status.key).toUpperCase();
    const thesis = thesisLabelOf(p);
    const pos = String(p.position_risk_label || "").toLowerCase();
    const liveN = parseDeNum(p.live), entryN = parseDeNum(p.entry);
    const inProfit = (liveN != null && entryN != null && entryN > 0) ? liveN > entryN : null;
    if (pos === "stopped") return "STOPPED";
    if (thesis === "GEBROCHEN") return "ACTION";
    if (pos === "danger") return "POSITION";
    if (thesis === "WACKELT" && inProfit === true) return "SKIM";
    if (thesis === "WACKELT") return "DRIFT";
    if (thesis === "STARK" && inProfit === true) return "STARK";
    return "INTAKT";
  };
  const consolidatedStatus = (p) => { const m = PILLMETA[statusKeyOf(p)] || PILLMETA.INTAKT; return { cls: m.cls, label: m.l, tip: m.t }; };
  // Exit-Leiter (Edge-Out): Entry/Stop/Ziel/Skim als R-Vielfache + % mit "Stand"-Marker
  function MbLadder(p) {
    const entry = parseDeNum(p.entry), stop = parseDeNum(p.stop), live = parseDeNum(p.live), target = parseDeNum(p.target);
    if (entry == null || entry <= 0) return h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ash, #8b93a1)", padding: "4px 2px" } }, T("Kein Entry hinterlegt — trag Entry/Stop/Ziel ein, dann erscheint die Leiter.", "No entry on file — add entry/stop/target and the ladder appears."));
    const isShort = /short/i.test(p.art || "");
    const R = (stop != null) ? Math.abs(entry - stop) : null;
    const prof = (x) => (isShort ? entry - x : x - entry);
    const fmtNum = (x) => Number(x).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fmtPct = (x) => { const v = prof(x) / entry * 100; return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1).replace(".", ",") + " %"; };
    const fmtR = (x) => { if (!R) return "—"; const v = prof(x) / R; return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2).replace(".", ",") + " R"; };
    const skims = String(p.skim_levels || p.skim || "").split(/[,;·\/]/).map((s) => parseDeNum(s)).filter((x) => x != null && x > 0);
    const rows = [];
    if (target != null) rows.push({ k: "tgt", lab: T("Ziel", "Target"), price: target, kind: "win" });
    skims.forEach((s, i) => rows.push({ k: "sk" + i, lab: "Skim " + (i + 1), price: s, kind: "win" }));
    rows.push({ k: "en", lab: "Entry", price: entry, kind: "entry" });
    if (stop != null) rows.push({ k: "st", lab: "Stop", price: stop, kind: "stop" });
    if (live != null) rows.push({ k: "now", lab: T("Stand", "Now"), price: live, kind: "now" });
    rows.sort((a, b) => prof(b.price) - prof(a.price));
    const col = (r) => r.kind === "now" ? "var(--oracle-b, #D4A94E)" : r.kind === "stop" ? "#E0726B" : r.kind === "entry" ? "var(--ash, #8b93a1)" : "#67B07E";
    const dotc = (r) => r.kind === "now" ? "var(--oracle-b, #D4A94E)" : r.kind === "stop" ? "#E0726B" : r.kind === "entry" ? "var(--steel, #6b7280)" : "#67B07E";
    const N = rows.length;
    return h("div", { style: { margin: "6px 0 10px" } },
      R ? h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ash, #8b93a1)", padding: "0 2px 10px", letterSpacing: "0.02em" } }, "R = " + fmtNum(R) + " " + (p.currency || "EUR")) : null,
      rows.map((r, i) => h("div", { key: r.k, style: { display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 7px", borderRadius: 7, background: r.kind === "now" ? "rgba(212,169,78,0.12)" : "transparent", boxShadow: r.kind === "now" ? "inset 0 0 0 1px var(--oracle-b, #D4A94E)" : "none" } },
        h("div", { style: { position: "relative", flex: "0 0 18px", alignSelf: "stretch" } },
          i > 0 ? h("div", { style: { position: "absolute", left: "50%", top: 0, height: "50%", width: 2, transform: "translateX(-50%)", background: "var(--line, #242a33)" } }) : null,
          i < N - 1 ? h("div", { style: { position: "absolute", left: "50%", top: "50%", bottom: 0, width: 2, transform: "translateX(-50%)", background: "var(--line, #242a33)" } }) : null,
          h("div", { style: { position: "absolute", left: "50%", top: "50%", width: r.kind === "now" ? 11 : 8, height: r.kind === "now" ? 11 : 8, borderRadius: "50%", background: dotc(r), transform: "translate(-50%,-50%)" } })),
        h("span", { style: { flex: "1 1 auto", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-ui)", fontSize: 14, color: r.kind === "now" ? "var(--oracle-b, #D4A94E)" : "var(--parch, #e8e4da)", fontWeight: (r.kind === "now" || r.kind === "entry") ? 700 : 400 } }, r.lab),
        h("span", { style: { flex: "0 0 auto", minWidth: 56, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ash, #8b93a1)" } }, fmtNum(r.price)),
        h("span", { style: { flex: "0 0 auto", minWidth: 52, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12.5, color: col(r) } }, r.kind === "entry" ? "0 %" : fmtPct(r.price)),
        h("span", { style: { flex: "0 0 auto", minWidth: 52, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12.5, fontWeight: 700, color: col(r) } }, r.kind === "entry" ? "0 R" : fmtR(r.price)))));
  }
  function PosBar({ p }) {
    const lab = String(p.position_risk_label || "").toLowerCase();
    const idx = POSR.indexOf(lab);
    // Pfeil in die Mitte des Label-Segments (diskrete 4er-Skala) — NICHT per kontinuierlichem pct, sonst Farbe unter Pfeil != Label.
    const pct = idx >= 0 ? (idx + 0.5) / 4 * 100 : 50;
    const col = idx >= 0 ? POSCOL[idx] : "var(--ash)";
    return h("div", { className: "mini" },
      h("div", { className: "mk-row" }, h("span", { className: "arrow", style: { left: pct + "%" } }, "▼")),
      h("div", { className: "bar" }, POSCOL.map((c, i) => h("span", { key: i, style: { background: c } }))),
      h("div", { className: "lab", style: { color: col } }, posLabel(lab)));
  }

  const CSS = `
  #mb-root{ --void:var(--bg-base); --raised:var(--bg-raised); --card:var(--bg-surface); --line:var(--border-subtle); --parch:var(--parchment); --mist:var(--text-secondary); --ash:var(--text-muted); --oracle-b:var(--oracle-bright); --ox-b:#E0726B; --bull:var(--bull-bright); --input:var(--bg-input);
    --z1:#C4524C; --z2:#CF7A4E; --z3:#C9A24E; --z4:#6FB07A; --z5:#6FCF9A; }
  #mb-root .toolbar{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;}
  #mb-root .rep{display:flex;align-items:center;gap:10px;font-family:var(--font-ui);font-size:14px;color:var(--mist);cursor:pointer;}
  #mb-root h2.mb{font-family:var(--font-oracle);font-weight:400;font-size:30px;margin:6px 0 18px;color:var(--parch);}
  #mb-root .vtog{display:inline-flex;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
  #mb-root .vtog button{background:none;border:none;padding:7px 13px;font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ash);cursor:pointer;}
  #mb-root .vtog button.on{background:var(--grad-gold);color:var(--text-on-gold);}
  #mb-root .simplelist{display:flex;flex-direction:column;border-top:1px solid var(--line);}
  #mb-root .srow{display:flex;align-items:center;justify-content:space-between;gap:14px;width:100%;padding:15px 4px;border-bottom:1px solid var(--line);cursor:pointer;}
  #mb-root .srow:hover{background:#13161C;}
  #mb-root .sleft{display:flex;align-items:center;gap:12px;min-width:0;}
  #mb-root .sdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
  #mb-root .sdot.o{background:var(--oracle);} #mb-root .sdot.s{background:#9F7BCB;}
  #mb-root .sname{min-width:0;}
  #mb-root .sname .nm{font-family:var(--font-oracle);font-size:18px;color:var(--parch);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  #mb-root .sname .px{font-family:var(--font-mono);font-size:12px;color:var(--ash);margin-top:2px;}
  /* 11.08.2026 (Daniel): Einfach-Ansicht zeigt Art, Produkt, Zahlen mit Verweildauer,
     These und "Warren fragen" — Werte 1:1 aus der Shortlist uebernommen, damit beide
     Listen dieselbe Sprache sprechen. */
  #mb-root .sname .art{font-family:var(--font-mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--bull, #4FA578);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  #mb-root .spct{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;font-family:var(--font-mono);font-size:11px;margin-top:3px;}
  #mb-root .spct .pxv{color:var(--ash);font-size:12px;}
  #mb-root .spct .up{color:var(--bull);} #mb-root .spct .dn{color:var(--ox-b);} #mb-root .spct .flat{color:var(--steel);}
  #mb-root .spct .miss{color:var(--steel);}
  #mb-root .spct .sep{color:var(--line);}
  #mb-root .spct .hist{color:var(--ash);}
  #mb-root .sask{font-family:var(--font-ui);font-size:12px;font-weight:600;color:var(--oracle-b);background:rgba(212,169,78,.06);border:1px solid rgba(212,169,78,.5);border-radius:999px;padding:6px 13px;cursor:pointer;white-space:nowrap;}
  #mb-root .sask:hover{background:rgba(212,169,78,.14);}
  /* Drei Zeilen links, deshalb oben ausrichten statt mittig schwimmen lassen. */
  #mb-root .srow.tall{align-items:flex-start;}
  #mb-root .srow.tall .sleft{align-items:flex-start;}
  #mb-root .srow.tall .sdot{margin-top:6px;}
  #mb-root .srow.tall .sright{align-self:center;}
  /* Mobil: umbrechen statt den Namen zu quetschen. Ohne diese Regel schrumpft
     der Name, weil .sright flex-shrink:0 traegt — lange ETF-Namen brechen dann ab. */
  @media(max-width:560px){
    #mb-root .srow, #mb-root .srow.tall{flex-direction:column;align-items:stretch;gap:11px;padding:14px 2px 16px;}
    #mb-root .srow.tall .sright, #mb-root .sright{align-self:flex-start;flex-wrap:wrap;}
    #mb-root .sname .nm{white-space:normal;overflow:visible;line-height:1.18;}
    #mb-root .sname .art{white-space:normal;}
  }
  @media(max-width:390px){ #mb-root .spct{flex-direction:column;gap:2px;} }
  /* ============================================================
     FLAECHE DREI · Langfrist-Thesen (AP6.4)
     Die ruhigste Flaeche des Produkts. Kein Alarm-Rot, keine
     Nachkommastellen-Parade, keine Handlungsaufforderung.
     Vertrag: workspace/intake/FLAECHE3-FE-VERTRAG-2026-08-12.md
     ============================================================ */
  #mb-root .lt{margin:56px 0 0;padding-top:30px;border-top:1px solid var(--line);}
  #mb-root .lt-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;flex-wrap:wrap;}
  #mb-root .lt-title{font-family:var(--font-oracle);font-weight:400;font-size:27px;color:var(--parch);margin:0;}
  #mb-root .lt-eyebrow{font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--oracle);margin-bottom:7px;}
  #mb-root .lt-sw{display:flex;align-items:center;gap:11px;flex:0 0 auto;padding-top:4px;}
  #mb-root .lt-sw span{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);}
  #mb-root .lt-lead{font-family:var(--font-ui);font-size:14px;line-height:1.65;color:var(--text-secondary,#9BA3B2);margin:12px 0 0;max-width:640px;}

  /* Stand-Zeile: erste Zeile, nicht Kleingedrucktes (AP6.2) */
  #mb-root .lt-stand{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:22px 0 4px;font-family:var(--font-mono);font-size:12.5px;color:var(--parch);}
  #mb-root .lt-stand .alt{color:var(--ash);font-size:11.5px;}
  #mb-root .lt-stand .depot{color:var(--ash);font-size:11px;letter-spacing:.06em;}
  #mb-root .lt-warn{font-family:var(--font-ui);font-size:12px;color:var(--ash);margin:0 0 18px;}

  #mb-root .lt-grp{margin:24px 0 0;}
  #mb-root .lt-grp-t{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash);margin:0 0 8px;}
  #mb-root .lt-row{display:flex;align-items:baseline;justify-content:space-between;gap:14px;padding:11px 2px;border-bottom:1px solid var(--line);}
  #mb-root .lt-row .satz{font-family:var(--font-ui);font-size:14px;line-height:1.5;color:var(--mist);min-width:0;}
  #mb-root .lt-row .satz b{color:var(--parch);font-weight:600;}
  #mb-root .lt-row .marke{font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;flex:0 0 auto;color:var(--ash);}
  #mb-root .lt-row .marke.aus{color:#E7A062;}
  #mb-root .lt-row.b-aus{background:rgba(207,122,78,.05);}

  #mb-root .lt-mehr{background:none;border:none;padding:9px 0 0;cursor:pointer;font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;color:var(--oracle-b);}
  #mb-root .lt-mehr:hover{color:var(--oracle);}

  /* Leer-Zustand: ehrlich, kein leeres Geruest */
  #mb-root .lt-leer{background:var(--card,#15181E);border:1px solid var(--line);border-left:3px solid #6FCF9A;border-radius:0 10px 10px 0;padding:24px 26px;margin-top:20px;}
  #mb-root .lt-leer h4{font-family:var(--font-oracle);font-weight:400;font-size:21px;color:var(--parch);margin:0 0 10px;}
  #mb-root .lt-leer p{font-family:var(--font-ui);font-size:13.5px;line-height:1.7;color:var(--text-secondary,#9BA3B2);margin:0 0 11px;}
  #mb-root .lt-leer p:last-child{margin:0;}
  #mb-root .lt-leer .bald{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);margin-top:14px;}

  /* Fehler: NIEMALS als "kein Depot" ausgeben */
  #mb-root .lt-fehler{background:rgba(224,114,107,.06);border:1px solid rgba(224,114,107,.3);border-left:3px solid var(--ox-b);border-radius:0 10px 10px 0;padding:18px 22px;margin-top:20px;font-family:var(--font-ui);font-size:13.5px;line-height:1.65;color:var(--parch);}

  #mb-root .lt-fuss{font-family:var(--font-ui);font-size:12px;line-height:1.7;color:var(--ash);margin:22px 0 0;max-width:640px;}

  @media(max-width:560px){
    #mb-root .lt-row{flex-direction:column;gap:5px;}
    #mb-root .lt-row .marke{align-self:flex-start;}
    #mb-root .lt-head{flex-direction:column;}
  }
  /* --- B1 · Ziel-Editor (AP6.5) --- */
  #mb-root .ze{background:var(--card,#15181E);border:1px solid var(--line);border-left:3px solid var(--oracle);border-radius:0 10px 10px 0;padding:24px 26px;margin:20px 0 0;}
  #mb-root .ze-kopf{display:flex;align-items:baseline;justify-content:space-between;gap:14px;}
  #mb-root .ze-kopf h4{font-family:var(--font-oracle);font-weight:400;font-size:22px;color:var(--parch);margin:0;}
  #mb-root .ze-zu{background:none;border:none;padding:0;cursor:pointer;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);}
  #mb-root .ze-zu:hover{color:var(--mist);}
  #mb-root .ze-lead{font-family:var(--font-ui);font-size:13.5px;line-height:1.65;color:var(--text-secondary,#9BA3B2);margin:10px 0 0;max-width:600px;}

  #mb-root .ze-grp{margin:24px 0 0;}
  #mb-root .ze-grp-t{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--oracle);margin:0 0 10px;}
  #mb-root .ze-row{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--line);flex-wrap:wrap;}
  #mb-root .ze-name{font-family:var(--font-ui);font-size:14px;color:var(--parch);flex:1 1 190px;min-width:0;}
  #mb-root .ze-f{display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;}
  #mb-root .ze-f span{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);}
  #mb-root .ze-f i{font-family:var(--font-mono);font-size:11px;color:var(--ash);font-style:normal;}
  #mb-root .ze-f input{width:66px;background:var(--input,#1D212A);border:1px solid var(--line);border-radius:6px;color:var(--parch);font-family:var(--font-mono);font-size:13px;padding:7px 9px;text-align:right;}
  #mb-root .ze-f input:focus{outline:none;border-color:var(--oracle);}
  #mb-root .ze-weg{background:none;border:none;padding:0;cursor:pointer;font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;color:var(--ash);flex:0 0 auto;}
  #mb-root .ze-weg:hover{color:var(--ox-b);}
  #mb-root .ze-fest{font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;color:var(--line);flex:0 0 auto;}

  #mb-root .ze-summe{font-family:var(--font-ui);font-size:13px;color:#E7A062;margin:12px 0 0;}
  #mb-root .ze-summe.ok{color:var(--bull);}
  #mb-root .ze-leer{font-family:var(--font-ui);font-size:13px;line-height:1.6;color:var(--ash);margin:0;}

  #mb-root .ze-hinzu{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:14px 0 0;}
  #mb-root .ze-hinzu span{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);}
  #mb-root .ze-hinzu button{background:none;border:1px solid var(--line);border-radius:999px;color:var(--mist);font-family:var(--font-ui);font-size:12px;padding:5px 12px;cursor:pointer;}
  #mb-root .ze-hinzu button:hover{border-color:var(--oracle);color:var(--oracle-b);}

  /* --- B4 · Vorlagen (AP6.5) --- */
  #mb-root .ze-vor{margin:20px 0 0;padding:16px 18px;background:rgba(255,255,255,.017);border:1px solid var(--line);border-left:3px solid var(--line);border-radius:0 8px 8px 0;}
  #mb-root .ze-vor-t{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash);margin:0 0 4px;}
  #mb-root .ze-vor-pflicht{font-family:var(--font-ui);font-size:12.5px;line-height:1.6;color:var(--mist);margin:0 0 13px;}
  #mb-root .ze-vor-liste{display:flex;gap:10px;flex-wrap:wrap;}
  #mb-root .ze-vor-k{flex:1 1 190px;text-align:left;background:none;border:1px solid var(--line);border-radius:8px;padding:11px 13px;cursor:pointer;}
  #mb-root .ze-vor-k:hover{border-color:var(--oracle);}
  #mb-root .ze-vor-k.an{border-color:var(--oracle);background:rgba(212,169,78,.05);}
  #mb-root .ze-vor-k b{display:block;font-family:var(--font-ui);font-weight:600;font-size:13.5px;color:var(--parch);margin:0 0 4px;}
  #mb-root .ze-vor-k span{display:block;font-family:var(--font-mono);font-size:11px;line-height:1.55;color:var(--text-secondary,#9BA3B2);}
  #mb-root .ze-vor-quelle{font-family:var(--font-ui);font-size:12.5px;line-height:1.6;color:var(--text-secondary,#9BA3B2);margin:13px 0 0;}

  #mb-root .ze-meld{border-radius:0 8px 8px 0;padding:13px 16px;margin:20px 0 0;font-family:var(--font-ui);font-size:13px;line-height:1.6;}
  #mb-root .ze-meld.offen{background:rgba(212,169,78,.07);border-left:3px solid var(--oracle);color:var(--parch);}
  #mb-root .ze-meld.fehler{background:rgba(224,114,107,.07);border-left:3px solid var(--ox-b);color:var(--parch);}
  #mb-root .ze-meld.gut{background:rgba(111,207,154,.07);border-left:3px solid var(--bull);color:var(--parch);}

  #mb-root .ze-fuss{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin:22px 0 0;}
  #mb-root .ze-abbr{background:none;border:none;padding:0;cursor:pointer;font-family:var(--font-ui);font-size:13px;color:var(--ash);}
  #mb-root .ze-abbr:hover{color:var(--mist);}
  #mb-root .ze-hinweis{font-family:var(--font-ui);font-size:12px;line-height:1.6;color:var(--ash);margin:16px 0 0;}

  @media(max-width:560px){
    #mb-root .ze{padding:20px 18px;}
    #mb-root .ze-name{flex:1 1 100%;}
  }
  /* --- B2 · Positions-Editor + B7 · Produktbeispiele --- */
  #mb-root .pe-kopfzeile{display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin:20px 0 0;}
  #mb-root .pe-kopfzeile input[type=date]{background:var(--input,#1D212A);border:1px solid var(--line);border-radius:6px;color:var(--parch);font-family:var(--font-mono);font-size:13px;padding:7px 9px;}
  #mb-root .pe-modus{display:inline-flex;align-items:center;gap:8px;cursor:pointer;}
  #mb-root .pe-modus span{font-family:var(--font-ui);font-size:13px;color:var(--mist);}
  #mb-root .pe-warn{font-family:var(--font-ui);font-size:12.5px;line-height:1.6;color:var(--oracle-b);background:rgba(212,169,78,.06);border-left:3px solid var(--oracle);border-radius:0 8px 8px 0;padding:11px 14px;margin:14px 0 0;}
  #mb-root .pe-liste{margin:18px 0 0;}
  #mb-root .pe-row{padding:14px 0;border-bottom:1px solid var(--line);}
  #mb-root .pe-oben{display:flex;gap:10px;flex-wrap:wrap;}
  #mb-root .pe-oben input{background:var(--input,#1D212A);border:1px solid var(--line);border-radius:6px;color:var(--parch);font-family:var(--font-ui);font-size:13.5px;padding:8px 11px;}
  #mb-root .pe-oben input:focus{outline:none;border-color:var(--oracle);}
  #mb-root .pe-name{flex:1 1 260px;min-width:0;}
  #mb-root .pe-isin.ungueltig{border-color:rgba(224,114,107,.7) !important;}
  #mb-root .pe-isin{flex:0 0 170px;font-family:var(--font-mono) !important;font-size:12.5px !important;letter-spacing:.04em;}
  #mb-root .pe-unten{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:9px;}
  #mb-root .pe-unten select{background:var(--input,#1D212A);border:1px solid var(--line);border-radius:6px;color:var(--parch);font-family:var(--font-ui);font-size:12.5px;padding:7px 9px;}
  #mb-root .pe-unten select:focus{outline:none;border-color:var(--oracle);}
  #mb-root .pe-bsp{background:none;border:1px solid var(--line);border-radius:999px;color:var(--mist);font-family:var(--font-ui);font-size:12px;padding:5px 12px;cursor:pointer;}
  #mb-root .pe-bsp:hover{border-color:var(--oracle);color:var(--oracle-b);}
  #mb-root .pe-plus{background:none;border:1px dashed var(--line);border-radius:8px;color:var(--mist);font-family:var(--font-ui);font-size:13px;padding:10px 16px;cursor:pointer;margin:16px 0 0;width:100%;}
  #mb-root .pe-plus:hover{border-color:var(--oracle);color:var(--oracle-b);}

  #mb-root .bs{background:var(--void);border:1px solid var(--line);border-radius:8px;padding:16px 18px;margin:12px 0 4px;}
  #mb-root .bs-kopf{display:flex;align-items:baseline;justify-content:space-between;gap:12px;}
  #mb-root .bs-t{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--oracle);}
  #mb-root .bs-label{font-family:var(--font-ui);font-size:12px;line-height:1.6;color:var(--parch);background:rgba(212,169,78,.07);border-left:3px solid var(--oracle);border-radius:0 6px 6px 0;padding:10px 13px;margin:12px 0 14px;}
  #mb-root .bs-hin{font-family:var(--font-ui);font-size:12.5px;line-height:1.65;color:var(--ash);margin:12px 0 0;}
  #mb-root .bs-liste{display:flex;flex-direction:column;gap:12px;}
  #mb-root .bs-item{border:1px solid var(--line);border-radius:8px;padding:12px 14px;}
  #mb-root .bs-name{font-family:var(--font-ui);font-size:13.5px;font-weight:600;color:var(--parch);}
  #mb-root .bs-fakten{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:6px;}
  #mb-root .bs-fakten span{font-family:var(--font-mono);font-size:11px;color:var(--ash);}
  #mb-root .bs-fuss{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:10px;}
  #mb-root .bs-fuss code{font-family:var(--font-mono);font-size:11.5px;color:var(--steel);letter-spacing:.04em;}
  #mb-root .bs-nimm{background:none;border:1px solid rgba(212,169,78,.5);border-radius:999px;color:var(--oracle-b);font-family:var(--font-ui);font-size:12px;padding:5px 12px;cursor:pointer;}
  #mb-root .bs-nimm:hover{background:rgba(212,169,78,.12);}
  #mb-root .bs-sort{font-family:var(--font-ui);font-size:11.5px;color:var(--ash);margin:12px 0 0;}

  @media(max-width:560px){ #mb-root .pe-isin{flex:1 1 100%;} }
  #mb-root .sright{display:flex;align-items:center;gap:10px;flex-shrink:0;}
  #mb-root .slbl{font-family:var(--font-mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);}
  #mb-root .spill{font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border:1px solid currentColor;border-radius:999px;padding:5px 12px;white-space:nowrap;}
  @media(max-width:560px){ #mb-root .slbl{display:none;} }
  #mb-root .sw{width:46px;min-width:46px;max-width:46px;height:26px;box-sizing:border-box;display:inline-block;border-radius:999px;position:relative;flex:0 0 auto;cursor:pointer;padding:0;box-shadow:inset 0 1px 2px rgba(0,0,0,.4);}
  #mb-root .sw.on{background:rgba(212,169,78,.18);border:1px solid var(--oracle);box-shadow:0 0 14px -5px rgba(212,169,78,.7),inset 0 1px 2px rgba(0,0,0,.4);}
  #mb-root .sw.off{background:var(--input);border:1px solid var(--steel);}
  #mb-root .knob{width:18px;height:18px;border-radius:50%;position:absolute;top:3px;} #mb-root .sw.on .knob{left:25px;background:var(--oracle-b);} #mb-root .sw.off .knob{left:3px;background:var(--steel);}
  #mb-root .grp{border-left:3px solid var(--line);padding-left:18px;margin-bottom:34px;}
  #mb-root .grp.oracle{border-left-color:var(--oracle);}
  #mb-root .grp.self{border-left-color:#9F7BCB;}
  #mb-root .grp-head{display:flex;align-items:baseline;gap:12px;margin-bottom:4px;}
  #mb-root .grp-title{font-family:var(--font-oracle);font-size:23px;line-height:1.1;}
  #mb-root .grp.oracle .grp-title{color:var(--oracle-b);}
  #mb-root .grp.self .grp-title{color:#C4A2E8;}
  #mb-root .grp-sub{font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--ash);}
  #mb-root .grp-desc{font-family:var(--font-ui);font-size:13px;line-height:1.5;color:var(--mist);margin:0 0 14px;max-width:70ch;}
  #mb-root .grp.oracle .orow:hover{background:rgba(212,169,78,.06);}
  #mb-root .grp.self .orow:hover{background:rgba(159,123,203,.08);}
  #mb-root .list{--cols:64px minmax(0,1fr) 196px 330px 220px;--cgap:20px;}
  #mb-root .hdr{display:grid;grid-template-columns:var(--cols);gap:var(--cgap);align-items:end;padding:0 10px 12px 0;border-bottom:1px solid var(--line);}
  #mb-root .hdr .hc{font-family:var(--font-mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--ash);white-space:nowrap;overflow:hidden;}
  #mb-root .topic{border-bottom:1px solid var(--line);}
  #mb-root .orow{display:grid;grid-template-columns:var(--cols);gap:var(--cgap);align-items:center;padding:16px 10px 16px 0;cursor:pointer;}
  #mb-root .orow:hover{background:#13161C;}
  /* Geöffnetes Topic: nur hellerer Hintergrund (die farbige Linie liefert bereits die Gruppe ganz links). */
  #mb-root .topic.open,#mb-root .topic.open>.orow{background:#1E232B;}
  /* Grau bis zur Gruppenlinie links ziehen (Desktop, ohne Content zu verschieben). */
  #mb-root .topic.open{box-shadow:-18px 0 0 0 #1E232B;}
  #mb-root .c-mon{display:flex;align-items:center;gap:10px;justify-self:start;}
  #mb-root .c-topic{min-width:0;}
  #mb-root .c-act{justify-self:end;align-self:start;display:flex;flex-direction:column;align-items:flex-end;gap:9px;}
  #mb-root .mon-lbl{display:none;font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);}
  #mb-root .nm{font-family:var(--font-oracle);font-size:22px;line-height:1.08;color:var(--parch);}
  #mb-root .t-meta{display:flex;align-items:center;gap:8px;margin-top:5px;flex-wrap:wrap;}
  #mb-root .isin{font-family:var(--font-mono);font-size:12px;color:var(--parch);letter-spacing:.04em;}
  #mb-root .badge{font-family:var(--font-mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--mist);border:1px solid #2A2F39;border-radius:5px;padding:5px 9px;white-space:nowrap;}
  #mb-root .badge.long{color:var(--bull);border-color:rgba(111,207,154,.35);}
  #mb-root .badge.idx{border-radius:999px;font-size:8.5px;color:#7FB0E8;border-color:rgba(127,176,232,.45);background:rgba(127,176,232,.1);padding:4px 9px;}
  #mb-root .badge.src-oracle{border-radius:999px;font-size:8.5px;color:var(--oracle-b);border-color:rgba(212,169,78,.5);background:rgba(212,169,78,.1);padding:4px 9px;}
  #mb-root .badge.src-self{border-radius:999px;font-size:8.5px;color:#B58CE0;border-color:rgba(181,140,224,.5);background:rgba(181,140,224,.1);padding:4px 9px;}
  #mb-root .ar-pill{font-family:var(--font-mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;color:#F0A39C;border:1px solid rgba(224,114,107,.6);background:rgba(224,114,107,.14);border-radius:999px;padding:4px 9px;}
  #mb-root .ar-banner{border:1px solid rgba(224,114,107,.45);border-left:3px solid var(--ox-b);background:rgba(224,114,107,.07);border-radius:0 10px 10px 0;padding:16px 18px;margin-bottom:22px;}
  #mb-root .ar-head{font-family:var(--font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:var(--ox-b);}
  #mb-root .ar-reason{font-family:var(--font-ui);font-size:14px;line-height:1.5;color:var(--text-primary);margin:6px 0 14px;}
  #mb-root .ar-btns{display:flex;gap:9px;flex-wrap:wrap;}
  #mb-root .arb{font-family:var(--font-ui);font-size:12.5px;font-weight:600;border:1px solid var(--border-strong);background:transparent;color:var(--text-secondary);border-radius:7px;padding:8px 13px;cursor:pointer;}
  #mb-root .arb:hover{border-color:var(--border-oracle);color:var(--text-primary);}
  #mb-root .arb.keep{border-color:rgba(111,176,122,.5);color:var(--bull);} #mb-root .arb.close{border-color:rgba(224,114,107,.5);color:var(--ox-b);}
  #mb-root .arb.warren{border-color:rgba(212,169,78,.5);background:rgba(212,169,78,.1);color:var(--oracle-b);}
  #mb-root .cur{display:inline-block;margin-top:7px;font-family:var(--font-mono);font-size:9.5px;letter-spacing:.1em;color:var(--ash);border:1px solid var(--line);border-radius:4px;padding:2px 7px;}
  #mb-root .mks{display:flex;gap:12px;flex-wrap:wrap;}
  #mb-root .mk{display:flex;flex-direction:column;gap:3px;flex:0 0 72px;}
  #mb-root .mk .k{font-family:var(--font-mono);font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--steel);}
  #mb-root .mk .v{font-family:var(--font-mono);font-size:15px;color:var(--parch);}
  #mb-root .mk.stop .v{color:var(--ox-b);} #mb-root .mk.skim .v{color:var(--oracle);} #mb-root .mk.tgt .v{color:var(--bull);}
  #mb-root .vin{font-family:var(--font-mono);font-size:13px;width:64px;background:var(--input);border:1px solid var(--oracle);border-radius:4px;padding:3px 4px;color:var(--parch);outline:none;}
  #mb-root .bedit{font-family:var(--font-ui);font-size:12px;font-weight:600;border:1px solid rgba(212,169,78,.5);background:rgba(212,169,78,.1);color:var(--oracle-b);border-radius:7px;padding:6px 13px;cursor:pointer;white-space:nowrap;}
  #mb-root .bedit.saving{border-color:rgba(224,114,107,.6);background:rgba(224,114,107,.14);color:var(--ox-b);}
  #mb-root .det{font-family:var(--font-mono);font-size:11px;color:var(--oracle);white-space:nowrap;cursor:pointer;}
  #mb-root .det.x{font-size:21px;line-height:1;color:var(--mist);}
  #mb-root .det.x:hover{color:var(--parch);}
  #mb-root .mini{width:100%;max-width:188px;} #mb-root .mini .mk-row{position:relative;height:11px;} #mb-root .mini .arrow{position:absolute;transform:translateX(-50%);font-size:10px;color:var(--oracle-b);line-height:1;}
  #mb-root .mini .bar{display:flex;height:7px;border-radius:999px;overflow:hidden;} #mb-root .mini .bar span{flex:1;}
  #mb-root .mini .lab{font-family:var(--font-mono);font-size:11px;font-weight:700;margin-top:6px;}
  #mb-root .c-stat .cpill{display:inline-block;}
  #mb-root .cpill{font-family:var(--font-mono);font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;border-radius:999px;padding:6px 13px;white-space:nowrap;cursor:help;}
  #mb-root .cpill.st-red{color:#F0A39C;border:1px solid rgba(224,114,107,.55);background:rgba(224,114,107,.14);}
  #mb-root .cpill.st-orange{color:#E7A062;border:1px solid rgba(207,122,78,.55);background:rgba(207,122,78,.14);}
  #mb-root .cpill.st-yellow{color:#D8B85A;border:1px solid rgba(201,162,78,.55);background:rgba(201,162,78,.14);}
  #mb-root .cpill.st-green{color:#8FCBA0;border:1px solid rgba(111,176,122,.5);background:rgba(111,176,122,.12);}
  #mb-root .cpill.st-greenS{color:#6FCF9A;border:1px solid rgba(111,207,154,.6);background:rgba(111,207,154,.16);}
  #mb-root .statbars{margin-bottom:22px;max-width:340px;}
  /* Detail-Layout (Mockup): Bars-Reihe, Einschätzung-Box + Aktionen, Sektionen, Delete unten rechts. */
  #mb-root .statrow{display:flex;gap:34px;flex-wrap:wrap;align-items:flex-start;margin-bottom:24px;}
  #mb-root .stcol{flex:0 0 auto;min-width:190px;}
  #mb-root .statrow .tworow{flex:1;min-width:240px;margin-top:0;align-self:flex-start;}
  #mb-root .topgrid{display:grid;grid-template-columns:1fr 264px;gap:24px;align-items:start;}
  #mb-root .einsbox{border:1px solid var(--border-oracle);background:rgba(212,169,78,.06);border-radius:12px;padding:18px 20px;}
  #mb-root .einsbox .tlbl{margin-top:0;}
  #mb-root .einstext{font-family:var(--font-ui);font-size:15px;line-height:1.6;color:var(--parch);margin:8px 0 0;}
  #mb-root .einschk{font-family:var(--font-mono);font-size:10px;color:var(--ash);margin-top:12px;}
  #mb-root .actcol2{display:flex;flex-direction:column;gap:12px;}
  #mb-root .delrow{display:flex;justify-content:flex-start;margin-top:30px;}
  #mb-root .delrow .bdel{width:264px;max-width:100%;}
  @media(max-width:760px){ #mb-root .topgrid{grid-template-columns:1fr;} #mb-root .statrow{gap:18px;} #mb-root .actcol2{flex-direction:row;flex-wrap:wrap;} #mb-root .delrow{justify-content:flex-start;} }
  #mb-root .tworow{font-family:var(--font-mono);font-size:10px;line-height:1.5;color:var(--steel);margin-top:12px;}
  #mb-root .dwrap{padding:6px 0 28px;}
  #mb-root .sw.locked{opacity:.4;cursor:not-allowed;}
  #mb-root .mirror-row{display:flex;align-items:center;gap:12px;padding:11px 14px;border:1px solid var(--line);border-radius:10px;background:#1E232B;margin-bottom:20px;}
  #mb-root .dgrid{display:grid;grid-template-columns:var(--cols);gap:var(--cgap);align-items:start;}
  #mb-root .dcol-these{grid-column:3 / 5;grid-row:1;min-width:0;}
  #mb-root .dcol-act{grid-column:5 / 6;grid-row:1;justify-self:end;align-self:start;display:flex;flex-direction:column;gap:12px;width:100%;}
  #mb-root .tlbl{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--oracle);margin:18px 0 8px;} #mb-root .dcol-these .tlbl:first-child{margin-top:0;}
  #mb-root .these{font-family:var(--font-ui);font-size:15px;line-height:1.6;color:var(--parch);margin:0;max-width:64ch;}
  #mb-root .kill{font-family:var(--font-mono);font-size:13.5px;line-height:1.55;color:var(--ox-b);margin:0;} #mb-root .kill b{color:#F0A39C;font-weight:700;}
  #mb-root .bline{font-family:var(--font-ui);font-size:12.5px;font-weight:600;border:1px solid rgba(212,169,78,.5);border-radius:8px;padding:11px 14px;cursor:pointer;background:rgba(212,169,78,.08);color:var(--oracle-b);text-align:center;white-space:nowrap;}
  #mb-root .bline.chk{background:var(--grad-gold);color:var(--text-on-gold);border-color:transparent;} #mb-root .bline.chk:disabled{opacity:.7;cursor:wait;}
  #mb-root .bline.saving{opacity:.7;cursor:wait;}
  #mb-root .bdel{font-family:var(--font-ui);font-size:12.5px;font-weight:600;border:1px solid rgba(224,114,107,.45);border-radius:8px;padding:11px 14px;cursor:pointer;background:transparent;color:var(--ox-b);text-align:center;white-space:nowrap;} #mb-root .bdel:hover{background:rgba(224,114,107,.1);}
  #mb-root .empty{border:1px solid var(--line);border-radius:12px;background:var(--card);padding:48px 30px;text-align:center;}
  #mb-root .empty-t{font-family:var(--font-oracle);font-size:26px;color:var(--parch);}
  #mb-root .empty-s{font-family:var(--font-ui);font-size:14.5px;line-height:1.6;color:var(--mist);margin:10px auto 0;max-width:54ch;}
  #mb-root .add{border:1px dashed var(--border-strong);border-radius:12px;background:rgba(212,169,78,.03);padding:30px;margin-top:26px;text-align:center;}
  #mb-root .addt{font-family:var(--font-oracle);font-style:italic;font-size:21px;color:var(--parch);}
  #mb-root .adds{font-family:var(--font-ui);font-size:13px;line-height:1.6;color:var(--mist);margin:8px auto 16px;max-width:64ch;}
  #mb-root .addcnt{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);margin-top:16px;}
  #mb-root .addfull{display:none;font-family:var(--font-mono);font-size:12px;line-height:1.5;color:var(--ox-b);margin-top:14px;} #mb-root .addfull b{color:#F0A39C;}
  #mb-root .add.full .addbtns{opacity:.35;pointer-events:none;} #mb-root .add.full .addcnt{display:none;} #mb-root .add.full .addfull{display:block;} #mb-root .add.full{border-color:rgba(224,114,107,.4);}
  #mb-root .disc{border:1px solid var(--line);border-left:3px solid #8A6526;border-radius:0 8px 8px 0;background:var(--card);padding:14px 16px;margin-top:28px;}
  #mb-root .disc .tlbl{margin:0 0 5px;} #mb-root .disc p{font-family:var(--font-ui);font-size:12px;line-height:1.6;color:var(--mist);margin:0;max-width:none;}
  #mb-root .ov2{position:fixed;inset:0;background:rgba(4,5,8,.8);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px;z-index:260;}
  #mb-root .modal{max-width:440px;width:100%;background:var(--raised);border:1px solid var(--border-oracle);border-radius:12px;padding:26px;}
  #mb-root .flash{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:300;max-width:90vw;background:var(--raised);border:1px solid rgba(224,114,107,.6);border-left:3px solid var(--ox-b);border-radius:0 10px 10px 0;padding:13px 18px;font-family:var(--font-ui);font-size:13.5px;color:var(--parch);box-shadow:0 14px 40px rgba(0,0,0,.5);}
  #mb-root .flash.ok{border-color:rgba(111,207,154,.5);border-left-color:var(--bull);}
  #mb-root .modal-wide{max-width:560px;max-height:90vh;overflow-y:auto;padding:22px 22px 0;}
  #mb-root .modal-wide h3{margin:0 0 12px;}
  #mb-root .mode-tabs{display:flex;gap:6px;background:var(--input);border:1px solid var(--line);border-radius:9px;padding:4px;margin:0 0 16px;}
  #mb-root .mtab{flex:1;font-family:var(--font-ui);font-size:12.5px;font-weight:600;border:none;background:transparent;color:var(--text-secondary);border-radius:6px;padding:8px 10px;cursor:pointer;}
  #mb-root .mtab.on{background:var(--grad-gold);color:var(--text-on-gold);}
  #mb-root .hgrid{display:flex;flex-direction:column;gap:8px;margin:4px 0 10px;}
  #mb-root .hcard{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:12px 14px;cursor:pointer;}
  #mb-root .hcard:hover{border-color:var(--border-oracle);background:rgba(212,169,78,.05);}
  #mb-root .hcard.disabled{cursor:not-allowed;opacity:.5;}
  #mb-root .hcard.disabled:hover{border-color:var(--line);background:var(--card);}
  #mb-root .hcard-hint{font-family:var(--font-mono);font-size:10px;color:var(--ox-b);margin-top:5px;letter-spacing:.03em;}
  #mb-root .hcard-top{display:flex;align-items:center;justify-content:space-between;gap:10px;}
  #mb-root .hcard-name{font-family:var(--font-oracle);font-size:18px;color:var(--parch);}
  #mb-root .hcard-row{display:flex;align-items:center;gap:14px;margin-top:6px;}
  #mb-root .f-miss{font-family:var(--font-ui);font-size:12px;line-height:1.5;color:var(--ox-b);background:rgba(224,114,107,.08);border:1px solid rgba(224,114,107,.3);border-radius:7px;padding:8px 11px;margin-top:12px;} #mb-root .f-miss b{color:#F0A39C;}
  #mb-root .f-foot{position:sticky;bottom:0;background:var(--raised);border-top:1px solid var(--border-subtle);padding:12px 0;margin-top:14px;display:flex;gap:10px;justify-content:flex-end;}
  #mb-root .f-up{display:flex;align-items:center;justify-content:center;text-align:center;gap:8px;border:1px dashed var(--border-strong);border-radius:9px;background:rgba(212,169,78,.05);padding:11px 14px;cursor:pointer;font-family:var(--font-ui);font-size:12.5px;color:var(--oracle-b);margin:2px 0 7px;}
  #mb-root .f-up.busy{opacity:.7;cursor:wait;}
  #mb-root .f-note{font-family:var(--font-mono);font-size:10px;line-height:1.5;color:var(--ash);margin:0 0 16px;}
  #mb-root .f-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px 10px;}
  #mb-root .f-cnt{font-family:var(--font-mono);font-size:9px;color:var(--ox-b);} #mb-root .f-cnt.ok{color:var(--bull);}
  #mb-root .tagbox{display:flex;flex-wrap:wrap;gap:6px;align-items:center;background:var(--input);border:1px solid var(--border-strong);border-radius:6px;padding:7px 8px;min-height:38px;box-sizing:border-box;}
  #mb-root .tagchip{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:11px;color:var(--oracle-b);border:1px solid rgba(212,169,78,.5);background:rgba(212,169,78,.1);border-radius:5px;padding:3px 4px 3px 8px;}
  #mb-root .tagx{border:none;background:none;color:var(--oracle-b);cursor:pointer;font-size:13px;line-height:1;padding:0 2px;}
  #mb-root .taginput{flex:1;min-width:120px;border:none;background:none;outline:none;color:var(--parch);font-family:var(--font-ui);font-size:14px;}
  #mb-root .tagsug{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
  #mb-root .sugchip{font-family:var(--font-mono);font-size:10px;color:var(--mist);border:1px dashed var(--border-strong);background:none;border-radius:999px;padding:3px 9px;cursor:pointer;}
  #mb-root .sugchip:hover{border-color:var(--border-oracle);color:var(--oracle-b);}
  #mb-root .askwarren{font-family:var(--font-ui);font-size:11.5px;font-weight:600;border:1px solid rgba(212,169,78,.5);background:rgba(212,169,78,.1);color:var(--oracle-b);border-radius:6px;padding:5px 11px;cursor:pointer;white-space:nowrap;}
  #mb-root .askwarren:hover{background:rgba(212,169,78,.2);} #mb-root .askwarren:disabled{opacity:.5;cursor:not-allowed;}
  #mb-root .wsug{margin-top:9px;border:1px solid rgba(212,169,78,.3);border-radius:8px;background:rgba(212,169,78,.04);padding:10px 11px;}
  #mb-root .wsug-lbl{font-family:var(--font-mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--oracle-b);margin-bottom:7px;}
  #mb-root .wsug-chips{display:flex;flex-wrap:wrap;gap:6px;}
  #mb-root .wsugchip{font-family:var(--font-mono);font-size:10.5px;color:var(--oracle-b);border:1px solid rgba(212,169,78,.5);background:rgba(212,169,78,.12);border-radius:999px;padding:4px 10px;cursor:pointer;}
  #mb-root .wsugchip:hover{background:rgba(212,169,78,.22);}
  #mb-root .isindup{flex-direction:row !important;align-items:center;gap:8px;font-family:var(--font-ui);font-size:12.5px;color:var(--ox-b);border:1px solid rgba(224,114,107,.4);background:rgba(224,114,107,.08);border-radius:7px;padding:9px 12px;} #mb-root .isindup b{color:#F0A39C;}
  #mb-root .isindup-open{font-family:var(--font-ui);font-size:12px;font-weight:600;border:1px solid rgba(212,169,78,.5);background:rgba(212,169,78,.1);color:var(--oracle-b);border-radius:6px;padding:5px 11px;cursor:pointer;margin-left:auto;}
  #mb-root .antit{font-family:var(--font-oracle);font-style:italic;font-size:15.5px;line-height:1.5;color:var(--ox-b);margin:0;max-width:64ch;}
  #mb-root .killpills{display:flex;flex-wrap:wrap;gap:7px;}
  #mb-root .killpill{font-family:var(--font-mono);font-size:11px;color:var(--oracle-b);border:1px solid rgba(212,169,78,.5);background:rgba(212,169,78,.08);border-radius:5px;padding:3px 9px;}
  #mb-root .killwarn{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-family:var(--font-ui);font-size:13px;color:var(--oracle-b);border:1px solid rgba(212,169,78,.35);background:rgba(212,169,78,.05);border-radius:8px;padding:10px 13px;}
  #mb-root .killwarn-edit{font-family:var(--font-ui);font-size:12px;font-weight:600;border:1px solid rgba(212,169,78,.5);background:rgba(212,169,78,.1);color:var(--oracle-b);border-radius:6px;padding:5px 11px;cursor:pointer;white-space:nowrap;}
  #mb-root .f{display:flex;flex-direction:column;min-width:0;} #mb-root .f-full{grid-column:1 / -1;}
  #mb-root .f-l{font-family:var(--font-mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);margin-bottom:5px;}
  #mb-root .f-i{font-family:var(--font-ui);font-size:14px;background:var(--input);border:1px solid var(--border-strong);border-radius:6px;padding:7px 9px;color:var(--parch);outline:none;width:100%;box-sizing:border-box;}
  #mb-root .f-i:focus{border-color:var(--border-oracle);} #mb-root select.f-i{cursor:pointer;}
  #mb-root .f-i.gold{border-color:var(--border-oracle);box-shadow:0 0 0 1px rgba(212,169,78,.25);}
  #mb-root .f-i::placeholder,#mb-root textarea.f-i::placeholder{color:var(--steel);}
  #mb-root .modal h3{font-family:var(--font-oracle);font-weight:400;font-size:24px;margin:0 0 10px;color:var(--oracle-b);} #mb-root .modal p{font-family:var(--font-ui);font-size:14px;line-height:1.6;color:var(--mist);margin:0 0 16px;}
  #mb-root .disc-note{font-family:var(--font-mono);font-size:10.5px;line-height:1.55;color:var(--ash);border-left:2px solid #8A6526;padding:8px 0 8px 11px;margin:0 0 18px;}
  #mb-root .chanrow{display:flex;gap:8px;margin:0 0 18px;} #mb-root .chip{flex:1;text-align:center;border:1px solid var(--line);border-radius:7px;padding:9px;font-family:var(--font-mono);font-size:11px;color:var(--mist);cursor:pointer;} #mb-root .chip.sel{border-color:rgba(212,169,78,.5);background:rgba(212,169,78,.1);color:var(--oracle-b);}
  #mb-root .mrow{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;}
  @media (max-width:900px){
    #mb-root .hdr{display:none;}
    #mb-root .orow{display:grid;grid-template-columns:1fr auto;column-gap:16px;row-gap:16px;align-items:center;padding:20px 0;}
    #mb-root .c-topic{grid-column:1;grid-row:1;align-self:start;}
    #mb-root .det{grid-column:2;grid-row:1;justify-self:end;align-self:start;}
    #mb-root .c-mon{grid-column:1;grid-row:2;justify-self:start;}
    #mb-root .mon-lbl{display:inline;}
    #mb-root .c-stat{grid-column:2;grid-row:2;justify-self:end;align-self:center;}
    #mb-root .c-trig{grid-column:1;grid-row:3;}
    #mb-root .bedit{grid-column:2;grid-row:3;justify-self:end;align-self:center;}
    #mb-root .mks{flex-wrap:nowrap;gap:8px;}
    #mb-root .mk{flex:1 1 0;min-width:0;}
    #mb-root .mk .v{font-size:13px;}
    #mb-root .mini{max-width:none;}
    #mb-root .dgrid{display:flex;flex-direction:column;gap:22px;}
    #mb-root .dcol-these,#mb-root .dcol-act{grid-column:auto;width:100%;}
    #mb-root .dcol-these{order:0;} #mb-root .dcol-act{order:1;}
    /* Mobile: deutlich weniger Rand-Verschwendung — Section-Padding + Gruppen-Einzug schrumpfen. */
    #mb-root section > div{padding-left:16px !important;padding-right:16px !important;}
    #mb-root .grp{padding-left:9px;}
    #mb-root .orow{padding-right:0;}
    /* Offenes Topic: graue Fläche bis an die Ränder (links bis zur Gruppenlinie, rechts bis zum Bildschirmrand). */
    #mb-root .topic.open{position:relative;margin-left:-9px;margin-right:-16px;padding-left:12px;padding-right:16px;box-shadow:none;}
    /* X in die obere rechte Ecke, größer. */
    #mb-root .topic.open .det.x{position:absolute;top:4px;right:8px;z-index:3;font-size:28px;padding:6px 10px;}
    #mb-root .topic.open .c-topic{padding-right:40px;}
  }`;

  function injectCSS() {
    if (document.getElementById("mb-css")) return;
    const s = document.createElement("style");
    s.id = "mb-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function MyBookHero() {
    return h("header", { style: { position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border-subtle)", minHeight: "min(54vh, 460px)", display: "flex", alignItems: "center" } },
      h("img", { src: "assets/imagery/pythai-book.png", alt: "", "aria-hidden": "true", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 } }),
      h("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(80% 62% at 50% 45%, rgba(8,9,12,0.18) 0%, rgba(8,9,12,0.74) 60%, var(--void) 100%)" } }),
      h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,9,12,0.60) 0%, transparent 30%, transparent 58%, var(--void) 100%)" } }),
      window.PyHeroParticles && h(window.PyHeroParticles, { count: 110 }),
      h("div", { style: { position: "relative", maxWidth: 1240, width: "100%", margin: "0 auto", padding: "112px 40px 76px", textAlign: "center" } },
        h(PyEyebrow, null, "Syndicate · My Book"),
        h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, letterSpacing: "-0.02em", fontSize: "clamp(40px,6vw,72px)", lineHeight: 1.05, margin: 0, color: "var(--text-primary)" } }, "My Book."),
        h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 18, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 640, margin: "22px auto 0" } }, T("Das ist dein Thesen-Buch. Deine Topics, deine Marken, deine Entscheidung. Warren beobachtet, ob deine These hält, und meldet Fakten — reines Tracking, ohne Gewähr. Kein Portfolio, keine Beträge. Warren rät nie.", "This is your thesis book. Your topics, your levels, your call. Warren watches whether your thesis holds and reports facts — pure tracking, no warranty. No portfolio, no amounts. Warren never advises."))));
  }

  /* ============================================================
     FLAECHE DREI · Langfrist-Thesen (AP6.4)
     Vertrag: _backend-readonly/workspace/intake/FLAECHE3-FE-VERTRAG-2026-08-12.md
     Endpunkt: GET /api/mybook/sockel — 401 / 403 / 500 / 200.

     Leitplanken, die hier im Code stehen, damit sie nicht verloren gehen:
     - Keine Euro-Betraege, keine Stueckzahlen. Der Endpunkt liefert sie
       nicht, das FE erfindet sie nicht.
     - Stand-Datum in der ERSTEN Zeile, nicht im Kleingedruckten.
     - Abweichungen als Saetze, nicht als Zahlenfriedhof.
     - Keine Handlungsaufforderung. "band_verletzt" ist eine Feststellung.
     - Ein 500 wird als FEHLER angezeigt, NIE als "kein Depot".
     - Keine eigenen Rechnungen auf den Rohzahlen. Die Formeln leben im
       Backend (sockel_drift.mjs) — eine Wahrheit, zwei Leser.
     ============================================================ */

  // System-Vokabular -> Anzeigenamen. Gehoert laut Vertrag ins FE, nicht
  // in die API: Anzeige-Fragen werden in der Anzeige geloest.
  const LT_NAMEN = {
    aktien: ["Aktien", "Equities"],
    anleihen: ["Anleihen", "Bonds"],
    geldmarkt: ["Geldmarkt", "Money market"],
    rohstoffe: ["Rohstoffe", "Commodities"],
    immobilien: ["Immobilien", "Real estate"],
    welt: ["Welt", "World"],
    us_core: ["USA Kern", "US core"],
    us_equal_weight: ["USA gleichgewichtet", "US equal weight"],
    europa: ["Europa", "Europe"],
    em: ["Schwellenl\u00E4nder", "Emerging markets"],
    em_value: ["Schwellenl\u00E4nder Value", "Emerging markets value"],
    japan: ["Japan", "Japan"],
    corp_kurz: ["Unternehmensanleihen kurz", "Corporate short"],
    staat_eur_3_5: ["Staatsanleihen Euro 3\u20135 Jahre", "Euro sovereigns 3-5y"],
    staat_global: ["Staatsanleihen global", "Global sovereigns"],
    renten_defensiv: ["Renten defensiv", "Defensive fixed income"],
  };
  const ltName = (z) => {
    if (z.ebene === "position") return z.name || z.schluessel;
    const n = LT_NAMEN[z.schluessel];
    return n ? T(n[0], n[1]) : String(z.schluessel || "").replace(/_/g, " ");
  };

  const ltPct = (x) => (x == null ? null : Number(x).toFixed(1).replace(".", ","));
  const ltDatum = (iso) => {
    if (!iso) return null;
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(T("de-DE", "en-GB"), { day: "2-digit", month: "long", year: "numeric" });
  };

  // Aus einer Zeile wird eine AUSSAGE — ohne den Namen, damit er daneben
  // fett stehen kann und keine Verb-Kongruenz noetig wird ("Aktien liegen"
  // gegen "Geldmarkt liegt"). Gerechnet wird nichts, nur formuliert.
  const ltAussage = (z) => {
    const ist = ltPct(z.ist_pct);
    if (z.verdikt === "kein_ziel" || z.ziel_pct == null) {
      return T(ist + " % \u2014 keine Zielstruktur festgelegt", ist + " % \u2014 no target structure defined");
    }
    const ziel = ltPct(z.ziel_pct);
    if (z.verdikt === "ohne_band") {
      return T(ist + " %, Ziel " + ziel + " % \u2014 kein Toleranzband hinterlegt",
               ist + " %, target " + ziel + " % \u2014 no tolerance band on file");
    }
    const pp = z.abw_pp == null ? null : Number(z.abw_pp);
    if (pp == null) return T(ist + " %, Ziel " + ziel + " %", ist + " %, target " + ziel + " %");
    if (Math.abs(pp) < 0.05) return T("genau auf Ziel, " + ist + " %", "exactly on target, " + ist + " %");
    const betrag = ltPct(Math.abs(pp));
    const richtung = pp > 0 ? T("\u00FCber", "above") : T("unter", "below");
    const lage = z.verdikt === "band_verletzt"
      ? T("au\u00DFerhalb des Bandes", "outside the band")
      : T("innerhalb des Bandes", "inside the band");
    return T(betrag + " Punkte " + richtung + " Ziel, " + lage,
             betrag + " points " + richtung + " target, " + lage);
  };

  const LT_SCHALTER = "py_langfrist_an";
  const ltGelesen = () => {
    try {
      const v = localStorage.getItem(LT_SCHALTER);
      if (v === "0") return false;
      if (v === "1") return true;
    } catch (e) {}
    return true; // Vorgabe: an. Wer nichts entschieden hat, sieht die Fläche.
  };
  const ltSchreiben = (an) => { try { localStorage.setItem(LT_SCHALTER, an ? "1" : "0"); } catch (e) {} };

  /* ============================================================
     B1 · ZIELSTRUKTUR SETZEN (AP6.5) — Vertrag V2, Abschnitt B1
     POST /api/mybook/sockel/ziel
     Semantik: jeder Absenden-Vorgang erzeugt eine NEUE Version. Eine
     Zeile "loeschen" heisst: neue Version ohne diese Zeile. Deshalb ist
     dieses Formular immer die GANZE Zielstruktur, nie ein Teil davon.

     Die Route antwortet zum Bauzeitpunkt noch 404. Das Formular tut
     deshalb NICHT so, als haette es gespeichert: es sagt beim Absenden
     ehrlich, dass die Strecke noch nicht ausgeliefert ist. Kein
     localStorage, keine Schein-Speicherung — eine Eingabe, die spaeter
     verschwindet, ist schlimmer als eine, die nie behauptet hat, sicher
     zu sein.
     ============================================================ */

  const LT_KLASSEN = ["aktien", "anleihen", "geldmarkt"];
  // Zuordnung aus dem Vertrag B6 — welcher Baustein zu welcher Klasse gehoert.
  const LT_ZU_KLASSE = {
    us_core: "aktien", us_equal_weight: "aktien", europa: "aktien",
    em: "aktien", em_value: "aktien", japan: "aktien", welt: "aktien",
    corp_kurz: "anleihen", staat_eur_3_5: "anleihen",
    staat_global: "anleihen", renten_defensiv: "anleihen",
    geldmarkt: "geldmarkt",
  };
  const LT_BAUSTEINE = Object.keys(LT_ZU_KLASSE);

  const ltZahl = (s) => {
    if (s == null || s === "") return null;
    const n = parseFloat(String(s).replace(",", "."));
    return isFinite(n) ? n : null;
  };
  const ltSumme = (zeilen, ebene) => zeilen
    .filter((z) => z.ebene === ebene)
    .reduce((a, z) => a + (ltZahl(z.ziel_pct) || 0), 0);
  const LT_TOLERANZ = 0.5;

  /* ------------------------------------------------------------
     B4 · VORLAGEN — Vertrag V2, Abschnitt B4 / Nachtrag 3, Punkt 6

     Drei Muster mit fest vereinbarten Zahlen. Die Beschreibung nennt
     AUSSCHLIESSLICH, was in der Vorlage steht — keine Wirkung, keine
     Eignung, keine Rangfolge. "Norwegen" ist hier ein Name, keine
     Aussage ueber einen realen Fonds; die Erklaerung des Prinzips
     steht redaktionell auf der Methodik-Seite, nicht als Zusage hier.

     band_rel_pct 20 ist Startwert des Editors, frei aenderbar.
     ------------------------------------------------------------ */
  const LT_BAND_START = "20";
  const LT_VORLAGEN = [
    { key: "norwegen_original",
      name: ["Norwegen-Muster (Original)", "Norway pattern (original)"],
      anteile: { aktien: "73", anleihen: "27" },
      satz: ["73 % Aktien · 27 % Anleihen · kein Geldmarkt",
             "73 % equities · 27 % bonds · no money market"] },
    { key: "muster_ausgewogen",
      name: ["Muster ausgewogen", "Sample balanced"],
      anteile: { aktien: "60", anleihen: "30", geldmarkt: "10" },
      satz: ["60 % Aktien · 30 % Anleihen · 10 % Geldmarkt",
             "60 % equities · 30 % bonds · 10 % money market"] },
    { key: "muster_defensiv",
      name: ["Muster defensiv", "Sample defensive"],
      anteile: { aktien: "40", anleihen: "45", geldmarkt: "15" },
      satz: ["40 % Aktien · 45 % Anleihen · 15 % Geldmarkt",
             "40 % equities · 45 % bonds · 15 % money market"] },
  ];

  function ZielEditor({ depot, start, onSchliessen }) {
    const [zeilen, setZeilen] = useState(() => {
      if (Array.isArray(start) && start.length) {
        return start.map((z) => ({
          ebene: z.ebene, schluessel: z.schluessel,
          ziel_pct: z.ziel_pct == null ? "" : String(z.ziel_pct).replace(".", ","),
          band_rel_pct: z.band_rel_pct == null ? "" : String(z.band_rel_pct).replace(".", ","),
        }));
      }
      return LT_KLASSEN.map((k) => ({ ebene: "klasse", schluessel: k, ziel_pct: "", band_rel_pct: "20" }));
    });
    const [busy, setBusy] = useState(false);
    const [meldung, setMeldung] = useState(null);
    // Welche Vorlage steht UNVERAENDERT im Formular? Sobald eine Zahl
    // angefasst wird, ist es die Entscheidung des Inhabers und nicht mehr
    // die Vorlage — genau das wandert als quelle ins Backend.
    const [vorlage, setVorlage] = useState(null);

    const setFeld = (i, feld, wert) => {
      setVorlage(null);
      setZeilen(zeilen.map((z, j) => j === i ? Object.assign({}, z, { [feld]: wert }) : z));
    };
    const entfernen = (i) => { setVorlage(null); setZeilen(zeilen.filter((_, j) => j !== i)); };
    const hinzu = (schluessel) => {
      if (zeilen.some((z) => z.schluessel === schluessel)) return;
      setVorlage(null);
      setZeilen(zeilen.concat([{ ebene: "baustein", schluessel: schluessel, ziel_pct: "", band_rel_pct: "25" }]));
    };

    // Eine Vorlage ersetzt das GANZE Formular durch die Klassen-Ebene.
    // Klassen, die in der Vorlage nicht vorkommen, bleiben leer und
    // stehen damit nicht in der Version — nicht "0", sondern "nicht Teil".
    const vorlageAnwenden = (v) => {
      setMeldung(null);
      setVorlage(v.key);
      setZeilen(LT_KLASSEN.map((k) => ({
        ebene: "klasse", schluessel: k,
        ziel_pct: v.anteile[k] || "",
        band_rel_pct: LT_BAND_START,
      })));
    };

    // Nachtrag 3, Punkt 1: die Klassen-Ebene ist PFLICHT und muss 100 ergeben.
    // Bausteine sind eine TEILMENGE — ein Band nur fuer us_core ist legitim.
    // Sie duerfen 100,5 nur nicht ueberschreiten.
    const sK = ltSumme(zeilen, "klasse");
    const sB = ltSumme(zeilen, "baustein");
    const hatB = zeilen.some((z) => z.ebene === "baustein");
    const kOk = Math.abs(sK - 100) <= LT_TOLERANZ;
    const bOk = !hatB || sB <= 100 + LT_TOLERANZ;
    const bereit = kOk && bOk && !busy;

    // Summen-Anzeige in Worten, nicht als nackte Zahl — dieselbe Sprache
    // wie die Baender oben.
    const summenSatz = (summe, ok, label) => {
      const s = ltPct(summe);
      if (ok) return T(label + " ergeben " + s + " % — vollständig.", label + " add up to " + s + " % — complete.");
      const rest = 100 - summe;
      return rest > 0
        ? T(label + " ergeben " + s + " % — es fehlen " + ltPct(rest) + " Punkte.",
            label + " add up to " + s + " % — " + ltPct(rest) + " points missing.")
        : T(label + " ergeben " + s + " % — " + ltPct(-rest) + " Punkte zu viel.",
            label + " add up to " + s + " % — " + ltPct(-rest) + " points too many.");
    };

    const senden = () => {
      setBusy(true); setMeldung(null);
      const koerper = {
        depot: depot || null,
        quelle: vorlage ? "vorlage:" + vorlage : "inhaber_entscheidung",
        zeilen: zeilen
          .filter((z) => ltZahl(z.ziel_pct) != null)
          .map((z) => ({
            ebene: z.ebene, schluessel: z.schluessel,
            ziel_pct: ltZahl(z.ziel_pct),
            band_rel_pct: ltZahl(z.band_rel_pct),
          })),
      };
      fetch(API + "/api/mybook/sockel/ziel", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(koerper),
      })
        .then((r) => r.json().then((d) => ({ code: r.status, d: d })).catch(() => ({ code: r.status, d: null })))
        .then((res) => {
          setBusy(false);
          if (res.code === 404) {
            // Ehrlich statt hilfreich: nichts wurde gespeichert.
            setMeldung({ art: "offen", text: T(
              "Die Speicher-Strecke ist noch nicht ausgeliefert. Deine Eingaben stehen weiter im Formular, sind aber NICHT gespeichert.",
              "The save route is not deployed yet. Your entries remain in the form but are NOT saved.") });
            return;
          }
          if (res.code === 400) {
            const e = res.d && res.d.error;
            if (e === "ziel_summe_invalid") {
              setMeldung({ art: "fehler", text: T(
                "Der Server hat die Summe zur\u00FCckgewiesen (" + (res.d.ebene || "") + ": " + ltPct(res.d.summe) + " %).",
                "The server rejected the total (" + (res.d.ebene || "") + ": " + ltPct(res.d.summe) + " %).") });
            } else {
              // Nachtrag 3, Punkt 2: die uebrigen 400er sind Eingabefehler.
              // Generisch, aber MIT dem Code daneben — eine Fehlermeldung ohne
              // Kennung ist bei der Fehlersuche wertlos.
              setMeldung({ art: "fehler", text: T(
                "Eingabe pr\u00FCfen. Der Server hat sie zur\u00FCckgewiesen (" + (e || "unbekannt") + "). Es wurde nichts ge\u00E4ndert.",
                "Check the input. The server rejected it (" + (e || "unknown") + "). Nothing was changed.") });
            }
            return;
          }
          if (res.code !== 200 || !res.d || !res.d.ok) {
            setMeldung({ art: "fehler", text: T("Das Speichern ist fehlgeschlagen. Es wurde nichts geändert.",
                                                "Saving failed. Nothing was changed.") });
            return;
          }
          setMeldung({ art: "gut", text: T("Gespeichert, gültig ab " + (ltDatum(res.d.gueltig_ab) || "heute") + ".",
                                           "Saved, valid from " + (ltDatum(res.d.gueltig_ab) || "today") + ".") });
        })
        .catch(() => {
          setBusy(false);
          setMeldung({ art: "fehler", text: T("Keine Verbindung. Es wurde nichts geändert.", "No connection. Nothing was changed.") });
        });
    };

    const zeileFeld = (z, i) => h("div", { key: z.schluessel, className: "ze-row" },
      h("div", { className: "ze-name" }, ltName(z)),
      h("label", { className: "ze-f" },
        h("span", null, T("Ziel", "Target")),
        h("input", { type: "text", inputMode: "decimal", value: z.ziel_pct, placeholder: "0,0",
          onChange: (e) => setFeld(i, "ziel_pct", e.target.value) }),
        h("i", null, "%")),
      h("label", { className: "ze-f" },
        h("span", null, T("Band", "Band")),
        h("input", { type: "text", inputMode: "decimal", value: z.band_rel_pct, placeholder: "20",
          onChange: (e) => setFeld(i, "band_rel_pct", e.target.value) }),
        h("i", null, "%")),
      z.ebene === "baustein"
        ? h("button", { className: "ze-weg", title: T("Zeile aus der nächsten Version nehmen", "Drop this row from the next version"),
            onClick: () => entfernen(i) }, T("entfernen", "remove"))
        : h("span", { className: "ze-fest" }, T("fest", "fixed")));

    const offeneBausteine = LT_BAUSTEINE.filter((b) => !zeilen.some((z) => z.schluessel === b));

    return h("div", { className: "ze" },
      h("div", { className: "ze-kopf" },
        h("h4", null, T("Zielstruktur festlegen", "Define target structure")),
        h("button", { className: "ze-zu", onClick: onSchliessen }, T("schließen", "close"))),

      h("p", { className: "ze-lead" },
        T("Du legst die Anteile fest, gegen die später gemessen wird, und je Zeile ein Toleranzband. PYTHAI schlägt nichts vor und bewertet nichts — die Struktur ist deine Entscheidung.",
          "You define the shares that will later be measured against, and a tolerance band per row. PYTHAI proposes nothing and judges nothing — the structure is your decision.")),

      h("div", { className: "ze-vor" },
        h("div", { className: "ze-vor-t" }, T("Vorlagen", "Templates")),
        h("p", { className: "ze-vor-pflicht" },
          T("Muster zur freien Auswahl — keine Empfehlung. Du entscheidest.",
            "Patterns to choose from freely — not a recommendation. You decide.")),
        h("div", { className: "ze-vor-liste" },
          LT_VORLAGEN.map((v) => h("button", {
            key: v.key,
            className: "ze-vor-k" + (vorlage === v.key ? " an" : ""),
            onClick: () => vorlageAnwenden(v),
          },
            h("b", null, T(v.name[0], v.name[1])),
            h("span", null, T(v.satz[0], v.satz[1]))))),
        h("p", { className: "ze-vor-quelle" },
          vorlage
            ? T("Die Vorlage steht unverändert im Formular. Sobald du eine Zahl änderst, wird daraus deine eigene Struktur.",
                "The template stands unchanged in the form. As soon as you change a number it becomes your own structure.")
            : T("Eine Vorlage füllt die Felder unten. Ändern kannst du danach jede Zahl — auch das Band.",
                "A template fills the fields below. Afterwards you can change every number — the band included."))),

      h("div", { className: "ze-grp" },
        h("div", { className: "ze-grp-t" }, T("Klassen", "Classes")),
        zeilen.map((z, i) => z.ebene === "klasse" ? zeileFeld(z, i) : null),
        h("div", { className: "ze-summe" + (kOk ? " ok" : "") }, summenSatz(sK, kOk, T("Die Klassen", "The classes")))),

      h("div", { className: "ze-grp" },
        h("div", { className: "ze-grp-t" }, T("Bausteine", "Building blocks")),
        hatB ? zeilen.map((z, i) => z.ebene === "baustein" ? zeileFeld(z, i) : null)
             : h("p", { className: "ze-leer" }, T("Noch keine Bausteine. Eine Struktur nur aus Klassen ist vollständig — Bausteine sind die feinere Ebene darunter.",
                                                  "No building blocks yet. A structure of classes alone is complete — building blocks are the finer level below.")),
        hatB ? h("div", { className: "ze-summe" + (bOk ? " ok" : "") },
          bOk ? T("Die Bausteine ergeben " + ltPct(sB) + " % \u2014 eine Teilmenge der Klassen, das ist zul\u00E4ssig.",
                  "The building blocks add up to " + ltPct(sB) + " % \u2014 a subset of the classes, which is allowed.")
              : T("Die Bausteine ergeben " + ltPct(sB) + " % \u2014 mehr als 100 ist nicht m\u00F6glich.",
                  "The building blocks add up to " + ltPct(sB) + " % \u2014 more than 100 is not possible.")) : null,
        offeneBausteine.length ? h("div", { className: "ze-hinzu" },
          h("span", null, T("hinzufügen:", "add:")),
          offeneBausteine.map((b) => h("button", { key: b, onClick: () => hinzu(b) }, ltName({ ebene: "baustein", schluessel: b })))) : null),

      meldung ? h("div", { className: "ze-meld " + meldung.art }, meldung.text) : null,

      h("div", { className: "ze-fuss" },
        h(Button, { variant: "oracle", disabled: !bereit, onClick: senden },
          busy ? T("wird gesendet…", "sending…") : T("Als meine Zielstruktur speichern", "Save as my target structure")),
        h("button", { className: "ze-abbr", onClick: onSchliessen }, T("Abbrechen", "Cancel"))),

      h("p", { className: "ze-hinweis" },
        T("Jedes Speichern erzeugt eine neue Version. Speicherst du am selben Tag noch einmal, ersetzt das die heutige Version — die Stände früherer Tage bleiben als Verlauf erhalten.",
          "Each save creates a new version. Saving again on the same day replaces today's version — earlier days remain as history.")));
  }

  /* ============================================================
     B2 · IST-STRUKTUR EINLIEFERN (AP6.5) + B7 · PRODUKTBEISPIELE (AP6.8)
     POST /api/mybook/sockel/snapshot   ·   GET .../produktbeispiele

     Zwei Leitplanken stehen hier im Code, weil sie sonst beim naechsten
     Umbau verloren gehen:

     1. Ueber den Draht gehen NUR PROZENTE. Das optionale Betragsfeld
        rechnet im Browser um und wird NIE gesendet — es verlaesst diese
        Datei nicht. Echte Vermoegenswerte von Membern existieren nirgends
        im System, und das soll so bleiben.
     2. KEINE ISIN ist hier hinterlegt. Die Produktliste ist die
        kuratierte Datei hinter dem Review-Tor (Vertrag B7, Regel 1). Ein
        Frontend mit eingebauter Liste waere eine zweite Quelle — und
        erfundene ISINs im Vermoegenskontext sind ein Desaster. Antwortet
        die Route nicht, zeigt die Flaeche das an, statt zu erfinden.
     ============================================================ */

  // Nachtrag 3, Punkt 3: ISIN ist entweder leer oder streng zwoelfstellig.
  const LT_ISIN = /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/;
  const ltIsinOk = (w) => { const t = String(w || "").trim(); return t === "" || LT_ISIN.test(t); };

  const LT_BAUSTEIN_ZU = (klasse) => LT_BAUSTEINE.filter((b) => LT_ZU_KLASSE[b] === klasse);
  const LT_PFLICHT_LABEL = [
    "Beispiele, die die Kategorie erfüllen — gleiche Liste für alle Member. Keine Empfehlung, keine Prüfung deiner persönlichen Eignung. Du entscheidest.",
    "Examples that satisfy the category — the same list for every member. Not a recommendation, no check of your personal suitability. You decide.",
  ];

  // B7 · Beispiele je Baustein. Holt die kuratierte Liste, zeigt sie
  // neutral nebeneinander, ohne Rangfolge.
  function Beispiele({ baustein, onUebernehmen, onSchliessen }) {
    const [stand, setStand] = useState("laedt"); // laedt | ok | offen | fehler
    const [liste, setListe] = useState([]);
    useEffect(() => {
      let lebt = true;
      fetch(API + "/api/mybook/sockel/produktbeispiele", { credentials: "include" })
        .then((r) => r.json().then((d) => ({ code: r.status, d: d })).catch(() => ({ code: r.status, d: null })))
        .then((res) => {
          if (!lebt) return;
          if (res.code === 404) { setStand("offen"); return; }
          if (res.code !== 200 || !res.d || !res.d.ok) { setStand("fehler"); return; }
          const b = (res.d.bausteine || {})[baustein];
          setListe(Array.isArray(b) ? b : []);
          setStand("ok");
        })
        .catch(() => { if (lebt) setStand("fehler"); });
      return () => { lebt = false; };
    }, [baustein]);

    const kopf = h("div", { className: "bs-kopf" },
      h("div", { className: "bs-t" }, T("Beispiele für ", "Examples for ") + ltName({ ebene: "baustein", schluessel: baustein })),
      h("button", { className: "ze-zu", onClick: onSchliessen }, T("schließen", "close")));

    if (stand === "laedt") return h("div", { className: "bs" }, kopf, h("p", { className: "bs-hin" }, T("Wird geladen…", "Loading…")));
    if (stand === "offen") return h("div", { className: "bs" }, kopf,
      h("p", { className: "bs-hin" }, T(
        "Die geprüfte Beispiel-Liste ist noch nicht ausgeliefert. Sie wird nicht hier im Browser geführt, sondern zentral gepflegt — deshalb stehen hier jetzt keine Namen und keine ISIN.",
        "The reviewed example list is not deployed yet. It is not kept here in the browser but maintained centrally — which is why no names and no ISINs appear here now.")));
    if (stand === "fehler") return h("div", { className: "bs" }, kopf,
      h("p", { className: "bs-hin" }, T("Die Liste ist gerade nicht abrufbar.", "The list cannot be retrieved right now.")));
    if (!liste.length) return h("div", { className: "bs" }, kopf,
      h("p", { className: "bs-hin" }, T(
        "F\u00FCr diese Kategorie sind noch keine kuratierten Beispiele hinterlegt. Eine Kategorie erscheint erst, wenn mindestens zwei Produkte gepr\u00FCft sind \u2014 genau eines w\u00E4re eine Empfehlung, und die gibt es hier nicht.",
        "No curated examples are on file for this category yet. A category appears only once at least two products have been reviewed \u2014 exactly one would be a recommendation, and there are none here.")));

    return h("div", { className: "bs" }, kopf,
      h("p", { className: "bs-label" }, T(LT_PFLICHT_LABEL[0], LT_PFLICHT_LABEL[1])),
      h("div", { className: "bs-liste" }, liste.map((p, i) => h("div", { key: p.isin || i, className: "bs-item" },
        h("div", { className: "bs-name" }, p.name || "—"),
        h("div", { className: "bs-fakten" },
          p.anbieter ? h("span", null, p.anbieter) : null,
          p.ausschuettung ? h("span", null, T("Aussch\u00FCttung ", "distribution ") + p.ausschuettung) : null,
          p.ter_pct != null ? h("span", null, T("laufende Kosten ", "ongoing charges ") + ltPct(p.ter_pct) + " %") : null,
          p.replikation ? h("span", null, p.replikation) : null,
          p.fondsgroesse ? h("span", null, T("Fondsgröße ", "fund size ") + p.fondsgroesse) : null,
          p.domizil ? h("span", null, T("Domizil ", "domicile ") + p.domizil) : null),
        h("div", { className: "bs-fuss" },
          p.isin ? h("code", null, p.isin) : null,
          h("button", { className: "bs-nimm", onClick: () => onUebernehmen(p) }, T("in die Zeile übernehmen", "use in this row")))))),
      h("p", { className: "bs-sort" }, T("Ohne Rangfolge. Die Reihenfolge stammt aus der gepflegten Liste, sie ist keine Wertung.",
                                          "No ranking. The order comes from the maintained list; it is not a judgement.")));
  }

  function PositionsEditor({ depot, onSchliessen }) {
    const heute = new Date().toISOString().slice(0, 10);
    const [stand, setStand] = useState(heute);
    const [betraege, setBetraege] = useState(false); // Hilfsmodus, rein clientseitig
    const [zeilen, setZeilen] = useState([{ name: "", isin: "", klasse: "aktien", baustein: "welt", gewicht_pct: "", betrag: "" }]);
    const [beispielFuer, setBeispielFuer] = useState(null); // Index der Zeile
    const [busy, setBusy] = useState(false);
    const [meldung, setMeldung] = useState(null);
    const [ersetzenFrage, setErsetzenFrage] = useState(null);

    const setFeld = (i, feld, wert) => setZeilen(zeilen.map((z, j) => {
      if (j !== i) return z;
      const n = Object.assign({}, z, { [feld]: wert });
      if (feld === "klasse") {
        const moeglich = LT_BAUSTEIN_ZU(wert);
        if (moeglich.indexOf(n.baustein) === -1) n.baustein = moeglich[0] || "";
      }
      return n;
    }));
    const zeileWeg = (i) => setZeilen(zeilen.length > 1 ? zeilen.filter((_, j) => j !== i) : zeilen);
    const zeileNeu = () => setZeilen(zeilen.concat([{ name: "", isin: "", klasse: "aktien", baustein: "welt", gewicht_pct: "", betrag: "" }]));

    // Betraege bleiben im Browser. Sie werden hier in Prozente uebersetzt
    // und danach nicht weiter beachtet.
    const betragSumme = zeilen.reduce((a, z) => a + (ltZahl(z.betrag) || 0), 0);
    const pctVon = (z) => {
      if (!betraege) return ltZahl(z.gewicht_pct);
      const b = ltZahl(z.betrag);
      if (b == null || betragSumme <= 0) return null;
      return Math.round((b / betragSumme) * 1000) / 10;
    };
    const summe = zeilen.reduce((a, z) => a + (pctVon(z) || 0), 0);
    const summeOk = Math.abs(summe - 100) <= LT_TOLERANZ;
    const namenOk = zeilen.every((z) => String(z.name || "").trim().length > 0);
    const isinOk = zeilen.every((z) => ltIsinOk(z.isin));
    const standOk = !!stand && stand <= heute;
    const bereit = summeOk && namenOk && isinOk && standOk && !busy;

    const senden = (ersetzen) => {
      setBusy(true); setMeldung(null); setErsetzenFrage(null);
      const koerper = {
        depot: depot || null,
        stand: stand,
        positionen: zeilen.map((z) => ({
          name: String(z.name || "").trim(),
          isin: String(z.isin || "").trim() || null,
          klasse: z.klasse,
          baustein: z.baustein,
          gewicht_pct: pctVon(z),
        })).filter((z) => z.gewicht_pct != null),
      };
      if (ersetzen) koerper.ersetzen = true;
      fetch(API + "/api/mybook/sockel/snapshot", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(koerper),
      })
        .then((r) => r.json().then((d) => ({ code: r.status, d: d })).catch(() => ({ code: r.status, d: null })))
        .then((res) => {
          setBusy(false);
          if (res.code === 404) {
            setMeldung({ art: "offen", text: T(
              "Die Einliefer-Strecke ist noch nicht ausgeliefert. Deine Eingaben stehen weiter im Formular, sind aber NICHT gespeichert.",
              "The submission route is not deployed yet. Your entries remain in the form but are NOT saved.") });
            return;
          }
          if (res.code === 409) { setErsetzenFrage(true); return; }
          if (res.code === 400 && res.d && res.d.error !== "gewicht_summe_invalid") {
            const e = res.d.error;
            setMeldung({ art: "fehler", text: T(
              "Eingabe pr\u00FCfen. Der Server hat sie zur\u00FCckgewiesen (" + (e || "unbekannt") + "). Es wurde nichts ge\u00E4ndert.",
              "Check the input. The server rejected it (" + (e || "unknown") + "). Nothing was changed.") });
            return;
          }
          if (res.code === 400 && res.d && res.d.error === "gewicht_summe_invalid") {
            setMeldung({ art: "fehler", text: T("Der Server hat die Summe zurückgewiesen (" + ltPct(res.d.summe) + " %).",
                                                "The server rejected the total (" + ltPct(res.d.summe) + " %).") });
            return;
          }
          if (res.code !== 200 || !res.d || !res.d.ok) {
            setMeldung({ art: "fehler", text: T("Das Einliefern ist fehlgeschlagen. Es wurde nichts geändert.", "Submission failed. Nothing was changed.") });
            return;
          }
          setMeldung({ art: "gut", text: T("Stand " + (ltDatum(res.d.stand) || stand) + " eingeliefert, " + res.d.positionen + " Positionen.",
                                           "Reporting date " + (ltDatum(res.d.stand) || stand) + " submitted, " + res.d.positionen + " positions.") });
        })
        .catch(() => { setBusy(false); setMeldung({ art: "fehler", text: T("Keine Verbindung. Es wurde nichts geändert.", "No connection. Nothing was changed.") }); });
    };

    const zeile = (z, i) => h("div", { key: i, className: "pe-row" },
      h("div", { className: "pe-oben" },
        h("input", { className: "pe-name", type: "text", value: z.name, placeholder: T("Name des Fonds oder Wertpapiers", "Name of the fund or security"),
          onChange: (e) => setFeld(i, "name", e.target.value) }),
        h("input", { className: "pe-isin" + (ltIsinOk(z.isin) ? "" : " ungueltig"), type: "text", value: z.isin, placeholder: T("ISIN (optional)", "ISIN (optional)"),
          onChange: (e) => setFeld(i, "isin", e.target.value.toUpperCase()) })),
      h("div", { className: "pe-unten" },
        h("select", { value: z.klasse, onChange: (e) => setFeld(i, "klasse", e.target.value) },
          LT_KLASSEN.map((k) => h("option", { key: k, value: k }, ltName({ ebene: "klasse", schluessel: k })))),
        h("select", { value: z.baustein, onChange: (e) => setFeld(i, "baustein", e.target.value) },
          LT_BAUSTEIN_ZU(z.klasse).map((b) => h("option", { key: b, value: b }, ltName({ ebene: "baustein", schluessel: b })))),
        betraege
          ? h("label", { className: "ze-f" }, h("span", null, T("Betrag", "Amount")),
              h("input", { type: "text", inputMode: "decimal", value: z.betrag, placeholder: "0",
                onChange: (e) => setFeld(i, "betrag", e.target.value) }),
              h("i", null, T("→ " + (pctVon(z) == null ? "—" : ltPct(pctVon(z)) + " %"), "→ " + (pctVon(z) == null ? "—" : ltPct(pctVon(z)) + " %"))))
          : h("label", { className: "ze-f" }, h("span", null, T("Anteil", "Weight")),
              h("input", { type: "text", inputMode: "decimal", value: z.gewicht_pct, placeholder: "0,0",
                onChange: (e) => setFeld(i, "gewicht_pct", e.target.value) }), h("i", null, "%")),
        h("button", { className: "pe-bsp", onClick: () => setBeispielFuer(beispielFuer === i ? null : i) },
          T("Beispiele", "Examples")),
        zeilen.length > 1 ? h("button", { className: "ze-weg", onClick: () => zeileWeg(i) }, T("entfernen", "remove")) : null),
      beispielFuer === i ? h(Beispiele, {
        baustein: z.baustein,
        onSchliessen: () => setBeispielFuer(null),
        onUebernehmen: (p) => { setFeld(i, "name", p.name || ""); setFeld(i, "isin", p.isin || ""); setBeispielFuer(null); },
      }) : null);

    return h("div", { className: "ze pe" },
      h("div", { className: "ze-kopf" },
        h("h4", null, T("Stand einliefern", "Submit a reporting date")),
        h("button", { className: "ze-zu", onClick: onSchliessen }, T("schließen", "close"))),

      h("p", { className: "ze-lead" },
        T("Ein Stand ist eine Momentaufnahme deiner Struktur zu einem Stichtag. Du trägst Anteile in Prozent ein — keine Beträge, keine Stückzahlen. Der nächste Stand ersetzt diesen nicht, er kommt daneben; der Verlauf bleibt.",
          "A reporting date is a snapshot of your structure on a given day. You enter weights in percent — no amounts, no quantities. The next one does not replace this one; it sits beside it and the history remains.")),

      h("div", { className: "pe-kopfzeile" },
        h("label", { className: "ze-f" }, h("span", null, T("Stichtag", "Date")),
          h("input", { type: "date", value: stand, max: heute, onChange: (e) => setStand(e.target.value) })),
        h("label", { className: "pe-modus" },
          h("input", { type: "checkbox", checked: betraege, onChange: (e) => setBetraege(e.target.checked) }),
          h("span", null, T("Mit Beträgen rechnen", "Work with amounts")))),

      betraege ? h("p", { className: "pe-warn" },
        T("Beträge sind nur eine Rechenhilfe in deinem Browser. Gesendet werden ausschließlich die daraus errechneten Prozente — kein Betrag verlässt dieses Fenster.",
          "Amounts are only a calculation aid inside your browser. Only the resulting percentages are sent — no amount leaves this window.")) : null,

      h("div", { className: "pe-liste" }, zeilen.map(zeile)),
      h("button", { className: "pe-plus", onClick: zeileNeu }, T("Position hinzufügen", "Add position")),

      h("div", { className: "ze-summe" + (summeOk ? " ok" : "") },
        summeOk
          ? T("Die Anteile ergeben " + ltPct(summe) + " % — vollständig.", "The weights add up to " + ltPct(summe) + " % — complete.")
          : (summe < 100
              ? T("Die Anteile ergeben " + ltPct(summe) + " % — es fehlen " + ltPct(100 - summe) + " Punkte.",
                  "The weights add up to " + ltPct(summe) + " % — " + ltPct(100 - summe) + " points missing.")
              : T("Die Anteile ergeben " + ltPct(summe) + " % — " + ltPct(summe - 100) + " Punkte zu viel.",
                  "The weights add up to " + ltPct(summe) + " % — " + ltPct(summe - 100) + " points too many."))),
      !namenOk ? h("div", { className: "ze-summe" }, T("Jede Position braucht einen Namen.", "Every position needs a name.")) : null,
      !isinOk ? h("div", { className: "ze-summe" }, T("Eine ISIN hat zw\u00F6lf Stellen: zwei Buchstaben, neun Zeichen, eine Pr\u00FCfziffer. Leer lassen ist erlaubt.",
                                                      "An ISIN has twelve characters: two letters, nine alphanumerics, one check digit. Leaving it empty is fine.")) : null,
      !standOk ? h("div", { className: "ze-summe" }, T("Der Stichtag darf nicht in der Zukunft liegen.", "The reporting date cannot be in the future.")) : null,

      ersetzenFrage ? h("div", { className: "ze-meld offen" },
        h("div", null, T("Für den " + (ltDatum(stand) || stand) + " liegt bereits ein Stand vor. Ersetzen?",
                         "A reporting date already exists for " + (ltDatum(stand) || stand) + ". Replace it?")),
        h("div", { style: { marginTop: 12, display: "flex", gap: 14, alignItems: "center" } },
          h(Button, { variant: "oracle", onClick: () => senden(true) }, T("Ersetzen", "Replace")),
          h("button", { className: "ze-abbr", onClick: () => setErsetzenFrage(null) }, T("Abbrechen", "Cancel")))) : null,

      meldung ? h("div", { className: "ze-meld " + meldung.art }, meldung.text) : null,

      h("div", { className: "ze-fuss" },
        h(Button, { variant: "oracle", disabled: !bereit, onClick: () => senden(false) },
          busy ? T("wird gesendet…", "sending…") : T("Stand einliefern", "Submit reporting date")),
        h("button", { className: "ze-abbr", onClick: onSchliessen }, T("Abbrechen", "Cancel"))),

      h("p", { className: "ze-hinweis" },
        T("Eine einzelne Position löschen gibt es nicht. Ein Stand ist ein Stichtag — du lieferst einen neuen Stand ohne sie, und der alte bleibt Verlauf.",
          "There is no deleting a single position. A reporting date is a snapshot — you submit a new one without it, and the old one remains history.")));
  }

  function Langfrist() {
    const [an, setAn] = useState(ltGelesen());
    const [stand, setStand] = useState("laedt"); // laedt | ok | leer | fehler | gesperrt
    const [depots, setDepots] = useState([]);
    const [offen, setOffen] = useState({});
    const [editor, setEditor] = useState(null); // null | { depot, start }
    const [posEditor, setPosEditor] = useState(null); // null | { depot }

    useEffect(() => {
      if (!an) return;
      let lebt = true;
      fetch(API + "/api/mybook/sockel", { credentials: "include" })
        .then((r) => r.json().then((d) => ({ code: r.status, d: d })).catch(() => ({ code: r.status, d: null })))
        .then((res) => {
          if (!lebt) return;
          if (res.code === 403) { setStand("gesperrt"); return; }
          if (res.code !== 200 || !res.d || !res.d.ok) { setStand("fehler"); return; }
          const ds = Array.isArray(res.d.depots) ? res.d.depots : [];
          setDepots(ds);
          setStand(res.d.vorhanden && ds.length ? "ok" : "leer");
        })
        .catch(() => { if (lebt) setStand("fehler"); });
      return () => { lebt = false; };
    }, [an]);

    const kopf = h("div", { className: "lt-head" },
      h("div", null,
        h("div", { className: "lt-eyebrow" }, T("Fl\u00E4che drei", "Surface three")),
        h("h3", { className: "lt-title" }, T("Langfrist-Thesen", "Long-term theses"))),
      h("div", { className: "lt-sw" },
        h("span", null, an ? T("an", "on") : T("aus", "off")),
        h("button", {
          className: "sw " + (an ? "on" : "off"),
          "aria-pressed": an ? "true" : "false",
          title: T("Langfrist-Thesen ein- oder ausblenden. Es werden keine Daten gel\u00F6scht.",
                   "Show or hide long-term theses. No data is deleted."),
          onClick: () => { const n = !an; setAn(n); ltSchreiben(n); sfx("button-004-toggle"); }
        }, h("span", { className: "knob" }))));

    const erklaerung = h("p", { className: "lt-lead" },
      T("Das norwegische Prinzip: eine breit gestreute Zielstruktur, feste Anteile, und keine Meinung zum n\u00E4chsten Quartal. Hier z\u00E4hlt nicht der Tag, sondern der Abstand zum Ziel.",
        "The Norwegian principle: a broadly diversified target structure, fixed shares, and no opinion about the next quarter. Here the day does not matter — the distance to target does."));

    if (!an) {
      return h("div", { className: "lt" }, kopf,
        h("p", { className: "lt-lead" },
          T("Ausgeblendet. Es wurde nichts gelöscht — der Schalter oben holt die Fläche zurück.",
            "Hidden. Nothing was deleted — the switch above brings it back.")));
    }

    let koerper = null;

    if (stand === "laedt") {
      koerper = h("p", { className: "lt-warn", style: { marginTop: 20 } }, T("Wird geladen…", "Loading…"));
    } else if (stand === "fehler") {
      // Ein Lesefehler ist ein Fehler. Er wird NICHT zu "kein Depot" gemacht.
      koerper = h("div", { className: "lt-fehler" },
        T("Die Langfrist-Daten sind gerade nicht abrufbar. Das ist ein technischer Fehler auf unserer Seite, keine Aussage über dein Depot. Bitte später erneut ansehen.",
          "The long-term data cannot be retrieved right now. That is a technical fault on our side, not a statement about your portfolio. Please look again later."));
    } else if (stand === "gesperrt") {
      koerper = h("p", { className: "lt-warn", style: { marginTop: 20 } },
        T("Diese Fl\u00E4che ist dem Syndicate vorbehalten.", "This surface is reserved for the Syndicate."));
    } else if (stand === "leer") {
      koerper = h("div", { className: "lt-leer" },
        h("h4", null, T("Noch keine Zielstruktur festgelegt.", "No target structure defined yet.")),
        h("p", null, T("Diese Fl\u00E4che zeigt, wie weit ein langfristig gehaltenes Verm\u00F6gen von seiner eigenen Zielstruktur abgewichen ist. Daf\u00FCr braucht es zweierlei: einen Depotauszug als Stichtag, und die Zielgewichte, gegen die gemessen wird.",
                       "This surface shows how far long-held capital has drifted from its own target structure. That needs two things: a portfolio statement as a reporting date, and the target weights to measure against.")),
        h("p", null, T("Beides bleibt bei dir. PYTHAI schlägt keine Struktur vor und bewertet keine — es stellt den Abstand dar, den du selbst definiert hast.",
                       "Both remain yours. PYTHAI proposes no structure and judges none — it shows the distance you defined yourself.")),
        h("div", { style: { marginTop: 18 } },
          h("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" } },
            h(Button, { variant: "oracle", onClick: () => setEditor({ depot: null, start: null }) },
              T("Zielstruktur festlegen", "Define target structure")),
            h(Button, { variant: "ghost", onClick: () => setPosEditor({ depot: null }) },
              T("Stand einliefern", "Submit reporting date")))),
        h("div", { className: "bald" }, T("Der Weg, einen Depotauszug einzuliefern, folgt im nächsten Schritt.", "The way to submit a portfolio statement follows in the next step.")));
    } else if (stand === "ok") {
      koerper = depots.map((dep, di) => {
        const zeilen = Array.isArray(dep.zeilen) ? dep.zeilen : [];
        const klassen = zeilen.filter((z) => z.ebene === "klasse");
        const rest = zeilen.filter((z) => z.ebene !== "klasse");
        const auf = !!offen[dep.depot];
        const zeile = (z, i) => h("div", { key: i, className: "lt-row" + (z.verdikt === "band_verletzt" ? " b-aus" : "") },
          h("div", { className: "satz" }, h("b", null, ltName(z)), " \u00B7 ", ltAussage(z)),
          h("div", { className: "marke" + (z.verdikt === "band_verletzt" ? " aus" : "") },
            z.verdikt === "band_verletzt" ? T("au\u00DFerhalb", "outside")
              : z.verdikt === "im_band" ? T("im Band", "in band")
              : z.verdikt === "ohne_band" ? T("kein Band", "no band")
              : T("kein Ziel", "no target")));
        return h("div", { key: dep.depot || di },
          h("div", { className: "lt-stand" },
            h("span", null, T("Stand: ", "As of: ") + (ltDatum(dep.stand) || "—")),
            dep.stand_alter_tage != null ? h("span", { className: "alt" },
              dep.stand_alter_tage === 0 ? T("heute", "today")
                : dep.stand_alter_tage === 1 ? T("vor 1 Tag", "1 day ago")
                : T("vor " + dep.stand_alter_tage + " Tagen", dep.stand_alter_tage + " days ago")) : null,
            dep.depot ? h("span", { className: "depot" }, dep.depot) : null),
          h("p", { className: "lt-warn" },
            T("Die Zahlen beziehen sich auf diesen Stichtag und bewegen sich bis zum n\u00E4chsten Auszug nicht.",
              "The figures refer to that reporting date and do not move until the next statement.")),
          dep.ziel_gueltig_ab == null ? h("div", { className: "lt-leer", style: { marginBottom: 20 } },
            h("h4", null, T("Ist-Struktur ohne Ziel.", "Actual structure, no target.")),
            h("p", null, T("Der Auszug liegt vor, die Zielgewichte fehlen noch. Ohne Ziel gibt es keinen Abstand zu messen — unten steht, wie es heute aussieht.",
                           "The statement is on file, the target weights are not. Without a target there is no distance to measure — below is how it looks today."))) : null,
          klassen.length ? h("div", { className: "lt-grp" },
            h("div", { className: "lt-grp-t" }, T("Klassen", "Classes")),
            klassen.map(zeile)) : null,
          rest.length ? h("div", { className: "lt-grp" },
            h("button", { className: "lt-mehr", onClick: () => setOffen(Object.assign({}, offen, { [dep.depot]: !auf })) },
              auf ? T("Bausteine schlie\u00DFen ▴", "Close building blocks ▴")
                  : T("Bausteine ansehen ▾ (" + rest.length + ")", "View building blocks ▾ (" + rest.length + ")")),
            auf ? h("div", { style: { marginTop: 8 } }, rest.map(zeile)) : null) : null,
          h("div", { style: { marginTop: 18 } },
            h("button", { className: "lt-mehr", onClick: () => setEditor({ depot: dep.depot, start: zeilen.filter((z) => z.ziel_pct != null) }) },
              dep.ziel_gueltig_ab == null ? T("Zielstruktur festlegen", "Define target structure")
                                          : T("Zielstruktur \u00E4ndern", "Change target structure")),
            h("button", { className: "lt-mehr", style: { marginLeft: 22 }, onClick: () => setPosEditor({ depot: dep.depot }) },
              T("Neuen Stand einliefern", "Submit new reporting date"))));
      });
    }

    return h("div", { className: "lt" }, kopf, erklaerung,
      editor ? h(ZielEditor, { depot: editor.depot, start: editor.start, onSchliessen: () => setEditor(null) }) : null,
      posEditor ? h(PositionsEditor, { depot: posEditor.depot, onSchliessen: () => setPosEditor(null) }) : null,
      koerper,
      h("p", { className: "lt-fuss" },
        T("Darstellung einer selbst festgelegten Struktur zum genannten Stichtag. Keine Anlageberatung, keine Empfehlung, keine Aufforderung zu irgendeiner Transaktion. Keine Beträge, keine Stückzahlen — die Struktur zählt, nicht das Vermögen.",
          "A display of a self-defined structure as of the stated reporting date. Not investment advice, not a recommendation, not a prompt to any transaction. No amounts, no quantities — the structure matters, not the wealth.")));
  }

  function Mini({ p }) {
    const pct = (typeof p.waage_pct === "number") ? Math.max(3, Math.min(97, p.waage_pct)) : wpct(p.score);
    return h("div", { className: "mini" },
      h("div", { className: "mk-row" }, h("span", { className: "arrow", style: { left: pct + "%" } }, "▼")),
      h("div", { className: "bar" }, Z.map((c, i) => h("span", { key: i, style: { background: c } }))),
      h("div", { className: "lab", style: { color: Z[p.zone - 1] } }, statusText(p)));
  }

  function Marks({ p }) {
    const rows = [["Entry", "entry", ""], ["Stop", "stop", "stop"], ["Skim", "skim", "skim"], ["Target", "target", "tgt"]];
    return h("div", { className: "mks" }, rows.map((r) =>
      h("div", { key: r[1], className: "mk " + r[2] },
        h("span", { className: "k" }, r[0]),
        h("span", { className: "v" }, p[r[1]] || "—"))));
  }

  function App() {
    const [gate, setGate] = useState("loading");
    const [rows, setRows] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [open, setOpen] = useState(null);
    const [monModal, setMonModal] = useState(null);
    const [monCh, setMonCh] = useState("mail");
    const [mirrorModal, setMirrorModal] = useState(null);
    const [delId, setDelId] = useState(null);
    const [summary, setSummary] = useState(true);
    const [simple, setSimple] = useState(true);
    const [ladderOpen, setLadderOpen] = useState(null);
    const BLANK = { name: "", isin: "", issuer: "", idx: "", art: "Aktie · Long", venue: "Tradegate", currency: "EUR", entry: "", stop: "", skim: "", target: "", these: "", anti_these: "", kill_triggers: [] };
    const KILL_SUGGEST = ["iran_ceasefire", "hormus_resumed", "recession_eu", "capex_cut", "sektor_drift_down", "fed_hawkish_shock", "usd_crash", "china_export_ban", "earnings_miss", "esma_ban", "oil_supply_shock"];
    const normTag = (s) => String(s || "").toLowerCase().trim().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);
    const killTagsOf = (p) => Array.isArray(p && p.kill_triggers) ? p.kill_triggers : (p && p.kill ? String(p.kill).split(/\s*·\s*/).map((x) => x.trim()).filter(Boolean) : []);
    const [addF, setAddF] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [addBusy, setAddBusy] = useState(false);
    const [addMode, setAddMode] = useState("manual");
    const [addSrc, setAddSrc] = useState(null);
    const [hunter, setHunter] = useState(null);
    const [hunterBusy, setHunterBusy] = useState(false);
    const [checkId, setCheckId] = useState(null);
    const [checkMsg, setCheckMsg] = useState({});
    const [chartBusy, setChartBusy] = useState(null);
    const [chartConfirm, setChartConfirm] = useState(null);
    const [tagInput, setTagInput] = useState("");
    const [suggestBusy, setSuggestBusy] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestErr, setSuggestErr] = useState("");
    const [aiBusy, setAiBusy] = useState(null); // "these" | "anti" | null
    const [aiErr, setAiErr] = useState({});
    const [flash, setFlash] = useState(null);
    const showFlash = (msg, kind) => { setFlash({ msg: msg, kind: kind || "" }); setTimeout(() => setFlash(null), 4500); };

    useEffect(() => {
      fetch(API + "/api/me", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        if (d && d.onboardingRequired) { window.location.href = "account.html"; return; }
        const ok = d && d.ok && PRIV.indexOf(d.tier) !== -1 && d.approval === "approved";
        setGate(ok ? "ok" : "locked");
      }).catch(() => setGate("locked"));
    }, []);
    useEffect(() => {
      if (gate !== "ok") return;
      injectCSS();
      fetch(API + "/api/mybook", { credentials: "include" }).then((r) => {
        if (r.status === 401 || r.status === 403) { if (window.PYsessionExpired) window.PYsessionExpired(); setLoaded(true); return null; }
        return r.ok ? r.json() : null;
      }).then((d) => {
        if (d && d.ok && Array.isArray(d.topics)) {
          setRows(d.topics);
          // Deep-Link aus der Shortlist: ?isin= (oder ?topic=) -> passendes Topic öffnen + scrollen.
          try {
            const qp = new URLSearchParams(window.location.search);
            const qisin = (qp.get("isin") || "").trim();
            const qtopic = (qp.get("topic") || "").trim();
            if (qisin || qtopic) {
              const hit = d.topics.find((x) => (qtopic && String(x.id) === qtopic) || (qisin && String(x.isin || "").toUpperCase() === qisin.toUpperCase()));
              if (hit) { setOpen(hit.id); setTimeout(() => { const el = document.getElementById("mb-" + hit.id); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 200); }
            }
          } catch (e) { }
        }
        setLoaded(true);
      }).catch(() => setLoaded(true));
    }, [gate]);
    // Auto-Refresh: hält Live-Kurs + P&L frisch, ohne Reload (pausiert bei Hintergrund-Tab / außerhalb Börsenzeit)
    useEffect(() => {
      if (gate !== "ok") return;
      const tick = () => {
        if (document.hidden || !inMarketHours()) return;
        fetch(API + "/api/mybook", { credentials: "include" })
          .then((r) => (r && r.ok ? r.json() : null))
          .then((d) => { if (d && d.ok && Array.isArray(d.topics)) setRows(d.topics); })
          .catch(() => { });
      };
      const iv = setInterval(tick, 90000);
      return () => clearInterval(iv);
    }, [gate]);

    if (gate === "loading") return h("div", null, h(SiteNav, { active: "mybook.html" }), h("div", { style: { minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 22, color: "var(--text-oracle)" } }, T("Das Orakel prüft deinen Zugang…", "The oracle checks your access…")), h(SiteFooter, null));
    if (gate === "locked") return h("div", null, h(SiteNav, { active: "mybook.html" }), h("section", { style: { minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" } }, h("div", { style: { maxWidth: 480 } }, h(PyEyebrow, null, "Syndicate"), h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 44, margin: "8px 0 0", color: "var(--text-primary)" } }, T("My Book lebt im Syndicate.", "My Book lives in the Syndicate.")), h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", margin: "16px 0 28px" } }, T("Dein persönliches Thesen-Buch — Trades tracken, These beobachten, Alerts setzen — ist dem Syndicate vorbehalten.", "Your personal thesis book — track trades, watch the thesis, set alerts — is reserved for the Syndicate.")), h(Button, { variant: "oracle", onClick: () => { window.location.href = "account.html"; } }, T("Zum Account", "Go to account")))), h(SiteFooter, null));

    const sfx = (n) => { if (typeof window.PYsfx === "function") window.PYsfx(n); };
    const api = (path, body, method) => fetch(API + path, { method: method || "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined }).then((r) => { if (r && (r.status === 401 || r.status === 403) && window.PYsessionExpired) window.PYsessionExpired(); return r; }).catch(() => { });
    const patch = (id, body) => api("/api/mybook/" + id, body, "PATCH");
    const reload = () => fetch(API + "/api/mybook", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => { if (d && d.ok && Array.isArray(d.topics)) setRows(d.topics); }).catch(() => { });
    const setMon = (id, on, channel) => { setRows((rs) => rs.map((r) => r.id === id ? Object.assign({}, r, { monitored: on, channel: on ? (channel === "both" ? "SMS + Mail" : channel === "sms" ? "SMS" : "Mail") : null }) : r)); api("/api/mybook/" + id + "/monitor", { on: on, channel: channel || "mail" }); };
    const toggleMon = (p) => { sfx("button-004-toggle"); if (p.monitored) setMon(p.id, false); else { setMonCh("mail"); setMonModal(p.id); } };
    const confirmMon = () => { setMon(monModal, true, monCh); setMonModal(null); };
    const openEdit = (p) => { setEditingId(p.id); setTagInput(""); resetSuggest(); setAddF({ name: p.name || "", isin: p.isin || "", issuer: p.issuer || "", idx: p.idx || "", art: p.art || "Aktie · Long", venue: p.venue || "Tradegate", currency: p.currency || "EUR", entry: p.entry || "", stop: p.stop || "", skim: p.skim || "", target: p.target || "", these: p.these || "", anti_these: p.anti_these || "", kill_triggers: killTagsOf(p) }); };
    const checkedTime = (iso) => { try { if (!iso) return ""; const d = new Date(iso); if (isNaN(d.getTime())) return ""; return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
    const liveTsOf = (p) => checkedTime(p.updated || p.updated_at || p.live_updated_at || p.quote_updated_at || p.price_updated_at || "");
    const chkTsOf = (p) => checkedTime(p.last_checked_at || p.lastCheckedAt || p.checked_at || "");
    const checkThesis = (p) => {
      setCheckId(p.id); setCheckMsg((m) => Object.assign({}, m, { [p.id]: "" }));
      fetch(API + "/api/mybook/" + p.id + "/check-thesis", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: "{}" })
        .then((r) => {
          if (r && (r.status === 401 || r.status === 403) && window.PYsessionExpired) { window.PYsessionExpired(); return null; }
          if (r && r.status === 429) return { cooldown: true };
          return r && r.ok ? r.json() : null;
        })
        .then((res) => {
          setCheckId(null);
          if (!res) return;
          if (res.cooldown) { setCheckMsg((m) => Object.assign({}, m, { [p.id]: T("Cooldown — gerade erst geprüft. Versuch's in ein paar Minuten.", "Cooldown — just checked. Try again in a few minutes.") })); return; }
          if (res.ok) setRows((rs) => rs.map((r) => {
            if (r.id !== p.id) return r;
            const zone = (res.zone != null) ? res.zone : r.zone;
            const upd = Object.assign({}, r, {
              score: res.score,
              zone: zone,
              waage_pct: (typeof res.score === "number" ? wpct(res.score) : r.waage_pct),
              waage_label: res.waage_label || ZONE[((zone || 3) - 1)] || r.waage_label,
              einschaetzung: res.einschaetzung,
              last_checked_at: res.last_checked_at
            });
            // Status-Pill mitziehen: frischen Backend-Status nehmen, sonst null -> Fallback rechnet aus neuem Thesen-Label + live/entry neu.
            upd.status = (res.status && res.status.key) ? res.status : null;
            return upd;
          }));
        })
        .catch(() => setCheckId(null));
    };
    const chartMail = (p) => {
      if (chartBusy) return;
      setChartBusy(p.id);
      fetch(API + "/api/mybook/" + p.id + "/chart", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deliver: "mail" }) })
        .then((r) => {
          if (r && (r.status === 401 || r.status === 403)) { if (window.PYsessionExpired) window.PYsessionExpired(); return null; }
          if (r && r.status === 429) return { cooldown: true };
          return r && r.ok ? (r.json().catch(() => ({ ok: true }))) : { err: true };
        })
        .then((res) => {
          setChartBusy(null);
          if (!res) return;
          if (res.cooldown) { showFlash(T("Chart-Analyse läuft gerade schon — gleich kommt die Mail.", "Chart analysis already running — the mail is on its way."), "ok"); return; }
          if (res.err) { showFlash(T("Chart-Analyse konnte nicht ausgelöst werden — versuch es gleich nochmal.", "Couldn't trigger the chart analysis — try again shortly.")); return; }
          showFlash(T("Warren rendert deine Chart-Analyse — kommt in 1–2 Min per Mail.", "Warren is rendering your chart analysis — arrives by mail in 1–2 min."), "ok");
        })
        .catch(() => { setChartBusy(null); showFlash(T("Netzwerkfehler — versuch es gleich nochmal.", "Network error — try again shortly.")); });
    };
    const setSource = (id, src) => {
      setRows((rs) => rs.map((r) => r.id === id ? Object.assign({}, r, { tracking_source: src }) : r));
      patch(id, { tracking_source: src });
      setTimeout(() => checkThesis({ id: id }), 250); // Score sofort auf neue Source aktualisieren
    };
    const toggleMirror = (p) => {
      if (p.tracking_source !== "member_only") { sfx("button-004-toggle"); setMirrorModal(p.id); return; } // an → aus: Bestätigung
      if (!p.oracle_mirror_available) { showFlash(T("Diese These ist kein aktiver Orakel-Trade — Orakel-Mirror nicht möglich. Du kannst nur Beobachten & Alerts schalten.", "This thesis is not an active oracle trade — oracle mirror isn't available. You can only toggle monitoring & alerts.")); return; }
      sfx("button-004-toggle"); setSource(p.id, "oracle"); // aus → an: nur wenn Orakel-These vorhanden
    };
    const confirmMirrorOff = () => { if (mirrorModal) setSource(mirrorModal, "member_only"); setMirrorModal(null); };
    const doDelete = () => { api("/api/mybook/" + delId, null, "DELETE"); setRows((rs) => rs.filter((r) => r.id !== delId)); setDelId(null); };
    // Action-Required-Buttons (Soll-Mapping → PATCH; VC bestätigt Feld-Namen)
    const doAction = (p, act) => {
      if (act === "edit") { openEdit(p); return; }
      if (act === "ask_warren") { if (typeof window.PYchatOpen === "function") { var lbl = thesisPill(p).l; window.PYchatOpen(T("Mein Topic „" + p.name + "“ wurde vom Orakel als „" + lbl + "“ gemeldet. Was ist da genau los, und was sollte ich jetzt beachten?", "The oracle flagged my topic „" + p.name + "“ as „" + lbl + "“. What exactly is going on, and what should I consider now?")); } return; }
      if (act === "close") { api("/api/mybook/" + p.id, { state: "closed" }, "PATCH"); setRows((rs) => rs.filter((r) => r.id !== p.id)); return; }
      if (act === "member_only") { patch(p.id, { tracking_source: "member_only", action_required: false }); setRows((rs) => rs.map((r) => r.id === p.id ? Object.assign({}, r, { tracking_source: "member_only", action_required: false }) : r)); return; }
      // keep
      patch(p.id, { action_required: false }); setRows((rs) => rs.map((r) => r.id === p.id ? Object.assign({}, r, { action_required: false }) : r));
    };
    const count = rows.length;
    const delName = (rows.find((r) => r.id === delId) || {}).name || "Dieses Topic";
    const addTopic = () => { setEditingId(null); setAddMode("manual"); setAddSrc(null); setTagInput(""); resetSuggest(); setAddF(Object.assign({}, BLANK)); };
    const closeForm = () => { setAddF(null); setEditingId(null); setAddSrc(null); resetSuggest(); };
    const loadHunter = () => { setHunterBusy(true); fetch(API + "/api/mybook/hunter-shortlist", { credentials: "include" }).then((r) => { if (r && (r.status === 401 || r.status === 403) && window.PYsessionExpired) window.PYsessionExpired(); return r && r.ok ? r.json() : null; }).then((d) => { setHunter(d && d.ok && Array.isArray(d.trades) ? d.trades : []); setHunterBusy(false); }).catch(() => { setHunter([]); setHunterBusy(false); }); };
    const goMode = (m) => { setAddMode(m); if (m === "oracle" && hunter === null && !hunterBusy) loadHunter(); };
    const pickHunter = (t) => {
      const firstSkim = (t.skim_levels || "").split(",")[0].trim();
      setAddF({ name: t.asset || "", isin: t.isin || "", issuer: "", idx: "", art: t.art || "Aktie · Long", venue: "Tradegate", currency: "EUR", entry: numStr(t.entry), stop: numStr(t.stop), skim: firstSkim ? numStr(parseFloat(firstSkim)) : "", target: numStr(t.target), these: t.thesis || "", anti_these: "", kill_triggers: (t.thesis_kill_triggers || []).slice(0, 12) });
      setTagInput(""); resetSuggest(); setAddSrc("oracle"); setAddMode("manual");
    };
    const setAf = (k, v) => setAddF((o) => Object.assign({}, o, { [k]: v }));
    const tags = () => (addF && Array.isArray(addF.kill_triggers)) ? addF.kill_triggers : [];
    const addTag = (raw) => { const t = normTag(raw); setTagInput(""); if (!t) return; const cur = tags(); if (cur.indexOf(t) !== -1 || cur.length >= 12) return; setAf("kill_triggers", cur.concat([t])); };
    const removeTag = (t) => setAf("kill_triggers", tags().filter((x) => x !== t));
    const resetSuggest = () => { setSuggestions([]); setSuggestErr(""); setSuggestBusy(false); setAiBusy(null); setAiErr({}); };
    // Warren-Vorschlag für These / Anti-These (Freitext-Feld direkt befüllen).
    const askWarrenField = (kind) => {
      if (aiBusy || !addF) return;
      if (kind === "these" && !(addF.name || "").trim()) { setAiErr((e) => Object.assign({}, e, { these: T("Bitte zuerst den Namen ausfüllen.", "Please fill in the name first.") })); return; }
      if (kind === "anti" && (addF.these || "").trim().length < 30) { setAiErr((e) => Object.assign({}, e, { anti: T("Schreib zuerst deine These (mind. 30 Zeichen).", "Write your thesis first (at least 30 chars).") })); return; }
      setAiErr((e) => Object.assign({}, e, { [kind]: "" })); setAiBusy(kind);
      const ep = kind === "these" ? "/api/mybook/suggest-thesis" : "/api/mybook/suggest-anti-these";
      fetch(API + ep, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: (addF.name || "").trim(), isin: (addF.isin || "").trim(), art: addF.art || "", idx: (addF.idx || "").trim(), these: addF.these || "" }) })
        .then((r) => r.json().then((j) => ({ status: r.status, ok: r.ok, j: j || {} })).catch(() => ({ status: r && r.status, ok: !!(r && r.ok), j: {} })))
        .then((res) => {
          setAiBusy(null);
          const j = res.j || {}, code = String(j.error || "").toLowerCase();
          const setErr = (m) => setAiErr((e) => Object.assign({}, e, { [kind]: m }));
          if (res.ok) { const sug = String(j.suggestion || j.text || "").trim(); if (!sug) setErr(T("Kein Vorschlag erhalten.", "No suggestion returned.")); else setAf(kind === "these" ? "these" : "anti_these", sug); return; }
          if (res.status === 401 || code === "unauthorized") { if (window.PYsessionExpired) window.PYsessionExpired(); return; }
          if (res.status === 403 || code === "syndicate_only") { setErr(T("Warren-Vorschläge sind dem Syndicate vorbehalten.", "Warren suggestions are reserved for the Syndicate.")); return; }
          if (code === "these_too_short") { setErr(T("Schreib zuerst deine These (mind. 30 Zeichen).", "Write your thesis first (at least 30 chars).")); return; }
          if (code === "name_required") { setErr(T("Bitte zuerst den Namen ausfüllen.", "Please fill in the name first.")); return; }
          if (res.status === 429 || code === "cooldown") { const s = Math.max(1, parseInt(j.cooldown_seconds_remaining, 10) || 30); setErr(T("Kurz warten — in ", "Hold on — try again in ") + s + T(" s nochmal.", "s.")); return; }
          if (res.status === 502 || code === "suggester_failed") { setErr(T("Warren ist gerade überlastet — versuch es gleich nochmal.", "Warren is busy right now — try again shortly.")); return; }
          setErr(T("Konnte gerade nicht — versuch es nochmal.", "Couldn't do that — try again."));
        })
        .catch(() => { setAiBusy(null); setAiErr((e) => Object.assign({}, e, { [kind]: T("Netzwerkfehler — versuch es nochmal.", "Network error — try again.") })); });
    };
    const acceptSuggestion = (s) => { addTag(s.tag); setSuggestions((ss) => ss.filter((x) => x.tag !== s.tag)); };
    const askWarrenTags = () => {
      if (suggestBusy || !addF) return;
      const theseTxt = (addF.these || "").trim();
      if (!addF.name || !addF.name.trim()) { setSuggestErr(T("Gib zuerst den Namen ein.", "Enter the name first.")); return; }
      if (theseTxt.length < 30) { setSuggestErr(T("Schreib zuerst deine These (mind. 30 Zeichen).", "Write your thesis first (at least 30 chars).")); return; }
      setSuggestErr(""); setSuggestBusy(true);
      fetch(API + "/api/mybook/suggest-kill-triggers", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: addF.name.trim(), isin: (addF.isin || "").trim(), these: theseTxt, anti_these: addF.anti_these || "", art: addF.art || "" }) })
        .then((r) => {
          if (!r) return { err: true };
          if (r.status === 401) { if (window.PYsessionExpired) window.PYsessionExpired(); return null; }
          if (r.status === 403) return { forbidden: true };
          if (r.status === 429) return r.json().catch(() => ({})).then((j) => ({ cooldown: true, sec: (j && j.cooldown_seconds_remaining) || 60 }));
          if (r.status === 400) return r.json().catch(() => ({})).then((j) => ({ badreq: true, code: (j && j.error) || "" }));
          return r.ok ? r.json() : { err: true };
        })
        .then((res) => {
          setSuggestBusy(false);
          if (!res) return;
          if (res.forbidden) { setSuggestErr(T("Tag-Vorschläge sind dem Syndicate vorbehalten.", "Tag suggestions are reserved for the Syndicate.")); return; }
          if (res.cooldown) { setSuggestErr(T("Warren hat gerade nachgedacht — in ", "Warren just thought — try again in ") + res.sec + T(" s nochmal.", " s.")); return; }
          if (res.badreq) { setSuggestErr(res.code === "these_too_short" ? T("Schreib zuerst deine These (mind. 30 Zeichen).", "Write your thesis first (at least 30 chars).") : T("Bitte Name + These ausfüllen.", "Please fill in name + thesis.")); return; }
          if (res.err || !res.ok) { setSuggestErr(T("Warren ist gerade nicht erreichbar — gleich nochmal.", "Warren is unavailable right now — try again shortly.")); return; }
          const cur = tags();
          const sug = (res.suggestions || []).filter((s) => s && s.tag && cur.indexOf(normTag(s.tag)) === -1);
          setSuggestions(sug);
          if (!sug.length) setSuggestErr(T("Keine neuen Vorschläge — deine Tags decken es schon ab.", "No new suggestions — your tags already cover it."));
        })
        .catch(() => { setSuggestBusy(false); setSuggestErr(T("Netzwerkfehler — gleich nochmal.", "Network error — try again shortly.")); });
    };
    // ISIN-Dedup: gegen bereits geladene Topics (kein extra Fetch nötig)
    const isinDup = (function () { const iv = ((addF && addF.isin) || "").trim().toUpperCase(); if (iv.length < 12) return null; const hit = rows.find((r) => String(r.isin || "").trim().toUpperCase() === iv && String(r.state || "").toLowerCase().indexOf("closed") === -1 && (!editingId || r.id !== editingId)); return hit || null; })();
    const _en = addF ? deNum(addF.entry) : null, _st = addF ? deNum(addF.stop) : null, _short = !!(addF && /Short/i.test(addF.art || ""));
    const stopOk = (!addF || _en == null || _st == null) ? true : (_short ? _st > _en : _st < _en);
    const stopErr = stopOk ? "" : (_short ? T("Bei Short muss der Stop ÜBER dem Entry liegen.", "For short, stop must be ABOVE entry.") : T("Bei Long muss der Stop UNTER dem Entry liegen.", "For long, stop must be BELOW entry."));
    const ERRMAP = (code, d) => {
      const c = String(code || "").toLowerCase();
      if (c === "these_too_short") return T("Deine These ist zu kurz — mindestens 50 Zeichen.", "Your thesis is too short — at least 50 characters.");
      if (c === "anti_these_too_short") return T("Die Anti-These ist zu kurz — mindestens 30 Zeichen.", "The anti-thesis is too short — at least 30 characters.");
      if (c === "kill_triggers_required" || c === "kill_triggers_too_few") return T("Mindestens 3 Kill-Trigger-Tags — für breitere News-Abdeckung. „Warren fragen“ hilft.", "At least 3 kill-trigger tags — for broader news coverage. Try “Ask Warren”.");
      if (c === "stop_invalid_for_long") return T("Bei Long muss der Stop UNTER dem Entry liegen.", "For long, stop must be BELOW entry.");
      if (c === "stop_invalid_for_short") return T("Bei Short muss der Stop ÜBER dem Entry liegen.", "For short, stop must be ABOVE entry.");
      if (c === "book_full") return T("Dein Buch ist voll (12/12). Erst Platz schaffen.", "Your book is full (12/12). Make room first.");
      return (d && d.hint) || T("Konnte nicht angelegt werden.", "Could not be created.");
    };
    const trimLen = (s) => (s || "").trim().length;
    const formValid = !!(addF && addF.name.trim() && trimLen(addF.these) >= 50 && trimLen(addF.anti_these) >= 30 && tags().length >= 3 && stopOk && !isinDup);
    const formMiss = !addF ? "" : (
      !addF.name.trim() ? T("Name fehlt.", "Name missing.") :
      trimLen(addF.these) < 50 ? (T("These — noch ", "Thesis — ") + (50 - trimLen(addF.these)) + T(" Zeichen.", " more chars.")) :
      trimLen(addF.anti_these) < 30 ? (T("Anti-These — noch ", "Anti-thesis — ") + (30 - trimLen(addF.anti_these)) + T(" Zeichen.", " more chars.")) :
      tags().length < 3 ? (T("Kill-Trigger-Tags — noch ", "Kill-trigger tags — ") + (3 - tags().length) + T(" (mind. 3 · „Warren fragen“ hilft).", " more (min. 3 · try “Ask Warren”).")) :
      !stopOk ? stopErr :
      isinDup ? T("Diese ISIN ist schon in deinem Buch.", "This ISIN is already in your book.") : "");
    const submitAdd = () => {
      const f = addF; if (!formValid) { showFlash(T("Zum Speichern fehlt noch: ", "Still needed to save: ") + formMiss); return; }
      const body = { name: f.name.trim(), isin: (f.isin || "").trim(), issuer: f.issuer, market: (f.idx || "").trim(), art: f.art, venue: f.venue, currency: f.currency, entry: deNum(f.entry), stop: deNum(f.stop), skim: deNum(f.skim), target: deNum(f.target), these: f.these, anti_these: f.anti_these, kill_triggers: tags() };
      if (!editingId && addSrc) body.tracking_source = addSrc; // aus Orakel gepickt → oracle; sonst nicht senden (Backend default member_only)
      // optimistische Anzeige (gilt sofort); KEIN blindes Reload (Notion-Latenz würde zurückspringen)
      const opt = { name: f.name.trim(), isin: (f.isin || "").trim(), issuer: f.issuer, idx: (f.idx || "").trim(), art: f.art, venue: f.venue, currency: f.currency, entry: f.entry, stop: f.stop, skim: f.skim, target: f.target, these: f.these, anti_these: f.anti_these, kill_triggers: tags() };
      const readJson = (res) => (res && res.json) ? res.json().then((d) => ({ status: res.status, d })).catch(() => ({ status: res.status, d: null })) : { status: 0, d: null };
      if (editingId) {
        const id = editingId;
        setRows((rs) => rs.map((r) => r.id === id ? Object.assign({}, r, opt) : r));
        api("/api/mybook/" + id, body, "PATCH").then(readJson).then(({ d }) => { if (d && d.ok && d.topic) setRows((rs) => rs.map((r) => r.id === id ? Object.assign({}, r, d.topic) : r)); else if (d && d.ok === false) showFlash(ERRMAP(d.error, d)); });
      } else {
        const tempId = "tmp-" + Date.now();
        setRows((rs) => rs.concat([Object.assign({ id: tempId, live: "", score: 0, zone: 3, waage_pct: 50, monitored: false, channel: null, state: "active", tracking_source: "member_only", action_required: false }, opt)]));
        setOpen(tempId);
        api("/api/mybook", body, "POST").then(readJson).then(({ status, d }) => {
          if (d && d.topic) { setRows((rs) => rs.map((r) => r.id === tempId ? Object.assign({}, r, d.topic) : r)); return; }
          setRows((rs) => rs.filter((r) => r.id !== tempId)); // Fehler → optimistische Zeile zurück
          const code = String((d && d.error) || "").toLowerCase();
          if (status === 409 || code.indexOf("isin_already") !== -1) {
            const ex = rows.find((r) => String(r.isin || "").trim().toUpperCase() === (body.isin || "").toUpperCase()) || (d && d.existing_topic_id ? { id: d.existing_topic_id, name: d.existing_topic_name } : null);
            if (ex) { setOpen(ex.id); showFlash(T("Diese ISIN steckt schon in deinem Buch (", "This ISIN is already in your book (") + (ex.name || d.existing_topic_name || "") + T(") — geöffnet.", ") — opened.")); }
            else showFlash(T("Diese ISIN steckt schon in deinem Buch.", "This ISIN is already in your book."));
            return;
          }
          showFlash(ERRMAP(code, d));
        });
      }
      closeForm();
    };
    const isinLookup = () => {
      const isin = ((addF && addF.isin) || "").trim(); if (!isin) return;
      setAddBusy(true);
      fetch(API + "/api/mybook/isin-lookup?isin=" + encodeURIComponent(isin), { credentials: "include" })
        .then((r) => { if (r && (r.status === 401 || r.status === 403) && window.PYsessionExpired) window.PYsessionExpired(); return r.ok ? r.json() : null; })
        .then((d) => { const s = d && d.ok && (d.instrument || d.suggestion); if (s) setAddF((o) => Object.assign({}, o || BLANK, { name: s.name || (o && o.name) || "", issuer: s.issuer || (o && o.issuer) || "", idx: s.market || (o && o.idx) || "", art: s.art || (o && o.art) || "Aktie · Long", currency: s.currency || (o && o.currency) || "EUR", venue: s.venue || (o && o.venue) || "Tradegate" })); setAddBusy(false); })
        .catch(() => setAddBusy(false));
    };
    const numStr = (n) => (n == null ? "" : String(n).replace(".", ","));
    const onVision = (e) => {
      const file = e.target.files && e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const b64 = String(reader.result).split(",")[1];
        setAddBusy(true);
        fetch(API + "/api/mybook/vision-extract", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: b64, mime_type: file.type }) })
          .then((r) => { if (r && (r.status === 401 || r.status === 403) && window.PYsessionExpired) window.PYsessionExpired(); return r.ok ? r.json() : null; })
          .then((d) => {
            if (d && d.ok && d.suggestion) {
              const s = d.suggestion;
              setAddF((o) => Object.assign({}, o || BLANK, { name: s.name || (o && o.name) || "", isin: s.isin || (o && o.isin) || "", issuer: s.issuer || (o && o.issuer) || "", art: s.art || (o && o.art) || "Aktie · Long", venue: s.venue || (o && o.venue) || "Tradegate", currency: s.currency || "EUR", entry: numStr(s.entry), stop: numStr(s.stop), skim: numStr(s.skim), target: numStr(s.target), these: s.these_hint || (o && o.these) || "" }));
            }
            setAddBusy(false);
          }).catch(() => setAddBusy(false));
      };
      reader.readAsDataURL(file);
    };
    const Fld = (o) => { const len = ((addF && addF[o.k]) || "").trim().length; const ok = o.min ? len >= o.min : true; const aiDisabled = aiBusy === o.ai || (o.ai === "anti" && ((addF && addF.these) || "").trim().length < 30) || (o.ai === "these" && !((addF && addF.name) || "").trim()); return h("div", { key: o.k, className: "f" + (o.full ? " f-full" : "") },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 } },
        h("label", { className: "f-l" }, o.label, o.req ? h("span", { style: { color: "var(--ox-b)" } }, " *") : null),
        h("div", { style: { display: "flex", alignItems: "center", gap: 9, flexShrink: 0 } },
          o.min ? h("span", { className: "f-cnt" + (ok ? " ok" : "") }, len + "/" + o.min) : null,
          o.ai ? h("button", { className: "askwarren", disabled: aiDisabled, title: aiDisabled && o.ai === "anti" ? T("Erst These schreiben (≥ 30 Zeichen)", "Write the thesis first (≥ 30 chars)") : (aiDisabled && o.ai === "these" ? T("Erst den Namen ausfüllen", "Fill in the name first") : ""), onClick: () => askWarrenField(o.ai) }, aiBusy === o.ai ? T("Warren überlegt…", "Warren is thinking…") : T("Warren fragen", "Ask Warren")) : null)),
      o.area ? h("textarea", { className: "f-i", rows: o.rows || 2, value: addF[o.k], placeholder: o.ph || "", onChange: (e) => setAf(o.k, e.target.value) })
             : h("input", { className: "f-i", value: addF[o.k], placeholder: o.ph || "", onChange: (e) => setAf(o.k, e.target.value) }),
      o.hint ? h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--text-muted)", marginTop: 4 } }, o.hint) : null,
      o.err ? h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--ox-b)", marginTop: 4 } }, o.err) : null,
      (o.ai && aiErr[o.ai]) ? h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--ox-b)", marginTop: 4 } }, aiErr[o.ai]) : null); };
    const Sel = (o) => h("div", { key: o.k, className: "f" },
      h("label", { className: "f-l" }, o.label),
      h("select", { className: "f-i", value: addF[o.k], onChange: (e) => setAf(o.k, e.target.value) }, o.opts.map((op) => h("option", { key: op, value: op }, op))));

    const Topic = (p) => {
      const isOpen = open === p.id;
      const cs = consolidatedStatus(p);
      return h("div", { key: p.id, id: "mb-" + p.id, className: "topic" + (isOpen ? " open" : "") },
        h("div", { className: "orow", onClick: () => { sfx(isOpen ? "button-001-itemclose" : "button-002-itemopen"); setOpen(isOpen ? null : p.id); } },
          h("div", { className: "c-mon" }, h("span", { className: "mon-lbl" }, T("Beobachten", "Monitor")), h("button", { className: "sw " + (p.monitored ? "on" : "off"), onClick: (e) => { e.stopPropagation(); toggleMon(p); } }, h("span", { className: "knob" }))),
          h("div", { className: "c-topic" }, h("div", { className: "nm" }, p.name), h("div", { className: "t-meta" },
            h("span", { className: "badge idx" }, p.idx),
            h("span", { className: "badge long" }, p.art),
            p.tracking_source === "oracle" ? h("span", { className: "badge src-oracle" }, T("Orakel", "Oracle")) : (p.tracking_source === "member_only" ? h("span", { className: "badge src-self" }, T("Du trackst", "You track")) : null),
            p.action_required ? h("span", { className: "ar-pill" }, T("Schau hin", "Look")) : null,
            h("span", { className: "isin" }, p.isin + " · " + T("Kurs", "Last") + " " + ((p.live != null && String(p.live) !== "" && String(p.live) !== "null") ? p.live : "—") + (p.currency ? " " + p.currency : "")),
            liveTsOf(p) ? h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginLeft: 8 }, title: T("Letztes Kurs-Update", "Last price update") }, T("Aktualisiert um ", "Updated at ") + liveTsOf(p)) : null)),
          h("div", { className: "c-stat" }, h("span", { className: "cpill " + cs.cls, title: cs.tip }, cs.label)),
          h("div", { className: "c-trig" }, h(Marks, { p }), p.currency ? h("div", { className: "cur" }, p.currency) : null),
          h("div", { className: "c-act" },
            h("span", { className: "det" + (isOpen ? " x" : ""), title: isOpen ? T("Schließen", "Close") : T("Details", "Details") }, isOpen ? "✕" : T("Details ▾", "Details ▾")),
            h("button", { className: "bedit", onClick: (e) => { e.stopPropagation(); openEdit(p); } }, T("Bearbeiten", "Edit")))),
        isOpen ? h("div", { className: "dpanel" }, h("div", { className: "dwrap" },
          h("div", { className: "mirror-row" },
            h("button", { className: "sw " + (p.tracking_source !== "member_only" ? "on" : "off") + ((p.tracking_source === "member_only" && !p.oracle_mirror_available) ? " locked" : ""), onClick: () => toggleMirror(p) }, h("span", { className: "knob" })),
            h("div", null,
              h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" } }, T("Orakel-Mirror", "Oracle mirror")),
              h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" } }, p.tracking_source === "member_only" ? (p.oracle_mirror_available ? T("du trackst selbst — antippen, um den Orakel-Score zu spiegeln", "you track yourself — tap to mirror the oracle score") : T("kein Orakel-Trade — nur Beobachten & Alerts (kein Mirror)", "not an oracle trade — monitoring & alerts only (no mirror)")) : (p.oracle_mirror_available ? T("spiegelt den Orakel-Score", "mirrors the oracle score") : T("Orakel-Trade aktuell inaktiv — bewertet gegen deine Marken", "oracle trade currently inactive — scored against your levels"))))),
          p.action_required ? h("div", { className: "ar-banner" },
            h("div", { className: "ar-head" }, T("Das Orakel meldet einen Bruch", "The oracle reports a break")),
            h("div", { className: "ar-reason" }, p.action_reason || T("Eine Kurs-Marke oder ein Kill-Trigger wurde berührt.", "A price level or kill-trigger was hit.")),
            h("div", { className: "ar-btns" },
              h("button", { className: "arb keep", onClick: () => doAction(p, "keep") }, T("Behalten", "Keep")),
              h("button", { className: "arb", onClick: () => doAction(p, "edit") }, T("Marken anpassen", "Adjust levels")),
              h("button", { className: "arb", onClick: () => doAction(p, "member_only") }, T("Weiter laufen lassen", "Let it run")),
              h("button", { className: "arb close", onClick: () => doAction(p, "close") }, T("Schließen", "Close")),
              h("button", { className: "arb warren", onClick: () => doAction(p, "ask_warren") }, T("Frag Warren", "Ask Warren")))) : null,
          h("div", { className: "statrow" },
            h("div", { className: "stcol" }, h("div", { className: "tlbl" }, T("Thesen-Stärke", "Thesis health")), h(Mini, { p })),
            (p.position_risk_label || p.position_risk_pct != null) ? h("div", { className: "stcol" }, h("div", { className: "tlbl" }, T("Positions-Risiko", "Position risk")), h(PosBar, { p })) : null,
            h("div", { className: "tworow" }, T("Positions-Risiko: misst, wie weit der Kurs vom Entry weg ist und wie nah am Stop. Thesen-Stärke: misst die Story — halten die Annahmen vom Setup? News, Sektor, Catalyst-Status. Beide sind getrennt, denn der Markt kann gegen dich laufen, ohne dass die Story bricht; und die Story kann brechen, bevor der Kurs es zeigt.", "Position risk: measures how far price is from entry and how close to the stop. Thesis health: measures the story — do the assumptions from the setup still hold? News, sector, catalyst status. They are separate, because the market can move against you without the story breaking; and the story can break before price shows it."))),
          h("div", { className: "topgrid" },
            h("div", { className: "einscol" },
              p.einschaetzung ? h("div", { className: "einsbox" },
                h("div", { className: "tlbl" }, T("Warrens Einschätzung", "Warren's read"), h("span", { style: { cursor: "help", color: "var(--text-muted)", marginLeft: 7, fontSize: 11 }, title: T("Warren bewertet die These automatisch, wenn der Kurs deutlich gelaufen ist oder eine Marke berührt wurde. Du kannst jederzeit selbst eine frische Bewertung anfordern.", "Warren re-checks the thesis automatically when price has moved significantly or a level was touched. You can request a fresh read anytime.") }, "(?)")),
                h("div", { className: "einstext" }, p.einschaetzung),
                chkTsOf(p) ? h("div", { className: "einschk" }, T("Geprüft ", "Checked ") + chkTsOf(p)) : null) : null,
              checkMsg[p.id] ? h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--ox-b)", marginTop: 10 } }, checkMsg[p.id]) : null),
            h("div", { className: "actcol2" },
              h("button", { className: "bline chk", disabled: checkId === p.id, onClick: () => checkThesis(p) }, checkId === p.id ? T("Prüfe…", "Checking…") : T("These prüfen", "Check thesis")),
              h("button", { className: "bline" + (chartBusy === p.id ? " saving" : ""), disabled: chartBusy === p.id, onClick: () => setChartConfirm(p) }, chartBusy === p.id ? T("sende…", "sending…") : T("Chart-Analyse per Mail", "Chart analysis by mail")),
              // 10.07.2026 (Daniel-Wunsch): Topic-Chat pro Item — gleicher Pfad wie ask_warren.
              h("button", { className: "bline", onClick: () => askWarrenTopic(p) }, T("Mit Warren besprechen", "Discuss with Warren")))),
          h("div", { className: "tlbl", style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
            h("span", null, T("Exit-Plan · R-Leiter", "Exit plan · R-ladder")),
            h("button", { onClick: (e) => { e.stopPropagation(); sfx("button-004-toggle"); setLadderOpen(ladderOpen === p.id ? null : p.id); }, style: { background: "none", border: "1px solid var(--border-strong, #2a2f39)", borderRadius: 6, color: "var(--oracle-b, #D4A94E)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em", padding: "3px 11px", cursor: "pointer" } }, ladderOpen === p.id ? T("schließen ▴", "close ▴") : T("öffnen ▾", "open ▾"))),
          ladderOpen === p.id ? MbLadder(p) : null,
          h("div", { className: "tlbl" }, T("Deine These", "Your thesis")),
          h("div", { className: "these" }, p.these),
          h("div", { className: "tlbl", style: { color: "var(--ox-b)" } }, T("Anti-These", "Anti-thesis")),
          (p.anti_these || p.kill) ? h("div", { className: "antit" }, p.anti_these || p.kill) : h("div", { className: "kill" }, T("— keine Anti-These hinterlegt.", "— no anti-thesis on file.")),
          h("div", { className: "tlbl" }, T("Kill-Trigger", "Kill triggers")),
          killTagsOf(p).length >= 3
            ? h("div", { className: "killpills" }, killTagsOf(p).map((k) => h("span", { key: k, className: "killpill" }, k)))
            : h("div", { className: "killwarn" },
                killTagsOf(p).length ? h("div", { className: "killpills", style: { marginBottom: 8 } }, killTagsOf(p).map((k) => h("span", { key: k, className: "killpill" }, k))) : null,
                h("span", null, T("Mindestens 3 Kill-Trigger für breite News-Abdeckung — „Warren fragen“ hilft.", "At least 3 kill-triggers for broad news coverage — try “Ask Warren”.")),
                h("button", { className: "killwarn-edit", onClick: () => openEdit(p) }, T("Ergänzen", "Add more"))),
          h("div", { className: "delrow" }, h("button", { className: "bdel", onClick: () => setDelId(p.id) }, T("Topic löschen", "Delete topic"))))) : null);
    };

    return h("div", { id: "mb-root" },
      h(SiteNav, { active: "mybook.html" }),
      h(MyBookHero),
      h(PySection, null,
        h("div", { className: "toolbar" },
          h(PyEyebrow, null, T("Überblick · ", "Overview · ") + count + "/" + MAX + " Topics"),
          h("div", { style: { display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" } },
            h("div", { className: "vtog" },
              h("button", { className: simple ? "on" : "", "data-sfx": "", onClick: () => { sfx("button-004-toggle"); setSimple(true); } }, T("Einfach", "Simple")),
              h("button", { className: !simple ? "on" : "", "data-sfx": "", onClick: () => { sfx("button-004-toggle"); setSimple(false); } }, T("Detail", "Detail"))),
            h("label", { className: "rep" }, h("button", { className: "sw " + (summary ? "on" : "off"), onClick: () => { sfx("button-004-toggle"); setSummary(!summary); } }, h("span", { className: "knob" })), T("Tägliche My-Book-Summary", "Daily My-Book summary")),
            h(Button, { variant: "oracle", size: "sm", disabled: count >= MAX, onClick: addTopic }, T("+ Topic hinzufügen", "+ Add topic")))),
        h("h2", { className: "mb" }, T("Deine Topics auf einen Blick.", "Your topics at a glance.")),
        rows.length ? (simple ? h("div", { className: "simplelist" }, rows.map((p) => {
          // 10.07.2026 (Daniel-Catch Prosus WACKELT/INTAKT): Einfach-Liste zeigt
          // jetzt dieselbe konsolidierte Status-Pill wie die Detail-Karte —
          // vorher rohes Thesen-Label hier vs. Decision-Tree-Pill dort =
          // scheinbarer Widerspruch. Thesen-Achse bleibt als Balken im Detail.
          const cst = consolidatedStatus(p);
          const oracle = p.tracking_source === "oracle";
          const _lv = parseDeNum(p.live), _en = parseDeNum(p.entry);
          const _pnl = (_lv != null && _en != null && _en > 0) ? (_lv - _en) / _en * 100 : null;
          const pnlStr = _pnl == null ? null : (_pnl >= 0 ? "+" : "\u2212") + Math.abs(_pnl).toFixed(1).replace(".", ",") + " %";
          const pnlCls = _pnl == null ? "flat" : (_pnl >= 0 ? "up" : "dn");
          const td = tagesTrend(p);
          const tage = tageSeit(p);
          const kurs = p.live != null && p.live !== "" ? ((typeof p.live === "string" ? p.live : String(p.live)) + " " + (p.currency || "EUR")) : null;
          return h("div", { key: p.id, className: "srow tall", role: "button", tabIndex: 0, onClick: () => { sfx("button-002-itemopen"); setSimple(false); setOpen(p.id); setTimeout(() => { const el = document.getElementById("mb-" + p.id); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 250); } },
            h("div", { className: "sleft" },
              h("span", { className: "sdot " + (oracle ? "o" : "s"), title: oracle ? T("Orakel-Shortlist", "Oracle shortlist") : T("Meine These", "My thesis") }),
              h("div", { className: "sname" },
                p.art ? h("div", { className: "art" }, p.art) : null,
                h("div", { className: "nm" }, p.name),
                h("div", { className: "spct" },
                  kurs ? h("span", { className: "pxv" }, kurs) : h("span", { className: "miss" }, T("Kurs gerade nicht verf\u00FCgbar", "price unavailable")),
                  td ? h("span", { className: td.cls, title: T("Ver\u00E4nderung heute", "change today") }, td.arrow + " " + td.str + " " + T("heute", "today")) : null,
                  pnlStr ? h("span", { className: pnlCls, title: T("gegen deinen Entry", "against your entry") }, pnlStr + " " + T("seit Setup", "since setup"))
                         : h("span", { className: "miss", title: T("Trag einen Entry ein, dann erscheint der Wert.", "Add an entry and the value appears.") }, T("kein Entry", "no entry")),
                  tage != null ? h("span", { className: "sep" }, "\u00B7") : null,
                  tage != null ? h("span", { className: "hist" }, tageSeitText(tage)) : null))),
            h("span", { className: "sright" },
              h("span", { className: "cpill " + cst.cls, title: cst.tip }, cst.label),
              h("button", { className: "sask", "data-sfx": "", onClick: (e) => { e.stopPropagation(); sfx("button-002-itemopen"); askWarrenTopic(p); } }, T("Warren fragen", "Ask Warren"))));
        })) : (function () {
          const mkHdr = () => h("div", { className: "hdr" },
            h("span", { className: "hc c-mon" }, T("Beobachten", "Monitor")),
            h("span", { className: "hc c-topic" }, "Topic"),
            h("span", { className: "hc c-stat" }, T("These-Status", "Thesis status")),
            h("span", { className: "hc c-trig" }, "My Trigger"),
            h("span", { className: "hc c-act" }));
          const oracleRows = rows.filter((r) => r.tracking_source === "oracle");
          const selfRows = rows.filter((r) => r.tracking_source !== "oracle");
          const group = (kind, title, desc, items) => items.length ? h("div", { className: "grp " + kind, key: kind },
            h("div", { className: "grp-head" },
              h("span", { className: "grp-title" }, title),
              h("span", { className: "grp-sub" }, items.length + (items.length === 1 ? T(" Topic", " topic") : T(" Topics", " topics")))),
            h("div", { className: "grp-desc" }, desc),
            h("div", { className: "list" }, mkHdr(), items.map(Topic))) : null;
          return h("div", null,
            group("oracle", T("Orakel-Shortlist", "Oracle shortlist"), T("Aus dem Orakel übernommen — der Score spiegelt den Hunter-Pool.", "Taken from the oracle — the score mirrors the hunter pool."), oracleRows),
            group("self", T("Meine Thesen", "My theses"), T("Du trackst selbst — bewertet gegen deine eigenen Marken.", "You track yourself — scored against your own levels."), selfRows));
        })())
        : (loaded ? h("div", { className: "empty" },
            h("div", { className: "empty-t" }, T("Dein Buch ist noch leer.", "Your book is still empty.")),
            h("div", { className: "empty-s" }, T("Leg ein Topic an, wenn eine These stark genug ist — per Upload oder von Hand. Warren beobachtet ab dann, ob sie hält.", "Add a topic when a thesis is strong enough — by upload or by hand. Warren then watches whether it holds.")),
            h("div", { style: { marginTop: 22 } }, h(Button, { variant: "oracle", onClick: addTopic }, T("+ Topic hinzufügen", "+ Add topic")))) : null),
        h("div", { id: "mb-add", className: "add" + (count >= MAX ? " full" : "") },
          h("div", { className: "addt" }, T("Neues Topic?", "New topic?")),
          h("div", { className: "adds" }, T("Lade einen Screenshot oder ein PDF hoch — Warren liest die Kurs-Marken aus und fragt nach deiner These. Die Datei wird nicht gespeichert: du bestätigst nur die ausgelesenen Marken. Oder trag alles selbst ein.", "Upload a screenshot or PDF — Warren reads the price levels and asks for your thesis. The file is not stored: you only confirm the extracted levels. Or enter everything yourself.")),
          h("div", { className: "addbtns", style: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" } },
            h(Button, { variant: "oracle", onClick: addTopic }, T("Datei hochladen", "Upload file")),
            h(Button, { variant: "ghost", onClick: addTopic }, T("Manuell eintragen", "Enter manually"))),
          h("div", { className: "addcnt" }, count + "/" + MAX + T(" Topics belegt", " topics used")),
          h("div", { className: "addfull" }, h("b", null, MAX + "/" + MAX + " — "), T("Buch voll. Lösche erst ein Topic, um ein neues anzulegen.", "Book full. Delete a topic first to add a new one."))),
        h(Langfrist, null),
        h("div", { className: "disc" },
          h("div", { className: "tlbl" }, T("Tracking · keine Anlageberatung", "Tracking · not investment advice")),
          h("p", null, T("My Book ist dein persönliches Thesen-Tagebuch — nur Kurs-Marken (Entry/Stop/Skim/Target) und deine These, keine Stückzahlen, keine Beträge, keine Gewinn-/Verlust-Anzeige. Entry = dein Einstandskurs (bei Nachkäufen neu eintragen). Hochgeladene Dateien werden nicht gespeichert — nur die von dir bestätigten Marken. Warren beobachtet und meldet Fakten, ohne Gewähr — keine Kauf-, Verkaufs- oder Halte-Empfehlung. Du entscheidest eigenverantwortlich. Warren ist eine KI und kann irren.", "My Book is your personal thesis journal — price levels and your thesis only, no quantities, no amounts, no P/L. Entry = your average entry price (re-enter on add-buys). Uploaded files are not stored — only the levels you confirm. Warren observes and reports facts, without warranty — no buy, sell or hold recommendation. You decide on your own responsibility. Warren is an AI and can err.")))),
      monModal ? h("div", { className: "ov2", onClick: () => setMonModal(null) },
        h("div", { className: "modal", onClick: (e) => e.stopPropagation() },
          h("h3", null, T("Beobachtung aktivieren?", "Activate monitoring?")),
          h("p", null, T("Monitoring kann viele Mails/SMS erzeugen — bei Long-Positionen oft nicht ratsam (Dauerfeuer bei jeder Bewegung). Du bekommst Alerts, wenn deine Marken oder Kill-Trigger berührt werden.", "Monitoring can produce many mails/SMS — for long positions often not advisable. You'll get alerts when your levels or kill-triggers are hit.")),
          h("p", { className: "disc-note" }, T("Beobachten-Meldungen kommen verzögert. Sie ersetzen keinen echten Alert und keine Stop-Order in deinem Trading-Portal. Irrtümer vorbehalten, keine Gewährleistung.", "Monitoring messages are delayed. They do not replace a real alert or a stop order in your trading portal. Errors excepted, no warranty.")),
          h("div", { className: "chanrow" }, [["mail", "Mail"], ["sms", "SMS"], ["both", T("Beides", "Both")]].map((c) => h("div", { key: c[0], className: "chip" + (monCh === c[0] ? " sel" : ""), onClick: () => setMonCh(c[0]) }, c[1]))),
          h("div", { className: "mrow" },
            h(Button, { variant: "ghost", size: "sm", onClick: () => setMonModal(null) }, T("Abbrechen", "Cancel")),
            h(Button, { variant: "oracle", size: "sm", onClick: confirmMon }, T("Trotzdem beobachten", "Monitor anyway"))))) : null,
      mirrorModal ? h("div", { className: "ov2", onClick: () => setMirrorModal(null) },
        h("div", { className: "modal", onClick: (e) => e.stopPropagation() },
          h("h3", null, T("Orakel-Mirror ausschalten", "Turn off oracle mirror")),
          h("p", null, T("Du übernimmst die Bewertung selbst — dein Score kann vom Orakel-Score abweichen. Bei jeder „These prüfen\"-Aktion rechnen wir gegen DEINE Marken und DEINE These, nicht gegen die Orakel-Werte.", "You take over the assessment — your score can differ from the oracle score. On every \"check thesis\" we compute against YOUR levels and YOUR thesis, not the oracle's.")),
          h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 8px" } }, T("Sinnvoll, wenn du:", "Useful if you:")),
          h("ul", { style: { margin: "0 0 16px", paddingLeft: 18, fontFamily: "var(--font-ui)", fontSize: 13, lineHeight: 1.6, color: "var(--text-secondary)" } },
            h("li", null, T("einen eigenen Entry hast (anders als der Orakel-Trade)", "have your own entry (different from the oracle trade)")),
            h("li", null, T("deine eigene These hast (anders als die offizielle)", "have your own thesis (different from the official one)")),
            h("li", null, T("das Topic weiter tracken willst, nachdem der Orakel-Trade geschlossen wurde", "want to keep tracking after the oracle trade has closed"))),
          h("p", { className: "disc-note" }, T("Du kannst jederzeit zurückwechseln.", "You can switch back anytime.")),
          h("div", { className: "mrow" },
            h(Button, { variant: "ghost", size: "sm", onClick: () => setMirrorModal(null) }, T("Abbrechen", "Cancel")),
            h(Button, { variant: "oracle", size: "sm", onClick: confirmMirrorOff }, T("Selbst tracken", "Track myself"))))) : null,
      delId ? h("div", { className: "ov2", onClick: () => setDelId(null) },
        h("div", { className: "modal", style: { borderColor: "rgba(224,114,107,.45)" }, onClick: (e) => e.stopPropagation() },
          h("h3", { style: { color: "var(--ox-b)" } }, T("Topic löschen?", "Delete topic?")),
          h("p", null, h("b", { style: { color: "var(--parch)" } }, delName), " ", T("wird endgültig aus deinem Book entfernt — These, Marken und Beobachtung. Das lässt sich nicht rückgängig machen.", "will be permanently removed from your book — thesis, levels and monitoring. This cannot be undone.")),
          h("div", { className: "mrow" },
            h(Button, { variant: "ghost", size: "sm", onClick: () => setDelId(null) }, T("Abbrechen", "Cancel")),
            h("button", { className: "bdel", style: { padding: "9px 16px" }, onClick: doDelete }, T("Endgültig löschen", "Delete permanently"))))) : null,
      chartConfirm ? h("div", { className: "ov2", onClick: () => setChartConfirm(null) },
        h("div", { className: "modal", onClick: (e) => e.stopPropagation() },
          h("h3", null, T("Chart-Analyse per Mail?", "Chart analysis by mail?")),
          h("p", null, T("Du möchtest eine Chart-Analyse zu ", "You'd like a chart analysis for "), h("b", { style: { color: "var(--parch)" } }, chartConfirm.name || ""), T(" per Mail bekommen? Warren rendert sie und schickt sie dir in 1–2 Minuten.", " by mail? Warren renders it and sends it to you in 1–2 minutes.")),
          h("div", { className: "mrow" },
            h(Button, { variant: "ghost", size: "sm", onClick: () => setChartConfirm(null) }, T("Abbruch", "Cancel")),
            h(Button, { variant: "oracle", size: "sm", "data-sfx": "", onClick: () => { var pp = chartConfirm; setChartConfirm(null); sfx("menue-in-mybook"); chartMail(pp); } }, T("Bestätigen", "Confirm"))))) : null,
      addF ? h("div", { className: "ov2", onClick: closeForm },
        h("div", { className: "modal modal-wide", onClick: (e) => e.stopPropagation() },
          h("h3", null, editingId ? T("Topic bearbeiten", "Edit topic") : T("Neues Topic", "New topic")),
          !editingId ? h("div", { className: "mode-tabs" },
            h("button", { className: "mtab" + (addMode === "manual" ? " on" : ""), onClick: () => goMode("manual") }, T("Manuell anlegen", "Add manually")),
            h("button", { className: "mtab" + (addMode === "oracle" ? " on" : ""), onClick: () => goMode("oracle") }, T("Aus Orakel auswählen", "Pick from oracle"))) : null,
          (!editingId && addMode === "oracle") ? h("div", null,
            hunterBusy ? h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", textAlign: "center", padding: "28px 0" } }, T("Lade Orakel-Trades…", "Loading oracle trades…"))
              : ((hunter && hunter.length) ? h("div", { className: "hgrid" }, hunter.map((t, i) => {
                  var noEntry = (t.entry == null || t.entry === "" || t.state === "pending");
                  return h("div", { key: (t.id || i), className: "hcard" + (noEntry ? " disabled" : ""), onClick: noEntry ? undefined : () => pickHunter(t) },
                    h("div", { className: "hcard-top" }, h("span", { className: "hcard-name" }, t.asset), h("span", { className: "badge long" }, t.art)),
                    h("div", { className: "hcard-row" }, h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: Z[ZONE.indexOf(t.waage_label)] || "var(--text-secondary)" } }, t.waage_label || ""), h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-muted)" } }, (t.days_active != null ? (t.days_active + T(" Tage aktiv", "d active")) : ""))),
                    noEntry
                      ? h("div", { className: "hcard-hint" }, T("noch kein Entry — Watchlist-Status", "no entry yet — watchlist"))
                      : h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 5, letterSpacing: "0.04em" } }, t.isin));
                }))
                : h("div", { className: "empty", style: { padding: "30px 24px", marginTop: 6 } },
                    h("div", { className: "empty-s" }, T("Aktuell keine Orakel-Trades zum Picken. Du kannst dein Topic manuell anlegen.", "No oracle trades to pick right now. You can add your topic manually.")),
                    h("div", { style: { marginTop: 16 } }, h(Button, { variant: "oracle", size: "sm", onClick: () => goMode("manual") }, T("Manuell anlegen", "Add manually"))))),
            h("div", { className: "f-foot" }, h(Button, { variant: "ghost", size: "sm", onClick: closeForm }, T("Abbrechen", "Cancel"))))
          : h("div", null,
          addSrc === "oracle" ? h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 10.5, lineHeight: 1.5, color: "var(--oracle-b)", border: "1px solid rgba(212,169,78,.4)", borderRadius: 7, padding: "8px 11px", margin: "2px 0 10px" } }, T("Aus dem Orakel übernommen — wird als Orakel-Mirror gespeichert. Du kannst alles anpassen.", "Taken from the oracle — saved as oracle mirror. You can adjust everything.")) : null,
          h("label", { className: "f-up" + (addBusy ? " busy" : "") },
            h("span", null, addBusy ? T("Warren liest…", "Warren is reading…") : T("Screenshot oder PDF hochladen / neu einlesen — Warren liest die Marken aus", "Upload or re-scan a screenshot/PDF — Warren reads the levels")),
            h("input", { type: "file", accept: ".png,.jpg,.jpeg,.webp,.pdf", style: { display: "none" }, disabled: addBusy, onChange: onVision })),
          h("div", { className: "f-note" }, T("Die Datei wird nicht gespeichert — nur die ausgelesenen Marken. Du kannst alles korrigieren.", "The file is not stored — only the extracted levels. You can correct everything.")),
          h("div", { className: "f-grid" },
            Fld({ label: "Name", k: "name", full: true }),
            h("div", { key: "isin", className: "f f-full" },
              h("label", { className: "f-l" }, T("ISIN — automatisch laden", "ISIN — auto-fill")),
              h("div", { style: { display: "flex", gap: 8 } },
                h("input", { className: "f-i gold", value: addF.isin, onChange: (e) => setAf("isin", e.target.value.toUpperCase()) }),
                h(Button, { variant: "oracle", size: "sm", disabled: addBusy || !(addF.isin && addF.isin.trim()), onClick: isinLookup }, addBusy ? T("lädt…", "loading…") : T("Laden", "Load")))),
            isinDup ? h("div", { key: "isindup", className: "f f-full isindup" }, T("Du hast diese ISIN schon im Buch — ", "This ISIN is already in your book — "), h("b", null, isinDup.name), ". ", h("button", { className: "isindup-open", onClick: () => { setOpen(isinDup.id); closeForm(); } }, T("Öffnen", "Open"))) : null,
            Fld({ label: T("Emittent", "Issuer"), k: "issuer" }),
            Sel({ label: T("Art", "Type"), k: "art", opts: ["Aktie · Long", "Aktie · Short", "ETF · Long", "ETF · Short", "ETC · Long", "ETC · Short", "Knock-Out · Long", "Knock-Out · Short", "Optionsschein", "Krypto · Long", "Forex"] }),
            Fld({ label: T("Markt / Index", "Market / index"), k: "idx" }),
            Sel({ label: T("Handelsplatz", "Trading venue"), k: "venue", opts: ["Tradegate", "Lang & Schwarz", "Gettex", "Xetra", "Stuttgart", "Frankfurt", "NYSE", "NASDAQ", "Sonstige"] }),
            Sel({ label: T("Währung", "Currency"), k: "currency", opts: ["EUR", "USD", "GBP", "CHF", "JPY"] }),
            Fld({ label: "Entry", k: "entry" }),
            Fld({ label: "Stop", k: "stop", err: stopErr }),
            Fld({ label: "Skim", k: "skim" }),
            Fld({ label: "Target", k: "target" }),
            Fld({ label: T("Was erwartest du? Warum?", "What do you expect? Why?"), k: "these", full: true, area: true, rows: 6, req: true, min: 50, ai: "these", hint: T("Ein klarer Satz, vom Orakel wörtlich zitiert. Mindestens 50 Zeichen.", "One clear sentence, quoted verbatim by the oracle. At least 50 characters.") }),
            Fld({ label: T("Was würde diese These widerlegen? (Story)", "What would disprove this thesis? (story)"), k: "anti_these", full: true, area: true, rows: 4, req: true, min: 30, ai: "anti", hint: T("Wird vom Orakel als Kontext für die Lesart genutzt. Mindestens 30 Zeichen.", "Used by the oracle as context for its read. At least 30 characters.") }),
            (function () {
              var cur = tags();
              var theseLen = ((addF && addF.these) || "").trim().length;
              return h("div", { key: "killtags", className: "f f-full" },
                h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 } },
                  h("label", { className: "f-l" }, T("Tags fürs News-Monitoring (mind. 3)", "Tags for news monitoring (min. 3)"), h("span", { style: { color: "var(--ox-b)" } }, " *")),
                  h("div", { style: { display: "flex", alignItems: "center", gap: 9 } },
                    h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: cur.length < 3 ? "var(--ox-b)" : (cur.length > 12 ? "#C9A24E" : "var(--bull)") } }, cur.length + "/3"),
                    h("button", { className: "askwarren", disabled: suggestBusy || theseLen < 30, title: theseLen < 30 ? T("Erst These schreiben (≥ 30 Zeichen)", "Write the thesis first (≥ 30 chars)") : "", onClick: askWarrenTags }, suggestBusy ? T("Warren überlegt…", "Warren is thinking…") : T("Warren fragen", "Ask Warren")))),
                h("div", { className: "tagbox" },
                  cur.map((tg) => h("span", { key: tg, className: "tagchip" }, tg, h("button", { className: "tagx", onClick: () => removeTag(tg) }, "×"))),
                  h("input", { className: "taginput", value: tagInput, placeholder: cur.length ? "" : T("z. B. earnings_miss", "e.g. earnings_miss"), onChange: (e) => setTagInput(e.target.value), onKeyDown: (e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); } else if (e.key === "Backspace" && !tagInput && cur.length) { removeTag(cur[cur.length - 1]); } } })),
                suggestErr ? h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--ox-b)", marginTop: 5 } }, suggestErr) : null,
                suggestions.length ? h("div", { className: "wsug" },
                  h("div", { className: "wsug-lbl" }, T("Warrens Vorschläge — klick zum Übernehmen", "Warren's suggestions — click to add")),
                  h("div", { className: "wsug-chips" }, suggestions.map((s) => h("button", { key: s.tag, className: "wsugchip", title: s.reason || "", onClick: () => acceptSuggestion(s) }, "+ " + s.tag)))) : null,
                h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--text-muted)", marginTop: 5, lineHeight: 1.5 } }, T("Mind. 3 Tags — 3–5 decken verschiedene Risk-Vektoren ab. Diese Tags entscheiden, ob News-Alerts kommen. snake_case · max 12. „Warren fragen“, wenn dir nichts einfällt.", "Min. 3 tags — 3–5 cover different risk vectors. These tags decide whether news alerts fire. snake_case · max 12. Use “Ask Warren” if you're stuck.")),
                h("div", { className: "tagsug" }, KILL_SUGGEST.filter((s) => cur.indexOf(s) === -1).slice(0, 8).map((s) => h("button", { key: s, className: "sugchip", onClick: () => addTag(s) }, "+ " + s))));
            })()),
          h("div", { className: "f-note", style: { marginTop: 10 } }, T("Handelsplatz = wo du handelst. Standard Tradegate (EUR). Kurs-Felder leer lassen, wenn unbekannt.", "Trading venue = where you trade. Default Tradegate (EUR). Leave price fields empty if unknown.")),
          (!formValid && formMiss) ? h("div", { className: "f-miss" }, T("Zum Speichern fehlt noch: ", "Still needed to save: "), h("b", null, formMiss)) : null,
          h("div", { className: "f-foot" },
            h(Button, { variant: "ghost", size: "sm", onClick: closeForm }, T("Abbrechen", "Cancel")),
            h(Button, { variant: "oracle", size: "sm", onClick: submitAdd }, editingId ? T("Speichern", "Save") : T("Topic anlegen", "Create topic")))))) : null,
      flash ? h("div", { className: "flash " + (flash.kind || "") }, flash.msg) : null,
      h(SiteFooter, null));
  }

  const root = document.getElementById("root");
  if (root) ReactDOM.createRoot(root).render(h(App));
})();
