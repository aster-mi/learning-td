# SKILL: 仲間ユニット追加

## 目的
ユニットを追加するときに、性能と見た目の品質を両立する。

## 必須方針
- 名前に沿った個別デザインを作る（装備・体型・演出を連動）。
- 同型の使い回しは禁止（文字だけ差し替えNG、汎用テンプレート＋パラメータ差し替えも禁止）。
- 絵文字フォールバックは禁止（`UNIT_RENDERERS` 登録必須）。
- カテゴリは正式名称で割り振る（仮カテゴリ `追加` を使わない）。

## 対象ファイル
| ファイル | 役割 |
|---------|------|
| `src/data/unitCatalog.ts` | ユニット定義（パラメータ・色・シリーズ） |
| `src/components/renderers/<series>.ts` | 描画関数の実装 |
| `src/components/renderers/index.ts` | 描画関数の登録（ID→関数マップ） |

## レンダラーファイル構成
シリーズごとに独立ファイルを作成し、各ユニットに専用の描画関数を実装する。

| シリーズ | ファイル | ユニット数 |
|---------|---------|-----------|
| 文房具 | `renderers/stationery.ts` | 8 |
| 学校 | `renderers/school.ts` | 5 |
| 科学 | `renderers/science.ts` | 6 |
| 数学・芸術 | `renderers/mathArt.ts` | 6 |
| 工学 | `renderers/engineering.ts` | 10 |
| 自然 | `renderers/nature.ts` | 10 |
| 歴史 | `renderers/history.ts` | 10 |
| 音楽 | `renderers/music.ts` | 10 |
| スポーツ | `renderers/sports.ts` | 10 |

**注意:** `expansion.ts` の汎用テンプレート方式（model/gear/aura組み合わせ）は廃止済み。新シリーズ追加時も専用描画関数を書くこと。

## 描画関数の要件
```typescript
export function drawXxx(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void
```

| 引数 | 意味 |
|------|------|
| `cx, cy` | 描画中心座標 |
| `r` | 半径（13〜21px程度） |
| `col` | ユニットカラー（hex文字列） |
| `t` | 経過時間（idle/攻撃アニメ用） |
| `ph` | フェーズ（歩行アニメ用、0〜1を繰り返す） |

### 必須ルール（よくある違反パターン）

1. **`col` 引数を必ずボディのグラデーションに使うこと**
   - `void col;` で無視して固定色で描くのはNG
   - `col` は `unitCatalog.ts` の `color` と対応しており、ユーザーに見える色
   - 固定色にするとカタログの色と描画が乖離する
   - 固有の色が必要な部分（装飾、武器等）は固定色で良いが、**ボディ本体は `col` ベース**にする

2. **脚と `ph` による歩行アニメーションを入れること**
   - 浮遊型ユニット（ドローン等）以外は必ず脚を描く
   - 脚の振りは `ph`（`Math.sin(ph * Math.PI * 2) * r * 0.25`）を使う
   - `t` を脚アニメに使うと全ユニットが同じタイミングで動いてしまう。`ph` はユニットごとに異なる値が渡される
   - bob（上下揺れ）のオフセットに `ph` を使うだけでは不十分

3. **`globalAlpha` を変更したら必ず戻すこと**
   - `ctx.save()` / `ctx.restore()` で囲むか、描画後に `ctx.globalAlpha = 1` を入れる
   - 戻し忘れると後続のユニット描画に影響する

4. **`index.ts` の登録位置はシリーズのコメントブロック内に置くこと**
   - 工学シリーズのユニットは `// 工学シリーズ` ブロックに、数学は `// 数学シリーズ` に

