# Agent Collaboration Guide

This repository can be edited by both Codex and Claude in alternating sessions.
Use this file as the shared operating contract.

## Goals
- Keep work continuous across agent switches.
- Avoid duplicate edits and conflicting assumptions.
- Leave clear context for the next agent and the human.

## Required Workflow
1. Read `.ai/AGENT_HANDOFF.md` before starting work.
2. Check `.ai/TODO.md` and `.ai/DECISIONS.md` for current priorities and decisions.
3. Use `.ai/SESSION_TEMPLATE.md` when writing handoff notes.
4. Do the requested task.
5. Append a new entry to `.ai/AGENT_HANDOFF.md` before ending your turn.

## Shared Planning Files
- `.ai/AGENT_HANDOFF.md`: agent-to-agent handoff log
- `.ai/TODO.md`: shared prioritized tasks
- `.ai/DECISIONS.md`: decision rationale and outcomes
- `.ai/SESSION_TEMPLATE.md`: handoff and commit templates
- `.ai/skills/`: project-specific reusable work skills

## Commit Convention
- Format: `<scope>: <short summary>`
- Keep commits small and scoped to one intent.

## Previous Notes
- Confirm current scope from the latest handoff entry.
- If something is unverified, say it explicitly.
- If you detect unexpected local changes, pause and ask the human.

## Handoff Entry Rules
- Use JST timestamps.
- Include agent name (`Codex` or `Claude`).
- Include: summary, changed files, validation, open questions, next step.
- Keep entries short and factual.

## Conflict Prevention
- Do not rewrite the other agent's in-progress plan without reason.
- If you need to change direction, explain why in the handoff.
- If you detect unexpected local changes, pause and ask the human.

## Branch and Commit Notes
- Prefer small, scoped commits.
- Mention handoff-relevant context in commit messages when useful.
- Never include secrets or tokens in handoff notes.
