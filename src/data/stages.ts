export type EnemyType =
  | "weak"
  | "fast"
  | "tank"
  | "speedy"
  | "assassin"
  | "brute"
  | "warlock"
  | "boss";

export interface SpawnEntry {
  enemyType: EnemyType;
  /** 出現するゲーム時間（秒） */
  atSecond: number;
}

export interface StageData {
  id: number;
  name: string;
  /** 敵本拠地HP */
  enemyBaseHp: number;
  spawnTable: SpawnEntry[];
  /** EXステージかどうか */
  isEX?: boolean;
  /** ワールド番号 (1=草原, 2=砂漠, 3=氷原) */
  world?: number;
}

// ── ワールド1: 草原 ──────────────────────────────────────────
export const stages: StageData[] = [
  {
    id: 1,
    name: "入門の地",
    enemyBaseHp: 300,
    world: 1,
    spawnTable: [
      { enemyType: "weak",   atSecond: 2 },
      { enemyType: "weak",   atSecond: 5 },
      { enemyType: "speedy", atSecond: 8 },
      { enemyType: "weak",   atSecond: 10 },
      { enemyType: "fast",   atSecond: 13 },
      { enemyType: "speedy", atSecond: 16 },
      { enemyType: "weak",   atSecond: 18 },
      { enemyType: "fast",   atSecond: 22 },
      { enemyType: "tank",   atSecond: 28 },
    ],
  },
  {
    id: 2,
    name: "試練の荒野",
    enemyBaseHp: 500,
    world: 1,
    spawnTable: [
      { enemyType: "fast",   atSecond: 2 },
      { enemyType: "speedy", atSecond: 4 },
      { enemyType: "weak",   atSecond: 5 },
      { enemyType: "fast",   atSecond: 7 },
      { enemyType: "speedy", atSecond: 9 },
      { enemyType: "tank",   atSecond: 11 },
      { enemyType: "weak",   atSecond: 13 },
      { enemyType: "fast",   atSecond: 15 },
      { enemyType: "speedy", atSecond: 17 },
      { enemyType: "tank",   atSecond: 20 },
      { enemyType: "fast",   atSecond: 23 },
      { enemyType: "tank",   atSecond: 27 },
      { enemyType: "boss",   atSecond: 32 },
    ],
  },
  {
    id: 3,
    name: "決戦の城",
    enemyBaseHp: 800,
    world: 1,
    spawnTable: [
      { enemyType: "speedy", atSecond: 1 },
      { enemyType: "fast",   atSecond: 2 },
      { enemyType: "speedy", atSecond: 4 },
      { enemyType: "tank",   atSecond: 5 },
      { enemyType: "fast",   atSecond: 7 },
      { enemyType: "speedy", atSecond: 8 },
      { enemyType: "assassin", atSecond: 9 },
      { enemyType: "tank",   atSecond: 10 },
      { enemyType: "weak",   atSecond: 11 },
      { enemyType: "boss",   atSecond: 13 },
      { enemyType: "fast",   atSecond: 15 },
      { enemyType: "speedy", atSecond: 16 },
      { enemyType: "tank",   atSecond: 18 },
      { enemyType: "fast",   atSecond: 20 },
      { enemyType: "tank",   atSecond: 22 },
      { enemyType: "speedy", atSecond: 24 },
      { enemyType: "warlock", atSecond: 25 },
      { enemyType: "boss",   atSecond: 27 },
      { enemyType: "tank",   atSecond: 30 },
    ],
  },

  // ── ワールド2: 砂漠 ──────────────────────────────────────────
  {
    id: 4,
    name: "灼熱の砂漠",
    enemyBaseHp: 600,
    world: 2,
    spawnTable: [
      { enemyType: "speedy", atSecond: 1 },
      { enemyType: "speedy", atSecond: 3 },
      { enemyType: "speedy", atSecond: 5 },
      { enemyType: "fast",   atSecond: 7 },
      { enemyType: "speedy", atSecond: 9 },
      { enemyType: "fast",   atSecond: 11 },
      { enemyType: "tank",   atSecond: 14 },
      { enemyType: "speedy", atSecond: 16 },
      { enemyType: "speedy", atSecond: 18 },
      { enemyType: "boss",   atSecond: 22 },
    ],
  },
  {
    id: 5,
    name: "砂嵐の要塞",
    enemyBaseHp: 900,
    world: 2,
    spawnTable: [
      { enemyType: "tank",   atSecond: 2 },
      { enemyType: "fast",   atSecond: 4 },
      { enemyType: "tank",   atSecond: 6 },
      { enemyType: "speedy", atSecond: 8 },
      { enemyType: "tank",   atSecond: 10 },
      { enemyType: "brute",  atSecond: 12 },
      { enemyType: "boss",   atSecond: 13 },
      { enemyType: "fast",   atSecond: 15 },
      { enemyType: "tank",   atSecond: 17 },
      { enemyType: "speedy", atSecond: 19 },
      { enemyType: "tank",   atSecond: 21 },
      { enemyType: "fast",   atSecond: 23 },
      { enemyType: "warlock", atSecond: 24 },
      { enemyType: "boss",   atSecond: 26 },
      { enemyType: "tank",   atSecond: 29 },
    ],
  },

  // ── ワールド3: 氷原 ──────────────────────────────────────────
  {
    id: 6,
    name: "極寒の頂",
    enemyBaseHp: 1200,
    world: 3,
    spawnTable: [
      { enemyType: "tank",   atSecond: 1 },
      { enemyType: "tank",   atSecond: 3 },
      { enemyType: "boss",   atSecond: 5 },
      { enemyType: "speedy", atSecond: 7 },
      { enemyType: "fast",   atSecond: 8 },
      { enemyType: "tank",   atSecond: 10 },
      { enemyType: "speedy", atSecond: 11 },
      { enemyType: "assassin", atSecond: 12 },
      { enemyType: "boss",   atSecond: 14 },
      { enemyType: "tank",   atSecond: 16 },
      { enemyType: "warlock", atSecond: 17 },
      { enemyType: "fast",   atSecond: 18 },
      { enemyType: "speedy", atSecond: 19 },
      { enemyType: "tank",   atSecond: 21 },
      { enemyType: "boss",   atSecond: 24 },
      { enemyType: "tank",   atSecond: 26 },
      { enemyType: "fast",   atSecond: 28 },
      { enemyType: "brute",  atSecond: 30 },
      { enemyType: "boss",   atSecond: 31 },
    ],
  },

  // ── EXステージ（高難易度） ──────────────────────────────────
  {
    id: 101,
    name: "EX: 無限の草原",
    enemyBaseHp: 1500,
    isEX: true,
    world: 1,
    spawnTable: [
      { enemyType: "fast",   atSecond: 1 },
      { enemyType: "fast",   atSecond: 2 },
      { enemyType: "speedy", atSecond: 3 },
      { enemyType: "tank",   atSecond: 4 },
      { enemyType: "fast",   atSecond: 5 },
      { enemyType: "speedy", atSecond: 6 },
      { enemyType: "assassin", atSecond: 7 },
      { enemyType: "boss",   atSecond: 8 },
      { enemyType: "tank",   atSecond: 10 },
      { enemyType: "fast",   atSecond: 11 },
      { enemyType: "speedy", atSecond: 12 },
      { enemyType: "tank",   atSecond: 14 },
      { enemyType: "warlock", atSecond: 15 },
      { enemyType: "boss",   atSecond: 16 },
      { enemyType: "fast",   atSecond: 17 },
      { enemyType: "tank",   atSecond: 19 },
      { enemyType: "speedy", atSecond: 20 },
      { enemyType: "brute",  atSecond: 21 },
      { enemyType: "boss",   atSecond: 23 },
      { enemyType: "tank",   atSecond: 25 },
      { enemyType: "boss",   atSecond: 28 },
    ],
  },
  {
    id: 102,
    name: "EX: 灼熱地獄",
    enemyBaseHp: 2000,
    isEX: true,
    world: 2,
    spawnTable: [
      { enemyType: "speedy", atSecond: 1 },
      { enemyType: "speedy", atSecond: 2 },
      { enemyType: "boss",   atSecond: 3 },
      { enemyType: "tank",   atSecond: 5 },
      { enemyType: "speedy", atSecond: 6 },
      { enemyType: "tank",   atSecond: 8 },
      { enemyType: "warlock", atSecond: 9 },
      { enemyType: "boss",   atSecond: 10 },
      { enemyType: "speedy", atSecond: 12 },
      { enemyType: "tank",   atSecond: 13 },
      { enemyType: "assassin", atSecond: 14 },
      { enemyType: "boss",   atSecond: 15 },
      { enemyType: "speedy", atSecond: 16 },
      { enemyType: "tank",   atSecond: 18 },
      { enemyType: "brute",  atSecond: 19 },
      { enemyType: "boss",   atSecond: 20 },
      { enemyType: "tank",   atSecond: 22 },
      { enemyType: "boss",   atSecond: 25 },
      { enemyType: "boss",   atSecond: 28 },
    ],
  },
  {
    id: 103,
    name: "EX: 絶対零度",
    enemyBaseHp: 2500,
    isEX: true,
    world: 3,
    spawnTable: [
      { enemyType: "boss",   atSecond: 2 },
      { enemyType: "tank",   atSecond: 4 },
      { enemyType: "boss",   atSecond: 6 },
      { enemyType: "tank",   atSecond: 8 },
      { enemyType: "boss",   atSecond: 10 },
      { enemyType: "speedy", atSecond: 11 },
      { enemyType: "speedy", atSecond: 12 },
      { enemyType: "assassin", atSecond: 13 },
      { enemyType: "boss",   atSecond: 14 },
      { enemyType: "tank",   atSecond: 16 },
      { enemyType: "tank",   atSecond: 17 },
      { enemyType: "warlock", atSecond: 18 },
      { enemyType: "boss",   atSecond: 19 },
      { enemyType: "boss",   atSecond: 22 },
      { enemyType: "tank",   atSecond: 24 },
      { enemyType: "brute",  atSecond: 25 },
      { enemyType: "boss",   atSecond: 26 },
      { enemyType: "boss",   atSecond: 29 },
      { enemyType: "boss",   atSecond: 32 },
    ],
  },
];

// Normal stages only (for progression)
export const normalStages = stages.filter(s => !s.isEX);
// EX stages only
export const exStages = stages.filter(s => s.isEX);
