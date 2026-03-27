# Source of Truth

このプロジェクトでは、**task の状態**と**永続知識**を分けて管理する。

## 正本一覧

| 対象 | 正本 | 使い方 |
|---|---|---|
| task の状態 | GitHub Projects | 現在の正本は [aster-mi / Project 2](https://github.com/users/aster-mi/projects/2)。確認済み field は `Status`, `Assignees`, `Priority`, `Size` |
| task の定義・作業ログ | GitHub Issues | Issue 本文に目的/受け入れ条件、コメントに進捗ログを残す |
| 実装・レビュー | GitHub Pull Requests | 差分、レビュー、マージ判断を残す |
| GM ↔ human の意思決定 / エスカレーション | GitHub Discussions | 現在の正本は [learning-td / discussions](https://github.com/aster-mi/learning-td/discussions)。Issue からリンクする |
| 共通ルール | `.ai/doc/` | 全エージェント共通の安定ルールを置く |
| ドメイン知識 | `.ai/domain/` | プロダクト知識・アーキテクチャ・永続判断を置く |
| 作業手順 | `.ai/skills/` | task ごとの手順書を skill として分離する |
| 役割入口 | `.ai/agents/` | 各エージェントが最初に読む入口を置く |
| 実装の事実 | `src/`, `tools/` | 最終的な実装事実はコードが正本 |

## ルール

- 参照する kanban は [aster-mi / Project 2](https://github.com/users/aster-mi/projects/2) に固定する。
- 現在の Project 2 の status 値は `Backlog`, `Ready`, `In progress`, `In review`, `Done`。
- 新しい task state を repo 内 Markdown に重複して書かない。
- task の進捗ログは GitHub Issue コメントへ書く。
- human 判断が必要な往復は Issue コメントだけで閉じず、GitHub Discussions に残す。
- Project 2 に `Blocked` / `Needs Human` field はまだ無いので、human 待ちは Discussion URL と Issue コメントで表す。
- task の議論をルール化したいときは `.ai/doc/` または `.ai/skills/` に昇格させる。
- 実装で確定した設計判断だけを `.ai/domain/decisions.md` に残す。
- repo 内に過去の運用ログや communication history を残さない。
