import { useCallback, useEffect, useRef, useState } from "react";
import { GameEngine, type GameState } from "../domain/GameEngine";
import { UNIT_DEFS, type UnitType } from "../domain/Unit";
import { QuizPanel } from "../components/QuizPanel";
import { BattleCanvas } from "../components/BattleCanvas";
import { CommandPanel } from "../components/CommandPanel";
import { useWindowSize } from "../hooks/useWindowSize";
import type { StageData } from "../data/stages";
interface Props {
  stage: StageData;
  subCategories: string[];
  selectedLevel: number;
  onBack: () => void;
  onClear: (stageId: number) => void;
  reviewMode?: boolean;
}

const MAX_ENERGY       = 100;
const ENERGY_PER_CORRECT = 10;
const ACTIVE_DURATION_SEC = 10;

export function GameScene({ stage, subCategories, selectedLevel, onBack, onClear, reviewMode }: Props) {
  const { isMobile } = useWindowSize();
  const engineRef    = useRef<GameEngine>(new GameEngine(stage, selectedLevel));
  const lastTickRef  = useRef<number>(Date.now());
  const rafRef       = useRef<number>(0);

  // Ref で最新値を保持（ゲームループ内から stale closure なしに読める）
  const energyRef    = useRef(30);
  const comboRef     = useRef(0);
  const activeRef    = useRef(0);   // 残り動作時間（秒）
  const clearedRef   = useRef(false);

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
          // setState の外で呼ぶため setTimeout(0) で非同期に
          setTimeout(() => onClear(stage.id), 0);
          return; // ループ停止
        }
        if (snap.status !== "playing") return; // ループ停止
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCorrect = useCallback(() => {
    const next = Math.min(MAX_ENERGY, energyRef.current + ENERGY_PER_CORRECT);
    energyRef.current = next;
    setEnergy(next);
    comboRef.current += 1;
    setCombo(comboRef.current);
    activeRef.current = ACTIVE_DURATION_SEC;
    setActiveLeft(ACTIVE_DURATION_SEC);
  }, []);

  const handleWrong = useCallback(() => {
    comboRef.current = 0;
    setCombo(0);
    activeRef.current = ACTIVE_DURATION_SEC;
    setActiveLeft(ACTIVE_DURATION_SEC);
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
      /* iOS ホームインジケーター分の余白 */
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
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
          {reviewMode ? "📝 復習モード" : `S${stage.id}：${stage.name}`}
        </span>
        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "#475569" }}>
            ⏱ {Math.floor(gameState.elapsedSec)}s
          </span>
        </div>
      </div>

      {/* ── 戦場（上） ── */}
      <div style={{
        /* モバイルでは固定高さ（キャンバスのアスペクト比で決まる）、PCは flex:1 で広げる */
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
              ⏸ クイズに回答すると10秒動きます
            </div>
          </div>
        )}
        </div>
      </div>

      {/* ── 操作パネル（中） ── */}
      <CommandPanel energy={energy} onDeploy={handleDeploy} disabled={isDone} />

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

      {/* ── 結果オーバーレイ ── */}
      {isDone && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 20, zIndex: 100,
        }}>
          <div style={{ fontSize: 48, fontWeight: "bold", color: gameState.status === "win" ? "#2ecc71" : "#e74c3c" }}>
            {gameState.status === "win" ? "🎉 VICTORY!" : "💀 DEFEAT"}
          </div>
          <div style={{ fontSize: 18, color: "#cbd5e1" }}>
            {gameState.status === "win"
              ? `コンボ最高 ${combo}！ よくできました！`
              : "次は正解してエネルギーを貯めよう！"}
          </div>
          <button
            onClick={onBack}
            style={{
              padding: "12px 28px", background: "#3b82f6", color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 16,
            }}
          >
            ステージ選択へ
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}
