import type { EnemyType } from "../data/stages";

export interface EnemyDef {
  type: EnemyType;
  label: string;
  hp: number;
  atk: number;
  atkInterval: number;
  speed: number;
  range: number;
  color: string;
  radius: number;
}

export const ENEMY_DEFS: Record<EnemyType, EnemyDef> = {
  weak: {
    type: "weak", label: "ザコ犬",
    hp: 80,  atk: 10, atkInterval: 1500, speed: 50, range: 38,
    color: "#e63946", radius: 15,
  },
  fast: {
    type: "fast", label: "速攻犬",
    hp: 40,  atk: 8,  atkInterval: 900,  speed: 110, range: 32,
    color: "#ff6b6b", radius: 12,
  },
  tank: {
    type: "tank", label: "重装犬",
    hp: 250, atk: 20, atkInterval: 2200, speed: 25, range: 45,
    color: "#c1121f", radius: 22,
  },
};

let _enemyId = 0;

export class Enemy {
  readonly id: number;
  readonly def: EnemyDef;
  x: number;
  hp: number;
  maxHp: number;
  lastAtkTime: number = 0;

  constructor(type: EnemyType, startX: number) {
    this.id = _enemyId++;
    this.def = ENEMY_DEFS[type];
    this.x = startX;
    this.hp = this.def.hp;
    this.maxHp = this.def.hp;
  }

  get alive() { return this.hp > 0; }

  /** dt: 経過ms */
  update(dt: number, units: import("./Unit").Unit[], playerBaseX: number): void {
    const target = this._findTarget(units, playerBaseX);

    if (target === "base") {
      // 拠点が射程内 → 停止して攻撃（GameEngineで処理）
      return;
    }
    if (target === null) {
      // ユニットなし・拠点も射程外 → 左へ前進
      this.x -= (this.def.speed * dt) / 1000;
      return;
    }
    // ユニットがいる
    const dist = this.x - target.x;
    if (dist <= this.def.range) {
      // 射程内 → 停止して攻撃（GameEngineで処理）
      return;
    }
    // 射程外 → 左へ前進
    this.x -= (this.def.speed * dt) / 1000;
  }

  private _findTarget(
    units: import("./Unit").Unit[],
    playerBaseX: number
  ): import("./Unit").Unit | "base" | null {
    // 方向を問わず最も近いユニットを探す（出撃直後のユニットも検知）
    let nearest: import("./Unit").Unit | null = null;
    let nearestDist = Infinity;
    for (const u of units) {
      if (!u.alive) continue;
      const d = Math.abs(u.x - this.x);
      if (d < nearestDist) { nearestDist = d; nearest = u; }
    }
    if (nearest) return nearest;
    const baseDist = this.x - playerBaseX;
    if (baseDist <= this.def.range) return "base";
    return null;
  }
}
