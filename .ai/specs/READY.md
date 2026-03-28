# READY Specs（実装可能）

デザイン完了済み。GMがここを読んでCodexタスクを作成する。

---

<!-- SPEC-20260328-01 は実装・マージ完了（PR #37, 2026-03-28）→ DONE.md へ移行済み -->



- **Issue**: #33
- **優先度**: P2
- **ステータス**: READY（デザイン完了 2026-03-28）
- **依存**: #31（streak rescue）実装済み ✅

### 概要
連続ログイン日数の節目（3日・7日・30日・100日）でバッジと称号を付与する。
coin economy・mission 報酬には一切影響しない非currency報酬設計。

### 報酬定義

| 節目 | バッジ | 称号テキスト |
|---|---|---|
| 3日連続 | 🔥 | 「初めの一歩」 |
| 7日連続 | 🔥🔥 | 「1週間継続者」 |
| 30日連続 | 🔥🔥🔥 | 「継続の達人」 |
| 100日連続 | 🔥🔥🔥🔥 | 「伝説のストリーカー」 |

### トリガー条件
- `saveData.login.streak` が節目値（3 / 7 / 30 / 100）に **ちょうど到達** したとき
- rescue で streak が復活した場合でも節目カウントは有効（streak 実数値を参照）
- 1節目は初回ログイン翌々日から取得可能

---

## デザイン設計

### A. MilestoneBadgeModal 演出

**コンテナ**（StreakRescueModal と同一パターン）:
```
position: fixed, inset: 0, zIndex: 310（AchievementToast: 300 より前面）
background: rgba(0,0,0,0.75), display: flex, alignItems: center, justifyContent: center
```

**内部カード**:
```
width: 100%, maxWidth: 420
background: #0f172a, border: 1px solid #fbbf24（アンバー系でお祝い感）
borderRadius: 16, padding: 24, textAlign: center, display: grid, gap: 16
```

**入場アニメーション**（AchievementToast から流用）:
```
初期: transform scale(0.8) opacity(0)
完了: transform scale(1) opacity(1)
transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
```

**コンテンツ構成**（上から）:
1. ラベル行: `🎉 節目達成！`（fontSize: 11, color: #818cf8, fontWeight: bold, letterSpacing: 1）
2. バッジ絵文字: `milestone.badge`（fontSize: 64）
3. 称号テキスト: `「${milestone.title}」`（fontSize: 24, fontWeight: 700, color: #fbbf24）
4. 説明文: `🔥 ${milestone.days}日連続ログイン達成！`（fontSize: 14, color: #94a3b8）
5. OK ボタン: `background: #4f46e5, borderRadius: 10, padding: 12px 16px, fontSize: 15, fontWeight: 700, color: #fff, width: 100%`

**Props 設計**:
```tsx
interface Props {
  milestone: { id: string; days: number; badge: string; title: string };
  onClose: () => void;
}
```

### B. ProgressScreen 概要タブ拡張

**現在の最高称号バナー**（既存 stats グリッドの上に挿入）:
- `saveData.badges` が空なら非表示
- 最高取得称号（MILESTONESの逆順で最初にヒット）を表示
- スタイル:
  ```
  background: linear-gradient(90deg, rgba(30,27,75,0.8), rgba(79,70,229,0.3))
  border: 1px solid #4f46e5, borderRadius: 8, padding: 10px 16px
  display: flex, alignItems: center, gap: 8
  ```
- 内容: `🏅 現在の称号:` ラベル + `「〇〇」` テキスト（color: #fbbf24, fontWeight: bold）

**バッジコレクション**（既存 stats グリッドの下に追加）:
- セクションタイトル: `🔥 ストリーク節目バッジ`（fontSize: 13, color: #94a3b8, marginBottom: 8）
- バッジカード 4枚をグリッドで表示:
  ```
  gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)"
  gap: 8
  ```
- 各カード:
  - 取得済み: `background: #1e293b, border: 1px solid #fbbf24`
  - 未取得: `background: #0f172a, border: 1px solid #334155, opacity: 0.4`
  - 内容: 絵文字（32px）+ 節目日数（11px, #94a3b8）+ 称号（11px, bold, color: 取得済み=#fbbf24/未取得=#475569）

### C. 称号表示場所の判断

**決定: ProgressScreen 概要タブのみ**

