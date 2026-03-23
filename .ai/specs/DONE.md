# DONE Specs（実装完了）

GMがPRマージ後にREADY.mdからここへ移す。

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
