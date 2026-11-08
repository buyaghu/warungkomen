import React from "react";
import { C, H, OUT, W, clamp, ev, makeVoice, type Voice } from "../lib";
import { Board, CaptionY, Cloud, Gerobak, Ground, Sky, Sticker, Sunburst, T } from "../Props";
import { Juned } from "../Juned";
import type { Episode } from "../episode";
import { Customer, NameTag } from "./Day2";
import voice3 from "../data/voice-day3.json";

export const V3 = makeVoice(voice3 as Voice);
export const cue = (n: number) => V3.VL(`l${String(n).padStart(2, "0")}`).t0;
type P = { t: number; ep: Episode };
const heroY = (ep: Episode, y: number) => y - (ep.captionY < 1400 ? 180 : 0);

// All action cues share the measured voice clock. Reusable Day 2 art stays intact.
const Outside: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>
  <Sky a={C.sky} b={C.skyL} id="day3-sky" />
  <Cloud x={170} y={300} s={0.7} /><Cloud x={860} y={430} s={0.8} />
  <Ground y={1320} color={C.green} dark={C.greenD} />{children}
</>;
const Kitchen: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>
  <Sky a="#ffd99b" b="#fff3d6" id="day3-kitchen" />
  {[160, 400, 640, 880].map(x => <path key={x} d={`M${x} 400 V1180`} stroke="#ecc58f" strokeWidth={3} />)}
  <rect x={0} y={1110} width={W} height={H - 1110} fill={C.wood} stroke={C.ink} strokeWidth={OUT} />
  <rect x={30} y={1110} width={1020} height={60} rx={12} fill="#efb776" stroke={C.ink} strokeWidth={OUT} />{children}
</>;

export const Bowl: React.FC<{ x: number; y: number; s?: number; t: number; empty?: boolean; extra?: boolean }> = ({ x, y, s = 1, t, empty, extra }) => <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
  <path d="M-205 0 Q-180 200 0 205 Q180 200 205 0 Z" fill={C.white} />
  <path d="M-176 90 Q0 150 176 90" stroke={C.blue} strokeWidth={18} fill="none" />
  <ellipse rx={205} ry={55} fill={empty ? "#edf3fa" : "#dfb04b"} />
  {!empty && <>
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-155 + (i % 3) * 100} ${-22 + Math.floor(i / 3) * 18} q35 -28 60 0 t50 -5`} stroke="#ffe496" strokeWidth={13} fill="none" />)}
    {Array.from({ length: extra ? 12 : 7 }, (_, i) => <rect key={i} x={-110 + (i * 53) % 220} y={-35 + (i % 3) * 22} width={43} height={27} rx={8} fill="#9a542a" strokeWidth={4} transform={`rotate(${i * 13 % 40 - 20})`} />)}
    <path d="M105 -5 Q165 -100 180 -40 Q185 0 125 22 Z" fill={C.green} strokeWidth={5} />
    <path d="M-140 10 Q-190 -90 -130 -55 Q-95 -40 -100 15 Z" fill={C.greenD} strokeWidth={5} />
    {[0, 1, 2].map(i => <path key={i} d={`M${-70 + i * 70} ${-95 - (t * 35 + i * 20) % 55} q25 -25 0 -55`} stroke="rgba(255,255,255,.85)" strokeWidth={9} fill="none" strokeLinecap="round" />)}
  </>}
</g>;

const AwakeCat: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 5) * 3})`} stroke={C.ink} strokeWidth={6}>
  <path d="M80 15 Q155 -55 110 -95" fill="none" strokeWidth={20} strokeLinecap="round" />
  <path d="M80 15 Q155 -55 110 -95" fill="none" stroke={C.yellow} strokeWidth={9} strokeLinecap="round" />
  <ellipse rx={85} ry={52} fill={C.yellow} /><path d="M-85 -12 L-100 -90 L-55 -63 L-12 -92 L-5 -15 Q-35 25 -85 -12Z" fill={C.yellow} />
  <circle cx={-70} cy={-40} r={6} fill={C.ink} /><circle cx={-30} cy={-40} r={6} fill={C.ink} />
  <path d="M-55 -20 l8 7 l8 -7" fill={C.pink} /><path d="M-90 -25 l-35 -10 M-90 -13 l-36 8" fill="none" strokeWidth={4} />
