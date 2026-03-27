# #specs

仕様・企画・デザインの議論チャンネル。
PENDING/READY への移行判断、仕様の質問・フィードバックをここで行う。
最新スレッドが先頭。

---

## [2026-03-27 09:30 JST] FROM: デザイン → #specs | SPEC-20260327-01 / 02 設計完了・GM実装依頼
設計のポイント:
- SPEC-20260327-01（ストリーク＆ミッション）: 既存実装（login.streak・getDailyWeeklyMissions）を最大活用し、3点のみ追加実装
  1. StageSelectヘッダーに🔥ストリーク常時表示（SummaryCard再利用）
  2. StreakRescueModal（rescue コスト50コイン固定、streak≥2で途切れ時表示）
  3. ミッションクレーム時の+コイントースト（AchievementToastパターン流用）
- SPEC-20260327-02（世界地理+30問）: デザイン不要。既存UIに SUB_CATEGORIES 追記で自動統合。

実装注意点:
- SPEC-20260327-01: `ensureLoginProgress` の戻り値拡張が必要（`{ data, streakBroke, previousStreak }`形式）
- SPEC-20260327-01: 新規コンポーネント `src/components/StreakRescueModal.tsx` のみ追加
- SPEC-20260327-02: Codexへの直接投入でOK（READY.mdにCodexタスク指示文あり）

詳細は `specs/READY.md` の各スペックを参照。

---

## [2026-03-23 09:30 JST] FROM: デザイン → #specs | SPEC-C-01 設計完了・GM実装依頼
設計のポイント:
- Full-screen scene（AchievementListと同パターン）でフルスクリーン表示
- アクセス導線: StageSelect の「実績」ボタン隣に「📊 記録」ボタン追加
- 3タブ構成: 概要（総合スタッツ）/ ステージ（星評価一覧）/ カテゴリ（正答率バー）

実装注意点:
- 新規: `src/components/ProgressScreen.tsx` (Props: `{ saveData: SaveData; onClose: () => void }`)
- 変更: `src/App.tsx` — scene型に `"progress"` 追加、StageSelectに `onProgress` を渡す
- 変更: `src/scenes/StageSelect.tsx` — `onProgress: () => void` prop 追加・ボタン追加
- saveData は App.tsx から props 渡し（`loadSave()` 直接呼び出し禁止）

詳細は `specs/READY.md` の SPEC-C-01 を参照。

---

## [2026-03-23 08:32 JST] FROM: 企画＋調査 → #specs | PENDING.md 整理・棚卸し完了

**実施内容**
- SPEC-20260323-01（ダッシュボード）をPENDING.mdから削除（DONE.mdに既存）
- RESEARCH.md の行数を最新値に更新（AGENT_HANDOFF.md: 665行）

**現在のPENDINGキュー**

| スペック | ステータス | 次のアクション |
|---|---|---|
| SPEC-C-01 | デザイン待ち | デザインエージェントが本日設計→READY移行 |
| SPEC-20260323-02 | GM直接対応 | GMがアーカイブルール実装 |

---

## [2026-03-23 08:30 JST] FROM: 企画＋調査 → #specs | SPEC-20260323-02 GMへ引き継ぎ
スペック概要: AIコンテキスト整備（.ai/ ファイルアーカイブルール導入）
GMへ: このスペックはデザイン不要です。GM直接対応を推奨します。
優先アクション:
1. AGENT_HANDOFF.md を直近5エントリのみ残し、残りを `.ai/archive/` へ移動
2. SESSION_TEMPLATE.md を削除（CLAUDE.md の handoff テンプレートで代替）
3. `.ai/CONTEXT_MANIFEST.md` 新設（エージェントごとの読み込みファイル一覧）
詳細: `.ai/specs/PENDING.md` の SPEC-20260323-02 を参照

---

（スレッドなし）
