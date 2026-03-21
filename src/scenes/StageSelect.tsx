import { useMemo, useState } from "react";
import { getTodayChallenge, isDailyChallengeCompleted } from "../data/dailyChallenge";
import { getCategoryInsights, getDailyWeeklyMissions, getRecentActivity } from "../data/progression";
import type { SaveData } from "../data/saveData";
import { exStages, normalStages, WORLD_THEME_META } from "../data/stages";
import { UNIT_CATALOG } from "../data/unitCatalog";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  clearedStages: Set<number>;
  stageStars: Record<number, number>;
  coins: number;
  saveData: SaveData;
  onSelect: (stageId: number) => void;
  onBack: () => void;
  onDaily: () => void;
  onAchievements: () => void;
  onParty: () => void;
  onGacha: () => void;
  onClaimMission: (missionId: string, rewardCoins: number) => void;
}

type StageTab = "normal" | "ex";
type HubView = "play" | "growth";

function StarDisplay({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <span>
      {Array.from({ length: max }, (_, index) => (
        <span key={index} style={{ opacity: index < count ? 1 : 0.2, fontSize: 14 }}>
          ★
        </span>
      ))}
    </span>
  );
}

function MiniBarChart({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(1, ...values);
  return (
    <div style={{ display: "flex", alignItems: "end", gap: 4, height: 70 }}>
      {values.map((value, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            minWidth: 0,
            height: `${Math.max(8, (value / max) * 100)}%`,
            background: `linear-gradient(180deg, ${color}, ${color}66)`,
            borderRadius: 6,
          }}
        />
      ))}
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        background: "rgba(15,23,42,0.78)",
        border: "1px solid #334155",
        borderRadius: 14,
        padding: "14px 16px",
      }}
    >
      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function MenuButton({
  title,
  desc,
  icon,
  gradient,
  borderColor,
  shadow,
  onClick,
}: {
  title: string;
  desc: string;
  icon: string;
  gradient: string;
  borderColor: string;
  shadow: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "14px 16px",
        background: gradient,
        border: `2px solid ${borderColor}`,
        borderRadius: 14,
        color: "#fff",
        cursor: "pointer",
        textAlign: "left",
        boxShadow: shadow,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,255,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800 }}>{title}</div>
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{desc}</div>
    </button>
  );
}

