# Codex Collaboration Notes

This repository is maintained by both Codex and Codex.
Follow these shared collaboration rules to keep sessions consistent.

---

## セッション開始時
作業前に次のファイルを確認すること。

```bash
head -80 .ai/AGENT_HANDOFF.md
cat .ai/TODO.md
cat .ai/DECISIONS.md
git status --short
```

## セッション終了時
- 作業内容は `.ai/AGENT_HANDOFF.md` の先頭に追記する。
- 恒久的な判断は `.ai/DECISIONS.md` に残す。
- 完了した項目は `.ai/TODO.md` を更新する。
- 改修した内容は、区切りごとに commit して push まで行う。
- 他者の未コミット変更がある場合は巻き戻さず、必要な範囲だけ別 commit / push に分ける。

### handoff テンプレート
```md
## [YYYY-MM-DD HH:mm JST] Agent: Codex
Summary:
- 今回の要点
Changed Files:
- 変更したファイル
Validation:
- npm run build: OK / NG
- npm run quiz:validate: OK / NG
Open Questions:
- 未解決事項
Next Step:
- 次にやること
```

## ナレッジ更新
失敗や手戻り、追加した品質観点は `.ai/skills/SKILL_KNOWLEDGE_UPDATE.md` を確認した上で Skills に反映する。
特に次の場合は更新を検討する。

- 新しい品質チェック観点が見つかった
- 追加運用ルールが必要になった
- 同じ失敗を繰り返しそうな兆候がある

## Shared Files
| ファイル | 用途 |
|---------|------|
| `.codex/CODEX.md` | Codex 用の運用ルール |
| `.ai/AGENT_HANDOFF.md` | セッション引き継ぎログ |
| `.ai/TODO.md` | 共有タスク |
| `.ai/DECISIONS.md` | 設計判断メモ |
| `.ai/SESSION_TEMPLATE.md` | handoff 用テンプレート |
| `.ai/skills/` | プロジェクト専用 Skills |
| `.ai/UNIT_POLICY.md` | ユニット追加ポリシー |

## Commit Convention
- Format: `<scope>: <short summary>`
- Keep one intent per commit.
- Scopes: `quiz`, `render`, `unit`, `feat`, `fix`, `refactor`, `docs`, `ci`, `chore`, `balance`

## Issue Workflow
- 問題や改善案を見つけたら GitHub Issue に起票して追う。
- ラベルは `bug`, `question-quality`, `feature`, `ux`, `balance`, `content`, `docs`, `data`, `performance`, `retention` を使い分ける。
- 優先度は `P1`, `P2`, `P3` を付ける。
- 引き継ぎや作業報告では Issue 番号を明記する。
- 関連 Skill: `.ai/skills/SKILL_ISSUE_WORKFLOW.md`

## Operating Principles
- Keep updates short and factual.
- If unexpected local changes are detected, pause and ask the user.
- Do not delete or overwrite another agent's notes without reason.
- `tmp_*` の一時ファイルはコミットしない。

## Agent Organization

### スケジュール一覧

| タスクID | 起動時刻 | 役割 |
|---|---|---|
| `learning-td-scout` | 6時間ごと | Scout：課題発見 / backlog補充 |
| `learning-td-ceo` | 12時間ごと | CEO：戦略方針の決定 |
| `learning-td-planning` | 4時間ごと | 企画＋調査：トレンド調査・仕様化 |
| `learning-td-design` | 4時間ごと | デザイン：UI/UX設計・PENDING→READY移行 |
| `learning-td-gm` | 1時間ごと | GM：Codex投入・レビュー調整・マージ |
| `learning-td-librarian` | 12時間ごと | Librarian：学びの反映 |
| `learning-td-maintainer` | 6時間ごと | Maintainer：runner / scheduler / dashboard 保守 |
| Codex（最大10本） | GMから起動 | 実装 / focused review：ブランチ実装・詳細レビュー |

### 情報フロー

```
CEO → STRATEGY.md → 企画＋調査 → RESEARCH.md
                               → specs/PENDING.md
                                       ↓
                              デザイン → specs/READY.md
                                               ↓
                              Codex GM → Codex（ブランチ実装 / focused review）→ PR作成
                                        → レビュー調整＆マージ
                                → specs/DONE.md へ移行
```

### scheduler の扱い

- `tools/agents/setup-task-scheduler.ps1` が正本
- デフォルトは dry-run で、何も登録しない
- `-Register` で disabled のまま登録
- `-Register -Enable` を実行したときだけ定期実行を開始する
- 現在のローカル環境では Codex 用タスクを disabled で保持し、まだ動かしていない

### 通信ファイル

