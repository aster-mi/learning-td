import { useEffect, useRef } from "react";
import type { GameState } from "../domain/GameEngine";
import type { Unit } from "../domain/Unit";
import type { Enemy } from "../domain/Enemy";
import type { StageThemeKey } from "../data/stages";
import { UNIT_RENDERERS } from "./renderers";

interface Props {
  state: GameState;
  playerBaseX: number;
  enemyBaseX: number;
  canvasWidth: number;
  themeKey: StageThemeKey;
  isPaused?: boolean;
  combo?: number;
  comboFlashKey?: number;  // changes when combo milestone hit
}

const CANVAS_HEIGHT = 300;
const GROUND_Y = 218;

// ── colour helpers ─────────────────────────────────────────────────────────
function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}
function darker(hex: string, n: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.max(0,r-n)},${Math.max(0,g-n)},${Math.max(0,b-n)})`;
}
function lighter(hex: string, n: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255,r+n)},${Math.min(255,g+n)},${Math.min(255,b+n)})`;
}

// ── effect structs ─────────────────────────────────────────────────────────
interface HitEffect { x:number; y:number; t:number; dur:number; color:string; }
interface Particle  { x:number; y:number; vx:number; vy:number; t:number; dur:number; color:string; r:number; }
interface Angel     { x:number; y:number; t:number; dur:number; color:string; facingLeft:boolean; }
interface StageTheme {
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  starColor?: string;
  celestial?: "sun" | "moon" | "none";
  celestialColor?: string;
  celestialGlow?: string;
  farSilhouette: string;
  nearSilhouette: string;
  floraColor: string;
  groundTop: string;
  groundMid: string;
  groundBottom: string;
  lane: string;
  laneEdge: string;
  decor: "trees" | "dunes" | "ice" | "lava" | "ruins";
  hazeColor?: string;
}

const STAGE_THEMES: Record<StageThemeKey, StageTheme> = {
  meadowMorning: {
    skyTop: "#5bb6ff", skyMid: "#87d7ff", skyBottom: "#d9f6ff",
    celestial: "sun", celestialColor: "#fff2b3", celestialGlow: "rgba(255,232,148,0.55)",
    farSilhouette: "#6cae80", nearSilhouette: "#4c875c", floraColor: "#315a25",
    groundTop: "#6fc46b", groundMid: "#4f983f", groundBottom: "#2b5a1c",
    lane: "#8b5a2b", laneEdge: "#b97938", decor: "trees",
  },
  meadowSunset: {
    skyTop: "#ff9254", skyMid: "#ffb56d", skyBottom: "#ffe2ad",
    celestial: "sun", celestialColor: "#fff1b8", celestialGlow: "rgba(255,207,120,0.5)",
    farSilhouette: "#a1644f", nearSilhouette: "#6a5331", floraColor: "#524e20",
    groundTop: "#9bc45f", groundMid: "#6c8d34", groundBottom: "#3d511a",
    lane: "#8a5631", laneEdge: "#b06f42", decor: "trees", hazeColor: "rgba(255,180,120,0.14)",
  },
  meadowRuins: {
    skyTop: "#6189b8", skyMid: "#88b4c8", skyBottom: "#dce8d4",
    celestial: "sun", celestialColor: "#f7f1d0", celestialGlow: "rgba(255,234,175,0.45)",
    farSilhouette: "#58775a", nearSilhouette: "#40553c", floraColor: "#2d4229",
    groundTop: "#6a8a55", groundMid: "#4e6840", groundBottom: "#2f4128",
    lane: "#76634d", laneEdge: "#95806a", decor: "ruins",
  },
  desertNoon: {
    skyTop: "#5cb2f4", skyMid: "#9dd8ff", skyBottom: "#f7e2b0",
    celestial: "sun", celestialColor: "#fff1b5", celestialGlow: "rgba(255,238,173,0.55)",
    farSilhouette: "#d2a766", nearSilhouette: "#b88448", floraColor: "#8f6b2e",
    groundTop: "#efc878", groundMid: "#d49f53", groundBottom: "#9b652e",
    lane: "#a76836", laneEdge: "#ca854a", decor: "dunes",
  },
  desertSunset: {
    skyTop: "#b94b3d", skyMid: "#f18a55", skyBottom: "#f9d392",
    celestial: "sun", celestialColor: "#ffe39d", celestialGlow: "rgba(255,194,117,0.5)",
    farSilhouette: "#9c5f43", nearSilhouette: "#6f432c", floraColor: "#6a4d22",
    groundTop: "#dba65c", groundMid: "#b57735", groundBottom: "#6d411b",
    lane: "#845127", laneEdge: "#ad6934", decor: "dunes", hazeColor: "rgba(255,140,80,0.12)",
  },
  desertStorm: {
    skyTop: "#8c6a4d", skyMid: "#b58a60", skyBottom: "#d7bc8f",
    celestial: "none", farSilhouette: "#876447", nearSilhouette: "#6e5037", floraColor: "#6a5438",
    groundTop: "#b7905d", groundMid: "#926a41", groundBottom: "#5c3f27",
    lane: "#7a4a26", laneEdge: "#9e673b", decor: "dunes", hazeColor: "rgba(222,184,135,0.22)",
  },
  glacierDawn: {
    skyTop: "#89bfff", skyMid: "#b9ddff", skyBottom: "#f2fbff",
    celestial: "sun", celestialColor: "#fff6cd", celestialGlow: "rgba(255,245,196,0.48)",
    farSilhouette: "#9ad3e6", nearSilhouette: "#73b0cb", floraColor: "#a2e5ff",
    groundTop: "#d9f8ff", groundMid: "#afe6f6", groundBottom: "#75bfd8",
    lane: "#86a8b9", laneEdge: "#c1dce8", decor: "ice",
  },
  glacierNight: {
    skyTop: "#08132b", skyMid: "#123560", skyBottom: "#2f5d88", starColor: "#d9f4ff",
    celestial: "moon", celestialColor: "#eef7ff", celestialGlow: "rgba(226,244,255,0.25)",
    farSilhouette: "#123658", nearSilhouette: "#0d2842", floraColor: "#88d0ff",
    groundTop: "#9bd7f0", groundMid: "#5fa9ca", groundBottom: "#2c6078",
    lane: "#5c7184", laneEdge: "#94adc0", decor: "ice",
  },
  glacierAurora: {
    skyTop: "#081328", skyMid: "#113767", skyBottom: "#16305a", starColor: "#d7f9ff",
    celestial: "moon", celestialColor: "#f3fbff", celestialGlow: "rgba(212,255,245,0.26)",
    farSilhouette: "#15375d", nearSilhouette: "#0a2139", floraColor: "#8cf0d8",
    groundTop: "#8ad2f8", groundMid: "#519bc5", groundBottom: "#204f71",
    lane: "#56718c", laneEdge: "#84b7c8", decor: "ice", hazeColor: "rgba(86,255,196,0.12)",
  },
  volcanoForge: {
    skyTop: "#30120f", skyMid: "#6e241b", skyBottom: "#d15c2b",
    celestial: "none", farSilhouette: "#421615", nearSilhouette: "#250909", floraColor: "#ff8a3d",
    groundTop: "#5f2218", groundMid: "#41110b", groundBottom: "#220605",
    lane: "#3a2620", laneEdge: "#8f5a2f", decor: "lava", hazeColor: "rgba(255,120,60,0.15)",
  },
  volcanoAsh: {
    skyTop: "#2b2026", skyMid: "#5a3d40", skyBottom: "#8e5a43",
    celestial: "none", farSilhouette: "#3e2a2f", nearSilhouette: "#24161b", floraColor: "#ff9f6a",
    groundTop: "#68413a", groundMid: "#432424", groundBottom: "#221010",
    lane: "#41302a", laneEdge: "#8a5844", decor: "lava", hazeColor: "rgba(180,180,180,0.12)",
  },
  volcanoCitadel: {
    skyTop: "#17080b", skyMid: "#421112", skyBottom: "#8f271e",
    celestial: "none", farSilhouette: "#231012", nearSilhouette: "#120607", floraColor: "#ff7043",
    groundTop: "#53211a", groundMid: "#2d0d0a", groundBottom: "#120304",
    lane: "#342626", laneEdge: "#7d3b2c", decor: "lava", hazeColor: "rgba(255,60,30,0.12)",
  },
  ruinsCanal: {
    skyTop: "#4a8ab5", skyMid: "#77b9c7", skyBottom: "#d9ead8",
    celestial: "sun", celestialColor: "#fff0c6", celestialGlow: "rgba(255,230,164,0.45)",
    farSilhouette: "#5c7a6b", nearSilhouette: "#43534d", floraColor: "#3b463a",
    groundTop: "#6d8a6f", groundMid: "#4b624f", groundBottom: "#2a3830",
    lane: "#8b765f", laneEdge: "#b19a7f", decor: "ruins",
  },
  ruinsNight: {
    skyTop: "#090f24", skyMid: "#1b294d", skyBottom: "#304678", starColor: "#dbeafe",
    celestial: "moon", celestialColor: "#f8fafc", celestialGlow: "rgba(255,255,255,0.18)",
    farSilhouette: "#16233f", nearSilhouette: "#0d1528", floraColor: "#64748b",
    groundTop: "#485468", groundMid: "#303a4a", groundBottom: "#1a2230",
    lane: "#61554d", laneEdge: "#8f7f71", decor: "ruins",
  },
  ruinsSanctum: {
    skyTop: "#0a1230", skyMid: "#1c2f61", skyBottom: "#31477e", starColor: "#efe6ff",
    celestial: "moon", celestialColor: "#f7f2ff", celestialGlow: "rgba(199,163,255,0.25)",
    farSilhouette: "#202e5a", nearSilhouette: "#101735", floraColor: "#a78bfa",
    groundTop: "#5f6277", groundMid: "#3b3d52", groundBottom: "#202132",
    lane: "#62545f", laneEdge: "#9a82a0", decor: "ruins", hazeColor: "rgba(167,139,250,0.12)",
  },
};

