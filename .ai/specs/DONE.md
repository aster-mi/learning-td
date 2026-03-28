# DONE Specs（実装完了）

GMがPRマージ後にREADY.mdからここへ移す。

---

## [SPEC-20260328-07] 国語「文法・語彙」サブカテゴリ新設（+35問）

実装完了: 2026-03-28
担当: Claude GM（直接実装）
変更ファイル: questionMeta.ts（サブカテゴリ追加）, language.jsonl（k299〜k333 追加）

---

## [SPEC-20260328-06] 算数「比・割合・速さ」サブカテゴリ新設（+40問）

実装完了: 2026-03-28
担当: Claude GM（直接実装）
変更ファイル: questionMeta.ts（サブカテゴリ追加）, math.jsonl（m482〜m521 追加）

---

## [SPEC-20260328-05] 社会「現代社会・公民」サブカテゴリ新設（+30問）

実装完了: 2026-03-28
担当: Claude GM（直接実装）
変更ファイル: questionMeta.ts（サブカテゴリ追加）, social.jsonl（sc001〜sc030 追加）

---

## [SPEC-20260328-04] 英語「TOEIC頻出語」拡充（+50問）

実装完了: 2026-03-28
担当: Claude GM（直接実装）
変更ファイル: english.jsonl（e281〜e330 追加、30問→80問）

---

## [SPEC-20260328-03] 理科「実験・観察」サブカテゴリ新設（+30問）

実装完了: 2026-03-28
担当: Claude GM（直接実装・Codex 2回失敗のためフォールバック）
PR: #39（マージ済み）
変更ファイル: questionMeta.ts（サブカテゴリ追加）, science.jsonl（sci-exp-001〜030 追加）

---

## [SPEC-20260328-02] リザルト画面ストリーク・当日進捗バナー

実装完了: 2026-03-28
担当: Claude GM（直接実装・GMデザイン決定）
変更ファイル: ResultScreen.tsx（props追加・バナー追加）, GameScene.tsx（streak/todayCorrect受け渡し）

---

## [SPEC-20260328-01] #33 節目バッジ・称号システム

実装完了: 2026-03-28
担当: Claude GM（直接実装）
PR: #37（マージ済み）
変更ファイル: progression.ts, saveData.ts, MilestoneBadgeModal.tsx(新設), ProgressScreen.tsx, App.tsx

---

## [SPEC-C-01] プレイヤー進捗画面UI

実装完了: 2026-03-23
担当: デザイン（設計）+ Claude GM（実装）
変更: `src/components/ProgressScreen.tsx`（新規）, `src/App.tsx`, `src/scenes/StageSelect.tsx`
ビルド: OK

---

## [SPEC-20260323-02] AIコンテキスト整備

実装完了: 2026-03-23
担当: Claude GM（直接実施）
変更: `.ai/SESSION_TEMPLATE.md`（削除）, `.ai/CONTEXT_MANIFEST.md`（新設）, `.ai/archive/`（新設）, `.ai/AGENT_HANDOFF.md`（ローリング済み）
ビルド: 該当なし

---

## [SPEC-B-01] 情報・ITリテラシー問題追加

実装完了: 2026-03-23
担当: Codex（branch: codex/spec-b-01）
変更: `src/data/questionBanks/programming.jsonl`（+30問）, `src/data/questionMeta.ts`（+1サブカテゴリ）
ビルド: OK

---

## [SPEC-20260323-01] LAN内エージェント監視ダッシュボード

実装完了: 2026-03-23
担当: Claude（直接実装）
場所: `tools/dashboard/`
起動: `cd tools/dashboard && npm install && node server.js`
