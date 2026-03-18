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
    hp: 80,  atk: 10, atkInterval: 1500, speed: 25,  range: 38, color: "#e63946", radius: 15,
  },
  fast: {
    type: "fast", label: "速攻犬",
    hp: 40,  atk: 8,  atkInterval: 900,  speed: 55,  range: 32, color: "#ff6b6b", radius: 12,
  },
  tank: {
    type: "tank", label: "重装犬",
    hp: 250, atk: 20, atkInterval: 2200, speed: 13,  range: 45, color: "#c1121f", radius: 22,
  },
  speedy: {
    type: "speedy", label: "すばやい犬",
    hp: 28,  atk: 5,  atkInterval: 500,  speed: 100, range: 26, color: "#fb923c", radius: 9,
  },
  boss: {
    type: "boss", label: "ボス犬",
    hp: 450, atk: 35, atkInterval: 2800, speed: 6,   range: 65, color: "#7c3aed", radius: 30,
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

  constructor(type: EnemyType, startX: number, scale: number = 1) {
    this.id = _enemyId++;
    const base = ENEMY_DEFS[type];
    // スケールに応じてHP・ATKを調整（難易度）
    this.def = {
      ...base,
      hp:  Math.max(1, Math.round(base.hp  * scale)),
      atk: Math.max(1, Math.round(base.atk * scale)),
    };
    this.x    = startX;
    this.hp   = this.def.hp;
    this.maxHp = this.def.hp;
  }

  get alive() { return this.hp > 0; }

  /** dt: 経過ms */
  update(dt: number, units: import("./Unit").Unit[], playerBaseX: number): void {
    const target = this._findTarget(units, playerBaseX);

    if (target === "base") {
      return;
    }
    if (target === null) {
      this.x -= (this.def.speed * dt) / 1000;
      return;
    }
    const dist = this.x - target.x;
    if (dist <= this.def.range) {
      return;
    }
    this.x -= (this.def.speed * dt) / 1000;
  }

  private _findTarget(
    units: import("./Unit").Unit[],
    playerBaseX: number
  ): import("./Unit").Unit | "base" | null {
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
