// ── メインカテゴリ ──────────────────────────────────────────
export type MainCategory = "算数" | "国語" | "理科" | "社会" | "英語" | "プログラミング";

// ── サブカテゴリ定義 ────────────────────────────────────────
export interface SubCategoryDef {
  main: MainCategory;
  name: string;
  emoji: string;
  color: string;
  desc: string;
}

export const MAIN_CATEGORY_META: Record<MainCategory, { emoji: string; color: string }> = {
  算数:         { emoji: "🔢", color: "#3b82f6" },
  国語:         { emoji: "📖", color: "#a855f7" },
  理科:         { emoji: "🔬", color: "#10b981" },
  社会:         { emoji: "🌍", color: "#f59e0b" },
  英語:         { emoji: "🇬🇧", color: "#ef4444" },
  プログラミング: { emoji: "💻", color: "#06b6d4" },
};

export const SUB_CATEGORIES: SubCategoryDef[] = [
  // 算数
  { main: "算数",         name: "四則計算",     emoji: "➕", color: "#3b82f6", desc: "足し算・引き算・掛け算・割り算" },
  { main: "算数",         name: "図形・面積",   emoji: "📐", color: "#60a5fa", desc: "面積・体積・図形の性質" },
  // 国語
  { main: "国語",         name: "漢字・読み",   emoji: "漢", color: "#a855f7", desc: "漢字の読み書き" },
  { main: "国語",         name: "熟語・慣用句", emoji: "📝", color: "#c084fc", desc: "四字熟語・慣用句・ことわざ" },
  // 理科
  { main: "理科",         name: "物理・化学",   emoji: "⚗️", color: "#10b981", desc: "光・音・電気・化学式" },
  { main: "理科",         name: "生物・地学",   emoji: "🌿", color: "#34d399", desc: "動植物・地球・宇宙" },
  // 社会
  { main: "社会",         name: "地理",         emoji: "🗾", color: "#f59e0b", desc: "日本と世界の地理" },
  { main: "社会",         name: "歴史",         emoji: "🏯", color: "#fbbf24", desc: "日本史・世界史" },
  // 英語
  { main: "英語",         name: "英単語",       emoji: "🔤", color: "#ef4444", desc: "単語の意味・用法" },
  { main: "英語",         name: "英文法",       emoji: "📏", color: "#f87171", desc: "文法・語形変化" },
  // プログラミング
  { main: "プログラミング", name: "Web基礎",     emoji: "🌐", color: "#06b6d4", desc: "HTML/CSS/JavaScript入門" },
  { main: "プログラミング", name: "Java Bronze", emoji: "☕", color: "#f97316", desc: "Javaの基礎文法・オブジェクト指向入門" },
  { main: "プログラミング", name: "Java Silver", emoji: "🥈", color: "#94a3b8", desc: "Java SE開発者向け中級" },
  { main: "プログラミング", name: "Java Gold",   emoji: "🥇", color: "#fbbf24", desc: "Java SE開発者向け上級" },
];

// ── 問題型 ────────────────────────────────────────────────
export interface Question {
  id: string;
  main: MainCategory;
  sub: string;      // SUB_CATEGORIES[n].name と一致
  question: string;
  choices: string[];
  answer: string;
}

