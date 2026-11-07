// =====================================================================
//  SHOTS A — the dream (open), the menu + stamp (the turn), the cart at dusk (the end: the dream, small)
// =====================================================================
// 1. THE DREAM: a big restaurant at golden hour, "100 CABANG", a queue, fireworks; Juned in a chef's hat. Rewind at the end.
function sDream() {
  sunburst(540, 620, '#ffb21e', '#ff8a1f', 22, 'drSky');
  // fireworks (sparkles) popping on the beat
  for (let i = 0; i < 5; i++) { const t = 0.4 + i * 0.75, k = ev(t, 0.5); if (k <= 0 || k >= 1) continue; const R = RNG('fw', i), cx = R.r(160, 920), cy = R.r(300, 520); for (let j = 0; j < 10; j++) { const a = j / 10 * TAU; sparkle(cx + Math.cos(a) * 90 * k, cy + Math.sin(a) * 90 * k, 14 * (1 - k) + 4, ['#fff8dc', PAL.yellow, PAL.pinkL][j % 3]); } }
  birdsOnWire(330, 'drw');
  // the restaurant
  cut(rect(110, 720, 860, 640, 10), '#fff3d6', { key: 'drBld', pat: pat.lines('rgba(255,140,60,0.25)', 38) });
  cut([[70, 740], [1010, 740], [960, 640], [120, 640]], WN.red, { key: 'drRoof', pat: pat.stripes('rgba(255,255,255,0.3)', 30, 80), sb: 10 });
  // the big sign (orange = the warung)
  const sg = popS(0.3);
  ctx.save(); ctx.translate(540, 560); ctx.scale(sg, sg);
  cut(rect(-360, -90, 720, 170, 14), PAL.orange, { key: 'drSign', crayon: PAL.orangeD, crAl: 0.3, sb: 14 });
  handText('WARUNG NETIZEN', -handW('WARUNG NETIZEN', 78, 700) / 2, 28, 78, '#fff8ea', { key: 'drSignT', weight: 700 });
  for (let i = 0; i < 14; i++) dot(-340 + i * 52, -100, 9, (B + i) % 4 < 2 ? PAL.yellow : '#fff2c0');   // marquee bulbs
  ctx.restore();
  tag('100 CABANG!', 740, 800, 56, { fill: PAL.yellow, rot: 0.08, s: popS(1.2) });
  // windows with people inside, door
  [[170, 860], [390, 860], [690, 860]].forEach(([wx, wy], i) => { cut(rect(wx, wy, 190, 170, 6), '#7fe0ff', { key: 'drWin' + i, sb: 6 }); person(wx + 95, wy + 150, 0.35, { key: 'drIn' + i, shirt: [PAL.purple, PAL.teal, PAL.pink][i], mood: 'happy' }); });
  cut(rect(450, 1110, 180, 250, 6), PAL.woodD, { key: 'drDoor' });
  ground(1340, WN.road, 'drGround', { pat: pat.dots('rgba(120,90,60,0.15)', 4, 40) });
  // the queue
  for (let i = 0; i < 6; i++) { const qx = 680 + i * 70, hop = (B + i * 3) % 18 < 2 ? -10 : 0; person(qx, 1480 + hop, 0.42, { key: 'q' + i, shirt: [PAL.blue, PAL.green, PAL.purple, PAL.pink, PAL.mustard, PAL.teal][i], skin: [PAL.skin1, PAL.skin2, PAL.skin3][i % 3], mood: i % 2 ? 'happy' : 'smile' }); }
  juned(330, 1600, 0.95, { pose: 'proud', mood: 'happy', hat: 'chef', key: 'jDream' });
  // the rewind: scan lines and a ◀◀ tag in the last half second
  const rw = ev(TIMELINE.cues.rewind, 0.55);
  if (rw > 0) {
    ctx.save(); ctx.fillStyle = `rgba(30,20,40,${0.35 * rw})`; ctx.fillRect(0, 0, W, H);
    const R = RNG('scan', B); for (let i = 0; i < 9; i++) { const yy = R.r(0, H); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(0, yy, W, R.r(4, 18)); }
    ctx.restore();
    DEFER.push(() => tag('<< MUNDUR', CX, 900, 90, { fill: PAL.paper, rot: -0.05, tape: false }));
  } else { yearTag('suatu hari nanti...'); }
}

