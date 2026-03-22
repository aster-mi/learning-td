import { MAIN_CATEGORY_META, SUB_CATEGORIES, type MainCategory } from "./questions";
import type { DailyActivity, SaveData } from "./saveData";

export interface MissionDef {
  id: string;
  title: string;
  desc: string;
  rewardCoins: number;
  progress: number;
  target: number;
  claimed: boolean;
  scope: "daily" | "weekly";
}

export interface CategoryInsight {
  name: string;
  emoji: string;
  color: string;
  accuracy: number;
  correct: number;
  wrong: number;
}

const MISSION_BALANCE = {
  daily: {
    login: { rewardCoins: 20, target: 1 },
    correct: { rewardCoins: 60, target: 15 },
    clear: { rewardCoins: 60, target: 1 },
  },
  weekly: {
    correct: { rewardCoins: 150, target: 50 },
    clear: { rewardCoins: 150, target: 5 },
    combo: { rewardCoins: 100, target: 8 },
  },
} as const;

export function getDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getWeekKey(date = new Date()): string {
  const current = new Date(date);
  const day = current.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  current.setDate(current.getDate() + diff);
  return getDateKey(current);
}

export function ensureLoginProgress(save: SaveData, date = new Date()): SaveData {
  const today = getDateKey(date);
  if (save.login.lastDate === today) return save;

  const prevDate = save.login.lastDate ? new Date(save.login.lastDate) : null;
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const isConsecutive = prevDate ? getDateKey(prevDate) === getDateKey(yesterday) : false;

  return {
    ...save,
    login: {
      lastDate: today,
      streak: isConsecutive ? save.login.streak + 1 : 1,
    },
  };
}

function getActivity(save: SaveData, key: string): DailyActivity {
  return save.dailyActivity[key] ?? {
    plays: 0,
    clears: 0,
    correct: 0,
    wrong: 0,
    bestCombo: 0,
    coinsEarned: 0,
  };
}

export function getDailyWeeklyMissions(save: SaveData, date = new Date()): MissionDef[] {
  const todayKey = getDateKey(date);
  const weekKey = getWeekKey(date);
  const today = getActivity(save, todayKey);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(date);
    day.setDate(day.getDate() - index);
    return getDateKey(day);
  });
  const currentWeek = weekDays.filter((key) => key >= weekKey).map((key) => getActivity(save, key));
  const weekTotal = currentWeek.reduce(
    (acc, item) => ({
      plays: acc.plays + item.plays,
      clears: acc.clears + item.clears,
      correct: acc.correct + item.correct,
      wrong: acc.wrong + item.wrong,
      bestCombo: Math.max(acc.bestCombo, item.bestCombo),
      coinsEarned: acc.coinsEarned + item.coinsEarned,
    }),
    { plays: 0, clears: 0, correct: 0, wrong: 0, bestCombo: 0, coinsEarned: 0 },
  );

  const claims = new Set(save.missionClaims);
  const missions: Omit<MissionDef, "claimed">[] = [
    {
      id: `daily-login-${todayKey}`,
      title: "今日のログイン",
      desc: "1回ログインしてコインを受け取る",
      rewardCoins: MISSION_BALANCE.daily.login.rewardCoins,
      progress: 1,
      target: MISSION_BALANCE.daily.login.target,
      scope: "daily",
    },
    {
      id: `daily-correct-${todayKey}`,
      title: "今日の8問正解",
      desc: "今日は8問正解して学習ペースを作る",
      rewardCoins: MISSION_BALANCE.daily.correct.rewardCoins,
      progress: today.correct,
      target: MISSION_BALANCE.daily.correct.target,
      scope: "daily",
    },
    {
      id: `daily-clear-${todayKey}`,
      title: "今日の1ステージクリア",
      desc: "どれか1つのステージをクリアする",
      rewardCoins: MISSION_BALANCE.daily.clear.rewardCoins,
      progress: today.clears,
      target: MISSION_BALANCE.daily.clear.target,
      scope: "daily",
    },
    {
      id: `weekly-correct-${weekKey}`,
      title: "今週の35問正解",
      desc: "1週間で35問正解して安定して積み上げる",
      rewardCoins: MISSION_BALANCE.weekly.correct.rewardCoins,
      progress: weekTotal.correct,
      target: MISSION_BALANCE.weekly.correct.target,
      scope: "weekly",
    },
    {
      id: `weekly-clear-${weekKey}`,
      title: "今週の4ステージクリア",
      desc: "1週間で4ステージクリアして攻略を進める",
      rewardCoins: MISSION_BALANCE.weekly.clear.rewardCoins,
      progress: weekTotal.clears,
      target: MISSION_BALANCE.weekly.clear.target,
      scope: "weekly",
    },
    {
      id: `weekly-combo-${weekKey}`,
      title: "今週の12コンボ",
      desc: "1週間のどこかで12コンボに到達する",
      rewardCoins: MISSION_BALANCE.weekly.combo.rewardCoins,
      progress: weekTotal.bestCombo,
      target: MISSION_BALANCE.weekly.combo.target,
      scope: "weekly",
    },
  ];

  return missions.map((mission) => ({
    ...mission,
    claimed: claims.has(mission.id),
  }));
}

export function claimMission(save: SaveData, missionId: string, rewardCoins: number): SaveData {
  if (save.missionClaims.includes(missionId)) return save;
  return {
    ...save,
    coins: save.coins + rewardCoins,
    missionClaims: [...save.missionClaims, missionId],
  };
}

export function getCategoryInsights(save: SaveData): CategoryInsight[] {
  const mainToSubs = new Map<MainCategory, string[]>();
  for (const sub of SUB_CATEGORIES) {
    const current = mainToSubs.get(sub.main) ?? [];
    current.push(sub.name);
    mainToSubs.set(sub.main, current);
  }

  return Array.from(mainToSubs.entries())
    .map(([main, subs]) => {
      const totals = subs.reduce(
        (acc, sub) => {
          const current = save.categoryStats[sub] ?? { correct: 0, wrong: 0 };
          acc.correct += current.correct;
          acc.wrong += current.wrong;
          return acc;
        },
        { correct: 0, wrong: 0 },
      );
      const total = totals.correct + totals.wrong;
      const meta = MAIN_CATEGORY_META[main];
      return {
        name: main,
        emoji: meta.emoji,
        color: meta.color,
        correct: totals.correct,
        wrong: totals.wrong,
        accuracy: total > 0 ? totals.correct / total : 0,
      };
    })
    .sort((a, b) => {
      const totalA = a.correct + a.wrong;
      const totalB = b.correct + b.wrong;
      if (totalB !== totalA) return totalB - totalA;
      return b.accuracy - a.accuracy;
    });
}

export function getRecentActivity(save: SaveData, days = 7, date = new Date()) {
  return Array.from({ length: days }, (_, offset) => {
    const day = new Date(date);
    day.setDate(day.getDate() - (days - 1 - offset));
    const key = getDateKey(day);
    const stats = getActivity(save, key);
    return {
      key,
      label: `${day.getMonth() + 1}/${day.getDate()}`,
      correct: stats.correct,
      wrong: stats.wrong,
      plays: stats.plays,
    };
  });
}
