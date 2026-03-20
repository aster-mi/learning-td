#!/usr/bin/env python3
"""Export questions from questions.ts to questions.jsonl"""
import re
import json

with open('src/data/questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

questions = []

for line in content.split('\n'):
    line = line.strip()
    if not line.startswith('{ id:'):
        continue
    if line.endswith(','):
        line = line[:-1]

    try:
        # Extract simple fields
        id_m = re.search(r'id: "([^"]*)"', line)
        main_m = re.search(r'main: "([^"]*)"', line)
        sub_m = re.search(r'sub: "([^"]*)"', line)
        level_m = re.search(r'level: (\d+)', line)

        # Extract question (may contain escaped quotes)
        q_marker = 'question: "'
        q_start = line.find(q_marker) + len(q_marker)
        # Scan forward to find closing quote before ', choices:'
        pos = q_start
        while pos < len(line):
            ch = line[pos]
            if ch == '\\' and pos + 1 < len(line):
                pos += 2
                continue
            if ch == '"':
                rest = line[pos+1:]
                if rest.startswith(', choices:'):
                    break
            pos += 1
        question_text = line[q_start:pos]

        # Extract choices
        c_start = line.find('choices: [', pos) + len('choices: [')
        c_end = line.find(']', c_start)
        choices_raw = line[c_start:c_end]
        choices = re.findall(r'"([^"]*)"', choices_raw)

        # Extract answer
        a_marker = 'answer: "'
        a_start = line.find(a_marker, c_end) + len(a_marker)
        # Find the closing quote (last " before })
        a_end = line.rfind('"')
        answer_text = line[a_start:a_end]

        obj = {
            'id': id_m.group(1),
            'main': main_m.group(1),
            'sub': sub_m.group(1),
            'level': int(level_m.group(1)),
            'question': question_text,
            'choices': choices,
            'answer': answer_text
        }
        questions.append(obj)
    except Exception as e:
        print(f'ERROR on: {line[:120]}')
        print(f'  {e}')

print(f'Parsed {len(questions)} questions')

with open('src/data/questions.jsonl', 'w', encoding='utf-8') as f:
    for q in questions:
        f.write(json.dumps(q, ensure_ascii=False) + '\n')

# Verify counts per level
from collections import Counter
c = Counter(q['level'] for q in questions)
for lv in sorted(c.keys()):
    print(f'  Lv.{lv}: {c[lv]}')
print(f'  Total: {sum(c.values())}')
print('questions.jsonl written')
