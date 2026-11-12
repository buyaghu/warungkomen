import React from "react";
import { C, H, OUT, W, clamp, ev, makeVoice, type Voice } from "../lib";
import { Board, Cloud, Gerobak, Ground, Sky, Sticker as RawSticker, Sunburst, T } from "../Props";
import { Juned } from "../Juned";
import type { Episode } from "../episode";
import { Customer } from "./Day2";
import { AccountCard } from "./Day3Layout";
import voice5 from "../data/voice-day5.json";

// Day 5: BAKSO KEJU (58 likes, @evelyn.chipi67 on IG). Full frame, big characters, occasional text only.
// PELANGGAN = real follower total (IG + TikTok) from Day 5; Babe Rojali promises the second cart at 1.000.
export const V5 = makeVoice(voice5 as Voice);
export const c = (id: string) => V5.VL(id).t0;
type P = { t: number; ep: Episode };
const Sticker: React.FC<React.ComponentProps<typeof RawSticker>> = (props) => <RawSticker {...props} w={props.w ?? Math.min(1000, props.text.length * (props.size ?? 64) * .69 + (props.size ?? 64) * 1.2)} />;
const WINNER = "@evelyn.chipi67";
export const PELANGGAN = 673;
export const TARGET = 1000;

const Outside: React.FC<{ children?: React.ReactNode; id?: string }> = ({ children, id = "d5-sky" }) => <>
  <Sky a={C.sky} b={C.skyL} id={id} />
  <Cloud x={170} y={330} s={0.7} /><Cloud x={880} y={450} s={0.8} />
  <Ground y={1320} color={C.green} dark={C.greenD} />{children}
</>;
const Kitchen: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>
  <Sky a="#ffd99b" b="#fff3d6" id="d5-kitchen" />
  {[160, 400, 640, 880].map(x => <path key={x} d={`M${x} 400 V1180`} stroke="#ecc58f" strokeWidth={3} />)}
  <rect x={0} y={1110} width={W} height={H - 1110} fill={C.wood} stroke={C.ink} strokeWidth={OUT} />
  <rect x={30} y={1110} width={1020} height={60} rx={12} fill="#efb776" stroke={C.ink} strokeWidth={OUT} />{children}
</>;

/** one meatball; square=true for the failed first try, burst=true when the cheese escapes */
export const Bakso: React.FC<{ x: number; y: number; r?: number; square?: boolean; burst?: number; rot?: number }> = ({ x, y, r = 60, square, burst = 0, rot = 0 }) => <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={C.ink} strokeWidth={6}>
  {square ? <rect x={-r} y={-r} width={r * 2} height={r * 2} rx={r * 0.25} fill="#a87850" /> : <circle r={r} fill="#a87850" />}
  {[[-.4, -.3], [.3, -.45], [.35, .25], [-.2, .4]].map(([a, b], i) => <circle key={i} cx={a * r} cy={b * r} r={r * 0.11} fill="#8a5d3b" strokeWidth={0} />)}
  {burst > 0 && <>
    <path d={`M${r * .2} ${-r * .2} l${r * .5} ${-r * .3} l${-r * .1} ${r * .35}Z`} fill={C.ink} strokeWidth={0} />
    <path d={`M${r * .5} 0 Q${r * (1 + burst * 1.4)} ${-r * .2} ${r * (1.1 + burst * 1.6)} ${r * (.3 + burst)}`} stroke={C.yellow} strokeWidth={r * .35} fill="none" strokeLinecap="round" />
  </>}
