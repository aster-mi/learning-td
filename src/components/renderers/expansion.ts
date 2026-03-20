type DrawFn = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  col: string,
  t: number,
  ph: number,
) => void;

type Model = "mech" | "hover" | "beast" | "knight" | "instrument" | "athlete" | "mage" | "book";
type Gear = "none" | "spear" | "shield" | "hammer" | "bow" | "staff" | "blade" | "gear" | "orb" | "torch" | "propeller" | "drum" | "horn" | "baton" | "racket" | "ball" | "whistle" | "cannon" | "brush" | "book";
type Aura = "none" | "spark" | "wind" | "leaf" | "flame" | "ice" | "music" | "grid";
type Face = "none" | "smile" | "stern" | "focus";

interface Design {
  id: string;
  model: Model;
  face: Face;
  left: Gear;
  right: Gear;
  aura: Aura;
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

function drawShadow(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, wide = 1) {
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.95, r * 0.95 * wide, r * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawAura(ctx: CanvasRenderingContext2D, aura: Aura, cx: number, cy: number, r: number, trim: string, t: number) {
  if (aura === "none") return;
  const pulse = 0.4 + 0.6 * Math.sin(t * 3.1);
  ctx.save();
  switch (aura) {
    case "spark":
      ctx.strokeStyle = `rgba(255,255,255,${0.24 + pulse * 0.26})`;
      ctx.lineWidth = r * 0.05;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + t * 1.4;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r * 0.62, cy + Math.sin(a) * r * 0.44);
        ctx.lineTo(cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.68);
        ctx.stroke();
      }
      break;
    case "wind":
      ctx.strokeStyle = `rgba(210,240,255,${0.2 + pulse * 0.3})`;
      ctx.lineWidth = r * 0.06;
      for (let i = 0; i < 2; i++) {
        const yy = cy - r * 0.2 + i * r * 0.26;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.95, yy);
        ctx.quadraticCurveTo(cx - r * 0.1, yy - r * 0.22, cx + r * 0.72, yy + r * 0.06);
        ctx.stroke();
      }
      break;
    case "leaf":
      ctx.fillStyle = `rgba(220,255,220,${0.16 + pulse * 0.24})`;
      for (let i = 0; i < 3; i++) {
        const a = t * 1.6 + i * 2.1;
        const x = cx + Math.cos(a) * r * 0.78;
        const y = cy + Math.sin(a) * r * 0.54;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 0.12, r * 0.07, a, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case "flame":
      ctx.fillStyle = `rgba(255,170,70,${0.16 + pulse * 0.22})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy - r * 0.1, r * 1.08, r * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "ice":
      ctx.strokeStyle = `rgba(180,240,255,${0.2 + pulse * 0.25})`;
      ctx.lineWidth = r * 0.05;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + t * 0.7;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * r * 0.88, cy + Math.sin(a) * r * 0.62);
        ctx.stroke();
      }
      break;
    case "music":
      ctx.fillStyle = `rgba(255,255,255,${0.2 + pulse * 0.24})`;
      for (let i = 0; i < 3; i++) {
        const a = t * 1.9 + i * 2;
        const x = cx + Math.sin(a) * r * 0.82;
        const y = cy - r * 0.56 - i * r * 0.08;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.07, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x + r * 0.05, y - r * 0.2, r * 0.04, r * 0.2);
      }
      break;
    case "grid":
      ctx.strokeStyle = `rgba(220,220,255,${0.15 + pulse * 0.18})`;
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
        ctx.moveTo(cx - r * 0.86, y);
        ctx.lineTo(cx + r * 0.86, y);
        ctx.stroke();
      }
      break;
    default:
      ctx.strokeStyle = trim;
  }
  ctx.restore();
}

function drawLegs(ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, col: string, ph: number) {
  const leg = Math.sin(ph * Math.PI * 2) * r * 0.18;
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = r * 0.16;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.25, y + r * 0.66);
  ctx.lineTo(cx - r * 0.25 + leg, y + r * 1.02);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.25, y + r * 0.66);
  ctx.lineTo(cx + r * 0.25 - leg, y + r * 1.02);
  ctx.stroke();
}

function drawModel(ctx: CanvasRenderingContext2D, model: Model, cx: number, cy: number, r: number, col: string, trim: string, t: number, ph: number) {
  const bob = Math.sin(t * 3 + ph * 1.8) * r * 0.05;
  const y = cy - bob;
  const grad = ctx.createLinearGradient(cx - r, y - r, cx + r, y + r);
  grad.addColorStop(0, lighter(col, 24));
  grad.addColorStop(0.58, col);
  grad.addColorStop(1, darker(col, 24));
  ctx.fillStyle = grad;

  switch (model) {
    case "mech":
      drawShadow(ctx, cx, cy, r);
      drawLegs(ctx, cx, y, r, col, ph);
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.9, y - r * 0.62, r * 1.8, r * 1.3, r * 0.16);
      ctx.fill();
      ctx.fillStyle = darker(col, 40);
      for (let i = 0; i < 3; i++) {
        const bx = cx - r * 0.52 + i * r * 0.52;
        ctx.beginPath();
        ctx.arc(bx, y - r * 0.14, r * 0.07, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case "hover":
      drawShadow(ctx, cx, cy, r, 1.18);
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.88, y - r * 0.54, r * 1.76, r * 1.0, r * 0.3);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,0.24)`;
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.24, y - r * 0.08, r * 0.18, r * 0.12, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + r * 0.24, y - r * 0.08, r * 0.18, r * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "beast":
      drawShadow(ctx, cx, cy, r, 1.08);
      drawLegs(ctx, cx, y + r * 0.05, r, col, ph);
      ctx.beginPath();
      ctx.ellipse(cx, y + r * 0.06, r * 0.96, r * 0.66, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + r * 0.62, y - r * 0.16, r * 0.33, r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "knight":
      drawShadow(ctx, cx, cy, r);
      drawLegs(ctx, cx, y, r, col, ph);
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.78, y - r * 0.66, r * 1.56, r * 1.38, r * 0.2);
      ctx.fill();
      ctx.fillStyle = trim;
      ctx.fillRect(cx - r * 0.12, y - r * 0.58, r * 0.24, r * 1.16);
      break;
    case "instrument":
      drawShadow(ctx, cx, cy, r, 1.02);
      drawLegs(ctx, cx, y, r, col, ph);
      ctx.beginPath();
      ctx.ellipse(cx, y + r * 0.02, r * 0.9, r * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,0.15)`;
      ctx.fillRect(cx - r * 0.66, y + r * 0.36, r * 1.32, r * 0.14);
      break;
    case "athlete":
      drawShadow(ctx, cx, cy, r);
      drawLegs(ctx, cx, y, r, col, ph);
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.7, y - r * 0.6, r * 1.4, r * 1.26, r * 0.24);
      ctx.fill();
      ctx.strokeStyle = lighter(col, 54);
      ctx.lineWidth = r * 0.06;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.44, y - r * 0.54);
      ctx.lineTo(cx - r * 0.44, y + r * 0.58);
      ctx.moveTo(cx + r * 0.02, y - r * 0.54);
      ctx.lineTo(cx + r * 0.02, y + r * 0.58);
      ctx.stroke();
      break;
    case "mage":
      drawShadow(ctx, cx, cy, r);
      drawLegs(ctx, cx, y, r, col, ph);
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.78, y + r * 0.62);
      ctx.quadraticCurveTo(cx - r * 0.96, y - r * 0.3, cx - r * 0.34, y - r * 0.7);
      ctx.lineTo(cx + r * 0.44, y - r * 0.7);
      ctx.quadraticCurveTo(cx + r, y - r * 0.3, cx + r * 0.78, y + r * 0.62);
      ctx.closePath();
      ctx.fill();
      break;
    case "book":
      drawShadow(ctx, cx, cy, r);
      drawLegs(ctx, cx, y, r, col, ph);
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.9, y - r * 0.66, r * 1.8, r * 1.34, r * 0.14);
      ctx.fill();
      ctx.fillStyle = trim;
      ctx.fillRect(cx + r * 0.7, y - r * 0.64, r * 0.14, r * 1.28);
      ctx.fillStyle = lighter(col, 56);
      ctx.fillRect(cx - r * 0.72, y - r * 0.38, r * 1.14, r * 0.18);
      break;
  }
  return y;
}

function drawFace(ctx: CanvasRenderingContext2D, face: Face, cx: number, y: number, r: number) {
  if (face === "none") return;
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
  if (face === "smile") {
    ctx.arc(cx, y + r * 0.12, r * 0.18, 0.2, Math.PI - 0.2);
  } else if (face === "stern") {
    ctx.moveTo(cx - r * 0.16, y + r * 0.16);
    ctx.lineTo(cx + r * 0.16, y + r * 0.16);
  } else {
    ctx.moveTo(cx - r * 0.16, y + r * 0.12);
    ctx.quadraticCurveTo(cx, y + r * 0.2, cx + r * 0.16, y + r * 0.12);
  }
  ctx.stroke();
}

function drawGear(ctx: CanvasRenderingContext2D, gear: Gear, side: -1 | 1, cx: number, y: number, r: number, col: string, trim: string, t: number) {
  if (gear === "none") return;
  const ax = cx + side * r * 0.82;
  const ay = y + r * 0.03;
  const dark = darker(col, 52);
  ctx.save();
  ctx.translate(ax, ay);
  if (side < 0) ctx.scale(-1, 1);
  switch (gear) {
    case "spear":
      ctx.strokeStyle = dark; ctx.lineWidth = r * 0.09;
      ctx.beginPath(); ctx.moveTo(-r * 0.04, r * 0.42); ctx.lineTo(r * 0.5, -r * 0.46); ctx.stroke();
      ctx.fillStyle = lighter(col, 64);
      ctx.beginPath(); ctx.moveTo(r * 0.5, -r * 0.46); ctx.lineTo(r * 0.34, -r * 0.38); ctx.lineTo(r * 0.42, -r * 0.24); ctx.closePath(); ctx.fill();
      break;
    case "shield":
      ctx.fillStyle = dark;
      ctx.beginPath(); ctx.moveTo(-r * 0.02, -r * 0.36); ctx.lineTo(r * 0.36, -r * 0.22); ctx.lineTo(r * 0.34, r * 0.36); ctx.lineTo(r * 0.02, r * 0.42); ctx.closePath(); ctx.fill();
      ctx.fillStyle = trim; ctx.beginPath(); ctx.arc(r * 0.16, r * 0.05, r * 0.08, 0, Math.PI * 2); ctx.fill();
      break;
    case "hammer":
      ctx.strokeStyle = dark; ctx.lineWidth = r * 0.09;
      ctx.beginPath(); ctx.moveTo(-r * 0.03, r * 0.4); ctx.lineTo(r * 0.34, -r * 0.32); ctx.stroke();
      ctx.fillStyle = trim; ctx.fillRect(r * 0.22, -r * 0.44, r * 0.28, r * 0.16);
      break;
    case "bow":
      ctx.strokeStyle = dark; ctx.lineWidth = r * 0.08;
      ctx.beginPath(); ctx.arc(r * 0.14, -r * 0.02, r * 0.34, -1, 1); ctx.stroke();
      ctx.strokeStyle = lighter(col, 72); ctx.lineWidth = r * 0.04;
      ctx.beginPath(); ctx.moveTo(r * 0.31, -r * 0.34); ctx.lineTo(r * 0.31, r * 0.27); ctx.stroke();
      break;
    case "staff":
      ctx.strokeStyle = dark; ctx.lineWidth = r * 0.08;
      ctx.beginPath(); ctx.moveTo(0, r * 0.42); ctx.lineTo(r * 0.22, -r * 0.44); ctx.stroke();
      ctx.fillStyle = trim; ctx.beginPath(); ctx.arc(r * 0.24, -r * 0.5, r * 0.12, 0, Math.PI * 2); ctx.fill();
      break;
    case "blade":
      ctx.strokeStyle = dark; ctx.lineWidth = r * 0.08;
      ctx.beginPath(); ctx.moveTo(0, r * 0.35); ctx.lineTo(r * 0.36, -r * 0.34); ctx.stroke();
      break;
    case "gear":
      ctx.strokeStyle = dark; ctx.lineWidth = r * 0.06;
      ctx.beginPath(); ctx.arc(r * 0.18, -r * 0.08, r * 0.2, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 1.5;
        ctx.beginPath();
        ctx.moveTo(r * 0.18 + Math.cos(a) * r * 0.2, -r * 0.08 + Math.sin(a) * r * 0.2);
        ctx.lineTo(r * 0.18 + Math.cos(a) * r * 0.28, -r * 0.08 + Math.sin(a) * r * 0.28);
        ctx.stroke();
      }
      break;
    case "orb":
      ctx.fillStyle = trim; ctx.beginPath(); ctx.arc(r * 0.2, -r * 0.08, r * 0.16, 0, Math.PI * 2); ctx.fill();
      break;
    case "torch":
      ctx.strokeStyle = dark; ctx.lineWidth = r * 0.08;
      ctx.beginPath(); ctx.moveTo(0, r * 0.38); ctx.lineTo(r * 0.22, -r * 0.2); ctx.stroke();
      ctx.fillStyle = `rgba(255,180,70,${0.58 + Math.abs(Math.sin(t * 5)) * 0.3})`;
      ctx.beginPath(); ctx.moveTo(r * 0.18, -r * 0.28); ctx.quadraticCurveTo(r * 0.33, -r * 0.52, r * 0.41, -r * 0.24); ctx.closePath(); ctx.fill();
      break;
    case "propeller":
      ctx.strokeStyle = dark; ctx.lineWidth = r * 0.06;
      ctx.beginPath(); ctx.moveTo(r * 0.14, -r * 0.02); ctx.lineTo(r * 0.14, -r * 0.35); ctx.stroke();
      ctx.fillStyle = trim; ctx.beginPath(); ctx.ellipse(r * 0.14, -r * 0.36, r * 0.2, r * 0.06, Math.sin(t * 18) * 0.5, 0, Math.PI * 2); ctx.fill();
      break;
    case "drum":
      ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(-r * 0.02, -r * 0.08, r * 0.32, r * 0.22, r * 0.06); ctx.fill();
      ctx.fillStyle = trim; ctx.fillRect(-r * 0.01, -r * 0.04, r * 0.3, r * 0.04);
      break;
    case "horn":
      ctx.fillStyle = trim;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r * 0.34, -r * 0.14); ctx.lineTo(r * 0.34, r * 0.12); ctx.closePath(); ctx.fill();
      break;
    case "baton":
      ctx.strokeStyle = dark; ctx.lineWidth = r * 0.08;
      ctx.beginPath(); ctx.moveTo(0, r * 0.35); ctx.lineTo(r * 0.3, -r * 0.22); ctx.stroke();
      ctx.fillStyle = trim; ctx.beginPath(); ctx.arc(r * 0.33, -r * 0.26, r * 0.06, 0, Math.PI * 2); ctx.fill();
      break;
    case "racket":
      ctx.strokeStyle = dark; ctx.lineWidth = r * 0.07;
      ctx.beginPath(); ctx.ellipse(r * 0.2, -r * 0.1, r * 0.17, r * 0.23, -0.3, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r * 0.12, r * 0.2); ctx.lineTo(r * 0.24, -r * 0.3); ctx.stroke();
      break;
    case "ball":
      ctx.fillStyle = trim; ctx.beginPath(); ctx.arc(r * 0.2, -r * 0.08, r * 0.12, 0, Math.PI * 2); ctx.fill();
      break;
    case "whistle":
      ctx.fillStyle = trim; ctx.beginPath(); ctx.roundRect(r * 0.02, -r * 0.1, r * 0.2, r * 0.12, r * 0.04); ctx.fill();
      break;
    case "cannon":
      ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(-r * 0.02, -r * 0.14, r * 0.36, r * 0.18, r * 0.06); ctx.fill();
      ctx.fillStyle = trim; ctx.fillRect(r * 0.28, -r * 0.09, r * 0.14, r * 0.08);
      break;
    case "brush":
      ctx.strokeStyle = dark; ctx.lineWidth = r * 0.08;
      ctx.beginPath(); ctx.moveTo(0, r * 0.4); ctx.lineTo(r * 0.3, -r * 0.18); ctx.stroke();
      ctx.fillStyle = trim; ctx.beginPath(); ctx.moveTo(r * 0.3, -r * 0.18); ctx.lineTo(r * 0.42, -r * 0.26); ctx.lineTo(r * 0.34, -r * 0.02); ctx.closePath(); ctx.fill();
      break;
    case "book":
      ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(-r * 0.02, -r * 0.28, r * 0.34, r * 0.26, r * 0.06); ctx.fill();
      ctx.fillStyle = trim; ctx.fillRect(r * 0.24, -r * 0.28, r * 0.05, r * 0.26);
      break;
    default:
      ctx.fillStyle = trim;
  }
  ctx.restore();
}

function drawUnit(design: Design): DrawFn {
  return (ctx, cx, cy, r, col, t, ph) => {
    drawAura(ctx, design.aura, cx, cy, r, design.trim, t);
    const y = drawModel(ctx, design.model, cx, cy, r, col, design.trim, t, ph);
    drawGear(ctx, design.left, -1, cx, y, r, col, design.trim, t);
    drawGear(ctx, design.right, 1, cx, y, r, col, design.trim, t);
    drawFace(ctx, design.face, cx, y, r);
  };
}

const DESIGNS: Design[] = [
  { id: "notebook", model: "book", face: "focus", left: "shield", right: "book", aura: "grid", trim: "#cbd5e1" },
  { id: "protractor", model: "athlete", face: "focus", left: "bow", right: "spear", aura: "grid", trim: "#67e8f9" },
  { id: "battery", model: "mech", face: "stern", left: "orb", right: "cannon", aura: "spark", trim: "#bef264" },
  { id: "graphpaper", model: "mage", face: "focus", left: "cannon", right: "spear", aura: "grid", trim: "#c4b5fd" },
  { id: "paintbrush", model: "mage", face: "smile", left: "book", right: "brush", aura: "flame", trim: "#f9a8d4" },
  { id: "drone", model: "hover", face: "none", left: "propeller", right: "propeller", aura: "wind", trim: "#7dd3fc" },

  { id: "eng_01", model: "mech", face: "focus", left: "blade", right: "gear", aura: "spark", trim: "#cbd5e1" },
  { id: "eng_02", model: "mech", face: "stern", left: "shield", right: "none", aura: "none", trim: "#94a3b8" },
  { id: "eng_03", model: "mech", face: "focus", left: "none", right: "cannon", aura: "grid", trim: "#67e8f9" },
  { id: "eng_04", model: "mech", face: "stern", left: "hammer", right: "shield", aura: "none", trim: "#e2e8f0" },
  { id: "eng_05", model: "mech", face: "focus", left: "blade", right: "propeller", aura: "wind", trim: "#a5f3fc" },
  { id: "eng_06", model: "mage", face: "focus", left: "staff", right: "orb", aura: "spark", trim: "#bae6fd" },
  { id: "eng_07", model: "mech", face: "stern", left: "shield", right: "hammer", aura: "none", trim: "#e2e8f0" },
  { id: "eng_08", model: "mech", face: "focus", left: "hammer", right: "spear", aura: "flame", trim: "#fde68a" },
  { id: "eng_09", model: "hover", face: "none", left: "cannon", right: "staff", aura: "ice", trim: "#bfdbfe" },
  { id: "eng_10", model: "hover", face: "none", left: "propeller", right: "propeller", aura: "spark", trim: "#bae6fd" },

  { id: "nat_01", model: "beast", face: "smile", left: "none", right: "blade", aura: "leaf", trim: "#bbf7d0" },
  { id: "nat_02", model: "beast", face: "stern", left: "shield", right: "none", aura: "none", trim: "#d9f99d" },
  { id: "nat_03", model: "beast", face: "focus", left: "bow", right: "none", aura: "leaf", trim: "#dcfce7" },
  { id: "nat_04", model: "beast", face: "focus", left: "blade", right: "spear", aura: "wind", trim: "#bbf7d0" },
  { id: "nat_05", model: "beast", face: "stern", left: "shield", right: "hammer", aura: "none", trim: "#ecfccb" },
  { id: "nat_06", model: "mage", face: "focus", left: "staff", right: "orb", aura: "leaf", trim: "#bbf7d0" },
  { id: "nat_07", model: "beast", face: "stern", left: "shield", right: "spear", aura: "leaf", trim: "#dcfce7" },
  { id: "nat_08", model: "beast", face: "stern", left: "hammer", right: "torch", aura: "flame", trim: "#fef9c3" },
  { id: "nat_09", model: "beast", face: "focus", left: "staff", right: "bow", aura: "ice", trim: "#dcfce7" },
  { id: "nat_10", model: "beast", face: "none", left: "propeller", right: "propeller", aura: "wind", trim: "#bbf7d0" },

  { id: "his_01", model: "knight", face: "stern", left: "shield", right: "spear", aura: "none", trim: "#fde68a" },
  { id: "his_02", model: "knight", face: "stern", left: "shield", right: "none", aura: "none", trim: "#e7e5e4" },
  { id: "his_03", model: "knight", face: "focus", left: "spear", right: "blade", aura: "wind", trim: "#fde68a" },
  { id: "his_04", model: "knight", face: "focus", left: "bow", right: "none", aura: "none", trim: "#fef3c7" },
  { id: "his_05", model: "knight", face: "stern", left: "shield", right: "hammer", aura: "none", trim: "#e7e5e4" },
  { id: "his_06", model: "knight", face: "focus", left: "torch", right: "staff", aura: "flame", trim: "#fed7aa" },
  { id: "his_07", model: "knight", face: "stern", left: "hammer", right: "shield", aura: "none", trim: "#fde68a" },
  { id: "his_08", model: "knight", face: "smile", left: "drum", right: "baton", aura: "music", trim: "#fdba74" },
  { id: "his_09", model: "knight", face: "focus", left: "bow", right: "staff", aura: "spark", trim: "#fde68a" },
  { id: "his_10", model: "knight", face: "stern", left: "orb", right: "blade", aura: "ice", trim: "#fef3c7" },

  { id: "mus_01", model: "instrument", face: "smile", left: "baton", right: "none", aura: "music", trim: "#e9d5ff" },
  { id: "mus_02", model: "instrument", face: "stern", left: "shield", right: "drum", aura: "music", trim: "#ddd6fe" },
  { id: "mus_03", model: "instrument", face: "focus", left: "horn", right: "none", aura: "music", trim: "#f3e8ff" },
  { id: "mus_04", model: "instrument", face: "focus", left: "bow", right: "none", aura: "music", trim: "#e9d5ff" },
  { id: "mus_05", model: "instrument", face: "stern", left: "none", right: "drum", aura: "music", trim: "#ddd6fe" },
  { id: "mus_06", model: "instrument", face: "focus", left: "staff", right: "orb", aura: "music", trim: "#f5d0fe" },
  { id: "mus_07", model: "instrument", face: "stern", left: "shield", right: "baton", aura: "music", trim: "#e9d5ff" },
  { id: "mus_08", model: "instrument", face: "focus", left: "none", right: "hammer", aura: "music", trim: "#f3e8ff" },
  { id: "mus_09", model: "instrument", face: "focus", left: "bow", right: "horn", aura: "music", trim: "#ddd6fe" },
  { id: "mus_10", model: "instrument", face: "smile", left: "baton", right: "staff", aura: "music", trim: "#f5d0fe" },

  { id: "spo_01", model: "athlete", face: "focus", left: "blade", right: "none", aura: "wind", trim: "#bfdbfe" },
  { id: "spo_02", model: "athlete", face: "stern", left: "shield", right: "none", aura: "none", trim: "#dbeafe" },
  { id: "spo_03", model: "athlete", face: "focus", left: "bow", right: "none", aura: "wind", trim: "#e0f2fe" },
  { id: "spo_04", model: "athlete", face: "focus", left: "racket", right: "ball", aura: "wind", trim: "#dbeafe" },
  { id: "spo_05", model: "athlete", face: "stern", left: "shield", right: "hammer", aura: "none", trim: "#bfdbfe" },
  { id: "spo_06", model: "athlete", face: "focus", left: "cannon", right: "none", aura: "wind", trim: "#e0f2fe" },
  { id: "spo_07", model: "athlete", face: "stern", left: "shield", right: "baton", aura: "none", trim: "#dbeafe" },
  { id: "spo_08", model: "athlete", face: "focus", left: "hammer", right: "whistle", aura: "wind", trim: "#bfdbfe" },
  { id: "spo_09", model: "athlete", face: "focus", left: "bow", right: "staff", aura: "spark", trim: "#e0f2fe" },
  { id: "spo_10", model: "athlete", face: "none", left: "propeller", right: "propeller", aura: "wind", trim: "#dbeafe" },
];

export const EXPANSION_RENDERERS: Record<string, DrawFn> = Object.fromEntries(
  DESIGNS.map((d) => [d.id, drawUnit(d)]),
);

