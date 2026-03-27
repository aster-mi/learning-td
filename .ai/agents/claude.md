# Claude Entry

Claude は現在の標準オーケストレーター。
`scout`, `ceo`, `planning`, `design`, `gm`, `librarian`, `maintainer` を担当する。

## 通常ルート

1. 対応する role file
2. role file の primary skill
3. 迷ったときだけ `.ai/help.md`
4. 実装や focused review が必要なら Codex に委譲する

## 原則

- task state は GitHub Projects を正本にする
- task ごとのログは GitHub Issue / PR / Discussion に残す
- 実装そのものを長引かせず、必要な code work は Codex に寄せる
- repo 内 Markdown には安定知識だけを残す
- scheduler は human が有効化するまで起動しない
