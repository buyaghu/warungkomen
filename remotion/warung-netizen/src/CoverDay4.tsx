import { C } from "./lib";
import { Gerobak, Sticker, Sunburst, T } from "./Props";
import { Juned } from "./Juned";
import { Plate } from "./scenes/Day2";
import { Rice } from "./scenes/Day4Full";

export const CoverDay4 = () => <svg width={1080} height={1920} viewBox="0 0 1080 1920">
  <Sunburst cx={540} cy={800} a="#ffd23f" b="#ffab35" t={0} />
  <Sticker x={540} y={270} text="WARUNG KOMEN • DAY 4" size={54} fill={C.white} t={1} />
  <T x={540} y={470} size={118} color={C.red} stroke={C.white}>NASI DAUN</T>
  <T x={540} y={600} size={118} color={C.red} stroke={C.white}>JERUK!</T>
  <Plate x={640} y={1050} s={1.0} t={0} />
  <Rice x={330} y={1060} s={1.05} t={0} />
  <Sticker x={760} y={790} text="4 LIKE DOANG!" size={58} t={1} fill={C.teal} color={C.white} rot={7} />
  <Gerobak x={320} y={1630} s={0.68} sign="WARUNG KOMEN" />
  <Juned x={780} y={1660} s={0.85} t={0} pose="proud" mood="wow" talk={false} />
  <Sticker x={540} y={1770} text="MENU KE-3 • CABANG 1/100" size={43} fill={C.white} t={1} />
</svg>;
