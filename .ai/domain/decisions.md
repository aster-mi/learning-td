# Decision Log

永続化したい設計判断だけを残す。task の進捗メモは残さない。

## Format

```md
## [YYYY-MM-DD HH:mm JST] Title
Context:
- Why this decision was needed.

Decision:
- Final decision in one or two lines.

Impact:
- What changes because of this.

Owner:
- Codex | Claude | Human
```

---

## [2026-03-27 00:00 JST] 上流ランナーを Claude に戻し、Codex は code work に集中させる
Context:
- Codex レート制限期間に上流 role まで Codex が担っていたが、平常運用では Claude と Codex の責務を分けた方が再開しやすく、判断系と実装系の分離も明確になる。

Decision:
- 上流の定期実行 runner は Claude に戻す。
- Claude は `scout`, `ceo`, `planning`, `design`, `gm`, `librarian`, `maintainer` を担当する。
- Codex は GM 配下の実装、focused review、緊急修正に集中させる。
- scheduler は準備だけ整え、human が有効化するまで起動しない。

Impact:
- `tools/agents/setup-task-scheduler.ps1` は Claude runner 前提の dry-run / disabled registration を正本にする。
- 上流 role prompt と help router は Claude 標準に揃える。
- Codex は通常導線で上流 role を常時代行しない。

Owner:
- Human + Claude + Codex

## [2026-03-24 00:00 JST] GitHub を task state の正本にする
Context:
- `.ai/` 配下の channels / specs / TODO / handoff に task 状態が分散し、GitHub と二重管理になりやすかった。

Decision:
- task の状態は GitHub Projects を正本にする。
- task ごとの定義と作業ログは GitHub Issues / PR に集約し、`.ai/` には安定知識だけを残す。

Impact:
- repo 内の旧 state / communication history は廃止し、残さない。
- 各作業の手順書は `.ai/skills/` に分離したまま維持する。

Owner:
- Human + Codex

## [2026-03-24 00:00 JST] GM と human の往復は Discussions を正本にする
Context:
- human 判断が必要な往復を Issue コメントだけで運用すると、長いスレッドの検索性と追跡性が落ちる。

Decision:
- GM と human の意思決定、確認依頼、エスカレーションは GitHub Discussions を正本にする。
- task との結びつきは Issue の `Discussion Link` とコメントで残す。

Impact:
- human 判断の往復を repo 内 Markdown に残さない。
- ticket は Issue 本文 + Issue コメント + PR + 必要なら Discussion で構成する。

Owner:
- Human + Codex

---

## [2026-03-24 00:00 JST] 当面の標準ランナーは Codex にする
Context:
- Claude / Codex の二重入口を通常導線にすると、読む順番と role 判定が増えて AI が迷いやすい。

Decision:
- 当面の標準ランナーは Codex にする。
- Codex は `ceo`, `planning`, `design`, `gm`, `codex` の role を代行する。
- Claude 用 doc は待機状態で残すが、通常導線では使わない。

Impact:
- agent の通常導線は `role file -> primary skill -> .ai/help.md` に固定する。
- scheduler と role prompt は Codex 実行を前提に揃える。

Owner:
- Human + Codex

---

## [2026-03-25 14:56 JST] Project Priority taxonomy を P1 / P2 / P3 に統一する
Context:
- `.ai/doc/` と Issue テンプレートでは優先度を `P1` / `P2` / `P3` としていたが、Project 2 の `Priority` field だけ `P0` / `P1` / `P2` になっており、`P3` backlog を正本側へ記録できなかった。

Decision:
- Project 2 の `Priority` field は `P1` / `P2` / `P3` に揃える。
- backlog grooming と実行順判断では Project field の優先度を正本として扱い、Issue の `P1` / `P2` / `P3` ラベルと同じ意味で運用する。

Impact:
- `P3` の idea / lower-priority task も GitHub Projects 上で欠落なく管理できる。
- Issue テンプレート、運用 docs、Project field の優先度表現が一致する。

Owner:
- Codex
