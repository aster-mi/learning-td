# SKILL: GitHub Pages デプロイ

## 目的
`main` への反映後、GitHub Actions経由で Pages 公開まで確認する。

## 前提
- ワークフロー: `.github/workflows/deploy.yml`
- トリガー: `main` への push（自動）、または手動 `workflow_dispatch`
- CIパイプライン: `npm ci` → `npm run quiz:validate` → `npm run build` → deploy
- 公開URL: `https://aster-mi.github.io/learning-td/`

## 手順

### 1. ローカルビルド確認（プッシュ前に必ず）
```bash
npm run quiz:validate
npm run build
```
ビルドエラーがあるとCIも失敗するので、先にローカルで通すこと。

### 2. プッシュ
```bash
git push origin main
```

### 3. Actionsの確認
```bash
# 最新のデプロイrunを表示
gh run list --workflow deploy.yml --limit 3

# 特定runの詳細（run IDを指定）
gh run view <run-id>

# 失敗時のログ表示
gh run view <run-id> --log-failed
```

### 4. 公開URLの確認
```bash
curl -s -o /dev/null -w "%{http_code}" https://aster-mi.github.io/learning-td/
# 200が返ればOK
```

## 失敗時の切り分け

| 症状 | 原因 | 対処 |
|------|------|------|
| build失敗 | TypeScriptの型エラー | `npx tsc -b` でエラーを確認・修正 |
| quiz:validate失敗 | 問題データの不整合 | `npm run quiz:validate` で詳細確認 |
| deploy失敗 | Pages権限やartifact | GitHub Settings > Pages を確認 |
| ローカルだけ失敗 | Windows固有の問題 | CI結果を優先判断 |

## 完了条件
- Actions run が `success`
- 公開URLが HTTP 200 で応答
