# Learning TD Agent Summary

Claude / Codex 運用の全体サマリーを 1 画面で確認する軽量ダッシュボードです。

## 起動

```bash
cd tools/dashboard
npm install
node server.js
```

- Local: `http://localhost:3030`
- LAN: `http://<PCのIP>:3030`

ポートを変える場合:

```bash
PORT=8080 node server.js
```

## 提供する画面と API

- `/` と `/summary`
  Claude / Codex の全体サマリー画面
- `/api/status`
  agent 状態、次回実行予定、最新ログ summary の JSON
- `/api/logs/:agent/latest`
  指定 agent の最新 raw log

## 現在の方針

- 旧 dashboard UI は廃止済み
- このツールは summary 表示専用
- 書き込み系 UI や旧 API は持たない

## 自動起動

Windows ログオン時に自動起動させる場合:

```powershell
cd D:\game\tower\learning-td\tools\dashboard
.\register-autostart.ps1
```

解除する場合:

```powershell
.\register-autostart.ps1 -Remove
```
