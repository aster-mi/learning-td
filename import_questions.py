"""
JSON問題ファイルを questions.ts に追記するスクリプト
usage: python import_questions.py <file.json> [bronze_start] [silver_start] [gold_start]
"""
import json, re, sys, os

def clean_question(q):
    q = re.sub(r'```java\n?', '', q)
    q = re.sub(r'```\n?', '', q)
    return q.strip()

def strip_prefix(choice):
    return re.sub(r'^[A-Da-d][.．]\s*', '', choice).strip()

def get_answer_text(choices, answer_letter):
    idx = ord(answer_letter.strip().upper()) - ord('A')
    return strip_prefix(choices[idx])

def esc(s):
    s = s.replace('\\', '\\\\')
    s = s.replace('"', '\\"')
    s = s.replace('\n', '\\n')
    s = s.replace('\r', '')
    return s

# ── 現在の最終IDを questions.ts から読む ──
ts_path = r"src\data\questions.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

def get_max_id(prefix, content):
    """jb, js, jg のプレフィックスで最大番号を取得"""
    ids = re.findall(rf'id: "{prefix}(\d+)"', content)
    return max((int(x) for x in ids), default=0)

bronze_next = get_max_id('jb', ts_content) + 1
silver_next = get_max_id('js', ts_content) + 1
gold_next   = get_max_id('jg', ts_content) + 1

print(f"Current max IDs: Bronze jb{bronze_next-1}, Silver js{silver_next-1}, Gold jg{gold_next-1}")

# ── ファイルを処理 ──
files = sys.argv[1:] if len(sys.argv) > 1 else []
if not files:
    # 利用可能な全ファイルを自動検出
    candidates = [
        'java_exam_questions2.json',
        'java_b_extra.json',
        'java_s_extra1.json',
        'java_s_extra2.json',
        'java_g_extra.json',
    ]
    files = [f for f in candidates if os.path.exists(f)]
    print(f"Auto-detected files: {files}")

lines = []
total_added = {'bronze': 0, 'silver': 0, 'gold': 0}

cat_cfg = {
    'bronze': ('jb', 'Java Bronze', 7),
    'silver': ('js', 'Java Silver', 8),
    'gold':   ('jg', 'Java Gold',   9),
}
counters = {
    'bronze': bronze_next,
    'silver': silver_next,
    'gold':   gold_next,
}

for filepath in files:
    if not os.path.exists(filepath):
        print(f"SKIP (not found): {filepath}")
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    for cat in ['bronze', 'silver', 'gold']:
        qs = data.get(cat, [])
        if not qs:
            continue
        prefix, sub_name, level = cat_cfg[cat]
        start = counters[cat]
        section_lines = []
        for i, q in enumerate(qs):
            qid = f"{prefix}{start + i:02d}"
            question_raw = clean_question(q.get("question", ""))
            choices_raw  = [strip_prefix(c) for c in q.get("choices", [])]
            ans_letter   = q.get("answer", "A")
            answer_text  = get_answer_text(q["choices"], ans_letter)

            question_esc = esc(question_raw)
            choices_esc  = [esc(c) for c in choices_raw]
            answer_esc   = esc(answer_text)

            choices_ts = "[" + ",".join(f'"{c}"' for c in choices_esc) + "]"
            line = (
                f'  {{ id: "{qid}", main: "プログラミング", sub: "{sub_name}", '
                f'level: {level}, question: "{question_esc}", '
                f'choices: {choices_ts}, answer: "{answer_esc}" }},'
            )
            section_lines.append(line)

        if section_lines:
            end_id = f"{prefix}{start + len(qs) - 1:02d}"
            lines.append(f"\n  // ── {sub_name} ({filepath}: {qid[:2]}{start:02d}〜{end_id}) ──")
            lines.extend(section_lines)
            counters[cat] += len(qs)
            total_added[cat] += len(qs)
            print(f"  {sub_name}: +{len(qs)} questions from {filepath}")

if not lines:
    print("Nothing to add.")
    sys.exit(0)

output = "\n".join(lines)
insert_pos = ts_content.rfind("\n];")
if insert_pos == -1:
    print("ERROR: ]; not found in questions.ts")
    sys.exit(1)

new_ts = ts_content[:insert_pos] + "\n" + output + "\n" + ts_content[insert_pos:]
with open(ts_path, "w", encoding="utf-8") as f:
    f.write(new_ts)

print(f"\nDone! Added: Bronze +{total_added['bronze']}, Silver +{total_added['silver']}, Gold +{total_added['gold']}")
print(f"New totals (approx): Bronze ~{bronze_next-1+total_added['bronze']}, Silver ~{silver_next-1+total_added['silver']}, Gold ~{gold_next-1+total_added['gold']}")
