/**
 * 間違えた問題の記録・管理（localStorage）
 *
 * 保存形式: { [questionId]: wrongCount }
 *   - 間違えるたびにカウント+1
 *   - 復習モードで正解したらエントリ削除
 */

const STORAGE_KEY = "learning_td_wrong_answers";

export interface WrongEntry {
  /** 間違えた回数 */
  count: number;
  /** 最後に間違えた日時 (ISO) */
  lastWrong: string;
}

type WrongMap = Record<string, WrongEntry>;

function load(): WrongMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WrongMap) : {};
  } catch {
    return {};
  }
}

function save(map: WrongMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/** 間違えた問題を記録 */
export function recordWrong(questionId: string) {
  const map = load();
  const prev = map[questionId];
  map[questionId] = {
    count: prev ? prev.count + 1 : 1,
    lastWrong: new Date().toISOString(),
  };
  save(map);
}

/** 復習で正解 → 記録を削除 */
export function removeWrong(questionId: string) {
  const map = load();
  delete map[questionId];
  save(map);
}

/** 間違えた問題IDの一覧を取得 */
export function getWrongIds(): string[] {
  return Object.keys(load());
}

/** 間違えた問題の総数 */
export function getWrongCount(): number {
  return Object.keys(load()).length;
}

/** 全記録をクリア */
export function clearAllWrong() {
  localStorage.removeItem(STORAGE_KEY);
}
