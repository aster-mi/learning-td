import type { Question } from "./questionMeta";
export {
  LEVEL_ALL,
  LEVEL_DEFS,
  MAIN_CATEGORY_META,
  SUB_CATEGORIES,
  type Level,
  type MainCategory,
  type Question,
} from "./questionMeta";

let questionsCache: Question[] | null = null;

function parseQuestions(raw: string): Question[] {
  return raw
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as Question);
}

export async function loadQuestions(): Promise<Question[]> {
  if (questionsCache) return questionsCache;
  const mod = await import("./questions.jsonl?raw");
  questionsCache = parseQuestions(mod.default);
  return questionsCache;
}

export function getQuestionsCache(): Question[] | null {
  return questionsCache;
}
