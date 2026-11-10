import React from "react";
import { C, H, OUT, W, clamp, ev, makeVoice, type Voice } from "../lib";
import { Board, Cloud, Gerobak, Ground, Sky, Sticker as RawSticker, Sunburst, T } from "../Props";
import { Juned } from "../Juned";
import type { Episode } from "../episode";
import { Customer, Plate } from "./Day2";
import { AccountCard } from "./Day3Layout";
import voice4 from "../data/voice-day4.json";

// Day 4: NASI DAUN JERUK. Full frame, big characters, occasional emphasis text only.
export const V4 = makeVoice(voice4 as Voice);
export const cue = (n: number) => V4.VL(`l${String(n).padStart(2, "0")}`).t0;
type P = { t: number; ep: Episode };
const Sticker: React.FC<React.ComponentProps<typeof RawSticker>> = (props) => <RawSticker {...props} w={props.w ?? Math.min(1000, props.text.length * (props.size ?? 64) * .69 + (props.size ?? 64) * 1.2)} />;
const WINNER = "@gord0nbleu_";

const Outside: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>
  <Sky a={C.sky} b={C.skyL} id="day4-sky" />
  <Cloud x={170} y={300} s={0.7} /><Cloud x={860} y={430} s={0.8} />
  <Ground y={1320} color={C.green} dark={C.greenD} />{children}
</>;
const Kitchen: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>
  <Sky a="#ffd99b" b="#fff3d6" id="day4-kitchen" />
  {[160, 400, 640, 880].map(x => <path key={x} d={`M${x} 400 V1180`} stroke="#ecc58f" strokeWidth={3} />)}
  <rect x={0} y={1110} width={W} height={H - 1110} fill={C.wood} stroke={C.ink} strokeWidth={OUT} />
  <rect x={30} y={1110} width={1020} height={60} rx={12} fill="#efb776" stroke={C.ink} strokeWidth={OUT} />{children}
</>;

/** a bunch of kaffir lime leaves: double leaves on one stem */
const Leaves: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} stroke={C.ink} strokeWidth={6} strokeLinejoin="round">
  <path d="M0 120 V-20" strokeWidth={10} />
  {[[-1, -10], [1, -40], [-1, -70], [1, -100]].map(([d, yy], i) => <g key={i} transform={`translate(0 ${yy}) scale(${d} 1) rotate(-35)`}>
    <path d="M0 0 Q30 -45 70 -20 Q55 15 0 0Z" fill={i % 2 ? C.greenD : C.green} />
    <path d="M70 -20 Q105 -60 145 -35 Q125 0 70 -20Z" fill={i % 2 ? C.green : C.greenD} />
  </g>)}
</g>;
/** one flying leaf (double lobe) */
const Leaf: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} stroke={C.ink} strokeWidth={6}>
  <path d="M-70 0 Q-35 -40 0 0 Q-35 30 -70 0Z" fill={C.green} /><path d="M0 0 Q35 -40 70 0 Q35 30 0 0Z" fill={C.greenD} />
