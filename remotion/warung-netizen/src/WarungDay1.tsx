import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { FPS, H, W } from "./lib";
import { CaptionY } from "./Props";
import type { Episode } from "./episode";
import { Build, Dream, Lot, Modal, Office } from "./scenes/Part1";
import { Bon, End, Menu, Papan, Rules } from "./scenes/Part2";

// ---------------------------------------------------------------------------
// WARUNG NETIZEN — DAY 1 (flat cartoon). Same story, voice and cut times as the
// cut-paper version: every cut sits just before a sentence, on the 120 BPM 8th grid.
// The audio is the cut-paper mix (Wibowo's voice-over + score + sfx), so timing is identical.
// ---------------------------------------------------------------------------
export const SHOTS: [number, React.FC<{ t: number; ep: Episode }>][] = [
  [0.0, Dream], [4.75, Lot], [9.25, Office], [15.0, Modal], [20.25, Build],
  [26.75, Papan], [30.75, Menu], [40.0, Rules], [47.75, Bon], [52.75, End],
];
export const DURATION_S = 58.75;

export const WarungDay1: React.FC<Episode> = (ep) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let idx = 0;
  for (let i = 0; i < SHOTS.length; i++) if (frame >= Math.round(SHOTS[i][0] * FPS)) idx = i;
  const Scene = SHOTS[idx][1];
  return (
    <AbsoluteFill style={{ backgroundColor: "#1b1714" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <CaptionY.Provider value={ep.captionY}>
          <Scene t={t} ep={ep} />
        </CaptionY.Provider>
      </svg>
      <Audio src={staticFile("audio.wav")} />
    </AbsoluteFill>
  );
};
