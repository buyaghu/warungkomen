// =====================================================================
//  SHOTS B — Day 1, the middle: the empty lot, laid off, Rp500k, building the cart, the empty board,
//  the three rules, the empty credit book. Cued from the voice (VW).
// =====================================================================
// 2. DAY 1: an empty lot, crickets. Juned walks in from the right.
function sLot() {
  sky(WN.skyA, WN.skyB, 'ltSky');
  cloud(250, 420, 1.0, 'ltC1'); cloud(820, 560, 0.7, 'ltC2');
  birdsOnWire(700, 'ltw');
  ground(1180, WN.grass, 'ltGround');
  // a fence and a "tanah kosong" sign
  for (let i = 0; i < 8; i++) cut(rect(40 + i * 130, 1080, 26, 170, 4), PAL.woodL, { key: 'ltF' + i, sb: 5 });
  cut(rect(20, 1120, 1040, 22, 4), PAL.wood, { key: 'ltRail', sb: 5 });
  cut(rect(170, 1200, 18, 260, 3), PAL.woodD, { key: 'ltPost' });
  card('TANAH KOSONG', 290, 1210, 46, PAL.paper, { rot: -0.05 });
  // crickets
  const kr = (B % 12) < 6;
  if (kr) { handText('krik', 650, 1330, 44, PAL.greenD, { key: 'krik1', rot: -0.1 }); handText('krik', 760, 1290, 36, PAL.greenD, { key: 'krik2', rot: 0.1 }); }
  cat(860, 1420, 0.8, PAL.mustard, 'ltCat');
  // Juned walks in carrying a cardboard box
  const x = springMove(TIMELINE.cues.walkIn, 1300, 520, SPRING.smooth);
  const step = TT < TIMELINE.cues.walkIn + 0.9 ? Math.abs(Math.sin(TT * 10)) * 14 : 0;
  const hp = juned(x, 1640 - step, 0.9, { pose: 'hold', mood: past(TT, VW('day1', 'ini')) ? 'smile' : 'focus', key: 'jLot' });
  cut(rect(hp[0][0] - 20, hp[0][1] - 120, 170, 130, 6), '#c99a5e', { key: 'ltBox', pat: pat.lines('rgba(120,80,40,0.25)', 24) });
  // DAY 1 tag on "hari"
  const d = popS(VW('day1', 'hari'));
  if (d > 0) DEFER.push(() => tag('DAY 1', 230, SAFE.top + 110, 110, { fill: PAL.yellow, rot: -0.05, s: d }));
  capStrip('tapi itu nanti.');
}

// 3. LAID OFF: in front of the office, a box of his things, a rain cloud of his own
function sOffice() {
  sky('#7fa7d9', '#c9dcf2', 'ofSky');
  cut(rect(90, 300, 900, 1000, 8), '#9aa6b8', { key: 'ofBld', pat: pat.lines('rgba(255,255,255,0.18)', 60) });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) cut(rect(150 + c * 210, 380 + r * 200, 150, 130, 4), (r + c + (B >> 3)) % 5 === 0 ? '#ffe78a' : '#5c7fb0', { key: 'ofW' + r + c, sb: 4 });
  card('PT. MAJU MUNDUR', 540, 290, 58, PAL.paper, { rot: 0.02 });
  ground(1300, '#b9b4ac', 'ofGround', { pat: pat.lines('rgba(0,0,0,0.10)', 60) });
  // papers flying out of a window
  for (let i = 0; i < 6; i++) { const R = RNG('pp', i), k = mod(TT * 0.25 + R.f(), 1); ctx.save(); ctx.translate(R.r(80, 950) + Math.sin(TT * 2 + i) * 50, lerp(400, 1250, k)); cut(rot(rect(-35, -45, 70, 90, 3), 0, 0, k * 6 + i), '#ffffff', { key: 'pp' + i, sb: 5, pat: pat.lines('rgba(80,90,120,0.3)', 14, 18) }); ctx.restore(); }
  const sad = past(TT, VW('phk', 'lalu'));
  const hp = juned(540, 1660, 0.95, { pose: 'hold', mood: sad ? 'sad' : 'smile', key: 'jOff' });
  // the box: a plant and a mug sticking out
  plant(hp[0][0] + 20, hp[0][1] - 140, 0.55, PAL.pink, 'ofPl');
  mug(hp[1][0] + 10, hp[1][1] - 150, 0.6, PAL.yellow, 'ofMug', false);
  cut(rect(hp[0][0] - 70, hp[0][1] - 110, 280, 150, 6), '#c99a5e', { key: 'ofBox', pat: pat.lines('rgba(120,80,40,0.25)', 24) });
  // the little rain cloud arrives on "PHK"
  const rc = popS(VW('phk', 'kena'));
  if (rc > 0) {
    ctx.save(); ctx.translate(540, 860); ctx.scale(rc, rc); cloud(0, 0, 1.2, 'ofRain'); ctx.restore();
    for (let i = 0; i < 9; i++) { const y = mod(TT * 900 + i * 70, 300); ink([[460 + i * 20, 900 + y], [455 + i * 20, 930 + y]], { w: 5, color: '#4c8de0', amt: 0.2, key: 'drop' + i }); }
  }
  if (sad) capStrip('kena PHK...'); else capStrip('nama saya Juned');
}

