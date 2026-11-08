import React from "react";
import { C, FONT, H, OUT, W, clamp, ev, makeVoice, past, pop, springTo, type Voice } from "../lib";
import { Board, Birds, Caption, Cloud, Gerobak, Ground, Sky, Sticker, Sunburst, T } from "../Props";
import { Juned } from "../Juned";
import type { Episode } from "../episode";
import voice2 from "../data/voice-day2.json";

// ---------------------------------------------------------------------------
// WARUNG KOMEN — DAY 2: "AYAM GEPREK". Every cue comes from Mang Juned's own
// voice-over (voice-day2.json). Shots cut on the 120 BPM 8th grid, just before a line.
// ---------------------------------------------------------------------------
export const V2 = makeVoice(voice2 as Voice);
const VW = V2.VW;
type P = { t: number; ep: Episode };

// ---- Day 2 props -----------------------------------------------------------

/** display name -> @handle for this render (the TikTok cut shows TikTok @usernames; Instagram shows names as-is) */
export const NamesCtx = React.createContext<Record<string, string>>({});
const useName = (n?: string) => { const m = React.useContext(NamesCtx); return n ? (m[n] ?? n) : n; };

/** a viewer's comment, as a card: avatar, text (pre-wrapped lines), heart + likes. Pops in at t0. */
export const Comment: React.FC<{ x: number; y: number; lines: string[]; likes: number; t: number; t0?: number; rot?: number; w?: number; size?: number; hl?: boolean; av?: string; name?: string }> =
  ({ x, y, lines, likes, t, t0 = -1, rot = 0, w: w0 = 760, size = 44, hl, av = C.purple, name }) => {
    const k = t0 < 0 ? 1 : pop(t, t0);
    name = useName(name);
    if (k <= 0.001) return null;
    let w = w0;
    const nh = name ? size * 0.95 : 0;
    const h = 70 + nh + lines.length * size * 1.18;
    w = Math.max(w, Math.max(...lines.map((l) => l.length), name ? name.length * 0.85 : 0) * size * 0.56 + 270);
    return (
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
        <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} rx={28} fill={C.ink} />
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={28} fill={hl ? C.yellow : C.white} stroke={C.ink} strokeWidth={OUT} />
        <circle cx={-w / 2 + 62} cy={-h / 2 + 64} r={34} fill={av} stroke={C.ink} strokeWidth={6} />
        <circle cx={-w / 2 + 62} cy={-h / 2 + 56} r={12} fill={C.white} />
        <path d={`M${-w / 2 + 42} ${-h / 2 + 86} q20 -22 40 0`} fill={C.white} />
        {name && <T x={-w / 2 + 120} y={-h / 2 + 24 + size * 0.8} size={size * 0.82} anchor="start" weight={700} color={C.blueD}>{name}</T>}
        {lines.map((l, i) => (
          <T key={i} x={-w / 2 + 120} y={-h / 2 + 30 + nh + size * 0.95 + i * size * 1.18} size={size} anchor="start" weight={600}>{l}</T>
        ))}
        <g transform={`translate(${w / 2 - 70} ${h / 2 - 48})`}>
          <path d="M0 20 C-34 -4 -24 -30 0 -14 C24 -30 34 -4 0 20 Z" fill={likes > 0 ? C.red : "none"} stroke={C.ink} strokeWidth={5} />
          <T x={-44} y={14} size={38} anchor="end" color={likes > 0 ? C.red : C.grey}>{String(likes)}</T>
        </g>
      </g>
    );
  };

/** a plate of ayam geprek: rice dome, smashed fried chicken, sambal on top */
export const Plate: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT / s} strokeLinejoin="round">
    <ellipse cx={0} cy={40} rx={260} ry={70} fill={C.white} />
    <ellipse cx={0} cy={36} rx={200} ry={46} fill="#eef2f6" strokeWidth={3} />
    <path d="M-190 30 Q-170 -70 -80 -60 Q-40 -60 -30 30 Z" fill={C.white} />
    <path d="M-50 40 Q-60 -40 20 -70 Q90 -90 150 -40 Q200 0 170 40 Z" fill="#e0a043" />
    {[[-10, -30], [40, -50], [90, -40], [130, -10], [20, 0], [70, 10]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={9} fill="#c27a22" strokeWidth={3} />)}
    <path d="M-20 -40 Q30 -80 100 -60 Q140 -40 120 -20 Q60 -40 -10 -10 Z" fill={C.red} />
    {[0, 1, 2].map((i) => <circle key={i} cx={20 + i * 40} cy={-50 + (i % 2) * 14} r={5} fill={C.yellow} strokeWidth={2} />)}
    <path d="M150 20 l50 -30 l12 18 l-50 26 Z" fill={C.green} />
    {/* steam */}
    {[0, 1, 2].map((i) => <path key={i} d={`M${-60 + i * 70} ${-110 - ((t * 60 + i * 30) % 60)} q20 -25 0 -50 q-20 -25 0 -50`} stroke="rgba(255,255,255,0.85)" strokeWidth={10} strokeLinecap="round" fill="none" />)}
  </g>
);