</g>;

const Placard: React.FC<{ x: number; y: number; text: string; t: number; fill?: string }> = ({ x, y, text, t, fill = C.yellow }) => <g transform={`translate(${x} ${y + Math.sin(t * 7) * 10}) rotate(${Math.sin(t * 4) * 3})`}>
  <path d="M0 0 V210" stroke={C.ink} strokeWidth={22} /><path d="M0 0 V210" stroke={C.woodD} strokeWidth={10} />
  <Sticker x={0} y={0} text={text} size={38} fill={fill} t={t} />
</g>;

export const Victory: React.FC<P> = ({ t, ep }) => <Outside>
  <Sticker x={260} y={205} text={`DAY ${ep.day}`} size={76} t={t} t0={0} rot={-4} />
  <Sticker x={540} y={410} text="MIE AYAM MENANG!" size={68} t={t} t0={0.15} fill={C.yellow} rot={-3} />
  <T x={540} y={550} size={38}>SATU KOMENTAR • LIKE TERBANYAK</T>
  <g transform={`translate(0 ${Math.sin(t * 5) * 4})`}>
    <Sticker x={300} y={690} text="MIE AYAM 42 ♥" size={43} fill={C.white} t={t} t0={cue(3)} />
    {t >= cue(4) && <Sticker x={770} y={690} text="NASGOR 28 ♥" size={38} fill={C.white} t={t} t0={cue(4)} />}
  </g>
  <Gerobak x={540} y={1410} s={0.75} sign={ep.warung} />
  <Customer x={160} y={1750} s={0.65} t={t} wave body={C.purple} />
  <Placard x={170} y={1010} text="AKHIRNYA!" t={t} fill={C.teal} />
  <Customer x={900} y={1750} s={0.65} t={t} wave body={C.blue} />
  <Placard x={870} y={1010} text={t >= cue(5) ? "IYE, SABAR!" : "NASGOR KAPAN?"} t={t} />
  <Juned x={520} y={heroY(ep, 1770)} s={0.87} t={t} pose={t >= cue(5) ? "wave" : "proud"} mood={t >= cue(5) ? "wow" : "happy"} />
  {t >= cue(5) && <Sticker x={540} y={800} text="CICILAN BELOM LUNAS!" size={42} fill={C.white} t={t} t0={cue(5)} rot={4} />}
  <Sticker x={240} y={1850} text={`CABANG ${ep.cabang}`} size={30} fill={C.white} t={t} />
</Outside>;

export const Leftovers: React.FC<P> = ({ t, ep }) => <Outside>
  <Sticker x={540} y={260} text="SARAN PELANGGAN" size={64} t={t} />
  <rect x={90} y={380} width={860} height={350} rx={30} fill={C.white} stroke={C.ink} strokeWidth={OUT} />
  <T x={540} y={470} size={42} color={C.blueD}>KOMENTAR PEMENANG • 42 LIKE</T>
  <T x={540} y={560} size={48}>“mie ayam aja ...</T><T x={540} y={635} size={48}>ayam sisa ... ayam geprek”</T>
  <Gerobak x={650} y={1450} s={0.9} sign={ep.warung} />
  <Juned x={300} y={heroY(ep, 1770)} s={1} t={t} pose="scratch" mood={t < cue(7) ? "wow" : "smile"} />
  {t >= cue(7) && <Sticker x={620} y={920} text="KEMAREN UDEH LUDES!" size={46} fill={C.red} color={C.white} t={t} t0={cue(7)} rot={-5} />}
  <Bowl x={800} y={1590} s={0.55} empty t={t} />
</Outside>;

const Garlic: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <path d="M0 -55 Q65 -10 35 40 Q0 65 -35 40 Q-60 0 0 -55Z" fill="#fff9df" stroke={C.ink} strokeWidth={6} />
  <path d="M0 -45 Q-5 5 15 44" fill="none" stroke="#d9b58d" strokeWidth={4} />
