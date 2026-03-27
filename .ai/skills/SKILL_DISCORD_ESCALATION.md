# SKILL_DISCORD_ESCALATION / SKILL_DISCORD_SESSION_REPORT

GMがユーザーにDiscordでエスカレーションし、返信を確認して進めるためのスキル。

## フォーラムチャンネルID
`1486975166742528070`

---

## セッション開始時（最優先チェック）

`.ai/escalation_pending.md` が存在する場合、以下を実行する:

1. Pythonでスレッドの返信を取得:
```bash
python -c "import os,urllib.request,json; token=os.environ['DISCORD_BOT_TOKEN']; r=urllib.request.Request('https://discord.com/api/v10/channels/<thread_id>/messages?limit=10',headers={'Authorization':f'Bot {token}','User-Agent':'DiscordBot'}); print(json.loads(urllib.request.urlopen(r).read()))"
```
2. **ユーザーの返信あり** → 内容に従って処理し `status: resolved` に更新
3. **返信なし・24時間以上経過** → ベストジャッジで進み `status: timeout` に更新、`#general` に判断内容を投稿
4. **返信なし・24時間未満** → 今回はスキップ（他タスクも進めない）

---

## エスカレーション発生時

### 基準（以下のいずれか）
- 人間の意図・判断が必要な方針変更
- 重大なリスク・破壊的変更の発見
- パイプライン枯渇（READY.md が空でタスクなし）
- Codex が繰り返し失敗して自律解決できない問題

### 手順

**1. `.ai/channels/escalation.md` に通常通りスレッドを書く**

**2. Discordフォーラムにスレッドを作成（文脈ごとに1スレッド）**

```bash
python -c "import os,urllib.request,json; token=os.environ['DISCORD_BOT_TOKEN']; d=json.dumps({'name':'<件名>','message':{'content':'<本文>'}}).encode(); r=urllib.request.Request('https://discord.com/api/v10/channels/1486975166742528070/threads',d,{'Authorization':f'Bot {token}','Content-Type':'application/json','User-Agent':'DiscordBot'},'POST'); print(json.loads(urllib.request.urlopen(r).read())['id'])"
```

**3. `.ai/escalation_pending.md` に記録**

```
timestamp: YYYY-MM-DD HH:mm JST
subject: <件名>
thread_id: <出力されたスレッドID>
status: waiting
```

---

## メッセージフォーマット

```
name（スレッド名）: 件名を簡潔に（例: "認証方式変更の判断"）

content（本文）:
🚨 エスカレーション | learning-td GM

<詳細内容>

返信がない場合、24時間後にベストジャッジで進めます。
```

---

## 注意事項
- 同じ文脈のエスカレーションは同じスレッドに追記する（新スレッド不要）
- 返信を受け取ったら必ずそのスレッドに対応完了を返信する
- 自分でベストジャッジできる場合はエスカレーションしない

---

## セッションサマリー（毎回必須）

**レポートスレッドID**: `1487013724807106700`（常設・毎回同じスレッドに投稿）

### タイミング
通常は `tools/agents/run-agent.ps1` がセッション終了後に自動投稿する。

前提:
- `DISCORD_BOT_TOKEN` が `.claude/.env.local` か環境変数で入っていること
- GM が `AGENT_HANDOFF.md` の最新エントリに `Summary` / `Validation` / `Next Step` を書き終えていること

### 自動投稿の挙動
- `run-agent.ps1` は GM 成功終了後に `tools/agents/send-discord-session-report.ps1` を呼ぶ
- 最新の `.ai/AGENT_HANDOFF.md` 先頭エントリから 3 セクションを要約して同じスレッドへ投稿する
- token 未設定時は runner ログに `Discord session report skipped: DISCORD_BOT_TOKEN is not set.` を残してスキップする

### フォーマット
```
[YYYY-MM-DD HH:mm JST] GM セッション完了

完了タスク:
- （タスク1）
- （タスク2）

次のステップ:
- （次回やること）
```

### 手動フォールバック
runner を使わず GM を直接実行した場合のみ手動投稿する。
```bash
python -c "import os,urllib.request,json; token=os.environ['DISCORD_BOT_TOKEN']; body=json.dumps({'content':'[YYYY-MM-DD HH:mm JST] GM Session Report\\nSummary:\\n- ...'}).encode(); r=urllib.request.Request('https://discord.com/api/v10/channels/1487013724807106700/messages',body,{'Authorization':f'Bot {token}','Content-Type':'application/json','User-Agent':'DiscordBot'},'POST'); print(json.loads(urllib.request.urlopen(r).read())['id'])"
```
