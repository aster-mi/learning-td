import type { DailyChallenge } from "../../data/dailyChallenge";
import { exStages, type StageData, type WorldThemeMeta } from "../../data/stages";

interface StageWorld {
  meta: WorldThemeMeta;
  worldId: number;
  stages: StageData[];
  clearedCount: number;
  stars: number;
  maxStars: number;
  unlocked: boolean;
}

interface StageSelectPlayTabProps {
  isMobile: boolean;
  onParty: () => void;
  onGacha: () => void;
  onDaily: () => void;
  daily: DailyChallenge;
  dailyDone: boolean;
  worlds: StageWorld[];
  expandedWorldId: number | null;
  onToggleWorld: (worldId: number) => void;
  clearedStages: ReadonlySet<number>;
  stageStars: Record<number, number>;
  onSelect: (stageId: number) => void;
  allNormalCleared: boolean;
  showEX: boolean;
  onToggleEX: () => void;
}

function StarDisplay({ count }: { count: number }) {
  return (
    <span style={{ color: "#facc15", fontSize: 12 }}>
      {"笘・".repeat(count)}
      <span style={{ color: "#475569" }}>{"笘・".repeat(Math.max(0, 3 - count))}</span>
    </span>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div style={{ height: 6, background: "rgba(15,23,42,0.6)", borderRadius: 999, overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: 999,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

export function StageSelectPlayTab({
  isMobile,
  onParty,
  onGacha,
  onDaily,
  daily,
  dailyDone,
  worlds,
  expandedWorldId,
  onToggleWorld,
  clearedStages,
  stageStars,
  onSelect,
  allNormalCleared,
  showEX,
  onToggleEX,
}: StageSelectPlayTabProps) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={onParty}
          style={{
            background: "linear-gradient(135deg, #0d9488, #14b8a6)",
            border: "2px solid #2dd4bf",
            borderRadius: 16,
            padding: isMobile ? "14px 12px" : "16px 20px",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: isMobile ? 15 : 16,
            boxShadow: "0 4px 12px rgba(20,184,166,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: isMobile ? 22 : 24 }}>孱</span>
          繝代・繝・ぅ
        </button>
        <button
          onClick={onGacha}
          style={{
            background: "linear-gradient(135deg, #b45309, #f59e0b)",
            border: "2px solid #fbbf24",
            borderRadius: 16,
            padding: isMobile ? "14px 12px" : "16px 20px",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: isMobile ? 15 : 16,
            boxShadow: "0 4px 16px rgba(251,191,36,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: isMobile ? 22 : 24 }}>識</span>
          繧ｬ繝√Ε
        </button>
      </div>

      <button
        onClick={onDaily}
        disabled={dailyDone}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "14px 18px",
          background: dailyDone ? "rgba(30,41,59,0.6)" : "linear-gradient(135deg, #312e81, #4c1d95)",
          border: `2px solid ${dailyDone ? "#334155" : "#818cf8"}`,
          borderRadius: 16,
          cursor: dailyDone ? "default" : "pointer",
          color: "#fff",
          opacity: dailyDone ? 0.65 : 1,
          boxShadow: dailyDone ? "none" : "0 4px 20px #818cf844",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "#a5b4fc",
                fontWeight: "bold",
                letterSpacing: 1.2,
                marginBottom: 4,
              }}
            >
              TODAY&apos;S CHALLENGE
            </div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              {daily.emoji} {daily.title}
            </div>
          </div>
          <div
            style={{
              fontSize: 13,
              color: dailyDone ? "#86efac" : "#fbbf24",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {dailyDone ? "繧ｯ繝ｪ繧｢貂医∩" : `+${daily.bonusCoins} 繧ｳ繧､繝ｳ`}
          </div>
        </div>
      </button>

      <div style={{ display: "grid", gap: 12 }}>
        {worlds.map((world) => {
          const isExpanded = expandedWorldId === world.worldId;
          const allCleared = world.clearedCount === world.stages.length;

          return (
            <div
              key={world.worldId}
              style={{
                borderRadius: 20,
                border: `1px solid ${world.unlocked ? `${world.meta.accent}55` : "#1e293b"}`,
                background: world.unlocked
                  ? `linear-gradient(135deg, ${world.meta.bg}dd, rgba(15,23,42,0.92))`
                  : "rgba(15,23,42,0.4)",
                overflow: "hidden",
                opacity: world.unlocked ? 1 : 0.55,
                boxShadow: isExpanded ? `0 12px 40px ${world.meta.accent}22` : "none",
                transition: "box-shadow 0.3s ease",
              }}
            >
              <button
                onClick={() => world.unlocked && onToggleWorld(world.worldId)}
                disabled={!world.unlocked}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: isMobile ? "14px 16px" : "16px 20px",
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: world.unlocked ? "pointer" : "default",
                  display: "block",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: `${world.meta.accent}22`,
                        border: `2px solid ${world.meta.accent}44`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {world.meta.emoji}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 10,
                          color: world.meta.accent,
                          fontWeight: 800,
                          letterSpacing: 1.5,
                          marginBottom: 2,
                        }}
                      >
                        WORLD {world.worldId}
                      </div>
                      <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900 }}>{world.meta.name}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    {world.unlocked ? (
                      <>
                        <div style={{ textAlign: "right", minWidth: 50 }}>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>繧ｯ繝ｪ繧｢</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: allCleared ? "#4ade80" : "#e2e8f0" }}>
                            {world.clearedCount}/{world.stages.length}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", minWidth: 40 }}>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>笘・</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: "#facc15" }}>{world.stars}</div>
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            color: world.meta.accent,
                            transition: "transform 0.3s ease",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        >
                          笆ｼ
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          background: "#334155",
                          borderRadius: 999,
                          padding: "5px 12px",
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#94a3b8",
                        }}
                      >
                        LOCKED
                      </div>
                    )}
                  </div>
                </div>

                {world.unlocked && (
                  <div style={{ marginTop: 10 }}>
                    <ProgressBar value={world.clearedCount} max={world.stages.length} color={world.meta.accent} />
                  </div>
                )}
              </button>

              {isExpanded && (
                <div
                  style={{
                    borderTop: `1px solid ${world.meta.accent}33`,
                    padding: isMobile ? "8px 10px 14px" : "8px 16px 18px",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  {world.stages.map((stage, index) => {
                    const stageUnlocked = index === 0 || clearedStages.has(world.stages[index - 1].id);
                    const cleared = clearedStages.has(stage.id);
                    const starCount = stageStars[stage.id] ?? 0;

                    return (
                      <button
                        key={stage.id}
                        onClick={() => stageUnlocked && onSelect(stage.id)}
                        disabled={!stageUnlocked}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: isMobile ? "10px 12px" : "12px 16px",
                          background: stageUnlocked ? "rgba(15,23,42,0.7)" : "rgba(15,23,42,0.35)",
                          border: `1px solid ${stageUnlocked ? "#334155" : "#1e293b44"}`,
                          borderRadius: 14,
                          color: "#fff",
                          cursor: stageUnlocked ? "pointer" : "default",
                          opacity: stageUnlocked ? 1 : 0.5,
                          transition: "background 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 10,
                                background: stageUnlocked
                                  ? cleared
                                    ? "#14532d"
                                    : `${world.meta.accent}22`
                                  : "#1e293b",
                                border: `1px solid ${stageUnlocked ? (cleared ? "#22c55e55" : `${world.meta.accent}44`) : "#334155"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 13,
                                fontWeight: 900,
                                color: stageUnlocked ? (cleared ? "#4ade80" : world.meta.accent) : "#475569",
                                flexShrink: 0,
                              }}
                            >
                              {stageUnlocked ? (cleared ? "笨・" : index + 1) : "白"}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {stage.name}
                              </div>
                              <div
                                style={{
                                  marginTop: 3,
                                  display: "flex",
                                  gap: 8,
                                  fontSize: 11,
                                  color: "#94a3b8",
                                }}
                              >
                                <span>HP {stage.enemyBaseHp}</span>
                                <span>W{stage.spawnTable.length}</span>
                                {cleared && <StarDisplay count={starCount} />}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              padding: "6px 14px",
                              borderRadius: 10,
                              fontWeight: 800,
                              fontSize: 12,
                              background: stageUnlocked ? (cleared ? "#14532d" : world.meta.accent) : "#334155",
                              color: stageUnlocked ? "#fff" : "#64748b",
                              flexShrink: 0,
                            }}
                          >
                            {!stageUnlocked ? "LOCK" : cleared ? "蜀肴倦謌ｦ" : "謖第姶"}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div
          style={{
            borderRadius: 20,
            border: `1px solid ${allNormalCleared ? "#ea580c55" : "#1e293b"}`,
            background: allNormalCleared
              ? "linear-gradient(135deg, #431407dd, rgba(15,23,42,0.92))"
              : "rgba(15,23,42,0.4)",
            overflow: "hidden",
            opacity: allNormalCleared ? 1 : 0.55,
            boxShadow: showEX ? "0 12px 40px #ea580c22" : "none",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <button
            onClick={onToggleEX}
            disabled={!allNormalCleared}
            style={{
              width: "100%",
              textAlign: "left",
              padding: isMobile ? "14px 16px" : "16px 20px",
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: allNormalCleared ? "pointer" : "default",
              display: "block",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "rgba(234,88,12,0.15)",
                    border: "2px solid rgba(234,88,12,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#fb923c",
                    flexShrink: 0,
                  }}
                >
                  EX
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#fb923c",
                      fontWeight: 800,
                      letterSpacing: 1.5,
                      marginBottom: 2,
                    }}
                  >
                    EXTRA STAGES
                  </div>
                  <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900 }}>鬮倬屮蠎ｦ繝√Ε繝ｬ繝ｳ繧ｸ</div>
                </div>
              </div>

              {allNormalCleared ? (
                <div
                  style={{
                    fontSize: 16,
                    color: "#fb923c",
                    transition: "transform 0.3s ease",
                    transform: showEX ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  笆ｼ
                </div>
              ) : (
                <div
                  style={{
                    background: "#334155",
                    borderRadius: 999,
                    padding: "5px 12px",
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#94a3b8",
                  }}
                >
                  蜈ｨ繧ｯ繝ｪ繧｢縺ｧ隗｣謾ｾ
                </div>
              )}
            </div>
          </button>

          {showEX && allNormalCleared && (
            <div
              style={{
                borderTop: "1px solid rgba(234,88,12,0.25)",
                padding: isMobile ? "8px 10px 14px" : "8px 16px 18px",
                display: "grid",
                gap: 8,
              }}
            >
              {exStages.map((stage) => {
                const cleared = clearedStages.has(stage.id);
                const starCount = stageStars[stage.id] ?? 0;
                return (
                  <button
                    key={stage.id}
                    onClick={() => onSelect(stage.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: isMobile ? "10px 12px" : "12px 16px",
                      background: "rgba(15,23,42,0.7)",
                      border: "1px solid #ea580c44",
                      borderRadius: 14,
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            background: cleared ? "#9a341222" : "#ea580c22",
                            border: `1px solid ${cleared ? "#fb718555" : "#ea580c44"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            fontWeight: 900,
                            color: cleared ? "#fb7185" : "#fb923c",
                            flexShrink: 0,
                          }}
                        >
                          {cleared ? "笨・" : "!"}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700 }}>{stage.name}</div>
                          <div
                            style={{
                              marginTop: 3,
                              display: "flex",
                              gap: 8,
                              fontSize: 11,
                              color: "#94a3b8",
                            }}
                          >
                            <span>HP {stage.enemyBaseHp}</span>
                            <span>W{stage.spawnTable.length}</span>
                            {cleared && <StarDisplay count={starCount} />}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          padding: "6px 14px",
                          borderRadius: 10,
                          fontWeight: 800,
                          fontSize: 12,
                          background: cleared ? "#9a3412" : "#ea580c",
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {cleared ? "蜀肴倦謌ｦ" : "謖第姶"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
