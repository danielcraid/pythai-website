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
    let s = String(x).trim();
    if (s.indexOf(",") !== -1 && s.indexOf(".") !== -1) s = s.replace(/\./g, "").replace(",", ".");
    else if (s.indexOf(",") !== -1) s = s.replace(",", ".");
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  };
  const parseSkims = (s) => String(s == null ? "" : s).split(/[,;·]/).map((x) => num(x)).filter((x) => x != null);
  const deFmt = (n) => n == null ? "—" : Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const wgPct = (s) => { if (s == null) return 50; if (s >= -1 && s <= 1) return wpct(s); if (s > 1 && s <= 100) return Math.max(3, Math.min(97, s)); return 50; };
  const zoneColor = (label) => Z[ZONE.indexOf(label)] || "var(--mist)";

  const CSS = `
  #sl-root{ --void:var(--bg-base); --raised:var(--bg-raised); --card:var(--bg-surface); --line:var(--border-subtle); --parch:var(--parchment); --mist:var(--text-secondary); --ash:var(--text-muted); --oracle-b:var(--oracle-bright); --ox-b:#E0726B; --bull:var(--bull-bright); --input:var(--bg-input); --steel:#7C8492; }
  #sl-root .wrap{max-width:1180px;margin:0 auto;padding:54px 28px 90px;}
  #sl-root .hero{text-align:center;max-width:760px;margin:0 auto 44px;}
  #sl-root .htitle{font-family:var(--font-oracle);font-weight:400;font-size:clamp(38px,6vw,60px);line-height:1.02;color:var(--parch);margin:14px 0 0;}
  #sl-root .hlead{font-family:var(--font-ui);font-size:clamp(15px,2vw,18px);line-height:1.62;color:var(--mist);margin:18px auto 0;max-width:58ch;}
  #sl-root .hmeta{display:inline-flex;align-items:center;gap:10px;margin-top:24px;font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ash);}
  #sl-root .pulse{width:7px;height:7px;border-radius:50%;background:var(--bull);box-shadow:0 0 0 0 rgba(111,207,154,.6);animation:slPulse 2.4s ease-out infinite;}
  @keyframes slPulse{0%{box-shadow:0 0 0 0 rgba(111,207,154,.55)}70%{box-shadow:0 0 0 9px rgba(111,207,154,0)}100%{box-shadow:0 0 0 0 rgba(111,207,154,0)}}
  #sl-root .cnt{color:var(--oracle-b);font-weight:700;}

  #sl-root .card{border:1px solid var(--line);border-radius:14px;background:var(--card);margin-bottom:14px;overflow:hidden;transition:border-color .18s;}
  #sl-root .card:hover{border-color:#2C313B;}
  #sl-root .card.open{border-color:var(--border-oracle);}
  #sl-root .head{display:grid;grid-template-columns:minmax(0,1fr) 132px 188px 30px;gap:22px;align-items:center;padding:20px 22px;cursor:pointer;}
  #sl-root .id{min-width:0;}
  #sl-root .nm{font-family:var(--font-oracle);font-size:25px;line-height:1.05;color:var(--parch);}
  #sl-root .meta{display:flex;align-items:center;gap:8px;margin-top:7px;flex-wrap:wrap;}
  #sl-root .badge{font-family:var(--font-mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;border:1px solid #2A2F39;border-radius:5px;padding:4px 8px;white-space:nowrap;color:var(--mist);}
  #sl-root .badge.long{color:var(--bull);border-color:rgba(111,207,154,.35);}
  #sl-root .badge.short{color:var(--ox-b);border-color:rgba(224,114,107,.4);}
  #sl-root .badge.oracle{border-radius:999px;font-size:8.5px;color:var(--oracle-b);border-color:rgba(212,169,78,.5);background:rgba(212,169,78,.1);}
  #sl-root .isin{font-family:var(--font-mono);font-size:10.5px;color:var(--ash);letter-spacing:.04em;}
  #sl-root .days{font-family:var(--font-mono);font-size:10px;color:var(--steel);}
  #sl-root .live{text-align:right;}
  #sl-root .live .px{font-family:var(--font-mono);font-size:21px;color:var(--parch);line-height:1;}
  #sl-root .live .cur{font-family:var(--font-mono);font-size:10px;color:var(--ash);margin-left:3px;}
  #sl-root .delta{display:inline-block;margin-top:7px;font-family:var(--font-mono);font-size:11px;font-weight:700;border-radius:999px;padding:3px 9px;}
  #sl-root .delta.up{color:var(--bull);background:rgba(111,207,154,.1);border:1px solid rgba(111,207,154,.3);}
  #sl-root .delta.dn{color:var(--ox-b);background:rgba(224,114,107,.1);border:1px solid rgba(224,114,107,.32);}
  #sl-root .chev{justify-self:end;color:var(--ash);font-size:13px;transition:transform .2s,color .2s;}
  #sl-root .card.open .chev{transform:rotate(180deg);color:var(--oracle-b);}

  /* Waage */
  #sl-root .wg{width:100%;}
  #sl-root .wg-mk{position:relative;height:11px;}
  #sl-root .wg-ar{position:absolute;transform:translateX(-50%);color:var(--oracle-b);font-size:10px;line-height:1;}
  #sl-root .wg-bar{display:flex;height:7px;border-radius:999px;overflow:hidden;} #sl-root .wg-bar span{flex:1;}
  #sl-root .wg-lab{font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:.06em;margin-top:6px;text-align:right;}

  /* Kurs-Leiter (price ladder) */
  #sl-root .lad{position:relative;margin:4px 22px 20px;height:74px;}
  #sl-root .lad-live{position:absolute;top:2px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:1px;z-index:3;pointer-events:none;}
  #sl-root .lad-live .bub{font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--oracle-b);white-space:nowrap;letter-spacing:.02em;}
  #sl-root .lad-live .car{color:var(--oracle-b);font-size:9px;line-height:1;}
  #sl-root .lad-live .ndl{width:1.5px;height:17px;background:var(--oracle-b);}
  #sl-root .lad-live .dot{width:9px;height:9px;border-radius:50%;background:var(--oracle-b);border:2px solid var(--void);margin-top:-1px;}
  #sl-root .lad-track{position:absolute;top:42px;left:0;right:0;height:8px;border-radius:999px;background:linear-gradient(90deg,rgba(196,82,76,.85) 0%,rgba(201,162,78,.5) 50%,rgba(111,207,154,.85) 100%);}
  #sl-root .lad-skim{position:absolute;top:39px;transform:translateX(-50%);width:2px;height:14px;background:var(--oracle);border-radius:2px;z-index:2;}
  #sl-root .lad-mk{position:absolute;top:54px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:2px;white-space:nowrap;}
  #sl-root .lad-mk .t{width:1px;height:7px;background:var(--steel);margin-bottom:1px;}
  #sl-root .lad-mk .k{font-family:var(--font-mono);font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--steel);}
  #sl-root .lad-mk .v{font-family:var(--font-mono);font-size:11px;color:var(--parch);}
  #sl-root .lad-mk.stop .v{color:var(--ox-b);} #sl-root .lad-mk.stop .t{background:var(--ox-b);}
  #sl-root .lad-mk.tgt .v{color:var(--bull);} #sl-root .lad-mk.tgt .t{background:var(--bull);}
  #sl-root .lad-mk.entry .v{color:var(--parch);} #sl-root .lad-mk.entry .t{background:var(--parch);}

  /* Detail */
  #sl-root .det{border-top:1px solid var(--line);padding:22px;display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:30px;align-items:start;}
  #sl-root .tlbl{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--oracle);margin:0 0 8px;}
  #sl-root .these{font-family:var(--font-ui);font-size:15px;line-height:1.62;color:var(--parch);margin:0;max-width:62ch;}
  #sl-root .killwrap{margin-top:20px;}
  #sl-root .chips{display:flex;flex-wrap:wrap;gap:7px;}
  #sl-root .chip{font-family:var(--font-mono);font-size:10.5px;color:#F0A39C;border:1px solid rgba(224,114,107,.4);background:rgba(224,114,107,.08);border-radius:999px;padding:4px 10px;}
  #sl-root .side{display:flex;flex-direction:column;gap:14px;}
  #sl-root .lvgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  #sl-root .lv{border:1px solid var(--line);border-radius:8px;background:var(--input);padding:9px 11px;}
  #sl-root .lv .k{font-family:var(--font-mono);font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--steel);}
  #sl-root .lv .v{font-family:var(--font-mono);font-size:15px;color:var(--parch);margin-top:3px;}
  #sl-root .lv.stop .v{color:var(--ox-b);} #sl-root .lv.skim .v{color:var(--oracle);} #sl-root .lv.tgt .v{color:var(--bull);}
  #sl-root .badd{font-family:var(--font-ui);font-size:13.5px;font-weight:600;border:none;border-radius:9px;padding:12px 16px;cursor:pointer;background:var(--grad-gold);color:var(--text-on-gold);text-align:center;}
  #sl-root .badd:disabled{opacity:.55;cursor:not-allowed;}
  #sl-root .badd.done{background:rgba(111,207,154,.12);color:var(--bull);border:1px solid rgba(111,207,154,.4);}
  #sl-root .baddhint{font-family:var(--font-mono);font-size:10px;line-height:1.5;color:var(--ash);margin-top:8px;text-align:center;}
  #sl-root .baddhint.watch{color:var(--ox-b);}
  #sl-root .badd.lock{background:transparent;color:var(--oracle-b);border:1px solid rgba(212,169,78,.45);}
  #sl-root .badd.lock .lk{font-size:10px;vertical-align:1px;}
  #sl-root a.baddhint.up{display:block;color:var(--oracle-b);text-decoration:none;}
  #sl-root a.baddhint.up:hover{color:var(--oracle);}
  #sl-root .openbook{display:inline-block;margin-top:9px;font-family:var(--font-mono);font-size:11px;color:var(--oracle-b);text-decoration:none;text-align:center;}

  /* Locked / states */
  #sl-root .locked{position:relative;}
  #sl-root .ghosts{filter:blur(5px);opacity:.5;pointer-events:none;user-select:none;}
  #sl-root .gcard{border:1px solid var(--line);border-radius:14px;background:var(--card);height:118px;margin-bottom:14px;}
  #sl-root .lockpanel{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;}
  #sl-root .lockbox{max-width:460px;text-align:center;background:rgba(10,11,15,.72);backdrop-filter:blur(3px);border:1px solid var(--border-oracle);border-radius:16px;padding:34px 30px;box-shadow:0 24px 70px rgba(0,0,0,.55);}
  #sl-root .lockt{font-family:var(--font-oracle);font-weight:400;font-size:30px;color:var(--parch);margin:0;}
  #sl-root .locks{font-family:var(--font-ui);font-size:15px;line-height:1.6;color:var(--mist);margin:14px 0 24px;}
  #sl-root .state{min-height:46vh;display:flex;align-items:center;justify-content:center;font-family:var(--font-oracle);font-style:italic;font-size:22px;color:var(--text-oracle);}
  #sl-root .empty{border:1px solid var(--line);border-radius:14px;background:var(--card);padding:54px 30px;text-align:center;}
  #sl-root .empty-t{font-family:var(--font-oracle);font-size:26px;color:var(--parch);}
  #sl-root .empty-s{font-family:var(--font-ui);font-size:14.5px;line-height:1.6;color:var(--mist);margin:10px auto 0;max-width:52ch;}
  #sl-root .disc{max-width:1180px;margin:34px auto 0;border:1px solid var(--line);border-left:3px solid #8A6526;border-radius:8px;background:var(--card);padding:14px 18px;}
  #sl-root .disc p{font-family:var(--font-ui);font-size:12px;line-height:1.6;color:var(--mist);margin:0;}
  #sl-root .flash{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:300;max-width:90vw;background:var(--raised);border:1px solid var(--border-oracle);border-left:3px solid var(--oracle-b);border-radius:10px;padding:13px 18px;font-family:var(--font-ui);font-size:13.5px;color:var(--parch);box-shadow:0 14px 40px rgba(0,0,0,.5);}

  @media(max-width:760px){
    #sl-root .head{grid-template-columns:minmax(0,1fr) auto;gap:14px;grid-template-areas:"id live" "wg wg";}
    #sl-root .id{grid-area:id;} #sl-root .live{grid-area:live;} #sl-root .wg{grid-area:wg;} #sl-root .chev{display:none;}
    #sl-root .nm{font-size:21px;}
    #sl-root .det{grid-template-columns:1fr;gap:20px;}
    #sl-root .lad{margin:4px 16px 18px;}
  }`;

  function injectCSS() { if (document.getElementById("sl-css")) return; const s = document.createElement("style"); s.id = "sl-css"; s.textContent = CSS; document.head.appendChild(s); }

  function Waage(score, label) {
    const pct = wgPct(score);
    const lab = label || "";
    return h("div", { className: "wg" },
      h("div", { className: "wg-mk" }, h("span", { className: "wg-ar", style: { left: pct + "%" } }, "▾")),
      h("div", { className: "wg-bar" }, Z.map((c, i) => h("span", { key: i, style: { background: c } }))),
      h("div", { className: "wg-lab", style: { color: zoneColor(lab) } }, ZLAB[lab] || lab));
  }

  function Ladder(t) {
    const isShort = /short/i.test(t.art || "");
    const dir = isShort ? -1 : 1;
    const stop = num(t.stop), entry = num(t.entry), target = num(t.target), live = num(t.live_price);
    const skims = parseSkims(t.skim_levels);
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
    const [gate, setGate] = useState("loading"); // loading | ok | locked
    const [denied, setDenied] = useState(false); // Member, aber Endpoint noch Syndicate-only (403)
    const [trades, setTrades] = useState(null);
    const [open, setOpen] = useState(null);
    const [addingId, setAddingId] = useState(null);
    const [addedIds, setAddedIds] = useState([]);
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
        if (r.status === 403) { setDenied(true); return null; } // Session gültig, aber Tier (noch) nicht freigegeben
        return r.ok ? r.json() : null;
      }).then((d) => {
        const tr = d && d.ok && Array.isArray(d.trades) ? d.trades : [];
        setTrades(tr);
      }).catch(() => setTrades([]));
    }, [gate]);

    const addToBook = (t) => {
      if (addingId) return;
      setAddingId(t.id);
      const skims = parseSkims(t.skim_levels);
      const body = {
        name: t.asset, isin: t.isin || "", market: "", art: t.art, venue: "Tradegate", currency: "EUR",
        entry: num(t.entry), stop: num(t.stop), skim: skims.length ? skims[0] : null, target: num(t.target),
        these: t.thesis || "", anti_these: (t.thesis_kill_triggers || []).join(" · "), tracking_source: "oracle"
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

    const Card = (t) => {
      const isOpen = open === t.id;
      const isShort = /short/i.test(t.art || "");
      const entry = num(t.entry), live = num(t.live_price);
      const noEntry = entry == null || t.state === "pending";
      let delta = null;
      if (entry != null && live != null && entry !== 0) {
        const pct = (isShort ? -1 : 1) * (live - entry) / entry * 100;
        delta = h("span", { className: "delta " + (pct >= 0 ? "up" : "dn") }, (pct >= 0 ? "+" : "−") + Math.abs(pct).toFixed(1) + "%");
      }
      const added = addedIds.indexOf(t.id) !== -1;
      const kills = (t.thesis_kill_triggers || []);
      const skims = parseSkims(t.skim_levels);
      return h("div", { key: t.id, className: "card" + (isOpen ? " open" : "") },
        h("div", { className: "head", onClick: () => setOpen(isOpen ? null : t.id) },
          h("div", { className: "id" },
            h("div", { className: "nm" }, t.asset),
            h("div", { className: "meta" },
              h("span", { className: "badge " + (isShort ? "short" : "long") }, t.art),
              h("span", { className: "badge oracle" }, T("Orakel", "Oracle")),
              noEntry ? h("span", { className: "badge" }, T("Watchlist", "Watchlist")) : null,
              h("span", { className: "isin" }, t.isin || ""),
              t.days_active != null ? h("span", { className: "days" }, "· " + t.days_active + T(" Tage aktiv", "d active")) : null)),
          h("div", { className: "live" },
            h("div", null, h("span", { className: "px" }, deFmt(live)), h("span", { className: "cur" }, "EUR")),
            delta),
          Waage(t.waage_score, t.waage_label),
          h("div", { className: "chev" }, "▼")),
        Ladder(t),
        isOpen ? h("div", { className: "det" },
          h("div", null,
            h("div", { className: "tlbl" }, T("Die These", "The thesis")),
            h("p", { className: "these" }, t.thesis || T("— keine These hinterlegt.", "— no thesis on file.")),
            kills.length ? h("div", { className: "killwrap" },
              h("div", { className: "tlbl" }, T("Was die These kippt", "What kills the thesis")),
              h("div", { className: "chips" }, kills.map((k, i) => h("span", { key: i, className: "chip" }, k)))) : null),
          h("div", { className: "side" },
            h("div", { className: "lvgrid" },
              h("div", { className: "lv entry" }, h("div", { className: "k" }, "Entry"), h("div", { className: "v" }, deFmt(entry))),
              h("div", { className: "lv stop" }, h("div", { className: "k" }, T("Stop", "Stop")), h("div", { className: "v" }, deFmt(num(t.stop)))),
              h("div", { className: "lv skim" }, h("div", { className: "k" }, "Skim"), h("div", { className: "v" }, skims.length ? skims.map(deFmt).join(" / ") : "—")),
              h("div", { className: "lv tgt" }, h("div", { className: "k" }, T("Ziel", "Target")), h("div", { className: "v" }, deFmt(num(t.target))))),
            noEntry
              ? h("div", null,
                  h("button", { className: "badd", disabled: true }, T("In My Book", "Add to My Book")),
                  h("div", { className: "baddhint watch" }, T("Watchlist-Status — noch kein Entry. Sobald das Orakel scharf stellt, kannst du es übernehmen.", "Watchlist — no entry yet. Once the oracle arms it, you can add it.")))
              : !canAdd
                ? h("div", null,
                    h("button", { className: "badd lock", disabled: true }, h("span", { className: "lk" }, "▲"), " ", T("In My Book — Syndicate", "In My Book — Syndicate")),
                    h("a", { className: "baddhint up", href: "inner-circle.html" }, T("Im Syndicate übernimmst du Orakel-Trades mit einem Klick. → Syndicate ansehen", "In the Syndicate you copy oracle trades with one click. → see Syndicate")))
                : added
                  ? h("div", null,
                      h("button", { className: "badd done", disabled: true }, T("✓ Im My Book", "✓ In My Book")),
                      h("a", { className: "openbook", href: "mybook.html" }, T("→ In My Book öffnen", "→ open My Book")))
                  : h("div", null,
                      h("button", { className: "badd", disabled: addingId === t.id, onClick: () => addToBook(t) }, addingId === t.id ? T("übernehme…", "adding…") : T("In My Book übernehmen", "Add to My Book")),
                      h("div", { className: "baddhint" }, T("Übernimmt These, Marken & Anti-These — als Orakel-Mirror. Du kannst alles anpassen.", "Copies thesis, levels & anti-thesis — as oracle mirror. You can adjust everything.")))))
          : null);
    };

    const Hero = (sub) => h("div", { className: "hero" },
      h(PyEyebrow, null, T("Orakel · Aktive Jagd", "Oracle · Active Hunt")),
      h("h1", { className: "htitle" }, T("Die Shortlist.", "The Shortlist.")),
      h("p", { className: "hlead" }, T("Was das Orakel gerade jagt — offengelegt. Jede Position mit These, Marken und live-Score. Kein Rauschen, nur die Kandidaten, die es durch die Prüfung geschafft haben.", "What the oracle is hunting right now — in the open. Every position with thesis, levels and a live score. No noise, only the candidates that cleared the screen.")),
      sub);

    const page = (inner) => h("div", { id: "sl-root" }, h(SiteNav, { active: "shortlist.html" }), h("div", { className: "wrap" }, inner),
      h("div", { className: "disc" }, h("p", null, T("Die Shortlist ist Markt-Beobachtung, keine Anlageberatung. Marken und Score können sich jederzeit ändern. Du handelst eigenverantwortlich.", "The shortlist is market observation, not investment advice. Levels and score can change at any time. You trade on your own responsibility."))),
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
