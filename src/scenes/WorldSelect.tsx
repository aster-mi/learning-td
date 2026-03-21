import { useMemo, useState } from "react";
import { exStages, normalStages, WORLD_THEME_META } from "../data/stages";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  clearedStages: Set<number>;
  stageStars: Record<number, number>;
  onSelect: (stageId: number) => void;
  onBack: () => void;
}

type StageTab = "normal" | "ex";

function StarDisplay({ count }: { count: number }) {
  return (
    <span style={{ color: "#facc15", fontSize: 12 }}>
      {"★".repeat(count)}
      <span style={{ color: "#475569" }}>{"★".repeat(Math.max(0, 3 - count))}</span>
    </span>
  );
}

export function WorldSelect({ clearedStages, stageStars, onSelect, onBack }: Props) {
  const { isMobile } = useWindowSize();
  const [stageTab, setStageTab] = useState<StageTab>("normal");
  const [selectedWorldId, setSelectedWorldId] = useState<number | null>(null);

  const worlds = useMemo(() => {
    const ids = [...new Set(normalStages.map((stage) => stage.world).filter((world): world is number => typeof world === "number"))]
      .sort((a, b) => a - b);

    return ids.map((worldId, index) => {
      const stagesInWorld = normalStages.filter((stage) => stage.world === worldId);
      const previousWorldStages = index === 0 ? [] : normalStages.filter((stage) => stage.world === ids[index - 1]);
      const clearedCount = stagesInWorld.filter((stage) => clearedStages.has(stage.id)).length;
      const stars = stagesInWorld.reduce((sum, stage) => sum + (stageStars[stage.id] ?? 0), 0);
      const unlocked = index === 0 || previousWorldStages.every((stage) => clearedStages.has(stage.id));
      return {
        meta: WORLD_THEME_META[worldId],
        worldId,
        stages: stagesInWorld,
        clearedCount,
        stars,
        unlocked,
      };
    });
  }, [clearedStages, stageStars]);

  const selectedWorld = worlds.find((world) => world.worldId === selectedWorldId) ?? null;
  const allNormalCleared = normalStages.every((stage) => clearedStages.has(stage.id));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617 0%, #0f172a 45%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isMobile ? "16px 10px 28px" : "32px 16px",
        color: "#fff",
      }}
    >
      <div style={{ width: "100%", maxWidth: 960, display: "grid", gap: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={selectedWorld ? () => setSelectedWorldId(null) : onBack}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#cbd5e1",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {selectedWorld ? "ワールド一覧へ" : "戻る"}
          </button>
          <div style={{ textAlign: isMobile ? "left" : "right" }}>
            <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 900 }}>ワールド選択</div>
            <div style={{ color: "#94a3b8", fontSize: 13 }}>挑戦するステージを専用画面で選びます</div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(15,23,42,0.84)",
            border: "1px solid #334155",
            borderRadius: 14,
            padding: 6,
            display: "flex",
            gap: 8,
          }}
        >
          {[
            { key: "normal", label: "ノーマル", color: "#38bdf8" },
            { key: "ex", label: "EX", color: "#f97316" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStageTab(tab.key as StageTab);
                setSelectedWorldId(null);
              }}
              style={{
                flex: 1,
                padding: isMobile ? "10px 12px" : "11px 14px",
                borderRadius: 10,
                border: stageTab === tab.key ? `1px solid ${tab.color}` : "1px solid transparent",
                background: stageTab === tab.key ? `${tab.color}22` : "transparent",
                color: stageTab === tab.key ? "#fff" : "#94a3b8",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {stageTab === "normal" ? (
          selectedWorld ? (
            <div style={{ display: "grid", gap: 14 }}>
              <div
                style={{
                  background: `linear-gradient(135deg, ${selectedWorld.meta.bg}ee, #0f172a)`,
                  border: `1px solid ${selectedWorld.meta.accent}88`,
                  borderRadius: 18,
                  padding: isMobile ? 16 : 20,
                  boxShadow: `0 18px 36px ${selectedWorld.meta.accent}22`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: selectedWorld.meta.accent, fontSize: 12, fontWeight: 800, letterSpacing: 1.3 }}>
                      WORLD {selectedWorld.worldId}
                    </div>
                    <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 900, marginTop: 4 }}>
                      {selectedWorld.meta.emoji} {selectedWorld.meta.name}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ background: "rgba(15,23,42,0.7)", borderRadius: 999, padding: "6px 10px", fontSize: 12 }}>
                      クリア {selectedWorld.clearedCount}/{selectedWorld.stages.length}
                    </div>
                    <div style={{ background: "rgba(15,23,42,0.7)", borderRadius: 999, padding: "6px 10px", fontSize: 12, color: "#facc15" }}>
                      ★ {selectedWorld.stars}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {selectedWorld.stages.map((stage, index) => {
                  const unlocked = index === 0 || clearedStages.has(selectedWorld.stages[index - 1].id);
                  const cleared = clearedStages.has(stage.id);
                  const starCount = stageStars[stage.id] ?? 0;

                  return (
                    <button
                      key={stage.id}
                      onClick={() => unlocked && onSelect(stage.id)}
                      disabled={!unlocked}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: isMobile ? "14px 14px" : "16px 18px",
                        background: unlocked ? "rgba(15,23,42,0.82)" : "rgba(15,23,42,0.45)",
                        border: `1px solid ${unlocked ? "#334155" : "#1e293b"}`,
                        borderRadius: 16,
                        color: "#fff",
                        cursor: unlocked ? "pointer" : "default",
                        opacity: unlocked ? 1 : 0.6,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 800, letterSpacing: 1.1 }}>
                            STAGE {stage.id}
                          </div>
                          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{stage.name}</div>
                          <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12, color: "#cbd5e1" }}>
                            <span>敵HP {stage.enemyBaseHp}</span>
                            <span>WAVE {stage.spawnTable.length}</span>
                            {cleared ? <StarDisplay count={starCount} /> : null}
                          </div>
                        </div>
                        <div
                          style={{
                            alignSelf: "stretch",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: 88,
                            padding: "8px 10px",
                            borderRadius: 12,
                            fontWeight: 800,
                            background: unlocked ? (cleared ? "#14532d" : "#1d4ed8") : "#334155",
                            color: "#fff",
                          }}
                        >
                          {!unlocked ? "LOCK" : cleared ? "再挑戦" : "挑戦"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              {worlds.map((world) => (
                <button
                  key={world.worldId}
                  onClick={() => world.unlocked && setSelectedWorldId(world.worldId)}
                  disabled={!world.unlocked}
                  style={{
                    textAlign: "left",
                    padding: isMobile ? 16 : 18,
                    borderRadius: 18,
                    border: `1px solid ${world.unlocked ? `${world.meta.accent}66` : "#1e293b"}`,
                    background: world.unlocked
                      ? `linear-gradient(135deg, ${world.meta.bg}ee, rgba(15,23,42,0.92))`
                      : "rgba(15,23,42,0.58)",
                    color: "#fff",
                    cursor: world.unlocked ? "pointer" : "default",
                    boxShadow: world.unlocked ? `0 16px 32px ${world.meta.accent}22` : "none",
                    opacity: world.unlocked ? 1 : 0.58,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 10 }}>
                    <div>
                      <div style={{ color: world.meta.accent, fontSize: 12, fontWeight: 800, letterSpacing: 1.2 }}>
                        WORLD {world.worldId}
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>
                        {world.meta.emoji} {world.meta.name}
                      </div>
                    </div>
                    <div
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        fontSize: 11,
                        fontWeight: 800,
                        background: world.unlocked ? `${world.meta.accent}22` : "#334155",
                        color: world.unlocked ? world.meta.accent : "#94a3b8",
                      }}
                    >
                      {world.unlocked ? "OPEN" : "LOCK"}
                    </div>
                  </div>

                  <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap", fontSize: 12 }}>
                    <div style={{ background: "rgba(15,23,42,0.72)", borderRadius: 999, padding: "6px 10px" }}>
                      クリア {world.clearedCount}/{world.stages.length}
                    </div>
                    <div style={{ background: "rgba(15,23,42,0.72)", borderRadius: 999, padding: "6px 10px", color: "#facc15" }}>
                      ★ {world.stars}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {!allNormalCleared && (
              <div
                style={{
                  background: "rgba(124,45,18,0.35)",
                  border: "1px solid rgba(251,146,60,0.4)",
                  borderRadius: 14,
                  padding: "14px 16px",
                  color: "#fdba74",
                  fontSize: 13,
                }}
              >
                EX はノーマル全ステージクリア後に解放されます。
              </div>
            )}

            {exStages.map((stage) => {
              const starCount = stageStars[stage.id] ?? 0;
              const cleared = clearedStages.has(stage.id);
              return (
                <button
                  key={stage.id}
                  onClick={() => allNormalCleared && onSelect(stage.id)}
                  disabled={!allNormalCleared}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: isMobile ? "14px 14px" : "16px 18px",
                    background: allNormalCleared ? "rgba(30,41,59,0.84)" : "rgba(15,23,42,0.45)",
                    border: `1px solid ${allNormalCleared ? "#ea580c66" : "#1e293b"}`,
                    borderRadius: 16,
                    color: "#fff",
                    cursor: allNormalCleared ? "pointer" : "default",
                    opacity: allNormalCleared ? 1 : 0.6,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ color: "#fb923c", fontSize: 12, fontWeight: 800, letterSpacing: 1.1 }}>EX STAGE</div>
                      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{stage.name}</div>
                      <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12, color: "#cbd5e1" }}>
                        <span>敵HP {stage.enemyBaseHp}</span>
                        <span>WAVE {stage.spawnTable.length}</span>
                        {cleared ? <StarDisplay count={starCount} /> : null}
                      </div>
                    </div>
                    <div
                      style={{
                        minWidth: 88,
                        textAlign: "center",
                        padding: "8px 10px",
                        borderRadius: 12,
                        fontWeight: 800,
                        background: allNormalCleared ? (cleared ? "#9a3412" : "#ea580c") : "#334155",
                      }}
                    >
                      {allNormalCleared ? (cleared ? "再挑戦" : "挑戦") : "LOCK"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
