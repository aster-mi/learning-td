import { useState } from "react";
import type { SaveData } from "../data/saveData";
import { SUB_CATEGORIES } from "../data/questions";
import { exStages, normalStages } from "../data/stages";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  saveData: SaveData;
  onClose: () => void;
}

type Tab = "summary" | "stages" | "categories";

function pct(correct: number, wrong: number): string {
  if (correct + wrong === 0) return "--";
  return `${Math.round((correct / (correct + wrong)) * 100)}%`;
}

function StarDisplay({ count }: { count: number }) {
  return (
    <span>
      <span style={{ color: "#facc15" }}>{"★".repeat(count)}</span>
      <span style={{ color: "#475569" }}>{"★".repeat(Math.max(0, 3 - count))}</span>
    </span>
  );
}

export function ProgressScreen({ saveData, onClose }: Props) {
  const { isMobile } = useWindowSize();
  const [tab, setTab] = useState<Tab>("summary");

  const totalCorrect = saveData.totalCorrect;
  const totalWrong = saveData.totalWrong;
  const allStages = [...normalStages, ...exStages];

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "8px 0",
    background: active ? "#4f46e5" : "transparent",
    border: "none",
    color: active ? "#fff" : "#94a3b8",
    fontWeight: active ? "bold" : "normal",
    fontSize: 13,
    cursor: "pointer",
    borderRadius: 6,
    transition: "background 0.2s",
  });

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
        <span style={{ fontSize: 20, fontWeight: "bold" }}>📊 記録</span>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 4,
        padding: "8px 16px",
        background: "#0f172a",
        borderBottom: "1px solid #1e293b",
        flexShrink: 0,
      }}>
        <button style={tabStyle(tab === "summary")} onClick={() => setTab("summary")}>概要</button>
        <button style={tabStyle(tab === "stages")} onClick={() => setTab("stages")}>ステージ</button>
        <button style={tabStyle(tab === "categories")} onClick={() => setTab("categories")}>カテゴリ</button>
      </div>

      {/* Content */}
      <div style={{ padding: "16px", flex: 1 }}>

        {/* 概要タブ */}
        {tab === "summary" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: 12,
          }}>
            {[
              { label: "正解数", value: totalCorrect.toLocaleString(), color: "#34d399" },
              { label: "不正解数", value: totalWrong.toLocaleString(), color: "#f87171" },
              { label: "正答率", value: pct(totalCorrect, totalWrong), color: "#818cf8" },
              { label: "最大コンボ", value: saveData.maxCombo.toLocaleString(), color: "#fbbf24" },
              { label: "ログイン連続", value: `${saveData.login.streak}日`, color: "#60a5fa" },
              { label: "rescue", value: (saveData.login.rescueCount ?? 0) > 0 ? `x${saveData.login.rescueCount}` : "なし", color: (saveData.login.rescueCount ?? 0) > 0 ? "#a78bfa" : "#475569" },
              { label: "コイン", value: saveData.coins.toLocaleString(), color: "#fbbf24" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex", flexDirection: "column", gap: 4,
              }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: "bold", color }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {/* ステージタブ */}
        {tab === "stages" && (
          <div style={{ display: "grid", gap: 6 }}>
            {allStages.map(stage => {
              const stars = saveData.stageStars[stage.id] ?? 0;
              return (
                <div key={stage.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                }}>
                  <span style={{ color: "#e2e8f0" }}>
                    {stage.isEX ? "EX" : `S${stage.id}`} {stage.name}
                  </span>
                  <StarDisplay count={stars} />
                </div>
              );
            })}
          </div>
        )}

        {/* カテゴリタブ */}
        {tab === "categories" && (
          <div style={{ display: "grid", gap: 10 }}>
            {SUB_CATEGORIES.map(sub => {
              const stats = saveData.categoryStats[sub.name] ?? { correct: 0, wrong: 0 };
              const rate = stats.correct + stats.wrong === 0
                ? 0
                : (stats.correct / (stats.correct + stats.wrong)) * 100;
              return (
                <div key={sub.name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cbd5e1",
                  }}>
                    <span>{sub.emoji} {sub.name}</span>
                    <span style={{ color: sub.color }}>{pct(stats.correct, stats.wrong)}</span>
                  </div>
                  <div style={{ height: 6, background: "#1e293b", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${rate}%`,
                      background: `linear-gradient(90deg, ${sub.color}, ${sub.color}aa)`,
                      borderRadius: 999,
                      transition: "width 0.3s",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
