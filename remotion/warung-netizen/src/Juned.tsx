import React from "react";
import { C, OUT, MouthCtx } from "./lib";

// ---------------------------------------------------------------------------
// MAS JUNED — flat cartoon, bold outlines. Feet at (x, y). Talks (lip-sync)
// whenever the voice-over speaks, unless talk={false}.
// ---------------------------------------------------------------------------
export type Pose = "stand" | "scratch" | "wave" | "hold" | "point" | "hammer" | "proud";
export type Mood = "smile" | "happy" | "sad" | "wow" | "focus" | "cry" | "hot";

const HANDS = (pose: Pose, t: number): [number, number][] => {
  switch (pose) {
    case "scratch": return [[-150, -230], [70, -585]];
    case "wave": return [[-150, -230], [215, -600 + Math.sin(t * 9) * 30]];
    case "hold": return [[-80, -300], [80, -300]];
    case "point": return [[-150, -230], [235, -430]];
    case "hammer": return [[-150, -230], [205, -470 - Math.abs(Math.sin(t * 7)) * 90]];
    case "proud": return [[-120, -310], [120, -310]];
    default: return [[-150, -230], [150, -230]];
  }
};

// a limb: an outlined round-capped stroke
const Limb: React.FC<{ d: string; w: number; color: string }> = ({ d, w, color }) => (
  <>
    <path d={d} stroke={C.ink} strokeWidth={w + OUT * 2} strokeLinecap="round" fill="none" />
    <path d={d} stroke={color} strokeWidth={w} strokeLinecap="round" fill="none" />
  </>
);

