# READY Specs（実装可能）

デザイン完了済み。GMがここを読んでCodexタスクを作成する。

---

<!-- SPEC-20260328-01 は実装・マージ完了（PR #37, 2026-03-28）→ DONE.md へ移行済み -->
<!-- SPEC-20260328-04 は実装完了（2026-03-28 GM直接実装）→ DONE.md へ移行済み -->
<!-- SPEC-20260328-05 は実装完了（2026-03-28 GM直接実装）→ DONE.md へ移行済み -->

<!-- SPEC-20260328-06 は実装完了（2026-03-28 GM直接実装）→ DONE.md へ移行済み -->
<!-- SPEC-20260328-07 は実装完了（2026-03-28 GM直接実装）→ DONE.md へ移行済み -->

---

## SPEC-20260328-06: 算数「比・割合・速さ」サブカテゴリ新設 +40問

**Priority**: P2
**READY移行**: デザイン 2026-03-28

### 設計メモ

データのみ案件。UIコンポーネント変更不要。

**変更ファイル:**

1. `src/data/questionMeta.ts`
   - `SUB_CATEGORIES` 配列に追記（算数グループの末尾）:
   ```ts
   { main: "算数", name: "比・割合・速さ", emoji: "⚖️", color: "#6366f1", desc: "比・百分率・速さ・単位換算" },
   ```

2. `src/data/questionBanks/math.jsonl`
   - ID: m482〜m521（40問）
   - sub: `"比・割合・速さ"`
   - level分布: Level5×8, Level6×8, Level7×10, Level8×8, Level9×6
   - テーマ: 比・百分率・速さ/時間/距離・単位換算・濃度

**受け入れ条件:**
- `npm run quiz:validate` が通ること
- CategorySelect で「比・割合・速さ」サブが選択可能になること

---

## SPEC-20260328-07: 国語「文法・語彙」サブカテゴリ新設 +35問

**Priority**: P2
**READY移行**: デザイン 2026-03-28

### 設計メモ

データのみ案件。UIコンポーネント変更不要。

**変更ファイル:**

1. `src/data/questionMeta.ts`
   - `SUB_CATEGORIES` 配列に追記（国語グループの末尾）:
   ```ts
   { main: "国語", name: "文法・語彙", emoji: "📚", color: "#8b5cf6", desc: "品詞・敬語・類義語・対義語・語彙" },
   ```

2. `src/data/questionBanks/language.jsonl`
   - ID: k299〜k333（35問）
   - sub: `"文法・語彙"`
   - level分布: Level4×6, Level5×6, Level6×7, Level7×7, Level8×5, Level9×4
   - テーマ: 品詞分類・敬語・類義語/対義語・語彙/送り仮名・文の組み立て

**受け入れ条件:**
- `npm run quiz:validate` が通ること
- CategorySelect で「文法・語彙」サブが選択可能になること
