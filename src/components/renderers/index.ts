/**
 * Unit renderer registry (lazy-loaded)
 * Maps unit ID → custom draw function
 * Renderers are loaded asynchronously to reduce initial bundle size.
 */

export type UnitDrawFn = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  r: number, col: string,
  t: number, ph: number,
) => void;

/** Registry populated by ensureRenderers() */
export const UNIT_RENDERERS: Record<string, UnitDrawFn> = {};

let _loaded = false;
let _loadPromise: Promise<void> | null = null;

/** Load all renderer modules. Safe to call multiple times. */
export function ensureRenderers(): Promise<void> {
  if (_loaded) return Promise.resolve();
  if (_loadPromise) return _loadPromise;
  _loadPromise = (async () => {
    const [
      stationery, school, science, mathArt,
      engineering, nature, history, music, sports,
    ] = await Promise.all([
      import("./stationery"),
      import("./school"),
      import("./science"),
      import("./mathArt"),
      import("./engineering"),
      import("./nature"),
      import("./history"),
      import("./music"),
      import("./sports"),
    ]);

    // 文房具シリーズ
    UNIT_RENDERERS.pencil    = stationery.drawPencil;
    UNIT_RENDERERS.eraser    = stationery.drawEraser;
    UNIT_RENDERERS.ruler     = stationery.drawRuler;
    UNIT_RENDERERS.scissors  = stationery.drawScissors;
    UNIT_RENDERERS.compass   = stationery.drawCompass;
    UNIT_RENDERERS.stapler   = stationery.drawStapler;
    UNIT_RENDERERS.glue      = stationery.drawGlue;
    UNIT_RENDERERS.sharpener = stationery.drawSharpener;
    // 学校シリーズ
    UNIT_RENDERERS.textbook  = school.drawTextbook;
    UNIT_RENDERERS.schoolbag = school.drawSchoolbag;
    UNIT_RENDERERS.bell      = school.drawBell;
    UNIT_RENDERERS.chalk     = school.drawChalk;
    UNIT_RENDERERS.globe     = school.drawGlobe;
    // 科学シリーズ
    UNIT_RENDERERS.beaker    = science.drawBeaker;
    UNIT_RENDERERS.magnet    = science.drawMagnet;
    UNIT_RENDERERS.bulb      = science.drawBulb;
    UNIT_RENDERERS.telescope = science.drawTelescope;
    UNIT_RENDERERS.testtube  = science.drawTesttube;
    UNIT_RENDERERS.microscope = science.drawMicroscope;
    // 数学シリーズ
    UNIT_RENDERERS.abacus     = mathArt.drawAbacus;
    UNIT_RENDERERS.calculator = mathArt.drawCalculator;
    UNIT_RENDERERS.pi         = mathArt.drawPi;
    UNIT_RENDERERS.notebook   = mathArt.drawNotebook;
    UNIT_RENDERERS.protractor = mathArt.drawProtractor;
    UNIT_RENDERERS.graphpaper = mathArt.drawGraphpaper;
    // 芸術シリーズ
    UNIT_RENDERERS.crayon     = mathArt.drawCrayon;
    UNIT_RENDERERS.palette    = mathArt.drawPalette;
    UNIT_RENDERERS.note       = mathArt.drawNote;
    UNIT_RENDERERS.paintbrush = mathArt.drawPaintbrush;
    // 工学シリーズ
    UNIT_RENDERERS.battery = engineering.drawBattery;
    UNIT_RENDERERS.drone   = engineering.drawDrone;
    UNIT_RENDERERS.eng_01  = engineering.drawGearLancer;
    UNIT_RENDERERS.eng_02  = engineering.drawRivetGuard;
    UNIT_RENDERERS.eng_03  = engineering.drawTurbineShooter;
    UNIT_RENDERERS.eng_04  = engineering.drawBoltHammer;
    UNIT_RENDERERS.eng_05  = engineering.drawServoRunner;
    UNIT_RENDERERS.eng_06  = engineering.drawArcCoil;
    UNIT_RENDERERS.eng_07  = engineering.drawForgeKnight;
    UNIT_RENDERERS.eng_08  = engineering.drawPistonBreaker;
    UNIT_RENDERERS.eng_09  = engineering.drawNeonRay;
    UNIT_RENDERERS.eng_10  = engineering.drawChronoMecha;
    // 自然シリーズ
    UNIT_RENDERERS.nat_01 = nature.drawVineSoldier;
    UNIT_RENDERERS.nat_02 = nature.drawLeafShield;
    UNIT_RENDERERS.nat_03 = nature.drawWoodArcher;
    UNIT_RENDERERS.nat_04 = nature.drawBindHound;
    UNIT_RENDERERS.nat_05 = nature.drawMossKnight;
    UNIT_RENDERERS.nat_06 = nature.drawSeedMage;
    UNIT_RENDERERS.nat_07 = nature.drawForestLord;
    UNIT_RENDERERS.nat_08 = nature.drawThunderOak;
    UNIT_RENDERERS.nat_09 = nature.drawEmeraldFeather;
    UNIT_RENDERERS.nat_10 = nature.drawWildZephyr;
    // 歴史シリーズ
    UNIT_RENDERERS.his_01 = history.drawBronzeGuard;
    UNIT_RENDERERS.his_02 = history.drawStoneSentinel;
    UNIT_RENDERERS.his_03 = history.drawLanceRider;
    UNIT_RENDERERS.his_04 = history.drawCrossbowman;
    UNIT_RENDERERS.his_05 = history.drawIronShield;
    UNIT_RENDERERS.his_06 = history.drawFlameTorch;
    UNIT_RENDERERS.his_07 = history.drawWarHammer;
    UNIT_RENDERERS.his_08 = history.drawRoyalDrummer;
    UNIT_RENDERERS.his_09 = history.drawEmperorBow;
    UNIT_RENDERERS.his_10 = history.drawOrichalcum;
    // 音楽シリーズ
    UNIT_RENDERERS.mus_01 = music.drawRhythmFighter;
    UNIT_RENDERERS.mus_02 = music.drawBassDrumGuard;
    UNIT_RENDERERS.mus_03 = music.drawTrumpeter;
    UNIT_RENDERERS.mus_04 = music.drawVioletString;
    UNIT_RENDERERS.mus_05 = music.drawPianoForte;
    UNIT_RENDERERS.mus_06 = music.drawSymphonia;
    UNIT_RENDERERS.mus_07 = music.drawHarmonyGuard;
    UNIT_RENDERERS.mus_08 = music.drawMetronomeKnight;
    UNIT_RENDERERS.mus_09 = music.drawOperaArcher;
    UNIT_RENDERERS.mus_10 = music.drawStarConductor;
    // スポーツシリーズ
    UNIT_RENDERERS.spo_01 = sports.drawRunnerBlade;
    UNIT_RENDERERS.spo_02 = sports.drawKeeperGuard;
    UNIT_RENDERERS.spo_03 = sports.drawArrowThrow;
    UNIT_RENDERERS.spo_04 = sports.drawSpeedSmasher;
    UNIT_RENDERERS.spo_05 = sports.drawTackleWall;
    UNIT_RENDERERS.spo_06 = sports.drawServecannon;
    UNIT_RENDERERS.spo_07 = sports.drawCaptainArmor;
    UNIT_RENDERERS.spo_08 = sports.drawPowerHurdle;
    UNIT_RENDERERS.spo_09 = sports.drawChampionBow;
    UNIT_RENDERERS.spo_10 = sports.drawOlympia;

    _loaded = true;
  })();
  return _loadPromise;
}

/** Check if renderers are already loaded */
export function renderersReady(): boolean {
  return _loaded;
}
