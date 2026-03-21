export type EnemyType =
  | "weak"
  | "fast"
  | "tank"
  | "speedy"
  | "assassin"
  | "brute"
  | "warlock"
  | "boss";

export type StageThemeKey =
  | "meadowMorning"
  | "meadowSunset"
  | "meadowRuins"
  | "desertNoon"
  | "desertSunset"
  | "desertStorm"
  | "glacierDawn"
  | "glacierNight"
  | "glacierAurora"
  | "volcanoForge"
  | "volcanoAsh"
  | "volcanoCitadel"
  | "ruinsCanal"
  | "ruinsNight"
  | "ruinsSanctum";

export interface SpawnEntry {
  atSecond: number;
  enemyType: EnemyType;
}

export interface StageData {
  id: number;
  name: string;
  enemyBaseHp: number;
  spawnTable: SpawnEntry[];
  isEX?: boolean;
  world?: number;
  themeKey: StageThemeKey;
}

export interface WorldThemeMeta {
  id: number;
  name: string;
  emoji: string;
  bg: string;
  accent: string;
  path: string;
}

export const WORLD_THEME_META: Record<number, WorldThemeMeta> = {
  1: { id: 1, name: "草原", emoji: "🌿", bg: "#0d2f1c", accent: "#4ade80", path: "#22c55e" },
  2: { id: 2, name: "砂漠", emoji: "🏜️", bg: "#36210b", accent: "#f59e0b", path: "#d97706" },
  3: { id: 3, name: "氷原", emoji: "❄️", bg: "#10263c", accent: "#7dd3fc", path: "#38bdf8" },
  4: { id: 4, name: "火山", emoji: "🌋", bg: "#2b120d", accent: "#fb7185", path: "#ef4444" },
  5: { id: 5, name: "遺跡", emoji: "🏛️", bg: "#162430", accent: "#a78bfa", path: "#8b5cf6" },
};

