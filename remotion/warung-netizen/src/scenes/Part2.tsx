import React from "react";
import { C, FONT, H, OUT, VW, W, ev, past, pop } from "../lib";
import { Board, Birds, Caption, Cat, Cloud, Gerobak, Ground, Sky, Sticker, T } from "../Props";
import { Juned } from "../Juned";
import type { Episode } from "../episode";

type P = { t: number; ep: Episode };
export const STAMP_T = 36.25;

// a write-on: clip a text by fraction (chalk / pencil)
const WriteOn: React.FC<{ id: string; x: number; y: number; size: number; frac: number; color: string; children: string }> = ({ id, x, y, size, frac, color, children }) => (
  <g>
    <defs><clipPath id={id}><rect x={x - 10} y={y - size * 1.1} width={(children.length * size * 0.62 + 20) * Math.max(0, Math.min(1, frac))} height={size * 1.5} /></clipPath></defs>
    <text clipPath={`url(#${id})`} x={x} y={y} fontFamily={FONT} fontSize={size} fontWeight={700} fill={color}>{children}</text>
  </g>
);

// 6. THE BOARD — customers 0, takings Rp0, in chalk
export const Papan: React.FC<P> = ({ t }) => {
  const a = VW("papan", "pelanggan"), b = VW("papan", "omzet");
  const cx = t < b ? 190 + 710 * ev(t, a - 0.1, 0.9) : 190 + 710 * ev(t, b - 0.1, 0.9), cy = t < b ? 650 : 1050;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={C.woodD} />
      <Board x={90} y={380} w={900} h={1000}>
        <WriteOn id="p1" x={190} y={640} size={92} frac={ev(t, a - 0.1, 0.5)} color={C.white}>PELANGGAN:</WriteOn>
        <WriteOn id="p1n" x={700} y={830} size={180} frac={ev(t, VW("papan", "nol"), 0.25)} color={C.yellow}>0</WriteOn>
        <WriteOn id="p2" x={190} y={1040} size={92} frac={ev(t, b - 0.1, 0.4)} color={C.white}>OMZET:</WriteOn>
        <WriteOn id="p2n" x={540} y={1240} size={160} frac={ev(t, VW("papan", "nol", 1), 0.3)} color={C.yellow}>Rp0</WriteOn>
      </Board>
      <rect x={cx} y={cy} width={90} height={28} rx={10} fill={C.white} stroke={C.ink} strokeWidth={6} transform={`rotate(-28 ${cx} ${cy})`} />
      <g transform={`translate(${820 + Math.sin(t * 5.3) * 60} ${300 + Math.sin(t * 8.1) * 30})`}>
        <circle r={9} fill={C.ink} /><ellipse cx={-7} cy={-10} rx={9} ry={5} fill="rgba(255,255,255,0.8)" stroke={C.ink} strokeWidth={2} /><ellipse cx={7} cy={-10} rx={9} ry={5} fill="rgba(255,255,255,0.8)" stroke={C.ink} strokeWidth={2} />
      </g>
      {/* Juned peeks in from the side, talking */}
      <Juned x={990} y={1900} s={0.7} t={t} pose="point" mood="sad" flip />
    </g>
  );
};

