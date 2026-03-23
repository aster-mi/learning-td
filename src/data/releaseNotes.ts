export const APP_VERSION = "1.0.0";

export type ReleaseNote = {
  version: string;
  date: string;
  items: string[];
};

export const RELEASE_NOTES: ReleaseNote[] = [
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
