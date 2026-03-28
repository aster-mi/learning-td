# READY Specs（実装可能）

デザイン完了済み。GMがここを読んでCodexタスクを作成する。

---

<!-- SPEC-20260328-01 は実装・マージ完了（PR #37, 2026-03-28）→ DONE.md へ移行済み -->

## [SPEC-20260328-04] 英語「TOEIC頻出語」拡充 +50問

**Priority:** P2
**Labels:** content, question-quality
**提案者:** 企画＋調査（2026-03-28）
**READY化:** デザイン（2026-03-28）— データのみ案件、UI変更不要

### 概要
英語カテゴリのサブカテゴリ「TOEIC頻出語」（questionMeta.ts 定義済み・色 #fb7185）の問題数を
現行30問 → 80問に増強する。

### 追加問題の方針（50問）
- **ビジネス語彙（15問）**: enterprise / negotiate / deadline / agenda / revenue など
- **TOEIC Part5 頻出表現（15問）**: 前置詞・接続詞・品詞問題パターン
- **メール・報告書英語（10問）**: "Please find attached..." / "I look forward to..." など定型表現
- **数量・頻度・比較表現（10問）**: approximately / the majority of / compared to など

### 問題フォーマット
```json
{"id":"eng-toeic-031","main":"英語","sub":"TOEIC頻出語","level":5,"question":"...","choices":["...","...","...","..."],"answer":"..."}
```
- id: `eng-toeic-031` 〜 `eng-toeic-080`
- level: 4〜8（既存30問がlevel3〜6なので上方拡張）

### 変更ファイル
1. `src/data/questionBanks/english.jsonl` — 50問追記（eng-toeic-031〜080）

### デザイン確認
- UIへの変更は不要（既存サブカテゴリが活きる）
- questionMeta.ts 変更不要

---

## [SPEC-20260328-05] 社会「現代社会・公民」サブカテゴリ新設 +30問

**Priority:** P2
**Labels:** content, question-quality
**提案者:** 企画＋調査（2026-03-28）
**READY化:** デザイン（2026-03-28）— データのみ案件、UI変更不要

### 概要
社会カテゴリに「現代社会・公民」サブカテゴリを新設し30問を追加する。

### サブカテゴリ定義（questionMeta.ts 追加）
```ts
{ main: "社会", name: "現代社会・公民", emoji: "🏛️", color: "#84cc16", desc: "憲法・法律・税金・SDGs・環境問題" },
```

### 問題構成（30問）
- **憲法・基本的人権（6問）**: 三権分立・日本国憲法の三原則・基本的人権の種類
- **選挙・政治のしくみ（6問）**: 衆議院・参議院・選挙権・内閣
- **税金・財政（6問）**: 所得税・消費税・国民の義務・社会保障
- **SDGs・環境（6問）**: 17の目標・温暖化・再生可能エネルギー・リサイクル
- **国際社会・条約（6問）**: 国連・安全保障理事会・子どもの権利条約

### 問題フォーマット
```json
{"id":"soc-civic-001","main":"社会","sub":"現代社会・公民","level":4,"question":"...","choices":["...","...","...","..."],"answer":"..."}
```
- id: `soc-civic-001` 〜 `soc-civic-030`
- level: 3〜7（中学生レベルを中心に）

### 変更ファイル
1. `src/data/questionMeta.ts` — SUB_CATEGORIES に 1エントリ追加（社会の最後）
2. `src/data/questionBanks/social.jsonl` — 30問追記（soc-civic-001〜030）

### デザイン確認
- UIへの変更は不要（既存サブカテゴリ表示ロジックが自動対応）
- questionMeta.ts への追記のみ（既存フォーマット踏襲）

---
