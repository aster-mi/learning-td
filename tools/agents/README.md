# Learning TD エージェントスケジューラー

Claude Code セッションを跨いで自律エージェントを動かす仕組み。

## ファイル構成

```
tools/agents/
├── prompts/          # 各エージェントのプロンプト
│   ├── ceo.md
│   ├── planning.md
│   ├── design.md
│   └── gm.md
├── logs/             # 実行ログ（自動生成）
├── run-agent.ps1     # エージェント単体実行スクリプト
└── setup-task-scheduler.ps1  # Task Scheduler 登録スクリプト
```

## セットアップ

**管理者権限** の PowerShell で実行:

```powershell
cd D:\game\tower\learning-td
.\tools\agents\setup-task-scheduler.ps1
```

登録されるタスク:

| タスク名 | 実行時刻 | 役割 |
|---|---|---|
| learning-td-ceo | 毎日 07:00 | 戦略方針の決定 |
| learning-td-planning | 毎日 08:30 | 企画・仕様化 |
| learning-td-design | 毎日 09:30 | UI/UX設計 |
| learning-td-gm | 5時間ごと | Codex投入・マージ |

## 手動実行

```powershell
# GMを今すぐ実行
.\tools\agents\run-agent.ps1 -Agent gm

# CEOを今すぐ実行
.\tools\agents\run-agent.ps1 -Agent ceo
```

## 登録済みタスク確認

```powershell
Get-ScheduledTask | Where-Object { $_.TaskName -like "learning-td-*" }
```

## タスク削除

```powershell
Get-ScheduledTask | Where-Object { $_.TaskName -like "learning-td-*" } | Unregister-ScheduledTask -Confirm:$false
```

## 注意事項

- `claude` コマンドが PATH に通っている必要があります
- ログは `tools/agents/logs/` に保存されます
- 各エージェントのプロンプトは `tools/agents/prompts/*.md` で変更できます
