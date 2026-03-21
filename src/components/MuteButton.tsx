import { useState } from "react";
import { isMuted, setMuted } from "../audio/SoundManager";

export function MuteButton({ style }: { style?: React.CSSProperties }) {
  const [muted, setMutedState] = useState(isMuted());

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "サウンドON" : "サウンドOFF"}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid #334155",
        borderRadius: 8,
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 16,
        color: muted ? "#64748b" : "#e2e8f0",
        ...style,
      }}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
