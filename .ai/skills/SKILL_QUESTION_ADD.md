# SKILL: 問題追加・編集

## 目的
`src/data/questions.jsonl` の問題を安全に追加・修正する。

## 対象ファイル
- `src/data/questions.jsonl` — 1行1JSON形式の問題データ
- `src/data/questions.ts` — カテゴリ・サブカテゴリの型定義

## 問題データ形式
```json
{"id":"m001","main":"算数","sub":"四則計算","level":1,"question":"2 + 2 = ?","choices":["3","4","5","6"],"answer":"4"}
```

| フィールド | 型 | 説明 |
|-----------|------|------|
| `id` | string | 一意のID。プレフィックス例: m(算数), k(国語), r(理科), s(社会), e(英語), p(プログラミング), tr(雑学), nz(なぞなぞ) |
| `main` | string | メインカテゴリ: 算数, 国語, 理科, 社会, 英語, プログラミング, 雑学, なぞなぞ |
| `sub` | string | サブカテゴリ（`questions.ts` の `SUB_CATEGORIES` と一致させる） |
| `level` | number | 難易度 1〜10 |
| `question` | string | 問題文 |
| `choices` | string[] | 選択肢（4択） |
| `answer` | string | 正答（`choices` のいずれかと完全一致） |

## 手順

### 1. 既存IDの確認
```bash
# 特定カテゴリの最新ID番号を確認
grep -o '"id":"nz[0-9]*"' src/data/questions.jsonl | sort -t'"' -k4 -V | tail -5

# 全カテゴリのID数を確認
grep -oP '"main":"[^"]*"' src/data/questions.jsonl | sort | uniq -c | sort -rn
```

### 2. サブカテゴリの確認
```bash
# questions.ts のサブカテゴリ定義を確認
grep -A2 'name:' src/data/questions.ts
```

### 3. 問題を追加
- JSONL末尾に追記（1行1JSON、末尾改行）
- IDは連番で重複不可
- `choices` は必ず4つ、`answer` は `choices` に含まれること

### 4. バリデーション実行
```bash
npm run quiz:validate
```
このコマンドは以下をチェックする:
- JSON構文の正当性
- `answer` が `choices` に含まれるか
- ID重複
- 文字化け検知
- 選択肢の誘導パターン検知（`→` や括弧内の解説）

### 5. ビルド確認
```bash
npm run build
```

## 品質ルール
- 問題文は短く自然な日本語
- 選択肢で答えを露骨に示さない（正答だけ長い、正答だけ注釈付きはNG）
- 解説文字列を選択肢へ混ぜない（`○○→△△` の乱用禁止）
- 同じ意味の選択肢を並べない
- なぞなぞは言葉遊び・ダジャレが成立していること

## 完了条件
- `npm run quiz:validate` がパスする
- `npm run build` がエラーなしで通る
- 問題の意図が第三者に伝わる