</g>;
/** a bowl of bakso; cut=true shows the halved ball with molten cheese */
export const BaksoBowl: React.FC<{ x: number; y: number; s?: number; t: number; pull?: number }> = ({ x, y, s = 1, t, pull = 0 }) => <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
  <path d="M-205 0 Q-180 200 0 205 Q180 200 205 0 Z" fill={C.white} />
  <path d="M-176 90 Q0 150 176 90" stroke={C.red} strokeWidth={18} fill="none" />
  <ellipse rx={205} ry={55} fill="#e9b56a" />
  <Bakso x={-110} y={-20} r={52} /><Bakso x={110} y={-15} r={52} />
  {pull > 0 ? <g strokeWidth={6}>
    <path d={`M${-10 - pull * 40} -40 m-58 0 a58 58 0 0 1 58 -58 v116 a58 58 0 0 1 -58 -58Z`} fill="#a87850" />
    <path d={`M${10 + pull * 40} -40 m0 -58 a58 58 0 0 1 0 116Z`} fill="#a87850" />
    <ellipse cx={-10 - pull * 40} cy={-40} rx={14} ry={34} fill={C.yellow} />
    <ellipse cx={10 + pull * 40} cy={-40} rx={14} ry={34} fill={C.yellow} />
    <path d={`M${-10 - pull * 40} -40 Q0 ${-10 + pull * 40} ${10 + pull * 40} -40`} stroke={C.yellow} strokeWidth={22} fill="none" strokeLinecap="round" />
  </g> : <Bakso x={0} y={-40} r={58} />}
  <path d="M120 -60 Q170 -110 185 -55 Q160 -25 120 -60Z" fill={C.green} strokeWidth={5} />
  {[0, 1, 2].map(i => <path key={i} d={`M${-70 + i * 70} ${-110 - (t * 35 + i * 20) % 55} q25 -25 0 -55`} stroke="rgba(255,255,255,.85)" strokeWidth={9} fill="none" strokeLinecap="round" />)}
</g>;
const Placard: React.FC<{ x: number; y: number; text: string; t: number; fill?: string; size?: number; sync?: boolean }> = ({ x, y, text, t, fill = C.yellow, size = 38, sync }) => {
  const ph = sync ? 0 : x;
  return <g transform={`translate(${x} ${y + Math.sin(t * 7 + ph) * 10}) rotate(${Math.sin(t * 4 + ph) * 4})`}>
    <path d="M0 0 V210" stroke={C.ink} strokeWidth={22} /><path d="M0 0 V210" stroke={C.woodD} strokeWidth={10} />
    <Sticker x={0} y={0} text={text} size={size} fill={fill} t={t} />
  </g>;
};
/** toples MODAL; coins = number of coins inside */
const Jar: React.FC<{ x: number; y: number; s?: number; coins: number; t: number }> = ({ x, y, s = 1, coins, t }) => <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={7}>
  <rect x={-120} y={-170} width={240} height={270} rx={36} fill="rgba(200,235,255,.65)" />
  <rect x={-95} y={-205} width={190} height={46} rx={12} fill={C.red} />
  {Array.from({ length: coins }, (_, i) => <ellipse key={i} cx={-70 + (i * 37) % 140} cy={70 - Math.floor(i / 4) * 17} rx={28} ry={10} fill={C.yellow} strokeWidth={4} />)}
  <rect x={-80} y={-120} width={160} height={58} rx={10} fill={C.white} strokeWidth={5} />
  <T x={0} y={-78} size={40}>MODAL</T>
