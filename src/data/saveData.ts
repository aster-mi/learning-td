import { DEFAULT_PARTY, INITIAL_UNITS, UNIT_CATALOG } from "../data/unitCatalog";
import { SUB_CATEGORIES } from "./questions";

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
  rescueCount: number;
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
  badges?: string[];
  tutorialSeen?: boolean;
}

const STORAGE_KEY = "learning_td_save";
const MAX_DAILY_ACTIVITY_DAYS = 90;
const MAX_MISSION_CLAIMS = 100;
const QUOTA_RETRY_DAILY_ACTIVITY_DAYS = [30, 14, 7];
const QUOTA_RETRY_MISSION_CLAIMS = [50, 20, 10];

const VALID_SUB_CATEGORY_SET = new Set(SUB_CATEGORIES.map((entry) => entry.name));
const VALID_UNIT_ID_SET = new Set(UNIT_CATALOG.map((unit) => unit.id));

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
  login: { lastDate: "", streak: 0, rescueCount: 0 },
};

function isValidDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function sortDateKeysDesc(a: string, b: string): number {
  return b.localeCompare(a);
}

function pruneDailyActivity(activity: Record<string, DailyActivity>): Record<string, DailyActivity> {
  return Object.fromEntries(
    Object.entries(activity)
      .filter(
        ([key, value]) =>
          isValidDateKey(key) &&
          typeof value === "object" &&
          value !== null &&
          Number.isFinite(value.plays) &&
          Number.isFinite(value.clears) &&
          Number.isFinite(value.correct) &&
          Number.isFinite(value.wrong) &&
          Number.isFinite(value.bestCombo) &&
          Number.isFinite(value.coinsEarned),
      )
      .sort(([left], [right]) => sortDateKeysDesc(left, right))
      .slice(0, MAX_DAILY_ACTIVITY_DAYS),
  );
}

function extractClaimDate(claimId: string): string {
  const match = claimId.match(/(\d{4}-\d{2}-\d{2})$/);
  return match?.[1] ?? "";
}

function pruneMissionClaims(claims: string[]): string[] {
  return [...new Set(claims)]
    .filter((claim) => typeof claim === "string" && claim.length > 0)
    .sort((left, right) => {
      const leftDate = extractClaimDate(left);
      const rightDate = extractClaimDate(right);
      if (leftDate !== rightDate) {
        return rightDate.localeCompare(leftDate);
      }
      return right.localeCompare(left);
    })
    .slice(0, MAX_MISSION_CLAIMS);
}

function pruneMissionClaimsToLimit(claims: string[], limit: number): string[] {
  return pruneMissionClaims(claims).slice(0, limit);
}

function pruneDailyActivityToLimit(
  activity: Record<string, DailyActivity>,
  limit: number,
): Record<string, DailyActivity> {
  return Object.fromEntries(Object.entries(pruneDailyActivity(activity)).slice(0, limit));
}

function pruneCategoryStats(stats: Record<string, CategoryRecord>): Record<string, CategoryRecord> {
  return Object.fromEntries(
    Object.entries(stats).filter(
      ([key, value]) =>
        VALID_SUB_CATEGORY_SET.has(key) &&
        typeof value === "object" &&
        value !== null &&
        Number.isFinite(value.correct) &&
        Number.isFinite(value.wrong),
    ),
  );
}

function sanitizeSaveData(data: SaveData): SaveData {
  const unlockedUnits = [...new Set(data.unlockedUnits.filter((unitId) => VALID_UNIT_ID_SET.has(unitId)))];
  for (const unitId of INITIAL_UNITS) {
    if (!unlockedUnits.includes(unitId)) {
      unlockedUnits.push(unitId);
    }
  }

  let party = data.party.filter((unitId) => unlockedUnits.includes(unitId));
  if (party.length === 0) {
    party = unlockedUnits.slice(0, 5);
  }

  return {
    ...data,
    unlockedUnits,
    party,
    achievements: [...new Set(data.achievements)],
    categoryStats: pruneCategoryStats(data.categoryStats),
    dailyActivity: pruneDailyActivity(data.dailyActivity),
    missionClaims: pruneMissionClaims(data.missionClaims),
    unitMastery: Object.fromEntries(
      Object.entries(data.unitMastery).filter(([key, value]) => VALID_UNIT_ID_SET.has(key) && Number.isFinite(value)),
    ),
    gachaItems: data.gachaItems.filter(
      (item) => typeof item?.type === "string" && item.type.length > 0 && Number.isFinite(item.value),
    ),
  };
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE, unlockedUnits: [...DEFAULT_SAVE.unlockedUnits] };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return loadSaveFrom(parsed);
  } catch (e) {
    console.warn("[SaveData] Failed to load save, using defaults:", e);
    return { ...DEFAULT_SAVE, unlockedUnits: [...DEFAULT_SAVE.unlockedUnits] };
  }
}