/** a generic customer (no real person) — feet at (x, y) */
/** a commenter's name in a small pill, pointing down at them */
export const NameTag: React.FC<{ x: number; y: number; text: string; size?: number; k?: number; arrow?: boolean }> = ({ x, y, text: raw, size = 42, k = 1, arrow = true }) => {
  const text = useName(raw)!;
  if (k <= 0.001) return null;
  const w = [...text].reduce((a, ch) => a + (/[A-Z]/.test(ch) ? 0.7 : 0.56), 0) * size + 40, h = size * 1.45;
  const cx = Math.min(W - w / 2 - 16, Math.max(w / 2 + 16, x)), ax = x - cx;   // keep the pill on screen; the arrow still points at its owner
  return (
    <g transform={`translate(${cx} ${y}) scale(${k})`}>
      {arrow && <path d={`M${ax - 12} ${h / 2 - 2} L${ax} ${h / 2 + 16} L${ax + 12} ${h / 2 - 2} Z`} fill={C.white} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={C.white} stroke={C.ink} strokeWidth={5} />
      <T x={0} y={size * 0.36} size={size} weight={700}>{text}</T>
    </g>
  );
};

export const Customer: React.FC<{ x: number; y: number; s?: number; t: number; body?: string; skin?: string; hair?: string; walk?: boolean; wave?: boolean; flip?: boolean; name?: string; tag?: "head" | "chest"; lift?: number; nk?: number }> =
  ({ x, y, s = 1, t, body = C.purple, skin = "#efc19e", hair = "#3a2418", walk, wave, flip, name, tag = "head", lift = 0, nk = 1 }) => {
    const step = walk ? Math.sin(t * 12) * 16 : 0;
    const bob = walk ? Math.abs(Math.sin(t * 12)) * -8 : Math.sin(t * 4) * 3;
    return (
      <>
      <g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
        <ellipse cx={0} cy={0} rx={90} ry={16} fill="rgba(0,0,0,0.18)" strokeWidth={0} />
        <path d={`M-30 -170 L${-34 + step} -20`} strokeWidth={44 + OUT * 2} strokeLinecap="round" />
        <path d={`M-30 -170 L${-34 + step} -20`} stroke="#2b2b3a" strokeWidth={44} strokeLinecap="round" />
        <path d={`M30 -170 L${34 - step} -20`} strokeWidth={44 + OUT * 2} strokeLinecap="round" />
        <path d={`M30 -170 L${34 - step} -20`} stroke="#2b2b3a" strokeWidth={44} strokeLinecap="round" />
        <rect x={-85} y={-380} width={170} height={230} rx={60} fill={body} />
        <path d={wave ? `M70 -340 L${130} ${-470 + Math.sin(t * 9) * 25}` : "M70 -340 L110 -200"} strokeWidth={38 + OUT * 2} strokeLinecap="round" />
        <path d={wave ? `M70 -340 L${130} ${-470 + Math.sin(t * 9) * 25}` : "M70 -340 L110 -200"} stroke={body} strokeWidth={38} strokeLinecap="round" />
        <path d="M-70 -340 L-110 -200" strokeWidth={38 + OUT * 2} strokeLinecap="round" />
        <path d="M-70 -340 L-110 -200" stroke={body} strokeWidth={38} strokeLinecap="round" />
        <circle cx={0} cy={-460} r={72} fill={skin} />
        <path d="M-74 -470 Q-70 -545 0 -546 Q70 -545 74 -470 Q40 -505 0 -500 Q-40 -505 -74 -470 Z" fill={hair} />
        <circle cx={-22} cy={-462} r={7} fill={C.ink} strokeWidth={0} /><circle cx={22} cy={-462} r={7} fill={C.ink} strokeWidth={0} />
        <path d="M-18 -428 Q0 -412 18 -428" fill="none" strokeWidth={6} strokeLinecap="round" />
      </g>
      {name && (tag === "head"
        ? <NameTag x={x} y={y + bob - 560 * s - 34 - lift} text={name} k={nk} />
        : <NameTag x={x} y={y + bob - 270 * s} text={name} size={24} k={nk} arrow={false} />)}
      </>
    );
  };

/** the stone mortar (cobek) with chilies, and its pestle (ulekan) */
const Cobek: React.FC<{ x: number; y: number; s?: number; chilies?: number; chicken?: number }> = ({ x, y, s = 1, chilies = 6, chicken = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT / s} strokeLinejoin="round">
    <ellipse cx={0} cy={30} rx={250} ry={80} fill="#6d6a72" />
    <ellipse cx={0} cy={0} rx={250} ry={70} fill="#8d8a93" />
    <ellipse cx={0} cy={0} rx={200} ry={46} fill="#a33" />
    {Array.from({ length: chilies }, (_, i) => <path key={i} d={`M${-150 + i * 55} ${-6 + (i % 2) * 14} q30 -16 50 6`} stroke={C.red} strokeWidth={18} strokeLinecap="round" fill="none" />)}
    {chicken > 0 && (
      <g transform={`scale(1 ${chicken})`}>
        <path d="M-120 0 Q-110 -80 0 -90 Q110 -80 120 0 Z" fill="#e0a043" />
        {[-60, -10, 40, 80].map((cx, i) => <circle key={i} cx={cx} cy={-40 - (i % 2) * 18} r={10} fill="#c27a22" strokeWidth={3} />)}
      </g>
    )}
  </g>
);
const Ulekan: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
    <path d="M-60 0 Q-70 -80 -20 -110 L20 -110 Q70 -80 60 0 Z" fill="#7b7782" />
    <rect x={-22} y={-300} width={44} height={200} rx={20} fill={C.woodD} />
  </g>
);

/** a quick impact burst behind a word */
const Burst: React.FC<{ x: number; y: number; r: number; k: number; fill?: string }> = ({ x, y, r, k, fill = C.yellow }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <path d={Array.from({ length: 24 }, (_, i) => { const a = i / 24 * Math.PI * 2, rr = i % 2 ? r * 0.66 : r; return `${i ? "L" : "M"}${Math.cos(a) * rr * 1.15} ${Math.sin(a) * rr * 0.85}`; }).join(" ") + " Z"} fill={fill} stroke={C.ink} strokeWidth={OUT} />
  </g>
);

/** the warung's menu board: grows by one dish per episode */
const MenuBoard: React.FC<{ x: number; y: number; items: string[] }> = ({ x, y, items }) => (
  <Board x={x} y={y} w={380} h={150 + items.length * 62}>
    <T x={x + 190} y={y + 92} size={44} color={C.white}>MENU</T>
    {items.map((m, i) => <T key={i} x={x + 60} y={y + 152 + i * 62} size={38} color={C.yellow} anchor="start">{`${i + 1}. ${m}`}</T>)}
  </Board>
);

/** a name's moment in the spotlight: pops in at t0, gone after `d` seconds */
const spot = (t: number, t0: number, d = 1.0) => (t < t0 || t > t0 + d + 0.2 ? 0 : pop(t, t0) * (1 - ev(t, t0 + d, 0.15)));

// ---- the shots -------------------------------------------------------------

