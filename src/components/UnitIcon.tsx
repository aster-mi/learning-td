import { useRef, useEffect } from "react";
import { UNIT_RENDERERS } from "./renderers";

/** Cat types use a dedicated simple cat icon (BattleCanvas drawCat is too complex/unit-dependent) */
const CAT_TYPES = new Set(["basic", "fast", "tank", "shooter", "bomber"]);

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 200, g: 200, b: 200 };
}
function darker(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.max(0, r - amt)},${Math.max(0, g - amt)},${Math.max(0, b - amt)})`;
}
function lighter(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255, r + amt)},${Math.min(255, g + amt)},${Math.min(255, b + amt)})`;
}

/** Simple cat icon for icon-sized rendering */
function drawCatIcon(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  r: number, col: string,
) {
  // Body oval
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.1, r * 0.7, r * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.35, r * 0.52, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = darker(col, 30);
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.42, cy - r * 0.55);
  ctx.lineTo(cx - r * 0.15, cy - r * 0.95);
  ctx.lineTo(cx - r * 0.05, cy - r * 0.52);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.42, cy - r * 0.55);
  ctx.lineTo(cx + r * 0.15, cy - r * 0.95);
  ctx.lineTo(cx + r * 0.05, cy - r * 0.52);
  ctx.fill();

  // Inner ears
  ctx.fillStyle = lighter(col, 80);
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.35, cy - r * 0.58);
  ctx.lineTo(cx - r * 0.18, cy - r * 0.82);
  ctx.lineTo(cx - r * 0.1, cy - r * 0.55);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.35, cy - r * 0.58);
  ctx.lineTo(cx + r * 0.18, cy - r * 0.82);
  ctx.lineTo(cx + r * 0.1, cy - r * 0.55);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.18, cy - r * 0.38, r * 0.08, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + r * 0.18, cy - r * 0.38, r * 0.08, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlights
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(cx - r * 0.15, cy - r * 0.41, r * 0.035, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + r * 0.21, cy - r * 0.41, r * 0.035, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = "#e8a0b0";
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.26);
  ctx.lineTo(cx - r * 0.06, cy - r * 0.2);
  ctx.lineTo(cx + r * 0.06, cy - r * 0.2);
  ctx.fill();

  // Mouth
  ctx.strokeStyle = "#555";
  ctx.lineWidth = r * 0.04;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.2);
  ctx.lineTo(cx, cy - r * 0.14);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx - r * 0.08, cy - r * 0.1, r * 0.08, -Math.PI * 0.8, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + r * 0.08, cy - r * 0.1, r * 0.08, Math.PI, Math.PI * 1.8);
  ctx.stroke();

  // Whiskers
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = r * 0.03;
  for (const side of [-1, 1]) {
    for (const angle of [-0.15, 0, 0.15]) {
      ctx.beginPath();
      ctx.moveTo(cx + side * r * 0.22, cy - r * 0.22);
      ctx.lineTo(cx + side * r * 0.6, cy - r * 0.22 + angle * r);
      ctx.stroke();
    }
  }

  // Belly patch
  ctx.fillStyle = lighter(col, 60);
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.2, r * 0.3, r * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
}

interface UnitIconProps {
  unitId: string;
  color: string;
  size: number;
  emoji?: string;  // fallback emoji
  style?: React.CSSProperties;
}

export function UnitIcon({ unitId, color, size, emoji, style }: UnitIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isCat = CAT_TYPES.has(unitId);
  const hasRenderer = isCat || !!UNIT_RENDERERS[unitId];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasRenderer) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;

    ctx.save();
    if (isCat) {
      drawCatIcon(ctx, cx, cy, r, color);
    } else {
      const draw = UNIT_RENDERERS[unitId];
      if (draw) {
        draw(ctx, cx, cy, r, color, 0, 0);
      }
    }
    ctx.restore();
  }, [unitId, color, size, hasRenderer, isCat]);

  // Fallback: emoji text
  if (!hasRenderer) {
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        fontSize: size * 0.6,
        lineHeight: 1,
        ...style,
      }}>
        {emoji ?? "?"}
      </span>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        display: "block",
        ...style,
      }}
    />
  );
}
