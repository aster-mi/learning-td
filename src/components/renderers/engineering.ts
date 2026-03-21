// engineering.ts - Engineering (工学) themed tower defense character renderers
// Canvas2D vector draw functions for 10 engineering characters

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
/*  1. drawGearLancer  -  "ギアランサー"                                */
/*     eng_01: Gear/cog body with a lance. Mechanical warrior.         */
/* ------------------------------------------------------------------ */
export function drawGearLancer(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- shadow --
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // -- legs with walking animation --
  const walk = Math.sin(t * 4 + ph) * 3 * s;
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(-6 * s + walk * 0.3, 8 * s, 4 * s, 7 * s);
  ctx.fillRect(2 * s - walk * 0.3, 8 * s, 4 * s, 7 * s);
  // metal boots
  ctx.fillStyle = darker(col, 100);
  ctx.fillRect(-7 * s + walk * 0.3, 13 * s, 5 * s, 2.5 * s);
  ctx.fillRect(1 * s - walk * 0.3, 13 * s, 5 * s, 2.5 * s);

  // -- lance (right side, diagonal) --
  const lanceAngle = Math.sin(t * 2 + ph) * 0.08;
  ctx.save();
  ctx.translate(8 * s, -4 * s);
  ctx.rotate(-0.5 + lanceAngle);
  // shaft
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(-1 * s, -20 * s, 2 * s, 22 * s);
  // spear tip
  ctx.fillStyle = lighter(col, 60);
  ctx.beginPath();
  ctx.moveTo(0, -22 * s);
  ctx.lineTo(-2.5 * s, -17 * s);
  ctx.lineTo(2.5 * s, -17 * s);
  ctx.closePath();
  ctx.fill();
  // tip gleam
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.moveTo(0, -22 * s);
  ctx.lineTo(-1 * s, -19 * s);
  ctx.lineTo(0.5 * s, -18 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // -- gear body (cog shape) --
  const gearR = 9 * s;
  const toothH = 3 * s;
  const teeth = 8;
  const gearSpin = t * 0.5;
  const bodyGrad = ctx.createRadialGradient(0, 0, 2 * s, 0, 0, gearR + toothH);
  bodyGrad.addColorStop(0, lighter(col, 30));
  bodyGrad.addColorStop(0.6, col);
  bodyGrad.addColorStop(1, darker(col, 40));

  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2 + gearSpin;
    const a1 = a0 + (0.3 / teeth) * Math.PI * 2;
    const a2 = a0 + (0.5 / teeth) * Math.PI * 2;
    const a3 = a0 + (0.8 / teeth) * Math.PI * 2;
    const a4 = ((i + 1) / teeth) * Math.PI * 2 + gearSpin;
    if (i === 0) {
      ctx.moveTo(Math.cos(a0) * gearR, Math.sin(a0) * gearR);
    }
    ctx.lineTo(Math.cos(a1) * (gearR + toothH), Math.sin(a1) * (gearR + toothH));
    ctx.lineTo(Math.cos(a2) * (gearR + toothH), Math.sin(a2) * (gearR + toothH));
    ctx.lineTo(Math.cos(a3) * gearR, Math.sin(a3) * gearR);
    ctx.lineTo(Math.cos(a4) * gearR, Math.sin(a4) * gearR);
  }
  ctx.closePath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // -- center axle hole --
  ctx.beginPath();
  ctx.arc(0, 0, 3 * s, 0, Math.PI * 2);
  ctx.fillStyle = darker(col, 80);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, 1.5 * s, 0, Math.PI * 2);
  ctx.fillStyle = darker(col, 50);
  ctx.fill();

  // -- arms (mechanical) --
  const armSwing = Math.sin(t * 3 + ph) * 0.2;
  ctx.save();
  ctx.translate(-10 * s, -1 * s);
  ctx.rotate(armSwing + 0.3);
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-1.5 * s, 0, 3 * s, 8 * s);
  // joint rivet
  ctx.beginPath();
  ctx.arc(0, 0, 1.5 * s, 0, Math.PI * 2);
  ctx.fillStyle = lighter(col, 40);
  ctx.fill();
  ctx.restore();

  // -- eyes (mechanical, glowing) --
  const blink = Math.sin(t * 2) > 0.95 ? 0.3 : 1;
  ctx.fillStyle = "#ff6b35";
  ctx.beginPath();
  ctx.ellipse(-3 * s, -3 * s, 1.8 * s, 1.5 * s * blink, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(3 * s, -3 * s, 1.8 * s, 1.5 * s * blink, 0, 0, Math.PI * 2);
  ctx.fill();
  // eye glow
  ctx.fillStyle = "rgba(255,150,60,0.4)";
  ctx.beginPath();
  ctx.ellipse(-3 * s, -3 * s, 3 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(3 * s, -3 * s, 3 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  2. drawRivetGuard  -  "リベットガード"                              */
/*     eng_02: Heavy armored plating with rivets, sturdy shield.       */
/* ------------------------------------------------------------------ */
export function drawRivetGuard(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- shadow --
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 12 * s, 3.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // -- thick legs --
  const walk = Math.sin(t * 3 + ph) * 2 * s;
  ctx.fillStyle = darker(col, 60);
  ctx.fillRect(-7 * s + walk * 0.2, 7 * s, 5 * s, 8 * s);
  ctx.fillRect(2 * s - walk * 0.2, 7 * s, 5 * s, 8 * s);
  // heavy boots
  ctx.fillStyle = darker(col, 90);
  ctx.fillRect(-8 * s + walk * 0.2, 13 * s, 7 * s, 3 * s);
  ctx.fillRect(1 * s - walk * 0.2, 13 * s, 7 * s, 3 * s);

  // -- massive shield (left side) --
  const shieldBob = Math.sin(t * 2 + ph) * 1.5 * s;
  ctx.save();
  ctx.translate(-12 * s, -1 * s + shieldBob);
  const shieldGrad = ctx.createLinearGradient(-6 * s, -10 * s, 4 * s, 10 * s);
  shieldGrad.addColorStop(0, lighter(col, 50));
  shieldGrad.addColorStop(0.4, col);
  shieldGrad.addColorStop(1, darker(col, 50));
  ctx.beginPath();
  ctx.moveTo(0, -10 * s);
  ctx.lineTo(-6 * s, -7 * s);
  ctx.lineTo(-7 * s, 2 * s);
  ctx.lineTo(-4 * s, 9 * s);
  ctx.lineTo(0, 11 * s);
  ctx.lineTo(4 * s, 9 * s);
  ctx.lineTo(5 * s, -7 * s);
  ctx.closePath();
  ctx.fillStyle = shieldGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 80);
  ctx.lineWidth = 1.2 * s;
  ctx.stroke();
  // shield rivets
  const rivetPositions = [[-2, -5], [2, -5], [-3, 2], [1, 2], [-1, 7]];
  for (const [rx, ry] of rivetPositions) {
    ctx.beginPath();
    ctx.arc(rx * s, ry * s, 1.2 * s, 0, Math.PI * 2);
    ctx.fillStyle = lighter(col, 70);
    ctx.fill();
    ctx.strokeStyle = darker(col, 40);
    ctx.lineWidth = 0.5 * s;
    ctx.stroke();
  }
  // shield cross emblem
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(-1 * s, -3 * s);
  ctx.lineTo(-1 * s, 6 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-4 * s, 1 * s);
  ctx.lineTo(2 * s, 1 * s);
  ctx.stroke();
  ctx.restore();

  // -- boxy armored body --
  const bodyGrad = ctx.createLinearGradient(-9 * s, -10 * s, 9 * s, 10 * s);
  bodyGrad.addColorStop(0, lighter(col, 20));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 30));
  ctx.beginPath();
  ctx.moveTo(-9 * s, -10 * s);
  ctx.lineTo(9 * s, -10 * s);
  ctx.lineTo(10 * s, 8 * s);
  ctx.lineTo(-10 * s, 8 * s);
  ctx.closePath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // -- armor plate lines --
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 0.7 * s;
  ctx.beginPath();
  ctx.moveTo(-9 * s, -2 * s);
  ctx.lineTo(9 * s, -2 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-9 * s, 4 * s);
  ctx.lineTo(9 * s, 4 * s);
  ctx.stroke();

  // -- body rivets --
  const bodyRivets = [[-7, -7], [7, -7], [-7, 1], [7, 1], [-7, 6], [7, 6]];
  for (const [rx, ry] of bodyRivets) {
    ctx.beginPath();
    ctx.arc(rx * s, ry * s, 1 * s, 0, Math.PI * 2);
    ctx.fillStyle = lighter(col, 60);
    ctx.fill();
    ctx.strokeStyle = darker(col, 40);
    ctx.lineWidth = 0.4 * s;
    ctx.stroke();
  }

  // -- helmet (flat top with visor) --
  ctx.fillStyle = darker(col, 20);
  ctx.fillRect(-8 * s, -14 * s, 16 * s, 5 * s);
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-7 * s, -12 * s, 14 * s, 2 * s);
  // visor slit (eyes)
  ctx.fillStyle = "#ff4444";
  ctx.shadowColor = "#ff4444";
  ctx.shadowBlur = 4 * s;
  ctx.fillRect(-5 * s, -11.5 * s, 10 * s, 1.5 * s);
  ctx.shadowBlur = 0;

  // -- right arm (fist) --
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(9 * s, -4 * s, 4 * s, 10 * s);
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(9 * s, 4 * s, 5 * s, 4 * s);

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  3. drawTurbineShooter  -  "タービンシューター"                       */
/*     eng_03: Turbine/jet engine body, shoots projectiles.            */
/* ------------------------------------------------------------------ */
export function drawTurbineShooter(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- shadow --
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 9 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // -- sleek legs --
  const walk = Math.sin(t * 5 + ph) * 3.5 * s;
  ctx.fillStyle = darker(col, 60);
  // left leg
  ctx.beginPath();
  ctx.moveTo(-5 * s, 6 * s);
  ctx.lineTo(-3 * s, 6 * s);
  ctx.lineTo(-2 * s + walk * 0.3, 14 * s);
  ctx.lineTo(-6 * s + walk * 0.3, 14 * s);
  ctx.closePath();
  ctx.fill();
  // right leg
  ctx.beginPath();
  ctx.moveTo(3 * s, 6 * s);
  ctx.lineTo(5 * s, 6 * s);
  ctx.lineTo(6 * s - walk * 0.3, 14 * s);
  ctx.lineTo(2 * s - walk * 0.3, 14 * s);
  ctx.closePath();
  ctx.fill();

  // -- jet exhaust (back, animated) --
  const flameLen = (6 + Math.sin(t * 8 + ph) * 3) * s;
  const flameGrad = ctx.createLinearGradient(0, 8 * s, 0, 8 * s + flameLen);
  flameGrad.addColorStop(0, "rgba(255,200,50,0.8)");
  flameGrad.addColorStop(0.4, "rgba(255,100,20,0.6)");
  flameGrad.addColorStop(1, "rgba(255,50,0,0)");
  ctx.beginPath();
  ctx.moveTo(-4 * s, 8 * s);
  ctx.lineTo(0, 8 * s + flameLen);
  ctx.lineTo(4 * s, 8 * s);
  ctx.closePath();
  ctx.fillStyle = flameGrad;
  ctx.fill();

  // -- turbine body (cylindrical/nacelle shape) --
  const bodyGrad = ctx.createLinearGradient(-8 * s, 0, 8 * s, 0);
  bodyGrad.addColorStop(0, darker(col, 20));
  bodyGrad.addColorStop(0.3, lighter(col, 30));
  bodyGrad.addColorStop(0.7, col);
  bodyGrad.addColorStop(1, darker(col, 30));

  // main nacelle
  ctx.beginPath();
  ctx.ellipse(0, -2 * s, 8 * s, 10 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // -- turbine intake (front face) --
  ctx.beginPath();
  ctx.arc(0, -6 * s, 5 * s, 0, Math.PI * 2);
  ctx.fillStyle = darker(col, 60);
  ctx.fill();
  // spinning blades
  const spin = t * 6;
  ctx.strokeStyle = lighter(col, 40);
  ctx.lineWidth = 1.2 * s;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + spin;
    ctx.beginPath();
    ctx.moveTo(0, -6 * s);
    ctx.lineTo(Math.cos(a) * 4.5 * s, -6 * s + Math.sin(a) * 4.5 * s);
    ctx.stroke();
  }
  // center hub
  ctx.beginPath();
  ctx.arc(0, -6 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fillStyle = lighter(col, 50);
  ctx.fill();

  // -- gun barrel (right side) --
  const recoil = Math.max(0, Math.sin(t * 6 + ph)) * 1.5 * s;
  ctx.save();
  ctx.translate(7 * s - recoil, -3 * s);
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(0, -1.5 * s, 8 * s, 3 * s);
  // muzzle
  ctx.fillStyle = darker(col, 80);
  ctx.fillRect(7 * s, -2 * s, 2 * s, 4 * s);
  // muzzle flash
  if (Math.sin(t * 6 + ph) > 0.8) {
    ctx.fillStyle = "rgba(255,255,100,0.7)";
    ctx.beginPath();
    ctx.arc(10 * s, 0, 2.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // -- visor eyes --
  ctx.fillStyle = "#00e5ff";
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 3 * s;
  ctx.fillRect(-4 * s, -4 * s, 8 * s, 2 * s);
  ctx.shadowBlur = 0;

  // -- speed lines (when moving) --
  ctx.strokeStyle = `rgba(255,255,255,${0.15 + Math.sin(t * 4) * 0.1})`;
  ctx.lineWidth = 0.5 * s;
  for (let i = 0; i < 3; i++) {
    const ly = (-5 + i * 5) * s;
    ctx.beginPath();
    ctx.moveTo(-14 * s, ly);
    ctx.lineTo(-10 * s, ly);
    ctx.stroke();
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  4. drawBoltHammer  -  "ボルトハンマー"                              */
/*     eng_04: Bolt-shaped body wielding a heavy hammer.               */
/* ------------------------------------------------------------------ */
export function drawBoltHammer(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- shadow --
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // -- sturdy legs --
  const walk = Math.sin(t * 3.5 + ph) * 2.5 * s;
  ctx.fillStyle = darker(col, 65);
  ctx.fillRect(-6 * s + walk * 0.2, 7 * s, 4.5 * s, 8 * s);
  ctx.fillRect(1.5 * s - walk * 0.2, 7 * s, 4.5 * s, 8 * s);
  // boots with treads
  ctx.fillStyle = darker(col, 90);
  ctx.fillRect(-7 * s + walk * 0.2, 13 * s, 6 * s, 2.5 * s);
  ctx.fillRect(1 * s - walk * 0.2, 13 * s, 6 * s, 2.5 * s);

  // -- hammer (swinging animation) --
  const hammerSwing = Math.sin(t * 2.5 + ph) * 0.4;
  ctx.save();
  ctx.translate(8 * s, -6 * s);
  ctx.rotate(hammerSwing - 0.3);
  // handle
  ctx.fillStyle = "#8B6914";
  ctx.fillRect(-1 * s, -2 * s, 2 * s, 16 * s);
  // hammer head
  const hammerGrad = ctx.createLinearGradient(-5 * s, -5 * s, 5 * s, 0);
  hammerGrad.addColorStop(0, lighter(col, 50));
  hammerGrad.addColorStop(0.5, darker(col, 20));
  hammerGrad.addColorStop(1, darker(col, 60));
  ctx.fillStyle = hammerGrad;
  ctx.fillRect(-5 * s, -6 * s, 10 * s, 5 * s);
  // hammer face highlight
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(-4.5 * s, -5.5 * s, 3 * s, 4 * s);
  // impact sparks
  if (hammerSwing > 0.3) {
    ctx.fillStyle = "rgba(255,200,50,0.8)";
    for (let i = 0; i < 3; i++) {
      const sx = (Math.random() - 0.5) * 6 * s;
      const sy = -6 * s + (Math.random() - 0.5) * 3 * s;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8 * s, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // -- bolt body (hexagonal head + threaded shaft) --
  // hexagonal top (bolt head)
  const boltGrad = ctx.createRadialGradient(0, -4 * s, 1 * s, 0, -4 * s, 10 * s);
  boltGrad.addColorStop(0, lighter(col, 35));
  boltGrad.addColorStop(0.7, col);
  boltGrad.addColorStop(1, darker(col, 40));
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    const px = Math.cos(a) * 9 * s;
    const py = -6 * s + Math.sin(a) * 7 * s;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = boltGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 55);
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // threaded shaft (lower body)
  ctx.fillStyle = darker(col, 25);
  ctx.fillRect(-4 * s, 1 * s, 8 * s, 8 * s);
  // thread lines
  ctx.strokeStyle = darker(col, 45);
  ctx.lineWidth = 0.6 * s;
  for (let i = 0; i < 4; i++) {
    const ty = 2 * s + i * 2 * s;
    ctx.beginPath();
    ctx.moveTo(-4 * s, ty);
    ctx.lineTo(4 * s, ty + 1 * s);
    ctx.stroke();
  }

  // -- left arm --
  const armSwing = Math.sin(t * 3 + ph) * 0.15;
  ctx.save();
  ctx.translate(-9 * s, -2 * s);
  ctx.rotate(armSwing + 0.2);
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-1.5 * s, 0, 3 * s, 8 * s);
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(-2 * s, 7 * s, 4 * s, 3 * s);
  ctx.restore();

  // -- face --
  ctx.fillStyle = "#ffcc00";
  ctx.beginPath();
  ctx.arc(-3 * s, -6 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3 * s, -6 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // determined mouth
  ctx.strokeStyle = darker(col, 80);
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(-2 * s, -2 * s);
  ctx.lineTo(2 * s, -2 * s);
  ctx.stroke();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  5. drawServoRunner  -  "サーボランナー"                             */
/*     eng_05: Sleek robot runner with servo joints. Speed lines.      */
/* ------------------------------------------------------------------ */
export function drawServoRunner(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- shadow --
  ctx.fillStyle = "rgba(0,0,0,0.13)";
  ctx.beginPath();
  ctx.ellipse(2 * s, 15 * s, 9 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // -- speed lines (background) --
  const speedAlpha = 0.12 + Math.sin(t * 5) * 0.08;
  ctx.strokeStyle = `rgba(255,255,255,${speedAlpha})`;
  ctx.lineWidth = 0.8 * s;
  for (let i = 0; i < 5; i++) {
    const ly = (-8 + i * 4) * s;
    const lx = -12 * s - Math.sin(t * 6 + i) * 3 * s;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx - 6 * s, ly);
    ctx.stroke();
  }

  // -- dynamic running legs with knee joints --
  const runCycle = t * 6 + ph;
  // left leg
  const lHip = Math.sin(runCycle) * 0.6;
  const lKnee = Math.max(0, Math.sin(runCycle + 0.5)) * 0.8;
  ctx.save();
  ctx.translate(-3 * s, 6 * s);
  ctx.rotate(lHip);
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-1.5 * s, 0, 3 * s, 6 * s);
  // knee joint
  ctx.beginPath();
  ctx.arc(0, 6 * s, 1.8 * s, 0, Math.PI * 2);
  ctx.fillStyle = lighter(col, 40);
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 0.5 * s;
  ctx.stroke();
  // lower leg
  ctx.translate(0, 6 * s);
  ctx.rotate(lKnee);
  ctx.fillStyle = darker(col, 55);
  ctx.fillRect(-1.2 * s, 0, 2.4 * s, 5.5 * s);
  // foot blade
  ctx.fillStyle = lighter(col, 30);
  ctx.beginPath();
  ctx.moveTo(-2 * s, 5 * s);
  ctx.lineTo(3 * s, 5.5 * s);
  ctx.lineTo(-1 * s, 6.5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // right leg
  const rHip = Math.sin(runCycle + Math.PI) * 0.6;
  const rKnee = Math.max(0, Math.sin(runCycle + Math.PI + 0.5)) * 0.8;
  ctx.save();
  ctx.translate(3 * s, 6 * s);
  ctx.rotate(rHip);
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-1.5 * s, 0, 3 * s, 6 * s);
  ctx.beginPath();
  ctx.arc(0, 6 * s, 1.8 * s, 0, Math.PI * 2);
  ctx.fillStyle = lighter(col, 40);
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 0.5 * s;
  ctx.stroke();
  ctx.translate(0, 6 * s);
  ctx.rotate(rKnee);
  ctx.fillStyle = darker(col, 55);
  ctx.fillRect(-1.2 * s, 0, 2.4 * s, 5.5 * s);
  ctx.fillStyle = lighter(col, 30);
  ctx.beginPath();
  ctx.moveTo(-2 * s, 5 * s);
  ctx.lineTo(3 * s, 5.5 * s);
  ctx.lineTo(-1 * s, 6.5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // -- sleek torso (aerodynamic) --
  const bodyGrad = ctx.createLinearGradient(-6 * s, -8 * s, 6 * s, 6 * s);
  bodyGrad.addColorStop(0, lighter(col, 25));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 35));
  ctx.beginPath();
  ctx.moveTo(0, -12 * s);
  ctx.bezierCurveTo(7 * s, -10 * s, 8 * s, -2 * s, 6 * s, 6 * s);
  ctx.lineTo(-6 * s, 6 * s);
  ctx.bezierCurveTo(-8 * s, -2 * s, -7 * s, -10 * s, 0, -12 * s);
  ctx.closePath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 45);
  ctx.lineWidth = 0.7 * s;
  ctx.stroke();

  // -- chest panel / vent --
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(-3 * s, -4 * s, 6 * s, 4 * s);
  ctx.strokeStyle = lighter(col, 30);
  ctx.lineWidth = 0.4 * s;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-2 * s, (-3 + i * 1.5) * s);
    ctx.lineTo(2 * s, (-3 + i * 1.5) * s);
    ctx.stroke();
  }

  // -- arms (thin, mechanical) --
  const armPump = Math.sin(runCycle) * 0.4;
  ctx.save();
  ctx.translate(-6 * s, -4 * s);
  ctx.rotate(-armPump);
  ctx.fillStyle = darker(col, 45);
  ctx.fillRect(-1 * s, 0, 2 * s, 7 * s);
  ctx.beginPath();
  ctx.arc(0, 0, 1.2 * s, 0, Math.PI * 2);
  ctx.fillStyle = lighter(col, 40);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(6 * s, -4 * s);
  ctx.rotate(armPump);
  ctx.fillStyle = darker(col, 45);
  ctx.fillRect(-1 * s, 0, 2 * s, 7 * s);
  ctx.beginPath();
  ctx.arc(0, 0, 1.2 * s, 0, Math.PI * 2);
  ctx.fillStyle = lighter(col, 40);
  ctx.fill();
  ctx.restore();

  // -- head (visor/helmet, sleek) --
  ctx.fillStyle = darker(col, 30);
  ctx.beginPath();
  ctx.moveTo(-4 * s, -12 * s);
  ctx.lineTo(4 * s, -12 * s);
  ctx.lineTo(3 * s, -8 * s);
  ctx.lineTo(-3 * s, -8 * s);
  ctx.closePath();
  ctx.fill();
  // visor
  ctx.fillStyle = "#00ff88";
  ctx.shadowColor = "#00ff88";
  ctx.shadowBlur = 3 * s;
  ctx.fillRect(-3 * s, -11 * s, 6 * s, 1.5 * s);
  ctx.shadowBlur = 0;

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  6. drawArcCoil  -  "アークコイル"                                   */
/*     eng_06: Tesla coil body with electric arcs. Tall and sparking.  */
/* ------------------------------------------------------------------ */
export function drawArcCoil(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- shadow --
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 8 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // -- short legs --
  const walk = Math.sin(t * 3 + ph) * 2 * s;
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(-4 * s + walk * 0.2, 10 * s, 3 * s, 5 * s);
  ctx.fillRect(1 * s - walk * 0.2, 10 * s, 3 * s, 5 * s);
  // insulated boots
  ctx.fillStyle = "#333";
  ctx.fillRect(-5 * s + walk * 0.2, 14 * s, 4 * s, 2 * s);
  ctx.fillRect(0.5 * s - walk * 0.2, 14 * s, 4 * s, 2 * s);

  // -- base platform --
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-8 * s, 8 * s, 16 * s, 3 * s);
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(-7 * s, 7 * s, 14 * s, 2 * s);

  // -- coil tower body (tall cylinder with coil wrapping) --
  const towerGrad = ctx.createLinearGradient(-4 * s, -14 * s, 4 * s, 7 * s);
  towerGrad.addColorStop(0, lighter(col, 40));
  towerGrad.addColorStop(0.4, col);
  towerGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = towerGrad;
  ctx.fillRect(-4 * s, -14 * s, 8 * s, 22 * s);
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.6 * s;
  ctx.strokeRect(-4 * s, -14 * s, 8 * s, 22 * s);

  // coil windings
  ctx.strokeStyle = lighter(col, 50);
  ctx.lineWidth = 0.8 * s;
  for (let i = 0; i < 10; i++) {
    const wy = -12 * s + i * 2.8 * s;
    ctx.beginPath();
    ctx.moveTo(-4 * s, wy);
    ctx.bezierCurveTo(-6 * s, wy + 0.5 * s, -6 * s, wy + 1.5 * s, -4 * s, wy + 2 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4 * s, wy);
    ctx.bezierCurveTo(6 * s, wy + 0.5 * s, 6 * s, wy + 1.5 * s, 4 * s, wy + 2 * s);
    ctx.stroke();
  }

  // -- torus / donut top --
  ctx.beginPath();
  ctx.ellipse(0, -14 * s, 6 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = lighter(col, 30);
  ctx.fill();
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();
  // inner hole
  ctx.beginPath();
  ctx.ellipse(0, -14 * s, 2.5 * s, 1 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = darker(col, 60);
  ctx.fill();

  // -- electric arcs (animated lightning bolts) --
  const arcCount = 3;
  ctx.strokeStyle = "#88ddff";
  ctx.shadowColor = "#88ddff";
  ctx.shadowBlur = 6 * s;
  ctx.lineWidth = 1 * s;
  for (let a = 0; a < arcCount; a++) {
    const angle = (a / arcCount) * Math.PI * 2 + t * 2;
    const reach = (7 + Math.sin(t * 5 + a * 2.1 + ph) * 4) * s;
    const ex = Math.cos(angle) * reach;
    const ey = -14 * s + Math.sin(angle) * reach * 0.4;
    ctx.beginPath();
    ctx.moveTo(0, -14 * s);
    // zigzag to endpoint
    const mx1 = ex * 0.33 + Math.sin(t * 8 + a) * 2 * s;
    const my1 = -14 * s + (ey + 14 * s) * 0.33 + Math.cos(t * 9 + a) * 2 * s;
    const mx2 = ex * 0.66 + Math.cos(t * 7 + a) * 2 * s;
    const my2 = -14 * s + (ey + 14 * s) * 0.66 + Math.sin(t * 10 + a) * 1.5 * s;
    ctx.lineTo(mx1, my1);
    ctx.lineTo(mx2, my2);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  // -- small spark particles --
  for (let i = 0; i < 4; i++) {
    const sparkA = t * 3 + i * 1.57 + ph;
    const sparkR = (5 + Math.sin(t * 4 + i) * 3) * s;
    const sx = Math.cos(sparkA) * sparkR;
    const sy = -14 * s + Math.sin(sparkA) * sparkR * 0.5;
    ctx.fillStyle = `rgba(180,230,255,${0.5 + Math.sin(t * 6 + i) * 0.4})`;
    ctx.beginPath();
    ctx.arc(sx, sy, 0.8 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // -- eyes on the tower --
  const blink = Math.sin(t * 2.5) > 0.92 ? 0.2 : 1;
  ctx.fillStyle = "#88ddff";
  ctx.shadowColor = "#88ddff";
  ctx.shadowBlur = 2 * s;
  ctx.beginPath();
  ctx.ellipse(-2 * s, -4 * s, 1.3 * s, 1.3 * s * blink, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(2 * s, -4 * s, 1.3 * s, 1.3 * s * blink, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  7. drawForgeKnight  -  "フォージナイト"                             */
/*     eng_07: Anvil-shaped heavy knight with forge fire glow.         */
/* ------------------------------------------------------------------ */
export function drawForgeKnight(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- shadow --
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 12 * s, 4 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // -- massive legs --
  const walk = Math.sin(t * 2.5 + ph) * 2 * s;
  ctx.fillStyle = darker(col, 55);
  ctx.fillRect(-7 * s + walk * 0.15, 6 * s, 5.5 * s, 9 * s);
  ctx.fillRect(1.5 * s - walk * 0.15, 6 * s, 5.5 * s, 9 * s);
  // armored boots
  ctx.fillStyle = darker(col, 80);
  ctx.fillRect(-8 * s + walk * 0.15, 13 * s, 7 * s, 3 * s);
  ctx.fillRect(1 * s - walk * 0.15, 13 * s, 7 * s, 3 * s);

  // -- forge glow (behind body) --
  const glowPulse = 0.4 + Math.sin(t * 3 + ph) * 0.15;
  const fireGrad = ctx.createRadialGradient(0, 2 * s, 2 * s, 0, 2 * s, 14 * s);
  fireGrad.addColorStop(0, `rgba(255,120,20,${glowPulse})`);
  fireGrad.addColorStop(0.5, `rgba(255,60,10,${glowPulse * 0.5})`);
  fireGrad.addColorStop(1, "rgba(255,30,0,0)");
  ctx.fillStyle = fireGrad;
  ctx.beginPath();
  ctx.arc(0, 2 * s, 14 * s, 0, Math.PI * 2);
  ctx.fill();

  // -- anvil body shape --
  const anvilGrad = ctx.createLinearGradient(-11 * s, -6 * s, 11 * s, 8 * s);
  anvilGrad.addColorStop(0, lighter(col, 25));
  anvilGrad.addColorStop(0.3, col);
  anvilGrad.addColorStop(0.8, darker(col, 30));
  anvilGrad.addColorStop(1, darker(col, 50));

  // anvil top (wide flat surface)
  ctx.beginPath();
  ctx.moveTo(-12 * s, -5 * s);
  ctx.lineTo(12 * s, -5 * s);
  ctx.lineTo(11 * s, -2 * s);
  ctx.lineTo(-11 * s, -2 * s);
  ctx.closePath();
  ctx.fillStyle = anvilGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // anvil waist (narrow)
  ctx.fillStyle = darker(col, 20);
  ctx.fillRect(-6 * s, -2 * s, 12 * s, 4 * s);

  // anvil base (wide)
  ctx.beginPath();
  ctx.moveTo(-10 * s, 2 * s);
  ctx.lineTo(10 * s, 2 * s);
  ctx.lineTo(11 * s, 7 * s);
  ctx.lineTo(-11 * s, 7 * s);
  ctx.closePath();
  ctx.fillStyle = anvilGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // -- helmet (knight's helm with visor) --
  ctx.fillStyle = darker(col, 15);
  ctx.beginPath();
  ctx.arc(0, -8 * s, 6 * s, Math.PI, 0);
  ctx.lineTo(6 * s, -5 * s);
  ctx.lineTo(-6 * s, -5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.7 * s;
  ctx.stroke();

  // visor slit
  ctx.fillStyle = "#ff6622";
  ctx.shadowColor = "#ff6622";
  ctx.shadowBlur = 4 * s;
  ctx.fillRect(-4 * s, -8 * s, 8 * s, 2 * s);
  ctx.shadowBlur = 0;

  // helmet crest
  ctx.fillStyle = darker(col, 40);
  ctx.beginPath();
  ctx.moveTo(0, -15 * s);
  ctx.lineTo(1.5 * s, -8 * s);
  ctx.lineTo(-1.5 * s, -8 * s);
  ctx.closePath();
  ctx.fill();

  // -- arms (armored, wide) --
  const armSwing = Math.sin(t * 2 + ph) * 0.12;
  ctx.save();
  ctx.translate(-11 * s, -4 * s);
  ctx.rotate(armSwing + 0.15);
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(-2 * s, 0, 4 * s, 10 * s);
  // gauntlet
  ctx.fillStyle = darker(col, 65);
  ctx.fillRect(-2.5 * s, 8 * s, 5 * s, 3.5 * s);
  ctx.restore();
  ctx.save();
  ctx.translate(11 * s, -4 * s);
  ctx.rotate(-armSwing - 0.15);
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(-2 * s, 0, 4 * s, 10 * s);
  ctx.fillStyle = darker(col, 65);
  ctx.fillRect(-2.5 * s, 8 * s, 5 * s, 3.5 * s);
  ctx.restore();

  // -- ember particles --
  for (let i = 0; i < 4; i++) {
    const ex = Math.sin(t * 2 + i * 1.5 + ph) * 6 * s;
    const ey = -((t * 12 + i * 20 + ph * 5) % 18) * s + 5 * s;
    const ea = Math.max(0, 1 - Math.abs(ey) / (15 * s));
    ctx.fillStyle = `rgba(255,${100 + i * 30},20,${ea * 0.7})`;
    ctx.beginPath();
    ctx.arc(ex, ey, (0.8 + Math.sin(t + i) * 0.3) * s, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  8. drawPistonBreaker  -  "ピストンブレイカー"                       */
/*     eng_08: Piston mechanism body, heavy crushing strikes.          */
/* ------------------------------------------------------------------ */
export function drawPistonBreaker(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- shadow --
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 10 * s, 3.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // -- heavy legs (hydraulic) --
  const walk = Math.sin(t * 3 + ph) * 2 * s;
  // left leg - upper
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-7 * s + walk * 0.2, 6 * s, 5 * s, 4 * s);
  // left leg - piston lower
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(-6 * s + walk * 0.2, 10 * s, 3 * s, 5 * s);
  // left leg - hydraulic line
  ctx.fillStyle = lighter(col, 30);
  ctx.fillRect(-4.5 * s + walk * 0.2, 7 * s, 1 * s, 7 * s);
  // right leg
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(2 * s - walk * 0.2, 6 * s, 5 * s, 4 * s);
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(3 * s - walk * 0.2, 10 * s, 3 * s, 5 * s);
  ctx.fillStyle = lighter(col, 30);
  ctx.fillRect(3.5 * s - walk * 0.2, 7 * s, 1 * s, 7 * s);

  // -- piston arm (main weapon, top-mounted) --
  const pistonStroke = Math.sin(t * 4 + ph);
  const pistonExt = pistonStroke * 5 * s;
  // cylinder housing
  ctx.fillStyle = darker(col, 35);
  ctx.fillRect(-3 * s, -18 * s, 6 * s, 8 * s);
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 0.7 * s;
  ctx.strokeRect(-3 * s, -18 * s, 6 * s, 8 * s);
  // piston rod
  ctx.fillStyle = lighter(col, 50);
  ctx.fillRect(-1.5 * s, -10 * s, 3 * s, 6 * s + Math.max(0, pistonExt));
  // piston head (crusher)
  const crushY = -4 * s + Math.max(0, pistonExt);
  ctx.fillStyle = darker(col, 20);
  ctx.fillRect(-5 * s, crushY, 10 * s, 4 * s);
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-5.5 * s, crushY + 3 * s, 11 * s, 2 * s);

  // impact effect
  if (pistonStroke > 0.8) {
    ctx.strokeStyle = "rgba(255,200,50,0.6)";
    ctx.lineWidth = 1 * s;
    for (let i = 0; i < 4; i++) {
      const ia = (i / 4) * Math.PI - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ia) * 4 * s, crushY + 5 * s + Math.sin(ia) * 2 * s);
      ctx.lineTo(Math.cos(ia) * 8 * s, crushY + 5 * s + Math.sin(ia) * 4 * s);
      ctx.stroke();
    }
  }

  // -- main body (engine block shape) --
  const bodyGrad = ctx.createLinearGradient(-9 * s, -6 * s, 9 * s, 6 * s);
  bodyGrad.addColorStop(0, lighter(col, 20));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 35));
  ctx.beginPath();
  ctx.moveTo(-9 * s, -6 * s);
  ctx.lineTo(9 * s, -6 * s);
  ctx.lineTo(10 * s, 0 * s);
  ctx.lineTo(10 * s, 7 * s);
  ctx.lineTo(-10 * s, 7 * s);
  ctx.lineTo(-10 * s, 0 * s);
  ctx.closePath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // -- cooling fins (side detail) --
  ctx.fillStyle = darker(col, 40);
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(-10 * s, (-4 + i * 3) * s, 2 * s, 2 * s);
    ctx.fillRect(8 * s, (-4 + i * 3) * s, 2 * s, 2 * s);
  }

  // -- exhaust pipes (sides) --
  ctx.fillStyle = darker(col, 60);
  ctx.fillRect(-12 * s, -5 * s, 3 * s, 2 * s);
  ctx.fillRect(9 * s, -5 * s, 3 * s, 2 * s);
  // exhaust smoke
  const smokeAlpha = 0.15 + Math.sin(t * 3) * 0.1;
  ctx.fillStyle = `rgba(150,150,150,${smokeAlpha})`;
  ctx.beginPath();
  ctx.arc(-13 * s, -6 * s - Math.abs(Math.sin(t * 2)) * 3 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(12 * s, -6 * s - Math.abs(Math.sin(t * 2 + 1)) * 3 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();

  // -- pressure gauge (chest) --
  ctx.beginPath();
  ctx.arc(0, 0, 3 * s, 0, Math.PI * 2);
  ctx.fillStyle = "#222";
  ctx.fill();
  ctx.strokeStyle = lighter(col, 40);
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();
  // gauge needle
  const needleAngle = -Math.PI * 0.7 + (0.5 + pistonStroke * 0.5) * Math.PI * 1.4;
  ctx.strokeStyle = "#ff3333";
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(needleAngle) * 2.5 * s, Math.sin(needleAngle) * 2.5 * s);
  ctx.stroke();

  // -- eyes (industrial) --
  ctx.fillStyle = "#ffaa00";
  ctx.shadowColor = "#ffaa00";
  ctx.shadowBlur = 2 * s;
  ctx.beginPath();
  ctx.rect(-5 * s, -5 * s, 3 * s, 2 * s);
  ctx.fill();
  ctx.beginPath();
  ctx.rect(2 * s, -5 * s, 3 * s, 2 * s);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  9. drawNeonRay  -  "ネオンレイ"                                    */
/*     eng_09: Sleek neon-lit sniper with glowing ray beam effect.     */
/* ------------------------------------------------------------------ */
export function drawNeonRay(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- shadow --
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 8 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // -- slim legs --
  const walk = Math.sin(t * 4 + ph) * 2 * s;
  ctx.fillStyle = darker(col, 55);
  ctx.fillRect(-4 * s + walk * 0.3, 8 * s, 3 * s, 7 * s);
  ctx.fillRect(1 * s - walk * 0.3, 8 * s, 3 * s, 7 * s);
  // neon-trimmed boots
  ctx.fillStyle = darker(col, 80);
  ctx.fillRect(-5 * s + walk * 0.3, 13 * s, 4 * s, 2 * s);
  ctx.fillRect(0.5 * s - walk * 0.3, 13 * s, 4 * s, 2 * s);
  // boot neon strips
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(-5 * s + walk * 0.3, 14.5 * s, 4 * s, 0.5 * s);
  ctx.fillRect(0.5 * s - walk * 0.3, 14.5 * s, 4 * s, 0.5 * s);

  // -- sniper rifle (long barrel, right side) --
  const aimBob = Math.sin(t * 1.5 + ph) * 0.05;
  ctx.save();
  ctx.translate(5 * s, -2 * s);
  ctx.rotate(aimBob);
  // barrel
  ctx.fillStyle = darker(col, 60);
  ctx.fillRect(0, -1 * s, 14 * s, 2 * s);
  // scope
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(5 * s, -3 * s, 4 * s, 2 * s);
  ctx.beginPath();
  ctx.arc(7 * s, -3 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fillStyle = "#334";
  ctx.fill();
  // scope lens glow
  ctx.fillStyle = `rgba(0,255,200,${0.4 + Math.sin(t * 3) * 0.2})`;
  ctx.beginPath();
  ctx.arc(7 * s, -3 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  // stock
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-4 * s, -1.5 * s, 5 * s, 3 * s);
  // muzzle neon
  ctx.fillStyle = `rgba(0,255,200,${0.3 + Math.sin(t * 4) * 0.2})`;
  ctx.fillRect(13 * s, -1.5 * s, 1.5 * s, 3 * s);
  ctx.restore();

  // -- ray beam effect (periodic) --
  const beamPhase = Math.sin(t * 2 + ph);
  if (beamPhase > 0.7) {
    const beamAlpha = (beamPhase - 0.7) / 0.3;
    const beamGrad = ctx.createLinearGradient(18 * s, -2 * s, 35 * s, -2 * s);
    beamGrad.addColorStop(0, `rgba(0,255,200,${beamAlpha * 0.6})`);
    beamGrad.addColorStop(1, `rgba(0,255,200,0)`);
    ctx.fillStyle = beamGrad;
    ctx.fillRect(18 * s, -3 * s, 20 * s, 2 * s);
  }

  // -- sleek body (angular, futuristic) --
  const bodyGrad = ctx.createLinearGradient(-6 * s, -10 * s, 6 * s, 8 * s);
  bodyGrad.addColorStop(0, lighter(col, 15));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 40));
  ctx.beginPath();
  ctx.moveTo(-2 * s, -12 * s);
  ctx.lineTo(5 * s, -10 * s);
  ctx.lineTo(7 * s, -2 * s);
  ctx.lineTo(6 * s, 8 * s);
  ctx.lineTo(-6 * s, 8 * s);
  ctx.lineTo(-7 * s, -2 * s);
  ctx.lineTo(-5 * s, -10 * s);
  ctx.closePath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 45);
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();

  // -- neon accent lines on body --
  ctx.strokeStyle = "#00ffcc";
  ctx.shadowColor = "#00ffcc";
  ctx.shadowBlur = 3 * s;
  ctx.lineWidth = 0.7 * s;
  // left neon strip
  ctx.beginPath();
  ctx.moveTo(-5 * s, -9 * s);
  ctx.lineTo(-6.5 * s, -1 * s);
  ctx.lineTo(-5.5 * s, 7 * s);
  ctx.stroke();
  // right neon strip
  ctx.beginPath();
  ctx.moveTo(5 * s, -9 * s);
  ctx.lineTo(6.5 * s, -1 * s);
  ctx.lineTo(5.5 * s, 7 * s);
  ctx.stroke();
  // chest neon V
  ctx.beginPath();
  ctx.moveTo(-3 * s, -6 * s);
  ctx.lineTo(0, -2 * s);
  ctx.lineTo(3 * s, -6 * s);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // -- left arm (holding rifle support) --
  ctx.fillStyle = darker(col, 45);
  ctx.fillRect(-7 * s, -3 * s, 3 * s, 7 * s);

  // -- head (sleek visor helmet) --
  ctx.fillStyle = darker(col, 25);
  ctx.beginPath();
  ctx.moveTo(-4 * s, -12 * s);
  ctx.lineTo(4 * s, -12 * s);
  ctx.lineTo(5 * s, -9 * s);
  ctx.lineTo(-5 * s, -9 * s);
  ctx.closePath();
  ctx.fill();
  // visor
  ctx.fillStyle = "#00ffcc";
  ctx.shadowColor = "#00ffcc";
  ctx.shadowBlur = 4 * s;
  ctx.fillRect(-3.5 * s, -11.5 * s, 7 * s, 1.8 * s);
  ctx.shadowBlur = 0;
  // visor reflection
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(-2 * s, -11.5 * s, 2 * s, 1 * s);

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  10. drawChronoMecha  -  "クロノメカ"                               */
/*     eng_10: Advanced mech with clock/time motifs, gears and hands.  */
/* ------------------------------------------------------------------ */
export function drawChronoMecha(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // -- shadow --
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // -- mech legs (articulated) --
  const walk = Math.sin(t * 3.5 + ph) * 2.5 * s;
  // left leg
  ctx.fillStyle = darker(col, 55);
  ctx.fillRect(-6 * s + walk * 0.2, 6 * s, 4 * s, 4 * s);
  ctx.fillStyle = darker(col, 65);
  ctx.fillRect(-5.5 * s + walk * 0.2, 10 * s, 3 * s, 5 * s);
  // knee gear
  ctx.beginPath();
  ctx.arc(-4 * s + walk * 0.2, 10 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fillStyle = lighter(col, 35);
  ctx.fill();
  // right leg
  ctx.fillStyle = darker(col, 55);
  ctx.fillRect(2 * s - walk * 0.2, 6 * s, 4 * s, 4 * s);
  ctx.fillStyle = darker(col, 65);
  ctx.fillRect(2.5 * s - walk * 0.2, 10 * s, 3 * s, 5 * s);
  ctx.beginPath();
  ctx.arc(4 * s - walk * 0.2, 10 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fillStyle = lighter(col, 35);
  ctx.fill();
  // feet
  ctx.fillStyle = darker(col, 80);
  ctx.fillRect(-7 * s + walk * 0.2, 14 * s, 5 * s, 2 * s);
  ctx.fillRect(1.5 * s - walk * 0.2, 14 * s, 5 * s, 2 * s);

  // -- body (mech torso) --
  const bodyGrad = ctx.createLinearGradient(-8 * s, -8 * s, 8 * s, 6 * s);
  bodyGrad.addColorStop(0, lighter(col, 25));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 35));
  ctx.beginPath();
  ctx.moveTo(-8 * s, -8 * s);
  ctx.lineTo(8 * s, -8 * s);
  ctx.lineTo(9 * s, -2 * s);
  ctx.lineTo(8 * s, 7 * s);
  ctx.lineTo(-8 * s, 7 * s);
  ctx.lineTo(-9 * s, -2 * s);
  ctx.closePath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // -- clock face (chest, main feature) --
  const clockR = 5.5 * s;
  ctx.beginPath();
  ctx.arc(0, -1 * s, clockR, 0, Math.PI * 2);
  ctx.fillStyle = "#1a1a2e";
  ctx.fill();
  ctx.strokeStyle = lighter(col, 50);
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // clock hour markers
  ctx.fillStyle = lighter(col, 60);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const mx = Math.cos(a) * (clockR - 1.2 * s);
    const my = -1 * s + Math.sin(a) * (clockR - 1.2 * s);
    ctx.beginPath();
    ctx.arc(mx, my, 0.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // hour hand (slow)
  const hourAngle = t * 0.2 + ph;
  ctx.strokeStyle = lighter(col, 70);
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(0, -1 * s);
  ctx.lineTo(Math.cos(hourAngle - Math.PI / 2) * 3 * s, -1 * s + Math.sin(hourAngle - Math.PI / 2) * 3 * s);
  ctx.stroke();

  // minute hand (faster)
  const minAngle = t * 1.2 + ph;
  ctx.strokeStyle = lighter(col, 80);
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(0, -1 * s);
  ctx.lineTo(Math.cos(minAngle - Math.PI / 2) * 4.5 * s, -1 * s + Math.sin(minAngle - Math.PI / 2) * 4.5 * s);
  ctx.stroke();

  // second hand (fastest, red)
  const secAngle = t * 6 + ph;
  ctx.strokeStyle = "#ff4455";
  ctx.lineWidth = 0.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -1 * s);
  ctx.lineTo(Math.cos(secAngle - Math.PI / 2) * 5 * s, -1 * s + Math.sin(secAngle - Math.PI / 2) * 5 * s);
  ctx.stroke();

  // center pin
  ctx.beginPath();
  ctx.arc(0, -1 * s, 0.8 * s, 0, Math.PI * 2);
  ctx.fillStyle = "#ff4455";
  ctx.fill();

  // -- decorative gears (shoulders) --
  const gearSpin = t * 1.5;
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 9 * s, -5 * s);
    ctx.rotate(gearSpin * side);
    const gR = 3 * s;
    const gTeeth = 6;
    ctx.beginPath();
    for (let i = 0; i < gTeeth; i++) {
      const a0 = (i / gTeeth) * Math.PI * 2;
      const a1 = a0 + (0.3 / gTeeth) * Math.PI * 2;
      const a2 = a0 + (0.5 / gTeeth) * Math.PI * 2;
      const a3 = a0 + (0.8 / gTeeth) * Math.PI * 2;
      if (i === 0) ctx.moveTo(Math.cos(a0) * gR, Math.sin(a0) * gR);
      ctx.lineTo(Math.cos(a1) * (gR + 1.5 * s), Math.sin(a1) * (gR + 1.5 * s));
      ctx.lineTo(Math.cos(a2) * (gR + 1.5 * s), Math.sin(a2) * (gR + 1.5 * s));
      ctx.lineTo(Math.cos(a3) * gR, Math.sin(a3) * gR);
    }
    ctx.closePath();
    ctx.fillStyle = darker(col, 20);
    ctx.fill();
    ctx.strokeStyle = darker(col, 50);
    ctx.lineWidth = 0.5 * s;
    ctx.stroke();
    // axle
    ctx.beginPath();
    ctx.arc(0, 0, 1 * s, 0, Math.PI * 2);
    ctx.fillStyle = lighter(col, 40);
    ctx.fill();
    ctx.restore();
  }

  // -- arms --
  const armSwing = Math.sin(t * 2.5 + ph) * 0.2;
  ctx.save();
  ctx.translate(-9 * s, -2 * s);
  ctx.rotate(armSwing + 0.2);
  ctx.fillStyle = darker(col, 45);
  ctx.fillRect(-1.5 * s, 0, 3 * s, 9 * s);
  // wrist chrono-device
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(-2.5 * s, 7 * s, 5 * s, 3 * s);
  ctx.fillStyle = "#00ccff";
  ctx.fillRect(-1.5 * s, 7.5 * s, 3 * s, 2 * s);
  ctx.restore();
  ctx.save();
  ctx.translate(9 * s, -2 * s);
  ctx.rotate(-armSwing - 0.2);
  ctx.fillStyle = darker(col, 45);
  ctx.fillRect(-1.5 * s, 0, 3 * s, 9 * s);
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(-2.5 * s, 7 * s, 5 * s, 3 * s);
  ctx.fillStyle = "#00ccff";
  ctx.fillRect(-1.5 * s, 7.5 * s, 3 * s, 2 * s);
  ctx.restore();

  // -- head (mech helm with clock motif) --
  ctx.fillStyle = darker(col, 20);
  ctx.beginPath();
  ctx.moveTo(-5 * s, -13 * s);
  ctx.lineTo(5 * s, -13 * s);
  ctx.lineTo(6 * s, -8 * s);
  ctx.lineTo(-6 * s, -8 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();

  // antenna / clock pendulum
  ctx.strokeStyle = lighter(col, 40);
  ctx.lineWidth = 0.8 * s;
  const pendAngle = Math.sin(t * 2) * 0.3;
  ctx.save();
  ctx.translate(0, -13 * s);
  ctx.rotate(pendAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -4 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -4 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fillStyle = lighter(col, 50);
  ctx.fill();
  ctx.restore();

  // eyes (glowing blue, digital)
  ctx.fillStyle = "#00ccff";
  ctx.shadowColor = "#00ccff";
  ctx.shadowBlur = 3 * s;
  ctx.fillRect(-4 * s, -12 * s, 3 * s, 2 * s);
  ctx.fillRect(1 * s, -12 * s, 3 * s, 2 * s);
  ctx.shadowBlur = 0;

  // -- time distortion rings (subtle) --
  const ringAlpha = 0.08 + Math.sin(t * 2) * 0.05;
  ctx.strokeStyle = `rgba(0,200,255,${ringAlpha})`;
  ctx.lineWidth = 0.5 * s;
  const ringR = 14 * s + Math.sin(t * 1.5) * 2 * s;
  ctx.beginPath();
  ctx.ellipse(0, 0, ringR, ringR * 0.3, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  11. drawBattery  -  "バッテリー兵"                                  */
/* ------------------------------------------------------------------ */
export function drawBattery(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 17;
  const bob = Math.sin(t * 2.8 + ph) * 1.1 * s;
  const y = cy + bob;
  const legSwing = Math.sin(ph * Math.PI * 2) * 1.3 * s;

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(cx, y + 13 * s, 10.5 * s, 2.8 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // minus shoes
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(cx - 7.5 * s + legSwing, y + 10 * s, 5 * s, 3 * s);
  ctx.fillRect(cx + 2.5 * s - legSwing, y + 10 * s, 5 * s, 3 * s);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(cx - 5.7 * s + legSwing, y + 11.1 * s, 1.4 * s, 0.6 * s);
  ctx.fillRect(cx + 4.3 * s - legSwing, y + 11.1 * s, 1.4 * s, 0.6 * s);

  // battery body (AA cylinder)
  const bodyGrad = ctx.createLinearGradient(cx - 7 * s, y - 10 * s, cx + 7 * s, y + 10 * s);
  bodyGrad.addColorStop(0, lighter(col, 24));
  bodyGrad.addColorStop(0.6, col);
  bodyGrad.addColorStop(1, darker(col, 28));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(cx - 7.5 * s, y - 9 * s, 15 * s, 19 * s, 4.5 * s);
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1;
  ctx.stroke();

  // plus terminal hat
  ctx.fillStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.roundRect(cx - 4 * s, y - 11.5 * s, 8 * s, 3 * s, 1.2 * s);
  ctx.fill();
  ctx.strokeStyle = "#94a3b8";
  ctx.stroke();
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(cx - 0.45 * s, y - 10.8 * s, 0.9 * s, 1.6 * s);
  ctx.fillRect(cx - 1.2 * s, y - 10.1 * s, 2.4 * s, 0.9 * s);

  // chest lightning mark
  ctx.fillStyle = "#fef08a";
  ctx.beginPath();
  ctx.moveTo(cx - 1.2 * s, y - 2.5 * s);
  ctx.lineTo(cx + 0.2 * s, y - 2.5 * s);
  ctx.lineTo(cx - 0.6 * s, y + 0.7 * s);
  ctx.lineTo(cx + 1.3 * s, y + 0.7 * s);
  ctx.lineTo(cx - 0.4 * s, y + 4.5 * s);
  ctx.lineTo(cx - 0.1 * s, y + 1.9 * s);
  ctx.lineTo(cx - 1.5 * s, y + 1.9 * s);
  ctx.closePath();
  ctx.fill();

  // charge pulse glow
  const pulse = 0.18 + 0.17 * (0.5 + 0.5 * Math.sin(t * 5));
  ctx.fillStyle = `rgba(190,242,100,${pulse})`;
  ctx.beginPath();
  ctx.ellipse(cx, y, 9 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // face
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(cx - 2.3 * s, y - 3 * s, 0.9 * s, 0, Math.PI * 2);
  ctx.arc(cx + 2.3 * s, y - 3 * s, 0.9 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1f2937";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(cx, y + 0.9 * s, 2.2 * s, 0.15, Math.PI - 0.15);
  ctx.stroke();
}

/* ------------------------------------------------------------------ */
/*  12. drawDrone  -  "ドローン先生"                                    */
/* ------------------------------------------------------------------ */
export function drawDrone(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 16;
  const hover = Math.sin(t * 3.2 + ph) * 1.4 * s;
  const y = cy + hover;
  const spin = t * 14 + ph * Math.PI * 2;

  // soft floating shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(cx, y + 12.5 * s, 12 * s, 2.8 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // arms to motors
  ctx.strokeStyle = darker(col, 45);
  ctx.lineWidth = 1.2;
  const arms = [
    [-7.5, -6], [7.5, -6], [-7.5, 6], [7.5, 6],
  ];
  arms.forEach(([ax, ay]) => {
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(cx + ax * s, y + ay * s);
    ctx.stroke();
  });

  // rotors
  arms.forEach(([ax, ay], i) => {
    const mx = cx + ax * s;
    const my = y + ay * s;
    ctx.fillStyle = darker(col, 30);
    ctx.beginPath();
    ctx.arc(mx, my, 1.8 * s, 0, Math.PI * 2);
    ctx.fill();

    // spinning blades
    ctx.save();
    ctx.translate(mx, my);
    ctx.rotate(spin + i * 0.6);
    ctx.fillStyle = "rgba(148,163,184,0.55)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 4.2 * s, 0.65 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 4.2 * s, 0.65 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // central body
  const bodyGrad = ctx.createRadialGradient(cx - 1.5 * s, y - 1.5 * s, 1, cx, y, 7 * s);
  bodyGrad.addColorStop(0, lighter(col, 28));
  bodyGrad.addColorStop(1, darker(col, 26));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(cx, y, 7 * s, 5.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1;
  ctx.stroke();

  // graduation cap (teacher)
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.moveTo(cx - 4.8 * s, y - 5.8 * s);
  ctx.lineTo(cx + 4.8 * s, y - 5.8 * s);
  ctx.lineTo(cx + 2.7 * s, y - 7.2 * s);
  ctx.lineTo(cx - 2.7 * s, y - 7.2 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#334155";
  ctx.stroke();
  // tassel
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(cx + 2.8 * s, y - 6.9 * s);
  ctx.lineTo(cx + 4.6 * s, y - 5.1 * s + Math.sin(t * 4 + ph) * 0.4 * s);
  ctx.stroke();
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(cx + 4.7 * s, y - 5 * s + Math.sin(t * 4 + ph) * 0.4 * s, 0.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // camera eye
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(cx, y + 0.5 * s, 2.2 * s, 0, Math.PI * 2);
  ctx.fill();
  const lens = ctx.createRadialGradient(cx - 0.6 * s, y, 0, cx, y + 0.4 * s, 1.8 * s);
  lens.addColorStop(0, "#93c5fd");
  lens.addColorStop(1, "#1d4ed8");
  ctx.fillStyle = lens;
  ctx.beginPath();
  ctx.arc(cx, y + 0.5 * s, 1.6 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(cx - 0.5 * s, y - 0.1 * s, 0.45 * s, 0, Math.PI * 2);
  ctx.fill();

  // led indicators
  const ledAlpha = 0.45 + 0.35 * (0.5 + 0.5 * Math.sin(t * 6));
  ctx.fillStyle = `rgba(34,197,94,${ledAlpha})`;
  ctx.beginPath();
  ctx.arc(cx - 3.8 * s, y + 2.3 * s, 0.6 * s, 0, Math.PI * 2);
  ctx.arc(cx + 3.8 * s, y + 2.3 * s, 0.6 * s, 0, Math.PI * 2);
  ctx.fill();
}
