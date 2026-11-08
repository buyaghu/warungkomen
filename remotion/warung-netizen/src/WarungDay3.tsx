import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { FPS, H, MouthCtx, W } from "./lib";
import { CaptionY } from "./Props";
import type { Episode } from "./episode";
import { NamesCtx } from "./scenes/Day2";
import { Closing, Leftovers, Market, NoodleTrouble, SecondHelping, StirFry, V3, Victory, cue } from "./scenes/Day3Full";

export const DURATION3_S = 95;
export const SHOTS3: [number, React.FC<{ t: number; ep: Episode }>][] = [
  [0, Victory], [cue(6) - 0.12, Leftovers], [cue(8) - 0.12, Market],
  [cue(11) - 0.12, StirFry], [cue(15) - 0.12, NoodleTrouble],
  [cue(20) - 0.12, SecondHelping], [cue(26) - 0.12, Closing],
];
export const WarungDay3: React.FC<Episode> = (ep) => {
  const t = useCurrentFrame() / FPS;
  let idx = 0;
  for (let i = 0; i < SHOTS3.length; i++) if (t >= SHOTS3[i][0]) idx = i;
  const Scene = SHOTS3[idx][1];
  return <AbsoluteFill style={{ backgroundColor: "#1b1714" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <MouthCtx.Provider value={V3.mouthAt}>
        <CaptionY.Provider value={ep.captionY}>
          <NamesCtx.Provider value={ep.handles}>
            <Scene t={t} ep={ep} />
          </NamesCtx.Provider>
        </CaptionY.Provider>
      </MouthCtx.Provider>
    </svg>
    <Audio src={staticFile("day3/audio.wav")} />
  </AbsoluteFill>;
};
