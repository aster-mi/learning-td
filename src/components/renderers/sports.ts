// sports.ts - Sports (スポーツ) themed tower defense character renderers
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
// 1. drawRunnerBlade (spo_01) "ランナーブレード"
//    Speed skater/sprinter with blade shoes. Aerodynamic lean, speed lines.
// ─────────────────────────────────────────────
export function drawRunnerBlade(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  const bob = Math.sin(t * 8 + ph) * 1.5 * s;
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(2 * s, 14 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Speed lines behind
  const speedAlpha = 0.15 + Math.sin(t * 10) * 0.08;
  ctx.strokeStyle = `rgba(200,200,255,${speedAlpha})`;
  ctx.lineWidth = 1 * s;
  for (let i = 0; i < 4; i++) {
    const ly = -8 * s + i * 5 * s + bob * 0.3;
    ctx.beginPath();
    ctx.moveTo(-18 * s - i * 2 * s, ly);
    ctx.lineTo(-10 * s, ly);
    ctx.stroke();
  }

  // Legs - long sprinter legs with blade shoes
  const legCycle = Math.sin(t * 8 + ph);
  const legBack = legCycle * 6 * s;
  const legFront = -legCycle * 6 * s;
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 3.5 * s;
  ctx.lineCap = "round";
  // Back leg
  ctx.beginPath();
  ctx.moveTo(-2 * s, 5 * s);
  ctx.lineTo(-2 * s + legBack * 0.5, 12 * s + Math.abs(legBack) * 0.2);
  ctx.stroke();
  // Front leg
  ctx.beginPath();
  ctx.moveTo(2 * s, 5 * s);
  ctx.lineTo(2 * s + legFront * 0.5, 12 * s + Math.abs(legFront) * 0.2);
  ctx.stroke();

  // Blade shoes - curved metal blades
  ctx.strokeStyle = "#c0c8d8";
  ctx.lineWidth = 2 * s;
  const backFootX = -2 * s + legBack * 0.5;
  const backFootY = 12 * s + Math.abs(legBack) * 0.2;
  ctx.beginPath();
  ctx.moveTo(backFootX - 3 * s, backFootY);
  ctx.quadraticCurveTo(backFootX + 4 * s, backFootY + 2 * s, backFootX + 7 * s, backFootY - 1 * s);
  ctx.stroke();
  const frontFootX = 2 * s + legFront * 0.5;
  const frontFootY = 12 * s + Math.abs(legFront) * 0.2;
  ctx.beginPath();
  ctx.moveTo(frontFootX - 3 * s, frontFootY);
  ctx.quadraticCurveTo(frontFootX + 4 * s, frontFootY + 2 * s, frontFootX + 7 * s, frontFootY - 1 * s);
  ctx.stroke();

  // Body - aerodynamic, leaning forward
  const bodyGrad = ctx.createLinearGradient(-6 * s, -10 * s, 6 * s, 6 * s);
  bodyGrad.addColorStop(0, lighter(col, 30));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(5 * s, -10 * s + bob);
  ctx.quadraticCurveTo(8 * s, -4 * s + bob, 4 * s, 6 * s);
  ctx.lineTo(-4 * s, 6 * s);
  ctx.quadraticCurveTo(-7 * s, -2 * s + bob, -3 * s, -10 * s + bob);
  ctx.closePath();
  ctx.fill();

  // Racing stripe on torso
  ctx.strokeStyle = lighter(col, 60);
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -8 * s + bob);
  ctx.lineTo(1 * s, 4 * s);
  ctx.stroke();

  // Head - aerodynamic helmet shape
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(1 * s, -13 * s + bob, 5 * s, 4.5 * s, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // Visor
  const visorGrad = ctx.createLinearGradient(0, -15 * s, 0, -11 * s);
  visorGrad.addColorStop(0, "rgba(100,200,255,0.5)");
  visorGrad.addColorStop(1, "rgba(50,100,200,0.3)");
  ctx.fillStyle = visorGrad;
  ctx.beginPath();
  ctx.ellipse(3 * s, -13 * s + bob, 3.5 * s, 2.5 * s, -0.1, -0.4, Math.PI * 0.7);
  ctx.fill();

  // Eyes behind visor
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(0, -13.5 * s + bob, 1.5 * s, 0, Math.PI * 2);
  ctx.arc(3.5 * s, -13.5 * s + bob, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(0.8 * s, -13.5 * s + bob, 0.8 * s, 0, Math.PI * 2);
  ctx.arc(4.3 * s, -13.5 * s + bob, 0.8 * s, 0, Math.PI * 2);
  ctx.fill();

  // Arms - tucked in for speed
  const armPump = Math.sin(t * 8 + ph) * 5 * s;
  ctx.strokeStyle = darker(col, 20);
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(-4 * s, -4 * s + bob);
  ctx.lineTo(-7 * s, -1 * s + armPump);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4 * s, -4 * s + bob);
  ctx.lineTo(7 * s, -1 * s - armPump);
  ctx.stroke();

  ctx.restore();
}

// ─────────────────────────────────────────────
// 2. drawKeeperGuard (spo_02) "キーパーガード"
//    Soccer goalkeeper. Bulky gloves, wide ready pose, goal net pattern.
// ─────────────────────────────────────────────
export function drawKeeperGuard(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  const sway = Math.sin(t * 3 + ph) * 2 * s;
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 12 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs - wide goalkeeper stance
  const legShift = Math.sin(t * 4 + ph) * 2 * s;
  ctx.fillStyle = "#1a1a1a";
  // Left leg (wide)
  ctx.beginPath();
  ctx.moveTo(-5 * s, 4 * s);
  ctx.lineTo(-9 * s, 13 * s + legShift);
  ctx.lineTo(-5 * s, 13 * s + legShift);
  ctx.lineTo(-3 * s, 4 * s);
  ctx.fill();
  // Right leg (wide)
  ctx.beginPath();
  ctx.moveTo(3 * s, 4 * s);
  ctx.lineTo(5 * s, 13 * s - legShift);
  ctx.lineTo(9 * s, 13 * s - legShift);
  ctx.lineTo(5 * s, 4 * s);
  ctx.fill();
  // Cleats
  ctx.fillStyle = "#fff";
  ctx.fillRect(-10 * s, 12 * s + legShift, 6 * s, 2.5 * s);
  ctx.fillRect(5 * s, 12 * s - legShift, 6 * s, 2.5 * s);
  // Cleat studs
  ctx.fillStyle = "#888";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(-9 * s + i * 2 * s, 14 * s + legShift, 1 * s, 1.5 * s);
    ctx.fillRect(6 * s + i * 2 * s, 14 * s - legShift, 1 * s, 1.5 * s);
  }

  // Body - bulky goalkeeper jersey with net pattern
  const jerseyGrad = ctx.createLinearGradient(-8 * s, -8 * s, 8 * s, 6 * s);
  jerseyGrad.addColorStop(0, lighter(col, 20));
  jerseyGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = jerseyGrad;
  ctx.beginPath();
  ctx.roundRect(-8 * s, -8 * s + sway, 16 * s, 14 * s, 3 * s);
  ctx.fill();

  // Goal net pattern on jersey
  ctx.strokeStyle = lighter(col, 50);
  ctx.lineWidth = 0.5 * s;
  ctx.globalAlpha = 0.3;
  for (let nx = -6; nx <= 6; nx += 3) {
    ctx.beginPath();
    ctx.moveTo(nx * s, -7 * s + sway);
    ctx.lineTo(nx * s, 5 * s);
    ctx.stroke();
  }
  for (let ny = -6; ny <= 4; ny += 3) {
    ctx.beginPath();
    ctx.moveTo(-7 * s, ny * s + sway);
    ctx.lineTo(7 * s, ny * s + sway);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  // Jersey number
  ctx.fillStyle = lighter(col, 70);
  ctx.fillRect(-2 * s, -3 * s + sway, 4 * s, 5 * s);
  ctx.fillStyle = col;
  ctx.fillRect(-1 * s, -2 * s + sway, 2 * s, 3 * s);

  // Head
  ctx.fillStyle = "#f0d0a0";
  ctx.beginPath();
  ctx.arc(0, -12 * s + sway, 5 * s, 0, Math.PI * 2);
  ctx.fill();
  // Goalkeeper cap
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(0, -13.5 * s + sway, 5.5 * s, Math.PI, 0);
  ctx.fill();
  // Cap brim
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(-5.5 * s, -13.5 * s + sway, 12 * s, 2 * s);

  // Eyes - focused
  ctx.fillStyle = "#fff";
  ctx.fillRect(-3 * s, -13 * s + sway, 2.5 * s, 2 * s);
  ctx.fillRect(1 * s, -13 * s + sway, 2.5 * s, 2 * s);
  ctx.fillStyle = "#222";
  ctx.fillRect(-1.5 * s, -12.5 * s + sway, 1.5 * s, 1.5 * s);
  ctx.fillRect(2 * s, -12.5 * s + sway, 1.5 * s, 1.5 * s);
  // Determined mouth
  ctx.strokeStyle = "#833";
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(-2 * s, -9.5 * s + sway);
  ctx.lineTo(2 * s, -9.5 * s + sway);
  ctx.stroke();

  // Arms - spread wide with HUGE gloves
  const armReady = Math.sin(t * 2.5 + ph) * 3 * s;
  ctx.strokeStyle = col;
  ctx.lineWidth = 3.5 * s;
  ctx.lineCap = "round";
  // Left arm
  ctx.beginPath();
  ctx.moveTo(-8 * s, -4 * s + sway);
  ctx.lineTo(-14 * s, -8 * s + armReady);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(8 * s, -4 * s + sway);
  ctx.lineTo(14 * s, -8 * s - armReady);
  ctx.stroke();

  // Giant goalkeeper gloves
  ctx.fillStyle = lighter(col, 40);
  ctx.beginPath();
  ctx.roundRect(-18 * s, -12 * s + armReady, 6 * s, 7 * s, 2 * s);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(12 * s, -12 * s - armReady, 6 * s, 7 * s, 2 * s);
  ctx.fill();
  // Glove padding lines
  ctx.strokeStyle = lighter(col, 70);
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(-16.5 * s, -10 * s + armReady);
  ctx.lineTo(-16.5 * s, -7 * s + armReady);
  ctx.moveTo(14.5 * s, -10 * s - armReady);
  ctx.lineTo(14.5 * s, -7 * s - armReady);
  ctx.stroke();

  ctx.restore();
}

// ─────────────────────────────────────────────
// 3. drawArrowThrow (spo_03) "アロースロー"
//    Javelin thrower. Athletic build, javelin held high, track outfit.
// ─────────────────────────────────────────────
export function drawArrowThrow(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  const throwPhase = Math.sin(t * 3 + ph);
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 9 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs - athletic, mid-stride throwing pose
  const legRun = Math.sin(t * 5 + ph) * 4 * s;
  ctx.strokeStyle = "#d4a574";
  ctx.lineWidth = 3.5 * s;
  ctx.lineCap = "round";
  // Back leg - planted
  ctx.beginPath();
  ctx.moveTo(-3 * s, 5 * s);
  ctx.lineTo(-5 * s, 10 * s);
  ctx.lineTo(-7 * s + legRun * 0.3, 14 * s);
  ctx.stroke();
  // Front leg - striding
  ctx.beginPath();
  ctx.moveTo(3 * s, 5 * s);
  ctx.lineTo(6 * s, 10 * s);
  ctx.lineTo(5 * s - legRun * 0.3, 14 * s);
  ctx.stroke();
  // Track spikes
  ctx.fillStyle = col;
  ctx.fillRect(-9 * s + legRun * 0.3, 13 * s, 5 * s, 2 * s);
  ctx.fillRect(3 * s - legRun * 0.3, 13 * s, 5 * s, 2 * s);

  // Body - muscular athletic torso, slightly rotated for throw
  const bodyRotate = throwPhase * 0.15;
  ctx.save();
  ctx.rotate(bodyRotate);
  const torsoGrad = ctx.createLinearGradient(-5 * s, -6 * s, 5 * s, 5 * s);
  torsoGrad.addColorStop(0, col);
  torsoGrad.addColorStop(1, darker(col, 35));
  ctx.fillStyle = torsoGrad;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -6 * s);
  ctx.lineTo(6 * s, -6 * s);
  ctx.quadraticCurveTo(7 * s, 0, 5 * s, 6 * s);
  ctx.lineTo(-5 * s, 6 * s);
  ctx.quadraticCurveTo(-7 * s, 0, -6 * s, -6 * s);
  ctx.fill();

  // Tank top straps
  ctx.strokeStyle = lighter(col, 40);
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(-3 * s, -6 * s);
  ctx.lineTo(-4 * s, -2 * s);
  ctx.moveTo(3 * s, -6 * s);
  ctx.lineTo(4 * s, -2 * s);
  ctx.stroke();

  // Number bib
  ctx.fillStyle = "#fff";
  ctx.fillRect(-4 * s, -2 * s, 8 * s, 5 * s);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 0.5 * s;
  ctx.strokeRect(-4 * s, -2 * s, 8 * s, 5 * s);
  ctx.restore();

  // Head
  ctx.fillStyle = "#d4a574";
  ctx.beginPath();
  ctx.arc(0, -10 * s, 5 * s, 0, Math.PI * 2);
  ctx.fill();
  // Headband
  ctx.fillStyle = col;
  ctx.fillRect(-5.2 * s, -12 * s, 10.4 * s, 2.5 * s);
  // Headband tail
  ctx.strokeStyle = col;
  ctx.lineWidth = 2 * s;
  const bandWave = Math.sin(t * 5 + ph) * 2 * s;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -11 * s);
  ctx.quadraticCurveTo(-8 * s, -10 * s + bandWave, -10 * s, -12 * s + bandWave);
  ctx.stroke();

  // Eyes - intense focus
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-2 * s, -10.5 * s, 1.8 * s, 0, Math.PI * 2);
  ctx.arc(2.5 * s, -10.5 * s, 1.8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(-1.2 * s, -10.5 * s, 1 * s, 0, Math.PI * 2);
  ctx.arc(3.3 * s, -10.5 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();

  // Throwing arm - pulled back with javelin
  const throwAngle = -0.8 + throwPhase * 0.4;
  ctx.save();
  ctx.translate(4 * s, -5 * s);
  ctx.rotate(throwAngle);
  // Upper arm
  ctx.strokeStyle = "#d4a574";
  ctx.lineWidth = 3.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -9 * s);
  ctx.stroke();
  // Hand
  ctx.fillStyle = "#d4a574";
  ctx.beginPath();
  ctx.arc(0, -9 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();

  // Javelin
  ctx.strokeStyle = "#c0c0c0";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -9 * s);
  ctx.lineTo(2 * s, -28 * s);
  ctx.stroke();
  // Javelin tip
  ctx.fillStyle = "#e0e0e0";
  ctx.beginPath();
  ctx.moveTo(2 * s, -28 * s);
  ctx.lineTo(1 * s, -26 * s);
  ctx.lineTo(3 * s, -26 * s);
  ctx.closePath();
  ctx.fill();
  // Javelin grip
  ctx.fillStyle = darker(col, 10);
  ctx.fillRect(-1 * s, -11 * s, 2 * s, 4 * s);
  ctx.restore();

  // Non-throwing arm
  ctx.strokeStyle = "#d4a574";
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -4 * s);
  ctx.lineTo(-9 * s, 0);
  ctx.stroke();

  ctx.restore();
}

