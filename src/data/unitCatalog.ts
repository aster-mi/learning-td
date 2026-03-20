/**
 * 全ユニット（味方キャラ）のカタログ定義
 * 文房具・学校・科学・猫シリーズなど勉強にちなんだキャラクター
 */

export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface UnitCatalogEntry {
  id: string;            // ユニークID (旧UnitType相当)
  label: string;         // 表示名
  emoji: string;         // 絵文字（Canvas描画用）
  series: string;        // シリーズ名
  rarity: Rarity;
  hp: number;
  atk: number;
  atkInterval: number;   // 攻撃間隔(ms)
  speed: number;         // px/s
  range: number;         // 射程px
  cost: number;          // エネルギーコスト
  color: string;         // テーマカラー
  radius: number;        // 描画半径
  desc: string;          // フレーバーテキスト
}

// ── カタログ ──────────────────────────────────────────────────────────────

export const UNIT_CATALOG: UnitCatalogEntry[] = [
  // ━━━ 猫シリーズ（初期キャラ）━━━
  {
    id: "basic", label: "ネコ", emoji: "🐱", series: "猫",
    rarity: "common", hp: 100, atk: 15, atkInterval: 1200, speed: 60, range: 40,
    cost: 20, color: "#f9c74f", radius: 16, desc: "頼れるスタンダード戦士",
  },
  {
    id: "fast", label: "速ネコ", emoji: "🐈", series: "猫",
    rarity: "common", hp: 50, atk: 10, atkInterval: 800, speed: 120, range: 35,
    cost: 15, color: "#90be6d", radius: 13, desc: "素早さが取り柄の突撃隊長",
  },
  {
    id: "tank", label: "タンクネコ", emoji: "🐯", series: "猫",
    rarity: "rare", hp: 300, atk: 25, atkInterval: 2000, speed: 30, range: 45,
    cost: 35, color: "#4cc9f0", radius: 22, desc: "分厚い毛皮で仲間を守る",
  },
  {
    id: "shooter", label: "遠距離ネコ", emoji: "🏹", series: "猫",
    rarity: "rare", hp: 70, atk: 22, atkInterval: 1800, speed: 38, range: 130,
    cost: 30, color: "#c084fc", radius: 14, desc: "安全な距離から狙い撃ち",
  },
  {
    id: "bomber", label: "火炎ネコ", emoji: "🔥", series: "猫",
    rarity: "epic", hp: 180, atk: 50, atkInterval: 3200, speed: 18, range: 60,
    cost: 45, color: "#f97316", radius: 22, desc: "炎の息吹で敵を焼き尽くす",
  },

  // ━━━ 文房具シリーズ ━━━
  {
    id: "pencil", label: "えんぴつ兵", emoji: "✏️", series: "文房具",
    rarity: "common", hp: 90, atk: 18, atkInterval: 1100, speed: 65, range: 42,
    cost: 18, color: "#fbbf24", radius: 15, desc: "書いて消して戦う基本戦士",
  },
  {
    id: "eraser", label: "けしゴムガード", emoji: "🧹", series: "文房具",
    rarity: "common", hp: 250, atk: 8, atkInterval: 2200, speed: 35, range: 30,
    cost: 25, color: "#f8b4c8", radius: 20, desc: "間違いも敵も消し去る壁役",
  },
  {
    id: "ruler", label: "ものさしナイト", emoji: "📏", series: "文房具",
    rarity: "rare", hp: 120, atk: 20, atkInterval: 1400, speed: 50, range: 90,
    cost: 28, color: "#a3e635", radius: 14, desc: "30cmの間合いを正確に保つ",
  },
  {
    id: "scissors", label: "はさみアサシン", emoji: "✂️", series: "文房具",
    rarity: "rare", hp: 65, atk: 35, atkInterval: 900, speed: 110, range: 35,
    cost: 30, color: "#c0c0c0", radius: 13, desc: "二枚刃の高速暗殺者",
  },
  {
    id: "compass", label: "コンパス魔導士", emoji: "📐", series: "文房具",
    rarity: "epic", hp: 80, atk: 45, atkInterval: 2400, speed: 28, range: 120,
    cost: 40, color: "#818cf8", radius: 16, desc: "円を描いて魔法陣を発動",
  },
  {
    id: "stapler", label: "ホッチキス将軍", emoji: "🔫", series: "文房具",
    rarity: "epic", hp: 200, atk: 40, atkInterval: 1600, speed: 42, range: 55,
    cost: 38, color: "#64748b", radius: 18, desc: "鉄の針を連射する重装兵",
  },
  {
    id: "glue", label: "のりスライム", emoji: "🫠", series: "文房具",
    rarity: "common", hp: 180, atk: 5, atkInterval: 3000, speed: 20, range: 25,
    cost: 12, color: "#fef08a", radius: 18, desc: "ベタベタで敵の足を止める",
  },
  {
    id: "sharpener", label: "えんぴつ削り", emoji: "🌀", series: "文房具",
    rarity: "rare", hp: 100, atk: 28, atkInterval: 1300, speed: 55, range: 40,
    cost: 25, color: "#fb923c", radius: 14, desc: "回転刃で敵を削り取る",
  },

  // ━━━ 学校シリーズ ━━━
  {
    id: "textbook", label: "教科書タンク", emoji: "📚", series: "学校",
    rarity: "rare", hp: 400, atk: 12, atkInterval: 2500, speed: 22, range: 35,
    cost: 35, color: "#2563eb", radius: 24, desc: "知識の重みで押しつぶす",
  },
  {
    id: "schoolbag", label: "ランドセル重戦車", emoji: "🎒", series: "学校",
    rarity: "epic", hp: 500, atk: 30, atkInterval: 2800, speed: 18, range: 40,
    cost: 50, color: "#dc2626", radius: 26, desc: "夢と希望を背負った最強の盾",
  },
  {
    id: "bell", label: "チャイムの精", emoji: "🔔", series: "学校",
    rarity: "rare", hp: 60, atk: 30, atkInterval: 3500, speed: 45, range: 100,
    cost: 32, color: "#eab308", radius: 14, desc: "鳴り響く音波で敵を混乱させる",
  },
  {
    id: "chalk", label: "チョーク投げ", emoji: "🤍", series: "学校",
    rarity: "common", hp: 40, atk: 25, atkInterval: 1000, speed: 70, range: 110,
    cost: 20, color: "#e2e8f0", radius: 11, desc: "先生直伝のチョーク投げ",
  },
  {
    id: "globe", label: "地球儀ローラー", emoji: "🌍", series: "学校",
    rarity: "epic", hp: 350, atk: 35, atkInterval: 2000, speed: 25, range: 50,
    cost: 42, color: "#22d3ee", radius: 22, desc: "世界を転がして敵を轢く",
  },

  // ━━━ 科学シリーズ ━━━
  {
    id: "beaker", label: "ビーカー博士", emoji: "⚗️", series: "科学",
    rarity: "rare", hp: 75, atk: 38, atkInterval: 2200, speed: 35, range: 100,
    cost: 33, color: "#6ee7b7", radius: 15, desc: "危険な薬品を投げつける",
  },
  {
    id: "magnet", label: "じしゃくン", emoji: "🧲", series: "科学",
    rarity: "epic", hp: 150, atk: 20, atkInterval: 1800, speed: 40, range: 70,
    cost: 35, color: "#ef4444", radius: 16, desc: "磁力で敵を引き寄せる",
  },
  {
    id: "bulb", label: "でんきゅうマン", emoji: "💡", series: "科学",
    rarity: "rare", hp: 85, atk: 32, atkInterval: 1500, speed: 55, range: 80,
    cost: 28, color: "#fde047", radius: 15, desc: "ひらめきの電撃を放つ",
  },
  {
    id: "telescope", label: "望遠鏡スナイパー", emoji: "🔭", series: "科学",
    rarity: "epic", hp: 55, atk: 48, atkInterval: 3000, speed: 20, range: 180,
    cost: 45, color: "#a78bfa", radius: 14, desc: "超遠距離から正確に狙撃",
  },
  {
    id: "testtube", label: "試験管ボマー", emoji: "🧪", series: "科学",
    rarity: "rare", hp: 60, atk: 42, atkInterval: 2600, speed: 48, range: 85,
    cost: 35, color: "#34d399", radius: 13, desc: "爆発する試薬を調合",
  },
  {
    id: "microscope", label: "顕微鏡大先生", emoji: "🔬", series: "科学",
    rarity: "legendary", hp: 200, atk: 55, atkInterval: 2000, speed: 30, range: 150,
    cost: 55, color: "#e879f9", radius: 20, desc: "ミクロの世界から必殺ビーム",
  },

  // ━━━ 数学シリーズ ━━━
  {
    id: "abacus", label: "そろばん侍", emoji: "🧮", series: "数学",
    rarity: "rare", hp: 130, atk: 22, atkInterval: 1200, speed: 60, range: 45,
    cost: 25, color: "#c2410c", radius: 16, desc: "珠を弾いて斬りかかる",
  },
  {
    id: "calculator", label: "電卓ロボ", emoji: "🖩", series: "数学",
    rarity: "epic", hp: 220, atk: 38, atkInterval: 1800, speed: 35, range: 65,
    cost: 40, color: "#475569", radius: 18, desc: "計算された攻撃で確実に仕留める",
  },
  {
    id: "pi", label: "π（パイ）", emoji: "🥧", series: "数学",
    rarity: "legendary", hp: 314, atk: 31, atkInterval: 1400, speed: 42, range: 159,
    cost: 50, color: "#f472b6", radius: 18, desc: "3.14159...無限の可能性",
  },

  // ━━━ 芸術シリーズ ━━━
  {
    id: "crayon", label: "クレヨン戦士", emoji: "🖍️", series: "芸術",
    rarity: "common", hp: 110, atk: 16, atkInterval: 1100, speed: 58, range: 38,
    cost: 18, color: "#f87171", radius: 14, desc: "カラフルに戦場を彩る",
  },
  {
    id: "palette", label: "パレットウィザード", emoji: "🎨", series: "芸術",
    rarity: "epic", hp: 100, atk: 42, atkInterval: 2400, speed: 32, range: 110,
    cost: 42, color: "#c084fc", radius: 17, desc: "色を操る天才画家",
  },
  {
    id: "note", label: "音符フェアリー", emoji: "🎵", series: "芸術",
    rarity: "rare", hp: 55, atk: 18, atkInterval: 800, speed: 95, range: 50,
    cost: 22, color: "#f0abfc", radius: 12, desc: "軽やかなメロディで連続攻撃",
  },
];

