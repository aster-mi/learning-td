import {
  MAIN_CATEGORY_ORDER,
  SUB_CATEGORIES,
  type MainCategory,
  type Question,
} from "./questionMeta";

export {
  LEVEL_ALL,
  LEVEL_DEFS,
  MAIN_CATEGORY_META,
  MAIN_CATEGORY_ORDER,
  SUB_CATEGORIES,
  type Level,
  type MainCategory,
  type Question,
} from "./questionMeta";

type QuestionModule = { default: string };

const questionLoaders: Record<MainCategory, () => Promise<QuestionModule>> = {
  算数: () => import("./questionBanks/math.jsonl?raw"),
  国語: () => import("./questionBanks/language.jsonl?raw"),
  理科: () => import("./questionBanks/science.jsonl?raw"),
  社会: () => import("./questionBanks/social.jsonl?raw"),
  英語: () => import("./questionBanks/english.jsonl?raw"),
  プログラミング: () => import("./questionBanks/programming.jsonl?raw"),
  雑学: () => import("./questionBanks/trivia.jsonl?raw"),
  なぞなぞ: () => import("./questionBanks/riddle.jsonl?raw"),
};

const categoryCache = new Map<MainCategory, Question[]>();

function parseQuestions(raw: string): Question[] {
  return raw
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as Question);
}

function uniqueMainCategories(mainCategories: MainCategory[]): MainCategory[] {
  return [...new Set(mainCategories)].sort(
    (left, right) => MAIN_CATEGORY_ORDER.indexOf(left) - MAIN_CATEGORY_ORDER.indexOf(right),
  );
}

function getMainCategoriesFromSubCategories(subCategories: string[]): MainCategory[] {
  const mains = SUB_CATEGORIES
    .filter((subCategory) => subCategories.includes(subCategory.name))
    .map((subCategory) => subCategory.main);
  return uniqueMainCategories(mains);
}

async function loadCategoryQuestions(mainCategory: MainCategory): Promise<Question[]> {
  const cached = categoryCache.get(mainCategory);
  if (cached) return cached;

  const mod = await questionLoaders[mainCategory]();
  const parsed = parseQuestions(mod.default);
  categoryCache.set(mainCategory, parsed);
  return parsed;
}

export async function loadQuestions(options?: { subCategories?: string[] }): Promise<Question[]> {
  const requestedMainCategories =
    options?.subCategories && options.subCategories.length > 0
      ? getMainCategoriesFromSubCategories(options.subCategories)
      : MAIN_CATEGORY_ORDER;

  const mainCategories = requestedMainCategories.length > 0 ? requestedMainCategories : MAIN_CATEGORY_ORDER;
  const chunks = await Promise.all(mainCategories.map((mainCategory) => loadCategoryQuestions(mainCategory)));
  return chunks.flat();
}

export function getQuestionsCache(options?: { subCategories?: string[] }): Question[] | null {
  const requestedMainCategories =
    options?.subCategories && options.subCategories.length > 0
      ? getMainCategoriesFromSubCategories(options.subCategories)
      : MAIN_CATEGORY_ORDER;

  const mainCategories = requestedMainCategories.length > 0 ? requestedMainCategories : MAIN_CATEGORY_ORDER;
  if (!mainCategories.every((mainCategory) => categoryCache.has(mainCategory))) {
    return null;
  }

  return mainCategories.flatMap((mainCategory) => categoryCache.get(mainCategory) ?? []);
}
