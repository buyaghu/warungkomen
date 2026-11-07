import React from "react";
import { C, FONT, H, OUT, W, pop } from "./lib";

// ---------------------------------------------------------------------------
// Shared flat-cartoon props: sky, sunburst, ground, clouds, the cart, stickers, captions.
// ---------------------------------------------------------------------------
export const Sky: React.FC<{ a: string; b: string; id: string }> = ({ a, b, id }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill={`url(#${id})`} />
  </>
);

export const Sunburst: React.FC<{ cx: number; cy: number; a: string; b: string; t: number; n?: number }> = ({ cx, cy, a, b, t, n = 22 }) => {
  const R = 2600, rot = t * 0.15;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={a} />
      {Array.from({ length: n / 2 }, (_, i) => {
        const a0 = rot + (i * 2) / n * Math.PI * 2, a1 = a0 + Math.PI * 2 / n;
        return <path key={i} d={`M${cx} ${cy} L${cx + Math.cos(a0) * R} ${cy + Math.sin(a0) * R} L${cx + Math.cos(a1) * R} ${cy + Math.sin(a1) * R} Z`} fill={b} />;
      })}
    </g>
  );
};

export const Ground: React.FC<{ y: number; color: string; dark?: string }> = ({ y, color, dark }) => (
  <g>
    <path d={`M-20 ${y + 20} Q300 ${y - 20} 600 ${y + 10} T1100 ${y} L1100 ${H + 20} L-20 ${H + 20} Z`} fill={color} stroke={C.ink} strokeWidth={OUT} />
    {dark && Array.from({ length: 14 }, (_, i) => (
      <path key={i} d={`M${(i * 97) % 1040 + 30} ${y + 120 + ((i * 53) % 380)} l12 -26 l12 26`} stroke={dark} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ))}
  </g>
);

export const Cloud: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={C.white} stroke={C.ink} strokeWidth={OUT / s}>
    <path d="M-110 30 Q-120 -10 -70 -14 Q-60 -60 -5 -52 Q40 -80 75 -38 Q125 -40 118 10 Q130 34 96 38 L-96 38 Q-120 38 -110 30 Z" />
  </g>
);

export const Birds: React.FC<{ y: number; t: number }> = ({ y, t }) => (
  <g>
    <path d={`M-20 ${y} Q400 ${y + 40} 1100 ${y - 10}`} stroke={C.ink} strokeWidth={4} fill="none" />
    {[180, 245, 310].map((bx, i) => {
      const hop = (Math.floor(t * 12) + i * 5) % 29 < 2 ? -10 : 0;
      return (
        <g key={i} transform={`translate(${bx} ${y + 2 + i * 4 + hop})`}>
          <ellipse cx={0} cy={-16} rx={22} ry={17} fill={C.blueD} stroke={C.ink} strokeWidth={5} />
          <circle cx={9} cy={-22} r={4} fill={C.white} /><path d="M20 -18 l10 3 l-10 3 Z" fill={C.yellow} />
        </g>
      );
    })}
  </g>
);

// text helpers
export const T: React.FC<{ x: number; y: number; size: number; color?: string; anchor?: "start" | "middle" | "end"; weight?: number; children: React.ReactNode; stroke?: string; rot?: number }> =
  ({ x, y, size, color = C.ink, anchor = "middle", weight = 700, children, stroke, rot = 0 }) => (
    <text x={x} y={y} fontFamily={FONT} fontSize={size} fontWeight={weight} fill={color} textAnchor={anchor} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}
      stroke={stroke} strokeWidth={stroke ? size * 0.16 : undefined} paintOrder="stroke" strokeLinejoin="round">
      {children}
    </text>
  );

/** a sticker label: rounded card with outline, pops in at `t0` */
export const Sticker: React.FC<{ x: number; y: number; text: string; size?: number; fill?: string; color?: string; t: number; t0?: number; rot?: number; w?: number }> =
  ({ x, y, text, size = 64, fill = C.yellow, color = C.ink, t, t0 = -1, rot = 0, w }) => {
    const k = t0 < 0 ? 1 : pop(t, t0);
    if (k <= 0.001) return null;
    const width = w ?? text.length * size * 0.56 + size * 0.9, h = size * 1.5;
    return (
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
        <rect x={-width / 2 + 6} y={-h / 2 + 8} width={width} height={h} rx={h * 0.28} fill={C.ink} />
        <rect x={-width / 2} y={-h / 2} width={width} height={h} rx={h * 0.28} fill={fill} stroke={C.ink} strokeWidth={OUT} />
        <T x={0} y={size * 0.36} size={size} color={color}>{text}</T>
      </g>
    );
  };

