import { INITIAL_UNITS, DEFAULT_PARTY } from "../data/unitCatalog";

// ── セーブデータ型定義 ────────────────────────────────────
export interface UnitUpgrade {
  hpLevel: number;   // 0 = no upgrade, max 5
  atkLevel: number;  // 0 = no upgrade, max 5
}

export interface GachaItem {
  type: string;
  value: number;
}

export interface SaveData {
  coins: number;
  stageStars: Record<number, number>;        // stageId → 1|2|3
  unitUpgrades: Record<string, UnitUpgrade>; // unitId → upgrade levels
  unlockedUnits: string[];                   // 所持ユニットID[]
  party: string[];                           // 出陣デッキ (最大5体)
  totalCorrect: number;
  totalWrong: number;
  maxCombo: number;
  achievements: string[];                    // unlocked achievement IDs
  gachaItems: GachaItem[];                   // stored gacha rewards for next game
}

const STORAGE_KEY = "learning_td_save";

const DEFAULT_SAVE: SaveData = {
  coins: 0,
  stageStars: {},
  unitUpgrades: {},
  unlockedUnits: [...INITIAL_UNITS],
  party: [...DEFAULT_PARTY],
  totalCorrect: 0,
  totalWrong: 0,
  maxCombo: 0,
  achievements: [],
  gachaItems: [],
};

// ── ロード / セーブ ────────────────────────────────────────
export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE, unlockedUnits: [...DEFAULT_SAVE.unlockedUnits] };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    // 所持ユニットに初期ユニットが含まれているか確認
    const units = parsed.unlockedUnits ?? [...INITIAL_UNITS];
    for (const u of INITIAL_UNITS) {
      if (!units.includes(u)) units.push(u);
    }
    // パーティのバリデーション（所持ユニットのみ）
    let party = parsed.party ?? [...DEFAULT_PARTY];
    party = party.filter((id: string) => units.includes(id));
    if (party.length === 0) party = units.slice(0, 5);

    return {
      coins: parsed.coins ?? DEFAULT_SAVE.coins,
      stageStars: parsed.stageStars ?? {},
      unitUpgrades: parsed.unitUpgrades ?? {},
      unlockedUnits: units,
      party,
      totalCorrect: parsed.totalCorrect ?? 0,
      totalWrong: parsed.totalWrong ?? 0,
      maxCombo: parsed.maxCombo ?? 0,
      achievements: parsed.achievements ?? [],
      gachaItems: parsed.gachaItems ?? [],
    };
  } catch {
    return { ...DEFAULT_SAVE, unlockedUnits: [...DEFAULT_SAVE.unlockedUnits] };
  }
}

export function saveSave(data: SaveData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── 星評価の計算 ────────────────────────────────────────────
export function calcStars(accuracy: number, baseHpRatio: number): number {
  if (accuracy >= 0.8 && baseHpRatio >= 0.5) return 3;
  if (accuracy >= 0.5 && baseHpRatio >= 0.3) return 2;
  return 1;
}

// ── コイン報酬の計算 ────────────────────────────────────────
export function calcCoins(stars: number, accuracy: number, maxCombo: number): number {
  const base = 50;
  const starBonus = stars * 20;
  const accuracyBonus = Math.floor(accuracy * 50);
  const comboBonus = Math.min(maxCombo * 2, 30);
  return base + starBonus + accuracyBonus + comboBonus;
}

// ── ユニット解放条件（ステージクリア報酬）────────────────────
export const UNLOCK_TABLE: Record<number, string> = {
  2: "tank",
  4: "shooter",
  5: "bomber",
};

export function getNewUnlock(stageId: number, currentUnlocks: string[]): string | null {
  const unlock = UNLOCK_TABLE[stageId];
  if (unlock && !currentUnlocks.includes(unlock)) return unlock;
  return null;
}

// ── ユニット強化 ────────────────────────────────────────────
const UPGRADE_COSTS = [100, 200, 350, 550, 800];
const HP_BONUS_PER_LEVEL = 0.15;
const ATK_BONUS_PER_LEVEL = 0.12;
export const MAX_UPGRADE_LEVEL = 5;

export function getUpgradeCost(currentLevel: number): number | null {
  if (currentLevel >= MAX_UPGRADE_LEVEL) return null;
  return UPGRADE_COSTS[currentLevel];
}

export function getHpMultiplier(level: number): number {
  return 1 + level * HP_BONUS_PER_LEVEL;
}

export function getAtkMultiplier(level: number): number {
  return 1 + level * ATK_BONUS_PER_LEVEL;
}

export function getUpgrade(data: SaveData, unitId: string): UnitUpgrade {
  return data.unitUpgrades[unitId] ?? { hpLevel: 0, atkLevel: 0 };
}
