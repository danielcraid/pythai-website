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
  #mb-root p.mb-lead{font-family:var(--font-ui);font-size:14px;line-height:1.65;color:var(--text-secondary,#9BA3B2);margin:-8px 0 20px;max-width:640px;}
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
  /* Auge: still im Aus-Zustand, leuchtend im An-Zustand */
  #mb-root .sauge{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;background:none;border:1px solid transparent;border-radius:999px;cursor:pointer;opacity:.75;transition:opacity .15s,border-color .15s,background .15s}
  #mb-root .sauge:hover{opacity:1;border-color:var(--line);background:rgba(255,255,255,.03)}
  #mb-root .sauge.an{opacity:1}
  #mb-root .sauge.an:hover{border-color:rgba(212,169,78,.45)}
  #mb-root .sauge:focus-visible{outline:2px solid var(--oracle);outline-offset:2px}
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
  #mb-root .lt-aufbau{font-family:var(--font-ui);font-size:13px;line-height:1.6;color:var(--parch);margin:0 0 10px;padding:11px 15px;background:rgba(212,169,78,.06);border-left:3px solid var(--oracle);border-radius:0 8px 8px 0;}
  #mb-root .lt-row .marke.plan{color:var(--oracle);}
  #mb-root .lt-warn{font-family:var(--font-ui);font-size:12px;color:var(--ash);margin:0 0 18px;}

  /* --- Nachtrag 4 · Einrichtungsstrecke (C.7) --- */
  #mb-root .ein{margin:20px 0 0;}
  #mb-root .ein-kopf{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;}
  #mb-root .ein-kette{display:flex;align-items:stretch;flex-wrap:wrap;gap:0;flex:1 1 420px;min-width:0;}
  #mb-root .ein-glied{display:flex;align-items:center;min-width:0;}
  #mb-root .ein-linie{display:block;width:26px;height:1px;background:var(--line);flex:0 0 auto;margin:0 4px;}
  #mb-root .ein-linie.an{background:var(--oracle);}
  #mb-root .ein-stufe{display:flex;align-items:center;gap:9px;background:none;border:none;padding:6px 2px;text-align:left;cursor:default;min-width:0;}
  #mb-root .ein-stufe:not([disabled]){cursor:pointer;}
  #mb-root .ein-nr{flex:0 0 auto;width:22px;height:22px;border-radius:999px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:11px;color:var(--ash);}
  #mb-root .ein-lab{display:block;min-width:0;}
  #mb-root .ein-lab b{display:block;font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;font-weight:400;color:var(--ash);}
  #mb-root .ein-lab em{display:block;font-family:var(--font-ui);font-style:normal;font-size:11.5px;color:var(--line);margin-top:2px;}
  #mb-root .ein-stufe.jetzt .ein-nr{border-color:var(--oracle);color:var(--oracle);}
  #mb-root .ein-stufe.jetzt .ein-lab b{color:var(--oracle);}
  #mb-root .ein-stufe.jetzt .ein-lab em{color:var(--text-secondary,#9BA3B2);}
  #mb-root .ein-stufe.fertig .ein-nr{border-color:var(--bull);color:var(--bull);}
  #mb-root .ein-stufe.fertig .ein-lab b{color:var(--mist);}
  #mb-root .ein-stufe.fertig:hover .ein-lab b{color:var(--oracle-b);}
  #mb-root .ein-stufe.fertig:hover .ein-nr{border-color:var(--oracle);}
  #mb-root .ein-schritte{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);}
  #mb-root .ein-schritte b{font-weight:400;color:var(--ash);}
  #mb-root .ein-schritte b.jetzt{color:var(--oracle);}
  #mb-root .ein-schritte b.fertig{color:var(--bull);}
  #mb-root .ein-schritte i{font-style:normal;color:var(--line);}
  #mb-root .ein-raus{background:none;border:none;padding:0;cursor:pointer;font-family:var(--font-ui);font-size:12.5px;color:var(--ash);}
  #mb-root .ein-raus:hover{color:var(--mist);}
  #mb-root .ein-t{font-family:var(--font-oracle);font-weight:400;font-size:24px;color:var(--parch);margin:14px 0 0;}
  #mb-root .ein-p{font-family:var(--font-ui);font-size:13.5px;line-height:1.7;color:var(--text-secondary,#9BA3B2);margin:9px 0 0;max-width:640px;}
  #mb-root .ein-chips{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:16px 0 0;}
  #mb-root .ein-chips span{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);}
  #mb-root .ein-chips button{background:none;border:1px solid var(--line);border-radius:999px;color:var(--mist);font-family:var(--font-ui);font-size:12px;padding:5px 13px;cursor:pointer;text-align:left;}
  #mb-root .ein-chips button:hover{border-color:var(--oracle);color:var(--oracle-b);}
  #mb-root .ein-wahl{display:flex;gap:12px;flex-wrap:wrap;margin:18px 0 0;}
  #mb-root .ein-wahl button{flex:1 1 240px;text-align:left;background:none;border:1px solid var(--line);border-radius:0 10px 10px 0;border-left:3px solid var(--oracle);padding:16px 18px;cursor:pointer;}
  #mb-root .ein-wahl button:hover{border-color:var(--oracle);border-left-color:var(--oracle);}
  #mb-root .ein-wahl b{display:block;font-family:var(--font-ui);font-weight:600;font-size:14px;color:var(--parch);margin:0 0 5px;}
  #mb-root .ein-wahl span{display:block;font-family:var(--font-ui);font-size:12.5px;line-height:1.6;color:var(--text-secondary,#9BA3B2);}
  #mb-root .ein-fuss{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin:22px 0 0;}
  #mb-root .ein-weiter{background:none;border:1px solid var(--line);border-radius:8px;color:var(--mist);font-family:var(--font-ui);font-size:13px;padding:8px 16px;cursor:pointer;}
  #mb-root .ein-weiter:hover{border-color:var(--oracle);color:var(--oracle-b);}
  #mb-root .ein-bs{margin:22px 0 0;padding-top:18px;border-top:1px solid var(--line);}
  #mb-root .ein-bs-kopf{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;}
  #mb-root .ein-bs-kopf b{font-family:var(--font-ui);font-weight:600;font-size:14.5px;color:var(--parch);}
  #mb-root .ein-bs-kopf span{font-family:var(--font-mono);font-size:11px;color:var(--ash);}
  #mb-root .ein-bs-kopf i{font-family:var(--font-ui);font-style:normal;font-size:12.5px;color:var(--bull);}
  #mb-root .ein-eigen{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin:12px 0 0;}
  #mb-root .ein-eigen span{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);}
  #mb-root .ein-eigen input{background:var(--input,#0B0D11);border:1px solid var(--line);border-radius:6px;color:var(--parch);font-family:var(--font-ui);font-size:13px;padding:8px 11px;flex:1 1 180px;min-width:0;}
  #mb-root .ein-eigen input:focus{outline:none;border-color:var(--oracle);}
  #mb-root .ein-eigen input.ungueltig{border-color:rgba(224,114,107,.7);}
  #mb-root .bs-nimm.an{border-color:var(--bull) !important;color:var(--bull) !important;}

  /* --- B3 · Depot loeschen (unumkehrbar) --- */
  #mb-root .lt-del{margin:20px 0 0;}
  #mb-root .lt-del-auf{background:none;border:none;padding:0;cursor:pointer;font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;color:var(--ash);}
  #mb-root .lt-del-auf:hover{color:var(--ox-b);}
  #mb-root .lt-del-box{background:rgba(224,114,107,.05);border:1px solid rgba(224,114,107,.28);border-left:3px solid var(--ox-b);border-radius:0 10px 10px 0;padding:20px 22px;margin:12px 0 0;}
  #mb-root .lt-del-box h4{font-family:var(--font-oracle);font-weight:400;font-size:20px;color:var(--parch);margin:0 0 9px;}
  #mb-root .lt-del-box p{font-family:var(--font-ui);font-size:13.5px;line-height:1.65;color:var(--text-secondary,#9BA3B2);margin:0 0 10px;}
  #mb-root .lt-del-box p:last-of-type{margin-bottom:0;}
  #mb-root .lt-del-tip{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:16px 0 0;}
  #mb-root .lt-del-tip label{font-family:var(--font-ui);font-size:13px;color:var(--mist);}
  #mb-root .lt-del-tip code{font-family:var(--font-mono);font-size:12.5px;color:var(--parch);background:rgba(255,255,255,.05);padding:2px 7px;border-radius:4px;}
  #mb-root .lt-del-tip input{background:var(--input,#0B0D11);border:1px solid var(--line);border-radius:6px;color:var(--parch);font-family:var(--font-mono);font-size:13px;padding:8px 11px;min-width:190px;}
  #mb-root .lt-del-tip input:focus{outline:none;border-color:var(--ox-b);}
  #mb-root .lt-del-fuss{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin:18px 0 0;}
  #mb-root .lt-del-weg{background:none;border:1px solid var(--ox-b);border-radius:8px;color:var(--ox-b);font-family:var(--font-ui);font-size:13.5px;padding:9px 17px;cursor:pointer;}
  #mb-root .lt-del-weg[disabled]{opacity:.35;cursor:not-allowed;}
  #mb-root .lt-del-weg:not([disabled]):hover{background:rgba(224,114,107,.12);}
  #mb-root .lt-del-abbr{background:none;border:none;padding:0;cursor:pointer;font-family:var(--font-ui);font-size:13px;color:var(--ash);}
  #mb-root .lt-del-abbr:hover{color:var(--mist);}
  #mb-root .lt-del-meld{font-family:var(--font-ui);font-size:13px;line-height:1.6;color:var(--parch);margin:16px 0 0;}

  #mb-root .lt-grp{margin:24px 0 0;}
  #mb-root .lt-grp-t{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash);margin:0 0 8px;}
  /* align-items:baseline hat die rechte Gruppe nach unten gezogen: sie ist
     selbst ein Flex-Container, ihre Grundlinie kommt aus ihrem ersten Kind,
     und bei 10px Mono gegen 14px UI liegen die beiden Grundlinien 26px
     auseinander. Ergebnis: Zeilenhoehe 60 statt 21. flex-start richtet
     stattdessen beide Bloecke oben aus. */
  #mb-root .lt-row{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:11px 2px;border-bottom:1px solid var(--line);}
  #mb-root .lt-row .satz{flex:1 1 auto;font-family:var(--font-ui);font-size:14px;line-height:1.5;color:var(--mist);min-width:0;}
  #mb-root .lt-row .satz b{color:var(--parch);font-weight:600;}
  /* Zahlenspalten: rechtsbuendig, Mono, feste Breiten — sonst tanzen die
     Kommas und die Tabelle liest sich nicht. */
  #mb-root .lt-zahlen{display:flex;align-items:baseline;gap:16px;flex:0 0 auto;margin-left:auto;font-family:var(--font-mono);font-size:12px;}
  #mb-root .lt-zahlen span{display:inline-block;text-align:right;white-space:nowrap;}
  #mb-root .lt-zahlen .z-ist{min-width:56px;color:var(--parch);}
  #mb-root .lt-zahlen .z-ist.z-null{color:var(--ash);}
  #mb-root .lt-zahlen .z-ziel{min-width:56px;color:var(--text-secondary,#9BA3B2);}
  #mb-root .lt-zahlen .z-eur{min-width:74px;color:var(--parch);}
  #mb-root .lt-zahlen .z-eur .z-plan{color:var(--oracle);}
  #mb-root .lt-zahlen .z-delta{min-width:64px;color:var(--text-secondary,#9BA3B2);}
  #mb-root .lt-zahlen .z-delta.auf{color:var(--bull,#6FCF9A);}
  #mb-root .lt-zahlen .z-delta.ab{color:var(--ox-b,#E0726B);}
  #mb-root .lt-zahlen .z-leer{color:var(--ash);}
  #mb-root .lt-kopfzeile{display:flex;align-items:baseline;justify-content:space-between;gap:14px;padding:0 2px 5px;font-family:var(--font-mono);font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);}
  #mb-root .lt-kopfzeile .lt-zahlen span{color:var(--ash);}
  #mb-root .lt-rechts{display:flex;align-items:center;gap:14px;flex:0 0 auto;margin-left:22px;justify-content:flex-end;min-width:186px;min-height:21px;}
  #mb-root .lt-eur{font-family:var(--font-mono);font-size:12px;color:var(--oracle);white-space:nowrap;}
  #mb-root .pe-vorher{font-family:var(--font-ui);font-size:12.5px;line-height:1.6;color:#E7A062;margin:0 0 14px;padding:10px 14px;background:rgba(231,160,98,.06);border-left:3px solid #E7A062;border-radius:0 8px 8px 0;}
  #mb-root .lt-gesamt{font-family:var(--font-mono);font-size:12px;color:var(--parch);cursor:help;}
  #mb-root .lt-ist-eur{font-family:var(--font-mono);font-size:12px;color:var(--parch);white-space:nowrap;margin-left:9px;}
  #mb-root .lt-verlauf{font-family:var(--font-mono);font-size:12px;white-space:nowrap;margin-left:9px;}
  #mb-root .lt-verlauf.auf{color:var(--bull,#6FCF9A);}
  #mb-root .lt-verlauf.ab{color:var(--ox-b,#E0726B);}
  #mb-root .ze-einstand{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin:11px 0 0;padding-top:10px;border-top:1px solid var(--line);}
  #mb-root .ze-einstand span{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);}
  #mb-root .ze-einstand input{background:var(--input,#0B0D11);border:1px solid var(--line);border-radius:6px;color:var(--parch);font-family:var(--font-mono);font-size:13px;padding:7px 10px;width:120px;text-align:right;}
  #mb-root .ze-einstand i{font-family:var(--font-mono);font-size:12px;font-style:normal;color:var(--ash);}
  #mb-root .ze-einstand em{flex:1 1 240px;min-width:0;font-family:var(--font-ui);font-style:normal;font-size:11.5px;line-height:1.5;color:var(--text-secondary,#9BA3B2);}
  #mb-root .lt-fehlt{font-family:var(--font-mono);font-size:12px;color:var(--text-secondary,#9BA3B2);white-space:nowrap;margin-left:9px;}
  /* Werkzeugleiste des Langfrist-Depots — gleicher Rhythmus wie bei den
     Thesen: Kopf, Leiste, Inhalt. Die Aktionen stehen oben, nicht unter
     allen Zeilen. */
  #mb-root .lt-werk{margin:22px 0 6px;padding:12px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
  #mb-root .lt-werk-r{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
  #mb-root .lt-budget{display:inline-flex;align-items:center;gap:8px;cursor:help;}
  #mb-root .lt-budget span{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);}
  #mb-root .lt-budget i{font-family:var(--font-mono);font-size:12px;color:var(--ash);font-style:normal;}
  #mb-root .lt-budget input{width:104px;background:var(--input,#0B0D11);border:1px solid var(--line);border-radius:6px;color:var(--parch);font-family:var(--font-mono);font-size:13px;padding:6px 9px;text-align:right;}
  #mb-root .lt-budget input:focus{outline:none;border-color:var(--oracle);}
  #mb-root .lt-kauf{background:none;border:1px solid var(--line);border-radius:999px;color:var(--mist);font-family:var(--font-ui);font-size:11.5px;padding:4px 11px;cursor:pointer;flex:0 0 auto;white-space:nowrap;}
  #mb-root .lt-kauf:hover{border-color:var(--oracle);color:var(--oracle-b);}
  #mb-root .lt-row .marke{font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;flex:0 0 auto;color:var(--ash);}
  #mb-root .lt-row .marke.aus{color:#E7A062;}
  #mb-root .lt-row.unter{padding-left:16px;border-left:1px solid var(--line);margin-left:3px;}
  #mb-root .lt-row.unter .satz b{font-weight:400;}
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

  /* Zeilen-Editor: eine Zeile, kein Formular fuer die ganze Struktur */
  #mb-root .zed{background:var(--card,#15181E);border:1px solid var(--line);border-left:3px solid var(--oracle);border-radius:0 10px 10px 0;padding:20px 22px;margin:18px 0 0;}
  #mb-root .zed-kopf{display:flex;align-items:baseline;justify-content:space-between;gap:14px;}
  #mb-root .zed-kopf h4{font-family:var(--font-oracle);font-weight:400;font-size:21px;color:var(--parch);margin:0;}
  #mb-root .zed-zu{background:none;border:none;padding:0;cursor:pointer;font-family:var(--font-ui);font-size:12.5px;color:var(--ash);}
  #mb-root .zed-zu:hover{color:var(--oracle);}
  #mb-root .zed-ziel{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;font-family:var(--font-mono);font-size:12px;color:var(--text-secondary,#9BA3B2);margin:6px 0 16px;}
  #mb-root .zed-ist{color:var(--parch);}
  #mb-root .zed-link{background:none;border:none;padding:0;cursor:pointer;font-family:var(--font-ui);font-size:12.5px;color:var(--oracle);}
  #mb-root .zed-feld{display:flex;align-items:center;gap:10px;margin:0 0 10px;flex-wrap:wrap;}
  #mb-root .zed-feld label{flex:0 0 118px;font-family:var(--font-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);}
  #mb-root .zed-feld input{flex:0 1 340px;min-width:0;background:var(--input,#0B0D11);border:1px solid var(--line);border-radius:6px;color:var(--parch);font-family:var(--font-ui);font-size:13.5px;padding:9px 11px;}
  #mb-root .zed-feld input.mittel{flex:0 1 210px;font-family:var(--font-mono);letter-spacing:.03em;}
  #mb-root .zed-feld input.kurz{flex:0 1 132px;font-family:var(--font-mono);text-align:right;}
  #mb-root .zed-feld input:focus{outline:none;border-color:var(--oracle);}
  #mb-root .zed-feld input.ungueltig{border-color:var(--ox-b,#E0726B);}
  #mb-root .zed-feld i{font-family:var(--font-mono);font-size:12px;font-style:normal;color:var(--ash);}
  #mb-root .zed-hin{font-family:var(--font-ui);font-size:12px;line-height:1.6;color:var(--ash);margin:0 0 14px;max-width:560px;}
  #mb-root .zed-liste{background:none;border:1px solid var(--bull,#6FCF9A);border-radius:999px;color:var(--bull,#6FCF9A);font-family:var(--font-ui);font-size:12.5px;padding:6px 14px;cursor:pointer;}
  #mb-root .zed-warn{font-family:var(--font-ui);font-size:13px;line-height:1.6;color:#E7A062;margin:12px 0 0;}
  #mb-root .zed-fuss{display:flex;align-items:center;gap:18px;margin:18px 0 0;}
  /* Mechanik (AP6.9) */
  /* Mitteilung (AP6.10) — Information, kein Alarm */
  #mb-root .mit{margin:16px 0 0;padding:13px 16px;background:rgba(255,255,255,.012);border:1px solid var(--line);border-radius:8px;}
  #mb-root .mit-t{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ash);margin-bottom:5px;}
  #mb-root .mit-x{font-family:var(--font-ui);font-size:13.5px;line-height:1.65;color:var(--text-secondary,#9BA3B2);margin:0;max-width:760px;}
  #mb-root .mit-q{font-family:var(--font-mono);font-size:11px;color:var(--ash);margin-top:7px;}
  #mb-root .mek{margin:16px 0 18px;padding:14px 16px;background:rgba(255,255,255,.014);border:1px solid var(--line);border-left:3px solid var(--oracle);border-radius:0 8px 8px 0;}
  #mb-root .mek-label{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--oracle);line-height:1.6;margin-bottom:8px;}
  #mb-root .mek-fest{font-family:var(--font-ui);font-size:13.5px;line-height:1.65;color:var(--parch);margin:0 0 10px;max-width:760px;}
  #mb-root .mek-aufbau{font-family:var(--font-ui);font-size:12.5px;line-height:1.6;color:var(--text-secondary,#9BA3B2);margin:0 0 10px;max-width:760px;}
  #mb-root .mek-tab{margin-top:12px;}
  #mb-root .mek-grp{margin:0 0 14px;}
  #mb-root .mek-grp-t{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ash);margin:0 0 4px;}
  #mb-root .mek-row{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;padding:7px 0;border-bottom:1px solid var(--line);}
  #mb-root .mek-n{flex:1 1 200px;min-width:0;font-family:var(--font-ui);font-size:13.5px;color:var(--parch);}
  #mb-root .mek-z{flex:0 0 auto;font-family:var(--font-mono);font-size:11.5px;color:var(--ash);}
  #mb-root .mek-d{flex:0 0 auto;font-family:var(--font-mono);font-size:12px;color:var(--text-secondary,#9BA3B2);}
  #mb-root .mek-d.fehlt{color:var(--oracle-b,#F2CE7A);}
  #mb-root .mek-rund{flex:1 1 100%;font-family:var(--font-ui);font-size:11.5px;color:var(--ash);}
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

  #mb-root .ze-prod{display:block;padding:0 0 12px 2px;border-bottom:1px solid var(--line);}
  #mb-root .ze-prod-kopf{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;}
  #mb-root .ze-prod-kopf span{font-family:var(--font-ui);font-size:12.5px;color:var(--ash);}
  #mb-root .ze-prod-kopf span.hat{color:var(--text-secondary,#9BA3B2);}
  #mb-root .ze-prod-kopf button{background:none;border:none;padding:0;cursor:pointer;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;color:var(--oracle-b);}
  #mb-root .ze-prod-kopf button:hover{color:var(--oracle);}
  #mb-root .ze-prod-auf{margin:12px 0 0;}
  #mb-root .ze-band{margin:22px 0 0;padding-top:16px;border-top:1px solid var(--line);}
  #mb-root .ze-band p{font-family:var(--font-ui);font-size:12.5px;line-height:1.65;color:var(--ash);margin:0;max-width:600px;}
  #mb-root .ze-band-z{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:10px 0 0;}
  #mb-root .ze-band-z span{font-family:var(--font-ui);font-size:12.5px;color:var(--text-secondary,#9BA3B2);}
  #mb-root .ze-band-z button{background:none;border:none;padding:0;cursor:pointer;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;color:var(--oracle-b);}
  #mb-root .ze-band-z button:hover{color:var(--oracle);}
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
  #mb-root .ze-vor-liste{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch;}
  /* Ein <button> zentriert seinen Inhalt senkrecht — deshalb standen die
     kurzen Karten mittig, waehrend die lange Norwegen-Karte oben begann.
     Als Spalten-Flex faengt jede Karte oben an, egal wie viel drinsteht. */
  #mb-root .ze-vor-k{flex:1 1 190px;display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;text-align:left;background:none;border:1px solid var(--line);border-radius:8px;padding:11px 13px;cursor:pointer;}
  #mb-root .ze-vor-k:hover{border-color:var(--oracle);}
  #mb-root .ze-vor-k.an{border-color:var(--oracle);background:rgba(212,169,78,.05);}
  #mb-root .ze-vor-k b{display:block;font-family:var(--font-ui);font-weight:600;font-size:13.5px;color:var(--parch);margin:0 0 4px;}
  #mb-root .ze-vor-k span{display:block;font-family:var(--font-mono);font-size:11px;line-height:1.55;color:var(--text-secondary,#9BA3B2);}
  #mb-root .bs-perf{font-family:var(--font-ui);font-size:12px;line-height:1.6;color:var(--text-secondary,#9BA3B2);margin:14px 0 0;padding-left:11px;border-left:2px solid var(--line);}
  #mb-root .bs-label.warn{color:var(--text-secondary,#9BA3B2);}
  #mb-root .ze-vor-k em{display:block;font-family:var(--font-ui);font-style:normal;font-size:12px;line-height:1.55;color:var(--ash);margin-top:6px;}
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
  #mb-root .pe-ziel{font-family:var(--font-mono);font-size:11.5px;color:var(--oracle);white-space:nowrap;}
  #mb-root .pe-bsp{background:none;border:1px solid var(--bull);border-radius:999px;color:var(--bull);font-family:var(--font-ui);font-size:12px;padding:5px 12px;cursor:pointer;}
  #mb-root .pe-bsp:hover{background:rgba(111,207,154,.08);}
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
  #mb-root .bs-fuss code{font-family:var(--font-mono);font-size:11.5px;color:var(--text-secondary,#9BA3B2);letter-spacing:.04em;}
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
  // Erklaerungen fuer Leute, die nicht taeglich an der Boerse sind. Sie sagen,
  // WAS eine Sache ist — nicht, ob sie gut ist, was sie bringt oder wie sie
  // sich verhalten wird. Jede Aussage ueber kuenftige Ertraege oder Eignung
  // waere an dieser Stelle genau der Schritt ueber die Linie.
  const LT_ERKLAERUNG = {
    aktien: ["Anteile an Unternehmen", "shares in companies"],
    anleihen: ["Kredite an Staaten oder Unternehmen, mit fester Laufzeit", "loans to states or companies, with a fixed term"],
    geldmarkt: ["sehr kurz laufende Anlagen — der Parkplatz im Depot", "very short-dated holdings — the parking spot in a portfolio"],
    rohstoffe: ["Rohstoffe wie Metalle, Energie, Agrarg\u00FCter", "raw materials such as metals, energy, agriculture"],
    immobilien: ["b\u00F6rsennotierte Immobiliengesellschaften", "listed real-estate companies"],
    welt: ["Unternehmen aus aller Welt in einem Papier", "companies from around the world in one security"],
    us_core: ["die gro\u00DFen US-Unternehmen", "the large US companies"],
    us_equal_weight: ["dieselben US-Unternehmen, aber alle gleich gewichtet", "the same US companies, each weighted equally"],
    europa: ["die gro\u00DFen europ\u00E4ischen Unternehmen", "the large European companies"],
    em: ["Unternehmen in Schwellenl\u00E4ndern", "companies in emerging markets"],
    em_value: ["Schwellenl\u00E4nder, Schwerpunkt auf niedrig bewerteten Unternehmen", "emerging markets, focused on low-valued companies"],
    japan: ["japanische Unternehmen", "Japanese companies"],
    corp_kurz: ["Unternehmensanleihen mit kurzer Restlaufzeit", "corporate bonds with a short remaining term"],
    staat_eur_3_5: ["Staatsanleihen der Eurozone, drei bis f\u00FCnf Jahre Laufzeit", "eurozone government bonds, three to five years"],
    staat_global: ["Staatsanleihen weltweit", "government bonds worldwide"],
    renten_defensiv: ["ein breiter Mix aus Anleihen", "a broad mix of bonds"],
  };
  const ltErklaerung = (z) => {
    const e = LT_ERKLAERUNG[z && z.schluessel];
    return e ? T(e[0], e[1]) : null;
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
  // Nur die Lage in Worten. Die Zahlen stehen in den Spalten daneben —
  // sie zweimal zu schreiben macht die Zeile lang und die Tabelle unlesbar.
  const ltLage = (z) => {
    if (z.verdikt === "kein_ziel" || z.ziel_pct == null) return T("keine Zielstruktur festgelegt", "no target structure defined");
    if (z.verdikt === "ohne_band") return T("kein Toleranzband hinterlegt", "no tolerance band on file");
    const pp = z.abw_pp == null ? null : Number(z.abw_pp);
    if (pp == null) return "";
    if (Math.abs(pp) < 0.05) return T("genau auf Ziel", "exactly on target");
    const richtung = pp > 0 ? T("über", "above") : T("unter", "unter");
    const lage = z.verdikt === "band_verletzt" ? T("außerhalb des Bandes", "outside the band") : T("im Band", "in band");
    return T(ltPct(Math.abs(pp)) + " Punkte " + richtung + " Ziel, " + lage,
             ltPct(Math.abs(pp)) + " points " + (pp > 0 ? "above" : "below") + " target, " + lage);
  };

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

  // Angelegte Summen je Baustein. Daniels Entscheid vom 13.08.: die Summe
  // gehoert in die Zeile. Teil C verbietet, Betraege zu SENDEN und zu
  // speichern — deshalb bleiben sie hier im Browser, so wie das Budget.
  // Das ist ehrlich, solange es dransteht, und es ist kein Ersatz fuer die
  // Backend-Entscheidung: sollen Betraege dauerhaft werden, aendert das
  // Teil C und braucht eine Lieferung. Bis dahin: geraetegebunden.
  // Schluessel ist ab jetzt die ISIN, nicht der Baustein: ein Baustein kann
  // mehrere Produkte tragen. Alte Eintraege (Baustein-Schluessel) werden beim
  // Lesen ignoriert — sie sind geraetegebunden und einen Tag alt.
  const LT_BETRAG_KEY = (depot) => "py_lt_betrag_" + (depot || "struktur_1");
  const ltBetraegeLesen = (depot) => {
    try { const v = JSON.parse(localStorage.getItem(LT_BETRAG_KEY(depot)) || "{}"); return (v && typeof v === "object") ? v : {}; }
    catch (e) { return {}; }
  };

  // Bis v104 lagen die Summen unter dem BAUSTEIN, seit v105 unter der ISIN.
  // Ohne Umzug waeren die Eingaben von gestern still verschwunden — und ein
  // stillschweigender Datenverlust ist schlimmer als eine Fehlermeldung.
  // Umgezogen wird nur, was eindeutig ist: ein Baustein mit genau einem
  // Produkt. Alles andere bleibt liegen, statt geraten zu werden.
  const ltBetraegeUmziehen = (depot, karte, zeilen) => {
    const zs = Array.isArray(zeilen) ? zeilen : [];
    const neu = {}; let bewegt = 0;
    Object.keys(karte || {}).forEach((k) => {
      if (LT_ISIN.test(k)) { neu[k] = karte[k]; return; }
      const pos = zs.filter((z) => z.ebene === "position" && z.baustein === k);
      if (pos.length === 1 && typeof karte[k] === "number") { neu[pos[0].schluessel] = karte[k]; bewegt++; }
    });
    if (bewegt) ltBetraegeSchreiben(depot, neu);
    return bewegt ? neu : karte;
  };
  const ltBetraegeSchreiben = (depot, karte) => {
    try { localStorage.setItem(LT_BETRAG_KEY(depot), JSON.stringify(karte || {})); } catch (e) {}
  };

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
  // Auf welcher Ebene wird der Aufbau gemessen? Der feineren nur dann, wenn
  // sie mindestens so vollstaendig ist wie die groebere — sonst meldet eine
  // einzige Zielposition "1 von 1 im Depot", waehrend fuenf Bausteine leer
  // sind. Steht hier oben, damit sie pruefbar ist statt nur behauptet.
  const ltEuro = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const ltBetragSumme = (karte) => Object.keys(karte || {})
    .reduce((a, k) => a + (typeof karte[k] === "number" ? karte[k] : 0), 0);

  const ltBasis = (zielPos, zielBs) =>
    (zielPos.length && zielPos.length >= zielBs.length) ? zielPos : zielBs;

  const ltSumme = (zeilen, ebene) => zeilen
    .filter((z) => z.ebene === ebene)
    .reduce((a, z) => a + (ltZahl(z.ziel_pct) || 0), 0);
  const LT_TOLERANZ = 0.5;

  /* ------------------------------------------------------------
     B4 · VORLAGEN — Vertrag V2, Abschnitt B4

     Die Muster stehen NICHT im Frontend. Sie kommen aus
     GET /api/mybook/sockel/vorlagen mit name, beschreibung und zeilen.
     Namen oder Zahlen hier fest zu verdrahten waere dieselbe Sorte
     Fehler wie eine fest verdrahtete ISIN: das FE wuerde behaupten,
     was der Server sagt, ohne ihn gefragt zu haben.

     Die Zeile unter jedem Namen nennt AUSSCHLIESSLICH, was in der
     Vorlage steht — keine Wirkung, keine Eignung, keine Rangfolge.

     band_rel_pct 20 ist nur der Startwert des leeren Editors und frei
     aenderbar; liefert die Vorlage ein Band, gilt das der Vorlage.
     ------------------------------------------------------------ */
  const LT_BAND_START = "20";
  // Der Server verlangt eine Depot-Kennung (a-z0-9_-). "null" ist keine —
  // das war der Grund fuer depot_invalid. Hat der Member noch kein Depot,
  // legt die Strecke diese Kennung an; sie steht sichtbar im Editor.
  const LT_DEPOT_STANDARD = "struktur_1";

  // Vorlagen-Zeilen -> die Zahlen-Zeile unter dem Namen. Nur Klassen,
  // weil die Karte sonst zur Tabelle wird; Bausteine kommen beim
  // Uebernehmen trotzdem vollstaendig mit.
  const ltVorlageSatz = (v) => {
    const zs = Array.isArray(v && v.zeilen) ? v.zeilen.filter((z) => z.ebene === "klasse" && z.ziel_pct != null) : [];
    if (!zs.length) return "";
    return zs.map((z) => ltPct(z.ziel_pct) + " % " + ltName(z)).join(" · ");
  };

  function ZielEditor({ depot, start, ist, onSchliessen, weiterLabel, onGespeichert }) {
    const [zeilen, setZeilen] = useState(() => {
      // Positions-Zeilen kommen seit dem Nachtrag V2 in der Antwort mit. Sie
      // gehoeren aber NICHT in diese Tabelle: hier werden Klassen und
      // Bausteine gewichtet, die Position haengt darunter am Produkt. Landete
      // sie hier, stuende die ISIN als eigene Gewichtungszeile da — und sie
      // ginge ohne baustein zurueck an den Server, was seit B144 zu Recht
      // baustein_invalid ausloest.
      const roh = Array.isArray(start) ? start.filter((z) => z.ebene !== "position") : [];
      if (roh.length) {
        return roh.map((z) => ({
          ebene: z.ebene, schluessel: z.schluessel,
          ziel_pct: z.ziel_pct == null ? "" : String(z.ziel_pct).replace(".", ","),
          band_rel_pct: z.band_rel_pct == null ? "" : String(z.band_rel_pct).replace(".", ","),
        }));
      }
      return LT_KLASSEN.map((k) => ({ ebene: "klasse", schluessel: k, ziel_pct: "", band_rel_pct: LT_BAND_START }));
    });
    const [busy, setBusy] = useState(false);
    const [meldung, setMeldung] = useState(null);
    // Welche Vorlage steht UNVERAENDERT im Formular? Sobald eine Zahl
    // angefasst wird, ist es die Entscheidung des Inhabers und nicht mehr
    // die Vorlage — genau das wandert als quelle ins Backend.
    const [vorlage, setVorlage] = useState(null);
    const [bandOffen, setBandOffen] = useState(false);
    // Nachtrag V2: die Produktwahl gehoert in den Ziel-Editor. Sie aendert
    // KEINE Gewichte — sie sagt nur, WOMIT ein Baustein gefuellt werden soll.
    // ... und zwar VORBELEGT aus dem, was schon gespeichert ist. Ohne das
    // oeffnet sich der Editor jedes Mal ohne das bereits gewaehlte Papier:
    // der Member sieht ein leeres Feld, kann keinen Einstand eintragen, und
    // ein erneutes Speichern wuerfe die Position stillschweigend weg.
    const posAus = (feld) => {
      const out = {};
      (Array.isArray(start) ? start : []).forEach((z) => {
        if (z.ebene !== "position" || !z.baustein) return;
        if (feld === "produkt") out[z.baustein] = { name: z.name || z.schluessel, isin: z.schluessel };
        else if (typeof z.einstand === "number") out[z.baustein] = String(z.einstand).replace(".", ",");
      });
      return out;
    };
    const [einstand, setEinstand] = useState(() => posAus("einstand"));
    const [wahl, setWahl] = useState({});          // baustein -> ISIN
    const [eigen, setEigen] = useState(() => posAus("produkt")); // baustein -> { name, isin }
    const [produktOffen, setProduktOffen] = useState(null); // baustein | null
    // baustein -> Einstandskurs als Text. Ein KURS, kein Betrag: er sagt, was
    // ein Anteil gekostet hat, nicht wie viele jemand haelt. Deshalb darf er
    // gespeichert werden, ohne dass Teil C faellt (Positionierung, Abschnitt 2).
    const [bs, setBs] = useState(null);            // B7-Antwort, einmal geladen

    useEffect(() => {
      let lebt = true;
      fetch(API + "/api/mybook/sockel/produktbeispiele", { credentials: "include" })
        .then((r) => r.json().then((d) => ({ code: r.status, d: d })).catch(() => ({ code: r.status, d: null })))
        .then((res) => {
          if (!lebt) return;
          if (res.code === 404) { setBs({ stand: "offen", bausteine: {} }); return; }
          if (res.code !== 200 || !res.d || !res.d.ok) { setBs({ stand: "fehler", bausteine: {} }); return; }
          setBs({ stand: "ok", bausteine: res.d.bausteine || {} });
        })
        .catch(() => { if (lebt) setBs({ stand: "fehler", bausteine: {} }); });
      return () => { lebt = false; };
    }, []);

    // Eigene Eingabe schlaegt Listenauswahl — sie ist die spaetere Handlung.
    const produktVon = (b) => {
      const e = eigen[b];
      if (e && String(e.isin || "").trim()) return { name: String(e.name || "").trim() || String(e.isin).trim(), isin: String(e.isin).trim().toUpperCase() };
      const i = wahl[b];
      if (!i || !bs || bs.stand !== "ok") return null;
      const p = ((bs.bausteine || {})[b] || []).find((x) => x.isin === i);
      return p ? { name: p.name || i, isin: p.isin } : null;
    };
    const [vStand, setVStand] = useState("laedt"); // laedt | ok | leer | fehler | nicht_da
    const [vListe, setVListe] = useState([]);

    useEffect(() => {
      let lebt = true;
      fetch(API + "/api/mybook/sockel/vorlagen", { credentials: "include" })
        .then((r) => r.json().then((d) => ({ code: r.status, d: d })).catch(() => ({ code: r.status, d: null })))
        .then((res) => {
          if (!lebt) return;
          if (res.code === 404) { setVStand("nicht_da"); return; }
          if (res.code !== 200 || !res.d || !res.d.ok) { setVStand("fehler"); return; }
          const vs = Array.isArray(res.d.vorlagen) ? res.d.vorlagen.filter((v) => v && v.key) : [];
          setVListe(vs);
          setVStand(vs.length ? "ok" : "leer");
        })
        .catch(() => { if (lebt) setVStand("fehler"); });
      return () => { lebt = false; };
    }, []);

    const setFeld = (i, feld, wert) => {
      setVorlage(null);
      setZeilen(zeilen.map((z, j) => j === i ? Object.assign({}, z, { [feld]: wert }) : z));
    };
    const entfernen = (i) => { setVorlage(null); setZeilen(zeilen.filter((_, j) => j !== i)); };
    const hinzu = (schluessel) => {
      if (zeilen.some((z) => z.schluessel === schluessel)) return;
      setVorlage(null);
      setZeilen(zeilen.concat([{ ebene: "baustein", schluessel: schluessel, ziel_pct: "", band_rel_pct: LT_BAND_START }]));
    };

    // --- Rechenhilfen, keine Vorschlaege -------------------------------
    // Eine gleichmaessige Teilung ist Arithmetik auf DEINER Auswahl: sie
    // erfindet keine Struktur, sie tippt nur nicht ab. Deshalb ist sie
    // erlaubt, wo ein generierter Vorschlag es nicht waere.
    const kommaZahl = (x) => String(Math.round(x * 10) / 10).replace(".", ",");

    const klassenGleich = () => {
      setVorlage(null);
      const ks = zeilen.filter((z) => z.ebene === "klasse");
      if (!ks.length) return;
      const teil = 100 / ks.length;
      setZeilen(zeilen.map((z) => z.ebene === "klasse"
        ? Object.assign({}, z, { ziel_pct: kommaZahl(teil) }) : z));
    };

    const bausteineAlle = () => {
      setVorlage(null);
      // Nur zu Klassen, die ueberhaupt ein Gewicht haben.
      const aktiv = zeilen.filter((z) => z.ebene === "klasse" && (ltZahl(z.ziel_pct) || 0) > 0).map((z) => z.schluessel);
      const fehlt = LT_BAUSTEINE.filter((b) => aktiv.indexOf(LT_ZU_KLASSE[b]) !== -1 && !zeilen.some((z) => z.schluessel === b));
      if (!fehlt.length) return;
      setZeilen(zeilen.concat(fehlt.map((b) => ({ ebene: "baustein", schluessel: b, ziel_pct: "", band_rel_pct: LT_BAND_START }))));
    };

    // Punkt 3 (Daniel, 12.08.): die Baustein-Gewichtung eines Musters
    // direkt kopieren. Uebernommen wird NUR die Baustein-Ebene; die Klassen
    // bleiben die Entscheidung des Nutzers. Passt beides nicht zusammen,
    // sagt die Zeile darunter es — geblockt wird es nicht, weil eine
    // Teilmenge laut Vertrag zulaessig ist.
    const bausteineAusVorlage = (v) => {
      setVorlage(null);
      const feld = (x) => x == null ? "" : String(x).replace(".", ",");
      const neu = (v.zeilen || [])
        .filter((z) => z.ebene === "baustein" && LT_ZU_KLASSE[z.schluessel])
        .map((z) => ({
          ebene: "baustein", schluessel: z.schluessel,
          ziel_pct: feld(z.ziel_pct),
          band_rel_pct: z.band_rel_pct == null ? LT_BAND_START : feld(z.band_rel_pct),
        }));
      if (!neu.length) return;
      setZeilen(zeilen.filter((z) => z.ebene !== "baustein").concat(neu));
    };

    // Daniel, 12.08.: "die Bausteine, die dem FFB-Portfolio entsprechen".
    // Der ehrliche Weg dahin fuehrt nicht ueber eine Vorlage fuer ALLE, sondern
    // ueber den EIGENEN Depotstand: das FE liest die ist_pct-Zeilen des
    // Members und schreibt sie als Ziel. Bleibt im Konto des Nutzers, geht
    // niemanden sonst etwas an, und es wird nichts geschaetzt.
    const istBrauchbar = Array.isArray(ist) && ist.some((z) =>
      z && z.ist_pct != null && (z.ebene === "klasse" ? LT_KLASSEN.indexOf(z.schluessel) !== -1
                                                      : z.ebene === "baustein" && !!LT_ZU_KLASSE[z.schluessel]));

    const istAlsZiel = () => {
      setVorlage(null);
      const band = (sch) => {
        const alt = zeilen.find((z) => z.schluessel === sch);
        return alt && alt.band_rel_pct !== "" && alt.band_rel_pct != null ? alt.band_rel_pct : LT_BAND_START;
      };
      const feld = (x) => String(Math.round(x * 10) / 10).replace(".", ",");
      const klassen = LT_KLASSEN.map((k) => {
        const q = (ist || []).find((z) => z.ebene === "klasse" && z.schluessel === k);
        return { ebene: "klasse", schluessel: k, ziel_pct: q && q.ist_pct != null ? feld(q.ist_pct) : "", band_rel_pct: band(k) };
      });
      const bausteine = (ist || [])
        .filter((z) => z.ebene === "baustein" && LT_ZU_KLASSE[z.schluessel] && z.ist_pct != null)
        .map((z) => ({ ebene: "baustein", schluessel: z.schluessel, ziel_pct: feld(z.ist_pct), band_rel_pct: band(z.schluessel) }));
      setZeilen(klassen.concat(bausteine));
    };

    const bausteineGleich = () => {
      setVorlage(null);
      setZeilen(zeilen.map((z) => {
        if (z.ebene !== "baustein") return z;
        const k = LT_ZU_KLASSE[z.schluessel];
        const kz = zeilen.find((x) => x.ebene === "klasse" && x.schluessel === k);
        const kp = kz ? ltZahl(kz.ziel_pct) : null;
        const n = zeilen.filter((x) => x.ebene === "baustein" && LT_ZU_KLASSE[x.schluessel] === k).length;
        if (kp == null || !n) return z;
        return Object.assign({}, z, { ziel_pct: kommaZahl(kp / n) });
      }));
    };

    // Eine Vorlage ersetzt das GANZE Formular. Die Klassen-Zeilen bleiben
    // immer alle drei stehen (auch die, die die Vorlage nicht kennt) —
    // leer heisst dort "nicht Teil dieser Version", nicht "null Prozent".
    // Bausteine der Vorlage kommen unveraendert mit.
    const vorlageAnwenden = (v) => {
      setMeldung(null);
      setVorlage(v.key);
      const vz = Array.isArray(v.zeilen) ? v.zeilen : [];
      const feld = (x) => x == null ? "" : String(x).replace(".", ",");
      const ausVorlage = (ebene, schluessel) => vz.find((z) => z.ebene === ebene && z.schluessel === schluessel);
      const klassen = LT_KLASSEN.map((k) => {
        const t = ausVorlage("klasse", k);
        return {
          ebene: "klasse", schluessel: k,
          ziel_pct: t ? feld(t.ziel_pct) : "",
          band_rel_pct: t && t.band_rel_pct != null ? feld(t.band_rel_pct) : LT_BAND_START,
        };
      });
      const bausteine = vz
        .filter((z) => z.ebene === "baustein" && LT_ZU_KLASSE[z.schluessel])
        .map((z) => ({
          ebene: "baustein", schluessel: z.schluessel,
          ziel_pct: feld(z.ziel_pct),
          band_rel_pct: z.band_rel_pct == null ? LT_BAND_START : feld(z.band_rel_pct),
        }));
      setZeilen(klassen.concat(bausteine));
    };

    // Nachtrag 3, Punkt 1: die Klassen-Ebene ist PFLICHT und muss 100 ergeben.
    // Bausteine sind eine TEILMENGE — ein Band nur fuer us_core ist legitim.
    // Sie duerfen 100,5 nur nicht ueberschreiten.
    const sK = ltSumme(zeilen, "klasse");
    const sB = ltSumme(zeilen, "baustein");
    const hatB = zeilen.some((z) => z.ebene === "baustein");
    const kOk = Math.abs(sK - 100) <= LT_TOLERANZ;
    const bOk = !hatB || sB <= 100 + LT_TOLERANZ;
    // Die Positions-Ebene erbt die Baustein-Gewichte, kann also nie groesser
    // werden als sie. Geprueft wird sie trotzdem — geerbt ist nicht bewiesen.
    const sP = zeilen
      .filter((z) => z.ebene === "baustein" && produktVon(z.schluessel))
      .reduce((a, z) => a + (ltZahl(z.ziel_pct) || 0), 0);
    const pOk = sP <= 100 + LT_TOLERANZ;
    const bereit = kOk && bOk && pOk && !busy;

    // Je Klasse: passen die Bausteine unter ihr Dach? Der Server prueft das
    // nicht (er kennt nur die Gesamt-Teilmenge), also sagen wir es hier.
    const klassenKonflikte = LT_KLASSEN.map((k) => {
      const bs = zeilen.filter((z) => z.ebene === "baustein" && LT_ZU_KLASSE[z.schluessel] === k);
      if (!bs.length) return null;
      const summe = bs.reduce((a, z) => a + (ltZahl(z.ziel_pct) || 0), 0);
      const kz = zeilen.find((z) => z.ebene === "klasse" && z.schluessel === k);
      const kp = kz ? ltZahl(kz.ziel_pct) : null;
      if (kp == null || summe <= kp + LT_TOLERANZ) return null;
      return { klasse: k, summe: summe, kp: kp };
    }).filter(Boolean);

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
        depot: depot || LT_DEPOT_STANDARD,
        quelle: vorlage ? "vorlage:" + vorlage : "inhaber_entscheidung",
        zeilen: zeilen
          .filter((z) => ltZahl(z.ziel_pct) != null)
          .map((z) => ({
            ebene: z.ebene, schluessel: z.schluessel,
            ziel_pct: ltZahl(z.ziel_pct),
            band_rel_pct: ltZahl(z.band_rel_pct),
          }))
          // Nachtrag V2: die dritte Ebene. Ein gewaehltes Produkt erbt Gewicht
          // und Band SEINES Bausteins — die Wahl verschiebt nichts.
          .concat(zeilen
            .filter((z) => z.ebene === "baustein" && ltZahl(z.ziel_pct) != null && produktVon(z.schluessel))
            .map((z) => {
              const eintrag = {
                ebene: "position",
                schluessel: produktVon(z.schluessel).isin,
                // Pflicht seit B144: ohne baustein zerfaellt die Liste nach
                // einem Neuladen in unsortierte ISIN (A11).
                baustein: z.schluessel,
                ziel_pct: ltZahl(z.ziel_pct),
                band_rel_pct: ltZahl(z.band_rel_pct),
              };
              const ek = ltZahl(einstand[z.schluessel]);
              // Nur mitschicken, wenn wirklich etwas dasteht. Eine 0 waere ein
              // behaupteter Nullkurs, kein fehlender Wert.
              if (ek != null && ek > 0) { eintrag.einstand = ek; eintrag.waehrung = "EUR"; }
              return eintrag;
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
            } else if (e === "einstand_invalid" || e === "einstand_ohne_isin") {
              setMeldung({ art: "fehler", text: T(
                "Der Einstandskurs wurde zur\u00FCckgewiesen (" + e + "). Er geh\u00F6rt zu einem Papier mit g\u00FCltiger ISIN und muss eine Zahl gr\u00F6\u00DFer null sein. Es wurde nichts ge\u00E4ndert.",
                "The purchase price was rejected (" + e + "). It belongs to a security with a valid ISIN and must be a number greater than zero. Nothing was changed.") });
            } else if (e === "waehrung_invalid") {
              setMeldung({ art: "fehler", text: T(
                "Der Einstand wird zur Zeit nur in Euro gef\u00FChrt. Ein Kurs in Fremdw\u00E4hrung gegen einen Euro-Kurs gerechnet erg\u00E4be eine Bewegung, die es nie gab. Es wurde nichts ge\u00E4ndert.",
                "Purchase prices are kept in euros only for now. A foreign-currency price measured against a euro quote would show a movement that never happened. Nothing was changed.") });
            } else if (e === "baustein_invalid") {
              setMeldung({ art: "fehler", text: T(
                "Eine Position nennt keinen g\u00FCltigen Baustein (" + e + "). Das ist ein Fehler auf unserer Seite, nicht in deiner Eingabe. Es wurde nichts ge\u00E4ndert.",
                "A position names no valid building block (" + e + "). That is a fault on our side, not in your input. Nothing was changed.") });
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
          if (typeof onGespeichert === "function") onGespeichert(koerper, zeilen
            .filter((z) => z.ebene === "baustein" && produktVon(z.schluessel))
            .map((z) => Object.assign({ baustein: z.schluessel }, produktVon(z.schluessel))));
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
      bandZeigen ? h("label", { className: "ze-f" },
        h("span", null, T("Band", "Band")),
        h("input", { type: "text", inputMode: "decimal", value: z.band_rel_pct, placeholder: "20",
          onChange: (e) => setFeld(i, "band_rel_pct", e.target.value) }),
        h("i", null, "%")) : null,
      z.ebene === "baustein"
        ? h("button", { className: "ze-weg", title: T("Zeile aus der nächsten Version nehmen", "Drop this row from the next version"),
            onClick: () => entfernen(i) }, T("entfernen", "remove"))
        : h("span", { className: "ze-fest" }, T("fest", "fixed")));

    // Unter jedem Baustein: welches Produkt soll ihn fuellen? Die Auswahl
    // aendert kein Gewicht, sie haengt nur einen Namen an die Zeile.
    const produktZeile = (b) => {
      const p = produktVon(b);
      const offen = produktOffen === b;
      const liste = bs && bs.stand === "ok" ? ((bs.bausteine || {})[b] || []) : [];
      return h("div", { key: "p-" + b, className: "ze-prod" },
        h("div", { className: "ze-prod-kopf" },
          p ? h("span", { className: "hat" }, p.name) : h("span", null, T("noch kein Produkt gewählt", "no product chosen yet")),
          h("button", { onClick: () => setProduktOffen(offen ? null : b) },
            offen ? T("schließen", "close") : p ? T("ändern", "change") : T("Produkt wählen", "choose product"))),
        offen ? h("div", { className: "ze-prod-auf" },
          bs == null ? h("p", { className: "bs-hin" }, T("Wird geladen…", "Loading…"))
            : liste.length ? h(Beispiele, {
                baustein: b, vorab: bs, waehlbar: true, gewaehlt: p ? p.isin : null,
                onWaehlen: (x) => {
                  setEigen(Object.assign({}, eigen, { [b]: null }));
                  setWahl(Object.assign({}, wahl, { [b]: x.isin }));
                  setProduktOffen(null);
                },
              })
            : h("p", { className: "bs-hin" }, T(
                "Für diese Kategorie sind noch keine kuratierten Beispiele hinterlegt. Du kannst unten ein eigenes Produkt eintragen.",
                "No curated examples are on file for this category yet. You can enter your own product below.")),
          h("div", { className: "ein-eigen" },
            h("span", null, T("oder eigenes Produkt:", "or your own product:")),
            h("input", { type: "text", placeholder: T("Name", "Name"),
              value: (eigen[b] && eigen[b].name) || "",
              onChange: (e) => { setWahl(Object.assign({}, wahl, { [b]: null }));
                setEigen(Object.assign({}, eigen, { [b]: Object.assign({ name: "", isin: "" }, eigen[b], { name: e.target.value }) })); } }),
            h("input", { type: "text", placeholder: "ISIN",
              className: ltIsinOk((eigen[b] && eigen[b].isin) || "") ? "" : "ungueltig",
              value: (eigen[b] && eigen[b].isin) || "",
              onChange: (e) => { setWahl(Object.assign({}, wahl, { [b]: null }));
                setEigen(Object.assign({}, eigen, { [b]: Object.assign({ name: "", isin: "" }, eigen[b], { isin: e.target.value.toUpperCase() }) })); } })),
          // Der Einstand haengt am Produkt, nicht am Baustein — ohne gewaehltes
          // Papier gibt es nichts, wozu ein Kurs gehoeren koennte. Das Backend
          // weist einen Einstand ohne ISIN mit einstand_ohne_isin zurueck; wir
          // zeigen das Feld deshalb erst gar nicht an.
          p ? h("div", { className: "ze-einstand" },
                h("span", null, T("Einstandskurs, falls schon gekauft:", "Purchase price, if already bought:")),
                h("input", { type: "text", inputMode: "decimal", placeholder: T("z. B. 512,40", "e.g. 512.40"),
                  value: einstand[b] || "",
                  onChange: (e) => setEinstand(Object.assign({}, einstand, { [b]: e.target.value })) }),
                h("i", null, "€"),
                h("em", null, T("Kurs je Anteil — nicht die angelegte Summe. Er dient nur dazu, spaeter die Veraenderung zu zeigen.",
                                "Price per share — not the amount invested. It only serves to show the change later.")))
            : null) : null);
    };

    // Das Band gehoert nicht in jede Zeile. Es steht in aller Regel auf
    // einem Wert fuer alle — dann ist eine Spalte voller "20" nur Rauschen.
    // Sichtbar wird es je Zeile erst, wenn es sich unterscheidet oder wenn
    // der Nutzer es ausdruecklich aufklappt.
    const baender = zeilen.map((z) => String(z.band_rel_pct == null ? "" : z.band_rel_pct));
    const bandEinheitlich = baender.every((b) => b === baender[0]);
    const bandZeigen = bandOffen || !bandEinheitlich;
    const bandWert = bandEinheitlich ? (baender[0] || "") : "";
    const bandAlle = (wert) => { setVorlage(null); setZeilen(zeilen.map((z) => Object.assign({}, z, { band_rel_pct: wert }))); };

    const bandBlock = h("div", { className: "ze-band" },
      h("p", null,
        T("Toleranzband — ab wie weit weg vom Ziel eine Zeile als „außerhalb“ gilt. 20 % heißt: bei einem Ziel von 40 % meldet die Fläche ab 32 % oder ab 48 %.",
          "Tolerance band — how far from target a row counts as “outside”. 20 % means: at a target of 40 % the surface reports from 32 % or from 48 %.")),
      bandZeigen
        ? h("div", { className: "ze-band-z" },
            h("span", null, bandEinheitlich
              ? T("Je Zeile einstellbar.", "Adjustable per row.")
              : T("Die Zeilen haben unterschiedliche Bänder — deshalb steht die Spalte offen.",
                  "The rows carry different bands — that is why the column is open.")),
            bandEinheitlich ? h("button", { onClick: () => setBandOffen(false) },
              T("ein Wert für alle", "one value for all")) : null)
        : h("div", { className: "ze-band-z" },
            h("label", { className: "ze-f" },
              h("span", null, T("für alle", "for all")),
              h("input", { type: "text", inputMode: "decimal", value: bandWert, placeholder: LT_BAND_START,
                onChange: (e) => bandAlle(e.target.value) }),
              h("i", null, "%")),
            h("button", { onClick: () => setBandOffen(true) }, T("je Zeile einstellen", "set per row"))));

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

        vStand === "ok" ? h("p", { className: "ze-vor-pflicht" },
          T("Muster zur freien Auswahl — keine Empfehlung. Du entscheidest.",
            "Patterns to choose from freely — not a recommendation. You decide.")) : null,

        vStand === "laedt" ? h("p", { className: "ze-vor-quelle" }, T("Muster werden geladen…", "Loading patterns…")) : null,

        vStand === "fehler" ? h("p", { className: "ze-vor-quelle" },
          T("Die Muster sind gerade nicht abrufbar. Das ist ein technischer Fehler auf unserer Seite — deine Felder unten sind davon nicht betroffen.",
            "The patterns cannot be retrieved right now. That is a technical fault on our side — the fields below are unaffected.")) : null,

        vStand === "nicht_da" ? h("p", { className: "ze-vor-quelle" },
          T("Die Muster-Strecke ist noch nicht ausgeliefert. Du kannst deine Struktur unten trotzdem vollständig selbst eintragen.",
            "The patterns route is not deployed yet. You can still enter your structure below in full.")) : null,

        vStand === "leer" ? h("p", { className: "ze-vor-quelle" },
          T("Zurzeit sind keine Muster hinterlegt.", "No patterns are on file at the moment.")) : null,

        vStand === "ok" ? h("div", { className: "ze-vor-liste" },
          vListe.map((v) => {
            const satz = ltVorlageSatz(v);
            return h("button", {
              key: v.key,
              className: "ze-vor-k" + (vorlage === v.key ? " an" : ""),
              onClick: () => vorlageAnwenden(v),
            },
              h("b", null, v.name || v.key),
              satz ? h("span", null, satz) : null,
              v.beschreibung ? h("em", null, v.beschreibung) : null);
          })) : null,

        vStand === "ok" ? h("p", { className: "ze-vor-quelle" },
          vorlage
            ? T("Die Vorlage steht unverändert im Formular. Sobald du eine Zahl änderst, wird daraus deine eigene Struktur.",
                "The template stands unchanged in the form. As soon as you change a number it becomes your own structure.")
            : T("Eine Vorlage füllt die Felder unten. Ändern kannst du danach jede Zahl.",
                "A template fills the fields below. Afterwards you can change every number.")) : null),

      h("div", { className: "ze-grp" },
        h("div", { className: "ze-grp-t" }, T("Klassen", "Classes")),
        zeilen.map((z, i) => z.ebene === "klasse" ? zeileFeld(z, i) : null),
        h("div", { className: "ze-summe" + (kOk ? " ok" : "") }, summenSatz(sK, kOk, T("Die Klassen", "The classes"))),
        h("div", { className: "ze-hinzu" },
          h("span", null, T("ohne Tippen:", "without typing:")),
          h("button", { onClick: klassenGleich }, T("gleichmäßig aufteilen", "split evenly")),
          istBrauchbar ? h("button", { onClick: istAlsZiel,
            title: T("Übernimmt Klassen UND Bausteine aus deinem letzten eingelieferten Stand.",
                     "Takes classes AND building blocks from your last submitted reporting date.") },
            T("meine heutige Struktur als Ziel übernehmen", "adopt my current structure as target")) : null)),

      h("div", { className: "ze-grp" },
        h("div", { className: "ze-grp-t" }, T("Bausteine", "Building blocks")),
        hatB ? zeilen.map((z, i) => z.ebene === "baustein"
                 ? h("div", { key: "g-" + z.schluessel }, zeileFeld(z, i), produktZeile(z.schluessel))
                 : null)
             : h("p", { className: "ze-leer" }, T("Noch keine Bausteine. Eine Struktur nur aus Klassen ist vollständig — Bausteine sind die feinere Ebene darunter.",
                                                  "No building blocks yet. A structure of classes alone is complete — building blocks are the finer level below.")),
        hatB ? h("div", { className: "ze-summe" + (bOk ? " ok" : "") },
          bOk ? T("Die Bausteine ergeben " + ltPct(sB) + " % \u2014 eine Teilmenge der Klassen, das ist zul\u00E4ssig.",
                  "The building blocks add up to " + ltPct(sB) + " % \u2014 a subset of the classes, which is allowed.")
              : T("Die Bausteine ergeben " + ltPct(sB) + " % \u2014 mehr als 100 ist nicht m\u00F6glich.",
                  "The building blocks add up to " + ltPct(sB) + " % \u2014 more than 100 is not possible.")) : null,
        hatB ? h("div", { className: "ze-summe" + (zeilen.filter((z) => z.ebene === "baustein").every((z) => produktVon(z.schluessel)) ? " ok" : "") },
          (function () {
            const bsZ = zeilen.filter((z) => z.ebene === "baustein");
            const mit = bsZ.filter((z) => produktVon(z.schluessel)).length;
            if (!mit) return T("Noch kein Produkt gewählt. Die Struktur lässt sich auch ohne speichern — Produkte kannst du jederzeit nachtragen.",
                               "No product chosen yet. The structure can be saved without them — products can be added at any time.");
            return mit === bsZ.length
              ? T("Für alle " + bsZ.length + " Bausteine ist ein Produkt gewählt.", "A product is chosen for all " + bsZ.length + " building blocks.")
              : T(mit + " von " + bsZ.length + " Bausteinen haben ein Produkt.", mit + " of " + bsZ.length + " building blocks have a product.");
          })()) : null,

        klassenKonflikte.length ? h("div", { className: "ze-summe" },
          klassenKonflikte.map((c) => T(
            "Die Bausteine unter " + ltName({ ebene: "klasse", schluessel: c.klasse }) + " ergeben " + ltPct(c.summe)
              + " % — mehr als die Klasse selbst (" + ltPct(c.kp) + " %). ",
            "The building blocks under " + ltName({ ebene: "klasse", schluessel: c.klasse }) + " add up to " + ltPct(c.summe)
              + " % — more than the class itself (" + ltPct(c.kp) + " %). ")).join("")) : null,

        vStand === "ok" && vListe.some((v) => (v.zeilen || []).some((z) => z.ebene === "baustein"))
          ? h("div", { className: "ze-hinzu" },
              h("span", null, T("1:1 aus einem Muster:", "1:1 from a pattern:")),
              vListe.filter((v) => (v.zeilen || []).some((z) => z.ebene === "baustein"))
                .map((v) => h("button", { key: v.key, onClick: () => bausteineAusVorlage(v) },
                  T("Bausteine aus „" + (v.name || v.key) + "“", "Building blocks from “" + (v.name || v.key) + "”"))))
          : null,

        h("div", { className: "ze-hinzu" },
          h("span", null, T("ohne Tippen:", "without typing:")),
          offeneBausteine.length ? h("button", { onClick: bausteineAlle },
            T("alle Bausteine der gewählten Klassen hinzufügen", "add all building blocks of the chosen classes")) : null,
          hatB ? h("button", { onClick: bausteineGleich },
            T("je Klasse gleichmäßig aufteilen", "split evenly within each class")) : null),
        offeneBausteine.length ? h("div", { className: "ze-hinzu" },
          h("span", null, T("einzeln hinzufügen:", "add individually:")),
          offeneBausteine.map((b) => h("button", { key: b, onClick: () => hinzu(b) }, ltName({ ebene: "baustein", schluessel: b })))) : null),

      bandBlock,

      meldung ? h("div", { className: "ze-meld " + meldung.art }, meldung.text) : null,

      h("div", { className: "ze-fuss" },
        h(Button, { variant: "oracle", disabled: !bereit, onClick: senden },
          busy ? T("wird gesendet…", "sending…") : (weiterLabel || T("Als meine Zielstruktur speichern", "Save as my target structure"))),
        h("button", { className: "ze-abbr", onClick: onSchliessen }, T("Abbrechen", "Cancel"))),

      h("p", { className: "ze-hinweis" },
        T("Depot-Kennung: " + (depot || LT_DEPOT_STANDARD) + ". ", "Portfolio key: " + (depot || LT_DEPOT_STANDARD) + ". ")),

      h("p", { className: "ze-hinweis", style: { marginTop: 6 } },
        T("Gespeichert werden drei Ebenen: Klassen, Bausteine und — sofern gewählt — je Baustein das Produkt. Jedes Speichern erzeugt eine neue Version; speicherst du am selben Tag noch einmal, ersetzt das die heutige. Die Stände früherer Tage bleiben als Verlauf erhalten.",
          "Three levels are saved: classes, building blocks and — where chosen — one product per building block. Each save creates a new version; saving again on the same day replaces today's. Earlier days remain as history.")));
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

  // Anzeigenamen gehoeren ins FE (Vertrag B6). Die Datei liefert Codes;
  // wie sie beim Member heissen, entscheidet hier. Unbekannte Werte gehen
  // unveraendert durch — lieber ein roher Code als ein erfundener Text.
  const LT_WERT = {
    thesaurierend: ["thesaurierend", "accumulating"],
    ausschuettend: ["ausschüttend", "distributing"],
    physisch: ["physisch", "physical"],
    synthetisch: ["synthetisch", "synthetic"],
    gross: ["groß", "large"],
    mittel: ["mittel", "medium"],
    klein: ["klein", "small"],
  };
  const ltWert = (x) => {
    const k = String(x == null ? "" : x).trim();
    const t = LT_WERT[k];
    return t ? T(t[0], t[1]) : k;
  };

  // B7 · Beispiele je Baustein. Holt die kuratierte Liste, zeigt sie
  // neutral nebeneinander, ohne Rangfolge.
  function Beispiele({ baustein, onUebernehmen, onSchliessen, nurAnsicht, vorab, waehlbar, gewaehlt, onWaehlen, ohneZusatz }) {
    // vorab: bereits geladene Antwort (Einrichtungsstrecke laedt einmal fuer
    // alle Bausteine, statt pro Baustein neu zu fragen).
    const [stand, setStand] = useState(vorab ? vorab.stand : "laedt"); // laedt | ok | offen | fehler
    const [liste, setListe] = useState(vorab && vorab.stand === "ok" ? ((vorab.bausteine || {})[baustein] || []) : []);
    useEffect(() => {
      if (vorab) return;
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
      nurAnsicht ? null : h("button", { className: "ze-zu", onClick: onSchliessen }, T("schließen", "close")));

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
      ohneZusatz ? null : h("p", { className: "bs-label warn" }, T(
        "Exemplarisch, keine Empfehlung. Ob ein Produkt wirklich in diesen Baustein gehört und zu dir passt, prüfst du selbst — im Factsheet des Anbieters, nicht hier.",
        "Illustrative, not a recommendation. Whether a product truly belongs in this building block and suits you is yours to check — in the provider's factsheet, not here.")),
      h("div", { className: "bs-liste" }, liste.map((p, i) => h("div", { key: p.isin || i, className: "bs-item" },
        h("div", { className: "bs-name" }, p.name || "—"),
        h("div", { className: "bs-fakten" },
          p.anbieter ? h("span", null, p.anbieter) : null,
          p.ausschuettung ? h("span", null, ltWert(p.ausschuettung)) : null,
          p.ter_pct != null ? h("span", null, T("laufende Kosten ", "ongoing charges ") + ltPct(p.ter_pct) + " %") : null,
          p.replikation ? h("span", null, ltWert(p.replikation)) : null,
          p.fondsgroesse ? h("span", null, T("Fondsgröße ", "fund size ") + ltWert(p.fondsgroesse)) : null,
          p.domizil ? h("span", null, T("Domizil ", "domicile ") + p.domizil) : null,
          // Regel 2: die Zahl bekommt KEINE eigene Farbe und keine Hervorhebung.
          // Sie steht wie jedes andere Sachkriterium in der Zeile.
          p.perf_1y_pct != null ? h("span", null,
            T("1 Jahr ", "1 year ") + (p.perf_1y_pct > 0 ? "+" : "") + ltPct(p.perf_1y_pct) + " %"
            + (p.perf_stand ? " (" + (ltDatum(p.perf_stand) || p.perf_stand) + ")" : "")) : null),
        h("div", { className: "bs-fuss" },
          p.isin ? h("code", null, p.isin) : null,
          waehlbar
            ? h("button", { className: "bs-nimm" + (gewaehlt && p.isin && gewaehlt === p.isin ? " an" : ""),
                onClick: () => onWaehlen(p) },
                gewaehlt && p.isin && gewaehlt === p.isin ? T("ausgewählt", "selected") : T("auswählen", "select"))
            : (nurAnsicht ? null
              : h("button", { className: "bs-nimm", onClick: () => onUebernehmen(p) }, T("in die Zeile übernehmen", "use in this row"))))))),
      // Regel 1 und 3: beide haengen an der Anzeige, nicht an der Seite —
      // sie erscheinen genau dort, wo Zahlen zur Wertentwicklung stehen.
      liste.some((p) => p && p.perf_1y_pct != null)
        ? h("p", { className: "bs-perf" },
            T("Vergangene Wertentwicklung ist kein verlässlicher Indikator für künftige Ergebnisse.",
              "Past performance is not a reliable indicator of future results."),
            " ",
            T("Die Produkte einer Kategorie können unterschiedlichen Indizes folgen — ein Unterschied in der Wertentwicklung ist deshalb meist eine Frage des Index, nicht der Qualität.",
              "Products within a category may track different indices — a difference in performance is therefore usually a matter of the index, not of quality."))
        : null,

      // Regel 2: die Reihenfolge kommt unveraendert aus der Liste. Hier wird
      // NICHT nach Wertentwicklung sortiert, gefiltert oder hervorgehoben.
      h("p", { className: "bs-sort" }, T("Ohne Rangfolge. Die Reihenfolge stammt aus der gepflegten Liste, sie ist keine Wertung.",
                                          "No ranking. The order comes from the maintained list; it is not a judgement.")));
  }

  function PositionsEditor({ depot, onSchliessen, start, weiterLabel, onGespeichert, zielGewichte, hinweis, budget, vorher, vorherDatum }) {
    // Was soll diese Zeile laut Ziel sein? Steht direkt neben dem Feld, in dem
    // der Betrag eingetragen wird — sonst muesste man es sich merken.
    const zielVon = (z) => (zielGewichte && z && zielGewichte[z.baustein] != null) ? zielGewichte[z.baustein] : null;
    const euroText = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const zielText = (z) => {
      const p = zielVon(z);
      if (p == null) return null;
      const eur = (budget != null && budget > 0) ? Math.round((budget * p) / 100) : null;
      return T("Ziel " + ltPct(p) + " %", "target " + ltPct(p) + " %") + (eur != null ? " · " + euroText(eur) + " €" : "");
    };
    const heute = new Date().toISOString().slice(0, 10);
    const [stand, setStand] = useState(heute);
    // Voreinstellung: mit Betraegen rechnen. Niemand kennt seine Anteile in
    // Prozent — jeder kennt seine Betraege. Umgerechnet wird im Browser,
    // ueber den Draht gehen weiterhin AUSSCHLIESSLICH Prozente (Vertrag B2).
    const [betraege, setBetraege] = useState(true);
    const [zeilen, setZeilen] = useState(() => (Array.isArray(start) && start.length)
      ? start.map((z) => Object.assign({ name: "", isin: "", klasse: "aktien", baustein: "welt", gewicht_pct: "", betrag: "" }, z))
      : [{ name: "", isin: "", klasse: "aktien", baustein: "welt", gewicht_pct: "", betrag: "" }]);
    const [beispielFuer, setBeispielFuer] = useState(null); // Index der Zeile
    const [busy, setBusy] = useState(false);
    const [meldung, setMeldung] = useState(null);
    const [ersetzenFrage, setErsetzenFrage] = useState(null);

    // Mehrere Felder in EINEM Zug. Zwei setFeld-Aufrufe nacheinander lesen
    // beide denselben alten Zustand — der zweite ueberschreibt den ersten.
    // Genau daran ging beim Uebernehmen aus den Beispielen der Name verloren.
    const setFelder = (i, obj) => setZeilen(zeilen.map((z, j) => {
      if (j !== i) return z;
      const n = Object.assign({}, z, obj);
      if (obj.klasse) {
        const moeglich = LT_BAUSTEIN_ZU(obj.klasse);
        if (moeglich.indexOf(n.baustein) === -1) n.baustein = moeglich[0] || "";
      }
      return n;
    }));

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
        depot: depot || LT_DEPOT_STANDARD,
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
          if (typeof onGespeichert === "function") onGespeichert(res.d);
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
        zielText(z) ? h("span", { className: "pe-ziel" }, zielText(z)) : null,
        h("button", { className: "pe-bsp", onClick: () => setBeispielFuer(beispielFuer === i ? null : i) },
          T("Beispiele", "Examples")),
        zeilen.length > 1 ? h("button", { className: "ze-weg", onClick: () => zeileWeg(i) }, T("entfernen", "remove")) : null),
      beispielFuer === i ? h(Beispiele, {
        baustein: z.baustein,
        onSchliessen: () => setBeispielFuer(null),
        onUebernehmen: (p) => { setFelder(i, { name: p.name || "", isin: p.isin || "" }); setBeispielFuer(null); },
      }) : null);

    return h("div", { className: "ze pe" },
      h("div", { className: "ze-kopf" },
        h("h4", null, T("Stand einliefern", "Submit a reporting date")),
        h("button", { className: "ze-zu", onClick: onSchliessen }, T("schließen", "close"))),

      hinweis ? h("div", { className: "ze-meld offen" }, hinweis) : null,

      h("p", { className: "ze-lead" },
        T("Ein Stand ist eine Momentaufnahme deiner Struktur zu einem Stichtag. Du trägst Anteile in Prozent ein — keine Beträge, keine Stückzahlen. Der nächste Stand ersetzt diesen nicht, er kommt daneben; der Verlauf bleibt.",
          "A reporting date is a snapshot of your structure on a given day. You enter weights in percent — no amounts, no quantities. The next one does not replace this one; it sits beside it and the history remains.")),

      vorher > 0 ? h("p", { className: "pe-vorher" },
        T("Dein letzter Stand" + (vorherDatum ? " vom " + ltDatum(vorherDatum) : "") + " hatte "
          + vorher + (vorher === 1 ? " Position" : " Positionen") + ". Dieser Stand ersetzt ihn: was hier nicht steht, gilt danach als nicht mehr gehalten. Einzelne Zeilen \u00E4nderst du unten am Baustein mit \u201EBearbeiten\u201C.",
          "Your last reporting date" + (vorherDatum ? " of " + ltDatum(vorherDatum) : "") + " had "
          + vorher + (vorher === 1 ? " position" : " positions") + ". This one replaces it: whatever is not listed here counts as no longer held. Individual rows are edited at the building block below via \u201EEdit\u201C.")) : null,

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
      // Bequemlichkeit ohne Behauptung: das Gewicht wird NICHT vorbelegt.
      // Wer sagt "ich halte genau nach Ziel", sagt es mit einem eigenen Klick.
      (zielGewichte && Object.keys(zielGewichte).length && zeilen.some((z) => zielGewichte[z.baustein] != null))
        ? h("div", { className: "ze-hinzu" },
            h("span", null, T("Abkürzung:", "shortcut:")),
            h("button", { onClick: () => setZeilen(zeilen.map((z) => zielGewichte[z.baustein] != null
                ? Object.assign({}, z, { gewicht_pct: String(zielGewichte[z.baustein]).replace(".", ",") })
                : z)) },
              T("Ich halte genau nach Ziel — Zielgewichte eintragen", "I hold exactly per target — fill in target weights")))
        : null,
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
          busy ? T("wird gesendet…", "sending…") : (weiterLabel || T("Stand einliefern", "Submit reporting date"))),
        h("button", { className: "ze-abbr", onClick: onSchliessen }, T("Abbrechen", "Cancel"))),

      h("p", { className: "ze-hinweis" },
        T("Eine einzelne Position löschen gibt es nicht. Ein Stand ist ein Stichtag — du lieferst einen neuen Stand ohne sie, und der alte bleibt Verlauf.",
          "There is no deleting a single position. A reporting date is a snapshot — you submit a new one without it, and the old one remains history.")));
  }

  /* ============================================================
     B5 · "WARREN ERKLAERT" — Vertrag V2, Abschnitt B5

     Wissen, nicht Rat. Der Einstieg heisst nie "Empfehlung bekommen",
     und es gibt keinen Eignungs-Fragebogen. Die Chips oeffnen den
     BESTEHENDEN Chat mit einer kuratierten Erklaer-Frage; die Leitplanke
     selbst steht serverseitig im Chat-Prompt, nicht hier.

     Ist der Chat auf der Seite nicht vorhanden, erscheint kein toter
     Knopf — dann fehlt die Zeile ganz.
     ============================================================ */
  const warrenDa = () => typeof window.PYchatOpen === "function";
  function WarrenChips({ fragen }) {
    if (!warrenDa() || !fragen || !fragen.length) return null;
    return h("div", { className: "ein-chips" },
      h("span", null, T("Warren erklärt:", "Warren explains:")),
      fragen.map((f, i) => h("button", {
        key: i,
        onClick: () => { try { window.PYchatOpen(T(f[0], f[1])); } catch (e) { /* Chat weg: nichts tun, nichts behaupten */ } },
      }, T(f[0], f[1]))));
  }

  const EIN_FRAGEN_ZIEL = [
    ["Wie ist der norwegische Staatsfonds aufgestellt?", "How is the Norwegian sovereign fund structured?"],
    ["Was bedeutet ein Band von 20 Prozent?", "What does a band of 20 percent mean?"],
    ["Warum bewegt Norwegen seine Struktur nicht?", "Why does Norway not move its structure?"],
  ];
  const EIN_FRAGEN_PRODUKTE = [
    ["Worin unterscheiden sich us_core und us_equal_weight?", "How do us_core and us_equal_weight differ?"],
    ["Was bedeutet physische Replikation bei einem ETF?", "What does physical replication mean for an ETF?"],
    ["Wonach ist diese Beispiel-Liste zusammengestellt?", "On what basis is this example list compiled?"],
  ];
  const EIN_FRAGEN_IST = [
    ["Was ist ein Stichtag, und warum zählt er hier?", "What is a reporting date, and why does it matter here?"],
    ["Warum rechnet PYTHAI in Prozent statt in Beträgen?", "Why does PYTHAI work in percent instead of amounts?"],
  ];

  /* ============================================================
     NACHTRAG 4 · EINRICHTUNGSSTRECKE (Teil C, Punkt 7)

     Drei Schritte, die die bestehenden Routen verketten — kein neues
     Backend. Geschrieben wird ausschliesslich durch den jeweiligen
     Bestaetigungs-Klick (B1 in Schritt 1, B2 in Schritt 3);
     Abbrechen ist jederzeit folgenlos, Schritt 2 schreibt gar nichts.

     Paragraph-32-Linie: die Strecke ordnet die REIHENFOLGE, nie die
     Entscheidung. Keine Eignungsfrage, identische Listen fuer alle,
     kein Broker-Link, keine Order.
     ============================================================ */
  function Einrichtung({ onFertig, onAbbruch }) {
    // Nachtrag V2 (Daniel, 12.08. abends): zwei Schritte statt drei.
    // Ziel und Produktwahl sind EIN Vorgang mit EINEM Speichern-Klick;
    // der Stand wird danach nachgetragen, so oft man will.
    const [schritt, setSchritt] = useState(1);
    const [produkte, setProdukte] = useState([]); // aus Schritt 1 uebernommen
    const [zielKarte, setZielKarte] = useState({}); // baustein -> ziel_pct
    const [istWahl, setIstWahl] = useState(null); // null | "null" | "depot"
    const [fertig, setFertig] = useState(false);

    const SCHRITTE = [
      { n: 1, t: T("Zielstruktur", "Target structure"), u: T("Muster, Gewichte, Produkte", "pattern, weights, products") },
      { n: 2, t: T("Stand", "Reporting date"), u: T("was du schon hältst", "what you already hold") },
    ];

    const kette = h("div", { className: "ein-kette" }, SCHRITTE.map((sch, i) => {
      const ist_fertig = schritt > sch.n;
      const jetzt = schritt === sch.n;
      const zurueck = ist_fertig;
      return h("div", { key: sch.n, className: "ein-glied" + (i ? " mit-linie" : "") },
        i ? h("span", { className: "ein-linie" + (ist_fertig || jetzt ? " an" : "") }) : null,
        h("button", {
          className: "ein-stufe" + (jetzt ? " jetzt" : "") + (ist_fertig ? " fertig" : ""),
          disabled: !zurueck,
          title: zurueck ? T("zurück zu Schritt " + sch.n, "back to step " + sch.n) : "",
          onClick: zurueck ? () => setSchritt(sch.n) : undefined,
        },
          h("span", { className: "ein-nr" }, ist_fertig ? "✓" : String(sch.n)),
          h("span", { className: "ein-lab" },
            h("b", null, sch.t),
            h("em", null, ist_fertig ? T("abgeschlossen", "done") : jetzt ? T("du bist hier", "you are here") : sch.u))));
    }));

    const kopf = h("div", { className: "ein-kopf" }, kette,
      h("button", { className: "ein-raus", onClick: onAbbruch }, T("Einrichtung abbrechen", "Cancel setup")));

    let koerper = null;

    if (schritt === 1) {
      koerper = h("div", null,
        h("h4", { className: "ein-t" }, T("Schritt 1 — Zielstruktur und Produkte", "Step 1 — target structure and products")),
        h("p", { className: "ein-p" },
          T("Ein Muster als Startpunkt, die Gewichte nach deinem Kopf, und je Baustein ein Produkt aus der Beispiel-Liste. Die Produktwahl verschiebt kein Gewicht — sie hält fest, womit du den Baustein füllen willst. Ein Klick speichert alles zusammen.",
            "A pattern as a starting point, the weights as you want them, and one product per building block from the example list. Choosing a product shifts no weight — it records what you intend to fill the block with. One click saves it all together.")),
        h(WarrenChips, { fragen: EIN_FRAGEN_ZIEL.concat(EIN_FRAGEN_PRODUKTE) }),
        h(ZielEditor, {
          depot: null, start: null,
          weiterLabel: T("Zielstruktur speichern", "Save target structure"),
          onGespeichert: (k, ps) => {
            setProdukte(Array.isArray(ps) ? ps : []);
            const karte = {};
            ((k && k.zeilen) || []).forEach((z) => { if (z.ebene === "baustein" && z.ziel_pct != null) karte[z.schluessel] = z.ziel_pct; });
            setZielKarte(karte);
            setSchritt(2);
          },
          onSchliessen: onAbbruch,
        }));
    }

    if (schritt === 2 && !fertig) {
      koerper = h("div", null,
        h("h4", { className: "ein-t" }, T("Deine Zielstruktur steht.", "Your target structure is in place.")),
        h("p", { className: "ein-p" },
          T("Ab jetzt zeigt die Fläche sie an — auch wenn du noch nichts gekauft hast. Gekaufte Positionen trägst du nach, wann immer du willst; ein Depot ist immer hundert Prozent dessen, was schon da ist.",
            "From now on the surface shows it — even if you have not bought anything yet. You add purchased positions whenever you like; a portfolio is always a hundred percent of what is already there.")),
        h(WarrenChips, { fragen: EIN_FRAGEN_IST }),

        istWahl == null ? h("div", { className: "ein-wahl" },
          h("button", { onClick: onFertig },
            h("b", null, T("Noch nichts gekauft — Fläche ansehen", "Nothing bought yet — view the surface")),
            h("span", null, T("Deine Zielpositionen stehen als „geplant“ da. Sobald du kaufst, trägst du den Stand hier nach.",
                              "Your target positions appear as “planned”. As soon as you buy, you add the reporting date here."))),
          h("button", { onClick: () => setIstWahl(produkte.length ? "depot" : "null") },
            h("b", null, T("Ich habe schon gekauft — Stand nachtragen", "I have already bought — add a reporting date")),
            h("span", null, T("Trage ein, was du heute hältst, in Prozent. Beträge sind erlaubt und werden im Browser umgerechnet — gespeichert werden nur Prozente.",
                              "Enter what you hold today, in percent. Amounts are allowed and converted in the browser — only percentages are stored.")))) : null,

        istWahl != null ? h(PositionsEditor, {
          depot: null,
          start: produkte.length
            ? produkte.map((p) => ({ name: p.name, isin: p.isin, klasse: LT_ZU_KLASSE[p.baustein] || "aktien", baustein: p.baustein, gewicht_pct: "", betrag: "" }))
            : null,
          weiterLabel: T("Stand speichern", "Save reporting date"),
          zielGewichte: zielKarte,
          onGespeichert: () => setFertig(true),
          onSchliessen: () => setIstWahl(null),
        }) : null,

        istWahl != null ? h("div", { className: "ein-fuss" },
          h("button", { className: "ein-raus", onClick: () => setSchritt(1) },
            T("zurück zur Zielstruktur", "back to the target structure"))) : null);
    }

    if (fertig) {
      koerper = h("div", null,
        h("h4", { className: "ein-t" }, T("Fertig.", "Done.")),
        h("p", { className: "ein-p" },
          T("Ziel und Stichtag stehen. Ab jetzt zeigt die Fläche den Abstand zwischen beiden — und sonst nichts.",
            "Target and reporting date are in place. From now on the surface shows the distance between the two — and nothing else.")),
        h("div", { className: "ein-fuss" },
          h("button", { className: "ein-weiter", onClick: onFertig }, T("Fläche ansehen", "View the surface"))));
    }

    return h("div", { className: "ein" }, kopf, koerper);
  }

  /* ============================================================
     B3 · LOESCHEN — Vertrag V2, Abschnitt B3

     Drei verschiedene Dinge, drei Antworten:
       1. Eine POSITION loeschen gibt es nicht. Der naechste Stand ohne
          sie IST die Loeschung — steht im Positions-Editor.
       2. Eine ZIEL-ZEILE loeschen heisst: neue Ziel-Version ohne die
          Zeile — steht im Ziel-Editor.
       3. Das GANZE Depot loeschen: hier. Unumkehrbar, deshalb Pflicht-
          Bestaetigung durch Tippen des Depot-Namens; der Knopf bleibt
          bis dahin tot.

     Zur Ehrlichkeit bei Fehlern: nur wo wir WISSEN, dass nichts
     passiert ist (404, abgelehnte Anfrage), sagen wir "es wurde nichts
     geloescht". Bei einer verlorenen Antwort oder einem Serverfehler
     wissen wir es nicht — dann sagen wir genau das, statt zu beruhigen.
     ============================================================ */
  function DepotLoeschen({ depot, onGeloescht }) {
    const [auf, setAuf] = useState(false);
    const [tipp, setTipp] = useState("");
    const [busy, setBusy] = useState(false);
    const [meldung, setMeldung] = useState(null);
    const [fertig, setFertig] = useState(false);

    const passt = tipp.trim() === depot;

    const anzahl = (n, ein, viele) => (n === 1 ? "1 " + ein : n + " " + viele);

    const loeschen = () => {
      setBusy(true); setMeldung(null);
      fetch(API + "/api/mybook/sockel/depot/" + encodeURIComponent(depot), {
        method: "DELETE", credentials: "include",
      })
        .then((r) => r.json().then((d) => ({ code: r.status, d: d })).catch(() => ({ code: r.status, d: null })))
        .then((res) => {
          setBusy(false);
          if (res.code === 404) {
            const unbekannt = res.d && res.d.error === "depot_unbekannt";
            setMeldung(unbekannt
              ? T("Dieses Depot ist serverseitig nicht bekannt. Es wurde nichts gelöscht.",
                  "The server does not know this portfolio. Nothing was deleted.")
              : T("Die Lösch-Strecke ist noch nicht ausgeliefert. Es wurde nichts gelöscht.",
                  "The delete route is not deployed yet. Nothing was deleted."));
            return;
          }
          if (res.code === 200 && res.d && res.d.ok) {
            const g = res.d.geloescht || {};
            const s = typeof g.snapshots === "number" ? g.snapshots : 0;
            const z = typeof g.ziele === "number" ? g.ziele : 0;
            setFertig(true);
            setMeldung(T("Gelöscht: " + anzahl(s, "Stand", "Stände") + " und " + anzahl(z, "Ziel-Zeile", "Ziel-Zeilen") + ".",
                         "Deleted: " + anzahl(s, "reporting date", "reporting dates") + " and " + anzahl(z, "target row", "target rows") + "."));
            setTimeout(() => { if (typeof onGeloescht === "function") onGeloescht(); }, 1400);
            return;
          }
          setMeldung(T("Der Server hat mit Fehler " + res.code + " geantwortet. Ob dabei etwas entfernt wurde, sagt diese Antwort nicht — lade die Fläche neu und sieh nach.",
                       "The server answered with error " + res.code + ". Whether anything was removed is not stated in that answer — reload the surface and check."));
        })
        .catch(() => {
          setBusy(false);
          setMeldung(T("Es kam keine Antwort an. Ob gelöscht wurde, lässt sich von hier aus nicht sagen — lade die Fläche neu und sieh nach.",
                       "No answer arrived. Whether the deletion happened cannot be told from here — reload the surface and check."));
        });
    };

    if (!depot) return null;

    if (!auf) {
      return h("div", { className: "lt-del" },
        h("button", { className: "lt-del-auf", onClick: () => setAuf(true) },
          T("Dieses Depot löschen …", "Delete this portfolio …")));
    }

    if (fertig) {
      return h("div", { className: "lt-del" },
        h("div", { className: "lt-del-box" },
          h("h4", null, T("Depot gelöscht", "Portfolio deleted")),
          meldung ? h("p", null, meldung) : null,
          h("p", null, T("Die Fläche lädt gleich neu.", "The surface reloads in a moment."))));
    }

    return h("div", { className: "lt-del" },
      h("div", { className: "lt-del-box" },
        h("h4", null, T("Depot „" + depot + "“ vollständig löschen", "Delete portfolio “" + depot + "” completely")),
        h("p", null, T("Entfernt alle eingelieferten Stände und alle Ziel-Zeilen dieses Depots — auch den Verlauf. Deine Thesen in My Book bleiben unberührt.",
                       "Removes every submitted reporting date and every target row of this portfolio — including the history. Your theses in My Book stay untouched.")),
        h("p", null, T("Das lässt sich nicht rückgängig machen. Der Löschvorgang selbst wird protokolliert.",
                       "This cannot be undone. The deletion itself is journalled.")),

        fertig ? null : h("div", { className: "lt-del-tip" },
          h("label", { htmlFor: "del-" + depot }, T("Tippe zur Bestätigung", "Type to confirm"), " ", h("code", null, depot)),
          h("input", { id: "del-" + depot, type: "text", value: tipp, autoComplete: "off", spellCheck: false,
            placeholder: depot, onChange: (e) => setTipp(e.target.value) })),

        meldung ? h("p", { className: "lt-del-meld" }, meldung) : null,

        fertig ? null : h("div", { className: "lt-del-fuss" },
          h("button", { className: "lt-del-weg", disabled: !passt || busy, onClick: loeschen },
            busy ? T("wird gelöscht…", "deleting…") : T("Endgültig löschen", "Delete permanently")),
          h("button", { className: "lt-del-abbr", onClick: () => { setAuf(false); setTipp(""); setMeldung(null); } },
            T("Abbrechen", "Cancel")))));
  }

  // Baut den vollstaendigen Ziel-Koerper aus dem gespeicherten Stand und der
  // EINEN geaenderten Zeile. Ein Ziel-POST ersetzt die ganze Struktur — was
  // hier fehlt, waere danach geloescht. Deshalb steht das als eigene,
  // pruefbare Funktion da und nicht mitten im Klick-Handler.
  // Baut den vollstaendigen Ziel-Koerper aus dem gespeicherten Stand und der
  // neuen Produktliste EINES Bausteins. Ein Ziel-POST ersetzt die ganze
  // Struktur — was hier fehlt, waere danach geloescht. Deshalb steht das als
  // eigene, pruefbare Funktion da und nicht mitten im Klick-Handler.
  //
  // liste: [{ isin, einstand }] — die Produkte, die dieser Baustein tragen
  // soll. Der Zielanteil des Bausteins verteilt sich gleichmaessig auf sie.
  // Eine Gleichverteilung ist keine Empfehlung, sondern die einzige Regel,
  // die ohne zusaetzliche Eingabe auskommt und die Summe erhaelt.
  const ltZielKoerper = (alle, depot, baustein, liste) => {
    const zs = Array.isArray(alle) ? alle : [];
    const kopf = zs
      .filter((z) => (z.ebene === "klasse" || z.ebene === "baustein") && z.ziel_pct != null)
      .map((z) => ({ ebene: z.ebene, schluessel: z.schluessel, ziel_pct: z.ziel_pct, band_rel_pct: z.band_rel_pct }));
    const andere = zs
      .filter((z) => z.ebene === "position" && z.baustein && z.baustein !== baustein && z.ziel_pct != null)
      .map((z) => {
        const e = { ebene: "position", schluessel: z.schluessel, baustein: z.baustein,
          ziel_pct: z.ziel_pct, band_rel_pct: z.band_rel_pct };
        if (typeof z.einstand === "number") { e.einstand = z.einstand; e.waehrung = z.waehrung || "EUR"; }
        return e;
      });
    const bs = zs.find((z) => z.ebene === "baustein" && z.schluessel === baustein) || null;
    const gueltig = (Array.isArray(liste) ? liste : [])
      .filter((x) => x && LT_ISIN.test(String(x.isin || "").trim().toUpperCase()));
    const neu = [];
    if (bs && bs.ziel_pct != null && gueltig.length) {
      // Gleichmaessig, und der Rest der Division landet auf der ersten Zeile,
      // damit die Summe des Bausteins exakt aufgeht.
      const je = Math.round((bs.ziel_pct / gueltig.length) * 10) / 10;
      let rest = Math.round((bs.ziel_pct - je * gueltig.length) * 10) / 10;
      gueltig.forEach((x, i) => {
        const e = { ebene: "position", schluessel: String(x.isin).trim().toUpperCase(), baustein: baustein,
          ziel_pct: Math.round((je + (i === 0 ? rest : 0)) * 10) / 10, band_rel_pct: bs.band_rel_pct };
        if (x.einstand != null && x.einstand > 0) { e.einstand = x.einstand; e.waehrung = "EUR"; }
        neu.push(e);
      });
    }
    return { depot: depot || LT_DEPOT_STANDARD, quelle: "inhaber_entscheidung",
      zeilen: kopf.concat(andere).concat(neu) };
  };

  // Aus den im Browser eingetragenen Summen wird der Stand: jede Position
  // bekommt ihren Anteil an der Gesamtsumme. Ueber den Draht gehen damit
  // AUSSCHLIESSLICH Prozente — der Betrag bleibt hier (Vertrag B2).
  // Ohne eine einzige Summe gibt es keinen Stand; ein erfundener waere
  // schlimmer als keiner.
  const ltStandKoerper = (alle, depot, betraege, heute) => {
    const zs = Array.isArray(alle) ? alle : [];
    const pos = zs.filter((z) => z.ebene === "position" && z.baustein);
    const mit = pos.map((z) => ({ z: z, b: (betraege || {})[z.schluessel] }))
      .filter((x) => typeof x.b === "number" && x.b > 0);
    if (!mit.length) return null;
    // ENTWEDER alle oder keine. Fehlt bei einem Produkt die Summe, waeren die
    // Anteile der uebrigen zu hoch — und der neue Stand wuerde das Papier
    // ohne Summe stillschweigend auf null setzen. Ein halber Stand ist
    // schlimmer als keiner.
    if (mit.length !== pos.length) return null;
    const summe = mit.reduce((a, x) => a + x.b, 0);
    const roh = mit.map((x) => ({
      name: x.z.name || x.z.schluessel,
      isin: x.z.schluessel,
      klasse: LT_ZU_KLASSE[x.z.baustein] || "aktien",
      baustein: x.z.baustein,
      gewicht_pct: Math.round((x.b / summe) * 1000) / 10,
    }));
    // Rundungsrest auf die groesste Zeile, damit die Summe exakt 100 ergibt.
    const ist = roh.reduce((a, r) => a + r.gewicht_pct, 0);
    const diff = Math.round((100 - ist) * 10) / 10;
    if (diff !== 0 && roh.length) {
      let gross = 0;
      roh.forEach((r, i) => { if (r.gewicht_pct > roh[gross].gewicht_pct) gross = i; });
      roh[gross].gewicht_pct = Math.round((roh[gross].gewicht_pct + diff) * 10) / 10;
    }
    return { depot: depot || LT_DEPOT_STANDARD, stand: heute, positionen: roh };
  };


  // --- Zeilen-Editor · eine Zeile, nicht die ganze Struktur -----------------
  // Bisher fuehrte jeder Bearbeiten-Klick in den vollstaendigen Ziel-Editor
  // mit allen Klassen, allen Bausteinen und allen Gewichten. Wer ein Produkt
  // eintragen will, muss nicht durch die halbe Struktur.
  //
  // Was hier NICHT editierbar ist: der Zielanteil. Die Gewichte muessen je
  // Ebene zusammen 100 ergeben; eine Zeile einzeln zu verschieben wuerde die
  // Summe brechen und der Server wiese es zu Recht zurueck. Deshalb steht der
  // Anteil hier nur da, mit dem Weg zur Struktur daneben.
  function ZeileEditor({ depot, zeilen, baustein, isin: isinAlt, budget, betraege,
                        onGespeichert, onSchliessen, onZurStruktur }) {
    const alle = Array.isArray(zeilen) ? zeilen : [];
    const bsZeile = alle.find((z) => z.ebene === "baustein" && z.schluessel === baustein) || null;
    const posZeile = isinAlt ? (alle.find((z) => z.ebene === "position" && z.schluessel === isinAlt) || null) : null;
    const neuAnlegen = !isinAlt;

    const [name, setName] = useState(posZeile ? (posZeile.name || "") : "");
    const [isin, setIsin] = useState(posZeile ? (posZeile.schluessel || "") : "");
    const [einstand, setEinstand] = useState(
      posZeile && typeof posZeile.einstand === "number" ? String(posZeile.einstand).replace(".", ",") : "");
    const [betrag, setBetrag] = useState(() => {
      const b = (betraege || {})[isinAlt];
      return typeof b === "number" ? String(b).replace(".", ",") : "";
    });
    const [listeAuf, setListeAuf] = useState(neuAnlegen);
    const [busy, setBusy] = useState(false);
    const [meldung, setMeldung] = useState(null);

    const isinOk = !isin.trim() || ltIsinOk(isin);
    const ekZahl = ltZahl(einstand);
    const ekOk = !einstand.trim() || (ekZahl != null && ekZahl > 0);
    const ekOhneIsin = !!einstand.trim() && !ltIsinOk(isin);
    const bZahl = ltZahl(betrag);

    // Der Kurs, den der Server kennt. Weicht der eingetragene Einstand extrem
    // davon ab, ist fast immer die SUMME ins Kursfeld geraten — genau der
    // Fehler, der "-99,7 % seit Einstand" erzeugt hat. Wir raten nicht, wir
    // fragen nach.
    const kurs = posZeile && typeof posZeile.kurs === "number" ? posZeile.kurs : null;
    const kursWeitWeg = (kurs != null && ekZahl != null && ekZahl > 0 && kurs > 0)
      && (ekZahl / kurs > 10 || kurs / ekZahl > 10);

    const listeNeu = () => {
      const bisher = alle
        .filter((z) => z.ebene === "position" && z.baustein === baustein)
        .map((z) => ({ isin: z.schluessel, einstand: typeof z.einstand === "number" ? z.einstand : null }));
      const eigen = { isin: String(isin).trim().toUpperCase(), einstand: (ekZahl != null && ekZahl > 0) ? ekZahl : null };
      if (neuAnlegen) return bisher.concat([eigen]);
      return bisher.map((x) => (x.isin === isinAlt ? eigen : x));
    };

    const speichern = (liste, karteNachher) => {
      setBusy(true); setMeldung(null);
      const ziel = ltZielKoerper(alle, depot, baustein, liste);
      fetch(API + "/api/mybook/sockel/ziel", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify(ziel),
      })
        .then((r) => r.json().then((d) => ({ code: r.status, d: d })).catch(() => ({ code: r.status, d: null })))
        .then((res) => {
          if (!(res.code === 200 && res.d && res.d.ok)) {
            setBusy(false);
            const e = res.d && res.d.error;
            setMeldung(T("Nicht gespeichert (" + (e || res.code) + "). Es wurde nichts ge\u00E4ndert.",
                         "Not saved (" + (e || res.code) + "). Nothing was changed."));
            return null;
          }
          ltBetraegeSchreiben(depot, karteNachher);
          // Der Stand folgt aus den Summen. Die Zeilen des Ziels sind gerade
          // erst geschrieben worden, also bauen wir ihn aus dem, was jetzt
          // gilt: die bisherigen Zeilen plus die neue Position.
          const kunft = alle.filter((z) => z.ebene !== "position" || z.baustein !== baustein)
            .concat(liste.map((x) => ({ ebene: "position", schluessel: x.isin, baustein: baustein,
              name: x.isin === String(isin).trim().toUpperCase() ? (name || x.isin) : null })));
          const mitNamen = kunft.map((z) => {
            if (z.ebene !== "position" || z.name) return z;
            const alt = alle.find((y) => y.ebene === "position" && y.schluessel === z.schluessel);
            return Object.assign({}, z, { name: (alt && alt.name) || z.schluessel });
          });
          const heute = new Date().toISOString().slice(0, 10);
          const stand = ltStandKoerper(mitNamen, depot, karteNachher, heute);
          if (!stand) return { ok: true };
          // Ein Stand je Stichtag. Wer heute zum zweiten Mal etwas aendert,
          // will den heutigen Stand KORRIGIEREN, nicht einen zweiten anlegen —
          // das Backend antwortet darauf mit stand_exists. Der zweite Versuch
          // traegt deshalb ersetzen:true. Frueher gelieferte Stichtage bleiben
          // als Verlauf unberuehrt; ersetzt wird nur der von heute.
          const schicken = (koerper) => fetch(API + "/api/mybook/sockel/snapshot", {
            method: "POST", credentials: "include",
            headers: { "Content-Type": "application/json" }, body: JSON.stringify(koerper),
          }).then((r) => r.json().then((d) => ({ code: r.status, d: d })).catch(() => ({ code: r.status, d: null })));

          return schicken(stand)
            .then((r1) => (r1.d && r1.d.error === "stand_exists")
              ? schicken(Object.assign({}, stand, { ersetzen: true }))
              : r1)
            .then((r2) => {
              if (r2.code === 200 && r2.d && r2.d.ok) return { ok: true };
              // Das Ziel steht bereits. Das zu verschweigen waere die
              // schlimmere Variante: der Nutzer saehe eine halbe Speicherung
              // als ganze.
              setMeldung(T("Die Zielstruktur ist gespeichert, der Stand nicht ("
                + ((r2.d && r2.d.error) || r2.code) + "). Deine Anteile stehen deshalb noch auf dem alten Wert.",
                "The target structure is saved, the reporting date is not ("
                + ((r2.d && r2.d.error) || r2.code) + "). Your weights therefore still show the old value."));
              return { ok: false };
            });
        })
        .then((r) => {
          setBusy(false);
          if (r && r.ok && typeof onGespeichert === "function") onGespeichert();
        })
        .catch(() => { setBusy(false); setMeldung(T("Keine Verbindung. Es wurde nichts ge\u00E4ndert.", "No connection. Nothing was changed.")); });
    };

    const senden = () => {
      const karte = Object.assign({}, betraege);
      const key = String(isin).trim().toUpperCase();
      if (isinAlt && isinAlt !== key) delete karte[isinAlt];
      if (bZahl != null && bZahl > 0) karte[key] = bZahl; else delete karte[key];
      speichern(listeNeu(), karte);
    };

    const entfernen = () => {
      const karte = Object.assign({}, betraege);
      delete karte[isinAlt];
      const liste = alle
        .filter((z) => z.ebene === "position" && z.baustein === baustein && z.schluessel !== isinAlt)
        .map((z) => ({ isin: z.schluessel, einstand: typeof z.einstand === "number" ? z.einstand : null }));
      speichern(liste, karte);
    };

    // Wie viele Produkte im GANZEN Depot noch keine Summe haben — inklusive
    // dem, das gerade bearbeitet wird.
    const ohneSumme = (() => {
      const key = String(isin).trim().toUpperCase();
      const karte = Object.assign({}, betraege);
      if (isinAlt && isinAlt !== key) delete karte[isinAlt];
      if (bZahl != null && bZahl > 0) karte[key] = bZahl; else delete karte[key];
      const alleIsin = alle.filter((z) => z.ebene === "position").map((z) => z.schluessel)
        .filter((x) => x !== isinAlt);
      if (ltIsinOk(isin)) alleIsin.push(key);
      return alleIsin.filter((x) => !(typeof karte[x] === "number" && karte[x] > 0)).length;
    })();

    const anteil = (bsZeile && bsZeile.ziel_pct != null) ? bsZeile.ziel_pct : null;
    const anzahl = alle.filter((z) => z.ebene === "position" && z.baustein === baustein).length + (neuAnlegen ? 1 : 0);

    return h("div", { className: "zed" },
      h("div", { className: "zed-kopf" },
        h("h4", null, (neuAnlegen ? T("Produkt hinzufügen · ", "Add product · ") : "")
          + ltName({ ebene: "baustein", schluessel: baustein })),
        h("button", { className: "zed-zu", onClick: onSchliessen }, T("Schlie\u00DFen", "Close"))),

      anteil != null
        ? h("p", { className: "zed-ziel" },
            T("Zielanteil " + ltPct(anteil) + " %", "Target share " + ltPct(anteil) + " %"),
            (budget != null && budget > 0)
              ? h("span", null, T("= " + ltEuro(Math.round(budget * anteil / 100)) + " € von " + ltEuro(budget) + " € Budget",
                                  "= " + ltEuro(Math.round(budget * anteil / 100)) + " € of " + ltEuro(budget) + " € budget")) : null,
            anzahl > 1 ? h("span", null,
              T("· auf " + anzahl + " Produkte gleichmäßig verteilt", "· split evenly across " + anzahl + " products")) : null,
            h("button", { className: "zed-link", onClick: onZurStruktur }, T("Gewichte \u00E4ndern", "change weights")))
        : null,

      h("div", { className: "zed-feld" },
        h("label", null, T("Produkt", "Product")),
        h("input", { type: "text", value: name, placeholder: T("Name des Fonds oder Wertpapiers", "Name of the fund or security"),
          onChange: (e) => setName(e.target.value) })),
      h("div", { className: "zed-feld" },
        h("label", null, "ISIN"),
        h("input", { type: "text", className: "mittel" + (isinOk ? "" : " ungueltig"), value: isin, placeholder: "IE00…",
          onChange: (e) => {
            const neuIsin = e.target.value.toUpperCase();
            // Ein Einstandskurs gehoert zu EINEM Papier. Bleibt er beim
            // Produktwechsel stehen, rechnet die Flaeche den Kurs des neuen
            // gegen den Einstand des alten — daraus wurden +1812 %.
            if (posZeile && typeof posZeile.einstand === "number"
                && neuIsin !== String(posZeile.schluessel || "").toUpperCase()
                && ltZahl(einstand) === posZeile.einstand) setEinstand("");
            setIsin(neuIsin);
          } })),
      h("div", { className: "zed-feld" },
        h("label", null, T("Einstandskurs", "Purchase price")),
        h("i", null, "€"),
        h("input", { type: "text", inputMode: "decimal", className: "kurz" + (ekOk ? "" : " ungueltig"), value: einstand,
          placeholder: T("z. B. 512,40", "e.g. 512.40"), onChange: (e) => setEinstand(e.target.value) }),
        h("em", null, kurs != null
          ? T("aktueller Kurs " + ltPct(kurs) + " €", "current price " + ltPct(kurs) + " €")
          : T("Kurs je Anteil", "price per share"))),
      h("div", { className: "zed-feld" },
        h("label", null, T("Angelegte Summe", "Amount invested")),
        h("i", null, "€"),
        h("input", { type: "text", inputMode: "decimal", className: "kurz", value: betrag,
          placeholder: T("z. B. 4000", "e.g. 4000"), onChange: (e) => setBetrag(e.target.value) }),
        h("em", null, T("das Geld in dieser Zeile", "the money in this row"))),

      kursWeitWeg ? h("p", { className: "zed-warn" },
        T("Der Einstandskurs liegt weit vom aktuellen Kurs (" + ltPct(kurs) + " €). Trägst du dort vielleicht die angelegte Summe statt den Kurs je Anteil ein?",
          "The purchase price is far from the current price (" + ltPct(kurs) + " €). Are you perhaps entering the amount invested instead of the price per share?")) : null,

      ohneSumme > 0 ? h("p", { className: "zed-warn" },
        T("Noch " + ohneSumme + (ohneSumme === 1 ? " Produkt ohne angelegte Summe" : " Produkte ohne angelegte Summe")
          + ". Solange eine fehlt, bleiben deine Anteile auf dem alten Stand — sonst stünde ein Produkt bei 100 % und der Rest bei null.",
          ohneSumme + (ohneSumme === 1 ? " product still has no amount" : " products still have no amount")
          + ". While one is missing your weights stay as they are — otherwise one product would sit at 100 % and the rest at zero.")) : null,
      h("p", { className: "zed-hin" },
        T("Aus den Summen aller Produkte errechnet die Fläche deine Anteile und liefert sie als Stand ein. Gesendet werden ausschließlich Prozente — kein Betrag verlässt diesen Browser.",
          "From the amounts of all products the surface computes your weights and submits them as a reporting date. Only percentages are sent — no amount leaves this browser.")),

      h("button", { className: "zed-liste", onClick: () => setListeAuf(!listeAuf) },
        listeAuf ? T("Beispiele schlie\u00DFen", "Close examples") : T("Beispiele ansehen", "View examples")),
      listeAuf ? h(Beispiele, { baustein: baustein, waehlbar: true, gewaehlt: ltIsinOk(isin) ? isin : null,
        onWaehlen: (x) => {
          setName(x.name || "");
          if (posZeile && x.isin !== posZeile.schluessel) setEinstand("");
          setIsin(x.isin || "");
          setListeAuf(false);
        } }) : null,

      ekOhneIsin ? h("p", { className: "zed-warn" },
        T("Ein Einstandskurs braucht ein Papier. Trag eine g\u00FCltige ISIN ein oder lass das Kursfeld leer.",
          "A purchase price needs a security. Enter a valid ISIN or leave the price field empty.")) : null,
      meldung ? h("p", { className: "zed-warn" }, meldung) : null,

      h("div", { className: "zed-fuss" },
        h(Button, { variant: "oracle", size: "sm", loading: busy,
          disabled: busy || !ltIsinOk(isin) || !ekOk || ekOhneIsin, onClick: senden },
          T("Speichern", "Save")),
        h("button", { className: "zed-zu", onClick: onSchliessen }, T("Abbrechen", "Cancel")),
        (!neuAnlegen) ? h("button", { className: "zed-weg", disabled: busy, onClick: entfernen },
          T("Produkt entfernen", "Remove product")) : null));
  }

  // --- Mechanik (AP6.9) ----------------------------------------------------
  // Der Server liefert die Deltas; die Sprache ist unsere Verantwortung.
  // "delta_pp positiv = aufstocken" heisst hier NICHT "kaufen", sondern
  // "bis zu deinem Ziel fehlen X Punkte". Dieselbe Zahl, aber als Abstand zu
  // einer selbst gesetzten Struktur — nicht als etwas, das fuer den Nutzer
  // geeignet dargestellt wird. Daran haengt die Paragraph-32-Linie.
  //
  // Das label ist Pflicht-Anzeige an JEDER Mechanik-Darstellung (Backend,
  // 13.08.). Es steht deshalb ausserhalb des Aufklappens.
  // --- Mitteilung (AP6.10) -------------------------------------------------
  // Kuratierte Nachricht zum norwegischen Fonds, identisch fuer alle Member.
  // Ruhige Informationszeile, kein Alarm: sie beschreibt eine Aenderung an
  // einer oeffentlichen Quelle. Was der Member daraus macht, ist seine Sache —
  // deshalb steht hier kein Knopf und kein Ausrufezeichen.
  function Mitteilung({ m }) {
    if (!m || !String(m.text || "").trim()) return null;
    const teile = [];
    if (m.stichtag_daten) teile.push(T("Datenstand " + ltDatum(m.stichtag_daten), "data as of " + ltDatum(m.stichtag_daten)));
    if (m.stand) teile.push(T("Mitteilung vom " + ltDatum(m.stand), "notice of " + ltDatum(m.stand)));
    if (m.quelle) teile.push(m.quelle);
    return h("div", { className: "mit" },
      h("div", { className: "mit-t" }, T("Zum norwegischen Fonds", "On the Norwegian fund")),
      h("p", { className: "mit-x" }, m.text),
      teile.length ? h("div", { className: "mit-q" }, teile.join(" · ")) : null);
  }

  function Mechanik({ m, budget, aufbau, name }) {
    const [auf, setAuf] = useState(false);
    if (!m || !m.modus) return null;

    const inEuro = (pp) => (budget == null || budget <= 0 || pp == null)
      ? null : Math.round((budget * Math.abs(pp)) / 100);
    const euro = (x) => ltEuro(x);

    const satz = (r) => {
      const d = typeof r.delta_pp === "number" ? r.delta_pp : null;
      if (d == null) return "";
      if (Math.abs(d) < 0.05) return T("auf Ziel", "on target");
      const eur = inEuro(d);
      const zusatz = eur != null ? " (" + euro(eur) + " €)" : "";
      return d > 0
        ? T("bis zum Ziel fehlen " + ltPct(d) + " Punkte" + zusatz,
            ltPct(d) + " points short of target" + zusatz)
        : T(ltPct(Math.abs(d)) + " Punkte ueber Ziel" + zusatz,
            ltPct(Math.abs(d)) + " points above target" + zusatz);
    };

    const tabelle = (titel, rows, istPosition) => (Array.isArray(rows) && rows.length)
      ? h("div", { className: "mek-grp", key: titel },
          h("div", { className: "mek-grp-t" }, titel),
          rows.map((r, i) => h("div", { key: i, className: "mek-row" },
            h("div", { className: "mek-n" },
              istPosition ? (r.name || r.schluessel) : ltName({ ebene: titel === T("Klassen", "Classes") ? "klasse" : "baustein", schluessel: r.schluessel })),
            h("div", { className: "mek-z" },
              T("ist " + ltPct(r.ist_pct) + " % · Ziel " + ltPct(r.ziel_pct) + " %",
                "actual " + ltPct(r.ist_pct) + " % · target " + ltPct(r.ziel_pct) + " %")),
            h("div", { className: "mek-d" + (typeof r.delta_pp === "number" && r.delta_pp > 0 ? " fehlt" : "") }, satz(r)),
            r.rundungsausgleich_pp != null
              ? h("div", { className: "mek-rund" },
                  T("darin " + ltPct(r.rundungsausgleich_pp) + " Punkte Rundungsausgleich",
                    "including " + ltPct(r.rundungsausgleich_pp) + " points rounding adjustment"))
              : null)))
      : null;

    const hatTabellen = ["klassen", "bausteine", "positionen"]
      .some((k) => Array.isArray(m[k]) && m[k].length);

    return h("div", { className: "mek" },
      h("div", { className: "mek-label" }, m.label),
      m.feststellung ? h("p", { className: "mek-fest" }, m.feststellung) : null,
      // Im Aufbau ist der Bandriss rechnerisch erzwungen: wer erst einen von
      // sechs Bausteinen haelt, haelt darin 100 %. Ohne diesen Satz stuende
      // die Tabelle im Widerspruch zur Kopfzeile eine Zeile darueber.
      (aufbau && hatTabellen) ? h("p", { className: "mek-aufbau" },
        T("Dein Depot ist noch im Aufbau. Ein Teil dieser Abstände ist deshalb kein Abdriften, sondern schlicht noch nicht gekauft — die Tabelle rechnet den Abstand, nicht den Handlungsbedarf.",
          "Your portfolio is still being built. Part of these distances is therefore not drift but simply not bought yet — the table computes the distance, not a need to act.")) : null,
      hatTabellen
        ? h("button", { className: "lt-mehr", onClick: () => setAuf(!auf) },
            auf ? T("Mechanik schließen ▴", "Close mechanics ▴") : T("Mechanik ansehen ▾", "View mechanics ▾"))
        : null,
      (auf && hatTabellen) ? h("div", { className: "mek-tab" },
        tabelle(T("Klassen", "Classes"), m.klassen, false),
        tabelle(T("Bausteine", "Building blocks"), m.bausteine, false),
        tabelle(T("Produkte", "Products"), m.positionen, true)) : null);
  }

  function Langfrist() {
    const [an, setAn] = useState(ltGelesen());
    const [stand, setStand] = useState("laedt"); // laedt | ok | leer | fehler | gesperrt
    const [depots, setDepots] = useState([]);
    const [offen, setOffen] = useState({});
    const [editor, setEditor] = useState(null); // null | { depot, start }
    const [posEditor, setPosEditor] = useState(null);
    const [zeilenEditor, setZeilenEditor] = useState(null); // { depot, baustein, anker }
    // Angelegte Summen je Baustein, aus dem Browser. nachladen zaehlt hoch,
    // wenn gespeichert wurde — dann werden sie hier neu gelesen.
    const [betraege, setBetraege] = useState({});
    const [mitteilung, setMitteilung] = useState(null); // null | { depot }
    const [nachladen, setNachladen] = useState(0);
    const [einrichtung, setEinrichtung] = useState(false);
    // Nachtrag V2: die DB kennt den Produktnamen erst nach dem ersten Stand.
    // Bis dahin loest das FE die ISIN ueber die kuratierte Liste auf.
    const [isinNamen, setIsinNamen] = useState({});
    // Rechenhilfe, nichts weiter: die Zahl bleibt in diesem Browser, wird
    // nicht gespeichert und geht nie an den Server. Vertrag C.2 bleibt
    // unangetastet — ueber den Draht laufen weiterhin nur Prozente.
    const [budget, setBudget] = useState("");
    // Zwei verschiedene Zahlen, und sie duerfen sich nicht vermischen:
    //   Budget       = was insgesamt hineingehen SOLL (Plan)
    //   Gesamtsumme  = was tatsaechlich drinsteckt (Summe der Zeilen)
    // Der Zielanteil einer Zeile rechnet gegen das BUDGET. Gegen die bisher
    // angelegte Summe gerechnet, schrumpft das Ziel mit jedem noch nicht
    // gekauften Baustein — bei 4.000 von 10.000 stand "Ziel 1.600 €" da,
    // obwohl das Ziel 4.000 ist. Das war der Logikfehler.
    const betragSumme = ltBetragSumme(betraege);
    const budgetZahl = ltZahl(budget);
    const inEuro = (pct) => (budgetZahl == null || budgetZahl <= 0 || pct == null)
      ? null
      : Math.round((budgetZahl * pct) / 100);
    // Ganze Euro. Nachkommastellen taeuschen hier eine Genauigkeit vor,
    // die eine Planungshilfe nicht hat.
    const euroText = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    useEffect(() => {
      if (!an) return;
      let lebt = true;
      fetch(API + "/api/mybook/sockel/produktbeispiele", { credentials: "include" })
        .then((r) => r.json().then((d) => ({ code: r.status, d: d })).catch(() => ({ code: r.status, d: null })))
        .then((res) => {
          if (!lebt || res.code !== 200 || !res.d || !res.d.ok) return;
          const karte = {};
          Object.keys(res.d.bausteine || {}).forEach((b) => {
            (res.d.bausteine[b] || []).forEach((p) => {
              if (p && p.isin) karte[p.isin] = { name: p.name || p.isin, baustein: b };
            });
          });
          setIsinNamen(karte);
        })
        .catch(() => {});
      return () => { lebt = false; };
    }, [an]);

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
          setMitteilung(res.d.mitteilung || null);
          if (ds.length) setBetraege(ltBetraegeUmziehen(ds[0].depot, ltBetraegeLesen(ds[0].depot), ds[0].zeilen));
          setStand(res.d.vorhanden && ds.length ? "ok" : "leer");
        })
        .catch(() => { if (lebt) setStand("fehler"); });
      return () => { lebt = false; };
    }, [an, nachladen]);

    const kopf = h("div", { className: "lt-head" },
      h("div", null,
        h("h3", { className: "lt-title" }, T("Dein Langfrist-Depot", "Your long-term portfolio"))),
      h("div", { className: "lt-sw" },
        h("span", null, an ? T("an", "on") : T("aus", "off")),
        h("button", {
          className: "sw " + (an ? "on" : "off"),
          "aria-pressed": an ? "true" : "false",
          title: T("Langfrist-Depot ein- oder ausblenden. Es werden keine Daten gel\u00F6scht.",
                   "Show or hide the long-term portfolio. No data is deleted."),
          onClick: () => { const n = !an; setAn(n); ltSchreiben(n); sfx("button-004-toggle"); }
        }, h("span", { className: "knob" }))));

    // Das Budget ist eine Rechenhilfe, kein Datenfeld — es gehoert in die
    // Werkzeugleiste, nicht als Kasten ueber die ganze Flaeche. Die Erklaerung
    // steht am Feld, nicht als Absatz daneben.
    const budgetFeld = h("label", { className: "lt-budget",
      title: T("Nur zur Orientierung. Die Zahl bleibt in diesem Browser — sie wird nicht gespeichert und nicht gesendet.",
               "For orientation only. The number stays in this browser — it is neither stored nor sent.") },
      h("span", null, T("Budget", "Budget")),
      h("input", { type: "text", inputMode: "decimal", value: budget, placeholder: "z. B. 10000",
        onChange: (e) => setBudget(e.target.value) }),
      h("i", null, "€"));

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
      // Nachtrag 4: der "kein Depot"-Zustand ist jetzt der Einstieg in die
      // gefuehrte Strecke. Der freie Weg bleibt daneben stehen — wer nur
      // ein Ziel setzen will, soll nicht durch drei Schritte muessen.
      koerper = einrichtung
        ? h(Einrichtung, {
            onAbbruch: () => setEinrichtung(false),
            onFertig: () => { setEinrichtung(false); setNachladen((n) => n + 1); },
          })
        : h("div", { className: "lt-leer" },
        h("h4", null, T("Noch keine Zielstruktur festgelegt.", "No target structure defined yet.")),
        h("p", null, T("Diese Fl\u00E4che zeigt, wie weit ein langfristig gehaltenes Verm\u00F6gen von seiner eigenen Zielstruktur abgewichen ist. Daf\u00FCr braucht es zweierlei: einen Depotauszug als Stichtag, und die Zielgewichte, gegen die gemessen wird.",
                       "This surface shows how far long-held capital has drifted from its own target structure. That needs two things: a portfolio statement as a reporting date, and the target weights to measure against.")),
        h("p", null, T("Beides bleibt bei dir. PYTHAI schlägt keine Struktur vor und bewertet keine — es stellt den Abstand dar, den du selbst definiert hast.",
                       "Both remain yours. PYTHAI proposes no structure and judges none — it shows the distance you defined yourself.")),
            h("div", { style: { marginTop: 18 } },
              h("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" } },
                h(Button, { variant: "oracle", onClick: () => setEinrichtung(true) },
                  T("In drei Schritten einrichten", "Set up in three steps")),
                h(Button, { variant: "ghost", onClick: () => setEditor({ depot: null, start: null }) },
                  T("Nur Zielstruktur festlegen", "Only define target structure")),
                h(Button, { variant: "ghost", onClick: () => setPosEditor({ depot: null }) },
                  T("Nur Stand einliefern", "Only submit reporting date")))),
            h("p", { className: "ein-p", style: { marginTop: 14, fontSize: 12.5 } },
              T("Jeder Schritt schreibt erst mit seinem Bestätigungs-Klick. Was du bestätigt hast, bleibt auch dann stehen, wenn du danach abbrichst — rückgängig macht es nur eine neue Version.",
                "Each step writes only on its confirmation click. What you have confirmed stays even if you cancel afterwards — only a new version undoes it.")));
    } else if (stand === "ok") {
      koerper = depots.map((dep, di) => {
        const zeilen = Array.isArray(dep.zeilen) ? dep.zeilen : [];
        const klassen = zeilen.filter((z) => z.ebene === "klasse");
        const rest = zeilen.filter((z) => z.ebene !== "klasse");
        const auf = !!offen[dep.depot];

        // Aufbauphase: es gibt Ziel-Positionen, die noch nicht im Depot liegen.
        // Dann ist eine Abweichung kein Verstoss, sondern ein offener Kauf —
        // die Verdikte bleiben, die Alarm-Optik nicht.
        // Ohne eingelieferten Stand haelt der Member per Definition nichts.
        // Jede Zeile dann als "ausserhalb des Bandes" zu melden, waere zwar
        // rechnerisch richtig und trotzdem Unsinn: es gibt keine Abweichung,
        // es gibt noch keinen Anfang. Die Verdikte des Servers bleiben
        // unangetastet — nur die Sprache stimmt jetzt zur Lage.
        const ohneStand = !dep.stand;
        // Aufbau misst an dem, was da ist: gibt es Positions-Ziele, zaehlen die;
        // sonst die Bausteine. Vorher haing alles an Positions-Zeilen — fehlten
        // die, sprang die Anzeige sofort in die Alarm-Optik, obwohl von sechs
        // Bausteinen erst einer gekauft war.
        const zielPos = zeilen.filter((z) => z.ebene === "position" && z.ziel_pct != null);
        const zielBs = zeilen.filter((z) => z.ebene === "baustein" && z.ziel_pct != null);
        const basis = ltBasis(zielPos, zielBs);
        const gekauft = basis.filter((z) => (z.ist_pct || 0) > 0).length;
        const aufbau = ohneStand || (basis.length > 0 && gekauft < basis.length);
        const einheit = (basis === zielPos)
          ? T("Zielpositionen", "target positions")
          : T("Bausteinen", "building blocks");

        // Zielgewicht je Baustein — wandert in den Stand-Editor, damit dort
        // neben jedem Betragsfeld steht, wie gross die Zeile werden soll.
        const zielKarte = {};
        zeilen.forEach((z) => { if (z.ebene === "baustein" && z.ziel_pct != null) zielKarte[z.schluessel] = z.ziel_pct; });

        const posName = (z) => z.name || (isinNamen[z.schluessel] && isinNamen[z.schluessel].name) || z.schluessel;
        // Seit B144 steht der Baustein am Satz selbst. Die Browser-Karte ist
        // nur noch der Notnagel fuer Daten aus der Zeit davor.
        const posBaustein = (z) => z.baustein || (isinNamen[z.schluessel] && isinNamen[z.schluessel].baustein) || null;

        // Ein Stand ist immer das GANZE Depot. Wer eine Position nachtraegt,
        // bekommt deshalb den letzten Stand vorbefuellt und ergaenzt die neue
        // Zeile — sonst wuerde der neue Stand alles Uebrige stillschweigend
        // auf null setzen.
        const gehalten = () => zeilen
          .filter((z) => z.ebene === "position" && (z.ist_pct || 0) > 0)
          .map((z) => {
            const b = posBaustein(z);
            return { name: posName(z), isin: z.schluessel,
              klasse: (b && LT_ZU_KLASSE[b]) || "aktien", baustein: b || "welt",
              gewicht_pct: String(z.ist_pct).replace(".", ","), betrag: "" };
          });

        const standFuer = (z) => {
          const alt = gehalten();
          const b = z.ebene === "position" ? posBaustein(z) : z.schluessel;
          const neu = {
            name: z.ebene === "position" ? posName(z) : "",
            isin: z.ebene === "position" ? z.schluessel : "",
            klasse: (b && LT_ZU_KLASSE[b]) || "aktien",
            baustein: b && LT_ZU_KLASSE[b] ? b : (LT_BAUSTEIN_ZU("aktien")[0] || "welt"),
            gewicht_pct: "", betrag: "",
          };
          const schon = alt.some((x) => x.isin && neu.isin && x.isin === neu.isin);
          setPosEditor({
            depot: dep.depot,
            ziel: zielKarte,
            start: schon ? alt : alt.concat([neu]),
            hinweis: alt.length
              ? T("Die Prozente stammen aus deinem letzten Stand. Ein neuer Kauf verschiebt alle Anteile — trage die neuen Werte ein oder rechne über Beträge.",
                  "The percentages come from your last reporting date. A new purchase shifts every share — enter the new values or work from amounts.")
              : T("Erster Stand: trage ein, was du heute tatsächlich hältst. Die Anteile müssen zusammen 100 % ergeben — 100 % dessen, was schon da ist.",
                  "First reporting date: enter what you actually hold today. The shares must add up to 100 % — 100 % of what is already there."),
          });
        };
        const geplant = (z) => z.ziel_pct != null && !((z.ist_pct || 0) > 0);

        // Waehrend des Aufbaus ist der Anteil einer gekauften Zeile ein
        // Artefakt: wer erst einen von sechs Bausteinen besitzt, haelt darin
        // zwangslaeufig 100 %. Das als "60 Punkte ueber Ziel, ausserhalb des
        // Bandes" zu melden, ist rechnerisch richtig und trotzdem eine
        // Falschaussage — die Kopfzeile sagt eine Zeile darueber das Gegenteil.
        // Die Bandsprache beginnt erst, wenn der Aufbau steht.
        const imAufbau = (z) => aufbau && (z.ist_pct || 0) > 0;
        // Die eingetragene Summe haengt am Baustein; die Positionszeile zeigt
        // sie nicht noch einmal, sonst stuende dieselbe Zahl doppelt.
        // Position: ihre eigene Summe. Baustein: die Summe seiner Produkte.
        // Klasse: die Summe ihrer Bausteine — die fehlte, deshalb stand in der
        // Klassenzeile ein Strich, obwohl darunter Betraege lagen.
        const betragPos = (isin) => {
          const b = betraege[isin];
          return typeof b === "number" && b > 0 ? b : 0;
        };
        const betragVon = (z) => {
          if (z.ebene === "position") return betragPos(z.schluessel) || null;
          const passt = z.ebene === "baustein"
            ? (y) => y.baustein === z.schluessel
            : (z.ebene === "klasse" ? (y) => LT_ZU_KLASSE[y.baustein] === z.schluessel : null);
          if (!passt) return null;
          const su = zeilen.filter((y) => y.ebene === "position" && y.baustein && passt(y))
            .reduce((a, y) => a + betragPos(y.schluessel), 0);
          return su > 0 ? su : null;
        };

        // Was bis zur SELBST gesetzten Zielstruktur fehlt. Reine Arithmetik auf
        // den Eingaben des Members: Ziel minus Ist. Kein Produkt, kein Zeitpunkt,
        // keine Empfehlung — das ist die Grenze, und sie liegt genau hier.
        // Nur unterhalb des Ziels; darueber sagt ltAussage bereits das Noetige.
        // Bei "geplant" waere es doppelt: dort steht der volle Zielanteil schon.
        const fehltPp = (z) => {
          if (z.ziel_pct == null || geplant(z)) return null;
          const d = z.ziel_pct - (z.ist_pct || 0);
          return d > LT_TOLERANZ ? d : null;
        };

        // Veraenderung seit dem Einstand. Zwei Kurse, eine Division — mehr ist
        // es nicht, und mehr soll es nicht sein. Kein Betrag, keine Stueckzahl,
        // keine Aussage darueber, was daraus folgt. Fehlt eine der beiden
        // Zahlen, steht hier nichts: eine Veraenderung gegen einen unbekannten
        // Einstand waere erfunden.
        const seitEinstand = (z) => {
          if (z.ebene !== "position") return null;
          const ek = typeof z.einstand === "number" ? z.einstand : null;
          const k = typeof z.kurs === "number" ? z.kurs : null;
          if (ek == null || k == null || !(ek > 0)) return null;
          return ((k - ek) / ek) * 100;
        };
        const kursTitel = (z) => {
          if (typeof z.kurs !== "number") return undefined;
          const w = z.waehrung || "EUR";
          let t = T("Kurs " + ltPct(z.kurs) + " " + w, "Price " + ltPct(z.kurs) + " " + w);
          if (typeof z.einstand === "number") t += T(" · Einstand " + ltPct(z.einstand) + " " + w,
                                                    " · purchase price " + ltPct(z.einstand) + " " + w);
          if (z.kurs_stand) { const d = new Date(z.kurs_stand);
            if (!isNaN(d.getTime())) t += T(" · abgerufen " + d.toLocaleString("de-DE"), " · retrieved " + d.toLocaleString("en-GB")); }
          return t;
        };

        // Seit B144 nennt jede Positions-Zeile ihren Baustein. Vorher hing sie
        // hinten in der Liste und war visuell mit nichts verbunden — genau der
        // Befund "ein ETF wird nicht dem Baustein zugeordnet". Jetzt steht sie
        // eingerueckt unter dem Baustein, den sie fuellt.
        const ordne = (liste) => {
          const bs = liste.filter((z) => z.ebene === "baustein");
          const ps = liste.filter((z) => z.ebene === "position");
          const rest2 = liste.filter((z) => z.ebene !== "baustein" && z.ebene !== "position");
          const out = [];
          const vergeben = new Set();
          bs.forEach((b) => {
            out.push({ z: b, unter: false });
            ps.forEach((p, i) => {
              if (p.baustein === b.schluessel) { out.push({ z: p, unter: true }); vergeben.add(i); }
            });
          });
          // Positionen ohne (bekannten) Baustein gehen nicht verloren — sie
          // stehen hinten und sagen selbst, dass ihnen die Zuordnung fehlt.
          ps.forEach((p, i) => { if (!vergeben.has(i)) out.push({ z: p, unter: false, heimatlos: true }); });
          rest2.forEach((z) => out.push({ z: z, unter: false }));
          return out;
        };

        // Der Editor gehoert AN die Zeile, nicht an den Anfang der Flaeche.
        // Wer auf Bearbeiten drueckt und dann 800 Pixel nach oben springt,
        // verliert den Zusammenhang zu dem, was er bearbeitet.
        const editorHier = (z) => (zeilenEditor && zeilenEditor.depot === dep.depot
          && zeilenEditor.anker === z.ebene + ":" + z.schluessel)
          ? h(ZeileEditor, {
              key: "zed-" + z.schluessel,
              depot: zeilenEditor.depot,
              baustein: zeilenEditor.baustein,
              isin: zeilenEditor.isin || null,
              zeilen: zeilen,
              betraege: betraege,
              budget: (budgetZahl != null && budgetZahl > 0) ? budgetZahl : null,
              onGespeichert: () => { setZeilenEditor(null); setBetraege(ltBetraegeLesen(dep.depot)); setNachladen((n) => n + 1); },
              onSchliessen: () => setZeilenEditor(null),
              onZurStruktur: () => { setZeilenEditor(null);
                setEditor({ depot: dep.depot, start: zeilen.filter((y) => y.ziel_pct != null), ist: zeilen }); },
            })
          : null;

        // Die Zeile trug bisher einen SATZ. Ein Satz kann "noch nicht gekauft"
        // sagen, aber er kann keine Spalte bilden — deshalb standen an der
        // Stelle, wo Zahlen hingehoeren, Worte. Ab hier: vier feste Felder,
        // rechtsbuendig, in Mono. Fehlt ein Wert, steht ein Strich; ein Strich
        // ist eine Aussage, eine Leerstelle ist keine.
        const zahl = (x, einheit) => (x == null || isNaN(x))
          ? h("span", { className: "z-leer" }, "—")
          : h("span", null, ltPct(x) + (einheit || ""));

        const zahlen = (z) => {
          const ist = typeof z.ist_pct === "number" ? z.ist_pct : null;
          const ziel = typeof z.ziel_pct === "number" ? z.ziel_pct : null;
          const bet = betragVon(z);
          const v = seitEinstand(z);
          return h("div", { className: "lt-zahlen" },
            h("span", { className: "z-ist" + (ist ? "" : " z-null"), title: T("Anteil heute", "share today") }, zahl(ist, " %")),
            h("span", { className: "z-ziel", title: T("Zielanteil", "target share") }, zahl(ziel, " %")),
            h("span", { className: "z-eur", title: T("angelegte Summe", "amount invested") },
              bet != null ? euroText(bet) + " €"
                : (inEuro(ziel) != null ? h("span", { className: "z-plan" }, euroText(inEuro(ziel)) + " €")
                                        : h("span", { className: "z-leer" }, "—"))),
            h("span", { className: "z-delta" + (v == null ? "" : (Math.abs(v) < 0.05 ? "" : (v > 0 ? " auf" : " ab"))),
              title: kursTitel(z) },
              v == null ? h("span", { className: "z-leer" }, "—")
                : (Math.abs(v) < 0.05 ? "±0,0 %" : (v > 0 ? "+" : "\u2212") + ltPct(Math.abs(v)) + " %")));
        };

        const zeile = (z, i, opt) => h("div", { key: i, className: "lt-row"
            + ((opt && opt.unter) ? " unter" : "")
            + (z.verdikt === "band_verletzt" && !aufbau ? " b-aus" : "") },
          h("div", { className: "satz" },
            h("b", null, z.ebene === "position" ? posName(z) : ltName(z)),
            (opt && opt.heimatlos) ? h("span", { className: "lt-fehlt" },
              T(" · noch keinem Baustein zugeordnet", " · not yet assigned to a building block")) : null,
            " \u00B7 ",
            // Klassen und Bausteine sagen, WAS sie sind — der Zustand steht
            // ohnehin rechts als Marke. Zweimal dasselbe waere Platzverschwendung
            // und erklaert niemandem etwas.
            z.ebene !== "position"
              ? (ltErklaerung(z) || "")
              : (geplant(z) ? T("noch nicht gekauft", "not bought yet")
                : imAufbau(z) ? T("gekauft", "bought")
                : z.ziel_pct == null ? T("keine Zielstruktur festgelegt", "no target structure defined")
                : ltLage(z)),
            null,
            null,
            null,
            null),
          zahlen(z),
          h("div", { className: "lt-rechts" },
            h("div", { className: "marke" + (geplant(z) ? " plan" : (z.verdikt === "band_verletzt" && !aufbau ? " aus" : "")) },
              geplant(z) ? T("geplant", "planned")
                : imAufbau(z) ? T("gekauft", "bought")
                : z.verdikt === "band_verletzt" ? T("au\u00DFerhalb", "outside")
                : z.verdikt === "im_band" ? T("im Band", "in band")
                : z.verdikt === "ohne_band" ? T("kein Band", "no band")
                : T("kein Ziel", "no target")),
            z.ebene === "baustein"
              ? h("button", { className: "lt-kauf",
                  title: T("Legt ein weiteres Produkt in diesem Baustein an. Ein Baustein darf mehrere tragen.",
                           "Adds another product to this building block. A block may carry several."),
                  onClick: () => setZeilenEditor({ depot: dep.depot, baustein: z.schluessel,
                    isin: null, anker: z.ebene + ":" + z.schluessel }) },
                  T("Hinzuf\u00FCgen", "Add"))
              : null,
            z.ebene === "position"
              ? h("button", { className: "lt-kauf",
                  title: T("Öffnet nur diese Zeile: Produkt, ISIN, Einstandskurs und angelegte Summe.",
                           "Opens this row only: product, ISIN, purchase price and amount invested."),
                  onClick: () => setZeilenEditor({ depot: dep.depot,
                    baustein: posBaustein(z) || z.baustein, isin: z.schluessel,
                    anker: z.ebene + ":" + z.schluessel }) },
                  T("Bearbeiten", "Edit"))
              : null));
        return h("div", { key: dep.depot || di },
          h("div", { className: "lt-stand" },
            h("span", null, ohneStand
              ? T("Noch kein Stand eingeliefert", "No reporting date submitted yet")
              : T("Stand: ", "As of: ") + ltDatum(dep.stand)),
            dep.stand_alter_tage != null ? h("span", { className: "alt" },
              dep.stand_alter_tage === 0 ? T("heute", "today")
                : dep.stand_alter_tage === 1 ? T("vor 1 Tag", "1 day ago")
                : T("vor " + dep.stand_alter_tage + " Tagen", dep.stand_alter_tage + " days ago")) : null,
            dep.depot ? h("span", { className: "depot" }, dep.depot) : null),
          ohneStand ? h("p", { className: "lt-aufbau" },
            T("Deine Zielstruktur steht. Was du tatsächlich hältst, weiß die Fläche noch nicht — liefere einen Stand ein, dann zeigt sie den Abstand dazu.",
              "Your target structure is in place. The surface does not yet know what you actually hold — submit a reporting date and it will show the distance."))
          : aufbau ? h("p", { className: "lt-aufbau" },
            T("Aufbauphase: " + gekauft + " von " + basis.length + " " + einheit + " im Depot. Was fehlt, ist noch nicht gekauft — keine Abweichung, die etwas verlangt.",
              "Build-up phase: " + gekauft + " of " + basis.length + " " + einheit + " in the portfolio. What is missing has simply not been bought yet — not a deviation that demands anything.")) : null,
          dep.mechanik ? h(Mechanik, { m: dep.mechanik, budget: budgetZahl, aufbau: aufbau,
            name: dep.depot }) : null,
          ohneStand ? null : h("p", { className: "lt-warn" },
            T("Die Zahlen beziehen sich auf diesen Stichtag und bewegen sich bis zum n\u00E4chsten Auszug nicht.",
              "The figures refer to that reporting date and do not move until the next statement.")),
          dep.ziel_gueltig_ab == null ? h("div", { className: "lt-leer", style: { marginBottom: 20 } },
            h("h4", null, T("Ist-Struktur ohne Ziel.", "Actual structure, no target.")),
            h("p", null, T("Der Auszug liegt vor, die Zielgewichte fehlen noch. Ohne Ziel gibt es keinen Abstand zu messen — unten steht, wie es heute aussieht.",
                           "The statement is on file, the target weights are not. Without a target there is no distance to measure — below is how it looks today."))) : null,
          klassen.length ? h("div", { className: "lt-grp" },
            h("div", { className: "lt-grp-t" }, T("Klassen", "Classes")),
            h("div", { className: "lt-kopfzeile" }, h("span", null, ""),
              h("div", { className: "lt-zahlen" },
                h("span", { className: "z-ist" }, T("ist", "actual")),
                h("span", { className: "z-ziel" }, T("Ziel", "target")),
                h("span", { className: "z-eur" }, T("Summe", "amount")),
                h("span", { className: "z-delta" }, T("Einstand", "vs. buy")))),
            klassen.map((z, i) => [zeile(z, i), editorHier(z)])) : null,
          rest.length ? h("div", { className: "lt-grp" },
            h("button", { className: "lt-mehr", onClick: () => setOffen(Object.assign({}, offen, { [dep.depot]: !auf })) },
              auf ? T("Bausteine und Produkte schlie\u00DFen ▴", "Close building blocks and products ▴")
                  : T("Bausteine und Produkte ansehen ▾ (" + rest.length + ")", "View building blocks and products ▾ (" + rest.length + ")")),
            auf ? h("div", { style: { marginTop: 8 } },
              ordne(rest).map((e, i) => [zeile(e.z, i, e), editorHier(e.z)])) : null) : null,
          // Die beiden Aktionen stehen fuer das erste Depot oben in der
          // Werkzeugleiste — dort, wo bei den Thesen auch gehandelt wird.
          // Nur bei mehreren Depots braucht jedes seine eigenen Knoepfe.
          di > 0 ? h("div", { style: { marginTop: 18 } },
            h("button", { className: "lt-mehr", onClick: () => setEditor({ depot: dep.depot, start: zeilen.filter((z) => z.ziel_pct != null), ist: zeilen }) },
              dep.ziel_gueltig_ab == null ? T("Zielstruktur festlegen", "Define target structure")
                                          : T("Zielstruktur \u00E4ndern", "Change target structure")),
            h("button", { className: "lt-mehr", style: { marginLeft: 22 }, onClick: () => setPosEditor({ depot: dep.depot, ziel: zielKarte, start: gehalten().length ? gehalten() : null }) },
              T("Neuen Stand einliefern", "Submit new reporting date"))) : null,
          dep.depot ? h(DepotLoeschen, { depot: dep.depot, onGeloescht: () => setNachladen((n) => n + 1) }) : null);
      });
    }

    // Werkzeugleiste im Rhythmus der Thesen-Flaeche: Kopf, dann Leiste, dann
    // Inhalt. Die Aktionen standen bisher ganz unten — nach allen Zeilen, wo
    // niemand sie sucht.
    const haupt = (stand === "ok" && Array.isArray(depots) && depots.length) ? depots[0] : null;
    let werkzeug = null;
    if (haupt) {
      const hz = Array.isArray(haupt.zeilen) ? haupt.zeilen : [];
      const hPos = hz.filter((z) => z.ebene === "position" && z.ziel_pct != null);
      const hBs = hz.filter((z) => z.ebene === "baustein" && z.ziel_pct != null);
      const hBasis = ltBasis(hPos, hBs);
      const hGekauft = hBasis.filter((z) => (z.ist_pct || 0) > 0).length;
      werkzeug = h("div", { className: "toolbar lt-werk" },
        h(PyEyebrow, null, hBasis.length
          ? T("\u00DCberblick · " + hGekauft + "/" + hBasis.length + " "
              + (hBasis === hPos ? "Positionen" : "Bausteine") + " im Depot",
              "Overview · " + hGekauft + "/" + hBasis.length + " "
              + (hBasis === hPos ? "positions" : "building blocks") + " held")
          : T("\u00DCberblick", "Overview")),
        h("div", { className: "lt-werk-r" },
          budgetFeld,
          betragSumme > 0
            ? h("span", { className: "lt-gesamt",
                title: T("Summe der angelegten Betraege aus den Zeilen. Bleibt in diesem Browser.",
                         "Sum of the amounts entered in the rows. Stays in this browser.") },
                T("angelegt " + euroText(betragSumme) + " €", "invested " + euroText(betragSumme) + " €")
                + (budgetZahl != null && budgetZahl > 0
                    ? T(" von " + euroText(budgetZahl) + " €", " of " + euroText(budgetZahl) + " €") : ""))
            : null,
          h(Button, { variant: "ghost", size: "sm",
            onClick: () => setEditor({ depot: haupt.depot, start: hz.filter((z) => z.ziel_pct != null), ist: hz }) },
            haupt.ziel_gueltig_ab == null ? T("Zielstruktur festlegen", "Define target structure")
                                          : T("Zielstruktur \u00E4ndern", "Change target structure")),
          // "Neuen Stand einliefern" ist hier weg. Alles laeuft ueber die
          // Bausteine unten: "Hinzufuegen" legt ein Produkt an, "Bearbeiten"
          // aendert es, und der Stand errechnet sich aus den Summen. Zwei
          // Wege zum selben Ziel waren genau die Verwirrung.
          ));
    }

    return h("div", { className: "lt" }, kopf, erklaerung,
      mitteilung ? h(Mitteilung, { m: mitteilung }) : null,
      werkzeug,
      (haupt || stand !== "ok") ? null : budgetFeld,
      editor ? h(ZielEditor, { depot: editor.depot, start: editor.start, ist: editor.ist || null, onSchliessen: () => setEditor(null) }) : null,
      posEditor ? h(PositionsEditor, { depot: posEditor.depot, start: posEditor.start || null,
        vorher: posEditor.vorher || 0, vorherDatum: posEditor.vorherDatum || null,
        hinweis: posEditor.hinweis || null,
        zielGewichte: posEditor.ziel || null,
        budget: (budgetZahl != null && budgetZahl > 0) ? budgetZahl : null,
        onGespeichert: () => setNachladen((n) => n + 1),
        onSchliessen: () => setPosEditor(null) }) : null,
      koerper,
      h("p", { className: "lt-fuss" },
        T("Darstellung einer selbst festgelegten Struktur zum genannten Stichtag. Keine Anlageberatung, keine Empfehlung, keine Aufforderung zu irgendeiner Transaktion. Keine Beträge, keine Stückzahlen — die Struktur zählt, nicht das Vermögen.",
          "A display of a self-defined structure as of the stated reporting date. Not investment advice, not a recommendation, not a prompt to any transaction. No amounts, no quantities — the structure matters, not the wealth.")));
  }

  // --- Auge · beobachtet / beobachtet nicht --------------------------------
  // Kein fremdes Icon-Set: das Zeichen ist der PYTHAI-Oculus, in ein Lid
  // gesetzt. Aussenring, Goldring, heller Kern — dieselben drei Kreise wie im
  // Logo. Im Aus-Zustand bleibt die Form, das Licht geht aus und ein Strich
  // faehrt durch; der Strich traegt eine Kontur in Hintergrundfarbe, sonst
  // verschmilzt er bei kleinen Groessen mit dem Lid.
  function Auge({ an, groesse }) {
    const s = groesse || 18;
    const gold = "var(--oracle, #D4A94E)";
    const hell = "var(--oracle-bright, #F2CE7A)";
    const aus = "var(--text-muted, #5A616E)";
    const farbe = an ? gold : aus;
    return h("svg", { width: s, height: s, viewBox: "0 0 24 24", fill: "none",
        "aria-hidden": "true", focusable: "false", style: { display: "block", flex: "0 0 auto" } },
      // Lid
      h("path", { d: "M1.8 12S5.5 5.4 12 5.4 22.2 12 22.2 12 18.5 18.6 12 18.6 1.8 12 1.8 12Z",
        stroke: farbe, strokeWidth: 1.4, strokeLinejoin: "round",
        opacity: an ? 1 : 0.75 }),
      // Iris — der Goldring des Oculus
      h("circle", { cx: 12, cy: 12, r: 4.1, stroke: an ? gold : aus, strokeWidth: an ? 1.6 : 1.2,
        opacity: an ? 1 : 0.7 }),
      // Kern: nur wenn beobachtet wird. Das ist der ganze Unterschied.
      an ? h("circle", { cx: 12, cy: 12, r: 1.7, fill: hell }) : null,
      // Strich mit Trennkontur
      an ? null : h("line", { x1: 3.4, y1: 20.4, x2: 20.6, y2: 3.6,
        stroke: "var(--bg-void, #08090C)", strokeWidth: 3.4, strokeLinecap: "round" }),
      an ? null : h("line", { x1: 3.4, y1: 20.4, x2: 20.6, y2: 3.6,
        stroke: aus, strokeWidth: 1.4, strokeLinecap: "round" }));
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
    // Der Schalter war bisher blind: er hat lokal umgestellt, die Anfrage
    // abgeschickt und die Antwort NIE angesehen. Schrieb der Server nicht,
    // sah der Nutzer trotzdem "an" — bis der 90-Sekunden-Abgleich die Liste
    // neu holte und der Schalter ohne Erklaerung zuruecksprang.
    //
    // Ab hier gilt: erst optimistisch anzeigen, dann pruefen, und bei
    // Widerspruch sofort zuruecknehmen und es sagen. Geprueft wird zweimal —
    // die Antwort auf das Schreiben UND der Datensatz danach. Ein Server, der
    // ok sagt und nichts speichert, faellt sonst durch jedes Netz.
    const setMon = (id, on, channel) => {
      const zurueck = (grund) => {
        setRows((rs) => rs.map((r) => r.id === id ? Object.assign({}, r, { monitored: !on, channel: null }) : r));
        showFlash(on
          ? T("Beobachten konnte nicht eingeschaltet werden (" + grund + ").", "Monitoring could not be switched on (" + grund + ").")
          : T("Beobachten konnte nicht ausgeschaltet werden (" + grund + ").", "Monitoring could not be switched off (" + grund + ")."));
      };
      setRows((rs) => rs.map((r) => r.id === id
        ? Object.assign({}, r, { monitored: on, channel: on ? (channel === "both" ? "SMS + Mail" : channel === "sms" ? "SMS" : "Mail") : null })
        : r));
      api("/api/mybook/" + id + "/monitor", { on: on, channel: channel || "mail" })
        .then((r) => {
          if (!r) { zurueck(T("keine Verbindung", "no connection")); return null; }
          if (!r.ok) { zurueck(r.status); return null; }
          return r.json().catch(() => ({ ok: true }));
        })
        .then((d) => {
          if (d == null) return null;
          if (d && d.ok === false) { zurueck((d.error || "abgelehnt")); return null; }
          // Gegenprobe am Datensatz: hat der Server wirklich geschrieben?
          return fetch(API + "/api/mybook", { credentials: "include" })
            .then((r) => (r && r.ok ? r.json() : null))
            .then((liste) => {
              if (!liste || !Array.isArray(liste.topics)) return null;
              const t = liste.topics.find((x) => x.id === id);
              if (t && !!t.monitored !== !!on) {
                zurueck(T("der Server hat den Schalter nicht \u00FCbernommen",
                          "the server did not accept the switch"));
                return null;
              }
              setRows(liste.topics);
              return null;
            });
        })
        .catch(() => zurueck(T("Netzwerkfehler", "network error")));
    };
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
        h("h2", { className: "mb" }, T("Deine Thesen", "Your theses")),
        h("p", { className: "mb-lead" },
          T("Einzelne Positionen mit deinen Marken, Kill-Triggern und der Verweildauer. Jede These hat ein Ende — hier siehst du, wie sie steht.",
            "Individual positions with your levels, kill-triggers and holding time. Every thesis has an end — here is how it stands.")),
        h("div", { className: "toolbar" },
          h(PyEyebrow, null, T("Überblick · ", "Overview · ") + count + "/" + MAX + " Topics"),
          h("div", { style: { display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" } },
            h("div", { className: "vtog" },
              h("button", { className: simple ? "on" : "", "data-sfx": "", onClick: () => { sfx("button-004-toggle"); setSimple(true); } }, T("Einfach", "Simple")),
              h("button", { className: !simple ? "on" : "", "data-sfx": "", onClick: () => { sfx("button-004-toggle"); setSimple(false); } }, T("Detail", "Detail"))),
            h("label", { className: "rep" }, h("button", { className: "sw " + (summary ? "on" : "off"), onClick: () => { sfx("button-004-toggle"); setSummary(!summary); } }, h("span", { className: "knob" })), T("Tägliche My-Book-Summary", "Daily My-Book summary")),
            h(Button, { variant: "oracle", size: "sm", disabled: count >= MAX, onClick: addTopic }, T("+ Topic hinzufügen", "+ Add topic")))),

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
              h("button", { className: "sauge" + (p.monitored ? " an" : ""),
                "aria-pressed": p.monitored ? "true" : "false",
                "aria-label": p.monitored ? T("Beobachten aus", "Turn monitoring off") : T("Beobachten an", "Turn monitoring on"),
                title: p.monitored
                  ? T("Wird beobachtet — Warren meldet, wenn eine Marke fällt.", "Monitored — Warren reports when a level breaks.")
                  : T("Wird nicht beobachtet.", "Not monitored."),
                onClick: (e) => { e.stopPropagation(); toggleMon(p); } },
                h(Auge, { an: !!p.monitored })),
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
