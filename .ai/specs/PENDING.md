# PENDING Specs（設計待ち）

企画が書き、デザインが設計を追加して READY.md へ移す。

---

## [SPEC-20260323-02] AIコンテキスト整備（.ai/ ファイル棚卸し・アーカイブルール導入）

### 概要
`.ai/` 配下のMDファイルが無制限に成長しており、エージェントのコンテキスト効率が悪化しつつある。
アーカイブルールと軽量インデックス（CONTEXT_MANIFEST.md）を導入して構造を整理する。

### 背景・目的
- CEO方針: AIコンテキスト整備（2026-03-23）
- AGENT_HANDOFF.md（648行）、channels/general.md（117行）が無制限成長中
- inbox/planning.md に陳腐化した unread メッセージが残存
- SESSION_TEMPLATE.md が CLAUDE.md と内容重複
- 今から整備しないと30日後のコンテキスト肥大化が不可逆になる

### 機能要件

#### 必須（今すぐ）
1. **AGENT_HANDOFF.md ローリングアーカイブ**: 直近5エントリをライブ保持、それ以前は `.ai/archive/HANDOFF_ARCHIVE.md` に移動
2. **SESSION_TEMPLATE.md 削除**: CLAUDE.md の handoff テンプレートを正本とし、SESSION_TEMPLATE.md を削除
3. **CONTEXT_MANIFEST.md 新設**: エージェントごとの「読むべきファイル一覧」を記述した軽量インデックスを `.ai/CONTEXT_MANIFEST.md` として新設

#### 推奨（次フェーズ）
4. **channels アーカイブルール**: 7日以上前のスレッドを `.ai/archive/channels/` に移動するルールを README に追記
5. **lessons/, reviews/, issues/ を `.ai/archive/` へ移動**: 日常セッションで不要な331行をアーカイブ
6. **UNIT_POLICY.md を `.ai/skills/` へ移動**: skills ディレクトリとの一貫性確保

### 非機能要件
- 既存スペック・ゲームコード（`src/`）に一切触れない
- `CLAUDE.md` は変更可（SESSION_TEMPLATE.md の参照削除のみ）
- アーカイブ後も検索可能性を維持（archive/README.md でインデックス）

### 優先度
P2

### 担当
Claude（GM）が直接実施。Codex不要。

### 設計ステータス: PENDING（デザイン不要・GM直接対応可）


