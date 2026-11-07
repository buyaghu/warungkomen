  // ================= WARUNG NETIZEN DAY 1: the arc =================
  // a festive groove (the dream) -> rewind, cut dead -> crickets (Day 1) -> a sad pad and rain (laid off)
  // -> coins (Rp500k), a "kring" on the cart -> the groove comes back light with hammer hits (building)
  // -> chalk -> the groove thins (the empty menu) -> DEAD SILENCE 34.75-36.25 -> the STAMP (the loudest hit)
  // -> a cheerful groove under the rules -> pencil -> a warm chord at dusk and Juned's motif.
  // The voice sits on top (piece.json voice.music = -12 dB, ducked under speech).
  const T = TIMELINE, cu = T.cues;
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const FIG = [['C4', 'E4', 'G4', 'E4', 'C5', 'G4', 'E4', 'G4'], ['A3', 'C4', 'E4', 'C4', 'A4', 'E4', 'C4', 'E4'],
               ['F3', 'A3', 'C4', 'A3', 'F4', 'C4', 'A3', 'C4'], ['G3', 'B3', 'D4', 'B3', 'G4', 'D4', 'B3', 'D4']];
  const ROOT = ['C2', 'A1', 'F1', 'G1'];
  const JUNED = [['G4', 0], ['C5', E8], ['E5', BEAT]];   // Juned's motif: an up-beat rising triad
  const motif = (t, vel) => JUNED.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.15 - i * 0.15, 0.5, 3400, 0.35));
  // the groove: 8th plucks over a bar-by-bar progression, bass on beats, a shaker on off-beats
  function groove(t0, t1, vel, o = {}) {
    each(t0, t1, E8, (t, k) => {
      const bar = Math.floor(k / 8) % 4, fig = FIG[bar], acc = k % 2 ? 0.75 : 1;
      if (!o.sparse || k % 2 === 0) pluck(t, nz(fig[k % 8]), vel * acc, Math.sin(k * 0.9) * 0.3, 0.28, 3600, 0.18);
      if (k % 2 === 0) bass(t, nz(ROOT[bar]) * 2, vel * 2.6);
      if (o.shaker && k % 2 === 1) noiseHit(t, 0.03, 'highpass', 7500, 0.7, vel * 0.45, k % 4 === 1 ? 0.3 : -0.3);
    });
  }

  // ================= MUSIC =================
  to = 'm';
  // 1. the dream: festive, full, fireworks on the beat; then a tape-rewind sweep down and a dead stop
  pad(0.0, 4.2, ['C3', 'G3', 'E4'], 0.02, { cut: 1400, att: 0.1, rel: 0.05, send: 0.3 });
  groove(0.0, 4.25, 0.048, { shaker: true });
  for (let i = 0; i < 5; i++) chime(0.4 + i * 0.75, [nz('C6'), nz('G6')], 0.03, (i % 2 ? 0.4 : -0.4));
  to = 's'; sweep(cu.rewind, 4.7, 0.05, 3200, 180); to = 'm';
  // 2. Day 1: crickets and one lonely pluck figure; Juned's motif when the DAY 1 tag pops
  pad(4.75, 9.25, ['C3', 'G3'], 0.016, { type: 'triangle', cut: 700, att: 0.6, rel: 0.4 });
  motif(VW('day1', 'hari'), 0.07);
  // 3. laid off: a sad pad in A minor, a slow falling line
  pad(9.25, 15.0, ['A2', 'E3', 'C4'], 0.028, { type: 'triangle', cut: 800, att: 0.5, rel: 0.4, send: 0.5 });
  [9.5, 10.5, 11.5, 12.5, 13.5].forEach((t, i) => pluck(t, nz(['E5', 'D5', 'C5', 'B4', 'A4'][i]), 0.04, 0.2 - i * 0.1, 0.9, 1800, 0.5));
  // 4. Rp500k: a light walking figure
  pad(15.0, 20.25, ['F3', 'C4', 'A4'], 0.022, { type: 'triangle', cut: 1000, att: 0.3, rel: 0.3 });
  each(15.0, 20.25, BEAT, (t, k) => pluck(t, nz(['F4', 'A4', 'C5', 'A4'][k % 4]), 0.045, 0, 0.3, 2600, 0.2));
  // 5. building: the groove comes back, light
  groove(20.25, 26.75, 0.05, { sparse: true });
  pad(20.25, 26.75, ['C3', 'G3', 'E4'], 0.02, { cut: 1000, att: 0.4, rel: 0.3 });
  // 6. the board: just a held chord and a tick
  pad(26.75, 30.75, ['F3', 'C4', 'A4'], 0.022, { type: 'triangle', cut: 900, att: 0.3, rel: 0.3 });
  // 7. the empty menu: the groove thins out and everything stops dry before 34.75 (the silence)
  groove(30.75, 34.5, 0.045, { sparse: true });
  pad(30.75, 34.7, ['A2', 'E3', 'G3'], 0.02, { type: 'triangle', cut: 700, att: 0.2, rel: 0.6, send: 0.05 });
  // 8. THE STAMP (payoff recipe: a short stab + sub on the hit, a flat chord after it)
  chime(cu.stamp, [nz('C5'), nz('E5'), nz('G5'), nz('C6')], 0.13); sub(cu.stamp, 0.55);
  pad(cu.stamp + 0.05, 40.0, ['C3', 'G3', 'C4', 'E4'], 0.03, { cut: 1300, att: 0.3, rel: 0.3, send: 0.4 });
  motif(VW('tentukan', 'tentukan') + 0.4, 0.08);
  // 9. the rules: the cheerful groove, full
  groove(40.0, 47.75, 0.055, { shaker: true });
  pad(40.0, 47.75, ['C3', 'G3', 'E4'], 0.022, { cut: 1200, att: 0.3, rel: 0.3 });
  // 10. the credit book: soft, the groove without the plucks' 8ths
  pad(47.75, 52.75, ['F3', 'A3', 'C4', 'E4'], 0.016, { type: 'triangle', cut: 900, att: 0.4, rel: 0.4, send: 0.5 });
  each(47.75, 52.75, BEAT, (t, k) => pluck(t, nz(['A4', 'C5', 'E5', 'C5'][k % 4]), 0.022, Math.sin(k) * 0.3, 0.5, 2400, 0.4));
  // 11. dusk: a warm chord, the motif on "pertama", a last chime
  pad(52.75, 58.75, ['C3', 'G3', 'E4', 'G4'], 0.017, { cut: 1100, att: 0.6, rel: 1.2, send: 0.6 });
  motif(cu.one, 0.06);
  chime(56.0, [nz('C5'), nz('G5'), nz('E6')], 0.03);

  // ================= SOUND EFFECTS =================
  to = 's';
  // crickets in Day 1: paired chirps
  each(4.9, 9.1, 0.5, (t, k) => { noiseHit(t, 0.03, 'bandpass', 4200, 9, 0.025, 0.4); noiseHit(t + 0.08, 0.03, 'bandpass', 4300, 9, 0.022, 0.4); });
  // rain under the little cloud
  each(VW('phk', 'kena'), 15.0, 0.06, (t, k) => noiseHit(t, 0.04, 'highpass', 3000 + (k % 5) * 400, 0.8, 0.012, Math.sin(k) * 0.5));
  // five notes counted out, then "kring" on the cart ad
  for (let i = 0; i < 5; i++) blip(VW('modal', 'lima') + i * 0.2, 900 + i * 120, 1300 + i * 120, 0.06, 0.05);
  chime(VW('modal', 'gerobak'), [nz('E6'), nz('B6')], 0.06, 0.2);
  // hammer hits while building; "toing" on the bent wheel; the bell on "usaha"
  each(20.4, VW('gerobak', 'namanya') - 0.2, BEAT, (t) => { noiseHit(t, 0.06, 'bandpass', 900, 2, 0.08, 0.2); sub(t, 0.05); });
  blip(VW('gerobak', 'miring'), 300, 900, 0.25, 0.08);
  chime(VW('gerobak', 'usaha'), [nz('A6')], 0.06, 0.3); chime(VW('gerobak', 'usaha') + 0.3, [nz('A6')], 0.05, 0.3);
  // chalk scratches with the write-ons
  [[VW('papan', 'pelanggan') - 0.1, 0.5], [VW('papan', 'omzet') - 0.1, 0.4]].forEach(([t0, d]) => each(t0, t0 + d, 0.06, (t, k) => noiseHit(t, 0.05, 'highpass', 5000, 1.5, 0.02, 0)));
  // the gecko's little feet, then nothing; the stamp's thud is in the music (sub + chime)
  noiseHit(cu.stamp, 0.18, 'lowpass', 400, 0.8, 0.2, 0);
  // a pop for each order slip
  [VW('aturan1', 'follow'), VW('aturan1', 'komen'), VW('aturan2', 'komen')].forEach((t, i) => blip(t, 500 + i * 200, 1200 + i * 200, 0.08, 0.06, (i - 1) * 0.3));
  // pencil on "kamu"
  each(VW('bon', 'kamu') - 0.2, VW('bon', 'kamu') + 0.4, 0.05, (t) => noiseHit(t, 0.04, 'bandpass', 2500, 1.2, 0.02, -0.2));
  // the counter 0 -> 1
  blip(cu.one, 700, 1400, 0.12, 0.06);
  to = 'm';
