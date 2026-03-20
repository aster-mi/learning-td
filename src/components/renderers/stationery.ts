// ============================================================
// stationery.ts - Vector Canvas2D draw functions for 8
// stationery-themed tower-defense characters
// ============================================================

// ---- helpers ------------------------------------------------
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

// ---- 1. drawPencil  "えんぴつ兵" ---------------------------
export function drawPencil(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  const tilt = Math.sin(t * 3) * 0.06;
  ctx.rotate(tilt);

  const bw = r * 0.6;       // body half-width
  const bh = r * 1.6;       // body half-height
  const top = -bh;
  const bot = bh * 0.4;

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.ellipse(2, bot + r * 0.35, r * 0.7, r * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs (walking)
  const legSwing = Math.sin(ph * Math.PI * 2) * r * 0.25;
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = r * 0.18;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-bw * 0.35, bot);
  ctx.lineTo(-bw * 0.35 + legSwing, bot + r * 0.45);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bw * 0.35, bot);
  ctx.lineTo(bw * 0.35 - legSwing, bot + r * 0.45);
  ctx.stroke();

  // pencil body - gradient
  const bodyGrad = ctx.createLinearGradient(-bw, 0, bw, 0);
  bodyGrad.addColorStop(0, darker(col, 25));
  bodyGrad.addColorStop(0.3, col);
  bodyGrad.addColorStop(0.7, lighter(col, 30));
  bodyGrad.addColorStop(1, darker(col, 15));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-bw, top + r * 0.5, bw * 2, bh * 1.1, r * 0.1);
  ctx.fill();

  // dark stripe on side
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-bw, top + r * 0.5, bw * 0.2, bh * 1.1);

  // eraser (pink block on top)
  ctx.fillStyle = '#f9a8c9';
  ctx.beginPath();
  ctx.roundRect(-bw, top - r * 0.05, bw * 2, r * 0.55, [r * 0.12, r * 0.12, 0, 0]);
  ctx.fill();
  ctx.fillStyle = '#e88fb5';
  ctx.fillRect(-bw, top + r * 0.35, bw * 2, r * 0.15);

  // ferrule (silver band)
  const ferrGrad = ctx.createLinearGradient(-bw, 0, bw, 0);
  ferrGrad.addColorStop(0, '#999');
  ferrGrad.addColorStop(0.4, '#ddd');
  ferrGrad.addColorStop(0.6, '#eee');
  ferrGrad.addColorStop(1, '#aaa');
  ctx.fillStyle = ferrGrad;
  ctx.fillRect(-bw, top + r * 0.5, bw * 2, r * 0.22);
  // ferrule ring lines
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(-bw, top + r * 0.55); ctx.lineTo(bw, top + r * 0.55);
  ctx.moveTo(-bw, top + r * 0.65); ctx.lineTo(bw, top + r * 0.65);
  ctx.stroke();

  // sharpened tip (triangle at bottom)
  const tipTop = bot - r * 0.05;
  const tipBot = bot + r * 0.55;
  ctx.fillStyle = '#e8c88a'; // wood
  ctx.beginPath();
  ctx.moveTo(-bw, tipTop);
  ctx.lineTo(bw, tipTop);
  ctx.lineTo(0, tipBot);
  ctx.closePath();
  ctx.fill();
  // graphite core
  ctx.fillStyle = '#444';
  ctx.beginPath();
  ctx.moveTo(-bw * 0.22, tipTop + r * 0.28);
  ctx.lineTo(bw * 0.22, tipTop + r * 0.28);
  ctx.lineTo(0, tipBot);
  ctx.closePath();
  ctx.fill();

  // face
  const faceY = top + r * 1.15;
  // eyes
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(-bw * 0.35, faceY, r * 0.1, 0, Math.PI * 2);
  ctx.arc(bw * 0.35, faceY, r * 0.1, 0, Math.PI * 2);
  ctx.fill();
  // eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-bw * 0.35 - 1, faceY - 1, r * 0.04, 0, Math.PI * 2);
  ctx.arc(bw * 0.35 - 1, faceY - 1, r * 0.04, 0, Math.PI * 2);
  ctx.fill();
  // mouth
  ctx.strokeStyle = '#555';
  ctx.lineWidth = r * 0.06;
  ctx.beginPath();
  ctx.arc(0, faceY + r * 0.12, r * 0.14, 0.1, Math.PI - 0.1);
  ctx.stroke();

  ctx.restore();
}

