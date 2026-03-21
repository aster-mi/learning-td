import { INITIAL_UNITS, DEFAULT_PARTY } from "../data/unitCatalog";

export interface UnitUpgrade {
  hpLevel: number;
  atkLevel: number;
}

export interface GachaItem {
  type: string;
  value: number;
}

export interface CategoryRecord {
  correct: number;
  wrong: number;
}

export interface DailyActivity {
  plays: number;
  clears: number;
  correct: number;
  wrong: number;
  bestCombo: number;
  coinsEarned: number;
}

export interface LoginState {
  lastDate: string;
  streak: number;
}

export interface SaveData {
  coins: number;
  stageStars: Record<number, number>;
  unitUpgrades: Record<string, UnitUpgrade>;
  unlockedUnits: string[];
  party: string[];
  totalCorrect: number;
  totalWrong: number;
  maxCombo: number;
  achievements: string[];
  gachaItems: GachaItem[];
  categoryStats: Record<string, CategoryRecord>;
  dailyActivity: Record<string, DailyActivity>;
  missionClaims: string[];
  unitMastery: Record<string, number>;
  login: LoginState;
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
  categoryStats: {},
  dailyActivity: {},
  missionClaims: [],
  unitMastery: {},
  login: { lastDate: "", streak: 0 },
};

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE, unlockedUnits: [...DEFAULT_SAVE.unlockedUnits] };
    const parsed = JSON.parse(raw) as Partial<SaveData>;

    const units = parsed.unlockedUnits ?? [...INITIAL_UNITS];
    for (const unitId of INITIAL_UNITS) {
      if (!units.includes(unitId)) units.push(unitId);
    }

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
      categoryStats: parsed.categoryStats ?? {},
      dailyActivity: parsed.dailyActivity ?? {},
      missionClaims: parsed.missionClaims ?? [],
      unitMastery: parsed.unitMastery ?? {},
      login: parsed.login ?? { lastDate: "", streak: 0 },
    };
  } catch {
    return { ...DEFAULT_SAVE, unlockedUnits: [...DEFAULT_SAVE.unlockedUnits] };
  }
}

export function saveSave(data: SaveData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function calcStars(accuracy: number, baseHpRatio: number): number {
  if (accuracy >= 0.8 && baseHpRatio >= 0.5) return 3;
  if (accuracy >= 0.5 && baseHpRatio >= 0.3) return 2;
  return 1;
}

export function calcCoins(stars: number, accuracy: number, maxCombo: number): number {
  const base = 50;
  const starBonus = stars * 20;
  const accuracyBonus = Math.floor(accuracy * 50);
  const comboBonus = Math.min(maxCombo * 2, 30);
  return base + starBonus + accuracyBonus + comboBonus;
}

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