// 4. RP500K: the severance envelope on the table, five notes counted out, then the classified ad for a cart
function sModal() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.wood, { key: 'mdTable', shadow: false, tear: 0, pat: pat.grainWood('rgba(120,60,20,0.22)') });
  cut(rect(80, 140, 400, 300, 8), '#ffffff', { key: 'mdNews', pat: pat.lines('rgba(60,60,60,0.25)', 22, 30), sb: 6 });   // a newspaper corner
  mug(870, 330, 1.0, PAL.blue, 'mdMug');
  // the envelope
  cut(rect(160, 520, 620, 360, 10), '#f3e3c0', { key: 'mdEnv', sb: 12 });
  cut([[160, 530], [470, 740], [780, 530]], '#e6d0a3', { key: 'mdFlap', sb: 6 });
  handText('PESANGON', 320, 830, 60, PAL.ink, { key: 'mdEnvT', weight: 700 });
  // five red notes fan out, one per beat from "lima"
  const t0 = VW('modal', 'lima');
  for (let i = 0; i < 5; i++) {
    const k = popS(t0 + i * 0.2); if (k <= 0) continue;
    ctx.save(); ctx.translate(300 + i * 95, 1090); ctx.rotate(-0.25 + i * 0.12); ctx.scale(k, k);
    cut(rect(-150, -75, 300, 150, 8), '#f0727a', { key: 'note' + i, sb: 8, pat: pat.lines('rgba(255,255,255,0.25)', 16) });
    handText('100.000', -100, 20, 50, '#7a1f28', { key: 'noteT' + i, weight: 700 });
    ctx.restore();
  }
  // the classified ad: a second-hand cart for Rp500.000, on "gerobak"
  const ad = popS(VW('modal', 'gerobak'));
  if (ad > 0) {
    ctx.save(); ctx.translate(540, 1330); ctx.rotate(0.04); ctx.scale(ad, ad);
    cut(rect(-300, -150, 600, 300, 6), PAL.paper, { key: 'mdAd', sb: 12, pat: pat.lines('rgba(60,60,60,0.12)', 20) });
    handText('DIJUAL: GEROBAK BEKAS', -270, -90, 44, PAL.ink, { key: 'mdAdT', weight: 700 });
    gerobak(-130, 120, 0.3, { key: 'mdCart', parts: 9 });
    handText('Rp500.000', 20, 40, 60, WN.red, { key: 'mdAdP', weight: 700 });
    ctx.restore();
  }
  // Juned's hand counting
  hand(1000, 1150 + Math.sin(TT * 6) * 10, 1.0, Math.PI * 1.05, PAL.skin2, WN.shirt, { key: 'mdHand' });
  if (past(TT, VW('modal', 'cukup'))) capStrip('cukup buat... satu gerobak'); else capStrip('Rp500.000');
}

