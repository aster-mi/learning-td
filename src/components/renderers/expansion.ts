type DrawFn = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  col: string,
  t: number,
  ph: number,
) => void;

type Model =
  | "frame"
  | "hover"
  | "beast"
  | "knight"
  | "orb"
  | "runner"
  | "robe"
  | "book"
  | "turret"
  | "serpent"
  | "totem"
  | "golem"
  | "bird"
  | "samurai"
  | "chariot";

type Gear =
  | "none"
  | "spear"
  | "shield"
  | "hammer"
  | "bow"
  | "staff"
  | "blade"
  | "orb"
  | "torch"
  | "propeller"
  | "drum"
  | "horn"
  | "baton"
  | "racket"
  | "ball"
  | "whistle"
  | "cannon"
  | "brush"
  | "book";

type Aura = "none" | "spark" | "wind" | "leaf" | "flame" | "ice" | "music" | "grid";
type Face = "none" | "smile" | "stern" | "focus" | "visor";
type Head = "none" | "crown" | "horn" | "antenna" | "halo" | "crest" | "cap";
type Back = "none" | "pack" | "wings" | "banner" | "coil";
type Emblem =
  | "none"
  | "gear"
  | "bolt"
  | "wing"
  | "leaf"
  | "seed"
  | "crown"
  | "torch"
  | "drum"
  | "note"
  | "target"
  | "wave"
  | "grid";

