# Agent Collaboration Guide

This repository can be edited by both Codex and Claude in alternating sessions.
Use this file as the shared operating contract.

---

## セッション開始時（必須・最初に必ず実行）

以下を **作業開始前に必ず読む**。読まずにコード編集を始めないこと。

```bash
head -80 .ai/AGENT_HANDOFF.md   # 最新の引き継ぎ（Open Questions / Next Step を優先確認）
cat .ai/TODO.md                  # 共有タスクリスト
cat .ai/DECISIONS.md             # 過去の判断記録
git status --short               # 未コミットの変更がないか確認
```

## セッション終了時（必須・プッシュ前に必ず実行）

**コード変更をプッシュする前に、必ず `.ai/AGENT_HANDOFF.md` の先頭にハンドオフを追記する。**
ハンドオフを書かずにセッションを終了しないこと。

### push運用
- Codex が実装・修正した内容は、区切りごとに commit して **そのまま push まで行う**。
- 「あとでまとめてpush」はしない。ユーザーから停止指示がない限り、反映可能な変更は push まで完了させる。
- 無関係なローカル変更がある場合は、それを巻き込まずに今回の変更分だけを commit/push する。

### ハンドオフテンプレート
`.ai/AGENT_HANDOFF.md` の `---` 直後に追記:

```
## [YYYY-MM-DD HH:mm JST] Agent: Codex
Summary:
- 何をしたか（1〜3行）

Changed Files:
- 変更ファイルをリスト

Validation:
- npm run build → 成功/失敗
- npm run quiz:validate → 成功/失敗（問題データ変更時）

Open Questions:
- 未解決の判断・質問

Next Step:
- 次にやるべきこと
```

### 併せて更新するファイル
- `.ai/TODO.md` — 完了タスクを `done` に、新タスクを追加
- `.ai/DECISIONS.md` — 重要な判断があれば記録

### ナレッジ更新（毎セッション終了時に確認）
ハンドオフを書く **前に** `.ai/skills/SKILL_KNOWLEDGE_UPDATE.md` のチェックリストを確認し、該当があれば Skills やポリシーを更新する。

特に以下に該当する場合は **必ず** 更新すること:
- 失敗・手戻りがあった → 該当Skillの禁止事項に追記 + `.ai/lessons/` に記録
- 新しいコマンドや手順を使った → 該当Skillに追記
- ファイル構成が変わった → 該当Skillのパス情報を修正

---

## Shared Files
| ファイル | 用途 |
|---------|------|
| `.claude/CLAUDE.md` | Claude側の運用ルール |
| `.ai/AGENT_HANDOFF.md` | 引き継ぎログ（先頭に追記） |
| `.ai/TODO.md` | 共有タスクリスト |
| `.ai/DECISIONS.md` | 判断記録 |
| `.ai/SESSION_TEMPLATE.md` | ハンドオフテンプレート |
| `.ai/skills/` | タスク別の標準手順（コマンド付き） |
| `.ai/UNIT_POLICY.md` | ユニット追加ポリシー |

## Commit Convention
- Format: `<scope>: <short summary>`
- Keep one intent per commit.
- Scopes: `quiz`, `render`, `unit`, `feat`, `fix`, `refactor`, `docs`, `ci`, `chore`

## Issue Workflow
- 課題として追跡価値があるものは GitHub Issue 化して管理する
- 不具合は `bug`、問題品質は `question-quality`、改善案は `feature` / `ux` / `balance` / `content` を使い分ける
- 優先度は `P1 / P2 / P3` を本文またはラベルで明記する
- 着手時・引き継ぎ時は Issue 番号ベースで言及すると追跡しやすい
- 関連する Skill: `.ai/skills/SKILL_ISSUE_WORKFLOW.md`

## Operating Principles
- Keep updates short and factual.
- If unexpected local changes are detected, pause and ask the human.
- Do not delete or overwrite another agent's notes without reason.
- `tmp_*` 等の一時ファイルはコミットしない。

## Key Commands
```bash
npm run build          # TypeScript型チェック + Viteビルド
npm run quiz:validate  # 問題データのバリデーション
npm run dev            # 開発サーバー起動
npm run lint           # ESLintチェック
```
