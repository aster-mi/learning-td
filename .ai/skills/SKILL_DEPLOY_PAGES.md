# Skill: GitHub Pages デプロイ

## 目的
`main` への反映後、GitHub Actions経由で Pages 公開まで確認する。

## 前提
- ワークフロー: `.github/workflows/deploy.yml`
- トリガー: `main` への push

## 手順
1. Push実行  
  `git push origin main`
2. Actionsの最新runを確認  
  - `gh run list --workflow deploy.yml --limit 3`（認証済みなら）
  - 代替: GitHub APIを `curl` で確認
3. runの状態が `completed/success` になるまで確認
4. 公開URLへ到達確認  
  `https://aster-mi.github.io/learning-td/`

## 失敗時の切り分け
- `build` 失敗: 型エラー・ビルドエラーを先に解消
- `deploy` 失敗: Pages権限やartifact生成を確認
- ローカルだけ失敗（`spawn EPERM`等）: CI結果を優先判断

## 完了条件
- Actions run が `success`
- 公開URLがHTTP 200で応答