// 7. THE MENU: the cart's empty menu board, Juned scratching his head; silence (a gecko, a leaf); STAMP at 36.25
function sMenu() {
  const st = TIMELINE.cues.stamp;
  sky(WN.skyA, WN.skyB, 'mnSky');
  cloud(220, 330, 1.1, 'mnC1'); cloud(860, 420, 0.8, 'mnC2');
  ground(1250, WN.grass, 'mnGround');
  gerobak(700, 1330, 1.0, { key: 'mnCart', parts: 9, tilt: -0.03 });
  // the menu board on its easel
  cut(capsulePts(260, 1500, 330, 860, 22), PAL.woodD, { key: 'mnLeg1' }); cut(capsulePts(560, 1500, 490, 860, 22), PAL.woodD, { key: 'mnLeg2' });
  cut(rect(170, 640, 480, 640, 12), PAL.wood, { key: 'mnFrame', pat: pat.grainWood('rgba(120,60,20,0.2)') });
  cut(rect(200, 670, 420, 580, 6), WN.chalk, { key: 'mnBoard', shadow: false, grain: 1.2 });
  handText('MENU:', 240, 760, 76, '#f4f1e6', { key: 'mnTitle', weight: 700 });
  for (let i = 0; i < 4; i++) ink([[240, 860 + i * 100], [580, 860 + i * 100]], { w: 4, color: 'rgba(244,241,230,0.45)', amt: 1.4, key: 'mnLine' + i });
  // the gecko crawls across the board during the silence; a leaf falls
  const gk = seg(TT, 34.4, 36.1);
  if (gk > 0 && gk < 1) { const gx = lerp(640, 160, gk), gy = 1000 + Math.sin(gk * 14) * 12; cut(ellipsePts(gx, gy, 34, 12, 0, 16), '#9bb36a', { key: 'gecko', sb: 3 }); cut(capsulePts(gx + 30, gy, gx + 80, gy + Math.sin(TT * 9) * 8, 9), '#9bb36a', { key: 'geckoT', sb: 3 }); dot(gx - 26, gy - 4, 3); }
  const lf = seg(TT, 33.0, 36.2); if (lf > 0 && lf < 1) leaf(860 + Math.sin(lf * 9) * 60, lerp(300, 1300, lf), lf * 6, 'mnLeaf', PAL.mustard);
  fly(860, 820, 'mnFly');
  // Juned: scratching (the question) -> wow (the stamp)
  const after = past(TT, st);
  juned(850, 1640, 0.9, { pose: after ? 'point' : 'scratch', mood: after ? 'wow' : 'sad', key: 'jMenu' });
  if (!after) { const q = popS(VW('masalah', 'nggak')); if (q > 0) { ctx.save(); ctx.translate(880, 900); ctx.scale(q, q); handText('?', 0, 0, 120, PAL.ink, { key: 'q1', weight: 700 }); ctx.restore(); } }
  // THE STAMP: drops from above on the hit, leaves a red stamp across the board
  if (TT >= st - 0.25) {
    const k = clamp((TT - (st - 0.25)) / 0.25);   // falling in the last 6 frames before the hit
    if (k < 1) { const yy = lerp(-500, 820, EZ.i2(k)); cut(rect(260, yy, 300, 120, 14), PAL.woodD, { key: 'stH' }); cut(rect(230, yy + 110, 360, 60, 6), WN.red, { key: 'stF' }); }
    else {
      const bk = EZ.back(ev(st, 0.3)); ctx.save(); ctx.translate(410, 960); ctx.scale(bk, bk); ctx.fillStyle = PAL.yellow;
      ctx.beginPath(); for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, r = i % 2 ? 260 : 380; ctx.lineTo(Math.cos(a) * r * 1.15, Math.sin(a) * r * 0.85); } ctx.closePath(); ctx.fill(); ctx.restore();
      cut(rect(170, 820, 480, 290, 18), '#ffffff', { key: 'stPaper', tear: 1.6, sb: 14 });
      ctx.save(); ctx.translate(410, 960); ctx.rotate(-0.12);
      const ink2 = 'rgba(200,66,58,0.92)';
      ctx.strokeStyle = ink2; ctx.lineWidth = 12; trace(wobble(rrectPts(-250, -150, 500, 300, 20), true, 3, 'stB', 8), true); ctx.stroke();
      handText('KOMEN =', -handW('KOMEN =', 84, 700) / 2, -25, 84, ink2, { key: 'stT1', weight: 700 });
      handText('PESAN MENU', -handW('PESAN MENU', 72, 700) / 2, 85, 72, ink2, { key: 'stT2', weight: 700 });
      ctx.restore();
      if (TT < st + 0.5) { const R = RNG('dust'); for (let i = 0; i < 12; i++) { const a = R.r(0, TAU), d = 200 + 260 * ev(st, 0.5); sparkle(410 + Math.cos(a) * d, 960 + Math.sin(a) * d * 0.6, 16 * (1 - ev(st, 0.5)) + 3, '#fff'); } }
    }
  }
  if (past(TT, st)) capStrip('kalian yang tentukan!');
  else capStrip('menunya... belum ada');
}

