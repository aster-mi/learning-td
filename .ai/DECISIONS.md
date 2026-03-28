# Decision Log

Record project decisions briefly so Codex and Claude do not re-discuss the same points.
Add new entries at the top.

## Format

```
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

## [2026-03-28 03:17 JST] Scheduled Runner Auto Push
Context:
- The user requested scheduled agent runs to push deployable changes automatically and to reduce GM cadence.

Decision:
- `Task Scheduler` launches now pass `-ScheduledRun`, and successful scheduled runs auto-commit and push only when the repo started clean.
- `learning-td-gm` cadence is reduced to once every 3 hours.

Impact:
- Scheduled edits can reach GitHub Pages deploy without relying on the agent to remember a final push.
- Pre-existing local changes are not swept into scheduler-generated commits.

Owner:
- Human + Codex

---

## [2026-03-27 09:30 JST] Streak Rescue コスト
Context:
- SPEC-20260327-01 でストリーク救済モーダルを設計し、コストの妥当性を決める必要があった。

Decision:
- rescue コストは 50 コイン固定。

Impact:
- `StreakRescueModal` の default props と `app.tsx` の rescue ハンドラでこの値を使う。

Owner:
- デザイン

---

## [2026-03-21 01:28 JST] Agent Collaboration Structure
Context:
- We need stable collaboration when Codex and Claude run alternately.

Decision:
- Agent-specific instructions live in `.codex/CODEX.md` and `.claude/CLAUDE.md`.
- Shared handoff and planning docs live in `.ai/`.

Impact:
- All future handoffs, shared todos, and architecture/decision notes should be centralized under `.ai/`.

Owner:
- Human + Codex
