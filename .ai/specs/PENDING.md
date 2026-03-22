# PENDING Specs（設計待ち）

企画が書き、デザインが設計を追加して READY.md へ移す。

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
