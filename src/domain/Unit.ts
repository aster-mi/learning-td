export type UnitType = "basic" | "fast" | "tank" | "shooter" | "bomber";

export interface UnitDef {
  type: UnitType;
  label: string;
  hp: number;
  atk: number;
  /** 攻撃間隔（ms） */
  atkInterval: number;
  /** px/s */
  speed: number;
  /** 攻撃射程 px */
  range: number;
  cost: number;
  /** 描画色 */
  color: string;
  /** ボディ半径 px */
  radius: number;
}

export const UNIT_DEFS: Record<UnitType, UnitDef> = {
  basic: {
    type: "basic", label: "ネコ",
    hp: 100, atk: 15, atkInterval: 1200, speed: 60, range: 40,
    cost: 20, color: "#f9c74f", radius: 16,
  },
  fast: {
    type: "fast", label: "速ネコ",
    hp: 50, atk: 10, atkInterval: 800, speed: 120, range: 35,
    cost: 15, color: "#90be6d", radius: 13,
  },
  tank: {
    type: "tank", label: "タンクネコ",
    hp: 300, atk: 25, atkInterval: 2000, speed: 30, range: 45,
    cost: 35, color: "#4cc9f0", radius: 22,
  },
  shooter: {
    type: "shooter", label: "遠距離ネコ",
    hp: 70, atk: 22, atkInterval: 1800, speed: 38, range: 130,
    cost: 30, color: "#c084fc", radius: 14,
  },
  bomber: {
    type: "bomber", label: "火炎ネコ",
    hp: 180, atk: 50, atkInterval: 3200, speed: 18, range: 60,
    cost: 45, color: "#f97316", radius: 22,
  },
};

let _unitId = 0;

export class Unit {
  readonly id: number;
  readonly def: UnitDef;
  x: number;
  hp: number;
  maxHp: number;
  lastAtkTime: number = 0;

  constructor(type: UnitType, startX: number) {
    this.id = _unitId++;
    this.def = UNIT_DEFS[type];
    this.x = startX;
    this.hp = this.def.hp;
    this.maxHp = this.def.hp;
  }

  get alive() { return this.hp > 0; }

  /** dt: 経過ms */
  update(dt: number, enemies: import("./Enemy").Enemy[], enemyBaseX: number): void {
    const target = this._findTarget(enemies, enemyBaseX);

    if (target === "base") {
      return;
    }
    if (target === null) {
      this.x += (this.def.speed * dt) / 1000;
      return;
    }
    const dist = target.x - this.x;
    if (dist <= this.def.range) {
      return;
    }
    this.x += (this.def.speed * dt) / 1000;
  }

  private _findTarget(
    enemies: import("./Enemy").Enemy[],
    enemyBaseX: number
  ): import("./Enemy").Enemy | "base" | null {
    let nearest: import("./Enemy").Enemy | null = null;
    let nearestDist = Infinity;
    for (const e of enemies) {
      if (!e.alive) continue;
      const d = Math.abs(e.x - this.x);
      if (d < nearestDist) { nearestDist = d; nearest = e; }
    }
    if (nearest) return nearest;
    const baseDist = enemyBaseX - this.x;
    if (baseDist <= this.def.range) return "base";
    return null;
  }
}
