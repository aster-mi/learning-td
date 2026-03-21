import { useState } from "react";
import { getTodayChallenge, isDailyChallengeCompleted } from "../data/dailyChallenge";
import { getCategoryInsights, getDailyWeeklyMissions, getRecentActivity } from "../data/progression";
import type { SaveData } from "../data/saveData";
import { UNIT_CATALOG } from "../data/unitCatalog";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  stageStars: Record<number, number>;
  coins: number;
  saveData: SaveData;
  onBack: () => void;
  onDaily: () => void;
  onAchievements: () => void;
  onParty: () => void;
  onGacha: () => void;
  onWorldSelect: () => void;
  onClaimMission: (missionId: string, rewardCoins: number) => void;
}

type HubView = "play" | "growth";

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
  stageStars,
  coins,
  saveData,
  onBack,
  onDaily,
  onAchievements,
  onParty,
  onGacha,
  onWorldSelect,
  onClaimMission,
}: Props) {
  const { isMobile } = useWindowSize();
  const [hubView, setHubView] = useState<HubView>("play");

  const daily = getTodayChallenge();
  const dailyDone = isDailyChallengeCompleted(daily.id);
  const missions = getDailyWeeklyMissions(saveData);
  const categoryInsights = getCategoryInsights(saveData);
  const recentActivity = getRecentActivity(saveData);
  const totalStars = Object.values(stageStars).reduce((sum, star) => sum + star, 0);
  const collectionRate = Math.round((saveData.unlockedUnits.length / UNIT_CATALOG.length) * 100);

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

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
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
            borderRadius: 14,
            padding: 6,
            display: "flex",
            gap: 8,
            flexWrap: "nowrap",
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
              }}
            >
              <div style={{ fontWeight: 800 }}>{item.label}</div>
            </button>
          ))}
        </div>

        {hubView === "play" ? (
          <div style={{ display: "grid", gap: 16 }}>
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
                  desc="専用の画面でワールドごとの攻略状況を見ながら、挑戦先を選べます。"
                  icon="🗺"
                  gradient="linear-gradient(135deg, #2563eb, #0ea5e9)"
                  borderColor="#7dd3fc"
                  shadow="0 4px 16px rgba(14,165,233,0.28)"
                  onClick={onWorldSelect}
                />
                <MenuButton
                  title="パーティ編成 / 図鑑"
                  desc="出撃メンバーの調整や、図鑑達成率の確認ができます。"
                  icon="🛡"
                  gradient="linear-gradient(135deg, #0d9488, #14b8a6)"
                  borderColor="#2dd4bf"
                  shadow="0 4px 12px rgba(20,184,166,0.3)"
                  onClick={onParty}
                />
                <MenuButton
                  title="ガチャ"
                  desc="新しいユニットやコイン報酬を獲得して戦力を増やせます。"
                  icon="🎯"
                  gradient="linear-gradient(135deg, #b45309, #f59e0b)"
                  borderColor="#fbbf24"
                  shadow="0 4px 16px rgba(251,191,36,0.35)"
                  onClick={onGacha}
                />
              </div>
            </div>
          </div>
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
