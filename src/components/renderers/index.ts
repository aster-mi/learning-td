/**
 * Unit renderer registry
 * Maps unit ID → custom draw function
 */

import { drawPencil, drawEraser, drawRuler, drawScissors, drawCompass, drawStapler, drawGlue, drawSharpener } from "./stationery";
import { drawTextbook, drawSchoolbag, drawBell, drawChalk, drawGlobe } from "./school";
import { drawBeaker, drawMagnet, drawBulb, drawTelescope, drawTesttube, drawMicroscope } from "./science";
import { drawAbacus, drawCalculator, drawPi, drawCrayon, drawPalette, drawNote, drawNotebook, drawProtractor, drawGraphpaper, drawPaintbrush } from "./mathArt";
import { drawGearLancer, drawRivetGuard, drawTurbineShooter, drawBoltHammer, drawServoRunner, drawArcCoil, drawForgeKnight, drawPistonBreaker, drawNeonRay, drawChronoMecha, drawBattery, drawDrone } from "./engineering";
import { drawVineSoldier, drawLeafShield, drawWoodArcher, drawBindHound, drawMossKnight, drawSeedMage, drawForestLord, drawThunderOak, drawEmeraldFeather, drawWildZephyr } from "./nature";
import { drawBronzeGuard, drawStoneSentinel, drawLanceRider, drawCrossbowman, drawIronShield, drawFlameTorch, drawWarHammer, drawRoyalDrummer, drawEmperorBow, drawOrichalcum } from "./history";
import { drawRhythmFighter, drawBassDrumGuard, drawTrumpeter, drawVioletString, drawPianoForte, drawSymphonia, drawHarmonyGuard, drawMetronomeKnight, drawOperaArcher, drawStarConductor } from "./music";
import { drawRunnerBlade, drawKeeperGuard, drawArrowThrow, drawSpeedSmasher, drawTackleWall, drawServecannon, drawCaptainArmor, drawPowerHurdle, drawChampionBow, drawOlympia } from "./sports";

export type UnitDrawFn = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  r: number, col: string,
  t: number, ph: number,
) => void;

/** ID → 描画関数マップ */
export const UNIT_RENDERERS: Record<string, UnitDrawFn> = {
  // 文房具シリーズ
  pencil:    drawPencil,
  eraser:    drawEraser,
  ruler:     drawRuler,
  scissors:  drawScissors,
  compass:   drawCompass,
  stapler:   drawStapler,
  glue:      drawGlue,
  sharpener: drawSharpener,
  // 学校シリーズ
  textbook:  drawTextbook,
  schoolbag: drawSchoolbag,
  bell:      drawBell,
  chalk:     drawChalk,
  globe:     drawGlobe,
  // 科学シリーズ
  beaker:    drawBeaker,
  magnet:    drawMagnet,
  bulb:      drawBulb,
  telescope: drawTelescope,
  testtube:  drawTesttube,
  microscope: drawMicroscope,
  // 数学シリーズ
  abacus:    drawAbacus,
  calculator: drawCalculator,
  pi:        drawPi,
  notebook:   drawNotebook,
  protractor: drawProtractor,
  graphpaper: drawGraphpaper,
  // 芸術シリーズ
  crayon:    drawCrayon,
  palette:   drawPalette,
  note:      drawNote,
  paintbrush: drawPaintbrush,
  // 工学シリーズ
  battery:    drawBattery,
  drone:      drawDrone,
  eng_01:    drawGearLancer,
  eng_02:    drawRivetGuard,
  eng_03:    drawTurbineShooter,
  eng_04:    drawBoltHammer,
  eng_05:    drawServoRunner,
  eng_06:    drawArcCoil,
  eng_07:    drawForgeKnight,
  eng_08:    drawPistonBreaker,
  eng_09:    drawNeonRay,
  eng_10:    drawChronoMecha,
  // 自然シリーズ
  nat_01:    drawVineSoldier,
  nat_02:    drawLeafShield,
  nat_03:    drawWoodArcher,
  nat_04:    drawBindHound,
  nat_05:    drawMossKnight,
  nat_06:    drawSeedMage,
  nat_07:    drawForestLord,
  nat_08:    drawThunderOak,
  nat_09:    drawEmeraldFeather,
  nat_10:    drawWildZephyr,
  // 歴史シリーズ
  his_01:    drawBronzeGuard,
  his_02:    drawStoneSentinel,
  his_03:    drawLanceRider,
  his_04:    drawCrossbowman,
  his_05:    drawIronShield,
  his_06:    drawFlameTorch,
  his_07:    drawWarHammer,
  his_08:    drawRoyalDrummer,
  his_09:    drawEmperorBow,
  his_10:    drawOrichalcum,
  // 音楽シリーズ
  mus_01:    drawRhythmFighter,
  mus_02:    drawBassDrumGuard,
  mus_03:    drawTrumpeter,
  mus_04:    drawVioletString,
  mus_05:    drawPianoForte,
  mus_06:    drawSymphonia,
  mus_07:    drawHarmonyGuard,
  mus_08:    drawMetronomeKnight,
  mus_09:    drawOperaArcher,
  mus_10:    drawStarConductor,
  // スポーツシリーズ
  spo_01:    drawRunnerBlade,
  spo_02:    drawKeeperGuard,
  spo_03:    drawArrowThrow,
  spo_04:    drawSpeedSmasher,
  spo_05:    drawTackleWall,
  spo_06:    drawServecannon,
  spo_07:    drawCaptainArmor,
  spo_08:    drawPowerHurdle,
  spo_09:    drawChampionBow,
  spo_10:    drawOlympia,
};