</g>;
export const Market: React.FC<P> = ({ t, ep }) => {
  const bonus = t >= cue(10);
  return <>
    <Sky a="#ffd27a" b="#fff1c2" id="d3market" /><Ground y={1300} color="#ccb18b" />
    <Sticker x={540} y={235} text={bonus ? "BONUS: SATU SIUNG" : "BELANJA LAGI!"} size={60} t={t} />
    {[0, 1].map(i => <g key={i} transform={`translate(${70 + i * 490} 530)`} stroke={C.ink} strokeWidth={OUT}>
      <rect x={0} y={20} width={440} height={560} fill={i ? "#c9f1cd" : "#ffd4c9"} />
      <path d="M-15 20 L455 20 L420 -80 L20 -80Z" fill={i ? C.teal : C.blue} />
      <T x={220} y={-115} size={48}>{i ? "MIE & SAYUR" : "AYAM SEGAR"}</T>
      <rect x={0} y={500} width={440} height={65} fill={C.wood} />
      {i === 0 ? [0, 1, 2].map(j => <ellipse key={j} cx={80 + j * 135} cy={470} rx={53} ry={35} fill="#f3bf96" />) : <>
        <Bowl x={120} y={440} s={0.42} t={t} /><path d="M270 500 Q220 350 280 350 Q310 340 340 370 Q380 320 390 380 L370 500Z" fill={C.green} />
      </>}
    </g>)}
    <Customer x={170} y={1660} s={0.85} t={t} body={C.purple} wave={bonus} />
    <Juned x={700} y={heroY(ep, 1770)} s={0.95} t={t} pose="hold" mood={bonus ? "focus" : "sad"} />
    {bonus ? <>
      <path d="M335 1280 Q450 1190 590 1410" stroke={C.ink} strokeWidth={40} strokeLinecap="round" fill="none" />
      <path d="M335 1280 Q450 1190 590 1410" stroke="#efc19e" strokeWidth={26} strokeLinecap="round" fill="none" />
      <Garlic x={540 + ev(t, cue(10), 0.7) * 80} y={1080 + ev(t, cue(10), 0.7) * 180} s={0.7} />
      <Sticker x={280} y={820} text="SATU SIUNG DOANG?!" size={36} fill={C.white} t={t} t0={cue(10) + 0.8} />
    </> : <g transform={`translate(${300 - ev(t, cue(8), 1) * 90} ${1210 - ev(t, cue(8), 1) * 160}) rotate(-15)`}>
      <rect x={-100} y={-45} width={200} height={90} rx={7} fill="#b0e0bd" stroke={C.ink} strokeWidth={6} /><T x={0} y={18} size={38}>Rp...</T>
    </g>}
  </>;
};

