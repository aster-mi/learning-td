# 6ユニットのレンダラーレビューで共通の問題パターンが見つかった

## 状況
- 2026-03-21、Codexが6ユニット（notebook, protractor, graphpaper, paintbrush, battery, drone）のレンダラーを実装
- REVIEW-001 でレビューした結果、4つの共通パターンを発見

## 何が問題だったか

### パターン1: `col` 引数を無視して固定色で描画
- notebook, graphpaper が `void col;` で引数を捨てていた
- カタログの `color` 値と描画色が乖離するリスク

### パターン2: 脚がない / `ph` の代わりに `t` を使う
- notebook, graphpaper, paintbrush に脚がなかった
- protractor は脚があるが `Math.sin(t * 3)` でアニメーションしており、`ph` を使っていない
- `t` を使うと全ユニットの脚が同じタイミングで動く

### パターン3: `globalAlpha` の変更を保護していない
- paintbrush が `ctx.globalAlpha` を変更後、`ctx.globalAlpha = 1` で戻しているが `save/restore` で囲んでいない

### パターン4: index.ts の登録位置がシリーズと不一致
- battery, drone が「芸術シリーズ」ブロック内に登録されていた

## 根本原因
- SKILL_UNIT_ADD.md の「描画関数の要件」にこれらの具体的なルールが書かれていなかった
- 「描画パターン」のコード例にはコメントで `// 脚（phでウォーキングアニメ）` と書いてあったが、必須であることが明示されていなかった

## 対策
- SKILL_UNIT_ADD.md に「必須ルール（よくある違反パターン）」セクションを新設
- 受け入れ条件に `col` 使用、`ph` 歩行、`globalAlpha` 保護、登録位置の4項目を追加

## 反映済みファイル
- `.ai/skills/SKILL_UNIT_ADD.md`
