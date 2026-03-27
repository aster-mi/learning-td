# AI Help Router

通常は `.ai/agents/<role>.md` に書かれた primary skill だけ読めばよい。
このファイルは、どの skill を使うか分からないときだけ読む。

## 今の前提

- 当面の上流実行主体は Claude
- Claude は `scout`, `ceo`, `planning`, `design`, `gm`, `librarian`, `maintainer` を担当する
- Codex は実装 / focused review / 緊急修正の担当
- 自動実行は準備済みだが、human が有効化するまで scheduler は動かさない

## 最短導線

1. role file を読む
2. role file の primary skill を 1 つ読む
3. 合わないときだけこの file を読む
4. 該当する skill を 1 つだけ読む
5. それでも足りないときだけ必要な `doc/` または `domain/` を 1 つ読む

## 目的から探す

| したいこと | 最初に読む |
|---|---|
| 問題点を見つけたい / 改善候補を棚卸ししたい | `.ai/skills/SKILL_DISCOVERY_TRIAGE.md` |
| 調査して `Backlog` を `Ready` に上げたい | `.ai/skills/SKILL_DISCOVERY_TRIAGE.md` |
| 市場調査をして改善案や推進案を起こしたい | `.ai/skills/SKILL_MARKET_RESEARCH_PLANNING.md` |
| 競合比較から企画候補を増やしたい | `.ai/skills/SKILL_MARKET_RESEARCH_PLANNING.md` |
| task state / owner / review 状態を動かしたい | `.ai/skills/SKILL_GITHUB_TASK_WORKFLOW.md` |
| PR review / merge / Issue / Discussion / Project sync を自動化したい | `.ai/skills/SKILL_GITHUB_PR_AUTOMATION.md` |
| runner / scheduler / dashboard / logs を保守したい | `.ai/skills/SKILL_AUTOMATION_MAINTENANCE.md` |
| human 判断が必要 / GM と human で往復したい | `.ai/skills/SKILL_GITHUB_DISCUSSIONS_WORKFLOW.md` |
| Issue の定義やログの書き方を揃えたい | `.ai/skills/SKILL_ISSUE_WORKFLOW.md` |
| 実装用に追加の Codex を起動したい | `.ai/skills/SKILL_CODEX_ORCHESTRATION.md` |
| question を追加したい | `.ai/skills/SKILL_QUESTION_ADD.md` |
| question を検証したい | `.ai/skills/SKILL_QUESTION_QC.md` |
| unit を追加したい | `.ai/skills/SKILL_UNIT_ADD.md` |
| unit の数値や強さを見直したい | `.ai/skills/SKILL_UNIT_BALANCE.md` |
| release 前確認をしたい | `.ai/skills/SKILL_RELEASE_CHECK.md` |
| GitHub Pages を deploy したい | `.ai/skills/SKILL_DEPLOY_PAGES.md` |
| 学びを永続ルールに反映したい | `.ai/skills/SKILL_KNOWLEDGE_UPDATE.md` |
| git の切り方や commit / push を確認したい | `.ai/skills/SKILL_GIT_WORKFLOW.md` |

## 困りごとから探す

| 困りごと | まず見るもの |
|---|---|
| どこに書けばいいか分からない | `.ai/doc/source-of-truth.md` |
| どの agent が何をするか分からない | `.ai/doc/operating-model.md` |
| human に聞くべきか迷う | `.ai/skills/SKILL_GITHUB_DISCUSSIONS_WORKFLOW.md` |
| 設計意図が分からない | `.ai/domain/decisions.md` |
| コードの前提を知りたい | `.ai/domain/architecture.md` |
| 運用ルールが曖昧 | `.ai/doc/communication.md` と `.ai/doc/conventions.md` |

## 読まないもの

- `.ai/skills/` 全件
- repo 内に新しく作った task log や state file
- 役割と関係のない agent file

## 迷っても決めきれないとき

1. `.ai/skills/SKILL_GITHUB_TASK_WORKFLOW.md`
2. `.ai/skills/SKILL_DISCOVERY_TRIAGE.md`
3. `.ai/skills/SKILL_MARKET_RESEARCH_PLANNING.md`
4. `.ai/skills/SKILL_AUTOMATION_MAINTENANCE.md`
4. `.ai/doc/source-of-truth.md`
5. 自分の role file

この順で戻る。
