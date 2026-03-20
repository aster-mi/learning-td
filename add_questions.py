#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Silver +150問, Gold +90問 を questions.ts に追記するスクリプト"""
import json, re, sys

# ─────────────────────────────────────────
# 1. java_exam_questions2.json から Silver 50問・Gold 50問 を変換
# ─────────────────────────────────────────
def convert_json_entry(e, id_str, sub, level):
    choices_raw = e['choices']
    ans_letter  = e['answer'].strip()
    letter_map  = {'A':0,'B':1,'C':2,'D':3}
    choices_clean = [re.sub(r'^[A-D]\.\s*', '', c) for c in choices_raw]
    answer = choices_clean[letter_map.get(ans_letter, 0)]
    q = e['question'].replace('```java','').replace('```','').strip()
    return {'id':id_str,'main':'プログラミング','sub':sub,'level':level,
            'question':q,'choices':choices_clean,'answer':answer}

with open('java_exam_questions2.json','rb') as f:
    jd = json.load(f)

new_silver = [convert_json_entry(e, f'js{151+i}', 'Java Silver', 8)
              for i, e in enumerate(jd['silver'])]      # js151~js200

new_gold   = [convert_json_entry(e, f'jg{111+i}', 'Java Gold',   9)
              for i, e in enumerate(jd['gold'])]        # jg111~jg160

# ─────────────────────────────────────────
# 2. Silver 追加問題 100問 (js201~js300)
# ─────────────────────────────────────────
S = []   # will hold dicts

def sq(idx, q, choices, answer):
    S.append({'id':f'js{idx}','main':'プログラミング','sub':'Java Silver','level':8,
              'question':q,'choices':choices,'answer':answer})

# ---- 継承・ポリモーフィズム (20問) ----
sq(201,
   "次のコードを実行すると何が出力されますか？\nclass Animal { String sound() { return \"...\"; } }\nclass Dog extends Animal { String sound() { return \"ワン\"; } }\nAnimal a = new Dog();\nSystem.out.println(a.sound());",
   ["...", "ワン", "コンパイルエラー", "実行時エラー"], "ワン")

sq(202,
   "次のコードはコンパイルエラーになりますか？\nclass A { private int x = 1; }\nclass B extends A { void show() { System.out.println(x); } }",
   ["コンパイルエラーになる（privateフィールドにアクセス不可）",
    "コンパイルエラーにならず、1を出力する",
    "コンパイルエラーにならず、0を出力する",
    "実行時エラーになる"],
   "コンパイルエラーになる（privateフィールドにアクセス不可）")

sq(203,
   "次のコードを実行すると何が出力されますか？\nclass A { static String name() { return \"A\"; } }\nclass B extends A { static String name() { return \"B\"; } }\nA obj = new B();\nSystem.out.println(obj.name());",
   ["A", "B", "コンパイルエラー", "実行時エラー"], "A")

sq(204,
   "共変戻り値型に関する記述として正しいものはどれですか？",
   ["サブクラスでオーバーライドするとき、戻り値型をスーパークラスの戻り値型のサブタイプにできる",
    "サブクラスでオーバーライドするとき、戻り値型は必ず同一でなければならない",
    "サブクラスでオーバーライドするとき、戻り値型をスーパークラスの戻り値型のスーパータイプにできる",
    "共変戻り値型はインターフェースのデフォルトメソッドにしか適用できない"],
   "サブクラスでオーバーライドするとき、戻り値型をスーパークラスの戻り値型のサブタイプにできる")

sq(205,
   "次のコードを実行すると何が出力されますか？\nclass Base {\n  int x = 10;\n  int getX() { return x; }\n}\nclass Sub extends Base {\n  int x = 20;\n  int getX() { return x; }\n}\nBase b = new Sub();\nSystem.out.println(b.x + \" \" + b.getX());",
   ["10 20", "20 20", "10 10", "20 10"], "10 20")

sq(206,
   "インターフェース A と B が同じシグネチャの default メソッド void hello() を持つとき、クラス C が両方を implements すると何が起きますか？",
   ["コンパイルエラーになる（C で hello() をオーバーライドしないと）",
    "実行時にランダムにどちらかの hello() が呼ばれる",
    "A の hello() が優先される",
    "B の hello() が優先される"],
   "コンパイルエラーになる（C で hello() をオーバーライドしないと）")

sq(207,
   "次のコードを実行すると何が出力されますか？\ninterface I { default String greet() { return \"Hello\"; } }\nclass A implements I { }\nclass B extends A { public String greet() { return \"Hi\"; } }\nI obj = new B();\nSystem.out.println(obj.greet());",
   ["Hello", "Hi", "コンパイルエラー", "実行時エラー"], "Hi")

sq(208,
   "次のコードはコンパイルできますか？\nabstract class Shape {\n  abstract double area();\n  void print() { System.out.println(area()); }\n}\nclass Circle extends Shape {\n  double r;\n  Circle(double r) { this.r = r; }\n  double area() { return Math.PI * r * r; }\n}",
   ["コンパイルできる",
    "コンパイルエラー（abstract クラスにnon-abstractメソッドを持てない）",
    "コンパイルエラー（Circle は abstract でない）",
    "コンパイルエラー（print() をオーバーライドしていない）"],
   "コンパイルできる")

sq(209,
   "次のコードを実行すると何が出力されますか？\nclass A { A() { System.out.print(\"A \"); } }\nclass B extends A { B() { System.out.print(\"B \"); } }\nclass C extends B { C() { System.out.print(\"C \"); } }\nnew C();",
   ["C B A", "A B C", "C", "コンパイルエラー"], "A B C")

sq(210,
   "次のコードを実行すると何が出力されますか？\nclass A { void show() { System.out.println(\"A\"); } }\nclass B extends A { void show() { System.out.println(\"B\"); } }\nObject o = new B();\n((A) o).show();",
   ["A", "B", "コンパイルエラー", "ClassCastException"], "B")

sq(211,
   "次のコードを実行すると何が出力されますか？\nString s1 = \"hello\";\nObject o = s1;\nif (o instanceof String str) {\n  System.out.println(str.toUpperCase());\n}",
   ["HELLO", "hello", "コンパイルエラー", "実行時エラー"], "HELLO")

sq(212,
   "次のキャストは実行時に例外を投げますか？\nObject o = Integer.valueOf(42);\nString s = (String) o;",
   ["ClassCastException が投げられる",
    "コンパイルエラーになる",
    "例外は投げられず、s は null になる",
    "例外は投げられず、s は \"42\" になる"],
   "ClassCastException が投げられる")

sq(213,
   "final クラスについて正しい説明はどれですか？",
   ["継承できない",
    "インスタンスを生成できない",
    "フィールドを持てない",
    "static メソッドしか定義できない"],
   "継承できない")

sq(214,
   "次のコードを実行すると何が出力されますか？\nclass P { int val = 1; }\nclass Q extends P { int val = 2; }\nP p = new Q();\nSystem.out.println(((Q) p).val);",
   ["1", "2", "コンパイルエラー", "ClassCastException"], "2")

