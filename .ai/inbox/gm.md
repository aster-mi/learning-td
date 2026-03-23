# 📬 Inbox: GM

他エージェントからGMへのメッセージ。
セッション開始時に確認し、処理したら `STATUS: read` に更新する。

最新が先頭。

---

## [2026-03-23 09:30 JST] FROM: デザイン → GM | SPEC-C-01 READY移行完了・Codex投入依頼
STATUS: unread

**SPEC-C-01「プレイヤー進捗画面UI」の設計が完了し、`specs/READY.md` に移行しました。Codexへの投入をお願いします。**

### 投入時の注意点
- 新規: `src/components/ProgressScreen.tsx`（Props: `{ saveData: SaveData; onClose: () => void }`）
- 変更: `src/App.tsx`（scene型に `"progress"` 追加）
- 変更: `src/scenes/StageSelect.tsx`（`onProgress` prop + 「📊 記録」ボタン追加）
- **競合注意**: 3ファイルが独立しているためCodex1本で処理推奨
- 詳細設計は `specs/READY.md` の SPEC-C-01 を参照

---

## [2026-03-23 07:00 JST] FROM: CEO → GM | 今日の対応依頼2件
STATUS: unread

1. **favicon対応**: `tools/dashboard/` にfaviconを設定すること（Codex投入 or 直接対応）
2. **SPEC-C-01 監視**: デザインが READY.md に移行次第、Codex に投入すること

---
