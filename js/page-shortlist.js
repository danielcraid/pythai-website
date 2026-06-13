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

  #sl-root .card{border:1px solid var(--line);border-radius:14px;background:var(--card);margin-bottom:13px;overflow:hidden;transition:border-color .18s;}
  #sl-root .card:hover{border-color:#2C313B;}
  #sl-root .card.open{border-color:var(--border-oracle);}
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
  #sl-root .dist .s{color:var(--bull);} #sl-root .dist .x{color:var(--ox-b);}
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
  #sl-root .disc{max-width:1120px;margin:34px auto 0;border:1px solid var(--line);border-left:3px solid #8A6526;border-radius:8px;background:var(--card);padding:14px 18px;}
  #sl-root .disc p{font-family:var(--font-ui);font-size:12px;line-height:1.6;color:var(--mist);margin:0;}
  #sl-root .flash{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:300;max-width:90vw;background:var(--raised);border:1px solid var(--border-oracle);border-left:3px solid var(--oracle-b);border-radius:10px;padding:13px 18px;font-family:var(--font-ui);font-size:13.5px;color:var(--parch);box-shadow:0 14px 40px rgba(0,0,0,.5);}

  @media(max-width:820px){
    #sl-root .head{grid-template-columns:minmax(0,1fr) auto;gap:14px 18px;grid-template-areas:"id live" "bm bm";}
    #sl-root .id{grid-area:id;} #sl-root .live{grid-area:live;} #sl-root .bm{grid-area:bm;} #sl-root .chev{display:none;}
    #sl-root .nm{font-size:21px;}
    #sl-root .detbody{grid-template-columns:1fr;gap:22px;}
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
    const [open, setOpen] = useState(null);
    const [addingId, setAddingId] = useState(null);
    const [addedIds, setAddedIds] = useState([]);
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
      fetch(API + "/api/mybook/hunter-shortlist", { credentials: "include" }).then((r) => {
        if (r.status === 401) { if (window.PYsessionExpired) window.PYsessionExpired(); return null; }
        if (r.status === 403) { setDenied(true); return null; }
        return r.ok ? r.json() : null;
      }).then((d) => {
        setTrades(d && d.ok && Array.isArray(d.trades) ? d.trades : []);
      }).catch(() => setTrades([]));
    }, [gate]);

    const addToBook = (t) => {
      if (addingId) return;
      setAddingId(t.id);
      const skims = parseSkims(t.skim_levels || t.skim);
      const body = {
        name: t.asset, isin: t.isin || "", market: "", art: t.art, venue: "Tradegate", currency: "EUR",
        entry: num(t.entry), stop: num(t.stop), skim: skims.length ? skims[0] : null, target: num(t.target),
        these: t.thesis || t.these || "", anti_these: killList(t).join(" · "), tracking_source: "oracle"
      };
      fetch(API + "/api/mybook", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then((r) => {
          if (r && (r.status === 401 || r.status === 403)) { if (window.PYsessionExpired) window.PYsessionExpired(); return null; }
          if (r && r.status === 409) return { dup: true };
          if (r && r.ok) return r.json();
          return { err: true };
        })
        .then((res) => {
          setAddingId(null);
          if (!res) return;
          if (res.dup) { setAddedIds((a) => a.concat(t.id)); showFlash(T("Steht schon in deinem My Book.", "Already in your My Book.")); return; }
          if (res.err) { showFlash(T("Konnte nicht übernehmen — evtl. ist dein My Book voll (12/12) oder das Topic existiert schon.", "Couldn't add — your My Book may be full (12/12) or the topic already exists.")); return; }
          if (res.ok) { setAddedIds((a) => a.concat(t.id)); showFlash(T("In My Book übernommen — als Orakel-Mirror. Du kannst es dort anpassen.", "Added to My Book — as oracle mirror. You can adjust it there.")); }
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
          showFlash(T("Warren schickt dir die Chart-Analyse per Mail.", "Warren is sending the chart analysis by mail."));
        })
        .catch(() => { setChartBusy(null); showFlash(T("Netzwerkfehler — versuch es gleich nochmal.", "Network error — try again shortly.")); });
    };

    const Card = (t) => {
      const isOpen = open === t.id;
      const isShort = /short/i.test(t.art || "");
      const entry = num(t.entry), live = liveNum(t);
      const isPending = t.state === "pending"; // Badge & Add-Gate NUR aus state, nicht aus Daten-Vollständigkeit
      const chg = pctStr(t.live_change_pct);
      const dSkim = pctStr(t.distance_to_skim), dStop = pctStr(t.distance_to_stop);
      const added = addedIds.indexOf(t.id) !== -1;
      const kills = killList(t);
      const skims = parseSkims(t.skim_levels || t.skim);
      const recap = t.einschaetzung || "";
      const thesis = t.thesis || t.these || "";

      return h("div", { key: t.id, className: "card" + (isOpen ? " open" : "") },
        h("div", { className: "head", onClick: () => setOpen(isOpen ? null : t.id) },
          h("div", { className: "id" },
            h("div", { className: "cat " + (isShort ? "short" : "long") }, t.art || ""),
            h("div", { className: "nm" }, t.asset),
            h("div", { className: "sub" },
              h("span", { className: "isin" }, t.isin || ""),
              isPending ? h("span", { className: "wtag" }, T("Watchlist", "Watchlist")) : null,
              t.days_active != null ? h("span", { className: "day" }, "Tag " + t.days_active) : null)),
          Barometer(t, false),
          h("div", { className: "live" },
            live != null
              ? h("div", null, h("span", { className: "px" }, deFmt(live)), h("span", { className: "cur" }, "EUR"))
              : h("div", null, h("span", { className: "px na" }, "—"), h("span", { className: "cur" }, "EUR")),
            chg ? h("span", { className: "chg " + (isNeg(chg) ? "dn" : "up") }, chg) : null),
          h("div", { className: "chev" }, "▼")),

        isOpen ? h("div", { className: "det" },
          h("div", { className: "kurs" },
            h("span", { className: "lab" }, T("Aktueller Kurs", "Current price")),
            h("span", { className: "v" + (chg ? (isNeg(chg) ? " dn" : " up") : "") }, deFmt(live)),
            h("span", { className: "v" }, chg ? h("span", { style: { fontSize: 13 } }, "(" + chg + ")") : null),
            t.origin ? h("span", { className: "t" }, "· " + T("seit ", "since ") + t.origin + T(" im Spiel", " in play")) : null),
          (dSkim || dStop) ? h("div", { className: "dist" },
            dSkim ? h("span", { className: "s" }, "▲ " + dSkim + " " + T("bis Skim", "to skim")) : null,
            dStop ? h("span", { className: "x" }, "▼ " + dStop + " " + T("bis Stop", "to stop")) : null) : null,

          h("div", { className: "secl", style: { marginTop: 22 } }, T("These-Status", "Thesis status")),
          Barometer(t, true),

          t.chart_img ? h("div", { className: "secl", style: { marginTop: 24 } }, T("Kursverlauf · letzter Trading-Day", "Price action · last trading day")) : null,
          t.chart_img ? h("div", { className: "chartwrap" }, h("img", { src: t.chart_img, alt: T("Kursverlauf", "Price action"), loading: "lazy" })) : null,

          h("div", { className: "detbody" },
            h("div", null,
              recap ? h("p", { className: "recap" }, recap) : null,
              h("div", { className: "secl" }, T("Die These", "The thesis")),
              h("p", { className: "these" }, thesis || T("— keine These hinterlegt.", "— no thesis on file.")),
              kills.length ? h("div", { className: "killwrap" },
                h("div", { className: "secl" }, T("Kippt bei", "Breaks on")),
                h("div", { className: "chips" }, kills.map((k, i) => h("span", { key: i, className: "chip" }, k)))) : null),
            h("div", { className: "side" },
              h("div", { className: "lvgrid" },
                h("div", { className: "lv" }, h("div", { className: "k" }, "Entry"), h("div", { className: "v" }, deFmt(entry))),
                h("div", { className: "lv stop" }, h("div", { className: "k" }, T("Stop", "Stop")), h("div", { className: "v" }, deFmt(num(t.stop)))),
                h("div", { className: "lv skim" }, h("div", { className: "k" }, "Skim"), h("div", { className: "v" }, skims.length ? skims.map(deFmt).join(" / ") : "—")),
                h("div", { className: "lv tgt" }, h("div", { className: "k" }, T("Ziel", "Target")), h("div", { className: "v" }, deFmt(num(t.target))))),
              h("div", { className: "acts" },
                isPending
                  ? h("div", null,
                      h("button", { className: "badd", disabled: true }, T("In My Book", "Add to My Book")),
                      h("div", { className: "baddhint watch" }, T("Watchlist — noch kein Entry. Sobald das Orakel scharf stellt, kannst du es übernehmen.", "Watchlist — no entry yet. Once the oracle arms it, you can add it.")))
                  : !canAdd
                    ? h("div", null,
                        h("button", { className: "badd lock", disabled: true }, h("span", { className: "lk" }, "▲"), " ", T("In My Book — Syndicate", "In My Book — Syndicate")),
                        h("a", { className: "baddhint up", href: "inner-circle.html" }, T("Im Syndicate übernimmst du Orakel-Trades mit einem Klick. → Syndicate", "In the Syndicate you copy oracle trades with one click. → Syndicate")))
                    : added
                      ? h("div", null,
                          h("button", { className: "badd done", disabled: true }, T("✓ Im My Book", "✓ In My Book")),
                          h("a", { className: "openbook", href: "mybook.html" }, T("→ In My Book öffnen", "→ open My Book")))
                      : h("button", { className: "badd", disabled: addingId === t.id, onClick: () => addToBook(t) }, addingId === t.id ? T("übernehme…", "adding…") : T("In My Book übernehmen", "Add to My Book")),
                h("button", { className: "bchart", disabled: chartBusy === t.id, onClick: () => chartMail(t) }, chartBusy === t.id ? T("sende…", "sending…") : T("Chart-Analyse per Mail", "Chart analysis by mail")))))) : null);
    };

    const Hero = (sub) => h("div", { className: "hero" },
      h(PyEyebrow, null, T("Orakel · Aktive Jagd", "Oracle · Active Hunt")),
      h("h1", { className: "htitle" }, T("Die Shortlist.", "The Shortlist.")),
      h("p", { className: "hlead" }, T("Was das Orakel gerade jagt — offengelegt. Jede Position führt mit ihrer These, der Kurs ist nur der Beleg.", "What the oracle is hunting right now — in the open. Every position leads with its thesis; the price is just the evidence.")),
      sub);

    const page = (inner) => h("div", { id: "sl-root" }, h(SiteNav, { active: "shortlist.html" }), h("div", { className: "wrap" }, inner),
      h("div", { className: "disc" }, h("p", null, T("Die Shortlist ist Markt-Beobachtung, keine Anlageberatung. These, Marken und Status können sich jederzeit ändern. Du handelst eigenverantwortlich.", "The shortlist is market observation, not investment advice. Thesis, levels and status can change at any time. You trade on your own responsibility."))),
      flash ? h("div", { className: "flash" }, flash) : null,
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
            h("h2", { className: "lockt" }, T("Die volle Jagd — im Syndicate.", "The full hunt — in the Syndicate.")),
            h("p", { className: "locks" }, T("Die aktive Shortlist mit Thesen, Marken, live-Score und „In My Book“ ist dem Syndicate vorbehalten.", "The active shortlist with theses, levels, live score and “add to My Book” is reserved for the Syndicate.")),
            h(Button, { variant: "oracle", onClick: () => { window.location.href = loggedIn ? "inner-circle.html" : "register.html"; } }, loggedIn ? T("Syndicate freischalten", "Unlock Syndicate") : T("Enter the Sanctum", "Enter the Sanctum")))))));
    }

    if (trades === null) return page(h("div", null, Hero(null), h("div", { className: "state" }, T("Lade die Shortlist…", "Loading the shortlist…"))));

    if (!trades.length) return page(h("div", null,
      Hero(null),
      h("div", { className: "empty" },
        h("div", { className: "empty-t" }, T("Gerade ist die Jagd ruhig.", "The hunt is quiet right now.")),
        h("div", { className: "empty-s" }, T("Aktuell stehen keine Trades auf der Shortlist. Das Orakel meldet sich, sobald sich ein Kandidat qualifiziert.", "No trades are on the shortlist right now. The oracle will surface a candidate as soon as one qualifies.")))));

    return page(h("div", null,
      Hero(h("div", { className: "hmeta" },
        h("span", { className: "pulse" }),
        h("span", null, h("span", { className: "cnt" }, trades.length), " ", T(trades.length === 1 ? "aktive Position" : "aktive Positionen", trades.length === 1 ? "active position" : "active positions")))),
      h("div", { className: "list" }, trades.map(Card))));
  }

  const root = document.getElementById("root");
  if (root) ReactDOM.createRoot(root).render(h(App));
})();
