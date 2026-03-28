import { useEffect, useState } from "react";
import type { StreakMilestone } from "../data/progression";

interface Props {
  milestone: StreakMilestone;
  onClose: () => void;
}

export function MilestoneBadgeModal({ milestone, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 310,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#0f172a",
          border: "1px solid #fbbf24",
          borderRadius: 16,
          padding: 24,
          textAlign: "center",
          display: "grid",
          gap: 16,
          transform: mounted ? "scale(1)" : "scale(0.8)",
          opacity: mounted ? 1 : 0,
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#818cf8",
            fontWeight: "bold",
            letterSpacing: 1,
          }}
        >
          🎉 節目達成！
        </div>
        <div style={{ fontSize: 64 }}>{milestone.badge}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#fbbf24" }}>
          「{milestone.title}」
        </div>
        <div style={{ fontSize: 14, color: "#94a3b8" }}>
          🔥 {milestone.days}日連続ログイン達成！
        </div>
        <button
          onClick={onClose}
          style={{
            background: "#4f46e5",
            border: "none",
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            width: "100%",
            cursor: "pointer",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
