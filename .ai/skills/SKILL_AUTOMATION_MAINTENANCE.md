# SKILL: Automation Maintenance

## 目的
AI チームの仕組み自体を保守する。対象は agent runner、Task Scheduler、dashboard、ログ品質、GitHub 連携の運用フロー。
問題を見つけたら、原則として maintainer 自身が修復し、再発防止と再実行確認まで持つ。

## 何を見るか
- `tools/agents/logs/` の最新ログ
- `learning-td-*` の Task Scheduler 状態
- `tools/agents/run-agent.ps1`
- `tools/agents/setup-task-scheduler.ps1`
- `tools/dashboard/`
- GitHub Issue / PR / Discussion / Project の整合性

## 優先順位
1. 実行不能や継続失敗
2. 文字化けやログ欠損など観測性の欠陥
3. state 同期漏れ
4. 運用 friction の削減
5. 再発防止の document / skill 更新

## 自己修復原則
- まず原因を切り分け、low-risk な修正はその場で行う
- 修正後は影響した agent を再実行し、ログと GitHub 更新で回復を確認する
- Discussion は最後の手段にする
- Discussion を作っただけで safe default に戻せるなら `RUN RESULT: success` にする
- `needs-human` は human が何か操作しない限り継続失敗する hard blocker のときだけ使う

## よくある対処
- child process だけ GitHub 認証に失敗する:
  - host の `gh auth status` と `gh auth token` を確認する
  - runner で `GH_TOKEN` / `GITHUB_TOKEN` が子プロセスへ渡っているか確認する
  - 修正後に該当 agent を再実行し、Issue / Project 更新まで通るか確認する
- scheduler は動くが dashboard 表示が違う:
  - 最新ログ終端の最終 `RUN RESULT` / `RUN SUMMARY` を正とする
  - dashboard 側の分類・キャッシュ・文字コードを確認する
  - 必要なら dashboard を再起動して API 応答まで確認する
- 文字化け:
  - UTF-8 での prompt / log 入出力と `chcp 65001` を確認する
  - PowerShell では `Get-Content -Encoding utf8` と `Console.OutputEncoding` を使う
- Task Scheduler の設定ずれ:
  - hidden 実行、繰り返し間隔、次回実行時刻、前回結果を確認する
  - low-risk なら scheduler を再登録して再検証する

## 手順
1. 最新ログを agent ごとに確認し、`RUN RESULT`、exit code、文字化け、途中終了を確認する
   - PowerShell で UTF-8 の doc / log を読むときは `[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; Get-Content -Encoding utf8 ...` を使う
   - `RUN RESULT` / `RUN SUMMARY` はログ途中に他ログの引用として出ることがある。dashboard との差分確認ではログ終端近傍の最終マーカーを正とする
2. Task Scheduler で `NextRunTime`, `LastRunTime`, `LastTaskResult`, `State` を確認する
3. dashboard と実ログの表示差分を確認する
4. 問題が runner / dashboard / scheduler / docs のどこにあるか切り分ける
5. 低リスクならその場で修正する
6. 修正したら影響 agent を再実行し、回復を確認する
7. human 判断や人手操作が本当に必要なら GitHub Discussions に起票する
8. 再利用価値があるなら skill / doc / agent 入口へ反映する

## 直してよいもの
- UTF-8 / ログ出力 / runner の不具合
- scheduler の hidden 実行や cadence 修正
- dashboard の誤分類や観測性改善
- 既存 host 認証を child process へ正しく伝播させる runner 修正
- skill / doc の stale 手順

## 勝手に決めないもの
- プロダクト優先順位の大変更
- GitHub board 設計の大変更
- 高リスクな権限変更

## 出力
- 修正したら Issue / PR / Discussion に日本語で記録する
- Discussion へ上げるときは、手動で必要な操作を 1 つずつ明記する
- ログの最後に次を残す
  - `RUN RESULT: success|no-op|needs-human|failed`
  - `RUN SUMMARY: <1行要約>`
