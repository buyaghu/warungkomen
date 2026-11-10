import { z } from "zod";

// The per-episode data: edit these in Remotion Studio's props panel for Day 2, Day 3, ...
export const EpisodeSchema = z.object({
  day: z.number().int().min(1),
  warung: z.string(),
  cabang: z.string(),
  pelangganAkhir: z.string(),
  stamp1: z.string(),
  stamp2: z.string(),
  rules: z.array(z.object({ a: z.string(), b: z.string() })).length(3),
  /** caption height: 1450 for Instagram Reels, 1280 for TikTok (its description covers more of the bottom) */
  captionY: z.number(),
  /** the menu so far: one dish is added per episode (Day 1: empty) */
  menu: z.array(z.string()).default([]),
  /** commenters shown on screen: display name -> @handle (TikTok cut uses TikTok @usernames) */
  handles: z.record(z.string(), z.string()).default({}),
});
export type Episode = z.infer<typeof EpisodeSchema>;

export const DAY1: Episode = {
  day: 1,
  warung: "WARUNG KOMEN",
  cabang: "1/100",
  pelangganAkhir: "1",
  stamp1: "KOMEN =",
  stamp2: "PESAN MENU",
  rules: [
    { a: "FOLLOW", b: "= JADI PELANGGAN" },
    { a: "KOMEN", b: "= PESAN MENU" },
    { a: "KOMEN TERATAS", b: "= DIMASAK BESOK" },
  ],
  captionY: 1450,
  menu: [],
  handles: {},
};
export const DAY1_TIKTOK: Episode = { ...DAY1, captionY: 1280 };

// Day 2: AYAM GEPREK. rules[0..1] are the voting slips at the end; customers end at 5.
export const DAY2: Episode = {
  day: 2,
  warung: "WARUNG KOMEN",
  cabang: "1/100",
  pelangganAkhir: "5",
  stamp1: "KOMEN =",
  stamp2: "PESAN MENU",
  rules: [
    { a: "KOMEN", b: "= PESEN MENU BESOK" },
    { a: "LIKE TERBANYAK", b: "= GW MASAK!" },
    { a: "FOLLOW", b: "= JADI PELANGGAN" },
  ],
  captionY: 1450,
  menu: ["Ayam geprek"],
  handles: {},
};
export const DAY2_TIKTOK: Episode = {
  ...DAY2,
  captionY: 1280,
  handles: {
    kelvin: "@kelvinharislubis",
    hafizapizzaa: "@hafizapizzaa",
    nazz: "@kmugppnasss",
    "azell?": "@azell_gyomeiwife",
    _Faniiii_: "@its.pinky304",
    fatiii: "@kmu_gpp_fti7",
    "THE LUCKY GUY": "@d.man00778",
    "IJN DZEKI": "@ijnzeki0",
  },
};

export const DAY3: Episode = {
  ...DAY2,
  day: 3,
  pelangganAkhir: "8",
  // Day 3 is full frame with occasional emphasis text, without continuous subtitles.
  captionY: 1450,
  menu: ["Ayam geprek", "Mie ayam"],
  handles: { nazz: DAY2_TIKTOK.handles.nazz },
};
export const DAY3_TIKTOK: Episode = { ...DAY3 };

// Day 4: NASI DAUN JERUK (winner @gord0nbleu_, IG, 4 likes). Full frame like Day 3.
export const DAY4: Episode = {
  ...DAY3,
  day: 4,
  pelangganAkhir: "11",
  menu: ["Ayam geprek", "Mie ayam", "Nasi daun jeruk"],
  handles: {},
};
export const DAY4_TIKTOK: Episode = { ...DAY4 };