/** the caption pill in the lower third (inside the phone-safe area) */
/** the caption's y comes from the episode (Instagram: lower; TikTok: higher, above its description text) */
export const CaptionY = React.createContext(H - 470);
export const Caption: React.FC<{ text: string; t: number; t0: number }> = ({ text, t, t0 }) => (
  <Sticker x={W / 2 - 40} y={React.useContext(CaptionY)} text={text} size={50} fill={C.white} t={t} t0={t0} />
);

/** THE CART (gerobak). Origin = between the wheels on the ground. */
export const Gerobak: React.FC<{ x: number; y: number; s?: number; parts?: number; tilt?: number; sign?: string; lamp?: boolean }> =
  ({ x, y, s = 1, parts = 9, tilt = 0, sign, lamp }) => (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
      {parts >= 3 && [-175, 165].map((dx) => <rect key={dx} x={dx} y={-560} width={20} height={360} rx={6} fill={C.woodD} />)}
      {parts >= 4 && (
        <g>
          <path d="M-270 -560 L270 -560 L240 -625 L-240 -625 Z" fill={C.red} />
          {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-225 + i * 90} -625 L${-255 + i * 90 + 20} -560 L${-255 + i * 90 + 60} -560 L${-225 + i * 90 + 40} -625 Z`} fill={C.white} strokeWidth={0} />)}
          <path d="M-270 -560 L270 -560 L240 -625 L-240 -625 Z" fill="none" />
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-270 + i * 90} -560 q45 40 90 0`} fill={C.red} />)}
        </g>
      )}
      {lamp && <g><path d="M0 -560 L0 -520" /><circle cx={0} cy={-495} r={30} fill="#ffe98a" /></g>}
      {parts >= 5 && <g><rect x={-205} y={-385} width={410} height={160} rx={10} fill="rgba(184,236,255,0.65)" /><path d="M-150 -360 L-110 -250" stroke={C.white} strokeWidth={10} strokeLinecap="round" /></g>}
      {parts >= 1 && <rect x={-235} y={-235} width={470} height={175} rx={16} fill={C.blue} />}
      {parts >= 1 && <path d="M230 -130 L330 -150" strokeWidth={22 + OUT} strokeLinecap="round" />}
      {parts >= 1 && <path d="M230 -130 L330 -150" stroke={C.woodD} strokeWidth={22} strokeLinecap="round" />}
      {sign && (
        <g>
          <rect x={-180} y={-190} width={360} height={80} rx={14} fill={C.orange} />
          <T x={0} y={-135} size={44} color={C.white}>{sign}</T>
        </g>
      )}
      {parts >= 2 && [-150, 150].map((dx) => <g key={dx}><circle cx={dx} cy={-50} r={52} fill="#3a3a4a" /><circle cx={dx} cy={-50} r={16} fill="#d5d0c4" /></g>)}
    </g>
  );

/** sleeping cat */
export const Cat: React.FC<{ x: number; y: number; s?: number; color?: string; t: number }> = ({ x, y, s = 1, color = "#ffb703", t }) => {
  const z = (t * 18) % 36;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT / s}>
      <path d="M70 20 Q120 40 100 -10" fill="none" strokeWidth={22} strokeLinecap="round" />
      <path d="M70 20 Q120 40 100 -10" fill="none" stroke={color} strokeWidth={22 - 2 * OUT / s} strokeLinecap="round" />
      <ellipse cx={0} cy={0} rx={82} ry={42} fill={color} />
      <path d="M-100 -30 L-92 -74 L-72 -46 L-48 -74 L-40 -30 Q-46 10 -90 8 Q-110 -6 -100 -30 Z" fill={color} />
      <path d="M-86 -24 q6 6 12 0 M-62 -24 q6 6 12 0" fill="none" strokeWidth={4} />
      <T x={-20} y={-70 - z} size={34} color={C.white} stroke={C.ink}>z</T>
    </g>
  );
};

/** a chalkboard frame */
export const Board: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={18} fill={C.wood} stroke={C.ink} strokeWidth={OUT} />
    <rect x={x + 28} y={y + 28} width={w - 56} height={h - 56} rx={8} fill={C.chalk} stroke={C.ink} strokeWidth={OUT * 0.6} />
    {children}
  </g>
);
