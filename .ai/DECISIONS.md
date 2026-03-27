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

## [2026-03-27 09:30 JST] Streak Rescue コスト
Context:
- SPEC-20260327-01 でストリーク救済モーダルを設計。コストの根拠が必要。

Decision:
- rescue コストは 50コイン固定。

Impact:
- `StreakRescueModal` のデフォルト props、App.tsx の rescue ハンドラでこの値を使用。

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
