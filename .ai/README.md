# Learning TD — 自律エンハンスシステム ガイド

---

## 概要

このプロジェクトは **複数のAIエージェントが自律的に協働して継続的にアプリを改善** する仕組みを持っています。
ユーザーは基本的に何もしなくても開発が進みます。確認や指示が必要な場合のみ通知が届きます。

現在の標準体制は **Claude が上流の orchestration を担当し、Codex が実装と focused review を担当** する構成です。
また、スケジューラは **disabled のまま登録済み** で、**自動実行はまだ有効化していません**。

---

## エージェント一覧

| エージェント | タスクID | 起動タイミング | runner | 役割 |
|---|---|---|---|---|
| Scout | `learning-td-scout` | 6時間ごと | Claude | 課題発見・backlog補充 |
| CEO | `learning-td-ceo` | 12時間ごと | Claude | 戦略方針の決定 |
| 企画＋調査 | `learning-td-planning` | 4時間ごと | Claude | トレンド調査・機能仕様化 |
| デザイン | `learning-td-design` | 4時間ごと | Claude | UI/UX設計・仕様のREADY化 |
| GM | `learning-td-gm` | 1時間ごと | Claude | Codex投入・レビュー調整・マージ |
| Librarian | `learning-td-librarian` | 12時間ごと | Claude | 学びの反映 |
| Maintainer | `learning-td-maintainer` | 6時間ごと | Claude | runner / scheduler / dashboard 保守 |
| Codex（実装 / focused review） | GMから起動 | GMセッション内 | Codex | コード実装・必要時の詳細レビュー |

---

## 一日の流れ

```
00:30  Scout
         backlog と open issue を巡回して課題候補を補充

07:00  CEO
         プロジェクト全体を俯瞰して優先テーマを決定
         → .ai/STRATEGY.md に書き込む

08:30  企画＋調査
         CEO方針を読む
         Web検索でトレンド・競合を調査 → .ai/RESEARCH.md
         機能仕様を言語化 → .ai/specs/PENDING.md

09:30  デザイン
         PENDING.md の仕様を読む
         UI/UX設計・コンポーネント設計を追記
         設計完了したものを PENDING.md から READY.md へ移す

10:00  GM
         READY / In review を見てCodexに実装・focused reviewを投入
         ┌─ Codex A: codex/task-a ブランチで実装
         ├─ Codex B: codex/task-b ブランチで実装
         └─ Codex C: codex/task-c ブランチで実装（最大10並列）
         必要なら Codex に詳細レビューを依頼
         Claude GM は review queue / build確認 / マージを担当
         .ai/DASHBOARD.md を更新

22:30  Librarian
         merge 済み PR や解決済み Discussion から学びを反映

03:15  Maintainer
         runner / scheduler / dashboard / logs を保守

         GM は以降1時間ごと、Scout / Maintainer は6時間ごと、
         CEO / Librarian は12時間ごと、Planning / Design は4時間ごとに繰り返す
```

---

## 情報フロー

```
CEO
 └─ STRATEGY.md ──────────────────┐
                                   ↓
企画＋調査                     全エージェントが参照
 ├─ RESEARCH.md（調査結果）
 └─ specs/PENDING.md（仕様）
              ↓
           デザイン
              └─ specs/READY.md（設計済み仕様）
                          ↓
                         GM (Claude)
                          ├─ Codex × 最大10本（ブランチ実装 / focused review）
                          ├─ PR作成・レビュー調整・マージ
                          ├─ specs/DONE.md（完了アーカイブ）
                          └─ DASHBOARD.md（全体状況）
```

---

## ファイル構成

```
.ai/
  STRATEGY.md          CEOが書く戦略方針（全員が読む）
  RESEARCH.md          企画＋調査が書くトレンド調査ログ
  DASHBOARD.md         GMが更新する全体状況ボード ← ユーザーはここを見る
  AGENT_HANDOFF.md     全エージェントのセッションログ
  TODO.md              共有タスクリスト
  DECISIONS.md         設計判断の永続メモ
  specs/
    PENDING.md         企画が書いた仕様（デザイン待ち）
    READY.md           デザイン完了済み仕様（実装待ち）
    DONE.md            実装完了済みアーカイブ
  inbox/
    human.md           ★ユーザーへのメッセージ（ここを確認）
    ceo.md             CEOへのメッセージ
    planning.md        企画＋調査へのメッセージ
    design.md          デザインへのメッセージ
    gm.md              GMへのメッセージ
  skills/              エージェント向け運用スキル集
```

---

## ユーザーマニュアル

