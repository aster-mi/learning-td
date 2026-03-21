export type MainCategory = "算数" | "国語" | "理科" | "社会" | "英語" | "プログラミング" | "雑学" | "なぞなぞ";

export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const LEVEL_ALL = 0;

export const LEVEL_DEFS: { level: Level; label: string; emoji: string; color: string; desc: string }[] = [
  { level: 1, label: "小学1年生", emoji: "🌱", color: "#86efac", desc: "小学1年生レベル" },
  { level: 2, label: "小学2年生", emoji: "🌱", color: "#4ade80", desc: "小学2年生レベル" },
  { level: 3, label: "小学3年生", emoji: "🌿", color: "#22c55e", desc: "小学3年生レベル" },
  { level: 4, label: "小学4年生", emoji: "🌿", color: "#16a34a", desc: "小学4年生レベル" },
  { level: 5, label: "小学5年生", emoji: "🍀", color: "#15803d", desc: "小学5年生レベル" },
  { level: 6, label: "小学6年生", emoji: "🍀", color: "#166534", desc: "小学6年生レベル" },
  { level: 7, label: "中学生", emoji: "📘", color: "#60a5fa", desc: "中学校レベル" },
  { level: 8, label: "高校生", emoji: "📗", color: "#f59e0b", desc: "高校レベル" },
  { level: 9, label: "大学・一般", emoji: "🎓", color: "#f97316", desc: "大学・社会人" },
  { level: 10, label: "専門知識", emoji: "🔬", color: "#ef4444", desc: "資格・専門分野" },
];

export interface SubCategoryDef {
  main: MainCategory;
  name: string;
  emoji: string;
  color: string;
  desc: string;
}

export const MAIN_CATEGORY_META: Record<MainCategory, { emoji: string; color: string }> = {
  算数: { emoji: "🔢", color: "#3b82f6" },
  国語: { emoji: "📖", color: "#a855f7" },
  理科: { emoji: "🔬", color: "#10b981" },
  社会: { emoji: "🌍", color: "#f59e0b" },
  英語: { emoji: "🇬🇧", color: "#ef4444" },
  プログラミング: { emoji: "💻", color: "#06b6d4" },
  雑学: { emoji: "💡", color: "#f472b6" },
  なぞなぞ: { emoji: "❓", color: "#a78bfa" },
};

export const SUB_CATEGORIES: SubCategoryDef[] = [
  { main: "算数", name: "四則計算", emoji: "➕", color: "#3b82f6", desc: "足し算・引き算・掛け算・割り算" },
  { main: "算数", name: "図形・面積", emoji: "📐", color: "#60a5fa", desc: "面積・体積・図形の性質" },
  { main: "国語", name: "漢字・読み", emoji: "漢", color: "#a855f7", desc: "漢字の読み書き" },
  { main: "国語", name: "熟語・慣用句", emoji: "📝", color: "#c084fc", desc: "四字熟語・慣用句・ことわざ" },
  { main: "理科", name: "物理・化学", emoji: "⚗️", color: "#10b981", desc: "光・音・電気・化学式" },
  { main: "理科", name: "生物・地学", emoji: "🌿", color: "#34d399", desc: "動植物・地球・宇宙" },
  { main: "社会", name: "地理", emoji: "🗾", color: "#f59e0b", desc: "日本と世界の地理" },
  { main: "社会", name: "歴史", emoji: "🏯", color: "#fbbf24", desc: "日本史・世界史" },
  { main: "英語", name: "英単語", emoji: "🔤", color: "#ef4444", desc: "単語の意味・用法" },
  { main: "英語", name: "英文法", emoji: "📏", color: "#f87171", desc: "文法・語形変化" },
  { main: "プログラミング", name: "Web基礎", emoji: "🌐", color: "#06b6d4", desc: "HTML/CSS/JavaScript入門" },
  { main: "プログラミング", name: "Java Bronze", emoji: "☕", color: "#f97316", desc: "Javaの基礎文法・オブジェクト指向入門" },
  { main: "プログラミング", name: "Java Silver", emoji: "🥈", color: "#94a3b8", desc: "Java SE開発者向け中級" },
  { main: "プログラミング", name: "Java Gold", emoji: "🥇", color: "#fbbf24", desc: "Java SE開発者向け上級" },
  { main: "雑学", name: "生活・常識", emoji: "🏠", color: "#f472b6", desc: "日常の豆知識・一般常識" },
  { main: "雑学", name: "スポーツ・芸能", emoji: "⚽", color: "#fb7185", desc: "スポーツ・芸能・エンタメ" },
  { main: "雑学", name: "自然・科学トリビア", emoji: "🌏", color: "#e879f9", desc: "自然や科学の意外な事実" },
  { main: "なぞなぞ", name: "かんたんなぞなぞ", emoji: "😊", color: "#a78bfa", desc: "小学生向けのやさしいなぞなぞ" },
  { main: "なぞなぞ", name: "むずかしいなぞなぞ", emoji: "🤔", color: "#8b5cf6", desc: "ひらめき力が試される難問" },
];

export interface Question {
  id: string;
  main: MainCategory;
  sub: string;
  level: Level;
  question: string;
  choices: string[];
  answer: string;
}
