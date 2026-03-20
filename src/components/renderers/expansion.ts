type DrawFn = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  col: string,
  t: number,
  ph: number,
) => void;

type Variant =
  | "shield"
  | "spear"
  | "orb"
  | "turret"
  | "wing"
  | "gear"
  | "leaf"
  | "flame"
  | "crystal"
  | "wave";

interface ExpansionConfig {
  id: string;
  variant: Variant;
  badge: string;
}

function hexToRgb(hex: string) {
  return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) };
}
function darker(hex: string, n: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.max(0, r - n)},${Math.max(0, g - n)},${Math.max(0, b - n)})`;
}
function lighter(hex: string, n: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255, r + n)},${Math.min(255, g + n)},${Math.min(255, b + n)})`;
}

function drawBase(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  col: string,
  t: number,
  ph: number,
) {
  const bob = Math.sin(t * 3 + ph * 2) * r * 0.05;
  const bodyY = cy - bob;
  const leg = Math.sin(ph * Math.PI * 2) * r * 0.18;

  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.8, r * 0.95, r * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = darker(col, 45);
  ctx.lineWidth = r * 0.17;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.28, bodyY + r * 0.7);
  ctx.lineTo(cx - r * 0.28 + leg, bodyY + r * 1.06);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.28, bodyY + r * 0.7);
  ctx.lineTo(cx + r * 0.28 - leg, bodyY + r * 1.06);
  ctx.stroke();

  const grad = ctx.createLinearGradient(cx - r, bodyY - r, cx + r, bodyY + r);
  grad.addColorStop(0, lighter(col, 24));
  grad.addColorStop(0.6, col);
  grad.addColorStop(1, darker(col, 24));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(cx - r * 0.9, bodyY - r * 0.7, r * 1.8, r * 1.45, r * 0.22);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.roundRect(cx - r * 0.9, bodyY - r * 0.7, r * 1.8, r * 0.32, r * 0.22);
  ctx.fill();

  return bodyY;
}

