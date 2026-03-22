# Shared TODO

Codex と Claude で共有する優先度付きタスクリスト。
状態は行内で更新し、新しいもの・優先度の高いものを上に置く。

## ステータス
- `todo`
- `in_progress`
- `blocked`
- `done`

## タスク
<!-- 2026-03-23 GMセッション（scheduled）: T-01〜T-03 完了確認 -->
- [done] T-01: なぞなぞ問題の品質レビュー再実行 → node scripts/review-riddles.mjs で0件エラー、200問OK
- [done] T-02: expansion.ts の削除 → ファイルが存在しないことを確認（削除済み）
- [done] T-03: 補助スクリプトのルート整理 → .py ファイルはルートに存在せず、scripts/ に整理済み
<!-- 新規タスク（CEOフェーズ B+C） -->
- [todo][codex][P2] SPEC-B-01: 情報・ITリテラシー問題30問追加（questionMeta.ts + programming.jsonl）
- [todo][claude][P2] SPEC-C-01: プレイヤー進捗画面UI（saveData.ts の表示UI作成）← デザイン完了後
- [done] LAN内エージェント監視ダッシュボード（tools/dashboard/）の実装
- [done] 50ユニットの手描きレンダラー作成（engineering/nature/history/music/sports）
- [done] .ai/skills 全体の整備（コマンド・テーブル・手順を明記）