### 描画パターン
```typescript
export function drawXxx(ctx, cx, cy, r, col, t, ph) {
  const s = r / 15;          // スケーリング係数
  ctx.save();
  ctx.translate(cx, cy);

  // 1. 影
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.ellipse(0, 12*s, r*0.7, r*0.15, 0, 0, Math.PI*2);
  ctx.fill();

  // 2. 脚（phでウォーキングアニメ）
  const legSwing = Math.sin(ph * Math.PI * 2) * r * 0.25;
  // ...

  // 3. 固有のボディ形状（名前のテーマに合わせる）
  // ...

  // 4. ディテール（グラデーション・ハイライト・装飾）
  // ...

  // 5. tでアイドルアニメ（揺れ、光、パーティクル等）
  // ...

  ctx.restore();
}
```

### カラーヘルパー（各ファイル先頭に定義）
```typescript
function hexToRgb(hex: string) {
  return { r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) };
}
function darker(hex: string, n: number) {
  const {r,g,b} = hexToRgb(hex);
  return `rgb(${Math.max(0,r-n)},${Math.max(0,g-n)},${Math.max(0,b-n)})`;
}
function lighter(hex: string, n: number) {
  const {r,g,b} = hexToRgb(hex);
  return `rgb(${Math.min(255,r+n)},${Math.min(255,g+n)},${Math.min(255,b+n)})`;
}
```

## 手順

### 1. ユニットカタログに追加
```typescript
// src/data/unitCatalog.ts に追加
{ id: "eng_11", label: "ユニット名", emoji: "E11", series: "工学",
  rarity: "rare", hp: 100, atk: 25, atkInterval: 1200, speed: 60,
  range: 50, cost: 30, color: "#64748b", radius: 15,
  desc: "ユニットの説明" },
```

### 2. 描画関数を実装
対応するシリーズファイル（なければ新規作成）に `export function drawXxx(...)` を追加。
- 1関数50〜100行を目安
- 固有のシルエットを持たせる（他ユニットと区別がつくこと）

### 3. index.ts に登録
```typescript
// src/components/renderers/index.ts
import { drawXxx } from "./engineering";
// ...
export const UNIT_RENDERERS = {
  // ...
  eng_11: drawXxx,
};
```

## 良いレンダラーの実例

### drawMagnet（U字磁石キャラ — science.ts）
- U字型の曲線パスで磁石の体を描画（体型そのものが磁石）
- N極(青)/S極(銀)の色分け + ラベル
- 極からスパークが飛ぶアニメーション
- カーブの内側に顔、磁力線を点線弧で表現

### drawAbacus（そろばん侍 — mathArt.ts）
- 木枠フレームの長方形ボディ（体型そのものがそろばん）
- 4本のロッドに色付きビーズ（`ph` でスライドアニメ）
- 赤い鉢巻 + 刀、ビーズはラジアルグラデーションで立体的

### drawPencil（えんぴつ兵 — stationery.ts）
- 六角形の縦長ボディ（体型そのものが鉛筆）
- ピンクの消しゴム、銀のフェリュール（金具）、削った先端
- ボディにグラデーションストライプ

**共通点: 「何のキャラか」が形だけで分かる。体型が全員違う。**

### 4. ビルド確認
```bash
npm run build
```

### 5. 目視確認
- ガチャ画面のアイコン（`GachaModal.tsx` → `UnitIcon`）
- パーティ編成画面（`PartySelect.tsx` → `UnitIcon`）
- 戦闘中の描画（`BattleCanvas.tsx` → `UNIT_RENDERERS`）

## 受け入れ条件
- [ ] 追加ユニットがすべてCanvas描画される（絵文字フォールバックなし）
- [ ] ユニット名と見た目が一致している（固有のシルエットを持つ）
- [ ] 既存ユニットとの役割差が説明できる
- [ ] `npm run build` がエラーなしで通る
- [ ] `col` 引数がボディのグラデーションに使われている（`void col` で無視していない）
- [ ] 浮遊型以外は脚があり、`ph` で歩行アニメーションしている（`t` ではなく `ph`）
- [ ] `globalAlpha` や `shadowBlur` を変更した箇所は `save/restore` で囲まれている
- [ ] `index.ts` で正しいシリーズのコメントブロック内に登録されている
