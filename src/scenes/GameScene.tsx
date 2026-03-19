import { useCallback, useEffect, useRef, useState } from "react";
import { GameEngine, type GameState } from "../domain/GameEngine";
import { UNIT_DEFS, type UnitType } from "../domain/Unit";
import { QuizPanel } from "../components/QuizPanel";
import { BattleCanvas } from "../components/BattleCanvas";
import { CommandPanel } from "../components/CommandPanel";
import { ResultScreen } from "../components/ResultScreen";
import { useWindowSize } from "../hooks/useWindowSize";
import { calcStars, calcCoins, getNewUnlock, loadSave, saveSave } from "../data/saveData";
import { getTodayChallenge, completeDailyChallenge } from "../data/dailyChallenge";
import type { StageData } from "../data/stages";

interface Props {
  stage: StageData;
  subCategories: string[];
  selectedLevel: number;
  onBack: () => void;
  onClear: (stageId: number) => void;
  onRetry: () => void;
  reviewMode?: boolean;
  unlockedUnits?: string[];
  isDailyChallenge?: boolean;
}

const MAX_ENERGY           = 100;
const ENERGY_PER_CORRECT   = 10;
const ENERGY_PENALTY_WRONG = 5;
const ACTIVE_DURATION_SEC  = 5;

export function GameScene({ stage, subCategories, selectedLevel, onBack, onClear, onRetry, reviewMode, unlockedUnits, isDailyChallenge }: Props) {
  const { isMobile } = useWindowSize();
  const engineRef    = useRef<GameEngine>(new GameEngine(stage, selectedLevel));
  const lastTickRef  = useRef<number>(Date.now());
  const rafRef       = useRef<number>(0);

  // Ref で最新値を保持（ゲームループ内から stale closure なしに読める）
  const energyRef    = useRef(30);
  const comboRef     = useRef(0);
  const activeRef    = useRef(0);   // 残り動作時間（秒）
  const clearedRef   = useRef(false);

  // 統計トラッキング
  const correctCountRef = useRef(0);
  const wrongCountRef   = useRef(0);
  const maxComboRef     = useRef(0);

  // 表示用 state（React レンダーに反映）
  const [gameState, setGameState] = useState<GameState>(() => ({
    status: "playing",
    playerBaseHp: 300, playerBaseMaxHp: 300,
    enemyBaseHp: stage.enemyBaseHp, enemyBaseMaxHp: stage.enemyBaseHp,
    units: [], enemies: [], elapsedSec: 0, energy: 0, combo: 0,
  }));
  const [energy, setEnergy]     = useState(30);
  const [combo, setCombo]       = useState(0);
  const [activeLeft, setActiveLeft] = useState(0);
  const [fieldFeedback, setFieldFeedback] = useState<{ type: "correct" | "wrong"; key: number; bonus: number } | null>(null);
  const feedbackKeyRef = useRef(0);
  const [comboFlashKey, setComboFlashKey] = useState(0);

  // リザルト画面用state
  const [resultData, setResultData] = useState<{
    stars: number; coins: number; accuracy: number;
    maxCombo: number; correctCount: number; wrongCount: number;
    elapsedSec: number; baseHpRatio: number; newUnlock: UnitType | null;
  } | null>(null);

  // ゲームループ（依存なし＝マウント時に1回だけ登録）
  useEffect(() => {
    const loop = () => {
      const now = Date.now();
      const dt  = Math.min(now - lastTickRef.current, 100);
      lastTickRef.current = now;

      // 残り時間を更新
      const nextActive = Math.max(0, activeRef.current - dt / 1000);
      activeRef.current = nextActive;
      setActiveLeft(nextActive);

      if (activeRef.current > 0 || dt === 0) {
        // フィールド稼働中
        const snap = engineRef.current.tick(dt > 0 ? dt : 0);
        snap.energy = energyRef.current;
        snap.combo  = comboRef.current;
        setGameState({ ...snap });

        if (snap.status === "win" && !clearedRef.current) {
          clearedRef.current = true;
          // リザルト計算
          const totalQ = correctCountRef.current + wrongCountRef.current;
          const accuracy = totalQ > 0 ? correctCountRef.current / totalQ : 0;
          const baseHpRatio = snap.playerBaseHp / snap.playerBaseMaxHp;
          const stars = calcStars(accuracy, baseHpRatio);
          const coins = calcCoins(stars, accuracy, maxComboRef.current);
          const save = loadSave();
          const newUnlock = getNewUnlock(stage.id, save.unlockedUnits);

          // セーブデータ更新
          save.coins += coins;
          save.totalCorrect += correctCountRef.current;
          save.totalWrong += wrongCountRef.current;
          if (maxComboRef.current > save.maxCombo) save.maxCombo = maxComboRef.current;
          const prevStars = save.stageStars[stage.id] ?? 0;
          if (stars > prevStars) save.stageStars[stage.id] = stars;
          if (newUnlock && !save.unlockedUnits.includes(newUnlock)) {
            save.unlockedUnits.push(newUnlock);
          }
          // デイリーチャレンジ完了
          if (isDailyChallenge) {
            const daily = getTodayChallenge();
            completeDailyChallenge(daily.id);
            save.coins += daily.bonusCoins;
          }
          saveSave(save);

          setResultData({
            stars, coins, accuracy, maxCombo: maxComboRef.current,
            correctCount: correctCountRef.current, wrongCount: wrongCountRef.current,
            elapsedSec: snap.elapsedSec, baseHpRatio, newUnlock,
          });

          setTimeout(() => onClear(stage.id), 0);
          return; // ループ停止
        }
        if (snap.status === "lose" && !clearedRef.current) {
          clearedRef.current = true;
          const totalQ = correctCountRef.current + wrongCountRef.current;
          const accuracy = totalQ > 0 ? correctCountRef.current / totalQ : 0;
          const baseHpRatio = 0;
          setResultData({
            stars: 0, coins: 0, accuracy, maxCombo: maxComboRef.current,
            correctCount: correctCountRef.current, wrongCount: wrongCountRef.current,
            elapsedSec: snap.elapsedSec, baseHpRatio, newUnlock: null,
          });
          return;
        }
        if (snap.status !== "playing") return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCorrect = useCallback(() => {
    correctCountRef.current += 1;
    comboRef.current += 1;
    if (comboRef.current > maxComboRef.current) maxComboRef.current = comboRef.current;
    setCombo(comboRef.current);
    const bonus = comboRef.current >= 5 ? 20
                : comboRef.current >= 3 ? 15
                : ENERGY_PER_CORRECT;
    const next = Math.min(MAX_ENERGY, energyRef.current + bonus);
    energyRef.current = next;
    setEnergy(next);
    activeRef.current = ACTIVE_DURATION_SEC;
    setActiveLeft(ACTIVE_DURATION_SEC);
    // フィールド上にフィードバック表示
    feedbackKeyRef.current += 1;
    setFieldFeedback({ type: "correct", key: feedbackKeyRef.current, bonus });
    setTimeout(() => setFieldFeedback(null), 1200);

    // コンボ演出トリガー (5, 10, 15, ...)
    if (comboRef.current >= 5 && comboRef.current % 5 === 0) {
      setComboFlashKey(prev => prev + 1);
      // 10コンボ以上: 必殺技 - 全敵にダメージ
      if (comboRef.current >= 10) {
        engineRef.current.damageAllEnemies(30);
      }
    }
  }, []);

  const handleWrong = useCallback(() => {
    wrongCountRef.current += 1;
    comboRef.current = 0;
    setCombo(0);
    // ペナルティ: エネルギー -5
    const next = Math.max(0, energyRef.current - ENERGY_PENALTY_WRONG);
    energyRef.current = next;
    setEnergy(next);
    // 誤答でもアクティブ時間は付与（ゲームは動く）
    activeRef.current = ACTIVE_DURATION_SEC;
    setActiveLeft(ACTIVE_DURATION_SEC);
    // フィールド上にフィードバック表示
    feedbackKeyRef.current += 1;
    setFieldFeedback({ type: "wrong", key: feedbackKeyRef.current, bonus: -ENERGY_PENALTY_WRONG });
    setTimeout(() => setFieldFeedback(null), 1200);
  }, []);

  const handleDeploy = useCallback((type: UnitType) => {
    const cost = UNIT_DEFS[type].cost;
    if (energyRef.current < cost) return;
    const next = energyRef.current - cost;
    energyRef.current = next;
    setEnergy(next);
    engineRef.current.deployUnit(type);
  }, []);

  const isDone   = gameState.status !== "playing";
  const isPaused = !isDone && activeLeft <= 0;

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100dvh",
      background: "#0f172a", color: "#fff",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
      overflow: "hidden",
      position: "fixed", inset: 0,
    }}>
      {/* ── ヘッダー ── */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: isMobile ? "6px 10px" : "8px 16px",
        background: "#1e293b", borderBottom: "1px solid #334155", gap: 8,
        minHeight: 0, flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            background: "#475569", border: "none", color: "#fff",
            borderRadius: 6, padding: isMobile ? "4px 8px" : "4px 10px",
            cursor: "pointer", fontSize: isMobile ? 12 : 14, whiteSpace: "nowrap",
          }}
        >
          ← {isMobile ? "戻る" : "ステージ選択"}
        </button>
        <span style={{ fontWeight: "bold", fontSize: isMobile ? 13 : 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {reviewMode ? "📝 復習モード" : isDailyChallenge ? "📅 デイリーチャレンジ" : `S${stage.id}：${stage.name}`}
        </span>
        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "#475569" }}>
            ⏱ {Math.floor(gameState.elapsedSec)}s
          </span>
        </div>
      </div>

      {/* ── 戦場（上） ── */}
      <div style={{
        ...(isMobile ? { flexShrink: 0 } : { flex: 1 }),
        display: "flex", flexDirection: "column",
        background: "#0f172a", overflow: "hidden", position: "relative",
      }}>
        {/* アクティブ時間バー */}
        <div style={{ height: 5, background: "#0a1020", flexShrink: 0 }}>
          <div style={{
            height: "100%",
            width: `${(activeLeft / ACTIVE_DURATION_SEC) * 100}%`,
            background: "#fbbf24",
            transition: "width 0.1s linear",
            boxShadow: activeLeft > 0 ? "0 0 6px #fbbf2488" : "none",
            animation: isPaused ? "pulse 1s infinite" : "none",
          }} />
        </div>
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: isMobile ? "flex-start" : "center" }}>
        <BattleCanvas
          state={gameState}
          playerBaseX={engineRef.current.playerBaseX}
          enemyBaseX={engineRef.current.enemyBaseX}
          canvasWidth={engineRef.current.canvasWidth}
          isPaused={isPaused}
          combo={combo}
          comboFlashKey={comboFlashKey}
        />
        {isPaused && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <div style={{
              fontSize: 22, fontWeight: "bold", color: "#fbbf24",
              background: "rgba(0,0,0,0.7)", padding: "10px 24px",
              borderRadius: 10, border: "2px solid #fbbf24",
            }}>
              ⏸ クイズに回答すると5秒動きます
            </div>
          </div>
        )}
        {/* ── 正解/不正解フィードバック（フィールド下部） ── */}
        {fieldFeedback && (
          <div
            key={fieldFeedback.key}
            style={{
              position: "absolute",
              bottom: 8, left: "50%", transform: "translateX(-50%)",
              pointerEvents: "none",
              zIndex: 10,
              animation: "fieldFeedbackAnim 1.2s ease forwards",
            }}
          >
            {fieldFeedback.type === "correct" ? (
              <div style={{
                background: "rgba(20,83,45,0.9)",
                border: "2px solid #22c55e",
                borderRadius: 10,
                padding: isMobile ? "6px 16px" : "8px 24px",
                boxShadow: "0 0 20px #22c55e66",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: isMobile ? 16 : 20, fontWeight: "bold", color: "#22c55e" }}>
                  ✅ 正解！　⚡ +{fieldFeedback.bonus}
                </span>
                {comboRef.current >= 3 && (
                  <span style={{ fontSize: isMobile ? 12 : 14, color: "#fbbf24", marginLeft: 8 }}>
                    🔥{comboRef.current}combo!
                  </span>
                )}
              </div>
            ) : (
              <div style={{
                background: "rgba(69,10,10,0.9)",
                border: "2px solid #ef4444",
                borderRadius: 10,
                padding: isMobile ? "6px 16px" : "8px 24px",
                boxShadow: "0 0 20px #ef444466",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: isMobile ? 16 : 20, fontWeight: "bold", color: "#ef4444" }}>
                  ❌ 不正解　⚡ {fieldFeedback.bonus}
                </span>
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* ── 操作パネル（中） ── */}
      <CommandPanel
        energy={energy}
        onDeploy={handleDeploy}
        disabled={isDone}
        unlockedUnits={unlockedUnits}
      />

      {/* ── クイズ（下）：モバイルでは残り全部を使う ── */}
      <QuizPanel
        energy={energy}
        maxEnergy={MAX_ENERGY}
        combo={combo}
        subCategories={subCategories}
        selectedLevel={selectedLevel}
        onCorrect={handleCorrect}
        onWrong={handleWrong}
        disabled={isDone}
        isPaused={isPaused}
        reviewMode={reviewMode}
      />

      {/* ── リザルト画面 ── */}
      {isDone && resultData && (
        <ResultScreen
          isWin={gameState.status === "win"}
          stars={resultData.stars}
          coins={resultData.coins}
          accuracy={resultData.accuracy}
          maxCombo={resultData.maxCombo}
          correctCount={resultData.correctCount}
          wrongCount={resultData.wrongCount}
          elapsedSec={resultData.elapsedSec}
          baseHpRatio={resultData.baseHpRatio}
          newUnlock={resultData.newUnlock}
          onRetry={onRetry}
          onBack={onBack}
          isMobile={isMobile}
        />
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fieldFeedbackAnim {
          0%   { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.8); }
          15%  { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1.05); }
          30%  { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1); }
          80%  { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-15px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
