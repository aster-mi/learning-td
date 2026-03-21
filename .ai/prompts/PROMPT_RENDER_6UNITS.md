# タスク: 6ユニットの手描きCanvas2Dレンダラー作成

## 概要
以下の6ユニットにCanvas2D描画関数がなく、emojiフォールバック（"BT", "PT"等のテキスト）で表示されている。
各ユニットに **固有のデザイン** を持つ描画関数を作成し、`UNIT_RENDERERS` に登録すること。

## 重要な禁止事項
- **汎用テンプレート方式は禁止**。`expansion.ts` のような model/gear/aura の組み合わせでユニットを生成するアプローチは使わないこと。
- 各ユニットに **専用の描画関数** を書くこと。関数ごとに **固有のシルエット・形状** を持たせる。
- 全ユニットが同じ体型で武器だけ違う、というのはNG。

## 作成するユニット

| ID | label | series | color | radius | デザイン指示 |
|----|-------|--------|-------|--------|-------------|
| `notebook` | ノート騎士 | 数学 | `#60a5fa` | 16 | 開いたノートが体。リングバインドが背骨のように見え、ページがマント状に広がる。ペンを剣のように持つ。罫線がアーマーの模様。 |
| `protractor` | 分度器レンジャー | 数学 | `#22d3ee` | 14 | 半円の分度器が体。目盛りが体表面に刻まれている。角度線が射撃のように飛ぶエフェクト。細身で素早い印象。 |
| `battery` | バッテリー兵 | 工学 | `#84cc16` | 17 | 単三電池が体（円筒形、+極が頭）。+端子が帽子/ヘルメット、−端子が靴。電力メーター or 稲妻マークが胸に。充電エフェクト（パルス発光）。 |
| `graphpaper` | 方眼スナイパー | 数学 | `#a78bfa` | 13 | 方眼紙を丸めた筒がスナイパーライフル。体は方眼紙でできた人型（グリッド線が見える）。スコープ or 照準レティクルが目。細長いシルエット。 |
| `paintbrush` | 絵筆ウィザード | 図工 | `#f472b6` | 17 | 太い絵筆が杖。体はパレット型で、絵の具の色が複数載っている。魔法使いのローブはキャンバス地。穂先からカラフルな魔法のしぶきが飛ぶアニメーション。 |
| `drone` | ドローン先生 | 工学 | `#38bdf8` | 16 | クアッドコプター型。4つのプロペラが回転アニメーション。中央にカメラ/レンズの目。教師っぽいメガネ or 学帽。影は地面に落ちて浮遊感を表現。LEDインジケーター。 |

## 関数シグネチャ（厳守）
```typescript
export function drawXxx(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  r: number, col: string, t: number, ph: number
): void
```

| 引数 | 意味 |
|------|------|
| `cx, cy` | 描画中心座標 |
| `r` | 半径（13〜17px） |
| `col` | ユニットカラー（hex） |
| `t` | 経過時間（アイドルアニメ用、連続float） |
| `ph` | フェーズ（歩行アニメ用、0〜1繰り返し） |

## 描画パターン（必ず従うこと）

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

export function drawExample(ctx, cx, cy, r, col, t, ph) {
  const s = r / 15;          // スケーリング
  ctx.save();
  ctx.translate(cx, cy);

  // 1. 影（接地感）
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.ellipse(0, 12*s, r*0.7, r*0.15, 0, 0, Math.PI*2);
  ctx.fill();

  // 2. 脚（ph で歩行アニメーション）
  const legSwing = Math.sin(ph * Math.PI * 2) * r * 0.25;
  // ... strokeStyle, moveTo/lineTo ...

  // 3. ユニット固有のボディ形状
  //    ※ここが最重要。名前のテーマに合った独自形状を描く。
  //    グラデーションで立体感を出す。

  // 4. ディテール（目、模様、装備、装飾）

  // 5. t でアイドルアニメ（発光、パーティクル、揺れ等）

  ctx.restore();
}
```

## 良いレンダラーの実例

### drawMagnet（U字磁石キャラ — science.ts）
- U字型の曲線パスで磁石の体を描画
- N極(青)/S極(銀)の色分け + ラベル文字
- 極からスパークが飛ぶアニメーション
- カーブの内側に顔
- 磁力線を点線弧で表現

### drawAbacus（そろばん侍 — mathArt.ts）
- 木枠フレームの長方形ボディ
- 4本のロッドに色付きビーズ（`ph` でスライド）
- 赤い鉢巻 + 刀
- ビーズはラジアルグラデーションで立体的

### drawPencil（えんぴつ兵 — stationery.ts）
- 六角形の断面をイメージした縦長ボディ
- ピンクの消しゴム、銀のフェリュール（金具）
- 削った木の先端 + 鉛芯
- ボディにグラデーションストライプ

**共通点: 「何のキャラか」が形だけで分かる。体型が全員違う。**

## 実装手順

1. `src/components/renderers/` に新ファイル作成（例: `extras.ts`）、または既存ファイルに追記
   - notebook, protractor, graphpaper → `mathArt.ts` に追記が自然
   - battery, drone → `engineering.ts` に追記が自然
   - paintbrush → `mathArt.ts`（芸術系が既にここにある）に追記が自然

2. 各関数を実装（1関数50〜100行目安）

3. `src/components/renderers/index.ts` にインポートと登録を追加:
```typescript
import { ..., drawNotebook, drawProtractor, drawGraphpaper, drawPaintbrush } from "./mathArt";
import { ..., drawBattery, drawDrone } from "./engineering";

export const UNIT_RENDERERS = {
  // ... 既存 ...
  notebook:   drawNotebook,
  protractor: drawProtractor,
  graphpaper: drawGraphpaper,
  paintbrush: drawPaintbrush,
  battery:    drawBattery,
  drone:      drawDrone,
};
```

4. ビルド確認:
```bash
npm run build
```
型エラーが0であること。

5. `.ai/AGENT_HANDOFF.md` にハンドオフを書く。

## 受け入れ条件
- [ ] 6関数すべてが固有のシルエットを持つ（体型が全員違う）
- [ ] `npm run build` がエラー0で通る
- [ ] `UnitIcon` で絵文字フォールバック("NB","PT"等)に落ちない
- [ ] 汎用テンプレートや共通ボディ関数を使っていない
