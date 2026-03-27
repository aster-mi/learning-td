# Architecture Domain

## 現在の技術スタック

- React
- TypeScript
- Vite

## アプリの大きな構造

- `src/App.tsx`: 画面遷移の起点
- `src/scenes/`: 画面単位の実装
- `src/components/`: UI コンポーネント
- `src/domain/`: バトルロジック
- `src/data/`: 問題、進捗、保存、統計
- `tools/dashboard/`: AI 運用ダッシュボード

## 問題データ

- 問題本体は `src/data/questionBanks/*.jsonl`
- 型とカテゴリ定義は `src/data/questionMeta.ts`
- ローダーは `src/data/questions.ts`
- バリデーションは `npm run quiz:validate`

## 保存と進捗

- ゲーム進捗は `src/data/saveData.ts` を中心に localStorage へ保存する
- 学習統計や継続データは `src/data/progression.ts` などにある

## AI 運用との関係

- `.ai/` は実装ではなく運用知識の置き場
- task state は GitHub Projects / Issues / PR に寄せる
- `.ai/` には安定知識と agent 入口だけを残す
