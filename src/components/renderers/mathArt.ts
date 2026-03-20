// ============================================================
// mathArt.ts  -  Canvas2D draw functions for Math & Art series
// ============================================================

/* ---------- colour helpers ---------- */

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

// ========================  MATH SERIES  ========================

/**
 * drawAbacus  -  "そろばん侍"
 * id: "abacus"  |  color: "#c2410c"  |  r: 16
 * Wooden abacus frame, coloured beads, samurai headband, katana.
 */
export function drawAbacus(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  void col;
  const w = r * 1.6;
  const h = r * 1.8;
  const fx = cx - w / 2;
  const fy = cy - h / 2;

  // --- wooden frame ---
  const frameGrad = ctx.createLinearGradient(fx, fy, fx + w, fy + h);
  frameGrad.addColorStop(0, "#a0522d");
  frameGrad.addColorStop(0.5, "#c8874a");
  frameGrad.addColorStop(1, "#8b4513");
  ctx.fillStyle = frameGrad;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = darker("#8b4513", 30);

  // outer frame
  const fr = 2;
  ctx.beginPath();
  ctx.roundRect(fx, fy, w, h, fr);
  ctx.fill();
  ctx.stroke();

  // inner cavity
  ctx.fillStyle = "#1a0e05";
  ctx.beginPath();
  ctx.roundRect(fx + 2.5, fy + 2.5, w - 5, h - 5, 1);
  ctx.fill();

  // --- rods & beads ---
  const rodColors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308"];
  const numRods = 4;
  const rodSpacing = (h - 8) / (numRods + 1);
  for (let i = 0; i < numRods; i++) {
    const ry = fy + 5 + rodSpacing * (i + 1);
    // rod
    ctx.strokeStyle = "#a0522d";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(fx + 3, ry);
    ctx.lineTo(fx + w - 3, ry);
    ctx.stroke();

    // beads (3 per rod, slide with ph)
    const beadR = 2.2;
    const slide = Math.sin(ph + i * 1.1) * (w * 0.15);
    for (let b = 0; b < 3; b++) {
      const bx = fx + w * 0.25 + b * (beadR * 2.8) + slide;
      const bGrad = ctx.createRadialGradient(bx - 0.5, ry - 0.5, 0, bx, ry, beadR);
      bGrad.addColorStop(0, lighter(rodColors[i], 80));
      bGrad.addColorStop(1, rodColors[i]);
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(bx, ry, beadR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- samurai headband (hachimaki) ---
  ctx.strokeStyle = "#dc2626";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(fx - 3, fy - 1);
  ctx.lineTo(fx + w + 3, fy - 1);
  ctx.stroke();
  // knot tails
  const knotX = fx + w + 3;
  const tail = Math.sin(t * 3) * 2;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(knotX, fy - 1);
  ctx.quadraticCurveTo(knotX + 4, fy - 5 + tail, knotX + 6, fy - 8 + tail);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(knotX, fy - 1);
  ctx.quadraticCurveTo(knotX + 3, fy + 2 + tail, knotX + 5, fy + 4 + tail);
  ctx.stroke();
  // sun circle on band
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, fy - 1, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.arc(cx, fy - 1, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // --- katana on the right ---
  ctx.save();
  ctx.translate(cx + w / 2 + 2, cy);
  ctx.rotate(-0.25 + Math.sin(t * 2) * 0.08);
  // blade
  const bladeGrad = ctx.createLinearGradient(0, -r, 0, r * 0.3);
  bladeGrad.addColorStop(0, "#e5e7eb");
  bladeGrad.addColorStop(0.5, "#f9fafb");
  bladeGrad.addColorStop(1, "#9ca3af");
  ctx.fillStyle = bladeGrad;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.9);
  ctx.lineTo(1.5, -r * 0.1);
  ctx.lineTo(-0.5, -r * 0.1);
  ctx.closePath();
  ctx.fill();
  // guard (tsuba)
  ctx.fillStyle = "#78350f";
  ctx.beginPath();
  ctx.ellipse(0.5, -r * 0.08, 3, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // handle
  ctx.fillStyle = "#1c1917";
  ctx.fillRect(-0.8, -r * 0.06, 2.5, r * 0.55);
  // wrap pattern on handle
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 0.7;
  for (let s = 0; s < 4; s++) {
    const sy = -r * 0.04 + s * 3;
    ctx.beginPath();
    ctx.moveTo(-0.8, sy);
    ctx.lineTo(1.7, sy + 1.5);
    ctx.stroke();
  }
  ctx.restore();

  // --- fierce eyes on the frame top area ---
  const eyeY = fy + 5;
  for (const side of [-1, 1]) {
    const ex = cx + side * 4;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, 2.2, 1.5, side * -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a0e05";
    ctx.beginPath();
    ctx.arc(ex + side * 0.3, eyeY, 0.9, 0, Math.PI * 2);
    ctx.fill();
    // angry brow
    ctx.strokeStyle = "#5c3310";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ex - side * 2.5, eyeY - 2.5);
    ctx.lineTo(ex + side * 1.5, eyeY - 3.5);
    ctx.stroke();
  }
}


/**
 * drawCalculator  -  "電卓ロボ"
 * id: "calculator"  |  color: "#475569"  |  r: 18
 * Calculator-shaped robot with LCD face, button grid, antenna.
 */
export function drawCalculator(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const bw = r * 1.4;
  const bh = r * 1.9;
  const bx = cx - bw / 2;
  const by = cy - bh / 2;

  // --- body (calculator housing) ---
  const bodyGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
  bodyGrad.addColorStop(0, lighter(col, 30));
  bodyGrad.addColorStop(0.4, col);
  bodyGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 3);
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // metallic edge highlight
  ctx.strokeStyle = lighter(col, 50);
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.roundRect(bx + 1, by + 1, bw - 2, bh - 2, 2.5);
  ctx.stroke();

  // --- antenna ---
  const antX = cx;
  const antY = by - 1;
  const antBob = Math.sin(t * 4) * 1.5;
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(antX, antY);
  ctx.lineTo(antX, antY - 7 + antBob);
  ctx.stroke();
  // antenna ball
  const ballGrad = ctx.createRadialGradient(antX, antY - 8 + antBob, 0, antX, antY - 8 + antBob, 2.5);
  ballGrad.addColorStop(0, "#f87171");
  ballGrad.addColorStop(1, "#dc2626");
  ctx.fillStyle = ballGrad;
  ctx.beginPath();
  ctx.arc(antX, antY - 8 + antBob, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // blink pulse
  const blink = (Math.sin(t * 6) + 1) * 0.3;
  ctx.fillStyle = `rgba(248,113,113,${blink})`;
  ctx.beginPath();
  ctx.arc(antX, antY - 8 + antBob, 4, 0, Math.PI * 2);
  ctx.fill();

  // --- LCD screen face ---
  const sw = bw - 6;
  const sh = bh * 0.28;
  const sx = bx + 3;
  const sy = by + 4;
  const screenGrad = ctx.createLinearGradient(sx, sy, sx, sy + sh);
  screenGrad.addColorStop(0, "#a7f3d0");
  screenGrad.addColorStop(1, "#6ee7b7");
  ctx.fillStyle = screenGrad;
  ctx.beginPath();
  ctx.roundRect(sx, sy, sw, sh, 1.5);
  ctx.fill();
  ctx.strokeStyle = "#064e3b";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // blinking numbers on screen
  ctx.fillStyle = "#064e3b";
  ctx.font = `bold ${Math.floor(sh * 0.6)}px monospace`;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const nums = ["3.14159", "2.71828", "1.41421", "0.57721", "42"];
  const idx = Math.floor((t * 0.8) % nums.length);
  const displayNum = nums[idx];
  const screenFlicker = Math.sin(t * 12) > 0.92 ? 0.4 : 1;
  ctx.globalAlpha = screenFlicker;
  ctx.fillText(displayNum, sx + sw - 2, sy + sh / 2);
  ctx.globalAlpha = 1;

  // robot eyes on screen
  const eyeScreenY = sy + sh * 0.42;
  for (const side of [-1, 1]) {
    const ex = cx + side * (sw * 0.2);
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    ctx.arc(ex, eyeScreenY, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // pupil glint
    ctx.fillStyle = "#a7f3d0";
    ctx.beginPath();
    ctx.arc(ex + 0.4, eyeScreenY - 0.4, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- button grid (4x4) ---
  const gridTop = sy + sh + 3;
  const gridLeft = bx + 3;
  const gridW = bw - 6;
  const gridH = bh - sh - 11;
  const cols = 4;
  const rows = 4;
  const gap = 1.2;
  const btnW = (gridW - gap * (cols + 1)) / cols;
  const btnH = (gridH - gap * (rows + 1)) / rows;
  const btnColors = [
    ["#ef4444", "#f97316", "#eab308", "#22c55e"],
    ["#64748b", "#64748b", "#64748b", "#3b82f6"],
    ["#64748b", "#64748b", "#64748b", "#3b82f6"],
    ["#64748b", "#64748b", "#64748b", "#8b5cf6"],
  ];
  const btnLabels = [
    ["C", "/", "*", "-"],
    ["7", "8", "9", "+"],
    ["4", "5", "6", "+"],
    ["1", "2", "3", "="],
  ];

  for (let row = 0; row < rows; row++) {
    for (let c = 0; c < cols; c++) {
      const kx = gridLeft + gap + c * (btnW + gap);
      const ky = gridTop + gap + row * (btnH + gap);
      const btnGrad = ctx.createLinearGradient(kx, ky, kx, ky + btnH);
      btnGrad.addColorStop(0, lighter(btnColors[row][c], 30));
      btnGrad.addColorStop(1, btnColors[row][c]);
      ctx.fillStyle = btnGrad;
      ctx.beginPath();
      ctx.roundRect(kx, ky, btnW, btnH, 1);
      ctx.fill();
      // label
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.floor(btnH * 0.6)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(btnLabels[row][c], kx + btnW / 2, ky + btnH / 2);
    }
  }

  // --- robotic arms ---
  const armWave = Math.sin(t * 2 + ph) * 0.2;
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(cx + side * (bw / 2 + 1), cy + 2);
    ctx.rotate(side * (0.3 + armWave));
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(-1.5, 0, 3, r * 0.6);
    // hand/claw
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.arc(0, r * 0.6, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- robotic legs ---
  for (const side of [-1, 1]) {
    const legX = cx + side * (bw * 0.22);
    const legTop = by + bh;
    const legKick = Math.sin(t * 3 + side) * 1;
    ctx.fillStyle = "#64748b";
    ctx.fillRect(legX - 2, legTop, 4, r * 0.35 + legKick);
    // foot
    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.ellipse(legX, legTop + r * 0.35 + legKick, 3.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}


/**
 * drawPi  -  "π（パイ）" (LEGENDARY)
 * id: "pi"  |  color: "#f472b6"  |  r: 18
 * Greek π as body, cosmic aura, orbiting math symbols, starfield.
 */
export function drawPi(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  void ph;
  // --- starfield background ---
  ctx.save();
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + t * 0.3;
    const dist = r * (0.9 + 0.5 * Math.sin(t * 2 + i * 0.8));
    const sx = cx + Math.cos(angle) * dist;
    const sy = cy + Math.sin(angle) * dist;
    const starAlpha = 0.3 + 0.5 * Math.sin(t * 3 + i);
    ctx.fillStyle = `rgba(255,255,255,${starAlpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, 0.6 + Math.sin(t * 4 + i) * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // --- outer cosmic aura (layered glow) ---
  for (let layer = 3; layer >= 0; layer--) {
    const auraR = r * (1.3 + layer * 0.2);
    const pulse = Math.sin(t * 2) * 0.08;
    const alpha = 0.07 + pulse - layer * 0.015;
    const auraGrad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, auraR);
    auraGrad.addColorStop(0, `rgba(244,114,182,${alpha + 0.05})`);
    auraGrad.addColorStop(0.5, `rgba(168,85,247,${alpha})`);
    auraGrad.addColorStop(1, `rgba(168,85,247,0)`);
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, auraR, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- the π shape ---
  ctx.save();
  ctx.translate(cx, cy);

  // glow behind pi
  const piGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.8);
  piGlow.addColorStop(0, lighter(col, 60));
  piGlow.addColorStop(0.5, col);
  piGlow.addColorStop(1, "rgba(244,114,182,0)");
  ctx.fillStyle = piGlow;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
  ctx.fill();

  // horizontal bar of π
  const barY = -r * 0.35;
  const barW = r * 0.9;
  const barH = r * 0.18;
  const piGrad = ctx.createLinearGradient(-barW, barY, barW, barY + r);
  piGrad.addColorStop(0, lighter(col, 50));
  piGrad.addColorStop(0.5, col);
  piGrad.addColorStop(1, darker(col, 20));
  ctx.fillStyle = piGrad;
  ctx.beginPath();
  ctx.roundRect(-barW, barY, barW * 2, barH, 2);
  ctx.fill();

  // left leg
  const legW = r * 0.16;
  ctx.beginPath();
  ctx.roundRect(-barW * 0.55, barY + barH * 0.5, legW, r * 0.75, [0, 0, 3, 3]);
  ctx.fill();

  // right leg (slightly curved)
  ctx.beginPath();
  ctx.moveTo(barW * 0.3, barY + barH * 0.5);
  ctx.lineTo(barW * 0.3 + legW, barY + barH * 0.5);
  ctx.quadraticCurveTo(barW * 0.3 + legW + 2, barY + barH + r * 0.5, barW * 0.2 + legW, barY + barH + r * 0.65);
  ctx.lineTo(barW * 0.2, barY + barH + r * 0.6);
  ctx.quadraticCurveTo(barW * 0.28, barY + barH + r * 0.35, barW * 0.3, barY + barH * 0.5);
  ctx.fill();

  // serif nubs on top
  ctx.beginPath();
  ctx.arc(-barW, barY + barH * 0.4, barH * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(barW, barY + barH * 0.4, barH * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // highlight sheen
  ctx.fillStyle = `rgba(255,255,255,0.2)`;
  ctx.beginPath();
  ctx.roundRect(-barW + 1, barY + 1, barW * 2 - 2, barH * 0.4, 1);
  ctx.fill();

  ctx.restore();

  // --- orbiting math symbols ---
  const symbols = ["\u221E", "\u03A3", "\u221A", "\u222B", "\u0394"];
  for (let i = 0; i < symbols.length; i++) {
    const orbitAngle = t * (0.8 + i * 0.15) + (i * Math.PI * 2) / symbols.length;
    const orbitR = r * 1.15 + Math.sin(t + i) * 3;
    const ox = cx + Math.cos(orbitAngle) * orbitR;
    const oy = cy + Math.sin(orbitAngle) * orbitR * 0.6;
    const symbolAlpha = 0.5 + 0.4 * Math.sin(t * 2 + i);
    ctx.fillStyle = `rgba(232,190,255,${symbolAlpha})`;
    ctx.font = `bold ${8 + Math.sin(t + i) * 2}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(symbols[i], ox, oy);
  }

  // --- ethereal face ---
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(cx + side * r * 0.2, cy - r * 0.12, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  // gentle smile
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.02, r * 0.15, 0.2, Math.PI - 0.2);
  ctx.stroke();
}


// ========================  ART SERIES  ========================

/**
 * drawCrayon  -  "クレヨン戦士"
 * id: "crayon"  |  color: "#f87171"  |  r: 14
 * Tapered crayon body, paper wrapper, colour trail, cheerful face.
 */
export function drawCrayon(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const bodyW = r * 0.7;
  const bodyH = r * 1.8;
  const topY = cy - bodyH * 0.45;
  const botY = cy + bodyH * 0.45;

  // --- colour trail on ground ---
  ctx.save();
  ctx.globalAlpha = 0.35;
  const trailWidth = r * 0.55;
  for (let i = 0; i < 6; i++) {
    const tx = cx - (i + 1) * 5 + Math.sin(t * 2 + i) * 1.5;
    const ty = botY + 2 - i * 0.3;
    const ta = 0.35 - i * 0.05;
    ctx.fillStyle = `rgba(248,113,113,${ta})`;
    ctx.beginPath();
    ctx.ellipse(tx, ty, trailWidth * (1 - i * 0.08), 1.5, -0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // --- crayon body ---
  const crayonGrad = ctx.createLinearGradient(cx - bodyW, topY, cx + bodyW, botY);
  crayonGrad.addColorStop(0, lighter(col, 40));
  crayonGrad.addColorStop(0.3, col);
  crayonGrad.addColorStop(0.7, col);
  crayonGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = crayonGrad;
  ctx.beginPath();
  ctx.roundRect(cx - bodyW / 2, topY, bodyW, bodyH, 2);
  ctx.fill();

  // shiny edge
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(cx - bodyW / 2, topY, bodyW * 0.25, bodyH);

  // --- conical tip ---
  const tipH = r * 0.55;
  const tipGrad = ctx.createLinearGradient(cx, topY - tipH, cx, topY);
  tipGrad.addColorStop(0, darker(col, 50));
  tipGrad.addColorStop(0.5, col);
  tipGrad.addColorStop(1, col);
  ctx.fillStyle = tipGrad;
  ctx.beginPath();
  ctx.moveTo(cx, topY - tipH);
  ctx.lineTo(cx + bodyW / 2, topY);
  ctx.lineTo(cx - bodyW / 2, topY);
  ctx.closePath();
  ctx.fill();
  // tip point highlight
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.moveTo(cx, topY - tipH);
  ctx.lineTo(cx - bodyW * 0.1, topY);
  ctx.lineTo(cx - bodyW * 0.25, topY);
  ctx.closePath();
  ctx.fill();

  // --- paper wrapper ---
  const wrapTop = cy - bodyH * 0.08;
  const wrapH = bodyH * 0.32;
  ctx.fillStyle = "#fef3c7";
  ctx.beginPath();
  ctx.roundRect(cx - bodyW / 2 - 0.5, wrapTop, bodyW + 1, wrapH, 1);
  ctx.fill();
  // label stripe
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(cx - bodyW / 2 + 1, wrapTop + wrapH * 0.3, bodyW - 2, 2);
  // wavy bottom edge of wrapper
  ctx.strokeStyle = "#fef3c7";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let wx = cx - bodyW / 2; wx <= cx + bodyW / 2; wx += 2) {
    const wy = wrapTop + wrapH + Math.sin((wx - cx) * 1.2 + t * 3) * 1;
    if (wx === cx - bodyW / 2) ctx.moveTo(wx, wy);
    else ctx.lineTo(wx, wy);
  }
  ctx.stroke();

  // --- cheerful face ---
  // eyes
  const eyeY = cy - bodyH * 0.18;
  for (const side of [-1, 1]) {
    const ex = cx + side * bodyW * 0.2;
    ctx.fillStyle = "#1f2937";
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, 1.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // sparkle
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ex + 0.5, eyeY - 0.7, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  // cheeks
  ctx.fillStyle = "rgba(252,165,165,0.5)";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(cx + side * bodyW * 0.32, eyeY + 2.5, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  // smile
  ctx.strokeStyle = "#1f2937";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(cx, eyeY + 2, 2.5, 0.3, Math.PI - 0.3);
  ctx.stroke();

  // --- small arms ---
  const armSwing = Math.sin(t * 3 + ph) * 0.3;
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(cx + side * (bodyW / 2), cy);
    ctx.rotate(side * (0.5 + armSwing * side));
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.roundRect(-1.2, 0, 2.4, r * 0.4, 1);
    ctx.fill();
    ctx.restore();
  }

  // --- paint mark footprints ---
  const stepOffset = (t * 30) % 12;
  for (let s = 0; s < 2; s++) {
    const fx = cx + (s === 0 ? -2 : 2);
    const fy = botY + 3 - stepOffset + s * 6;
    ctx.fillStyle = `rgba(248,113,113,${0.3 - s * 0.1})`;
    ctx.beginPath();
    ctx.ellipse(fx, fy, 2, 1, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}


/**
 * drawPalette  -  "パレットウィザード" (EPIC)
 * id: "palette"  |  color: "#c084fc"  |  r: 17
 * Artist palette body, paint blobs, paintbrush wand, wizard hat, magic particles.
 */
export function drawPalette(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  void ph; void col;
  // --- magic paint particles ---
  for (let p = 0; p < 10; p++) {
    const pAngle = (p / 10) * Math.PI * 2 + t * 1.5;
    const pDist = r * 0.6 + r * 0.7 * Math.abs(Math.sin(t + p * 1.3));
    const px = cx + Math.cos(pAngle) * pDist;
    const py = cy + Math.sin(pAngle) * pDist * 0.7;
    const pAlpha = 0.3 + 0.5 * Math.sin(t * 3 + p);
    const particleColors = ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#c084fc"];
    ctx.fillStyle = particleColors[p % 5].replace(")", `,${pAlpha})`).replace("rgb", "rgba").replace("#", "");
    // Actually just use direct alpha
    ctx.globalAlpha = pAlpha;
    ctx.fillStyle = particleColors[p % 5];
    ctx.beginPath();
    ctx.arc(px, py, 1 + Math.sin(t * 2 + p) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // --- palette body (oval) ---
  ctx.save();
  ctx.translate(cx, cy + 2);
  const palGrad = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 0.95);
  palGrad.addColorStop(0, "#d4a574");
  palGrad.addColorStop(0.5, "#c8874a");
  palGrad.addColorStop(1, "#a0522d");
  ctx.fillStyle = palGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.95, r * 0.65, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8b4513";
  ctx.lineWidth = 1;
  ctx.stroke();

  // wood grain lines
  ctx.strokeStyle = "rgba(139,69,19,0.2)";
  ctx.lineWidth = 0.5;
  for (let g = -3; g <= 3; g++) {
    ctx.beginPath();
    ctx.ellipse(g * 2, g, r * 0.7 - Math.abs(g) * 3, r * 0.35, -0.15, 0, Math.PI * 2);
    ctx.stroke();
  }

  // thumb hole
  ctx.fillStyle = "rgba(30,20,10,0.6)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.5, r * 0.15, r * 0.15, r * 0.12, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#6b3a1f";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // --- paint blobs ---
  const blobs: [number, number, string, number][] = [
    [-r * 0.15, -r * 0.3, "#ef4444", 3.5],
    [r * 0.3, -r * 0.25, "#3b82f6", 3],
    [r * 0.55, -r * 0.05, "#eab308", 2.8],
    [r * 0.15, r * 0.15, "#22c55e", 2.6],
    [-r * 0.25, r * 0.02, "#c084fc", 2.5],
  ];
  for (const [blobX, blobY, blobCol, blobR] of blobs) {
    const bg = ctx.createRadialGradient(blobX - 0.5, blobY - 0.5, 0, blobX, blobY, blobR);
    bg.addColorStop(0, lighter(blobCol, 60));
    bg.addColorStop(0.6, blobCol);
    bg.addColorStop(1, darker(blobCol, 30));
    ctx.fillStyle = bg;
    ctx.beginPath();
    // irregular blob shape
    for (let a = 0; a < Math.PI * 2; a += 0.3) {
      const br = blobR * (0.85 + 0.2 * Math.sin(a * 3 + t * 2));
      const px2 = blobX + Math.cos(a) * br;
      const py2 = blobY + Math.sin(a) * br;
      if (a === 0) ctx.moveTo(px2, py2);
      else ctx.lineTo(px2, py2);
    }
    ctx.closePath();
    ctx.fill();
    // wet highlight
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(blobX - blobR * 0.25, blobY - blobR * 0.25, blobR * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // --- wizard hat ---
  const hatX = cx;
  const hatY = cy - r * 0.6;
  const hatGrad = ctx.createLinearGradient(hatX, hatY - r * 0.8, hatX, hatY + 2);
  hatGrad.addColorStop(0, "#7c3aed");
  hatGrad.addColorStop(0.5, "#6d28d9");
  hatGrad.addColorStop(1, "#4c1d95");
  ctx.fillStyle = hatGrad;
  // hat cone
  ctx.beginPath();
  ctx.moveTo(hatX, hatY - r * 0.8);
  ctx.quadraticCurveTo(hatX + r * 0.15, hatY - r * 0.3, hatX + r * 0.55, hatY + 2);
  ctx.lineTo(hatX - r * 0.55, hatY + 2);
  ctx.quadraticCurveTo(hatX - r * 0.15, hatY - r * 0.3, hatX, hatY - r * 0.8);
  ctx.fill();
  // hat brim
  ctx.fillStyle = "#4c1d95";
  ctx.beginPath();
  ctx.ellipse(hatX, hatY + 2, r * 0.65, r * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  // hat band
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(hatX - r * 0.45, hatY - 1, r * 0.9, 2.5);
  // stars on hat
  const starPositions: [number, number][] = [
    [hatX - r * 0.15, hatY - r * 0.45],
    [hatX + r * 0.1, hatY - r * 0.25],
    [hatX - r * 0.05, hatY - r * 0.6],
  ];
  for (const [starX, starY] of starPositions) {
    const starBright = 0.5 + 0.5 * Math.sin(t * 3 + starX);
    ctx.fillStyle = `rgba(251,191,36,${starBright})`;
    ctx.beginPath();
    // tiny 4-point star
    for (let sp = 0; sp < 8; sp++) {
      const sa = (sp / 8) * Math.PI * 2;
      const sr = sp % 2 === 0 ? 1.5 : 0.6;
      const spx = starX + Math.cos(sa) * sr;
      const spy = starY + Math.sin(sa) * sr;
      if (sp === 0) ctx.moveTo(spx, spy);
      else ctx.lineTo(spx, spy);
    }
    ctx.closePath();
    ctx.fill();
  }

  // --- paintbrush wand ---
  ctx.save();
  ctx.translate(cx + r * 0.7, cy + r * 0.15);
  const wandAngle = -0.6 + Math.sin(t * 2) * 0.15;
  ctx.rotate(wandAngle);
  // handle
  const handleGrad = ctx.createLinearGradient(0, 0, 0, r * 1.1);
  handleGrad.addColorStop(0, "#a0522d");
  handleGrad.addColorStop(1, "#6b3a1f");
  ctx.fillStyle = handleGrad;
  ctx.fillRect(-1.2, 0, 2.4, r * 1.1);
  // ferrule (metal band)
  ctx.fillStyle = "#c0c0c0";
  ctx.fillRect(-1.8, -2, 3.6, 3);
  // bristles
  const bristleCols = ["#ef4444", "#c084fc", "#3b82f6"];
  for (let b = 0; b < 5; b++) {
    ctx.fillStyle = bristleCols[b % bristleCols.length];
    const bx = -1.5 + b * 0.7;
    ctx.fillRect(bx, -5, 0.7, 3.5);
  }
  // paint drip from brush
  const dripY = -5 + Math.sin(t * 4) * 1;
  ctx.fillStyle = "#c084fc";
  ctx.beginPath();
  ctx.arc(0, dripY - 1, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- face on palette ---
  const faceY = cy + 1;
  // eyes
  for (const side of [-1, 1]) {
    const ex = cx + side * r * 0.18;
    ctx.fillStyle = "#1f2937";
    ctx.beginPath();
    ctx.arc(ex, faceY, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ex + 0.4, faceY - 0.5, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // wise smile
  ctx.strokeStyle = "#5b3412";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(cx, faceY + 2, 2.5, 0.2, Math.PI - 0.2);
  ctx.stroke();
}


/**
 * drawNote  -  "音符フェアリー"
 * id: "note"  |  color: "#f0abfc"  |  r: 12
 * Musical eighth note (♪) fairy, sparkle trail, sound wave rings.
 */
export function drawNote(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const bounce = Math.sin(t * 3 + ph) * r * 0.1;
  const drawCx = cx;
  const drawCy = cy + bounce;

  // --- sound wave rings ---
  for (let ring = 0; ring < 3; ring++) {
    const ringPhase = (t * 2 + ring * 0.8) % 3;
    const ringR = r * 0.6 + ringPhase * r * 0.4;
    const ringAlpha = Math.max(0, 0.35 - ringPhase * 0.12);
    ctx.strokeStyle = `rgba(240,171,252,${ringAlpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(drawCx, drawCy, ringR, -0.6, 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(drawCx, drawCy, ringR, Math.PI - 0.6, Math.PI + 0.6);
    ctx.stroke();
  }

  // --- sparkle trail ---
  for (let s = 0; s < 8; s++) {
    const sparkleAge = (t * 1.5 + s * 0.5) % 4;
    const sx = drawCx - sparkleAge * 3 + Math.sin(s * 2.1 + t) * 3;
    const sy = drawCy + sparkleAge * 2 + Math.cos(s * 1.7 + t) * 2;
    const sAlpha = Math.max(0, 0.6 - sparkleAge * 0.15);
    const sSize = (0.8 + Math.sin(t * 4 + s) * 0.4) * (1 - sparkleAge * 0.2);
    if (sSize > 0.1) {
      ctx.fillStyle = `rgba(255,255,255,${sAlpha})`;
      // 4-point sparkle
      ctx.beginPath();
      for (let sp = 0; sp < 8; sp++) {
        const sa = (sp / 8) * Math.PI * 2 + t;
        const sd = sp % 2 === 0 ? sSize * 2 : sSize * 0.5;
        const spx = sx + Math.cos(sa) * sd;
        const spy = sy + Math.sin(sa) * sd;
        if (sp === 0) ctx.moveTo(spx, spy);
        else ctx.lineTo(spx, spy);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  // --- note head (round body) ---
  const headR = r * 0.5;
  const headX = drawCx;
  const headY = drawCy + r * 0.25;
  const headGrad = ctx.createRadialGradient(headX - 1, headY - 1, 0, headX, headY, headR);
  headGrad.addColorStop(0, lighter(col, 60));
  headGrad.addColorStop(0.5, col);
  headGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.ellipse(headX, headY, headR * 1.15, headR * 0.85, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // highlight sheen
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.ellipse(headX - headR * 0.25, headY - headR * 0.2, headR * 0.5, headR * 0.3, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // --- cute face on note head ---
  const faceScale = headR * 0.35;
  // eyes
  for (const side of [-1, 1]) {
    const ex = headX + side * faceScale * 0.9;
    const ey = headY - faceScale * 0.15;
    ctx.fillStyle = "#1f2937";
    ctx.beginPath();
    ctx.ellipse(ex, ey, faceScale * 0.28, faceScale * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    // sparkle in eye
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ex + faceScale * 0.08, ey - faceScale * 0.12, faceScale * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }
  // tiny mouth
  ctx.fillStyle = "#e879a0";
  ctx.beginPath();
  ctx.arc(headX, headY + faceScale * 0.4, faceScale * 0.25, 0, Math.PI);
  ctx.fill();
  // blush spots
  ctx.fillStyle = "rgba(252,165,165,0.4)";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(headX + side * faceScale * 1.3, headY + faceScale * 0.25, faceScale * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- stem ---
  const stemX = headX + headR * 0.9;
  const stemBot = headY - headR * 0.3;
  const stemTop = drawCy - r * 0.75;
  const stemGrad = ctx.createLinearGradient(stemX, stemTop, stemX, stemBot);
  stemGrad.addColorStop(0, lighter(col, 30));
  stemGrad.addColorStop(1, col);
  ctx.fillStyle = stemGrad;
  ctx.fillRect(stemX - 1, stemTop, 2, stemBot - stemTop);

  // --- flag (fairy wing) ---
  const flagWave = Math.sin(t * 4) * 0.15;
  ctx.save();
  ctx.translate(stemX + 1, stemTop);
  ctx.rotate(flagWave);

  // wing-like flag with gradient
  const wingGrad = ctx.createLinearGradient(0, 0, r * 0.7, r * 0.4);
  wingGrad.addColorStop(0, `rgba(240,171,252,0.9)`);
  wingGrad.addColorStop(0.5, `rgba(216,140,240,0.7)`);
  wingGrad.addColorStop(1, `rgba(192,132,252,0.3)`);
  ctx.fillStyle = wingGrad;

  // first flag curve
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(r * 0.6, r * 0.05, r * 0.5, r * 0.35);
  ctx.quadraticCurveTo(r * 0.25, r * 0.25, 0, r * 0.35);
  ctx.closePath();
  ctx.fill();

  // second flag curve (overlapping for wing effect)
  ctx.fillStyle = `rgba(240,171,252,0.5)`;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.2);
  ctx.quadraticCurveTo(r * 0.5, r * 0.25, r * 0.4, r * 0.55);
  ctx.quadraticCurveTo(r * 0.2, r * 0.45, 0, r * 0.55);
  ctx.closePath();
  ctx.fill();

  // wing vein lines
  ctx.strokeStyle = `rgba(255,255,255,0.3)`;
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.05);
  ctx.quadraticCurveTo(r * 0.3, r * 0.1, r * 0.35, r * 0.25);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, r * 0.15);
  ctx.quadraticCurveTo(r * 0.2, r * 0.2, r * 0.25, r * 0.35);
  ctx.stroke();

  ctx.restore();

  // --- outer glow ---
  const glowAlpha = 0.08 + 0.04 * Math.sin(t * 2);
  const outerGlow = ctx.createRadialGradient(drawCx, drawCy, r * 0.3, drawCx, drawCy, r * 1.2);
  outerGlow.addColorStop(0, `rgba(240,171,252,${glowAlpha + 0.04})`);
  outerGlow.addColorStop(1, `rgba(240,171,252,0)`);
  ctx.fillStyle = outerGlow;
  ctx.beginPath();
  ctx.arc(drawCx, drawCy, r * 1.2, 0, Math.PI * 2);
  ctx.fill();
}
