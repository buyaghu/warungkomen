import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { FPS, H, MouthCtx, W } from "./lib";
import { CaptionY } from "./Props";
import type { Episode } from "./episode";
import { AyaAya, Bakso, BonD2, Borong, Buka, Cta, Dateng, Geprek, Masak, Menang, Pedes, Protes, Sawit, Terharu, V2, Belanja, NamesCtx } from "./scenes/Day2";

// ---------------------------------------------------------------------------
// WARUNG KOMEN — DAY 2: AYAM GEPREK. Mang Juned's own voice (ElevenLabs), every cut
// on the 120 BPM 8th grid just before a line. Audio: public/day2/audio.wav (voice + music + sfx).
// ---------------------------------------------------------------------------
export const SHOTS2: [number, React.FC<{ t: number; ep: Episode }>][] = [
  [0.0, Buka], [7.25, Menang], [9.75, Sawit], [13.0, Bakso], [16.25, Borong], [19.5, AyaAya],
  [22.25, Belanja], [25.25, Masak], [28.75, Pedes], [32.25, Geprek], [35.75, Dateng],
  [39.25, BonD2], [42.25, Terharu], [46.0, Protes], [52.75, Cta],
];
export const DURATION2_S = 62.0;

export const WarungDay2: React.FC<Episode> = (ep) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let idx = 0;
  for (let i = 0; i < SHOTS2.length; i++) if (frame >= Math.round(SHOTS2[i][0] * FPS)) idx = i;
  const Scene = SHOTS2[idx][1];
  return (
    <AbsoluteFill style={{ backgroundColor: "#1b1714" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <MouthCtx.Provider value={V2.mouthAt}>
          <CaptionY.Provider value={ep.captionY}>
            <NamesCtx.Provider value={ep.handles}>
              <Scene t={t} ep={ep} />
            </NamesCtx.Provider>
          </CaptionY.Provider>
        </MouthCtx.Provider>
      </svg>
      <Audio src={staticFile("day2/audio.wav")} />
    </AbsoluteFill>
  );
};
