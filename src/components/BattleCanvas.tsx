import { useEffect, useRef } from "react";
import type { GameState } from "../domain/GameEngine";
import type { Unit } from "../domain/Unit";
import type { Enemy } from "../domain/Enemy";

interface Props {
  state: GameState;
  playerBaseX: number;
  enemyBaseX: number;
  canvasWidth: number;
  isPaused?: boolean;
}

const CANVAS_HEIGHT = 300;
const GROUND_Y = 220;

function drawHpBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  hp: number,
  maxHp: number
) {
  const ratio = Math.max(0, hp / maxHp);
  ctx.fillStyle = "#555";
  ctx.fillRect(x - w / 2, y, w, 5);
  ctx.fillStyle = ratio > 0.5 ? "#2ecc71" : ratio > 0.25 ? "#f39c12" : "#e74c3c";
  ctx.fillRect(x - w / 2, y, w * ratio, 5);
}

function drawUnit(ctx: CanvasRenderingContext2D, u: Unit) {
  const cx = u.x;
  const cy = GROUND_Y - u.def.radius;

  // 影
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.ellipse(cx, GROUND_Y, u.def.radius * 0.9, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // ボディ
  ctx.fillStyle = u.def.color;
  ctx.beginPath();
  ctx.arc(cx, cy, u.def.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 耳（三角）
  ctx.fillStyle = u.def.color;
  const er = u.def.radius;
  ctx.beginPath();
  ctx.moveTo(cx - er * 0.5, cy - er * 0.6);
  ctx.lineTo(cx - er * 0.85, cy - er * 1.3);
  ctx.lineTo(cx - er * 0.1, cy - er * 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + er * 0.5, cy - er * 0.6);
  ctx.lineTo(cx + er * 0.85, cy - er * 1.3);
  ctx.lineTo(cx + er * 0.1, cy - er * 0.9);
  ctx.closePath();
  ctx.fill();

  // 目
  ctx.fillStyle = "#333";
  ctx.beginPath(); ctx.arc(cx - er * 0.3, cy - er * 0.1, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + er * 0.3, cy - er * 0.1, 2.5, 0, Math.PI * 2); ctx.fill();

  // HPバー
  drawHpBar(ctx, cx, cy - u.def.radius - 8, u.def.radius * 2.2, u.hp, u.maxHp);
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy) {
  const cx = e.x;
  const cy = GROUND_Y - e.def.radius;

  // 影
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.ellipse(cx, GROUND_Y, e.def.radius * 0.9, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // ボディ（四角形で犬っぽく）
  ctx.fillStyle = e.def.color;
  const r = e.def.radius;
  ctx.beginPath();
  ctx.roundRect(cx - r, cy - r * 0.8, r * 2, r * 1.8, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 耳
  ctx.fillStyle = e.def.color;
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.55, cy - r * 0.8, r * 0.35, r * 0.55, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + r * 0.55, cy - r * 0.8, r * 0.35, r * 0.55,  0.3, 0, Math.PI * 2);
  ctx.fill();

  // 目
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(cx - r * 0.3, cy - r * 0.05, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + r * 0.3, cy - r * 0.05, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#222";
  ctx.beginPath(); ctx.arc(cx - r * 0.3, cy - r * 0.05, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + r * 0.3, cy - r * 0.05, 2, 0, Math.PI * 2); ctx.fill();

  // HPバー
  drawHpBar(ctx, cx, cy - r - 8, r * 2.2, e.hp, e.maxHp);
}

export function BattleCanvas({ state, playerBaseX, enemyBaseX, canvasWidth, isPaused }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, CANVAS_HEIGHT);

    // 空
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGrad.addColorStop(0, "#87ceeb");
    skyGrad.addColorStop(1, "#d4f1f9");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvasWidth, GROUND_Y);

    // 地面
    const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_HEIGHT);
    groundGrad.addColorStop(0, "#7ec850");
    groundGrad.addColorStop(1, "#5a9e3a");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, GROUND_Y, canvasWidth, CANVAS_HEIGHT - GROUND_Y);

    // 地面のライン
    ctx.strokeStyle = "#4a8a2e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvasWidth, GROUND_Y);
    ctx.stroke();

    // --- プレイヤー拠点 ---
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(playerBaseX - 20, GROUND_Y - 70, 40, 70);
    ctx.fillStyle = "#1abc9c";
    ctx.fillRect(playerBaseX - 24, GROUND_Y - 80, 48, 16);
    // HP
    drawHpBar(ctx, playerBaseX, GROUND_Y - 92, 60, state.playerBaseHp, state.playerBaseMaxHp);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("我が城", playerBaseX, GROUND_Y - 95);

    // --- 敵拠点 ---
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(enemyBaseX - 22, GROUND_Y - 80, 44, 80);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(enemyBaseX - 26, GROUND_Y - 92, 52, 18);
    // 旗
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(enemyBaseX, GROUND_Y - 92); ctx.lineTo(enemyBaseX, GROUND_Y - 115); ctx.stroke();
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.moveTo(enemyBaseX, GROUND_Y - 115); ctx.lineTo(enemyBaseX + 14, GROUND_Y - 108); ctx.lineTo(enemyBaseX, GROUND_Y - 101); ctx.closePath(); ctx.fill();
    drawHpBar(ctx, enemyBaseX, GROUND_Y - 128, 64, state.enemyBaseHp, state.enemyBaseMaxHp);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("敵の城", enemyBaseX, GROUND_Y - 132);

    // --- ユニット描画 ---
    for (const u of state.units) drawUnit(ctx, u);

    // --- 敵描画 ---
    for (const e of state.enemies) drawEnemy(ctx, e);

    // --- 勝敗オーバーレイ ---
    if (state.status !== "playing") {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, canvasWidth, CANVAS_HEIGHT);
      ctx.fillStyle = state.status === "win" ? "#2ecc71" : "#e74c3c";
      ctx.font = "bold 42px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(state.status === "win" ? "🎉 VICTORY!" : "💀 DEFEAT", canvasWidth / 2, CANVAS_HEIGHT / 2 + 14);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={CANVAS_HEIGHT}
      style={{
        display: "block", width: "100%",
        borderTop: "2px solid #ccc", borderBottom: "2px solid #ccc",
        filter: isPaused ? "grayscale(60%) brightness(0.7)" : "none",
        transition: "filter 0.3s",
      }}
    />
  );
}
