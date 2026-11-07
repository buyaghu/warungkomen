import React from "react";
import { C, H, OUT, VW, W, clamp, ev, past, pop, springTo } from "../lib";
import { Birds, Caption, Cat, Cloud, Gerobak, Ground, Sky, Sticker, Sunburst, T } from "../Props";
import { Juned } from "../Juned";
import type { Episode } from "../episode";

type P = { t: number; ep: Episode };

// 1. THE DREAM — a restaurant with 100 branches, a queue, fireworks; rewind at the end
export const Dream: React.FC<P> = ({ t, ep }) => {
  const rw = ev(t, 4.2, 0.55);
  return (
    <g>
      <Sunburst cx={540} cy={620} a="#ffb21e" b="#ff8a1f" t={t} />
      {Array.from({ length: 5 }, (_, i) => {
        const k = ev(t, 0.4 + i * 0.75, 0.6); if (k <= 0 || k >= 1) return null;
        const cx = [220, 820, 380, 700, 540][i], cy = [330, 380, 460, 300, 420][i];
        return <g key={i}>{Array.from({ length: 10 }, (_, j) => { const a = j / 10 * Math.PI * 2; return <circle key={j} cx={cx + Math.cos(a) * 110 * k} cy={cy + Math.sin(a) * 110 * k} r={14 * (1 - k) + 4} fill={[C.white, C.yellow, C.pink][j % 3]} />; })}</g>;
      })}
      {/* the restaurant */}
      <g stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
        <rect x={110} y={720} width={860} height={640} rx={14} fill={C.cream} />
        <path d="M70 745 L1010 745 L960 640 L120 640 Z" fill={C.red} />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${70 + i * 94} 745 q47 44 94 0`} fill={i % 2 ? C.white : C.red} />)}
        {[170, 390, 690].map((wx, i) => (
          <g key={i}>
            <rect x={wx} y={860} width={190} height={170} rx={12} fill="#7fe0ff" />
            <circle cx={wx + 95} cy={945} r={30} fill={[C.skin, "#efc19e", "#8a5638"][i]} />
            <rect x={wx + 55} y={975} width={80} height={55} rx={24} fill={[C.purple, C.teal, C.pink][i]} />
          </g>
        ))}
        <rect x={450} y={1110} width={180} height={250} rx={10} fill={C.woodD} />
      </g>
      {/* the big sign (orange = the warung) */}
      <g transform={`translate(540 560) scale(${pop(t, 0.3)})`}>
        <rect x={-370} y={-95} width={740} height={180} rx={24} fill={C.orange} stroke={C.ink} strokeWidth={OUT} />
        <T x={0} y={30} size={88} color={C.white} stroke={C.ink}>{ep.warung}</T>
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-340 + i * 52} cy={-95} r={10} fill={(Math.floor(t * 12) + i) % 4 < 2 ? C.yellow : C.white} stroke={C.ink} strokeWidth={4} />)}
      </g>
      <Sticker x={760} y={810} text="100 CABANG!" size={52} t={t} t0={1.2} rot={7} />
      <Ground y={1340} color="#ffd08a" />
      {/* the queue */}
      {Array.from({ length: 6 }, (_, i) => {
        const hop = (Math.floor(t * 12) + i * 3) % 18 < 2 ? -10 : 0;
        return (
          <g key={i} transform={`translate(${640 + i * 72} ${1500 + hop})`} stroke={C.ink} strokeWidth={6}>
            <rect x={-34} y={-60} width={68} height={90} rx={30} fill={[C.blue, C.green, C.purple, C.pink, "#ffb703", C.teal][i]} />
            <circle cx={0} cy={-90} r={34} fill={["#efc19e", C.skin, "#8a5638"][i % 3]} />
            <path d="M-12 -84 q12 12 24 0" fill="none" strokeWidth={5} />
          </g>
        );
      })}
      <Juned x={320} y={1620} s={0.95} t={t} pose="proud" mood="happy" hat="chef" />
      {rw > 0 ? (
        <g>
          <rect x={0} y={0} width={W} height={H} fill={`rgba(30,20,40,${0.4 * rw})`} />
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={0} y={((Math.floor(t * 12) * 131 + i * 397) % H)} width={W} height={6 + (i % 3) * 6} fill="rgba(255,255,255,0.4)" />)}
          <Sticker x={470} y={900} text="◀◀ MUNDUR" size={92} fill={C.white} t={t} />
        </g>
      ) : (
        <Sticker x={390} y={340} text="suatu hari nanti..." size={56} fill={C.white} t={t} t0={0.1} rot={-4} />
      )}
    </g>
  );
};

// 2. DAY 1 — an empty lot, crickets; Juned walks in with a box
export const Lot: React.FC<P> = ({ t, ep }) => {
  const x = springTo(t, 6.4, 1300, 520);
  const step = t < 7.3 ? Math.abs(Math.sin(t * 10)) * 14 : 0;
  return (
    <g>
      <Sky a={C.sky} b={C.skyL} id="ltSky" />
      <Cloud x={250} y={420} /><Cloud x={820} y={560} s={0.7} />
      <Birds y={700} t={t} />
      <Ground y={1180} color={C.green} dark={C.greenD} />
      <g stroke={C.ink} strokeWidth={OUT}>
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={40 + i * 130} y={1080} width={26} height={170} rx={6} fill="#e8b77a" />)}
        <rect x={20} y={1120} width={1040} height={24} rx={8} fill={C.wood} />
        <rect x={290} y={1040} width={18} height={420} fill={C.woodD} />
      </g>
      <Sticker x={300} y={1010} text="TANAH KOSONG" size={46} fill={C.white} t={t} rot={-3} />
      {Math.floor(t * 4) % 2 === 0 && <><T x={680} y={1330} size={46} color={C.greenD} rot={-6}>krik</T><T x={790} y={1290} size={36} color={C.greenD} rot={6}>krik</T></>}
      <Cat x={860} y={1420} s={0.8} t={t} />
      <Juned x={x} y={1640 - step} s={0.9} t={t} pose="hold" mood={past(t, VW("day1", "ini")) ? "smile" : "focus"}>
        <rect x={-90} y={-420} width={180} height={130} rx={10} fill="#d7a868" stroke={C.ink} strokeWidth={OUT} />
      </Juned>
      <Sticker x={230} y={360} text={`DAY ${ep.day}`} size={110} t={t} t0={VW("day1", "hari")} rot={-5} />
      <Caption text="tapi itu nanti." t={t} t0={4.85} />
    </g>
  );
};

// 3. LAID OFF — in front of the office, a box of his things, a rain cloud of his own
export const Office: React.FC<P> = ({ t }) => {
  const sad = past(t, VW("phk", "lalu"));
  const rc = pop(t, VW("phk", "kena"));
  return (
    <g>
      <Sky a="#7fa7d9" b="#c9dcf2" id="ofSky" />
      <g stroke={C.ink} strokeWidth={OUT}>
        <rect x={90} y={300} width={900} height={1000} rx={14} fill={C.grey} />
        {Array.from({ length: 16 }, (_, i) => { const r = Math.floor(i / 4), c = i % 4; return <rect key={i} x={150 + c * 210} y={380 + r * 200} width={150} height={130} rx={8} fill={(r + c + Math.floor(t * 3)) % 5 === 0 ? "#ffe78a" : "#5c7fb0"} />; })}
      </g>
      <Sticker x={540} y={290} text="PT. MAJU MUNDUR" size={56} fill={C.white} t={t} />
      <Ground y={1300} color="#c9c4bc" />
      {Array.from({ length: 6 }, (_, i) => {
        const k = ((t * 0.25 + i * 0.17) % 1);
        return <rect key={i} x={-35} y={-45} width={70} height={90} rx={4} fill={C.white} stroke={C.ink} strokeWidth={5}
          transform={`translate(${120 + ((i * 167) % 820) + Math.sin(t * 2 + i) * 50} ${400 + k * 850}) rotate(${(k * 6 + i) * 57})`} />;
      })}
      <Juned x={540} y={1660} s={0.95} t={t} pose="hold" mood={sad ? "sad" : "smile"}>
        <g stroke={C.ink} strokeWidth={OUT} transform="translate(0 90)">
          <path d="M-40 -420 q-30 -80 10 -110 q30 40 -10 110 M0 -420 q40 -90 70 -60 q-10 50 -70 60" fill={C.green} />
          <rect x={30} y={-470} width={70} height={80} rx={10} fill={C.yellow} />
          <rect x={-140} y={-420} width={280} height={150} rx={12} fill="#d7a868" />
        </g>
      </Juned>
      {rc > 0 && (
        <g>
          <g transform={`translate(540 840) scale(${rc})`}><Cloud x={0} y={0} s={1.2} /></g>
          {Array.from({ length: 9 }, (_, i) => { const y = (t * 900 + i * 70) % 300; return <path key={i} d={`M${460 + i * 20} ${880 + y} l-5 30`} stroke={C.blue} strokeWidth={7} strokeLinecap="round" />; })}
        </g>
      )}
      <Caption text={sad ? "kena PHK..." : "nama saya Juned"} t={t} t0={9.3} />
    </g>
  );
};

// 4. RP500K — the envelope, five notes counted out, then the classified ad for a cart
export const Modal: React.FC<P> = ({ t }) => {
  const t0 = VW("modal", "lima"), ad = pop(t, VW("modal", "gerobak"));
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={C.wood} />
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M0 ${i * 90 + 30} Q540 ${i * 90 + 50} 1080 ${i * 90 + 25}`} stroke="rgba(120,60,20,0.25)" strokeWidth={4} fill="none" />)}
      <g stroke={C.ink} strokeWidth={OUT}>
        <rect x={80} y={140} width={400} height={300} rx={8} fill={C.white} />
        <rect x={820} y={300} width={110} height={130} rx={18} fill={C.blue} />
        <rect x={160} y={520} width={620} height={360} rx={16} fill="#f3e3c0" />
        <path d="M160 530 L470 740 L780 530" fill="#e6d0a3" />
      </g>
      <T x={470} y={835} size={60}>PESANGON</T>
      {Array.from({ length: 5 }, (_, i) => {
        const k = pop(t, t0 + i * 0.2); if (k <= 0) return null;
        return (
          <g key={i} transform={`translate(${300 + i * 95} 1090) rotate(${-14 + i * 7}) scale(${k})`}>
            <rect x={-150} y={-75} width={300} height={150} rx={12} fill="#f0727a" stroke={C.ink} strokeWidth={OUT} />
            <T x={0} y={18} size={50} color="#7a1f28">100.000</T>
          </g>
        );
      })}
      {ad > 0 && (
        <g transform={`translate(540 1330) rotate(2) scale(${ad})`}>
          <rect x={-310} y={-160} width={620} height={320} rx={14} fill={C.paper} stroke={C.ink} strokeWidth={OUT} />
          <T x={0} y={-95} size={44}>DIJUAL: GEROBAK BEKAS</T>
          <Gerobak x={-150} y={130} s={0.3} />
          <T x={130} y={50} size={62} color={C.red}>Rp500.000</T>
        </g>
      )}
      <g transform={`translate(1000 ${1150 + Math.sin(t * 6) * 10})`} stroke={C.ink} strokeWidth={OUT}>
        <path d="M0 0 L200 30" strokeWidth={90 + OUT * 2} strokeLinecap="round" />
        <path d="M0 0 L200 30" stroke={C.teal} strokeWidth={90} strokeLinecap="round" />
        <ellipse cx={-40} cy={-6} rx={50} ry={40} fill={C.skin} />
      </g>
      {/* no caption here: the classified ad says it, and a caption would cover it on TikTok */}
    </g>
  );
};