sq(215,
   "interface に定義できるものとして正しいものはどれですか？（Java 8+）",
   ["static メソッド、default メソッド、abstract メソッド、定数",
    "abstract メソッドと定数のみ",
    "コンストラクタ、abstract メソッド、定数",
    "private フィールドと abstract メソッド"],
   "static メソッド、default メソッド、abstract メソッド、定数")

sq(216,
   "次のコードはコンパイルできますか？\ninterface Flyable { void fly(); }\ninterface Swimmable { void swim(); }\nclass Duck implements Flyable, Swimmable {\n  public void fly() { }\n  public void swim() { }\n}",
   ["コンパイルできる",
    "コンパイルエラー（複数のインターフェースを implements できない）",
    "コンパイルエラー（Flyable と Swimmable は同じ修飾子を持つ必要がある）",
    "実行時エラー"],
   "コンパイルできる")

sq(217,
   "次のコードを実行すると何が出力されますか？\nclass A {\n  String msg;\n  A(String msg) { this.msg = msg; }\n  public String toString() { return msg; }\n}\nA a = null;\nSystem.out.println(\"Value: \" + a);",
   ["Value: null", "NullPointerException", "コンパイルエラー", "Value: "], "Value: null")

sq(218,
   "Java での多態性（ポリモーフィズム）の仕組みについて正しい記述はどれですか？",
   ["オーバーライドされたメソッドはランタイムの型に基づいて呼ばれる（動的ディスパッチ）",
    "オーバーライドされたメソッドは宣言型に基づいて呼ばれる（静的ディスパッチ）",
    "static メソッドもオーバーライドに参加する",
    "フィールドもポリモーフィズムの対象になる"],
   "オーバーライドされたメソッドはランタイムの型に基づいて呼ばれる（動的ディスパッチ）")

sq(219,
   "次のコードを実行すると何が出力されますか？\nclass X {\n  X() { show(); }\n  void show() { System.out.println(\"X\"); }\n}\nclass Y extends X {\n  int n = 42;\n  Y() { super(); }\n  void show() { System.out.println(n); }\n}\nnew Y();",
   ["X", "42", "0", "コンパイルエラー"], "0")

sq(220,
   "オーバーライドの条件として誤っているものはどれですか？",
   ["throws 宣言できる例外はスーパークラスメソッドの例外のスーパータイプに広げられる",
    "メソッドシグネチャ（名前・引数型・順序）を同一にする必要がある",
    "アクセス修飾子はスーパークラスより狭くできない",
    "戻り値型はスーパークラスの戻り値型かそのサブタイプにする必要がある"],
   "throws 宣言できる例外はスーパークラスメソッドの例外のスーパータイプに広げられる")

# ---- 例外処理 (15問) ----
sq(221,
   "次のコードを実行すると何が出力されますか？\ntry {\n  System.out.print(\"try \");\n  throw new RuntimeException();\n} catch (RuntimeException e) {\n  System.out.print(\"catch \");\n} finally {\n  System.out.print(\"finally\");\n}",
   ["try catch finally", "try finally", "catch finally", "コンパイルエラー"], "try catch finally")

sq(222,
   "次のコードを実行すると何が出力されますか？\ntry {\n  System.out.print(\"A\");\n  return;\n} finally {\n  System.out.print(\"B\");\n}",
   ["AB", "A", "B", "コンパイルエラー"], "AB")

sq(223,
   "チェック例外を throws 宣言せずにメソッドに記述するとどうなりますか？",
   ["コンパイルエラーになる",
    "実行時に自動的に RuntimeException でラップされる",
    "コンパイルは通るが、実行時にエラーになる",
    "問題なく動作する"],
   "コンパイルエラーになる")

sq(224,
   "try-with-resources で複数のリソースを宣言した場合、close() の呼ばれる順序はどうなりますか？",
   ["宣言の逆順（後に宣言したものから close される）",
    "宣言の順（先に宣言したものから close される）",
    "実装依存",
    "並行して close される"],
   "宣言の逆順（後に宣言したものから close される）")

sq(225,
   "次のコードはコンパイルできますか？\ntry {\n  // ...\n} catch (IOException | SQLException e) {\n  e.printStackTrace();\n}",
   ["コンパイルできる",
    "コンパイルエラー（multi-catch では変数は final にできない）",
    "コンパイルエラー（multi-catch は Java 6 以前はサポートされていない）",
    "コンパイルエラー（継承関係にある例外をまとめられない）"],
   "コンパイルできる")

sq(226,
   "IOException と FileNotFoundException（IOException のサブクラス）を同じ catch ブロックで multi-catch した場合どうなりますか？",
   ["コンパイルエラー（継承関係にある例外を multi-catch できない）",
    "コンパイルできる。より具体的な方が優先される",
    "コンパイルできる。どちらが先に書かれているかで優先順位が決まる",
    "実行時例外になる"],
   "コンパイルエラー（継承関係にある例外を multi-catch できない）")

sq(227,
   "次のコードを実行すると何が出力されますか？\ntry {\n  int[] arr = new int[3];\n  arr[5] = 10;\n} catch (ArrayIndexOutOfBoundsException e) {\n  System.out.print(\"A\");\n} catch (RuntimeException e) {\n  System.out.print(\"R\");\n} finally {\n  System.out.print(\"F\");\n}",
   ["AF", "RF", "ARF", "コンパイルエラー"], "AF")

sq(228,
   "RuntimeException のサブクラスとして正しいものはどれですか？",
   ["NullPointerException",
    "IOException",
    "SQLException",
    "ClassNotFoundException"],
   "NullPointerException")

sq(229,
   "オーバーライドメソッドが throws できる例外として正しい説明はどれですか？",
   ["スーパークラスのメソッドが宣言する checked 例外の同じか狭い範囲のみ宣言できる",
    "スーパークラスのメソッドより広い checked 例外を宣言できる",
    "RuntimeException のサブクラスも throws に書けない",
    "throws 宣言は必ず完全に一致しなければならない"],
   "スーパークラスのメソッドが宣言する checked 例外の同じか狭い範囲のみ宣言できる")

sq(230,
   "Error クラスについて正しい記述はどれですか？",
   ["通常はアプリケーションでキャッチすべきでない（JVM 異常など）",
    "RuntimeException のサブクラスである",
    "checked 例外に分類される",
    "必ず catch しなければならない"],
   "通常はアプリケーションでキャッチすべきでない（JVM 異常など）")

sq(231,
   "次のコードを実行すると何が出力されますか？\ntry {\n  System.out.print(\"try\");\n} catch (Exception e) {\n  System.out.print(\"catch\");\n} finally {\n  System.out.print(\"finally\");\n}",
   ["tryfinally", "try", "trycatch", "tryfinallyでエラー"], "tryfinally")

sq(232,
   "AutoCloseable と Closeable の違いとして正しいものはどれですか？",
   ["AutoCloseable.close() は Exception を、Closeable.close() は IOException をスローできる",
    "Closeable は AutoCloseable のスーパーインターフェース",
    "AutoCloseable は try-with-resources で使えないが Closeable は使える",
    "2つは完全に同じで違いはない"],
   "AutoCloseable.close() は Exception を、Closeable.close() は IOException をスローできる")

