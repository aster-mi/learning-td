// school.ts - School-themed tower defense character renderers
// All characters walk right and fight enemies.

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

// ─────────────────────────────────────────────
// 1. drawTextbook - "教科書タンク" (id: "textbook", color: "#2563eb", r: 24)
//    Thick closed book standing upright, blue hard cover, gold spine,
//    layered page edges, bookmark ribbon, stern face, tank-like build.
// ─────────────────────────────────────────────
export function drawTextbook(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const w = r * 1.5;   // book width
  const h = r * 2.0;   // book height
  const d = r * 0.45;  // book depth/thickness
  const bob = Math.sin(t * 3 + ph) * 1.5;

  ctx.save();
  ctx.translate(cx, cy + bob);

  // --- tiny legs ---
  const legKick = Math.sin(t * 6 + ph) * 4;
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(-w * 0.3 - 3, h * 0.42, 6, r * 0.35 + legKick);
  ctx.fillRect(w * 0.3 - 3, h * 0.42, 6, r * 0.35 - legKick);
  // shoes
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(-w * 0.3 - 4, h * 0.42 + r * 0.35 + Math.max(legKick, -legKick) - 2, 8, 4);
  ctx.fillRect(w * 0.3 - 4, h * 0.42 + r * 0.35 + Math.max(-legKick, legKick) - 2, 8, 4);

  // --- page edges (right side, layered white lines) ---
  ctx.fillStyle = "#f8f8f0";
  ctx.fillRect(w * 0.5, -h * 0.42, d, h * 0.84);
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `rgba(180,170,150,${0.3 + i * 0.05})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.5 + 2 + i * (d - 4) / 6, -h * 0.42 + 2);
    ctx.lineTo(w * 0.5 + 2 + i * (d - 4) / 6, h * 0.42 - 2);
    ctx.stroke();
  }

  // --- hard cover back ---
  const grad = ctx.createLinearGradient(-w * 0.5, 0, w * 0.5, 0);
  grad.addColorStop(0, darker(col, 30));
  grad.addColorStop(0.15, col);
  grad.addColorStop(1, lighter(col, 15));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(-w * 0.5, -h * 0.45, w, h * 0.9, 3);
  ctx.fill();

  // cover border
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-w * 0.5, -h * 0.45, w, h * 0.9, 3);
  ctx.stroke();

  // --- gold spine decoration (left edge) ---
  ctx.fillStyle = "#d4a017";
  ctx.fillRect(-w * 0.5, -h * 0.45, 4, h * 0.9);
  // spine lines
  ctx.strokeStyle = "#b8860b";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 3; i++) {
    const yy = -h * 0.3 + i * h * 0.25;
    ctx.beginPath();
    ctx.moveTo(-w * 0.5 + 1, yy);
    ctx.lineTo(-w * 0.5 + 3, yy);
    ctx.stroke();
  }

  // --- gold title rectangle on cover ---
  ctx.fillStyle = "rgba(212,160,23,0.25)";
  ctx.fillRect(-w * 0.25, -h * 0.25, w * 0.6, h * 0.18);
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 0.7;
  ctx.strokeRect(-w * 0.25, -h * 0.25, w * 0.6, h * 0.18);
  // fake title lines
  ctx.strokeStyle = "rgba(212,160,23,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-w * 0.15, -h * 0.19);
  ctx.lineTo(w * 0.2, -h * 0.19);
  ctx.moveTo(-w * 0.1, -h * 0.13);
  ctx.lineTo(w * 0.15, -h * 0.13);
  ctx.stroke();

  // --- bookmark ribbon ---
  const ribbonWave = Math.sin(t * 4 + ph) * 2;
  ctx.strokeStyle = "#dc2626";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(w * 0.1, -h * 0.45);
  ctx.quadraticCurveTo(w * 0.1 + ribbonWave, -h * 0.55, w * 0.15, -h * 0.62);
  ctx.stroke();
  // ribbon tip triangle
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.moveTo(w * 0.15 - 3, -h * 0.62);
  ctx.lineTo(w * 0.15 + 3, -h * 0.62);
  ctx.lineTo(w * 0.15, -h * 0.58);
  ctx.closePath();
  ctx.fill();

  // --- arms ---
  const armSwing = Math.sin(t * 6 + ph) * 10;
  ctx.strokeStyle = darker(col, 20);
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  // left arm
  ctx.beginPath();
  ctx.moveTo(-w * 0.5, -h * 0.05);
  ctx.lineTo(-w * 0.5 - r * 0.4, h * 0.05 + armSwing * 0.3);
  ctx.stroke();
  // right arm
  ctx.beginPath();
  ctx.moveTo(w * 0.5, -h * 0.05);
  ctx.lineTo(w * 0.5 + r * 0.4, h * 0.05 - armSwing * 0.3);
  ctx.stroke();
  // fists
  ctx.fillStyle = darker(col, 20);
  ctx.beginPath();
  ctx.arc(-w * 0.5 - r * 0.4, h * 0.05 + armSwing * 0.3, 3, 0, Math.PI * 2);
  ctx.arc(w * 0.5 + r * 0.4, h * 0.05 - armSwing * 0.3, 3, 0, Math.PI * 2);
  ctx.fill();

  // --- stern face ---
  // eyes (narrow, serious)
  ctx.fillStyle = "#fff";
  ctx.fillRect(-w * 0.15, h * 0.02, 7, 5);
  ctx.fillRect(w * 0.05, h * 0.02, 7, 5);
  // pupils
  ctx.fillStyle = "#111";
  ctx.fillRect(-w * 0.15 + 4, h * 0.03, 3, 4);
  ctx.fillRect(w * 0.05 + 4, h * 0.03, 3, 4);
  // stern brow lines
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-w * 0.18, h * 0.0);
  ctx.lineTo(-w * 0.05, h * -0.02);
  ctx.moveTo(w * 0.16, h * 0.0);
  ctx.lineTo(w * 0.03, h * -0.02);
  ctx.stroke();
  // flat serious mouth
  ctx.strokeStyle = darker(col, 70);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-w * 0.08, h * 0.14);
  ctx.lineTo(w * 0.12, h * 0.14);
  ctx.stroke();

  ctx.restore();
}

// ─────────────────────────────────────────────
// 2. drawSchoolbag - "ランドセル重戦車" (id: "schoolbag", color: "#dc2626", r: 26)
//    Japanese randoseru backpack, box-shaped, front flap with buckle,
//    shoulder straps, heavy armored look, gold hardware, determined face.
// ─────────────────────────────────────────────
export function drawSchoolbag(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const w = r * 1.8;
  const h = r * 2.0;
  const bob = Math.sin(t * 2.5 + ph) * 1.2;

  ctx.save();
  ctx.translate(cx, cy + bob);

  // --- tiny legs (heavy stomping) ---
  const legT = Math.sin(t * 4.5 + ph) * 3;
  ctx.fillStyle = "#333";
  ctx.fillRect(-w * 0.25 - 4, h * 0.42, 8, r * 0.32 + legT);
  ctx.fillRect(w * 0.25 - 4, h * 0.42, 8, r * 0.32 - legT);
  // boots (heavy)
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.roundRect(-w * 0.25 - 6, h * 0.42 + r * 0.32 + Math.abs(legT) - 3, 12, 6, 2);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(w * 0.25 - 6, h * 0.42 + r * 0.32 + Math.abs(-legT) - 3, 12, 6, 2);
  ctx.fill();

  // --- shoulder straps (behind body) ---
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-w * 0.35, -h * 0.38);
  ctx.quadraticCurveTo(-w * 0.55, -h * 0.1, -w * 0.35, h * 0.15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.35, -h * 0.38);
  ctx.quadraticCurveTo(w * 0.55, -h * 0.1, w * 0.35, h * 0.15);
  ctx.stroke();
  // gold buckles on straps
  ctx.fillStyle = "#d4a017";
  ctx.fillRect(-w * 0.42, h * 0.08, 6, 6);
  ctx.fillRect(w * 0.36, h * 0.08, 6, 6);

  // --- main body (box shape) ---
  const bodyGrad = ctx.createLinearGradient(-w * 0.4, -h * 0.4, w * 0.4, h * 0.4);
  bodyGrad.addColorStop(0, lighter(col, 20));
  bodyGrad.addColorStop(0.4, col);
  bodyGrad.addColorStop(1, darker(col, 35));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-w * 0.4, -h * 0.4, w * 0.8, h * 0.82, 5);
  ctx.fill();

  // armored edge lines
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-w * 0.4, -h * 0.4, w * 0.8, h * 0.82, 5);
  ctx.stroke();

  // --- top lid (curved randoseru top) ---
  ctx.fillStyle = darker(col, 10);
  ctx.beginPath();
  ctx.moveTo(-w * 0.4, -h * 0.4);
  ctx.quadraticCurveTo(0, -h * 0.55, w * 0.4, -h * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // --- front flap ---
  const flapGrad = ctx.createLinearGradient(0, -h * 0.2, 0, h * 0.3);
  flapGrad.addColorStop(0, col);
  flapGrad.addColorStop(1, darker(col, 25));
  ctx.fillStyle = flapGrad;
  ctx.beginPath();
  ctx.roundRect(-w * 0.28, -h * 0.2, w * 0.56, h * 0.52, [0, 0, 8, 8]);
  ctx.fill();
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = 1;
  ctx.stroke();

  // flap stitching
  ctx.strokeStyle = darker(col, 20);
  ctx.lineWidth = 0.5;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.roundRect(-w * 0.24, -h * 0.16, w * 0.48, h * 0.44, [0, 0, 6, 6]);
  ctx.stroke();
  ctx.setLineDash([]);

  // --- gold buckle (center bottom of flap) ---
  ctx.fillStyle = "#d4a017";
  ctx.beginPath();
  ctx.roundRect(-6, h * 0.22, 12, 10, 2);
  ctx.fill();
  ctx.strokeStyle = "#b8860b";
  ctx.lineWidth = 1;
  ctx.stroke();
  // buckle prong
  ctx.strokeStyle = "#b8860b";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.24);
  ctx.lineTo(0, h * 0.30);
  ctx.stroke();

  // --- gold corner rivets ---
  const corners = [
    [-w * 0.36, -h * 0.36], [w * 0.36, -h * 0.36],
    [-w * 0.36, h * 0.38], [w * 0.36, h * 0.38],
  ];
  ctx.fillStyle = "#d4a017";
  for (const [px, py] of corners) {
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- determined face (on flap) ---
  // eyes: wide and fierce
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(-w * 0.1, -h * 0.04, 5, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(w * 0.1, -h * 0.04, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // pupils (looking right / forward)
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(-w * 0.1 + 1.5, -h * 0.04, 2.5, 0, Math.PI * 2);
  ctx.arc(w * 0.1 + 1.5, -h * 0.04, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // highlight dots
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-w * 0.1 + 0.5, -h * 0.06, 1, 0, Math.PI * 2);
  ctx.arc(w * 0.1 + 0.5, -h * 0.06, 1, 0, Math.PI * 2);
  ctx.fill();
  // determined eyebrows (angled inward)
  ctx.strokeStyle = darker(col, 80);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-w * 0.18, -h * 0.1);
  ctx.lineTo(-w * 0.04, -h * 0.08);
  ctx.moveTo(w * 0.18, -h * 0.1);
  ctx.lineTo(w * 0.04, -h * 0.08);
  ctx.stroke();
  // grit-teeth mouth
  ctx.strokeStyle = darker(col, 80);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-w * 0.08, h * 0.08);
  ctx.lineTo(w * 0.08, h * 0.08);
  ctx.stroke();
  // teeth lines
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 0.8;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 3, h * 0.07);
    ctx.lineTo(i * 3, h * 0.09);
    ctx.stroke();
  }

  // --- subtle armored sheen ---
  const sheen = ctx.createLinearGradient(-w * 0.4, -h * 0.4, w * 0.1, -h * 0.1);
  sheen.addColorStop(0, "rgba(255,255,255,0.15)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0.0)");
  sheen.addColorStop(1, "rgba(255,255,255,0.0)");
  ctx.fillStyle = sheen;
  ctx.beginPath();
  ctx.roundRect(-w * 0.4, -h * 0.4, w * 0.8, h * 0.82, 5);
  ctx.fill();

  ctx.restore();
}

// ─────────────────────────────────────────────
// 3. drawBell - "チャイムの精" (id: "bell", color: "#eab308", r: 14)
//    School bell with clapper, animated sound waves, fairy wings,
//    floating, magical sparkles, cute face.
// ─────────────────────────────────────────────
export function drawBell(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const float = Math.sin(t * 3.5 + ph) * 3;
  const wobble = Math.sin(t * 5 + ph) * 0.06;

  ctx.save();
  ctx.translate(cx, cy + float);
  ctx.rotate(wobble);

  // --- sparkles (behind bell) ---
  ctx.fillStyle = "rgba(255,240,100,0.7)";
  for (let i = 0; i < 6; i++) {
    const angle = (t * 1.5 + i * Math.PI / 3 + ph) % (Math.PI * 2);
    const dist = r * 1.3 + Math.sin(t * 4 + i * 1.7) * 3;
    const sx = Math.cos(angle) * dist;
    const sy = Math.sin(angle) * dist;
    const sz = 1 + Math.sin(t * 6 + i * 2.1) * 0.7;
    ctx.beginPath();
    // 4-point star sparkle
    ctx.moveTo(sx, sy - sz * 2);
    ctx.lineTo(sx + sz * 0.6, sy);
    ctx.lineTo(sx, sy + sz * 2);
    ctx.lineTo(sx - sz * 0.6, sy);
    ctx.closePath();
    ctx.fill();
  }

  // --- fairy wings ---
  const wingFlap = Math.sin(t * 10 + ph) * 0.3;
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = lighter(col, 60);
  // left wing
  ctx.beginPath();
  ctx.ellipse(-r * 0.9, -r * 0.3, r * 0.7, r * 0.35, -0.5 + wingFlap, 0, Math.PI * 2);
  ctx.fill();
  // right wing
  ctx.beginPath();
  ctx.ellipse(r * 0.9, -r * 0.3, r * 0.7, r * 0.35, 0.5 - wingFlap, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.restore();

  // --- sound wave rings (animated) ---
  for (let i = 0; i < 3; i++) {
    const wavePh = (t * 3 + i * 0.7 + ph) % 2.0;
    if (wavePh < 1.5) {
      const waveR = r * 1.0 + wavePh * r * 0.8;
      const alpha = 0.4 * (1 - wavePh / 1.5);
      ctx.strokeStyle = `rgba(234,179,8,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, r * 0.1, waveR, -Math.PI * 0.7, -Math.PI * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, r * 0.1, waveR, Math.PI * 0.3, Math.PI * 0.7);
      ctx.stroke();
    }
  }

  // --- bell handle/top loop ---
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, -r * 0.85, r * 0.22, Math.PI, 0);
  ctx.stroke();

  // --- bell body ---
  const bellGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r * 1.1);
  bellGrad.addColorStop(0, lighter(col, 50));
  bellGrad.addColorStop(0.5, col);
  bellGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = bellGrad;
  ctx.beginPath();
  ctx.moveTo(-r * 0.3, -r * 0.7);
  ctx.quadraticCurveTo(-r * 0.35, -r * 0.4, -r * 0.75, r * 0.4);
  ctx.quadraticCurveTo(-r * 0.8, r * 0.7, -r * 0.85, r * 0.75);
  ctx.lineTo(r * 0.85, r * 0.75);
  ctx.quadraticCurveTo(r * 0.8, r * 0.7, r * 0.75, r * 0.4);
  ctx.quadraticCurveTo(r * 0.35, -r * 0.4, r * 0.3, -r * 0.7);
  ctx.closePath();
  ctx.fill();

  // bell outline
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // bell lip ring (bottom)
  ctx.fillStyle = darker(col, 20);
  ctx.beginPath();
  ctx.ellipse(0, r * 0.75, r * 0.85, r * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // --- clapper ---
  const clapperSwing = Math.sin(t * 5 + ph) * 3;
  ctx.fillStyle = "#8B7D3C";
  ctx.beginPath();
  ctx.moveTo(0, r * 0.2);
  ctx.lineTo(clapperSwing, r * 0.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(clapperSwing, r * 0.9, r * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // --- sheen highlight ---
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, -r * 0.15, r * 0.2, r * 0.35, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // --- cute face ---
  // eyes
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.ellipse(-r * 0.22, r * 0.1, 2, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.22, r * 0.1, 2, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // sparkle in eyes
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-r * 0.22 + 0.8, r * 0.08, 0.8, 0, Math.PI * 2);
  ctx.arc(r * 0.22 + 0.8, r * 0.08, 0.8, 0, Math.PI * 2);
  ctx.fill();
  // happy mouth
  ctx.strokeStyle = "#6B4C00";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, r * 0.2, r * 0.15, 0.2, Math.PI - 0.2);
  ctx.stroke();
  // blush circles
  ctx.fillStyle = "rgba(255,150,150,0.35)";
  ctx.beginPath();
  ctx.arc(-r * 0.4, r * 0.25, r * 0.12, 0, Math.PI * 2);
  ctx.arc(r * 0.4, r * 0.25, r * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─────────────────────────────────────────────
// 4. drawChalk - "チョーク投げ" (id: "chalk", color: "#e2e8f0", r: 11)
//    Small chalk stick, cylindrical body, dust particles trailing,
//    throwing pose, cute face, fast-looking, dust cloud.
// ─────────────────────────────────────────────
export function drawChalk(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const bob = Math.sin(t * 8 + ph) * 1.5;
  const lean = Math.sin(t * 4 + ph) * 0.08; // slight forward lean

  ctx.save();
  ctx.translate(cx, cy + bob);
  ctx.rotate(lean);

  // --- trailing dust particles (behind) ---
  for (let i = 0; i < 8; i++) {
    const age = (t * 3 + i * 0.4 + ph) % 2.5;
    if (age < 2.0) {
      const dx = -age * r * 0.9 - i * 2;
      const dy = Math.sin(i * 1.3 + t * 2) * r * 0.5 + age * 2;
      const sz = (1 - age / 2.0) * r * 0.25;
      const alpha = (1 - age / 2.0) * 0.4;
      ctx.fillStyle = `rgba(220,220,210,${alpha})`;
      ctx.beginPath();
      ctx.arc(dx, dy + r * 0.3, sz, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- dust cloud around feet ---
  for (let i = 0; i < 4; i++) {
    const puff = (t * 5 + i * 1.2 + ph) % 1.5;
    if (puff < 1.0) {
      const alpha = (1 - puff) * 0.25;
      const puffR = r * 0.3 + puff * r * 0.4;
      ctx.fillStyle = `rgba(210,210,200,${alpha})`;
      ctx.beginPath();
      ctx.arc(
        Math.cos(i * 2.1) * r * 0.4,
        r * 0.9 + Math.sin(i * 1.7) * 2,
        puffR, 0, Math.PI * 2
      );
      ctx.fill();
    }
  }

  // --- tiny fast legs ---
  const legSpeed = Math.sin(t * 12 + ph) * 5;
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-r * 0.2, r * 0.7);
  ctx.lineTo(-r * 0.2 - legSpeed * 0.3, r * 1.2 + legSpeed * 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r * 0.2, r * 0.7);
  ctx.lineTo(r * 0.2 + legSpeed * 0.3, r * 1.2 - legSpeed * 0.2);
  ctx.stroke();

  // --- cylindrical body (chalk stick) ---
  const bodyH = r * 1.6;
  const bodyW = r * 0.75;

  // body gradient (cream/white)
  const bodyGrad = ctx.createLinearGradient(-bodyW, 0, bodyW, 0);
  bodyGrad.addColorStop(0, darker(col, 20));
  bodyGrad.addColorStop(0.3, col);
  bodyGrad.addColorStop(0.7, lighter(col, 10));
  bodyGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-bodyW, -bodyH * 0.45, bodyW * 2, bodyH, [bodyW, bodyW, 2, 2]);
  ctx.fill();

  // chalk texture (slightly rough surface lines)
  ctx.strokeStyle = `rgba(180,180,170,0.3)`;
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 5; i++) {
    const yy = -bodyH * 0.3 + i * bodyH * 0.2;
    ctx.beginPath();
    ctx.moveTo(-bodyW * 0.6, yy);
    ctx.lineTo(bodyW * 0.6, yy + 1);
    ctx.stroke();
  }

  // worn/flat bottom edge
  ctx.fillStyle = darker(col, 15);
  ctx.fillRect(-bodyW * 0.9, bodyH * 0.5, bodyW * 1.8, 3);

  // --- throwing arm (right arm back with small chalk projectile) ---
  const throwAnim = Math.sin(t * 4 + ph);
  const armAngle = -0.8 + throwAnim * 0.5;
  ctx.save();
  ctx.translate(bodyW * 0.7, -bodyH * 0.1);
  ctx.rotate(armAngle);
  ctx.strokeStyle = darker(col, 15);
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(r * 0.7, 0);
  ctx.stroke();
  // tiny chalk piece in hand
  ctx.fillStyle = "#fffbe6";
  ctx.fillRect(r * 0.6, -1.5, r * 0.35, 3);
  ctx.restore();

  // left arm (forward for balance)
  ctx.strokeStyle = darker(col, 15);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.7, -bodyH * 0.1);
  ctx.lineTo(-bodyW * 0.7 - r * 0.4, -bodyH * 0.25 + throwAnim * 2);
  ctx.stroke();

  // --- cute face ---
  // big eyes (energetic)
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.ellipse(-bodyW * 0.3, -bodyH * 0.08, 2, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(bodyW * 0.3, -bodyH * 0.08, 2, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // eye highlights
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-bodyW * 0.3 + 0.7, -bodyH * 0.1, 0.9, 0, Math.PI * 2);
  ctx.arc(bodyW * 0.3 + 0.7, -bodyH * 0.1, 0.9, 0, Math.PI * 2);
  ctx.fill();
  // excited open mouth
  ctx.fillStyle = "#bbb";
  ctx.beginPath();
  ctx.ellipse(0, bodyH * 0.05, 2, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // speed lines (to the left)
  ctx.strokeStyle = "rgba(200,200,190,0.4)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const ly = -bodyH * 0.2 + i * bodyH * 0.2;
    ctx.beginPath();
    ctx.moveTo(-bodyW - r * 0.4, ly);
    ctx.lineTo(-bodyW - r * 0.9, ly);
    ctx.stroke();
  }

  ctx.restore();
}

// ─────────────────────────────────────────────
// 5. drawGlobe - "地球儀ローラー" (id: "globe", color: "#22d3ee", r: 22)
//    Earth globe sphere, simplified continents, tilted axis ring,
//    rotating landmasses, golden base/legs, regal appearance.
// ─────────────────────────────────────────────
export function drawGlobe(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const bob = Math.sin(t * 2.5 + ph) * 1.5;

  ctx.save();
  ctx.translate(cx, cy + bob);

  // --- golden base/legs ---
  const baseW = r * 0.8;
  const baseH = r * 0.2;
  const legH = r * 0.5;
  const legWalk = Math.sin(t * 4 + ph) * 4;

  // legs
  ctx.strokeStyle = "#b8860b";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-baseW * 0.4, r * 0.9);
  ctx.lineTo(-baseW * 0.4 - legWalk, r * 0.9 + legH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(baseW * 0.4, r * 0.9);
  ctx.lineTo(baseW * 0.4 + legWalk, r * 0.9 + legH);
  ctx.stroke();
  // feet
  ctx.fillStyle = "#8B7D3C";
  ctx.beginPath();
  ctx.ellipse(-baseW * 0.4 - legWalk, r * 0.9 + legH + 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(baseW * 0.4 + legWalk, r * 0.9 + legH + 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // golden base platform
  const baseGrad = ctx.createLinearGradient(-baseW, r * 0.8, baseW, r * 0.95);
  baseGrad.addColorStop(0, "#d4a017");
  baseGrad.addColorStop(0.5, "#f0d060");
  baseGrad.addColorStop(1, "#b8860b");
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.ellipse(0, r * 0.9, baseW, baseH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8B7D3C";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // vertical support column
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.78);
  ctx.lineTo(0, r * 0.4);
  ctx.stroke();

  // --- axis ring (tilted, behind globe) ---
  ctx.save();
  ctx.rotate(-0.4); // axial tilt
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.95, r * 0.15, 0, Math.PI * 0.05, Math.PI * 0.95);
  ctx.stroke();
  ctx.restore();

  // --- ocean sphere ---
  const oceanGrad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r * 0.88);
  oceanGrad.addColorStop(0, lighter(col, 40));
  oceanGrad.addColorStop(0.5, col);
  oceanGrad.addColorStop(1, darker(col, 50));
  ctx.fillStyle = oceanGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
  ctx.fill();

  // globe outline
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
  ctx.stroke();

  // --- rotating continents (simplified land patches) ---
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
  ctx.clip();

  const rot = t * 0.4 + ph; // slow rotation
  const landCol = "#4ade80";
  const landDark = "#22c55e";

  // continent 1 (large, like Americas)
  ctx.fillStyle = landCol;
  const c1x = Math.cos(rot) * r * 0.3;
  const c1y = -r * 0.2;
  ctx.beginPath();
  ctx.moveTo(c1x - r * 0.15, c1y - r * 0.35);
  ctx.quadraticCurveTo(c1x + r * 0.05, c1y - r * 0.25, c1x + r * 0.1, c1y - r * 0.1);
  ctx.quadraticCurveTo(c1x + r * 0.15, c1y + r * 0.05, c1x + r * 0.05, c1y + r * 0.2);
  ctx.quadraticCurveTo(c1x - r * 0.0, c1y + r * 0.35, c1x - r * 0.1, c1y + r * 0.4);
  ctx.quadraticCurveTo(c1x - r * 0.2, c1y + r * 0.25, c1x - r * 0.2, c1y + r * 0.05);
  ctx.quadraticCurveTo(c1x - r * 0.25, c1y - r * 0.15, c1x - r * 0.15, c1y - r * 0.35);
  ctx.closePath();
  ctx.fill();

  // continent 2 (like Eurasia, offset by rotation)
  ctx.fillStyle = landDark;
  const c2x = Math.cos(rot + 2.5) * r * 0.35;
  const c2y = -r * 0.15;
  ctx.beginPath();
  ctx.ellipse(c2x, c2y, r * 0.25, r * 0.15, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // sub-part
  ctx.fillStyle = landCol;
  ctx.beginPath();
  ctx.ellipse(c2x + r * 0.15, c2y + r * 0.12, r * 0.1, r * 0.08, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // continent 3 (small island, like Australia)
  ctx.fillStyle = landDark;
  const c3x = Math.cos(rot + 4.2) * r * 0.3;
  const c3y = r * 0.25;
  ctx.beginPath();
  ctx.ellipse(c3x, c3y, r * 0.12, r * 0.08, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // continent 4 (Africa-like)
  ctx.fillStyle = landCol;
  const c4x = Math.cos(rot + 1.3) * r * 0.15;
  const c4y = r * 0.05;
  ctx.beginPath();
  ctx.moveTo(c4x, c4y - r * 0.15);
  ctx.quadraticCurveTo(c4x + r * 0.12, c4y, c4x + r * 0.05, c4y + r * 0.2);
  ctx.quadraticCurveTo(c4x - r * 0.05, c4y + r * 0.18, c4x - r * 0.08, c4y);
  ctx.closePath();
  ctx.fill();

  ctx.restore(); // un-clip

  // --- latitude/longitude grid lines (subtle) ---
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 0.5;
  // equator
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.82, r * 0.08, 0, 0, Math.PI * 2);
  ctx.stroke();
  // tropic lines
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.3, r * 0.7, r * 0.06, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, r * 0.3, r * 0.7, r * 0.06, 0, 0, Math.PI * 2);
  ctx.stroke();
  // meridian
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.08, r * 0.82, 0, 0, Math.PI * 2);
  ctx.stroke();

  // --- axis ring (tilted, front part) ---
  ctx.save();
  ctx.rotate(-0.4);
  ctx.strokeStyle = "#f0d060";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.95, r * 0.15, 0, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();
  // axis tip (north pole dot)
  ctx.fillStyle = "#d4a017";
  ctx.beginPath();
  ctx.arc(0, -r * 0.95, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- sheen / highlight ---
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, -r * 0.25, r * 0.25, r * 0.35, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // --- regal face ---
  // eyes (confident, slightly narrow)
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, -r * 0.05, 4, 3.5, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.2, -r * 0.05, 4, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(-r * 0.2 + 1, -r * 0.05, 2.5, 0, Math.PI * 2);
  ctx.arc(r * 0.2 + 1, -r * 0.05, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // eye highlights
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-r * 0.2, -r * 0.08, 1, 0, Math.PI * 2);
  ctx.arc(r * 0.2, -r * 0.08, 1, 0, Math.PI * 2);
  ctx.fill();
  // composed, slight smile
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, r * 0.08, r * 0.13, 0.15, Math.PI - 0.15);
  ctx.stroke();
  // regal eyebrows (arched)
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-r * 0.32, -r * 0.16);
  ctx.quadraticCurveTo(-r * 0.2, -r * 0.22, -r * 0.1, -r * 0.15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r * 0.32, -r * 0.16);
  ctx.quadraticCurveTo(r * 0.2, -r * 0.22, r * 0.1, -r * 0.15);
  ctx.stroke();

  ctx.restore();
}
