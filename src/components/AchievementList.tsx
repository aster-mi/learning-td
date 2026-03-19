import { ACHIEVEMENTS } from "../data/achievements";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  unlockedIds: string[];
  onClose: () => void;
}

const CATEGORY_LABELS = {
  quiz: { label: "クイズ", emoji: "📝" },
  battle: { label: "バトル", emoji: "⚔️" },
  collection: { label: "コレクション", emoji: "🎪" },
  special: { label: "スペシャル", emoji: "✨" },
};

export function AchievementList({ unlockedIds, onClose }: Props) {
  const { isMobile } = useWindowSize();
  const unlocked = new Set(unlockedIds);
  const total = ACHIEVEMENTS.length;
  const got = unlockedIds.length;

  const categories = ["quiz", "battle", "collection", "special"] as const;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
      display: "flex", flexDirection: "column",
      zIndex: 200, color: "#fff",
      overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? "12px 16px" : "16px 24px",
        background: "#1e293b",
        borderBottom: "1px solid #334155",
        display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0,
      }}>
        <button
          onClick={onClose}
          style={{
            background: "#475569", border: "none", color: "#fff",
            borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 14,
          }}
        >
          ← 戻る
        </button>
        <span style={{ fontSize: 20, fontWeight: "bold" }}>🏆 実績</span>
        <span style={{ marginLeft: "auto", color: "#818cf8", fontWeight: "bold" }}>
          {got}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "12px 16px", flexShrink: 0 }}>
        <div style={{ height: 8, background: "#1e293b", borderRadius: 4 }}>
          <div style={{
            height: "100%", borderRadius: 4,
            width: `${(got / total) * 100}%`,
            background: "linear-gradient(90deg, #818cf8, #c084fc)",
            transition: "width 0.3s",
          }} />
        </div>
      </div>

      {/* Achievement cards by category */}
      <div style={{ padding: "0 16px 24px", flex: 1 }}>
        {categories.map(cat => {
          const meta = CATEGORY_LABELS[cat];
          const items = ACHIEVEMENTS.filter(a => a.category === cat);
          return (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 14, fontWeight: "bold", color: "#94a3b8",
                marginBottom: 8, letterSpacing: 1,
              }}>
                {meta.emoji} {meta.label}
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 8,
              }}>
                {items.map(a => {
                  const isUnlocked = unlocked.has(a.id);
                  return (
                    <div
                      key={a.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 14px",
                        background: isUnlocked ? "rgba(129,140,248,0.1)" : "rgba(15,23,42,0.6)",
                        border: `1px solid ${isUnlocked ? "#818cf8" : "#1e293b"}`,
                        borderRadius: 10,
                        opacity: isUnlocked ? 1 : 0.5,
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{isUnlocked ? a.emoji : "❓"}</span>
                      <div>
                        <div style={{
                          fontSize: 14, fontWeight: "bold",
                          color: isUnlocked ? "#fff" : "#64748b",
                        }}>
                          {isUnlocked ? a.title : "???"}
                        </div>
                        <div style={{ fontSize: 12, color: isUnlocked ? "#a5b4fc" : "#334155" }}>
                          {a.desc}
                        </div>
                      </div>
                      {isUnlocked && (
                        <span style={{ marginLeft: "auto", fontSize: 16, color: "#22c55e" }}>✅</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
