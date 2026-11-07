// =====================================================================
//  SCENES — Warung Netizen Day 1. One function per shot, world coords 1080x1920, animated with TT / ev / popS
//  and cued from the voice (VW). Every scene: a full-bleed world, Mas Juned (or his hand) acting, 3+ details of
//  background life, hand-lettered text on paper. Orange (PAL.orange) = Juned's apron and the warung only.
// =====================================================================
// "cerah & ngejreng": saturated, spanduk/sticker colours. The hero orange gets punchier too (still reserved).
PAL.orange = '#ff6a2b'; PAL.orangeD = '#d8461a'; PAL.yellow = '#ffd23f'; PAL.pink = '#ff7eb6'; PAL.purple = '#8f5cff';
PAL.green = '#3fbf4f'; PAL.greenD = '#23943a'; PAL.blue = '#2f6fe0'; PAL.teal = '#14b3a8'; PAL.mustard = '#ffb703';
const WN = {   // piece colours (orange stays reserved)
  shirt: '#12b5a5', pants: '#2b3a9a', hair: '#1c1412', towel: '#ffffff', towelS: '#2f6fe0', red: '#ee2f2f', chalk: '#17614a',
  dusk1: '#ffa630', dusk2: '#ff4f8b', dusk3: '#5b2bb5', grass: '#46c24a', road: '#ffd08a', cart: '#1f7ae0', cartD: '#1559ad',
  skyA: '#3ec4f5', skyB: '#b8ecff', sun1: '#ffe14d', sun2: '#ffc21a',
};
// a sunburst (spanduk rays) behind a scene: alternating wedges from (cx, cy)
function sunburst(cx, cy, c1, c2, n = 18, key = 'sb') {
  cut(rect(-30, -30, W + 60, H + 60, 0), c1, { key, shadow: false, tear: 0, shade: false, grain: 0.6, pat: () => {
    ctx.fillStyle = c2; const r0 = (TT * 0.15) % (TAU / n), R = 2400;
    for (let i = 0; i < n; i += 1) { if (i % 2) continue; const a0 = r0 + i / n * TAU, a1 = a0 + TAU / n; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a0) * R, cy + Math.sin(a0) * R); ctx.lineTo(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R); ctx.closePath(); ctx.fill(); }
  } });
}

