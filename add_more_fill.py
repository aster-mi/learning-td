#!/usr/bin/env python3
"""Fill remaining questions to reach 200 per elementary level."""
import re

# Lv.1: need 1 more (199→200)
# Lv.2: need 5 more (195→200)
# Lv.4: need 20 more (180→200)
# Lv.6: need 5 more (195→200)

new_questions = [
    # Lv.1 +1
    { "id": "m475", "main": "算数", "sub": "四則計算", "level": 1, "question": "6 + 6 = ?", "choices": ["10", "11", "12", "13"], "answer": "12" },

    # Lv.2 +5
    { "id": "m476", "main": "算数", "sub": "四則計算", "level": 2, "question": "45 + 37 = ?", "choices": ["72", "82", "83", "92"], "answer": "82" },
    { "id": "s388", "main": "理科", "sub": "生物・地学", "level": 2, "question": "たんぽぽのたねは どうやって とぶ？", "choices": ["はねで とぶ", "わたげで かぜにのる", "みずに うく", "どうぶつにくっつく"], "answer": "わたげで かぜにのる" },
    { "id": "k293", "main": "国語", "sub": "漢字・読み", "level": 2, "question": "「朝」のよみかたは？", "choices": ["あさ", "ひる", "よる", "ゆう"], "answer": "あさ" },
    { "id": "c251", "main": "社会", "sub": "地理", "level": 2, "question": "がっこうの まわりの ちずを つくるとき たいせつなのは？", "choices": ["きれいにぬること", "ほういをたしかめること", "おおきくかくこと", "いろをぬること"], "answer": "ほういをたしかめること" },
    { "id": "e246", "main": "英語", "sub": "英単語", "level": 2, "question": "「sun」は にほんごで なに？", "choices": ["つき", "ほし", "たいよう", "くも"], "answer": "たいよう" },

    # Lv.4 +20
    { "id": "m477", "main": "算数", "sub": "四則計算", "level": 4, "question": "3.6 + 2.7 = ?", "choices": ["5.3", "6.3", "6.2", "5.7"], "answer": "6.3" },
    { "id": "m478", "main": "算数", "sub": "四則計算", "level": 4, "question": "5.2 - 1.8 = ?", "choices": ["3.4", "3.6", "4.4", "3.0"], "answer": "3.4" },
    { "id": "m479", "main": "算数", "sub": "四則計算", "level": 4, "question": "72 ÷ 8 = ?", "choices": ["7", "8", "9", "10"], "answer": "9" },
    { "id": "m480", "main": "算数", "sub": "図形・面積", "level": 4, "question": "平行四辺形の向かい合う辺の特徴は？", "choices": ["直角に交わる", "長さが等しく平行", "曲がっている", "長さが違う"], "answer": "長さが等しく平行" },
    { "id": "m481", "main": "算数", "sub": "四則計算", "level": 4, "question": "1億は1万の何倍？", "choices": ["100倍", "1000倍", "10000倍", "100000倍"], "answer": "10000倍" },
    { "id": "s389", "main": "理科", "sub": "物理・化学", "level": 4, "question": "水を熱し続けるとどうなる？", "choices": ["氷になる", "水蒸気になる", "色が変わる", "甘くなる"], "answer": "水蒸気になる" },
    { "id": "s390", "main": "理科", "sub": "生物・地学", "level": 4, "question": "月が輝いて見えるのはなぜ？", "choices": ["自分で光を出すから", "太陽の光を反射するから", "電気があるから", "空気が光るから"], "answer": "太陽の光を反射するから" },
    { "id": "s391", "main": "理科", "sub": "物理・化学", "level": 4, "question": "金属に共通する性質は？", "choices": ["透明", "電気を通す", "水に浮く", "やわらかい"], "answer": "電気を通す" },
    { "id": "s392", "main": "理科", "sub": "生物・地学", "level": 4, "question": "骨と骨のつなぎ目を何という？", "choices": ["筋肉", "関節", "じん帯", "血管"], "answer": "関節" },
    { "id": "s393", "main": "理科", "sub": "物理・化学", "level": 4, "question": "空気中でもっとも多い気体は？", "choices": ["酸素", "二酸化炭素", "窒素", "水素"], "answer": "窒素" },
    { "id": "k294", "main": "国語", "sub": "漢字・読み", "level": 4, "question": "「競争」の読み方は？", "choices": ["きょうそう", "きそう", "けいそう", "きょうあらそう"], "answer": "きょうそう" },
    { "id": "k295", "main": "国語", "sub": "熟語・慣用句", "level": 4, "question": "「花より団子」の意味は？", "choices": ["花が美しい", "風流より実利を好む", "団子がおいしい", "花を食べる"], "answer": "風流より実利を好む" },
    { "id": "k296", "main": "国語", "sub": "漢字・読み", "level": 4, "question": "「博物館」の読み方は？", "choices": ["はくぶつかん", "ひろものかん", "ばくぶつかん", "はくものかん"], "answer": "はくぶつかん" },
    { "id": "k297", "main": "国語", "sub": "熟語・慣用句", "level": 4, "question": "「目から鱗が落ちる」の意味は？", "choices": ["目が悪くなる", "急に物事がわかる", "涙が出る", "目が疲れる"], "answer": "急に物事がわかる" },
    { "id": "c252", "main": "社会", "sub": "地理", "level": 4, "question": "日本の都道府県はいくつ？", "choices": ["43", "45", "47", "50"], "answer": "47" },
    { "id": "c253", "main": "社会", "sub": "地理", "level": 4, "question": "日本で一番面積が大きい都道府県は？", "choices": ["東京都", "北海道", "長野県", "新潟県"], "answer": "北海道" },
    { "id": "c254", "main": "社会", "sub": "歴史", "level": 4, "question": "「ごみのリサイクル」で正しいのは？", "choices": ["すべて燃やす", "分別して資源にする", "川に流す", "庭に埋める"], "answer": "分別して資源にする" },
    { "id": "e247", "main": "英語", "sub": "英単語", "level": 4, "question": "「library」の意味は？", "choices": ["病院", "図書館", "公園", "駅"], "answer": "図書館" },
    { "id": "e248", "main": "英語", "sub": "英文法", "level": 4, "question": "「There are five books on the desk.」で本は何冊？", "choices": ["3冊", "4冊", "5冊", "6冊"], "answer": "5冊" },
    { "id": "e249", "main": "英語", "sub": "英単語", "level": 4, "question": "「Wednesday」は何曜日？", "choices": ["月曜日", "水曜日", "金曜日", "日曜日"], "answer": "水曜日" },

    # Lv.6 +5
    { "id": "s394", "main": "理科", "sub": "物理・化学", "level": 6, "question": "てこの原理で、支点から力点が遠いほどどうなる？", "choices": ["力が大きく必要", "小さい力で動かせる", "動かない", "速く動く"], "answer": "小さい力で動かせる" },
    { "id": "k298", "main": "国語", "sub": "熟語・慣用句", "level": 6, "question": "「温故知新」の意味は？", "choices": ["新しいことだけ学ぶ", "古いものを捨てる", "古きを温めて新しきを知る", "温かい気持ちで接する"], "answer": "古きを温めて新しきを知る" },
    { "id": "c255", "main": "社会", "sub": "歴史", "level": 6, "question": "江戸幕府の初代将軍は？", "choices": ["豊臣秀吉", "織田信長", "徳川家康", "源頼朝"], "answer": "徳川家康" },
    { "id": "c256", "main": "社会", "sub": "歴史", "level": 6, "question": "明治維新の中心人物でないのは？", "choices": ["西郷隆盛", "大久保利通", "木戸孝允", "徳川慶喜"], "answer": "徳川慶喜" },
    { "id": "e250", "main": "英語", "sub": "英文法", "level": 6, "question": "「If I were you, I would study harder.」は何法？", "choices": ["命令法", "仮定法", "直接法", "受動態"], "answer": "仮定法" },
]

# Convert to TypeScript
def to_ts(q):
    choices_str = ', '.join(f'"{c}"' for c in q["choices"])
    return f'  {{ id: "{q["id"]}", main: "{q["main"]}", sub: "{q["sub"]}", level: {q["level"]}, question: "{q["question"]}", choices: [{choices_str}], answer: "{q["answer"]}" }},'

ts_lines = [to_ts(q) for q in new_questions]

with open('src/data/questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Insert before the last ];
last_bracket = content.rfind('];')
# Find the export line
export_pos = content.rfind('export const questions')
# Insert before the ]; that comes just before the export line
bracket_before_export = content.rfind('];', 0, export_pos)

new_content = content[:bracket_before_export] + '\n'.join(ts_lines) + '\n' + content[bracket_before_export:]

with open('src/data/questions.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f'Added {len(new_questions)} questions')

# Verify counts
items = re.findall(r'level: (\d+)', new_content)
from collections import Counter
c = Counter(int(x) for x in items)
for lv in range(1, 7):
    print(f'Lv.{lv}: {c[lv]}')
print(f'Total: {sum(c.values())}')
