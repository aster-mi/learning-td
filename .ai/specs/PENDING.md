# PENDING Specs（設計待ち）

企画が書き、デザインが設計を追加して READY.md へ移す。

---

## [SPEC-C-01] プレイヤー進捗画面UI

### 概要
ゲーム内にプレイヤーの進捗・成績を閲覧できる「記録」画面を追加する。

### 背景・目的
- CEO方針: C. プレイヤー進捗保存（2026-03-23）
- **補足**: `src/data/saveData.ts` はすでに包括的な保存機能を実装済み（stageStars, categoryStats, dailyActivity, totalCorrect/Wrong等）。未実装なのは「その保存データをUIで見せる画面」。

### 設計が必要な事項（デザインエージェントへ）
- 画面のUIレイアウト（どこからアクセスするか、タブ構成など）
- 表示するデータの優先順位（ステージクリア状況 / カテゴリ別正答率 / 連続ログイン日数）
- 既存画面（App.tsx / GameScene.tsx）との統合方法（ルーティングorモーダル）

### 参照すべきファイル
- `src/data/saveData.ts` — SaveData 型・loadSave() 関数
- `src/App.tsx` — 現在の画面遷移構成
- `src/components/` — 既存UIコンポーネント

### 優先度
P2

### 設計ステータス: PENDING（デザイン待ち）

---

## [SPEC-20260323-01] LAN内エージェント監視ダッシュボード ✅ 実装済み → DONE

### 概要
エージェント組織の活動状況をLAN内ブラウザから閲覧できるWebツール。

### 背景・目的
`.ai/` ディレクトリのファイルを直接開かずに、ブラウザで一覧できる管理UIがほしい。

### 機能要件
- DASHBOARD.md の表示（マークダウンレンダリング）
- inbox/human.md の表示（未読バッジ）＋返信フォーム＋指示投稿フォーム
- AGENT_HANDOFF.md の最新エントリ表示
- specs パイプライン状況（PENDING/READY/DONE件数＋タイトル一覧）
- STRATEGY.md 最新エントリ表示
- RESEARCH.md 表示
- 30秒ごとの自動更新
- LAN内アクセス可能（0.0.0.0バインド）

### 非機能要件・制約
- `tools/dashboard/` に独立して配置
- 既存アプリ（src/）に一切触れない
- Node.js + Express のみ（追加フレームワーク不要）
- マークダウンレンダリングはクライアント側CDN（marked.js）

### 影響範囲
- 新規: `tools/dashboard/`
- 変更なし: src/, package.json（ルート）

### 優先度
P1

### 設計ステータス: READY ✅（Claude直接実装）