sq(233,
   "次のコードはコンパイルできますか？\nclass MyException extends RuntimeException {\n  MyException(String msg) { super(msg); }\n}",
   ["コンパイルできる",
    "コンパイルエラー（RuntimeException を継承できない）",
    "コンパイルエラー（コンストラクタ定義が不正）",
    "コンパイルエラー（super() の呼び出し方が不正）"],
   "コンパイルできる")

sq(234,
   "スタックオーバーフローが発生すると、どの例外/エラーがスローされますか？",
   ["StackOverflowError",
    "StackOverflowException",
    "OutOfMemoryError",
    "RuntimeException"],
   "StackOverflowError")

sq(235,
   "次のコードを実行するとどうなりますか？\nvoid method() throws IOException {\n  try {\n    throw new IOException();\n  } finally {\n    throw new RuntimeException();\n  }\n}",
   ["RuntimeException がスローされる（finally 内の例外が優先）",
    "IOException がスローされる",
    "両方の例外が同時にスローされる",
    "コンパイルエラー"],
   "RuntimeException がスローされる（finally 内の例外が優先）")

# ---- ラムダ・関数型 (20問) ----
sq(236,
   "次のコードを実行すると何が出力されますか？\nList<Integer> nums = Arrays.asList(3, 1, 4, 1, 5);\nnums.stream()\n    .filter(n -> n > 2)\n    .sorted()\n    .forEach(System.out::println);",
   ["3\n4\n5", "1\n1\n3\n4\n5", "5\n4\n3", "コンパイルエラー"], "3\n4\n5")

sq(237,
   "Predicate<String> の negate() メソッドの説明として正しいものはどれですか？",
   ["元の Predicate の論理否定を返す",
    "元の Predicate と別の Predicate の AND を返す",
    "元の Predicate と別の Predicate の OR を返す",
    "Predicate を文字列に変換する"],
   "元の Predicate の論理否定を返す")

sq(238,
   "次の4つのメソッド参照の中で、特定インスタンスのメソッド参照はどれですか？",
   ["str::toUpperCase（str は String の変数）",
    "String::toUpperCase",
    "String::new",
    "Math::abs"],
   "str::toUpperCase（str は String の変数）")

sq(239,
   "Function<T,R> の compose(Function<V,T> before) の動作として正しいものはどれですか？",
   ["before を先に実行し、その結果を Function<T,R> に渡す",
    "Function<T,R> を先に実行し、その結果を before に渡す",
    "2つの関数を並列実行する",
    "コンパイルエラーになる"],
   "before を先に実行し、その結果を Function<T,R> に渡す")

sq(240,
   "次のコードを実行すると何が出力されますか？\nBiFunction<Integer,Integer,Integer> add = (a, b) -> a + b;\nSystem.out.println(add.apply(3, 4));",
   ["7", "34", "コンパイルエラー", "実行時エラー"], "7")

sq(241,
   "ラムダ式でキャプチャできる外部変数の条件はどれですか？",
   ["effectively final（再代入されていない）変数",
    "final 宣言された変数のみ",
    "static 変数のみ",
    "プリミティブ型変数のみ"],
   "effectively final（再代入されていない）変数")

sq(242,
   "次のコードはコンパイルできますか？\nint x = 10;\nRunnable r = () -> System.out.println(x);\nx = 20;",
   ["コンパイルエラー（x は effectively final でない）",
    "コンパイルできる。10 が出力される",
    "コンパイルできる。20 が出力される",
    "実行時エラー"],
   "コンパイルエラー（x は effectively final でない）")

sq(243,
   "Consumer<T> の andThen(Consumer<T> after) の動作として正しいものはどれですか？",
   ["this を実行した後 after を実行する Consumer を返す",
    "after を実行した後 this を実行する Consumer を返す",
    "this と after を並列実行する Consumer を返す",
    "コンパイルエラー"],
   "this を実行した後 after を実行する Consumer を返す")

sq(244,
   "Supplier<T> の唯一の抽象メソッドはどれですか？",
   ["T get()", "void accept(T t)", "boolean test(T t)", "R apply(T t)"], "T get()")

sq(245,
   "次のメソッド参照は何に対応するラムダ式ですか？\nString::valueOf（valueOfはstaticメソッド）",
   ["x -> String.valueOf(x)", "(s, x) -> s.valueOf(x)", "() -> String.valueOf()", "x -> x.valueOf()"],
   "x -> String.valueOf(x)")

sq(246,
   "次のコードを実行すると何が出力されますか？\nPredicate<Integer> isEven = n -> n % 2 == 0;\nPredicate<Integer> isPositive = n -> n > 0;\nPredicate<Integer> isEvenAndPositive = isEven.and(isPositive);\nSystem.out.println(isEvenAndPositive.test(4));\nSystem.out.println(isEvenAndPositive.test(-2));",
   ["true\nfalse", "false\ntrue", "true\ntrue", "コンパイルエラー"], "true\nfalse")

sq(247,
   "UnaryOperator<T> の説明として正しいものはどれですか？",
   ["T を受け取り T を返す Function の特殊化",
    "T を受け取り boolean を返す関数",
    "引数なしで T を返す関数",
    "T を受け取り副作用のみ起こす関数"],
   "T を受け取り T を返す Function の特殊化")

sq(248,
   "次のコードを実行すると何が出力されますか？\nFunction<String, Integer> len = String::length;\nFunction<Integer, String> str = Object::toString;\nFunction<String, String> composed = len.andThen(str);\nSystem.out.println(composed.apply(\"hello\"));",
   ["5", "hello", "コンパイルエラー", "実行時エラー"], "5")

sq(249,
   "@FunctionalInterface アノテーションの効果として正しいものはどれですか？",
   ["抽象メソッドが1つでない場合にコンパイルエラーにする",
    "インターフェースをラムダ式として使えるようにする（なくても使える）",
    "インターフェースのすべてのメソッドを abstract にする",
    "インターフェースのインスタンス化を許可する"],
   "抽象メソッドが1つでない場合にコンパイルエラーにする")

sq(250,
   "次のコードを実行すると何が出力されますか？\nList<String> words = Arrays.asList(\"apple\", \"banana\", \"cherry\");\nwords.stream()\n    .map(String::length)\n    .reduce(0, Integer::sum);\nSystem.out.println(\"done\");",
   ["done", "17", "0", "コンパイルエラー"], "done")

sq(251,
   "次のコードを実行すると何が出力されますか？\nOptional<String> opt = Optional.of(\"hello\");\nString result = opt.map(String::toUpperCase).orElse(\"empty\");\nSystem.out.println(result);",
   ["HELLO", "hello", "empty", "コンパイルエラー"], "HELLO")

sq(252,
   "コンストラクタ参照 String::new はどのラムダ式と同等ですか？",
   ["() -> new String()", "s -> new String(s)", "どちらも文脈による", "コンストラクタ参照は存在しない"],
   "どちらも文脈による")

