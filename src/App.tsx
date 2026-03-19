import { useCallback, useRef, useState } from "react";
import { CategorySelect } from "./scenes/CategorySelect";
import { StageSelect } from "./scenes/StageSelect";
import { GameScene } from "./scenes/GameScene";
import { stages } from "./data/stages";
import { LEVEL_DEFS, SUB_CATEGORIES } from "./data/questions";
import { getWrongCount } from "./data/wrongStore";
import { loadSave, saveSave } from "./data/saveData";
import { getNewAchievements } from "./data/achievements";
import { getTodayChallenge } from "./data/dailyChallenge";
import { AchievementToast } from "./components/AchievementToast";
import { AchievementList } from "./components/AchievementList";
import { GachaModal, type GachaReward } from "./components/GachaModal";
import type { Achievement } from "./data/achievements";

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
  const [scene, setScene]                 = useState<"category" | "select" | "game" | "achievements">("category");
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [clearedStages, setClearedStages] = useState<Set<number>>(loadCleared);
  const [subCategories, setSubCategories] = useState<string[]>(loadSubCategories);
  const [selectedLevel, setSelectedLevel] = useState<number>(loadLevel);
  const [reviewMode, setReviewMode]       = useState(false);
  const [isDailyMode, setIsDailyMode]     = useState(false);
  const [saveData, setSaveData]           = useState(() => loadSave());
  const gameKeyRef = useRef<number>(0);

  // Achievement toast
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  // Gacha state
  const [showGacha, setShowGacha] = useState(false);
  const [gachaStars, setGachaStars] = useState(1);

  const checkAchievements = useCallback(() => {
    const save = loadSave();
    const newOnes = getNewAchievements(save, save.achievements);
    if (newOnes.length > 0) {
      save.achievements.push(...newOnes.map(a => a.id));
      saveSave(save);
      setSaveData(save);
      setNewAchievements(newOnes);
    }
  }, []);

  const handleCategoryConfirm = (selected: string[], level: number) => {
    setSubCategories(selected);
    saveSubCategories(selected);
    setSelectedLevel(level);
    saveLevel(level);
    setReviewMode(false);
    setIsDailyMode(false);
    setScene("select");
  };

  const handleReviewStart = () => {
    setReviewMode(true);
    setIsDailyMode(false);
    gameKeyRef.current += 1;
    setActiveStageId(1);
    setScene("game");
  };

  const handleStageSelect = (stageId: number) => {
    gameKeyRef.current += 1;
    setActiveStageId(stageId);
    setIsDailyMode(false);
    setScene("game");
  };

  const handleDailyChallenge = () => {
    const daily = getTodayChallenge();
    gameKeyRef.current += 1;
    setActiveStageId(daily.stageId);
    setIsDailyMode(true);
    setScene("game");
  };

  const handleClear = (stageId: number) => {
    setClearedStages(prev => {
      const next = new Set(prev);
      next.add(stageId);
      saveCleared(next);
      return next;
    });
    const save = loadSave();
    setSaveData(save);

    // Show gacha
    const stars = save.stageStars[stageId] ?? 1;
    setGachaStars(stars);
    setShowGacha(true);

    checkAchievements();
  };

  const handleGachaClose = (reward: GachaReward) => {
    setShowGacha(false);
    const save = loadSave();
    if (reward.type === "coins") {
      save.coins += reward.value;
    } else {
      save.gachaItems.push({ type: reward.type, value: reward.value });
    }
    saveSave(save);
    setSaveData(save);
  };

  const handleRetry = () => {
    gameKeyRef.current += 1;
    setScene("game");
  };

  const handleBack = () => {
    setReviewMode(false);
    setIsDailyMode(false);
    setSaveData(loadSave());
    setScene(reviewMode ? "category" : "select");
  };

  const activeStage = stages.find(s => s.id === activeStageId) ?? stages[0];

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
          onDaily={handleDailyChallenge}
          onAchievements={() => setScene("achievements")}
        />
      )}
      {scene === "achievements" && (
        <AchievementList
          unlockedIds={saveData.achievements}
          onClose={() => setScene("select")}
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
          isDailyChallenge={isDailyMode}
        />
      )}

      {/* Gacha after stage clear */}
      {showGacha && (
        <GachaModal
          stars={gachaStars}
          onClose={handleGachaClose}
          isMobile={window.innerWidth < 768}
        />
      )}

      {/* Achievement toasts */}
      {newAchievements.length > 0 && (
        <AchievementToast
          achievements={newAchievements}
          onDone={() => setNewAchievements([])}
        />
      )}
    </>
  );
}
