import { C } from "./lib";
import { Gerobak, Sticker, Sunburst, T } from "./Props";
import { Juned } from "./Juned";
import { Bowl } from "./scenes/Day3";

export const CoverDay3 = () => <svg width={1080} height={1920} viewBox="0 0 1080 1920">
  <Sunburst cx={540} cy={800} a="#ffd23f" b="#ffab35" t={0} />
  <Sticker x={540} y={270} text="WARUNG KOMEN • DAY 3" size={54} fill={C.white} t={1} />
  <T x={540} y={490} size={150} color={C.red} stroke={C.white}>MIE AYAM!</T>
  <Sticker x={540} y={630} text="AKHIRNYA MENANG!" size={66} t={1} fill={C.white} rot={-4} />
  <Bowl x={420} y={950} s={1.4} t={0} extra />
  <Sticker x={720} y={1000} text="42 LIKE!" size={68} t={1} fill={C.teal} color={C.white} rot={7} />
  <Gerobak x={320} y={1630} s={0.68} sign="WARUNG KOMEN" />
  <Juned x={780} y={1660} s={0.85} t={0} pose="proud" mood="happy" talk={false} />
  <Sticker x={540} y={1770} text="MENU KE-2 • CABANG 1/100" size={43} fill={C.white} t={1} />
</svg>;
