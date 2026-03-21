# SKILL: リリース前チェック

## 目的
公開前の見落としを減らし、問題品質と運用品質を確保する。

## チェックリスト

### 1. データ整合
```bash
# 問題データのバリデーション
npm run quiz:validate

# 問題数の確認
wc -l src/data/questions.jsonl

# カテゴリ別の問題数
grep -oP '"main":"[^"]*"' src/data/questions.jsonl | sort | uniq -c | sort -rn
```
- [ ] JSONL破損なし
- [ ] 重複IDなし
- [ ] `answer` が `choices` に含まれる
- [ ] カテゴリ・サブカテゴリの表記が `questions.ts` と一致

### 2. 型チェック & ビルド
```bash
# TypeScript型チェック
npx tsc -b

# 本番ビルド
npm run build
```
- [ ] 型エラーなし
- [ ] ビルド成功

### 3. ユニット描画（ユニット変更時のみ）
```bash
# UNIT_RENDERERS にすべてのユニットIDが登録されているか確認
grep -oP '"id":\s*"[^"]*"' src/data/unitCatalog.ts | sort > /tmp/catalog_ids.txt
grep -oP '^\s+\w+:' src/components/renderers/index.ts | sed 's/://;s/^\s*//' | sort > /tmp/renderer_ids.txt
diff /tmp/catalog_ids.txt /tmp/renderer_ids.txt
```
- [ ] 全ユニットに描画関数が登録されている
- [ ] 絵文字フォールバックに落ちるユニットがない

### 4. 品質スポットチェック
- [ ] 新規追加した問題を5〜10個ランダムに読み、自然な日本語か確認
- [ ] 新規追加したユニットのアイコンが名前と一致しているか確認

### 5. 運用記録
- [ ] `.ai/AGENT_HANDOFF.md` にハンドオフを記録
- [ ] 重要判断は `.ai/DECISIONS.md` に記録
- [ ] 未完タスクを `.ai/TODO.md` に反映

## 完了条件
- 上記チェック項目にすべて対応済み
- 失敗項目がある場合、理由と次対応が記録されている
