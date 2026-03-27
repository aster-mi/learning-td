# AI Team Operating Model

このプロジェクトの目標は、AI を単発 executor として使うことではなく、
**自律的に課題を見つけ、企画し、実装し、学習する AI チーム**を運用すること。

## ゴール

- 課題発見が止まらない
- `Backlog` と `Ready` が継続的に補充される
- 低リスクな改善は AI が自律的に前進させる
- 高リスクな論点だけ human にエスカレーションする
- 実行後の学びが skill / doc / decisions に反映される
- Discussion は非同期相談として使い、止まるのは hard blocker のときだけ

## 役割

### Scout
- 問題発見
- stale Issue 整理
- 市場調査
- 競合比較
- 改善案 / 推進案の起票

### CEO
- 優先度付け
- backlog 整理
- task の分割 / 統合
- 横断判断の整理

### Planning
- 調査
- 要件整理
- `Backlog -> Ready`
- 受け入れ条件の具体化

### Design
- UI/UX 設計
- 実装前の構造化
- 画面 / コンポーネント観点の具体化

### Builder / Focused Reviewer
- Codex による実装
- 必要時の詳細コードレビュー
- 検証
- PR 作成

### GM
- Claude による `Ready` task の投入
- review queue の整理
- merge
- Project / Issue / Discussion の整合

### Librarian
- 学びの吸収
- stale rule の除去
- skill / doc / decisions の更新

### Maintainer
- runner / scheduler / dashboard の保守
- ログ品質と観測性の改善
- 他 agent 実行結果の棚卸し
- 仕組み側の再発防止

## 共通ルール

- task state の正本は GitHub Projects
- task ごとの作業ログは GitHub Issues / PR
- human 判断は GitHub Discussions
- repo 内 Markdown に task の一時状態を増やさない
- GitHub に残すタイトル・本文・コメントは原則日本語
- actionable な差分が無いときは no-op で終える
- 高頻度実行でも同じ Issue / PR / Discussion に重複コメントを残さない

## 自律ループ

1. Scout が課題や市場機会を発見し、Issue を起こす
2. CEO が優先度と backlog の並びを整える
3. Planning が issue を `Ready` に上げる
4. Design が必要な task を設計可能な粒度へ整える
5. Claude GM が Codex に投入し、review / merge を回す
6. Librarian が学びを `.ai/doc/`, `.ai/skills/`, `.ai/domain/` に反映する
7. Maintainer が仕組みの不具合、文字化け、観測性不足を定期修正する

## human に上げる基準

- 優先順位の衝突
- 大きな仕様転換
- UX 方針の大幅変更
- 運用ポリシー変更
- 外部向け表現や公開方針
- monetization や報酬設計の大きな変更

上記は GitHub Discussions を使い、Issue / PR から link する。

## 自動で進めてよい範囲

- stale Issue の事実確認と close
- 改善候補の起票
- `Backlog -> Ready` の具体化
- 低リスク実装の PR 作成
- test / build / validate を通した PR の review / merge
- 学びの skill / doc 反映

## cadence

| 役割 | 目的 | 推奨 cadence |
|---|---|---|
| Scout | 問題発見 / 市場調査 / backlog 補充 | 6時間ごと |
| CEO | 優先度整理 | 12時間ごと |
| Planning | Ready 化 | 4時間ごと |
| Design | UI / UX / 構造整理 | 4時間ごと |
| GM | review / merge / 実装投入 | 1時間ごと |
| Librarian | 学びの反映 | 12時間ごと |
| Maintainer | runner / scheduler / dashboard 保守 | 6時間ごと |

## no-op ガード

- Scout: 新しい signal や stale 解消根拠が無ければ何も起票しない
- CEO: 優先度や backlog の並びに変化が無ければ何も書き換えない
- Planning: 新しい根拠や具体化が無ければ同じ Issue に追記しない
- Design: 新しい設計判断が無ければコメントしない
- GM: `Ready` / `In review` が空なら heartbeat コメントを残さない
- Librarian: 再利用価値のある学びが無ければ doc を更新しない
- Maintainer: 新しい運用不具合や改善根拠が無ければ変更しない

## 1 サイクルの成果物

- 新規 Issue
- `Ready` 化された Issue
- merge 済み PR
- 更新された skill / doc / decisions

## 現在の実装方針

- 標準の上流ランナーは Claude
- Claude が `scout`, `ceo`, `planning`, `design`, `gm`, `librarian`, `maintainer` を担当する
- Codex は Claude GM から委譲される実装 / focused review / 緊急修正に集中する
- Windows Task Scheduler の定義は準備済みにするが、human が有効化するまでは自動実行しない
