Codex CLI を使ってタスクを実行するスキルです。

## 手順

1. ユーザーの要求を分析し、独立したサブタスクに分割する
2. 各サブタスクの変更対象ファイルをリストアップし、競合がないか確認する
3. `.ai/skills/SKILL_CODEX_ORCHESTRATION.md` のルールに従い、プロンプトを組み立てる
4. 並行可能なタスクは `Bash` ツールの `run_in_background` で同時起動する
5. 全 Codex 完了後、`npm run build` と `npm test` で検証する
6. 必要なら統合作業（共有ファイルへの登録等）を Claude が実施する

## 実行コマンド形式

```bash
codex exec -C /d/game/tower/learning-td --full-auto "プロンプト"
```

## プロンプト構成

Codex に渡すプロンプトには必ず以下を含めること:

- 具体的なタスク内容
- 変更対象ファイルの限定リスト
- 変更禁止ファイルのリスト（競合防止）
- `.codex/CODEX.md` に従う旨
- 完了後に `npm run build` で確認する指示
- コミットメッセージ形式: `<scope>: <summary>`

## 引数

$ARGUMENTS にタスク内容を渡すと、分析→分割→実行まで自動で行います。
引数なしの場合はタスク内容をヒアリングします。
