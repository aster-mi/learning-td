# SKILL: 仲間ユニット追加

## 目的
- ユニットを追加するときに、性能と見た目の品質を両立する。

## 必須方針
- 名前に沿った個別デザインを作る（装備・体型・演出を連動）。
- 同型の使い回しは禁止（文字だけ差し替えNG、汎用テンプレート＋パラメータ差し替えも禁止）。
- 絵文字フォールバックは禁止（`UNIT_RENDERERS` 登録必須）。
- カテゴリは正式名称で割り振る（仮カテゴリ `追加` を使わない）。

## レンダラーファイル構成
シリーズごとに独立ファイルを作成し、各ユニットに専用の描画関数を実装する。

| シリーズ | ファイル |
|---------|---------|
| 文房具 | `renderers/stationery.ts` |
| 学校 | `renderers/school.ts` |
| 科学 | `renderers/science.ts` |
| 数学・芸術 | `renderers/mathArt.ts` |
| 工学 | `renderers/engineering.ts` |
| 自然 | `renderers/nature.ts` |
| 歴史 | `renderers/history.ts` |
| 音楽 | `renderers/music.ts` |
| スポーツ | `renderers/sports.ts` |

**注意:** `expansion.ts` の汎用テンプレート方式（model/gear/aura組み合わせ）は廃止済み。新シリーズ追加時も専用描画関数を書くこと。

## 描画関数の要件
```typescript
export function drawXxx(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void
```
- `const s = r / 15;` でスケーリング
- `ctx.save()/translate(cx,cy)` → 描画 → `ctx.restore()`
- 影、脚（`ph`でウォーキングアニメ）、固有のボディ形状、テーマに沿った装飾を含む
- `t` でアイドルアニメーション（揺れ、光、パーティクル等）
- グラデーション・ハイライトで立体感を出す
- 1関数50〜100行を目安

## 手順
1. `src/data/unitCatalog.ts` にユニットを追加する。
2. `series` と `rarity` を設定し、カテゴリとレアリティの意図を明確化する。
3. 対応するシリーズファイル（なければ新規作成）に描画関数を実装する。
4. `src/components/renderers/index.ts` にインポートと登録を追加する。
5. `npm.cmd run build` を実行する。
6. 目視確認する。
   - ガチャ画面のアイコン
   - パーティ編成画面
   - 戦闘中の描画とアニメーション

## 受け入れ条件
- 追加ユニットがすべてCanvas描画される。
- ユニット名と見た目が一致している（固有のシルエットを持つ）。
- 既存ユニットとの役割差が説明できる。
