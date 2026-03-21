// ============================================================
// nature.ts  -  Canvas2D draw functions for Nature (自然) series
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

// ========================  NATURE SERIES  ========================

/**
 * drawVineSoldier  -  "つるソルジャー"
 * id: "nat_01"  |  Vine/plant warrior with twisted vine body, leaf armor, thorns.
 */
export function drawVineSoldier(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // --- shadow ---
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.7, r * 0.5, r * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- legs (vine tendrils) ---
  const walk = Math.sin(ph) * 3 * s;
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = "round";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 3 * s, 4 * s);
    ctx.quadraticCurveTo(side * 5 * s, 8 * s + side * walk, side * 4 * s, 12 * s);
    ctx.stroke();
    // root foot
    ctx.beginPath();
    ctx.moveTo(side * 4 * s, 12 * s);
    ctx.lineTo(side * 6 * s, 12.5 * s);
    ctx.stroke();
  }

  // --- twisted vine body ---
  const bodyGrad = ctx.createLinearGradient(-4 * s, -10 * s, 4 * s, 6 * s);
  bodyGrad.addColorStop(0, lighter(col, 30));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 50));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  // twisted vine torso
  ctx.moveTo(-4 * s, 4 * s);
  ctx.bezierCurveTo(-6 * s, -2 * s, -3 * s, -6 * s, -2 * s, -10 * s);
  ctx.lineTo(2 * s, -10 * s);
  ctx.bezierCurveTo(3 * s, -6 * s, 6 * s, -2 * s, 4 * s, 4 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // vine spiral detail on body
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 0.8 * s;
  for (let i = 0; i < 4; i++) {
    const yy = -6 * s + i * 3 * s;
    const twist = Math.sin(t * 2 + i) * 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(-3 * s + twist, yy);
    ctx.quadraticCurveTo(0, yy - 1.5 * s, 3 * s + twist, yy);
    ctx.stroke();
  }

  // --- thorns along body edges ---
  ctx.fillStyle = darker(col, 70);
  for (let i = 0; i < 5; i++) {
    const ty = -8 * s + i * 3 * s;
    const sway = Math.sin(t * 1.5 + i) * 0.5 * s;
    for (const side of [-1, 1]) {
      const tx = side * (4 + Math.sin(i) * 1) * s + sway;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx + side * 2 * s, ty - 1 * s);
      ctx.lineTo(tx + side * 0.5 * s, ty + 1 * s);
      ctx.closePath();
      ctx.fill();
    }
  }

  // --- leaf armor (shoulder pads) ---
  for (const side of [-1, 1]) {
    const lx = side * 5 * s;
    const ly = -6 * s;
    const leafSway = Math.sin(t * 2.5 + side) * 2 * s;
    const leafGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, 5 * s);
    leafGrad.addColorStop(0, lighter(col, 50));
    leafGrad.addColorStop(1, col);
    ctx.fillStyle = leafGrad;
    ctx.beginPath();
    ctx.moveTo(lx, ly - 4 * s);
    ctx.quadraticCurveTo(lx + side * 5 * s + leafSway, ly - 1 * s, lx + side * 1 * s, ly + 3 * s);
    ctx.quadraticCurveTo(lx - side * 1 * s, ly, lx, ly - 4 * s);
    ctx.fill();
    // leaf vein
    ctx.strokeStyle = darker(col, 30);
    ctx.lineWidth = 0.6 * s;
    ctx.beginPath();
    ctx.moveTo(lx, ly - 3 * s);
    ctx.lineTo(lx + side * 1.5 * s, ly + 1 * s);
    ctx.stroke();
  }

  // --- head (small vine bud) ---
  const headGrad = ctx.createRadialGradient(-1 * s, -12 * s, 0, 0, -11 * s, 4 * s);
  headGrad.addColorStop(0, lighter(col, 60));
  headGrad.addColorStop(1, col);
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(0, -12 * s, 3.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // --- eyes (fierce) ---
  for (const side of [-1, 1]) {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(side * 1.5 * s, -12.5 * s, 1.2 * s, 0.9 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(side * 1.8 * s, -12.5 * s, 0.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- vine sword (right hand) ---
  ctx.save();
  ctx.translate(5 * s, -2 * s);
  ctx.rotate(-0.3 + Math.sin(t * 2.5) * 0.1);
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 2 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(2 * s, -5 * s, 1 * s, -10 * s);
  ctx.stroke();
  // thorn tip
  ctx.fillStyle = darker(col, 80);
  ctx.beginPath();
  ctx.moveTo(1 * s, -10 * s);
  ctx.lineTo(2.5 * s, -12 * s);
  ctx.lineTo(0, -11 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/**
 * drawLeafShield  -  "リーフシールド"
 * id: "nat_02"  |  Large leaf-shaped shield character, thick trunk body.
 */
export function drawLeafShield(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // --- shadow ---
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.7, r * 0.55, r * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- stumpy legs ---
  const walk = Math.sin(ph) * 2 * s;
  for (const side of [-1, 1]) {
    const legGrad = ctx.createLinearGradient(side * 3 * s, 5 * s, side * 3 * s, 12 * s);
    legGrad.addColorStop(0, "#8b6914");
    legGrad.addColorStop(1, "#5c4a10");
    ctx.fillStyle = legGrad;
    ctx.beginPath();
    ctx.roundRect(
      side * 2 * s - 2 * s, 5 * s + side * walk,
      4 * s, 7 * s, 1.5 * s,
    );
    ctx.fill();
  }

  // --- thick trunk body ---
  const trunkGrad = ctx.createLinearGradient(-5 * s, -4 * s, 5 * s, 6 * s);
  trunkGrad.addColorStop(0, "#a07830");
  trunkGrad.addColorStop(0.5, "#8b6914");
  trunkGrad.addColorStop(1, "#6b4e10");
  ctx.fillStyle = trunkGrad;
  ctx.beginPath();
  ctx.roundRect(-5 * s, -4 * s, 10 * s, 10 * s, 2 * s);
  ctx.fill();
  ctx.strokeStyle = "#5c3a08";
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // bark lines on trunk
  ctx.strokeStyle = "rgba(60,30,0,0.3)";
  ctx.lineWidth = 0.7 * s;
  for (let i = 0; i < 3; i++) {
    const by = -2 * s + i * 3 * s;
    ctx.beginPath();
    ctx.moveTo(-4 * s, by);
    ctx.lineTo(4 * s, by + 1 * s);
    ctx.stroke();
  }

  // --- giant leaf shield (front) ---
  const shieldSway = Math.sin(t * 1.8) * 1.5 * s;
  const shieldGrad = ctx.createRadialGradient(
    -1 * s + shieldSway, -2 * s, 2 * s,
    0, -2 * s, 12 * s,
  );
  shieldGrad.addColorStop(0, lighter(col, 60));
  shieldGrad.addColorStop(0.5, col);
  shieldGrad.addColorStop(1, darker(col, 50));
  ctx.fillStyle = shieldGrad;
  ctx.beginPath();
  ctx.moveTo(0, -14 * s);
  ctx.bezierCurveTo(-10 * s + shieldSway, -10 * s, -12 * s, -2 * s, -8 * s, 6 * s);
  ctx.quadraticCurveTo(-4 * s, 10 * s, 0, 8 * s);
  ctx.quadraticCurveTo(4 * s, 10 * s, 8 * s, 6 * s);
  ctx.bezierCurveTo(12 * s, -2 * s, 10 * s - shieldSway, -10 * s, 0, -14 * s);
  ctx.fill();
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = 1.2 * s;
  ctx.stroke();

  // leaf veins on shield
  ctx.strokeStyle = darker(col, 25);
  ctx.lineWidth = 0.8 * s;
  // central vein
  ctx.beginPath();
  ctx.moveTo(0, -12 * s);
  ctx.lineTo(0, 7 * s);
  ctx.stroke();
  // side veins
  for (let i = 0; i < 4; i++) {
    const vy = -8 * s + i * 4 * s;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, vy);
      ctx.quadraticCurveTo(side * 4 * s, vy - 1 * s, side * 7 * s, vy + 2 * s);
      ctx.stroke();
    }
  }

  // --- eyes peeking over shield ---
  const eyeY = -6 * s;
  for (const side of [-1, 1]) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(side * 3 * s, eyeY, 2 * s, 1.5 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2d1a00";
    ctx.beginPath();
    ctx.arc(side * 3.3 * s, eyeY, 0.8 * s, 0, Math.PI * 2);
    ctx.fill();
    // highlight
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(side * 3 * s, eyeY - 0.4 * s, 0.3 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- dew drop highlight on shield ---
  const dewY = -3 * s + Math.sin(t * 3) * 1 * s;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.ellipse(3 * s, dewY, 1.5 * s, 2 * s, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * drawWoodArcher  -  "ウッドアーチャー"
 * id: "nat_03"  |  Tree branch bow, bark body, acorn quiver on back.
 */
export function drawWoodArcher(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // --- shadow ---
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.7, r * 0.45, r * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- legs (wooden stilts) ---
  const walk = Math.sin(ph) * 2.5 * s;
  for (const side of [-1, 1]) {
    ctx.fillStyle = darker(col, 40);
    ctx.beginPath();
    ctx.roundRect(
      side * 2 * s - 1.5 * s, 3 * s + side * walk,
      3 * s, 9 * s, 1 * s,
    );
    ctx.fill();
    // knot detail on leg
    ctx.fillStyle = darker(col, 60);
    ctx.beginPath();
    ctx.ellipse(side * 2 * s, 7 * s + side * walk, 1 * s, 0.7 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- bark-textured body ---
  const bodyGrad = ctx.createLinearGradient(-5 * s, -8 * s, 5 * s, 4 * s);
  bodyGrad.addColorStop(0, lighter(col, 20));
  bodyGrad.addColorStop(0.4, col);
  bodyGrad.addColorStop(1, darker(col, 45));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-4 * s, 4 * s);
  ctx.lineTo(-5 * s, -4 * s);
  ctx.quadraticCurveTo(-3 * s, -8 * s, 0, -9 * s);
  ctx.quadraticCurveTo(3 * s, -8 * s, 5 * s, -4 * s);
  ctx.lineTo(4 * s, 4 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 55);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // bark texture lines
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 0.6 * s;
  for (let i = 0; i < 5; i++) {
    const by = -6 * s + i * 2.5 * s;
    ctx.beginPath();
    ctx.moveTo(-3 * s, by);
    ctx.bezierCurveTo(-1 * s, by - 0.5 * s, 1 * s, by + 0.5 * s, 3 * s, by);
    ctx.stroke();
  }

  // --- acorn quiver on back ---
  ctx.fillStyle = "#8b6914";
  ctx.beginPath();
  ctx.roundRect(-7 * s, -7 * s, 3 * s, 8 * s, 1 * s);
  ctx.fill();
  ctx.strokeStyle = "#5c3a08";
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();
  // acorn tips poking out
  for (let i = 0; i < 3; i++) {
    const ay = -8.5 * s + i * 0.8 * s;
    const ax = -6.2 * s + i * 0.6 * s;
    ctx.fillStyle = "#c8874a";
    ctx.beginPath();
    ctx.ellipse(ax, ay, 1 * s, 1.3 * s, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // acorn cap
    ctx.fillStyle = "#6b4e10";
    ctx.beginPath();
    ctx.arc(ax, ay - 1 * s, 1 * s, Math.PI, 0);
    ctx.fill();
  }

  // --- head ---
  const headGrad = ctx.createRadialGradient(-0.5 * s, -11 * s, 0, 0, -10.5 * s, 3.5 * s);
  headGrad.addColorStop(0, lighter(col, 40));
  headGrad.addColorStop(1, darker(col, 20));
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(0, -11 * s, 3.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // leaf cap on head
  ctx.fillStyle = lighter(col, 30);
  ctx.beginPath();
  ctx.moveTo(-3 * s, -13 * s);
  ctx.quadraticCurveTo(0, -16 * s, 3 * s, -13 * s);
  ctx.quadraticCurveTo(0, -12 * s, -3 * s, -13 * s);
  ctx.fill();

  // --- eyes (focused, archer) ---
  for (const side of [-1, 1]) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(side * 1.5 * s, -11.5 * s, 1.2 * s, 1 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(side * 1.8 * s, -11.5 * s, 0.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- branch bow (right side) ---
  ctx.save();
  ctx.translate(6 * s, -3 * s);
  ctx.rotate(0.1 + Math.sin(t * 2) * 0.06);
  // bow limb (curved branch)
  ctx.strokeStyle = "#7a5c2e";
  ctx.lineWidth = 1.8 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -8 * s);
  ctx.quadraticCurveTo(4 * s, 0, 0, 8 * s);
  ctx.stroke();
  // small twig on bow
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(2 * s, -3 * s);
  ctx.lineTo(4 * s, -5 * s);
  ctx.stroke();
  // bowstring
  ctx.strokeStyle = "#d4c89a";
  ctx.lineWidth = 0.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -8 * s);
  ctx.lineTo(0, 8 * s);
  ctx.stroke();
  // arrow nocked
  const drawPull = Math.sin(t * 1.5) * 1.5 * s;
  ctx.strokeStyle = "#8b6914";
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(-3 * s - drawPull, 0);
  ctx.lineTo(5 * s, 0);
  ctx.stroke();
  // arrowhead
  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.moveTo(5 * s, 0);
  ctx.lineTo(6.5 * s, -0.8 * s);
  ctx.lineTo(6.5 * s, 0.8 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/**
 * drawBindHound  -  "バインドハウンド"
 * id: "nat_04"  |  Wolf/dog made of vines and roots, fast predator shape.
 */
export function drawBindHound(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // --- shadow ---
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.55, r * 0.65, r * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- four vine legs (running gait) ---
  const gait = Math.sin(ph) * 3 * s;
  const gait2 = Math.sin(ph + Math.PI) * 3 * s;
  ctx.strokeStyle = darker(col, 40);
  ctx.lineWidth = 2 * s;
  ctx.lineCap = "round";
  // front legs
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(-5 * s + side * 1.5 * s, 1 * s);
    ctx.quadraticCurveTo(-5 * s + side * 2 * s, 5 * s + gait, -4 * s + side * 2 * s, 9 * s);
    ctx.stroke();
  }
  // back legs
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(5 * s + side * 1.5 * s, 1 * s);
    ctx.quadraticCurveTo(5 * s + side * 2 * s, 5 * s + gait2, 6 * s + side * 2 * s, 9 * s);
    ctx.stroke();
  }

  // --- vine body (horizontal, beast-like) ---
  const bodyGrad = ctx.createLinearGradient(-9 * s, -3 * s, 9 * s, 3 * s);
  bodyGrad.addColorStop(0, lighter(col, 25));
  bodyGrad.addColorStop(0.5, col);
  bodyGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-9 * s, -1 * s);
  ctx.bezierCurveTo(-7 * s, -6 * s, -2 * s, -5 * s, 0, -4 * s);
  ctx.bezierCurveTo(2 * s, -5 * s, 7 * s, -6 * s, 9 * s, -1 * s);
  ctx.bezierCurveTo(8 * s, 3 * s, 3 * s, 3 * s, 0, 2 * s);
  ctx.bezierCurveTo(-3 * s, 3 * s, -8 * s, 3 * s, -9 * s, -1 * s);
  ctx.fill();
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // vine wrapping detail on body
  ctx.strokeStyle = darker(col, 25);
  ctx.lineWidth = 0.6 * s;
  for (let i = 0; i < 5; i++) {
    const vx = -6 * s + i * 3 * s;
    ctx.beginPath();
    ctx.moveTo(vx, -4 * s);
    ctx.quadraticCurveTo(vx + 1 * s, 0, vx, 2 * s);
    ctx.stroke();
  }

  // --- wolf head (front, left side) ---
  ctx.save();
  ctx.translate(-10 * s, -3 * s);
  const headSway = Math.sin(t * 2.5) * 0.08;
  ctx.rotate(headSway);
  // snout
  const snoutGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 5 * s);
  snoutGrad.addColorStop(0, lighter(col, 40));
  snoutGrad.addColorStop(1, col);
  ctx.fillStyle = snoutGrad;
  ctx.beginPath();
  ctx.moveTo(3 * s, -2.5 * s);
  ctx.bezierCurveTo(1 * s, -5 * s, -3 * s, -4 * s, -5 * s, -1 * s);
  ctx.bezierCurveTo(-5 * s, 2 * s, -2 * s, 4 * s, 1 * s, 3 * s);
  ctx.lineTo(3 * s, 2.5 * s);
  ctx.closePath();
  ctx.fill();
  // ears (pointed, vine-like)
  for (const ey of [-1, 1]) {
    ctx.fillStyle = darker(col, 20);
    ctx.beginPath();
    ctx.moveTo(-1 * s, ey * 2.5 * s);
    ctx.lineTo(-4 * s, ey * 5 * s);
    ctx.lineTo(0, ey * 3.5 * s);
    ctx.closePath();
    ctx.fill();
  }
  // glowing eyes
  const eyeGlow = 0.6 + Math.sin(t * 4) * 0.3;
  ctx.fillStyle = `rgba(255,220,50,${eyeGlow})`;
  ctx.shadowColor = "#ffdd33";
  ctx.shadowBlur = 4 * s;
  for (const ey of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(-2 * s, ey * 1.5 * s, 1 * s, 0.7 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  // nose
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.ellipse(-4.5 * s, -0.2 * s, 0.8 * s, 0.6 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- vine tail (whip-like) ---
  const tailWag = Math.sin(t * 3 + ph) * 4 * s;
  ctx.strokeStyle = darker(col, 20);
  ctx.lineWidth = 1.8 * s;
  ctx.beginPath();
  ctx.moveTo(9 * s, -1 * s);
  ctx.bezierCurveTo(12 * s, -3 * s, 13 * s + tailWag, -6 * s, 11 * s + tailWag, -8 * s);
  ctx.stroke();
  // leaf at tail tip
  ctx.fillStyle = lighter(col, 20);
  ctx.beginPath();
  ctx.ellipse(11 * s + tailWag, -8.5 * s, 1.5 * s, 1 * s, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * drawMossKnight  -  "モスナイト"
 * id: "nat_05"  |  Boulder body covered in moss, sturdy stance, rock armor.
 */
export function drawMossKnight(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // --- shadow ---
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.65, r * 0.6, r * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- heavy legs (short and thick) ---
  const stomp = Math.sin(ph) * 1.5 * s;
  for (const side of [-1, 1]) {
    const legGrad = ctx.createLinearGradient(side * 4 * s, 4 * s, side * 4 * s, 11 * s);
    legGrad.addColorStop(0, "#888");
    legGrad.addColorStop(1, "#555");
    ctx.fillStyle = legGrad;
    ctx.beginPath();
    ctx.roundRect(
      side * 2.5 * s - 2.5 * s, 4 * s + side * stomp,
      5 * s, 7 * s, 1.5 * s,
    );
    ctx.fill();
    // moss patch on leg
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(side * 3.5 * s, 7 * s + side * stomp, 2 * s, 1.2 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- boulder body ---
  const rockGrad = ctx.createRadialGradient(-2 * s, -4 * s, 1 * s, 0, -2 * s, 11 * s);
  rockGrad.addColorStop(0, "#aaa");
  rockGrad.addColorStop(0.4, "#888");
  rockGrad.addColorStop(1, "#555");
  ctx.fillStyle = rockGrad;
  ctx.beginPath();
  // irregular boulder shape
  ctx.moveTo(-7 * s, 3 * s);
  ctx.lineTo(-9 * s, -2 * s);
  ctx.lineTo(-7 * s, -7 * s);
  ctx.lineTo(-2 * s, -10 * s);
  ctx.lineTo(3 * s, -10 * s);
  ctx.lineTo(8 * s, -7 * s);
  ctx.lineTo(9 * s, -1 * s);
  ctx.lineTo(7 * s, 4 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // rock crack lines
  ctx.strokeStyle = "rgba(50,50,50,0.4)";
  ctx.lineWidth = 0.7 * s;
  ctx.beginPath();
  ctx.moveTo(-3 * s, -9 * s);
  ctx.lineTo(-1 * s, -3 * s);
  ctx.lineTo(2 * s, 2 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(5 * s, -8 * s);
  ctx.lineTo(3 * s, -4 * s);
  ctx.stroke();

  // --- moss patches on boulder ---
  const mossSpots = [
    { x: -5, y: -5, rx: 3.5, ry: 2 },
    { x: 2, y: -7, rx: 3, ry: 1.8 },
    { x: 4, y: -1, rx: 2.5, ry: 2.2 },
    { x: -3, y: 1, rx: 2.8, ry: 1.5 },
    { x: 0, y: -3, rx: 2, ry: 1.5 },
  ];
  for (const spot of mossSpots) {
    const mossGrad = ctx.createRadialGradient(
      spot.x * s, spot.y * s, 0,
      spot.x * s, spot.y * s, spot.rx * s,
    );
    mossGrad.addColorStop(0, lighter(col, 20));
    mossGrad.addColorStop(0.6, col);
    mossGrad.addColorStop(1, darker(col, 30));
    ctx.fillStyle = mossGrad;
    ctx.beginPath();
    ctx.ellipse(spot.x * s, spot.y * s, spot.rx * s, spot.ry * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- tiny moss fuzzy dots (animated growth) ---
  ctx.fillStyle = lighter(col, 40);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + t * 0.3;
    const dist = (5 + Math.sin(t + i * 1.7) * 1.5) * s;
    const mx = Math.cos(angle) * dist;
    const my = Math.sin(angle) * dist * 0.7 - 3 * s;
    const msize = (0.5 + Math.sin(t * 2 + i) * 0.3) * s;
    ctx.beginPath();
    ctx.arc(mx, my, msize, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- eyes (determined, slit in rock) ---
  for (const side of [-1, 1]) {
    // eye socket (dark crack)
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.ellipse(side * 3 * s, -5 * s, 2 * s, 1.3 * s, side * 0.15, 0, Math.PI * 2);
    ctx.fill();
    // glowing eye
    ctx.fillStyle = lighter(col, 80);
    ctx.beginPath();
    ctx.ellipse(side * 3 * s, -5 * s, 1.3 * s, 0.8 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a3a00";
    ctx.beginPath();
    ctx.ellipse(side * 3.2 * s, -5 * s, 0.5 * s, 0.7 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- stone fist arms ---
  for (const side of [-1, 1]) {
    const armSwing = Math.sin(t * 1.5 + side) * 0.15;
    ctx.save();
    ctx.translate(side * 8 * s, -2 * s);
    ctx.rotate(armSwing);
    ctx.fillStyle = "#777";
    ctx.beginPath();
    ctx.roundRect(-2 * s, -1.5 * s, 4 * s, 7 * s, 1.5 * s);
    ctx.fill();
    // moss on fist
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, 1 * s, 1.5 * s, 1 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * drawSeedMage  -  "シードメイジ"
 * id: "nat_06"  |  Flower bud body, floating seeds as magic, petal wizard hat.
 */
export function drawSeedMage(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // --- shadow ---
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.65, r * 0.4, r * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- small floating legs (hovering slightly) ---
  const hover = Math.sin(t * 2.5) * 1.5 * s;
  const walk = Math.sin(ph) * 2 * s;
  for (const side of [-1, 1]) {
    ctx.fillStyle = darker(col, 30);
    ctx.beginPath();
    ctx.ellipse(
      side * 2.5 * s, 8 * s + hover + side * walk,
      1.5 * s, 2.5 * s, side * 0.2, 0, Math.PI * 2,
    );
    ctx.fill();
  }

  // --- seed pod body (teardrop shape) ---
  const podGrad = ctx.createRadialGradient(-1 * s, -2 * s + hover, 1 * s, 0, 0 + hover, 8 * s);
  podGrad.addColorStop(0, lighter(col, 50));
  podGrad.addColorStop(0.5, col);
  podGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = podGrad;
  ctx.beginPath();
  ctx.moveTo(0, -8 * s + hover);
  ctx.bezierCurveTo(-7 * s, -4 * s + hover, -6 * s, 5 * s + hover, 0, 6 * s + hover);
  ctx.bezierCurveTo(6 * s, 5 * s + hover, 7 * s, -4 * s + hover, 0, -8 * s + hover);
  ctx.fill();
  ctx.strokeStyle = darker(col, 35);
  ctx.lineWidth = 0.8 * s;
  ctx.stroke();

  // seed line patterns on body
  ctx.strokeStyle = darker(col, 20);
  ctx.lineWidth = 0.5 * s;
  for (let i = 0; i < 4; i++) {
    const sy = -5 * s + i * 3 * s + hover;
    ctx.beginPath();
    ctx.moveTo(-3 * s, sy);
    ctx.quadraticCurveTo(0, sy - 1 * s, 3 * s, sy);
    ctx.stroke();
  }

  // --- petal wizard hat ---
  const hatBob = hover;
  // hat base (ring of petals)
  const petalCount = 6;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2 + t * 0.4;
    const px = Math.cos(angle) * 5 * s;
    const py = -9 * s + Math.sin(angle) * 1.5 * s + hatBob;
    ctx.fillStyle = i % 2 === 0 ? lighter(col, 60) : lighter(col, 35);
    ctx.beginPath();
    ctx.ellipse(px, py, 2.5 * s, 1.5 * s, angle, 0, Math.PI * 2);
    ctx.fill();
  }
  // hat cone (bud tip)
  const hatGrad = ctx.createLinearGradient(0, -9 * s + hatBob, 0, -16 * s + hatBob);
  hatGrad.addColorStop(0, col);
  hatGrad.addColorStop(1, lighter(col, 50));
  ctx.fillStyle = hatGrad;
  ctx.beginPath();
  ctx.moveTo(-3.5 * s, -9 * s + hatBob);
  ctx.quadraticCurveTo(-1 * s, -14 * s + hatBob, 0, -17 * s + hatBob);
  ctx.quadraticCurveTo(1 * s, -14 * s + hatBob, 3.5 * s, -9 * s + hatBob);
  ctx.closePath();
  ctx.fill();
  // star tip
  ctx.fillStyle = "#fffacd";
  ctx.beginPath();
  ctx.arc(0, -17 * s + hatBob, 1 * s, 0, Math.PI * 2);
  ctx.fill();

  // --- cute eyes ---
  for (const side of [-1, 1]) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(side * 2 * s, -3 * s + hover, 1.5 * s, 1.8 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2a1a00";
    ctx.beginPath();
    ctx.arc(side * 2.2 * s, -2.8 * s + hover, 0.8 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(side * 1.8 * s, -3.3 * s + hover, 0.3 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- floating magic seeds (orbiting) ---
  for (let i = 0; i < 5; i++) {
    const seedAngle = t * 1.5 + (i / 5) * Math.PI * 2;
    const dist = (8 + Math.sin(t + i * 2) * 2) * s;
    const sx = Math.cos(seedAngle) * dist;
    const sy = Math.sin(seedAngle) * dist * 0.5 - 2 * s + hover;
    const seedSize = (1 + Math.sin(t * 3 + i) * 0.4) * s;
    // glow
    ctx.fillStyle = `rgba(255,255,200,${0.3 + Math.sin(t * 2 + i) * 0.15})`;
    ctx.beginPath();
    ctx.arc(sx, sy, seedSize * 2, 0, Math.PI * 2);
    ctx.fill();
    // seed
    ctx.fillStyle = "#fffacd";
    ctx.beginPath();
    ctx.ellipse(sx, sy, seedSize, seedSize * 0.6, seedAngle, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- small staff (left side) ---
  ctx.save();
  ctx.translate(-6 * s, 0 + hover);
  ctx.rotate(-0.15 + Math.sin(t * 1.8) * 0.08);
  ctx.strokeStyle = "#8b6914";
  ctx.lineWidth = 1.5 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -5 * s);
  ctx.lineTo(0, 7 * s);
  ctx.stroke();
  // flower ornament on top
  ctx.fillStyle = lighter(col, 50);
  for (let p = 0; p < 4; p++) {
    const pa = (p / 4) * Math.PI * 2 + t * 0.5;
    ctx.beginPath();
    ctx.ellipse(
      Math.cos(pa) * 1.5 * s, -5 * s + Math.sin(pa) * 1.5 * s,
      1.5 * s, 0.8 * s, pa, 0, Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();
}

/**
 * drawForestLord  -  "フォレストロード"
 * id: "nat_07"  |  Ancient tree stump body, tree rings, mushrooms growing, massive.
 */
export function drawForestLord(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // --- shadow (large) ---
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.6, r * 0.7, r * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- root legs (thick, gnarled) ---
  const rootSway = Math.sin(ph) * 1.5 * s;
  ctx.strokeStyle = darker(col, 50);
  ctx.lineWidth = 3 * s;
  ctx.lineCap = "round";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 4 * s, 5 * s);
    ctx.bezierCurveTo(
      side * 6 * s, 7 * s + side * rootSway,
      side * 8 * s, 9 * s,
      side * 7 * s, 11 * s,
    );
    ctx.stroke();
    // root tendril
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(side * 7 * s, 11 * s);
    ctx.lineTo(side * 10 * s, 11.5 * s);
    ctx.stroke();
    ctx.lineWidth = 3 * s;
  }

  // --- massive stump body ---
  const stumpGrad = ctx.createLinearGradient(-8 * s, -10 * s, 8 * s, 6 * s);
  stumpGrad.addColorStop(0, "#9e7c4a");
  stumpGrad.addColorStop(0.3, "#8b6914");
  stumpGrad.addColorStop(1, "#5c4a10");
  ctx.fillStyle = stumpGrad;
  ctx.beginPath();
  ctx.moveTo(-8 * s, 5 * s);
  ctx.lineTo(-9 * s, -4 * s);
  ctx.lineTo(-7 * s, -9 * s);
  ctx.lineTo(-3 * s, -11 * s);
  ctx.lineTo(3 * s, -11 * s);
  ctx.lineTo(7 * s, -9 * s);
  ctx.lineTo(9 * s, -4 * s);
  ctx.lineTo(8 * s, 5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#3d2a06";
  ctx.lineWidth = 1.2 * s;
  ctx.stroke();

  // bark texture
  ctx.strokeStyle = "rgba(40,25,5,0.3)";
  ctx.lineWidth = 0.8 * s;
  for (let i = 0; i < 6; i++) {
    const bx = -6 * s + i * 2.4 * s;
    ctx.beginPath();
    ctx.moveTo(bx, -9 * s + Math.abs(bx) * 0.3);
    ctx.bezierCurveTo(bx - 0.5 * s, -3 * s, bx + 0.5 * s, 0, bx, 5 * s);
    ctx.stroke();
  }

  // --- tree ring on top (flat top of stump) ---
  const topY = -11 * s;
  ctx.fillStyle = "#c8a060";
  ctx.beginPath();
  ctx.ellipse(0, topY, 7 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#6b4e10";
  ctx.lineWidth = 0.5 * s;
  ctx.stroke();
  // concentric rings
  ctx.strokeStyle = "rgba(80,50,10,0.5)";
  ctx.lineWidth = 0.4 * s;
  for (let ring = 1; ring <= 4; ring++) {
    ctx.beginPath();
    ctx.ellipse(0, topY, ring * 1.5 * s, ring * 0.5 * s, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // age crack
  ctx.strokeStyle = "#3d2a06";
  ctx.lineWidth = 0.6 * s;
  ctx.beginPath();
  ctx.moveTo(-1 * s, topY);
  ctx.lineTo(3 * s, topY - 0.5 * s);
  ctx.stroke();

  // --- mushrooms growing on body ---
  const mushrooms = [
    { x: -7, y: -3, size: 1.2, hue: "#e74c3c" },
    { x: 7, y: -6, size: 1, hue: "#f39c12" },
    { x: -5, y: 1, size: 0.8, hue: "#e74c3c" },
    { x: 8, y: 0, size: 1.1, hue: "#f39c12" },
  ];
  for (const m of mushrooms) {
    const mBob = Math.sin(t * 2 + m.x) * 0.5 * s;
    // stem
    ctx.fillStyle = "#f5e6c8";
    ctx.beginPath();
    ctx.roundRect(
      m.x * s - 0.5 * s * m.size, m.y * s + mBob,
      1 * s * m.size, 3 * s * m.size, 0.3 * s,
    );
    ctx.fill();
    // cap
    ctx.fillStyle = m.hue;
    ctx.beginPath();
    ctx.ellipse(
      m.x * s, m.y * s - 0.5 * s * m.size + mBob,
      2 * s * m.size, 1.2 * s * m.size, 0, 0, Math.PI,
    );
    ctx.fill();
    // spots on cap
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(m.x * s - 0.5 * s, m.y * s - 0.3 * s * m.size + mBob, 0.4 * s * m.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- eyes (ancient, wise) ---
  for (const side of [-1, 1]) {
    // dark hollow
    ctx.fillStyle = "#1a0e05";
    ctx.beginPath();
    ctx.ellipse(side * 3 * s, -5 * s, 2.2 * s, 1.6 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // glowing green eye
    const eyeBright = 0.7 + Math.sin(t * 1.5 + side) * 0.2;
    ctx.fillStyle = `rgba(100,220,50,${eyeBright})`;
    ctx.beginPath();
    ctx.ellipse(side * 3 * s, -5 * s, 1.5 * s, 1 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // pupil
    ctx.fillStyle = "#0a2e00";
    ctx.beginPath();
    ctx.ellipse(side * 3.2 * s, -5 * s, 0.5 * s, 0.8 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- moss-covered branch arms ---
  for (const side of [-1, 1]) {
    const armWave = Math.sin(t * 1.2 + side * 2) * 0.15;
    ctx.save();
    ctx.translate(side * 8.5 * s, -5 * s);
    ctx.rotate(side * 0.4 + armWave);
    ctx.strokeStyle = "#6b4e10";
    ctx.lineWidth = 2.5 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(side * 5 * s, -3 * s);
    ctx.stroke();
    // twig fingers
    ctx.lineWidth = 1 * s;
    for (let f = 0; f < 3; f++) {
      const fa = -0.4 + f * 0.4;
      ctx.beginPath();
      ctx.moveTo(side * 5 * s, -3 * s);
      ctx.lineTo(side * (6 + f * 0.5) * s, (-5 + fa * 2) * s);
      ctx.stroke();
    }
    // moss on arm
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(side * 3 * s, -2 * s, 2 * s, 1 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * drawThunderOak  -  "サンダーオーク"
 * id: "nat_08"  |  Lightning-struck oak, charred marks, electric sparks.
 */
export function drawThunderOak(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // --- shadow ---
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.65, r * 0.55, r * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- root feet ---
  const walk = Math.sin(ph) * 2 * s;
  ctx.fillStyle = darker(col, 50);
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 3 * s, 6 * s + side * walk);
    ctx.lineTo(side * 7 * s, 10 * s + side * walk);
    ctx.lineTo(side * 8 * s, 11 * s + side * walk);
    ctx.lineTo(side * 4 * s, 10 * s + side * walk);
    ctx.lineTo(side * 2 * s, 7 * s + side * walk);
    ctx.closePath();
    ctx.fill();
  }

  // --- split trunk body (lightning-struck) ---
  const trunkGrad = ctx.createLinearGradient(-6 * s, -10 * s, 6 * s, 6 * s);
  trunkGrad.addColorStop(0, lighter(col, 15));
  trunkGrad.addColorStop(0.5, col);
  trunkGrad.addColorStop(1, darker(col, 45));
  ctx.fillStyle = trunkGrad;
  ctx.beginPath();
  ctx.moveTo(-6 * s, 6 * s);
  ctx.lineTo(-7 * s, -3 * s);
  ctx.lineTo(-5 * s, -9 * s);
  // split top
  ctx.lineTo(-3 * s, -13 * s);
  ctx.lineTo(-1 * s, -10 * s);
  ctx.lineTo(0, -8 * s);
  ctx.lineTo(1 * s, -10 * s);
  ctx.lineTo(3 * s, -13 * s);
  ctx.lineTo(5 * s, -9 * s);
  ctx.lineTo(7 * s, -3 * s);
  ctx.lineTo(6 * s, 6 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(col, 60);
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // --- charred lightning scar down center ---
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -8 * s);
  ctx.lineTo(-1 * s, -5 * s);
  ctx.lineTo(1 * s, -3 * s);
  ctx.lineTo(-0.5 * s, 0);
  ctx.lineTo(1 * s, 3 * s);
  ctx.lineTo(0, 5 * s);
  ctx.stroke();
  // glow in scar
  const scarGlow = 0.3 + Math.sin(t * 4) * 0.2;
  ctx.strokeStyle = `rgba(255,230,100,${scarGlow})`;
  ctx.lineWidth = 0.8 * s;
  ctx.beginPath();
  ctx.moveTo(0, -8 * s);
  ctx.lineTo(-1 * s, -5 * s);
  ctx.lineTo(1 * s, -3 * s);
  ctx.lineTo(-0.5 * s, 0);
  ctx.lineTo(1 * s, 3 * s);
  ctx.lineTo(0, 5 * s);
  ctx.stroke();

  // --- branch arms ---
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 6 * s, -6 * s);
    const branchWave = Math.sin(t * 1.8 + side) * 0.12;
    ctx.rotate(side * 0.5 + branchWave);
    ctx.strokeStyle = darker(col, 30);
    ctx.lineWidth = 2 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(side * 6 * s, -2 * s);
    ctx.stroke();
    // smaller branches
    ctx.lineWidth = 1 * s;
    ctx.beginPath();
    ctx.moveTo(side * 4 * s, -1.5 * s);
    ctx.lineTo(side * 5.5 * s, -4 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(side * 5 * s, -1.8 * s);
    ctx.lineTo(side * 7 * s, -1 * s);
    ctx.stroke();
    ctx.restore();
  }

  // --- electric sparks (animated) ---
  ctx.strokeStyle = "#ffe566";
  ctx.lineWidth = 0.8 * s;
  ctx.shadowColor = "#ffe566";
  ctx.shadowBlur = 6 * s;
  for (let i = 0; i < 4; i++) {
    const sparkT = t * 5 + i * 1.5;
    const sparkPhase = (sparkT % 3) / 3;
    if (sparkPhase < 0.6) {
      const angle = (i / 4) * Math.PI * 2 + Math.sin(t * 3 + i) * 0.5;
      const dist = (7 + sparkPhase * 5) * s;
      const sx = Math.cos(angle) * dist;
      const sy = Math.sin(angle) * dist * 0.7 - 4 * s;
      const sparkLen = 3 * s;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(angle + 0.5) * sparkLen, sy + Math.sin(angle + 0.5) * sparkLen * 0.5);
      ctx.lineTo(sx + Math.cos(angle - 0.3) * sparkLen * 1.3, sy + Math.sin(angle - 0.3) * sparkLen * 0.5);
      ctx.stroke();
    }
  }
  ctx.shadowBlur = 0;

  // small persistent spark particles
  ctx.fillStyle = "#ffe566";
  for (let i = 0; i < 6; i++) {
    const pa = t * 3 + i * 1.05;
    const pdist = (5 + Math.sin(pa * 1.5) * 4) * s;
    const px = Math.cos(pa) * pdist;
    const py = Math.sin(pa * 0.7) * pdist * 0.5 - 4 * s;
    const psize = (0.4 + Math.sin(t * 6 + i) * 0.3) * s;
    if (psize > 0.2 * s) {
      ctx.beginPath();
      ctx.arc(px, py, psize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- eyes (fierce, electric) ---
  for (const side of [-1, 1]) {
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.ellipse(side * 2.5 * s, -5 * s, 2 * s, 1.5 * s, side * -0.15, 0, Math.PI * 2);
    ctx.fill();
    // electric yellow eye
    const eyeFlash = 0.8 + Math.sin(t * 6 + side * 3) * 0.2;
    ctx.fillStyle = `rgba(255,230,80,${eyeFlash})`;
    ctx.beginPath();
    ctx.ellipse(side * 2.5 * s, -5 * s, 1.3 * s, 0.9 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(side * 2.7 * s, -5 * s, 0.4 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * drawEmeraldFeather  -  "エメラルドフェザー"
 * id: "nat_09"  |  Elegant bird with emerald feathers, long tail plume, crystalline.
 */
export function drawEmeraldFeather(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // --- shadow ---
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.6, r * 0.45, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- bird legs (thin, elegant) ---
  const step = Math.sin(ph) * 2 * s;
  ctx.strokeStyle = "#c8a060";
  ctx.lineWidth = 1 * s;
  ctx.lineCap = "round";
  for (const side of [-1, 1]) {
    // leg
    ctx.beginPath();
    ctx.moveTo(side * 2 * s, 4 * s);
    ctx.lineTo(side * 2.5 * s, 8 * s + side * step);
    ctx.stroke();
    // talons
    ctx.lineWidth = 0.6 * s;
    for (let f = -1; f <= 1; f++) {
      ctx.beginPath();
      ctx.moveTo(side * 2.5 * s, 8 * s + side * step);
      ctx.lineTo(side * (2.5 + f * 1) * s, 9.5 * s + side * step);
      ctx.stroke();
    }
    ctx.lineWidth = 1 * s;
  }

  // --- long tail plume (flowing behind) ---
  const tailFlow = Math.sin(t * 2) * 3 * s;
  const tailFlow2 = Math.sin(t * 2 + 1) * 2 * s;
  // main tail feather
  const tailGrad = ctx.createLinearGradient(0, 4 * s, 0, 14 * s);
  tailGrad.addColorStop(0, col);
  tailGrad.addColorStop(0.5, lighter(col, 30));
  tailGrad.addColorStop(1, darker(col, 20));
  ctx.fillStyle = tailGrad;
  ctx.beginPath();
  ctx.moveTo(0, 4 * s);
  ctx.bezierCurveTo(-2 * s, 8 * s, -4 * s + tailFlow, 12 * s, -2 * s + tailFlow2, 16 * s);
  ctx.lineTo(0 + tailFlow2, 16.5 * s);
  ctx.bezierCurveTo(2 * s + tailFlow, 13 * s, 1 * s, 8 * s, 0, 4 * s);
  ctx.fill();
  // secondary tail feather
  ctx.fillStyle = lighter(col, 20);
  ctx.beginPath();
  ctx.moveTo(1 * s, 4 * s);
  ctx.bezierCurveTo(3 * s, 7 * s, 5 * s + tailFlow * 0.7, 10 * s, 4 * s + tailFlow2, 14 * s);
  ctx.lineTo(3 * s + tailFlow2, 14.5 * s);
  ctx.bezierCurveTo(3 * s + tailFlow * 0.5, 10 * s, 2 * s, 7 * s, 1 * s, 4 * s);
  ctx.fill();
  // crystal eye spots on tail
  for (let i = 0; i < 3; i++) {
    const ey = 8 * s + i * 3 * s;
    const ex = -1 * s + tailFlow * (i * 0.2);
    ctx.fillStyle = `rgba(200,255,220,${0.6 + Math.sin(t * 2 + i) * 0.2})`;
    ctx.beginPath();
    ctx.arc(ex, ey, 1.2 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = darker(col, 50);
    ctx.beginPath();
    ctx.arc(ex, ey, 0.6 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- round bird body ---
  const bodyBob = Math.sin(t * 3) * 0.5 * s;
  const birdGrad = ctx.createRadialGradient(-1 * s, -1 * s + bodyBob, 0, 0, 0 + bodyBob, 6 * s);
  birdGrad.addColorStop(0, lighter(col, 50));
  birdGrad.addColorStop(0.5, col);
  birdGrad.addColorStop(1, darker(col, 40));
  ctx.fillStyle = birdGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0 + bodyBob, 5.5 * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darker(col, 30);
  ctx.lineWidth = 0.6 * s;
  ctx.stroke();

  // feather pattern on breast
  ctx.strokeStyle = darker(col, 15);
  ctx.lineWidth = 0.4 * s;
  for (let fy = -2; fy <= 3; fy++) {
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(side * 2 * s, fy * 1.8 * s + bodyBob, 1.5 * s, -0.3, Math.PI + 0.3);
      ctx.stroke();
    }
  }

  // --- wing (folded, visible on side) ---
  const wingFlap = Math.sin(t * 3) * 0.15;
  ctx.save();
  ctx.translate(4 * s, -1 * s + bodyBob);
  ctx.rotate(0.3 + wingFlap);
  const wingGrad = ctx.createLinearGradient(0, 0, 5 * s, 4 * s);
  wingGrad.addColorStop(0, col);
  wingGrad.addColorStop(1, darker(col, 30));
  ctx.fillStyle = wingGrad;
  ctx.beginPath();
  ctx.moveTo(0, -2 * s);
  ctx.quadraticCurveTo(6 * s, -1 * s, 7 * s, 3 * s);
  ctx.quadraticCurveTo(4 * s, 4 * s, 0, 3 * s);
  ctx.closePath();
  ctx.fill();
  // crystalline highlight on wing
  ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.sin(t * 4) * 0.1})`;
  ctx.beginPath();
  ctx.moveTo(1 * s, -1 * s);
  ctx.lineTo(4 * s, 0);
  ctx.lineTo(3 * s, 2 * s);
  ctx.lineTo(0, 1 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // --- head (small, elegant) ---
  const headGrad = ctx.createRadialGradient(-0.5 * s, -7 * s + bodyBob, 0, 0, -6.5 * s + bodyBob, 3 * s);
  headGrad.addColorStop(0, lighter(col, 55));
  headGrad.addColorStop(1, col);
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(0, -7 * s + bodyBob, 3 * s, 0, Math.PI * 2);
  ctx.fill();

  // crest (small feathered crown)
  ctx.fillStyle = lighter(col, 40);
  for (let i = 0; i < 3; i++) {
    const ca = -0.4 + i * 0.4;
    ctx.beginPath();
    ctx.moveTo(Math.cos(ca) * 1 * s, -9 * s + bodyBob);
    ctx.lineTo(Math.cos(ca) * 0.5 * s, -12 * s + bodyBob + Math.sin(t * 3 + i) * 0.5 * s);
    ctx.lineTo(Math.cos(ca) * 2 * s, -9.5 * s + bodyBob);
    ctx.closePath();
    ctx.fill();
  }

  // --- eyes (large, jewel-like) ---
  for (const side of [-1, 1]) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(side * 1.5 * s, -7.5 * s + bodyBob, 1.3 * s, 1.4 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // emerald iris
    ctx.fillStyle = lighter(col, 60);
    ctx.beginPath();
    ctx.arc(side * 1.6 * s, -7.5 * s + bodyBob, 0.9 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0a2e00";
    ctx.beginPath();
    ctx.arc(side * 1.7 * s, -7.5 * s + bodyBob, 0.4 * s, 0, Math.PI * 2);
    ctx.fill();
    // sparkle
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(side * 1.3 * s, -8 * s + bodyBob, 0.25 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- beak ---
  ctx.fillStyle = "#e8a030";
  ctx.beginPath();
  ctx.moveTo(-1 * s, -6.5 * s + bodyBob);
  ctx.lineTo(-3.5 * s, -6 * s + bodyBob);
  ctx.lineTo(-1 * s, -5.5 * s + bodyBob);
  ctx.closePath();
  ctx.fill();

  // --- crystalline sparkles around body ---
  for (let i = 0; i < 5; i++) {
    const sparkA = t * 1.5 + (i / 5) * Math.PI * 2;
    const sparkDist = (7 + Math.sin(t * 2 + i * 3) * 2) * s;
    const sparkX = Math.cos(sparkA) * sparkDist;
    const sparkY = Math.sin(sparkA) * sparkDist * 0.6 - 2 * s;
    const sparkSize = (0.5 + Math.sin(t * 4 + i) * 0.3) * s;
    if (sparkSize > 0.3 * s) {
      ctx.fillStyle = `rgba(200,255,230,${0.5 + Math.sin(t * 3 + i) * 0.3})`;
      // diamond shape
      ctx.beginPath();
      ctx.moveTo(sparkX, sparkY - sparkSize);
      ctx.lineTo(sparkX + sparkSize * 0.6, sparkY);
      ctx.lineTo(sparkX, sparkY + sparkSize);
      ctx.lineTo(sparkX - sparkSize * 0.6, sparkY);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * drawWildZephyr  -  "ワイルドゼファー"
 * id: "nat_10"  |  Wind spirit serpent, translucent swirling body, leaf particles.
 */
export function drawWildZephyr(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number,
): void {
  const s = r / 15;
  ctx.save();
  ctx.translate(cx, cy);

  // --- shadow (faint, ethereal) ---
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.5, r * 0.4, r * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- wind swirl trail (base) ---
  const swirlAlpha = 0.15 + Math.sin(t * 2) * 0.05;
  ctx.strokeStyle = `rgba(${hexToRgb(col).r},${hexToRgb(col).g},${hexToRgb(col).b},${swirlAlpha})`;
  ctx.lineWidth = 3 * s;
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    const offset = i * 0.8;
    const alpha = swirlAlpha * (1 - i * 0.3);
    const { r: cr, g: cg, b: cb } = hexToRgb(col);
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
    ctx.lineWidth = (3 - i * 0.5) * s;
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 3; a += 0.2) {
      const spiralR = (3 + a * 1.5) * s;
      const sx = Math.cos(a + t * 2 + offset) * spiralR;
      const sy = Math.sin(a + t * 2 + offset) * spiralR * 0.4 + a * 0.8 * s - 5 * s;
      if (a === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  // --- serpent body (translucent, sinuous) ---
  const segments = 12;
  const bodyAlpha = 0.55;
  for (let i = segments - 1; i >= 0; i--) {
    const segT = i / segments;
    const segX = Math.sin(t * 2.5 + segT * Math.PI * 2 + ph) * 5 * s * (1 - segT * 0.3);
    const segY = -10 * s + segT * 18 * s;
    const segR = (2.5 - segT * 1.5) * s;
    const fadeAlpha = bodyAlpha * (1 - segT * 0.6);
    const { r: cr, g: cg, b: cb } = hexToRgb(lighter(col, Math.floor(segT * 40)));
    const segGrad = ctx.createRadialGradient(segX, segY, 0, segX, segY, segR);
    segGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${fadeAlpha})`);
    segGrad.addColorStop(1, `rgba(${cr},${cg},${cb},${fadeAlpha * 0.3})`);
    ctx.fillStyle = segGrad;
    ctx.beginPath();
    ctx.arc(segX, segY, segR, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- head (serpent, front-facing) ---
  const headX = Math.sin(t * 2.5 + ph) * 5 * s;
  const headY = -10 * s;
  const { r: hr, g: hg, b: hb } = hexToRgb(lighter(col, 30));
  const headGrad = ctx.createRadialGradient(headX - 0.5 * s, headY - 0.5 * s, 0, headX, headY, 4 * s);
  headGrad.addColorStop(0, `rgba(${hr},${hg},${hb},0.75)`);
  headGrad.addColorStop(1, `rgba(${hr},${hg},${hb},0.35)`);
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.ellipse(headX, headY, 3.5 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- horns (wind wisps) ---
  ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.5)`;
  ctx.lineWidth = 1 * s;
  for (const side of [-1, 1]) {
    const hornSway = Math.sin(t * 3 + side * 2) * 1 * s;
    ctx.beginPath();
    ctx.moveTo(headX + side * 2 * s, headY - 2 * s);
    ctx.quadraticCurveTo(
      headX + side * 4 * s + hornSway, headY - 5 * s,
      headX + side * 3 * s + hornSway, headY - 7 * s,
    );
    ctx.stroke();
  }

  // --- eyes (ethereal, bright) ---
  const eyeBright = 0.7 + Math.sin(t * 3.5) * 0.2;
  for (const side of [-1, 1]) {
    // glow
    ctx.fillStyle = `rgba(255,255,255,${eyeBright * 0.4})`;
    ctx.beginPath();
    ctx.arc(headX + side * 1.5 * s, headY - 0.5 * s, 1.5 * s, 0, Math.PI * 2);
    ctx.fill();
    // eye
    ctx.fillStyle = `rgba(255,255,255,${eyeBright})`;
    ctx.beginPath();
    ctx.ellipse(headX + side * 1.5 * s, headY - 0.5 * s, 1 * s, 0.8 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // pupil (slit)
    ctx.fillStyle = `rgba(0,60,0,${eyeBright})`;
    ctx.beginPath();
    ctx.ellipse(headX + side * 1.6 * s, headY - 0.5 * s, 0.3 * s, 0.6 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- leaf particles floating in wind ---
  for (let i = 0; i < 7; i++) {
    const leafT = (t * 1.5 + i * 1.3) % 6;
    const leafProgress = leafT / 6;
    const leafAlpha = leafProgress < 0.8 ? 0.6 : 0.6 * (1 - (leafProgress - 0.8) / 0.2);
    const leafX = Math.sin(t * 2 + i * 2.2) * (6 + leafProgress * 5) * s;
    const leafY = -8 * s + leafProgress * 16 * s + Math.cos(t * 3 + i) * 2 * s;
    const leafRot = t * 3 + i * 1.5;
    const leafSize = (1 + Math.sin(i * 0.7) * 0.3) * s;

    ctx.save();
    ctx.translate(leafX, leafY);
    ctx.rotate(leafRot);
    ctx.globalAlpha = leafAlpha;
    ctx.fillStyle = lighter(col, 20 + i * 5);
    ctx.beginPath();
    ctx.moveTo(0, -leafSize);
    ctx.quadraticCurveTo(leafSize, 0, 0, leafSize);
    ctx.quadraticCurveTo(-leafSize, 0, 0, -leafSize);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // --- wind lines (speed streaks) ---
  ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.2)`;
  ctx.lineWidth = 0.5 * s;
  for (let i = 0; i < 4; i++) {
    const wy = -6 * s + i * 4 * s;
    const wx = Math.sin(t * 2.5 + i) * 3 * s;
    const wLen = (5 + Math.sin(t * 3 + i * 2) * 3) * s;
    ctx.beginPath();
    ctx.moveTo(wx - wLen, wy);
    ctx.lineTo(wx + wLen, wy);
    ctx.stroke();
  }

  ctx.restore();
}
