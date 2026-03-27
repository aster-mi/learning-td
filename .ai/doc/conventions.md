# Operating Conventions

## task 管理

- 1 Issue = 1 task を原則にする
- task state は GitHub Projects の `Status` だけで管理する
- 利用する board は [aster-mi / Project 2](https://github.com/users/aster-mi/projects/2)
- task の進捗ログは Issue コメントへ書く
- 実装レビューは PR を正本にする
- GM と human の往復判断は [learning-td / discussions](https://github.com/aster-mi/learning-td/discussions) を使う
- human 待ち専用 field はまだ無いので、Discussion URL と Issue コメントを正本にする
- GitHub に残す記録は原則日本語にする

## Current Project 2 Status

1. `Backlog`
2. `Ready`
3. `In progress`
4. `In review`
5. `Done`

## Current Project 2 Fields

- `Status`
- `Assignees`
- `Priority`
- `Size`

## ticket に残すもの

- Goal
- Scope
- Non-goals
- Acceptance Criteria
- Relevant Context
- Owner Agent
- Risk
- Discussion Link（human 判断がある場合）
- 作業ログは Issue コメントで時系列に残す

## Discussion 規約

- 件名形式: `[\u003ckind\u003e][issue-\u003cnumber\u003e|cross-task] <short topic>`
- 1スレッド1論点
- 結論はスレッド末尾に要約する

## `.ai/` の責務分離

- `.ai/doc/`: 全体ルール
- `.ai/domain/`: ドメイン知識・設計判断
- `.ai/skills/`: task ごとの手順書
- `.ai/agents/`: 役割ごとの入口

## skill の扱い

- 各作業で必要な手順書は **skill として分けて維持する**
- 共通ポリシーを skill に混ぜない
- 一時的な task 状態を skill に書かない

## 命名

- branch: `codex/issue-<number>-<short-slug>`
- commit: `<scope>: <short summary>`
- Issue / PR / Discussion のタイトルは原則日本語
- docs の見出しは役割/責務が一目で分かる名前にする
- repo 内に task history を蓄積しない