export const stages: StageData[] = [
  {
    id: 1,
    name: "はじまりの原っぱ",
    enemyBaseHp: 300,
    world: 1,
    themeKey: "meadowMorning",
    spawnTable: [
      { enemyType: "weak", atSecond: 2 },
      { enemyType: "weak", atSecond: 5 },
      { enemyType: "speedy", atSecond: 8 },
      { enemyType: "weak", atSecond: 10 },
      { enemyType: "fast", atSecond: 13 },
      { enemyType: "speedy", atSecond: 16 },
      { enemyType: "weak", atSecond: 18 },
      { enemyType: "fast", atSecond: 22 },
      { enemyType: "tank", atSecond: 28 },
    ],
  },
  {
    id: 2,
    name: "夕風の見晴らし丘",
    enemyBaseHp: 500,
    world: 1,
    themeKey: "meadowSunset",
    spawnTable: [
      { enemyType: "fast", atSecond: 2 },
      { enemyType: "speedy", atSecond: 4 },
      { enemyType: "weak", atSecond: 5 },
      { enemyType: "fast", atSecond: 7 },
      { enemyType: "speedy", atSecond: 9 },
      { enemyType: "tank", atSecond: 11 },
      { enemyType: "weak", atSecond: 13 },
      { enemyType: "fast", atSecond: 15 },
      { enemyType: "speedy", atSecond: 17 },
      { enemyType: "tank", atSecond: 20 },
      { enemyType: "fast", atSecond: 23 },
      { enemyType: "tank", atSecond: 27 },
      { enemyType: "boss", atSecond: 32 },
    ],
  },
  {
    id: 3,
    name: "古樹の小道",
    enemyBaseHp: 800,
    world: 1,
    themeKey: "meadowRuins",
    spawnTable: [
      { enemyType: "speedy", atSecond: 1 },
      { enemyType: "fast", atSecond: 2 },
      { enemyType: "speedy", atSecond: 4 },
      { enemyType: "tank", atSecond: 5 },
      { enemyType: "fast", atSecond: 7 },
      { enemyType: "speedy", atSecond: 8 },
      { enemyType: "assassin", atSecond: 9 },
      { enemyType: "tank", atSecond: 10 },
      { enemyType: "weak", atSecond: 11 },
      { enemyType: "boss", atSecond: 13 },
      { enemyType: "fast", atSecond: 15 },
      { enemyType: "speedy", atSecond: 16 },
      { enemyType: "tank", atSecond: 18 },
      { enemyType: "fast", atSecond: 20 },
      { enemyType: "tank", atSecond: 22 },
      { enemyType: "speedy", atSecond: 24 },
      { enemyType: "warlock", atSecond: 25 },
      { enemyType: "boss", atSecond: 27 },
      { enemyType: "tank", atSecond: 30 },
    ],
  },
  {
    id: 4,
    name: "白砂の入口",
    enemyBaseHp: 600,
    world: 2,
    themeKey: "desertNoon",
    spawnTable: [
      { enemyType: "speedy", atSecond: 1 },
      { enemyType: "speedy", atSecond: 3 },
      { enemyType: "speedy", atSecond: 5 },
      { enemyType: "fast", atSecond: 7 },
      { enemyType: "speedy", atSecond: 9 },
      { enemyType: "fast", atSecond: 11 },
      { enemyType: "tank", atSecond: 14 },
      { enemyType: "speedy", atSecond: 16 },
      { enemyType: "speedy", atSecond: 18 },
      { enemyType: "boss", atSecond: 22 },
    ],
  },
  {
    id: 5,
    name: "灼熱の隊商路",
    enemyBaseHp: 900,
    world: 2,
    themeKey: "desertSunset",
    spawnTable: [
      { enemyType: "tank", atSecond: 2 },
      { enemyType: "fast", atSecond: 4 },
      { enemyType: "tank", atSecond: 6 },
      { enemyType: "speedy", atSecond: 8 },
      { enemyType: "tank", atSecond: 10 },
      { enemyType: "brute", atSecond: 12 },
      { enemyType: "boss", atSecond: 13 },
      { enemyType: "fast", atSecond: 15 },
      { enemyType: "tank", atSecond: 17 },
      { enemyType: "speedy", atSecond: 19 },
      { enemyType: "tank", atSecond: 21 },
      { enemyType: "fast", atSecond: 23 },
      { enemyType: "warlock", atSecond: 24 },
      { enemyType: "boss", atSecond: 26 },
      { enemyType: "tank", atSecond: 29 },
    ],
  },
  {
    id: 6,
    name: "砂嵐の峡谷",
    enemyBaseHp: 1150,
    world: 2,
    themeKey: "desertStorm",
    spawnTable: [
      { enemyType: "fast", atSecond: 1 },
      { enemyType: "speedy", atSecond: 2 },
      { enemyType: "tank", atSecond: 4 },
      { enemyType: "speedy", atSecond: 6 },
      { enemyType: "assassin", atSecond: 8 },
      { enemyType: "tank", atSecond: 10 },
      { enemyType: "brute", atSecond: 12 },
      { enemyType: "fast", atSecond: 14 },
      { enemyType: "warlock", atSecond: 16 },
      { enemyType: "boss", atSecond: 19 },
      { enemyType: "tank", atSecond: 22 },
      { enemyType: "boss", atSecond: 25 },
    ],
  },
  {
    id: 7,
    name: "青氷の岸辺",
    enemyBaseHp: 1250,
    world: 3,
    themeKey: "glacierDawn",
    spawnTable: [
      { enemyType: "tank", atSecond: 1 },
      { enemyType: "speedy", atSecond: 3 },
      { enemyType: "fast", atSecond: 5 },
      { enemyType: "tank", atSecond: 7 },
      { enemyType: "boss", atSecond: 9 },
      { enemyType: "speedy", atSecond: 12 },
      { enemyType: "tank", atSecond: 15 },
      { enemyType: "warlock", atSecond: 17 },
      { enemyType: "boss", atSecond: 20 },
      { enemyType: "brute", atSecond: 23 },
    ],
  },
  {
    id: 8,
    name: "月光の凍原",
    enemyBaseHp: 1450,
    world: 3,
    themeKey: "glacierNight",
    spawnTable: [
      { enemyType: "speedy", atSecond: 1 },
      { enemyType: "tank", atSecond: 3 },
      { enemyType: "assassin", atSecond: 5 },
      { enemyType: "fast", atSecond: 7 },
      { enemyType: "boss", atSecond: 10 },
      { enemyType: "tank", atSecond: 12 },
      { enemyType: "warlock", atSecond: 14 },
      { enemyType: "boss", atSecond: 16 },
      { enemyType: "brute", atSecond: 19 },
      { enemyType: "tank", atSecond: 22 },
      { enemyType: "boss", atSecond: 25 },
    ],
  },
  {
    id: 9,
    name: "極光の氷門",
    enemyBaseHp: 1700,
    world: 3,
    themeKey: "glacierAurora",
    spawnTable: [
      { enemyType: "tank", atSecond: 1 },
      { enemyType: "boss", atSecond: 4 },
      { enemyType: "speedy", atSecond: 6 },
      { enemyType: "fast", atSecond: 8 },
      { enemyType: "assassin", atSecond: 10 },
      { enemyType: "tank", atSecond: 12 },
      { enemyType: "warlock", atSecond: 14 },
      { enemyType: "boss", atSecond: 17 },
      { enemyType: "brute", atSecond: 20 },
      { enemyType: "tank", atSecond: 23 },
      { enemyType: "boss", atSecond: 26 },
      { enemyType: "boss", atSecond: 30 },
    ],
  },
  {
    id: 10,
    name: "熔岩の作業路",
    enemyBaseHp: 1850,
    world: 4,
    themeKey: "volcanoForge",
    spawnTable: [
      { enemyType: "fast", atSecond: 1 },
      { enemyType: "tank", atSecond: 3 },
      { enemyType: "boss", atSecond: 5 },
      { enemyType: "speedy", atSecond: 7 },
      { enemyType: "brute", atSecond: 9 },
      { enemyType: "warlock", atSecond: 11 },
      { enemyType: "tank", atSecond: 13 },
      { enemyType: "boss", atSecond: 16 },
      { enemyType: "assassin", atSecond: 19 },
      { enemyType: "tank", atSecond: 22 },
      { enemyType: "boss", atSecond: 25 },
    ],
  },
  {
    id: 11,
    name: "灰降る火口壁",
    enemyBaseHp: 2100,
    world: 4,
    themeKey: "volcanoAsh",
    spawnTable: [
      { enemyType: "tank", atSecond: 1 },
      { enemyType: "boss", atSecond: 3 },
      { enemyType: "speedy", atSecond: 5 },
      { enemyType: "warlock", atSecond: 7 },
      { enemyType: "brute", atSecond: 9 },
      { enemyType: "tank", atSecond: 11 },
      { enemyType: "boss", atSecond: 13 },
      { enemyType: "assassin", atSecond: 15 },
      { enemyType: "tank", atSecond: 18 },
      { enemyType: "boss", atSecond: 21 },
      { enemyType: "brute", atSecond: 24 },
      { enemyType: "boss", atSecond: 28 },
    ],
  },
  {
    id: 12,
    name: "黒鉄の火山城",
    enemyBaseHp: 2400,
    world: 4,
    themeKey: "volcanoCitadel",
    spawnTable: [
      { enemyType: "boss", atSecond: 2 },
      { enemyType: "tank", atSecond: 4 },
      { enemyType: "boss", atSecond: 6 },
      { enemyType: "speedy", atSecond: 7 },
      { enemyType: "warlock", atSecond: 9 },
      { enemyType: "assassin", atSecond: 11 },
      { enemyType: "tank", atSecond: 13 },
      { enemyType: "boss", atSecond: 15 },
      { enemyType: "brute", atSecond: 18 },
      { enemyType: "tank", atSecond: 21 },
      { enemyType: "boss", atSecond: 24 },
      { enemyType: "boss", atSecond: 28 },
      { enemyType: "boss", atSecond: 32 },
    ],
  },
  {
    id: 101,
    name: "EX: 草原の水路遺跡",
    enemyBaseHp: 1500,
    isEX: true,
    world: 5,
    themeKey: "ruinsCanal",
    spawnTable: [
      { enemyType: "fast", atSecond: 1 },
      { enemyType: "fast", atSecond: 2 },
      { enemyType: "speedy", atSecond: 3 },
      { enemyType: "tank", atSecond: 4 },
      { enemyType: "fast", atSecond: 5 },
      { enemyType: "speedy", atSecond: 6 },
      { enemyType: "assassin", atSecond: 7 },
      { enemyType: "boss", atSecond: 8 },
      { enemyType: "tank", atSecond: 10 },
      { enemyType: "fast", atSecond: 11 },
      { enemyType: "speedy", atSecond: 12 },
      { enemyType: "tank", atSecond: 14 },
      { enemyType: "warlock", atSecond: 15 },
      { enemyType: "boss", atSecond: 16 },
      { enemyType: "fast", atSecond: 17 },
      { enemyType: "tank", atSecond: 19 },
      { enemyType: "speedy", atSecond: 20 },
      { enemyType: "brute", atSecond: 21 },
      { enemyType: "boss", atSecond: 23 },
      { enemyType: "tank", atSecond: 25 },
      { enemyType: "boss", atSecond: 28 },
    ],
  },
  {
    id: 102,
    name: "EX: 深夜の石廊",
    enemyBaseHp: 2000,
    isEX: true,
    world: 5,
    themeKey: "ruinsNight",
    spawnTable: [
      { enemyType: "speedy", atSecond: 1 },
      { enemyType: "speedy", atSecond: 2 },
      { enemyType: "boss", atSecond: 3 },
      { enemyType: "tank", atSecond: 5 },
      { enemyType: "speedy", atSecond: 6 },
      { enemyType: "tank", atSecond: 8 },
      { enemyType: "warlock", atSecond: 9 },
      { enemyType: "boss", atSecond: 10 },
      { enemyType: "speedy", atSecond: 12 },
      { enemyType: "tank", atSecond: 13 },
      { enemyType: "assassin", atSecond: 14 },
      { enemyType: "boss", atSecond: 15 },
      { enemyType: "speedy", atSecond: 16 },
      { enemyType: "tank", atSecond: 18 },
      { enemyType: "brute", atSecond: 19 },
      { enemyType: "boss", atSecond: 20 },
      { enemyType: "tank", atSecond: 22 },
      { enemyType: "boss", atSecond: 25 },
      { enemyType: "boss", atSecond: 28 },
    ],
  },
  {
    id: 103,
    name: "EX: 星見の神殿",
    enemyBaseHp: 2500,
    isEX: true,
    world: 5,
    themeKey: "ruinsSanctum",
    spawnTable: [
      { enemyType: "boss", atSecond: 2 },
      { enemyType: "tank", atSecond: 4 },
      { enemyType: "boss", atSecond: 6 },
      { enemyType: "tank", atSecond: 8 },
      { enemyType: "boss", atSecond: 10 },
      { enemyType: "speedy", atSecond: 11 },
      { enemyType: "speedy", atSecond: 12 },
      { enemyType: "assassin", atSecond: 13 },
      { enemyType: "boss", atSecond: 14 },
      { enemyType: "tank", atSecond: 16 },
      { enemyType: "tank", atSecond: 17 },
      { enemyType: "warlock", atSecond: 18 },
      { enemyType: "boss", atSecond: 19 },
      { enemyType: "boss", atSecond: 22 },
      { enemyType: "tank", atSecond: 24 },
      { enemyType: "brute", atSecond: 25 },
      { enemyType: "boss", atSecond: 26 },
      { enemyType: "boss", atSecond: 29 },
      { enemyType: "boss", atSecond: 32 },
    ],
  },
];

export const normalStages = stages.filter((stage) => !stage.isEX);
export const exStages = stages.filter((stage) => stage.isEX);