// 7. THE MENU — empty board, Juned scratching his head; silence; STAMP
export const Menu: React.FC<P> = ({ t, ep }) => {
  const after = past(t, STAMP_T);
  const gk = (t - 34.4) / 1.7, lf = (t - 33.0) / 3.2;
  const fall = t >= STAMP_T - 0.25 && !after ? (t - (STAMP_T - 0.25)) / 0.25 : 0;
  const bk = pop(t, STAMP_T, 9);
  const shake = after && t < STAMP_T + 0.4 ? (1 - (t - STAMP_T) / 0.4) * 22 : 0;
  return (
    <g transform={`translate(${Math.sin(t * 90) * shake} ${Math.cos(t * 77) * shake})`}>
      <Sky a={C.sky} b={C.skyL} id="mnSky" />
      <Cloud x={220} y={330} s={1.1} /><Cloud x={860} y={420} s={0.8} />
      <Ground y={1250} color={C.green} dark={C.greenD} />
      <Gerobak x={720} y={1330} tilt={-2} />
      <g stroke={C.ink} strokeWidth={OUT}>
        <path d="M260 1500 L330 860" strokeWidth={22} /><path d="M560 1500 L490 860" strokeWidth={22} />
      </g>
      <Board x={170} y={640} w={480} h={640}>
        <T x={240} y={760} size={76} color={C.white} anchor="start">MENU:</T>
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M240 ${860 + i * 100} L580 ${860 + i * 100}`} stroke="rgba(255,255,255,0.4)" strokeWidth={5} strokeDasharray="14 10" />)}
      </Board>
      {gk > 0 && gk < 1 && (
        <g transform={`translate(${640 - 480 * gk} ${1000 + Math.sin(gk * 14) * 12})`} stroke={C.ink} strokeWidth={4}>
          <path d={`M30 0 Q60 ${Math.sin(t * 9) * 10} 85 6`} strokeWidth={12} strokeLinecap="round" fill="none" />
          <ellipse cx={0} cy={0} rx={36} ry={13} fill="#9bd36a" /><circle cx={-24} cy={-4} r={3} fill={C.ink} />
        </g>
      )}
      {lf > 0 && lf < 1 && <ellipse cx={860 + Math.sin(lf * 9) * 60} cy={300 + 1000 * lf} rx={28} ry={12} fill="#ffb703" stroke={C.ink} strokeWidth={5} transform={`rotate(${lf * 340} ${860 + Math.sin(lf * 9) * 60} ${300 + 1000 * lf})`} />}
      <Juned x={850} y={1640} s={0.9} t={t} pose={after ? "point" : "scratch"} mood={after ? "wow" : "sad"} />
      {!after && <T x={880} y={900} size={130 * pop(t, VW("masalah", "nggak"))} color={C.ink}>?</T>}
      {/* the stamp falls, then BRAK */}
      {fall > 0 && (
        <g transform={`translate(410 ${-500 + 1300 * fall * fall})`} stroke={C.ink} strokeWidth={OUT}>
          <rect x={-150} y={-120} width={300} height={120} rx={20} fill={C.woodD} /><rect x={-180} y={0} width={360} height={60} rx={10} fill={C.red} />
        </g>
      )}
      {after && (
        <g>
          <g transform={`translate(410 960) scale(${bk})`}>
            <path d={Array.from({ length: 28 }, (_, i) => { const a = i / 28 * Math.PI * 2, r = i % 2 ? 260 : 390; return `${i ? "L" : "M"}${Math.cos(a) * r * 1.15} ${Math.sin(a) * r * 0.85}`; }).join(" ") + " Z"} fill={C.yellow} stroke={C.ink} strokeWidth={OUT} />
          </g>
          <g transform="translate(410 960) rotate(-7)">
            <rect x={-260} y={-150} width={520} height={300} rx={26} fill={C.white} stroke={C.ink} strokeWidth={OUT} />
            <rect x={-235} y={-125} width={470} height={250} rx={18} fill="none" stroke={C.red} strokeWidth={12} />
            <T x={0} y={-12} size={86} color={C.red}>{ep.stamp1}</T>
            <T x={0} y={90} size={74} color={C.red}>{ep.stamp2}</T>
          </g>
        </g>
      )}
      <Caption text={after ? "kalian yang tentukan!" : "menunya... belum ada"} t={t} t0={after ? STAMP_T + 0.6 : 30.8} />
    </g>
  );
};

// 8. THE RULES — three order slips pegged on a string
const Icon: React.FC<{ kind: string }> = ({ kind }) => (
  <g transform="translate(-320 140)" stroke={C.ink} strokeWidth={6}>
    {kind === "user" && <><circle cx={0} cy={-30} r={34} fill={C.blue} /><rect x={-50} y={8} width={100} height={60} rx={28} fill={C.blue} /><T x={66} y={-10} size={64} color={C.blue}>+</T></>}
    {kind === "chat" && <path d="M-65 -50 h130 a20 20 0 0 1 20 20 v60 a20 20 0 0 1 -20 20 h-70 l-30 30 v-30 h-30 a20 20 0 0 1 -20 -20 v-60 a20 20 0 0 1 20 -20 Z" fill={C.teal} />}
    {kind === "heart" && <path d="M0 50 C-90 -10 -60 -80 0 -40 C60 -80 90 -10 0 50 Z" fill={C.red} />}
  </g>
);
export const Rules: React.FC<P> = ({ t, ep }) => {
  const R = [
    { t: 40.0, ...ep.rules[0], icon: "user" },
    { t: VW("aturan1", "komen"), ...ep.rules[1], icon: "chat" },
    { t: VW("aturan2", "komen"), ...ep.rules[2], icon: "heart" },
  ];
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#fff1c2" />
      {Array.from({ length: 36 }, (_, i) => <rect key={i} x={i % 2 ? (i * 30) % W : 0} y={i % 2 ? 0 : i * 60} width={i % 2 ? 30 : W} height={i % 2 ? H : 30} fill="rgba(238,47,47,0.14)" />)}
      <path d="M-20 330 Q540 400 1100 330" stroke={C.ink} strokeWidth={5} fill="none" />
      {R.map((r, i) => {
        const k = pop(t, r.t); if (k <= 0) return null;
        const live = t >= r.t && (i === 2 || t < R[i + 1].t);
        return (
          <g key={i} transform={`translate(540 ${420 + i * 340}) rotate(${Math.sin(t * 3 + i) * 1.2 + (i - 1) * 1.6}) scale(${k * (live ? 1.05 : 1)})`}>
            <rect x={-414} y={8} width={840} height={280} rx={22} fill={C.ink} />
            <rect x={-420} y={0} width={840} height={280} rx={22} fill={C.white} stroke={C.ink} strokeWidth={OUT} />
            <rect x={-30} y={-28} width={60} height={56} rx={10} fill="#e8b77a" stroke={C.ink} strokeWidth={6} />
            <Icon kind={r.icon} />
            <T x={-220} y={120} size={r.a.length > 8 ? 66 : 82} anchor="start">{r.a}</T>
            <g opacity={ev(t, r.t + 0.3, 0.3)}><T x={-220} y={220} size={58} color={C.red} anchor="start">{r.b}</T></g>
          </g>
        );
      })}
      <Juned x={900} y={1900} s={0.75} t={t} pose="wave" mood="happy" />
    </g>
  );
};

// 9. THE CREDIT BOOK — empty pages; line 1 is for you
export const Bon: React.FC<P> = ({ t }) => {
  const kw = VW("bon", "kamu");
  const px = t < kw - 0.2 ? 700 : 340 + 260 * ev(t, kw - 0.2, 0.6), py = t < kw - 0.2 ? 1150 : 760;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={C.wood} />
      <g stroke={C.ink} strokeWidth={OUT}>
        <rect x={840} y={240} width={110} height={130} rx={18} fill={C.pink} />
        <rect x={60} y={200} width={260} height={160} rx={16} fill="#5b6b7a" /><rect x={90} y={230} width={200} height={70} rx={8} fill="#c8f0c0" />
        <rect x={110} y={430} width={860} height={1060} rx={20} fill={C.blue} />
        <rect x={140} y={450} width={800} height={1020} rx={10} fill={C.paper} />
      </g>
      <T x={270} y={285} size={56} anchor="end">0</T>
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M150 ${590 + i * 70} L930 ${590 + i * 70}`} stroke="rgba(47,111,224,0.3)" strokeWidth={3} />)}
      <path d="M230 450 L230 1470" stroke="rgba(238,47,47,0.5)" strokeWidth={4} />
      <T x={300} y={560} size={84} color={C.blue} anchor="start">BUKU BON</T>
      <T x={250} y={650} size={40} color="rgba(40,40,60,0.7)" anchor="start" weight={500}>No.   Nama              Utang</T>
      <T x={250} y={790} size={64} anchor="start">1.</T>
      <WriteOn id="kamu" x={340} y={790} size={76} frac={ev(t, kw - 0.2, 0.6)} color={C.red}>kamu?</WriteOn>
      {["2.", "3.", "4.", "5."].map((n, i) => <T key={n} x={250} y={930 + i * 140} size={64} color="rgba(40,40,60,0.35)" anchor="start">{n}</T>)}
      <g transform={`translate(${px} ${py}) rotate(-40)`} stroke={C.ink} strokeWidth={6}>
        <rect x={0} y={-18} width={260} height={36} rx={6} fill={C.yellow} /><path d="M0 -18 L-50 0 L0 18 Z" fill="#f1d3a6" /><path d="M-36 -6 L-50 0 L-36 6 Z" fill={C.ink} /><rect x={240} y={-18} width={30} height={36} rx={6} fill={C.pink} />
      </g>
      <Caption text={past(t, VW("bon", "halaman")) ? "halaman pertama... buat kamu" : "masih kosong"} t={t} t0={47.8} />
    </g>
  );
};