function drawVariant(
  ctx: CanvasRenderingContext2D,
  variant: Variant,
  cx: number,
  bodyY: number,
  r: number,
  col: string,
  t: number,
  ph: number,
) {
  switch (variant) {
    case "shield":
      ctx.fillStyle = darker(col, 30);
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.95, bodyY - r * 0.1);
      ctx.lineTo(cx - r * 0.45, bodyY - r * 0.45);
      ctx.lineTo(cx - r * 0.45, bodyY + r * 0.42);
      ctx.closePath();
      ctx.fill();
      break;
    case "spear":
      ctx.strokeStyle = darker(col, 35);
      ctx.lineWidth = r * 0.12;
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.45, bodyY + r * 0.45);
      ctx.lineTo(cx + r * 1.05, bodyY - r * 0.5);
      ctx.stroke();
      ctx.fillStyle = lighter(col, 70);
      ctx.beginPath();
      ctx.moveTo(cx + r * 1.05, bodyY - r * 0.5);
      ctx.lineTo(cx + r * 0.88, bodyY - r * 0.42);
      ctx.lineTo(cx + r * 0.96, bodyY - r * 0.26);
      ctx.closePath();
      ctx.fill();
      break;
    case "orb":
      ctx.fillStyle = `rgba(255,255,255,${0.28 + Math.abs(Math.sin(t * 4 + ph)) * 0.25})`;
      ctx.beginPath();
      ctx.arc(cx + r * 0.62, bodyY - r * 0.25, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "turret":
      ctx.fillStyle = darker(col, 40);
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.3, bodyY - r * 0.92, r * 0.6, r * 0.38, r * 0.1);
      ctx.fill();
      ctx.fillStyle = lighter(col, 65);
      ctx.fillRect(cx + r * 0.12, bodyY - r * 0.78, r * 0.35, r * 0.08);
      break;
    case "wing":
      ctx.fillStyle = lighter(col, 45);
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.72, bodyY - r * 0.02, r * 0.26, r * 0.16, -0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + r * 0.72, bodyY - r * 0.02, r * 0.26, r * 0.16, 0.45, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "gear":
      ctx.strokeStyle = darker(col, 55);
      ctx.lineWidth = r * 0.08;
      ctx.beginPath();
      ctx.arc(cx + r * 0.65, bodyY - r * 0.2, r * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 2;
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.65 + Math.cos(a) * r * 0.2, bodyY - r * 0.2 + Math.sin(a) * r * 0.2);
        ctx.lineTo(cx + r * 0.65 + Math.cos(a) * r * 0.28, bodyY - r * 0.2 + Math.sin(a) * r * 0.28);
        ctx.stroke();
      }
      break;
    case "leaf":
      ctx.fillStyle = lighter(col, 34);
      ctx.beginPath();
      ctx.moveTo(cx, bodyY - r * 0.85);
      ctx.quadraticCurveTo(cx + r * 0.34, bodyY - r * 0.52, cx, bodyY - r * 0.22);
      ctx.quadraticCurveTo(cx - r * 0.34, bodyY - r * 0.52, cx, bodyY - r * 0.85);
      ctx.fill();
      break;
    case "flame":
      ctx.fillStyle = `rgba(255,180,60,${0.55 + Math.abs(Math.sin(t * 5 + ph)) * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.15, bodyY - r * 0.1);
      ctx.quadraticCurveTo(cx, bodyY - r * 0.72, cx + r * 0.2, bodyY - r * 0.08);
      ctx.closePath();
      ctx.fill();
      break;
    case "crystal":
      ctx.fillStyle = lighter(col, 62);
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.55, bodyY - r * 0.64);
      ctx.lineTo(cx + r * 0.78, bodyY - r * 0.3);
      ctx.lineTo(cx + r * 0.55, bodyY + r * 0.03);
      ctx.lineTo(cx + r * 0.35, bodyY - r * 0.3);
      ctx.closePath();
      ctx.fill();
      break;
    case "wave":
      ctx.strokeStyle = lighter(col, 48);
      ctx.lineWidth = r * 0.09;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.62, bodyY + r * 0.1);
      ctx.quadraticCurveTo(cx - r * 0.2, bodyY - r * 0.22, cx + r * 0.15, bodyY + r * 0.1);
      ctx.quadraticCurveTo(cx + r * 0.45, bodyY + r * 0.38, cx + r * 0.75, bodyY + r * 0.1);
      ctx.stroke();
      break;
  }
}

function drawFace(
  ctx: CanvasRenderingContext2D,
  cx: number,
  bodyY: number,
  r: number,
  badge: string,
) {
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(cx - r * 0.24, bodyY - r * 0.1, r * 0.12, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.24, bodyY - r * 0.1, r * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(cx - r * 0.24, bodyY - r * 0.1, r * 0.06, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.24, bodyY - r * 0.1, r * 0.06, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#222";
  ctx.lineWidth = r * 0.05;
  ctx.beginPath();
  ctx.arc(cx, bodyY + r * 0.14, r * 0.17, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.roundRect(cx - r * 0.28, bodyY - r * 0.57, r * 0.56, r * 0.24, r * 0.07);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${Math.max(8, Math.floor(r * 0.16))}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(badge, cx, bodyY - r * 0.45);
}

function drawExpansion(
  config: ExpansionConfig,
): DrawFn {
  return (ctx, cx, cy, r, col, t, ph) => {
    const bodyY = drawBase(ctx, cx, cy, r, col, t, ph);
    drawVariant(ctx, config.variant, cx, bodyY, r, col, t, ph);
    drawFace(ctx, cx, bodyY, r, config.badge);
  };
}

const EXPANSION_CONFIGS: ExpansionConfig[] = [
  { id: "notebook", variant: "shield", badge: "NB" },
  { id: "protractor", variant: "spear", badge: "PT" },
  { id: "battery", variant: "orb", badge: "BT" },
  { id: "graphpaper", variant: "turret", badge: "GP" },
  { id: "paintbrush", variant: "flame", badge: "PB" },
  { id: "drone", variant: "wing", badge: "DR" },
  { id: "eng_01", variant: "gear", badge: "E1" },
  { id: "eng_02", variant: "shield", badge: "E2" },
  { id: "eng_03", variant: "turret", badge: "E3" },
  { id: "eng_04", variant: "spear", badge: "E4" },
  { id: "eng_05", variant: "wing", badge: "E5" },
  { id: "eng_06", variant: "orb", badge: "E6" },
  { id: "eng_07", variant: "gear", badge: "E7" },
  { id: "eng_08", variant: "crystal", badge: "E8" },
  { id: "eng_09", variant: "wave", badge: "E9" },
  { id: "eng_10", variant: "flame", badge: "E10" },
  { id: "nat_01", variant: "leaf", badge: "N1" },
  { id: "nat_02", variant: "shield", badge: "N2" },
  { id: "nat_03", variant: "spear", badge: "N3" },
  { id: "nat_04", variant: "wing", badge: "N4" },
  { id: "nat_05", variant: "leaf", badge: "N5" },
  { id: "nat_06", variant: "orb", badge: "N6" },
  { id: "nat_07", variant: "shield", badge: "N7" },
  { id: "nat_08", variant: "flame", badge: "N8" },
  { id: "nat_09", variant: "crystal", badge: "N9" },
  { id: "nat_10", variant: "wave", badge: "N10" },
  { id: "his_01", variant: "shield", badge: "H1" },
  { id: "his_02", variant: "gear", badge: "H2" },
  { id: "his_03", variant: "spear", badge: "H3" },
  { id: "his_04", variant: "turret", badge: "H4" },
  { id: "his_05", variant: "shield", badge: "H5" },
  { id: "his_06", variant: "flame", badge: "H6" },
  { id: "his_07", variant: "gear", badge: "H7" },
  { id: "his_08", variant: "wave", badge: "H8" },
  { id: "his_09", variant: "crystal", badge: "H9" },
  { id: "his_10", variant: "orb", badge: "H10" },
  { id: "mus_01", variant: "wave", badge: "M1" },
  { id: "mus_02", variant: "shield", badge: "M2" },
  { id: "mus_03", variant: "spear", badge: "M3" },
  { id: "mus_04", variant: "wing", badge: "M4" },
  { id: "mus_05", variant: "turret", badge: "M5" },
  { id: "mus_06", variant: "orb", badge: "M6" },
  { id: "mus_07", variant: "gear", badge: "M7" },
  { id: "mus_08", variant: "flame", badge: "M8" },
  { id: "mus_09", variant: "crystal", badge: "M9" },
  { id: "mus_10", variant: "wave", badge: "M10" },
  { id: "spo_01", variant: "wing", badge: "S1" },
  { id: "spo_02", variant: "shield", badge: "S2" },
  { id: "spo_03", variant: "spear", badge: "S3" },
  { id: "spo_04", variant: "flame", badge: "S4" },
  { id: "spo_05", variant: "gear", badge: "S5" },
  { id: "spo_06", variant: "turret", badge: "S6" },
  { id: "spo_07", variant: "shield", badge: "S7" },
  { id: "spo_08", variant: "orb", badge: "S8" },
  { id: "spo_09", variant: "crystal", badge: "S9" },
  { id: "spo_10", variant: "wave", badge: "S10" },
];

export const EXPANSION_RENDERERS: Record<string, DrawFn> = Object.fromEntries(
  EXPANSION_CONFIGS.map((cfg) => [cfg.id, drawExpansion(cfg)]),
);

