/**
 * 16-bit chiptune style sound manager using Web Audio API
 * All sounds are synthesized procedurally - no external files needed.
 */

let _ctx: AudioContext | null = null;
let _masterGain: GainNode | null = null;
let _muted = false;
let _volume = 0.3;
let _bgmGain: GainNode | null = null;
let _bgmOscillators: OscillatorNode[] = [];

function getCtx(): AudioContext | null {
  if (_ctx) return _ctx;
  try {
    _ctx = new AudioContext();
    _masterGain = _ctx.createGain();
    _masterGain.gain.value = _volume;
    _masterGain.connect(_ctx.destination);
    _bgmGain = _ctx.createGain();
    _bgmGain.gain.value = 0.12;
    _bgmGain.connect(_masterGain);
    return _ctx;
  } catch {
    return null;
  }
}

function ensureResumed() {
  if (_ctx && _ctx.state === "suspended") {
    _ctx.resume().catch(() => {});
  }
}

/** Play a note with given frequency, type, duration, and optional volume */
function playTone(
  freq: number,
  type: OscillatorType,
  duration: number,
  vol = 0.3,
  delay = 0,
) {
  const ctx = getCtx();
  if (!ctx || !_masterGain || _muted) return;
  ensureResumed();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
  gain.gain.linearRampToValueAtTime(vol * 0.6, ctx.currentTime + delay + duration * 0.7);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(_masterGain);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.05);
}

/** Simple noise burst for percussive sounds */
function playNoise(duration: number, vol = 0.15, delay = 0) {
  const ctx = getCtx();
  if (!ctx || !_masterGain || _muted) return;
  ensureResumed();

  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buffer;
  gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);

  src.connect(gain);
  gain.connect(_masterGain);
  src.start(ctx.currentTime + delay);
}

// ─── Sound Effects ───────────────────────────────────

/** クイズ正解 - 明るい上昇音 */
export function sfxCorrect() {
  playTone(523, "square", 0.08, 0.25);       // C5
  playTone(659, "square", 0.08, 0.25, 0.07); // E5
  playTone(784, "square", 0.12, 0.3, 0.14);  // G5
}

/** クイズ不正解 - 低い下降音 */
export function sfxWrong() {
  playTone(311, "square", 0.12, 0.2);        // Eb4
  playTone(233, "square", 0.2, 0.25, 0.1);   // Bb3
}

/** ユニット配置 - ポップ音 */
export function sfxDeploy() {
  playTone(880, "square", 0.04, 0.2);
  playTone(1175, "square", 0.06, 0.15, 0.04);
  playNoise(0.03, 0.1, 0.02);
}

/** 敵撃破 - 小さな爆発音 */
export function sfxEnemyDeath() {
  playNoise(0.08, 0.12);
  playTone(220, "sawtooth", 0.06, 0.1);
  playTone(110, "sawtooth", 0.08, 0.08, 0.04);
}

/** コンボスキル発動 */
export function sfxComboSkill() {
  playTone(440, "sawtooth", 0.06, 0.2);
  playTone(554, "sawtooth", 0.06, 0.2, 0.05);
  playTone(659, "sawtooth", 0.06, 0.2, 0.1);
  playTone(880, "sawtooth", 0.12, 0.3, 0.15);
  playNoise(0.1, 0.15, 0.15);
}

/** ステージクリア - ファンファーレ */
export function sfxStageClear() {
  // C E G C(oct)
  playTone(523, "square", 0.12, 0.25);
  playTone(659, "square", 0.12, 0.25, 0.1);
  playTone(784, "square", 0.12, 0.25, 0.2);
  playTone(1047, "square", 0.3, 0.35, 0.3);
  // Harmony
  playTone(392, "triangle", 0.5, 0.15, 0.3);
}

/** ステージ敗北 */
export function sfxDefeat() {
  playTone(392, "square", 0.15, 0.2);
  playTone(349, "square", 0.15, 0.2, 0.15);
  playTone(311, "square", 0.15, 0.2, 0.3);
  playTone(262, "square", 0.4, 0.25, 0.45);
}

/** ガチャ回転中 - チッチッ音 */
export function sfxGachaRoll() {
  playTone(1200 + Math.random() * 400, "square", 0.03, 0.1);
}

/** ガチャ結果 - キラキラ */
export function sfxGachaReveal() {
  playTone(784, "square", 0.08, 0.2);
  playTone(988, "square", 0.08, 0.2, 0.07);
  playTone(1175, "square", 0.08, 0.2, 0.14);
  playTone(1568, "square", 0.15, 0.3, 0.21);
  playTone(1319, "triangle", 0.3, 0.15, 0.21);
}

/** 星獲得 */
export function sfxStar() {
  playTone(1047, "triangle", 0.1, 0.2);
  playTone(1319, "triangle", 0.12, 0.2, 0.08);
}

