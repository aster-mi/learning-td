# READY Specs（実装可能）

デザイン完了済み。GMがここを読んでCodexタスクを作成する。

---

## [SPEC-B-01] 情報・ITリテラシー問題追加

### 概要
プログラミングカテゴリに「情報・ITリテラシー」サブカテゴリを追加し、30問の新問題を投入する。

### 背景・目的
- CEO方針: B. 問題カテゴリ拡張（2026-03-23）
- ユーザー確認: "Bで"（2026-03-23 02:44）
- 既存カテゴリ（英語・地理・算数など）はすでに存在するため、未カバーのIT/情報リテラシー領域を追加する

### 変更ファイル
1. `src/data/questionMeta.ts` — SUB_CATEGORIES に1件追加
2. `src/data/questionBanks/programming.jsonl` — 末尾に30行追加

### 具体的変更内容

#### questionMeta.ts
`SUB_CATEGORIES` 配列の末尾（`{ main: "なぞなぞ", ... }` の直前）に追加:
```ts
{ main: "プログラミング", name: "情報・ITリテラシー", emoji: "🖥️", color: "#7c3aed", desc: "PC基礎・インターネット・情報セキュリティ" },
```

#### programming.jsonl に追加する30問
```jsonl
{"id":"it001","main":"プログラミング","sub":"情報・ITリテラシー","level":2,"question":"コンピューターの電源を切ると消えてしまう記憶装置はどれ？","choices":["HDD","SSD","RAM","USB"],"answer":"RAM"}
{"id":"it002","main":"プログラミング","sub":"情報・ITリテラシー","level":2,"question":"インターネットのWebサイトのアドレスを何という？","choices":["IPアドレス","URL","DNS","CPU"],"answer":"URL"}
{"id":"it003","main":"プログラミング","sub":"情報・ITリテラシー","level":3,"question":"Wi-Fiとはどのような技術？","choices":["有線LAN","Bluetooth","無線LAN","USB接続"],"answer":"無線LAN"}
{"id":"it004","main":"プログラミング","sub":"情報・ITリテラシー","level":3,"question":"1KBは何バイト？","choices":["100バイト","512バイト","1000バイト","1024バイト"],"answer":"1024バイト"}
{"id":"it005","main":"プログラミング","sub":"情報・ITリテラシー","level":3,"question":"ウイルス対策ソフトの目的は？","choices":["動画を再生する","データを圧縮する","コンピューターを守る","画像を編集する"],"answer":"コンピューターを守る"}
{"id":"it006","main":"プログラミング","sub":"情報・ITリテラシー","level":4,"question":"OSとは何の略？","choices":["Open Source","Output System","Operating System","Online Service"],"answer":"Operating System"}
{"id":"it007","main":"プログラミング","sub":"情報・ITリテラシー","level":4,"question":"メールで他の受信者に見えないよう複数人に送る機能は？","choices":["CC","TO","BCC","返信"],"answer":"BCC"}
{"id":"it008","main":"プログラミング","sub":"情報・ITリテラシー","level":4,"question":"クラウドとは何を指す？","choices":["空の雲","ハードディスク","インターネット経由のサービス・保存","OSの一種"],"answer":"インターネット経由のサービス・保存"}
{"id":"it009","main":"プログラミング","sub":"情報・ITリテラシー","level":4,"question":"フィッシング詐欺とは何？","choices":["魚を釣るゲーム","偽サイトでパスワードを盗む攻撃","ウイルスを配布する行為","Wi-Fiを盗聴すること"],"answer":"偽サイトでパスワードを盗む攻撃"}
{"id":"it010","main":"プログラミング","sub":"情報・ITリテラシー","level":4,"question":"CPUとは何の略？","choices":["Computer Power Unit","Central Processing Unit","Core Program Utility","Control Panel Unit"],"answer":"Central Processing Unit"}
{"id":"it011","main":"プログラミング","sub":"情報・ITリテラシー","level":5,"question":"1GBは何MB？","choices":["10MB","100MB","1000MB","1024MB"],"answer":"1024MB"}
{"id":"it012","main":"プログラミング","sub":"情報・ITリテラシー","level":5,"question":"URLの「https」の「s」は何を意味する？","choices":["Special","Secure","Speed","Standard"],"answer":"Secure"}
{"id":"it013","main":"プログラミング","sub":"情報・ITリテラシー","level":5,"question":"データを暗号化する目的は？","choices":["ファイルを圧縮するため","不正アクセスから情報を守るため","処理速度を上げるため","画像を綺麗にするため"],"answer":"不正アクセスから情報を守るため"}
{"id":"it014","main":"プログラミング","sub":"情報・ITリテラシー","level":5,"question":"二段階認証の目的は？","choices":["パスワードを簡単にする","ログインを速くする","不正ログインをより難しくする","データを暗号化する"],"answer":"不正ログインをより難しくする"}
{"id":"it015","main":"プログラミング","sub":"情報・ITリテラシー","level":5,"question":"ファイルの「拡張子」とは何？","choices":["ファイルの大きさ","ファイル名の末尾の種類を示す部分","ファイルの作成日","ファイルの作成者"],"answer":"ファイル名の末尾の種類を示す部分"}
{"id":"it016","main":"プログラミング","sub":"情報・ITリテラシー","level":6,"question":"IPアドレスの役割は？","choices":["インターネット上の住所","ウイルス対策","ファイル保存","パスワード管理"],"answer":"インターネット上の住所"}
{"id":"it017","main":"プログラミング","sub":"情報・ITリテラシー","level":6,"question":"SSL/TLSの目的は？","choices":["画像を圧縮する","通信を暗号化して安全にする","CPUを高速化する","OSを更新する"],"answer":"通信を暗号化して安全にする"}
{"id":"it018","main":"プログラミング","sub":"情報・ITリテラシー","level":6,"question":"バックアップの目的は？","choices":["処理速度向上","データ消失に備えたコピー保存","ウイルス駆除","画面の明るさ調整"],"answer":"データ消失に備えたコピー保存"}
{"id":"it019","main":"プログラミング","sub":"情報・ITリテラシー","level":6,"question":"ランサムウェアとは何？","choices":["ゲームソフト","ファイルを暗号化して身代金を要求するマルウェア","動画編集ソフト","SNSアプリ"],"answer":"ファイルを暗号化して身代金を要求するマルウェア"}
{"id":"it020","main":"プログラミング","sub":"情報・ITリテラシー","level":6,"question":"DNSの役割は？","choices":["ドメイン名をIPアドレスに変換する","ファイルを圧縮する","ウイルスを検知する","画像を表示する"],"answer":"ドメイン名をIPアドレスに変換する"}
{"id":"it021","main":"プログラミング","sub":"情報・ITリテラシー","level":7,"question":"HTTPとHTTPSの違いは？","choices":["速度の違い","暗号化の有無","ブラウザの種類","OSの違い"],"answer":"暗号化の有無"}
{"id":"it022","main":"プログラミング","sub":"情報・ITリテラシー","level":7,"question":"ファイアウォールの役割は？","choices":["ウイルスを削除する","不正な通信をブロックする","データを圧縮する","CPUを冷却する"],"answer":"不正な通信をブロックする"}
{"id":"it023","main":"プログラミング","sub":"情報・ITリテラシー","level":7,"question":"VPNとは何？","choices":["仮想的なプライベートネットワーク","ビデオ再生ネットワーク","ウイルス対策プログラム","無線LAN規格"],"answer":"仮想的なプライベートネットワーク"}
{"id":"it024","main":"プログラミング","sub":"情報・ITリテラシー","level":7,"question":"SQLインジェクションとは？","choices":["データベースに不正なSQL文を送り込む攻撃","ウイルスを注入する行為","パスワードを盗む手法","メールを大量送信すること"],"answer":"データベースに不正なSQL文を送り込む攻撃"}
{"id":"it025","main":"プログラミング","sub":"情報・ITリテラシー","level":7,"question":"マルウェアとは何？","choices":["高性能なソフトウェア","悪意あるソフトウェアの総称","ネットワーク機器","圧縮ファイル形式"],"answer":"悪意あるソフトウェアの総称"}
{"id":"it026","main":"プログラミング","sub":"情報・ITリテラシー","level":8,"question":"公開鍵暗号方式では、暗号化に使う鍵は？","choices":["秘密鍵","共通鍵","公開鍵","マスターキー"],"answer":"公開鍵"}
{"id":"it027","main":"プログラミング","sub":"情報・ITリテラシー","level":8,"question":"XSS（クロスサイトスクリプティング）の対策として有効なのは？","choices":["入力値のエスケープ処理","ファイアウォールの無効化","パスワードの変更","圧縮の実施"],"answer":"入力値のエスケープ処理"}
{"id":"it028","main":"プログラミング","sub":"情報・ITリテラシー","level":8,"question":"ゼロデイ攻撃とは？","choices":["夜中にのみ行われる攻撃","公開された脆弱性パッチが出る前に行われる攻撃","パスワード総当たり攻撃","迷惑メール大量送信"],"answer":"公開された脆弱性パッチが出る前に行われる攻撃"}
{"id":"it029","main":"プログラミング","sub":"情報・ITリテラシー","level":9,"question":"PKI（公開鍵基盤）で信頼の根拠となるのは？","choices":["ユーザーのパスワード","認証局（CA）が発行するデジタル証明書","DNSサーバー","MACアドレス"],"answer":"認証局（CA）が発行するデジタル証明書"}
{"id":"it030","main":"プログラミング","sub":"情報・ITリテラシー","level":9,"question":"DDoS攻撃とは？","choices":["データを暗号化する攻撃","多数のホストからサーバーに過負荷をかける攻撃","フィッシングメールの大量送信","ソフトウェアのバグを悪用する攻撃"],"answer":"多数のホストからサーバーに過負荷をかける攻撃"}
```

### 制約
- 変更対象ファイル: `src/data/questionMeta.ts`, `src/data/questionBanks/programming.jsonl` のみ
- 変更禁止: `unitCatalog.ts`, `stages.ts`, `saveData.ts`, `GameScene.tsx`, `App.tsx`, `renderers/index.ts`
- 完了後: `npm run build` で成功確認 → `git push origin codex/spec-b-01`

### 優先度
P2

### 設計ステータス: READY ✅
