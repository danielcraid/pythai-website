/* @ds-bundle: {"format":3,"namespace":"PYTHAIDesignSystem_df6467","components":[{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"CardHeader","sourcePath":"components/data-display/Card.jsx"},{"name":"Stat","sourcePath":"components/data-display/Stat.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"BrandIndex.jsx":"a2f174dc9569","components/data-display/Avatar.jsx":"f62b4ecbeb0a","components/data-display/Badge.jsx":"c51d17e1c818","components/data-display/Card.jsx":"5c431c18e767","components/data-display/Stat.jsx":"cea96e7bbaa0","components/forms/Button.jsx":"eb759ba6d607","components/forms/Input.jsx":"18e744a1b1aa","components/forms/Switch.jsx":"cb2436accf72","components/navigation/Tabs.jsx":"663d36b8ac45","ui_kits/marketing/Landing.jsx":"d84dcce45959","ui_kits/sanctum-mobile/Mobile.jsx":"f8aa64b0e768","ui_kits/sanctum-mobile/ios-frame.jsx":"be3343be4b51","ui_kits/sanctum/Shell.jsx":"197ead09ab20","ui_kits/sanctum/Views.jsx":"a8b52a9d052b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PYTHAIDesignSystem_df6467 = window.PYTHAIDesignSystem_df6467 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// BrandIndex.jsx
try { (() => {
// PYTHAI — Brand index. Every brand element, placed. Composes the DS components.
const {
  Button: B,
  Badge: BD,
  Card: C,
  CardHeader: CH,
  Stat: ST,
  Avatar: AV,
  Input: IN,
  Switch: SW,
  Tabs: TB
} = window.PYTHAIDesignSystem_df6467;
const {
  useState: uS,
  useEffect: uE,
  useRef: uR
} = React;
const PORTRAIT = 'assets/imagery/warren-oracle-portrait.png';
const SANCTUM = 'assets/imagery/sanctum-lightshaft.png';
const BOARD = 'assets/imagery/sanctum-boardroom.png';
function I({
  name,
  size = 18,
  color = 'currentColor',
  sw = 1.75,
  style
}) {
  const ref = uR(null);
  uE(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '<i data-lucide="' + name + '"></i>';
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          stroke: color,
          'stroke-width': sw
        }
      });
    }
  }, [name, size, color, sw]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      ...style
    }
  });
}
function Mark({
  size = 64
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 120 120",
    fill: "none",
    style: {
      color: 'var(--parchment)'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "bi",
    x1: "60",
    y1: "6",
    x2: "60",
    y2: "114",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#F2CE7A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#D4A94E",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "52",
    stroke: "currentColor",
    strokeWidth: "1.5",
    opacity: "0.45"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "30",
    stroke: "#D4A94E",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M52 8 L60 60 L68 8 Z",
    fill: "url(#bi)",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "5",
    fill: "#F2CE7A"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "60",
    x2: "22",
    y2: "60",
    stroke: "currentColor",
    strokeWidth: "1.5",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "98",
    y1: "60",
    x2: "112",
    y2: "60",
    stroke: "currentColor",
    strokeWidth: "1.5",
    opacity: "0.5"
  }));
}
const WRAP = {
  maxWidth: 1180,
  margin: '0 auto',
  padding: '0 40px'
};
const EY = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--text-oracle)',
  margin: 0
};
const H2 = {
  fontFamily: 'var(--font-oracle)',
  fontWeight: 400,
  fontSize: 40,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
  margin: '12px 0 0'
};
function Section({
  id,
  eyebrow,
  title,
  children,
  intro
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    style: {
      padding: '88px 0',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement("p", {
    style: EY
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: H2
  }, title), intro && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 16,
      lineHeight: 1.65,
      color: 'var(--text-secondary)',
      maxWidth: '60ch',
      margin: '18px 0 0'
    }
  }, intro), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, children)));
}

// ---------- HERO ----------
function Hero() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'relative',
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: SANCTUM,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(120% 90% at 50% 0%, rgba(8,9,12,0.5), var(--void) 75%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--grad-shaft)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...WRAP,
      position: 'relative',
      textAlign: 'center',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    size: 88
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      ...EY,
      marginBottom: 22
    }
  }, "PYTHAI \xB7 Design System"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 500,
      fontSize: 92,
      letterSpacing: '0.2em',
      color: 'var(--parchment)',
      margin: 0,
      paddingLeft: '0.2em'
    }
  }, "PYTHAI"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontStyle: 'italic',
      fontWeight: 300,
      fontSize: 26,
      color: 'var(--text-secondary)',
      margin: '14px 0 0'
    }
  }, "Wisdom, foretold."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      justifyContent: 'center',
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.1em',
      color: 'var(--text-muted)'
    }
  }, "pythai.ch"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.1em',
      color: 'var(--text-muted)'
    }
  }, "warren@pythai.de"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)'
    }
  }, /*#__PURE__*/React.createElement(I, {
    name: "chevrons-down",
    size: 22,
    color: "var(--text-muted)"
  })));
}

// ---------- THE WORLD ----------
function World() {
  return /*#__PURE__*/React.createElement(Section, {
    eyebrow: "The world",
    title: "The Oracle's Sanctum"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      minHeight: 300
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PORTRAIT,
    alt: "Warren",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 15%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, transparent 50%, rgba(8,9,12,0.85))'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 20,
      bottom: 16,
      ...EY
    }
  }, "Warren \xB7 the Masterbrain")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      flex: 1,
      minHeight: 138
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: BOARD,
    alt: "Sanctum",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, transparent 50%, rgba(8,9,12,0.8))'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 20,
      bottom: 14,
      ...EY
    }
  }, "The Sanctum \xB7 oculus light")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, "Cold brutalist concrete pierced by warm oracular gold. Old-money oxblood and leather, fused with cybernetic chrome. PYTHAI reimagines the Oracle of Delphi as an \xFCber-intelligent financial mind \u2014 Warren, who has watched every cycle and is mildly amused by your panic. Not cyberpunk neon. ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-oracle)'
    }
  }, "Warm, expensive, uncanny prophecy.")))));
}

// ---------- LOGO ----------
function LogoSection() {
  const Box = ({
    children,
    label,
    bg
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 160,
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, children), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label));
  return /*#__PURE__*/React.createElement(Section, {
    eyebrow: "Identity",
    title: "The oculus mark",
    intro: "A dome aperture with a descending shaft of light \u2014 the eye of the sanctum, a nod to Pythia. The mark holds the gold; the wordmark is set in Cormorant with inscriptional tracking."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Box, {
    label: "Primary mark",
    bg: "var(--bg-surface)"
  }, /*#__PURE__*/React.createElement(Mark, {
    size: 84
  })), /*#__PURE__*/React.createElement(Box, {
    label: "Lockup \u2014 horizontal",
    bg: "var(--bg-raised)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    size: 52
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 500,
      fontSize: 34,
      letterSpacing: '0.22em',
      color: 'var(--parchment)',
      paddingLeft: '0.22em'
    }
  }, "PYTHAI"))), /*#__PURE__*/React.createElement(Box, {
    label: "On oracle gold",
    bg: "var(--grad-gold)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-on-gold)'
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    size: 84
  })))));
}

// ---------- COLOR ----------
function Swatch({
  v,
  name,
  hex,
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 76,
      borderRadius: 'var(--radius-md)',
      background: v,
      border: '1px solid var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      color: 'var(--text-primary)',
      marginTop: 8
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, hex));
}
function ColorSection() {
  return /*#__PURE__*/React.createElement(Section, {
    eyebrow: "Color",
    title: "Cold concrete, oracular gold",
    intro: "A cool neutral spine, the signature Oracle Gold used like light entering a dark room, old-money oxblood, cybernetic chrome, and sophisticated market semantics."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 26
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      ...EY,
      marginBottom: 14
    }
  }, "Concrete & Void"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--void)",
    name: "Void",
    hex: "#08090C"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--graphite)",
    name: "Graphite",
    hex: "#15181E"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--concrete)",
    name: "Concrete",
    hex: "#2A2F39"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--steel)",
    name: "Steel",
    hex: "#7C8492"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--mist)",
    name: "Mist",
    hex: "#C3C9D4"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--parchment)",
    name: "Parchment",
    hex: "#F4F0E6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 26
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      ...EY,
      marginBottom: 14
    }
  }, "Oracle Gold \u2014 the light"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--oracle-deep)",
    name: "Deep",
    hex: "#8A6526"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--oracle)",
    name: "Oracle",
    hex: "#D4A94E"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--oracle-bright)",
    name: "Bright",
    hex: "#F2CE7A"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--oracle-pale)",
    name: "Pale",
    hex: "#F7E4B6"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      ...EY,
      marginBottom: 14
    }
  }, "Oxblood & Chrome"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--oxblood)",
    name: "Oxblood",
    hex: "#7C2A38"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--oxblood-bright)",
    name: "Bright",
    hex: "#A8414F"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--grad-chrome)",
    name: "Chrome",
    hex: "#AEB4BE"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      ...EY,
      marginBottom: 14
    }
  }, "Market semantics"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--bull)",
    name: "Bull \xB7 gain",
    hex: "#4FA578"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--bear)",
    name: "Bear \xB7 loss",
    hex: "#C4524C"
  }), /*#__PURE__*/React.createElement(Swatch, {
    v: "var(--signal)",
    name: "Signal \xB7 info",
    hex: "#5B8FB8"
  })))));
}

