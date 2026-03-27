# Codex Entry

Codex は実装 / focused review の主担当。
通常は Claude GM や human から委譲された code work を進める。

## 最初の分岐

- 直接実装:
  この file のまま進む
- 詳細レビューや緊急修正:
  `.ai/agents/gm.md` と `.ai/domain/architecture.md`
- 例外的に上流 role を代行:
  対応する role file を読む。ただし標準体制ではないので理由を handoff に残す

## 実装時の通常ルート

1. `.ai/doc/source-of-truth.md`
2. `.ai/doc/communication.md`
3. `.ai/doc/conventions.md`
4. `.ai/domain/architecture.md`
5. 対応する skill を 1 つ読む

## Primary Skill

- 市場調査 / 企画起票:
  `.ai/skills/SKILL_MARKET_RESEARCH_PLANNING.md`
- 問題発見 / 調査 / Issue 化:
  `.ai/skills/SKILL_DISCOVERY_TRIAGE.md`
- git / branch / commit / push:
  `.ai/skills/SKILL_GIT_WORKFLOW.md`
- runner / scheduler / dashboard / logs 保守:
  `.ai/skills/SKILL_AUTOMATION_MAINTENANCE.md`
- question 追加:
  `.ai/skills/SKILL_QUESTION_ADD.md`
- question QC:
  `.ai/skills/SKILL_QUESTION_QC.md`
- unit 追加:
  `.ai/skills/SKILL_UNIT_ADD.md`
- unit balance:
  `.ai/skills/SKILL_UNIT_BALANCE.md`
- release 前確認:
  `.ai/skills/SKILL_RELEASE_CHECK.md`
- どの skill を使うか迷う:
  `.ai/help.md`

## 原則

- 仕様と進捗は GitHub Issue / PR を正本にする
- 実装 task ごとの手順は skill を読む
- repo 内 Markdown に task 状態を増やさない
- 実装後の進捗は Issue コメントと PR に残す
- 上流 orchestration は Claude 側に残し、Codex は code work に集中する
