// music.ts - Music-themed tower defense character renderers
// Canvas2D vector draw functions for 10 music (音楽) characters

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
/*  1. drawRhythmFighter  -  "リズムファイター"  (mus_01)               */
/*     Metronome body, boxing gloves, musical note accents             */
/* ------------------------------------------------------------------ */
export function drawRhythmFighter(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 8 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs with walking animation
  const legPhase = Math.sin(t * 4 + ph) * 3 * s;
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(-5 * s + legPhase, 9 * s, 3 * s, 5 * s);
  ctx.fillRect(2 * s - legPhase, 9 * s, 3 * s, 5 * s);
  // shoes
  ctx.fillStyle = darker(col, 100);
  ctx.fillRect(-6 * s + legPhase, 13 * s, 4.5 * s, 2 * s);
  ctx.fillRect(1.5 * s - legPhase, 13 * s, 4.5 * s, 2 * s);

  // metronome body (triangular/trapezoidal)
  const bodyGrad = ctx.createLinearGradient(-7 * s, -12 * s, 7 * s, 10 * s);
  bodyGrad.addColorStop(0, lighter(col, 40));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 40));
  ctx.beginPath();
  ctx.moveTo(-3 * s, -13 * s);
  ctx.lineTo(3 * s, -13 * s);
  ctx.lineTo(8 * s, 10 * s);
  ctx.lineTo(-8 * s, 10 * s);
  ctx.closePath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 1.2 * s;
  ctx.stroke();

  // metronome pendulum swinging
  const pendAngle = Math.sin(t * 5) * 0.4;
  ctx.save();
  ctx.rotate(pendAngle);
  ctx.strokeStyle = darker(col, 80);
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -12 * s);
  ctx.lineTo(0, 2 * s);
  ctx.stroke();
  // pendulum weight
  ctx.fillStyle = darker(col, 90);
  ctx.beginPath();
  ctx.arc(0, -4 * s, 2.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // face plate
  ctx.fillStyle = lighter(col, 60);
  ctx.beginPath();
  ctx.ellipse(0, 0, 4 * s, 3.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // eyes
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(-1.8 * s, -0.5 * s, 1.1 * s, 0, Math.PI * 2);
  ctx.arc(1.8 * s, -0.5 * s, 1.1 * s, 0, Math.PI * 2);
  ctx.fill();

  // boxing gloves (punching animation)
  const punchR = Math.sin(t * 6 + ph) * 4 * s;
  const punchL = Math.sin(t * 6 + ph + Math.PI) * 4 * s;

  // left glove
  ctx.fillStyle = "#d44";
  ctx.beginPath();
  ctx.arc(-10 * s - Math.max(0, punchL), -2 * s, 3.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#a22";
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();
  // arm
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(-7 * s, -1 * s);
  ctx.lineTo(-10 * s - Math.max(0, punchL), -2 * s);
  ctx.stroke();

  // right glove
  ctx.fillStyle = "#d44";
  ctx.beginPath();
  ctx.arc(10 * s + Math.max(0, punchR), -2 * s, 3.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#a22";
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();
  // arm
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(7 * s, -1 * s);
  ctx.lineTo(10 * s + Math.max(0, punchR), -2 * s);
  ctx.stroke();

  // musical note accent floating
  const noteY = -15 * s + Math.sin(t * 3) * 2 * s;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(5 * s, noteY, 1.5 * s, 1.2 * s, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = col;
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(6.2 * s, noteY);
  ctx.lineTo(6.2 * s, noteY - 4 * s);
  ctx.stroke();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  2. drawBassDrumGuard  -  "バスドラムガード"  (mus_02)               */
/*     Large bass drum as body/shield, drum skin face, drumstick legs  */
/* ------------------------------------------------------------------ */
export function drawBassDrumGuard(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // drumstick legs (angled outward like drumsticks)
  const legAnim = Math.sin(t * 3.5 + ph) * 2 * s;
  ctx.strokeStyle = "#c9a050";
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = "round";
  // left leg
  ctx.beginPath();
  ctx.moveTo(-4 * s, 8 * s);
  ctx.lineTo(-6 * s + legAnim, 14 * s);
  ctx.stroke();
  // right leg
  ctx.beginPath();
  ctx.moveTo(4 * s, 8 * s);
  ctx.lineTo(6 * s - legAnim, 14 * s);
  ctx.stroke();
  // drumstick tips (round)
  ctx.fillStyle = "#dbb060";
  ctx.beginPath();
  ctx.arc(-6 * s + legAnim, 14 * s, 1.8 * s, 0, Math.PI * 2);
  ctx.arc(6 * s - legAnim, 14 * s, 1.8 * s, 0, Math.PI * 2);
  ctx.fill();

  // bass drum body (large cylinder shown from front)
  const drumGrad = ctx.createRadialGradient(0, 0, 2 * s, 0, 0, 11 * s);
  drumGrad.addColorStop(0, lighter(col, 50));
  drumGrad.addColorStop(0.6, col);
  drumGrad.addColorStop(1, darker(col, 50));
  ctx.beginPath();
  ctx.arc(0, 0, 11 * s, 0, Math.PI * 2);
  ctx.fillStyle = drumGrad;
  ctx.fill();
  ctx.strokeStyle = darker(col, 70);
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();

  // drum rim - outer ring
  ctx.strokeStyle = "#c0a040";
  ctx.lineWidth = 1.8 * s;
  ctx.beginPath();
  ctx.arc(0, 0, 9.5 * s, 0, Math.PI * 2);
  ctx.stroke();

  // drum skin (lighter center)
  ctx.fillStyle = "rgba(255,245,220,0.35)";
  ctx.beginPath();
  ctx.arc(0, 0, 8 * s, 0, Math.PI * 2);
  ctx.fill();

  // drum skin vibration rings (animated)
  const vibAlpha = (Math.sin(t * 8) + 1) * 0.15;
  ctx.strokeStyle = `rgba(255,255,255,${vibAlpha})`;
  ctx.lineWidth = 0.6 * s;
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(0, 0, (2 + i * 2) * s, 0, Math.PI * 2);
    ctx.stroke();
  }

  // face on drum skin
  ctx.fillStyle = "#333";
  ctx.beginPath();
  ctx.arc(-2.5 * s, -1.5 * s, 1.3 * s, 0, Math.PI * 2);
  ctx.arc(2.5 * s, -1.5 * s, 1.3 * s, 0, Math.PI * 2);
  ctx.fill();
  // determined mouth
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(-2.5 * s, 2.5 * s);
  ctx.lineTo(2.5 * s, 2.5 * s);
  ctx.stroke();

  // small arms holding mini drumsticks
  const armSwing = Math.sin(t * 6) * 0.3;
  ctx.save();
  ctx.translate(-10 * s, -1 * s);
  ctx.rotate(-0.4 + armSwing);
  ctx.strokeStyle = "#c9a050";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-5 * s, -3 * s);
  ctx.stroke();
  ctx.fillStyle = "#dbb060";
  ctx.beginPath();
  ctx.arc(-5 * s, -3 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(10 * s, -1 * s);
  ctx.rotate(0.4 - armSwing);
  ctx.strokeStyle = "#c9a050";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(5 * s, -3 * s);
  ctx.stroke();
  ctx.fillStyle = "#dbb060";
  ctx.beginPath();
  ctx.arc(5 * s, -3 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  3. drawTrumpeter  -  "トランペッター"  (mus_03)                     */
/*     Trumpet-shaped body, bell opens forward, valves visible         */
/* ------------------------------------------------------------------ */
export function drawTrumpeter(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 8 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs
  const legOff = Math.sin(t * 3.5 + ph) * 2.5 * s;
  ctx.fillStyle = darker(col, 80);
  ctx.fillRect(-4 * s + legOff, 8 * s, 3 * s, 6 * s);
  ctx.fillRect(1 * s - legOff, 8 * s, 3 * s, 6 * s);
  ctx.fillStyle = darker(col, 100);
  ctx.fillRect(-5 * s + legOff, 13 * s, 4 * s, 2 * s);
  ctx.fillRect(0.5 * s - legOff, 13 * s, 4 * s, 2 * s);

  // trumpet body (horizontal tube curving up)
  const brassGrad = ctx.createLinearGradient(-8 * s, -8 * s, 8 * s, 8 * s);
  brassGrad.addColorStop(0, "#f0d060");
  brassGrad.addColorStop(0.3, lighter(col, 60));
  brassGrad.addColorStop(0.6, col);
  brassGrad.addColorStop(1, darker(col, 30));

  // main tube body (vertical oval)
  ctx.fillStyle = brassGrad;
  ctx.beginPath();
  ctx.ellipse(0, -1 * s, 6 * s, 10 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // bell (flared opening on top-right, facing forward)
  const bellGrad = ctx.createRadialGradient(6 * s, -6 * s, 1 * s, 6 * s, -6 * s, 7 * s);
  bellGrad.addColorStop(0, darker(col, 30));
  bellGrad.addColorStop(0.5, lighter(col, 30));
  bellGrad.addColorStop(1, "#f0d060");
  ctx.fillStyle = bellGrad;
  ctx.beginPath();
  ctx.ellipse(7 * s, -6 * s, 5 * s, 6 * s, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1 * s;
  ctx.stroke();
  // bell interior (dark)
  ctx.fillStyle = darker(col, 80);
  ctx.beginPath();
  ctx.ellipse(8 * s, -6 * s, 3 * s, 4 * s, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // sound waves from bell (animated)
  const waveAlpha = (Math.sin(t * 4) + 1) * 0.2;
  ctx.strokeStyle = `rgba(255,230,100,${waveAlpha})`;
  ctx.lineWidth = 0.7 * s;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(11 * s + i * 2 * s, -6 * s, (2 + i * 1.5) * s, -0.8, 0.8);
    ctx.stroke();
  }

  // valves (three pistons on the body)
  for (let i = 0; i < 3; i++) {
    const vy = -2 * s + i * 4 * s;
    const press = Math.sin(t * 5 + i * 1.2) > 0.5 ? 1 * s : 0;
    ctx.fillStyle = "#e0c040";
    ctx.beginPath();
    ctx.roundRect(-2 * s, vy - 1.2 * s + press, 4 * s, 2.4 * s, 1 * s);
    ctx.fill();
    ctx.strokeStyle = "#b09020";
    ctx.lineWidth = 0.6 * s;
    ctx.stroke();
    // valve cap
    ctx.fillStyle = "#d4b030";
    ctx.beginPath();
    ctx.arc(0, vy - 1.8 * s + press, 1.2 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // eyes on the tube
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(-2 * s, -6 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.arc(2 * s, -6 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  // highlight
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-1.5 * s, -6.5 * s, 0.4 * s, 0, Math.PI * 2);
  ctx.arc(2.5 * s, -6.5 * s, 0.4 * s, 0, Math.PI * 2);
  ctx.fill();

  // small arms
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-9 * s, 0, 3.5 * s, 2 * s);
  ctx.fillRect(5.5 * s, 0, 3.5 * s, 2 * s);

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  4. drawVioletString  -  "バイオレットストリング"  (mus_04)           */
/*     Violin body shape, bow as weapon, f-holes as eyes, strings      */
/* ------------------------------------------------------------------ */
export function drawVioletString(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 7 * s, 2 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs
  const legAnim = Math.sin(t * 3.5 + ph) * 2.5 * s;
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(-4 * s + legAnim, 9 * s, 3 * s, 5 * s);
  ctx.fillRect(1 * s - legAnim, 9 * s, 3 * s, 5 * s);
  ctx.fillStyle = darker(col, 90);
  ctx.fillRect(-5 * s + legAnim, 13 * s, 4 * s, 2 * s);
  ctx.fillRect(0.5 * s - legAnim, 13 * s, 4 * s, 2 * s);

  // violin body (hourglass/figure-8 shape)
  const woodGrad = ctx.createLinearGradient(-7 * s, -12 * s, 7 * s, 10 * s);
  woodGrad.addColorStop(0, lighter(col, 40));
  woodGrad.addColorStop(0.3, col);
  woodGrad.addColorStop(0.7, darker(col, 20));
  woodGrad.addColorStop(1, darker(col, 50));

  ctx.fillStyle = woodGrad;
  ctx.beginPath();
  // upper bout
  ctx.moveTo(0, -13 * s);
  ctx.bezierCurveTo(-6 * s, -13 * s, -8 * s, -8 * s, -5 * s, -4 * s);
  // waist (c-bout)
  ctx.bezierCurveTo(-3 * s, -1 * s, -3 * s, 1 * s, -5 * s, 3 * s);
  // lower bout
  ctx.bezierCurveTo(-9 * s, 7 * s, -7 * s, 10 * s, 0, 10 * s);
  ctx.bezierCurveTo(7 * s, 10 * s, 9 * s, 7 * s, 5 * s, 3 * s);
  // waist right
  ctx.bezierCurveTo(3 * s, 1 * s, 3 * s, -1 * s, 5 * s, -4 * s);
  // upper bout right
  ctx.bezierCurveTo(8 * s, -8 * s, 6 * s, -13 * s, 0, -13 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // f-holes as eyes (stylized)
  ctx.strokeStyle = darker(col, 80);
  ctx.lineWidth = 1.2 * s;
  ctx.lineCap = "round";
  // left f-hole
  ctx.beginPath();
  ctx.moveTo(-2.5 * s, -4 * s);
  ctx.bezierCurveTo(-3.5 * s, -2 * s, -1.5 * s, 0, -2.5 * s, 2 * s);
  ctx.stroke();
  // right f-hole
  ctx.beginPath();
  ctx.moveTo(2.5 * s, -4 * s);
  ctx.bezierCurveTo(3.5 * s, -2 * s, 1.5 * s, 0, 2.5 * s, 2 * s);
  ctx.stroke();
  // pupils in the f-holes
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(-2.5 * s, -2 * s, 0.9 * s, 0, Math.PI * 2);
  ctx.arc(2.5 * s, -2 * s, 0.9 * s, 0, Math.PI * 2);
  ctx.fill();

  // strings (4 strings)
  ctx.strokeStyle = "rgba(200,200,200,0.7)";
  ctx.lineWidth = 0.4 * s;
  const vibrate = Math.sin(t * 12) * 0.3 * s;
  for (let i = 0; i < 4; i++) {
    const sx = -2 * s + i * 1.3 * s;
    ctx.beginPath();
    ctx.moveTo(sx, -12 * s);
    ctx.quadraticCurveTo(sx + (i === 1 ? vibrate : -vibrate), -1 * s, sx, 9 * s);
    ctx.stroke();
  }

  // tailpiece
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(-2 * s, 7 * s, 4 * s, 2 * s);

  // bridge
  ctx.fillStyle = "#ddc080";
  ctx.fillRect(-2.5 * s, 3 * s, 5 * s, 1.2 * s);

  // neck/scroll at top
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(-1 * s, -15 * s, 2 * s, 3 * s);
  // scroll curl
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.arc(-1 * s, -16 * s, 1.5 * s, 0, Math.PI * 1.3);
  ctx.stroke();

  // bow held to the right as weapon
  const bowAngle = Math.sin(t * 3) * 0.15;
  ctx.save();
  ctx.translate(10 * s, -2 * s);
  ctx.rotate(bowAngle);
  // bow stick
  ctx.strokeStyle = "#b08040";
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(0, -10 * s);
  ctx.lineTo(0, 10 * s);
  ctx.stroke();
  // bow hair
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 0.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -9 * s);
  ctx.quadraticCurveTo(-2 * s, 0, 0, 9 * s);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  5. drawPianoForte  -  "ピアノフォート"  (mus_05)                    */
/*     Grand piano body, keyboard teeth/grin, heavy and wide           */
/* ------------------------------------------------------------------ */
export function drawPianoForte(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow (wide)
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 12 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // three sturdy legs (piano legs)
  const legAnim = Math.sin(t * 3 + ph) * 1.5 * s;
  ctx.fillStyle = darker(col, 80);
  // left leg
  ctx.beginPath();
  ctx.moveTo(-8 * s + legAnim, 7 * s);
  ctx.lineTo(-9 * s + legAnim, 14 * s);
  ctx.lineTo(-6 * s + legAnim, 14 * s);
  ctx.lineTo(-6 * s + legAnim, 7 * s);
  ctx.fill();
  // right leg
  ctx.beginPath();
  ctx.moveTo(6 * s - legAnim, 7 * s);
  ctx.lineTo(6 * s - legAnim, 14 * s);
  ctx.lineTo(9 * s - legAnim, 14 * s);
  ctx.lineTo(8 * s - legAnim, 7 * s);
  ctx.fill();
  // center leg
  ctx.fillRect(-1.5 * s, 7 * s, 3 * s, 7 * s);
  // leg feet (ornate)
  ctx.fillStyle = "#c0a040";
  ctx.beginPath();
  ctx.arc(-7.5 * s + legAnim, 14 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.arc(7.5 * s - legAnim, 14 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.arc(0, 14 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // grand piano body (large curved shape)
  const pianoGrad = ctx.createLinearGradient(-10 * s, -10 * s, 10 * s, 8 * s);
  pianoGrad.addColorStop(0, lighter(col, 30));
  pianoGrad.addColorStop(0.4, col);
  pianoGrad.addColorStop(1, darker(col, 50));
  ctx.fillStyle = pianoGrad;
  ctx.beginPath();
  ctx.moveTo(-10 * s, -3 * s);
  ctx.lineTo(-10 * s, 7 * s);
  ctx.lineTo(10 * s, 7 * s);
  ctx.lineTo(10 * s, -3 * s);
  ctx.bezierCurveTo(10 * s, -10 * s, 5 * s, -13 * s, -2 * s, -12 * s);
  ctx.bezierCurveTo(-7 * s, -11 * s, -10 * s, -9 * s, -10 * s, -3 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 1.2 * s;
  ctx.stroke();

  // lid (raised, with hinge animation)
  const lidAngle = Math.sin(t * 2) * 0.1 + 0.6;
  ctx.save();
  ctx.translate(-10 * s, -3 * s);
  ctx.rotate(-lidAngle);
  ctx.fillStyle = darker(col, 20);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(18 * s, 0);
  ctx.bezierCurveTo(18 * s, -6 * s, 12 * s, -9 * s, 5 * s, -8 * s);
  ctx.lineTo(0, -5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();
  ctx.restore();

  // keyboard (teeth grin) along bottom
  const keyY = 4 * s;
  ctx.fillStyle = "#fff";
  ctx.fillRect(-8 * s, keyY, 16 * s, 3 * s);
  // black keys
  ctx.fillStyle = "#222";
  const blackPos = [-6.5, -4, -1.5, 1, 3.5, 6];
  for (const bx of blackPos) {
    ctx.fillRect(bx * s, keyY, 1.2 * s, 2 * s);
  }
  // key press animation
  const pressIdx = Math.floor((t * 4) % blackPos.length);
  ctx.fillStyle = lighter(col, 60);
  ctx.fillRect(blackPos[pressIdx] * s, keyY, 1.2 * s, 2 * s);

  // eyes (above keyboard)
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(-3 * s, 0, 1.5 * s, 0, Math.PI * 2);
  ctx.arc(3 * s, 0, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // gleam
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-2.5 * s, -0.5 * s, 0.5 * s, 0, Math.PI * 2);
  ctx.arc(3.5 * s, -0.5 * s, 0.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // music stand / sheet on top
  ctx.fillStyle = "rgba(255,255,240,0.7)";
  ctx.fillRect(-3 * s, -10 * s, 6 * s, 4 * s);
  // tiny note marks on sheet
  ctx.fillStyle = "#444";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc((-1.5 + i * 1.5) * s, (-9 + Math.sin(t + i)) * s, 0.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  6. drawSymphonia  -  "シンフォニア"  (mus_06)                       */
/*     Conductor with baton, musical score floating, tuxedo silhouette */
/* ------------------------------------------------------------------ */
export function drawSymphonia(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 7 * s, 2 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs in formal trousers
  const legAnim = Math.sin(t * 3.5 + ph) * 2 * s;
  ctx.fillStyle = "#222";
  ctx.fillRect(-4 * s + legAnim, 6 * s, 3 * s, 7 * s);
  ctx.fillRect(1 * s - legAnim, 6 * s, 3 * s, 7 * s);
  // polished shoes
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.ellipse(-2.5 * s + legAnim, 13.5 * s, 2.5 * s, 1.2 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(2.5 * s - legAnim, 13.5 * s, 2.5 * s, 1.2 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // tuxedo body (tapered)
  const tuxGrad = ctx.createLinearGradient(-6 * s, -6 * s, 6 * s, 6 * s);
  tuxGrad.addColorStop(0, "#333");
  tuxGrad.addColorStop(0.5, "#222");
  tuxGrad.addColorStop(1, "#111");
  ctx.fillStyle = tuxGrad;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -4 * s);
  ctx.lineTo(-7 * s, 7 * s);
  ctx.lineTo(7 * s, 7 * s);
  ctx.lineTo(5 * s, -4 * s);
  ctx.closePath();
  ctx.fill();

  // tuxedo tails
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.moveTo(-5 * s, 4 * s);
  ctx.lineTo(-7 * s, 10 * s);
  ctx.lineTo(-4 * s, 7 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(5 * s, 4 * s);
  ctx.lineTo(7 * s, 10 * s);
  ctx.lineTo(4 * s, 7 * s);
  ctx.closePath();
  ctx.fill();

  // white shirt front
  ctx.fillStyle = "#eee";
  ctx.beginPath();
  ctx.moveTo(-1.5 * s, -4 * s);
  ctx.lineTo(-2 * s, 7 * s);
  ctx.lineTo(2 * s, 7 * s);
  ctx.lineTo(1.5 * s, -4 * s);
  ctx.closePath();
  ctx.fill();

  // bow tie
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(0, -4 * s);
  ctx.lineTo(-2 * s, -5 * s);
  ctx.lineTo(0, -3.5 * s);
  ctx.lineTo(2 * s, -5 * s);
  ctx.closePath();
  ctx.fill();

  // head
  ctx.fillStyle = lighter(col, 80);
  ctx.beginPath();
  ctx.arc(0, -8 * s, 4 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 0.7 * s;
  ctx.stroke();

  // eyes
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(-1.5 * s, -8.5 * s, 0.9 * s, 0, Math.PI * 2);
  ctx.arc(1.5 * s, -8.5 * s, 0.9 * s, 0, Math.PI * 2);
  ctx.fill();

  // confident smile
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 0.7 * s;
  ctx.beginPath();
  ctx.arc(0, -7 * s, 1.5 * s, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // baton arm (right, conducting motion)
  const batonAngle = Math.sin(t * 3) * 0.6;
  ctx.save();
  ctx.translate(5 * s, -3 * s);
  ctx.rotate(batonAngle - 0.8);
  // arm
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(6 * s, -4 * s);
  ctx.stroke();
  // hand
  ctx.fillStyle = lighter(col, 80);
  ctx.beginPath();
  ctx.arc(6 * s, -4 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  // baton
  ctx.strokeStyle = "#f0f0f0";
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(6 * s, -4 * s);
  ctx.lineTo(12 * s, -8 * s);
  ctx.stroke();
  // baton tip sparkle
  const sparkle = (Math.sin(t * 8) + 1) * 0.5;
  ctx.fillStyle = `rgba(255,255,200,${sparkle})`;
  ctx.beginPath();
  ctx.arc(12 * s, -8 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // left arm (resting)
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -2 * s);
  ctx.lineTo(-8 * s, 2 * s);
  ctx.stroke();

  // floating score pages
  for (let i = 0; i < 3; i++) {
    const angle = t * 1.5 + i * (Math.PI * 2 / 3);
    const fx = Math.cos(angle) * 8 * s;
    const fy = -5 * s + Math.sin(angle * 2) * 3 * s;
    ctx.fillStyle = `rgba(255,255,240,${0.4 + i * 0.1})`;
    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(Math.sin(t + i) * 0.3);
    ctx.fillRect(-2 * s, -1.5 * s, 4 * s, 3 * s);
    // staff lines on page
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 0.3 * s;
    for (let j = 0; j < 3; j++) {
      ctx.beginPath();
      ctx.moveTo(-1.5 * s, (-0.8 + j * 0.8) * s);
      ctx.lineTo(1.5 * s, (-0.8 + j * 0.8) * s);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  7. drawHarmonyGuard  -  "ハーモニーガード"  (mus_07)                */
/*     Pipe organ body (multiple pipes of varying height), massive     */
/* ------------------------------------------------------------------ */
export function drawHarmonyGuard(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // sturdy base/legs
  const legAnim = Math.sin(t * 3 + ph) * 1.5 * s;
  ctx.fillStyle = darker(col, 70);
  ctx.fillRect(-9 * s + legAnim * 0.5, 8 * s, 5 * s, 6 * s);
  ctx.fillRect(4 * s - legAnim * 0.5, 8 * s, 5 * s, 6 * s);
  ctx.fillStyle = darker(col, 90);
  ctx.fillRect(-10 * s + legAnim * 0.5, 13 * s, 6 * s, 2 * s);
  ctx.fillRect(3.5 * s - legAnim * 0.5, 13 * s, 6 * s, 2 * s);

  // organ base platform
  ctx.fillStyle = darker(col, 40);
  ctx.fillRect(-10 * s, 5 * s, 20 * s, 4 * s);
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 0.8 * s;
  ctx.strokeRect(-10 * s, 5 * s, 20 * s, 4 * s);

  // pipe organ pipes (varying heights, symmetrical)
  const pipeHeights = [-16, -20, -24, -22, -18, -24, -20, -16];
  const pipeWidth = 2.2 * s;
  const startX = -8.8 * s;

  for (let i = 0; i < pipeHeights.length; i++) {
    const px = startX + i * 2.5 * s;
    const py = pipeHeights[i] * s;
    const pipeH = (5 * s) - py;

    // pipe gradient (metallic)
    const pGrad = ctx.createLinearGradient(px, py, px + pipeWidth, py);
    pGrad.addColorStop(0, darker(col, 20));
    pGrad.addColorStop(0.3, lighter(col, 50));
    pGrad.addColorStop(0.7, col);
    pGrad.addColorStop(1, darker(col, 30));

    ctx.fillStyle = pGrad;
    ctx.fillRect(px, py, pipeWidth, pipeH);
    ctx.strokeStyle = darker(col, 50);
    ctx.lineWidth = 0.5 * s;
    ctx.strokeRect(px, py, pipeWidth, pipeH);

    // pipe top cap
    ctx.fillStyle = lighter(col, 40);
    ctx.beginPath();
    ctx.ellipse(px + pipeWidth / 2, py, pipeWidth / 2 + 0.3 * s, 1 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // sound emanation from pipes (animated)
    const emitPhase = Math.sin(t * 4 + i * 0.8);
    if (emitPhase > 0.5) {
      ctx.fillStyle = `rgba(255,255,200,${(emitPhase - 0.5) * 0.4})`;
      ctx.beginPath();
      ctx.arc(px + pipeWidth / 2, py - 2 * s, 1.5 * s, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // face on the base platform
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(-3 * s, 6.5 * s, 1.3 * s, 0, Math.PI * 2);
  ctx.arc(3 * s, 6.5 * s, 1.3 * s, 0, Math.PI * 2);
  ctx.fill();
  // stern mouth
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(-2.5 * s, 8 * s);
  ctx.lineTo(2.5 * s, 8 * s);
  ctx.stroke();

  // small arms from sides of base
  const armAngle = Math.sin(t * 2.5) * 0.2;
  ctx.save();
  ctx.translate(-10 * s, 6 * s);
  ctx.rotate(-0.3 + armAngle);
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-4 * s, -1 * s, 4 * s, 2.5 * s);
  ctx.restore();

  ctx.save();
  ctx.translate(10 * s, 6 * s);
  ctx.rotate(0.3 - armAngle);
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(0, -1 * s, 4 * s, 2.5 * s);
  ctx.restore();

  // ornamental cross-bar connecting pipes
  ctx.strokeStyle = "#c0a040";
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(-9 * s, -14 * s);
  ctx.lineTo(9 * s, -14 * s);
  ctx.stroke();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  8. drawMetronomeKnight  -  "メトロノームナイト"  (mus_08)           */
/*     Tall metronome body, swinging pendulum, armored, tick-tock      */
/* ------------------------------------------------------------------ */
export function drawMetronomeKnight(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 8 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // armored legs
  const legAnim = Math.sin(t * 3 + ph) * 2 * s;
  ctx.fillStyle = darker(col, 60);
  ctx.fillRect(-5 * s + legAnim, 8 * s, 3.5 * s, 6 * s);
  ctx.fillRect(1.5 * s - legAnim, 8 * s, 3.5 * s, 6 * s);
  // armored boots
  ctx.fillStyle = "#666";
  ctx.fillRect(-6 * s + legAnim, 13 * s, 5 * s, 2 * s);
  ctx.fillRect(1 * s - legAnim, 13 * s, 5 * s, 2 * s);

  // metronome body (tall pyramid/trapezoid) with armor plating
  const armorGrad = ctx.createLinearGradient(-7 * s, -14 * s, 7 * s, 10 * s);
  armorGrad.addColorStop(0, lighter(col, 30));
  armorGrad.addColorStop(0.3, col);
  armorGrad.addColorStop(0.7, darker(col, 30));
  armorGrad.addColorStop(1, darker(col, 60));

  ctx.fillStyle = armorGrad;
  ctx.beginPath();
  ctx.moveTo(-2 * s, -14 * s);
  ctx.lineTo(2 * s, -14 * s);
  ctx.lineTo(8 * s, 9 * s);
  ctx.lineTo(-8 * s, 9 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 70);
  ctx.lineWidth = 1.3 * s;
  ctx.stroke();

  // armor plate lines (horizontal)
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = 0.6 * s;
  for (let i = 0; i < 4; i++) {
    const ly = -8 * s + i * 5 * s;
    const halfW = 2.5 * s + ((ly + 14 * s) / (23 * s)) * 5.5 * s;
    ctx.beginPath();
    ctx.moveTo(-halfW, ly);
    ctx.lineTo(halfW, ly);
    ctx.stroke();
  }

  // face window (visor slit)
  ctx.fillStyle = darker(col, 80);
  ctx.beginPath();
  ctx.roundRect(-3.5 * s, -5 * s, 7 * s, 3 * s, 1 * s);
  ctx.fill();
  // glowing eyes behind visor
  const eyeGlow = (Math.sin(t * 4) + 1) * 0.3 + 0.4;
  ctx.fillStyle = `rgba(255,200,100,${eyeGlow})`;
  ctx.beginPath();
  ctx.arc(-1.5 * s, -3.5 * s, 1 * s, 0, Math.PI * 2);
  ctx.arc(1.5 * s, -3.5 * s, 1 * s, 0, Math.PI * 2);
  ctx.fill();

  // pendulum (swinging tick-tock)
  const pendAngle = Math.sin(t * 4) * 0.5;
  ctx.save();
  ctx.translate(0, 7 * s);
  ctx.rotate(pendAngle);
  // pendulum rod
  ctx.strokeStyle = "#c0a040";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -18 * s);
  ctx.stroke();
  // pendulum weight (shield-shaped)
  ctx.fillStyle = "#d4b840";
  ctx.beginPath();
  ctx.moveTo(-2.5 * s, -10 * s);
  ctx.lineTo(2.5 * s, -10 * s);
  ctx.lineTo(2.5 * s, -7 * s);
  ctx.lineTo(0, -5.5 * s);
  ctx.lineTo(-2.5 * s, -7 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#a08020";
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();
  ctx.restore();

  // arm stubs with gauntlets
  ctx.fillStyle = "#666";
  ctx.fillRect(-11 * s, -2 * s, 4 * s, 3 * s);
  ctx.fillRect(7 * s, -2 * s, 4 * s, 3 * s);

  // helmet crest at top
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(0, -17 * s);
  ctx.lineTo(-1.5 * s, -14 * s);
  ctx.lineTo(1.5 * s, -14 * s);
  ctx.closePath();
  ctx.fill();

  // tick-tock sparks
  const sparkSide = Math.sin(t * 4) > 0 ? 1 : -1;
  ctx.fillStyle = `rgba(255,220,100,${0.5 + Math.abs(Math.sin(t * 4)) * 0.3})`;
  ctx.beginPath();
  ctx.arc(sparkSide * 3 * s, -10 * s, 0.8 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  9. drawOperaArcher  -  "オペラアーチャー"  (mus_09)                 */
/*     Harp-shaped body used as bow, opera mask, musical arrow         */
/* ------------------------------------------------------------------ */
export function drawOperaArcher(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 7 * s, 2 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // elegant legs
  const legAnim = Math.sin(t * 3.5 + ph) * 2.5 * s;
  ctx.fillStyle = darker(col, 50);
  ctx.fillRect(-4 * s + legAnim, 7 * s, 2.5 * s, 7 * s);
  ctx.fillRect(1.5 * s - legAnim, 7 * s, 2.5 * s, 7 * s);
  // pointed shoes
  ctx.fillStyle = darker(col, 80);
  ctx.beginPath();
  ctx.moveTo(-5 * s + legAnim, 14 * s);
  ctx.lineTo(-7 * s + legAnim, 13 * s);
  ctx.lineTo(-1 * s + legAnim, 14 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(1 * s - legAnim, 14 * s);
  ctx.lineTo(7 * s - legAnim, 13 * s);
  ctx.lineTo(4 * s - legAnim, 14 * s);
  ctx.closePath();
  ctx.fill();

  // harp body (held to the right as a bow weapon)
  ctx.save();
  ctx.translate(4 * s, -2 * s);

  // harp frame (curved)
  const harpGrad = ctx.createLinearGradient(-3 * s, -12 * s, 5 * s, 8 * s);
  harpGrad.addColorStop(0, "#d4a840");
  harpGrad.addColorStop(0.5, "#e8c860");
  harpGrad.addColorStop(1, "#b08020");
  ctx.strokeStyle = harpGrad;
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(0, 8 * s);
  ctx.bezierCurveTo(-1 * s, 2 * s, 4 * s, -6 * s, 6 * s, -12 * s);
  ctx.stroke();

  // harp pillar (straight vertical)
  ctx.strokeStyle = "#c09830";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, 8 * s);
  ctx.lineTo(0, -10 * s);
  ctx.stroke();

  // harp neck (horizontal top)
  ctx.beginPath();
  ctx.moveTo(0, -10 * s);
  ctx.lineTo(6 * s, -12 * s);
  ctx.stroke();

  // harp strings
  ctx.strokeStyle = "rgba(255,255,220,0.6)";
  ctx.lineWidth = 0.4 * s;
  const strVib = Math.sin(t * 10) * 0.4 * s;
  for (let i = 0; i < 6; i++) {
    const topX = 1 * s + i * 1 * s;
    const topY = -10.3 * s - i * 0.3 * s;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(topX * 0.5 + (i % 2 === 0 ? strVib : -strVib), (topY + 8 * s) / 2, 0, 7 * s - i * 0.5 * s);
    ctx.stroke();
  }

  // loaded arrow (musical note arrow)
  const drawPhase = (Math.sin(t * 2) + 1) * 0.5;
  ctx.strokeStyle = col;
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(-2 * s * drawPhase, -1 * s);
  ctx.lineTo(6 * s, -1 * s);
  ctx.stroke();
  // arrowhead (note shape)
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(7 * s, -1 * s, 1.5 * s, 1 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // body (elegant torso)
  const bodyGrad = ctx.createLinearGradient(-5 * s, -6 * s, 5 * s, 7 * s);
  bodyGrad.addColorStop(0, lighter(col, 20));
  bodyGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-4 * s, -5 * s);
  ctx.lineTo(-5 * s, 7 * s);
  ctx.lineTo(5 * s, 7 * s);
  ctx.lineTo(4 * s, -5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // opera cape (flowing)
  const capeWave = Math.sin(t * 2.5) * 2 * s;
  ctx.fillStyle = darker(col, 40);
  ctx.beginPath();
  ctx.moveTo(-4 * s, -4 * s);
  ctx.bezierCurveTo(-8 * s, 0, -9 * s + capeWave, 5 * s, -7 * s + capeWave, 10 * s);
  ctx.lineTo(-5 * s, 7 * s);
  ctx.closePath();
  ctx.fill();

  // head
  ctx.fillStyle = lighter(col, 70);
  ctx.beginPath();
  ctx.arc(0, -8 * s, 3.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // opera mask (half mask)
  ctx.fillStyle = "#f0f0f0";
  ctx.beginPath();
  ctx.moveTo(-3.5 * s, -9 * s);
  ctx.lineTo(3.5 * s, -9 * s);
  ctx.lineTo(3.5 * s, -7.5 * s);
  ctx.lineTo(2 * s, -6.5 * s);
  ctx.lineTo(-2 * s, -6.5 * s);
  ctx.lineTo(-3.5 * s, -7.5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 0.5 * s;
  ctx.stroke();

  // eyes through mask
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.ellipse(-1.5 * s, -8.5 * s, 1.2 * s, 0.8 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(1.5 * s, -8.5 * s, 1.2 * s, 0.8 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // left arm (drawing the harp-bow)
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(-4 * s, -3 * s);
  ctx.lineTo(-6 * s, 0);
  ctx.stroke();
  ctx.fillStyle = lighter(col, 70);
  ctx.beginPath();
  ctx.arc(-6 * s, 0, 1 * s, 0, Math.PI * 2);
  ctx.fill();

  // feather plume on head
  ctx.strokeStyle = lighter(col, 40);
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(0, -11 * s);
  ctx.quadraticCurveTo(3 * s, -15 * s, 1 * s, -17 * s);
  ctx.stroke();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  10. drawStarConductor  -  "スターコンダクター"  (mus_10)            */
/*     Flamboyant conductor, sparkling baton, cape of musical staves   */
/* ------------------------------------------------------------------ */
export function drawStarConductor(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 14 * s, 9 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs with flamboyant boots
  const legAnim = Math.sin(t * 4 + ph) * 2.5 * s;
  ctx.fillStyle = "#222";
  ctx.fillRect(-4 * s + legAnim, 7 * s, 3 * s, 6 * s);
  ctx.fillRect(1 * s - legAnim, 7 * s, 3 * s, 6 * s);
  // star-studded boots
  ctx.fillStyle = darker(col, 30);
  ctx.beginPath();
  ctx.moveTo(-5.5 * s + legAnim, 13 * s);
  ctx.lineTo(-7 * s + legAnim, 12 * s);
  ctx.lineTo(-0.5 * s + legAnim, 13 * s);
  ctx.lineTo(-5.5 * s + legAnim, 14.5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0.5 * s - legAnim, 13 * s);
  ctx.lineTo(7 * s - legAnim, 12 * s);
  ctx.lineTo(4.5 * s - legAnim, 14.5 * s);
  ctx.lineTo(0.5 * s - legAnim, 13 * s);
  ctx.closePath();
  ctx.fill();

  // flowing cape (musical staves pattern)
  const capeWave1 = Math.sin(t * 2) * 3 * s;
  const capeWave2 = Math.sin(t * 2 + 1) * 3 * s;
  const capeGrad = ctx.createLinearGradient(-6 * s, -5 * s, -10 * s, 12 * s);
  capeGrad.addColorStop(0, col);
  capeGrad.addColorStop(0.5, darker(col, 30));
  capeGrad.addColorStop(1, darker(col, 60));
  ctx.fillStyle = capeGrad;
  ctx.beginPath();
  ctx.moveTo(-4 * s, -5 * s);
  ctx.bezierCurveTo(-9 * s, -2 * s, -12 * s + capeWave1, 5 * s, -10 * s + capeWave2, 13 * s);
  ctx.lineTo(-3 * s, 12 * s);
  ctx.bezierCurveTo(-5 * s, 8 * s, -8 * s + capeWave1, 3 * s, -5 * s, 7 * s);
  ctx.closePath();
  ctx.fill();
  // right side cape
  ctx.beginPath();
  ctx.moveTo(4 * s, -5 * s);
  ctx.bezierCurveTo(9 * s, -2 * s, 12 * s - capeWave1, 5 * s, 10 * s - capeWave2, 13 * s);
  ctx.lineTo(3 * s, 12 * s);
  ctx.bezierCurveTo(5 * s, 8 * s, 8 * s - capeWave1, 3 * s, 5 * s, 7 * s);
  ctx.closePath();
  ctx.fill();

  // stave lines on cape
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 0.4 * s;
  for (let i = 0; i < 4; i++) {
    const ly = 2 * s + i * 2.5 * s;
    ctx.beginPath();
    ctx.moveTo(-8 * s + capeWave1 * 0.3, ly);
    ctx.quadraticCurveTo(-6 * s, ly + capeWave1 * 0.2, -4 * s, ly);
    ctx.stroke();
  }

  // body (flashy vest)
  const vestGrad = ctx.createLinearGradient(-5 * s, -5 * s, 5 * s, 7 * s);
  vestGrad.addColorStop(0, lighter(col, 30));
  vestGrad.addColorStop(0.5, col);
  vestGrad.addColorStop(1, darker(col, 20));
  ctx.fillStyle = vestGrad;
  ctx.beginPath();
  ctx.moveTo(-5 * s, -5 * s);
  ctx.lineTo(-6 * s, 7 * s);
  ctx.lineTo(6 * s, 7 * s);
  ctx.lineTo(5 * s, -5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#ffd700";
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // gold buttons
  ctx.fillStyle = "#ffd700";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(0, (-2 + i * 3) * s, 0.8 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // epaulettes (gold shoulder tassels)
  ctx.fillStyle = "#ffd700";
  ctx.beginPath();
  ctx.ellipse(-5.5 * s, -4.5 * s, 2.5 * s, 1.5 * s, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(5.5 * s, -4.5 * s, 2.5 * s, 1.5 * s, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // head
  ctx.fillStyle = lighter(col, 70);
  ctx.beginPath();
  ctx.arc(0, -9 * s, 4 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darker(col, 20);
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();

  // top hat
  ctx.fillStyle = "#222";
  ctx.fillRect(-3.5 * s, -16 * s, 7 * s, 5 * s);
  // hat brim
  ctx.fillRect(-5 * s, -11.5 * s, 10 * s, 1.5 * s);
  // hat band (gold)
  ctx.fillStyle = "#ffd700";
  ctx.fillRect(-3.5 * s, -12 * s, 7 * s, 1 * s);
  // star on hat
  ctx.fillStyle = "#fff";
  const starX = 0, starY = -14 * s;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const method = i === 0 ? "moveTo" : "lineTo";
    ctx[method](starX + Math.cos(a) * 1.5 * s, starY + Math.sin(a) * 1.5 * s);
  }
  ctx.closePath();
  ctx.fill();

  // expressive eyes
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.ellipse(-1.5 * s, -9.5 * s, 1.2 * s, 1.4 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(1.5 * s, -9.5 * s, 1.2 * s, 1.4 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // star sparkle in eyes
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-1 * s, -10 * s, 0.5 * s, 0, Math.PI * 2);
  ctx.arc(2 * s, -10 * s, 0.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // big smile
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.arc(0, -8 * s, 2 * s, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // right arm with baton (grand conducting motion)
  const batonT = Math.sin(t * 3.5) * 0.7;
  ctx.save();
  ctx.translate(5 * s, -3 * s);
  ctx.rotate(batonT - 0.5);
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(7 * s, -5 * s);
  ctx.stroke();
  // hand
  ctx.fillStyle = lighter(col, 70);
  ctx.beginPath();
  ctx.arc(7 * s, -5 * s, 1.3 * s, 0, Math.PI * 2);
  ctx.fill();
  // sparkling baton
  ctx.strokeStyle = "#ffd700";
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(7 * s, -5 * s);
  ctx.lineTo(13 * s, -10 * s);
  ctx.stroke();

  // star trail from baton tip
  for (let i = 0; i < 4; i++) {
    const trailT = t * 3 + i * 0.5;
    const tx = 13 * s + Math.cos(trailT) * (2 + i) * s;
    const ty = -10 * s + Math.sin(trailT) * (2 + i) * s;
    const alpha = 0.7 - i * 0.15;
    const starSize = (1.2 - i * 0.2) * s;
    ctx.fillStyle = `rgba(255,215,0,${alpha})`;
    ctx.beginPath();
    for (let j = 0; j < 5; j++) {
      const a = (j * 4 * Math.PI) / 5 - Math.PI / 2 + trailT;
      const method = j === 0 ? "moveTo" : "lineTo";
      ctx[method](tx + Math.cos(a) * starSize, ty + Math.sin(a) * starSize);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // left arm (dramatic pose)
  ctx.save();
  ctx.translate(-5 * s, -3 * s);
  ctx.rotate(-batonT * 0.5 - 0.3);
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-6 * s, -3 * s);
  ctx.stroke();
  ctx.fillStyle = lighter(col, 70);
  ctx.beginPath();
  ctx.arc(-6 * s, -3 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
