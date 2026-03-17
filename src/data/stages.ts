export type EnemyType = "weak" | "fast" | "tank";

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
      { enemyType: "weak", atSecond: 2 },
      { enemyType: "weak", atSecond: 5 },
      { enemyType: "weak", atSecond: 8 },
      { enemyType: "fast", atSecond: 12 },
      { enemyType: "weak", atSecond: 15 },
      { enemyType: "weak", atSecond: 18 },
      { enemyType: "fast", atSecond: 22 },
      { enemyType: "tank", atSecond: 28 },
    ],
  },
  {
    id: 2,
    name: "試練の荒野",
    enemyBaseHp: 500,
    spawnTable: [
      { enemyType: "fast", atSecond: 2 },
      { enemyType: "weak", atSecond: 4 },
      { enemyType: "fast", atSecond: 6 },
      { enemyType: "tank", atSecond: 10 },
      { enemyType: "weak", atSecond: 12 },
      { enemyType: "fast", atSecond: 14 },
      { enemyType: "tank", atSecond: 18 },
      { enemyType: "fast", atSecond: 22 },
      { enemyType: "tank", atSecond: 26 },
      { enemyType: "weak", atSecond: 28 },
      { enemyType: "tank", atSecond: 32 },
    ],
  },
  {
    id: 3,
    name: "決戦の城",
    enemyBaseHp: 800,
    spawnTable: [
      { enemyType: "fast", atSecond: 1 },
      { enemyType: "fast", atSecond: 3 },
      { enemyType: "tank", atSecond: 5 },
      { enemyType: "fast", atSecond: 7 },
      { enemyType: "tank", atSecond: 9 },
      { enemyType: "weak", atSecond: 10 },
      { enemyType: "fast", atSecond: 12 },
      { enemyType: "tank", atSecond: 15 },
      { enemyType: "fast", atSecond: 17 },
      { enemyType: "tank", atSecond: 20 },
      { enemyType: "fast", atSecond: 22 },
      { enemyType: "tank", atSecond: 25 },
      { enemyType: "tank", atSecond: 28 },
    ],
  },
];
