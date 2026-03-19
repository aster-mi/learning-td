import { stages } from "../data/stages";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  clearedStages: Set<number>;
  stageStars: Record<number, number>;
  coins: number;
  onSelect: (stageId: number) => void;
  onBack: () => void;
}

const STAGE_BG = ["#1e3a5f", "#3b1f2b", "#1a2e1a"];
const STAGE_ACCENT = ["#3b82f6", "#ef4444", "#22c55e"];

function StarDisplay({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <span>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ opacity: i < count ? 1 : 0.25, fontSize: 18 }}>⭐</span>
      ))}
    </span>
  );
}

export function StageSelect({ clearedStages, stageStars, coins, onSelect, onBack }: Props) {
  const { isMobile } = useWindowSize();
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: isMobile ? "20px 12px" : "40px 16px",
      color: "#fff",
    }}>
      {/* 戻るボタン + コイン */}
      <div style={{ width: "100%", maxWidth: 420, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={onBack}
          style={{
            background: "#1e293b", border: "1px solid #334155", color: "#94a3b8",
            borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13,
          }}
        >
          ← カテゴリ選択に戻る
        </button>
        <div style={{
          background: "rgba(251,191,36,0.15)",
          border: "1px solid rgba(251,191,36,0.3)",
          borderRadius: 8, padding: "4px 12px",
          fontSize: 14, fontWeight: "bold", color: "#fbbf24",
        }}>
          💰 {coins}
        </div>
      </div>
      {/* タイトル */}
      <div style={{ marginBottom: 8, fontSize: 13, color: "#94a3b8", letterSpacing: 2 }}>
        LEARNING BATTLE CATS（仮）
      </div>
      <h1 style={{ margin: "0 0 8px", fontSize: isMobile ? 22 : 30, fontWeight: "bold" }}>
        🐱 ステージ選択
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: isMobile ? 20 : 36, textAlign: "center", lineHeight: 1.7, maxWidth: 360, fontSize: isMobile ? 13 : 14 }}>
        クイズに正解して <strong style={{ color: "#fbbf24" }}>Energy</strong> を獲得！<br />
        ユニットを出撃させて敵の城を破壊しよう！
      </p>

      {/* ステージカード */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 420 }}>
        {stages.map((stage, idx) => {
          const unlocked = stage.id === 1 || clearedStages.has(stage.id - 1);
          const cleared  = clearedStages.has(stage.id);
          const stars    = stageStars[stage.id] ?? 0;
          const accent   = STAGE_ACCENT[idx];
          const bg       = STAGE_BG[idx];

          return (
            <button
              key={stage.id}
              onClick={() => unlocked && onSelect(stage.id)}
              disabled={!unlocked}
              style={{
                background: unlocked ? bg : "#1e293b",
                border: `2px solid ${unlocked ? accent : "#334155"}`,
                borderRadius: 12,
                padding: "18px 20px",
                cursor: unlocked ? "pointer" : "not-allowed",
                color: "#fff",
                textAlign: "left",
                opacity: unlocked ? 1 : 0.5,
                transition: "transform 0.15s, box-shadow 0.15s",
                boxShadow: unlocked ? `0 4px 20px ${accent}44` : "none",
              }}
              onMouseEnter={e => { if (unlocked) (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, color: accent, fontWeight: "bold", marginBottom: 2 }}>
                    STAGE {stage.id}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: "bold" }}>
                    {stage.name}
                  </div>
                </div>
                <div style={{ fontSize: 28 }}>
                  {!unlocked ? "🔒" : cleared ? <StarDisplay count={stars} /> : "▶️"}
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#94a3b8", display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span>🏰 敵HP: {stage.enemyBaseHp}</span>
                <span>👾 敵数: {stage.spawnTable.length}</span>
                {cleared && <span style={{ color: "#fbbf24" }}>✅ クリア済み</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* ヒント */}
      <div style={{
        marginTop: 36, padding: "14px 20px",
        background: "#1e293b", borderRadius: 10,
        maxWidth: 420, width: "100%",
        fontSize: 13, color: "#94a3b8", lineHeight: 1.8,
      }}>
        <strong style={{ color: "#f8fafc" }}>遊び方</strong><br />
        1. クイズに正解 → ⚡Energy +10<br />
        2. Energyを使って下のボタンからユニットを出撃<br />
        3. 敵の城のHPをゼロにしたらクリア！<br />
        <span style={{ color: "#fbbf24" }}>⭐ 正答率80%以上 & 拠点HP50%以上で星3獲得！</span><br />
        <span style={{ color: "#c084fc" }}>💰 コインでユニットを強化できます（準備中）</span>
      </div>
    </div>
  );
}
