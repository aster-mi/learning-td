import { useCallback, useRef, useState } from "react";
import { CategorySelect } from "./scenes/CategorySelect";
import { StageSelect } from "./scenes/StageSelect";
// WorldSelect is now nested inside StageSelect
import { GameScene } from "./scenes/GameScene";
import { PartySelect } from "./scenes/PartySelect";
import { stages } from "./data/stages";
import { LEVEL_DEFS, SUB_CATEGORIES } from "./data/questions";
import { getWrongCount } from "./data/wrongStore";
import { loadSave, saveSave } from "./data/saveData";
import { getNewAchievements } from "./data/achievements";
import { getTodayChallenge } from "./data/dailyChallenge";
import { claimMission, ensureLoginProgress } from "./data/progression";
import { AchievementToast } from "./components/AchievementToast";
import { AchievementList } from "./components/AchievementList";
import { GachaModal, type GachaReward } from "./components/GachaModal";
import { useWindowSize } from "./hooks/useWindowSize";
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
  const { isMobile } = useWindowSize();
  const [scene, setSceneRaw]              = useState<"category" | "select" | "party" | "gacha" | "game" | "achievements">("category");
  const setScene = useCallback((s: typeof scene) => { window.scrollTo(0, 0); setSceneRaw(s); }, []);
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [clearedStages, setClearedStages] = useState<Set<number>>(loadCleared);
  const [subCategories, setSubCategories] = useState<string[]>(loadSubCategories);
  const [selectedLevel, setSelectedLevel] = useState<number>(loadLevel);
  const [reviewMode, setReviewMode]       = useState(false);
  const [isDailyMode, setIsDailyMode]     = useState(false);
  const [saveData, setSaveData]           = useState(() => {
    const next = ensureLoginProgress(loadSave());
    saveSave(next);
    return next;
  });
  const gameKeyRef = useRef<number>(0);

  // Achievement toast
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

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

  const updateSaveData = useCallback((updater: (current: ReturnType<typeof loadSave>) => ReturnType<typeof loadSave>) => {
    const current = loadSave();
    const next = updater(current);
    saveSave(next);
    setSaveData(next);
    return next;
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

  // ステージ選択 → 直接ゲームへ（パーティ編成は任意）
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

  // パーティ編成（ワールドマップから任意アクセス）
  const handlePartyConfirm = (party: string[]) => {
    updateSaveData(current => ({ ...current, party }));
    setScene("select");
  };

  // ガチャ結果処理（コイン消費 + ユニット/バフ追加）
  const handleGachaPull = (reward: GachaReward, cost: number) => {
    const save = loadSave();
    save.coins -= cost;
    if (reward.type === "unit" && reward.unitEntry) {
      if (!save.unlockedUnits.includes(reward.unitEntry.id)) {
        save.unlockedUnits.push(reward.unitEntry.id);
      } else {
        save.coins += reward.coins ?? 50;
      }
    } else if (reward.type === "buff") {
      save.gachaItems.push({
        type: reward.buffType ?? "unknown",
        value: 1,
      });
    } else if (reward.type === "coins" && reward.coins) {
      save.coins += reward.coins;
    }
    saveSave(save);
    setSaveData(save);
  };

  const handleClaimMission = useCallback((missionId: string, rewardCoins: number) => {
    updateSaveData(current => claimMission(current, missionId, rewardCoins));
  }, [updateSaveData]);

  const handleClear = (stageId: number) => {
    setClearedStages(prev => {
      const next = new Set(prev);
      next.add(stageId);
      saveCleared(next);
      return next;
    });
    const save = loadSave();
    setSaveData(save);
    checkAchievements();
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
        <div key="category" className="scene-enter"><CategorySelect
          initialSelected={subCategories}
          initialLevel={selectedLevel}
          onConfirm={handleCategoryConfirm}
          wrongCount={getWrongCount()}
          onReview={handleReviewStart}
        /></div>
      )}
      {scene === "select" && (
        <div key="select" className="scene-enter"><StageSelect
          stageStars={saveData.stageStars}
          clearedStages={clearedStages}
          coins={saveData.coins}
          saveData={saveData}
          onBack={() => { setSaveData(loadSave()); setScene("category"); }}
          onDaily={handleDailyChallenge}
          onAchievements={() => setScene("achievements")}
          onParty={() => setScene("party")}
          onGacha={() => { setSaveData(loadSave()); setScene("gacha"); }}
          onSelect={handleStageSelect}
          onClaimMission={handleClaimMission}
        /></div>
      )}
      {scene === "party" && (
        <div key="party" className="scene-enter"><PartySelect
          saveData={saveData}
          ownedUnitIds={saveData.unlockedUnits}
          currentParty={saveData.party}
          onConfirm={handlePartyConfirm}
          onSaveData={next => {
            saveSave(next);
            setSaveData(next);
          }}
          onBack={() => setScene("select")}
        /></div>
      )}
      {scene === "gacha" && (
        <div key="gacha" className="scene-enter"><GachaModal
          coins={saveData.coins}
          ownedUnitIds={saveData.unlockedUnits}
          onPull={handleGachaPull}
          onClose={() => { setSaveData(loadSave()); setScene("select"); }}
          isMobile={isMobile}
        /></div>
      )}
      {scene === "achievements" && (
        <div key="achievements" className="scene-enter"><AchievementList
          unlockedIds={saveData.achievements}
          onClose={() => setScene("select")}
        /></div>
      )}
      {scene === "game" && (
        <div key="game" className="scene-enter"><GameScene
          key={gameKeyRef.current}
          stage={activeStage}
          subCategories={effectiveSubs}
          selectedLevel={selectedLevel}
          onBack={handleBack}
          onClear={handleClear}
          onRetry={handleRetry}
          reviewMode={reviewMode}
          party={saveData.party}
          isDailyChallenge={isDailyMode}
          saveData={saveData}
        /></div>
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