// ---- MAS JUNED: full body, feet at (x, y). pose: 'stand' | 'scratch' | 'wave' | 'hold' | 'point' | 'hammer' | 'proud'
//      mood: face() moods. o.hat = 'chef' (the dream). Idle: a small bob and a blink.
function juned(x, y, s, o = {}) {
  const key = o.key ?? 'jn', pose = o.pose ?? 'stand', skin = PAL.skin2;
  const ph = key.length * 1.3, bob = Math.sin(TT * TAU * 0.8 + ph) * 4 * s;
  let mood = o.mood ?? 'smile';
  if (mood !== 'happy' && mood !== 'focus' && (B + Math.round(ph * 7)) % 41 < 2) mood = 'focus';   // blink
  const sx = (v) => x + v * s, sy = (v) => y + v * s + (v < -150 ? bob : 0);
  // legs + sandals
  [-1, 1].forEach((d) => {
    cut(capsulePts(sx(d * 38), sy(-210), sx(d * 42), sy(-28), 58 * s), WN.pants, { key: key + 'leg' + d, sb: 6 });
    cut(ellipsePts(sx(d * 50), sy(-14), 42 * s, 16 * s, 0, 18), '#6b4a34', { key: key + 'sd' + d, sb: 4 });
  });
  // arms behind the body for some poses are drawn after; shoulders
  const SH = [[sx(-104), sy(-400)], [sx(104), sy(-400)]];
  const HANDS = {
    stand:   [[-150, -230], [150, -230]],
    scratch: [[-150, -230], [70, -590]],
    wave:    [[-150, -230], [210, -600 + Math.sin(TT * 9) * 30]],
    hold:    [[-70, -300], [70, -300]],
    point:   [[-150, -230], [230, -420]],
    hammer:  [[-150, -230], [200, -470 + Math.abs(Math.sin(TT * 7)) * -90]],
    proud:   [[-110, -330], [110, -330]],
  }[pose];
  const hp = HANDS.map(([hx, hy]) => [sx(hx), sy(hy)]);
  const arm = (i) => {
    cut(capsulePts(SH[i][0], SH[i][1], hp[i][0], hp[i][1], 50 * s), WN.shirt, { key: key + 'arm' + i, sb: 6, pat: pat.stripes('rgba(255,255,255,0.16)', 6, 22) });
    cut(ellipsePts(hp[i][0], hp[i][1], 30 * s, 28 * s, 0, 16), skin, { key: key + 'hand' + i, sb: 4 });
  };
  // torso (kaos teal, striped)
  cut(rect(sx(-112), sy(-440), 224 * s, 270 * s, 70 * s), WN.shirt, { key: key + 'torso', pat: pat.stripes('rgba(255,255,255,0.16)', 6, 22) });
  // THE APRON (the hero colour)
  cut([[sx(-78), sy(-405)], [sx(78), sy(-405)], [sx(96), sy(-150)], [sx(-96), sy(-150)]], PAL.orange, { key: key + 'apron', crayon: PAL.orangeD, crAl: 0.35, crPer: 30, sb: 6 });
  cut(rect(sx(-46), sy(-270), 92 * s, 60 * s, 8 * s), PAL.orangeD, { key: key + 'pocket', shadow: false, grain: 0.5 });
  ink([[sx(-30), sy(-250)], [sx(30), sy(-250)]], { w: 3 * s, color: 'rgba(255,240,220,0.7)', amt: 0.4, key: key + 'stitch' });
  if (pose !== 'hold' && pose !== 'proud') { arm(0); arm(1); }
  // the towel round the neck (white with blue stripes), one end hanging
  cut(capsulePts(sx(-92), sy(-425), sx(92), sy(-425), 46 * s), WN.towel, { key: key + 'towel', sb: 5, pat: pat.stripes(WN.towelS, 6 * s, 30 * s, Math.PI / 2) });
  cut(capsulePts(sx(-60), sy(-420), sx(-70), sy(-320), 40 * s), WN.towel, { key: key + 'towelE', sb: 5, pat: pat.stripes(WN.towelS, 6 * s, 30 * s, 0) });
  // head
  cut(rect(sx(-22), sy(-470), 44 * s, 50 * s, 10 * s), skin, { key: key + 'neck', shadow: false });
  cut(ellipsePts(sx(-82), sy(-540), 14 * s, 20 * s, 0, 14), skin, { key: key + 'earL' });
  cut(ellipsePts(sx(82), sy(-540), 14 * s, 20 * s, 0, 14), skin, { key: key + 'earR' });
  cut(ellipsePts(sx(0), sy(-545), 84 * s, 90 * s, 0, 30), skin, { key: key + 'head' });
  // messy hair with a tuft that sways
  const tuft = Math.sin(TT * 5 + ph) * 8 * s;
  cut([[sx(-88), sy(-550)], [sx(-90), sy(-600)], [sx(-60), sy(-640)], [sx(-10), sy(-655)], [sx(10) + tuft, sy(-700)], [sx(30), sy(-650)],
       [sx(70), sy(-635)], [sx(92), sy(-590)], [sx(86), sy(-555)], [sx(60), sy(-600)], [sx(10), sy(-610)], [sx(-50), sy(-600)]], WN.hair, { key: key + 'hair', sb: 4 });
  if (o.hat === 'chef') {
    cut(rect(sx(-70), sy(-650), 140 * s, 50 * s, 6 * s), '#ffffff', { key: key + 'hatB', sb: 5 });
    [-50, 0, 50].forEach((d, i) => cut(ellipsePts(sx(d), sy(-700), 48 * s, 52 * s, 0, 22), '#ffffff', { key: key + 'hat' + i, sb: 4 }));
  }
  // eyebrows tell the mood
  const bt = mood === 'sad' ? 8 : mood === 'wow' ? -10 : 0;
  ink([[sx(-36), sy(-575 - bt * 0.3)], [sx(-12), sy(-578 + bt)]], { w: 5 * s, color: WN.hair, amt: 0.3, key: key + 'brL' });
  ink([[sx(12), sy(-578 + bt)], [sx(36), sy(-575 - bt * 0.3)]], { w: 5 * s, color: WN.hair, amt: 0.3, key: key + 'brR' });
  face(sx(0), sy(-540), 1.35 * s, mood);
  if (pose === 'hold' || pose === 'proud') { arm(0); arm(1); }
  return hp;   // hand positions, for props
}

