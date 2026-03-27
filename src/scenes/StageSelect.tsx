import { useMemo, useState } from "react";
import { getTodayChallenge, isDailyChallengeCompleted } from "../data/dailyChallenge";
import { getCategoryInsights, getDailyWeeklyMissions, getRecentActivity } from "../data/progression";
import type { SaveData } from "../data/saveData";
import { normalStages, WORLD_THEME_META, type StageData, type WorldThemeMeta } from "../data/stages";
import { UNIT_CATALOG } from "../data/unitCatalog";
import { useWindowSize } from "../hooks/useWindowSize";
import { MuteButton } from "../components/MuteButton";
import { StageSelectGrowthTab } from "./stageSelect/StageSelectGrowthTab";
import { StageSelectPlayTab } from "./stageSelect/StageSelectPlayTab";

interface Props {
  stageStars: Record<number, number>;
  clearedStages: Set<number>;
  coins: number;
  saveData: SaveData;
  onBack: () => void;
  onDaily: () => void;
  onAchievements: () => void;
  onProgress: () => void;
  onParty: () => void;
  onGacha: () => void;
  onSelect: (stageId: number) => void;
  onClaimMission: (missionId: string, rewardCoins: number) => void;
}

type HubView = "play" | "growth";

interface StageWorld {
  meta: WorldThemeMeta;
  worldId: number;
  stages: StageData[];
  clearedCount: number;
  stars: number;
  maxStars: number;
  unlocked: boolean;
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        background: "rgba(15,23,42,0.78)",
        border: "1px solid #334155",
        borderRadius: 999,
        padding: "5px 9px",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 8, color: "#94a3b8", lineHeight: 1 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

export function StageSelect({
  stageStars,
  clearedStages,
  coins,
  saveData,
  onBack,
  onDaily,
  onAchievements,
  onProgress,
  onParty,
  onGacha,
  onSelect,
  onClaimMission,
}: Props) {
  const { isMobile } = useWindowSize();
  const [hubView, setHubView] = useState<HubView>("play");
  const [expandedWorldId, setExpandedWorldId] = useState<number | null>(null);
  const [showEX, setShowEX] = useState(false);
  const [insightView, setInsightView] = useState<"bar" | "radar">("bar");

  const daily = getTodayChallenge();
  const dailyDone = isDailyChallengeCompleted(daily.id);
  const missions = getDailyWeeklyMissions(saveData);
  const categoryInsights = getCategoryInsights(saveData);
  const recentActivity = getRecentActivity(saveData);
  const totalStars = Object.values(stageStars).reduce((sum, star) => sum + star, 0);
  const collectionRate = Math.round((saveData.unlockedUnits.length / UNIT_CATALOG.length) * 100);
  const allNormalCleared = normalStages.every((stage) => clearedStages.has(stage.id));

  const worlds = useMemo<StageWorld[]>(() => {
    const ids = [...new Set(normalStages.map((s) => s.world).filter((w): w is number => typeof w === "number"))].sort(
      (a, b) => a - b,
    );
    return ids.map((worldId, index) => {
      const stagesInWorld = normalStages.filter((s) => s.world === worldId);
      const previousWorldStages = index === 0 ? [] : normalStages.filter((s) => s.world === ids[index - 1]);
      const clearedCount = stagesInWorld.filter((s) => clearedStages.has(s.id)).length;
      const stars = stagesInWorld.reduce((sum, s) => sum + (stageStars[s.id] ?? 0), 0);
      const maxStars = stagesInWorld.length * 3;
      const unlocked = index === 0 || previousWorldStages.every((s) => clearedStages.has(s.id));
      return { meta: WORLD_THEME_META[worldId], worldId, stages: stagesInWorld, clearedCount, stars, maxStars, unlocked };
    });
  }, [clearedStages, stageStars]);

  const toggleWorld = (worldId: number) => {
    setExpandedWorldId((prev) => (prev === worldId ? null : worldId));
  };

  const toggleEx = () => {
    setShowEX((prev) => !prev);
  };

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
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
              謌ｻ繧・
            </button>
            <MuteButton />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={onProgress}
              style={{
                background: "rgba(52,211,153,0.15)",
                border: "1px solid rgba(52,211,153,0.4)",
                color: "#34d399",
                borderRadius: 999,
                padding: "7px 12px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: "bold",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span aria-hidden="true">投</span>
              <span>險倬鹸</span>
            </button>
            <button
              onClick={onAchievements}
              style={{
                background: "rgba(129,140,248,0.15)",
                border: "1px solid #818cf866",
                color: "#818cf8",
                borderRadius: 999,
                padding: "7px 12px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: "bold",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span aria-hidden="true">祷</span>
              <span>螳溽ｸｾ</span>
            </button>
            <div
              style={{
                background: "rgba(251,191,36,0.15)",
                border: "1px solid rgba(251,191,36,0.3)",
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: 14,
                fontWeight: "bold",
                color: "#fbbf24",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span aria-hidden="true">ｪ・</span>
              <span>{coins}</span>
            </div>
            <span style={{ color: "#fb923c", fontWeight: "bold", fontSize: 14 }}>🔥 {saveData.login.streak}日</span>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <SummaryCard label="騾｣邯壹Ο繧ｰ繧､繝ｳ" value={`${saveData.login.streak}譌･`} color="#38bdf8" />
          {(saveData.login.rescueCount ?? 0) > 0 && (
            <SummaryCard label="rescue" value={`x${saveData.login.rescueCount}`} color="#a78bfa" />
          )}
          <SummaryCard label="蝗ｳ髑鷹＃謌千紫" value={`${collectionRate}%`} color="#f59e0b" />
          <SummaryCard label="邱上せ繧ｿ繝ｼ" value={`${totalStars}`} color="#facc15" />
          <SummaryCard label="邏ｯ險域ｭ｣隗｣" value={`${saveData.totalCorrect}`} color="#4ade80" />
        </div>

        <div
          style={{
            background: "rgba(15,23,42,0.78)",
            border: "1px solid #334155",
            borderRadius: 14,
            padding: 6,
            display: "flex",
            gap: 8,
          }}
        >
          {[
            { key: "play", label: "繝励Ξ繧､", color: "#3b82f6" },
            { key: "growth", label: "謌宣聞", color: "#8b5cf6" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setHubView(item.key as HubView)}
              style={{
                flex: 1,
                minWidth: 0,
                padding: isMobile ? "10px 12px" : "11px 14px",
                borderRadius: 10,
                border: hubView === item.key ? `1px solid ${item.color}` : "1px solid transparent",
                background: hubView === item.key ? `${item.color}22` : "transparent",
                color: hubView === item.key ? "#fff" : "#94a3b8",
                cursor: "pointer",
                textAlign: "center",
                fontWeight: 800,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {hubView === "play" ? (
          <StageSelectPlayTab
            isMobile={isMobile}
            onParty={onParty}
            onGacha={onGacha}
            onDaily={onDaily}
            daily={daily}
            dailyDone={dailyDone}
            worlds={worlds}
            expandedWorldId={expandedWorldId}
            onToggleWorld={toggleWorld}
            clearedStages={clearedStages}
            stageStars={stageStars}
            onSelect={onSelect}
            allNormalCleared={allNormalCleared}
            showEX={showEX}
            onToggleEX={toggleEx}
          />
        ) : (
          <StageSelectGrowthTab
            isMobile={isMobile}
            missions={missions}
            onClaimMission={onClaimMission}
            categoryInsights={categoryInsights}
            insightView={insightView}
            onChangeInsightView={setInsightView}
            recentActivity={recentActivity}
          />
        )}
      </div>
    </div>
  );
}
