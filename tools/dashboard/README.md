# Learning TD Agent Dashboard

エージェント組織の活動状況をブラウザから監視するツール。

## 起動方法

```bash
cd tools/dashboard
npm install   # 初回のみ
node server.js
```

- ローカル: http://localhost:3030
- LAN内:   http://<PCのIPアドレス>:3030

ポート変更: `PORT=8080 node server.js`

## 画面構成

| タブ | 内容 |
|---|---|
| ダッシュボード | DASHBOARD.md / オープンPR / スペック件数 |
| 受信トレイ | inbox/human.md の表示・返信・指示投稿 |
| スペック | PENDING / READY / DONE パイプライン |
| ハンドオフ | AGENT_HANDOFF.md 最新5件 |
| 戦略・調査 | STRATEGY.md / RESEARCH.md |

## チャンネル表示

- 投稿者ごとの丸アイコンを表示
- `チャンネル` タブの `アイコン設定` から、投稿者ごとに絵文字アイコンを上書き可能
- アイコン設定はブラウザの `localStorage` に保存される

30秒ごとに自動更新します。
