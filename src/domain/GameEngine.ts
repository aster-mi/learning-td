import { Unit, type UnitType, type UnitDef } from "./Unit";
import { Enemy } from "./Enemy";
import type { StageData } from "../data/stages";

export type GameStatus = "playing" | "win" | "lose";

const CANVAS_WIDTH  = 800;
const PLAYER_BASE_X = 60;
const ENEMY_BASE_X  = CANVAS_WIDTH - 60;
const PLAYER_BASE_HP = 300;
const GROUND_Y = 200; // 描画用

export interface GameState {
  status: GameStatus;
  playerBaseHp: number;
  playerBaseMaxHp: number;
  enemyBaseHp: number;
  enemyBaseMaxHp: number;
  units: Unit[];
  enemies: Enemy[];
  elapsedSec: number;
  energy: number;
  combo: number;
}

export class GameEngine {
  private units: Unit[] = [];
  private enemies: Enemy[] = [];
  private playerBaseHp: number = PLAYER_BASE_HP;
  private enemyBaseHp: number;
  private enemyBaseMaxHp: number;
  private spawnIndex: number = 0;
  private elapsed: number = 0; // ms
  private status: GameStatus = "playing";
  private stage: StageData;
  private difficultyScale: number;

  // public for rendering
  readonly playerBaseX = PLAYER_BASE_X;
  readonly enemyBaseX  = ENEMY_BASE_X;
  readonly groundY     = GROUND_Y;
  readonly canvasWidth = CANVAS_WIDTH;

  constructor(stage: StageData, selectedLevel: number = 7) {
    this.stage = stage;
    // Lv.1→0.35, Lv.7→1.0 (標準), Lv.10→1.10（上限を抑えた2段階カーブ）
    // selectedLevel===0 は「指定なし（全て）」→ 標準難易度(Lv.7)で計算
    const lv = selectedLevel <= 0 ? 7 : Math.max(1, Math.min(10, selectedLevel));
    this.difficultyScale = lv <= 7
      ? 0.35 + (lv - 1) * (0.65 / 6)   // Lv.1〜7: 35%→100%
      : 1.0  + (lv - 7) * (0.10 / 3);  // Lv.8〜10: 100%→110%
    const baseHp = Math.round(stage.enemyBaseHp * this.difficultyScale);
    this.enemyBaseHp    = baseHp;
    this.enemyBaseMaxHp = baseHp;
  }

  /** エネルギーは外部(QuizPanel)から渡す */
  deployUnit(type: UnitType, unitDefOverride?: UnitDef): boolean {
    this.units.push(new Unit(type, PLAYER_BASE_X + 40, unitDefOverride));
    return true;
  }

  /**
   * ゲームループ tick
   * @param dt  前フレームからの経過ms
   * @returns 現在のゲーム状態スナップショット
   */
  tick(dt: number): GameState {
    if (this.status !== "playing") return this._snapshot();

    this.elapsed += dt;
    const elapsedSec = this.elapsed / 1000;

    // --- スポーン ---
    while (
      this.spawnIndex < this.stage.spawnTable.length &&
      this.stage.spawnTable[this.spawnIndex].atSecond <= elapsedSec
    ) {
      const entry = this.stage.spawnTable[this.spawnIndex++];
      this.enemies.push(new Enemy(entry.enemyType, ENEMY_BASE_X - 60, this.difficultyScale));
    }

    // --- ユニット更新 ---
    for (const u of this.units) {
      if (!u.alive) continue;
      u.update(dt, this.enemies, ENEMY_BASE_X);
      // 射程内攻撃
      this._unitAttack(u, dt);
    }

    // --- 敵更新 ---
    for (const e of this.enemies) {
      if (!e.alive) continue;
      e.update(dt, this.units, PLAYER_BASE_X);
      this._enemyAttack(e, dt);
    }

    // --- 死体除去 ---
    this.units   = this.units.filter(u => u.alive);
    this.enemies = this.enemies.filter(e => e.alive);

    // --- 勝敗判定 ---
    if (this.enemyBaseHp <= 0)  this.status = "win";
    if (this.playerBaseHp <= 0) this.status = "lose";

    return this._snapshot();
  }

  private _unitAttack(u: Unit, _dt: number) {
    const now = this.elapsed;
    if (now - u.lastAtkTime < u.def.atkInterval) return;

    // 方向を問わず射程内の最も近い敵を探す
    const target = this.enemies
      .filter(e => e.alive && Math.abs(e.x - u.x) <= u.def.range)
      .sort((a, b) => Math.abs(a.x - u.x) - Math.abs(b.x - u.x))[0];

    if (target) {
      target.hp -= u.def.atk;
      u.lastAtkTime = now;
      return;
    }
    // 敵拠点が射程内
    if (ENEMY_BASE_X - u.x <= u.def.range) {
      this.enemyBaseHp -= u.def.atk;
      u.lastAtkTime = now;
    }
  }

  private _enemyAttack(e: Enemy, _dt: number) {
    const now = this.elapsed;
    if (now - e.lastAtkTime < e.def.atkInterval) return;

    // 方向を問わず射程内の最も近いユニットを探す
    const target = this.units
      .filter(u => u.alive && Math.abs(u.x - e.x) <= e.def.range)
      .sort((a, b) => Math.abs(a.x - e.x) - Math.abs(b.x - e.x))[0];

    if (target) {
      target.hp -= e.def.atk;
      e.lastAtkTime = now;
      return;
    }
    // プレイヤー拠点
    if (e.x - PLAYER_BASE_X <= e.def.range) {
      this.playerBaseHp -= e.def.atk;
      e.lastAtkTime = now;
    }
  }

  /** コンボ必殺技: 全敵にダメージ */
  damageAllEnemies(dmg: number): void {
    for (const e of this.enemies) {
      if (e.alive) e.hp -= dmg;
    }
  }

  private _snapshot(): GameState {
    return {
      status: this.status,
      playerBaseHp: Math.max(0, this.playerBaseHp),
      playerBaseMaxHp: PLAYER_BASE_HP,
      enemyBaseHp: Math.max(0, this.enemyBaseHp),
      enemyBaseMaxHp: this.enemyBaseMaxHp,
      units: [...this.units],
      enemies: [...this.enemies],
      elapsedSec: this.elapsed / 1000,
      energy: 0,   // caller fills this
      combo: 0,    // caller fills this
    };
  }
}
