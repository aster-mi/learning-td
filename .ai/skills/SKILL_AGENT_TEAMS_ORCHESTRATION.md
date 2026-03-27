# SKILL: Agent Teams オーケストレーション

Claude Code の Agent Teams 機能を使って、複数のチームメンバーに並列実装を委任するスキル。
Codex が使えない・遅い場合の代替として、またはより高品質な実装が必要な場合に優先する。

## 前提

- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` が設定済み（settings.json に記載）
- セッション内で `claude_teammate_*` 系のツールが利用可能であること
- Claude Code v2.1.32 以降

## Codex との使い分け

| 状況 | 推奨 |
|------|------|
| チームメンバーツールが使える | **Agent Teams** |
| 実装中に判断・設計相談が発生しそう | **Agent Teams** |
| シンプルな単発実装タスク | どちらでも可 |
| Codex の方が速い・安い場面 | Codex |

## 実装委任の手順

### Step 1: タスク分析・分割

READY.md のスペックを読み、独立して実装できる単位に分割する。
ファイル競合の判断は `SKILL_CODEX_ORCHESTRATION.md` の「競合しやすいファイル」表を参照。

### Step 2: チームメンバーを生成

各タスクにチームメンバーを1人ずつ割り当てる（最大5人）。
プランが必要なリスクの高いタスクは「プラン承認あり」で生成する。

```
タスクAとタスクBを並列実装してください。
- teammate-a: src/components/StageSelect.tsx のUI改善（プラン承認あり）
- teammate-b: src/data/questionBanks/math.jsonl に問題を20問追加

変更ファイル制約:
- teammate-a は src/components/StageSelect.tsx のみ変更すること
- teammate-b は src/data/questionBanks/math.jsonl のみ変更すること
- 共有ファイル（App.tsx, unitCatalog.ts）は変更しないこと
```

### Step 3: チームメンバーの監視・調整

- 各チームメンバーの進捗を確認する（アイドル通知を待つ）
- 問題が起きたら直接メッセージを送って修正指示を出す
- プラン承認リクエストが来たらレビューして承認 or 却下する

### Step 4: ブランチとPR処理

チームメンバーはブランチを作成・プッシュするが、**PR作成・マージはGMが行う**。

```bash
gh pr create --base main --head agent/<branch-name> \
  --title "<scope>: <要約>" --body "Agent Teamsによる実装"
gh pr merge <番号> --merge --delete-branch
```

### Step 5: 共有ファイルの統合

チームメンバーの実装完了後、GMが共有ファイルを更新する（Codexワークフローと同じ）。

```
unitCatalog.ts, renderers/index.ts などの登録処理はGMが直接実施
```

### Step 6: クリーンアップ

```
チームをクリーンアップしてください
```

## チームサイズの目安

- タスク1〜2個: チームメンバー不要、GMが直接実施
- タスク3〜6個: チームメンバー3人
- タスク7〜15個: チームメンバー3〜5人（各5〜6タスク担当）

## プランプトテンプレート（チームメンバーへの生成指示）

```
あなたはlearning-tdプロジェクトの実装担当です。
作業ディレクトリ: D:/game/tower/learning-td

タスク: [具体的な実装内容]

制約:
- 変更対象ファイル: [リスト]
- 変更禁止ファイル: unitCatalog.ts, App.tsx, renderers/index.ts（統合はGMが行う）
- 作業前に必ずブランチを作成: git checkout main && git pull && git checkout -b agent/<task-name>
- 完了後に npm run build で成功確認
- ビルド成功後に git push origin agent/<task-name>
- PR作成はしない（GMが行う）
- コミットメッセージ形式: `<scope>: <summary>`
```

## NG

- チームメンバーに共有ファイル（unitCatalog.ts等）を変更させる
- チームメンバーにPRを作成・マージさせる
- プラン未承認のまま破壊的変更を進めさせる
- チームが完了する前にGMがシャットダウンする