// ---------- TYPE ----------
function TypeSection() {
  return /*#__PURE__*/React.createElement(Section, {
    eyebrow: "Typography",
    title: "Three voices",
    intro: "Cormorant Garamond is Warren's prophetic serif. Hanken Grotesk runs the interface. JetBrains Mono is anything the machine says \u2014 data, tickers, labels."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(C, {
    variant: "flat",
    padding: "30px"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...EY,
      marginBottom: 12
    }
  }, "Oracle \xB7 Cormorant Garamond"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 400,
      fontSize: 46,
      lineHeight: 1.06,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)',
      margin: 0
    }
  }, "The crowd is wrong about energy.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(C, {
    variant: "flat",
    padding: "30px"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...EY,
      marginBottom: 12
    }
  }, "Interface \xB7 Hanken Grotesk"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontWeight: 500,
      fontSize: 18,
      lineHeight: 1.5,
      color: 'var(--text-primary)',
      margin: '0 0 8px'
    }
  }, "Warren reads every filing, then tells you the one thing that matters."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, "Members of the Inner Circle receive a daily reading \u2014 the signal, the reasoning, the levels.")), /*#__PURE__*/React.createElement(C, {
    variant: "flat",
    padding: "30px"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...EY,
      marginBottom: 12
    }
  }, "Intel \xB7 JetBrains Mono"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontVariantNumeric: 'tabular-nums',
      fontSize: 26,
      color: 'var(--text-primary)',
      marginBottom: 6
    }
  }, "$1,284,019 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--bull-bright)',
      fontSize: 14
    }
  }, "\u25B2 12.4%")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-oracle)'
    }
  }, "Today's Prophecy \xB7 Conviction 94")))));
}

// ---------- COMPONENTS ----------
function ComponentsSection() {
  const [live, setLive] = uS(true);
  const [tab, setTab] = uS('signals');
  return /*#__PURE__*/React.createElement(Section, {
    eyebrow: "Components",
    title: "The primitives",
    intro: "Buttons, badges, inputs, toggles, cards, stats, avatars, tabs \u2014 the reusable parts every PYTHAI surface is built from."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(C, {
    variant: "raised",
    padding: "28px"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...EY,
      marginBottom: 18
    }
  }, "Buttons"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(B, {
    variant: "oracle"
  }, "Consult Oracle"), /*#__PURE__*/React.createElement(B, {
    variant: "chrome"
  }, "Positions"), /*#__PURE__*/React.createElement(B, {
    variant: "ghost"
  }, "Dismiss")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(B, {
    variant: "oxblood",
    size: "sm"
  }, "Liquidate"), /*#__PURE__*/React.createElement(B, {
    variant: "oracle",
    size: "sm",
    loading: true
  }, "Reading"), /*#__PURE__*/React.createElement(B, {
    variant: "chrome",
    size: "sm",
    disabled: true
  }, "Locked"))), /*#__PURE__*/React.createElement(C, {
    variant: "raised",
    padding: "28px"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...EY,
      marginBottom: 18
    }
  }, "Badges & toggles"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(BD, {
    tone: "oracle",
    variant: "solid"
  }, "Insider"), /*#__PURE__*/React.createElement(BD, {
    tone: "bull",
    dot: true
  }, "Bullish"), /*#__PURE__*/React.createElement(BD, {
    tone: "bear",
    dot: true
  }, "Bearish"), /*#__PURE__*/React.createElement(BD, {
    tone: "signal",
    variant: "outline"
  }, "Signal")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(SW, {
    checked: live,
    onChange: setLive,
    label: "Live signals"
  }), /*#__PURE__*/React.createElement(SW, {
    checked: false,
    disabled: true,
    label: "Insider (locked)"
  }))), /*#__PURE__*/React.createElement(C, {
    variant: "raised",
    padding: "28px"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...EY,
      marginBottom: 18
    }
  }, "Inputs"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(IN, {
    label: "Oracle access",
    defaultValue: "warren@pythai.de"
  }), /*#__PURE__*/React.createElement(IN, {
    label: "Allocation",
    prefix: "$",
    suffix: "USD",
    defaultValue: "250,000"
  }))), /*#__PURE__*/React.createElement(C, {
    variant: "oracle",
    glow: true,
    padding: "28px"
  }, /*#__PURE__*/React.createElement(CH, {
    eyebrow: "Card \xB7 oracle",
    title: "Today's Prophecy",
    action: /*#__PURE__*/React.createElement(BD, {
      tone: "bull",
      dot: true
    }, "Live")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 30,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(ST, {
    label: "Conviction",
    value: "94",
    sub: "of 100",
    glow: true
  }), /*#__PURE__*/React.createElement(ST, {
    label: "Asymmetry",
    value: "4.2:1"
  }), /*#__PURE__*/React.createElement(ST, {
    label: "BTC",
    value: "64,210",
    delta: "+12.4%"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(AV, {
    src: PORTRAIT,
    name: "Warren",
    ring: "oracle",
    status: "live",
    size: 40
  }), /*#__PURE__*/React.createElement(AV, {
    name: "Dan Simon",
    size: 36
  }), /*#__PURE__*/React.createElement(AV, {
    name: "AK",
    size: 36
  })), /*#__PURE__*/React.createElement(TB, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'signals',
      label: 'Signals',
      badge: 3
    }, {
      value: 'positions',
      label: 'Positions'
    }, {
      value: 'oracle',
      label: 'Oracle'
    }]
  }))));
}

// ---------- VOICE ----------
function VoiceSection() {
  const yes = ['Prophetic', 'Specific numbers', 'Dry & certain', 'First person'];
  const no = ['No emoji', 'No exclamation', 'No hype', 'No fake urgency'];
  return /*#__PURE__*/React.createElement(Section, {
    eyebrow: "Voice",
    title: "How Warren speaks"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 32,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontStyle: 'italic',
      fontWeight: 300,
      fontSize: 34,
      lineHeight: 1.32,
      color: 'var(--text-primary)',
      margin: 0
    }
  }, "\"Markets reward the patient and starve the rest. I am very patient.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, yes.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      padding: '6px 12px',
      borderRadius: 999,
      color: 'var(--bull-bright)',
      border: '1px solid rgba(79,165,120,0.4)'
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, no.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      padding: '6px 12px',
      borderRadius: 999,
      color: 'var(--bear-bright)',
      border: '1px solid rgba(196,82,76,0.4)'
    }
  }, t))))));
}

