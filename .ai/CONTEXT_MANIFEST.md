# Context Manifest

各エージェントが読むべきファイルの一覧。コンテキストウィンドウを節約するため、必要なファイルだけを読む。

---

## 全エージェント共通（必須）

| ファイル | 目的 |
|---|---|
| `.claude/CLAUDE.md` | 運用ルール・スケジュール・タグ規約 |
| `.ai/AGENT_HANDOFF.md` | 直近5セッションの引き継ぎ |
| `.ai/TODO.md` | 共有タスク一覧 |

---

## CEO

| ファイル | 目的 |
|---|---|
| `.ai/STRATEGY.md` | 現在の戦略方針（更新先） |
| `.ai/channels/escalation.md` | ユーザー返信の確認 |
| `.ai/channels/general.md` | 全体状況の把握 |
| `.ai/specs/DONE.md` | 完了スペック（振り返り用） |

---

## 企画＋調査

| ファイル | 目的 |
|---|---|
| `.ai/STRATEGY.md` | CEOの方針を読む |
| `.ai/RESEARCH.md` | 調査結果の記録先 |
| `.ai/specs/PENDING.md` | 設計待ちスペックの確認・追加 |
| `.ai/channels/specs.md` | 仕様議論チャンネル |

---

## デザイン

| ファイル | 目的 |
|---|---|
| `.ai/specs/PENDING.md` | 設計対象スペックの確認 |
| `.ai/specs/READY.md` | 設計完了後の移行先 |
| `.ai/DECISIONS.md` | 設計判断の参照・記録 |
| `.ai/channels/specs.md` | 設計完了通知の投稿先 |

---

## GM（＋レビュー）

| ファイル | 目的 |
|---|---|
| `.ai/specs/READY.md` | Codex投入対象スペック |
| `.ai/channels/escalation.md` | ユーザー返信・指示の最優先確認 |
| `.ai/channels/dev.md` | PR処理結果の投稿先 |
| `.ai/channels/general.md` | セッション報告の投稿先 |
| `.ai/DASHBOARD.md` | ダッシュボード更新先 |
| `.codex/CODEX.md` | Codexへのタスク投入ルール |

---

## Codex

| ファイル | 目的 |
|---|---|
| `.codex/CODEX.md` | Codex運用ルール（必読） |

---

## アーカイブ

古いログは `.ai/archive/` に保存されている。日常セッションでは読まない。

| ファイル | 内容 |
|---|---|
| `.ai/archive/HANDOFF_ARCHIVE.md` | 6エントリ以前の AGENT_HANDOFF |