// 1. DAY 2 — Juned at the cart, reading comments on his phone; cards rain down, likes 0, 0, 1...
const RAIN: { l: string; n: string; k: number; x: number; y: number; r: number }[] = [
  { l: "pesan nasi gorengg", n: "@arcvival_2", k: 1, x: 330, y: 470, r: -5 },
  { l: "miee ayamm enakk", n: "@febyy243", k: 1, x: 720, y: 650, r: 4 },
  { l: "pecel lele", n: "@o_onyl15", k: 0, x: 360, y: 830, r: 3 },
  { l: "dimsum pleasee", n: "@tae.shell", k: 0, x: 700, y: 1000, r: -4 },
  { l: "kopi bang", n: "IJN DZEKI", k: 0, x: 330, y: 1170, r: -2 },
];
export const Buka: React.FC<P> = ({ t, ep }) => {
  const pelit = past(t, VW("pelit", "elu"));
  return (
    <g>
      <Sky a={C.sky} b={C.skyL} id="d2bSky" />
      <Cloud x={200} y={300} /><Cloud x={880} y={380} s={0.7} />
      <Ground y={1300} color={C.green} dark={C.greenD} />
      <Gerobak x={300} y={1420} s={0.75} sign={ep.warung} />
      {RAIN.map((c, i) => {
        const t0 = 1.0 + i * 0.5;
        const fall = springTo(t, t0, -300, c.y, 14);
        return t >= t0 ? <Comment key={i} x={c.x} y={fall} lines={[c.l]} name={c.n} likes={c.k} t={t} rot={c.r} w={520} size={36} av={[C.blue, C.pink, C.green, C.teal, C.red][i]} /> : null;
      })}
      <Sticker x={300} y={260} text={`DAY ${ep.day}`} size={110} t={t} t0={VW("buka", "hari")} rot={-5} />
      {pelit && <Sticker x={700} y={1080} text="LIKE-NYA DIKIT!" size={48} fill={C.red} color={C.white} t={t} t0={VW("pelit", "pelit")} rot={5} />}
      <Juned x={780} y={1700} s={0.85} t={t} pose="hold" mood={pelit ? "sad" : "smile"}>
        <g transform="rotate(-8)">
          <rect x={-55} y={-400} width={110} height={180} rx={18} fill={C.ink} stroke={C.ink} strokeWidth={OUT} />
          <rect x={-42} y={-385} width={84} height={150} rx={8} fill="#bfe8ff" />
          <path d="M0 -290 C-20 -305 -14 -322 0 -312 C14 -322 20 -305 0 -290 Z" fill={C.red} />
        </g>
      </Juned>
      <Caption text={pelit ? "elu pada pelit like, sumpah!" : "gw udeh baca semua komen elu"} t={t} t0={0.6} />
    </g>
  );
};

// 2. THE WINNER — drumroll, then AYAM GEPREK! and the winning comment, 5 likes
export const Menang: React.FC<P> = ({ t }) => {
  const rev = VW("menang", "ayam");
  const on = past(t, rev);
  const shake = on && t < rev + 0.4 ? (1 - (t - rev) / 0.4) * 24 : 0;
  return (
    <g transform={`translate(${Math.sin(t * 90) * shake} ${Math.cos(t * 77) * shake})`}>
      {on ? <Sunburst cx={540} cy={700} a="#ffb21e" b="#ff8a1f" t={t} /> : <rect x={0} y={0} width={W} height={H} fill="#2a1e4a" />}
      {!on && (
        <g>
          <circle cx={540} cy={700} r={360 + Math.sin(t * 40) * 8} fill="rgba(255,255,255,0.08)" />
          <T x={540} y={640} size={84} color={C.white}>NYANG MENANG...</T>
          {[0, 1, 2].map((i) => <circle key={i} cx={440 + i * 100} cy={780} r={22} fill={(Math.floor(t * 8) % 3) === i ? C.yellow : "rgba(255,255,255,0.3)"} />)}
        </g>
      )}
      {on && (
        <g>
          <Burst x={540} y={640} r={430} k={pop(t, rev, 9)} />
          <g transform={`translate(540 640) rotate(-5) scale(${pop(t, rev, 8)})`}>
            <T x={0} y={-30} size={170} color={C.red} stroke={C.white}>AYAM</T>
            <T x={0} y={150} size={170} color={C.red} stroke={C.white}>GEPREK!</T>
          </g>
          <Comment x={540} y={1130} lines={["Semangat kakkk, ayam", "geprek aja kaaa"]} name="@_.szsbillaa" likes={5} t={t} t0={rev + 0.35} hl w={820} rot={2} av={C.pink} />
          <Plate x={330} y={1420} s={0.75} t={t} />
        </g>
      )}
      <Juned x={850} y={1720} s={0.8} t={t} pose={on ? "proud" : "scratch"} mood={on ? "happy" : "focus"} />
    </g>
  );
};

// 3. SAWIT — "Jualan sawit kakk": an oil-palm tree pops up next to the cart
const Palm: React.FC<{ x: number; y: number; k: number; t: number }> = ({ x, y, k, t }) => (
  <g transform={`translate(${x} ${y}) scale(${k}) rotate(${Math.sin(t * 3) * 2})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
    <path d="M-40 0 Q-30 -300 -10 -560 L30 -560 Q30 -300 40 0 Z" fill="#8a5a33" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-30 ${-60 - i * 62} l60 -20`} stroke="#5e3a1d" strokeWidth={8} />)}
    {Array.from({ length: 7 }, (_, i) => { const a = -Math.PI + (i / 6) * Math.PI; return <path key={i} d={`M10 -560 Q${10 + Math.cos(a) * 200} ${-560 + Math.sin(a) * 200 - 60} ${10 + Math.cos(a) * 330} ${-560 + Math.sin(a) * 160 + 80}`} stroke={C.greenD} strokeWidth={46} strokeLinecap="round" fill="none" />; })}
    {Array.from({ length: 7 }, (_, i) => { const a = -Math.PI + (i / 6) * Math.PI; return <path key={i} d={`M10 -560 Q${10 + Math.cos(a) * 200} ${-560 + Math.sin(a) * 200 - 60} ${10 + Math.cos(a) * 330} ${-560 + Math.sin(a) * 160 + 80}`} stroke={C.green} strokeWidth={30} strokeLinecap="round" fill="none" />; })}
    <g>{[[-30, -520], [20, -510], [-5, -490], [35, -480], [-35, -470]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={22} fill={i % 2 ? "#c0392b" : "#e8642c"} strokeWidth={5} />)}</g>
  </g>
);
export const Sawit: React.FC<P> = ({ t, ep }) => {
  const sw = VW("sawit", "sawit", 1);
  return (
    <g>
      <Sky a={C.sky} b={C.skyL} id="d2sSky" />
      <Cloud x={820} y={560} s={0.8} />
      <Ground y={1250} color={C.green} dark={C.greenD} />
      <Gerobak x={620} y={1370} s={0.75} sign={ep.warung} />
      <Palm x={900} y={1330} k={pop(t, sw, 9)} t={t} />
      <Comment x={540} y={380} lines={["Jualan sawit kakk"]} likes={0} t={t} t0={9.85} rot={-3} av={C.green} />
      {past(t, sw) && <Sticker x={300} y={620} text="SAWIT?!" size={92} fill={C.red} color={C.white} t={t} t0={sw + 0.15} rot={-8} />}
      <Juned x={260} y={1700} s={0.85} t={t} pose="point" mood={past(t, sw) ? "wow" : "smile"} />
      <Caption text="ini warung, bukan kebon!" t={t} t0={sw + 0.2} />
    </g>
  );
};

