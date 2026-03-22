# SKILL: Codex オーケストレーション

## 目的
Claude Code セッション内から Codex CLI を呼び出し、複数タスクを並行実行する。
ファイル競合を防ぎつつ、両エージェントの長所を活かして生産性を最大化する。

## 前提
- Codex CLI パス: `codex` (npm global)
- バージョン: 0.111.0+
- 実行コマンド: `codex exec` (非対話モード)

## 基本コマンド

### 単発実行
```bash
codex exec -C /d/game/tower/learning-td \
  --full-auto \
  "タスクの説明"
```

### オプション一覧
| フラグ | 説明 |
|--------|------|
| `-C DIR` | 作業ディレクトリ指定 |
| `--full-auto` | サンドボックス内で自動承認（推奨） |
| `-a never` | 承認なし（`--full-auto` と同等だがサンドボックスなし） |
| `-m MODEL` | モデル指定 (例: `o4-mini`, `o3`) |
| `-s workspace-write` | サンドボックスモード |

## 並行実行のルール

### 1. タスク分割の原則

**ファイル排他が最優先。** 同じファイルを複数の Codex が触らないこと。

分割パターン:

| パターン | 例 |
|----------|-----|
| **シリーズ別** | Codex A: 自然シリーズのレンダラー, Codex B: 歴史シリーズのレンダラー |
| **レイヤー別** | Codex A: データ層 (`src/data/`), Codex B: UI層 (`src/components/`) |
| **ドメイン別** | Codex A: 問題追加, Codex B: ユニット追加 |
| **テスト + 実装** | Codex A: テスト作成 → 完了後に Codex B: 実装 (逐次) |

### 2. 競合しやすいファイル（注意）

以下のファイルは複数タスクで触れやすいので、**1つの Codex にのみ**割り当てる:

| ファイル | 理由 |
|----------|------|
| `src/data/unitCatalog.ts` | 全ユニット定義の集約 |
| `src/data/stages.ts` | ステージ定義 |
| `src/data/saveData.ts` | セーブ構造、コイン計算 |
| `src/scenes/GameScene.tsx` | ゲームのメインループ |
| `src/App.tsx` | シーン管理のルート |
| `src/components/renderers/index.ts` | レンダラー登録 |

### 3. プロンプトテンプレート

Codex に渡すプロンプトには以下を必ず含める:

```
作業ルール:
- .codex/CODEX.md に従うこと
- 作業開始前に必ずブランチを切ること:
  git checkout main && git pull origin main && git checkout -b codex/<task-name>
- 変更対象は以下のファイルのみに限定: [ファイルリスト]
- 以下のファイルは絶対に変更しないこと: [排他ファイルリスト]
- 完了後に npm run build で成功を確認すること
- ビルド成功後に git push origin codex/<task-name> すること
- PRの作成・マージは Claude が行うので、Codex はブランチをプッシュするだけでよい
- コミットメッセージは `<scope>: <summary>` 形式

タスク:
[具体的な指示]
```

## 実行手順

### Step 1: タスク分析
ユーザーの要求を分析し、独立したサブタスクに分割する。
各サブタスクの **変更対象ファイル** を明確にリストアップする。

### Step 2: 競合チェック
サブタスク間で変更ファイルが重複していないか確認する。
重複がある場合:
- 逐次実行に切り替える（依存タスクを後に回す）
- または共有ファイルの変更を Claude 側で事前に行い、Codex は個別ファイルのみ担当

### Step 3: 並行起動（各 Codex は専用ブランチで作業）
```bash
# run_in_background: true で並行実行
codex exec -C /d/game/tower/learning-td --full-auto "..."  # → codex/task-a ブランチ
codex exec -C /d/game/tower/learning-td --full-auto "..."  # → codex/task-b ブランチ
```

### Step 4: PR作成（Codex 完了後に Claude が実施）
```bash
gh pr create \
  --base main \
  --head codex/<branch-name> \
  --title "<scope>: <変更内容の要約>" \
  --body "## 変更内容\n- ...\n\n## Validation\n- [ ] npm run build: OK"
```

### Step 5: レビュー＆マージ
```bash
gh pr list --state open        # 一覧確認
gh pr diff <PR番号>             # diff確認
gh pr checkout <PR番号>         # チェックアウト
npm run build                   # ビルド検証
gh pr merge <PR番号> --merge --delete-branch  # マージ
```

### Step 6: コンフリクト解消（発生時）
```bash
gh pr checkout <PR番号>
git rebase main
# コンフリクトを手動解消
git add <resolved-files>
git rebase --continue
npm run build
git push --force-with-lease origin codex/<branch-name>
gh pr merge <PR番号> --merge --delete-branch
```

## Claude 側の並行作業

Codex がバックグラウンドで動いている間、Claude は以下を行える:
- コードレビュー・設計検討
- ドキュメント更新
- ユーザーとの対話・方針決定
- Codex が触らないファイルの編集

**ただし Codex 実行中は、Codex の担当ファイルを Claude が編集してはならない。**

## タスク種別ごとの推奨分割

### ユニット追加（複数シリーズ）
```
Codex A: シリーズXのレンダラー (src/components/renderers/seriesX.ts)
Codex B: シリーズYのレンダラー (src/components/renderers/seriesY.ts)
Claude:  unitCatalog.ts への登録 + renderers/index.ts の更新（両方完了後）
```

### 問題追加（複数カテゴリ）
```
Codex A: 算数の問題追加 (src/data/questionBanks/math.jsonl)
Codex B: 理科の問題追加 (src/data/questionBanks/science.jsonl)
Codex C: 英語の問題追加 (src/data/questionBanks/english.jsonl)
```

### UI改善（複数画面）
```
Codex A: StageSelect.tsx のUI改善
Codex B: PartySelect.tsx のUI改善
（App.tsx に変更が必要なら Claude が最後に統合）
```

### テスト追加
```
Codex A: src/domain/__tests__/ のテスト
Codex B: src/data/__tests__/ のテスト
```

## エラー対応

| エラー | 対処 |
|--------|------|
| `spawn EINVAL` | Windows 環境の問題。`codex exec` のパスを確認 |
| Codex がコミットせず終了 | `git diff` で変更を確認し、Claude が手動コミット＆プッシュしてPR作成 |
| ビルド失敗 | PRをクローズし、TODO に `[todo][codex]` で再追記 |
| PRマージ時に競合 | `gh pr checkout` → `git rebase main` → 解消 → `push --force-with-lease` |

## NG
- 同じファイルを複数 Codex に同時編集させる
- Codex 実行中に Claude が同じファイルを編集する
- プロンプトにファイル制約を書かずに実行する
- Codex に main へ直接コミット・プッシュさせる
- レビューなしでマージする