// 5. BUILDING THE CART: a time-lapse, parts arrive, the bent wheel tilts it, the bell rings
function sBuild() {
  sky(WN.skyA, WN.skyB, 'bdSky');
  cloud(200 + mod(TT * 120, 900), 420, 0.9, 'bdC1');   // time-lapse clouds race
  ground(1250, WN.grass, 'bdGround');
  // the time-lapse clock
  const hrs = 8 + seg(TT, 20.25, 26.75) * 9;
  clock(880, 420, 100, Math.floor(hrs), (hrs % 1) * 60, 'bdClock');
  const parts = Math.min(9, 1 + Math.floor(seg(TT, 20.3, 22.2) * 9));
  const tilt = past(TT, VW('gerobak', 'miring')) ? springMove(VW('gerobak', 'miring'), 0, 0.07, SPRING.playful) : 0;
  gerobak(470, 1360, 1.0, { key: 'bdCart', parts, tilt });
  if (past(TT, VW('gerobak', 'miring')) && TT < VW('gerobak', 'miring') + 1.2) tag('TOING!', 330, 1000, 64, { fill: PAL.yellow, rot: 0.1, s: popS(VW('gerobak', 'miring')), tape: false });
  // bell rings on "usaha"
  const bell = VW('gerobak', 'usaha');
  if (past(TT, bell) && TT < bell + 1.4) { handText('ting! ting!', 300, 760, 64, PAL.ink, { key: 'ting', rot: -0.08, weight: 700 }); }
  const happy = past(TT, VW('gerobak', 'namanya'));
  juned(860, 1660, 0.85, { pose: happy ? 'proud' : 'hammer', mood: happy ? 'happy' : 'focus', key: 'jBuild' });
  for (let i = 0; i < 4; i++) { const R = RNG('nail', i); dot(R.r(200, 900), R.r(1450, 1550), 5, '#9a9aa6'); }   // spare nails
  capStrip(happy ? 'namanya juga usaha' : 'gerobak bekas, roda miring');
}

// 6. THE BOARD: customers 0, takings Rp0, written in chalk
function sPapan() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.woodD, { key: 'ppWall', shadow: false, tear: 0, pat: pat.grainWood('rgba(60,30,10,0.25)') });
  cut(rect(90, 380, 900, 1000, 16), PAL.wood, { key: 'ppFrame', sb: 18, pat: pat.grainWood('rgba(120,60,20,0.25)') });
  cut(rect(130, 420, 820, 920, 8), WN.chalk, { key: 'ppBoard', shadow: false, grain: 1.4 });
  const a = VW('papan', 'pelanggan'), b = VW('papan', 'omzet');
  handText('PELANGGAN:', 190, 640, 92, '#f4f1e6', { key: 'pp1', weight: 700, frac: ev(a - 0.1, 0.5) });
  handText('0', 700, 820, 170, PAL.yellow, { key: 'pp1n', weight: 700, frac: ev(VW('papan', 'nol'), 0.25) });
  handText('OMZET:', 190, 1040, 92, '#f4f1e6', { key: 'pp2', weight: 700, frac: ev(b - 0.1, 0.4) });
  handText('Rp0', 560, 1230, 150, PAL.yellow, { key: 'pp2n', weight: 700, frac: ev(VW('papan', 'nol', 1), 0.3) });
  // the chalk follows the writing
  const cx = TT < b ? lerp(190, 900, ev(a - 0.1, 0.9)) : lerp(190, 900, ev(b - 0.1, 0.9)), cy = TT < b ? 660 : 1060;
  cut(rot(rect(cx, cy, 90, 26, 6), cx, cy, -0.5), '#ffffff', { key: 'chalk', sb: 6 });
  fly(820, 520, 'ppFly');
  cut(rect(200, 1300, 680, 40, 4), PAL.woodL, { key: 'ppLedge', sb: 6 });
}

