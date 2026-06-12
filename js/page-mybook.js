(() => {
  const { Button } = window.PYTHAIDesignSystem_df6467;
  const { SiteNav, SiteFooter, PySection, PyEyebrow } = window;
  const T = (de, en) => window.PYi18n.t(de, en);
  const API = "https://api.pythai.ch";
  const { useState, useEffect } = React;
  const h = React.createElement;
  const PRIV = ["syndicate", "admin"];
  const MAX = 12;
  const Z = ["#C4524C", "#CF7A4E", "#C9A24E", "#6FB07A", "#6FCF9A"];
  const ZONE = ["GEBROCHEN", "WACKELT", "NEUTRAL", "INTAKT", "STARK"];
  const wpct = (s) => Math.max(3, Math.min(97, Math.round((s + 1) / 2 * 100)));
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
  #mb-root .dgrid{display:grid;grid-template-columns:var(--cols);gap:var(--cgap);align-items:start;}
  #mb-root .dcol-these{grid-column:3 / 5;grid-row:1;min-width:0;}
  #mb-root .dcol-act{grid-column:5 / 6;grid-row:1;justify-self:end;align-self:start;display:flex;flex-direction:column;gap:12px;width:100%;}
  #mb-root .tlbl{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--oracle);margin:18px 0 8px;} #mb-root .dcol-these .tlbl:first-child{margin-top:0;}
  #mb-root .these{font-family:var(--font-ui);font-size:15px;line-height:1.6;color:var(--parch);margin:0;max-width:64ch;}
  #mb-root .kill{font-family:var(--font-mono);font-size:13.5px;line-height:1.55;color:var(--ox-b);margin:0;} #mb-root .kill b{color:#F0A39C;font-weight:700;}
  #mb-root .bline{font-family:var(--font-ui);font-size:12.5px;font-weight:600;border:1px solid rgba(212,169,78,.5);border-radius:8px;padding:11px 14px;cursor:pointer;background:rgba(212,169,78,.08);color:var(--oracle-b);text-align:center;white-space:nowrap;}
  #mb-root .bdel{font-family:var(--font-ui);font-size:12.5px;font-weight:600;border:1px solid rgba(224,114,107,.45);border-radius:8px;padding:11px 14px;cursor:pointer;background:transparent;color:var(--ox-b);text-align:center;white-space:nowrap;} #mb-root .bdel:hover{background:rgba(224,114,107,.1);}
  #mb-root .add{border:1px dashed var(--border-strong);border-radius:12px;background:rgba(212,169,78,.03);padding:30px;margin-top:26px;text-align:center;}
  #mb-root .addt{font-family:var(--font-oracle);font-style:italic;font-size:21px;color:var(--parch);}
  #mb-root .adds{font-family:var(--font-ui);font-size:13px;line-height:1.6;color:var(--mist);margin:8px auto 16px;max-width:64ch;}
  #mb-root .addcnt{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);margin-top:16px;}
  #mb-root .addfull{display:none;font-family:var(--font-mono);font-size:12px;line-height:1.5;color:var(--ox-b);margin-top:14px;} #mb-root .addfull b{color:#F0A39C;}
  #mb-root .add.full .addbtns{opacity:.35;pointer-events:none;} #mb-root .add.full .addcnt{display:none;} #mb-root .add.full .addfull{display:block;} #mb-root .add.full{border-color:rgba(224,114,107,.4);}
  #mb-root .disc{border:1px solid var(--line);border-left:3px solid #8A6526;border-radius:8px;background:var(--card);padding:14px 16px;margin-top:28px;}
  #mb-root .disc .tlbl{margin:0 0 5px;} #mb-root .disc p{font-family:var(--font-ui);font-size:12px;line-height:1.6;color:var(--mist);margin:0;max-width:none;}
  #mb-root .ov2{position:fixed;inset:0;background:rgba(4,5,8,.8);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px;z-index:200;}
  #mb-root .modal{max-width:440px;width:100%;background:var(--raised);border:1px solid var(--border-oracle);border-radius:12px;padding:26px;}
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
    return h("div", { className: "mini" },
      h("div", { className: "mk-row" }, h("span", { className: "arrow", style: { left: wpct(p.score) + "%" } }, "▼")),
      h("div", { className: "bar" }, Z.map((c, i) => h("span", { key: i, style: { background: c } }))),
      h("div", { className: "lab", style: { color: Z[p.zone - 1] } }, statusText(p)));
  }

  function Marks({ p, editing, onField }) {
    const rows = [["Entry", "entry", ""], ["Stop", "stop", "stop"], ["Skim", "skim", "skim"], ["Target", "target", "tgt"]];
    return h("div", { className: "mks" }, rows.map((r) =>
      h("div", { key: r[1], className: "mk " + r[2] },
        h("span", { className: "k" }, r[0]),
        editing ? h("input", { className: "vin", value: p[r[1]], onChange: (e) => onField(p.id, r[1], e.target.value), onClick: (e) => e.stopPropagation() })
                : h("span", { className: "v" }, p[r[1]]))));
  }

  function App() {
    const [gate, setGate] = useState("loading");
    const [rows, setRows] = useState(SEED);
    const [open, setOpen] = useState("rhm");
    const [editId, setEditId] = useState(null);
    const [monModal, setMonModal] = useState(null);
    const [monCh, setMonCh] = useState("mail");
    const [delId, setDelId] = useState(null);
    const [summary, setSummary] = useState(true);

    useEffect(() => {
      fetch(API + "/api/me", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((d) => {
        if (d && d.onboardingRequired) { window.location.href = "account.html"; return; }
        const ok = d && d.ok && PRIV.indexOf(d.tier) !== -1 && d.approval === "approved";
        setGate(ok ? "ok" : "locked");
      }).catch(() => setGate("locked"));
    }, []);
    useEffect(() => { if (gate === "ok") injectCSS(); }, [gate]);

    if (gate === "loading") return h("div", null, h(SiteNav, { active: "" }), h("div", { style: { minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 22, color: "var(--text-oracle)" } }, T("Das Orakel prüft deinen Zugang…", "The oracle checks your access…")), h(SiteFooter, null));
    if (gate === "locked") return h("div", null, h(SiteNav, { active: "" }), h("section", { style: { minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" } }, h("div", { style: { maxWidth: 480 } }, h(PyEyebrow, null, "Syndicate"), h("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 44, margin: "8px 0 0", color: "var(--text-primary)" } }, T("My Book lebt im Syndicate.", "My Book lives in the Syndicate.")), h("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", margin: "16px 0 28px" } }, T("Dein persönliches Thesen-Buch — Trades tracken, These beobachten, Alerts setzen — ist dem Syndicate vorbehalten.", "Your personal thesis book — track trades, watch the thesis, set alerts — is reserved for the Syndicate.")), h(Button, { variant: "oracle", onClick: () => { window.location.href = "account.html"; } }, T("Zum Account", "Go to account")))), h(SiteFooter, null));

    const setField = (id, k, v) => setRows((rs) => rs.map((r) => r.id === id ? Object.assign({}, r, { [k]: v }) : r));
    const setMon = (id, on, channel) => setRows((rs) => rs.map((r) => r.id === id ? Object.assign({}, r, { monitored: on, channel: on ? (channel === "both" ? "SMS + Mail" : channel === "sms" ? "SMS" : "Mail") : null }) : r));
    const toggleMon = (p) => { if (p.monitored) setMon(p.id, false); else { setMonCh("mail"); setMonModal(p.id); } };
    const confirmMon = () => { setMon(monModal, true, monCh); setMonModal(null); };
    const toggleEdit = (id) => setEditId((e) => e === id ? null : id);
    const doDelete = () => { setRows((rs) => rs.filter((r) => r.id !== delId)); setDelId(null); };
    const count = rows.length;
    const delName = (rows.find((r) => r.id === delId) || {}).name || "Dieses Topic";

    const Topic = (p) => {
      const isOpen = open === p.id, isEdit = editId === p.id;
      return h("div", { key: p.id, className: "topic" + (isOpen ? " open" : "") },
        h("div", { className: "orow", onClick: () => setOpen(isOpen ? null : p.id) },
          h("div", { className: "c-mon" }, h("span", { className: "mon-lbl" }, T("Beobachten", "Monitor")), h("button", { className: "sw " + (p.monitored ? "on" : "off"), onClick: (e) => { e.stopPropagation(); toggleMon(p); } }, h("span", { className: "knob" }))),
          h("div", { className: "c-topic" }, h("div", { className: "nm" }, p.name), h("div", { className: "t-meta" }, h("span", { className: "badge idx" }, p.idx), h("span", { className: "badge long" }, p.art), h("span", { className: "isin" }, p.isin + " · " + p.live))),
          h("div", { className: "c-stat" }, h(Mini, { p })),
          h("div", { className: "c-trig" }, h(Marks, { p, editing: isEdit, onField: setField })),
          h("div", { className: "c-act" },
            h("span", { className: "det" }, isOpen ? T("Schließen ▴", "Close ▴") : T("Details ▾", "Details ▾")),
            h("button", { className: "bedit" + (isEdit ? " saving" : ""), onClick: (e) => { e.stopPropagation(); toggleEdit(p.id); } }, isEdit ? T("Speichern ✓", "Save ✓") : T("Bearbeiten ✎", "Edit ✎")))),
        isOpen ? h("div", { className: "dpanel" }, h("div", { className: "dwrap" }, h("div", { className: "dgrid" },
          h("div", { className: "dcol-act" },
            h("button", { className: "bline" }, T("Chart-Analyse per Mail", "Chart analysis by mail")),
            h("button", { className: "bdel", onClick: () => setDelId(p.id) }, T("Topic löschen", "Delete topic"))),
          h("div", { className: "dcol-these" },
            h("div", { className: "tlbl", style: { color: "var(--ox-b)" } }, T("Anti-These", "Anti-thesis")),
            h("div", { className: "kill" }, h("b", null, T("Kippt bei: ", "Breaks on: ")), p.kill),
            h("div", { className: "tlbl" }, T("Deine These", "Your thesis")),
            h("div", { className: "these" }, p.these))))) : null);
    };

    return h("div", { id: "mb-root" },
      h(SiteNav, { active: "" }),
      h(MyBookHero),
      h(PySection, null,
        h("div", { className: "toolbar" },
          h(PyEyebrow, null, T("Überblick · ", "Overview · ") + count + "/" + MAX + " Topics"),
          h("label", { className: "rep" }, h("button", { className: "sw " + (summary ? "on" : "off"), onClick: () => setSummary(!summary) }, h("span", { className: "knob" })), T("Tägliche My-Book-Summary", "Daily My-Book summary"))),
        h("h2", { className: "mb" }, T("Deine Topics auf einen Blick.", "Your topics at a glance.")),
        h("div", { className: "list" },
          h("div", { className: "hdr" },
            h("span", { className: "hc c-mon" }, T("Beobachten", "Monitor")),
            h("span", { className: "hc c-topic" }, "Topic"),
            h("span", { className: "hc c-stat" }, T("These-Status", "Thesis status")),
            h("span", { className: "hc c-trig" }, "My Trigger"),
            h("span", { className: "hc c-act" })),
          rows.map(Topic)),
        h("div", { className: "add" + (count >= MAX ? " full" : "") },
          h("div", { className: "addt" }, T("Neues Topic?", "New topic?")),
          h("div", { className: "adds" }, T("Lade einen Screenshot oder ein PDF hoch — Warren liest die Kurs-Marken aus und fragt nach deiner These. Die Datei wird nicht gespeichert: du bestätigst nur die ausgelesenen Marken. Oder trag alles selbst ein.", "Upload a screenshot or PDF — Warren reads the price levels and asks for your thesis. The file is not stored: you only confirm the extracted levels. Or enter everything yourself.")),
          h("div", { className: "addbtns", style: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" } },
            h(Button, { variant: "oracle" }, T("Datei hochladen", "Upload file")),
            h(Button, { variant: "ghost" }, T("Manuell eintragen", "Enter manually"))),
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
      delId ? h("div", { className: "ov2", onClick: () => setDelId(null) },
        h("div", { className: "modal", style: { borderColor: "rgba(224,114,107,.45)" }, onClick: (e) => e.stopPropagation() },
          h("h3", { style: { color: "var(--ox-b)" } }, T("Topic löschen?", "Delete topic?")),
          h("p", null, h("b", { style: { color: "var(--parch)" } }, delName), " ", T("wird endgültig aus deinem Book entfernt — These, Marken und Beobachtung. Das lässt sich nicht rückgängig machen.", "will be permanently removed from your book — thesis, levels and monitoring. This cannot be undone.")),
          h("div", { className: "mrow" },
            h(Button, { variant: "ghost", size: "sm", onClick: () => setDelId(null) }, T("Abbrechen", "Cancel")),
            h("button", { className: "bdel", style: { padding: "9px 16px" }, onClick: doDelete }, T("Endgültig löschen", "Delete permanently"))))) : null,
      h(SiteFooter, null));
  }

  const root = document.getElementById("root");
  if (root) ReactDOM.createRoot(root).render(h(App));
})();
