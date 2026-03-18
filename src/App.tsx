import { useRef, useState } from "react";
import { CategorySelect } from "./scenes/CategorySelect";
import { StageSelect } from "./scenes/StageSelect";
import { GameScene } from "./scenes/GameScene";
import { stages } from "./data/stages";
import { LEVEL_DEFS, SUB_CATEGORIES } from "./data/questions";

const STORAGE_KEY        = "learning_td_cleared";
const STORAGE_SUBS_KEY   = "learning_td_subcategories";
const STORAGE_LEVELS_KEY = "learning_td_levels";

function loadCleared(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch { return new Set(); }
}
function saveCleared(s: Set<number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...s]));
}
function loadSubCategories(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_SUBS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}
function saveSubCategories(subs: string[]) {
  localStorage.setItem(STORAGE_SUBS_KEY, JSON.stringify(subs));
}
function loadLevels(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_LEVELS_KEY);
    return raw ? (JSON.parse(raw) as number[]) : LEVEL_DEFS.map(l => l.level);
  } catch { return LEVEL_DEFS.map(l => l.level); }
}
function saveLevels(levels: number[]) {
  localStorage.setItem(STORAGE_LEVELS_KEY, JSON.stringify(levels));
}

export default function App() {
  const [scene, setScene]                 = useState<"category" | "select" | "game">("category");
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [clearedStages, setClearedStages] = useState<Set<number>>(loadCleared);
  const [subCategories, setSubCategories] = useState<string[]>(loadSubCategories);
  const [selectedLevels, setSelectedLevels] = useState<number[]>(loadLevels);
  const gameKeyRef = useRef<number>(0);

  const handleCategoryConfirm = (selected: string[], levels: number[]) => {
    setSubCategories(selected);
    saveSubCategories(selected);
    setSelectedLevels(levels);
    saveLevels(levels);
    setScene("select");
  };

  const handleStageSelect = (stageId: number) => {
    gameKeyRef.current += 1;
    setActiveStageId(stageId);
    setScene("game");
  };

  const handleClear = (stageId: number) => {
    setClearedStages(prev => {
      const next = new Set(prev);
      next.add(stageId);
      saveCleared(next);
      return next;
    });
  };

  const activeStage = stages.find(s => s.id === activeStageId)!;

  // subCategories が空の場合は全サブカテゴリを使う（初回起動時）
  const effectiveSubs = subCategories.length > 0
    ? subCategories
    : SUB_CATEGORIES.map(s => s.name);

  return (
    <>
      {scene === "category" && (
        <CategorySelect
          initialSelected={subCategories}
          initialLevels={selectedLevels}
          onConfirm={handleCategoryConfirm}
        />
      )}
      {scene === "select" && (
        <StageSelect
          clearedStages={clearedStages}
          onSelect={handleStageSelect}
          onBack={() => setScene("category")}
        />
      )}
      {scene === "game" && (
        <GameScene
          key={gameKeyRef.current}
          stage={activeStage}
          subCategories={effectiveSubs}
          selectedLevels={selectedLevels}
          onBack={() => setScene("select")}
          onClear={handleClear}
        />
      )}
    </>
  );
}