</g>;
/** Babe Rojali: used-cart dealer. Peci, thick moustache, white singlet, checked sarong. */
const Rojali: React.FC<{ x: number; y: number; s?: number; t: number; thumb?: boolean }> = ({ x, y, s = 1, t, thumb }) => {
  const bob = Math.sin(t * 3.5) * 4;
  return <g transform={`translate(${x} ${y + bob}) scale(${s})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
    <ellipse cx={0} cy={0} rx={110} ry={18} fill="rgba(0,0,0,0.18)" strokeWidth={0} />
    <path d="M-95 -230 L-110 -10 L110 -10 L95 -230Z" fill="#3c6e5a" />
    {[-60, -10, 40].map(k => <path key={k} d={`M${k} -225 L${k + 10} -12`} stroke="#2b5244" strokeWidth={6} />)}
    <path d="M-105 -120 L105 -120 M-108 -60 L108 -60" stroke="#2b5244" strokeWidth={6} />
    <rect x={-100} y={-450} width={200} height={240} rx={70} fill={C.white} />
    <path d="M-55 -450 Q0 -400 55 -450" fill="none" strokeWidth={6} />
    <path d="M-85 -410 L-125 -250" strokeWidth={44 + OUT * 2} strokeLinecap="round" /><path d="M-85 -410 L-125 -250" stroke="#b07a55" strokeWidth={44} strokeLinecap="round" />
    <path d={thumb ? "M85 -410 L150 -520" : "M85 -410 L125 -250"} strokeWidth={44 + OUT * 2} strokeLinecap="round" /><path d={thumb ? "M85 -410 L150 -520" : "M85 -410 L125 -250"} stroke="#b07a55" strokeWidth={44} strokeLinecap="round" />
    {thumb && <g transform="translate(155 -540)"><circle r={30} fill="#b07a55" /><rect x={-12} y={-70} width={24} height={50} rx={12} fill="#b07a55" /></g>}
    <circle cx={0} cy={-540} r={82} fill="#b07a55" />
    <path d="M-72 -580 L-66 -650 Q0 -665 66 -650 L72 -580 Q0 -595 -72 -580Z" fill={C.ink} />
    <circle cx={-28} cy={-548} r={8} fill={C.ink} strokeWidth={0} /><circle cx={28} cy={-548} r={8} fill={C.ink} strokeWidth={0} />
    <path d="M-48 -500 Q-25 -525 0 -508 Q25 -525 48 -500 Q25 -490 0 -500 Q-25 -490 -48 -500Z" fill={C.ink} strokeWidth={4} />
    <path d="M-20 -478 Q0 -466 20 -478" fill="none" strokeWidth={6} strokeLinecap="round" />
  </g>;
};

// l01–l03: open on Juned's face as the ladle drops (no text card in the first frame), winner card, united camp.
export const Hook5: React.FC<P> = ({ t, ep }) => {
  const camp = t >= c("l02") && t < c("l03"), title = t >= c("l03");
  if (camp) return <Outside>
    <Sticker x={540} y={250} text="KUBU BAKSO KOMPAK!" size={64} t={t} t0={c("l02") + 0.8} rot={-3} fill={C.yellow} />
    {[0, 1, 2].map(i => <g key={i}>
      <Placard x={200 + i * 340} y={1130} text="BAKSO KEJU" t={t} fill={C.yellow} size={34} sync />
      <Customer x={200 + i * 340} y={1760} s={0.82} t={t} body={[C.purple, C.blue, C.pink][i]} />
    </g>)}
  </Outside>;
  return <>
    <Sunburst cx={540} cy={900} a="#ffb639" b="#ff8a2b" t={t} />
    {title ? <>
      <Sticker x={540} y={250} text={`DAY ${ep.day}: BAKSO KEJU!`} size={66} t={t} t0={c("l03")} rot={-3} fill={C.yellow} />
      <Juned x={540} y={1900} s={1.2} t={t} pose="hold" mood="happy" />
      <BaksoBowl x={540} y={1560} s={0.78} t={t} />
    </> : <>
      <Juned x={540} y={1990} s={1.45} t={t} pose="stand" mood="wow" />
      {t < 1.2 && <g transform={`translate(${760 + t * 40} ${1250 + t * t * 500}) rotate(${t * 260})`} stroke={C.ink} strokeWidth={OUT}>
        <path d="M0 0 L0 -200" strokeWidth={22} strokeLinecap="round" /><path d="M0 0 L0 -200" stroke={C.grey} strokeWidth={10} strokeLinecap="round" />
        <path d="M-55 0 Q0 80 55 0Z" fill={C.grey} />
      </g>}
      <Sticker x={540} y={250} text="58 LIKE?!" size={84} t={t} t0={0.25} rot={-3} fill={C.yellow} />
      {t >= c("l01") + 1.5 && <AccountCard handle={WINNER} label="MENU KE-4 · PEMENANG IG" quote={["“Bakso keju”"]} likes={58} y={380} />}
    </>}
  </>;
};

// l04–l05: the drinks camp (14 likes on TikTok); no fridge; gorengan and nasi kuning queue up.
export const Drinks: React.FC<P> = ({ t }) => {
  const kulkas = t >= c("l05") + 1.2, antre = t >= c("l05") + 3.7;
  return <Outside id="d5-drinks">
    {!kulkas && <AccountCard handle="@kelvinharislubis" label="JUARA 2 · TIKTOK" quote={["“es teh kopi panas/dingin dan macha”"]} likes={14} y={170} />}
    {kulkas && <Sticker x={540} y={250} text={antre ? "ANTRE DULU, YE!" : "KAGA ADA KULKAS!"} size={64} t={t} t0={antre ? c("l05") + 3.7 : c("l05") + 1.2} rot={-3} fill={antre ? C.yellow : C.white} />}
    <Gerobak x={antre ? 330 : 540} y={1500} s={0.75} sign="WARUNG KOMEN" />
    {kulkas && !antre && <g transform={`translate(540 ${1270 - ev(t, c("l05") + 1.2, .4) * 60})`} stroke={C.ink} strokeWidth={OUT}>
      <rect x={-170} y={-20} width={340} height={110} rx={10} fill={C.woodD} />
      <rect x={-30} y={-5} width={60} height={50} rx={8} fill="#cdefff" strokeWidth={5} />
    </g>}
    {antre ? <>
      <Placard x={720} y={1000} text="GORENGAN" t={t} fill={C.orange} size={34} />
      <Customer x={720} y={1760} s={0.8} t={t} body={C.teal} />
      <Placard x={930} y={1080} text="NASI KUNING" t={t} fill={C.yellow} size={30} />
      <Customer x={930} y={1800} s={0.72} t={t + 1} body={C.red} />
    </> : <Juned x={830} y={1820} s={0.95} t={t} pose="scratch" mood={kulkas ? "sad" : "wow"} />}
    {antre && <Juned x={330} y={1880} s={0.8} t={t} pose="point" mood="smile" />}
  </Outside>;
};

// l06–l12: grind, shape (square!), stuff cheese in secret, boil, burst, retry, all float.
export const Cook5: React.FC<P> = ({ t }) => {
  const phase = t >= c("l12") ? "float" : t >= c("l11") ? "retry" : t >= c("l10") ? "burst" : t >= c("l09") ? "boil" : t >= c("l08") ? "stuff" : t >= c("l06") + 2.2 ? "square" : "grind";
  const text = { grind: "GILING DAGING!", square: "KOK KOTAK?!", stuff: "KEJU: RAHASIA!", boil: "AYO NGAPUNG!", burst: "KEJUNYA KABUR!", retry: "COBA LAGI...", float: "NGAPUNG SEMUA!" }[phase];
  const pot = phase === "boil" || phase === "burst" || phase === "retry" || phase === "float";
  return <Kitchen>
    <Sticker x={540} y={230} text={text} size={60} t={t} fill={phase === "float" ? C.yellow : phase === "burst" ? C.red : C.white} color={phase === "burst" ? C.white : C.ink} rot={phase === "burst" ? -4 : 0} />
    {phase === "grind" && <>
      <g transform="translate(330 1000)" stroke={C.ink} strokeWidth={OUT}>
        <rect x={-60} y={-60} width={120} height={180} rx={14} fill={C.grey} />
        <path d="M-120 -170 L120 -170 L60 -60 L-60 -60Z" fill="#cfd6df" />
        <path d={`M60 20 L${60 + 130 * Math.cos(t * 7)} ${20 + 130 * Math.sin(t * 7)}`} strokeWidth={18} strokeLinecap="round" />
        <circle cx={60 + 130 * Math.cos(t * 7)} cy={20 + 130 * Math.sin(t * 7)} r={22} fill={C.red} />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-40 + i * 16} 120 q4 ${30 + (t * 120 + i * 20) % 50} 0 ${60}`} stroke="#c47b6a" strokeWidth={12} fill="none" strokeLinecap="round" />)}
        <ellipse cx={0} cy={230} rx={150} ry={34} fill={C.white} />
      </g>
      <Juned x={760} y={1780} s={1.05} t={t} pose="hammer" mood="hot" />
    </>}
    {phase === "square" && <>
      <Bakso x={430} y={940} r={110} square rot={Math.sin(t * 3) * 6} />
      <Juned x={760} y={1780} s={1.05} t={t} pose="scratch" mood="wow" />
    </>}
    {phase === "stuff" && <>
      <Bakso x={400} y={960} r={120} />
      <g transform={`translate(${400 + 160 * (1 - ev(t, c("l08") + .3, .8))} ${960 - 20})`} stroke={C.ink} strokeWidth={6}><rect x={-30} y={-24} width={60} height={48} rx={6} fill={C.yellow} /></g>
      <Juned x={760} y={1780} s={1.05} t={t} pose="hold" mood={t >= c("l08") + 1.4 ? "smile" : "focus"} flip={t >= c("l08") + 1.4 && Math.sin(t * 6) > 0} />
    </>}
    {pot && <>
      <g stroke={C.ink} strokeWidth={OUT}>
        <rect x={110} y={1000} width={500} height={110} rx={18} fill="#5b6b7a" />
        {[0, 1, 2, 3].map(i => <path key={i} d={`M${190 + i * 100} 1005 q${Math.sin(t * 14 + i) * 10} -40 0 -60`} stroke={i % 2 ? C.orange : C.yellow} strokeWidth={16} fill="none" strokeLinecap="round" />)}
        <path d="M80 660 L640 660 L610 960 Q360 1000 110 960Z" fill="#9aa6b8" />
        <ellipse cx={360} cy={660} rx={280} ry={60} fill="#d6eefc" />
      </g>
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={130 + i * 75} cy={660 + Math.sin(t * 9 + i) * 8} r={10 + (i % 3) * 4} fill="none" stroke="#fff" strokeWidth={5} />)}
      {phase === "boil" && [0, 1, 2].map(i => <Bakso key={i} x={240 + i * 120} y={700 - ev(t, c("l09") + .3 + i * .2, 1.2) * 40} r={44} />)}
      {phase === "burst" && <>
        <Bakso x={240} y={700} r={44} /><Bakso x={360} y={690} r={44} burst={ev(t, c("l10") + .1, .8)} /><Bakso x={480} y={700} r={44} />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${330 + i * 25} 640 q20 ${-40 - i * 10} 50 -30`} stroke={C.yellow} strokeWidth={14} fill="none" strokeLinecap="round" opacity={ev(t, c("l10") + .3, .5)} />)}
      </>}
      {(phase === "retry" || phase === "float") && [0, 1, 2, 3].map(i => <Bakso key={i} x={200 + i * 105} y={phase === "float" ? 640 + Math.sin(t * 4 + i) * 8 : 720} r={44} />)}
      {[0, 1, 2].map(i => <path key={i} d={`M${200 + i * 140} ${560 - (t * 55 + i * 40) % 160} q30 -35 0 -75 q-30 -35 0 -75`} stroke="rgba(255,255,255,.9)" strokeWidth={10} fill="none" strokeLinecap="round" />)}
      <Juned x={830} y={1800} s={0.95} t={t} pose={phase === "float" ? "proud" : phase === "retry" ? "scratch" : "point"} mood={phase === "burst" ? "wow" : phase === "retry" ? "sad" : phase === "float" ? "happy" : "focus"} />
    </>}
  </Kitchen>;
};

// l13–l15: cheese pull, finger counting 11 → the real count 673, coins into the MODAL jar.
export const Serve: React.FC<P> = ({ t }) => {
  const count = t >= c("l14"), jar = t >= c("l15");
  const flipT = c("l14") + 2.2;
  const n = t < flipT ? 11 : Math.round(11 + (PELANGGAN - 11) * ev(t, flipT, 1.0));
  if (!count) return <>
    <Sunburst cx={540} cy={1000} a="#ffd36b" b="#ffb639" t={t} />
    <Sticker x={540} y={260} text="KEJUNYA MELELEH!" size={66} t={t} t0={c("l13") + .4} rot={-3} />
    <BaksoBowl x={430} y={900} s={1.45} t={t} pull={ev(t, c("l13") + .3, 1.2)} />
    <Juned x={800} y={1880} s={0.85} t={t} pose="point" mood="happy" />
  </>;
  return <Outside id="d5-serve">
    <Gerobak x={260} y={1560} s={0.7} sign="WARUNG KOMEN" />
    {!jar ? <>
      <Sticker x={540} y={250} text={t >= flipT ? "HITUNG BENER!" : "NGITUNG PAKE JARI..."} size={60} t={t} fill={t >= flipT ? C.yellow : C.white} />
      <g transform="translate(540 600)">
        <rect x={-330} y={-110} width={660} height={220} rx={30} fill={C.chalk} stroke={C.ink} strokeWidth={OUT} />
        <T x={0} y={-35} size={48} color={C.white}>PELANGGAN</T>
        <T x={0} y={75} size={110} color={C.yellow}>{n}</T>
      </g>
      <Juned x={760} y={1820} s={1.0} t={t} pose={t >= flipT ? "proud" : "point"} mood={t >= flipT ? "wow" : "focus"} />
      {t < flipT && <T x={760} y={1080} size={70} color={C.blueD}>{`${Math.min(11, 1 + Math.floor((t - c("l14")) * 6))}?`}</T>}
    </> : <>
      <Sticker x={540} y={250} text="TABUNGAN CABANG 2" size={60} t={t} t0={c("l15")} fill={C.yellow} />
      <Jar x={540} y={1100} s={1.4} coins={3 + Math.floor(ev(t, c("l15") + .3, 1.0) * 10)} t={t} />
      {Array.from({ length: 4 }, (_, i) => { const k = ev(t, c("l15") + .3 + i * .18, .4); return k < 1 && <ellipse key={i} cx={480 + i * 40} cy={600 + k * 300} rx={28} ry={10} fill={C.yellow} stroke={C.ink} strokeWidth={4} />; })}
      <Juned x={820} y={1840} s={0.95} t={t} pose="hold" mood="happy" />
    </>}
  </Outside>;
};

// l17–l18: Babe Rojali's used-cart lot; the second cart with a red ribbon, promised at 1.000.
export const Lapak: React.FC<P> = ({ t }) => {
  const promise = t >= c("l18");
  return <>
    <Sky a="#ffd27a" b="#fff1c2" id="d5-lapak" /><Ground y={1300} color="#ccb18b" />
    <Sticker x={540} y={240} text={promise ? "1.000 PELANGGAN = GEROBAK KE-2" : "BABE ROJALI"} size={promise ? 48 : 66} t={t} t0={promise ? c("l18") : c("l17") + .3} fill={promise ? C.yellow : C.white} />
    {promise && <Sticker x={540} y={370} text="(NYICIL!)" size={40} t={t} t0={c("l18") + 2.4} fill={C.white} rot={4} />}
    <Gerobak x={620} y={1400} s={0.62} sign={promise ? "CABANG 2" : "DIJUAL"} />
    {promise && <g stroke={C.ink} strokeWidth={6}>
      <path d="M450 1250 L790 1250" stroke={C.red} strokeWidth={24} />
      <path d="M620 1250 l-60 -50 l0 100Z M620 1250 l60 -50 l0 100Z" fill={C.red} />
    </g>}
    <Rojali x={250} y={1700} s={0.95} t={t} thumb={promise} />
    <Juned x={850} y={1840} s={0.85} t={t} pose={promise ? "proud" : "scratch"} mood={promise ? "wow" : "smile"} />
  </>;
};

// l19–l22: PELANGGAN 673 / 1.000 → CABANG 2, follow CTA, menu board 1–4, vote for menu #5.
export const Closing5: React.FC<P> = ({ t, ep }) => {
  const menu = t >= c("l21"), cta = t >= c("l22");
  if (!menu) {
    const fill = clamp(PELANGGAN / TARGET) * ev(t, c("l19") - .3, 1.2);
    const follow = t >= c("l20");
    return <>
      <Sunburst cx={540} cy={900} a="#ffd36b" b="#ffb639" t={t} />
      <Sticker x={540} y={240} text={follow ? "FOLLOW = JADI PELANGGAN" : `KURANG ${TARGET - PELANGGAN} LAGI!`} size={follow ? 54 : 66} t={t} t0={follow ? c("l20") : c("l19")} fill={follow ? C.red : C.yellow} color={follow ? C.white : C.ink} rot={-2} />
      <g transform="translate(540 620)">
        <rect x={-460} y={-170} width={920} height={340} rx={34} fill={C.chalk} stroke={C.ink} strokeWidth={OUT} />
        <T x={0} y={-90} size={50} color={C.white}>PELANGGAN → CABANG 2</T>
        <T x={0} y={20} size={96} color={C.yellow}>{`${PELANGGAN} / 1.000`}</T>
        <rect x={-400} y={65} width={800} height={64} rx={32} fill="#0f4434" stroke={C.white} strokeWidth={5} />
        <rect x={-396} y={69} width={792 * fill} height={56} rx={28} fill={C.orange} />
        <T x={0} y={113} size={38} color={C.white}>{`${Math.round(fill * 100)}%`}</T>
      </g>
      <Gerobak x={300} y={1680} s={0.6} sign="WARUNG KOMEN" />
      <Juned x={790} y={1800} s={0.9} t={t} pose={follow ? "point" : "wave"} mood="happy" />
    </>;
  }
  return <>
    <Sunburst cx={540} cy={800} a="#ffd36b" b="#ffb639" t={t} />
    <Sticker x={540} y={230} text={cta ? "ADU LIKE: MENU KE-5" : "MENU KEEMPAT RESMI!"} size={62} t={t} />
    <Board x={105} y={350} w={870} h={665}>
      <T x={540} y={490} size={64} color={C.white}>MENU WARUNG KOMEN</T>
      {ep.menu.map((m, i) => <T key={m} x={170} y={610 + i * 90} size={60} color={C.yellow} anchor="start">{`${i + 1}. ${m}`}</T>)}
      <T x={170} y={610 + ep.menu.length * 90} size={60} color={cta ? C.white : "rgba(255,255,255,.35)"} anchor="start">{`${ep.menu.length + 1}. ???`}</T>
    </Board>
    {cta && <>
      <Sticker x={540} y={1090} text="LIKE TERBANYAK = GW MASAK!" size={44} fill={C.red} color={C.white} t={t} t0={c("l22")} />
      <Sticker x={540} y={1200} text="TUTUP SABTU 14/11, 17.00 WIB" size={38} fill={C.white} t={t} t0={c("l22") + .6} />
    </>}
    <Gerobak x={270} y={1780} s={0.55} sign={ep.warung} />
    <Juned x={800} y={1880} s={0.68} t={t} pose={cta ? "point" : "wave"} mood="happy" />
  </>;
};
