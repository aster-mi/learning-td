# SKILL: 問題品質レビュー

## 目的
問題文・選択肢の品質をレビューし、学習体験を下げる要素を除去する。

## 対象ファイル
- `src/data/questions.jsonl`
- `.ai/question_validation_baseline.json` — テキスト品質のベースライン

## レビュー観点

### 致命的（必ず修正）
- `answer` が `choices` に含まれていない
- JSON構文が壊れている
- 文字化け（`繧` `縺` 等のmojibakeパターン）
- 問題文が意味をなさない

### 重大（修正推奨）
- 選択肢に解説が混在（`漫画（まんが→万が→ばかになる）` のようなパターン）
- 正答だけが明らかに長い・具体的
- 正答だけに括弧付き補足がある
- 同語の不自然な繰り返し（`関係ある関係ある` 等）
- なぞなぞなのに言葉遊びが成立していない

### 軽微（余裕があれば修正）
- 表記ゆれ（ひらがな/カタカナの不統一）
- 語感の改善余地

## 手順

### 1. 対象カテゴリを抽出
```bash
# 特定カテゴリだけ抽出
grep '"main":"なぞなぞ"' src/data/questions.jsonl > /tmp/target_review.jsonl
wc -l /tmp/target_review.jsonl
```

### 2. 自動チェック
```bash
# 基本バリデーション
npm run quiz:validate

# 厳密テキストチェック（誘導・mojibake検知）
node scripts/validate-questions.mjs --strict-text
```

### 3. 目視レビュー
- 問題文を順に読み、不自然なものをリストアップ
- 選択肢を見て、正答が一目でわかるものをマーク
- 修正 or 削除の判断を記録

### 4. 修正を適用
- `questions.jsonl` 内の該当行を直接編集
- 削除する場合はIDごと行を削除
- 新規に差し替える場合は同じIDで上書き

### 5. 再バリデーション
```bash
npm run quiz:validate
npm run build
```

## レビュー結果の記録形式
ハンドオフに以下を含める:
- レビュー対象カテゴリと件数
- 致命/重大/軽微の件数
- 修正・削除した問題数
- 残存課題があればリスト

## 完了条件
- 致命的問題が0件
- 重大の指摘に対応済み
- `npm run quiz:validate` パス