sq(253,
   "次のコードを実行すると何が出力されますか？\nOptional<String> opt = Optional.empty();\nSystem.out.println(opt.isPresent());\nSystem.out.println(opt.orElse(\"default\"));",
   ["false\ndefault", "true\ndefault", "false\nnull", "NullPointerException"], "false\ndefault")

sq(254,
   "BinaryOperator<T> が extends しているインターフェースはどれですか？",
   ["BiFunction<T,T,T>", "Function<T,T>", "UnaryOperator<T>", "BiConsumer<T,T>"], "BiFunction<T,T,T>")

sq(255,
   "次のコードを実行すると何が出力されますか？\nList<Integer> list = Arrays.asList(1, 2, 3);\nint result = list.stream()\n    .reduce(10, (a, b) -> a + b);\nSystem.out.println(result);",
   ["16", "6", "10", "コンパイルエラー"], "16")

# ---- Collections / Stream 応用 (25問) ----
sq(256,
   "次のコードを実行すると何が出力されますか？\nMap<String, Integer> map = new HashMap<>();\nmap.put(\"a\", 1);\nmap.put(\"b\", 2);\nmap.putIfAbsent(\"a\", 99);\nSystem.out.println(map.get(\"a\"));",
   ["1", "99", "null", "コンパイルエラー"], "1")

sq(257,
   "TreeSet に Comparable を実装していないオブジェクトを追加するとどうなりますか？",
   ["ClassCastException が発生する",
    "コンパイルエラーになる",
    "そのオブジェクトは無視される",
    "挿入順で格納される"],
   "ClassCastException が発生する")

sq(258,
   "次のコードを実行すると何が出力されますか？\nList<String> list = new ArrayList<>(Arrays.asList(\"a\",\"b\",\"c\",\"a\"));\nlist.removeIf(s -> s.equals(\"a\"));\nSystem.out.println(list);",
   ["[b, c]", "[a, b, c, a]", "[b, c, a]", "コンパイルエラー"], "[b, c]")

sq(259,
   "Comparator.comparing(Person::getName).reversed() の説明として正しいものはどれですか？",
   ["名前の逆順（降順）でソートする Comparator",
    "名前の正順（昇順）でソートする Comparator",
    "コンパイルエラーになる",
    "名前をキーにした Map を返す"],
   "名前の逆順（降順）でソートする Comparator")

sq(260,
   "次のコードを実行すると何が出力されますか？\nList<Integer> nums = Arrays.asList(1,2,3,4,5);\nlong count = nums.stream()\n    .filter(n -> n % 2 == 0)\n    .count();\nSystem.out.println(count);",
   ["2", "3", "5", "コンパイルエラー"], "2")

sq(261,
   "Stream の flatMap と map の違いを正しく説明しているものはどれですか？",
   ["flatMap はネストした Stream を1つに平坦化する、map は各要素を変換する",
    "flatMap と map は全く同じ動作をする",
    "flatMap は並列処理用、map はシーケンシャル処理用",
    "flatMap は終端操作、map は中間操作"],
   "flatMap はネストした Stream を平坦化する、map は各要素を変換する")

sq(262,
   "次のコードを実行すると何が出力されますか？\nList<String> list = Arrays.asList(\"b\",\"a\",\"c\");\nlist.stream()\n    .sorted()\n    .forEach(System.out::print);",
   ["abc", "bac", "cba", "コンパイルエラー"], "abc")

sq(263,
   "Collectors.joining(\", \", \"[\", \"]\") の動作として正しいものはどれですか？",
   ["要素を\", \"で区切り、全体を\"[\"と\"]\"で囲んだ文字列を返す",
    "要素を\"[\"と\"]\"で囲み、\", \"で区切った文字列を返す",
    "コンパイルエラー",
    "空のリストに対して NullPointerException を返す"],
   "要素を\", \"で区切り、全体を\"[\"と\"]\"で囲んだ文字列を返す")

sq(264,
   "次のコードを実行すると何が出力されますか？\nMap<Boolean, List<Integer>> partitioned = Stream.of(1,2,3,4,5)\n    .collect(Collectors.partitioningBy(n -> n % 2 == 0));\nSystem.out.println(partitioned.get(true));",
   ["[2, 4]", "[1, 3, 5]", "[1, 2, 3, 4, 5]", "コンパイルエラー"], "[2, 4]")

sq(265,
   "Stream は一度終端操作を行った後、再利用できますか？",
   ["できない。再利用しようとすると IllegalStateException が発生する",
    "できる。最初に戻ってやり直せる",
    "できる。ただし中間操作からしか再開できない",
    "コンパイルエラーになる"],
   "できない。再利用しようとすると IllegalStateException が発生する")

sq(266,
   "次のコードを実行すると何が出力されますか？\nList<String> list = Arrays.asList(\"a\",\"bb\",\"ccc\");\nOptional<String> longest = list.stream()\n    .max(Comparator.comparingInt(String::length));\nSystem.out.println(longest.get());",
   ["ccc", "a", "bb", "コンパイルエラー"], "ccc")

sq(267,
   "Collectors.groupingBy の説明として正しいものはどれですか？",
   ["要素をキーでグループ化し Map<K, List<T>> を返す",
    "要素をソートして List を返す",
    "要素を true/false に分ける",
    "要素を重複なしにして Set を返す"],
   "要素をキーでグループ化し Map<K, List<T>> を返す")

sq(268,
   "次のコードを実行すると何が出力されますか？\nStream.of(1, 2, 3)\n    .peek(n -> System.out.print(n + \" \"))\n    .filter(n -> n > 1)\n    .forEach(n -> {});",
   ["1 2 3 ", "2 3 ", "何も出力されない", "コンパイルエラー"], "1 2 3 ")

sq(269,
   "List.of() で作成したリストの特徴として正しいものはどれですか？",
   ["変更不可（add/remove/set は UnsupportedOperationException）",
    "変更可能（通常の ArrayList と同じ）",
    "null を含むことができる",
    "Collections.unmodifiableList() と全く同じ動作"],
   "変更不可（add/remove/set は UnsupportedOperationException）")

sq(270,
   "次のコードを実行すると何が出力されますか？\nMap<String, Long> freq = Stream.of(\"a\",\"b\",\"a\",\"c\",\"b\",\"a\")\n    .collect(Collectors.groupingBy(s -> s, Collectors.counting()));\nSystem.out.println(freq.get(\"a\"));",
   ["3", "2", "1", "コンパイルエラー"], "3")

sq(271,
   "IntStream.range(0, 5).sum() の結果はどれですか？",
   ["10", "15", "4", "コンパイルエラー"], "10")

sq(272,
   "次のコードを実行すると何が出力されますか？\nList<List<Integer>> nested = Arrays.asList(\n    Arrays.asList(1,2), Arrays.asList(3,4));\nint sum = nested.stream()\n    .flatMapToInt(l -> l.stream().mapToInt(Integer::intValue))\n    .sum();\nSystem.out.println(sum);",
   ["10", "4", "[1,2,3,4]", "コンパイルエラー"], "10")

