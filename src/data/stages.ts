export type EnemyType = "weak" | "fast" | "tank" | "speedy" | "boss";

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
}

export const stages: StageData[] = [
  {
    id: 1,
    name: "入門の地",
    enemyBaseHp: 300,
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
    spawnTable: [
      { enemyType: "speedy", atSecond: 1 },
      { enemyType: "fast",   atSecond: 2 },
      { enemyType: "speedy", atSecond: 4 },
      { enemyType: "tank",   atSecond: 5 },
      { enemyType: "fast",   atSecond: 7 },
      { enemyType: "speedy", atSecond: 8 },
      { enemyType: "tank",   atSecond: 10 },
      { enemyType: "weak",   atSecond: 11 },
      { enemyType: "boss",   atSecond: 13 },
      { enemyType: "fast",   atSecond: 15 },
      { enemyType: "speedy", atSecond: 16 },
      { enemyType: "tank",   atSecond: 18 },
      { enemyType: "fast",   atSecond: 20 },
      { enemyType: "tank",   atSecond: 22 },
      { enemyType: "speedy", atSecond: 24 },
      { enemyType: "boss",   atSecond: 27 },
      { enemyType: "tank",   atSecond: 30 },
    ],
  },
];