// ---- 2. drawEraser  "けしゴムガード" -----------------------
export function drawEraser(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  const bounce = Math.abs(Math.sin(ph * Math.PI * 2)) * r * 0.08;
  ctx.translate(0, -bounce);

  const bw = r * 1.0;
  const bh = r * 0.7;

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.ellipse(2, bh + r * 0.25 + bounce, r * 0.9, r * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();

  // stubby legs
  const legOff = Math.sin(ph * Math.PI * 2) * r * 0.18;
  ctx.fillStyle = darker(col, 40);
  ctx.beginPath();
  ctx.roundRect(-bw * 0.45 + legOff, bh - r * 0.05, r * 0.3, r * 0.35, r * 0.08);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(bw * 0.2 - legOff, bh - r * 0.05, r * 0.3, r * 0.35, r * 0.08);
  ctx.fill();

  // body - main pink block
  const bodyGrad = ctx.createLinearGradient(0, -bh, 0, bh);
  bodyGrad.addColorStop(0, lighter(col, 25));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 20));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-bw, -bh, bw * 2, bh * 2, r * 0.2);
  ctx.fill();

  // highlight edge
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath();
  ctx.roundRect(-bw, -bh, bw * 2, bh * 0.35, [r * 0.2, r * 0.2, 0, 0]);
  ctx.fill();

  // paper wrapper / sleeve band
  const bandY = -bh * 0.15;
  const bandH = bh * 0.65;
  ctx.fillStyle = '#5b8cd6';
  ctx.fillRect(-bw + 1, bandY, bw * 2 - 2, bandH);
  // wrapper edge lines
  ctx.strokeStyle = '#4470b0';
  ctx.lineWidth = 0.7;
  ctx.strokeRect(-bw + 1, bandY, bw * 2 - 2, bandH);
  // fake text lines on wrapper
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = r * 0.06;
  for (let i = 0; i < 3; i++) {
    const ly = bandY + bandH * 0.25 + i * r * 0.2;
    const lw = bw * (0.9 - i * 0.15);
    ctx.beginPath();
    ctx.moveTo(-lw, ly);
    ctx.lineTo(lw, ly);
    ctx.stroke();
  }

  // stubby arms
  const armSwing = Math.sin(t * 4) * 0.15;
  ctx.fillStyle = darker(col, 15);
  // left arm
  ctx.save();
  ctx.translate(-bw, -bh * 0.05);
  ctx.rotate(-0.3 + armSwing);
  ctx.beginPath();
  ctx.roundRect(-r * 0.35, -r * 0.1, r * 0.35, r * 0.5, r * 0.08);
  ctx.fill();
  ctx.restore();
  // right arm
  ctx.save();
  ctx.translate(bw, -bh * 0.05);
  ctx.rotate(0.3 - armSwing);
  ctx.beginPath();
  ctx.roundRect(0, -r * 0.1, r * 0.35, r * 0.5, r * 0.08);
  ctx.fill();
  ctx.restore();

  // face (determined look)
  const faceY = -bh * 0.5;
  // eyes - determined / angled brows
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(-bw * 0.3, faceY, r * 0.11, 0, Math.PI * 2);
  ctx.arc(bw * 0.3, faceY, r * 0.11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-bw * 0.3 + 1, faceY - 1, r * 0.045, 0, Math.PI * 2);
  ctx.arc(bw * 0.3 + 1, faceY - 1, r * 0.045, 0, Math.PI * 2);
  ctx.fill();
  // angry brows
  ctx.strokeStyle = '#555';
  ctx.lineWidth = r * 0.08;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-bw * 0.5, faceY - r * 0.2);
  ctx.lineTo(-bw * 0.15, faceY - r * 0.12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bw * 0.5, faceY - r * 0.2);
  ctx.lineTo(bw * 0.15, faceY - r * 0.12);
  ctx.stroke();
  // determined mouth
  ctx.strokeStyle = '#666';
  ctx.lineWidth = r * 0.07;
  ctx.beginPath();
  ctx.moveTo(-r * 0.15, faceY + r * 0.22);
  ctx.lineTo(r * 0.15, faceY + r * 0.22);
  ctx.stroke();

  ctx.restore();
}