sq(273,
   "Collectors.toUnmodifiableList() で作成したリストに要素を追加しようとするとどうなりますか？",
   ["UnsupportedOperationException が発生する",
    "正常に追加できる",
    "コンパイルエラー",
    "NullPointerException が発生する"],
   "UnsupportedOperationException が発生する")

sq(274,
   "次のコードを実行すると何が出力されますか？\nOptional<Integer> opt = Optional.of(5);\nint result = opt.filter(n -> n > 3).map(n -> n * 2).orElse(0);\nSystem.out.println(result);",
   ["10", "5", "0", "コンパイルエラー"], "10")

sq(275,
   "Map.computeIfAbsent(key, mappingFunction) の動作として正しいものはどれですか？",
   ["key が存在しない場合のみ mappingFunction で値を計算して put する",
    "key が存在する場合も必ず mappingFunction で上書きする",
    "key が存在しない場合は null を put する",
    "常に新しい値で置き換える"],
   "key が存在しない場合のみ mappingFunction で値を計算して put する")

sq(276,
   "次のコードを実行すると何が出力されますか？\nStream.iterate(1, n -> n * 2)\n    .limit(5)\n    .forEach(n -> System.out.print(n + \" \"));",
   ["1 2 4 8 16 ", "1 2 3 4 5 ", "2 4 8 16 32 ", "コンパイルエラー"], "1 2 4 8 16 ")

sq(277,
   "Stream.generate(Math::random).limit(3) について正しい記述はどれですか？",
   ["無限 Stream を生成し、limit(3) で3要素に切り出す",
    "3つのランダム数を格納した配列を返す",
    "コンパイルエラー",
    "実行時に無限ループになる"],
   "無限 Stream を生成し、limit(3) で3要素に切り出す")

sq(278,
   "Collectors.summarizingInt(Integer::intValue) が返すオブジェクトに含まれないものはどれですか？",
   ["median（中央値）", "count（件数）", "sum（合計）", "average（平均）"], "median（中央値）")

sq(279,
   "次のコードを実行すると何が出力されますか？\nList<String> list = Arrays.asList(\"a\",\"b\",\"c\");\nString result = list.stream()\n    .collect(Collectors.joining(\"-\"));\nSystem.out.println(result);",
   ["a-b-c", "abc", "-a-b-c-", "コンパイルエラー"], "a-b-c")

sq(280,
   "Map.merge(key, value, remappingFunction) の動作として正しいものはどれですか？",
   ["key が存在する場合は remappingFunction で既存値と value をマージ、ない場合は value を put",
    "key が存在する場合は value で上書き、ない場合は何もしない",
    "常に remappingFunction の結果で置き換える",
    "コンパイルエラー"],
   "key が存在する場合は remappingFunction で既存値と value をマージ、ない場合は value を put")

# ---- var / switch / モジュール / record (20問) ----
sq(281,
   "var の使える場所として正しいものはどれですか？",
   ["ローカル変数の宣言（メソッド内）",
    "メソッドの引数",
    "クラスのフィールド",
    "メソッドの戻り値型"],
   "ローカル変数の宣言（メソッド内）")

sq(282,
   "次のコードを実行すると何が出力されますか？\nvar list = new ArrayList<String>();\nlist.add(\"hello\");\nSystem.out.println(list.get(0).toUpperCase());",
   ["HELLO", "hello", "コンパイルエラー", "実行時エラー"], "HELLO")

sq(283,
   "var に null を代入しようとするとどうなりますか？",
   ["コンパイルエラー（型推論できない）",
    "コンパイルできる。実行時に NullPointerException",
    "コンパイルできる。var は Object 型として扱われる",
    "実行できる"],
   "コンパイルエラー（型推論できない）")

sq(284,
   "switch 式（Java 14+）の -> 構文について正しい説明はどれですか？",
   ["各ケースの処理を書け、break は不要でフォールスルーしない",
    "各ケースの最後に break が必要",
    "従来の switch 文と全く同じ動作",
    "yield が使えない"],
   "各ケースの処理を書け、break は不要でフォールスルーしない")

sq(285,
   "次のコードを実行すると何が出力されますか？\nint day = 2;\nString name = switch (day) {\n  case 1 -> \"Mon\";\n  case 2 -> \"Tue\";\n  case 3 -> \"Wed\";\n  default -> \"Other\";\n};\nSystem.out.println(name);",
   ["Tue", "Mon", "Wed", "コンパイルエラー"], "Tue")

sq(286,
   "record 型について正しい説明はどれですか？",
   ["フィールドは自動的に private final になり、getter・equals・hashCode・toString が自動生成される",
    "record はインターフェースを implements できない",
    "record のフィールドは変更可能（setterが自動生成される）",
    "record はクラスを extends できる"],
   "フィールドは自動的に private final になり、getter・equals・hashCode・toString が自動生成される")

sq(287,
   "次のコードを実行すると何が出力されますか？\nrecord Point(int x, int y) {}\nPoint p = new Point(3, 4);\nSystem.out.println(p.x() + \" \" + p.y());",
   ["3 4", "コンパイルエラー（getterはgetX()形式）", "実行時エラー", "0 0"], "3 4")

sq(288,
   "sealed class について正しい説明はどれですか？",
   ["permits で指定されたクラスしか継承できない",
    "一切継承できない（final と同じ）",
    "abstract クラスにしか使えない",
    "インターフェースには使えない"],
   "permits で指定されたクラスしか継承できない")

sq(289,
   "sealed class を継承したクラスが持てる修飾子として正しいものはどれですか？",
   ["final、sealed、non-sealed のいずれか",
    "必ず final でなければならない",
    "必ず sealed でなければならない",
    "abstract でなければならない"],
   "final、sealed、non-sealed のいずれか")

sq(290,
   "テキストブロック（Java 15+）の開始区切り文字はどれですか？",
   ["\"\"\"（三重引用符）の後に改行",
    "\"\"\"（三重引用符）単独",
    "'''（三重シングルクォート）",
    "```（バッククォート三重）"],
   "\"\"\"（三重引用符）の後に改行")

sq(291,
   "module-info.java で exports パッケージを宣言する目的はどれですか？",
   ["そのパッケージを他のモジュールから使えるようにする",
    "そのパッケージを暗号化する",
    "そのパッケージのクラスを自動的にインスタンス化する",
    "依存モジュールを宣言する"],
   "そのパッケージを他のモジュールから使えるようにする")

sq(292,
   "module-info.java の requires キーワードの意味はどれですか？",
   ["他のモジュールへの依存を宣言する",
    "このモジュールが提供するパッケージを宣言する",
    "リフレクションを許可するパッケージを宣言する",
    "サービス実装を宣言する"],
   "他のモジュールへの依存を宣言する")

sq(293,
   "instanceof のパターンマッチング（Java 16+）について正しい説明はどれですか？",
   ["if (obj instanceof String s) の s は if ブロック内で使える型チェック済み変数",
    "if (obj instanceof String s) の s はグローバルスコープ",
    "パターン変数は必ず final である",
    "Java 8 からサポートされている"],
   "if (obj instanceof String s) の s は if ブロック内で使える型チェック済み変数")

