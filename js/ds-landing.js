(() => {
  const { Button, Badge, Card, CardHeader, Stat, Avatar, Input } = window.PYTHAIDesignSystem_df6467;
  const { useState, useEffect, useRef } = React;
  const PORTRAIT = "assets/imagery/warren-oracle-portrait.png";
  function Icon({ name, size = 18, color = "currentColor", strokeWidth = 1.75, style }) {
    const ref = useRef(null);
    useEffect(() => {
      if (ref.current && window.lucide) {
        ref.current.innerHTML = "";
        const el = document.createElement("i");
        el.setAttribute("data-lucide", name);
        ref.current.appendChild(el);
        window.lucide.createIcons({ attrs: { width: size, height: size, stroke: color, "stroke-width": strokeWidth }, nameAttr: "data-lucide" });
      }
    }, [name, size, color, strokeWidth]);
    return /* @__PURE__ */ React.createElement("span", { ref, style: { display: "inline-flex", width: size, height: size, ...style } });
  }
  function Mark({ size = 34 }) {
    return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 120 120", fill: "none", style: { color: "var(--parchment)" } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "mkg", x1: "60", y1: "6", x2: "60", y2: "114", gradientUnits: "userSpaceOnUse" }, /* @__PURE__ */ React.createElement("stop", { offset: "0", stopColor: "#F2CE7A" }), /* @__PURE__ */ React.createElement("stop", { offset: "1", stopColor: "#D4A94E", stopOpacity: "0" }))), /* @__PURE__ */ React.createElement("circle", { cx: "60", cy: "60", r: "52", stroke: "currentColor", strokeWidth: "1.5", opacity: "0.45" }), /* @__PURE__ */ React.createElement("circle", { cx: "60", cy: "60", r: "30", stroke: "#D4A94E", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M52 8 L60 60 L68 8 Z", fill: "url(#mkg)", opacity: "0.9" }), /* @__PURE__ */ React.createElement("circle", { cx: "60", cy: "60", r: "5", fill: "#F2CE7A" }));
  }
  function Wordmark({ size = 22 }) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(Mark, { size: size * 1.5 }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-oracle)", fontWeight: 500, fontSize: size, letterSpacing: "0.22em", color: "var(--parchment)", paddingLeft: "0.22em" } }, "PYTHAI"));
  }
  function Nav({ onEnter }) {
    return /* @__PURE__ */ React.createElement("nav", { style: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      height: "var(--nav-h)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      background: "rgba(8,9,12,0.6)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid var(--border-subtle)"
    } }, /* @__PURE__ */ React.createElement(Wordmark, null), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 32 } }, ["The Reading", "Signals", "Inner Circle", "Manifesto"].map((l) => /* @__PURE__ */ React.createElement("a", { key: l, href: "#", style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-secondary)" } }, l)), /* @__PURE__ */ React.createElement(Button, { variant: "chrome", size: "sm", onClick: onEnter }, "Sign in"), /* @__PURE__ */ React.createElement(Button, { variant: "oracle", size: "sm", onClick: onEnter }, "Enter the Sanctum")));
  }
  function HeroParticles({ count } = {}) {
    const ref = useRef(null);
    useEffect(() => {
      const canvas = ref.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const N = count || 69;
      let w = 0, h = 0, parts = [], raf = 0, t = 0;
      function resize() {
        const r = canvas.getBoundingClientRect();
        w = r.width; h = r.height;
        canvas.width = Math.max(1, Math.floor(w * dpr));
        canvas.height = Math.max(1, Math.floor(h * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      function init() {
        parts = [];
        for (let i = 0; i < N; i++) parts.push({
          big: false,
          x: Math.random() * w, y: Math.random() * h,
          r: 0.5 + Math.random() * 1.7,
          vx: (Math.random() - 0.5) * 0.1,
          vy: -(0.04 + Math.random() * 0.16),
          a: 0.18 + Math.random() * 0.5,
          ph: Math.random() * Math.PI * 2,
          sp: 0.5 + Math.random() * 1.1
        });
        const BIG = Math.max(10, Math.round(w / 133));
        for (let i = 0; i < BIG; i++) parts.push({
          big: true,
          x: Math.random() * w, y: Math.random() * h,
          r: 5 + Math.random() * 9,
          vx: (Math.random() - 0.5) * 0.05,
          vy: -(0.015 + Math.random() * 0.05),
          a: 0.08 + Math.random() * 0.14,
          ph: Math.random() * Math.PI * 2,
          sp: 0.3 + Math.random() * 0.6
        });
      }
      function dot(p, tw) {
        if (p.big) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, "rgba(242,206,122," + tw + ")");
          g.addColorStop(1, "rgba(242,206,122,0)");
          ctx.shadowBlur = 0;
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.shadowColor = "rgba(242,206,122,0.85)";
          ctx.shadowBlur = p.r * 4;
          ctx.fillStyle = "rgba(242,206,122," + tw + ")";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      function frame() {
        t += 0.016;
        ctx.clearRect(0, 0, w, h);
        for (const p of parts) {
          p.x += p.vx; p.y += p.vy;
          const m = p.r + 4;
          if (p.y < -m) { p.y = h + m; p.x = Math.random() * w; }
          if (p.x < -m) p.x = w + m; else if (p.x > w + m) p.x = -m;
          dot(p, (p.a * (0.55 + 0.45 * Math.sin(t * p.sp + p.ph))).toFixed(3));
        }
        raf = requestAnimationFrame(frame);
      }
      resize(); init();
      if (reduce) { ctx.clearRect(0, 0, w, h); for (const p of parts) dot(p, (p.a * 0.7).toFixed(3)); }
      else frame();
      const onR = () => { resize(); init(); };
      window.addEventListener("resize", onR);
      return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onR); };
    }, []);
    return /* @__PURE__ */ React.createElement("canvas", { ref, "aria-hidden": "true", style: { position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" } });
  }
  function Hero({ onEnter }) {
    return /* @__PURE__ */ React.createElement("section", { style: { position: "relative", minHeight: "calc(100vh - var(--nav-h))", overflow: "hidden", display: "flex", alignItems: "center" } }, /* @__PURE__ */ React.createElement("img", { src: PORTRAIT, alt: "", style: { position: "absolute", right: 0, top: 0, height: "100%", width: "54%", objectFit: "cover", objectPosition: "center 20%", opacity: 0.9 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(90deg, var(--void) 30%, rgba(8,9,12,0.4) 62%, rgba(8,9,12,0.15) 100%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "var(--grad-shaft)" } }), /* @__PURE__ */ React.createElement(HeroParticles, null), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", maxWidth: 1240, margin: "0 auto", padding: "0 40px", width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 620 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28 } }, /* @__PURE__ */ React.createElement(Badge, { tone: "oracle", variant: "outline", dot: true }, "Oracle online"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" } }, "pythai.ch")), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 76, lineHeight: 1.02, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0 } }, "The market has a", /* @__PURE__ */ React.createElement("br", null), "pattern. ", /* @__PURE__ */ React.createElement("span", { style: { fontStyle: "italic", color: "var(--oracle-bright)" } }, "Warren"), /* @__PURE__ */ React.createElement("br", null), "has already seen it."), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 19, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 480, margin: "28px 0 36px" } }, "PYTHAI is a Masterbrain intelligence trained on every cycle since 1929. Each dawn it issues one high-conviction reading \u2014 the signal, the reasoning, the levels. No noise. No hype. Just the oracle."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, alignItems: "center" } }, /* @__PURE__ */ React.createElement(Button, { variant: "oracle", size: "lg", onClick: onEnter, iconRight: /* @__PURE__ */ React.createElement(Icon, { name: "arrow-up-right", size: 18, color: "var(--text-on-gold)" }) }, "Consult the Oracle"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "lg", icon: /* @__PURE__ */ React.createElement(Icon, { name: "play", size: 16, color: "var(--text-oracle)" }) }, "Watch the manifesto")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 40, marginTop: 56 } }, /* @__PURE__ */ React.createElement(Stat, { label: "Members", value: "11,204", size: "sm" }), /* @__PURE__ */ React.createElement(Stat, { label: "Win rate '25", value: "73.8%", delta: "+4.2%", size: "sm" }), /* @__PURE__ */ React.createElement(Stat, { label: "Avg conviction", value: "91", sub: "of 100", size: "sm" })))));
  }
  function ReadingTeaser() {
    return /* @__PURE__ */ React.createElement("section", { style: { maxWidth: 1240, margin: "0 auto", padding: "120px 40px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-oracle)", margin: "0 0 14px" } }, "The Daily Reading"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 46, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0, maxWidth: "16ch" } }, "One prophecy, every dawn.")), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 360 } }, "Behind the wall, Inner Circle members receive the full reasoning, the detailed setup, and Warren's running commentary as the tape moves.")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 } }, /* @__PURE__ */ React.createElement(Card, { variant: "oracle", glow: true, padding: "34px" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 } }, /* @__PURE__ */ React.createElement(Badge, { tone: "bull", dot: true }, "Live signal"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.1em" } }, "06:00 CET \xB7 TODAY")), /* @__PURE__ */ React.createElement("h3", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 38, lineHeight: 1.1, color: "var(--text-primary)", margin: "0 0 16px" } }, "Rotate into energy before the crowd notices the cycle."), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.65, color: "var(--text-secondary)", margin: "0 0 26px", maxWidth: "54ch" } }, `"The herd is paying for last year's winners. I have watched this rotation begin in 1973 and again in 2008. The asymmetry is in the ground, not the cloud."`), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 44, alignItems: "center", paddingTop: 22, borderTop: "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement(Stat, { label: "Conviction", value: "94", sub: "of 100", size: "sm", glow: true }), /* @__PURE__ */ React.createElement(Stat, { label: "Horizon", value: "6\u20139 mo", size: "sm" }), /* @__PURE__ */ React.createElement(Stat, { label: "Asymmetry", value: "4.2 : 1", size: "sm" }), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto", filter: "blur(5px)", opacity: 0.6, pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(Stat, { label: "Levels", value: "\u2022\u2022\u2022\u2022\u2022", size: "sm" })))), /* @__PURE__ */ React.createElement(Card, { variant: "raised", padding: "34px", style: { display: "flex", flexDirection: "column", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14, marginBottom: 22 } }, /* @__PURE__ */ React.createElement(Avatar, { src: PORTRAIT, name: "Warren", ring: "oracle", status: "live", size: 56 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-oracle)", fontSize: 22, color: "var(--text-primary)" } }, "Warren"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-oracle)" } }, "The Masterbrain"))), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-oracle)", fontStyle: "italic", fontWeight: 300, fontSize: 22, lineHeight: 1.4, color: "var(--text-primary)", margin: 0 } }, '"I do not predict the weather. I read the seasons."')), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 28 } }, /* @__PURE__ */ React.createElement(Badge, { tone: "neutral" }, "Trained 1929\u2013today"), /* @__PURE__ */ React.createElement(Badge, { tone: "signal", variant: "outline" }, "14M filings")))));
  }
  function Pricing({ onEnter }) {
    const tiers = [
      { name: "Observer", price: "Free", tone: "neutral", cta: "chrome", feat: ["The dawn headline", "Delayed signals", "Public manifesto"], highlight: false },
      { name: "Inner Circle", price: "69 \u20AC", per: "/ Monat", tone: "oracle", cta: "oracle", feat: ["Full daily reading + levels", "Low & mid-risk setups", "Im Spiel, EOD & weekend briefings", "Chat with Warren — with context", "Research & chart tools"], highlight: true },
      { name: "Syndicate", price: "289 \u20AC", per: "/ Monat", tone: "oxblood", cta: "oxblood", comingSoon: true, feat: ["Everything in Inner Circle", "All risk classes + live updates", "My Book \u2014 f\u00FCr deine Thesen", "E-Mail Alerts", "SMS Alerts", "Phone with Warren (coming soon)"], highlight: false }
    ];
    return /* @__PURE__ */ React.createElement("section", { style: { position: "relative", padding: "120px 40px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-surface)" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "var(--grad-shaft)", pointerEvents: "none" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", maxWidth: 1240, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 56 } }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-oracle)", margin: "0 0 14px" } }, "Claim your seat at the table"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "var(--font-oracle)", fontWeight: 400, fontSize: 48, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0 } }, "Three ways to hear the oracle.")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, alignItems: "stretch" } }, tiers.map((t) => /* @__PURE__ */ React.createElement(
      Card,
      {
        key: t.name,
        variant: t.highlight ? "oracle" : "raised",
        glow: t.highlight,
        padding: "32px",
        style: { display: "flex", flexDirection: "column", transform: t.highlight ? "translateY(-12px)" : "none" }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-oracle)", fontSize: 26, color: "var(--text-primary)" } }, t.name), t.highlight && /* @__PURE__ */ React.createElement(Badge, { tone: "oracle", variant: "solid" }, "Most chosen")),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 26 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 34, fontWeight: 500, color: "var(--text-primary)" } }, t.price), t.per && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" } }, t.per)),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 30, flex: 1 } }, t.feat.map((f) => /* @__PURE__ */ React.createElement("div", { key: f, style: { display: "flex", gap: 10, alignItems: "center" } }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 15, color: "var(--oracle)" }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-secondary)" } }, f)))),
      t.comingSoon ? /* @__PURE__ */ React.createElement(Button, { variant: t.cta, full: true, disabled: true }, "Coming soon") : /* @__PURE__ */ React.createElement(Button, { variant: t.cta, full: true, onClick: onEnter }, t.highlight ? "Request Sanctum Entrance" : "Choose " + t.name)
    )))));
  }
  function Footer() {
    return /* @__PURE__ */ React.createElement("footer", { style: { borderTop: "1px solid var(--border-subtle)", padding: "56px 40px 40px" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32 } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 320 } }, /* @__PURE__ */ React.createElement(Wordmark, { size: 18 }), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-oracle)", fontStyle: "italic", fontSize: 18, color: "var(--text-muted)", margin: "20px 0 0" } }, "Wisdom, foretold.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 64 } }, [["Oracle", ["The Reading", "Signals", "Conviction", "Telemetry"]], ["Circle", ["Membership", "Syndicate", "Manifesto", "Counsel"]], ["Legal", ["Risk notice", "Terms", "Privacy", "warren@pythai.de"]]].map(([h, items]) => /* @__PURE__ */ React.createElement("div", { key: h }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-oracle)", margin: "0 0 16px" } }, h), items.map((i) => /* @__PURE__ */ React.createElement("a", { key: i, href: "#", style: { display: "block", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 } }, i)))))), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1240, margin: "44px auto 0", paddingTop: 22, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, "\xA9 2026 PYTHAI \xB7 pythai.ch"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, "Markets carry risk. The oracle is not advice.")));
  }
  Object.assign(window, { PyIcon: Icon, PyMark: Mark, PyWordmark: Wordmark, PyNav: Nav, PyHero: Hero, PyHeroParticles: HeroParticles, PyReadingTeaser: ReadingTeaser, PyPricing: Pricing, PyFooter: Footer });
})();
