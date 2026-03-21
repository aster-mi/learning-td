# SKILL: Git運用

## 目的
安全にコミット・Pushし、作業混線や事故を減らす。

## 基本方針
- 1コミット1意図
- 不要ファイルをコミットしない（`tmp_*` 等の生成物は `.gitignore` 済み）
- 既存の他者変更は勝手に戻さない

## コミットメッセージ形式
```
<scope>: <short summary>
```

### スコープ一覧
| scope | 対象 |
|-------|------|
| `quiz` | 問題データの追加・修正 |
| `render` | ユニット描画（renderers） |
| `unit` | ユニットカタログ・パラメータ |
| `feat` | 新機能（UI、ゲームロジック） |
| `fix` | バグ修正 |
| `refactor` | リファクタリング |
| `docs` | ドキュメント・Skills更新 |
| `ci` | GitHub Actions / ワークフロー |
| `chore` | その他（依存更新、設定変更） |

### 例
```
quiz: add 50 trivia questions for science category
render: redesign nature series with unique silhouettes
fix: prevent crash when quiz category is empty
```

## 手順

### 1. 変更確認
```bash
git status --short
git diff --stat
```

### 2. ステージング（対象ファイルのみ）
```bash
# ファイルを個別指定（git add . は使わない）
git add src/data/questions.jsonl
git add src/components/renderers/engineering.ts
```

### 3. コミット
```bash
git commit -m "<scope>: <short summary>"
```

### 4. プッシュ
```bash
git push origin main
```

### 5. デプロイ確認（必要時）
```bash
# GitHub Actionsの最新ステータスを確認
gh run list --workflow deploy.yml --limit 3
```

## 注意点
- `tmp_*` `*.output` などの生成物を含めない（`.gitignore` で除外済み）
- `index.lock` が残ったら原因を確認してから `rm .git/index.lock`
- 破壊的コマンド（`reset --hard`, `push --force`）は原則使わない
- 他エージェントの変更を巻き戻さない（意図がある場合はハンドオフに記録）

## 完了条件
- 意図した変更だけが履歴に入っている
- リモートへのPushが成功している
