type DrawFn = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  col: string,
  t: number,
  ph: number,
) => void;

type BodyKind = "mech" | "beast" | "knight" | "bard" | "athlete" | "mage" | "hover" | "book";
type HeadKind = "visor" | "helm" | "hood" | "leaf" | "crown" | "cap" | "horn" | "none";
type ItemKind =
  | "none"
  | "spear"
  | "shield"
  | "hammer"
  | "bow"
  | "staff"
  | "gear"
  | "orb"
  | "torch"
  | "blade"
  | "book"
  | "brush"
  | "propeller"
  | "drum"
  | "horn"
  | "baton"
  | "racket"
  | "ball"
  | "whistle"
  | "cannon"
  | "wing"
  | "crystal";
type AuraKind = "none" | "spark" | "wind" | "music" | "leaf" | "flame" | "ice" | "grid";

interface StyleConfig {
  id: string;
  body: BodyKind;
  head: HeadKind;
  left: ItemKind;
  right: ItemKind;
  aura: AuraKind;
  trim: string;
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

function drawShadow(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, scale = 1) {
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.92, r * 0.95 * scale, r * 0.16 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawAura(
  ctx: CanvasRenderingContext2D,
  kind: AuraKind,
  cx: number,
  cy: number,
  r: number,
  trim: string,
  t: number,
) {
  void trim;
  if (kind === "none") return;
  const p = 0.45 + 0.55 * Math.sin(t * 3.2);
  ctx.save();
  switch (kind) {
    case "spark": {
      ctx.strokeStyle = `rgba(255,255,255,${0.35 + p * 0.3})`;
      ctx.lineWidth = r * 0.05;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + t * 1.2;
        const x1 = cx + Math.cos(a) * r * 0.75;
        const y1 = cy + Math.sin(a) * r * 0.55;
        const x2 = cx + Math.cos(a) * r * 1.0;
        const y2 = cy + Math.sin(a) * r * 0.75;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      break;
    }
    case "wind": {
      ctx.strokeStyle = `rgba(210,240,255,${0.28 + p * 0.25})`;
      ctx.lineWidth = r * 0.06;
      for (let i = 0; i < 2; i++) {
        const yy = cy - r * 0.25 + i * r * 0.28;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.95, yy);
        ctx.quadraticCurveTo(cx - r * 0.2, yy - r * 0.2, cx + r * 0.65, yy + r * 0.06);
        ctx.stroke();
      }
      break;
    }
    case "music": {
      ctx.fillStyle = `rgba(255,255,255,${0.25 + p * 0.25})`;
      for (let i = 0; i < 3; i++) {
        const a = t * 1.8 + i * 2;
        const x = cx + Math.sin(a) * r * 0.85;
        const y = cy - r * 0.55 - i * r * 0.08;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x + r * 0.06, y - r * 0.22, r * 0.05, r * 0.22);
      }
      break;
    }
    case "leaf": {
      ctx.fillStyle = `rgba(220,255,220,${0.18 + p * 0.2})`;
      for (let i = 0; i < 3; i++) {
        const a = t * 1.7 + i * 2.2;
        const x = cx + Math.cos(a) * r * 0.78;
        const y = cy + Math.sin(a) * r * 0.55;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 0.12, r * 0.07, a, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "flame": {
      ctx.fillStyle = `rgba(255,180,80,${0.22 + p * 0.25})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy - r * 0.1, r * 1.1, r * 0.82, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "ice": {
      ctx.strokeStyle = `rgba(180,240,255,${0.25 + p * 0.25})`;
      ctx.lineWidth = r * 0.05;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + t * 0.6;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.6);
        ctx.stroke();
      }
      break;
    }
    case "grid": {
      ctx.strokeStyle = `rgba(220,220,255,${0.16 + p * 0.18})`;
      ctx.lineWidth = r * 0.03;
      for (let i = -2; i <= 2; i++) {
        const x = cx + i * r * 0.26;
        ctx.beginPath();
        ctx.moveTo(x, cy - r * 0.72);
        ctx.lineTo(x, cy + r * 0.72);
        ctx.stroke();
      }
      for (let j = -2; j <= 2; j++) {
        const y = cy + j * r * 0.22;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.85, y);
        ctx.lineTo(cx + r * 0.85, y);
        ctx.stroke();
      }
      break;
    }
  }
  ctx.restore();
}

function drawBody(
  ctx: CanvasRenderingContext2D,
  kind: BodyKind,
  cx: number,
  cy: number,
  r: number,
  col: string,
  trim: string,
  t: number,
  ph: number,
) {
  const bob = Math.sin(t * 3 + ph * 1.7) * r * 0.05;
  const y = cy - bob;
  const grad = ctx.createLinearGradient(cx - r, y - r, cx + r, y + r);
  grad.addColorStop(0, lighter(col, 24));
  grad.addColorStop(0.58, col);
  grad.addColorStop(1, darker(col, 24));
  ctx.fillStyle = grad;

  switch (kind) {
    case "mech":
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.9, y - r * 0.64, r * 1.8, r * 1.34, r * 0.18);
      ctx.fill();
      ctx.fillStyle = darker(col, 40);
      for (let i = 0; i < 3; i++) {
        const bx = cx - r * 0.52 + i * r * 0.52;
        ctx.beginPath();
        ctx.arc(bx, y - r * 0.18, r * 0.07, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case "beast":
      ctx.beginPath();
      ctx.ellipse(cx, y + r * 0.05, r * 0.95, r * 0.66, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + r * 0.6, y - r * 0.16, r * 0.32, r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "knight":
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.78, y - r * 0.68, r * 1.56, r * 1.42, r * 0.2);
      ctx.fill();
      ctx.fillStyle = trim;
      ctx.fillRect(cx - r * 0.12, y - r * 0.58, r * 0.24, r * 1.15);
      break;
    case "bard":
      ctx.beginPath();
      ctx.ellipse(cx, y, r * 0.9, r * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,0.15)`;
      ctx.fillRect(cx - r * 0.68, y + r * 0.38, r * 1.36, r * 0.16);
      break;
    case "athlete":
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.7, y - r * 0.62, r * 1.4, r * 1.28, r * 0.24);
      ctx.fill();
      ctx.strokeStyle = lighter(col, 50);
      ctx.lineWidth = r * 0.06;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.45, y - r * 0.58);
      ctx.lineTo(cx - r * 0.45, y + r * 0.6);
      ctx.moveTo(cx, y - r * 0.58);
      ctx.lineTo(cx, y + r * 0.6);
      ctx.stroke();
      break;
    case "mage":
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.78, y + r * 0.62);
      ctx.quadraticCurveTo(cx - r * 0.95, y - r * 0.28, cx - r * 0.35, y - r * 0.72);
      ctx.lineTo(cx + r * 0.45, y - r * 0.72);
      ctx.quadraticCurveTo(cx + r * 1.0, y - r * 0.3, cx + r * 0.78, y + r * 0.62);
      ctx.closePath();
      ctx.fill();
      break;
    case "hover":
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.84, y - r * 0.56, r * 1.68, r * 1.06, r * 0.3);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,0.25)`;
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.24, y - r * 0.1, r * 0.18, r * 0.12, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + r * 0.24, y - r * 0.1, r * 0.18, r * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "book":
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.9, y - r * 0.68, r * 1.8, r * 1.36, r * 0.14);
      ctx.fill();
      ctx.fillStyle = trim;
      ctx.fillRect(cx + r * 0.7, y - r * 0.65, r * 0.14, r * 1.3);
      ctx.fillStyle = lighter(col, 52);
      ctx.fillRect(cx - r * 0.72, y - r * 0.4, r * 1.15, r * 0.18);
      break;
  }

  return y;
}

function drawHead(ctx: CanvasRenderingContext2D, kind: HeadKind, cx: number, y: number, r: number, col: string, trim: string, t: number) {
  switch (kind) {
    case "none":
      return;
    case "visor":
      ctx.fillStyle = darker(col, 55);
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.42, y - r * 0.9, r * 0.84, r * 0.28, r * 0.08);
      ctx.fill();
      ctx.fillStyle = trim;
      ctx.fillRect(cx - r * 0.35, y - r * 0.79, r * 0.7, r * 0.06);
      break;
    case "helm":
      ctx.fillStyle = darker(col, 48);
      ctx.beginPath();
      ctx.arc(cx, y - r * 0.7, r * 0.34, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = trim;
      ctx.fillRect(cx - r * 0.06, y - r * 1.0, r * 0.12, r * 0.26);
      break;
    case "hood":
      ctx.fillStyle = darker(col, 36);
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.42, y - r * 0.45);
      ctx.lineTo(cx - r * 0.18, y - r * 1.02);
      ctx.lineTo(cx + r * 0.2, y - r * 0.45);
      ctx.closePath();
      ctx.fill();
      break;
    case "leaf":
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.moveTo(cx, y - r * 1.02);
      ctx.quadraticCurveTo(cx + r * 0.2, y - r * 0.72, cx, y - r * 0.46);
      ctx.quadraticCurveTo(cx - r * 0.2, y - r * 0.72, cx, y - r * 1.02);
      ctx.fill();
      break;
    case "crown":
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.3, y - r * 0.78);
      ctx.lineTo(cx - r * 0.18, y - r * 1.0);
      ctx.lineTo(cx, y - r * 0.8);
      ctx.lineTo(cx + r * 0.18, y - r * 1.0);
      ctx.lineTo(cx + r * 0.3, y - r * 0.78);
      ctx.closePath();
      ctx.fill();
      break;
    case "cap":
      ctx.fillStyle = darker(col, 40);
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.35, y - r * 0.88, r * 0.7, r * 0.22, r * 0.07);
      ctx.fill();
      ctx.fillRect(cx + r * 0.2, y - r * 0.76, r * 0.22, r * 0.06);
      break;
    case "horn":
      ctx.fillStyle = trim;
      const wob = Math.sin(t * 2.5) * r * 0.02;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.3, y - r * 0.7);
      ctx.lineTo(cx - r * 0.45, y - r * 1.0 + wob);
      ctx.lineTo(cx - r * 0.18, y - r * 0.74);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.3, y - r * 0.7);
      ctx.lineTo(cx + r * 0.45, y - r * 1.0 - wob);
      ctx.lineTo(cx + r * 0.18, y - r * 0.74);
      ctx.closePath();
      ctx.fill();
      break;
  }
}

function drawFace(ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, mood: "smile" | "stern" | "focus") {
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(cx - r * 0.2, y - r * 0.14, r * 0.11, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.2, y - r * 0.14, r * 0.11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(cx - r * 0.2, y - r * 0.14, r * 0.06, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.2, y - r * 0.14, r * 0.06, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#222";
  ctx.lineWidth = r * 0.05;
  ctx.beginPath();
  if (mood === "smile") {
    ctx.arc(cx, y + r * 0.12, r * 0.18, 0.2, Math.PI - 0.2);
  } else if (mood === "stern") {
    ctx.moveTo(cx - r * 0.16, y + r * 0.16);
    ctx.lineTo(cx + r * 0.16, y + r * 0.16);
  } else {
    ctx.moveTo(cx - r * 0.16, y + r * 0.12);
    ctx.quadraticCurveTo(cx, y + r * 0.2, cx + r * 0.16, y + r * 0.12);
  }
  ctx.stroke();
}

function drawItem(ctx: CanvasRenderingContext2D, item: ItemKind, side: -1 | 1, cx: number, y: number, r: number, col: string, trim: string, t: number) {
  if (item === "none") return;
  const ax = cx + side * r * 0.86;
  const ay = y + r * 0.02;
  const dark = darker(col, 50);

  ctx.save();
  ctx.translate(ax, ay);
  if (side < 0) ctx.scale(-1, 1);

  switch (item) {
    case "spear":
      ctx.strokeStyle = dark;
      ctx.lineWidth = r * 0.09;
      ctx.beginPath();
      ctx.moveTo(-r * 0.05, r * 0.45);
      ctx.lineTo(r * 0.48, -r * 0.46);
      ctx.stroke();
      ctx.fillStyle = lighter(col, 64);
      ctx.beginPath();
      ctx.moveTo(r * 0.48, -r * 0.46);
      ctx.lineTo(r * 0.33, -r * 0.38);
      ctx.lineTo(r * 0.4, -r * 0.24);
      ctx.closePath();
      ctx.fill();
      break;
    case "shield":
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(-r * 0.04, -r * 0.35);
      ctx.lineTo(r * 0.36, -r * 0.2);
      ctx.lineTo(r * 0.34, r * 0.36);
      ctx.lineTo(r * 0.02, r * 0.42);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.arc(r * 0.16, r * 0.05, r * 0.08, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "hammer":
      ctx.strokeStyle = dark;
      ctx.lineWidth = r * 0.09;
      ctx.beginPath();
      ctx.moveTo(-r * 0.05, r * 0.4);
      ctx.lineTo(r * 0.32, -r * 0.32);
      ctx.stroke();
      ctx.fillStyle = trim;
      ctx.fillRect(r * 0.2, -r * 0.45, r * 0.27, r * 0.16);
      break;
    case "bow":
      ctx.strokeStyle = dark;
      ctx.lineWidth = r * 0.08;
      ctx.beginPath();
      ctx.arc(r * 0.12, -r * 0.04, r * 0.34, -1, 1);
      ctx.stroke();
      ctx.strokeStyle = lighter(col, 70);
      ctx.lineWidth = r * 0.04;
      ctx.beginPath();
      ctx.moveTo(r * 0.3, -r * 0.34);
      ctx.lineTo(r * 0.3, r * 0.26);
      ctx.stroke();
      break;
    case "staff":
      ctx.strokeStyle = dark;
      ctx.lineWidth = r * 0.08;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.42);
      ctx.lineTo(r * 0.22, -r * 0.44);
      ctx.stroke();
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.arc(r * 0.24, -r * 0.5, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "gear":
      ctx.strokeStyle = dark;
      ctx.lineWidth = r * 0.06;
      ctx.beginPath();
      ctx.arc(r * 0.18, -r * 0.08, r * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 1.6;
        ctx.beginPath();
        ctx.moveTo(r * 0.18 + Math.cos(a) * r * 0.2, -r * 0.08 + Math.sin(a) * r * 0.2);
        ctx.lineTo(r * 0.18 + Math.cos(a) * r * 0.28, -r * 0.08 + Math.sin(a) * r * 0.28);
        ctx.stroke();
      }
      break;
    case "orb":
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.arc(r * 0.2, -r * 0.08, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "torch":
      ctx.strokeStyle = dark;
      ctx.lineWidth = r * 0.08;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.38);
      ctx.lineTo(r * 0.22, -r * 0.2);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,180,70,${0.6 + Math.abs(Math.sin(t * 5)) * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(r * 0.18, -r * 0.28);
      ctx.quadraticCurveTo(r * 0.32, -r * 0.5, r * 0.4, -r * 0.24);
      ctx.closePath();
      ctx.fill();
      break;
    case "blade":
      ctx.strokeStyle = dark;
      ctx.lineWidth = r * 0.08;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.35);
      ctx.lineTo(r * 0.36, -r * 0.34);
      ctx.stroke();
      break;
    case "book":
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.roundRect(-r * 0.02, -r * 0.28, r * 0.34, r * 0.26, r * 0.06);
      ctx.fill();
      ctx.fillStyle = trim;
      ctx.fillRect(r * 0.24, -r * 0.28, r * 0.05, r * 0.26);
      break;
    case "brush":
      ctx.strokeStyle = dark;
      ctx.lineWidth = r * 0.08;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.4);
      ctx.lineTo(r * 0.3, -r * 0.18);
      ctx.stroke();
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.moveTo(r * 0.3, -r * 0.18);
      ctx.lineTo(r * 0.42, -r * 0.26);
      ctx.lineTo(r * 0.34, -r * 0.02);
      ctx.closePath();
      ctx.fill();
      break;
    case "propeller":
      ctx.strokeStyle = dark;
      ctx.lineWidth = r * 0.06;
      ctx.beginPath();
      ctx.moveTo(r * 0.14, -r * 0.02);
      ctx.lineTo(r * 0.14, -r * 0.35);
      ctx.stroke();
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.ellipse(r * 0.14, -r * 0.36, r * 0.2, r * 0.06, Math.sin(t * 18) * 0.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "drum":
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.roundRect(-r * 0.02, -r * 0.08, r * 0.32, r * 0.22, r * 0.06);
      ctx.fill();
      ctx.fillStyle = trim;
      ctx.fillRect(-r * 0.01, -r * 0.04, r * 0.3, r * 0.04);
      break;
    case "horn":
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r * 0.34, -r * 0.14);
      ctx.lineTo(r * 0.34, r * 0.12);
      ctx.closePath();
      ctx.fill();
      break;
    case "baton":
      ctx.strokeStyle = dark;
      ctx.lineWidth = r * 0.08;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.35);
      ctx.lineTo(r * 0.3, -r * 0.22);
      ctx.stroke();
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.arc(r * 0.33, -r * 0.26, r * 0.06, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "racket":
      ctx.strokeStyle = dark;
      ctx.lineWidth = r * 0.07;
      ctx.beginPath();
      ctx.ellipse(r * 0.2, -r * 0.1, r * 0.17, r * 0.23, -0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(r * 0.12, r * 0.2);
      ctx.lineTo(r * 0.24, -r * 0.3);
      ctx.stroke();
      break;
    case "ball":
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.arc(r * 0.2, -r * 0.08, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "whistle":
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.roundRect(r * 0.02, -r * 0.1, r * 0.2, r * 0.12, r * 0.04);
      ctx.fill();
      break;
    case "cannon":
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.roundRect(-r * 0.02, -r * 0.14, r * 0.36, r * 0.18, r * 0.06);
      ctx.fill();
      ctx.fillStyle = trim;
      ctx.fillRect(r * 0.28, -r * 0.09, r * 0.14, r * 0.08);
      break;
    case "wing":
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.ellipse(r * 0.16, -r * 0.05, r * 0.24, r * 0.1, -0.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "crystal":
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.moveTo(r * 0.14, -r * 0.35);
      ctx.lineTo(r * 0.31, -r * 0.09);
      ctx.lineTo(r * 0.15, r * 0.13);
      ctx.lineTo(-r * 0.02, -r * 0.1);
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.restore();
}

function drawUnit(style: StyleConfig): DrawFn {
  return (ctx, cx, cy, r, col, t, ph) => {
    drawShadow(ctx, cx, cy, r, style.body === "hover" ? 1.15 : 1);
    drawAura(ctx, style.aura, cx, cy, r, style.trim, t);
    const y = drawBody(ctx, style.body, cx, cy, r, col, style.trim, t, ph);
    drawHead(ctx, style.head, cx, y, r, col, style.trim, t);
    drawItem(ctx, style.left, -1, cx, y, r, col, style.trim, t);
    drawItem(ctx, style.right, 1, cx, y, r, col, style.trim, t);
    const mood: "smile" | "stern" | "focus" = style.body === "bard" ? "smile" : style.body === "knight" ? "stern" : "focus";
    drawFace(ctx, cx, y, r, mood);
  };
}

const STYLES: StyleConfig[] = [
  { id: "notebook", body: "book", head: "cap", left: "shield", right: "book", aura: "grid", trim: "#94a3b8" },
  { id: "protractor", body: "athlete", head: "cap", left: "bow", right: "spear", aura: "grid", trim: "#67e8f9" },
  { id: "battery", body: "mech", head: "visor", left: "orb", right: "cannon", aura: "spark", trim: "#bef264" },
  { id: "graphpaper", body: "mage", head: "hood", left: "cannon", right: "spear", aura: "grid", trim: "#c4b5fd" },
  { id: "paintbrush", body: "mage", head: "hood", left: "book", right: "brush", aura: "flame", trim: "#f9a8d4" },
  { id: "drone", body: "hover", head: "none", left: "propeller", right: "propeller", aura: "wind", trim: "#7dd3fc" },

  { id: "eng_01", body: "mech", head: "visor", left: "blade", right: "gear", aura: "spark", trim: "#cbd5e1" },
  { id: "eng_02", body: "mech", head: "helm", left: "shield", right: "none", aura: "none", trim: "#94a3b8" },
  { id: "eng_03", body: "mech", head: "visor", left: "none", right: "cannon", aura: "grid", trim: "#67e8f9" },
  { id: "eng_04", body: "mech", head: "helm", left: "hammer", right: "shield", aura: "none", trim: "#e2e8f0" },
  { id: "eng_05", body: "mech", head: "cap", left: "blade", right: "wing", aura: "wind", trim: "#a5f3fc" },
  { id: "eng_06", body: "mage", head: "hood", left: "staff", right: "orb", aura: "spark", trim: "#bae6fd" },
  { id: "eng_07", body: "mech", head: "horn", left: "shield", right: "hammer", aura: "none", trim: "#e2e8f0" },
  { id: "eng_08", body: "mech", head: "helm", left: "hammer", right: "crystal", aura: "flame", trim: "#fde68a" },
  { id: "eng_09", body: "hover", head: "visor", left: "cannon", right: "staff", aura: "ice", trim: "#bfdbfe" },
  { id: "eng_10", body: "hover", head: "none", left: "propeller", right: "propeller", aura: "spark", trim: "#bae6fd" },

  { id: "nat_01", body: "beast", head: "leaf", left: "none", right: "blade", aura: "leaf", trim: "#bbf7d0" },
  { id: "nat_02", body: "beast", head: "horn", left: "shield", right: "none", aura: "none", trim: "#d9f99d" },
  { id: "nat_03", body: "beast", head: "leaf", left: "bow", right: "none", aura: "leaf", trim: "#dcfce7" },
  { id: "nat_04", body: "beast", head: "horn", left: "blade", right: "spear", aura: "wind", trim: "#bbf7d0" },
  { id: "nat_05", body: "beast", head: "leaf", left: "shield", right: "hammer", aura: "none", trim: "#ecfccb" },
  { id: "nat_06", body: "mage", head: "leaf", left: "staff", right: "orb", aura: "leaf", trim: "#bbf7d0" },
  { id: "nat_07", body: "beast", head: "crown", left: "shield", right: "spear", aura: "leaf", trim: "#dcfce7" },
  { id: "nat_08", body: "beast", head: "horn", left: "hammer", right: "torch", aura: "flame", trim: "#fef9c3" },
  { id: "nat_09", body: "beast", head: "leaf", left: "crystal", right: "bow", aura: "ice", trim: "#dcfce7" },
  { id: "nat_10", body: "beast", head: "none", left: "wing", right: "wing", aura: "wind", trim: "#bbf7d0" },

  { id: "his_01", body: "knight", head: "helm", left: "shield", right: "spear", aura: "none", trim: "#fde68a" },
  { id: "his_02", body: "knight", head: "helm", left: "shield", right: "none", aura: "none", trim: "#e7e5e4" },
  { id: "his_03", body: "knight", head: "crown", left: "spear", right: "blade", aura: "wind", trim: "#fde68a" },
  { id: "his_04", body: "knight", head: "cap", left: "bow", right: "none", aura: "none", trim: "#fef3c7" },
  { id: "his_05", body: "knight", head: "helm", left: "shield", right: "hammer", aura: "none", trim: "#e7e5e4" },
  { id: "his_06", body: "knight", head: "hood", left: "torch", right: "staff", aura: "flame", trim: "#fed7aa" },
  { id: "his_07", body: "knight", head: "horn", left: "hammer", right: "shield", aura: "none", trim: "#fde68a" },
  { id: "his_08", body: "knight", head: "cap", left: "drum", right: "baton", aura: "music", trim: "#fdba74" },
  { id: "his_09", body: "knight", head: "crown", left: "bow", right: "crystal", aura: "spark", trim: "#fde68a" },
  { id: "his_10", body: "knight", head: "horn", left: "orb", right: "blade", aura: "ice", trim: "#fef3c7" },

  { id: "mus_01", body: "bard", head: "cap", left: "baton", right: "none", aura: "music", trim: "#e9d5ff" },
  { id: "mus_02", body: "bard", head: "helm", left: "shield", right: "drum", aura: "music", trim: "#ddd6fe" },
  { id: "mus_03", body: "bard", head: "cap", left: "horn", right: "none", aura: "music", trim: "#f3e8ff" },
  { id: "mus_04", body: "bard", head: "hood", left: "bow", right: "none", aura: "music", trim: "#e9d5ff" },
  { id: "mus_05", body: "bard", head: "cap", left: "none", right: "drum", aura: "music", trim: "#ddd6fe" },
  { id: "mus_06", body: "bard", head: "hood", left: "staff", right: "orb", aura: "music", trim: "#f5d0fe" },
  { id: "mus_07", body: "bard", head: "helm", left: "shield", right: "baton", aura: "music", trim: "#e9d5ff" },
  { id: "mus_08", body: "bard", head: "cap", left: "none", right: "hammer", aura: "music", trim: "#f3e8ff" },
  { id: "mus_09", body: "bard", head: "crown", left: "bow", right: "horn", aura: "music", trim: "#ddd6fe" },
  { id: "mus_10", body: "bard", head: "crown", left: "baton", right: "staff", aura: "music", trim: "#f5d0fe" },

  { id: "spo_01", body: "athlete", head: "cap", left: "blade", right: "none", aura: "wind", trim: "#bfdbfe" },
  { id: "spo_02", body: "athlete", head: "cap", left: "shield", right: "none", aura: "none", trim: "#dbeafe" },
  { id: "spo_03", body: "athlete", head: "cap", left: "bow", right: "none", aura: "wind", trim: "#e0f2fe" },
  { id: "spo_04", body: "athlete", head: "cap", left: "racket", right: "ball", aura: "wind", trim: "#dbeafe" },
  { id: "spo_05", body: "athlete", head: "helm", left: "shield", right: "hammer", aura: "none", trim: "#bfdbfe" },
  { id: "spo_06", body: "athlete", head: "cap", left: "cannon", right: "none", aura: "wind", trim: "#e0f2fe" },
  { id: "spo_07", body: "athlete", head: "crown", left: "shield", right: "baton", aura: "none", trim: "#dbeafe" },
  { id: "spo_08", body: "athlete", head: "cap", left: "hammer", right: "whistle", aura: "wind", trim: "#bfdbfe" },
  { id: "spo_09", body: "athlete", head: "crown", left: "bow", right: "crystal", aura: "spark", trim: "#e0f2fe" },
  { id: "spo_10", body: "athlete", head: "cap", left: "wing", right: "wing", aura: "wind", trim: "#dbeafe" },
];

export const EXPANSION_RENDERERS: Record<string, DrawFn> = Object.fromEntries(
  STYLES.map((style) => [style.id, drawUnit(style)]),
);
