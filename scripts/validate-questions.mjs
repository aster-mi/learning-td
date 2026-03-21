import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const questionDir = path.join(root, "src", "data", "questionBanks");
const baselinePath = path.join(root, ".ai", "question_validation_baseline.json");

const args = new Set(process.argv.slice(2));
const writeBaseline = args.has("--write-baseline");
const strictText = args.has("--strict-text");

function loadLinesFromDirectory(dirPath) {
  const files = fs
    .readdirSync(dirPath)
    .filter((name) => name.endsWith(".jsonl"))
    .sort((a, b) => a.localeCompare(b, "en"));

  const lines = [];
  for (const name of files) {
    const filePath = path.join(dirPath, name);
    const raw = fs.readFileSync(filePath, "utf8").trim();
    if (!raw) continue;
    lines.push(...raw.split(/\r?\n/));
  }
  return lines;
}

function looksMojibake(text) {
  if (!text || typeof text !== "string") return false;
  if (text.includes("�")) return true;
  // UTF-8誤解釈で頻出する文字群を検知（完全一致ではなくヒューリスティック）
  const mojibakeTokens = ["縺", "繧", "繝", "譛", "螟", "驥", "莠", "鬘", "邨"];
  let hits = 0;
  for (const token of mojibakeTokens) {
    if (text.includes(token)) hits++;
    if (hits >= 2) return true;
  }
  return false;
}

function looksLeadingChoice(choice) {
  if (!choice || typeof choice !== "string") return false;
  // 露骨な誘導になりやすいパターン
  if (choice.includes("→") || choice.includes("->")) return true;
  if (choice.includes("正解") || choice.includes("答え")) return true;
  if (/（[^）]*(?:意味|だから|つまり|答え|正解|=|→)[^）]*）/.test(choice)) return true;
  return false;
}

function validateRows(rows) {
  const structuralErrors = [];
  const warnings = [];
  const textIssues = {
    mojibake: [],
    leading_choice: [],
  };

  const ids = new Set();

  rows.forEach((row, i) => {
    const lineNo = i + 1;
    const id = row?.id ?? `(line:${lineNo})`;

    if (!row || typeof row !== "object") {
      structuralErrors.push(`[line ${lineNo}] invalid JSON object`);
      return;
    }

    for (const key of ["id", "main", "sub", "level", "question", "choices", "answer"]) {
      if (!(key in row)) {
        structuralErrors.push(`[${id}] missing key: ${key}`);
      }
    }

    if (typeof row.id !== "string" || row.id.length === 0) {
      structuralErrors.push(`[line ${lineNo}] id must be non-empty string`);
    } else if (ids.has(row.id)) {
      structuralErrors.push(`[${row.id}] duplicated id`);
    } else {
      ids.add(row.id);
    }

    if (!Array.isArray(row.choices)) {
      structuralErrors.push(`[${id}] choices must be array`);
    } else {
      if (row.choices.length !== 4) {
        structuralErrors.push(`[${id}] choices length must be 4 (actual: ${row.choices.length})`);
      }
      const uniq = new Set(row.choices);
      if (uniq.size !== row.choices.length) {
        warnings.push(`[${id}] duplicate choices detected`);
      }
      if (!row.choices.includes(row.answer)) {
        structuralErrors.push(`[${id}] answer is not included in choices`);
      }

      if (row.choices.some(looksLeadingChoice)) {
        textIssues.leading_choice.push(id);
      }
      if (row.choices.some((c) => looksMojibake(c))) {
        textIssues.mojibake.push(id);
      }
    }

    if (typeof row.level !== "number" || !Number.isInteger(row.level) || row.level < 1 || row.level > 10) {
      structuralErrors.push(`[${id}] level must be integer 1..10`);
    }

    if (typeof row.question !== "string" || row.question.trim().length === 0) {
      structuralErrors.push(`[${id}] question must be non-empty string`);
    } else if (looksMojibake(row.question)) {
      textIssues.mojibake.push(id);
    }

    if (typeof row.answer !== "string" || row.answer.trim().length === 0) {
      structuralErrors.push(`[${id}] answer must be non-empty string`);
    } else if (looksMojibake(row.answer)) {
      textIssues.mojibake.push(id);
    }
  });

  for (const k of Object.keys(textIssues)) {
    textIssues[k] = [...new Set(textIssues[k])].sort();
  }

  return { structuralErrors, warnings, textIssues };
}

function loadBaseline() {
  if (!fs.existsSync(baselinePath)) {
    return { mojibake: [], leading_choice: [] };
  }
  const data = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  return {
    mojibake: Array.isArray(data.mojibake) ? data.mojibake : [],
    leading_choice: Array.isArray(data.leading_choice) ? data.leading_choice : [],
  };
}

function saveBaseline(textIssues) {
  const out = {
    mojibake: textIssues.mojibake,
    leading_choice: textIssues.leading_choice,
  };
  fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
  fs.writeFileSync(baselinePath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
}

function diffNewIssues(current, baseline) {
  const base = new Set(baseline);
  return current.filter((id) => !base.has(id));
}

function parseRows(lines) {
  const rows = [];
  const parseErrors = [];
  lines.forEach((line, i) => {
    try {
      rows.push(JSON.parse(line));
    } catch (e) {
      parseErrors.push(`[line ${i + 1}] JSON parse error: ${e.message}`);
    }
  });
  return { rows, parseErrors };
}

function printList(title, arr) {
  if (arr.length === 0) return;
  console.error(`${title} (${arr.length})`);
  for (const item of arr.slice(0, 30)) {
    console.error(`  - ${item}`);
  }
  if (arr.length > 30) {
    console.error(`  ... and ${arr.length - 30} more`);
  }
}

function main() {
  const lines = loadLinesFromDirectory(questionDir);
  const { rows, parseErrors } = parseRows(lines);
  const { structuralErrors, warnings, textIssues } = validateRows(rows);

  if (writeBaseline) {
    saveBaseline(textIssues);
    console.log(`baseline written: ${path.relative(root, baselinePath)}`);
    console.log(`mojibake=${textIssues.mojibake.length}, leading_choice=${textIssues.leading_choice.length}`);
    process.exit(0);
  }

  const baseline = loadBaseline();
  const newMojibake = diffNewIssues(textIssues.mojibake, baseline.mojibake);
  const newLeading = diffNewIssues(textIssues.leading_choice, baseline.leading_choice);

  const failByText = strictText
    ? (textIssues.mojibake.length > 0 || textIssues.leading_choice.length > 0)
    : (newMojibake.length > 0 || newLeading.length > 0);

  if (parseErrors.length > 0 || structuralErrors.length > 0 || failByText) {
    printList("Parse Errors", parseErrors);
    printList("Structural Errors", structuralErrors);
    if (strictText) {
      printList("Text Issues: mojibake", textIssues.mojibake);
      printList("Text Issues: leading_choice", textIssues.leading_choice);
    } else {
      printList("New Text Issues: mojibake", newMojibake);
      printList("New Text Issues: leading_choice", newLeading);
    }
    process.exit(1);
  }

  if (warnings.length > 0) {
    printList("Warnings", warnings);
  }
  console.log("questions validation: OK");
}

main();