// 4. BAKSO TANPA TEPUNG — a bowl, then a round lump of rendang rolls in
export const Bakso: React.FC<P> = ({ t }) => {
  const rd = VW("bakso", "rendang");
  const rx = springTo(t, rd - 0.3, 1300, 640, 12), roll = (t - rd) * 360;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={C.wood} />
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M0 ${i * 90 + 30} Q540 ${i * 90 + 50} 1080 ${i * 90 + 25}`} stroke="rgba(120,60,20,0.25)" strokeWidth={4} fill="none" />)}
      <Comment x={540} y={380} lines={["baso tanpa tepung"]} likes={0} t={t} t0={13.05} rot={2} av={C.blue} />
      {/* the bowl */}
      <g stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" transform="translate(0 -100)">
        <ellipse cx={360} cy={900} rx={230} ry={60} fill="#c9773a" />
        <path d="M130 900 Q150 1110 360 1120 Q570 1110 590 900 Z" fill={C.white} />
        <path d="M150 960 L570 960" stroke={C.blue} strokeWidth={12} strokeDasharray="30 18" />
      </g>
      <Sticker x={360} y={660} text="TEPUNG: 0%" size={44} fill={C.white} t={t} t0={VW("bakso", "tepung")} rot={-4} />
      {/* the round rendang */}
      {t > rd - 0.3 && (
        <g transform={`translate(${rx} 950) rotate(${roll})`} stroke={C.ink} strokeWidth={OUT}>
          <circle r={120} fill="#5a2a14" />
          {[[-40, -40], [30, -60], [50, 20], [-30, 40], [0, 0]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={16} fill="#7a3a1a" strokeWidth={4} />)}
        </g>
      )}
      {past(t, rd + 0.3) && <Sticker x={700} y={1140} text="RENDANG BUNDER" size={52} fill={C.yellow} t={t} t0={rd + 0.3} rot={-3} />}
      <Juned x={170} y={1900} s={0.7} t={t} pose="point" mood="happy" />
      <Caption text="itu mah rendang bunder" t={t} t0={rd} />
    </g>
  );
};

// 5. BORONG SEMUA — the receipt unrolls forever; BAYAR DULU!
export const Borong: React.FC<P> = ({ t }) => {
  const by = VW("borong", "bayar");
  const len = 80 + 820 * ev(t, VW("borong", "borong"), 1.3);
  const items = ["sawit .......... ?", "nasi goreng .... 1", "mie ayam ....... 1", "pecel lele ..... 1", "dimsum ......... 1", "onigiri ........ 1", "es teh ......... 4", "gorengan ....... 2", "martabak ....... 1", "rendang bunder . 1"];
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#fff1c2" />
      {Array.from({ length: 36 }, (_, i) => <rect key={i} x={i % 2 ? (i * 30) % W : 0} y={i % 2 ? 0 : i * 60} width={i % 2 ? 30 : W} height={i % 2 ? H : 30} fill="rgba(238,47,47,0.12)" />)}
      <Comment x={540} y={330} lines={["bang aku mau beli borong apa", "aja yg ditulis netizen lain."]} name="fatiii" likes={0} t={t} t0={16.45} w={900} size={42} av={C.teal} />
      <g stroke={C.ink} strokeWidth={OUT}>
        <rect x={200} y={500} width={440} height={len} fill={C.paper} />
        <path d={`M200 ${500 + len} ${Array.from({ length: 11 }, (_, i) => `L${200 + i * 44 + 22} ${500 + len + 20} L${200 + (i + 1) * 44} ${500 + len}`).join(" ")}`} fill={C.paper} />
      </g>
      {items.map((s, i) => 560 + i * 78 < 500 + len - 20 ? <T key={i} x={225} y={570 + i * 78} size={32} anchor="start" weight={500}>{s}</T> : null)}
      {past(t, by) && (
        <g transform={`translate(420 1060) rotate(-12) scale(${pop(t, by, 8)})`}>
          <rect x={-320} y={-90} width={640} height={180} rx={20} fill="rgba(255,255,255,0.85)" stroke={C.red} strokeWidth={14} />
          <T x={0} y={30} size={88} color={C.red}>BAYAR DULU!</T>
        </g>
      )}
      <Juned x={860} y={1720} s={0.8} t={t} pose="point" mood={past(t, by) ? "smile" : "wow"} flip />
      <Caption text="borong semua? bayar dulu, ye!" t={t} t0={by} />
    </g>
  );
};

// 6. AYA-AYA WAE — Juned laughing and shaking his head among the three comments
export const AyaAya: React.FC<P> = ({ t }) => {
  const k = pop(t, VW("ayaaya", "aya-aya"));
  return (
    <g>
      <Sunburst cx={540} cy={900} a="#8f5cff" b="#a77bff" t={t} />
      <Comment x={330} y={380} lines={["Jualan sawit kakk"]} likes={0} t={t} rot={-8} w={540} size={38} av={C.green} />
      <Comment x={760} y={560} lines={["baso tanpa tepung"]} likes={0} t={t} rot={6} w={540} size={38} av={C.blue} />
      <Comment x={360} y={740} lines={["borong apa aja..."]} name="fatiii" likes={0} t={t} rot={-3} w={540} size={38} av={C.teal} />
      <g transform={`translate(540 1000) rotate(-6) scale(${k})`}>
        <rect x={-420} y={-110} width={840} height={200} rx={40} fill={C.yellow} stroke={C.ink} strokeWidth={OUT} />
        <T x={0} y={30} size={104}>AYA-AYA WAE!</T>
      </g>
      <g transform={`translate(${Math.sin(t * 14) * 8} 0)`}>
        <Juned x={540} y={1760} s={0.85} t={t} pose="scratch" mood="happy" />
      </g>
      <Caption text="(ada-ada aja elu pada)" t={t} t0={VW("ayaaya", "aya-aya") + 0.3} />
    </g>
  );
};

// 7. BELANJA — the market; a thin wallet, a moth; a bag of chicken and chilies
export const Belanja: React.FC<P> = ({ t }) => {
  const md = VW("belanja", "modal"), ay = VW("belanja", "ayam");
  return (
    <g>
      <Sky a="#ffd27a" b="#fff1c2" id="d2pSky" />
      <g stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${60 + i * 520} 560)`}>
            <rect x={20} y={80} width={420} height={560} fill={i ? "#ffe0b0" : "#ffd0d0"} />
            <path d="M-10 90 L470 90 L440 0 L20 0 Z" fill={i ? C.teal : C.blue} />
            {Array.from({ length: 6 }, (_, j) => <path key={j} d={`M${-10 + j * 80} 90 q40 40 80 0`} fill={j % 2 ? C.white : i ? C.teal : C.blue} />)}
            <rect x={20} y={400} width={420} height={60} fill={C.wood} />
          </g>
        ))}
      </g>
      <T x={290} y={520} size={46} color={C.ink}>AYAM</T>
      <T x={810} y={520} size={46} color={C.ink}>CABE</T>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${160 + i * 110} 930)`} stroke={C.ink} strokeWidth={5}><ellipse rx={50} ry={34} fill="#f6c9a0" /><path d="M40 -10 l30 -20" strokeWidth={14} strokeLinecap="round" /></g>)}
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${660 + (i % 5) * 70} ${920 + Math.floor(i / 5) * 40} q30 -14 48 6`} stroke={C.red} strokeWidth={16} strokeLinecap="round" fill="none" />)}
      <Ground y={1250} color="#c9b08a" />
      {/* the wallet + moth */}
      {past(t, md - 0.2) && (
        <g transform={`translate(330 1160) scale(${pop(t, md - 0.2)})`} stroke={C.ink} strokeWidth={OUT}>
          <rect x={-120} y={-70} width={240} height={140} rx={16} fill="#8a5a33" />
          <rect x={-120} y={-70} width={240} height={50} rx={16} fill="#a8703f" />
          <T x={0} y={40} size={40} color={C.cream}>Rp...</T>
          <g transform={`translate(${Math.sin(t * 5.3) * 70} ${-120 - (t - md) * 120})`}>
            <circle r={9} fill={C.ink} /><ellipse cx={-7} cy={-10} rx={9} ry={5} fill="rgba(255,255,255,0.85)" strokeWidth={2} /><ellipse cx={7} cy={-10} rx={9} ry={5} fill="rgba(255,255,255,0.85)" strokeWidth={2} />
          </g>
        </g>
      )}
      <Sticker x={330} y={1010} text="SISA MODAL" size={44} fill={C.white} t={t} t0={md} rot={-3} />
      <Juned x={780} y={1720} s={0.85} t={t} pose="hold" mood={past(t, ay) ? "happy" : "sad"}>
        {past(t, ay - 0.3) && (
          <g stroke={C.ink} strokeWidth={OUT} transform={`translate(0 ${40 - 40 * pop(t, ay - 0.3)})`}>
            <path d="M-50 -440 q-10 -60 30 -70 M50 -440 q10 -60 -30 -70" fill="none" strokeWidth={8} />
            <path d="M-110 -440 L110 -440 L90 -260 L-90 -260 Z" fill={C.white} />
            <ellipse cx={-30} cy={-460} rx={50} ry={30} fill="#f6c9a0" />
            <path d="M20 -470 q30 -14 48 6 M40 -455 q30 -14 48 6" stroke={C.red} strokeWidth={14} strokeLinecap="round" fill="none" />
          </g>
        )}
      </Juned>
      <Caption text="sisa modal, gw belanja ayam" t={t} t0={22.4} />
    </g>
  );
};

