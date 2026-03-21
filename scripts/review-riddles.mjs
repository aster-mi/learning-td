/**
 * なぞなぞ問題の自動品質チェック
 * - 正答が選択肢に含まれるか
 * - 重複問題（同じ問題文）
 * - 選択肢の重複
 * - IDの重複
 * - レベル分布
 * - 問題文が短すぎ/長すぎ
 */
import { readFileSync } from "fs";

const lines = readFileSync("src/data/questionBanks/riddle.jsonl", "utf-8")
  .trim()
  .split("\n");

const questions = lines.map((line, i) => {
  try {
    return { ...JSON.parse(line), _line: i + 1 };
  } catch {
    return { _line: i + 1, _error: "JSON parse error" };
  }
});

let issues = 0;

// 1. Parse errors
for (const q of questions) {
  if (q._error) {
    console.log(`❌ Line ${q._line}: ${q._error}`);
    issues++;
  }
}

const valid = questions.filter((q) => !q._error);

// 2. Answer not in choices
for (const q of valid) {
  if (!q.choices.includes(q.answer)) {
    console.log(`❌ ${q.id} (L${q._line}): 正答「${q.answer}」が選択肢に含まれていない`);
    issues++;
  }
}

// 3. Duplicate IDs
const idMap = new Map();
for (const q of valid) {
  if (idMap.has(q.id)) {
    console.log(`❌ ${q.id} (L${q._line}): ID重複 (元: L${idMap.get(q.id)})`);
    issues++;
  } else {
    idMap.set(q.id, q._line);
  }
}

// 4. Duplicate questions (same question text)
const textMap = new Map();
for (const q of valid) {
  if (textMap.has(q.question)) {
    console.log(`⚠️  ${q.id} (L${q._line}): 問題文重複「${q.question.slice(0, 30)}...」(元: ${textMap.get(q.question)})`);
    issues++;
  } else {
    textMap.set(q.question, q.id);
  }
}

// 5. Duplicate choices within same question
for (const q of valid) {
  const unique = new Set(q.choices);
  if (unique.size !== q.choices.length) {
    console.log(`❌ ${q.id} (L${q._line}): 選択肢に重複あり: ${JSON.stringify(q.choices)}`);
    issues++;
  }
}

// 6. Question too short/long
for (const q of valid) {
  if (q.question.length < 5) {
    console.log(`⚠️  ${q.id} (L${q._line}): 問題文が短い (${q.question.length}文字): 「${q.question}」`);
    issues++;
  }
  if (q.question.length > 100) {
    console.log(`⚠️  ${q.id} (L${q._line}): 問題文が長い (${q.question.length}文字)`);
    issues++;
  }
}

// 7. Choice count
for (const q of valid) {
  if (q.choices.length !== 4) {
    console.log(`⚠️  ${q.id} (L${q._line}): 選択肢が4つではない (${q.choices.length}つ)`);
    issues++;
  }
}

// 8. Level distribution
const levelDist = {};
for (const q of valid) {
  levelDist[q.level] = (levelDist[q.level] || 0) + 1;
}

// Summary
console.log("\n=== なぞなぞ品質レビュー結果 ===");
console.log(`総問題数: ${valid.length}`);
console.log(`検出問題数: ${issues}`);
console.log(`レベル分布:`, levelDist);

const subs = {};
for (const q of valid) {
  subs[q.sub] = (subs[q.sub] || 0) + 1;
}
console.log(`サブカテゴリ分布:`, subs);

if (issues === 0) {
  console.log("✅ すべてのチェックに合格しました！");
} else {
  console.log(`\n${issues}件の問題が見つかりました。`);
}