// ── ヘルパー ──────────────────────────────────────────────────────────────

const _catalogMap = new Map<string, UnitCatalogEntry>();
for (const u of UNIT_CATALOG) _catalogMap.set(u.id, u);

/** IDからカタログエントリを取得 */
export function getCatalogEntry(id: string): UnitCatalogEntry | undefined {
  return _catalogMap.get(id);
}

/** レアリティの表示情報 */
export const RARITY_INFO: Record<Rarity, {
  label: string; stars: string; color: string; bg: string; border: string; glow: string;
}> = {
  common:    { label: "コモン",     stars: "★",       color: "#94a3b8", bg: "#1e293b", border: "#475569", glow: "#47556944" },
  rare:      { label: "レア",       stars: "★★",     color: "#818cf8", bg: "#1e1b4b", border: "#818cf8", glow: "#818cf844" },
  epic:      { label: "エピック",   stars: "★★★",   color: "#c084fc", bg: "#3b0764", border: "#c084fc", glow: "#c084fc66" },
  legendary: { label: "レジェンド", stars: "★★★★", color: "#fbbf24", bg: "#451a03", border: "#fbbf24", glow: "#fbbf2466" },
};

/** シリーズ一覧 */
export const SERIES_LIST = [...new Set(UNIT_CATALOG.map(u => u.series))];

/** 初期所持ユニットID */
export const INITIAL_UNITS = ["basic", "fast"];

/** 初期パーティ（出陣デッキ） */
export const DEFAULT_PARTY = ["basic", "fast", "pencil", "eraser", "chalk"];

/** ガチャ排出対象（初期所持を除く） */
export const GACHA_POOL_UNITS = UNIT_CATALOG.filter(u => !INITIAL_UNITS.includes(u.id));
