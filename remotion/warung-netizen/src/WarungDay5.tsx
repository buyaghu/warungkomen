import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { FPS, H, MouthCtx, W } from "./lib";
import { CaptionY } from "./Props";
import type { Episode } from "./episode";
import { NamesCtx } from "./scenes/Day2";
import { Closing5, Cook5, Drinks, Hook5, Lapak, Serve, V5, c } from "./scenes/Day5Full";

export const DURATION5_S = 67;
export const SHOTS5: [number, React.FC<{ t: number; ep: Episode }>][] = [
  [0, Hook5], [c("l04") - 0.12, Drinks], [c("l06") - 0.12, Cook5],
  [c("l13") - 0.12, Serve], [c("l17") - 0.12, Lapak], [c("l19") - 0.12, Closing5],
];
export const WarungDay5: React.FC<Episode> = (ep) => {
  const t = useCurrentFrame() / FPS;
  let idx = 0;
  for (let i = 0; i < SHOTS5.length; i++) if (t >= SHOTS5[i][0]) idx = i;
  const Scene = SHOTS5[idx][1];
  return <AbsoluteFill style={{ backgroundColor: "#1b1714" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <MouthCtx.Provider value={V5.mouthAt}>
        <CaptionY.Provider value={ep.captionY}>
          <NamesCtx.Provider value={ep.handles}>
            <Scene t={t} ep={ep} />
          </NamesCtx.Provider>
        </CaptionY.Provider>
      </MouthCtx.Provider>
    </svg>
    <Audio src={staticFile("day5/audio.wav")} />
  </AbsoluteFill>;
};
