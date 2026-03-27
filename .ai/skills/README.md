# Skills カタログ

このディレクトリには、このプロジェクト専用の運用ルールや作業基準をまとめています。  
作業前に必要な Skill を確認し、内容に沿って進めます。

## 問題データ系

| Skill | 説明 |
|-------|------|
| `SKILL_QUESTION_ADD.md` | 問題追加時の手順と品質基準 |
| `SKILL_QUESTION_QC.md` | 問題文・選択肢・回答の品質レビュー観点 |

## ユニット系

| Skill | 説明 |
|-------|------|
| `SKILL_UNIT_ADD.md` | 新規ユニット追加の設計・実装方針 |
| `SKILL_UNIT_BALANCE.md` | ユニットのバランス調整ルール |
| `../UNIT_POLICY.md` | ユニット全体のポリシー |

## エージェント系

| Skill | 説明 |
|-------|------|
| `SKILL_AGENT_TEAMS_ORCHESTRATION.md` | Agent Teamsでチームメンバーに並列実装を委任する手順（推奨） |
| `SKILL_DISCORD_ESCALATION.md` | DiscordでユーザーにエスカレーションするGMの手順 |

## 運用系

| Skill | 説明 |
|-------|------|
| `SKILL_GIT_WORKFLOW.md` | Git運用、commit/push の基本ルール |
| `SKILL_DEPLOY_PAGES.md` | GitHub Pages デプロイ手順 |
| `SKILL_RELEASE_CHECK.md` | リリース前の確認項目 |
| `SKILL_AGENT_HANDOFF.md` | Codex / Claude 間の引き継ぎルール |
| `SKILL_KNOWLEDGE_UPDATE.md` | セッション中の学びを Skills へ還元する運用 |
| `SKILL_ISSUE_WORKFLOW.md` | GitHub Issue の起票・整理・追跡ルール |
| `SKILL_CODEX_ORCHESTRATION.md` | Claude から Codex を呼び出し並行実行する手順 |

## 補助資料

| パス | 説明 |
|------|------|
| `../lessons/` | 失敗や学びの記録 |

## 使い方

1. 作業内容に対応する Skill を探す
2. 作業前に内容を読む
3. 実装や修正のあとに必要なら関連 Skill も更新する
4. `.ai/AGENT_HANDOFF.md` に引き継ぎを残す
