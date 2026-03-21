// history.ts - History-themed tower defense character renderers
// Canvas2D vector draw functions for 10 history characters (歴史シリーズ)

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
/*  1. drawBronzeGuard  -  "ブロンズガード"  (his_01)                    */
/*     Ancient Greek/Roman bronze soldier with aspis shield & crest    */
/* ------------------------------------------------------------------ */
export function drawBronzeGuard(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs with walking animation - sandals
  const legAnim = Math.sin(t * 4 + ph) * 3 * s;
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-5 * s, 8 * s + legAnim, 3.5 * s, 6 * s);
  ctx.fillRect(1.5 * s, 8 * s - legAnim, 3.5 * s, 6 * s);
  // sandal straps
  ctx.strokeStyle = darker(col, 80);
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(-5 * s, 10 * s + legAnim); ctx.lineTo(-1.5 * s, 10 * s + legAnim);
  ctx.moveTo(-5 * s, 12 * s + legAnim); ctx.lineTo(-1.5 * s, 12 * s + legAnim);
  ctx.moveTo(1.5 * s, 10 * s - legAnim); ctx.lineTo(5 * s, 10 * s - legAnim);
  ctx.moveTo(1.5 * s, 12 * s - legAnim); ctx.lineTo(5 * s, 12 * s - legAnim);
  ctx.stroke();

  // bronze body - muscled cuirass shape
  const bodyGrad = ctx.createLinearGradient(-7 * s, -6 * s, 7 * s, 8 * s);
  bodyGrad.addColorStop(0, lighter(col, 40));
  bodyGrad.addColorStop(0.4, col);
  bodyGrad.addColorStop(1, darker(col, 50));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-7 * s, -4 * s);
  ctx.quadraticCurveTo(-8 * s, 4 * s, -5 * s, 9 * s);
  ctx.lineTo(5 * s, 9 * s);
  ctx.quadraticCurveTo(8 * s, 4 * s, 7 * s, -4 * s);
  ctx.closePath();
  ctx.fill();
  // pectoral line
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 0.7 * s;
  ctx.beginPath();
  ctx.moveTo(0, -2 * s);
  ctx.lineTo(0, 5 * s);
  ctx.stroke();

  // round aspis shield (left side, slightly in front)
  ctx.save();
  const shieldBob = Math.sin(t * 2 + ph) * 0.5 * s;
  ctx.translate(-9 * s, 1 * s + shieldBob);
  const shieldGrad = ctx.createRadialGradient(1 * s, -1 * s, 1 * s, 0, 0, 8 * s);
  shieldGrad.addColorStop(0, lighter(col, 60));
  shieldGrad.addColorStop(0.5, col);
  shieldGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = shieldGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 1.2 * s;
  ctx.stroke();
  // shield boss (center)
  ctx.fillStyle = lighter(col, 70);
  ctx.beginPath();
  ctx.arc(0, 0, 2.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // shield ring decoration
  ctx.strokeStyle = darker(col, 20);
  ctx.lineWidth = 0.6 * s;
  ctx.beginPath();
  ctx.arc(0, 0, 5.5 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // spear arm (right side)
  ctx.save();
  const armSwing = Math.sin(t * 2.5 + ph) * 0.08;
  ctx.rotate(armSwing);
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(7 * s, -4 * s, 3.5 * s, 8 * s);
  // spear shaft
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(9 * s, -4 * s);
  ctx.lineTo(9 * s, -16 * s);
  ctx.stroke();
  // spear tip
  ctx.fillStyle = '#C0C0C0';
  ctx.beginPath();
  ctx.moveTo(9 * s, -16 * s);
  ctx.lineTo(7.5 * s, -13 * s);
  ctx.lineTo(10.5 * s, -13 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Corinthian helmet
  const helmGrad = ctx.createLinearGradient(-6 * s, -14 * s, 6 * s, -6 * s);
  helmGrad.addColorStop(0, lighter(col, 50));
  helmGrad.addColorStop(0.5, col);
  helmGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = helmGrad;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -5 * s);
  ctx.quadraticCurveTo(-7 * s, -10 * s, -5 * s, -14 * s);
  ctx.quadraticCurveTo(0, -16 * s, 5 * s, -14 * s);
  ctx.quadraticCurveTo(7 * s, -10 * s, 6 * s, -5 * s);
  // nose guard
  ctx.lineTo(2 * s, -5 * s);
  ctx.lineTo(1 * s, -7 * s);
  ctx.lineTo(-1 * s, -7 * s);
  ctx.lineTo(-2 * s, -5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // eye slits
  ctx.fillStyle = '#222';
  ctx.fillRect(-4 * s, -9 * s, 2.5 * s, 1.2 * s);
  ctx.fillRect(1.5 * s, -9 * s, 2.5 * s, 1.2 * s);

  // helmet crest (red plume)
  ctx.fillStyle = '#CC3333';
  ctx.beginPath();
  ctx.moveTo(0, -15 * s);
  const crestWave = Math.sin(t * 3 + ph) * 1.5 * s;
  ctx.quadraticCurveTo(-2 * s + crestWave, -19 * s, 0, -20 * s);
  ctx.quadraticCurveTo(2 * s + crestWave, -19 * s, 5 * s, -14 * s);
  ctx.quadraticCurveTo(2 * s, -16 * s, 0, -15 * s);
  ctx.fill();
  // crest highlight
  ctx.fillStyle = '#FF5555';
  ctx.beginPath();
  ctx.ellipse(1 * s, -18 * s, 1 * s, 2 * s, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  2. drawStoneSentinel  -  "ストーンセンチネル"  (his_02)              */
/*     Easter Island moai-like stone statue warrior                     */
/* ------------------------------------------------------------------ */
export function drawStoneSentinel(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 9 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // tiny stubby legs
  const legAnim = Math.sin(t * 2.5 + ph) * 2 * s;
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(-4 * s, 10 * s + legAnim, 3 * s, 4 * s);
  ctx.fillRect(1 * s, 10 * s - legAnim, 3 * s, 4 * s);

  // massive stone body (wider at bottom, narrow shoulders)
  const bodyGrad = ctx.createLinearGradient(-8 * s, -4 * s, 8 * s, 10 * s);
  bodyGrad.addColorStop(0, lighter(col, 20));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 35));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -3 * s);
  ctx.lineTo(-7 * s, 10 * s);
  ctx.lineTo(7 * s, 10 * s);
  ctx.lineTo(5 * s, -3 * s);
  ctx.closePath();
  ctx.fill();

  // small stubby arms
  const armSway = Math.sin(t * 1.5 + ph) * 0.1;
  ctx.save();
  ctx.rotate(armSway);
  ctx.fillStyle = darker(col, 25);
  ctx.fillRect(-9 * s, -1 * s, 3 * s, 5 * s);
  ctx.fillRect(6 * s, -1 * s, 3 * s, 5 * s);
  ctx.restore();

  // MASSIVE moai head
  const headGrad = ctx.createLinearGradient(-7 * s, -20 * s, 7 * s, -2 * s);
  headGrad.addColorStop(0, lighter(col, 30));
  headGrad.addColorStop(0.3, col);
  headGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -3 * s);
  ctx.lineTo(-7 * s, -10 * s);
  ctx.quadraticCurveTo(-7.5 * s, -18 * s, -4 * s, -20 * s);
  ctx.quadraticCurveTo(0, -22 * s, 4 * s, -20 * s);
  ctx.quadraticCurveTo(7.5 * s, -18 * s, 7 * s, -10 * s);
  ctx.lineTo(6 * s, -3 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // protruding brow ridge
  ctx.fillStyle = darker(col, 15);
  ctx.beginPath();
  ctx.moveTo(-6 * s, -12 * s);
  ctx.quadraticCurveTo(0, -13.5 * s, 6 * s, -12 * s);
  ctx.quadraticCurveTo(0, -11 * s, -6 * s, -12 * s);
  ctx.fill();

  // deep-set eyes (dark shadowed)
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(-3 * s, -11 * s, 1.8 * s, 1.2 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(3 * s, -11 * s, 1.8 * s, 1.2 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // dim eye glow
  const eyeGlow = 0.3 + Math.sin(t * 1.5) * 0.15;
  ctx.fillStyle = `rgba(180,200,160,${eyeGlow})`;
  ctx.beginPath();
  ctx.ellipse(-3 * s, -11 * s, 1 * s, 0.7 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(3 * s, -11 * s, 1 * s, 0.7 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // long nose
  ctx.fillStyle = darker(col, 10);
  ctx.beginPath();
  ctx.moveTo(-1 * s, -10 * s);
  ctx.lineTo(0, -5 * s);
  ctx.lineTo(1 * s, -10 * s);
  ctx.closePath();
  ctx.fill();

  // thin mouth
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(-3 * s, -4 * s);
  ctx.lineTo(3 * s, -4 * s);
  ctx.stroke();

  // cracks in stone
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = 0.5 * s;
  ctx.beginPath();
  ctx.moveTo(4 * s, -16 * s);
  ctx.lineTo(3 * s, -13 * s);
  ctx.lineTo(5 * s, -10 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-5 * s, -7 * s);
  ctx.lineTo(-3 * s, -5 * s);
  ctx.lineTo(-4 * s, -3 * s);
  ctx.stroke();

  // moss patches (green spots)
  ctx.fillStyle = 'rgba(80,140,60,0.4)';
  ctx.beginPath();
  ctx.ellipse(-5 * s, -15 * s, 1.5 * s, 1 * s, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(4 * s, -6 * s, 1.2 * s, 0.8 * s, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  3. drawLanceRider  -  "ランスライダー"  (his_03)                    */
/*     Medieval knight on horseback with lance                         */
/* ------------------------------------------------------------------ */
export function drawLanceRider(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 12 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // gallop bounce
  const gallop = Math.abs(Math.sin(t * 5 + ph)) * 2 * s;
  const gallopTilt = Math.sin(t * 5 + ph) * 0.05;
  ctx.save();
  ctx.translate(0, -gallop);
  ctx.rotate(gallopTilt);

  // horse legs (4 legs, alternating animation)
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 2 * s;
  ctx.lineCap = 'round';
  const legF = Math.sin(t * 6 + ph) * 4 * s;
  const legB = Math.sin(t * 6 + ph + Math.PI) * 4 * s;
  // back legs
  ctx.beginPath();
  ctx.moveTo(-6 * s, 6 * s); ctx.lineTo(-8 * s + legB, 13 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-4 * s, 6 * s); ctx.lineTo(-6 * s - legB, 13 * s);
  ctx.stroke();
  // front legs
  ctx.beginPath();
  ctx.moveTo(5 * s, 6 * s); ctx.lineTo(7 * s + legF, 13 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(7 * s, 6 * s); ctx.lineTo(9 * s - legF, 13 * s);
  ctx.stroke();

  // horse body (oval)
  const horseGrad = ctx.createLinearGradient(-8 * s, 0, 8 * s, 8 * s);
  horseGrad.addColorStop(0, lighter(col, 20));
  horseGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = horseGrad;
  ctx.beginPath();
  ctx.ellipse(0, 4 * s, 11 * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.7 * s;
  ctx.stroke();

  // horse head
  ctx.fillStyle = darker(col, 20);
  ctx.beginPath();
  ctx.moveTo(9 * s, 1 * s);
  ctx.quadraticCurveTo(14 * s, -2 * s, 13 * s, -6 * s);
  ctx.quadraticCurveTo(12 * s, -8 * s, 10 * s, -6 * s);
  ctx.quadraticCurveTo(9 * s, -3 * s, 9 * s, 1 * s);
  ctx.fill();
  // horse eye
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(11 * s, -5 * s, 0.7 * s, 0, Math.PI * 2);
  ctx.fill();
  // horse ear
  ctx.fillStyle = darker(col, 30);
  ctx.beginPath();
  ctx.moveTo(11 * s, -7 * s);
  ctx.lineTo(10 * s, -10 * s);
  ctx.lineTo(12 * s, -8 * s);
  ctx.closePath();
  ctx.fill();

  // horse tail
  const tailWave = Math.sin(t * 4 + ph) * 2 * s;
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(-11 * s, 2 * s);
  ctx.quadraticCurveTo(-14 * s + tailWave, 5 * s, -13 * s + tailWave, 9 * s);
  ctx.stroke();

  // rider body (knight sitting on horse)
  const armorGrad = ctx.createLinearGradient(-4 * s, -6 * s, 4 * s, 2 * s);
  armorGrad.addColorStop(0, '#C0C0C0');
  armorGrad.addColorStop(0.5, '#A0A0A0');
  armorGrad.addColorStop(1, '#808080');
  ctx.fillStyle = armorGrad;
  ctx.beginPath();
  ctx.moveTo(-3 * s, -1 * s);
  ctx.lineTo(-4 * s, -8 * s);
  ctx.quadraticCurveTo(0, -10 * s, 4 * s, -8 * s);
  ctx.lineTo(3 * s, -1 * s);
  ctx.closePath();
  ctx.fill();

  // rider helmet (bucket helm)
  ctx.fillStyle = '#B0B0B0';
  ctx.beginPath();
  ctx.arc(0, -11 * s, 4 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#707070';
  ctx.lineWidth = 0.7 * s;
  ctx.stroke();
  // visor slit
  ctx.fillStyle = '#333';
  ctx.fillRect(-3 * s, -12 * s, 6 * s, 1.2 * s);
  // cross on helmet
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 0.6 * s;
  ctx.beginPath();
  ctx.moveTo(0, -14 * s); ctx.lineTo(0, -8 * s);
  ctx.moveTo(-3 * s, -11 * s); ctx.lineTo(3 * s, -11 * s);
  ctx.stroke();

  // lance (forward, angled up)
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(3 * s, -5 * s);
  ctx.lineTo(16 * s, -16 * s);
  ctx.stroke();
  // lance tip
  ctx.fillStyle = '#D0D0D0';
  ctx.beginPath();
  ctx.moveTo(16 * s, -16 * s);
  ctx.lineTo(14.5 * s, -14 * s);
  ctx.lineTo(17 * s, -14.5 * s);
  ctx.closePath();
  ctx.fill();
  // pennant
  const pennantWave = Math.sin(t * 5 + ph) * 1.5 * s;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(13 * s, -14 * s);
  ctx.lineTo(10 * s + pennantWave, -13 * s);
  ctx.lineTo(12 * s, -12 * s);
  ctx.closePath();
  ctx.fill();

  ctx.restore(); // gallop transform
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  4. drawCrossbowman  -  "クロスボウマン"  (his_04)                   */
/*     Medieval crossbow soldier with hood and bolt                    */
/* ------------------------------------------------------------------ */
export function drawCrossbowman(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 8 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs with walking
  const legAnim = Math.sin(t * 4 + ph) * 3 * s;
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-5 * s, 8 * s + legAnim, 3.5 * s, 6 * s);
  ctx.fillRect(1.5 * s, 8 * s - legAnim, 3.5 * s, 6 * s);
  // boots
  ctx.fillStyle = darker(col, 80);
  ctx.fillRect(-6 * s, 13 * s + legAnim, 5 * s, 2 * s);
  ctx.fillRect(1 * s, 13 * s - legAnim, 5 * s, 2 * s);

  // body - leather tunic
  const tunicGrad = ctx.createLinearGradient(-6 * s, -4 * s, 6 * s, 9 * s);
  tunicGrad.addColorStop(0, lighter(col, 15));
  tunicGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = tunicGrad;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -3 * s);
  ctx.lineTo(-7 * s, 9 * s);
  ctx.lineTo(7 * s, 9 * s);
  ctx.lineTo(6 * s, -3 * s);
  ctx.closePath();
  ctx.fill();
  // belt
  ctx.fillStyle = darker(col, 60);
  ctx.fillRect(-7 * s, 4 * s, 14 * s, 2 * s);
  ctx.fillStyle = lighter(col, 40);
  ctx.fillRect(-1 * s, 3.5 * s, 2 * s, 3 * s); // buckle

  // left arm (holds crossbow stock)
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(-9 * s, -2 * s, 3 * s, 6 * s);

  // crossbow (held forward on right side)
  ctx.save();
  const aimBob = Math.sin(t * 2 + ph) * 0.5 * s;
  ctx.translate(6 * s, -1 * s + aimBob);
  // stock (horizontal bar)
  ctx.fillStyle = '#7B5B3A';
  ctx.fillRect(-2 * s, -1 * s, 10 * s, 2 * s);
  // bow limbs (the cross part)
  ctx.strokeStyle = '#5A3A1A';
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -1 * s);
  ctx.quadraticCurveTo(-1 * s, -6 * s, 2 * s, -7 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 1 * s);
  ctx.quadraticCurveTo(-1 * s, 6 * s, 2 * s, 7 * s);
  ctx.stroke();
  // bowstring
  ctx.strokeStyle = '#AAA';
  ctx.lineWidth = 0.5 * s;
  ctx.beginPath();
  ctx.moveTo(2 * s, -7 * s);
  ctx.lineTo(0, 0);
  ctx.lineTo(2 * s, 7 * s);
  ctx.stroke();
  // bolt
  ctx.fillStyle = '#888';
  ctx.fillRect(0, -0.4 * s, 8 * s, 0.8 * s);
  // bolt tip
  ctx.fillStyle = '#CCC';
  ctx.beginPath();
  ctx.moveTo(8 * s, -1 * s);
  ctx.lineTo(10 * s, 0);
  ctx.lineTo(8 * s, 1 * s);
  ctx.closePath();
  ctx.fill();
  // bolt fletching
  ctx.fillStyle = '#CC4444';
  ctx.beginPath();
  ctx.moveTo(0, -0.4 * s);
  ctx.lineTo(-1.5 * s, -2 * s);
  ctx.lineTo(1 * s, -0.4 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // right arm (supporting crossbow)
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(6 * s, -3 * s, 3 * s, 5 * s);

  // hood/head
  const hoodGrad = ctx.createLinearGradient(-5 * s, -14 * s, 5 * s, -4 * s);
  hoodGrad.addColorStop(0, darker(col, 20));
  hoodGrad.addColorStop(1, darker(col, 50));
  ctx.fillStyle = hoodGrad;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -3 * s);
  ctx.quadraticCurveTo(-6 * s, -10 * s, -3 * s, -14 * s);
  ctx.quadraticCurveTo(0, -16 * s, 3 * s, -14 * s);
  ctx.quadraticCurveTo(6 * s, -10 * s, 5 * s, -3 * s);
  ctx.closePath();
  ctx.fill();
  // hood tip (hangs slightly)
  ctx.beginPath();
  ctx.moveTo(2 * s, -14 * s);
  ctx.quadraticCurveTo(4 * s, -16 * s, 3 * s + Math.sin(t * 3) * s, -17 * s);
  ctx.lineWidth = 2 * s;
  ctx.strokeStyle = darker(col, 30);
  ctx.stroke();

  // face shadow under hood
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, -8 * s, 4 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // eyes peeking from shadow
  ctx.fillStyle = '#DDD';
  ctx.beginPath();
  ctx.arc(-2 * s, -9 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2 * s, -9 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(-2 * s, -9 * s, 0.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2 * s, -9 * s, 0.5 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  5. drawIronShield  -  "アイアンシールド"  (his_05)                  */
/*     Crusader with large kite shield bearing a cross                 */
/* ------------------------------------------------------------------ */
export function drawIronShield(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 9 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs - chain mail leggings
  const legAnim = Math.sin(t * 3.5 + ph) * 2.5 * s;
  ctx.fillStyle = '#808080';
  ctx.fillRect(-5 * s, 7 * s + legAnim, 4 * s, 7 * s);
  ctx.fillRect(1 * s, 7 * s - legAnim, 4 * s, 7 * s);
  // chainmail texture on legs
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 0.4 * s;
  for (let ly = 0; ly < 3; ly++) {
    const yy = 9 * s + ly * 2 * s;
    ctx.beginPath();
    ctx.moveTo(-5 * s, yy + legAnim); ctx.lineTo(-1 * s, yy + legAnim);
    ctx.moveTo(1 * s, yy - legAnim); ctx.lineTo(5 * s, yy - legAnim);
    ctx.stroke();
  }

  // body - chain mail hauberk
  const mailGrad = ctx.createLinearGradient(-7 * s, -5 * s, 7 * s, 8 * s);
  mailGrad.addColorStop(0, '#A0A0A0');
  mailGrad.addColorStop(0.5, '#888');
  mailGrad.addColorStop(1, '#707070');
  ctx.fillStyle = mailGrad;
  ctx.beginPath();
  ctx.moveTo(-7 * s, -4 * s);
  ctx.lineTo(-8 * s, 8 * s);
  ctx.lineTo(8 * s, 8 * s);
  ctx.lineTo(7 * s, -4 * s);
  ctx.closePath();
  ctx.fill();
  // chainmail texture on body
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 0.3 * s;
  for (let my = 0; my < 5; my++) {
    for (let mx = -3; mx < 4; mx++) {
      ctx.beginPath();
      ctx.arc(mx * 3 * s, (-2 + my * 2.5) * s, 1 * s, 0, Math.PI, false);
      ctx.stroke();
    }
  }

  // surcoat (white with cross over chain mail)
  ctx.fillStyle = 'rgba(240,235,220,0.7)';
  ctx.beginPath();
  ctx.moveTo(-5 * s, -2 * s);
  ctx.lineTo(-6 * s, 8 * s);
  ctx.lineTo(6 * s, 8 * s);
  ctx.lineTo(5 * s, -2 * s);
  ctx.closePath();
  ctx.fill();
  // red cross on surcoat
  ctx.fillStyle = '#CC2222';
  ctx.fillRect(-1 * s, -1 * s, 2 * s, 8 * s);
  ctx.fillRect(-3.5 * s, 1.5 * s, 7 * s, 2 * s);

  // sword arm (right, behind shield)
  ctx.save();
  const swordSwing = Math.sin(t * 2 + ph) * 0.12;
  ctx.rotate(swordSwing);
  ctx.fillStyle = '#808080';
  ctx.fillRect(7 * s, -4 * s, 3.5 * s, 7 * s);
  // sword
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(8 * s, -12 * s, 1.5 * s, 9 * s);
  // sword guard
  ctx.fillStyle = '#AA8833';
  ctx.fillRect(6.5 * s, -4 * s, 5 * s, 1.5 * s);
  // sword pommel
  ctx.fillStyle = '#AA8833';
  ctx.beginPath();
  ctx.arc(8.7 * s, -2 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // LARGE kite shield (front and center-left)
  ctx.save();
  const shieldBob = Math.sin(t * 2 + ph + 1) * 0.5 * s;
  ctx.translate(-3 * s, 0 + shieldBob);
  const shieldGrad = ctx.createLinearGradient(-6 * s, -8 * s, 6 * s, 10 * s);
  shieldGrad.addColorStop(0, '#E0E0E0');
  shieldGrad.addColorStop(0.5, '#C0C0C0');
  shieldGrad.addColorStop(1, '#909090');
  ctx.fillStyle = shieldGrad;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -8 * s);
  ctx.lineTo(-7 * s, 0);
  ctx.quadraticCurveTo(-5 * s, 10 * s, 0, 12 * s);
  ctx.quadraticCurveTo(5 * s, 10 * s, 7 * s, 0);
  ctx.lineTo(6 * s, -8 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1 * s;
  ctx.stroke();
  // cross on shield
  ctx.fillStyle = col;
  ctx.fillRect(-1 * s, -6 * s, 2 * s, 16 * s);
  ctx.fillRect(-4.5 * s, -1 * s, 9 * s, 2 * s);
  // shield rim highlight
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 0.6 * s;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -7 * s);
  ctx.lineTo(-6 * s, 0);
  ctx.stroke();
  ctx.restore();

  // helmet - great helm
  const helmGrad = ctx.createLinearGradient(-5 * s, -15 * s, 5 * s, -5 * s);
  helmGrad.addColorStop(0, '#C0C0C0');
  helmGrad.addColorStop(1, '#808080');
  ctx.fillStyle = helmGrad;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -5 * s);
  ctx.lineTo(-5 * s, -12 * s);
  ctx.quadraticCurveTo(-5 * s, -16 * s, 0, -16 * s);
  ctx.quadraticCurveTo(5 * s, -16 * s, 5 * s, -12 * s);
  ctx.lineTo(5 * s, -5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 0.7 * s;
  ctx.stroke();
  // visor slit
  ctx.fillStyle = '#222';
  ctx.fillRect(-4 * s, -10 * s, 8 * s, 1.5 * s);
  // breathing holes
  for (let bh = 0; bh < 3; bh++) {
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.arc(-2 * s + bh * 2 * s, -7 * s, 0.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  6. drawFlameTorch  -  "フレイムトーチ"  (his_06)                    */
/*     Ancient torch bearer, robed figure, dynamic fire                */
/* ------------------------------------------------------------------ */
export function drawFlameTorch(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow (with flicker from fire glow)
  const glowPulse = 0.15 + Math.sin(t * 6) * 0.05;
  ctx.fillStyle = `rgba(0,0,0,${glowPulse})`;
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 9 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // fire glow on ground
  ctx.fillStyle = `rgba(255,150,30,${0.08 + Math.sin(t * 8) * 0.04})`;
  ctx.beginPath();
  ctx.ellipse(-2 * s, 12 * s, 14 * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs - robed, peek from under robe
  const legAnim = Math.sin(t * 3.5 + ph) * 2 * s;
  ctx.fillStyle = darker(col, 60);
  ctx.fillRect(-4 * s, 10 * s + legAnim, 3 * s, 4 * s);
  ctx.fillRect(1 * s, 10 * s - legAnim, 3 * s, 4 * s);

  // flowing robe body
  const robeWave = Math.sin(t * 2 + ph) * s;
  const robeGrad = ctx.createLinearGradient(-7 * s, -5 * s, 7 * s, 12 * s);
  robeGrad.addColorStop(0, lighter(col, 20));
  robeGrad.addColorStop(0.4, col);
  robeGrad.addColorStop(1, darker(col, 50));
  ctx.fillStyle = robeGrad;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -4 * s);
  ctx.quadraticCurveTo(-8 * s + robeWave, 4 * s, -7 * s + robeWave, 12 * s);
  ctx.lineTo(7 * s - robeWave, 12 * s);
  ctx.quadraticCurveTo(8 * s - robeWave, 4 * s, 5 * s, -4 * s);
  ctx.closePath();
  ctx.fill();
  // robe hem decoration
  ctx.strokeStyle = lighter(col, 40);
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(-7 * s + robeWave, 11 * s);
  ctx.lineTo(7 * s - robeWave, 11 * s);
  ctx.stroke();

  // left arm (free hand, by side)
  ctx.fillStyle = darker(col, 30);
  ctx.save();
  ctx.rotate(Math.sin(t * 2 + ph) * 0.1);
  ctx.fillRect(-9 * s, -2 * s, 3 * s, 7 * s);
  ctx.restore();

  // right arm (raised, holding torch)
  ctx.save();
  ctx.translate(5 * s, -4 * s);
  ctx.rotate(-0.6 + Math.sin(t * 1.5 + ph) * 0.08);
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(-1.5 * s, -1 * s, 3 * s, 8 * s);

  // torch staff
  ctx.fillStyle = '#6B4226';
  ctx.fillRect(-1 * s, -12 * s, 2 * s, 12 * s);
  // wrapping at top
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(-1.5 * s, -12 * s, 3 * s, 2 * s);

  // FIRE (layered animated flames)
  const fireY = -13 * s;
  // outer flame (large, orange-red)
  for (let fi = 0; fi < 5; fi++) {
    const fx = Math.sin(t * 10 + fi * 1.3 + ph) * 2 * s;
    const fy = -Math.abs(Math.sin(t * 8 + fi * 0.9)) * 4 * s;
    const fSize = (3 - fi * 0.3) * s;
    const alpha = 0.6 - fi * 0.08;
    ctx.fillStyle = `rgba(255,${80 + fi * 30},0,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(fx - fSize, fireY);
    ctx.quadraticCurveTo(fx - fSize * 0.5, fireY + fy - fSize * 2, fx, fireY + fy - fSize * 3);
    ctx.quadraticCurveTo(fx + fSize * 0.5, fireY + fy - fSize * 2, fx + fSize, fireY);
    ctx.closePath();
    ctx.fill();
  }
  // inner flame (bright yellow-white core)
  const coreFlicker = Math.sin(t * 12 + ph) * s;
  ctx.fillStyle = 'rgba(255,255,150,0.8)';
  ctx.beginPath();
  ctx.moveTo(-1 * s, fireY);
  ctx.quadraticCurveTo(coreFlicker * 0.5, fireY - 4 * s, coreFlicker, fireY - 6 * s);
  ctx.quadraticCurveTo(coreFlicker * 0.5 + 1 * s, fireY - 4 * s, 1 * s, fireY);
  ctx.closePath();
  ctx.fill();
  // sparks
  for (let sp = 0; sp < 3; sp++) {
    const spx = Math.sin(t * 7 + sp * 2.5 + ph) * 3 * s;
    const spy = fireY - 6 * s - ((t * 20 + sp * 15 + ph * 5) % 8) * s;
    ctx.fillStyle = `rgba(255,200,50,${0.7 - ((t * 20 + sp * 15) % 8) * 0.08})`;
    ctx.beginPath();
    ctx.arc(spx, spy, 0.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // hooded head
  const hoodGrad = ctx.createRadialGradient(0, -9 * s, 1 * s, 0, -9 * s, 6 * s);
  hoodGrad.addColorStop(0, darker(col, 10));
  hoodGrad.addColorStop(1, darker(col, 50));
  ctx.fillStyle = hoodGrad;
  ctx.beginPath();
  ctx.arc(0, -9 * s, 5.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // hood point
  ctx.beginPath();
  ctx.moveTo(-2 * s, -14 * s);
  ctx.lineTo(0, -17 * s + Math.sin(t * 2) * 0.5 * s);
  ctx.lineTo(2 * s, -14 * s);
  ctx.closePath();
  ctx.fill();

  // face in shadow - glowing eyes from firelight
  const eyeFlicker = 0.6 + Math.sin(t * 6) * 0.2;
  ctx.fillStyle = `rgba(255,180,50,${eyeFlicker})`;
  ctx.beginPath();
  ctx.arc(-2 * s, -9 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2 * s, -9 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  7. drawWarHammer  -  "ウォーハンマー"  (his_07)                     */
/*     Viking warrior with massive war hammer, horned helmet, fur      */
/* ------------------------------------------------------------------ */
export function drawWarHammer(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // thick legs (barrel-bodied viking)
  const legAnim = Math.sin(t * 3 + ph) * 2.5 * s;
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-6 * s, 8 * s + legAnim, 5 * s, 6 * s);
  ctx.fillRect(1 * s, 8 * s - legAnim, 5 * s, 6 * s);
  // fur-lined boots
  ctx.fillStyle = '#5C3A1E';
  ctx.fillRect(-7 * s, 12 * s + legAnim, 6 * s, 3 * s);
  ctx.fillRect(0.5 * s, 12 * s - legAnim, 6 * s, 3 * s);
  // fur trim on boots
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(-7 * s, 11.5 * s + legAnim, 6 * s, 1.5 * s);
  ctx.fillRect(0.5 * s, 11.5 * s - legAnim, 6 * s, 1.5 * s);

  // barrel body (wide and round)
  const bodyGrad = ctx.createLinearGradient(-9 * s, -5 * s, 9 * s, 9 * s);
  bodyGrad.addColorStop(0, lighter(col, 15));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 3 * s, 9 * s, 7 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // fur vest over chest
  ctx.fillStyle = '#7B6040';
  ctx.beginPath();
  ctx.moveTo(-4 * s, -4 * s);
  ctx.lineTo(-6 * s, 6 * s);
  ctx.lineTo(-2 * s, 6 * s);
  ctx.lineTo(-1 * s, -3 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(4 * s, -4 * s);
  ctx.lineTo(6 * s, 6 * s);
  ctx.lineTo(2 * s, 6 * s);
  ctx.lineTo(1 * s, -3 * s);
  ctx.closePath();
  ctx.fill();
  // fur texture (small lines)
  ctx.strokeStyle = '#6B5030';
  ctx.lineWidth = 0.4 * s;
  for (let fi = 0; fi < 4; fi++) {
    ctx.beginPath();
    ctx.moveTo(-5 * s, (-2 + fi * 2) * s);
    ctx.lineTo(-4 * s, (-1.5 + fi * 2) * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5 * s, (-2 + fi * 2) * s);
    ctx.lineTo(4 * s, (-1.5 + fi * 2) * s);
    ctx.stroke();
  }

  // belt with buckle
  ctx.fillStyle = '#5C3A1E';
  ctx.fillRect(-9 * s, 3 * s, 18 * s, 2.5 * s);
  ctx.fillStyle = '#C0A040';
  ctx.fillRect(-2 * s, 2.5 * s, 4 * s, 3.5 * s);

  // left arm (thick, by side)
  ctx.fillStyle = darker(col, 25);
  ctx.save();
  ctx.rotate(Math.sin(t * 2 + ph) * 0.1);
  ctx.beginPath();
  ctx.ellipse(-10 * s, 0, 3 * s, 5 * s, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // right arm + WAR HAMMER
  ctx.save();
  const hammerSwing = Math.sin(t * 2.5 + ph) * 0.15;
  ctx.translate(8 * s, -2 * s);
  ctx.rotate(hammerSwing);
  // arm
  ctx.fillStyle = darker(col, 25);
  ctx.beginPath();
  ctx.ellipse(2 * s, 2 * s, 3 * s, 5 * s, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // hammer shaft
  ctx.strokeStyle = '#6B4226';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(2 * s, 0);
  ctx.lineTo(2 * s, -14 * s);
  ctx.stroke();
  // hammer head (massive rectangular)
  const hamGrad = ctx.createLinearGradient(-2 * s, -18 * s, 6 * s, -12 * s);
  hamGrad.addColorStop(0, '#A0A0A0');
  hamGrad.addColorStop(0.5, '#808080');
  hamGrad.addColorStop(1, '#606060');
  ctx.fillStyle = hamGrad;
  ctx.fillRect(-3 * s, -18 * s, 10 * s, 5 * s);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 0.7 * s;
  ctx.strokeRect(-3 * s, -18 * s, 10 * s, 5 * s);
  // spike on back of hammer
  ctx.fillStyle = '#888';
  ctx.beginPath();
  ctx.moveTo(-3 * s, -17 * s);
  ctx.lineTo(-6 * s, -15.5 * s);
  ctx.lineTo(-3 * s, -14 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // head (round, bearded)
  ctx.fillStyle = '#E8C99B';
  ctx.beginPath();
  ctx.arc(0, -8 * s, 5 * s, 0, Math.PI * 2);
  ctx.fill();

  // big bushy beard
  ctx.fillStyle = '#8B5A2B';
  ctx.beginPath();
  ctx.moveTo(-4 * s, -6 * s);
  ctx.quadraticCurveTo(-5 * s, -2 * s, -3 * s, 0);
  ctx.quadraticCurveTo(0, 1 * s, 3 * s, 0);
  ctx.quadraticCurveTo(5 * s, -2 * s, 4 * s, -6 * s);
  ctx.closePath();
  ctx.fill();
  // beard texture
  ctx.strokeStyle = '#7A4A1B';
  ctx.lineWidth = 0.5 * s;
  for (let bi = -2; bi <= 2; bi++) {
    ctx.beginPath();
    ctx.moveTo(bi * 1.5 * s, -5 * s);
    ctx.lineTo(bi * 1.2 * s, -1 * s);
    ctx.stroke();
  }

  // eyes (fierce)
  ctx.fillStyle = '#FFF';
  ctx.fillRect(-3.5 * s, -10 * s, 2.5 * s, 1.8 * s);
  ctx.fillRect(1 * s, -10 * s, 2.5 * s, 1.8 * s);
  ctx.fillStyle = '#2244AA';
  ctx.beginPath();
  ctx.arc(-2.3 * s, -9.2 * s, 0.7 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2.3 * s, -9.2 * s, 0.7 * s, 0, Math.PI * 2);
  ctx.fill();

  // horned helmet
  const helmGrad = ctx.createLinearGradient(-5 * s, -15 * s, 5 * s, -9 * s);
  helmGrad.addColorStop(0, '#888');
  helmGrad.addColorStop(1, '#666');
  ctx.fillStyle = helmGrad;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -9 * s);
  ctx.quadraticCurveTo(-6 * s, -13 * s, -3 * s, -14 * s);
  ctx.quadraticCurveTo(0, -15 * s, 3 * s, -14 * s);
  ctx.quadraticCurveTo(6 * s, -13 * s, 5 * s, -9 * s);
  ctx.closePath();
  ctx.fill();
  // nose guard
  ctx.fillStyle = '#777';
  ctx.fillRect(-0.5 * s, -13 * s, 1 * s, 5 * s);
  // horns!
  ctx.fillStyle = '#D4C5A0';
  ctx.beginPath();
  ctx.moveTo(-5 * s, -12 * s);
  ctx.quadraticCurveTo(-8 * s, -17 * s, -10 * s, -18 * s);
  ctx.quadraticCurveTo(-8 * s, -15 * s, -5 * s, -11 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(5 * s, -12 * s);
  ctx.quadraticCurveTo(8 * s, -17 * s, 10 * s, -18 * s);
  ctx.quadraticCurveTo(8 * s, -15 * s, 5 * s, -11 * s);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  8. drawRoyalDrummer  -  "ロイヤルドラマー"  (his_08)                */
/*     Military drummer in royal uniform, drum & drumsticks            */
/* ------------------------------------------------------------------ */
export function drawRoyalDrummer(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 8 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs in uniform trousers
  const legAnim = Math.sin(t * 4 + ph) * 2.5 * s;
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(-5 * s, 7 * s + legAnim, 4 * s, 7 * s);
  ctx.fillRect(1 * s, 7 * s - legAnim, 4 * s, 7 * s);
  // tall boots
  ctx.fillStyle = '#222';
  ctx.fillRect(-5.5 * s, 11 * s + legAnim, 4.5 * s, 3.5 * s);
  ctx.fillRect(0.5 * s, 11 * s - legAnim, 4.5 * s, 3.5 * s);
  // boot tops (fold)
  ctx.fillStyle = '#333';
  ctx.fillRect(-5.5 * s, 10.5 * s + legAnim, 4.5 * s, 1.5 * s);
  ctx.fillRect(0.5 * s, 10.5 * s - legAnim, 4.5 * s, 1.5 * s);

  // military uniform body (tailored, with tails)
  const uniGrad = ctx.createLinearGradient(-6 * s, -5 * s, 6 * s, 8 * s);
  uniGrad.addColorStop(0, lighter(col, 20));
  uniGrad.addColorStop(0.5, col);
  uniGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = uniGrad;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -4 * s);
  ctx.lineTo(-6.5 * s, 8 * s);
  ctx.lineTo(6.5 * s, 8 * s);
  ctx.lineTo(6 * s, -4 * s);
  ctx.closePath();
  ctx.fill();
  // coat tails (back, peeking out)
  ctx.fillStyle = darker(col, 15);
  ctx.beginPath();
  ctx.moveTo(-5 * s, 7 * s);
  ctx.lineTo(-4 * s, 12 * s + Math.sin(t * 3 + ph) * s);
  ctx.lineTo(-2 * s, 7 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(2 * s, 7 * s);
  ctx.lineTo(4 * s, 12 * s + Math.sin(t * 3 + ph + 1) * s);
  ctx.lineTo(5 * s, 7 * s);
  ctx.closePath();
  ctx.fill();

  // gold buttons
  ctx.fillStyle = '#DAA520';
  for (let bi = 0; bi < 4; bi++) {
    ctx.beginPath();
    ctx.arc(0, (-2 + bi * 2.5) * s, 0.8 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  // epaulettes (gold shoulder pads)
  ctx.fillStyle = '#DAA520';
  ctx.beginPath();
  ctx.ellipse(-7 * s, -3.5 * s, 2.5 * s, 1.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(7 * s, -3.5 * s, 2.5 * s, 1.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // fringe on epaulettes
  ctx.strokeStyle = '#C89B20';
  ctx.lineWidth = 0.5 * s;
  for (let ei = -2; ei <= 0; ei++) {
    ctx.beginPath();
    ctx.moveTo(-7 * s + ei * s, -2 * s);
    ctx.lineTo(-7 * s + ei * s, -0.5 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(7 * s - ei * s, -2 * s);
    ctx.lineTo(7 * s - ei * s, -0.5 * s);
    ctx.stroke();
  }

  // DRUM (strapped to front)
  ctx.save();
  ctx.translate(0, 3 * s);
  // drum body (cylinder seen from front = rectangle + ellipses)
  const drumGrad = ctx.createLinearGradient(-5 * s, -3 * s, 5 * s, 3 * s);
  drumGrad.addColorStop(0, '#CC8844');
  drumGrad.addColorStop(0.5, '#B87733');
  drumGrad.addColorStop(1, '#996622');
  ctx.fillStyle = drumGrad;
  ctx.fillRect(-5 * s, -3 * s, 10 * s, 6 * s);
  // drum top (ellipse)
  ctx.fillStyle = '#EEE8D5';
  ctx.beginPath();
  ctx.ellipse(0, -3 * s, 5 * s, 1.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#AA7733';
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();
  // drum bottom rim
  ctx.strokeStyle = '#AA7733';
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.ellipse(0, 3 * s, 5 * s, 1.5 * s, 0, Math.PI, Math.PI * 2);
  ctx.stroke();
  // drum straps (diagonal)
  ctx.strokeStyle = '#DDD';
  ctx.lineWidth = 0.6 * s;
  for (let di = 0; di < 4; di++) {
    const dx = -4 * s + di * 2.5 * s;
    ctx.beginPath();
    ctx.moveTo(dx, -3 * s);
    ctx.lineTo(dx + 2 * s, 3 * s);
    ctx.stroke();
  }
  // strap over shoulder
  ctx.strokeStyle = '#DDD';
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -3 * s);
  ctx.quadraticCurveTo(-3 * s, -8 * s, 2 * s, -7 * s);
  ctx.stroke();
  ctx.restore();

  // arms with drumsticks (animated beating!)
  const beatL = Math.sin(t * 8 + ph) * 0.4;
  const beatR = Math.sin(t * 8 + ph + Math.PI) * 0.4;
  // left arm + stick
  ctx.save();
  ctx.translate(-6 * s, -2 * s);
  ctx.rotate(0.3 + beatL);
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(-1.5 * s, 0, 3 * s, 7 * s);
  // drumstick
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(0, 6 * s);
  ctx.lineTo(3 * s, 10 * s);
  ctx.stroke();
  ctx.fillStyle = '#AA9365';
  ctx.beginPath();
  ctx.arc(3 * s, 10 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // right arm + stick
  ctx.save();
  ctx.translate(6 * s, -2 * s);
  ctx.rotate(-0.3 + beatR);
  ctx.fillStyle = darker(col, 30);
  ctx.fillRect(-1.5 * s, 0, 3 * s, 7 * s);
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(0, 6 * s);
  ctx.lineTo(-3 * s, 10 * s);
  ctx.stroke();
  ctx.fillStyle = '#AA9365';
  ctx.beginPath();
  ctx.arc(-3 * s, 10 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // head
  ctx.fillStyle = '#E8C99B';
  ctx.beginPath();
  ctx.arc(0, -8 * s, 4.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // eyes
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(-1.5 * s, -8.5 * s, 0.7 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1.5 * s, -8.5 * s, 0.7 * s, 0, Math.PI * 2);
  ctx.fill();
  // mouth (open, singing/calling)
  ctx.fillStyle = '#A05050';
  ctx.beginPath();
  ctx.ellipse(0, -6 * s, 1.5 * s, 1 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // tall shako hat
  const hatGrad = ctx.createLinearGradient(-4 * s, -18 * s, 4 * s, -11 * s);
  hatGrad.addColorStop(0, '#222');
  hatGrad.addColorStop(1, '#444');
  ctx.fillStyle = hatGrad;
  ctx.fillRect(-4 * s, -17 * s, 8 * s, 6 * s);
  // hat brim
  ctx.fillStyle = '#333';
  ctx.fillRect(-5 * s, -11.5 * s, 10 * s, 1.5 * s);
  // gold badge on hat
  ctx.fillStyle = '#DAA520';
  ctx.beginPath();
  ctx.arc(0, -14 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // plume on top
  const plumeWave = Math.sin(t * 3 + ph) * s;
  ctx.fillStyle = '#EEE';
  ctx.beginPath();
  ctx.moveTo(0, -17 * s);
  ctx.quadraticCurveTo(2 * s + plumeWave, -20 * s, 1 * s + plumeWave, -22 * s);
  ctx.quadraticCurveTo(-1 * s + plumeWave, -20 * s, 0, -17 * s);
  ctx.fill();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  9. drawEmperorBow  -  "エンペラーボウ"  (his_09)                   */
/*     Imperial archer with ornate longbow, crown, flowing cape        */
/* ------------------------------------------------------------------ */
export function drawEmperorBow(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 9 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // flowing cape (behind everything)
  const capeWave1 = Math.sin(t * 2.5 + ph) * 2 * s;
  const capeWave2 = Math.sin(t * 3 + ph + 1) * 1.5 * s;
  const capeGrad = ctx.createLinearGradient(-5 * s, -5 * s, 5 * s, 14 * s);
  capeGrad.addColorStop(0, '#8B0000');
  capeGrad.addColorStop(0.5, '#A01010');
  capeGrad.addColorStop(1, '#660000');
  ctx.fillStyle = capeGrad;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -4 * s);
  ctx.quadraticCurveTo(-8 * s + capeWave1, 4 * s, -10 * s + capeWave2, 13 * s);
  ctx.lineTo(0 + capeWave1, 14 * s);
  ctx.quadraticCurveTo(2 * s, 5 * s, 3 * s, -4 * s);
  ctx.closePath();
  ctx.fill();
  // cape gold trim
  ctx.strokeStyle = '#DAA520';
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(-10 * s + capeWave2, 13 * s);
  ctx.lineTo(0 + capeWave1, 14 * s);
  ctx.stroke();

  // legs - elegant leggings
  const legAnim = Math.sin(t * 3.5 + ph) * 2.5 * s;
  ctx.fillStyle = darker(col, 45);
  ctx.fillRect(-5 * s, 7 * s + legAnim, 3.5 * s, 7 * s);
  ctx.fillRect(1.5 * s, 7 * s - legAnim, 3.5 * s, 7 * s);
  // elegant boots
  ctx.fillStyle = '#3A1A0A';
  ctx.beginPath();
  ctx.moveTo(-6 * s, 13 * s + legAnim);
  ctx.lineTo(-5.5 * s, 11 * s + legAnim);
  ctx.lineTo(-1 * s, 11 * s + legAnim);
  ctx.lineTo(-1 * s, 14 * s + legAnim);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(1 * s, 13 * s - legAnim);
  ctx.lineTo(1.5 * s, 11 * s - legAnim);
  ctx.lineTo(6 * s, 11 * s - legAnim);
  ctx.lineTo(6 * s, 14 * s - legAnim);
  ctx.closePath();
  ctx.fill();

  // ornate body armor
  const armorGrad = ctx.createLinearGradient(-6 * s, -5 * s, 6 * s, 8 * s);
  armorGrad.addColorStop(0, lighter(col, 30));
  armorGrad.addColorStop(0.5, col);
  armorGrad.addColorStop(1, darker(col, 35));
  ctx.fillStyle = armorGrad;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -4 * s);
  ctx.quadraticCurveTo(-7 * s, 3 * s, -6 * s, 8 * s);
  ctx.lineTo(6 * s, 8 * s);
  ctx.quadraticCurveTo(7 * s, 3 * s, 6 * s, -4 * s);
  ctx.closePath();
  ctx.fill();
  // gold chest emblem
  ctx.fillStyle = '#DAA520';
  ctx.beginPath();
  ctx.moveTo(0, -2 * s);
  ctx.lineTo(-2 * s, 1 * s);
  ctx.lineTo(0, 4 * s);
  ctx.lineTo(2 * s, 1 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 0.5 * s;
  ctx.stroke();
  // gold belt
  ctx.fillStyle = '#DAA520';
  ctx.fillRect(-6.5 * s, 5 * s, 13 * s, 1.5 * s);

  // left arm (draws bowstring)
  const drawAnim = Math.sin(t * 2 + ph) * 0.08;
  ctx.save();
  ctx.rotate(drawAnim);
  ctx.fillStyle = darker(col, 25);
  ctx.fillRect(-10 * s, -3 * s, 4 * s, 6 * s);
  // hand
  ctx.fillStyle = '#E8C99B';
  ctx.fillRect(-10.5 * s, 2 * s, 3 * s, 2 * s);
  ctx.restore();

  // LONGBOW (ornate, held on left side)
  ctx.save();
  ctx.translate(-10 * s, 0);
  // bow stave (curved)
  ctx.strokeStyle = '#8B5A2B';
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -13 * s);
  ctx.quadraticCurveTo(-5 * s, 0, 0, 13 * s);
  ctx.stroke();
  // gold inlays on bow
  ctx.strokeStyle = '#DAA520';
  ctx.lineWidth = 0.6 * s;
  ctx.beginPath();
  ctx.moveTo(-1 * s, -8 * s);
  ctx.quadraticCurveTo(-3 * s, -4 * s, -2 * s, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-2 * s, 0);
  ctx.quadraticCurveTo(-3 * s, 4 * s, -1 * s, 8 * s);
  ctx.stroke();
  // bowstring
  ctx.strokeStyle = '#CCC';
  ctx.lineWidth = 0.4 * s;
  ctx.beginPath();
  ctx.moveTo(0, -13 * s);
  ctx.lineTo(0, 13 * s);
  ctx.stroke();
  // arrow nocked
  ctx.fillStyle = '#666';
  ctx.fillRect(0, -0.3 * s, 12 * s, 0.6 * s);
  // arrowhead
  ctx.fillStyle = '#AAA';
  ctx.beginPath();
  ctx.moveTo(12 * s, -1.2 * s);
  ctx.lineTo(14 * s, 0);
  ctx.lineTo(12 * s, 1.2 * s);
  ctx.closePath();
  ctx.fill();
  // fletching
  ctx.fillStyle = '#DAA520';
  ctx.beginPath();
  ctx.moveTo(0, -0.3 * s);
  ctx.lineTo(-2 * s, -2 * s);
  ctx.lineTo(1 * s, -0.3 * s);
  ctx.fill();
  ctx.restore();

  // right arm (by side, holding arrow)
  ctx.fillStyle = darker(col, 25);
  ctx.fillRect(6 * s, -3 * s, 3.5 * s, 6 * s);

  // head
  ctx.fillStyle = '#E8C99B';
  ctx.beginPath();
  ctx.arc(0, -8 * s, 4.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // regal expression
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(-1.5 * s, -8.5 * s, 0.7 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1.5 * s, -8.5 * s, 0.7 * s, 0, Math.PI * 2);
  ctx.fill();
  // slight smile
  ctx.strokeStyle = '#885555';
  ctx.lineWidth = 0.6 * s;
  ctx.beginPath();
  ctx.arc(0, -7 * s, 1.5 * s, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // CROWN
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(-4 * s, -12 * s);
  ctx.lineTo(-4 * s, -14 * s);
  ctx.lineTo(-2.5 * s, -13 * s);
  ctx.lineTo(-1 * s, -15.5 * s);
  ctx.lineTo(0, -13.5 * s);
  ctx.lineTo(1 * s, -15.5 * s);
  ctx.lineTo(2.5 * s, -13 * s);
  ctx.lineTo(4 * s, -14 * s);
  ctx.lineTo(4 * s, -12 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 0.5 * s;
  ctx.stroke();
  // jewels on crown
  ctx.fillStyle = '#FF2222';
  ctx.beginPath();
  ctx.arc(-1 * s, -14 * s, 0.6 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2222FF';
  ctx.beginPath();
  ctx.arc(1 * s, -14 * s, 0.6 * s, 0, Math.PI * 2);
  ctx.fill();
  // crown base band
  ctx.fillStyle = '#B8860B';
  ctx.fillRect(-4 * s, -12.5 * s, 8 * s, 1 * s);

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  10. drawOrichalcum  -  "オリハルコン"  (his_10)                     */
/*      Mythical orichalcum metal warrior, rune patterns, aura         */
/* ------------------------------------------------------------------ */
export function drawOrichalcum(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  void col; // orichalcum uses fixed gold palette
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // radiant aura (pulsing golden glow)
  const auraPulse = 0.3 + Math.sin(t * 3 + ph) * 0.15;
  const auraR = (16 + Math.sin(t * 2) * 3) * s;
  const auraGrad = ctx.createRadialGradient(0, -2 * s, 2 * s, 0, -2 * s, auraR);
  auraGrad.addColorStop(0, `rgba(255,215,0,${auraPulse})`);
  auraGrad.addColorStop(0.5, `rgba(255,180,0,${auraPulse * 0.4})`);
  auraGrad.addColorStop(1, 'rgba(255,150,0,0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(0, -2 * s, auraR, 0, Math.PI * 2);
  ctx.fill();

  // shadow (golden tint)
  ctx.fillStyle = 'rgba(180,140,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs - gleaming golden metal
  const legAnim = Math.sin(t * 3.5 + ph) * 2.5 * s;
  const metalGold = ctx.createLinearGradient(-2 * s, 7 * s, 2 * s, 14 * s);
  metalGold.addColorStop(0, '#FFD700');
  metalGold.addColorStop(0.3, '#DAA520');
  metalGold.addColorStop(0.6, '#FFD700');
  metalGold.addColorStop(1, '#B8860B');
  ctx.fillStyle = metalGold;
  ctx.fillRect(-5 * s, 7 * s + legAnim, 4 * s, 7 * s);
  ctx.fillRect(1 * s, 7 * s - legAnim, 4 * s, 7 * s);
  // leg rune markings
  ctx.strokeStyle = 'rgba(255,255,200,0.6)';
  ctx.lineWidth = 0.5 * s;
  ctx.beginPath();
  ctx.moveTo(-3 * s, 9 * s + legAnim);
  ctx.lineTo(-3 * s, 12 * s + legAnim);
  ctx.moveTo(-4 * s, 10.5 * s + legAnim);
  ctx.lineTo(-2 * s, 10.5 * s + legAnim);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(3 * s, 9 * s - legAnim);
  ctx.lineTo(3 * s, 12 * s - legAnim);
  ctx.moveTo(2 * s, 10.5 * s - legAnim);
  ctx.lineTo(4 * s, 10.5 * s - legAnim);
  ctx.stroke();
  // feet
  ctx.fillStyle = '#B8860B';
  ctx.fillRect(-6 * s, 13 * s + legAnim, 5 * s, 2 * s);
  ctx.fillRect(0.5 * s, 13 * s - legAnim, 5 * s, 2 * s);

  // body - orichalcum metal (rich golden gradient)
  const bodyGrad = ctx.createLinearGradient(-8 * s, -6 * s, 8 * s, 9 * s);
  bodyGrad.addColorStop(0, '#FFE44D');
  bodyGrad.addColorStop(0.25, '#FFD700');
  bodyGrad.addColorStop(0.5, '#DAA520');
  bodyGrad.addColorStop(0.75, '#FFD700');
  bodyGrad.addColorStop(1, '#B8860B');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-7 * s, -5 * s);
  ctx.quadraticCurveTo(-8 * s, 2 * s, -6 * s, 8 * s);
  ctx.lineTo(6 * s, 8 * s);
  ctx.quadraticCurveTo(8 * s, 2 * s, 7 * s, -5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // ancient rune patterns on body (animated glow)
  const runeGlow = 0.5 + Math.sin(t * 4 + ph) * 0.3;
  ctx.strokeStyle = `rgba(255,255,200,${runeGlow})`;
  ctx.lineWidth = 0.7 * s;
  // central rune circle
  ctx.beginPath();
  ctx.arc(0, 1 * s, 3.5 * s, 0, Math.PI * 2);
  ctx.stroke();
  // rune lines radiating from center
  for (let ri = 0; ri < 6; ri++) {
    const angle = (ri / 6) * Math.PI * 2 + t * 0.5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 2 * s, 1 * s + Math.sin(angle) * 2 * s);
    ctx.lineTo(Math.cos(angle) * 4.5 * s, 1 * s + Math.sin(angle) * 4.5 * s);
    ctx.stroke();
  }
  // triangular rune marks
  ctx.beginPath();
  ctx.moveTo(-4 * s, -2 * s);
  ctx.lineTo(-3 * s, -4 * s);
  ctx.lineTo(-2 * s, -2 * s);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(2 * s, -2 * s);
  ctx.lineTo(3 * s, -4 * s);
  ctx.lineTo(4 * s, -2 * s);
  ctx.closePath();
  ctx.stroke();

  // arms - golden metal
  const armGrad = ctx.createLinearGradient(-12 * s, -3 * s, -6 * s, 4 * s);
  armGrad.addColorStop(0, '#FFD700');
  armGrad.addColorStop(0.5, '#DAA520');
  armGrad.addColorStop(1, '#B8860B');
  ctx.fillStyle = armGrad;
  ctx.save();
  ctx.rotate(Math.sin(t * 2 + ph) * 0.1);
  ctx.fillRect(-11 * s, -3 * s, 4 * s, 7 * s);
  // rune on left arm
  ctx.strokeStyle = `rgba(255,255,200,${runeGlow})`;
  ctx.lineWidth = 0.5 * s;
  ctx.beginPath();
  ctx.arc(-9 * s, 0, 1.5 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.rotate(-Math.sin(t * 2 + ph + 1) * 0.1);
  ctx.fillStyle = armGrad;
  ctx.fillRect(7 * s, -3 * s, 4 * s, 7 * s);
  // rune on right arm
  ctx.strokeStyle = `rgba(255,255,200,${runeGlow})`;
  ctx.lineWidth = 0.5 * s;
  ctx.beginPath();
  ctx.arc(9 * s, 0, 1.5 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // fists (glowing)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(-9 * s, 5 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(9 * s, 5 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();

  // head - angular golden helm
  const headGrad = ctx.createLinearGradient(-5 * s, -16 * s, 5 * s, -6 * s);
  headGrad.addColorStop(0, '#FFE44D');
  headGrad.addColorStop(0.3, '#FFD700');
  headGrad.addColorStop(0.7, '#DAA520');
  headGrad.addColorStop(1, '#B8860B');
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -5 * s);
  ctx.lineTo(-6 * s, -10 * s);
  ctx.quadraticCurveTo(-5 * s, -16 * s, 0, -17 * s);
  ctx.quadraticCurveTo(5 * s, -16 * s, 6 * s, -10 * s);
  ctx.lineTo(5 * s, -5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 0.7 * s;
  ctx.stroke();

  // angular visor / face plate
  ctx.fillStyle = '#B8860B';
  ctx.beginPath();
  ctx.moveTo(-4 * s, -8 * s);
  ctx.lineTo(0, -6 * s);
  ctx.lineTo(4 * s, -8 * s);
  ctx.lineTo(4 * s, -10 * s);
  ctx.lineTo(-4 * s, -10 * s);
  ctx.closePath();
  ctx.fill();

  // glowing eyes (bright white-gold)
  const eyePulse = 0.7 + Math.sin(t * 5) * 0.3;
  ctx.fillStyle = `rgba(255,255,220,${eyePulse})`;
  ctx.beginPath();
  ctx.ellipse(-2.5 * s, -9.5 * s, 1.5 * s, 0.8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(2.5 * s, -9.5 * s, 1.5 * s, 0.8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // eye glow trails
  ctx.strokeStyle = `rgba(255,255,180,${eyePulse * 0.4})`;
  ctx.lineWidth = 0.5 * s;
  ctx.beginPath();
  ctx.moveTo(-4 * s, -9.5 * s);
  ctx.lineTo(-6 * s, -10 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4 * s, -9.5 * s);
  ctx.lineTo(6 * s, -10 * s);
  ctx.stroke();

  // head crest (angular fin on top)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(-1 * s, -16 * s);
  ctx.lineTo(0, -21 * s);
  ctx.lineTo(1 * s, -16 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 0.5 * s;
  ctx.stroke();

  // rune on forehead
  ctx.strokeStyle = `rgba(255,255,200,${runeGlow})`;
  ctx.lineWidth = 0.6 * s;
  ctx.beginPath();
  ctx.moveTo(0, -14 * s);
  ctx.lineTo(-1.5 * s, -12 * s);
  ctx.lineTo(0, -11 * s);
  ctx.lineTo(1.5 * s, -12 * s);
  ctx.closePath();
  ctx.stroke();

  // floating energy particles around body
  for (let pi = 0; pi < 6; pi++) {
    const pAngle = (pi / 6) * Math.PI * 2 + t * 1.5;
    const pDist = (12 + Math.sin(t * 2 + pi * 1.5) * 3) * s;
    const px = Math.cos(pAngle) * pDist;
    const py = -2 * s + Math.sin(pAngle) * pDist * 0.6;
    const pAlpha = 0.4 + Math.sin(t * 3 + pi) * 0.3;
    ctx.fillStyle = `rgba(255,230,100,${pAlpha})`;
    ctx.beginPath();
    ctx.arc(px, py, 0.8 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
