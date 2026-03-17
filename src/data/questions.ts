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

  // ════════ 算数 / 四則計算 (追加) ════════
  { id: "m006", main: "算数", sub: "四則計算", question: "999 + 1 = ?",                    choices: ["998","999","1000","1001"],          answer: "1000" },
  { id: "m007", main: "算数", sub: "四則計算", question: "15 × 15 = ?",                   choices: ["175","200","225","250"],            answer: "225" },
  { id: "m008", main: "算数", sub: "四則計算", question: "256 ÷ 16 = ?",                  choices: ["14","15","16","17"],                answer: "16" },
  { id: "m009", main: "算数", sub: "四則計算", question: "3³（3の3乗）= ?",               choices: ["9","18","27","36"],                 answer: "27" },
  { id: "m010", main: "算数", sub: "四則計算", question: "次のうち素数はどれ？",           choices: ["9","15","17","21"],                 answer: "17" },
  { id: "m011", main: "算数", sub: "四則計算", question: "7 + 8 × 2 = ?",                 choices: ["30","23","28","15"],                answer: "23" },
  { id: "m012", main: "算数", sub: "四則計算", question: "0.5 × 0.5 = ?",                 choices: ["1","0.5","0.25","0.1"],             answer: "0.25" },
  { id: "m013", main: "算数", sub: "四則計算", question: "1/3 + 1/6 = ?",                 choices: ["2/9","1/2","2/3","1/4"],            answer: "1/2" },
  { id: "m014", main: "算数", sub: "四則計算", question: "2¹⁰（2の10乗）= ?",             choices: ["512","1000","1024","2048"],         answer: "1024" },
  { id: "m015", main: "算数", sub: "四則計算", question: "48 ÷ 0.6 = ?",                  choices: ["28.8","60","72","80"],              answer: "80" },
  // ════════ 算数 / 図形・面積 (追加) ════════
  { id: "m106", main: "算数", sub: "図形・面積", question: "1辺6cmの立方体の体積は？",             choices: ["36cm³","108cm³","216cm³","256cm³"],          answer: "216cm³" },
  { id: "m107", main: "算数", sub: "図形・面積", question: "半径10cmの円の周の長さは？（π=3.14）", choices: ["31.4cm","62.8cm","94.2cm","314cm"],          answer: "62.8cm" },
  { id: "m108", main: "算数", sub: "図形・面積", question: "三角形の内角の和は？",                 choices: ["90度","180度","270度","360度"],               answer: "180度" },
  { id: "m109", main: "算数", sub: "図形・面積", question: "四角形の内角の和は？",                 choices: ["180度","270度","360度","540度"],              answer: "360度" },
  { id: "m110", main: "算数", sub: "図形・面積", question: "正三角形の1つの内角は？",              choices: ["45度","60度","90度","120度"],                 answer: "60度" },
  { id: "m111", main: "算数", sub: "図形・面積", question: "台形の面積の公式は？",                 choices: ["底辺×高さ","(上底+下底)×高さ÷2","底辺×高さ÷2","対角線×対角線÷2"], answer: "(上底+下底)×高さ÷2" },
  { id: "m112", main: "算数", sub: "図形・面積", question: "1辺10cmの正方形の面積は？",            choices: ["40cm²","50cm²","80cm²","100cm²"],            answer: "100cm²" },
  { id: "m113", main: "算数", sub: "図形・面積", question: "五角形の内角の和は？",                 choices: ["360度","450度","540度","720度"],              answer: "540度" },
  { id: "m114", main: "算数", sub: "図形・面積", question: "底面の半径3・高さ4の円柱の体積は？（π=3）", choices: ["36","72","108","144"],                  answer: "108" },
  { id: "m115", main: "算数", sub: "図形・面積", question: "平行四辺形の面積の公式は？",            choices: ["底辺＋高さ","底辺×高さ","底辺×高さ÷2","(底辺+斜辺)×高さ÷2"], answer: "底辺×高さ" },
  // ════════ 国語 / 漢字・読み (追加) ════════
  { id: "k006", main: "国語", sub: "漢字・読み", question: "「切磋琢磨」の読み方は？",  choices: ["せっさたくま","きっさたくま","せいさたくは","きりさみがき"],       answer: "せっさたくま" },
  { id: "k007", main: "国語", sub: "漢字・読み", question: "「傍若無人」の読み方は？",  choices: ["ぼうじゃくぶじん","ぼうにゃくぶにん","ほうじゃくむにん","ぼうじゃくむにん"], answer: "ぼうじゃくぶじん" },
  { id: "k008", main: "国語", sub: "漢字・読み", question: "「空前絶後」の読み方は？",  choices: ["くうぜんぜつご","そらまえきれうしろ","こうぜんぜつご","くうぜんたいご"],  answer: "くうぜんぜつご" },
  { id: "k009", main: "国語", sub: "漢字・読み", question: "「温故知新」の読み方は？",  choices: ["おんこちしん","おんこちあたらしい","ねつこちしん","おんこしんち"],        answer: "おんこちしん" },
  { id: "k010", main: "国語", sub: "漢字・読み", question: "「朝令暮改」の読み方は？",  choices: ["ちょうれいぼかい","あされいゆうかい","ちょうれいくれかい","あされいくれあらため"], answer: "ちょうれいぼかい" },
  { id: "k011", main: "国語", sub: "漢字・読み", question: "「画竜点睛」の読み方は？",  choices: ["がりょうてんせい","えりゅうてんめ","かりゅうてんせい","がりゅうてんきん"], answer: "がりょうてんせい" },
  { id: "k012", main: "国語", sub: "漢字・読み", question: "「百花繚乱」の読み方は？",  choices: ["ひゃっかりょうらん","ひゃっかかいらん","ひゃくかりょうらん","ひゃっかみだれる"], answer: "ひゃっかりょうらん" },
  { id: "k013", main: "国語", sub: "漢字・読み", question: "「慇懃無礼」の読み方は？",  choices: ["いんぎんぶれい","いんぎんむれい","おんきんぶれい","えんぎんむれい"],       answer: "いんぎんぶれい" },
  { id: "k014", main: "国語", sub: "漢字・読み", question: "「付和雷同」の読み方は？",  choices: ["ふわらいどう","ふかでんどう","ふわかみなり","つけわらいどう"],            answer: "ふわらいどう" },
  { id: "k015", main: "国語", sub: "漢字・読み", question: "「阿吽の呼吸」の読み方は？", choices: ["あうんのこきゅう","おんのこきゅう","あおんのこえ","あほんのむね"],        answer: "あうんのこきゅう" },
  // ════════ 国語 / 熟語・慣用句 (追加) ════════
  { id: "k106", main: "国語", sub: "熟語・慣用句", question: "「覆水盆に返らず」の意味は？",        choices: ["水をこぼした","一度したことは元に戻せない","チャンスは二度来る","失敗を恐れるな"], answer: "一度したことは元に戻せない" },
  { id: "k107", main: "国語", sub: "熟語・慣用句", question: "「猫に小判」の意味は？",              choices: ["猫は賢い","価値がわからない者に貴重なものを渡す","少しの努力で大成功","猫好きへの贈り物"], answer: "価値がわからない者に貴重なものを渡す" },
  { id: "k108", main: "国語", sub: "熟語・慣用句", question: "「石橋を叩いて渡る」の意味は？",      choices: ["無謀に行動する","慎重すぎて行動できない","念入りに確かめて行動する","石が好き"], answer: "念入りに確かめて行動する" },
  { id: "k109", main: "国語", sub: "熟語・慣用句", question: "「灯台下暗し」の意味は？",            choices: ["夜は危険","灯台は暗い","身近なことは意外と気づきにくい","明るい場所を選べ"], answer: "身近なことは意外と気づきにくい" },
  { id: "k110", main: "国語", sub: "熟語・慣用句", question: "「雨降って地固まる」の意味は？",      choices: ["雨は地面を固める","困難の後は安定する","雨が多い年は豊作","固い地面には雨が必要"], answer: "困難の後は安定する" },
  { id: "k111", main: "国語", sub: "熟語・慣用句", question: "「棚からぼた餅」の意味は？",          choices: ["棚が崩れた","努力が実った","思いがけない幸運","餅が好き"],               answer: "思いがけない幸運" },
  { id: "k112", main: "国語", sub: "熟語・慣用句", question: "「虎穴に入らずんば虎子を得ず」の意味は？", choices: ["虎は危険","危険を冒さなければ成功はない","虎の子を守れ","山に入るな"], answer: "危険を冒さなければ成功はない" },
  { id: "k113", main: "国語", sub: "熟語・慣用句", question: "「温故知新」の意味は？",              choices: ["昔に戻る","古いものを学び新しいことを知る","温かく付き合う","知識を温める"], answer: "古いものを学び新しいことを知る" },
  { id: "k114", main: "国語", sub: "熟語・慣用句", question: "「七転八倒」の意味は？",              choices: ["何度も転ぶ","激しく苦しむ","七回転んで八回起きる","転倒注意"],           answer: "激しく苦しむ" },
  { id: "k115", main: "国語", sub: "熟語・慣用句", question: "「急がば回れ」の意味は？",            choices: ["急いで行け","回り道が安全で早いこともある","急ぐと道に迷う","いつも急ぐべき"], answer: "回り道が安全で早いこともある" },
  // ════════ 理科 / 物理・化学 (追加) ════════
  { id: "s006", main: "理科", sub: "物理・化学", question: "電流の単位は？",                choices: ["ボルト(V)","ワット(W)","アンペア(A)","オーム(Ω)"],  answer: "アンペア(A)" },
  { id: "s007", main: "理科", sub: "物理・化学", question: "電圧の単位は？",                choices: ["アンペア(A)","ワット(W)","ボルト(V)","ヘルツ(Hz)"], answer: "ボルト(V)" },
  { id: "s008", main: "理科", sub: "物理・化学", question: "金の元素記号は？",              choices: ["Ag","Fe","Cu","Au"],                             answer: "Au" },
  { id: "s009", main: "理科", sub: "物理・化学", question: "NaCl は何の化学式？",          choices: ["砂糖","重曹","食塩","石灰"],                      answer: "食塩" },
  { id: "s010", main: "理科", sub: "物理・化学", question: "絶対零度は約何℃？",            choices: ["-100℃","-273℃","0℃","-500℃"],                   answer: "-273℃" },
  { id: "s011", main: "理科", sub: "物理・化学", question: "鉄が錆びる化学変化は？",        choices: ["還元","中和","酸化","分解"],                      answer: "酸化" },
  { id: "s012", main: "理科", sub: "物理・化学", question: "水素を燃やすと何ができる？",    choices: ["二酸化炭素","酸素","水","窒素"],                  answer: "水" },
  { id: "s013", main: "理科", sub: "物理・化学", question: "電力の単位は？",                choices: ["ボルト(V)","アンペア(A)","オーム(Ω)","ワット(W)"], answer: "ワット(W)" },
  { id: "s014", main: "理科", sub: "物理・化学", question: "酸素の元素記号は？",            choices: ["O2","Co","Ox","O"],                              answer: "O" },
  { id: "s015", main: "理科", sub: "物理・化学", question: "炭酸飲料に溶けている気体は？",  choices: ["酸素","水素","窒素","二酸化炭素"],                answer: "二酸化炭素" },
  // ════════ 理科 / 生物・地学 (追加) ════════
  { id: "s106", main: "理科", sub: "生物・地学", question: "地球の自転周期は？",                        choices: ["12時間","約24時間","約365日","約30日"],             answer: "約24時間" },
  { id: "s107", main: "理科", sub: "生物・地学", question: "地球の公転周期は？",                        choices: ["約30日","約90日","約365日","約10年"],              answer: "約365日" },
  { id: "s108", main: "理科", sub: "生物・地学", question: "植物の細胞にあってヒトの細胞にないものは？", choices: ["細胞膜","ミトコンドリア","核","葉緑体"],           answer: "葉緑体" },
  { id: "s109", main: "理科", sub: "生物・地学", question: "血液中で酸素を運ぶのは？",                  choices: ["白血球","血小板","血清","赤血球"],                 answer: "赤血球" },
  { id: "s110", main: "理科", sub: "生物・地学", question: "太陽の表面温度は約何℃？",                  choices: ["約1000℃","約3000℃","約6000℃","約1万℃"],        answer: "約6000℃" },
  { id: "s111", main: "理科", sub: "生物・地学", question: "無脊椎動物はどれ？",                       choices: ["カエル","サメ","ヘビ","タコ"],                     answer: "タコ" },
  { id: "s112", main: "理科", sub: "生物・地学", question: "光合成の産物は？",                          choices: ["二酸化炭素と水","窒素と水","酸素と二酸化炭素","酸素とデンプン"], answer: "酸素とデンプン" },
  { id: "s113", main: "理科", sub: "生物・地学", question: "マグマが冷えてできる岩石の種類は？",         choices: ["堆積岩","変成岩","礫岩","火成岩"],                answer: "火成岩" },
  { id: "s114", main: "理科", sub: "生物・地学", question: "地球の内側から外側への層の順は？",           choices: ["地殻→核→マントル","マントル→地殻→核","地殻→マントル→核","核→マントル→地殻"], answer: "核→マントル→地殻" },
  { id: "s115", main: "理科", sub: "生物・地学", question: "セキツイ動物でないのは？",                   choices: ["コウモリ","ペンギン","カメ","ヒトデ"],             answer: "ヒトデ" },
  // ════════ 社会 / 地理 (追加) ════════
  { id: "c006", main: "社会", sub: "地理", question: "日本で最も長い川は？",            choices: ["利根川","木曽川","吉野川","信濃川"],                    answer: "信濃川" },
  { id: "c007", main: "社会", sub: "地理", question: "世界で最も高い山は？",            choices: ["K2","マッキンリー","モンブラン","エベレスト"],           answer: "エベレスト" },
  { id: "c008", main: "社会", sub: "地理", question: "日本の国土面積は約何万km²？",     choices: ["18万","28万","38万","48万"],                           answer: "38万" },
  { id: "c009", main: "社会", sub: "地理", question: "日本で最も面積が小さい都道府県は？", choices: ["東京都","神奈川県","大阪府","香川県"],                answer: "香川県" },
  { id: "c010", main: "社会", sub: "地理", question: "太平洋で最も深い海溝は？",        choices: ["日本海溝","チリ海溝","アリューシャン海溝","マリアナ海溝"], answer: "マリアナ海溝" },
  { id: "c011", main: "社会", sub: "地理", question: "日本の南端の島は？",              choices: ["与那国島","南鳥島","宮古島","沖ノ鳥島"],               answer: "沖ノ鳥島" },
  { id: "c012", main: "社会", sub: "地理", question: "世界で最も大きな大陸は？",        choices: ["アフリカ大陸","南アメリカ大陸","北アメリカ大陸","ユーラシア大陸"], answer: "ユーラシア大陸" },
  { id: "c013", main: "社会", sub: "地理", question: "日本の東端の島は？",              choices: ["与那国島","沖ノ鳥島","択捉島","南鳥島"],               answer: "南鳥島" },
  { id: "c014", main: "社会", sub: "地理", question: "日本と地続きの国はいくつ？",      choices: ["0","1","2","3"],                                       answer: "0" },
  { id: "c015", main: "社会", sub: "地理", question: "国連に加盟している国の数は？（2023年頃）", choices: ["約150","約170","約193","約200"],               answer: "約193" },
  // ════════ 社会 / 歴史 (追加) ════════
  { id: "c106", main: "社会", sub: "歴史", question: "日本で最初の元号は？",               choices: ["明治","昭和","天武","大化"],                       answer: "大化" },
  { id: "c107", main: "社会", sub: "歴史", question: "関ヶ原の戦いが起きた年は？",         choices: ["1590年","1603年","1615年","1600年"],               answer: "1600年" },
  { id: "c108", main: "社会", sub: "歴史", question: "大化の改新が行われた年は？",         choices: ["593年","710年","794年","645年"],                   answer: "645年" },
  { id: "c109", main: "社会", sub: "歴史", question: "日清戦争が始まった年は？",           choices: ["1884年","1904年","1914年","1894年"],               answer: "1894年" },
  { id: "c110", main: "社会", sub: "歴史", question: "アメリカ独立宣言が出た年は？",       choices: ["1765年","1789年","1804年","1776年"],               answer: "1776年" },
  { id: "c111", main: "社会", sub: "歴史", question: "フランス革命が始まった年は？",       choices: ["1776年","1804年","1815年","1789年"],               answer: "1789年" },
  { id: "c112", main: "社会", sub: "歴史", question: "第一次世界大戦が始まった年は？",     choices: ["1910年","1912年","1918年","1914年"],               answer: "1914年" },
  { id: "c113", main: "社会", sub: "歴史", question: "日本が太平洋戦争に突入した年は？",   choices: ["1939年","1943年","1945年","1941年"],               answer: "1941年" },
  { id: "c114", main: "社会", sub: "歴史", question: "初代ローマ皇帝は誰？",              choices: ["カエサル","ネロ","ハンニバル","アウグストゥス"],     answer: "アウグストゥス" },
  { id: "c115", main: "社会", sub: "歴史", question: "コロンブスがアメリカに到達した年は？", choices: ["1388年","1452年","1522年","1492年"],             answer: "1492年" },
  // ════════ 英語 / 英単語 (追加) ════════
  { id: "e006", main: "英語", sub: "英単語", question: '"difficult" の意味は？',     choices: ["簡単な","楽しい","早い","難しい"],          answer: "難しい" },
  { id: "e007", main: "英語", sub: "英単語", question: '"immediately" の意味は？',   choices: ["ゆっくり","丁寧に","静かに","すぐに"],       answer: "すぐに" },
  { id: "e008", main: "英語", sub: "英単語", question: '"purchase" の意味は？',      choices: ["販売する","借りる","修理する","購入する"],   answer: "購入する" },
  { id: "e009", main: "英語", sub: "英単語", question: '"sustainable" の意味は？',   choices: ["速い","壊れやすい","厳しい","持続可能な"],   answer: "持続可能な" },
  { id: "e010", main: "英語", sub: "英単語", question: '"enhance" の意味は？',       choices: ["減らす","妨げる","変換する","向上させる"],   answer: "向上させる" },
  { id: "e011", main: "英語", sub: "英単語", question: '"consequence" の意味は？',   choices: ["原因","目的","方法","結果・影響"],           answer: "結果・影響" },
  { id: "e012", main: "英語", sub: "英単語", question: '"ambiguous" の意味は？',     choices: ["明確な","積極的な","意欲的な","曖昧な"],     answer: "曖昧な" },
  { id: "e013", main: "英語", sub: "英単語", question: '"frequently" の意味は？',    choices: ["めったに","一度だけ","たまに","頻繁に"],     answer: "頻繁に" },
  { id: "e014", main: "英語", sub: "英単語", question: '"enormous" の意味は？',      choices: ["小さな","普通の","軽い","巨大な"],           answer: "巨大な" },
  { id: "e015", main: "英語", sub: "英単語", question: '"volunteer" の意味は？',     choices: ["強制される","給料をもらう","参加を断る","自発的に参加する"], answer: "自発的に参加する" },
  // ════════ 英語 / 英文法 (追加) ════════
  { id: "e106", main: "英語", sub: "英文法", question: '"I ___ to school every day." の空欄は？', choices: ["goes","going","gone","go"],                   answer: "go" },
  { id: "e107", main: "英語", sub: "英文法", question: '"good" の最上級は？',                     choices: ["gooder","better","goodest","best"],            answer: "best" },
  { id: "e108", main: "英語", sub: "英文法", question: '"buy" の過去形は？',                      choices: ["buyed","buyd","boughted","bought"],            answer: "bought" },
  { id: "e109", main: "英語", sub: "英文法", question: "受動態の基本形は？",                      choices: ["do + 動詞","have + 過去分詞","will + 動詞","be動詞 + 過去分詞"], answer: "be動詞 + 過去分詞" },
  { id: "e110", main: "英語", sub: "英文法", question: '"He is taller ___ me." の空欄は？',       choices: ["as","of","from","than"],                       answer: "than" },
  { id: "e111", main: "英語", sub: "英文法", question: '"speak" の現在分詞は？',                  choices: ["speaked","spoke","speaken","speaking"],        answer: "speaking" },
  { id: "e112", main: "英語", sub: "英文法", question: '"I have lived here for 10 years." の時制は？', choices: ["過去形","過去進行形","未来形","現在完了"], answer: "現在完了" },
  { id: "e113", main: "英語", sub: "英文法", question: '"either A or B" の意味は？',               choices: ["AもBも","AでもなくBでもない","AとBの両方","AかBのどちらか"], answer: "AかBのどちらか" },
  { id: "e114", main: "英語", sub: "英文法", question: '"The book ___ read by her." の空欄は？',   choices: ["did","had","is going to","was"],               answer: "was" },
  { id: "e115", main: "英語", sub: "英文法", question: '"go" の過去形は？',                       choices: ["goed","gone","goes","went"],                   answer: "went" },
  // ════════ プログラミング / Web基礎 (追加) ════════
  { id: "p006", main: "プログラミング", sub: "Web基礎", question: "Flexboxで主軸方向を設定するプロパティは？",     choices: ["flex-wrap","align-items","justify-items","flex-direction"],       answer: "flex-direction" },
  { id: "p007", main: "プログラミング", sub: "Web基礎", question: "HTTPSの「S」は何の略？",                     choices: ["Speed","Simple","Standard","Secure"],                            answer: "Secure" },
  { id: "p008", main: "プログラミング", sub: "Web基礎", question: "DOMの正式名称は？",                         choices: ["Dynamic Object Mode","Data Output Method","Direct Object Map","Document Object Model"], answer: "Document Object Model" },
  { id: "p009", main: "プログラミング", sub: "Web基礎", question: "CSSのボックスモデルで外側から順番は？",       choices: ["content→padding→border→margin","padding→margin→content→border","border→content→padding→margin","margin→border→padding→content"], answer: "margin→border→padding→content" },
  { id: "p010", main: "プログラミング", sub: "Web基礎", question: "JavaScriptでHTMLの要素を取得するメソッドは？", choices: ["getElement()","selectById()","findElement()","getElementById()"],  answer: "getElementById()" },
  { id: "p011", main: "プログラミング", sub: "Web基礎", question: "HTMLで画像を表示するタグは？",               choices: ["<image>","<photo>","<picture>","<img>"],                          answer: "<img>" },
  { id: "p012", main: "プログラミング", sub: "Web基礎", question: "CSSでflex要素を横方向中央にするプロパティは？", choices: ["align-items: center","text-align: center","flex-align: center","justify-content: center"], answer: "justify-content: center" },
  { id: "p013", main: "プログラミング", sub: "Web基礎", question: "JavaScriptのfetch()が返すのは？",            choices: ["String","Array","Object","Promise"],                             answer: "Promise" },
  { id: "p014", main: "プログラミング", sub: "Web基礎", question: "レスポンシブデザインに使うCSSの仕組みは？",   choices: ["Flexbox","アニメーション","float","メディアクエリ"],              answer: "メディアクエリ" },
  { id: "p015", main: "プログラミング", sub: "Web基礎", question: "GitHubとは何のサービス？",                   choices: ["クラウドストレージ","メールサービス","タスク管理ツール","Gitリポジトリホスティング"], answer: "Gitリポジトリホスティング" },
  // ════════ プログラミング / Java Bronze (追加) ════════
  { id: "jb09", main: "プログラミング", sub: "Java Bronze", question: "Javaで配列を宣言する方法は？",                    choices: ["int arr = new int[5]","int arr[5]","Array<int> arr = new Array(5)","int[] arr = new int[5]"],   answer: "int[] arr = new int[5]" },
  { id: "jb10", main: "プログラミング", sub: "Java Bronze", question: "Javaのswitch文で各ケースを終えるキーワードは？",    choices: ["end","stop","exit","break"],                                                                       answer: "break" },
  { id: "jb11", main: "プログラミング", sub: "Java Bronze", question: "Javaでオブジェクトを生成するキーワードは？",         choices: ["create","make","build","new"],                                                                     answer: "new" },
  { id: "jb12", main: "プログラミング", sub: "Java Bronze", question: "Javaのfinalを変数に付けると？",                    choices: ["値が2倍になる","nullになる","エラーが出る","再代入できなくなる"],                                    answer: "再代入できなくなる" },
  { id: "jb13", main: "プログラミング", sub: "Java Bronze", question: "Javaのコンストラクタの特徴は？",                    choices: ["戻り値がvoid","クラス名と異なる名前","staticである","戻り値の型宣言なし"],                           answer: "戻り値の型宣言なし" },
  { id: "jb14", main: "プログラミング", sub: "Java Bronze", question: "Javaのchar型が表すのは？",                         choices: ["整数","論理値","小数","1文字（Unicode）"],                                                         answer: "1文字（Unicode）" },
  { id: "jb15", main: "プログラミング", sub: "Java Bronze", question: "クラスの外からもアクセス可能なアクセス修飾子は？",   choices: ["private","protected","package-private","public"],                                                  answer: "public" },
  { id: "jb16", main: "プログラミング", sub: "Java Bronze", question: "Javaのdo-while文の特徴は？",                       choices: ["最初から条件チェック","繰り返し回数固定","条件式が不要","必ず1回は実行される"],                      answer: "必ず1回は実行される" },
  { id: "jb17", main: "プログラミング", sub: "Java Bronze", question: "Javaでコメント（複数行）を書く記法は？",            choices: ["// ...","# ...","-- ...","/* ... */"],                                                             answer: "/* ... */" },
  { id: "jb18", main: "プログラミング", sub: "Java Bronze", question: "Javaのboolean型が取れる値は？",                    choices: ["0と1","yesとno","onとoff","trueとfalse"],                                                          answer: "trueとfalse" },
  // ════════ プログラミング / Java Silver (追加) ════════
  { id: "js09", main: "プログラミング", sub: "Java Silver", question: "ジェネリクスの主な目的は？",                           choices: ["処理を高速化する","スレッドを管理する","メモリを節約する","型安全なコレクション操作"],          answer: "型安全なコレクション操作" },
  { id: "js10", main: "プログラミング", sub: "Java Silver", question: "Java の String と StringBuilder の違いは？",          choices: ["Stringは可変、SBは不変","どちらも不変","どちらも可変","Stringは不変、SBは可変"],              answer: "Stringは不変、SBは可変" },
  { id: "js11", main: "プログラミング", sub: "Java Silver", question: "HashMap で重複キーを put すると？",                    choices: ["例外が発生","値が無視される","リストに追加される","値が上書きされる"],                          answer: "値が上書きされる" },
  { id: "js12", main: "プログラミング", sub: "Java Silver", question: "Javaの例外クラスの最上位は？",                         choices: ["Exception","Error","RuntimeException","Throwable"],                                            answer: "Throwable" },
  { id: "js13", main: "プログラミング", sub: "Java Silver", question: "インターフェースで宣言したフィールドは暗黙的に何になる？", choices: ["private","protected","package-private","public static final"],                             answer: "public static final" },
  { id: "js14", main: "プログラミング", sub: "Java Silver", question: "var キーワードの用途は？（Java 10+）",                  choices: ["定数の宣言","クラスの宣言","引数の型指定","ローカル変数の型推論"],                            answer: "ローカル変数の型推論" },
  { id: "js15", main: "プログラミング", sub: "Java Silver", question: "Comparable インターフェースの抽象メソッドは？",          choices: ["equals()","hashCode()","compare()","compareTo()"],                                             answer: "compareTo()" },
  { id: "js16", main: "プログラミング", sub: "Java Silver", question: "拡張for文（for-each）が使えるのは？",                  choices: ["クラスのみ","配列のみ","Iterableのみ","配列とIterable実装クラス"],                             answer: "配列とIterable実装クラス" },
  { id: "js17", main: "プログラミング", sub: "Java Silver", question: "ガベージコレクションが解放するのは？",                   choices: ["すべての変数","スタティック変数","定数","参照されなくなったオブジェクト"],                    answer: "参照されなくなったオブジェクト" },
  { id: "js18", main: "プログラミング", sub: "Java Silver", question: "チェック例外の特徴は？",                               choices: ["実行時のみ発生","RuntimeExceptionの子クラス","catchできない","コンパイル時に処理が強制される"], answer: "コンパイル時に処理が強制される" },
  // ════════ プログラミング / Java Gold (追加) ════════
  { id: "jg09", main: "プログラミング", sub: "Java Gold", question: "ExecutorService の主な用途は？",                        choices: ["ファイル操作","DB接続","UIの更新","スレッドプールの管理"],                                     answer: "スレッドプールの管理" },
  { id: "jg10", main: "プログラミング", sub: "Java Gold", question: "Stream の中間操作はどれ？",                             choices: ["collect()","forEach()","count()","filter()"],                                                   answer: "filter()" },
  { id: "jg11", main: "プログラミング", sub: "Java Gold", question: "Predicate<T> の抽象メソッドは？",                       choices: ["apply(T t)","accept(T t)","get()","test(T t)"],                                                 answer: "test(T t)" },
  { id: "jg12", main: "プログラミング", sub: "Java Gold", question: "ReentrantLock の特徴は？",                              choices: ["再入不可のロック","読み取り専用ロック","自動解放ロック","再入可能なロック"],                   answer: "再入可能なロック" },
  { id: "jg13", main: "プログラミング", sub: "Java Gold", question: "Moduleシステムが導入されたJavaバージョンは？",            choices: ["Java 8","Java 11","Java 14","Java 9"],                                                          answer: "Java 9" },
  { id: "jg14", main: "プログラミング", sub: "Java Gold", question: "Optional の orElseGet() の特徴は？",                    choices: ["値が存在しないと例外","常に引数を評価","orElse()と全く同じ","値がないときだけ引数を評価（遅延評価）"], answer: "値がないときだけ引数を評価（遅延評価）" },
  { id: "jg15", main: "プログラミング", sub: "Java Gold", question: "CompletableFuture.thenApply() の役割は？",               choices: ["例外を処理する","タスクを並列実行","完了を待つ","結果を変換して次に渡す"],                     answer: "結果を変換して次に渡す" },
  { id: "jg16", main: "プログラミング", sub: "Java Gold", question: "Java の record クラスが正式導入されたバージョンは？",      choices: ["Java 11","Java 14","Java 17","Java 16"],                                                        answer: "Java 16" },
  { id: "jg17", main: "プログラミング", sub: "Java Gold", question: "switch 式（ラムダ形式 →）が正式導入されたバージョンは？",  choices: ["Java 12","Java 13","Java 15","Java 14"],                                                        answer: "Java 14" },
  { id: "jg18", main: "プログラミング", sub: "Java Gold", question: "sealed クラスが正式導入されたJavaバージョンは？",          choices: ["Java 15","Java 16","Java 18","Java 17"],                                                        answer: "Java 17" },
];
