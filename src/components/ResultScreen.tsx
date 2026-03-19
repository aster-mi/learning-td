import { useState, useEffect } from "react";
import { UNIT_DEFS, type UnitType } from "../domain/Unit";

interface Props {
  isWin: boolean;
  stars: number;            // 1-3
  coins: number;
  accuracy: number;         // 0-1
  maxCombo: number;
  correctCount: number;
  wrongCount: number;
  elapsedSec: number;
  baseHpRatio: number;      // 0-1
  newUnlock: UnitType | null;
  onRetry: () => void;
  onBack: () => void;
  isMobile: boolean;
}

const UNIT_EMOJI: Record<UnitType, string> = {
  basic: "🐱", fast: "💨", tank: "🛡️", shooter: "🏹", bomber: "🔥",
};

export function ResultScreen({
  isWin, stars, coins, accuracy, maxCombo,
  correctCount, wrongCount, elapsedSec, baseHpRatio,
  newUnlock, onRetry, onBack, isMobile,
}: Props) {
  const [showStars, setShowStars] = useState(0);
  const [showCoins, setShowCoins] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);

  // 順番にアニメーション表示
  useEffect(() => {
    if (!isWin) return;
    const t1 = setTimeout(() => setShowStars(1), 300);
    const t2 = setTimeout(() => setShowStars(2), 600);
    const t3 = setTimeout(() => setShowStars(3), 900);
    const t4 = setTimeout(() => setShowCoins(true), 1200);
    const t5 = setTimeout(() => setShowUnlock(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [isWin]);

  const totalQ = correctCount + wrongCount;
  const accPct = totalQ > 0 ? Math.round(accuracy * 100) : 0;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 12, zIndex: 100, padding: 16,
    }}>
      {/* メインカード */}
      <div style={{
        background: isWin ? "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" : "linear-gradient(135deg, #1a0000, #2d0a0a, #1a0000)",
        borderRadius: 16,
        padding: isMobile ? "20px 16px" : "28px 36px",
        maxWidth: 420, width: "100%",
        border: `2px solid ${isWin ? "#22c55e" : "#ef4444"}`,
        boxShadow: `0 0 40px ${isWin ? "#22c55e33" : "#ef444433"}`,
      }}>
        {/* タイトル */}
        <div style={{
          textAlign: "center", marginBottom: 16,
        }}>
          <div style={{
            fontSize: isMobile ? 36 : 48, fontWeight: "bold",
            color: isWin ? "#22c55e" : "#ef4444",
            textShadow: `0 0 20px ${isWin ? "#22c55e" : "#ef4444"}`,
          }}>
            {isWin ? "🎉 VICTORY!" : "💀 DEFEAT"}
          </div>
        </div>

        {/* 星評価 (勝利時のみ) */}
        {isWin && (
          <div style={{
            display: "flex", justifyContent: "center", gap: 8, marginBottom: 16,
          }}>
            {[1, 2, 3].map(i => (
              <span
                key={i}
                style={{
                  fontSize: isMobile ? 36 : 44,
                  opacity: showStars >= i && i <= stars ? 1 : 0.2,
                  transform: showStars >= i && i <= stars ? "scale(1)" : "scale(0.5)",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  filter: showStars >= i && i <= stars ? "drop-shadow(0 0 8px #fbbf24)" : "none",
                }}
              >
                ⭐
              </span>
            ))}
          </div>
        )}

        {/* 統計 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 16px",
          marginBottom: 16,
          padding: "12px",
          background: "rgba(0,0,0,0.3)",
          borderRadius: 10,
        }}>
          <StatItem label="正答率" value={`${accPct}%`} color={accPct >= 80 ? "#22c55e" : accPct >= 50 ? "#fbbf24" : "#ef4444"} />
          <StatItem label="最大コンボ" value={`${maxCombo}`} color="#c084fc" />
          <StatItem label="正解" value={`${correctCount}`} color="#22c55e" />
          <StatItem label="不正解" value={`${wrongCount}`} color="#ef4444" />
          <StatItem label="経過時間" value={`${Math.floor(elapsedSec)}秒`} color="#94a3b8" />
          <StatItem label="拠点HP" value={`${Math.round(baseHpRatio * 100)}%`} color={baseHpRatio >= 0.5 ? "#22c55e" : "#fbbf24"} />
        </div>

        {/* コイン獲得 (勝利時のみ) */}
        {isWin && showCoins && (
          <div style={{
            textAlign: "center", marginBottom: 16,
            padding: "12px",
            background: "rgba(251,191,36,0.1)",
            borderRadius: 10,
            border: "1px solid rgba(251,191,36,0.3)",
            animation: "coinPop 0.5s ease",
          }}>
            <div style={{ fontSize: 14, color: "#fbbf24", marginBottom: 4 }}>💰 獲得コイン</div>
            <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: "bold", color: "#fbbf24" }}>
              +{coins}
            </div>
          </div>
        )}

        {/* ユニット解放通知 */}
        {isWin && showUnlock && newUnlock && (
          <div style={{
            textAlign: "center", marginBottom: 16,
            padding: "14px",
            background: "rgba(192,132,252,0.15)",
            borderRadius: 10,
            border: "2px solid #c084fc",
            animation: "unlockPop 0.6s ease",
          }}>
            <div style={{ fontSize: 14, color: "#c084fc", marginBottom: 6 }}>🔓 新ユニット解放！</div>
            <div style={{ fontSize: 32 }}>{UNIT_EMOJI[newUnlock]}</div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 4 }}>
              {UNIT_DEFS[newUnlock].label}
            </div>
          </div>
        )}

        {/* ボタン */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={onRetry}
            style={{
              padding: "10px 24px",
              background: isWin ? "#1e40af" : "#3b82f6",
              color: "#fff", border: "none", borderRadius: 8,
              cursor: "pointer", fontWeight: "bold", fontSize: 15,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#2563eb")}
            onMouseLeave={e => (e.currentTarget.style.background = isWin ? "#1e40af" : "#3b82f6")}
          >
            🔄 リトライ
          </button>
          <button
            onClick={onBack}
            style={{
              padding: "10px 24px",
              background: "#475569",
              color: "#fff", border: "none", borderRadius: 8,
              cursor: "pointer", fontWeight: "bold", fontSize: 15,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#64748b")}
            onMouseLeave={e => (e.currentTarget.style.background = "#475569")}
          >
            📋 ステージ選択
          </button>
        </div>
      </div>

      <style>{`
        @keyframes coinPop {
          0% { opacity: 0; transform: scale(0.5) translateY(20px); }
          60% { transform: scale(1.1) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes unlockPop {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#94a3b8" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: "bold", color }}>{value}</div>
    </div>
  );
}
