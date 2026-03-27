# SKILL: GitHub Task Workflow

## 目的

GitHub Projects / Issues / PR を使って task の状態と作業ログを一元管理する。

## 正本

- task state: GitHub Projects
- task definition / work log: GitHub Issues
- implementation / review: Pull Requests
- human ↔ GM decisions: GitHub Discussions

## 現在使う Project

- [aster-mi / Project 2](https://github.com/users/aster-mi/projects/2)
- 新しい task はこの board に載せる

## 現在の Status 値

1. `Backlog`
2. `Ready`
3. `In progress`
4. `In review`
5. `Done`

## 現在の fields

- `Status`
- `Assignees`
- `Priority`
- `Size`

## 手順

### 1. task を作る
- 1 task 1 Issue を原則にする
- Issue 本文に以下を書く
  - 目的
  - スコープ
  - 非スコープ
  - 受け入れ条件
  - 参照 docs / ファイル
  - 対応者（assignee または本文）
  - human 判断がある場合の `Discussion Link`

### 2. Project に載せる
- `Status` を設定する
- `Priority` と `Assignees` を整える
- board は Project 2 を使う

### ticket に残すもの
- 現在の担当者: `Assignees` または Issue 本文
- 現在の状態: `Status`
- 作業ログ: Issue コメント
- human 判断: Discussion URL
- 実装差分: PR
- タイトル・本文・コメントは原則日本語

### 3. 作業を始める
- `Status: In progress`
- Issue コメントで開始宣言を残す

例:
```md
着手: Codex
予定:
- App.tsx に scene を追加
- ProgressScreen.tsx を新規作成
```

### 4. 実装する
- branch を切る
- PR を作る
- PR 本文に検証結果を日本語で書く

### 5. レビューに回す
- `Status: In review`
- Issue コメントに PR リンクを貼る

### 6. human 判断が必要なとき
- GitHub Discussions を作成または更新する
- Issue 本文とコメントに Discussion URL を残す
- 質問は 1 スレッド 1 論点に絞る
- 現在の Project 2 に `Blocked` field は無いので、status は今の phase を維持しつつ Discussion を正本にする
- Discussion を作っただけで safe default に戻せるなら、その run は `RUN RESULT: success` にする
- `RUN RESULT: needs-human` を使うのは hard blocker のときだけにし、直前へ `HARD BLOCKER: <human に必要な操作>` を 1 行で残す

### 7. 完了
- `Status: Done`
- Issue コメントに完了要約と検証結果を残す

## 禁止事項

- task state を repo 内ファイルへ手動転記する
- task ごとの作業ログ Markdown を repo 内に増やす
- procedure と policy を Issue 本文に埋め込みすぎる
- Project 2 に存在しない field を前提に自動化しない

## 関連

- `.ai/doc/source-of-truth.md`
- `.ai/doc/communication.md`
- `.ai/doc/conventions.md`
- `.ai/skills/SKILL_GITHUB_DISCUSSIONS_WORKFLOW.md`
