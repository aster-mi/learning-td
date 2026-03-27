# Communication Model

このプロジェクトのコミュニケーションは **task 単位** で行う。
旧来の channel ベース運用は新規採用しない。

## 基本方針

- task ごとのやり取りは GitHub Issue に集約する。
- 実装差分とコードレビューは Pull Request に集約する。
- GM と human の意思決定・確認依頼・エスカレーションは GitHub Discussions に集約する。
- GitHub Discussions は原則非同期相談であり、安全なデフォルトがある限り AI は止まらない。
- repo 内 Markdown は安定知識だけに使う。
- Issue / PR / Discussion のタイトル・本文・コメントは原則日本語で残す。
- コード、コマンド、識別子、外部サービス名など必要な英字はそのままでよい。

## task ログの置き場

### 1. Issue 本文
- 目的
- スコープ
- 非スコープ
- 受け入れ条件
- 参照ドキュメント / 参照ファイル

### 2. Issue コメント
- 着手
- 進捗
- ブロッカー
- 完了報告

### 3. PR
- 実装内容
- テスト結果
- レビュー指摘
- マージ判断

### 4. GitHub Discussions
- GM から human への確認依頼
- human から GM への追加指示
- 複数往復する判断
- task をまたぐ運用相談

運用ルール:
- 件名は `[\u003ckind\u003e][issue-\u003cnumber\u003e|cross-task] <short topic>` を使う
- 1スレッド1論点を守る
- 結論はスレッド末尾に要約を残す

## Human への確認

人の判断が必要な場合は以下を行う。

0. まず AI 側で low-risk な修復や回避策を試す
1. GitHub Projects の `Status` は現在の phase（`In progress` または `In review`）を維持する
2. GitHub Discussions にスレッドを立てる、または既存スレッドを更新する
3. Issue 本文またはコメントに Discussion URL を残す
4. Issue コメントで「Discussion に確認事項を書いた」ことを明記する
5. 回答後は Discussion に結論要約を追記する

注記:
- 現在の Project 2 には `Blocked` / `Needs Human` field が無い
- そのため human 待ちは `In progress` または `In review` を維持しつつ、Discussion URL と Issue コメントで表す
- Discussion を作っただけでは blocked 扱いにしない
- Discussion を作っただけで safe default に戻せる run は `success` 扱いにする
- `needs-human` を使う run では、`RUN RESULT` の直前に `HARD BLOCKER: <human に必要な操作>` を 1 行で残す
- `needs-human` は hard blocker のときだけ使う

## ticket の考え方

この運用では **ticket = Issue 本文 + Issue コメント + 関連 PR + 必要なら関連 Discussion** とみなす。

- 現在の担当者: Project field `Assignees` または Issue 本文
- 現在の状態: Project field `Status`
- 実行ログ: Issue コメント
- human 判断: Discussion
- 実装差分: PR

## repo 内でやらないこと

- 新しい task ごとの Markdown ログを `.ai/` に増やす
- channel 風の横断会話を repo 内に作る
- GitHub 上の状態を repo 内ファイルへ手動転記する
- human との往復判断を repo 内 Markdown に閉じ込める