// 8. MASAK — the wok (kriuk!) and the mortar (cabe sekilo)
export const Masak: React.FC<P> = ({ t }) => {
  const kr = VW("goreng", "kriuk"), ul = VW("goreng", "ulek"), cb = VW("goreng", "cabe");
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#ffe3b3" />
      <rect x={0} y={1080} width={W} height={H - 1080} fill={C.wood} stroke={C.ink} strokeWidth={OUT} />
      {/* stove + wok */}
      <g stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
        <rect x={60} y={900} width={460} height={180} rx={14} fill="#5b6b7a" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${170 + i * 60} 905 q${10 + Math.sin(t * 20 + i) * 8} -30 0 -55`} stroke={i % 2 ? C.orange : C.yellow} strokeWidth={14} strokeLinecap="round" fill="none" />)}
        <path d="M40 700 Q290 960 540 700 Z" fill="#2f2f3a" />
        <ellipse cx={290} cy={700} rx={250} ry={40} fill="#d9a23b" />
        <path d="M540 700 L680 650" strokeWidth={24 + OUT} strokeLinecap="round" />
        <path d="M540 700 L680 650" stroke={C.woodD} strokeWidth={24} strokeLinecap="round" />
        {[0, 1].map((i) => <ellipse key={i} cx={220 + i * 150} cy={690 + Math.sin(t * 8 + i * 2) * 6} rx={70} ry={34} fill="#e0a043" />)}
      </g>
      {Array.from({ length: 10 }, (_, i) => { const k = (t * 2 + i * 0.13) % 1; return <circle key={i} cx={100 + ((i * 47) % 380)} cy={700 - k * 80} r={8 * (1 - k) + 3} fill="rgba(255,255,255,0.8)" stroke={C.ink} strokeWidth={3} />; })}
      {past(t, kr) && <Sticker x={290} y={470} text="KRIUK!" size={86} fill={C.yellow} t={t} t0={kr} rot={-7} />}
      {/* mortar */}
      <Cobek x={800} y={1180} s={0.95} chilies={past(t, cb) ? 9 : 5} />
      <Ulekan x={800 + Math.sin(t * 10) * 70} y={1170} rot={Math.sin(t * 10) * 12} />
      {past(t, ul) && <Sticker x={800} y={880} text="ULEK! ULEK!" size={56} fill={C.white} t={t} t0={ul} rot={4} />}
      {past(t, cb) && (
        <g>
          {Array.from({ length: 10 }, (_, i) => { const k = ((t - cb) * 1.6 + i * 0.1) % 1; return <path key={i} d={`M${700 + (i * 37) % 200} ${400 + k * 700} q30 -14 48 6`} stroke={C.red} strokeWidth={18} strokeLinecap="round" fill="none" />; })}
          <Sticker x={790} y={330} text="CABE 1 KILO" size={60} fill={C.red} color={C.white} t={t} t0={cb} rot={-4} />
        </g>
      )}
      <Juned x={420} y={1880} s={0.65} t={t} pose="hammer" mood="focus" />
      <Caption text="goreng sampe kriuk..." t={t} t0={25.3} />
    </g>
  );
};

// 9. PEDES — the chili smoke hits his nose: coughing, sneezing; the cat runs off
export const Pedes: React.FC<P> = ({ t }) => {
  const wd = VW("pedes", "waduh");
  const shake = t > 29.0 && t < wd + 0.6 ? 10 : 0;
  const catX = 760 + Math.max(0, t - (wd + 0.2)) * 900;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#ffe3b3" />
      <rect x={0} y={1250} width={W} height={H - 1250} fill={C.wood} stroke={C.ink} strokeWidth={OUT} />
      {/* red smoke from the mortar */}
      {Array.from({ length: 14 }, (_, i) => {
        const k = ((t - 28.9) * 0.9 + i * 0.07) % 1;
        return <circle key={i} cx={300 + Math.sin(i * 1.7 + t * 2) * 90 + k * 160} cy={1300 - k * 900} r={50 + k * 70} fill={`rgba(238,47,47,${0.45 * (1 - k)})`} />;
      })}
      <Cobek x={300} y={1400} s={0.8} chilies={9} />
      <g transform={`translate(${Math.sin(t * 70) * shake} ${Math.cos(t * 60) * shake})`}>
        <Juned x={600} y={1600} s={0.85} t={t} pose="scratch" mood="hot" />
      </g>
      {Array.from({ length: 3 }, (_, i) => <path key={i} d={`M${700 + i * 40} ${880 + ((t * 300 + i * 50) % 120)} q8 18 0 26 q-8 -8 0 -26`} fill="#7fd6ff" stroke={C.ink} strokeWidth={4} />)}
      {past(t, wd) && <Sticker x={330} y={420} text="UHUK! HACIH!" size={74} fill={C.white} t={t} t0={wd} rot={-6} />}
      {past(t, VW("pedes", "pedesnya")) && <Sticker x={700} y={600} text="PEDES!!" size={84} fill={C.red} color={C.white} t={t} t0={VW("pedes", "pedesnya")} rot={7} />}
      {/* the cat bolts */}
      <g transform={`translate(${catX} 1330)`} stroke={C.ink} strokeWidth={OUT}>
        <ellipse cx={0} cy={0} rx={80} ry={36} fill="#ffb703" />
        <path d="M-70 -20 L-62 -64 L-42 -36 L-18 -64 L-10 -20 Z" fill="#ffb703" transform="translate(-30 0)" />
        <circle cx={-70} cy={-28} r={6} fill={C.ink} />
        {past(t, wd + 0.2) && <path d="M80 -10 q40 -40 70 -60" strokeWidth={18} strokeLinecap="round" fill="none" />}
        {[-40, 40].map((d) => <path key={d} d={`M${d} 30 l${Math.sin(t * 30) * 20} 30`} strokeWidth={14} strokeLinecap="round" />)}
      </g>
      {past(t, wd + 0.2) && <T x={catX - 60} y={1230} size={46} color={C.ink} stroke={C.white}>MEONG!</T>}
      <Caption text="pedesnya nyampe ke idung!" t={t} t0={VW("pedes", "pedesnya")} />
    </g>
  );
};

// 10. GEPREK! GEPREK! — two smashes, then the plate, done
export const Geprek: React.FC<P> = ({ t }) => {
  const g1 = VW("geprek", "geprek"), g2 = VW("geprek", "geprek", 1), nah = VW("geprek", "nah");
  const hit = (tg: number) => (t >= tg - 0.12 && t < tg + 0.25 ? clamp(1 - Math.abs(t - tg) / 0.12) : 0);
  const lift = t < nah ? Math.max(hit(g1), hit(g2)) : 0;
  const squash = t < g1 ? 1 : t < g2 ? 0.6 : 0.35;
  const done = past(t, nah);
  return (
    <g>
      {done ? <Sunburst cx={540} cy={860} a="#ffd23f" b="#ffe37a" t={t} /> : <rect x={0} y={0} width={W} height={H} fill="#ffe3b3" />}
      {!done && (
        <g>
          <rect x={0} y={1150} width={W} height={H - 1150} fill={C.wood} stroke={C.ink} strokeWidth={OUT} />
          <Cobek x={540} y={1150} s={1.3} chilies={9} chicken={squash} />
          <Ulekan x={540} y={1060 - 360 * (1 - lift)} rot={-10 * (1 - lift)} />
          {[g1, g2].map((tg, i) => t >= tg && t < tg + 0.6 ? (
            <g key={i}>
              <Burst x={i ? 760 : 320} y={i ? 720 : 560} r={210} k={pop(t, tg, 8)} fill={i ? C.red : C.yellow} />
              <T x={i ? 760 : 320} y={i ? 750 : 590} size={84} color={i ? C.white : C.red} stroke={C.ink} rot={i ? 8 : -8}>GEPREK!</T>
            </g>
          ) : null)}
        </g>
      )}
      {done && (
        <g>
          <Plate x={540} y={1000} s={1.35} t={t} />
          {Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2 + t; const k = 0.6 + 0.4 * Math.sin(t * 8 + i); return <path key={i} transform={`translate(${540 + Math.cos(a) * 420} ${900 + Math.sin(a) * 300}) scale(${k * 2})`} d="M0 -12 Q0 0 12 0 Q0 0 0 12 Q0 0 -12 0 Q0 0 0 -12 Z" fill={C.white} stroke={C.ink} strokeWidth={2} />; })}
          <Sticker x={540} y={480} text="AYAM GEPREK" size={96} fill={C.red} color={C.white} t={t} t0={nah} rot={-3} />
          <Sticker x={760} y={640} text="JADI!" size={70} t={t} t0={VW("geprek", "jadi")} rot={8} />
          <Juned x={200} y={1880} s={0.6} t={t} pose="proud" mood="happy" />
        </g>
      )}
      <Caption text={done ? "nah... jadi dah!" : "geprek! geprek!"} t={t} t0={32.3} />
    </g>
  );
};

// 11. DATENG — dusk, the cart lit; a customer walks in. A real one!
export const Dateng: React.FC<P> = ({ t, ep }) => {
  const ad = VW("dateng", "ada"), bn = VW("dateng", "beneran");
  const cx = springTo(t, ad - 0.2, 1300, 800, 18);
  return (
    <g>
      <Sky a="#ff8a5c" b="#ffd59a" id="d2dSky" />
      <circle cx={830} cy={520} r={90} fill="#fff0b0" stroke={C.ink} strokeWidth={OUT} />
      <Birds y={640} t={t} />
      <Ground y={1300} color="#3fae5c" dark="#2f8a48" />
      <Gerobak x={400} y={1300} s={0.85} sign={ep.warung} lamp />
      <MenuBoard x={650} y={700} items={ep.menu} />
      <Plate x={400} y={940} s={0.4} t={t} />
      <Juned x={110} y={1880} s={0.6} t={t} pose={past(t, bn) ? "wave" : "stand"} mood={past(t, bn) ? "wow" : t > ad ? "focus" : "sad"} />
      <Customer x={cx} y={1700} s={0.95} t={t} walk={t < ad + 0.7} flip name="@_.szsbillaa" nk={pop(t, ad + 0.6)} />
      {!past(t, ad) && <T x={600} y={900} size={60} color={C.ink} rot={-4}>sepi...</T>}
      {past(t, bn) && <Sticker x={560} y={420} text="PELANGGAN!!" size={92} fill={C.yellow} t={t} t0={bn} rot={-5} />}
      <Caption text={past(t, bn) ? "beneran dateng!" : "terus... ada nyang dateng"} t={t} t0={35.9} />
    </g>
  );
};

// 12. BUKU BON — line 1, written in: the first customer's name. LUNAS!
const WriteOn: React.FC<{ id: string; x: number; y: number; size: number; frac: number; color: string; children: string }> = ({ id, x, y, size, frac, color, children }) => (
  <g>
    <defs><clipPath id={id}><rect x={x - 10} y={y - size * 1.1} width={(children.length * size * 0.62 + 20) * Math.max(0, Math.min(1, frac))} height={size * 1.5} /></clipPath></defs>
    <text clipPath={`url(#${id})`} x={x} y={y} fontFamily={FONT} fontSize={size} fontWeight={700} fill={color}>{children}</text>
  </g>
);
export const BonD2: React.FC<P> = ({ t }) => {
  const nm = VW("bon", "namanya"), bn = VW("bon", "bon");
  const fr = ev(t, nm, 1.0);
  const px = 340 + 520 * fr, py = 790;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={C.wood} />
      <g stroke={C.ink} strokeWidth={OUT}>
        <rect x={110} y={330} width={860} height={1060} rx={20} fill={C.blue} />
        <rect x={140} y={350} width={800} height={1020} rx={10} fill={C.paper} />
      </g>
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M150 ${490 + i * 70} L930 ${490 + i * 70}`} stroke="rgba(47,111,224,0.3)" strokeWidth={3} />)}
      <path d="M230 350 L230 1370" stroke="rgba(238,47,47,0.5)" strokeWidth={4} />
      <T x={300} y={460} size={84} color={C.blue} anchor="start">BUKU BON</T>
      <T x={250} y={560} size={40} color="rgba(40,40,60,0.7)" anchor="start" weight={500}>No.  Nama            Pesanan</T>
      <T x={250} y={700} size={64} anchor="start">1.</T>
      <WriteOn id="nm" x={330} y={700} size={66} frac={fr} color={C.red}>_.szsbillaa</WriteOn>
      <WriteOn id="ps" x={330} y={790} size={50} frac={ev(t, nm + 0.7, 0.6)} color={C.ink}>ayam geprek (pedes!)</WriteOn>
      {["2.", "3.", "4.", "5."].map((n, i) => <T key={n} x={250} y={930 + i * 120} size={60} color="rgba(40,40,60,0.35)" anchor="start">{n}</T>)}
      {past(t, bn) && (
        <g transform={`translate(720 1100) rotate(-14) scale(${pop(t, bn, 8)})`}>
          <rect x={-190} y={-80} width={380} height={160} rx={18} fill="rgba(255,255,255,0.7)" stroke={C.green} strokeWidth={14} />
          <T x={0} y={30} size={92} color={C.green}>LUNAS</T>
        </g>
      )}
      {t < nm + 1.6 && (
        <g transform={`translate(${px} ${py}) rotate(-40)`} stroke={C.ink} strokeWidth={6}>
          <rect x={0} y={-18} width={260} height={36} rx={6} fill={C.yellow} /><path d="M0 -18 L-50 0 L0 18 Z" fill="#f1d3a6" /><path d="M-36 -6 L-50 0 L-36 6 Z" fill={C.ink} /><rect x={240} y={-18} width={30} height={36} rx={6} fill={C.pink} />
        </g>
      )}
      <Caption text="pelanggan pertama gw!" t={t} t0={39.3} />
    </g>
  );
};

// 13. TERHARU — Juned in tears; the board counts PELANGGAN 1 -> 5, a small queue forms
export const Terharu: React.FC<P> = ({ t, ep }) => {
  const final = Number(ep.pelangganAkhir) || 5;
  const n = Math.min(final, 1 + Math.floor(clamp((t - 43.2) / 2.0) * (final - 1) + 1e-6));
  const bodies = [C.purple, C.blue, C.pink, C.green, C.teal];
  const Q = ["@_.szsbillaa", "THE LUCKY GUY", "@tae.shell", "@o_onyl15", "fatiii"];
  return (
    <g>
      <Sky a="#5b2bb5" b="#ffa630" id="d2tSky" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} transform={`translate(${(i * 223) % 1000 + 40} ${(i * 137) % 400 + 220}) scale(${1 + 0.3 * (Math.floor(t * 12 + i) % 2)})`} d="M0 -12 Q0 0 12 0 Q0 0 0 12 Q0 0 -12 0 Q0 0 0 -12 Z" fill={C.white} />)}
      <Ground y={1300} color="#2f9e5a" dark="#237a45" />
      <Gerobak x={330} y={1290} s={0.8} sign={ep.warung} lamp />
      <MenuBoard x={40} y={540} items={ep.menu} />
      {Q.slice(1, n).map((q, i) => (
        <Customer key={i} x={720 + i * 92} y={1540 - i * 22} s={0.6 - i * 0.03} t={t + i} body={bodies[(i + 1) % 5]} skin={["#efc19e", "#c68a62", "#8a5638", "#f2d0b0"][i % 4]} flip
          name={q} nk={spot(t, 43.2 + 0.5 * (i + 1) - 0.25, 0.75)} />
      ))}
      <Customer x={610} y={1590} s={0.7} t={t} body={bodies[0]} wave name={Q[0]} nk={spot(t, 42.3, 1.1)} />
      <Board x={680} y={720} w={330} h={260}>
        <T x={845} y={800} size={36} color={C.white}>PELANGGAN</T>
        <T x={845} y={930} size={120} color={C.yellow}>{String(n)}</T>
      </Board>
      <Juned x={260} y={1900} s={0.62} t={t} pose="proud" mood="cry" />
      <Sticker x={330} y={430} text="HATUR NUHUN!" size={74} fill={C.yellow} t={t} t0={VW("terharu", "hatur")} rot={-5} />
    </g>
  );
};

// 14. PROTES — the nasi goreng camp and the mie ayam camp, placards up; "disebut 6x"
const Camp: React.FC<{ x: number; t: number; sign: string; fill: string; flip?: boolean; k: number; names: string[]; t0: number }> = ({ x, t, sign, fill, flip, k, names, t0 }) => {
  // spotlight order: front 0, back 0, front 1, back 1, front 2, back 2
  const at = (row: number, i: number) => spot(t, t0 + (i * 2 + row) * 1.05, 0.9);
  const d = flip ? -1 : 1;
  return (
    <g>
      {/* back row: smaller, names above heads */}
      {[0, 1, 2].map((i) => (
        <Customer key={`b${i}`} x={x + d * (60 + i * 115)} y={1600} s={0.5} t={t + i * 0.4 + 1} body={[C.purple, C.teal, C.blue][i]} skin={["#c68a62", "#f2d0b0", "#8a5638"][i]} flip={!flip}
          name={names[3 + i]} nk={at(1, i)} />
      ))}
      {/* front row: names on their chests */}
      {[0, 1, 2].map((i) => (
        <Customer key={`f${i}`} x={x + d * i * 115} y={1720} s={0.62} t={t + i * 0.3} body={[C.blue, C.pink, C.green][i]} skin={["#efc19e", "#c68a62", "#8a5638"][i]} flip={!flip}
          name={names[i]} nk={at(0, i)} />
      ))}
      <g transform={`translate(${x + d * 120} ${960 + Math.sin(t * 9) * 18}) rotate(${Math.sin(t * 6) * 5}) scale(${k})`} stroke={C.ink} strokeWidth={OUT}>
        <rect x={-12} y={0} width={24} height={300} fill={C.woodD} />
        <rect x={-210} y={-130} width={420} height={170} rx={16} fill={fill} />
        <T x={0} y={-25} size={78} color={C.ink}>{sign}</T>
      </g>
    </g>
  );
};
export const Protes: React.FC<P> = ({ t }) => {
  const ds = VW("disebut", "disebut"), iy = VW("disebut", "iye");
  return (
    <g>
      <Sky a={C.sky} b={C.skyL} id="d2rSky" />
      <Cloud x={540} y={300} s={0.9} />
      <Ground y={1450} color={C.green} dark={C.greenD} />
      <Juned x={540} y={1800} s={0.72} t={t} pose={past(t, iy) ? "wave" : "scratch"} mood={past(t, iy) ? "smile" : "sad"} />
      <Camp x={95} t={t} sign="NASGOR!" fill={C.yellow} k={pop(t, VW("protes", "nasgor"))} names={["@ex.cl77", "kelvin", "@aliftrndk", "ROGO SAMBOYO PUTRO", "hafizapizzaa", "@arcvival_2"]} t0={46.35} />
      <Camp x={985} t={t} sign="MIE AYAM!" fill="#ffe08a" flip k={pop(t, VW("protes", "mie"))} names={["@febyy243", "nazz", "@isnn05", "azell?", "_Faniiii_", "Faxzzz."]} t0={46.35} />
      {Math.floor(t * 3) % 2 === 0 && <><T x={300} y={740} size={52} color={C.ink} rot={-8}>huuu!</T><T x={780} y={740} size={52} color={C.ink} rot={8}>huuu!</T></>}
      {past(t, ds) && (
        <g>
          <Sticker x={230} y={590} text="DISEBUT 6x" size={46} fill={C.white} t={t} t0={ds} rot={-5} />
          <Sticker x={850} y={590} text="DISEBUT 6x" size={46} fill={C.white} t={t} t0={ds + 0.12} rot={5} />
        </g>
      )}
      {past(t, iy) && <Sticker x={540} y={420} text="IYE, IYE!" size={84} fill={C.yellow} t={t} t0={iy} rot={-3} />}
    </g>
  );
};

// 15. VOTING DAY 3 — the rules, then BURUAN!
export const Cta: React.FC<P> = ({ t, ep }) => {
  const R = [
    { t: VW("cta1", "komen"), a: ep.rules[0].a, b: ep.rules[0].b, fill: C.teal },
    { t: VW("cta2", "like"), a: ep.rules[1].a, b: ep.rules[1].b, fill: C.red },
  ];
  const br = VW("cta2", "buruan");
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#fff1c2" />
      {Array.from({ length: 36 }, (_, i) => <rect key={i} x={i % 2 ? (i * 30) % W : 0} y={i % 2 ? 0 : i * 60} width={i % 2 ? 30 : W} height={i % 2 ? H : 30} fill="rgba(238,47,47,0.14)" />)}
      <Sticker x={540} y={300} text={`ADU LIKE: MENU KE-${ep.menu.length + 1}`} size={62} fill={C.yellow} t={t} t0={VW("cta1", "adu")} rot={-3} />
      {R.map((r, i) => {
        const k = pop(t, r.t); if (k <= 0) return null;
        return (
          <g key={i} transform={`translate(540 ${500 + i * 330}) rotate(${(i ? 1.5 : -1.5) + Math.sin(t * 3 + i) * 1}) scale(${k})`}>
            <rect x={-414} y={8} width={840} height={260} rx={22} fill={C.ink} />
            <rect x={-420} y={0} width={840} height={260} rx={22} fill={C.white} stroke={C.ink} strokeWidth={OUT} />
            <rect x={-420} y={0} width={40} height={260} rx={14} fill={r.fill} stroke={C.ink} strokeWidth={OUT} />
            <T x={-340} y={115} size={r.a.length > 8 ? 72 : 86} anchor="start">{r.a}</T>
            <T x={-340} y={215} size={56} color={C.red} anchor="start">{r.b}</T>
          </g>
        );
      })}
      {past(t, br) && (
        <g transform={`translate(400 1290) rotate(-6) scale(${pop(t, br, 8)})`}>
          <Burst x={0} y={0} r={240} k={1} fill={C.yellow} />
          <T x={0} y={30} size={100} color={C.red} stroke={C.white}>BURUAN!</T>
        </g>
      )}
      <Sticker x={300} y={1560} text={`CABANG ${ep.cabang}`} size={40} fill={C.white} t={t} t0={53} rot={3} />
      <Juned x={860} y={1880} s={0.72} t={t} pose="wave" mood="happy" />
    </g>
  );
};