// 8. THE RULES: three order slips pegged on a string, one per rule, as he says it
function sRules() {
  cut(rect(-30, -30, W + 60, H + 60, 0), '#fff1c2', { key: 'ruWall', shadow: false, tear: 0, pat: pat.gingham('rgba(238,47,47,0.18)', 30) });
  const R = [
    { t: 40.0, a: 'FOLLOW', b: '= JADI PELANGGAN', icon: 'user', c: '#ffffff' },
    { t: VW('aturan1', 'komen'), a: 'KOMEN', b: '= PESAN MENU', icon: 'chat', c: '#ffffff' },
    { t: VW('aturan2', 'komen'), a: 'KOMEN TERATAS', b: '= DIMASAK BESOK', icon: 'heart', c: '#ffffff' },
  ];
  ink([[-20, 330], [540, 380], [1100, 330]], { w: 4, color: PAL.ink, amt: 0.4, key: 'ruString' });
  R.forEach((r, i) => {
    const k = popS(r.t); if (k <= 0) return;
    const y = 420 + i * 340, sw = Math.sin(TT * 3 + i) * 0.02, live = TT >= r.t && (i === 2 || TT < R[i + 1].t);
    ctx.save(); ctx.translate(540, y); ctx.rotate(sw + (i - 1) * 0.03); ctx.scale(k * (live ? 1.04 : 1), k * (live ? 1.04 : 1));
    cut(rect(-420, 0, 840, 280, 6), r.c, { key: 'slip' + i, sb: 12, pat: pat.lines('rgba(60,60,60,0.10)', 26, 30) });
    cut(rect(-30, -26, 60, 52, 6), PAL.woodL, { key: 'peg' + i, sb: 4 });
    // icon
    if (r.icon === 'user') { cut(ellipsePts(-320, 110, 36, 36, 0, 20), PAL.blue, { key: 'ic0a' }); cut(rect(-372, 150, 104, 70, 30), PAL.blue, { key: 'ic0b' }); handText('+', -280, 120, 60, PAL.blue, { key: 'ic0c', weight: 700 }); }
    if (r.icon === 'chat') { cut(rect(-385, 80, 130, 100, 24), PAL.teal, { key: 'ic1a' }); cut([[-360, 170], [-340, 215], [-320, 170]], PAL.teal, { key: 'ic1b', shadow: false }); }
    if (r.icon === 'heart') { const P = []; for (let j = 0; j < 30; j++) { const t = j / 30 * TAU; P.push([-320 + 16 * Math.sin(t) ** 3 * 3.6, 140 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 3.6]); } cut(P, WN.red, { key: 'ic2' }); }
    handText(r.a, -220, 115, r.a.length > 8 ? 66 : 80, PAL.ink, { key: 'slA' + i, weight: 700 });
    handText(r.b, -220, 215, 58, WN.red, { key: 'slB' + i, weight: 700, frac: ev(r.t + 0.3, 0.5) });
    ctx.restore();
  });
  // Juned peeks from the bottom corner, pointing up
  juned(900, 1900, 0.75, { pose: 'wave', mood: 'happy', key: 'jRules' });
}

// 9. THE CREDIT BOOK: empty pages; line 1 is for you
function sBon() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.wood, { key: 'bnTable', shadow: false, tear: 0, pat: pat.grainWood('rgba(120,60,20,0.22)') });
  mug(900, 300, 1.0, PAL.pink, 'bnMug');
  cut(rect(60, 200, 260, 160, 10), '#5b6b7a', { key: 'bnCalc', sb: 8 }); handText('0', 250, 300, 60, '#c8f0c0', { key: 'bnCalcT', weight: 700 });
  // the open book
  cut(rect(110, 430, 860, 1060, 12), '#2b5aa8', { key: 'bnCover', sb: 18 });
  cut(rect(140, 450, 800, 1020, 6), '#fffdf4', { key: 'bnPage', shadow: false, pat: pat.lines('rgba(60,110,200,0.25)', 70, 140) });
  ink([[230, 450], [230, 1470]], { w: 3, color: 'rgba(238,47,47,0.5)', amt: 0.3, key: 'bnMargin' });
  handText('BUKU BON', 300, 560, 84, '#2b5aa8', { key: 'bnTitle', weight: 700 });
  handText('No.  Nama            Utang', 250, 660, 40, 'rgba(40,40,60,0.7)', { key: 'bnHead' });
  handText('1.', 250, 800, 64, PAL.ink, { key: 'bn1' });
  // "kamu?" is written on "kamu"
  const kw = VW('bon', 'kamu');
  handText('kamu?', 340, 800, 72, WN.red, { key: 'bnKamu', weight: 700, frac: ev(kw - 0.2, 0.6) });
  ['2.', '3.', '4.', '5.'].forEach((n, i) => handText(n, 250, 940 + i * 140, 64, 'rgba(40,40,60,0.35)', { key: 'bnN' + i }));
  // the pencil
  const px = TT < kw - 0.2 ? 700 : lerp(340, 600, ev(kw - 0.2, 0.6)), py = TT < kw - 0.2 ? 1150 : 780;
  drawPencil(px, py, -0.7, 260, 1, 'bnPencil');
  capStrip(past(TT, VW('bon', 'halaman')) ? 'halaman pertama... buat kamu' : 'masih kosong');
}
