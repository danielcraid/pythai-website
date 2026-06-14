(() => {
  const { Button } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PySection, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const API = "https://api.pythai.ch";
  const { useState, useEffect, useRef } = React;
  const h = React.createElement;
  const PRIV = ["syndicate", "admin"];
  const MAX = 12;
  const Z = ["#C4524C", "#CF7A4E", "#C9A24E", "#6FB07A", "#6FCF9A"];
  const ZONE = ["GEBROCHEN", "WACKELT", "NEUTRAL", "INTAKT", "STARK"];
  const wpct = (s) => Math.max(3, Math.min(97, Math.round((s + 1) / 2 * 100)));
  // deutsche Zahl-Strings ("1.218,80") → Number fürs Backend; leer → null
  const deNum = (s) => { if (s == null || String(s).trim() === "") return null; const n = parseFloat(String(s).replace(/\s/g, "").replace(/\./g, "").replace(",", ".")); return isNaN(n) ? null : n; };
  const statusText = (p) => ZONE[p.zone - 1] + " " + (p.score >= 0 ? "+" : "−") + Math.abs(p.score).toFixed(1);

  // Mock-Daten (bis VPS die My-Book-DB liefert)
  const SEED = [
    { id: "rhm", name: "Rheinmetall AG", idx: "EURO STOXX 50", isin: "DE0007030009", art: "Aktie · Long", live: "1.218,80",
      entry: "1.197", stop: "1.150", skim: "1.260", target: "1.320", score: 0.6, zone: 4,
      these: "Defense-Decade — Iran-Eskalation + EU-Aufrüstung stützen den Sektor strukturell. Aufstockung bestätigt.",
      kill: "Iran-Ceasefire · EU-Budget-Cut · Sektor-Drift", monitored: true, channel: "SMS + Mail" },
    { id: "brent", name: "Brent Crude Oil ETC", idx: "Rohstoff · Energie", isin: "JE00B78CGV99", art: "ETC · Long", live: "71,40",
      entry: "72,25", stop: "71,00", skim: "76,00", target: "78,00", score: -0.3, zone: 2,
      these: "Iran-Risk-Premium hält das Öl — aber der Markt zweifelt, der Stop rückt näher.",
      kill: "Waffenruhe · Hormus-Resumed", monitored: false, channel: null },
    { id: "nvda", name: "NVIDIA Corp", idx: "NASDAQ 100", isin: "US67066G1040", art: "Aktie · Long", live: "199,98",
      entry: "195,00", stop: "184,50", skim: "210,00", target: "220,00", score: 0.7, zone: 5,
      these: "AI-Capex-Zyklus ungebrochen, Hyperscaler-Guidance stark. Bewertung ambitioniert, Momentum stützt.",
      kill: "Capex-Cut-Guidance · Export-Ban-News", monitored: false, channel: null }
  ];

  const CSS = `
  #mb-root{ --void:var(--bg-base); --raised:var(--bg-raised); --card:var(--bg-surface); --line:var(--border-subtle); --parch:var(--parchment); --mist:var(--text-secondary); --ash:var(--text-muted); --oracle-b:var(--oracle-bright); --ox-b:#E0726B; --bull:var(--bull-bright); --input:var(--bg-input);
    --z1:#C4524C; --z2:#CF7A4E; --z3:#C9A24E; --z4:#6FB07A; --z5:#6FCF9A; }
  #mb-root .toolbar{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;}
  #mb-root .rep{display:flex;align-items:center;gap:10px;font-family:var(--font-ui);font-size:14px;color:var(--mist);cursor:pointer;}
  #mb-root h2.mb{font-family:var(--font-oracle);font-weight:400;font-size:30px;margin:6px 0 18px;color:var(--parch);}
  #mb-root .sw{width:46px;min-width:46px;max-width:46px;height:26px;box-sizing:border-box;display:inline-block;border-radius:999px;position:relative;flex:0 0 auto;cursor:pointer;padding:0;box-shadow:inset 0 1px 2px rgba(0,0,0,.4);}
  #mb-root .sw.on{background:rgba(212,169,78,.18);border:1px solid var(--oracle);box-shadow:0 0 14px -5px rgba(212,169,78,.7),inset 0 1px 2px rgba(0,0,0,.4);}
  #mb-root .sw.off{background:var(--input);border:1px solid var(--steel);}
  #mb-root .knob{width:18px;height:18px;border-radius:50%;position:absolute;top:3px;} #mb-root .sw.on .knob{left:25px;background:var(--oracle-b);} #mb-root .sw.off .knob{left:3px;background:var(--steel);}
  #mb-root .list{--cols:64px minmax(0,1fr) 196px 330px 220px;--cgap:20px;}
  #mb-root .hdr{display:grid;grid-template-columns:var(--cols);gap:var(--cgap);align-items:end;padding:0 10px 12px 0;border-bottom:1px solid var(--line);}
  #mb-root .hdr .hc{font-family:var(--font-mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--ash);white-space:nowrap;overflow:hidden;}
  #mb-root .topic{border-bottom:1px solid var(--line);}
  #mb-root .orow{display:grid;grid-template-columns:var(--cols);gap:var(--cgap);align-items:center;padding:16px 10px 16px 0;cursor:pointer;}
  #mb-root .orow:hover,#mb-root .topic.open>.orow{background:#13161C;}
  #mb-root .c-mon{display:flex;align-items:center;gap:10px;justify-self:start;}
  #mb-root .c-topic{min-width:0;}
  #mb-root .c-act{justify-self:end;display:flex;flex-direction:column;align-items:flex-end;gap:9px;}
  #mb-root .mon-lbl{display:none;font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);}
  #mb-root .nm{font-family:var(--font-oracle);font-size:22px;line-height:1.08;color:var(--parch);}
  #mb-root .t-meta{display:flex;align-items:center;gap:8px;margin-top:5px;flex-wrap:wrap;}
  #mb-root .isin{font-family:var(--font-mono);font-size:10.5px;color:var(--ash);letter-spacing:.04em;}
  #mb-root .badge{font-family:var(--font-mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--mist);border:1px solid #2A2F39;border-radius:5px;padding:5px 9px;white-space:nowrap;}
  #mb-root .badge.long{color:var(--bull);border-color:rgba(111,207,154,.35);}
  #mb-root .badge.idx{border-radius:999px;font-size:8.5px;color:#7FB0E8;border-color:rgba(127,176,232,.45);background:rgba(127,176,232,.1);padding:4px 9px;}
  #mb-root .badge.src-oracle{border-radius:999px;font-size:8.5px;color:var(--oracle-b);border-color:rgba(212,169,78,.5);background:rgba(212,169,78,.1);padding:4px 9px;}
  #mb-root .badge.src-self{border-radius:999px;font-size:8.5px;color:#B58CE0;border-color:rgba(181,140,224,.5);background:rgba(181,140,224,.1);padding:4px 9px;}
  #mb-root .ar-pill{font-family:var(--font-mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;color:#F0A39C;border:1px solid rgba(224,114,107,.6);background:rgba(224,114,107,.14);border-radius:999px;padding:4px 9px;}
  #mb-root .ar-banner{border:1px solid rgba(224,114,107,.45);border-left:3px solid var(--ox-b);background:rgba(224,114,107,.07);border-radius:10px;padding:16px 18px;margin-bottom:22px;}
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
  #mb-root .mini{width:100%;max-width:188px;} #mb-root .mini .mk-row{position:relative;height:11px;} #mb-root .mini .arrow{position:absolute;transform:translateX(-50%);font-size:10px;color:var(--oracle-b);line-height:1;}
  #mb-root .mini .bar{display:flex;height:7px;border-radius:999px;overflow:hidden;} #mb-root .mini .bar span{flex:1;}
  #mb-root .mini .lab{font-family:var(--font-mono);font-size:11px;font-weight:700;margin-top:6px;}
  #mb-root .dwrap{padding:6px 0 28px;}
  #mb-root .mirror-row{display:flex;align-items:center;gap:12px;padding:11px 14px;border:1px solid var(--line);border-radius:10px;background:var(--card);margin-bottom:20px;}
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
  #mb-root .disc{border:1px solid var(--line);border-left:3px solid #8A6526;border-radius:8px;background:var(--card);padding:14px 16px;margin-top:28px;}
  #mb-root .disc .tlbl{margin:0 0 5px;} #mb-root .disc p{font-family:var(--font-ui);font-size:12px;line-height:1.6;color:var(--mist);margin:0;max-width:none;}
  #mb-root .ov2{position:fixed;inset:0;background:rgba(4,5,8,.8);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px;z-index:260;}
  #mb-root .modal{max-width:440px;width:100%;background:var(--raised);border:1px solid var(--border-oracle);border-radius:12px;padding:26px;}
  #mb-root .flash{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:300;max-width:90vw;background:var(--raised);border:1px solid rgba(224,114,107,.6);border-left:3px solid var(--ox-b);border-radius:10px;padding:13px 18px;font-family:var(--font-ui);font-size:13.5px;color:var(--parch);box-shadow:0 14px 40px rgba(0,0,0,.5);}
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
    #mb-root .c-mon{grid-column:1 / -1;grid-row:2;}
    #mb-root .mon-lbl{display:inline;}
    #mb-root .c-stat{grid-column:1 / -1;grid-row:3;}
    #mb-root .c-trig{grid-column:1;grid-row:4;}
    #mb-root .bedit{grid-column:2;grid-row:4;justify-self:end;align-self:center;}
    #mb-root .mini{max-width:none;}
    #mb-root .dgrid{display:flex;flex-direction:column;gap:22px;}
    #mb-root .dcol-these,#mb-root .dcol-act{grid-column:auto;width:100%;}
    #mb-root .dcol-these{order:0;} #mb-root .dcol-act{order:1;}
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
    const BLANK = { name: "", isin: "", issuer: "", idx: "", art: "Aktie · Long", venue: "Tradegate", currency: "EUR", entry: "", stop: "", skim: "", target: "", these: "", anti_these: "", kill_triggers: [] };
    const KILL_SUGGEST = ["iran_ceasefire", "hormus_resumed", "recession_eu", "capex_cut", "fed_hawkish_shock", "usd_crash", "china_export_ban", "earnings_miss", "esma_ban", "oil_supply_shock"];
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
    const [tagInput, setTagInput] = useState("");
    const [flash, setFlash] = useState("");
    const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(""), 4500); };

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
        }
        setLoaded(true);
      }).catch(() => setLoaded(true));
    }, [gate]);

    if (gate === "loading") return h("div", null, h(SiteNav, { active: "" }), h("div", { style: { minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 22, color: "var(--text-oracle)" } }, T("Das Orakel prüft deinen Zugang…", "The oracle checks your access…")), h(SiteFooter, null));
    if (gate === "locked") return h("div", null, h(SiteNav, { active: "" }), h("section", { style: { minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" } }, h("div", { style: { maxWidth: 480 } }, h(PyEyebrow, null, "Syndicate"), h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 44, margin: "8px 0 0", color: "var(--text-primary)" } }, T("My Book lebt im Syndicate.", "My Book lives in the Syndicate.")), h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", margin: "16px 0 28px" } }, T("Dein persönliches Thesen-Buch — Trades tracken, These beobachten, Alerts setzen — ist dem Syndicate vorbehalten.", "Your personal thesis book — track trades, watch the thesis, set alerts — is reserved for the Syndicate.")), h(Button, { variant: "oracle", onClick: () => { window.location.href = "account.html"; } }, T("Zum Account", "Go to account")))), h(SiteFooter, null));

    const api = (path, body, method) => fetch(API + path, { method: method || "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined }).then((r) => { if (r && (r.status === 401 || r.status === 403) && window.PYsessionExpired) window.PYsessionExpired(); return r; }).catch(() => { });
    const patch = (id, body) => api("/api/mybook/" + id, body, "PATCH");
    const reload = () => fetch(API + "/api/mybook", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => { if (d && d.ok && Array.isArray(d.topics)) setRows(d.topics); }).catch(() => { });
    const setMon = (id, on, channel) => { setRows((rs) => rs.map((r) => r.id === id ? Object.assign({}, r, { monitored: on, channel: on ? (channel === "both" ? "SMS + Mail" : channel === "sms" ? "SMS" : "Mail") : null }) : r)); api("/api/mybook/" + id + "/monitor", { on: on, channel: channel || "mail" }); };
    const toggleMon = (p) => { if (p.monitored) setMon(p.id, false); else { setMonCh("mail"); setMonModal(p.id); } };
    const confirmMon = () => { setMon(monModal, true, monCh); setMonModal(null); };
    const openEdit = (p) => { setEditingId(p.id); setTagInput(""); setAddF({ name: p.name || "", isin: p.isin || "", issuer: p.issuer || "", idx: p.idx || "", art: p.art || "Aktie · Long", venue: p.venue || "Tradegate", currency: p.currency || "EUR", entry: p.entry || "", stop: p.stop || "", skim: p.skim || "", target: p.target || "", these: p.these || "", anti_these: p.anti_these || "", kill_triggers: killTagsOf(p) }); };
    const checkedTime = (iso) => { try { return new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
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
          if (res.ok) setRows((rs) => rs.map((r) => r.id === p.id ? Object.assign({}, r, { score: res.score, zone: res.zone, waage_pct: (typeof res.score === "number" ? wpct(res.score) : r.waage_pct), einschaetzung: res.einschaetzung, last_checked_at: res.last_checked_at }) : r));
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
          if (res.cooldown) { showFlash(T("Chart-Analyse läuft gerade schon — gleich kommt die Mail.", "Chart analysis already running — the mail is on its way.")); return; }
          if (res.err) { showFlash(T("Chart-Analyse konnte nicht ausgelöst werden — versuch es gleich nochmal.", "Couldn't trigger the chart analysis — try again shortly.")); return; }
          showFlash(T("Warren schickt dir die Chart-Analyse per Mail.", "Warren is sending the chart analysis by mail."));
        })
        .catch(() => { setChartBusy(null); showFlash(T("Netzwerkfehler — versuch es gleich nochmal.", "Network error — try again shortly.")); });
    };
    const setSource = (id, src) => {
      setRows((rs) => rs.map((r) => r.id === id ? Object.assign({}, r, { tracking_source: src }) : r));
      patch(id, { tracking_source: src });
      setTimeout(() => checkThesis({ id: id }), 250); // Score sofort auf neue Source aktualisieren
    };
    const toggleMirror = (p) => { if (p.tracking_source !== "member_only") setMirrorModal(p.id); else setSource(p.id, "oracle"); };
    const confirmMirrorOff = () => { if (mirrorModal) setSource(mirrorModal, "member_only"); setMirrorModal(null); };
    const doDelete = () => { api("/api/mybook/" + delId, null, "DELETE"); setRows((rs) => rs.filter((r) => r.id !== delId)); setDelId(null); };
    // Action-Required-Buttons (Soll-Mapping → PATCH; VC bestätigt Feld-Namen)
    const doAction = (p, act) => {
      if (act === "edit") { openEdit(p); return; }
      if (act === "ask_warren") { if (typeof window.PYchatOpen === "function") window.PYchatOpen("Zu meinem Topic „" + p.name + "“: " + (p.action_reason || "Was meinst du?")); return; }
      if (act === "close") { api("/api/mybook/" + p.id, { state: "closed" }, "PATCH"); setRows((rs) => rs.filter((r) => r.id !== p.id)); return; }
      if (act === "member_only") { patch(p.id, { tracking_source: "member_only", action_required: false }); setRows((rs) => rs.map((r) => r.id === p.id ? Object.assign({}, r, { tracking_source: "member_only", action_required: false }) : r)); return; }
      // keep
      patch(p.id, { action_required: false }); setRows((rs) => rs.map((r) => r.id === p.id ? Object.assign({}, r, { action_required: false }) : r));
    };
    const count = rows.length;
    const delName = (rows.find((r) => r.id === delId) || {}).name || "Dieses Topic";
    const addTopic = () => { setEditingId(null); setAddMode("manual"); setAddSrc(null); setAddF(Object.assign({}, BLANK)); };
    const closeForm = () => { setAddF(null); setEditingId(null); setAddSrc(null); };
    const loadHunter = () => { setHunterBusy(true); fetch(API + "/api/mybook/hunter-shortlist", { credentials: "include" }).then((r) => { if (r && (r.status === 401 || r.status === 403) && window.PYsessionExpired) window.PYsessionExpired(); return r && r.ok ? r.json() : null; }).then((d) => { setHunter(d && d.ok && Array.isArray(d.trades) ? d.trades : []); setHunterBusy(false); }).catch(() => { setHunter([]); setHunterBusy(false); }); };
    const goMode = (m) => { setAddMode(m); if (m === "oracle" && hunter === null && !hunterBusy) loadHunter(); };
    const pickHunter = (t) => {
      const firstSkim = (t.skim_levels || "").split(",")[0].trim();
      setAddF({ name: t.asset || "", isin: t.isin || "", issuer: "", idx: "", art: t.art || "Aktie · Long", venue: "Tradegate", currency: "EUR", entry: numStr(t.entry), stop: numStr(t.stop), skim: firstSkim ? numStr(parseFloat(firstSkim)) : "", target: numStr(t.target), these: t.thesis || "", anti_these: "", kill_triggers: (t.thesis_kill_triggers || []).slice(0, 12) });
      setTagInput(""); setAddSrc("oracle"); setAddMode("manual");
    };
    const setAf = (k, v) => setAddF((o) => Object.assign({}, o, { [k]: v }));
    const tags = () => (addF && Array.isArray(addF.kill_triggers)) ? addF.kill_triggers : [];
    const addTag = (raw) => { const t = normTag(raw); setTagInput(""); if (!t) return; const cur = tags(); if (cur.indexOf(t) !== -1 || cur.length >= 12) return; setAf("kill_triggers", cur.concat([t])); };
    const removeTag = (t) => setAf("kill_triggers", tags().filter((x) => x !== t));
    // ISIN-Dedup: gegen bereits geladene Topics (kein extra Fetch nötig)
    const isinDup = (function () { const iv = ((addF && addF.isin) || "").trim().toUpperCase(); if (iv.length < 12) return null; const hit = rows.find((r) => String(r.isin || "").trim().toUpperCase() === iv && String(r.state || "").toLowerCase().indexOf("closed") === -1 && (!editingId || r.id !== editingId)); return hit || null; })();
    const _en = addF ? deNum(addF.entry) : null, _st = addF ? deNum(addF.stop) : null, _short = !!(addF && /Short/i.test(addF.art || ""));
    const stopOk = (!addF || _en == null || _st == null) ? true : (_short ? _st > _en : _st < _en);
    const stopErr = stopOk ? "" : (_short ? T("Bei Short muss der Stop ÜBER dem Entry liegen.", "For short, stop must be ABOVE entry.") : T("Bei Long muss der Stop UNTER dem Entry liegen.", "For long, stop must be BELOW entry."));
    const ERRMAP = (code, d) => {
      const c = String(code || "").toLowerCase();
      if (c === "these_too_short") return T("Deine These ist zu kurz — mindestens 50 Zeichen.", "Your thesis is too short — at least 50 characters.");
      if (c === "anti_these_too_short") return T("Die Anti-These ist zu kurz — mindestens 30 Zeichen.", "The anti-thesis is too short — at least 30 characters.");
      if (c === "kill_triggers_required") return T("Mindestens 1 Kill-Trigger-Tag ist Pflicht.", "At least 1 kill-trigger tag is required.");
      if (c === "stop_invalid_for_long") return T("Bei Long muss der Stop UNTER dem Entry liegen.", "For long, stop must be BELOW entry.");
      if (c === "stop_invalid_for_short") return T("Bei Short muss der Stop ÜBER dem Entry liegen.", "For short, stop must be ABOVE entry.");
      if (c === "book_full") return T("Dein Buch ist voll (12/12). Erst Platz schaffen.", "Your book is full (12/12). Make room first.");
      return (d && d.hint) || T("Konnte nicht angelegt werden.", "Could not be created.");
    };
    const trimLen = (s) => (s || "").trim().length;
    const formValid = !!(addF && addF.name.trim() && trimLen(addF.these) >= 50 && trimLen(addF.anti_these) >= 30 && tags().length >= 1 && stopOk && !isinDup);
    const submitAdd = () => {
      const f = addF; if (!formValid) return;
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
    const Fld = (o) => { const len = ((addF && addF[o.k]) || "").trim().length; const ok = o.min ? len >= o.min : true; return h("div", { key: o.k, className: "f" + (o.full ? " f-full" : "") },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } },
        h("label", { className: "f-l" }, o.label, o.req ? h("span", { style: { color: "var(--ox-b)" } }, " *") : null),
        o.min ? h("span", { className: "f-cnt" + (ok ? " ok" : "") }, len + "/" + o.min) : null),
      o.area ? h("textarea", { className: "f-i", rows: o.rows || 2, value: addF[o.k], placeholder: o.ph || "", onChange: (e) => setAf(o.k, e.target.value) })
             : h("input", { className: "f-i", value: addF[o.k], placeholder: o.ph || "", onChange: (e) => setAf(o.k, e.target.value) }),
      o.hint ? h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--text-muted)", marginTop: 4 } }, o.hint) : null,
      o.err ? h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--ox-b)", marginTop: 4 } }, o.err) : null); };
    const Sel = (o) => h("div", { key: o.k, className: "f" },
      h("label", { className: "f-l" }, o.label),
      h("select", { className: "f-i", value: addF[o.k], onChange: (e) => setAf(o.k, e.target.value) }, o.opts.map((op) => h("option", { key: op, value: op }, op))));

    const Topic = (p) => {
      const isOpen = open === p.id;
      return h("div", { key: p.id, className: "topic" + (isOpen ? " open" : "") },
        h("div", { className: "orow", onClick: () => setOpen(isOpen ? null : p.id) },
          h("div", { className: "c-mon" }, h("span", { className: "mon-lbl" }, T("Beobachten", "Monitor")), h("button", { className: "sw " + (p.monitored ? "on" : "off"), onClick: (e) => { e.stopPropagation(); toggleMon(p); } }, h("span", { className: "knob" }))),
          h("div", { className: "c-topic" }, h("div", { className: "nm" }, p.name), h("div", { className: "t-meta" },
            h("span", { className: "badge idx" }, p.idx),
            h("span", { className: "badge long" }, p.art),
            p.tracking_source === "oracle" ? h("span", { className: "badge src-oracle" }, T("Orakel", "Oracle")) : (p.tracking_source === "member_only" ? h("span", { className: "badge src-self" }, T("Du trackst", "You track")) : null),
            p.action_required ? h("span", { className: "ar-pill" }, T("Schau hin", "Look")) : null,
            h("span", { className: "isin" }, p.isin + " · Live " + ((p.live != null && String(p.live) !== "" && String(p.live) !== "null") ? p.live : "—") + (p.currency ? " " + p.currency : "")))),
          h("div", { className: "c-stat" }, h(Mini, { p })),
          h("div", { className: "c-trig" }, h(Marks, { p }), p.currency ? h("div", { className: "cur" }, p.currency) : null),
          h("div", { className: "c-act" },
            h("span", { className: "det" }, isOpen ? T("Schließen ▴", "Close ▴") : T("Details ▾", "Details ▾")),
            h("button", { className: "bedit", onClick: (e) => { e.stopPropagation(); openEdit(p); } }, T("Bearbeiten", "Edit")))),
        isOpen ? h("div", { className: "dpanel" }, h("div", { className: "dwrap" },
          h("div", { className: "mirror-row" },
            h("button", { className: "sw " + (p.tracking_source !== "member_only" ? "on" : "off"), onClick: () => toggleMirror(p) }, h("span", { className: "knob" })),
            h("div", null,
              h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" } }, T("Orakel-Mirror", "Oracle mirror")),
              h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" } }, p.tracking_source === "member_only" ? T("du trackst selbst — gegen deine Marken", "you track yourself — against your levels") : (p.oracle_mirror_available ? T("spiegelt den Orakel-Score", "mirrors the oracle score") : T("kein aktiver Orakel-Trade — bewertet gegen deine Marken", "no active oracle trade — scored against your levels"))))),
          p.action_required ? h("div", { className: "ar-banner" },
            h("div", { className: "ar-head" }, T("Das Orakel meldet einen Bruch", "The oracle reports a break")),
            h("div", { className: "ar-reason" }, p.action_reason || T("Eine Kurs-Marke oder ein Kill-Trigger wurde berührt.", "A price level or kill-trigger was hit.")),
            h("div", { className: "ar-btns" },
              h("button", { className: "arb keep", onClick: () => doAction(p, "keep") }, T("Behalten", "Keep")),
              h("button", { className: "arb", onClick: () => doAction(p, "edit") }, T("Marken anpassen", "Adjust levels")),
              h("button", { className: "arb", onClick: () => doAction(p, "member_only") }, T("Weiter laufen lassen", "Let it run")),
              h("button", { className: "arb close", onClick: () => doAction(p, "close") }, T("Schließen", "Close")),
              h("button", { className: "arb warren", onClick: () => doAction(p, "ask_warren") }, T("Frag Warren", "Ask Warren")))) : null,
          h("div", { className: "dgrid" },
          h("div", { className: "dcol-act" },
            h("button", { className: "bline chk", disabled: checkId === p.id, onClick: () => checkThesis(p) }, checkId === p.id ? T("Prüfe…", "Checking…") : T("These prüfen", "Check thesis")),
            h("button", { className: "bline" + (chartBusy === p.id ? " saving" : ""), disabled: chartBusy === p.id, onClick: () => chartMail(p) }, chartBusy === p.id ? T("sende…", "sending…") : T("Chart-Analyse per Mail", "Chart analysis by mail")),
            h("button", { className: "bdel", onClick: () => setDelId(p.id) }, T("Topic löschen", "Delete topic"))),
          h("div", { className: "dcol-these" },
            h("div", { className: "tlbl", style: { color: "var(--ox-b)" } }, T("Anti-These", "Anti-thesis")),
            (p.anti_these || p.kill) ? h("div", { className: "antit" }, p.anti_these || p.kill) : h("div", { className: "kill" }, T("— keine Anti-These hinterlegt.", "— no anti-thesis on file.")),
            h("div", { className: "tlbl" }, T("Kill-Trigger", "Kill triggers")),
            killTagsOf(p).length
              ? h("div", { className: "killpills" }, killTagsOf(p).map((k) => h("span", { key: k, className: "killpill" }, k)))
              : h("div", { className: "killwarn" }, h("span", null, T("Trag mind. 1 Kill-Trigger ein, damit News-Alerts kommen.", "Add at least 1 kill-trigger so news alerts can fire.")), h("button", { className: "killwarn-edit", onClick: () => openEdit(p) }, T("Eintragen", "Add"))),
            h("div", { className: "tlbl" }, T("Deine These", "Your thesis")),
            h("div", { className: "these" }, p.these),
            p.einschaetzung ? h("div", { className: "tlbl" }, T("Warrens Einschätzung", "Warren's read")) : null,
            p.einschaetzung ? h("div", { className: "these", style: { color: "var(--text-secondary)" } }, p.einschaetzung) : null,
            (p.einschaetzung && p.last_checked_at) ? h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 6 } }, T("Geprüft ", "Checked ") + checkedTime(p.last_checked_at)) : null,
            checkMsg[p.id] ? h("div", { style: { fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--ox-b)", marginTop: 8 } }, checkMsg[p.id]) : null)))) : null);
    };

    return h("div", { id: "mb-root" },
      h(SiteNav, { active: "" }),
      h(MyBookHero),
      h(PySection, null,
        h("div", { className: "toolbar" },
          h(PyEyebrow, null, T("Überblick · ", "Overview · ") + count + "/" + MAX + " Topics"),
          h("div", { style: { display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" } },
            h("label", { className: "rep" }, h("button", { className: "sw " + (summary ? "on" : "off"), onClick: () => setSummary(!summary) }, h("span", { className: "knob" })), T("Tägliche My-Book-Summary", "Daily My-Book summary")),
            h(Button, { variant: "oracle", size: "sm", disabled: count >= MAX, onClick: addTopic }, T("+ Topic hinzufügen", "+ Add topic")))),
        h("h2", { className: "mb" }, T("Deine Topics auf einen Blick.", "Your topics at a glance.")),
        rows.length ? h("div", { className: "list" },
          h("div", { className: "hdr" },
            h("span", { className: "hc c-mon" }, T("Beobachten", "Monitor")),
            h("span", { className: "hc c-topic" }, "Topic"),
            h("span", { className: "hc c-stat" }, T("These-Status", "Thesis status")),
            h("span", { className: "hc c-trig" }, "My Trigger"),
            h("span", { className: "hc c-act" })),
          rows.map(Topic))
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
            Fld({ label: "Name", k: "name", full: true, ph: "Rheinmetall AG" }),
            h("div", { key: "isin", className: "f f-full" },
              h("label", { className: "f-l" }, T("ISIN — automatisch laden", "ISIN — auto-fill")),
              h("div", { style: { display: "flex", gap: 8 } },
                h("input", { className: "f-i gold", value: addF.isin, placeholder: "DE0007030009", onChange: (e) => setAf("isin", e.target.value) }),
                h(Button, { variant: "oracle", size: "sm", disabled: addBusy || !(addF.isin && addF.isin.trim()), onClick: isinLookup }, addBusy ? T("lädt…", "loading…") : T("Laden", "Load")))),
            isinDup ? h("div", { key: "isindup", className: "f f-full isindup" }, T("Du hast diese ISIN schon im Buch — ", "This ISIN is already in your book — "), h("b", null, isinDup.name), ". ", h("button", { className: "isindup-open", onClick: () => { setOpen(isinDup.id); closeForm(); } }, T("Öffnen", "Open"))) : null,
            Fld({ label: T("Emittent", "Issuer"), k: "issuer", ph: T("z. B. Société Générale", "e.g. Société Générale") }),
            Sel({ label: T("Art", "Type"), k: "art", opts: ["Aktie · Long", "Aktie · Short", "ETF · Long", "ETF · Short", "ETC · Long", "ETC · Short", "Knock-Out · Long", "Knock-Out · Short", "Optionsschein", "Krypto · Long", "Forex"] }),
            Fld({ label: T("Markt / Index", "Market / index"), k: "idx", ph: "EURO STOXX 50" }),
            Sel({ label: T("Handelsplatz", "Trading venue"), k: "venue", opts: ["Tradegate", "Lang & Schwarz", "Gettex", "Xetra", "Stuttgart", "Frankfurt", "NYSE", "NASDAQ", "Sonstige"] }),
            Sel({ label: T("Währung", "Currency"), k: "currency", opts: ["EUR", "USD", "GBP", "CHF", "JPY"] }),
            Fld({ label: "Entry", k: "entry", ph: "0,00" }),
            Fld({ label: "Stop", k: "stop", ph: "0,00", err: stopErr }),
            Fld({ label: "Skim", k: "skim", ph: "0,00" }),
            Fld({ label: "Target", k: "target", ph: "0,00" }),
            Fld({ label: T("Was erwartest du? Warum?", "What do you expect? Why?"), k: "these", full: true, area: true, rows: 3, req: true, min: 50, ph: T("Ein klarer Satz — z. B. „Iran-Eskalation + EU-Aufrüstung stützen den Defense-Sektor strukturell für Quartale.“", "One clear sentence — e.g. “Iran escalation + EU rearmament structurally support the defense sector for quarters.”"), hint: T("Wird vom Orakel wörtlich zitiert. Mindestens 50 Zeichen.", "Quoted verbatim by the oracle. At least 50 characters.") }),
            Fld({ label: T("Was würde diese These widerlegen? (Story)", "What would disprove this thesis? (story)"), k: "anti_these", full: true, area: true, rows: 2, req: true, min: 30, ph: T("Wenn die EZB die Zinsen wieder anhebt und der Euro Richtung 1.20 läuft, ist die These tot.", "If the ECB hikes rates again and the euro runs toward 1.20, the thesis is dead."), hint: T("Wird vom Orakel als Kontext für die Lesart genutzt. Mindestens 30 Zeichen.", "Used by the oracle as context for its read. At least 30 characters.") }),
            (function () {
              var cur = tags();
              return h("div", { key: "killtags", className: "f f-full" },
                h("label", { className: "f-l" }, T("Tags fürs News-Monitoring (mind. 1)", "Tags for news monitoring (min. 1)"), h("span", { style: { color: "var(--ox-b)" } }, " *")),
                h("div", { className: "tagbox" },
                  cur.map((tg) => h("span", { key: tg, className: "tagchip" }, tg, h("button", { className: "tagx", onClick: () => removeTag(tg) }, "×"))),
                  h("input", { className: "taginput", value: tagInput, placeholder: cur.length ? "" : T("z. B. earnings_miss", "e.g. earnings_miss"), onChange: (e) => setTagInput(e.target.value), onKeyDown: (e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); } else if (e.key === "Backspace" && !tagInput && cur.length) { removeTag(cur[cur.length - 1]); } } })),
                h("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--text-muted)", marginTop: 5 } }, T("Diese Tags entscheiden, ob News-Alerts kommen. snake_case · max 12.", "These tags decide whether news alerts fire. snake_case · max 12.")),
                h("div", { className: "tagsug" }, KILL_SUGGEST.filter((s) => cur.indexOf(s) === -1).slice(0, 8).map((s) => h("button", { key: s, className: "sugchip", onClick: () => addTag(s) }, "+ " + s))));
            })()),
          h("div", { className: "f-note", style: { marginTop: 10 } }, T("Handelsplatz = wo du handelst. Standard Tradegate (EUR). Kurs-Felder leer lassen, wenn unbekannt.", "Trading venue = where you trade. Default Tradegate (EUR). Leave price fields empty if unknown.")),
          h("div", { className: "f-foot" },
            h(Button, { variant: "ghost", size: "sm", onClick: closeForm }, T("Abbrechen", "Cancel")),
            h(Button, { variant: "oracle", size: "sm", disabled: !formValid, onClick: submitAdd }, editingId ? T("Speichern", "Save") : T("Topic anlegen", "Create topic")))))) : null,
      flash ? h("div", { className: "flash" }, flash) : null,
      h(SiteFooter, null));
  }

  const root = document.getElementById("root");
  if (root) ReactDOM.createRoot(root).render(h(App));
})();