interface Design {
  id: string;
  model: Model;
  face: Face;
  head: Head;
  back: Back;
  emblem: Emblem;
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
  ctx.ellipse(cx, cy + r * 0.94, r * 0.92 * wide, r * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawAura(ctx: CanvasRenderingContext2D, aura: Aura, cx: number, cy: number, r: number, t: number) {
  const pulse = 0.3 + 0.7 * Math.sin(t * 2.8);
  ctx.save();
  if (aura === "spark") {
    ctx.strokeStyle = `rgba(255,255,255,${0.22 + pulse * 0.2})`;
    ctx.lineWidth = r * 0.05;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + t * 1.1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r * 0.58, cy + Math.sin(a) * r * 0.43);
      ctx.lineTo(cx + Math.cos(a) * r * 0.88, cy + Math.sin(a) * r * 0.66);
      ctx.stroke();
    }
  } else if (aura === "wind") {
    ctx.strokeStyle = `rgba(200,235,255,${0.2 + pulse * 0.22})`;
    ctx.lineWidth = r * 0.06;
    for (let i = 0; i < 2; i++) {
      const yy = cy - r * 0.16 + i * r * 0.28;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.96, yy);
      ctx.quadraticCurveTo(cx - r * 0.2, yy - r * 0.22, cx + r * 0.74, yy + r * 0.05);
      ctx.stroke();
    }
  } else if (aura === "leaf") {
    ctx.fillStyle = `rgba(220,255,220,${0.16 + pulse * 0.2})`;
    for (let i = 0; i < 3; i++) {
      const a = t * 1.4 + i * 2.1;
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * r * 0.76, cy + Math.sin(a) * r * 0.52, r * 0.12, r * 0.07, a, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (aura === "flame") {
    ctx.fillStyle = `rgba(255,160,80,${0.12 + pulse * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(cx, cy - r * 0.12, r * 1.06, r * 0.78, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (aura === "ice") {
    ctx.strokeStyle = `rgba(180,240,255,${0.2 + pulse * 0.2})`;
    ctx.lineWidth = r * 0.045;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + t * 0.6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r * 0.86, cy + Math.sin(a) * r * 0.62);
      ctx.stroke();
    }
  } else if (aura === "music") {
    ctx.fillStyle = `rgba(255,255,255,${0.2 + pulse * 0.2})`;
    for (let i = 0; i < 3; i++) {
      const a = t * 1.8 + i * 2.1;
      const x = cx + Math.sin(a) * r * 0.8;
      const y = cy - r * 0.56 - i * r * 0.07;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x + r * 0.05, y - r * 0.2, r * 0.04, r * 0.2);
    }
  } else if (aura === "grid") {
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
  }
  ctx.restore();
}

function drawLegs(ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, col: string, ph: number) {
  const leg = Math.sin(ph * Math.PI * 2) * r * 0.18;
  ctx.strokeStyle = darker(col, 52);
  ctx.lineWidth = r * 0.15;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.24, y + r * 0.65);
  ctx.lineTo(cx - r * 0.24 + leg, y + r * 1.02);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.24, y + r * 0.65);
  ctx.lineTo(cx + r * 0.24 - leg, y + r * 1.02);
  ctx.stroke();
}

function drawBody(ctx: CanvasRenderingContext2D, model: Model, cx: number, y: number, r: number, col: string, trim: string, ph: number) {
  const grad = ctx.createLinearGradient(cx - r, y - r, cx + r, y + r);
  grad.addColorStop(0, lighter(col, 22));
  grad.addColorStop(0.58, col);
  grad.addColorStop(1, darker(col, 26));
  ctx.fillStyle = grad;

  if (model === "frame") {
    drawLegs(ctx, cx, y, r, col, ph);
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.88, y - r * 0.62, r * 1.76, r * 1.32, r * 0.16);
    ctx.fill();
  } else if (model === "hover") {
    drawShadow(ctx, cx, y + r * 0.03, r, 1.14);
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.9, y - r * 0.52, r * 1.8, r * 1.0, r * 0.33);
    ctx.fill();
  } else if (model === "beast") {
    drawLegs(ctx, cx, y + r * 0.06, r, col, ph);
    ctx.beginPath();
    ctx.ellipse(cx, y + r * 0.04, r * 0.96, r * 0.66, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.62, y - r * 0.17, r * 0.3, r * 0.27, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (model === "knight" || model === "samurai") {
    drawLegs(ctx, cx, y, r, col, ph);
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.74, y - r * 0.68, r * 1.48, r * 1.4, r * 0.2);
    ctx.fill();
    ctx.fillStyle = trim;
    if (model === "samurai") ctx.fillRect(cx - r * 0.42, y - r * 0.2, r * 0.84, r * 0.12);
    else ctx.fillRect(cx - r * 0.1, y - r * 0.56, r * 0.2, r * 1.14);
  } else if (model === "orb") {
    drawLegs(ctx, cx, y, r, col, ph);
    ctx.beginPath();
    ctx.ellipse(cx, y + r * 0.02, r * 0.86, r * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(cx - r * 0.22, y - r * 0.22, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
  } else if (model === "runner") {
    drawLegs(ctx, cx, y, r, col, ph + 0.15);
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.66, y - r * 0.56, r * 1.32, r * 1.22, r * 0.26);
    ctx.fill();
  } else if (model === "robe") {
    drawLegs(ctx, cx, y, r, col, ph);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.76, y + r * 0.62);
    ctx.quadraticCurveTo(cx - r * 0.96, y - r * 0.26, cx - r * 0.34, y - r * 0.72);
    ctx.lineTo(cx + r * 0.42, y - r * 0.72);
    ctx.quadraticCurveTo(cx + r, y - r * 0.26, cx + r * 0.78, y + r * 0.62);
    ctx.closePath();
    ctx.fill();
  } else if (model === "book" || model === "totem") {
    drawLegs(ctx, cx, y, r, col, ph);
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.9, y - r * 0.66, r * 1.8, r * 1.34, r * 0.12);
    ctx.fill();
    ctx.fillStyle = trim;
    ctx.fillRect(cx + r * 0.68, y - r * 0.64, r * 0.14, r * 1.28);
    if (model === "totem") ctx.fillRect(cx - r * 0.08, y - r * 0.64, r * 0.16, r * 1.28);
  } else if (model === "turret") {
    drawLegs(ctx, cx, y + r * 0.06, r, col, ph);
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.82, y - r * 0.44, r * 1.64, r * 1.06, r * 0.18);
    ctx.fill();
    ctx.fillStyle = trim;
    ctx.fillRect(cx - r * 0.16, y - r * 0.62, r * 0.32, r * 0.24);
  } else if (model === "serpent") {
    drawLegs(ctx, cx, y + r * 0.16, r, col, ph);
    ctx.strokeStyle = grad;
    ctx.lineWidth = r * 0.44;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.7, y + r * 0.3);
    ctx.quadraticCurveTo(cx - r * 0.2, y - r * 0.6, cx + r * 0.2, y - r * 0.12);
    ctx.quadraticCurveTo(cx + r * 0.5, y + r * 0.24, cx + r * 0.76, y - r * 0.26);
    ctx.stroke();
  } else if (model === "golem") {
    drawLegs(ctx, cx, y, r, col, ph);
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.95, y - r * 0.56, r * 1.9, r * 1.26, r * 0.09);
    ctx.fill();
    ctx.fillStyle = darker(col, 34);
    for (let i = 0; i < 3; i++) ctx.fillRect(cx - r * 0.72 + i * r * 0.48, y - r * 0.2, r * 0.22, r * 0.22);
  } else if (model === "bird") {
    drawLegs(ctx, cx, y + r * 0.1, r, col, ph);
    ctx.beginPath();
    ctx.ellipse(cx, y, r * 0.82, r * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = trim;
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.82, y - r * 0.03);
    ctx.lineTo(cx + r * 1.03, y - r * 0.12);
    ctx.lineTo(cx + r * 1.03, y + r * 0.06);
    ctx.closePath();
    ctx.fill();
  } else if (model === "chariot") {
    drawLegs(ctx, cx, y + r * 0.18, r, col, ph);
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.8, y - r * 0.5, r * 1.6, r * 1.0, r * 0.15);
    ctx.fill();
    ctx.strokeStyle = darker(col, 50);
    ctx.lineWidth = r * 0.08;
    ctx.beginPath();
    ctx.arc(cx - r * 0.42, y + r * 0.56, r * 0.16, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.42, y + r * 0.56, r * 0.16, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawFace(ctx: CanvasRenderingContext2D, face: Face, cx: number, y: number, r: number, trim: string) {
  if (face === "none") return;
  if (face === "visor") {
    ctx.fillStyle = "rgba(180,230,255,0.35)";
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.36, y - r * 0.28, r * 0.72, r * 0.2, r * 0.08);
    ctx.fill();
    return;
  }
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(cx - r * 0.2, y - r * 0.14, r * 0.1, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.2, y - r * 0.14, r * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(cx - r * 0.2, y - r * 0.14, r * 0.05, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.2, y - r * 0.14, r * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = face === "smile" ? trim : "#1f2937";
  ctx.lineWidth = r * 0.045;
  ctx.beginPath();
  if (face === "smile") ctx.arc(cx, y + r * 0.12, r * 0.17, 0.2, Math.PI - 0.2);
  else if (face === "stern") {
    ctx.moveTo(cx - r * 0.15, y + r * 0.15);
    ctx.lineTo(cx + r * 0.15, y + r * 0.15);
  } else {
    ctx.moveTo(cx - r * 0.15, y + r * 0.12);
    ctx.quadraticCurveTo(cx, y + r * 0.2, cx + r * 0.15, y + r * 0.12);
  }
  ctx.stroke();
}

function drawHead(ctx: CanvasRenderingContext2D, head: Head, cx: number, y: number, r: number, trim: string, t: number) {
  ctx.fillStyle = trim;
  if (head === "crown") {
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.3, y - r * 0.62);
    ctx.lineTo(cx - r * 0.18, y - r * 0.82);
    ctx.lineTo(cx, y - r * 0.66);
    ctx.lineTo(cx + r * 0.18, y - r * 0.82);
    ctx.lineTo(cx + r * 0.3, y - r * 0.62);
    ctx.closePath();
    ctx.fill();
  } else if (head === "horn") {
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.34, y - r * 0.62, r * 0.11, r * 0.21, -0.4, 0, Math.PI * 2);
    ctx.ellipse(cx + r * 0.34, y - r * 0.62, r * 0.11, r * 0.21, 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (head === "antenna") {
    ctx.strokeStyle = trim;
    ctx.lineWidth = r * 0.05;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.12, y - r * 0.56);
    ctx.lineTo(cx - r * 0.18, y - r * 0.84);
    ctx.moveTo(cx + r * 0.12, y - r * 0.56);
    ctx.lineTo(cx + r * 0.18, y - r * 0.84);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - r * 0.18, y - r * 0.86, r * 0.05, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.18, y - r * 0.86, r * 0.05, 0, Math.PI * 2);
    ctx.fill();
  } else if (head === "halo") {
    ctx.strokeStyle = trim;
    ctx.lineWidth = r * 0.05;
    ctx.beginPath();
    ctx.ellipse(cx, y - r * 0.76 + Math.sin(t * 3) * r * 0.02, r * 0.28, r * 0.08, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (head === "crest") {
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.08, y - r * 0.58);
    ctx.lineTo(cx, y - r * 0.9);
    ctx.lineTo(cx + r * 0.08, y - r * 0.58);
    ctx.closePath();
    ctx.fill();
  } else if (head === "cap") {
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.34, y - r * 0.66, r * 0.68, r * 0.16, r * 0.08);
    ctx.fill();
  }
}

function drawBack(ctx: CanvasRenderingContext2D, back: Back, cx: number, y: number, r: number, trim: string, t: number) {
  if (back === "pack") {
    ctx.fillStyle = trim;
    ctx.fillRect(cx - r * 0.52, y - r * 0.22, r * 0.16, r * 0.44);
    ctx.fillRect(cx + r * 0.36, y - r * 0.22, r * 0.16, r * 0.44);
  } else if (back === "wings") {
    ctx.fillStyle = trim;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.58, y - r * 0.18);
    ctx.quadraticCurveTo(cx - r * 0.98, y - r * 0.04, cx - r * 0.56, y + r * 0.24);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.58, y - r * 0.18);
    ctx.quadraticCurveTo(cx + r * 0.98, y - r * 0.04, cx + r * 0.56, y + r * 0.24);
    ctx.closePath();
    ctx.fill();
  } else if (back === "banner") {
    ctx.fillStyle = trim;
    ctx.fillRect(cx + r * 0.36, y - r * 0.56, r * 0.08, r * 0.86);
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.44, y - r * 0.56);
    ctx.lineTo(cx + r * 0.68, y - r * 0.44 + Math.sin(t * 4) * r * 0.05);
    ctx.lineTo(cx + r * 0.44, y - r * 0.32);
    ctx.closePath();
    ctx.fill();
  } else if (back === "coil") {
    ctx.strokeStyle = trim;
    ctx.lineWidth = r * 0.06;
    ctx.beginPath();
    ctx.arc(cx - r * 0.44, y - r * 0.06, r * 0.16, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.44, y - r * 0.06, r * 0.16, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawEmblem(ctx: CanvasRenderingContext2D, emblem: Emblem, cx: number, y: number, r: number, trim: string, t: number) {
  if (emblem === "none") return;
  ctx.save();
  ctx.translate(cx, y - r * 0.02);
  ctx.fillStyle = trim;
  ctx.strokeStyle = trim;
  ctx.lineWidth = r * 0.05;
  if (emblem === "gear") {
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.14, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + t * 1.1;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r * 0.14, Math.sin(a) * r * 0.14);
      ctx.lineTo(Math.cos(a) * r * 0.22, Math.sin(a) * r * 0.22);
      ctx.stroke();
    }
  } else if (emblem === "bolt") {
    ctx.beginPath();
    ctx.moveTo(-r * 0.08, -r * 0.16);
    ctx.lineTo(r * 0.02, -r * 0.02);
    ctx.lineTo(-r * 0.02, -r * 0.02);
    ctx.lineTo(r * 0.1, r * 0.16);
    ctx.lineTo(0, r * 0.02);
    ctx.lineTo(r * 0.04, r * 0.02);
    ctx.closePath();
    ctx.fill();
  } else if (emblem === "wing") {
    ctx.beginPath();
    ctx.ellipse(-r * 0.06, 0, r * 0.08, r * 0.14, 0.3, 0, Math.PI * 2);
    ctx.ellipse(r * 0.06, 0, r * 0.08, r * 0.14, -0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (emblem === "leaf" || emblem === "seed") {
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.1, emblem === "leaf" ? r * 0.16 : r * 0.11, 0.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (emblem === "crown") {
    ctx.beginPath();
    ctx.moveTo(-r * 0.14, r * 0.09);
    ctx.lineTo(-r * 0.08, -r * 0.1);
    ctx.lineTo(0, r * 0.02);
    ctx.lineTo(r * 0.08, -r * 0.1);
    ctx.lineTo(r * 0.14, r * 0.09);
    ctx.closePath();
    ctx.fill();
  } else if (emblem === "torch") {
    ctx.beginPath();
    ctx.moveTo(-r * 0.03, r * 0.12);
    ctx.lineTo(r * 0.04, -r * 0.04);
    ctx.lineTo(r * 0.08, r * 0.12);
    ctx.closePath();
    ctx.fill();
  } else if (emblem === "drum") {
    ctx.beginPath();
    ctx.roundRect(-r * 0.14, -r * 0.08, r * 0.28, r * 0.16, r * 0.05);
    ctx.fill();
  } else if (emblem === "note") {
    ctx.beginPath();
    ctx.arc(-r * 0.02, r * 0.03, r * 0.06, 0, Math.PI * 2);
    ctx.arc(r * 0.08, 0, r * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(r * 0.04, -r * 0.16, r * 0.04, r * 0.18);
  } else if (emblem === "target") {
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.08, 0, Math.PI * 2);
    ctx.stroke();
  } else if (emblem === "wave") {
    ctx.beginPath();
    ctx.moveTo(-r * 0.16, -r * 0.02);
    ctx.quadraticCurveTo(-r * 0.06, -r * 0.1, 0, -r * 0.02);
    ctx.quadraticCurveTo(r * 0.08, r * 0.06, r * 0.16, -r * 0.02);
    ctx.stroke();
  } else if (emblem === "grid") {
    ctx.strokeRect(-r * 0.14, -r * 0.14, r * 0.28, r * 0.28);
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.14);
    ctx.lineTo(0, r * 0.14);
    ctx.moveTo(-r * 0.14, 0);
    ctx.lineTo(r * 0.14, 0);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGear(ctx: CanvasRenderingContext2D, gear: Gear, side: -1 | 1, cx: number, y: number, r: number, col: string, trim: string, t: number) {
  if (gear === "none") return;
  const ax = cx + side * r * 0.82;
  const ay = y + r * 0.03;
  const dark = darker(col, 52);
  ctx.save();
  ctx.translate(ax, ay);
  if (side < 0) ctx.scale(-1, 1);
  ctx.strokeStyle = dark;
  ctx.fillStyle = trim;
  ctx.lineWidth = r * 0.08;

  if (gear === "spear") {
    ctx.beginPath(); ctx.moveTo(-r * 0.04, r * 0.42); ctx.lineTo(r * 0.5, -r * 0.46); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r * 0.5, -r * 0.46); ctx.lineTo(r * 0.34, -r * 0.38); ctx.lineTo(r * 0.42, -r * 0.24); ctx.closePath(); ctx.fill();
  } else if (gear === "shield") {
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.moveTo(-r * 0.02, -r * 0.36); ctx.lineTo(r * 0.36, -r * 0.22); ctx.lineTo(r * 0.34, r * 0.36); ctx.lineTo(r * 0.02, r * 0.42); ctx.closePath(); ctx.fill();
    ctx.fillStyle = trim; ctx.beginPath(); ctx.arc(r * 0.16, r * 0.05, r * 0.08, 0, Math.PI * 2); ctx.fill();
  } else if (gear === "hammer") {
    ctx.beginPath(); ctx.moveTo(-r * 0.03, r * 0.4); ctx.lineTo(r * 0.34, -r * 0.32); ctx.stroke();
    ctx.fillRect(r * 0.22, -r * 0.44, r * 0.28, r * 0.16);
  } else if (gear === "bow") {
    ctx.beginPath(); ctx.arc(r * 0.14, -r * 0.02, r * 0.34, -1, 1); ctx.stroke();
    ctx.strokeStyle = lighter(col, 72); ctx.lineWidth = r * 0.04; ctx.beginPath(); ctx.moveTo(r * 0.31, -r * 0.34); ctx.lineTo(r * 0.31, r * 0.27); ctx.stroke();
  } else if (gear === "staff") {
    ctx.beginPath(); ctx.moveTo(0, r * 0.42); ctx.lineTo(r * 0.22, -r * 0.44); ctx.stroke();
    ctx.beginPath(); ctx.arc(r * 0.24, -r * 0.5, r * 0.12, 0, Math.PI * 2); ctx.fill();
  } else if (gear === "blade") {
    ctx.beginPath(); ctx.moveTo(0, r * 0.35); ctx.lineTo(r * 0.36, -r * 0.34); ctx.stroke();
  } else if (gear === "orb" || gear === "ball") {
    ctx.beginPath(); ctx.arc(r * 0.2, -r * 0.08, r * 0.14, 0, Math.PI * 2); ctx.fill();
  } else if (gear === "torch") {
    ctx.beginPath(); ctx.moveTo(0, r * 0.38); ctx.lineTo(r * 0.22, -r * 0.2); ctx.stroke();
    ctx.fillStyle = `rgba(255,180,70,${0.55 + Math.abs(Math.sin(t * 5)) * 0.3})`;
    ctx.beginPath(); ctx.moveTo(r * 0.18, -r * 0.28); ctx.quadraticCurveTo(r * 0.33, -r * 0.52, r * 0.41, -r * 0.24); ctx.closePath(); ctx.fill();
  } else if (gear === "propeller") {
    ctx.beginPath(); ctx.moveTo(r * 0.14, -r * 0.02); ctx.lineTo(r * 0.14, -r * 0.35); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(r * 0.14, -r * 0.36, r * 0.2, r * 0.06, Math.sin(t * 18) * 0.5, 0, Math.PI * 2); ctx.fill();
  } else if (gear === "drum") {
    ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(-r * 0.02, -r * 0.08, r * 0.32, r * 0.22, r * 0.06); ctx.fill();
    ctx.fillStyle = trim; ctx.fillRect(-r * 0.01, -r * 0.04, r * 0.3, r * 0.04);
  } else if (gear === "horn") {
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r * 0.34, -r * 0.14); ctx.lineTo(r * 0.34, r * 0.12); ctx.closePath(); ctx.fill();
  } else if (gear === "baton") {
    ctx.beginPath(); ctx.moveTo(0, r * 0.35); ctx.lineTo(r * 0.3, -r * 0.22); ctx.stroke();
    ctx.beginPath(); ctx.arc(r * 0.33, -r * 0.26, r * 0.06, 0, Math.PI * 2); ctx.fill();
  } else if (gear === "racket") {
    ctx.beginPath(); ctx.ellipse(r * 0.2, -r * 0.1, r * 0.17, r * 0.23, -0.3, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r * 0.12, r * 0.2); ctx.lineTo(r * 0.24, -r * 0.3); ctx.stroke();
  } else if (gear === "whistle") {
    ctx.beginPath(); ctx.roundRect(r * 0.02, -r * 0.1, r * 0.2, r * 0.12, r * 0.04); ctx.fill();
  } else if (gear === "cannon") {
    ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(-r * 0.02, -r * 0.14, r * 0.36, r * 0.18, r * 0.06); ctx.fill();
    ctx.fillStyle = trim; ctx.fillRect(r * 0.28, -r * 0.09, r * 0.14, r * 0.08);
  } else if (gear === "brush") {
    ctx.beginPath(); ctx.moveTo(0, r * 0.4); ctx.lineTo(r * 0.3, -r * 0.18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r * 0.3, -r * 0.18); ctx.lineTo(r * 0.42, -r * 0.26); ctx.lineTo(r * 0.34, -r * 0.02); ctx.closePath(); ctx.fill();
  } else if (gear === "book") {
    ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(-r * 0.02, -r * 0.28, r * 0.34, r * 0.26, r * 0.06); ctx.fill();
    ctx.fillStyle = trim; ctx.fillRect(r * 0.24, -r * 0.28, r * 0.05, r * 0.26);
  }
  ctx.restore();
}

function drawUnit(design: Design): DrawFn {
  return (ctx, cx, cy, r, col, t, ph) => {
    const bob = Math.sin(t * 3 + ph * 1.7) * r * 0.05;
    const y = cy - bob;
    drawAura(ctx, design.aura, cx, cy, r, t);
    drawShadow(ctx, cx, cy, r, design.model === "hover" ? 1.16 : 1);
    drawBack(ctx, design.back, cx, y, r, design.trim, t);
    drawBody(ctx, design.model, cx, y, r, col, design.trim, ph);
    drawHead(ctx, design.head, cx, y, r, design.trim, t);
    drawGear(ctx, design.left, -1, cx, y, r, col, design.trim, t);
    drawGear(ctx, design.right, 1, cx, y, r, col, design.trim, t);
    drawEmblem(ctx, design.emblem, cx, y, r, design.trim, t);
    drawFace(ctx, design.face, cx, y, r, design.trim);
  };
}

const DESIGNS: Design[] = [
  { id: "notebook", model: "book", face: "focus", head: "cap", back: "banner", emblem: "grid", left: "shield", right: "book", aura: "grid", trim: "#cbd5e1" },
  { id: "protractor", model: "runner", face: "focus", head: "crest", back: "none", emblem: "target", left: "bow", right: "spear", aura: "grid", trim: "#67e8f9" },
  { id: "battery", model: "frame", face: "stern", head: "antenna", back: "coil", emblem: "bolt", left: "orb", right: "cannon", aura: "spark", trim: "#bef264" },
  { id: "graphpaper", model: "totem", face: "visor", head: "none", back: "none", emblem: "grid", left: "cannon", right: "spear", aura: "grid", trim: "#c4b5fd" },
  { id: "paintbrush", model: "robe", face: "smile", head: "halo", back: "banner", emblem: "wave", left: "book", right: "brush", aura: "flame", trim: "#f9a8d4" },
  { id: "drone", model: "hover", face: "visor", head: "antenna", back: "wings", emblem: "wing", left: "propeller", right: "propeller", aura: "wind", trim: "#7dd3fc" },

  { id: "eng_01", model: "samurai", face: "focus", head: "crest", back: "pack", emblem: "gear", left: "blade", right: "spear", aura: "spark", trim: "#cbd5e1" },
  { id: "eng_02", model: "frame", face: "stern", head: "cap", back: "pack", emblem: "bolt", left: "shield", right: "none", aura: "none", trim: "#94a3b8" },
  { id: "eng_03", model: "turret", face: "visor", head: "antenna", back: "coil", emblem: "target", left: "none", right: "cannon", aura: "grid", trim: "#67e8f9" },
  { id: "eng_04", model: "golem", face: "stern", head: "none", back: "none", emblem: "bolt", left: "hammer", right: "shield", aura: "none", trim: "#e2e8f0" },
  { id: "eng_05", model: "runner", face: "focus", head: "antenna", back: "coil", emblem: "wave", left: "blade", right: "propeller", aura: "wind", trim: "#a5f3fc" },
  { id: "eng_06", model: "orb", face: "visor", head: "halo", back: "coil", emblem: "bolt", left: "staff", right: "orb", aura: "spark", trim: "#bae6fd" },
  { id: "eng_07", model: "knight", face: "stern", head: "crown", back: "banner", emblem: "gear", left: "shield", right: "hammer", aura: "none", trim: "#e2e8f0" },
  { id: "eng_08", model: "turret", face: "focus", head: "horn", back: "pack", emblem: "bolt", left: "hammer", right: "spear", aura: "flame", trim: "#fde68a" },
  { id: "eng_09", model: "hover", face: "visor", head: "halo", back: "wings", emblem: "wave", left: "cannon", right: "staff", aura: "ice", trim: "#bfdbfe" },
  { id: "eng_10", model: "chariot", face: "visor", head: "antenna", back: "coil", emblem: "gear", left: "propeller", right: "propeller", aura: "spark", trim: "#bae6fd" },

  { id: "nat_01", model: "beast", face: "smile", head: "horn", back: "none", emblem: "leaf", left: "none", right: "blade", aura: "leaf", trim: "#bbf7d0" },
  { id: "nat_02", model: "golem", face: "stern", head: "none", back: "none", emblem: "leaf", left: "shield", right: "none", aura: "none", trim: "#d9f99d" },
  { id: "nat_03", model: "bird", face: "focus", head: "crest", back: "wings", emblem: "seed", left: "bow", right: "none", aura: "leaf", trim: "#dcfce7" },
  { id: "nat_04", model: "serpent", face: "focus", head: "horn", back: "none", emblem: "leaf", left: "blade", right: "spear", aura: "wind", trim: "#bbf7d0" },
  { id: "nat_05", model: "knight", face: "stern", head: "cap", back: "banner", emblem: "leaf", left: "shield", right: "hammer", aura: "none", trim: "#ecfccb" },
  { id: "nat_06", model: "robe", face: "focus", head: "halo", back: "wings", emblem: "seed", left: "staff", right: "orb", aura: "leaf", trim: "#bbf7d0" },
  { id: "nat_07", model: "totem", face: "stern", head: "crest", back: "none", emblem: "leaf", left: "shield", right: "spear", aura: "leaf", trim: "#dcfce7" },
  { id: "nat_08", model: "golem", face: "stern", head: "horn", back: "none", emblem: "bolt", left: "hammer", right: "torch", aura: "flame", trim: "#fef9c3" },
  { id: "nat_09", model: "bird", face: "focus", head: "crown", back: "wings", emblem: "wing", left: "staff", right: "bow", aura: "ice", trim: "#dcfce7" },
  { id: "nat_10", model: "serpent", face: "none", head: "none", back: "wings", emblem: "wave", left: "propeller", right: "propeller", aura: "wind", trim: "#bbf7d0" },

  { id: "his_01", model: "knight", face: "stern", head: "crown", back: "banner", emblem: "crown", left: "shield", right: "spear", aura: "none", trim: "#fde68a" },
  { id: "his_02", model: "totem", face: "stern", head: "none", back: "none", emblem: "grid", left: "shield", right: "none", aura: "none", trim: "#e7e5e4" },
  { id: "his_03", model: "chariot", face: "focus", head: "crest", back: "banner", emblem: "crown", left: "spear", right: "blade", aura: "wind", trim: "#fde68a" },
  { id: "his_04", model: "samurai", face: "focus", head: "cap", back: "none", emblem: "target", left: "bow", right: "none", aura: "none", trim: "#fef3c7" },
  { id: "his_05", model: "golem", face: "stern", head: "none", back: "banner", emblem: "grid", left: "shield", right: "hammer", aura: "none", trim: "#e7e5e4" },
  { id: "his_06", model: "robe", face: "focus", head: "halo", back: "banner", emblem: "torch", left: "torch", right: "staff", aura: "flame", trim: "#fed7aa" },
  { id: "his_07", model: "samurai", face: "stern", head: "horn", back: "banner", emblem: "crown", left: "hammer", right: "shield", aura: "none", trim: "#fde68a" },
  { id: "his_08", model: "chariot", face: "smile", head: "cap", back: "banner", emblem: "drum", left: "drum", right: "baton", aura: "music", trim: "#fdba74" },
  { id: "his_09", model: "knight", face: "focus", head: "crown", back: "banner", emblem: "target", left: "bow", right: "staff", aura: "spark", trim: "#fde68a" },
  { id: "his_10", model: "golem", face: "stern", head: "horn", back: "none", emblem: "crown", left: "orb", right: "blade", aura: "ice", trim: "#fef3c7" },

  { id: "mus_01", model: "orb", face: "smile", head: "halo", back: "none", emblem: "note", left: "baton", right: "none", aura: "music", trim: "#e9d5ff" },
  { id: "mus_02", model: "totem", face: "stern", head: "cap", back: "none", emblem: "drum", left: "shield", right: "drum", aura: "music", trim: "#ddd6fe" },
  { id: "mus_03", model: "bird", face: "focus", head: "crest", back: "wings", emblem: "note", left: "horn", right: "none", aura: "music", trim: "#f3e8ff" },
  { id: "mus_04", model: "robe", face: "focus", head: "halo", back: "banner", emblem: "wave", left: "bow", right: "none", aura: "music", trim: "#e9d5ff" },
  { id: "mus_05", model: "golem", face: "stern", head: "cap", back: "none", emblem: "note", left: "none", right: "drum", aura: "music", trim: "#ddd6fe" },
  { id: "mus_06", model: "orb", face: "focus", head: "halo", back: "wings", emblem: "note", left: "staff", right: "orb", aura: "music", trim: "#f5d0fe" },
  { id: "mus_07", model: "knight", face: "stern", head: "crown", back: "banner", emblem: "wave", left: "shield", right: "baton", aura: "music", trim: "#e9d5ff" },
  { id: "mus_08", model: "totem", face: "focus", head: "antenna", back: "none", emblem: "grid", left: "none", right: "hammer", aura: "music", trim: "#f3e8ff" },
  { id: "mus_09", model: "bird", face: "focus", head: "crown", back: "wings", emblem: "note", left: "bow", right: "horn", aura: "music", trim: "#ddd6fe" },
  { id: "mus_10", model: "robe", face: "smile", head: "crown", back: "banner", emblem: "note", left: "baton", right: "staff", aura: "music", trim: "#f5d0fe" },

  { id: "spo_01", model: "runner", face: "focus", head: "cap", back: "none", emblem: "target", left: "blade", right: "none", aura: "wind", trim: "#bfdbfe" },
  { id: "spo_02", model: "golem", face: "stern", head: "cap", back: "none", emblem: "target", left: "shield", right: "none", aura: "none", trim: "#dbeafe" },
  { id: "spo_03", model: "runner", face: "focus", head: "crest", back: "none", emblem: "target", left: "bow", right: "none", aura: "wind", trim: "#e0f2fe" },
  { id: "spo_04", model: "runner", face: "focus", head: "cap", back: "none", emblem: "wave", left: "racket", right: "ball", aura: "wind", trim: "#dbeafe" },
  { id: "spo_05", model: "knight", face: "stern", head: "cap", back: "none", emblem: "target", left: "shield", right: "hammer", aura: "none", trim: "#bfdbfe" },
  { id: "spo_06", model: "turret", face: "focus", head: "antenna", back: "none", emblem: "target", left: "cannon", right: "none", aura: "wind", trim: "#e0f2fe" },
  { id: "spo_07", model: "chariot", face: "stern", head: "crown", back: "banner", emblem: "crown", left: "shield", right: "baton", aura: "none", trim: "#dbeafe" },
  { id: "spo_08", model: "golem", face: "focus", head: "horn", back: "none", emblem: "wave", left: "hammer", right: "whistle", aura: "wind", trim: "#bfdbfe" },
  { id: "spo_09", model: "runner", face: "focus", head: "crown", back: "wings", emblem: "target", left: "bow", right: "staff", aura: "spark", trim: "#e0f2fe" },
  { id: "spo_10", model: "bird", face: "none", head: "halo", back: "wings", emblem: "wing", left: "propeller", right: "propeller", aura: "wind", trim: "#dbeafe" },
];

export const EXPANSION_RENDERERS: Record<string, DrawFn> = Object.fromEntries(
  DESIGNS.map((d) => [d.id, drawUnit(d)]),
);