sq(294,
   "次のコードを実行すると何が出力されますか？\nObject obj = \"hello\";\nif (obj instanceof String s && s.length() > 3) {\n  System.out.println(s.toUpperCase());\n} else {\n  System.out.println(\"no\");\n}",
   ["HELLO", "hello", "no", "コンパイルエラー"], "HELLO")

sq(295,
   "Optional.get() を空の Optional に対して呼ぶとどうなりますか？",
   ["NoSuchElementException が発生する",
    "null が返る",
    "NullPointerException が発生する",
    "コンパイルエラー"],
   "NoSuchElementException が発生する")

sq(296,
   "String の formatted() メソッド（Java 15+）の説明として正しいものはどれですか？",
   ["String.format() と同じ機能をインスタンスメソッドとして提供する",
    "文字列をフォーマットして byte[] で返す",
    "文字列に含まれる変数を自動的に展開する",
    "コンパイルエラー（formatted() は存在しない）"],
   "String.format() と同じ機能をインスタンスメソッドとして提供する")

sq(297,
   "次のコードを実行すると何が出力されますか？\nvar sb = new StringBuilder();\nsb.append(\"Hello\");\nsb.append(\" World\");\nSystem.out.println(sb.toString());",
   ["Hello World", "Hello\nWorld", "コンパイルエラー", "実行時エラー"], "Hello World")

sq(298,
   "Predicate.not() （Java 11+）の説明として正しいものはどれですか？",
   ["Predicate を否定した Predicate を返す static メソッド",
    "Predicate を null に変換する",
    "Predicate を直列化する",
    "Java 8 から利用可能"],
   "Predicate を否定した Predicate を返す static メソッド")

sq(299,
   "次のコードを実行すると何が出力されますか？\nrecord Person(String name, int age) {}\nPerson p1 = new Person(\"Alice\", 30);\nPerson p2 = new Person(\"Alice\", 30);\nSystem.out.println(p1.equals(p2));",
   ["true", "false", "コンパイルエラー", "実行時エラー"], "true")

sq(300,
   "EnumSet の特徴として正しいものはどれですか？",
   ["enum 専用の高効率な Set 実装（ビット演算ベース）",
    "null を許可する",
    "挿入順を保持する",
    "スレッドセーフである"],
   "enum 専用の高効率な Set 実装（ビット演算ベース）")

# ─────────────────────────────────────────
# 3. Gold 追加問題 40問 (jg161~jg200)
# ─────────────────────────────────────────
G = []

def gq(idx, q, choices, answer):
    G.append({'id':f'jg{idx}','main':'プログラミング','sub':'Java Gold','level':9,
              'question':q,'choices':choices,'answer':answer})

# ---- 並行処理 (20問) ----
gq(161,
   "次のコードを実行すると何が出力されますか？\nAtomicInteger ai = new AtomicInteger(0);\nfor (int i = 0; i < 5; i++) ai.incrementAndGet();\nSystem.out.println(ai.get());",
   ["5", "0", "不定（スレッドセーフでないため）", "コンパイルエラー"], "5")

gq(162,
   "volatile キーワードが保証するものとして正しいものはどれですか？",
   ["可視性（書き込みが他スレッドから即座に見える）。ただし複合操作の原子性は保証しない",
    "可視性と原子性の両方を保証する",
    "synchronized と同等のロック機構を提供する",
    "デッドロックを防止する"],
   "可視性（書き込みが他スレッドから即座に見える）。ただし複合操作の原子性は保証しない")

gq(163,
   "CountDownLatch と CyclicBarrier の違いとして正しいものはどれですか？",
   ["CountDownLatch は一度限り、CyclicBarrier はリセットして再利用できる",
    "CountDownLatch は再利用でき、CyclicBarrier は一度限り",
    "両者は完全に同じ機能を持つ",
    "CountDownLatch はスレッドのみ使えるが CyclicBarrier はプロセス間でも使える"],
   "CountDownLatch は一度限り、CyclicBarrier はリセットして再利用できる")

gq(164,
   "ExecutorService の shutdown() と shutdownNow() の違いとして正しいものはどれですか？",
   ["shutdown() は実行中タスクの完了を待ってから停止、shutdownNow() は実行中タスクも中断しようとする",
    "shutdown() と shutdownNow() は全く同じ動作",
    "shutdownNow() は実行中タスクの完了を待ってから停止する",
    "shutdown() は即座にスレッドを kill する"],
   "shutdown() は実行中タスクの完了を待ってから停止、shutdownNow() は実行中タスクも中断しようとする")

gq(165,
   "CompletableFuture の thenApply と thenCompose の違いとして正しいものはどれですか？",
   ["thenApply は同期的な変換、thenCompose は別の CompletableFuture を返す非同期変換（flatMap 相当）",
    "thenApply と thenCompose は全く同じ動作",
    "thenCompose は同期的な変換、thenApply は非同期変換",
    "thenApply は例外処理専用"],
   "thenApply は同期的な変換、thenCompose は別の CompletableFuture を返す非同期変換（flatMap 相当）")

gq(166,
   "次のコードを実行すると何が出力されますか？\nReentrantLock lock = new ReentrantLock();\nlock.lock();\ntry {\n  lock.lock(); // 再入\n  System.out.println(lock.getHoldCount());\n} finally {\n  lock.unlock();\n  lock.unlock();\n}",
   ["2", "1", "デッドロック", "コンパイルエラー"], "2")

gq(167,
   "Semaphore の用途として最も適切なものはどれですか？",
   ["同時アクセス数を制限するリソース制御（例：DB接続プールの上限管理）",
    "スレッドを一定時間スリープさせる",
    "複数スレッドの実行順序を保証する",
    "デッドロックを自動的に検出・解決する"],
   "同時アクセス数を制限するリソース制御（例：DB接続プールの上限管理）")

gq(168,
   "ThreadLocal の説明として正しいものはどれですか？",
   ["各スレッドが独自の変数コピーを持つため、スレッド間で値が共有されない",
    "スレッド間で値を共有するためのグローバル変数",
    "スレッドセーフなコレクション",
    "複数スレッドが同時に読み書きできるキュー"],
   "各スレッドが独自の変数コピーを持つため、スレッド間で値が共有されない")

gq(169,
   "ForkJoinPool の RecursiveTask と RecursiveAction の違いはどれですか？",
   ["RecursiveTask は結果を返す、RecursiveAction は結果を返さない（void相当）",
    "RecursiveAction は結果を返す、RecursiveTask は結果を返さない",
    "両者は完全に同じ動作をする",
    "RecursiveTask はシングルスレッド専用"],
   "RecursiveTask は結果を返す、RecursiveAction は結果を返さない（void相当）")

gq(170,
   "CompletableFuture.exceptionally(fn) の説明として正しいものはどれですか？",
   ["前のステージが例外完了した場合に fn で代替値を提供する",
    "正常完了した場合に fn を実行する",
    "例外が発生しても何もしない",
    "コンパイルエラー（exceptionally は存在しない）"],
   "前のステージが例外完了した場合に fn で代替値を提供する")

