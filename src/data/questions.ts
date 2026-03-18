// ── メインカテゴリ ──────────────────────────────────────────
export type MainCategory = "算数" | "国語" | "理科" | "社会" | "英語" | "プログラミング";

// ── 難易度レベル定義 ────────────────────────────────────────
export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const LEVEL_DEFS: { level: Level; label: string; emoji: string; color: string; desc: string }[] = [
  { level: 1,  label: "小学1年生",  emoji: "🌱", color: "#86efac", desc: "小学1年生レベル" },
  { level: 2,  label: "小学2年生",  emoji: "🌱", color: "#4ade80", desc: "小学2年生レベル" },
  { level: 3,  label: "小学3年生",  emoji: "🌿", color: "#22c55e", desc: "小学3年生レベル" },
  { level: 4,  label: "小学4年生",  emoji: "🌿", color: "#16a34a", desc: "小学4年生レベル" },
  { level: 5,  label: "小学5年生",  emoji: "🍀", color: "#15803d", desc: "小学5年生レベル" },
  { level: 6,  label: "小学6年生",  emoji: "🍀", color: "#166534", desc: "小学6年生レベル" },
  { level: 7,  label: "中学生",     emoji: "📘", color: "#60a5fa", desc: "中学校レベル" },
  { level: 8,  label: "高校生",     emoji: "📗", color: "#f59e0b", desc: "高校レベル" },
  { level: 9,  label: "大学・一般", emoji: "🎓", color: "#f97316", desc: "大学・社会人" },
  { level: 10, label: "専門知識",   emoji: "🔬", color: "#ef4444", desc: "資格・専門分野" },
];

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
  level: Level;
  question: string;
  choices: string[];
  answer: string;
}