StageSelectヘッダーには **追加しない**。
- 理由: StageSelect ヘッダーには SummaryCard（🔥N日）が既に存在し、称号文字列（最大10字）を追加すると mobile での overflow が発生する
- 称号は「マイルストーンの記念展示」であり、操作画面より記録画面が適切な場所

### D. 既存コンポーネントとの整合

| 既存 | zIndex | 同時表示の可能性 | 対応 |
|---|---|---|---|
| AchievementToast | 300 | あり（ログイン直後の実績解除と重複する可能性）| MilestoneBadgeModal を zIndex: 310 で前面に |
| StreakRescueModal | 300 | なし（rescue 後の節目到達は翌日以降）| 問題なし |

---

## 実装ファイル一覧

| ファイル | 変更種別 | 内容 |
|---|---|---|
| `src/data/progression.ts` | 拡張 | `STREAK_MILESTONES` 定数追加・`LoginProgressResult` に `milestoneReached?` フィールド追加 |
| `src/data/saveData.ts` | 拡張 | `SaveData.badges?: string[]` フィールド追加 |
| `src/scenes/StageSelect.tsx` | 変更 | ログイン時の節目チェック → `MilestoneBadgeModal` 表示・`saveData.badges` 更新 |
| `src/components/ProgressScreen.tsx` | 変更 | 概要タブ: 称号バナー + バッジコレクション追加 |
| `src/components/MilestoneBadgeModal.tsx` | 新設 | 節目到達時モーダル（スプリングアニメーション付き） |

---

## STREAK_MILESTONES 定数（Codex向け参考）

```ts
export interface StreakMilestone {
  id: string;        // e.g. "streak_3"
  days: number;      // 3 | 7 | 30 | 100
  badge: string;     // emoji
  title: string;     // 称号テキスト（括弧なし）
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  { id: "streak_3",   days: 3,   badge: "🔥",         title: "初めの一歩" },
  { id: "streak_7",   days: 7,   badge: "🔥🔥",       title: "1週間継続者" },
  { id: "streak_30",  days: 30,  badge: "🔥🔥🔥",     title: "継続の達人" },
  { id: "streak_100", days: 100, badge: "🔥🔥🔥🔥",   title: "伝説のストリーカー" },
];
```

---

## LoginProgressResult 拡張（Codex向け参考）

```ts
export interface LoginProgressResult {
  data: SaveData;
  streakBroke: boolean;
  previousStreak: number;
  milestoneReached?: StreakMilestone;  // 新規追加
}
```

`ensureLoginProgress` 内でのチェックロジック:
1. streak 更新後、新 streak 値が STREAK_MILESTONES のいずれかの `days` に一致するか確認
2. かつ `saveData.badges` に当該 `id` が**含まれていない**場合のみ `milestoneReached` をセット
3. `badges` への追記は StageSelect 側で行う（モーダル表示後に `onClose` のタイミングで保存）

---

## 受け入れ条件（AC）

- [ ] `STREAK_MILESTONES` に 3/7/30/100 日の定数が定義されている
- [ ] 初回節目到達時のみモーダルが表示される（2回目以降は表示しない）
- [ ] ProgressScreen の概要タブで取得済みバッジと最新称号が確認できる
- [ ] coin / mission / rescue 残高に一切影響しない
- [ ] 既存テスト（quiz:validate・build）が通過する

---

### Codex タスク指示

```
実装対象: SPEC-20260328-01 #33 節目バッジ・称号システム

変更ファイル（この5ファイルのみ触ること）:
1. src/data/progression.ts   — STREAK_MILESTONES 定数追加・LoginProgressResult に milestoneReached? 追加・ensureLoginProgress 内でのチェックロジック実装
2. src/data/saveData.ts      — SaveData に badges?: string[] フィールド追加
3. src/components/MilestoneBadgeModal.tsx — 新設（Props・スタイルは READY.md のデザイン設計A参照）
4. src/components/ProgressScreen.tsx — 概要タブに称号バナー + バッジコレクション追加（デザイン設計B参照）
5. src/scenes/StageSelect.tsx — ensureLoginProgress 戻り値の milestoneReached を確認し MilestoneBadgeModal を表示、badges 更新後にセーブ

制約:
- coin / mission / rescue 残高への影響ゼロ
- MilestoneBadgeModal の zIndex は 310（AchievementToast の 300 より前面）
- 称号表示は ProgressScreen 概要タブのみ（StageSelectヘッダーへの追加は不要）
- 完了後 npm run build が通過すること
```

---