gq(171,
   "Executors.newCachedThreadPool() の特徴として正しいものはどれですか？",
   ["必要に応じてスレッドを生成し、60秒使われないスレッドを解放する",
    "スレッド数が固定で変化しない",
    "常に1スレッドで順次実行する",
    "スレッドをキャッシュせず毎回新しく生成する"],
   "必要に応じてスレッドを生成し、60秒使われないスレッドを解放する")

gq(172,
   "ConcurrentHashMap を HashMap の代わりに使うべき理由はどれですか？",
   ["マルチスレッド環境でのスレッドセーフな操作のため",
    "HashMap より常に高速だから",
    "null キーを許可しないため",
    "イテレーション時に ConcurrentModificationException を投げないため"],
   "マルチスレッド環境でのスレッドセーフな操作のため")

gq(173,
   "synchronized ブロックと ReentrantLock の違いとして正しいものはどれですか？",
   ["ReentrantLock はタイムアウト付きのロック取得（tryLock）、割り込み可能なロック取得ができる",
    "synchronized の方が常にパフォーマンスが良い",
    "ReentrantLock は再入不可（再入するとデッドロック）",
    "両者は完全に同じ機能を持つ"],
   "ReentrantLock はタイムアウト付きのロック取得（tryLock）、割り込み可能なロック取得ができる")

gq(174,
   "CompletableFuture.thenCombine(other, fn) の動作として正しいものはどれですか？",
   ["this と other の両方が完了した後に fn を実行し、新しい CompletableFuture を返す",
    "this か other のどちらかが完了した時点で fn を実行する",
    "this と other を直列につなぎ順次実行する",
    "コンパイルエラー"],
   "this と other の両方が完了した後に fn を実行し、新しい CompletableFuture を返す")

gq(175,
   "BlockingQueue の put() と offer() の違いとして正しいものはどれですか？",
   ["put() はキューが満杯のとき空くまでブロック、offer() はすぐに false を返す",
    "offer() はキューが満杯のとき空くまでブロック、put() はすぐに false を返す",
    "両者は全く同じ動作",
    "put() はスレッドセーフでない"],
   "put() はキューが満杯のとき空くまでブロック、offer() はすぐに false を返す")

gq(176,
   "CopyOnWriteArrayList の特徴として正しいものはどれですか？",
   ["書き込み時に内部配列をコピーするため、読み取りは高速・ロック不要だが書き込みは高コスト",
    "読み取り時にロックするため書き込みは高速",
    "スレッドセーフでない",
    "null 要素を許可しない"],
   "書き込み時に内部配列をコピーするため、読み取りは高速・ロック不要だが書き込みは高コスト")

gq(177,
   "AtomicInteger の compareAndSet(expected, update) の動作として正しいものはどれですか？",
   ["現在値が expected と等しい場合のみ update に変更し true を返す（等しくなければ false）",
    "常に update に変更して true を返す",
    "expected と update の大きい方をセットする",
    "マルチスレッドでは動作しない"],
   "現在値が expected と等しい場合のみ update に変更し true を返す（等しくなければ false）")

gq(178,
   "ScheduledExecutorService の scheduleAtFixedRate と scheduleWithFixedDelay の違いはどれですか？",
   ["scheduleAtFixedRate は前回開始時刻から、scheduleWithFixedDelay は前回終了時刻から次回を計算する",
    "scheduleWithFixedDelay は前回開始時刻から、scheduleAtFixedRate は前回終了時刻から次回を計算する",
    "両者は完全に同じ動作",
    "scheduleAtFixedRate はスレッドセーフでない"],
   "scheduleAtFixedRate は前回開始時刻から、scheduleWithFixedDelay は前回終了時刻から次回を計算する")

gq(179,
   "Phaser の arriveAndAwaitAdvance() の説明として正しいものはどれですか？",
   ["到着を登録し、全登録者が到着するまでブロックしてフェーズを進める",
    "すぐに次のフェーズに進み他の参加者を待たない",
    "Phaser を終了させる",
    "コンパイルエラー（arriveAndAwaitAdvance は存在しない）"],
   "到着を登録し、全登録者が到着するまでブロックしてフェーズを進める")

gq(180,
   "デッドロックが発生する条件として誤っているものはどれですか？",
   ["スレッドが同一のロックを複数回取得できる（再入可能）",
    "スレッドが複数のリソースを互いに待ち合う循環待機が存在する",
    "スレッドが保持したリソースを強制的に奪われない（非横取り）",
    "リソースへの排他アクセスが存在する"],
   "スレッドが同一のロックを複数回取得できる（再入可能）")

# ---- Stream / 関数型 高度 (10問) ----
gq(181,
   "次のコードを実行すると何が出力されますか？\nList<String> list = Arrays.asList(\"apple\",\"banana\",\"avocado\");\nMap<Character, List<String>> grouped = list.stream()\n    .collect(Collectors.groupingBy(s -> s.charAt(0)));\nSystem.out.println(grouped.get('a').size());",
   ["2", "1", "3", "コンパイルエラー"], "2")

gq(182,
   "Collectors.teeing(down1, down2, merger) の説明として正しいものはどれですか？（Java 12+）",
   ["Stream を2つの Collector に渡し、各結果を merger でマージする",
    "Stream を2つに分割して並列処理する",
    "2つの Stream をマージして1つにする",
    "コンパイルエラー（teeing は存在しない）"],
   "Stream を2つの Collector に渡し、各結果を merger でマージする")

gq(183,
   "次のコードを実行すると何が出力されますか？\nfunction<Integer,Integer> doubler = x -> x * 2;\nfunction<Integer,Integer> adder  = x -> x + 3;\nSystem.out.println(doubler.andThen(adder).apply(5));",
   ["13", "16", "10", "コンパイルエラー（function は小文字）"], "コンパイルエラー（function は小文字）")

gq(184,
   "Map.computeIfPresent(key, remappingFunction) の動作として正しいものはどれですか？",
   ["key が存在する場合のみ remappingFunction を呼び出して値を更新する",
    "key の存在に関わらず remappingFunction を呼ぶ",
    "key が存在しない場合に remappingFunction を呼ぶ",
    "常に null を設定する"],
   "key が存在する場合のみ remappingFunction を呼び出して値を更新する")

gq(185,
   "並列 Stream（parallelStream()）を使う際の注意点として正しいものはどれですか？",
   ["状態を変更する副作用のある操作は避けるべき（スレッドセーフでない場合がある）",
    "parallelStream は常に sequentialStream より速い",
    "parallelStream は常にシングルスレッドで動作する",
    "parallelStream で Collectors.toList() は使えない"],
   "状態を変更する副作用のある操作は避けるべき（スレッドセーフでない場合がある）")

# ---- NIO.2 / I/O (10問) ----
gq(186,
   "Path.resolve(other) の説明として正しいものはどれですか？",
   ["このパスを基準に other を解決して新しい Path を返す",
    "このパスと other の差分（相対パス）を返す",
    "このパスが other と等しいか検証する",
    "コンパイルエラー"],
   "このパスを基準に other を解決して新しい Path を返す")