export const StirFry: React.FC<P> = ({ t }) => {
  const spill = t >= cue(12), cat = t >= cue(13);
  return <Kitchen>
    <Sticker x={540} y={240} text={spill ? "KECAPNYA KEBANYAKAN!" : "TUMIS AYAM DULU!"} size={58} t={t} />
    <Juned x={790} y={1070} s={0.75} t={t} pose="hammer" mood={spill ? "wow" : "focus"} />
    <g stroke={C.ink} strokeWidth={OUT}>
      <rect x={110} y={960} width={470} height={150} rx={18} fill="#5b6b7a" />
      {[0, 1, 2, 3].map(i => <path key={i} d={`M${180 + i * 90} 965 q${Math.sin(t * 14 + i) * 10} -45 0 -70`} stroke={i % 2 ? C.orange : C.yellow} strokeWidth={18} fill="none" strokeLinecap="round" />)}
      <path d="M65 780 Q320 1110 600 780Z" fill="#34313c" /><ellipse cx={330} cy={780} rx={265} ry={62} fill={spill ? "#4c2719" : "#c48b3d"} />
      <path d="M600 780 l150 -75" strokeWidth={30} strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={135 + i * 42} y={760 + Math.sin(t * 7 + i) * 16} width={42} height={32} rx={9} fill="#a86a35" strokeWidth={4} />)}
      <path d={`M${340 + Math.sin(t * 6) * 120} 770 L${570 + Math.sin(t * 6) * 50} 510`} stroke={C.woodD} strokeWidth={23} strokeLinecap="round" />
    </g>
    {spill && t < cue(13) && <g transform={`translate(360 470) rotate(${40 + Math.sin(t * 6) * 4})`}>
      <rect x={-40} y={-150} width={100} height={200} rx={20} fill="#4c2719" stroke={C.ink} strokeWidth={7} /><rect x={-20} y={-175} width={60} height={40} rx={7} fill={C.red} />
      <path d="M15 -170 q-60 -30 -100 25" fill="none" stroke="#4c2719" strokeWidth={18} />
    </g>}
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${130 + i * 75} ${650 - (t * 50 + i * 45) % 140} q25 -30 0 -70`} stroke="rgba(255,255,255,.8)" strokeWidth={12} fill="none" />)}
    {cat && <><AwakeCat x={260 + 110 * ev(t, cue(13), 0.8)} y={1610} t={t} /><Sticker x={480} y={365} text={t >= cue(14) ? "BAYAR PAKE MEONG?" : "MEONG!"} size={43} fill={C.white} t={t} t0={cue(13)} rot={-5} /></>}
  </Kitchen>;
};

export const NoodleTrouble: React.FC<P> = ({ t }) => {
  const pull = ev(t, cue(16), Math.max(1, cue(19) - cue(16) - 0.2));
  const done = t >= cue(19);
  const top = 810 - pull * 350;
  return <Kitchen>
    <Sticker x={540} y={230} text={done ? "JADI JUGA!" : t >= cue(17) ? "MIE APA KABEL CHARGER?!" : "REBUS, ANGKAT..."} size={done ? 82 : 53} t={t} />
    <Juned x={790} y={1110} s={0.8} t={t} pose={done ? "proud" : "hammer"} mood={done ? "happy" : "wow"} />
    {!done && <g stroke={C.ink} strokeWidth={OUT}>
      <rect x={100} y={960} width={450} height={150} rx={15} fill="#5b6b7a" />
      <path d="M120 795 L150 990 Q330 1040 510 990 L540 795Z" fill="#a6bac6" /><ellipse cx={330} cy={795} rx={210} ry={52} fill="#d9eff8" />
      {[0, 1, 2, 3].map(i => <circle key={i} cx={170 + i * 100} cy={800 - (t * 40 + i * 15) % 75} r={12} fill={C.white} strokeWidth={3} />)}
      <path d={`M240 ${top} Q330 ${top + 100} 420 ${top} L550 ${top - 75}`} fill="#c8d2db" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${280 + i * 14} ${top + 20} C${240 + Math.sin(t * 7 + i) * 40} ${top + 120},${420 + Math.cos(t * 6) * 40} 700,${280 + i * 14} 805`} stroke="#ffe184" strokeWidth={9} fill="none" />)}
      <path d={`M240 ${top} Q330 ${top + 100} 420 ${top}`} fill="none" />
    </g>}
    {done ? <Bowl x={430} y={930} s={1.25} t={t} /> : <Bowl x={780} y={1490} s={0.72} empty t={t} />}
    {!done && t >= cue(16) && <Sticker x={320} y={365} text="NYANGKUT!" size={58} fill={C.red} color={C.white} t={t} t0={cue(16)} rot={-5} />}
    {!done && t >= cue(18) && <><Customer x={920} y={1810} s={0.62} t={t} body={C.purple} /><path d="M870 1560 L790 1490" stroke={C.ink} strokeWidth={26} strokeLinecap="round" /></>}
    {done && <Sticker x={540} y={410} text="MIE AYAM • MENU KE-2" size={52} fill={C.white} t={t} t0={cue(19)} rot={-3} />}
  </Kitchen>;
};

