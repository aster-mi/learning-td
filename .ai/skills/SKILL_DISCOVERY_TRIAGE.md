# Skill: 問題発見と調査企画

## 目的

実装前の「問題発見 → Issue化 → 調査 → Ready化」を扱う。
既存 task を進める前に、何を課題として扱うべきか、どこまで調べれば実装可能かを整理する。

## 先に読むもの

- task state の正本は `.ai/skills/SKILL_GITHUB_TASK_WORKFLOW.md`
- Issue の書き方は `.ai/skills/SKILL_ISSUE_WORKFLOW.md`
- human 判断が必要なら `.ai/skills/SKILL_GITHUB_DISCUSSIONS_WORKFLOW.md`

## この skill を使うとき

- 問題点や改善案を見つけたい
- `Backlog` を棚卸ししたい
- 既存 Issue が古い / 曖昧 / もう解消済みか確認したい
- 実装前に調査や企画が必要
- `Backlog` を `Ready` に上げるための材料をそろえたい

## 見る場所

### 1. GitHub
- Project 2 の `Backlog`, `Ready`, `Done`
- open Issue の本文とコメント
- 関連 PR の差分や merge 済み履歴
- human 判断が絡むときは Discussions

### 2. repo
- 影響しそうな実装ファイル
- `.ai/doc/`
- `.ai/domain/`

### 3. 実行結果
- build / test / validate の失敗
- warning の傾向
- 実際に触って見つかった UX や品質の違和感

## 発見ソースの例

- バグや表示崩れ
- 操作導線の違和感
- 問題文 / 選択肢 / 回答品質の課題
- 報酬テンポや難易度のバランス課題
- パフォーマンスや bundle サイズの懸念
- stale な Issue や、すでに main で解消済みの Issue

## フロー

### 1. signal を集める
- Project 2 の `Backlog` と open Issue を見る
- 実装、レビュー、検証中に見つけた問題をメモする
- 既存 Issue が現状とズレていないか確認する

### 2. 既存 Issue を使うか判断する
- すでに同じ論点の Issue があれば更新する
- 既存 Issue が解消済みなら、根拠をコメントして close する
- 論点が別なら新しい Issue を切る

### 3. Issue 化する
- タイトル、本文、コメントは日本語で書く
- 最低限以下を書く
  - 概要
  - 背景 / 何が困るか
  - 現状または再現
  - 期待する状態
  - 優先度
  - 関連ファイル / 関連 docs
- Project 2 に載せて `Status: Backlog` を付ける

### 4. 調査する
- 影響範囲のファイルと docs を読む
- 実装済みか未実装か、別 PR で解消済みかを確認する
- 必要なら build / test / validate を回して根拠を取る
- 調査結果は Issue コメントに要約する

### 5. Ready にできるか判定する
- 以下がそろえば `Ready` に上げてよい
  - 問題設定が 1 テーマに絞れている
  - スコープと非スコープが分かる
  - 受け入れ条件が最低限ある
  - 主要な影響ファイルや docs が分かる
  - 次に動く actor が分かる

### 6. human 判断が必要なら分ける
- 仕様、優先度、運用ポリシーなど人判断が必要なら Discussion を立てる
- Discussion は 1 スレッド 1 論点
- 結論や link は Issue コメントに戻す

## 出力先

- task state: GitHub Projects
- 問題の定義と調査ログ: GitHub Issues
- human 判断: GitHub Discussions
- 永続的な設計判断: `.ai/domain/decisions.md`

## Ready に上げるコメント例

```md
調査メモ:
- 現状の実装は `src/...` でこの挙動になっている
- 関連 PR は #123
- main 上では未解消

Ready化メモ:
- スコープ: ○○ の改善
- 非スコープ: △△ の全面改修
- 受け入れ条件:
  - 条件1
  - 条件2
```

## やらないこと

- 調査メモを repo 内 Markdown に増やす
- `skills/` を総当たりで読んでから動く
- 根拠なしに古い Issue を残し続ける
- 人判断が必要な論点を Issue コメントだけで押し切る

## 関連

- `.ai/agents/ceo.md`
- `.ai/agents/planning.md`
- `.ai/help.md`