// ---------- SURFACES ----------
function SurfacesSection() {
  const kits = [{
    href: 'ui_kits/marketing/index.html',
    img: PORTRAIT,
    ic: 'globe',
    t: 'pythai.ch',
    d: 'The public landing — cinematic oracle hero, daily reading, membership.'
  }, {
    href: 'ui_kits/sanctum/index.html',
    img: BOARD,
    ic: 'eye',
    t: 'The Sanctum',
    d: 'Logged-in members area — prophecy, live signals, allocation, Warren in counsel.'
  }, {
    href: 'ui_kits/sanctum-mobile/index.html',
    img: SANCTUM,
    ic: 'smartphone',
    t: 'Sanctum · Mobile',
    d: 'iOS app — the prophecy in your pocket, tab-bar navigation, oracle chat.'
  }];
  return /*#__PURE__*/React.createElement(Section, {
    eyebrow: "Surfaces",
    title: "Where it all comes together",
    intro: "Three live, interactive recreations built from these foundations. Click any to open."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24
    }
  }, kits.map(k => /*#__PURE__*/React.createElement("a", {
    key: k.t,
    href: k.href,
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(C, {
    variant: "raised",
    padding: "0",
    style: {
      overflow: 'hidden',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 160
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: k.img,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: 0.7
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, transparent 40%, var(--bg-raised))'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(I, {
    name: k.ic,
    size: 18,
    color: "var(--oracle-bright)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontSize: 21,
      lineHeight: 1.1,
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap'
    }
  }, k.t), /*#__PURE__*/React.createElement(I, {
    name: "arrow-up-right",
    size: 16,
    color: "var(--text-muted)",
    style: {
      marginLeft: 'auto',
      flexShrink: 0
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, k.d)))))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-subtle)',
      padding: '48px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...WRAP,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    size: 30
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 500,
      fontSize: 18,
      letterSpacing: '0.2em',
      color: 'var(--parchment)',
      paddingLeft: '0.2em'
    }
  }, "PYTHAI")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, "Design System \xB7 \xA9 2026 \xB7 pythai.ch \xB7 Markets carry risk. The oracle is not advice.")));
}
function BrandIndex() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(World, null), /*#__PURE__*/React.createElement(LogoSection, null), /*#__PURE__*/React.createElement(ColorSection, null), /*#__PURE__*/React.createElement(TypeSection, null), /*#__PURE__*/React.createElement(ComponentsSection, null), /*#__PURE__*/React.createElement(VoiceSection, null), /*#__PURE__*/React.createElement(SurfacesSection, null), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  BrandIndex
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "BrandIndex.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Avatar.jsx
try { (() => {
/**
 * PYTHAI Avatar — identity token. Image or initials in a crisp ring.
 * `oracle` ring + glow marks Warren / the intelligence itself.
 */
function Avatar({
  src,
  name = '',
  size = 44,
  ring = 'subtle',
  // 'subtle' | 'oracle' | 'none'
  status,
  // 'live' | 'away' | 'offline'
  square = false,
  style = {}
}) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const rings = {
    none: {
      border: '1px solid transparent',
      boxShadow: 'none'
    },
    subtle: {
      border: '1px solid var(--border-strong)',
      boxShadow: 'var(--shadow-inset)'
    },
    oracle: {
      border: '1.5px solid var(--oracle)',
      boxShadow: '0 0 16px -3px var(--glow-oracle)'
    }
  };
  const statusColor = {
    live: 'var(--bull)',
    away: 'var(--oracle)',
    offline: 'var(--ash)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: square ? 'var(--radius-md)' : '50%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-elevated)',
      ...rings[ring]
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontSize: size * 0.4,
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-oracle)',
      letterSpacing: '0.02em'
    }
  }, initials)), status && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: Math.max(8, size * 0.22),
      height: Math.max(8, size * 0.22),
      borderRadius: '50%',
      background: statusColor[status] || 'var(--ash)',
      border: '2px solid var(--bg-base)',
      boxShadow: status === 'live' ? '0 0 8px var(--bull)' : 'none'
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
/**
 * PYTHAI Badge — compact status / category marker.
 * tones: oracle, bull, bear, signal, neutral, oxblood.
 * variants: soft (tinted) | solid | outline.
 */
function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot = false,
  icon = null,
  style = {}
}) {
  const palette = {
    oracle: {
      fg: 'var(--oracle-bright)',
      solidBg: 'var(--oracle)',
      solidFg: 'var(--text-on-gold)',
      rgb: '212,169,78'
    },
    bull: {
      fg: 'var(--bull-bright)',
      solidBg: 'var(--bull)',
      solidFg: '#04130C',
      rgb: '79,165,120'
    },
    bear: {
      fg: 'var(--bear-bright)',
      solidBg: 'var(--bear)',
      solidFg: '#1A0605',
      rgb: '196,82,76'
    },
    signal: {
      fg: '#86B6D8',
      solidBg: 'var(--signal)',
      solidFg: '#04101A',
      rgb: '91,143,184'
    },
    oxblood: {
      fg: '#C76573',
      solidBg: 'var(--oxblood)',
      solidFg: 'var(--parchment)',
      rgb: '168,65,79'
    },
    neutral: {
      fg: 'var(--smoke)',
      solidBg: 'var(--iron)',
      solidFg: 'var(--parchment)',
      rgb: '124,132,146'
    }
  };
  const p = palette[tone] || palette.neutral;
  const sizes = {
    sm: {
      pad: '2px 7px',
      fs: 'var(--text-3xs)',
      h: 18,
      gap: 4
    },
    md: {
      pad: '3px 10px',
      fs: 'var(--text-2xs)',
      h: 22,
      gap: 5
    }
  };
  const s = sizes[size] || sizes.md;
  const styles = {
    soft: {
      background: `rgba(${p.rgb}, 0.13)`,
      color: p.fg,
      border: `1px solid rgba(${p.rgb}, 0.28)`
    },
    solid: {
      background: p.solidBg,
      color: p.solidFg,
      border: '1px solid transparent'
    },
    outline: {
      background: 'transparent',
      color: p.fg,
      border: `1px solid rgba(${p.rgb}, 0.5)`
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: s.gap,
      height: s.h,
      padding: s.pad,
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-mono)',
      fontSize: s.fs,
      fontWeight: 'var(--weight-medium)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      lineHeight: 1,
      ...styles[variant],
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: variant === 'solid' ? 'currentColor' : p.solidBg,
      boxShadow: tone !== 'neutral' ? `0 0 6px ${p.solidBg}` : 'none'
    }
  }), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 11,
      height: 11
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PYTHAI Card — a surface in the sanctum. Brutalist crisp panel with
 * subtle inset highlight; optional oracle glow + gold top-edge.
 */
function Card({
  children,
  variant = 'raised',
  // 'raised' | 'flat' | 'oracle'
  glow = false,
  padding = 'var(--space-6)',
  as: Tag = 'div',
  style = {},
  ...rest
}) {
  const variants = {
    flat: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)'
    },
    raised: {
      background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-raised) 100%)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-md), var(--shadow-inset)'
    },
    oracle: {
      background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-raised) 100%)',
      border: '1px solid var(--border-oracle)',
      boxShadow: glow ? 'var(--glow-md)' : 'var(--shadow-md), var(--shadow-inset)'
    }
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      padding,
      overflow: 'hidden',
      ...variants[variant],
      ...(glow && variant !== 'oracle' ? {
        boxShadow: 'var(--glow-lg)'
      } : {}),
      ...style
    }
  }, rest), variant === 'oracle' && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      background: 'linear-gradient(90deg, transparent, var(--oracle), transparent)'
    }
  }), children);
}

/** Optional structured header for a Card. */
function CardHeader({
  title,
  eyebrow,
  action,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 'var(--space-5)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-oracle)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-regular)',
      color: 'var(--text-primary)',
      lineHeight: 'var(--leading-snug)',
      letterSpacing: 'var(--tracking-tight)',
      margin: 0
    }
  }, title)), action && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, action));
}
Object.assign(__ds_scope, { Card, CardHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Stat.jsx
try { (() => {
/**
 * PYTHAI Stat — a market readout. Mono tabular value with a bull/bear
 * delta. The core data atom of the sanctum dashboard.
 */
function Stat({
  label,
  value,
  delta,
  // e.g. "+12.4%" or "-3.1%"
  direction,
  // 'up' | 'down' | 'flat' — inferred from delta sign if omitted
  sub,
  // small caption under value
  align = 'left',
  size = 'md',
  glow = false,
  style = {}
}) {
  let dir = direction;
  if (!dir && typeof delta === 'string') {
    dir = delta.trim().startsWith('-') ? 'down' : delta.trim().startsWith('+') ? 'up' : 'flat';
  }
  const dColor = dir === 'up' ? 'var(--bull-bright)' : dir === 'down' ? 'var(--bear-bright)' : 'var(--steel)';
  const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '—';
  const sizes = {
    sm: {
      v: 'var(--text-lg)',
      l: 'var(--text-3xs)'
    },
    md: {
      v: 'var(--text-2xl)',
      l: 'var(--text-2xs)'
    },
    lg: {
      v: 'var(--text-3xl)',
      l: 'var(--text-xs)'
    }
  };
  const s = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: s.l,
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontVariantNumeric: 'tabular-nums',
      fontFeatureSettings: "'tnum' 1",
      fontSize: s.v,
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-primary)',
      lineHeight: 1.05,
      letterSpacing: '-0.01em',
      textShadow: glow ? '0 0 24px var(--glow-oracle-soft)' : 'none'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start'
    }
  }, delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      color: dColor,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72em'
    }
  }, arrow), delta), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, sub)));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Stat.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * PYTHAI Button — the primary action control.
 * Variants: oracle (gilded primary), chrome (metal outline),
 * ghost (text), oxblood (premium/destructive-adjacent).
 */
