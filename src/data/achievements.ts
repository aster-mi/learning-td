import type { SaveData } from "./saveData";

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  category: "quiz" | "battle" | "collection" | "special";
  check: (save: SaveData, extras?: AchievementExtras) => boolean;
}

export interface AchievementExtras {
  totalStagesCleared: number;
  totalStars: number;
  perfectStages: number;  // stages with 3 stars
}

export function getExtras(save: SaveData): AchievementExtras {
  const stars = Object.values(save.stageStars);
  return {
    totalStagesCleared: stars.length,
    totalStars: stars.reduce((a, b) => a + b, 0),
    perfectStages: stars.filter(s => s >= 3).length,
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── クイズ系 ──
  { id: "q1", title: "初めての正解", desc: "クイズに1問正解する", emoji: "✏️", category: "quiz",
    check: s => s.totalCorrect >= 1 },
  { id: "q2", title: "クイズマスター", desc: "累計50問正解", emoji: "📝", category: "quiz",
    check: s => s.totalCorrect >= 50 },
  { id: "q3", title: "知識の泉", desc: "累計200問正解", emoji: "🎓", category: "quiz",
    check: s => s.totalCorrect >= 200 },
  { id: "q4", title: "博識", desc: "累計500問正解", emoji: "📚", category: "quiz",
    check: s => s.totalCorrect >= 500 },
  { id: "q5", title: "全知全能", desc: "累計1000問正解", emoji: "🧠", category: "quiz",
    check: s => s.totalCorrect >= 1000 },

  // ── コンボ系 ──
  { id: "c1", title: "連続正解!", desc: "5コンボ達成", emoji: "🔥", category: "quiz",
    check: s => s.maxCombo >= 5 },
  { id: "c2", title: "コンボマスター", desc: "10コンボ達成", emoji: "💥", category: "quiz",
    check: s => s.maxCombo >= 10 },
  { id: "c3", title: "止まらない", desc: "20コンボ達成", emoji: "⚡", category: "quiz",
    check: s => s.maxCombo >= 20 },
  { id: "c4", title: "神の領域", desc: "50コンボ達成", emoji: "👑", category: "quiz",
    check: s => s.maxCombo >= 50 },

  // ── バトル系 ──
  { id: "b1", title: "初陣突破", desc: "ステージ1をクリア", emoji: "⚔️", category: "battle",
    check: (_s, e) => (e?.totalStagesCleared ?? 0) >= 1 },
  { id: "b2", title: "冒険者", desc: "3ステージクリア", emoji: "🗺️", category: "battle",
    check: (_s, e) => (e?.totalStagesCleared ?? 0) >= 3 },
  { id: "b3", title: "征服者", desc: "全6ステージクリア", emoji: "🏆", category: "battle",
    check: (_s, e) => (e?.totalStagesCleared ?? 0) >= 6 },
  { id: "b4", title: "完全制覇", desc: "全ステージで星3獲得", emoji: "🌟", category: "battle",
    check: (_s, e) => (e?.perfectStages ?? 0) >= 6 },
  { id: "b5", title: "星コレクター", desc: "合計星を10個獲得", emoji: "⭐", category: "battle",
    check: (_s, e) => (e?.totalStars ?? 0) >= 10 },

  // ── コレクション系 ──
  { id: "col1", title: "仲間集め", desc: "3種類のユニットを解放", emoji: "🐱", category: "collection",
    check: s => s.unlockedUnits.length >= 3 },
  { id: "col2", title: "フルメンバー", desc: "全5種類のユニットを解放", emoji: "🎪", category: "collection",
    check: s => s.unlockedUnits.length >= 5 },
  { id: "col3", title: "お金持ち", desc: "累計500コイン獲得", emoji: "💰", category: "collection",
    check: s => s.coins >= 500 },
  { id: "col4", title: "大富豪", desc: "累計2000コイン獲得", emoji: "💎", category: "collection",
    check: s => s.coins >= 2000 },

  // ── 特殊系 ──
  { id: "sp1", title: "失敗は成功の母", desc: "累計50問間違える", emoji: "😅", category: "special",
    check: s => s.totalWrong >= 50 },
  { id: "sp2", title: "不屈の闘志", desc: "累計100問間違える", emoji: "💪", category: "special",
    check: s => s.totalWrong >= 100 },
];

export function getUnlockedAchievements(save: SaveData): Achievement[] {
  const extras = getExtras(save);
  return ACHIEVEMENTS.filter(a => a.check(save, extras));
}

export function getNewAchievements(save: SaveData, prevUnlocked: string[]): Achievement[] {
  const prevSet = new Set(prevUnlocked);
  const extras = getExtras(save);
  return ACHIEVEMENTS.filter(a => a.check(save, extras) && !prevSet.has(a.id));
}
