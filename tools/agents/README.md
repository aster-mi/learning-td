# Learning TD エージェントスケジューラー

Claude を上流オーケストレーターとして動かし、必要な実装や詳細レビューを Codex に委譲するための実行基盤。
今は安全のため、**定期実行タスクは disabled で登録済み / 未起動** の前提で運用している。

## ファイル構成

```
tools/agents/
├── prompts/                    # 各エージェントのプロンプト
│   ├── scout.md
│   ├── ceo.md
│   ├── planning.md
│   ├── design.md
│   ├── gm.md
│   ├── librarian.md
│   └── maintainer.md
├── logs/                       # 実行ログ（自動生成）
├── run-agent.ps1               # エージェント単体実行スクリプト
├── send-discord-session-report.ps1 # GM完了後のDiscordレポート送信
└── setup-task-scheduler.ps1    # Task Scheduler の dry-run / 登録 / 削除
```

## 現在の前提

- 上流ロール (`scout`, `ceo`, `planning`, `design`, `gm`, `librarian`, `maintainer`) は Claude で回す
- Codex は GM から実装 / focused review 用に起動する
- `setup-task-scheduler.ps1` は **dry-run がデフォルト**
- つまり、何も付けずに実行しても既存タスクは変わらない

## スケジュール定義

登録対象のロール:

| タスク名 | cadence | 役割 | runner |
|---|---|---|---|
| `learning-td-scout` | 6時間ごと | 課題発見 / backlog 補充 | Claude |
| `learning-td-ceo` | 12時間ごと | 優先度整理 / 戦略判断 | Claude |
| `learning-td-planning` | 4時間ごと | 調査 / Ready 化 | Claude |
| `learning-td-design` | 4時間ごと | UI / UX 設計 | Claude |
| `learning-td-gm` | 1時間ごと | Codex 投入 / review / merge | Claude |
| `learning-td-librarian` | 12時間ごと | 学びの doc / skill 反映 | Claude |
| `learning-td-maintainer` | 6時間ごと | runner / scheduler / dashboard 保守 | Claude |

## 事前確認 / dry-run

PowerShell で:

```powershell
cd D:\game\tower\learning-td
.\tools\agents\setup-task-scheduler.ps1
```

この実行ではタスク定義だけ表示し、Task Scheduler には何も作らない。

## 後で登録するとき

**管理者権限** の PowerShell で:

```powershell
cd D:\game\tower\learning-td
.\tools\agents\setup-task-scheduler.ps1 -Register
```

- 上記は Claude 用タスクを **再登録し、disabled のまま** にする
- 実際に起動を始めるときだけ `-Enable` を付ける

```powershell
.\tools\agents\setup-task-scheduler.ps1 -Register -Enable
```

## 手動実行

```powershell
# Claude で GM を今すぐ実行
.\tools\agents\run-agent.ps1 -Agent gm

# Claude で CEO を今すぐ実行
.\tools\agents\run-agent.ps1 -Agent ceo

# Codex で maintainer を手動実行したい場合
.\tools\agents\run-agent.ps1 -Agent maintainer -Runner codex
```

## 登録済みタスク確認

```powershell
Get-ScheduledTask | Where-Object { $_.TaskName -like "learning-td-*" }
```

## タスク削除

```powershell
.\tools\agents\setup-task-scheduler.ps1 -Remove
```

## 注意事項

- `claude` コマンドが PATH に通っている必要があります
- `-Runner codex` を使う場合は `codex` コマンドも PATH に必要です
- GM の Discord Session Report には `DISCORD_BOT_TOKEN` が必要です
- レポート先スレッドを変える場合だけ `DISCORD_SESSION_REPORT_THREAD_ID` を設定します
- ログは `tools/agents/logs/` に保存されます
- 各エージェントのプロンプトは `tools/agents/prompts/*.md` で変更できます
- Claude を上流、Codex を実装 / focused review に固定したい場合は `.ai/README.md` と `.ai/doc/operating-model.md` も合わせて確認してください