// 5. BUILDING THE CART — a time-lapse; the bent wheel tilts it; the bell rings
export const Build: React.FC<P> = ({ t }) => {
  const hrs = 8 + clamp((t - 20.25) / 6.5) * 9;
  const parts = Math.min(9, 1 + Math.floor(clamp((t - 20.3) / 1.9) * 9));
  const miring = VW("gerobak", "miring");
  const tilt = t < miring ? 0 : springTo(t, miring, 0, 4, 6);
  const happy = past(t, VW("gerobak", "namanya")), bell = VW("gerobak", "usaha");
  const ah = (hrs % 12) / 12 * 360, am = (hrs % 1) * 360;
  return (
    <g>
      <Sky a={C.sky} b={C.skyL} id="bdSky" />
      <Cloud x={200 + ((t * 120) % 900)} y={420} s={0.9} />
      <Ground y={1250} color={C.green} dark={C.greenD} />
      <g transform="translate(880 420)" stroke={C.ink} strokeWidth={OUT}>
        <circle r={100} fill={C.white} />
        <path d={`M0 0 L${Math.sin(ah * Math.PI / 180) * 50} ${-Math.cos(ah * Math.PI / 180) * 50}`} strokeWidth={12} strokeLinecap="round" />
        <path d={`M0 0 L${Math.sin(am * Math.PI / 180) * 75} ${-Math.cos(am * Math.PI / 180) * 75}`} strokeWidth={8} strokeLinecap="round" />
      </g>
      <Sticker x={880} y={570} text="TIMELAPSE" size={34} fill={C.white} t={t} />
      <Gerobak x={470} y={1360} parts={parts} tilt={tilt} />
      {t >= miring && t < miring + 1.3 && <Sticker x={330} y={1000} text="TOING!" size={64} t={t} t0={miring} rot={8} />}
      {t >= bell && t < bell + 1.5 && <T x={420} y={760} size={70} rot={-6} color={C.ink} stroke={C.white}>ting! ting!</T>}
      <Juned x={860} y={1660} s={0.85} t={t} pose={happy ? "proud" : "hammer"} mood={happy ? "happy" : "focus"} />
      <Caption text={happy ? "namanya juga usaha" : "gerobak bekas, roda miring"} t={t} t0={20.3} />
    </g>
  );
};