export const SecondHelping: React.FC<P> = ({ t, ep }) => {
  const returned = t >= cue(21), relief = t >= cue(23), crowd = t >= cue(25);
  const between = ev(t, cue(21), 0.65);
  return <Outside>
    <Gerobak x={550} y={1130} s={1.05} sign={ep.warung} />
    <Sticker x={540} y={240} text={relief ? "TERNYATA MAU NAMBAH!" : returned ? "LAH, DIBALIKIN?!" : "PESENAN PERTAMA!"} size={58} t={t} fill={relief ? C.yellow : C.white} />
    <Juned x={300 + (relief ? Math.sin(t * 4) * 6 : 0)} y={heroY(ep, 1750)} s={0.92} t={t} pose={relief ? "hold" : "scratch"} mood={relief ? "happy" : returned ? "sad" : "smile"} />
    <Customer x={790} y={heroY(ep, 1740)} s={0.95} t={t} body={C.purple} wave={relief} />
    <NameTag x={790} y={ep.captionY < 1400 ? 870 : 1160} text="nazz" size={40} />
    <Bowl x={returned ? 760 - between * 220 : 680} y={1430 + Math.sin(t * 4) * 4} s={0.65} t={t} empty={returned && !relief} extra={t >= cue(24)} />
    {returned && !relief && <><T x={530} y={880} size={150} color={C.red}>?!</T><Sticker x={520} y={1120} text="GW KUAT..." size={42} fill={C.white} t={t} t0={cue(22)} /></>}
    {relief && <Sticker x={620} y={620} text={crowd ? "GW JUGA, MANG!" : "TAMBAH SATU, MANG!"} size={46} fill={C.white} t={t} t0={cue(23)} rot={-4} />}
    {crowd && <>
      {[0, 1].map(i => <g key={i} transform={`translate(${(1 - ev(t, cue(25), 0.5)) * 350} 0)`}>
        <Customer x={700 + i * 220} y={1880} s={0.62} t={t + i} body={i ? C.teal : C.blue} wave />
        <Bowl x={650 + i * 210} y={1650} s={0.38} t={t} empty />
      </g>)}
    </>}
  </Outside>;
};

export const Closing: React.FC<P> = ({ t, ep }) => {
  const cta = t >= cue(29);
  return <>
    <Sunburst cx={540} cy={800} a="#ffd36b" b="#ffb639" t={t} />
    <Sticker x={540} y={230} text={cta ? "ADU LIKE: MENU KE-3" : "DUA MENU RESMI!"} size={62} t={t} />
    <Board x={105} y={410} w={870} h={470}>
      <T x={540} y={520} size={66} color={C.white}>MENU WARUNG KOMEN</T>
      {ep.menu.map((m, i) => <T key={m} x={180} y={650 + i * 100} size={66} color={C.yellow} anchor="start">{`${i + 1}. ${m}`}</T>)}
    </Board>
    {cta ? <>
      <Sticker x={540} y={1000} text="KOMEN = PESEN MENU" size={48} fill={C.white} t={t} t0={cue(29)} />
      <Sticker x={540} y={1130} text="LIKE TERBANYAK = GW MASAK!" size={42} fill={C.red} color={C.white} t={t} t0={cue(30)} />
    </> : <>
      <Sticker x={540} y={1000} text={`PELANGGAN: ${t >= cue(27) ? Math.min(8, 5 + Math.floor(clamp((t - cue(27)) / 1.5) * 4)) : 5}`} size={57} fill={C.white} t={t} />
      {t >= cue(28) && <Sticker x={540} y={1130} text="GEROBAK MAKIN SEMPIT!" size={44} fill={C.white} t={t} t0={cue(28)} rot={-3} />}
    </>}
    <Gerobak x={270} y={1700} s={0.65} sign={ep.warung} />
    <Juned x={790} y={1760} s={ep.captionY < 1400 ? 0.6 : 0.78} t={t} pose="wave" mood="happy" />
    <Sticker x={310} y={1820} text={`CABANG ${ep.cabang}`} size={35} fill={C.white} t={t} />
  </>;
};

// Keep captions within the platform-safe width; split at word boundaries.
export const Captions3: React.FC<{ t: number }> = ({ t }) => {
  const y = React.useContext(CaptionY);
  const line = V3.V.lines.find(l => t >= l.t0 && t < l.t1 + 0.12);
  if (!line) return null;
  const words = line.text.replace(/\bgue\b/gi, "gw").split(/\s+/);
  const rows: string[] = [""];
  for (const w of words) {
    if ((rows[rows.length - 1] + " " + w).trim().length > 31) rows.push(w);
    else rows[rows.length - 1] = (rows[rows.length - 1] + " " + w).trim();
  }
  const height = rows.length * 57 + 28;
  return <g>
    <rect x={70} y={y - height / 2 + 7} width={880} height={height} rx={25} fill={C.ink} />
    <rect x={64} y={y - height / 2} width={880} height={height} rx={25} fill={C.white} stroke={C.ink} strokeWidth={7} />
    {rows.map((r, i) => <T key={i} x={504} y={y - (rows.length - 1) * 28.5 + 17 + i * 57} size={47}>{r}</T>)}
  </g>;
};