// ── HP bar ─────────────────────────────────────────────────────────────────
function drawHpBar(ctx: CanvasRenderingContext2D, cx:number, y:number, w:number, hp:number, maxHp:number) {
  const ratio = Math.max(0, hp / maxHp);
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fillRect(cx - w/2 - 1, y - 1, w + 2, 7);
  ctx.fillStyle = "#111827";
  ctx.fillRect(cx - w/2, y, w, 5);
  ctx.fillStyle = ratio > 0.6 ? "#22c55e" : ratio > 0.3 ? "#f59e0b" : "#ef4444";
  ctx.fillRect(cx - w/2, y, w * ratio, 5);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(cx - w/2, y, w * ratio, 2);
}

// ── background ─────────────────────────────────────────────────────────────
function drawBackground(
  ctx: CanvasRenderingContext2D,
  W: number,
  t: number,
  themeKey: StageThemeKey,
  stars: { x: number; y: number; r: number }[],
) {
  const theme = STAGE_THEMES[themeKey];

  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, theme.skyTop);
  sky.addColorStop(0.55, theme.skyMid);
  sky.addColorStop(1, theme.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, GROUND_Y);

  if (theme.starColor) {
    for (const s of stars) {
      const twinkle = 0.45 + 0.55 * Math.sin(t * 1.8 + s.x * 31);
      ctx.globalAlpha = twinkle * 0.85;
      ctx.fillStyle = theme.starColor;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (theme.celestial && theme.celestial !== "none") {
    const cx = W * 0.82;
    const cy = theme.celestial === "sun" ? 48 : 38;
    const radius = theme.celestial === "sun" ? 24 : 17;
    if (theme.celestialGlow) {
      ctx.fillStyle = theme.celestialGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = theme.celestialColor ?? "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    if (theme.celestial === "moon") {
      ctx.fillStyle = theme.skyTop;
      ctx.beginPath();
      ctx.arc(cx + 8, cy - 3, radius * 0.82, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const mts1 = [0.06,0.18,0.32,0.46,0.58,0.72,0.88];
  const mth1 = [72, 85, 68, 92, 76, 88, 64];
  ctx.fillStyle = theme.farSilhouette;
  drawMountainRange(ctx, W, GROUND_Y, mts1, mth1);

  const mts2 = [0.02,0.14,0.27,0.40,0.53,0.65,0.79,0.93];
  const mth2 = [48, 58, 44, 62, 50, 55, 42, 52];
  ctx.fillStyle = theme.nearSilhouette;
  drawMountainRange(ctx, W, GROUND_Y, mts2, mth2);

  if (theme.hazeColor) {
    ctx.fillStyle = theme.hazeColor;
    ctx.fillRect(0, GROUND_Y * 0.28, W, GROUND_Y * 0.45);
  }

  const grd = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_HEIGHT);
  grd.addColorStop(0, theme.groundTop);
  grd.addColorStop(0.35, theme.groundMid);
  grd.addColorStop(1, theme.groundBottom);
  ctx.fillStyle = grd;
  ctx.fillRect(0, GROUND_Y, W, CANVAS_HEIGHT - GROUND_Y);

  drawForegroundDecor(ctx, W, t, theme);

  ctx.fillStyle = theme.lane;
  ctx.fillRect(0, GROUND_Y + 4, W, 16);
  ctx.fillStyle = theme.laneEdge;
  ctx.fillRect(0, GROUND_Y + 4, W, 2);
}

function drawMountainRange(ctx: CanvasRenderingContext2D, W:number, gY:number, xs:number[], hs:number[]) {
  for (let i = 0; i < xs.length; i++) {
    const cx = xs[i] * W, h = hs[i];
    ctx.beginPath();
    ctx.moveTo(cx - h * 1.1, gY);
    ctx.quadraticCurveTo(cx - h * 0.3, gY - h * 0.15, cx, gY - h);
    ctx.quadraticCurveTo(cx + h * 0.3, gY - h * 0.15, cx + h * 1.1, gY);
    ctx.closePath(); ctx.fill();
  }
}

function drawTree(ctx: CanvasRenderingContext2D, x:number, gY:number, h:number) {
  ctx.beginPath();
  ctx.moveTo(x, gY - h);
  ctx.lineTo(x - h * 0.38, gY);
  ctx.lineTo(x + h * 0.38, gY);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, gY - h * 0.68);
  ctx.lineTo(x - h * 0.48, gY - h * 0.2);
  ctx.lineTo(x + h * 0.48, gY - h * 0.2);
  ctx.closePath(); ctx.fill();
}

function drawForegroundDecor(ctx: CanvasRenderingContext2D, W: number, t: number, theme: StageTheme) {
  ctx.fillStyle = theme.floraColor;

  if (theme.decor === "trees") {
    for (let i = 0; i < 16; i++) {
      const tx = (i / 15) * W;
      const th = 28 + Math.sin(i * 3.1) * 10;
      drawTree(ctx, tx, GROUND_Y, th);
    }
    for (let i = 0; i < 22; i++) {
      const gx = (i / 21) * W;
      ctx.beginPath();
      ctx.ellipse(gx, GROUND_Y + 1, 5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  if (theme.decor === "dunes") {
    for (let i = 0; i < 6; i++) {
      const x = (i / 5) * W;
      const wave = Math.sin(t * 0.4 + i) * 4;
      ctx.beginPath();
      ctx.ellipse(x, GROUND_Y + 10 + wave, W * 0.12, 18, 0, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  if (theme.decor === "ice") {
    for (let i = 0; i < 14; i++) {
      const x = 8 + (i / 13) * (W - 16);
      const h = 12 + (i % 3) * 10;
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y + 4);
      ctx.lineTo(x - 6, GROUND_Y + 4 + h);
      ctx.lineTo(x + 6, GROUND_Y + 4 + h);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }

  if (theme.decor === "lava") {
    for (let i = 0; i < 10; i++) {
      const x = 15 + (i / 9) * (W - 30);
      const flicker = 0.65 + 0.35 * Math.sin(t * 5 + i);
      const h = 7 + flicker * 10;
      ctx.fillStyle = `rgba(255,145,66,${0.28 + flicker * 0.28})`;
      ctx.beginPath();
      ctx.ellipse(x, GROUND_Y + 5, 8, h, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = theme.floraColor;
    return;
  }

  if (theme.decor === "ruins") {
    for (let i = 0; i < 5; i++) {
      const x = 20 + (i / 4) * (W - 40);
      const h = 18 + (i % 2) * 8;
      ctx.fillRect(x - 5, GROUND_Y - h, 10, h);
      ctx.fillRect(x - 11, GROUND_Y - h + 4, 22, 4);
    }
  }
}

// ── castles ────────────────────────────────────────────────────────────────
function drawPlayerCastle(ctx: CanvasRenderingContext2D, bx:number, hp:number, maxHp:number, t:number) {
  const glow = 0.5 + 0.5 * Math.sin(t * 1.4);
  ctx.shadowColor = "#3b82f6";
  ctx.shadowBlur = 8 + glow * 6;

  // Left turret
  ctx.fillStyle = "#1e3a5f";
  ctx.fillRect(bx - 34, GROUND_Y - 68, 16, 68);
  ctx.fillStyle = "#274e80";
  ctx.fillRect(bx - 34, GROUND_Y - 68, 5, 68);
  for (let i = 0; i < 2; i++) ctx.fillRect(bx - 34 + i * 8, GROUND_Y - 76, 6, 10);
  // Cone roof
  ctx.fillStyle = "#2563eb";
  ctx.beginPath();
  ctx.moveTo(bx - 26, GROUND_Y - 76);
  ctx.lineTo(bx - 34, GROUND_Y - 98);
  ctx.lineTo(bx - 18, GROUND_Y - 98);
  ctx.closePath(); ctx.fill();

  // Main tower
  ctx.fillStyle = "#1e3a5f";
  ctx.fillRect(bx - 22, GROUND_Y - 78, 44, 78);
  ctx.fillStyle = "#274e80";
  ctx.fillRect(bx - 22, GROUND_Y - 78, 7, 78);
  for (let i = 0; i < 4; i++) ctx.fillRect(bx - 22 + i * 11, GROUND_Y - 88, 8, 13);

  // Flag
  ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(bx - 26, GROUND_Y - 98); ctx.lineTo(bx - 26, GROUND_Y - 114); ctx.stroke();
  ctx.fillStyle = "#3b82f6";
  ctx.beginPath(); ctx.moveTo(bx - 26, GROUND_Y - 114); ctx.lineTo(bx - 12, GROUND_Y - 108); ctx.lineTo(bx - 26, GROUND_Y - 102); ctx.closePath(); ctx.fill();

  // Gate arch
  ctx.fillStyle = "#091528";
  ctx.fillRect(bx - 10, GROUND_Y - 30, 20, 30);
  ctx.beginPath(); ctx.arc(bx, GROUND_Y - 30, 10, Math.PI, 0); ctx.fill();

  // Window glow
  const wg = 0.25 + glow * 0.25;
  ctx.fillStyle = `rgba(251,191,36,${wg})`;
  ctx.fillRect(bx - 7, GROUND_Y - 64, 14, 13);
  ctx.fillRect(bx - 7, GROUND_Y - 47, 14, 12);
  ctx.shadowBlur = 0;

  drawHpBar(ctx, bx, GROUND_Y - 120, 58, hp, maxHp);
  ctx.fillStyle = "#94a3b8"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
  ctx.fillText("我が城", bx, GROUND_Y - 122);
}

function drawEnemyCastle(ctx: CanvasRenderingContext2D, bx:number, hp:number, maxHp:number, t:number) {
  const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = 10 + pulse * 8;

  // Right turret
  ctx.fillStyle = "#4a0a0a";
  ctx.fillRect(bx + 18, GROUND_Y - 74, 16, 74);
  ctx.fillStyle = "#6b1414";
  ctx.fillRect(bx + 26, GROUND_Y - 74, 5, 74);
  for (let i = 0; i < 2; i++) ctx.fillRect(bx + 18 + i * 8, GROUND_Y - 82, 6, 10);

  // Main tower
  ctx.fillStyle = "#4a0a0a";
  ctx.fillRect(bx - 24, GROUND_Y - 88, 48, 88);
  ctx.fillStyle = "#6b1414";
  ctx.fillRect(bx + 14, GROUND_Y - 88, 7, 88);
  for (let i = 0; i < 5; i++) ctx.fillRect(bx - 24 + i * 10, GROUND_Y - 98, 7, 13);

  // Flag
  ctx.strokeStyle = "#7f1d1d"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(bx + 26, GROUND_Y - 82); ctx.lineTo(bx + 26, GROUND_Y - 100); ctx.stroke();
  ctx.fillStyle = "#ef4444";
  ctx.beginPath(); ctx.moveTo(bx + 26, GROUND_Y - 100); ctx.lineTo(bx + 40, GROUND_Y - 94); ctx.lineTo(bx + 26, GROUND_Y - 88); ctx.closePath(); ctx.fill();

  // Skull decoration
  ctx.fillStyle = "#1a0505";
  ctx.beginPath(); ctx.arc(bx - 4, GROUND_Y - 58, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(bx - 6, GROUND_Y - 59, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(bx - 2, GROUND_Y - 59, 1.8, 0, Math.PI * 2); ctx.fill();

  // Gate
  ctx.fillStyle = "#0a0404";
  ctx.fillRect(bx - 11, GROUND_Y - 32, 22, 32);
  ctx.beginPath(); ctx.arc(bx, GROUND_Y - 32, 11, Math.PI, 0); ctx.fill();

  // Red window glow
  ctx.fillStyle = `rgba(239,68,68,${0.25 + pulse * 0.3})`;
  ctx.fillRect(bx - 10, GROUND_Y - 73, 9, 11);
  ctx.fillRect(bx + 2, GROUND_Y - 73, 9, 11);
  ctx.shadowBlur = 0;

  drawHpBar(ctx, bx, GROUND_Y - 106, 62, hp, maxHp);
  ctx.fillStyle = "#fca5a5"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
  ctx.fillText("敵の城", bx, GROUND_Y - 109);
}

// ── cat (unit) ─────────────────────────────────────────────────────────────
function drawCat(ctx: CanvasRenderingContext2D, u: Unit, t: number) {
  const r  = u.def.radius;
  const freq = u.def.speed / 50;
  const ph  = t * freq * 5.5 + u.id * 1.73;
  const bob = Math.abs(Math.sin(ph * 2)) * 1.8;
  const col = u.def.color;

  // 攻撃モーション: lastAtkTimeから250ms以内なら前方にランジ
  const atkElapsed = t * 1000 - u.lastAtkTime;
  const isAttacking = atkElapsed >= 0 && atkElapsed < 250;
  const atkProgress = isAttacking ? atkElapsed / 250 : 0;
  // 前に突き出して戻る (sin curve)
  const lungeX = isAttacking ? Math.sin(atkProgress * Math.PI) * r * 0.6 : 0;
  const lungeY = isAttacking ? -Math.sin(atkProgress * Math.PI) * r * 0.3 : 0;

  const cx = u.x + lungeX;
  const cy  = GROUND_Y - r * 0.92 - bob + lungeY;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.beginPath(); ctx.ellipse(cx, GROUND_Y + 2, r * 1.05, 4, 0, 0, Math.PI * 2); ctx.fill();

  // Tail (swaying bezier behind body)
  const tailSway = Math.sin(ph * 0.65) * 0.5;
  ctx.save();
  ctx.strokeStyle = col; ctx.lineWidth = r * 0.33; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.72, cy + r * 0.18);
  ctx.bezierCurveTo(
    cx - r * 1.85, cy - r * 0.7,
    cx - r * 1.4 + tailSway * r, cy - r * 1.9,
    cx - r * 0.55 + tailSway * r * 1.3, cy - r * 2.2,
  );
  ctx.stroke();
  ctx.strokeStyle = lighter(col, 55); ctx.lineWidth = r * 0.2;
  ctx.beginPath();
  ctx.moveTo(cx - r * 1.1 + tailSway * r * 0.8, cy - r * 1.75);
  ctx.bezierCurveTo(
    cx - r * 0.9 + tailSway * r, cy - r * 2.1,
    cx - r * 0.55 + tailSway * r * 1.3, cy - r * 2.2,
    cx - r * 0.55 + tailSway * r * 1.3, cy - r * 2.2,
  );
  ctx.stroke();
  ctx.restore();

  // Legs (walking cycle)
  ctx.save();
  ctx.strokeStyle = darker(col, 35); ctx.lineWidth = r * 0.27; ctx.lineCap = "round";
  const ll = r * 0.88;
  const a = Math.sin(ph), b2 = Math.sin(ph + Math.PI), c = Math.sin(ph + Math.PI * 0.5), d = Math.sin(ph + Math.PI * 1.5);
  ctx.beginPath(); ctx.moveTo(cx - r*0.28, cy + r*0.54); ctx.lineTo(cx - r*0.28 + a*0.18*ll, cy + ll + a*0.52*ll); ctx.stroke();
  ctx.globalAlpha = 0.62;
  ctx.beginPath(); ctx.moveTo(cx - r*0.08, cy + r*0.54); ctx.lineTo(cx - r*0.08 + b2*0.18*ll, cy + ll + b2*0.52*ll); ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.moveTo(cx + r*0.22, cy + r*0.5); ctx.lineTo(cx + r*0.22 + c*0.18*ll, cy + ll + c*0.52*ll); ctx.stroke();
  ctx.globalAlpha = 0.62;
  ctx.beginPath(); ctx.moveTo(cx + r*0.42, cy + r*0.5); ctx.lineTo(cx + r*0.42 + d*0.18*ll, cy + ll + d*0.52*ll); ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();

  // Body
  ctx.save();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(cx, cy + r*0.1, r, r * 0.82, 0, 0, Math.PI * 2); ctx.fill();
  const bg = ctx.createRadialGradient(cx - r*0.25, cy - r*0.2, r*0.05, cx, cy, r);
  bg.addColorStop(0, "rgba(255,255,255,0.3)"); bg.addColorStop(0.6, "rgba(255,255,255,0)"); bg.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.ellipse(cx, cy + r*0.1, r, r * 0.82, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Head (offset right — faces right)
  const hx = cx + r * 0.44, hy = cy - r * 0.67, hr = r * 0.72;
  ctx.save();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fill();
  const hg = ctx.createRadialGradient(hx - hr*0.2, hy - hr*0.22, hr*0.06, hx, hy, hr);
  hg.addColorStop(0, "rgba(255,255,255,0.28)"); hg.addColorStop(0.5, "rgba(255,255,255,0)"); hg.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fill();

  // Ears
  const lc = lighter(col, 50);
  [[- 1, 1]] // left ear
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(hx - hr*0.48, hy - hr*0.45); ctx.lineTo(hx - hr*0.66, hy - hr*1.22); ctx.lineTo(hx - hr*0.08, hy - hr*0.82); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lc;
  ctx.beginPath(); ctx.moveTo(hx - hr*0.45, hy - hr*0.52); ctx.lineTo(hx - hr*0.61, hy - hr*1.08); ctx.lineTo(hx - hr*0.13, hy - hr*0.82); ctx.closePath(); ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(hx + hr*0.38, hy - hr*0.45); ctx.lineTo(hx + hr*0.6, hy - hr*1.22); ctx.lineTo(hx + hr*0.06, hy - hr*0.82); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lc;
  ctx.beginPath(); ctx.moveTo(hx + hr*0.36, hy - hr*0.52); ctx.lineTo(hx + hr*0.54, hy - hr*1.08); ctx.lineTo(hx + hr*0.1, hy - hr*0.82); ctx.closePath(); ctx.fill();

  // Eyes
  const eyeY = hy - hr * 0.1;
  const blink = Math.floor(t * 0.38) % 8 === 0 && (t * 0.38 % 1) < 0.12;
  if (blink) {
    ctx.strokeStyle = "#333"; ctx.lineWidth = 1.5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(hx - hr*0.28, eyeY); ctx.lineTo(hx - hr*0.1, eyeY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx + hr*0.08, eyeY); ctx.lineTo(hx + hr*0.28, eyeY); ctx.stroke();
  } else {
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(hx - hr*0.2, eyeY, hr*0.19, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + hr*0.2, eyeY, hr*0.19, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath(); ctx.arc(hx - hr*0.18, eyeY, hr*0.11, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + hr*0.22, eyeY, hr*0.11, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath(); ctx.arc(hx - hr*0.14, eyeY - hr*0.06, hr*0.042, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + hr*0.26, eyeY - hr*0.06, hr*0.042, 0, Math.PI*2); ctx.fill();
  }
  // Nose
  ctx.fillStyle = "#ff8fa3";
  ctx.beginPath(); ctx.moveTo(hx - hr*0.08, hy + hr*0.19); ctx.lineTo(hx + hr*0.08, hy + hr*0.19); ctx.lineTo(hx, hy + hr*0.31); ctx.closePath(); ctx.fill();
  // Whiskers
  ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(hx + hr*0.0, hy + hr*0.18); ctx.lineTo(hx + hr*0.88, hy + hr*0.09); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx + hr*0.0, hy + hr*0.23); ctx.lineTo(hx + hr*0.85, hy + hr*0.33); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx - hr*0.08, hy + hr*0.18); ctx.lineTo(hx - hr*0.88, hy + hr*0.07); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx - hr*0.08, hy + hr*0.23); ctx.lineTo(hx - hr*0.84, hy + hr*0.31); ctx.stroke();
  ctx.restore();

  // 遠距離ネコ: 弓を追加描画
  if (u.def.type === "shooter") {
    drawShooterBow(ctx, cx + r*0.44, cy - r*0.67, r*0.72, col, t);
  }
  // 火炎ネコ: 炎エフェクト
  if (u.def.type === "bomber") {
    drawBomberFlames(ctx, cx, cy, r, t);
  }

  drawHpBar(ctx, cx, cy - r - bob - 14, r * 2.4, u.hp, u.maxHp);
}

// ── generic unit (custom vector renderers) ────────────────────────────────
function drawGenericUnit(ctx: CanvasRenderingContext2D, u: Unit, t: number) {
  const r  = u.def.radius;
  const freq = u.def.speed / 50;
  const ph  = t * freq * 5.5 + u.id * 1.73;
  const bob = Math.abs(Math.sin(ph * 2)) * 1.8;
  const col = u.def.color;

  // Attack lunge animation (same as drawCat)
  const atkElapsed = t * 1000 - u.lastAtkTime;
  const isAttacking = atkElapsed >= 0 && atkElapsed < 250;
  const atkProgress = isAttacking ? atkElapsed / 250 : 0;
  const lungeX = isAttacking ? Math.sin(atkProgress * Math.PI) * r * 0.6 : 0;
  const lungeY = isAttacking ? -Math.sin(atkProgress * Math.PI) * r * 0.3 : 0;

  const cx = u.x + lungeX;
  const cy = GROUND_Y - r * 0.92 - bob + lungeY;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.beginPath();
  ctx.ellipse(cx, GROUND_Y + 2, r * 1.05, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dispatch to custom renderer if available, otherwise fallback
  const customDraw = UNIT_RENDERERS[u.def.type];
  if (customDraw) {
    ctx.save();
    customDraw(ctx, cx, cy, r, col, t, ph);
    ctx.restore();
  } else {
    // Fallback: colored circle + emoji
    ctx.save();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `${r * 1.4}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(u.def.emoji, cx, cy);
    ctx.restore();
  }

  // HP bar
  drawHpBar(ctx, cx, cy - r - bob - 14, r * 2.4, u.hp, u.maxHp);
}

// ── enemy ──────────────────────────────────────────────────────────────────
function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, t: number) {
  const r = e.def.radius;
  const freq = e.def.speed / 50;
  const ph = t * freq * 5.5 + e.id * 2.11;
  const bob = Math.abs(Math.sin(ph * 2)) * 1.8;
  const col = e.def.color;

  // 攻撃モーション: 敵は左向きなのでランジは-X方向
  const atkElapsed = t * 1000 - e.lastAtkTime;
  const isAttacking = atkElapsed >= 0 && atkElapsed < 250;
  const atkProgress = isAttacking ? atkElapsed / 250 : 0;
  const lungeX = isAttacking ? -Math.sin(atkProgress * Math.PI) * r * 0.6 : 0;
  const lungeY = isAttacking ? -Math.sin(atkProgress * Math.PI) * r * 0.3 : 0;

  const cx = e.x + lungeX;
  const cy = GROUND_Y - r * 0.92 - bob + lungeY;

  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.beginPath(); ctx.ellipse(cx, GROUND_Y + 2, r * 1.05, 4, 0, 0, Math.PI * 2); ctx.fill();

  // Legs
  ctx.save();
  ctx.strokeStyle = darker(col, 40); ctx.lineWidth = r * 0.27; ctx.lineCap = "round";
  const ll = r * 0.88;
  const a = Math.sin(ph), b2 = Math.sin(ph+Math.PI), c = Math.sin(ph+Math.PI*0.5), d = Math.sin(ph+Math.PI*1.5);
  // Enemy faces LEFT so leg swing is mirrored
  ctx.beginPath(); ctx.moveTo(cx + r*0.28, cy + r*0.54); ctx.lineTo(cx + r*0.28 - a*0.18*ll, cy + ll + a*0.52*ll); ctx.stroke();
  ctx.globalAlpha = 0.62;
  ctx.beginPath(); ctx.moveTo(cx + r*0.08, cy + r*0.54); ctx.lineTo(cx + r*0.08 - b2*0.18*ll, cy + ll + b2*0.52*ll); ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.moveTo(cx - r*0.22, cy + r*0.5); ctx.lineTo(cx - r*0.22 - c*0.18*ll, cy + ll + c*0.52*ll); ctx.stroke();
  ctx.globalAlpha = 0.62;
  ctx.beginPath(); ctx.moveTo(cx - r*0.42, cy + r*0.5); ctx.lineTo(cx - r*0.42 - d*0.18*ll, cy + ll + d*0.52*ll); ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();

  if      (e.def.type === "boss")   drawBossDog(ctx, cx, cy, r, col, t);
  else if (e.def.type === "warlock") drawWarlockDog(ctx, cx, cy, r, col, t);
  else if (e.def.type === "brute")  drawBruteDog(ctx, cx, cy, r, col, t);
  else if (e.def.type === "assassin") drawAssassinDog(ctx, cx, cy, r, col, ph);
  else if (e.def.type === "speedy") drawSpeedyDog(ctx, cx, cy, r, col, ph);
  else if (e.def.type === "tank")   drawTankDog(ctx, cx, cy, r, col, t);
  else if (e.def.type === "fast")   drawFastDog(ctx, cx, cy, r, col, ph);
  else                              drawWeakDog(ctx, cx, cy, r, col);

  drawHpBar(ctx, cx, cy - r - bob - 14, r * 2.4, e.hp, e.maxHp);
}

function drawWeakDog(ctx: CanvasRenderingContext2D, cx:number, cy:number, r:number, col:string) {
  // Body
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(cx, cy + r*0.1, r, r*0.84, 0, 0, Math.PI*2); ctx.fill();
  const bg = ctx.createRadialGradient(cx + r*0.2, cy - r*0.2, r*0.05, cx, cy, r);
  bg.addColorStop(0, "rgba(255,160,160,0.28)"); bg.addColorStop(1, "rgba(0,0,0,0.24)");
  ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(cx, cy + r*0.1, r, r*0.84, 0, 0, Math.PI*2); ctx.fill();
  // Head — faces LEFT
  const hx = cx - r*0.44, hy = cy - r*0.67, hr = r*0.72;
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI*2); ctx.fill();
  // Snout
  ctx.fillStyle = darker(col, 30);
  ctx.beginPath(); ctx.arc(hx, hy + hr*0.3, hr*0.58, 0, Math.PI); ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(hx, hy + hr*0.25, hr*0.44, hr*0.38, 0, 0, Math.PI*2); ctx.fill();
  // Floppy ears
  ctx.fillStyle = darker(col, 25);
  ctx.beginPath(); ctx.ellipse(hx - hr*0.54, hy - hr*0.08, hr*0.3, hr*0.55, -0.3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + hr*0.44, hy - hr*0.18, hr*0.28, hr*0.48, 0.25, 0, Math.PI*2); ctx.fill();
  // Angry eyes
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(hx - hr*0.22, hy - hr*0.1, hr*0.2, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + hr*0.18, hy - hr*0.1, hr*0.2, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#8b0000";
  ctx.beginPath(); ctx.arc(hx - hr*0.2, hy - hr*0.08, hr*0.12, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + hr*0.16, hy - hr*0.08, hr*0.12, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = "#500"; ctx.lineWidth = 1.8; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(hx - hr*0.36, hy - hr*0.33); ctx.lineTo(hx - hr*0.08, hy - hr*0.26); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx + hr*0.30, hy - hr*0.33); ctx.lineTo(hx + hr*0.04, hy - hr*0.26); ctx.stroke();
  // Fangs
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.moveTo(hx - hr*0.1, hy + hr*0.22); ctx.lineTo(hx - hr*0.03, hy + hr*0.37); ctx.lineTo(hx + hr*0.04, hy + hr*0.22); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx + hr*0.1, hy + hr*0.22); ctx.lineTo(hx + hr*0.17, hy + hr*0.36); ctx.lineTo(hx + hr*0.24, hy + hr*0.22); ctx.closePath(); ctx.fill();
}

function drawFastDog(ctx: CanvasRenderingContext2D, cx:number, cy:number, r:number, col:string, ph:number) {
  const lc = lighter(col, 60);
  // Sleek streamlined body
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(cx, cy, r*1.18, r*0.7, -0.1, 0, Math.PI*2); ctx.fill();
  // Speed streaks
  ctx.save(); ctx.strokeStyle = lc; ctx.lineWidth = 1; ctx.globalAlpha = 0.45 + 0.3*Math.sin(ph*3);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(cx + r*0.8 + i*3, cy - r*0.1 + i*5); ctx.lineTo(cx + r*1.5 + i*3, cy - r*0.1 + i*5); ctx.stroke();
  }
  ctx.restore();
  // Head (faces left)
  const hx = cx - r*0.52, hy = cy - r*0.5, hr = r*0.62;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(hx - hr*1.15, hy + hr*0.2);
  ctx.quadraticCurveTo(hx - hr*0.8, hy - hr*0.3, hx, hy - hr*0.5);
  ctx.arc(hx, hy, hr, -Math.PI*0.56, Math.PI*0.65);
  ctx.closePath(); ctx.fill();
  // Spiky crest
  ctx.fillStyle = lc;
  for (let i = 0; i < 4; i++) {
    const sx = hx - hr*0.2 + i*hr*0.38;
    const swing = Math.sin(ph*2 + i) * 2.5;
    ctx.beginPath(); ctx.moveTo(sx - hr*0.1, hy - hr*0.5); ctx.lineTo(sx + swing, hy - hr*(0.95 + i*0.08)); ctx.lineTo(sx + hr*0.1, hy - hr*0.5); ctx.closePath(); ctx.fill();
  }
  // Eye (sharp yellow)
  ctx.fillStyle = "#ffdd00";
  ctx.beginPath(); ctx.arc(hx - hr*0.22, hy, hr*0.19, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#000";
  ctx.beginPath(); ctx.arc(hx - hr*0.22, hy, hr*0.1, 0, Math.PI*2); ctx.fill();
}

function drawTankDog(ctx: CanvasRenderingContext2D, cx:number, cy:number, r:number, col:string, t:number) {
  const dc = darker(col, 50);
  // Armored body (rectangular)
  ctx.fillStyle = dc;
  ctx.beginPath(); ctx.roundRect(cx - r, cy - r*0.88, r*2, r*1.8, 5); ctx.fill();
  // Armor plates
  ctx.fillStyle = col;
  ctx.fillRect(cx - r*0.82, cy - r*0.62, r*1.64, r*0.28);
  ctx.fillRect(cx - r*0.82, cy - r*0.14, r*1.64, r*0.28);
  ctx.fillRect(cx - r*0.82, cy + r*0.34, r*1.64, r*0.28);
  // Shoulder pads
  ctx.beginPath(); ctx.arc(cx - r*1.02, cy - r*0.3, r*0.34, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + r*1.02, cy - r*0.3, r*0.34, 0, Math.PI*2); ctx.fill();
  // Helmet
  const hx = cx - r*0.38, hy = cy - r*1.08, hr = r*0.8;
  ctx.fillStyle = dc;
  ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#8b0000";
  ctx.beginPath(); ctx.arc(hx, hy, hr, 0.25, Math.PI-0.25); ctx.closePath(); ctx.fill();
  // Visor glow
  ctx.fillStyle = `rgba(255,50,50,${0.55 + 0.45*Math.sin(t*3.2)})`;
  ctx.fillRect(hx - hr*0.58, hy - hr*0.08, hr*1.16, hr*0.22);
  // Horns
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(hx - hr*0.42, hy - hr*0.78); ctx.lineTo(hx - hr*0.62, hy - hr*1.52); ctx.lineTo(hx - hr*0.22, hy - hr*0.84); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx + hr*0.18, hy - hr*0.78); ctx.lineTo(hx + hr*0.38, hy - hr*1.52); ctx.lineTo(hx - hr*0.02, hy - hr*0.84); ctx.closePath(); ctx.fill();
}

// ── speedy dog (tiny, lightning-fast) ─────────────────────────────────────
function drawSpeedyDog(ctx: CanvasRenderingContext2D, cx:number, cy:number, r:number, col:string, ph:number) {
  const lc = lighter(col, 80);
  // Tiny streamlined body
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(cx, cy, r*1.3, r*0.6, -0.2, 0, Math.PI*2); ctx.fill();
  // Lightning trail
  ctx.save(); ctx.strokeStyle = lc; ctx.lineWidth = 1; ctx.globalAlpha = 0.6 + 0.4*Math.abs(Math.sin(ph*4));
  ctx.beginPath(); ctx.moveTo(cx + r*1.0, cy - r*0.1); ctx.lineTo(cx + r*2.2, cy - r*0.4);
  ctx.moveTo(cx + r*1.1, cy + r*0.2); ctx.lineTo(cx + r*2.4, cy + r*0.3); ctx.stroke();
  ctx.restore();
  // Tiny head (faces left)
  const hx = cx - r*0.6, hy = cy - r*0.4, hr = r*0.55;
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(hx, hy, hr*1.1, hr*0.85, -0.15, 0, Math.PI*2); ctx.fill();
  // Pointy snout
  ctx.beginPath(); ctx.moveTo(hx - hr*1.0, hy + hr*0.15); ctx.lineTo(hx - hr*0.6, hy); ctx.lineTo(hx - hr*0.6, hy + hr*0.3); ctx.closePath(); ctx.fill();
  // Tiny spiky ears
  ctx.fillStyle = lc;
  ctx.beginPath(); ctx.moveTo(hx - hr*0.1, hy - hr*0.8); ctx.lineTo(hx + hr*0.05, hy - hr*1.35); ctx.lineTo(hx + hr*0.2, hy - hr*0.8); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx + hr*0.25, hy - hr*0.75); ctx.lineTo(hx + hr*0.4, hy - hr*1.2); ctx.lineTo(hx + hr*0.55, hy - hr*0.75); ctx.closePath(); ctx.fill();
  // Bright eye
  ctx.fillStyle = "#ffe000";
  ctx.beginPath(); ctx.arc(hx - hr*0.18, hy - hr*0.1, hr*0.2, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#000";
  ctx.beginPath(); ctx.arc(hx - hr*0.18, hy - hr*0.1, hr*0.1, 0, Math.PI*2); ctx.fill();
}

function drawAssassinDog(ctx: CanvasRenderingContext2D, cx:number, cy:number, r:number, col:string, ph:number) {
  const lc = lighter(col, 70);
  // Lean body
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(cx, cy, r*1.24, r*0.62, -0.2, 0, Math.PI*2); ctx.fill();
  // Blade-like tail
  ctx.fillStyle = lc;
  ctx.beginPath();
  ctx.moveTo(cx + r*0.85, cy - r*0.1);
  ctx.lineTo(cx + r*1.9, cy - r*0.35 + Math.sin(ph * 4) * 2);
  ctx.lineTo(cx + r*1.2, cy + r*0.15);
  ctx.closePath();
  ctx.fill();
  // Head and mask
  const hx = cx - r*0.58, hy = cy - r*0.5, hr = r*0.65;
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(hx, hy, hr*1.05, hr*0.8, -0.2, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = darker(col, 40);
  ctx.beginPath(); ctx.roundRect(hx - hr*0.75, hy - hr*0.12, hr*1.3, hr*0.35, 2); ctx.fill();
  // Red eye slit
  ctx.fillStyle = "#fef2f2";
  ctx.beginPath(); ctx.arc(hx - hr*0.22, hy - hr*0.02, hr*0.15, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#b91c1c";
  ctx.beginPath(); ctx.arc(hx - hr*0.22, hy - hr*0.02, hr*0.08, 0, Math.PI*2); ctx.fill();
}

function drawBruteDog(ctx: CanvasRenderingContext2D, cx:number, cy:number, r:number, col:string, t:number) {
  const dc = darker(col, 35);
  // Huge body
  ctx.fillStyle = dc;
  ctx.beginPath(); ctx.roundRect(cx - r*1.05, cy - r*0.95, r*2.1, r*1.95, 8); ctx.fill();
  // Thick armor bands
  ctx.fillStyle = col;
  ctx.fillRect(cx - r*0.92, cy - r*0.65, r*1.84, r*0.3);
  ctx.fillRect(cx - r*0.92, cy - r*0.15, r*1.84, r*0.3);
  ctx.fillRect(cx - r*0.92, cy + r*0.35, r*1.84, r*0.3);
  // Spikes
  ctx.fillStyle = lighter(col, 45);
  for (let i = 0; i < 4; i++) {
    const sx = cx - r*0.7 + i * r * 0.5;
    ctx.beginPath();
    ctx.moveTo(sx, cy - r*0.96);
    ctx.lineTo(sx + r*0.1, cy - r*1.42 - Math.sin(t * 2 + i) * 1.5);
    ctx.lineTo(sx + r*0.2, cy - r*0.96);
    ctx.closePath();
    ctx.fill();
  }
  // Head
  const hx = cx - r*0.44, hy = cy - r*1.18, hr = r*0.86;
  ctx.fillStyle = dc;
  ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI*2); ctx.fill();
  // Jaw
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.roundRect(hx - hr*0.75, hy + hr*0.08, hr*1.2, hr*0.45, 4); ctx.fill();
  // Eye
  ctx.fillStyle = "#fee2e2";
  ctx.beginPath(); ctx.arc(hx - hr*0.2, hy - hr*0.06, hr*0.14, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#991b1b";
  ctx.beginPath(); ctx.arc(hx - hr*0.2, hy - hr*0.06, hr*0.08, 0, Math.PI*2); ctx.fill();
}

function drawWarlockDog(ctx: CanvasRenderingContext2D, cx:number, cy:number, r:number, col:string, t:number) {
  const pulse = 0.55 + 0.45 * Math.sin(t * 3.1);
  // Magic aura
  ctx.save();
  ctx.globalAlpha = 0.2 + pulse * 0.18;
  ctx.fillStyle = lighter(col, 30);
  ctx.beginPath(); ctx.ellipse(cx, cy, r*1.5, r*1.25, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();
  // Robe-like body
  ctx.fillStyle = darker(col, 20);
  ctx.beginPath();
  ctx.moveTo(cx - r*0.95, cy + r*0.75);
  ctx.quadraticCurveTo(cx - r*1.05, cy - r*0.5, cx - r*0.5, cy - r*0.9);
  ctx.lineTo(cx + r*0.7, cy - r*0.9);
  ctx.quadraticCurveTo(cx + r*1.1, cy - r*0.45, cx + r*0.9, cy + r*0.75);
  ctx.closePath();
  ctx.fill();
  // Rune belt
  ctx.fillStyle = lighter(col, 50);
  ctx.fillRect(cx - r*0.6, cy - r*0.1, r*1.2, r*0.2);
  // Head
  const hx = cx - r*0.28, hy = cy - r*1.08, hr = r*0.74;
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI*2); ctx.fill();
  // Glowing eye and staff crystal
  ctx.fillStyle = "#e0e7ff";
  ctx.beginPath(); ctx.arc(hx - hr*0.16, hy - hr*0.05, hr*0.14, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#4338ca";
  ctx.beginPath(); ctx.arc(hx - hr*0.16, hy - hr*0.05, hr*0.08, 0, Math.PI*2); ctx.fill();
  // Staff
  ctx.strokeStyle = "#312e81"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx + r*0.7, cy + r*0.6); ctx.lineTo(cx + r*1.05, cy - r*0.85); ctx.stroke();
  ctx.fillStyle = `rgba(165,180,252,${0.45 + pulse * 0.4})`;
  ctx.beginPath(); ctx.arc(cx + r*1.1, cy - r*0.95, r*0.19, 0, Math.PI*2); ctx.fill();
}

// ── boss dog (huge, purple, armored with aura) ────────────────────────────
function drawBossDog(ctx: CanvasRenderingContext2D, cx:number, cy:number, r:number, col:string, t:number) {
  const dc = darker(col, 40);
  const pulse = 0.5 + 0.5 * Math.sin(t * 2.5);
  // Purple aura
  ctx.save();
  ctx.shadowColor = col; ctx.shadowBlur = 18 + pulse * 12;
  ctx.globalAlpha = 0.25 + pulse * 0.15;
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(cx, cy, r*1.5, r*1.4, 0, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  ctx.restore();
  // Heavy armored body
  ctx.save();
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.fillStyle = dc;
  ctx.beginPath(); ctx.roundRect(cx - r, cy - r*0.9, r*2, r*1.9, 7); ctx.fill();
  // Gold armor plates
  ctx.fillStyle = "#c8a000";
  ctx.fillRect(cx - r*0.85, cy - r*0.7, r*1.7, r*0.32);
  ctx.fillRect(cx - r*0.85, cy - r*0.2, r*1.7, r*0.32);
  ctx.fillRect(cx - r*0.85, cy + r*0.3, r*1.7, r*0.32);
  // Spiky shoulder pads
  ctx.fillStyle = col;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(cx - r*1.1 - i*3, cy - r*(0.6 - i*0.15)); ctx.lineTo(cx - r*1.4 - i*3, cy - r*(1.0 - i*0.1)); ctx.lineTo(cx - r*0.9, cy - r*0.55); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + r*1.1 + i*3, cy - r*(0.6 - i*0.15)); ctx.lineTo(cx + r*1.4 + i*3, cy - r*(1.0 - i*0.1)); ctx.lineTo(cx + r*0.9, cy - r*0.55); ctx.closePath(); ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.restore();
  // Large helmet
  const hx = cx - r*0.4, hy = cy - r*1.15, hr = r*0.9;
  ctx.fillStyle = dc;
  ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI*2); ctx.fill();
  // Gold helmet band
  ctx.fillStyle = "#c8a000";
  ctx.fillRect(hx - hr*0.9, hy - hr*0.12, hr*1.8, hr*0.28);
  // Glowing purple visor
  const vg = ctx.createLinearGradient(hx - hr*0.6, hy, hx + hr*0.3, hy);
  vg.addColorStop(0, `rgba(180,100,255,${0.7 + pulse*0.3})`);
  vg.addColorStop(1, `rgba(120,50,200,${0.4 + pulse*0.2})`);
  ctx.fillStyle = vg;
  ctx.beginPath(); ctx.roundRect(hx - hr*0.62, hy - hr*0.16, hr*1.1, hr*0.34, 3); ctx.fill();
  // Big horns
  ctx.fillStyle = "#c8a000";
  ctx.beginPath(); ctx.moveTo(hx - hr*0.5, hy - hr*0.85); ctx.lineTo(hx - hr*0.8, hy - hr*1.8); ctx.lineTo(hx - hr*0.15, hy - hr*0.9); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx + hr*0.2, hy - hr*0.85); ctx.lineTo(hx + hr*0.5, hy - hr*1.8); ctx.lineTo(hx - hr*0.1, hy - hr*0.9); ctx.closePath(); ctx.fill();
  // BOSS label
  ctx.fillStyle = `rgba(255,220,50,${0.7 + pulse*0.3})`;
  ctx.font = `bold ${Math.round(r*0.5)}px sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("BOSS", cx, cy - r*2.4);
}

// ── shooter cat (with bow visual) ─────────────────────────────────────────
function drawShooterBow(ctx: CanvasRenderingContext2D, hx:number, hy:number, hr:number, col:string, t:number) {
  const drawAngle = Math.sin(t * 3) * 0.15;
  ctx.save();
  ctx.translate(hx + hr*1.1, hy + hr*0.2);
  ctx.rotate(drawAngle);
  // Bow arc
  ctx.strokeStyle = "#8b5e1a"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(0, 0, hr*0.75, -Math.PI*0.65, Math.PI*0.65); ctx.stroke();
  // Bow string
  ctx.strokeStyle = "#fffacd"; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(hr*0.75 * Math.cos(-Math.PI*0.65), hr*0.75 * Math.sin(-Math.PI*0.65));
  ctx.lineTo(hr*0.75 * Math.cos(Math.PI*0.65), hr*0.75 * Math.sin(Math.PI*0.65));
  ctx.stroke();
  // Arrow
  ctx.strokeStyle = col; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-hr*0.3, 0); ctx.lineTo(hr*0.65, 0); ctx.stroke();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(hr*0.65, 0); ctx.lineTo(hr*0.45, -hr*0.12); ctx.lineTo(hr*0.45, hr*0.12); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ── bomber cat (flames around body) ───────────────────────────────────────
function drawBomberFlames(ctx: CanvasRenderingContext2D, cx:number, cy:number, r:number, t:number) {
  const flames = [
    { ox: -r*0.6, oy: r*0.3, scale: 1.0 },
    { ox:  0,     oy: r*0.55, scale: 1.2 },
    { ox:  r*0.6, oy: r*0.3, scale: 0.9 },
    { ox: -r*0.3, oy: r*0.45, scale: 0.8 },
  ];
  for (const fl of flames) {
    const flicker = 0.7 + 0.3 * Math.sin(t * 8 + fl.ox);
    const h = r * 0.7 * fl.scale * flicker;
    const w = r * 0.3 * fl.scale;
    const grd = ctx.createLinearGradient(cx + fl.ox, cy + fl.oy, cx + fl.ox, cy + fl.oy + h);
    grd.addColorStop(0, `rgba(255,220,30,${0.9 * flicker})`);
    grd.addColorStop(0.4, `rgba(255,100,10,${0.7 * flicker})`);
    grd.addColorStop(1, "rgba(200,0,0,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(cx + fl.ox - w, cy + fl.oy);
    ctx.quadraticCurveTo(cx + fl.ox - w*0.3, cy + fl.oy + h*0.5, cx + fl.ox, cy + fl.oy + h);
    ctx.quadraticCurveTo(cx + fl.ox + w*0.3, cy + fl.oy + h*0.5, cx + fl.ox + w, cy + fl.oy);
    ctx.closePath();
    ctx.fill();
  }
}

// ── hit effect ─────────────────────────────────────────────────────────────
function drawHitEffect(ctx: CanvasRenderingContext2D, ef: HitEffect, now: number) {
  const p = (now - ef.t) / ef.dur;
  if (p >= 1) return;
  const alpha = 1 - p, rad = p * 22;
  ctx.save();
  ctx.globalAlpha = alpha * 0.85;
  ctx.strokeStyle = ef.color; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(ef.x, ef.y, rad, 0, Math.PI*2); ctx.stroke();
  ctx.globalAlpha = alpha * 0.55;
  const { r, g, b } = hexToRgb(ef.color);
  ctx.fillStyle = `rgb(${Math.min(255,r+90)},${Math.min(255,g+90)},${Math.min(255,b+90)})`;
  ctx.beginPath(); ctx.arc(ef.x, ef.y, rad * 0.45, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

// ── particle ───────────────────────────────────────────────────────────────
function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, now: number) {
  const dt  = (now - p.t) / 1000;
  const prg = (now - p.t) / p.dur;
  if (prg >= 1) return;
  const x = p.x + p.vx * dt;
  const y = p.y + p.vy * dt + 150 * dt * dt;
  ctx.save();
  ctx.globalAlpha = 1 - prg;
  ctx.fillStyle = p.color;
  ctx.beginPath(); ctx.arc(x, y, p.r * (1 - prg * 0.5), 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

// ── angel (death) ───────────────────────────────────────────────────────────
function drawAngel(ctx: CanvasRenderingContext2D, a: Angel, now: number) {
  const dt  = (now - a.t) / 1000;
  const prg = (now - a.t) / a.dur;
  if (prg >= 1) return;

  const x = a.x;
  const y = a.y - dt * 55;   // float upward
  const alpha = prg < 0.7 ? 1 : 1 - (prg - 0.7) / 0.3;  // fade out last 30%
  const scale = 0.6 + Math.sin(prg * Math.PI) * 0.2;      // scale pulse

  ctx.save();
  ctx.globalAlpha = alpha * 0.9;
  ctx.translate(x, y);
  ctx.scale(a.facingLeft ? -scale : scale, scale);

  // Halo (golden ring)
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, -16, 8, 3, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Halo glow
  ctx.globalAlpha = alpha * 0.4;
  ctx.strokeStyle = "#fde68a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, -16, 8, 3, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = alpha * 0.9;

  // Body (small ghost shape)
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.arc(0, -4, 10, Math.PI, 0);  // round top
  // Wavy bottom
  ctx.lineTo(10, 8);
  ctx.quadraticCurveTo(7, 4, 5, 8);
  ctx.quadraticCurveTo(2.5, 12, 0, 8);
  ctx.quadraticCurveTo(-2.5, 12, -5, 8);
  ctx.quadraticCurveTo(-7, 4, -10, 8);
  ctx.lineTo(-10, -4);
  ctx.fill();

  // Eyes (closed peacefully — two curved lines)
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1.2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(-3.5, -4, 2.5, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(3.5, -4, 2.5, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();

  // Wings (flapping)
  const wingFlap = Math.sin(prg * Math.PI * 8) * 0.3;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  // Left wing
  ctx.beginPath();
  ctx.moveTo(-8, -2);
  ctx.quadraticCurveTo(-20, -12 + wingFlap * 10, -16, -2 + wingFlap * 5);
  ctx.quadraticCurveTo(-12, 2, -8, 0);
  ctx.fill();
  // Right wing
  ctx.beginPath();
  ctx.moveTo(8, -2);
  ctx.quadraticCurveTo(20, -12 + wingFlap * 10, 16, -2 + wingFlap * 5);
  ctx.quadraticCurveTo(12, 2, 8, 0);
  ctx.fill();

  // Sparkles around angel
  ctx.fillStyle = "#fde68a";
  const sparkleTime = prg * 6;
  for (let i = 0; i < 3; i++) {
    const sa = sparkleTime + i * 2.1;
    const sx = Math.sin(sa * 1.7) * 18;
    const sy = Math.cos(sa * 1.3) * 10 - 6;
    const sr = 1 + Math.sin(sa * 3) * 0.5;
    ctx.globalAlpha = alpha * (0.4 + Math.sin(sa * 4) * 0.3);
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ── main component ─────────────────────────────────────────────────────────
export function BattleCanvas({ state, playerBaseX, enemyBaseX, canvasWidth, themeKey, isPaused, combo = 0, comboFlashKey = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const starsRef       = useRef<{ x:number; y:number; r:number }[]>([]);
  const hitEffectsRef  = useRef<HitEffect[]>([]);
  const particlesRef   = useRef<Particle[]>([]);
  const angelsRef      = useRef<Angel[]>([]);
  const prevUnitHpRef  = useRef<Map<number,number>>(new Map());
  const prevEnemyHpRef = useRef<Map<number,number>>(new Map());
  const prevEnemyPosRef = useRef<Map<number,{x:number;y:number;color:string}>>(new Map());
  const prevUnitPosRef  = useRef<Map<number,{x:number;y:number;color:string}>>(new Map());
  const comboFlashRef   = useRef<{ t: number; level: number }>({ t: 0, level: 0 });
  const prevComboFlashKey = useRef(0);

  // One-time star generation
  if (starsRef.current.length === 0) {
    for (let i = 0; i < 55; i++)
      starsRef.current.push({ x: Math.random(), y: Math.random() * 155, r: Math.random() * 1.4 + 0.3 });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const now = performance.now();
    const t   = state.elapsedSec;

    // ── detect hits & deaths ──────────────────────────────────────────────
    const currentUnitIds  = new Set(state.units.map(u => u.id));
    const currentEnemyIds = new Set(state.enemies.map(e => e.id));

    // Unit HP decrease → red hit flash
    for (const u of state.units) {
      const prev = prevUnitHpRef.current.get(u.id);
      if (prev !== undefined && u.hp < prev)
        hitEffectsRef.current.push({ x: u.x, y: GROUND_Y - u.def.radius * 2 - 6, t: now, dur: 340, color: "#ef4444" });
    }
    // Enemy HP decrease → yellow hit flash
    for (const e of state.enemies) {
      const prev = prevEnemyHpRef.current.get(e.id);
      if (prev !== undefined && e.hp < prev)
        hitEffectsRef.current.push({ x: e.x, y: GROUND_Y - e.def.radius * 2 - 6, t: now, dur: 340, color: "#fbbf24" });
    }
    // Enemy death → angel + small particles
    for (const [id, pos] of prevEnemyPosRef.current) {
      if (!currentEnemyIds.has(id)) {
        angelsRef.current.push({
          x: pos.x, y: pos.y, t: now, dur: 1400,
          color: pos.color, facingLeft: true,
        });
        // Small puff particles
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const spd   = 25 + Math.random() * 35;
          particlesRef.current.push({
            x: pos.x, y: pos.y,
            vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 40,
            t: now, dur: 350 + Math.random() * 200,
            color: "#ffffff", r: 2 + Math.random() * 1.5,
          });
        }
      }
    }
    // Unit death → angel + small particles
    for (const [id, pos] of prevUnitPosRef.current) {
      if (!currentUnitIds.has(id)) {
        angelsRef.current.push({
          x: pos.x, y: pos.y, t: now, dur: 1400,
          color: pos.color, facingLeft: false,
        });
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const spd   = 20 + Math.random() * 30;
          particlesRef.current.push({
            x: pos.x, y: pos.y,
            vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 35,
            t: now, dur: 300 + Math.random() * 200,
            color: "#ffffff", r: 2 + Math.random() * 1.5,
          });
        }
      }
    }

    // Update prev snapshots
    prevUnitHpRef.current  = new Map(state.units.map(u  => [u.id, u.hp]));
    prevEnemyHpRef.current = new Map(state.enemies.map(e => [e.id, e.hp]));
    prevUnitPosRef.current  = new Map(state.units.map(u  => [u.id, { x: u.x, y: GROUND_Y - u.def.radius, color: u.def.color }]));
    prevEnemyPosRef.current = new Map(state.enemies.map(e => [e.id, { x: e.x, y: GROUND_Y - e.def.radius, color: e.def.color }]));

    // Prune dead effects
    hitEffectsRef.current = hitEffectsRef.current.filter(ef => now - ef.t < ef.dur);
    particlesRef.current  = particlesRef.current.filter(p  => now - p.t  < p.dur);
    angelsRef.current     = angelsRef.current.filter(a  => now - a.t  < a.dur);

    // ── draw ──────────────────────────────────────────────────────────────
    ctx.clearRect(0, 0, canvasWidth, CANVAS_HEIGHT);
    drawBackground(ctx, canvasWidth, t, themeKey, starsRef.current);
    drawPlayerCastle(ctx, playerBaseX, state.playerBaseHp, state.playerBaseMaxHp, t);
    drawEnemyCastle(ctx, enemyBaseX,   state.enemyBaseHp,  state.enemyBaseMaxHp,  t);
    const CAT_TYPES = new Set(["basic", "fast", "tank", "shooter", "bomber"]);
    for (const u of state.units) {
      if (CAT_TYPES.has(u.def.type)) {
        drawCat(ctx, u, t);
      } else {
        drawGenericUnit(ctx, u, t);
      }
    }
    for (const e of state.enemies) drawEnemy(ctx, e, t);
    for (const ef of hitEffectsRef.current) drawHitEffect(ctx, ef, now);
    for (const p  of particlesRef.current)  drawParticle(ctx, p,  now);
    for (const a  of angelsRef.current)     drawAngel(ctx, a, now);

    // ── combo flash & special attack ─────────────────────────────────────
    if (comboFlashKey !== prevComboFlashKey.current && combo >= 5) {
      prevComboFlashKey.current = comboFlashKey;
      comboFlashRef.current = { t: now, level: combo >= 10 ? 2 : 1 };
    }
    {
      const cf = comboFlashRef.current;
      if (cf.t > 0) {
        const elapsed = now - cf.t;
        // Screen flash (0 ~ 400ms)
        if (elapsed < 400) {
          const p = elapsed / 400;
          const flashAlpha = (1 - p) * (cf.level >= 2 ? 0.45 : 0.25);
          ctx.save();
          ctx.fillStyle = cf.level >= 2
            ? `rgba(192,132,252,${flashAlpha})`   // purple for 10+ combo
            : `rgba(251,191,36,${flashAlpha})`;    // gold for 5+ combo
          ctx.fillRect(0, 0, canvasWidth, CANVAS_HEIGHT);
          ctx.restore();
        }
        // 10+ combo: shockwave that damages all enemies (visual only - damage done in GameScene)
        if (cf.level >= 2 && elapsed < 800) {
          const p = elapsed / 800;
          const radius = p * canvasWidth * 0.6;
          ctx.save();
          ctx.globalAlpha = (1 - p) * 0.6;
          ctx.strokeStyle = "#c084fc";
          ctx.lineWidth = 4 + (1 - p) * 8;
          ctx.beginPath();
          ctx.arc(playerBaseX + 30, GROUND_Y - 40, radius, 0, Math.PI * 2);
          ctx.stroke();
          // Inner glow
          ctx.globalAlpha = (1 - p) * 0.3;
          ctx.strokeStyle = "#e9d5ff";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(playerBaseX + 30, GROUND_Y - 40, radius * 0.85, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        // Combo text display
        if (elapsed < 1200) {
          const p = elapsed / 1200;
          const textAlpha = p < 0.2 ? p / 0.2 : p > 0.7 ? (1 - p) / 0.3 : 1;
          const scale = p < 0.15 ? 0.5 + p / 0.15 * 0.5 : 1 + Math.sin(p * 4) * 0.05;
          ctx.save();
          ctx.globalAlpha = textAlpha;
          ctx.translate(canvasWidth / 2, CANVAS_HEIGHT * 0.35);
          ctx.scale(scale, scale);
          ctx.font = `bold ${cf.level >= 2 ? 32 : 26}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = cf.level >= 2 ? "#c084fc" : "#fbbf24";
          ctx.shadowBlur = 20;
          ctx.fillStyle = cf.level >= 2 ? "#e9d5ff" : "#fef3c7";
          ctx.fillText(
            cf.level >= 2 ? `💥 ${combo} COMBO! 必殺技発動！` : `🔥 ${combo} COMBO!`,
            0, 0,
          );
          ctx.restore();
        }
        // Clean up
        if (elapsed > 1200) comboFlashRef.current = { t: 0, level: 0 };
      }
    }

    if (state.status !== "playing") {
      ctx.fillStyle = "rgba(0,0,0,0.62)";
      ctx.fillRect(0, 0, canvasWidth, CANVAS_HEIGHT);
      const msg = state.status === "win" ? "🎉 VICTORY!" : "💀 DEFEAT";
      const col = state.status === "win" ? "#22c55e" : "#ef4444";
      ctx.save();
      ctx.shadowColor = col; ctx.shadowBlur = 22;
      ctx.fillStyle = col; ctx.font = "bold 40px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(msg, canvasWidth / 2, CANVAS_HEIGHT / 2);
      ctx.restore();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={CANVAS_HEIGHT}
      style={{
        display: "block", width: "100%",
        filter: isPaused ? "grayscale(45%) brightness(0.72)" : "none",
        transition: "filter 0.3s",
      }}
    />
  );
}
