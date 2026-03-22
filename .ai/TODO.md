# Shared TODO

Codex と Claude で共有する優先度付きタスクリスト。
状態は行内で更新し、新しいもの・優先度の高いものを上に置く。

## ステータス
- `todo`
- `in_progress`
- `blocked`
- `done`

## タスク
<!-- 2026-03-23 GMセッション: タスク整理・優先度付け追加 -->
- [todo][codex][P2] なぞなぞ問題の品質レビュー再実行（前回5エージェント中4つがrate limitで失敗）
- [todo][codex][P3] expansion.ts の削除（src/expansion.ts: index.tsから参照されなくなった不要ファイル）
- [todo][claude][P3] 生成した補助スクリプトをルート直下に残すか、`tools/` へ移すかを決める（方針確定後Codex投入）
- [done] LAN内エージェント監視ダッシュボード（tools/dashboard/）の実装
- [done] 50ユニットの手描きレンダラー作成（engineering/nature/history/music/sports）
- [done] .ai/skills 全体の整備（コマンド・テーブル・手順を明記）
