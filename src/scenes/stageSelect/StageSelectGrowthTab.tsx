import { useEffect, useRef } from "react";
import type { CategoryInsight, MissionDef } from "../../data/progression";

interface RecentActivityEntry {
  key: string;
  label: string;
  correct: number;
  wrong: number;
  plays: number;
}

interface StageSelectGrowthTabProps {
  isMobile: boolean;
  missions: MissionDef[];
  onClaimMission: (missionId: string, rewardCoins: number) => void;
  categoryInsights: CategoryInsight[];
  insightView: "bar" | "radar";
  onChangeInsightView: (view: "bar" | "radar") => void;
  recentActivity: RecentActivityEntry[];
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

function RadarChart({ data }: { data: CategoryInsight[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const items = data.length > 0 ? data : [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const margin = 60;
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
    const startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, W, H);

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
      if (ring < 4) {
        ctx.fillStyle = "#475569";
        ctx.font = "9px system-ui";
        ctx.textAlign = "left";
        ctx.fillText(`${ring * 25}%`, cx + 3, cy - (R * ring) / 4 + 3);
      }
    }

    for (let i = 0; i < n; i++) {
      const angle = startAngle + angleStep * i;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

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
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    grad.addColorStop(0, "rgba(34,211,238,0.25)");
    grad.addColorStop(1, "rgba(129,140,248,0.15)");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < n; i++) {
      const angle = startAngle + angleStep * i;
      const val = Math.max(0.04, items[i].accuracy);
      const px = cx + Math.cos(angle) * R * val;
      const py = cy + Math.sin(angle) * R * val;

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = items[i].color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

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
      <canvas ref={canvasRef} aria-label="繧ｫ繝・ざ繝ｪ蛻･豁｣遲皮紫繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝・" style={{ maxWidth: "100%" }} />
    </div>
  );
}

export function StageSelectGrowthTab({
  isMobile,
  missions,
  onClaimMission,
  categoryInsights,
  insightView,
  onChangeInsightView,
  recentActivity,
}: StageSelectGrowthTabProps) {
  return (
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
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>繝溘ャ繧ｷ繝ｧ繝ｳ</div>
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
                      ? "蜿怜叙貂医∩"
                      : completed
                        ? `蜿怜叙 +${mission.rewardCoins}`
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
            <div style={{ fontSize: 18, fontWeight: 800 }}>蠕玲э繝ｻ闍ｦ謇・</div>
            <div
              style={{
                display: "flex",
                background: "rgba(15,23,42,0.6)",
                borderRadius: 8,
                border: "1px solid #334155",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => onChangeInsightView("bar")}
                style={{
                  background: insightView === "bar" ? "rgba(129,140,248,0.2)" : "transparent",
                  border: "none",
                  padding: "4px 10px",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: insightView === "bar" ? 700 : 500,
                  color: insightView === "bar" ? "#c7d2fe" : "#64748b",
                }}
              >
                繝舌・
              </button>
              <button
                onClick={() => onChangeInsightView("radar")}
                style={{
                  background: insightView === "radar" ? "rgba(34,211,238,0.2)" : "transparent",
                  border: "none",
                  padding: "4px 10px",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: insightView === "radar" ? 700 : 500,
                  color: insightView === "radar" ? "#67e8f9" : "#64748b",
                }}
              >
                繝ｬ繝ｼ繝繝ｼ
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
                      {item.correct + item.wrong > 0 ? `${Math.round(item.accuracy * 100)}%` : "譛ｪ繝励Ξ繧､"}
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
                    豁｣隗｣ {item.correct} / 荳肴ｭ｣隗｣ {item.wrong}
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
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>逶ｴ霑・譌･縺ｮ蟄ｦ鄙・</div>
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
  );
}
