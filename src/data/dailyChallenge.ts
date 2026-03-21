import { normalStages } from "./stages";

export interface DailyChallenge {
  id: string;              // "2026-03-20" format
  title: string;
  desc: string;
  emoji: string;
  modifier: ChallengeModifier;
  bonusCoins: number;       // extra coins for completing
  stageId: number;          // which stage to use
}

export interface ChallengeModifier {
  energyStart?: number;       // starting energy (default 30)
  energyPerCorrect?: number;  // override energy per correct
  timeLimitSec?: number;      // time limit (0 = no limit)
  onlyCategory?: string;      // restrict to one main category
  noWrongAllowed?: boolean;   // instant fail on wrong answer
  halfHp?: boolean;           // player base HP halved
  doubleEnemies?: boolean;    // enemies spawn twice
  comboRequired?: number;     // must reach this combo to win
}

// Simple seeded random from date string
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), 61 | h);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

const CHALLENGE_TEMPLATES: Array<{
  title: string; desc: string; emoji: string;
  modifier: ChallengeModifier; bonusCoins: number;
}> = [
  {
    title: "算数チャレンジ",
    desc: "算数の問題だけで戦え！",
    emoji: "🔢",
    modifier: { onlyCategory: "算数" },
    bonusCoins: 80,
  },
  {
    title: "国語チャレンジ",
    desc: "国語の問題だけで戦え！",
    emoji: "📖",
    modifier: { onlyCategory: "国語" },
    bonusCoins: 80,
  },
  {
    title: "理科チャレンジ",
    desc: "理科の問題だけで戦え！",
    emoji: "🔬",
    modifier: { onlyCategory: "理科" },
    bonusCoins: 80,
  },
  {
    title: "ノーミス",
    desc: "1問も間違えずにクリアせよ！",
    emoji: "🎯",
    modifier: { noWrongAllowed: true },
    bonusCoins: 150,
  },
  {
    title: "省エネモード",
    desc: "初期エネルギー10でスタート！",
    emoji: "🔋",
    modifier: { energyStart: 10 },
    bonusCoins: 100,
  },
  {
    title: "コンボチャレンジ",
    desc: "10コンボ以上を達成してクリア！",
    emoji: "🔥",
    modifier: { comboRequired: 10 },
    bonusCoins: 120,
  },
  {
    title: "防衛戦",
    desc: "拠点HP半分で耐えきれ！",
    emoji: "🏰",
    modifier: { halfHp: true },
    bonusCoins: 100,
  },
  {
    title: "大群襲来",
    desc: "敵が2倍出現！耐えられるか？",
    emoji: "👾",
    modifier: { doubleEnemies: true },
    bonusCoins: 130,
  },
  {
    title: "英語チャレンジ",
    desc: "英語の問題だけで戦え！",
    emoji: "🌍",
    modifier: { onlyCategory: "英語" },
    bonusCoins: 80,
  },
  {
    title: "社会チャレンジ",
    desc: "社会の問題だけで戦え！",
    emoji: "🗾",
    modifier: { onlyCategory: "社会" },
    bonusCoins: 80,
  },
  {
    title: "スピードラン",
    desc: "制限時間90秒以内にクリア！",
    emoji: "⏱️",
    modifier: { timeLimitSec: 90 },
    bonusCoins: 120,
  },
  {
    title: "エネルギー祭り",
    desc: "正解ごとに+20エネルギー！",
    emoji: "⚡",
    modifier: { energyPerCorrect: 20 },
    bonusCoins: 60,
  },
];

export function getTodayChallenge(): DailyChallenge {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const rng = seededRandom(dateStr);

  const templateIdx = Math.floor(rng() * CHALLENGE_TEMPLATES.length);
  const template = CHALLENGE_TEMPLATES[templateIdx];

  const stageId = normalStages[Math.floor(rng() * normalStages.length)]?.id ?? 1;

  return {
    id: dateStr,
    ...template,
    stageId,
  };
}

export function isDailyChallengeCompleted(challengeId: string): boolean {
  try {
    const raw = localStorage.getItem("learning_td_daily");
    if (!raw) return false;
    const data = JSON.parse(raw) as { completed: string[] };
    return data.completed?.includes(challengeId) ?? false;
  } catch { return false; }
}

export function completeDailyChallenge(challengeId: string): void {
  try {
    const raw = localStorage.getItem("learning_td_daily");
    const data = raw ? JSON.parse(raw) as { completed: string[] } : { completed: [] };
    if (!data.completed.includes(challengeId)) {
      data.completed.push(challengeId);
      // Keep only last 30 days
      if (data.completed.length > 30) data.completed = data.completed.slice(-30);
      localStorage.setItem("learning_td_daily", JSON.stringify(data));
    }
  } catch { /* ignore */ }
}
