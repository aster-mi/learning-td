# Agent Collaboration Guide

This repository can be edited by both Codex and Claude in alternating sessions.
Use this file as the shared operating contract.

---

## セッション開始時
作業前に次のファイルを確認すること。

```bash
head -80 .ai/AGENT_HANDOFF.md
cat .ai/TODO.md
cat .ai/DECISIONS.md
git status --short
```

## セッション終了時
- 作業内容は `.ai/AGENT_HANDOFF.md` の先頭に追記する。
- 恒久的な判断は `.ai/DECISIONS.md` に残す。
- 完了した項目は `.ai/TODO.md` を更新する。
- 改修した内容は、区切りごとに commit して push まで行う。
- 他者の未コミット変更がある場合は巻き戻さず、必要な範囲だけ別 commit / push に分ける。

### handoff テンプレート
```md
## [YYYY-MM-DD HH:mm JST] Agent: Codex
Summary:
- 今回の要点
Changed Files:
- 変更したファイル
Validation:
- npm run build: OK / NG
- npm run quiz:validate: OK / NG
Open Questions:
- 未解決事項
Next Step:
- 次にやること
```

## ナレッジ更新
失敗や手戻り、追加した品質観点は `.ai/skills/SKILL_KNOWLEDGE_UPDATE.md` を確認した上で Skills に反映する。
特に次の場合は更新を検討する。

- 新しい品質チェック観点が見つかった
- 追加運用ルールが必要になった
- 同じ失敗を繰り返しそうな兆候がある

## 共有ファイル
| ファイル | 用途 |
|---------|------|
| `.claude/CLAUDE.md` | Claude 用の運用ルール |
| `.ai/AGENT_HANDOFF.md` | セッション引き継ぎログ |
| `.ai/TODO.md` | 共有タスク |
| `.ai/DECISIONS.md` | 設計判断メモ |
| `.ai/SESSION_TEMPLATE.md` | handoff 用テンプレート |
| `.ai/skills/` | プロジェクト専用 Skills |
| `.ai/UNIT_POLICY.md` | ユニット追加ポリシー |

## コミット規約
- 形式: `<scope>: <short summary>`
- 1コミットにつき1つの意図に絞る。
- scope: `quiz`, `render`, `unit`, `feat`, `fix`, `refactor`, `docs`, `ci`, `chore`, `balance`

## Issue運用
- 問題や改善案を見つけたら GitHub Issue に起票して追う。
- ラベルは `bug`, `question-quality`, `feature`, `ux`, `balance`, `content`, `docs`, `data`, `performance`, `retention` を使い分ける。
- 優先度は `P1`, `P2`, `P3` を付ける。
- 引き継ぎや作業報告では Issue 番号を明記する。
- 関連 Skill: `.ai/skills/SKILL_ISSUE_WORKFLOW.md`

## 運用原則
- 進捗共有は短く、事実ベースで書く。
- 想定外のローカル変更を見つけたら、いったん止めて人間に確認する。
- 他エージェントのメモは、理由なく削除・上書きしない。
- `tmp_*` の一時ファイルはコミットしない。

## 主要コマンド
```bash
npm run build
npm run quiz:validate
npm run dev
npm run lint
```
