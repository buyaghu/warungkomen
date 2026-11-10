import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { FPS, H, MouthCtx, W } from "./lib";
import { CaptionY } from "./Props";
import type { Episode } from "./episode";
import { NamesCtx } from "./scenes/Day2";
import { Camps, Closing4, Combo, Cook, Hook, Market4, V4, cue } from "./scenes/Day4Full";

export const DURATION4_S = 65;
export const SHOTS4: [number, React.FC<{ t: number; ep: Episode }>][] = [
  [0, Hook], [cue(4) - 0.12, Camps], [cue(7) - 0.12, Market4],
  [cue(9) - 0.12, Cook], [cue(15) - 0.12, Combo], [cue(18) - 0.12, Closing4],
];
export const WarungDay4: React.FC<Episode> = (ep) => {
  const t = useCurrentFrame() / FPS;
  let idx = 0;
  for (let i = 0; i < SHOTS4.length; i++) if (t >= SHOTS4[i][0]) idx = i;
  const Scene = SHOTS4[idx][1];
  return <AbsoluteFill style={{ backgroundColor: "#1b1714" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <MouthCtx.Provider value={V4.mouthAt}>
        <CaptionY.Provider value={ep.captionY}>
          <NamesCtx.Provider value={ep.handles}>
            <Scene t={t} ep={ep} />
          </NamesCtx.Provider>
        </CaptionY.Provider>
      </MouthCtx.Provider>
    </svg>
    <Audio src={staticFile("day4/audio.wav")} />
  </AbsoluteFill>;
};