// ─────────────────────────────────────────────
// 4. drawSpeedSmasher (spo_04) "スピードスマッシャー"
//    Badminton/tennis player with racket. Dynamic swing pose.
// ─────────────────────────────────────────────
export function drawSpeedSmasher(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  const swingT = Math.sin(t * 4 + ph);
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 9 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs - active stance, ready to leap
  const legBounce = Math.sin(t * 6 + ph) * 3 * s;
  ctx.strokeStyle = "#f0d0a0";
  ctx.lineWidth = 3 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-3 * s, 5 * s);
  ctx.lineTo(-5 * s, 9 * s);
  ctx.lineTo(-4 * s, 13 * s + legBounce);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(3 * s, 5 * s);
  ctx.lineTo(5 * s, 9 * s);
  ctx.lineTo(6 * s, 13 * s - legBounce);
  ctx.stroke();
  // Athletic shoes
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(-7 * s, 12 * s + legBounce, 5 * s, 3 * s, 1 * s);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(4 * s, 12 * s - legBounce, 5 * s, 3 * s, 1 * s);
  ctx.fill();
  ctx.fillStyle = col;
  ctx.fillRect(-6.5 * s, 12.5 * s + legBounce, 2 * s, 1.5 * s);
  ctx.fillRect(4.5 * s, 12.5 * s - legBounce, 2 * s, 1.5 * s);

  // Body - sporty polo shirt
  const bodyGrad = ctx.createLinearGradient(-6 * s, -6 * s, 6 * s, 6 * s);
  bodyGrad.addColorStop(0, lighter(col, 15));
  bodyGrad.addColorStop(1, col);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-6 * s, -6 * s, 12 * s, 12 * s, 2 * s);
  ctx.fill();
  // Polo collar
  ctx.fillStyle = lighter(col, 40);
  ctx.beginPath();
  ctx.moveTo(-3 * s, -6 * s);
  ctx.lineTo(0, -4.5 * s);
  ctx.lineTo(3 * s, -6 * s);
  ctx.lineTo(4 * s, -6 * s);
  ctx.lineTo(0, -3.5 * s);
  ctx.lineTo(-4 * s, -6 * s);
  ctx.closePath();
  ctx.fill();
  // Stripe on shorts
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(-6 * s, 3 * s, 12 * s, 3 * s);
  ctx.fillStyle = "#fff";
  ctx.fillRect(-6 * s, 3.5 * s, 12 * s, 1 * s);

  // Head
  ctx.fillStyle = "#f0d0a0";
  ctx.beginPath();
  ctx.arc(0, -10 * s, 4.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // Sporty visor
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(0, -11 * s, 5 * s, Math.PI + 0.3, -0.3);
  ctx.fill();
  ctx.fillStyle = col;
  ctx.fillRect(-5 * s, -12 * s, 10 * s, 2 * s);

  // Eyes
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-1.5 * s, -10.5 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.arc(2 * s, -10.5 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(-0.8 * s, -10.5 * s, 0.8 * s, 0, Math.PI * 2);
  ctx.arc(2.7 * s, -10.5 * s, 0.8 * s, 0, Math.PI * 2);
  ctx.fill();
  // Grin
  ctx.strokeStyle = "#833";
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.arc(0.5 * s, -8.5 * s, 2 * s, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Left arm (non-racket)
  ctx.strokeStyle = "#f0d0a0";
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -3 * s);
  ctx.lineTo(-10 * s, 1 * s);
  ctx.stroke();

  // Right arm + racket (swinging)
  const racketAngle = -1.2 + swingT * 0.8;
  ctx.save();
  ctx.translate(6 * s, -4 * s);
  ctx.rotate(racketAngle);
  // Arm
  ctx.strokeStyle = "#f0d0a0";
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -8 * s);
  ctx.stroke();
  // Racket handle
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(0, -8 * s);
  ctx.lineTo(0, -13 * s);
  ctx.stroke();
  // Racket head - oval with strings
  ctx.strokeStyle = darker(col, 10);
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.ellipse(0, -17 * s, 4 * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Strings
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 0.4 * s;
  for (let si = -3; si <= 3; si++) {
    ctx.beginPath();
    ctx.moveTo(si * 1.1 * s, -13 * s);
    ctx.lineTo(si * 1.1 * s, -21 * s);
    ctx.stroke();
  }
  for (let si = -4; si <= 4; si++) {
    ctx.beginPath();
    ctx.moveTo(-3.5 * s, -14 * s - si * 1 * s);
    ctx.lineTo(3.5 * s, -14 * s - si * 1 * s);
    ctx.stroke();
  }
  ctx.restore();

  // Shuttlecock - bouncing near player
  const shuttleY = -18 * s + Math.abs(Math.sin(t * 5 + ph)) * 6 * s;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-5 * s, shuttleY, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // Feathers
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 0.8 * s;
  for (let fi = 0; fi < 4; fi++) {
    const fa = -Math.PI / 2 + (fi - 1.5) * 0.35;
    ctx.beginPath();
    ctx.moveTo(-5 * s, shuttleY);
    ctx.lineTo(-5 * s + Math.cos(fa) * 3 * s, shuttleY + Math.sin(fa) * 3 * s - 2 * s);
    ctx.stroke();
  }

  ctx.restore();
}

// ─────────────────────────────────────────────
// 5. drawTackleWall (spo_05) "タックルウォール"
//    American football lineman. Massive shoulders, helmet, wide.
// ─────────────────────────────────────────────
export function drawTackleWall(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  const breathe = Math.sin(t * 2 + ph) * 1.5 * s;
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow - wide
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 16 * s, 14 * s, 4 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs - thick, short, wide stance
  const legStomp = Math.sin(t * 3.5 + ph) * 2 * s;
  ctx.fillStyle = "#fff";
  // Left leg
  ctx.beginPath();
  ctx.roundRect(-10 * s, 5 * s, 6 * s, 10 * s + legStomp, 1 * s);
  ctx.fill();
  // Right leg
  ctx.beginPath();
  ctx.roundRect(4 * s, 5 * s, 6 * s, 10 * s - legStomp, 1 * s);
  ctx.fill();
  // Football cleats - chunky
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.roundRect(-12 * s, 14 * s + legStomp, 9 * s, 3 * s, 1.5 * s);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(3 * s, 14 * s - legStomp, 9 * s, 3 * s, 1.5 * s);
  ctx.fill();

  // Body - MASSIVE torso with shoulder pads
  // Shoulder pads extend wide
  const padGrad = ctx.createLinearGradient(-14 * s, -10 * s, 14 * s, 6 * s);
  padGrad.addColorStop(0, lighter(col, 20));
  padGrad.addColorStop(0.5, col);
  padGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = padGrad;
  // Shoulder pad silhouette - very wide at top
  ctx.beginPath();
  ctx.moveTo(-14 * s, -6 * s + breathe);
  ctx.quadraticCurveTo(-15 * s, -10 * s + breathe, -10 * s, -12 * s + breathe);
  ctx.lineTo(10 * s, -12 * s + breathe);
  ctx.quadraticCurveTo(15 * s, -10 * s + breathe, 14 * s, -6 * s + breathe);
  ctx.lineTo(10 * s, 6 * s);
  ctx.lineTo(-10 * s, 6 * s);
  ctx.closePath();
  ctx.fill();
  // Pad edge lines
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(-14 * s, -6 * s + breathe);
  ctx.quadraticCurveTo(-15 * s, -10 * s + breathe, -10 * s, -12 * s + breathe);
  ctx.lineTo(10 * s, -12 * s + breathe);
  ctx.quadraticCurveTo(15 * s, -10 * s + breathe, 14 * s, -6 * s + breathe);
  ctx.stroke();

  // Jersey number area
  ctx.fillStyle = lighter(col, 50);
  ctx.beginPath();
  ctx.roundRect(-5 * s, -4 * s + breathe, 10 * s, 7 * s, 1 * s);
  ctx.fill();
  // Fake number
  ctx.fillStyle = col;
  ctx.fillRect(-3 * s, -2 * s + breathe, 2.5 * s, 5 * s);
  ctx.fillRect(-0.5 * s, -2 * s + breathe, 2.5 * s, 1.5 * s);
  ctx.fillRect(-0.5 * s, -0.5 * s + breathe, 2.5 * s, 1.5 * s);
  ctx.fillRect(2.5 * s, -2 * s + breathe, 2.5 * s, 5 * s);

  // Arms - thick, ready to block
  const armGuard = Math.sin(t * 3 + ph) * 3 * s;
  ctx.fillStyle = col;
  // Left arm
  ctx.beginPath();
  ctx.roundRect(-16 * s, -8 * s + breathe, 5 * s, 12 * s + armGuard, 2 * s);
  ctx.fill();
  // Right arm
  ctx.beginPath();
  ctx.roundRect(11 * s, -8 * s + breathe, 5 * s, 12 * s - armGuard, 2 * s);
  ctx.fill();
  // Gloves
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-13.5 * s, 5 * s + armGuard, 3 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(13.5 * s, 5 * s - armGuard, 3 * s, 0, Math.PI * 2);
  ctx.fill();

  // Helmet
  const helmGrad = ctx.createRadialGradient(0, -17 * s + breathe, 0, 0, -17 * s + breathe, 7 * s);
  helmGrad.addColorStop(0, lighter(col, 30));
  helmGrad.addColorStop(1, darker(col, 20));
  ctx.fillStyle = helmGrad;
  ctx.beginPath();
  ctx.arc(0, -17 * s + breathe, 7 * s, 0, Math.PI * 2);
  ctx.fill();
  // Helmet stripe
  ctx.strokeStyle = lighter(col, 60);
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.arc(0, -17 * s + breathe, 7 * s, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();

  // Face mask - grid bars
  ctx.strokeStyle = "#c0c0c0";
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(-4 * s, -19 * s + breathe);
  ctx.lineTo(-5 * s, -15 * s + breathe);
  ctx.moveTo(4 * s, -19 * s + breathe);
  ctx.lineTo(5 * s, -15 * s + breathe);
  ctx.moveTo(-5 * s, -17 * s + breathe);
  ctx.lineTo(5 * s, -17 * s + breathe);
  ctx.moveTo(-5 * s, -15 * s + breathe);
  ctx.lineTo(5 * s, -15 * s + breathe);
  ctx.stroke();

  // Eyes behind mask
  ctx.fillStyle = "#fff";
  ctx.fillRect(-3 * s, -18 * s + breathe, 2.5 * s, 2 * s);
  ctx.fillRect(1 * s, -18 * s + breathe, 2.5 * s, 2 * s);
  ctx.fillStyle = "#111";
  ctx.fillRect(-1.5 * s, -17.5 * s + breathe, 1.5 * s, 1.5 * s);
  ctx.fillRect(2 * s, -17.5 * s + breathe, 1.5 * s, 1.5 * s);

  ctx.restore();
}

// ─────────────────────────────────────────────
// 6. drawServecannon (spo_06) "サーブキャノン"
//    Volleyball server. Ball integrated, powerful serve motion.
// ─────────────────────────────────────────────
export function drawServecannon(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  const servePhase = Math.sin(t * 3.5 + ph);
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 9 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs - tall volleyball player, jumping for serve
  const jumpH = Math.max(0, servePhase) * 3 * s;
  const legSpread = Math.sin(t * 5 + ph) * 2 * s;
  ctx.strokeStyle = "#f0d0a0";
  ctx.lineWidth = 3 * s;
  ctx.lineCap = "round";
  // Left leg
  ctx.beginPath();
  ctx.moveTo(-3 * s, 5 * s - jumpH);
  ctx.lineTo(-5 * s, 9 * s - jumpH * 0.5);
  ctx.lineTo(-4 * s - legSpread, 14 * s);
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(3 * s, 5 * s - jumpH);
  ctx.lineTo(5 * s, 9 * s - jumpH * 0.5);
  ctx.lineTo(4 * s + legSpread, 14 * s);
  ctx.stroke();
  // Shoes
  ctx.fillStyle = "#fff";
  ctx.fillRect(-7 * s - legSpread, 13 * s, 5 * s, 2.5 * s);
  ctx.fillRect(2 * s + legSpread, 13 * s, 5 * s, 2.5 * s);

  // Body - tall athletic jersey
  const torsoGrad = ctx.createLinearGradient(-6 * s, -8 * s - jumpH, 6 * s, 5 * s - jumpH);
  torsoGrad.addColorStop(0, lighter(col, 15));
  torsoGrad.addColorStop(1, col);
  ctx.fillStyle = torsoGrad;
  ctx.beginPath();
  ctx.roundRect(-6 * s, -8 * s - jumpH, 12 * s, 14 * s, 2 * s);
  ctx.fill();

  // Net pattern on jersey lower half
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 0.5 * s;
  for (let nx = -5; nx <= 5; nx += 2.5) {
    ctx.beginPath();
    ctx.moveTo(nx * s, 0 - jumpH);
    ctx.lineTo(nx * s, 5 * s - jumpH);
    ctx.stroke();
  }
  for (let ny = 0; ny <= 5; ny += 2.5) {
    ctx.beginPath();
    ctx.moveTo(-5 * s, ny * s - jumpH);
    ctx.lineTo(5 * s, ny * s - jumpH);
    ctx.stroke();
  }

  // Jersey side stripes
  ctx.fillStyle = lighter(col, 40);
  ctx.fillRect(-6 * s, -7 * s - jumpH, 1.5 * s, 12 * s);
  ctx.fillRect(4.5 * s, -7 * s - jumpH, 1.5 * s, 12 * s);

  // Head
  ctx.fillStyle = "#f0d0a0";
  ctx.beginPath();
  ctx.arc(0, -12 * s - jumpH, 5 * s, 0, Math.PI * 2);
  ctx.fill();
  // Short sporty hair
  ctx.fillStyle = darker(col, 50);
  ctx.beginPath();
  ctx.arc(0, -13 * s - jumpH, 5.2 * s, Math.PI + 0.2, -0.2);
  ctx.fill();

  // Eyes - looking up at ball
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-2 * s, -12.5 * s - jumpH, 1.8 * s, 0, Math.PI * 2);
  ctx.arc(2 * s, -12.5 * s - jumpH, 1.8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(-2 * s, -13 * s - jumpH, 0.9 * s, 0, Math.PI * 2);
  ctx.arc(2 * s, -13 * s - jumpH, 0.9 * s, 0, Math.PI * 2);
  ctx.fill();

  // Left arm - toss arm up
  ctx.strokeStyle = "#f0d0a0";
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -5 * s - jumpH);
  ctx.lineTo(-8 * s, -10 * s - jumpH);
  ctx.lineTo(-6 * s, -16 * s - jumpH);
  ctx.stroke();

  // Right arm - serve arm swinging over
  const serveAngle = -1.5 + servePhase * 1.0;
  ctx.save();
  ctx.translate(6 * s, -6 * s - jumpH);
  ctx.rotate(serveAngle);
  ctx.strokeStyle = "#f0d0a0";
  ctx.lineWidth = 3.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -10 * s);
  ctx.stroke();
  // Serving hand - open palm
  ctx.fillStyle = "#f0d0a0";
  ctx.beginPath();
  ctx.roundRect(-2 * s, -13 * s, 4 * s, 3.5 * s, 1 * s);
  ctx.fill();
  ctx.restore();

  // Volleyball - tossed up, rotating
  const ballY = -22 * s - jumpH + Math.sin(t * 3 + ph) * 3 * s;
  const ballRot = t * 3;
  ctx.save();
  ctx.translate(-2 * s, ballY);
  ctx.rotate(ballRot);
  // Ball base
  ctx.fillStyle = "#f8f0d0";
  ctx.beginPath();
  ctx.arc(0, 0, 4 * s, 0, Math.PI * 2);
  ctx.fill();
  // Volleyball seam lines
  ctx.strokeStyle = "#c8b880";
  ctx.lineWidth = 0.7 * s;
  ctx.beginPath();
  ctx.arc(0, 0, 3.5 * s, 0, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 3.5 * s, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -3.5 * s);
  ctx.quadraticCurveTo(3 * s, 0, 0, 3.5 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -3.5 * s);
  ctx.quadraticCurveTo(-3 * s, 0, 0, 3.5 * s);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

// ─────────────────────────────────────────────
// 7. drawCaptainArmor (spo_07) "キャプテンアーマー"
//    Team captain with armband, trophy weapon, medal chest plate.
// ─────────────────────────────────────────────
export function drawCaptainArmor(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  const bob = Math.sin(t * 3 + ph) * 1.5 * s;
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs - captain's stride
  const legWalk = Math.sin(t * 5 + ph) * 4 * s;
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 4 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-3 * s, 6 * s + bob);
  ctx.lineTo(-4 * s + legWalk * 0.4, 13 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(3 * s, 6 * s + bob);
  ctx.lineTo(4 * s - legWalk * 0.4, 13 * s);
  ctx.stroke();
  // Boots with studs
  ctx.fillStyle = "#111";
  ctx.fillRect(-7 * s + legWalk * 0.4, 12 * s, 6 * s, 3 * s);
  ctx.fillRect(2 * s - legWalk * 0.4, 12 * s, 6 * s, 3 * s);

  // Body - armored jersey with medal chest plate
  const bodyGrad = ctx.createLinearGradient(-7 * s, -8 * s, 7 * s, 6 * s);
  bodyGrad.addColorStop(0, lighter(col, 15));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 25));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-7 * s, -8 * s + bob, 14 * s, 15 * s, 3 * s);
  ctx.fill();

  // Medal chest plate - gold circular plate
  const medalGrad = ctx.createRadialGradient(0, -2 * s + bob, 0, 0, -2 * s + bob, 5 * s);
  medalGrad.addColorStop(0, "#ffd700");
  medalGrad.addColorStop(0.7, "#d4a017");
  medalGrad.addColorStop(1, "#b8860b");
  ctx.fillStyle = medalGrad;
  ctx.beginPath();
  ctx.arc(0, -2 * s + bob, 5 * s, 0, Math.PI * 2);
  ctx.fill();
  // Medal star emblem
  ctx.fillStyle = "#fff8d0";
  for (let i = 0; i < 5; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    const px = Math.cos(ang) * 3 * s;
    const py = -2 * s + bob + Math.sin(ang) * 3 * s;
    ctx.beginPath();
    ctx.arc(px, py, 1 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, -2 * s + bob, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // Shoulder epaulettes
  ctx.fillStyle = "#d4a017";
  ctx.beginPath();
  ctx.roundRect(-9 * s, -9 * s + bob, 5 * s, 3 * s, 1.5 * s);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(4 * s, -9 * s + bob, 5 * s, 3 * s, 1.5 * s);
  ctx.fill();
  // Fringe
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 0.8 * s;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-8 * s + i * 1.2 * s, -6 * s + bob);
    ctx.lineTo(-8 * s + i * 1.2 * s, -4.5 * s + bob);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5 * s + i * 1.2 * s, -6 * s + bob);
    ctx.lineTo(5 * s + i * 1.2 * s, -4.5 * s + bob);
    ctx.stroke();
  }

  // Captain armband on left arm
  ctx.strokeStyle = col;
  ctx.lineWidth = 3.5 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-7 * s, -4 * s + bob);
  ctx.lineTo(-12 * s, 0 + bob);
  ctx.stroke();
  // Armband
  ctx.fillStyle = "#dc2626";
  ctx.fillRect(-13 * s, -5 * s + bob, 4 * s, 2.5 * s);
  // "C" letter marker on armband
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.arc(-11 * s, -3.8 * s + bob, 1 * s, 0.5, Math.PI * 2 - 0.5);
  ctx.stroke();

  // Right arm - holding trophy high
  const trophyWave = Math.sin(t * 2.5 + ph) * 0.15;
  ctx.save();
  ctx.translate(7 * s, -5 * s + bob);
  ctx.rotate(-0.8 + trophyWave);
  ctx.strokeStyle = "#f0d0a0";
  ctx.lineWidth = 3.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(2 * s, -10 * s);
  ctx.stroke();

  // Trophy
  // Cup
  const trophyGrad = ctx.createLinearGradient(-3 * s, -18 * s, 3 * s, -12 * s);
  trophyGrad.addColorStop(0, "#ffd700");
  trophyGrad.addColorStop(0.5, "#ffec80");
  trophyGrad.addColorStop(1, "#d4a017");
  ctx.fillStyle = trophyGrad;
  ctx.beginPath();
  ctx.moveTo(-3 * s, -18 * s);
  ctx.quadraticCurveTo(-3.5 * s, -14 * s, -1.5 * s, -12 * s);
  ctx.lineTo(1.5 * s, -12 * s);
  ctx.quadraticCurveTo(3.5 * s, -14 * s, 3 * s, -18 * s);
  ctx.closePath();
  ctx.fill();
  // Trophy stem
  ctx.fillStyle = "#d4a017";
  ctx.fillRect(-1 * s, -12 * s, 2 * s, 2 * s);
  // Trophy base
  ctx.fillRect(-2.5 * s, -10 * s, 5 * s, 1.5 * s);
  // Trophy handles
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.arc(-3.5 * s, -16 * s, 1.5 * s, -0.5, Math.PI + 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(3.5 * s, -16 * s, 1.5 * s, -Math.PI + 0.5, 0.5);
  ctx.stroke();
  // Sparkle on trophy
  const sparkle = Math.sin(t * 6) * 0.5 + 0.5;
  ctx.fillStyle = `rgba(255,255,200,${sparkle})`;
  ctx.beginPath();
  ctx.arc(1 * s, -16 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Head
  ctx.fillStyle = "#f0d0a0";
  ctx.beginPath();
  ctx.arc(0, -12 * s + bob, 5 * s, 0, Math.PI * 2);
  ctx.fill();
  // Hair - short, commanding
  ctx.fillStyle = "#333";
  ctx.beginPath();
  ctx.arc(0, -13.5 * s + bob, 5.3 * s, Math.PI + 0.3, -0.3);
  ctx.fill();

  // Eyes - confident
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-2 * s, -12 * s + bob, 1.8 * s, 0, Math.PI * 2);
  ctx.arc(2 * s, -12 * s + bob, 1.8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(-1.3 * s, -12 * s + bob, 1 * s, 0, Math.PI * 2);
  ctx.arc(2.7 * s, -12 * s + bob, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  // Confident smirk
  ctx.strokeStyle = "#833";
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(-1.5 * s, -9 * s + bob);
  ctx.quadraticCurveTo(1 * s, -8 * s + bob, 3 * s, -9 * s + bob);
  ctx.stroke();

  ctx.restore();
}

// ─────────────────────────────────────────────
// 8. drawPowerHurdle (spo_08) "パワーハードル"
//    Hurdler mid-jump. Hurdle in design, powerful legs, track spikes.
// ─────────────────────────────────────────────
export function drawPowerHurdle(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  const jumpCycle = Math.sin(t * 3 + ph);
  const airborne = Math.max(0, jumpCycle) * 5 * s;
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow - shrinks when airborne
  const shadowScale = 1 - airborne / (8 * s);
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, (9 * s) * shadowScale, (3 * s) * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hurdle below/behind the character
  const hurdleY = 10 * s;
  ctx.strokeStyle = "#e05030";
  ctx.lineWidth = 2 * s;
  // Hurdle posts
  ctx.beginPath();
  ctx.moveTo(-8 * s, hurdleY + 5 * s);
  ctx.lineTo(-8 * s, hurdleY - 2 * s);
  ctx.moveTo(8 * s, hurdleY + 5 * s);
  ctx.lineTo(8 * s, hurdleY - 2 * s);
  ctx.stroke();
  // Hurdle bar
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.moveTo(-9 * s, hurdleY - 2 * s);
  ctx.lineTo(9 * s, hurdleY - 2 * s);
  ctx.stroke();
  // Hurdle stripes
  ctx.fillStyle = "#e05030";
  for (let i = -4; i <= 3; i++) {
    if (i % 2 === 0) {
      ctx.fillRect(i * 2 * s, hurdleY - 3.2 * s, 2 * s, 2.5 * s);
    }
  }

  // Legs - hurdle form: front extended, back tucked
  const legExtend = 6 * s + jumpCycle * 4 * s;
  ctx.strokeStyle = "#d4a574";
  ctx.lineWidth = 3.5 * s;
  ctx.lineCap = "round";
  // Front leg - extended forward
  ctx.beginPath();
  ctx.moveTo(2 * s, 4 * s - airborne);
  ctx.lineTo(7 * s, 2 * s - airborne);
  ctx.lineTo(10 * s + legExtend * 0.3, 5 * s - airborne);
  ctx.stroke();
  // Back leg - tucked up
  ctx.beginPath();
  ctx.moveTo(-2 * s, 4 * s - airborne);
  ctx.lineTo(-6 * s, 1 * s - airborne);
  ctx.lineTo(-4 * s - legExtend * 0.2, 5 * s - airborne);
  ctx.stroke();

  // Track spikes
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.roundRect(8 * s + legExtend * 0.3, 4 * s - airborne, 5 * s, 2.5 * s, 1 * s);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(-7 * s - legExtend * 0.2, 4 * s - airborne, 5 * s, 2.5 * s, 1 * s);
  ctx.fill();
  // Spike pins
  ctx.fillStyle = "#c0c0c0";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(9 * s + legExtend * 0.3 + i * 1.5 * s, 6 * s - airborne, 0.8 * s, 1.5 * s);
  }

  // Body - muscular sprinter torso
  const torsoGrad = ctx.createLinearGradient(-5 * s, -8 * s, 5 * s, 4 * s);
  torsoGrad.addColorStop(0, col);
  torsoGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = torsoGrad;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -7 * s - airborne);
  ctx.lineTo(5 * s, -7 * s - airborne);
  ctx.quadraticCurveTo(6 * s, -1 * s - airborne, 4 * s, 5 * s - airborne);
  ctx.lineTo(-4 * s, 5 * s - airborne);
  ctx.quadraticCurveTo(-6 * s, -1 * s - airborne, -5 * s, -7 * s - airborne);
  ctx.fill();

  // Racing singlet details
  ctx.fillStyle = lighter(col, 50);
  ctx.fillRect(-4 * s, -5 * s - airborne, 8 * s, 1 * s);
  // Bib number
  ctx.fillStyle = "#fff";
  ctx.fillRect(-3 * s, -1 * s - airborne, 6 * s, 4 * s);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 0.5 * s;
  ctx.strokeRect(-3 * s, -1 * s - airborne, 6 * s, 4 * s);

  // Arms - pumping action
  const armPump = jumpCycle * 5 * s;
  ctx.strokeStyle = "#d4a574";
  ctx.lineWidth = 3 * s;
  // Front arm
  ctx.beginPath();
  ctx.moveTo(5 * s, -4 * s - airborne);
  ctx.lineTo(9 * s, -2 * s - airborne + armPump);
  ctx.stroke();
  // Back arm
  ctx.beginPath();
  ctx.moveTo(-5 * s, -4 * s - airborne);
  ctx.lineTo(-9 * s, -1 * s - airborne - armPump);
  ctx.stroke();

  // Head
  ctx.fillStyle = "#d4a574";
  ctx.beginPath();
  ctx.arc(0, -11 * s - airborne, 4.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // Aerodynamic sunglasses
  ctx.fillStyle = "rgba(50,50,80,0.8)";
  ctx.beginPath();
  ctx.roundRect(-4.5 * s, -12.5 * s - airborne, 9 * s, 2.5 * s, 1.2 * s);
  ctx.fill();
  // Lens reflection
  ctx.fillStyle = "rgba(150,200,255,0.3)";
  ctx.beginPath();
  ctx.roundRect(-3.5 * s, -12.3 * s - airborne, 3 * s, 1 * s, 0.5 * s);
  ctx.fill();
  // Mouth - gritting
  ctx.strokeStyle = "#722";
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(-2 * s, -8.5 * s - airborne);
  ctx.lineTo(2 * s, -8.5 * s - airborne);
  ctx.stroke();

  ctx.restore();
}

// ─────────────────────────────────────────────
// 9. drawChampionBow (spo_09) "チャンピオンボウ"
//    Archery champion. Target rings on shield, Olympic bow, quiver.
// ─────────────────────────────────────────────
export function drawChampionBow(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  const aimSway = Math.sin(t * 2 + ph) * 1 * s;
  const drawPull = Math.sin(t * 1.5 + ph) * 0.5 + 0.5;
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 15 * s, 9 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs - stable archer stance
  const legShift = Math.sin(t * 4 + ph) * 1.5 * s;
  ctx.strokeStyle = darker(col, 20);
  ctx.lineWidth = 3.5 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-4 * s, 6 * s);
  ctx.lineTo(-6 * s, 13 * s + legShift);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4 * s, 6 * s);
  ctx.lineTo(6 * s, 13 * s - legShift);
  ctx.stroke();
  // Boots
  ctx.fillStyle = "#5a3820";
  ctx.fillRect(-9 * s, 12 * s + legShift, 5 * s, 3 * s);
  ctx.fillRect(4 * s, 12 * s - legShift, 5 * s, 3 * s);

  // Quiver on back (right side)
  ctx.fillStyle = "#8b5e3c";
  ctx.beginPath();
  ctx.roundRect(5 * s, -12 * s, 4 * s, 14 * s, 1 * s);
  ctx.fill();
  ctx.strokeStyle = "#6b3e1c";
  ctx.lineWidth = 0.8 * s;
  ctx.strokeRect(5 * s, -12 * s, 4 * s, 14 * s);
  // Arrow feathers poking out
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = ["#e04040", "#40c040", "#4080e0"][i];
    const ax = 6 * s + i * 1.2 * s;
    ctx.beginPath();
    ctx.moveTo(ax, -12 * s);
    ctx.lineTo(ax - 0.8 * s, -14 * s - i * s);
    ctx.lineTo(ax + 0.8 * s, -14 * s - i * s);
    ctx.closePath();
    ctx.fill();
    // Arrow shaft
    ctx.strokeStyle = "#c8b070";
    ctx.lineWidth = 0.5 * s;
    ctx.beginPath();
    ctx.moveTo(ax, -12 * s);
    ctx.lineTo(ax, -14 * s - i * s);
    ctx.stroke();
  }

  // Body - fitted archery jacket
  const bodyGrad = ctx.createLinearGradient(-6 * s, -8 * s, 6 * s, 6 * s);
  bodyGrad.addColorStop(0, lighter(col, 10));
  bodyGrad.addColorStop(1, darker(col, 25));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-6 * s, -8 * s, 12 * s, 15 * s, 2 * s);
  ctx.fill();

  // Target rings on chest (shield-like emblem)
  const rings = [
    { r: 4.5, col: "#fff" },
    { r: 3.5, col: "#111" },
    { r: 2.5, col: "#2090d0" },
    { r: 1.5, col: "#d04040" },
    { r: 0.7, col: "#ffd700" },
  ];
  for (const ring of rings) {
    ctx.fillStyle = ring.col;
    ctx.beginPath();
    ctx.arc(0, -1 * s, ring.r * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // Left arm - holding bow out
  ctx.strokeStyle = "#f0d0a0";
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -4 * s);
  ctx.lineTo(-14 * s, -4 * s + aimSway);
  ctx.stroke();

  // Bow - curved
  ctx.strokeStyle = "#5a3820";
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.arc(-16 * s, -4 * s + aimSway, 10 * s, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();
  // Bowstring
  ctx.strokeStyle = "#e0d8c0";
  ctx.lineWidth = 0.8 * s;
  const stringPull = drawPull * 3 * s;
  ctx.beginPath();
  ctx.moveTo(-16 * s + Math.cos(-Math.PI * 0.4) * 10 * s, -4 * s + aimSway + Math.sin(-Math.PI * 0.4) * 10 * s);
  ctx.lineTo(-14 * s + stringPull, -4 * s + aimSway);
  ctx.lineTo(-16 * s + Math.cos(Math.PI * 0.4) * 10 * s, -4 * s + aimSway + Math.sin(Math.PI * 0.4) * 10 * s);
  ctx.stroke();

  // Right arm - pulling string back
  ctx.strokeStyle = "#f0d0a0";
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(4 * s, -5 * s);
  ctx.lineTo(-4 * s, -4 * s + aimSway);
  ctx.lineTo(-14 * s + stringPull, -4 * s + aimSway);
  ctx.stroke();

  // Arrow nocked on string
  ctx.strokeStyle = "#c8b070";
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(-14 * s + stringPull, -4 * s + aimSway);
  ctx.lineTo(-25 * s, -4 * s + aimSway);
  ctx.stroke();
  // Arrowhead
  ctx.fillStyle = "#c0c0c0";
  ctx.beginPath();
  ctx.moveTo(-25 * s, -4 * s + aimSway);
  ctx.lineTo(-23 * s, -5.5 * s + aimSway);
  ctx.lineTo(-23 * s, -2.5 * s + aimSway);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.fillStyle = "#f0d0a0";
  ctx.beginPath();
  ctx.arc(0, -12 * s, 5 * s, 0, Math.PI * 2);
  ctx.fill();
  // Archery headband/visor
  ctx.fillStyle = col;
  ctx.fillRect(-5.3 * s, -14 * s, 10.6 * s, 2.5 * s);

  // Eyes - one squinted (aiming)
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-2 * s, -12 * s, 1.8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(-2 * s, -12 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  // Squinted right eye (aiming)
  ctx.strokeStyle = "#f0d0a0";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(1 * s, -12 * s);
  ctx.lineTo(4 * s, -12 * s);
  ctx.stroke();

  // Focused mouth
  ctx.strokeStyle = "#833";
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(-1.5 * s, -9 * s);
  ctx.lineTo(1.5 * s, -9 * s);
  ctx.stroke();

  ctx.restore();
}

// ─────────────────────────────────────────────
// 10. drawOlympia (spo_10) "オリンピア"
//     Olympic torch bearer. Laurel wreath, Olympic rings, flame, classical.
// ─────────────────────────────────────────────
export function drawOlympia(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  const bob = Math.sin(t * 3 + ph) * 1.5 * s;
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 16 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs - classical athlete, running with torch
  const legStride = Math.sin(t * 5 + ph) * 5 * s;
  ctx.strokeStyle = "#d4a574";
  ctx.lineWidth = 3.5 * s;
  ctx.lineCap = "round";
  // Left leg
  ctx.beginPath();
  ctx.moveTo(-3 * s, 6 * s + bob);
  ctx.lineTo(-4 * s + legStride * 0.4, 14 * s);
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(3 * s, 6 * s + bob);
  ctx.lineTo(4 * s - legStride * 0.4, 14 * s);
  ctx.stroke();
  // Classical sandals
  ctx.fillStyle = "#c8a060";
  ctx.fillRect(-7 * s + legStride * 0.4, 13 * s, 5 * s, 2 * s);
  ctx.fillRect(2 * s - legStride * 0.4, 13 * s, 5 * s, 2 * s);
  // Sandal straps
  ctx.strokeStyle = "#a07840";
  ctx.lineWidth = 0.6 * s;
  ctx.beginPath();
  ctx.moveTo(-6 * s + legStride * 0.4, 13 * s);
  ctx.lineTo(-5 * s + legStride * 0.4, 10 * s);
  ctx.moveTo(5 * s - legStride * 0.4, 13 * s);
  ctx.lineTo(4 * s - legStride * 0.4, 10 * s);
  ctx.stroke();

  // Body - classical white/gold tunic (chiton)
  const tunicGrad = ctx.createLinearGradient(-7 * s, -7 * s, 7 * s, 7 * s);
  tunicGrad.addColorStop(0, "#f8f4e8");
  tunicGrad.addColorStop(1, "#e8e0d0");
  ctx.fillStyle = tunicGrad;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -7 * s + bob);
  ctx.lineTo(6 * s, -7 * s + bob);
  ctx.lineTo(7 * s, 7 * s + bob);
  ctx.lineTo(-7 * s, 7 * s + bob);
  ctx.closePath();
  ctx.fill();
  // Tunic drape folds
  ctx.strokeStyle = "#d0c8b0";
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(-3 * s, -5 * s + bob);
  ctx.quadraticCurveTo(-4 * s, 0 + bob, -2 * s, 6 * s + bob);
  ctx.moveTo(2 * s, -5 * s + bob);
  ctx.quadraticCurveTo(3 * s, 1 * s + bob, 1 * s, 6 * s + bob);
  ctx.stroke();

  // Gold belt/sash with col accent
  ctx.fillStyle = col;
  ctx.fillRect(-7 * s, -1 * s + bob, 14 * s, 2.5 * s);
  ctx.fillStyle = "#d4a017";
  ctx.fillRect(-7 * s, -1 * s + bob, 14 * s, 0.8 * s);
  ctx.fillRect(-7 * s, 0.8 * s + bob, 14 * s, 0.8 * s);

  // Olympic rings on chest (small, 5 rings)
  const ringColors = ["#0081c8", "#fbb132", "#000", "#00a651", "#ee334e"];
  const ringSize = 1.5 * s;
  for (let i = 0; i < 5; i++) {
    const rx = (i - 2) * 2.5 * s;
    const ry = -4 * s + bob + (i % 2 === 1 ? 1.2 * s : 0);
    ctx.strokeStyle = ringColors[i];
    ctx.lineWidth = 0.8 * s;
    ctx.beginPath();
    ctx.arc(rx, ry, ringSize, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Left arm
  const armSwing = Math.sin(t * 5 + ph) * 4 * s;
  ctx.strokeStyle = "#d4a574";
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -4 * s + bob);
  ctx.lineTo(-10 * s, 0 + bob + armSwing);
  ctx.stroke();

  // Right arm - holding torch high
  ctx.strokeStyle = "#d4a574";
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(6 * s, -5 * s + bob);
  ctx.lineTo(9 * s, -10 * s + bob);
  ctx.lineTo(8 * s, -16 * s + bob);
  ctx.stroke();

  // Torch
  ctx.fillStyle = "#8b6040";
  ctx.beginPath();
  ctx.roundRect(6.5 * s, -20 * s + bob, 3 * s, 6 * s, 1 * s);
  ctx.fill();
  // Torch cup
  ctx.fillStyle = "#d4a017";
  ctx.beginPath();
  ctx.moveTo(5 * s, -20 * s + bob);
  ctx.lineTo(11 * s, -20 * s + bob);
  ctx.lineTo(10 * s, -22 * s + bob);
  ctx.lineTo(6 * s, -22 * s + bob);
  ctx.closePath();
  ctx.fill();

  // Olympic flame - animated
  const flameH = 6 * s + Math.sin(t * 8 + ph) * 2 * s;
  const flicker1 = Math.sin(t * 12 + ph) * 1.5 * s;
  const flicker2 = Math.sin(t * 15 + ph * 2) * 1 * s;
  // Outer flame
  const flameGrad = ctx.createRadialGradient(8 * s, -24 * s + bob, 0, 8 * s, -22 * s + bob, flameH);
  flameGrad.addColorStop(0, "#fff8e0");
  flameGrad.addColorStop(0.3, "#ff8c00");
  flameGrad.addColorStop(0.7, "#ff4500");
  flameGrad.addColorStop(1, "rgba(255,0,0,0)");
  ctx.fillStyle = flameGrad;
  ctx.beginPath();
  ctx.moveTo(6 * s, -22 * s + bob);
  ctx.quadraticCurveTo(5 * s + flicker1, -25 * s + bob, 8 * s + flicker2, -22 * s - flameH + bob);
  ctx.quadraticCurveTo(11 * s + flicker1 * 0.5, -25 * s + bob, 10 * s, -22 * s + bob);
  ctx.closePath();
  ctx.fill();
  // Inner bright flame
  ctx.fillStyle = "rgba(255,255,200,0.7)";
  ctx.beginPath();
  ctx.moveTo(7 * s, -22 * s + bob);
  ctx.quadraticCurveTo(7 * s + flicker2 * 0.5, -24 * s + bob, 8 * s, -22 * s - flameH * 0.5 + bob);
  ctx.quadraticCurveTo(9 * s - flicker1 * 0.3, -24 * s + bob, 9 * s, -22 * s + bob);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.fillStyle = "#d4a574";
  ctx.beginPath();
  ctx.arc(0, -12 * s + bob, 5 * s, 0, Math.PI * 2);
  ctx.fill();

  // Laurel wreath crown
  ctx.strokeStyle = "#2e8b2e";
  ctx.lineWidth = 1.5 * s;
  ctx.fillStyle = "#3aaf3a";
  // Left side laurel leaves
  for (let i = 0; i < 5; i++) {
    const la = Math.PI + 0.3 + i * 0.28;
    const lx = Math.cos(la) * 5.5 * s;
    const ly = -12.5 * s + bob + Math.sin(la) * 5.5 * s;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(la + Math.PI / 2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 1 * s, 2 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Right side laurel leaves
  for (let i = 0; i < 5; i++) {
    const la = -0.3 - i * 0.28;
    const lx = Math.cos(la) * 5.5 * s;
    const ly = -12.5 * s + bob + Math.sin(la) * 5.5 * s;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(la - Math.PI / 2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 1 * s, 2 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Eyes - noble
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-2 * s, -12 * s + bob, 1.8 * s, 0, Math.PI * 2);
  ctx.arc(2 * s, -12 * s + bob, 1.8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a4a6a";
  ctx.beginPath();
  ctx.arc(-1.3 * s, -12 * s + bob, 1 * s, 0, Math.PI * 2);
  ctx.arc(2.7 * s, -12 * s + bob, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  // Noble expression
  ctx.strokeStyle = "#833";
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(-1.5 * s, -9 * s + bob);
  ctx.quadraticCurveTo(0, -8.5 * s + bob, 1.5 * s, -9.2 * s + bob);
  ctx.stroke();

  // Glow around character (divine aura)
  ctx.strokeStyle = `rgba(255,215,0,${0.15 + Math.sin(t * 4) * 0.08})`;
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.ellipse(0, 0 + bob, 12 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}