// ── 問題データ ────────────────────────────────────────────
export const questions: Question[] = [
  // ════════ 算数 / 四則計算 ════════
  { id: "m001", main: "算数", sub: "四則計算", question: "2 + 2 = ?",         choices: ["3","4","5","6"],                 answer: "4" },
  { id: "m002", main: "算数", sub: "四則計算", question: "7 × 8 = ?",         choices: ["54","56","58","64"],              answer: "56" },
  { id: "m003", main: "算数", sub: "四則計算", question: "100 ÷ 4 = ?",       choices: ["20","25","30","40"],              answer: "25" },
  { id: "m004", main: "算数", sub: "四則計算", question: "12 × 12 = ?",       choices: ["124","132","144","148"],          answer: "144" },
  { id: "m005", main: "算数", sub: "四則計算", question: "1から10の合計は？",   choices: ["45","50","55","60"],              answer: "55" },
  // ════════ 算数 / 図形・面積 ════════
  { id: "m101", main: "算数", sub: "図形・面積", question: "√144 = ?",                    choices: ["10","11","12","13"],          answer: "12" },
  { id: "m102", main: "算数", sub: "図形・面積", question: "3² + 4² = ?",                  choices: ["25","49","14","7"],           answer: "25" },
  { id: "m103", main: "算数", sub: "図形・面積", question: "半径5cmの円の面積は？（π=3.14）", choices: ["78.5","15.7","31.4","62.8"],  answer: "78.5" },
  { id: "m104", main: "算数", sub: "図形・面積", question: "底辺8・高さ5の三角形の面積は？",  choices: ["13","20","40","80"],          answer: "20" },
  { id: "m105", main: "算数", sub: "図形・面積", question: "正方形の対角線の数は？",          choices: ["1","2","3","4"],              answer: "2" },
  // ════════ 国語 / 漢字・読み ════════
  { id: "k001", main: "国語", sub: "漢字・読み", question: "「危機一髪」の読み方は？",  choices: ["ききいっぱつ","ikikippatsu","fikifatsu","ikikihatu"], answer: "ききいっぱつ" },
  { id: "k002", main: "国語", sub: "漢字・読み", question: "「晴耕雨読」の読み方は？", choices: ["せいこううどく","せいこうあめよみ","はれたがやし","てんこうあめ"],  answer: "せいこううどく" },
  { id: "k003", main: "国語", sub: "漢字・読み", question: "「以心伝心」の読み方は？", choices: ["いしんでんしん","いごころでんこ","いしんつたわる","いごこでんわ"],   answer: "いしんでんしん" },
  { id: "k004", main: "国語", sub: "漢字・読み", question: "「臨機応変」の読み方は？", choices: ["りんきおうへん","りんきへんおう","きんりおうへん","りんきおうかん"], answer: "りんきおうへん" },
  { id: "k005", main: "国語", sub: "漢字・読み", question: "「一石二鳥」の読み方は？", choices: ["いっせきにちょう","いちいしにとり","いっせきにとり","ひとついしふたとり"], answer: "いっせきにちょう" },
  // ════════ 国語 / 熟語・慣用句 ════════
  { id: "k101", main: "国語", sub: "熟語・慣用句", question: "「一期一会」の意味は？",          choices: ["一生に一度の出会い","長い友情","再会を喜ぶ","旅の楽しみ"],              answer: "一生に一度の出会い" },
  { id: "k102", main: "国語", sub: "熟語・慣用句", question: "「敷居が高い」の正しい意味は？",  choices: ["高級すぎる","段差が大きい","不義理があり行きにくい","門が高い"],        answer: "不義理があり行きにくい" },
  { id: "k103", main: "国語", sub: "熟語・慣用句", question: "「焼け石に水」の意味は？",        choices: ["少しの努力は無駄","熱心に努力する","石を温める","大河になる"],           answer: "少しの努力は無駄" },
  { id: "k104", main: "国語", sub: "熟語・慣用句", question: "「七転び八起き」の意味は？",      choices: ["何度失敗しても立ち上がる","毎日転ぶ","幸運が続く","危険を冒す"],         answer: "何度失敗しても立ち上がる" },
  { id: "k105", main: "国語", sub: "熟語・慣用句", question: "「情けは人の為ならず」の意味は？",choices: ["情けは自分に返る","情けは損","人を助けるな","困ったら聞け"],              answer: "情けは自分に返る" },
  // ════════ 理科 / 物理・化学 ════════
  { id: "s001", main: "理科", sub: "物理・化学", question: "光の速さは約何km/s？",   choices: ["30万","3万","300万","3000"], answer: "30万" },
  { id: "s002", main: "理科", sub: "物理・化学", question: "水の化学式は？",         choices: ["H2O","CO2","O2","H2"],       answer: "H2O" },
  { id: "s003", main: "理科", sub: "物理・化学", question: "ダイヤモンドの主成分は？", choices: ["シリコン","炭素","鉄","アルミ"],  answer: "炭素" },
  { id: "s004", main: "理科", sub: "物理・化学", question: "音の速さ（空気中）は約何m/s？", choices: ["340","150","1500","3000"],  answer: "340" },
  { id: "s005", main: "理科", sub: "物理・化学", question: "元素記号 Fe は何？",      choices: ["フッ素","鉄","鉛","銀"],       answer: "鉄" },
  // ════════ 理科 / 生物・地学 ════════
  { id: "s101", main: "理科", sub: "生物・地学", question: "人間の体で最も大きい臓器は？",       choices: ["心臓","肝臓","肺","皮膚"],       answer: "皮膚" },
  { id: "s102", main: "理科", sub: "生物・地学", question: "光合成で植物が吸収するのは？",       choices: ["酸素","窒素","二酸化炭素","水蒸気"], answer: "二酸化炭素" },
  { id: "s103", main: "理科", sub: "生物・地学", question: "地球から月までの平均距離は約何万km？", choices: ["38万","15万","100万","50万"],  answer: "38万" },
  { id: "s104", main: "理科", sub: "生物・地学", question: "地球の大気で最も多い気体は？",       choices: ["酸素","窒素","二酸化炭素","アルゴン"], answer: "窒素" },
  { id: "s105", main: "理科", sub: "生物・地学", question: "ヒトの染色体の本数は？",             choices: ["23本","46本","92本","24本"],  answer: "46本" },
  // ════════ 社会 / 地理 ════════
  { id: "c001", main: "社会", sub: "地理", question: "日本の首都は？",                choices: ["大阪","東京","京都","名古屋"],           answer: "東京" },
  { id: "c002", main: "社会", sub: "地理", question: "世界で一番長い川は？",            choices: ["アマゾン川","ナイル川","長江","ミシシッピ川"], answer: "ナイル川" },
  { id: "c003", main: "社会", sub: "地理", question: "世界で最も人口が多い国は？",      choices: ["アメリカ","インド","中国","ブラジル"],   answer: "インド" },
  { id: "c004", main: "社会", sub: "地理", question: "日本で最も面積が大きい都道府県は？", choices: ["北海道","岩手県","長野県","福島県"],   answer: "北海道" },
  { id: "c005", main: "社会", sub: "地理", question: "国際連合の本部がある都市は？",    choices: ["ジュネーブ","ワシントン","ニューヨーク","パリ"], answer: "ニューヨーク" },
  // ════════ 社会 / 歴史 ════════
  { id: "c101", main: "社会", sub: "歴史", question: "第二次世界大戦が終わった年は？",     choices: ["1943","1944","1945","1946"],       answer: "1945" },
  { id: "c102", main: "社会", sub: "歴史", question: "江戸幕府を開いたのは誰？",          choices: ["豊臣秀吉","徳川家康","織田信長","足利尊氏"], answer: "徳川家康" },
  { id: "c103", main: "社会", sub: "歴史", question: "大日本帝国憲法が公布された年は？",   choices: ["1868","1889","1912","1945"],       answer: "1889" },
  { id: "c104", main: "社会", sub: "歴史", question: "明治維新が始まった年は？",          choices: ["1853","1868","1889","1912"],       answer: "1868" },
  { id: "c105", main: "社会", sub: "歴史", question: "ペリーが来航した年は？",            choices: ["1840","1853","1867","1871"],       answer: "1853" },
  // ════════ 英語 / 英単語 ════════
  { id: "e001", main: "英語", sub: "英単語", question: '"apple" の日本語は？',        choices: ["みかん","りんご","ぶどう","もも"],       answer: "りんご" },
  { id: "e002", main: "英語", sub: "英単語", question: '"beautiful" の反意語は？',    choices: ["ugly","small","old","slow"],           answer: "ugly" },
  { id: "e003", main: "英語", sub: "英単語", question: '"I am hungry" の意味は？',    choices: ["眠い","楽しい","お腹が空いた","怒っている"], answer: "お腹が空いた" },
  { id: "e004", main: "英語", sub: "英単語", question: '"environment" の意味は？',    choices: ["娯楽","環境","教育","感情"],             answer: "環境" },
  { id: "e005", main: "英語", sub: "英単語", question: '"collaborate" の意味は？',    choices: ["競争する","協力する","妨害する","分離する"], answer: "協力する" },
  // ════════ 英語 / 英文法 ════════
  { id: "e101", main: "英語", sub: "英文法", question: '"run" の過去形は？',                       choices: ["runned","ran","ranned","running"],      answer: "ran" },
  { id: "e102", main: "英語", sub: "英文法", question: '"She ___ a doctor." に入る動詞は？',        choices: ["am","are","is","be"],                 answer: "is" },
  { id: "e103", main: "英語", sub: "英文法", question: '"big" の比較級は？',                       choices: ["biger","bigger","most big","more big"], answer: "bigger" },
  { id: "e104", main: "英語", sub: "英文法", question: '"Where are you from?" の意味は？',         choices: ["どこへ行く？","出身はどこ？","何をしている？","元気？"], answer: "出身はどこ？" },
  { id: "e105", main: "英語", sub: "英文法", question: '"Thank you" への返答は？',                 choices: ["Yes, I do.","You're welcome.","Nice to meet you.","I'm fine."], answer: "You're welcome." },
  // ════════ プログラミング / Web基礎 ════════
  { id: "p001", main: "プログラミング", sub: "Web基礎", question: "HTML の略は？",                 choices: ["HyperText Markup Language","High Tech Modern","HyperText Modern Link","High Text Markup"],  answer: "HyperText Markup Language" },
  { id: "p002", main: "プログラミング", sub: "Web基礎", question: "CSS で文字色を変えるプロパティは？", choices: ["font-color","text-color","color","font-style"], answer: "color" },
  { id: "p003", main: "プログラミング", sub: "Web基礎", question: "HTTP のデフォルトポート番号は？",  choices: ["21","443","80","8080"],               answer: "80" },
  { id: "p004", main: "プログラミング", sub: "Web基礎", question: "JSON の正式名称は？",            choices: ["JavaScript Object Notation","Java Standard Object","JavaScript Online Network","Java Source Object"], answer: "JavaScript Object Notation" },
  { id: "p005", main: "プログラミング", sub: "Web基礎", question: "JavaScript で配列の長さを得るプロパティは？", choices: ["size","count","length","len"], answer: "length" },
  // ════════ プログラミング / Java Bronze ════════
  { id: "jb01", main: "プログラミング", sub: "Java Bronze", question: "Javaのソースファイルの拡張子は？",     choices: [".js",".java",".class",".jar"],                        answer: ".java" },
  { id: "jb02", main: "プログラミング", sub: "Java Bronze", question: "Javaでクラスを定義するキーワードは？", choices: ["struct","class","object","define"],                   answer: "class" },
  { id: "jb03", main: "プログラミング", sub: "Java Bronze", question: "Javaで整数を扱う基本データ型は？",    choices: ["Integer","number","int","integer"],                   answer: "int" },
  { id: "jb04", main: "プログラミング", sub: "Java Bronze", question: "Javaの標準出力メソッドは？",         choices: ["console.log()","print()","System.out.println()","echo()"], answer: "System.out.println()" },
  { id: "jb05", main: "プログラミング", sub: "Java Bronze", question: "Javaでmainメソッドの戻り値の型は？",  choices: ["int","String","void","boolean"],                      answer: "void" },
  { id: "jb06", main: "プログラミング", sub: "Java Bronze", question: "Javaで文字列型を表すクラスは？",      choices: ["char","str","String","Text"],                         answer: "String" },
  { id: "jb07", main: "プログラミング", sub: "Java Bronze", question: "Javaのfor文で使うキーワードは？",    choices: ["loop","repeat","for","each"],                         answer: "for" },
  { id: "jb08", main: "プログラミング", sub: "Java Bronze", question: "Javaでif文のelse ifに相当するキーワードは？", choices: ["elif","elseif","else if","otherwise"],           answer: "else if" },
  // ════════ プログラミング / Java Silver ════════
  { id: "js01", main: "プログラミング", sub: "Java Silver", question: "インターフェースを実装するキーワードは？",       choices: ["extends","implements","inherits","uses"],             answer: "implements" },
  { id: "js02", main: "プログラミング", sub: "Java Silver", question: "抽象クラスを定義するキーワードは？",             choices: ["abstract","interface","virtual","base"],              answer: "abstract" },
  { id: "js03", main: "プログラミング", sub: "Java Silver", question: "オーバーライドを示すアノテーションは？",          choices: ["@Overload","@Override","@Super","@Virtual"],          answer: "@Override" },
  { id: "js04", main: "プログラミング", sub: "Java Silver", question: "動的にサイズが変わるリストクラスは？",           choices: ["Array","LinkedList","ArrayList","DynamicArray"],      answer: "ArrayList" },
  { id: "js05", main: "プログラミング", sub: "Java Silver", question: "例外を捕捉するキーワードの組み合わせは？",       choices: ["try-catch","begin-rescue","error-handle","check-fix"], answer: "try-catch" },
  { id: "js06", main: "プログラミング", sub: "Java Silver", question: "クラスの継承を表すキーワードは？",               choices: ["implements","inherits","extends","using"],             answer: "extends" },
  { id: "js07", main: "プログラミング", sub: "Java Silver", question: "nullポインタ例外のクラス名は？",                 choices: ["NullError","NullPointerException","NullException","NullRef"], answer: "NullPointerException" },
  { id: "js08", main: "プログラミング", sub: "Java Silver", question: "Javaでstaticメソッドを呼ぶ方法は？",           choices: ["インスタンスから呼ぶ","クラス名.メソッド名()","newして呼ぶ","super()で呼ぶ"], answer: "クラス名.メソッド名()" },
  // ════════ プログラミング / Java Gold ════════
  { id: "jg01", main: "プログラミング", sub: "Java Gold", question: "ラムダ式が使える型の総称は？",                     choices: ["LambdaType","FunctionalInterface","AnonymousClass","AbstractType"], answer: "FunctionalInterface" },
  { id: "jg02", main: "プログラミング", sub: "Java Gold", question: "Stream APIでフィルタリングするメソッドは？",        choices: ["where()","select()","filter()","find()"],              answer: "filter()" },
  { id: "jg03", main: "プログラミング", sub: "Java Gold", question: "スレッドセーフなArrayListの代替クラスは？",         choices: ["SynchronizedList","ConcurrentList","CopyOnWriteArrayList","SafeArrayList"], answer: "CopyOnWriteArrayList" },
  { id: "jg04", main: "プログラミング", sub: "Java Gold", question: "Optional クラスの主な用途は？",                   choices: ["高速化","nullポインタ例外の回避","スレッド管理","メモリ削減"],           answer: "nullポインタ例外の回避" },
  { id: "jg05", main: "プログラミング", sub: "Java Gold", question: "共有リソースを1スレッドのみアクセス可にするキーワードは？", choices: ["volatile","synchronized","atomic","exclusive"],       answer: "synchronized" },
  { id: "jg06", main: "プログラミング", sub: "Java Gold", question: "Stream APIで要素を変換するメソッドは？",            choices: ["convert()","transform()","map()","apply()"],          answer: "map()" },
  { id: "jg07", main: "プログラミング", sub: "Java Gold", question: "Java 8で導入されたデフォルトメソッドが定義できるのは？", choices: ["class","abstract class","interface","enum"],         answer: "interface" },
  { id: "jg08", main: "プログラミング", sub: "Java Gold", question: "CompletableFutureが属するパッケージは？",           choices: ["java.util","java.concurrent","java.util.concurrent","java.thread"], answer: "java.util.concurrent" },
];
