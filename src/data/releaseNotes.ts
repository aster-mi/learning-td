export const APP_VERSION = "1.0.2";

export type ReleaseNote = {
  version: string;
  date: string;
  items: string[];
};

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "1.0.2",
    date: "2026-03-24",
    items: [
      "社会カテゴリに 世界地理 を追加",
      "世界地理問題30問追加",
    ],
  },
  {
    version: "1.0.1",
    date: "2026-03-23",
    items: [
      "英語カテゴリに TOEIC頻出語 を追加",
      "TOEIC頻出語問題30問追加",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-03-23",
    items: [
      "プレイヤー進捗保存機能",
      "情報・ITリテラシー問題30問追加",
      "LAN監視ダッシュボード",
      "AIコンテキスト整備",
    ],
  },
];
