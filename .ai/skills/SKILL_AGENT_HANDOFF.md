# Skill: エージェント引き継ぎ

## 目的
CodexとClaudeが交互に作業しても、文脈ロスなく継続できる状態を作る。

## 参照先
- `.codex/CODEX.md`
- `.claude/CLAUDE.md`
- `.ai/AGENT_HANDOFF.md`
- `.ai/SESSION_TEMPLATE.md`

## 手順
1. 作業開始前に最新handoffを読む
2. `Open Questions` と `Next Step` を最優先で確認
3. 作業終了時にテンプレートで先頭へ追記
4. 重要判断があれば `.ai/DECISIONS.md` に追加
5. 未完タスクを `.ai/TODO.md` に反映

## 良いhandoffの条件
- 変更ファイルが具体的
- 検証結果が明確（成功/未実施/失敗理由）
- 次担当がそのまま着手できる

## NG
- 「だいたい終わり」など曖昧な表現だけ残す
- 失敗や未確認を隠す
- 次ステップを書かない