</g>;
/** nasi daun jeruk: a dome of rice with green flecks */
export const Rice: React.FC<{ x: number; y: number; s?: number; t: number; flecks?: number }> = ({ x, y, s = 1, t, flecks = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT}>
  <path d="M-170 0 Q-150 -150 0 -160 Q150 -150 170 0Z" fill={C.paper} />
  {Array.from({ length: Math.round(16 * flecks) }, (_, i) => <rect key={i} x={-120 + (i * 61) % 240} y={-130 + (i * 37) % 120} width={22} height={7} rx={3} fill={C.greenD} strokeWidth={0} transform={`rotate(${i * 47 % 90 - 45})`} />)}
  {[0, 1, 2].map(i => <path key={i} d={`M${-60 + i * 60} ${-180 - (t * 45 + i * 25) % 60} q20 -25 0 -50`} stroke="rgba(255,255,255,.85)" strokeWidth={9} fill="none" strokeLinecap="round" />)}
</g>;
const Placard: React.FC<{ x: number; y: number; text: string; t: number; fill?: string; size?: number }> = ({ x, y, text, t, fill = C.yellow, size = 38 }) => <g transform={`translate(${x} ${y + Math.sin(t * 7 + x) * 10}) rotate(${Math.sin(t * 4 + x) * 4})`}>
  <path d="M0 0 V210" stroke={C.ink} strokeWidth={22} /><path d="M0 0 V210" stroke={C.woodD} strokeWidth={10} />
  <Sticker x={0} y={0} text={text} size={size} fill={fill} t={t} />
</g>;

// l01–l03: open on action (no text card in the first frame), then the winner.
export const Hook: React.FC<P> = ({ t, ep }) => {
  const card = t >= cue(3);
  const fly = ev(t, 0.2, 1.2);
  return <>
    <Sunburst cx={540} cy={900} a="#ffb639" b="#ff8a2b" t={t} />
    <Juned x={540} y={card ? 1880 : 1980} s={card ? 1.15 : 1.45} t={t} pose="hold" mood="wow" />
    <Leaves x={card ? 720 : 760} y={card ? 1500 : 1560} s={card ? 1.1 : 1.4} rot={20 + Math.sin(t * 5) * 4} />
    {fly < 1 && <><Leaf x={420 - fly * 330} y={900 - fly * 500} s={1 + fly * 1.6} rot={-30 - fly * 200} /><Leaf x={680 + fly * 330} y={940 - fly * 520} s={1 + fly * 1.4} rot={20 + fly * 180} /></>}
    <Sticker x={540} y={250} text={t >= cue(2) ? `DAY ${ep.day}: NASI DAUN JERUK!` : "DAUN JERUK?! BUAT NASI?!"} size={t >= cue(2) ? 56 : 66} t={t} t0={t >= cue(2) ? cue(2) : 0.1} rot={-3} fill={C.yellow} />
    {card && <AccountCard handle={WINNER} label="MENU KE-3 · PEMENANG IG" quote={["“Nasi daun jeruk bangggg, enakeunn”"]} likes={4} y={360} />}
  </>;
};

// l04–l06: TikTok likes went home; the bakso camp splits its votes.
export const Camps: React.FC<P> = ({ t }) => {
  const bakso = t >= cue(5), fight = t >= cue(6);
  return <Outside>
    <Sticker x={540} y={240} text={bakso ? "KUBU BAKSO: 4 KOMEN, 0 LIKE" : "TIKTOK: LIKE-NYA MUDIK!"} size={bakso ? 50 : 58} t={t} t0={bakso ? cue(5) : cue(4)} fill={bakso ? C.white : C.yellow} />
    {!bakso && <g transform={`translate(${540 + ev(t, cue(4) + 0.8, 1.6) * 520} 620)`}>
      <path d="M0 140 C-160 40 -130 -70 0 0 C130 -70 160 40 0 140Z" fill={C.red} stroke={C.ink} strokeWidth={OUT} />
      <path d="M60 130 l50 140 M-60 130 l-50 140" stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
      <Sticker x={0} y={-60} text="DADAH!" size={36} fill={C.white} t={t} t0={cue(4) + 0.4} />
    </g>}
    {bakso && [["BAKSO KEJU", C.yellow], ["BAKSO PEDES", C.red], ["MIE BAKSO", C.teal]].map(([label, fill], i) => {
      const push = fight ? Math.sin(t * 9 + i * 2) * 26 : 0;
      return <g key={label}>
        <Placard x={200 + i * 340 + push} y={1180} text={label} t={t} fill={fill} size={34} />
        <Customer x={200 + i * 340 + push} y={1750} s={0.82} t={t + i} body={[C.purple, C.blue, C.pink][i]} />
      </g>;
    })}
    {fight && <Sticker x={540} y={420} text="KOMPAKAN NAPA!" size={60} fill={C.red} color={C.white} t={t} t0={cue(6)} rot={-4} />}
    {!bakso && <Juned x={360} y={1800} s={1.05} t={t} pose="scratch" mood="sad" />}
  </Outside>;
};

// l07–l08: market stall, one bunch of leaves, three coins of capital.
export const Market4: React.FC<P> = ({ t, ep }) => {
  const broke = t >= cue(8);
  return <>
    <Sky a="#ffd27a" b="#fff1c2" id="d4market" /><Ground y={1300} color="#ccb18b" />
    <Sticker x={540} y={235} text={broke ? "MODAL TINGGAL RECEH!" : "SEIKAT DOANG?!"} size={62} t={t} t0={broke ? cue(8) : cue(7)} fill={broke ? C.white : C.yellow} />
    <g transform="translate(70 540)" stroke={C.ink} strokeWidth={OUT}>
      <rect x={0} y={20} width={560} height={560} fill="#c9f1cd" />
      <path d="M-15 20 L575 20 L540 -80 L20 -80Z" fill={C.teal} />
      <T x={280} y={-115} size={50}>BUMBU & DAUN</T>
      <rect x={0} y={500} width={560} height={65} fill={C.wood} />
      <Leaves x={110} y={420} s={0.55} /><Leaves x={230} y={420} s={0.55} rot={8} />
      {[0, 1, 2].map(j => <ellipse key={j} cx={350 + j * 60} cy={470} rx={28} ry={24} fill="#f3e2ff" />)}
      {[0, 1].map(j => <path key={j} d={`M${430 + j * 50} 480 L${460 + j * 50} 330`} stroke="#b6d77a" strokeWidth={16} />)}
    </g>
    <Customer x={300} y={1680} s={0.85} t={t} body={C.green} skin="#e8b48f" hair="#4b2c1c" />
    <Juned x={760} y={1790} s={1.0} t={t} pose="hold" mood={broke ? "sad" : "wow"} />
    {!broke && <Leaves x={600 - 200 * (1 - ev(t, cue(7), 0.8))} y={1470} s={0.6} rot={-10} />}
    {broke && <g transform={`translate(600 1480) rotate(${Math.sin(t * 6) * 5})`} stroke={C.ink} strokeWidth={7}>
      <rect x={-95} y={-140} width={190} height={210} rx={30} fill="rgba(200,235,255,.6)" />
      <rect x={-75} y={-170} width={150} height={40} rx={10} fill={C.red} />
      {[0, 1, 2].map(i => <ellipse key={i} cx={-40 + i * 40} cy={45 - (i % 2) * 14} rx={26} ry={10} fill={C.yellow} strokeWidth={5} />)}
      <T x={0} y={-50} size={40}>MODAL</T>
    </g>}
    <Sticker x={240} y={1850} text={`CABANG ${ep.cabang}`} size={30} fill={C.white} t={t} />
  </>;
};

// l09–l14: wash rice, wait for the cooker, slice leaves (onion tears), stir-fry, done.
export const Cook: React.FC<P> = ({ t }) => {
  const phase = t >= cue(13) ? "fry" : t >= cue(11) ? "slice" : t >= cue(10) ? "wait" : "wash";
  const done = t >= cue(14) + 1.2;
  const text = done ? "NASI DAUN JERUK JADI!" : { wash: "CUCI TIGA KALI!", wait: "NUNGGU NASI MATENG...", slice: t >= cue(12) ? "ITU BAWANGNYA!" : "IRIS TIPIS... KOK NANGIS?", fry: "WANGI EUY!" }[phase];
  return <Kitchen>
    <Sticker x={540} y={230} text={text} size={done ? 62 : 56} t={t} fill={done ? C.yellow : C.white} />
    {phase === "wash" && <>
      <Juned x={760} y={1720} s={1.05} t={t} pose="hold" mood="focus" />
      <g transform="translate(330 960) scale(0.8)" stroke={C.ink} strokeWidth={OUT}>
        <path d="M-230 0 Q-200 190 0 195 Q200 190 230 0Z" fill={C.white} />
        <path d="M-195 90 Q0 150 195 90" stroke={C.blue} strokeWidth={18} fill="none" />
        <ellipse rx={230} ry={55} fill="#e6eef2" />
        {[0, 1, 2, 3].map(i => <circle key={i} cx={-150 + i * 100} cy={-20 - Math.abs(Math.sin(t * 8 + i)) * 70} r={13} fill="#bfe6ff" strokeWidth={4} />)}
      </g>
      <T x={300} y={700} size={120} color={C.blueD}>{`${Math.min(3, 1 + Math.floor((t - cue(9)) / 1.1))}x`}</T>
    </>}
    {phase === "wait" && <>
      <g stroke={C.ink} strokeWidth={OUT}>
        <circle cx={790} cy={560} r={120} fill={C.white} />
        <path d={`M790 560 L${790 + 80 * Math.sin(t * 9)} ${560 - 80 * Math.cos(t * 9)}`} strokeWidth={10} strokeLinecap="round" />
        <path d={`M790 560 L${790 + 55 * Math.sin(t * 0.8)} ${560 - 55 * Math.cos(t * 0.8)}`} strokeWidth={12} strokeLinecap="round" />
        <rect x={150} y={880} width={330} height={230} rx={60} fill={C.white} /><ellipse cx={315} cy={880} rx={165} ry={40} fill="#e8edf1" />
        <rect x={270} y={960} width={90} height={50} rx={10} fill={C.orange} />
      </g>
      {[0, 1, 2].map(i => <path key={i} d={`M${260 + i * 55} ${830 - (t * 50 + i * 30) % 90} q25 -30 0 -60`} stroke="rgba(255,255,255,.9)" strokeWidth={12} fill="none" strokeLinecap="round" />)}
      <Juned x={720} y={1800} s={1.0} t={t} pose="scratch" mood="sad" />
    </>}
    {phase === "slice" && <>
      <rect x={110} y={980} width={520} height={130} rx={18} fill={C.woodD} stroke={C.ink} strokeWidth={OUT} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={160 + i * 32} y={1010 + (i % 3) * 18} width={26} height={8} rx={3} fill={C.green} stroke={C.ink} strokeWidth={3} />)}
      <g transform="translate(560 1010)" stroke={C.ink} strokeWidth={6}><ellipse rx={50} ry={40} fill="#d48fd0" /><path d="M-10 -40 q10 -30 25 -10" fill="none" /></g>
      <Juned x={700} y={1760} s={1.08} t={t} pose="hammer" mood={t >= cue(12) ? "smile" : "cry"} />
      {t < cue(12) + 1 && <Customer x={150} y={1780} s={0.8} t={t} body={C.purple} />}
      {t >= cue(12) && <Sticker x={300} y={820} text="KIRAIN TERHARU..." size={40} fill={C.white} t={t} t0={cue(12) + 0.3} rot={-4} />}
    </>}
    {phase === "fry" && <>
      <g stroke={C.ink} strokeWidth={OUT}>
        <rect x={110} y={960} width={470} height={150} rx={18} fill="#5b6b7a" />
        {[0, 1, 2, 3].map(i => <path key={i} d={`M${180 + i * 90} 965 q${Math.sin(t * 14 + i) * 10} -45 0 -70`} stroke={i % 2 ? C.orange : C.yellow} strokeWidth={18} fill="none" strokeLinecap="round" />)}
        <path d="M65 780 Q320 1110 600 780Z" fill="#34313c" /><ellipse cx={330} cy={780} rx={265} ry={62} fill={t >= cue(14) ? C.paper : "#d9a44f"} />
        <path d="M600 780 l150 -75" strokeWidth={30} strokeLinecap="round" />
        {t >= cue(14) && Array.from({ length: 18 }, (_, i) => <rect key={i} x={120 + (i * 23) % 420} y={760 + Math.sin(t * 7 + i) * 14} width={20} height={7} rx={3} fill={C.greenD} strokeWidth={0} />)}
        {t < cue(14) && Array.from({ length: 10 }, (_, i) => <rect key={i} x={135 + i * 40} y={765 + Math.sin(t * 7 + i) * 14} width={30} height={12} rx={5} fill={i % 3 ? C.green : "#e9d79a"} strokeWidth={3} />)}
        <path d={`M${340 + Math.sin(t * 6) * 120} 770 L${570 + Math.sin(t * 6) * 50} 510`} stroke={C.woodD} strokeWidth={23} strokeLinecap="round" />
      </g>
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${150 + i * 90} ${660 - (t * 55 + i * 40) % 160} q30 -35 0 -75 q-30 -35 0 -75`} stroke={C.green} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8} />)}
      <Juned x={800} y={1080} s={0.75} t={t} pose={done ? "proud" : "hammer"} mood={done ? "happy" : "focus"} />
      {done && <Rice x={540} y={1650} s={1.1} t={t} />}
    </>}
  </Kitchen>;
};

// l15–l17: combo plate, sate-ayam camp threatens to block, nasgor camp waits again.
export const Combo: React.FC<P> = ({ t, ep }) => {
  const blok = t >= cue(16) && t < cue(17), nasgor = t >= cue(17);
  if (!blok && !nasgor) return <>
    <Sunburst cx={540} cy={1000} a="#ffd36b" b="#ffb639" t={t} />
    <Sticker x={540} y={260} text="COMBO MENU 1 + 3!" size={70} t={t} t0={cue(15)} rot={-3} />
    <Rice x={400} y={1060} s={1.0} t={t} />
    <Plate x={640} y={1150} s={1.15} t={t} />
    <T x={260} y={1320} size={44}>NASI DAUN JERUK</T><T x={780} y={1320} size={44}>AYAM GEPREK</T>
    <Juned x={540} y={1960} s={0.95} t={t} pose="proud" mood="happy" />
  </>;
  return <Outside>
    {blok && <>
      <Sticker x={540} y={240} text="JANGAN DIBLOK, BANG!" size={62} t={t} t0={cue(16)} fill={C.white} />
      <Customer x={790} y={1760} s={1.0} t={t} body={C.blue} />
      <g transform={`translate(560 1330) scale(${1 + Math.sin(t * 10) * 0.04})`} stroke={C.ink} strokeWidth={OUT}>
        <rect x={-110} y={-20} width={220} height={90} rx={20} fill="#5b6b7a" />
        <ellipse cx={0} cy={-20} rx={95} ry={45} fill={C.red} /><T x={0} y={-5} size={46} color={C.white}>BLOK</T>
      </g>
      <Juned x={260} y={1820} s={0.95} t={t} pose="hold" mood="cry" />
    </>}
    {nasgor && <>
      <Sticker x={540} y={240} text="KUBU NASGOR: SABAR, BOS!" size={54} t={t} t0={cue(17)} fill={C.white} />
      <Gerobak x={540} y={1300} s={0.7} sign={ep.warung} />
      <Customer x={830} y={1780} s={0.9} t={t} body={C.purple} />
      <Placard x={830} y={1000} text="NASGOR KAPAN?" t={t} fill={C.teal} />
      <Juned x={290} y={1820} s={0.95} t={t} pose="scratch" mood="smile" />
      <Placard x={290} y={1000} text={t >= cue(17) + 1.2 ? "IYE, SABAR!" : "..."} t={t} />
      <T x={830} y={900} size={34} color={C.blueD}>@arcvival_2</T>
    </>}
  </Outside>;
};

// l18–l21: menu board grows to three, customers 8 → 11, vote for menu #4.
export const Closing4: React.FC<P> = ({ t, ep }) => {
  const cta = t >= cue(20);
  return <>
    <Sunburst cx={540} cy={800} a="#ffd36b" b="#ffb639" t={t} />
    <Sticker x={540} y={230} text={cta ? "ADU LIKE: MENU KE-4" : "MENU KETIGA RESMI!"} size={62} t={t} />
    <Board x={105} y={380} w={870} h={560}>
      <T x={540} y={490} size={64} color={C.white}>MENU WARUNG KOMEN</T>
      {ep.menu.map((m, i) => <T key={m} x={170} y={610 + i * 90} size={60} color={C.yellow} anchor="start">{`${i + 1}. ${m}`}</T>)}
      <T x={170} y={610 + ep.menu.length * 90} size={60} color={cta ? C.white : "rgba(255,255,255,.35)"} anchor="start">{`${ep.menu.length + 1}. ???`}</T>
    </Board>
    {cta ? <>
      <Sticker x={540} y={1040} text="KOMEN = PESEN MENU" size={48} fill={C.white} t={t} t0={cue(20)} />
      <Sticker x={540} y={1170} text="LIKE TERBANYAK = GW MASAK!" size={42} fill={C.red} color={C.white} t={t} t0={cue(21)} />
    </> : <>
      <Sticker x={540} y={1040} text={`PELANGGAN: ${t >= cue(19) ? Math.min(11, 8 + Math.floor(clamp((t - cue(19)) / 1.5) * 4)) : 8}`} size={57} fill={C.white} t={t} />
      <Sticker x={540} y={1170} text="GEROBAK MAKIN SESEK!" size={44} fill={C.white} t={t} t0={cue(18) + 0.8} rot={-3} />
    </>}
    <Gerobak x={270} y={1700} s={0.65} sign={ep.warung} />
    <Juned x={790} y={1760} s={0.78} t={t} pose={cta ? "point" : "wave"} mood="happy" />
    <Sticker x={310} y={1820} text={`CABANG ${ep.cabang}`} size={35} fill={C.white} t={t} />
  </>;
};
