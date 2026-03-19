import { useEffect, useState } from "react";
import type { Achievement } from "../data/achievements";

interface Props {
  achievements: Achievement[];
  onDone: () => void;
}

export function AchievementToast({ achievements, onDone }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (currentIdx >= achievements.length) {
      onDone();
      return;
    }
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => setCurrentIdx(i => i + 1), 400);
    }, 2500);
    return () => clearTimeout(timer);
  }, [currentIdx, achievements.length, onDone]);

  if (currentIdx >= achievements.length) return null;
  const a = achievements[currentIdx];

  return (
    <div style={{
      position: "fixed",
      top: 60, left: "50%",
      transform: `translateX(-50%) translateY(${show ? "0" : "-80px"})`,
      opacity: show ? 1 : 0,
      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      zIndex: 300,
      pointerEvents: "none",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1e1b4b, #312e81)",
        border: "2px solid #818cf8",
        borderRadius: 12,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 8px 32px rgba(129,140,248,0.3)",
        minWidth: 260,
      }}>
        <span style={{ fontSize: 32 }}>{a.emoji}</span>
        <div>
          <div style={{ fontSize: 11, color: "#818cf8", fontWeight: "bold", letterSpacing: 1 }}>
            🏆 実績解除！
          </div>
          <div style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
            {a.title}
          </div>
          <div style={{ fontSize: 12, color: "#a5b4fc" }}>
            {a.desc}
          </div>
        </div>
      </div>
    </div>
  );
}