gq(187,
   "Files.walk(path) の説明として正しいものはどれですか？",
   ["ディレクトリツリーを深さ優先で走査する Stream<Path> を返す",
    "ファイルの内容を行単位で Stream として返す",
    "ディレクトリを再帰的に削除する",
    "コンパイルエラー"],
   "ディレクトリツリーを深さ優先で走査する Stream<Path> を返す")

gq(188,
   "Files.readAllLines(path) の戻り値の型はどれですか？",
   ["List<String>", "String[]", "Stream<String>", "byte[]"], "List<String>")

gq(189,
   "Path.relativize(other) の説明として正しいものはどれですか？",
   ["このパスから other への相対パスを返す",
    "このパスを絶対パスに変換する",
    "このパスと other を結合する",
    "コンパイルエラー"],
   "このパスから other への相対パスを返す")

gq(190,
   "Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING) の動作として正しいものはどれですか？",
   ["source を target にコピーし、target が既に存在する場合は上書きする",
    "target が既に存在する場合は FileAlreadyExistsException",
    "source を削除してから target に移動する",
    "コンパイルエラー"],
   "source を target にコピーし、target が既に存在する場合は上書きする")

# ---- その他 Gold (10問) ----
gq(191,
   "WeakReference の特徴として正しいものはどれですか？",
   ["GC が弱参照のみで参照されているオブジェクトを回収できる",
    "GC が弱参照のオブジェクトを絶対に回収しない",
    "WeakReference はスレッドセーフな参照型",
    "WeakReference を使うとメモリリークが増える"],
   "GC が弱参照のみで参照されているオブジェクトを回収できる")

gq(192,
   "ServiceLoader の uses と provides について正しい説明はどれですか？",
   ["uses はサービスのコンシューマ側（module-info）、provides はサービスの実装提供側（module-info）",
    "uses はサービスの実装提供側、provides はコンシューマ側",
    "uses と provides はどちらも同じ用途で使える",
    "module-info.java の外でしか宣言できない"],
   "uses はサービスのコンシューマ側（module-info）、provides はサービスの実装提供側（module-info）")

gq(193,
   "JVM のヒープ領域に格納されるものとして正しいものはどれですか？",
   ["new で生成されたオブジェクト",
    "ローカル変数（プリミティブ型）",
    "メソッドの引数",
    "クラスのバイトコード"],
   "new で生成されたオブジェクト")

gq(194,
   "String.intern() の説明として正しいものはどれですか？",
   ["文字列プールに同じ内容の文字列があればその参照を返す（なければ追加して返す）",
    "文字列を不変にする",
    "文字列を圧縮して格納する",
    "コンパイルエラー"],
   "文字列プールに同じ内容の文字列があればその参照を返す（なければ追加して返す）")

gq(195,
   "Comparator.comparing(Person::getAge).thenComparing(Person::getName) の動作として正しいものはどれですか？",
   ["年齢で主ソート、年齢が同じ場合は名前でソート",
    "名前で主ソート、名前が同じ場合は年齢でソート",
    "コンパイルエラー",
    "年齢と名前を足した値でソート"],
   "年齢で主ソート、年齢が同じ場合は名前でソート")

gq(196,
   "次のコードを実行すると何が出力されますか？\nCompletableFuture<Integer> cf = CompletableFuture\n    .supplyAsync(() -> 10)\n    .thenApply(n -> n * 2)\n    .thenApply(n -> n + 1);\nSystem.out.println(cf.join());",
   ["21", "20", "11", "コンパイルエラー"], "21")

gq(197,
   "Collectors.toMap でキーの重複が発生した場合のデフォルト動作はどれですか？",
   ["IllegalStateException が発生する",
    "後から来た値で上書きされる",
    "最初の値が保持される",
    "コンパイルエラー"],
   "IllegalStateException が発生する")

gq(198,
   "次のコードを実行すると何が出力されますか？\nList<Integer> list = Arrays.asList(5, 3, 1, 4, 2);\nOptional<Integer> min = list.stream().min(Comparator.naturalOrder());\nSystem.out.println(min.orElse(-1));",
   ["1", "5", "3", "-1"], "1")

gq(199,
   "Function.identity() の説明として正しいものはどれですか？",
   ["引数をそのまま返す関数（t -> t）",
    "常に null を返す関数",
    "引数の hashCode を返す関数",
    "引数の toString() を返す関数"],
   "引数をそのまま返す関数（t -> t）")

gq(200,
   "次のコードを実行すると何が出力されますか？\nMap<String, Integer> map = new HashMap<>();\nmap.put(\"x\", 1);\nmap.merge(\"x\", 10, Integer::sum);\nmap.merge(\"y\", 10, Integer::sum);\nSystem.out.println(map.get(\"x\") + \" \" + map.get(\"y\"));",
   ["11 10", "10 10", "1 10", "コンパイルエラー"], "11 10")

# ─────────────────────────────────────────
# 4. すべてを questions.ts に追記
# ─────────────────────────────────────────
def ts_entry(q):
    """dict → TypeScript オブジェクトリテラル文字列"""
    def esc(s):
        return s.replace('\\','\\\\').replace('"','\\"').replace('\n','\\n')
    choices_ts = ', '.join(f'"{esc(c)}"' for c in q['choices'])
    return (f'  {{ id: "{q["id"]}", main: "{esc(q["main"])}", sub: "{esc(q["sub"])}", '
            f'level: {q["level"]}, '
            f'question: "{esc(q["question"])}", '
            f'choices: [{choices_ts}], '
            f'answer: "{esc(q["answer"])}" }},')

with open('src/data/questions.ts', 'rb') as f:
    original = f.read().decode('utf-8')

# Find insertion point: just before the closing "];" of the array
# The file ends with something like:  ...last question },\n];\n
insert_pos = original.rfind('];')
if insert_pos == -1:
    print("ERROR: couldn't find ]; in questions.ts")
    sys.exit(1)

all_new = new_silver + new_gold + S + G
print(f"Adding {len(all_new)} questions total")
print(f"  Silver from json: {len(new_silver)}")
print(f"  Gold from json:   {len(new_gold)}")
print(f"  Silver direct:    {len(S)}")
print(f"  Gold direct:      {len(G)}")

lines_to_add = '\n'.join(ts_entry(q) for q in all_new)
new_content = original[:insert_pos] + lines_to_add + '\n' + original[insert_pos:]

with open('src/data/questions.ts', 'wb') as f:
    f.write(new_content.encode('utf-8'))

print("Done! Verifying counts...")

import re
with open('src/data/questions.ts', 'rb') as f:
    content = f.read().decode('utf-8')
silver_ids = re.findall(r'id: "js(\d+)"', content)
gold_ids   = re.findall(r'id: "jg(\d+)"', content)
print(f"Silver total: {len(silver_ids)}, max: js{max(silver_ids, key=int) if silver_ids else 0}")
print(f"Gold   total: {len(gold_ids)},   max: jg{max(gold_ids, key=int) if gold_ids else 0}")
EOF