// ── 問題データ ────────────────────────────────────────────
export const questions: Question[] = [
  // ════════ 算数 / 四則計算 ════════
  { id: "m001", main: "算数", sub: "四則計算", level: 1, question: "2 + 2 = ?",         choices: ["3","4","5","6"],                 answer: "4" },
  { id: "m002", main: "算数", sub: "四則計算", level: 2, question: "7 × 8 = ?",         choices: ["54","56","58","64"],              answer: "56" },
  { id: "m003", main: "算数", sub: "四則計算", level: 3, question: "100 ÷ 4 = ?",       choices: ["20","25","30","40"],              answer: "25" },
  { id: "m004", main: "算数", sub: "四則計算", level: 3, question: "12 × 12 = ?",       choices: ["124","132","144","148"],          answer: "144" },
  { id: "m005", main: "算数", sub: "四則計算", level: 7, question: "1から10の合計は？",   choices: ["45","50","55","60"],              answer: "55" },
  // ════════ 算数 / 図形・面積 ════════
  { id: "m101", main: "算数", sub: "図形・面積", level: 8, question: "√144 = ?",                    choices: ["10","11","12","13"],          answer: "12" },
  { id: "m102", main: "算数", sub: "図形・面積", level: 7, question: "3² + 4² = ?",                  choices: ["25","49","14","7"],           answer: "25" },
  { id: "m103", main: "算数", sub: "図形・面積", level: 7, question: "半径5cmの円の面積は？（π=3.14）", choices: ["78.5","15.7","31.4","62.8"],  answer: "78.5" },
  { id: "m104", main: "算数", sub: "図形・面積", level: 4, question: "底辺8・高さ5の三角形の面積は？",  choices: ["13","20","40","80"],          answer: "20" },
  { id: "m105", main: "算数", sub: "図形・面積", level: 3, question: "正方形の対角線の数は？",          choices: ["1","2","3","4"],              answer: "2" },
  // ════════ 国語 / 漢字・読み ════════
  { id: "k001", main: "国語", sub: "漢字・読み", level: 7, question: "「危機一髪」の読み方は？",  choices: ["ききいっぱつ","ikikippatsu","fikifatsu","ikikihatu"], answer: "ききいっぱつ" },
  { id: "k002", main: "国語", sub: "漢字・読み", level: 8, question: "「晴耕雨読」の読み方は？", choices: ["せいこううどく","せいこうあめよみ","はれたがやし","てんこうあめ"],  answer: "せいこううどく" },
  { id: "k003", main: "国語", sub: "漢字・読み", level: 7, question: "「以心伝心」の読み方は？", choices: ["いしんでんしん","いごころでんこ","いしんつたわる","いごこでんわ"],   answer: "いしんでんしん" },
  { id: "k004", main: "国語", sub: "漢字・読み", level: 8, question: "「臨機応変」の読み方は？", choices: ["りんきおうへん","りんきへんおう","きんりおうへん","りんきおうかん"], answer: "りんきおうへん" },
  { id: "k005", main: "国語", sub: "漢字・読み", level: 4, question: "「一石二鳥」の読み方は？", choices: ["いっせきにちょう","いちいしにとり","いっせきにとり","ひとついしふたとり"], answer: "いっせきにちょう" },
  // ════════ 国語 / 熟語・慣用句 ════════
  { id: "k101", main: "国語", sub: "熟語・慣用句", level: 7, question: "「一期一会」の意味は？",          choices: ["一生に一度の出会い","長い友情","再会を喜ぶ","旅の楽しみ"],              answer: "一生に一度の出会い" },
  { id: "k102", main: "国語", sub: "熟語・慣用句", level: 8, question: "「敷居が高い」の正しい意味は？",  choices: ["高級すぎる","段差が大きい","不義理があり行きにくい","門が高い"],        answer: "不義理があり行きにくい" },
  { id: "k103", main: "国語", sub: "熟語・慣用句", level: 7, question: "「焼け石に水」の意味は？",        choices: ["少しの努力は無駄","熱心に努力する","石を温める","大河になる"],           answer: "少しの努力は無駄" },
  { id: "k104", main: "国語", sub: "熟語・慣用句", level: 3, question: "「七転び八起き」の意味は？",      choices: ["何度失敗しても立ち上がる","毎日転ぶ","幸運が続く","危険を冒す"],         answer: "何度失敗しても立ち上がる" },
  { id: "k105", main: "国語", sub: "熟語・慣用句", level: 7, question: "「情けは人の為ならず」の意味は？",choices: ["情けは自分に返る","情けは損","人を助けるな","困ったら聞け"],              answer: "情けは自分に返る" },
  // ════════ 理科 / 物理・化学 ════════
  { id: "s001", main: "理科", sub: "物理・化学", level: 7, question: "光の速さは約何km/s？",   choices: ["30万","3万","300万","3000"], answer: "30万" },
  { id: "s002", main: "理科", sub: "物理・化学", level: 4, question: "水の化学式は？",         choices: ["H2O","CO2","O2","H2"],       answer: "H2O" },
  { id: "s003", main: "理科", sub: "物理・化学", level: 7, question: "ダイヤモンドの主成分は？", choices: ["シリコン","炭素","鉄","アルミ"],  answer: "炭素" },
  { id: "s004", main: "理科", sub: "物理・化学", level: 7, question: "音の速さ（空気中）は約何m/s？", choices: ["340","150","1500","3000"],  answer: "340" },
  { id: "s005", main: "理科", sub: "物理・化学", level: 7, question: "元素記号 Fe は何？",      choices: ["フッ素","鉄","鉛","銀"],       answer: "鉄" },
  // ════════ 理科 / 生物・地学 ════════
  { id: "s101", main: "理科", sub: "生物・地学", level: 7, question: "人間の体で最も大きい臓器は？",       choices: ["心臓","肝臓","肺","皮膚"],       answer: "皮膚" },
  { id: "s102", main: "理科", sub: "生物・地学", level: 4, question: "光合成で植物が吸収するのは？",       choices: ["酸素","窒素","二酸化炭素","水蒸気"], answer: "二酸化炭素" },
  { id: "s103", main: "理科", sub: "生物・地学", level: 7, question: "地球から月までの平均距離は約何万km？", choices: ["38万","15万","100万","50万"],  answer: "38万" },
  { id: "s104", main: "理科", sub: "生物・地学", level: 7, question: "地球の大気で最も多い気体は？",       choices: ["酸素","窒素","二酸化炭素","アルゴン"], answer: "窒素" },
  { id: "s105", main: "理科", sub: "生物・地学", level: 8, question: "ヒトの染色体の本数は？",             choices: ["23本","46本","92本","24本"],  answer: "46本" },
  // ════════ 社会 / 地理 ════════
  { id: "c001", main: "社会", sub: "地理", level: 2, question: "日本の首都は？",                choices: ["大阪","東京","京都","名古屋"],           answer: "東京" },
  { id: "c002", main: "社会", sub: "地理", level: 4, question: "世界で一番長い川は？",            choices: ["アマゾン川","ナイル川","長江","ミシシッピ川"], answer: "ナイル川" },
  { id: "c003", main: "社会", sub: "地理", level: 4, question: "世界で最も人口が多い国は？",      choices: ["アメリカ","インド","中国","ブラジル"],   answer: "インド" },
  { id: "c004", main: "社会", sub: "地理", level: 4, question: "日本で最も面積が大きい都道府県は？", choices: ["北海道","岩手県","長野県","福島県"],   answer: "北海道" },
  { id: "c005", main: "社会", sub: "地理", level: 7, question: "国際連合の本部がある都市は？",    choices: ["ジュネーブ","ワシントン","ニューヨーク","パリ"], answer: "ニューヨーク" },
  // ════════ 社会 / 歴史 ════════
  { id: "c101", main: "社会", sub: "歴史", level: 5, question: "第二次世界大戦が終わった年は？",     choices: ["1943","1944","1945","1946"],       answer: "1945" },
  { id: "c102", main: "社会", sub: "歴史", level: 5, question: "江戸幕府を開いたのは誰？",          choices: ["豊臣秀吉","徳川家康","織田信長","足利尊氏"], answer: "徳川家康" },
  { id: "c103", main: "社会", sub: "歴史", level: 7, question: "大日本帝国憲法が公布された年は？",   choices: ["1868","1889","1912","1945"],       answer: "1889" },
  { id: "c104", main: "社会", sub: "歴史", level: 5, question: "明治維新が始まった年は？",          choices: ["1853","1868","1889","1912"],       answer: "1868" },
  { id: "c105", main: "社会", sub: "歴史", level: 7, question: "ペリーが来航した年は？",            choices: ["1840","1853","1867","1871"],       answer: "1853" },
  // ════════ 英語 / 英単語 ════════
  { id: "e001", main: "英語", sub: "英単語", level: 3, question: '"apple" のにほんごは？',        choices: ["みかん","りんご","ぶどう","もも"],       answer: "りんご" },
  { id: "e002", main: "英語", sub: "英単語", level: 4, question: '"beautiful" の反意語は？',    choices: ["ugly","small","old","slow"],           answer: "ugly" },
  { id: "e003", main: "英語", sub: "英単語", level: 3, question: '"I am hungry" の意味は？',    choices: ["眠い","楽しい","お腹が空いた","怒っている"], answer: "お腹が空いた" },
  { id: "e004", main: "英語", sub: "英単語", level: 7, question: '"environment" の意味は？',    choices: ["娯楽","環境","教育","感情"],             answer: "環境" },
  { id: "e005", main: "英語", sub: "英単語", level: 8, question: '"collaborate" の意味は？',    choices: ["競争する","協力する","妨害する","分離する"], answer: "協力する" },
  // ════════ 英語 / 英文法 ════════
  { id: "e101", main: "英語", sub: "英文法", level: 7, question: '"run" の過去形は？',                       choices: ["runned","ran","ranned","running"],      answer: "ran" },
  { id: "e102", main: "英語", sub: "英文法", level: 5, question: '"She ___ a doctor." に入る動詞は？',        choices: ["am","are","is","be"],                 answer: "is" },
  { id: "e103", main: "英語", sub: "英文法", level: 7, question: '"big" の比較級は？',                       choices: ["biger","bigger","most big","more big"], answer: "bigger" },
  { id: "e104", main: "英語", sub: "英文法", level: 5, question: '"Where are you from?" の意味は？',         choices: ["どこへ行く？","出身はどこ？","何をしている？","元気？"], answer: "出身はどこ？" },
  { id: "e105", main: "英語", sub: "英文法", level: 5, question: '"Thank you" への返答は？',                 choices: ["Yes, I do.","You're welcome.","Nice to meet you.","I'm fine."], answer: "You're welcome." },
  // ════════ プログラミング / Web基礎 ════════
  { id: "p001", main: "プログラミング", sub: "Web基礎", level: 7, question: "HTML の略は？",                 choices: ["HyperText Markup Language","High Tech Modern","HyperText Modern Link","High Text Markup"],  answer: "HyperText Markup Language" },
  { id: "p002", main: "プログラミング", sub: "Web基礎", level: 7, question: "CSS で文字色を変えるプロパティは？", choices: ["font-color","text-color","color","font-style"], answer: "color" },
  { id: "p003", main: "プログラミング", sub: "Web基礎", level: 7, question: "HTTP のデフォルトポート番号は？",  choices: ["21","443","80","8080"],               answer: "80" },
  { id: "p004", main: "プログラミング", sub: "Web基礎", level: 7, question: "JSON の正式名称は？",            choices: ["JavaScript Object Notation","Java Standard Object","JavaScript Online Network","Java Source Object"], answer: "JavaScript Object Notation" },
  { id: "p005", main: "プログラミング", sub: "Web基礎", level: 7, question: "JavaScript で配列の長さを得るプロパティは？", choices: ["size","count","length","len"], answer: "length" },
  // ════════ プログラミング / Java Bronze ════════
  { id: "jb01", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaのソースファイルの拡張子は？",     choices: [".js",".java",".class",".jar"],                        answer: ".java" },
  { id: "jb02", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaでクラスを定義するキーワードは？", choices: ["struct","class","object","define"],                   answer: "class" },
  { id: "jb03", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaで整数を扱う基本データ型は？",    choices: ["Integer","number","int","integer"],                   answer: "int" },
  { id: "jb04", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaの標準出力メソッドは？",         choices: ["console.log()","print()","System.out.println()","echo()"], answer: "System.out.println()" },
  { id: "jb05", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaでmainメソッドの戻り値の型は？",  choices: ["int","String","void","boolean"],                      answer: "void" },
  { id: "jb06", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaで文字列型を表すクラスは？",      choices: ["char","str","String","Text"],                         answer: "String" },
  { id: "jb07", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaのfor文で使うキーワードは？",    choices: ["loop","repeat","for","each"],                         answer: "for" },
  { id: "jb08", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaでif文のelse ifに相当するキーワードは？", choices: ["elif","elseif","else if","otherwise"],           answer: "else if" },
  // ════════ プログラミング / Java Silver ════════
  { id: "js01", main: "プログラミング", sub: "Java Silver", level: 8, question: "インターフェースを実装するキーワードは？",       choices: ["extends","implements","inherits","uses"],             answer: "implements" },
  { id: "js02", main: "プログラミング", sub: "Java Silver", level: 8, question: "抽象クラスを定義するキーワードは？",             choices: ["abstract","interface","virtual","base"],              answer: "abstract" },
  { id: "js03", main: "プログラミング", sub: "Java Silver", level: 8, question: "オーバーライドを示すアノテーションは？",          choices: ["@Overload","@Override","@Super","@Virtual"],          answer: "@Override" },
  { id: "js04", main: "プログラミング", sub: "Java Silver", level: 8, question: "動的にサイズが変わるリストクラスは？",           choices: ["Array","LinkedList","ArrayList","DynamicArray"],      answer: "ArrayList" },
  { id: "js05", main: "プログラミング", sub: "Java Silver", level: 8, question: "例外を捕捉するキーワードの組み合わせは？",       choices: ["try-catch","begin-rescue","error-handle","check-fix"], answer: "try-catch" },
  { id: "js06", main: "プログラミング", sub: "Java Silver", level: 8, question: "クラスの継承を表すキーワードは？",               choices: ["implements","inherits","extends","using"],             answer: "extends" },
  { id: "js07", main: "プログラミング", sub: "Java Silver", level: 8, question: "nullポインタ例外のクラス名は？",                 choices: ["NullError","NullPointerException","NullException","NullRef"], answer: "NullPointerException" },
  { id: "js08", main: "プログラミング", sub: "Java Silver", level: 8, question: "Javaでstaticメソッドを呼ぶ方法は？",           choices: ["インスタンスから呼ぶ","クラス名.メソッド名()","newして呼ぶ","super()で呼ぶ"], answer: "クラス名.メソッド名()" },
  // ════════ プログラミング / Java Gold ════════
  { id: "jg01", main: "プログラミング", sub: "Java Gold", level: 9, question: "ラムダ式が使える型の総称は？",                     choices: ["LambdaType","FunctionalInterface","AnonymousClass","AbstractType"], answer: "FunctionalInterface" },
  { id: "jg02", main: "プログラミング", sub: "Java Gold", level: 9, question: "Stream APIでフィルタリングするメソッドは？",        choices: ["where()","select()","filter()","find()"],              answer: "filter()" },
  { id: "jg03", main: "プログラミング", sub: "Java Gold", level: 9, question: "スレッドセーフなArrayListの代替クラスは？",         choices: ["SynchronizedList","ConcurrentList","CopyOnWriteArrayList","SafeArrayList"], answer: "CopyOnWriteArrayList" },
  { id: "jg04", main: "プログラミング", sub: "Java Gold", level: 9, question: "Optional クラスの主な用途は？",                   choices: ["高速化","nullポインタ例外の回避","スレッド管理","メモリ削減"],           answer: "nullポインタ例外の回避" },
  { id: "jg05", main: "プログラミング", sub: "Java Gold", level: 9, question: "共有リソースを1スレッドのみアクセス可にするキーワードは？", choices: ["volatile","synchronized","atomic","exclusive"],       answer: "synchronized" },
  { id: "jg06", main: "プログラミング", sub: "Java Gold", level: 9, question: "Stream APIで要素を変換するメソッドは？",            choices: ["convert()","transform()","map()","apply()"],          answer: "map()" },
  { id: "jg07", main: "プログラミング", sub: "Java Gold", level: 9, question: "Java 8で導入されたデフォルトメソッドが定義できるのは？", choices: ["class","abstract class","interface","enum"],         answer: "interface" },
  { id: "jg08", main: "プログラミング", sub: "Java Gold", level: 9, question: "CompletableFutureが属するパッケージは？",           choices: ["java.util","java.concurrent","java.util.concurrent","java.thread"], answer: "java.util.concurrent" },

  // ════════ 算数 / 四則計算 (追加) ════════
  { id: "m006", main: "算数", sub: "四則計算", level: 1, question: "999 + 1 = ?",                    choices: ["998","999","1000","1001"],          answer: "1000" },
  { id: "m007", main: "算数", sub: "四則計算", level: 7, question: "15 × 15 = ?",                   choices: ["175","200","225","250"],            answer: "225" },
  { id: "m008", main: "算数", sub: "四則計算", level: 7, question: "256 ÷ 16 = ?",                  choices: ["14","15","16","17"],                answer: "16" },
  { id: "m009", main: "算数", sub: "四則計算", level: 7, question: "3³（3の3乗）= ?",               choices: ["9","18","27","36"],                 answer: "27" },
  { id: "m010", main: "算数", sub: "四則計算", level: 7, question: "次のうち素数はどれ？",           choices: ["9","15","17","21"],                 answer: "17" },
  { id: "m011", main: "算数", sub: "四則計算", level: 7, question: "7 + 8 × 2 = ?",                 choices: ["30","23","28","15"],                answer: "23" },
  { id: "m012", main: "算数", sub: "四則計算", level: 7, question: "0.5 × 0.5 = ?",                 choices: ["1","0.5","0.25","0.1"],             answer: "0.25" },
  { id: "m013", main: "算数", sub: "四則計算", level: 7, question: "1/3 + 1/6 = ?",                 choices: ["2/9","1/2","2/3","1/4"],            answer: "1/2" },
  { id: "m014", main: "算数", sub: "四則計算", level: 8, question: "2¹⁰（2の10乗）= ?",             choices: ["512","1000","1024","2048"],         answer: "1024" },
  { id: "m015", main: "算数", sub: "四則計算", level: 7, question: "48 ÷ 0.6 = ?",                  choices: ["28.8","60","72","80"],              answer: "80" },
  // ════════ 算数 / 図形・面積 (追加) ════════
  { id: "m106", main: "算数", sub: "図形・面積", level: 7, question: "1辺6cmの立方体の体積は？",             choices: ["36cm³","108cm³","216cm³","256cm³"],          answer: "216cm³" },
  { id: "m107", main: "算数", sub: "図形・面積", level: 7, question: "半径10cmの円の周の長さは？（π=3.14）", choices: ["31.4cm","62.8cm","94.2cm","314cm"],          answer: "62.8cm" },
  { id: "m108", main: "算数", sub: "図形・面積", level: 4, question: "三角形の内角の和は？",                 choices: ["90度","180度","270度","360度"],               answer: "180度" },
  { id: "m109", main: "算数", sub: "図形・面積", level: 7, question: "四角形の内角の和は？",                 choices: ["180度","270度","360度","540度"],              answer: "360度" },
  { id: "m110", main: "算数", sub: "図形・面積", level: 7, question: "正三角形の1つの内角は？",              choices: ["45度","60度","90度","120度"],                 answer: "60度" },
  { id: "m111", main: "算数", sub: "図形・面積", level: 7, question: "台形の面積の公式は？",                 choices: ["底辺×高さ","(上底+下底)×高さ÷2","底辺×高さ÷2","対角線×対角線÷2"], answer: "(上底+下底)×高さ÷2" },
  { id: "m112", main: "算数", sub: "図形・面積", level: 4, question: "1辺10cmの正方形の面積は？",            choices: ["40cm²","50cm²","80cm²","100cm²"],            answer: "100cm²" },
  { id: "m113", main: "算数", sub: "図形・面積", level: 7, question: "五角形の内角の和は？",                 choices: ["360度","450度","540度","720度"],              answer: "540度" },
  { id: "m114", main: "算数", sub: "図形・面積", level: 8, question: "底面の半径3・高さ4の円柱の体積は？（π=3）", choices: ["36","72","108","144"],                  answer: "108" },
  { id: "m115", main: "算数", sub: "図形・面積", level: 7, question: "平行四辺形の面積の公式は？",            choices: ["底辺＋高さ","底辺×高さ","底辺×高さ÷2","(底辺+斜辺)×高さ÷2"], answer: "底辺×高さ" },
  // ════════ 国語 / 漢字・読み (追加) ════════
  { id: "k006", main: "国語", sub: "漢字・読み", level: 8, question: "「切磋琢磨」の読み方は？",  choices: ["せっさたくま","きっさたくま","せいさたくは","きりさみがき"],       answer: "せっさたくま" },
  { id: "k007", main: "国語", sub: "漢字・読み", level: 8, question: "「傍若無人」の読み方は？",  choices: ["ぼうじゃくぶじん","ぼうにゃくぶにん","ほうじゃくむにん","ぼうじゃくむにん"], answer: "ぼうじゃくぶじん" },
  { id: "k008", main: "国語", sub: "漢字・読み", level: 8, question: "「空前絶後」の読み方は？",  choices: ["くうぜんぜつご","そらまえきれうしろ","こうぜんぜつご","くうぜんたいご"],  answer: "くうぜんぜつご" },
  { id: "k009", main: "国語", sub: "漢字・読み", level: 8, question: "「温故知新」の読み方は？",  choices: ["おんこちしん","おんこちあたらしい","ねつこちしん","おんこしんち"],        answer: "おんこちしん" },
  { id: "k010", main: "国語", sub: "漢字・読み", level: 8, question: "「朝令暮改」の読み方は？",  choices: ["ちょうれいぼかい","あされいゆうかい","ちょうれいくれかい","あされいくれあらため"], answer: "ちょうれいぼかい" },
  { id: "k011", main: "国語", sub: "漢字・読み", level: 8, question: "「画竜点睛」の読み方は？",  choices: ["がりょうてんせい","えりゅうてんめ","かりゅうてんせい","がりゅうてんきん"], answer: "がりょうてんせい" },
  { id: "k012", main: "国語", sub: "漢字・読み", level: 8, question: "「百花繚乱」の読み方は？",  choices: ["ひゃっかりょうらん","ひゃっかかいらん","ひゃくかりょうらん","ひゃっかみだれる"], answer: "ひゃっかりょうらん" },
  { id: "k013", main: "国語", sub: "漢字・読み", level: 8, question: "「慇懃無礼」の読み方は？",  choices: ["いんぎんぶれい","いんぎんむれい","おんきんぶれい","えんぎんむれい"],       answer: "いんぎんぶれい" },
  { id: "k014", main: "国語", sub: "漢字・読み", level: 8, question: "「付和雷同」の読み方は？",  choices: ["ふわらいどう","ふかでんどう","ふわかみなり","つけわらいどう"],            answer: "ふわらいどう" },
  { id: "k015", main: "国語", sub: "漢字・読み", level: 8, question: "「阿吽の呼吸」の読み方は？", choices: ["あうんのこきゅう","おんのこきゅう","あおんのこえ","あほんのむね"],        answer: "あうんのこきゅう" },
  // ════════ 国語 / 熟語・慣用句 (追加) ════════
  { id: "k106", main: "国語", sub: "熟語・慣用句", level: 7, question: "「覆水盆に返らず」の意味は？",        choices: ["水をこぼした","一度したことは元に戻せない","チャンスは二度来る","失敗を恐れるな"], answer: "一度したことは元に戻せない" },
  { id: "k107", main: "国語", sub: "熟語・慣用句", level: 7, question: "「猫に小判」の意味は？",              choices: ["猫は賢い","価値がわからない者に貴重なものを渡す","少しの努力で大成功","猫好きへの贈り物"], answer: "価値がわからない者に貴重なものを渡す" },
  { id: "k108", main: "国語", sub: "熟語・慣用句", level: 7, question: "「石橋を叩いて渡る」の意味は？",      choices: ["無謀に行動する","慎重すぎて行動できない","念入りに確かめて行動する","石が好き"], answer: "念入りに確かめて行動する" },
  { id: "k109", main: "国語", sub: "熟語・慣用句", level: 7, question: "「灯台下暗し」の意味は？",            choices: ["夜は危険","灯台は暗い","身近なことは意外と気づきにくい","明るい場所を選べ"], answer: "身近なことは意外と気づきにくい" },
  { id: "k110", main: "国語", sub: "熟語・慣用句", level: 7, question: "「雨降って地固まる」の意味は？",      choices: ["雨は地面を固める","困難の後は安定する","雨が多い年は豊作","固い地面には雨が必要"], answer: "困難の後は安定する" },
  { id: "k111", main: "国語", sub: "熟語・慣用句", level: 7, question: "「棚からぼた餅」の意味は？",          choices: ["棚が崩れた","努力が実った","思いがけない幸運","餅が好き"],               answer: "思いがけない幸運" },
  { id: "k112", main: "国語", sub: "熟語・慣用句", level: 8, question: "「虎穴に入らずんば虎子を得ず」の意味は？", choices: ["虎は危険","危険を冒さなければ成功はない","虎の子を守れ","山に入るな"], answer: "危険を冒さなければ成功はない" },
  { id: "k113", main: "国語", sub: "熟語・慣用句", level: 7, question: "「温故知新」の意味は？",              choices: ["昔に戻る","古いものを学び新しいことを知る","温かく付き合う","知識を温める"], answer: "古いものを学び新しいことを知る" },
  { id: "k114", main: "国語", sub: "熟語・慣用句", level: 8, question: "「七転八倒」の意味は？",              choices: ["何度も転ぶ","激しく苦しむ","七回転んで八回起きる","転倒注意"],           answer: "激しく苦しむ" },
  { id: "k115", main: "国語", sub: "熟語・慣用句", level: 7, question: "「急がば回れ」の意味は？",            choices: ["急いで行け","回り道が安全で早いこともある","急ぐと道に迷う","いつも急ぐべき"], answer: "回り道が安全で早いこともある" },
  // ════════ 理科 / 物理・化学 (追加) ════════
  { id: "s006", main: "理科", sub: "物理・化学", level: 7, question: "電流の単位は？",                choices: ["ボルト(V)","ワット(W)","アンペア(A)","オーム(Ω)"],  answer: "アンペア(A)" },
  { id: "s007", main: "理科", sub: "物理・化学", level: 7, question: "電圧の単位は？",                choices: ["アンペア(A)","ワット(W)","ボルト(V)","ヘルツ(Hz)"], answer: "ボルト(V)" },
  { id: "s008", main: "理科", sub: "物理・化学", level: 8, question: "金の元素記号は？",              choices: ["Ag","Fe","Cu","Au"],                             answer: "Au" },
  { id: "s009", main: "理科", sub: "物理・化学", level: 7, question: "NaCl は何の化学式？",          choices: ["砂糖","重曹","食塩","石灰"],                      answer: "食塩" },
  { id: "s010", main: "理科", sub: "物理・化学", level: 8, question: "絶対零度は約何℃？",            choices: ["-100℃","-273℃","0℃","-500℃"],                   answer: "-273℃" },
  { id: "s011", main: "理科", sub: "物理・化学", level: 7, question: "鉄が錆びる化学変化は？",        choices: ["還元","中和","酸化","分解"],                      answer: "酸化" },
  { id: "s012", main: "理科", sub: "物理・化学", level: 7, question: "水素を燃やすと何ができる？",    choices: ["二酸化炭素","酸素","水","窒素"],                  answer: "水" },
  { id: "s013", main: "理科", sub: "物理・化学", level: 7, question: "電力の単位は？",                choices: ["ボルト(V)","アンペア(A)","オーム(Ω)","ワット(W)"], answer: "ワット(W)" },
  { id: "s014", main: "理科", sub: "物理・化学", level: 7, question: "酸素の元素記号は？",            choices: ["O2","Co","Ox","O"],                              answer: "O" },
  { id: "s015", main: "理科", sub: "物理・化学", level: 3, question: "炭酸飲料に溶けている気体は？",  choices: ["酸素","水素","窒素","二酸化炭素"],                answer: "二酸化炭素" },
  // ════════ 理科 / 生物・地学 (追加) ════════
  { id: "s106", main: "理科", sub: "生物・地学", level: 4, question: "地球の自転周期は？",                        choices: ["12時間","約24時間","約365日","約30日"],             answer: "約24時間" },
  { id: "s107", main: "理科", sub: "生物・地学", level: 4, question: "地球の公転周期は？",                        choices: ["約30日","約90日","約365日","約10年"],              answer: "約365日" },
  { id: "s108", main: "理科", sub: "生物・地学", level: 7, question: "植物の細胞にあってヒトの細胞にないものは？", choices: ["細胞膜","ミトコンドリア","核","葉緑体"],           answer: "葉緑体" },
  { id: "s109", main: "理科", sub: "生物・地学", level: 7, question: "血液中で酸素を運ぶのは？",                  choices: ["白血球","血小板","血清","赤血球"],                 answer: "赤血球" },
  { id: "s110", main: "理科", sub: "生物・地学", level: 7, question: "太陽の表面温度は約何℃？",                  choices: ["約1000℃","約3000℃","約6000℃","約1万℃"],        answer: "約6000℃" },
  { id: "s111", main: "理科", sub: "生物・地学", level: 7, question: "無脊椎動物はどれ？",                       choices: ["カエル","サメ","ヘビ","タコ"],                     answer: "タコ" },
  { id: "s112", main: "理科", sub: "生物・地学", level: 7, question: "光合成の産物は？",                          choices: ["二酸化炭素と水","窒素と水","酸素と二酸化炭素","酸素とデンプン"], answer: "酸素とデンプン" },
  { id: "s113", main: "理科", sub: "生物・地学", level: 7, question: "マグマが冷えてできる岩石の種類は？",         choices: ["堆積岩","変成岩","礫岩","火成岩"],                answer: "火成岩" },
  { id: "s114", main: "理科", sub: "生物・地学", level: 8, question: "地球の内側から外側への層の順は？",           choices: ["地殻→核→マントル","マントル→地殻→核","地殻→マントル→核","核→マントル→地殻"], answer: "核→マントル→地殻" },
  { id: "s115", main: "理科", sub: "生物・地学", level: 7, question: "セキツイ動物でないのは？",                   choices: ["コウモリ","ペンギン","カメ","ヒトデ"],             answer: "ヒトデ" },
  // ════════ 社会 / 地理 (追加) ════════
  { id: "c006", main: "社会", sub: "地理", level: 7, question: "日本で最も長い川は？",            choices: ["利根川","木曽川","吉野川","信濃川"],                    answer: "信濃川" },
  { id: "c007", main: "社会", sub: "地理", level: 4, question: "世界で最も高い山は？",            choices: ["K2","マッキンリー","モンブラン","エベレスト"],           answer: "エベレスト" },
  { id: "c008", main: "社会", sub: "地理", level: 7, question: "日本の国土面積は約何万km²？",     choices: ["18万","28万","38万","48万"],                           answer: "38万" },
  { id: "c009", main: "社会", sub: "地理", level: 7, question: "日本で最も面積が小さい都道府県は？", choices: ["東京都","神奈川県","大阪府","香川県"],                answer: "香川県" },
  { id: "c010", main: "社会", sub: "地理", level: 7, question: "太平洋で最も深い海溝は？",        choices: ["日本海溝","チリ海溝","アリューシャン海溝","マリアナ海溝"], answer: "マリアナ海溝" },
  { id: "c011", main: "社会", sub: "地理", level: 8, question: "日本の南端の島は？",              choices: ["与那国島","南鳥島","宮古島","沖ノ鳥島"],               answer: "沖ノ鳥島" },
  { id: "c012", main: "社会", sub: "地理", level: 7, question: "世界で最も大きな大陸は？",        choices: ["アフリカ大陸","南アメリカ大陸","北アメリカ大陸","ユーラシア大陸"], answer: "ユーラシア大陸" },
  { id: "c013", main: "社会", sub: "地理", level: 8, question: "日本の東端の島は？",              choices: ["与那国島","沖ノ鳥島","択捉島","南鳥島"],               answer: "南鳥島" },
  { id: "c014", main: "社会", sub: "地理", level: 7, question: "日本と地続きの国はいくつ？",      choices: ["0","1","2","3"],                                       answer: "0" },
  { id: "c015", main: "社会", sub: "地理", level: 8, question: "国連に加盟している国の数は？（2023年頃）", choices: ["約150","約170","約193","約200"],               answer: "約193" },
  // ════════ 社会 / 歴史 (追加) ════════
  { id: "c106", main: "社会", sub: "歴史", level: 8, question: "日本で最初の元号は？",               choices: ["明治","昭和","天武","大化"],                       answer: "大化" },
  { id: "c107", main: "社会", sub: "歴史", level: 7, question: "関ヶ原の戦いが起きた年は？",         choices: ["1590年","1603年","1615年","1600年"],               answer: "1600年" },
  { id: "c108", main: "社会", sub: "歴史", level: 7, question: "大化の改新が行われた年は？",         choices: ["593年","710年","794年","645年"],                   answer: "645年" },
  { id: "c109", main: "社会", sub: "歴史", level: 7, question: "日清戦争が始まった年は？",           choices: ["1884年","1904年","1914年","1894年"],               answer: "1894年" },
  { id: "c110", main: "社会", sub: "歴史", level: 7, question: "アメリカ独立宣言が出た年は？",       choices: ["1765年","1789年","1804年","1776年"],               answer: "1776年" },
  { id: "c111", main: "社会", sub: "歴史", level: 7, question: "フランス革命が始まった年は？",       choices: ["1776年","1804年","1815年","1789年"],               answer: "1789年" },
  { id: "c112", main: "社会", sub: "歴史", level: 7, question: "第一次世界大戦が始まった年は？",     choices: ["1910年","1912年","1918年","1914年"],               answer: "1914年" },
  { id: "c113", main: "社会", sub: "歴史", level: 7, question: "日本が太平洋戦争に突入した年は？",   choices: ["1939年","1943年","1945年","1941年"],               answer: "1941年" },
  { id: "c114", main: "社会", sub: "歴史", level: 8, question: "初代ローマ皇帝は誰？",              choices: ["カエサル","ネロ","ハンニバル","アウグストゥス"],     answer: "アウグストゥス" },
  { id: "c115", main: "社会", sub: "歴史", level: 8, question: "コロンブスがアメリカに到達した年は？", choices: ["1388年","1452年","1522年","1492年"],             answer: "1492年" },
  // ════════ 英語 / 英単語 (追加) ════════
  { id: "e006", main: "英語", sub: "英単語", level: 4, question: '"difficult" の意味は？',     choices: ["簡単な","楽しい","早い","難しい"],          answer: "難しい" },
  { id: "e007", main: "英語", sub: "英単語", level: 7, question: '"immediately" の意味は？',   choices: ["ゆっくり","丁寧に","静かに","すぐに"],       answer: "すぐに" },
  { id: "e008", main: "英語", sub: "英単語", level: 7, question: '"purchase" の意味は？',      choices: ["販売する","借りる","修理する","購入する"],   answer: "購入する" },
  { id: "e009", main: "英語", sub: "英単語", level: 8, question: '"sustainable" の意味は？',   choices: ["速い","壊れやすい","厳しい","持続可能な"],   answer: "持続可能な" },
  { id: "e010", main: "英語", sub: "英単語", level: 8, question: '"enhance" の意味は？',       choices: ["減らす","妨げる","変換する","向上させる"],   answer: "向上させる" },
  { id: "e011", main: "英語", sub: "英単語", level: 8, question: '"consequence" の意味は？',   choices: ["原因","目的","方法","結果・影響"],           answer: "結果・影響" },
  { id: "e012", main: "英語", sub: "英単語", level: 8, question: '"ambiguous" の意味は？',     choices: ["明確な","積極的な","意欲的な","曖昧な"],     answer: "曖昧な" },
  { id: "e013", main: "英語", sub: "英単語", level: 7, question: '"frequently" の意味は？',    choices: ["めったに","一度だけ","たまに","頻繁に"],     answer: "頻繁に" },
  { id: "e014", main: "英語", sub: "英単語", level: 8, question: '"enormous" の意味は？',      choices: ["小さな","普通の","軽い","巨大な"],           answer: "巨大な" },
  { id: "e015", main: "英語", sub: "英単語", level: 7, question: '"volunteer" の意味は？',     choices: ["強制される","給料をもらう","参加を断る","自発的に参加する"], answer: "自発的に参加する" },
  // ════════ 英語 / 英文法 (追加) ════════
  { id: "e106", main: "英語", sub: "英文法", level: 5, question: '"I ___ to school every day." の空欄は？', choices: ["goes","going","gone","go"],                   answer: "go" },
  { id: "e107", main: "英語", sub: "英文法", level: 5, question: '"good" の最上級は？',                     choices: ["gooder","better","goodest","best"],            answer: "best" },
  { id: "e108", main: "英語", sub: "英文法", level: 7, question: '"buy" の過去形は？',                      choices: ["buyed","buyd","boughted","bought"],            answer: "bought" },
  { id: "e109", main: "英語", sub: "英文法", level: 7, question: "受動態の基本形は？",                      choices: ["do + 動詞","have + 過去分詞","will + 動詞","be動詞 + 過去分詞"], answer: "be動詞 + 過去分詞" },
  { id: "e110", main: "英語", sub: "英文法", level: 7, question: '"He is taller ___ me." の空欄は？',       choices: ["as","of","from","than"],                       answer: "than" },
  { id: "e111", main: "英語", sub: "英文法", level: 7, question: '"speak" の現在分詞は？',                  choices: ["speaked","spoke","speaken","speaking"],        answer: "speaking" },
  { id: "e112", main: "英語", sub: "英文法", level: 8, question: '"I have lived here for 10 years." の時制は？', choices: ["過去形","過去進行形","未来形","現在完了"], answer: "現在完了" },
  { id: "e113", main: "英語", sub: "英文法", level: 8, question: '"either A or B" の意味は？',               choices: ["AもBも","AでもなくBでもない","AとBの両方","AかBのどちらか"], answer: "AかBのどちらか" },
  { id: "e114", main: "英語", sub: "英文法", level: 7, question: '"The book ___ read by her." の空欄は？',   choices: ["did","had","is going to","was"],               answer: "was" },
  { id: "e115", main: "英語", sub: "英文法", level: 6, question: '"go" の過去形は？',                       choices: ["goed","gone","goes","went"],                   answer: "went" },
  // ════════ プログラミング / Web基礎 (追加) ════════
  { id: "p006", main: "プログラミング", sub: "Web基礎", level: 7, question: "Flexboxで主軸方向を設定するプロパティは？",     choices: ["flex-wrap","align-items","justify-items","flex-direction"],       answer: "flex-direction" },
  { id: "p007", main: "プログラミング", sub: "Web基礎", level: 7, question: "HTTPSの「S」は何の略？",                     choices: ["Speed","Simple","Standard","Secure"],                            answer: "Secure" },
  { id: "p008", main: "プログラミング", sub: "Web基礎", level: 7, question: "DOMの正式名称は？",                         choices: ["Dynamic Object Mode","Data Output Method","Direct Object Map","Document Object Model"], answer: "Document Object Model" },
  { id: "p009", main: "プログラミング", sub: "Web基礎", level: 8, question: "CSSのボックスモデルで外側から順番は？",       choices: ["content→padding→border→margin","padding→margin→content→border","border→content→padding→margin","margin→border→padding→content"], answer: "margin→border→padding→content" },
  { id: "p010", main: "プログラミング", sub: "Web基礎", level: 7, question: "JavaScriptでHTMLの要素を取得するメソッドは？", choices: ["getElement()","selectById()","findElement()","getElementById()"],  answer: "getElementById()" },
  { id: "p011", main: "プログラミング", sub: "Web基礎", level: 7, question: "HTMLで画像を表示するタグは？",               choices: ["<image>","<photo>","<picture>","<img>"],                          answer: "<img>" },
  { id: "p012", main: "プログラミング", sub: "Web基礎", level: 8, question: "CSSでflex要素を横方向中央にするプロパティは？", choices: ["align-items: center","text-align: center","flex-align: center","justify-content: center"], answer: "justify-content: center" },
  { id: "p013", main: "プログラミング", sub: "Web基礎", level: 8, question: "JavaScriptのfetch()が返すのは？",            choices: ["String","Array","Object","Promise"],                             answer: "Promise" },
  { id: "p014", main: "プログラミング", sub: "Web基礎", level: 7, question: "レスポンシブデザインに使うCSSの仕組みは？",   choices: ["Flexbox","アニメーション","float","メディアクエリ"],              answer: "メディアクエリ" },
  { id: "p015", main: "プログラミング", sub: "Web基礎", level: 7, question: "GitHubとは何のサービス？",                   choices: ["クラウドストレージ","メールサービス","タスク管理ツール","Gitリポジトリホスティング"], answer: "Gitリポジトリホスティング" },
  // ════════ プログラミング / Java Bronze (追加) ════════
  { id: "jb09", main: "プログラミング", sub: "Java Bronze", level: 8, question: "Javaで配列を宣言する方法は？",                    choices: ["int arr = new int[5]","int arr[5]","Array<int> arr = new Array(5)","int[] arr = new int[5]"],   answer: "int[] arr = new int[5]" },
  { id: "jb10", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaのswitch文で各ケースを終えるキーワードは？",    choices: ["end","stop","exit","break"],                                                                       answer: "break" },
  { id: "jb11", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaでオブジェクトを生成するキーワードは？",         choices: ["create","make","build","new"],                                                                     answer: "new" },
  { id: "jb12", main: "プログラミング", sub: "Java Bronze", level: 8, question: "Javaのfinalを変数に付けると？",                    choices: ["値が2倍になる","nullになる","エラーが出る","再代入できなくなる"],                                    answer: "再代入できなくなる" },
  { id: "jb13", main: "プログラミング", sub: "Java Bronze", level: 8, question: "Javaのコンストラクタの特徴は？",                    choices: ["戻り値がvoid","クラス名と異なる名前","staticである","戻り値の型宣言なし"],                           answer: "戻り値の型宣言なし" },
  { id: "jb14", main: "プログラミング", sub: "Java Bronze", level: 8, question: "Javaのchar型が表すのは？",                         choices: ["整数","論理値","小数","1文字（Unicode）"],                                                         answer: "1文字（Unicode）" },
  { id: "jb15", main: "プログラミング", sub: "Java Bronze", level: 7, question: "クラスの外からもアクセス可能なアクセス修飾子は？",   choices: ["private","protected","package-private","public"],                                                  answer: "public" },
  { id: "jb16", main: "プログラミング", sub: "Java Bronze", level: 8, question: "Javaのdo-while文の特徴は？",                       choices: ["最初から条件チェック","繰り返し回数固定","条件式が不要","必ず1回は実行される"],                      answer: "必ず1回は実行される" },
  { id: "jb17", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaでコメント（複数行）を書く記法は？",            choices: ["// ...","# ...","-- ...","/* ... */"],                                                             answer: "/* ... */" },
  { id: "jb18", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaのboolean型が取れる値は？",                    choices: ["0と1","yesとno","onとoff","trueとfalse"],                                                          answer: "trueとfalse" },
  // ════════ プログラミング / Java Silver (追加) ════════
  { id: "js09", main: "プログラミング", sub: "Java Silver", level: 8, question: "ジェネリクスの主な目的は？",                           choices: ["処理を高速化する","スレッドを管理する","メモリを節約する","型安全なコレクション操作"],          answer: "型安全なコレクション操作" },
  { id: "js10", main: "プログラミング", sub: "Java Silver", level: 8, question: "Java の String と StringBuilder の違いは？",          choices: ["Stringは可変、SBは不変","どちらも不変","どちらも可変","Stringは不変、SBは可変"],              answer: "Stringは不変、SBは可変" },
  { id: "js11", main: "プログラミング", sub: "Java Silver", level: 8, question: "HashMap で重複キーを put すると？",                    choices: ["例外が発生","値が無視される","リストに追加される","値が上書きされる"],                          answer: "値が上書きされる" },
  { id: "js12", main: "プログラミング", sub: "Java Silver", level: 8, question: "Javaの例外クラスの最上位は？",                         choices: ["Exception","Error","RuntimeException","Throwable"],                                            answer: "Throwable" },
  { id: "js13", main: "プログラミング", sub: "Java Silver", level: 8, question: "インターフェースで宣言したフィールドは暗黙的に何になる？", choices: ["private","protected","package-private","public static final"],                             answer: "public static final" },
  { id: "js14", main: "プログラミング", sub: "Java Silver", level: 8, question: "var キーワードの用途は？（Java 10+）",                  choices: ["定数の宣言","クラスの宣言","引数の型指定","ローカル変数の型推論"],                            answer: "ローカル変数の型推論" },
  { id: "js15", main: "プログラミング", sub: "Java Silver", level: 8, question: "Comparable インターフェースの抽象メソッドは？",          choices: ["equals()","hashCode()","compare()","compareTo()"],                                             answer: "compareTo()" },
  { id: "js16", main: "プログラミング", sub: "Java Silver", level: 8, question: "拡張for文（for-each）が使えるのは？",                  choices: ["クラスのみ","配列のみ","Iterableのみ","配列とIterable実装クラス"],                             answer: "配列とIterable実装クラス" },
  { id: "js17", main: "プログラミング", sub: "Java Silver", level: 8, question: "ガベージコレクションが解放するのは？",                   choices: ["すべての変数","スタティック変数","定数","参照されなくなったオブジェクト"],                    answer: "参照されなくなったオブジェクト" },
  { id: "js18", main: "プログラミング", sub: "Java Silver", level: 8, question: "チェック例外の特徴は？",                               choices: ["実行時のみ発生","RuntimeExceptionの子クラス","catchできない","コンパイル時に処理が強制される"], answer: "コンパイル時に処理が強制される" },
  // ════════ プログラミング / Java Gold (追加) ════════
  { id: "jg09", main: "プログラミング", sub: "Java Gold", level: 9, question: "ExecutorService の主な用途は？",                        choices: ["ファイル操作","DB接続","UIの更新","スレッドプールの管理"],                                     answer: "スレッドプールの管理" },
  { id: "jg10", main: "プログラミング", sub: "Java Gold", level: 9, question: "Stream の中間操作はどれ？",                             choices: ["collect()","forEach()","count()","filter()"],                                                   answer: "filter()" },
  { id: "jg11", main: "プログラミング", sub: "Java Gold", level: 9, question: "Predicate<T> の抽象メソッドは？",                       choices: ["apply(T t)","accept(T t)","get()","test(T t)"],                                                 answer: "test(T t)" },
  { id: "jg12", main: "プログラミング", sub: "Java Gold", level: 9, question: "ReentrantLock の特徴は？",                              choices: ["再入不可のロック","読み取り専用ロック","自動解放ロック","再入可能なロック"],                   answer: "再入可能なロック" },
  { id: "jg13", main: "プログラミング", sub: "Java Gold", level: 9, question: "Moduleシステムが導入されたJavaバージョンは？",            choices: ["Java 8","Java 11","Java 14","Java 9"],                                                          answer: "Java 9" },
  { id: "jg14", main: "プログラミング", sub: "Java Gold", level: 9, question: "Optional の orElseGet() の特徴は？",                    choices: ["値が存在しないと例外","常に引数を評価","orElse()と全く同じ","値がないときだけ引数を評価（遅延評価）"], answer: "値がないときだけ引数を評価（遅延評価）" },
  { id: "jg15", main: "プログラミング", sub: "Java Gold", level: 9, question: "CompletableFuture.thenApply() の役割は？",               choices: ["例外を処理する","タスクを並列実行","完了を待つ","結果を変換して次に渡す"],                     answer: "結果を変換して次に渡す" },
  { id: "jg16", main: "プログラミング", sub: "Java Gold", level: 9, question: "Java の record クラスが正式導入されたバージョンは？",      choices: ["Java 11","Java 14","Java 17","Java 16"],                                                        answer: "Java 16" },
  { id: "jg17", main: "プログラミング", sub: "Java Gold", level: 9, question: "switch 式（ラムダ形式 →）が正式導入されたバージョンは？",  choices: ["Java 12","Java 13","Java 15","Java 14"],                                                        answer: "Java 14" },
  { id: "jg18", main: "プログラミング", sub: "Java Gold", level: 9, question: "sealed クラスが正式導入されたJavaバージョンは？",          choices: ["Java 15","Java 16","Java 18","Java 17"],                                                        answer: "Java 17" },

  // ════════ 算数 / 四則計算 (追加 m016〜m025) ════════
  { id: "m016", main: "算数", sub: "四則計算", level: 2, question: "50 - 23 = ?",                   choices: ["27","28","29","30"],                answer: "27" },
  { id: "m017", main: "算数", sub: "四則計算", level: 2, question: "6 × 7 = ?",                    choices: ["42","48","36","54"],                answer: "42" },
  { id: "m018", main: "算数", sub: "四則計算", level: 7, question: "144 の平方根は？",              choices: ["11","12","13","14"],                answer: "12" },
  { id: "m019", main: "算数", sub: "四則計算", level: 7, question: "次のうち偶数はどれ？",          choices: ["11","13","17","18"],                answer: "18" },
  { id: "m020", main: "算数", sub: "四則計算", level: 7, question: "3/4 × 8 = ?",                  choices: ["4","5","6","7"],                    answer: "6" },
  { id: "m021", main: "算数", sub: "四則計算", level: 8, question: "log₂(32) = ?",                  choices: ["4","5","6","8"],                    answer: "5" },
  { id: "m022", main: "算数", sub: "四則計算", level: 2, question: "25 + 75 = ?",                   choices: ["90","95","100","105"],              answer: "100" },
  { id: "m023", main: "算数", sub: "四則計算", level: 7, question: "72 ÷ 9 × 3 = ?",               choices: ["16","24","27","36"],                answer: "24" },
  { id: "m024", main: "算数", sub: "四則計算", level: 8, question: "2⁸ = ?",                        choices: ["128","256","512","1024"],           answer: "256" },
  { id: "m025", main: "算数", sub: "四則計算", level: 7, question: "5% の利率で100万円を1年預けると利息は？", choices: ["500円","5000円","5万円","50万円"], answer: "5万円" },

  // ════════ 算数 / 図形・面積 (追加 m116〜m125) ════════
  { id: "m116", main: "算数", sub: "図形・面積", level: 3, question: "長さ4cmの正方形の周囲の長さは？",              choices: ["8cm","12cm","16cm","20cm"],               answer: "16cm" },
  { id: "m117", main: "算数", sub: "図形・面積", level: 7, question: "底面積12cm²・高さ5cmの四角柱の体積は？",      choices: ["17cm³","24cm³","60cm³","120cm³"],         answer: "60cm³" },
  { id: "m118", main: "算数", sub: "図形・面積", level: 7, question: "六角形の内角の和は？",                       choices: ["540度","600度","720度","900度"],           answer: "720度" },
  { id: "m119", main: "算数", sub: "図形・面積", level: 8, question: "球の体積の公式は？（rは半径）",              choices: ["πr²","2πr","4πr²","4/3πr³"],             answer: "4/3πr³" },
  { id: "m120", main: "算数", sub: "図形・面積", level: 7, question: "直角三角形の斜辺が5、底辺が3のとき高さは？",  choices: ["2","3","4","5"],                           answer: "4" },
  { id: "m121", main: "算数", sub: "図形・面積", level: 5, question: "円の面積の公式は？（rは半径）",              choices: ["2πr","πr²","πr","2πr²"],                  answer: "πr²" },
  { id: "m122", main: "算数", sub: "図形・面積", level: 7, question: "底面積が20cm²・高さ9cmの三角柱の体積は？",   choices: ["60cm³","90cm³","120cm³","180cm³"],        answer: "180cm³" },
  { id: "m123", main: "算数", sub: "図形・面積", level: 8, question: "正n角形の内角の和の公式は？",               choices: ["90(n-1)","180(n+2)","360n","180(n-2)"],   answer: "180(n-2)" },
  { id: "m124", main: "算数", sub: "図形・面積", level: 7, question: "菱形（ひし形）の面積の公式は？",             choices: ["底辺×高さ","対角線×対角線÷2","底辺×高さ÷2","(対角線+対角線)×2"], answer: "対角線×対角線÷2" },
  { id: "m125", main: "算数", sub: "図形・面積", level: 8, question: "円周率πの近似値として最も正確なのは？",       choices: ["3.14","22/7","355/113","3.1416"],          answer: "355/113" },

  // ════════ 国語 / 漢字・読み (追加 k016〜k025) ════════
  { id: "k016", main: "国語", sub: "漢字・読み", level: 1, question: "「山川」の読み方は？",          choices: ["さんがわ","やまかわ","さんせん","やまもり"],   answer: "やまかわ" },
  { id: "k017", main: "国語", sub: "漢字・読み", level: 7, question: "「矛盾」の読み方は？",          choices: ["もとじゅん","むじゅん","もじゅん","ほこたて"], answer: "むじゅん" },
  { id: "k018", main: "国語", sub: "漢字・読み", level: 7, question: "「曖昧」の読み方は？",          choices: ["えんまい","あいまい","かいまい","おうまい"],   answer: "あいまい" },
  { id: "k019", main: "国語", sub: "漢字・読み", level: 8, question: "「蹉跌」の読み方は？",          choices: ["さいつ","さてつ","さけつ","さっせつ"],         answer: "さてつ" },
  { id: "k020", main: "国語", sub: "漢字・読み", level: 7, question: "「逡巡」の読み方は？",          choices: ["しゅんじゅん","じゅんしゅん","しんじゅん","しゅんずん"], answer: "しゅんじゅん" },
  { id: "k021", main: "国語", sub: "漢字・読み", level: 1, question: "「花見」の読み方は？",          choices: ["かけん","はなみ","かさみ","はなけん"],         answer: "はなみ" },
  { id: "k022", main: "国語", sub: "漢字・読み", level: 8, question: "「捲土重来」の読み方は？",      choices: ["けんどじゅうらい","まきつちかさね","けんどちょうらい","まきつちゅうらい"], answer: "けんどちょうらい" },
  { id: "k023", main: "国語", sub: "漢字・読み", level: 7, question: "「蛍光」の読み方は？",          choices: ["ほたるかわ","けいこう","えいこう","けいひかり"], answer: "けいこう" },
  { id: "k024", main: "国語", sub: "漢字・読み", level: 8, question: "「忖度」の読み方は？",          choices: ["ぞんたく","そんたく","じんたく","つんたく"],   answer: "そんたく" },
  { id: "k025", main: "国語", sub: "漢字・読み", level: 7, question: "「頑固」の読み方は？",          choices: ["がんご","がんこ","けんこ","がんしゅ"],         answer: "がんこ" },

  // ════════ 国語 / 熟語・慣用句 (追加 k116〜k125) ════════
  { id: "k116", main: "国語", sub: "熟語・慣用句", level: 3, question: "「花より団子」の意味は？",              choices: ["花が好き","外見より中身・実利を重視","花を食べる","団子は花見で食べる"], answer: "外見より中身・実利を重視" },
  { id: "k117", main: "国語", sub: "熟語・慣用句", level: 7, question: "「二律背反」の意味は？",              choices: ["二つの法律","二つが同じ","二人で対立","両立しない二つの命題が矛盾する"], answer: "両立しない二つの命題が矛盾する" },
  { id: "k118", main: "国語", sub: "熟語・慣用句", level: 7, question: "「臥薪嘗胆」の意味は？",              choices: ["失敗を笑う","快適な生活","仕返しを誓い苦労に耐える","病気から回復する"], answer: "仕返しを誓い苦労に耐える" },
  { id: "k119", main: "国語", sub: "熟語・慣用句", level: 3, question: "「猿も木から落ちる」の意味は？",      choices: ["猿は木が好き","木は危険","名人でも失敗することがある","猿はよく落ちる"], answer: "名人でも失敗することがある" },
  { id: "k120", main: "国語", sub: "熟語・慣用句", level: 8, question: "「蟷螂の斧」の意味は？",              choices: ["鋭い刃物","大きな力","弱者が強者に無謀に立ち向かうこと","虫の武器"], answer: "弱者が強者に無謀に立ち向かうこと" },
  { id: "k121", main: "国語", sub: "熟語・慣用句", level: 7, question: "「因果応報」の意味は？",              choices: ["善いことをすれば幸運になる","良い行いは報われ、悪い行いは悪い結果をもたらす","運命は変えられない","努力は必ず実る"], answer: "良い行いは報われ、悪い行いは悪い結果をもたらす" },
  { id: "k122", main: "国語", sub: "熟語・慣用句", level: 7, question: "「目から鱗が落ちる」の意味は？",      choices: ["目が痛い","魚を食べた","急に物事の真相がわかる","視力が回復する"], answer: "急に物事の真相がわかる" },
  { id: "k123", main: "国語", sub: "熟語・慣用句", level: 8, question: "「風林火山」は誰の旗印として有名？",  choices: ["織田信長","豊臣秀吉","伊達政宗","武田信玄"], answer: "武田信玄" },
  { id: "k124", main: "国語", sub: "熟語・慣用句", level: 7, question: "「青天の霹靂」の意味は？",            choices: ["晴天が続く","急な雨","突然の大事件・驚き","空が青い"], answer: "突然の大事件・驚き" },
  { id: "k125", main: "国語", sub: "熟語・慣用句", level: 7, question: "「杞憂」の意味は？",                  choices: ["喜びで泣く","取り越し苦労","突然の喜び","忘れっぽい"], answer: "取り越し苦労" },

  // ════════ 理科 / 物理・化学 (追加 s016〜s025) ════════
  { id: "s016", main: "理科", sub: "物理・化学", level: 7, question: "モル数の基本単位 1mol = 約何個？",        choices: ["6.02×10²³","1.38×10²³","3.14×10²³","9.11×10²³"], answer: "6.02×10²³" },
  { id: "s017", main: "理科", sub: "物理・化学", level: 8, question: "アボガドロ定数は約？",                  choices: ["3.14×10²³","6.02×10²³","9.11×10³¹","1.60×10⁻¹⁹"], answer: "6.02×10²³" },
  { id: "s018", main: "理科", sub: "物理・化学", level: 7, question: "酸性の水溶液のpHは？",                  choices: ["7より大きい","7","7より小さい","0"],              answer: "7より小さい" },
  { id: "s019", main: "理科", sub: "物理・化学", level: 3, question: "磁石のN極とS極は？",                    choices: ["反発し合う","引き合う","関係ない","どちらも同じ"], answer: "引き合う" },
  { id: "s020", main: "理科", sub: "物理・化学", level: 7, question: "物質の三態のうち体積が最も大きいのは？", choices: ["固体","液体","気体","すべて同じ"],               answer: "気体" },
  { id: "s021", main: "理科", sub: "物理・化学", level: 8, question: "ニュートンの第二法則 F=ma の「a」は何？",choices: ["面積","原子量","加速度","アンペア"],             answer: "加速度" },
  { id: "s022", main: "理科", sub: "物理・化学", level: 7, question: "CO₂の日本語名は？",                     choices: ["一酸化炭素","三酸化炭素","炭酸水素","二酸化炭素"], answer: "二酸化炭素" },
  { id: "s023", main: "理科", sub: "物理・化学", level: 8, question: "電磁誘導を発見したのは誰？",             choices: ["ニュートン","エジソン","ガリレオ","ファラデー"],  answer: "ファラデー" },
  { id: "s024", main: "理科", sub: "物理・化学", level: 7, question: "周期表で最も軽い元素は？",               choices: ["ヘリウム","炭素","リチウム","水素"],             answer: "水素" },
  { id: "s025", main: "理科", sub: "物理・化学", level: 8, question: "波の速さ＝波長×何？",                   choices: ["振幅","位相","振動数","周期"],                   answer: "振動数" },

  // ════════ 理科 / 生物・地学 (追加 s116〜s125) ════════
  { id: "s116", main: "理科", sub: "生物・地学", level: 7, question: "DNAの塩基のうち、アデニン(A)と対になるのは？",   choices: ["グアニン(G)","シトシン(C)","ウラシル(U)","チミン(T)"],  answer: "チミン(T)" },
  { id: "s117", main: "理科", sub: "生物・地学", level: 3, question: "植物の根の働きは？",                             choices: ["光合成","呼吸","水・養分の吸収","種子の形成"],           answer: "水・養分の吸収" },
  { id: "s118", main: "理科", sub: "生物・地学", level: 7, question: "地震の揺れの大きさを表す単位は？",               choices: ["マグニチュード","リヒタースケール","震度","デシベル"],    answer: "震度" },
  { id: "s119", main: "理科", sub: "生物・地学", level: 7, question: "太陽系で最も大きい惑星は？",                    choices: ["土星","天王星","海王星","木星"],                         answer: "木星" },
  { id: "s120", main: "理科", sub: "生物・地学", level: 8, question: "細胞分裂で染色体が見やすくなる時期は？",          choices: ["分裂前期","間期","分裂終期","分裂後期"],                 answer: "分裂前期" },
  { id: "s121", main: "理科", sub: "生物・地学", level: 7, question: "こんちゅうのからだはいくつのぶぶんにわかれる？",               choices: ["2つ","3つ","4つ","5つ"],                               answer: "3つ" },
  { id: "s122", main: "理科", sub: "生物・地学", level: 8, question: "プレートテクトニクス理論を提唱したのは誰？",      choices: ["ダーウィン","アインシュタイン","ウェゲナー","ホーキング"], answer: "ウェゲナー" },
  { id: "s123", main: "理科", sub: "生物・地学", level: 7, question: "光合成が行われる細胞小器官は？",                 choices: ["ミトコンドリア","核","細胞壁","葉緑体"],                  answer: "葉緑体" },
  { id: "s124", main: "理科", sub: "生物・地学", level: 3, question: "ヒトは何類の動物？",                            choices: ["鳥類","爬虫類","両生類","哺乳類"],                       answer: "哺乳類" },
  { id: "s125", main: "理科", sub: "生物・地学", level: 8, question: "生態系において生産者とは何？",                   choices: ["草食動物","肉食動物","分解者","植物"],                   answer: "植物" },

  // ════════ 社会 / 地理 (追加 c016〜c025) ════════
  { id: "c016", main: "社会", sub: "地理", level: 7, question: "EU（欧州連合）の本部が置かれる都市は？",         choices: ["パリ","ロンドン","ウィーン","ブリュッセル"],              answer: "ブリュッセル" },
  { id: "c017", main: "社会", sub: "地理", level: 4, question: "アフリカ大陸を南北に分ける砂漠は？",            choices: ["ゴビ砂漠","アタカマ砂漠","ナミブ砂漠","サハラ砂漠"],     answer: "サハラ砂漠" },
  { id: "c018", main: "社会", sub: "地理", level: 7, question: "日本の最高峰は？",                            choices: ["北岳","槍ヶ岳","奥穂高岳","富士山"],                     answer: "富士山" },
  { id: "c019", main: "社会", sub: "地理", level: 8, question: "本初子午線が通る都市は？",                     choices: ["パリ","ニューヨーク","東京","グリニッジ"],                answer: "グリニッジ" },
  { id: "c020", main: "社会", sub: "地理", level: 7, question: "南アメリカ大陸で最も人口が多い国は？",          choices: ["アルゼンチン","コロンビア","チリ","ブラジル"],            answer: "ブラジル" },
  { id: "c021", main: "社会", sub: "地理", level: 7, question: "日本の標準時子午線は東経何度？",               choices: ["120度","130度","140度","135度"],                         answer: "135度" },
  { id: "c022", main: "社会", sub: "地理", level: 8, question: "世界で最も面積が大きい国は？",                 choices: ["中国","アメリカ","カナダ","ロシア"],                      answer: "ロシア" },
  { id: "c023", main: "社会", sub: "地理", level: 7, question: "赤道が通る大陸はどれ？（南アメリカを除く）",   choices: ["ヨーロッパ","オーストラリア","アジア","アフリカ"],        answer: "アフリカ" },
  { id: "c024", main: "社会", sub: "地理", level: 7, question: "琵琶湖がある都道府県は？",                     choices: ["岐阜県","三重県","奈良県","滋賀県"],                      answer: "滋賀県" },
  { id: "c025", main: "社会", sub: "地理", level: 8, question: "パナマ運河はどこを結ぶ？",                     choices: ["地中海と紅海","大西洋と太平洋","北海とバルト海","黒海とカスピ海"], answer: "大西洋と太平洋" },

  // ════════ 社会 / 歴史 (追加 c116〜c125) ════════
  { id: "c116", main: "社会", sub: "歴史", level: 7, question: "モンゴル帝国を建国したのは誰？",              choices: ["フビライ汗","チムール","アッティラ","チンギス汗"],         answer: "チンギス汗" },
  { id: "c117", main: "社会", sub: "歴史", level: 7, question: "古代エジプトのピラミッドを建設した王は誰？",   choices: ["ラムセス2世","ツタンカーメン","クフ王","ネフェルティティ"], answer: "クフ王" },
  { id: "c118", main: "社会", sub: "歴史", level: 8, question: "産業革命が最初に起きた国は？",               choices: ["フランス","ドイツ","アメリカ","イギリス"],               answer: "イギリス" },
  { id: "c119", main: "社会", sub: "歴史", level: 7, question: "日本で女性参政権が認められた年は？",          choices: ["1925年","1940年","1950年","1945年"],                      answer: "1945年" },
  { id: "c120", main: "社会", sub: "歴史", level: 8, question: "ベルリンの壁が崩壊した年は？",               choices: ["1985年","1991年","1993年","1989年"],                      answer: "1989年" },
  { id: "c121", main: "社会", sub: "歴史", level: 7, question: "聖徳太子が制定した十七条の憲法は何年？",      choices: ["593年","604年","630年","645年"],                          answer: "604年" },
  { id: "c122", main: "社会", sub: "歴史", level: 7, question: "源頼朝が鎌倉幕府を開いた年は？",             choices: ["1185年","1192年","1200年","1221年"],                      answer: "1192年" },
  { id: "c123", main: "社会", sub: "歴史", level: 8, question: "アメリカの南北戦争はいつ始まった？",          choices: ["1776年","1812年","1848年","1861年"],                      answer: "1861年" },
  { id: "c124", main: "社会", sub: "歴史", level: 7, question: "日露戦争の講和条約は？",                     choices: ["下関条約","南京条約","天津条約","ポーツマス条約"],         answer: "ポーツマス条約" },
  { id: "c125", main: "社会", sub: "歴史", level: 8, question: "マグナカルタが署名された年は？",              choices: ["1066年","1215年","1265年","1320年"],                      answer: "1215年" },

  // ════════ 英語 / 英単語 (追加 e016〜e025) ════════
  { id: "e016", main: "英語", sub: "英単語", level: 3, question: '"water" のにほんごは？',             choices: ["火","空気","土","水"],                               answer: "水" },
  { id: "e017", main: "英語", sub: "英単語", level: 7, question: '"investigate" の意味は？',         choices: ["発明する","調査する","拡張する","破壊する"],           answer: "調査する" },
  { id: "e018", main: "英語", sub: "英単語", level: 8, question: '"inevitable" の意味は？',          choices: ["可能な","望ましい","避けられない","不思議な"],         answer: "避けられない" },
  { id: "e019", main: "英語", sub: "英単語", level: 7, question: '"communicate" の意味は？',         choices: ["命令する","移動する","連絡する","変換する"],           answer: "連絡する" },
  { id: "e020", main: "英語", sub: "英単語", level: 9, question: '"discrepancy" の意味は？',         choices: ["一致","一貫性","矛盾のなさ","食い違い・差異"],         answer: "食い違い・差異" },
  { id: "e021", main: "英語", sub: "英単語", level: 8, question: '"anonymous" の意味は？',           choices: ["有名な","公式な","匿名の","正式な"],                   answer: "匿名の" },
  { id: "e022", main: "英語", sub: "英単語", level: 7, question: '"priority" の意味は？',            choices: ["可能性","頻度","優先事項","選択肢"],                   answer: "優先事項" },
  { id: "e023", main: "英語", sub: "英単語", level: 8, question: '"eloquent" の意味は？',            choices: ["静かな","無口な","乱暴な","雄弁な"],                   answer: "雄弁な" },
  { id: "e024", main: "英語", sub: "英単語", level: 3, question: '"school" のにほんごは？',            choices: ["病院","学校","銀行","図書館"],                         answer: "学校" },
  { id: "e025", main: "英語", sub: "英単語", level: 9, question: '"ubiquitous" の意味は？',          choices: ["珍しい","一時的な","局所的な","どこにでも存在する"],   answer: "どこにでも存在する" },

  // ════════ 英語 / 英文法 (追加 e116〜e125) ════════
  { id: "e116", main: "英語", sub: "英文法", level: 5, question: '"cat" の複数形は？',                       choices: ["cats","cates","catis","catts"],                        answer: "cats" },
  { id: "e117", main: "英語", sub: "英文法", level: 7, question: '"He ___ TV when I arrived." の空欄は？',   choices: ["watched","was watching","watches","is watching"],      answer: "was watching" },
  { id: "e118", main: "英語", sub: "英文法", level: 7, question: "関係代名詞 who は何を修飾する？",           choices: ["場所","時間","物","人"],                               answer: "人" },
  { id: "e119", main: "英語", sub: "英文法", level: 8, question: '"If I ___ you, I would apologize." の空欄は？', choices: ["am","were","be","will be"],                      answer: "were" },
  { id: "e120", main: "英語", sub: "英文法", level: 7, question: '"She has ___ to Paris before." の空欄は？', choices: ["go","gone","going","goes"],                           answer: "gone" },
  { id: "e121", main: "英語", sub: "英文法", level: 7, question: '"stop smoking" の意味は？',                choices: ["喫煙を始める","喫煙を続ける","喫煙が好き","喫煙をやめる"], answer: "喫煙をやめる" },
  { id: "e122", main: "英語", sub: "英文法", level: 8, question: "分詞構文の主な働きは？",                   choices: ["名詞を修飾する","代名詞を強調する","副詞節を短縮する","文を接続する"], answer: "副詞節を短縮する" },
  { id: "e123", main: "英語", sub: "英文法", level: 5, question: '"Do you like coffee?" の否定の答えは？',    choices: ["Yes, I do.","No, I don't.","Yes, I am.","No, I am not."], answer: "No, I don't." },
  { id: "e124", main: "英語", sub: "英文法", level: 8, question: "強調構文 \"It is ___ that...\" の空欄に入らないのは？", choices: ["Tom","yesterday","in Tokyo","happily"],         answer: "happily" },
  { id: "e125", main: "英語", sub: "英文法", level: 7, question: '"the tallest mountain in the world" の最上級を作る語は？', choices: ["more","most","tall","tallest"],             answer: "tallest" },

  // ════════ プログラミング / Web基礎 (追加 p016〜p025) ════════
  { id: "p016", main: "プログラミング", sub: "Web基礎", level: 7, question: "CSSでposition: absoluteの基準になるのは？",          choices: ["body要素","直近の親要素","html要素","直近のposition:staticでない祖先要素"], answer: "直近のposition:staticでない祖先要素" },
  { id: "p017", main: "プログラミング", sub: "Web基礎", level: 7, question: "JavaScriptの'==='と'=='の違いは？",                choices: ["'==='は代入","速さが違う","全く同じ","'==='は型も比較する"],             answer: "'==='は型も比較する" },
  { id: "p018", main: "プログラミング", sub: "Web基礎", level: 8, question: "CORSとは何の略？",                                 choices: ["Cross-Origin Resource Sharing","Client-Only Routing System","Cascading Object Reference Style","Common Open Resource Standard"], answer: "Cross-Origin Resource Sharing" },
  { id: "p019", main: "プログラミング", sub: "Web基礎", level: 7, question: "RESTful APIのGETメソッドの用途は？",                choices: ["データ作成","データ削除","データ更新","データ取得"],                     answer: "データ取得" },
  { id: "p020", main: "プログラミング", sub: "Web基礎", level: 8, question: "JavaScriptのイベントバブリングとは？",               choices: ["イベントが子要素のみに伝わる","DOMが再レンダリングされる","スクロールイベントが連鎖する","イベントが子から親へと伝播する"], answer: "イベントが子から親へと伝播する" },
  { id: "p021", main: "プログラミング", sub: "Web基礎", level: 7, question: "HTTPのPOSTとGETの違いは？",                        choices: ["速さだけが違う","機能は同じ","GETの方が安全","POSTはリクエストボディにデータを含む"], answer: "POSTはリクエストボディにデータを含む" },
  { id: "p022", main: "プログラミング", sub: "Web基礎", level: 7, question: "HTMLのhrefはどのタグで主に使う？",                  choices: ["<img>","<div>","<p>","<a>"],                                           answer: "<a>" },
  { id: "p023", main: "プログラミング", sub: "Web基礎", level: 8, question: "localStorageとsessionStorageの違いは？",            choices: ["localStorageは暗号化される","サイズが違う","セキュリティが違う","sessionStorageはタブを閉じると消える"], answer: "sessionStorageはタブを閉じると消える" },
  { id: "p024", main: "プログラミング", sub: "Web基礎", level: 7, question: "CSSのz-indexが効くのは何の要素？",                  choices: ["すべての要素","blockのみ","floatのみ","positionが指定された要素"],       answer: "positionが指定された要素" },
  { id: "p025", main: "プログラミング", sub: "Web基礎", level: 7, question: "JavaScriptでオブジェクトのキー一覧を取得するメソッドは？", choices: ["Object.keys()","Object.props()","Object.list()","Object.fields()"],  answer: "Object.keys()" },

  // ════════ プログラミング / Java Bronze (追加 jb19〜jb28) ════════
  { id: "jb19", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaで整数を文字列に変換するメソッドは？",           choices: ["Integer.toString()","int.toString()","String.toInt()","Integer.cast()"], answer: "Integer.toString()" },
  { id: "jb20", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaの論理演算子「&&」の意味は？",                 choices: ["OR（または）","NOT（否定）","XOR（排他的論理和）","AND（かつ）"],           answer: "AND（かつ）" },
  { id: "jb21", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaのwhile文の特徴は？",                          choices: ["必ず1回実行","固定回数繰り返す","条件が真の間繰り返す","無限ループのみ"],    answer: "条件が真の間繰り返す" },
  { id: "jb22", main: "プログラミング", sub: "Java Bronze", level: 8, question: "Javaのstaticフィールドの特徴は？",                  choices: ["インスタンスごとに独立","変更不可","クラスに1つだけ共有される","自動初期化されない"], answer: "クラスに1つだけ共有される" },
  { id: "jb23", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaで文字列を結合する演算子は？",                  choices: ["+","&","*","|"],                                                         answer: "+" },
  { id: "jb24", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaのdouble型は何を表す？",                       choices: ["整数","論理値","文字","浮動小数点数"],                                   answer: "浮動小数点数" },
  { id: "jb25", main: "プログラミング", sub: "Java Bronze", level: 8, question: "Javaでメソッドをオーバーロードする条件は？",          choices: ["メソッド名が異なる","戻り値の型が異なる","引数の型または数が異なる","クラスが異なる"], answer: "引数の型または数が異なる" },
  { id: "jb26", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaのlong型はint型と比べてどう違う？",              choices: ["小数が使える","論理値を持つ","より大きな整数を扱える","文字列を扱える"],   answer: "より大きな整数を扱える" },
  { id: "jb27", main: "プログラミング", sub: "Java Bronze", level: 7, question: "Javaでimport文を書く場所は？",                      choices: ["メソッドの中","クラス定義の後","package文の後・class宣言の前","class定義の中"], answer: "package文の後・class宣言の前" },
  { id: "jb28", main: "プログラミング", sub: "Java Bronze", level: 8, question: "Javaのenumの特徴は？",                              choices: ["インターフェースの一種","ランダムな値を生成","継承不可の定数セット","抽象クラスの一種"], answer: "継承不可の定数セット" },

  // ════════ プログラミング / Java Silver (追加 js19〜js28) ════════
  { id: "js19", main: "プログラミング", sub: "Java Silver", level: 8, question: "try-with-resources の利点は？",                     choices: ["例外を無視できる","スレッドが安全になる","パフォーマンスが上がる","AutoCloseableリソースが自動クローズ"], answer: "AutoCloseableリソースが自動クローズ" },
  { id: "js20", main: "プログラミング", sub: "Java Silver", level: 9, question: "Java の Iterator パターンで要素を取得するメソッドは？", choices: ["get()","fetch()","read()","next()"],                                      answer: "next()" },
  { id: "js21", main: "プログラミング", sub: "Java Silver", level: 8, question: "List.of() で生成したリストの特徴は？",                choices: ["ソートされる","null禁止で変更不可","Serializableのみ","重複不可"],        answer: "null禁止で変更不可" },
  { id: "js22", main: "プログラミング", sub: "Java Silver", level: 8, question: "Javaのパッケージ宣言はどこに書く？",                  choices: ["import文の後","クラス定義の中","ファイルの先頭","main()の中"],             answer: "ファイルの先頭" },
  { id: "js23", main: "プログラミング", sub: "Java Silver", level: 9, question: "instanceof 演算子の用途は？",                        choices: ["クラスをコピーする","オブジェクトをキャストする","型変換する","オブジェクトが特定クラスの型か確認"], answer: "オブジェクトが特定クラスの型か確認" },
  { id: "js24", main: "プログラミング", sub: "Java Silver", level: 8, question: "interface にデフォルトメソッドを追加できるのはJavaいくつから？", choices: ["Java 6","Java 7","Java 9","Java 8"],                             answer: "Java 8" },
  { id: "js25", main: "プログラミング", sub: "Java Silver", level: 8, question: "ArrayListとLinkedListで検索が速いのは？",              choices: ["LinkedList","速さは同じ","条件による","ArrayList"],                      answer: "ArrayList" },
  { id: "js26", main: "プログラミング", sub: "Java Silver", level: 9, question: "Javaの多重継承をインターフェースで解決できる理由は？",   choices: ["インターフェースはstaticのみ","インターフェースは状態を持たないから","型が異なるから","コンパイルが速いから"], answer: "インターフェースは状態を持たないから" },
  { id: "js27", main: "プログラミング", sub: "Java Silver", level: 8, question: "Set インターフェースの特徴は？",                       choices: ["順序が保証される","nullが複数格納できる","インデックスでアクセスできる","重複要素を持たない"],  answer: "重複要素を持たない" },
  { id: "js28", main: "プログラミング", sub: "Java Silver", level: 9, question: "equals()をオーバーライドするとき一緒にオーバーライドすべきメソッドは？", choices: ["toString()","compareTo()","hashCode()","clone()"],               answer: "hashCode()" },

  // ════════ プログラミング / Java Gold (追加 jg19〜jg28) ════════
  { id: "jg19", main: "プログラミング", sub: "Java Gold", level: 9, question: "Function<T,R> の抽象メソッドは？",                     choices: ["run()","accept(T t)","test(T t)","apply(T t)"],                          answer: "apply(T t)" },
  { id: "jg20", main: "プログラミング", sub: "Java Gold", level: 10, question: "Java の StampedLock の特徴は？",                       choices: ["自動解放される","読み取りが少ない場合に有利","書き込みロックのみ","楽観的読み取りロックが使える"], answer: "楽観的読み取りロックが使える" },
  { id: "jg21", main: "プログラミング", sub: "Java Gold", level: 9, question: "Stream.collect(Collectors.groupingBy(...)) の戻り型は？", choices: ["List","Set","Map","Optional"],                                         answer: "Map" },
  { id: "jg22", main: "プログラミング", sub: "Java Gold", level: 10, question: "VarHandle が導入されたバージョンは？",                  choices: ["Java 8","Java 11","Java 13","Java 9"],                                   answer: "Java 9" },
  { id: "jg23", main: "プログラミング", sub: "Java Gold", level: 9, question: "CompletableFuture.allOf() の説明として正しいのは？",     choices: ["最初に完了したものだけ使う","順序を保証する","例外を無視する","すべて完了するまで待つ"], answer: "すべて完了するまで待つ" },
  { id: "jg24", main: "プログラミング", sub: "Java Gold", level: 10, question: "Java 17 で正式導入された pattern matching for switch の特徴は？", choices: ["従来のswitch文と完全後方互換","戻り値が必須","整数のみ対応","型のパターンマッチが可能"], answer: "型のパターンマッチが可能" },
  { id: "jg25", main: "プログラミング", sub: "Java Gold", level: 9, question: "ConcurrentHashMap の特徴は？",                          choices: ["全操作がsynchronized","読み取りは非同期・書き込みは同期","キーの順序が保証される","セグメントロックで並行操作が可能"], answer: "セグメントロックで並行操作が可能" },
  { id: "jg26", main: "プログラミング", sub: "Java Gold", level: 10, question: "Java の instanceof パターンマッチが正式導入されたバージョンは？", choices: ["Java 14","Java 15","Java 17","Java 16"],                            answer: "Java 16" },
  { id: "jg27", main: "プログラミング", sub: "Java Gold", level: 9, question: "Collectors.toUnmodifiableList() の特徴は？",             choices: ["nullを除外する","ソートされる","重複を除く","変更不可なListを返す"],       answer: "変更不可なListを返す" },
  { id: "jg28", main: "プログラミング", sub: "Java Gold", level: 10, question: "Java の ForkJoinPool が採用するアルゴリズムは？",        choices: ["ラウンドロビン","FIFO","バックグラウンド実行","ワークスティーリング"],      answer: "ワークスティーリング" },

  // ════════ 算数 / 四則計算（小1 Lv.1 追加 m026〜m035）════════
  { id: "m026", main: "算数", sub: "四則計算", level: 1, question: "1 + 1 = ?",         choices: ["1","2","3","4"],          answer: "2" },
  { id: "m027", main: "算数", sub: "四則計算", level: 1, question: "3 + 2 = ?",         choices: ["4","5","6","7"],          answer: "5" },
  { id: "m028", main: "算数", sub: "四則計算", level: 1, question: "8 - 5 = ?",         choices: ["1","2","3","4"],          answer: "3" },
  { id: "m029", main: "算数", sub: "四則計算", level: 1, question: "10 - 3 = ?",        choices: ["6","7","8","9"],          answer: "7" },
  { id: "m030", main: "算数", sub: "四則計算", level: 1, question: "5 + 4 = ?",         choices: ["7","8","9","10"],         answer: "9" },
  { id: "m031", main: "算数", sub: "四則計算", level: 1, question: "2 + 2 + 2 = ?",     choices: ["4","5","6","7"],          answer: "6" },
  { id: "m032", main: "算数", sub: "四則計算", level: 1, question: "10 - 6 = ?",        choices: ["3","4","5","6"],          answer: "4" },
  { id: "m033", main: "算数", sub: "四則計算", level: 1, question: "4 + 3 = ?",         choices: ["6","7","8","9"],          answer: "7" },
  { id: "m034", main: "算数", sub: "四則計算", level: 1, question: "9 - 9 = ?",         choices: ["0","1","9","18"],         answer: "0" },
  { id: "m035", main: "算数", sub: "四則計算", level: 1, question: "6 + 4 = ?",         choices: ["8","9","10","11"],        answer: "10" },

  // ════════ 算数 / 四則計算（小2 Lv.2 追加 m036〜m045）════════
  { id: "m036", main: "算数", sub: "四則計算", level: 2, question: "2 × 5 = ?",         choices: ["8","10","12","15"],       answer: "10" },
  { id: "m037", main: "算数", sub: "四則計算", level: 2, question: "3 × 4 = ?",         choices: ["10","12","14","16"],      answer: "12" },
  { id: "m038", main: "算数", sub: "四則計算", level: 2, question: "8 × 8 = ?",         choices: ["56","60","64","72"],      answer: "64" },
  { id: "m039", main: "算数", sub: "四則計算", level: 2, question: "9 × 7 = ?",         choices: ["56","63","64","72"],      answer: "63" },
  { id: "m040", main: "算数", sub: "四則計算", level: 2, question: "20 + 35 = ?",       choices: ["45","50","55","60"],      answer: "55" },
  { id: "m041", main: "算数", sub: "四則計算", level: 2, question: "100 - 37 = ?",      choices: ["57","63","67","73"],      answer: "63" },
  { id: "m042", main: "算数", sub: "四則計算", level: 2, question: "45 + 28 = ?",       choices: ["63","70","73","77"],      answer: "73" },
  { id: "m043", main: "算数", sub: "四則計算", level: 2, question: "80 ÷ 4 = ?",        choices: ["15","20","22","25"],      answer: "20" },
  { id: "m044", main: "算数", sub: "四則計算", level: 2, question: "5 × 6 = ?",         choices: ["25","28","30","36"],      answer: "30" },
  { id: "m045", main: "算数", sub: "四則計算", level: 2, question: "7 × 3 = ?",         choices: ["18","21","24","28"],      answer: "21" },

  // ════════ 算数 / 図形・面積（小1 Lv.1 追加 m126〜m130）════════
  { id: "m126", main: "算数", sub: "図形・面積", level: 1, question: "さんかくけいのかどのかずは？",                choices: ["2","3","4","5"],                                      answer: "3" },
  { id: "m127", main: "算数", sub: "図形・面積", level: 1, question: "しかくけいのへんのかずは？",                choices: ["3","4","5","6"],                                      answer: "4" },
  { id: "m128", main: "算数", sub: "図形・面積", level: 1, question: "まるいかたちをなんという？",              choices: ["さんかくけい","しかくけい","えん","ひしがた"],                         answer: "えん" },
  { id: "m129", main: "算数", sub: "図形・面積", level: 1, question: "せいほうけいの4つのへんのながさは？",         choices: ["ぜんぶちがう","2へんだけおなじ","むかいあうへんだけおなじ","ぜんぶおなじ"], answer: "ぜんぶおなじ" },
  { id: "m130", main: "算数", sub: "図形・面積", level: 1, question: "さんかくけいとしかくけいでへんがおおいのは？",    choices: ["さんかくけい","しかくけい","おなじ","ごかくけい"],                     answer: "しかくけい" },

  // ════════ 算数 / 図形・面積（小2 Lv.2 追加 m131〜m135）════════
  { id: "m131", main: "算数", sub: "図形・面積", level: 2, question: "はこのめんのかずは？",          choices: ["4","5","6","8"],                                      answer: "6" },
  { id: "m132", main: "算数", sub: "図形・面積", level: 2, question: "さんかくけいのへんはなんほん？",               choices: ["2","3","4","5"],                                      answer: "3" },
  { id: "m133", main: "算数", sub: "図形・面積", level: 2, question: "ちょうほうけいのむかいあうへんのながさは？",   choices: ["ぜんぶちがう","どれもおなじ","むかいあうへんだけおなじ","となりあうへんだけおなじ"], answer: "むかいあうへんだけおなじ" },
  { id: "m134", main: "算数", sub: "図形・面積", level: 2, question: "せいさんかくけいの3つのへんのながさは？",       choices: ["ぜんぶちがう","2へんだけおなじ","3へんともおなじ","1へんだけながい"],  answer: "3へんともおなじ" },
  { id: "m135", main: "算数", sub: "図形・面積", level: 2, question: "さいころのめんのかずは？",   choices: ["4","5","6","8"],                                      answer: "6" },

  // ════════ 国語 / 漢字・読み（小1 Lv.1 追加 k026〜k040）════════
  { id: "k026", main: "国語", sub: "漢字・読み", level: 1, question: "「山」の読み方は？",                    choices: ["かわ","うみ","やま","もり"],             answer: "やま" },
  { id: "k027", main: "国語", sub: "漢字・読み", level: 1, question: "「川」の読み方は？",                    choices: ["うみ","かわ","やま","いけ"],             answer: "かわ" },
  { id: "k028", main: "国語", sub: "漢字・読み", level: 1, question: "「火」の読み方は？",                    choices: ["みず","かぜ","ひ","つち"],               answer: "ひ" },
  { id: "k029", main: "国語", sub: "漢字・読み", level: 1, question: "「水」の読み方は？",                    choices: ["ひ","かぜ","みず","つち"],               answer: "みず" },
  { id: "k030", main: "国語", sub: "漢字・読み", level: 1, question: "「木」の読み方は？",                    choices: ["くさ","はな","き","いし"],               answer: "き" },
  { id: "k031", main: "国語", sub: "漢字・読み", level: 1, question: "「日」の読み方は（太陽の意味で）？",    choices: ["つき","ほし","ひ","かぜ"],               answer: "ひ" },
  { id: "k032", main: "国語", sub: "漢字・読み", level: 1, question: "「月」の読み方は（夜空に見える）？",    choices: ["ほし","ひ","くも","つき"],               answer: "つき" },
  { id: "k033", main: "国語", sub: "漢字・読み", level: 1, question: "「人」の読み方は？",                    choices: ["こ","おとな","ひと","おや"],             answer: "ひと" },
  { id: "k034", main: "国語", sub: "漢字・読み", level: 1, question: "「子」の読み方は？",                    choices: ["おや","ひと","こ","め"],                 answer: "こ" },
  { id: "k035", main: "国語", sub: "漢字・読み", level: 1, question: "「花」の読み方は？",                    choices: ["くさ","き","はな","たね"],               answer: "はな" },
  { id: "k036", main: "国語", sub: "漢字・読み", level: 1, question: "「虫」の読み方は？",                    choices: ["とり","さかな","むし","けもの"],         answer: "むし" },
  { id: "k037", main: "国語", sub: "漢字・読み", level: 1, question: "「石」の読み方は？",                    choices: ["つち","すな","いし","いわ"],             answer: "いし" },
  { id: "k038", main: "国語", sub: "漢字・読み", level: 1, question: "「土」の読み方は？",                    choices: ["いし","すな","つち","かわ"],             answer: "つち" },
  { id: "k039", main: "国語", sub: "漢字・読み", level: 1, question: "「空」の読み方は？",                    choices: ["くも","うみ","そら","かぜ"],             answer: "そら" },
  { id: "k040", main: "国語", sub: "漢字・読み", level: 1, question: "「雨」の読み方は？",                    choices: ["ゆき","かぜ","あめ","くも"],             answer: "あめ" },

  // ════════ 国語 / 漢字・読み（小2 Lv.2 追加 k041〜k050）════════
  { id: "k041", main: "国語", sub: "漢字・読み", level: 2, question: "「朝」の読み方は？",   choices: ["ひる","よる","あさ","ゆう"],             answer: "あさ" },
  { id: "k042", main: "国語", sub: "漢字・読み", level: 2, question: "「夜」の読み方は？",   choices: ["あさ","ひる","ゆう","よる"],             answer: "よる" },
  { id: "k043", main: "国語", sub: "漢字・読み", level: 2, question: "「海」の読み方は？",   choices: ["かわ","やま","いけ","うみ"],             answer: "うみ" },
  { id: "k044", main: "国語", sub: "漢字・読み", level: 2, question: "「歌」の読み方は？",   choices: ["はなし","おどり","えんそう","うた"],     answer: "うた" },
  { id: "k045", main: "国語", sub: "漢字・読み", level: 2, question: "「読む」の読み方は？", choices: ["かく","きく","みる","よむ"],             answer: "よむ" },
  { id: "k046", main: "国語", sub: "漢字・読み", level: 2, question: "「書く」の読み方は？", choices: ["よむ","きく","かく","みる"],             answer: "かく" },
  { id: "k047", main: "国語", sub: "漢字・読み", level: 2, question: "「友」の読み方は？",   choices: ["おや","こ","ひと","とも"],               answer: "とも" },
  { id: "k048", main: "国語", sub: "漢字・読み", level: 2, question: "「走る」の読み方は？", choices: ["あるく","とぶ","およぐ","はしる"],       answer: "はしる" },
  { id: "k049", main: "国語", sub: "漢字・読み", level: 2, question: "「親」の読み方は？",   choices: ["こ","ひと","とも","おや"],               answer: "おや" },
  { id: "k050", main: "国語", sub: "漢字・読み", level: 2, question: "「話す」の読み方は？", choices: ["よむ","かく","きく","はなす"],           answer: "はなす" },

  // ════════ 理科 / 物理・化学（小1 Lv.1 追加 s026〜s030）════════
  { id: "s026", main: "理科", sub: "物理・化学", level: 1, question: "こおりをあたためるとなんになる？",         choices: ["くうき","すいじょうき","みず","すな"],                     answer: "みず" },
  { id: "s027", main: "理科", sub: "物理・化学", level: 1, question: "みずをひやすとなんになる？",         choices: ["すいじょうき","こおり","くうき","さとう"],                   answer: "こおり" },
  { id: "s028", main: "理科", sub: "物理・化学", level: 1, question: "てつはじしゃくにくっつく？",           choices: ["くっつかない","くっつく","とける","もえる"],   answer: "くっつく" },
  { id: "s029", main: "理科", sub: "物理・化学", level: 1, question: "たいようはどのほうこうからのぼる？",       choices: ["西","南","北","東"],                           answer: "東" },
  { id: "s030", main: "理科", sub: "物理・化学", level: 1, question: "みずはなん℃でこおりになる？",           choices: ["-10℃","0℃","10℃","100℃"],                   answer: "0℃" },

  // ════════ 理科 / 物理・化学（小2 Lv.2 追加 s031〜s035）════════
  { id: "s031", main: "理科", sub: "物理・化学", level: 2, question: "N極とN極を近づけると？",                  choices: ["引き合う","くっつく","変化なし","しりぞけ合う"],             answer: "しりぞけ合う" },
  { id: "s032", main: "理科", sub: "物理・化学", level: 2, question: "電池に豆電球をつなぐと何が流れる？",      choices: ["熱","光","電流","水"],                                       answer: "電流" },
  { id: "s033", main: "理科", sub: "物理・化学", level: 2, question: "水が100℃で沸騰すると何になる？",          choices: ["氷","水素","砂糖","水蒸気"],                                 answer: "水蒸気" },
  { id: "s034", main: "理科", sub: "物理・化学", level: 2, question: "砂糖と食塩はどちらも水に溶ける？",        choices: ["食塩のみ","砂糖のみ","どちらも溶けない","どちらも溶ける"],   answer: "どちらも溶ける" },
  { id: "s035", main: "理科", sub: "物理・化学", level: 2, question: "電池2個を直列につなぐと豆電球は？",       choices: ["消える","暗くなる","変わらない","明るくなる"],               answer: "明るくなる" },

  // ════════ 理科 / 生物・地学（小1 Lv.1 追加 s126〜s132）════════
  { id: "s126", main: "理科", sub: "生物・地学", level: 1, question: "アリの足は何本？",               choices: ["4本","6本","8本","10本"],                      answer: "6本" },
  { id: "s127", main: "理科", sub: "生物・地学", level: 1, question: "たまごをうむどうぶつはどれ？",       choices: ["いぬ","ねこ","にわとり","うさぎ"],                  answer: "にわとり" },
  { id: "s128", main: "理科", sub: "生物・地学", level: 1, question: "チョウはどこから生まれる？",     choices: ["土の中","花の中","たまご","木の実"],            answer: "たまご" },
  { id: "s129", main: "理科", sub: "生物・地学", level: 1, question: "サクラの花は何色？",             choices: ["青","黄","赤","ピンク・白"],                    answer: "ピンク・白" },
  { id: "s130", main: "理科", sub: "生物・地学", level: 1, question: "はるにさくはなは？",         choices: ["ひまわり","コスモス","朝顔","桜（さくら）"],    answer: "桜（さくら）" },
  { id: "s131", main: "理科", sub: "生物・地学", level: 1, question: "しょくぶつがそだつのにひつようなものは？",   choices: ["音楽","砂糖","電気","光と水"],                  answer: "光と水" },
  { id: "s132", main: "理科", sub: "生物・地学", level: 1, question: "さかなはなんでこきゅうする？",             choices: ["肺","鼻","皮膚","えら"],                        answer: "えら" },

  // ════════ 理科 / 生物・地学（小2 Lv.2 追加 s133〜s139）════════
  { id: "s133", main: "理科", sub: "生物・地学", level: 2, question: "昆虫の体は何つの部分に分かれる？",       choices: ["1つ","2つ","3つ","4つ"],                                     answer: "3つ" },
  { id: "s134", main: "理科", sub: "生物・地学", level: 2, question: "カブトムシの育つ順番は？",               choices: ["たまご→さなぎ→せいちゅう","たまご→せいちゅう","たまご→ようちゅう→さなぎ→せいちゅう","ようちゅう→たまご→せいちゅう"], answer: "たまご→ようちゅう→さなぎ→せいちゅう" },
  { id: "s135", main: "理科", sub: "生物・地学", level: 2, question: "しょくぶつはどこでこうごうせいをおこなう？",             choices: ["ね","くき","たね","は"],                                         answer: "は" },
  { id: "s136", main: "理科", sub: "生物・地学", level: 2, question: "夏と冬で昼間が長いのはどちら？",         choices: ["冬","同じ","春","夏"],                                       answer: "夏" },
  { id: "s137", main: "理科", sub: "生物・地学", level: 2, question: "たねがはつがするのにひつようなものは？",         choices: ["肥料と光","砂糖と光","音と水","水・適温・空気"],             answer: "水・適温・空気" },
  { id: "s138", main: "理科", sub: "生物・地学", level: 2, question: "しょくぶつのくきのおもなはたらきは？",               choices: ["こうごうせい","みずのきゅうしゅう","たねをつくる","みずとようぶんのとおりみち"],           answer: "みずとようぶんのとおりみち" },
  { id: "s139", main: "理科", sub: "生物・地学", level: 2, question: "ふゆにはをおとすきをなんという？",           choices: ["じょうりょくじゅ","しんようじゅ","こうようじゅ","らくようじゅ"],                         answer: "らくようじゅ" },

  // ════════ 社会 / 地理（小1 Lv.1 追加 c026〜c030）════════
  { id: "c026", main: "社会", sub: "地理", level: 1, question: "にほんのとどうふけんはぜんぶでいくつ？",         choices: ["43","45","47","50"],                          answer: "47" },
  { id: "c027", main: "社会", sub: "地理", level: 1, question: "にほんでいちばんきたにあるとどうふけんは？",         choices: ["青森県","岩手県","秋田県","北海道"],           answer: "北海道" },
  { id: "c028", main: "社会", sub: "地理", level: 1, question: "にほんでいちばんみなみにあるとどうふけんは？",         choices: ["鹿児島県","宮崎県","長崎県","沖縄県"],         answer: "沖縄県" },
  { id: "c029", main: "社会", sub: "地理", level: 1, question: "にほんのこっきにえがかれているものは？",       choices: ["ほし","ふじさん","さくら","あかいまる（おひさま）"],           answer: "あかいまる（おひさま）" },
  { id: "c030", main: "社会", sub: "地理", level: 1, question: "まるいちきゅうのかたちをしたちずをなんという？",     choices: ["絵地図","世界地図","断面図","地球儀"],         answer: "地球儀" },

  // ════════ 社会 / 地理（小2 Lv.2 追加 c031〜c035）════════
  { id: "c031", main: "社会", sub: "地理", level: 2, question: "にほんでいちばんひとがおおいまちは？",     choices: ["大阪市","名古屋市","横浜市","東京"],           answer: "東京" },
  { id: "c032", main: "社会", sub: "地理", level: 2, question: "ふじさんはなんけんにある？",           choices: ["長野県","神奈川県","岐阜県","山梨・静岡県"],   answer: "山梨・静岡県" },
  { id: "c033", main: "社会", sub: "地理", level: 2, question: "おおさかふはどのちほうにある？",     choices: ["かんとうちほう","ちゅうぶちほう","ちゅうごくちほう","きんきちほう"],   answer: "きんきちほう" },
  { id: "c034", main: "社会", sub: "地理", level: 2, question: "ほっかいどうのおおきなまちは？",         choices: ["あさひかわ","はこだて","おびひろ","さっぽろ"],           answer: "さっぽろ" },
  { id: "c035", main: "社会", sub: "地理", level: 2, question: "とうきょうとのひがしにあるけんは？",         choices: ["かながわけん","さいたまけん","とちぎけん","ちばけん"],         answer: "ちばけん" },

  // ════════ 英語 / 英単語（小1 Lv.1 追加 e026〜e040）════════
  { id: "e026", main: "英語", sub: "英単語", level: 1, question: '"dog" のにほんごは？',    choices: ["ねこ","とり","さかな","いぬ"],     answer: "いぬ" },
  { id: "e027", main: "英語", sub: "英単語", level: 1, question: '"cat" のにほんごは？',    choices: ["いぬ","とり","うさぎ","ねこ"],     answer: "ねこ" },
  { id: "e028", main: "英語", sub: "英単語", level: 1, question: '"red" のにほんごは？',    choices: ["青","白","黒","赤"],               answer: "赤" },
  { id: "e029", main: "英語", sub: "英単語", level: 1, question: '"blue" のにほんごは？',   choices: ["赤","白","緑","青"],               answer: "青" },
  { id: "e030", main: "英語", sub: "英単語", level: 1, question: '"one" のにほんごは？',    choices: ["2","3","0","1"],                   answer: "1" },
  { id: "e031", main: "英語", sub: "英単語", level: 1, question: '"two" のにほんごは？',    choices: ["1","3","4","2"],                   answer: "2" },
  { id: "e032", main: "英語", sub: "英単語", level: 1, question: '"yes" のにほんごは？',    choices: ["いいえ","たぶん","もちろん","はい"], answer: "はい" },
  { id: "e033", main: "英語", sub: "英単語", level: 1, question: '"no" のにほんごは？',     choices: ["はい","わからない","そうです","いいえ"], answer: "いいえ" },
  { id: "e034", main: "英語", sub: "英単語", level: 1, question: '"big" のにほんごは？',    choices: ["小さい","同じ","軽い","大きい"],   answer: "大きい" },
  { id: "e035", main: "英語", sub: "英単語", level: 1, question: '"small" のにほんごは？',  choices: ["大きい","重い","速い","小さい"],   answer: "小さい" },
  { id: "e036", main: "英語", sub: "英単語", level: 1, question: '"good" のにほんごは？',   choices: ["悪い","ふつう","つまらない","よい"], answer: "よい" },
  { id: "e037", main: "英語", sub: "英単語", level: 1, question: '"white" のにほんごは？',  choices: ["黒","赤","青","白"],               answer: "白" },
  { id: "e038", main: "英語", sub: "英単語", level: 1, question: '"black" のにほんごは？',  choices: ["白","灰色","青","黒"],             answer: "黒" },
  { id: "e039", main: "英語", sub: "英単語", level: 1, question: '"sun" のにほんごは？',    choices: ["月","星","雲","太陽"],             answer: "太陽" },
  { id: "e040", main: "英語", sub: "英単語", level: 1, question: '"new" のにほんごは？',    choices: ["古い","大きい","速い","新しい"],   answer: "新しい" },

  // ════════ 英語 / 英単語（小2 Lv.2 追加 e041〜e050）════════
  { id: "e041", main: "英語", sub: "英単語", level: 2, question: '"book" のにほんごは？',    choices: ["ノート","えんぴつ","消しゴム","本"],    answer: "本" },
  { id: "e042", main: "英語", sub: "英単語", level: 2, question: '"friend" のにほんごは？',  choices: ["家族","先生","となり","友達"],          answer: "友達" },
  { id: "e043", main: "英語", sub: "英単語", level: 2, question: '"happy" のにほんごは？',   choices: ["悲しい","怒っている","眠い","うれしい"], answer: "うれしい" },
  { id: "e044", main: "英語", sub: "英単語", level: 2, question: '"run" のにほんごは？',     choices: ["歩く","泳ぐ","飛ぶ","走る"],            answer: "走る" },
  { id: "e045", main: "英語", sub: "英単語", level: 2, question: '"eat" のにほんごは？',     choices: ["飲む","遊ぶ","買う","食べる"],          answer: "食べる" },
  { id: "e046", main: "英語", sub: "英単語", level: 2, question: '"play" のにほんごは？',    choices: ["勉強する","働く","休む","遊ぶ"],        answer: "遊ぶ" },
  { id: "e047", main: "英語", sub: "英単語", level: 2, question: '"fast" のにほんごは？',    choices: ["遅い","重い","軽い","速い"],            answer: "速い" },
  { id: "e048", main: "英語", sub: "英単語", level: 2, question: '"long" のにほんごは？',    choices: ["短い","軽い","薄い","長い"],            answer: "長い" },
  { id: "e049", main: "英語", sub: "英単語", level: 2, question: '"mother" のにほんごは？',  choices: ["お父さん","おじいさん","妹","お母さん"], answer: "お母さん" },
  { id: "e050", main: "英語", sub: "英単語", level: 2, question: '"father" のにほんごは？',  choices: ["お母さん","おばあさん","兄","お父さん"], answer: "お父さん" },
];