export const Juned: React.FC<{
  x: number; y: number; s?: number; t: number; pose?: Pose; mood?: Mood; hat?: "chef"; talk?: boolean; flip?: boolean;
  children?: React.ReactNode;   // drawn in front of the hands (a box he holds)
}> = ({ x, y, s = 1, t, pose = "stand", mood = "smile", hat, talk = true, flip, children }) => {
  const bob = Math.sin(t * Math.PI * 2 * 0.8) * 5;
  const blink = Math.floor(t * 24) % 70 < 3;
  const mouthAt = React.useContext(MouthCtx);
  const m = talk ? mouthAt(t) : 0;
  const hp = HANDS(pose, t);
  const sh: [number, number][] = [[-100, -395], [100, -395]];
  const inFront = pose === "hold" || pose === "proud";
  const tuft = Math.sin(t * 5) * 8;
  const brow = mood === "sad" ? 10 : mood === "wow" ? -12 : 0;
  const arms = (
    <g>
      {[0, 1].map((i) => (
        <g key={i}>
          <Limb d={`M${sh[i][0]} ${sh[i][1] + bob} L${hp[i][0]} ${hp[i][1] + bob}`} w={46} color={C.teal} />
          <circle cx={hp[i][0]} cy={hp[i][1] + bob} r={28} fill={C.skin} stroke={C.ink} strokeWidth={OUT} />
        </g>
      ))}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {/* shadow */}
      <ellipse cx={0} cy={0} rx={150} ry={22} fill="rgba(0,0,0,0.18)" />
      {/* legs + sandals */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <Limb d={`M${d * 40} -200 L${d * 44} -40`} w={56} color={C.pants} />
          <ellipse cx={d * 54} cy={-16} rx={46} ry={18} fill="#6b4a34" stroke={C.ink} strokeWidth={OUT} />
        </g>
      ))}
      <g transform={`translate(0 ${bob})`}>
        {!inFront && arms}
        {/* torso */}
        <rect x={-112} y={-440} width={224} height={270} rx={70} fill={C.teal} stroke={C.ink} strokeWidth={OUT} />
        {/* the apron (the hero colour) */}
        <path d="M-78 -405 L78 -405 L98 -150 L-98 -150 Z" fill={C.orange} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" />
        <rect x={-46} y={-275} width={92} height={60} rx={10} fill={C.orangeD} stroke={C.ink} strokeWidth={OUT * 0.6} />
        {/* towel */}
        <path d="M-95 -428 Q0 -390 95 -428" stroke={C.ink} strokeWidth={50 + OUT * 2} strokeLinecap="round" fill="none" />
        <path d="M-95 -428 Q0 -390 95 -428" stroke={C.white} strokeWidth={50} strokeLinecap="round" fill="none" />
        <path d="M-95 -428 Q0 -390 95 -428" stroke={C.blue} strokeWidth={50} strokeDasharray="8 26" fill="none" />
        <Limb d="M-62 -420 L-72 -320" w={38} color={C.white} />
        {/* head */}
        <circle cx={-84} cy={-540} r={20} fill={C.skin} stroke={C.ink} strokeWidth={OUT} />
        <circle cx={84} cy={-540} r={20} fill={C.skin} stroke={C.ink} strokeWidth={OUT} />
        <ellipse cx={0} cy={-545} rx={86} ry={92} fill={C.skin} stroke={C.ink} strokeWidth={OUT} />
        {/* hair with a swaying tuft */}
        <path
          d={`M-90 -550 Q-96 -640 -10 -652 L${10 + tuft} -712 L30 -650 Q96 -640 90 -555 Q60 -604 10 -610 Q-50 -606 -90 -550 Z`}
          fill={C.hair} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round"
        />
        {hat === "chef" && (
          <g stroke={C.ink} strokeWidth={OUT} fill={C.white}>
            <rect x={-72} y={-655} width={144} height={52} rx={8} />
            <circle cx={-48} cy={-700} r={46} /><circle cx={48} cy={-700} r={46} /><circle cx={0} cy={-722} r={52} />
          </g>
        )}
        {/* brows */}
        <path d={`M-42 ${-582 - brow * 0.3} L-14 ${-584 + brow}`} stroke={C.hair} strokeWidth={9} strokeLinecap="round" />
        <path d={`M14 ${-584 + brow} L42 ${-582 - brow * 0.3}`} stroke={C.hair} strokeWidth={9} strokeLinecap="round" />
        {/* eyes */}
        {[-24, 24].map((ex) =>
          mood === "hot" ? (
            <path key={ex} d={ex < 0 ? `M${ex - 12} -560 L${ex + 10} -550 L${ex - 12} -540` : `M${ex + 12} -560 L${ex - 10} -550 L${ex + 12} -540`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          ) : mood === "happy" || mood === "cry" || mood === "focus" || blink ? (
            <path key={ex} d={mood === "happy" || mood === "cry" ? `M${ex - 12} -548 Q${ex} -562 ${ex + 12} -548` : `M${ex - 12} -550 L${ex + 12} -550`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" />
          ) : (
            <g key={ex}>
              <ellipse cx={ex} cy={-550} rx={mood === "wow" ? 12 : 10} ry={mood === "wow" ? 15 : 13} fill={C.ink} />
              <circle cx={ex + 3} cy={-555} r={3.5} fill={C.white} />
            </g>
          ),
        )}
        {mood === "hot" && <ellipse cx={0} cy={-530} rx={80} ry={70} fill="rgba(238,47,47,0.35)" />}
        {mood === "cry" && [-1, 1].map((d) => (
          <path key={d} d={`M${d * 30} -542 Q${d * (38 + Math.sin(t * 9) * 4)} -500 ${d * 34} ${-460 + ((t * 120) % 40)}`} stroke="#7fd6ff" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.9} />
        ))}
        {/* cheeks */}
        <ellipse cx={-44} cy={-520} rx={13} ry={8} fill="rgba(255,110,120,0.55)" />
        <ellipse cx={44} cy={-520} rx={13} ry={8} fill="rgba(255,110,120,0.55)" />
        {/* mouth: lip-synced */}
        {m > 0.05 ? (
          <g>
            <ellipse cx={0} cy={-500} rx={20 + 6 * m} ry={6 + 20 * m} fill="#7a1f28" stroke={C.ink} strokeWidth={6} />
            <ellipse cx={0} cy={-492 + 8 * m} rx={11 + 3 * m} ry={4 + 5 * m} fill="#ff7a8a" />
          </g>
        ) : mood === "sad" ? (
          <path d="M-18 -492 Q0 -508 18 -492" stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" />
        ) : mood === "wow" || mood === "hot" ? (
          <ellipse cx={0} cy={-498} rx={11} ry={15} fill="#7a1f28" stroke={C.ink} strokeWidth={6} />
        ) : (
          <path d={mood === "happy" ? "M-26 -508 Q0 -476 26 -508 Z" : "M-20 -506 Q0 -490 20 -506"} stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill={mood === "happy" ? "#7a1f28" : "none"} />
        )}
        {children}
        {inFront && arms}
      </g>
    </g>
  );
};
