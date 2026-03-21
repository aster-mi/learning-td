# Issue Seed 2026-03-21

`gh auth status` の結果、この端末では GitHub 未ログインのため Issue の直接作成は未実施。  
以下は、そのまま GitHub Issue に転記できるよう整理した候補。

---

## 1. [P1][ux] レスポンシブ判定が複数箇所で分散しており、画面幅変更に追従しない

- Labels: `ux`, `bug`, `P1`
- 概要:
  - `App.tsx` で `window.innerWidth < 768` を直接参照して `GachaModal` の `isMobile` を決めている
  - 一方で全体は `useWindowSize` にも依存しており、レスポンシブ判定の基準が分散している
- 背景:
  - 画面回転やリサイズ後に `GachaModal` の表示だけモバイル/PC判定がずれる可能性がある
  - `window` 直接参照のため、将来の SSR / テスト環境対応もしづらい
- 期待する状態:
  - レスポンシブ判定を 1 箇所に寄せる
  - `App` 直下の `window.innerWidth` 直接参照をやめる
- 参考箇所:
  - `src/App.tsx:226`
  - `src/hooks/useWindowSize.ts:4-10`

---

## 2. [P2][performance] 問題データ込みの初期バンドルが大きすぎるので分割したい

- Labels: `performance`, `feature`, `P2`
- 概要:
  - `npm run build` 時点で `dist/assets/index-*.js` が約 1.3MB と大きい
  - ビルド警告でも chunk size warning が出ている
- 背景:
  - 初回表示の重さやモバイル回線での体験悪化につながる
  - `questions.jsonl` を `?raw` で丸ごと取り込んでいるため、初期読込が肥大化しやすい
- 期待する状態:
  - ルート単位やデータ単位で code splitting する
  - 問題データのロード戦略を見直す
- 参考箇所:
  - build output: `dist/assets/index-*.js` 約 1,316 kB
  - `src/data/questions.ts:85-90`

---

## 3. [P2][data] 学習履歴と進捗データが無制限に増えるので localStorage 肥大化対策が必要

- Labels: `data`, `feature`, `P2`
- 概要:
  - `dailyActivity`, `categoryStats`, `unitMastery`, `correctStore`, `wrongStore` などが蓄積型で、古いデータの整理方針がない
- 背景:
  - 長期運用時に localStorage サイズが増え続ける
  - 特に学習継続を想定したアプリなので、古い日次データを無期限保持する設計は相性が悪い
- 期待する状態:
  - `dailyActivity` は直近 N 日分だけ保持する
  - `correctStore` / `wrongStore` も必要な履歴期間や件数上限を決める
  - 保存データの簡易クリーンアップを導入する
- 参考箇所:
  - `src/data/saveData.ts:44-47`
  - `src/scenes/GameScene.tsx:121-133`
  - `src/scenes/GameScene.tsx:167-179`
  - `src/data/correctStore.ts`
  - `src/data/wrongStore.ts`

---

## 4. [P3][quiz] 選択肢シャッフルが `sort(() => Math.random() - 0.5)` なので偏りがある

- Labels: `quiz`, `tech-debt`, `P3`
- 概要:
  - 選択肢の並び替えに `Array.sort(() => Math.random() - 0.5)` を使っている
- 背景:
  - 公平なシャッフルにならず、順序の偏りが出る
  - 問題体験に致命的ではないが、クイズアプリとしては改善余地がある
- 期待する状態:
  - Fisher-Yates shuffle に置き換える
  - 必要なら共通 shuffle utility を用意する
- 参考箇所:
  - `src/components/QuizPanel.tsx:37`
  - `src/components/QuizPanel.tsx:65`

---

## 5. [P2][docs/data] ソース内の文字化けコメント・文言を段階的に解消したい

- Labels: `docs`, `data`, `P2`
- 概要:
  - コメントや一部文字列に mojibake が残っているファイルがある
- 背景:
  - 開発者が読みにくく、保守効率を落とす
  - 一部は将来的に UI 文言へ混入するリスクがある
- 期待する状態:
  - コメントと文言の文字コード崩れを段階的に修正する
  - まずユーザー表示に近い箇所を優先する
- 参考箇所:
  - `src/scenes/GameScene.tsx`
  - `src/data/questions.ts`
  - `src/data/unitCatalog.ts`
  - `.codex/CODEX.md`
  - `.claude/CLAUDE.md`

---

## 6. [P2][retention] ミッション報酬の調整と達成テンポの検証が必要

- Labels: `retention`, `balance`, `P2`
- 概要:
  - デイリー/ウィークリーミッションは追加済みだが、報酬量と難度のバランス検証が未実施
- 背景:
  - 報酬が多すぎるとガチャ・育成の価値が薄れる
  - 少なすぎると継続動機として弱い
- 期待する状態:
  - 1日/1週間あたりの想定獲得コイン量を整理する
  - ガチャコスト、育成コスト、ミッション報酬の相場を揃える
- 参考箇所:
  - `src/data/progression.ts:68-139`
  - `src/scenes/StageSelect.tsx`
  - `src/scenes/PartySelect.tsx`
