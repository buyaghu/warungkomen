import { createContext } from "react";
import { Easing, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import voice from "./data/voice.json";

// ---------------------------------------------------------------------------
// Warung Netizen — shared timing, voice cues, lip-sync and palette.
// The picture follows the same clock as the cut-paper version: 24 fps, cuts on
// the 120 BPM 8th grid, every cue taken from the voice-over's word timings.
// ---------------------------------------------------------------------------
export const FPS = 24;
export const W = 1080;
export const H = 1920;

// Fredoka (variable weight), bundled locally so renders never depend on the network
export const FONT = "Fredoka";
loadFont({ family: FONT, url: staticFile("fonts/fredoka.woff2"), weight: "300 700" });

type Word = { w: string; t0: number; t1: number };
type Line = { id: string; text: string; t0: number; t1: number; words: Word[] };
export type Voice = { duration: number; lines: Line[] };

const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Voice cues + lip-sync for one episode's voice-over (voice.json from tools/voice.mjs). */
export const makeVoice = (V: Voice) => {
  const VL = (id: string) => V.lines.find((l) => l.id === id)!;
  /** start (s) of the n-th occurrence of `word` in line `id` */
  const VW = (id: string, word: string, n = 0) => {
    const L = VL(id);
    const hits = L.words.filter((w) => clean(w.w) === clean(word));
    return (hits[n] ?? hits[0] ?? { t0: L.t0 }).t0;
  };
  /** Lip-sync: 0 (closed) .. 1 (wide open) while a word is being spoken. Syllable-rate flap,
   *  eased at word edges so the mouth never snaps. Deterministic: depends on t only. */
  const mouthAt = (t: number) => {
    for (const L of V.lines) {
      if (t < L.t0 - 0.05 || t > L.t1 + 0.05) continue;
      for (const w of L.words) {
        if (t < w.t0 || t > w.t1) continue;
        const u = (t - w.t0) / Math.max(0.08, w.t1 - w.t0);
        const syll = Math.max(1, Math.round((w.w.match(/[aiueo]/gi) ?? []).length));
        const flap = Math.abs(Math.sin(u * Math.PI * syll));
        const edge = Math.min(1, u * 6, (1 - u) * 6);
        return 0.25 + 0.75 * flap * edge;
      }
      return 0.08;   // between words inside a line: barely open
    }
    return 0;
  };
  return { V, VL, VW, mouthAt };
};

// Day 1 (default): the original exports, unchanged
const D1 = makeVoice(voice as Voice);
export const VOICE = D1.V;
export const VL = D1.VL;
export const VW = D1.VW;
export const mouthAt = D1.mouthAt;
/** which voice Juned lip-syncs to; an episode provides its own */
export const MouthCtx = createContext<(t: number) => number>(D1.mouthAt);

// ---- small animation helpers (all on absolute seconds t) ----
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ev = (t: number, t0: number, d = 0.25) => clamp((t - t0) / d);
export const pop = (t: number, t0: number, damping = 11) =>
  t < t0 ? 0 : spring({ frame: (t - t0) * FPS, fps: FPS, config: { damping, stiffness: 180, mass: 0.7 } });
export const springTo = (t: number, t0: number, a: number, b: number, damping = 16) =>
  a + (b - a) * (t < t0 ? 0 : spring({ frame: (t - t0) * FPS, fps: FPS, config: { damping, stiffness: 120 } }));
export const ease = (t: number, t0: number, t1: number, a: number, b: number) =>
  interpolate(t, [t0, t1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
export const past = (t: number, c: number) => Math.round(t * FPS + 1e-6) >= Math.round(c * FPS);

// ---- palette: bright, saturated, bold outlines. ORANGE = Juned's apron + the warung only. ----
export const C = {
  ink: "#1d1a2f",
  orange: "#ff6a2b", orangeD: "#d8461a",
  yellow: "#ffd23f", red: "#ee2f2f", pink: "#ff7eb6", purple: "#8f5cff", blue: "#2f6fe0", blueD: "#1559ad",
  teal: "#12b5a5", tealD: "#0c8a7e", green: "#46c24a", greenD: "#2f9e3c", sky: "#3ec4f5", skyL: "#b8ecff",
  cream: "#fff3d6", paper: "#fffdf4", wood: "#c98a4b", woodD: "#94592a", chalk: "#17614a", grey: "#9aa6b8",
  skin: "#c68a62", skinD: "#a86d48", hair: "#1c1412", pants: "#2b3a9a", white: "#ffffff",
};
export const OUT = 8;   // outline width (px at 1080 wide)
