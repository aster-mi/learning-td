import { UNIT_CATALOG, type UnitCatalogEntry } from "../data/unitCatalog";

/** 後方互換: 旧UnitType (文字列リテラル) */
export type UnitType = string;

export interface UnitDef {
  type: string;
  label: string;
  emoji: string;
  hp: number;
  atk: number;
  atkInterval: number;
  speed: number;
  range: number;
  cost: number;
  color: string;
  radius: number;
}

/** カタログエントリ → UnitDef 変換 */
function toUnitDef(entry: UnitCatalogEntry): UnitDef {
  return {
    type: entry.id,
    label: entry.label,
    emoji: entry.emoji,
    hp: entry.hp,
    atk: entry.atk,
    atkInterval: entry.atkInterval,
    speed: entry.speed,
    range: entry.range,
    cost: entry.cost,
    color: entry.color,
    radius: entry.radius,
  };
}

/** 全ユニット定義マップ (IDベース) */
export const UNIT_DEFS: Record<string, UnitDef> = {};
for (const entry of UNIT_CATALOG) {
  UNIT_DEFS[entry.id] = toUnitDef(entry);
}

/** IDからUnitDefを安全に取得（なければbasic） */
export function getUnitDef(id: string): UnitDef {
  return UNIT_DEFS[id] ?? UNIT_DEFS["basic"];
}

let _unitId = 0;

export class Unit {
  readonly id: number;
  readonly def: UnitDef;
  x: number;
  hp: number;
  maxHp: number;
  lastAtkTime: number = 0;

  constructor(type: string, startX: number) {
    this.id = _unitId++;
    this.def = getUnitDef(type);
    this.x = startX;
    this.hp = this.def.hp;
    this.maxHp = this.def.hp;
  }

  get alive() { return this.hp > 0; }

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
