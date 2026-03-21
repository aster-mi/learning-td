# SKILL: エージェント引き継ぎ

## 目的
CodexとClaudeが交互に作業しても、文脈ロスなく継続できる状態を作る。

## 参照ファイル
| ファイル | 用途 |
|---------|------|
| `.codex/CODEX.md` | Codex側の運用ルール |
| `.claude/CLAUDE.md` | Claude側の運用ルール |
| `.ai/AGENT_HANDOFF.md` | 引き継ぎログ（先頭に追記） |
| `.ai/TODO.md` | 共有タスクリスト |
| `.ai/DECISIONS.md` | 判断記録 |
| `.ai/SESSION_TEMPLATE.md` | ハンドオフのテンプレート |

## 作業開始時の手順

### 1. ハンドオフを読む
```bash
head -80 .ai/AGENT_HANDOFF.md
```
最新エントリの `Open Questions` と `Next Step` を最優先で確認する。

### 2. TODOと判断ログを確認
```bash
cat .ai/TODO.md
cat .ai/DECISIONS.md
```

### 3. 未コミットの変更を確認
```bash
git status --short
git stash list
```
自分が入れた変更でなければ、ユーザーに確認する。

## 作業終了時の手順

### 1. ハンドオフを書く
`.ai/AGENT_HANDOFF.md` の先頭（`---` の直後）にテンプレートで追記:

```
## [YYYY-MM-DD HH:mm JST] Agent: Codex|Claude
Summary:
- 何をしたか（1〜3行）

Changed Files:
- 変更したファイルをリスト

Validation:
- npm run build → 成功/失敗
- npm run quiz:validate → 成功/失敗
- その他確認事項

Open Questions:
- 未解決の質問・判断待ち

Next Step:
- 次に何をすべきか
```

### 2. TODOを更新
完了タスクのステータスを `done` に、新タスクを追加。

### 3. 重要判断があればDECISIONSに記録
形式は `.ai/DECISIONS.md` 内のテンプレートに従う。

## 良いハンドオフの条件
- 変更ファイルが具体的
- 検証結果が明確（成功 / 未実施 / 失敗+理由）
- 次担当がそのまま着手できる
- 曖昧な「だいたい終わり」ではなく、何が完了で何が未完かを明示

## NG
- 失敗や未確認を隠す
- 次ステップを書かない
- 他エージェントの作業を理由なく巻き戻す