export function saveSave(data: SaveData): void {
  const sanitized = sanitizeSaveData(data);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn("[SaveData] localStorage quota exceeded; pruning stored history more aggressively");
      for (let index = 0; index < QUOTA_RETRY_DAILY_ACTIVITY_DAYS.length; index += 1) {
        const pruned = {
          ...sanitized,
          dailyActivity: pruneDailyActivityToLimit(sanitized.dailyActivity, QUOTA_RETRY_DAILY_ACTIVITY_DAYS[index]),
          missionClaims: pruneMissionClaimsToLimit(sanitized.missionClaims, QUOTA_RETRY_MISSION_CLAIMS[index]),
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
          return;
        } catch (retryError) {
          if (!(retryError instanceof DOMException) || retryError.name !== "QuotaExceededError") {
            console.error("[SaveData] Failed to save after quota fallback:", retryError);
            return;
          }
        }
      }
      console.error("[SaveData] Still over quota after aggressive pruning");
      return;
      console.warn("[SaveData] localStorage quota exceeded – pruning old data");
      // Aggressive prune: keep only 30 days of activity
      const pruned = {
        ...sanitizeSaveData(data),
        dailyActivity: Object.fromEntries(
          Object.entries(data.dailyActivity)
            .filter(([key]) => isValidDateKey(key))
            .sort(([a], [b]) => sortDateKeysDesc(a, b))
            .slice(0, 30),
        ),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
      } catch {
        console.error("[SaveData] Still over quota after pruning");
      }
    } else {
      console.error("[SaveData] Failed to save:", e);
    }
  }
}

/** Export save data as JSON string for backup */
export function exportSave(): string {
  return localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(DEFAULT_SAVE);
}

/** Import save data from JSON string, returns true on success */
export function importSave(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as Partial<SaveData>;
    if (!parsed || typeof parsed !== "object") return false;
    // Validate minimum structure
    if (!Array.isArray(parsed.unlockedUnits)) return false;
    const full = loadSaveFrom(parsed);
    saveSave(full);
    return true;
  } catch {
    return false;
  }
}

function loadSaveFrom(parsed: Partial<SaveData>): SaveData {
  const units = parsed.unlockedUnits ?? [...INITIAL_UNITS];
  for (const unitId of INITIAL_UNITS) {
    if (!units.includes(unitId)) units.push(unitId);
  }
  let party = parsed.party ?? [...DEFAULT_PARTY];
  party = party.filter((id: string) => units.includes(id));
  if (party.length === 0) party = units.slice(0, 5);

  return sanitizeSaveData({
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
    login: parsed.login
      ? { lastDate: parsed.login.lastDate ?? "", streak: parsed.login.streak ?? 0, rescueCount: parsed.login.rescueCount ?? 0 }
      : { lastDate: "", streak: 0, rescueCount: 0 },
    tutorialSeen: parsed.tutorialSeen ?? false,
  });
}

export function calcStars(accuracy: number, baseHpRatio: number): number {
  if (accuracy >= 0.8 && baseHpRatio >= 0.5) return 3;
  if (accuracy >= 0.5 && baseHpRatio >= 0.3) return 2;
  return 1;
}

/**
 * コイン報酬を計算する。
 * stageId: ステージ番号（ワールドが進むほど報酬UP）
 * selectedLevel: 選択難易度（1-10）。高いほど報酬UP。0は標準(7)扱い。
 */
export function calcCoins(
  stars: number, accuracy: number, maxCombo: number,
  stageId: number = 1, selectedLevel: number = 7,
): number {
  const base = 50;
  const starBonus = stars * 25;                       // 20→25
  const accuracyBonus = Math.floor(accuracy * 50);
  const comboBonus = Math.min(maxCombo * 3, 45);      // 2→3, cap 30→45
  const raw = base + starBonus + accuracyBonus + comboBonus;

  // ステージ進行ボーナス: ワールドが進むほど +15% ずつ
  // id 1-3 → world1(×1.0), 4-6 → world2(×1.15), 7-9 → world3(×1.30),
  // 10-12 → world4(×1.45), EX(101+) → ×1.60
  const worldTier = stageId >= 100 ? 5 : Math.ceil(stageId / 3);
  const stageMult = 1 + (worldTier - 1) * 0.15;

  // 難易度ボーナス: Lv.1→×0.6, Lv.7(標準)→×1.0, Lv.10→×1.3
  const lv = selectedLevel <= 0 ? 7 : Math.max(1, Math.min(10, selectedLevel));
  const levelMult = lv <= 7
    ? 0.6 + (lv - 1) * (0.4 / 6)    // Lv.1~7: 0.60→1.00
    : 1.0 + (lv - 7) * (0.3 / 3);   // Lv.8~10: 1.00→1.30

  return Math.round(raw * stageMult * levelMult);
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
