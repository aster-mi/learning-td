# タスク: 6ユニットの手描きCanvas2Dレンダラー作成

## 前提
`.ai/skills/SKILL_UNIT_ADD.md` の手順・ルール・描画パターンに従うこと。
特に「必須方針」「描画関数の要件」「良いレンダラーの実例」を必ず読んでから着手すること。

## 背景
以下の6ユニットはカタログ（`unitCatalog.ts`）に定義済みだが、描画関数がなく
`UnitIcon` で emoji フォールバック（"BT", "PT" 等のテキスト）になっている。

## 作成するユニット

| ID | label | 追記先ファイル | color | radius | デザイン指示 |
|----|-------|---------------|-------|--------|-------------|
| `notebook` | ノート騎士 | `mathArt.ts` | `#60a5fa` | 16 | 開いたノートが体。リングバインドが背骨、ページがマント状に広がる。ペンを剣のように持つ。罫線がアーマーの模様。 |
| `protractor` | 分度器レンジャー | `mathArt.ts` | `#22d3ee` | 14 | 半円の分度器が体。目盛りが体表面に刻まれている。角度線が射撃のように飛ぶエフェクト。細身で素早い印象。 |
| `graphpaper` | 方眼スナイパー | `mathArt.ts` | `#a78bfa` | 13 | 方眼紙を丸めた筒がスナイパーライフル。体は方眼紙でできた人型（グリッド線が見える）。スコープ/照準レティクルが目。細長いシルエット。 |
| `paintbrush` | 絵筆ウィザード | `mathArt.ts` | `#f472b6` | 17 | 太い絵筆が杖。体はパレット型で絵の具の色が複数載っている。ローブはキャンバス地。穂先からカラフルな魔法のしぶきが飛ぶアニメーション。 |
| `battery` | バッテリー兵 | `engineering.ts` | `#84cc16` | 17 | 単三電池が体（円筒形、+極が頭）。+端子が帽子、−端子が靴。稲妻マークが胸に。充電パルス発光アニメーション。 |
| `drone` | ドローン先生 | `engineering.ts` | `#38bdf8` | 16 | クアッドコプター型。4プロペラが回転アニメ。中央にカメラレンズの目。メガネ or 学帽。影で浮遊感を表現。LEDインジケーター。 |

## 実装手順

1. 上記の「追記先ファイル」に描画関数を追記する
2. `src/components/renderers/index.ts` に import と登録を追加:
   ```typescript
   // mathArt.ts から
   notebook:   drawNotebook,
   protractor: drawProtractor,
   graphpaper: drawGraphpaper,
   paintbrush: drawPaintbrush,
   // engineering.ts から
   battery:    drawBattery,
   drone:      drawDrone,
   ```
3. `npm run build` でエラー0を確認
4. `.ai/AGENT_HANDOFF.md` にハンドオフを書く