// ---- shared props
function sky(c1, c2, key) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2);
  cut(rect(-30, -30, W + 60, H + 60, 0), c1, { key, shadow: false, tear: 0, shade: false, grain: 0.6, pat: () => { ctx.fillStyle = g; ctx.fillRect(-30, -30, W + 60, H + 60); } });
}
function ground(y, c, key, o = {}) { cut([[-40, y + 20], [300, y - 10], [700, y + 15], [1120, y - 5], [1120, H + 40], [-40, H + 40]], c, { key, sy: -4, pat: o.pat ?? pat.stripes('rgba(255,255,255,0.10)', 4, 24, 0.25) }); }
function cloud(x, y, s, key) { [[0, 0, 70, 34], [-55, 12, 48, 26], [55, 10, 52, 28]].forEach(([dx, dy, rx, ry], i) => cut(ellipsePts(x + dx * s, y + dy * s, rx * s, ry * s, 0, 22), '#ffffff', { key: key + i, sb: 6, shadow: i === 0 })); }
function birdsOnWire(y, key) {
  ink([[-20, y], [400, y + 30], [1100, y - 10]], { w: 3, color: PAL.ink, amt: 0.4, key: key + 'w' });
  [[180, 0], [240, 4], [300, 8]].forEach(([bx, d], i) => {
    const hop = (B + i * 5) % 29 < 2 ? -8 : 0;
    cut(ellipsePts(bx, y + 14 + d - 18 + hop, 22, 17, 0, 16), PAL.navy, { key: key + 'b' + i, sb: 3 });
    dot(bx + 10, y + d - 8 + hop, 3, '#fff');
  });
}
function leaf(x, y, a, key, c = PAL.green) { cut(rot(ellipsePts(x, y, 26, 11, 0, 14), x, y, a), c, { key, sb: 4 }); }
function fly(x0, y0, key) { const x = x0 + Math.sin(TT * 5.3) * 60, y = y0 + Math.sin(TT * 8.1) * 30; dot(x, y, 6, PAL.ink); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.ellipse(x - 5, y - 8, 7, 4, -0.5, 0, TAU); ctx.ellipse(x + 5, y - 8, 7, 4, 0.5, 0, TAU); ctx.fill(); }
// the cart (gerobak): body, glass case, roof, wheels. o.tilt rotates it on its right wheel (the bent wheel)
function gerobak(x, y, s, o = {}) {
  const key = o.key ?? 'gb', parts = o.parts ?? 9;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.tilt ?? 0); ctx.scale(s, s);
  if (parts >= 3) { [-170, 170].forEach((dx, i) => cut(rect(dx - 10, -560, 20, 360, 4), PAL.woodD, { key: key + 'post' + i })); }
  if (parts >= 4) cut([[-240, -560], [240, -560], [270, -620], [-270, -620]], o.roof ?? WN.red, { key: key + 'roof', pat: pat.stripes('rgba(255,255,255,0.35)', 22, 60), sb: 8 });
  if (parts >= 1) cut(rect(-230, -230, 460, 170, 10), WN.cart, { key: key + 'body', pat: pat.lines('rgba(255,255,255,0.18)', 34, 12) });
  if (parts >= 5) { cut(rect(-200, -380, 400, 150, 8), 'rgba(220,240,250,0.55)', { key: key + 'glass', sb: 6 }); ink([[-150, -360], [-110, -250]], { w: 6, color: 'rgba(255,255,255,0.8)', key: key + 'shine' }); }
  if (parts >= 2) { [[-150, 0], [150, 0]].forEach(([dx], i) => { cut(ellipsePts(dx, -50, 52, 52, 0, 26), PAL.charcoal, { key: key + 'wh' + i }); dot(dx, -50, 14, '#c9c2b5'); }); }
  if (parts >= 1) cut(capsulePts(225, -120, 320, -135, 20), PAL.woodD, { key: key + 'handle' });
  if (o.sign) { cut(rect(-160, -170, 320, 70, 6), PAL.orange, { key: key + 'sign', crayon: PAL.orangeD, crAl: 0.3, sb: 4 }); handText(o.sign, -handW(o.sign, 46) / 2, -122, 46, '#fff8ea', { key: key + 'signT', weight: 700 }); }
  ctx.restore();
}
// a paper card with a big handwritten line (for signs and boards)
function card(str, x, y, size, fill, o = {}) { tag(str, x, y, size, { fill, tape: o.tape ?? false, rot: o.rot ?? 0, s: o.s ?? 1, frac: o.frac, color: o.color }); }