function Button({
  children,
  variant = 'oracle',
  size = 'md',
  icon = null,
  iconRight = null,
  disabled = false,
  loading = false,
  full = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const sizes = {
    sm: {
      pad: '7px 15px',
      fs: '0.875rem',
      gap: 6,
      h: 34,
      icon: 15
    },
    md: {
      pad: '10px 22px',
      fs: '1rem',
      gap: 8,
      h: 45,
      icon: 17
    },
    lg: {
      pad: '15px 32px',
      fs: '1.1875rem',
      gap: 10,
      h: 56,
      icon: 20
    }
  };
  const s = sizes[size] || sizes.md;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.h,
    padding: s.pad,
    width: full ? '100%' : 'auto',
    fontFamily: 'var(--font-ui)',
    fontSize: s.fs,
    fontWeight: 'var(--weight-semibold)',
    letterSpacing: '0.02em',
    lineHeight: 1,
    border: '1px solid transparent',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'all var(--dur-fast) var(--ease-oracle)',
    transform: press && !disabled ? 'translateY(0.5px) scale(0.99)' : 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    position: 'relative'
  };
  const variants = {
    oracle: {
      background: hover && !disabled ? 'var(--oracle-bright)' : 'var(--grad-gold)',
      color: 'var(--text-on-gold)',
      borderColor: 'var(--oracle)',
      boxShadow: hover && !disabled ? '0 0 24px -4px var(--glow-oracle), inset 0 1px 0 rgba(255,255,255,0.3)' : 'inset 0 1px 0 rgba(255,255,255,0.25)'
    },
    chrome: {
      background: hover && !disabled ? 'var(--bg-elevated)' : 'transparent',
      color: 'var(--text-primary)',
      borderColor: hover && !disabled ? 'var(--steel)' : 'var(--border-strong)'
    },
    ghost: {
      background: hover && !disabled ? 'rgba(212,169,78,0.08)' : 'transparent',
      color: hover && !disabled ? 'var(--text-oracle)' : 'var(--text-secondary)',
      borderColor: 'transparent'
    },
    oxblood: {
      background: hover && !disabled ? 'var(--oxblood-bright)' : 'var(--oxblood)',
      color: 'var(--parchment)',
      borderColor: 'var(--oxblood-bright)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled || loading,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), loading && /*#__PURE__*/React.createElement(Spinner, {
    size: s.icon
  }), !loading && icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: s.icon,
      height: s.icon
    }
  }, icon), children && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: loading ? 0.6 : 1
    }
  }, children), !loading && iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: s.icon,
      height: s.icon
    }
  }, iconRight));
}
function Spinner({
  size = 16
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'py-spin 0.7s linear infinite'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes py-spin{to{transform:rotate(360deg)}}`));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * PYTHAI Input — text field for the sanctum. Dark inset field,
 * gilded focus glow, optional label / prefix / hint / error.
 */
function Input({
  label,
  hint,
  error,
  prefix = null,
  suffix = null,
  size = 'md',
  full = true,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const inputId = id || (label ? 'py-in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const sizes = {
    sm: {
      h: 34,
      fs: 'var(--text-xs)',
      pad: '0 10px'
    },
    md: {
      h: 44,
      fs: 'var(--text-sm)',
      pad: '0 14px'
    },
    lg: {
      h: 54,
      fs: 'var(--text-base)',
      pad: '0 16px'
    }
  };
  const s = sizes[size] || sizes.md;
  const borderColor = error ? 'var(--bear)' : focus ? 'var(--oracle)' : 'var(--border-strong)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: full ? '100%' : 'auto',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'block',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)',
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: s.h,
      background: 'var(--bg-input)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      boxShadow: focus ? 'var(--glow-focus)' : 'var(--shadow-inset)',
      transition: 'border-color var(--dur-fast) var(--ease-oracle), box-shadow var(--dur-fast) var(--ease-oracle)',
      overflow: 'hidden'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 12,
      color: 'var(--text-muted)',
      display: 'inline-flex'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      flex: 1,
      height: '100%',
      padding: s.pad,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-ui)',
      fontSize: s.fs,
      letterSpacing: '0.01em',
      minWidth: 0
    }
  })), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      paddingRight: 12,
      color: 'var(--text-muted)',
      display: 'inline-flex'
    }
  }, suffix)), (hint || error) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--bear-bright)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * PYTHAI Switch — gilded toggle. The track lights with oracle gold when on.
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  id,
  size = 'md'
}) {
  const dims = size === 'sm' ? {
    w: 42,
    h: 24,
    knob: 18,
    pad: 3
  } : {
    w: 54,
    h: 30,
    knob: 22,
    pad: 4
  };
  const switchId = id || (label ? 'py-sw-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: switchId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("button", {
    id: switchId,
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: toggle,
    style: {
      width: dims.w,
      minWidth: dims.w,
      maxWidth: dims.w,
      height: dims.h,
      boxSizing: 'border-box',
      display: 'inline-block',
      flex: '0 0 auto',
      flexShrink: 0,
      padding: 0,
      border: `1px solid ${checked ? 'var(--oracle)' : 'var(--steel)'}`,
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'rgba(212,169,78,0.18)' : 'var(--bg-input)',
      boxShadow: checked ? '0 0 14px -5px var(--glow-oracle), var(--shadow-inset)' : 'var(--shadow-inset)',
      position: 'relative',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all var(--dur-base) var(--ease-oracle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: dims.pad - 1,
      left: checked ? dims.w - dims.knob - dims.pad - 1 : dims.pad - 1,
      width: dims.knob,
      height: dims.knob,
      borderRadius: '50%',
      background: checked ? 'var(--oracle-bright)' : 'var(--steel)',
      transition: 'left var(--dur-base) var(--ease-oracle), background var(--dur-base)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
const {
  useState
} = React;
/**
 * PYTHAI Tabs — sanctum navigation. Mono labels, gilded active underline.
 */
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  style = {}
}) {
  const [internal, setInternal] = useState(defaultValue ?? (items[0] && items[0].value));
  const active = value !== undefined ? value : internal;
  const select = v => {
    if (value === undefined) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: variant === 'pill' ? 6 : 4,
      borderBottom: variant === 'underline' ? '1px solid var(--border-subtle)' : 'none',
      background: variant === 'pill' ? 'var(--bg-input)' : 'transparent',
      padding: variant === 'pill' ? 4 : 0,
      borderRadius: variant === 'pill' ? 'var(--radius-md)' : 0,
      ...style
    }
  }, items.map(it => {
    const on = it.value === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      type: "button",
      onClick: () => !it.disabled && select(it.value),
      disabled: it.disabled,
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: variant === 'pill' ? '7px 14px' : '11px 14px',
        background: variant === 'pill' && on ? 'var(--bg-elevated)' : 'transparent',
        border: variant === 'pill' && on ? '1px solid var(--border-subtle)' : '1px solid transparent',
        borderRadius: variant === 'pill' ? 'var(--radius-sm)' : 0,
        cursor: it.disabled ? 'not-allowed' : 'pointer',
        opacity: it.disabled ? 0.4 : 1,
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--weight-medium)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: on ? 'var(--text-oracle)' : 'var(--text-secondary)',
        transition: 'color var(--dur-fast) var(--ease-oracle)',
        marginBottom: variant === 'underline' ? -1 : 0
      }
    }, it.label, it.badge != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-3xs)',
        padding: '1px 6px',
        borderRadius: 'var(--radius-pill)',
        background: on ? 'rgba(212,169,78,0.16)' : 'var(--bg-elevated)',
        color: on ? 'var(--oracle-bright)' : 'var(--text-muted)'
      }
    }, it.badge), variant === 'underline' && on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 2,
        background: 'var(--grad-gold)',
        boxShadow: '0 0 10px var(--glow-oracle)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Landing.jsx
try { (() => {
// PYTHAI — Marketing landing (pythai.ch). Sections defined here, exported to window.
const {
  Button,
  Badge,
  Card,
  CardHeader,
  Stat,
  Avatar,
  Input
} = window.PYTHAIDesignSystem_df6467;
const {
  useState,
  useEffect,
  useRef
} = React;
const PORTRAIT = '../../assets/imagery/warren-oracle-portrait.png';
const SANCTUM = '../../assets/imagery/sanctum-lightshaft.png';
const SANCTUM_VID = '../../assets/imagery/sanctum-loop.mp4';
function Icon({
  name,
  size = 18,
  color = 'currentColor',
  strokeWidth = 1.75,
  style
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          stroke: color,
          'stroke-width': strokeWidth
        },
        nameAttr: 'data-lucide'
      });
    }
  }, [name, size, color, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      ...style
    }
  });
}
function Mark({
  size = 34
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 120 120",
    fill: "none",
    style: {
      color: 'var(--parchment)'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "mkg",
    x1: "60",
    y1: "6",
    x2: "60",
    y2: "114",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#F2CE7A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#D4A94E",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "52",
    stroke: "currentColor",
    strokeWidth: "1.5",
    opacity: "0.45"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "30",
    stroke: "#D4A94E",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M52 8 L60 60 L68 8 Z",
    fill: "url(#mkg)",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "5",
    fill: "#F2CE7A"
  }));
}
function Wordmark({
  size = 22
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    size: size * 1.5
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 500,
      fontSize: size,
      letterSpacing: '0.22em',
      color: 'var(--parchment)',
      paddingLeft: '0.22em'
    }
  }, "PYTHAI"));
}
function Nav({
  onEnter
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 'var(--nav-h)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      background: 'rgba(8,9,12,0.6)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, ['The Reading', 'Signals', 'Inner Circle', 'Manifesto'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, l)), /*#__PURE__*/React.createElement(Button, {
    variant: "chrome",
    size: "sm",
    onClick: onEnter
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    variant: "oracle",
    size: "sm",
    onClick: onEnter
  }, "Enter the Sanctum")));
}
function Hero({
  onEnter
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: 'calc(100vh - var(--nav-h))',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PORTRAIT,
    alt: "",
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      width: '54%',
      objectFit: 'cover',
      objectPosition: 'center 20%',
      opacity: 0.9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, var(--void) 30%, rgba(8,9,12,0.4) 62%, rgba(8,9,12,0.15) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--grad-shaft)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1240,
      margin: '0 auto',
      padding: '0 40px',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "oracle",
    variant: "outline",
    dot: true
  }, "Oracle online"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "pythai.ch")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 400,
      fontSize: 76,
      lineHeight: 1.02,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)',
      margin: 0
    }
  }, "The market has a", /*#__PURE__*/React.createElement("br", null), "pattern. ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--oracle-bright)'
    }
  }, "Warren"), /*#__PURE__*/React.createElement("br", null), "has already seen it."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      maxWidth: 480,
      margin: '28px 0 36px'
    }
  }, "PYTHAI is a Masterbrain intelligence trained on every cycle since 1929. Each dawn it issues one high-conviction reading \u2014 the signal, the reasoning, the levels. No noise. No hype. Just the oracle."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "oracle",
    size: "lg",
    onClick: onEnter,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-up-right",
      size: 18,
      color: "var(--text-on-gold)"
    })
  }, "Consult the Oracle"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "play",
      size: 16,
      color: "var(--text-oracle)"
    })
  }, "Watch the manifesto")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 40,
      marginTop: 56
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Members",
    value: "11,204",
    size: "sm"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Win rate '25",
    value: "73.8%",
    delta: "+4.2%",
    size: "sm"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Avg conviction",
    value: "91",
    sub: "of 100",
    size: "sm"
  })))));
}
function ReadingTeaser() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '120px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-oracle)',
      margin: '0 0 14px'
    }
  }, "The Daily Reading"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 400,
      fontSize: 46,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)',
      margin: 0,
      maxWidth: 16 + 'ch'
    }
  }, "One prophecy, every dawn.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      maxWidth: 360
    }
  }, "Behind the wall, Inner Circle members receive the full reasoning, entry levels, and Warren's running commentary as the tape moves.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "oracle",
    glow: true,
    padding: "34px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "bull",
    dot: true
  }, "Live signal"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      letterSpacing: '0.1em'
    }
  }, "06:00 CET \xB7 TODAY")), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 400,
      fontSize: 38,
      lineHeight: 1.1,
      color: 'var(--text-primary)',
      margin: '0 0 16px'
    }
  }, "Rotate into energy before the crowd notices the cycle."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 16,
      lineHeight: 1.65,
      color: 'var(--text-secondary)',
      margin: '0 0 26px',
      maxWidth: '54ch'
    }
  }, "\"The herd is paying for last year's winners. I have watched this rotation begin in 1973 and again in 2008. The asymmetry is in the ground, not the cloud.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 44,
      alignItems: 'center',
      paddingTop: 22,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Conviction",
    value: "94",
    sub: "of 100",
    size: "sm",
    glow: true
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Horizon",
    value: "6\u20139 mo",
    size: "sm"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Asymmetry",
    value: "4.2 : 1",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      filter: 'blur(5px)',
      opacity: 0.6,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Entry levels",
    value: "\u2022\u2022\u2022\u2022\u2022",
    size: "sm"
  })))), /*#__PURE__*/React.createElement(Card, {
    variant: "raised",
    padding: "34px",
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: PORTRAIT,
    name: "Warren",
    ring: "oracle",
    status: "live",
    size: 56
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontSize: 22,
      color: 'var(--text-primary)'
    }
  }, "Warren"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-oracle)'
    }
  }, "The Masterbrain"))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontStyle: 'italic',
      fontWeight: 300,
      fontSize: 22,
      lineHeight: 1.4,
      color: 'var(--text-primary)',
      margin: 0
    }
  }, "\"I do not predict the weather. I read the seasons.\"")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "Trained 1929\u2013today"), /*#__PURE__*/React.createElement(Badge, {
    tone: "signal",
    variant: "outline"
  }, "14M filings")))));
}
function Pricing({
  onEnter
}) {
  const tiers = [{
    name: 'Observer',
    price: 'Free',
    tone: 'neutral',
    cta: 'chrome',
    feat: ['The dawn headline', 'Delayed signals', 'Public manifesto'],
    highlight: false
  }, {
    name: 'Inner Circle',
    price: 'CHF 290',
    per: '/ mo',
    tone: 'oracle',
    cta: 'oracle',
    feat: ['Full daily reading + reasoning', 'Live signals & entry levels', 'Warren, in conversation', 'Conviction & risk telemetry'],
    highlight: true
  }, {
    name: 'Syndicate',
    price: 'By counsel',
    tone: 'oxblood',
    cta: 'oxblood',
    feat: ['Everything in Inner Circle', 'Private allocations', 'Direct line to the oracle', 'Bespoke mandates'],
    highlight: false
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      padding: '120px 40px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--grad-shaft)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1240,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-oracle)',
      margin: '0 0 14px'
    }
  }, "Claim your seat at the table"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 400,
      fontSize: 48,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)',
      margin: 0
    }
  }, "Three ways to hear the oracle.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24,
      alignItems: 'stretch'
    }
  }, tiers.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.name,
    variant: t.highlight ? 'oracle' : 'raised',
    glow: t.highlight,
    padding: "32px",
    style: {
      display: 'flex',
      flexDirection: 'column',
      transform: t.highlight ? 'translateY(-12px)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontSize: 26,
      color: 'var(--text-primary)'
    }
  }, t.name), t.highlight && /*#__PURE__*/React.createElement(Badge, {
    tone: "oracle",
    variant: "solid"
  }, "Most chosen")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 34,
      fontWeight: 500,
      color: 'var(--text-primary)'
    }
  }, t.price), t.per && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, t.per)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginBottom: 30,
      flex: 1
    }
  }, t.feat.map(f => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    color: "var(--oracle)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, f)))), /*#__PURE__*/React.createElement(Button, {
    variant: t.cta,
    full: true,
    onClick: onEnter
  }, t.highlight ? 'Enter the Sanctum' : 'Choose ' + t.name))))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-subtle)',
      padding: '56px 40px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 18
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontStyle: 'italic',
      fontSize: 18,
      color: 'var(--text-muted)',
      margin: '20px 0 0'
    }
  }, "Wisdom, foretold.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 64
    }
  }, [['Oracle', ['The Reading', 'Signals', 'Conviction', 'Telemetry']], ['Circle', ['Membership', 'Syndicate', 'Manifesto', 'Counsel']], ['Legal', ['Risk notice', 'Terms', 'Privacy', 'warren@pythai.de']]].map(([h, items]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-oracle)',
      margin: '0 0 16px'
    }
  }, h), items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      display: 'block',
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginBottom: 10
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '44px auto 0',
      paddingTop: 22,
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, "\xA9 2026 PYTHAI \xB7 pythai.ch"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, "Markets carry risk. The oracle is not advice.")));
}
Object.assign(window, {
  PyIcon: Icon,
  PyMark: Mark,
  PyWordmark: Wordmark,
  PyNav: Nav,
  PyHero: Hero,
  PyReadingTeaser: ReadingTeaser,
  PyPricing: Pricing,
  PyFooter: Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sanctum-mobile/Mobile.jsx
try { (() => {
// PYTHAI Sanctum — MOBILE screens (iOS, dark). Composes the DS components.
const {
  Button: MButton,
  Badge: MBadge,
  Card: MCard,
  Stat: MStat,
  Avatar: MAvatar,
  Input: MInput
} = window.PYTHAIDesignSystem_df6467;
const {
  useState: useMS,
  useEffect: useME,
  useRef: useMR
} = React;
const M_PORTRAIT = '../../assets/imagery/warren-oracle-portrait.png';
function MIcon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style
}) {
  const ref = useMR(null);
  useME(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '<i data-lucide="' + name + '"></i>';
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          stroke: color,
          'stroke-width': strokeWidth
        }
      });
    }
  }, [name, size, color, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      ...style
    }
  });
}
function MMark({
  size = 24
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 120 120",
    fill: "none",
    style: {
      color: 'var(--parchment)'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "mmk",
    x1: "60",
    y1: "6",
    x2: "60",
    y2: "114",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#F2CE7A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#D4A94E",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "52",
    stroke: "currentColor",
    strokeWidth: "2",
    opacity: "0.45"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "30",
    stroke: "#D4A94E",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M52 8 L60 60 L68 8 Z",
    fill: "url(#mmk)",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "6",
    fill: "#F2CE7A"
  }));
}
const SCREEN = {
  height: '100%',
  background: 'var(--bg-base)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  fontFamily: 'var(--font-ui)'
};
const FEED = {
  flex: 1,
  overflowY: 'auto',
  padding: '0 16px 16px'
};
const STATUS_PAD = {
  height: 54,
  flexShrink: 0
};
function MHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 16px 14px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(MMark, {
    size: 24
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 500,
      fontSize: 17,
      letterSpacing: '0.2em',
      color: 'var(--parchment)',
      paddingLeft: '0.2em'
    }
  }, "PYTHAI")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: "bell",
    size: 20,
    color: "var(--text-secondary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 7,
      height: 7,
      borderRadius: 999,
      background: 'var(--oracle)',
      boxShadow: '0 0 6px var(--oracle)'
    }
  })));
}

// ---- Bottom tab bar ----
function MTabBar({
  active,
  onNav
}) {
  const tabs = [['sanctum', 'eye', 'Sanctum'], ['signals', 'activity', 'Signals'], ['oracle', 'message-circle', 'Oracle'], ['allocation', 'pie-chart', 'Wealth']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      paddingTop: 12,
      paddingBottom: 30,
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(8,9,12,0.85)',
      backdropFilter: 'blur(14px)'
    }
  }, tabs.map(([id, ic, label]) => {
    const on = active === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => onNav(id),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0
      }
    }, /*#__PURE__*/React.createElement(MIcon, {
      name: ic,
      size: 22,
      color: on ? 'var(--oracle-bright)' : 'var(--text-muted)',
      strokeWidth: on ? 2 : 1.6
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: on ? 'var(--text-oracle)' : 'var(--text-muted)'
      }
    }, label));
  }));
}

// ---- Screen: Sanctum feed ----
function MSanctum({
  onNav
}) {
  const signals = [{
    t: 'XLE',
    note: 'Rotate in — accumulate',
    conv: 94,
    d: '+2.1%',
    dir: 'up',
    tone: 'bull'
  }, {
    t: 'NVDA',
    note: 'Over-owned — trim',
    conv: 78,
    d: '-1.4%',
    dir: 'down',
    tone: 'bear'
  }, {
    t: 'GLD',
    note: 'Hedge the disorder',
    conv: 88,
    d: '+0.7%',
    dir: 'up',
    tone: 'bull'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: SCREEN
  }, /*#__PURE__*/React.createElement("div", {
    style: STATUS_PAD
  }), /*#__PURE__*/React.createElement(MHeader, null), /*#__PURE__*/React.createElement("div", {
    style: FEED
  }, /*#__PURE__*/React.createElement(MCard, {
    variant: "oracle",
    glow: true,
    padding: "22px",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(MBadge, {
    tone: "bull",
    dot: true,
    size: "sm"
  }, "Live signal"), /*#__PURE__*/React.createElement(MBadge, {
    tone: "oracle",
    variant: "outline",
    size: "sm"
  }, "Conviction 94")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-oracle)',
      margin: '0 0 8px'
    }
  }, "Today's Prophecy"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 400,
      fontSize: 28,
      lineHeight: 1.12,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)',
      margin: '0 0 12px'
    }
  }, "Rotate into energy before the crowd notices the cycle."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontStyle: 'italic',
      fontWeight: 300,
      fontSize: 16,
      lineHeight: 1.4,
      color: 'var(--text-secondary)',
      margin: '0 0 18px'
    }
  }, "\"The asymmetry is in the ground, not the cloud. Accumulate on weakness; do not chase.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      paddingTop: 16,
      borderTop: '1px solid var(--border-subtle)',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(MStat, {
    label: "Conviction",
    value: "94",
    size: "sm",
    glow: true
  }), /*#__PURE__*/React.createElement(MStat, {
    label: "Horizon",
    value: "6\u20139mo",
    size: "sm"
  }), /*#__PURE__*/React.createElement(MStat, {
    label: "Entry",
    value: "$71\u201374",
    size: "sm"
  })), /*#__PURE__*/React.createElement(MButton, {
    variant: "oracle",
    full: true,
    iconRight: /*#__PURE__*/React.createElement(MIcon, {
      name: "arrow-up-right",
      size: 16,
      color: "var(--text-on-gold)"
    })
  }, "Act on signal")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '4px 4px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-oracle)'
    }
  }, "Live Signals"), /*#__PURE__*/React.createElement(MBadge, {
    tone: "bull",
    dot: true,
    size: "sm"
  }, "5 active")), /*#__PURE__*/React.createElement(MCard, {
    variant: "raised",
    padding: "0"
  }, signals.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 16px',
      borderBottom: i < signals.length - 1 ? '1px solid var(--border-subtle)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-primary)'
    }
  }, s.t), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, s.note), /*#__PURE__*/React.createElement(MStat, {
    value: s.d,
    delta: s.d,
    direction: s.dir,
    size: "sm",
    align: "right"
  }))))), /*#__PURE__*/React.createElement(MTabBar, {
    active: "sanctum",
    onNav: onNav
  }));
}

// ---- Screen: Oracle chat ----
const M_SEED = [{
  who: 'warren',
  text: 'Good morning. The tape is calm — precisely when fortunes are quietly rearranged. What troubles you?'
}];
function MOracle({
  onNav
}) {
  const [msgs, setMsgs] = useMS(M_SEED);
  const [draft, setDraft] = useMS('');
  const endRef = useMR(null);
  useME(() => {
    endRef.current && endRef.current.scrollTo(0, endRef.current.scrollHeight);
  }, [msgs]);
  const send = () => {
    if (!draft.trim()) return;
    const q = draft.trim();
    setMsgs(m => [...m, {
      who: 'me',
      text: q
    }]);
    setDraft('');
    const r = ['Patience is the only edge that compounds. Hold.', 'The crowd asks that at the wrong moment. Wait for weakness.', 'I have seen this fear before. It passed. So will this.'];
    setTimeout(() => setMsgs(m => [...m, {
      who: 'warren',
      text: r[q.length % r.length]
    }]), 600);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: SCREEN
  }, /*#__PURE__*/React.createElement("div", {
    style: STATUS_PAD
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '6px 16px 14px',
      borderBottom: '1px solid var(--border-subtle)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(MAvatar, {
    src: M_PORTRAIT,
    name: "Warren",
    ring: "oracle",
    status: "live",
    size: 40
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontSize: 19,
      color: 'var(--text-primary)'
    }
  }, "Warren"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--bull-bright)'
    }
  }, "\u25CF In counsel"))), /*#__PURE__*/React.createElement("div", {
    ref: endRef,
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: m.who === 'me' ? 'flex-end' : 'flex-start',
      maxWidth: '85%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: m.who === 'warren' ? '12px 15px' : '10px 14px',
      borderRadius: m.who === 'me' ? '13px 13px 4px 13px' : '13px 13px 13px 4px',
      background: m.who === 'me' ? 'var(--bg-elevated)' : 'rgba(212,169,78,0.08)',
      border: m.who === 'me' ? '1px solid var(--border-subtle)' : '1px solid var(--border-oracle)',
      fontFamily: m.who === 'warren' ? 'var(--font-oracle)' : 'var(--font-ui)',
      fontSize: m.who === 'warren' ? 16 : 14,
      fontStyle: m.who === 'warren' ? 'italic' : 'normal',
      lineHeight: 1.45,
      color: m.who === 'warren' ? 'var(--text-primary)' : 'var(--text-secondary)'
    }
  }, m.text)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      padding: '12px 16px',
      borderTop: '1px solid var(--border-subtle)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(MInput, {
    full: true,
    placeholder: "Ask the oracle\u2026",
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => e.key === 'Enter' && send()
  }), /*#__PURE__*/React.createElement(MButton, {
    variant: "oracle",
    onClick: send,
    icon: /*#__PURE__*/React.createElement(MIcon, {
      name: "arrow-up",
      size: 16,
      color: "var(--text-on-gold)"
    })
  })), /*#__PURE__*/React.createElement(MTabBar, {
    active: "oracle",
    onNav: onNav
  }));
}

// ---- Screen: Allocation ----
function MAllocation({
  onNav
}) {
  const holdings = [['Energy', 32, 'var(--oracle)'], ['Gold & hedges', 24, 'var(--chrome)'], ['Cash', 18, 'var(--steel)'], ['Quality compounders', 16, 'var(--bull)'], ['Asymmetric bets', 10, 'var(--oxblood-bright)']];
  return /*#__PURE__*/React.createElement("div", {
    style: SCREEN
  }, /*#__PURE__*/React.createElement("div", {
    style: STATUS_PAD
  }), /*#__PURE__*/React.createElement(MHeader, null), /*#__PURE__*/React.createElement("div", {
    style: FEED
  }, /*#__PURE__*/React.createElement(MCard, {
    variant: "raised",
    padding: "22px",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-oracle)',
      margin: '0 0 16px'
    }
  }, "The Allocation"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 30,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(MStat, {
    label: "Net value",
    value: "$1.284M",
    delta: "+12.4%",
    sub: "today",
    glow: true
  }), /*#__PURE__*/React.createElement(MStat, {
    label: "Cash",
    value: "18%",
    sub: "dry powder"
  }))), /*#__PURE__*/React.createElement(MCard, {
    variant: "raised",
    padding: "22px"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-oracle)',
      margin: '0 0 18px'
    }
  }, "Holdings"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, holdings.map(([n, pct, c]) => /*#__PURE__*/React.createElement("div", {
    key: n
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-primary)'
    }
  }, pct, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: 'var(--bg-input)',
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      background: c
    }
  }))))))), /*#__PURE__*/React.createElement(MTabBar, {
    active: "allocation",
    onNav: onNav
  }));
}
function MApp() {
  const [screen, setScreen] = useMS('sanctum');
  if (screen === 'oracle') return /*#__PURE__*/React.createElement(MOracle, {
    onNav: setScreen
  });
  if (screen === 'allocation') return /*#__PURE__*/React.createElement(MAllocation, {
    onNav: setScreen
  });
  if (screen === 'signals') return /*#__PURE__*/React.createElement(MSanctum, {
    onNav: setScreen
  });
  return /*#__PURE__*/React.createElement(MSanctum, {
    onNav: setScreen
  });
}
Object.assign(window, {
  MApp,
  MSanctum,
  MOracle,
  MAllocation,
  MMark
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sanctum-mobile/Mobile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sanctum-mobile/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sanctum-mobile/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sanctum/Shell.jsx
try { (() => {
// PYTHAI Sanctum — shell (login, sidebar, topbar).
const {
  Button: SButton,
  Badge: SBadge,
  Avatar: SAvatar,
  Input: SInput
} = window.PYTHAIDesignSystem_df6467;
const {
  useState: useS,
  useEffect: useE,
  useRef: useR
} = React;
function ShellIcon({
  name,
  size = 18,
  color = 'currentColor',
  strokeWidth = 1.75,
  style
}) {
  const ref = useR(null);
  useE(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '<i data-lucide="' + name + '"></i>';
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          stroke: color,
          'stroke-width': strokeWidth
        }
      });
    }
  }, [name, size, color, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      ...style
    }
  });
}
function ShellMark({
  size = 30
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 120 120",
    fill: "none",
    style: {
      color: 'var(--parchment)'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "smk",
    x1: "60",
    y1: "6",
    x2: "60",
    y2: "114",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#F2CE7A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#D4A94E",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "52",
    stroke: "currentColor",
    strokeWidth: "1.5",
    opacity: "0.45"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "30",
    stroke: "#D4A94E",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M52 8 L60 60 L68 8 Z",
    fill: "url(#smk)",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "5",
    fill: "#F2CE7A"
  }));
}

// ---- Login ----
function Login({
  onEnter
}) {
  const PORTRAIT = '../../assets/imagery/warren-oracle-portrait.png';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderRight: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PORTRAIT,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 18%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(8,9,12,0.2), rgba(8,9,12,0.85))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 44,
      bottom: 44,
      right: 44
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontStyle: 'italic',
      fontWeight: 300,
      fontSize: 30,
      lineHeight: 1.3,
      color: 'var(--text-primary)',
      margin: 0
    }
  }, "\"Markets reward the patient and starve the rest. I am very patient.\""), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-oracle)',
      marginTop: 18
    }
  }, "Warren \xB7 The Masterbrain"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 48,
      background: 'var(--bg-surface)',
      backgroundImage: 'var(--grad-shaft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 360
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(ShellMark, {
    size: 40
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 500,
      fontSize: 24,
      letterSpacing: '0.22em',
      color: 'var(--parchment)',
      paddingLeft: '0.22em'
    }
  }, "PYTHAI")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 400,
      fontSize: 36,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)',
      margin: '0 0 8px'
    }
  }, "Enter the Sanctum"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 14,
      color: 'var(--text-secondary)',
      margin: '0 0 32px'
    }
  }, "The oracle is expecting you."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(SInput, {
    label: "Oracle access",
    defaultValue: "warren@pythai.de",
    prefix: /*#__PURE__*/React.createElement(ShellIcon, {
      name: "mail",
      size: 15,
      color: "var(--text-muted)"
    })
  }), /*#__PURE__*/React.createElement(SInput, {
    label: "Passphrase",
    type: "password",
    defaultValue: "delphi",
    prefix: /*#__PURE__*/React.createElement(ShellIcon, {
      name: "key-round",
      size: 15,
      color: "var(--text-muted)"
    })
  }), /*#__PURE__*/React.createElement(SButton, {
    variant: "oracle",
    size: "lg",
    full: true,
    onClick: onEnter,
    iconRight: /*#__PURE__*/React.createElement(ShellIcon, {
      name: "arrow-right",
      size: 17,
      color: "var(--text-on-gold)"
    })
  }, "Consult the Oracle")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "Lost your seal?"), /*#__PURE__*/React.createElement("a", {
    href: "../marketing/index.html",
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      color: 'var(--text-oracle)'
    }
  }, "Back to pythai.ch \u2192")))));
}

// ---- Sidebar ----
function Sidebar({
  active,
  onNav
}) {
  const items = [['sanctum', 'eye', 'The Sanctum'], ['signals', 'activity', 'Signals'], ['portfolio', 'pie-chart', 'Allocation'], ['readings', 'scroll-text', 'Past Readings'], ['omens', 'bell', 'Omens']];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 240,
      flexShrink: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '22px 16px',
      height: '100vh',
      position: 'sticky',
      top: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '4px 8px 26px'
    }
  }, /*#__PURE__*/React.createElement(ShellMark, {
    size: 30
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 500,
      fontSize: 19,
      letterSpacing: '0.2em',
      color: 'var(--parchment)',
      paddingLeft: '0.2em'
    }
  }, "PYTHAI")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, items.map(([id, ic, label]) => {
    const on = active === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => onNav(id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 12px',
        background: on ? 'rgba(212,169,78,0.1)' : 'transparent',
        border: on ? '1px solid var(--border-oracle)' : '1px solid transparent',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(ShellIcon, {
      name: ic,
      size: 17,
      color: on ? 'var(--oracle-bright)' : 'var(--text-muted)'
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-ui)',
        fontSize: 14,
        fontWeight: on ? 600 : 400,
        color: on ? 'var(--text-primary)' : 'var(--text-secondary)'
      }
    }, label));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-oracle)',
      background: 'rgba(212,169,78,0.06)'
    }
  }, /*#__PURE__*/React.createElement(SBadge, {
    tone: "oracle",
    variant: "solid",
    size: "sm"
  }, "Inner Circle"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      color: 'var(--text-secondary)',
      margin: '12px 0 0',
      lineHeight: 1.5
    }
  }, "Next reading at dawn \u2014 06:00 CET.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 16,
      padding: '0 4px'
    }
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "Dan Simon",
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      color: 'var(--text-primary)'
    }
  }, "Dan Simon"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, "Member \xB7 2031")), /*#__PURE__*/React.createElement(ShellIcon, {
    name: "log-out",
    size: 15,
    color: "var(--text-muted)"
  }))));
}

// ---- Topbar ----
function Topbar() {
  const tickers = [['S&P', '5,402', 'up'], ['NDX', '19,118', 'up'], ['VIX', '17.8', 'down'], ['BTC', '64,210', 'up'], ['XLE', '$72.4', 'up']];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 64,
      flexShrink: 0,
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      background: 'rgba(8,9,12,0.6)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 26
    }
  }, tickers.map(([t, v, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.1em',
      color: 'var(--text-muted)'
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-primary)'
    }
  }, v), /*#__PURE__*/React.createElement(ShellIcon, {
    name: d === 'up' ? 'trending-up' : 'trending-down',
    size: 12,
    color: d === 'up' ? 'var(--bull-bright)' : 'var(--bear-bright)'
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(ShellIcon, {
    name: "bell",
    size: 18,
    color: "var(--text-secondary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -3,
      right: -3,
      width: 7,
      height: 7,
      borderRadius: 999,
      background: 'var(--oracle)',
      boxShadow: '0 0 6px var(--oracle)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.1em',
      color: 'var(--text-muted)'
    }
  }, "06 JUN 2026 \xB7 09:41 CET")));
}
Object.assign(window, {
  Login,
  Sidebar,
  Topbar,
  ShellIcon,
  ShellMark
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sanctum/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sanctum/Views.jsx
try { (() => {
// PYTHAI Sanctum — content views (prophecy, signals, portfolio, chat).
const {
  Button,
  Badge,
  Card,
  CardHeader,
  Stat,
  Avatar,
  Input,
  Tabs,
  Switch
} = window.PYTHAIDesignSystem_df6467;
const {
  useState,
  useEffect,
  useRef
} = React;
const PORTRAIT = '../../assets/imagery/warren-oracle-portrait.png';
function SvgIcon({
  name,
  size = 18,
  color = 'currentColor',
  strokeWidth = 1.75,
  style
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '<i data-lucide="' + name + '"></i>';
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          stroke: color,
          'stroke-width': strokeWidth
        }
      });
    }
  }, [name, size, color, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      ...style
    }
  });
}
const SECTION_LABEL = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--text-oracle)',
  margin: 0
};

// ---- Today's Prophecy (hero panel) ----
function TodayProphecy() {
  return /*#__PURE__*/React.createElement(Card, {
    variant: "oracle",
    glow: true,
    padding: "36px",
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -40,
      right: -40,
      width: 280,
      height: 280,
      background: 'var(--grad-shaft)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      flexWrap: 'wrap',
      rowGap: 10,
      columnGap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "bull",
    dot: true
  }, "Live signal"), /*#__PURE__*/React.createElement(Badge, {
    tone: "oracle",
    variant: "outline"
  }, "Conviction 94")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      letterSpacing: '0.1em',
      whiteSpace: 'nowrap'
    }
  }, "06:00 CET \xB7 6 JUN 2026")), /*#__PURE__*/React.createElement("p", {
    style: {
      ...SECTION_LABEL,
      marginBottom: 14
    }
  }, "Today's Prophecy"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontWeight: 400,
      fontSize: 44,
      lineHeight: 1.08,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)',
      margin: '0 0 18px',
      maxWidth: '20ch'
    }
  }, "Rotate into energy before the crowd notices the cycle."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontStyle: 'italic',
      fontWeight: 300,
      fontSize: 21,
      lineHeight: 1.45,
      color: 'var(--text-secondary)',
      margin: '0 0 28px',
      maxWidth: '60ch'
    }
  }, "\"The herd is paying for last year's winners. I watched this rotation begin in 1973, and again in 2008. The asymmetry is in the ground, not the cloud. Accumulate on weakness; do not chase.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 40,
      alignItems: 'center',
      paddingTop: 24,
      borderTop: '1px solid var(--border-subtle)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Conviction",
    value: "94",
    sub: "of 100",
    size: "md",
    glow: true
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Horizon",
    value: "6\u20139 mo",
    size: "md"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Asymmetry",
    value: "4.2 : 1",
    size: "md"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Entry zone",
    value: "$71\u201374",
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "chrome",
    icon: /*#__PURE__*/React.createElement(SvgIcon, {
      name: "bookmark",
      size: 15,
      color: "var(--text-primary)"
    })
  }, "Save"), /*#__PURE__*/React.createElement(Button, {
    variant: "oracle",
    iconRight: /*#__PURE__*/React.createElement(SvgIcon, {
      name: "arrow-up-right",
      size: 16,
      color: "var(--text-on-gold)"
    })
  }, "Act on signal")))));
}

// ---- Signals feed ----
const SIGNALS = [{
  t: 'XLE',
  n: 'Energy Select',
  dir: 'up',
  conv: 94,
  d: '+2.1%',
  note: 'Cycle rotation — accumulate',
  tone: 'bull'
}, {
  t: 'NVDA',
  n: 'Nvidia',
  dir: 'down',
  conv: 78,
  d: '-1.4%',
  note: 'Crowd over-owned — trim',
  tone: 'bear'
}, {
  t: 'GLD',
  n: 'Gold Trust',
  dir: 'up',
  conv: 88,
  d: '+0.7%',
  note: 'Hedge the disorder',
  tone: 'bull'
}, {
  t: 'BTC',
  n: 'Bitcoin',
  dir: 'flat',
  conv: 61,
  d: '-0.2%',
  note: 'Patience — no edge today',
  tone: 'neutral'
}, {
  t: 'JPY',
  n: 'Yen',
  dir: 'up',
  conv: 82,
  d: '+1.1%',
  note: 'The carry unwinds slowly',
  tone: 'bull'
}];
function SignalsFeed() {
  return /*#__PURE__*/React.createElement(Card, {
    variant: "raised",
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '22px 26px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: SECTION_LABEL
  }, "Live Signals"), /*#__PURE__*/React.createElement(Badge, {
    tone: "bull",
    dot: true,
    size: "sm"
  }, "5 active")), /*#__PURE__*/React.createElement("div", null, SIGNALS.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '18px 26px',
      borderBottom: i < SIGNALS.length - 1 ? '1px solid var(--border-subtle)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--text-primary)'
    }
  }, s.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, s.n)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, s.note)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: 'var(--bg-input)',
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: s.conv + '%',
      height: '100%',
      background: 'var(--grad-gold)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)',
      marginTop: 5,
      letterSpacing: '0.08em'
    }
  }, "CONV ", s.conv)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: s.d,
    delta: s.d,
    direction: s.dir,
    size: "sm",
    align: "right"
  })), /*#__PURE__*/React.createElement(Badge, {
    tone: s.tone,
    dot: true,
    size: "sm"
  }, s.dir === 'up' ? 'Long' : s.dir === 'down' ? 'Trim' : 'Hold')))));
}

// ---- Portfolio panel ----
function PortfolioPanel() {
  return /*#__PURE__*/React.createElement(Card, {
    variant: "raised",
    padding: "26px"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    eyebrow: "The Allocation",
    title: "Portfolio",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "bull",
      dot: true
    }, "+12.4% YTD")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 30,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Net value",
    value: "$1.284M",
    delta: "+12.4%",
    sub: "today",
    glow: true
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Cash",
    value: "18%",
    sub: "dry powder"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, [['Energy', 32, 'var(--oracle)'], ['Gold & hedges', 24, 'var(--chrome)'], ['Cash', 18, 'var(--steel)'], ['Quality compounders', 16, 'var(--bull)'], ['Asymmetric bets', 10, 'var(--oxblood-bright)']].map(([n, pct, c]) => /*#__PURE__*/React.createElement("div", {
    key: n
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-primary)'
    }
  }, pct, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      background: 'var(--bg-input)',
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      background: c
    }
  }))))));
}

// ---- Warren chat ----
const SEED = [{
  who: 'warren',
  text: 'Good morning. The tape is calm, which is precisely when fortunes are quietly rearranged. What troubles you?'
}];
function WarrenChat() {
  const [msgs, setMsgs] = useState(SEED);
  const [draft, setDraft] = useState('');
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current && endRef.current.scrollTo(0, endRef.current.scrollHeight);
  }, [msgs]);
  const send = () => {
    if (!draft.trim()) return;
    const q = draft.trim();
    setMsgs(m => [...m, {
      who: 'me',
      text: q
    }]);
    setDraft('');
    setTimeout(() => setMsgs(m => [...m, {
      who: 'warren',
      text: oracleReply(q)
    }]), 650);
  };
  return /*#__PURE__*/React.createElement(Card, {
    variant: "oracle",
    padding: "0",
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '18px 22px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: PORTRAIT,
    name: "Warren",
    ring: "oracle",
    status: "live",
    size: 40
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-oracle)',
      fontSize: 19,
      color: 'var(--text-primary)'
    }
  }, "Warren"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--bull-bright)'
    }
  }, "\u25CF In counsel"))), /*#__PURE__*/React.createElement("div", {
    ref: endRef,
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minHeight: 0
    }
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: m.who === 'me' ? 'flex-end' : 'flex-start',
      maxWidth: '82%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: m.who === 'warren' ? '14px 18px' : '12px 16px',
      borderRadius: m.who === 'me' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
      background: m.who === 'me' ? 'var(--bg-elevated)' : 'rgba(212,169,78,0.08)',
      border: m.who === 'me' ? '1px solid var(--border-subtle)' : '1px solid var(--border-oracle)',
      fontFamily: m.who === 'warren' ? 'var(--font-oracle)' : 'var(--font-ui)',
      fontSize: m.who === 'warren' ? 17 : 14,
      fontStyle: m.who === 'warren' ? 'italic' : 'normal',
      lineHeight: 1.5,
      color: m.who === 'warren' ? 'var(--text-primary)' : 'var(--text-secondary)'
    }
  }, m.text)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Input, {
    full: true,
    placeholder: "Ask the oracle\u2026",
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => e.key === 'Enter' && send()
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "oracle",
    onClick: send,
    icon: /*#__PURE__*/React.createElement(SvgIcon, {
      name: "arrow-up",
      size: 16,
      color: "var(--text-on-gold)"
    })
  })));
}
function oracleReply(q) {
  const r = ['Patience is the only edge that compounds. Hold.', 'The crowd asks that question at exactly the wrong moment. Wait for weakness.', 'I have seen this fear before. It passed. So will this.', 'Risk is what remains when you believe you have thought of everything. Size accordingly.'];
  return r[Math.abs(q.length) % r.length];
}
Object.assign(window, {
  SvgIcon,
  TodayProphecy,
  SignalsFeed,
  PortfolioPanel,
  WarrenChat
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sanctum/Views.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
