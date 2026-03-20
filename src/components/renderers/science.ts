// science.ts - Science-themed tower defense character renderers
// Canvas2D vector draw functions for 6 science characters

function hexToRgb(hex: string) {
  return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) };
}
function darker(hex: string, n: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.max(0,r-n)},${Math.max(0,g-n)},${Math.max(0,b-n)})`;
}
function lighter(hex: string, n: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255,r+n)},${Math.min(255,g+n)},${Math.min(255,b+n)})`;
}

/* ------------------------------------------------------------------ */
/*  1. drawBeaker  -  "ビーカー博士"                                    */
/*     id: "beaker", color: "#6ee7b7", r: 15                          */
/* ------------------------------------------------------------------ */
export function drawBeaker(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- stubby legs --
  ctx.fillStyle = darker(col, 60);
  ctx.fillRect(-6 * s, 10 * s, 4 * s, 5 * s);
  ctx.fillRect(2 * s, 10 * s, 4 * s, 5 * s);
  // shoes
  ctx.fillStyle = darker(col, 90);
  ctx.fillRect(-7 * s, 14 * s, 5 * s, 2 * s);
  ctx.fillRect(1 * s, 14 * s, 5 * s, 2 * s);

  // -- small arms --
  const armSwing = Math.sin(t * 3 + ph) * 0.15;
  ctx.save();
  ctx.rotate(armSwing);
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(-12 * s, -2 * s, 4 * s, 3 * s);
  ctx.restore();
  ctx.save();
  ctx.rotate(-armSwing);
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(8 * s, -2 * s, 4 * s, 3 * s);
  ctx.restore();

  // -- beaker body (conical flask) --
  // glass transparency
  const glassGrad = ctx.createLinearGradient(-8 * s, -10 * s, 8 * s, 10 * s);
  glassGrad.addColorStop(0, "rgba(200,240,255,0.35)");
  glassGrad.addColorStop(0.5, "rgba(220,250,255,0.18)");
  glassGrad.addColorStop(1, "rgba(180,230,250,0.30)");

  ctx.beginPath();
  ctx.moveTo(-3 * s, -12 * s);  // top-left of neck
  ctx.lineTo(-3 * s, -6 * s);   // neck bottom-left
  ctx.lineTo(-9 * s, 10 * s);   // body bottom-left
  ctx.lineTo(9 * s, 10 * s);    // body bottom-right
  ctx.lineTo(3 * s, -6 * s);    // neck bottom-right
  ctx.lineTo(3 * s, -12 * s);   // top-right of neck
  ctx.closePath();
  ctx.fillStyle = glassGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(150,210,230,0.7)";
  ctx.lineWidth = 1.2 * s;
  ctx.stroke();

  // -- measurement lines on glass --
  ctx.strokeStyle = "rgba(100,180,210,0.5)";
  ctx.lineWidth = 0.6 * s;
  for (let i = 0; i < 4; i++) {
    const my = 8 * s - i * 4 * s;
    const frac = (10 * s - my) / (16 * s);
    const halfW = 9 * s - frac * 6 * s;
    ctx.beginPath();
    ctx.moveTo(-halfW + 1 * s, my);
    ctx.lineTo(-halfW + 4 * s, my);
    ctx.stroke();
  }

  // -- bubbling green liquid (fills bottom half) --
  const liquidTop = 1 * s;
  const { r: cr, g: cg, b: cb } = hexToRgb(col);
  const liqGrad = ctx.createLinearGradient(0, liquidTop, 0, 10 * s);
  liqGrad.addColorStop(0, `rgba(${cr},${cg},${cb},0.55)`);
  liqGrad.addColorStop(1, `rgba(${Math.max(0,cr-30)},${Math.max(0,cg-20)},${Math.max(0,cb-20)},0.75)`);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-3 * s, -6 * s);
  ctx.lineTo(-9 * s, 10 * s);
  ctx.lineTo(9 * s, 10 * s);
  ctx.lineTo(3 * s, -6 * s);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = liqGrad;
  ctx.fillRect(-10 * s, liquidTop, 20 * s, 10 * s);

  // animated bubbles
  for (let i = 0; i < 5; i++) {
    const bx = (Math.sin(t * 2 + i * 1.8 + ph) * 4) * s;
    const by = ((t * 18 + i * 40 + ph * 10) % 14 - 4) * s;
    const br = (1.0 + Math.sin(i + t) * 0.5) * s;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(t + i) * 0.15})`;
    ctx.fill();
  }
  ctx.restore();

  // -- glass highlight streak --
  ctx.beginPath();
  ctx.moveTo(-1 * s, -10 * s);
  ctx.lineTo(-5 * s, 6 * s);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();

  // -- cork / cap --
  ctx.fillStyle = "#c8a26a";
  ctx.fillRect(-3.5 * s, -14 * s, 7 * s, 3 * s);
  ctx.fillStyle = "#b08e55";
  ctx.fillRect(-3.5 * s, -13.5 * s, 7 * s, 0.6 * s);

  // -- professor glasses on the neck --
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 0.8 * s;
  // left lens
  ctx.beginPath();
  ctx.arc(-2.5 * s, -8 * s, 1.8 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(180,220,255,0.35)";
  ctx.fill();
  // right lens
  ctx.beginPath();
  ctx.arc(2.5 * s, -8 * s, 1.8 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(180,220,255,0.35)";
  ctx.fill();
  // bridge
  ctx.beginPath();
  ctx.moveTo(-0.7 * s, -8 * s);
  ctx.lineTo(0.7 * s, -8 * s);
  ctx.stroke();
  // pupils
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(-2.5 * s, -7.8 * s, 0.7 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2.5 * s, -7.8 * s, 0.7 * s, 0, Math.PI * 2);
  ctx.fill();

  // small smile
  ctx.beginPath();
  ctx.arc(0, -6 * s, 1.5 * s, 0.2, Math.PI - 0.2);
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  2. drawMagnet  -  "じしゃくン"                                      */
/*     id: "magnet", color: "#ef4444", r: 16                           */
/* ------------------------------------------------------------------ */
export function drawMagnet(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 16;
  ctx.save();
  ctx.translate(cx, cy);

  // -- stubby legs --
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(-5 * s, 10 * s, 3.5 * s, 5 * s);
  ctx.fillRect(1.5 * s, 10 * s, 3.5 * s, 5 * s);
  ctx.fillStyle = darker(col, 100);
  ctx.beginPath();
  ctx.ellipse(-3.2 * s, 15 * s, 2.5 * s, 1.2 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(3.2 * s, 15 * s, 2.5 * s, 1.2 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // -- animated magnetic field lines (curved arcs) --
  const fieldAlpha = 0.15 + Math.sin(t * 2 + ph) * 0.1;
  ctx.strokeStyle = `rgba(100,150,255,${fieldAlpha})`;
  ctx.lineWidth = 0.8 * s;
  ctx.setLineDash([2 * s, 2 * s]);
  const dashOff = (t * 20 + ph * 5) % 20;
  ctx.lineDashOffset = -dashOff;
  for (let i = 1; i <= 3; i++) {
    const arcR = (10 + i * 5) * s;
    ctx.beginPath();
    ctx.arc(0, 4 * s, arcR, -Math.PI * 0.85, -Math.PI * 0.15);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // -- U-shaped magnet body --
  const bodyGrad = ctx.createLinearGradient(-10 * s, -12 * s, 10 * s, 4 * s);
  bodyGrad.addColorStop(0, lighter(col, 30));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 40));

  ctx.lineWidth = 6 * s;
  ctx.lineCap = "round";
  ctx.strokeStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-8 * s, 10 * s);
  ctx.lineTo(-8 * s, -4 * s);
  ctx.quadraticCurveTo(-8 * s, -12 * s, 0, -12 * s);
  ctx.quadraticCurveTo(8 * s, -12 * s, 8 * s, -4 * s);
  ctx.lineTo(8 * s, 10 * s);
  ctx.stroke();

  // highlight on magnet
  ctx.lineWidth = 2 * s;
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.moveTo(-6 * s, 8 * s);
  ctx.lineTo(-6 * s, -3 * s);
  ctx.quadraticCurveTo(-6 * s, -10 * s, 0, -10 * s);
  ctx.quadraticCurveTo(6 * s, -10 * s, 6 * s, -3 * s);
  ctx.stroke();

  // -- pole tips: blue (N) on left, silver (S) on right --
  // N pole (blue)
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(-11 * s, 5 * s, 6 * s, 6 * s);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(-10.5 * s, 5.5 * s, 2 * s, 5 * s);
  // N label
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${4 * s}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("N", -8 * s, 8 * s);

  // S pole (silver)
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(5 * s, 5 * s, 6 * s, 6 * s);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(5.5 * s, 5.5 * s, 2 * s, 5 * s);
  ctx.fillStyle = "#fff";
  ctx.fillText("S", 8 * s, 8 * s);

  // -- sparks at poles --
  for (let p = -1; p <= 1; p += 2) {
    const px = p * 8 * s;
    const py = 5 * s;
    for (let k = 0; k < 3; k++) {
      const ang = -Math.PI / 2 + Math.sin(t * 5 + k * 2.1 + p + ph) * 0.6;
      const sparkLen = (2 + Math.sin(t * 7 + k * 3 + ph) * 1.5) * s;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(ang) * sparkLen, py + Math.sin(ang) * sparkLen);
      ctx.strokeStyle = `rgba(255,255,100,${0.5 + Math.sin(t * 6 + k) * 0.3})`;
      ctx.lineWidth = 0.8 * s;
      ctx.stroke();
    }
  }

  // -- face in the curve of the U --
  // eyes
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-3 * s, -6 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3 * s, -6 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(-3 * s, -5.7 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3 * s, -5.7 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  // eye shine
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-3.5 * s, -6.3 * s, 0.4 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2.5 * s, -6.3 * s, 0.4 * s, 0, Math.PI * 2);
  ctx.fill();

  // mouth - determined grin
  ctx.beginPath();
  ctx.arc(0, -3 * s, 2.5 * s, 0.15, Math.PI - 0.15);
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  3. drawBulb  -  "でんきゅうマン"                                     */
/*     id: "bulb", color: "#fde047", r: 15                             */
/* ------------------------------------------------------------------ */
export function drawBulb(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- warm glow effect (outermost) --
  const glowPulse = 0.12 + Math.sin(t * 3 + ph) * 0.06;
  const glow = ctx.createRadialGradient(0, -4 * s, 2 * s, 0, -4 * s, 18 * s);
  glow.addColorStop(0, `rgba(253,224,71,${glowPulse + 0.1})`);
  glow.addColorStop(0.5, `rgba(253,224,71,${glowPulse * 0.5})`);
  glow.addColorStop(1, "rgba(253,224,71,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(-20 * s, -24 * s, 40 * s, 40 * s);

  // -- light rays radiating outward --
  const rayCount = 8;
  for (let i = 0; i < rayCount; i++) {
    const ang = (i / rayCount) * Math.PI * 2 + t * 0.5;
    const rayLen = (10 + Math.sin(t * 4 + i * 1.5 + ph) * 3) * s;
    const rayStart = 9 * s;
    ctx.beginPath();
    ctx.moveTo(Math.cos(ang) * rayStart, -4 * s + Math.sin(ang) * rayStart);
    ctx.lineTo(Math.cos(ang) * rayLen, -4 * s + Math.sin(ang) * rayLen);
    ctx.strokeStyle = `rgba(253,224,71,${0.25 + Math.sin(t * 3 + i) * 0.12})`;
    ctx.lineWidth = 1.5 * s;
    ctx.stroke();
  }

  // -- glass bulb (round top) --
  const bulbGrad = ctx.createRadialGradient(-2 * s, -7 * s, 1 * s, 0, -4 * s, 9 * s);
  bulbGrad.addColorStop(0, lighter(col, 60));
  bulbGrad.addColorStop(0.6, col);
  bulbGrad.addColorStop(1, darker(col, 30));
  ctx.beginPath();
  ctx.arc(0, -4 * s, 8 * s, -Math.PI, 0, false);
  ctx.quadraticCurveTo(8 * s, 4 * s, 4 * s, 6 * s);
  ctx.lineTo(-4 * s, 6 * s);
  ctx.quadraticCurveTo(-8 * s, 4 * s, -8 * s, -4 * s);
  ctx.closePath();
  ctx.fillStyle = bulbGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // glass highlight
  ctx.beginPath();
  ctx.arc(-3 * s, -7 * s, 3 * s, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();

  // -- filament inside (animated) --
  ctx.strokeStyle = `rgba(255,180,50,${0.6 + Math.sin(t * 6 + ph) * 0.3})`;
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(-2 * s, 4 * s);
  for (let i = 0; i < 6; i++) {
    const fx = -2 * s + (i / 5) * 4 * s;
    const fy = 4 * s - 4 * s - (i % 2 === 0 ? 3 : 0) * s;
    ctx.lineTo(fx, fy);
  }
  ctx.stroke();
  // filament glow
  ctx.strokeStyle = `rgba(255,220,100,${0.3 + Math.sin(t * 6 + ph) * 0.2})`;
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.moveTo(-2 * s, 4 * s);
  for (let i = 0; i < 6; i++) {
    const fx = -2 * s + (i / 5) * 4 * s;
    const fy = 4 * s - 4 * s - (i % 2 === 0 ? 3 : 0) * s;
    ctx.lineTo(fx, fy);
  }
  ctx.stroke();

  // -- metal screw base (body/legs) --
  const baseGrad = ctx.createLinearGradient(-4 * s, 6 * s, 4 * s, 6 * s);
  baseGrad.addColorStop(0, "#9ca3af");
  baseGrad.addColorStop(0.3, "#d1d5db");
  baseGrad.addColorStop(0.7, "#d1d5db");
  baseGrad.addColorStop(1, "#6b7280");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(-4 * s, 6 * s, 8 * s, 3 * s);
  // thread lines on base
  ctx.strokeStyle = "#6b7280";
  ctx.lineWidth = 0.6 * s;
  for (let i = 0; i < 3; i++) {
    const ty = 7 * s + i * 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(-4 * s, ty);
    ctx.lineTo(4 * s, ty + 0.8 * s);
    ctx.stroke();
  }
  // base bottom (contact point)
  ctx.fillStyle = "#4b5563";
  ctx.beginPath();
  ctx.moveTo(-4 * s, 9 * s);
  ctx.lineTo(-3 * s, 12 * s);
  ctx.lineTo(3 * s, 12 * s);
  ctx.lineTo(4 * s, 9 * s);
  ctx.closePath();
  ctx.fill();

  // -- legs from base --
  ctx.fillStyle = "#6b7280";
  ctx.fillRect(-3.5 * s, 12 * s, 2.5 * s, 3 * s);
  ctx.fillRect(1 * s, 12 * s, 2.5 * s, 3 * s);
  ctx.fillStyle = "#4b5563";
  ctx.fillRect(-4 * s, 14.5 * s, 3.5 * s, 1.5 * s);
  ctx.fillRect(0.5 * s, 14.5 * s, 3.5 * s, 1.5 * s);

  // -- face on the glass part --
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(-3 * s, -4 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3 * s, -4 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  // eye shine
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-3.4 * s, -4.5 * s, 0.45 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2.6 * s, -4.5 * s, 0.45 * s, 0, Math.PI * 2);
  ctx.fill();
  // cheerful open mouth
  ctx.beginPath();
  ctx.arc(0, -1.5 * s, 2 * s, 0.1, Math.PI - 0.1);
  ctx.fillStyle = "#92400e";
  ctx.fill();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 0.5 * s;
  ctx.stroke();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  4. drawTelescope  -  "望遠鏡スナイパー"                              */
/*     id: "telescope", color: "#a78bfa", r: 14                        */
/* ------------------------------------------------------------------ */
export function drawTelescope(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 14;
  ctx.save();
  ctx.translate(cx, cy);

  // -- small stars around --
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2 + t * 0.3 + ph;
    const dist = (12 + Math.sin(t * 2 + i * 1.7) * 2) * s;
    const sx = Math.cos(ang) * dist;
    const sy = Math.sin(ang) * dist - 2 * s;
    const starSize = (0.8 + Math.sin(t * 4 + i * 2.5) * 0.4) * s;
    ctx.fillStyle = `rgba(255,255,220,${0.4 + Math.sin(t * 3 + i * 1.3) * 0.3})`;
    // 4-point star
    ctx.beginPath();
    ctx.moveTo(sx, sy - starSize * 2);
    ctx.lineTo(sx + starSize * 0.5, sy - starSize * 0.5);
    ctx.lineTo(sx + starSize * 2, sy);
    ctx.lineTo(sx + starSize * 0.5, sy + starSize * 0.5);
    ctx.lineTo(sx, sy + starSize * 2);
    ctx.lineTo(sx - starSize * 0.5, sy + starSize * 0.5);
    ctx.lineTo(sx - starSize * 2, sy);
    ctx.lineTo(sx - starSize * 0.5, sy - starSize * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  // -- tripod legs --
  ctx.strokeStyle = "#78716c";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, 4 * s);
  ctx.lineTo(-7 * s, 14 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 4 * s);
  ctx.lineTo(7 * s, 14 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 4 * s);
  ctx.lineTo(0, 14 * s);
  ctx.stroke();
  // tripod feet
  ctx.fillStyle = "#57534e";
  ctx.beginPath(); ctx.arc(-7 * s, 14 * s, 1.2 * s, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(7 * s, 14 * s, 1.2 * s, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, 14 * s, 1.2 * s, 0, Math.PI * 2); ctx.fill();

  // -- mounting hub --
  ctx.fillStyle = "#57534e";
  ctx.beginPath();
  ctx.arc(0, 4 * s, 2.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // -- telescope tube (tilted upward) --
  ctx.save();
  ctx.translate(0, 2 * s);
  ctx.rotate(-0.35);

  // main tube
  const tubeGrad = ctx.createLinearGradient(0, -3 * s, 0, 3 * s);
  tubeGrad.addColorStop(0, lighter(col, 40));
  tubeGrad.addColorStop(0.5, col);
  tubeGrad.addColorStop(1, darker(col, 50));
  ctx.fillStyle = tubeGrad;
  ctx.beginPath();
  ctx.moveTo(-12 * s, -3 * s);
  ctx.lineTo(10 * s, -2.2 * s);
  ctx.lineTo(10 * s, 2.2 * s);
  ctx.lineTo(-12 * s, 3 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();

  // brass band rings
  ctx.fillStyle = "#d4a053";
  ctx.fillRect(-6 * s, -3.3 * s, 1.5 * s, 6.6 * s);
  ctx.fillRect(2 * s, -2.5 * s, 1.2 * s, 5 * s);
  ctx.fillRect(7 * s, -2.4 * s, 1 * s, 4.8 * s);

  // tube highlight
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(-12 * s, -2.8 * s, 22 * s, 1.5 * s);

  // -- lens at front (left side) with glint --
  ctx.beginPath();
  ctx.ellipse(-12 * s, 0, 1.2 * s, 3.2 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#60a5fa";
  ctx.fill();
  ctx.strokeStyle = "#d4a053";
  ctx.lineWidth = 1 * s;
  ctx.stroke();
  // lens glint
  const glintAlpha = 0.4 + Math.sin(t * 3 + ph) * 0.3;
  ctx.beginPath();
  ctx.ellipse(-12.3 * s, -1 * s, 0.5 * s, 1.2 * s, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,${glintAlpha})`;
  ctx.fill();

  // -- eyepiece at back --
  ctx.fillStyle = "#1e1b4b";
  ctx.fillRect(10 * s, -2.8 * s, 3 * s, 5.6 * s);
  ctx.fillStyle = "#312e81";
  ctx.fillRect(10.5 * s, -2.3 * s, 1 * s, 4.6 * s);

  // -- crosshair visible at lens --
  ctx.strokeStyle = `rgba(255,100,100,${0.4 + Math.sin(t * 2) * 0.2})`;
  ctx.lineWidth = 0.4 * s;
  ctx.beginPath();
  ctx.moveTo(-12 * s, -2 * s);
  ctx.lineTo(-12 * s, 2 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-14 * s, 0);
  ctx.lineTo(-10 * s, 0);
  ctx.stroke();

  // -- face on tube body --
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-2 * s, -0.5 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3 * s, -0.5 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1e1b4b";
  ctx.beginPath();
  ctx.arc(-1.8 * s, -0.3 * s, 0.8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3.2 * s, -0.3 * s, 0.8 * s, 0, Math.PI * 2);
  ctx.fill();
  // focused expression - small straight mouth
  ctx.strokeStyle = "#1e1b4b";
  ctx.lineWidth = 0.6 * s;
  ctx.beginPath();
  ctx.moveTo(-0.5 * s, 1.5 * s);
  ctx.lineTo(1.5 * s, 1.5 * s);
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  5. drawTesttube  -  "試験管ボマー"                                   */
/*     id: "testtube", color: "#34d399", r: 13                         */
/* ------------------------------------------------------------------ */
export function drawTesttube(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 13;
  ctx.save();
  ctx.translate(cx, cy);

  // -- legs (small, angled because tube tilts) --
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(-3 * s, 11 * s, 2.5 * s, 4 * s);
  ctx.fillRect(2 * s, 12 * s, 2.5 * s, 3 * s);
  ctx.fillStyle = darker(col, 90);
  ctx.fillRect(-3.5 * s, 14.5 * s, 3.5 * s, 1.5 * s);
  ctx.fillRect(1.5 * s, 14.5 * s, 3.5 * s, 1.5 * s);

  // -- smoke / fumes rising (animated) --
  for (let i = 0; i < 4; i++) {
    const smokeX = (Math.sin(t * 1.5 + i * 2.1 + ph) * 3) * s;
    const smokeY = -12 * s - ((t * 10 + i * 12 + ph * 5) % 18) * s;
    const smokeR = (2 + i * 0.5 + Math.sin(t + i) * 0.5) * s;
    const smokeAlpha = Math.max(0, 0.3 - ((t * 10 + i * 12 + ph * 5) % 18) / 60);
    ctx.beginPath();
    ctx.arc(smokeX, smokeY, smokeR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,180,180,${smokeAlpha})`;
    ctx.fill();
  }

  // -- explosive sparks --
  for (let i = 0; i < 3; i++) {
    const sparkAng = t * 5 + i * 2.3 + ph;
    const sparkDist = (5 + Math.sin(t * 7 + i * 3) * 3) * s;
    const sx = Math.cos(sparkAng) * sparkDist;
    const sy = -13 * s + Math.sin(sparkAng) * sparkDist * 0.5;
    const sparkAlpha = 0.5 + Math.sin(t * 8 + i * 2) * 0.4;
    ctx.fillStyle = `rgba(255,200,50,${sparkAlpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, 0.8 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // -- test tube body (slight tilt) --
  ctx.save();
  ctx.rotate(0.12);

  // tube shape: narrow cylinder with rounded bottom
  const tubeGrad = ctx.createLinearGradient(-4 * s, 0, 4 * s, 0);
  tubeGrad.addColorStop(0, "rgba(200,235,255,0.35)");
  tubeGrad.addColorStop(0.3, "rgba(230,250,255,0.2)");
  tubeGrad.addColorStop(0.7, "rgba(230,250,255,0.2)");
  tubeGrad.addColorStop(1, "rgba(190,225,245,0.35)");

  // tube walls
  ctx.fillStyle = tubeGrad;
  ctx.beginPath();
  ctx.moveTo(-3.5 * s, -11 * s);
  ctx.lineTo(-3.5 * s, 8 * s);
  ctx.quadraticCurveTo(-3.5 * s, 12 * s, 0, 12 * s);
  ctx.quadraticCurveTo(3.5 * s, 12 * s, 3.5 * s, 8 * s);
  ctx.lineTo(3.5 * s, -11 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(160,210,230,0.7)";
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // -- volatile liquid inside (green-orange gradient) --
  const liqTop = -2 * s + Math.sin(t * 2 + ph) * 1 * s;
  const { r: lr, g: lg, b: lb } = hexToRgb(col);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-3.5 * s, -11 * s);
  ctx.lineTo(-3.5 * s, 8 * s);
  ctx.quadraticCurveTo(-3.5 * s, 12 * s, 0, 12 * s);
  ctx.quadraticCurveTo(3.5 * s, 12 * s, 3.5 * s, 8 * s);
  ctx.lineTo(3.5 * s, -11 * s);
  ctx.closePath();
  ctx.clip();

  const liqGrad = ctx.createLinearGradient(0, liqTop, 0, 12 * s);
  liqGrad.addColorStop(0, `rgba(${lr},${lg},${lb},0.6)`);
  liqGrad.addColorStop(0.5, `rgba(255,160,50,0.5)`);
  liqGrad.addColorStop(1, `rgba(${lr},${Math.max(0,lg-40)},${Math.max(0,lb-20)},0.75)`);
  ctx.fillStyle = liqGrad;
  ctx.fillRect(-4 * s, liqTop, 8 * s, 14 * s);

  // liquid surface wobble
  ctx.beginPath();
  ctx.moveTo(-3.5 * s, liqTop);
  for (let x = -3.5; x <= 3.5; x += 0.5) {
    ctx.lineTo(x * s, liqTop + Math.sin(t * 4 + x * 2 + ph) * 0.6 * s);
  }
  ctx.lineTo(3.5 * s, liqTop + 2 * s);
  ctx.lineTo(-3.5 * s, liqTop + 2 * s);
  ctx.closePath();
  ctx.fillStyle = `rgba(255,255,255,0.15)`;
  ctx.fill();

  // bubbles in liquid
  for (let i = 0; i < 3; i++) {
    const bx = (Math.sin(t * 2.5 + i * 2.4 + ph) * 2) * s;
    const by = liqTop + ((t * 15 + i * 30) % 14) * s;
    ctx.beginPath();
    ctx.arc(bx, by, 0.8 * s, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fill();
  }
  ctx.restore();

  // glass highlight
  ctx.beginPath();
  ctx.moveTo(-2.5 * s, -10 * s);
  ctx.lineTo(-2.5 * s, 6 * s);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1.2 * s;
  ctx.stroke();

  // -- cork stopper (bouncing) --
  const corkBounce = Math.abs(Math.sin(t * 3 + ph)) * 2.5 * s;
  const corkY = -12 * s - corkBounce;
  ctx.fillStyle = "#c8a26a";
  ctx.beginPath();
  ctx.moveTo(-3 * s, corkY);
  ctx.lineTo(-2.5 * s, corkY - 3 * s);
  ctx.lineTo(2.5 * s, corkY - 3 * s);
  ctx.lineTo(3 * s, corkY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#b08e55";
  ctx.fillRect(-2.5 * s, corkY - 2 * s, 5 * s, 0.6 * s);

  // -- face on the tube --
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(-1.5 * s, -6 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1.5 * s, -6 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  // mischievous grin
  ctx.beginPath();
  ctx.arc(0, -4 * s, 1.8 * s, 0.2, Math.PI - 0.2);
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 0.7 * s;
  ctx.stroke();
  // eyebrow raised
  ctx.beginPath();
  ctx.moveTo(-2.5 * s, -8 * s);
  ctx.lineTo(-0.5 * s, -8.5 * s);
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  6. drawMicroscope  -  "顕微鏡大先生" (LEGENDARY)                    */
/*     id: "microscope", color: "#e879f9", r: 20                       */
/* ------------------------------------------------------------------ */
export function drawMicroscope(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 20;
  ctx.save();
  ctx.translate(cx, cy);

  // -- legendary glowing aura --
  const auraPulse = 0.12 + Math.sin(t * 2 + ph) * 0.06;
  for (let i = 3; i >= 1; i--) {
    const auraR = (18 + i * 4) * s;
    const auraGrad = ctx.createRadialGradient(0, 0, auraR * 0.3, 0, 0, auraR);
    auraGrad.addColorStop(0, `rgba(232,121,249,${auraPulse * (4 - i) / 3})`);
    auraGrad.addColorStop(1, "rgba(232,121,249,0)");
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, auraR, 0, Math.PI * 2);
    ctx.fill();
  }

  // -- rotating sparkle particles (legendary) --
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2 + t * 0.8 + ph;
    const dist = (16 + Math.sin(t * 2 + i * 1.1) * 3) * s;
    const px = Math.cos(ang) * dist;
    const py = Math.sin(ang) * dist;
    const pSize = (1 + Math.sin(t * 5 + i * 2) * 0.5) * s;
    ctx.fillStyle = `rgba(255,215,0,${0.5 + Math.sin(t * 4 + i) * 0.3})`;
    // diamond sparkle shape
    ctx.beginPath();
    ctx.moveTo(px, py - pSize * 2);
    ctx.lineTo(px + pSize, py);
    ctx.lineTo(px, py + pSize * 2);
    ctx.lineTo(px - pSize, py);
    ctx.closePath();
    ctx.fill();
  }

  // -- heavy base --
  const baseGrad = ctx.createLinearGradient(-10 * s, 14 * s, 10 * s, 18 * s);
  baseGrad.addColorStop(0, darker(col, 80));
  baseGrad.addColorStop(0.4, darker(col, 50));
  baseGrad.addColorStop(0.6, col);
  baseGrad.addColorStop(1, darker(col, 70));
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.moveTo(-12 * s, 16 * s);
  ctx.lineTo(-10 * s, 12 * s);
  ctx.lineTo(10 * s, 12 * s);
  ctx.lineTo(12 * s, 16 * s);
  ctx.closePath();
  ctx.fill();
  // golden accent on base
  ctx.strokeStyle = "#d4a053";
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(-11.5 * s, 15.5 * s);
  ctx.lineTo(11.5 * s, 15.5 * s);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,215,0,0.15)";
  ctx.fillRect(-10 * s, 12 * s, 20 * s, 4 * s);

  // -- stage platform --
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(-8 * s, 6 * s, 16 * s, 2.5 * s);
  // golden trim
  ctx.strokeStyle = "#d4a053";
  ctx.lineWidth = 0.6 * s;
  ctx.strokeRect(-8 * s, 6 * s, 16 * s, 2.5 * s);
  // stage clips
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(-6 * s, 5.5 * s, 1.5 * s, 1 * s);
  ctx.fillRect(4.5 * s, 5.5 * s, 1.5 * s, 1 * s);

  // -- arm (curved vertical connecting piece) --
  const armGrad = ctx.createLinearGradient(-2 * s, -10 * s, 4 * s, 12 * s);
  armGrad.addColorStop(0, lighter(col, 30));
  armGrad.addColorStop(0.5, col);
  armGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = armGrad;
  ctx.beginPath();
  ctx.moveTo(4 * s, 12 * s);
  ctx.lineTo(7 * s, 12 * s);
  ctx.lineTo(7 * s, -6 * s);
  ctx.quadraticCurveTo(7 * s, -12 * s, 2 * s, -12 * s);
  ctx.lineTo(-1 * s, -12 * s);
  ctx.quadraticCurveTo(4 * s, -12 * s, 4 * s, -6 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 0.7 * s;
  ctx.stroke();

  // golden accent line on arm
  ctx.strokeStyle = "rgba(255,215,0,0.3)";
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(5.5 * s, 10 * s);
  ctx.lineTo(5.5 * s, -5 * s);
  ctx.stroke();

  // -- eyepiece tube on top --
  const eyeGrad = ctx.createLinearGradient(-3 * s, -18 * s, 3 * s, -12 * s);
  eyeGrad.addColorStop(0, lighter(col, 20));
  eyeGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = eyeGrad;
  ctx.beginPath();
  ctx.moveTo(-2 * s, -12 * s);
  ctx.lineTo(-3 * s, -18 * s);
  ctx.lineTo(3 * s, -18 * s);
  ctx.lineTo(2 * s, -12 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();
  // eyepiece top ring
  ctx.fillStyle = "#1e1b4b";
  ctx.fillRect(-3.5 * s, -19 * s, 7 * s, 1.5 * s);
  // golden ring
  ctx.strokeStyle = "#d4a053";
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(-3.5 * s, -18.5 * s);
  ctx.lineTo(3.5 * s, -18.5 * s);
  ctx.stroke();

  // -- rotating objectives (nosepiece) --
  const objAngle = Math.sin(t * 0.5 + ph) * 0.2;
  ctx.save();
  ctx.translate(0, 4 * s);
  ctx.rotate(objAngle);
  // objective turret
  ctx.fillStyle = "#6b7280";
  ctx.beginPath();
  ctx.arc(0, 0, 2.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // three objectives
  for (let i = 0; i < 3; i++) {
    const oa = (i / 3) * Math.PI + Math.PI * 0.5;
    const ox = Math.cos(oa) * 2 * s;
    const oy = Math.sin(oa) * 2 * s;
    ctx.fillStyle = i === 0 ? "#d4a053" : darker(col, 20 + i * 20);
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + Math.cos(oa) * 4 * s, oy + Math.sin(oa) * 4 * s - 1 * s);
    ctx.lineTo(ox + Math.cos(oa) * 4 * s + 1 * s, oy + Math.sin(oa) * 4 * s + 1 * s);
    ctx.lineTo(ox + 1 * s, oy + 1 * s);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // -- energy beam from lens downward --
  const beamAlpha = 0.25 + Math.sin(t * 4 + ph) * 0.15;
  const beamGrad = ctx.createLinearGradient(0, 4 * s, 0, 8.5 * s);
  beamGrad.addColorStop(0, `rgba(200,120,255,${beamAlpha + 0.2})`);
  beamGrad.addColorStop(0.5, `rgba(232,121,249,${beamAlpha})`);
  beamGrad.addColorStop(1, `rgba(200,120,255,${beamAlpha * 0.3})`);
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(-1 * s, 4 * s);
  ctx.lineTo(-3 * s, 6 * s);
  ctx.lineTo(3 * s, 6 * s);
  ctx.lineTo(1 * s, 4 * s);
  ctx.closePath();
  ctx.fill();
  // beam glow circle on stage
  ctx.beginPath();
  ctx.arc(0, 7 * s, 3 * s, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(232,121,249,${beamAlpha * 0.6})`;
  ctx.fill();

  // -- face on the arm (majestic) --
  // eyes (large, wise)
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(3 * s, -3 * s, 2 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(8 * s, -3 * s, 2 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // irises (purple)
  ctx.fillStyle = "#7c3aed";
  ctx.beginPath();
  ctx.arc(3.2 * s, -2.7 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(8.2 * s, -2.7 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  // pupils
  ctx.fillStyle = "#1e1b4b";
  ctx.beginPath();
  ctx.arc(3.3 * s, -2.5 * s, 0.6 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(8.3 * s, -2.5 * s, 0.6 * s, 0, Math.PI * 2);
  ctx.fill();
  // eye shine
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(2.5 * s, -3.5 * s, 0.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7.5 * s, -3.5 * s, 0.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // wise, dignified smile
  ctx.beginPath();
  ctx.arc(5.5 * s, -0.5 * s, 2.5 * s, 0.15, Math.PI - 0.15);
  ctx.strokeStyle = "#4a1d6b";
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // -- golden crown / halo (legendary status) --
  const haloGlow = 0.35 + Math.sin(t * 2.5 + ph) * 0.15;
  ctx.strokeStyle = `rgba(255,215,0,${haloGlow})`;
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.ellipse(3 * s, -19 * s, 6 * s, 1.5 * s, 0, 0, Math.PI * 2);
  ctx.stroke();
  // halo inner glow
  ctx.strokeStyle = `rgba(255,240,150,${haloGlow * 0.6})`;
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.ellipse(3 * s, -19 * s, 6 * s, 1.5 * s, 0, 0, Math.PI * 2);
  ctx.stroke();

  // -- focus knobs on side --
  ctx.fillStyle = darker(col, 40);
  ctx.beginPath();
  ctx.arc(9 * s, 0, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#d4a053";
  ctx.lineWidth = 0.5 * s;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(9 * s, 3 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fillStyle = darker(col, 50);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
