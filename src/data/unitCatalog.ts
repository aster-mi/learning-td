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
  {
    id: "notebook", label: "ノート騎士", emoji: "NB", series: "数学",
    rarity: "common", hp: 140, atk: 19, atkInterval: 1300, speed: 52, range: 48,
    cost: 24, color: "#60a5fa", radius: 16, desc: "堅実な前線を作るバランス型ユニット",
  },
  {
    id: "protractor", label: "分度器レンジャー", emoji: "PT", series: "数学",
    rarity: "rare", hp: 95, atk: 26, atkInterval: 1200, speed: 74, range: 95,
    cost: 30, color: "#22d3ee", radius: 14, desc: "角度計算ショットで中距離を制圧",
  },
  {
    id: "battery", label: "バッテリー兵", emoji: "BT", series: "工学",
    rarity: "common", hp: 180, atk: 12, atkInterval: 900, speed: 40, range: 40,
    cost: 20, color: "#84cc16", radius: 17, desc: "継戦能力が高く前線を維持する",
  },
  {
    id: "graphpaper", label: "方眼スナイパー", emoji: "GP", series: "数学",
    rarity: "rare", hp: 70, atk: 34, atkInterval: 2200, speed: 34, range: 145,
    cost: 34, color: "#a78bfa", radius: 13, desc: "長射程の高火力で後方支援",
  },
  {
    id: "paintbrush", label: "絵筆ウィザード", emoji: "PB", series: "図工",
    rarity: "epic", hp: 120, atk: 46, atkInterval: 2500, speed: 30, range: 120,
    cost: 44, color: "#f472b6", radius: 17, desc: "広い射程と重い一撃を両立",
  },
  {
    id: "drone", label: "ドローン先生", emoji: "DR", series: "工学",
    rarity: "legendary", hp: 160, atk: 28, atkInterval: 900, speed: 105, range: 90,
    cost: 52, color: "#38bdf8", radius: 16, desc: "高速機動しながら高頻度で攻撃する",
  },
  // 工学カテゴリ
  { id: "eng_01", label: "ギアランサー", emoji: "E01", series: "工学", rarity: "common", hp: 130, atk: 18, atkInterval: 1200, speed: 56, range: 50, cost: 23, color: "#64748b", radius: 15, desc: "前線で安定して戦う工学ユニット" },
  { id: "eng_02", label: "リベットガード", emoji: "E02", series: "工学", rarity: "common", hp: 210, atk: 11, atkInterval: 900, speed: 38, range: 38, cost: 22, color: "#475569", radius: 17, desc: "耐久寄りでラインを維持する" },
  { id: "eng_03", label: "タービンシューター", emoji: "E03", series: "工学", rarity: "rare", hp: 90, atk: 29, atkInterval: 1200, speed: 70, range: 98, cost: 31, color: "#0ea5e9", radius: 14, desc: "中距離火力を担当する射撃型" },
  { id: "eng_04", label: "ボルトハンマー", emoji: "E04", series: "工学", rarity: "rare", hp: 190, atk: 34, atkInterval: 1800, speed: 40, range: 48, cost: 33, color: "#334155", radius: 18, desc: "重い一撃を叩き込む近接型" },
  { id: "eng_05", label: "サーボランナー", emoji: "E05", series: "工学", rarity: "rare", hp: 75, atk: 20, atkInterval: 800, speed: 110, range: 44, cost: 27, color: "#22d3ee", radius: 13, desc: "高速移動で前線を駆ける" },
  { id: "eng_06", label: "アークコイル", emoji: "E06", series: "工学", rarity: "epic", hp: 120, atk: 46, atkInterval: 2200, speed: 32, range: 130, cost: 43, color: "#0284c7", radius: 16, desc: "遠距離へ高出力アークを放つ" },
  { id: "eng_07", label: "フォージナイト", emoji: "E07", series: "工学", rarity: "epic", hp: 320, atk: 27, atkInterval: 1700, speed: 34, range: 52, cost: 41, color: "#1e293b", radius: 21, desc: "高耐久で押し上げる重装型" },
  { id: "eng_08", label: "ピストンブレイカー", emoji: "E08", series: "工学", rarity: "epic", hp: 230, atk: 52, atkInterval: 2600, speed: 28, range: 62, cost: 46, color: "#0f172a", radius: 20, desc: "高威力の単発攻撃を持つ" },
  { id: "eng_09", label: "ネオンレイ", emoji: "E09", series: "工学", rarity: "legendary", hp: 140, atk: 58, atkInterval: 1600, speed: 54, range: 150, cost: 54, color: "#06b6d4", radius: 18, desc: "長射程の高精度ビームを放つ" },
  { id: "eng_10", label: "クロノメカ", emoji: "E10", series: "工学", rarity: "legendary", hp: 260, atk: 36, atkInterval: 900, speed: 92, range: 88, cost: 56, color: "#0891b2", radius: 19, desc: "機動力と手数を兼ね備えた上位機" },
  // 自然カテゴリ
  { id: "nat_01", label: "つるソルジャー", emoji: "N01", series: "自然", rarity: "common", hp: 145, atk: 17, atkInterval: 1200, speed: 54, range: 48, cost: 23, color: "#65a30d", radius: 15, desc: "バランスの良い自然系前衛" },
  { id: "nat_02", label: "リーフシールド", emoji: "N02", series: "自然", rarity: "common", hp: 230, atk: 10, atkInterval: 1000, speed: 35, range: 36, cost: 22, color: "#4d7c0f", radius: 18, desc: "高耐久で味方を守る" },
  { id: "nat_03", label: "ウッドアーチャー", emoji: "N03", series: "自然", rarity: "rare", hp: 95, atk: 28, atkInterval: 1200, speed: 64, range: 102, cost: 30, color: "#84cc16", radius: 14, desc: "中遠距離を安定して削る" },
  { id: "nat_04", label: "バインドハウンド", emoji: "N04", series: "自然", rarity: "rare", hp: 175, atk: 24, atkInterval: 1100, speed: 82, range: 44, cost: 31, color: "#65a30d", radius: 16, desc: "高速で噛みつく前衛型" },
  { id: "nat_05", label: "モスナイト", emoji: "N05", series: "自然", rarity: "rare", hp: 255, atk: 20, atkInterval: 1600, speed: 42, range: 52, cost: 34, color: "#3f6212", radius: 19, desc: "耐久寄りの近中距離ユニット" },
  { id: "nat_06", label: "シードメイジ", emoji: "N06", series: "自然", rarity: "epic", hp: 110, atk: 45, atkInterval: 2300, speed: 34, range: 126, cost: 42, color: "#16a34a", radius: 16, desc: "種子魔法で遠距離火力を担う" },
  { id: "nat_07", label: "フォレストロード", emoji: "N07", series: "自然", rarity: "epic", hp: 340, atk: 26, atkInterval: 1800, speed: 36, range: 56, cost: 44, color: "#15803d", radius: 21, desc: "高体力で前線を押し込む" },
  { id: "nat_08", label: "サンダーオーク", emoji: "N08", series: "自然", rarity: "epic", hp: 280, atk: 50, atkInterval: 2600, speed: 27, range: 60, cost: 47, color: "#166534", radius: 20, desc: "重い一撃を繰り返す鈍足型" },
  { id: "nat_09", label: "エメラルドフェザー", emoji: "N09", series: "自然", rarity: "legendary", hp: 150, atk: 56, atkInterval: 1600, speed: 86, range: 140, cost: 53, color: "#22c55e", radius: 17, desc: "機動力の高い長射程アタッカー" },
  { id: "nat_10", label: "ワイルドゼファー", emoji: "N10", series: "自然", rarity: "legendary", hp: 200, atk: 32, atkInterval: 850, speed: 112, range: 90, cost: 55, color: "#4ade80", radius: 18, desc: "高回転攻撃で押し切る" },
  // 歴史カテゴリ
  { id: "his_01", label: "ブロンズガード", emoji: "H01", series: "歴史", rarity: "common", hp: 155, atk: 16, atkInterval: 1200, speed: 50, range: 46, cost: 23, color: "#a16207", radius: 15, desc: "堅実な古代兵スタイル" },
  { id: "his_02", label: "ストーンセンチネル", emoji: "H02", series: "歴史", rarity: "common", hp: 240, atk: 10, atkInterval: 1000, speed: 33, range: 36, cost: 22, color: "#78716c", radius: 18, desc: "防衛向きの高耐久兵" },
  { id: "his_03", label: "ランスライダー", emoji: "H03", series: "歴史", rarity: "rare", hp: 100, atk: 30, atkInterval: 1200, speed: 78, range: 50, cost: 31, color: "#b45309", radius: 15, desc: "高速突撃が得意な槍騎兵" },
  { id: "his_04", label: "クロスボウマン", emoji: "H04", series: "歴史", rarity: "rare", hp: 90, atk: 27, atkInterval: 1100, speed: 62, range: 108, cost: 31, color: "#92400e", radius: 14, desc: "安定した遠距離射撃を行う" },
  { id: "his_05", label: "アイアンシールド", emoji: "H05", series: "歴史", rarity: "rare", hp: 270, atk: 19, atkInterval: 1700, speed: 41, range: 52, cost: 34, color: "#57534e", radius: 19, desc: "重装備でラインを維持する" },
  { id: "his_06", label: "フレイムトーチ", emoji: "H06", series: "歴史", rarity: "epic", hp: 115, atk: 47, atkInterval: 2300, speed: 34, range: 124, cost: 42, color: "#c2410c", radius: 16, desc: "遠距離に強火力を投射する" },
  { id: "his_07", label: "ウォーハンマー", emoji: "H07", series: "歴史", rarity: "epic", hp: 330, atk: 28, atkInterval: 1800, speed: 35, range: 54, cost: 44, color: "#7c2d12", radius: 21, desc: "耐久力の高い打撃戦士" },
  { id: "his_08", label: "ロイヤルドラマー", emoji: "H08", series: "歴史", rarity: "epic", hp: 220, atk: 51, atkInterval: 2500, speed: 30, range: 64, cost: 47, color: "#9a3412", radius: 19, desc: "重い攻撃を刻む近中距離型" },
  { id: "his_09", label: "エンペラーボウ", emoji: "H09", series: "歴史", rarity: "legendary", hp: 145, atk: 57, atkInterval: 1600, speed: 80, range: 146, cost: 53, color: "#f59e0b", radius: 17, desc: "高精度の長距離射撃を行う" },
  { id: "his_10", label: "オリハルコン", emoji: "H10", series: "歴史", rarity: "legendary", hp: 260, atk: 34, atkInterval: 850, speed: 96, range: 92, cost: 56, color: "#d97706", radius: 18, desc: "機動力と回転率に優れる英雄級" },
  // 音楽カテゴリ
  { id: "mus_01", label: "リズムファイター", emoji: "M01", series: "音楽", rarity: "common", hp: 135, atk: 18, atkInterval: 1150, speed: 57, range: 49, cost: 23, color: "#9333ea", radius: 15, desc: "テンポ良く戦う前衛ユニット" },
  { id: "mus_02", label: "バスドラムガード", emoji: "M02", series: "音楽", rarity: "common", hp: 225, atk: 11, atkInterval: 950, speed: 36, range: 38, cost: 22, color: "#7e22ce", radius: 18, desc: "耐久寄りで守りを固める" },
  { id: "mus_03", label: "トランペッター", emoji: "M03", series: "音楽", rarity: "rare", hp: 95, atk: 28, atkInterval: 1150, speed: 73, range: 100, cost: 31, color: "#a855f7", radius: 14, desc: "中遠距離に安定火力を出す" },
  { id: "mus_04", label: "バイオレットストリング", emoji: "M04", series: "音楽", rarity: "rare", hp: 105, atk: 30, atkInterval: 1250, speed: 68, range: 92, cost: 31, color: "#8b5cf6", radius: 15, desc: "射程と手数のバランス型" },
  { id: "mus_05", label: "ピアノフォート", emoji: "M05", series: "音楽", rarity: "rare", hp: 250, atk: 21, atkInterval: 1650, speed: 40, range: 53, cost: 34, color: "#6d28d9", radius: 19, desc: "重厚な音圧で前線を支える" },
  { id: "mus_06", label: "シンフォニア", emoji: "M06", series: "音楽", rarity: "epic", hp: 115, atk: 46, atkInterval: 2300, speed: 34, range: 128, cost: 42, color: "#c084fc", radius: 16, desc: "遠距離に強力な一撃を放つ" },
  { id: "mus_07", label: "ハーモニーガード", emoji: "M07", series: "音楽", rarity: "epic", hp: 335, atk: 27, atkInterval: 1800, speed: 36, range: 54, cost: 44, color: "#7c3aed", radius: 21, desc: "耐久と火力の両立型" },
  { id: "mus_08", label: "メトロノームナイト", emoji: "M08", series: "音楽", rarity: "epic", hp: 215, atk: 52, atkInterval: 2500, speed: 30, range: 63, cost: 47, color: "#6b21a8", radius: 19, desc: "重い一撃をリズム良く刻む" },
  { id: "mus_09", label: "オペラアーチャー", emoji: "M09", series: "音楽", rarity: "legendary", hp: 145, atk: 57, atkInterval: 1600, speed: 84, range: 148, cost: 53, color: "#d8b4fe", radius: 17, desc: "長射程の高火力歌撃を放つ" },
  { id: "mus_10", label: "スターコンダクター", emoji: "M10", series: "音楽", rarity: "legendary", hp: 205, atk: 33, atkInterval: 840, speed: 106, range: 90, cost: 56, color: "#a78bfa", radius: 18, desc: "高機動・高回転の指揮者型" },
  // スポーツカテゴリ
  { id: "spo_01", label: "ランナーブレード", emoji: "S01", series: "スポーツ", rarity: "common", hp: 130, atk: 18, atkInterval: 1100, speed: 60, range: 46, cost: 23, color: "#2563eb", radius: 15, desc: "機動力重視の前衛アタッカー" },
  { id: "spo_02", label: "キーパーガード", emoji: "S02", series: "スポーツ", rarity: "common", hp: 235, atk: 10, atkInterval: 980, speed: 35, range: 37, cost: 22, color: "#1d4ed8", radius: 18, desc: "防御寄りで前線を保つ" },
  { id: "spo_03", label: "アロースロー", emoji: "S03", series: "スポーツ", rarity: "rare", hp: 92, atk: 29, atkInterval: 1150, speed: 74, range: 101, cost: 31, color: "#3b82f6", radius: 14, desc: "遠距離に安定して命中させる" },
  { id: "spo_04", label: "スピードスマッシャー", emoji: "S04", series: "スポーツ", rarity: "rare", hp: 108, atk: 31, atkInterval: 1200, speed: 82, range: 54, cost: 31, color: "#60a5fa", radius: 15, desc: "素早く踏み込み打撃を与える" },
  { id: "spo_05", label: "タックルウォール", emoji: "S05", series: "スポーツ", rarity: "rare", hp: 275, atk: 20, atkInterval: 1700, speed: 41, range: 52, cost: 34, color: "#1e40af", radius: 19, desc: "高耐久の守備型ファイター" },
  { id: "spo_06", label: "サーブキャノン", emoji: "S06", series: "スポーツ", rarity: "epic", hp: 110, atk: 47, atkInterval: 2300, speed: 34, range: 130, cost: 42, color: "#38bdf8", radius: 16, desc: "遠距離へ高威力ショットを放つ" },
  { id: "spo_07", label: "キャプテンアーマー", emoji: "S07", series: "スポーツ", rarity: "epic", hp: 345, atk: 27, atkInterval: 1800, speed: 36, range: 55, cost: 44, color: "#0c4a6e", radius: 21, desc: "前線維持能力の高い主将型" },
  { id: "spo_08", label: "パワーハードル", emoji: "S08", series: "スポーツ", rarity: "epic", hp: 225, atk: 52, atkInterval: 2500, speed: 30, range: 64, cost: 47, color: "#0284c7", radius: 19, desc: "重い一撃を繰り返し叩き込む" },
  { id: "spo_09", label: "チャンピオンボウ", emoji: "S09", series: "スポーツ", rarity: "legendary", hp: 145, atk: 58, atkInterval: 1600, speed: 86, range: 150, cost: 53, color: "#7dd3fc", radius: 17, desc: "高精度の長射程攻撃を持つ" },
  { id: "spo_10", label: "オリンピア", emoji: "S10", series: "スポーツ", rarity: "legendary", hp: 210, atk: 34, atkInterval: 840, speed: 108, range: 92, cost: 56, color: "#0ea5e9", radius: 18, desc: "高速で連撃する最上位アタッカー" },
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
