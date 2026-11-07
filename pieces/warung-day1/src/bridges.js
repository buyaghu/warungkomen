// =====================================================================
//  CAMERAS AND (NO) BRIDGES — hard cuts on the 8th grid (BRIDGES = []). A small shake on the stamp.
// =====================================================================
const ERA_BG = SHOT_LIST.map(() => '#efe5cf');
function pieceCam(era, t) {
  if (SHOT_LIST[era][1] === 'menu' && t >= STAMP_T && t < STAMP_T + 0.4) {
    const k = 1 - (t - STAMP_T) / 0.4, R = RNG('shake', Math.round(t * FPS));
    return { z: 1 + 0.03 * k, tx: R.n(28 * k) - 16 * k, ty: R.n(28 * k) - 28 * k };
  }
  return null;
}
const BRIDGES = [];
