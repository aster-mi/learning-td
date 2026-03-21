import { useEffect, useMemo, useRef, useState } from "react";
import type { CategoryInsight } from "../data/progression";
import { getTodayChallenge, isDailyChallengeCompleted } from "../data/dailyChallenge";
import { getCategoryInsights, getDailyWeeklyMissions, getRecentActivity } from "../data/progression";
import type { SaveData } from "../data/saveData";
import { exStages, normalStages, WORLD_THEME_META } from "../data/stages";
import { UNIT_CATALOG } from "../data/unitCatalog";
import { useWindowSize } from "../hooks/useWindowSize";
import { MuteButton } from "../components/MuteButton";

interface Props {
  stageStars: Record<number, number>;
  clearedStages: Set<number>;
  coins: number;
  saveData: SaveData;
  onBack: () => void;
  onDaily: () => void;
  onAchievements: () => void;
  onParty: () => void;
  onGacha: () => void;
  onSelect: (stageId: number) => void;
  onClaimMission: (missionId: string, rewardCoins: number) => void;
}

type HubView = "play" | "growth";

/* ── tiny sub-components ──────────────────────────────────── */

function StarDisplay({ count }: { count: number }) {
  return (
    <span style={{ color: "#facc15", fontSize: 12 }}>
      {"★".repeat(count)}
      <span style={{ color: "#475569" }}>{"★".repeat(Math.max(0, 3 - count))}</span>
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

/* ── radar chart ──────────────────────────────────────────── */

function RadarChart({ data }: { data: CategoryInsight[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const items = data.length > 0 ? data : [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const margin = 60; // space for labels around the chart
    const R = 90;
    const W = R * 2 + margin * 2;
    const H = W;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2;
    const n = items.length;
    const angleStep = (Math.PI * 2) / n;
    const startAngle = -Math.PI / 2; // top

    ctx.clearRect(0, 0, W, H);

    // draw grid rings
    for (let ring = 1; ring <= 4; ring++) {
      const r = (R * ring) / 4;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = startAngle + angleStep * (i % n);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = ring === 4 ? "#334155" : "#1e293b";
      ctx.lineWidth = 1;
      ctx.stroke();
      // percentage label
      if (ring < 4) {
        ctx.fillStyle = "#475569";
        ctx.font = "9px system-ui";
        ctx.textAlign = "left";
        ctx.fillText(`${ring * 25}%`, cx + 3, cy - (R * ring) / 4 + 3);
      }
    }

    // draw axis lines
    for (let i = 0; i < n; i++) {
      const angle = startAngle + angleStep * i;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // draw data polygon
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const idx = i % n;
      const angle = startAngle + angleStep * idx;
      const val = Math.max(0.04, items[idx].accuracy);
      const x = cx + Math.cos(angle) * R * val;
      const y = cy + Math.sin(angle) * R * val;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    // fill gradient
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    grad.addColorStop(0, "rgba(34,211,238,0.25)");
    grad.addColorStop(1, "rgba(129,140,248,0.15)");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.stroke();

    // draw data points + labels
    for (let i = 0; i < n; i++) {
      const angle = startAngle + angleStep * i;
      const val = Math.max(0.04, items[i].accuracy);
      const px = cx + Math.cos(angle) * R * val;
      const py = cy + Math.sin(angle) * R * val;

      // dot
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = items[i].color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // label
      const labelR = R + 16;
      const lx = cx + Math.cos(angle) * labelR;
      const ly = cy + Math.sin(angle) * labelR;
      ctx.font = "bold 11px system-ui";
      ctx.fillStyle = items[i].color;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      ctx.textAlign = Math.abs(cosA) < 0.15 ? "center" : cosA > 0 ? "left" : "right";
      ctx.textBaseline = Math.abs(sinA) < 0.15 ? "middle" : sinA > 0 ? "top" : "bottom";
      ctx.fillText(`${items[i].emoji}${items[i].name}`, lx, ly);

      // accuracy value below/above label
      const total = items[i].correct + items[i].wrong;
      if (total > 0) {
        ctx.font = "10px system-ui";
        ctx.fillStyle = "#e2e8f0";
        const valY = sinA >= 0 ? ly + 13 : ly - 13;
        ctx.fillText(`${Math.round(items[i].accuracy * 100)}%`, lx, valY);
      }
    }
  }, [items]);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
      <canvas ref={canvasRef} aria-label="カテゴリ別正答率レーダーチャート" style={{ maxWidth: "100%" }} />
    </div>
  );
}

/* ── main component ───────────────────────────────────────── */

export function StageSelect({
  stageStars,
  clearedStages,
  coins,
  saveData,
  onBack,
  onDaily,
  onAchievements,
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

  const worlds = useMemo(() => {
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
        {/* ── header ── */}
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
              戻る
            </button>
            <MuteButton />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
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
              <span aria-hidden="true">📘</span>
              <span>実績</span>
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
              <span aria-hidden="true">🪙</span>
              <span>{coins}</span>
            </div>
          </div>
        </div>

        {/* ── summary pills ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <SummaryCard label="連続ログイン" value={`${saveData.login.streak}日`} color="#38bdf8" />
          <SummaryCard label="図鑑達成率" value={`${collectionRate}%`} color="#f59e0b" />
          <SummaryCard label="総スター" value={`${totalStars}`} color="#facc15" />
          <SummaryCard label="累計正解" value={`${saveData.totalCorrect}`} color="#4ade80" />
        </div>

        {/* ── tab switch ── */}
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
            { key: "play", label: "プレイ", color: "#3b82f6" },
            { key: "growth", label: "成長", color: "#8b5cf6" },
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

        {/* ─────────────── PLAY TAB ─────────────── */}
        {hubView === "play" ? (
          <div style={{ display: "grid", gap: 16 }}>
            {/* ── top row: party + gacha ── */}
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
                <span style={{ fontSize: isMobile ? 22 : 24 }}>🛡</span>
                パーティ
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
                <span style={{ fontSize: isMobile ? 22 : 24 }}>🎯</span>
                ガチャ
              </button>
            </div>

            {/* ── daily challenge ── */}
            <button
              onClick={onDaily}
              disabled={dailyDone}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "14px 18px",
                background: dailyDone
                  ? "rgba(30,41,59,0.6)"
                  : "linear-gradient(135deg, #312e81, #4c1d95)",
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
                  {dailyDone ? "クリア済み" : `+${daily.bonusCoins} コイン`}
                </div>
              </div>
            </button>

            {/* ── world cards ── */}
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
                    {/* world header (clickable) */}
                    <button
                      onClick={() => world.unlocked && toggleWorld(world.worldId)}
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
                            <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900 }}>
                              {world.meta.name}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                          {world.unlocked ? (
                            <>
                              <div style={{ textAlign: "right", minWidth: 50 }}>
                                <div style={{ fontSize: 11, color: "#94a3b8" }}>クリア</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: allCleared ? "#4ade80" : "#e2e8f0" }}>
                                  {world.clearedCount}/{world.stages.length}
                                </div>
                              </div>
                              <div style={{ textAlign: "right", minWidth: 40 }}>
                                <div style={{ fontSize: 11, color: "#94a3b8" }}>★</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: "#facc15" }}>
                                  {world.stars}
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: 16,
                                  color: world.meta.accent,
                                  transition: "transform 0.3s ease",
                                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                }}
                              >
                                ▼
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

                      {/* progress bar */}
                      {world.unlocked && (
                        <div style={{ marginTop: 10 }}>
                          <ProgressBar value={world.clearedCount} max={world.stages.length} color={world.meta.accent} />
                        </div>
                      )}
                    </button>

                    {/* expanded stage list */}
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
                                background: stageUnlocked
                                  ? "rgba(15,23,42,0.7)"
                                  : "rgba(15,23,42,0.35)",
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
                                    {stageUnlocked ? (cleared ? "✓" : index + 1) : "🔒"}
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
                                    background: stageUnlocked
                                      ? cleared
                                        ? "#14532d"
                                        : world.meta.accent
                                      : "#334155",
                                    color: stageUnlocked
                                      ? "#fff"
                                      : "#64748b",
                                    flexShrink: 0,
                                  }}
                                >
                                  {!stageUnlocked ? "LOCK" : cleared ? "再挑戦" : "挑戦"}
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

              {/* ── EX stages ── */}
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
                  onClick={() => allNormalCleared && setShowEX((prev) => !prev)}
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
                        <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900 }}>
                          高難度チャレンジ
                        </div>
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
                        ▼
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
                        全クリアで解放
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
                                {cleared ? "✓" : "!"}
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
                              {cleared ? "再挑戦" : "挑戦"}
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
        ) : (
          /* ─────────────── GROWTH TAB ─────────────── */
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>得意・苦手</div>
                  <div style={{
                    display: "flex", background: "rgba(15,23,42,0.6)", borderRadius: 8,
                    border: "1px solid #334155", overflow: "hidden",
                  }}>
                    <button
                      onClick={() => setInsightView("bar")}
                      style={{
                        background: insightView === "bar" ? "rgba(129,140,248,0.2)" : "transparent",
                        border: "none", padding: "4px 10px", cursor: "pointer",
                        fontSize: 11, fontWeight: insightView === "bar" ? 700 : 500,
                        color: insightView === "bar" ? "#c7d2fe" : "#64748b",
                      }}
                    >
                      バー
                    </button>
                    <button
                      onClick={() => setInsightView("radar")}
                      style={{
                        background: insightView === "radar" ? "rgba(34,211,238,0.2)" : "transparent",
                        border: "none", padding: "4px 10px", cursor: "pointer",
                        fontSize: 11, fontWeight: insightView === "radar" ? 700 : 500,
                        color: insightView === "radar" ? "#67e8f9" : "#64748b",
                      }}
                    >
                      レーダー
                    </button>
                  </div>
                </div>

                {insightView === "bar" ? (
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
                ) : (
                  <RadarChart data={categoryInsights} />
                )}
              </div>

              <div
                style={{
                  background: "rgba(15,23,42,0.78)",
                  border: "1px solid #334155",
                  borderRadius: 16,
                  padding: "16px",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>直近7日の学習</div>
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
