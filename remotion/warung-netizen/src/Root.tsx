import { Composition, Folder, Still } from "remotion";
import { WarungDay1, DURATION_S } from "./WarungDay1";
import { DAY1, DAY1_TIKTOK, DAY2, DAY2_TIKTOK, DAY3, DAY3_TIKTOK, EpisodeSchema } from "./episode";
import { WarungDay2, DURATION2_S } from "./WarungDay2";
import { WarungDay3, DURATION3_S } from "./WarungDay3";
import { CoverDay3 } from "./CoverDay3";
import { FPS, H, W } from "./lib";
import { Avatar, CoverSchema, HighlightCover } from "./Branding";

export const RemotionRoot = () => (
  <>
    <Composition
      id="WarungDay1"
      component={WarungDay1}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={Math.round(DURATION_S * FPS)}
      schema={EpisodeSchema}
      defaultProps={DAY1}
    />
    <Composition
      id="WarungDay1TikTok"
      component={WarungDay1}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={Math.round(DURATION_S * FPS)}
      schema={EpisodeSchema}
      defaultProps={DAY1_TIKTOK}
    />
    <Composition
      id="WarungDay2"
      component={WarungDay2}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={Math.round(DURATION2_S * FPS)}
      schema={EpisodeSchema}
      defaultProps={DAY2}
    />
    <Composition
      id="WarungDay2TikTok"
      component={WarungDay2}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={Math.round(DURATION2_S * FPS)}
      schema={EpisodeSchema}
      defaultProps={DAY2_TIKTOK}
    />
    <Composition id="WarungDay3" component={WarungDay3} width={W} height={H} fps={FPS} durationInFrames={Math.round(DURATION3_S * FPS)} schema={EpisodeSchema} defaultProps={DAY3} />
    <Composition id="WarungDay3TikTok" component={WarungDay3} width={W} height={H} fps={FPS} durationInFrames={Math.round(DURATION3_S * FPS)} schema={EpisodeSchema} defaultProps={DAY3_TIKTOK} />
    <Still id="CoverDay3" component={CoverDay3} width={W} height={H} />
    <Folder name="Instagram">
      <Still id="Avatar" component={Avatar} width={1080} height={1080} />
      <Still id="CoverMenu" component={HighlightCover} width={1080} height={1920} schema={CoverSchema} defaultProps={{ label: "DAFTAR MENU", icon: "menu" as const, bg: "#ff6a2b" }} />
      <Still id="CoverAturan" component={HighlightCover} width={1080} height={1920} schema={CoverSchema} defaultProps={{ label: "ATURAN MAIN", icon: "aturan" as const, bg: "#ee2f2f" }} />
      <Still id="CoverBon" component={HighlightCover} width={1080} height={1920} schema={CoverSchema} defaultProps={{ label: "BUKU BON", icon: "bon" as const, bg: "#2f6fe0" }} />
      <Still id="CoverRapat" component={HighlightCover} width={1080} height={1920} schema={CoverSchema} defaultProps={{ label: "RAPAT PELANGGAN", icon: "rapat" as const, bg: "#12b5a5" }} />
      <Still id="CoverWarung" component={HighlightCover} width={1080} height={1920} schema={CoverSchema} defaultProps={{ label: "PERJALANAN", icon: "gerobak" as const, bg: "#8f5cff" }} />
    </Folder>
  </>
);
