import { C } from "./lib";
import { Gerobak, Sticker, Sunburst, T } from "./Props";
import { Juned } from "./Juned";
import { BaksoBowl, PELANGGAN } from "./scenes/Day5Full";

export const CoverDay5 = () => <svg width={1080} height={1920} viewBox="0 0 1080 1920">
  <Sunburst cx={540} cy={800} a="#ffd23f" b="#ffab35" t={0} />
  <Sticker x={540} y={270} text="WARUNG KOMEN • DAY 5" size={54} fill={C.white} t={1} />
  <T x={540} y={480} size={140} color={C.red} stroke={C.white}>BAKSO</T>
  <T x={540} y={630} size={140} color={C.red} stroke={C.white}>KEJU!</T>
  <BaksoBowl x={460} y={960} s={1.3} t={0} pull={0.8} />
  <Sticker x={820} y={740} text="58 LIKE!" size={64} t={1} fill={C.teal} color={C.white} rot={7} />
  <Gerobak x={290} y={1660} s={0.62} sign="WARUNG KOMEN" />
  <Juned x={810} y={1700} s={0.8} t={0} pose="point" mood="wow" talk={false} />
  <Sticker x={540} y={1770} text={`PELANGGAN ${PELANGGAN}/1.000 → CABANG 2`} size={40} fill={C.white} t={1} />
</svg>;
