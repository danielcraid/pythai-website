(() => {
  const { Button } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const API = "https://api.pythai.ch";
  const { useState, useEffect } = React;
  const h = React.createElement;
  const PRIV = ["syndicate", "admin"];                                  // darf "In My Book" klicken
  const VIEW = ["inner-circle", "circle-of-trust", "syndicate", "admin"]; // darf die Shortlist sehen

  const Z = ["#C4524C", "#CF7A4E", "#C9A24E", "#6FB07A", "#6FCF9A"];
  const ZONE = ["GEBROCHEN", "WACKELT", "NEUTRAL", "INTAKT", "STARK"];
  const ZLAB = { GEBROCHEN: T("Gebrochen", "Broken"), WACKELT: T("Wackelt", "Wobbling"), NEUTRAL: T("Neutral", "Neutral"), INTAKT: T("Intakt", "Intact"), STARK: T("Stark", "Strong") };
  const wpct = (s) => Math.max(3, Math.min(97, Math.round((s + 1) / 2 * 100)));

  // tolerant: Number | "73.00" | "1.218,80"
  const num = (x) => {
    if (x == null || x === "") return null;
    if (typeof x === "number") return isFinite(x) ? x : null;
    let s = String(x).trim().replace(/[^\d.,\-]/g, "");
    if (s.indexOf(",") !== -1 && s.indexOf(".") !== -1) s = s.replace(/\./g, "").replace(",", ".");
    else if (s.indexOf(",") !== -1) s = s.replace(",", ".");
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  };
  const parseSkims = (s) => String(s == null ? "" : s).split(/[,;·\/]/).map((x) => num(x)).filter((x) => x != null);
  const deFmt = (n) => n == null ? "—" : Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const zoneColor = (label) => Z[ZONE.indexOf(label)] || "var(--mist)";
  const bmPct = (t) => {
    if (t.waage_pct != null && isFinite(t.waage_pct)) return Math.max(3, Math.min(97, Number(t.waage_pct)));
    if (t.waage_score != null) return wpct(Number(t.waage_score));
    return 50;
  };
  // Distanz/Change als signierter String (akzeptiert Zahl oder fertigen String)
  const pctStr = (v) => { if (v == null || v === "") return null; if (typeof v === "number") return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1) + " %"; return String(v).trim(); };
  const isNeg = (s) => /^[\-−–]/.test(String(s == null ? "" : s).trim());
  const liveNum = (t) => { const a = num(t.live_price); return a != null ? a : num(t.live); };
  const killList = (t) => { if (Array.isArray(t.thesis_kill_triggers) && t.thesis_kill_triggers.length) return t.thesis_kill_triggers; if (t.kill) return String(t.kill).split(/\s*·\s*/).filter(Boolean); return []; };
  // Position-Risk (4-Level) ist getrennt von Thesen-Stärke (waage, 5-Level). Decision-Tree -> 1 konsolidierte Pill (kein Mittelwert).
  const POSR = ["stopped", "danger", "caution", "safe"];
  const POSCOL = ["#C4524C", "#CF7A4E", "#C9A24E", "#6FCF9A"];
  const posLabel = (l) => ({ stopped: T("Gestoppt", "Stopped"), danger: T("Gefahr", "Danger"), caution: T("Vorsicht", "Caution"), safe: T("Sicher", "Safe") }[String(l || "").toLowerCase()] || (l || "—"));
  // Status-Pill: Backend ist authoritative (t.status.key). Fallback nutzt live>entry (NICHT position_risk_score).
  const PILLMETA = {
    STOPPED: { cls: "st-red", l: T("Gestoppt", "Stopped"), t: T("Stop berührt — Position physisch geschlossen.", "Stop touched — position physically closed.") },
    ACTION: { cls: "st-red", l: T("Aktion erforderlich", "Action required"), t: T("These gebrochen. Du entscheidest.", "Thesis broken. Your call.") },
    POSITION: { cls: "st-orange", l: T("Positions-Risiko", "Position risk"), t: T("Position läuft gegen dich. Stop-Nähe oder Drawdown ab 5 %.", "Position running against you. Near stop or drawdown 5%+.") },
    SKIM: { cls: "st-yellow", l: T("Skim-Chance", "Skim chance"), t: T("Im Plus, aber Catalyst wackelt. Klassischer Skim-Moment.", "In profit but the catalyst is wobbling. Classic skim moment.") },
    DRIFT: { cls: "st-orange", l: T("Drift", "Drift"), t: T("Position negativ + Story bröckelt. Schau hin.", "Position negative + story crumbling. Look.") },
    STARK: { cls: "st-greenS", l: T("Stark", "Strong"), t: T("Im Plus, Story bestätigt.", "In profit, story confirmed.") },
    INTAKT: { cls: "st-green", l: T("Intakt", "Intact"), t: T("Story trägt.", "Story holds.") }
  };
  const parseDeNum = (s) => { if (s == null) return null; if (typeof s === "number") return isFinite(s) ? s : null; const n = parseFloat(String(s).replace(/\./g, "").replace(",", ".")); return isFinite(n) ? n : null; };
  const statusKeyOf = (t) => {
    if (t.status && t.status.key) return String(t.status.key).toUpperCase();
    const thesis = String(t.waage_label || "").toUpperCase();
    const pos = String(t.position_risk_label || "").toLowerCase();
    const liveN = parseDeNum(t.live), entryN = parseDeNum(t.entry);
    const inProfit = (liveN != null && entryN != null && entryN > 0) ? liveN > entryN : null;
    if (pos === "stopped") return "STOPPED";
    if (thesis === "GEBROCHEN") return "ACTION";
    if (pos === "danger") return "POSITION";
    if (thesis === "WACKELT" && inProfit === true) return "SKIM";
    if (thesis === "WACKELT") return "DRIFT";
    if (thesis === "STARK" && inProfit === true) return "STARK";
    return "INTAKT";
  };
  const consolidatedStatus = (t) => { const m = PILLMETA[statusKeyOf(t)] || PILLMETA.INTAKT; return { cls: m.cls, label: m.l, tip: m.t }; };
  function PosBar(t) {
    const lab = String(t.position_risk_label || "").toLowerCase();
    const idx = POSR.indexOf(lab);
    // Pfeil in die Mitte des Label-Segments (diskrete 4er-Skala) — NICHT per kontinuierlichem pct, sonst Farbe unter Pfeil != Label.
    const pct = idx >= 0 ? (idx + 0.5) / 4 * 100 : 50;
    const col = idx >= 0 ? POSCOL[idx] : "var(--mist)";
    return h("div", { className: "bm full" },
      h("div", { className: "bm-ptr" }, h("span", { style: { left: pct + "%", color: col } }, "▼")),
      h("div", { className: "bm-bar" }, POSCOL.map((c, i) => h("span", { key: i, style: { background: c } }))),
      h("div", { className: "bm-zones" }, POSR.map((o, i) => h("span", { key: i, style: { color: POSCOL[i] } }, posLabel(o)))),
      h("div", { className: "bm-lab", style: { color: col } }, posLabel(lab)));
  }
  // Lifecycle (VC 16.06.): held_by_me Pill, Lifetime-Klassen (kein Emoji), Archiv.
  const deShort = (iso) => { if (!iso) return ""; try { const d = new Date(iso); if (isNaN(d.getTime())) return ""; return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear(); } catch (e) { return ""; } };
  const archReason = (r) => { const k = String(r || "").toLowerCase(); if (k.indexOf("stop") > -1 && (k.indexOf("thesis") > -1 || k.indexOf("kill") > -1)) return T("These gekillt / Stop erreicht", "Thesis killed / stop hit"); if (k.indexOf("stop") > -1) return T("Stop erreicht", "Stop hit"); if (k.indexOf("kill") > -1 || k.indexOf("thesis") > -1) return T("These gekillt", "Thesis killed"); if (k.indexOf("event") > -1 || k.indexOf("passed") > -1) return T("Event vorbei", "Event passed"); if (k.indexOf("idle") > -1) return T("inaktiv archiviert", "archived idle"); return r || T("archiviert", "archived"); };
  const ltMeta = (c) => ({
    long_hold: { l: T("Struktur", "Structural"), t: T("Long-Hold — Struktur-These ohne Catalyst-Datum, bleibt unbegrenzt im Pool.", "Long hold — structural thesis with no catalyst date, stays in the pool indefinitely.") },
    medium_term: { l: T("Mittelfrist", "Mid-term"), t: T("Mittelfrist — Sektor/Macro, ohne scharfes Setup nach 14 Tagen archiviert.", "Mid-term — sector/macro, archived after 14 idle days.") },
    short_term: { l: T("Kurzfrist", "Short-term"), t: T("Kurzfrist — Catalyst-Trade, ohne Setup nach 7 Tagen archiviert.", "Short-term — catalyst trade, archived after 7 idle days.") },
    event_driven: { l: T("Event", "Event"), t: T("Event-gebunden — 2 Tage nach dem Event-Datum archiviert.", "Event-driven — archived 2 days after the event date.") }
  }[String(c || "").toLowerCase()] || { l: T("Mittelfrist", "Mid-term"), t: T("Mittelfrist — Standard-Lebensdauer.", "Mid-term — default lifetime.") });

  const CSS = `
  #sl-root{ --void:var(--bg-base); --raised:var(--bg-raised); --card:var(--bg-surface); --line:var(--border-subtle); --parch:var(--parchment); --mist:var(--text-secondary); --ash:var(--text-muted); --oracle-b:var(--oracle-bright); --ox-b:#E0726B; --bull:var(--bull-bright); --input:var(--bg-input); --steel:#7C8492; }
  #sl-root .wrap{max-width:1120px;margin:0 auto;padding:54px 28px 90px;}
  #sl-root .hero{text-align:center;max-width:760px;margin:0 auto 40px;}
  #sl-root .htitle{font-family:var(--font-oracle);font-weight:400;font-size:clamp(38px,6vw,58px);line-height:1.02;color:var(--parch);margin:14px 0 0;}
  #sl-root .hlead{font-family:var(--font-ui);font-size:clamp(15px,2vw,17px);line-height:1.6;color:var(--mist);margin:18px auto 0;max-width:56ch;}
  #sl-root .hmeta{display:inline-flex;align-items:center;gap:10px;margin-top:22px;font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ash);}
  #sl-root .pulse{width:7px;height:7px;border-radius:50%;background:var(--bull);animation:slPulse 2.4s ease-out infinite;}
  @keyframes slPulse{0%{box-shadow:0 0 0 0 rgba(111,207,154,.55)}70%{box-shadow:0 0 0 9px rgba(111,207,154,0)}100%{box-shadow:0 0 0 0 rgba(111,207,154,0)}}
  #sl-root .cnt{color:var(--oracle-b);font-weight:700;}
  #sl-root .chkmeta{cursor:help;border-bottom:1px dotted var(--steel);padding-bottom:1px;}
  #sl-root .listmeta{font-family:var(--font-mono);font-size:10px;color:var(--steel);margin-top:6px;letter-spacing:.02em;}
  #sl-root .listmeta.over{color:#C9A24E;}

  #sl-root .card{border:1px solid var(--line);border-radius:14px;background:var(--card);margin-bottom:13px;overflow:hidden;transition:border-color .18s;}
  #sl-root .card:hover{border-color:#2C313B;}
  #sl-root .card.open{border-color:var(--border-oracle);}
  #sl-root .card.held{border-left:2px solid rgba(212,169,78,.55);}
  #sl-root .head{display:grid;grid-template-columns:minmax(0,1fr) 236px 150px 24px;gap:26px;align-items:center;padding:20px 24px;cursor:pointer;}
  #sl-root .id{min-width:0;}
  #sl-root .cat{font-family:var(--font-mono);font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--steel);}
  #sl-root .cat.short{color:var(--ox-b);} #sl-root .cat.long{color:var(--bull);}
  #sl-root .nm{font-family:var(--font-oracle);font-size:24px;line-height:1.08;color:var(--parch);margin-top:3px;}
  #sl-root .sub{display:flex;align-items:center;gap:10px;margin-top:5px;flex-wrap:wrap;}
  #sl-root .isin{font-family:var(--font-mono);font-size:10px;color:var(--ash);letter-spacing:.04em;}
  #sl-root .day{font-family:var(--font-mono);font-size:10px;color:var(--steel);}
  #sl-root .wtag{font-family:var(--font-mono);font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);border:1px solid #2A2F39;border-radius:4px;padding:2px 6px;}

  #sl-root .bm{width:100%;}
  #sl-root .bm-ptr{position:relative;height:11px;}
  #sl-root .bm-ptr span{position:absolute;transform:translateX(-50%);font-size:10px;line-height:1;}
  #sl-root .bm-bar{display:flex;height:7px;border-radius:999px;overflow:hidden;} #sl-root .bm-bar span{flex:1;}
  #sl-root .bm-lab{font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:.07em;margin-top:6px;text-align:center;}
  #sl-root .bm.full .bm-bar{height:9px;} #sl-root .bm.full .bm-ptr span{font-size:11px;}
  #sl-root .bm-zones{display:flex;margin-top:7px;} #sl-root .bm-zones span{flex:1;font-family:var(--font-mono);font-size:8.5px;text-align:center;}
  #sl-root .bm.full .bm-lab{font-size:12px;margin-top:9px;}

  #sl-root .live{text-align:right;}
  #sl-root .live .px{font-family:var(--font-mono);font-size:18px;color:var(--parch);line-height:1;}
  #sl-root .live .cur{font-family:var(--font-mono);font-size:9.5px;color:var(--ash);margin-left:3px;}
  #sl-root .live .px.na{color:var(--steel);font-size:15px;}
  #sl-root .chg{display:inline-block;margin-top:7px;font-family:var(--font-mono);font-size:10.5px;font-weight:700;border-radius:999px;padding:3px 9px;}
  #sl-root .chg.up{color:var(--bull);background:rgba(111,207,154,.1);border:1px solid rgba(111,207,154,.3);}
  #sl-root .chg.dn{color:var(--ox-b);background:rgba(224,114,107,.1);border:1px solid rgba(224,114,107,.32);}
  #sl-root .chev{justify-self:end;color:var(--ash);font-size:12px;transition:transform .2s,color .2s;}
  #sl-root .card.open .chev{transform:rotate(180deg);color:var(--oracle-b);}

  #sl-root .det{border-top:1px solid var(--line);padding:24px;}
  #sl-root .secl{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--oracle);margin:0 0 12px;}
  #sl-root .kurs{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;}
  #sl-root .kurs .lab{font-family:var(--font-mono);font-size:13px;color:var(--mist);}
  #sl-root .kurs .v{font-family:var(--font-mono);font-size:18px;color:var(--parch);}
  #sl-root .kurs .v.up{color:var(--bull);} #sl-root .kurs .v.dn{color:var(--ox-b);}
  #sl-root .kurs .t{font-family:var(--font-mono);font-size:11px;color:var(--steel);}
  #sl-root .dist{display:flex;gap:28px;margin-top:9px;flex-wrap:wrap;}
  #sl-root .dist span{font-family:var(--font-mono);font-size:12px;}
  #sl-root .dist .s{color:var(--bull);} #sl-root .dist .x{color:var(--ox-b);} #sl-root .dist .f{color:var(--steel);}
  #sl-root .stbadge{font-family:var(--font-mono);font-size:8px;letter-spacing:.12em;text-transform:uppercase;border-radius:4px;padding:2px 7px;}
  #sl-root .stbadge.act{color:var(--bull);border:1px solid rgba(111,207,154,.4);}
  #sl-root .stbadge.pend{color:var(--ash);border:1px solid #2A2F39;}
  #sl-root .newshit{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#CF7A4E;border:1px solid rgba(207,122,78,.5);background:rgba(207,122,78,.12);border-radius:4px;padding:3px 8px;cursor:help;}
  #sl-root .newshit .nh-dot{width:5px;height:5px;border-radius:50%;background:#CF7A4E;}
  #sl-root .newshit.broken{color:#E0726B;border-color:rgba(224,114,107,.5);background:rgba(224,114,107,.12);}
  #sl-root .newshit.broken .nh-dot{background:#E0726B;}
  #sl-root .bestand{display:inline-flex;align-items:center;font-family:var(--font-mono);font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:var(--text-oracle);border:1px solid rgba(212,169,78,.5);background:rgba(212,169,78,.12);border-radius:4px;padding:3px 8px;cursor:help;}
  #sl-root .ltm{display:inline-flex;align-items:center;font-family:var(--font-mono);font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--steel);border:1px solid var(--line);border-radius:4px;padding:3px 7px;cursor:help;}
  #sl-root .archsec{margin-top:36px;border-top:1px solid var(--line);padding-top:20px;}
  #sl-root .archhead{display:flex;align-items:center;justify-content:space-between;gap:14px;cursor:pointer;font-family:var(--font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--steel);user-select:none;}
  #sl-root .archhead:hover{color:var(--parch);}
  #sl-root .archlist{margin-top:14px;display:flex;flex-direction:column;gap:8px;}
  #sl-root .archrow{display:flex;align-items:baseline;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid var(--line);border-radius:8px;padding:11px 15px;background:rgba(255,255,255,0.012);}
  #sl-root .archrow .an{font-family:var(--font-oracle);font-size:16px;color:var(--mist);}
  #sl-root .archrow .am{font-family:var(--font-mono);font-size:10px;color:var(--steel);letter-spacing:.04em;}
  #sl-root .cstat{display:flex;justify-content:center;}
  #sl-root .cpill{font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:999px;padding:6px 14px;white-space:nowrap;cursor:help;}
  #sl-root .cpill.st-red{color:#F0A39C;border:1px solid rgba(224,114,107,.55);background:rgba(224,114,107,.14);}
  #sl-root .cpill.st-orange{color:#E7A062;border:1px solid rgba(207,122,78,.55);background:rgba(207,122,78,.14);}
  #sl-root .cpill.st-yellow{color:#D8B85A;border:1px solid rgba(201,162,78,.55);background:rgba(201,162,78,.14);}
  #sl-root .cpill.st-green{color:#8FCBA0;border:1px solid rgba(111,176,122,.5);background:rgba(111,176,122,.12);}
  #sl-root .cpill.st-greenS{color:#6FCF9A;border:1px solid rgba(111,207,154,.6);background:rgba(111,207,154,.16);}
  #sl-root .tworow{font-family:var(--font-mono);font-size:10px;line-height:1.5;color:var(--steel);margin-top:10px;}
  #sl-root .chg.flat{color:var(--steel);background:rgba(124,132,146,.1);border:1px solid rgba(124,132,146,.3);}
  #sl-root .setup{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;}
  #sl-root .setup .lab{font-family:var(--font-mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--steel);}
  #sl-root .setup .v{font-family:var(--font-mono);font-size:18px;color:var(--parch);}
  #sl-root .setup .v.up{color:var(--bull);} #sl-root .setup .v.dn{color:var(--ox-b);}
  #sl-root .setup .ar{font-family:var(--font-mono);font-size:14px;color:var(--steel);}
  #sl-root .setupnote{font-family:var(--font-mono);font-size:11px;color:var(--steel);margin-top:8px;}
  #sl-root .detmain{margin-top:22px;padding-top:22px;border-top:1px solid var(--line);}
  #sl-root .actrow{display:flex;gap:12px;align-items:flex-start;margin-top:22px;padding-top:20px;border-top:1px solid var(--line);}
  #sl-root .actcol{flex:1.5;display:flex;flex-direction:column;min-width:0;}
  #sl-root .actrow .bchart{flex:1;align-self:flex-start;}
  #sl-root .chartwrap{margin-top:10px;border:1px solid var(--line);border-radius:10px;background:var(--input);overflow:hidden;}
  #sl-root .chartwrap img{display:block;width:100%;height:auto;}
  #sl-root .detbody{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:30px;align-items:start;margin-top:22px;padding-top:22px;border-top:1px solid var(--line);}
  #sl-root .recap{font-family:var(--font-oracle);font-style:italic;font-size:18px;line-height:1.5;color:#E4E1D7;margin:0 0 18px;}
  #sl-root .these{font-family:var(--font-ui);font-size:14.5px;line-height:1.62;color:var(--parch);margin:0;max-width:60ch;}
  #sl-root .killwrap{margin-top:18px;}
  #sl-root .chips{display:flex;flex-wrap:wrap;gap:7px;}
  #sl-root .chip{font-family:var(--font-mono);font-size:10px;color:#F0A39C;border:1px solid rgba(224,114,107,.4);background:rgba(224,114,107,.08);border-radius:999px;padding:3px 9px;}
  #sl-root .side{display:flex;flex-direction:column;gap:14px;}
  #sl-root .lvgrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
  #sl-root .lv{border:1px solid var(--line);border-radius:8px;background:var(--input);padding:8px 11px;}
  #sl-root .lv .k{font-family:var(--font-mono);font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--steel);}
  #sl-root .lv .v{font-family:var(--font-mono);font-size:14px;color:var(--parch);margin-top:3px;}
  #sl-root .lv.stop .v{color:var(--ox-b);} #sl-root .lv.skim .v{color:var(--oracle);} #sl-root .lv.tgt .v{color:var(--bull);}
  #sl-root .acts{display:flex;flex-direction:column;gap:9px;}
  #sl-root .badd{font-family:var(--font-ui);font-size:13.5px;font-weight:600;border:none;border-radius:9px;padding:12px 16px;cursor:pointer;background:var(--grad-gold);color:var(--text-on-gold);text-align:center;}
  #sl-root .badd:disabled{cursor:not-allowed;}
  #sl-root .badd.done{background:rgba(111,207,154,.12);color:var(--bull);border:1px solid rgba(111,207,154,.4);}
  #sl-root .badd.lock{background:transparent;color:var(--oracle-b);border:1px solid rgba(212,169,78,.45);}
  #sl-root .badd.open{display:block;text-decoration:none;background:rgba(212,169,78,.14);color:var(--oracle-b);border:1px solid rgba(212,169,78,.5);}
  #sl-root .badd.lock .lk{font-size:10px;vertical-align:1px;}
  #sl-root .bchart{font-family:var(--font-ui);font-size:13px;font-weight:600;border:1px solid rgba(212,169,78,.5);border-radius:9px;padding:11px 16px;cursor:pointer;background:rgba(212,169,78,.06);color:var(--oracle-b);text-align:center;}
  #sl-root .bchart:disabled{opacity:.7;cursor:wait;}
  #sl-root .baddhint{font-family:var(--font-mono);font-size:10px;line-height:1.5;color:var(--ash);margin-top:2px;text-align:center;}
  #sl-root .baddhint.watch{color:var(--ox-b);}
  #sl-root a.baddhint.up{display:block;color:var(--oracle-b);text-decoration:none;}
  #sl-root a.baddhint.up:hover{color:var(--oracle);}
  #sl-root a.openbook{display:block;margin-top:2px;font-family:var(--font-mono);font-size:11px;color:var(--oracle-b);text-decoration:none;text-align:center;}

  /* Kurs-Leiter (Fallback solange kein chart_img) */
  #sl-root .lad{position:relative;margin:6px 6px 12px;height:70px;}
  #sl-root .lad-live{position:absolute;top:2px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:1px;z-index:3;pointer-events:none;}
  #sl-root .lad-live .bub{font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--oracle-b);white-space:nowrap;}
  #sl-root .lad-live .car{color:var(--oracle-b);font-size:9px;line-height:1;}
  #sl-root .lad-live .ndl{width:1.5px;height:16px;background:var(--oracle-b);}
  #sl-root .lad-live .dot{width:9px;height:9px;border-radius:50%;background:var(--oracle-b);border:2px solid var(--card);margin-top:-1px;}
  #sl-root .lad-track{position:absolute;top:40px;left:0;right:0;height:8px;border-radius:999px;background:linear-gradient(90deg,rgba(196,82,76,.85) 0%,rgba(201,162,78,.5) 50%,rgba(111,207,154,.85) 100%);}
  #sl-root .lad-skim{position:absolute;top:37px;transform:translateX(-50%);width:2px;height:14px;background:var(--oracle);border-radius:2px;z-index:2;}
  #sl-root .lad-mk{position:absolute;top:52px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:2px;white-space:nowrap;}
  #sl-root .lad-mk .t{width:1px;height:7px;background:var(--steel);}
  #sl-root .lad-mk .k{font-family:var(--font-mono);font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--steel);}
  #sl-root .lad-mk .v{font-family:var(--font-mono);font-size:11px;color:var(--parch);}
  #sl-root .lad-mk.stop .v{color:var(--ox-b);} #sl-root .lad-mk.stop .t{background:var(--ox-b);}
  #sl-root .lad-mk.tgt .v{color:var(--bull);} #sl-root .lad-mk.tgt .t{background:var(--bull);}
  #sl-root .chartph{font-family:var(--font-mono);font-size:11px;color:var(--steel);text-align:center;padding:18px;}

  /* Locked / states */
  #sl-root .locked{position:relative;}
  #sl-root .ghosts{filter:blur(5px);opacity:.5;pointer-events:none;user-select:none;}
  #sl-root .gcard{border:1px solid var(--line);border-radius:14px;background:var(--card);height:112px;margin-bottom:13px;}
  #sl-root .lockpanel{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;}
  #sl-root .lockbox{max-width:460px;text-align:center;background:rgba(10,11,15,.72);backdrop-filter:blur(3px);border:1px solid var(--border-oracle);border-radius:16px;padding:34px 30px;box-shadow:0 24px 70px rgba(0,0,0,.55);}
  #sl-root .lockt{font-family:var(--font-oracle);font-weight:400;font-size:30px;color:var(--parch);margin:0;}
  #sl-root .locks{font-family:var(--font-ui);font-size:15px;line-height:1.6;color:var(--mist);margin:14px 0 24px;}
  #sl-root .state{min-height:46vh;display:flex;align-items:center;justify-content:center;font-family:var(--font-oracle);font-style:italic;font-size:22px;color:var(--text-oracle);}
  #sl-root .empty{border:1px solid var(--line);border-radius:14px;background:var(--card);padding:54px 30px;text-align:center;}
  #sl-root .empty-t{font-family:var(--font-oracle);font-size:26px;color:var(--parch);}
  #sl-root .empty-s{font-family:var(--font-ui);font-size:14.5px;line-height:1.6;color:var(--mist);margin:10px auto 0;max-width:52ch;}
  #sl-root .disc{margin:40px 0 0;border:1px solid var(--line);border-left:3px solid #8A6526;border-radius:8px;background:var(--card);padding:14px 18px;}
  #sl-root .disc p{font-family:var(--font-ui);font-size:12px;line-height:1.6;color:var(--mist);margin:0;}
  #sl-root .flash{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:300;max-width:90vw;background:var(--raised);border:1px solid var(--border-oracle);border-left:3px solid var(--oracle-b);border-radius:10px;padding:13px 18px;font-family:var(--font-ui);font-size:13.5px;color:var(--parch);box-shadow:0 14px 40px rgba(0,0,0,.5);}
  #sl-root .toolbar{display:flex;justify-content:flex-end;margin:4px 0 14px;}
  #sl-root .vtog{display:inline-flex;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
  #sl-root .vtog button{background:none;border:none;padding:7px 13px;font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ash);cursor:pointer;}
  #sl-root .vtog button.on{background:var(--oracle-b);color:#0B0D11;}
  #sl-root .simplelist{display:flex;flex-direction:column;border-top:1px solid var(--line);}
  #sl-root .srow{display:flex;align-items:center;justify-content:space-between;gap:14px;width:100%;padding:15px 4px;border-bottom:1px solid var(--line);cursor:pointer;}
  #sl-root .srow:hover{background:#13161C;}
  #sl-root .sleft{display:flex;align-items:center;gap:12px;min-width:0;}
  #sl-root .sdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
  #sl-root .sdot.o{background:var(--oracle);} #sl-root .sdot.s{background:#9F7BCB;}
  #sl-root .sname{min-width:0;}
  #sl-root .sname .nm{font-family:var(--font-oracle);font-size:18px;color:var(--parch);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:0;}
  #sl-root .sname .px{font-family:var(--font-mono);font-size:12px;color:var(--ash);margin-top:2px;}
  #sl-root .sright{display:flex;align-items:center;gap:10px;flex-shrink:0;}
  #sl-root .slbl{font-family:var(--font-mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);}
  #sl-root .spill{font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border:1px solid currentColor;border-radius:999px;padding:5px 12px;white-space:nowrap;}
  #sl-root .sbestand{font-family:var(--font-mono);font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--oracle-b);border:1px solid rgba(212,169,78,.4);border-radius:999px;padding:3px 8px;white-space:nowrap;}
  @media(max-width:560px){ #sl-root .slbl{display:none;} }

  @media(max-width:820px){
    #sl-root .head{grid-template-columns:minmax(0,1fr) auto;gap:14px 18px;grid-template-areas:"id live" "bm bm";}
    #sl-root .id{grid-area:id;} #sl-root .live{grid-area:live;} #sl-root .bm{grid-area:bm;} #sl-root .chev{display:none;}
    #sl-root .nm{font-size:21px;}
    #sl-root .actrow{flex-direction:column;}
  }`;

  function injectCSS() { if (document.getElementById("sl-css")) return; const s = document.createElement("style"); s.id = "sl-css"; s.textContent = CSS; document.head.appendChild(s); }

  function Barometer(t, full) {
    const p = bmPct(t);
    const lab = t.waage_label || "";
    const col = zoneColor(lab);
    return h("div", { className: "bm" + (full ? " full" : "") },
      h("div", { className: "bm-ptr" }, h("span", { style: { left: p + "%", color: col } }, "▼")),
      h("div", { className: "bm-bar" }, Z.map((c, i) => h("span", { key: i, style: { background: c } }))),
      full ? h("div", { className: "bm-zones" }, ZONE.map((z, i) => h("span", { key: i, style: { color: Z[i] } }, ZLAB[z]))) : null,
      h("div", { className: "bm-lab", style: { color: col } }, ZLAB[lab] || lab));
  }

  function Ladder(t) {
    const isShort = /short/i.test(t.art || "");
    const dir = isShort ? -1 : 1;
    const stop = num(t.stop), entry = num(t.entry), target = num(t.target), live = liveNum(t);
    const skims = parseSkims(t.skim_levels || t.skim);
    const pts = [stop, entry, target, live].concat(skims).filter((x) => x != null);
    if (pts.length < 2) return null;
    const proj = pts.map((v) => dir * v);
    const lo = Math.min.apply(null, proj), hi = Math.max.apply(null, proj);
    const span = (hi - lo) || 1;
    const pos = (v) => Math.max(0, Math.min(100, ((dir * v) - lo) / span * 100));
    const mk = (v, kls, key, label) => v == null ? null : h("div", { key: key, className: "lad-mk " + kls, style: { left: pos(v) + "%" } },
      h("div", { className: "t" }), h("div", { className: "k" }, label), h("div", { className: "v" }, deFmt(v)));
    return h("div", { className: "lad" },
      live != null ? h("div", { className: "lad-live", style: { left: pos(live) + "%" } }, h("div", { className: "bub" }, deFmt(live)), h("div", { className: "car" }, "▾"), h("div", { className: "ndl" }), h("div", { className: "dot" })) : null,
      h("div", { className: "lad-track" }),
      skims.map((s, i) => h("div", { key: "sk" + i, className: "lad-skim", style: { left: pos(s) + "%" } })),
      mk(stop, "stop", "st", T("Stop", "Stop")),
      mk(entry, "entry", "en", "Entry"),
      mk(target, "tgt", "tg", T("Ziel", "Target")));
  }

  function App() {
    const [me, setMe] = useState(null);
    const [gate, setGate] = useState("loading");
    const [denied, setDenied] = useState(false);
    const [trades, setTrades] = useState(null);
    const [meta, setMeta] = useState(null);
    const [open, setOpen] = useState(null);
    const [addingId, setAddingId] = useState(null);
    const [addedIds, setAddedIds] = useState([]);
    const [confirmAdd, setConfirmAdd] = useState(null);
    const [chartConfirm, setChartConfirm] = useState(null);
    const [showArchive, setShowArchive] = useState(false);
    const [showWatch, setShowWatch] = useState(false);
    const [simple, setSimple] = useState(true);
    const sfx = (n) => { if (typeof window.PYsfx === "function") window.PYsfx(n); };
    const [chartBusy, setChartBusy] = useState(null);
    const [flash, setFlash] = useState("");
    const showFlash = (m) => { setFlash(m); setTimeout(() => setFlash(""), 4500); };
    const canAdd = !!(me && PRIV.indexOf(me.tier) !== -1 && me.approval === "approved");

    useEffect(() => { injectCSS(); }, []);
    useEffect(() => {
      fetch(API + "/api/me", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        setMe(d && d.ok ? d : null);
        const ok = d && d.ok && VIEW.indexOf(d.tier) !== -1 && d.approval === "approved";
        setGate(ok ? "ok" : "locked");
      }).catch(() => setGate("locked"));
    }, []);
    useEffect(() => {
      if (gate !== "ok") return;
      fetch(API + "/api/mybook/hunter-shortlist?include_archived=1", { credentials: "include" }).then((r) => {
        if (r.status === 401) { if (window.PYsessionExpired) window.PYsessionExpired(); return null; }
        if (r.status === 403) { setDenied(true); return null; }
        return r.ok ? r.json() : null;
      }).then((d) => {
        setTrades(d && d.ok && Array.isArray(d.trades) ? d.trades : []);
        if (d && d.meta) setMeta(d.meta);
      }).catch(() => setTrades([]));
    }, [gate]);

    const addToBook = (t) => {
      if (addingId) return;
      setAddingId(t.id);
      const skims = parseSkims(t.skim_levels || t.skim);
      const kt = killList(t);
      const body = {
        name: t.asset, isin: t.isin || "", market: "", art: t.art, venue: "Tradegate", currency: "EUR",
        entry: num(t.entry), stop: num(t.stop), skim: skims.length ? skims[0] : null, target: num(t.target),
        these: t.thesis || t.these || "",
        anti_these: t.anti_these || (kt.length ? (T("Kippt bei: ", "Breaks on: ") + kt.join(" · ")) : ""),
        kill_triggers: kt,
        tracking_source: "oracle"
      };
      fetch(API + "/api/mybook", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then((r) => {
          if (r && r.status === 401) { if (window.PYsessionExpired) window.PYsessionExpired(); return null; }
          return r.json().then((j) => ({ status: r.status, ok: r.ok, j: j || {} })).catch(() => ({ status: r && r.status, ok: r && r.ok, j: {} }));
        })
        .then((res) => {
          setAddingId(null);
          if (!res) return;
          const j = res.j || {};
          if (res.ok && j.ok !== false) { setAddedIds((a) => a.concat(t.id)); showFlash(T("In My Book übernommen — als Orakel-Mirror. Du kannst es dort anpassen.", "Added to My Book — as oracle mirror. You can adjust it there.")); return; }
          const code = String(j.error || j.code || "").toLowerCase();
          if (code.indexOf("full") !== -1) { showFlash(T("Dein My Book ist voll (12/12). Erst Platz schaffen, dann übernehmen.", "Your My Book is full (12/12). Make room first, then add.")); return; }
          if (code.indexOf("exist") !== -1 || code.indexOf("dup") !== -1 || res.status === 409) { setAddedIds((a) => a.concat(t.id)); showFlash(T("Steht schon in deinem My Book.", "Already in your My Book.")); return; }
          if (code.indexOf("entry") !== -1) { showFlash(T("Dieses Setup hat noch kein Entry-Niveau — noch nicht übernehmbar.", "This setup has no entry level yet — not addable yet.")); return; }
          if (code.indexOf("these") !== -1 || code.indexOf("thesis") !== -1) { showFlash(T("These oder Anti-These fehlt/zu kurz — öffne es in My Book und ergänze es.", "Thesis or anti-thesis missing/too short — open it in My Book and complete it.")); return; }
          if (res.status === 403) { showFlash(T("Übernehmen ist Syndicate-only.", "Adding is Syndicate-only.")); return; }
          try { console.error("[mybook copy] failed", { status: res.status, body: j, sent: body }); } catch (e) { }
          showFlash((j.hint || j.message || j.error || T("Konnte nicht übernehmen", "Couldn't add")) + " (HTTP " + (res.status || "?") + ")");
        })
        .catch(() => { setAddingId(null); showFlash(T("Netzwerkfehler — versuch es erneut.", "Network error — try again.")); });
    };

    const chartMail = (t) => {
      if (chartBusy) return;
      setChartBusy(t.id);
      fetch(API + "/api/mybook/hunter-shortlist/" + t.id + "/chart", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deliver: "mail" }) })
        .then((r) => {
          if (r && (r.status === 401 || r.status === 403)) { if (window.PYsessionExpired) window.PYsessionExpired(); return null; }
          if (r && r.status === 429) return { cooldown: true };
          return r && r.ok ? (r.json().catch(() => ({ ok: true }))) : { err: true };
        })
        .then((res) => {
          setChartBusy(null);
          if (!res) return;
          if (res.cooldown) { showFlash(T("Chart-Analyse läuft schon — gleich kommt die Mail.", "Chart analysis already running — the mail is on its way.")); return; }
          if (res.err) { showFlash(T("Chart-Analyse konnte nicht ausgelöst werden — versuch es gleich nochmal.", "Couldn't trigger the chart analysis — try again shortly.")); return; }
          showFlash(T("Warren rendert deine Chart-Analyse — kommt in 1–2 Min per Mail.", "Warren is rendering your chart analysis — arrives by mail in 1–2 min."));
        })
        .catch(() => { setChartBusy(null); showFlash(T("Netzwerkfehler — versuch es gleich nochmal.", "Network error — try again shortly.")); });
    };

    const Card = (t) => {
      const isOpen = open === t.id;
      const isShort = /short/i.test(t.art || "");
      const entry = num(t.entry), live = liveNum(t);
      const isPending = t.state === "pending"; // Badge NUR aus state
      const hasSetup = entry != null;           // Add nur mit Setup-Niveau möglich (kein p&l!)
      // Tages-Trend (NICHT p&l vs Entry) — change_pct_today_fmt + trend_dir
      const todayFmt = t.change_pct_today_fmt || (t.change_pct_today != null ? pctStr(t.change_pct_today) : null);
      let dirN = null;
      if (t.trend_dir != null) { const s = String(t.trend_dir).toLowerCase(); dirN = (s.indexOf("up") !== -1 || s === "1" || s === "+") ? 1 : (s.indexOf("down") !== -1 || s === "-1" || s === "-") ? -1 : 0; }
      if (dirN == null && t.change_pct_today != null) { const n = Number(t.change_pct_today); dirN = n > 0 ? 1 : n < 0 ? -1 : 0; }
      if (dirN == null && todayFmt) dirN = isNeg(todayFmt) ? -1 : 1;
      const arrow = dirN > 0 ? "▲" : dirN < 0 ? "▼" : "—";
      const trendCls = dirN > 0 ? "up" : dirN < 0 ? "dn" : "flat";
      const added = addedIds.indexOf(t.id) !== -1;
      const kills = killList(t);
      const recap = t.einschaetzung || "";
      const thesis = t.thesis || t.these || "";
      const entryDisp = t.entry_de || (entry != null ? deFmt(entry) : null);
      const liveDisp = (typeof t.live === "string" && t.live) ? t.live : (live != null ? deFmt(live) : null);
      const dol = (t.days_on_list != null ? t.days_on_list : t.days_active);
      const overdue = dol != null && dol >= 7;
      const newsHit = !!t.recent_news_hit;
      const newsHitAt = t.news_hit_at_de || "";
      const cs = consolidatedStatus(t);
      // Setup->Kurs-Farbe: grün, wenn der Kurs in Thesen-Richtung über (Long) bzw. unter (Short) dem Setup liegt; sonst rot.
      const setupCls = (entry != null && live != null && live !== entry) ? ((isShort ? live < entry : live > entry) ? "up" : "dn") : "flat";

      return h("div", { key: t.id, id: "sl-" + t.id, className: "card" + (isOpen ? " open" : "") + (t.held_by_me ? " held" : "") },
        h("div", { className: "head", onClick: () => { sfx(isOpen ? "button-001-itemclose" : "button-002-itemopen"); setOpen(isOpen ? null : t.id); } },
          h("div", { className: "id" },
            h("div", { className: "cat " + (isShort ? "short" : "long") }, t.art || ""),
            h("div", { className: "nm" }, t.asset),
            h("div", { className: "sub" },
              h("span", { className: "isin" }, t.isin || ""),
              h("span", { className: "stbadge " + (isPending ? "pend" : "act") }, isPending ? T("Watchlist", "Watchlist") : T("Aktiv", "Active")),
              t.held_by_me ? h("span", { className: "bestand", title: T("Du hältst diese Position in deinem My Book.", "You hold this position in your My Book.") }, T("Bestand", "Held")) : null,
              t.lifetime_class ? h("span", { className: "ltm", title: ltMeta(t.lifetime_class).t }, ltMeta(t.lifetime_class).l) : null,
              newsHit ? h("span", { className: "newshit", title: T("Validierter Tag-Match auf einer aktuellen News. Schau hin — Einschätzung lesen.", "Validated tag match on a recent news item. Look — read the assessment.") }, h("span", { className: "nh-dot" }), T("News-Alert", "News alert") + (newsHitAt ? " " + newsHitAt : "")) : null),
            (dol != null || t.last_checked_at_de) ? h("div", { className: "listmeta" + (overdue ? " over" : "") },
              (dol != null ? (T("Auf der Liste seit ", "On the list for ") + dol + (dol === 1 ? T(" Tag", "d") : T(" Tagen", "d"))) : "") +
              (t.last_checked_at_de ? (" · " + T("zuletzt gepflegt ", "last updated ") + t.last_checked_at_de) : "") +
              (overdue ? T(" · überfällig?", " · overdue?") : "")) : null),
          h("div", { className: "cstat" }, h("span", { className: "cpill " + cs.cls, title: cs.tip }, cs.label)),
          h("div", { className: "live" },
            liveDisp ? h("div", null, h("span", { className: "px" }, liveDisp), h("span", { className: "cur" }, "EUR")) : h("div", null, h("span", { className: "px na" }, "—")),
            todayFmt ? h("span", { className: "chg " + trendCls }, arrow + " " + todayFmt + " " + T("heute", "today")) : null),
          h("div", { className: "chev" }, "▼")),

        isOpen ? h("div", { className: "det" },
          h("div", { className: "setup" },
            h("span", { className: "lab" }, T("Setup", "Setup")),
            h("span", { className: "v" }, entryDisp ? entryDisp + " EUR" : "—"),
            h("span", { className: "ar" }, "→"),
            h("span", { className: "lab" }, T("Kurs", "Last")),
            h("span", { className: "v " + setupCls }, liveDisp ? liveDisp + " EUR" : "—")),
          h("div", { className: "dist" },
            todayFmt ? h("span", { className: trendCls === "dn" ? "x" : (trendCls === "up" ? "s" : "f") }, arrow + " " + todayFmt + " " + T("heute", "today")) : null,
            dol != null ? h("span", { className: "f" }, dol + (dol === 1 ? T(" Tag auf der Liste", "d on the list") : T(" Tage auf der Liste", "d on the list"))) : (t.origin ? h("span", { className: "f" }, T("seit ", "since ") + t.origin) : null)),
          !hasSetup ? h("div", { className: "setupnote" }, T("Setup-Niveau folgt — sobald das Orakel die Idee scharf stellt.", "Setup level follows once the oracle arms the idea.")) : null,

          h("div", { className: "secl", style: { marginTop: 22 } }, T("Thesen-Stärke", "Thesis health")),
          Barometer(t, true),
          (t.position_risk_label || t.position_risk_pct != null) ? h("div", { className: "secl", style: { marginTop: 20 } }, T("Positions-Risiko", "Position risk")) : null,
          (t.position_risk_label || t.position_risk_pct != null) ? PosBar(t) : null,
          h("div", { className: "tworow" }, T("Positions-Risiko: misst, wie weit der Kurs vom Entry weg ist und wie nah am Stop. Thesen-Stärke: misst die Story — halten die Annahmen vom Setup? News, Sektor, Catalyst-Status. Beide sind getrennt, denn der Markt kann gegen dich laufen, ohne dass die Story bricht; und die Story kann brechen, bevor der Kurs es zeigt.", "Position risk: measures how far price is from entry and how close to the stop. Thesis health: measures the story — do the assumptions from the setup still hold? News, sector, catalyst status. They are separate, because the market can move against you without the story breaking; and the story can break before price shows it.")),

          t.chart_img ? h("div", { className: "secl", style: { marginTop: 24 } }, T("Kursverlauf · letzter Trading-Day", "Price action · last trading day")) : null,
          t.chart_img ? h("div", { className: "chartwrap" }, h("img", { src: t.chart_img, alt: T("Kursverlauf", "Price action"), loading: "lazy" })) : null,

          h("div", { className: "detmain" },
            recap ? h("p", { className: "recap" }, recap) : null,
            h("div", { className: "secl" }, T("Die These", "The thesis")),
            h("p", { className: "these" }, thesis || T("— keine These hinterlegt.", "— no thesis on file.")),
            kills.length ? h("div", { className: "killwrap" },
              h("div", { className: "secl" }, T("Kippt bei", "Breaks on")),
              h("div", { className: "chips" }, kills.map((k, i) => h("span", { key: i, className: "chip" }, k)))) : null),

          h("div", { className: "actrow" },
            !hasSetup
              ? h("div", { className: "actcol" },
                  h("button", { className: "badd", disabled: true }, T("In My Book", "Add to My Book")),
                  h("div", { className: "baddhint watch" }, T("Setup-Niveau folgt — dann übernehmbar.", "Setup level follows — then you can add it.")))
              : !canAdd
                ? h("div", { className: "actcol" },
                    h("button", { className: "badd lock", disabled: true }, h("span", { className: "lk" }, "▲"), " ", T("In My Book — Syndicate", "In My Book — Syndicate")),
                    h("a", { className: "baddhint up", href: "inner-circle.html" }, T("Im Syndicate übernimmst du Orakel-Ideen mit einem Klick. → Syndicate", "In the Syndicate you copy oracle ideas with one click. → Syndicate")))
                : (added || t.held_by_me)
                  ? h("div", { className: "actcol" },
                      h("a", { className: "badd open", href: "mybook.html?isin=" + encodeURIComponent(t.isin || ""), "data-sfx": "menue" }, T("In My Book öffnen", "Open in My Book")),
                      h("div", { className: "baddhint" }, t.held_by_me ? T("Du hältst diese Position — verwalte sie in deinem My Book.", "You hold this position — manage it in your My Book.") : T("Liegt in deinem My Book.", "It's in your My Book.")))
                  : h("div", { className: "actcol" },
                      h("button", { className: "badd", disabled: addingId === t.id, onClick: () => setConfirmAdd(t) }, addingId === t.id ? T("übernehme…", "adding…") : T("In My Book übernehmen", "Add to My Book")),
                      h("div", { className: "baddhint" }, T("Übernimmt These & Setup als eigenes Topic — mit eigenen Marken & Alerts.", "Copies thesis & setup as your own topic — with your own levels & alerts."))),
            h("button", { className: "bchart", disabled: chartBusy === t.id, onClick: () => setChartConfirm(t) }, chartBusy === t.id ? T("sende…", "sending…") : T("Chart-Analyse per Mail", "Chart analysis by mail")))) : null);
    };

    const Hero = (sub) => h("div", { className: "hero" },
      h(PyEyebrow, null, T("Orakel · Aktive Shortlist", "Oracle · Active Shortlist")),
      h("h1", { className: "htitle" }, T("Die Shortlist.", "The Shortlist.")),
      h("p", { className: "hlead" }, T("Die Ideen, die das Orakel gerade verfolgt — offengelegt. Jede Position führt mit ihrer These, der Kurs ist nur der Beleg.", "The ideas the oracle is tracking right now — in the open. Every position leads with its thesis; the price is just the evidence.")),
      sub);

    const page = (inner) => h("div", { id: "sl-root" }, h(SiteNav, { active: "shortlist.html" }), h("div", { className: "wrap" }, inner,
      h("div", { className: "disc" }, h("p", null, T("Die Shortlist ist Markt-Beobachtung, keine Anlageberatung. These, Marken und Status können sich jederzeit ändern. Du handelst eigenverantwortlich.", "The shortlist is market observation, not investment advice. Thesis, levels and status can change at any time. You trade on your own responsibility.")))),
      flash ? h("div", { className: "flash" }, flash) : null,
      confirmAdd ? h("div", { onClick: () => setConfirmAdd(null), style: { position: "fixed", inset: 0, zIndex: 300, background: "rgba(4,5,8,0.82)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 } },
        h("div", { onClick: (e) => e.stopPropagation(), style: { maxWidth: 440, width: "100%", boxSizing: "border-box", background: "var(--bg-raised)", border: "1px solid var(--border-oracle)", borderRadius: 14, padding: 28 } },
          h("h3", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 25, margin: "0 0 10px", color: "var(--oracle-bright)" } }, T("In My Book übernehmen?", "Add to My Book?")),
          h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 8px" } }, h("strong", { style: { color: "var(--text-primary)" } }, confirmAdd.asset)),
          h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 22px" } }, T("These & Setup werden als dein eigenes Topic kopiert — mit eigenen Marken & Alerts. Du kannst es danach in My Book anpassen.", "Thesis & setup are copied as your own topic — with your own levels & alerts. You can adjust it afterwards in My Book.")),
          h("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
            h(Button, { variant: "ghost", size: "sm", onClick: () => setConfirmAdd(null) }, T("Abbrechen", "Cancel")),
            h(Button, { variant: "oracle", size: "sm", "data-sfx": "", onClick: () => { var t = confirmAdd; setConfirmAdd(null); sfx("menue-in-mybook"); addToBook(t); } }, T("Ja, übernehmen", "Yes, add")))))
        : null,
      chartConfirm ? h("div", { onClick: () => setChartConfirm(null), style: { position: "fixed", inset: 0, zIndex: 300, background: "rgba(4,5,8,0.82)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 } },
        h("div", { onClick: (e) => e.stopPropagation(), style: { maxWidth: 440, width: "100%", boxSizing: "border-box", background: "var(--bg-raised)", border: "1px solid var(--border-oracle)", borderRadius: 14, padding: 28 } },
          h("h3", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 25, margin: "0 0 10px", color: "var(--oracle-bright)" } }, T("Chart-Analyse per Mail?", "Chart analysis by mail?")),
          h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 22px" } }, T("Du möchtest eine Chart-Analyse zu ", "You'd like a chart analysis for "), h("strong", { style: { color: "var(--text-primary)" } }, chartConfirm.asset), T(" per Mail bekommen? Warren rendert sie und schickt sie dir in 1–2 Minuten.", " by mail? Warren renders it and sends it to you in 1–2 minutes.")),
          h("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
            h(Button, { variant: "ghost", size: "sm", onClick: () => setChartConfirm(null) }, T("Abbruch", "Cancel")),
            h(Button, { variant: "oracle", size: "sm", "data-sfx": "", onClick: () => { var t = chartConfirm; setChartConfirm(null); sfx("menue-in-mybook"); chartMail(t); } }, T("Bestätigen", "Confirm")))))
        : null,
      h(SiteFooter, null));

    if (gate === "loading") return page(h("div", { className: "state" }, T("Das Orakel öffnet die Liste…", "The oracle opens the list…")));

    if (gate === "locked" || denied) {
      const loggedIn = !!me;
      return page(h("div", null,
        Hero(null),
        h("div", { className: "locked" },
          h("div", { className: "ghosts" }, [0, 1, 2, 3].map((i) => h("div", { key: i, className: "gcard" }))),
          h("div", { className: "lockpanel" }, h("div", { className: "lockbox" },
            h(PyEyebrow, null, "Syndicate"),
            h("h2", { className: "lockt" }, T("Die volle Shortlist — im Syndicate.", "The full shortlist — in the Syndicate.")),
            h("p", { className: "locks" }, T("Die aktive Shortlist mit Thesen, Marken, live-Score und „In My Book“ ist dem Syndicate vorbehalten.", "The active shortlist with theses, levels, live score and “add to My Book” is reserved for the Syndicate.")),
            h(Button, { variant: "oracle", onClick: () => { window.location.href = loggedIn ? "inner-circle.html" : "register.html"; } }, loggedIn ? T("Syndicate freischalten", "Unlock Syndicate") : T("Enter the Sanctum", "Enter the Sanctum")))))));
    }

    if (trades === null) return page(h("div", null, Hero(null), h("div", { className: "state" }, T("Lade die Shortlist…", "Loading the shortlist…"))));

    // Aktive Shortlist: alles außer watchlist/pending(legacy)/closed/broken/archived/deleted
    const visible = trades.filter((t) => { const s = String(t.state || "").toLowerCase(); return s !== "watchlist" && s !== "pending" && s.indexOf("closed") === -1 && s !== "broken" && s !== "archived" && s !== "deleted"; });
    const watch = trades.filter((t) => { const s = String(t.state || "").toLowerCase(); return s === "watchlist" || s === "pending"; });
    const archived = trades.filter((t) => String(t.state || "").toLowerCase() === "archived");
    const watchEl = watch.length ? h("div", { className: "archsec" },
      h("div", { className: "archhead", onClick: () => setShowWatch(!showWatch) },
        h("span", null, (showWatch ? "▾ " : "▸ ") + T("Beobachtung", "Watchlist") + " (" + watch.length + " " + T(watch.length === 1 ? "Eintrag" : "Einträge", watch.length === 1 ? "item" : "items") + ")"),
        h("span", null, showWatch ? T("Ausblenden", "Hide") : T("Anzeigen", "Show"))),
      showWatch ? h("div", { className: "list", style: { marginTop: 14 } }, watch.map(Card)) : null) : null;
    const archiveEl = archived.length ? h("div", { className: "archsec" },
      h("div", { className: "archhead", onClick: () => setShowArchive(!showArchive) },
        h("span", null, (showArchive ? "▾ " : "▸ ") + T("Archiv", "Archive") + " (" + archived.length + " " + T(archived.length === 1 ? "Eintrag" : "Einträge", archived.length === 1 ? "item" : "items") + T(", letzte 30 Tage)", ", last 30 days)")),
        h("span", null, showArchive ? T("Ausblenden", "Hide") : T("Anzeigen", "Show"))),
      showArchive ? h("div", { className: "archlist" }, archived.map((t) => h("div", { key: (t.id || t.isin || t.asset), className: "archrow" },
        h("span", { className: "an" }, t.asset),
        h("span", { className: "am" }, (t.archived_at ? deShort(t.archived_at) : "") + (t.archive_reason ? " · " + archReason(t.archive_reason) : ""))))) : null) : null;

    if (!visible.length) return page(h("div", null,
      Hero(null),
      h("div", { className: "empty" },
        h("div", { className: "empty-t" }, T("Gerade ist es still.", "All quiet right now.")),
        h("div", { className: "empty-s" }, T("Aktuell steht keine Idee auf der Shortlist. Das Orakel meldet sich, sobald sich eine qualifiziert.", "No idea is on the shortlist right now. The oracle will surface one as soon as it qualifies."))),
      watchEl,
      archiveEl));

    const cad = meta && meta.check_cadence;
    const cadText = cad
      ? (T("PYTHAI prüft die Thesen permanent:", "PYTHAI checks the theses continuously:") + "\n· Sharpener: " + (cad.sharpener_push || "") + "\n· Score-Sync: " + (cad.score_sync || "") + "\n· News-Scan: " + (cad.news_kill_match || ""))
      : T("Thesen werden laufend geprüft.", "Theses are checked continuously.");
    const lastChk = meta && (meta.last_thesis_check_de || meta.last_news_check_de);
    const nextChk = meta && (meta.next_news_check_de || meta.next_thesis_refresh_de);
    const SimpleRow = (t) => {
      const lab = String(t.waage_label || "").toUpperCase();
      const tp = { l: ZLAB[lab] || lab || "—", c: zoneColor(lab) };
      const liveDisp = (typeof t.live === "string" && t.live) ? t.live : (liveNum(t) != null ? deFmt(liveNum(t)) : null);
      return h("div", { key: t.id, className: "srow", role: "button", tabIndex: 0, onClick: () => { sfx("button-002-itemopen"); setSimple(false); setOpen(t.id); setTimeout(() => { const el = document.getElementById("sl-" + t.id); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 250); } },
        h("div", { className: "sleft" },
          h("span", { className: "sdot o" }),
          h("div", { className: "sname" },
            h("div", { className: "nm" }, t.asset),
            liveDisp ? h("div", { className: "px" }, liveDisp + " EUR") : null)),
        h("span", { className: "sright" },
          t.held_by_me ? h("span", { className: "sbestand", title: T("Du hältst diese Position in deinem My Book.", "You hold this position in your My Book.") }, T("Bestand", "Held")) : null,
          h("span", { className: "slbl" }, T("These", "Thesis")),
          h("span", { className: "spill", style: { color: tp.c, borderColor: tp.c } }, tp.l)));
    };
    return page(h("div", null,
      Hero(h("div", { className: "hmeta" },
        h("span", { className: "pulse" }),
        h("span", null, h("span", { className: "cnt" }, visible.length), " ", T(visible.length === 1 ? "aktive Position" : "aktive Positionen", visible.length === 1 ? "active position" : "active positions")),
        lastChk ? h("span", { className: "chkmeta", title: cadText }, "· " + T("zuletzt geprüft ", "last checked ") + lastChk + (nextChk ? (T(" · nächste ", " · next ") + nextChk) : "")) : null)),
      h("div", { className: "toolbar" },
        h("div", { className: "vtog" },
          h("button", { className: simple ? "on" : "", "data-sfx": "", onClick: () => { sfx("button-004-toggle"); setSimple(true); } }, T("Einfach", "Simple")),
          h("button", { className: !simple ? "on" : "", "data-sfx": "", onClick: () => { sfx("button-004-toggle"); setSimple(false); } }, T("Detail", "Detail")))),
      simple ? h("div", { className: "simplelist" }, visible.map(SimpleRow)) : h("div", { className: "list" }, visible.map(Card)),
      watchEl,
      archiveEl));
  }

  const root = document.getElementById("root");
  if (root) ReactDOM.createRoot(root).render(h(App));
})();
