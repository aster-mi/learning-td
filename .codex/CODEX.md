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
