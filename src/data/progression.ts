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

interface MissionProgressSnapshot {
  todayKey: string;
  weekKey: string;
  today: DailyActivity;
  weekTotal: DailyActivity;
}

interface MissionTemplate {
  key: string;
  scope: MissionDef["scope"];
  target: number;
  rewardCoins: number;
  getId: (snapshot: MissionProgressSnapshot) => string;
  getProgress: (snapshot: MissionProgressSnapshot) => number;
  title: (target: number) => string;
  desc: (target: number) => string;
}

const MISSION_TEMPLATES: readonly MissionTemplate[] = [
  {
    key: "daily-login",
    scope: "daily",
    target: 1,
    rewardCoins: 20,
    getId: ({ todayKey }) => `daily-login-${todayKey}`,
    getProgress: () => 1,
    title: () => "今日のログイン",
    desc: () => "1回ログインしてコインを受け取る",
  },
  {
    key: "daily-correct",
    scope: "daily",
    target: 8,
    rewardCoins: 40,
    getId: ({ todayKey }) => `daily-correct-${todayKey}`,
    getProgress: ({ today }) => today.correct,
    title: (target) => `今日の${target}問正解`,
    desc: (target) => `今日は${target}問正解して学習ペースを作る`,
  },
  {
    key: "daily-clear",
    scope: "daily",
    target: 1,
    rewardCoins: 40,
    getId: ({ todayKey }) => `daily-clear-${todayKey}`,
    getProgress: ({ today }) => today.clears,
    title: (target) => `今日の${target}ステージクリア`,
    desc: (target) => `どれか${target}つのステージをクリアする`,
  },
  {
    key: "weekly-correct",
    scope: "weekly",
    target: 35,
    rewardCoins: 100,
    getId: ({ weekKey }) => `weekly-correct-${weekKey}`,
    getProgress: ({ weekTotal }) => weekTotal.correct,
    title: (target) => `今週の${target}問正解`,
    desc: (target) => `1週間で${target}問正解して安定して積み上げる`,
  },
  {
    key: "weekly-clear",
    scope: "weekly",
    target: 4,
    rewardCoins: 120,
    getId: ({ weekKey }) => `weekly-clear-${weekKey}`,
    getProgress: ({ weekTotal }) => weekTotal.clears,
    title: (target) => `今週の${target}ステージクリア`,
    desc: (target) => `1週間で${target}ステージクリアして攻略を進める`,
  },
  {
    key: "weekly-combo",
    scope: "weekly",
    target: 12,
    rewardCoins: 80,
    getId: ({ weekKey }) => `weekly-combo-${weekKey}`,
    getProgress: ({ weekTotal }) => weekTotal.bestCombo,
    title: (target) => `今週の${target}コンボ`,
    desc: (target) => `1週間のどこかで${target}コンボに到達する`,
  },
] as const;

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

  const snapshot: MissionProgressSnapshot = {
    todayKey,
    weekKey,
    today,
    weekTotal,
  };
  const claims = new Set(save.missionClaims);
  return MISSION_TEMPLATES.map((mission) => {
    const id = mission.getId(snapshot);
    return {
      id,
      title: mission.title(mission.target),
      desc: mission.desc(mission.target),
      rewardCoins: mission.rewardCoins,
      progress: mission.getProgress(snapshot),
      target: mission.target,
      claimed: claims.has(id),
      scope: mission.scope,
    };
  });
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