// 10. THE END — the dream, small and honest: the cart at dusk, "CABANG 1/100", customers 0 -> 1
export const End: React.FC<P> = ({ t, ep }) => {
  const one = past(t, 53.5);
  const glow = 0.5 + 0.1 * Math.sin(t * 6);
  return (
    <g>
      <Sky a="#5b2bb5" b="#ffa630" id="enSky" />
      {Array.from({ length: 18 }, (_, i) => { const k = ev(t, 53 + i * 0.15, 0.3); return k > 0 ? <path key={i} transform={`translate(${(i * 223) % 1000 + 40} ${(i * 137) % 440 + 260}) scale(${k * (1 + 0.3 * (Math.floor(t * 12 + i) % 2))})`} d="M0 -12 Q0 0 12 0 Q0 0 0 12 Q0 0 -12 0 Q0 0 0 -12 Z" fill={C.white} /> : null; })}
      <circle cx={860} cy={560} r={70} fill="#ffd98a" stroke={C.ink} strokeWidth={OUT} />
      <Birds y={640} t={t} />
      <Ground y={1300} color="#2f9e5a" dark="#237a45" />
      <defs><radialGradient id="glow"><stop offset="0" stopColor={`rgba(255,214,120,${glow})`} /><stop offset="1" stopColor="rgba(255,214,120,0)" /></radialGradient></defs>
      <circle cx={560} cy={800} r={440} fill="url(#glow)" />
      <Gerobak x={560} y={1290} s={0.95} sign={ep.warung} lamp />
      <Sticker x={560} y={600} text={`CABANG ${ep.cabang}`} size={64} t={t} t0={VW("akhir", "cabang")} rot={-4} />
      <Board x={60} y={960} w={260} h={210}>
        <T x={190} y={1030} size={32} color={C.white}>PELANGGAN</T>
        <T x={190} y={1135} size={96} color={one ? C.yellow : C.white}>{one ? ep.pelangganAkhir : "0"}</T>
      </Board>
      {one && t < 54.1 && Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2, k = ev(t, 53.5, 0.6); return <circle key={i} cx={190 + Math.cos(a) * 120 * k} cy={1090 + Math.sin(a) * 120 * k} r={12 * (1 - k) + 3} fill={C.yellow} />; })}
      <Cat x={200} y={1410} s={0.75} color="#4a4550" t={t} />
      <Juned x={900} y={1660} s={0.8} t={t} pose="wave" mood="happy" />
      <Caption text="cabang pertama. 99 lagi." t={t} t0={52.8} />
    </g>
  );
};
