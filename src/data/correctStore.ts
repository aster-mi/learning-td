/**
 * 正解した問題の記録・管理（localStorage）
 *
 * 保存形式: { [questionId]: { count, lastCorrect } }
 *   - 正解するたびにカウント+1
 *   - 出題優先度の重み付けに使用（多く正解した問題は出にくくなる）
 */

const STORAGE_KEY = "learning_td_correct_history";
const MAX_ENTRY_AGE_DAYS = 120;
const MAX_ENTRIES = 500;

export interface CorrectEntry {
  /** 正解した回数 */
  count: number;
  /** 最後に正解した日時 (ISO) */
  lastCorrect: string;
}

type CorrectMap = Record<string, CorrectEntry>;

function load(): CorrectMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? pruneMap(JSON.parse(raw) as CorrectMap) : {};
  } catch (e) {
    console.warn("[CorrectStore] Failed to load:", e);
    return {};
  }
}

function save(map: CorrectMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pruneMap(map)));
  } catch (e) {
    console.warn("[CorrectStore] Failed to save:", e);
  }
}

function pruneMap(map: CorrectMap): CorrectMap {
  const cutoff = Date.now() - MAX_ENTRY_AGE_DAYS * 24 * 60 * 60 * 1000;
  return Object.fromEntries(
    Object.entries(map)
      .filter(([, entry]) => {
        const timestamp = Date.parse(entry.lastCorrect);
        return Number.isFinite(entry.count) && Number.isFinite(timestamp) && timestamp >= cutoff;
      })
      .sort(([, left], [, right]) => right.lastCorrect.localeCompare(left.lastCorrect))
      .slice(0, MAX_ENTRIES),
  );
}

/** 正解した問題を記録 */
export function recordCorrect(questionId: string) {
  const map = load();
  const prev = map[questionId];
  map[questionId] = {
    count: prev ? prev.count + 1 : 1,
    lastCorrect: new Date().toISOString(),
  };
  save(map);
}

/** 問題IDごとの正解回数マップを取得 */
export function getCorrectMap(): CorrectMap {
  return load();
}

/** 特定の問題の正解回数を取得 */
export function getCorrectCount(questionId: string): number {
  const map = load();
  return map[questionId]?.count ?? 0;
}

/** 全記録をクリア */
export function clearAllCorrect() {
  localStorage.removeItem(STORAGE_KEY);
}