// 10. THE END: the same framing as the dream, small and honest: the cart at dusk, "CABANG 1/100", customers 0 -> 1
function sEnd() {
  sky(WN.dusk3, WN.dusk1, 'enSky');
  for (let i = 0; i < 18; i++) { const R = RNG('st', i); const tw = ev(53.0 + i * 0.15, 0.3); if (tw > 0) sparkle(R.r(40, 1040), R.r(260, 700), (6 + 4 * ((B + i) % 2)) * tw); }
  cut(ellipsePts(860, 560, 70, 70, 0, 30), '#ffd98a', { key: 'enSun', crayon: '#f0b04a' });
  birdsOnWire(640, 'enw');
  ground(1300, '#2f9e5a', 'enGround');
  // the cart in the same spot as the restaurant, lamp lit, the warung sign
  const glow = 0.55 + 0.1 * Math.sin(TT * 6);
  ctx.save(); const g = ctx.createRadialGradient(560, 860, 20, 560, 860, 420); g.addColorStop(0, `rgba(255,214,120,${glow})`); g.addColorStop(1, 'rgba(255,214,120,0)'); ctx.fillStyle = g; ctx.fillRect(0, 400, W, 900); ctx.restore();
  gerobak(560, 1380, 0.95, { key: 'enCart', parts: 9, sign: 'WARUNG NETIZEN' });
  cut(capsulePts(560, 800, 560, 835, 8), PAL.ink, { key: 'enLampW', shadow: false }); cut(ellipsePts(560, 865, 34, 40, 0, 20), '#ffe9a8', { key: 'enLamp', sb: 18, shc: 'rgba(255,200,90,0.9)' });
  tag('CABANG 1/100', 560, 720, 64, { fill: PAL.yellow, rot: 0.08, s: popS(VW('akhir', 'cabang')) });
  // the customers board: 0 -> 1 on "pertama"
  cut(rect(60, 1040, 260, 210, 8), PAL.wood, { key: 'enPB' }); cut(rect(76, 1056, 228, 178, 4), WN.chalk, { key: 'enPBi', shadow: false });
  handText('PELANGGAN', 92, 1106, 32, '#f4f1e6', { key: 'enPBt' });
  const one = past(TT, TIMELINE.cues.one);
  handText(one ? '1' : '0', 165, 1212, 92, one ? PAL.yellow : '#f4f1e6', { key: one ? 'enN1' : 'enN0', weight: 700 });
  if (one && TT < TIMELINE.cues.one + 0.6) { const k = ev(TIMELINE.cues.one, 0.6); for (let j = 0; j < 8; j++) { const a = j / 8 * TAU; sparkle(190 + Math.cos(a) * 110 * k, 1170 + Math.sin(a) * 110 * k, 14 * (1 - k) + 3, PAL.yellow); } }
  juned(900, 1660, 0.8, { pose: 'wave', mood: 'happy', key: 'jEnd' });
  cat(200, 1410, 0.75, PAL.charcoal, 'enCat');
  capStrip('cabang pertama. 99 lagi.');
}