### 普段やること

**基本的に何もしなくてOKです。**
エージェントが毎日自律的に動いてアプリを改善し続けます。

状況を確認したいときは以下の2ファイルだけ見てください：

| ファイル | 内容 |
|---|---|
| `.ai/DASHBOARD.md` | 今日の方針・スペック進捗・PR状況・ビルド状態 |
| `.ai/inbox/human.md` | エージェントからのメッセージ（要確認時のみ届く） |

---

### エージェントからメッセージが届いたとき

`inbox/human.md` を開くとこのような形式で届きます：

```markdown
## [2026-03-23 10:01 JST] FROM: GM → TO: human | STATUS: unread
**Subject:** パイプライン枯渇のため方針確認
READY.md が空です。次に進むべき領域を教えてください。
Reply:
---
```

#### 返信する場合

`Reply:` の後に書いて `STATUS: replied` に変更するだけです：

```markdown
## [2026-03-23 10:01 JST] FROM: GM → TO: human | STATUS: replied
**Subject:** パイプライン枯渇のため方針確認
READY.md が空です。次に進むべき領域を教えてください。
Reply: UX改善を優先して
---
```

次のGMセッション（有効化後は通常1時間以内）で自動的に拾って処理します。

#### 返信しない場合

**何もしなくてOKです。**
約10時間後（2セッション経過後）にエージェントがベストジャッジで自律的に進みます。
判断内容は `AGENT_HANDOFF.md` に記録されます。

---

### 自分から指示を出したい場合

`inbox/human.md` の末尾に `[指示]` タグで追記するだけです：

```markdown
## [指示] ガチャ画面の演出を派手にしたい
レアユニット排出時にエフェクトを追加してほしい。
参考: にゃんこ大戦争のガチャ演出みたいなイメージ。
```

次のGMセッションで自動的に拾って TODO に取り込み、
企画→デザイン→実装のパイプラインに流します。
処理後は `[指示済み]` に書き換えられます。

---

### 優先度を上げたい・方向性を変えたい場合

`STRATEGY.md` に直接書いてもOKです：

```markdown
## [手動指示] 今週はバグ修正優先で
新機能よりも既存の不具合を先に潰してほしい。
```

次のCEOセッションで読み込まれ、方針に反映されます。

---

### スケジュールタスクの管理

現状は **disabled で登録済み** です。Windows Task Scheduler 上には存在しますが、有効化するまでは動きません。

後で起動するときは PowerShell で次を使います：

```powershell
cd D:\game\tower\learning-td
.\tools\agents\setup-task-scheduler.ps1 -Register       # disabled で登録
.\tools\agents\setup-task-scheduler.ps1 -Register -Enable  # 有効化して登録
```

確認 / 削除:

```powershell
Get-ScheduledTask | Where-Object { $_.TaskName -like "learning-td-*" }
.\tools\agents\setup-task-scheduler.ps1 -Remove
```

---

## エスカレーション基準（エージェントがメッセージを送る条件）

エージェントは基本的に自律判断して進みます。
以下の場合のみ `inbox/human.md` にメッセージが届きます：

| 状況 | 送信元 |
|---|---|
| パイプライン枯渇（READY・TODOがともに空） | GM |
| Codexが3回以上同じタスクで失敗 | GM |
| 予期しないコードの大規模削除・破壊的変更を発見 | GM |
| 戦略の根本方向性でユーザーの意図確認が必要 | CEO |
| 仕様の方向性でユーザーの意図確認が必要 | 企画 |
| 既存デザインシステムと大きく矛盾する要求 | デザイン |

---

## トラブルシューティング

### ビルドが壊れた

`DASHBOARD.md` の「ビルド状態」が ❌ になっていれば、
次のGMセッションで自動修復を試みます。
修復できない場合は `inbox/human.md` にエスカレーションが届きます。

### PRが溜まってマージされない

自動実行をまだ有効化していない場合は、GM を手動実行してください：

```powershell
.\tools\agents\run-agent.ps1 -Agent gm
```

### エージェントが同じ失敗を繰り返す

`inbox/human.md` にエスカレーションが届くはずですが、
もし届かない場合は `AGENT_HANDOFF.md` の直近エントリを確認して状況を把握してください。

---

## コミットルール（参考）

エージェントが従うコミットフォーマット：

```
<scope>: <summary>

scope: quiz / render / unit / feat / fix / refactor / docs / ci / chore / balance
```

---

*このドキュメントはシステム全体の概要です。各エージェントの詳細な動作仕様は `.ai/skills/` を参照してください。*
