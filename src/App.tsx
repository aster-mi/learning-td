import { useRef, useState } from "react";
import { CategorySelect } from "./scenes/CategorySelect";
import { StageSelect } from "./scenes/StageSelect";
import { GameScene } from "./scenes/GameScene";
import { stages } from "./data/stages";
import { LEVEL_DEFS, SUB_CATEGORIES } from "./data/questions";
import { getWrongCount } from "./data/wrongStore";
import { loadSave } from "./data/saveData";

const STORAGE_KEY        = "learning_td_cleared";
const STORAGE_SUBS_KEY   = "learning_td_subcategories";
const STORAGE_LEVELS_KEY = "learning_td_level";

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
const MAX_LEVEL = Math.max(...LEVEL_DEFS.map(l => l.level));
function loadLevel(): number {
  try {
    const raw = localStorage.getItem(STORAGE_LEVELS_KEY);
    return raw ? (JSON.parse(raw) as number) : MAX_LEVEL;
  } catch { return MAX_LEVEL; }
}
function saveLevel(level: number) {
  localStorage.setItem(STORAGE_LEVELS_KEY, JSON.stringify(level));
}

export default function App() {
  const [scene, setScene]                 = useState<"category" | "select" | "game">("category");
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [clearedStages, setClearedStages] = useState<Set<number>>(loadCleared);
  const [subCategories, setSubCategories] = useState<string[]>(loadSubCategories);
  const [selectedLevel, setSelectedLevel] = useState<number>(loadLevel);
  const [reviewMode, setReviewMode]       = useState(false);
  const [saveData, setSaveData]           = useState(() => loadSave());
  const gameKeyRef = useRef<number>(0);

  const handleCategoryConfirm = (selected: string[], level: number) => {
    setSubCategories(selected);
    saveSubCategories(selected);
    setSelectedLevel(level);
    saveLevel(level);
    setReviewMode(false);
    setScene("select");
  };

  const handleReviewStart = () => {
    setReviewMode(true);
    gameKeyRef.current += 1;
    setActiveStageId(1);
    setScene("game");
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
    // セーブデータを再読込（GameSceneで保存済み）
    setSaveData(loadSave());
  };

  const handleRetry = () => {
    gameKeyRef.current += 1;
    // force re-render of GameScene with same stageId
    setScene("game");
  };

  const handleBack = () => {
    setReviewMode(false);
    setSaveData(loadSave());
    setScene(reviewMode ? "category" : "select");
  };

  const activeStage = stages.find(s => s.id === activeStageId)!;

  const effectiveSubs = subCategories.length > 0
    ? subCategories
    : SUB_CATEGORIES.map(s => s.name);

  return (
    <>
      {scene === "category" && (
        <CategorySelect
          initialSelected={subCategories}
          initialLevel={selectedLevel}
          onConfirm={handleCategoryConfirm}
          wrongCount={getWrongCount()}
          onReview={handleReviewStart}
        />
      )}
      {scene === "select" && (
        <StageSelect
          clearedStages={clearedStages}
          stageStars={saveData.stageStars}
          coins={saveData.coins}
          onSelect={handleStageSelect}
          onBack={() => { setSaveData(loadSave()); setScene("category"); }}
        />
      )}
      {scene === "game" && (
        <GameScene
          key={gameKeyRef.current}
          stage={activeStage}
          subCategories={effectiveSubs}
          selectedLevel={selectedLevel}
          onBack={handleBack}
          onClear={handleClear}
          onRetry={handleRetry}
          reviewMode={reviewMode}
          unlockedUnits={saveData.unlockedUnits}
        />
      )}
    </>
  );
}
