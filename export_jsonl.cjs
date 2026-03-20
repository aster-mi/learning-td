// Export questions from questions.ts to questions.jsonl using Node.js
const fs = require('fs');

const content = fs.readFileSync('src/data/questions.ts', 'utf-8');

const lines = content.split('\n');
const questions = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('{ id:')) continue;

  // Remove trailing comma
  let obj = trimmed;
  if (obj.endsWith(',')) obj = obj.slice(0, -1);

  // Evaluate as JS object literal
  try {
    const q = eval('(' + obj + ')');
    questions.push(q);
  } catch (e) {
    console.error('Failed to parse:', obj.substring(0, 100));
    console.error(e.message);
  }
}

console.log(`Parsed ${questions.length} questions`);

// Write JSONL
const jsonlLines = questions.map(q => JSON.stringify(q));
fs.writeFileSync('src/data/questions.jsonl', jsonlLines.join('\n') + '\n', 'utf-8');

// Count per level
const counts = {};
for (const q of questions) {
  counts[q.level] = (counts[q.level] || 0) + 1;
}
for (const lv of Object.keys(counts).sort((a, b) => a - b)) {
  console.log(`  Lv.${lv}: ${counts[lv]}`);
}
console.log(`  Total: ${questions.length}`);
