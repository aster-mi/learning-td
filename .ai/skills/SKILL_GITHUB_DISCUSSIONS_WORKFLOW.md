# SKILL: GitHub Discussions Workflow

## 目的

GM と human の意思決定、確認依頼、複数往復するエスカレーションを GitHub Discussions で管理する。

## 正本

- human ↔ GM の判断: [learning-td / discussions](https://github.com/aster-mi/learning-td/discussions)

## 使う場面

- human の判断が必要で、Issue コメントだけでは流れを追いにくいとき
- human から GM へ追加指示を出したいとき
- 1つの task を超える運用相談をしたいとき
- Issue コメントだけでは流れが追いにくいとき
- Discussion のタイトル、本文、コメントを日本語で残したいとき

## 件名フォーマット

件名は以下の形式を使う。

```text
[<kind>][issue-<number>|cross-task] <short topic>
```

### kind

- `decision`: human の判断が必要
- `escalation`: ブロッカーやリスクの報告
- `request`: human から GM への追加指示
- `ops`: task をまたぐ運用相談

### 例

- `[decision][issue-123] 進捗画面を scene にするか modal にするか`
- `[escalation][issue-245] questionStats 更新方針が未確定`
- `[request][issue-310] ガチャ演出を派手にしたい`
- `[ops][cross-task] 次フェーズで UX と content のどちらを優先するか`

## 1スレッド1論点

- 1つの Discussion では **1つの判断 / 1つの質問** だけを扱う
- 別論点が出たら新しい Discussion を作る
- 同じ topic の続きなら新規スレッドを増やさず既存スレッドに返信する
- 1スレッドの結論は最後に 2〜5 行で要約する

### NG

- 1スレッドで複数 task の判断を同時に聞く
- 「ついでに」別件を同じスレッドへ混ぜる
- 結論が出たのに要約を残さず閉じる

## 手順

### 1. task 側の phase を維持する
- GitHub Projects の `Status` は現在の phase（`In progress` または `In review`）を維持する
- Discussion URL を Issue / PR コメントに残して human 待ちを明示する
- Discussion を作っただけでは blocked 扱いにしない
- 安全なデフォルトで進められる範囲は進める
- safe default で進め切れた run は `RUN RESULT: success` にする
- `RUN RESULT: needs-human` を使うのは hard blocker のときだけにし、直前へ `HARD BLOCKER: <human に必要な操作>` を 1 行で残す

### 2. Discussion を作る / 更新する
- 件名は上記フォーマットに従う
- 本文とコメントは原則日本語で書く
- 最初の投稿に以下を書く
  - 何を判断してほしいか
  - 選択肢があるなら 2〜3 個まで
  - 推奨案があるならその理由
  - 期限や影響範囲
  - 関連 Issue / PR

テンプレート:

```md
## Context
- 背景

## Decision Needed
- 何を決めてほしいか

## Options
1. 案A
2. 案B

## Recommendation
- 推奨案と理由

## Impact / Deadline
- いつまでに必要か
- どこに影響するか

## Links
- Issue: #123
- PR: #456
```

### 3. Issue にリンクする
- Issue 本文の `Discussion Link` を埋める
- 既存 Issue コメントにも Discussion URL を残す
- PowerShell で `gh issue edit/comment --body-file` を使うときは `Set-Content -Encoding UTF8` ではなく `[System.IO.File]::WriteAllText(..., [System.Text.UTF8Encoding]::new($false))` を使い、BOM を混ぜない

例:
```md
Human decision requested:
- Discussion: https://github.com/aster-mi/learning-td/discussions/123
- Blocking point: ステータス画面を独立 scene にするか modal にするか
```

### 4. 回答後
- Issue コメントに要約を書く
- 必要なら `Status` を `Ready` または `In progress` に戻す
- Discussion の最後に結論要約を残す

## Discussion に残すもの

- 判断依頼
- human からの追加指示
- 複数回の往復
- 結論の要約

## Discussion に残さないもの

- 細かい実装ログ
- build 結果の羅列
- PR レビューそのもの

## 禁止事項

- human 判断を repo 内 Markdown に閉じ込める
- Issue コメントだけで長い往復を続ける
- Discussion を作ったのに Issue 側へリンクしない
- 件名フォーマットを崩して後から検索しづらくする
- 1スレッドに複数論点を混ぜる
