import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { C, OUT } from "./lib";
import { Juned } from "./Juned";
import { Gerobak, Sunburst, T } from "./Props";

// ---------------------------------------------------------------------------
// Instagram branding stills: the profile picture and the highlight covers.
// Render with: npx remotion still Avatar out/ig/avatar.png  (see README in out/ig)
// ---------------------------------------------------------------------------

// PROFILE PICTURE (1080x1080, shown as a circle): Juned's face over the sunburst, the warung sign below.
export const Avatar: React.FC = () => (
  <AbsoluteFill>
    <svg width={1080} height={1080} viewBox="0 0 1080 1080">
      <Sunburst cx={540} cy={540} a="#ffb21e" b="#ff8a1f" t={0} n={20} />
      {/* Juned big, cropped at the chest so the face reads at 110px */}
      <Juned x={540} y={1500} s={1.75} t={0.3} pose="stand" mood="happy" talk={false} />
      <g transform="translate(540 850) rotate(-3) scale(0.8)">
        <rect x={-372} y={-82} width={744} height={164} rx={36} fill={C.ink} transform="translate(8 10)" />
        <rect x={-372} y={-82} width={744} height={164} rx={36} fill={C.orange} stroke={C.ink} strokeWidth={OUT * 1.4} />
        <T x={0} y={38} size={92} color={C.white} stroke={C.ink}>WARUNG KOMEN</T>
      </g>
    </svg>
  </AbsoluteFill>
);

// HIGHLIGHT COVER (1080x1920; Instagram shows the centre circle). One icon per highlight.
export const CoverSchema = z.object({
  label: z.string(),
  icon: z.enum(["menu", "bon", "aturan", "gerobak", "rapat"]),
  bg: z.string(),
});
const Icon: React.FC<{ kind: z.infer<typeof CoverSchema>["icon"] }> = ({ kind }) => {
  const s = { stroke: C.ink, strokeWidth: OUT * 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (kind) {
    case "menu":   // a chalkboard menu
      return (
        <g {...s}>
          <rect x={-170} y={-190} width={340} height={380} rx={24} fill={C.wood} />
          <rect x={-135} y={-155} width={270} height={310} rx={10} fill={C.chalk} />
          {[-80, -10, 60].map((y) => <path key={y} d={`M-95 ${y} L95 ${y}`} stroke={C.white} strokeWidth={14} />)}
        </g>
      );
    case "bon":    // the credit book
      return (
        <g {...s}>
          <rect x={-150} y={-190} width={300} height={380} rx={20} fill={C.blue} />
          <rect x={-120} y={-165} width={250} height={330} rx={8} fill={C.paper} />
          {[-90, -20, 50, 120].map((y) => <path key={y} d={`M-90 ${y} L100 ${y}`} stroke={C.blue} strokeWidth={8} />)}
          <path d="M60 -140 L170 -250" stroke={C.ink} strokeWidth={46} /><path d="M60 -140 L170 -250" stroke={C.yellow} strokeWidth={30} />
        </g>
      );
    case "aturan": // an order slip on a peg
      return (
        <g {...s}>
          <rect x={-180} y={-130} width={360} height={260} rx={22} fill={C.white} />
          <rect x={-30} y={-170} width={60} height={70} rx={10} fill="#e8b77a" />
          <path d="M-60 40 C-150 -20 -110 -90 -60 -50 C-10 -90 30 -20 -60 40 Z" fill={C.red} transform="translate(-30 -10)" />
          <path d="M20 -30 L130 -30 M20 30 L110 30" stroke={C.ink} strokeWidth={16} />
        </g>
      );
    case "rapat":  // a speech bubble (community / voting)
      return (
        <g {...s}>
          <path d="M-190 -140 h380 a40 40 0 0 1 40 40 v170 a40 40 0 0 1 -40 40 h-200 l-90 80 v-80 h-90 a40 40 0 0 1 -40 -40 v-170 a40 40 0 0 1 40 -40 Z" fill={C.teal} />
          {[-80, 0, 80].map((x) => <circle key={x} cx={x} cy={-15} r={22} fill={C.white} />)}
        </g>
      );
    default:       // the cart
      return <Gerobak x={0} y={230} s={0.62} />;
  }
};
export const HighlightCover: React.FC<z.infer<typeof CoverSchema>> = ({ label, icon, bg }) => (
  <AbsoluteFill>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <rect width={1080} height={1920} fill={bg} />
      <circle cx={540} cy={960} r={430} fill={C.white} opacity={0.22} />
      <g transform="translate(540 980) scale(1.45)"><Icon kind={icon} /></g>
      {/* the label is the highlight's name in Instagram, so it is not drawn here */}
      <title>{label}</title>
    </svg>
  </AbsoluteFill>
);