// ---- 3. drawRuler  "ものさしナイト" ------------------------
export function drawRuler(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  ctx.save();
  ctx.translate(cx, cy);

  const bodyR = r * 0.55;
  const legSwing = Math.sin(ph * Math.PI * 2) * r * 0.3;

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.ellipse(1, r * 0.9, r * 0.65, r * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs
  ctx.strokeStyle = darker(col, 70);
  ctx.lineWidth = r * 0.17;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-bodyR * 0.4, bodyR * 0.6);
  ctx.lineTo(-bodyR * 0.4 + legSwing, r * 0.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bodyR * 0.4, bodyR * 0.6);
  ctx.lineTo(bodyR * 0.4 - legSwing, r * 0.85);
  ctx.stroke();

  // shield (left hand)
  ctx.save();
  ctx.translate(-bodyR - r * 0.25, -r * 0.05);
  const shieldSwing = Math.sin(t * 2) * 0.08;
  ctx.rotate(shieldSwing);
  // shield body
  ctx.fillStyle = '#5588cc';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.4);
  ctx.lineTo(r * 0.3, -r * 0.25);
  ctx.lineTo(r * 0.3, r * 0.15);
  ctx.lineTo(0, r * 0.35);
  ctx.lineTo(-r * 0.3, r * 0.15);
  ctx.lineTo(-r * 0.3, -r * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3366aa';
  ctx.lineWidth = r * 0.05;
  ctx.stroke();
  // shield emblem (cross)
  ctx.strokeStyle = '#ffdd55';
  ctx.lineWidth = r * 0.06;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.2); ctx.lineTo(0, r * 0.2);
  ctx.moveTo(-r * 0.15, 0); ctx.lineTo(r * 0.15, 0);
  ctx.stroke();
  ctx.restore();

  // body (round torso, green-ish)
  const torsoGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, bodyR);
  torsoGrad.addColorStop(0, lighter(col, 40));
  torsoGrad.addColorStop(1, darker(col, 20));
  ctx.fillStyle = torsoGrad;
  ctx.beginPath();
  ctx.arc(0, 0, bodyR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = r * 0.05;
  ctx.stroke();

  // helmet visor
  ctx.fillStyle = darker(col, 45);
  ctx.beginPath();
  ctx.arc(0, -bodyR * 0.15, bodyR * 0.65, Math.PI + 0.3, -0.3);
  ctx.closePath();
  ctx.fill();

  // eyes (through visor)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-bodyR * 0.22, -bodyR * 0.12, r * 0.09, 0, Math.PI * 2);
  ctx.arc(bodyR * 0.22, -bodyR * 0.12, r * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(-bodyR * 0.2, -bodyR * 0.12, r * 0.05, 0, Math.PI * 2);
  ctx.arc(bodyR * 0.24, -bodyR * 0.12, r * 0.05, 0, Math.PI * 2);
  ctx.fill();

  // ruler sword (right hand) - held at angle
  ctx.save();
  ctx.translate(bodyR + r * 0.05, -r * 0.2);
  const swordBob = Math.sin(t * 3) * 0.12;
  ctx.rotate(-0.6 + swordBob);

  const rulerLen = r * 2.2;
  const rulerW = r * 0.2;
  // ruler body
  const rulerGrad = ctx.createLinearGradient(-rulerW, 0, rulerW, 0);
  rulerGrad.addColorStop(0, '#c09850');
  rulerGrad.addColorStop(0.3, '#e8c878');
  rulerGrad.addColorStop(0.7, '#e0c060');
  rulerGrad.addColorStop(1, '#b08540');
  ctx.fillStyle = rulerGrad;
  ctx.fillRect(-rulerW / 2, -rulerLen, rulerW, rulerLen);

  // tick marks
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 0.6;
  for (let i = 0; i < 14; i++) {
    const ty = -rulerLen + i * (rulerLen / 14);
    const tw = i % 5 === 0 ? rulerW * 0.45 : rulerW * 0.25;
    ctx.beginPath();
    ctx.moveTo(-tw, ty);
    ctx.lineTo(tw, ty);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
}

// ---- 4. drawScissors  "はさみアサシン" ---------------------
export function drawScissors(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  void col; void t;
  ctx.save();
  ctx.translate(cx, cy);

  const openAng = 0.2 + Math.abs(Math.sin(ph * Math.PI * 2)) * 0.45;

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.ellipse(1, r * 0.95, r * 0.55, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // quick legs (ninja)
  const legSp = Math.sin(ph * Math.PI * 2) * r * 0.35;
  ctx.strokeStyle = '#444';
  ctx.lineWidth = r * 0.12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.15, r * 0.35);
  ctx.lineTo(-r * 0.15 + legSp, r * 0.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r * 0.15, r * 0.35);
  ctx.lineTo(r * 0.15 - legSp, r * 0.85);
  ctx.stroke();

  // handle / body - two rings forming the body
  ctx.lineWidth = r * 0.14;
  // left handle ring
  ctx.strokeStyle = '#555';
  ctx.fillStyle = '#3a3a3a';
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, r * 0.15, r * 0.28, r * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // right handle ring
  ctx.beginPath();
  ctx.ellipse(r * 0.25, r * 0.15, r * 0.28, r * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // pivot screw
  ctx.fillStyle = '#888';
  ctx.beginPath();
  ctx.arc(0, -r * 0.1, r * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#aaa';
  ctx.beginPath();
  ctx.arc(0, -r * 0.1, r * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // blades
  const bladeLen = r * 1.3;
  // left blade
  ctx.save();
  ctx.translate(0, -r * 0.1);
  ctx.rotate(-openAng);
  const bladeGrad1 = ctx.createLinearGradient(0, 0, 0, -bladeLen);
  bladeGrad1.addColorStop(0, '#aaa');
  bladeGrad1.addColorStop(0.5, '#ddd');
  bladeGrad1.addColorStop(1, '#eee');
  ctx.fillStyle = bladeGrad1;
  ctx.beginPath();
  ctx.moveTo(-r * 0.08, 0);
  ctx.lineTo(r * 0.06, 0);
  ctx.lineTo(r * 0.01, -bladeLen);
  ctx.lineTo(-r * 0.03, -bladeLen);
  ctx.closePath();
  ctx.fill();
  // blade edge glint
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(r * 0.04, -r * 0.1);
  ctx.lineTo(r * 0.01, -bladeLen + r * 0.05);
  ctx.stroke();
  ctx.restore();

  // right blade
  ctx.save();
  ctx.translate(0, -r * 0.1);
  ctx.rotate(openAng);
  const bladeGrad2 = ctx.createLinearGradient(0, 0, 0, -bladeLen);
  bladeGrad2.addColorStop(0, '#999');
  bladeGrad2.addColorStop(0.5, '#ccc');
  bladeGrad2.addColorStop(1, '#e0e0e0');
  ctx.fillStyle = bladeGrad2;
  ctx.beginPath();
  ctx.moveTo(r * 0.08, 0);
  ctx.lineTo(-r * 0.06, 0);
  ctx.lineTo(-r * 0.01, -bladeLen);
  ctx.lineTo(r * 0.03, -bladeLen);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-r * 0.04, -r * 0.1);
  ctx.lineTo(-r * 0.01, -bladeLen + r * 0.05);
  ctx.stroke();
  ctx.restore();

  // ninja eyes between the handles
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.ellipse(-r * 0.18, r * 0.1, r * 0.07, r * 0.05, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(r * 0.18, r * 0.1, r * 0.07, r * 0.05, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // eye glints
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(-r * 0.16, r * 0.09, r * 0.025, 0, Math.PI * 2);
  ctx.arc(r * 0.2, r * 0.09, r * 0.025, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ---- 5. drawCompass  "コンパス魔導士" ----------------------
export function drawCompass(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  ctx.save();
  ctx.translate(cx, cy);

  const spread = 0.35 + Math.sin(t * 1.5 + ph * 0.01) * 0.08;

  // magic circle (rotating under the character)
  ctx.save();
  ctx.rotate(t * 0.8);
  ctx.strokeStyle = `rgba(129,140,248,${0.3 + Math.sin(t * 3) * 0.15})`;
  ctx.lineWidth = r * 0.05;
  ctx.beginPath();
  ctx.arc(0, r * 0.2, r * 1.3, 0, Math.PI * 2);
  ctx.stroke();
  // rune marks on circle
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const rx = Math.cos(a) * r * 1.3;
    const ry = r * 0.2 + Math.sin(a) * r * 1.3;
    ctx.fillStyle = `rgba(129,140,248,${0.4 + Math.sin(t * 2 + i) * 0.2})`;
    ctx.beginPath();
    ctx.arc(rx, ry, r * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }
  // inner circle
  ctx.beginPath();
  ctx.arc(0, r * 0.2, r * 0.85, 0, Math.PI * 2);
  ctx.stroke();
  // pentagram-ish lines
  for (let i = 0; i < 5; i++) {
    const a1 = (i / 5) * Math.PI * 2;
    const a2 = ((i + 2) / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a1) * r * 0.85, r * 0.2 + Math.sin(a1) * r * 0.85);
    ctx.lineTo(Math.cos(a2) * r * 0.85, r * 0.2 + Math.sin(a2) * r * 0.85);
    ctx.stroke();
  }
  ctx.restore();

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.beginPath();
  ctx.ellipse(1, r * 0.95, r * 0.5, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // hinge / head (top circle)
  const headY = -r * 0.7;
  ctx.fillStyle = '#666';
  ctx.beginPath();
  ctx.arc(0, headY, r * 0.2, 0, Math.PI * 2);
  ctx.fill();
  // knurled knob
  const knobGrad = ctx.createRadialGradient(0, headY, 0, 0, headY, r * 0.2);
  knobGrad.addColorStop(0, '#bbb');
  knobGrad.addColorStop(1, '#666');
  ctx.fillStyle = knobGrad;
  ctx.beginPath();
  ctx.arc(0, headY, r * 0.18, 0, Math.PI * 2);
  ctx.fill();

  // left leg (needle)
  ctx.save();
  ctx.translate(0, headY);
  ctx.rotate(-spread);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = r * 0.1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, r * 1.55);
  ctx.stroke();
  // needle point
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.moveTo(-r * 0.04, r * 1.45);
  ctx.lineTo(r * 0.04, r * 1.45);
  ctx.lineTo(0, r * 1.7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // right leg (pencil side)
  ctx.save();
  ctx.translate(0, headY);
  ctx.rotate(spread);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = r * 0.1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, r * 1.55);
  ctx.stroke();
  // pencil tip
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(-r * 0.06, r * 1.45);
  ctx.lineTo(r * 0.06, r * 1.45);
  ctx.lineTo(0, r * 1.7);
  ctx.closePath();
  ctx.fill();
  // glowing pencil tip aura
  const glowR = r * 0.2 + Math.sin(t * 5) * r * 0.08;
  const glow = ctx.createRadialGradient(0, r * 1.7, 0, 0, r * 1.7, glowR);
  glow.addColorStop(0, 'rgba(129,140,248,0.6)');
  glow.addColorStop(1, 'rgba(129,140,248,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, r * 1.7, glowR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // wizard eyes on the hinge
  ctx.fillStyle = '#ddf';
  ctx.beginPath();
  ctx.arc(-r * 0.08, headY - r * 0.02, r * 0.065, 0, Math.PI * 2);
  ctx.arc(r * 0.08, headY - r * 0.02, r * 0.065, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#226';
  ctx.beginPath();
  ctx.arc(-r * 0.07, headY - r * 0.01, r * 0.035, 0, Math.PI * 2);
  ctx.arc(r * 0.09, headY - r * 0.01, r * 0.035, 0, Math.PI * 2);
  ctx.fill();

  // wizard hat on top of hinge
  ctx.fillStyle = '#4338ca';
  ctx.beginPath();
  ctx.moveTo(0, headY - r * 0.7);
  ctx.lineTo(-r * 0.28, headY - r * 0.15);
  ctx.lineTo(r * 0.28, headY - r * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(-r * 0.3, headY - r * 0.18, r * 0.6, r * 0.08);
  // star on hat
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(0, headY - r * 0.4, r * 0.05, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ---- 6. drawStapler  "ホッチキス将軍" ---------------------
export function drawStapler(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  ctx.save();
  ctx.translate(cx, cy);

  const jawOpen = Math.abs(Math.sin(t * 4)) * 0.25;

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.ellipse(1, r * 0.65, r * 1.0, r * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs (military march)
  const legM = Math.sin(ph * Math.PI * 2) * r * 0.22;
  ctx.strokeStyle = '#333';
  ctx.lineWidth = r * 0.14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.3, r * 0.35);
  ctx.lineTo(-r * 0.3 + legM, r * 0.7);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r * 0.3, r * 0.35);
  ctx.lineTo(r * 0.3 - legM, r * 0.7);
  ctx.stroke();

  // base (bottom jaw)
  const baseGrad = ctx.createLinearGradient(0, r * 0.15, 0, r * 0.4);
  baseGrad.addColorStop(0, lighter(col, 20));
  baseGrad.addColorStop(1, darker(col, 20));
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.roundRect(-r * 0.9, r * 0.05, r * 1.8, r * 0.35, r * 0.06);
  ctx.fill();
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = r * 0.04;
  ctx.stroke();

  // staple channel (visible in front)
  ctx.fillStyle = '#333';
  ctx.fillRect(-r * 0.6, r * 0.07, r * 1.2, r * 0.06);

  // top jaw (hinged, with opening animation)
  ctx.save();
  ctx.translate(-r * 0.85, r * 0.08);
  ctx.rotate(-jawOpen);
  const topGrad = ctx.createLinearGradient(0, -r * 0.55, 0, 0);
  topGrad.addColorStop(0, lighter(col, 30));
  topGrad.addColorStop(1, col);
  ctx.fillStyle = topGrad;
  ctx.beginPath();
  ctx.roundRect(0, -r * 0.42, r * 1.75, r * 0.42, [r * 0.08, r * 0.08, r * 0.03, r * 0.03]);
  ctx.fill();
  ctx.strokeStyle = darker(col, 35);
  ctx.lineWidth = r * 0.04;
  ctx.stroke();

  // metallic sheen stripe
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(r * 0.1, -r * 0.38, r * 1.5, r * 0.1);

  // military decorations - star badges
  ctx.fillStyle = '#fbbf24';
  for (let i = 0; i < 3; i++) {
    const sx = r * 0.35 + i * r * 0.4;
    const sy = -r * 0.22;
    ctx.beginPath();
    for (let p = 0; p < 5; p++) {
      const a = (p * 4 * Math.PI) / 5 - Math.PI / 2;
      const sr = r * 0.07;
      const method = p === 0 ? 'moveTo' : 'lineTo';
      ctx[method](sx + Math.cos(a) * sr, sy + Math.sin(a) * sr);
    }
    ctx.closePath();
    ctx.fill();
  }

  // epaulette stripe
  ctx.fillStyle = '#c8a820';
  ctx.fillRect(r * 0.15, -r * 0.08, r * 1.4, r * 0.04);

  ctx.restore();

  // face on the base front
  const faceY = r * 0.22;
  // stern eyes
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, faceY, r * 0.08, r * 0.06, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.25, faceY, r * 0.08, r * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-r * 0.23, faceY - r * 0.02, r * 0.03, 0, Math.PI * 2);
  ctx.arc(r * 0.27, faceY - r * 0.02, r * 0.03, 0, Math.PI * 2);
  ctx.fill();
  // frown
  ctx.strokeStyle = '#333';
  ctx.lineWidth = r * 0.06;
  ctx.beginPath();
  ctx.arc(0, faceY + r * 0.18, r * 0.12, Math.PI + 0.3, -0.3);
  ctx.stroke();

  ctx.restore();
}

// ---- 7. drawGlue  "のりスライム" ---------------------------
export function drawGlue(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  ctx.save();
  ctx.translate(cx, cy);

  const wobble = Math.sin(t * 2.5) * r * 0.04;
  const squish = 1.0 + Math.sin(ph * Math.PI * 2) * 0.06;

  // puddle (melted base)
  ctx.fillStyle = 'rgba(253,240,140,0.35)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.6, r * 1.1 + Math.sin(t * 1.2) * r * 0.08, r * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // animated drips
  for (let i = 0; i < 3; i++) {
    const dx = (i - 1) * r * 0.5;
    const dripPhase = (t * 1.5 + i * 2.1) % 3.0;
    const dripY = r * 0.2 + dripPhase * r * 0.25;
    const dripAlpha = Math.max(0, 1 - dripPhase / 2.5);
    const dripSize = r * 0.08 * (1 - dripPhase / 4);
    if (dripAlpha > 0) {
      ctx.fillStyle = `rgba(253,240,140,${dripAlpha * 0.6})`;
      ctx.beginPath();
      ctx.ellipse(dx + wobble, dripY, dripSize, dripSize * 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // bottle body
  ctx.save();
  ctx.scale(1, squish);
  const bodyGrad = ctx.createLinearGradient(-r * 0.6, 0, r * 0.6, 0);
  bodyGrad.addColorStop(0, darker(col, 15));
  bodyGrad.addColorStop(0.3, col);
  bodyGrad.addColorStop(0.6, lighter(col, 35));
  bodyGrad.addColorStop(1, darker(col, 10));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  // bottle shape: narrow neck, wider belly melting at bottom
  ctx.moveTo(-r * 0.2, -r * 0.85);
  ctx.quadraticCurveTo(-r * 0.2, -r * 0.55, -r * 0.55, -r * 0.35);
  ctx.quadraticCurveTo(-r * 0.7 + wobble, r * 0.1, -r * 0.6, r * 0.45);
  ctx.quadraticCurveTo(-r * 0.4, r * 0.65, 0, r * 0.55 + wobble);
  ctx.quadraticCurveTo(r * 0.4, r * 0.65, r * 0.6, r * 0.45);
  ctx.quadraticCurveTo(r * 0.7 - wobble, r * 0.1, r * 0.55, -r * 0.35);
  ctx.quadraticCurveTo(r * 0.2, -r * 0.55, r * 0.2, -r * 0.85);
  ctx.closePath();
  ctx.fill();

  // translucent highlight
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.15, -r * 0.2, r * 0.15, r * 0.35, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // bubbles inside body
  for (let i = 0; i < 4; i++) {
    const bx = Math.sin(t * 0.8 + i * 1.7) * r * 0.3;
    const by = -r * 0.1 + Math.cos(t * 0.6 + i * 2.3) * r * 0.25;
    const br = r * 0.04 + Math.sin(t + i) * r * 0.02;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.stroke();
  }

  // cap / nozzle
  ctx.fillStyle = '#e87030';
  ctx.beginPath();
  ctx.roundRect(-r * 0.22, -r * 1.05, r * 0.44, r * 0.25, r * 0.06);
  ctx.fill();
  // nozzle tip
  ctx.fillStyle = '#d05820';
  ctx.beginPath();
  ctx.arc(0, -r * 1.05, r * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // undo squish

  // sleepy face
  const faceY = -r * 0.15;
  // droopy eyes
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, faceY, r * 0.1, r * 0.06, 0.1, 0, Math.PI * 2);
  ctx.ellipse(r * 0.2, faceY, r * 0.1, r * 0.06, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // half-closed eyelids
  ctx.fillStyle = col;
  const lidCover = 0.4 + Math.sin(t * 0.7) * 0.15;
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, faceY - r * 0.03, r * 0.11, r * 0.06 * lidCover, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(r * 0.2, faceY - r * 0.03, r * 0.11, r * 0.06 * lidCover, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // small sleepy mouth
  ctx.fillStyle = '#c08060';
  ctx.beginPath();
  ctx.ellipse(0, faceY + r * 0.18, r * 0.07, r * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ---- 8. drawSharpener  "えんぴつ削り" ----------------------
export function drawSharpener(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  ctx.save();
  ctx.translate(cx, cy);

  const vibrate = Math.sin(t * 20) * r * 0.015;

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.ellipse(1, r * 0.75, r * 0.65, r * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // animated wood shavings spiraling off
  for (let i = 0; i < 5; i++) {
    const shaveT = (t * 2.5 + i * 1.3) % 4.0;
    const sx = r * 0.5 + shaveT * r * 0.3;
    const sy = -r * 0.3 + Math.sin(shaveT * 3 + i) * r * 0.3;
    const sa = Math.max(0, 1.0 - shaveT / 3.5);
    if (sa > 0) {
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(shaveT * 4 + i);
      ctx.fillStyle = `rgba(210,170,100,${sa * 0.7})`;
      ctx.beginPath();
      // curled shaving shape
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(r * 0.1, -r * 0.08, r * 0.18, r * 0.02);
      ctx.quadraticCurveTo(r * 0.1, r * 0.08, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  // tiny aggressive legs
  const legK = Math.sin(ph * Math.PI * 2) * r * 0.25;
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = r * 0.14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.3, r * 0.4);
  ctx.lineTo(-r * 0.35 + legK, r * 0.75);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r * 0.15, r * 0.4);
  ctx.lineTo(r * 0.1 - legK, r * 0.75);
  ctx.stroke();

  // main box body
  ctx.save();
  ctx.translate(vibrate, 0);

  const boxGrad = ctx.createLinearGradient(-r * 0.65, -r * 0.5, r * 0.65, r * 0.5);
  boxGrad.addColorStop(0, darker(col, 15));
  boxGrad.addColorStop(0.4, col);
  boxGrad.addColorStop(0.7, lighter(col, 25));
  boxGrad.addColorStop(1, darker(col, 10));
  ctx.fillStyle = boxGrad;
  ctx.beginPath();
  ctx.roundRect(-r * 0.65, -r * 0.55, r * 1.3, r * 1.0, r * 0.12);
  ctx.fill();
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = r * 0.04;
  ctx.stroke();

  // top bevel highlight
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath();
  ctx.roundRect(-r * 0.65, -r * 0.55, r * 1.3, r * 0.25, [r * 0.12, r * 0.12, 0, 0]);
  ctx.fill();

  // blade hole (conical entry)
  const holeX = -r * 0.15;
  const holeY = -r * 0.05;
  // outer ring
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.arc(holeX, holeY, r * 0.32, 0, Math.PI * 2);
  ctx.fill();
  // inner cone
  const coneGrad = ctx.createRadialGradient(holeX, holeY, r * 0.05, holeX, holeY, r * 0.28);
  coneGrad.addColorStop(0, '#222');
  coneGrad.addColorStop(0.5, '#444');
  coneGrad.addColorStop(1, '#777');
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.arc(holeX, holeY, r * 0.28, 0, Math.PI * 2);
  ctx.fill();
  // actual dark hole
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(holeX, holeY, r * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // blade (small metallic rectangle at angle across hole)
  ctx.save();
  ctx.translate(holeX, holeY);
  ctx.rotate(-0.6);
  const bladeGrad = ctx.createLinearGradient(0, -r * 0.04, 0, r * 0.04);
  bladeGrad.addColorStop(0, '#ddd');
  bladeGrad.addColorStop(0.5, '#fff');
  bladeGrad.addColorStop(1, '#bbb');
  ctx.fillStyle = bladeGrad;
  ctx.fillRect(-r * 0.32, -r * 0.035, r * 0.64, r * 0.07);
  // screw on blade
  ctx.fillStyle = '#888';
  ctx.beginPath();
  ctx.arc(r * 0.18, 0, r * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(r * 0.18 - r * 0.025, 0);
  ctx.lineTo(r * 0.18 + r * 0.025, 0);
  ctx.stroke();
  ctx.restore();

  // angry face (on right side of box)
  const faceX = r * 0.3;
  const faceY = -r * 0.05;
  // angry eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(faceX - r * 0.12, faceY - r * 0.06, r * 0.1, 0, Math.PI * 2);
  ctx.arc(faceX + r * 0.12, faceY - r * 0.06, r * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(faceX - r * 0.1, faceY - r * 0.05, r * 0.055, 0, Math.PI * 2);
  ctx.arc(faceX + r * 0.14, faceY - r * 0.05, r * 0.055, 0, Math.PI * 2);
  ctx.fill();
  // angry brows (V shape)
  ctx.strokeStyle = '#333';
  ctx.lineWidth = r * 0.07;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(faceX - r * 0.22, faceY - r * 0.18);
  ctx.lineTo(faceX - r * 0.08, faceY - r * 0.1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(faceX + r * 0.22, faceY - r * 0.18);
  ctx.lineTo(faceX + r * 0.08, faceY - r * 0.1);
  ctx.stroke();
  // gritting teeth mouth
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.roundRect(faceX - r * 0.12, faceY + r * 0.1, r * 0.24, r * 0.12, r * 0.03);
  ctx.fill();
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 0.6;
  // teeth lines
  for (let i = 1; i < 3; i++) {
    const tx = faceX - r * 0.12 + i * r * 0.08;
    ctx.beginPath();
    ctx.moveTo(tx, faceY + r * 0.1);
    ctx.lineTo(tx, faceY + r * 0.22);
    ctx.stroke();
  }
  ctx.strokeStyle = '#333';
  ctx.lineWidth = r * 0.04;
  ctx.beginPath();
  ctx.roundRect(faceX - r * 0.12, faceY + r * 0.1, r * 0.24, r * 0.12, r * 0.03);
  ctx.stroke();

  ctx.restore(); // undo vibrate

  ctx.restore();
}
