import { describe, expect, it } from "vitest";
import { getDailyWeeklyMissions, ensureLoginProgress } from "../progression";
import type { SaveData } from "../saveData";

function createSave(overrides: Partial<SaveData> = {}): SaveData {
  return {
    coins: 0,
    stageStars: {},
    unitUpgrades: {},
    unlockedUnits: [],
    party: [],
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
    ...overrides,
  };
}

describe("getDailyWeeklyMissions", () => {
  it("keeps mission text, targets, and rewards aligned with the balance baseline", () => {
    const missions = getDailyWeeklyMissions(createSave(), new Date("2026-03-25T09:00:00+09:00"));

    expect(
      missions.map((mission) => ({
        scope: mission.scope,
        title: mission.title,
        desc: mission.desc,
        target: mission.target,
        rewardCoins: mission.rewardCoins,
      })),
    ).toEqual([
      {
        scope: "daily",
        title: "今日のログイン",
        desc: "1回ログインしてコインを受け取る",
        target: 1,
        rewardCoins: 20,
      },
      {
        scope: "daily",
        title: "今日の8問正解",
        desc: "今日は8問正解して学習ペースを作る",
        target: 8,
        rewardCoins: 40,
      },
      {
        scope: "daily",
        title: "今日の1ステージクリア",
        desc: "どれか1つのステージをクリアする",
        target: 1,
        rewardCoins: 40,
      },
      {
        scope: "weekly",
        title: "今週の35問正解",
        desc: "1週間で35問正解して安定して積み上げる",
        target: 35,
        rewardCoins: 100,
      },
      {
        scope: "weekly",
        title: "今週の4ステージクリア",
        desc: "1週間で4ステージクリアして攻略を進める",
        target: 4,
        rewardCoins: 120,
      },
      {
        scope: "weekly",
        title: "今週の12コンボ",
        desc: "1週間のどこかで12コンボに到達する",
        target: 12,
        rewardCoins: 80,
      },
    ]);

    const dailyTotal = missions
      .filter((mission) => mission.scope === "daily")
      .reduce((sum, mission) => sum + mission.rewardCoins, 0);
    const weeklyTotal = missions
      .filter((mission) => mission.scope === "weekly")
      .reduce((sum, mission) => sum + mission.rewardCoins, 0);

    expect(dailyTotal).toBe(100);
    expect(weeklyTotal).toBe(300);
  });

  it("uses current activity and claim ids to derive progress and claimed state", () => {
    const date = new Date("2026-03-25T09:00:00+09:00");
    const save = createSave({
      dailyActivity: {
        "2026-03-25": {
          plays: 2,
          clears: 1,
          correct: 9,
          wrong: 3,
          bestCombo: 7,
          coinsEarned: 195,
        },
        "2026-03-24": {
          plays: 1,
          clears: 1,
          correct: 10,
          wrong: 2,
          bestCombo: 12,
          coinsEarned: 195,
        },
        "2026-03-23": {
          plays: 1,
          clears: 1,
          correct: 16,
          wrong: 4,
          bestCombo: 9,
          coinsEarned: 283,
        },
        "2026-03-22": {
          plays: 1,
          clears: 1,
          correct: 4,
          wrong: 1,
          bestCombo: 5,
          coinsEarned: 120,
        },
      },
      missionClaims: ["daily-login-2026-03-25", "weekly-clear-2026-03-23"],
    });

    const missions = getDailyWeeklyMissions(save, date);
    const summary = Object.fromEntries(
      missions.map((mission) => [mission.id, { progress: mission.progress, claimed: mission.claimed }]),
    );

    expect(summary["daily-login-2026-03-25"]).toEqual({ progress: 1, claimed: true });
    expect(summary["daily-correct-2026-03-25"]).toEqual({ progress: 9, claimed: false });
    expect(summary["daily-clear-2026-03-25"]).toEqual({ progress: 1, claimed: false });
    expect(summary["weekly-correct-2026-03-23"]).toEqual({ progress: 35, claimed: false });
    expect(summary["weekly-clear-2026-03-23"]).toEqual({ progress: 3, claimed: true });
    expect(summary["weekly-combo-2026-03-23"]).toEqual({ progress: 12, claimed: false });
  });
});

describe("ensureLoginProgress (streak rescue)", () => {
  const day = (dateStr: string) => new Date(`${dateStr}T09:00:00+09:00`);

  it("increments streak on consecutive day", () => {
    const save = createSave({ login: { lastDate: "2026-03-24", streak: 5, rescueCount: 0 } });
    const result = ensureLoginProgress(save, day("2026-03-25"));
    expect(result.login.streak).toBe(6);
    expect(result.login.rescueCount).toBe(0);
  });

  it("resets streak when 2+ days missed even with rescue", () => {
    const save = createSave({ login: { lastDate: "2026-03-22", streak: 5, rescueCount: 2 } });
    const result = ensureLoginProgress(save, day("2026-03-25"));
    expect(result.login.streak).toBe(1);
    expect(result.login.rescueCount).toBe(2); // rescue not consumed
  });

  it("uses rescue when exactly 1 day missed and rescue available", () => {
    const save = createSave({ login: { lastDate: "2026-03-23", streak: 5, rescueCount: 1 } });
    const result = ensureLoginProgress(save, day("2026-03-25"));
    expect(result.login.streak).toBe(6);
    expect(result.login.rescueCount).toBe(0); // rescue consumed
  });

  it("resets streak when 1 day missed and no rescue", () => {
    const save = createSave({ login: { lastDate: "2026-03-23", streak: 5, rescueCount: 0 } });
    const result = ensureLoginProgress(save, day("2026-03-25"));
    expect(result.login.streak).toBe(1);
    expect(result.login.rescueCount).toBe(0);
  });

  it("replenishes rescue at 7-day streak milestone", () => {
    const save = createSave({ login: { lastDate: "2026-03-24", streak: 6, rescueCount: 0 } });
    const result = ensureLoginProgress(save, day("2026-03-25"));
    expect(result.login.streak).toBe(7);
    expect(result.login.rescueCount).toBe(1); // replenished at milestone
  });

  it("does not exceed MAX_RESCUE_COUNT (2) when replenishing", () => {
    const save = createSave({ login: { lastDate: "2026-03-24", streak: 13, rescueCount: 2 } });
    const result = ensureLoginProgress(save, day("2026-03-25"));
    expect(result.login.streak).toBe(14);
    expect(result.login.rescueCount).toBe(2); // capped at max
  });
});
