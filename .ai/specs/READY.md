# READY Specs（実装可能）

デザイン完了済み。GMがここを読んでCodexタスクを作成する。

---

## [SPEC-C-01] プレイヤー進捗画面UI

### 概要
ゲーム内にプレイヤーの進捗・成績を閲覧できる「記録」画面を追加する。

### 背景・目的
- CEO方針: C. プレイヤー進捗保存（2026-03-23）
- `src/data/saveData.ts` はすでに包括的な保存機能を実装済み。未実装なのは「その保存データをUIで見せる画面」。

### 優先度
P2

---

### デザイン設計（by デザインAgent）

#### UI/UXの方針

- **表示形式**: Full-screen scene（AchievementList と同パターン）。`position: fixed; inset: 0` のフルスクリーン、ダークグラデーション背景
- **アクセス導線**: StageSelect のヘッダーボタン群（実績ボタンの隣）に「📊 記録」ボタンを追加 → `"progress"` シーンへ遷移
- **タブ構成（3タブ、内部 useState で切り替え）**:
  1. **概要** — totalCorrect / totalWrong / 正答率（%） / maxCombo / login.streak / coins を SummaryCard ライクなカード群で表示
  2. **ステージ** — `normalStages + exStages` 一覧。各行に「ステージ名 ★★★」形式（stageStars 参照）。未クリアは「☆」表示
  3. **カテゴリ** — `SUB_CATEGORIES` 全カテゴリの正答率を横バーで表示（categoryStats に存在しない場合は 0%）

#### 影響コンポーネント
- **新規作成**: `src/components/ProgressScreen.tsx`
  - Props: `{ saveData: SaveData; onClose: () => void }`
  - 内部で `SUB_CATEGORIES`（`src/data/questions.ts`）と `normalStages + exStages`（`src/data/stages.ts`）をインポート
  - `isMobile` フック（`useWindowSize`）でレスポンシブ対応
- **変更**: `src/App.tsx`
  - scene 型に `"progress"` を追加: `"category" | "select" | "party" | "gacha" | "game" | "achievements" | "progress"`
  - `ProgressScreen` レンダリングブロックを追加（`onClose={() => setScene("select")`）
  - `StageSelect` に `onProgress={() => setScene("progress")}` を渡す
- **変更**: `src/scenes/StageSelect.tsx`
  - Props に `onProgress: () => void` を追加
  - 「実績」ボタンの直前または直後に「📊 記録」ボタンを追加（同一スタイルで色は `#34d399` / 緑系）

#### 実装注意点
- `ProgressScreen` の saveData は App.tsx から props で渡す（`loadSave()` を直接呼ばない）
- 正答率計算: `correct / (correct + wrong)` を `%` 表示、両方 0 の場合は `--` を表示
- カテゴリタブ: `SUB_CATEGORIES` 配列を基準にループし、`categoryStats[name]` が undefined の場合は `{ correct: 0, wrong: 0 }` にフォールバック
- ステージタブ: `stageStars[stage.id]` が `undefined` の場合は 0 星扱い（☆☆☆ 表示）

#### 完了条件
- `src/components/ProgressScreen.tsx` が作成されビルドが通る
- StageSelect 画面に「📊 記録」ボタンが表示され、progress シーンに遷移できる
- 3 タブ（概要・ステージ・カテゴリ）が正常に切り替わる
- saveData がデフォルト値（空）の場合も正常表示される
- `npm run build: OK`

#### 設計ステータス: READY ✅