export function StageSelect({
  clearedStages,
  stageStars,
  coins,
  saveData,
  onSelect,
  onBack,
  onDaily,
  onAchievements,
  onParty,
  onGacha,
  onClaimMission,
}: Props) {
  const { isMobile } = useWindowSize();
  const [hubView, setHubView] = useState<HubView>("play");
  const [stageTab, setStageTab] = useState<StageTab>("normal");
  const [selectedWorldId, setSelectedWorldId] = useState<number | null>(null);

  const daily = getTodayChallenge();
  const dailyDone = isDailyChallengeCompleted(daily.id);
  const missions = getDailyWeeklyMissions(saveData);
  const categoryInsights = getCategoryInsights(saveData);
  const recentActivity = getRecentActivity(saveData);
  const totalStars = Object.values(stageStars).reduce((sum, star) => sum + star, 0);
  const collectionRate = Math.round((saveData.unlockedUnits.length / UNIT_CATALOG.length) * 100);

  const worlds = useMemo(() => {
    return Array.from(
      new Set(normalStages.map((stage) => stage.world).filter((world): world is number => world !== undefined)),
    )
      .sort((a, b) => a - b)
      .map((worldId, worldIndex, worldIds) => {
        const stages = normalStages.filter((stage) => stage.world === worldId);
        const previousWorldStages =
          worldIndex === 0
            ? []
            : normalStages.filter((stage) => stage.world === worldIds[worldIndex - 1]);
        const unlocked =
          worldIndex === 0 || previousWorldStages.every((stage) => clearedStages.has(stage.id));

        return {
          ...WORLD_THEME_META[worldId],
          stages,
          unlocked,
        };
      });
  }, [clearedStages]);

  const selectedWorld =
    selectedWorldId == null ? null : worlds.find((world) => world.id === selectedWorldId) ?? null;
  const allNormalCleared = normalStages.every((stage) => clearedStages.has(stage.id));

  const openWorld = (worldId: number) => {
    const targetWorld = worlds.find((world) => world.id === worldId);
    if (!targetWorld?.unlocked) return;
    setStageTab("normal");
    setSelectedWorldId(worldId);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isMobile ? "16px 10px 28px" : "32px 16px",
        color: "#fff",
      }}
    >
      <div style={{ width: "100%", maxWidth: 920, display: "grid", gap: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#94a3b8",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            戻る
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={onAchievements}
              style={{
                background: "rgba(129,140,248,0.15)",
                border: "1px solid #818cf866",
                color: "#818cf8",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: "bold",
              }}
            >
              実績
            </button>
            <div
              style={{
                background: "rgba(251,191,36,0.15)",
                border: "1px solid rgba(251,191,36,0.3)",
                borderRadius: 10,
                padding: "6px 14px",
                fontSize: 14,
                fontWeight: "bold",
                color: "#fbbf24",
              }}
            >
              コイン {coins}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          <SummaryCard label="連続ログイン" value={`${saveData.login.streak}日`} color="#38bdf8" />
          <SummaryCard label="図鑑達成率" value={`${collectionRate}%`} color="#f59e0b" />
          <SummaryCard label="総スター" value={`${totalStars}`} color="#facc15" />
          <SummaryCard label="累計正解" value={`${saveData.totalCorrect}`} color="#4ade80" />
        </div>

        <div
          style={{
            background: "rgba(15,23,42,0.78)",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: isMobile ? "12px" : "14px",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {[
            { key: "play", label: "プレイ", desc: "ステージ攻略とデイリー", color: "#3b82f6" },
            { key: "growth", label: "成長", desc: "ミッションと学習状況", color: "#8b5cf6" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setHubView(item.key as HubView)}
              style={{
                flex: isMobile ? "1 1 100%" : 1,
                minWidth: 0,
                padding: "12px 14px",
                borderRadius: 12,
                border: `2px solid ${hubView === item.key ? item.color : "#334155"}`,
                background: hubView === item.key ? `${item.color}22` : "#0f172a",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{item.desc}</div>
            </button>
          ))}
        </div>

        {hubView === "play" ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
                gap: 16,
              }}
            >
              <button
                onClick={onDaily}
                disabled={dailyDone}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "16px 18px",
                  background: dailyDone ? "rgba(30,41,59,0.6)" : "linear-gradient(135deg, #312e81, #4c1d95)",
                  border: `2px solid ${dailyDone ? "#334155" : "#818cf8"}`,
                  borderRadius: 16,
                  cursor: dailyDone ? "default" : "pointer",
                  color: "#fff",
                  opacity: dailyDone ? 0.65 : 1,
                  boxShadow: dailyDone ? "none" : "0 4px 20px #818cf844",
                }}
              >
                <div style={{ fontSize: 11, color: "#a5b4fc", fontWeight: "bold", letterSpacing: 1, marginBottom: 6 }}>
                  TODAY&apos;S CHALLENGE
                </div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  {daily.emoji} {daily.title}
                </div>
                <div style={{ fontSize: 13, color: "#c4b5fd", marginTop: 4 }}>{daily.desc}</div>
                <div style={{ marginTop: 10, fontSize: 13, color: dailyDone ? "#86efac" : "#fbbf24", fontWeight: 700 }}>
                  {dailyDone ? "今日のチャレンジはクリア済み" : `報酬: コイン +${daily.bonusCoins}`}
                </div>
              </button>

              <div
                style={{
                  background: "rgba(15,23,42,0.78)",
                  border: "1px solid #334155",
                  borderRadius: 16,
                  padding: "16px",
                  display: "grid",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800 }}>準備メニュー</div>
                <MenuButton
                  title="ワールド選択"
                  desc="ワールドごとに背景や攻略状況を見ながら、挑戦先を選べます。"
                  icon="🗺"
                  gradient="linear-gradient(135deg, #2563eb, #0ea5e9)"
                  borderColor="#7dd3fc"
                  shadow="0 4px 16px rgba(14,165,233,0.28)"
                  onClick={() => {
                    setStageTab("normal");
                    setSelectedWorldId(null);
                  }}
                />
                <MenuButton
                  title="パーティ編成 / 図鑑"
                  desc="出撃メンバーの調整や育成状況の確認を行います。"
                  icon="🛡"
                  gradient="linear-gradient(135deg, #0d9488, #14b8a6)"
                  borderColor="#2dd4bf"
                  shadow="0 4px 12px rgba(20,184,166,0.3)"
                  onClick={onParty}
                />
                <MenuButton
                  title="ガチャ"
                  desc="新しいユニットや報酬を獲得して戦力を強化します。"
                  icon="🎴"
                  gradient="linear-gradient(135deg, #b45309, #f59e0b)"
                  borderColor="#fbbf24"
                  shadow="0 4px 16px rgba(251,191,36,0.35)"
                  onClick={onGacha}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 4,
                background: "#1e293b",
                borderRadius: 10,
                padding: 4,
                width: "100%",
              }}
            >
              <button
                onClick={() => setStageTab("normal")}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: stageTab === "normal" ? "#3b82f6" : "transparent",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                ノーマル
              </button>
              <button
                onClick={() => setStageTab("ex")}
                disabled={!allNormalCleared}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: stageTab === "ex" ? "#c084fc" : "transparent",
                  border: "none",
                  borderRadius: 8,
                  color: allNormalCleared ? "#fff" : "#475569",
                  fontWeight: "bold",
                  fontSize: 14,
                  cursor: allNormalCleared ? "pointer" : "not-allowed",
                }}
              >
                EX {!allNormalCleared && "🔒"}
              </button>
            </div>

            {stageTab === "normal" ? (
              selectedWorld == null ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                    gap: 14,
                  }}
                >
                  {worlds.map((world) => {
                    const clearedCount = world.stages.filter((stage) => clearedStages.has(stage.id)).length;
                    const starCount = world.stages.reduce((sum, stage) => sum + (stageStars[stage.id] ?? 0), 0);

                    return (
                      <button
                        key={world.id}
                        onClick={() => openWorld(world.id)}
                        disabled={!world.unlocked}
                        style={{
                          textAlign: "left",
                          padding: "18px",
                          borderRadius: 18,
                          border: `2px solid ${world.unlocked ? `${world.accent}88` : "#334155"}`,
                          background: world.unlocked
                            ? `linear-gradient(135deg, ${world.bg}, rgba(15,23,42,0.92))`
                            : "rgba(15,23,42,0.6)",
                          color: "#fff",
                          cursor: world.unlocked ? "pointer" : "not-allowed",
                          opacity: world.unlocked ? 1 : 0.5,
                          boxShadow: world.unlocked ? `0 8px 30px ${world.accent}22` : "none",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
                          <div>
                            <div style={{ fontSize: 12, letterSpacing: 1, color: world.accent, fontWeight: 800, marginBottom: 8 }}>
                              WORLD {world.id}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                              <span style={{ fontSize: 28 }}>{world.emoji}</span>
                              <span style={{ fontSize: 22, fontWeight: 800 }}>{world.name}</span>
                            </div>
                            <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>
                              背景テーマと攻略状況を見ながら、挑戦するステージ群を選べます。
                            </div>
                          </div>
                          <div style={{ fontSize: 20 }}>{world.unlocked ? "→" : "🔒"}</div>
                        </div>

                        <div
                          style={{
                            marginTop: 16,
                            display: "grid",
                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              background: "rgba(15,23,42,0.45)",
                              borderRadius: 12,
                              padding: "10px 12px",
                            }}
                          >
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>進行</div>
                            <div style={{ fontSize: 18, fontWeight: 800 }}>
                              {clearedCount}/{world.stages.length}
                            </div>
                          </div>
                          <div
                            style={{
                              background: "rgba(15,23,42,0.45)",
                              borderRadius: 12,
                              padding: "10px 12px",
                            }}
                          >
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>スター</div>
                            <div style={{ fontSize: 18, fontWeight: 800 }}>{starCount}</div>
                          </div>
                          <div
                            style={{
                              background: "rgba(15,23,42,0.45)",
                              borderRadius: 12,
                              padding: "10px 12px",
                            }}
                          >
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>状態</div>
                            <div style={{ fontSize: 18, fontWeight: 800 }}>{world.unlocked ? "OPEN" : "LOCK"}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    background: `${selectedWorld.bg}dd`,
                    borderRadius: 16,
                    padding: "14px",
                    border: `2px solid ${selectedWorld.accent}55`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 26 }}>{selectedWorld.emoji}</span>
                      <div>
                        <div style={{ fontSize: 12, letterSpacing: 1, color: selectedWorld.accent, fontWeight: 800 }}>
                          WORLD {selectedWorld.id}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{selectedWorld.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedWorldId(null)}
                      style={{
                        background: "#0f172a",
                        border: "1px solid #334155",
                        color: "#cbd5e1",
                        borderRadius: 10,
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      ワールド一覧へ
                    </button>
                  </div>
                  {selectedWorld.stages.map((stage, stageIndex) => {
                    const prevCleared =
                      stageIndex === 0 ? true : clearedStages.has(selectedWorld.stages[stageIndex - 1].id);
                    const unlocked = selectedWorld.unlocked && prevCleared;
                    const cleared = clearedStages.has(stage.id);
                    const stars = stageStars[stage.id] ?? 0;

                    return (
                      <div key={stage.id}>
                        {stageIndex > 0 && (
                          <div
                            style={{
                              width: 3,
                              height: 16,
                              background: cleared ? selectedWorld.accent : "#334155",
                              marginLeft: 28,
                              marginTop: -4,
                              marginBottom: -4,
                            }}
                          />
                        )}
                        <button
                          onClick={() => {
                            if (unlocked) onSelect(stage.id);
                          }}
                          disabled={!unlocked}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "10px 14px",
                            background: cleared ? `${selectedWorld.accent}18` : unlocked ? "#0f172acc" : "#0f172a66",
                            border: `2px solid ${cleared ? selectedWorld.accent : unlocked ? "#475569" : "#1e293b"}`,
                            borderRadius: 12,
                            cursor: unlocked ? "pointer" : "not-allowed",
                            color: "#fff",
                            textAlign: "left",
                            marginBottom: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              background: cleared ? selectedWorld.accent : unlocked ? "#334155" : "#1e293b",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 16,
                              fontWeight: "bold",
                              flexShrink: 0,
                              boxShadow: cleared ? `0 0 12px ${selectedWorld.accent}66` : "none",
                            }}
                          >
                            {!unlocked ? "🔒" : cleared ? "✓" : `${stage.id}`}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: "bold",
                                color: unlocked ? "#fff" : "#475569",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {stage.name}
                            </div>
                            <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", gap: 12 }}>
                              <span>敵HP {stage.enemyBaseHp}</span>
                              <span>出現 {stage.spawnTable.length}</span>
                            </div>
                          </div>

                          <div style={{ flexShrink: 0 }}>{cleared ? <StarDisplay count={stars} /> : unlocked ? "挑戦" : ""}</div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div
                style={{
                  background: "rgba(192,132,252,0.05)",
                  borderRadius: 12,
                  padding: 12,
                  border: "2px solid #c084fc44",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: "bold", color: "#c084fc", marginBottom: 12, textAlign: "center" }}>
                  EXステージ: すべてのノーマルをクリア後に開放
                </div>
                {exStages.map((stage) => {
                  const cleared = clearedStages.has(stage.id);
                  const stars = stageStars[stage.id] ?? 0;
                  return (
                    <button
                      key={stage.id}
                      onClick={() => onSelect(stage.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        marginBottom: 8,
                        background: cleared ? "rgba(192,132,252,0.1)" : "#0f172a88",
                        border: `2px solid ${cleared ? "#c084fc" : "#475569"}`,
                        borderRadius: 10,
                        cursor: "pointer",
                        color: "#fff",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: cleared ? "#c084fc" : "#334155",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          fontWeight: "bold",
                          flexShrink: 0,
                        }}
                      >
                        {cleared ? "✓" : "EX"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: "bold" }}>{stage.name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>
                          敵HP {stage.enemyBaseHp} / 出現 {stage.spawnTable.length}
                        </div>
                      </div>
                      <div>{cleared ? <StarDisplay count={stars} /> : "挑戦"}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "rgba(15,23,42,0.78)",
                border: "1px solid #334155",
                borderRadius: 16,
                padding: "16px",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>ミッション</div>
              <div style={{ display: "grid", gap: 10 }}>
                {missions.map((mission) => {
                  const completed = mission.progress >= mission.target;
                  return (
                    <div
                      key={mission.id}
                      style={{
                        border: `1px solid ${mission.claimed ? "#475569" : completed ? "#22c55e66" : "#334155"}`,
                        borderRadius: 12,
                        padding: "12px 14px",
                        background: mission.claimed ? "rgba(30,41,59,0.55)" : "rgba(15,23,42,0.66)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "start" }}>
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: mission.scope === "daily" ? "#38bdf8" : "#a78bfa",
                              marginBottom: 4,
                            }}
                          >
                            {mission.scope === "daily" ? "DAILY" : "WEEKLY"}
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{mission.title}</div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{mission.desc}</div>
                        </div>
                        <button
                          disabled={!completed || mission.claimed}
                          onClick={() => onClaimMission(mission.id, mission.rewardCoins)}
                          style={{
                            flexShrink: 0,
                            background: mission.claimed ? "#334155" : completed ? "#16a34a" : "#1e293b",
                            color: mission.claimed ? "#94a3b8" : completed ? "#fff" : "#64748b",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 12px",
                            cursor: !completed || mission.claimed ? "default" : "pointer",
                            fontWeight: 700,
                          }}
                        >
                          {mission.claimed
                            ? "受取済み"
                            : completed
                              ? `受取 +${mission.rewardCoins}`
                              : `${Math.min(mission.progress, mission.target)}/${mission.target}`}
                        </button>
                      </div>
                      <div style={{ marginTop: 10, height: 8, background: "#0f172a", borderRadius: 999 }}>
                        <div
                          style={{
                            width: `${Math.min(100, (mission.progress / mission.target) * 100)}%`,
                            height: "100%",
                            borderRadius: 999,
                            background: mission.scope === "daily" ? "#38bdf8" : "#a78bfa",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <div
                style={{
                  background: "rgba(15,23,42,0.78)",
                  border: "1px solid #334155",
                  borderRadius: 16,
                  padding: "16px",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>得意・苦手</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {categoryInsights.map((item) => (
                    <div key={item.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: item.color }}>
                          {item.emoji} {item.name}
                        </span>
                        <span style={{ color: "#e2e8f0" }}>
                          {item.correct + item.wrong > 0 ? `${Math.round(item.accuracy * 100)}%` : "未プレイ"}
                        </span>
                      </div>
                      <div style={{ height: 10, background: "#0f172a", borderRadius: 999 }}>
                        <div
                          style={{
                            width: `${Math.max(4, item.accuracy * 100)}%`,
                            height: "100%",
                            borderRadius: 999,
                            background: item.color,
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>
                        正解 {item.correct} / 不正解 {item.wrong}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(15,23,42,0.78)",
                  border: "1px solid #334155",
                  borderRadius: 16,
                  padding: "16px",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>直近7日の学習量</div>
                <MiniBarChart values={recentActivity.map((item) => item.correct)} color="#22c55e" />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 4,
                    marginTop: 8,
                    fontSize: 10,
                    color: "#94a3b8",
                  }}
                >
                  {recentActivity.map((item) => (
                    <div key={item.key} style={{ textAlign: "center" }}>
                      <div>{item.label}</div>
                      <div>{item.correct}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