/** ボタンタップ - 軽いクリック音 */
export function sfxTap() {
  playTone(800, "square", 0.025, 0.08);
}

/** コイン獲得 */
export function sfxCoin() {
  playTone(1319, "square", 0.05, 0.15);
  playTone(1568, "square", 0.08, 0.15, 0.05);
}

/** ユニット解放 */
export function sfxUnlock() {
  playTone(523, "triangle", 0.1, 0.2);
  playTone(659, "triangle", 0.1, 0.2, 0.1);
  playTone(784, "triangle", 0.1, 0.2, 0.2);
  playTone(1047, "triangle", 0.2, 0.3, 0.3);
  playNoise(0.15, 0.08, 0.3);
}

// ─── BGM ─────────────────────────────────────────────

const BGM_BATTLE: Array<[number, number]> = [
  // Simple 8-bar loop in C minor, each note [freq, beats]
  [262, 0.5], [311, 0.5], [349, 0.5], [392, 0.5],
  [349, 0.5], [311, 0.5], [262, 1],
  [392, 0.5], [440, 0.5], [392, 0.5], [349, 0.5],
  [311, 0.5], [262, 0.5], [233, 1],
  [262, 0.5], [349, 0.5], [392, 0.5], [440, 0.5],
  [523, 1], [440, 0.5], [392, 0.5],
  [349, 0.5], [311, 0.5], [262, 1], [233, 0.5], [262, 0.5],
];

let _bgmInterval: ReturnType<typeof setInterval> | null = null;
let _bgmIndex = 0;

export function bgmStart() {
  const ctx = getCtx();
  if (!ctx || !_bgmGain || _muted) return;
  bgmStop();
  ensureResumed();

  const bpm = 140;
  const beatSec = 60 / bpm;
  _bgmIndex = 0;

  function playNext() {
    if (!_bgmGain || _muted) return;
    const [freq, beats] = BGM_BATTLE[_bgmIndex % BGM_BATTLE.length];
    const dur = beats * beatSec * 0.9;

    const ctx2 = getCtx();
    if (!ctx2) return;

    const osc = ctx2.createOscillator();
    const gain = ctx2.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx2.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx2.currentTime + dur);
    gain.gain.linearRampToValueAtTime(0, ctx2.currentTime + dur + 0.02);
    osc.connect(gain);
    gain.connect(_bgmGain);
    osc.start();
    osc.stop(ctx2.currentTime + dur + 0.03);
    _bgmOscillators.push(osc);

    // Bass note (octave down)
    const osc2 = ctx2.createOscillator();
    const gain2 = ctx2.createGain();
    osc2.type = "triangle";
    osc2.frequency.value = freq / 2;
    gain2.gain.setValueAtTime(0.06, ctx2.currentTime);
    gain2.gain.linearRampToValueAtTime(0, ctx2.currentTime + dur);
    osc2.connect(gain2);
    gain2.connect(_bgmGain);
    osc2.start();
    osc2.stop(ctx2.currentTime + dur + 0.02);
    _bgmOscillators.push(osc2);

    _bgmIndex++;
  }

  playNext();
  const beatMs = beatSec * 1000;
  let noteIdx = 0;
  function scheduleNext() {
    const [, beats] = BGM_BATTLE[noteIdx % BGM_BATTLE.length];
    noteIdx++;
    _bgmInterval = setTimeout(() => {
      playNext();
      scheduleNext();
    }, beats * beatMs);
  }
  scheduleNext();
}

export function bgmStop() {
  if (_bgmInterval) {
    clearTimeout(_bgmInterval);
    _bgmInterval = null;
  }
  for (const osc of _bgmOscillators) {
    try { osc.stop(); } catch { /* already stopped */ }
  }
  _bgmOscillators = [];
}

// ─── Controls ────────────────────────────────────────

export function setMuted(muted: boolean) {
  _muted = muted;
  if (muted) bgmStop();
  localStorage.setItem("learning_td_muted", muted ? "1" : "0");
}

export function isMuted(): boolean {
  return _muted;
}

export function setVolume(vol: number) {
  _volume = Math.max(0, Math.min(1, vol));
  if (_masterGain) _masterGain.gain.value = _volume;
  localStorage.setItem("learning_td_volume", String(_volume));
}

export function getVolume(): number {
  return _volume;
}

/** Initialize from saved preferences */
export function initAudio() {
  const savedMuted = localStorage.getItem("learning_td_muted");
  if (savedMuted === "1") _muted = true;
  const savedVol = localStorage.getItem("learning_td_volume");
  if (savedVol) {
    const v = parseFloat(savedVol);
    if (Number.isFinite(v)) _volume = Math.max(0, Math.min(1, v));
  }
}
