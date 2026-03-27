# SKILL: GitHub PR Automation

## 目的

検証、PR コメント、マージ、Issue / Discussion / Project 同期までを決まった手順で自動実行する。

## 使う場面

- PR がすでに open で review 可能な状態にある
- GM が review 以降の流れを毎回同じ手順で進めたい
- merge、Issue close、Discussion 要約、Project 更新をまとめて行いたい

## 現在の Project 2 の前提

- status 値は `Backlog`, `Ready`, `In progress`, `In review`, `Done`
- 確認済み custom field は `Priority`
- 現在は `Blocked` / `Needs Human` field は無い
- `read:project` が無い場合は Project queue / item 読み取りを skip し、それ以外は継続する
- `project` が無い場合は Project 更新だけを skip し、それ以外は継続する

## 主要スクリプト

- 単一 PR:
  `tools/github/process-pr-review.ps1`
- review queue:
  `tools/github/process-review-queue.ps1`

## 単一 PR

```powershell
cd D:\game\tower\learning-td
.\tools\github\process-pr-review.ps1 -PrNumber 30
```

処理内容:

1. PR 情報を読む
2. PR 本文または branch 名から関連 Issue 番号を特定する
3. 一時 worktree を作る
4. 検証スクリプトを実行する
5. PR にレビュー結果を日本語で残す
6. PR をマージする
7. 関連 Issue を close または更新する
8. 関連 Discussion があれば要約を追記する
9. 権限があれば Project item を `Done` に更新する

## Review Queue

```powershell
cd D:\game\tower\learning-td
.\tools\github\process-review-queue.ps1
```

処理内容:

- Project 2 を読む
- `In review` にある open PR を探す
- 各 PR に対して `process-pr-review.ps1` を実行する

必要権限:

- `read:project`: review queue の取得、Project item の参照
- `project`: Project status の更新
- 上記が不足しても Issue / PR / Discussion の同期は継続する

## Dry Run

```powershell
.\tools\github\process-pr-review.ps1 -PrNumber 30 -DryRun
.\tools\github\process-review-queue.ps1 -DryRun
```

スクリプト変更時や権限確認時に使う。

## 記録ルール

- 1 Issue = 1 task
- 1 PR は原則 1 task Issue を完了させる
- PR 本文には関連 Issue 番号を `Issue: #123`、`関連: #123`、`Refs #123` のいずれかで残す
- branch 名は `codex/issue-123-short-slug` を推奨する
- human 判断が絡む場合は PR 本文に Discussion URL を残す
- PR コメント、Issue コメント、Discussion コメントは原則日本語

## 検証

既定では `package.json` から以下の順で検証する:

1. `quiz:validate`
2. `build`
3. `test`

script が存在しない場合は skip する。

## 失敗時の挙動

- 検証に失敗したら PR は open のままにする
- PR と関連 Issue に失敗結果を日本語で残す
- 関連 Discussion があれば失敗状況を追記する
- 失敗時に Project status を前進させない

## human 判断が必要なとき

PR が product / design 判断で止まる場合:

1. まだ auto-merge を実行しない
2. GitHub Discussion を作る、または更新する
3. 判断が固まってから auto review を再開する

関連:
- `.ai/skills/SKILL_GITHUB_DISCUSSIONS_WORKFLOW.md`
