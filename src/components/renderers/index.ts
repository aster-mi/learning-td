/**
 * Unit renderer registry
 * Maps unit ID → custom draw function
 */

import { drawPencil, drawEraser, drawRuler, drawScissors, drawCompass, drawStapler, drawGlue, drawSharpener } from "./stationery";
import { drawTextbook, drawSchoolbag, drawBell, drawChalk, drawGlobe } from "./school";
import { drawBeaker, drawMagnet, drawBulb, drawTelescope, drawTesttube, drawMicroscope } from "./science";
import { drawAbacus, drawCalculator, drawPi, drawCrayon, drawPalette, drawNote } from "./mathArt";

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
  // 芸術シリーズ
  crayon:    drawCrayon,
  palette:   drawPalette,
  note:      drawNote,
};
