import { useState } from "react";
import { normalStages, exStages } from "../data/stages";
import { getTodayChallenge, isDailyChallengeCompleted } from "../data/dailyChallenge";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  clearedStages: Set<number>;
  stageStars: Record<number, number>;
  coins: number;
  onSelect: (stageId: number) => void;
  onBack: () => void;
  onDaily: () => void;
  onAchievements: () => void;
  onParty: () => void;
  onGacha: () => void;
}

const WORLD_THEMES = [
  { name: "草原", emoji: "🌿", bg: "#0a2e1a", accent: "#22c55e", path: "#16a34a" },
  { name: "砂漠", emoji: "🏜️", bg: "#2e1a0a", accent: "#f59e0b", path: "#d97706" },
  { name: "氷原", emoji: "❄️", bg: "#0a1a2e", accent: "#60a5fa", path: "#2563eb" },
];

function StarDisplay({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <span>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ opacity: i < count ? 1 : 0.2, fontSize: 14 }}>⭐</span>
      ))}
    </span>
  );
}

export function StageSelect({ clearedStages, stageStars, coins, onSelect, onBack, onDaily, onAchievements, onParty, onGacha }: Props) {
  const { isMobile } = useWindowSize();
  const [tab, setTab] = useState<"normal" | "ex">("normal");

  const daily = getTodayChallenge();
  const dailyDone = isDailyChallengeCompleted(daily.id);

  // Group normal stages by world
  const worlds = [1, 2, 3].map(w => ({
    ...WORLD_THEMES[w - 1],
    stages: normalStages.filter(s => s.world === w),
  }));

  // EX unlock condition: clear all normal stages
  const allNormalCleared = normalStages.every(s => clearedStages.has(s.id));

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: isMobile ? "16px 10px" : "32px 16px",
      color: "#fff",
    }}>
      {/* Top bar */}
      <div style={{
        width: "100%", maxWidth: 500, marginBottom: 12,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: 8, flexWrap: "wrap",
      }}>
        <button onClick={onBack} style={{
          background: "#1e293b", border: "1px solid #334155", color: "#94a3b8",
          borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 13,
        }}>
          ← 戻る
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={onAchievements} style={{
            background: "rgba(129,140,248,0.15)", border: "1px solid #818cf866",
            color: "#818cf8", borderRadius: 6, padding: "6px 12px",
            cursor: "pointer", fontSize: 13, fontWeight: "bold",
          }}>
            🏆 実績
          </button>
          <div style={{
            background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: 8, padding: "4px 12px",
            fontSize: 14, fontWeight: "bold", color: "#fbbf24",
          }}>
            💰 {coins}
          </div>
        </div>
      </div>

      {/* Party & Gacha buttons */}
      <div style={{
        width: "100%", maxWidth: 500, marginBottom: 12,
        display: "flex", gap: 8,
      }}>
        <button onClick={onParty} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "10px 12px",
          background: "linear-gradient(135deg, #0d9488, #14b8a6)",
          border: "2px solid #2dd4bf",
          borderRadius: 10,
          color: "#fff", fontWeight: "bold", fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(20,184,166,0.3)",
          transition: "transform 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          ⚔️ 編成
        </button>
        <button onClick={onGacha} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "10px 12px",
          background: "linear-gradient(135deg, #b45309, #f59e0b)",
          border: "2px solid #fbbf24",
          borderRadius: 10,
          color: "#fff", fontWeight: "bold", fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(251,191,36,0.35)",
          animation: "gachaPulse 2s ease-in-out infinite",
          transition: "transform 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          🎰 ガチャ
        </button>
      </div>
      <style>{`
        @keyframes gachaPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(251,191,36,0.35); }
          50% { box-shadow: 0 4px 24px rgba(251,191,36,0.6); }
        }
      `}</style>

      {/* Title */}
      <h1 style={{ margin: "0 0 4px", fontSize: isMobile ? 20 : 28, fontWeight: "bold" }}>
        🗺️ ワールドマップ
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: 12, textAlign: "center", fontSize: 13 }}>
        ステージをクリアして次のワールドへ進もう！
      </p>

      {/* Daily Challenge Card */}
      <div style={{
        width: "100%", maxWidth: 500, marginBottom: 16,
      }}>
        <button
          onClick={onDaily}
          disabled={dailyDone}
          style={{
            width: "100%", textAlign: "left",
            padding: "14px 18px",
            background: dailyDone
              ? "rgba(30,41,59,0.6)"
              : "linear-gradient(135deg, #312e81, #4c1d95)",
            border: `2px solid ${dailyDone ? "#334155" : "#818cf8"}`,
            borderRadius: 12,
            cursor: dailyDone ? "default" : "pointer",
            color: "#fff",
            opacity: dailyDone ? 0.6 : 1,
            boxShadow: dailyDone ? "none" : "0 4px 20px #818cf844",
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => { if (!dailyDone) e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, color: "#a5b4fc", fontWeight: "bold", letterSpacing: 1, marginBottom: 2 }}>
                📅 TODAY'S CHALLENGE
              </div>
              <div style={{ fontSize: 18, fontWeight: "bold" }}>
                {daily.emoji} {daily.title}
              </div>
              <div style={{ fontSize: 13, color: "#c4b5fd", marginTop: 2 }}>
                {daily.desc}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {dailyDone ? (
                <span style={{ fontSize: 24, color: "#22c55e" }}>✅</span>
              ) : (
                <div>
                  <div style={{ fontSize: 11, color: "#a5b4fc" }}>報酬</div>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: "#fbbf24" }}>
                    💰+{daily.bonusCoins}
                  </div>
                </div>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Tab: Normal / EX */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 16,
        background: "#1e293b", borderRadius: 8, padding: 3,
        width: "100%", maxWidth: 500,
      }}>
        <button
          onClick={() => setTab("normal")}
          style={{
            flex: 1, padding: "8px",
            background: tab === "normal" ? "#3b82f6" : "transparent",
            border: "none", borderRadius: 6,
            color: "#fff", fontWeight: "bold", fontSize: 14,
            cursor: "pointer",
          }}
        >
          🗺️ ノーマル
        </button>
        <button
          onClick={() => setTab("ex")}
          style={{
            flex: 1, padding: "8px",
            background: tab === "ex" ? "#c084fc" : "transparent",
            border: "none", borderRadius: 6,
            color: allNormalCleared ? "#fff" : "#475569",
            fontWeight: "bold", fontSize: 14,
            cursor: allNormalCleared ? "pointer" : "not-allowed",
          }}
          disabled={!allNormalCleared}
        >
          😈 EX {!allNormalCleared && "🔒"}
        </button>
      </div>

      {/* Stage list */}
      <div style={{ width: "100%", maxWidth: 500 }}>
        {tab === "normal" ? (
          // World Map view
          worlds.map((world, wi) => {
            const worldUnlocked = wi === 0 || world.stages.every(() => {
              const prevWorld = worlds[wi - 1];
              return prevWorld.stages.every(ps => clearedStages.has(ps.id));
            });

            return (
              <div key={wi} style={{ marginBottom: 20, opacity: worldUnlocked ? 1 : 0.4 }}>
                {/* World header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  marginBottom: 8, paddingLeft: 4,
                }}>
                  <span style={{ fontSize: 24 }}>{world.emoji}</span>
                  <span style={{
                    fontSize: 16, fontWeight: "bold", color: world.accent,
                  }}>
                    ワールド{wi + 1}: {world.name}
                  </span>
                  {!worldUnlocked && <span style={{ fontSize: 14 }}>🔒</span>}
                </div>

                {/* Path with nodes */}
                <div style={{
                  background: `${world.bg}cc`,
                  borderRadius: 12,
                  padding: "12px",
                  border: `2px solid ${world.accent}44`,
                  position: "relative",
                }}>
                  {world.stages.map((stage, si) => {
                    const prevCleared = si === 0
                      ? (wi === 0 || worlds[wi - 1].stages.every(ps => clearedStages.has(ps.id)))
                      : clearedStages.has(world.stages[si - 1].id);
                    const unlocked = worldUnlocked && prevCleared;
                    const cleared = clearedStages.has(stage.id);
                    const stars = stageStars[stage.id] ?? 0;

                    return (
                      <div key={stage.id}>
                        {/* Connecting line */}
                        {si > 0 && (
                          <div style={{
                            width: 3, height: 16,
                            background: cleared ? world.accent : "#334155",
                            marginLeft: 28, marginTop: -4, marginBottom: -4,
                          }} />
                        )}
                        <button
                          onClick={() => unlocked && onSelect(stage.id)}
                          disabled={!unlocked}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 12,
                            padding: "10px 14px",
                            background: cleared
                              ? `${world.accent}18`
                              : unlocked ? "#0f172a88" : "#0f172a44",
                            border: `2px solid ${cleared ? world.accent : unlocked ? "#475569" : "#1e293b"}`,
                            borderRadius: 10,
                            cursor: unlocked ? "pointer" : "not-allowed",
                            color: "#fff", textAlign: "left",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => { if (unlocked) e.currentTarget.style.transform = "translateX(4px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; }}
                        >
                          {/* Node circle */}
                          <div style={{
                            width: 36, height: 36,
                            borderRadius: "50%",
                            background: cleared ? world.accent : unlocked ? "#334155" : "#1e293b",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, fontWeight: "bold", flexShrink: 0,
                            boxShadow: cleared ? `0 0 12px ${world.accent}66` : "none",
                          }}>
                            {!unlocked ? "🔒" : cleared ? "✅" : `${stage.id}`}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 15, fontWeight: "bold",
                              color: unlocked ? "#fff" : "#475569",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                              {stage.name}
                            </div>
                            <div style={{
                              fontSize: 11, color: "#94a3b8",
                              display: "flex", gap: 12,
                            }}>
                              <span>🏰{stage.enemyBaseHp}</span>
                              <span>👾{stage.spawnTable.length}</span>
                            </div>
                          </div>

                          <div style={{ flexShrink: 0 }}>
                            {cleared ? <StarDisplay count={stars} /> : unlocked ? "▶️" : ""}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          // EX stages
          <div style={{
            background: "rgba(192,132,252,0.05)",
            borderRadius: 12,
            padding: 12,
            border: "2px solid #c084fc44",
          }}>
            <div style={{
              fontSize: 14, fontWeight: "bold", color: "#c084fc",
              marginBottom: 12, textAlign: "center",
            }}>
              😈 EXステージ — 高難易度チャレンジ
            </div>
            {exStages.map(stage => {
              const cleared = clearedStages.has(stage.id);
              const stars = stageStars[stage.id] ?? 0;
              return (
                <button
                  key={stage.id}
                  onClick={() => onSelect(stage.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", marginBottom: 8,
                    background: cleared ? "rgba(192,132,252,0.1)" : "#0f172a88",
                    border: `2px solid ${cleared ? "#c084fc" : "#475569"}`,
                    borderRadius: 10,
                    cursor: "pointer", color: "#fff", textAlign: "left",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: cleared ? "#c084fc" : "#334155",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: "bold", flexShrink: 0,
                  }}>
                    {cleared ? "✅" : "😈"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: "bold" }}>{stage.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                      🏰{stage.enemyBaseHp} 👾{stage.spawnTable.length}
                    </div>
                  </div>
                  <div>{cleared ? <StarDisplay count={stars} /> : "▶️"}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips */}
      <div style={{
        marginTop: 24, padding: "12px 16px",
        background: "#1e293b", borderRadius: 10,
        maxWidth: 500, width: "100%",
        fontSize: 12, color: "#94a3b8", lineHeight: 1.8,
      }}>
        <strong style={{ color: "#f8fafc" }}>💡 ヒント</strong><br />
        ⭐ 正答率80%+ & 拠点HP50%+ → 星3<br />
        🔓 ステージクリアで新ユニット解放<br />
        😈 全ステージクリアでEXステージ出現<br />
        📅 毎日チャレンジでボーナスコインGET<br />
        🎰 コインでガチャを回して仲間を増やそう<br />
        ⚔️ 編成で出陣メンバーを入れ替えよう
      </div>
    </div>
  );
}