| ファイル | 書き手 | 読み手 |
|---|---|---|
| `.ai/STRATEGY.md` | CEO | 全員 |
| `.ai/RESEARCH.md` | 企画＋調査 | CEO・企画・デザイン |
| `.ai/specs/PENDING.md` | 企画＋調査 | デザイン |
| `.ai/specs/READY.md` | デザイン | GM |
| `.ai/specs/DONE.md` | GM | CEO（振り返り） |
| `.ai/DECISIONS.md` | CEO・デザイン | 全員 |
| `.ai/AGENT_HANDOFF.md` | 全員 | 全員 |
| `.ai/TODO.md` | 全員 | 全員 |
| `.ai/DASHBOARD.md` | GM | ユーザー・全員 |

### チャンネル（メイン通信）

| チャンネル | ファイル | 用途 |
|---|---|---|
| `#general` | `.ai/channels/general.md` | 全体共有・セッション報告・横断的議論 |
| `#specs` | `.ai/channels/specs.md` | 仕様・企画・デザインの議論 |
| `#dev` | `.ai/channels/dev.md` | 実装・ビルド・PR に関する議論 |
| `#escalation` | `.ai/channels/escalation.md` | **ユーザーへのエスカレーション**（最優先で確認）|

### スレッド形式（全エージェント共通）

**新規スレッド**（チャンネルファイルの `---` の直後・先頭に追記）:

```markdown
## [YYYY-MM-DD HH:mm JST] FROM: エージェント名 → #channel | 件名
本文。複数行OK。

---
```

**返信**（該当スレッドの本文末尾、`---` の前に追記）:

```markdown
  > [FROM: エージェント名 | HH:mm] 返信内容
```

### チャンネル選択ガイド

| 状況 | 投稿先 |
|---|---|
| セッション開始・終了の報告 | `#general` |
| 仕様の質問・フィードバック | `#specs` |
| ビルド失敗・PR差し戻し報告 | `#dev` |
| 人間の判断が必要・ブロッカー | `#escalation` |

### 要望対応後の返信ルール

**ユーザー要望スレッドへの返信（必須）:**
ユーザーの投稿スレッドに対応した場合、必ずそのスレッドに返信する。新規スレッドを立てない。

```markdown
  > [FROM: GM | HH:mm] 対応完了: （内容を1〜3行で）
```

例: ユーザーが `## [12:27] ... | リリースノートページ...` を投稿 → 対応後そのスレッド末尾に返信を追記。

### エスカレーション・返信ルール

**投稿前に自問する:**
> 「自分でベストジャッジできるか？」→ できるなら投稿せず進む

`#escalation` に投稿後、次セッションで確認:
- ユーザーの返信あり → 内容に従って処理、**返信はそのスレッドに追記**（新規スレッド不要）
- 10時間以上返信なし → ベストジャッジで進み、`#general` に判断内容を投稿

**ユーザーからの自発的指示:**
`#escalation` に新スレッドを立てれば次のGMセッションで拾う。
処理後、GMが `#general` に対応報告を投稿する。

### エスカレーション基準（#escalation に投稿するケース）
- 人間の意図・判断が必要な方針変更
- 重大なリスク・破壊的変更の発見
- パイプライン枯渇（READY.md が空でタスクなし）
- Codexが繰り返し失敗しているなど自律解決できない問題

### inbox/（後方互換・緊急DM用）

`.ai/inbox/` は残すが使用は最小限に。
緊急の個別宛メッセージが必要な場合のみ使用し、基本はチャンネルを使う。

## Role Division（Codex vs Codex）

### Codex が担当する領域
- **設計・アーキテクチャ**: コンポーネント設計、データ構造の判断、モジュール分割
- **要件定義・企画**: 新機能の仕様策定、ユーザー体験の設計、優先度付け
- **調査・分析**: コードベース全体の把握、パフォーマンス分析、品質評価
- **マネジメント**: TODO の整理・優先度付け、Codex へのタスク分解・投入
- **レビュー調整 / 統合作業**: Codex 完了後の review queue 処理、共有ファイル更新（`unitCatalog.ts`, `renderers/index.ts` 等）

### Codex が担当する領域
- 細粒度の実装（ファイル単位で独立したもの）
- 問題データ追加、ユニットレンダラー作成、UI コンポーネント改修など
- 必要に応じた focused review、追加修正、緊急の code fix
- 最大 10 並列で競合しない範囲のタスクを同時実行

### Codex が直接実装してよいケース
- Codex 完了後の統合・登録処理（共有ファイルへの追記）
- ビルド失敗時の緊急修正
- Codex では判断が難しい設計上のリファクタリング

### 実装投入方法（Agent Teams 優先）
- `claude_teammate_*` ツールが使える → **Agent Teams**（詳細: `.ai/skills/SKILL_AGENT_TEAMS_ORCHESTRATION.md`）
- ツールが使えない → **Codex フォールバック**（詳細: `.ai/skills/SKILL_CODEX_ORCHESTRATION.md`）
```bash
codex exec -C /d/game/tower/learning-td --full-auto "タスク説明（ファイル制約を必ず含める）"
```

### TODO.md のタグ規約
- `[Codex]`: Codex が担当（設計・企画・統合）
- `[codex]`: Codex が担当（実装タスク）
- タグなし: どちらでも可
